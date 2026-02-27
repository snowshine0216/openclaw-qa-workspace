import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import libraryLogoutFromTeams from '../../../api/libraryLogoutFromTeams.js';
import users from '../../../testData/users.json' assert { type: 'json' };

describe('Teams Library app End to End', () => {
    let {
        libraryPage,
        librarySearch,
        dossierPage,
        teamsDesktop,
        modalDialog,
        share,
        filterSummaryBar,
        azureLoginPage,
        infoWindow,
        listView,
        sidebar,
        contentDiscovery,
        quickSearch,
        fullSearch,
        apps,
        pinInTeamsDialog,
        conversation,
        pinFromChannel,
        messageExtension,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await teamsDesktop.switchToActiveWindow();
        if (!(await teamsDesktop.checkCurrentTeamsUser(browser.options.params.credentials.teamsUsername))) {
            await teamsDesktop.switchToTeamsUser('Lee Gu');
        }
    });

    beforeEach(async () => {
        await teamsDesktop.switchToAppInSidebar('Teams');
    });

    afterEach(async () => {
        await libraryLogoutFromTeams();
        await conversation.removeDossiersTab([
            'Teams Locale',
            'Teams Locale (1)',
            'Page to Page Linking',
            'Page to Page Linking (1)',
        ]);
        await teamsDesktop.switchToActiveWindow();
    });

    afterAll(async () => {});

    it('[TC91380] Test app visibility - user can find Teams Library app in app catalog', async () => {
        // check app in app catalog
        await teamsDesktop.openAppCatalog('personal');
        await teamsDesktop.searchForApp('Teams Standard', 'personal');
        const appEle = await apps.getFirstAppInPerosnalAppCatalog();
        await teamsDesktop.waitForElementVisible(appEle);
        await takeScreenshotByElement(appEle, 'TC91380_1', 'app_in_app_catalog');
        // check app in more apps
        await teamsDesktop.openAppCatalog('viewMoreApps');
        await teamsDesktop.searchForApp('Teams', 'viewMoreApps');
        var appList = await teamsDesktop.getInstalledAppListInMoreApps();
        await teamsDesktop.waitForElementVisible(appList);
        await takeScreenshotByElement(appList, 'TC91380_2', 'app_in_more_apps');
        // switch to Teams window to check app in add tab
        await teamsDesktop.switchToAppInSidebar('Teams');
        await teamsDesktop.openAppCatalog('tab');
        await teamsDesktop.searchForApp('Teams SSO', 'addAnApp');
        appList = await pinFromChannel.getInstalledAppListInAddTab();
        await teamsDesktop.waitForElementVisible(appList);
        await takeScreenshotByElement(appList, 'TC91380_3', 'app_in_add_tab');
        // close the pop up
        await pinFromChannel.getCloseInAddApps().click();
        const starPostEle = await conversation.getStartPostButtonInChannel();
        await teamsDesktop.waitForElementClickable(starPostEle);
        await starPostEle.click();
        // check app in post - expecting no teams app found, only suggested apps listed
        await teamsDesktop.openAppCatalog('post');
        await teamsDesktop.searchForApp('Teams', 'addActionAndApps');
        await since('App picker exsitence should be #{expected}, instead we have #{actual}')
            .expect(await messageExtension.isAppPickerDisplayed())
            .toBe(false);
        // go to chat
        await teamsDesktop.openAppCatalog('viewMoreApps');
        await teamsDesktop.getAppInSidebar('Chat').click();
        await teamsDesktop.switchToChat('Patti Fernandez');
        await teamsDesktop.openAppCatalog('tab');
        await teamsDesktop.searchForApp('Teams', 'addAnApp');
        await since('App existense in chat tab should be #{expected}, instead we have #{actual}')
            .expect(await pinFromChannel.isSearchedAppListInChatTabExist())
            .toBe(false);
        await pinFromChannel.getCloseInAddApps().click();
    });

    it('[TC91381] Test app function - User can open dossier from Teams app and pin it to target Teams channel', async () => {
        browser.options.current_case = 'TC91381';
        await teamsDesktop.switchToAppInSidebar('Teams SSO');
        await teamsDesktop.waitForLibraryLoadingInFrame();
        await teamsDesktop.waitForElementVisible(await listView.getViewModeSwitch());
        const gridView = await listView.getViewModeSwitchGridViewOption();
        if ((await gridView.getAttribute('aria-pressed')) === 'false') {
            await listView.deselectListViewMode();
        }
        await libraryPage.openDossier('Teams Locale');
        await dossierPage.waitForDossierLoading();
        console.log('open pin to teams dialog');
        const windowNumber = (await teamsDesktop.getBrowserTabs()).length;
        await share.clickPinInTeams();
        // login Teams since it's first time to pin dossier to Teams
        if (await teamsDesktop.isPopUpLoginPageExisting(windowNumber)) {
            await teamsDesktop.switchToNewWindow();
            await azureLoginPage.loginWithPassword(browser.options.params.credentials.password);
            await azureLoginPage.safeContinueAzureLogin();
            await teamsDesktop.switchToActiveWindow();
            await teamsDesktop.switchToLibraryIframe();
        }
        // ignore the time and name
        await pinInTeamsDialog.hideNameAndTimeInPinToTeamsDialog();
        await takeScreenshotByElement(await share.getPinInTeamsDialog(), 'TC91381_1', 'teams_channel_dialog');
        // select Teams
        await pinInTeamsDialog.selectTeamWithKeyWord('Sales and Marketing');
        // select channel
        await pinInTeamsDialog.selectChannelWithKeyWord('Monthly Reports');
        const pinBtn = await share.getPinInPinToTeamDialog();
        // click Pin when it's enabled
        await teamsDesktop.waitForElementEnabled(pinBtn);
        await pinBtn.click();
        // wait for the pin process, the spinner will disappear
        await teamsDesktop.waitForElementStaleness(await pinInTeamsDialog.getWhiteSpinner());
        // click view in tab
        await share.viewPinnedObjectInTab();
        // window will jump to the pinned dossier in tab, will wait for the dossier to load
        await teamsDesktop.switchToActiveWindow();
        // there's chance the tab may not be selected, in this case, we need to select the tab
        if (
            !(await conversation.isTabSelectedInTeamsChannel('Teams Locale', 'Sales and Marketing', 'Monthly Reports'))
        ) {
            console.log('select the tab since it is not selected');
            await conversation.chooseTab('Teams Locale');
        }
        await teamsDesktop.switchToEmbeddedDossierIframe();
        await dossierPage.waitForDossierLoading();
        await since('Dossier title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual(['Teams Locale', 'Chapter 1', 'Page 1']);
        await browser.switchToFrame(null);
        await since('The title should be #{expected}, instead we have #{actual}')
            .expect(await browser.getTitle())
            .toContain('Teams and Channels | Monthly Reports | MSFT');
        // // switch user to check the pinned dossier
        // await teamsDesktop.switchToTeamsUser('another user');
        // await teamsDesktop.switchToAppInSidebar('Teams');
        // await teamsDesktop.switchToTeamsChannel('Sales and Marketing', 'Monthly Reports');
        // await conversation.waitForTabAppear('Teams Locale');
        // await conversation.chooseTab('Teams Locale');
        // await teamsDesktop.switchToLibraryIframe();
        // await dossierPage.waitForDossierLoading();
        // console.log('expecting dossier in tab to have navigation bar without library/edit/account button');
        // await takeScreenshotByElement(await dossierPage.getNavigationBar(), 'TC91381_1', 'navigation_bar');
    });

    it('[TC91382] Test app function - User can add a dossier into channel Tab ', async () => {
        browser.options.current_case = 'TC91382';
        await teamsDesktop.switchToTeamsChannel({ team: 'Sales and Marketing', channel: 'Monthly Reports' });
        await pinFromChannel.pinNewDossierFromChannel('Teams SSO');
        await teamsDesktop.waitForLibraryLoadingInFrame();
        await teamsDesktop.waitForElementVisible(await modalDialog.getDefaultDossierCoverImage());
        const tabConfigPage = await modalDialog.getTabConfigPage();
        await takeScreenshotByElement(tabConfigPage, 'TC91382_1', 'Teams tab config page');
        // select dossier
        await modalDialog.chooseDossierAndSave('Teams Locale');
        await browser.switchToFrame(null);
        await conversation.waitForTabAppear('Teams Locale');
        // await conversation.chooseTab('Teams Locale');
        await teamsDesktop.switchToLibraryIframe();
        await dossierPage.waitForDossierLoading();
        console.log('expecting dossier in tab to have navigation bar without library/edit/account button');
        // await teamsDesktop.waitForElementVisible(navBar); navBar is visable, yet the buttons are not enabled
        await teamsDesktop.waitForElementVisible(await filterSummaryBar.getFilterBarItem());
        const navBar = await dossierPage.getNavigationBar();
        await takeScreenshotByElement(navBar, 'TC91382_2', 'navigation_bar');
        // expecting the url is the same as the pinned dossier
        var url = await teamsDesktop.getLibraryURLInBrowser();
        url = url.split('app')[1];
        await since('The url should be #{expected}, instead we have #{actual}')
            .expect(url)
            .toBe('/73E53B9A11EAB363B78E0080EF8506F9/BF62079E794B37F8D902C5818D8D9980/K53--K46');
    });

    it('[TC91383] Test app function - User can perform search in Teams app, yet the result limits to dossier type only', async () => {
        await teamsDesktop.switchToAppInSidebar('Teams Standard');
        await teamsDesktop.waitForLandingPage();
        await teamsDesktop.loginStandardUser(users['teams_standard'].credentials);
        await since('The create new display should be #{expect} in Teams app, yet it is #{actual}')
            .expect(await teamsDesktop.isAddNewInTeamsLibraryDisplayed())
            .toBe(false);
        // switch to application TestTest which has content discovery enabled in Teams
        console.log('expecting default app to be MicroStrategy');
        await since('#{expected} is the default app, instead we have #{actual}')
            .expect(await libraryPage.userAccount.isApplicationSelected('MicroStrategy'))
            .toBe(true);
        await libraryPage.userAccount.clickApplication('TestTest');
        await libraryPage.waitForLibraryLoading();
        // TestTest application has navigationBar collapsed by default
        if (!(await libraryPage.getLibraryIcon().isDisplayed())) {
            console.log("Expand the navigation bar, since it's collapsed by default");
            await teamsDesktop.getShowTheToolbarButton().click();
        }
        await libraryPage.openSidebarOnly();
        await sidebar.openContentDiscovery();
        // click button to open sidebar will leave tooltip open forever... put this after cd opened
        console.log('tab subscriptions and insights should be hidden in opend sidebar');
        await takeScreenshotByElement(await sidebar.getSidebarContainer(), 'TC91383_1', 'sidebar_list');

        // some time the folder panel is not expanded, need to click the content discovery again
        await contentDiscovery.openFolderPanel();
        await contentDiscovery.openProjectList();
        await contentDiscovery.selectProject('MicroStrategy Tutorial');
        await contentDiscovery.openFolderByPath(['Shared Reports', 'Android', 'Report']);
        await since(
            'expecting only dossier is displayed, the count of rows should be #{expected}, instead we have #{actual}'
        )
            .expect(await teamsDesktop.getItemRowListInContentDiscovery().length)
            .toBe(2); // a dossier row and a header row
        await sidebar.openAllSectionList();
        await libraryPage.closeSidebar();
        // search result only shows dossier
        await librarySearch.openSearchBox();
        await librarySearch.search('report'); // both document and report have report in name, yet only dossier is displayed
        await librarySearch.pressEnter();
        await teamsDesktop.waitForElementStaleness(await teamsDesktop.getSpinner());
        await since('expecting the count of All should be #{expected}, instead we have #{actual}')
            .expect(await fullSearch.getAllTabCount())
            .toBe(1);
        await fullSearch.clickAllTab();
        await since('the only result should be #{expected} dossier, instead we have #{actual}')
            .expect(await teamsDesktop.getGlobalResultItem().getText())
            .toBe('Retail Sales Report');
    });

    it('[TC91384] User will view customized appearance designed for Library Teams app in Library home page', async () => {
        await teamsDesktop.switchToAppInSidebar('Teams SSO');
        await teamsDesktop.waitForLibraryLoadingInFrame();
        await since('The create new display should be #{expect} in Teams app, yet it is #{actual}')
            .expect(await teamsDesktop.isAddNewInTeamsLibraryDisplayed())
            .toBe(false);
        await libraryPage.openUserAccountMenu();
        console.log('expecting user account menu to be visible with correct list of options');
        await takeScreenshotByElement(
            await libraryPage.userAccount.getAccountDropdown(),
            'TC91384_1',
            'user_account_menu'
        );
        console.log('open filter and expecting type hidden in filter menu');
        await libraryPage.clickFilterIcon();
        const filterMenu = await libraryPage.getFilterContainer();
        await teamsDesktop.waitForElementVisible(filterMenu);
        await takeScreenshotByElement(filterMenu, 'TC91384_2', 'filter_menu');
        console.log('closing filter menu');
        await libraryPage.closeFilterPanel();
        console.log('looking info panel of dossier in All tab');
        if (await libraryPage.isSidebarOpened()) {
            // go to All tab
            console.log('close sidebar since it is opened');
            const allSection = await sidebar.getAllSection();
            if (!(await allSection.getAttribute('aria-selected'))) {
                await sidebar.clickAllSection();
            }
            await libraryPage.closeSidebar();
        }
        console.log('open info panel of dossier Teams Locale');
        const gridView = await listView.getViewModeSwitchGridViewOption();
        if ((await gridView.getAttribute('aria-pressed')) === 'false') {
            await listView.deselectListViewMode();
        }
        await libraryPage.openDossierInfoWindow('Teams Locale');
        await since('when Edit is disabled')
            .expect(await infoWindow.isEditIconPresent())
            .toBe(false);
        // edit invisible in list view, ignore eidt in info panel since it is the same as grid view
        await listView.selectListViewMode();
        console.log("hovering dossier 'Teams Locale' in list view");
        // await teamsDesktop.waitForElementVisible(dossierRow);
        // here's a bug somehow, the element position is in previous row, hence we are looking for
        await listView.hoverDossier('Teams Locale');
        await since('The presence of edit button is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await infoWindow.isEditIconPresent())
            .toBe(false);
        await takeScreenshotByElement(await teamsDesktop.getFirstDossierRowActionBar(), 'TC91384_3', 'action_bar_view');
        // switch back to grid view
        await listView.deselectListViewMode();
    });

    it('[TC91398] User will view customized appearance designed for Library Teams app in Dossier Consumption page', async () => {
        await teamsDesktop.switchToAppInSidebar('Teams SSO');
        await teamsDesktop.waitForLibraryLoadingInFrame();
        await libraryPage.openDossier('Teams Locale');
        await dossierPage.waitForDossierLoading();
        console.log('expecting dossier consumption page to have navigation bar without edit button');
        await takeScreenshotByElement(await dossierPage.getNavigationBar(), 'TC91398_1', 'navigation_bar');
        await libraryPage.openUserAccountMenu();
        await takeScreenshotByElement(await libraryPage.userAccount.getAccountDropdown(), 'TC91398_2', 'account_menu');
    });

    it('[TC91455] User can pin a dossier to Teams channel Tab with application and page specified', async () => {
        browser.options.current_case = 'TC91455';
        await teamsDesktop.switchToAppInSidebar('Teams Standard');
        await teamsDesktop.waitForLandingPage();
        await teamsDesktop.loginStandardUser(users['teams_standard'].credentials);
        // switch to application TestTest
        // for local test adoption
        // await libraryPage.openUserAccountMenu();
        // // the funtion is not working due to the getAccountMenuOption('My Applications') is not working, the Option becomes 'Applications' in Teams app somehow
        // await teamsDesktop.click({ elem: libraryPage.userAccount.getAccountMenuOption('Applications') });
        // await teamsDesktop.click({ elem: libraryPage.userAccount.getCustomAppByName('TestTest') });
        await libraryPage.userAccount.switchCustomApp('TestTest');
        await libraryPage.waitForLibraryLoading();
        // TestTest application has navigationBar collapsed by default
        if (!(await libraryPage.getLibraryIcon().isDisplayed())) {
            console.log("Expand the navigation bar, since it's collapsed by default");
            await teamsDesktop.getShowTheToolbarButton().click();
        }
        // search for Dossier Page to Page linking
        await quickSearch.openSearchSlider();
        console.log('Open dossier Page to Page linking from Recently viewed');
        await quickSearch.openDossierFromRecentlyViewedByName('Page to Page Linking');
        // enter left key to go to previous page
        await dossierPage.switchPageByKey('left');
        await dossierPage.waitForDossierLoading();
        // open pin to teams dialog
        // TestTest application has navigationBar collapsed by default
        if (!(await libraryPage.getLibraryIcon().isDisplayed())) {
            console.log("Expand the navigation bar, since it's collapsed by default");
            await teamsDesktop.getShowTheToolbarButton().click();
        }
        const windowNumber = (await teamsDesktop.getBrowserTabs()).length;
        await share.clickPinInTeams();
        // login Teams since it's first time to pin dossier to Teams
        if (await teamsDesktop.isPopUpLoginPageExisting(windowNumber)) {
            console.log('login Teams since it is first time to pin dossier to Teams');
            await teamsDesktop.switchToNewWindow();
            await azureLoginPage.loginWithPassword(browser.options.params.credentials.password);
            await azureLoginPage.safeContinueAzureLogin();
            await teamsDesktop.switchToActiveWindow();
            await teamsDesktop.switchToLibraryIframe();
        }
        // select Teams
        await pinInTeamsDialog.selectTeamWithKeyWord('Sales and Marketing');
        // select channel
        await pinInTeamsDialog.selectChannelWithKeyWord('Monthly Reports');
        const pinBtn = await share.getPinInPinToTeamDialog();
        // click Pin when it's enabled
        await teamsDesktop.waitForElementEnabled(pinBtn);
        await pinBtn.click();
        // wait for the pin process, the spinner will disappear
        await teamsDesktop.waitForElementStaleness(await pinInTeamsDialog.getWhiteSpinner());
        // click view in tab
        await share.viewPinnedObjectInTab();
        // there's chance the tab may not be selected, in this case, we need to select the tab
        await teamsDesktop.switchToActiveWindow();
        if (
            !(await conversation.isTabSelectedInTeamsChannel(
                'Page to Page Linking',
                'Sales and Marketing',
                'Monthly Reports'
            ))
        ) {
            console.log('select the tab since it is not selected');
            await conversation.chooseTab('Page to Page Linking');
        }
        // window will jump to the pinned dossier in tab, will wait for the dossier to load
        await teamsDesktop.switchToEmbeddedDossierIframe();
        await dossierPage.waitForDossierLoading();
        await teamsDesktop.waitForCurtainDisappear();
        // expecting the url is the same as the pinned dossier
        var url = await teamsDesktop.getLibraryURLInBrowser();
        url = url.split('app')[1];
        await since('The url should be #{expected}, instead we have #{actual}')
            .expect(url)
            .toBe(
                '/config/A5214CDE59DC4D34977B7AA3AFB1EC88/B7CA92F04B9FAE8D941C3E9B7E0CD754/48A9D2A211E7AF6431F90080EFD50CBA/K85--K78?'
            );
        await takeScreenshotByElement(await teamsDesktop.getDossierNotification(), 'TC91455_1', 'notification');
    });
});
