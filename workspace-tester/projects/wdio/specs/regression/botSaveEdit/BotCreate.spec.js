import setWindowSize from '../../../config/setWindowSize.js';
import { browserWindow } from '../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { createBotByAPI, publishBotByAPI, deleteBotList } from '../../../api/bot/index.js';
import * as consts from '../../../constants/bot.js';
import resetCertify from '../../../api/resetCertify.js';

describe('AI Bot Test of Create Bot', () => {
    let {
        loginPage,
        libraryPage,
        libraryAuthoringPage,
        botAuthoring,
        botConsumptionFrame,
        warningDialog,
        aibotChatPanel,
    } = browsers.pageObj1;
    const botIdsToDelete = [];
    const defaultBotName = 'New Bot';
    const toCreateBotName = 'test_create_bot';
    const toUpdateBotName = 'updated_bot_name';
    const toReUpdateBotName = 're_updated_bot_name';
    const botSample = consts.getBotToCreate({ botName: toCreateBotName });

    const publishInfo = consts.getPublishInfo({
        projectId: botSample.project.id,
        recipients: [
            {
                // botCreate user id
                id: 'FFC41A0C714E6881952B3DB6477890E5',
            },
        ],
    });

    beforeAll(async () => {
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        await libraryPage.openDefaultApp();
    });

    afterEach(async () => {
        await logoutFromCurrentBrowser();
        await deleteBotList({
            credentials: consts.createBotUser,
            botList: [...botIdsToDelete],
            projectId: botSample.project.id,
        });
        botIdsToDelete.length = 0;
    });

    /**
     * 1. user has full privilege
     * 2. create new bot
     * 3. change bot name
     * 4. save change and exit
     */
    it('[TC92082_01] CreateNewBot_ChangeBotName_SaveChange_ExitFromEdit', async () => {
        //login with create bot user
        await loginPage.login(consts.createBotUser);
        //create bot
        await libraryAuthoringPage.createBotWithDataset({ dataset: consts.dataset });
        //update bot name
        await botAuthoring.selectBotConfigTabByName('General');
        await botAuthoring.generalSettings.updateBotName(botSample.data.name);
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
        //click save button and wait for save dialog display
        await botAuthoring.clickSaveButton();
        await botAuthoring.waitForElementVisible(botAuthoring.getSaveDialog());
        //verify bot name in save dialog
        await since('Bot name is save dialog should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.saveAsEditor.getBotNameInSaveDialog())
            .toBe(botSample.data.name);
        //verify certify check box in save dialog
        await since('cetify check box present status in save dialog should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.saveAsEditor.isCertifyCheckBoxPresentInSaveAsDialog())
            .toBe(true);
        await since('cetify check box check status in save dialog should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.saveAsEditor.isCertifyCheckBoxCheckedInSaveAsDialog())
            .toBe(false);
        //save bot by save dialog
        await botAuthoring.saveBotBySaveDialog();
        //get new bot id and put it into botIdsToDelete
        await botAuthoring.waitForElementClickable(botAuthoring.getSaveButton());
        const botId = await botAuthoring.getBotIdFromUrl();
        botIdsToDelete.push(botId);
        //update bot name in newly created bot
        await botAuthoring.selectBotConfigTabByName('General');
        await botAuthoring.generalSettings.updateBotName(toUpdateBotName);
        //save new bot name in setting
        await botAuthoring.saveBot({});
        await botAuthoring.clickCloseButton();
        //open new bot, check bot name
        await libraryPage.openBotById({ projectId: botSample.project.id, botId });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePage());
        await since('Bot name in toolbar should be #{expected}, instead we have #{actual}')
            .expect(await botConsumptionFrame.getBotName())
            .toBe(botSample.data.name);
        //enter new bot edit mode, check bot name in general setting
        await botConsumptionFrame.clickEditButton();
        await botAuthoring.waitForElementClickable(botAuthoring.getSaveButton());
        //check bot name in general setting
        await botAuthoring.selectBotConfigTabByName('General');
        await since('Bot name in general setting should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getBotNameInput().getValue())
            .toBe(toUpdateBotName);
    });

    /**
     * 1. user has full privilege
     * 2. create new bot, save as bot
     * 3. change new bot name
     * 4. save bot
     * 5. exit from edit mode
     */
    it('[TC92082_02] CreateNewBot_SaveAsBotAndCheckCertify_ChangeBotName_SaveChange', async () => {
        //login with create bot user
        await loginPage.login(consts.createBotUser);
        //create bot
        await libraryAuthoringPage.createBotWithDataset({ dataset: consts.dataset });
        //update bot name
        await botAuthoring.selectBotConfigTabByName('General');
        await botAuthoring.generalSettings.updateBotName(botSample.data.name);
        //open button menu
        await botAuthoring.openButtonMenu();
        //click save as button and wait for save dialog display
        await botAuthoring.clickSaveAsButton();
        await botAuthoring.waitForElementVisible(botAuthoring.getSaveDialog());
        //verify bot name in save dialog
        await since('Bot name is save dialog should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.saveAsEditor.getBotNameInSaveDialog())
            .toBe(botSample.data.name);
        //verify certify check box in save dialog
        await since('cetify check box present status in save dialog should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.saveAsEditor.isCertifyCheckBoxPresentInSaveAsDialog())
            .toBe(true);
        await since('cetify check box check status in save dialog should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.saveAsEditor.isCertifyCheckBoxCheckedInSaveAsDialog())
            .toBe(false);
        await botAuthoring.saveAsEditor.changeCertifyCheckBoxInSaveAsDialog(true);
        //save bot by save dialog
        await botAuthoring.saveBotBySaveDialog();
        //get new bot id and put it into botIdsToDelete
        await botAuthoring.waitForElementClickable(botAuthoring.getSaveButton());
        const botId = await botAuthoring.getBotIdFromUrl();
        botIdsToDelete.push(botId);
        //check bot status in new bot edit mode
        await since('Bot certified state in edit mode should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.isBotCertified())
            .toBe(true);
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
        //update bot name in newly created bot
        await botAuthoring.selectBotConfigTabByName('General');
        await botAuthoring.generalSettings.updateBotName(toUpdateBotName);
        //save new bot name in setting
        await botAuthoring.saveBot({});
        await botAuthoring.waitForElementClickable(botAuthoring.getSaveButton());
        //open button menu
        await botAuthoring.openButtonMenu();
        //check save as button after save bot
        await since('Save as button status should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.isSaveAsButtonPresent())
            .toBe(true);
        //check save and certify button
        await since('Save and certify button status should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.isSaveAndCertifyButtonPresent())
            .toBe(false);
        //check bot status in new bot edit mode
        await since('Bot certified state in edit mode should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.isBotCertified())
            .toBe(true);
        //exit from bot edit mode
        await botAuthoring.clickCloseButton();
        //open new bot, check bot name
        await libraryPage.openBotById({ projectId: botSample.project.id, botId: botId });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePage());
        await since('Bot name in toolbar should be #{expected}, instead we have #{actual}')
            .expect(await botConsumptionFrame.getBotName())
            .toBe(botSample.data.name);
        //check bot status in new bot consumption mode
        await since('Bot certified state in consumption mode should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.isBotCertified())
            .toBe(true);
        //enter new bot edit mode, check bot name in general setting
        await botConsumptionFrame.clickEditButton();
        await botAuthoring.waitForElementClickable(botAuthoring.getSaveButton());
        //check bot status in new bot edit mode
        await since('Bot certified state in edit mode should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.isBotCertified())
            .toBe(true);
        await botAuthoring.selectBotConfigTabByName('General');
        await since('Bot name in general setting should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getBotNameInput().getValue())
            .toBe(toUpdateBotName);
    });

    /**
     * 1. user has full privilege
     * 2. create new bot, save bot
     * 3. change new bot name
     * 4. save and certify bot
     * 5. exit from edit mode
     */
    it('[TC92082_03] CreateNewBot_SaveBot_ChangeBotName_SaveAndCertifyBot_ExitFromEdit', async () => {
        //login with create bot user
        await loginPage.login(consts.createBotUser);
        //create bot
        await libraryAuthoringPage.createBotWithDataset({ dataset: consts.dataset });
        //click save button and wait for save dialog display
        await botAuthoring.waitForElementClickable(botAuthoring.getSaveButton());
        await botAuthoring.saveAsBot({ name: botSample.data.name });
        //get new bot id and put it into botIdsToDelete
        await botAuthoring.waitForElementClickable(botAuthoring.getSaveButton());
        const botId = await botAuthoring.getBotIdFromUrl();
        botIdsToDelete.push(botId);
        //update bot name in newly created bot
        await botAuthoring.selectBotConfigTabByName('General');
        await botAuthoring.generalSettings.updateBotName(toUpdateBotName);
        //save new bot name in setting
        await botAuthoring.saveAndCertifyBot();
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
        //exit from bot edit mode
        await botAuthoring.clickCloseButton();
        //open new bot, check bot name
        await libraryPage.openBotById({ projectId: botSample.project.id, botId: botId });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePage());
        await since('Bot name in toolbar should be #{expected}, instead we have #{actual}')
            .expect(await botConsumptionFrame.getBotName())
            .toBe(botSample.data.name);
        //check new bot certify status in consumption mode
        await botAuthoring.waitForElementVisible(botAuthoring.getCertifyIcon());
        //enter new bot edit mode
        await botConsumptionFrame.clickEditButton();
        await botAuthoring.waitForElementClickable(botAuthoring.getSaveButton());
        //check bot name in general setting
        await botAuthoring.selectBotConfigTabByName('General');
        await since('Bot name in general setting should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getBotNameInput().getValue())
            .toBe(toUpdateBotName);
        //check bot certify status in edit mode
        await botAuthoring.waitForElementVisible(botAuthoring.getCertifyIcon());
    });

    /**
     * 1. user has full privilege
     * 2. open certified bot
     * 3. change new bot name
     * 4. save by 'whether save change warning dialog'
     */
    it('[TC92082_04] OpenCertifiedBot_EditBot_SaveAsBot_ChangeBotName_ExitFromEdit_Save', async () => {
        //create bot by api, add bot id to botIdsToDelete
        const botId = await createBotByAPI({ credentials: consts.createBotUser, botInfo: botSample });
        botIdsToDelete.push(botId);
        //publish bot by api
        publishInfo.id = botId;
        await publishBotByAPI({
            credentials: consts.createBotUser,
            publishInfo: publishInfo,
        });
        //certify bot by api
        const bot = consts.getBot({ botId: botId, botName: botSample.data.name });
        await resetCertify({
            dossier: bot,
            credentials: consts.createBotUser,
            type: '55',
            certify: true,
        });
        //login with create bot user
        await loginPage.login(consts.createBotUser);
        //open bot by id
        await libraryPage.openBotById({ projectId: botSample.project.id, botId: botId });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePage());
        //check bot certify status in consumption mode
        await since('Bot certified state in consumption mode should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.isBotCertified())
            .toBe(true);
        //enter new bot edit mode
        await botConsumptionFrame.clickEditButton();
        await botAuthoring.waitForElementClickable(botAuthoring.getSaveButton());
        //check bot certify status in edit mode
        await since('Bot certified state in edit mode should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.isBotCertified())
            .toBe(true);
        //open button menu
        await botAuthoring.openButtonMenu();
        //click save as button and wait for save dialog display
        await botAuthoring.clickSaveAsButton();
        await botAuthoring.waitForElementVisible(botAuthoring.getSaveDialog());
        //change bot name in save dialog
        await botAuthoring.saveAsEditor.changeInputBotNameInSaveAsDialog(toUpdateBotName);
        //verify certify check box in save dialog
        await since('cetify check box present status in save dialog should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.saveAsEditor.isCertifyCheckBoxPresentInSaveAsDialog())
            .toBe(true);
        await since('cetify check box check status in save dialog should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.saveAsEditor.isCertifyCheckBoxCheckedInSaveAsDialog())
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
            .toBe(true);
        //reupdate bot name
        await botAuthoring.selectBotConfigTabByName('General');
        await botAuthoring.generalSettings.updateBotName(toReUpdateBotName);
        //try to exit from bot edit mode
        await botAuthoring.clickCloseButton();
        //check confirm dialog present
        await botAuthoring.waitForElementVisible(botAuthoring.getConfirmWarningDialog());
        //check confirm dialog present, check certify checkbox is not checked
        await since(
            'Certify check box check status in confirm dialog in edit mode should be #{expected}, instead we have #{actual}'
        )
            .expect(await warningDialog.isCertifyCheckboxChecked())
            .toBe(false);
        //save by 'whether save' warning dialog, back to library home
        await warningDialog.confirmSave(false);
        //open bot by id
        await libraryPage.openBotById({ projectId: botSample.project.id, botId: botId });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePage());
        //check bot certify status in consumption mode
        await since('Bot certified state in consumption mode should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.isBotCertified())
            .toBe(true);
        //open bot by id
        await libraryPage.openBotById({ projectId: botSample.project.id, botId: newBotId });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePage());
        //check bot certify status in consumption mode
        await since('Bot certified state in consumption mode should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.isBotCertified())
            .toBe(false);
        //enter new bot edit mode
        await botConsumptionFrame.clickEditButton();
        await botAuthoring.waitForElementClickable(botAuthoring.getSaveButton());
        //check bot name in general setting
        await since('Bot name in chat title should be #{expected}, instead we have #{actual}.')
            .expect(await aibotChatPanel.getTitleBarBotName().getText())
            .toBe(toReUpdateBotName);
    });

    /**
     * 1. user has full privilege
     * 2. open uncertified bot
     * 3. change new bot name
     * 4. save and certify bot
     */
    it('[TC92082_05] OpenBot_EditBot_SaveAsBot_ChangeBotName_SaveAndCertify_ExitFromEdit', async () => {
        //create bot by api, add bot id to botIdsToDelete
        const botId = await createBotByAPI({ credentials: consts.createBotUser, botInfo: botSample });
        botIdsToDelete.push(botId);
        //publish bot by api
        publishInfo.id = botId;
        await publishBotByAPI({
            credentials: consts.createBotUser,
            publishInfo: publishInfo,
        });
        //login with create bot user
        await loginPage.login(consts.createBotUser);
        //open bot by id
        await libraryPage.openBotById({ projectId: botSample.project.id, botId: botId });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePage());
        //check bot certify status in consumption mode
        await since('Bot certified state in consumption mode should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.isBotCertified())
            .toBe(false);
        //enter new bot edit mode
        await botConsumptionFrame.clickEditButton();
        await botAuthoring.waitForElementClickable(botAuthoring.getSaveButton());
        //check bot certify status in edit mode
        await since('Bot certified state in edit mode should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.isBotCertified())
            .toBe(false);
        //open buttons menu
        await botAuthoring.openButtonMenu();
        //click save button and wait for save dialog display
        await botAuthoring.clickSaveAsButton();
        await botAuthoring.waitForElementVisible(botAuthoring.getSaveDialog());
        //change bot name in save dialog
        await botAuthoring.saveAsEditor.changeInputBotNameInSaveAsDialog(toUpdateBotName);
        //verify certify check box in save dialog
        await since('cetify check box present status in save dialog should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.saveAsEditor.isCertifyCheckBoxPresentInSaveAsDialog())
            .toBe(true);
        await since('cetify check box check status in save dialog should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.saveAsEditor.isCertifyCheckBoxCheckedInSaveAsDialog())
            .toBe(false);
        //save bot by save dialog
        await botAuthoring.saveBotBySaveDialog();
        //enter new bot edit mode, add new bot id to botIdsToDelete
        await botAuthoring.waitForElementClickable(botAuthoring.getSaveButton());
        const newBotId = await botAuthoring.getBotIdFromUrl();
        botIdsToDelete.push(newBotId);
        //reupdate bot name
        await botAuthoring.selectBotConfigTabByName('General');
        await botAuthoring.generalSettings.updateBotName(toReUpdateBotName);
        //save and certify bot
        await botAuthoring.saveAndCertifyBot();
        //exit from bot edit mode
        await botAuthoring.clickCloseButton();
        //open bot by id
        await libraryPage.openBotById({ projectId: botSample.project.id, botId: botId });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePage());
        //check bot certify status in consumption mode
        await since('Bot certified state in consumption mode should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.isBotCertified())
            .toBe(false);
        //open bot by id
        await libraryPage.openBotById({ projectId: botSample.project.id, botId: newBotId });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePage());
        //check bot certify status in consumption mode
        await since('Bot certified state in consumption mode should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.isBotCertified())
            .toBe(true);
        //check bot name in general setting
        await since('Bot name in chat title should be #{expected}, instead we have #{actual}.')
            .expect(await aibotChatPanel.getTitleBarBotName().getText())
            .toBe(toReUpdateBotName);
    });

    /**
     * 1. user has full privilege
     * 2. edit bot by url
     * 3. save as bot
     * 3. change new bot name
     * 4. save by 'whether save change warning dialog'
     */
    it('[TC92082_06] EditBotByUrl_SaveAsBot_ChangeBotName_ExitFromEdit_Save', async () => {
        //create bot by api, add bot id to botIdsToDelete
        const botId = await createBotByAPI({ credentials: consts.createBotUser, botInfo: botSample });
        botIdsToDelete.push(botId);
        //publish bot by api
        publishInfo.id = botId;
        await publishBotByAPI({
            credentials: consts.createBotUser,
            publishInfo: publishInfo,
        });
        //login with create bot user
        await loginPage.login(consts.createBotUser);
        //edit bot by Url
        await libraryPage.editBotByUrl({ projectId: botSample.project.id, botId: botId });
        await botAuthoring.waitForElementClickable(botAuthoring.getSaveButton());
        //click save button and wait for save dialog display
        await botAuthoring.saveAsBot({ name: toUpdateBotName });
        //enter new bot edit mode, add new bot id to botIdsToDelete
        await botAuthoring.waitForElementClickable(botAuthoring.getSaveButton());
        const newBotId = await botAuthoring.getBotIdFromUrl();
        botIdsToDelete.push(newBotId);
        //reupdate bot name
        await botAuthoring.selectBotConfigTabByName('General');
        await botAuthoring.generalSettings.updateBotName(toReUpdateBotName);
        //try to exit from bot edit mode
        await botAuthoring.clickCloseButton();
        //wait for confirm dialog present
        await botAuthoring.waitForElementVisible(botAuthoring.getConfirmWarningDialog());
        //check confirm dialog present, check certify checkbox is not checked
        await since(
            'Certify check box check status in confirm dialog in edit mode should be #{expected}, instead we have #{actual}'
        )
            .expect(await warningDialog.isCertifyCheckboxChecked())
            .toBe(false);
        //save by 'whether save' warning dialog, back to library home
        await warningDialog.confirmSave(false);
        //open bot by id
        await libraryPage.openBotById({ projectId: botSample.project.id, botId: botId });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePage());
        //check bot name in general setting in old bot
        await since('Bot name in chat title should be #{expected}, instead we have #{actual}.')
            .expect(await aibotChatPanel.getTitleBarBotName().getText())
            .toBe(defaultBotName);
        //open new bot by id
        await libraryPage.openBotById({ projectId: botSample.project.id, botId: newBotId });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePage());
        //check bot name in general setting in new bot
        await since('Bot name in chat title should be #{expected}, instead we have #{actual}.')
            .expect(await aibotChatPanel.getTitleBarBotName().getText())
            .toBe(toReUpdateBotName);
    });

    /**
     * 1. user has full privilege
     * 2. create new bot
     * 3. exit without save
     * 4. check current page is library home page
     */
    it('[TC92081_01] CreateNewBot_CancelSave_ExitBot', async () => {
        //login with create bot user without certify privilege
        await loginPage.login(consts.createBotUser);
        //create bot
        await libraryAuthoringPage.createBotWithDataset({ dataset: consts.dataset });
        //click save button and wait for save dialog display
        await botAuthoring.clickSaveButton();
        await botAuthoring.waitForElementVisible(botAuthoring.saveAsEditor.getSaveAsEditor());
        //click cancel in save dialog
        await botAuthoring.saveAsEditor.clickCancelButtonInSaveAsDialog();
        //exit from bot edit mode
        await botAuthoring.clickCloseButton();
        await warningDialog.confirmDoNotSave();
        //wait library page is loaded
        await loginPage.waitForLibraryLoading();
        //check current url
        await since('current browser url is #{expected}, instead we have #{actual}.')
            .expect(await browser.getUrl())
            .toBe(new URL('app', browser.options.baseUrl).toString());
    });

    /**
     * 1. user open bot
     * 2. save as bot
     * 3. change bot setting
     * 4. cancel in 'whether save change' warning dialog
     * 4. do not save in 'whether save change' warning dialog
     */
    it('[TC92081_02] OpenBot_SaveAsBot_ChangeBotStatus_ExitFromEdit_CancelSave_DoNotSave', async () => {
        //create bot by api, add bot id to botIdsToDelete
        const botId = await createBotByAPI({ credentials: consts.createBotUser, botInfo: botSample });
        botIdsToDelete.push(botId);
        //publish bot by api
        publishInfo.id = botId;
        await publishBotByAPI({
            credentials: consts.createBotUser,
            publishInfo: publishInfo,
        });
        //login with create bot user
        await loginPage.login(consts.createBotUser);
        //open bot by id
        await libraryPage.openBotById({ projectId: botSample.project.id, botId: botId });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePage());
        //enter new bot edit mode
        await botConsumptionFrame.clickEditButton();
        await botAuthoring.waitForElementClickable(botAuthoring.getSaveButton());
        //click save button and wait for save dialog display
        await botAuthoring.openButtonMenu();
        await botAuthoring.clickSaveAsButton();
        await botAuthoring.waitForElementVisible(botAuthoring.getSaveDialog());
        //change bot name in save dialog
        await botAuthoring.saveAsEditor.changeInputBotNameInSaveAsDialog(toUpdateBotName);
        //save bot by save dialog
        await botAuthoring.saveBotBySaveDialog();
        //enter new bot edit mode, add new bot id to botIdsToDelete
        await botAuthoring.waitForElementClickable(botAuthoring.getSaveButton());
        const newBotId = await botAuthoring.getBotIdFromUrl();
        botIdsToDelete.push(newBotId);
        //reupdate bot name
        await botAuthoring.generalSettings.deactiveBot();
        //try to exit from bot edit mode
        await botAuthoring.clickCloseButton();
        //check confirm dialog present
        await botAuthoring.waitForElementVisible(botAuthoring.getConfirmWarningDialog());
        //cancel by 'whether save' warning dialog
        await warningDialog.confirmCancel();
        //re-try to exit from bot edit mode
        await botAuthoring.clickCloseButton();
        //check confirm dialog present
        await botAuthoring.waitForElementVisible(botAuthoring.getConfirmWarningDialog());
        await since('Confirm dialog present in edit mode should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.isConfirmWarningDialogPresent())
            .toBe(true);
        //cancel by 'whether save' warning dialog
        await warningDialog.confirmDoNotSave();
        //edit bot by Url
        await libraryPage.editBotByUrl({ projectId: botSample.project.id, botId: newBotId });
        await since('new bot active status should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.generalSettings.isActiveBotSwitchOn())
            .toBe(true);
    });

    /**
     * 1. user has no cerity privilege
     * 2. create new bot
     * 3. change bot name
     * 4. save change and exit
     */
    it('[TC92081_03] NoCertifyPrivilege_CreateBot_Save', async () => {
        //login with create bot user without certify privilege
        await loginPage.login(consts.nonCertifyCreateBotUser);
        //create bot
        await libraryAuthoringPage.createBotWithDataset({ dataset: consts.dataset });
        //update bot name
        await botAuthoring.selectBotConfigTabByName('General');
        await botAuthoring.generalSettings.updateBotName(botSample.data.name);
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
        //open button menu
        await botAuthoring.openButtonMenu();
        //click save button and wait for save dialog display
        await botAuthoring.clickSaveAsButton();
        await botAuthoring.waitForElementVisible(botAuthoring.getSaveDialog());
        //verify bot name in save dialog
        await since('Bot name is save dialog should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.saveAsEditor.getBotNameInSaveDialog())
            .toBe(botSample.data.name);
        //verify certify check box in save dialog
        await since('cetify check box present status in save dialog should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.saveAsEditor.isCertifyCheckBoxPresentInSaveAsDialog())
            .toBe(false);
        //save bot
        await botAuthoring.saveBotBySaveDialog();
        //get new bot id and put it into botIdsToDelete
        await botAuthoring.waitForElementClickable(botAuthoring.getSaveButton());
        const botId = await botAuthoring.getBotIdFromUrl();
        botIdsToDelete.push(botId);
        //open new bot, check bot name
        await libraryPage.openBotById({ projectId: botSample.project.id, botId });
        await since('Bot name in toolbar should be #{expected}, instead we have #{actual}')
            .expect(await botConsumptionFrame.getBotName())
            .toBe(botSample.data.name);
    });
});
