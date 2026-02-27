import { browserWindow } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import * as bot from '../../../constants/bot2.js';
import deleteObjectByNames from '../../../api/folderManagement/deleteObjectByNames.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import deleteObjectsByFolder from '../../../api/folderManagement/deleteObjectsByFolder.js';
import path from 'path';

describe('Bot 2.0 Unstructured Data Create', () => {
    const unstructuredFilesBasePath = path.resolve(process.cwd(), 'agentTestFiles', 'unstructuredFiles');
    let {
        loginPage,
        libraryPage,
        aibotChatPanel,
        aibotDatasetPanel,
        botAuthoring,
        libraryAuthoringPage,
        botConsumptionFrame,
        datasetPanel,
        baseContainer,
        dossierAuthoringPage,
        adc,
        toolbar,
        visualizationPanel,
    } = browsers.pageObj1;

    const project = bot.project_applicationTeam;

    const structuredDataBot_ForEdit = {
        id: '7EBA39BA625E4CA49487618F3A4D7781',
        name: 'StructuredDataBot_ForEdit' + Date.now(),
        project: bot.project_applicationTeam,
    };

    const dataset_ForEdit = {
        id: '',
        name: 'MTDI_Airline_Bot',
        project: bot.project_applicationTeam,
    };

    const unstructuredData_bot = {
        name: 'UnstructuredData_Bot' + Date.now(),
    };

    const mixedData_bot = {
        name: 'MixedData_Bot' + Date.now(),
    };

    const newADC = {
        name: 'Auto_ADC_UnstructuredData_' + Date.now(),
    };

    const newUpdatedADC = {
        name: 'Auto_ADC_UnstructuredData_Updated_' + Date.now(),
    };

    const newADC_Mixed = {
        name: 'Auto_ADC_MixedData_' + Date.now(),
    };

    const unstructuredDataTitle = 'Unstructured Data';
    const structuredDataTitle = 'Structured Data';

    const unstructuredDataFile = {
        name: 'AUTO_Employee_Handbook',
    };

    const unstructuredDataFile2 = {
        name: 'AUTO_Google',
    };

    const structuredData = {
        name: 'MTDI_Airline_Bot',
    };

    const folder = {
        id: '056A28140E45ABBF81ADF68D3AF9806A',
        path: ['Bot2.0', 'Folder for create bot'],
    };

    const uploadUnstructuredDataFiles = [
        'AboutStrategy.txt',
        'eml-sample.eml',
        'Google.htm',
        'markdown-sample.md',
        'word-sample.docx',
    ];
    const uploadPDF = 'Bitcoin-Whitepaper.pdf';
    const uploadPDF2 = 'USParentalLeavePolicy.pdf';
    const uploadErrorFiles = ['empty.txt', 'type-not-supported.csv'];
    const unstructured_folder = {
        id: '3C6C361EE34E267C4344DAAA37E73EFE',
        path: ['Shared Reports', 'AUTO'],
    };
    const project_unstructured = {
        id: 'FF637BE8324874A9DD12E9AB06F58C02',
        name: 'Upload Unstructured',
    };

    const dataset1 = structuredData.name;

    beforeAll(async () => {
        await deleteObjectsByFolder({
            credentials: bot.unstructuredDataUser,
            projectId: project_unstructured.id,
            parentFolderId: unstructured_folder.id,
        });
        await setWindowSize(browserWindow);
        await loginPage.login(bot.unstructuredDataUser);
        await libraryPage.waitForLibraryLoading();
    });

    beforeEach(async () => {
        await libraryPage.resetToLibraryHome();
        await libraryPage.waitForLibraryLoading();
    });

    afterEach(async () => {
        await deleteCreatedBots();
    });

    afterAll(async () => {
        await deleteCreatedBots();
        await logoutFromCurrentBrowser();
    });

    async function deleteCreatedBots() {
        await deleteObjectByNames({
            credentials: bot.universalUser,
            projectId: project.id,
            parentFolderId: folder.id,
            names: [unstructuredData_bot.name, structuredDataBot_ForEdit.name, mixedData_bot.name],
        });
        await deleteObjectByNames({
            credentials: bot.universalUser,
            projectId: project.id,
            parentFolderId: folder.id,
            names: [newADC.name, newADC_Mixed.name, newUpdatedADC.name],
        });
    }

    it('[TC99515_1] Create Bot with unstructured data only', async () => {
        // Create ADC with unstructured data
        await libraryAuthoringPage.clickNewDossierIcon();
        await libraryAuthoringPage.clickNewADCButton();
        await libraryAuthoringPage.waitForProjectSelectionWindowAppear();
        await since('Unstructured Data tab display in data select dialog should be #{expected} but is #{actual}')
            .expect(await (await libraryAuthoringPage.getMenuItemInDatasetDialog('Unstructured Data')).isDisplayed())
            .toBe(true);
        await libraryAuthoringPage.selectProjectAndUnstructuredData('MicroStrategy Tutorial', 'AUTO_Employee_Handbook');
        await adc.waitForCurtainDisappear();
        // check add grid button disabled and viz show as no structured data
        await since('new viz button disabled should be #{expected}, instead we have #{actual}')
            .expect(await toolbar.isButtonDisabled('Add Grid'))
            .toBe(true);
        await since('Viz container should show as #{expected}, instead we have #{actual}')
            .expect(await visualizationPanel.getVizTypeNameByTitle('Data Preview 1'))
            .toBe('No Structured Data');
        await takeScreenshotByElement(
            visualizationPanel.getVizImgByTitle('Data Preview 1'),
            'TC99515_1',
            'No Structured Data image'
        );

        // Save ADCs
        await adc.saveToPath(newADC.name, folder.path);
        await adc.cancel();

        // Create Bot with ADC containing unstructured data
        await libraryAuthoringPage.createBotWithADC({ aiDataCollection: newADC.name });

        // Save bot
        await botAuthoring.saveBotWithName(unstructuredData_bot.name, folder.path);
        await since('Library title should be #{expected} but is #{actual}')
            .expect(await botConsumptionFrame.getBotName())
            .toEqual(unstructuredData_bot.name);

        // Verify bot data panel
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');

        // Verify unstructured data file name
        await since('The unstructured data file name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getUnstructuredDataItemNameText())
            .toBe(unstructuredDataFile.name);

        // Back to library home
        await aibotChatPanel.goToLibrary();
        await since('Back to library page, the new bot in library should be "#{expected}", instead we have "#{actual}"')
            .expect(await libraryPage.isDossierInLibrary(unstructuredData_bot))
            .toBe(true);
    });

    it('[TC99515_2] Update structured data bot ADC with unstructured data', async () => {
        await libraryAuthoringPage.clickNewDossierIcon();
        await libraryAuthoringPage.clickNewBot2Button();
        await libraryAuthoringPage.waitForProjectSelectionWindowAppear();
        await libraryAuthoringPage.selectProjectAndDataset('MicroStrategy Tutorial', 'Spotify');
        await libraryAuthoringPage.waitForCurtainDisappear();
        await adc.saveToPath(newUpdatedADC.name, folder.path);

        await botAuthoring.waitForCurtainDisappear();
        await botAuthoring.saveBotWithName(structuredDataBot_ForEdit.name, folder.path);
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await aibotDatasetPanel.clickUpdateDatasetButton();
        await since('Update dataset from Bot, ADC page present should be #{expected}, instead we have #{actual}')
            .expect(await adc.isADCToolbarPresent())
            .toBe(true);

        // Update ADC with unstructured data
        await datasetPanel.selectFromDatasetsPanelContextMenu('Add Data');
        await baseContainer.selectSecondaryContextMenuOption('Existing Dataset...');
        await libraryAuthoringPage.selectUnstructuredData(unstructuredDataFile.name);

        // Save ADC
        await adc.saveChanges();
        await libraryAuthoringPage.waitForCurtainDisappear();

        // Verify updated ADC in bot
        await aibotDatasetPanel.clickOnDatasetTitle();
        await since('The structured dataset title should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetPanelDatasetTitleName())
            .toBe(structuredDataTitle);
        await since('The unstructured dataset title should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetPanelDatasetTitleName(1))
            .toBe(unstructuredDataTitle);
        // Verify unstructured data file name
        await since('The unstructured data file name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getUnstructuredDataItemNameText())
            .toBe(unstructuredDataFile.name);
    });

    it('[TC99515_3] Create ADC with structured and unstructured data', async () => {
        // Create Standalone ADC with structured data and unstructured data
        // Create ADC with structured data
        await libraryAuthoringPage.clickNewDossierIcon();
        await libraryAuthoringPage.clickNewADCButton();
        await libraryAuthoringPage.waitForProjectSelectionWindowAppear();
        await libraryAuthoringPage.selectProjectAndDataset(dataset_ForEdit.project.name, dataset_ForEdit.name);

        // Add unstructured data to ADC
        await datasetPanel.selectFromDatasetsPanelContextMenu('Add Data');
        await baseContainer.selectSecondaryContextMenuOption('Existing Dataset...');
        await libraryAuthoringPage.selectUnstructuredData(unstructuredDataFile.name);
        await adc.saveToPath(newADC_Mixed.name, folder.path);
        await libraryAuthoringPage.waitForCurtainDisappear();
        await adc.cancel();

        // Create Bot with ADC containing structured and unstructured data
        await libraryAuthoringPage.createBotWithADC({ aiDataCollection: newADC_Mixed.name });
        await botAuthoring.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');

        await aibotDatasetPanel.clickOnDatasetTitle();
        await since('The structured dataset title should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetPanelDatasetTitleName())
            .toBe(structuredDataTitle);
        await since('The unstructured dataset title should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetPanelDatasetTitleName(1))
            .toBe(unstructuredDataTitle);
        // Verify unstructured data file name
        await since('The unstructured data file name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getUnstructuredDataItemNameText())
            .toBe(unstructuredDataFile.name);

        // Search for structured data
        await aibotDatasetPanel.clickOnDatasetTitle();
        await aibotDatasetPanel.searchDataset(dataset1);
        await aibotDatasetPanel.selectDatasetFromDropdown(dataset1);

        await botAuthoring.saveBotWithName(mixedData_bot.name, folder.path);
        await libraryAuthoringPage.waitForCurtainDisappear();

        // Update ADC with unstructured data
        await botAuthoring.selectBotConfigTabByName('Data');
        await aibotDatasetPanel.clickUpdateDatasetButton();

        await libraryAuthoringPage.waitForCurtainDisappear();

        // with structured and unstructred, GUI not changed
        await since(
            'with structured and unstructured, new viz button disabled should be #{expected}, instead we have #{actual}'
        )
            .expect(await toolbar.isButtonDisabled('Add Grid'))
            .toBe(false);
        await since(
            'with structured and unstructured, viz container should show as #{expected}, instead we have #{actual}'
        )
            .expect(await visualizationPanel.getVizTypeNameByTitle('Data Preview 1'))
            .toBe('Grid');

        // delete structured, only unstructured kepts
        await datasetPanel.deleteDataset(dataset1);
        await since(
            'only unstructured remain, new viz button disabled should be #{expected}, instead we have #{actual}'
        )
            .expect(await toolbar.isButtonDisabled('Add Grid'))
            .toBe(true);
        await since('onl unstructured remain, viz container should show as #{expected}, instead we have #{actual}')
            .expect(await visualizationPanel.getVizTypeNameByTitle('Data Preview 1'))
            .toBe('No Structured Data');
        await dossierAuthoringPage.actionOnToolbar('Undo');

        await dossierAuthoringPage.deleteUnstructuredDataItem(unstructuredDataFile.name);
        await dossierAuthoringPage.actionOnToolbar('Undo');
        await dossierAuthoringPage.actionOnToolbar('Redo');

        await datasetPanel.selectFromDatasetsPanelContextMenu('Add Data');
        await baseContainer.selectSecondaryContextMenuOption('Existing Dataset...');
        await libraryAuthoringPage.selectUnstructuredData(unstructuredDataFile2.name);

        await adc.saveChanges();
        await libraryAuthoringPage.waitForCurtainDisappear();

        // Verify updated ADC in bot
        await aibotDatasetPanel.clickOnDatasetTitle();
        await since('The unstructured data file name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getUnstructuredDataItemNameText())
            .toBe(unstructuredDataFile2.name);
    });

    it('[TC99515_14] Upload/remove unstructured data', async () => {
        // upload file types: .txt, .eml, .htm, .md, .docx
        await libraryAuthoringPage.clickNewDossierIcon();
        await libraryAuthoringPage.clickNewADCButton();
        await libraryAuthoringPage.waitForProjectSelectionWindowAppear();
        await libraryAuthoringPage.selectProjectAndUnstructuredDataPanel(project_unstructured.name);
        await since('Upload unstructured data button display should be #{expected} but is #{actual}')
            .expect(await libraryAuthoringPage.isUploadBtnDisplayed())
            .toBe(true);
        // upload 1 unstructured data file and delete it
        await libraryAuthoringPage.clickUploadButton();
        await libraryAuthoringPage.waitForAddUnstructuredDataDialogAppear();
        await libraryAuthoringPage.uploadUnstructuredData(
            path.resolve(unstructuredFilesBasePath, uploadUnstructuredDataFiles[0])
        );
        let txtForAddBtn = await libraryAuthoringPage.getTextForAddBtnInUnstructuredDataPanel();
        await since('Uploaded 1 unstructured data, file count should be #{expected} but is #{actual}')
            .expect(txtForAddBtn)
            .toBe('Add(1)');
        await libraryAuthoringPage.deleteUnstructuredDataInUploadDialog(uploadUnstructuredDataFiles[0]);
        txtForAddBtn = await libraryAuthoringPage.getTextForAddBtnInUnstructuredDataPanel();
        await since('Delete unstructured file, the file count should be #{expected} but is #{actual}')
            .expect(txtForAddBtn)
            .toBe('Add(0)');
        await since('After delete, the Add button enabled should be #{expected} but is #{actual}')
            .expect(await libraryAuthoringPage.getAddButtonInUnstructuredDataPanel().isEnabled())
            .toBe(false);
        // upload multiple unstructured data files
        await libraryAuthoringPage.uploadUnstructuredData(
            uploadUnstructuredDataFiles.map((file) => path.resolve(unstructuredFilesBasePath, file))
        );
        txtForAddBtn = await libraryAuthoringPage.getTextForAddBtnInUnstructuredDataPanel();
        await since('Uploaded unstructured data files count should be #{expected} but is #{actual}')
            .expect(txtForAddBtn)
            .toBe('Add(5)');

        await takeScreenshotByElement(
            libraryAuthoringPage.getAddUnstructuredDataDialog(),
            'TC99515_14',
            'Upload multiple unstructured data list'
        );
        // add unstructured data and save to MD
        await libraryAuthoringPage.saveUnstructuredDataToMD(unstructured_folder.path);
        await libraryAuthoringPage.waitForAllUnstructuredFileUploadComplete();
        // cancel to close the dialog
        await libraryAuthoringPage.clickCancelButton();
    });

    it('[TC99515_15] Upload PDF and error handling', async () => {
        await libraryAuthoringPage.clickNewDossierIcon();
        await libraryAuthoringPage.clickNewADCButton();
        await libraryAuthoringPage.waitForProjectSelectionWindowAppear();
        await libraryAuthoringPage.selectProjectAndUnstructuredDataPanel(project_unstructured.name);
        await libraryAuthoringPage.clickUploadButton();
        await libraryAuthoringPage.waitForAddUnstructuredDataDialogAppear();
        // upload unsupported file type .pdf
        await libraryAuthoringPage.uploadUnstructuredData(path.resolve(unstructuredFilesBasePath, uploadPDF));
        await libraryAuthoringPage.uploadUnstructuredData(
            uploadErrorFiles.map((file) => path.resolve(unstructuredFilesBasePath, file))
        );
        await since('Unsupported file type error message display should be #{expected} but is #{actual}')
            .expect(await libraryAuthoringPage.getWarningMessageTextInAddUnstructuredDataDialog())
            .toContain('2 of 3 files were not selected due to unsupported file types or exceeding the size limit.');
        await since('The PDF file should be added to the upload list, the file name is #{expected} but is #{actual}')
            .expect(await libraryAuthoringPage.getUnstructuredFileItemByName(uploadPDF).isExisting())
            .toBe(true);
        await libraryAuthoringPage.saveUnstructuredDataToMD(unstructured_folder.path);
        await libraryAuthoringPage.waitForElementInvisible(libraryAuthoringPage.getAddUnstructuredDataDialog());
        await libraryAuthoringPage.selectProjectAndUnstructuredData(
            project_unstructured.name,
            uploadPDF.replace(/\.[^/.]+$/, '')
        );
        await adc.waitForCurtainDisappear();
        await since(
            'The uploaded PDF unstructured data displayed in dataset panel should be #{expected} but is #{actual}'
        )
            .expect(await datasetPanel.isDatasetDisplayed(uploadPDF.replace(/\.[^/.]+$/, '')))
            .toBe(true);
        await datasetPanel.selectFromDatasetsPanelContextMenu('Add Data');
        await baseContainer.selectSecondaryContextMenuOption('Existing Dataset...');
        await libraryAuthoringPage.clickDatasetTypeInAddDataPanel('Unstructured Data');
        await since('The upload Button display should be #{expected} but is #{actual}')
            .expect(await libraryAuthoringPage.getUploadBtn().isDisplayed())
            .toBe(true);
        // upload another PDF file in ADC
        await libraryAuthoringPage.clickUploadButton();
        await libraryAuthoringPage.waitForAddUnstructuredDataDialogAppear();
        await libraryAuthoringPage.uploadUnstructuredData(path.resolve(unstructuredFilesBasePath, uploadPDF2));
        await libraryAuthoringPage.saveUnstructuredDataToMD(unstructured_folder.path);
        await libraryAuthoringPage.waitForElementInvisible(libraryAuthoringPage.getAddUnstructuredDataDialog());
        await libraryAuthoringPage.selectUnstructuredData(uploadPDF2.replace(/\.[^/.]+$/, ''));
        await adc.waitForCurtainDisappear();
        await since(
            'The second uploaded PDF unstructured data displayed in dataset panel should be #{expected} but is #{actual}'
        )
            .expect(await datasetPanel.isDatasetDisplayed(uploadPDF2.replace(/\.[^/.]+$/, '')))
            .toBe(true);
    });
});
