import * as consts from '../../../constants/teams.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import teamsLogin from '../../../api/teams/teamsLogin.js';
import teamsLogout from '../../../api/teams/teamsLogout.js';
import { deleteAllTabsInChannel } from '../../../api/teams/deleteTabInChannel.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';
import * as customApp from '../../../constants/customApp/customAppBody.js';
import * as post from '../../../constants/customApp/customAppCustomizedEmail.js';
import editLibraryEmbedding from '../../../api/admin/libraryEmbedding.js';
import deleteCustomAppByNames from '../../../api/customApp/deleteCustomAppByNames.js';

describe('Share Dossier in Web Teams', () => {
    let {
        loginPage,
        libraryPage,
        infoWindow,
        visualizationPanel,
        userAccount,
        dossierPage,
        modalDialog,
        bookmark,
        shareInTeamsDialog,
        share,
        shareDossier,
        mainTeams,
        conversation,
        pinFromChannel,
        apps,
    } = browsers.pageObj1;

    let dossierNotInLibraryAsHomeAppId,
        dossierNotInLibraryAsHomeAppName = ' --dossierNotInLibraryAsHome';

    const channels = {
        share: consts.shareDossierChannel,
    };

    beforeAll(async () => {
        browser.options.baseUrl = browsers.params.standardUrl;
        await editLibraryEmbedding({ credentials: consts.mstrUser.credentials, embeddingInfo: post.security });
        await editLibraryEmbedding({ credentials: consts.mstrUser.credentials, embeddingInfo: post.all_security });
        await apps.openTeamsApp(consts.teamsApp);
        // 0. delete existing custom app
        await deleteCustomAppByNames({
            credentials: consts.mstrUser.credentials,
            namesToFind: [' --dossierNotInLibraryAsHome'],
            exactMatch: false,
        });
        // 1. create custom app
        const dossierAsHomeAppBody = customApp.getCustomAppBody({
            version: 'v5',
            name: dossierNotInLibraryAsHomeAppName,
            dossierMode: 1,
            url: '/app/' + consts.dossierNotInLibrary.project.id + '/' + consts.dossierNotInLibrary.id,
        });
        dossierNotInLibraryAsHomeAppId = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: dossierAsHomeAppBody,
        });
    });

    afterEach(async () => {
        await dossierPage.closeTab(1);
    });

    afterAll(async () => {
        await mainTeams.switchToAppInSidebar('Teams');
        await deleteCustomAppList({
            credentials: consts.mstrUser.credentials,
            customAppIdList: [dossierNotInLibraryAsHomeAppId],
        });
        // delete all tabs
        const accessToken = await teamsLogin({
            clientId: browsers.params.clientId,
            tenantId: browsers.params.tenantId,
            clientSecret: browsers.params.clientSecret,
        });
        for (const key in channels) {
            await deleteAllTabsInChannel({
                accessToken: accessToken,
                teamId: browsers.params.teamId,
                channelName: channels[key],
            });
        }
        await teamsLogout({
            clientId: browsers.params.clientId,
            tenantId: browsers.params.tenantId,
            clientSecret: browsers.params.clientSecret,
            accessToken: accessToken,
        });
    });

    it('[TC93558_01] Share dossier from context menu', async () => {
        // switch to pinned app
        await infoWindow.waitForInfoIconAppear();
        // open context menu
        await libraryPage.openDossierContextMenu(consts.dossier.name);
        await libraryPage.clickDossierContextMenuItem('Share', 'Share in Teams');
        // switch to iframe
        await browser.switchToFrame(null);
        await shareInTeamsDialog.shareToReceipientInTeams({
            receipient: consts.receipient.credentials.name,
            text: consts.sharedMessage,
        });
        await shareInTeamsDialog.viewSharedMessage();
        // verify link
        let link = await conversation.getLinkInLatestMessage();
        await since('1 Shared message should be #{expected}, instead we have #{actual}.')
            .expect(await conversation.getTextInLatestMessage())
            .toBe(consts.sharedMessage + '\n\n' + link);
        await libraryPage.switchToNewWindowWithLink(link);
        await libraryPage.waitForItemLoading();
        await dossierPage.waitForDossierLoading();
        // receipient login in library
        await loginToWeb(link);
        await since('2 Run dossier from shared link, error should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isErrorPresent())
            .toBe(false);
        await dossierPage.waitForElementVisible(dossierPage.getNavigationBar());
        await since(
            '3 Run dossier from shared link, the toolbar display should be #{expected}, instead we have #{actual}'
        )
            .expect(await dossierPage.isNavigationBarPresent())
            .toBe(true);
        await since('4 Add to library button display should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isAddToLibraryDisplayed())
            .toBe(true);
    });

    it('[TC93558_02] Share dossier from share panel, dossier as home, no bookmark', async () => {
        // switch to pinned app
        await mainTeams.switchToAppInSidebar(consts.teamsApp);
        await infoWindow.waitForInfoIconAppear();
        // switch to bot as home app
        await userAccount.switchCustomApp(dossierNotInLibraryAsHomeAppName);
        await dossierPage.waitForDossierLoading();
        await share.clickShareInTeams();
        // switch to iframe
        await browser.switchToFrame(null);
        await shareInTeamsDialog.shareToReceipientInTeams({
            receipient: consts.receipient.credentials.name,
            text: consts.sharedMessage,
        });
        await shareInTeamsDialog.viewSharedMessage();
        // verify link
        let link = await conversation.getLinkInLatestMessage();
        await since('1 Shared message from custom app should be #{expected}, instead we have #{actual}.')
            .expect(await conversation.getTextInLatestMessage())
            .toBe(consts.sharedMessage + '\n\n' + link);
        await libraryPage.switchToNewWindowWithLink(link);
        await libraryPage.waitForItemLoading();
        await dossierPage.waitForDossierLoading();
        // receipient login in library
        await loginToWeb(link);
        await since('2 Run dossier from shared link, error should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isErrorPresent())
            .toBe(false);
        //check no BM applied and BM list is empty
        await since('3 No bookmark is applied currently')
            .expect(await bookmark.isBookmarkLabelPresent())
            .toBe(false);
        await bookmark.openPanel();
        await since('4 Bookmark list is supposed to be 0')
            .expect(await bookmark.bookmarkCount())
            .toBe(0);
        await bookmark.closePanel();
    });

    it('[TC93558_03] Share dossier from pinned dossier, 2 bookmarks', async () => {
        // pin dossier firstly
        await mainTeams.switchToTeamsChannel({ team: consts.team, channel: consts.shareDossierChannel });
        await pinFromChannel.pinNewDossierFromChannel(consts.teamsApp);
        await modalDialog.switchToLibraryIframe();
        await modalDialog.chooseDossierAndSave(consts.dossier.name);
        await browser.switchToFrame(null);
        if (!(await conversation.isTabExist(consts.dossier.name))) {
            await browser.refresh();
            await mainTeams.switchToTeamsChannel({ team: consts.team, channel: consts.shareDossierChannel });
            await conversation.chooseTab(consts.dossier.name);
        }
        await mainTeams.switchToEmbeddedDossierIframe(5000);
        await visualizationPanel.waitForElementVisible(visualizationPanel.getTextBoxInTeams('Render'));
        // open share panel and share dossier with all bookmarks;
        await share.clickShareInTeams();
        await shareDossier.includeAllBookmarksInTeams();
        await share.closeSharePanel();
        await share.clickShareInTeams();
        await share.shareInTeams();
        // switch to Share in Teams iframe
        await browser.switchToFrame(null);
        await shareInTeamsDialog.shareToReceipientInTeams({
            receipient: consts.receipient.credentials.name,
            text: consts.sharedMessage,
        });
        await shareInTeamsDialog.viewSharedMessage();
        // verify link
        let link = await conversation.getLinkInLatestMessage();
        await since('1 Shared message should be #{expected}, instead we have #{actual}.')
            .expect(await conversation.getTextInLatestMessage())
            .toBe(consts.sharedMessage + '\n\n' + link);
        await libraryPage.switchToNewWindowWithLink(link);
        await libraryPage.waitForItemLoading();
        await dossierPage.waitForDossierLoading();
        // receipient login in library
        await loginToWeb(link);
        await since('2 Run dossier from shared link, error should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isErrorPresent())
            .toBe(false);
        await since('3 Existence of account icon should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isAccountIconPresent())
            .toBe(true);
        // bookmark is applied and BM list is 2
        await since('4 Current BM label on navigation bar should be #{expected}, instead we have #{actual} ')
            .expect(await bookmark.labelInTitle())
            .toBe('Auto_Bookmark 1');
        //check default bookmark selection for shared dialog is empty
        await share.openSharePanel();
        await share.openShareDossierDialog();
        await since(
            '5 Current selected shared BM before click add to library for load shared bookmarks should be #{expected}, instead we have #{actual}'
        )
            .expect(await shareDossier.isBMListPresent())
            .toBe(false);
        await shareDossier.closeDialog();
        await share.closeSharePanel();
        //add to library
        await dossierPage.addToLibrary();
        await bookmark.dismissNotification();
        //check bookmark panel
        await bookmark.openPanel();
        await bookmark.hideBookmarkTimeStamp();
        await since('6 Shared bookmark showing in bookmark panel should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.isBookmarkPresent('Auto_Bookmark 1', 'SHARED WITH ME'))
            .toBe(true);
        await since('7 Shared bookmark showing in bookmark panel should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.isBookmarkPresent('Auto_Bookmark 2', 'SHARED WITH ME'))
            .toBe(true);
        await bookmark.showBookmarkTimeStamp();
        await bookmark.closePanel();
        await dossierPage.goToLibrary();
        await libraryPage.removeDossierFromLibrary(consts.receipient.credentials, consts.dossier);
    });

    async function loginToWeb(link) {
        if (await loginPage.getUsernameForm().isDisplayed()) {
            await loginPage.login(consts.receipient.credentials);
            await dossierPage.waitForDossierLoading();
        } else {
            await libraryPage.openUserAccountMenu();
            await libraryPage.logout();
            await loginPage.login(consts.receipient.credentials);
            await libraryPage.removeDossierFromLibrary(consts.receipient.credentials, consts.dossier);
            await browser.url(link);
            await dossierPage.waitForDossierLoading();
        }
    }
});
