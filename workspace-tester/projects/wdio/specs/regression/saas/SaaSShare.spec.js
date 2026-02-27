import resetObjectAcl from '../../../api/manageAccess/resetObjectAcl.js';
import setObjectExtendedProperties from '../../../api/objectManagement/setObjectExtendedProperties.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import generateSharedLink from '../../../api/generateSharedLink.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';

describe('SaaSShare', () => {
    const project = {
        id: '69D4DA35264BAA98CC2BF68356064C35',
        name: 'MicroStrategy',
    };

    const adminCredentials = {
        username: 'admin',
        password: 'newman1#',
    };

    const SaaSSenderUser = {
        credentials: {
            username: 'saas_share@example.com',
            password: 'newman1#',
        },
        id: 'CCDA9E66F14C55A11F314AB7D0AE1D13',
        firstName: 'SaaS Sender',
        fullName: 'saas_share_user',
    };

    const SaaSRecipientUser = {
        credentials: {
            username: 'saas_recipient@example.com',
            password: 'newman1#',
        },
        id: '1B1A3E3B5F4E0DF22C2083B571A43D39',
        firstName: 'SaaS Recipient',
        fullName: 'SaaS Recipient for share bot',
    };

    const saas_share_bot = {
        id: 'A7F2F6A7324E21CCB085F8B0CAC29B9F',
        name: 'saas_share_bot',
        project: project,
        sharedLink: null,
    };

    const saas_share_dossier = {
        id: 'E81E2E1671411A7C780AAE84332528A7',
        name: 'saas_share_dossier',
        project: project,
        sharedLink: null,
        bookmarkIds: ['3DBE1AD7CA4D590629F8CBBF7E590A68'],
    };

    const saas_expire_share_bot = {
        id: 'E224EC2DD54D8BCE9AE82A91BE7AB4FB',
        name: 'expire_owner_bot',
        project: project,
        sharedLink: null,
    };

    const saas_expire_share_dossier = {
        id: '1E9DBA4FD64F920DB343ED9D3334AB4D',
        name: 'expire_owner_dashboard',
        project: project,
        sharedLink: null,
        bookmarkIds: ['31968E17E541D4483367CDA42A622BDB', '352F031B8C443ACD60ED8DA055CC898A'],
    };

    const invalid_bot_id = '17E092EADE4F83B12F720A8CA9FFFFFF';

    const defaultAcl = [
        {
            value: 'Full Control',
            id: SaaSSenderUser.id,
            name: SaaSSenderUser.credentials.username,
        },
    ];

    const config_object = {
        id: '38A062302D4411D28E71006008960167',
        name: 'maximum_share_times_config',
        project: project,
        type: 36,
    };

    function getObjectExtPropsPayload(value = -1) {
        const payload = [
            {
                id: '03EC6B029B7D4FC260A147C8110965A3',
                properties: [
                    {
                        id: 14,
                        value: value,
                    },
                ],
            },
        ];
        return payload;
    }

    const defaultObjExtPropsPayload = getObjectExtPropsPayload(-1);

    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let {
        loginPage,
        libraryPage,
        dossierPage,
        bookmark,
        infoWindow,
        shareDossier,
        share,
        saasShareDialog,
        aibotChatPanel,
        saasManageAccess,
        listView,
        librarySearch,
        fullSearch,
        searchPage,
        listViewAGGrid,
        saasEmail,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        if (!(await loginPage.isLoginPageDisplayed())) {
            await browser.url(new URL('auth/ui/loginPage', browser.options.baseUrl).toString(), 100000);
        }
        await libraryPage.executeScript('window.localStorage.clear();');
        // diable share times limitation
        await setObjectExtendedProperties({
            credentials: adminCredentials,
            object: config_object,
            objectExtPropsPayload: defaultObjExtPropsPayload,
        });
    });

    afterEach(async () => {
        await logoutFromCurrentBrowser();
    });

    afterAll(async () => {
        // diable share times limitation
        await setObjectExtendedProperties({
            credentials: adminCredentials,
            object: config_object,
            objectExtPropsPayload: defaultObjExtPropsPayload,
        });
        //clear all share emails created in the execution
        await saasEmail.clearMsgBox(SaaSSenderUser.fullName);
    });

    /**
     * Clear recipient's notifications and remove dossiers from library
     */
    async function resetRecipientUser(shareObj) {
        await login(SaaSRecipientUser.credentials);
        await libraryPage.removeDossierFromLibrary(SaaSRecipientUser.credentials, shareObj);
    }

    /**
     * Reset the object ACL, login sender and open custom app
     */
    async function prepareForSender(shareObj) {
        // Reset ACL
        await resetObjectAcl({ credentials: SaaSSenderUser.credentials, object: shareObj, acl: defaultAcl });
    }

    /**
     * login with credential
     */
    async function login(credentials) {
        await loginPage.standardInputCredential(credentials);
        await browser.keys('Enter');
        await libraryPage.waitForCurtainDisappear();
        await libraryPage.waitForLibraryLoading();
        await browser.pause(1000);
        await libraryPage.executeScript('window.pendo.onGuideDismissed();');
    }

    /**
     * Switch user, logout from current session and login with new user
     */
    async function switchUser(credentials) {
        const isLoginPageDisplay = await loginPage.isLoginPageDisplayed();
        if (isLoginPageDisplay === false) {
            await libraryPage.userAccount.openUserAccountMenu();
            await libraryPage.userAccount.logout();
        }
        await login(credentials);
    }

    /**
     * load library page by url
     */
    async function goToLibraryPage() {
        await dossierPage.clickSaaSLibraryIcon();
        await dossierPage.waitForLibraryLoading();
    }

    /**
     * Generate the shared link based project id, object id and bookmark id
     */
    async function openShareLink(projectId, objectId, bookmarkIds = [], libraryUrl = browser.options.baseUrl) {
        if (bookmarkIds.length === 0) {
            const url = new URL(`app/${projectId}/${objectId}/share`, libraryUrl);
            await browser.url(url.toString(), 60000);
        } else {
            const url = new URL(`app/${projectId}/${objectId}/bookmarks`, libraryUrl);
            url.searchParams.set('ids', bookmarkIds.join(','));
            await browser.url(url.toString(), 60000);
        }
    }

    /**
     * 1. Sender open bot
     * 2. Sender click ‘Share bot’ in toolbar, show share dialog
     * 3. Sender Input recipient and share
     * 4. Sender check manage access dialog
     * 4. Recipient receives a new e-mail, then click ‘View in Browser’
     * 5. Recipient receives a new notification, then click the notification
     * 6. Recipient run bot from library directly
     */
    it('[TC92948_1] Validate E2E workflow for SaaS Share Bot', async () => {
        // Generate the shared link for these bot objects
        saas_share_bot.sharedLink = await generateSharedLink({
            credentials: SaaSSenderUser.credentials,
            dossier: saas_share_bot,
        });

        const inviteMessage = 'E2E workflow test for saas share bot';

        // Prepare
        await resetRecipientUser(saas_share_bot);
        await saasEmail.clearMsgBox(SaaSSenderUser.fullName);
        await prepareForSender(saas_share_bot);

        // Sender runs Bot in library
        await switchUser(SaaSSenderUser.credentials);
        await libraryPage.openDossier(saas_share_bot.name);
        await libraryPage.executeScript('window.pendo.onGuideDismissed();');
        await libraryPage.executeScript('window.pendo.onGuideDismissed();');

        // Sender click ‘Share bot’ in toolbar, show share dialog
        await dossierPage.openShareDropDown();
        await share.openShareDossierDialog();
        await shareDossier.waitForElementVisible(saasShareDialog.getShareButton());
        await shareDossier.hideTimeAndName();
        await takeScreenshotByElement(
            await shareDossier.getShareDossierDialog(),
            'TC92948_1',
            'SaaS Share bot: SaaS share dialog for bot',
            { tolerance: 0.1 }
        );
        await shareDossier.showTimeAndName();

        // Sender input recipient, then click ‘send’
        await saasShareDialog.inputRecipient(
            'user123@example.com,john_doe123@company-mail.net,saas_recipient@example.com,saas_recipient@microstrategy.com'
        );
        await shareDossier.addMessage(inviteMessage);
        await shareDossier.hideTimeAndName();
        await takeScreenshotByElement(
            await shareDossier.getShareDossierDialog(),
            'TC92948_1',
            'SaaS Share bot: SaaS share dialog after input recipient',
            { tolerance: 0.1 }
        );
        await shareDossier.showTimeAndName();
        await saasShareDialog.saasShare();
        await goToLibraryPage();

        // Sender open manage access dialog and take screenshot
        await libraryPage.openDossierContextMenu(saas_share_bot.name);
        await libraryPage.clickDossierContextMenuItem('Manage Access');
        await saasManageAccess.waitForManageAccessLoading();
        await saasManageAccess.waitForElementEnabled(saasManageAccess.getSaveButton());
        await saasManageAccess.hideUserIcons();
        await takeScreenshotByElement(
            await saasManageAccess.getSaasManageAccessDialog(),
            'TC92948_1',
            'SaaS Manage access: SaaS manage access dialog',
            { tolerance: 0.1 }
        );
        await saasManageAccess.closeDialog();

        //login with recipient user
        await switchUser(SaaSRecipientUser.credentials);

        // Recipient receives a new e-mail, check the email content
        await since('Invite content in email should be "#{expected}", instead we have "#{actual}"')
            .expect(await saasEmail.getInviteContent(SaaSSenderUser.fullName))
            .toEqual(
                SaaSSenderUser.fullName +
                    ' shared ' +
                    saas_share_bot.name +
                    ' , created using Strategy Auto Express, with you.'
            );
        await since('Invite message in email should be "#{expected}", instead we have "#{actual}"')
            .expect(await saasEmail.getInviteMessage(SaaSSenderUser.fullName))
            .toEqual('Message from ' + SaaSSenderUser.fullName + ': ' + inviteMessage);
        await since('Share link in email should be "#{expected}", instead we have "#{actual}"')
            .expect(await saasEmail.getBrowserLink(SaaSSenderUser.fullName))
            .toEqual(saas_share_bot.sharedLink);

        // execute bot from library page directly
        await libraryPage.openDossier(saas_share_bot.name);
        await libraryPage.executeScript('window.pendo.onGuideDismissed();');
        await libraryPage.executeScript('window.pendo.onGuideDismissed();');
        // wait for welcome page of bot
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePage());
        await goToLibraryPage();
    });

    /**
     * 1. Sender open dossier
     * 2. Sender click ‘Share Dossier’ in toolbar, show share dialog
     * 3. Sender Input recipient and share
     * 4. Sender check manage access dialog
     * 4. Recipient receives a new e-mail, then click ‘View in Browser’
     * 5. Recipient receives a new notification, then click the notification
     * 6. Recipient run dossier from library directly
     */
    it('[TC92948_2] Validate E2E workflow for SaaS Share Dossier', async () => {
        // Generate the shared link for these bot objects
        saas_share_dossier.sharedLink = await generateSharedLink({
            credentials: SaaSSenderUser.credentials,
            dossier: saas_share_dossier,
        });

        const inviteMessage = 'E2E workflow test for saas share dossier with bookmark';

        // Prepare
        await resetRecipientUser(saas_share_dossier);
        await saasEmail.clearMsgBox(SaaSSenderUser.fullName);
        await prepareForSender(saas_share_dossier);

        // Sender runs Bot in library
        await switchUser(SaaSSenderUser.credentials);
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
            'TC92948_2',
            'SaaS Share bot: SaaS share dialog for dossier',
            { tolerance: 0.1 }
        );
        await shareDossier.showTimeAndName();

        // Sender input recipient, then click ‘send’
        await saasShareDialog.inputRecipient(
            'user123@example.com,john_doe123@company-mail.net,saas_recipient@example.com,saas_recipient@microstrategy.com'
        );
        await saasShareDialog.selectBookmark(['Bookmark 1']);
        await shareDossier.addMessage(inviteMessage);
        await saasShareDialog.saasShare();
        await goToLibraryPage();

        // Sender open manage access dialog and take screenshot
        await libraryPage.openDossierContextMenu(saas_share_dossier.name);
        await libraryPage.clickDossierContextMenuItem('Manage Access');
        await saasManageAccess.waitForManageAccessLoading();
        await saasManageAccess.waitForElementEnabled(saasManageAccess.getSaveButton());
        await since('The count of people with access should be #{expected}, instead we have #{actual}')
            .expect(await saasManageAccess.getACLItemscount())
            .toBe(5);

        //load library page
        await saasManageAccess.closeDialog();

        //login with recipient user
        await switchUser(SaaSRecipientUser.credentials);

        // Recipient receives a new e-mail, check the email content
        await since('Invite content in email should be "#{expected}", instead we have "#{actual}"')
            .expect(await saasEmail.getInviteContent(SaaSSenderUser.fullName))
            .toEqual(
                SaaSSenderUser.fullName +
                    ' shared ' +
                    saas_share_dossier.name +
                    ' and 1 bookmark , created using Strategy Auto Express, with you.'
            );
        await since('Invite message in email should be "#{expected}", instead we have "#{actual}"')
            .expect(await saasEmail.getInviteMessage(SaaSSenderUser.fullName))
            .toEqual('Message from ' + SaaSSenderUser.fullName + ': ' + inviteMessage);
        await since('Share link in email should be "#{expected}", instead we have "#{actual}"')
            .expect(await saasEmail.getBrowserLink(SaaSSenderUser.fullName))
            .toEqual(saas_share_dossier.sharedLink);

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
        await openShareLink(saas_share_dossier.project.id, saas_share_dossier.id, saas_share_dossier.bookmarkIds);
        await libraryPage.executeScript('window.pendo.onGuideDismissed();');
        await libraryPage.executeScript('window.pendo.onGuideDismissed();');
        // wait for dossiser loading
        await dossierPage.waitForDossierLoading();
        await since(
            'After apply bm, current BM label on navigation bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await bookmark.labelInTitle())
            .toBe('Bookmark 1');
        //back to library
        await goToLibraryPage();
    });

    /**
     * 1. Sender open bot
     * 2. Sender share bot to owner
     * 3. Sender check manage access dialog
     * 4. Sender still could share bot
     */
    it('[TC92949_1] Validate share to owner, acl is not changed', async () => {
        // Prepare
        await prepareForSender(saas_share_bot);

        // Sender runs Bot in library
        await login(SaaSSenderUser.credentials);
        await libraryPage.openDossier(saas_share_bot.name);
        await libraryPage.executeScript('window.pendo.onGuideDismissed();');
        await libraryPage.executeScript('window.pendo.onGuideDismissed();');

        // Sender click ‘Share bot’ in toolbar, show share dialog
        await dossierPage.openShareDropDown();
        await share.openShareDossierDialog();
        await saasShareDialog.waitForElementVisible(saasShareDialog.getShareButton());

        // Sender input recipient, then click ‘send’
        await saasShareDialog.inputRecipient(SaaSSenderUser.credentials.username);
        await shareDossier.addMessage('E2E workflow test for saas share bot');
        await saasShareDialog.saasShare();
        await goToLibraryPage();

        // Sender open manage access dialog and take screenshot
        await libraryPage.openDossierContextMenu(saas_share_bot.name);
        await libraryPage.clickDossierContextMenuItem('Manage Access');
        await saasManageAccess.waitForManageAccessLoading();
        await saasManageAccess.waitForElementEnabled(saasManageAccess.getSaveButton());
        await since('The count of people with access should be #{expected}, instead we have #{actual}')
            .expect(await saasManageAccess.getACLItemscount())
            .toBe(1);
        await saasManageAccess.closeDialog();

        await libraryPage.openDossierContextMenu(saas_share_bot.name);
        await libraryPage.clickDossierContextMenuItem('Share', 'Share Bot');
        await shareDossier.closeDialog();
    });

    /**
     * 1. Sender open bot
     * 2. Sender click ‘Share bot’ in toolbar, show share dialog
     * 3. Sender Input recipient and share
     * 4. Sender check manage access dialog
     * 5. remove recipient from manage access dialog
     * 6. Recipient run bot from library directly
     */
    it('[TC92949_2] Validate remove recipient from manage access dialog', async () => {
        // Generate the shared link for these bot objects
        saas_share_bot.sharedLink = await generateSharedLink({
            credentials: SaaSSenderUser.credentials,
            dossier: saas_share_bot,
        });

        const inviteMessage = 'E2E workflow test for saas share bot';

        // Prepare
        await prepareForSender(saas_share_bot);

        // Sender share Bot in library
        await login(SaaSSenderUser.credentials);
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
        await saasShareDialog.saasShare();
        await goToLibraryPage();

        // Sender open manage access dialog and take screenshot
        await libraryPage.openDossierInfoWindow(saas_share_bot.name);
        // remove recipient from manage access dialog and save
        // wait for all acl list is displayed
        await infoWindow.openManageAccessDialog();
        await saasManageAccess.waitForManageAccessLoading();
        await saasManageAccess.waitForElementEnabled(saasManageAccess.getSaveButton());
        await since('The count of people with access should be #{expected}, instead we have #{actual}')
            .expect(await saasManageAccess.getACLItemscount())
            .toBe(2);
        await saasManageAccess.hideUserIcons();
        await takeScreenshotByElement(
            await saasManageAccess.getSaasManageAccessDialog(),
            'TC92949_2',
            'SaaS Manage access: SaaS manage access dialog before remove recipient',
            { tolerance: 0.1 }
        );
        await saasManageAccess.closeDialog();

        // remove recipient from manage access dialog
        await infoWindow.openManageAccessDialog();
        await saasManageAccess.waitForManageAccessLoading();
        await saasManageAccess.waitForElementEnabled(saasManageAccess.getSaveButton());
        await saasManageAccess.removeAccessEntryItem(SaaSRecipientUser.credentials.username);
        await saasManageAccess.saveManageAccess();
        await searchPage.closeInfoWindow();

        //check manage access dialog
        await libraryPage.openDossierInfoWindow(saas_share_bot.name);
        await infoWindow.openManageAccessDialog();
        await saasManageAccess.waitForManageAccessLoading();
        await saasManageAccess.waitForElementEnabled(saasManageAccess.getSaveButton());
        await since('After remove, the count of people with access should be #{expected}, instead we have #{actual}')
            .expect(await saasManageAccess.getACLItemscount())
            .toBe(1);
        await saasManageAccess.closeDialog();
        await searchPage.closeInfoWindow();
    });

    /**
     * 1. input invalid email address as recipient
     * 2. check error msg
     * 3. input blakclist email address as recipient
     * 4. check error msg
     * 5. input email address > 100 charactors as recipient
     * 6. check error msg
     */
    it('[TC92949_3] Validate error msg when input invalid email', async () => {
        // Prepare
        await prepareForSender(saas_share_bot);
        //login with sender user
        await login(SaaSSenderUser.credentials);

        // From info window in library home
        await libraryPage.openDossierInfoWindow(saas_share_bot.name);
        await infoWindow.shareDossier();
        await shareDossier.waitForElementVisible(shareDossier.getShareDossierDialog());
        await saasShareDialog.inputRecipient('testi@invalid,');
        await since(`recipient error msg in share dialog should be #{expected}, while we get #{actual}`)
            .expect(await saasShareDialog.getErrorMsg())
            .toBe('Invalid email address');
        await since('share button status should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.isShareButtonEnabled())
            .toBe(false);
        await saasShareDialog.inputRecipient('Invalid email address');
        await saasShareDialog.inputRecipient('test@gmail.com,');
        await since(`recipient error msg in share dialog should be #{expected}, while we get #{actual}`)
            .expect(await saasShareDialog.getErrorMsg())
            .toBe('Please use a corporate email address');
        await saasShareDialog.inputRecipient('Please use a corporate email address');
        await since('share button status should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.isShareButtonEnabled())
            .toBe(false);
        await saasShareDialog.inputRecipient(
            'a1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890@example.com'
        );
        await browser.keys('Enter');
        await since(`recipient error msg in share dialog should be #{expected}, while we get #{actual}`)
            .expect(await saasShareDialog.getErrorMsg())
            .toBe('Invalid email address');
        await since('share button status should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.isShareButtonEnabled())
            .toBe(false);
        await saasShareDialog.inputRecipient(SaaSRecipientUser.credentials.username);
        await browser.keys('Enter');
        await since(`recipient error msg exist status should be #{expected}, while we get #{actual}`)
            .expect(await saasShareDialog.isErrorMsgPresent())
            .toBe(false);
        await since('share button status should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.isShareButtonEnabled())
            .toBe(true);
        await shareDossier.closeDialog();
    });

    /**
     * 1. copy illegal email list
     * 2. check error tooltip for illegal email, blacklist email, and email > 100 charactors
     */
    it('[TC92949_4] Validate error tootip after copy email list', async () => {
        // Prepare
        await prepareForSender(saas_share_dossier);
        //login with sender user
        await login(SaaSSenderUser.credentials);

        // From info window in library home
        await libraryPage.openDossierInfoWindow(saas_share_dossier.name);
        await infoWindow.shareDossier();
        await shareDossier.waitForElementVisible(shareDossier.getShareDossierDialog());
        await saasShareDialog.pasteRecipient(
            'test@invalid,test@gmail.com,a1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890@example.com'
        );
        await since('share button status should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.isShareButtonEnabled())
            .toBe(false);

        await saasShareDialog.hoverRecipient('test@invalid');
        await since(`recipient error msg in share dialog should be #{expected}, while we get #{actual}`)
            .expect(await saasShareDialog.getRecipientTooltipMsg())
            .toBe('Invalid email address');
        await saasShareDialog.removeRecipient('test@invalid');
        await since('share button status should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.isShareButtonEnabled())
            .toBe(false);

        await saasShareDialog.hoverRecipient('test@gmail.com');
        await since(`recipient error msg in share dialog should be #{expected}, while we get #{actual}`)
            .expect(await saasShareDialog.getRecipientTooltipMsg())
            .toBe('Please use a corporate email address');
        await saasShareDialog.removeRecipient('test@gmail.com');
        await since('share button status should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.isShareButtonEnabled())
            .toBe(false);

        await saasShareDialog.hoverRecipient(
            'a1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890@example.com'
        );
        await since(`recipient error msg in share dialog should be #{expected}, while we get #{actual}`)
            .expect(await saasShareDialog.getRecipientTooltipMsg())
            .toBe('Invalid email address');
        await saasShareDialog.removeRecipient(
            'a1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890@example.com'
        );
        await since('share button status should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.isShareButtonEnabled())
            .toBe(false);

        await shareDossier.closeDialog();
    });

    /**
     * check sender share entry on bot
     *  1. check context menu in library page
     *  2. check info window in library page
     *  3. check hover in list view
     *  4. check context menu in list view
     *  5. check info window in list view
     *  6. check search page info window
     *  7. check bot edit mode
     */
    it('[TC92949_5] Validate show bot share entry for owner in SAAS', async () => {
        // Prepare
        await prepareForSender(saas_share_bot);
        //login with sender user
        await login(SaaSSenderUser.credentials);

        // check bot share in edit mode
        await libraryPage.openDossierInfoWindow(saas_share_bot.name);
        await infoWindow.clickEditButton();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendations());
        await dossierPage.openShareDropDown();
        await share.waitForElementVisible(share.getShareBotButton());
        await share.openShareBotDialog();
        await shareDossier.closeDialog();

        //back to library
        await goToLibraryPage();

        // From info window in library home
        await libraryPage.openDossierInfoWindow(saas_share_bot.name);
        await infoWindow.shareDossier();
        await shareDossier.closeDialog();
        await searchPage.closeInfoWindow();

        // From context menu in library home
        await libraryPage.openDossierContextMenu(saas_share_bot.name);
        await libraryPage.clickDossierContextMenuItem('Share', 'Share Bot');
        await shareDossier.closeDialog();

        // select list view
        await listView.selectListViewMode();
        // dismiss tooltip of list view
        await listView.click({ elem: libraryPage.getNavigationBar() });
        //wait for list view loaded
        await listViewAGGrid.waitForElementVisible(listViewAGGrid.getAGGridContainerContentHeight(), {
            timeout: 60000,
            msg: 'fail to load dossier/bot in list view',
        });

        // from info window in list view
        await listView.openInfoWindowFromListView(saas_share_bot.name);
        await listView.clickShareFromIW();
        await shareDossier.waitForElementVisible(shareDossier.getShareDossierDialog());
        await shareDossier.closeDialog();
        await listView.clickCloseIcon();

        // from context menu in list view
        await listView.rightClickToOpenContextMenu({ name: saas_share_bot.name });
        await libraryPage.clickDossierContextMenuItem('Share', 'Share Bot');
        await shareDossier.closeDialog();

        // From hover in list view
        await listView.openShareFromListView(saas_share_bot.name);
        await shareDossier.closeDialog();

        // enter search page
        await librarySearch.openSearchBox();
        await librarySearch.search(saas_share_bot.name);
        await librarySearch.pressEnter();
        await dossierPage.sleep(2000);

        // from info window in search page
        await fullSearch.openInfoWindow(saas_share_bot.name);
        await infoWindow.shareDossier();
        await shareDossier.closeDialog();
        await searchPage.closeInfoWindow();
    });

    /**
     * check sender share entry on dossier
     *  1. check context menu in library page
     *  2. check info window in library page
     *  3. check hover in list view
     *  4. check context menu in list view
     *  5. check info window in list view
     *  6. check search page info window
     */
    it('[TC92949_6] Validate show dossier share entry for owner in SAAS', async () => {
        // Prepare
        await prepareForSender(saas_share_bot);
        //login with sender user
        await login(SaaSSenderUser.credentials);
        //open dossier
        await libraryPage.openDossier(saas_share_dossier.name);
        await dossierPage.waitForDossierLoading();
        await libraryPage.executeScript('window.pendo.onGuideDismissed();');
        await libraryPage.executeScript('window.pendo.onGuideDismissed();');
        await bookmark.waitForElementVisible(bookmark.getBookmarkIcon());
        await bookmark.openPanel();
        await bookmark.shareBookmark('Bookmark 1');
        await shareDossier.closeDialog();
        await goToLibraryPage();

        // From info window in library home
        await libraryPage.openDossierInfoWindow(saas_share_dossier.name);
        await infoWindow.shareDossier();
        await shareDossier.closeDialog();
        await searchPage.closeInfoWindow();

        // From context menu in library home
        await libraryPage.openDossierContextMenu(saas_share_dossier.name);
        await libraryPage.clickDossierContextMenuItem('Share', 'Share Dashboard');
        await shareDossier.closeDialog();

        // select list view
        await listView.selectListViewMode();
        // dismiss tooltip of list view
        await listView.click({ elem: libraryPage.getNavigationBar() });
        //wait for list view loaded
        await listViewAGGrid.waitForElementVisible(listViewAGGrid.getAGGridContainerContentHeight(), {
            timeout: 60000,
            msg: 'fail to load dossier/bot in list view',
        });

        // from info window in list view
        await listView.openInfoWindowFromListView(saas_share_dossier.name);
        await listView.clickShareFromIW();
        await shareDossier.waitForElementVisible(shareDossier.getShareDossierDialog());
        await shareDossier.closeDialog();
        await listView.clickCloseIcon();

        // from context menu in list view
        await listView.rightClickToOpenContextMenu({ name: saas_share_dossier.name });
        await libraryPage.clickDossierContextMenuItem('Share', 'Share Dashboard');
        await shareDossier.closeDialog();

        // From hover in list view
        await listView.openShareFromListView(saas_share_dossier.name);
        await shareDossier.closeDialog();

        // enter search page
        await librarySearch.openSearchBox();
        await librarySearch.search(saas_share_dossier.name);
        await librarySearch.pressEnter();
        await dossierPage.sleep(2000);

        // from info window in search page
        await fullSearch.openInfoWindow(saas_share_dossier.name);
        await infoWindow.shareDossier();
        await shareDossier.closeDialog();
        await searchPage.closeInfoWindow();
    });

    /**
     * check recipient hide share and manage access entry on bot
     *  1. check context menu in library page
     *  2. check info window in library page
     *  3. check hover in list view
     *  4. check context menu in list view
     *  5. check info window in list view
     *  6. check search page info window
     *  7. check bot no edit mode
     *  8. check consumption mode
     */
    it('[TC92949_7] Validate hide bot share and manage access entry for recipient in SAAS', async () => {
        // Prepare
        await resetRecipientUser(saas_share_bot);
        await prepareForSender(saas_share_bot);

        // Sender runs Bot in library
        await switchUser(SaaSSenderUser.credentials);
        await libraryPage.openDossier(saas_share_bot.name);
        await libraryPage.executeScript('window.pendo.onGuideDismissed();');
        await libraryPage.executeScript('window.pendo.onGuideDismissed();');

        // Sender click ‘Share bot’ in toolbar, show share dialog
        await dossierPage.openShareDropDown();
        await share.openShareDossierDialog();
        await shareDossier.waitForElementVisible(saasShareDialog.getShareButton());

        // Sender input recipient, then click ‘send’
        await saasShareDialog.inputRecipient(SaaSRecipientUser.credentials.username + ',');
        await saasShareDialog.saasShare();
        await goToLibraryPage();

        await switchUser(SaaSRecipientUser.credentials);

        // check bot share and manage access in consumption mode
        await libraryPage.openDossier(saas_share_bot.name);
        await libraryPage.executeScript('window.pendo.onGuideDismissed();');
        await libraryPage.executeScript('window.pendo.onGuideDismissed();');
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePage());
        since('share icon exist status in bot consumption mode should be #{expected}, instead we have #{actual}')
            .expect(await share.isShareIconPresent())
            .toBe(false);
        await goToLibraryPage();

        // From info window in library home
        await libraryPage.openDossierInfoWindow(saas_share_bot.name);
        since('share button exist status in library info window should be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.isEditIconPresent())
            .toBe(false);
        since('share button exist status in library info window should be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.isSharePresent())
            .toBe(false);
        since('manage access exist status in library info window should be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.isManageAccessPresent())
            .toBe(false);
        await searchPage.closeInfoWindow();

        // From context menu in library home
        await libraryPage.openDossierContextMenu(saas_share_bot.name);
        since('share button in library context menu exist status should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.isDossierContextMenuItemExisted('Share'))
            .toBe(false);
        since('manage access in library context menu exist status should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.isDossierContextMenuItemExisted('Manage Access'))
            .toBe(false);
        //dismiss context menu
        await listView.click({ elem: libraryPage.getNavigationBar() });

        // select list view
        await listView.selectListViewMode();
        // dismiss tooltip of list view
        await listView.click({ elem: libraryPage.getNavigationBar() });
        //wait for list view loaded
        await listViewAGGrid.waitForElementVisible(listViewAGGrid.getAGGridContainerContentHeight(), {
            timeout: 60000,
            msg: 'fail to load dossier/bot in list view',
        });

        // from info window in list view
        await listView.openInfoWindowFromListView(saas_share_bot.name);
        since('share button in list view info window exist status should be #{expected}, instead we have #{actual}')
            .expect(await listView.isShareIconPresentInInfoWindow())
            .toBe(false);
        since('manage access in list view info window exist status should be #{expected}, instead we have #{actual}')
            .expect(await listView.isManageAccessIconPresentInInfoWindow())
            .toBe(false);
        await listView.clickCloseIcon();

        // from context menu in list view
        await listView.rightClickToOpenContextMenu({ name: saas_share_bot.name });
        since('share button in list view context menu exist status should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.isDossierContextMenuItemExisted('Share'))
            .toBe(false);
        since('manage access in list view context menu exist status should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.isDossierContextMenuItemExisted('Manage Access'))
            .toBe(false);
        //dismiss context menu
        await listView.click({ elem: libraryPage.getNavigationBar() });

        // From hover in list view
        since('share when hover in list view exist status should be #{expected}, instead we have #{actual}')
            .expect(await listView.isDossierShareIconPresent(saas_share_bot.name))
            .toBe(false);

        // enter search page
        await librarySearch.openSearchBox();
        await librarySearch.search(saas_share_bot.name);
        await librarySearch.pressEnter();
        await dossierPage.sleep(2000);

        // from info window in search page
        await fullSearch.openInfoWindow(saas_share_bot.name);
        since('share button in search info window exist status should be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.isSharePresent())
            .toBe(false);
        since('manage access exist status should be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.isManageAccessPresent())
            .toBe(false);
        await searchPage.closeInfoWindow();
    });

    /**
     * check recipient hide share and manage access entry on dossier
     *  1. check context menu in library page
     *  2. check info window in library page
     *  3. check hover in list view
     *  4. check context menu in list view
     *  5. check info window in list view
     *  6. check search page info window
     */
    it('[TC92949_8] Validate hide dossier share and manage access entry for recipient in SAAS', async () => {
        // Prepare
        await resetRecipientUser(saas_share_dossier);
        await prepareForSender(saas_share_dossier);

        // Sender runs dossier in library
        await switchUser(SaaSSenderUser.credentials);
        await libraryPage.openDossier(saas_share_dossier.name);
        await dossierPage.waitForDossierLoading();
        await libraryPage.executeScript('window.pendo.onGuideDismissed();');
        await libraryPage.executeScript('window.pendo.onGuideDismissed();');

        // Sender click ‘Share dossier’ in toolbar, show share dialog
        await dossierPage.openShareDropDown();
        await share.openShareDossierDialog();
        await shareDossier.waitForElementVisible(saasShareDialog.getShareButton());

        // Sender input recipient, then click ‘send’
        await saasShareDialog.inputRecipient(SaaSRecipientUser.credentials.username + ',');
        await saasShareDialog.saasShare();
        await goToLibraryPage();

        await switchUser(SaaSRecipientUser.credentials);

        // check bot share and manage access in consumption mode
        await libraryPage.openDossier(saas_share_dossier.name);

        // check share icon of bookmark
        await dossierPage.waitForDossierLoading();
        await libraryPage.executeScript('window.pendo.onGuideDismissed();');
        await libraryPage.executeScript('window.pendo.onGuideDismissed();');
        await bookmark.waitForElementVisible(bookmark.getBookmarkIcon());
        await bookmark.openPanel();
        await since('share button on bookmark exist status should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.isSharedIconPresent('Bookmark 1'))
            .toBe(false);
        // dismiss bookmark panel
        await listView.click({ elem: libraryPage.getNavigationBar() });

        //  check share icon in share dialog
        await dossierPage.openShareDropDown();
        await since(
            'share button in dossier consumption mode exist status should be #{expected}, instead we have #{actual}'
        )
            .expect(await share.isShareDossierPresent())
            .toBe(false);
        await since(
            'manage access in dossier consumption mode exist status should be #{expected}, instead we have #{actual}'
        )
            .expect(await share.isManageAccessPresent())
            .toBe(false);
        await goToLibraryPage();

        // From info window in library home
        await libraryPage.openDossierInfoWindow(saas_share_dossier.name);
        await since('share button in library info window exist status should be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.isEditIconPresent())
            .toBe(false);
        await since('share button in library info window exist status should be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.isSharePresent())
            .toBe(false);
        await since(
            'manage access in library info window exist status should be #{expected}, instead we have #{actual}'
        )
            .expect(await infoWindow.isManageAccessPresent())
            .toBe(false);
        await searchPage.closeInfoWindow();

        // From context menu in library home
        await libraryPage.openDossierContextMenu(saas_share_dossier.name);
        await since(
            'manage access in library context menu exist status should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.isDossierContextMenuItemExisted('Manage Access'))
            .toBe(false);
        await libraryPage.clickDossierContextMenuItem('Share');
        await since(
            'share button in library context menu exist status should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.isSecondaryContextMenuItemExisted('Share Dashboard'))
            .toBe(false);
        //dismiss context menu
        await listView.click({ elem: libraryPage.getNavigationBar() });

        // select list view
        await listView.selectListViewMode();
        // dismiss tooltip of list view
        await listView.click({ elem: libraryPage.getNavigationBar() });
        //wait for list view loaded
        await listViewAGGrid.waitForElementVisible(listViewAGGrid.getAGGridContainerContentHeight(), {
            timeout: 60000,
            msg: 'fail to load dossier/bot in list view',
        });

        // from info window in list view
        await listView.openInfoWindowFromListView(saas_share_dossier.name);
        await since(
            'share button in list view info window exist status should be #{expected}, instead we have #{actual}'
        )
            .expect(await listView.isShareIconPresentInInfoWindow())
            .toBe(false);
        await since(
            'manage access in list view info window exist status should be #{expected}, instead we have #{actual}'
        )
            .expect(await listView.isMoreMenuIconPresentInInfoWindow())
            .toBe(false);
        await since(
            'manage access in list view info window exist status should be #{expected}, instead we have #{actual}'
        )
            .expect(await listView.isManageAccessIconPresentInInfoWindow())
            .toBe(false);
        await listView.clickCloseIcon();

        // from context menu in list view
        await listView.rightClickToOpenContextMenu({ name: saas_share_dossier.name });
        await since(
            'manage access in library context menu exist status should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.isDossierContextMenuItemExisted('Manage Access'))
            .toBe(false);
        await libraryPage.clickDossierContextMenuItem('Share');
        await since(
            'share button in library context menu exist status should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.isSecondaryContextMenuItemExisted('Share Dashboard'))
            .toBe(false);
        //dismiss context menu
        await listView.click({ elem: libraryPage.getNavigationBar() });

        // From hover in list view
        await since('share exist status when hover in list view should be #{expected}, instead we have #{actual}')
            .expect(await listView.isDossierShareIconPresent(saas_share_dossier.name))
            .toBe(false);

        // enter search page
        await librarySearch.openSearchBox();
        await librarySearch.search(saas_share_dossier.name);
        await librarySearch.pressEnter();
        await dossierPage.sleep(2000);

        // from info window in search page
        await fullSearch.openInfoWindow(saas_share_dossier.name);
        await since('share button in search info window exist status should be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.isSharePresent())
            .toBe(false);
        await since('manage access in search info window exist status should be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.isManageAccessPresent())
            .toBe(false);
        await searchPage.closeInfoWindow();
    });

    /**
     * check sender manage access entry on bot
     *  1. check context menu in library page
     *  2. check info window in library page
     *  3. check context menu in list view
     *  4. check info window in list view
     *  5. check search page info window
     *  6. check bot edit mode
     */
    it('[TC92949_9] Validate show bot manage access entry for owner in SAAS', async () => {
        // Prepare
        await prepareForSender(saas_share_bot);
        //login with sender user
        await login(SaaSSenderUser.credentials);

        // check bot share in edit mode
        await libraryPage.openDossierInfoWindow(saas_share_bot.name);
        await infoWindow.clickEditButton();
        await libraryPage.executeScript('window.pendo.onGuideDismissed();');
        await libraryPage.executeScript('window.pendo.onGuideDismissed();');
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendations());
        await dossierPage.openShareDropDown();
        await share.waitForElementVisible(share.getShareBotButton());
        await share.openManageAccessDialog();
        await saasManageAccess.closeDialog();

        //back to library
        await goToLibraryPage();

        // From info window in library home
        await libraryPage.openDossierInfoWindow(saas_share_bot.name);
        await infoWindow.openManageAccessDialog();
        await saasManageAccess.closeDialog();
        await searchPage.closeInfoWindow();

        // From context menu in library home
        await libraryPage.openDossierContextMenu(saas_share_bot.name);
        await libraryPage.clickDossierContextMenuItem('Manage Access');
        await saasManageAccess.closeDialog();

        // select list view
        await listView.selectListViewMode();
        // dismiss tooltip of list view
        await listView.click({ elem: libraryPage.getNavigationBar() });
        //wait for list view loaded
        await listViewAGGrid.waitForElementVisible(listViewAGGrid.getAGGridContainerContentHeight(), {
            timeout: 60000,
            msg: 'fail to load dossier/bot in list view',
        });

        // from info window in list view
        await listView.openInfoWindowFromListView(saas_share_bot.name);
        await listView.clickManageAccessFromIW();
        await shareDossier.waitForElementVisible(saasManageAccess.getSaasManageAccessDialog());
        await saasManageAccess.closeDialog();
        await listView.clickCloseIcon();

        // from context menu in list view
        await listView.rightClickToOpenContextMenu({ name: saas_share_bot.name });
        await libraryPage.clickDossierContextMenuItem('Manage Access');
        await saasManageAccess.closeDialog();

        // enter search page
        await librarySearch.openSearchBox();
        await librarySearch.search(saas_share_bot.name);
        await librarySearch.pressEnter();
        await dossierPage.sleep(2000);

        // from info window in search page
        await fullSearch.openInfoWindow(saas_share_bot.name);
        await infoWindow.openManageAccessDialog();
        await saasManageAccess.closeDialog();
        await searchPage.closeInfoWindow();
    });

    /**
     * check sender manage access entry on dossier
     *  1. check context menu in library page
     *  2. check info window in library page
     *  4. check context menu in list view
     *  5. check info window in list view
     *  6. check search page info window
     */
    it('[TC92949_10] Validate show dossier manage access entry for owner in SAAS', async () => {
        // Prepare
        await prepareForSender(saas_share_bot);
        //login with sender user
        await login(SaaSSenderUser.credentials);

        // From info window in library home
        await libraryPage.openDossierInfoWindow(saas_share_dossier.name);
        await infoWindow.openManageAccessDialog();
        await saasManageAccess.closeDialog();
        await searchPage.closeInfoWindow();

        // From context menu in library home
        await libraryPage.openDossierContextMenu(saas_share_dossier.name);
        await libraryPage.clickDossierContextMenuItem('Manage Access');
        await saasManageAccess.closeDialog();

        // select list view
        await listView.selectListViewMode();
        // dismiss tooltip of list view
        await listView.click({ elem: libraryPage.getNavigationBar() });
        //wait for list view loaded
        await listViewAGGrid.waitForElementVisible(listViewAGGrid.getAGGridContainerContentHeight(), {
            timeout: 60000,
            msg: 'fail to load dossier/bot in list view',
        });

        // from info window in list view
        await listView.openInfoWindowFromListView(saas_share_dossier.name);
        await listView.clickMoreMenuFromIW();
        await listView.clickManageAccessFromIW();
        await shareDossier.waitForElementVisible(saasManageAccess.getSaasManageAccessDialog());
        await saasManageAccess.closeDialog();
        await listView.clickCloseIcon();

        // from context menu in list view
        await listView.rightClickToOpenContextMenu({ name: saas_share_dossier.name });
        await libraryPage.clickDossierContextMenuItem('Manage Access');
        await saasManageAccess.closeDialog();

        // enter search page
        await librarySearch.openSearchBox();
        await librarySearch.search(saas_share_dossier.name);
        await librarySearch.pressEnter();
        await dossierPage.sleep(2000);

        // from info window in search page
        await fullSearch.openInfoWindow(saas_share_dossier.name);
        await infoWindow.openManageAccessDialog();
        await saasManageAccess.closeDialog();
        await searchPage.closeInfoWindow();
    });

    it('[TC92950_1] execute bot by share link when bot id is invalid', async () => {
        //recipient open bot share link, however owner expires
        await login(SaaSRecipientUser.credentials);
        await openShareLink(saas_expire_share_bot.project.id, invalid_bot_id);
        await loginPage.waitForElementVisible(loginPage.getErrorDetailsButton());
        await libraryPage.viewErrorDetails();
        await since('Error details is shown as #{expected}, instead we have #{actual}')
            .expect(await libraryPage.errorDetails())
            .toContain(`The object does not exist in the metadata.`);
    });

    it('[TC92950_2] execute dashboard and bot by share link when creator expires', async () => {
        //recipient open bot share link, however owner expires
        await login(SaaSRecipientUser.credentials);
        await openShareLink(saas_expire_share_bot.project.id, saas_expire_share_bot.id);
        await loginPage.waitForElementVisible(loginPage.getErrorDetailsButton());
        await libraryPage.viewErrorDetails();
        await since('Error details is shown as #{expected}, instead we have #{actual}')
            .expect(await libraryPage.errorDetails())
            .toContain(`The bot is currently inactive because its owner's account has expired.`);

        //recipient open dossier share link, however owner expires
        await openShareLink(saas_expire_share_dossier.project.id, saas_expire_share_dossier.id);
        await loginPage.waitForElementVisible(loginPage.getErrorDetailsButton());
        await libraryPage.viewErrorDetails();
        await since('Error details is shown as #{expected}, instead we have #{actual}')
            .expect(await libraryPage.errorDetails())
            .toContain(`The dashboard is currently inactive because its owner's account has expired.`);

        //recipient open dossier bookmark share link, however owner expires
        await openShareLink(
            saas_expire_share_dossier.project.id,
            saas_expire_share_dossier.id,
            saas_expire_share_dossier.bookmarkIds
        );
        await loginPage.waitForElementVisible(loginPage.getErrorDetailsButton());
        await libraryPage.viewErrorDetails();
        await since('Error details is shown as #{expected}, instead we have #{actual}')
            .expect(await libraryPage.errorDetails())
            .toContain(`The dashboard is currently inactive because its owner's account has expired.`);
    });

    it('[TC92950_3] verify error when user share over maximum times', async () => {
        // enable share times limitation, set maximum share times is 0 times
        const objectExtPropsPayload = getObjectExtPropsPayload(0);
        await setObjectExtendedProperties({
            credentials: adminCredentials,
            object: config_object,
            objectExtPropsPayload: objectExtPropsPayload,
        });

        //login with sender user
        await login(SaaSSenderUser.credentials);
        await libraryPage.openDossierContextMenu(saas_share_bot.name);
        await libraryPage.clickDossierContextMenuItem('Share', 'Share Bot');
        await saasShareDialog.waitForElementVisible(saasShareDialog.getShareButton());

        // Sender input recipient, then click ‘send’
        await saasShareDialog.inputRecipient(SaaSSenderUser.credentials.username);
        await shareDossier.addMessage('E2E workflow test for saas share bot');
        await saasShareDialog.saasShare(false);

        // wait for error dialog
        await saasShareDialog.waitForElementVisible(saasShareDialog.getShareErrorBox());
        // check error msg
        await since('Share error box title is shown as #{expected}, instead we have #{actual}')
            .expect(await saasShareDialog.getShareErrorTitle())
            .toContain(`Email Limit Exceeded`);
        await since('Share error box message is shown as #{expected}, instead we have #{actual}')
            .expect(await saasShareDialog.getShareErrorMsg())
            .toContain(`You have reached the maximum number of emails for sharing.`);

        // close share error box
        await saasShareDialog.closeShareErrorBox();
        await saasShareDialog.waitForElementInvisible(saasShareDialog.getShareErrorBox());
        // close share dialog
        await saasShareDialog.closeDialog();
        await saasShareDialog.waitForElementInvisible(saasShareDialog.getShareDossierDialog());

        // diable share times limitation
        await setObjectExtendedProperties({
            credentials: adminCredentials,
            object: config_object,
            objectExtPropsPayload: defaultObjExtPropsPayload,
        });
    });

    it('[TC92950_4] verify correct recipient case', async () => {
        // Sender runs Bot in library
        await login(SaaSSenderUser.credentials);
        await libraryPage.openDossierContextMenu(saas_share_bot.name);
        await libraryPage.clickDossierContextMenuItem('Share', 'Share Bot');
        await saasShareDialog.waitForElementVisible(saasShareDialog.getShareButton());

        // Sender input recipient, then click ‘send’
        await saasShareDialog.inputRecipient('test1@test.com;test2@test.com;test3@test.com');
        await browser.keys('Enter');
        await shareDossier.hideTimeAndName();
        await takeScreenshotByElement(
            await shareDossier.getShareDossierDialog(),
            'TC92950_4',
            'Recipient check: no valid seperator',
            { tolerance: 0.1 }
        );
        await shareDossier.showTimeAndName();

        await saasShareDialog.inputRecipient('test1@test.com,test2@test.com;test3@test.com', true);
        await browser.keys('Enter');
        await shareDossier.hideTimeAndName();
        await takeScreenshotByElement(
            await shareDossier.getShareDossierDialog(),
            'TC92950_4',
            'Recipient check: 1st seperator is valid one',
            { tolerance: 0.1 }
        );
        await shareDossier.showTimeAndName();
        await saasShareDialog.removeRecipient('test1@test.com');

        await saasShareDialog.pasteRecipient('test1@test.com;test2@test.com,test3@test.com', true);
        await browser.keys('Enter');
        await shareDossier.hideTimeAndName();
        await takeScreenshotByElement(
            await shareDossier.getShareDossierDialog(),
            'TC92950_4',
            'Recipient check: 2nd seperator is valid one',
            { tolerance: 0.1 }
        );
        await shareDossier.showTimeAndName();

        await saasShareDialog.doubleClickRecipient('test1@test.com;test2@test.com');
        await saasShareDialog.pasteRecipient('test1@test.com,test2@test.com,test3@test.com', true);
        await browser.keys('Enter');
        await shareDossier.hideTimeAndName();
        await takeScreenshotByElement(
            await shareDossier.getShareDossierDialog(),
            'TC92950_4',
            'Recipient check: full valid seperators',
            { tolerance: 0.1 }
        );
        await shareDossier.showTimeAndName();
        await shareDossier.closeDialog();
    });
});
