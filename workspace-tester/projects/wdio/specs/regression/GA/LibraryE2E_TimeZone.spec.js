import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import resetUserTimezone from '../../../api/resetUserTimezone.js';
import resetDossierState from '../../../api/resetDossierState.js';

const specConfiguration = { ...customCredentials('_timezone') };
const timezoneUserID = '2A2F4B9C450964C0393C2596066A34C2';

describe('E2E test for Timezone', () => {
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

    const browserWindow = {
        width: 1200,
        height: 1200,
    };

    let { loginPage, libraryPage, dossierPage, grid, filterPanel, filterSummary, userPreference, timezone } =
        browsers.pageObj1;

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

    it('[TC79640_01] Validate E2E workflow of Timezone on Library Web - change user level timezone', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });
        // change user level timezone
        await libraryPage.openUserAccountMenu();
        await libraryPage.openPreferencePanel();
        await takeScreenshotByElement(userPreference.getPreferenceSecondaryPanel(), 'TC79640_01', 'preference panel');
        await userPreference.openTimezoneList();
        await userPreference.changeUserTimezone('Asia Shanghai time');
        await userPreference.savePreference();
        await libraryPage.closeUserAccountMenu();

        //Open dossier to check user level timezone
        await libraryPage.openDossier(dossier.name);
        await dossierPage.waitForDossierLoading();
        await since('The first element of Time_TZ attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Time_TZ' }))
            .toBe('1/1/2008 9:02:06 AM');
        await filterPanel.openFilterPanel();
        await since('Timezone in Timezone container should be #{expected}, instead we have #{actual}')
            .expect(await timezone.getTimezoneItemText())
            .toBe('Asia Shanghai time');
        await timezone.openTimezoneSecondaryPanel();
        await since('My Timezone should be #{expected}, instead we have #{actual}')
            .expect(await timezone.getMyTimezoneText())
            .toBe('Asia Shanghai time');
        await takeScreenshotByElement(timezone.getSecondaryPanel(), 'TC79640_01', 'timezone secondary panel');

        // click edit button to change user level timezone
        await timezone.editTimezone();
        await userPreference.openTimezoneList();
        await userPreference.changeUserTimezone('Default');
        await since('Change description present should be #{expected}, instead we have #{actual}')
            .expect(await userPreference.isChangeDescPresent())
            .toBe(true);
        await takeScreenshotByElement(userPreference.getPreferenceSecondaryPanel(), 'TC79640_03', 'change description');
        await userPreference.savePreference();

        //re-open dossier to verify whether the timezone take effect
        await dossierPage.reload();
        await since(
            'After change user timezone, The first element of Time_TZ attribute should be #{expected}, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Time_TZ' }))
            .toBe('12/31/2007 8:02:06 PM');
        await since('In filter summary, Dashboard Time Zone should be #{expected}, while we got #{actual}')
            .expect(await filterSummary.filterItems('Dashboard Time Zone'))
            .toBe('(America New York time)');
    });

    it('[TC79640_02] Validate E2E workflow of Timezone on Library Web - change dossier level timezone', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });
        await libraryPage.openDossier(dossier.name);
        await dossierPage.waitForDossierLoading();
        await since('The first element of Time_TZ attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Time_TZ' }))
            .toBe('12/31/2007 8:02:06 PM');
        // change from my timezone to fixed timezone
        await filterPanel.openFilterPanel();
        await timezone.openTimezoneSecondaryPanel();
        await timezone.selectFixedTimezone('Etc UTC time');
        await filterPanel.apply();
        await since(
            'After change timezone, The first element of Time_TZ attribute should be #{expected}, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Time_TZ' }))
            .toBe('1/1/2008 1:02:06 AM');
        await since('In filter summary, Dashboard Time Zone should be #{expected}, while we got #{actual}')
            .expect(await filterSummary.filterItems('Dashboard Time Zone'))
            .toBe('(Etc UTC time)');

        // change user level timezone
        await libraryPage.openUserAccountMenu();
        await libraryPage.openPreferencePanel();
        await userPreference.openTimezoneList();
        await userPreference.changeUserTimezone('Asia Shanghai time');
        // when change user level timezone in dossier, the change desc should present
        await since('Change description present should be #{expected}, instead we have #{actual}')
            .expect(await userPreference.isChangeDescPresent())
            .toBe(true);
        await userPreference.savePreference();
        await libraryPage.closeUserAccountMenu();

        //reload to verify whether the dossier level timezone has been changed
        await dossierPage.reload();
        await since(
            'After change timezone and re-open, The first element of Time_TZ attribute should be #{expected}, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Time_TZ' }))
            .toBe('1/1/2008 1:02:06 AM');
        await since('In filter summary, Dashboard Time Zone should be #{expected}, while we got #{actual}')
            .expect(await filterSummary.filterItems('Dashboard Time Zone'))
            .toBe('(Etc UTC time)');
    });

    it('[TC79640_03] Validate E2E workflow of Timezone on Library Web - lock timezone for Apply users timezone', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: applyUsersTZ_LockDossier,
        });
        // verify cannot open timezone secondary when timezone is locked
        await libraryPage.openDossier(applyUsersTZ_LockDossier.name);
        await since('The first element of Time_TZ attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Time_TZ' }))
            .toBe('12/31/2007 8:02:06 PM');
        await filterPanel.openFilterPanel();
        await since('Selected Timezone should be #{expected}, instead we have #{actual}')
            .expect(await timezone.getTimezoneItemText())
            .toBe('America New York time');
        await since(
            'Locked timezone cannot open secondary panel, timezone locked should be #{expected}, instead we have #{actual}'
        )
            .expect(await timezone.isTimezoneLocked())
            .toBe(true);
        await takeScreenshotByElement(filterPanel.getFilterPanelWrapper(), 'TC79640_03', 'applyUsersTZ_LockDossier');

        // verify when user level timezone changes, timezone in filter panel is updated
        await libraryPage.openUserAccountMenu();
        await libraryPage.openPreferencePanel();
        await userPreference.openTimezoneList();
        await userPreference.changeUserTimezone('Etc UTC time');
        await since('Change description present should be #{expected}, instead we have #{actual}')
            .expect(await userPreference.isChangeDescPresent())
            .toBe(true);
        await userPreference.savePreference();

        //re-open dossier to verify whether the timezone take effect
        await dossierPage.reload();
        await since(
            'After change user timezone, The first element of Time_TZ attribute should be #{expected}, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Time_TZ' }))
            .toBe('1/1/2008 1:02:06 AM');
        await since('In filter summary, Dashboard Time Zone should be #{expected}, while we got #{actual}')
            .expect(await filterSummary.filterItems('Dashboard Time Zone'))
            .toBe('(Etc UTC time)');
    });

    it('[TC79640_04] Validate E2E workflow of Timezone on Library Web - lock timezone for use a fixed timezone', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: useFixedTZ_LockDossier,
        });

        // verify cannot open timezone secondary when timezone is locked
        await libraryPage.openDossier(useFixedTZ_LockDossier.name);
        await dossierPage.waitForDossierLoading();
        await since('The first element of Time_TZ attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Time_TZ' }))
            .toBe('1/1/2008 1:02:06 AM');
        await filterPanel.openFilterPanel();
        await since('Selected Timezone should be #{expected}, instead we have #{actual}')
            .expect(await timezone.getTimezoneItemText())
            .toBe('Etc UTC time');
        await since(
            'Locked timezone cannot open secondary panel, timezone locked should be #{expected}, instead we have #{actual}'
        )
            .expect(await timezone.isTimezoneLocked())
            .toBe(true);
        await takeScreenshotByElement(filterPanel.getFilterPanelWrapper(), 'TC79640_04', 'useFixedTZ_LockDossier');

        // verify when user level timezone changes, timezone in filter panel is updated
        await libraryPage.openUserAccountMenu();
        await libraryPage.openPreferencePanel();
        await userPreference.openTimezoneList();
        await userPreference.changeUserTimezone('Default');
        await since('Change description present should be #{expected}, instead we have #{actual}')
            .expect(await userPreference.isChangeDescPresent())
            .toBe(false);
        await userPreference.savePreference();

        //re-open dossier to verify whether the timezone take effect
        await dossierPage.reload();
        await since(
            'After change user timezone, The first element of Time_TZ attribute should be #{expected}, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Time_TZ' }))
            .toBe('1/1/2008 1:02:06 AM');
        await since('In filter summary, Dashboard Time Zone should be #{expected}, while we got #{actual}')
            .expect(await filterSummary.filterItems('Dashboard Time Zone'))
            .toBe('(Etc UTC time)');
    });
});

export const config = specConfiguration;
