/**
 * Test data for reportShortcutMetrics specs (Phase 2a).
 * Dossier IDs from WDIO constants/report.js
 */
export const reportShortcutMetricsData = {
  reportUser: {
    username: 'tqmsuser',
    password: '',
  },
  dossiers: {
    ReportGridShortcutMxAttrInCols: {
      id: '39C17C0F514B74C8985C0EA70DCD20B3',
      projectId: 'B628A31F11E7BD953EAE0080EF0583BD',
    },
    ReportGridShortcutMx: {
      id: '71A4142DC246E3F8DDA2EEA75691A074',
      projectId: 'B628A31F11E7BD953EAE0080EF0583BD',
    },
    ReportGridContextMenu: {
      id: 'B4B0FB87914F35DB18CDE5A719537D2A',
      projectId: 'B628A31F11E7BD953EAE0080EF0583BD',
    },
  },
} as const;
