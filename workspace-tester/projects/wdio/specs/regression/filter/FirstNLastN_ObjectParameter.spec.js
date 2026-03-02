import { customCredentials, browserWindow } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import InCanvasSelector from '../../../pageObjects/selector/InCanvasSelector.js';
import resetDossierState from '../../../api/resetDossierState.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import republishCube from '../../../api/republishCube.js';

const specConfiguration = { ...customCredentials('_authoring') };

describe('E2E test for Dynamic Object Parameter', () => {
    const { credentials } = specConfiguration;

    const DynamicOPAuthoring = {
        id: '2534168D43CAC72D61CE7D8A0E4EB131',
        name: '(Auto) Dynamic Object Parameter',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
        dashboardPageKey: 'K53--K46',
        //dashboardPageKey: 'K44FEEF5742150CEED7CDC6B5F8533806--KA05DE13A4D62B9EFD72DD2A3B9909B47',
    };

    const dossierConsumption = {
        id: '2C4AF7184B70BCF4021535AE85281111',
        name: '(Auto) Dynamic Object Parameter In Consumption',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
        dashboardPageKey: 'K53--K46',
    };

    const dossierConsumptionCube = {
        id: '83DCF47145EE64468D4EAD83513DEE84',
        name: 'LU_MONTH MNTH_CATEGORY_SLS LU_CATEGORY (3 tables)',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const dossierFUN = {
        id: '042C5D37466174430DD3A8862523D186',
        name: '(Auto) Dynamic Object Parameter FUN',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
        dashboardPageKey: 'K9E2B3456420A6D01D7D496AD2DA24C49--K810AC331418D95B0F09ADA99EB0AF21B',
    };

    let {
        loginPage,
        libraryPage,
        dossierPage,
        checkboxFilter,
        radiobuttonFilter,
        inCanvasSelector_Authoring,
        toc,
        datasetPanel,
        filterElement,
        filterSummaryBar,
        contentsPanel,
        datasetsPanel,
        parameterEditor,
        datasetDialog,
        dossierAuthoringPage,
        authoringFilters,
        toolbar,
        grid,
        filterPanel,
        searchBoxFilter,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);
        await setWindowSize(browserWindow);
        await republishCube({
            credentials: credentials,
            cube: dossierConsumptionCube,
        });
        await resetDossierState({
            credentials: credentials,
            dossier: dossierConsumption,
        });
        await resetDossierState({
            credentials: credentials,
            dossier: dossierFUN,
        });
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC99448_01] Verify E2E workflow of Dashboard Dynamic Object Parameter - Authoring ', async () => {
        await libraryPage.editDossierWithPageKeyByUrl({
            projectId: DynamicOPAuthoring.project.id,
            dossierId: DynamicOPAuthoring.id,
            pageKey: DynamicOPAuthoring.dashboardPageKey,
        });

        //Switch to filter panel
        await authoringFilters.switchToFilterPanel();
        //Define Dynamic Selection for TimeOP to first 1
        await authoringFilters.openFilterContextMenu('TimeOP');
        await authoringFilters.click({ elem: authoringFilters.getFilterContextMenuOption('Dynamic Selection') });
        //Verify the dynamic selection menu is opened
        await takeScreenshotByElement(
            await authoringFilters.getDynamicSelectionMenu(),
            'TC99448_01_01_Filter Panel',
            'Dynamic Selection Menu when the Dynamic Selection is not configured'
        );
        //Click on the Unset to expand the pop up menu
        await authoringFilters.waitForElementClickable(await authoringFilters.getDynamicModeDropdown());
        await authoringFilters.click({ elem: authoringFilters.getDynamicModeDropdown() });

        //Verify the dropdown list of dynamic selection options
        await takeScreenshotByElement(
            await authoringFilters.getDynamicSelectionDropdownList(),
            'TC99448_01_02_Filter Panel',
            'Dynamic Selection Status Pulldown with options'
        );
        //Define First N Objects as 1
        await authoringFilters.click({ elem: authoringFilters.getDynamicModeOption('First N Objects') });
        //Verify the dynamic selection menu displayed Qualify
        await takeScreenshotByElement(
            await authoringFilters.getDynamicSelectionMenu(),
            'TC99448_01_03_Filter Panel',
            'Dynamic Selection Menu when First N Objects is selected'
        );
        await authoringFilters.click({ elem: authoringFilters.getDynamicModeOkButton() });
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        //Verify the filter title is updated with dynamic selection
        await since(
            'TC99448_01_04.Filter title should be updated with dynamic selection for TimeOP, it should be #{expected} instead we have #{actual}'
        )
            .expect(await (await authoringFilters.getFilterLabelName('TimeOP')).getText())
            .toContain('First 1');

        //Configure TotMetricOP to Last N Objects as 2
        await authoringFilters.selectDynamicSelectionMode('TotMetricOP', 'Last N', '2');
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        //Verify the filter title is updated with dynamic selection
        await since(
            'TC99448_01_05.Filter title should be updated with dynamic selection for TotMetricOP, it should be #{expected} instead we have #{actual}'
        )
            .expect(await authoringFilters.getFilterLabelName('TotMetricOP').getText())
            .toContain('Last 2');

        //Verify the filter panel is updated with the dynamic selections
        await takeScreenshotByElement(
            await authoringFilters.getFilterPanel(),
            'TC99448_01_06_Filter Panel with Dynamic Selections',
            'Filter Panel with TimeOP and TotMetricOP dynamic selections'
        );

        //Define in canvas selector CategoryOP as last 2
        await authoringFilters.click({ elem: authoringFilters.getInCanvasFilterContainer('CategoryOP', 1) });
        await authoringFilters.click({ elem: authoringFilters.getThreeDotsButtonInFilterInCanvas(1) });
        await authoringFilters.click({
            elem: authoringFilters.getFilterContextMenuOption('Dynamic Selection'),
        });
        await authoringFilters.sleep(2000);
        //Verify the dynamic selection menu is opened
        await takeScreenshotByElement(
            await authoringFilters.getDynamicSelectionMenu(),
            'TC99448_01_05_ICS',
            'Dynamic Selection Menu when the Dynamic Selection is not configured'
        );
        //Click on the Unset to expand the pop up menu
        await authoringFilters.waitForElementClickable(await authoringFilters.getDynamicModeDropdown());
        await authoringFilters.sleep(1000);
        await authoringFilters.click({ elem: authoringFilters.getDynamicModeDropdown() });

        //Verify the dropdown list of dynamic selection options
        await takeScreenshotByElement(
            await authoringFilters.getDynamicSelectionDropdownList(),
            'TC99448_01_06_ICS',
            'Dynamic Selection Status Pulldown with options'
        );
        //Define Last N Objects as 2
        await authoringFilters.click({ elem: authoringFilters.getDynamicModeOption('Last N Objects') });
        await authoringFilters.click({ elem: authoringFilters.getDynamicModeQuantityInput() });
        await browser.keys(['Backspace']);
        await authoringFilters.getDynamicModeQuantityInput().setValue(2);
        //Verify the dynamic selection menu displayed Qualify
        await takeScreenshotByElement(
            await authoringFilters.getDynamicSelectionMenu(),
            'TC99448_01_03_ICS',
            'Dynamic Selection Menu when Last N Objects is selected'
        );
        await authoringFilters.click({ elem: authoringFilters.getDynamicModeOkButton() });
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        //Verify dynamic icon on for CategoryOP
        await since('TC99448_01_07.Dynamic icon should be displayed for CategoryOP')
            .expect(await inCanvasSelector_Authoring.checkPresenceOfDynamicSelIcon('CategoryOP'))
            .toBe('on');

        //Define DMOP as First N Objects as 1
        await authoringFilters.selectInCanvasDynamicSelectionMode('DMOP', 'First N Objects', '1', 2);
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        //Verify dynamic icon on for DMOP
        await since('TC99448_01_08.Dynamic icon should be displayed for DMOP')
            .expect(await inCanvasSelector_Authoring.checkPresenceOfDynamicSelIcon('DMOP'))
            .toBe('on');
        //Verify the viz result
        await takeScreenshotByElement(
            await dossierAuthoringPage.getDossierView(),
            'TC99448_01_09_Dashboard OP',
            'Dossier View with Dynamic Selections'
        );

        //await dossierAuthoringPage.actionOnMenubarWithSubmenu('File', 'Save As...');
        //await libraryAuthoringPage.saveInMyReport('(Auto) Dynamic Object Parameter Save As');
        await libraryPage.waitForCurtainDisappear();
    });

    it('[TC99448_02] Verify E2E workflow of Dataset Dynamic Object Parameter - Authoring', async () => {
        await libraryPage.editDossierWithPageKeyByUrl({
            projectId: DynamicOPAuthoring.project.id,
            dossierId: DynamicOPAuthoring.id,
            pageKey: DynamicOPAuthoring.dashboardPageKey,
        });

        //Switch to Dataset OP Chapter
        await contentsPanel.goToPage({ chapterName: 'Dataset OP', pageName: 'Page 1' });

        //Switch to filter panel
        await authoringFilters.switchToFilterPanel();
        //Define Dynamic Selection for TimeDataset to last 2
        await authoringFilters.openFilterContextMenu('TimeDataset');
        await authoringFilters.click({ elem: authoringFilters.getFilterContextMenuOption('Dynamic Selection') });
        //Verify the dynamic selection menu is opened
        await takeScreenshotByElement(
            await authoringFilters.getDynamicSelectionMenu(),
            'TC99448_02_01_Filter Panel',
            'Dynamic Selection Menu when the Dynamic Selection is not configured'
        );
        //Click on the Unset to expand the pop up menu
        await authoringFilters.waitForElementClickable(await authoringFilters.getDynamicModeDropdown());
        await authoringFilters.click({ elem: authoringFilters.getDynamicModeDropdown() });

        //Verify the dropdown list of dynamic selection options
        await takeScreenshotByElement(
            await authoringFilters.getDynamicSelectionDropdownList(),
            'TC99448_02_02_Filter Panel',
            'Dynamic Selection Status Pulldown with options'
        );
        //Define Last N Objects as 2
        await authoringFilters.click({ elem: authoringFilters.getDynamicModeOption('Last N Objects') });
        //Verify the dynamic selection menu displayed Qualify
        await takeScreenshotByElement(
            await authoringFilters.getDynamicSelectionMenu(),
            'TC99448_02_03_Filter Panel',
            'Dynamic Selection Menu when Last N Objects is selected'
        );
        await authoringFilters.click({ elem: authoringFilters.getDynamicModeQuantityInput() });
        await browser.keys(['Backspace']);
        await authoringFilters.getDynamicModeQuantityInput().setValue(2);
        await authoringFilters.click({ elem: authoringFilters.getDynamicModeOkButton() });
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        //Verify the filter title is updated with dynamic selection
        await since(
            'TC99448_02_04.Filter title should be updated with dynamic selection for TimeDataset, it should be #{expected} instead we have #{actual}'
        )
            .expect(await (await authoringFilters.getFilterLabelName('TimeDataset')).getText())
            .toContain('Last 2');

        //Configure SalesMetric to First N Objects as 1
        await authoringFilters.selectDynamicSelectionMode('SalesMetric', 'First N Objects', '1');
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        //Verify the filter title is updated with dynamic selection
        await since(
            'TC99448_02_05.Filter title should be updated with dynamic selection for SalesMetric, it should be #{expected} instead we have #{actual}'
        )
            .expect(await (await authoringFilters.getFilterLabelName('SalesMetric')).getText())
            .toContain('First 1');
        //Verify the filter panel is updated with the dynamic selections
        await takeScreenshotByElement(
            await authoringFilters.getFilterPanel(),
            'TC99448_02_06_Filter Panel',
            'Filter Panel with updated dynamic selections'
        );

        //Define in canvas selector GeoDataset as first 1
        await authoringFilters.click({ elem: authoringFilters.getInCanvasFilterContainer('GeoDataset', 1) });
        await authoringFilters.click({ elem: authoringFilters.getThreeDotsButtonInFilterInCanvas(2) });
        await authoringFilters.click({
            elem: authoringFilters.getFilterContextMenuOption('Dynamic Selection'),
        });
        //Verify the dynamic selection menu is opened
        await takeScreenshotByElement(
            await authoringFilters.getDynamicSelectionMenu(),
            'TC99448_02_07_ICS',
            'Dynamic Selection Menu for GeoDataset'
        );
        //Click on the Unset to expand the pop up menu
        await authoringFilters.waitForElementClickable(await authoringFilters.getDynamicModeDropdown());
        await authoringFilters.sleep(1000);
        await authoringFilters.click({ elem: authoringFilters.getDynamicModeDropdown() });

        //Verify the dropdown list of dynamic selection options
        await takeScreenshotByElement(
            await authoringFilters.getDynamicSelectionDropdownList(),
            'TC99448_02_08_ICS',
            'Dynamic Selection Status Pulldown with options'
        );
        //Define First N Objects as 1
        await authoringFilters.click({ elem: authoringFilters.getDynamicModeOption('First N Objects') });
        //Verify the dynamic selection menu displayed Qualify
        await takeScreenshotByElement(
            await authoringFilters.getDynamicSelectionMenu(),
            'TC99448_02_09_ICS',
            'Dynamic Selection Menu when First N Objects is selected'
        );
        await authoringFilters.click({ elem: authoringFilters.getDynamicModeOkButton() });
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        //Verify dynamic icon on for GeoDataset
        await since('TC99448_02_10.Dynamic icon should be displayed for GeoDataset')
            .expect(await inCanvasSelector_Authoring.checkPresenceOfDynamicSelIcon('GeoDataset'))
            .toBe('on');
        //Define Sales2 as Last N Objects as 2
        await authoringFilters.selectInCanvasDynamicSelectionMode('Sales2', 'Last N Objects', '2', 1);
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        //Verify dynamic icon on for Sales2
        await since('TC99448_02_11.Dynamic icon should be displayed for Sales2')
            .expect(await inCanvasSelector_Authoring.checkPresenceOfDynamicSelIcon('Sales2'))
            .toBe('on');
        //Verify the viz result
        await takeScreenshotByElement(
            await dossierAuthoringPage.getDossierView(),
            'TC99448_02_12_Dashboard OP',
            'Dossier View with Dynamic Selections'
        );
        //await dossierAuthoringPage.actionOnMenubarWithSubmenu('File', 'Save As...');
        //await libraryAuthoringPage.saveInMyReport('(Auto) Dataset Dynamic Object Parameter Save As');
        await libraryPage.waitForCurtainDisappear();
    });

    it('[TC99448_03] Verify E2E workflow of Dashboard Dynamic Object Parameter - Consumption', async () => {
        await libraryPage.openDossierById({
            projectId: dossierConsumption.project.id,
            dossierId: dossierConsumption.id,
        });

        //Switch to Dashboard OP page
        await toc.openPageFromTocMenu({ chapterName: 'Dashboard OP', pageName: 'Page 1' });
        //Verify the dashboard results
        await takeScreenshotByElement(
            await dossierPage.getDossierView(),
            'TC99448_03_01_Dashboard OP',
            'Dossier View with Dynamic Selections'
        );  
        //In-canvas selector CategoryOP select Category Id
        const ICSAttribute = InCanvasSelector.createByTitle('CategoryOP');
        await ICSAttribute.selectItemWithExactName('Category Id');
        await ICSAttribute.selectItemWithExactName('Category Desc');
        await ICSAttribute.selectItemWithExactName('Category Desc De');
        await since('Select Category Id, item selected should be #{expected}, while we get #{actual}')
            .expect(await ICSAttribute.isItemSelected('Category Id'))
            .toBe(true);

        const ICSMetric = InCanvasSelector.createByTitle('DMOP');
        await ICSMetric.selectItemWithExactName('Sum (Tot Cost)');
        //Verify the dashboard results
        await takeScreenshotByElement(
            await dossierPage.getDossierView(),
            'TC99448_03_02_Dashboard OP',
            'Dossier View with Dynamic Selections'
        );
        
        //Open the filter panel
        await filterPanel.openFilterPanel();
        //Verify the filter panel is opened and displayed first last N
        await since('TimeOP filter should display #{expected} when first opened, instead we get #{actual}')
            .expect(await radiobuttonFilter.filterSelectionInfo('TimeOP'))
            .toBe('(First 1)');
        await since('TotMetricOP filter should display #{expected} when first opened, instead we get #{actual}')
            .expect(await checkboxFilter.filterSelectionInfo('TotMetricOP'))
            .toBe('(Last 2)');
        await since('Category Id filter should display #{expected} when first opened, instead we get #{actual}')
            .expect(await searchBoxFilter.filterSelectionInfo('Category Id'))
            .toBe('(First 1)');
        await takeScreenshotByElement(
            await filterPanel.getFilterPanelDropdown(),
            'TC99448_03_03_Dashboard OP',
            'Filter Panel with Dynamic Selections'
        );
        await radiobuttonFilter.openSecondaryPanel('TimeOP');
        await radiobuttonFilter.selectElementByName('MonthMFA');
        await checkboxFilter.openSecondaryPanel('TotMetricOP');
        await checkboxFilter.selectElementByName('Tot Cost');
        await checkboxFilter.selectElementByName('Tot Unit Sales');
        await searchBoxFilter.openSecondaryPanel('Category Id');
        await searchBoxFilter.search('2');
        await searchBoxFilter.selectAll();
        await filterPanel.apply();
        await takeScreenshotByElement(
            await dossierPage.getDossierView(),
            'TC99448_03_04_Dashboard OP',
            'Dossier View with Dynamic Selections and Filters'
        );
        //Reset to dynamic for ICS
        await ICSAttribute.click({ elem: ICSAttribute.getTitle() });
        await ICSAttribute.hoverMouseOnElement(ICSAttribute.getTitle());
        await ICSAttribute.openContextMenu();
        await ICSAttribute.selectOptionInMenu('Reset to Last 2');
        await ICSMetric.click({ elem: ICSMetric.getTitle() });
        await ICSMetric.hoverMouseOnElement(ICSMetric.getTitle());
        await ICSMetric.openContextMenu();
        await ICSMetric.selectOptionInMenu('Reset to First 1');
        await libraryPage.waitForCurtainDisappear();
        await takeScreenshotByElement(
            await dossierPage.getDossierView(),
            'TC99448_03_05_Dashboard OP',
            'Dossier View with Dynamic Selections and Reset to Dynamic'
        );

        //Open the filter panel
        await filterPanel.openFilterPanel();
        //Reset to dynamic for filters
        await radiobuttonFilter.openSecondaryPanel('TimeOP');
        await filterElement.clickFooterButton('Reset');
        await checkboxFilter.openContextMenu('TotMetricOP');
        await checkboxFilter.selectContextMenuOption('TotMetricOP', 'Reset to Last 2');
        await searchBoxFilter.openContextMenu('Category Id');
        await searchBoxFilter.selectContextMenuOption('Category Id', 'Reset to First 1');

        await since('TimeOP filter should display #{expected} when reset, instead we get #{actual}')
            .expect(await radiobuttonFilter.filterSelectionInfo('TimeOP'))
            .toBe('(First 1)');
        await since('TotMetricOP filter should display #{expected} when reset, instead we get #{actual}')
            .expect(await checkboxFilter.filterSelectionInfo('TotMetricOP'))
            .toBe('(Last 2)');
        await since('Category Id filter should display #{expected} when reset, instead we get #{actual}')
            .expect(await searchBoxFilter.filterSelectionInfo('Category Id'))
            .toBe('(First 1)');
        await takeScreenshotByElement(
            await filterPanel.getFilterPanelDropdown(),
            'TC99448_03_06_Dashboard OP',
            'Filter Panel with Dynamic Selections and Reset to Dynamic Filters'
        );

        await filterPanel.apply();
        await takeScreenshotByElement(
            await dossierPage.getDossierView(),
            'TC99448_03_07_Dashboard OP',
            'Dossier View with Dynamic Selections and Reset to Dynamic Filters'
        );
        //Verify the filter summary bar
        await since('Filter Summary of TimeOP should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('TimeOP'))
            .toBe('(Year Id)');
        await since('Filter Summary of TotMetricOP should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('TotMetricOP'))
            .toBe('(Tot Dollar Sales, Tot Unit Sales)');
        //Open the filter panel again
        await filterPanel.openFilterPanel();
        //Verify the filters are reset to dynamic
        await since('TimeOP filter should display #{expected} after reset then open, instead we get #{actual}')
            .expect(await radiobuttonFilter.filterSelectionInfo('TimeOP'))
            .toBe('(First 1)');
        await since('TotMetricOP filter should display #{expected} after reset then open, instead we get #{actual}')
            .expect(await checkboxFilter.filterSelectionInfo('TotMetricOP'))
            .toBe('(Last 2)');
        await since('Category Id filter should display #{expected} after reset then open, instead we get #{actual}')
            .expect(await searchBoxFilter.filterSelectionInfo('Category Id'))
            .toBe('(First 1)');
    });

    it('[TC99448_04] Verify E2E workflow of Dataset Dynamic Object Parameter - Consumption', async () => {
        await libraryPage.openDossierById({
            projectId: dossierConsumption.project.id,
            dossierId: dossierConsumption.id,
        });

        //Switch to Dataset OP Chapter
        await toc.openPageFromTocMenu({ chapterName: 'Dataset OP', pageName: 'Page 1' });
        //Verify the dashboard results
        await takeScreenshotByElement(
            await dossierPage.getDossierView(),
            'TC99448_04_01_Dataset OP',
            'Dossier View with Dynamic Selections'
        );

        //In-canvas selector GeoDataset select Country
        const ICSAttribute = InCanvasSelector.createByTitle('GeoDataset');
        await ICSAttribute.selectItemWithExactName('Country');
        await since('Select Country, item selected should be #{expected}, while we get #{actual}')
            .expect(await ICSAttribute.isItemSelected('Country'))
            .toBe(true);

        const ICSMetric = InCanvasSelector.createByTitle('Sales2');
        await ICSMetric.selectItemWithExactName('Unit Cost');
        await ICSMetric.selectItemWithExactName('Units Sold');
        //Verify the dashboard results
        await takeScreenshotByElement(
            await dossierPage.getDossierView(),
            'TC99448_04_02_Dataset OP',
            'Dossier View with Dynamic Selections'
        );

        //Open the filter panel
        await filterPanel.openFilterPanel();
        //Verify the filter panel is opened and displayed first last N
        await since('TimeDataset filter should display #{expected} when first opened, instead we get #{actual}')
            .expect(await checkboxFilter.filterSelectionInfo('TimeDataset'))
            .toBe('(Last 2)');
        await since('SalesMetric filter should display #{expected} when first opened, instead we get #{actual}')
            .expect(await radiobuttonFilter.filterSelectionInfo('SalesMetric'))
            .toBe('(First 1)');
        await takeScreenshotByElement(
            await filterPanel.getFilterPanelDropdown(),
            'TC99448_04_03_Dataset OP',
            'Filter Panel with Dynamic Selections'
        );
        await checkboxFilter.openSecondaryPanel('TimeDataset');
        await checkboxFilter.selectElementByName('Month of Year');
        await checkboxFilter.selectElementByName('Quarter');

        await checkboxFilter.openSecondaryPanel('SalesMetric');
        await radiobuttonFilter.selectElementByName('Profit');
        await filterPanel.apply();
        await takeScreenshotByElement(
            await dossierPage.getDossierView(),
            'TC99448_04_04_Dataset OP',
            'Dossier View with Dynamic Selections'
        );

        //Reset to dynamic for ICS
        await ICSAttribute.click({ elem: ICSAttribute.getTitle() });
        await ICSAttribute.hoverMouseOnElement(ICSAttribute.getTitle());
        await ICSAttribute.openContextMenu();
        await ICSAttribute.selectOptionInMenu('Reset to First 1');
        await libraryPage.waitForCurtainDisappear();
        await ICSMetric.click({ elem: ICSMetric.getTitle() });
        await ICSMetric.hoverMouseOnElement(ICSMetric.getTitle());
        await ICSMetric.openContextMenu();
        await ICSMetric.selectOptionInMenu('Reset to Last 2');
        await libraryPage.waitForCurtainDisappear();
        await takeScreenshotByElement(
            await dossierPage.getDossierView(),
            'TC99448_04_05_Dataset OP',
            'Dossier View with Dynamic Selections and Reset to Dynamic'
        );

        //Open the filter panel
        await filterPanel.openFilterPanel();
        //Reset to dynamic for filters
        await checkboxFilter.openSecondaryPanel('TimeDataset');
        await filterElement.clickFooterButton('Reset');
        await radiobuttonFilter.openContextMenu('SalesMetric');
        await radiobuttonFilter.selectContextMenuOption('SalesMetric', 'Reset to First 1');
        //Verify the filters are reset to dynamic
        await since('TimeDataset filter should display #{expected} when reset, instead we get #{actual}')
            .expect(await checkboxFilter.filterSelectionInfo('TimeDataset'))
            .toBe('(Last 2)');
        await since('SalesMetric filter should display #{expected} when reset, instead we get #{actual}')
            .expect(await radiobuttonFilter.filterSelectionInfo('SalesMetric'))
            .toBe('(First 1)');
        await takeScreenshotByElement(
            await filterPanel.getFilterPanelDropdown(),
            'TC99448_04_06_Dataset OP',
            'Filter Panel with Dynamic Selections and Reset to Dynamic Filters'
        );
        await filterPanel.apply();
        await libraryPage.waitForCurtainDisappear();
        await takeScreenshotByElement(
            await dossierPage.getDossierView(),
            'TC99448_04_07_Dataset OP',
            'Dossier View with Dynamic Selections and Reset to Dynamic Filters'
        );
        //Verify the filter summary bar
        await since('Filter Summary of TimeDataset should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('TimeDataset')).toBe('(Quarter, Year)');
        await since('Filter Summary of SalesMetric should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('SalesMetric')).toBe('(Cost)');
        //Open the filter panel again
        await filterPanel.openFilterPanel();
        //Verify the filters are reset to dynamic
        await since('TimeDataset filter should display #{expected} after reset then open, instead we get #{actual}')
            .expect(await checkboxFilter.filterSelectionInfo('TimeDataset')).toBe('(Last 2)');
        await since('SalesMetric filter should display #{expected} after reset then open, instead we get #{actual}')
            .expect(await radiobuttonFilter.filterSelectionInfo('SalesMetric')).toBe('(First 1)');
    });

    it('[TC99448_05] Verify FUN of Dashboard Dynamic Object Parameter - Authoring', async () => {
        await libraryPage.editDossierWithPageKeyByUrl({
            projectId: dossierConsumption.project.id,
            dossierId: dossierConsumption.id,
            pageKey: dossierConsumption.dashboardPageKey,
        });

        //Switch to Dashboard OP page
        await contentsPanel.goToPage({ chapterName: 'Dashboard OP', pageName: 'Page 1' });
        //Switch to filter panel
        await authoringFilters.switchToFilterPanel();
        //Edit the OP TimeOP, remove Year Id from the list
        await datasetPanel.switchDatasetsTab();
        await datasetsPanel.rightClickAttributeMetric('TimeOP');
        await datasetsPanel.clickMenuOptions({ firstOption: 'Edit' });
        await parameterEditor.removeSelectedItem('Year Id');
        await parameterEditor.clickParameterEditorButton('Save');

        //Eidt the OP CategoryOP, Drag Category Id to the last position
        await datasetsPanel.rightClickAttributeMetric('CategoryOP');
        await datasetsPanel.clickMenuOptions({ firstOption: 'Edit' });
        await parameterEditor.dragAndDropSelectedItem('Category Id', 'Category Desc', 1);
        await parameterEditor.clickParameterEditorButton('Save');

        //Edit the OP TotMetricOP, add one more metric to the list
        await datasetsPanel.rightClickAttributeMetric('TotMetricOP');
        await datasetsPanel.clickMenuOptions({ firstOption: 'Edit' });
        await parameterEditor.clickSelectFromBtn();
        await parameterEditor.selectItemByText('Gross Dollar Sales');
        await parameterEditor.clickSelectButton();
        await parameterEditor.clickParameterEditorButton('Save');

        //Edit the OP DMOP, drag Sum (Tot Cost) to the first position
        await datasetsPanel.rightClickAttributeMetric('DMOP');
        await datasetsPanel.clickMenuOptions({ firstOption: 'Edit' });
        await parameterEditor.dragAndDropSelectedItem('(Tot Cost+Tot Dollar Sales)', 'Sum (Tot Cost)',1);
        await parameterEditor.clickParameterEditorButton('Save');

        //Verify the dashbaord results
        await takeScreenshotByElement(
            await dossierAuthoringPage.getDossierView(),
            'TC99448_05_01_Dashboard OP',
            'Dossier View with Dynamic Selections on the OP after OP is edited'
        );

        //Modify the OP TimeOP to Last 1
        await authoringFilters.openFilterContextMenu('TimeOP');
        await authoringFilters.click({ elem: authoringFilters.getFilterContextMenuOption('Dynamic Selection') });
        await authoringFilters.click({ elem: authoringFilters.getDynamicModeDropdown() });
        await authoringFilters.click({ elem: authoringFilters.getDynamicModeOption('Last Object') });
        await authoringFilters.click({ elem: authoringFilters.getDynamicModeOkButton() });
        await dossierAuthoringPage.waitForAuthoringPageLoading();

        //Modify TotMetricOP to Last 1
        await authoringFilters.selectDynamicSelectionMode('TotMetricOP', 'Last N', '1');
        //Verify the results
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await dossierAuthoringPage.waitForElementVisible(grid.getOneRowInGrid('Grid1', 2, 'yes'));
        await takeScreenshotByElement(
            await dossierAuthoringPage.getDossierView(),
            'TC99448_05_02_Dashboard OP',
            'Dossier View with Dynamic Selections on the OP after OP is edited and dynamic selections are modified');
        //Verify the filter panel is updated with the dynamic selections
        await takeScreenshotByElement(
            await authoringFilters.getFilterPanel(),
            'TC99448_05_02_Filter Panel',
            'Filter Panel with Dynamic Selections on the OP after OP is edited and dynamic selections are modified'
        );

        //Disable Selection Required for TotMetricOP
        await authoringFilters.clickFilterContextMenuOption('TotMetricOP', ['Selection Required']);
        await authoringFilters.sleep(1000);
        //Disable Selection Required for TimeOP
        await authoringFilters.clickFilterContextMenuOption('TimeOP', ['Selection Required']);
        await takeScreenshotByElement(
            await authoringFilters.getFilterPanel(),
            'TC99448_05_03_Filter Panel',
            'Filter Panel when Selection Required is disabled for TotMetricOP'
        );

        //Delete TimeOP
        await datasetsPanel.rightClickAttributeMetric('TimeOP');
        await datasetsPanel.clickMenuOptions({ firstOption: 'Delete' });
        //Verify the results
        await takeScreenshotByElement(
            await dossierAuthoringPage.getDossierView(),
            'TC99448_05_04_Dashboard OP',
            'Dossier View with Dynamic Selections on the OP after TimeOP is deleted'
        );
        //Undo
        await toolbar.clickButtonFromToolbar('Undo');
        await dossierAuthoringPage.waitForAuthoringPageLoading();

        //TotMetricOP select Tot Cost
        await authoringFilters.selectFilterPanelFilterCheckboxOption('TotMetricOP', 'Tot Cost');
        await since('TC99448_05_04.TotMetricOP should have Tot Cost selected, dynamic icon should be off')
            .expect(await authoringFilters.getDynamicIcon('TotMetricOP')
            .getAttribute('class'))
            .toContain('dynamicSelection off');
        //Delete TotMetricOP
        await datasetsPanel.rightClickAttributeMetric('TotMetricOP');
        await datasetsPanel.clickMenuOptions({ firstOption: 'Delete' });
        //Verify the results
        await takeScreenshotByElement(
            await dossierAuthoringPage.getDossierView(),
            'TC99448_05_05_Dashboard OP',
            'Dossier View with Dynamic Selections on the OP after TotMetricOP is deleted'
        );
        //Undo
        await toolbar.clickButtonFromToolbar('Undo');
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        //Verify the dashboard results after undo
        await takeScreenshotByElement(
            await dossierAuthoringPage.getDossierView(),
            'TC99448_05_06_Dashboard OP',
            'Dossier View with Dynamic Selections on the OP after TotMetricOP is restored'
        );

        //Reset to default for TotTimeOP
        await authoringFilters.openFilterContextMenu('TotMetricOP');
        await authoringFilters.click({ elem: authoringFilters.getFilterContextMenuOption('Reset to Default') });
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await takeScreenshotByElement(
            await authoringFilters.getFilterPanel(),
            'TC99448_05_07_Filter Panel',
            'Filter Panel when Reset to Default is clicked for TotMetricOP'
        );

        //Reset to default for ICS CategoryOP
        await authoringFilters.hover({
            elem: authoringFilters.getInCanvasFilterContainer('CategoryOP', 1)
        });
        await authoringFilters.click({ elem: authoringFilters.getThreeDotsButtonInFilterInCanvas(1) });
        await authoringFilters.click({ elem: authoringFilters.getFilterContextMenuOption('Reset to Default') });
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await takeScreenshotByElement(
            await inCanvasSelector_Authoring.getParameterSelectorContainerUsingId(1),
            'TC99448_05_08_Dashboard OP',
            'Dossier View with Dynamic Selections on the OP after CategoryOP is reset to default'
        );

        //TimeOP select MonthMFA
        await authoringFilters.selectFilterPanelFilterCheckboxOption('TimeOP', 'MonthMFA');
        await since('TC99448_05_09.TimeOP should have MonthMFA selected, dynamic icon should be off')
            .expect(await authoringFilters.getDynamicIcon('TimeOP').getAttribute('class'))
            .toContain('dynamicSelection off');
        //DMOP select Gross Dollar Sales
        await authoringFilters.selectInCanvasFilterCheckboxOption('DMOP', 'Gross Dollar Sales');
        await since('TC99448_05_10.DMOP should have Gross Dollar Sales selected, dynamic icon should be off')
            .expect(await inCanvasSelector_Authoring.checkPresenceOfDynamicSelIcon('DMOP'))
            .toBe('off');
        await takeScreenshotByElement(
            await dossierAuthoringPage.getDossierView(),
            'TC99448_05_11_Dashboard OP',
            'Dossier View with Dynamic Selections on the OP after TotMetricOP is deleted'
        );

        //Reset to dynamic for TimeOP and DMOP
        await authoringFilters.changeToDynamicSelection('TimeOP');
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await inCanvasSelector_Authoring.toggleDynamicSelectionIcon('DMOP');
        await dossierAuthoringPage.waitForAuthoringPageLoading();

        await takeScreenshotByElement(
            await dossierAuthoringPage.getDossierView(),
            'TC99448_05_12_Dashboard OP',
            'Dossier View with Dynamic Selections on the OP after TimeOP and DMOP are reset to dynamic'
        );
    });
    it('[TC99448_06] Verify FUN of Dataset Dynamic Object Parameter - Authoring', async () => {
        await libraryPage.editDossierWithPageKeyByUrl({
            projectId: dossierConsumption.project.id,
            dossierId: dossierConsumption.id,
            pageKey: dossierConsumption.dashboardPageKey,
        });

        //Switch to Dataset OP page
        await contentsPanel.goToPage({ chapterName: 'Dataset OP', pageName: 'Page 1' });
        //Switch to filter panel
        await authoringFilters.switchToFilterPanel();
        //Edit the OP in the dataset
        await datasetPanel.switchDatasetsTab();
        await datasetsPanel.clickDatasetMenuIcon('year,category,country,cost-OP');
        await datasetsPanel.clickMenuOptions({ firstOption: 'Edit Dataset...' });
        await datasetDialog.editObject('TimeDataset');
        await datasetDialog.sleep(2000);
        await parameterEditor.removeSelectedItem('Quarter');
        await parameterEditor.clickParameterEditorButton('Save');

        await datasetDialog.editObject('SalesMetric');
        await datasetDialog.sleep(2000);
        await parameterEditor.clickSelectFromBtn();
        await parameterEditor.selectObjectType('Metrics');
        await parameterEditor.openFolder('Sales Metrics');
        await parameterEditor.selectItemByText('Gross Revenue');
        await parameterEditor.clickSelectButton();
        await parameterEditor.dragAndDropSelectedItem('Gross Revenue', 'Cost');
        await datasetDialog.sleep(2000);
        await parameterEditor.clickParameterEditorButton('Save');

        await datasetDialog.editObject('GeoDataset');
        await datasetDialog.sleep(2000);
        await parameterEditor.dragAndDropSelectedItem('Region', 'Call Center');
        await datasetDialog.sleep(2000);
        await parameterEditor.clickParameterEditorButton('Save');

        await datasetDialog.removeObjectFromList('Sales2');
        await datasetDialog.clickUpdateDatasetBtn();
        await dossierAuthoringPage.waitForAuthoringPageLoading();

        //Verify the dashbaord results
        await takeScreenshotByElement(
            await dossierAuthoringPage.getDossierView(),
            'TC99448_06_01_Dataset OP',
            'Dossier View with Dynamic Selections on the OP after OP is edited'
        );
        //Verify the filter panel is updated with the dynamic selections
        await takeScreenshotByElement(
            await authoringFilters.getFilterPanel(),
            'TC99448_06_02_Filter Panel',
            'Filter Panel with Dynamic Selections on the OP after OP is edited'
        );  

        //Click undo
        await toolbar.clickButtonFromToolbar('Undo');
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        //Verify the dashbaord results after undo
        await takeScreenshotByElement(
            await dossierAuthoringPage.getDossierView(),
            'TC99448_06_03_Dataset OP',
            'Dossier View with Dynamic Selections on the OP after undo'
        );
        //Verify the filter panel is updated with the dynamic selections after undo
        await takeScreenshotByElement(
            await authoringFilters.getFilterPanel(),
            'TC99448_06_04_Filter Panel',
            'Filter Panel with Dynamic Selections on the OP after undo'
        );

        //Change TimeDataset to Radio Button Filter
        await authoringFilters.selectDisplayStyleForFilterItem('TimeDataset', 'Radio Buttons');
        //Verify the grid and filter panel
        await since('TC99448_06_05.First Row in Grid should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 1))
            .toEqual(['Year', 'Call Center', 'Cost', 'Unit Profit', 'Units Sold']);
        await takeScreenshotByElement(
            await authoringFilters.getFilterPanel(),
            'TC99448_06_06_Filter Panel',
            'Filter Panel with Dynamic Selections on the OP after TimeDataset is changed to Radio Button Filter'
        );

        //Change Sales2 to Radio Button Filter
        await authoringFilters.hover({
            elem: authoringFilters.getInCanvasFilterContainer('Sales2', 1)
        });
        await authoringFilters.click({ elem: authoringFilters.getThreeDotsButtonInFilterInCanvas(1) });
        await authoringFilters.click({ elem: authoringFilters.getFilterContextMenuOption('Display Style') });
        await authoringFilters.clickDisplayStyleOption('Radio Buttons');
        await authoringFilters.waitLoadingDataPopUpIsNotDisplayed();
        //Verify the grid and filter panel
        await since('TC99448_06_07.First Row in Grid should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 1))
            .toEqual(['Year', 'Call Center', 'Cost', 'Units Sold']);
        await takeScreenshotByElement(
            await authoringFilters.getFilterPanel(),
            'TC99448_06_07_Filter Panel',
            'Filter Panel with Dynamic Selections on the OP after Sales2 is changed to Radio Button Filter'
        );
        //Click undo
        await toolbar.clickButtonFromToolbar('Undo');
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        //TimeDataset select Month of Year
        await authoringFilters.selectFilterPanelFilterCheckboxOption('TimeDataset', 'Month of Year');
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await since('TC99448_06_08.TimeDataset should have Month of Year selected, dynamic icon should be off')
            .expect(await authoringFilters.getDynamicIcon('TimeDataset').getAttribute('class'))
            .toContain('dynamicSelection off');
        //Sales2 select Unit Cost
        await authoringFilters.selectInCanvasFilterCheckboxOption('Sales2', 'Unit Cost');
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await takeScreenshotByElement(
            await dossierAuthoringPage.getDossierView(),
            'TC99448_06_09_Dataset OP',
            'Dossier View with Dynamic Selections on the OP after Sales2 is changed to Radio Button Filter'
        );
        //Verify the grid
        await since('TC99448_06_09.First Row in Grid should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 1))
            .toEqual(['Month of Year', 'Call Center', 'Cost', 'Unit Cost', 'Unit Profit', 'Units Sold']);

        //Reset to dynamic for TimeDataset and Sales2
        await authoringFilters.changeToDynamicSelection('TimeDataset');
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await inCanvasSelector_Authoring.toggleDynamicSelectionIcon('Sales2');
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await takeScreenshotByElement(
            await dossierAuthoringPage.getDossierView(),
            'TC99448_06_10_Dataset OP',
            'Dossier View with Dynamic Selections on the OP after TimeDataset and Sales2 are reset to dynamic'
        );
        await since('TC99448_06_10.TimeDataset should have Month of Year selected, dynamic icon should be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.getDynamicOnIcon('TimeDataset').getAttribute('class'))
            .toContain('dynamicSelection on');
        await since('TC99448_06_10.Sales2 should have Unit Cost selected, dynamic icon should be #{expected}, instead we have #{actual}')
            .expect(await inCanvasSelector_Authoring.checkPresenceOfDynamicSelIcon('Sales2')).toBe('on');
    });
    //defect automation
    it('[TC99448_07] Verify the FUN for Dynamic Object Parameter - Defect Automation in Authoring', async () => {
        await libraryPage.editDossierWithPageKeyByUrl({
            projectId: dossierFUN.project.id,
            dossierId: dossierFUN.id,
            pageKey: dossierFUN.dashboardPageKey,
        });

        //Switch to Chapter 1 Page 1
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'OP-FP' });
        //Switch to filter panel
        await authoringFilters.switchToFilterPanel();
        //Enter pause mode
        await toolbar.clickButtonFromToolbar('Pause Data Retrieval');
        //Switch to Chapter 2 Page 1
        await contentsPanel.goToPage({ chapterName: 'Chapter 2', pageName: 'OP-FP' });
        //Expand the filter in the filter panel
        await authoringFilters.click({ elem: authoringFilters.getFilterPanelItem('TimeOP') });
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await authoringFilters.click({ elem: authoringFilters.getFilterPanelItem('DMOP') });
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await dossierAuthoringPage.sleep(2000);
        //Verify the filter panel is expanded
        await takeScreenshotByElement(
            await authoringFilters.getFilterPanel(),
            'TC99448_07_01_Filter Panel',
            'Filter Panel with Dynamic Selections on the OP after pause mode is entered'
        );
        //Make Selections on TimeOP and TotMetricOP
        await authoringFilters.selectFilterPanelFilterCheckboxOption('TimeOP', 'MonthMFA');
        await authoringFilters.selectFilterPanelFilterCheckboxOption('TimeOP', 'Year Id');
        await authoringFilters.selectFilterPanelFilterCheckboxOption('DMOP', '(Tot Cost+Tot Dollar Sales)');
        await authoringFilters.selectFilterPanelFilterCheckboxOption('DMOP', 'Sum (Tot Cost)');
        await authoringFilters.selectFilterPanelFilterCheckboxOption('DMOP', 'Gross Dollar Sales');
        //DE330088, change back to chapter 1 to validate
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'OP-FP' });
        //Expand the filter panel
        await authoringFilters.click({ elem: authoringFilters.getFilterPanelItem('TimeOP') });
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await authoringFilters.click({ elem: authoringFilters.getFilterPanelItem('DMOP') });
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await dossierAuthoringPage.sleep(2000);
        //Verify the filter panel is expanded
        await takeScreenshotByElement(
            await authoringFilters.getFilterPanel(),
            'TC99448_07_02_Filter Panel Expanded',
            'Filter Panel with Dynamic Selections on the OP and change to chosen after pause mode is entered'
        );

        //Define dynamic selection in the pause mode
        await authoringFilters.selectDynamicSelectionMode('CategoryOP', 'First N', '2');
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await dossierAuthoringPage.sleep(2000);
        await since('TC99448_07_03.CategoryOP should have dynamic icon on, instead we have #{actual}')
            .expect(await authoringFilters.getDynamicOnIcon('CategoryOP').getAttribute('class'))
            .toContain('on dynamicSelection');
        //Resume the data retrieval
        await toolbar.clickButtonFromToolbar('Resume Data Retrieval');
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        //Verify the results
        await since('TC99448_07_04.First Row in Grid should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 1))
            .toEqual(['MonthMFA', 'Category Id', 'Subcat Id', 'Gross Dollar Sales']);

        //Switch to Chapter 2 Page OP-FP to sync the selection
        await contentsPanel.goToPage({ chapterName: 'Chapter 2', pageName: 'OP-FP' });
        //Verify the results
        await since('TC99448_07_05.First Row in Grid should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 1))
            .toEqual(['MonthMFA', 'Category Id', 'Subcat Id', 'Gross Dollar Sales']);
        await takeScreenshotByElement(
            await authoringFilters.getFilterPanel(),
            'TC99448_07_05_Filter Panel',
            'Sync the OP selections to the target page, OP is located in the the filter panel'
        );

        //Switch to Chapter 3 Page OP-ICS to sync chosen selection
        await contentsPanel.goToPage({ chapterName: 'Chapter 3', pageName: 'OP-ICS' });
        //Verify the results
        await since('TC99448_07_06.First Row in Grid should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 1))
            .toEqual(['MonthMFA', 'Category Id', 'Subcat Id', 'Gross Dollar Sales']);
        await since('TC99448_07_07.CategoryOP should have Unit Cost selected, dynamic icon should be #{expected}, instead we have #{actual}')
            .expect(await inCanvasSelector_Authoring.checkPresenceOfDynamicSelIcon('CategoryOP')).toBe('on');
        await since('TC99448_07_08.TimeOP should have Unit Cost selected, dynamic icon should be #{expected}, instead we have #{actual}')
            .expect(await inCanvasSelector_Authoring.checkPresenceOfDynamicSelIcon('TimeOP')).toBe('off');
        await since('TC99448_07_09.DMOP should have Unit Cost selected, dynamic icon should be #{expected}, instead we have #{actual}')
            .expect(await inCanvasSelector_Authoring.checkPresenceOfDynamicSelIcon('DMOP')).toBe('off');
        await takeScreenshotByElement(
            await dossierAuthoringPage.getDossierView(),
            'TC99448_07_08_Dossier View',
            'Verify the Dossier View after syncing the OP selections'
        );

        //Switch to Chapter 4 Page 1
        await contentsPanel.goToPage({ chapterName: 'Chapter 4', pageName: 'OP-FP and ICS DE330634' });
        //Define A1 in filter panel as First 1
        await authoringFilters.selectDynamicSelectionMode('A1', 'First N', '1', 1);
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        //For M1, M2 in filter panel, reset to default
        await authoringFilters.click({ elem: authoringFilters.getFilterContextMenuButton('M1', 1) });
        await authoringFilters.click({ elem: authoringFilters.getFilterContextMenuOption('Reset to Default') });
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await authoringFilters.click({ elem: authoringFilters.getFilterContextMenuButton('M2', 1) });
        await authoringFilters.click({ elem: authoringFilters.getFilterContextMenuOption('Reset to Default') });
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        //DE330634, Verify in-canvas selector for A1, M1, M2 is synced the status
        await authoringFilters.hover({
            elem: authoringFilters.getInCanvasFilterContainer('A1', 1)
        });
        await since('TC99448_07_09.A1 should have First 1 selected, dynamic icon should be #{expected}, instead we have #{actual}')
            .expect(await inCanvasSelector_Authoring.checkPresenceOfDynamicSelIcon('A1')).toBe('on');
        await since('TC99448_07_10.M1 should have reset status, dynamic icon should be #{expected}, instead we have #{actual}')
            .expect(await inCanvasSelector_Authoring.checkPresenceOfDynamicSelIcon('M1')).toBe('NA');
        await since('TC99448_07_11.M2 should have reset status, dynamic icon should be #{expected}, instead we have #{actual}')
            .expect(await inCanvasSelector_Authoring.checkPresenceOfDynamicSelIcon('M2')).toBe('NA');
        await takeScreenshotByElement(
            await dossierAuthoringPage.getDossierView(),
            'TC99448_07_09_Dossier View',
            'Verify the Dossier View after syncing the OP selections'
        );

    });

    it('[TC99448_08] Verify the FUN for Dynamic Object Parameter - Defect Automation in Consumption', async () => {
        await libraryPage.openDossierById({
            projectId: dossierFUN.project.id,
            dossierId: dossierFUN.id,
        });

        await toc.openPageFromTocMenu({ chapterName: 'Chapter 5', pageName: 'OP-FP and ICS DE330215' });
        //In-canvas selector CategoryOP select Category Id
        const ICSAttribute = InCanvasSelector.createByTitle('A2');
        await ICSAttribute.openContextMenu();
        await ICSAttribute.selectOptionInMenu('Reset to First 1');

        const ICSMetric = InCanvasSelector.createByTitle('M3');
        await ICSMetric.openContextMenu();
        await ICSMetric.selectOptionInMenu('Reset to Last 1');
        //Verify the results
        await since('TC99448_08_01.First Row in Grid should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('DE330215', 1))
            .toEqual(['Year Id', 'Tot Dollar Sales']);
        //Verify the filter summary bar
        await since('Filter Summary of A2 should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('A2'))
            .toBe('(Year Id)');
        await since('Filter Summary of M3 should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('M3'))
            .toBe('(Tot Dollar Sales)');
        //DE330215, Verify the filter panel
        //Open the filter panel
        await filterPanel.openFilterPanel();
        //Verify the filter panel is opened and displayed first last N
        await since('A2 filter should display #{expected} when first opened, instead we get #{actual}')
            .expect(await radiobuttonFilter.filterSelectionInfo('A2'))
            .toBe('(First 1)');
        await since('M3 filter should display #{expected} when first opened, instead we get #{actual}')
            .expect(await checkboxFilter.filterSelectionInfo('M3'))
            .toBe('(Last 1)');
        await takeScreenshotByElement(
            await filterPanel.getFilterPanelDropdown(),
            'TC99448_08_01_DE330215_Filter Panel',
            'Filter Panel with Dynamic Selections'
        );

        await toc.openPageFromTocMenu({ chapterName: 'Chapter 6', pageName: 'Page 1' });
        await libraryPage.waitForCurtainDisappear();
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 7', pageName: 'Linking1' });
        await libraryPage.waitForCurtainDisappear();

        //Open the filter panel to reset the dyanmic selection
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('TotMetricOP');
        await filterElement.clickFooterButton('Reset');
        await checkboxFilter.openContextMenu('TimeDataset');
        await checkboxFilter.selectContextMenuOption('TimeDataset', 'Reset to First 1');
        await filterPanel.apply();
        await libraryPage.waitForCurtainDisappear();
        //Verify the result
        await since('TC99448_08_02.First Row in Visualization 1 should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 1))
            .toEqual(['Month', 'Unit Cost']);
        await since('TC99448_08_03.First Row in Visualization 2 should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 2', 1))
            .toEqual(['Category Id', 'Tot Cost']);
        //Verify the filter summary bar  
        await since('Filter Summary of TimeDataset should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('TimeDataset'))
            .toBe('(Month)');
        await since('Filter Summary of TotMetricOP should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('TotMetricOP'))
            .toBe('(Tot Cost)');
        //Switch back to chapter 6
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 6', pageName: 'Page 1' });
        await libraryPage.waitForCurtainDisappear();
        //Verify the results
        await since('TC99448_08_04.First Row in Visualization 1 should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 1))
            .toEqual(['Month', 'Unit Cost']);
        await since('TC99448_08_05.First Row in Visualization 2 should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 2', 1))
            .toEqual(['Category Id', 'Tot Cost']);
        //Verify the filter summary bar
        await since('Filter Summary of TimeDataset should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('TimeDataset'))
            .toBe('(Month)');
        await since('Filter Summary of TotMetricOP should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('TotMetricOP'))
            .toBe('(Tot Cost)');
        //Open the filter panel again
        await filterPanel.openFilterPanel();
        //Verify the filters are reset to dynamic
        await since('TimeDataset filter should display #{expected} after reset then open, instead we get #{actual}')
            .expect(await checkboxFilter.filterSelectionInfo('TimeDataset')).toBe('(First 1)');
        await since('TotMetricOP filter should display #{expected} after reset then open, instead we get #{actual}')
            .expect(await radiobuttonFilter.filterSelectionInfo('TotMetricOP')).toBe('(First 1)');
        await takeScreenshotByElement(
            await filterPanel.getFilterPanelDropdown(),
            'TC99448_08_01_Filter Panel',
            'Verify the Dossier View after syncing the OP selections'
        );

        //Switch to Chapter 7 Page 1
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 7', pageName: 'Linking1' });
        await libraryPage.waitForCurtainDisappear();
        //Filter panel TimeDatset unset Month
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('TimeDataset');
        await checkboxFilter.selectElementByName('Month');
        await filterPanel.apply();
        await libraryPage.waitForCurtainDisappear();
        //Verify the results
        await since('TC99448_08_06.First Row in Visualization 1 should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 1))
            .toEqual(['Unit Cost']);
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('TimeDataset');
        await checkboxFilter.selectElementByName('Quarter');
        await filterPanel.apply();
        await libraryPage.waitForCurtainDisappear();
        //Verify the results
        await since('TC99448_08_07.First Row in Visualization 1 should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 1))
            .toEqual(['Quarter', 'Unit Cost']);
        //RMC on Visualization 1 to go to target page
        await grid.linkToTargetByGridContextMenu({ title: 'Visualization 1', headerName: 'Quarter' });
        await libraryPage.waitForCurtainDisappear();
        //Verify the target dashboard
        await since('Link to target dashboard from visualization 1, back icon should be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(true);
        await since('Link to another target dashboard, target page should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual(['(Auto) Dynamic Object Parameter FUN_target', 'Chapter 7', 'Page 1']);
        //Verify the grid
        await since('TC99448_08_06.First Row in Visualization 1 should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 1))
            .toEqual(['Quarter', 'Unit Cost']);
        await since('TC99448_08_07.First Row in Visualization 2 should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 2', 1))
            .toEqual(['Category Id', 'Tot Cost']);
        //Verify the filter summary bar
        await since('Filter Summary of TimeDataset should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('TimeDataset'))
            .toBe('(Quarter)');
        await since('Filter Summary of TotMetricOP should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('TotMetricOP'))
            .toBe('(Tot Cost)');
        //Verify the filter panel
        await filterPanel.openFilterPanel();
        await takeScreenshotByElement(
            await filterPanel.getFilterPanelDropdown(),
            'TC99448_08_02_Filter Panel',
            'Verify the Filter Panel after linking to another target dashboard'
        );
        await dossierPage.goBackFromDossierLink();

        //Switch to Chapter 8 Page 1
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 8', pageName: 'Linking2' });
        await libraryPage.waitForCurtainDisappear();
        //RMC on Visualization 1 to go to target page
        await grid.linkToTargetByGridContextMenu({
            title: 'Visualization 1',
            headerName: 'Quarter',
            elementName: '2014 Q2',
        });
        await libraryPage.waitForCurtainDisappear();
        //Verify the target dashboard
        await since('Link to target dashboard from visualization 1, back icon should be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(true);
        await since('Link to another target dashboard, target page should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual(['(Auto) Dynamic Object Parameter FUN_target', 'Chapter 8', 'Page 1']);
        //Verify the grid
        await since('TC99448_08_08.Second Row in Visualization 1 should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 2))
            .toEqual(['2014 Q2', '$ 70']);
        await since('TC99448_08_09.First Row in Visualization 2 should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 2', 1))
            .toEqual(['Category Id', 'Tot Cost']);
        //Verify the in-canvas selector
        const ICSAttribute2 = InCanvasSelector.createByTitle('TimeDataset');
        const ICSMetirc2 = InCanvasSelector.createByTitle('TotMetricOP');
        await ICSAttribute2.click({ elem: ICSAttribute2.getTitle() });
        await ICSAttribute2.hoverMouseOnElement(ICSAttribute2.getTitle());
        await ICSAttribute2.openContextMenu();
        //Verify the context menu
        await since('TC99448_08_10.TimeDataset context menu should contain Reset to Default')
            .expect(await ICSAttribute.getContextMenuOption('Reset to Default').isDisplayed())
            .toBe(true);
        await ICSMetirc2.click({ elem: ICSMetirc2.getTitle() });
        await ICSMetirc2.hoverMouseOnElement(ICSMetirc2.getTitle());
        await ICSMetirc2.openContextMenu();
        //Verify the context menu
        await since('TC99448_08_10.TotMetricOP context menu should contain Reset to Default')
            .expect(await ICSMetirc2.getContextMenuOption('Reset to Default').isDisplayed())
            .toBe(true);
        await dossierPage.goBackFromDossierLink();

        //Verify Selection Required
        await ICSAttribute2.selectItemWithExactName('Quarter');
        await ICSMetirc2.selectItemWithExactName('Tot Cost');
        await takeScreenshotByElement(
            await dossierAuthoringPage.getDossierView(),
            'TC99448_08_11_Selection Required',
            'Verify the Selection Required message after selecting items'
        );
        //Switch to Chapter 7
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 7', pageName: 'Linking1' });
        await libraryPage.waitForCurtainDisappear();
        //Verify the results
        await since('TC99448_08_12.First Row in Visualization 1 should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 1))
            .toEqual(['Unit Cost']);
        await since('TC99448_08_13.First Row in Visualization 2 should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 2', 1))
            .toEqual(['Category Id']);
        //Verify filter panel
        await filterPanel.openFilterPanel();
        await takeScreenshotByElement(
            await filterPanel.getFilterPanelDropdown(),
            'TC99448_08_14_Filter Panel',
            'Verify the Filter Panel is displayed correctly after uncheck all elements'
        );
        //Enable dynamic selection for TimeDataset and TotMetricOP
        await checkboxFilter.openSecondaryPanel('TotMetricOP');
        await filterElement.clickFooterButton('Reset');
        await checkboxFilter.openContextMenu('TimeDataset');
        await checkboxFilter.selectContextMenuOption('TimeDataset', 'Reset to First 1');
        await takeScreenshotByElement(
            await filterPanel.getFilterPanelDropdown(),
            'TC99448_08_15_Filter Panel',
            'Filter Panel with Dynamic Selections after reset to First 1'
        );
        await filterPanel.apply();
        await libraryPage.waitForCurtainDisappear();
        //Verify the results
        await since('TC99448_08_16.First Row in Visualization 1 should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 1))
            .toEqual(['Month', 'Unit Cost']);
        await since('TC99448_08_17.First Row in Visualization 2 should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 2', 1))
            .toEqual(['Category Id', 'Tot Cost']);
        //Verify the filter summary bar
        await since('Filter Summary of TimeDataset should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('TimeDataset'))
            .toEqual('(Month)');   
        await since('Filter Summary of TotMetricOP should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('TotMetricOP'))
            .toEqual('(Tot Cost)');
    });
});
