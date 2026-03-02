import resetBookmarks from '../../../api/resetBookmarks.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { browserWindow, mobileWindow } from '../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import * as alert from '../../../constants/alert.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { mockApplicationTheme } from '../../../api/mock/mock-application.js';
import createAlert from '../../../api/alert/createAlert.js';
import clearUserSnapshots from '../../../api/snapshot/clearUserSnapshots.js';

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
        libraryFilter,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        // Delete existing bookmark that to be created in next step
        await resetBookmarks({
            credentials: alert.alertUserA,
            dossier: alert.dashboard_FinancialAnalysis,
        });
        await resetBookmarks({
            credentials: alert.alertUserI18N,
            dossier: alert.dashboard_FinancialAnalysis,
        });
        await loginPage.login(alert.alertUserA);
    });

    beforeEach(async () => {
        await libraryPage.openDefaultApp();
    });

    afterEach(async () => {
        await sidebar.clickAllSection();
        await dossierPage.goToLibrary();
    });

    afterAll(async () => {
        await clearUserSnapshots({
            credentials: [alert.alertUserA],
        });
        await logoutFromCurrentBrowser();
    });

    it('[TC98552_01] Alert in color theme', async () => {
        await mockApplicationTheme({});
        await createAlert({
            credentials: alert.alertUserA,
            dossier: alert.dashboard_FinancialAnalysis,
            recipient: alert.alertUserA,
        });
        await libraryPage.reload();
        await libraryPage.openDossier(alert.dashboard_testAlertCreation.name);
        await toc.openPageFromTocMenu({ chapterName: 'GM', pageName: 'Page GM' });
        await baseVisualization.selectAlertOnVisualizationMenu('Visualization GM');
        await subscribe.inputName('Auto_Alert_testCreateAlertInColorTheme');
        await takeScreenshotByElement(
            alertDialog.getAlertPanel(),
            'TC98552_01_01_Create_alert_dialogue_in_color_theme'
        );
        await alertDialog.cancelCreateAlert();
        await libraryPage.clickLibraryIcon();
        // await libraryPage.moveDossierIntoViewPort(alert.dashboard_FinancialAnalysis.name);
        // await libraryPage.openDossierInfoWindow(alert.dashboard_FinancialAnalysis.name);
        // await infoWindow.clickManageSubscriptionsButton();
        // await subscribe.clickInfoWindowEdit();
        // await takeScreenshotByElement(
        //     infoWindow.getInfoWindow(),
        //     'TC98552_01_02_Check_Alert_Info_Window_in_color_theme'
        // );
        // await alertDialog.clickConditionInfoIcon();
        // await takeScreenshotByElement(
        //     infoWindow.getInfoWindow(),
        //     'TC98552_01_03_Check_Condition_tooltip_in_color_theme'
        // );
        // await alertDialog.clickAddToSnapshotInfoIcon();
        // await takeScreenshotByElement(
        //     infoWindow.getInfoWindow(),
        //     'TC98552_01_04_Check_AddToSnapshot_tooltip_in_color_theme'
        // );
        // await subscribe.closeSubscribe();
        // await dossierPage.goToLibrary();
        await libraryPage.openSidebarOnly();
        await sidebar.openSubscriptions();
        // await takeScreenshotByElement(
        //     libraryPage.getDossierListContainerHeight(),
        //     'TC98552_01_05_Subscription_List_in_color_theme'
        // );
        await alertDialog.editSubscription('Alert_Created_By_API');
        await subscribe.inputName('Auto_Alert_testEditAlertInColorTheme');
        await libraryPage.waitForElementVisible(await alertDialog.getConditionExpr());
        await takeScreenshotByElement(
            subscribe.getSubscriptionSidebarEditDialog(),
            'TC98552_01_06_Edit_alert_dialogue_in_color_theme'
        );
        await subscribe.clickSidebarSave();
    });

    it('[TC98552_02] Alert in responsive view', async () => {
        await createAlert({
            credentials: alert.alertUserA,
            dossier: alert.dashboard_FinancialAnalysis,
            recipient: alert.alertUserA,
        });
        await setWindowSize(mobileWindow);
        await libraryPage.openDossier(alert.dashboard_testAlertCreation.name);
        await toc.openPageFromTocMenu({ chapterName: 'GM', pageName: 'Page GM' });
        await baseVisualization.selectAlertOnVisualizationMenu('Visualization GM');
        await subscribe.inputName('Auto_Alert_testCreateAlertInResponsiveView');
        await takeScreenshotByElement(
            alertDialog.getAlertPanel(),
            'TC98552_02_01_Create_alert_dialogue_under_responsive_view'
        );
        await alertDialog.cancelCreateAlert();
        await libraryPage.clickLibraryIcon();
        await libraryPage.moveDossierIntoViewPort(alert.dashboard_FinancialAnalysis.name);
        await libraryPage.openDossierInfoWindow(alert.dashboard_FinancialAnalysis.name);
        await infoWindow.clickManageSubscriptionsButton();
        await subscribe.clickInWindowRunNow();
        await alertDialog.clickSubscriptionSwitcher();
        // comment it out since in info window it resues alert panel
        // await subscribe.clickInfoWindowEdit(false);
        // await takeScreenshotByElement(
        //     infoWindow.getInfoWindow(),
        //     'TC98552_02_02_Check_Alert_Info_Window_under_responsive_view'
        // );
        // await alertDialog.clickConditionInfoIcon();
        // await takeScreenshotByElement(
        //     infoWindow.getInfoWindow(),
        //     'TC98552_02_03_Check_Condition_tooltip_under_responsive_view'
        // );
        // await alertDialog.clickAddToSnapshotInfoIcon();
        // await takeScreenshotByElement(
        //     infoWindow.getInfoWindow(),
        //     'TC98552_02_04_Check_AddToSnapshot_tooltip_under_responsive_view'
        // );
        // await subscribe.closeSubscribe();
        await dossierPage.goToLibrary();
        await sidebar.openSubscriptions();
        await alertDialog.editSubscription('Alert_Created_By_API');
        await subscribe.inputName('Auto_Alert_testEditAlertInResponsiveView');
        await libraryPage.waitForElementVisible(await alertDialog.getConditionExpr());
        await takeScreenshotByElement(
            subscribe.getSubscriptionSidebarEditDialog(),
            'TC98552_02_05_Edit_alert_dialogue_under_responsive_view'
        );
        await subscribe.clickSidebarSave();
        await dossierPage.goToLibrary();
    });

    it('[TC98552_03] I18N case for alert', async () => {
        await setWindowSize(browserWindow);
        await createAlert({
            credentials: alert.alertUserI18N,
            dossier: alert.dashboard_FinancialAnalysis,
            recipient: alert.alertUserI18N,
        });
        await libraryPage.switchUser(alert.alertUserI18N);
        await dossierPage.goToLibrary();
        await libraryPage.openDossier(alert.dashboard_testAlertCreation.name);
        await toc.openPageFromTocMenu({ chapterName: 'Grid', pageName: 'Page Grid' });
        await baseVisualization.selectAlertOnVisualizationMenu('Visualization Grid', '警报');
        await subscribe.inputName('Auto_Alert_testCreateAlertI18N');
        await takeScreenshotByElement(alertDialog.getAlertPanel(), 'TC98552_03_01_Create_alert_dialogue_in_Chinese');
        await alertDialog.cancelCreateAlert();
        await baseVisualization.openVisualizationMenu({
            elem: baseVisualization.getVisualizationMenuButton('Visualization Grid'),
        });
        await baseVisualization.hover({ elem: baseVisualization.getContainerByTitle('Visualization Grid') });
        await takeScreenshotByElement(
            baseVisualization.getContextMenuByLevel(0),
            'TC98552_03_02_Check_alert_entry_in_Chinese'
        );
        await dossierPage.goToLibrary();
        // await libraryPage.moveDossierIntoViewPort(alert.dashboard_FinancialAnalysis.name);
        // await libraryPage.openDossierInfoWindow(alert.dashboard_FinancialAnalysis.name);
        // await infoWindow.clickManageSubscriptionsButton();
        // await takeScreenshotByElement(
        //     alertDialog.getSubscriptionDetailsInInfoWindow(),
        //     'TC98552_03_03_Check_info_window_alert_type_in_Chinese'
        // );
        // await subscribe.clickInfoWindowEdit();
        // await takeScreenshotByElement(infoWindow.getInfoWindow(), 'TC98552_03_04_Check_Alert_Info_Window_in_Chinese');
        // await alertDialog.clickConditionInfoIcon();
        // await takeScreenshotByElement(infoWindow.getInfoWindow(), 'TC98552_03_05_Check_Condition_tooltip_in_Chinese');
        // await alertDialog.clickAddToSnapshotInfoIcon();
        // await takeScreenshotByElement(
        //     infoWindow.getInfoWindow(),
        //     'TC98552_03_06_Check_AddToSnapshot_tooltip_in_Chinese'
        // );
        // await subscribe.closeSubscribe();
        await sidebar.clickPredefinedSection('订阅');
        await takeScreenshotByElement(
            libraryPage.getDossierListContainerHeight(),
            'TC98552_03_07_Subscription_List_in_Chinese'
        );
        await alertDialog.editSubscription('Alert_Created_By_API');
        await subscribe.inputName('Auto_Alert_testEditAlertI18N');
        await libraryPage.waitForElementVisible(await alertDialog.getConditionExpr());
        await takeScreenshotByElement(
            subscribe.getSubscriptionSidebarEditDialog(),
            'TC98552_03_08_Edit_alert_dialogue_in_Chinese'
        );
        await alertDialog.cancelAlert();
        await libraryFilter.clickFilterIcon();
        await libraryFilter.openFilterDetailPanel('类型');
        // // await subscribe.clickFiltersOption('警报');
        // await takeScreenshotByElement(
        //     alertDialog.getFilterPanelInSidebar(),
        //     'TC98552_03_09_Subscription_List_Filert_Alert'
        // );
        await subscribe.clickSubscriptionFilter();
    });
    // it('[TC98552_04] Error handling case for alert', async () => {});
});
