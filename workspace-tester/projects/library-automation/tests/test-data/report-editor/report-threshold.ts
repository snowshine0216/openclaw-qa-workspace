/**
 * Test data for reportThreshold specs (Phase 2f).
 * Dossier IDs from WDIO constants/report.js
 */
export const reportThresholdData = {
  reportUser: {
    username: 'tqmsuser',
    password: '',
  },
  dossiers: {
    ReportThreshold1: {
      id: '280E0A74B54630AF7E7835877E192291',
      projectId: 'B628A31F11E7BD953EAE0080EF0583BD',
    },
    ReportThreshold2: {
      id: 'C21BE4B3AA4432769B99F3AD5714F84F',
      projectId: 'B628A31F11E7BD953EAE0080EF0583BD',
    },
  },
} as const;
