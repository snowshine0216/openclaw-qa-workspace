import { browserWindow } from '../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import resetUserLanguage from '../../../api/resetUserLanguage.js';
import setUserLanguage from '../../../api/setUserLanguage.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { botChatConfigI18NUser, languageIdMap } from '../../../constants/bot.js';
import urlParser from '../../../api/urlParser.js';

describe('AI Bot Configuration Default String US567510', () => {
    const baseUrl = urlParser(browser.options.baseUrl);
    const configurationStrings = {
        botDefaultEnglish: {
            botName: 'New Bot',
            welcomeMessage: "Hello! I'm New Bot, your virtual assistant. How can I guide you today?",
            hintMessage: 'Ask me a question',
        },
        botEnglishChangeBack: {
            botName: 'New Bot',
            welcomeMessage: "Hello! I'm New Bot, your virtual assistant. How can I guide you today?",
            hintMessage: 'Ask me a question.',
        },
        botEnglishChange: {
            botName: 'Change under Primary',
            welcomeMessage:
                "Hello! I'm Change under Primary, your virtual assistant. How can I guide you today? [Change under Primary English]",
            hintMessage: '[Change under Primary English] Ask me a question.',
        },
        botChineseDefault: {
            botName: '新建机器人',
            welcomeMessage: '您好！我是新建机器人，您的 AI 助理。今天您需要我做什么？',
            hintMessage: '向我提问',
        },
        botChineseChange: {
            botName: '中文名',
            welcomeMessage: '您好！我是中文名，您的 AI 助理。今天您需要我做什么？[中文]',
            hintMessage: '[中文 hint] 向我提问。',
        },
        botJanpanseDefault: {
            botName: '新規ボット',
            welcomeMessage:
                'こんにちは!新規ボットと申します。お客様の仮想アシスタントを務めさせていただきます。本日はどのようなご相談でしょうか?',
            hintMessage: '質問を入力',
        },
        botCustomize: {
            botName: 'Change under Primary',
            welcomeMessage:
                "Hello! I'm Change un, your virtual assistant. How can I guide you today? [Change under Prim] Change under Primary",
            hintMessage: '[Change under Primary English] Hi {{botName}}, Ask me a question.',
        },
    };
    const aibots = {
        bot01AllDefault: {
            id: '3A2EBA23824BFA85D7E4DDB0E28A5D34',
            name: 'US567510_01 All default',
            projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            englishConfiguration: configurationStrings.botDefaultEnglish,
            chieseConfiguration: configurationStrings.botChineseDefault,
            japaneseConfiguretion: configurationStrings.botJanpanseDefault,
        },
        bot02ChangeUnderPrimary: {
            id: 'DE5B2D3932442193FBC0BFB7D480C5E2',
            name: 'US567510_02 Change Under Primary',
            englishConfiguration: configurationStrings.botEnglishChange,
            chieseConfiguration: configurationStrings.botEnglishChange,
            japaneseConfiguretion: configurationStrings.botEnglishChange,
        },
        bot03ChangeUnderChinese: {
            id: 'E52443455F45DD343ED40CB15F0143A7',
            name: 'US567510_03 Change Under Chinese',
            englishConfiguration: configurationStrings.botDefaultEnglish,
            chieseConfiguration: configurationStrings.botChineseChange,
            japaneseConfiguretion: configurationStrings.botJanpanseDefault,
        },
        bot04ChangeUnderPrimaryAndChinese: {
            id: 'C49B67D39545710918309F91367151D5',
            name: 'US567510_04 Change Under Primary and Chinese',
            englishConfiguration: configurationStrings.botEnglishChange,
            chieseConfiguration: configurationStrings.botChineseChange,
            japaneseConfiguretion: configurationStrings.botEnglishChange,
        },
        bot05ChangeUnderChineseAndPrimpary: {
            id: '2E29C16F9C49A8CE2002D086F89A950E',
            name: 'US567510_05 Change Under Chinese then Primary',
            englishConfiguration: configurationStrings.botEnglishChange,
            chieseConfiguration: configurationStrings.botChineseChange,
            japaneseConfiguretion: configurationStrings.botEnglishChange,
        },
        bot06ResetUnderPrimary: {
            id: '7D4ABC78054103A486ED0A8B2EF70162',
            name: 'US567510_06 Reset under Primary',
            englishConfiguration: configurationStrings.botDefaultEnglish,
            chieseConfiguration: configurationStrings.botChineseChange,
            japaneseConfiguretion: configurationStrings.botJanpanseDefault,
        },
        bot07ResetUnderChinese: {
            id: '531BF720D045E568EBE6E5A82775A55C',
            name: 'US567510_07 Reset under Chinese',
            englishConfiguration: configurationStrings.botEnglishChange,
            chieseConfiguration: configurationStrings.botChineseDefault,
            japaneseConfiguretion: configurationStrings.botEnglishChange,
        },
        bot08SettoUseDefaultUnderPrimpary: {
            id: '57765BEB35458639E12FCB813A2ABDEF',
            name: 'US567510_08 Set to {{USE_DEFAULT}} under Primary',
            englishConfiguration: configurationStrings.botDefaultEnglish,
            chieseConfiguration: configurationStrings.botChineseChange,
            japaneseConfiguretion: configurationStrings.botJanpanseDefault,
        },
        bot09SettoUseDefaultUnderChinese: {
            id: 'D3AE6A49A04D585A8AED16B5501D8A56',
            name: 'US567510_09 Set to {{USE_DEFAULT}} under Chinese',
            englishConfiguration: configurationStrings.botEnglishChange,
            chieseConfiguration: configurationStrings.botChineseDefault,
            japaneseConfiguretion: configurationStrings.botEnglishChange,
        },
        bot11ChangeBacktoDefaultString: {
            id: '911E236C9943029936239AB9BA09BBB0',
            name: 'US567510_11 Change back to same as default string Under Primary',
            englishConfiguration: configurationStrings.botEnglishChangeBack,
            chieseConfiguration: configurationStrings.botChineseChange,
            japaneseConfiguretion: configurationStrings.botEnglishChangeBack,
        },
        bot12SetBotName: {
            id: '93669C0DF2496461E3D0E3AD8483FA61',
            name: 'US567510_12 Change Under Primary then change Greeting bot name',
            englishConfiguration: configurationStrings.botCustomize,
            chieseConfiguration: configurationStrings.botCustomize,
            japaneseConfiguretion: configurationStrings.botCustomize,
        },
    };

    let { loginPage, libraryPage, aibotChatPanel } = browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        await resetUserLanguage({ credentials: botChatConfigI18NUser });
    });

    afterEach(async () => {
        await logoutFromCurrentBrowser();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    async function openAndCheckBots(language) {
        await libraryPage.openDefaultApp();
        await loginPage.login(botChatConfigI18NUser);
        for (let botKey of Object.keys(aibots)) {
            try {
                let configuration;
                switch (language) {
                    case 'english':
                        configuration = aibots[botKey].englishConfiguration;
                        break;
                    case 'chinese':
                        configuration = aibots[botKey].chieseConfiguration;
                        break;
                    case 'japanese':
                        configuration = aibots[botKey].japaneseConfiguretion;
                        break;
                    default:
                        throw new Error(`Unsupported language: ${language}`);
                }
                await libraryPage.openBotById({ botId: aibots[botKey].id });
                await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
                await aibotChatPanel.clearHistory();

                console.log('Configuration message');
                console.log(configuration);
                await since(
                    `AI bot ${aibots[botKey].name}, bot name in chat panel title bar should be #{expected}, instead we have #{actual}.`
                )
                    .expect(await aibotChatPanel.getTitleBarBotNameTexts())
                    .toBe(configuration.botName);
                await since(
                    `AI bot ${aibots[botKey].name}, greeting message should be #{expected}, instead we have #{actual}.`
                )
                    .expect(await aibotChatPanel.getWelcomePageMessageTexts())
                    .toBe(configuration.welcomeMessage);
                await since(
                    `AI bot ${aibots[botKey].name}, hint message should be #{expected}, instead we have #{actual}.`
                )
                    .expect(await aibotChatPanel.getHintText())
                    .toBe(configuration.hintMessage);
            } catch (err) {
                console.error(
                    `Error processing bot ${botKey} with ID ${aibots[botKey].id} and name ${aibots[botKey].name}:`,
                    err
                );
            }
        }
    }

    it('[TC96331_01] Check English for Different Bots', async () => {
        await setUserLanguage({
            baseUrl,
            userId: botChatConfigI18NUser.id,
            adminCredentials: botChatConfigI18NUser,
            localeId: languageIdMap.EnglishUnitedStates,
        });
        await openAndCheckBots('english');
    });

    it('[TC96331_02] Check Chinese', async () => {
        await setUserLanguage({
            baseUrl,
            userId: botChatConfigI18NUser.id,
            adminCredentials: botChatConfigI18NUser,
            localeId: languageIdMap.ChineseSimplified,
        });
        await openAndCheckBots('chinese');
    });

    it('[TC96331_03] Check Japanese', async () => {
        await setUserLanguage({
            baseUrl,
            userId: botChatConfigI18NUser.id,
            adminCredentials: botChatConfigI18NUser,
            localeId: languageIdMap.Japanese,
        });
        await openAndCheckBots('japanese');
    });
});
