import express from 'express';

import { QaPlanFileRepository, defaultWorkspaceRoot } from '../shared/io/fileRepository';
import { documentSchema, validateRequiredColumns } from '../shared/validation/testKeyPointSchema';

const app = express();
const port = Number(process.env.PORT || 4174);
const workspaceRoot = process.env.WORKSPACE_ROOT || defaultWorkspaceRoot();
const repository = new QaPlanFileRepository(workspaceRoot);

app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, workspaceRoot });
});

app.get('/api/features/:featureId/test-key-points', async (req, res) => {
  try {
    const { featureId } = req.params;
    const result = await repository.load(featureId);
    res.json({
      sourcePath: result.sourcePath,
      featureId,
      document: result.document,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(400).json({ error: message });
  }
});

app.put('/api/features/:featureId/test-key-points', async (req, res) => {
  try {
    const { featureId } = req.params;
    const parsed = documentSchema.parse(req.body.document ?? {});

    if (parsed.featureId !== featureId) {
      throw new Error(`Feature id mismatch: body=${parsed.featureId}, route=${featureId}`);
    }

    const columnIssues = validateRequiredColumns(parsed.sections);
    if (columnIssues.length > 0) {
      throw new Error(
        `Write blocked: missing required columns. ${columnIssues
          .map((issue) => `${issue.section}: ${issue.missingColumns.join(', ')}`)
          .join('; ')}`,
      );
    }

    const saveResult = await repository.save(featureId, parsed);
    const reloaded = await repository.load(featureId);

    res.json({
      saveResult,
      document: reloaded.document,
      sourcePath: reloaded.sourcePath,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(400).json({ error: message });
  }
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`QA test keypoints server listening on http://localhost:${port}`);
  // eslint-disable-next-line no-console
  console.log(`Workspace root: ${workspaceRoot}`);
});
