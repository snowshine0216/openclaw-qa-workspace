import { customCredentials } from '../../../constants/index.js';

const specConfiguration = { ...customCredentials('_search') };

describe('GlobalSearch_SearchbyID', () => {
    let { quickSearch, fullSearch, loginPage, libraryPage } = browsers.pageObj1;

    const dashboardinLibrary = {
        id: '07F4D2F242C0052C1259799C07BFFA5C',
        shortcutid: 'F775BE494BC770732C0DE48502832824',
        name: '(AUTO) GlobalSearch_Prompted Dossier_MyLibrary',
    };

    const documentnotinLibrary = {
        id: '90B1D8264D574AABEEA04B89EFB1725A',
        name: '(AUTO) GlobalSearchRemoved_Document',
    };

    const idasNameinLibrary = {
        id: '4CF28AFB4984216A2120CD9B14FF1C2A',
        name: 'A8C62F7246A3C53DB7A653BCBCB5030D',
        chapter: 'A8C62F7246A3C53DB7A653BCBCB5030D',
        page: 'A8C62F7246A3C53DB7A653BCBCB5030D',
    };

    const hiddenReportnotinLibrary = {
        id: '3F7CA93947353C627C26CB833B18A945',
        name: 'no drilling',
    };

    const otheProject = {
        name: 'Combine_2_SAP_Variables_Dossier',
        id: 'DF4E840749371765851BED80F3FB4ED3',
    };

    const gridandGraph = {
        id: 'ECB81145425FB36F8FB32383E4A70192',
        name: '(AUTO) ReportTypeSearch  - Grid and Graph',
    };

    const freeFormSQL = {
        id: '8C49048E40F7F47472015A9A9E974224',
        name: '(AUTO) ReportTypeSearch - FreeFormSQL',
    };

    const graph = {
        id: 'ADDC4F7A4CAB22F7344670AAEC30B54C',
        name: '(AUTO) ReportTypeSearch - Graph',
    };

    const grid = {
        id: '73D7761440BD7854C21B94A959A67F24',
        name: '(AUTO) ReportTypeSearch - Grid',
    };

    const subSetReport = {
        id: 'DAC6BE4B407179C0E0E078BC403C6F49',
        name: '(AUTO) ReportTypeSearch - SubSet Report',
    };

    const XQueryReport = {
        id: '441545EF41220EA59D92659EF34F6A78',
        name: '(AUTO) ReportTypeSearch - XQuery Report',
    };

    const SQLErrorReport = {
        id: '1BFBE54C4798D367EA65EA8439180A9E',
        name: '(AUTO) ReportTypeSearch - SQL Error Report',
    };

    const MDXReport = {
        id: '02CD98AD4161F0FA4DE49187BB780AB0',
        name: '(AUTO) ReportTypeSearch - MDX Report',
    };

    const dataMartReport = {
        id: 'B5F256DB4E9F77C8A40C77B397A20316',
        name: '(AUTO) ReportTypeSearch - DataMartReport',
    };

    const cube = {
        id: '6F0D3D3143D1AB269DCF3E98669A0973',
        name: '(AUTO) ReportTypeSearch - Cube',
    };

    const bulkExportReport = {
        id: '1CCFFB1140ACE658D57AEF840E27D8BC',
        name: '(AUTO) ReportTypeSearch - Bulk Export Report',
    };

    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);
    });

    afterEach(async () => {
        await fullSearch.backToLibrary();
    });

    it('[TC97353] Global Search - Validate search object ID on My Library and All tab - dashboard and document', async () => {
        await quickSearch.openSearchSlider();
        //search dashboard in library
        await quickSearch.inputText(dashboardinLibrary.id);
        await since(
            `Search by ${dashboardinLibrary.id}, search suggestion text items count should be #{expected}, while we get #{actual}`
        )
            .expect(await quickSearch.isSearchSuggestionDisplay())
            .toBe(false);
        await quickSearch.clickViewAll();

        // check result result on full screen search page
        //await quickSearch.clickSearchSlider();
        let myLibCount = await fullSearch.getMyLibraryCount();
        let allCount = await fullSearch.getAllTabCount();
        await fullSearch.clickMyLibraryTab();
        since(
            `Search by ${dashboardinLibrary.id}, search results count on My Library tab should be #{expected}, while we get #{actual}`
        )
            .expect(myLibCount)
            .toBe(1);
        since ('Search by ' + dashboardinLibrary.id + ', matched ID text count on My Library tab should be greater than #{expected}, while we get #{actual}')
            .expect(await fullSearch.getIDMatchText(dashboardinLibrary.name))
            .toBe('ID Match: 07F4D2F242C0052C1259799C07BFFA5C')
        await fullSearch.clickAllTab();
        since(
            `Search by ${dashboardinLibrary.id}, search results count on All tab should be greater than #{expected}, while we get #{actual}`
        )
            .expect(await fullSearch.getAllTabCount())
            .toBe(1);
        since ('Search by ' + dashboardinLibrary.id + ', matched ID text count on All tab should be greater than #{expected}, while we get #{actual}')
            .expect(await fullSearch.getIDMatchText(dashboardinLibrary.name))
            .toBe('ID Match: 07F4D2F242C0052C1259799C07BFFA5C')
        await fullSearch.backToLibrary();

        await quickSearch.openSearchSlider();
        //search document not in library
        await quickSearch.inputText(documentnotinLibrary.id);
        await since(
            `Search by ${documentnotinLibrary.id}, search suggestion shortcut items count should be #{expected}, while we get #{actual}`
        )
            .expect(await quickSearch.isSearchSuggestionDisplay())
            .toBe(false);
        await quickSearch.clickViewAll();

        // check result on full screen search page
        //await quickSearch.clickSearchSlider();
        myLibCount = await fullSearch.getMyLibraryCount();
        allCount = await fullSearch.getAllTabCount();
        await since(
            `Search by ${documentnotinLibrary.id}, search results count on My Library tab should be #{expected}, while we get #{actual}`
        )
            .expect(myLibCount)
            .toBe(0);
        await since(
            `Search by ${documentnotinLibrary.id}, search results count on All tab should be greater than #{expected}, while we get #{actual}`
        )
            .expect(allCount)
            .toBe(1);
        await fullSearch.clickTabByName('Documents');
        since('Search by ' + documentnotinLibrary.id + ', matched ID text count on Documents tab should be greater than #{expected}, while we get #{actual}')
            .expect(await fullSearch.getIDMatchText(documentnotinLibrary.name))
            .toBe('ID Match: 90B1D8264D574AABEEA04B89EFB1725A');
        await fullSearch.backToLibrary();

        //search shortcut id
        await quickSearch.openSearchSlider();
        //search dashboard shortcut id in library
        await quickSearch.inputText(dashboardinLibrary.shortcutid);
        await since(
            `Search by ${dashboardinLibrary.shortcutid}, search suggestion text items count should be #{expected}, while we get #{actual}`
        )
            .expect(await quickSearch.isSearchSuggestionDisplay())
            .toBe(false);
        await quickSearch.clickViewAll();

        // check result on full screen search page
        //await quickSearch.clickSearchSlider();
        myLibCount = await fullSearch.getMyLibraryCount();
        allCount = await fullSearch.getAllTabCount();
        await since(
            `Search by ${dashboardinLibrary.shortcutid}, search results count on My Library tab should be #{expected}, while we get #{actual}`
        )
            .expect(myLibCount)
            .toBe(1);
        await since(
            `Search by ${dashboardinLibrary.shortcutid}, search results count on All tab should be greater than #{expected}, while we get #{actual}`
        )
            .expect(allCount)
            .toBe(0);
    });

    it('[TC97353_02] Global Search - Validate search object ID on My Library and All tab - suppoted report', async () => {
        const supportReportIDs = `${gridandGraph.id} ${freeFormSQL.id} ${graph.id} ${grid.id} ${subSetReport.id}`;
        await quickSearch.openSearchSlider();
        await quickSearch.inputText(supportReportIDs);
        await since(
            `Search by ${supportReportIDs}, search suggestion text items count should be #{expected}, while we get #{actual}`
        )
            .expect(await quickSearch.getSearchSuggestionTextItems().length)
            .toBe(1);
        await since(
            `Search by ${supportReportIDs}, search suggestion shortcut items count should be #{expected}, while we get #{actual}`
        )
            .expect(await quickSearch.isSearchSuggestionDisplay())
            .toBe(false);
        await quickSearch.clickViewAll();

        // check result result on full screen search page
        await quickSearch.clickSearchSlider();
        const myLibCount = await fullSearch.getMyLibraryCount();
        const allCount = await fullSearch.getAllTabCount();
        await since(
            `Search by ${supportReportIDs}, search results count on My Library tab should be #{expected}, while we get #{actual}`
        )
            .expect(myLibCount)
            .toBe(0);
        await since(
            `Search by ${supportReportIDs}, search results count on All tab should be greater than #{expected}, while we get #{actual}`
        )
            .expect(allCount)
            .toBe(5);
    });

    it('[TC97353_03] Global Search - Validate search object ID on My Library and All tab - not suppoted report', async () => {
        const notSupportReportIDs = `${SQLErrorReport.id} ${MDXReport.id} ${dataMartReport.id} ${cube.id} ${bulkExportReport.id}`;
        await quickSearch.openSearchSlider();
        await quickSearch.inputText(notSupportReportIDs);
        await since(
            `Search by ${notSupportReportIDs}, search suggestion text items count should be #{expected}, while we get #{actual}`
        )
            .expect(await quickSearch.getSearchSuggestionTextItems().length)
            .toBe(1);
        await since(
            `Search by ${notSupportReportIDs}, search suggestion shortcut items count should be #{expected}, while we get #{actual}`
        )
            .expect(await quickSearch.isSearchSuggestionDisplay())
            .toBe(false);
        await quickSearch.clickViewAll();

        // check result result on full screen search page
        await quickSearch.clickSearchSlider();
        const myLibCount = await fullSearch.getMyLibraryCount();
        const allCount = await fullSearch.getAllTabCount();
        await since(
            `Search by ${notSupportReportIDs}, search results count on My Library tab should be #{expected}, while we get #{actual}`
        )
            .expect(myLibCount)
            .toBe(0);
        await since(
            `Search by ${notSupportReportIDs}, search results count on All tab should be greater than #{expected}, while we get #{actual}`
        )
            .expect(allCount)
            .toBe(1);
    });

    it('[TC97353_04] Global Search - Validate search object ID on My Library and All tab - two project object', async () => {
        const twoProjectObject = `${dashboardinLibrary.id} ${otheProject.id}`;
        await quickSearch.openSearchSlider();
        await quickSearch.inputText(twoProjectObject);
        await since(
            `Search by ${twoProjectObject}, search suggestion text items count should be #{expected}, while we get #{actual}`
        )
            .expect(await quickSearch.isSearchSuggestionDisplay())
            .toBe(false);
       
        await quickSearch.clickViewAll();

        // check result result on full screen search page
        await libraryPage.waitForItemLoading();
        const myLibCount = await fullSearch.getMyLibraryCount();
        const allCount = await fullSearch.getAllTabCount();
        await since(
            `Search by ${twoProjectObject}, search results count on My Library tab should be #{expected}, while we get #{actual}`
        )
            .expect(myLibCount)
            .toBe(1);
        await since(
            `Search by ${twoProjectObject}, search results count on All tab should be greater than #{expected}, while we get #{actual}`
        )
            .expect(allCount)
            .toBe(2);
    });

    it('[TC97353_05] Global Search - Validate search object ID on My Library and All tab - hidden report', async () => {
        await quickSearch.openSearchSlider();
        await quickSearch.inputText(hiddenReportnotinLibrary.id);
        await since(
            `Search by ${hiddenReportnotinLibrary.id}, search suggestion text items count should be #{expected}, while we get #{actual}`
        )
            .expect(await quickSearch.getSearchSuggestionTextItems().length)
            .toBe(1);
        await since(
            `Search by ${hiddenReportnotinLibrary.id}, search suggestion shortcut items count should be #{expected}, while we get #{actual}`
        )
            .expect(await quickSearch.isSearchSuggestionDisplay())
            .toBe(false);
        await quickSearch.clickViewAll();

        // check result result on full screen search page
        await quickSearch.clickSearchSlider();
        const myLibCount = await fullSearch.getMyLibraryCount();
        const allCount = await fullSearch.getAllTabCount();
        await since(
            `Search by ${hiddenReportnotinLibrary.id}, search results count on My Library tab should be #{expected}, while we get #{actual}`
        )
            .expect(myLibCount)
            .toBe(0);
        await since(
            `Search by ${hiddenReportnotinLibrary.id}, search results count on All tab should be greater than #{expected}, while we get #{actual}`
        )
            .expect(allCount)
            .toBe(0);
    });

    it('[TC97353_06] Global Search - Validate search object ID on My Library and All tab - object and text', async () => {
        const idandText = `${dashboardinLibrary.id} MyLibrary`
        await quickSearch.openSearchSlider();
        await quickSearch.inputText(idandText);
        await since(
            `Search by ${idandText}, search suggestion text items count should be #{expected}, while we get #{actual}`
        )
            .expect(await quickSearch.getSearchSuggestionTextItems().length)
            .toBe(1);
        await since(
            `Search by ${idandText}, search suggestion shortcut items count should be #{expected}, while we get #{actual}`
        )
            .expect(await quickSearch.getSearchSuggestionShortcutsItems().length)
            .toBe(2);
        await quickSearch.clickViewAll();

        // check result result on full screen search page
        await quickSearch.clickSearchSlider();
        const myLibCount = await fullSearch.getMyLibraryCount();
        const allCount = await fullSearch.getAllTabCount();
        await since(
            `Search by ${idandText}, search results count on My Library tab should be #{expected}, while we get #{actual}`
        )
            .expect(myLibCount)
            .toBe(2);
        await since(
            `Search by ${idandText}, search results count on All tab should be greater than #{expected}, while we get #{actual}`
        )
            .expect(allCount)
            .toBe(2);
    });

    it('[TC97353_07] Global Search - Validate search object ID on My Library and All tab - id as name', async () => {
        await quickSearch.openSearchSlider();
        await quickSearch.inputText(idasNameinLibrary.name);
        await since(
            `Search by ${idasNameinLibrary.name}, search suggestion text items count should be #{expected}, while we get #{actual}`
        )
            .expect(await quickSearch.getSearchSuggestionTextItems().length)
            .toBe(2);
        await since(
            `Search by ${idasNameinLibrary.name}, search suggestion shortcut items count should be #{expected}, while we get #{actual}`
        )
            .expect(await quickSearch.getSearchSuggestionShortcutsItems().length)
            .toBe(1);
        await quickSearch.clickViewAll();

        // check result result on full screen search page
        await quickSearch.clickSearchSlider();
        const myLibCount = await fullSearch.getMyLibraryCount();
        const allCount = await fullSearch.getAllTabCount();
        await since(
            `Search by ${idasNameinLibrary.name}, search results count on My Library tab should be #{expected}, while we get #{actual}`
        )
            .expect(myLibCount)
            .toBe(1);
        await since(
            `Search by ${idasNameinLibrary.name}, search results count on All tab should be greater than #{expected}, while we get #{actual}`
        )
            .expect(allCount)
            .toBe(2);
        await quickSearch.inputTextAndSearch(idasNameinLibrary.name);
        await fullSearch.clickMyLibraryTab();
        await fullSearch.clickMatchedContentIcon(idasNameinLibrary.name);
        await since('Search by' + idasNameinLibrary.id + ' Matched content count should be #{expected}, while we get #{actual}')
            .expect(await fullSearch.getMatchContentCount(idasNameinLibrary.name))
            .toBe(2);
        // matched content: chapter
        await since('Chapter:' + idasNameinLibrary.chapter + ' should be existed on matched content')
            .expect(await fullSearch.isMatchedContentExisted(idasNameinLibrary.name, idasNameinLibrary.chapter))
            .toBe(true);
        // matched content: page
        await since('Page:' + idasNameinLibrary.page + ' should be existed on matched content')
            .expect(await fullSearch.isMatchedContentExisted(idasNameinLibrary.name, idasNameinLibrary.page))
            .toBe(true);
    });

    it('[TC97353_08] Global Search - Validate search object ID on My Library and All tab - invalid id', async () => {
        await libraryPage.librarySort.openSortMenu();
        await quickSearch.ctrlF();
        await since(
            `Search bar present should be #{expected}, while we get #{actual}`
        )
            .expect(await quickSearch.isSearchBarPresent())
            .toBe(true);
        await quickSearch.inputText('07F4D2F242C0052C1259799C07BFFA5');
        await since(
            `Search by invalid id, search suggestion text items count should be #{expected}, while we get #{actual}`
        )
            .expect(await quickSearch.getSearchSuggestionTextItems().length)
            .toBe(1);
        await since(
            `Search by  invalid id, search suggestion shortcut items count should be #{expected}, while we get #{actual}`
        )
            .expect(await quickSearch.isSearchSuggestionDisplay())
            .toBe(false);
        await quickSearch.clickViewAll();

        // check result result on full screen search page
        await quickSearch.clickSearchSlider();
        const myLibCount = await fullSearch.getMyLibraryCount();
        const allCount = await fullSearch.getAllTabCount();
        await since(
            `Search by invalid id, search results count on My Library tab should be #{expected}, while we get #{actual}`
        )
            .expect(myLibCount)
            .toBe(0);
        await since(
            `Search by invalid id, search results count on All tab should be greater than #{expected}, while we get #{actual}`
        )
            .expect(allCount)
            .toBe(0);
    });

});
export const config = specConfiguration;
