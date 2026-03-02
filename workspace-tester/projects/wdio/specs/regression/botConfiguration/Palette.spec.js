import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import * as consts from '../../../constants/bot.js';
import * as postBody from '../../../constants/customApp/customAppBody.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import deleteBotList from '../../../api/bot/deleteBot.js';
import createColorPalette from '../../../api/colorPalette/createPalette.js';
import deleteColorPaletteList from '../../../api/colorPalette/deletePalette.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { createBotByAPI, publishBotByAPI } from '../../../api/bot/index.js';
import { browserWindow } from '../../../constants/index.js';

describe('AI Bot Color Palettes', () => {
    let { loginPage, dossierPage, libraryPage, libraryAuthoringPage, botAppearance, aibotChatPanel, botAuthoring } =
        browsers.pageObj1;

    let paletteWithLongNameId, paletteGreenId, paletteBlackId, paletteBlueId;
    let appWithLongNamePalettes, appWithProjectLevelPalettes, appWithDefaultPalettes, appWithCustomPalettes;
    let customAppIdWithLongNamePalettes,
        customAppIdWithProjectLevelPalettes,
        customAppIdWithAppDefaultPalettes,
        customAppIdWithAppCustomPalettes;
    let botToCreate, botId, botIdWithProjectCustomPalette, botIdWithAppDefaultPalette, botIdWithAppCustomPalette;

    beforeAll(async () => {
        await loginPage.login(consts.botUser.credentials);
        await setWindowSize(browserWindow);
        paletteGreenId = await createColorPalette({
            credentials: consts.botUser.credentials,
            colorPaletteInfo: consts.paletteGreenBody,
        });
        paletteBlackId = await createColorPalette({
            credentials: consts.botUser.credentials,
            colorPaletteInfo: consts.paletteBlackBody,
        });
        paletteBlueId = await createColorPalette({
            credentials: consts.botUser.credentials,
            colorPaletteInfo: consts.paletteBlueBody,
        });
        appWithProjectLevelPalettes = postBody.getCustomAppBody({
            version: 'v5',
            name: 'appWithProjectLevelPalettes',
        });
        appWithDefaultPalettes = postBody.getCustomAppBody({
            version: 'v5',
            name: 'appWithAppDefaultPalettes',
            applicationPalettes: [consts.paletteSunsetId, consts.paletteHummingBirdId],
            applicationDefaultPalette: consts.paletteSunsetId,
            useConfigPalettes: true,
        });
        appWithCustomPalettes = postBody.getCustomAppBody({
            version: 'v5',
            name: 'appWithAppCustomPalettes',
            useConfigPalettes: true,
            applicationPalettes: [paletteGreenId, paletteBlackId],
            applicationDefaultPalette: paletteGreenId,
        });
        customAppIdWithProjectLevelPalettes = await createCustomApp({
            credentials: consts.botUser.credentials,
            customAppInfo: appWithProjectLevelPalettes,
        });
        customAppIdWithAppDefaultPalettes = await createCustomApp({
            credentials: consts.botUser.credentials,
            customAppInfo: appWithDefaultPalettes,
        });
        customAppIdWithAppCustomPalettes = await createCustomApp({
            credentials: consts.botUser.credentials,
            customAppInfo: appWithCustomPalettes,
        });
        botToCreate = consts.getBotToCreate({ botName: 'auto_bot_palette' });
    });

    beforeEach(async () => {
        botId = await createBotByAPI({
            credentials: consts.botUser.credentials,
            botInfo: botToCreate,
        });
        consts.publishInfo.id = botId;
        await publishBotByAPI({
            credentials: consts.botUser.credentials,
            publishInfo: consts.publishInfo,
        });
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
        await deleteBotList({
            credentials: consts.botUser.credentials,
            botList: [botId],
        });
    });

    afterAll(async () => {
        await deleteBotList({
            credentials: consts.botUser.credentials,
            botList: [botIdWithProjectCustomPalette, botIdWithAppDefaultPalette, botIdWithAppCustomPalette],
        });
        await deleteCustomAppList({
            credentials: consts.botUser.credentials,
            customAppIdList: [
                customAppIdWithLongNamePalettes,
                customAppIdWithProjectLevelPalettes,
                customAppIdWithAppDefaultPalettes,
                customAppIdWithAppCustomPalettes,
            ],
        });
        await deleteColorPaletteList({
            credentials: consts.botUser.credentials,
            paletteIdList: [paletteWithLongNameId, paletteGreenId, paletteBlackId, paletteBlueId],
        });
        await logoutFromCurrentBrowser();
    });

    it('[TC91729_02] Check UI of long name palette', async () => {
        paletteWithLongNameId = await createColorPalette({
            credentials: consts.botUser.credentials,
            colorPaletteInfo: consts.paletteWithLongNameBody,
        });
        appWithLongNamePalettes = postBody.getCustomAppBody({
            version: 'v5',
            name: 'appWithLongNamePalettes',
            applicationPalettes: [paletteWithLongNameId],
            applicationDefaultPalette: paletteWithLongNameId,
            useConfigPalettes: true,
        });
        customAppIdWithLongNamePalettes = await createCustomApp({
            credentials: consts.botUser.credentials,
            customAppInfo: appWithLongNamePalettes,
        });
        await dossierPage.openCustomAppById({ id: customAppIdWithLongNamePalettes });
        await libraryPage.openBotById({
            appId: customAppIdWithLongNamePalettes,
            botId: botId,
        });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Appearance');
        await takeScreenshotByElement(
            botAppearance.getPalettesSelector(),
            'TC91729_02_01',
            'Long name palette is selected'
        );
        await botAppearance.openPaletteDropdownList();
        await takeScreenshotByElement(
            botAppearance.getPaletteSelectPanel(),
            'TC91729_02_02',
            'Long palette name in dropdown list'
        );
        await setWindowSize({ width: 560, height: 1200 });
        await botAuthoring.scrollBotPanelHorizontally(200);
        await botAuthoring.selectBotConfigTabByName('Appearance');
        await takeScreenshotByElement(
            botAppearance.getPalettesSelector(),
            'TC91729_02_03',
            'Resize browser_long name palette is selected'
        );
        await botAppearance.openPaletteDropdownList();
        await takeScreenshotByElement(
            botAppearance.getPaletteSelectPanel(),
            'TC91729_02_04',
            'Resize browser_long palette name in dropdown list'
        );
        await setWindowSize(browserWindow);
        await aibotChatPanel.resizeConfigurationPanel();
        await botAuthoring.selectBotConfigTabByName('Appearance');
        await takeScreenshotByElement(
            botAppearance.getPalettesSelector(),
            'TC91729_02_05',
            'Resize configuration panel_long name palette is selected'
        );
        await botAppearance.openPaletteDropdownList();
        await takeScreenshotByElement(
            botAppearance.getPaletteSelectPanel(),
            'TC91729_02_06',
            'Resize configuration panel_long palette name in dropdown list'
        );
    });

    // it('[TC91729_08] Check palette list after changing palette', async () => {
    //     // create bot in project default palette, check other app
    //     await botAppearance.checkPaletteInApp({
    //         appId: customAppIdWithProjectLevelPalettes,
    //         botId: botId,
    //     });
    //     await since('Categorical is selected should be #{expected}, instead we have #{actual}.')
    //         .expect(await botAppearance.isPaletteSelected('Categorical'))
    //         .toBe(true);
    //     await botAppearance.checkPaletteInApp({
    //         appId: customAppIdWithAppDefaultPalettes,
    //         botId: botId,
    //     });
    //     await since('Sunset is selected should be #{expected}, instead we have #{actual}.')
    //         .expect(await botAppearance.isPaletteSelected('Sunset'))
    //         .toBe(true);
    //     await botAppearance.checkPaletteInApp({
    //         appId: customAppIdWithAppCustomPalettes,
    //         botId: botId,
    //     });
    //     await since('Green is selected should be #{expected}, instead we have #{actual}.')
    //         .expect(await botAppearance.isPaletteSelected('Green'))
    //         .toBe(true);
    //     // change to app palette_not default
    //     await botAppearance.changePaletteTo('Black');
    //     await botAuthoring.saveBot();
    //     await botAppearance.checkPaletteInApp({
    //         appId: customAppIdWithProjectLevelPalettes,
    //         botId: botId,
    //     });
    //     await since('Existence of selected indicator should be #{expected}, instead we have #{actual}.')
    //         .expect(await botAppearance.isPaletteSelectIndicatorDisplayed())
    //         .toBe(false);
    //     await botAppearance.checkPaletteInApp({
    //         appId: customAppIdWithAppDefaultPalettes,
    //         botId: botId,
    //     });
    //     await since('Existence of selected indicator should be #{expected}, instead we have #{actual}.')
    //         .expect(await botAppearance.isPaletteSelectIndicatorDisplayed())
    //         .toBe(false);
    //     // change to app default palette
    //     await botAppearance.changePaletteTo('Sunset');
    //     await botAuthoring.saveBot();
    //     await botAppearance.checkPaletteInApp({
    //         appId: customAppIdWithAppCustomPalettes,
    //         botId: botId,
    //     });
    //     await since('Green is selected should be #{expected}, instead we have #{actual}.')
    //         .expect(await botAppearance.isPaletteSelected('Green'))
    //         .toBe(true);
    //     await botAppearance.checkPaletteInApp({
    //         appId: customAppIdWithProjectLevelPalettes,
    //         botId: botId,
    //     });
    //     await since('Existence of selected indicator should be #{expected}, instead we have #{actual}.')
    //         .expect(await botAppearance.isPaletteSelectIndicatorDisplayed())
    //         .toBe(false);
    //     // change to project palette_not default
    //     await botAppearance.changePaletteTo('Vernal');
    //     await botAuthoring.saveBot();
    //     await botAppearance.checkPaletteInApp({
    //         botId: botId,
    //     });
    //     await since('Vernal is selected should be #{expected}, instead we have #{actual}.')
    //         .expect(await botAppearance.isPaletteSelected('Vernal'))
    //         .toBe(true);
    //     await botAppearance.checkPaletteInApp({
    //         appId: customAppIdWithAppCustomPalettes,
    //         botId: botId,
    //     });
    //     await since('Green is selected should be #{expected}, instead we have #{actual}.')
    //         .expect(await botAppearance.isPaletteSelected('Green'))
    //         .toBe(true);
    //     await botAppearance.checkPaletteInApp({
    //         appId: customAppIdWithAppDefaultPalettes,
    //         botId: botId,
    //     });
    //     await since('Sunset is selected should be #{expected}, instead we have #{actual}.')
    //         .expect(await botAppearance.isPaletteSelected('Sunset'))
    //         .toBe(true);
    // });

    it('[TC91729_03] Check old bot', async () => {
        //check old bot in default app
        await libraryPage.openDefaultApp();
        await aibotChatPanel.openBotClearHistoryAndAskQuestion({
            botId: consts.botInProjectDefaultPaletteCategorical.id,
            question: consts.paletteQuestion,
        });
        await since('1 Categorical is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isColorDisplayedInViz(consts.categorical))
            .toBe(true);
        await aibotChatPanel.openBotClearHistoryAndAskQuestion({
            botId: consts.botInProjectSpecificPaletteSunset.id,
            question: consts.paletteQuestion,
        });
        await since('2 Sunset is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isColorDisplayedInViz(consts.sunset))
            .toBe(true);
        await aibotChatPanel.openBotClearHistoryAndAskQuestion({
            botId: consts.botInAppDefaultPaletteSunset.id,
            question: consts.paletteQuestion,
        });
        await since('3 Sunset is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isColorDisplayedInViz(consts.sunset))
            .toBe(true);
        await aibotChatPanel.openBotClearHistoryAndAskQuestion({
            botId: consts.botInAppSpecificPaletteHummingBird.id,
            question: consts.paletteQuestion,
        });
        await since('4 Hummingbird is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isColorDisplayedInViz(consts.hummingbird))
            .toBe(true);
        //check old bot in app with default palette
        await aibotChatPanel.openBotClearHistoryAndAskQuestion({
            appId: customAppIdWithAppDefaultPalettes,
            botId: consts.botInProjectDefaultPaletteCategorical.id,
            question: consts.paletteQuestion,
        });
        await since('5 Sunset is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isColorDisplayedInViz(consts.sunset))
            .toBe(true);
        await aibotChatPanel.openBotClearHistoryAndAskQuestion({
            appId: customAppIdWithAppDefaultPalettes,
            botId: consts.botInProjectSpecificPaletteSunset.id,
            question: consts.paletteQuestion,
        });
        await since('6 Sunset is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isColorDisplayedInViz(consts.sunset))
            .toBe(true);
        await aibotChatPanel.openBotClearHistoryAndAskQuestion({
            appId: customAppIdWithAppDefaultPalettes,
            botId: consts.botInAppDefaultPaletteSunset.id,
            question: consts.paletteQuestion,
        });
        await since('7 Sunset is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isColorDisplayedInViz(consts.sunset))
            .toBe(true);
        await aibotChatPanel.openBotClearHistoryAndAskQuestion({
            appId: customAppIdWithAppDefaultPalettes,
            botId: consts.botInAppSpecificPaletteHummingBird.id,
            question: consts.paletteQuestion,
        });
        await since('8 Hummingbird is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isColorDisplayedInViz(consts.hummingbird))
            .toBe(true);
        //check old bot in app with custom palette
        await aibotChatPanel.openBotClearHistoryAndAskQuestion({
            appId: customAppIdWithAppCustomPalettes,
            botId: consts.botInProjectDefaultPaletteCategorical.id,
            question: consts.paletteQuestion,
        });
        await since('9 Green is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isColorDisplayedInViz(consts.green))
            .toBe(true);
        await aibotChatPanel.openBotClearHistoryAndAskQuestion({
            appId: customAppIdWithAppCustomPalettes,
            botId: consts.botInProjectSpecificPaletteSunset.id,
            question: consts.paletteQuestion,
        });
        await since('10 Green is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isColorDisplayedInViz(consts.green))
            .toBe(true);
        await aibotChatPanel.openBotClearHistoryAndAskQuestion({
            appId: customAppIdWithAppCustomPalettes,
            botId: consts.botInAppDefaultPaletteSunset.id,
            question: consts.paletteQuestion,
        });
        await since('11 Green is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isColorDisplayedInViz(consts.green))
            .toBe(true);
        await aibotChatPanel.openBotClearHistoryAndAskQuestion({
            appId: customAppIdWithAppCustomPalettes,
            botId: consts.botInAppSpecificPaletteHummingBird.id,
            question: consts.paletteQuestion,
        });
        await since('12 Hummingbird is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isColorDisplayedInViz(consts.hummingbird))
            .toBe(true);
    });

    it('[TC91729_04] Create bot by api, using default project level palette', async () => {
        //check bot in app with project palettes
        await dossierPage.openCustomAppById({ id: customAppIdWithProjectLevelPalettes });
        await aibotChatPanel.openBotAndAskQuestion(botToCreate.data.name, consts.paletteQuestion);
        await since('1 Categorical is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isColorDisplayedInViz(consts.categorical))
            .toBe(true);
        await libraryPage.refresh();
        await since('2 Categorical is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isColorDisplayedInViz(consts.categorical))
            .toBe(true);
        await aibotChatPanel.goToLibrary();
        await libraryPage.openDossier(botToCreate.data.name);
        await since('3 Categorical is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isColorDisplayedInViz(consts.categorical))
            .toBe(true);
        //switch to custom app with default palette
        await dossierPage.openCustomAppById({ id: customAppIdWithAppDefaultPalettes });
        await aibotChatPanel.openBotAndAskQuestion(botToCreate.data.name, consts.paletteQuestion2);
        await since('4 Sunset is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isColorDisplayedInViz(consts.sunset, 1))
            .toBe(true);
        await aibotChatPanel.scrollChatPanelToTop();
        await since('5 Categorical is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isColorDisplayedInViz(consts.categorical))
            .toBe(true);
        //check palette selection status
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Appearance');
        await botAppearance.openPaletteDropdownList();
        await since('6 Sunset is selected should be #{expected}, instead we have #{actual}.')
            .expect(await botAppearance.isPaletteSelected('Sunset'))
            .toBe(true);
        //refresh page to check viz palette
        await libraryPage.refresh();
        await aibotChatPanel.waitForElementStaleness(aibotChatPanel.getVizLoadingSpinner());
        await since('7 Sunset is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isColorDisplayedInViz(consts.sunset, 1))
            .toBe(true);
        await aibotChatPanel.scrollChatPanelToTop();
        await since('8 Categorical is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isColorDisplayedInViz(consts.categorical))
            .toBe(true);
        //switch to custom app with specific palette
        await dossierPage.openCustomAppById({ id: customAppIdWithAppCustomPalettes });
        await aibotChatPanel.openBotAndAskQuestion(botToCreate.data.name, consts.paletteQuestion3);
        await since('9 Green is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isColorDisplayedInViz(consts.green, 2))
            .toBe(true);
        // reopen bot to check viz palette
        await aibotChatPanel.goToLibrary();
        await libraryPage.openDossier(botToCreate.data.name);
        await aibotChatPanel.scrollChatPanelToTop();
        await aibotChatPanel.scrollChatPanelToBottom();
        await since('10 Green is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isColorDisplayedInViz(consts.green, 2))
            .toBe(true);
        //check palette selection status
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Appearance');
        await botAppearance.openPaletteDropdownList();
        await since('11 Green is selected should be #{expected}, instead we have #{actual}.')
            .expect(await botAppearance.isPaletteSelected('Green'))
            .toBe(true);
    });

    it('[TC91729_05] Create bot by UI, using project level specific palette', async () => {
        //create bot in custom app
        await dossierPage.openCustomAppById({ id: customAppIdWithProjectLevelPalettes });
        await libraryAuthoringPage.createBotWithDataset({ dataset: consts.dataset });
        //change palette to vernal
        await botAuthoring.selectBotConfigTabByName('Appearance');
        await botAppearance.changePaletteTo('Vernal');
        //ask in edit mode
        await aibotChatPanel.askQuestion(consts.paletteQuestion);
        await since('1 Vernal is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isColorDisplayedInViz(consts.vernal))
            .toBe(true);
        await botAuthoring.saveAsBot({ name: consts.botNameProjectCustomPalette });
        botIdWithProjectCustomPalette = await botAuthoring.getBotIdFromUrl();
        await aibotChatPanel.goToLibrary();
        //reopen bot, ask in consumption mode
        await aibotChatPanel.openBotAndAskQuestion(consts.botNameProjectCustomPalette, consts.paletteQuestion2);
        await since('2 Vernal is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isColorDisplayedInViz(consts.vernal, 1))
            .toBe(true);
        //check default app
        await dossierPage.openCustomAppById({ id: customAppIdWithProjectLevelPalettes });
        await aibotChatPanel.openBotAndAskQuestion(consts.botNameProjectCustomPalette, consts.paletteQuestion3);
        await since('3 Vernal is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isColorDisplayedInViz(consts.vernal, 2))
            .toBe(true);
        //check palette selection status
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Appearance');
        //check other custom app
        await dossierPage.openCustomAppById({ id: customAppIdWithAppCustomPalettes });
        await aibotChatPanel.openBotAndAskQuestion(consts.botNameProjectCustomPalette, consts.paletteQuestion4);
        await aibotChatPanel.scrollChatPanelTo(-1000);
        await aibotChatPanel.scrollChatPanelToTop();
        await since('4 Vernal is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isColorDisplayedInViz(consts.vernal))
            .toBe(true);
        await aibotChatPanel.scrollChatPanelToBottom();
        await since('5 Green is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isColorDisplayedInViz(consts.green, 3))
            .toBe(true);
        //check palette selection status
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Appearance');
        await botAppearance.openPaletteDropdownList();
        await since('6 Green is selected should be #{expected}, instead we have #{actual}.')
            .expect(await botAppearance.isPaletteSelected('Green'))
            .toBe(true);
    });

    it('[TC91729_06] Create bot by UI, using app level default palette', async () => {
        //create bot in custom app
        await dossierPage.openCustomAppById({ id: customAppIdWithAppDefaultPalettes });
        await libraryAuthoringPage.createBotWithDataset({ dataset: consts.dataset });
        //ask in edit mode
        await aibotChatPanel.askQuestion(consts.paletteQuestion);
        await since('1 Sunset is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isColorDisplayedInViz(consts.sunset))
            .toBe(true);
        await botAuthoring.saveAsBot({ name: consts.botNameAppDefaultPalette });
        botIdWithAppDefaultPalette = await botAuthoring.getBotIdFromUrl();
        await aibotChatPanel.goToLibrary();
        //reopen bot, ask in consumption mode
        await aibotChatPanel.openBotAndAskQuestion(consts.botNameAppDefaultPalette, consts.paletteQuestion2);
        await since('2 Sunset is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isColorDisplayedInViz(consts.sunset, 1))
            .toBe(true);
        //check default app
        await dossierPage.openCustomAppById({ id: customAppIdWithProjectLevelPalettes });
        await aibotChatPanel.openBotAndAskQuestion(consts.botNameAppDefaultPalette, consts.paletteQuestion3);
        await since('3 Sunset is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isColorDisplayedInViz(consts.sunset, 2))
            .toBe(true);
        //check palette selection status
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Appearance');
        // check UI when none palette is selected
        await takeScreenshotByElement(botAppearance.getPalettesSelector(), 'TC91729_06_01', 'Nothing is selected');
        await botAppearance.openPaletteDropdownList();
        await takeScreenshotByElement(
            botAppearance.getPaletteSelectPanel(),
            'TC91729_06_02',
            'Nothing is selected in default app'
        );
        //check other custom app
        await dossierPage.openCustomAppById({ id: customAppIdWithAppCustomPalettes });
        await aibotChatPanel.openBotAndAskQuestion(consts.botNameAppDefaultPalette, consts.paletteQuestion4);
        await aibotChatPanel.scrollChatPanelTo(-1000);
        await aibotChatPanel.scrollChatPanelToTop();
        await since('4 Sunset is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isColorDisplayedInViz(consts.sunset))
            .toBe(true);
        await aibotChatPanel.scrollChatPanelToBottom();
        await since('5 Green is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isColorDisplayedInViz(consts.green, 3))
            .toBe(true);
        //check palette selection status
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Appearance');
        await botAppearance.openPaletteDropdownList();
        await since('6 Green is selected should be #{expected}, instead we have #{actual}.')
            .expect(await botAppearance.isPaletteSelected('Green'))
            .toBe(true);
    });

    it('[TC91729_07] Create bot by UI, in app level specific palette', async () => {
        //create bot in custom app
        await dossierPage.openCustomAppById({ id: customAppIdWithAppDefaultPalettes });
        await libraryAuthoringPage.createBotWithDataset({ dataset: consts.dataset });
        //change palette to specific hummingbird
        await botAuthoring.selectBotConfigTabByName('Appearance');
        await botAppearance.changePaletteTo('Hummingbird');
        //ask in edit mode
        await aibotChatPanel.askQuestion(consts.paletteQuestion);
        await since('1 Hummingbird is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isColorDisplayedInViz(consts.hummingbird))
            .toBe(true);
        await botAuthoring.saveAsBot({ name: consts.botNameAppCustomPalette });
        botIdWithAppCustomPalette = await botAuthoring.getBotIdFromUrl();
        await aibotChatPanel.goToLibrary();
        //reopen bot, ask in consumption mode
        await aibotChatPanel.openBotAndAskQuestion(consts.botNameAppCustomPalette, consts.paletteQuestion2);
        await since('2 Hummingbird is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isColorDisplayedInViz(consts.hummingbird, 1))
            .toBe(true);
        //check default app
        await libraryPage.openDefaultApp();
        await aibotChatPanel.openBotAndAskQuestion(consts.botNameAppCustomPalette, consts.paletteQuestion3);
        await since('3 Hummingbird is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isColorDisplayedInViz(consts.hummingbird, 2))
            .toBe(true);
        //check palette selection, nothing selected
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Appearance');
        await botAppearance.openPaletteDropdownList();
        await since('4 Existence of selected indicator should be #{expected}, instead we have #{actual}.')
            .expect(await botAppearance.isPaletteSelectIndicatorDisplayed())
            .toBe(false);
        //check other custom app
        await dossierPage.openCustomAppById({ id: customAppIdWithAppCustomPalettes });
        await aibotChatPanel.openBotAndAskQuestion(consts.botNameAppCustomPalette, consts.paletteQuestion4);
        await aibotChatPanel.scrollChatPanelTo(-1000);
        await aibotChatPanel.scrollChatPanelToTop();
        await aibotChatPanel.scrollChatPanelToBottom();
        await since('5 Hummingbird is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isColorDisplayedInViz(consts.hummingbird, 3))
            .toBe(true);
        //check palette selection, nothing selected
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Appearance');
        await botAppearance.openPaletteDropdownList();
        await since('6 Existence of selected indicator should be #{expected}, instead we have #{actual}.')
            .expect(await botAppearance.isPaletteSelectIndicatorDisplayed())
            .toBe(false);
    });

    it('[TC91729_08] Create bot by API, edit existing bot, history viz should not change after modifying palette', async () => {
        // ask question in original project default palette
        await dossierPage.openCustomAppById({ id: customAppIdWithAppCustomPalettes });
        await aibotChatPanel.openBotAndAskQuestion(botToCreate.data.name, consts.paletteQuestion);
        await since('1 Green is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isColorDisplayedInViz(consts.green))
            .toBe(true);
        await aibotChatPanel.hoverChatAnswertoAddSnapshotbyIndex(0);
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        // change to "Black"
        await botAuthoring.selectBotConfigTabByName('Appearance');
        await botAppearance.changePaletteTo('Black');
        await aibotChatPanel.askQuestion(consts.paletteQuestion2);
        await since('2 Black is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isColorDisplayedInViz(consts.black, 1))
            .toBe(true);
        await aibotChatPanel.closeDidYouMean();
        await aibotChatPanel.hoverChatAnswertoAddSnapshotbyIndex(1);
        await botAuthoring.saveBot({});
        //go to library and reopen bot
        await aibotChatPanel.goToLibrary();
        await libraryPage.openDossier(botToCreate.data.name);
        await since('3 Black is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isColorDisplayedInViz(consts.black, 1))
            .toBe(true);
        await aibotChatPanel.scrollChatPanelTo(-800);
        await since('4 Green is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isColorDisplayedInViz(consts.green))
            .toBe(true);
        await aibotChatPanel.clickOpenSnapshotPanelButtonInResponsive();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getVizInSnapshot());
        await since('5 Black is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isColorDisplayedInVizOfSnapshot(consts.black))
            .toBe(true);
        await aibotChatPanel.scrollSnapshotPanelToBottom();
        await since('6 Green is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isColorDisplayedInVizOfSnapshot(consts.green, 1))
            .toBe(true);
        //refresh page
        await await libraryPage.refresh();
        await since('7 Black is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isColorDisplayedInViz(consts.black, 1))
            .toBe(true);
        await aibotChatPanel.scrollChatPanelTo(-600);
        await since('8 Green is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isColorDisplayedInViz(consts.green))
            .toBe(true);
        await aibotChatPanel.clickOpenSnapshotPanelButtonInResponsive();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getVizInSnapshot());
        await since('9 Black is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isColorDisplayedInVizOfSnapshot(consts.black))
            .toBe(true);
        await aibotChatPanel.scrollSnapshotPanelToBottom();
        await since('10 Green is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isColorDisplayedInVizOfSnapshot(consts.green, 1))
            .toBe(true);
    });
});
