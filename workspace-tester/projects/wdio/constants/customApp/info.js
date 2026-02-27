import _ from 'lodash';
import * as customApp from './customAppBody.js';

export const appUser = {
    credentials: {
        username: 'app',
        password: '',
    },
};

export const mstrUser = {
    id: '86A002474C1A18F1F92F2B8150A43741',
    credentials: {
        username: 'mstr1',
        password: 'newman1#',
    },
};

export const app2User = {
    credentials: {
        username: 'app2',
        password: '',
    },
};

export const autoapp1 = {
    id: '654B460846DA28CA389AE09BF4C0ECC4',
    credentials: {
        username: 'autoapp1',
        password: '',
    },
};

export const appWeb = {
    id: '6E0ED01E43AD71BA88FAD195218B72FD',
    credentials: {
        username: 'appWeb',
        password: '',
    },
};

export const loginCredentialCollab1 = {
    username: 'collab1',
    password: '',
};
export const loginCredentialCollab2 = {
    username: 'collab2',
    password: '',
};
export const loginCredentialContent1 = {
    username: 'webContent',
    password: '',
};
export const loginCredentialContent2 = {
    username: 'webContent2',
    password: '',
};
export const loginCredentialContent3 = {
    username: 'reportContent',
    password: '',
};

export const tc1user1 = {
    id: '8C2B5F0B45F2EF269273D396F2CF9B3C',
    credentials: {
        username: 'tc1user1',
        password: '',
    },
};

export const tc1user2 = {
    id: '95ECFD9140EC41256E7E739D2D2F8BF0',
    credentials: {
        username: 'tc1user2',
        password: '',
    },
};

export const tc1user3 = {
    id: '4D89031244B3ECE7DED32F9823D6A148',
    credentials: {
        username: 'tc1user3',
        password: '',
    },
};

export const botAsHomeTestUser = {
    id: 'E05225156F4B243C89ED439D4B084890',
    credentials: {
        username: 'ca_bot',
        password: 'newman1#',
    },
};

export const noDefaultAppAclTestUser = {
    id: 'E8605E1368487E124733998AF0B4E033',
    credentials: {
        username: 'ca_nodaacl',
        password: 'newman1#',
    },
};

export const loginCredentialContent1Id = '1F289C106C4717213EFC199111E114BE';

export const dossierWithPSfilterLink = {
    id: '178DCBD847C2F4FD029DE69A220ACB66',
    name: 'Dossier with PS + filter + link',
    chapter: 'link to this dossier',
    project: {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    },
};

export const dossierAutoWeb2 = {
    id: '76395E3249B712F017196FB372955588',
    name: 'Auto_Web2',
    chapter: 'link to this dossier',
    project: {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    },
};

export const dossierAutoCollabWeb = {
    id: '8C4340BA4E49B783D970ABAF23D9E061',
    name: 'Auto_Collaboration_Web',
    chapter: 'link to this dossier',
    project: {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    },
};

export const dossierDEWithFiltersLink = {
    id: '694844DF4F8E5584B8180896B0FBD2D8',
    name: '3.Dossier with DE + all filters + link',
    project: {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    },
};

export const promptHomeDossier = {
    name: 'ValuePromptDossier',
    projectId: '61ABA574CA453CCCF398879AFE2E825F',
    dossierId: '14CA95311D442F5C9827738B32D086CE',
};

// export const testedDossier = '1.Dossier with multi-layer links';
export const testedDossier = {
    id: '6EF1B9D04AE8FF34D2D23691696367FD',
    name: '1.Dossier with multi-layer links',
    project: {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    },
};

export const deleteRSD = {
    projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
    dossierId: '7C9A32B5914387CEE86B30BF1056CB7F',
};
export const pageDeleteDossier = {
    projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
    dossierId: '66BA433E084E4EE281625984FA9B9D3A',
};
export const cubeNotPublishDossier = {
    projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
    dossierId: '2933251A26410A8C6502AC99E3CC41E0',
};

export const dossierPalette = {
    id: '218492C84D7DB2DACEDC2595ED1443D8',
    name: 'auto_Custom_Palette',
    chapter: 'link to this dossier',
    project: {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    },
};

export const defaultDossierPalette = {
    id: 'F7132B3E4C52FD6D707BBAA4D7411D1F',
    name: 'auto_Use default palette (grey)',
    chapter: 'link to this dossier',
    project: {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    },
};

export const customDossierPalette = {
    id: 'F734B779490C58C314AA0BB59CC11CA8',
    name: 'auto_customGreen',
    chapter: 'link to this dossier',
    project: {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    },
};

export const dossierTecPD = {
    id: 'CD0B3A434EF79B0B658678B111C6FD05',
    name: 'atFilterDossier',
    project: {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    },
};

export const dossierPurple = {
    id: '464B039041A318C9B413A1BE72A47BF0',
    name: 'auto_PurpleByDefault',
    project: {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    },
};

export const dossierBlack = {
    id: 'FDE8791D48598BC5E648EA9C9F838B41',
    name: 'auto_BlackAlways',
    project: {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    },
};

export const bydBalanceBot = {
    id: 'B14146B9CE46E59080E63B966C327CEE',
    name: 'byd_balance_bot',
    project: {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    },
};

export const autoBydBotNoSuggestion = {
    id: 'F22039BE5B4B36037768C69100C0E3A2',
    name: 'auto_byd_bot_no_suggestion',
    project: {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    },
};

export const emptyDossier = 'Empty Dossier';

export const autoAndroid2 = 'Auto_Android2';

export const baseDossier = {
    name: 'BaseDossier',
    id: 'A49333EBA940A9BA729A7BB590CC7496',
    project: {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    },
};

export const emptyDossier2 = {
    id: '46B5FF444F338F879E5F71A5533BEC77',
    name: 'Empty Dossier 2',
    project: {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    },
};

export const reports = {
    finalReport: 'Finance Dashboard - Waterfall',
    performanceReport: 'Call Center Performance',
    singleItemReport: 'Single Item Details',
};

export const sourceDossier = {
    id: '67634F124C43D9F79FA5B0B4C568ECC2',
    name: 'DossierWithLinksAndFilters',
    project: {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    },
    chapter: 'link to dossier has filter',
    page1: 'link to no filter page',
    page2: 'link to has filter page',
    grid1Info: { title: 'not pass, new tab', headerName: 'Category', elementName: 'Books' },
    grid2Info: { title: 'not pass, current tab', headerName: 'Category', elementName: 'Books' },
};

export const analysisDocument = {
    id: '52576385422A3F9F174B97BE6E361116',
    name: 'Analysis Document',
    project: {
        id: 'CE52831411E696C8BD2F0080EFD5AF44',
        name: 'Platform Analytics',
    },
};

export const homeDossier = {
    id: '8FDFDFA9114F50CD1E8CCB9AE7B98488',
    name: 'Dossier-CustomApp-Test',
    project: {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    },
};

export const homeDossierAclTest = {
    id: '5DF80A3EC24505DF87C898B94F02395A',
    name: 'Dossier, ACL Test',
    project: {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    },
};

export const financialAnalysisDossier = {
    id: '3D5AD91611E8285C3D690080EFA5ACC6',
    name: 'Financial Analysis',
    project: {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    },
    chapter: 'Financial Statements',
    page: 'Financial Statements',
};

export const simpleReport = {
    id: 'D19CDD7E4E20FCC3475EBDB0E399399F',
    name: 'Simple Report Display Sample Report',
    project: {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    },
};

export const customVizRSD = {
    id: 'ADDEAD0D2940A881550ECBAC6064429E',
    name: 'Custom Viz',
    project: {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    },
};

export const comment = 'auto post public comment';
export const message1 = 'auto create discussion';
export const groupName1 = 'auto discussion name';
export const message2 = 'auto post 2nd msg';
export const sharedBM = 'Bookmark 1';

export const libraryHomeDisableRecent = customApp.getCustomAppBody({
    version: 'v1',
    name: 'autoLibraryHomeDisableRecent',
    sidebarsHomeLibrary: ['all', 'favorites', 'default_groups', 'my_groups', 'options'],
});

// name too long will cause unexpected behavior
let disableMyContent = customApp.getCustomizedItems('v1');
disableMyContent.my_content = false;
export const libraryHomeDisableMyContent = customApp.getCustomAppBody({
    version: 'v1',
    name: 'autoLHDisableMyContent',
    customizedItems: disableMyContent,
});

export const libraryHomeDisableFavourite = customApp.getCustomAppBody({
    version: 'v1',
    name: 'autoDHDisableFavourite',
    sidebarsHomeLibrary: ['all', 'recents', 'default_groups', 'my_groups', 'options'],
});

export const libraryHomeDisableMyGroup = customApp.getCustomAppBody({
    version: 'v1',
    name: 'autoLibraryHomeDisableMyGroup',
    sidebarsHomeLibrary: ['all', 'favorites', 'recents', 'default_groups', 'options'],
});

export const libraryHomeDisableMyGroupAndFavor = customApp.getCustomAppBody({
    version: 'v1',
    name: 'autoDossierHomeDisableMyGroupAndFavor',
    sidebarsHomeLibrary: ['all', 'recents', 'default_groups', 'options'],
});

export const libraryHomeDisableDefaultGroups = customApp.getCustomAppBody({
    version: 'v1',
    name: 'autoDossierHomeDisableDefaultGroups',
    sidebarsHomeLibrary: ['all', 'favorites', 'recents', 'my_groups', 'options'],
});

let disableSubscriptions = customApp.getCustomizedItems('v1');
disableSubscriptions.subscriptions = false;
export const libraryHomeDisableSubscription = customApp.getCustomAppBody({
    version: 'v1',
    name: 'autoLHDisableSubscription',
    customizedItems: disableSubscriptions,
});

export const libraryHomeDisableSortAndSearch = customApp.getCustomAppBody({
    version: 'v1',
    name: 'autoLibraryHomeDisableSortAndSearch',
    iconsHomeLibrary: ['sidebars', 'notifications', 'multi_select', 'options'],
});

export const libraryHomeDisableMultiSelect = customApp.getCustomAppBody({
    version: 'v1',
    name: 'autoDossierHomeDisableMultiSelect',
    iconsHomeLibrary: ['sidebars', 'sort_and_filter', 'search', 'notifications', 'options'],
});

export const libraryHomeDisableNotification = customApp.getCustomAppBody({
    version: 'v1',
    name: 'autoLibraryHomeDisableNotification',
    iconsHomeLibrary: ['sidebars', 'sort_and_filter', 'search', 'multi_select', 'options'],
});

export const libraryHomeDisableAccount = customApp.getCustomAppBody({
    version: 'v1',
    name: 'autoLibraryHomeDisableAccount',
    iconsHomeLibrary: ['sidebars', 'sort_and_filter', 'search', 'notifications', 'multi_select'], // remove options
});

let disableUndoRedo = customApp.getCustomizedItems('v1');
disableUndoRedo.undo_and_redo = false;
export const libraryHomeDisableTOCAndUndo = customApp.getCustomAppBody({
    version: 'v1',
    name: 'autoDHDisableTOCAndUndo',
    iconsHomeDocument: ['bookmarks', 'reset', 'filters', 'comments', 'share', 'notifications', 'options'],
    customizedItems: disableUndoRedo,
});

export const libraryHomeDisableBookmarkAndReset = customApp.getCustomAppBody({
    version: 'v1',
    name: 'autoLibraryHomeDisableBookmarkAndReset',
    iconsHomeDocument: ['table_of_contents', 'filters', 'comments', 'share', 'notifications', 'options'],
});

export const libraryHomeDisableComment = customApp.getCustomAppBody({
    version: 'v1',
    name: 'autoLHDisableComment',
    iconsHomeDocument: ['filters', 'share', 'table_of_contents', 'bookmarks', 'reset'],
});

export const libraryHomeDisableShare = customApp.getCustomAppBody({
    version: 'v1',
    name: 'autoDossierHomeDisableShare',
    iconsHomeDocument: ['table_of_contents', 'bookmarks', 'reset', 'filters', 'comments', 'notifications', 'options'],
});

export const libraryHomeDisableSidebar = customApp.getCustomAppBody({
    version: 'v1',
    name: 'autoLibraryHomeDisableSidebar',
    iconsHomeLibrary: ['sort_and_filter', 'search', 'notifications', 'multi_select', 'options'],
});

// needs to used edit custom app api to update it
// export const libraryHomeDisablede219725first = customApp.getCustomAppBody({
//     name: 'autoLibraryHomeDisableRecent',
//     iconsHomeLibrary: [],
//     iconsHomeDossier: [],
//     sidebarsHomeLibrary: ['all', 'favorites', 'recents', 'my_groups'],
// });
// export const libraryHomeDisablede219725second = customApp.getCustomAppBody({
//     name: 'autoLibraryHomeDisableMyContent',
//     iconsHomeDocument: ['table_of_contents', 'bookmarks', 'reset', 'filters', 'comments', 'share'],
//     sidebarsHomeLibrary: ['all', 'recents', 'my_groups'],
// });
// export const libraryHomeDisablede219725third = customApp.getCustomAppBody({
//     name: 'autoDossierHomeDisableFavourite',
//     dossierMode: 1,
//     // sidebarsHomeLibrary: ['all', 'favorites', 'recents', 'my_groups'],
//     url: `/app/${consts.dossierWithPSfilterLink.project.id}/${consts.dossierWithPSfilterLink.id}`,
// });

// -----------------content group---------------------
export const libraryHome = customApp.getCustomAppBody({
    version: 'v2',
    name: 'autoLibraryHome',
});

export const libraryHomeDisableNewContent = customApp.getCustomAppBody({
    version: 'v2',
    name: 'autoLibraryHomeDisableNewContent',
    contentBundleIds: ['F827F3E59B4A458B308680B700E45E14'],
});

export const customizedEmail = customApp.getCustomAppBody({
    version: 'v2',
    name: 'autotest_customapp',
    enabled: true,
    hostPortal: 'https://www.baidu.com',
});

export const libraryHomeDisableNewContentLongName = customApp.getCustomAppBody({
    version: 'v2',
    name: 'autoLibraryHomeDisableNewContentLongName',
    contentBundleIds: ['0D8348DB48E10615E2B704A8429968E3', 'C73FEFBD4653781C29CC8FB9E61D0506'],
    defaultGroupsName: 'Customized content bundle group with a long long long long long long long name',
    sidebarsHomeLibrary: ['all', 'favorites', 'recents', 'default_groups', 'my_groups'],
});

export const libraryHomeAllowNewContent = customApp.getCustomAppBody({
    version: 'v2',
    name: 'autoLibraryHomeAllowNewContent',
    contentBundleIds: ['F827F3E59B4A458B308680B700E45E14'],
    showAllContents: true,
});

// -4.Auto_web_report_in_ContentGroup

export const libraryHomeAllowNewContentReport = customApp.getCustomAppBody({
    version: 'v2',
    name: 'autoLibraryHomeAllowNewContentReport',
    contentBundleIds: ['0C268C57AF4D9FC21D290DB83C7D7FC4'],
    showAllContents: true,
});

// -1.Auto_iOS_AllowAddNewContent

export const libraryHomeAllowNewContentiOS = customApp.getCustomAppBody({
    version: 'v2',
    name: 'autoLibraryHomeAllowNewContentiOS',
    contentBundleIds: ['F827F3E59B4A458B308680B700E45E14'],
    showAllContents: true,
});

// -1.Auto_iOS_DisableAddNewContent

export const libraryHomeDisableNewContentiOS = customApp.getCustomAppBody({
    version: 'v2',
    name: 'autoLibraryHomeDisableNewContentiOS',
    contentBundleIds: ['F827F3E59B4A458B308680B700E45E14'],
});

// -2.Auto_web_report_in_ContentGroup

export const libraryHomeDisableNewContentReport = customApp.getCustomAppBody({
    version: 'v2',
    name: 'autoLibraryHomeDisableNewContentReport',
    contentBundleIds: ['0C268C57AF4D9FC21D290DB83C7D7FC4'],
});

// -3.Auto_web_report_no_ContentGroups

export const libraryHomeDisableNewContentSwitchApp = customApp.getCustomAppBody({
    version: 'v2',
    name: 'autoLibraryHomeDisableNewContentReportSwitchApp',
    contentBundleIds: ['4C6F4B3DA2474F0D43EDB4962EE4E21B'],
});

// filter panel left ----- customized body
let customizedFilterPanel = customApp.getCustomizedItemProperties('v4');
customizedFilterPanel.filter_panel = {
    panel_position: 'left',
};

// -----------------granular control----------------------
// -----------------account----------------------
let customizedItemsAccountUserName = customApp.getCustomizedItems('v3');
let customizedItemsMyApplications = customApp.getCustomizedItems('v3');
let customizedItemsManageLibrary = customApp.getCustomizedItems('v3');
let customizedItemsPreference = customApp.getCustomizedItems('v3');
let customizedItemsMyLanguage = customApp.getCustomizedItems('v3');
let customizedItemsMyTimeZone = customApp.getCustomizedItems('v3');
let customizedItemsSwitchWorkSpace = customApp.getCustomizedItems('v3');
let customizedItemsTakeATour = customApp.getCustomizedItems('v3');
let customizedItemsHelp = customApp.getCustomizedItems('v3');
let customizedItemsLogOut = customApp.getCustomizedItems('v3');
let customizedHelpLink = customApp.getCustomizedItemProperties('v3');
// let customizedProperty = postBody.customizedItemProperties_detail;
export const linkName = 'HelpTest';
export const linkAddress = 'https://aqueduct.microstrategy.com/MicroStrategyLibrary/';

customizedItemsManageLibrary.web_account_panel_manage_library = false;
customizedItemsPreference.web_account_panel_preference = false;
customizedItemsMyLanguage.web_account_panel_preference_my_language = false;
customizedItemsMyTimeZone.web_account_panel_preference_my_time_zone = false;
customizedItemsSwitchWorkSpace.web_account_panel_switch_workspace = false;
customizedItemsTakeATour.web_account_panel_take_a_tour = false;
customizedItemsHelp.web_account_panel_help = false;
customizedItemsLogOut.web_account_panel_log_out = false;

customizedHelpLink.web_account_panel_help = {
    link_name: linkName,
    address: linkAddress,
};

customizedItemsAccountUserName.web_account_panel_user_name = false;
export const disableAccountUserName = customApp.getCustomAppBody({
    version: 'v3',
    name: 'auto_disableAccountUserName',
    customizedItems: customizedItemsAccountUserName,
});

customizedItemsMyApplications.web_account_panel_my_library = false;
export const disableMyApplications = customApp.getCustomAppBody({
    version: 'v3',
    name: 'auto_disableMyApplications',
    customizedItems: customizedItemsMyApplications,
});

export const disableManageLibrary = customApp.getCustomAppBody({
    version: 'v3',
    name: 'auto_disableManageLibrary',
    customizedItems: customizedItemsManageLibrary,
});

export const disablePreference = customApp.getCustomAppBody({
    version: 'v3',
    name: 'auto_disablePreference',
    customizedItems: customizedItemsPreference,
});

export const disableMyLanguage = customApp.getCustomAppBody({
    version: 'v3',
    name: 'auto_disableMyLanguage',
    customizedItems: customizedItemsMyLanguage,
});

export const disableSwitchWorkSpace = customApp.getCustomAppBody({
    version: 'v3',
    name: 'auto_disableSwitchWorkSpace',
    customizedItems: customizedItemsSwitchWorkSpace,
});

export const disableTakeATour = customApp.getCustomAppBody({
    version: 'v3',
    name: 'auto_disableTakeATour',
    customizedItems: customizedItemsTakeATour,
});

export const disableHelp = customApp.getCustomAppBody({
    version: 'v3',
    name: 'auto_disableHelp',
    customizedItems: customizedItemsHelp,
});

export const disableLogOut = customApp.getCustomAppBody({
    version: 'v3',
    name: 'auto_disableLogOut',
    customizedItems: customizedItemsLogOut,
});

export const disableMyTimeZone = customApp.getCustomAppBody({
    version: 'v3',
    name: 'auto_disableMyTimeZone',
    customizedItems: customizedItemsMyTimeZone,
});

//
export const customizedHelpLinkBody = customApp.getCustomAppBody({
    version: 'v3',
    name: 'auto_customizedHelpLink',
    customizedItemProperties: customizedHelpLink,
});

// -----------------content info ----------------------
let customizedItemsTime = customApp.getCustomizedItems('v3');
customizedItemsTime.content_info_timestamp = false;
export const disableTimeStamp = customApp.getCustomAppBody({
    version: 'v3',
    name: 'auto_disableContentInfoTimestamp',
    customizedItems: customizedItemsTime,
});

let customizedItemsInfoWindow = customApp.getCustomizedItems('v3');
customizedItemsInfoWindow.content_info_info_window = false;
export const disableInfoWindow = customApp.getCustomAppBody({
    version: 'v3',
    name: 'auto_disableContentInfoInfoWindow',
    customizedItems: customizedItemsInfoWindow,
});

let customizedItemsContentCreator = customApp.getCustomizedItems('v3');
customizedItemsContentCreator.content_info_content_creator = false;
export const disableContentCreator = customApp.getCustomAppBody({
    version: 'v3',
    name: 'auto_disableContentInfoContentCreator',
    customizedItems: customizedItemsContentCreator,
});

let customizedItemsTimeUser = customApp.getCustomizedItems('v3');
customizedItemsTimeUser.content_info_timestamp = false;
customizedItemsTimeUser.content_info_content_creator = false;
export const disableTimeStampUser = customApp.getCustomAppBody({
    version: 'v3',
    name: 'auto_disableContentInfoTimestampCreator',
    customizedItems: customizedItemsTimeUser,
});

// -----------------filter summary----------------------
let customizedItemsFilterSummary = customApp.getCustomizedItems('v3');
let customizedItemsFilterSummaryOn = customApp.getCustomizedItems('v3');
let customizedItemsFilterSummaryOnAllowOff = customApp.getCustomizedItems('v3');
let customizedItemsFilterSummaryOnAllowOffHideOn = customApp.getCustomizedItems('v3');
let customizedItemsFilterSummaryOff = customApp.getCustomizedItems('v3');
let customizedItemsnFilterSummaryOffAllowOnHideOn = customApp.getCustomizedItems('v3');

customizedItemsFilterSummary.filter_summary = false;
export const disableFilterSumary = customApp.getCustomAppBody({
    version: 'v3',
    name: 'auto_disableFilterSumary',
    customizedItems: customizedItemsFilterSummary,
});

customizedItemsFilterSummaryOn.filter_summary = true;
customizedItemsFilterSummaryOn.control_filter_summary = true;
customizedItemsFilterSummaryOn.hide_filter_summary = true;
export const enableFilterSumaryOn = customApp.getCustomAppBody({
    version: 'v3',
    name: 'auto_disableFilterSumaryOn',
    customizedItems: customizedItemsFilterSummaryOn,
});

customizedItemsFilterSummaryOnAllowOff.filter_summary = true;
customizedItemsFilterSummaryOnAllowOff.control_filter_summary = false;
customizedItemsFilterSummaryOnAllowOff.hide_filter_summary = false;
export const enableFilterSumaryOnAllowOff = customApp.getCustomAppBody({
    version: 'v3',
    name: 'auto_disableFilterSumaryOnAllowOff',
    customizedItems: customizedItemsFilterSummaryOnAllowOff,
});

customizedItemsFilterSummaryOnAllowOffHideOn.filter_summary = true;
customizedItemsFilterSummaryOnAllowOffHideOn.control_filter_summary = false;
customizedItemsFilterSummaryOnAllowOffHideOn.hide_filter_summary = true;
export const enableFilterSumaryOnAllowOffHideOn = customApp.getCustomAppBody({
    version: 'v3',
    name: 'auto_disableFilterSumaryOnAllowOffHideOn',
    customizedItems: customizedItemsFilterSummaryOnAllowOffHideOn,
});

customizedItemsFilterSummaryOff.filter_summary = false;
customizedItemsFilterSummaryOff.hide_filter_summary = false;
customizedItemsFilterSummaryOff.control_filter_summary = false;
export const disableFilterSumaryOff = customApp.getCustomAppBody({
    version: 'v3',
    name: 'auto_disableFilterSumaryOff',
    customizedItems: customizedItemsFilterSummaryOff,
});

customizedItemsnFilterSummaryOffAllowOnHideOn.filter_summary = false;
customizedItemsnFilterSummaryOffAllowOnHideOn.control_filter_summary = true;
customizedItemsnFilterSummaryOffAllowOnHideOn.hide_filter_summary = true;
export const disableFilterSumaryOffAllowOnHideOn = customApp.getCustomAppBody({
    version: 'v3',
    name: 'auto_disableFilterSumaryOffAllowOnHideOn',
    customizedItems: customizedItemsnFilterSummaryOffAllowOnHideOn,
});

// -------------others-----------------------
let customizedItemsTocHeader = customApp.getCustomizedItems('v3');
let customizedItemsTocContentInfo = customApp.getCustomizedItems('v3');
let customizedItemsTocChapterPageName = customApp.getCustomizedItems('v3');
let customizedItemsNewDossier = customApp.getCustomizedItems('v3');
let customizedItemsNewReport = customApp.getCustomizedItems('v3');

customizedItemsTocHeader.table_of_contents_header = false;
export const disableTocHeader = customApp.getCustomAppBody({
    version: 'v3',
    name: 'auto_disableTocHeader',
    customizedItems: customizedItemsTocHeader,
});

customizedItemsTocContentInfo.table_of_contents_content_info = false;
export const disableTocContentInfo = customApp.getCustomAppBody({
    version: 'v3',
    name: 'auto_disableTocContentInfo',
    customizedItems: customizedItemsTocContentInfo,
});

customizedItemsTocChapterPageName.table_of_contents_chapter_and_page = false;
export const disableTocChapterPageName = customApp.getCustomAppBody({
    version: 'v3',
    name: 'auto_disableTocChapterPageName',
    customizedItems: customizedItemsTocChapterPageName,
});

customizedItemsNewDossier.create_new_content_dossier = false;
export const disableNewDossier = customApp.getCustomAppBody({
    version: 'v3',
    name: 'auto_disableNewDossier',
    customizedItems: customizedItemsNewDossier,
});

customizedItemsNewReport.create_new_content_report = false;
export const disableNewReport = customApp.getCustomAppBody({
    version: 'v3',
    name: 'auto_disableNewReport',
    customizedItems: customizedItemsNewReport,
});

// // no report a problem now
// let customizedEmailAddress = {
//     report_a_problem: {
//         address: 'mstr.collab@gmail.com',
//     },
// };
// export const customizedEmailAddressBody = customApp.getCustomAppBody({
//     name: 'auto_changeEmailAddress',
//     customizedItemProperties: customizedEmailAddress
// });

// ------------- share panel ---------------------------
let customizedItems_export = customApp.getCustomizedItems('v3');
let customizedItems_export_pdf = customApp.getCustomizedItems('v3');
let customizedItems_share_panel = customApp.getCustomizedItems('v3');
let customizedItems_download = customApp.getCustomizedItems('v3');
let customizedItems_subscribe = customApp.getCustomizedItems('v3');

customizedItems_export.share_panel_export_to_excel = false;
export const disableExport = customApp.getCustomAppBody({
    version: 'v3',
    name: 'auto_disableExport',
    customizedItems: customizedItems_export,
});

customizedItems_export_pdf.share_panel_export_to_pdf = false;
export const disableExportPDF = customApp.getCustomAppBody({
    version: 'v3',
    name: 'auto_disableExportPdf',
    customizedItems: customizedItems_export_pdf,
});

customizedItems_share_panel.share_panel_share = false;
export const disableSharePanel = customApp.getCustomAppBody({
    version: 'v3',
    name: 'auto_disableSharePanel',
    customizedItems: customizedItems_share_panel,
});

customizedItems_download.share_panel_download = false;
export const disableDownload = customApp.getCustomAppBody({
    version: 'v3',
    name: 'auto_disableDownload',
    customizedItems: customizedItems_download,
});

customizedItems_subscribe.share_panel_subscribe = false;
export const disableSubscribe = customApp.getCustomAppBody({
    version: 'v3',
    name: 'auto_disableSubscribe',
    customizedItems: customizedItems_subscribe,
});

// -----------------pin feature -----------------------
// ---------------- customizedItems--------------
// pin customizedItems
let pin = customApp.getCustomizedItems('v4');

// filter panel pinned and allow close
let pinFilter = customApp.getCustomizedItems('v4');
// let pinFilter = _.cloneDeep(pinBody.customizedItems_detail);
pinFilter.filter_panel_unpin = false;

// filter panel pinned and not allow close
let pinFilterNotAllowClose = customApp.getCustomizedItems('v4');
pinFilterNotAllowClose.filter_panel_unpin = false;
pinFilterNotAllowClose.filter_panel_allow_close = false;

// toc pinned
let pinToc = customApp.getCustomizedItems('v4');
pinToc.table_of_contents_unpin = false;

// toc pinned and not allow close
let pinTocNotAllowClose = customApp.getCustomizedItems('v4');
pinTocNotAllowClose.table_of_contents_unpin = false;
pinTocNotAllowClose.table_of_contents_allow_close = false;

// side bar pinned
let pinSidebar = customApp.getCustomizedItems('v4');
pinSidebar.sidebars_unpin = false;

// comment panel pinned
let pinComment = customApp.getCustomizedItems('v4');
pinComment.comments_panel_unpin = false;

// comment panel pinned and not allow close
let pinCommentNotAllowClose = customApp.getCustomizedItems('v4');
pinCommentNotAllowClose.comments_panel_allow_close = false;
pinCommentNotAllowClose.comments_panel_unpin = false;

// ai assistant
let pinAIAssistant = customApp.getCustomizedItems('v4');
pinAIAssistant.ai_assistant_unpin = false;

let pinAIAssistantNotAllowClose = customApp.getCustomizedItems('v4');
pinAIAssistantNotAllowClose.ai_assistant_unpin = false;
pinAIAssistantNotAllowClose.ai_assistant_allow_close = false;

// toc and filter pinned
let pinTocFilter = customApp.getCustomizedItems('v4');
pinTocFilter.table_of_contents_unpin = false;
pinTocFilter.filter_panel_unpin = false;

// toc and filter all pinned and all not allow close
let pinTocFilterAllNotAllowClose = customApp.getCustomizedItems('v4');
pinTocFilterAllNotAllowClose.table_of_contents_unpin = false;
pinTocFilterAllNotAllowClose.table_of_contents_allow_close = false;
pinTocFilterAllNotAllowClose.filter_panel_unpin = false;
pinTocFilterAllNotAllowClose.filter_panel_allow_close = false;

// toc and filter pinned, toc not allow close
let pinTocFilterOnlyTocNotAllowClose = customApp.getCustomizedItems('v4');
pinTocFilterOnlyTocNotAllowClose.table_of_contents_unpin = false;
pinTocFilterOnlyTocNotAllowClose.table_of_contents_allow_close = false;
pinTocFilterOnlyTocNotAllowClose.filter_panel_unpin = false;

// toc and filter pinned, filter not allow close
let pinTocFilterOnlyFilterNotAllowClose = customApp.getCustomizedItems('v4');
pinTocFilterOnlyFilterNotAllowClose.table_of_contents_unpin = false;
pinTocFilterOnlyFilterNotAllowClose.filter_panel_unpin = false;
pinTocFilterOnlyFilterNotAllowClose.filter_panel_allow_close = false;

// filter and comment pinned
let pinFilterComment = customApp.getCustomizedItems('v4');
pinFilterComment.filter_panel_unpin = false;
pinFilterComment.comments_panel_unpin = false;

// filter and comment pinned and not allow close
let pinFilterCommentAllNotAllowClose = customApp.getCustomizedItems('v4');
pinFilterCommentAllNotAllowClose.filter_panel_unpin = false;
pinFilterCommentAllNotAllowClose.comments_panel_unpin = false;
pinFilterCommentAllNotAllowClose.filter_panel_allow_close = false;
pinFilterCommentAllNotAllowClose.comments_panel_allow_close = false;

// filter and comment pinned, filter not allow close
let pinFilterCommentOnlyFilterNotAllowClose = customApp.getCustomizedItems('v4');
pinFilterCommentOnlyFilterNotAllowClose.filter_panel_unpin = false;
pinFilterCommentOnlyFilterNotAllowClose.comments_panel_unpin = false;
pinFilterCommentOnlyFilterNotAllowClose.filter_panel_allow_close = false;

// filter and comment pinned, comment not allow close
let pinFilterCommentOnlyCommentNotAllowClose = customApp.getCustomizedItems('v4');
pinFilterCommentOnlyCommentNotAllowClose.filter_panel_unpin = false;
pinFilterCommentOnlyCommentNotAllowClose.comments_panel_unpin = false;
pinFilterCommentOnlyCommentNotAllowClose.comments_panel_allow_close = false;

// comment and AIAssistant pinned
let pinCommentAIAssistant = customApp.getCustomizedItems('v4');
pinCommentAIAssistant.comments_panel_unpin = false;
pinCommentAIAssistant.ai_assistant_unpin = false;

// comment and AIAssistant pinned, both not allow close
let pinCommentAIAssistantAllNotAllowClose = customApp.getCustomizedItems('v4');
pinCommentAIAssistantAllNotAllowClose.comments_panel_unpin = false;
pinCommentAIAssistantAllNotAllowClose.ai_assistant_unpin = false;
pinCommentAIAssistantAllNotAllowClose.comments_panel_allow_close = false;
pinCommentAIAssistantAllNotAllowClose.ai_assistant_allow_close = false;

// comment and AIAssistant pinned, comment not allow close
let pinCommentAIAssistantOnlyCommentNotAllowClose = customApp.getCustomizedItems('v4');
pinCommentAIAssistantOnlyCommentNotAllowClose.comments_panel_unpin = false;
pinCommentAIAssistantOnlyCommentNotAllowClose.ai_assistant_unpin = false;
pinCommentAIAssistantOnlyCommentNotAllowClose.comments_panel_allow_close = false;

// comment and AIAssistant pinned, AIAssistant not allow close
let pinCommentAIAssistantOnlyAIAssistantNotAllowClose = customApp.getCustomizedItems('v4');
pinCommentAIAssistantOnlyAIAssistantNotAllowClose.comments_panel_unpin = false;
pinCommentAIAssistantOnlyAIAssistantNotAllowClose.ai_assistant_unpin = false;
pinCommentAIAssistantOnlyAIAssistantNotAllowClose.ai_assistant_allow_close = false;

// filter and AIAssistant pinned
let pinFilterAIAssistant = customApp.getCustomizedItems('v4');
pinFilterAIAssistant.filter_panel_unpin = false;
pinFilterAIAssistant.ai_assistant_unpin = false;

// filter and AIAssistant pinned, both not allow close
let pinFilterAIAssistantAllNotAllowClose = customApp.getCustomizedItems('v4');
pinFilterAIAssistantAllNotAllowClose.filter_panel_unpin = false;
pinFilterAIAssistantAllNotAllowClose.ai_assistant_unpin = false;
pinFilterAIAssistantAllNotAllowClose.filter_panel_allow_close = false;
pinFilterAIAssistantAllNotAllowClose.ai_assistant_allow_close = false;

// filter and AIAssistant pinned, filter not allow close
let pinFilterAIAssistantOnlyFilterNotAllowClose = customApp.getCustomizedItems('v4');
pinFilterAIAssistantOnlyFilterNotAllowClose.filter_panel_unpin = false;
pinFilterAIAssistantOnlyFilterNotAllowClose.ai_assistant_unpin = false;
pinFilterAIAssistantOnlyFilterNotAllowClose.filter_panel_allow_close = false;

// filter and AIAssistant pinned, AIAssistant not allow close
let pinFilterAIAssistantOnlyAIAssistantNotAllowClose = customApp.getCustomizedItems('v4');
pinFilterAIAssistantOnlyAIAssistantNotAllowClose.filter_panel_unpin = false;
pinFilterAIAssistantOnlyAIAssistantNotAllowClose.ai_assistant_unpin = false;
pinFilterAIAssistantOnlyAIAssistantNotAllowClose.ai_assistant_allow_close = false;

// toc comment pinned
let pinTocComment = customApp.getCustomizedItems('v4');
pinTocComment.table_of_contents_unpin = false;
pinTocComment.comments_panel_unpin = false;

// toc ai assistant pinned
let pinTocAIAssistant = customApp.getCustomizedItems('v4');
pinTocAIAssistant.table_of_contents_unpin = false;
pinTocAIAssistant.ai_assistant_unpin = false;

// ----------------- pin Body---------------------
// ---------------------pin filter ----------
export const pinFilterBody = customApp.getCustomAppBody({
    version: 'v4',
    name: 'autoPinFilterPanel',
    customizedItems: pinFilter,
});

export const pinFilterDisableToolbarBody = customApp.getCustomAppBody({
    version: 'v4',
    name: 'autoPinFilterDisableToolbar',
    customizedItems: pinFilterNotAllowClose,
    toolbarMode: 0,
    toolbarEnabled: false,
});

export const pinFilterNotAllowCloseBody = customApp.getCustomAppBody({
    version: 'v4',
    name: 'autoPinFilterNotAllowClose',
    customizedItems: pinFilterNotAllowClose,
});

// ---- left filter ------------------------------

export const leftFilterBody = customApp.getCustomAppBody({
    version: 'v4',
    name: 'autoLeftFilter',
    // customizedItems: pin,
    customizedItemProperties: customizedFilterPanel,
});

export const leftFilterCollapseToolbarBody = customApp.getCustomAppBody({
    version: 'v4',
    name: 'autoLeftFilterCollapseToolbar',
    toolbarMode: 1,
    toolbarEnabled: true,
    // customizedItems: pin,
    customizedItemProperties: customizedFilterPanel,
});

export const leftFilterPinnedBody = customApp.getCustomAppBody({
    version: 'v4',
    name: 'autoLeftFilterPinned',
    customizedItems: pinFilter,
    customizedItemProperties: customizedFilterPanel,
});

export const leftFilterPinnedNotAllowCloseDisableToolbarBody = customApp.getCustomAppBody({
    version: 'v4',
    name: 'autoLeftFilterDisableToolbar',
    customizedItems: pinFilterNotAllowClose,
    customizedItemProperties: customizedFilterPanel,
    toolbarMode: 0,
    toolbarEnabled: false,
});

// --------------- filter dossier home --------
export const pinFilterDossierHome = customApp.getCustomAppBody({
    version: 'v4',
    name: 'autoPinFilterPanelDossierHome',
    customizedItems: pinFilter,
    dossierMode: 1,
    url: `/app/${sourceDossier.project.id}/${sourceDossier.id}`,
});

export const leftFilterPinnedDossierHomeBody = customApp.getCustomAppBody({
    version: 'v4',
    name: 'autoleftFilterDossierHome',
    customizedItems: pinFilter,
    customizedItemProperties: customizedFilterPanel,
    dossierMode: 1,
    url: `/app/${sourceDossier.project.id}/${sourceDossier.id}`,
});

export const leftFilterDossierHomeBody = customApp.getCustomAppBody({
    version: 'v4',
    name: 'autoleftFilterDossierHome',
    customizedItemProperties: customizedFilterPanel,
    dossierMode: 1,
    url: `/app/${sourceDossier.project.id}/${sourceDossier.id}`,
});

export const pinFilterNotAllowCloseDossierHomeBody = customApp.getCustomAppBody({
    version: 'v4',
    name: 'autoPinFilterPanelNotAllowCloseDossierHome',
    customizedItems: pinFilterNotAllowClose,
    dossierMode: 1,
    url: `/app/${sourceDossier.project.id}/${sourceDossier.id}`,
});

// ----------------------pin toc -------------------

export const pinTocBody = customApp.getCustomAppBody({
    version: 'v4',
    name: 'autoPinToc',
    customizedItems: pinToc,
});

export const pinTocDisableToolbarBody = customApp.getCustomAppBody({
    version: 'v4',
    name: 'autoPinTocdisableToolbar',
    customizedItems: pinTocNotAllowClose,
    toolbarMode: 0,
    toolbarEnabled: false,
});

export const pinTocNotAllowCloseBody = customApp.getCustomAppBody({
    version: 'v4',
    name: 'autoPinTocNotAllowClose',
    customizedItems: pinTocNotAllowClose,
});

// ------------------pin sidebar--------------------------

export const pinSidebarBody = customApp.getCustomAppBody({
    version: 'v4',
    name: 'pinSidebar',
    customizedItems: pinSidebar,
});

export const pinSideBarDisableToolbarBody = customApp.getCustomAppBody({
    version: 'v4',
    name: 'autoPinSidebarDisableToolbar',
    customizedItems: pinSidebar,
    toolbarMode: 0,
    toolbarEnabled: false,
});

// ----------------pin comment ------------------------

export const pinCommentBody = customApp.getCustomAppBody({
    version: 'v4',
    name: 'pinComment_xfunc1',
    customizedItems: pinComment,
});

export const pinCommentHomeDossierBody = customApp.getCustomAppBody({
    version: 'v4',
    name: 'autoPinCommentPanel',
    customizedItems: pinComment,
    dossierMode: 1,
    url: `/app/${sourceDossier.project.id}/${sourceDossier.id}`,
});

export const pinCommentDisableToolbarHomeDossierBody = customApp.getCustomAppBody({
    version: 'v4',
    name: 'autoPinCommentPanelDisableToolbar',
    customizedItems: pinCommentNotAllowClose,
    toolbarMode: 0,
    toolbarEnabled: false,
    dossierMode: 1,
    url: `/app/${sourceDossier.project.id}/${sourceDossier.id}`,
});

export const pinCommentDisableToolbarLibraryHome = customApp.getCustomAppBody({
    version: 'v4',
    name: 'autoPinCommentPanelDisableToolbarLibraryHome',
    customizedItems: pinCommentNotAllowClose,
    toolbarMode: 0,
    toolbarEnabled: false,
});

export const pinCommenNotAllowCloseHomeDossierBody = customApp.getCustomAppBody({
    version: 'v4',
    name: 'autoPinCommentPanelNotAllowClose',
    customizedItems: pinCommentNotAllowClose,
    dossierMode: 1,
    url: `/app/${sourceDossier.project.id}/${sourceDossier.id}`,
});

// --------------- pin AI Assistant ------------

export const pinAIAssistantBody = customApp.getCustomAppBody({
    version: 'v4',
    name: 'autopinAIAssistant',
    customizedItems: pinAIAssistant,
});

export const pinAIAssistantNotAllowCloseBody = customApp.getCustomAppBody({
    version: 'v4',
    name: 'autopinAIAssistantNotAllowClose',
    customizedItems: pinAIAssistantNotAllowClose,
});

export const pinAIAssistantDisableToolbarBody = customApp.getCustomAppBody({
    version: 'v4',
    name: 'autoPinAIAssistantDisableToolbar',
    customizedItems: pinAIAssistantNotAllowClose,
    toolbarMode: 0,
    toolbarEnabled: false,
});

// ------------------xfunc---------------

export const pinTocLeftFilterBody = customApp.getCustomAppBody({
    version: 'v4',
    name: 'autoPinTocLeftFilter',
    customizedItems: pinToc,
    customizedItemProperties: customizedFilterPanel,
});

// pin TOC + left filter (allow close)

export const pinTocLeftFilterPinnedBody = customApp.getCustomAppBody({
    version: 'v4',
    name: 'autoPinTocLeftFilter',
    customizedItems: pinTocFilter,
    customizedItemProperties: customizedFilterPanel,
});

// pin toc, left filter (not allow close)

export const pinTocLeftFilterAllNotAllowCloseBody = customApp.getCustomAppBody({
    version: 'v4',
    name: 'autoPinTocLeftFilterAllNotAllowClose',
    customizedItems: pinTocFilterAllNotAllowClose,
    customizedItemProperties: customizedFilterPanel,
});

// pin toc, left filter (toc not allow close)

export const pinTocLeftFilterOnlyTocNotAllowCloseBody = customApp.getCustomAppBody({
    version: 'v4',
    name: 'autoPinTocLeftFilterOnlyTocNotAllowClose',
    customizedItems: pinTocFilterOnlyTocNotAllowClose,
    customizedItemProperties: customizedFilterPanel,
});

// pin toc, left filter (filter not allow close)

export const pinTocLeftFilterOnlyFilterNotAllowCloseBody = customApp.getCustomAppBody({
    version: 'v4',
    name: 'autoPinTocLeftFilterOnlyFilterNotAllowClose',
    customizedItems: pinTocFilterOnlyFilterNotAllowClose,
    customizedItemProperties: customizedFilterPanel,
});

// pin filter right + pin comment (allow close)

export const pinFilterCommentBody = customApp.getCustomAppBody({
    version: 'v4',
    name: 'autoPinFilterComment',
    customizedItems: pinFilterComment,
});

// pin filter right + pin comment (not allow close)

export const pinFilterCommentAllNotAllowCloseBody = customApp.getCustomAppBody({
    version: 'v4',
    name: 'autoPinFilterCommentAllNotAllowClose',
    customizedItems: pinFilterCommentAllNotAllowClose,
});

// pin filter right + pin comment (filter not allow close)

export const pinFilterCommentOnlyFilterNotAllowCloseBody = customApp.getCustomAppBody({
    version: 'v4',
    name: 'autoPinFilterCommentOnlyFilterNotAllowClose',
    customizedItems: pinFilterCommentOnlyFilterNotAllowClose,
});

// pin filter right + pin comment (comment not allow close)

export const pinFilterCommentOnlyCommentNotAllowCloseBody = customApp.getCustomAppBody({
    version: 'v4',
    name: 'autoPinFilterCommentOnlyCommentNotAllowClose',
    customizedItems: pinFilterCommentOnlyCommentNotAllowClose,
});

// pin toc + filter (right)

export const pinTocFilterBody = customApp.getCustomAppBody({
    version: 'v4',
    name: 'autoPinTocFilter',
    customizedItems: pinTocFilter,
});

// pin toc + comment

export const pinTocCommentBody = customApp.getCustomAppBody({
    version: 'v4',
    name: 'autoPinTocComment',
    customizedItems: pinTocComment,
});

// pin toc + AIAssistant

export const pinTocAIAssistantBody = customApp.getCustomAppBody({
    version: 'v4',
    name: 'autoPinTocAIAssistant',
    customizedItems: pinTocAIAssistant,
});

// pin filter left + comment

export const pinFilterLeftCommentBody = customApp.getCustomAppBody({
    version: 'v4',
    name: 'autoPinFilterCommentLeft',
    customizedItems: pinFilterComment,
    customizedItemProperties: customizedFilterPanel,
});

// pin filter left + AIAssistant
export const pinFilterLeftAIAssistantBody = customApp.getCustomAppBody({
    version: 'v4',
    name: 'autoPinFilterAIAssistantLeft',
    customizedItems: pinFilterAIAssistant,
    customizedItemProperties: customizedFilterPanel,
});

// pin filter + AIAssistant

export const pinFilterAIAssistantBody = customApp.getCustomAppBody({
    version: 'v4',
    name: 'autoPinFilterAIAssistant',
    customizedItems: pinFilterAIAssistant,
});

// pin filter + AIAssistant (not allow close)

export const pinFilterAIAssistantAllNotAllowCloseBody = customApp.getCustomAppBody({
    version: 'v4',
    name: 'autoPinFilterAIAssistantAllNotAllowClose',
    customizedItems: pinFilterAIAssistantAllNotAllowClose,
});

// pin filter + AIAssistant (filter not allow close)

export const pinFilterAIAssistantOnlyFilterNotAllowCloseBody = customApp.getCustomAppBody({
    version: 'v4',
    name: 'autoPinFilterAIAssistantOnlyFilterNotAllowClose',
    customizedItems: pinFilterAIAssistantOnlyFilterNotAllowClose,
});

// pin filter + AIAssistant (AIAssistant not allow close)

export const pinFilterAIAssistantOnlyAIAssistantNotAllowCloseBody = customApp.getCustomAppBody({
    version: 'v4',
    name: 'autoPinFilterAIAssistantOnlyAIAssistantNotAllowClose',
    customizedItems: pinFilterAIAssistantOnlyAIAssistantNotAllowClose,
});

// pin comment + AIAssistant

export const pinCommentAIAssistantBody = customApp.getCustomAppBody({
    version: 'v4',
    name: 'autoPinCommentAIAssistant',
    customizedItems: pinCommentAIAssistantOnlyCommentNotAllowClose,
});

// pin comment + AIAssistant(not allow close)

export const pinCommentAIAssistantAllNotAllowCloseBody = customApp.getCustomAppBody({
    version: 'v4',
    name: 'autoPinCommentAIAssistantAllNotAllowClose',
    customizedItems: pinCommentAIAssistantAllNotAllowClose,
});

// pin comment + AIAssistant (AIAssistant not allow close)

export const pinCommentAIAssistantOnlyAIAssistantNotAllowCloseBody = customApp.getCustomAppBody({
    version: 'v4',
    name: 'autoPinCommentAIAssistantOnlyAIAssistantNotAllowClose',
    customizedItems: pinCommentAIAssistantOnlyAIAssistantNotAllowClose,
});

// pin comment + AIAssistant (comment not allow close)

export const pinCommentAIAssistantOnlyCommentNotAllowCloseBody = customApp.getCustomAppBody({
    version: 'v4',
    name: 'autoPinCommentAIAssistantOnlyCommentNotAllowClose',
    customizedItems: pinCommentAIAssistantOnlyCommentNotAllowClose,
});

// ----------------PPT adds-in ------------------------

export const LibraryAsHomeCustomAppObj = customApp.getCustomAppBody({
    version: 'v4',
    name: 'auto_PPT_Adds_in_test_LH',
});

export const DossierAsHomeCustomAppObj = customApp.getCustomAppBody({
    version: 'v4',
    name: 'autotest_dossierhome_bm',
    dossierMode: 1,
    url: 'app/' + homeDossier.project.id + '/' + homeDossier.id,
});

export function getDocAsHome({ name, projectId, docId }) {
    return customApp.getCustomAppBody({
        version: 'v5',
        name: `autotest_DocAsHome_${name}`,
        dossierMode: 1,
        url: 'app/' + projectId + '/' + docId,
    });
}

// ----------------Bot as Home ------------------------

export const bydBotAsHomeCustomAppObj = customApp.getCustomAppBody({
    version: 'v5',
    name: 'autotest_botashome',
    dossierMode: 2,
    url: 'app/' + autoBydBotNoSuggestion.project.id + '/' + autoBydBotNoSuggestion.id,
});

export const bydBotAsHomeDisableToolbar = customApp.getCustomAppBody({
    version: 'v5',
    name: 'autotest_botashome',
    dossierMode: 2,
    url: 'app/' + autoBydBotNoSuggestion.project.id + '/' + autoBydBotNoSuggestion.id,
    toolbarEnabled: false,
    description: 'bot as home disable toolbar',
});

export const bydBotAsHomeCollapseToolbar = customApp.getCustomAppBody({
    version: 'v5',
    name: 'autotest_botashome',
    dossierMode: 2,
    url: 'app/' + autoBydBotNoSuggestion.project.id + '/' + autoBydBotNoSuggestion.id,
    toolbarMode: 1,
    toolbarEnabled: true,
    description: 'bot as home collapse toolbar',
});

let disableBotSharePanel = customApp.getCustomizedItems('v5');
disableBotSharePanel.bot_window_share_panel = false;
export const bydBotAsHomeDisableShareEntry = customApp.getCustomAppBody({
    version: 'v5',
    name: 'autotest_botashome',
    dossierMode: 2,
    url: 'app/' + autoBydBotNoSuggestion.project.id + '/' + autoBydBotNoSuggestion.id,
    customizedItems: disableBotSharePanel,
});

export const bydBotAsHomeDisableEditBotAndAccount = customApp.getCustomAppBody({
    version: 'v5',
    name: 'autotest_botashome',
    dossierMode: 2,
    url: 'app/' + autoBydBotNoSuggestion.project.id + '/' + autoBydBotNoSuggestion.id,
    iconsHomeDocument: ['table_of_contents', 'reset', 'bookmarks', 'filters', 'comments', 'share', 'notifications'],
});

export function getBotAsHomeCustomAppObjByBotId({
    name = 'autotest_botashome_' + customApp.randomString(6),
    projectId = autoBydBotNoSuggestion.project.id,
    botId,
}) {
    return customApp.getCustomAppBody({
        version: 'v5',
        name,
        dossierMode: 2,
        url: 'app/' + projectId + '/' + botId,
    });
}

let disableSnapshot = customApp.getCustomizedItems('v5');
disableSnapshot.sidebar_snapshots = false;
let disableSubscribeToSnapshot = customApp.getCustomizedItems('v5');
disableSubscribeToSnapshot.snapshot = false;

export const disableSnapshotCustomAppObj = customApp.getCustomAppBody({
    version: 'v5',
    name: 'auto_disableSnapshot',
    customizedItems: disableSnapshot,
});
export const disableSubscribeToSnapshotCustomAppObj = customApp.getCustomAppBody({
    version: 'v5',
    name: 'auto_disableSubscribeToSnapshot',
    customizedItems: disableSubscribeToSnapshot,
});
export const customFontCustomAppObj = customApp.getCustomAppBody({
    version: 'v7',
    name: 'auto_customFont',
    applicationDefaultFont: 'Dangrek',
});
export const unsubscribeCustomAppObj = customApp.getCustomAppBody({
    version: 'v7',
    name: 'auto_unsubscribe',
    enabled: true,
});

const reportViewFilter = customApp.getCustomizedItems('v5');
export const reportViewFilterOffCustomAppObj = customApp.getCustomAppBody({
    version: 'v5',
    name: 'auto_reportViewFilterOff',
    customizedItems: { ...reportViewFilter, report_view_filter: false },
});
export const reportViewFilterOnCustomAppObj = customApp.getCustomAppBody({
    version: 'v5',
    name: 'auto_reportViewFilterOn',
    customizedItems: { ...reportViewFilter, report_view_filter: true },
});
