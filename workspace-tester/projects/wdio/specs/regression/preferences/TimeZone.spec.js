import users from '../../../testData/users.json' assert { type: 'json' };
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import resetUserTimezone from '../../../api/resetUserTimezone.js';
import resetDossierState from '../../../api/resetDossierState.js';

const specConfiguration = { ...customCredentials('_timezone') };
const timezoneUserID = '2A2F4B9C450964C0393C2596066A34C2';

describe('Functionality test for Timezone', () => {
    const timezoneProject = {
        id: '9A7E738747DFAE62B4458A8B96EBA314',
        name: 'MicroStrategy Tutorial Timezone',
    };

    const dossier = {
        id: '287A10B94E938AB604F2C9A02BEA9130',
        name: 'Auto_Timezone_E2E',
        project: timezoneProject,
    };

    const applyUsersTZ_LockDossier = {
        id: '7778A07846BF2400E82453BAEE711857',
        name: 'Auto_Timezone_E2E_ApplyUsersTZ_Lock',
        project: timezoneProject,
    };

    const useFixedTZ_LockDossier = {
        id: 'CBA5757F401B7931E17B7A972C5ECB48',
        name: 'Auto_Timezone_E2E_UseFixedTZ_Lock',
        project: timezoneProject,
    };

    const tzXFunc = {
        id: 'CE74782D4ACCF86AC0B95DAF299E2AAA',
        name: 'Auto_Timezone_Xfunc',
        project: timezoneProject,
    };

    const browserWindow = {
        width: 1200,
        height: 1200,
    };

    let {
        loginPage,
        libraryPage,
        dossierPage,
        toc,
        grid,
        filterPanel,
        filterSummary,
        checkboxFilter,
        filterSummaryBar,
        userPreference,
        userAccount,
        timezone,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        await resetUserTimezone({
            userId: [timezoneUserID],
            credentials: specConfiguration.credentials,
        });
        await libraryPage.reload();
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC79629_01] Validate functionality of user level Timezone on Library Web - Click cancel will not keep change', async () => {
        // click cancel button will not keep TZ selection
        await libraryPage.openUserAccountMenu();
        await libraryPage.openPreferencePanel();
        await userPreference.openTimezoneList();
        await userPreference.changeUserTimezone('Etc UTC time');
        await userPreference.cancelChange();

        await libraryPage.openPreferencePanel();
        await since('After cancel, user TZ should be #{expected}, while we got #{actual}')
            .expect(await userPreference.selectedTimezone())
            .toBe('Default');
        await userAccount.closeUserAccountMenu();
    });

    it('[TC79629_02] Validate functionality of user level Timezone on Library Web - change TZ', async () => {
        // change default to fixed
        await libraryPage.openUserAccountMenu();
        await libraryPage.openPreferencePanel();
        await userPreference.openTimezoneList();
        await userPreference.changeUserTimezone('Etc UTC time');
        await userPreference.savePreference();
        await libraryPage.openPreferencePanel();
        await since('After change to Etc UTC time, user TZ should be #{expected}, while we got #{actual}')
            .expect(await userPreference.selectedTimezone())
            .toBe('Etc UTC time');

        // change fixed to fixed
        await userPreference.openTimezoneList();
        await userPreference.changeUserTimezone('Asia Shanghai time');
        await userPreference.savePreference();
        await libraryPage.openPreferencePanel();
        await since('After change to Asia Shanghai time, user TZ should be #{expected}, while we got #{actual}')
            .expect(await userPreference.selectedTimezone())
            .toBe('Asia Shanghai time');

        // change fixed to default
        await userPreference.openTimezoneList();
        await userPreference.changeUserTimezone('Default');
        await userPreference.savePreference();
        await libraryPage.openPreferencePanel();
        await since('After change to default, user TZ should be #{expected}, while we got #{actual}')
            .expect(await userPreference.selectedTimezone())
            .toBe('Default');
        await userAccount.closeUserAccountMenu();
    });

    it('[TC79639_01] Validate functionality of dossier level Timezone on Library Web - clear all filters', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: tzXFunc,
        });

        //Check apply and clear all filters button
        await libraryPage.openDossier(tzXFunc.name);
        await toc.openPageFromTocMenu({ chapterName: 'timezone and filter', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();
        await since('Timezone should be #{expected}, while we got #{actual}')
            .expect(await timezone.getTimezoneItemText())
            .toBe('America New York time');
        await since('Apply enabled should be #{expected}, while we got #{actual}')
            .expect(await filterPanel.isApplyEnabled())
            .toBe(false);
        await since('isClearFilterDisabled should be #{expected}, while we got #{actual}')
            .expect(await filterPanel.isClearFilterDisabled())
            .toBe(false);

        // clear all filters will not clear TZ
        await filterPanel.clearFilter();
        await since('Timezone should be #{expected}, while we got #{actual}')
            .expect(await timezone.getTimezoneItemText())
            .toBe('America New York time');
        await filterPanel.apply();
        await since('Dossier timezone summary should be #{expected}, while we got #{actual}')
            .expect(await filterSummary.filterItems('Dashboard Time Zone'))
            .toBe('(America New York time)');
        await since('The first element of Time_TZ attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Time_TZ' }))
            .toBe('12/31/2007 8:02:06 PM');
    });

    it('[TC79639_02] Validate functionality of dossier level Timezone on Library Web - change TZ with filter', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: tzXFunc,
        });

        await libraryPage.openDossier(tzXFunc.name);
        await toc.openPageFromTocMenu({ chapterName: 'timezone and filter', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();
        await since('Timezone should be #{expected}, while we got #{actual}')
            .expect(await timezone.getTimezoneItemText())
            .toBe('America New York time');

        // change TZ only
        await timezone.openTimezoneSecondaryPanel();
        await timezone.selectFixedTimezone('Asia Shanghai time');
        await filterPanel.apply();
        await since('Dossier timezone summary should be #{expected}, while we got #{actual}')
            .expect(await filterSummary.filterItems('Dashboard Time Zone'))
            .toBe('(Asia Shanghai time)');
        await since('The first element of Time_TZ attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Time_TZ' }))
            .toBe('1/1/2008 9:09:12 AM');

        // change TZ and filter
        // change fixed to default
        await filterPanel.openFilterPanel();
        await timezone.openTimezoneSecondaryPanel();
        await timezone.selectMyTimezone();
        await checkboxFilter.openSecondaryPanel('Category');
        await checkboxFilter.selectElementByName('Books');
        await filterPanel.apply();
        await since('Dossier timezone summary should be #{expected}, while we got #{actual}')
            .expect(await filterSummary.filterItems('Dashboard Time Zone'))
            .toBe('(America New York time)');
        await since('Category summary should be #{expected}, while we got #{actual}')
            .expect(await filterSummary.filterItems('Category'))
            .toBe('(Electronics)');
        await since('The first element of Time_TZ attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Time_TZ' }))
            .toBe('12/31/2007 8:11:44 PM');
    });

    it('[TC79639_03] Validate functionality of dossier level Timezone on Library Web - without apply, selection should not be kept after close filter panel', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });

        //Check apply and clear all filters button
        await libraryPage.openDossier(dossier.name);
        await filterPanel.openFilterPanel();
        await since('Timezone should be #{expected}, while we got #{actual}')
            .expect(await timezone.getTimezoneItemText())
            .toBe('America New York time');
        await timezone.openTimezoneSecondaryPanel();
        await timezone.selectFixedTimezone('Asia Shanghai time');

        // without apply, selection should not be kept after close filter panel
        await filterPanel.closeFilterPanelByCloseIcon();
        await since('Dossier timezone summary should be #{expected}, while we got #{actual}')
            .expect(await filterSummary.filterItems('Dashboard Time Zone'))
            .toBe('(America New York time)');
        await since('The first element of Time_TZ attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Time_TZ' }))
            .toBe('12/31/2007 8:02:06 PM');
        await filterPanel.openFilterPanel();
        await since('Timezone should be #{expected}, while we got #{actual}')
            .expect(await timezone.getTimezoneItemText())
            .toBe('America New York time');
        await filterPanel.closeFilterPanelByCloseIcon();
    });

    it('[TC82969_01] Validate Functionality of Timezone on Library Web - My Timezone when dossier TZ=default and userTZ=default', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });

        //Check mytimezone when set dossierTZ=default and userTZ=default
        await libraryPage.openDossier(dossier.name);
        await since('Dossier timezone summary should be #{expected}, while we got #{actual}')
            .expect(await filterSummary.filterItems('Dashboard Time Zone'))
            .toBe('(America New York time)');
        await since('The first element of Time_TZ attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Time_TZ' }))
            .toBe('12/31/2007 8:02:06 PM');
        await filterPanel.openFilterPanel();
        await timezone.openTimezoneSecondaryPanel();
        await since(
            'When set dossierTZ=default and userTZ=default, My Timezone should be #{expected}, instead we have #{actual}'
        )
            .expect(await timezone.getMyTimezoneText())
            .toBe('America New York time');
        //has issue
        await since(
            'When set dossierTZ=default and userTZ=default, First Timezone should be #{expected}, instead we have #{actual}'
        )
            .expect(await timezone.firstTimezoneItemText())
            .toBe('Etc UTC time');
    });

    it('[TC82969_02] Validate Functionality of Timezone on Library Web - My Timezone when dossier TZ=default and userTZ=fixed', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });
        // change user level timezone
        await libraryPage.openUserAccountMenu();
        await libraryPage.openPreferencePanel();
        await userPreference.openTimezoneList();
        await userPreference.changeUserTimezone('Etc UTC time');
        await since('Change description present should be #{expected}, instead we have #{actual}')
            .expect(await userPreference.isChangeDescPresent())
            .toBe(false);
        await userPreference.savePreference();
        await userAccount.closeUserAccountMenu();

        //Check mytimezone when set dossierTZ=default and userTZ=fixed
        await libraryPage.openDossier(dossier.name);
        await since('The first element of Time_TZ attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Time_TZ' }))
            .toBe('1/1/2008 1:02:06 AM');
        await filterPanel.openFilterPanel();
        await timezone.openTimezoneSecondaryPanel();
        await since(
            'When set dossierTZ=default and userTZ=default, My Timezone should be #{expected}, instead we have #{actual}'
        )
            .expect(await timezone.getMyTimezoneText())
            .toBe('Etc UTC time');
    });

    it('[TC82969_03] Validate Functionality of Timezone on Library Web - My Timezone when dossierTZ=fixed and userTZ=default', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });

        // change dossier level timezone
        await libraryPage.openDossier(dossier.name);
        await filterPanel.openFilterPanel();
        await timezone.openTimezoneSecondaryPanel();
        await timezone.selectFixedTimezone('Etc UTC time');
        await filterPanel.apply();
        await since('The first element of Time_TZ attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Time_TZ' }))
            .toBe('1/1/2008 1:02:06 AM');

        //Check mytimezone when set dossierTZ=fixed and userTZ=default
        await filterPanel.openFilterPanel();
        await timezone.openTimezoneSecondaryPanel();
        // has issue
        await since(
            'When set dossierTZ=fixed and userTZ=default, My Timezone should be #{expected}, instead we have #{actual}'
        )
            .expect(await timezone.getMyTimezoneText())
            .toBe('America New York time');
    });

    it('[TC82969_04] Validate Functionality of Timezone on Library Web - My Timezone when dossierTZ=fixed and userTZ=fixed', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });

        //Change dossier level timezone
        await libraryPage.openDossier(dossier.name);
        await filterPanel.openFilterPanel();
        await timezone.openTimezoneSecondaryPanel();
        await timezone.selectFixedTimezone('Etc UTC time');
        await filterPanel.apply();
        await since('The first element of Time_TZ attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Time_TZ' }))
            .toBe('1/1/2008 1:02:06 AM');

        // change userTZ
        await libraryPage.openUserAccountMenu();
        await libraryPage.openPreferencePanel();
        await userPreference.openTimezoneList();
        await userPreference.changeUserTimezone('Asia Shanghai time');
        await since('Change description present should be #{expected}, instead we have #{actual}')
            .expect(await userPreference.isChangeDescPresent())
            .toBe(true);
        await userPreference.savePreference();

        //Check mytimezone when set dossierTZ=fixed and userTZ=fixed
        await dossierPage.reload();
        await filterPanel.openFilterPanel();
        await timezone.openTimezoneSecondaryPanel();
        await since(
            'When set dossierTZ=default and userTZ=default, My Timezone should be #{expected}, instead we have #{actual}'
        )
            .expect(await timezone.getMyTimezoneText())
            .toBe('Asia Shanghai time');
    });

    it('[TC83473] Validate Functionality of Timezone on Library Web - search', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });

        //Change dossier level timezone
        await libraryPage.openDossier(dossier.name);
        await filterPanel.openFilterPanel();
        await timezone.openTimezoneSecondaryPanel();
        await timezone.search('nn');
        await since('SearchWarningMsgPresent of Time_TZ should be #{expected}, instead we have #{actual}')
            .expect(await timezone.isSearchWarningMsgPresent())
            .toBe(true);
        await timezone.clearSearch();
        await timezone.search('Asia');
        await since('After search, timezone number should be #{expected}, instead we have #{actual}')
            .expect(await timezone.getTimezoneNumber())
            .toBe(1);
        await timezone.selectFixedTimezone('Asia Shanghai time');

        //close filter panel, the search result will not keep
        await filterPanel.closeFilterPanel();
        await filterPanel.openFilterPanel();
        await timezone.openTimezoneSecondaryPanel();
        await since('After close, My timezone selected should be #{expected}, instead we have #{actual}')
            .expect(await timezone.isMyTimeZoneSelected())
            .toBe(true);
        await since('After close, Timezone selected should be #{expected}, instead we have #{actual}')
            .expect(await timezone.getTimezoneItemText())
            .toBe('America New York time');
        await timezone.selectFixedTimezone('Asia Shanghai time');
        await filterPanel.apply();
        await since('Dossier timezone summary should be #{expected}, while we got #{actual}')
            .expect(await filterSummary.filterItems('Dashboard Time Zone'))
            .toBe('(Asia Shanghai time)');
        await since('The first element of Time_TZ attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Time_TZ' }))
            .toBe('1/1/2008 9:02:06 AM');
    });

    it('[TC86628] Validate there is no edit button Timezone when account panel is disabled', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });

        //open custom app
        const Timezone_withoutAccount = '0169EC38236842559AD225B9A6FBC812';
        await dossierPage.openCustomAppById({ id: Timezone_withoutAccount });
        await dossierPage.waitForDossierLoading();
        await filterPanel.openFilterPanel();
        await timezone.openTimezoneSecondaryPanel();
        await since('Edit button exist should be #{expected}, instead we have #{actual}')
            .expect(await timezone.isEditButtonPresent())
            .toBe(false);
        await browser.url(browser.options.baseUrl);
    });

    it('[TC79630] Validate compatibility of Timezone on different OS, browser, browser zoom and devices', async () => {
        await libraryPage.closeSidebar();
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });

        // 1. on mobile view: preference secondary panel(reload hint), timezone in filter panel
        await setWindowSize({
            width: 550,
            height: 800,
        });

        await libraryPage.closeSidebar();
        // check preference panel in mobile view
        await libraryPage.hamburgerMenu.openHamburgerMenu();
        await libraryPage.hamburgerMenu.clickOptionInMobileView('Account');
        await takeScreenshotByElement(
            libraryPage.hamburgerMenu.getSliderMenuContainer(),
            'TC79630',
            'Mobile View - account panel'
        );
        await libraryPage.hamburgerMenu.clickOptionInMobileView('Preferences');
        await takeScreenshotByElement(
            libraryPage.hamburgerMenu.getSliderMenuContainer(),
            'TC79630',
            'Mobile View - preference panel'
        );
        await userPreference.openTimezoneList();
        await takeScreenshotByElement(
            libraryPage.hamburgerMenu.getSliderMenuContainer(),
            'TC79630',
            'Mobile View - Open Timezone List'
        );
        await libraryPage.hamburgerMenu.closeHamburgerMenu();

        //check dossier Timezone panel in mobile view
        await libraryPage.openDossier(dossier.name);
        await libraryPage.hamburgerMenu.openHamburgerMenu();
        await libraryPage.hamburgerMenu.clickOptionInMobileView('Filter');
        await takeScreenshotByElement(
            libraryPage.hamburgerMenu.getSliderMenuContainer(),
            'TC79630',
            'Mobile View - Open Filter Panel'
        );
        await libraryPage.hamburgerMenu.openFilterDetailPanelInMobileView('Dashboard Time Zone');
        await takeScreenshotByElement(
            libraryPage.hamburgerMenu.getSliderMenuContainer(),
            'TC79630',
            'Mobile View - Timezone Detail Panel'
        );

        //check with change desc preference page in mobile view
        await libraryPage.hamburgerMenu.clickEditBtnInMobileView();
        await userPreference.openTimezoneList();
        await userPreference.changeUserTimezone('Asia Shanghai time');
        await takeScreenshotByElement(
            libraryPage.hamburgerMenu.getSliderMenuContainer(),
            'TC79630',
            'Mobile View - Preference Panel with change desc'
        );

        await setWindowSize(browserWindow);
        await dossierPage.goToLibrary();
        // 2. on web view: preference secondary panel(reload hint), timezone in filter panel
        //check preference panel in home page
        await libraryPage.openUserAccountMenu();
        await libraryPage.openPreferencePanel();
        await userPreference.openTimezoneList();
        await takeScreenshotByElement(userPreference.getPreferenceSecondaryPanel(), 'TC79630', 'Preference panel');
        await libraryPage.closeUserAccountMenu();

        //check dossier Timezone panel
        await libraryPage.openDossier(dossier.name);
        await filterPanel.openFilterPanel();
        await takeScreenshotByElement(filterPanel.getFilterMainPanel(), 'TC79630', 'Filter panel');
        await timezone.openTimezoneSecondaryPanel();
        await takeScreenshotByElement(timezone.getTimezoneDetailPanel(), 'TC79630', 'Timezone detail panel');

        // check empty search page
        await timezone.search('nn');
        await takeScreenshotByElement(timezone.getTimezoneDetailPanel(), 'TC79630', 'Search Timezone with no result');

        // check with change desc preference page
        await timezone.editTimezone();
        await userPreference.openTimezoneList();
        await userPreference.changeUserTimezone('Asia Shanghai time');
        await takeScreenshotByElement(
            userPreference.getPreferenceSecondaryPanel(),
            'TC79630',
            'Preference panel with change desc'
        );
        await userAccount.closeUserAccountMenu();
    });
});

export const config = specConfiguration;
