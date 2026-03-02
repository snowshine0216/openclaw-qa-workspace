import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import resetCertify from '../../../api/resetCertify.js';
import { createBotByAPI, publishBotByAPI, deleteBotList } from '../../../api/bot/index.js';
import { browserWindow } from '../../../constants/index.js';
import {
    certifyBotUser,
    otherCertifyBotUser,
    nonCertifyBotUser,
    botEdit_NoBotPrivilegeUser,
} from '../../../constants/bot.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

describe('AI Bot Test of Save and Certify', () => {
    const BotToCreate = {
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
        data: {
            datasets: [
                {
                    id: '2F4F0B6753429DF701EB65AA27B63068',
                    name: 'byd_balance_ds_en', //02_Users > xuyin > byd_balance_ds_en
                },
            ],
            isBot: true,
            overwrite: true,
            name: 'Save Certify Bot',
            description: '',
            folderId: 'D3C7D461F69C4610AA6BAA5EF51F4125', //Tutorial > Public Objects > Reports
        },
    };

    const BotToTest = {
        defaultName: 'New Bot',
        modifiedName: 'Modified Name',
    };

    const BotCertified = {
        id: 'FA1F728001495855819481892733702D',
        name: 'Bot Certified',
        project: {
            id: '65E72260B24EDF76A9B9988F7B72F8A2',
        },
    };

    const botIdsToDelete = [];

    const publishInfo = {
        type: 'document_definition',
        recipients: [
            {
                id: 'DC7ECD73FE4578ECEEDDFF9886C25B86',
            },
            {
                id: 'C9C30BA0524B5A57A4DC7EA8DA2F54B8',
            },
            {
                id: '725766FEC1439209E624B380987DB19D',
            },
        ],
        projectId: BotToCreate.project.id,
    };

    let {
        loginPage,
        libraryPage,
        libraryAuthoringPage,
        botAuthoring,
        aibotChatPanel,
        warningDialog,
        botConsumptionFrame,
        dossierPage,
        librarySearch,
        fullSearch,
        infoWindow,
        contentDiscovery,
        listView,
        listViewAGGrid,
        sidebar,
    } = browsers.pageObj1;
    let botId;
    let bot;
    beforeAll(async () => {
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        botId = await createBotByAPI({ credentials: certifyBotUser, botInfo: BotToCreate });
        botIdsToDelete.push(botId);
        bot = {
            id: botId,
            name: BotToCreate.data.name,
            project: {
                id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            },
        };
        publishInfo.id = botId;
        await publishBotByAPI({
            credentials: certifyBotUser,
            publishInfo: publishInfo,
        });
        if (!(await loginPage.isLoginPageDisplayed())) {
            await browser.url(new URL('auth/ui/loginPage', browser.options.baseUrl).toString(), 100000);
        }
    });

    afterEach(async () => {
        await deleteBotList({
            credentials: certifyBotUser,
            botList: [...botIdsToDelete],
            projectId: BotToCreate.project.id,
        });
        botIdsToDelete.length = 0;
        await logoutFromCurrentBrowser();
    });

    /**
     * 1. user has full bot privilege
     * 2. edit existing active bot from library home -> do change in config (bot name) -> save -> close -> go back to library home
     * 3. rerun bot check bot name is changed in consumption mode
     */
    it('[TC95440_07] EditBotFromLibraryHome_ChangeBotName_Save_ExitFromEdit', async () => {
        await loginPage.login(certifyBotUser);
        await libraryPage.openDossierContextMenu(BotToCreate.data.name);
        await libraryPage.clickDossierContextMenuItem('Edit');
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        // check default values
        await since('Bot name in welcome message should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.getWelcomePageMessageTexts())
            .toContain(BotToTest.defaultName);
        await since('Default Bot name should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getBotNameInput().getValue())
            .toBe(BotToTest.defaultName);
        await since('Default Bot name in chat title should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.getTitleBarBotName().getText())
            .toBe(BotToTest.defaultName);
        // modify bot settings
        await botAuthoring.generalSettings.updateBotName(BotToTest.modifiedName);
        // check in authoring mode
        await since('Bot name should update to #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getBotNameInput().getValue())
            .toBe(BotToTest.modifiedName);
        await since('Bot name in chat title should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.getTitleBarBotName().getText())
            .toBe(BotToTest.modifiedName);
        await since('Bot name in welcome message should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.getWelcomePageMessageTexts())
            .toContain(BotToTest.modifiedName);
        await botAuthoring.saveBot({});
        await botAuthoring.clickCloseButton();
        // re-open bot
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId: botId });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await since('Add to library banner present state should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isAddToLibraryDisplayed())
            .toBe(false);
        await since('Bot name in chat title should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.getTitleBarBotName().getText())
            .toBe(BotToTest.modifiedName);
        await aibotChatPanel.goToLibrary();
    });

    /**
     * 1. user don not have certify privilege
     * 2. run existing certified bot from library home -> edit -> do change in config (bot name) -> save -> close -> go back to consumption mode
     * 3. check bot name in edit mode and consumption mode
     * 4. check certify status and certify info in edit mode and consumption mode
     */
    it('[TC95440_12] NoCertifyPrivilege_OpenCertifiedBot_ChangeBotName_SaveBot_Save', async () => {
        //certify bot
        await resetCertify({
            dossier: bot,
            credentials: certifyBotUser,
            type: '55',
            certify: true,
        });
        //switch to user without certify privilege
        await libraryPage.switchUser(nonCertifyBotUser);
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId: botId });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await since('Add to library banner present state should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isAddToLibraryDisplayed())
            .toBe(false);
        await since('Bot certified state in consumption mode should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.isBotCertified())
            .toBe(true);
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        // check default values
        await since('Bot name in welcome message should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.getWelcomePageMessageTexts())
            .toContain(BotToTest.defaultName);
        await since('Default Bot name should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getBotNameInput().getValue())
            .toBe(BotToTest.defaultName);
        await since('Default Bot name in chat title should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.getTitleBarBotName().getText())
            .toBe(BotToTest.defaultName);
        // modify bot settings
        await botAuthoring.generalSettings.updateBotName(BotToTest.modifiedName);
        // check in authoring mode
        await since('Bot name should update to #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getBotNameInput().getValue())
            .toBe(BotToTest.modifiedName);
        await since('Bot name in chat title should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.getTitleBarBotName().getText())
            .toBe(BotToTest.modifiedName);
        await since('Bot name in welcome message should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.getWelcomePageMessageTexts())
            .toContain(BotToTest.modifiedName);
        await botAuthoring.saveBotWithConfirm();
        //check confirm dialog
        await botAuthoring.waitForElementVisible(botAuthoring.getConfirmWarningDialog());
        await since('Confirm dialog present in edit mode should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.isConfirmWarningDialogPresent())
            .toBe(true);
        await since('Certify info in confirm dialog should contain #{expected}, instead we have #{actual}')
            .expect(await warningDialog.getDialogMessageCertificationInfo())
            .toContain('This bot was last certified by botCertify on');
        await since(
            'Certify check box present in confirm dialog in edit mode should be #{expected}, instead we have #{actual}'
        )
            .expect(await warningDialog.isCertifyCheckboxPresent())
            .toBe(false);
        await warningDialog.confirmSave();
        await since('Bot certified state in edit mode should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.isBotCertified())
            .toBe(false);
        await botAuthoring.clickCloseButton();
        // // check in consumption mode
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await since('Add to library banner present state should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isAddToLibraryDisplayed())
            .toBe(false);
        await since('Bot certified state in consumption mode should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.isBotCertified())
            .toBe(false);
        await since('Bot name in chat title should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.getTitleBarBotName().getText())
            .toBe(BotToTest.modifiedName);
        await aibotChatPanel.goToLibrary();
        // re-open bot
        await libraryPage.openDossier(BotToCreate.data.name);
        await since('Bot certified state in consumption mode should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.isBotCertified())
            .toBe(false);
        await since('Add to library banner present state should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isAddToLibraryDisplayed())
            .toBe(false);
        await since('Bot name in chat title should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.getTitleBarBotName().getText())
            .toBe(BotToTest.modifiedName);
        await aibotChatPanel.goToLibrary();
    });

    /**
     * 1. user has full bot privilege
     * 2. edit bot by url -> change bot status -> close -> save -> go back to library home
     * 3. check confirm dialog
     * 4. check bot status in edit mode and consumption mode
     */
    it('[TC95440_08] EditBotByUrl_ChangeBotStatus_ExitFromEdit_Save', async () => {
        await loginPage.login(certifyBotUser);
        //edit bot by url
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId: botId });
        await libraryAuthoringPage.waitForCurtainDisappear();
        // check bot status in edit mode
        await since('Active toggele status should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.generalSettings.isActiveBotSwitchOn())
            .toBe(true);
        // deactive bot
        await botAuthoring.generalSettings.deactiveBot();
        // click close button
        await botAuthoring.clickCloseButton();
        // check confirm dialog
        await botAuthoring.waitForElementVisible(botAuthoring.getConfirmWarningDialog());
        await since('Confirm dialog present in edit mode should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.isConfirmWarningDialogPresent())
            .toBe(true);
        await since('Confirm dialog title should be #{expected}, instead we have #{actual}')
            .expect(await warningDialog.getDialogTitle())
            .toBe('Notification');
        await since('Confirm dialog message should be #{expected}, instead we have #{actual}')
            .expect(await warningDialog.getDialogMessageTitle())
            .toBe('Do you want to save your bot?');
        await since('Certify check box present in confirm dialog should be #{expected}, instead we have #{actual}')
            .expect(await warningDialog.isCertifyCheckboxPresent())
            .toBe(true);
        await since('Certify check box check state in confirm dialog should be #{expected}, instead we have #{actual}')
            .expect(await warningDialog.isCertifyCheckboxChecked())
            .toBe(false);
        await warningDialog.confirmSave();
        // go back to library home, rerun bot show inactive error
        await libraryPage.waitForLibraryLoading();
        await since('Check back to libray home should be #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.isSelectedSidebarItem('All'))
            .toBe(true);
        await libraryPage.openBotById({
            projectId: BotToCreate.project.id,
            botId: botId,
            handleError: false,
        });
        await since('Inactive error present state should be #{expected}, instead we have #{actual}')
            .expect(await botConsumptionFrame.isInactiveMsgDisplayed())
            .toBe(true);
        await botConsumptionFrame.clickCloseButtonInMessageBox();
    });

    /**
     * 1. user has full bot privilege
     * 2. open active certified bot -> decertify bot in edit mode -> close -> go back to consumption mode
     * 3. rerun bot check certify icon in consumption mode
     */
    it('[TC95440_09] OpenCertifiedBot_DecertifyBot_ExitFromEdit', async () => {
        await loginPage.login(certifyBotUser);
        //certify bot
        await resetCertify({
            dossier: bot,
            credentials: certifyBotUser,
            type: '55',
            certify: true,
        });
        await libraryPage.refresh();
        await libraryPage.openDossier(BotToCreate.data.name);
        await libraryAuthoringPage.waitForCurtainDisappear();
        // check certify icon in consumption mode
        await since('Bot certified state in consumption mode should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.isBotCertified())
            .toBe(true);
        // go to edit mode
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.hoverCertifyIcon();
        // check certify info in edit mode
        await since('Bot certified state in edit mode should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.isBotCertified())
            .toBe(true);
        await since('Certify info in confirm dialog should contain #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.getCertifyInfo())
            .toContain('Certified by botCertify on');
        // // check no save and certify button in toolbar
        // await since('Save and certify button present in edit mode should be #{expected}, instead we have #{actual}')
        //     .expect(await botAuthoring.isSaveAndCertifyButtonPresent())
        //     .toBe(false);
        // decertify bot
        await botAuthoring.decertifyBotInTooltip();
        // check certify icon should be gone
        await since('Bot certified state in edit mode should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.isBotCertified())
            .toBe(false);
        // // check has save and certify button in toolbar
        // await since('Save and certify button present in edit mode should be #{expected}, instead we have #{actual}')
        //     .expect(await botAuthoring.isSaveAndCertifyButtonPresent())
        //     .toBe(true);
        //go back to consumption mode
        await botAuthoring.clickCloseButton();
        // check certify icon in consumption mode
        await since('Bot certified state in consumption mode should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.isBotCertified())
            .toBe(false);
        await aibotChatPanel.goToLibrary();
    });

    /**
     * 1. user has full bot privilege
     * 2. run not in library bot -> edit -> do change in config (bot name) -> save and certify -> close -> go back to consumption mode
     * 3. check certify status, information, decertify button in edit mode after click save and certify
     * 4. check no save and certify button in edit mode after click save and certify
     * 5. chek certify status in consumption mode after exit from edit
     */
    it('[TC95440_10] OpenBot_ChangeBotName_SaveAndCertify_ExitFromEdit', async () => {
        await loginPage.login(certifyBotUser);
        //remove bot if in library
        await libraryPage.removeDossierFromLibrary(certifyBotUser, bot);
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId: botId });
        await libraryAuthoringPage.waitForCurtainDisappear();
        //check add to library banner displayed
        // await since('Add to library banner present state should be #{expected}, instead we have #{actual}')
        //     .expect(await dossierPage.isAddToLibraryDisplayed())
        //     .toBe(true);
        // go to edit mode
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        // modify bot settings
        await botAuthoring.generalSettings.updateBotName(BotToTest.modifiedName);
        await botAuthoring.saveAndCertifyBot();
        // check certify info in edit mode
        await since('Bot certified state in edit mode should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.isBotCertified())
            .toBe(true);
        await since('Certify info in certify tooltip should contain #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.getCertifyInfo())
            .toContain('Certified by botCertify on');
        await since('Bot decertify button in edit mode should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.isDecertifyButtonPresent())
            .toBe(true);
        // // check no save and certify button in toolbar
        // await since('Save and certify button present in edit mode should be #{expected}, instead we have #{actual}')
        //     .expect(await botAuthoring.isSaveAndCertifyButtonPresent())
        //     .toBe(false);
        await botAuthoring.clickCloseButton();
        //check add to library banner gone
        await since('Add to library banner present state should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isAddToLibraryDisplayed())
            .toBe(false);
        // check certify icon displayed in consumption mode
        await since('Bot certified state in consumption mode should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.isBotCertified())
            .toBe(true);
        await aibotChatPanel.goToLibrary();
    });

    /**
     * 1. user don not have certify privilege
     * 2. run existing certified bot from library home -> edit -> do change in config (bot name) -> close -> do not save -> go back to consumption mode
     * 3. check warning dialog by screenshot
     */
    it('[TC95440_11] NoCertifyPrivilege_OpenCertifiedBot_ChangeBot_Save_Cancel_DoNotSave', async () => {
        //switch to user without certify privilege
        await loginPage.login(nonCertifyBotUser);
        await libraryPage.openDossier(BotCertified.name);
        await libraryAuthoringPage.waitForCurtainDisappear();
        await since('Bot certified state in consumption mode should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.isBotCertified())
            .toBe(true);
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        // modify bot settings
        await botAuthoring.generalSettings.updateBotName(BotToTest.modifiedName);
        await botAuthoring.clickCloseButton();
        //check confirm dialog
        await botAuthoring.waitForElementVisible(botAuthoring.getConfirmWarningDialog());
        await takeScreenshotByElement(
            warningDialog.getConfirmWarningDialog(),
            'TC90987_11_01',
            'Confirm warning dialog'
        );
        await warningDialog.confirmDoNotSave();
        // check in consumption mode
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await since('Bot certified state in consumption mode should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.isBotCertified())
            .toBe(true);
        await since('Bot name in chat title should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.getTitleBarBotName().getText())
            .toBe(BotToTest.defaultName);
        await aibotChatPanel.goToLibrary();
    });

    /**
     * 1. user don not have certify privilege
     * 2. open active bot -> change bot name -> save as as new bot -> go back to library home
     * 3. check old bot, new bot – bot exist, bot names are correct
     * 4. no certify check box in save as dialog
     */
    it('[TC95440_13] NoCertifyPrivilege_OpenBot_EditBot_ChangeBotName_SaveAs_SaveAs', async () => {
        const newBotName = 'Save as bot';
        await loginPage.login(nonCertifyBotUser);
        await libraryPage.openDossier(BotToCreate.data.name);
        await libraryAuthoringPage.waitForCurtainDisappear();
        // go to edit mode
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        // change bot name
        await botAuthoring.selectBotConfigTabByName('General');
        await botAuthoring.generalSettings.updateBotName(BotToTest.modifiedName);
        //open button menu
        await botAuthoring.openButtonMenu();
        //click save as button and wait for save dialog display
        await botAuthoring.clickSaveAsButton();
        await botAuthoring.waitForElementVisible(botAuthoring.getSaveDialog());
        //change bot name in save as dialog
        await botAuthoring.saveAsEditor.changeInputBotNameInSaveAsDialog(newBotName);
        //verify certify check box in save as dialog
        await since('cetify check box present status in save dialog should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.saveAsEditor.isCertifyCheckBoxPresentInSaveAsDialog())
            .toBe(false);
        //save bot by save dialog
        await botAuthoring.saveBotBySaveDialog();
        //enter new bot edit mode, add new bot id to botIdsToDelete
        await botAuthoring.waitForElementClickable(botAuthoring.getSaveButton());
        const newBotId = await botAuthoring.getBotIdFromUrl();
        botIdsToDelete.push(newBotId);
        //check bot certify status in new bot edit mode
        await since('Bot certified state in edit mode should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.isBotCertified())
            .toBe(false);
        //open button menu
        await botAuthoring.openButtonMenu();
        //check save as button
        await since('Save as button status should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.isSaveAsButtonPresent())
            .toBe(true);
        //check save and certify button
        await since('Save and certify button status should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.isSaveAndCertifyButtonPresent())
            .toBe(false);
        //check bot name in edit mode
        await since('Bot name in edit mode should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.generalSettings.getBotNameInput().getValue())
            .toBe(BotToTest.modifiedName);
        await since('Chat bot title bar bot name should be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getTitleBarBotNameTexts())
            .toBe(BotToTest.modifiedName);
        await since('Bot name in welcome message should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.getWelcomePageMessageTexts())
            .toContain(BotToTest.modifiedName);
        await since('Bot name in tool bar should be #{expected}, instead we have #{actual}.')
            .expect(await botConsumptionFrame.getBotName())
            .toBe(newBotName);
        //exit from bot edit mode
        await botAuthoring.clickCloseButton();
        await libraryPage.waitForLibraryLoading();
        await libraryPage.waitForItemLoading();
        //check old bot name not changed in consumption mode
        await libraryPage.openDossier(BotToCreate.data.name);
        await since('Chat bot name in old bot should be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getTitleBarBotNameTexts())
            .toBe(BotToTest.defaultName);
        await since('Old bot name in welcome message should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.getWelcomePageMessageTexts())
            .toContain(BotToTest.defaultName);
        await since('Old bot name in tool bar should be #{expected}, instead we have #{actual}.')
            .expect(await botConsumptionFrame.getBotName())
            .toBe(BotToCreate.data.name);
        await aibotChatPanel.goToLibrary();
    });

    /**
     * 1. user don not have certify privilege
     * 2. open active bot -> change bot name -> save as -> overwrite current bot go back to library home
     * 3. new bot – bot exist, bot names are correct
     */
    it('[TC95440_14] NoCertifyPrivilege_OpenBot_EditBot_ChangeBotName_SaveAs_SaveAsWithOverWrite', async () => {
        await loginPage.login(nonCertifyBotUser);
        await libraryPage.openDossier(BotToCreate.data.name);
        await libraryAuthoringPage.waitForCurtainDisappear();
        // go to edit mode
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        // change bot name
        await botAuthoring.selectBotConfigTabByName('General');
        await botAuthoring.generalSettings.updateBotName(BotToTest.modifiedName);
        //save as bot with over write current bot
        await botAuthoring.saveAsBot({ name: BotToCreate.data.name });
        const currentBotID = await botAuthoring.getBotIdFromUrl();
        //check bot id should be same with old bot
        await since('Bot id should be #{expected}, instead we have #{actual}').expect(currentBotID).toBe(botId);
        await botAuthoring.waitForElementClickable(botAuthoring.getSaveButton());
        //check bot certify status in new bot edit mode
        await since('Bot certified state in edit mode should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.isBotCertified())
            .toBe(false);
        //check bot name in edit mode
        await since('Bot name in edit mode should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.generalSettings.getBotNameInput().getValue())
            .toBe(BotToTest.modifiedName);
        await since('Chat bot title bar bot name should be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getTitleBarBotNameTexts())
            .toBe(BotToTest.modifiedName);
        await since('Bot name in welcome message should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.getWelcomePageMessageTexts())
            .toContain(BotToTest.modifiedName);
        await since('Bot name in tool bar should be #{expected}, instead we have #{actual}.')
            .expect(await botConsumptionFrame.getBotName())
            .toBe(BotToCreate.data.name);
        //exit from bot edit mode
        await botAuthoring.clickCloseButton();
    });

    /**
     * 1. user has full bot privilege, but not current bot previous certify user
     * 2. open certified bot -> go to edit mode -> change bot name -> click save -> cancel save in warning dialog -> close -> donot save -> go back to consuption mode
     * 3. check warning dialog by screenshot
     */
    it('[TC95440_15] NotCerityUser_OpenCertifiedBot_ChangeBotName_SaveBot_Cancel_DoNotSave', async () => {
        //login with another user who also have certify privilege but not current bot previous certify user
        await loginPage.login(otherCertifyBotUser);
        await libraryPage.openDossier(BotCertified.name);
        await libraryAuthoringPage.waitForCurtainDisappear();
        await since('Bot certified state in consumption mode should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.isBotCertified())
            .toBe(true);
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        // modify bot settings
        await botAuthoring.generalSettings.updateBotName(BotToTest.modifiedName);
        await botAuthoring.clickSaveButton();
        //check confirm dialog
        await botAuthoring.waitForElementVisible(botAuthoring.getConfirmWarningDialog());
        await botAuthoring.waitForElementVisible(warningDialog.getCertifyCheckBox());
        await takeScreenshotByElement(
            warningDialog.getConfirmWarningDialog(),
            'TC90987_14_01',
            'Confirm warning dialog'
        );
        await warningDialog.confirmCancel();
        await botAuthoring.clickCloseButton();
        await warningDialog.confirmDoNotSave();
        // check in consumption mode
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await since('Bot certified state in consumption mode should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.isBotCertified())
            .toBe(true);
        await since('Chat bot title bar bot name should be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getTitleBarBotNameTexts())
            .toBe(BotToTest.defaultName);
        await since('Bot name in chat title should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.getTitleBarBotName().getText())
            .toBe(BotToTest.defaultName);
        await aibotChatPanel.goToLibrary();
    });

    /**
     * 1. user has full bot privilege, but not current bot previous certify user
     * 2. open active certified bot -> go to edit mode -> change bot name -> click save -> confirm save -> go back to consuption mode
     * 3. check bot name in edit mode and consumption mode
     * 4. check bot certify status and certify info in edit mode and consumption mode
     */
    it('[TC95440_16] NotCerityUser_OpenCertifiedBot_ChangeBotName_SaveBot_Save', async () => {
        //certify bot
        await resetCertify({
            dossier: bot,
            credentials: certifyBotUser,
            type: '55',
            certify: true,
        });
        await loginPage.login(otherCertifyBotUser);
        await libraryPage.openDossier(BotToCreate.data.name);
        await libraryAuthoringPage.waitForCurtainDisappear();
        // check certify icon in consumption mode
        await since('Bot certified state in consumption mode should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.isBotCertified())
            .toBe(true);
        // go to edit mode
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.hoverCertifyIcon();
        // check certify info in edit mode
        await since('Bot certified state in edit mode should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.isBotCertified())
            .toBe(true);
        await since('Certify info in certify tooltip should contain #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.getCertifyInfo())
            .toContain('Certified by botCertify on');
        // // check no save and certify button in toolbar
        // await since('Save and certify button present in edit mode should be #{expected}, instead we have #{actual}')
        //     .expect(await botAuthoring.isSaveAndCertifyButtonPresent())
        //     .toBe(false);
        // change bot name
        await botAuthoring.selectBotConfigTabByName('General');
        await botAuthoring.generalSettings.updateBotName(BotToTest.modifiedName);
        await botAuthoring.clickSaveButton();
        await botAuthoring.waitForElementVisible(botAuthoring.getConfirmWarningDialog());
        await warningDialog.checkCertifyCheckbox();
        await warningDialog.confirmSave();
        // check certify icon should be gone
        await since('Bot certified state in edit mode should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.isBotCertified())
            .toBe(true);
        await since('Certify info in certify tooltip should contain #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.getCertifyInfo())
            .toContain('Certified by botCertify2 on');
        // // check don't have save and certify button in toolbar
        // await since('Save and certify button present in edit mode should be #{expected}, instead we have #{actual}')
        //     .expect(await botAuthoring.isSaveAndCertifyButtonPresent())
        //     .toBe(false);
        //go back to consumption mode
        await botAuthoring.clickCloseButton();
        // check certify icon in consumption mode
        await since('Bot certified state in consumption mode should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.isBotCertified())
            .toBe(true);
        await aibotChatPanel.goToLibrary();
    });

    /**
     * 1. user has full bot privilege
     * 2. edit bot from search page -> change bot status -> close -> save -> go back to library home
     * 3. check exit from edit – back to library home
     * 4. check bot status changed
     */
    it('[TC95439_04] EditBotFromSearchPage_ChangeBotStatus_ExitFromEdit_CancelSave_ExitFromEdit_Save', async () => {
        await loginPage.login(certifyBotUser);
        //edit bot from search page
        await librarySearch.openSearchBox();
        await librarySearch.search(BotToCreate.data.name);
        await librarySearch.pressEnter();
        await fullSearch.waitForSearchLoading();
        await fullSearch.clickAllTab();
        await fullSearch.openInfoWindow(BotToCreate.data.name);
        await infoWindow.clickEditButton();
        await fullSearch.switchToNewWindow();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        // check bot status in edit mode
        await since('Active toggele status should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.generalSettings.isActiveBotSwitchOn())
            .toBe(true);
        // deactive bot
        await botAuthoring.generalSettings.deactiveBot();
        // click close button
        await botAuthoring.clickCloseButton();
        // check confirm dialog
        await botAuthoring.waitForElementVisible(botAuthoring.getConfirmWarningDialog());
        await since('Confirm dialog present in edit mode should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.isConfirmWarningDialogPresent())
            .toBe(true);
        await since('Confirm dialog title should be #{expected}, instead we have #{actual}')
            .expect(await warningDialog.getDialogTitle())
            .toBe('Notification');
        await since('Confirm dialog message should be #{expected}, instead we have #{actual}')
            .expect(await warningDialog.getDialogMessageTitle())
            .toBe('Do you want to save your bot?');
        await since('Certify check box present in confirm dialog should be #{expected}, instead we have #{actual}')
            .expect(await warningDialog.isCertifyCheckboxPresent())
            .toBe(true);
        await since('Certify check box check state in confirm dialog should be #{expected}, instead we have #{actual}')
            .expect(await warningDialog.isCertifyCheckboxChecked())
            .toBe(false);
        await warningDialog.confirmCancel();
        // check inactive banner not displayed
        await since('Inactive banner present state should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.isInActiveBannerDisplayed())
            .toBe(false);
        // exit from edit mode again
        await botAuthoring.clickCloseButton();
        // click save in confirm dialog
        await botAuthoring.waitForElementVisible(botAuthoring.getConfirmWarningDialog());
        await warningDialog.confirmSave();
        // go back to library home, rerun bot show inactive error
        await libraryPage.waitForLibraryLoading();
        await since('Check back to libray home should be #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.isSelectedSidebarItem('All'))
            .toBe(true);
        await libraryPage.openBotById({
            projectId: BotToCreate.project.id,
            botId: botId,
            handleError: false,
        });
        await since('Inactive error present state should be #{expected}, instead we have #{actual}')
            .expect(await botConsumptionFrame.isInactiveMsgDisplayed())
            .toBe(true);
        await botConsumptionFrame.clickCloseButtonInMessageBox();
        await aibotChatPanel.closeAllTabs();
    });

    /**
     * 1. user has full bot privilege
     * 2. open bot not in library -> edit bot -> change bot status -> close -> cancel -> close -> do not save -> go back to consumption mode
     * 3. check exit from edit, back to consumption mode, bot still not in library
     * 4. check bot status not changed
     */
    it('[TC95439_05] OpenBot_ChangeBotStatus_ExitFromEdit_CancelSave_ExitFromEdit_DoNotSave', async () => {
        await loginPage.login(certifyBotUser);
        //remove bot if in library
        await libraryPage.removeDossierFromLibrary(certifyBotUser, bot);
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId: botId });
        await libraryAuthoringPage.waitForCurtainDisappear();
        //check add to library banner displayed
        // await since('Add to library banner present state should be #{expected}, instead we have #{actual}')
        //     .expect(await dossierPage.isAddToLibraryDisplayed())
        //     .toBe(true);
        // go to edit mode
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        // check bot status in edit mode
        await since('Active toggele status should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.generalSettings.isActiveBotSwitchOn())
            .toBe(true);
        // deactive bot
        await botAuthoring.generalSettings.deactiveBot();
        // click close button
        await botAuthoring.clickCloseButton();
        // check confirm dialog
        await botAuthoring.waitForElementVisible(botAuthoring.getConfirmWarningDialog());
        await since('Confirm dialog present in edit mode should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.isConfirmWarningDialogPresent())
            .toBe(true);
        await since('Confirm dialog title should be #{expected}, instead we have #{actual}')
            .expect(await warningDialog.getDialogTitle())
            .toBe('Notification');
        await since('Confirm dialog message should be #{expected}, instead we have #{actual}')
            .expect(await warningDialog.getDialogMessageTitle())
            .toBe('Do you want to save your bot?');
        await since('Certify check box present in confirm dialog should be #{expected}, instead we have #{actual}')
            .expect(await warningDialog.isCertifyCheckboxPresent())
            .toBe(true);
        await since('Certify check box check state in confirm dialog should be #{expected}, instead we have #{actual}')
            .expect(await warningDialog.isCertifyCheckboxChecked())
            .toBe(false);
        await warningDialog.confirmCancel();
        // check save button is enabled after cancel save
        await since('Save button should be enabled, instead we have #{actual}')
            .expect(await botAuthoring.isSaveButtonEnabled())
            .toBe(true);
        await botAuthoring.clickCloseButton();
        await warningDialog.confirmDoNotSave();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        //check no inactive dialog in consumption mode
        await since('Inactive msg present state should be #{expected}, instead we have #{actual}')
            .expect(await botConsumptionFrame.isInactiveMsgDisplayed())
            .toBe(false);
        // //check add to library banner displayed
        // await since('Add to library banner present state should be #{expected}, instead we have #{actual}')
        //     .expect(await dossierPage.isAddToLibraryDisplayed())
        //     .toBe(true);
        await aibotChatPanel.goToLibrary();
    });

    /**
     * 1. user has full bot privilege
     * 2. open not in library bot from content discovery -> edit bot -> change bot name -> save -> go back to consumption mode
     * 3. check bot name changed in edit mode and consumption mode
     * 4. check bot is in my library after save
     */
    it('[TC95439_06] OpenBotFromContentDiscovery_EditBot_ChangeBotName_SaveBot', async () => {
        await loginPage.login(certifyBotUser);
        //remove bot if in library
        await libraryPage.removeDossierFromLibrary(certifyBotUser, bot);
        //from info-window in content discovery view
        await libraryPage.openSidebarOnly();
        await sidebar.openContentDiscovery();
        await contentDiscovery.openProjectList();
        await contentDiscovery.selectProject(BotToCreate.project.name);
        await contentDiscovery.openFolderByPath(['Shared Reports']);
        await libraryPage.waitForCurtainDisappear();
        await libraryPage.waitForDynamicElementLoading();
        await libraryPage.waitForLibraryLoading();
        await listViewAGGrid.moveDossierIntoViewPortAGGrid(BotToCreate.data.name);
        await listView.rightClickToOpenContextMenu({ name: BotToCreate.data.name, isWaitCtxMenu: false });
        await libraryPage.clickDossierContextMenuItem('Open');
        await libraryAuthoringPage.waitForCurtainDisappear();
        // await since('Add to library banner present state should be #{expected}, instead we have #{actual}')
        //     .expect(await dossierPage.isAddToLibraryDisplayed())
        //     .toBe(true);
        // go to edit mode
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        // check default values
        await since('Bot name in welcome message should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.getWelcomePageMessageTexts())
            .toContain(BotToTest.defaultName);
        await since('Default Bot name should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getBotNameInput().getValue())
            .toBe(BotToTest.defaultName);
        await since('Default Bot name in chat title should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.getTitleBarBotName().getText())
            .toBe(BotToTest.defaultName);
        // modify bot settings
        await botAuthoring.generalSettings.updateBotName(BotToTest.modifiedName);
        // check in authoring mode
        await since('Bot name should update to #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getBotNameInput().getValue())
            .toBe(BotToTest.modifiedName);
        await since('Bot name in chat title should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.getTitleBarBotName().getText())
            .toBe(BotToTest.modifiedName);
        await since('Bot name in welcome message should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.getWelcomePageMessageTexts())
            .toContain(BotToTest.modifiedName);
        await botAuthoring.saveBot({});
        // check in consumption mode
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await since('Add to library banner present state should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isAddToLibraryDisplayed())
            .toBe(false);
        await since('Bot name in chat title should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.getTitleBarBotName().getText())
            .toBe(BotToTest.modifiedName);
        await since('Bot name in welcome message should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.getWelcomePageMessageTexts())
            .toContain(BotToTest.modifiedName);
        await aibotChatPanel.goToLibrary();
        //check back to content discovery view
        await since('Check back to content discovery view should be #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.isSelectedSidebarItem('Content Discovery'))
            .toBe(true);
        // re-open bot;
        await listViewAGGrid.moveDossierIntoViewPortAGGrid(BotToCreate.data.name);
        await listView.rightClickToOpenContextMenu({ name: BotToCreate.data.name, isWaitCtxMenu: false });
        await libraryPage.clickDossierContextMenuItem('Open');
        await libraryAuthoringPage.waitForCurtainDisappear();
        await since('Add to library banner present state should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isAddToLibraryDisplayed())
            .toBe(false);
        await since('Bot name in chat title should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.getTitleBarBotName().getText())
            .toBe(BotToTest.modifiedName);
        await since('Bot name in welcome message should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.getWelcomePageMessageTexts())
            .toContain(BotToTest.modifiedName);
        await aibotChatPanel.goToLibrary();
    });

    /**
     * 1. user has no bot privilege, however has run and edit bot privilege in security role
     * 2. open not in library bot from content discovery -> edit bot -> change bot name -> save -> go back to consumption mode
     * 3. check bot name changed in edit mode and consumption mode
     * 4. check bot is in my library after save
     */
    it('[TC95439_07] OpenBotFromContentDiscovery_EditBot_ChangeBotName_SaveBot', async () => {
        await loginPage.login(botEdit_NoBotPrivilegeUser);
        //remove bot if in library
        await libraryPage.removeDossierFromLibrary(botEdit_NoBotPrivilegeUser, bot);
        //from info-window in content discovery view
        await libraryPage.openSidebarOnly();
        await sidebar.openContentDiscovery();
        await contentDiscovery.openProjectList();
        await contentDiscovery.selectProject(BotToCreate.project.name);
        await contentDiscovery.openFolderByPath(['Shared Reports']);
        await libraryPage.waitForCurtainDisappear();
        await libraryPage.waitForDynamicElementLoading();
        await libraryPage.waitForLibraryLoading();
        await listViewAGGrid.moveDossierIntoViewPortAGGrid(BotToCreate.data.name);
        await listView.rightClickToOpenContextMenu({ name: BotToCreate.data.name, isWaitCtxMenu: false });
        await libraryPage.clickDossierContextMenuItem('Open');
        await libraryAuthoringPage.waitForCurtainDisappear();
        await since('Add to library banner present state should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isAddToLibraryDisplayed())
            .toBe(true);
        // go to edit mode
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        // check default values
        await since('Bot name in welcome message should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.getWelcomePageMessageTexts())
            .toContain(BotToTest.defaultName);
        await since('Default Bot name should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getBotNameInput().getValue())
            .toBe(BotToTest.defaultName);
        await since('Default Bot name in chat title should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.getTitleBarBotName().getText())
            .toBe(BotToTest.defaultName);
        // modify bot settings
        await botAuthoring.generalSettings.updateBotName(BotToTest.modifiedName);
        // check in authoring mode
        await since('Bot name should update to #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getBotNameInput().getValue())
            .toBe(BotToTest.modifiedName);
        await since('Bot name in chat title should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.getTitleBarBotName().getText())
            .toBe(BotToTest.modifiedName);
        await since('Bot name in welcome message should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.getWelcomePageMessageTexts())
            .toContain(BotToTest.modifiedName);
        await botAuthoring.saveBot({});
        // check in consumption mode
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await since('Add to library banner present state should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isAddToLibraryDisplayed())
            .toBe(false);
        await since('Bot name in chat title should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.getTitleBarBotName().getText())
            .toBe(BotToTest.modifiedName);
        await since('Bot name in welcome message should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.getWelcomePageMessageTexts())
            .toContain(BotToTest.modifiedName);
        await aibotChatPanel.goToLibrary();
        //check back to content discovery view
        await since('Check back to content discovery view should be #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.isSelectedSidebarItem('Content Discovery'))
            .toBe(true);
        // re-open bot;
        await listViewAGGrid.moveDossierIntoViewPortAGGrid(BotToCreate.data.name);
        await listView.rightClickToOpenContextMenu({ name: BotToCreate.data.name, isWaitCtxMenu: false });
        await libraryPage.clickDossierContextMenuItem('Open');
        await libraryAuthoringPage.waitForCurtainDisappear();
        await since('Add to library banner present state should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isAddToLibraryDisplayed())
            .toBe(false);
        await since('Bot name in chat title should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.getTitleBarBotName().getText())
            .toBe(BotToTest.modifiedName);
        await since('Bot name in welcome message should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.getWelcomePageMessageTexts())
            .toContain(BotToTest.modifiedName);
        await aibotChatPanel.goToLibrary();
    });
});
