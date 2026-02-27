import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { botAdModeUser } from '../../../constants/bot.js';
import { checkElementByImageComparison } from '../../../utils/TakeScreenshot.js';

describe('dataset sync up scenarios', () => {
    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1600,
        height: 1200,
    };

    const AdvancedBot = {
        id: '5750AF2876411151E4CE3F808EBE7A64',
        name: 'Admode',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const AdvancedBot2 = {
        id: '02CAB07739406F7C90BBDCB5F4CE2BBF',
        name: 'Admode_rename',
        newName: 'Admode_MODIFIED',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const AdvancedBot3 = {
        id: 'DB975F9B3143E8D6805D60BADC242A77',
        name: 'Admode_DA_DM_NDE',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    let { 
        loginPage, 
        libraryPage, 
        libraryAuthoringPage, 
        botAuthoring, 
        aibotDatasetPanel, 
        toolbar, 
        visualizationPanel, 
        datasetsPanel, 
        dossierAuthoringPage,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(botAdModeUser);
        await browser.execute(() => {
            localStorage.setItem('debugMojo', '1');
        });
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC95826_1] add dataset in advanced mode', async () => {
        await libraryPage.openBotByIdAndWait({ projectId: AdvancedBot.project.id, botId: AdvancedBot.id });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');

        await aibotDatasetPanel.checkOrUncheckData('Category');
        await aibotDatasetPanel.checkOrUncheckData('Month'); 
        // go to advanced mode
        await aibotDatasetPanel.switchToAdvancedMode();
        await dossierAuthoringPage.waitForCurtainDisappear();
        await since('Redo button disabled should be #{expected}, instead we have #{actual}')
        .expect (await toolbar.isButtonDisabled('Redo') )
        .toBe(true);
        await since('Undo button disabled should be #{expected}, instead we have #{actual}')
        .expect (await toolbar.isButtonDisabled('Undo') )
        .toBe(true);
        await since('Refresh button disabled should be #{expected}, instead we have #{actual}')
        .expect (await toolbar.isButtonDisabled('Refresh') )
        .toBe(false);
        await since('Pause button exist should be #{expected}, instead we have #{actual}')
        .expect (await toolbar.getButtonFromToolbar('Pause Data Retrieval').isExisting() )
        .toBe(true);
        await since('viz type should be #{expected}, instead we have #{actual}')
        .expect (await visualizationPanel.getVizTypeNameByTitle('Data Preview 1'))
        .toBe('Grid');

        // open dataset panel menu check if 'Show Hidden Objects' is there
        await dossierAuthoringPage.openMenuByClick(await dossierAuthoringPage.getDatasetPanelMenuBtn());
        await since('hidden object exist in menu should be #{expected}, instead we have #{actual}')
        .expect (await dossierAuthoringPage.isOptionExistInMenu('Show Hidden Objects'))
        .toBe(true);

        // add dataset from toolbar
        await dossierAuthoringPage.actionOnToolbar('Add Data');
        await dossierAuthoringPage.actionOnSubmenu('Existing Dataset...');
        await dossierAuthoringPage.searchDataset('DDACube');
        await since('Exclude DDA cube when importing data should be #{expected}, instead we have #{actual}')
        .expect(await dossierAuthoringPage.isDatasetlistEmpty()).toBe(true);
        await dossierAuthoringPage.searchSelectDataset('Auto_Advanced_normalrpt');
        await dossierAuthoringPage.waitForCurtainDisappear();
        await since('add a normal rpt, dataset count should be #{expected}, instead we have #{actual}')
        .expect (await datasetsPanel.getDatasetCount())
        .toBe(3);
        await since('Undo button disabled should be #{expected}, instead we have #{actual}')
        .expect (await toolbar.isButtonDisabled('Undo') )
        .toBe(false);
        // take screenshot of datset panel
        await checkElementByImageComparison(
            dossierAuthoringPage.getDatasetPanel(),
            'advancedMode/TC95826',
            '2 datasets with linking in advanced mode',
            1
        );
        await dossierAuthoringPage.actionOnToolbar('Apply');
        await aibotDatasetPanel.waitForDataPanelContainerLoading();
        await since('go back to bot edit, the dataset count should be #{expected}, instead we have #{actual}')
        .expect (await aibotDatasetPanel.getDatasetCount())
        .toBe(2);
        // take screenshot
        await checkElementByImageComparison(
            aibotDatasetPanel.getDatasetContainer(),
            'advancedMode/TC95826',
            '2 datasets with linking',
            1
        );

        // add sample data
        await aibotDatasetPanel.switchToAdvancedMode();
        await dossierAuthoringPage.waitForCurtainDisappear();
        await dossierAuthoringPage.actionOnToolbar('Add Data');
        await dossierAuthoringPage.actionOnSubmenu('New Data...');
        await datasetsPanel.clickDataSourceByIndex(5); // Using Sample Files as data source
        await datasetsPanel.importSampleFiles([0]); // The first file in the list 'Airline Sample'

        // switch back
        await dossierAuthoringPage.actionOnToolbar('Apply');
        await aibotDatasetPanel.waitForDataPanelContainerLoading();
        await since('add sample data, the dataset count in bot data panel should be #{expected}, instead we have #{actual}')
        .expect (await aibotDatasetPanel.getDatasetCount()).
        toBe(3);
    });

    it('[TC95826_2] modify dataset name and sort', async () => {
        await libraryPage.editBotByUrl({ projectId: AdvancedBot2.project.id, botId: AdvancedBot2.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        // rename
        await aibotDatasetPanel.clickManipulateButtonDisplayed('Rename');
        await aibotDatasetPanel.setName(AdvancedBot2.newName);
        await since('The dataset name should be #{expected}, instead we have #{actual}')
        .expect(await aibotDatasetPanel.getDatasetNameText())
        .toBe(AdvancedBot2.newName);
        // switch to advanced mode
        await aibotDatasetPanel.switchToAdvancedMode();
        await dossierAuthoringPage.waitForCurtainDisappear();
        await since('Refresh button disabled should be #{expected}, instead we have #{actual}')
        .expect (await toolbar.isButtonDisabled('Refresh') )
        .toBe(false);
        await since('renamed dataset exist should be #{expected}, instead we have #{actual}')
        .expect (await dossierAuthoringPage.getDatasetByName(AdvancedBot2.newName).isExisting())
        .toBe(true);
        const ds1Btn = await dossierAuthoringPage.getDatasetOptionBtn(AdvancedBot2.newName);
        await dossierAuthoringPage.openMenuByClick(ds1Btn);
        await dossierAuthoringPage.actionOnSubmenu('Sort Descending');
        await dossierAuthoringPage.actionOnToolbar('Apply');
        await aibotDatasetPanel.waitForDataPanelContainerLoading();

        // take screenshot
        await checkElementByImageComparison(
            aibotDatasetPanel.getDatasetContainer(),
            'advancedMode/TC95826',
            'datset element sorted descending',
            1
        );
    });

    it('[TC95826_3] modify name of DA DM NDE', async () => {
        await libraryPage.editBotByUrl({ projectId: AdvancedBot3.project.id, botId: AdvancedBot3.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        // rename element
        await aibotDatasetPanel.renameData('Seasons', 'renameconsolidation');
        await aibotDatasetPanel.switchToAdvancedMode();
        await dossierAuthoringPage.waitForCurtainDisappear();
        await since('renamed consolidation displayed should be #{expected}, instead we have #{actual}')
        .expect ( await datasetsPanel.getAttributeMetric('renameconsolidation').isDisplayed() ).toBe(true);
        await dossierAuthoringPage.actionOnToolbar('Cancel');
        await aibotDatasetPanel.renameData('Category(Group)', 'renameNDE');
        await aibotDatasetPanel.switchToAdvancedMode();
        await dossierAuthoringPage.waitForCurtainDisappear();
        await since('renamed NDE displayed should be #{expected}, instead we have #{actual}')
        .expect ( await datasetsPanel.getAttributeMetric('renameNDE').isDisplayed() ).toBe(true);
        await dossierAuthoringPage.actionOnToolbar('Cancel');
        await aibotDatasetPanel.renameData('NAA attribute', 'renameNAA');
        await aibotDatasetPanel.switchToAdvancedMode();
        await dossierAuthoringPage.waitForCurtainDisappear();
        await since('renamed NAA displayed should be #{expected}, instead we have #{actual}')
        .expect ( await datasetsPanel.getAttributeMetric('renameNAA').isDisplayed() ).toBe(true);
        await dossierAuthoringPage.actionOnToolbar('Cancel');
        await aibotDatasetPanel.renameData('Country', 'renameattr');
        await aibotDatasetPanel.switchToAdvancedMode();
        await dossierAuthoringPage.waitForCurtainDisappear();
        await since('renamed attribute displayed should be #{expected}, instead we have #{actual}')
        .expect ( await datasetsPanel.getAttributeMetric('renameattr').isDisplayed() ).toBe(true);
        await dossierAuthoringPage.actionOnToolbar('Cancel');
        await aibotDatasetPanel.renameData('datetype', 'renameDA');
        await aibotDatasetPanel.switchToAdvancedMode();
        await dossierAuthoringPage.waitForCurtainDisappear();
        await since('renamed DA displayed should be #{expected}, instead we have #{actual}')
        .expect ( await datasetsPanel.getAttributeMetric('renameDA').isDisplayed() ).toBe(true);
        await dossierAuthoringPage.actionOnToolbar('Cancel');
        await aibotDatasetPanel.renameData('Avg (Discount)', 'renameDM');
        await aibotDatasetPanel.switchToAdvancedMode();
        await dossierAuthoringPage.waitForCurtainDisappear();
        await since('renamed DM displayed should be #{expected}, instead we have #{actual}')
        .expect ( await datasetsPanel.getAttributeMetric('renameDM').isDisplayed() ).toBe(true);
        await dossierAuthoringPage.actionOnToolbar('Cancel');
    });
});
