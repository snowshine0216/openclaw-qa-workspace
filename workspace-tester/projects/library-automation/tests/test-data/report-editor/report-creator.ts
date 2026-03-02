/**
 * Test data for reportCreator specs (Phase 2c).
 * From WDIO constants/report.js
 */
export const reportCreatorData = {
  reportTemplateTestUser: {
    username: 're_template',
    password: '',
    id: '330760153442D0C61375029AF44335F3',
  },
  /** User without define intelligent cube report privilege (createByCubePrivilege) */
  reportTestUserWithoutDefineCubePrivilege: {
    username: 're_nic',
    password: '',
    id: '25391B2F7C42CE6437A307914D1DF2BE',
  },
  /** User for createByCube specs (report subset tests) */
  reportSubsetTestUser: {
    username: 're_ss',
    password: '',
    id: 'A4CED5E8124A0BE63590CBA83667102E',
  },
  /** User without execute ACL on templates (reportTemplateSecurity) */
  reportTemplateNoExecuteAclUser: {
    username: 'ret_ne',
    password: '',
    id: '56D9BEBD054A46257DC30A9D51A92111',
  },
  projects: {
    tutorial: {
      id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
      name: 'MicroStrategy Tutorial',
    },
    hierarchies: {
      id: 'B3FEE61A11E696C8BD0F0080EFC58F44',
      name: 'Hierarchies Project',
    },
    subscription: {
      id: '649A6C4AD4441993648363A3A797F0A4',
      name: 'Subscription Test',
    },
  },
  templates: {
    reportBuilder: 'Report Builder',
    withPageBy: 'report template with page by',
    withPrompt: 'report template with prompt',
    certified: 'report template certified',
    subset: 'report template subset',
  },
  /** Switch project confirmation message (WDIO template.js) */
  switchProjectMessage: 'Your current data selection will be removed if you change to a different project. Do you want to continue?',
} as const;
