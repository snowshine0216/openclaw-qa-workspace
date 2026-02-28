/**
 * Test data for reportPageBy specs (Phase 2e).
 * Dossier IDs from WDIO constants/report.js
 */
const projectId = 'B628A31F11E7BD953EAE0080EF0583BD';

export const reportPageByData = {
  dossiers: {
    ReportPageByContextMenu: {
      id: '1D10DE990B46A83580957FB5C3E429B4',
      projectId,
      name: 'Report PageBy Context Menu',
    },
    PageByMultiplePBShowTotal: {
      id: '48516D8D7643618EC210CC89A7ADF3F4',
      projectId,
      name: 'PageBy - Multiple PB - Show Total',
    },
  },
} as const;
