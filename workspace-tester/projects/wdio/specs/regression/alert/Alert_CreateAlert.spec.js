import resetBookmarks from '../../../api/resetBookmarks.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { browserWindow } from '../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import * as alert from '../../../constants/alert.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';
import * as consts from '../../../constants/customApp/info.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { mockAlertInList, mockSnapshotTimeStamp } from '../../../api/mock/mock-response-utils.js';
import createAlert from '../../../api/alert/createAlert.js';
import clearUserSnapshots from '../../../api/snapshot/clearUserSnapshots.js';
import getSnapshotsByTargetId from '../../../api/snapshot/getSnapshotsByTargetId.js';
import generateSharedLink from '../../../api/generateSharedLink.js';
import { mockApplicationSubscribeSnapshot } from '../../../api/mock/mock-application.js';

describe('Test create alert subscription', () => {
    let {
        loginPage,
        libraryPage,
        dossierPage,
        toc,
        subscribe,
        baseVisualization,
        infoWindow,
        sidebar,
        alertDialog,
        bookmark,
        conditionDialog,
        libraryFilter,
    } = browsers.pageObj1;

    let customAppIdDisableSubscribe,
        customAppIdLibraryHomeDisableSubscription,
        customAppIdOfDossierAsHome,
        customAppIdDisableSnapshot;

    const AlertPanelTitle = 'Subscribe Alert';
    const alertUserA = alert.alertUserA;
    // Array to track custom app IDs that need to be deleted
    const customAppsToDelete = [];

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        // Delete existing bookmark that to be created in next step
        await resetBookmarks({
            credentials: alertUserA,
            dossier: alert.dashboard_FinancialAnalysis,
        });
        await resetBookmarks({
            credentials: alertUserA,
            dossier: alert.dashboard_testAlertCreation,
        });
        await clearUserSnapshots({ credentials: [alertUserA] });
        await loginPage.login(alertUserA);
    });

    beforeEach(async () => {
        await libraryPage.executeScript('window.localStorage.clear();');
        await libraryPage.openDefaultApp();
    });

    afterAll(async () => {
        // Only call deleteCustomAppList if there are apps to delete
        if (customAppsToDelete.length > 0) {
            await deleteCustomAppList({
                credentials: consts.mstrUser.credentials,
                customAppIdList: customAppsToDelete,
            });
        }
        await clearUserSnapshots({ credentials: [alertUserA] });
        await logoutFromCurrentBrowser();
    });

    // Helper function to create custom app and track its ID
    async function createAndTrackCustomApp(config) {
        const appId = await createCustomApp(config);
        customAppsToDelete.push(appId);
        return appId;
    }

    it('[TC98547_01] Check alert entry from visualizations', async () => {
        await libraryPage.openDossier(alert.dashboard_testAlertEntry.name);
        await toc.openPageFromTocMenu({ chapterName: 'Viz', pageName: 'Empty Viz' });
        await since('1 For empty viz, the alert entry should be #{expected}, instead we have #{actual}')
            .expect(await baseVisualization.isAlertOnVisualizationMenuPresent('Empty Grid'))
            .toBe(false);
        await toc.openPageFromTocMenu({ chapterName: 'Viz', pageName: 'One Metric Viz' });
        await since('2 For one metric viz, the alert entry should be #{expected}, instead we have #{actual}')
            .expect(await baseVisualization.isAlertOnVisualizationMenuPresent('One Metric Bar'))
            .toBe(true);
        await toc.openPageFromTocMenu({ chapterName: 'Viz', pageName: 'One Attribute Viz' });
        await since('3 For one attribute viz, the alert entry should be #{expected}, instead we have #{actual}')
            .expect(await baseVisualization.isAlertOnVisualizationMenuPresent('One Attribute Heatmap'))
            .toBe(false);
        await toc.openPageFromTocMenu({ chapterName: 'Viz', pageName: 'Entire Viz' });
        await since(
            '4 For multi metrics and attributes viz, the alert entry should be #{expected}, instead we have #{actual}'
        )
            .expect(await baseVisualization.isAlertOnVisualizationMenuPresent('Sankey'))
            .toBe(true);
        await toc.openPageFromTocMenu({ chapterName: 'Special Case', pageName: 'Compound Grid' });
        await since(
            '5 For compound grid without metric, the alert entry should be #{expected}, instead we have #{actual}'
        )
            .expect(await baseVisualization.isAlertOnVisualizationMenuPresent('Grid 1'))
            .toBe(false);
        await since(
            '6 For compound grid with metric in any of sub grid, the alert entry should be #{expected}, instead we have #{actual}'
        )
            .expect(await baseVisualization.isAlertOnVisualizationMenuPresent('Grid 2'))
            .toBe(true);

        // Test the dashboard not in Library Home
        await libraryPage.openUrl(
            alert.dashboard_testAlertProjectLevel.project.id,
            alert.dashboard_testAlertProjectLevel.id
        );
        await since('5 For dashboard not in home, the alert entry should be #{expected}, instead we have #{actual}')
            .expect(await baseVisualization.isAlertOnVisualizationMenuPresent('Bubble'))
            .toBe(false);
    });

    it('[TC98547_02] Check alert entry for no privilege users', async () => {
        await libraryPage.switchUser(alert.alertNoCreateAlertPrivilege);
        await libraryPage.openDossier(alert.dashboard_testAlertEntry.name);
        await toc.openPageFromTocMenu({ chapterName: 'Viz', pageName: 'Viz Test' });
        await since(
            '1 When use a user without create alert privilege, the alert entry should be #{expected}, instead we have #{actual}'
        )
            .expect(await baseVisualization.isAlertOnVisualizationMenuPresent('Grid'))
            .toBe(false);
        await libraryPage.switchUser(alert.alertNoDistributionServicePrivilege);
        await libraryPage.openDossier(alert.dashboard_testAlertEntry.name);
        await toc.openPageFromTocMenu({ chapterName: 'Viz', pageName: 'Viz Test' });
        await since(
            '2 When use a user without distribution service privilege, the alert entry should be #{expected}, instead we have #{actual}'
        )
            .expect(await baseVisualization.isAlertOnVisualizationMenuPresent('Bubble'))
            .toBe(false);
        await libraryPage.switchUser(alert.alertNoSubscribeEmailPrivilege);
        await libraryPage.openDossier(alert.dashboard_testAlertEntry.name);
        await toc.openPageFromTocMenu({ chapterName: 'Viz', pageName: 'Viz Test' });
        await since(
            '3 When use a user without subscribe email privilege, the alert entry should be #{expected}, instead we have #{actual}'
        )
            .expect(await baseVisualization.isAlertOnVisualizationMenuPresent('Grid'))
            .toBe(false);

        // Project level privilege test
        await libraryPage.switchUser(alert.alertNoPrivilege);
        await libraryPage.openDossier(alert.dashboard_testAlertEntry.name);
        await toc.openPageFromTocMenu({ chapterName: 'Viz', pageName: 'Viz Test' });
        await since(
            '4 When use a user without all privileges in project MT, the alert entry should be #{expected}, instead we have #{actual}'
        )
            .expect(await baseVisualization.isAlertOnVisualizationMenuPresent('Grid'))
            .toBe(false);
        await dossierPage.goToLibrary();
        await libraryPage.openDossier(alert.dashboard_testAlertProjectLevel.name);
        await since(
            '5 When use a user has all privileges in project PA, the alert entry should be #{expected}, instead we have #{actual}'
        )
            .expect(await baseVisualization.isAlertOnVisualizationMenuPresent('Bubble'))
            .toBe(true);
    });

    it('[TC98547_03] Check alert entry in custom applications', async () => {
        await libraryPage.switchUser(alertUserA);
        //Create custom app to disable subscribe in share panel
        customAppIdDisableSubscribe = await createAndTrackCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.disableSubscribe,
        });
        // Create custom app to disable subscription in library home
        customAppIdLibraryHomeDisableSubscription = await createAndTrackCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.libraryHomeDisableSubscription,
        });
        // Create dashboard as home custom app to check alert entry
        customAppIdOfDossierAsHome = await createAndTrackCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.DossierAsHomeCustomAppObj,
        });

        await libraryPage.openCustomAppById({ id: customAppIdDisableSubscribe });
        await libraryPage.openDossier(alert.dashboard_testAlertEntry.name);
        await toc.openPageFromTocMenu({ chapterName: 'Viz', pageName: 'Viz Test' });
        await since(
            '1 When disbale subscribe in share panel, the alert entry should be #{expected}, instead we have #{actual}'
        )
            .expect(await baseVisualization.isAlertOnVisualizationMenuPresent('Grid'))
            .toBe(true);
        await dossierPage.goToLibrary();
        await libraryPage.openCustomAppById({ id: customAppIdLibraryHomeDisableSubscription });
        await libraryPage.openDossier(alert.dashboard_testAlertEntry.name);
        await toc.openPageFromTocMenu({ chapterName: 'Viz', pageName: 'Viz Test' });
        await since(
            '2 When disbale subscription in sidebar, the alert entry should be #{expected}, instead we have #{actual}'
        )
            .expect(await baseVisualization.isAlertOnVisualizationMenuPresent('Grid'))
            .toBe(false);
        await dossierPage.goToLibrary();
        await libraryPage.openCustomAppById({ id: customAppIdOfDossierAsHome });
        await since('3 In dashboard as home, the alert entry should be #{expected}, instead we have #{actual}')
            .expect(await baseVisualization.isAlertOnVisualizationMenuPresent('Visualization 1'))
            .toBe(false);
    });

    it('[TC98547_04] Check alert subscribe dialogue when creating alert', async () => {
        // Check alert panel default settings
        await libraryPage.openDossier(alert.dashboard_testAlertCreation.name);
        await toc.openPageFromTocMenu({ chapterName: 'GM', pageName: 'Page GM' });
        await baseVisualization.selectAlertOnVisualizationMenu('Visualization GM');
        await subscribe.inputName('Auto_Alert_testCreateAlertDialogue');
        await takeScreenshotByElement(alertDialog.getAlertPanel(), 'TC98547_04_01_Create_alert_dialogue_default');
        await since('1 The title of the alert subscribe dialogue should be #{expected}, instead we have #{actual}')
            .expect(await alertDialog.getAlertPanelTitle().getText())
            .toBe(AlertPanelTitle);
        await subscribe.inputBookmark('Auto_Bookmark_testCreateAlertDialogue');
        await since('2 The default value of range should be #{expected}, instead we have #{actual}.')
            .expect(await alertDialog.getDefaultRange().getText())
            .toBe('GM');
        // await alertDialog.selectRange('(All)');
        // await takeScreenshotByElement(alertDialog.getAlertPanel(), 'TC98547_04_02_UncheckAllRange');
        // await alertDialog.selectRange('KPI');
        await alertDialog.clickAddToSnapshotCheckbox();
        // await alertDialog.selectExcelContents('visualization');
        await alertDialog.clickShowFilterCheckbox();
        // await subscribe.selectSchedule('Books Closed');
        // await subscribe.inputNote('Auto_Note_testCreateAlertDialogue');
        await alertDialog.addRecipients([alert.alertUserB.username]);
        await subscribe.clickAllowUnsubscribe();
        await takeScreenshotByElement(alertDialog.getAlertPanel(), 'TC98547_04_03_Create_alert_dialogue_custom_excel');
        await subscribe.selectFormat('PDF');
        await takeScreenshotByElement(alertDialog.getAlertPanel(), 'TC98547_04_04_Create_alert_dialogue_custom_pdf');
        await subscribe.openPDFSettingsMenu();
        await since('3 The title of the alert subscribe sub dialogue should be #{expected}, instead we have #{actual}.')
            .expect(await alertDialog.getAlertPanelTitle().getText())
            .toBe(AlertPanelTitle);
        await subscribe.exitInfoWindowPDFSettingsMenu();
        await since('4 In format pulldown list, the snapshot should be #{expected}, instead we have #{actual}')
            .expect(await alertDialog.isSnapshotInFormatPresent())
            .toBe(false);
        await alertDialog.cancelCreateAlert();
    });

    it('[TC98547_05] Create Alert and check subscription list and info window', async () => {
        await libraryPage.openDossier(alert.dashboard_testAlertCreation.name);
        await toc.openPageFromTocMenu({ chapterName: 'GM', pageName: 'Page GM' });
        await baseVisualization.selectAlertOnVisualizationMenu('Visualization GM');
        await subscribe.inputName('Auto_Alert_checkSubscriptionListAndInfoWindow');
        await alertDialog.selectHighlightedMetric('Avg Delay (min)');
        await alertDialog.addCondition();
        await conditionDialog.addMetricCondition('Avg Delay (min)', ['Is Not Null']);
        await subscribe.selectSchedule('Books Closed');
        await alertDialog.clickAddToSnapshotCheckbox();
        await subscribe.toggleSendPreviewNow();
        await alertDialog.createAlert();
        //  Check alert in info window
        await libraryPage.clickLibraryIcon();
        await libraryPage.moveDossierIntoViewPort(alert.dashboard_testAlertCreation.name);
        await mockSnapshotTimeStamp({});
        await libraryPage.openDossierInfoWindow(alert.dashboard_testAlertCreation.name);
        await since(
            'After create alert and expand info window, the snapshot item tile should be #{expected}, instead we have #{actual}'
        )
            .expect(await infoWindow.getSnapshotTitleText({}))
            .toContain('Auto_Alert_checkSubscriptionListAndInfoWindow');
        await infoWindow.clickManageSubscriptionsButton();
        await takeScreenshotByElement(
            alertDialog.getSubscriptionDetailsInInfoWindow(),
            'TC98547_05_02_Check_info_window_alert_type'
        );
        await subscribe.clickInfoWindowEdit();
        await since('After edit snapshot in info window, alert panel should be #{expected}, instead we have #{actual}')
            .expect(await alertDialog.getAlertPanel().isDisplayed())
            .toBe(true);
        // comment out below test points because it resues the subscribe window in dashbaord
        // await takeScreenshotByElement(alertDialog.getAlertPanel(), 'TC98547_05_03_Check_Alert_Info_Window');
        // await alertDialog.clickConditionInfoIcon();
        // await takeScreenshotByElement(infoWindow.getInfoWindow(), 'TC98547_05_04_Check_Condition_Info_Icon');
        // await alertDialog.clickAddToSnapshotInfoIcon();
        // await takeScreenshotByElement(infoWindow.getInfoWindow(), 'TC98547_05_05_Check_AddToSnapshot_Info_Icon');
        await alertDialog.cancelAlert();
        // Check Alert in subscription list
        await libraryPage.clickLibraryIcon();
        await sidebar.openSubscriptions();
        await since(
            '5 In subscription list, the type of the alert created should be #{expected}, instead we have #{actual}'
        )
            .expect(await alertDialog.getSubscriptionTypeByName('Auto_Alert_checkSubscriptionListAndInfoWindow'))
            .toBe('Alert');
        await subscribe.hoverSubscription('Auto_Alert_checkSubscriptionListAndInfoWindow');
        await since(
            '4 The edit button of the alert created in Library should be #{expected}, instead we have #{actual}'
        )
            .expect(
                await subscribe.getEditButtonInSidebar('Auto_Alert_checkSubscriptionListAndInfoWindow').isDisplayed()
            )
            .toBe(true);
    });

    it('[TC98547_06] Manage alert in subscription list and filter', async () => {
        await libraryPage.switchUser(alert.alertUserC);
        await mockAlertInList('Test Alert Created in Web Report', alert.alertUserC.id, alert.alertUserC.username);
        await libraryPage.clickLibraryIcon();
        await sidebar.openSubscriptions();
        await since('1 The type of the alert created in Web should be #{expected}, instead we have #{actual}')
            .expect(await alertDialog.getSubscriptionTypeByName('Test Alert Created in Web Report'))
            .toBe('Alert');
        await since('2 The edit button of the alert created in Web should be #{expected}, instead we have #{actual}')
            .expect(await subscribe.getEditButtonInSidebar('Test Alert Created in Web Report').isDisplayed())
            .toBe(false);
        await libraryFilter.clickFilterIcon();
        await libraryFilter.openFilterDetailPanel('Type');
        await libraryFilter.checkFilterType('Alert');
        await libraryFilter.clickApplyButton();
        await since(
            '3 After apply filter, The type of the alert created in Web should be #{expected}, instead we have #{actual}'
        )
            .expect(await alertDialog.getSubscriptionTypeByName('Test Alert Created in Web Report'))
            .toBe('Alert');
        await since(
            '4 After apply filter, The edit button of the alert created in Web should be #{expected}, instead we have #{actual}'
        )
            .expect(await subscribe.getEditButtonInSidebar('Test Alert Created in Web Report').isDisplayed())
            .toBe(false);
    });

    it('[TC98547_07] Test add to snapshot entry in alert', async () => {
        // Test privilege for add to snapshot
        await libraryPage.switchUser(alert.alertNoWebSubscribeHistoryPrivilege);
        await libraryPage.openDossier(alert.dashboard_testAlertEntry.name);
        await toc.openPageFromTocMenu({ chapterName: 'Viz', pageName: 'Viz Test' });
        await baseVisualization.selectAlertOnVisualizationMenu('Grid');
        await since(
            '1 No Web Subscribe to History List privilege in project MT, add to snapshot should be #{expected}, instead we have #{actual}'
        )
            .expect(await alertDialog.isAddToSnapshotPresent())
            .toBe(false);
        await alertDialog.cancelCreateAlert();
        await dossierPage.goToLibrary();
        await libraryPage.openDossier(alert.dashboard_testAlertProjectLevel.name);
        await baseVisualization.selectAlertOnVisualizationMenu('Grid');
        await since(
            '2 With Web Subscribe to History List privilege in project PA, add to snapshot should be #{expected}, instead we have #{actual}'
        )
            .expect(await alertDialog.isAddToSnapshotPresent())
            .toBe(true);
        await alertDialog.cancelCreateAlert();
        // Test custom app for add to snapshot
        await libraryPage.switchUser(alertUserA);
        await mockApplicationSubscribeSnapshot({ snapshot: false });
        await browser.refresh();
        await libraryPage.openDossier(alert.dashboard_testAlertEntry.name);
        await toc.openPageFromTocMenu({ chapterName: 'Viz', pageName: 'Viz Test' });
        await baseVisualization.selectAlertOnVisualizationMenu('Grid');
        await since(
            '3 In custom app disable snapshot, add to snapshot should be #{expected}, instead we have #{actual}'
        )
            .expect(await alertDialog.isAddToSnapshotPresent())
            .toBe(false);
        await alertDialog.cancelCreateAlert();
    });

    it('[TC98547_08] Test add to snapshot function in alert', async () => {
        await createAlert({
            credentials: alertUserA,
            dossier: alert.dashboard_FinancialAnalysis,
            recipient: alertUserA,
        });
        await dossierPage.goToLibrary();
        await sidebar.openSubscriptions();
        await alertDialog.editSubscription('Alert_Created_By_API');
        await subscribe.inputName('Auto_Alert_testAddToSnapshot_AAA');
        await alertDialog.clickAddToSnapshotCheckbox();
        await subscribe.clickSidebarSave();
        await alertDialog.clickRunNowInSubscriptionListByName('Auto_Alert_testAddToSnapshot_AAA');
        await sidebar.clickAllSection();
        await libraryPage.moveDossierIntoViewPort(alert.dashboard_FinancialAnalysis.name);
        await mockSnapshotTimeStamp({});
        await libraryPage.openDossierInfoWindow(alert.dashboard_FinancialAnalysis.name);
        // await takeScreenshotByElement(infoWindow.getSnapshotSection(), 'TC98547_08_01_Check_Snapshot');
        await since('Snapshot should be shown in info window, instead we have #{actual}')
            .expect(await infoWindow.isSnapshotContentSectionPresent())
            .toBe(true);
    });

    it('[TC98547_09] Test deliver to in alert', async () => {
        await createAlert({
            credentials: alertUserA,
            dossier: alert.dashboard_FinancialAnalysis,
            recipient: alertUserA,
        });
        await dossierPage.goToLibrary();
        await sidebar.openSubscriptions();
        await alertDialog.editSubscription('Alert_Created_By_API');
        await subscribe.inputName('Auto_Alert_testDeliverTo');
        await alertDialog.addRecipients([
            alert.alertUserB.username,
            alert.alertUserC.username,
            alert.alertNoCreateAlertPrivilege.username,
            alert.alertNoDistributionServicePrivilege.username,
            alert.alertNoSubscribeEmailPrivilege.username,
            alert.alertNoWebSubscribeHistoryPrivilege.username,
        ]);
        await takeScreenshotByElement(
            subscribe.getSubscriptionSidebarEditDialog(),
            'TC98547_09_01_DeliverToInEditDialog'
        );
        await subscribe.clickSidebarSave();
        await sidebar.clickAllSection();
        await libraryPage.moveDossierIntoViewPort(alert.dashboard_FinancialAnalysis.name);
        await libraryPage.openDossierInfoWindow(alert.dashboard_FinancialAnalysis.name);
        // await infoWindow.clickManageSubscriptionsButton();
        // await subscribe.clickInfoWindowEdit();
        // await takeScreenshotByElement(infoWindow.getInfoWindow(), 'TC98547_09_02_DeliverToInInfoWindow');
        // await alertDialog.addRecipients([alert.alertNoPrivilege.username]);
        // await takeScreenshotByElement(infoWindow.getInfoWindow(), 'TC98547_09_03_EditDeliverToInInfoWindow');
    });

    it('[TC98547_10] verify snapshot view and bookmark view for alert', async () => {
        await createAlert({
            credentials: alertUserA,
            dossier: alert.dashboard_FinancialAnalysis,
            recipient: alertUserA,
        });
        await dossierPage.goToLibrary();
        const bookmarkURL = await generateSharedLink({
            credentials: alertUserA,
            dossier: alert.dashboard_FinancialAnalysis,
        });
        await browser.url(bookmarkURL);
        await dossierPage.waitForItemLoading();
        void since('Current BM label on navigation bar should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.labelInTitle())
            .toBe('alert');
        await dossierPage.goToLibrary();
        await sidebar.openSubscriptions();
        await alertDialog.editSubscription('Alert_Created_By_API');
        await subscribe.inputName('Auto_Alert_testSnapshotView');
        await alertDialog.clickAddToSnapshotCheckbox();
        await alertDialog.toggleSendPreviewNow();
        await subscribe.clickSidebarSave();
        await sidebar.clickAllSection();
        await libraryPage.moveDossierIntoViewPort(alert.dashboard_FinancialAnalysis.name);
        await libraryPage.openDossierInfoWindow(alert.dashboard_FinancialAnalysis.name);
        const snapshots = await getSnapshotsByTargetId({
            credentials: alertUserA,
            targetId: alert.dashboard_FinancialAnalysis.id,
        });
        await libraryPage.openSnapshotById({
            projectId: snapshots[0].projectId,
            objectId: alert.dashboard_FinancialAnalysis.id,
            messageId: snapshots[0].messageId,
        });
        await takeScreenshotByElement(dossierPage.getDossierView(), 'TC98547_10_01_snapshotView');
    });
});
