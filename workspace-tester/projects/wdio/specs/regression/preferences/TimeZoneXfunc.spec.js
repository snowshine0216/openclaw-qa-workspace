import users from '../../../testData/users.json' assert { type: 'json' };
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import resetUserTimezone from '../../../api/resetUserTimezone.js';
import resetDossierState from '../../../api/resetDossierState.js';
import resetUserLanguage from '../../../api/resetUserLanguage.js';
import FilterSummaryBar from '../../../pageObjects/filter/FilterSummaryBar.js';

const specConfiguration = { ...customCredentials('_timezone') };
const timezoneUserID = '2A2F4B9C450964C0393C2596066A34C2';

describe('Xfunc test for Timezone', () => {
    const timezoneProject = {
        id: '9A7E738747DFAE62B4458A8B96EBA314',
        name: 'MicroStrategy Tutorial Timezone',
    };

    const dossier = {
        id: '287A10B94E938AB604F2C9A02BEA9130',
        name: 'Auto_Timezone_E2E',
        project: timezoneProject,
    };

    const applyUsersTZ = {
        id: '994E8DC84107A04E048D01A34762F78F',
        name: 'Auto_ApplyUsersTZ',
        project: timezoneProject,
    };

    const applyUsersTZ_LockDossier = {
        id: '7778A07846BF2400E82453BAEE711857',
        name: 'Auto_Timezone_E2E_ApplyUsersTZ_Lock',
        project: timezoneProject,
    };

    const useFixedTZ = {
        id: 'EDC414F541EA75B44B45AC9BC23D818A',
        name: 'Auto_UseFixedTZ',
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

    const baseViewTZ = {
        id: 'B3333DD245F1FFC49DAF039EB1DD392E',
        name: 'Auto_Timezone_BaseView',
        project: timezoneProject,
    };

    const dossierTZ = {
        id: '76FDD1E2427F24E6B99F8D8F61B92F50',
        name: 'Auto_Timezone_DisableClearing',
        project: {
            id: '9A7E738747DFAE62B4458A8B96EBA314',
            name: 'MicroStrategy Tutorial Timezone',
        },
    };

    const browserWindow = {
        
        width: 1200,
        height: 1200,
    };

    let {
        libraryPage,
        dossierPage,
        toc,
        grid,
        filterPanel,
        checkboxFilter,
        filterSummary,
        filterSummaryBar,
        userPreference,
        timezone,
        reset,
        bookmark,
        loginPage,
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

    it('[TC87337] Validate x-func of Language on Library Web - Timezone', async () => {
        // change timezone and language at the same time
        await libraryPage.openUserAccountMenu();
        await libraryPage.openPreferencePanel();
        await userPreference.openPreferenceList('My Language');
        await userPreference.changePreference('My Language', 'Albanian (Albania)');
        await userPreference.openPreferenceList('My Time Zone');
        await userPreference.changePreference('My Time Zone', 'Asia Shanghai time');
        await since('Change description present should be #{expected}, instead we have #{actual}')
            .expect(await userPreference.isChangeDescPresent())
            .toBe(true);
        await userPreference.savePreference();
        await libraryPage.openPreferencePanel();
        await since('After change to Albanian (Albania), language should be #{expected}, while we got #{actual}')
            .expect(await userPreference.selectedPreference('My Language'))
            .toBe('Albanian (Albania)');
        await since('After change to Asia Shanghai time, language should be #{expected}, while we got #{actual}')
            .expect(await userPreference.selectedPreference('My Time Zone'))
            .toBe('Asia Shanghai time');
        await userPreference.cancelChange();
        await resetUserLanguage({
            userId: [timezoneUserID],
            credentials: specConfiguration.credentials,
        });

        await libraryPage.logout();
        await loginPage.login(specConfiguration.credentials);
    });

    it('[TC82967] Validate X-func of Timezone on Library Web - Filter Summary', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: tzXFunc,
        });

        // verify timezone in filter summary work as expected - only timezone
        await libraryPage.openDossier(tzXFunc.name);
        await toc.openPageFromTocMenu({ chapterName: 'timezone only', pageName: 'Page 1' });
        await since('In timezone only chapter, dossier timezone summary should be #{expected}, while we got #{actual}')
            .expect(await filterSummary.filterItems('Dashboard Time Zone'))
            .toBe('(America New York time)');
        await filterSummary.viewAllFilterItems();
        await since(
            'The timezone value on filter summary should be #{expected} after switch page and apply customUrl2 with pagekey, instead we have #{actual}'
        )
            .expect(await filterSummary.expandedFilterItems('Dashboard Time Zone'))
            .toBe('America New York time');
        await filterSummaryBar.clickPencilIconByName('Dashboard Time Zone');
        await since(
            'In timezone only chapter, Timezone in Timezone container should be #{expected}, instead we have #{actual}'
        )
            .expect(await timezone.getTimezoneItemText())
            .toBe('America New York time');

        // verify timezone in filter summary work as expected - timezone + filter
        await toc.openPageFromTocMenu({ chapterName: 'timezone and filter', pageName: 'Page 1' });
        await since(
            'In timezone and filter chapter, dossier timezone summary should be #{expected}, while we got #{actual}'
        )
            .expect(await filterSummary.filterItems('Dashboard Time Zone'))
            .toBe('(America New York time)');
        await since(
            'In timezone and filter chapter, dossier filter summary should be #{expected}, while we got #{actual}'
        )
            .expect(await filterSummary.filterItems('Category'))
            .toBe('(Books, Electronics)');
        await filterPanel.openFilterPanel();
        await since(
            'In timezone and filter chapter, Timezone in Timezone container should be #{expected}, instead we have #{actual}'
        )
            .expect(await timezone.getTimezoneItemText())
            .toBe('America New York time');
    });

    it('[TC83205_01] Validate X-func of Timezone on Library Web - Dossier Linking - pass filter to apply users TZ', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: tzXFunc,
        });

        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: applyUsersTZ,
        });

        // pass filter and open in new tab - pass to apply users TZ
        await libraryPage.openDossier(tzXFunc.name);
        await filterPanel.openFilterPanel();
        await timezone.openTimezoneSecondaryPanel();
        await timezone.selectFixedTimezone('Asia Shanghai time');
        await filterPanel.apply();
        await toc.openPageFromTocMenu({ chapterName: 'dossier linking', pageName: 'pass filter' });
        await since('In source dossier, dossier timezone summary should be #{expected}, while we got #{actual}')
            .expect(await filterSummary.filterItems('Dashboard Time Zone'))
            .toBe('(Asia Shanghai time)');
        await since(
            'In the source, The first element of Time_TZ attribute should be #{expected}, instead we have #{actual}'
        )
            .expect(
                await grid.firstElmOfHeader({ title: 'pass to usersTZ and open in new tab', headerName: 'Time_TZ' })
            )
            .toBe('1/1/2008 9:09:12 AM');
        await grid.linkToTargetByGridContextMenu({
            title: 'pass to usersTZ and open in new tab',
            headerName: 'Time_TZ',
        });
        await dossierPage.switchToTab(1);
        await since('In target dossier, dossier timezone summary should be #{expected}, while we got #{actual}')
            .expect(await filterSummary.filterItems('Dashboard Time Zone'))
            .toBe('(Asia Shanghai time)');
        await since(
            'In the target, The first element of Time_TZ attribute should be #{expected}, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Time_TZ' }))
            .toBe('1/1/2008 9:02:06 AM');
        await dossierPage.closeTab(1);
    });

    it('[TC83205_02] Validate X-func of Timezone on Library Web - Dossier Linking - pass filter to fixed TZ', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: tzXFunc,
        });

        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: useFixedTZ,
        });

        // pass filter and open in new tab - pass to apply users TZ
        await libraryPage.openDossier(tzXFunc.name);
        await toc.openPageFromTocMenu({ chapterName: 'dossier linking', pageName: 'pass filter' });
        await since('In source dossier, dossier timezone summary should be #{expected}, while we got #{actual}')
            .expect(await filterSummary.filterItems('Dashboard Time Zone'))
            .toBe('(America New York time)');
        await since(
            'In the source, The first element of Time_TZ attribute should be #{expected}, instead we have #{actual}'
        )
            .expect(
                await grid.firstElmOfHeader({
                    title: 'pass to fixedTZ and open in the same tab',
                    headerName: 'Time_TZ',
                })
            )
            .toBe('12/31/2007 8:09:12 PM');
        await grid.linkToTargetByGridContextMenu({
            title: 'pass to fixedTZ and open in the same tab',
            headerName: 'Category',
            elementName: 'Books',
        });
        await dossierPage.waitForDossierLoading();
        await since('In target dossier, dossier timezone summary should be #{expected}, while we got #{actual}')
            .expect(await filterSummary.filterItems('Dashboard Time Zone'))
            .toBe('(America New York time)');
        await since(
            'In the target, The first element of Time_TZ attribute should be #{expected}, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Time_TZ' }))
            .toBe('12/31/2007 8:09:12 PM');
        await dossierPage.goBackFromDossierLink();
    });

    it('[TC83205_03] Validate X-func of Timezone on Library Web - Dossier Linking - pass filter to apply users TZ_locked', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: tzXFunc,
        });

        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: applyUsersTZ_LockDossier,
        });

        // pass filter and open in new tab - pass to apply users TZ
        await libraryPage.openDossier(tzXFunc.name);
        await filterPanel.openFilterPanel();
        await timezone.openTimezoneSecondaryPanel();
        await timezone.selectFixedTimezone('Asia Shanghai time');
        await filterPanel.apply();
        await toc.openPageFromTocMenu({ chapterName: 'dossier linking', pageName: 'pass filter' });
        await since('In source dossier, dossier timezone summary should be #{expected}, while we got #{actual}')
            .expect(await filterSummary.filterItems('Dashboard Time Zone'))
            .toBe('(Asia Shanghai time)');
        await since(
            'In the source, The first element of Time_TZ attribute should be #{expected}, instead we have #{actual}'
        )
            .expect(
                await grid.firstElmOfHeader({
                    title: 'pass to usersTZ_locked and open the same tab',
                    headerName: 'Time_TZ',
                })
            )
            .toBe('1/1/2008 9:09:12 AM');
        await grid.linkToTargetByGridContextMenu({
            title: 'pass to usersTZ_locked and open the same tab',
            headerName: 'Time_TZ',
        });
        await dossierPage.waitForDossierLoading();
        await since('In target dossier, dossier timezone summary should be #{expected}, while we got #{actual}')
            .expect(await filterSummary.filterItems('Dashboard Time Zone'))
            .toBe('(Asia Shanghai time)');
        await since(
            'In the target, The first element of Time_TZ attribute should be #{expected}, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Time_TZ' }))
            .toBe('1/1/2008 9:02:06 AM');
        await dossierPage.goBackFromDossierLink();
    });

    it('[TC83205_04] Validate X-func of Timezone on Library Web - Dossier Linking - pass filter to fixed TZ_locked', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: tzXFunc,
        });

        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: useFixedTZ_LockDossier,
        });

        // pass filter and open in new tab - pass filter to fixed TZ_locked - filter cannot be passed
        await libraryPage.openDossier(tzXFunc.name);
        await toc.openPageFromTocMenu({ chapterName: 'dossier linking', pageName: 'pass filter' });
        await since('In source dossier, dossier timezone summary should be #{expected}, while we got #{actual}')
            .expect(await filterSummary.filterItems('Dashboard Time Zone'))
            .toBe('(America New York time)');
        await since(
            'In the source, The first element of Time_TZ attribute should be #{expected}, instead we have #{actual}'
        )
            .expect(
                await grid.firstElmOfHeader({ title: 'pass to fixedTZ_locked and open new tab', headerName: 'Time_TZ' })
            )
            .toBe('12/31/2007 8:09:12 PM');
        await grid.linkToTargetByGridContextMenu({
            title: 'pass to fixedTZ_locked and open new tab',
            headerName: 'Time_TZ',
        });
        await dossierPage.switchToTab(1);
        await since('In target dossier, dossier timezone summary should be #{expected}, while we got #{actual}')
            .expect(await filterSummary.filterItems('Dashboard Time Zone'))
            .toBe('(Etc UTC time)');
        await since(
            'In the target, The first element of Time_TZ attribute should be #{expected}, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Time_TZ' }))
            .toBe('1/1/2008 1:02:06 AM');
        await dossierPage.closeTab(1);
    });

    it('[TC83206] Validate X-func of Timezone on Library Web - Reset', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: tzXFunc,
        });
        // reset is not enabled when change user level timezone
        await libraryPage.openDossier(tzXFunc.name);
        await since('By default, timezone should be #{expected}, instead we have #{actual}')
            .expect(await filterSummary.filterItems('Dashboard Time Zone'))
            .toBe('(America New York time)');
        await since('Reset enabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reset.isResetDisabled())
            .toBe(true);
        await libraryPage.openUserAccountMenu();
        await libraryPage.openPreferencePanel();
        await userPreference.openTimezoneList();
        await userPreference.changeUserTimezone('Asia Shanghai time');
        await userPreference.savePreference();
        await libraryPage.reload();
        await since('Reset enabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reset.isResetDisabled())
            .toBe(true);
        await since('After change user timezone, timezone should be #{expected}, instead we have #{actual}')
            .expect(await filterSummary.filterItems('Dashboard Time Zone'))
            .toBe('(Asia Shanghai time)');

        //reset is enabled when change dossier level timezone
        await filterPanel.openFilterPanel();
        await timezone.openTimezoneSecondaryPanel();
        await timezone.selectFixedTimezone('Etc UTC time');
        await filterPanel.apply();
        await since('After change dossier timezone should be #{expected}, instead we have #{actual}')
            .expect(await filterSummary.filterItems('Dashboard Time Zone'))
            .toBe('(Etc UTC time)');
        await since('Reset enabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reset.isResetDisabled())
            .toBe(false);
    });

    it('[TC83288_01] Validate X-Func of Timezone on Library Web - Bookmark - unlocked', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: tzXFunc,
        });
        // 1. apply bookmark with ACL
        await libraryPage.openDossier(tzXFunc.name);
        await bookmark.openPanel();
        await bookmark.applyBookmark('Etc UTC Time', 'SHARED WITH ME');
        await since('Current BM label on navigation bar should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.labelInTitle())
            .toBe('Etc UTC Time');
        await since('After apply bookmark Etc UTC Time, timezone should be #{expected}, instead we have #{actual}')
            .expect(await filterSummary.filterItems('Dashboard Time Zone'))
            .toBe('(Etc UTC time)');
        await filterPanel.openFilterPanel();
        await since('Timezone in filter panel is supposed to be #{expected}, instead we have #{actual}')
            .expect(await timezone.getTimezoneItemText())
            .toBe('Etc UTC time');
        await timezone.openTimezoneSecondaryPanel();
        await since('Timezone number is supposed to be #{expected}, instead we have #{actual}')
            .expect(await timezone.firstTimezoneItemText())
            .toBe('Etc UTC time');

        // 2. apply bookmark without ACL
        await bookmark.openPanel();
        await bookmark.applyBookmark('without ACL', 'SHARED WITH ME');
        await since('Current BM label on navigation bar should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.labelInTitle())
            .toBe('without ACL');
        await since('After apply bookmark without ACL, timezone should be #{expected}, instead we have #{actual}')
            .expect(await filterSummary.filterItems('Dashboard Time Zone'))
            .toBe('(Without ACL)');
        await filterPanel.openFilterPanel();
        await since('Timezone in filter panel is supposed to be #{expected}, instead we have #{actual}')
            .expect(await timezone.getTimezoneItemText())
            .toBe('Without ACL');
        await timezone.openTimezoneSecondaryPanel();
        await since('Timezone number is supposed to be #{expected}, instead we have #{actual}')
            .expect(await timezone.firstTimezoneItemText())
            .toBe('Without ACL');
    });

    it('[TC83288_02] Validate X-Func of Timezone on Library Web - Bookmark - locked fixed TZ', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: useFixedTZ_LockDossier,
        });
        // apply bookmark to fix locked TZ
        // bookmark cannot be applied
        await libraryPage.openDossier(useFixedTZ_LockDossier.name);
        await bookmark.openPanel();
        await bookmark.applyBookmark('Asia Shanghai time');
        await since('Current BM label on navigation bar should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.labelInTitle())
            .toBe('Asia Shanghai time');
        await since(
            'After apply bookmark Asia Shanghai time, timezone should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummary.filterItems('Dashboard Time Zone'))
            .toBe('(Etc UTC time)');
        await filterPanel.openFilterPanel();
        await since('Timezone in filter panel is supposed to be #{expected}, instead we have #{actual}')
            .expect(await timezone.getTimezoneItemText())
            .toBe('Etc UTC time');
    });

    it('[TC83288_03] Validate X-Func of Timezone on Library Web - Bookmark - locked applyusers TZ', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: applyUsersTZ_LockDossier,
        });
        // 1. apply bookmark to users locked TZ
        // bookmark can be applied
        await libraryPage.openDossier(applyUsersTZ_LockDossier.name);
        await bookmark.openPanel();
        await bookmark.applyBookmark('Etc UTC time');
        await since('Current BM label on navigation bar should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.labelInTitle())
            .toBe('Etc UTC time');
        await since(
            'After apply bookmark Asia Shanghai time, timezone should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummary.filterItems('Dashboard Time Zone'))
            .toBe('(Etc UTC time)');
        await filterPanel.openFilterPanel();
        await since('Timezone in filter panel is supposed to be #{expected}, instead we have #{actual}')
            .expect(await timezone.getTimezoneItemText())
            .toBe('Etc UTC time');
    });

    it('[TC83467_01] Validate X-Func of Timezone on Library Web - defaultview - change user timezone', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: baseViewTZ,
        });

        // change user timezone, and reopen basedossier, user timezone change has been kept
        await libraryPage.openDossier(baseViewTZ.name);
        await since('By default, timezone should be #{expected}, instead we have #{actual}')
            .expect(await filterSummary.filterItems('Dashboard Time Zone'))
            .toBe('(America New York time)');
        await libraryPage.openUserAccountMenu();
        await libraryPage.openPreferencePanel();
        await userPreference.openTimezoneList();
        await userPreference.changeUserTimezone('Asia Shanghai time');
        await userPreference.savePreference();
        await libraryPage.reload();
        await since('After change user timezone, timezone should be #{expected}, instead we have #{actual}')
            .expect(await filterSummary.filterItems('Dashboard Time Zone'))
            .toBe('(Asia Shanghai time)');
    });

    it('[TC83467_02] Validate X-Func of Timezone on Library Web - defaultview - change dossier timezone', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: baseViewTZ,
        });

        //change dossier timezone, and reopen basedossier, dossier timezone change will not keep
        await libraryPage.openDossier(baseViewTZ.name);
        await since('Before change dossier timezone should be #{expected}, instead we have #{actual}')
            .expect(await filterSummary.filterItems('Dashboard Time Zone'))
            .toBe('(America New York time)');
        await filterPanel.openFilterPanel();
        await timezone.openTimezoneSecondaryPanel();
        await timezone.selectFixedTimezone('Etc UTC time');
        await filterPanel.apply();
        await since('After change dossier timezone should be #{expected}, instead we have #{actual}')
            .expect(await filterSummary.filterItems('Dashboard Time Zone'))
            .toBe('(Etc UTC time)');
        await libraryPage.reload();
        await since('After re-load, timezone should be #{expected}, instead we have #{actual}')
            .expect(await filterSummary.filterItems('Dashboard Time Zone'))
            .toBe('(America New York time)');
    });

    it('[TC85378] Validate x-func for prevent consumers from clearing (unsetting) filters - Timezone', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossierTZ,
        });
        await libraryPage.openDossier(dossierTZ.name);
        await filterPanel.openFilterPanel();
        // check Clear All Filters when all the filters set to disable clearing
        await since('Reset All Filters button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isResetAllFiltersButtonPresent())
            .toBe(true);
        await since(
            'The Filter is in dynamic status, Reset All Filters button is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.isResetAllFiltersButtonDisabled())
            .toBe(true);
        await since('ContextMenu Present is supposed to be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.isContextMenuDotsPresent('Category'))
            .toBe(false);
        await checkboxFilter.openSecondaryPanel('Category');
        await since(
            'Reset button in dynamic on status present is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.fElement.isFooterButtonDisabled('Reset'))
            .toBe(true);
        await since(
            'Reset button in dynamic on status disabled is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.fElement.isFooterButtonDisabled('Select All'))
            .toBe(true);
        await checkboxFilter.selectElementByName('Music');
        await since(
            'The Filter is in static status, Reset All Filters button is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.isResetAllFiltersButtonDisabled())
            .toBe(false);
        await filterPanel.apply();
    });
});

export const config = specConfiguration;
