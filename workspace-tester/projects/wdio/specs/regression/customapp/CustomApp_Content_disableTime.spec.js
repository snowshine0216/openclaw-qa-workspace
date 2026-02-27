import setWindowSize from '../../../config/setWindowSize.js';
import * as consts from '../../../constants/customApp/info.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';
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
    } = browsers.pageObj1;

    let customAppIdDisableTimeStamp, customAppIdDisableInfoWindow;

    beforeAll(async () => {
        // Set template status for financial analysis dossier
        await setTemplate({
            credentials: consts.mstrUser.credentials,
            object: consts.financialAnalysisDossier,
            isTemplate: true,
        });

        customAppIdDisableTimeStamp = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.disableTimeStamp,
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
            customAppIdList: [customAppIdDisableTimeStamp, customAppIdDisableInfoWindow],
        });

        // Unset template status for financial analysis dossier
        await setTemplate({
            credentials: consts.mstrUser.credentials,
            object: consts.financialAnalysisDossier,
            isTemplate: false,
        });
    });

    // verify timestamp is disabled
    it('[TC90145_01] Check disable time stamp in content info in global search', async () => {
        await libraryPage.openCustomAppById({ id: customAppIdDisableTimeStamp });
        // verify Date Added / Date Updated / Date Viewed are all disabled in sort option
        await libraryPage.openSortMenu();
        await since('Date Added in sort by is expected to be #{expected}, instead we have #{actual}.')
            .expect(await librarySort.getSortOptionList('Date Added').isDisplayed())
            .toBe(false);
        await since('Date Updated in sort by is expected to be #{expected}, instead we have #{actual}.')
            .expect(await librarySort.getSortOptionList('Date Updated').isDisplayed())
            .toBe(false);
        await since('Date Viewed in sort by is expected to be #{expected}, instead we have #{actual}.')
            .expect(await librarySort.getSortOptionList('Date Viewed').isDisplayed())
            .toBe(false);
        await libraryPage.closeSortMenu();

        // global search
        await librarySearch.openSearchBox();
        await librarySearch.search(consts.financialAnalysisDossier.name);
        await librarySearch.pressEnter();
        await dossierPage.sleep(2000);
        // check certified and template info in search result -------
        await fullSearch.hoverOnCertifiedIcon(consts.financialAnalysisDossier.name);
        var certified_tooltip_search = await fullSearch.getTooltipText();
        console.log('certified_tooltip_search:' + certified_tooltip_search);
        await since(
            'After disable time stamp, when hovering over Certified Icon, tooltip in search result is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(certified_tooltip_search)
            .toContain('Certified by');
        await fullSearch.clickMyLibraryTab(); // dismiss tooltip
        await fullSearch.hoverOnTemplateIcon(consts.financialAnalysisDossier.name);
        var template_tooltip_search = await fullSearch.getTooltipText();
        await since(
            'After disable time stamp, when hovering over Template Icon, tooltip in search result is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(template_tooltip_search)
            .toContain('Set as Dashboard Template by');
        console.log('template_tooltip_search:' + template_tooltip_search);
        // switch to All tab
        await fullSearch.clickAllTab();
        // check certified and template info in global search result -------
        await fullSearch.hoverOnCertifiedIcon(consts.financialAnalysisDossier.name);
        var certified_tooltip_search_all = await fullSearch.getTooltipText();
        console.log('certified_tooltip_search_all:' + certified_tooltip_search_all);
        await since(
            'In global search, after disable time stamp, when hovering over Certified Icon, tooltip is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(certified_tooltip_search_all)
            .toMatch('Certified by');
        await fullSearch.clickAllTab(); // dismiss tooltip
        await fullSearch.hoverOnTemplateIcon(consts.financialAnalysisDossier.name);
        var template_tooltip_search_all = await fullSearch.getTooltipText();
        await since(
            'In global search, after disable time stamp, when hovering over Template Icon, tooltip is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(template_tooltip_search_all)
            .toContain('Set as Dashboard Template by');
        console.log('template_tooltip_search_all:' + template_tooltip_search_all);
        await fullSearch.openSearchSortBox();
        // snapshot
        await takeScreenshotByElement(
            await fullSearch.getSearchSortDropdown(),
            'TC90145_01',
            'Data Added Updated Viewed are disabled in sort option in global search'
        );
        // await fullSearch.closeSearchSortBox();
    });

    // verify disable info window
    it('[TC90145_04] Check disable infowindow', async () => {
        // create app
        customAppIdDisableInfoWindow = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.disableInfoWindow,
        });
        await libraryPage.openCustomAppById({ id: customAppIdDisableInfoWindow });
        // check info window is disabled in dossier card
        await since('Info window in dossier card is expected to be #{expected}, instead we have #{actual}.')
            .expect(await infoWindow.getInfoIcon(consts.financialAnalysisDossier.name).isDisplayed())
            .toBe(false);
    });

    // verify timestamp is disabled in info window
    it('[TC90145_05] Check disable time stamp in content info in info window', async () => {
        await libraryPage.openCustomAppById({ id: customAppIdDisableTimeStamp });

        // check timestamp in dossier card
        await libraryPage.moveDossierIntoViewPort(consts.financialAnalysisDossier.name);
        await since('Time Stamp in dossier card is expected to be #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.libraryItem.getTimeInfo(consts.financialAnalysisDossier.name).isDisplayed())
            .toBe(false);
        // check certified and template info in dossier card -------
        await libraryItem.hoverOnCertifiedIcon(consts.financialAnalysisDossier.name);
        var certified_tooltip_card = await libraryItem.getTooltipText();
        console.log('certified_tooltip_card:' + certified_tooltip_card);
        await since(
            'In dossier card, after disable time stamp, when hovering over Certified Icon, tooltip is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(certified_tooltip_card)
            .toContain('Certified by');
        await libraryPage.clickNarvigationBar(); // dismiss tooltip
        await libraryItem.hoverOnTemplateIcon(consts.financialAnalysisDossier.name);
        var template_tooltip_card = await libraryItem.getTooltipText();
        console.log('template_tooltip_card:' + template_tooltip_card);
        await since(
            'In dossier card, after disable time stamp, when hovering over Template Icon, tooltip is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(template_tooltip_card)
            .toContain('Set as Dashboard Template by');

        // check timestamp in dossier info window and certified time -- needs enhance
        await libraryPage.openDossierInfoWindow(consts.financialAnalysisDossier.name);
        await libraryPage.clickNarvigationBar(); // dismiss tooltip
        // no need to check tooltip for certified icon in info window
        var certified_details_info_window = await infoWindow.getCertifiedDetails().getText();
        console.log('certified_details_info_window:' + certified_details_info_window);
        await since(
            'In info window, after disable time stamp, Certified details is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(certified_details_info_window)
            .toContain('Certified by');

        await infoWindow.hoverOnTemplateIcon(consts.financialAnalysisDossier.name);
        var template_tooltip_info_window = await libraryItem.getTooltipText();
        console.log('template_tooltip_info_window:' + template_tooltip_info_window);
        await since(
            'In info window, after disable time stamp, when hovering over Template Icon, tooltip is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(template_tooltip_info_window)
            .toContain('Set as Dashboard Template by');

        await infoWindow.close();
        await since('Time Stamp in dossier infowindow is expected to be #{expected}, instead we have #{actual}.')
            .expect(await infoWindow.getInfoWindowTimeStamp().isDisplayed())
            .toBe(false);
    });

    it('[TC90145_06] Check disable time stamp in content info in dossier page', async () => {
        await libraryPage.openCustomAppById({ id: customAppIdDisableTimeStamp });
        await libraryPage.openDossier(consts.financialAnalysisDossier.name);
        await toc.openMenu();
        await takeScreenshotByElement(await toc.getTocHeader(), 'TC90145_06', 'Time Stamp in toc panel is disabled');
        await toc.goToPage({ chapterName: 'Overview', pageName: 'Overview' });

        // check certified and template info in dossier title
        await dossierPage.hoverOnCertifiedIcon(consts.financialAnalysisDossier.name);
        var certified_tooltip_dossier_title = await libraryItem.getTooltipText();
        await since(
            'In dossier title, after disable time stamp, when hovering over Certified Icon, tooltip is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(certified_tooltip_dossier_title)
            .toContain('Certified by');
        await libraryPage.clickNarvigationBar(); // dismiss tooltip
        await dossierPage.hoverOnTemplateIcon(consts.financialAnalysisDossier.name);
        var template_tooltip_dossier_title = await libraryItem.getTooltipText();
        console.log('template_tooltip_dossier_title:' + template_tooltip_dossier_title);
        await since(
            'In dossier title, after disable time stamp, when hovering over Template Icon, tooltip is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(template_tooltip_dossier_title)
            .toContain('Set as Dashboard Template by');

        // check timestamp in share panel
        await share.openSharePanel();
        await share.openShareDossierDialog();
        let userinfo = await share.getUserTimeStampInfo();
        const regex = /\d{2}\/\d{2}\/\d{4}/;
        await since('Time Stamp in share panel is expected to be #{expected}, instead we have #{actual}.')
            .expect(regex.test(userinfo))
            .toBe(false);
        await shareDossier.closeDialog();
        await dossierPage.goToLibrary();

        // mobile view -> share panel -> export to excel
        // set windows size to be mobile view
        await setWindowSize(mobileWindow);
        await libraryPage.waitForItemLoading();
        // check Date Added / Date Updated / Date Viewed are all disabled in sort option in mobile view
        await libraryPage.hamburgerMenu.openLibraryFilterInMobileView();
        await libraryPage.hamburgerMenu.openSortByDropdownInMobileView();
        await takeScreenshotByElement(
            await libraryPage.hamburgerMenu.getSortAndFilterPanel(),
            'TC90145_06',
            'Open sort dropdown in mobile view',
            { tolerance: 0.4 }
        );
        await libraryPage.hamburgerMenu.closeSortByDropdownInMobileView();
        await libraryPage.hamburgerMenu.closeFilterPanelInMobileView();

        // check Date Added / Date Updated / Date Viewed are all disabled in global search in mobile view
        await libraryPage.hamburgerMenu.openHamburgerMenu();
        await libraryPage.hamburgerMenu.clickOptionInMobileView('Search');
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(consts.financialAnalysisDossier.name);
        await fullSearch.waitForSearchLoading();
        await fullSearch.openSearchSortBox();
        // snapshot
        await takeScreenshotByElement(
            await fullSearch.getSearchSortDropdown(),
            'TC90145_06',
            'Data Added / Date Updated / Date Viewed are disabled in sort option in global search'
        );
    });

    // verify timestamp is disabled
    it('[TC90145_10] Check disable time stamp content info in sort by in other tabs ', async () => {
        await libraryPage.switchUser(consts.mstrUser.credentials);
        await libraryPage.openCustomAppById({ id: customAppIdDisableTimeStamp });
        await libraryPage.openSidebarOnly();
        // // insights tab
        // await libraryPage.sidebar.clickPredefinedSection('Insights');
        // await libraryPage.openSortMenu();
        // await takeScreenshotByElement(
        //     await librarySort.getSortDropdown(),
        //     'TC90145_10',
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
        // // subscriptions
        // await libraryPage.sidebar.openSubscriptions();
        // await dossierPage.sleep(subscribe.DEFAULT_API_TIMEOUT);
        // await subscribe.clickSortByDropdown();
        // await dossierPage.sleep(1000);
        // await takeScreenshotByElement(
        //     await subscribe.getSortDropdown(),
        //     'TC90145_10',
        //     'Open sort menu in Subscription tab',
        //     {
        //         tolerance: 0.4,
        //     }
        // );
        // await libraryPage.closeSortMenu();
    });
});
