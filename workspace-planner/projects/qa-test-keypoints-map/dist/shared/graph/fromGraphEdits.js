const DEFAULT_COLUMNS = [
    '#',
    'Priority',
    'Related Code Change',
    'Acceptance Criteria',
    'Test Key Points',
    'Expected Results',
];
function cloneDocument(document) {
    return {
        ...document,
        sections: document.sections.map((section) => ({
            ...section,
            tableColumns: [...section.tableColumns],
            cases: section.cases.map((row) => ({
                ...row,
                extraColumns: { ...row.extraColumns },
            })),
        })),
    };
}
function createCase(sectionIndex, caseIndex) {
    return {
        id: `new-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        rowNumber: `${sectionIndex + 1}.${caseIndex + 1}`,
        priority: 'P2',
        relatedCodeChange: 'N/A',
        acceptanceCriteria: '',
        testKeyPoints: 'Step 1: Define the check point',
        expectedResults: 'Expected outcome for this check point.',
        extraColumns: {},
    };
}
function normalizeRowNumbers(document) {
    document.sections.forEach((section, sectionIndex) => {
        section.cases.forEach((row, rowIndex) => {
            row.rowNumber = `${sectionIndex + 1}.${rowIndex + 1}`;
        });
    });
}
export function updateCaseFields(document, caseId, patch) {
    const next = cloneDocument(document);
    for (const section of next.sections) {
        const target = section.cases.find((row) => row.id === caseId);
        if (target) {
            Object.assign(target, patch);
            return next;
        }
    }
    return document;
}
export function moveCaseToSection(document, caseId, toSectionId) {
    const next = cloneDocument(document);
    const destination = next.sections.find((section) => section.id === toSectionId);
    if (!destination) {
        return document;
    }
    let movingRow = null;
    for (const section of next.sections) {
        const index = section.cases.findIndex((row) => row.id === caseId);
        if (index >= 0) {
            movingRow = section.cases[index];
            section.cases.splice(index, 1);
            break;
        }
    }
    if (!movingRow) {
        return document;
    }
    destination.cases.push(movingRow);
    normalizeRowNumbers(next);
    return next;
}
export function addCaseToSection(document, sectionId) {
    const next = cloneDocument(document);
    const sectionIndex = next.sections.findIndex((item) => item.id === sectionId);
    if (sectionIndex < 0) {
        return { document, caseId: null };
    }
    const section = next.sections[sectionIndex];
    if (!section) {
        return { document, caseId: null };
    }
    const newCase = createCase(sectionIndex, section.cases.length);
    section.cases.push(newCase);
    normalizeRowNumbers(next);
    return { document: next, caseId: newCase.id };
}
export function addSection(document) {
    const next = cloneDocument(document);
    const sectionIndex = next.sections.length;
    const sectionId = `section-new-${Date.now()}`;
    const referenceColumns = next.sections[0]?.tableColumns.length
        ? [...next.sections[0].tableColumns]
        : [...DEFAULT_COLUMNS];
    const newSection = {
        id: sectionId,
        title: `New Category ${sectionIndex + 1}`,
        tableColumns: referenceColumns,
        cases: [createCase(sectionIndex, 0)],
    };
    next.sections.push(newSection);
    normalizeRowNumbers(next);
    return {
        document: next,
        sectionId,
    };
}
export function removeCase(document, caseId) {
    const next = cloneDocument(document);
    for (const section of next.sections) {
        const index = section.cases.findIndex((row) => row.id === caseId);
        if (index >= 0) {
            section.cases.splice(index, 1);
            normalizeRowNumbers(next);
            return next;
        }
    }
    return document;
}
//# sourceMappingURL=fromGraphEdits.js.map