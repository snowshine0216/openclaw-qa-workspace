import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import CheckBox from '../../../pageObjects/selector/CheckBox.js';
import RadioButton from '../../../pageObjects/selector/RadioButton.js';
import RsdGrid from '../../../pageObjects/document/RsdGrid.js';

describe('Link Drill', () => {
    const tutorialProject = {
        id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
        name: 'MicroStrategy Tutorial',
    };

    const sampleRSD = {
        id: 'E0A287A543C415BDE985778B5CFD7764',
        name: 'Sample RSD with selector and link drill',
        project: tutorialProject,
    };

    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1600,
        height: 1200,
    };

    let { libraryPage, loginPage, toc, dossierPage, grid, promptEditor, selectorObject, selector, rsdGrid } =
        browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(browsers.params.credentials);
    });

    beforeEach(async () => {
        await resetDossierState({
            credentials: browsers.params.credentials,
            dossier: sampleRSD,
        });
        await libraryPage.openDossier(sampleRSD.name);
        await toc.openPageFromTocMenu({ chapterName: 'LinkDrill' });
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC65587_01] Verify carry over prompt answer via link drill', async () => {
        // Tap '2014' grid cell same from source
        let grid = rsdGrid.getRsdGridByKey('W0DD775C0454E486E8B2B713A3BC1435C');
        await grid.clickCell('2014');
        await dossierPage.waitForPageLoadByTitle('Target_Sample RSD with prompt_CheckboxSelector_UC');
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await since(
            'For link drill with prompt same as source, the prompt answer for [Subcategory] should be default values: #{expected}, instead we have #{actual}'
        )
            .expect(await promptEditor.checkListSummary('Subcategory'))
            .toEqual(
                "Art & Architecture, Business, Literature, Books - Miscellaneous, Science & Technology, Sports & Health, Audio Equipment, Cameras, Computers, Electronics - Miscellaneous, TV's, Video Equipment, Action, Comedy, Drama, Horror, Kids / Family, Special Interests, Alternative, Country, Music - Miscellaneous, Pop, Rock, Soul / R&B"
            );
        await promptEditor.cancelEditor();
        await dossierPage.goBackFromDossierLink();

        // Tap 'Electronics' grid cell prompt user
        await dossierPage.waitForDossierLoading();
        grid = rsdGrid.getRsdGridByKey('W0DD775C0454E486E8B2B713A3BC1435C');
        await grid.scrollInGridToTop();
        await grid.clickCell('Electronics');
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

        // Tap 'Computers' grid cell answer dynamically
        grid = rsdGrid.getRsdGridByKey('W0DD775C0454E486E8B2B713A3BC1435C');
        await grid.scrollInGridToTop();
        await grid.clickCell('Computers');
        await dossierPage.waitForPageLoadByTitle('Target_Sample RSD with prompt_CheckboxSelector_UC');
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await since(
            'For link drill with answer dynamically, the prompt answer for [Subcategory] should be default values: #{expected}, instead we have #{actual}'
        )
            .expect(await promptEditor.checkListSummary('Subcategory'))
            .toEqual('Computers');
        await promptEditor.cancelEditor();
        await dossierPage.goBackFromDossierLink();

        // Tab '$401,786' grid cell default answer
        grid = rsdGrid.getRsdGridByKey('W0DD775C0454E486E8B2B713A3BC1435C');
        await grid.clickCell('$401,786');
        await dossierPage.waitForPageLoadByTitle('Target_Sample RSD with prompt_CheckboxSelector_UC');
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await since(
            'For link drill with default answer, the prompt answer for [Subcategory] should be default values: #{expected}, instead we have #{actual}'
        )
            .expect(await promptEditor.checkListSummary('Subcategory'))
            .toEqual('Art & Architecture, Cameras, Action, Country, Books - Miscellaneous');
        await promptEditor.cancelEditor();
        await dossierPage.goBackFromDossierLink();

        // Tab '$487,359' grid cell empty answer
        grid = rsdGrid.getRsdGridByKey('W0DD775C0454E486E8B2B713A3BC1435C');
        await grid.clickCell('$487,359');
        await dossierPage.waitForPageLoadByTitle('Target_Sample RSD with prompt_CheckboxSelector_UC');
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await since(
            'For link drill with empty answer, the prompt answer for [Subcategory] should be default values: #{expected}, instead we have #{actual}'
        )
            .expect(await promptEditor.checkEmptySummary('Subcategory'))
            .toEqual('No Selection');
        await promptEditor.cancelEditor();
        await dossierPage.goBackFromDossierLink();
    });

    it('[TC65587_02] Verify carry over selector via URL API by ID on Library RSD ', async () => {
        await selector.checkbox.clickItems(['(All)']);
        await selector.dropdown.openDropdown();
        await selector.dropdown.selectItemByText('Literature');
        await dossierPage.clickBtnByTitle('Carry over selector by ID_URLAPI_Excluded_Library');
        await dossierPage.waitForPageLoadByTitle('Target_Sample RSD with prompt_CheckboxSelector_Excluded_CGB');
        await since('Items in checkBox selector - Books should not be checked in target')
            .expect(await selector.checkbox.isItemsChecked(['Books']))
            .toBe(false);
        await since('Items in checkBox selector - Total should not be checked in target')
            .expect(await selector.checkbox.isItemsChecked(['Total']))
            .toBe(false);
        await dossierPage.goBackFromDossierLink();

        await selector.checkbox.clickItems(['(All)', 'Total']);
        await dossierPage.clickBtnByTitle('Carry over selector by ID_URLAPI_Excluded_Library');
        await dossierPage.waitForPageLoadByTitle('Target_Sample RSD with prompt_CheckboxSelector_Excluded_CGB');
        await since('Items in checkBox selector - Books should be checked in target')
            .expect(await selector.checkbox.isItemsChecked(['Books']))
            .toBe(true);
        await since('Items in checkBox selector - Total should not be checked in target')
            .expect(await selector.checkbox.isItemsChecked(['Total']))
            .toBe(false);
        await dossierPage.goBackFromDossierLink();

        const dropdown1 = selectorObject.getDropDownById('W9CCA338B929D44CDB139111D94BFB275');
        await dropdown1.openDropdown();
        await dropdown1.selectItemByText('(All)');
        await selector.checkbox.clickItems(['Books', 'Electronics']);
        await dossierPage.clickBtnByTitle('Carry over selector by ID_URLAPI_Excluded_Library');
        await dossierPage.waitForPageLoadByTitle('Target_Sample RSD with prompt_CheckboxSelector_Excluded_CGB');
        await since('Items in checkBox selector - Movies and Music should not be checked in target')
            .expect(await selector.checkbox.isItemsChecked(['Movies', 'Music']))
            .toBe(true);
        await dossierPage.goBackFromDossierLink();
    });

    it('[TC65587_03] Verify carry over selector via Editlink by name opened in new window on Library RSD', async () => {
        await selector.checkbox.clickItems(['(All)']);
        await dossierPage.clickBtnByTitle('Carry over selector by Name_EditLink_NewWindow');
        let newWindowIndex = await dossierPage.switchToTab(1);
        await dossierPage.waitForPageLoadByTitle('Target_Sample RSD with prompt_CheckboxSelector_UC');
        await dossierPage.waitForDynamicElementLoading();
        let checkbox = new CheckBox();
        let targetRsdGrid = new RsdGrid();
        await targetRsdGrid.waitForGridLoaded();
        const value = await checkbox.isItemsChecked(['(All)', 'Books', 'Electronics', 'Movies', 'Music']);
        await since('Items in checkBox selector - all selections should be selected')
            .expect(await checkbox.isItemsChecked(['(All)', 'Books', 'Electronics', 'Movies', 'Music']))
            .toBe(true);
        await dossierPage.closeTab(newWindowIndex);

        // check 'Books', 'Electronics', 'Movies', 'Music' in source rsd.
        await selector.checkbox.clickItems(['Total']);
        await dossierPage.clickBtnByTitle('Carry over selector by Name_EditLink_NewWindow');
        newWindowIndex = await dossierPage.switchToTab(1);
        await dossierPage.waitForPageLoadByTitle('Target_Sample RSD with prompt_CheckboxSelector_UC');
        targetRsdGrid = new RsdGrid();
        await targetRsdGrid.waitForGridLoaded();
        checkbox = new CheckBox();
        await since('Items in checkBox selector - Books, Electronics, Movies, Music should be selected')
            .expect(await checkbox.isItemsChecked(['Books', 'Electronics', 'Movies', 'Music']))
            .toBe(true);
        await dossierPage.closeTab(newWindowIndex);

        // check 'Books', 'Movies', 'Total' in source rsd
        await selector.checkbox.clickItems(['Music', 'Electronics', 'Total']);
        await dossierPage.clickBtnByTitle('Carry over selector by Name_EditLink_NewWindow');
        newWindowIndex = await dossierPage.switchToTab(1);
        await dossierPage.waitForPageLoadByTitle('Target_Sample RSD with prompt_CheckboxSelector_UC');
        targetRsdGrid = new RsdGrid();
        await targetRsdGrid.waitForGridLoaded();
        checkbox = new CheckBox();
        await since('Items in checkBox selector - Books, Movies should be checked in target')
            .expect(await checkbox.isItemsChecked(['Books', 'Movies']))
            .toBe(true);
        await dossierPage.closeTab(newWindowIndex);

        // check 'Books' in source rsd
        await selector.checkbox.clickItems(['Movies', 'Total']);
        await dossierPage.clickBtnByTitle('Carry over selector by Name_EditLink_NewWindow');
        await dossierPage.switchToTab(1);
        newWindowIndex = await dossierPage.switchToTab(1);
        await dossierPage.waitForPageLoadByTitle('Target_Sample RSD with prompt_CheckboxSelector_UC');
        targetRsdGrid = new RsdGrid();
        await targetRsdGrid.waitForGridLoaded();
        checkbox = new CheckBox();
        await since('Items in checkBox selector - Books should be checked in target')
            .expect(await checkbox.isItemsChecked(['Books']))
            .toBe(true);
        await dossierPage.closeTab(newWindowIndex);
    });

    it('[TC65587_04] Carry over selector multi_to_single via Editlink by name on Library RSD', async () => {
        await selector.checkbox.clickItems(['Books']);
        await dossierPage.clickBtnByTitle('Carry over selector by Name_EditLink_ToSingle');
        await dossierPage.waitForPageLoadByTitle('Target_Sample RSD with prompt_RadioButtonSelector_CGB');
        await since(
            'Items in radio button selector - no selector should be checked in target should be #{expected} instead of #{actual}'
        )
            .expect(await selector.radiobutton.isEmptySelector())
            .toBe(true);
        await dossierPage.goBackFromDossierLink();

        let checkbox = new CheckBox();
        let radiobutton = new RadioButton();
        await checkbox.clickItems(['Electronics', 'Total']);
        await dossierPage.clickBtnByTitle('Carry over selector by Name_EditLink_ToSingle');
        await dossierPage.waitForPageLoadByTitle('Target_Sample RSD with prompt_RadioButtonSelector_CGB');
        since('Items in radio button selector - Books should be checked in target should be #{expected} instead of #{actual}')
            .expect(await radiobutton.getSelectedItemText())
            .toBe('Books');
        await dossierPage.goBackFromDossierLink();
    });
});
