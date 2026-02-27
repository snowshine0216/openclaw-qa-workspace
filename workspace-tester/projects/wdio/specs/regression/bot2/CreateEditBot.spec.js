/* eslint-disable @typescript-eslint/no-floating-promises */
import setWindowSize from '../../../config/setWindowSize.js';
import deleteObjectByNames from '../../../api/folderManagement/deleteObjectByNames.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';


describe('CreateEditBot', () => {
    const project = {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    };

    const botUser = {
        credentials: {
            username: 'bot2_auto',
            password: 'newman1#',
        },
    };

    const botNoRunPrivUser = {
        credentials: {
            username: 'bot2_norun_auto',
            password: 'newman1#',
        },
    };

    const botNoEditPrivUser = {
        credentials: {
            username: 'bot2_noedit_auto',
            password: 'newman1#',
        },
    };

    const olapDataset = {
        id: '1E4CBF2CFC4CADF8911EF9BB25F1D298',
        name: 'AUTO_OLAP',
        project: project,
    };

    const mtdiDataset = {
        id: '76BDF5558E40EDE7B074978962EE082B',
        name: 'AUTO_MTDI',
        project: project,
    };

    const subsetReportDataset = {
        id: 'B9EB6C575A470413CA5DFFABE445B41C',
        name: 'AUTO_SubsetReport',
        project: project,
    };

    const olapADC = {
        id: 'A002287E5E4CB61C45B2E98F33A5BDCF',
        name: 'OLAP_ADC_for_create_bot',
        project: project,
    };

    const mtdiADC = {
        id: '9136514ABA450505347A319A33DA5DC2',
        name: 'MTDI_ADC_for_create_bot',
        project: project,
    };

    const subsetReportADC = {
        id: '38191F01FB4D2723CE4FA3BB656D693E',
        name: 'SubsetReport_ADC_for_create_bot',
        project: project,
    };

    const modifyADC = {
        id: '624B80B1AD4D9BA6C99F9A89C0AEB7D0',
        name: 'Modify_ADC_for_create_bot',
        project: project,
    };

    const modifyBot = {
        id: 'E193AF15EDF64C97868192A3F76A46C7',
        name: 'Modify_Bot_for_create_bot',
        project: project,
    };

    const folderForCreateBot = {
        id: '056A28140E45ABBF81ADF68D3AF9806A',
        name: 'Folder for create bot',
        project: project,
    };

    const newOlapADC = {
        name: 'AUTO OLAP ADC',
    };

    const newOlapBot = {
        name: 'AUTO OLAP Bot',
    };

    const newMtdiBot = {
        name: 'AUTO MTDI Bot',
    };

    const newSubsetReportBot = {
        name: 'AUTO Subset Report Bot',
    };

    const newBotByTemplate = {
        name: 'BotCreatedByTemplate',
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
        datasetsPanel,
        libraryFilter,
        dossierCreator,
        mappingObjectInAgentTemplate,
        aiBotPromptPanel,
        botCustomInstructions,
        aibotDatasetPanel,
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
            parentFolderId: folderForCreateBot.id,
            subtype: 14087, // subtype for agent
            names: [newOlapBot.name, newMtdiBot.name, newSubsetReportBot.name, newBotByTemplate.name],
        });
        await deleteObjectByNames({
            credentials: botUser.credentials,
            projectId: project.id,
            parentFolderId: folderForCreateBot.id,
            names: [newOlapADC.name, newBotByTemplate.name],
        });
    }

    async function loginUserAndGoToLibraryHome(user) {
        await libraryPage.switchUser(user.credentials);
        await libraryPage.openSidebarOnly();
        await sidebar.clickAllSection();
    }

    it('[TC99008_1] Validate create and edit ADC', async () => {
        await loginUserAndGoToLibraryHome(botUser);
        newOlapADC.name = 'New OLAP ADC_' + Date.now();

        // Create ADC
        await libraryAuthoringPage.clickNewDossierIcon();
        await libraryAuthoringPage.clickNewADCButton();
        await libraryAuthoringPage.selectProjectAndDataset(project.name, olapDataset.name);
        await adc.saveToPath(newOlapADC.name, ['Bot2.0', 'Folder for create bot']);
        await adc.cancel();
        await since('Library title should be #{expected} but is #{actual}')
            .expect(await libraryPage.title())
            .toEqual('Library');

        // Go to Data blade, edit ADC, save
        await libraryPage.openSidebarOnly();
        await sidebar.openDataSection();
        await libraryPage.openDossier(newOlapADC.name);
        await datasetsPanel.renameObject('Category', 'CategoryNew');
        await adc.saveChanges({ saveConfirm: false, jumpToBotAuthoring: false });
        await adc.cancel();

        // Edit ADC again, check attribute name is changed
        await libraryPage.openDossier(newOlapADC.name);
        await since('Renamed, new attribute name present should be #{expected}, instead we have #{actual}')
            .expect(await datasetsPanel.isAttributeMetricDisplayed('CategoryNew'))
            .toBe(true);
        await adc.cancel();
    });

    it('[TC99008_2] Validate create bot based on ADC', async () => {
        await loginUserAndGoToLibraryHome(botUser);

        // Create bot based on ADC
        await libraryAuthoringPage.clickNewDossierIcon();
        await libraryAuthoringPage.clickNewBot2Button();
        await libraryAuthoringPage.selectProjectAndADCAndDataset(project.name, mtdiADC.name);

        // Save bot and check name
        await botAuthoring.clickSaveButton();
        await libraryAuthoringPage.saveInMyReport(newMtdiBot.name, ['Bot2.0', 'Folder for create bot']);
        await since('Library title should be #{expected} but is #{actual}')
            .expect(await botConsumptionFrame.getBotName())
            .toEqual(newMtdiBot.name);

        // Go to library and check if it is in library
        await aibotChatPanel.goToLibrary();
        await since('Back to library page, the new bot in library should be "#{expected}", instead we have "#{actual}"')
            .expect(await libraryPage.isDossierInLibrary(newMtdiBot))
            .toBe(true);
    });

    it('[TC99008_3] Validate create bot based on ADC and preview first', async () => {
        await loginUserAndGoToLibraryHome(botUser);

        // Create bot based on ADC and click preview
        await libraryAuthoringPage.clickNewDossierIcon();
        await libraryAuthoringPage.clickNewBot2Button();
        await libraryAuthoringPage.selectProjectAndADCAndDataset(project.name, subsetReportADC.name, true);

        // Save ADC first
        await adc.saveChanges({ saveConfirm: false, jumpToBotAuthoring: true });
        await dossierPage.waitForDossierLoading();
        await since('Library title should be #{expected} but is #{actual}')
            .expect(await botConsumptionFrame.getBotName())
            .toEqual('New Agent');

        // Save bot
        await botAuthoring.clickSaveButton();
        await libraryAuthoringPage.saveInMyReport(newSubsetReportBot.name, ['Bot2.0', 'Folder for create bot']);
        await since('Library title should be #{expected} but is #{actual}')
            .expect(await botConsumptionFrame.getBotName())
            .toEqual(newSubsetReportBot.name);

        // Back to library home
        await aibotChatPanel.goToLibrary();
        await since('Back to library page, the new bot in library should be "#{expected}", instead we have "#{actual}"')
            .expect(await libraryPage.isDossierInLibrary(newSubsetReportBot))
            .toBe(true);
    });

    it('[TC99008_4] Validate create bot based on dataset and create ADC first', async () => {
        await loginUserAndGoToLibraryHome(botUser);

        // Create bot based on dataset (create ADC first)
        await libraryAuthoringPage.clickNewDossierIcon();
        await libraryAuthoringPage.clickNewBot2Button();
        await libraryAuthoringPage.selectProjectAndDataset(project.name, mtdiDataset.name);

        // Save ADC first
        await adc.saveToPath(newOlapADC.name, ['Bot2.0', 'Folder for create bot']);
        await dossierPage.waitForDossierLoading();
        await since('Library title should be #{expected} but is #{actual}')
            .expect(await botConsumptionFrame.getBotName())
            .toEqual('New Agent');

        // Save bot
        await botAuthoring.saveBotWithName(newOlapBot.name);
        await since('Library title should be #{expected} but is #{actual}')
            .expect(await botConsumptionFrame.getBotName())
            .toEqual(newOlapBot.name);

        // Back to library home
        await aibotChatPanel.goToLibrary();
        await since('Back to library page, the new bot in library should be "#{expected}", instead we have "#{actual}"')
            .expect(await libraryPage.isDossierInLibrary(newOlapBot))
            .toBe(true);
    });

    it('[TC99008_5] Validate cancel create bot', async () => {
        await loginUserAndGoToLibraryHome(botUser);

        // Create agent
        await libraryAuthoringPage.clickNewDossierIcon();
        await libraryAuthoringPage.clickNewBot2Button();
        await libraryAuthoringPage.selectProjectAndADCAndDataset(project.name, subsetReportADC.name);
        await since('Library title should be #{expected} but is #{actual}')
            .expect(await botConsumptionFrame.getBotName())
            .toEqual('New Agent');

        // Cancel and go to library home
        const mock = await browser.mock('**/api/objects/**', { method: 'delete' });
        await aibotChatPanel.clickCloseButton();
        // await aibotChatPanel.clickButton(`Don't Save`);
        await mock.waitForResponse();
        await since('Library title should be #{expected} but is #{actual}')
            .expect(await libraryPage.title())
            .toEqual('Library');
        const calls = mock.calls;
        await since('The status code of delete object should be #{expected} but is #{actual}')
            .expect(calls[0].statusCode)
            .toBe(204);
    });

    it('[TC99008_6] Validate edit bot and save', async () => {
        await loginUserAndGoToLibraryHome(botUser);

        // Run bot
        await libraryPage.openBot(modifyBot.name);
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();

        // Edit bot
        var newBotName = 'Bot_' + Date.now();
        await botConsumptionFrame.clickEditButton();
        await botAuthoring.generalSettings.updateBotName(newBotName);
        await botAuthoring.clickSaveButton();

        // Back to library and rerun bot
        await aibotChatPanel.goToLibrary();
        await libraryPage.openBot(modifyBot.name);
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();
        await since('Bot name should be #{expected} but is #{actual}')
            .expect(await aibotChatPanel.getTitleBarBotNameTexts())
            .toEqual(newBotName);
    });

    it('[TC99008_7] Privilege - Validate no edit and run bot privilege', async () => {
        // No run privilege
        await loginUserAndGoToLibraryHome(botNoRunPrivUser);
        await since(
            'No run privilege, the Library empty content present should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.isLibraryEmpty())
            .toBe(true);

        await libraryAuthoringPage.clickNewDossierIcon();
        await since('No run privilege, the create ADC option present should be #{expected}, instead we have #{actual}')
            .expect(await libraryAuthoringPage.isCreateADCOptionPresent())
            .toBe(false);
        await since('No run privilege, the create bot option present should be #{expected}, instead we have #{actual}')
            .expect(await libraryAuthoringPage.isCreateBotOptionPresent())
            .toBe(false);
        await libraryAuthoringPage.clickNewDossierIcon();

        await libraryPage.openSidebarOnly();
        await sidebar.openDataSection();
        await libraryPage.clickFilterIcon();
        await libraryFilter.openFilterDetailPanel('Type');
        await since('No run privilege, the type count on data page should be #{expected}, instead we have #{actual}')
            .expect(await libraryFilter.getDetailsPanelItemsCount())
            .toBe(2);
        await libraryFilter.closeFilterPanel();

        // No edit privilege
        await loginUserAndGoToLibraryHome(botNoEditPrivUser);
        await since('No edit privilege, the bot in library should be "#{expected}", instead we have "#{actual}"')
            .expect(await libraryPage.isDossierInLibrary(modifyBot))
            .toBe(true);

        await libraryAuthoringPage.clickNewDossierIcon();
        await since('No edit privilege, the create ADC option present should be #{expected}, instead we have #{actual}')
            .expect(await libraryAuthoringPage.isCreateADCOptionPresent())
            .toBe(false);
        await since('No edit privilege, the create bot option present should be #{expected}, instead we have #{actual}')
            .expect(await libraryAuthoringPage.isCreateBotOptionPresent())
            .toBe(false);
        await libraryAuthoringPage.clickNewDossierIcon();

        await libraryPage.openSidebarOnly();
        await sidebar.openDataSection();
        await since('No edit privilege, the ADC present should be "#{expected}", instead we have "#{actual}"')
            .expect(await libraryPage.isDossierInLibrary(modifyADC))
            .toBe(true);
    });

    it('[TC99008_8] Create Agent with Template - basic workflow', async () => {
        // Step 1: Login with botUser (already done via loginUserAndGoToLibraryHome)
        await loginUserAndGoToLibraryHome(botUser);
        
        // Step 2: Click newBotIcon (using new dossier icon to open creator)
        await libraryAuthoringPage.clickNewDossierIcon();
        await libraryAuthoringPage.clickNewBot2Button();
        
        // Wait for dossier creator dialog to appear and switch to template mode
        await libraryAuthoringPage.waitForProjectSelectionWindowAppear();
        await dossierCreator.switchProjectByName(project.name);
        
        // Step 3: In bot creation page, check that there are 2 tabs and click "Select Template"
        await dossierCreator.switchTabViewer('Select Template');
        
        // Step 4: Make sure the template "Retail Agent Template" exists
        const templateNames = await dossierCreator.getTemplateNamesInGridView();
        await since('Retail Agent Template should exist in the template list, templates found: #{actual}')
            .expect(templateNames.includes('Retail Agent Template'))
            .toBe(true);
        await since('In Grid view, Retail Agent Template have cover image should be #{expected}, instead we have #{actual}')
            .expect(await dossierCreator.isTemplateHasCoverImageInGridView('Retail Agent Template'))
            .toBe(true);

        // In list view, check cover image
        await dossierCreator.switchToListView();
        await since('In List view, Retail Agent Template have cover image should be #{expected}, instead we have #{actual}')
            .expect(await dossierCreator.isTemplateHasCoverImageInListView('Retail Agent Template'))
            .toBe(true);
        await dossierCreator.switchToGridView();
        
        // Step 5: Select template "Retail Agent Template" and create
        await dossierCreator.selectTemplate('Retail Agent Template');
        await since('Retail Agent Template should be selected')
            .expect(await dossierCreator.getSelectedTemplateNameInGridView())
            .toBe('Retail Agent Template');

        await dossierCreator.clickCreateButtonInNewAgentPanel();
        
        // Step 6: Select project "MicroStrategy Tutorial" and dataset "AUTO_OLAP"
        await libraryAuthoringPage.selectDatasetAfterSelectBotTemplate(olapDataset.name);

        // Step 7: Manipulation in Mapping page
        await mappingObjectInAgentTemplate.waitForElementVisible(await mappingObjectInAgentTemplate.getMyObjectsPanel());
        await takeScreenshotByElement(await mappingObjectInAgentTemplate.getMappingObjectPage(), 'TC99008_8', 'MappingObjectInAgentTemplate');
        // Cost is automatically mapped
        await since('Cost attribute should be mapped automatically')
            .expect(await mappingObjectInAgentTemplate.checkObjectMappedInMyObjectPanel('Cost'))
            .toBe(true);
        
        // Drag and drop "Category_DESC" to "Category_ID"
        const myObject = "Category__DESC";
        const templateObject = "Category__ID";
        await mappingObjectInAgentTemplate.clearSearchInMyObjectsPanel();
        await mappingObjectInAgentTemplate.dragDropObjectToMapWith(myObject, templateObject);
        await since('Category_DESC should be mapped to Category_ID, and show in Mapped Objects panel')
            .expect(await mappingObjectInAgentTemplate.checkMyObjectExistInTemplateObject(templateObject, myObject))
            .toBe(true);
        
        // Step 8: Launch in Agent and save
        await mappingObjectInAgentTemplate.clickLaunchInAgentButton();
        await libraryAuthoringPage.saveInMyReport(newBotByTemplate.name, ['Bot2.0', 'Folder for create bot']);

        // Step 9: Validate bot is created successfully with template
        await since('Agent should be created successfully with template')
            .expect(await botConsumptionFrame.getBotName())
            .toEqual(newBotByTemplate.name);

        // Step 10: Check definitions in bot
        const prompts = {
            prompt1: 'Revenue by Quarters',
            prompt2: 'Sales Trend',
            prompt3: 'Top 3 Stores',
        };
        await aiBotPromptPanel.validatePromptCardDisplayed(prompts.prompt1);
        await aiBotPromptPanel.validatePromptCardDisplayed(prompts.prompt2);
        await aiBotPromptPanel.validatePromptCardDisplayed(prompts.prompt3);
        // check custom instruction
        await botConsumptionFrame.clickEditButton();
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        await since('Custom instruction switch is expected to be ON')
            .expect(await botCustomInstructions.isCustomInstructionsEnabled())
            .toBe(true);
        await since('Background words count is expected to be #{expected}, instead we have #{actual}')
            .expect(await botCustomInstructions.getCount(0))
            .toBe('294/5000');
        await since('Format words count is expected to be #{expected}, instead we have #{actual}')
            .expect(await botCustomInstructions.getCount(1))
            .toBe('240/1500');
        // check dataset panel    
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('Dataset Object Category (DESC) is mapped, so selection should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.isDatasetObjectSelected('Category'))
            .toBe(true);
        await since('Dataset Object Cost is mapped, so selection should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.isDatasetObjectSelected('Cost'))
            .toBe(true);
        // verify dataset and metric descriptions
        const categoryDesc = await aibotDatasetPanel.getObjectDescription(olapDataset.name, 'Category').getText();
        await since('Category description should use original description with #{expected} words, instead we have #{actual}')
            .expect(categoryDesc)
            .toContain('This column is used to classify products into broad groups such as electronics, clothing, jewelry, and beauty.');
        const costDesc = await aibotDatasetPanel.getObjectDescription(olapDataset.name, 'Cost').getText();
        await since('Dataset Object Cost description should use original description with #{expected} words, instead we have #{actual}')
            .expect(costDesc)
            .toContain('Represents the monetary amount incurred for each retail transaction');

        await aibotChatPanel.goToLibrary();
    });

    it('[TC99008_9] Create Agent with Template - check mapping object and alias', async () => {
        // Step 1: Login with botUser (already done via loginUserAndGoToLibraryHome)
        await loginUserAndGoToLibraryHome(botUser);
        
        // Step 2: Click newBotIcon (using new dossier icon to open creator)
        await libraryAuthoringPage.clickNewDossierIcon();
        await libraryAuthoringPage.clickNewBot2Button();
        
        // Step3: Select other tab and it won't impact the page after select template
        await libraryAuthoringPage.waitForProjectSelectionWindowAppear();
        await dossierCreator.switchProjectByName(project.name);
        await libraryAuthoringPage.clickDatasetTypeInDatasetPanel('Agent');
        await dossierCreator.switchTabViewer('Select Template');
        
        // Step 4: Select template "Retail Agent Template" and create
        await dossierCreator.selectTemplate('Retail Agent Template');
        await dossierCreator.clickCreateButtonInNewAgentPanel();
        
        // Step 5: Select project "MicroStrategy Tutorial" and dataset "AUTO_OLAP"
        await libraryAuthoringPage.selectDatasetAfterSelectBotTemplate(olapDataset.name);

        // Step 6: Manipulation in Mapping page
        await mappingObjectInAgentTemplate.waitForElementVisible(await mappingObjectInAgentTemplate.getMyObjectsPanel());

        // search "Quarter_DESC" and map to "Quarter_ID"
        const myObject1 = "Quarter__DESC";
        const templateObject1 = "Quarter__ID";
        await mappingObjectInAgentTemplate.searchInMyObjectsPanel(myObject1);
        await mappingObjectInAgentTemplate.dragDropObjectToMapWith(myObject1, templateObject1);
        await since('Quarter_DESC should be mapped to Quarter_ID, and show in Mapped Objects panel')
            .expect(await mappingObjectInAgentTemplate.checkMyObjectExistInTemplateObject(templateObject1, myObject1))
            .toBe(true);
        // Delete mapping of Quarter_DESC
        await mappingObjectInAgentTemplate.removeObjectFromMapWith(myObject1);
        await since('After delete mapping, Quarter_DESC should not show in Mapped Objects panel')
            .expect(await mappingObjectInAgentTemplate.checkMyObjectExistInTemplateObject(templateObject1, myObject1))
            .toBe(false);
        
        // Drag and drop "Category_DESC" to "Category_ID"
        const myObject2 = "Category__DESC";
        const templateObject2 = "Category__ID";
        await mappingObjectInAgentTemplate.clearSearchInMyObjectsPanel();
        await mappingObjectInAgentTemplate.dragDropObjectToMapWith(myObject2, templateObject2);
        await since('Category_DESC should be mapped to Category_ID, and show in Mapped Objects panel')
            .expect(await mappingObjectInAgentTemplate.checkMyObjectExistInTemplateObject(templateObject2, myObject2))
            .toBe(true);
        // Drag and drop "Profit" to "Gross Profit"
        const myObject3 = "Profit";
        const templateObject3 = "Gross Profit";
        await mappingObjectInAgentTemplate.searchInMyObjectsPanel(myObject3);
        await mappingObjectInAgentTemplate.dragDropObjectToMapWith(myObject3, templateObject3);
        await since('Profit should be mapped to Gross Profit, and show in Mapped Objects panel')
            .expect(await mappingObjectInAgentTemplate.checkMyObjectExistInTemplateObject(templateObject3, myObject3))
            .toBe(true);
        // check alias
        await since('Category_ID should have alias "Product Category", instead we have #{actual}')
            .expect(await mappingObjectInAgentTemplate.getAliasTagsForTemplateObject(templateObject2))
            .toContain('Product Category');
        await mappingObjectInAgentTemplate.addColumnAlias(templateObject2, 'CAT');
        await since('Category_ID should have alias "CAT", instead we have #{actual}')
            .expect(await mappingObjectInAgentTemplate.getAliasTagsForTemplateObject(templateObject2))
            .toContain('CAT');
        await mappingObjectInAgentTemplate.removeColumnAlias('Cost', 'Sales Cost');
        await since('After remove alias, Cost should not have alias "Sales Cost", instead we have #{actual}')
            .expect(await mappingObjectInAgentTemplate.getAliasTagsForTemplateObject('Cost'))
            .not.toContain('Sales Cost');
        
        // Step 7: Launch in Agent and save
        await mappingObjectInAgentTemplate.clickLaunchInAgentButton();
        await libraryAuthoringPage.saveInMyReport(newBotByTemplate.name, ['Bot2.0', 'Folder for create bot']);

        // Step 8: Validate bot is created successfully with template
        await since('Agent should be created successfully with template')
            .expect(await botConsumptionFrame.getBotName())
            .toEqual(newBotByTemplate.name);

        // Step 9: Check dataset definitions in bot

        await botConsumptionFrame.clickEditButton();
        // check dataset panel    
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('Dataset Object Category (ID) is not mapped, so selection should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.isDatasetObjectSelected('Category (ID)'))
            .toBe(false);
        await since('Dataset Object Category (DESC) is mapped, so selection should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.isDatasetObjectSelected('Category'))
            .toBe(true);
        await since('Dataset Object Profit is mapped, so selection should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.isDatasetObjectSelected('Profit'))
            .toBe(true);
 
        // check alias
        await since('Category should have alias "Product Category", instead we have #{actual}')
            .expect(await aibotDatasetPanel.isColumnAliasDisplayed(olapDataset.name, 'Category', 'Product Category'))
            .toBe(true);
        await since('Category should have alias "CAT", instead we have #{actual}')
            .expect(await aibotDatasetPanel.isColumnAliasDisplayed(olapDataset.name, 'Category', 'CAT'))
            .toBe(true);
        await since('Cost should Not have alias "Sales Cost", instead we have #{actual}')
            .expect(await aibotDatasetPanel.isColumnAliasDisplayed(olapDataset.name, 'Cost', 'Sales Cost'))
            .toBe(false);

        await aibotChatPanel.goToLibrary();
    });
});