import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { customCredentials } from '../../../constants/index.js';
import InCanvasSelector from '../../../pageObjects/selector/InCanvasSelector.js';

const specConfiguration = { ...customCredentials('_AI') };

describe('Context for AI chatbot', () => {
    const project = {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    };
    const AIDossier = {
        id: 'FCD448414BD4C7590BF1EBB154051D18',
        name: '(AUTO) AI Dossier Context - Grid',
        project,
    };
    const AIDossier_Prompt = {
        id: '568E958843CA1F0707BE909927DB1978',
        name: '(AUTO) AI Dossier Context - Prompt',
        project,
    };
    const bot = {
        id: '508A72F24F46ACB95FE63A988A61A7BC',
        name: 'Android Bot - Bot in Library',
        project,
    };


    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    const { credentials } = specConfiguration;

    let {
        loginPage,
        bookmark,
        dossierPage,
        libraryPage,
        toc,
        reset,
        grid,
        aiAssistant,
        filterPanel,
        promptEditor,
        userAccount,
        share,
        quickSearch,
        fullSearch,
        groupDiscussion,
        excelExportPanel,
        showDataDialog,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
        await libraryPage.refresh();
    });

    it('[TC91240] AI Assistant - Select context - different entries in grid to select context ', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: AIDossier,
        });

        await libraryPage.openDossier(AIDossier.name);

        // open AI assistant
        await aiAssistant.open();
        await aiAssistant.pin();

        await toc.openPageFromTocMenu({ chapterName: 'viz', pageName: 'Grid' }); // grid

        // left click - by viz value
        await grid.selectGridElement({ title: 'Grid', headerName: 'Year', elementName: '2020' }); // select
        await since('Click grid value, Grid selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('Grid'))
            .toBe(true);
        await since('Click grid value, selected context should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getContext())
            .toBe('Grid');
        await grid.sleep(1000); // wait selected status completed due to delay mechanism

        // // left click - by viz header
        await grid.selectGridElement({ title: 'Compound Grid', headerName: 'Category' });
        await since('Click grid  header, Compound Grid selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('Compound Grid'))
            .toBe(true);
        await since('Click grid  header, selected context should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getContext())
            .toBe('Compound Grid');
        await grid.sleep(1000); // wait selected status completed due to delay mechanism

        // left click - by viz title
        await grid.clickVisualizationTitle('Grid (Modern)');
        await since('Click viz title, Grid (Modern) selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('Grid (Modern)'))
            .toBe(true);
        await since('Click viz title, selected context should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getContext())
            .toBe('Grid (Modern)');

        // left click - maximum
        await grid.maximizeContainer('Grid');
        await since('Maxmum viz , Grid selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('Grid'))
            .toBe(true);
        await since('Maxmum viz , selected context should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getContext())
            .toBe('Grid');
        // -- minimum
        await grid.maximizeContainer('Grid');
        await since('Minimum viz , Grid selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('Grid'))
            .toBe(true);
        await since('Minimum viz , selected context should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getContext())
            .toBe('Grid');

        // left click - setting
        await grid.openMenuOnVisualization('Compound Grid');
        await since('Click viz setting menu, Compound Grid selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('Compound Grid'))
            .toBe(true);
        await since('Click viz setting menu, selected context should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getContext())
            .toBe('Compound Grid');
    });

    it('[TC91241] AI Assistant - Clear context - clear context by asisstant buttons and viz title ', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: AIDossier,
        });

        await libraryPage.openDossier(AIDossier.name);

        // open AI assistant
        await aiAssistant.open();
        await aiAssistant.pin();

        await toc.openPageFromTocMenu({ chapterName: 'viz', pageName: 'Grid' }); // grid
        // deselect by clicking same viz title
        await grid.selectGridElement({ title: 'Grid', headerName: 'Year', elementName: '2020' }); // select
        await since('Click grid value, Grid selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('Grid'))
            .toBe(true);
        await dossierPage.sleep(2000); // wait selected status completed due to delay mechanism
        await grid.clickVisualizationTitle('Grid'); // deselect
        await since('Click viz title again, Grid selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('Grid'))
            .toBe(false);
        await since('Click viz title again, AI context present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isContextPresent())
            .toBe(false);

        // // deselect by clear history -- now clear button is disabled if no question sent
        // await grid.selectGridElement({ title: 'Grid', headerName: 'Year', elementName: '2020' }); // select
        // await since('Click viz title, Grid selected should be #{expected}, while we get #{actual}')
        //     .expect(await grid.isContainerSelected('Grid'))
        //     .toBe(true);
        // await aiAssistant.clear(); // deselect
        // await since('Clear history, Grid selected should be #{expected}, while we get #{actual}')
        //     .expect(await grid.isContainerSelected('Grid'))
        //     .toBe(false);
        // await since('Clear history, AI context present should be #{expected}, while we get #{actual}')
        //     .expect(await aiAssistant.isContextPresent())
        //     .toBe(false);

        // deselect by delete context
        await grid.selectGridElement({ title: 'Grid', headerName: 'Year', elementName: '2020' }); // select
        await since('Click viz title, Grid selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('Grid'))
            .toBe(true);
        await aiAssistant.deleteContext(); // deselect
        await since('Delete context, Grid selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('Grid'))
            .toBe(false);
        await since('Delete context, AI context present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isContextPresent())
            .toBe(false);
        await grid.selectGridElement({ title: 'Grid', headerName: 'Year', elementName: '2020' }); // re-select grid
        await since('Re-select grid, Grid selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('Grid'))
            .toBe(true);
        await since('Re-select grid, AI context should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getContext())
            .toBe('Grid');

        // deselect by close chatbot
        await aiAssistant.close(); // deselect
        await since('Close chatbot, Grid selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('Grid'))
            .toBe(false);
        await aiAssistant.open(); // reopen chatbot
        await aiAssistant.input('test');
        await since('Re-open chatbot, AI context present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isContextPresent())
            .toBe(false);
    });

    it('[TC91242] AI Assistant - Clear context - clear by navigation bar: bookmark,rest,toc,redo/undo,filter,prompt ', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: AIDossier_Prompt,
        });

        const bookmarkName = 'AITest';
        await libraryPage.openDossierAndRunPrompt(AIDossier_Prompt.name);

        // open AI assistant
        await aiAssistant.open();
        await aiAssistant.pin();

        // reset context by switch page
        await toc.openPageFromTocMenu({ chapterName: 'viz', pageName: 'Grid' }); // grid
        await grid.selectGridElement({ title: 'Grid', headerName: 'Year', elementName: '2020' });
        await since('Click viz title, Grid selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('Grid'))
            .toBe(true);
        await toc.openPageFromTocMenu({ chapterName: 'viz', pageName: 'Line' });
        await since('Switch page, AI context present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isContextPresent())
            .toBe(false);
        await toc.openPageFromTocMenu({ chapterName: 'viz', pageName: 'Grid' }); //switch back
        await since('Switch page back, Grid selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('Grid'))
            .toBe(false);

        //reset context by undo & redo when page key changed
        await grid.selectGridElement({ title: 'Grid', headerName: 'Year', elementName: '2020' });
        await since('Click viz title, Grid selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('Grid'))
            .toBe(true);
        await dossierPage.clickUndo();
        await toc.openPageFromTocMenu({ chapterName: 'viz', pageName: 'Grid' }); //switch back
        await since('Undo to change pagekey, Grid selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('Grid'))
            .toBe(false);

        //reset context by reset dossier
        await grid.selectGridElement({ title: 'Grid', headerName: 'Year', elementName: '2020' });
        await since('Click viz title, Grid selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('Grid'))
            .toBe(true);
        await reset.selectReset();
        await reset.confirmReset();
        await promptEditor.run();
        await since('Switch page, AI context present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isContextPresent())
            .toBe(false);
        await since('Switch page back, Grid selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('Grid'))
            .toBe(false);

        //reset context by bookmark
        await grid.selectGridElement({ title: 'Grid', headerName: 'Year', elementName: '2020' });
        await since('Click viz title, Grid selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('Grid'))
            .toBe(true);
        await bookmark.openPanel();
        await bookmark.applyBookmark(bookmarkName);
        await bookmark.ignoreSaveReminder();
        await since('Switch bookmark, AI context present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isContextPresent())
            .toBe(false);
        await since('Switch bookmark, Grid selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('Grid'))
            .toBe(false);

        // reset context by filter
        await grid.selectGridElement({ title: 'Grid', headerName: 'Year', elementName: '2020' });
        await since('Click viz title, Grid selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('Grid'))
            .toBe(true);
        //-- click view all
        await filterPanel.openFilterPanel();
        await filterPanel.clearFilter();
        await filterPanel.apply();
        await since('Change filter, AI context present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isContextPresent())
            .toBe(false);
        await since('Change filter, Grid selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('Grid'))
            .toBe(false);

        // reset by re-prompt
        await grid.selectGridElement({ title: 'Grid', headerName: 'Year', elementName: '2020' });
        await since('Click viz title, Grid selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('Grid'))
            .toBe(true);
        await promptEditor.reprompt();
        await promptEditor.run();
        await since('Reprompt, AI context present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isContextPresent())
            .toBe(false);
        await since('Reprompt, Grid selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('Grid'))
            .toBe(false);

        await aiAssistant.close();
    });

    it('[TC91141] AI Assistant - Clear context - clear by dossier manipulation: in-canvas selector', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: AIDossier,
        });

        await libraryPage.openDossier(AIDossier.name);

        // open AI assistant
        await aiAssistant.open();
        await aiAssistant.pin();

        await toc.openPageFromTocMenu({ chapterName: 'xfunc', pageName: 'Selector' });
        const attributeSelector = InCanvasSelector.createByTitle('Attribute');
        const valueSelector = InCanvasSelector.createByTitle('Category');
        const searchSelector = InCanvasSelector.createByTitle('Subcategory');

        // attribute selector
        /// -- change attribute selectorx
        await grid.selectGridElement({ title: 'Visualization 1', headerName: 'Category', elementName: 'Books' });
        await since('Click grid value, Grid selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('Visualization 1'))
            .toBe(true);
        await attributeSelector.selectItem('Year');
        await since('Change attribute selector, AI context present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isContextPresent())
            .toBe(false);
        await since('Change attribute selector, Grid selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('Visualization 1'))
            .toBe(false);
        //// -- unset attribute selector
        await grid.selectGridElement({ title: 'Visualization 1', headerName: 'Category', elementName: 'Books' });
        await since('Click grid value, Grid selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('Visualization 1'))
            .toBe(true);
        await attributeSelector.openContextMenu();
        await attributeSelector.selectOptionInMenu('Unset Selector');
        await since('Unset selector, AI context present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isContextPresent())
            .toBe(false);
        await since('Unset selector, Grid selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('Visualization 1'))
            .toBe(false);

        // value selector
        /// -- change value selector
        await grid.selectGridElement({ title: 'Visualization 1', headerName: 'Category', elementName: 'Books' });
        await since('Click grid value, Grid selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('Visualization 1'))
            .toBe(true);
        await valueSelector.openDropdownMenu();
        await valueSelector.selectDropdownItems(['Movies']);
        await valueSelector.clickDropdownBtn('OK');
        await since('Change value selector, AI context present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isContextPresent())
            .toBe(false);
        await since('Change value selector, Grid selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('Visualization 1'))
            .toBe(false);
        //// -- unset filter
        await grid.selectGridElement({ title: 'Visualization 1', headerName: 'Category', elementName: 'Books' });
        await since('Click grid value, Grid selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('Visualization 1'))
            .toBe(true);
        await valueSelector.openContextMenu();
        await valueSelector.selectOptionInMenu('Unset Filter');
        await since('Unset filter, AI context present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isContextPresent())
            .toBe(false);
        await since('Unset filter, Grid selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('Visualization 1'))
            .toBe(false);

        // searchbox selector
        //// -- change searchbox selector
        await grid.selectGridElement({ title: 'Visualization 1', headerName: 'Category', elementName: 'Books' });
        await since('Click grid value, Grid selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('Visualization 1'))
            .toBe(true);
        await searchSelector.searchSearchbox('Business');
        await searchSelector.selectSearchBoxItem('Business');
        await since('Change value selector, AI context present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isContextPresent())
            .toBe(false);
        await since('Change value selector, Grid selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('Visualization 1'))
            .toBe(false);
        //// -- Exclude
        await grid.selectGridElement({ title: 'Visualization 1', headerName: 'Category', elementName: 'Books' });
        await since('Click grid value, Grid selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('Visualization 1'))
            .toBe(true);
        await valueSelector.openContextMenu();
        await valueSelector.selectOptionInMenu('Exclude');
        await since('Exclude filter, AI context present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isContextPresent())
            .toBe(false);
        await since('Exclude filter, Grid selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('Visualization 1'))
            .toBe(false);

        await aiAssistant.close();
    });

    it('[TC91258] AI Assistant - Clear context - clear by dossier manipulation: dossier linking ', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: AIDossier,
        });

        await libraryPage.openDossier(AIDossier.name);

        // open AI assistant
        await aiAssistant.open();
        await aiAssistant.pin();

        await toc.openPageFromTocMenu({ chapterName: 'xfunc', pageName: 'Linking' });

        // page linking
        await grid.selectGridElement({ title: 'page linking', headerName: 'Category', elementName: 'Books' });
        await since('Click grid value 1, Grid selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('page linking'))
            .toBe(true);
        await grid.linkToTargetByGridContextMenu({
            title: 'page linking',
            headerName: 'Category',
            elementName: 'Books',
        });
        await since('Page linking, AI context present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isContextPresent())
            .toBe(false);
        await toc.openPageFromTocMenu({ chapterName: 'xfunc', pageName: 'Linking' });
        await since('page linking, Grid selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('page linking'))
            .toBe(false);

        // link to other dossier
        await grid.selectGridElement({ title: 'linking to others', headerName: 'Category', elementName: 'Books' });
        await since('Click grid value 2, Grid selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('linking to others'))
            .toBe(true);
        await grid.linkToTargetByGridContextMenu({
            title: 'linking to others',
            headerName: 'Category',
            elementName: 'Movies',
        });
        await dossierPage.goBackFromDossierLink();
        await dossierPage.waitForCurtainDisappear();
        await since('Linking to other dossier, AI context present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isContextPresent())
            .toBe(false);
        await since('Linking to other dossier, Grid selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('linking to others'))
            .toBe(false);

        // link to itself
        await aiAssistant.open();
        await aiAssistant.pin();
        await grid.selectGridElement({ title: 'linking to itself', headerName: 'Category', elementName: 'Books' });
        await since('Click grid value 3, Grid selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('linking to itself'))
            .toBe(true);
        await grid.linkToTargetByGridContextMenu({
            title: 'linking to itself',
            headerName: 'Category',
            elementName: 'Books',
        });
        await dossierPage.goBackFromDossierLink();
        await since('Linking to itself, AI context present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isContextPresent())
            .toBe(false);
        await since('Linking to itself, Grid selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('linking to itself'))
            .toBe(false);

        await aiAssistant.close();
    });

    it('[TC91243] AI Assistant - Keep context - manipulation on navigation bar: comment, share, account', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: AIDossier,
        });

        await libraryPage.openDossier(AIDossier.name);

        // open AI assistant
        await aiAssistant.open();
        await aiAssistant.pin();
        // -- select context
        await toc.openPageFromTocMenu({ chapterName: 'viz', pageName: 'Grid' });
        await grid.selectGridElement({ title: 'Grid', headerName: 'Year', elementName: '2020' });

        // comment panel
        await groupDiscussion.openCommentsPanel();
        await groupDiscussion.openDiscussionTab();
        await since('open comment panel, Grid selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('Grid'))
            .toBe(true);
        await since('open comment panel, AI context should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getContext())
            .toBe('Grid');
        await groupDiscussion.closeCommentsPanel();

        // share panel - share dossier
        await dossierPage.openShareDropDown();
        await share.openShareDossierDialog();
        await since('open share dossier, Grid selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('Grid'))
            .toBe(true);
        await since('open share dossier, AI context should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getContext())
            .toBe('Grid');
        await share.closeShareDossierPanel();
        await share.closeSharePanel();

        // share panel - export to excel
        await dossierPage.openShareDropDown();
        await since('open share panel, Grid selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('Grid'))
            .toBe(true);
        await share.clickExportToExcel();
        await since('open export to excel, AI context should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getContext())
            .toBe('Grid');
        await since('open export to excel, Compound Grid selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('Grid'))
            .toBe(true);
        await share.closeSharePanel();
        await since('close share panel, Grid selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('Grid'))
            .toBe(true);
        await since('close share panel, AI context should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getContext())
            .toBe('Grid');

        // account panel
        await userAccount.openUserAccountMenu();
        await userAccount.openPreferencePanel();
        await since('open account panel, Grid selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('Grid'))
            .toBe(true);
        await since('Open account panel,  AI context should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getContext())
            .toBe('Grid');
        await userAccount.closeUserAccountMenu();

        await aiAssistant.close();
    });

    it('[TC91244] AI Assistant - Keep context - manipulation on grid: keep only, sort, drill, etc (currect viz and other viz)', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: AIDossier,
        });

        await libraryPage.openDossier(AIDossier.name);

        // open AI assistant
        await aiAssistant.open();
        await aiAssistant.pin();
        // -- select context
        await toc.openPageFromTocMenu({ chapterName: 'viz', pageName: 'Grid' });
        await grid.selectGridElement({ title: 'Grid', headerName: 'Year', elementName: '2020' });

        // manipulation(right-click) on current viz
        //// -- sort
        await grid.selectGridContextMenuOption({ title: 'Grid', headerName: 'Year', firstOption: 'Sort Ascending' });
        await since('sort on current viz, Grid selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('Grid'))
            .toBe(true);
        await since('sort on current viz, AI context should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getContext())
            .toBe('Grid');
        //// -- keep only
        await grid.selectGridContextMenuOption({
            title: 'Grid',
            headerName: 'Year',
            elementName: '2020',
            firstOption: 'Keep Only',
        });
        await since('keep only on current viz, Grid selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('Grid'))
            .toBe(true);
        await since('keep only on current viz, AI context should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getContext())
            .toBe('Grid');
        //// -- drill
        await grid.selectGridContextMenuOption({
            title: 'Grid',
            headerName: 'Year',
            elementName: '2020',
            firstOption: 'Drill',
            secondOption: 'Quarter',
        });
        await since('drill on current viz, Grid selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('Grid'))
            .toBe(true);
        await since('drill on current viz, AI context should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getContext())
            .toBe('Grid');
        //// -- clear view filter
        await grid.openViewFilterContainer('Grid');
        await grid.clearViewFilter('Clear All');
        await since('clear view filter on current viz, Grid selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('Grid'))
            .toBe(true);
        await since('clear view filter on current viz, AI context should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getContext())
            .toBe('Grid');

        // manipulation(right-click) on other viz
        //// -- show data
        await grid.selectGridContextMenuOption({
            title: 'Compound Grid',
            headerName: 'Category',
            elementName: 'Movies',
            firstOption: 'Show Data',
        });
        await showDataDialog.clickShowDataCloseButton();
        await since('show data on other viz, Grid selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('Grid'))
            .toBe(true);
        await since('show data on other viz, AI context should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getContext())
            .toBe('Grid');
        //// -- exclude
        await grid.selectGridContextMenuOption({
            title: 'Compound Grid',
            headerName: 'Category',
            elementName: 'Movies',
            firstOption: 'Exclude',
        });
        await since('exclude on other viz, Grid selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('Grid'))
            .toBe(true);
        await since('exclude on other viz, AI context should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getContext())
            .toBe('Grid');

        await aiAssistant.close();
    });

    it('[TC91245] AI Assistant - manipulation on AI recommendation: expand, collapse, refresh', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: AIDossier,
        });

        await libraryPage.openDossier(AIDossier.name);

        // pin, unpin
        await aiAssistant.open();
        await aiAssistant.pin();
        await toc.openPageFromTocMenu({ chapterName: 'viz', pageName: 'Grid' });

        // by default
        await since('By default, the recommendation should be collapsed, it is #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isRecommendationCollapsed())
            .toBe(false);
        await since('By default, the Recommendation refresh disable should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isRecommendationRefreshDisabled())
            .toBe(false);

        // collapse
        await aiAssistant.collapseRecommendation();
        await since('Collapse recommendation, the collapsed should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isRecommendationCollapsed())
            .toBe(true);
        await since(
            'Collapse recommendation, the Recommendation refresh disable should be #{expected}, while we get #{actual}'
        )
            .expect(await aiAssistant.isRecommendationRefreshDisabled())
            .toBe(true);

        // expand
        await aiAssistant.expandRecommendation();
        await since('Expand recommendation, the icon collapsed should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isRecommendationCollapsed())
            .toBe(false);
        await since(
            'Expand recommendation, the Recommendation refresh disable should be #{expected}, while we get #{actual}'
        )
            .expect(await aiAssistant.isRecommendationRefreshDisabled())
            .toBe(false);

        // input question
        await aiAssistant.input('test recommendation collapse');
        await since('Input question, the icon collapsed should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isRecommendationCollapsed())
            .toBe(true);
        await since('Input question, the Recommendation refresh disable should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isRecommendationRefreshDisabled())
            .toBe(true);

        // expand and then sent question
        await aiAssistant.expandRecommendation();
        await since(
            'Expand recommendation before sending question, the icon collapsed should be #{expected}, while we get #{actual}'
        )
            .expect(await aiAssistant.isRecommendationCollapsed())
            .toBe(false);
        await aiAssistant.sendQuestion();
        await aiAssistant.cancelQuestion();
        await aiAssistant.waitForCurtainDisappear();
        await since('Send question, the icon collapsed should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isRecommendationCollapsed())
            .toBe(false);

        await aiAssistant.close();
    });

    xit('[TC97353_10] Global Search - Validate search object ID on My Library and All tab - bot', async () => {
        await quickSearch.openSearchSlider();
        await quickSearch.inputText(bot.id);
        await since(
            `Search by ${bot.id}, search suggestion text items count should be #{expected}, while we get #{actual}`
        )
            .expect(await quickSearch.getSearchSuggestionTextItems().length)
            .toBe(1);
        await since(
            `Search by ${bot.id}, search suggestion shortcut items count should be #{expected}, while we get #{actual}`
        )
            .expect(await quickSearch.getSearchSuggestionShortcutsItems().length)
            .toBe(1);
        await quickSearch.clickViewAll();

        // check result result on full screen search page
        await quickSearch.clickSearchSlider();
        const myLibCount = await fullSearch.getMyLibraryCount();
        const allCount = await fullSearch.getAllTabCount();
        await since(
            `Search by ${bot.id}, search results count on My Library tab should be #{expected}, while we get #{actual}`
        )
            .expect(myLibCount)
            .toBe(1);
        await since(
            `Search by ${bot.id}, search results count on All tab should be greater than #{expected}, while we get #{actual}`
        )
            .expect(allCount)
            .toBe(1);
    });
});

export const config = specConfiguration;
