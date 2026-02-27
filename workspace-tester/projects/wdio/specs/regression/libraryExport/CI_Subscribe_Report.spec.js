import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshot, takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import resetBookmarks from '../../../api/resetBookmarks.js';
describe('Automation for Subscription - Report Subscription in Library', () => {
    // Tanzu environemnt
    const dossier = {
        id: 'B19C0726492EA090968FE1A2464735EF',
        name: '(AUTO) Subscription',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial'
        }
    };
    
    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1600,
        height: 1200
    };


    let loginPage, dossierPage,libraryPage, subscriptionDialog, sidebar, userAccount, mockedSubscribeRequest, mockedEditSubscriptionRequest;

    beforeAll(async () => {
        ({
            loginPage,
            dossierPage,
            libraryPage,
            subscriptionDialog,
            sidebar,
            userAccount
        } = browsers.pageObj1);
        await setWindowSize(browserWindow);
        await loginPage.login({username: 'auto_subscription_report', password: 'newman1#'});
        await dossierPage.goToLibrary();
        // Open Subscriptions in sidebar
        await dossierPage.sleep(3000);
        //await libraryPage.clickLibraryIcon();
        await sidebar.openSubscriptions();
        await dossierPage.sleep(subscriptionDialog.DEFAULT_API_TIMEOUT);//wait for subscription api returned
    });

    it('[F42327_Reportpagebysubscription] Check GUI of report_Pageby subscription to Excel/CSV/PDF', async() => {
        // Pageby case
        await subscriptionDialog.hoverSubscription('AUTO_Report_Pageby_Subscription');
        await subscriptionDialog.clickEditButtonInSidebar('AUTO_Report_Pageby_Subscription');
        await takeScreenshotByElement(await subscriptionDialog.getContentSettingsSection(), 'F42327_06', 'Report_Pageby Excel Subscription', {tolerance: 0.3});
        await subscriptionDialog.clickExportReportTitle();
        await subscriptionDialog.clickExportFilterDetails();
        await subscriptionDialog.clickCustomizeHeaderFooter();
        await subscriptionDialog.inputCustomizeHeader('{&ExecutionDate}');
        await subscriptionDialog.inputCustomizeFooter('{&PageBy}');
        await subscriptionDialog.clickExpandAllPageByFields();// Need to wait pageby option load
        await subscriptionDialog.selectExcelExpandAllPageby('All Page-By on one worksheet');
        await subscriptionDialog.clickExportPageByInformation();
        await takeScreenshotByElement(await subscriptionDialog.getContentSettingsSection(), 'F42327_07', 'Report_Pageby Excel Subscription Check all Setting', {tolerance: 0.3});
        await subscriptionDialog.selectFormat('CSV');
        await takeScreenshotByElement(await subscriptionDialog.getContentSettingsSection(), 'F42327_08', 'Report_Pageby CSV Subscription', {tolerance: 0.3});
        await subscriptionDialog.selectFormat('PDF');
        await takeScreenshotByElement(await subscriptionDialog.getContentSettingsSection(), 'F42327_09', 'Report_Pageby PDF Subscription', {tolerance: 0.3});
        await subscriptionDialog.clickSidebarCancel();
        await libraryPage.sleep(2000);
    });

    it('[F42327_Reportsubscription] Check GUI of report subscription to Excel/CSV/PDF', async() => {
        // Normal Case
        await subscriptionDialog.hoverSubscription('AUTO_Subscription_Report');
        await subscriptionDialog.clickEditButtonInSidebar('AUTO_Subscription_Report');
        await takeScreenshotByElement(await subscriptionDialog.getContentSettingsSection(), 'F42327_01', 'Report Excel Subscription', {tolerance: 0.3});
        await subscriptionDialog.clickCustomizeHeaderFooter();
        await subscriptionDialog.inputCustomizeHeader('Test Header');
        await subscriptionDialog.inputCustomizeFooter('Test Footer');
        await takeScreenshotByElement(await subscriptionDialog.getContentSettingsSection(), 'F42327_02', 'Report Excel Subscription Header and Footer', {tolerance: 0.3});
        await subscriptionDialog.selectFormat('CSV');
        await takeScreenshotByElement(await subscriptionDialog.getContentSettingsSection(), 'F42327_03', 'Report CSV Subscription', {tolerance: 0.3});
        await subscriptionDialog.selectDataDelimiter('Other');
        await subscriptionDialog.inputDataDelimiter('%');
        await takeScreenshotByElement(await subscriptionDialog.getContentSettingsSection(), 'F42327_04', 'CSV Data Delimiter ', {tolerance: 0.3});
        await subscriptionDialog.selectFormat('PDF');
        await takeScreenshotByElement(await subscriptionDialog.getContentSettingsSection(), 'F42327_05', 'Report PDF Subscription', {tolerance: 0.3});
        await subscriptionDialog.clickSidebarCancel();
        await libraryPage.sleep(2000);
    });

    it('[F42327_ManipulationsubscriptiontoExcel] Modify report_Pageby subscription to Excel', async() => {
        // Manipulation
        await subscriptionDialog.hoverSubscription('AUTO_Manipulation_Subscription_Report');
        await subscriptionDialog.clickEditButtonInSidebar('AUTO_Manipulation_Subscription_Report');
        await takeScreenshotByElement(await subscriptionDialog.getContentSettingsSection(), 'F42327_10', 'Check the Initial Status', {tolerance: 0.3});// If fail, it means that the reset of the last test failed.
        await subscriptionDialog.clickExportReportTitle();
        await subscriptionDialog.clickExportFilterDetails();
        await subscriptionDialog.clickCustomizeHeaderFooter();
        await subscriptionDialog.inputCustomizeHeader('{&ExecutionDate}');
        await subscriptionDialog.inputCustomizeFooter('{&PageBy}');
        await subscriptionDialog.clickExpandAllPageByFields();// Need to wait pageby option load
        await subscriptionDialog.selectExcelExpandAllPageby('All Page-By on one worksheet');
        await subscriptionDialog.clickExportPageByInformation();
        await takeScreenshotByElement(await subscriptionDialog.getContentSettingsSection(), 'F42327_11', 'Modift Excel Setting', {tolerance: 0.3});
        await subscriptionDialog.clickSave();

        await subscriptionDialog.hoverSubscription('AUTO_Manipulation_Subscription_Report');
        await subscriptionDialog.clickEditButtonInSidebar('AUTO_Manipulation_Subscription_Report');
        await subscriptionDialog.clickExportReportTitle();
        await subscriptionDialog.clickExportFilterDetails();
        await subscriptionDialog.clickCustomizeHeaderFooter();
        await subscriptionDialog.selectExcelExpandAllPageby('Page-By on separate worksheets');
        await subscriptionDialog.clickExpandAllPageByFields();// Need to wait pageby option load
        await subscriptionDialog.clickExportPageByInformation();
        await takeScreenshotByElement(await subscriptionDialog.getContentSettingsSection(), 'F42327_12', 'Restore All Settings for Excel', {tolerance: 0.3});
        await subscriptionDialog.clickSave();
        await libraryPage.sleep(2000);
    });

    it('[F42327_ManipulationsubscriptiontoCSV] Modify report_Pageby subscription to CSV', async() => {
        // Manipulation
        await subscriptionDialog.hoverSubscription('AUTO_Manipulation_Subscription_Report');
        await subscriptionDialog.clickEditButtonInSidebar('AUTO_Manipulation_Subscription_Report');
        await subscriptionDialog.selectFormat('CSV');
        await subscriptionDialog.selectDataDelimiter('Other');
        await subscriptionDialog.inputDataDelimiter('%');
        await subscriptionDialog.clickExpandAllPageByFields();// Need to wait pageby option load
        await subscriptionDialog.clickExportPageByInformation();
        await takeScreenshotByElement(await subscriptionDialog.getContentSettingsSection(), 'F42327_13', 'Modift CSV Setting', {tolerance: 0.3});
        await subscriptionDialog.clickSave();

        await subscriptionDialog.hoverSubscription('AUTO_Manipulation_Subscription_Report');
        await subscriptionDialog.clickEditButtonInSidebar('AUTO_Manipulation_Subscription_Report');
        await subscriptionDialog.selectDataDelimiter('Comma');
        await subscriptionDialog.clickExpandAllPageByFields();// Need to wait pageby option load
        await subscriptionDialog.clickExportPageByInformation();
        await subscriptionDialog.selectFormat('Excel');
        await takeScreenshotByElement(await subscriptionDialog.getContentSettingsSection(), 'F42327_14', 'Restore All Settings for CSV', {tolerance: 0.3});
        await subscriptionDialog.clickSave();
        await libraryPage.sleep(2000);
    });

});