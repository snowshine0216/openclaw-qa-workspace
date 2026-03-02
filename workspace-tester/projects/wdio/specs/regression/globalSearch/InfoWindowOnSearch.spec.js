import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { isFileNotEmpty } from '../../..//config/folderManagement.js';
import { customCredentials, designer2Credentials } from '../../../constants/index.js';
import shareDossierToUsers from '../../../api/shareDossierToUsers.js';
import users from '../../../testData/users.json' assert { type: 'json' };
import resetReportState from '../../../api/reports/resetReportState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import LibraryAuthoringPage from '../../../pageObjects/library/LibraryAuthoringPage.js';

const specConfiguration = { ...customCredentials('_search_infoWindow') };

describe('GlobalSearch_InfoWindowOnSearch', () => {
    const userID = users[specConfiguration.credentials.username].id;

    const dossier1 = {
        id: '57E42A564B59CE62D5A290B92D4AB8FE',
        name: '(AUTO) GlobalSearchRemoved_Dossier',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };
    const report = {
        id: '400F0AAD4A09D61A89CF6DBB42BB8495',
        name: '(AUTO) GlobalSearch_Report',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    let {
        dossierPage,
        quickSearch,
        fullSearch,
        infoWindow,
        shareDossier,
        pdfExportWindow,
        libraryPage,
        filterOnSearch,
        loginPage,
        libraryAuthoringPage,
    } = browsers.pageObj1;

    const browserWindow = {
        
        width: 1600,
        height: 1200,
    };

    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);
        await shareDossierToUsers({
            dossier: dossier1,
            credentials: designer2Credentials,
            targetUserIds: [userID],
            targetCredentialsList: [specConfiguration.credentials],
        });
        await libraryPage.refresh();

        await setWindowSize(browserWindow);
    });

    it('[TC70124] Global Search - Info Window - Export dossier and export document on My Library Tab ', async () => {
        const keyword = 'GlobalSearchRemoved';
        const document = '(AUTO) GlobalSearchRemoved_Document';
        const dossier = '(AUTO) GlobalSearchRemoved_Dossier';
        const dossierFile = {
            name: dossier,
            fileType: '.pdf',
        };
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(keyword);
        await fullSearch.clickMyLibraryTab();

        // export document
        await fullSearch.openInfoWindow(document);
        await infoWindow.exportRSD();
        await infoWindow.close();

        // export dossier
        await fullSearch.openInfoWindow(dossier);
        await infoWindow.openExportPDFSettingsWindow();
        await pdfExportWindow.exportSubmitLibrary();
        await infoWindow.waitForDownloadComplete(dossierFile);
        await since(`The pdf file for ${dossier} was not downloaded`)
            .expect(await isFileNotEmpty(dossierFile))
            .toBe(true);
        await infoWindow.close();
        await fullSearch.backToLibrary();
    });

    it('[TC70125] Global Search - Info Window - Download dossier on My Library Tab ', async () => {
        const keyword = 'GlobalSearchRemoved';
        const dossier = '(AUTO) GlobalSearchRemoved_Dossier';
        const dossierFile = {
            name: dossier,
            fileType: '.mstr',
        };

        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(keyword);
        await fullSearch.clickMyLibraryTab();
        await fullSearch.openInfoWindow(dossier);
        await infoWindow.downloadDossier();
        await infoWindow.waitForDownloadComplete(dossierFile);
        await since('The MSTR File was not downloaded')
            .expect(await isFileNotEmpty(dossierFile))
            .toBe(true);
        await fullSearch.backToLibrary();
    });

    it('[TC70126] Global Search - Info Window - Reset dossier and reset document on My Library Tab  ', async () => {
        const keyword = 'GlobalSearchRemoved';
        const document = '(AUTO) GlobalSearchRemoved_Document';
        const dossier = '(AUTO) GlobalSearchRemoved_Dossier';

        // Reset dossier
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(keyword);
        await fullSearch.clickMyLibraryTab();
        await fullSearch.openInfoWindow(dossier);
        await since('Open dossier info-window on My library tab, reset button should be presented')
            .expect(await infoWindow.isResetPresent())
            .toBe(true);
        await dossierPage.goToLibrary();

        // Reset document
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(keyword);
        await fullSearch.clickMyLibraryTab();
        await fullSearch.openInfoWindow(document);
        await since('Open document info-window on My library tab, reset button should be presented')
            .expect(await infoWindow.isResetPresent())
            .toBe(true);
        await dossierPage.goToLibrary();
    });

    it('[TC70132] Global Search - Info Window - Export dossier and export document on ALL Tab ', async () => {
        const keyword = 'GlobalSearchRemoved';
        const document = '(AUTO) GlobalSearchRemoved_Document';
        const dossier = '(AUTO) GlobalSearchRemoved_Dossier';
        const dossierFile = {
            name: dossier,
            fileType: '.pdf',
        };
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(keyword);
        await fullSearch.closeAllTabs();

        // filter document
        await filterOnSearch.openSearchFilterPanel();
        await filterOnSearch.openFilterDetailPanel('Type');
        await filterOnSearch.selectOptionInCheckbox('Document');
        await filterOnSearch.applyFilterChanged();
        // export document
        await fullSearch.openInfoWindow(document);
        await infoWindow.exportRSD();
        await infoWindow.close();

        // filter dossier
        await filterOnSearch.openSearchFilterPanel();
        await filterOnSearch.clearAllFilters();
        await filterOnSearch.openFilterDetailPanel('Type');
        await filterOnSearch.selectOptionInCheckbox('Dashboard');
        await filterOnSearch.applyFilterChanged();
        // export dossier
        await fullSearch.openInfoWindow(dossier);
        await infoWindow.openExportPDFSettingsWindow();
        await pdfExportWindow.exportSubmitLibrary();
        await infoWindow.waitForDownloadComplete(dossierFile);
        await since(`The pdf file for ${dossier} was not downloaded`)
            .expect(await isFileNotEmpty(dossierFile))
            .toBe(true);
        await infoWindow.close();

        await fullSearch.backToLibrary();
    });

    it('[TC70133] Global Search - Info Window - Download dossier on ALL Tab ', async () => {
        const keyword = 'GlobalSearchRemoved';
        const dossier = '(AUTO) GlobalSearchRemoved_Dossier';
        const dossierFile = {
            name: dossier,
            fileType: '.mstr',
        };

        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(keyword);
        await fullSearch.clickAllTab();

        // filter dossier
        await filterOnSearch.openSearchFilterPanel();
        await filterOnSearch.openFilterDetailPanel('Type');
        await filterOnSearch.selectOptionInCheckbox('Dashboard');
        await filterOnSearch.applyFilterChanged();

        await fullSearch.openInfoWindow(dossier);
        await infoWindow.downloadDossier();
        await infoWindow.waitForDownloadComplete(dossierFile);
        await since('The MSTR File was not downloaded')
            .expect(await isFileNotEmpty(dossierFile))
            .toBe(true);

        await fullSearch.backToLibrary();
    });

    it('[TC70112] Global Search - Info Window - Share dossier and share document on My Library Tab  ', async () => {
        const keyword = 'GlobalSearchRemoved';
        const document = '(AUTO) GlobalSearchRemoved_Document';
        const dossier = '(AUTO) GlobalSearchRemoved_Dossier';
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(keyword);
        await fullSearch.clickMyLibraryTab();

        // share document
        await fullSearch.openInfoWindow(document);
        await infoWindow.shareDossier();
        await since('Share document on My Library tab, share bookmark section should NOT be displayed')
            .expect(await shareDossier.isIncludeBMPresent())
            .toBe(false);
        // -- share
        await shareDossier.searchRecipient('xyi');
        await shareDossier.selectRecipients(['xyi']);
        await shareDossier.addMessage('global search testing');
        await since('Share document on My Library tab, share button status should be enabled')
            .expect(await shareDossier.isShareButtonEnabled())
            .toBe(true);
        await shareDossier.shareDossier();
        await since('Share document on My Library tab, share window should be closed after click share button')
            .expect(await shareDossier.getShareDossierDialog().isDisplayed())
            .toBe(false);
        await infoWindow.close();

        // share dossier
        await fullSearch.openInfoWindow(dossier);
        await infoWindow.shareDossier();
        await since('Share dossier on My Library tab, share bookmark section should NOT be displayed')
            .expect(await shareDossier.isIncludeBMPresent())
            .toBe(false);
        // -- share
        await shareDossier.searchRecipient('xyi');
        await shareDossier.selectRecipients(['xyi']);
        await shareDossier.addMessage('global search testing');
        await since('Share dossier on My Library tab, share button status should be enabled')
            .expect(await shareDossier.isShareButtonEnabled())
            .toBe(true);
        await shareDossier.shareDossier();
        await since('Share dossier on My Library tab, share window should be closed after click share button')
            .expect(await shareDossier.getShareDossierDialog().isDisplayed())
            .toBe(false);
        await infoWindow.close();

        await fullSearch.backToLibrary();
    });

    it('[TC70131] Global Search - Info Window - Share dossier and share document on ALL Tab  ', async () => {
        const keyword = 'GlobalSearchRemoved';
        const document = '(AUTO) GlobalSearchRemoved_Document';
        const dossier = '(AUTO) GlobalSearchRemoved_Dossier';
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(keyword);
        await fullSearch.clickAllTab();

        // share document
        await fullSearch.openInfoWindow(document);
        await infoWindow.shareDossier();
        await since('Share document on All tab, share bookmark section should NOT be displayed')
            .expect(await shareDossier.isIncludeBMPresent())
            .toBe(false);
        // -- share
        await shareDossier.searchRecipient('xyi');
        await shareDossier.selectRecipients(['xyi']);
        await shareDossier.addMessage('global search testing - all tab');
        await since('Share document on All tab, share button status should be enabled')
            .expect(await shareDossier.isShareButtonEnabled())
            .toBe(true);
        await shareDossier.shareDossier();
        await since('Share document on All tab, share window should be closed after click share button')
            .expect(await shareDossier.getShareDossierDialog().isDisplayed())
            .toBe(false);
        await infoWindow.close();

        // share dossier
        await fullSearch.openInfoWindow(dossier);
        await infoWindow.shareDossier();
        await since('Share dossier on All tab, share bookmark section should NOT be displayed')
            .expect(await shareDossier.isIncludeBMPresent())
            .toBe(false);
        // -- share
        await shareDossier.searchRecipient('xyi');
        await shareDossier.selectRecipients(['xyi']);
        await shareDossier.addMessage('global search testing');
        await since('Share dossier on All tab, share button status should be enabled')
            .expect(await shareDossier.isShareButtonEnabled())
            .toBe(true);
        await shareDossier.shareDossier();
        await since('Share dossier on All tab, share window should be closed after click share button')
            .expect(await shareDossier.getShareDossierDialog().isDisplayed())
            .toBe(false);
        await infoWindow.close();

        await fullSearch.backToLibrary();
    });

    it('[TC70130] Global Search - Info Window - Edit dossier  ', async () => {
        const keyword = 'GlobalSearchRemoved';
        const dossier = '(AUTO) GlobalSearchRemoved_Dossier';

        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(keyword);
        await fullSearch.clickMyLibraryTab();

        // edit dossier from my library
        await fullSearch.openInfoWindow(dossier);
        await infoWindow.clickEditButton();
        await fullSearch.switchToNewWindow();
        since('Edit dossier, user will be redirected to authoring mode')
            .expect(await libraryPage.isAuthoringCloseButtonDisplayed())
            .toBe(true);
        await libraryPage.clickAuthoringCloseBtn();
        await fullSearch.closeAllTabs();
    });

    it('[TC70134] Global Search - Info Window - Edit dossier from all tab ', async () => {
        const keyword = 'GlobalSearchRemoved';
        const dossier = '(AUTO) GlobalSearchRemoved_Dossier';

        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(keyword);
        await fullSearch.clickAllTab();

        // edit dossier from all tab
        await fullSearch.openInfoWindow(dossier);
        await infoWindow.clickEditButton();
        await fullSearch.switchToNewWindow();
        await since('Edit dossier, user will be redirected to authoring mode')
            .expect(await libraryPage.isAuthoringCloseButtonDisplayed())
            .toBe(true);
        await libraryPage.clickAuthoringCloseBtn();
        await fullSearch.closeAllTabs();
    });

    it('[TC70129] Global Search - Info Window - Remove dossier on My Library Tab  ', async () => {

        const keyword = 'GlobalSearchRemoved';

        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(keyword);
        const total = await fullSearch.getMyLibraryCount();
        await fullSearch.clickMyLibraryTab();

        // Remove dossier from my library
        await fullSearch.openInfoWindow(dossier1.name);
        await infoWindow.selectRemove();
        await infoWindow.confirmRemove();
        await infoWindow.sleep(500); // wait dossier list rendering on search results page
        await since('Remove dossier on My library tab, My library count should #{expected}, while we get #{actual}')
            .expect(await fullSearch.getMyLibraryCount())
            .toBe(total - 1);
        await quickSearch.inputTextAndSearch(keyword);
        await since(
            'Remove dossier on My library tab and search again, My library count should #{expected}, while we get #{actual}'
        )
            .expect(await fullSearch.getMyLibraryCount())
            .toBe(total - 1);

        await shareDossierToUsers({
            dossier: dossier1,
            credentials: designer2Credentials,
            targetUserIds: [userID],
            targetCredentialsList: [specConfiguration.credentials],
        });
        await libraryPage.refresh();
    });

    it('[TC86850] Global Search - Info Window - action buttons on report  ', async () => {
        const keyword = 'globalSearch';
        await resetReportState({
            credentials: specConfiguration.credentials,
            report: report,
        });

        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(keyword);

        // Check action buttons on My libary
        await fullSearch.clickMyLibraryTab();
        await fullSearch.openInfoWindow(report.name);
        await since(
            'Open info window on My library tab, action buttons count should #{expected}, while we get #{actual}'
        )
            .expect(await infoWindow.getActionButtonsCount())
            .toBe(8);
        await infoWindow.close();

        // check action buttons on ALl tab
        await fullSearch.clickAllTab();
        await fullSearch.openInfoWindow(report.name);
        await since('Open info window on All tab, action buttons count should #{expected}, while we get #{actual}')
            .expect(await infoWindow.getActionButtonsCount())
            .toBe(5);
        await infoWindow.close();

        await fullSearch.backToLibrary();
    });

    it('[TC88070] Global Search - Mobile View - Sanity global search on mobile view ', async () => {
        await setWindowSize({
            browserInstance: browsers.browser1,
            width: 550,
            height: 800,
        });
        const keyword = 'search';
        const dossier = '(AUTO) GlobalSearch_Keyword match';
        const chapter = 'global search chapter';

        // quick search
        await libraryPage.hamburgerMenu.openHamburgerMenu();
        await libraryPage.hamburgerMenu.clickOptionInMobileView('Search');

        await quickSearch.openSearchSlider();
        await quickSearch.inputText(keyword);
        await since(
            'Search on mobile view, search suggestion shortcut items count should be greater than #{expected}, while we get #{actual}'
        )
            .expect(await quickSearch.isSearchSuggestionDisplay())
            .toBe(false);
        await quickSearch.clickViewAll();
        await fullSearch.clickMyLibraryTab();

        // filter
        await filterOnSearch.openFilterInMobileView();
        await filterOnSearch.openFilterDetailPanel('Owner');
        await filterOnSearch.selectOptionInCheckbox('Xueli Yi');
        await filterOnSearch.backInMobileView();
        await since('Search on mobile view, Xueli Yi should be selected and displayed on filter summary')
            .expect(await filterOnSearch.isSummaryTextExisted('Owner', 'Xueli Yi'))
            .toBe(true);
        await filterOnSearch.applyInMobileView();
        since('after apply filter, the tabs should be #{expected}, while we get #{actual}')
            .expect(await fullSearch.getSearchTabNames())
            .toEqual(['All (13)', 'My Library (2)', 'Dashboards (5)', 'Reports (1)', 'Documents (7)']);

        // sort
        await fullSearch.openSearchSortBox();
        await fullSearch.clickNthOptionInSortDropdown(2);
        await fullSearch.clickMyLibraryTab();
        await since(
            'Search on mobile view,dossier shared sort text on My library tab should be #{expected}, instead we have #{actual}'
        )
            .expect(await fullSearch.getDossierSharedBySortText(dossier))
            .toContain('Updated');

        // search results page
        await fullSearch.clickMatchedContentIcon(dossier);
        await since('SSearch on mobile view, Matched content count should be #{expected}, while we get #{actual}')
            .expect(await fullSearch.getMatchContentCount(dossier))
            .toBe(4);
        await fullSearch.clickMatchedContentTextInNewTab(dossier, chapter);
        await fullSearch.closeAllTabs();
        await dossierPage.goToLibrary();
    });
});
export const config = specConfiguration;
