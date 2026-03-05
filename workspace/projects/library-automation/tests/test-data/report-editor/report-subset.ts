/**
 * Test data for reportSubset specs (Phase 2d).
 * From WDIO constants/report.js
 */
export const reportSubsetData = {
  /** User for reportSubset specs (createByCube/replace_cube) */
  reportSubsetTestUser: {
    username: 're_ss',
    password: '',
  },
  projects: {
    tutorial: {
      id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
      name: 'MicroStrategy Tutorial',
    },
  },
  dossiers: {
    AirlineSubsetReport: {
      id: 'BC1D9DF36B46D1A5E512E2B724267424',
      name: 'r04-subset.report.airline',
      projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
    },
    subsetReportWithCubeFilter: {
      id: 'E2EAD8780F4EBF84AD101393BF873502',
      name: 'r05-subset.report.cube filter',
      projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
    },
    subsetReportWithOlapCube: {
      id: 'EB049290A54B1D0DE64662BFF88E8709',
      name: 'r06-subset.report.olap cube',
      projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
    },
    subsetReportWithOlapCubeNoViewFilter: {
      id: 'CE8D3D615E47D481D087E7B05F8E8A70',
      name: 'r07-subset.report.olap cube no filter',
      projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
    },
    subsetReportWithPromptInViewFilter: {
      id: '30E1C9985446C4519A08FDAF33D5CD5D',
      name: 'r08-subset.report.olap cube with prompt in view filter',
      projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
    },
    UIReportProductWithPageBy: {
      id: '3BD964B01F4D3233EA24C095FC4B4EB1',
      name: 'r01-UI.products sales with page by',
      projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
    },
    TemplateProductReport: {
      id: 'A497FD0F374391D5CF767D95A069963A',
      name: 'r01-template.report',
      projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
    },
  },
  cubes: {
    airlineData: 'Airline Data',
    productOlap: 'Product OLAP cube',
  },
  templateWithSubsetReport: 'report template subset',
  reportFilterType: {
    attrQualification: 'Attribute Qualification',
    metricQualification: 'Metric Qualification',
  } as const,
  qualificationPrompts: {
    qualificationOnYear: '01. Qualification prompt on year',
    qualificationOnCategory: '02. Qualification prompt on category',
    aePromptOnYear: '03. Attribute elements prompt on year',
    aePromptOnCategory: '04. Attribute elements prompt on category',
    metricQualCostRevenue: '05. Metric qualification on cost and revenue',
    metricQualUnitPrice: '06. Metric qualification on unit price',
    valuePromptNumber: '07. Value prompt for number',
    valuePromptText: '08. Value prompt for text',
  },
} as const;
