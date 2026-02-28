/**
 * Test data for reportPageBySorting specs (Phase 2b).
 * Dossier IDs from WDIO constants/report.js
 */
const projectId = 'B628A31F11E7BD953EAE0080EF0583BD';

export const reportPageBySortingData = {
  reportUser: {
    username: 'tqmsuser',
    password: '',
  },
  dossiers: {
    ReportWS_PB_YearCategory1: {
      id: '5FE3EA2E9F41F5E587B8FB8C03C42809',
      projectId,
    },
    ReportWS_PB_YearCategory2: {
      id: 'DD28BFCC4B4A15978F74CEB3C75E8447',
      projectId,
    },
    DeveloperPBYearAscCustomCategoriesParentTop: {
      id: '71DF87284DDBAF9B3FD77E84073823EE',
      projectId,
    },
    DeveloperPBConsolidationSubcategory: {
      id: 'C05D5E154F132DB25D5D58A14AF01F8D',
      projectId,
    },
    DeveloperPBMetrics: {
      id: '288708A946718529881298AFC09808DC',
      projectId,
    },
    DeveloperPBHierarchy: {
      id: 'F313C895416AF8DB63206FBE0F2AA47D',
      projectId,
    },
  },
} as const;
