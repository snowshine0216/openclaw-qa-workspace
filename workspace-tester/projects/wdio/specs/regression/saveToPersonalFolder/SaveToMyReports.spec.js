import resetDossierState from '../../../api/resetDossierState.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import deleteObjectsByFolder  from '../../../api/folderManagement/deleteObjectsByFolder.js';
import { customCredentials } from '../../../constants/index.js';
import resetReportState from '../../../api/reports/resetReportState.js';

const specConfiguration = { ...customCredentials('_personal') };
const specConfiguration_NoSaveToMyReportPrivillege = { ...customCredentials('_personal_nosavetomyreport') };
const specConfiguration_NoSaveDashboardPrivillege = { ...customCredentials('_personal_nosavedashboard') };
const specConfiguration_SaveToSharedReportsPrivillege = { ...customCredentials('_personal_withsavetosharedreport') };

describe('Save to my personal folder', () => {
    const dossier = {
        id: '767A52594FF3ED057B239EA69E50E460',
        name: 'Dashboard without prompt',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };
    const dossierNotInLibrary = {
        id: 'EAED56A241B6F62ECF09769202F165C6',
        name: 'Dashboard not in library',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };
    const dossierWithPrompt_ShowPromptWithoutDefault = {
        id: '27EF13F8498244CE509A44A18AF7BB88',
        name: 'Dashboard with prompt_ShowPromptWithoutDefault',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };
    const document = {
        id: '7345B0AE46C2A644D6FC26A56F34BCD5',
        name: 'RWD without prompt',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const documentWithPrompt_ShowPromptWithDefault = {
        id: 'EC07382E475D6CF580D01B8B16B9E8E2',
        name: 'RWD with PromptInPrompt_ShowPromptWithDefault',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const documentWithPrompt_Static = {
        id: 'A4569F5149C5E5FB2496E78797DA0B81',
        name: 'RWD with PromptInPrompt_StaticPrompt',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const report = {
        id: 'EFF0614F49963C80A12750A6C7F39541',
        name: 'DS Report',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const reportWithPrompt = {
        id: 'C5F94AED42406B3F36B1ACB0734DD78C',
        name: 'DS Report with Prompt',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };
    const promptName = 'Category';
    let {
        loginPage,
        grid,
        checkboxFilter,
        libraryPage,
        dossierPage,
        filterPanel,
        reset,
        promptEditor,
        prompt,
        promptObject,
        filterSummaryBar,
        libraryAuthoringPage,
        sidebar,
        contentDiscovery,
        listViewAGGrid,
        selector,
        rsdGrid,
    } = browsers.pageObj1;
    let cart = promptObject.shoppingCart;
    const customAppIdOfShowContentDiscovery = 'A44AFBF7D6A648FB83438C4FB43170F3';
    const customAppIdOfDisableDuplicate = '9370D2D121A242CA9A35D5C9426EF1B4';
    const { credentials } = specConfiguration;
    const { credentials: noSaveToMyReportCredentials } = specConfiguration_NoSaveToMyReportPrivillege;
    const { credentials: noSaveDashboardCredentials } = specConfiguration_NoSaveDashboardPrivillege;
    const { credentials: saveToSharedReportsCredentials } = specConfiguration_SaveToSharedReportsPrivillege;
    const { credentials: adminCredentials } = {
        credentials: {
            username: 'xyi',
            password: '',
        },
    };

    beforeAll(async () => {
        await loginPage.login(credentials);
        await libraryPage.openCustomAppById({ id: customAppIdOfShowContentDiscovery });
    });

    beforeEach(async () => {
         // delete all objects for my folder
         await deleteObjectsByFolder({
            credentials: credentials,
            parentFolderId: '57CB713E4720D770F5585E82559EDBF6',
            projectId: dossier.project.id,
        });
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
        await libraryPage.openUserAccountMenu();
        await libraryPage.logout();
        await libraryPage.executeScript('window.localStorage.clear();');
        await loginPage.login(credentials);
    });

    it('[TC98195_01] Verify AI consumer user duplicate report/rwd/dashboard to my personal folder on library web', async () => {
        // reset all objects
        await resetDossierState({
            credentials: credentials,
            dossier: dossier,
        });

        await resetDossierState({
            credentials: credentials,
            dossier: document,
        });

        await resetReportState({
            credentials: credentials,
            report: report,
        });



        // duplicate dossier
        await libraryPage.openDossier(dossier.name, 'Xueli Yi');
        await dossierPage.clickDuplicateButton();

        // check save as dialog
        since('Defalt selection in save as dialog should be #{expected}, instead we have #{actual}')
            .expect(await libraryAuthoringPage.getSaveInFolderSelectionText()).toBe('My Reports');
        since ('Dropdown options in save as dialog should be #{expected}, instead we have #{actual}')
            .expect(await libraryAuthoringPage.getSaveInFolderDropdownOptionsText()).toEqual(['My Reports']);
        since ('New Folder button display for dossier in save as dialog should be #{expected}, instead we have #{actual}')
            .expect(await libraryAuthoringPage.isNewFolderButtonDisplayed()).toBe(false);
        await takeScreenshotByElement(await libraryAuthoringPage.getSaveAsEditor(), 'TC98195','Duplicate Dialog_AIUser' );
        await libraryAuthoringPage.saveInMyReport(dossier.name);
        since('Add to library banner display should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isAddToLibraryDisplayed()).toBe(false);
        await dossierPage.goToLibrary();
        
        // duplicate rwd
        await libraryPage.openDossier(document.name, 'Xueli Yi');
        await dossierPage.clickDuplicateButton();

        // check save as dialog
        since('Defalt selection in save as dialog should be #{expected}, instead we have #{actual}')
            .expect(await libraryAuthoringPage.getSaveInFolderSelectionText()).toBe('My Reports');
        since ('Dropdown options in save as dialog should be #{expected}, instead we have #{actual}')
            .expect(await libraryAuthoringPage.getSaveInFolderDropdownOptionsText()).toEqual(['My Reports']);
        since ('New Folder button display for rwd in save as dialog should be #{expected}, instead we have #{actual}')
            .expect(await libraryAuthoringPage.isNewFolderButtonDisplayed()).toBe(false);
        await libraryAuthoringPage.saveInMyReport(document.name);
        since('Add to library banner display should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isAddToLibraryDisplayed()).toBe(false);
        await dossierPage.goToLibrary();

        // duplicate report
        await libraryPage.openDossier(report.name);
        await dossierPage.clickDuplicateButton();

        // check save as dialog
        since('Defalt selection in save as dialog should be #{expected}, instead we have #{actual}')
            .expect(await libraryAuthoringPage.getSaveInFolderSelectionText()).toBe('My Reports');
        since ('Dropdown options in save as dialog should be #{expected}, instead we have #{actual}')
            .expect(await libraryAuthoringPage.getSaveInFolderDropdownOptionsText()).toEqual(['My Reports']);
        since ('New Folder button display in save as dialog should be #{expected}, instead we have #{actual}')
            .expect(await libraryAuthoringPage.isNewFolderButtonDisplayed()).toBe(false);
        await libraryAuthoringPage.saveInMyReport(report.name);
        await dossierPage.goToLibrary();

        // check cancel duplicate report
        await libraryPage.openDossier(report.name, 'Xueli Yi');
        await dossierPage.clickDuplicateButton();
        await libraryAuthoringPage.cancelSaveAs();
        // then do the manipulation on report then 
        await grid.selectGridContextMenuOption({
            title: 'Visualization 1',
            headerName: 'Category',
            firstOption: 'Sort Descending',
            agGrid: true,
        });
        
        await dossierPage.goToLibrary();
            
        // check My Reports folder
        await libraryPage.openSidebarOnly();
        await sidebar.openContentDiscovery();
        await contentDiscovery.openFolderByPath(['My Reports']);
        since('Dossier count in my reports folder should be #{expected}, instead we have #{actual}')
            .expect(await listViewAGGrid.getAGGridItemCount()).toBe(3);
        



    });

    it('[TC98195_02] Verify duplicate short-cut view on library web', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossier,
        });
        
        // open dossier and do some manipulation
        await libraryPage.openDossier(dossier.name, 'Xueli Yi');
        await dossierPage.switchPageByKey('left', '3000');
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('Category');
        await checkboxFilter.selectElementByName('Electronics');
        await filterPanel.apply();

        // duplicate dossier 
        await dossierPage.clickDuplicateButton();
        await libraryAuthoringPage.saveInMyReport(dossier.name);

        // do manipulation on the duplicated dossier
        await dossierPage.switchPageByKey('right', '3000');
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('Category');
        await checkboxFilter.selectElementByName('Movies');
        await filterPanel.apply();
        await dossierPage.goToLibrary();

        // open the duplicated dossier and check short-cut view
        await libraryPage.openDossier(dossier.name, credentials.username);
        since ('Page title for updated duplicated dossier should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle()).toEqual(['Dashboard without prompt', 'Chapter 2', 'Page 2']);
        since ('Filter summary for updated duplicated dossier should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterSummaryBarText()).toBe('Category(Movies)');
        
        // check duplicated dossier base-view data
        await reset.selectReset();
        await reset.confirmReset();
        since ('Page title for base duplicated dossier should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle()).toEqual(['Dashboard without prompt', 'Chapter 1', 'Page 1']);
        since ('Filter summary for base duplicated dossier should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterSummaryBarText()).toBe('Category(Electronics)');
        await dossierPage.goToLibrary();

        // reset the base dossier and check data
        await resetDossierState({
            credentials: credentials,
            dossier: dossier,
        });
        await libraryPage.openDossier(dossier.name, 'Xueli Yi');
        since ('Page title for base source dossier should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle()).toEqual(['Dashboard without prompt', 'Chapter 2', 'Page 2']);
        since ('Filter summary for base source dossier should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterSummaryBarText()).toBe('No filter selections');

    });

    it('[TC98195_03] Verify duplicate dossier with prompt - with default answer on library web', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: documentWithPrompt_ShowPromptWithDefault,
        });

        const categoryPrompt = 'Category';
        const itemPrompt = 'Item';
        const subCategoryPrompt = 'Subcategory';

        // duplicate dossier with prompt
        await libraryPage.openDossierNoWait(documentWithPrompt_ShowPromptWithDefault.name, 'Hu Xing');
        await promptEditor.run();
        await promptEditor.run();

        // change prompt anwser and duplicate dossier
        await promptEditor.reprompt();
        const category = await promptObject.getPromptByName(categoryPrompt);
        await cart.clickElmInAvailableList(category, 'Movies');
        await cart.addSingle(category);
        await promptEditor.run();
        await promptEditor.waitForEditor();
        const item = promptObject.getPromptByName(itemPrompt);
        await cart.clickElmInAvailableList(item, 'Art As Experience');
        await cart.addSingle(item);
        const subCategory = promptObject.getPromptByName(subCategoryPrompt);
        await cart.clickElmInAvailableList(subCategory, 'Art & Architecture');
        await cart.addSingle(subCategory);
        await promptEditor.run();
        await dossierPage.clickDuplicateButton();
        await takeScreenshotByElement(await libraryAuthoringPage.getSaveAsEditor(), 'TC98195','Duplicate Dialog_PromptWithDefault' );
        await libraryAuthoringPage.saveInMyReport(documentWithPrompt_ShowPromptWithDefault.name);

        // change prompt anwser for duplicate dossier
        await promptEditor.reprompt();
        await cart.addAll(category);
        await promptEditor.run();
        await promptEditor.waitForEditor();
        await cart.clickElmInAvailableList(item, '100 Places to Go While Still Young at Heart');
        await cart.addSingle(item);
        await cart.clickElmInAvailableList(item, 'Art As Experience');
        await cart.addSingle(item);
        await cart.clickElmInAvailableList(subCategory, 'Art & Architecture');
        await cart.addSingle(subCategory);
        await promptEditor.run();
        await dossierPage.goToLibrary();

        // check duplicated dossier short-cut view with prompt
        await libraryPage.openDossier(documentWithPrompt_ShowPromptWithDefault.name, credentials.username);
        const grid = rsdGrid.getRsdGridByKey('K44');
        await since('The 2nd row of grid data should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(2))
            .toEqual(['Books', 'Art & Architecture', '100 Places to Go While Still Young at Heart']);
        await since('The 3nd row of grid data should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(3))
            .toEqual(['Art As Experience']);
    
        // check duplicated dossier base view
        await reset.selectReset();
        await reset.confirmReset();
        await promptEditor.waitForEditor();
        await promptEditor.toggleViewSummary();
        since('The default answer of category of base duplicate rwd should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary(categoryPrompt))
            .toEqual('Books, Movies');
        await promptEditor.run();
        await promptEditor.waitForEditor();
        await promptEditor.toggleViewSummary();
        since('The default answer of item of base duplicate rwd should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary(itemPrompt))
            .toEqual('Art As Experience');
        since('The default answer of subcategory of base duplicate rwdshould be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary(subCategoryPrompt))
            .toEqual('Art & Architecture');
        await promptEditor.cancelEditor();
        await dossierPage.goToLibrary();

        // check base view of source dossier with prompt
        await libraryPage.openDossier(documentWithPrompt_ShowPromptWithDefault.name, 'Hu Xing');
        await reset.selectReset();
        await reset.confirmReset();
        await promptEditor.waitForEditor();
        await promptEditor.toggleViewSummary();
        since('The default answer of category of base source rwd should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary(categoryPrompt))
            .toEqual('Books');
        await promptEditor.run();
        await promptEditor.waitForEditor();
        await promptEditor.toggleViewSummary();
        since('The default answer of item of base source rwd should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary(itemPrompt))
            .toEqual('100 Places to Go While Still Young at Heart');
        since('The default answer of subcategory of base source rwd should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary(subCategoryPrompt))
            .toEqual('Art & Architecture');
        await promptEditor.cancelEditor();

        // check My Reports folder
        await libraryPage.openSidebarOnly();
        await sidebar.openContentDiscovery();
        await contentDiscovery.openFolderByPath(['My Reports']);
        since('Dossier count in my reports folder should be #{expected}, instead we have #{actual}')
            .expect(await listViewAGGrid.getAGGridItemCount()).toBe(1);

    });

    it('[TC98195_04] Verify duplicate dossier with prompt - without default answer on library web', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossierWithPrompt_ShowPromptWithoutDefault,
        });

        const yearPrompt = 'Year';

        // duplicate dossier with prompt
        await libraryPage.openDossierNoWait(dossierWithPrompt_ShowPromptWithoutDefault.name, 'Xueli Yi');
        await promptEditor.run();

        // change prompt anwser and duplicate dossier
        await promptEditor.reprompt();
        const year = await promptObject.getPromptByName(yearPrompt);
        await cart.clickElmInAvailableList(year, '2014');
        await cart.addSingle(year);
        await promptEditor.run();
        await dossierPage.clickDuplicateButton();
        await takeScreenshotByElement(await libraryAuthoringPage.getSaveAsEditor(), 'TC98195','Duplicate Dialog_PromptWithOutDefault' );
        await libraryAuthoringPage.saveInMyReport(dossierWithPrompt_ShowPromptWithoutDefault.name);

        // change prompt anwser for duplicate dossier
        await promptEditor.reprompt();
        await cart.clickElmInAvailableList(year, '2015');
        await cart.addSingle(year);
        await promptEditor.run();
        await dossierPage.goToLibrary();

        // check duplicated dossier short-cut view with prompt
        await libraryPage.openDossier(dossierWithPrompt_ShowPromptWithoutDefault.name, credentials.username);
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        since('The default answer of year for shor-cut duplicate dashboard should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary(yearPrompt))
            .toEqual('2014, 2015');
        await promptEditor.cancelEditor();
    
        // check duplicated dossier base view
        await reset.selectReset();
        await reset.confirmReset();
        await promptEditor.waitForEditor();
        await promptEditor.toggleViewSummary();
        since('The default answer of year for base duplicate rwd should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary(yearPrompt))
            .toEqual('2014');
        await promptEditor.cancelEditor();
        await dossierPage.goToLibrary();

        // check base view of source dossier with prompt
        await libraryPage.openDossier(dossierWithPrompt_ShowPromptWithoutDefault.name, 'Xueli Yi');
        await reset.selectReset();
        await reset.confirmReset();
        await promptEditor.waitForEditor();
        await promptEditor.toggleViewSummary();
        since('The default answer of year for base source rwd should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary(yearPrompt))
            .toEqual('');
        await promptEditor.cancelEditor();

        // check My Reports folder
        await libraryPage.openSidebarOnly();
        await sidebar.openContentDiscovery();
        await contentDiscovery.openFolderByPath(['My Reports']);
        since('Dossier count in my reports folder should be #{expected}, instead we have #{actual}')
            .expect(await listViewAGGrid.getAGGridItemCount()).toBe(1);

    });

    it('[TC98195_05] Verify duplicate document with prompt - with static answer on library web', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: documentWithPrompt_Static,
        });

        const categoryPrompt = 'Category';
        const itemPrompt = 'Item';
        const subCategoryPrompt = 'Subcategory';

        // duplicate dossier with prompt
        await libraryPage.openDossierNoWait(documentWithPrompt_Static.name, 'Xueli Yi');
    
        // change prompt anwser and duplicate dossier
        await promptEditor.reprompt();
        const category = await promptObject.getPromptByName(categoryPrompt);
        await cart.clickElmInAvailableList(category, 'Movies');
        await cart.addSingle(category);
        await promptEditor.run();
        await promptEditor.waitForEditor();
        const item = promptObject.getPromptByName(itemPrompt);
        await cart.clickElmInAvailableList(item, 'Art As Experience');
        await cart.addSingle(item);
        const subCategory = promptObject.getPromptByName(subCategoryPrompt);
        await cart.clickElmInAvailableList(subCategory, 'Art & Architecture');
        await cart.addSingle(subCategory);
        await promptEditor.run();
        await dossierPage.clickDuplicateButton();
        await takeScreenshotByElement(await libraryAuthoringPage.getSaveAsEditor(), 'TC98195','Duplicate Dialog_PromptWithStatic' );
        await libraryAuthoringPage.saveInMyReport(documentWithPrompt_Static.name);

        // change prompt anwser for duplicate dossier
        await promptEditor.reprompt();
        await cart.addAll(category);
        await promptEditor.run();
        await promptEditor.waitForEditor();
        await cart.clickElmInAvailableList(item, '100 Places to Go While Still Young at Heart');
        await cart.addSingle(item);
        await cart.clickElmInAvailableList(item, 'Art As Experience');
        await cart.addSingle(item);
        await cart.clickElmInAvailableList(subCategory, 'Art & Architecture');
        await cart.addSingle(subCategory);
        await promptEditor.run();
        await dossierPage.goToLibrary();

        // check duplicated dossier short-cut view with prompt
        await libraryPage.openDossier(documentWithPrompt_Static.name, credentials.username);
        const grid = rsdGrid.getRsdGridByKey('K44');
        await since('The 2nd row of grid data should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(2))
            .toEqual(['Books', 'Art & Architecture', '100 Places to Go While Still Young at Heart']);
        await since('The 3nd row of grid data should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(3))
            .toEqual(['Art As Experience']);
    
        // check duplicated dossier base view
        await reset.selectReset();
        await reset.confirmReset();
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        since('The default answer of category of base duplicate rwd should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary(categoryPrompt))
            .toEqual('Books, Movies');
        await promptEditor.run();
        await promptEditor.waitForEditor();
        await promptEditor.toggleViewSummary();
        since('The default answer of item of base duplicate rwd should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary(itemPrompt))
            .toEqual('Art As Experience');
        since('The default answer of subcategory of base duplicate rwdshould be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary(subCategoryPrompt))
            .toEqual('Art & Architecture');
        await promptEditor.cancelEditor();
        await dossierPage.goToLibrary();

        // check base view of source dossier with prompt
        await libraryPage.openDossier(documentWithPrompt_Static.name, 'Xueli Yi');
        await reset.selectReset();
        await reset.confirmReset();
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        since('The default answer of category of base source rwd should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary(categoryPrompt))
            .toEqual('Books');
        await promptEditor.run();
        await promptEditor.waitForEditor();
        await promptEditor.toggleViewSummary();
        since('The default answer of item of base source rwd should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary(itemPrompt))
            .toEqual('100 Places to Go While Still Young at Heart');
        since('The default answer of subcategory of base source rwd should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary(subCategoryPrompt))
            .toEqual('Art & Architecture');
        await promptEditor.cancelEditor();

        // check My Reports folder
        await dossierPage.goToLibrary();
        await libraryPage.openSidebarOnly();
        await sidebar.openContentDiscovery();
        await contentDiscovery.openFolderByPath(['My Reports']);
        since('Dossier count in my reports folder should be #{expected}, instead we have #{actual}')
            .expect(await listViewAGGrid.getAGGridItemCount()).toBe(1);

    });

    it('[TC98195_06] Verify duplicate report with prompt - with default answer on library web', async () => {
        await resetReportState({
            credentials: credentials,
            report: reportWithPrompt,
        });

        const yearPrompt = 'Year';

        // duplicate dossier with prompt
        await libraryPage.openDossierNoWait(reportWithPrompt.name, 'Xueli Yi');
        await promptEditor.run();

        // change prompt anwser and duplicate dossier
        await promptEditor.reprompt();
        const year = await promptObject.getPromptByName(yearPrompt);
        await cart.clickElmInAvailableList(year, '2014');
        await cart.addSingle(year);
        await promptEditor.run();
        await dossierPage.clickDuplicateButton();
        await takeScreenshotByElement(await libraryAuthoringPage.getSaveAsEditor(), 'TC98195','Duplicate Dialog_PromptForReport' );
        await libraryAuthoringPage.saveInMyReport(reportWithPrompt.name);
        

        // change prompt anwser for duplicate dossier
        await promptEditor.reprompt();
        await cart.clickElmInAvailableList(year, '2015');
        await cart.addSingle(year);
        await promptEditor.run();
        await dossierPage.goToLibrary();

        // check duplicated dossier short-cut view with prompt
        await libraryPage.openDossier(reportWithPrompt.name, credentials.username);
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        since('The default answer of year for shor-cut duplicate dashboard should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary(yearPrompt))
            .toEqual('2014, 2015');
        await promptEditor.cancelEditor();
    
        // check duplicated dossier base view
        await reset.selectReset();
        await reset.confirmReset();
        await promptEditor.waitForEditor();
        await promptEditor.toggleViewSummary();
        since('The default answer of year for base duplicate rwd should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary(yearPrompt))
            .toEqual('2014');
        await promptEditor.cancelEditor();
        await dossierPage.goToLibrary();

        // check base view of source dossier with prompt
        await libraryPage.openDossier(reportWithPrompt.name, 'Xueli Yi');
        await reset.selectReset();
        await reset.confirmReset();
        await promptEditor.waitForEditor();
        await promptEditor.toggleViewSummary();
        since('The default answer of year for base source rwd should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary(yearPrompt))
            .toEqual('');
        await promptEditor.cancelEditor();

        // check My Reports folder
        await libraryPage.openSidebarOnly();
        await sidebar.openContentDiscovery();
        await contentDiscovery.openFolderByPath(['My Reports']);
        since('Dossier count in my reports folder should be #{expected}, instead we have #{actual}')
            .expect(await listViewAGGrid.getAGGridItemCount()).toBe(1);

    });



    it('[TC98195_07] Verify duplicate for user with no privilege on library web', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossier,
        });

        await libraryPage.switchUser(noSaveToMyReportCredentials);
        
        // open dossier and do some manipulation
        await libraryPage.openDossier(dossier.name);
        since('Duplicate button should not be displayed for user without save to my report privilege to be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isDuplicateButtonDisplayed()).toBe(false);
        await dossierPage.goToLibrary();

        // switch user of no save dashboard privilege
        await libraryPage.switchUser(noSaveDashboardCredentials);
        await libraryPage.openDossier(dossier.name);
        since('Duplicate button should not be displayed for user without save dashboard privilege to be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isDuplicateButtonDisplayed()).toBe(true);

    });

    it('[TC98195_08] Verify multi duplication on library web', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossier,
        });
        
        // open dossier and duplicate dossier
        await libraryPage.openDossier(dossier.name, 'Xueli Yi');
        await dossierPage.clickDuplicateButton();
        await libraryAuthoringPage.saveInMyReport(dossier.name);

        // duplicate the duplicated dossier with new name
        await dossierPage.clickDuplicateButton();
        await libraryAuthoringPage.saveInMyReport(dossier.name + '1');

        // duplicate the duplicated dossier with overwriting the existing one
        await dossierPage.clickDuplicateButton();
        await libraryAuthoringPage.saveInMyReport(dossier.name);


        // check the duplicated dossier count
        await dossierPage.goToLibrary();
        await libraryPage.openSidebarOnly();
        await sidebar.openContentDiscovery();
        await contentDiscovery.openFolderByPath(['My Reports']);
        since('Dossier count in my reports folder should be #{expected}, instead we have #{actual}')
            .expect(await listViewAGGrid.getAGGridItemCount()).toBe(2);

    });

    it('[TC98195_09] Verify duplication to other locations on library web', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossier,
        });

         // delete all objects for predefined folder
         await deleteObjectsByFolder({
            credentials: adminCredentials,
            parentFolderId: '77DFBBA74BD9F150726CBE86F94531A5',
            projectId: dossier.project.id,
        });

        // switch user of saved to shared reports privilege
        await libraryPage.switchUser(saveToSharedReportsCredentials);


        // open dossier and duplicate dossier
        await libraryPage.openDossier(dossier.name, 'Xueli Yi');
        await dossierPage.clickDuplicateButton();
        await takeScreenshotByElement(await libraryAuthoringPage.getSaveAsEditor(), 'TC98195','Duplicate Dialog_SharedReports' );
        since('Folder selection in save as dialog should be #{expected}, instead we have #{actual}')
            .expect(await libraryAuthoringPage.getSaveInFolderSelectionText()).toBe('Shared Reports');
        since ('Dropdown options in save as dialog should be #{expected}, instead we have #{actual}')
            .expect(await libraryAuthoringPage.getSaveInFolderDropdownOptionsText()).toEqual(['Shared Reports', 'My Reports']);

        // choose to predefined folder
        await libraryAuthoringPage.saveInMyReport(dossier.name, ['_REGRESSION TEST_', 'Library - SaveToPersonalFolder','SubFolder']);



        // check the duplicated dossier count
        await dossierPage.goToLibrary();
        await libraryPage.openSidebarOnly();
        await sidebar.openContentDiscovery();
        await contentDiscovery.openFolderByPath(['Shared Reports', '_REGRESSION TEST_', 'Library - SaveToPersonalFolder', 'SubFolder' ]);
        since('Dossier count in my reports folder should be #{expected}, instead we have #{actual}')
            .expect(await listViewAGGrid.getAGGridItemCount()).toBe(1);

    });

    it('[TC98195_10] Verify duplication for application and not in library home on library web', async () => {
        await libraryPage.openCustomAppById({ id: customAppIdOfDisableDuplicate });
    
        // open dossier and duplicate dossier
        await libraryPage.openDossier(dossier.name, 'Xueli Yi');
        since('Duplicate button should not be displayed for application disabled should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isDuplicateButtonDisplayed()).toBe(false);
        await dossierPage.goToLibrary();

        // switch to app enabled duplication
        await libraryPage.openCustomAppById({ id: customAppIdOfShowContentDiscovery });
        
        // open dossier which is not in library home
        const currentUrl = await browser.getUrl();
        const url = currentUrl + '/' + dossierNotInLibrary.project.id + '/' + dossierNotInLibrary.id;
        await browser.url(url.toString());
        await dossierPage.waitForDossierLoading();

        // duplicate dossier not in library home
        await dossierPage.clickDuplicateButton();

        await libraryAuthoringPage.saveInMyReport(dossierNotInLibrary.name);
        since('Add to library banner display should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isAddToLibraryDisplayed()).toBe(false);
        await dossierPage.goToLibrary();

        // check the source dossier not in library home
        since ('Dossier after duplication number should be should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.getItemsCount(dossierNotInLibrary.name)).toBe(1);
        
        // check duplicated dossier in side baar
        await libraryPage.openSidebarOnly();
        await sidebar.openContentDiscovery();
        await contentDiscovery.openFolderByPath(['My Reports']);
        since('Dossier count in my reports folder should be #{expected}, instead we have #{actual}')
            .expect(await listViewAGGrid.getAGGridItemCount()).toBe(1); 

    });

});

export const config = specConfiguration;
