import { browserWindow } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import createBotByAPIV2 from '../../../api/bot2/createBotAPIV2.js';
import * as consts from '../../../constants/bot2.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { deleteBotList } from '../../../api/bot/index.js';
import copyADC from '../../../api/bot/copyADC.js';
import { infoLog } from '../../../config/consoleFormat.js';
import urlParser from '../../../api/urlParser.js';
import { waitForResponse } from '../../../api/browserDevTools/network.js';
import deleteObjectsByFolder from '../../../api/folderManagement/deleteObjectsByFolder.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

describe('Bot Configuration - Dataset Features', () => {
    let {
        loginPage,
        libraryPage,
        aibotChatPanel,
        libraryAuthoringPage,
        botAuthoring,
        aibotDatasetPanel,
        adc,
        datasetsPanel,
        derivedAttributeEditor,
    } = browsers.pageObj1;

    let botId;
    let botName = 'Auto_bot_multi_datasets';
    const projectId = consts.botV2DatasetUser.projectId;
    const aiDatasetCollectionId = 'ECEF9448C14B1954A7A03BB7F3F5B0C9'; // AUTO_ADC_multi_datasets
    let bot4DataSyncTest;
    let adc4DataSyncTest;

    let copiedADCId;
    let botIdForCopiedADC;

    // MicroStrategy Tutorial > Shared Reports > Bot2.0 >Automation > Dataset
    const folderId = '1769CCA1EC4505C3AC4AE8957D167019';
    const baseUrl = urlParser(browser.options.baseUrl);

    beforeAll(async () => {
        await deleteObjectsByFolder({
            credentials: consts.botV2DatasetUser,
            parentFolderId: folderId,
            projectId,
            filterSubtype: 14087,
        });
        await setWindowSize(browserWindow);
        await loginPage.login(consts.botV2DatasetUser);
        await libraryPage.waitForLibraryLoading();

        // Create bot
        botId = await createBotByAPIV2({
            credentials: consts.botV2DatasetUser,
            aiDatasetCollections: [aiDatasetCollectionId],
            projectId,
            folderId,
            botName,
            publishedToUsers: [consts.botV2DatasetUser.id],
        });
    });

    beforeEach(async () => {
        // Open bot and go to dataset panel
        await libraryPage.editBotByUrl({ projectId, botId });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
    });

    afterAll(async () => {
        await deleteBotList({
            credentials: consts.botV2DatasetUser,
            botList: [botId, bot4DataSyncTest, adc4DataSyncTest, botIdForCopiedADC, copiedADCId],
            projectId,
        });

        await logoutFromCurrentBrowser();
    });

    it('[TC99006_1] Should be able toggle description select db', async () => {
        const showDescription = await aibotDatasetPanel.getShowDescriptionState();
        await since('Show description should be #{expected}, instead we have #{actual}')
            .expect(showDescription)
            .toBe('true');

        // check if description is visible
        let descriptionVisible = await aibotDatasetPanel.hasDescriptionVisible();
        await since('Description should be visible').expect(descriptionVisible).toBe(true);

        await aibotDatasetPanel.toggleShowDescription();

        descriptionVisible = await aibotDatasetPanel.hasDescriptionVisible();
        await since('Description should be hidden').expect(descriptionVisible).toBe(false);

        await aibotDatasetPanel.closeDataset('AUTO_OLAP');
        await aibotDatasetPanel.closeDataset('AUTO_MTDI');

        let db1Visible = await aibotDatasetPanel.getDatasetContainerByName('AUTO_OLAP').isDisplayed();
        let db2Visible = await aibotDatasetPanel.getDatasetContainerByName('AUTO_MTDI').isDisplayed();

        await since('DB1 should be visible').expect(db1Visible).toBe(true);
        await since('DB2 should be visible').expect(db2Visible).toBe(true);

        await aibotDatasetPanel.selectDatasetFromDropdown('AUTO_OLAP');

        db1Visible = await aibotDatasetPanel.getDatasetContainerByName('AUTO_OLAP').isDisplayed();
        db2Visible = await aibotDatasetPanel.getDatasetContainerByName('AUTO_MTDI').isDisplayed();

        await since('DB1 should be visible').expect(db1Visible).toBe(true);
        await since('DB2 should be hidden').expect(db2Visible).toBe(false);

        await aibotDatasetPanel.selectDatasetFromDropdown('AUTO_MTDI');
        await aibotDatasetPanel.closeDataset('AUTO_MTDI');

        db1Visible = await aibotDatasetPanel.getDatasetContainerByName('AUTO_OLAP').isDisplayed();
        db2Visible = await aibotDatasetPanel.getDatasetContainerByName('AUTO_MTDI').isDisplayed();

        await since('DB1 should be hidden').expect(db1Visible).toBe(false);
        await since('DB2 should be visible').expect(db2Visible).toBe(true);

        await aibotDatasetPanel.selectDatasetFromDropdown('Select All');
        await aibotDatasetPanel.closeDataset('AUTO_OLAP');

        db1Visible = await aibotDatasetPanel.getDatasetContainerByName('AUTO_OLAP').isDisplayed();
        db2Visible = await aibotDatasetPanel.getDatasetContainerByName('AUTO_MTDI').isDisplayed();

        await since('DB1 should be visible').expect(db1Visible).toBe(true);
        await since('DB2 should be hidden').expect(db2Visible).toBe(true);
    });

    it('[TC99006_2] Should be able to update description', async () => {
        infoLog('Start updating description');
        // update db description
        await aibotDatasetPanel.updateDatasetDescription('AUTO_OLAP', 'New DB Description');

        // update attribute form description
        await aibotDatasetPanel.updateObjectDescription('AUTO_OLAP', 'Category (ID)', 'new form description');

        // update metric description
        await aibotDatasetPanel.updateObjectDescription('AUTO_OLAP', 'Profit', 'new metric description');

        // update derived metric description
        await aibotDatasetPanel.updateObjectDescription('AUTO_OLAP', 'Profit Margin', 'new derived metric description');

        // save bot
        await botAuthoring.saveExistingBotV2();
        // wait for the description to be synced to the ai service
        await aibotDatasetPanel.sleep(5000);

        infoLog('Reopen bot to verify updated descriptions');
        await aibotChatPanel.goToLibrary();

        // open bot again to verify values
        await libraryPage.openDossier(botName);
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');

        // verify db description
        let dbDesc = await (await aibotDatasetPanel.getDatasetDescription('AUTO_OLAP')).getText();
        await since('DB description should be #{expected}, instead it is #{actual}.')
            .expect(dbDesc)
            .toBe('New DB Description');

        // verify attribute form description
        let formDesc = await (await aibotDatasetPanel.getObjectDescription('AUTO_OLAP', 'Category (ID)')).getText();
        await since('Attribute form description should be  #{expected}, instead it is #{actual}.')
            .expect(formDesc)
            .toBe('new form description');

        // verify metric description
        let metricDesc = await (await aibotDatasetPanel.getObjectDescription('AUTO_OLAP', 'Profit')).getText();
        await since('Metric description should be #{expected}, instead it is #{actual}.')
            .expect(metricDesc)
            .toBe('new metric description');

        // // verify derived metric description
        let derivedMetricDesc = await (
            await aibotDatasetPanel.getObjectDescription('AUTO_OLAP', 'Profit Margin')
        ).getText();
        await since('Derived metric description should be #{expected}, instead it is #{actual}.')
            .expect(derivedMetricDesc)
            .toBe('new derived metric description');

        infoLog('Reload all descriptions');
        // reload all descriptions
        const reloadAllDatasetDescription = await browser.mock(
            `${baseUrl}api/v2/bots/${botId}/datasetContainers/**/datasets/**/descriptions?conversationId=**`
        );
        await aibotDatasetPanel.openDatasetContextMenuV2('AUTO_OLAP');
        await aibotDatasetPanel.clickDatasetContextMenuItem('Reload All Descriptions');

        await waitForResponse(reloadAllDatasetDescription, 0);
        await reloadAllDatasetDescription.restore();

        // verify db description
        dbDesc = await (await aibotDatasetPanel.getDatasetDescription('AUTO_OLAP')).getText();
        await since('DB description should not be #{expected}, instead it is #{actual}.')
            .expect(dbDesc)
            .not.toBe('New DB Description');

        // verify attribute form description
        formDesc = await (await aibotDatasetPanel.getObjectDescription('AUTO_OLAP', 'Category (ID)')).getText();
        await since('Attribute form description should not be #{expected}, instead it is #{actual}.')
            .expect(formDesc)
            .not.toBe('new form description');

        // verify metric description
        metricDesc = await (await aibotDatasetPanel.getObjectDescription('AUTO_OLAP', 'Profit')).getText();
        await since('Metric description should not be #{expected}, instead it is #{actual}.')
            .expect(metricDesc)
            .not.toBe('new metric description');

        // verify derived metric description
        derivedMetricDesc = await (
            await aibotDatasetPanel.getObjectDescription('AUTO_OLAP', 'Profit Margin')
        ).getText();
        await since('Derived metric description should not be #{expected}, instead it is #{actual}.')
            .expect(derivedMetricDesc)
            .not.toBe('new derived metric description');

        infoLog('Save bot after reload all descriptions');
        await botAuthoring.saveExistingBotV2();

        // update attribute form description
        await aibotDatasetPanel.updateObjectDescription('AUTO_OLAP', 'Category (ID)', 'new form description');

        // update metric description
        await aibotDatasetPanel.updateObjectDescription('AUTO_OLAP', 'Profit', 'new metric description');

        // update derived metric description
        await aibotDatasetPanel.updateObjectDescription('AUTO_OLAP', 'Profit Margin', 'new derived metric description');

        infoLog('Save bot after updating descriptions');
        await botAuthoring.saveExistingBotV2();

        infoLog('Reload descriptions by right click on objects');

        const reloadDatasetDescription = await browser.mock(
            `${baseUrl}api/v2/bots/${botId}/datasetContainers/**/datasets/**/descriptions?conversationId=**&id=**`
        );
        await aibotDatasetPanel.openDatasetObjectContextMenuV2('AUTO_OLAP', 'Category (ID)');
        await aibotDatasetPanel.clickDatasetObjectContextMenu('Reload Description');
        await waitForResponse(reloadDatasetDescription, 0);
        // verify attribute form description
        formDesc = await (await aibotDatasetPanel.getObjectDescription('AUTO_OLAP', 'Category (ID)')).getText();
        await since('Attribute form description should not be #{expected}, instead it is #{actual}.')
            .expect(formDesc)
            .not.toBe('new form description');

        await aibotDatasetPanel.openDatasetObjectContextMenuV2('AUTO_OLAP', 'Profit');
        await aibotDatasetPanel.clickDatasetObjectContextMenu('Reload Description');
        await waitForResponse(reloadDatasetDescription, 1);
        // verify metric description
        metricDesc = await (await aibotDatasetPanel.getObjectDescription('AUTO_OLAP', 'Profit')).getText();
        await since('Metric description should not be #{expected}, instead it is #{actual}.')
            .expect(metricDesc)
            .not.toBe('new metric description');

        await aibotDatasetPanel.openDatasetObjectContextMenuV2('AUTO_OLAP', 'Profit Margin');
        await aibotDatasetPanel.clickDatasetObjectContextMenu('Reload Description');
        await waitForResponse(reloadDatasetDescription, 2);
        await reloadDatasetDescription.restore();
        // verify derived metric description
        derivedMetricDesc = await (
            await aibotDatasetPanel.getObjectDescription('AUTO_OLAP', 'Profit Margin')
        ).getText();
        await since('Derived metric description should be reloaded')
            .expect(derivedMetricDesc)
            .not.toBe('new derived metric description');

        infoLog('Verify descriptions after reload by right click on objects');
        // verify db description
        dbDesc = await (await aibotDatasetPanel.getDatasetDescription('AUTO_OLAP')).getText();
        await since('DB description should not be #{expected}, instead it is #{actual}.')
            .expect(dbDesc)
            .not.toBe('New DB Description');

        await botAuthoring.saveExistingBotV2();
    });

    it('[TC99006_3] Should be able to toggle form and metric selection', async () => {
        // hide descriptions initially
        await aibotDatasetPanel.toggleShowDescription();
        let descriptionVisible = await aibotDatasetPanel.hasDescriptionVisible();
        await since('Description should be hidden').expect(descriptionVisible).toBe(false);

        // check intial status of form and metric selection
        const form1Selected = await aibotDatasetPanel.isDatasetObjectSelected('Category (ID)');
        const form2Selected = await aibotDatasetPanel.isDatasetObjectSelected('Month');
        const metric1Selected = await aibotDatasetPanel.isDatasetObjectSelected('Profit Margin');
        const metric2Selected = await aibotDatasetPanel.isDatasetObjectSelected('Flights Cancelled');
        await since('Attribute form1 selection should be #{expected}, instead we have #{actual}')
            .expect(form1Selected)
            .toBe(true);
        await since('Attribute form2 selection should be #{expected}, instead we have #{actual}')
            .expect(form2Selected)
            .toBe(true);
        await since('Metric1 selection should be #{expected}, instead we have #{actual}')
            .expect(metric1Selected)
            .toBe(true);
        await since('Metric2 selection should be #{expected}, instead we have #{actual}')
            .expect(metric2Selected)
            .toBe(true);

        // update form and metric selection
        await aibotDatasetPanel.toggleCheckboxForDatasetObject('Category (ID)');
        await aibotDatasetPanel.toggleCheckboxForDatasetObject('Month');
        await aibotDatasetPanel.toggleCheckboxForDatasetObject('Profit Margin');
        await aibotDatasetPanel.toggleCheckboxForDatasetObject('Flights Cancelled');

        // save bot
        await botAuthoring.saveExistingBotV2();
        await aibotChatPanel.goToLibrary();

        // open bot again to verify values
        await libraryPage.openDossier(botName);
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');

        await aibotDatasetPanel.toggleShowDescription();
        descriptionVisible = await aibotDatasetPanel.hasDescriptionVisible();
        await since('Description should be hidden').expect(descriptionVisible).toBe(false);

        // verify form and metric selection
        const form1SelectedAfter = await aibotDatasetPanel.isDatasetObjectSelected('Category (ID)');
        const form2SelectedAfter = await aibotDatasetPanel.isDatasetObjectSelected('Month');
        const metric1SelectedAfter = await aibotDatasetPanel.isDatasetObjectSelected('Profit Margin');
        const metric2SelectedAfter = await aibotDatasetPanel.isDatasetObjectSelected('Flights Cancelled');
        await since('Attribute form1 selection should be #{expected}, instead we have #{actual}')
            .expect(form1SelectedAfter)
            .toBe(false);
        await since('Attribute form2 selection should be #{expected}, instead we have #{actual}')
            .expect(form2SelectedAfter)
            .toBe(false);
        await since('Metric1 selection should be #{expected}, instead we have #{actual}')
            .expect(metric1SelectedAfter)
            .toBe(false);
        await since('Metric2 selection should be #{expected}, instead we have #{actual}')
            .expect(metric2SelectedAfter)
            .toBe(false);

        // ask question about hidden objects
        await aibotChatPanel.askQuestion(`Which Month has highest Flights Cancelled number?`);
        await aibotChatPanel.waitForAnswerLoading();

        const answerText = await aibotChatPanel.getAnswersTextByIndex(0);
        // the correct answer is 'February' with 3,771 Flights Cancelled.
        await since('Answer text should not contain #{expected}, instead we have #{actual}')
            .expect(answerText)
            .not.toContain('February');

        // restore back the settings
        await aibotDatasetPanel.toggleCheckboxForDatasetObject('Category (ID)');
        await aibotDatasetPanel.toggleCheckboxForDatasetObject('Month');
        await aibotDatasetPanel.toggleCheckboxForDatasetObject('Profit Margin');
        await aibotDatasetPanel.toggleCheckboxForDatasetObject('Flights Cancelled');

        // save bot
        await botAuthoring.saveExistingBotV2();
        await aibotChatPanel.goToLibrary();
    });

    it('[TC99006_4] Should be able to search dataset objects', async () => {
        // hide descriptions initially
        await aibotDatasetPanel.toggleShowDescription();
        let descriptionVisible = await aibotDatasetPanel.hasDescriptionVisible();
        await since('Description should be hidden').expect(descriptionVisible).toBe(false);

        // Input keyword in two datasets to search
        await aibotDatasetPanel.searchDataset('ca');

        // Verify search results
        await since('Search results should be displayed for valid term in dataset1')
            .expect(await aibotDatasetPanel.getDataName('Category (ID)').isDisplayed())
            .toBe(true);

        await since('Search results should be displayed for valid term in two dataset2')
            .expect(await aibotDatasetPanel.getDataName('Flights Cancelled').isDisplayed())
            .toBe(true);

        // Select dataset and verify selection
        await aibotDatasetPanel.selectDatasetFromDropdown('AUTO_OLAP');
        await since('Search results should be displayed for valid term in two dataset2')
            .expect(await aibotDatasetPanel.getDataName('Flights Cancelled').isDisplayed())
            .toBe(false);

        // Input keyword with no results
        await aibotDatasetPanel.searchDataset('NonexistentTerm');

        // Verify no results message
        await since('No match message should be displayed for invalid search')
            .expect(await aibotDatasetPanel.getNoMatchContent().isDisplayed())
            .toBe(true);
    });

    it('[TC99006_5] Should be able to enter ADC mode and keep original dataset manipulations', async () => {
        // Do some dataset manipulations
        // Change attribute form hidden property
        await aibotDatasetPanel.toggleCheckboxForDatasetObject('Year');
        // Change dataset description
        await aibotDatasetPanel.updateDatasetDescription('AUTO_OLAP', 'New DB Description');
        // Change derived metric description
        await aibotDatasetPanel.updateObjectDescription(
            'AUTO_MTDI',
            'Flights Delayed',
            'new derived metric description'
        );

        // Enter ADC mode
        await aibotDatasetPanel.clickUpdateDatasetButton();
        await since('Update dataset from Bot, ADC page present should be #{expected}, instead we have #{actual}')
            .expect(await adc.isADCToolbarPresent())
            .toBe(true);

        // Cancel ADC mode
        await adc.cancel();
        // Verify that the original dataset manipulations are still present
        let dbDesc = await (await aibotDatasetPanel.getDatasetDescription('AUTO_OLAP')).getText();
        await since('DB description should be kept').expect(dbDesc).toBe('New DB Description');

        // verify dataset and metric description
        let derivedMetricDesc = await (
            await aibotDatasetPanel.getObjectDescription('AUTO_MTDI', 'Flights Delayed')
        ).getText();
        await since('Derived metric description should be kept')
            .expect(derivedMetricDesc)
            .toBe('new derived metric description');
        const formSelectedAfter = await aibotDatasetPanel.isDatasetObjectSelected('Year');
        await since('Attribute form selection should be kept').expect(formSelectedAfter).toBe(false);
    });

    it('[TC99006_6] Should be able to save adc without editing and keep some original dataset manipulations', async () => {
        // copy ADC.
        copiedADCId = await copyADC({
            credentials: consts.botV2DatasetUser,
            projectId,
            id: aiDatasetCollectionId,
            newName: 'AUTO_ADC_multi_datasets_copy',
            targetFolderId: folderId,
        });

        // create bot with copied ADC
        botIdForCopiedADC = await createBotByAPIV2({
            credentials: consts.botV2DatasetUser,
            aiDatasetCollections: [copiedADCId],
            projectId,
            folderId,
            botName: 'AutoBot_' + Math.random().toString().slice(2, 10),
            publishedToUsers: [consts.botV2DatasetUser.id],
        });

        // Open bot and go to dataset panel
        await libraryPage.editBotByUrl({ projectId, botId: botIdForCopiedADC });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');

        // Do some dataset manipulations
        // Change attribute form hidden property
        await aibotDatasetPanel.toggleCheckboxForDatasetObject('Category (DESC)');
        // Change dataset description
        await aibotDatasetPanel.updateDatasetDescription('AUTO_OLAP', 'New DB Description');
        // Change derived metric description
        await aibotDatasetPanel.updateObjectDescription(
            'AUTO_MTDI',
            'Flights Delayed',
            'new derived metric description'
        );

        // Enter ADC mode
        await aibotDatasetPanel.clickUpdateDatasetButton();
        await since('Update dataset from Bot, ADC page present should be #{expected}, instead we have #{actual}')
            .expect(await adc.isADCToolbarPresent())
            .toBe(true);

        await datasetsPanel.renameObject('Cost', 'Cost_new');
        await since('Renamed, new name present should be #{expected}, instead we have #{actual}')
            .expect(await datasetsPanel.isAttributeMetricDisplayed('Cost_new'))
            .toBe(true);
        // Save changes without actual change
        await adc.saveChanges();
        // Verify that the original dataset manipulations are still present
        const dbDesc = await (await aibotDatasetPanel.getDatasetDescription('AUTO_OLAP')).getText();
        await since('DB description should be updated').expect(dbDesc).not.toBe('New DB Description');

        // verify dataset and metric description
        const derivedMetricDesc = await (
            await aibotDatasetPanel.getObjectDescription('AUTO_MTDI', 'Flights Delayed')
        ).getText();
        await since('Derived metric description should be updated')
            .expect(derivedMetricDesc)
            .not.toBe('new derived metric description');

        const formSelectedBefore = await aibotDatasetPanel.isDatasetObjectSelected('Category (DESC)');
        await since('Attribute form selection should be kept').expect(formSelectedBefore).toBe(false);
    });

    it('[TC99006_7] Should be able to enter save adc with some edittings and keep some original dataset manipulations', async () => {
        infoLog("create bot with copied ADC 'AUTO_ADC_multi_datasets_copy'");
        // copy ADC from existing ADC 'AUTO_ADC_OLAP'
        adc4DataSyncTest = await copyADC({
            credentials: consts.botV2DatasetUser,
            projectId,
            id: '3CCED350DF4A0CFF87224FA827FBE8D1', // AUTO_ADC_OLAP
            newName: 'AUTO_ADC_OLAP_copy',
            targetFolderId: folderId,
        });

        // create bot from copied ADC.
        await libraryPage.clickLibraryIcon();
        bot4DataSyncTest = await createBotByAPIV2({
            credentials: consts.botV2DatasetUser,
            aiDatasetCollections: [adc4DataSyncTest],
            projectId,
            folderId,
            botName: 'AutoBot_' + Math.random().toString().slice(2, 10),
            publishedToUsers: [consts.botV2DatasetUser.id],
        });

        infoLog('Open bot and go to dataset panel');
        await libraryPage.editBotByUrl({ projectId, botId: bot4DataSyncTest });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');

        infoLog('Hide descriptions initially');
        // Hide descriptions initially
        await aibotDatasetPanel.toggleShowDescription();
        const descriptionVisible = await aibotDatasetPanel.hasDescriptionVisible();
        await since('Description should be hidden').expect(descriptionVisible).toBe(false);
        // Do some dataset manipulations
        // Change metric hidden property
        await aibotDatasetPanel.toggleCheckboxForDatasetObject('Cost');

        infoLog('Enter ADC mode');
        await aibotDatasetPanel.clickUpdateDatasetButton();
        await since('Update dataset from Bot, ADC page present should be #{expected}, instead we have #{actual}')
            .expect(await adc.isADCToolbarPresent())
            .toBe(true);

        infoLog('Rename metric Cost to CostNew');
        await datasetsPanel.renameObject('Cost', 'CostNew');
        await since('Renamed metric, new name present should be #{expected}, instead we have #{actual}')
            .expect(await datasetsPanel.isAttributeMetricDisplayed('CostNew'))
            .toBe(true);

        const initDMCount = await datasetsPanel.getElementCountByType('DM');

        infoLog('Create derived metric Avg (Flights Delayed)');
        await datasetsPanel.rightClickAttributeMetricByName('Profit Margin');
        await datasetsPanel.actionOnMenuSubmenu('Aggregate By', 'Average');

        infoLog('create derived metric with unsupported function');
        const taskProcMock = await datasetsPanel.mockTaskProcRequest();
        await datasetsPanel.rightClickAttributeMetricByName('Profit');
        await datasetsPanel.actionOnMenu('Create Metric...');
        await waitForResponse(taskProcMock, 0);
        await browser.pause(2000);
        // Switch to Formula Editor
        await datasetsPanel.clickSwitchToFormulaEditorButton();
        // Clear the formula
        await datasetsPanel.clickClearFormulaEditorButton();
        // input unsupported formula
        await datasetsPanel.input('RunningMax<BreakBy={@auto}, SortBy=(@auto)>(Profit)');
        // save the new metric.
        await datasetsPanel.clickSaveFormulaEditorButton();

        await since('Create DM, derived metric element count should be #{expected}, instead we have #{actual}')
            .expect(await datasetsPanel.getElementCountByType('DM'))
            .toBe(initDMCount + 2);

        infoLog('create derived attribute with Category');
        await datasetsPanel.rightClickAttributeMetricByName('Category');
        await datasetsPanel.actionOnMenu('Create Attribute...');
        await waitForResponse(taskProcMock, 1);
        await browser.pause(2000);
        await derivedAttributeEditor.addObjectByDoubleClick('Category');
        await derivedAttributeEditor.selectFormFromDropdown('DESC');
        await since(
            'The derived attribute definition in "Input" section should be #{expected}, instead we have #{actual}'
        )
            .expect(await derivedAttributeEditor.getAttributeFormDefinition())
            .toBe('Category@DESC');
        await derivedAttributeEditor.setAttributeName('DA_Category');
        await derivedAttributeEditor.saveAttribute();
        await since(
            'Derived attribute "DA_Category" displays on dataset panel under "AUTO_OLAP", should be #{expected}, instead we have #{actual}'
        )
            .expect(await datasetsPanel.isAttributeMetricDisplayed('DA_Category'))
            .toBe(true);

        infoLog('Save ADC with some changes');
        await adc.saveChanges();

        infoLog('Verify that name is changed, but the hidden property is kept');
        const formSelectedBefore = await aibotDatasetPanel.isDatasetObjectSelected('CostNew');
        await since('Metric selection should be kept').expect(formSelectedBefore).toBe(false);

        infoLog('Verify that the derived metric is created');
        await since(`The new created DM present on dataset panel should be #{expected}, while we get #{actual}`)
            .expect(await aibotDatasetPanel.isDatasetElementDisplayed('Avg (Profit Margin)'))
            .toBe(true);

        infoLog('Verify that the derived metric with unsupported function is not saved');
        const warnIconDisplayed = await datasetsPanel
            .$('[aria-label="This metric uses a function that is not supported by the AI service."]')
            .isDisplayed();
        await since('Warning icon should be displayed').expect(warnIconDisplayed).toBe(true);

        infoLog('Verify that the derived attribute is created');
        await since(`The new created DA present on dataset panel should be #{expected}, while we get #{actual}`)
            .expect(await aibotDatasetPanel.isDatasetElementDisplayed('DA_Category'))
            .toBe(true);

        infoLog('Show descriptions');
        await aibotDatasetPanel.toggleShowDescription();
        
        infoLog('Modify description of DA_Category');
        await aibotDatasetPanel.updateObjectDescription('AUTO_OLAP', 'DA_Category', 'new derived attribute description');
        infoLog('Modify description of Avg (Profit Margin)');
        await aibotDatasetPanel.updateObjectDescription('AUTO_OLAP', 'Avg (Profit Margin)', 'new avg profit margin description');

        infoLog('Save bot after updating descriptions');
        await botAuthoring.saveExistingBotV2();
    });

    it('[TC99006_8] check ner function', async () => {
        const datasetName = 'AUTO_MTDI';
        const objectName = 'Airline Name';
        infoLog('change ner from false to true');
        await aibotDatasetPanel.openDatasetObjectContextMenuV2(datasetName, objectName);
        await aibotDatasetPanel.clickDatasetObjectContextMenu('NER', 'Enable');
        await takeScreenshotByElement(
            aibotDatasetPanel.getNerEnabledMark(datasetName, objectName),
            'TC99006_8_1',
            'gray NER label'
        );
        await botAuthoring.saveExistingBotV2();
        await aibotDatasetPanel.waitForNerCurtainDisappear(datasetName, objectName);
        await since('Ner label should be enabled due to successful PATCH request')
            .expect(await aibotDatasetPanel.isNerEnabledForObject(datasetName, objectName))
            .toBe(true);
        await takeScreenshotByElement(
            aibotDatasetPanel.getNerEnabledMark(datasetName, objectName),
            'TC99006_8_2',
            'green NER label'
        );

        infoLog('change ner from true to false');
        // await aibotDatasetPanel.toggleNerSwitchForDatasetObject(objectName);
        await aibotDatasetPanel.openDatasetObjectContextMenuV2(datasetName, objectName);
        await aibotDatasetPanel.clickDatasetObjectContextMenu('NER', 'Disable');
        await botAuthoring.saveExistingBotV2();
        await aibotDatasetPanel.waitForNerCurtainDisappear(datasetName, objectName);
        await aibotDatasetPanel.sleep(2000);
        await since('Ner label should disappear due to successful PATCH request')
            .expect(await aibotDatasetPanel.isNerEnabledForObject(datasetName, objectName))
            .toBe(false);

        infoLog('check change ner failed case due to PATCH failed');
        const mockPatchRequest = await browser.mock(`${baseUrl}api/v2/bots/${botId}?conversationId=**`);
        mockPatchRequest.respondOnce({ message: 'Internal Server Error' }, { fetchResponse: false, statusCode: 500 });
        await aibotDatasetPanel.openDatasetObjectContextMenuV2(datasetName, objectName);
        await aibotDatasetPanel.clickDatasetObjectContextMenu('NER', 'Enable');
        await botAuthoring.saveExistingBotV2();
        await aibotDatasetPanel.waitForNerCurtainDisappear(datasetName, objectName);
        await botAuthoring.selectBotConfigTabByName('General'); // DE319148 workaround
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('Ner Switch should be unchecked due to failed PATCH request')
            .expect(await aibotDatasetPanel.isNerEnabledForObject(datasetName, objectName))
            .toBe(false);

        infoLog('check change ner failed case due to NerStatus failed');
        const mockNerStatusRequest = await browser.mock(
            `${baseUrl}api/v2/bots/${botId}/nerIndexStatus/query?conversationId=**`
        );
        console.log('mock request: ', `${baseUrl}api/v2/bots/${botId}/nerIndexStatus/query?conversationId=**`);
        mockNerStatusRequest.respondOnce(
            { message: 'Internal Server Error' },
            { fetchResponse: false, statusCode: 500 }
        );
        await aibotDatasetPanel.openDatasetObjectContextMenuV2(datasetName, objectName);
        await aibotDatasetPanel.clickDatasetObjectContextMenu('NER', 'Enable');
        await botAuthoring.saveExistingBotV2();
        await aibotDatasetPanel.waitForNerCurtainDisappear(datasetName, objectName);
        await botAuthoring.selectBotConfigTabByName('General'); // DE319148 workaround
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('Ner Switch should be unchecked due to failed NerStatus request')
            .expect(await aibotDatasetPanel.isNerEnabledForObject(datasetName, objectName))
            .toBe(false);
        await since('Ner warning icon should be displayed')
            .expect(await aibotDatasetPanel.getNerWarningMark(datasetName, objectName).isDisplayed())
            .toBe(true);
    });
});
