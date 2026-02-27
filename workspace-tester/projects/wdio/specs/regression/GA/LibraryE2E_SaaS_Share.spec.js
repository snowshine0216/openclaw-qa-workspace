import resetSaaSObjectAcl from '../../../api/manageAccess/resetSaaSObjectAcl.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import urlParser from '../../../api/urlParser.js';

describe('SaaSShare', () => {
    const project = {
        id: '69D4DA35264BAA98CC2BF68356064C35',
        name: 'MicroStrategy',
    };

    const SaaSSenderUser = {
        credentials: {
            username: 'saastest.b@microstrategy.com',
            password: 'newman1#',
        },
        id: 'B083E4E2B74BAAC01D475A81ECFC925C',
        fullName: 'saastest.b',
    };

    const SaaSRecipientUser = {
        credentials: {
            username: 'saastest.a@microstrategy.com',
            password: 'newman1#',
        },
        id: 'BC11E901FF47A1684F55D399C3FD44BA',
        fullName: 'saastest.a',
    };

    const saas_share_bot = {
        id: '1D913E9DFE40C706864BC2AA9227BE8F',
        name: 'saas_share_bot',
        project: project,
    };

    const saas_share_dossier = {
        id: 'ECF7DE7EBB4763C1CCCE8D82E3478FB1',
        name: 'saas_share_dossier',
        project: project,
        bookmarkIds: ['564B89981F4FA6D0346D8F9535994905'],
    };

    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let {
        loginPage,
        libraryPage,
        dossierPage,
        bookmark,
        shareDossier,
        share,
        saasShareDialog,
        aibotChatPanel,
        saasManageAccess,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        await libraryPage.executeScript('window.localStorage.clear();');
    });

    afterEach(async () => {
        await libraryPage.userAccount.openUserAccountMenu();
        await libraryPage.userAccount.logout({ SSO: true });
    });

    /**
     * login with credential
     */
    async function waitForLibraryReady() {
        await libraryPage.waitForCurtainDisappear();
        await libraryPage.waitForLibraryLoading();
        await browser.pause(1000);
    }

    /**
     * Switch user, logout from current session and login with new user
     */
    async function switchUser(credentials) {
        //UI logout
        await libraryPage.userAccount.openUserAccountMenu();
        await libraryPage.userAccount.logout({ SSO: true });
        await loginPage.waitForElementVisible(loginPage.getB2CEmailAddressField());
        await loginPage.saasLogin(credentials);
        await waitForLibraryReady();
        await libraryPage.executeScript('window.pendo.onGuideDismissed();');
    }

    /**
     * load library page by url
     */
    async function goToLibraryPage() {
        await dossierPage.clickSaaSLibraryIcon();
        await dossierPage.waitForLibraryLoading();
    }

    /**
     * get share link
     */
    async function getShareLink(shareMock) {
        await browser.waitUntil(
            async () => {
                return shareMock.calls.length >= 1;
            },
            {
                timeout: 60000,
                timeoutMsg: 'No response for share returned in 60000ms',
            }
        );
        const postDataJson = JSON.parse(shareMock.calls[0].postData);
        let baseUrl = urlParser(browser.options.baseUrl);
        baseUrl = baseUrl.substring(0, baseUrl.length - 1);
        const shareLink = baseUrl + postDataJson.emailContent.shareLink;
        return shareLink;
    }

    /**
     * get share link
     */
    async function updateUserIconColor() {
        await browser.execute(() => {
            var elements = document.getElementsByClassName('mstrd-User-icon');
            for (var i = 0; i < elements.length; i++) {
                elements[i].style.backgroundColor = 'rgb(74, 144, 228)';
            }
        });
        // wait for UI refresh
        await browser.pause(1000);
    }

    /**
     * 1. Sender open bot and dossier
     * 2. Sender open bot and dossier share dialog
     * 3. Sender Input recipient and share
     * 4. Sender check manage access dialog
     * 5. Recipient run bot and dossier from library directly
     * 6. Recipient open share link and check bookmark
     */
    it('[TC93406] Validate E2E workflow for SaaS Share Bot and Dashboard', async () => {
        const inviteMessage = 'E2E workflow test for saas share bot';

        // recipient login and remove dossiers from library
        await loginPage.saasLogin(SaaSRecipientUser.credentials);
        await waitForLibraryReady();
        await libraryPage.executeScript('window.pendo.onGuideDismissed();');
        await libraryPage.removeDossierFromLibrary(undefined, saas_share_bot, true, false);
        await libraryPage.removeDossierFromLibrary(undefined, saas_share_dossier, true, false);

        // Sender login
        await switchUser(SaaSSenderUser.credentials);
        // Sender reset shared object ACL
        await resetSaaSObjectAcl({ object: saas_share_bot });
        await resetSaaSObjectAcl({ object: saas_share_dossier });

        // Sender open bot
        await libraryPage.openDossier(saas_share_bot.name);
        await libraryPage.executeScript('window.pendo.onGuideDismissed();');
        await libraryPage.executeScript('window.pendo.onGuideDismissed();');

        // Sender click ‘Share bot’ in toolbar, show share dialog
        await dossierPage.openShareDropDown();
        await share.openShareDossierDialog();
        await shareDossier.waitForElementVisible(saasShareDialog.getShareButton());

        // Sender input recipient, then click ‘send’
        await saasShareDialog.inputRecipient(SaaSRecipientUser.credentials.username);
        await shareDossier.addMessage(inviteMessage);
        await shareDossier.hideTimeAndName();
        await takeScreenshotByElement(
            await shareDossier.getShareDossierDialog(),
            'TC93406',
            'SaaS Share bot: SaaS share dialog after input recipient',
            { tolerance: 0.1 }
        );
        await shareDossier.showTimeAndName();
        await saasShareDialog.saasShare();
        await goToLibraryPage();

        // Sender open bot
        await libraryPage.openDossier(saas_share_dossier.name);
        await libraryPage.executeScript('window.pendo.onGuideDismissed();');
        await libraryPage.executeScript('window.pendo.onGuideDismissed();');

        // Sender click ‘Share bot’ in toolbar, show share dialog
        await dossierPage.openShareDropDown();
        await share.openShareDossierDialog();
        await shareDossier.waitForElementVisible(saasShareDialog.getShareButton());
        await shareDossier.hideTimeAndName();
        await takeScreenshotByElement(
            await shareDossier.getShareDossierDialog(),
            'TC93406',
            'SaaS Share dossier: SaaS share dialog for dossier',
            { tolerance: 0.1 }
        );
        await shareDossier.showTimeAndName();

        // Sender input recipient, then click ‘send’
        await saasShareDialog.inputRecipient(SaaSRecipientUser.credentials.username);
        await saasShareDialog.selectBookmark(['Bookmark 1']);
        await shareDossier.addMessage(inviteMessage);
        // prepare to mock share dossier request
        const shareRequestMock = await browser.mock('**/api/objects/' + saas_share_dossier.id + '/invite', {
            method: 'post',
        });
        await saasShareDialog.saasShare();
        const shareDossierLink = await getShareLink(shareRequestMock);
        await goToLibraryPage();
        // retore share dossier request mock
        await shareRequestMock.restore();

        // Sender open manage access dialog and take screenshot
        await libraryPage.openDossierContextMenu(saas_share_bot.name);
        await libraryPage.clickDossierContextMenuItem('Manage Access');
        await saasManageAccess.waitForManageAccessLoading();
        await saasManageAccess.waitForElementEnabled(saasManageAccess.getSaveButton());
        await updateUserIconColor();
        await takeScreenshotByElement(
            await saasManageAccess.getSaasManageAccessDialog(),
            'TC93406',
            'SaaS Bot Manage access: SaaS bot manage access dialog',
            { tolerance: 0.1 }
        );
        await saasManageAccess.closeDialog();

        await libraryPage.openDossierContextMenu(saas_share_dossier.name);
        await libraryPage.clickDossierContextMenuItem('Manage Access');
        await saasManageAccess.waitForManageAccessLoading();
        await saasManageAccess.waitForElementEnabled(saasManageAccess.getSaveButton());
        await updateUserIconColor();
        await takeScreenshotByElement(
            await saasManageAccess.getSaasManageAccessDialog(),
            'TC93406',
            'SaaS Dossier Manage access: SaaS dossier manage access dialog',
            { tolerance: 0.1 }
        );
        await saasManageAccess.closeDialog();

        //login with recipient user
        await switchUser(SaaSRecipientUser.credentials);

        // execute bot from library page directly
        await libraryPage.openDossier(saas_share_bot.name);
        await libraryPage.executeScript('window.pendo.onGuideDismissed();');
        await libraryPage.executeScript('window.pendo.onGuideDismissed();');
        // wait for welcome page of bot
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePage());
        await goToLibraryPage();

        // execute dossier from library page directly
        await libraryPage.openDossier(saas_share_dossier.name);
        await libraryPage.executeScript('window.pendo.onGuideDismissed();');
        await libraryPage.executeScript('window.pendo.onGuideDismissed();');
        // wait for dossiser loading
        await dossierPage.waitForDossierLoading();
        await bookmark.waitForElementVisible(bookmark.getBookmarkIcon());
        //back to library
        await goToLibraryPage();

        //open share link and current bookmark label should be 'Bookmark 1'
        await browser.url(shareDossierLink, 60000);
        await libraryPage.executeScript('window.pendo.onGuideDismissed();');
        await libraryPage.executeScript('window.pendo.onGuideDismissed();');
        await since(
            'After apply bm, current BM label on navigation bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await bookmark.labelInTitle())
            .toBe('Bookmark 1');
        //back to library
        await goToLibraryPage();
    });
});
