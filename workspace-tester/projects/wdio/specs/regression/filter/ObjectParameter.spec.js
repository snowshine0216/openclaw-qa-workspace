import { customCredentials, browserWindow } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import copyObjects from '../../../api/folderManagement/copyObjects.js';
import deleteObjectByNames from '../../../api/folderManagement/deleteObjectByNames.js';
import getObjectID from '../../../api/folderManagement/getObjectID.js';
import InCanvasSelector from '../../../pageObjects/selector/InCanvasSelector.js';
import resetDossierState from '../../../api/resetDossierState.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

const specConfiguration = { ...customCredentials('_authoring') };

describe('Function test for Object Parameter', () => {
    const { credentials } = specConfiguration;

    const dossier = {
        id: 'A28CF78944253BF2C5C985AC0AFC6D51',
        name: '(Auto) URL API Pass OP',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const objectParameterEditor = {
        id: '6A3BE7534554B82CD0F31B80FD3AB0B7',
        name: '(Auto) ObjectParameterEditor',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
        datasetPageKey: 'K53--K46',
        dashboardPageKey: 'K44FEEF5742150CEED7CDC6B5F8533806--KA05DE13A4D62B9EFD72DD2A3B9909B47',
    };

    const dossierConsumption = {
        id: '7F3774464A335876B32BA88380852EF3',
        name: '(Auto) Object Parameter In Consumption',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    let {
        loginPage,
        libraryPage,
        dossierPage,
        toc,
        datasetsPanel,
        parameterEditor,
        datasetDialog,
        dossierAuthoringPage,
        libraryAuthoringPage,
        authoringFilters,
        rsdPage,
        toolbar,
        grid,
        contentsPanel,
        baseContainer,
        baseFormatPanelReact,
        gridAuthoring,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC99357_01] Verify Functionality of Object Parameter Editor - Create Dataset Object Parameter', async () => {
        await libraryPage.editDossierWithPageKeyByUrl({
            projectId: objectParameterEditor.project.id,
            dossierId: objectParameterEditor.id,
            pageKey: objectParameterEditor.datasetPageKey,
        });
        await datasetsPanel.clickCreateObjectsBtn('Products');
        await datasetsPanel.clickMenuOptions({ firstOption: 'Parameter', secondOption: 'Object' });
        await parameterEditor.inputParameterName('CreatedAttributeOP');
        await parameterEditor.clickSelectFromBtn();

        // select button grey out if no objects are picked
        await since('Select button should be #{expected}, instead we have #{actual}')
            .expect(await parameterEditor.isSelectBtnEnabled())
            .toBe(false);
        // select, multi-select
        await parameterEditor.openFolder('Products');
        await parameterEditor.selectItemByText('Category');
        await parameterEditor.selectItemByText(
            'Subcategory Subcategory Subcategory Subcategory Subcategory Subcategory'
        );
        await parameterEditor.multiSelectItem({
            itemFrom: 'Ascending Item',
            itemTo: 'Category yuhe',
        });
        await since('Category Checked should be #{expected}, instead we have #{actual}')
            .expect(await parameterEditor.isItemChecked('Category'))
            .toBe(true);
        // can filter the type in the top
        await parameterEditor.selectObjectType('Metrics');
        await parameterEditor.openFolder('Aging');
        // attribute and metric cannot mix
        await since('Metric Item disabled should be #{expected}, instead we have #{actual}')
            .expect(await parameterEditor.isItemDisabled('AR DRO'))
            .toBe(true);
        await parameterEditor.clickSelectButton();
        const count = await parameterEditor.selectedObjectItemCount();
        await since('ObjectItem Count should be 12 or 13, instead we have #{actual}')
            .expect(count === 12 || count === 13)
            .toBeTrue();
        await parameterEditor.clickParameterEditorButton('Create');
        await datasetDialog.clickUpdateDatasetBtn();
        await authoringFilters.switchToFilterPanel();
        await since('OP exist should be #{expected}, instead we have #{actual}')
            .expect(await datasetsPanel.isAttributeMetricDisplayed('CreatedAttributeOP'))
            .toBe(true);
    });

    it('[TC99357_02] Verify Functionality of Object Parameter Editor - Search', async () => {
        await libraryPage.editDossierWithPageKeyByUrl({
            projectId: objectParameterEditor.project.id,
            dossierId: objectParameterEditor.id,
            pageKey: objectParameterEditor.datasetPageKey,
        });

        await datasetsPanel.clickCreateObjectsBtn('Products');
        await datasetsPanel.clickMenuOptions({ firstOption: 'Parameter', secondOption: 'Object' });
        await parameterEditor.clickSelectFromBtn();
        //no result
        await parameterEditor.searchObject('No Result');
        await since('Empty Tree Node Text should be #{expected}, instead we have #{actual}')
            .expect(await parameterEditor.emptyTreeNodeTextInSearchResult())
            .toBe('No applicable objects.');
        // attribute
        await parameterEditor.searchObject('Category');
        await parameterEditor.selectItemByText('Category');
        await since('Empty Tree Node Text should be #{expected}, instead we have #{actual}')
            .expect(await parameterEditor.itemIcon('Category'))
            .toBe('attribute');
        // custom group
        await parameterEditor.selectObjectType('Public Objects');
        await parameterEditor.searchObject('2015 & 2016');
        await parameterEditor.selectItemByText('2015 & 2016');
        await since('Empty Tree Node Text should be #{expected}, instead we have #{actual}')
            .expect(await parameterEditor.itemIcon('2015 & 2016'))
            .toBe('custom group');
        await parameterEditor.clearSearchInput();
        await parameterEditor.selectObjectType('Metrics');
        await parameterEditor.openFolder('Aging');
        // cannot mix attribute and metric
        await since('Metric Item disabled should be #{expected}, instead we have #{actual}')
            .expect(await parameterEditor.isItemDisabled('AR DRO'))
            .toBe(true);

        // item check status should be kept
        await parameterEditor.selectObjectType('Attributes');
        await parameterEditor.openFolder('Products');
        await since('Category Checked should be #{expected}, instead we have #{actual}')
            .expect(await parameterEditor.isItemChecked('Category'))
            .toBe(true);
        await parameterEditor.clickSelectButton();
        await parameterEditor.clickParameterEditorButton('Cancel');
    });

    it('[TC99357_03] Verify Functionality of Object Parameter Editor - Edit Dataset Object Parameter', async () => {
        await libraryPage.editDossierWithPageKeyByUrl({
            projectId: objectParameterEditor.project.id,
            dossierId: objectParameterEditor.id,
            pageKey: objectParameterEditor.datasetPageKey,
        });
        await datasetsPanel.clickDatasetMenuIcon('Products');
        await datasetsPanel.clickMenuOptions({ firstOption: 'Edit Dataset...' });
        await datasetDialog.editObject('DatasetAttribute');
        await parameterEditor.inputParameterName('EditDatasetAttribute');
        await parameterEditor.inputParameterDescription('This is a Updated Dataset Attribute Object Parameter');
        await parameterEditor.removeSelectedItem('Day');
        await since('After Remove, ObjectItem Count should be #{expected}, instead we have #{actual}')
            .expect(await parameterEditor.selectedObjectItemCount())
            .toBe(3);
        await parameterEditor.clickSelectFromBtn();
        await parameterEditor.selectObjectType('Attributes');
        await parameterEditor.openFolder('Products');
        await parameterEditor.selectItemByText('Brand');
        await parameterEditor.clickSelectButton();
        await parameterEditor.dragAndDropSelectedItem('Brand', 'Year');
        await since('After drag drop, ObjectItem should be #{expected}, instead we have #{actual}')
            .expect(await parameterEditor.selectedObjectItemText())
            .toEqual(['Quarter', 'Brand', 'Year', 'Month']);
        await parameterEditor.clickParameterEditorButton('Save');
        await datasetDialog.clickUpdateDatasetBtn();
        await authoringFilters.switchToFilterPanel();
        await since('DescriptionTooltipText should be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.getDescriptionTooltipText('EditDatasetAttribute'))
            .toBe('This is a Updated Dataset Attribute Object Parameter');
        const dashboardMetricSelector = InCanvasSelector.createByTitle('DatasetAttribute');
        await since('ObjectItem Count should be #{expected}, instead we have #{actual}')
            .expect(await dashboardMetricSelector.getItemsText())
            .toEqual(['Quarter', 'Brand', 'Year', 'Month']);
    });

    it('[TC99357_04] Verify Functionality of Object Parameter Editor - Create Dashboard Object Parameter', async () => {
        await libraryPage.editDossierWithPageKeyByUrl({
            projectId: objectParameterEditor.project.id,
            dossierId: objectParameterEditor.id,
            pageKey: objectParameterEditor.dashboardPageKey,
        });

        await datasetsPanel.clickCreateObjectsBtn('Dashboard Parameters');
        await datasetsPanel.clickMenuOptions({ firstOption: 'Object' });
        await parameterEditor.inputParameterName('CreatedDashboardAttribute');
        await parameterEditor.clickSelectFromBtn();
        // select button grey out if no objects are picked
        await since('Select button should be #{expected}, instead we have #{actual}')
            .expect(await parameterEditor.isSelectBtnEnabled())
            .toBe(false);
        await parameterEditor.selectItemByText('Category');
        await parameterEditor.selectItemByText('Year');
        await since('availableItemCount should be #{expected}, instead we have #{actual}')
            .expect(await parameterEditor.availableItemCountForDashboardOP())
            .toBe(12);
        await since('Metric Item disabled should be #{expected}, instead we have #{actual}')
            .expect(await parameterEditor.isItemDisabled('Cost'))
            .toBe(true);
        await parameterEditor.clickSelectButton();
        await parameterEditor.clickParameterEditorButton('Create');
        await since('OP exist should be #{expected}, instead we have #{actual}')
            .expect(await datasetsPanel.isAttributeMetricDisplayed('CreatedDashboardAttribute'))
            .toBe(true);
    });

    it('[TC99357_05] Verify Functionality of Object Parameter Editor - Edit Dashboard Object Parameter', async () => {
        await libraryPage.editDossierWithPageKeyByUrl({
            projectId: objectParameterEditor.project.id,
            dossierId: objectParameterEditor.id,
            pageKey: objectParameterEditor.dashboardPageKey,
        });

        await datasetsPanel.rightClickAttributeMetric('DashboardMetric');
        await datasetsPanel.clickMenuOptions({ firstOption: 'Edit' });
        await parameterEditor.inputParameterName('EditDashboardMetric');
        await parameterEditor.removeSelectedItem('Cost');
        await parameterEditor.clickSelectFromBtn();
        await parameterEditor.selectObjectType('Attributes');
        await since('availableItemCount should be #{expected}, instead we have #{actual}')
            .expect(await parameterEditor.availableItemCountForDashboardOP())
            .toBe(6);
        await since('Attribute Item disabled should be #{expected}, instead we have #{actual}')
            .expect(await parameterEditor.isItemDisabled('Category'))
            .toBe(true);
        await parameterEditor.selectObjectType('Metrics');
        await parameterEditor.selectItemByText('ProfitMargin');
        await parameterEditor.clickSelectButton();
        await parameterEditor.dragAndDropSelectedItem('ProfitMargin', 'Profit');
        await parameterEditor.clickParameterEditorButton('Save');
        await authoringFilters.switchToFilterPanel();
        const dashboardMetricSelector = InCanvasSelector.createByTitle('DashboardMetric');
        await since('ObjectItem should be #{expected}, instead we have #{actual}')
            .expect(await dashboardMetricSelector.getItemsText('DashboardMetric'))
            .toEqual(['ProfitMargin', 'Profit']);
    });

    it('[TC99162] Verify Functionality of URL API pass Object Parameter', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossier,
        });
        const pageKey = 'K53--K46';
        await libraryPage.editDossierWithPageKeyByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
            pageKey: pageKey,
        });
        await authoringFilters.switchToFilterPanel();
        const radioButtonFilter = rsdPage.findSelectorByName('DatasetAttribute');
        await radioButtonFilter.radiobutton.selectItemByText('Subcategory', false);
        const dropdownFilter = rsdPage.findSelectorByName('DatasetMetric');
        await dropdownFilter.dropdown.clickDropdown();
        await dropdownFilter.dropdown.selectItemByText('Unit Profit', false);
        await dropdownFilter.dropdown.selectItemByText('Revenue', false);
        await dropdownFilter.dropdown.clickOKBtn(false);

        const linkBarICS = InCanvasSelector.createByTitle('DashboardAttribute');
        await linkBarICS.selectItem(['Quarter']);
        const listboxICS = InCanvasSelector.createByTitle('DashboardMetric');
        await listboxICS.selectItem(['Cost']);
        await toolbar.clickURLGeneratorButton();
        await authoringFilters.selectFilterItems([
            'DatasetAttribute',
            'DatasetMetric',
            'DashboardAttribute',
            'DashboardMetric',
        ]);
        await toolbar.clickGenerateLinkButton();
        let urlGenerated = await dossierPage.getClipboardText();
        console.log('urlGenerated:' + urlGenerated);

        // Apply URL
        await browser.url(urlGenerated);
        await dossierPage.waitForDossierLoading();
        await since('First Row in Grid should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Normal Grid', 1))
            .toEqual(['Year', 'Subcategory', 'Quarter', 'Unit Profit', 'Revenue', 'Cost']);

        // unset filter
        await libraryPage.editDossierWithPageKeyByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
            pageKey: pageKey,
        });
        await authoringFilters.switchToFilterPanel();
        await authoringFilters.clickFilterContextMenuOption('DatasetAttribute', ['Reset to Default']);
        await authoringFilters.selectInCanvasContextOption('DashboardMetric', 'Reset to Default');

        await toolbar.clickURLGeneratorButton();
        await authoringFilters.selectFilterItems(['DatasetAttribute', 'DashboardMetric']);
        await toolbar.clickGenerateLinkButton();
        let urlGenerated1 = await dossierPage.getClipboardText();
        console.log('urlGenerated1:' + urlGenerated1);

        // Apply URL
        await browser.url(urlGenerated1);
        await dossierPage.waitForDossierLoading();
        await since('First Row in Grid should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Normal Grid', 1))
            .toEqual(['Year']);
    });

    it('[TC99357_06] With object parameter added to grid, cannot change title and container formattings', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossierConsumption.project.id,
            dossierId: dossierConsumption.id,
        });
        await contentsPanel.goToPage({ chapterName: 'Grid Template', pageName: 'Modern Grid' });
        await baseContainer.clickContainer('Modern Grid - Dataset OP');
        await baseFormatPanelReact.switchSection('Title and Container');
        await baseFormatPanelReact.changeContainerTitleFillColor({ color: '#C1292F' });
        await since('Title bar background should have #{expected} instead we have #{actual}')
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.selectors.getVisualizationTitleBarRoot('Modern Grid - Dataset OP'),
                    'background-color'
                )
            )
            .toBe('rgba(193,41,47,1)');
    });
});
