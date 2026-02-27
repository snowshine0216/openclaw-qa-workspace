import setWindowSize from '../../../config/setWindowSize.js';
import { browserWindow } from '../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { createBotByAPI, publishBotByAPI, deleteBotList } from '../../../api/bot/index.js';
import * as consts from '../../../constants/bot.js';
import * as appConsts from '../../../constants/customApp/bot.js';
import resetObjectAcl from '../../../api/manageAccess/resetObjectAcl.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

describe('AI Bot Test of Edit Bot Xfunc', () => {
    let {
        loginPage,
        libraryPage,
        libraryAuthoringPage,
        botAuthoring,
        botConsumptionFrame,
        warningDialog,
        aibotChatPanel,
        dossierPage,
        infoWindow,
        sidebar,
        listView,
        contentDiscovery,
        librarySearch,
        fullSearch,
        listViewAGGrid,
    } = browsers.pageObj1;
    const botIdsToDelete = [];
    const appIdsToDelete = [];
    const projectName = 'MicroStrategy Tutorial';
    const toCreateBotName = 'test_create_bot';
    const toUpdateBotName = 'to_update_bot_name';
    const botSample = consts.getBotToCreate({ botName: toCreateBotName });

    const createBotUserPublishInfo = consts.getPublishInfo({
        projectId: botSample.project.id,
        recipients: [
            {
                // botCreate user id
                id: 'FFC41A0C714E6881952B3DB6477890E5',
            },
        ],
    });

    const noCreateAndEditBotUserPublishInfo = consts.getPublishInfo({
        projectId: botSample.project.id,
        recipients: [
            {
                //noCreateAndEditBot_EditBotUser user id
                id: '35B76A500249B91C8CD97E8F1D2DC494',
            },
        ],
    });

    const noEditPermissionPublishInfo = consts.getPublishInfo({
        projectId: botSample.project.id,
        recipients: [
            {
                //noEditPermission_EditBotUser user id
                id: '0D84A2195D4B13999C559096E2DBEFAB',
            },
        ],
    });

    const editBotAppWithCollapseToolbar = appConsts.getRequestBody({
        name: 'EditBot_AppWithCollapseToolbar',
        toolbarMode: 1,
    });

    const editBotAppWithDarkTheme = appConsts.getRequestBody({
        name: 'EditBot_AppWithDarkTheme',
        useColorTheme: true,
        selectedTheme: appConsts.darkTheme,
    });

    const disableEditCostomizedItems = appConsts.getCustomizedItems({
        enable_bot_window_edit_bot: false,
        enable_create_new_content_bot: false,
    });

    const disableCreateNewBotCustomizedItems = appConsts.getCustomizedItems({
        enable_bot_window_edit_bot: true,
        enable_create_new_content_bot: false,
    });

    const editBotAppWithDisableEdit = appConsts.getRequestBody({
        name: 'EditBot_AppWithDisableEdit',
        customizedItems: disableEditCostomizedItems,
    });

    const editBotAppWithDisableCreateNewBot = appConsts.getRequestBody({
        name: 'EditBot_AppWithDisableCreateNewBot',
        customizedItems: disableCreateNewBotCustomizedItems,
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
        await deleteCustomAppList({
            credentials: consts.createBotUser,
            customAppIdList: appIdsToDelete,
        });
        appIdsToDelete.length = 0;
    });

    /**
     * 1. user has not create and edit bot privilege
     * 2. open bot from library page
     * 3. no edit icon in toolbar
     */
    it('[TC92081_08] NoCreateAndEditBotPrivilege_OpenBot_NoEditIcon', async () => {
        //create bot by api, add bot id to botIdsToDelete
        const botId = await createBotByAPI({ credentials: consts.createBotUser, botInfo: botSample });
        botIdsToDelete.push(botId);
        //publish bot by api
        noCreateAndEditBotUserPublishInfo.id = botId;
        await publishBotByAPI({
            credentials: consts.createBotUser,
            publishInfo: noCreateAndEditBotUserPublishInfo,
        });
        //login with create bot user
        await loginPage.login(consts.noCreateAndEditBot_EditBotUser);
        //open bot from library page
        await libraryPage.openBotById({ projectId: noCreateAndEditBotUserPublishInfo.projectId, botId: botId });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePage());
        //check no edit icon in bot toolbar in consumption mode
        await since('edit icon exist status in bot toolbar in consumption mode #{expected}, instead we have #{actual}')
            .expect(await botConsumptionFrame.isEditIconDisplayedInToolbar())
            .toBe(false);
    });

    /**
     * 1. user has not create and edit bot privilege
     * 2. check no create new bot button in library home
     * 3. edit bot by edit url, auto re-direct to bot consumption mode
     * 4. display need permission message bot in consumption mode
     */
    it('[TC92081_09] NoCreateAndEditBotPrivilege_EditBotByUrl', async () => {
        //create bot by api, add bot id to botIdsToDelete
        const botId = await createBotByAPI({ credentials: consts.createBotUser, botInfo: botSample });
        botIdsToDelete.push(botId);
        //publish bot by api
        noCreateAndEditBotUserPublishInfo.id = botId;
        await publishBotByAPI({
            credentials: consts.createBotUser,
            publishInfo: noCreateAndEditBotUserPublishInfo,
        });
        //login with create bot user
        await loginPage.login(consts.noCreateAndEditBot_EditBotUser);
        //check no create bot icon displayed in library home
        await libraryAuthoringPage.clickNewDossierIcon();
        await libraryAuthoringPage.waitForElementVisible(libraryAuthoringPage.getCreateDossierDropdownMenu());
        await since('new bot button exist status in new button menu is #{expected}, instead we have #{actual}')
            .expect(await libraryAuthoringPage.isNewBotButtonPresent())
            .toBe(false);
        //edit bot by Url
        await libraryPage.editBotByUrl({ projectId: botSample.project.id, botId: botId });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePage());
        //check current url is bot consumption mode
        await since('current browser url is #{expected}, instead we have #{actual}.')
            .expect(await browser.getUrl())
            .toBe(new URL(`app/${botSample.project.id}/${botId}`, browser.options.baseUrl).toString());
    });

    /**
     * 1. user has full privielge, no edit permission on current bot
     * 2. edit bot from library home
     * 3. save dialog when save bot
     * 4. get error message when try to overwrite current bot
     */
    it('[TC92081_10] NoEditPermission_EditBotFromLibrary_SaveBot_OverwriteCurrentBot', async () => {
        //create bot by api, add bot id to botIdsToDelete
        const botId = await createBotByAPI({ credentials: consts.createBotUser, botInfo: botSample });
        botIdsToDelete.push(botId);
        //publish bot by api
        noEditPermissionPublishInfo.id = botId;
        await publishBotByAPI({
            credentials: consts.createBotUser,
            publishInfo: noEditPermissionPublishInfo,
        });
        //get bot Object for change bot acl
        const botObject = consts.getBotObject({
            botId: botId,
            botName: botSample.data.name,
            projectId: botSample.project.id,
        });
        const botAcls = [];
        //set bot acl to 'Can View' for everyone, everyone user group id is C82C6B1011D2894CC0009D9F29718E4F
        let botAcl = consts.getBotAcl({
            aclValue: 'Can View',
            userId: 'C82C6B1011D2894CC0009D9F29718E4F',
            username: 'Everyone',
        });
        botAcls.push(botAcl);
        //set bot acl to 'Can View' for noEditPermission_EditBotUser user, noEditPermission_EditBotUser user id is 0D84A2195D4B13999C559096E2DBEFAB
        botAcl = consts.getBotAcl({
            aclValue: 'Can View',
            userId: '0D84A2195D4B13999C559096E2DBEFAB',
            username: consts.noEditPermission_EditBotUser.username,
        });
        botAcls.push(botAcl);
        //set bot acl to 'Full Control' for ceate Bot user, user id is FFC41A0C714E6881952B3DB6477890E5
        botAcl = consts.getBotAcl({
            aclValue: 'Full Control',
            userId: 'FFC41A0C714E6881952B3DB6477890E5',
            username: consts.createBotUser.username,
        });
        botAcls.push(botAcl);
        //apply new acls to bot
        await resetObjectAcl({ credentials: consts.createBotUser, object: botObject, acl: botAcls });
        //edit bot from library context menu
        await loginPage.login(consts.noEditPermission_EditBotUser);
        await libraryPage.openDossierContextMenu(botSample.data.name);
        await libraryPage.clickDossierContextMenuItem('Edit');
        await botAuthoring.waitForElementClickable(botAuthoring.getSaveButton());
        //click save button and wait for save dialog display
        await botAuthoring.clickSaveButton();
        await botAuthoring.waitForElementVisible(botAuthoring.getSaveDialog());
        //try to overwrite current bot
        await botAuthoring.saveBotBySaveDialog(false);
        //check No Permission Alert dialog displayed
        await botAuthoring.waitForElementVisible(botAuthoring.getAlert());
        await since(`alert content should be inlcude 'does not have Write access', instead we have #{actual}.`)
            .expect((await botAuthoring.getAlertContent()).includes('does not have Write access'))
            .toBe(true);
        //click ok button in No Permission Alert  dialog
        await botAuthoring.clickConfirmButtonInNoPermissionAlert();
        //cancel in save dialog
        await botAuthoring.saveAsEditor.clickCancelButtonInSaveAsDialog();
        //exit from bot edit mode
        await botAuthoring.clickCloseButton();
    });

    /**
     * 1. user has full privielge, no edit permission on current bot
     * 2. open bot from library home context menu
     * 3. edit bot, save bot to a new one
     * 4. new bot info is expected
     */
    it('[TC92081_11] NoEditPermission_OpenBot_EditBot_ChangeBotName_ExitFromEdit_Save', async () => {
        //create bot by api, add bot id to botIdsToDelete
        const botId = await createBotByAPI({ credentials: consts.createBotUser, botInfo: botSample });
        botIdsToDelete.push(botId);
        //publish bot by api
        noEditPermissionPublishInfo.id = botId;
        await publishBotByAPI({
            credentials: consts.createBotUser,
            publishInfo: noEditPermissionPublishInfo,
        });
        //get bot Object for change bot acl
        const botObject = consts.getBotObject({
            botId: botId,
            botName: botSample.data.name,
            projectId: botSample.project.id,
        });
        const botAcls = [];
        //set bot acl to 'Can View' for everyone, everyone user group id is C82C6B1011D2894CC0009D9F29718E4F
        let botAcl = consts.getBotAcl({
            aclValue: 'Can View',
            userId: 'C82C6B1011D2894CC0009D9F29718E4F',
            username: 'Everyone',
        });
        botAcls.push(botAcl);
        //set bot acl to 'Can View' for noEditPermission_EditBotUser user, noEditPermission_EditBotUser user id is 0D84A2195D4B13999C559096E2DBEFAB
        botAcl = consts.getBotAcl({
            aclValue: 'Can View',
            userId: '0D84A2195D4B13999C559096E2DBEFAB',
            username: consts.noEditPermission_EditBotUser.username,
        });
        botAcls.push(botAcl);
        //set bot acl to 'Full Control' for ceate Bot user, user id is FFC41A0C714E6881952B3DB6477890E5
        botAcl = consts.getBotAcl({
            aclValue: 'Full Control',
            userId: 'FFC41A0C714E6881952B3DB6477890E5',
            username: consts.createBotUser.username,
        });
        botAcls.push(botAcl);
        //apply new acls to bot
        await resetObjectAcl({ credentials: consts.createBotUser, object: botObject, acl: botAcls });
        //open bot by url
        await loginPage.login(consts.noEditPermission_EditBotUser);
        await libraryPage.openBotById({ projectId: botSample.project.id, botId: botId });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePage());
        //enter bot edit mode from consumption mode
        await botConsumptionFrame.clickEditButton();
        await botAuthoring.waitForElementClickable(botAuthoring.getSaveButton());
        //update bot name
        await botAuthoring.selectBotConfigTabByName('General');
        await botAuthoring.generalSettings.updateBotName(botSample.data.name);
        //try to exit from edit mode
        await botAuthoring.clickCloseButton();
        //check confirm dialog present
        await botAuthoring.waitForElementVisible(botAuthoring.getConfirmWarningDialog());
        //save by 'whether save' warning dialog, display save dialog
        await warningDialog.confirmSave(false);
        await botAuthoring.waitForElementVisible(botAuthoring.getSaveDialog());
        //verify bot name in save dialog
        await botAuthoring.saveAsEditor.changeInputBotNameInSaveAsDialog(toUpdateBotName);
        //save bot by save dialog
        await botAuthoring.saveBotBySaveDialog();
        //get new bot id and put it into botIdsToDelete
        await botAuthoring.waitForElementClickable(botAuthoring.getSaveButton());
        const newBotId = await botAuthoring.getBotIdFromUrl();
        botIdsToDelete.push(newBotId);
        //exit from edit mode
        await botAuthoring.clickCloseButton();
        //open new bot, check bot name
        await libraryPage.openBotById({ projectId: botSample.project.id, botId: newBotId });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePage());
        //check bot name in chat panel toolbar, consist with that condig in general setting
        await since('Bot name in chat title should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.getTitleBarBotName().getText())
            .toBe(botSample.data.name);
        await aibotChatPanel.goToLibrary();
    });

    /**
     * 1. user has full privilege
     * 2. open bot in custom app, which collapse toolbar
     * 3. check toolbar status in bot consumption mode and edit mode
     */
    it('[TC92081_12] OpenBot_EditBot_WhenCustomAppCollapseToolbar', async () => {
        //create collapse toolbar custom app, add new custom app id to appIdsToDelete
        const customAppId = await createCustomApp({
            credentials: consts.createBotUser,
            customAppInfo: editBotAppWithCollapseToolbar,
        });
        appIdsToDelete.push(customAppId);
        //create bot by api, add bot id to botIdsToDelete
        const botId = await createBotByAPI({ credentials: consts.createBotUser, botInfo: botSample });
        botIdsToDelete.push(botId);
        //publish bot by api
        createBotUserPublishInfo.id = botId;
        await publishBotByAPI({
            credentials: consts.createBotUser,
            publishInfo: createBotUserPublishInfo,
        });
        //login
        await loginPage.login(consts.createBotUser);
        //switch custom app
        await dossierPage.openCustomAppById({ id: customAppId });
        //open bot by id
        await libraryPage.openBotById({ appId: customAppId, projectId: botSample.project.id, botId: botId });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePage());
        //check bot toolar in consumption mode
        await dossierPage.waitForElementVisible(dossierPage.getNavigationBarCollapsedIcon());
        //expand toolbar
        await dossierPage.expandCollapsedNavBar();
        //edit bot in consumption mode
        await botConsumptionFrame.clickEditButton();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePage());
        //check no nevigate bar displayed
        await since('nevigate bar exist status is edit mode is #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isNavigationBarCollapsedIconPresent())
            .toBe(false);
        //check ai bot toolbar displayed
        await since('ai bot toolbar exist status is edit mode  is #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.isAiBotToolbarPresent())
            .toBe(true);
    });

    /**
     * 1. user has full privilege
     * 2. open bot in custom app, which collapse toolbar
     * 3. check toolbar status in bot consumption mode and edit mode
     */
    it('[TC92081_13] OpenBot_EditBot_StyleWhenCustomAppUseDarkTheme', async () => {
        //create collapse toolbar custom app
        const customAppId = await createCustomApp({
            credentials: consts.createBotUser,
            customAppInfo: editBotAppWithDarkTheme,
        });
        appIdsToDelete.push(customAppId);
        //create bot by api, add bot id to botIdsToDelete
        const botId = await createBotByAPI({ credentials: consts.createBotUser, botInfo: botSample });
        botIdsToDelete.push(botId);
        //publish bot by api
        createBotUserPublishInfo.id = botId;
        await publishBotByAPI({
            credentials: consts.createBotUser,
            publishInfo: createBotUserPublishInfo,
        });
        //login
        await loginPage.login(consts.createBotUser);
        //switch custom app
        await dossierPage.openCustomAppById({ id: customAppId });
        //open bot by id
        await libraryPage.openBotById({ appId: customAppId, projectId: botSample.project.id, botId: botId });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePage());
        //screenshot on home icon in toolbar in consumption mode
        await takeScreenshotByElement(
            aibotChatPanel.getLibraryIcon(),
            'TC92081_13',
            'Dark mode home icon of toolbar in consumption mode'
        );
        //screenshot on bot name in toolbar in consumption mode
        await takeScreenshotByElement(
            botConsumptionFrame.getBotNameSegmentInToolbar(),
            'TC92081_13',
            'Dark mode bot name of toolbar in consumption mode'
        );
        //screenshot on share icon in toolbar in consumption mode
        await takeScreenshotByElement(
            botConsumptionFrame.getShareButtonInToolbar(),
            'TC92081_13',
            'Dark mode share icon of toolbar in consumption mode'
        );
        //screenshot on edit icon in toolbar in consumption mode
        await takeScreenshotByElement(
            botConsumptionFrame.getEditButton(),
            'TC92081_13',
            'Dark mode edit button of toolbar in consumption mode'
        );
        //screenshot on account icon in toolbar in consumption mode
        await takeScreenshotByElement(
            botConsumptionFrame.getAccountIconInToolbar(),
            'TC92081_13',
            'Dark mode account icon of toolbar in consumption mode'
        );
        //toolbar Background color in authoring mode
        await since('toolbar color in consumption mode #{expected}, instead we have #{actual}')
            .expect(await dossierPage.getNavigationBarBackgroundColor())
            .toBe('rgba(41,49,59,1)');
        //edit bot in consumption mode
        await botConsumptionFrame.clickEditButton();
        await botAuthoring.waitForElementClickable(botAuthoring.getSaveButton());
        //screenshot on home icon in toolbar in edit mode
        await takeScreenshotByElement(
            aibotChatPanel.getLibraryIcon(),
            'TC92081_13',
            'Dark mode home icon of toolbar in edit mode'
        );
        //screenshot on bot name in toolbar in edit mode
        await takeScreenshotByElement(
            botConsumptionFrame.getBotNameSegmentInToolbar(),
            'TC92081_13',
            'Dark mode bot name of toolbar in edit mode'
        );
        //screenshot on editing icon in edit mode
        await takeScreenshotByElement(
            botAuthoring.getEditingIconInAuthoringBotToolbar(),
            'TC92081_13',
            'Dark mode editing icon of toolbar in edit mode'
        );
        //screenshot on share icon in toolbar in edit mode
        await takeScreenshotByElement(
            botConsumptionFrame.getShareButtonInToolbar(),
            'TC92081_13',
            'Dark mode share icon of toolbar in edit mode'
        );
        //screenshot on close icon in toolbar in edit mode
        await takeScreenshotByElement(
            botAuthoring.getCloseButton(),
            'TC92081_13',
            'Dark mode close button of toolbar in edit mode'
        );
        //screenshot on save button container in edit mode
        await takeScreenshotByElement(
            botAuthoring.getSaveButton(),
            'TC92081_13',
            'Dark mode save button  of toolbar  in edit mode'
        );
        //screenshot on save button container in edit mode
        await takeScreenshotByElement(
            botAuthoring.getArrowDownOnSave(),
            'TC92081_13',
            'Dark mode arrow down of toolbar  in edit mode'
        );
        //screenshot on button menus in edit mode
        await botAuthoring.openButtonMenu();
        await takeScreenshotByElement(
            botAuthoring.getSaveBotDropDown(),
            'TC92081_13',
            'Dark mode button menu of toolbar  in edit mode'
        );
        //toolbar Background color in edit mode
        await since('toolbar color in edit mode #{expected}, instead we have #{actual}')
            .expect(await dossierPage.getNavigationBarBackgroundColor())
            .toBe('rgba(255,255,255,1)');
    });

    /**
     * 1. user has full privielge
     * 2. open bot in custom app, which disabled edit in bot winodws
     * 3. check no edit bot entry in library home
     */
    it('[TC92081_14] OpenBot_WhenCustomAppDisableEditBot', async () => {
        //create collapse toolbar custom app
        const customAppId = await createCustomApp({
            credentials: consts.createBotUser,
            customAppInfo: editBotAppWithDisableEdit,
        });
        appIdsToDelete.push(customAppId);
        //create bot by api, add bot id to botIdsToDelete
        const botId = await createBotByAPI({ credentials: consts.createBotUser, botInfo: botSample });
        botIdsToDelete.push(botId);
        //publish bot by api
        createBotUserPublishInfo.id = botId;
        await publishBotByAPI({
            credentials: consts.createBotUser,
            publishInfo: createBotUserPublishInfo,
        });
        //login
        await loginPage.login(consts.createBotUser);
        //switch custom app
        await dossierPage.openCustomAppById({ id: customAppId });
        //check no create bot icon displayed in library home
        await libraryAuthoringPage.clickNewDossierIcon();
        await libraryAuthoringPage.waitForElementVisible(libraryAuthoringPage.getCreateDossierDropdownMenu());
        await since('new bot button exist status in new button menu is #{expected}, instead we have #{actual}')
            .expect(await libraryAuthoringPage.isNewBotButtonPresent())
            .toBe(false);
        //load current custom app url
        await dossierPage.openCustomAppById({ id: customAppId });
        //check edit icon in info window in library page
        await libraryPage.openDossierInfoWindow(botSample.data.name);
        await since('edit icon exist status in info window is #{expected}, instead we have #{actual}')
            .expect(await infoWindow.isEditIconPresent())
            .toBe(false);
        await infoWindow.close();

        //check edit icon in context menu in library page
        await libraryPage.openDossierContextMenu(botSample.data.name);
        await since('edit icon exist status in context is #{expected}, instead we have #{actual}')
            .expect(await libraryPage.isEditIconDisplayedInContextMenu())
            .toBe(false);
        //check edit in context menu in content discovery
        await libraryPage.openSidebarOnly();
        await sidebar.openContentDiscovery();
        await contentDiscovery.openProjectList();
        await contentDiscovery.selectProject(projectName);
        await contentDiscovery.openFolderByPath(['Shared Reports']);
        await libraryPage.waitForCurtainDisappear();
        await libraryPage.waitForDynamicElementLoading();
        await libraryPage.waitForLibraryLoading();
        await listViewAGGrid.clickSortBarColumn('Updated', 'descending');
        await listView.rightClickToOpenContextMenu({ name: botSample.data.name });
        await since(
            'edit icon exist status in context menu of content discovery is #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.isEditIconDisplayedInContextMenu())
            .toBe(false);
        await sidebar.openAllSectionList();
        //check edit in info window in content discovery
        await libraryPage.openSidebarOnly();
        await sidebar.openContentDiscovery();
        await contentDiscovery.openProjectList();
        await contentDiscovery.selectProject(projectName);
        await contentDiscovery.openFolderByPath(['Shared Reports']);
        await libraryPage.waitForCurtainDisappear();
        await libraryPage.waitForDynamicElementLoading();
        await libraryPage.waitForLibraryLoading();
        await listViewAGGrid.clickSortBarColumn('Updated', 'descending');
        await since('edit icon exist status in content discovery is #{expected}, instead we have #{actual}')
            .expect(await listView.isDossierEditIconPresent(botSample.data.name))
            .toBe(false);
        await sidebar.openAllSectionList();
        //check edit in info window in search page
        await librarySearch.openSearchBox();
        await librarySearch.search(botSample.data.name);
        await librarySearch.pressEnter();
        await fullSearch.clickAllTab();
        await fullSearch.waitForSearchLoading();
        await fullSearch.openInfoWindow(botSample.data.name);
        await since('edit icon exist status in info window of global search is #{expected}, instead we have #{actual}')
            .expect(await infoWindow.isEditIconPresent())
            .toBe(false);
        await fullSearch.backToLibrary();
        //open bot by id
        await libraryPage.openBotById({ appId: customAppId, projectId: botSample.project.id, botId: botId });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePage());
        //check no edit icon in bot toolbar in consumption mode
        await since('edit icon exist status in bot toolbar in consumption mode #{expected}, instead we have #{actual}')
            .expect(await botConsumptionFrame.isEditIconDisplayedInToolbar())
            .toBe(false);
    });

    /**
     * 1. user has full privielge
     * 2. open bot in custom app, which disabled create new bot setting
     * 3. check no save as button in bot edit mode
     */
    it('[TC95159] OpenBot_WhenCustomAppDisableCreateNewBot', async () => {
        //create custom app disable create new bot
        const customAppId = await createCustomApp({
            credentials: consts.createBotUser,
            customAppInfo: editBotAppWithDisableCreateNewBot,
        });
        appIdsToDelete.push(customAppId);
        //create bot by api, add bot id to botIdsToDelete
        const botId = await createBotByAPI({ credentials: consts.createBotUser, botInfo: botSample });
        botIdsToDelete.push(botId);
        //publish bot by api
        createBotUserPublishInfo.id = botId;
        await publishBotByAPI({
            credentials: consts.createBotUser,
            publishInfo: createBotUserPublishInfo,
        });
        //login
        await loginPage.login(consts.createBotUser);
        //switch custom app
        await dossierPage.openCustomAppById({ id: customAppId });
        //check no create bot icon displayed in library home
        await libraryAuthoringPage.clickNewDossierIcon();
        await libraryAuthoringPage.waitForElementVisible(libraryAuthoringPage.getCreateDossierDropdownMenu());
        await since('new bot button exist status in new button menu is #{expected}, instead we have #{actual}')
            .expect(await libraryAuthoringPage.isNewBotButtonPresent())
            .toBe(false);
        //load current custom app url
        await dossierPage.openCustomAppById({ id: customAppId });
        //open bot by id
        await libraryPage.openBotById({ appId: customAppId, projectId: botSample.project.id, botId: botId });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePage());
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePage());
        //open button menu
        await botAuthoring.openButtonMenu();
        //check there should no save as button
        await since('Save as button status should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.isSaveAsButtonPresent())
            .toBe(false);
    });
});
