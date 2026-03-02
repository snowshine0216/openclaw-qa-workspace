import { randomString } from './customApp/customAppBody.js';

/**
 * MicroStrategy Tutorial: B7CA92F04B9FAE8D941C3E9B7E0CD754 by default
 * Data set: byd_balance_ds_en(2F4F0B6753429DF701EB65AA27B63068) by default
 */
export function getBotObjectToCreate({
    projectId = 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
    projectName = 'MicroStrategy Tutorial',
    botName,
    datasets = [
        {
            id: '2F4F0B6753429DF701EB65AA27B63068',
            name: 'byd_balance_ds_en',
        },
    ],
    folderId = 'D3C7D461F69C4610AA6BAA5EF51F4125',
}) {
    const BotToCreate = {
        project: {
            id: projectId,
            name: projectName,
        },
        configuration: getBotConfigurationObject({}),
        data: {
            datasets,
            isBot: true,
            overwrite: true,
            name: botName,
            description: '',
            folderId, //Tutorial > Public Objects > Reports
        },
    };
    return BotToCreate;
}

export const mstrUser = {
    username: 'mstr1',
    password: 'newman1#',
};

export const aclTestUser = {
    username: 'noAclUserAuto',
    password: 'newman1#',
    id: 'AC6749EE704B3BF30AA9429718E93C4E',
};

export const noRunBotTestUser = {
    username: 'noRunBotTestUser',
    password: 'newman1#',
    id: 'AE10571F03448FC865F7BDAEEF672A6D',
};

export const botCubeNotPublish = {
    projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
    botId: 'E2F1B6A4C2402B1F01226FB4B295BF11',
    name: 'Bot Cube Not Publish',
};

export const appUser = {
    credentials: {
        username: 'app',
        password: '',
    },
};

export const botUser = {
    credentials: {
        username: 'bot_palette',
        password: '',
    },
};

export const configBotUser = {
    username: 'botConfig',
    password: 'newman1#',
    id: '9A424D5159437DCE24326998A3CF0D76',
};

export const dataBotUser = {
    username: 'dauto',
    password: '',
};

export const noACLBotUser = {
    username: 'noacl',
    password: '',
};

export const noAnyPrivilegeBotUser = {
    username: 'nodi',
    password: '',
};

export const noDataImportBotUser = {
    username: 'nodimport',
    password: '',
};

export const dataI18BotUser = {
    username: 'dch',
    password: '',
};

export const botAdModeUser = {
    username: 'botadmode',
    password: '',
};

export const snapshotBotUser = {
    username: 'auto_ai_snapshot',
    password: '',
};

export const snapshotNormalUser = {
    username: 'auto_snapshot_normal',
    password: '',
};

export const snapshotBotUserChinese = {
    username: 'auto_ai_snapshot_cn',
    password: '',
};

export const snapshotBotUserGerman = {
    username: 'auto_ai_snapshot_de',
    password: '',
};

export const seamlessEditBotUser = {
    username: 'botSeamless',
    password: 'newman1#',
};

export const botEdit_NoBotPrivilegeUser = {
    username: 'botEdit_NoBotPrivilege',
    password: 'newman1#',
};

export const certifyBotUser = {
    username: 'botCertify',
    password: 'newman1#',
};

export const nonCertifyBotUser = {
    username: 'botNoCertify',
    password: 'newman1#',
};

export const otherCertifyBotUser = {
    username: 'botCertify2',
    password: 'newman1#',
};

export const botSeamlessEditMultiDatasetUser = {
    username: 'bot_seamless_edit_multi_dataset',
    password: '',
};

export const createBotUser = {
    username: 'botCreate',
    password: 'newman1#',
};

export const nonCertifyCreateBotUser = {
    username: 'botCreate_NoCertify',
    password: 'newman1#',
};

export const noCreateAndEditBot_EditBotUser = {
    username: 'botEdit_NoCreateAndEdit',
    password: 'newman1#',
};

export const noEditPermission_EditBotUser = {
    username: 'botNoEditPermisson',
    password: 'newman1#',
};

export const consumptionResponsiveBotUser = {
    username: 'botResponsive',
    password: 'newman1#',
};

export const chatPanelUser = {
    username: 'botChatPanel',
    password: '',
};

export const botLearningUser = {
    username: 'botLearning',
    password: '',
};

export const txnAutoUser = {
    username: 'txnAutoUser',
    password: 'abcd1234',
};

export const autoBotNoEditPrivilegeUser = {
    username: 'Auto_Bot_NoEditPrivilege',
    password: '',
};

export const botPerfUser = {
    username: 'botPerf',
    password: '',
};

export const botChnUser = {
    username: 'botChn',
    password: '',
};

export const botChatConfigI18NUser = {
    username: 'botChatI18N',
    password: '1qaz',
    id: 'F14643119F40229BF722FF876A8B54CF',
};

export const botConfigTopicUser = {
    username: 'botConfigTopic',
    password: '',
};

export const botConfigUsageUser = {
    username: 'botUsage',
    password: '',
    id: 'EA4554646547DC807B66178395419021',
};

export const botConfigLearningUser = {
    username: 'botConfigLearning',
    password: '',
    id: 'ADCA74DC4EFE543548A71DAECBA8EDF1',
};

export const botCustomizationUser = {
    username: 'botCustomization',
    password: '',
    id: '890A2C2947FB731BBA7ADA9ED4E0FADF',
};

export const botChatPanelPreMergeUser = {
    username: 'mstr_pre',
    password: '',
};

export const botConfigI18BotUser = {
    username: 'botConfigi18N',
    password: '',
    id: '6C197AA07C4546E76CDC19B2D7EBB259',
};

export const snapshotPerfUser = {
    username: 'snapshotperf',
    password: '',
};

export const nuggetTestUser = {
    username: 'nuggets_auto',
    password: 'newman1#',
    id: '04BE3023EF4DBFE9735CD1BB1AAF4A38',
};

// no upload knowledge asset privilege, user locale is Chinese
export const nuggetTesti18nUser = {
    username: 'nuggets_without_privilege_i18n',
    password: 'newman1#',
    //83620
    // id: 'F3311E6BDE4F254CEC202D8E4C2766BA',
    // ze4yt
    id: '6C8AF11DEC41E95B7B39FD88726968CB',
};

export const nuggetWithoutPrivilegeUser = {
    username: 'nuggets_without_privilege',
    password: 'newman1#',
    // 83620
    // id: '61E152D3154CA1F3C05A3E88F06223BA',
    // ze4yt
    id: 'DF5E7AB74D4D1D381299A096B3DB02B8',
};

export const saasQuestionUser = {
    username: 'tester_saas_question',
    password: '12345678',
    id: '7A1175F27A4BC3D458979080E79132F5',
};

export const noExecuteUser = {
    username: 'noExecuteUser',
    password: 'newman1#',
};

export const exportFrontendUser = {
    username: 'auto_frontend',
    password: 'newman1#',
};

export const exportRESTUser = {
    username: 'exportREST',
    password: '',
};

export const exportSubscriptionUser = {
    username: 'auto_subscription_resize',
    password: 'newman1#',
};

export const exportSnapshotUser = {
    username: 'auto_subscription_snapshot',
    password: 'newman1#',
};

export const botTopici18NUser = {
    username: 'botTopicI18N',
    password: 'newman1#',
};

export const botTopicZHCNUser = {
    username: 'botTopicZHCN',
    password: 'newman1#',
};

export const botLearningIndicatorUser = {
    username: 'botLearningIndicator',
    password: '123',
};

export const botLearningIndicatorE2EUser = {
    username: 'botLearningIndicator_E2E',
    password: '123',
};

export const botLearningIndicatorChnUser = {
    username: 'botLearningIndicator_chn',
    password: '123',
};

export const conEduProId = 'CE52831411E696C8BD2F0080EFD5AF44';
export const conEduProName = 'Consolidated Education Project';
export const paletteSunsetId = 'B6654D1740BD840202B8FCA31B55484C';
export const paletteHummingBirdId = 'F468B7C44FA0FF5A5E2306A9528B97C9';
export const paletteQuestion = 'What are the top 5 items in terms of cost? Show in bar chart.';
export const paletteQuestion2 = 'Show the top 5 items sold in bar chart.';
export const paletteQuestion3 = 'Show me the elements of Subcategory in bar chart.';
export const paletteQuestion4 = 'Use bar to display the top 2 most profitable brands.';
export const message = 'a'.repeat(2500);
export const dataset = 'Sales Data';
export const botNameProjectCustomPalette = 'Auto_NewBotInProjectSpecificPalette';
export const botNameAppDefaultPalette = 'Auto_NewBotInAppDefaultPalette';
export const botNameAppCustomPalette = 'Auto_NewBotInAppCustomPalette';
export const green = ['fill:rgb(29,111,49);'];
export const black = ['fill:rgb(0,0,0);'];
export const blue = ['fill:rgb(15,96,149);'];
export const categorical = ['fill:rgb(21,155,152);'];
export const sunset = ['fill:rgb(206,45,39);'];
export const hummingbird = ['fill:rgb(217,6,223);'];
export const vernal = ['fill:rgb(234,247,129)'];

export const botInProjectDefaultPaletteCategorical = {
    id: '77E9A259184C299E6B0CE0891F4BF141',
    name: 'Auto_BotInProjectDefaultPaletteCategorical',
    project: {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    },
};

export const botInProjectSpecificPaletteSunset = {
    id: 'A93171FCD0452EBF6FD1A39FF2D65CE6',
    name: 'Auto_BotInProjectSpecificPaletteSunset',
    project: {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    },
};

export const botInAppDefaultPaletteSunset = {
    id: 'E9E67FA4014A20E1F6565C8C68DF443A',
    name: 'Auto_BotInAppDefaultPaletteSunset',
    project: {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    },
};

export const botInAppSpecificPaletteHummingBird = {
    id: '3A460B2259401EF0C18341B85E8D5D66',
    name: 'Auto_BotInAppSpecificPaletteHummingBird',
    project: {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    },
};

export function getBotObject({ botId, botName, projectId = 'B7CA92F04B9FAE8D941C3E9B7E0CD754' }) {
    let botObject = {
        id: botId,
        name: botName,
        project: {
            id: projectId,
            name: 'MicroStrategy Tutorial',
        },
        type: 55,
    };
    return botObject;
}

export function getBotAcl({ aclValue, userId, username }) {
    let botAcl = {
        value: aclValue,
        id: userId,
        name: username,
    };
    return botAcl;
}

export function getBot({ botId, botName, projectId = 'B7CA92F04B9FAE8D941C3E9B7E0CD754' }) {
    let bot = {
        id: botId,
        name: botName,
        project: {
            id: projectId,
        },
    };
    return bot;
}

export function getBotToCreate({
    botName,
    datasets = [
        {
            id: '102638AC11E5CC7C00000080EFB57A54',
            name: 'Sales Data',
        },
    ],
}) {
    let botToCreate = {
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        },
        data: {
            datasets: datasets,
            isBot: true,
            overwrite: true,
            name: botName,
            description: '',
            folderId: 'D3C7D461F69C4610AA6BAA5EF51F4125',
        },
    };
    return botToCreate;
}

export const publishInfo = {
    type: 'document_definition',
    recipients: [
        {
            id: 'B56F132AE6445C0CBAF9589BAC1681B9',
        },
    ],
    projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
};

export const paletteWithLongNameBody = getColorPaletteBody(
    'Auto palette with lonnnnnnnnnnnnng name' + randomString(6),
    [
        '14277371',
        '13033215',
        '11793407',
        '13235681',
        '15791831',
        '15854812',
        '16768478',
        '16763613',
        '10134269',
        '9154303',
        '8377594',
        '10674879',
        '14147242',
        '14535846',
        '14720925',
        '14522036',
    ]
);

export const paletteGreenBody = getColorPaletteBody('Auto Green Palette' + randomString(6), [
    '3239709',
    '13235681',
    '7319096',
    '6474115',
    '10674879',
]);

export const paletteBlackBody = getColorPaletteBody('Auto Black Palette' + randomString(6), [
    '0',
    '14606046',
    '3815477',
    '11250603',
    '7105644',
]);

export const paletteBlueBody = getColorPaletteBody('Auto Blue Palette' + randomString(6), [
    '9789455',
    '15854812',
    '13929756',
    '14535846',
    '14049359',
]);

export function getColorPaletteBody(name, colors) {
    let paletteBody = {
        name: name,
        description: 'auto',
        abbreviation: 'auto',
        colors: colors,
    };
    return paletteBody;
}

/**
 * UserId of botConfig: 9A424D5159437DCE24326998A3CF0D76
 */
export function getPublishInfo({
    botId,
    projectId = 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
    recipients = [
        {
            id: '9A424D5159437DCE24326998A3CF0D76',
        },
    ],
}) {
    const publishInfo = {
        id: botId,
        type: 'document_definition',
        recipients,
        projectId,
    };
    return publishInfo;
}

/**
 * MicroStrategy Tutorial: B7CA92F04B9FAE8D941C3E9B7E0CD754 by default
 * Data set: byd_balance_ds_en(2F4F0B6753429DF701EB65AA27B63068) by default
 */
export function getBotObjectInfo({
    projectId = 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
    botName,
    datasets = [
        {
            id: '2F4F0B6753429DF701EB65AA27B63068',
            name: 'byd_balance_ds_en',
        },
    ],
}) {
    const BotToCreate = {
        project: {
            id: projectId,
        },
        data: {
            datasets,
            isBot: true,
            overwrite: true,
            name: botName,
            description: '',
            folderId: 'D3C7D461F69C4610AA6BAA5EF51F4125', //Tutorial > Public Objects > Reports
        },
    };
    return BotToCreate;
}

export function getBotConfigurationObject(options) {
    const {
        active = true,
        enableSnapshot = true,
        enableQuestionSuggestions = false,
        enableTopics = false,
        enableInterpretation = false,
        coverImageUrl = '',
        // in v1, no enableTopics and enableInterpretation
        version = 'v2',
    } = options;

    const configuration = {
        general: {
            features: {
                saving_to_snapshots: enableSnapshot,
                ...(version === 'v2' && {
                    question_interpretation: enableInterpretation,
                    topics_panel: enableTopics,
                }),
            },
            questionInput: {
                enableQuestionSuggestions,
                autoSuggestionsAmount: 3,
                customSuggestions: [],
                hint: 'Ask me a question.',
            },
            topics: [],
            historyTopics: [],
            externalLinks: [],
            linkFormat: 'text',
            coverImageUrl,
            enableTopics,
            active,
            maxQuestionPerUserPerMonth: -1,
            name: 'New Bot',
            greeting: ' ',
        },
        customInstructions: {
            businessInfo: '',
            responseStyle: '',
            enabled: false,
        },
    };

    if (version === 'v2') {
        configuration.general.topics = [];
        configuration.general.historyTopics = [];
        configuration.general.enableTopics = enableTopics;
    }
    return configuration;
}

// v2: 23.12, enableTopics and enableInterpretation
export function getBotObjectToEdit(options) {
    const {
        projectId = 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        botName,
        id,
        folderId = 'D3C7D461F69C4610AA6BAA5EF51F4125',
        // active = true,
        // enableSnapshot = true,
        // enableInterpretation = false,
        // nuggetsMissing = false,
        datasets = [
            {
                id: '2F4F0B6753429DF701EB65AA27B63068',
                name: 'byd_balance_ds_en',
            },
        ],
        version,
        nuggetsIdList = [],
        ...configOptions
    } = options;
    const normalizedDatasets = datasets.map((dataset) => ({
        id: dataset.id || '2F4F0B6753429DF701EB65AA27B63068',
        name: dataset.name || 'byd_balance_ds_en',
    }));
    const botToEdit = {
        project: {
            id: projectId,
        },
        id,
        name: botName,
        configuration: getBotConfigurationObject({ ...configOptions, version }),
        data: {
            datasets: normalizedDatasets,
            isBot: true,
            overwrite: true,
            name: botName,
            description: '',
            folderId, //Tutorial > Public Objects > Reports
        },
    };
    if (typeof version !== 'undefined') {
        const nuggetList = nuggetsIdList.map((item) => ({ id: item }));
        botToEdit.nuggets = { nuggets: nuggetList };
    }
    return botToEdit;
}

export const customSuggestionsSamples = [
    'Show me all data source',
    'Show me the index by type',
    'Show me data in DESC',
    'Show me prepayment trend by type',
    'Show me Capital reserve trend by Updated date',
];

export const botSettings = {
    maxQuestionLimit: '999999',
    greetingMaxLength: 500,
    hintMaxLength: 200,
    botNameMaxLength: 50,
    defaultGreeting: `Hello! I'm New Bot, your virtual assistant. How can I guide you today?`,
    defaultBotName: 'New Bot',
    interpretationTooltipText: 'Allow users to see how Bots interpreted their question.',
    linkSettingsTooltipText: 'Add links to external websites.',
    botNameInvalidInputCharactersErrorMessage: 'The name cannot contain the following characters \\ " [ ].',
    botNameInvalidErrorMessageInChinese: '名称中不得包含以下字符: " \\ [ ]。',
    coverImageUrlTooLongErrorMessage: 'The URL cannot exceed the maximum length of 250 characters.',
    coverImageUrlNotAccessibleErrorMessage: 'Ensure that the URL points to a valid image file.',
    coverImageUrlPrefixErrorMessage: 'Enter a URL with http or https protocol.',
    linkUrlInvalidErrorMessage: 'Please enter a valid URL',
    inactiveBotBannerMessage: 'This bot is currently inactive. Consumers are not able to use it until reactivated.',
    botLogoTooltipText: 'To change the bot logo, please update the cover image.',
};

export const languageIdMap = {
    ChineseSimplified: '000008044F95EF3956E52781700C1E7A',
    EnglishUnitedStates: '000004094F95EF3956E52781700C1E7A',
    EnglishUnitedKindom: '000008094F95EF3956E52781700C1E7A',
    Japanese: '000004114F95EF3956E52781700C1E7A',
};

export const newDIUILabels = {
    English: {
        sampleFileDataSource: 'Sample Files',
        dataSourceTitle: 'Data Sources',
        airlineSampleData: 'Airline Sample Data',
        airlineSampleDataFileName: 'airline-sample-data.xls',
        airlineSampleDataOnSaaS: 'Airline Sample',
        airlineSampleDataFileNameOnSaaS: 'airline-sample-data-v2.xlsx',
        import: 'Import',
        create: 'Create',
    },
    Chinese: {
        sampleFileDataSource: '示例文件',
        dataSourceTitle: '数据源',
        airlineSampleData: '航线示例数据',
        airlineSampleDataOnSaaS: '航线示例数据',
        import: '导入',
        create: '创建',
    },
};

export const nuggetsUIStringLabels = {
    missingNuggetBannerMessage:
        'This bot has been automatically set to inactive due to the missing knowledge file. Please re-upload the file and activate the bot.',
    missingNuggetTooltipText: 'Missing file. Re-upload the file to use the knowledge.',
    activeToggleTooltipText: 'You cannot activate the bot because the knowledge file is missing.',
    nuggetProgressErrorTooltipText: 'Failed to get security scan clearance',
    disableNuggetTooltipText:
        'The Knowledge feature is currently not usable due to the AI Search Service being unavailable. Please contact your administrator.',
};

export const colorOfIcons = {
    attributeColor: '#97E5D7',
    metricColor: '#E9932C',
};

export const noPrivilegeMessage = '\nNeed privilege to upload knowledge.';
export const noPrivilegeMessageInChinese = '\n需要权限才能上传知识。';
export const reuploadErrorMessageInChinese = '\n没有"写入"权限，或缺少重新上传知识资产的权限。';
export const noReadAclMessage = '\nLack "Read" access to view knowledge details.';
export const noReadAclMessageInChinese = '\n没有"读取"权限，无法查看知识详细信息。';
export const noExecuteAclMessage =
    '\nLack "Execute" access, bot will not be able to reference the knowledge while answering questions.';
export const noExecuteAclMessageInChinese = '\n缺少"执行"访问权限，机器人在回答问题时将无法引用该知识。';
export const inheritedMessageTitle = 'Inherited knowledge:';
export const inheritedMessage = 'the bot possesses inherited knowledge assets.';
export const inheritedMessageTitleInChinese = '继承的知识:';
export const inheritedMessageInChinese = '机器人拥有继承的知识资产。';

export const project = {
    id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
    name: 'MicroStrategy Tutorial',
};

export const thumbDownNewBot = {
    project: {
        id: conEduProId,
    },
    data: {
        datasets: [
            {
                id: '00813CDECB4422AA184B3FAEF558FAC2',
                name: 'World populations',
            },
        ],
        isBot: true,
        overwrite: true,
        name: 'ThumbDownNewBot',
        description: '',
        folderId: '39B11E2F0A44783516992789E841A8F1',
    },
};

export const thumbDownMessageInfo = {
    questionId: 'DCB0B2D4C47A4D6B0B1A436359FA5509',
    question: {
        text: 'Hi',
    },
    answers: [
        {
            text: '{"text":"Hello! How can I assist you with your data today?"}',
            type: 'markdown',
            cache: {},
        },
    ],
};

export const longAlternatives = [
    'Mocked Long Question1: According to Peakon Employee Satisfaction Score, please try to find the top departments with best performance using a beautiful bar chart?',
    'Mocked Long Question2: According to Peakon Employee Satisfaction Score, please try to find the top departments with best performance using a beautiful bar chart?',
    'Mocked Short Question3',
    'Mocked Short Question4',
];

export const longSuggestions = [
    'Mocked Long Suggestion1: According to Peakon Employee Satisfaction Score, please try to find the top DOJ with best performance using a beautiful bar chart? ',
    'Mocked Long Suggestion2: According to Peakon Employee Satisfaction Score, please try to find the top Email with best performance using a beautiful bar chart?',
    'Show the best performance Gender',
    'Show the best performance Experience Bracket',
];

export const messageDownloadLearning = {
    English: {
        tile: 'CONSOLIDATED LEARNING',
        warning: 'Adaptive Learning is currently turned off in this application.',
        tooltip:
            'Download a file of all learnings gathered from user interactions with this bot, suitable for review and broader application.',
        error: 'Download failed. Please try again.',
        privilegeError: 'Download failed: You do not have the required permissions',
        totalCaptured: 'Total captured',
        lastDownload: 'Last download',
    },
    ChineseSimplified: {
        tile: '合并学习',
        warning: '此应用程序中的自适应学习目前已关闭。',
        tooltip: '会下载一个文件，包含用户同机器人的交互中获取的所有学习项，适合查看和更广泛应用。',
        error: '下载失败。请重试。',
        privilegeError: '下载失败：您没有所需的权限',
        totalCaptured: '获取的学习总数',
        lastDownload: '上次下载',
    },
};

export const messageAdvancedConfiguration = {
    English: {
        title: 'ADVANCED CONFIGURATION',
        applyTimeFilter: 'Apply time filter when time is not specified',
        sendObjectDescription: 'Send object descriptions to Auto',
    },
    ChineseSimplified: {
        title: '高级配置',
        applyTimeFilter: '在未指定时间时应用时间筛选器',
        sendObjectDescription: '将对象描述发送到 Auto',
    },
};
