import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import setWindowSize from '../../../config/setWindowSize.js';
import * as bot from '../../../constants/bot2.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';

describe('ADC XFunc', () => {
    const customApp_disableData = {
        name: 'Bot2.0_disableData',
        id: '832C95A9022F41D099FBF47012DBB965',
    };
    const customApp_disableDataFavorite = {
        name: 'Bot2.0_disableDataFavorite',
        id: '27002695828E4C66AC3BD930FE9C108A',
    };
    const customApp_disableNewADC = {
        name: 'Bot2.0_disableNewADC',
        id: '6234FC9034B441D49525D56C55297E97',
    };
    const customApp_darkTheme = {
        name: 'Bot2.0_DarkTheme',
        id: 'B919B1FB267E4082B738B04C16004CC8',
    };
    const xfunc_adc = {
        name: 'AUTO_ADC_XFunc',
        id: '07EF81232C4922E08BEFF1B82B4425EE',
        projectId: bot.project_applicationTeam.id,
    };

    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    const mobileView = {
        width: 550,
        height: 800,
    };

    let {
        libraryPage,
        infoWindow,
        manageAccess,
        sidebar,
        loginPage,
        listView,
        libraryAuthoringPage,
        adc,
        dossierAuthoringPage,
        libraryFilter,
    } = browsers.pageObj1;

    beforeAll(async () => {});

    beforeEach(async () => {
        await libraryPage.resetToLibraryHome();
        await setWindowSize(browserWindow);
        await loginPage.login(bot.xfuncUser);
        await libraryPage.openDefaultApp();

        // open home page
        await libraryPage.openSidebarOnly();
        await sidebar.openAllSectionList();
    });

    afterEach(async () => {
        await logoutFromCurrentBrowser();
    });

    afterAll(async () => {});

    it('[TC70001_01] CustomApp - Sanity ADC application settings', async () => {
        // disable new ADC
        await libraryPage.openCustomAppById({ id: customApp_disableNewADC.id });
        await libraryPage.openSidebarOnly();
        await since('Disable new ADC, sidebar data section present should be #{expected}, while we get #{actual}')
            .expect(await sidebar.isDataSectionPresent())
            .toBe(true);
        await libraryAuthoringPage.clickNewDossierIcon();
        await since('Disable new ADC, the create ADC option present should be #{expected}, instead we have #{actual}')
            .expect(await libraryAuthoringPage.isCreateADCOptionPresent())
            .toBe(false);

        // disable data
        await libraryPage.openCustomAppById({ id: customApp_disableData.id });
        await libraryPage.openSidebarOnly();
        await since('Disable data, sidebar data section present should be #{expected}, while we get #{actual}')
            .expect(await sidebar.isDataSectionPresent())
            .toBe(false);
        await libraryAuthoringPage.clickNewDossierIcon();
        await since('Disable data, the create ADC option present should be #{expected}, instead we have #{actual}')
            .expect(await libraryAuthoringPage.isCreateADCOptionPresent())
            .toBe(true);

        // disable data favorite
        await libraryPage.openCustomAppById({ id: customApp_disableDataFavorite.id });
        await libraryPage.openSidebarOnly();
        await since('Disable data favorites, data section present should be #{expected}, while we get #{actual}')
            .expect(await sidebar.isDataSectionPresent())
            .toBe(true);
        await sidebar.openDataSection();
        //// filter ADC
        await libraryPage.clickFilterIcon();
        await libraryFilter.openFilterDetailPanel('Owner');
        await libraryFilter.selectFilterDetailsPanelItem('Owned by me');
        await libraryFilter.clickApplyButton();
        //// check application setting
        await libraryPage.openDossierInfoWindow(xfunc_adc.name);
        await since(
            'Disable data favorites, info window favorites present should be #{expected}, while we get #{actual}'
        )
            .expect(await infoWindow.isFavoritesBtnPresent())
            .toBe(false);
        await infoWindow.close();
        await libraryPage.openDossierContextMenu(xfunc_adc.name);
        await since(
            'Disable data favorites, context menu favorites present should be #{expected}, while we get #{actual}'
        )
            .expect(await libraryPage.isItemDisplayedInContextMenu('Favorite'))
            .toBe(false);
    });

    it('[TC70001_02] ColorTheme - Sanity color theme on ADC', async () => {
        await libraryPage.openCustomAppById({ id: customApp_darkTheme.id });
        await libraryPage.openSidebarOnly();
        await sidebar.openDataSection();

        //filter ADC
        await libraryPage.clickFilterIcon();
        await libraryFilter.openFilterDetailPanel('Owner');
        await libraryFilter.selectFilterDetailsPanelItem('Owned by me');
        await libraryFilter.clickApplyButton();

        // context menu
        await libraryPage.openDossierContextMenu(xfunc_adc.name);
        await takeScreenshotByElement(libraryPage.getDossierContextMenu(), 'TC70001_02', 'contextMenu');
        await libraryPage.clickDossierContextMenuItem('Get Info');

        // info-window
        await takeScreenshotByElement(infoWindow.getActionIcons(), 'TC70001_02', 'infoWindow');
        await infoWindow.openManageAccessDialog();
        await manageAccess.waitForManageAccessLoading();
        await takeScreenshotByElement(manageAccess.getManageAccessDialog(), 'TC70001_02', 'manageAccess');
        await manageAccess.closeDialog();
        await infoWindow.close();
    });

    it('[TC70001_03] Responsive - Sanity mobile view for ADC', async () => {
        // set mobile view
        await setWindowSize(mobileView);
        await libraryPage.openSidebarOnly();
        await sidebar.openDataSection();

        // list view
        await listView.selectListViewModeMobile();
        //// -- info window
        await listView.openInfoWindowFromMobileView(xfunc_adc.name);
        await since('Mobile view, info-window open status supposed to be #{expected}, instead we have #{actual}.')
            .expect(await listView.isMobileInfoWindowOpened())
            .toBe(true);
        await since('Mobile view, Edit present supposed to be #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.isItemDisplayedInContextMenu('Edit'))
            .toBe(false);
        await takeScreenshotByElement(listView.getItemShare(), 'TC70001_03', 'MobileView_InfoWindow_listView', {
            tolerance: 1.5,
        });
        await listView.clickCloseIcon();

        // grid view
        await listView.deselectListViewModeMobile();
        //// -- context menu
        await libraryPage.openDossierContextMenu(xfunc_adc.name);
        await since('Mobile view,context menu option count should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.getMenuContextItemCount())
            .toBe(11);
        await since('Mobile view, Edit present supposed to be #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.isItemDisplayedInContextMenu('Edit'))
            .toBe(false);
        await takeScreenshotByElement(libraryPage.getDossierContextMenu(), 'TC70001_03', 'MobileView_ContextMenu');
        //// -- info window
        await libraryPage.clickDossierContextMenuItem('Get Info');
        await since('Mobile view, action icon count supposed to be #{expected}, instead we have #{actual}.')
            .expect(await infoWindow.getActionButtonsCount())
            .toBe(2);
        await since('Mobile view, create bot present should be #{expected}, while we get #{actual}')
            .expect(await infoWindow.isCreateDashboardPresent())
            .toBe(false);
        await takeScreenshotByElement(infoWindow.getActionIcons(), 'TC70001_03', 'MobileView_InfoWindow');
        await infoWindow.close();

        // open ADC
        await libraryPage.openDossierById({
            projectId: xfunc_adc.projectId,
            dossierId: xfunc_adc.id,
        });
        await since('Open ADC, error dialogue popup should be #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.isErrorPresent())
            .toBe(true);
        await since('Open ADC, error dialogue popup should be #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.errorMsg())
            .toContain('AI Data Collection is only available in edit mode');

        // dismiss error
        await libraryPage.dismissError();
    });

    it('[TC70001_04] I18N - Sanity I18N for ADC', async () => {
        // switch to chinese user
        await libraryPage.openUserAccountMenu();
        await libraryPage.logout();
        await loginPage.login(bot.i18nUser);
        await libraryPage.openSidebarOnly();
        await sidebar.openDataSection('数据');

        // -- context menu
        await libraryPage.openDossierContextMenu(xfunc_adc.name);
        await since('Chinese,context menu option count should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.getMenuContextItemCount())
            .toBe(13);
        await takeScreenshotByElement(libraryPage.getDossierContextMenu(), 'TC70001_04', 'I18N_ContextMenu');

        // open ADC
        await libraryPage.openDossier(xfunc_adc.name);
        await takeScreenshotByElement(dossierAuthoringPage.getDatasetPanelMenuBtn(), 'TC70001_04', 'I18N_ADCToolbar');
        await adc.cancel();

        // create entry
        await libraryAuthoringPage.clickNewDossierIcon();
        await takeScreenshotByElement(
            libraryAuthoringPage.getCreateNewPanelContent(),
            'TC70001_04',
            'I18N_CreatePanel'
        );
    });
});
