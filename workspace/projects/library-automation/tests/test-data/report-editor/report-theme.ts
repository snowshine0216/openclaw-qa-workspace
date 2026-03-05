/**
 * Test data for reportTheme specs (Phase 2g).
 * Dossier IDs and users from WDIO constants/report.js
 */
export const reportThemeData = {
  reportThemeTestUser: {
    username: 're_theme',
    password: '',
  },
  testUserWithoutUseFormattingEditorPrivilege: {
    username: 're_nfe',
    password: '',
  },
  dossiers: {
    UIReportProductNoPageBy: {
      id: '729347AB144616857685DBAB12DA9A4C',
      projectId: 'B628A31F11E7BD953EAE0080EF0583BD',
    },
    UIReportWithTheme: {
      id: '0E50BB3213466246E8C1DCBAB70C4810',
      projectId: 'B628A31F11E7BD953EAE0080EF0583BD',
    },
    AirlineSubsetReport: {
      id: 'BC1D9DF36B46D1A5E512E2B724267424',
      projectId: 'B628A31F11E7BD953EAE0080EF0583BD',
    },
    UIReportProductWithPageBy: {
      id: '3BD964B01F4D3233EA24C095FC4B4EB1',
      projectId: 'B628A31F11E7BD953EAE0080EF0583BD',
    },
  },
  tutorialProject: {
    name: 'MicroStrategy Tutorial',
  },
} as const;
