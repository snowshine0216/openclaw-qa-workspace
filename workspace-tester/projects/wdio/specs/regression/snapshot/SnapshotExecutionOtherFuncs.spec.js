import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import createSnapshots from '../../../api/snapshot/createSnapshots.js';
import clearUserSnapshots from '../../../api/snapshot/clearUserSnapshots.js';
import resetBookmarks from '../../../api/resetBookmarks.js';
import resetDossierState from '../../../api/resetDossierState.js';
import getSnapshotsByTargetId from '../../../api/snapshot/getSnapshotsByTargetId.js';
import { mockGetSingleSnapshotResponse } from '../../../api/mock/mock-response-utils.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { browserWindow, mobileWindow } from '../../../constants/index.js';
import * as snapshotInfo from '../../../constants/snapshot.js';
import * as customApp from '../../../constants/customApp/customAppBody.js';
import { pinFilterBody } from '../../../constants/customApp/info.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';
import { darkTheme, redTheme, getRequestBody } from '../../../constants/customApp/bot.js';
import {
    resetCityDataByAPI,
    updateCityById,
    getCityDataByAPI,
    resetSalesDataByAPI,
} from '../../../api/whUpdate/index.js';
import _ from 'lodash';

describe('Test run snapshot other funcs', () => {
    let {
        loginPage,
        libraryPage,
        share,
        subscribe,
        subscriptionDialog,
        dossierPage,
        infoWindow,
        grid,
        toc,
        filterPanel,
        baseVisualization,
    } = browsers.pageObj1;
    const snapshotTestUser = snapshotInfo.snapshotRunUser;
    const testCityDashboard = snapshotInfo.testCityDashboard;
    const subscriptionFormats = snapshotInfo.subscriptionFormats;
    const subscriptionSchedules = snapshotInfo.subscriptionSchedules;
    const libraryHomeColorPalettes = customApp.getCustomAppBody({
        version: 'v5',
        name: 'snapshotColorPalettes',
        applicationPalettes: ['7B5D161644EDA945470BE6BB622CB69A', '4866E0694F8F646443342184243A6EB1'],
        applicationDefaultPalette: '7B5D161644EDA945470BE6BB622CB69A',
        useConfigPalettes: true,
    });
    const enableCustomEmail = customApp.getCustomAppBody({
        version: 'v5',
        name: 'snapshotColorPalettes',
    });
    _.set(enableCustomEmail, 'emailSettings', customApp.customEmailDefaultSettingsOnlyEnabled);

    let appIdWithPalette = '';
    let appIdDarkTheme = '';
    let appIdRedTheme = '';
    let appIdPinFilter = '';
    let appIdEnableCustomEmail = '';

    const customAppInfoDark = getRequestBody({
        name: `test custom app color theme - dark`,
        useColorTheme: true,
        selectedTheme: darkTheme,
    });
    const customAppInfoRed = getRequestBody({
        name: `test custom app color theme - red`,
        useColorTheme: true,
        selectedTheme: redTheme,
    });

    beforeAll(async () => {
        await loginPage.login(snapshotTestUser);
        appIdWithPalette = await createCustomApp({
            credentials: snapshotInfo.mstrUser,
            customAppInfo: libraryHomeColorPalettes,
        });
        appIdDarkTheme = await createCustomApp({
            credentials: snapshotInfo.mstrUser,
            customAppInfo: customAppInfoDark,
        });
        appIdRedTheme = await createCustomApp({
            credentials: snapshotInfo.mstrUser,
            customAppInfo: customAppInfoRed,
        });
        appIdPinFilter = await createCustomApp({
            credentials: snapshotInfo.mstrUser,
            customAppInfo: pinFilterBody,
        });
        appIdEnableCustomEmail = await createCustomApp({
            credentials: snapshotInfo.mstrUser,
            customAppInfo: enableCustomEmail,
        });
        await mockGetSingleSnapshotResponse({});
    });

    beforeEach(async () => {
        await resetBookmarks({
            credentials: snapshotTestUser,
            dossier: testCityDashboard,
        });
        await resetDossierState({ credentials: snapshotTestUser, dossier: testCityDashboard });
        await clearUserSnapshots({
            credentials: [snapshotTestUser],
        });
        await resetCityDataByAPI();
        await resetSalesDataByAPI();
        await setWindowSize(browserWindow);
        await libraryPage.openDefaultApp();
    });

    afterAll(async () => {
        await clearUserSnapshots({
            credentials: [snapshotTestUser],
        });
        await libraryPage.openDefaultApp();
        await logoutFromCurrentBrowser();
        await deleteCustomAppList({
            credentials: snapshotInfo.mstrUser,
            customAppIdList: [appIdWithPalette, appIdDarkTheme, appIdRedTheme, appIdPinFilter, appIdEnableCustomEmail],
        });
    });

    it('[TC97774_01] refresh browser in snapshot view', async () => {
        const cityUpdated = 'City TC97774_01';
        const subscriptionName = 'TC97774_01';
        // await createSnapshots({
        //     credentials: snapshotTestUser,
        //     dossiers: [testCityDashboard],
        // });
        await libraryPage.openDossier(testCityDashboard.name);
        await share.openSharePanel();
        await share.openSubscribeSettingsWindow();
        await subscriptionDialog.updateSubscriptionName(subscriptionName);
        await subscriptionDialog.selectFormat(subscriptionFormats.snapshot);
        await subscriptionDialog.selectSchedule(subscriptionSchedules.booksClosed);
        await subscriptionDialog.clickSendNowCheckbox();
        await subscriptionDialog.createSubscription();
        await subscribe.waitForSubscriptionCreated();
        await dossierPage.goToLibrary();
        const cityData = await getCityDataByAPI();
        cityData[0].name = cityUpdated;
        await updateCityById({ cityId: cityData[0].id, cityData: cityData[0] });
        // const snapshots = await getSnapshotsByTargetId({
        //     credentials: snapshotTestUser,
        //     targetId: testCityDashboard.id,
        // });
        // await libraryPage.openSnapshotById({
        //     projectId: snapshots[0].projectId,
        //     objectId: testCityDashboard.id,
        //     messageId: snapshots[0].messageId,
        // });
        await libraryPage.openDossierInfoWindow(testCityDashboard.name);
        await infoWindow.waitForSnapshotSection();
        await infoWindow.openSnapshotFromInfoWindow({});
        await since('1. Grid of city on snapshot view should be #{expected}, instead it is #{actual}')
            .expect(await grid.getCellValue('Visualization 1', 2, 2))
            .toBe('Hangzhou');
        await dossierPage.reload();
        await since('2. Grid of city after refresh browser should be #{expected}, instead it is #{actual}')
            .expect(await grid.getCellValue('Visualization 1', 2, 2))
            .toBe(cityUpdated);
    });

    it('[TC97774_02] browser back after open dashboard in snapshot view', async () => {
        const cityUpdated = 'City TC97774_02';
        await createSnapshots({
            credentials: snapshotTestUser,
            dossiers: [testCityDashboard],
        });
        const cityData = await getCityDataByAPI();
        cityData[0].name = cityUpdated;
        await updateCityById({ cityId: cityData[0].id, cityData: cityData[0] });
        const snapshots = await getSnapshotsByTargetId({
            credentials: snapshotTestUser,
            targetId: testCityDashboard.id,
        });
        await libraryPage.openSnapshotById({
            projectId: snapshots[0].projectId,
            objectId: testCityDashboard.id,
            messageId: snapshots[0].messageId,
        });
        await dossierPage.clickOpenDashboardOnSnapshotBanner();
        await since('2. Grid of city after refresh browser should be #{expected}, instead it is #{actual}')
            .expect(await grid.getCellValue('Visualization 1', 2, 2))
            .toBe(cityUpdated);
        await dossierPage.goBack();
        await takeScreenshotByElement(libraryPage.getNavigationBar(), 'TC97774_02', 'library home toolbar');
    });

    it('[TC97774_03] run snapshot with color palette', async () => {
        const subscriptionName = 'TC97774_03';
        await libraryPage.openCustomAppById({ id: appIdWithPalette });
        await libraryPage.openDossier(testCityDashboard.name);
        await share.openSharePanel();
        await share.openSubscribeSettingsWindow();
        await subscriptionDialog.updateSubscriptionName(subscriptionName);
        await subscriptionDialog.selectFormat(subscriptionFormats.snapshot);
        await subscriptionDialog.selectSchedule(subscriptionSchedules.booksClosed);
        await subscriptionDialog.clickSendNowCheckbox();
        await subscriptionDialog.createSubscription();
        await subscribe.waitForSubscriptionCreated();
        await dossierPage.goToLibrary();
        await libraryPage.openDossierInfoWindow(testCityDashboard.name);
        await infoWindow.waitForSnapshotSection();
        await infoWindow.openSnapshotFromInfoWindow({});
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Bar' });
        await dossierPage.dismissSnapshotBanner();
        await dossierPage.sleep(2000); // wait for current page toast disappear
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
            'TC97774_03_01',
            'snapshot view with color palette'
        );
        await libraryPage.openDefaultApp();
        await libraryPage.openDossierInfoWindow(testCityDashboard.name);
        await infoWindow.waitForSnapshotSection();
        await infoWindow.openSnapshotFromInfoWindow({});
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Bar' });
        await dossierPage.dismissSnapshotBanner();
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
            'TC97774_03_02',
            'snapshot view without color palette'
        );
        await dossierPage.goToLibrary();
        await libraryPage.openDossierInfoWindow(testCityDashboard.name);
        await infoWindow.waitForSnapshotSection();
        await infoWindow.openSnapshotFromInfoWindow({});
        await dossierPage.clickOpenDashboardOnSnapshotBanner();
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Bar' });
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
            'TC97774_03_03',
            'open shortcut view under default app'
        );
    });

    it('[TC97774_04] run snapshot with custom theme', async () => {
        await createSnapshots({
            credentials: snapshotTestUser,
            dossiers: [testCityDashboard],
        });
        const snapshots = await getSnapshotsByTargetId({
            credentials: snapshotTestUser,
            targetId: testCityDashboard.id,
        });
        await libraryPage.openSnapshotById({
            appId: appIdRedTheme,
            projectId: snapshots[0].projectId,
            objectId: testCityDashboard.id,
            messageId: snapshots[0].messageId,
            useDefaultApp: false,
        });
        await takeScreenshotByElement(
            dossierPage.getSnapshotBannerContainer(),
            'TC97774_04_01',
            'snapshot view with red theme'
        );
        await dossierPage.goToLibrary();
        await libraryPage.openSnapshotById({
            appId: appIdDarkTheme,
            projectId: snapshots[0].projectId,
            objectId: testCityDashboard.id,
            messageId: snapshots[0].messageId,
            useDefaultApp: false,
        });
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Grid' });
        await takeScreenshotByElement(
            dossierPage.getSnapshotBannerContainer(),
            'TC97774_04_02',
            'snapshot view with dark theme'
        );
    });

    it('[TC97774_05] snapshot view in responsive mode', async () => {
        await createSnapshots({
            credentials: snapshotTestUser,
            dossiers: [testCityDashboard],
        });
        const snapshots = await getSnapshotsByTargetId({
            credentials: snapshotTestUser,
            targetId: testCityDashboard.id,
        });
        await setWindowSize(mobileWindow);
        await libraryPage.openSnapshotById({
            projectId: snapshots[0].projectId,
            objectId: testCityDashboard.id,
            messageId: snapshots[0].messageId,
        });
        await baseVisualization.hover({ elem: baseVisualization.getContainerByTitle('Visualization 1') });
        await takeScreenshotByElement(
            dossierPage.getSnapshotBannerContainer(),
            'TC97774_05_01',
            'snapshot view in responsive mode'
        );
        await libraryPage.openHamburgerMenu();
        await libraryPage.sleep(1000); // wait for hamburger menu animation finished
        await takeScreenshotByElement(
            libraryPage.hamburgerMenu.getSliderMenuContainer(),
            'TC97774_05_02',
            'Hamburger menu in snapshot view'
        );
    });

    // DE314701 - [Web Library][Snapshot] Blank page shows with 'usedInPushDownFilter' null property error when pin filter panel on snapshot and then open dashboard
    it('[TC97774_06] pin filter panel and open dashboard from snapshot banner', async () => {
        await createSnapshots({
            credentials: snapshotTestUser,
            dossiers: [testCityDashboard],
        });
        const snapshots = await getSnapshotsByTargetId({
            credentials: snapshotTestUser,
            targetId: testCityDashboard.id,
        });
        await libraryPage.openSnapshotById({
            appId: appIdPinFilter,
            projectId: snapshots[0].projectId,
            objectId: testCityDashboard.id,
            messageId: snapshots[0].messageId,
            useDefaultApp: false,
        });
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Grid' });
        await since('1. Filter panel is expected to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.getFilterPanel().isDisplayed())
            .toBe(true);
        await dossierPage.clickOpenDashboardOnSnapshotBanner();
        await since('2. Filter panel on shortcut is expected to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.getFilterPanel().isDisplayed())
            .toBe(true);
        await since('3. Grid of city should be #{expected}, instead it is #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toBe(4);
    });

    // DE328122 - [Library subscription] When create subscription under custom application just enable custom email and do not touch subscription subject fields, it will show email subject = content name rather than customized email subject
    it('[TC97774_07] display custom app subject in subscription when custom email is enabled', async () => {
        await libraryPage.openCustomAppById({ id: appIdEnableCustomEmail });
        await libraryPage.openDossier(testCityDashboard.name);
        await share.openSharePanel();
        await share.openSubscribeSettingsWindow();
        await since('1. Email subject in subscription panel is expected to be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.getEmailSubjectTextbox().getText())
            .toBe('Your Latest Updates on {&ContentName}');
        await since(
            '2. isReadyOnly of Email subject in subscription panel is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await subscriptionDialog.isAriaReadOnly(subscriptionDialog.getEmailSubjectTextbox()))
            .toBe(true);
        await subscriptionDialog.clickCloseButton();
    });
});
