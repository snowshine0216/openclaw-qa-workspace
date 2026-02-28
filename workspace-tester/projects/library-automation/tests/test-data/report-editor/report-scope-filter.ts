/**
 * Test data for reportScopeFilter specs (Phase 2h).
 * From WDIO constants/report.js: reportScopeFilterUser, reportScopeFilters,
 * reportFilterType, reportFilterSections.SCOPE_FILTER, and dossiers.
 */
export const reportScopeFilterData = {
  reportScopeFilterUser: {
    username: 'resfc',
    password: '',
  },
  reportFilterType: {
    attrQualification: 'Attribute Qualification',
    metricQualification: 'Metric Qualification',
  },
  reportScopeFilters: {
    city: 'SF-Customer City',
    gender: 'SF-Customer Gender',
    address: 'SF-Customer Address',
    customer: 'SF-Customer',
    customerCountry: 'SF-Customer Country',
    customerRegion: 'SF-Customer Region',
    country: 'SF-Country',
    callCenter: 'SF-Call Center',
    category: 'SF-Category',
    subcategory: 'SF-Subcategory',
    month: 'SF-Month',
    day: 'SF-Day',
    year: 'SF-Year',
  },
  reportFilterSections: {
    SCOPE_FILTER: 'SCOPE FILTERS',
    VIEW_FILTER: 'VIEW FILTERS',
  },
  dossiers: {
    SFReportCustomer: {
      id: '0260B586EB40E0B38098548A3CD03076',
      projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
    },
    SFReportGeography: {
      id: '8E86D4921F479448D6D61DB014ECAD8C',
      projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
    },
    SFReportOrder: {
      id: '92C7AE3F4341F43B9A0AD0A0FB80F83E',
      projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
    },
    SFReportHiddenFilter: {
      id: '24AD8589F543EF7B85F648A86CB20E7C',
      projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
    },
    SFReportGeographyByCountry: {
      id: '5D90AD94A442AD1BDFA3E1A3B81ED4BA',
      projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
    },
    SFReportProduct: {
      id: '34C140590D48CECA6EC8259DA6177D79',
      projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
    },
    SFReportCalendar: {
      id: '4C81C323B24E2537DAD60B82F66E8292',
      projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
    },
  },
} as const;
