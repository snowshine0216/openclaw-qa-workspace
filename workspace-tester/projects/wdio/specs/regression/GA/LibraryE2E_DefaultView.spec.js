import { customCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';
import { getStringOfDate } from '../../../utils/DateUtil.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_defaultview') };

describe('E2E test of Base View vs Last View', () => {
    const project = {
        id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
        name: 'MicroStrategy Tutorial',
    };

    const dossier_Base = {
        id: '67206CCB4354228F55C857A047C8CE72',
        name: 'Auto_BaseView_Dossier',
        project: project,
    };

    const rsd_Base = {
        id: '86B4DFB748F9B01410D30F874DAF9BDC',
        name: 'Auto_BaseView_RSD',
        project: project,
    };

    const dossier_Last = {
        id: 'B0DB48344671B27800F7088F47E5CBE1',
        name: 'Auto_LastView_Dossier',
        project: project,
    };

    const rsd_Last = {
        id: 'BEE9CF454EE20321FC76AFA7E4E9E979',
        name: 'Auto_LastView_RSD',
        project: project,
    };

    const useCurrentAnswer = {
        id: '98D4E709477488CE41E60A97DBFDA0CE',
        name: 'Auto_X-Func_UseCurrentAnswer',
        project: project,
    };

    const doNotDisplay = {
        id: '000CB1BF42002C49C090999CB9A20DCF',
        name: 'Auto_X-Func_DoNotDisplay',
        project: project,
    };

    const discardCurrentAnswers = {
        id: '33964EB34A3B90190E92DDB0237A7913',
        name: 'Auto_X-Func_DiscardCurrentAnswers',
        project: project,
    };

    const notInLibrary = {
        id: 'C73D25BC420A644B9A5207A48EF9BF26',
        name: 'Auto_BaseView_NotInLibrary',
        project: project,
    };

    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let {
        libraryPage,
        loginPage,
        infoWindow,
        sidebar,
        toc,
        dossierPage,
        filterPanel,
        checkboxFilter,
        promptEditor,
        cart,
        bookmark,
        promptObject,
        selectorObject,
        metricSlider,
        filterSummaryBar,
        panelSelector,
        quickSearch,
        fullSearch,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);
        await setWindowSize(browserWindow);
        await libraryPage.removeDossierFromLibrary(specConfiguration.credentials, notInLibrary);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    // Base View on Dossier
    // Base View on RSD
    // Last View on Dossier
    // Last View on RSD

    it('[TC70778_01] Validate End-to-End user journey for Default View on Library Web - Base View on Dossier', async () => {
        await resetDossierState({ credentials: specConfiguration.credentials, dossier: dossier_Base });
        // Open Dossier and manipulate: switch page, Re-prompt, change filter
        await libraryPage.openDossierAndRunPrompt(dossier_Base.name);
        // - switch page
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 2' });
        // - Re-prompt
        await promptEditor.reprompt();
        const prompt1 = await promptObject.getPromptByName('Category');
        await promptObject.shoppingCart.addAll(prompt1);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        // - Change filter -
        await filterPanel.openFilterPanel();
        await checkboxFilter.openContextMenu('Quarter');
        await checkboxFilter.selectContextMenuOption('Quarter', 'Exclude');
        await filterPanel.apply();
        await dossierPage.goToLibrary();
        // Re-open dossier to check
        await libraryPage.openDossier(dossier_Base.name);
        await promptEditor.waitForEditor();
        // - check prompt answer
        await since(
            'For Base View Dossier, Available cart is supposed to have #{expected} elements, instead we get #{actual}'
        )
            .expect(await promptObject.shoppingCart.getAvailableCartItemCount(prompt1))
            .toBe(2);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        // -check dossier page
        await since('Page title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual(['Auto_BaseView_Dossier', 'Chapter 1', 'Page 1']);
        // -check filter
        await since('The filterSummaryBar of Quarter is 2015 Q3, 2015 Q4')
            .expect(await filterSummaryBar.filterItems('Quarter'))
            .toBe('(2015 Q3, 2015 Q4)');
    });

    it('[TC70778_02] Validate End-to-End user journey for Default View on Library Web - Base View on RSD', async () => {
        await resetDossierState({ credentials: specConfiguration.credentials, dossier: rsd_Base });
        // Open rsd and manipulate: switch layout, Re-prompt, change filter
        await libraryPage.openDossierAndRunPrompt(rsd_Base.name);

        // - Change Selector -
        panelSelector = selectorObject.getButtonbarByName('panelSelector');
        await panelSelector.selectItemByText('Details- Subcategory');
        await selectorObject.linkbar.selectNthItem(4, 'Music');

        // - switch layout
        await toc.openPageFromTocMenu({ chapterName: 'LinkDrill' });

        // - Re-prompt
        await promptEditor.reprompt();
        const metricQua = await promptObject.getPromptByName('Metric qualification');
        await promptObject.selectPromptByIndex({ index: '5', promptName: 'Metric qualification' });
        await promptObject.qualPulldown.openDropDownList(metricQua);
        await promptObject.qualPulldown.selectDropDownItem(metricQua, 'Cost');
        await promptObject.qualPulldown.openMQConditionList(metricQua);
        await promptObject.qualPulldown.selectMQCondition(metricQua, 'Greater than');
        await promptObject.qualPulldown.clearAndInputLowserValue(metricQua, '400');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await dossierPage.goToLibrary();

        // Re-open dossier to check
        await libraryPage.openDossier(rsd_Base.name);
        await promptEditor.waitForEditor();

        // - check prompt answer
        await promptEditor.toggleViewSummary();
        await since('MQ prompt answer should be #{expected} but is #{actual}')
            .expect(await promptEditor.checkEmptySummary('Metric qualification'))
            .toEqual('No Selection');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();

        // -check RSD page
        await since('RSD title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual(['Selector']);

        // -check Selector
        panelSelector = selectorObject.getButtonbarByName('panelSelector');
        await panelSelector.selectItemByText('Details- Subcategory');
        await since('Item in link bar selector - Music should be excluded')
            .expect(await selectorObject.linkbar.isItemSelected(4, 'Music'))
            .toBe(false);
    });

    it('[TC70778_03] Validate End-to-End user journey for Default View on Library Web - Dossier not in Library', async () => {
        // Search for dossier not in Library
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(notInLibrary.name);
        await fullSearch.clickAllTab();
        await fullSearch.openDossierFromSearchResults(notInLibrary.name);
        await fullSearch.switchToNewWindow();
        await since('Open dossier from search result, redirected page should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual([notInLibrary.name, 'Casino Overview', `KPI's & Machine Analysis`]);
        await since('Add to library button display should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isAddToLibraryDisplayed())
            .toBe(true);

        //add to library
        await dossierPage.addToLibrary();

        //Manipulate: switch page
        await toc.openPageFromTocMenu({ chapterName: 'Casino Overview', pageName: 'Term Glossary' });
        await fullSearch.closeCurrentTab();
        await fullSearch.switchToTab(0);
        await fullSearch.backToLibrary();

        //Reopen to check status
        await libraryPage.openDossier(notInLibrary.name);
        await since('Page title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual([notInLibrary.name, 'Casino Overview', `KPI's & Machine Analysis`]);
    });

    it('[TC70779_01] Validate End-to-End user journey for Default View on Library Web - Last View on Dossier', async () => {
        await resetDossierState({ credentials: specConfiguration.credentials, dossier: dossier_Last });

        // Open Dossier and manipulate: switch page, Re-prompt, change filter
        await libraryPage.openDossierAndRunPrompt(dossier_Last.name);

        // - switch page
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 2' });

        // - Re-prompt
        await promptEditor.reprompt();
        const costMQ = await promptObject.getPromptByName('Cost');
        await promptObject.shoppingCart.openConditionDropdown(costMQ, 1);
        await promptObject.shoppingCart.selectCondition(costMQ, 'Highest%');
        await promptObject.shoppingCart.openMQFirstValue(costMQ, 1);
        await promptObject.shoppingCart.clearAndInputValues(costMQ, '5');
        await promptObject.shoppingCart.confirmValues(costMQ);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();

        // - Change filter -
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('Quarter');
        await checkboxFilter.selectElementByName('2014 Q3');
        await filterPanel.apply();
        await dossierPage.goToLibrary();

        // Re-open dossier to check
        await libraryPage.openDossier(dossier_Last.name);
        await since('Last View-Dossiershould show prompt should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);

        // -check dossier page
        await since('Page title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual(['Auto_LastView_Dossier', 'Chapter 1', 'Page 2']);

        // -check filter
        await since('The filterSummaryBar of Quarter should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Quarter'))
            .toBe('(2014 Q3, 2015 Q3, +1)');

        // - check prompt answer
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await since('MQ prompt answer should be #{expected} but is #{actual}')
            .expect(await promptEditor.checkQualSummary('Cost'))
            .toEqual('CostHighest%5%at levelDefault');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
    });

    it('[TC70779_02] Validate End-to-End user journey for Default View on Library Web - Last View on RSD', async () => {
        await resetDossierState({ credentials: specConfiguration.credentials, dossier: rsd_Last });
        // Open rsd and manipulate: switch layout, Re-prompt, change filter
        await libraryPage.openDossierAndRunPrompt(rsd_Last.name);
        await dossierPage.waitForDossierLoading();

        // - Change Selector -
        panelSelector = selectorObject.getButtonbarByName('panelSelector');
        await panelSelector.selectItemByText('Details- By Date');
        await selectorObject.calendar.openToCalendar();
        await selectorObject.calendar.selectDate('2014', 'Nov', '30');

        // - Re-prompt
        await promptEditor.reprompt();
        const hierarchy = await promptObject.getPromptByName('Hierarchies');
        await promptObject.selectPromptByIndex({ index: '3', promptName: 'Hierarchies' });
        await promptObject.tree.expandEle(hierarchy, 'Products');
        await promptObject.tree.expandEle(hierarchy, 'Supplier');
        await promptObject.tree.clickEleName(hierarchy, 'Bantam Books');
        await promptObject.shoppingCart.addSingle(hierarchy);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();

        // - switch layout
        await toc.openPageFromTocMenu({ chapterName: 'LinkDrill' });
        await dossierPage.goToLibrary();

        // Re-open dossier to check
        await libraryPage.openDossier(rsd_Last.name);
        await since('Last View-RSD should show prompt should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);

        // -check RSD page
        await since('Last View-RSD title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual(['LinkDrill']);

        // - check prompt answer
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await since('Hierarchy prompt answer should be #{expected} but is #{actual}')
            .expect(await promptEditor.checkMultiQualSummary('Hierarchies'))
            .toEqual('SupplierIn ListBantam Books');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();

        // -check Selector
        await toc.openPageFromTocMenu({ chapterName: 'Selector' });
        await since('To date in calendar selector should be #{actural} while we expected #{expected}')
            .expect(getStringOfDate(await selectorObject.calendar.getToDate()))
            .toBe(getStringOfDate('11/30/2014'));
    });
});

export const config = specConfiguration;
