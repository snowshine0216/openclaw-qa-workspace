import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type NodeTypes,
} from '@xyflow/react';

import type { TestCaseRow, TestKeyPointsDocument } from '../shared/model/testKeyPointTypes';
import {
  addCaseToSection,
  addSection,
  moveCaseToSection,
  removeCase,
  updateCaseFields,
  updateSectionTitle,
} from '../shared/graph/fromGraphEdits';
import { toGraphModel, type GraphNode } from '../shared/graph/toGraphModel';
import { loadFeatureDocument, saveFeatureDocument } from './api/clientApi';
import { CategoryNode } from './components/CategoryNode';
import { CheckpointNode } from './components/CheckpointNode';
import { ResultNode } from './components/ResultNode';
import { RootNode } from './components/RootNode';
import { StepNode } from './components/StepNode';
import { TouchingBezierEdge } from './components/TouchingBezierEdge';

const DEFAULT_FEATURE = (import.meta.env.VITE_DEFAULT_FEATURE as string | undefined) || 'BCIN-6709';

const EDGE_TYPES = {
  straight: TouchingBezierEdge,
};
const AUTO_SAVE_DELAY_MS = 900;

const NODE_TYPES = {
  rootNode: RootNode,
  categoryNode: CategoryNode,
  checkpointNode: CheckpointNode,
  stepNode: StepNode,
  resultNode: ResultNode,
} as NodeTypes;

type SaveState = {
  message: string;
  changed: boolean;
};

type SelectedTarget =
  | { kind: 'none' }
  | { kind: 'root' }
  | { kind: 'category'; sectionId: string }
  | { kind: 'case'; sectionId: string; caseId: string };

function findCase(document: TestKeyPointsDocument | null, caseId: string | null): TestCaseRow | null {
  if (!document || !caseId) {
    return null;
  }

  for (const section of document.sections) {
    const row = section.cases.find((item) => item.id === caseId);
    if (row) {
      return row;
    }
  }

  return null;
}

function findSectionIdForCase(document: TestKeyPointsDocument | null, caseId: string | null): string | null {
  if (!document || !caseId) {
    return null;
  }
  const section = document.sections.find((item) => item.cases.some((row) => row.id === caseId));
  return section?.id ?? null;
}

function selectFirstAvailableTarget(document: TestKeyPointsDocument): SelectedTarget {
  for (const section of document.sections) {
    const firstCase = section.cases[0];
    if (firstCase) {
      return { kind: 'case', sectionId: section.id, caseId: firstCase.id };
    }
  }

  const firstSection = document.sections[0];
  return firstSection ? { kind: 'category', sectionId: firstSection.id } : { kind: 'none' };
}

function AppContent() {
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  const [featureInput, setFeatureInput] = useState(DEFAULT_FEATURE);
  const [activeFeatureId, setActiveFeatureId] = useState(DEFAULT_FEATURE);
  const [sourcePath, setSourcePath] = useState('');
  const [document, setDocument] = useState<TestKeyPointsDocument | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<SelectedTarget>({ kind: 'none' });
  const [status, setStatus] = useState<SaveState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draftVersion, setDraftVersion] = useState(0);
  const [savedVersion, setSavedVersion] = useState(0);
  const [categoryTitleInput, setCategoryTitleInput] = useState('');

  const dirty = draftVersion !== savedVersion;

  const selectedCaseId = selectedTarget.kind === 'case' ? selectedTarget.caseId : null;
  const selectedCase = useMemo(() => findCase(document, selectedCaseId), [document, selectedCaseId]);
  const selectedSectionId = useMemo(() => {
    if (!document) {
      return null;
    }
    if (selectedTarget.kind === 'category') {
      return selectedTarget.sectionId;
    }
    if (selectedTarget.kind === 'case') {
      return findSectionIdForCase(document, selectedTarget.caseId) ?? selectedTarget.sectionId;
    }
    return findSectionIdForCase(document, selectedCaseId) ?? document.sections[0]?.id ?? null;
  }, [document, selectedTarget, selectedCaseId]);

  const selectedCategory = useMemo(() => {
    if (!document || selectedTarget.kind !== 'category') {
      return null;
    }

    return document.sections.find((section) => section.id === selectedTarget.sectionId) ?? null;
  }, [document, selectedTarget]);

  const { nodes, edges } = useMemo(() => {
    if (!document) {
      return { nodes: [] as GraphNode[], edges: [] };
    }
    return toGraphModel(document);
  }, [document]);

  const addButtonLabel =
    selectedTarget.kind === 'none' || selectedTarget.kind === 'root' ? 'Add Category' : 'Add Subtopic';

  const applyDocumentEdit = useCallback((nextDocument: TestKeyPointsDocument) => {
    setDocument(nextDocument);
    setDraftVersion((value) => value + 1);
    setStatus({ message: 'Pending auto-save…', changed: true });
    setError(null);
  }, []);

  const loadFeature = useCallback(async (featureId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await loadFeatureDocument(featureId);
      setDocument(response.document);
      setActiveFeatureId(featureId);
      setSourcePath(response.sourcePath);
      setSelectedTarget(selectFirstAvailableTarget(response.document));

      setDraftVersion(0);
      setSavedVersion(0);
      setStatus({ message: `Loaded ${featureId}`, changed: false });
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load feature.');
      setStatus(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadFeature(DEFAULT_FEATURE);
  }, [loadFeature]);

  const saveDocumentNow = useCallback(
    async (nextDocument: TestKeyPointsDocument, versionToSave: number) => {
      if (saving) {
        return;
      }

      setSaving(true);
      setError(null);

      try {
        const response = await saveFeatureDocument(activeFeatureId, nextDocument);
        setDocument(response.document);
        setSavedVersion((value) => Math.max(value, versionToSave));

        const result = response.saveResult;
        const backupNote = result.changed && result.backupPath ? `Backup: ${result.backupPath}` : 'No backup needed';
        setStatus({
          changed: result.changed,
          message: `${result.changed ? 'Saved.' : 'No changes.'} ${backupNote}`,
        });
      } catch (saveError) {
        setError(saveError instanceof Error ? saveError.message : 'Failed to save document.');
      } finally {
        setSaving(false);
      }
    },
    [activeFeatureId, saving],
  );

  useEffect(() => {
    if (!document || !dirty || saving) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      void saveDocumentNow(document, draftVersion);
    }, AUTO_SAVE_DELAY_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [document, dirty, saving, saveDocumentNow, draftVersion]);

  const onNodeClick = useCallback(
    (_event: unknown, node: GraphNode) => {
      if (node.data.kind === 'root') {
        setSelectedTarget({ kind: 'root' });
        return;
      }

      if (node.data.kind === 'category') {
        setSelectedTarget({ kind: 'category', sectionId: node.data.sectionId });
        return;
      }

      if (node.data.kind === 'checkpoint') {
        setSelectedTarget({
          kind: 'case',
          sectionId: node.data.sectionId,
          caseId: node.data.caseId,
        });
        return;
      }

      if (node.data.kind === 'steps' || node.data.kind === 'result') {
        const sectionId = findSectionIdForCase(document, node.data.caseId);
        if (sectionId) {
          setSelectedTarget({ kind: 'case', sectionId, caseId: node.data.caseId });
        }
      }
    },
    [document],
  );

  const updateSelectedCase = useCallback(
    (patch: Parameters<typeof updateCaseFields>[2]) => {
      if (!document || !selectedCaseId) {
        return;
      }
      const next = updateCaseFields(document, selectedCaseId, patch);
      applyDocumentEdit(next);
    },
    [document, selectedCaseId, applyDocumentEdit],
  );

  const moveSelectedCase = useCallback(
    (targetSectionId: string) => {
      if (!document || !selectedCaseId) {
        return;
      }
      const next = moveCaseToSection(document, selectedCaseId, targetSectionId);
      applyDocumentEdit(next);
      setSelectedTarget({ kind: 'case', sectionId: targetSectionId, caseId: selectedCaseId });
    },
    [document, selectedCaseId, applyDocumentEdit],
  );

  const commitCategoryRename = useCallback(() => {
    if (!document || !selectedCategory) {
      return;
    }

    const nextTitle = categoryTitleInput.trim();
    if (!nextTitle) {
      setCategoryTitleInput(selectedCategory.title);
      setError('Category name cannot be empty.');
      return;
    }

    if (nextTitle === selectedCategory.title) {
      setError(null);
      return;
    }

    const next = updateSectionTitle(document, selectedCategory.id, nextTitle);
    applyDocumentEdit(next);
    setError(null);
  }, [applyDocumentEdit, categoryTitleInput, document, selectedCategory]);

  useEffect(() => {
    setCategoryTitleInput(selectedCategory?.title ?? '');
  }, [selectedCategory]);

  const addTopic = useCallback(() => {
    if (!document) {
      return;
    }

    if (selectedTarget.kind === 'none' || selectedTarget.kind === 'root') {
      const result = addSection(document);
      applyDocumentEdit(result.document);

      const newSection = result.document.sections.find((section) => section.id === result.sectionId);
      const newCase = newSection?.cases[0];

      if (newCase) {
        setSelectedTarget({ kind: 'case', sectionId: result.sectionId, caseId: newCase.id });
      } else {
        setSelectedTarget({ kind: 'category', sectionId: result.sectionId });
      }
      return;
    }

    const targetSectionId =
      selectedTarget.kind === 'category' ? selectedTarget.sectionId : selectedTarget.sectionId;

    const result = addCaseToSection(document, targetSectionId);
    applyDocumentEdit(result.document);

    if (result.caseId) {
      setSelectedTarget({ kind: 'case', sectionId: targetSectionId, caseId: result.caseId });
    }
  }, [document, selectedTarget, applyDocumentEdit]);

  const deleteCase = useCallback(() => {
    if (!document || !selectedCaseId) {
      return;
    }

    const next = removeCase(document, selectedCaseId);
    applyDocumentEdit(next);
    setSelectedTarget(selectFirstAvailableTarget(next));
  }, [document, selectedCaseId, applyDocumentEdit]);

  return (
    <div className="page-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Interactive QA Mapping</p>
          <h1>Test Key Points Graph Editor</h1>
          <p className="subtitle">XMind-style category to step flow with section-limited markdown rewrite.</p>
        </div>

        <div className="header-controls">
          <label htmlFor="feature-id">Feature ID</label>
          <div className="feature-row">
            <input
              id="feature-id"
              value={featureInput}
              onChange={(event) => setFeatureInput(event.target.value.trim().toUpperCase())}
            />
            <button type="button" disabled={loading} onClick={() => void loadFeature(featureInput)}>
              {loading ? 'Loading…' : 'Load'}
            </button>
          </div>
          <p className="source-path">{sourcePath || 'No source loaded'}</p>
        </div>
      </header>

      <main className="app-main">
        <section className="graph-panel">
          <div className="panel-toolbar">
            <div className="status-stack">
              <span className={`status-pill ${dirty ? 'dirty' : 'clean'}`}>
                {dirty ? 'Unsaved changes' : 'In sync'}
              </span>
              {saving ? <span className="status-pill saving">Saving…</span> : null}
              {status ? <span className="status-text">{status.message}</span> : null}
            </div>

            <div className="panel-actions">
              <button type="button" onClick={addTopic} disabled={!document}>
                {addButtonLabel}
              </button>
              <button type="button" className="danger" onClick={deleteCase} disabled={!selectedCaseId}>
                Delete Case
              </button>
              <button type="button" className="ghost" onClick={() => void zoomOut({ duration: 180 })}>
                Zoom Out
              </button>
              <button type="button" className="ghost" onClick={() => void zoomIn({ duration: 180 })}>
                Zoom In
              </button>
              <button type="button" className="ghost" onClick={() => void fitView({ duration: 220, padding: 0.12 })}>
                Fit
              </button>
            </div>
          </div>

          <div className="flow-shell">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={NODE_TYPES}
              edgeTypes={EDGE_TYPES}
              defaultEdgeOptions={{
                type: 'straight',
                style: { stroke: '#ef4e19', strokeWidth: 3.8 },
              }}
              fitView
              fitViewOptions={{ padding: 0.12 }}
              onNodeClick={onNodeClick}
              onPaneClick={() => setSelectedTarget({ kind: 'none' })}
              minZoom={0.12}
              maxZoom={2.2}
            >
              <Background gap={20} color="rgba(9, 55, 68, 0.11)" />
              <MiniMap pannable zoomable />
              <Controls showInteractive={false} />
            </ReactFlow>
          </div>
          {error ? <p className="error-message">{error}</p> : null}
        </section>

        <aside className="editor-panel">
          {selectedCategory && document ? (
            <form className="editor-form" onSubmit={(event) => event.preventDefault()}>
              <h2>Category Editor</h2>
              <label>
                Category Name
                <input
                  type="text"
                  value={categoryTitleInput}
                  onChange={(event) => {
                    setCategoryTitleInput(event.target.value);
                    setError(null);
                  }}
                  onBlur={commitCategoryRename}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      commitCategoryRename();
                    }
                  }}
                />
              </label>
            </form>
          ) : selectedCase && document ? (
            <form className="editor-form" onSubmit={(event) => event.preventDefault()}>
              <h2>Case Editor</h2>
              <label>
                Priority
                <select
                  value={selectedCase.priority}
                  onChange={(event) => updateSelectedCase({ priority: event.target.value })}
                >
                  <option value="P0">P0</option>
                  <option value="P1">P1</option>
                  <option value="P2">P2</option>
                  <option value="P3">P3</option>
                </select>
              </label>

              <label>
                Move To Section
                <select
                  value={selectedSectionId ?? ''}
                  onChange={(event) => {
                    moveSelectedCase(event.target.value);
                    setError(null);
                  }}
                >
                  {document.sections.map((section) => (
                    <option key={section.id} value={section.id}>
                      {section.title}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Related Code Change
                <textarea
                  rows={4}
                  value={selectedCase.relatedCodeChange}
                  onChange={(event) => updateSelectedCase({ relatedCodeChange: event.target.value })}
                />
              </label>

              <label>
                Acceptance Criteria
                <textarea
                  rows={4}
                  value={selectedCase.acceptanceCriteria}
                  onChange={(event) => updateSelectedCase({ acceptanceCriteria: event.target.value })}
                />
              </label>

              <label>
                Test Key Points
                <textarea
                  rows={5}
                  value={selectedCase.testKeyPoints}
                  onChange={(event) => updateSelectedCase({ testKeyPoints: event.target.value })}
                />
              </label>

              <label>
                Expected Results
                <textarea
                  rows={5}
                  value={selectedCase.expectedResults}
                  onChange={(event) => updateSelectedCase({ expectedResults: event.target.value })}
                />
              </label>
            </form>
          ) : (
            <>
              <h2>Case Editor</h2>
              <p className="placeholder">
                Select a checkpoint/step/result node to edit the case details. Select a category node to rename it.
              </p>
            </>
          )}
        </aside>
      </main>
    </div>
  );
}

export function App() {
  return (
    <ReactFlowProvider>
      <AppContent />
    </ReactFlowProvider>
  );
}
