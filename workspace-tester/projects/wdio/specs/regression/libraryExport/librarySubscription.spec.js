import { exportRESTUser } from '../../../constants/bot.js';
import { checkElementByImageComparison } from '../../../utils/TakeScreenshot.ts';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';

describe('LibraryExport - Create and Manage Subscription in Library', () => {
    let {
        loginPage,
        libraryPage,
        share,
        dossierPage,
        subscribe,
        infoWindow,
        sidebar,
        librarySearch,
        fullSearch,
        hamburgerMenu,
    } = browsers.pageObj1;
    const dossier_Auto_SingleGraph = {
        id: 'DEEFFBFE427F3C343B6ABC9D2A6D83F9',
        name: 'Auto_SingleGraph',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    beforeAll(async () => {
        await browser.setWindowSize(1200, 800);
        await loginPage.login(exportRESTUser);
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC94908_1] Check Excel Subscription Settings from Share Panel', async () => {
        await libraryPage.openUrl(dossier_Auto_SingleGraph.project.id, dossier_Auto_SingleGraph.id);
        await share.openSharePanel();
        await share.openSubscribeSettingsWindow();
        await subscribe.inputName('Auto_ExcelSubscription');
        await dossierPage.sleep(1000);
        await subscribe.inputBookmark('Bookmark_ExcelSubscription');
        // console.log(await subscribe.getContentsSetting().getText());
        await since('The default Contents is expected to be #{expected}, instead we have #{actual}')
            .expect(await subscribe.getContentsSetting().getText())
            .toBe('Entire page to worksheet');
        await subscribe.selectExcelContents('visualization');
        await subscribe.searchRecipientByName('Administrator');
        await subscribe.selectRecipients(['Administrator']);
        // Check the modified settings
        await checkElementByImageComparison(
            subscribe.getSubscriptionPanel(),
            'T4969/subscription',
            'TC94908_1-CreateExcelSubscription',
            3
        );
        await dossierPage.sleep(1000);
        await subscribe.createSubscription();
        await dossierPage.goToLibrary();
    });

    it('[TC94908_2] Check Existing Excel Subscriptions from Info Window', async () => {
        await libraryPage.moveDossierIntoViewPort(dossier_Auto_SingleGraph.name);
        await libraryPage.openDossierInfoWindow(dossier_Auto_SingleGraph.name);
        await infoWindow.clickManageSubscriptionsButton();
        //await subscribe.clickSwitchRight();
        await subscribe.clickInfoWindowEdit();
        await infoWindow.sleep(1000);
        await since('The Contents for existing subscription is expected to be #{expected}, instead we have #{actual}')
            .expect(await subscribe.getContentsSetting().getText())
            .toBe('Each visualization separately');
        await checkElementByImageComparison(
            subscribe.getInfoWindowEditPanel(),
            'T4969/subscription',
            'TC94908_2-InfoWindow_CheckExistingSubscription',
            3
        );
        await infoWindow.close();
    });

    it('[TC94908_3] Edit Subscription in Info Window and Check from Sidebar', async () => {
        await libraryPage.moveDossierIntoViewPort(dossier_Auto_SingleGraph.name);
        await libraryPage.openDossierInfoWindow(dossier_Auto_SingleGraph.name);
        await infoWindow.clickManageSubscriptionsButton();
        await subscribe.clickInfoWindowEdit();
        await since('The Contents for this subscription is expected to be #{expected}, instead we have #{actual}')
            .expect(await subscribe.getContentsSetting().getText())
            .toBe('Each visualization separately');
        await subscribe.selectExcelContents('page');
        await subscribe.clickSave();
        await libraryPage.clickLibraryIcon();
        await sidebar.openSubscriptions();
        await subscribe.hoverSubscription('Auto_ExcelSubscription');
        await subscribe.clickEditButtonInSidebar('Auto_ExcelSubscription');
        await since('The Contents for this subscription is expected to be #{expected}, instead we have #{actual}')
            .expect(await subscribe.getContentsSetting().getText())
            .toBe('Entire page to worksheet');
        await checkElementByImageComparison(
            subscribe.getSubscriptionSidebarEditDialog(),
            'T4969/subscription',
            'TC94908_3-Sidebar_CheckModifiedSubscription',
            3
        );
        await subscribe.clickSidebarCancel();
    });

    xit('[TC94908_4] Check Existing Excel Subscriptions from Search Window', async () => {
        await librarySearch.search(dossier_Auto_SingleGraph.name);
        await librarySearch.pressEnter();
        await fullSearch.waitForSearchLoading();
        await fullSearch.clickAllTab();
        await fullSearch.openInfoWindow(dossier_Auto_SingleGraph.name);
        await infoWindow.clickManageSubscriptionsButton();
        await subscribe.clickSwitchRight();
        await subscribe.clickInfoWindowEdit();
        await since('The Contents for existing subscription is expected to be #{expected}, instead we have #{actual}')
            .expect(await subscribe.getContentsSetting().getText())
            .toBe('Each visualization separately');
        await checkElementByImageComparison(
            subscribe.getInfoWindowEditPanel(),
            'T4969/subscription',
            'TC94908_4-SearchWindow_CheckExistingSubscription',
            3
        );
        await infoWindow.close();
    });

    it('[TC94908_5] Check Subscriptions from Share Panel in Mobile View', async () => {
        await browser.setWindowSize(400, 1000);
        await libraryPage.openUrl(dossier_Auto_SingleGraph.project.id, dossier_Auto_SingleGraph.id);
        await dossierPage.clickHamburgerMenu();
        await hamburgerMenu.clickShare();
        await hamburgerMenu.clickSubscribeToDashboard();
        await subscribe.inputName('Auto_Subscription_Mobileview');
        await since('The default Contents is expected to be #{expected}, instead we have #{actual}')
            .expect(await subscribe.getContentsSetting().getText())
            .toBe('Entire page to worksheet');
        await checkElementByImageComparison(
            hamburgerMenu.getSubscribeToDashboardPanel(),
            'T4969/subscription',
            'TC94908_5-Subscribe_MobileView',
            3
        );
    });
});
