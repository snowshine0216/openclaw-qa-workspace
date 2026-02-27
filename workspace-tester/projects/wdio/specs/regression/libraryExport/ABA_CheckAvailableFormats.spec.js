import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { checkElementByImageComparison } from '../../../utils/TakeScreenshot.ts';
import resetBookmarks from '../../../api/resetBookmarks.js';

describe('Export - Check Available Export Formats for Dashboards', () => {
    
    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1600,
        height: 1200
    };

    const dossier_Auto_Format_0 = {
        id: '7ADBE87648632746103B9BB2AAB4DE00',
        name: 'Auto_Format_0',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial'
        }
    };

    const dossier_Auto_Format_AllowNone = {
        id: '3914C44A44A8F4D8DF6BE3A67C06A1CE',
        name: 'Auto_Format_AllowNone',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial'
        }
    };

    const dossier_Auto_Format_AllowPDFCSV = {
        id: 'C3119BA24DE301C62C420AA41CC5E7AA',
        name: 'Auto_Format_AllowPDFCSV',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial'
        }
    };

    const dossier_Auto_Format_AllowExcel = {
        id: '8A41814C40D12B3F02325F8920D0CDF7',
        name: 'Auto_Format_AllowExcel',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial'
        }
    };

    let subscriptionDialog, sidebar, baseVisualization, dossierPage, grid, infoWindow, libraryPage, pdfExportWindow, search, share, toc,checkboxFilter, filterPanel, userAccount, loginPage, showDataDialog, listView, listViewAGGrid, csvExportPanel, libraryAuthoringPage, dossierAuthoringPage;

    beforeAll(async () => {
        ({
            subscriptionDialog,
            sidebar,
            baseVisualization,
            dossierPage,
            grid,
            libraryPage,
            infoWindow,
            pdfExportWindow,
            search,
            toc,
            share,
            filterPanel,
            checkboxFilter,
            userAccount,
            loginPage,
            showDataDialog,
            listView,
            listViewAGGrid,
            csvExportPanel,
            libraryAuthoringPage,
            dossierAuthoringPage,
        } = browsers.pageObj1);
        await setWindowSize(browserWindow);
    });

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login({username: 'auto_format', password: 'newman1#'});
    });

    it('[F43008_1] Set Available Formats in Authoring', async () => {
        await libraryPage.openUrl(dossier_Auto_Format_0.project.id, dossier_Auto_Format_0.id);
        await libraryAuthoringPage.editDossierFromLibrary();
        await libraryAuthoringPage.openFileMenu();
        await libraryAuthoringPage.openDashboardPropertiesMenu();
        await libraryAuthoringPage.clickFormatCheckbox('Excel');
        await libraryAuthoringPage.clickFormatCheckbox('PDF');
        await libraryAuthoringPage.clickFormatCheckbox('CSV');
        await libraryAuthoringPage.clickOKButton();
        await dossierAuthoringPage.clickSaveDossierButton(dossier_Auto_Format_0.name);
        await dossierAuthoringPage.clickCloseDossierButton();
        await dossierPage.goToLibrary();
    });

    it('[F43008_2] Check Available Formats from Entry of Info Window', async () => {
        await libraryPage.moveDossierIntoViewPort(dossier_Auto_Format_0.name);
        await libraryPage.openDossierInfoWindow(dossier_Auto_Format_0.name);
        await libraryPage.sleep(2000);
        since('Export to PDF enabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.isExportPDFEnabled()).toBe(false);
        since('Export to Excel enabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.isExportExcelButtonPresent()).toBe(false);
        since('Export to CSV enabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.isExportCSVEnabled()).toBe(false);
        await infoWindow.close();

        await libraryPage.moveDossierIntoViewPort(dossier_Auto_Format_AllowPDFCSV.name);
        await libraryPage.openDossierInfoWindow(dossier_Auto_Format_AllowPDFCSV.name);
        await libraryPage.sleep(2000);
        since('Export to PDF enabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.isExportPDFEnabled()).toBe(true);
        since('Export to Excel enabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.isExportExcelButtonPresent()).toBe(false);
        since('Export to CSV enabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.isExportCSVEnabled()).toBe(true);
        await infoWindow.close();
    });

    it('[F43008_3] Check Available Formats from Entries inside Dashboard for dossier_Auto_Format_AllowExcel', async () => {
        //Open a Dossier
        await libraryPage.openDossier(dossier_Auto_Format_AllowExcel.name);
        await dossierPage.waitForDossierLoading();

        //Check available formats from share panel
        await dossierPage.openShareDropDown();
        since('The PDF Export icon is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.isExporttoPDFPresent()).toBe(false);
        since('The Excel Export icon is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.isExporttoExcelPresent()).toBe(true);
        since('The CSV Export icon is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await pdfExportWindow.isExporttoCSVPresent()).toBe(false);
        await share.closeSharePanel();

        //Check available formats from entry single visualization
        await baseVisualization.selectExportOnVisualizationMenu('grid');
        since('The Excel export button is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await baseVisualization.isVisualizationExportTypePresent('Excel')).toBe(true);
        since('The PDF export button is supposed to be #{expected}, instead we have #{actual}.')
           .expect(await baseVisualization.isVisualizationExportTypePresent('PDF')).toBe(false);
        since('The Data export button is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await baseVisualization.isVisualizationExportTypePresent('Data')).toBe(false);

        //Check available formats from entry Show Data
        await baseVisualization.selectShowDataOnVisualizationMenu('grid');
        await baseVisualization.showDataDialog.clickShowDataExportButton();
        since('The Excel export button is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await baseVisualization.showDataDialog.isShowDataExportTypePresent('Excel')).toBe(true);
        since('The PDF export button is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await baseVisualization.showDataDialog.isShowDataExportTypePresent('PDF')).toBe(false);
        since('The Data export button is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await baseVisualization.showDataDialog.isShowDataExportTypePresent('Data')).toBe(false);
        await baseVisualization.showDataDialog.clickShowDataCloseButton();

        await dossierPage.goToLibrary();

    });

    it('[F43008_4] Check Available Formats from Entry of Context Menu in List View', async () => {
        await listView.selectListViewMode();
        await listViewAGGrid.moveDossierIntoViewPortAGGrid(dossier_Auto_Format_AllowPDFCSV.name);
        await listViewAGGrid.clickContextMenuIconInGrid(dossier_Auto_Format_AllowPDFCSV.name);
        await listViewAGGrid.hoverOnContextMenuShareItem();
        await listView.sleep(1000);
        since('The PDF Export icon is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await listViewAGGrid.isExporttoPDFPresent()).toBe(true);
        since('The Excel Export icon is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await listViewAGGrid.isExporttoExcelPresent()).toBe(false);
        since('The CSV Export icon is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await listViewAGGrid.isExporttoCSVPresent()).toBe(true);

        await listViewAGGrid.moveDossierIntoViewPortAGGrid(dossier_Auto_Format_AllowExcel.name);
        await listViewAGGrid.clickContextMenuIconInGrid(dossier_Auto_Format_AllowExcel.name);
        await listViewAGGrid.hoverOnContextMenuShareItem();
        await listView.sleep(1000);
        since('The PDF Export icon is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await listViewAGGrid.isExporttoPDFPresent()).toBe(false);
        since('The Excel Export icon is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await listViewAGGrid.isExporttoExcelPresent()).toBe(true);
        since('The CSV Export icon is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await listViewAGGrid.isExporttoCSVPresent()).toBe(false);
    });

    it('[F43008_5] Check available formats for subscription when creating from share panel', async() => {
        await resetBookmarks({
            credentials: {username: 'auto_format', password: 'newman1#'},
            dossier: dossier_Auto_Format_AllowPDFCSV
        });
        await listView.deselectListViewMode();
        await libraryPage.clickLibraryIcon();
        await sidebar.openAllSectionList();
        await libraryPage.moveDossierIntoViewPort(dossier_Auto_Format_AllowPDFCSV.name);
        await libraryPage.openDossier(dossier_Auto_Format_AllowPDFCSV.name);
        await dossierPage.openShareDropDown();
        await dossierPage.sleep(1000);
        await share.openSubscribeSettingsWindow();
        await dossierPage.sleep(1000);
        await subscriptionDialog.clickSubscriptionNameEditButton();
        await dossierPage.sleep(1000);
        await browser.keys(['Control', 'a']);
        await browser.keys('Backspace');   
        await subscriptionDialog.inputSubscriptionName('Auto_Subscription_CheckFormat');
        await dossierPage.sleep(1000);
        await checkElementByImageComparison(
            subscriptionDialog.getDialogPanel(),
            'T4969/subscription',
            'F43008_5-Default settings in share panel',
            3
        );
        await subscriptionDialog.clickFormatDropdown();
        await dossierPage.sleep(1000);
        await checkElementByImageComparison(
            subscriptionDialog.getFormatOptionDropdown(),
            'T4969/subscription',
            'F43008_5-Available formats in share panel',
            3
        );
        await subscriptionDialog.clickFormatDropdown();
        await subscriptionDialog.OpenScheduleOptions();
        await subscriptionDialog.clickEventScheduleOptions(['Books Closed']);
        await subscriptionDialog.clickSendNowCheckbox();
        await subscriptionDialog.createSubscription();
        await dossierPage.sleep(1000);
        await subscriptionDialog.waitForLoadingButtonToDisappear();  
        await dossierPage.goToLibrary();
    });

    it('[F43008_6] Check available formats for subscription when editing in info window an sidebar', async() => {
        await libraryPage.moveDossierIntoViewPort(dossier_Auto_Format_AllowPDFCSV.name);
        await libraryPage.openDossierInfoWindow(dossier_Auto_Format_AllowPDFCSV.name);
        await infoWindow.clickManageSubscriptionsButton();
        await infoWindow.sleep(1000);
        await checkElementByImageComparison(
            subscriptionDialog.getInfoWindowSubscriptionPanel(),
            'T4969/subscription',
            'F43008_6-Default view of manage subscription in info window',
            3
        );
        await subscriptionDialog.clickInfoWindowEdit();
        await infoWindow.sleep(3000);
        await subscriptionDialog.selectFormat('CSV');
        await checkElementByImageComparison(
            subscriptionDialog.getDialogPanel(),
            'T4969/subscription',
            'F43008_6-Update format in info window',
            3
        );
        await subscriptionDialog.clickSave();
        await infoWindow.sleep(1000);
        await subscriptionDialog.closeSubscribe();
        await dossierPage.sleep(2000);
        await sidebar.openSubscriptions();
        await dossierPage.sleep(subscriptionDialog.DEFAULT_API_TIMEOUT);//wait for subscription api returned
        await subscriptionDialog.hoverSubscription('Auto_Subscription_CheckFormat');
        await subscriptionDialog.clickEditButtonInSidebar('Auto_Subscription_CheckFormat');
        await checkElementByImageComparison(
            subscriptionDialog.getDialogPanel(),
            'T4969/subscription',
            'F43008_6-Check updated format in sidebar',
            3
        );
        await subscriptionDialog.clickFormatDropdown();
        await dossierPage.sleep(1000);
        await checkElementByImageComparison(
            subscriptionDialog.getFormatOptionDropdown(),
            'T4969/subscription',
            'F43008_6-Check available formats in sidebar',
            3
        );
        await subscriptionDialog.clickFormatDropdown();
        await subscriptionDialog.clickSave();
        await dossierPage.sleep(1000);
        await subscriptionDialog.clickSidebarUnsubscribe('Auto_Subscription_CheckFormat');
        await dossierPage.sleep(2000);
        await subscriptionDialog.clickUnsubscribeYes();
        await dossierPage.sleep(1000);
    });

});