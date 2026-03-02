import urlParser from '../api/urlParser.js';

export const mobileWindow = {
    browserInstance: browsers.browser1,
    width: 599,
    height: 640,
};
/*
 *  Users for snapshot
 */

export const mstrUser = {
    username: 'mstr1',
    password: 'newman1#',
};

export const snapshotInfoUser = {
    username: 'snapshot_info',
    password: '',
    id: 'B60FB2AE984278DE5CF047ADDBE0DF22',
};

export const snapshotUser = {
    username: 'snapshots',
    password: '',
    id: 'CCADD47447AC38CD99EE7AAA472F7BD6',
};

export const rwdBMSender = {
    username: 'rwd_bm',
    password: '',
    id: '8535BD19C945F71963BC3F9439FA6754',
};

export const rwdBMRecipient = {
    username: 'rwd_rec',
    password: '',
    id: '1FAFBBC5C444813767C739A1C2266089',
};

export const rwdBMNotInLibrary = {
    username: 'rwd_rec_nil',
    password: '',
    id: '46311BADD74D500EC0D266935962569D',
};

export const reportBMSender = {
    username: 'report_bm',
    password: '',
    id: '7F1711B1413E1071867118B100A250F8',
};

export const reportBMRecipient = {
    username: 'report_rec',
    password: '',
    id: 'D6623EA448EC1A49BEB6498463DED714',
};

export const reportBMNotInLibrary = {
    username: 'report_rec_nil',
    password: '',
    id: 'F5096EEF417F6F31AA63B78C83F55574',
};

export const snapshotsUser = {
    username: 'snapshots',
    password: '',
    id: 'CCADD47447AC38CD99EE7AAA472F7BD6',
};

export const snapshotInfoPartUser = {
    username: 'snapshot_partview',
    password: '',
};

export const snapshotNoViewUser = {
    username: 'snapshot_noview',
    password: '',
};

export const snapshotTestUser = {
    username: 'snapshot_subscription',
    password: '',
};

export const snapshotCreationUser = {
    username: 'snapshot_creation',
    password: '',
};

export const snapshotRunUser = {
    username: 'snapshot_run',
    password: '',
    id: '253EA87D6D4538DAC13987B3AE6F7FEC',
};

export const snapshotNoViewPrivilege = {
    username: 'snapshot_nvh',
    password: '',
};

export const snapshotNoSubscribeHistory = {
    username: 'snapshot_nsh',
    password: '',
};

export const snapshotNoSubscribeToEmail = {
    username: 'snapshot_nse',
    password: '',
};

export const snapshotI18N = {
    username: 'snapshot_i18n',
    password: '',
};

export const sendToBackgroundTest = {
    username: 'sendToBackgroundTest',
    password: '',
    id: 'B2AB5A18AB4701AE607AA4866BF6FA1B',
};

/*
 *  Projects for snapshot
 */

const subscriptionTestProject = {
    id: '649A6C4AD4441993648363A3A797F0A4', //mci-u6btx-dev
    name: 'Subscription Test',
};

const microStrategyTutorialProject = {
    id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
    name: 'MicroStrategy Tutorial',
};

const platformAnalyticsProject = {
    id: '61ABA574CA453CCCF398879AFE2E825F',
    name: 'Platform Analytics',
};

const humanResourceAnalysisProject = {
    id: '4BAE16A340B995CAD24193AA3AC15D29',
    name: 'Human Resources Analysis Module',
};

/*
 *  Dashboards for snapshot
 */

export const dossierWithMultiLayerLinks = {
    name: '1.Dossier with multi-layer links',
    id: '6EF1B9D04AE8FF34D2D23691696367FD',
    project: microStrategyTutorialProject,
    type: 'document_definition',
};

export const callCenterManagement = {
    name: 'Call Center Management',
    id: '4480640B11EAF10334D90080EF950B74',
    project: microStrategyTutorialProject,
    type: 'document_definition',
};

export const campaignOverView = {
    id: 'EAF770F9CD46F277F7B36588C3425B94',
    name: 'Campaign Overview',
    chapter1: 'Campaign Overview',
    chapter2: 'Articles',
    project: microStrategyTutorialProject,
    type: 'document_definition',
};

export const financialAnalysis = {
    id: '3D5AD91611E8285C3D690080EFA5ACC6',
    name: 'Financial Analysis',
    project: microStrategyTutorialProject,
    type: 'document_definition',
};

export const humanResourceAnalysis = {
    id: '4C4BB57C11EB4EFF96550080EF952010',
    name: 'Human Resources Analysis',
    project: microStrategyTutorialProject,
    type: 'document_definition',
};

export const officeRoyaleSales = {
    id: 'F6252B9211E7B348312C0080EF55DB6A',
    name: 'Office Royale Sales',
    project: microStrategyTutorialProject,
    type: 'document_definition',
};

export const storePerformance = {
    id: '7889DA8011E93B9525050080EF55EFEA',
    name: 'Store Performance',
    project: microStrategyTutorialProject,
    type: 'document_definition',
};

export const usEconomyAnalysis = {
    id: '19A95FA711EC45A93E0B0080AFAB8FDF',
    name: 'US Economy Analysis',
    project: microStrategyTutorialProject,
    type: 'document_definition',
};

export const visualVocabulary = {
    id: 'BDD72BE311EAA41CD7700080EFD5E527',
    name: 'Visual Vocabulary',
    project: microStrategyTutorialProject,
    type: 'document_definition',
};

export const PAAnalysis = {
    id: 'DFDBFAF89E4F684E32AA879378B84161',
    name: 'PA analysis',
    project: platformAnalyticsProject,
    type: 'document_definition',
};

export const ClientTelemetry = {
    id: 'E912FA8D4358A1FE4423FE8C31E58F7E',
    name: 'Client Telemetry',
    project: platformAnalyticsProject,
    type: 'document_definition',
};

export const cubeNotPublish = {
    name: 'Cube not publish',
    id: 'B2BD703FC240A3D6CA40368C3AAB6961',
    project: subscriptionTestProject,
    type: 'document_definition',
};
export const testCityDashboard = {
    name: '1.1 Snapshot, city, report based dashboard',
    id: 'F402CC51AA443D3EC9A8ACB04E2D7CC1',
    project: subscriptionTestProject,
    type: 'document_definition',
};

export const cubeOnlyDashboard = {
    name: '3.3 Dashboard, only cube',
    id: 'B9103A77A54642A6A8FB86958EA56EC7',
    project: subscriptionTestProject,
    type: 'document_definition',
};

export const promptDashboard = {
    name: 'Dashboard prompt, Test city',
    id: 'A2E62075A34A2CE40B2498A6CDA36CB3',
    project: subscriptionTestProject,
    type: 'document_definition',
};

export const reportFilterDashboard = {
    name: '5.1 Parameters, push down filter',
    id: '028D7208D7417C2083CD8781517801EC',
    project: subscriptionTestProject,
    type: 'document_definition',
};

export const txnDashboard = {
    name: 'TXN, City and Sales',
    id: '6EE34C75234070213D457F8AF0651375',
    project: subscriptionTestProject,
    type: 'document_definition',
};

/**
 *  Reports for snapshot subscription
 */

export const promptReportForCity = {
    name: 'Test city, prompt',
    id: '60CB1BD8B4490406F9780DB2554C1EE3',
    project: subscriptionTestProject,
    type: 'report_definition',
};

export const singleReport = {
    name: 'Report',
    id: '755FBC65F14F092D2019CC8022F659E0',
    project: microStrategyTutorialProject,
    type: 'report_definition',
};

export const sampleReport = {
    name: 'Simple Report Display Sample Report',
    id: 'D19CDD7E4E20FCC3475EBDB0E399399F',
    project: microStrategyTutorialProject,
    type: 'report_definition',
};

export const cubeAutoReport = {
    name: '14.10 Cube Auto Report',
    id: '3E61F1430C4D350613C14AB8CA97B29E',
    project: subscriptionTestProject,
    type: 'report_definition',
};

export const reportLink = {
    name: '14.11 Report Link',
    id: 'BCCB4CE7DD44AE2A985FC593D933C611',
    project: subscriptionTestProject,
    type: 'report_definition',
};

export const reportNotAllowSchedule = {
    name: '14.12 ReportNotAllowSchedule',
    id: '89DAD8005D4A2288DDF71F913BBE26F0',
    project: subscriptionTestProject,
    type: 'report_definition',
};

export const productPromptRegionYearReport = {
    name: 'Product, Prompt by region & year',
    id: '049647D36B4753190B2C0B9DA74B3263',
    project: microStrategyTutorialProject,
    type: 'report_definition',
};

export const largeReport = {
    name: 'LargeReport',
    id: '5BCCA2EBD84E940C960DA29002BDBB5C',
    project: microStrategyTutorialProject,
    type: 'report_definition',
};

/**
 *  Documents for snapshot subscription
 */

export const promptDocumentForCity = {
    name: '9.6 Test City, Prompt',
    id: '3890AB7D7E466BA3B79D03B525FFCB89',
    project: subscriptionTestProject,
    type: 'document_definition',
};

export const rwdForLinking = {
    name: '9.9 Document, linking no prompt',
    id: '09FF2400404369790B9B2B804D993E3F',
    project: subscriptionTestProject,
    type: 'document_definition',
};

export const rwdForGridGraph = {
    name: '9.19 GridGraph',
    id: '8F029452654F062458236B94BFD3BE26',
    project: subscriptionTestProject,
    type: 'document_definition',
};

export const cubeBasedDocumentForCity = {
    name: '9.7 Document, cube_auto.xlsx',
    id: '32D183E9A44D35E12F4EDF9EC5E6609F',
    project: subscriptionTestProject,
    type: 'document_definition',
};

export const rwdForManipulation = {
    name: '9.2 Document, Group by & selectors',
    id: 'D79B1E606B476A4E9CB18C80FE4881D2',
    project: subscriptionTestProject,
    type: 'document_definition',
};

export const rwdForTransaction = {
    name: '09.1.1 Document-txn-city',
    id: '319C277C99470C712C7019A6C505F6DE',
    project: subscriptionTestProject,
    type: 'document_definition',
};

export const rwdNoSchedule = {
    name: '9.0 Document, NOT allow to schedule',
    id: '64E49D2C73422714D151DEA4E5AC8527',
    project: subscriptionTestProject,
    type: 'document_definition',
};

export const rwdCustomizedSchedule = {
    name: '9.0 Document, no dataset',
    id: '78747B1E4D48DBE824675B951FDBD74B',
    project: subscriptionTestProject,
    type: 'document_definition',
};

export const rwdNoDatasetInTutorial = {
    name: 'TC97775_05, No dataset',
    id: '4CD645509E466A09670F9C83EDB051AE',
    project: microStrategyTutorialProject,
    type: 'document_definition',
};

export const certifyDocument = {
    name: 'certify document',
    id: 'C107CC683544E244F2322CA77339D55B',
    project: microStrategyTutorialProject,
    type: 'document_definition',
};

export const largeDocument = {
    name: 'LargeDocument',
    id: '65FC43460F448ABC191451B14C601529',
    project: microStrategyTutorialProject,
    type: 'document_definition',
};

export const largePromptedDocument = {
    name: 'LargePromptedDocument',
    id: '6525E40F9D45D247D2C81F806B126EC3',
    project: microStrategyTutorialProject,
    type: 'document_definition',
};

export const infoDocument = {
    name: 'Info_Document',
    id: '8B4753824CECF6939825CE9E78B41795',
    project: humanResourceAnalysisProject,
    type: 'document_definition',
};

export const subscriptionFormats = {
    excel: 'Excel',
    csv: 'CSV',
    pdf: 'PDF',
    snapshot: 'Snapshot',
};

export const subscriptionFormatsCN = {
    excel: 'Excel',
    pdf: 'PDF',
    snapshot: '快照',
};

export const subscriptionSchedules = {
    allTheTime: 'All the Time',
    daily: 'Daily',
    booksClosed: 'Books Closed',
    firstOfMonth: 'First of Month',
    mondayMorning: 'Monday Morning',
};

export const SNAPSHOT_STATUSES = {
    READY: 'Ready',
    ERROR: 'Error',
    RUNNING: 'Running',
};

export const WH_UPDATE_HOST = 'http://tec-l-1156391.labs.microstrategy.com:5000/';

export const CitySampleData = [
    {
        id: 1,
        name: 'Hangzhou',
        description: 'this is Hangzhou',
    },
    {
        id: 2,
        name: 'Shanghai',
        description: 'this is Shanghai',
    },
    {
        id: 3,
        name: 'Beijing',
        description: 'this is Beijing',
    },
];

export const SalesSampleData = [
    {
        sales: 300,
        quarter: '2022Q1',
    },
    {
        sales: 200,
        quarter: '2022Q2',
    },
    {
        sales: 400,
        quarter: '2022Q4',
    },
];

export const ProductSampleData = [
    {
        category: 'Books',
        subcateogry: 'business',
        price: 50,
    },
    {
        category: 'Books',
        subcateogry: 'art',
        price: 40,
    },
    {
        category: 'Books',
        subcateogry: 'sports',
        price: 20,
    },
    {
        category: 'Electronics',
        subcateogry: 'video equipment',
        price: 50,
    },
    {
        category: 'Electronics',
        subcateogry: 'computer',
        price: 60,
    },
    {
        category: 'Electronics',
        subcateogry: 'cameras',
        price: 70,
    },
];

export function getUpdateCubeDataPayload(data) {
    const base_url = `${urlParser(browser.options.baseUrl)}api`;
    return {
        base_url,
        ...data,
    };
}

export const cityCubeGeneralData = {
    mstr_username: mstrUser.username,
    mstr_password: mstrUser.password,
    project_id: subscriptionTestProject.id, // project <Subscription Test>
    cube_id: 'C4964F0C4D4C555CB09CC1899D571391', // "cube_auto.xlsx" under Shared Reports > bxu
    table_name: 'cube_auto.xlsx',
};

export const cityCubeSampleData = {
    ...cityCubeGeneralData,
    data: { Id: ['1', '2', '3'], city: ['hangzhou', 'shanghai', 'beijing'] },
};

export const cityCubeNewDataRow = {
    ...cityCubeGeneralData,
    data: { Id: ['4'], city: ['nanjing'] },
};

export const snapshotErrorText = {
    English: {
        emptyNameError: 'Please enter a name.',
        renameError: 'Failed to rename',
        deleteError: 'Failed to delete',
        getSnapshotsError: 'Failed to load snapshots.',
        longNameError: "Name can't exceed 250 characters",
        createSnapshotFailed: 'Failed to create snapshot.',
        createSnapshotPromptFailed: 'Failed to create snapshot. Please answer the prompts first.',
    },
    Chinese: {
        emptyNameError: '请输入名称。',
        renameError: '重命名失败',
        deleteError: '未能删除',
        getSnapshotsError: '未能加载快照。',
        longNameError: '名称不得超过 250 个字符',
    },
};
