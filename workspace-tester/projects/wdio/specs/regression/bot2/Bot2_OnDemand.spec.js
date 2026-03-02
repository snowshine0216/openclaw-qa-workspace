/* eslint-disable @typescript-eslint/no-floating-promises */
import setWindowSize from '../../../config/setWindowSize.js';
import deleteObjectByNames from '../../../api/folderManagement/deleteObjectByNames.js';
import { deleteBotV2ChatByAPI } from '../../../api/bot2/chatAPI.js';
import createBotByAPIV2 from '../../../api/bot2/createBotAPIV2.js';

describe('Bot2_OnDemand', () => {
    const project = {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    };

    const botUser = {
        credentials: {
            username: 'bot2_ondemand_auto',
            password: 'newman1#',
        },
    };

    const botUserSF = {
        credentials: {
            username: 'bot2_sf',
            password: '',
            id: '0484BC5A47BEE8047C6B92A62490714F', // user id
        },
    };

    const targetFolder = {
        id: '9438383F6E42EEBEF2042385DF51CEB8',
        name: 'Target folder',
    };

    const sourceBot = {
        id: 'DA72EEE9FED149CAB9386C2069B8BDF2',
        name: 'On Demand - Bot',
        project: project,
    };

    const sourceBotForSaveAs = {
        id: '36E098ECF8446D5B8528E9B307F49852',
        name: 'On Demand - Bot for Save As',
        project: project,
    };

    const existingBotForSaveAs = {
        id: '632EC7A5254B6B219145BE9CE0233FEE',
        name: 'On Demand - Bot for Save As (Existing)',
        project: project,
    };

    const newBotForCopy = {
        name: 'On Demand - New Bot for copy',
    };

    const newADCForCopy = {
        name: 'On Demand - New ADC for copy',
    };

    const newBotBasedOnADC = {
        name: 'On Demand - New Bot based on ADC',
    };

    const newBotForSaveAs = {
        name: 'On Demand - New Bot for save as',
    };

    const newBotForDuplicateADC = {
        name: 'New Bot for duplicate ADC',
    };

    const baseADCForDuplicate = {
        id: '129F2929754F51249E0103B1CA4D19EE',
        name: 'AUTO_ADC_duplicate',
        project: project,
    };

    const duplicatedADC = {
        name: 'duplicated ADC',
    };

    const sourceADC = {
        id: 'AA872B05D44ECE0AC5AB9AAD6B05AC2B',
        name: 'On Demand - ADC',
        project: project,
    };

    const sourceBotWithNoModifyACL = {
        id: 'ECDBF6C5C92B4C689A18B551A64F69A1',
        name: 'On Demand - Bot (no modify)',
        project: project,
    };

    const sourceBotWithDatasetDisableAI = {
        id: '6107187D76D84AC8AFDAD3319D0A454B',
        name: 'On Demand - Bot (disable AI)',
        project: project,
    };

    const sourceADCWithDatasetDisableAI = {
        id: 'FC600911364DE2789842858A37372B4E',
        name: 'On Demand - ADC (disable AI)',
        project: project,
    };

    const datasetDisableAI = {
        id: '9B170707604D93D415EA6EA92B256913',
        name: 'Dataset_for_on_demand (disable AI)',
        project: project,
    };

    const sourceBotWithDatasetNotPublished = {
        id: '43F8B70FBED44AFEBC97FCB044616A99',
        name: 'On Demand - Bot (not published)',
        project: project,
    };

    const sourceADCWithDatasetNotPublished = {
        id: '989327909D44E564C046548FFFBBFAB4',
        name: 'On Demand - ADC (not published)',
        project: project,
    };

    const datasetNotPublished = {
        id: '0C0B42A73C46204170625BBB9FBCCA4D',
        name: 'Dataset_for_on_demand (not published)',
        project: project,
    };

    const test_object_info = {
        question1: 'For AirTran Airways Corporation in April 2009, how many flights were delayed on Monday?',
        question2: 'What is the number of flights for AirTran Airways Corporation at BWI airport during July 2010?',
    };

    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let {
        loginPage,
        libraryPage,
        libraryAuthoringPage,
        botAuthoring,
        dossierPage,
        botConsumptionFrame,
        aibotChatPanel,
        adc,
        sidebar,
        listViewAGGrid,
        contentDiscovery,
        listView,
        copyMoveWindow,
        manageAccess,
        aibotDatasetPanel,
        datasetPanel,
        dossierMojo,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await deleteCreatedObjects();
    });

    beforeEach(async () => {
        if (!(await loginPage.isLoginPageDisplayed())) {
            await browser.url(new URL('auth/ui/loginPage', browser.options.baseUrl).toString(), 100000);
        }
        await libraryPage.executeScript('window.localStorage.clear();');
    });

    afterEach(async () => {
        await libraryPage.openUserAccountMenu();
        await libraryPage.logout();
        await deleteCreatedObjects();
    });

    async function deleteCreatedObjects() {
        await deleteObjectByNames({
            credentials: botUser.credentials,
            projectId: project.id,
            parentFolderId: targetFolder.id,
            names: [newBotForCopy.name, newBotForSaveAs.name, newBotBasedOnADC.name, newBotForDuplicateADC.name],
        });
        await deleteObjectByNames({
            credentials: botUser.credentials,
            projectId: project.id,
            parentFolderId: targetFolder.id,
            names: [newADCForCopy.name, duplicatedADC.name],
        });
    }

    async function loginUserAndGoToLibraryHome(user) {
        await libraryPage.switchUser(user.credentials);
        await libraryPage.openSidebarOnly();
        await sidebar.clickAllSection();
    }

    it('[TC99014_1] Copy bot', async () => {
        await loginUserAndGoToLibraryHome(botUser);

        // Go to content discovery, copy bot
        await libraryPage.openSidebarOnly();
        await sidebar.openContentDiscovery();
        await contentDiscovery.openProjectList();
        await contentDiscovery.selectProject('MicroStrategy Tutorial');
        await contentDiscovery.openFolderByPath(['Shared Reports', 'Bot2.0', 'Automation', 'On Demand']);
        await listViewAGGrid.clickContextMenuIconInGrid(sourceBot.name);
        await libraryPage.clickDossierContextMenuItem('Copy to...');
        await copyMoveWindow.renameDossier(newBotForCopy.name);
        await copyMoveWindow.openFolderByPath([targetFolder.name]);
        await copyMoveWindow.clickCreateAndWaitForProcessor();

        // Run bot, check if there is any error
        await contentDiscovery.openFolderByPath([targetFolder.name]);
        await listView.openDossier(newBotForCopy.name);
        await dossierPage.waitForDossierLoading();
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();
        await since('Bot name should be #{expected} but is #{actual}')
            .expect(await botConsumptionFrame.getBotName())
            .toEqual(newBotForCopy.name);
        await since('Run bot should be successful without error')
            .expect(await dossierPage.isErrorPresent())
            .toBe(false);

        // Ask question
        await aibotChatPanel.askQuestionNoWaitViz(test_object_info.question1);
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();
        await since('The question sent should be #{expected}, while we get #{actual}')
            .expect(await aibotChatPanel.getQueryTextByIndex(0))
            .toBe(test_object_info.question1);
        await since('Send question, the answer count should be #{expected}, while we get #{actual}')
            .expect(await aibotChatPanel.getValidAnswerCount())
            .toBe(1);

        await dossierPage.goToLibrary();
    });

    it('[TC99014_2] Copy ADC and create bot', async () => {
        await loginUserAndGoToLibraryHome(botUser);
        newADCForCopy.name = 'On Demand - New ADC for copy ' + Date.now();

        // Go to content discovery, copy ADC
        await libraryPage.openSidebarOnly();
        await sidebar.openContentDiscovery();
        await contentDiscovery.openProjectList();
        await contentDiscovery.selectProject('MicroStrategy Tutorial');
        await contentDiscovery.openFolderByPath(['Shared Reports', 'Bot2.0', 'Automation', 'On Demand']);
        await listViewAGGrid.clickContextMenuIconInGrid(sourceADC.name);
        await libraryPage.clickDossierContextMenuItem('Copy to...');
        await copyMoveWindow.renameDossier(newADCForCopy.name);
        await copyMoveWindow.openFolderByPath([targetFolder.name]);
        await copyMoveWindow.clickCreateAndWaitForProcessor();

        // Create bot based on the ADC
        await contentDiscovery.openFolderByPath([targetFolder.name]);
        await listViewAGGrid.clickContextMenuIconInGrid(newADCForCopy.name);
        await libraryPage.clickDossierContextMenuItem('Create Agent');
        await dossierPage.waitForDossierLoading();
        await botAuthoring.saveBotWithName(newBotBasedOnADC.name);
        await since('Library title should be #{expected} but is #{actual}')
            .expect(await botConsumptionFrame.getBotName())
            .toEqual(newBotBasedOnADC.name);
        await dossierPage.goToLibrary();

        // Check the ACL of new agent
        await listView.openInfoWindowFromListView(newBotBasedOnADC.name);
        await listView.clickMoreMenuFromIW();
        await listView.clickManageAccessFromIW();
        await manageAccess.waitForManageAccessLoading();
        since(`${botUser.credentials.username} ACL should be #{expected}, while we get #{actual}`)
            .expect(await manageAccess.getUserCurrentACL(botUser.credentials.username))
            .toBe('Full Control');
        since(`Administrator ACL should be #{expected}, while we get #{actual}`)
            .expect(await manageAccess.getUserCurrentACL('Administrator'))
            .toBe('Full Control');
        since(`Everyone ACL should be #{expected}, while we get #{actual}`)
            .expect(await manageAccess.getUserCurrentACL('Everyone'))
            .toBe('Full Control');
        await manageAccess.cancelManageAccessChange();

        // Run bot, check if there is any error
        await listView.openDossier(newBotBasedOnADC.name);
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();
        await since('Run bot should be successful without error')
            .expect(await dossierPage.isErrorPresent())
            .toBe(false);

        // Ask question
        await aibotChatPanel.askQuestionNoWaitViz(test_object_info.question1);
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();
        await since('The question sent should be #{expected}, while we get #{actual}')
            .expect(await aibotChatPanel.getQueryTextByIndex(0))
            .toBe(test_object_info.question1);
        await since('Send question, the answer count should be #{expected}, while we get #{actual}')
            .expect(await aibotChatPanel.getValidAnswerCount())
            .toBe(1);

        await dossierPage.goToLibrary();
    });

    it('[TC99014_3] Save as new', async () => {
        await loginUserAndGoToLibraryHome(botUser);

        // Run bot, save as new
        await libraryPage.openBot(sourceBotForSaveAs.name);
        await botConsumptionFrame.clickEditButton();
        await botAuthoring.openButtonMenu();
        await botAuthoring.clickSaveAsButton();
        await libraryAuthoringPage.saveInMyReport(newBotForSaveAs.name, [
            'Bot2.0',
            'Automation',
            'On Demand',
            'Target folder',
        ]);
        await dossierPage.goToLibrary();

        // Check ACL
        await libraryPage.openDossierContextMenu(newBotForSaveAs.name);
        await libraryPage.clickDossierContextMenuItem('Manage Access');
        await manageAccess.waitForManageAccessLoading();
        since(`${botUser.credentials.username} ACL should be #{expected}, while we get #{actual}`)
            .expect(await manageAccess.getUserCurrentACL(botUser.credentials.username))
            .toBe('Full Control');
        since(`Administrator ACL should be #{expected}, while we get #{actual}`)
            .expect(await manageAccess.getUserCurrentACL('Administrator'))
            .toBe('Full Control');
        since(`Everyone ACL should be #{expected}, while we get #{actual}`)
            .expect(await manageAccess.getUserCurrentACL('Everyone'))
            .toBe('Full Control');
        await manageAccess.cancelManageAccessChange();

        // Run bot, check if there is any error
        await libraryPage.openBot(newBotForSaveAs.name);
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();
        await since('Run bot should be successful without error')
            .expect(await dossierPage.isErrorPresent())
            .toBe(false);

        // Ask question
        await aibotChatPanel.askQuestionNoWaitViz(test_object_info.question1);
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();
        await since('The question sent should be #{expected}, while we get #{actual}')
            .expect(await aibotChatPanel.getQueryTextByIndex(0))
            .toBe(test_object_info.question1);
        await since('Send question, the answer count should be #{expected}, while we get #{actual}')
            .expect(await aibotChatPanel.getValidAnswerCount())
            .toBe(1);

        await dossierPage.goToLibrary();
    });

    it('[TC99014_4] Save as itself', async () => {
        await loginUserAndGoToLibraryHome(botUser);
        //clear all chats
        await deleteBotV2ChatByAPI({
            botId: sourceBotForSaveAs.id,
            projectId: sourceBotForSaveAs.project.id,
            credentials: botUser.credentials,
        });

        // Run bot, ask a question
        await libraryPage.openBot(sourceBotForSaveAs.name);
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();
        await aibotChatPanel.askQuestionNoWaitViz(test_object_info.question1);
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();
        await since('The 1st question sent should be #{expected}, while we get #{actual}')
            .expect(await aibotChatPanel.getQueryTextByIndex(0))
            .toBe(test_object_info.question1);
        await since('Send question, the answer count should be #{expected}, while we get #{actual}')
            .expect(await aibotChatPanel.getValidAnswerCount())
            .toBe(1);

        // Save as itself
        await botConsumptionFrame.clickEditButton();
        await botAuthoring.openButtonMenu();
        await botAuthoring.clickSaveAsButton();
        await libraryAuthoringPage.saveInMyReport(sourceBotForSaveAs.name, ['Bot2.0', 'Automation', 'On Demand']);
        await dossierPage.goToLibrary();

        // Check ACL
        await libraryPage.openDossierContextMenu(sourceBotForSaveAs.name);
        await libraryPage.clickDossierContextMenuItem('Manage Access');
        await manageAccess.waitForManageAccessLoading();
        since(`${botUser.credentials.username} ACL should be #{expected}, while we get #{actual}`)
            .expect(await manageAccess.getUserCurrentACL(botUser.credentials.username))
            .toBe('Can Modify');
        since(`Administrator ACL should be #{expected}, while we get #{actual}`)
            .expect(await manageAccess.getUserCurrentACL('Administrator'))
            .toBe('None');
        since(`Everyone ACL should be #{expected}, while we get #{actual}`)
            .expect(await manageAccess.getUserCurrentACL('Everyone'))
            .toBe('None');
        await manageAccess.cancelManageAccessChange();

        // Run bot, check if there is any error
        await libraryPage.openBot(sourceBotForSaveAs.name);
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();
        await since('Run bot should be successful without error')
            .expect(await dossierPage.isErrorPresent())
            .toBe(false);
        await aibotChatPanel.askQuestionNoWaitViz(test_object_info.question1);
        await since('The 1st question sent should be #{expected}, while we get #{actual}')
            .expect(await aibotChatPanel.getQueryTextByIndex(0))
            .toBe(test_object_info.question1);
        await since('Send question, the answer count should be #{expected}, while we get #{actual}')
            .expect(await aibotChatPanel.getValidAnswerCount())
            .toBe(1);

        // Ask another question
        await aibotChatPanel.askQuestionNoWaitViz(test_object_info.question2);
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();
        await since('The 2nd question sent should be #{expected}, while we get #{actual}')
            .expect(await aibotChatPanel.getQueryTextByIndex(1))
            .toBe(test_object_info.question2);
        await since('Send question, the answer count should be #{expected}, while we get #{actual}')
            .expect(await aibotChatPanel.getValidAnswerCount())
            .toBe(2);

        await dossierPage.goToLibrary();
    });

    it('[TC99014_5] Save as existing bot', async () => {
        await loginUserAndGoToLibraryHome(botUser);
        //clear all chats
        await deleteBotV2ChatByAPI({
            botId: existingBotForSaveAs.id,
            projectId: existingBotForSaveAs.project.id,
            credentials: botUser.credentials,
        });

        // Run existing bot, ask a question
        await libraryPage.openBot(existingBotForSaveAs.name);
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();
        await aibotChatPanel.askQuestionNoWaitViz(test_object_info.question1);
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();
        await since('The original question sent should be #{expected}, while we get #{actual}')
            .expect(await aibotChatPanel.getQueryTextByIndex(0))
            .toBe(test_object_info.question1);
        await since('Send question, the answer count should be #{expected}, while we get #{actual}')
            .expect(await aibotChatPanel.getValidAnswerCount())
            .toBe(1);
        await dossierPage.goToLibrary();

        // Run bot, save as existing bot
        await libraryPage.openBot(sourceBotForSaveAs.name);
        await botConsumptionFrame.clickEditButton();
        await botAuthoring.openButtonMenu();
        await botAuthoring.clickSaveAsButton();
        await libraryAuthoringPage.saveInMyReport(existingBotForSaveAs.name, ['Bot2.0', 'Automation', 'On Demand']);
        await dossierPage.goToLibrary();

        // Check ACL
        await libraryPage.openDossierContextMenu(existingBotForSaveAs.name);
        await libraryPage.clickDossierContextMenuItem('Manage Access');
        await manageAccess.waitForManageAccessLoading();
        since(`${botUser.credentials.username} ACL should be #{expected}, while we get #{actual}`)
            .expect(await manageAccess.getUserCurrentACL(botUser.credentials.username))
            .toBe('Full Control');
        since(`Administrator ACL should be #{expected}, while we get #{actual}`)
            .expect(await manageAccess.getUserCurrentACL('Administrator'))
            .toBe('None');
        since(`Everyone ACL should be #{expected}, while we get #{actual}`)
            .expect(await manageAccess.getUserCurrentACL('Everyone'))
            .toBe('None');
        await manageAccess.cancelManageAccessChange();

        // Run bot, check if there is any error
        await libraryPage.openBot(existingBotForSaveAs.name);
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();
        await since('Run bot should be successful without error')
            .expect(await dossierPage.isErrorPresent())
            .toBe(false);
        await since('After save as, the welcome page message displayed should be #{expected}, while we get #{actual}')
            .expect(await aibotChatPanel.isWelcomePageMessageDisplayed())
            .toBe(true);

        // Ask another question
        await aibotChatPanel.askQuestionNoWaitViz(test_object_info.question2);
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();
        await since('The new question sent should be #{expected}, while we get #{actual}')
            .expect(await aibotChatPanel.getQueryTextByIndex(0))
            .toBe(test_object_info.question2);
        await since('Send question, the answer count should be #{expected}, while we get #{actual}')
            .expect(await aibotChatPanel.getValidAnswerCount())
            .toBe(1);

        await dossierPage.goToLibrary();
    });

    it('[TC99014_6] Save bot with no modify ACL', async () => {
        await loginUserAndGoToLibraryHome(botUser);

        // Run bot with no modify ACL
        await libraryPage.openBot(sourceBotWithNoModifyACL.name);
        await botConsumptionFrame.clickEditButton();

        // Modify, click save, it shows save as dialog
        var newBotName = 'Bot_' + Date.now();
        await botAuthoring.generalSettings.updateBotName(newBotName);
        await botAuthoring.clickSaveButton();
        await libraryAuthoringPage.saveInMyReport(newBotForSaveAs.name, [
            'Bot2.0',
            'Automation',
            'On Demand',
            'Target folder',
        ]);
        await dossierPage.goToLibrary();

        // Check ACL
        await libraryPage.openDossierContextMenu(newBotForSaveAs.name);
        await libraryPage.clickDossierContextMenuItem('Manage Access');
        await manageAccess.waitForManageAccessLoading();
        since(`${botUser.credentials.username} ACL should be #{expected}, while we get #{actual}`)
            .expect(await manageAccess.getUserCurrentACL(botUser.credentials.username))
            .toBe('Full Control');
        since(`Administrator ACL should be #{expected}, while we get #{actual}`)
            .expect(await manageAccess.getUserCurrentACL('Administrator'))
            .toBe('Full Control');
        since(`Everyone ACL should be #{expected}, while we get #{actual}`)
            .expect(await manageAccess.getUserCurrentACL('Everyone'))
            .toBe('Full Control');
        await manageAccess.cancelManageAccessChange();

        // Run bot, check if there is any error
        await libraryPage.openBot(newBotForSaveAs.name);
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();
        await since('Run bot should be successful without error')
            .expect(await dossierPage.isErrorPresent())
            .toBe(false);

        // Ask question
        await aibotChatPanel.askQuestionNoWaitViz(test_object_info.question1);
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();
        await since('The question sent should be #{expected}, while we get #{actual}')
            .expect(await aibotChatPanel.getQueryTextByIndex(0))
            .toBe(test_object_info.question1);
        await since('Send question, the answer count should be #{expected}, while we get #{actual}')
            .expect(await aibotChatPanel.getValidAnswerCount())
            .toBe(1);

        await dossierPage.goToLibrary();
    });

    it('[TC99014_7] Run bot with dataset disabled AI', async () => {
        await loginUserAndGoToLibraryHome(botUser);

        // Run bot, check there is a banner showing AI is disabled
        await libraryPage.openBot(sourceBotWithDatasetDisableAI.name);
        await since('AI disabled banner present state should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.isAIDisabledBannerDisplayed())
            .toBe(true);

        // Go to edit mode, click update dataset
        await botConsumptionFrame.clickEditButton();
        await aibotDatasetPanel.clickUpdateDatasetButton();

        // Check the dataset title bar is disabled
        since('Dataset title bar should be disabled')
            .expect(await adc.isDatasetTitleBarDisabled(datasetDisableAI.name))
            .toBe(true);
        await adc.cancel();
        await since('Library title should be #{expected} but is #{actual}')
            .expect(await botConsumptionFrame.getBotName())
            .toEqual(sourceBotWithDatasetDisableAI.name);
        await dossierPage.goToLibrary();
    });

    it('[TC99014_8] Run bot with dataset not published', async () => {
        await loginUserAndGoToLibraryHome(botUser);

        // Run bot, check there is a banner showing AI is disabled
        await libraryPage.openBot(sourceBotWithDatasetNotPublished.name);
        await since('AI disabled banner present state should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.isAIDisabledBannerDisplayed())
            .toBe(true);

        // Go to edit mode, click update dataset
        await botConsumptionFrame.clickEditButton();
        await aibotDatasetPanel.clickUpdateDatasetButton({ isWaitLoading: false });

        // Check error dialog showing dataset is not published
        await dossierPage.waitForElementVisible(dossierPage.getErrorDialogue());
        await since('Click update dataset, the error message should be "#{expected}", instead we have "#{actual}"')
            .expect(await dossierPage.errorMsg())
            .toEqual('One or more datasets are not loaded for this item.');
        await libraryPage.dismissError();
        await dossierPage.goToLibrary();
    });

    it ('[TC99014_9] duplicate ADC and apply to bot', async () => {
        await loginUserAndGoToLibraryHome(botUserSF);
        let botId = null;
        // create bot based on existing ADC
        try {
            botId = await createBotByAPIV2({
                credentials: botUserSF.credentials,
                aiDatasetCollections: [baseADCForDuplicate.id],
                projectId: project.id,
                folderId: targetFolder.id,
                botName: newBotForDuplicateADC.name,
                publishedToUsers: [botUserSF.credentials.id],
            });
        } catch (e) {
            console.error(e);
        }
        // Open bot and go to dataset panel
        await libraryPage.editBotByUrl({ project: project.id, botId });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await aibotDatasetPanel.clickUpdateDatasetButton();
        await since('Update dataset from Bot, ADC page present should be #{expected}, instead we have #{actual}')
            .expect(await adc.isADCToolbarPresent())
            .toBe(true);

        // replace dataset
        const dataset1 = 'AUTO_ViewFilter';
        const dataset2 = 'AUTO_MTDI';
        await datasetPanel.chooseDatasetContextMenuOption(dataset1, "Replace Dataset With -> Existing Dataset...");
        await adc.selectDatasetAddReplace(dataset2);
        await dossierMojo.clickBtnOnMojoEditor("OK");
        await since(`The dataset panel should not have the dataset "${dataset1}", expected: #{expected}, but found: #{actual}`)
            .expect(await datasetPanel.isDatasetDisplayed(dataset1))
            .toBe(false);
        await since(`The dataset panel should display dataset "${dataset2}", is #{expected}, but found: #{actual}`)
            .expect(await datasetPanel.isDatasetDisplayed(dataset2))
            .toBe(true);

        // duplicate ADC and apply to bot
        await adc.duplicateAndApply(duplicatedADC.name, ['Bot2.0', 'Automation', 'On Demand', 'Target folder']);
        await adc.clickSaveAsDropdownFromBot();
        await since('The duplicate and apply button displayed should be #{expected}, instead we have #{actual}')
            .expect(await adc.isDuplicateAndApplyBtnDisplayed())
            .toBe(true);
        await adc.cancel();

        // check dataset changed
        await botAuthoring.selectBotConfigTabByName('Data');
        await since(`The dataset panel should not have the dataset "${dataset2}", expected: #{expected}, but found: #{actual}`)
            .expect(await aibotDatasetPanel.isDatasetDisplayed(dataset2))
            .toBe(true);

        await dossierPage.goToLibrary();

        // open the duplicated ADC
        await libraryPage.openSidebarOnly();
        await sidebar.openDataSection();
        await libraryPage.openDossier(duplicatedADC.name);
        await adc.clickSaveAsDropdown();
        await since('The duplicate and apply button displayed should be #{expected}, instead we have #{actual}')
            .expect(await adc.isDuplicateAndApplyBtnDisplayed())
            .toBe(false);

        await adc.cancel();
    });
});
