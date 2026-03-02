import setWindowSize from '../../../config/setWindowSize.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';
import * as consts from '../../../constants/customApp/info.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import setTemplate from '../../../api/objectManagement/setTemplate.js';

describe('Custom App - Granular Control - Content', () => {
    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1600,
        height: 1200,
    };

    const mobileWindow = {
        browserInstance: browsers.browser1,
        width: 599,
        height: 640,
    };

    let {
        loginPage,
        dossierPage,
        libraryPage,
        toc,
        librarySearch,
        share,
        shareDossier,
        quickSearch,
        fullSearch,
        infoWindow,
        librarySort,
        libraryItem,
        subscribe,
    } = browsers.pageObj1;

    let customAppIdDisableContentCreator;

    var regex_certified = /Certified on \d{2}\/\d{2}\/\d{4}, \d{1,2}:\d{2}:\d{2} (AM|PM)/; //match : Certified on 05/30/2022, 7:07:57 PM
    var regex_template = /Set as Dashboard Template on \d{2}\/\d{2}\/\d{4}, \d{1,2}:\d{2}:\d{2} (AM|PM)/;

    beforeAll(async () => {
        await setTemplate({
            credentials: consts.mstrUser.credentials,
            object: consts.financialAnalysisDossier,
            isTemplate: true,
        });
        customAppIdDisableContentCreator = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.disableContentCreator,
        });
        await setWindowSize(browserWindow);
        await loginPage.login(consts.appUser.credentials);
    });

    afterEach(async () => {
        await setWindowSize(browserWindow);
        await libraryPage.openDefaultApp();
    });

    afterAll(async () => {
        await libraryPage.openDefaultApp();
        await deleteCustomAppList({
            credentials: consts.mstrUser.credentials,
            customAppIdList: [customAppIdDisableContentCreator],
        });
        await setTemplate({
            credentials: consts.mstrUser.credentials,
            object: consts.financialAnalysisDossier,
            isTemplate: false,
        });
    });

    // verify user info is disabled in search result
    it('[TC90145_02] Check disable user info in content info in search', async () => {
        await libraryPage.openCustomAppById({ id: customAppIdDisableContentCreator });
        await libraryPage.waitForLibraryLoading();
        // verify Dossier Owner is disabled in sort option
        await libraryPage.openSortMenu();
        await since('Dossier Owner in sort by is expected to be #{expected}, instead we have #{actual}.')
            .expect(await librarySort.getSortOptionList('Owner').isDisplayed())
            .toBe(false);
        await libraryPage.closeSortMenu();

        // verify user info is disabled in recently viewed
        // await librarySearch.openSearchBox();
        await librarySearch.search(consts.financialAnalysisDossier.name);
        await librarySearch.pressEnter();
        // check certified and template info in search result
        await fullSearch.hoverOnCertifiedIcon(consts.financialAnalysisDossier.name);
        var certified_tooltip_search = await fullSearch.getTooltipText();
        console.log('certified_tooltip_search:' + certified_tooltip_search);
        console.log(regex_certified.test(certified_tooltip_search));
        await since(
            'After disable content user, when hovering over Certified Icon, tooltip should only contains timestamp is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(regex_certified.test(certified_tooltip_search))
            .toBe(true);
        await fullSearch.clickMyLibraryTab(); // dismiss tooltip
        await fullSearch.hoverOnTemplateIcon(consts.financialAnalysisDossier.name);
        var template_tooltip_search = await fullSearch.getTooltipText();
        console.log('template_tooltip_search:' + template_tooltip_search);
        await since(
            'After disable content user, when hovering over Template Icon, tooltip should only contains timestamp is expected to be is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(regex_template.test(template_tooltip_search))
            .toBe(true);
        // switch to All tab
        await fullSearch.clickAllTab();
        // check certified and template info in global search result
        await fullSearch.hoverOnCertifiedIcon(consts.financialAnalysisDossier.name);
        var certified_tooltip_search_all = await fullSearch.getTooltipText();
        console.log('certified_tooltip_search_all:' + certified_tooltip_search_all);
        await since(
            'In global search, after disable content user, when hovering over Certified Icon, tooltip should only contains timestamp is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(regex_certified.test(certified_tooltip_search_all))
            .toBe(true);
        await fullSearch.clickAllTab(); // dismiss tooltip
        await fullSearch.hoverOnTemplateIcon(consts.financialAnalysisDossier.name);
        var template_tooltip_search_all = await fullSearch.getTooltipText();
        console.log('template_tooltip_search_all:' + template_tooltip_search_all);
        await since(
            'In global search, after disable content user, when hovering over Template Icon, tooltip should only contains timestamp is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(regex_template.test(template_tooltip_search_all))
            .toBe(true);

        await fullSearch.openDossierFromSearchResults(consts.financialAnalysisDossier.name);
        await dossierPage.waitForDossierLoading();
        await dossierPage.goToLibrary();

        // await librarySearch.openSearchBox();
        await quickSearch.openSearchSlider();
        await since('User Info in recently viewed is expected to be #{expected}, instead we have #{actual}.')
            .expect(await quickSearch.getRecentlyViewedShortcutName(1))
            .not.toContain(consts.appUser.credentials.name);
    });

    // verify user info is disabled in info window and share panel and dossier page
    it('[TC90145_03] Check disable user info in content info in info window and share panel', async () => {
        await libraryPage.openCustomAppById({ id: customAppIdDisableContentCreator });
        // check User Info in dossier card
        await libraryPage.moveDossierIntoViewPort(consts.financialAnalysisDossier.name);
        await since('User Info in dossier card is expected to be #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.libraryItem.getUserInfo(consts.financialAnalysisDossier.name).isDisplayed())
            .toBe(false);

        // check certified and template info in dossier card -------
        await libraryItem.hoverOnCertifiedIcon(consts.financialAnalysisDossier.name);
        var certified_tooltip_card = await libraryItem.getTooltipText();
        console.log('certified_tooltip_card:' + certified_tooltip_card);
        await since(
            'In dossier card, after disable content user, when hovering over Certified Icon, tooltip should only contains timestamp is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(regex_certified.test(certified_tooltip_card))
            .toBe(true);
        await libraryPage.clickNarvigationBar(); // dismiss tooltip
        await libraryItem.hoverOnTemplateIcon(consts.financialAnalysisDossier.name);
        var template_tooltip_card = await libraryItem.getTooltipText();
        console.log('template_tooltip_card:' + template_tooltip_card);
        await since(
            'In dossier card, after disable content user, when hovering over Template Icon, tooltip should only contains timestamp is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(regex_template.test(template_tooltip_card))
            .toBe(true);

        // check User Info in dossier info window and certified time
        await libraryPage.openDossierInfoWindow(consts.financialAnalysisDossier.name);
        await since('User Info in dossier info window is expected to be #{expected}, instead we have #{actual}.')
            .expect(await infoWindow.getInfoWindowUserName().isDisplayed())
            .toBe(false);
        await libraryPage.clickNarvigationBar(); // dismiss tooltip
        // no need to check tooltip for certified icon in info window
        await infoWindow.hoverOnTemplateIcon(consts.financialAnalysisDossier.name);
        var template_tooltip_info_window = await libraryItem.getTooltipText();
        console.log('template_tooltip_info_window:' + template_tooltip_info_window);
        await since(
            'In info window, after disable content user, when hovering over Template Icon, tooltip should only contains timestamp is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(regex_template.test(template_tooltip_info_window))
            .toBe(true);

        await infoWindow.close();
        // check User info in toc panel
        await libraryPage.openDossier(consts.financialAnalysisDossier.name);
        await dossierPage.waitForDossierLoading();
        await toc.openMenu();
        await takeScreenshotByElement(await toc.getTocHeader(), 'TC90145_03', 'User in toc panel is disabled', {
            tolerance: 0.4,
        });
        await toc.goToPage({ chapterName: 'Overview', pageName: 'Overview' });

        // check certified and template info in dossier title
        await dossierPage.hoverOnCertifiedIcon();
        var certified_tooltip_dossier_title = await libraryItem.getTooltipText();
        console.log('certified_tooltip_dossier_title:' + certified_tooltip_dossier_title);
        await since(
            'In dossier title, after disable time stamp, when hovering over Certified Icon, tooltip should only contains timestamp is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(regex_certified.test(certified_tooltip_dossier_title))
            .toBe(true);
        await libraryPage.clickNarvigationBar(); // dismiss tooltip
        await dossierPage.hoverOnTemplateIcon();
        var template_tooltip_dossier_title = await libraryItem.getTooltipText();
        console.log('template_tooltip_dossier_title:' + template_tooltip_dossier_title);
        await since(
            'In dossier title, after disable time stamp, when hovering over Template Icon, tooltip should only contains timestamp to be #{expected}, instead we have #{actual}.'
        )
            .expect(regex_template.test(template_tooltip_dossier_title))
            .toBe(true);

        // check in share dossier panel, user name is not displayed
        await share.openSharePanel();
        await share.openShareDossierDialog();
        await since('User name in share dossier panel is expected to be #{expected}, instead we have #{actual}.')
            .expect(await share.getUserTimeStampInfo())
            .not.toContain('Administrator');
        await shareDossier.closeDialog();
        await dossierPage.goToLibrary();

        // set windows size to be mobile view
        await setWindowSize(mobileWindow);
        await libraryPage.waitForItemLoading();
        // check User info is disabled in sort option in mobile view
        await libraryPage.hamburgerMenu.openLibraryFilterInMobileView();
        await libraryPage.hamburgerMenu.openSortByDropdownInMobileView();
        await takeScreenshotByElement(
            await libraryPage.hamburgerMenu.getSortAndFilterPanel(),
            'TC90145_03',
            'Open sort dropdown in mobile view',
            { tolerance: 0.4 }
        );
        await libraryPage.hamburgerMenu.closeSortByDropdownInMobileView();

        // check User info in global search in mobile view
        // --- to do ---
        await libraryPage.hamburgerMenu.openHamburgerMenu();
        await libraryPage.hamburgerMenu.clickOptionInMobileView('Search');
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(consts.financialAnalysisDossier.name);
        await fullSearch.waitForSearchLoading();
        await fullSearch.openSearchSortBox();
        await takeScreenshotByElement(
            await fullSearch.getSearchSortDropdown(),
            'TC90145_03',
            'Data Added / Date Updated / Date Viewed are disabled in sort option in global search'
        );
    });

    it('[TC90145_11] Check disable content user in sort by in other tabs ', async () => {
        await libraryPage.switchUser(consts.mstrUser.credentials);
        await libraryPage.openCustomAppById({ id: customAppIdDisableContentCreator });
        await libraryPage.openSidebarOnly();
        // // insights tab
        // await libraryPage.sidebar.clickPredefinedSection('Insights');
        // await libraryPage.openSortMenu();
        // await takeScreenshotByElement(
        //     await librarySort.getSortDropdown(),
        //     'TC90145_11',
        //     'Open sort menu in Insights tab',
        //     {
        //         tolerance: 0.4,
        //     }
        // );
        // await librarySort.selectSortOption('Unread Insights');
        //  comment it out as after select 'Unread Insights', the sort menu will be closed after click on it to expand
        // await libraryPage.openSortMenu();
        // await takeScreenshotByElement(
        //     await librarySort.getSortDropdown(),
        //     'TC90145_10',
        //     'Open sort menu in Insights tab and select Unread Insights',
        //     { tolerance: 0.4 }
        // );
        // await libraryPage.closeSortMenu();
        // subscriptions
        await libraryPage.sidebar.openSubscriptions();
        await dossierPage.sleep(subscribe.DEFAULT_API_TIMEOUT);
        await subscribe.clickSortByDropdown();
        await dossierPage.sleep(1000);
        await takeScreenshotByElement(
            await subscribe.getSortDropdown(),
            'TC90145_11',
            'Open sort menu in Subscription tab',
            {
                tolerance: 0.4,
            }
        );
        // await libraryPage.closeSortMenu();
    });
});
