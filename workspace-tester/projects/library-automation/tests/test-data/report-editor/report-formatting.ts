/**
 * Test data for reportFormatting specs (Phase 2i).
 * From WDIO constants/report.js: lock_headers_TC85742, ReportWithMonoTypeFont,
 * TC86195_wrap_text, reportWithMetricPrompt, ReportPageByContextMenu, updateFont.
 */
export const reportFormattingData = {
  reportUser: {
    username: 'tqmsuser',
    password: '',
  },
  reportFontUser: {
    username: 'report_font',
    password: '',
  },
  updateFont: 'Oswald',
  updateFontFamily: 'oswald',
  fonts: {
    MonotypeCorsiva: 'Monotype Corsiva',
    LucidaSansUnicode: 'Lucida Sans Unicode',
    Inter: 'Inter',
    BigShoulders: 'Big Shoulders Display',
  },
  dossiers: {
    lock_headers_TC85742: {
      id: 'B699AEF8104479168CFCBDA22109D36B',
      projectId: 'B628A31F11E7BD953EAE0080EF0583BD',
    },
    ReportWithMonoTypeFont: {
      id: '1324FE431341AC4B5A6E6585FC7311A2',
      projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
    },
    TC86195_wrap_text: {
      id: '415E5698FD4FA0D0F34147948E333898',
      projectId: 'B628A31F11E7BD953EAE0080EF0583BD',
    },
    reportWithMetricPrompt: {
      id: '133A101E0E444DFA2A4664B6F75FD63D',
      projectId: 'B628A31F11E7BD953EAE0080EF0583BD',
    },
    ReportPageByContextMenu: {
      id: '1D10DE990B46A83580957FB5C3E429B4',
      projectId: 'B628A31F11E7BD953EAE0080EF0583BD',
    },
  },
} as const;
