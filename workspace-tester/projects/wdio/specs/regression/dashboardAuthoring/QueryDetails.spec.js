import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { browserWindow } from '../../../constants/index.js';
import * as gridConstants from '../../../constants/grid.js';

describe('QueryDetails', () => {
    const queryDetails_Report = {
        id: '0DF67A3511E9FFDF58010080EF35EFB4',
        name: 'QueryDetails_Report',
        project: {
            id: 'B628A31F11E7BD953EAE0080EF0583BD',
            name: 'New MicroStrategy Tutorial',
        },
    };
    const queryDetails_InMemory = {
        id: 'A46C96E911E9FFE39B030080EF65D015',
        name: 'QueryDetails_InMemory',
        project: {
            id: 'B628A31F11E7BD953EAE0080EF0583BD',
            name: 'New MicroStrategy Tutorial',
        },
    };
    const queryDetails_LiveConnect = {
        id: 'D861951811E9FFDC58010080EF552EB2',
        name: 'QueryDetails_LiveConnect',
        project: {
            id: 'B628A31F11E7BD953EAE0080EF0583BD',
            name: 'New MicroStrategy Tutorial',
        },
    };
    const queryDetails_DatabaseInMemory = {
        id: 'D2F58E2E11E9FFDF58010080EF552FB4',
        name: 'QueryDetails_DatabaseInMemory',
        project: {
            id: 'B628A31F11E7BD953EAE0080EF0583BD',
            name: 'New MicroStrategy Tutorial',
        },
    };
    const queryDetails_DatabaseLive = {
        id: '11879DFE11EA6A01340D0080EFD5E454',
        name: 'QueryDetails_DatabaseLive',
        project: {
            id: 'B628A31F11E7BD953EAE0080EF0583BD',
            name: 'New MicroStrategy Tutorial',
        },
    };

    let { datasetPanel, datasetsPanel, libraryPage, loginPage, dossierCreator, dossierAuthoringPage, vizPanelForGrid } =
        browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(gridConstants.gridUser);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
        await libraryPage.handleError();
    });

    it('[TC19981] Query Details - DI cube', async () => {
        await dossierCreator.createNewDossier();
        await dossierCreator.clickCreateButton();
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await datasetsPanel.clickNewDataBtnUntilShowDataSource();
        await datasetsPanel.importDataFromURL(
            'http://mirror.microstrategy.com/datahub/samples/Worldwide-CO2-Emissions.xls'
        );
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await datasetPanel.addObjectToVizByDoubleClick('Country', 'attribute', 'Worldwide-CO2-Emissions.xls');
        await datasetPanel.addObjectToVizByDoubleClick('Population (m)', 'metric', 'Worldwide-CO2-Emissions.xls');
        await vizPanelForGrid.openContextMenu('Visualization 1');
        await vizPanelForGrid.selectContextMenuOption('Query Details...');
        await dossierAuthoringPage.waitForElementVisible(dossierAuthoringPage.QueryDetailsContent);
        //Then The Query Details window is displayed
        await since(`The Query Details content should be displayed`)
            .expect(await dossierAuthoringPage.QueryDetailsContent.isDisplayed())
            .toBe(true);
        //When I click the Copy to Clipboard button
        await dossierAuthoringPage.copyQueryDetails();
        // The copy success toaster and icon are displayed
        await dossierAuthoringPage.waitForElementVisible(dossierAuthoringPage.SuccessIcon);
        await since(`The Query Details copied success icon should be displayed`)
            .expect(await dossierAuthoringPage.SuccessIcon.isDisplayed())
            .toBe(true);
        await since(`The Query Details copied success toaster should be displayed`)
            .expect(await dossierAuthoringPage.ToasterLabel.isDisplayed())
            .toBe(true);
        // Then The Query Details content should contain "Number of Rows Returned: 224"
        await since(`The Query Details content should contain "Number of Rows Returned: 224"`)
            .expect(await dossierAuthoringPage.QueryDetailsContent.getText())
            .toContain('Number of Rows Returned: 224');
        await dossierAuthoringPage.closeQueryDetail();
    });

    it('[TC60086_1] Query Details --  Report', async () => {
        // Blank Viz
        await libraryPage.editDossierByUrl({
            projectId: queryDetails_Report.project.id,
            dossierId: queryDetails_Report.id,
        });
        await vizPanelForGrid.openContextMenu('Blank Viz');
        await vizPanelForGrid.selectContextMenuOption('Query Details...');
        await dossierAuthoringPage.waitForElementVisible(dossierAuthoringPage.QueryDetailsContent);
        //Then The Query Details window is displayed
        await since(`The Query Details content should be displayed`)
            .expect(await dossierAuthoringPage.QueryDetailsContent.isDisplayed())
            .toBe(true);
        await since(`The Query Details content should contain "Number of Rows Returned: 1"`)
            .expect(await dossierAuthoringPage.QueryDetailsContent.getText())
            .toContain('Number of Rows Returned: 1');
        await since(`The Query Details content should contain "Report_01_Simple"`)
            .expect(await dossierAuthoringPage.QueryDetailsContent.getText())
            .toContain('Report_01_Simple');
        await dossierAuthoringPage.closeQueryDetail();
        // Filter excludes all data
        await vizPanelForGrid.openContextMenu('Filter excludes all data');
        await vizPanelForGrid.selectContextMenuOption('Query Details...');
        await dossierAuthoringPage.waitForElementVisible(dossierAuthoringPage.QueryDetailsContent);
        //Then The Query Details window is displayed
        await since(`The Query Details content should display`)
            .expect(await dossierAuthoringPage.QueryDetailsContent.isDisplayed())
            .toBe(true);
        await since(`The Query Details content should contain "Number of Rows Returned: 0"`)
            .expect(await dossierAuthoringPage.QueryDetailsContent.getText())
            .toContain('Number of Rows Returned: 0');
        await since(`The Query Details content should contain "select [Country]@[COUNTRY_ID],"`)
            .expect(await dossierAuthoringPage.QueryDetailsContent.getText())
            .toContain('select [Country]@[COUNTRY_ID],');
        await since(`The Query Details content should contain "sum([[F_MAIN_INDEX].Profit])@{[Country]} as [Profit]"`)
            .expect(await dossierAuthoringPage.QueryDetailsContent.getText())
            .toContain('sum([[F_MAIN_INDEX].Profit])@{[Country]} as [Profit]');
        await dossierAuthoringPage.closeQueryDetail();
    });

    it('[TC60086_2] Query Details --  Existing Objects - InMemory', async () => {
        await libraryPage.editDossierByUrl({
            projectId: queryDetails_InMemory.project.id,
            dossierId: queryDetails_InMemory.id,
        });
        await vizPanelForGrid.openContextMenu('Visualization 1');
        await vizPanelForGrid.selectContextMenuOption('Query Details...');
        await dossierAuthoringPage.waitForElementVisible(dossierAuthoringPage.QueryDetailsContent);
        //Then The Query Details window is displayed
        await since(`The Query Details content should be displayed`)
            .expect(await dossierAuthoringPage.QueryDetailsContent.isDisplayed())
            .toBe(true);
        await since(`The Query Details content should contain "Number of Rows Returned: 6"`)
            .expect(await dossierAuthoringPage.QueryDetailsContent.getText())
            .toContain('Number of Rows Returned: 6');
        await since(`The Query Details content should contain "[Country]@[COUNTRY_NAME],"`)
            .expect(await dossierAuthoringPage.QueryDetailsContent.getText())
            .toContain('[Country]@[COUNTRY_NAME],');
        await since(`The Query Details content should contain "sum([[F_MAIN_INDEX].Cost])@{[Country],[Year]} as [Cost]"`)
            .expect(await dossierAuthoringPage.QueryDetailsContent.getText())
            .toContain('sum([[F_MAIN_INDEX].Cost])@{[Country],[Year]} as [Cost]');
        await dossierAuthoringPage.closeQueryDetail();
    });

    it('[TC60086_3] Query Details --  Existing Objects - Live', async () => {
        await libraryPage.editDossierByUrl({
            projectId: queryDetails_LiveConnect.project.id,
            dossierId: queryDetails_LiveConnect.id,
        });
        await vizPanelForGrid.openContextMenu('Visualization 1');
        await vizPanelForGrid.selectContextMenuOption('Query Details...');
        await dossierAuthoringPage.waitForElementVisible(dossierAuthoringPage.QueryDetailsContent);
        //Then The Query Details window is displayed
        await since(`The Query Details content should be displayed`)
            .expect(await dossierAuthoringPage.QueryDetailsContent.isDisplayed())
            .toBe(true);
        await since(`The Query Details content should contain "Number of Rows Returned: 6"`)
            .expect(await dossierAuthoringPage.QueryDetailsContent.getText())
            .toContain('Number of Rows Returned: 6');
        await since(`The Query Details content should contain "Number of Columns Returned: 4"`)
            .expect(await dossierAuthoringPage.QueryDetailsContent.getText())
            .toContain('Number of Columns Returned: 4');
        await since(`The Query Details content should contain "Number of Temp Tables: 0"`)
            .expect(await dossierAuthoringPage.QueryDetailsContent.getText())
            .toContain('Number of Temp Tables: 0');
        await since(`The Query Details content should contain "Total Number of Passes: 2"`)
            .expect(await dossierAuthoringPage.QueryDetailsContent.getText())
            .toContain('Total Number of Passes: 2');
        await since(`The Query Details content should contain "Number of Datasource Query Passes: 2"`)
            .expect(await dossierAuthoringPage.QueryDetailsContent.getText())
            .toContain('Number of Datasource Query Passes: 2');
        await since(`The Query Details content should contain "Number of Analytical Query Passes: 0"`)
            .expect(await dossierAuthoringPage.QueryDetailsContent.getText())
            .toContain('Number of Analytical Query Passes: 0');
        await since(`The Query Details content should contain "DB User: Data"`)
            .expect(await dossierAuthoringPage.QueryDetailsContent.getText())
            .toContain('DB User: Data');
        await since(`The Query Details content should contain "DB Instance: Tutorial MySQL"`)
            .expect(await dossierAuthoringPage.QueryDetailsContent.getText())
            .toContain('DB Instance: Tutorial MySQL');
        await dossierAuthoringPage.closeQueryDetail();
    });

    it('[TC60086_4] Query Details --  DatabaseInMemory', async () => {
        await libraryPage.editDossierByUrl({
            projectId: queryDetails_DatabaseInMemory.project.id,
            dossierId: queryDetails_DatabaseInMemory.id,
        });
        await vizPanelForGrid.openContextMenu('Visualization 1');
        await vizPanelForGrid.selectContextMenuOption('Query Details...');
        await dossierAuthoringPage.waitForElementVisible(dossierAuthoringPage.QueryDetailsContent);
        //Then The Query Details window is displayed
        await since(`The Query Details content should display`)
            .expect(await dossierAuthoringPage.QueryDetailsContent.isDisplayed())
            .toBe(true);
        await since(`The Query Details content should contain "Number of Rows Returned: 40000"`)
            .expect(await dossierAuthoringPage.QueryDetailsContent.getText())
            .toContain('Number of Rows Returned: 40000');
        await since(`The Query Details content should contain "sum([Table10000.Tot Cost])@{[Customer Id],[Category Id]} as [Tot Cost]"`)
            .expect(await dossierAuthoringPage.QueryDetailsContent.getText())
            .toContain('sum([Table10000.Tot Cost])@{[Customer Id],[Category Id]} as [Tot Cost]');
        await dossierAuthoringPage.closeQueryDetail();
    });

    it('[TC60086_5] Query Details --  DatabaseLive', async () => {
        await libraryPage.editDossierByUrl({
            projectId: queryDetails_DatabaseLive.project.id,
            dossierId: queryDetails_DatabaseLive.id,
        });
        await vizPanelForGrid.openContextMenu('Visualization 1');
        await vizPanelForGrid.selectContextMenuOption('Query Details...');
        await dossierAuthoringPage.waitForElementVisible(dossierAuthoringPage.QueryDetailsContent);
        //Then The Query Details window is displayed
        await since(`The Query Details content should display`)
            .expect(await dossierAuthoringPage.QueryDetailsContent.isDisplayed())
            .toBe(true);
        await since(`The Query Details content should contain "Number of Rows Returned: 40000"`)
            .expect(await dossierAuthoringPage.QueryDetailsContent.getText())
            .toContain('Number of Rows Returned: 40000');
        await since(`The Query Details content should contain "Total Number of Passes: 2"`)
            .expect(await dossierAuthoringPage.QueryDetailsContent.getText())
            .toContain('Total Number of Passes: 2');
        await since(`The Query Details content should contain "Number of Datasource Query Passes: 2"`)
            .expect(await dossierAuthoringPage.QueryDetailsContent.getText())
            .toContain('Number of Datasource Query Passes: 2');
        await since(`The Query Details content should contain "Number of Analytical Query Passes: 0"`)
            .expect(await dossierAuthoringPage.QueryDetailsContent.getText())
            .toContain('Number of Analytical Query Passes: 0');
        await since(`The Query Details content should contain "DB User: TUTORIAL_WH.login"`)
            .expect(await dossierAuthoringPage.QueryDetailsContent.getText())
            .toContain('DB User: TUTORIAL_WH.login');
        await since(`The Query Details content should contain "DB Instance: TUTORIAL_WH"`)
            .expect(await dossierAuthoringPage.QueryDetailsContent.getText())
            .toContain('DB Instance: TUTORIAL_WH');
        await since(`The Query Details content should contain "Tables Accessed:"`)
            .expect(await dossierAuthoringPage.QueryDetailsContent.getText())
            .toContain('Tables Accessed:');
        await since(`The Query Details content should contain "Build Query"`)
            .expect(await dossierAuthoringPage.QueryDetailsContent.getText())
            .toContain('Build Query');
        await since(`The Query Details content should contain "Build Query (2)"`)
            .expect(await dossierAuthoringPage.QueryDetailsContent.getText())
            .toContain('Build Query (2)');
        await dossierAuthoringPage.closeQueryDetail();
    });
});
