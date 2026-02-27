import { customCredentials, browserWindow } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import copyObjects from '../../../api/folderManagement/copyObjects.js';
import deleteObjectByNames from '../../../api/folderManagement/deleteObjectByNames.js';
import getObjectID from '../../../api/folderManagement/getObjectID.js';
import InCanvasSelector from '../../../pageObjects/selector/InCanvasSelector.js';

const specConfiguration = { ...customCredentials('_authoring') };

describe('E2E test for Object Parameter', () => {
    const { credentials } = specConfiguration;

    const project = {
        id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
        name: 'MicroStrategy Tutorial',
    };

    const dossier = {
        id: '7F0518644A5B29E29BE829B36AF2A220',
        name: '(Auto) ObjectParameterConsumption',
        project: project,
    };

    let {
        loginPage,
        libraryPage,
        datasetsPanel,
        datasetDialog,
        parameterEditor,
        libraryAuthoringPage,
        dossierAuthoringPage,
        rsdGrid,
        rsdPage,
        grid,
        filterPanel,
        radiobuttonFilter,
        checkboxFilter,
        filterSummaryBar,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);
        await setWindowSize(browserWindow);
    });

    beforeAll(async () => {
        await deleteObjectByNames({
            credentials: credentials,
            projectId: project.id,
            parentFolderId: '6958D8B44A1BB79DDB17F0AFD9563278',
            names: ['(Auto) Object Parameter'],
        });
        await copyObjects({
            credentials: credentials,
            objectList: [
                {
                    type: 55,
                    id: '42A881F143786DE91535FB9797D11D92',
                    projectId: project.id,
                    newName: '(Auto) Object Parameter',
                    targetFolderID: '6958D8B44A1BB79DDB17F0AFD9563278',
                },
            ],
        });
        const objectID = await getObjectID({
            credentials: credentials,
            parentFolderId: '6958D8B44A1BB79DDB17F0AFD9563278',
            name: '(Auto) Object Parameter',
            projectId: project.id,
        });
        console.log('objectID:', objectID);
        const pageKey = 'K53--K46';
        await libraryPage.editDossierWithPageKeyByUrl({
            projectId: project.id,
            dossierId: objectID,
            pageKey: pageKey,
        });
    });

    afterEach(async () => {});

    it('[TC98982_01] Verify E2E workflow of object parameter - Authoring', async () => {
        await datasetsPanel.executeScript('dossierConfig.features.objectParameter = { "enabled": true }');
        await datasetsPanel.clickCreateObjectsBtn('New Dataset 1');
        await datasetsPanel.clickMenuOptions({ firstOption: 'Parameter', secondOption: 'Object' });
        await parameterEditor.createReportObjectParameter({
            name: 'Dataset Object Parameter',
            description: 'This is a report Dataset Object Parameter',
            object: [{ type: 'Attributes', folder: 'Products', item: ['Category', 'Item'] }],
        });
        await datasetDialog.clickUpdateDatasetBtn();
        await dossierAuthoringPage.addParameterToFilterPanel('Dataset Object Parameter');
        const datasetOP = rsdPage.findSelectorByName('Dataset Object Parameter');
        await datasetOP.checkbox.selectItemByText('Category');
        await dossierAuthoringPage.addDatasetElementToDropzone('Dataset Object Parameter', 'Rows');
        await libraryAuthoringPage.simpleSaveDashboard();

        await datasetsPanel.clickCreateObjectsBtn('Dashboard Parameters');
        await datasetsPanel.clickMenuOptions({ firstOption: 'Object' });
        await parameterEditor.createDashboardObjectParameter({
            name: 'Dashboard Object Parameter',
            description: 'This is a dashboard Metric Object Parameter',
            objectList: ['Cost', 'Profit'],
        });
        await dossierAuthoringPage.addDatasetElementToDropzone('Dashboard Object Parameter', 'Metrics');
        await dossierAuthoringPage.addParameterToParameterSelector('Dashboard Object Parameter', 1);
        const dashboardOP = rsdPage.findSelectorByKey('W8679B05F9A1E4B72910D841C8E3048EA');
        await dashboardOP.checkbox.selectItemByText('Cost');
        await libraryAuthoringPage.simpleSaveDashboard();

        const grid1 = rsdGrid.getRsdGridByKey('WE14B8F57F5F64E4A89D60E6B36C3EC77');
        await since('First Row in Grid should be #{expected}, instead we have #{actual}')
            .expect(await grid1.getOneRowData(1))
            .toEqual(['Category', 'Cost']);
    });

    it('[TC98982_02] Verify E2E workflow of object parameter - Consumption', async () => {
        const url = new URL(`app/${project.id}/${dossier.id}`, browser.options.baseUrl);
        // ics + dashboard level object parameter
        await libraryPage.openDossierByUrl(url.toString());
        const dashboardAttribute = InCanvasSelector.createByTitle('DashboardAttribute');
        await dashboardAttribute.selectItem('Quarter');
        await since('Select item, item selected should be #{expected}, while we get #{actual}')
            .expect(await dashboardAttribute.isItemSelected('Quarter'))
            .toBe(true);

        const dashboardMetric = InCanvasSelector.createByTitle('DashboardMetric');
        await dashboardMetric.selectItem('Profit');
        await since('Select item, item selected should be #{expected}, while we get #{actual}')
            .expect(await dashboardMetric.isItemSelected('Profit'))
            .toBe(true);
        await since('First Row in Grid should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 1))
            .toEqual(['Year', 'Quarter', 'Cost', 'Profit']);

        // filter + dataset level object parameter
        await filterPanel.openFilterPanel();
        await radiobuttonFilter.openSecondaryPanel('DatasetAttribute');
        await radiobuttonFilter.selectElementByName('Category');
        await checkboxFilter.openSecondaryPanel('DatasetMetric');
        await checkboxFilter.selectElementByName('Unit Cost');
        await checkboxFilter.selectElementByName('Units Sold');
        await filterPanel.apply();
        await since('First Row in Grid should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 1))
            .toEqual(['Year', 'Category', 'Quarter', 'Cost', 'Unit Cost', 'Units Sold', 'Profit']);
        await since('Filter Summary should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('DatasetAttribute'))
            .toEqual('(Category)');
        await since('Filter Summary should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('DatasetMetric'))
            .toEqual('(Unit Cost, Units Sold)');
    });
});

export const config = specConfiguration;
