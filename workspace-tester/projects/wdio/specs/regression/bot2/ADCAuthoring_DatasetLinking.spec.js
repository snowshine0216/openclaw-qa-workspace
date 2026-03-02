import { browserWindow } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import * as bot from '../../../constants/bot2.js';
import { infoLog } from '../../../config/consoleFormat.js';

// npm run regression -- --spec=specs/regression/bot2/ADCAuthoring_DatasetLinking.spec.js --baseUrl=https://tec-l-1280162.labs.microstrategy.com/MicroStrategyLibrary/
describe('Bot 2.0 Dataset linking in ADC', () => {
    const { 
        loginPage, 
        libraryPage, 
        libraryAuthoringPage,
        aibotDatasetPanel,
        botAuthoring, 
        adc,
        datasetPanel,
        baseContainer,
        dossierMojo,
        dossierAuthoringPage,
        linkAttributes,
    } = browsers.pageObj1;

    const project = {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    };

    const aibot = {
        id: '6B3CBB7AC4444B89BB6663F698E94E61',
        name: 'AUTO_2Datasets_autoLinked',
        project: project
    };

    const retail_mtdi = {
        id: 'D6885DFA8E4049C79A05D59CC6CE7BEB',
        name: 'AUTO_Retail_MTDI',
        project: project
    };

    const airline_mtdi = {
        id: '7FF232885D410AFA716FFCA025C1C961',
        name: 'AUTO_Airline_MTDI (Year map)',
        project: project
    };

    const product_olap = {
        id: '1DC91C155B4B64B29627BEA792B7BFA9',
        name: 'AUTO_Product_OLAP',
        project: project
    };

    const product_subset = {
        id: '511B02D47044C164EFDC00A625307D8E',
        name: 'AUTO_Product_SubsetReport',
        project: project
    };

    const auto_subset = {
        id: 'B9EB6C575A470413CA5DFFABE445B41C',
        name: 'AUTO_SubsetReport',
        project: project
    };

    const officeSales_MTDI = {
        id: 'E7C3F77193445DF14AFD7091F527AA2C',
        name: 'AUTO_OfficeSales_MTDI',
        project: project
    };

    const officeForecase_MTDI = {
        id: '3EF5353D40481628D9A6CCA8D9E2EF0A',
        name: 'AUTO_OfficeForecast_MTDI',
        project: project
    };

    const adc_warning = 'Some datasets in this AI Data Collection (ADC) are not linked to the rest.'

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(bot.botUser2);
        await libraryPage.waitForLibraryLoading();
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC99122_1] Case 1: MTDI manual link', async () => {
        infoLog('Create a new ADC with 2 MTDI datasets');
        await libraryAuthoringPage.clickNewDossierIcon();
        await since('The create ADC option present should be #{expected}, instead we have #{actual}')
            .expect(await libraryAuthoringPage.isCreateADCOptionPresent())
            .toBe(true);
        await libraryAuthoringPage.clickNewADCButton();
        await libraryAuthoringPage.selectProjectAndDataset(project.name, retail_mtdi.name);
        await datasetPanel.selectFromDatasetsPanelContextMenu('Add Data');
        await baseContainer.selectSecondaryContextMenuOption('Existing Dataset...');
        await adc.selectDatasetAddReplace(airline_mtdi.name);
        await since(`The dataset panel should display dataset "${airline_mtdi.name}", is #{expected}, but found: #{actual}`)
            .expect(await datasetPanel.isDatasetDisplayed(airline_mtdi.name))
            .toBe(true);
        await since(`The dataset panel should display dataset "${retail_mtdi.name}", is #{expected}, but found: #{actual}`)
            .expect(await datasetPanel.isDatasetDisplayed(retail_mtdi.name))
            .toBe(true);
        
        infoLog('Unable to save the ADC when 2 datasets are not linked');
        await adc.clickSaveBtn();
        infoLog('Verify alert pop up window');
        await since('Alert pop up window display should be #{expected} but is #{actual}')
            .expect(await ((await dossierMojo.ErrorPopUp).isDisplayed()))
            .toBe(true);
        await since('The datasets not linked warning message is displayed, should be #{expected} but is #{actual}')
            .expect(await dossierMojo.isAlertMessageDisplayed(adc_warning))
            .toBe(true);
        await dossierMojo.clickBtnOnMojoEditor("OK");

        infoLog('Manual link 2 datasets');
        await linkAttributes.linkToOtherDataset(retail_mtdi.name, "Month", "Month")
        await since(`The dataset panel should display linked attribute "Month" in dataset "${airline_mtdi.name}", is #{expected}, but found: #{actual}`)
            .expect(await datasetPanel.isLinkedObjectDSdisplayed("Month", airline_mtdi.name))
            .toBe(true);
        await since(`The dataset panel should display linked attribute "Month" in dataset "${retail_mtdi.name}", is #{expected}, but found: #{actual}`)
            .expect(await datasetPanel.isLinkedObjectDSdisplayed("Month", retail_mtdi.name))
            .toBe(true);

        infoLog('Save the ADC and verfiy ADC name');
        await adc.saveToPath("TC99122_1", ['Bot2.0']);
        await since('After save the ADC, the current title is #{expected}, but found: #{actual}')
            .expect(await dossierAuthoringPage.getDossierCurrentName())
            .toBe('TC99122_1');
    });

    it('[TC99122_2] Case 2: Auto Link with MTDI, OLAP, Subset', async () => {
        infoLog('Open existing bot and go to ADC page');
        await libraryPage.editBotByUrl({ projectId:project.id, botId:aibot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await aibotDatasetPanel.clickUpdateDatasetButton();
        await since('Update dataset from Bot, ADC page present should be #{expected}, instead we have #{actual}')
            .expect(await adc.isADCToolbarPresent())
            .toBe(true);

        infoLog('Verify the MTDI and OLAP datasets are auto linked');
        await since(`The dataset panel should display linked attribute "Year" in dataset "${airline_mtdi.name}", is #{expected}, but found: #{actual}`)
            .expect(await datasetPanel.isLinkedObjectDSdisplayed("Year", airline_mtdi.name))
            .toBe(true);
        await since(`The dataset panel should display linked attribute "Year" in dataset "${product_olap.name}", is #{expected}, but found: #{actual}`)
            .expect(await datasetPanel.isLinkedObjectDSdisplayed("Year", product_olap.name))
            .toBe(true);
        
        infoLog('Add a subset report without auto link');
        await datasetPanel.selectFromDatasetsPanelContextMenu('Add Data');
        await baseContainer.selectSecondaryContextMenuOption('Existing Dataset...');
        await adc.selectDatasetAddReplace("AUTO_SubsetReport");
        await since(`The dataset panel should display dataset "${auto_subset.name}", is #{expected}, but found: #{actual}`)
            .expect(await datasetPanel.isDatasetDisplayed(auto_subset.name))
            .toBe(true);
        
        infoLog('Unable to save');
        await adc.clickSaveAsBtn();
        await since('Alert pop up window display should be #{expected} but is #{actual}')
            .expect(await ((await dossierMojo.ErrorPopUp).isDisplayed()))
            .toBe(true);
        await since('The datasets not linked warning message is displayed, should be #{expected} but is #{actual}')
            .expect(await dossierMojo.isAlertMessageDisplayed(adc_warning))
            .toBe(true);
        await dossierMojo.clickBtnOnMojoEditor("OK");

        infoLog('Replace another subset report and verify auto linking');
        await datasetPanel.chooseDatasetContextMenuOption(auto_subset.name, "Replace Dataset With -> Existing Dataset...");
        await adc.selectDatasetAddReplace(product_subset.name);
        await dossierMojo.clickBtnOnMojoEditor("OK");
        await since(`The dataset panel should display dataset "${product_subset.name}", is #{expected}, but found: #{actual}`)
            .expect(await datasetPanel.isDatasetDisplayed(product_subset.name))
            .toBe(true);
        await since(`The dataset panel should display linked attribute "Year" in dataset "${product_olap.name}", is #{expected}, but found: #{actual}`)
            .expect(await datasetPanel.isLinkedObjectDSdisplayed("Year", product_olap.name))
            .toBe(true);
        await since(`The dataset panel should display linked attribute "Category" in dataset "${product_olap.name}", is #{expected}, but found: #{actual}`)
            .expect(await datasetPanel.isLinkedObjectDSdisplayed("Category", product_olap.name))
            .toBe(true);
        await since(`The dataset panel should display linked attribute "Subcategory" in dataset "${product_olap.name}", is #{expected}, but found: #{actual}`)
            .expect(await datasetPanel.isLinkedObjectDSdisplayed("Subcategory", product_olap.name))
            .toBe(true);
        await since(`The dataset panel should display linked attribute "Year" in dataset "${product_subset.name}", is #{expected}, but found: #{actual}`)
            .expect(await datasetPanel.isLinkedObjectDSdisplayed("Year", product_subset.name))
            .toBe(true);
        await since(`The dataset panel should display linked attribute "Category" in dataset "${product_subset.name}", is #{expected}, but found: #{actual}`)
            .expect(await datasetPanel.isLinkedObjectDSdisplayed("Category", product_subset.name))
            .toBe(true);
        await since(`The dataset panel should display linked attribute "Subcategory" in dataset "${product_subset.name}", is #{expected}, but found: #{actual}`)
            .expect(await datasetPanel.isLinkedObjectDSdisplayed("Subcategory", product_subset.name))
            .toBe(true);

        infoLog('Save as the adc')
        await adc.saveAsADC("TC99122_2");
    });

    it('[TC99122_3] Case 3: Auto and manaul Link with MTDI, OLAP, Subset', async () => {
        infoLog('Open existing bot and go to ADC page');
        await libraryPage.editBotByUrl({ projectId:project.id, botId:aibot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await aibotDatasetPanel.clickUpdateDatasetButton();
        await since('Update dataset from Bot, ADC page present should be #{expected}, instead we have #{actual}')
            .expect(await adc.isADCToolbarPresent())
            .toBe(true);

        infoLog('Add a subset report with auto link');
        await datasetPanel.selectFromDatasetsPanelContextMenu('Add Data');
        await baseContainer.selectSecondaryContextMenuOption('Existing Dataset...');
        await adc.selectDatasetAddReplace(product_subset.name);
        await since(`The dataset panel should display dataset "${product_subset.name}", is #{expected}, but found: #{actual}`)
            .expect(await datasetPanel.isDatasetDisplayed(product_subset.name))
            .toBe(true);

        await since(`The dataset panel should display linked attribute "Category" in dataset "${product_olap.name}", is #{expected}, but found: #{actual}`)
            .expect(await datasetPanel.isLinkedObjectDSdisplayed("Category", product_olap.name))
            .toBe(true);
        await since(`The dataset panel should display linked attribute "Category" in dataset "${product_subset.name}", is #{expected}, but found: #{actual}`)
            .expect(await datasetPanel.isLinkedObjectDSdisplayed("Category", product_subset.name))
            .toBe(true);
        await since(`The dataset panel should display linked attribute "Subcategory" in dataset "${product_olap.name}", is #{expected}, but found: #{actual}`)
            .expect(await datasetPanel.isLinkedObjectDSdisplayed("Subcategory", product_olap.name))
            .toBe(true);
        await since(`The dataset panel should display linked attribute "Subcategory" in dataset "${product_subset.name}", is #{expected}, but found: #{actual}`)
            .expect(await datasetPanel.isLinkedObjectDSdisplayed("Subcategory", product_subset.name))
            .toBe(true);
        await since(`The dataset panel should display linked attribute "Year" in dataset "${product_olap.name}", is #{expected}, but found: #{actual}`)
            .expect(await datasetPanel.isLinkedObjectDSdisplayed("Year", product_olap.name))
            .toBe(true);
        await since(`The dataset panel should display linked attribute "Year" in dataset "${product_subset.name}", is #{expected}, but found: #{actual}`)
            .expect(await datasetPanel.isLinkedObjectDSdisplayed("Year", product_subset.name))
            .toBe(true);

        infoLog('Add a MTDI dataset, verify unable to save');
        await datasetPanel.selectFromDatasetsPanelContextMenu('Add Data');
        await baseContainer.selectSecondaryContextMenuOption('Existing Dataset...');
        await adc.selectDatasetAddReplace(retail_mtdi.name);
        await since(`The dataset panel should display dataset "${retail_mtdi.name}", is #{expected}, but found: #{actual}`)
            .expect(await datasetPanel.isDatasetDisplayed(retail_mtdi.name))
            .toBe(true);
        await adc.clickSaveAsBtn();
        await since('Alert pop up window display should be #{expected} but is #{actual}')
            .expect(await ((await dossierMojo.ErrorPopUp).isDisplayed()))
            .toBe(true);
        await since('The datasets not linked warning message is displayed, should be #{expected} but is #{actual}')
            .expect(await dossierMojo.isAlertMessageDisplayed(adc_warning))
            .toBe(true);
        await dossierMojo.clickBtnOnMojoEditor("OK");

        infoLog('Manaul link the retail MTDI dataset');
        await linkAttributes.linkToOtherDataset(retail_mtdi.name, "Month", "Month")
        await since(`The dataset panel should display linked attribute "Month" in dataset "${airline_mtdi.name}", is #{expected}, but found: #{actual}`)
            .expect(await datasetPanel.isLinkedObjectDSdisplayed("Month", airline_mtdi.name))
            .toBe(true);
        await since(`The dataset panel should display linked attribute "Month" in dataset "${retail_mtdi.name}", is #{expected}, but found: #{actual}`)
            .expect(await datasetPanel.isLinkedObjectDSdisplayed("Month", retail_mtdi.name))
            .toBe(true);

        infoLog('Save as the adc')
        await adc.saveAsADC("TC99122_3");
    });

    it('[TC99122_4] Case 4: The datasets are linked but not all of them are fully interconnected', async () => {
        infoLog('Open existing bot and go to ADC page');
        await libraryPage.editBotByUrl({ projectId:project.id, botId:aibot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await aibotDatasetPanel.clickUpdateDatasetButton();
        await since('Update dataset from Bot, ADC page present should be #{expected}, instead we have #{actual}')
            .expect(await adc.isADCToolbarPresent())
            .toBe(true);

        infoLog('Add 2 office MTDI datasets');
        await datasetPanel.selectFromDatasetsPanelContextMenu('Add Data');
        await baseContainer.selectSecondaryContextMenuOption('Existing Dataset...');
        await adc.selectDatasetAddReplace(officeSales_MTDI.name);
        await datasetPanel.selectFromDatasetsPanelContextMenu('Add Data');
        await baseContainer.selectSecondaryContextMenuOption('Existing Dataset...');
        await adc.selectDatasetAddReplace(officeForecase_MTDI.name);
        await since(`The dataset panel should display dataset "${officeForecase_MTDI.name}", is #{expected}, but found: #{actual}`)
            .expect(await datasetPanel.isDatasetDisplayed(officeForecase_MTDI.name))
            .toBe(true);
        await since(`The dataset panel should display dataset "${officeSales_MTDI.name}", is #{expected}, but found: #{actual}`)
            .expect(await datasetPanel.isDatasetDisplayed(officeSales_MTDI.name))
            .toBe(true);

        infoLog('Manual link MTDI datasets via Account');
        await linkAttributes.linkToOtherDataset(officeSales_MTDI.name, "Account", "Account")
        await since(`The dataset panel should display linked attribute "Account" in dataset "${officeSales_MTDI.name}", is #{expected}, but found: #{actual}`)
            .expect(await datasetPanel.isLinkedObjectDSdisplayed("Account", officeSales_MTDI.name))
            .toBe(true);
        await since(`The dataset panel should display linked attribute "Account" in dataset "${officeForecase_MTDI.name}", is #{expected}, but found: #{actual}`)
            .expect(await datasetPanel.isLinkedObjectDSdisplayed("Account", officeForecase_MTDI.name))
            .toBe(true);

        infoLog('Verify unable to save the ADC');
        // airline_mtdi is linked to product_olap, officeSales is linked to officeForecaset, but 4 datasets are not linked together
        await adc.clickSaveAsBtn();
        await since('Alert pop up window display should be #{expected} but is #{actual}')
            .expect(await ((await dossierMojo.ErrorPopUp).isDisplayed()))
            .toBe(true);
        await since('The datasets not linked warning message is displayed, should be #{expected} but is #{actual}')
            .expect(await dossierMojo.isAlertMessageDisplayed(adc_warning))
            .toBe(true);
        await dossierMojo.clickBtnOnMojoEditor("OK");
    });

});
