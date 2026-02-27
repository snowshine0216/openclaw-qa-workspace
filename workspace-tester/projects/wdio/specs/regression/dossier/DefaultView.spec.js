import { customCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';
import resetBookmarksWithPrompt from '../../../api/resetBookmarksWithPrompt.js';

const specConfiguration = { ...customCredentials('_defaultview') };

describe('X-Func for Base View vs Last View', () => {
    const project = {
        id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
        name: 'MicroStrategy Tutorial',
    };

    const autoRefresh_Base = {
        id: '02BEB1B2465FDA9DDE74EB90692BD057',
        name: 'Auto_BaseView_AutoRefresh',
        project: project,
    };

    const withoutPromt_Base = {
        id: 'E391B4AD415EF5E8D6C65BAF296F202D',
        name: 'Auto_BaseView_DossierWithoutPrompt',
        project: project,
    };

    const rsd_Base = {
        id: '86B4DFB748F9B01410D30F874DAF9BDC',
        name: 'Auto_BaseView_RSD',
        project: project,
    };

    const useCurrentAnswer = {
        id: '98D4E709477488CE41E60A97DBFDA0CE',
        name: 'Auto_X-Func_UseCurrentAnswer',
        project: project,
    };

    const shareBookmark_Base = {
        id: '67FFACA14901875E760ED5A430853B71',
        name: 'Auto_X-Func_ShareBookmark',
        project: project,
    };

    const doNotDisplay = {
        id: '000CB1BF42002C49C090999CB9A20DCF',
        name: 'Auto_X-Func_DoNotDisplay',
        project: project,
    };

    const discardCurrentAnswers = {
        id: '79A9C3FA4261B85DAFA242811E5D8734',
        name: 'Auto_X-Func_DiscardCurrentAnswers',
        project: project,
    };

    const dossier_Base = {
        id: '67206CCB4354228F55C857A047C8CE72',
        name: 'Auto_BaseView_Dossier',
        project: project,
    };

    const dossier_Last = {
        id: 'B0DB48344671B27800F7088F47E5CBE1',
        name: 'Auto_LastView_Dossier',
        project: project,
    };

    let {
        libraryPage,
        infoWindow,
        toc,
        dossierPage,
        filterPanel,
        checkboxFilter,
        promptEditor,
        bookmark,
        filterSummaryBar,
        promptObject,
        selectorObject,
        grid,
        lineChart,
        pieChart,
        reset,
        rsdGrid,
        showDataDialog,
        loginPage,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);
        await resetBookmarksWithPrompt({ credentials: specConfiguration.credentials, dossier: dossier_Base });
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC70781_01] Validate X-func for Default View on Library Web Working as expected- Auto Refresh', async () => {
        await resetDossierState({ credentials: specConfiguration.credentials, dossier: autoRefresh_Base });

        // Open Dossier and manipulate: switch page and exclude
        await libraryPage.openDossier(autoRefresh_Base.name);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 2' });
        await lineChart.exclude({ vizName: 'Line chart', eleName: `TV's`, lineName: '2015' });
        await dossierPage.waitForDossierLoading();

        // Sleep to auto refresh
        await dossierPage.sleep(5000);

        // Check dossier status
        await since(
            'For Auto Refresh Dossier, View Filter present supposed to be #{expected} elements, instead we get #{actual}'
        )
            .expect(await grid.isViewFilterPresent('Line chart'))
            .toBe(true);
        await since('Page title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual(['Auto_BaseView_AutoRefresh', 'Chapter 1', 'Page 2']);
    });

    it('[TC70781_02] Validate X-func for Default View on Library Web Working as expected- Reset', async () => {
        await resetDossierState({ credentials: specConfiguration.credentials, dossier: withoutPromt_Base });
        await libraryPage.openDossier(withoutPromt_Base.name);

        // Open Dossier and manipulate: switch page and Keep only
        await toc.openPageFromTocMenu({ chapterName: 'Auto_BaseView_Dossier', pageName: 'Page 2' });
        await pieChart.keepOnly({ title: 'Pie chart', slice: 'Cameras' });
        await dossierPage.goToLibrary();

        // Reset button is not disabled in info window for dossier without prompt
        await libraryPage.moveDossierIntoViewPort(withoutPromt_Base.name);
        await libraryPage.openDossierInfoWindow(withoutPromt_Base.name);
        await since('isResetDisabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.isResetDisabled())
            .toBe(false);
        await infoWindow.close();

        // Reset button is disabled when open base dossier without prompt
        await libraryPage.openDossier(withoutPromt_Base.name);
        await since('ResetDisabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reset.isResetDisabled())
            .toBe(true);
    });

    it('[TC70781_03] Validate X-func for Default View on Library Web Working as expected - Dossier Linking', async () => {
        await resetDossierState({ credentials: specConfiguration.credentials, dossier: dossier_Base });

        // Open rsd and manipulate: switch layout, Re-prompt, change filter
        await libraryPage.openDossierAndRunPrompt(dossier_Base.name);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();
        await filterPanel.clearFilter();
        await filterPanel.apply();

        // Linking
        await grid.openGridElmContextMenu({
            title: 'Grid',
            headerName: 'Subcategory',
            elementName: 'Audio Equipment',
        });
        await grid.linkToTargetByGridContextMenu({
            title: 'Grid',
            headerName: 'Subcategory',
            elementName: 'Audio Equipment',
        });

        // Back to source to check source dossier status
        await dossierPage.goBackFromDossierLink();
        await since('Base dossier after linking prompt show should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
    });

    it('[TC70781_04] Validate X-func for Default View on Library Web Working as expected - Link Drill', async () => {
        await resetDossierState({ credentials: specConfiguration.credentials, dossier: rsd_Base });

        // Open Dossier and manipulate: switch page, change selector
        await libraryPage.openDossierAndRunPrompt(rsd_Base.name);
        await toc.openPageFromTocMenu({ chapterName: 'LinkDrill' });
        await selectorObject.checkbox.clickItems(['(All)']);

        // Linkdrill
        await dossierPage.clickBtnByTitle('Carry over selector by ID_URLAPI_Excluded_Library');
        await dossierPage.waitForPageLoadByTitle('Target_Sample RSD with prompt_CheckboxSelector_Excluded_CGB');

        // Back to source to check source RSD status
        await dossierPage.goBackFromDossierLink();
        await since('Base RSD after link Drill prompt show should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.isEditorOpen())
            .toBe(true);
        await promptEditor.run();
        await since('Base View RSD title after linkdrill should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual(['Selector']);
    });

    it('[TC70781_05] Validate X-func for Default View on Library Web Working as expected - Bookmark', async () => {
        await resetDossierState({ credentials: specConfiguration.credentials, dossier: dossier_Base });
        await libraryPage.openDossierAndRunPrompt(dossier_Base.name);

        // Open Dossier and manipulate: create bookmark, apply bookmark
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 2' });
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('Quarter');
        await checkboxFilter.selectAll();
        await filterPanel.apply();

        // - create bookmark
        await bookmark.openPanel();
        await bookmark.addNewBookmark('');
        await dossierPage.goToLibrary();

        // Re-open Dossier to check status
        await libraryPage.openDossier(dossier_Base.name);
        await since('Base dossier with bookmark prompt show should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.isEditorOpen())
            .toBe(true);
        await promptEditor.run();
        await bookmark.openPanel();
        await since('Current bookmark number #{expected}, instead we have #{actual}')
            .expect(await bookmark.bookmarkCount())
            .toBe(1);
    });

    it('[TC70781_07] Validate X-func for Default View on Library Web Working as expected - useCurrentAnswer Prompt', async () => {
        const panelSelector = selectorObject.getButtonbarByName('panelSelector');
        await resetDossierState({ credentials: specConfiguration.credentials, dossier: useCurrentAnswer });

        // Open rsd and manipulate: change Selector
        await libraryPage.openDossierAndRunPrompt(useCurrentAnswer.name);
        await panelSelector.selectItemByText('Details- By Month');
        await selectorObject.listbox.multiSelect(['Mar', 'Apr', 'Jun']);
        await dossierPage.goToLibrary();

        // Re-open Rsd to check status
        await libraryPage.openDossier(useCurrentAnswer.name);
        await since('useCurrentAnswer prompt editor show should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.isEditorOpen())
            .toBe(true);
        await promptEditor.run();
        const panelSelector2 = selectorObject.getButtonbarByName('panelSelector');
        await panelSelector2.selectItemByText('Details- By Month');
        await since('After multi-select,items in listbox selector-[Mar 2014,Apr 2014, Jun 2014] should be selected')
            .expect(await selectorObject.listbox.isItemSelected(7, 'Jun 2014'))
            .toBe(true);
    });

    it('[TC70781_08] Validate X-func for Default View on Library Web Working as expected - doNotDisplay Prompt', async () => {
        await resetDossierState({ credentials: specConfiguration.credentials, dossier: doNotDisplay });

        // Open rsd and manipulate: switch layout, re-prompt, link drill
        await libraryPage.openDossier(doNotDisplay.name);
        await toc.openPageFromTocMenu({ chapterName: 'LinkDrill' });
        await promptEditor.reprompt();
        const attrQua = await promptObject.getPromptByName('Attribute qualification');
        await promptObject.selectPromptByIndex({ index: '4', promptName: 'Attribute qualification' });
        await promptObject.shoppingCart.clickElmInAvailableList(attrQua, 'Category');
        await promptObject.shoppingCart.addSingle(attrQua);
        await promptObject.shoppingCart.openFormDropdown(attrQua, 1);
        await promptObject.shoppingCart.selectForm(attrQua, 'DESC');
        await promptObject.shoppingCart.openConditionDropdown(attrQua, 1);
        await promptObject.shoppingCart.selectCondition(attrQua, 'Does not equal');
        await promptObject.shoppingCart.openValuePart1Editor(attrQua, 1);
        await promptObject.shoppingCart.inputValues(attrQua, 'Music');
        await promptObject.shoppingCart.confirmValues(attrQua);
        await promptEditor.run();
        await promptEditor.waitForEditorClose();
        rsdGrid = rsdGrid.getRsdGridByKey('W0DD775C0454E486E8B2B713A3BC1435C');
        await rsdGrid.clickCell('Electronics');
        await dossierPage.waitForPageLoadByTitle('Target_Sample RSD with prompt_CheckboxSelector_UC');
        await promptEditor.waitForEditor();
        await promptEditor.toggleViewSummary();
        await since(
            'For link drill with promot user, the prompt answer for [Subcategory] should be default values: #{expected}, instead we have #{actual}'
        )
            .expect(await promptEditor.checkListSummary('Subcategory'))
            .toEqual('Art & Architecture, Cameras, Action, Country, Books - Miscellaneous');
        await promptEditor.run();
        await dossierPage.goBackFromDossierLink();
        await since('doNotDisplay after linkdrill prompt editor show should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await dossierPage.goToLibrary();

        // Re-open RSD to check status
        await libraryPage.openDossier(doNotDisplay.name);
        await since('doNotDisplay after re-open prompt editor show should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await since('AQ prompt answer should be #{expected} but is #{actual}')
            .expect(await promptEditor.checkEmptySummary('Attribute qualification'))
            .toEqual('No Selection');
        await promptEditor.run();
    });

    it('[TC70781_09] Validate X-func for Default View on Library Web Working as expected - discardCurrentAnswers Prompt', async () => {
        await resetDossierState({ credentials: specConfiguration.credentials, dossier: discardCurrentAnswers });

        // Open rsd and manipulate: Drill
        await libraryPage.openDossierAndRunPrompt(discardCurrentAnswers.name);
        await grid.selectGridContextMenuOption({
            title: 'Grid',
            headerName: 'Category',
            elementName: 'Electronics',
            firstOption: 'Drill',
            secondOption: 'Day',
        });
        await dossierPage.goToLibrary();
        // Re-open Dossier to check status
        await libraryPage.openDossier(discardCurrentAnswers.name);
        await since('useCurrentAnswer prompt editor show should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.isEditorOpen())
            .toBe(true);
        await promptEditor.run();
    });

    it('[TC70781_10] Validate X-func for Default View on Library Web Working as expected - show data', async () => {
        await resetDossierState({ credentials: specConfiguration.credentials, dossier: dossier_Base });

        // Open rsd and manipulate: switch page and show data
        await libraryPage.openDossierAndRunPrompt(dossier_Base.name);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 2' });
        await pieChart.exclude({ title: 'Pie chart', slice: `TV's` });
        await pieChart.selectShowDataOnVisualizationMenu('Pie chart');
        await since('There should be #{expected} rows in dataset, instead we have #{actual} rows')
            .expect(await showDataDialog.getDatasetRowCount())
            .toBe(4);
        await showDataDialog.clickShowDataCloseButton();
        await dossierPage.waitForPageLoading();
        await dossierPage.goToLibrary();

        // Re-open Dossier to check status
        await libraryPage.openDossierAndRunPrompt(dossier_Base.name);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 2' });
        await pieChart.selectShowDataOnVisualizationMenu('Pie chart');
        await since('There should be #{expected} rows in dataset, instead we have #{actual} rows')
            .expect(await showDataDialog.getDatasetRowCount())
            .toBe(5);
        await showDataDialog.clickShowDataCloseButton();
        await dossierPage.waitForPageLoading();
    });
});

export const config = specConfiguration;
