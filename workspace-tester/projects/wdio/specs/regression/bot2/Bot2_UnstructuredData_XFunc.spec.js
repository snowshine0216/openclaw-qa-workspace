import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import setWindowSize from '../../../config/setWindowSize.js';
import * as bot from '../../../constants/bot2.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';

describe('Bot 2.0 Unstructured Data XFunc', () => {
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
    const xfunc_unstructured = {
        name: 'AUTO_EML',
        id: 'BA5DBB4B69604A56BBCD7F86CDAA0545',
        projectId: bot.project_applicationTeam.id,
    };

    const xfunc_acl_noRead = {
        name: 'AUTO_DOCX',
        id: '20ABD16964DC400393F526C4AD5A3F69',
        projectId: bot.project_applicationTeam.id,
    };

    const xfunc_acl_noWrite = {
        name: 'AUTO_MD',
        id: '025BEBCFA31F4AC19811043642245633',
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
        await loginPage.login(bot.unstructuredDataUser);
        await libraryPage.openDefaultApp();

        // open home page
        await libraryPage.openSidebarOnly();
        await sidebar.openDataSection();
    });

    afterEach(async () => {
        await logoutFromCurrentBrowser();
    });

    afterAll(async () => {});

    async function filterByOwnByMe() {
        await libraryPage.clickFilterIcon();
        await libraryFilter.openFilterDetailPanel('Owner');
        await libraryFilter.selectFilterDetailsPanelItem('Owned by me');
        await libraryFilter.clickApplyButton();
    }
    async function filterByProject() {
        await libraryPage.clickFilterIcon();
        await libraryFilter.openFilterDetailPanel('Project');
        await libraryFilter.selectFilterDetailsPanelItem(bot.project_applicationTeam.name);
        await libraryFilter.clickApplyButton();
    }

    async function filterByType() {
        await libraryPage.clickFilterIcon();
        await libraryFilter.openFilterDetailPanel('Type');
        await libraryFilter.selectFilterDetailsPanelItem('Unstructured Data');
        await libraryFilter.clickApplyButton();
    }

    it('[TC99030_14] Unstructured -  Sanity custom application settings', async () => {
        // disable data favorite
        await libraryPage.openCustomAppById({ id: customApp_disableDataFavorite.id });
        await libraryPage.openSidebarOnly();
        await since('Disable data favorites, data section present should be #{expected}, while we get #{actual}')
            .expect(await sidebar.isDataSectionPresent())
            .toBe(true);
        await sidebar.openDataSection();
        //// filter unstructured data
        await filterByOwnByMe();
        //// check application setting
        await libraryPage.openDossierInfoWindow(xfunc_unstructured.name);
        await since('Disable data favorites and favorites present should be #{expected}, while we get #{actual}')
            .expect(await infoWindow.isFavoritesBtnPresent())
            .toBe(false);
        await since('Disable data favorites and create ADC present should be #{expected}, while we get #{actual}')
            .expect(await infoWindow.isCreateADCButtonDisplayed())
            .toBe(true);
        await infoWindow.close();

        // disable create ADC
        await libraryPage.openCustomAppById({ id: customApp_disableNewADC.id });
        await libraryPage.openSidebarOnly();
        await sidebar.openDataSection();
        //// filter unstructured data
        await filterByOwnByMe();
        //// check application setting
        await libraryPage.openDossierInfoWindow(xfunc_unstructured.name);
        await since('Disable new ADC and favorites present should be #{expected}, while we get #{actual}')
            .expect(await infoWindow.isFavoritesBtnPresent())
            .toBe(true);
        await since('Disable new ADC and create ADC present should be #{expected}, while we get #{actual}')
            .expect(await infoWindow.isCreateADCButtonDisplayed())
            .toBe(false);
        await infoWindow.close();
        await libraryPage.openDossierContextMenu(xfunc_unstructured.name);
        await since('Disable new ADC and create ADC present should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.isItemDisplayedInContextMenu('Create AI Data Collection'))
            .toBe(false);
    });

    it('[TC99030_15] Unstructured -  Sanity color theme on unstructured data', async () => {
        await libraryPage.openCustomAppById({ id: customApp_darkTheme.id });
        await libraryPage.openSidebarOnly();
        await sidebar.openDataSection();

        //filter data
        await filterByOwnByMe();

        // context menu
        await libraryPage.openDossierContextMenu(xfunc_unstructured.name);
        await takeScreenshotByElement(libraryPage.getDossierContextMenu(), 'TC99030_02', 'contextMenu');
        await libraryPage.clickDossierContextMenuItem('Get Info');

        // info-window
        await takeScreenshotByElement(infoWindow.getMainInfoTop(), 'TC99030_02', 'infoWindow_top');
        await takeScreenshotByElement(infoWindow.getTagsContainer(), 'TC99030_02', 'infoWindow_tags');
        await infoWindow.close();
    });

    it('[TC99030_16] Unstructured -  Sanity responsive mobile view for unstructured data', async () => {
        // set mobile view
        await libraryPage.openSidebarOnly();
        await sidebar.openDataSection();
        await libraryPage.closeSidebar();
        await filterByOwnByMe();
        await filterByProject();
        await setWindowSize(mobileView);

        // list view
        await listView.selectListViewModeMobile();
        //// -- info window
        await listView.openInfoWindowFromMobileView(xfunc_unstructured.name);
        await since('Mobile view, info-window open status supposed to be #{expected}, instead we have #{actual}.')
            .expect(await listView.isMobileInfoWindowOpened())
            .toBe(true);
        await since('Mobile view, Edit present supposed to be #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.isItemDisplayedInContextMenu('Create AI Data Collection'))
            .toBe(false);
        await takeScreenshotByElement(listView.getItemShare(), 'TC99030_16', 'MobileView_InfoWindow_listView', {
            tolerance: 1.5,
        });
        await listView.clickCloseIcon();

        // grid view
        await listView.deselectListViewModeMobile();
        //// -- context menu
        await libraryPage.openDossierContextMenu(xfunc_unstructured.name);
        await since('context menu option count should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.getMenuContextItemCount())
            .toBe(12);
        await since('Create AI Data Collection present supposed to be #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.isItemDisplayedInContextMenu('Create AI Data Collection'))
            .toBe(false);
        await takeScreenshotByElement(libraryPage.getDossierContextMenu(), 'TC99030_16', 'MobileView_ContextMenu');
        //// -- info window
        await libraryPage.clickDossierContextMenuItem('Get Info');
        await since('action icon count supposed to be #{expected}, instead we have #{actual}.')
            .expect(await infoWindow.getActionButtonsCount())
            .toBe(4);
        await since('create ADC present should be #{expected}, while we get #{actual}')
            .expect(await infoWindow.isCreateADCButtonDisplayed())
            .toBe(false);
        await takeScreenshotByElement(infoWindow.getActionIcons(), 'TC99030_16', 'MobileView_InfoWindow');
        await infoWindow.close();
    });

    it('[TC99030_17] Unstructured -  Sanity I18N for unstructured data', async () => {
        // switch to chinese user
        await libraryPage.openUserAccountMenu();
        await libraryPage.logout();
        await loginPage.login(bot.i18nUser);
        await libraryPage.openSidebarOnly();
        await sidebar.openDataSection('数据');

        // -- context menu
        await libraryPage.openDossierContextMenu(xfunc_unstructured.name);
        await since('Chinese,context menu option count should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.getMenuContextItemCount())
            .toBe(13);
        await takeScreenshotByElement(libraryPage.getDossierContextMenu(), 'TC99030_04', 'I18N_ContextMenu');
        // -- info window
        await libraryPage.clickDossierContextMenuItem('获取信息');
        await since('Tags present should be #{expected}, while we get #{actual}')
            .expect(await infoWindow.isTagsDisplayed())
            .toBe(true);
        await takeScreenshotByElement(infoWindow.getTagsContainer(), 'TC99030_17', 'MobileView_InfoWindow');
        await infoWindow.close();
    });

    it('[TC99030_18] Unstructured -  Privilege to unstructured data', async () => {
        // no configure unstructured data privilege
        await libraryPage.openUserAccountMenu();
        await libraryPage.logout();
        await loginPage.login(bot.unstructuredDataNoPrivilegeUser);
        await libraryPage.openSidebarOnly();
        await sidebar.openDataSection();
        await filterByType();

        await libraryPage.openDossierContextMenu(xfunc_unstructured.name);
        await since('No config unstructured privilege,menu option count should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.getMenuContextItemCount())
            .toBe(12);
        await since('No config unstructured privilege, replace present should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.isItemDisplayedInContextMenu('Replace'))
            .toBe(false);
        await libraryPage.clickDossierContextMenuItem('Get Info');
        await since('No config unstructured privilege,action icon count should be #{expected}, while we get #{actual}')
            .expect(await infoWindow.getActionButtonsCount())
            .toBe(4);
        await since('No config unstructured privilege, tags present should be #{expected}, while we get #{actual}')
            .expect(await infoWindow.isTagsDisplayed())
            .toBe(false);
        await infoWindow.close();

        // no create and edit AI privilege
        await libraryPage.openUserAccountMenu();
        await libraryPage.logout();
        await loginPage.login(bot.botNoEditPrivUser);
        await libraryPage.openSidebarOnly();
        await sidebar.openDataSection();

        await libraryPage.openDossierContextMenu(xfunc_unstructured.name);
        await since('No create bot privilege, context menu option count should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.getMenuContextItemCount())
            .toBe(11);
        await since(
            'No create bot privilege, configure unstructured data present should be #{expected}, while we get #{actual}'
        )
            .expect(await libraryPage.isItemDisplayedInContextMenu('Create AI Data Collection'))
            .toBe(false);
        await libraryPage.clickDossierContextMenuItem('Get Info');
        await since('No create bot privilege, action icon count should be #{expected}, while we get #{actual}')
            .expect(await infoWindow.getActionButtonsCount())
            .toBe(3);
        await infoWindow.close();
    });

    it('[TC99030_19] Unstructured -  ACL to unstructured data', async () => {
        await libraryPage.openUserAccountMenu();
        await libraryPage.logout();
        await loginPage.login(bot.aclUser_ds);
        await libraryPage.openSidebarOnly();
        await sidebar.openDataSection();
        await filterByType();

        // no read ACL
        await libraryPage.openDossierContextMenu(xfunc_acl_noRead.name);
        await since('no Read ACL and context menu option count should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.getMenuContextItemCount())
            .toBe(7);
        await since('no Read ACL and create ADC present should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.isItemDisplayedInContextMenu('Create AI Data Collection'))
            .toBe(false);
        await libraryPage.clickDossierContextMenuItem('Get Info');
        await since('no Read ACL and action icon count should be #{expected}, while we get #{actual}')
            .expect(await infoWindow.getActionButtonsCount())
            .toBe(3);
        //////// add tags and do not use as referrence
        await infoWindow.close();

        // no Write ACL
        await libraryPage.openDossierContextMenu(xfunc_acl_noWrite.name);
        await since('no Write ACL and context menu option count should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.getMenuContextItemCount())
            .toBe(9);
        await since('no Write ACL and create ADC present should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.isItemDisplayedInContextMenu('Create AI Data Collection'))
            .toBe(true);
        await since('no Write ACL and Replace present should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.isItemDisplayedInContextMenu('Replace'))
            .toBe(false);
        await libraryPage.clickDossierContextMenuItem('Get Info');
        await since('no Write ACL and action icon count should be #{expected}, while we get #{actual}')
            .expect(await infoWindow.getActionButtonsCount())
            .toBe(4);

        // with Write ACL
        await libraryPage.openDossierContextMenu(xfunc_unstructured.name);
        await since('with Write ACL and context menu option count should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.getMenuContextItemCount())
            .toBe(13);
        await since('with Write ACL and Replace present should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.isItemDisplayedInContextMenu('Replace'))
            .toBe(true);
    });
});
