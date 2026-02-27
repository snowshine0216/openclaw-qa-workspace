/* eslint-disable @typescript-eslint/no-floating-promises */
import resetObjectAcl from '../../../api/manageAccess/resetObjectAcl.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import generateSharedLink from '../../../api/generateSharedLink.js';

describe('ShareBot', () => {
    const project = {
        id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
        name: 'MicroStrategy Tutorial',
    };

    const senderUser = {
        credentials: {
            username: 'Auto_ShareBot_Sender',
            password: '',
        },
        id: 'CDA73A2E4C02ADC1AF40CC9BAE9D3020',
        firstName: 'Sender',
        fullName: 'Sender for share bot',
    };

    const recipientUser = {
        credentials: {
            username: 'Auto_ShareBot_Recipient',
            password: '',
        },
        id: 'B28D673B4254F2F25165FDAB9209EB2E',
        firstName: 'Recipient',
        fullName: 'Recipient for share bot',
    };

    const userWithNoRunPrivilege = {
        credentials: {
            username: 'Auto_ShareBot_NoRunPrivilege',
            password: '',
        },
        id: 'E3CB58B941735E731CD524B84D695307',
        firstName: 'NoRunPrivilege',
        fullName: 'NoRunPrivilege for share bot',
    };

    const userWithNoEditPrivilege = {
        credentials: {
            username: 'Auto_ShareBot_NoEditPrivilege',
            password: '',
        },
        id: '27AA39E944E13ABF81F3C2956E004F09',
        firstName: 'NoEditPrivilege',
        fullName: 'NoEditPrivilege for share bot',
    };

    const guestUser = {
        credentials: {
            username: 'Guest',
            password: '',
        },
    };

    const botInLibrary = {
        id: 'B62703FA17452563D0C007A8CB70F9CA',
        name: 'Share Bot - Bot In Library',
        project: project,
        sharedLink: null,
    };

    const botNotInLibrary = {
        id: 'FA1F728001495855819481892733702D',
        name: 'Share Bot - Bot Not In Library',
        project: project,
    };

    const botSetInactive = {
        id: '853DDD0F714A1FD724B2DA8A1F29B73B',
        name: 'Share Bot - Bot Set Inactive',
        project: project,
    };

    const botForPublic = {
        id: 'DC6E34F22E474D1D0E34939873EE91E5',
        name: 'Share Bot - Bot for Public',
        project: project,
        sharedLink: null,
    };

    const dataset = {
        id: '5B7814077E47526260C9118F1FD9DFF8',
        name: 'Share Bot - Dataset',
        project: project,
    };

    const customApp_normal = {
        id: '7E7A10CC54F247AFABFB10443C4ADD5F',
        name: 'AUTO_ShareBot',
    };

    const customApp_customizedEmail = {
        id: '57AC00E762124350AC1EC5CF8AAFB12D',
        name: 'AUTO_ShareBot_CustomizeEmail',
    };

    const customApp_DisableShare = {
        id: '821DE8A3704C44A69CF803F5541297E1',
        name: 'AUTO_ShareBot_DisableShare',
    };

    const customApp_DisableShareBot = {
        id: '2A27CA3A4490461B9EBD0B2A9B5614E2',
        name: 'AUTO_ShareBot_DisableShareBot',
    };

    const customApp_DisableToolbar = {
        id: '98A09AE1BE984570B5245E1AB677F421',
        name: 'AUTO_ShareBot_DisableToolbar',
    };

    const defaultAcl = [
        {
            value: 'Full Control',
            id: senderUser.id,
            name: senderUser.credentials.username,
        },
        {
            value: 'Can View',
            id: userWithNoRunPrivilege.id,
            name: userWithNoRunPrivilege.credentials.username,
        },
        {
            value: 'Can View',
            id: userWithNoEditPrivilege.id,
            name: userWithNoEditPrivilege.credentials.username,
        },
    ];

    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let {
        loginPage,
        libraryPage,
        dossierPage,
        libraryAuthoringPage,
        manageAccess,
        infoWindow,
        shareDossier,
        share,
        contentDiscovery,
        sidebar,
        listView,
        librarySearch,
        fullSearch,
        email,
        notification,
        onboardingTutorial,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);

        // Generate the shared link for these bot objects
        botInLibrary.sharedLink = await generateSharedLink({
            credentials: senderUser.credentials,
            dossier: botInLibrary,
        });
        botForPublic.sharedLink = await generateSharedLink({
            credentials: senderUser.credentials,
            dossier: botForPublic,
        });
    });

    beforeEach(async () => {
        if (!(await loginPage.isLoginPageDisplayed())) {
            await browser.url(new URL('auth/ui/loginPage', browser.options.baseUrl).toString(), 100000);
        }
        await libraryPage.executeScript('window.localStorage.clear();');
    });

    afterEach(async () => {
        await libraryPage.openUserAccountMenu();
        await libraryPage.logout();
    });

    /**
     * Clear recipient's notifications and remove dossiers from library
     */
    async function resetRecipientUser() {
        await libraryPage.switchUser(recipientUser.credentials);
        await notification.openPanelAndWaitListMsg();
        await notification.clearAllMsgs();
        await notification.closePanel();
        await libraryPage.removeDossierFromLibrary(recipientUser.credentials, botInLibrary);
    }

    /**
     * Clear email message box
     */
    async function resetRecipientEmail() {
        await email.clearMsgBox();
    }

    /**
     * Reset the object ACL, login sender and open custom app
     */
    async function prepareForSender(custom_app = customApp_normal) {
        // Reset ACL
        await resetObjectAcl({ credentials: senderUser.credentials, object: botInLibrary, acl: defaultAcl });
        await resetObjectAcl({ credentials: senderUser.credentials, object: botNotInLibrary, acl: defaultAcl });
        await resetObjectAcl({ credentials: senderUser.credentials, object: botSetInactive, acl: defaultAcl });

        // Login sender and open custom app
        await libraryPage.switchUser(senderUser.credentials);
        await libraryPage.openCustomAppById({ id: custom_app.id });
    }

    /**
     * 1. Sender runs Bot in library
     * 2. Click ‘Share bot’ in toolbar, show share dialog
     * 3. Select recipient, modify ACL, then click ‘send’
     * 4. Recipient receives a new e-mail, then click ‘View in Browser’
     * 5. Recipient receives a new notification, then click the notification
     * 6. Recipient adds bot into library
     */
    it('[TC91691] Validate E2E workflow for Share Bot', async () => {
        const inviteContent = `${senderUser.fullName} shared ${botInLibrary.name} with you.`;
        const inviteMessage = 'E2E workflow test for share bot';

        // Prepare
        await resetRecipientUser();
        await resetRecipientEmail();
        await prepareForSender();

        // Sender runs Bot in library
        await libraryPage.openDossier(botInLibrary.name);
        await takeScreenshotByElement(await dossierPage.getNavigationBar(), 'TC91691', 'Share bot: toolbar', {
            tolerance: 0.1,
        });

        // Click ‘Share bot’ in toolbar, show share dialog
        await dossierPage.openShareDropDown();
        await share.openShareDossierDialog();
        await shareDossier.sleep(3000); // Wait for the cover to be loaded
        await shareDossier.hideTimeAndName();
        await shareDossier.hideSharedUrl();
        await takeScreenshotByElement(
            await shareDossier.getShareDossierDialog(),
            'TC91691',
            'Share bot: share dialog',
            { tolerance: 0.1 }
        );
        await shareDossier.showTimeAndName();

        // Select recipient, modify ACL, then click ‘send’
        await shareDossier.searchRecipient(recipientUser.credentials.username);
        await shareDossier.selectRecipients([recipientUser.credentials.username]);
        await shareDossier.openACL();
        await shareDossier.changeACLTo('Can View');
        await shareDossier.addMessage(inviteMessage);
        await shareDossier.shareDossier();
        await shareDossier.sleep(5000); // Wait for the email to be sent
        await dossierPage.goToLibrary();
        await libraryPage.switchUser(recipientUser.credentials);

        // Recipient receives a new e-mail, then click ‘View in Browser’
        await since('Invite content in email should be "#{expected}", instead we have "#{actual}"')
            .expect(await email.getInviteContent(recipientUser.firstName))
            .toEqual(inviteContent);
        await since('Invite message in email should be "#{expected}", instead we have "#{actual}"')
            .expect(await email.getInviteMessage(recipientUser.firstName))
            .toEqual('Message:  ' + inviteMessage);
        await email.openViewInBrowserLink(recipientUser.firstName);
        await since('Add to library button display should be "#{expected}", instead we have "#{actual}"')
            .expect(await dossierPage.isAddToLibraryDisplayed())
            .toBe(true);
        await dossierPage.goToLibrary();
        await since(
            'Back to library page, target bot in my library should be "#{expected}", instead we have "#{actual}"'
        )
            .expect(await libraryPage.isDossierInLibrary(botInLibrary))
            .toBe(false);

        // Recipient receives a new notification, then click the notification
        await notification.openPanel();
        await since('Invite content in notification should be "#{expected}", instead we have "#{actual}"')
            .expect(await notification.getNotificationMsgByIndex(0).getText())
            .toEqual(inviteContent);
        await since('Invite message in notification should be "#{expected}", instead we have "#{actual}"')
            .expect(await notification.getSharedMessageText(0))
            .toEqual(inviteMessage);
        await notification.openMsgByIndex(0);

        // Recipient adds bot into library
        await dossierPage.addToLibrary();
        await since('Add to library should be successful without error')
            .expect(await dossierPage.isErrorPresent())
            .toBe(false);
        await dossierPage.goToLibrary();
        await since(
            'Back to library page, target bot in my library should be "#{expected}", instead we have "#{actual}"'
        )
            .expect(await libraryPage.isDossierInLibrary(botInLibrary))
            .toBe(true);
    });

    it('[TC91692_01] Validate open share bot dialog from different entrances', async () => {
        // Prepare
        await prepareForSender();

        // From info window in library home
        await libraryPage.openDossierInfoWindow(botInLibrary.name);
        await infoWindow.shareDossier();
        await since(
            'Open share bot dialog from info window, the title of share dialog should be "#{expected}", instead we have "#{actual}"'
        )
            .expect(await shareDossier.getShareDialogTitle())
            .toEqual('Share Bot');
        await takeScreenshotByElement(
            await shareDossier.getDossierCoverImage(),
            'TC91692',
            'Share bot: cover image from info window',
            { tolerance: 0.1 }
        );
        await shareDossier.closeDialog();

        // From context menu in library home
        await libraryPage.openDossierContextMenu(botInLibrary.name);
        await libraryPage.clickDossierContextMenuItem('Share', 'Share Bot');
        await since(
            'Open share bot dialog from context menu, the title of share dialog should be "#{expected}", instead we have "#{actual}"'
        )
            .expect(await shareDossier.getShareDialogTitle())
            .toEqual('Share Bot');
        await takeScreenshotByElement(
            await shareDossier.getDossierCoverImage(),
            'TC91692',
            'Share bot: cover image from context menu',
            { tolerance: 0.1 }
        );
        await shareDossier.closeDialog();

        // From Content Discovery
        await libraryPage.openSidebarOnly();
        await sidebar.openContentDiscovery();
        await contentDiscovery.openProjectList();
        await contentDiscovery.selectProject(project.name);
        await contentDiscovery.openFolderByPath(['Shared Reports', '_Automation_', 'Library - Share Bot']);
        await listView.openShareFromListView(botInLibrary.name);
        await since(
            'Open share bot dialog from Content Discovery (bot in library), the title of share dialog should be "#{expected}", instead we have "#{actual}"'
        )
            .expect(await shareDossier.getShareDialogTitle())
            .toEqual('Share Bot');
        await takeScreenshotByElement(
            await shareDossier.getDossierCoverImage(),
            'TC91692',
            'Share bot: cover image from Content Discovery (bot in library)',
            { tolerance: 0.1 }
        );
        await shareDossier.closeDialog();

        await listView.openShareFromListView(botNotInLibrary.name);
        await since(
            'Open share bot dialog from Content Discovery (bot not in library), the title of share dialog should be "#{expected}", instead we have "#{actual}"'
        )
            .expect(await shareDossier.getShareDialogTitle())
            .toEqual('Share Bot');
        await takeScreenshotByElement(
            await shareDossier.getDossierCoverImage(),
            'TC91692',
            'Share bot: cover image from Content Discovery (bot not in library)',
            { tolerance: 0.1 }
        );
        await shareDossier.closeDialog();

        // From Global Search
        await librarySearch.openSearchBox();
        await librarySearch.search(botInLibrary.name);
        await librarySearch.pressEnter();
        await fullSearch.clickAllTab();
        await fullSearch.waitForSearchLoading();

        await fullSearch.openInfoWindow(botInLibrary.name);
        await infoWindow.shareDossier();
        await since(
            'Open share bot dialog from Global Search (bot in library, the title of share dialog should be "#{expected}", instead we have "#{actual}"'
        )
            .expect(await shareDossier.getShareDialogTitle())
            .toEqual('Share Bot');
        await takeScreenshotByElement(
            await shareDossier.getDossierCoverImage(),
            'TC91692',
            'Share bot: cover image from Global Search (bot in library)',
            { tolerance: 0.1 }
        );
        await shareDossier.closeDialog();

        await fullSearch.openInfoWindow(botNotInLibrary.name);
        await infoWindow.shareDossier();
        await since(
            'Open share bot dialog from Global Search (bot not in library, the title of share dialog should be "#{expected}", instead we have "#{actual}"'
        )
            .expect(await shareDossier.getShareDialogTitle())
            .toEqual('Share Bot');
        await takeScreenshotByElement(
            await shareDossier.getDossierCoverImage(),
            'TC91692',
            'Share bot: cover image from Global Search (bot not in library)',
            { tolerance: 0.1 }
        );
        await shareDossier.closeDialog();
        await fullSearch.backToLibrary();
    });

    it('[TC91692_02] Validate sender shares in bot edit mode', async () => {
        const inviteContent = `${senderUser.fullName} shared ${botInLibrary.name} with you.`;
        const inviteMessage = '';

        // Prepare
        await resetRecipientEmail();
        await prepareForSender();

        // Run bot in library and click edit button
        await libraryPage.openDossier(botInLibrary.name);
        await libraryAuthoringPage.editDossierFromLibrary();

        // Click ‘Share bot’ in toolbar, show share dialog
        await dossierPage.openShareDropDown();
        await share.openShareDossierDialog();

        // Select recipient, modify ACL, then click ‘send’
        await shareDossier.searchRecipient(recipientUser.credentials.username);
        await shareDossier.selectRecipients([recipientUser.credentials.username]);
        await shareDossier.openACL();
        await shareDossier.changeACLTo('Can Modify');
        await shareDossier.shareDossier();

        // Recipient receives a new e-mail
        await since('Invite content in email should be "#{expected}", instead we have "#{actual}"')
            .expect(await email.getInviteContent(recipientUser.firstName))
            .toEqual(inviteContent);
        await since('Invite message in email should be empty, instead we have "#{actual}"')
            .expect(await email.getInviteMessage(recipientUser.firstName))
            .toEqual(inviteMessage);
        await since('Browser link in email should contain "#{expected}", instead we have "#{actual}"')
            .expect(await email.getBrowserLink(recipientUser.firstName))
            .toContain(customApp_normal.id + '/' + project.id + '/' + botInLibrary.id);

        await dossierPage.goToLibrary();
    });

    it('[TC91692_03] Validate sender shares outside bot', async () => {
        const inviteContent = `${senderUser.fullName} shared ${botInLibrary.name} with you.`;
        const inviteMessage = 'Acceptance test: share outside bot';

        // Prepare
        await resetRecipientEmail();
        await prepareForSender();

        // Open context menu of bot in library, click share
        await libraryPage.openDossierContextMenu(botInLibrary.name);
        await libraryPage.clickDossierContextMenuItem('Share', 'Share Bot');

        // Select recipient, modify ACL, then click ‘send’
        await shareDossier.searchRecipient(recipientUser.credentials.username);
        await shareDossier.selectRecipients([recipientUser.credentials.username]);
        await shareDossier.openACL();
        await shareDossier.changeACLTo('Full Control');
        await shareDossier.addMessage(inviteMessage);
        await shareDossier.shareDossier();

        // Recipient receives a new e-mail
        await since('Invite content in email should be "#{expected}", instead we have "#{actual}"')
            .expect(await email.getInviteContent(recipientUser.firstName))
            .toEqual(inviteContent);
        await since('Invite message in email should be "#{expected}", instead we have "#{actual}"')
            .expect(await email.getInviteMessage(recipientUser.firstName))
            .toEqual('Message:  ' + inviteMessage);
        await since('Browser link in email should contain "#{expected}", instead we have "#{actual}"')
            .expect(await email.getBrowserLink(recipientUser.firstName))
            .toContain(customApp_normal.id + '/' + project.id + '/' + botInLibrary.id);
    });

    it('[TC91692_04] Validate execute bot from different entrances', async () => {
        // Prepare
        await prepareForSender();

        // From shared link
        await libraryPage.switchToNewWindowWithUrl(botInLibrary.sharedLink);
        await dossierPage.waitForItemLoading();
        await since('Run bot from shared link, the toolbar should show')
            .expect(await dossierPage.isNavigationBarPresent())
            .toBe(true);
        await since('Run bot from shared link should be successful')
            .expect(await dossierPage.isErrorPresent())
            .toBe(false);
        await dossierPage.closeTab(1);

        // From global search
        await librarySearch.openSearchBox();
        await librarySearch.search(botNotInLibrary.name);
        await librarySearch.pressEnter();
        await fullSearch.clickAllTab();
        await fullSearch.waitForSearchLoading();
        await fullSearch.openDossierFromSearchResults(botNotInLibrary.name);
        await since('Run bot from global search, the toolbar should show')
            .expect(await dossierPage.isNavigationBarPresent())
            .toBe(true);
        await since('Run bot from global search should be successful')
            .expect(await dossierPage.isErrorPresent())
            .toBe(false);
        await dossierPage.goToLibrary();

        // From content discovery
        await libraryPage.openSidebarOnly();
        await sidebar.openContentDiscovery();
        await contentDiscovery.openProjectList();
        await contentDiscovery.selectProject(project.name);
        await contentDiscovery.openFolderByPath(['Shared Reports', '_Automation_', 'Library - Share Bot']);
        await listView.openDossier(botNotInLibrary.name);
        await since('Run bot from content discovery, the toolbar should show')
            .expect(await dossierPage.isNavigationBarPresent())
            .toBe(true);
        await since('Run bot from content discovery should be successful')
            .expect(await dossierPage.isErrorPresent())
            .toBe(false);
        await dossierPage.goToLibrary();
    });

    it('[TC91692_05] Validate manage access for bot', async () => {
        // Prepare
        await prepareForSender();

        // In bot consumption mode
        await libraryPage.openDossier(botInLibrary.name);
        await dossierPage.openShareDropDown();
        await share.openManageAccessDialog();
        await manageAccess.waitForManageAccessLoading();
        await since(
            `Before manage access in consumption mode, the ACL of ${recipientUser.fullName} should be #{expected}, while we get #{actual}`
        )
            .expect(await manageAccess.getUserCurrentACL(recipientUser.fullName))
            .toBe('None');
        await manageAccess.addACL([recipientUser.fullName], [], 'Can View');
        await manageAccess.saveManageAccessChange();
        await share.closeSharePanel();
        await dossierPage.openShareDropDown();
        await share.openManageAccessDialog();
        await manageAccess.waitForManageAccessLoading();
        await since(
            `After manage access in consumption mode, the ACL of ${recipientUser.fullName} should be #{expected}, while we get #{actual}`
        )
            .expect(await manageAccess.getUserCurrentACL(recipientUser.fullName))
            .toBe('Can View');
        await manageAccess.cancelManageAccessChange();
        await dossierPage.goToLibrary();

        // In bot edit mode
        await libraryPage.openDossierInfoWindow(botInLibrary.name);
        await infoWindow.clickEditButton();
        await dossierPage.openShareDropDown();
        await share.openManageAccessDialog();
        await manageAccess.waitForManageAccessLoading();
        await since(
            `Before manage access in edit mode, the ACL of ${recipientUser.fullName} should be #{expected}, while we get #{actual}`
        )
            .expect(await manageAccess.getUserCurrentACL(recipientUser.fullName))
            .toBe('Can View');
        await manageAccess.removeACL(recipientUser.fullName);
        await manageAccess.saveManageAccessChange();
        await share.closeSharePanel();
        await dossierPage.openShareDropDown();
        await share.openManageAccessDialog();
        await manageAccess.waitForManageAccessLoading();
        await since(
            `After manage access in edit mode, the ACL of ${recipientUser.fullName} should be #{expected}, while we get #{actual}`
        )
            .expect(await manageAccess.getUserCurrentACL(recipientUser.fullName))
            .toBe('None');
        await manageAccess.cancelManageAccessChange();
        await dossierPage.goToLibrary();
    });

    it('[TC91692_06] Validate email content for share bot', async () => {
        const inviteContent = `Hi, ${recipientUser.firstName}! SenderName is ${senderUser.fullName}, BotName is ${botInLibrary.name}!`;
        const inviteMessage = 'Acceptance test: customized email template';

        // Reset recipient's email
        await resetRecipientEmail();
        await prepareForSender();

        // Open the custom app which set customized email template
        await libraryPage.openCustomAppById({ id: customApp_customizedEmail.id });

        // Share to recipient from info window
        await libraryPage.openDossierInfoWindow(botInLibrary.name);
        await infoWindow.shareDossier();
        await shareDossier.searchRecipient(recipientUser.credentials.username);
        await shareDossier.selectRecipients([recipientUser.credentials.username]);
        await shareDossier.addMessage(inviteMessage);
        await shareDossier.shareDossier();

        // Recipient receives a new e-mail
        await since('Invite content in email should be "#{expected}", instead we have "#{actual}"')
            .expect(await email.getInviteContent(recipientUser.firstName))
            .toEqual(inviteContent);
        await since('Invite message in email should be "#{expected}", instead we have "#{actual}"')
            .expect(await email.getInviteMessage(recipientUser.firstName))
            .toEqual('Message:  ' + inviteMessage);
        await since('Browser link in email should contain "#{expected}", instead we have "#{actual}"')
            .expect(await email.getBrowserLink(recipientUser.firstName))
            .toContain(customApp_customizedEmail.id + '/' + project.id + '/' + botInLibrary.id);
    });

    it('[TC91692_07] Validate the share bot entrance should be disabled in some scenarios', async () => {
        // Prepare
        await prepareForSender();

        // If bot is inactive, the 'share bot' button should be disabled in these entrances
        // info window
        await libraryPage.openDossierInfoWindow(botSetInactive.name);
        await since('The share bot button in the info window of inactive bot should be disabled')
            .expect(await infoWindow.isShareDisabled())
            .toBe(true);

        // context menu
        await libraryPage.openDossierContextMenu(botSetInactive.name);
        await libraryPage.clickDossierContextMenuItem('Share');
        await since('The share bot button in the context menu of inactive bot should be should be disabled')
            .expect(await libraryPage.isSecondaryContextMenuItemDisabled('Share Bot'))
            .toBe(true);

        // search
        await librarySearch.openSearchBox();
        await librarySearch.search(botSetInactive.name);
        await librarySearch.pressEnter();
        await fullSearch.clickAllTab();
        await fullSearch.waitForSearchLoading();
        await fullSearch.openInfoWindow(botSetInactive.name);
        await since('The share bot button in the global search result of inactive bot should be should be disabled')
            .expect(await infoWindow.isShareDisabled())
            .toBe(true);
        await fullSearch.backToLibrary();

        // content discovery
        await libraryPage.openSidebarOnly();
        await sidebar.openContentDiscovery();
        await contentDiscovery.openProjectList();
        await contentDiscovery.selectProject(project.name);
        await contentDiscovery.openFolderByPath(['Shared Reports', '_Automation_', 'Library - Share Bot']);
        await since('The share bot button in the content discovery of inactive bot should be should be disabled')
            .expect(await listView.isDossierShareIconDisabled(botSetInactive.name))
            .toBe(true);
        await sidebar.clickAllSection();

        // During create a new bot, the share button should be disabled
        await libraryAuthoringPage.createBotWithDataset({ project: project.name, dataset: dataset.name });
        await since('The share bot button in the toolbar during create bot should be disabled')
            .expect(await share.isShareIconDisabled())
            .toBe(true);
        await dossierPage.goToLibrary();
    });

    it('[TC91693_01] Validate custom app that disable share', async () => {
        // Prepare
        await prepareForSender(customApp_DisableShare);

        // From info window in library home
        await libraryPage.openDossierInfoWindow(botInLibrary.name);
        await since('In custom app that disable share, the share button in info window should be hidden')
            .expect(await infoWindow.isSharePresent())
            .toBe(false);

        // From context menu in library home
        await libraryPage.openDossierContextMenu(botInLibrary.name);
        await since('In custom app that disable share, the share button in context menu should be hidden')
            .expect(await libraryPage.isDossierContextMenuItemExisted('Share'))
            .toBe(false);

        // From Content Discovery
        await libraryPage.openSidebarOnly();
        await sidebar.openContentDiscovery();
        await contentDiscovery.openProjectList();
        await contentDiscovery.selectProject(project.name);
        await contentDiscovery.openFolderByPath(['Shared Reports', '_Automation_', 'Library - Share Bot']);
        await since('In custom app that disable share, the share button in Content Discovery should be hidden')
            .expect(await listView.isDossierShareIconPresent(botNotInLibrary.name))
            .toBe(false);
        await sidebar.openAllSectionList();

        // From Global Search
        await librarySearch.openSearchBox();
        await librarySearch.search(botNotInLibrary.name);
        await librarySearch.pressEnter();
        await fullSearch.clickAllTab();
        await fullSearch.waitForSearchLoading();
        await fullSearch.openInfoWindow(botNotInLibrary.name);
        await since('In custom app that disable share, the share button in global search should be hidden')
            .expect(await infoWindow.isSharePresent())
            .toBe(false);
        await fullSearch.backToLibrary();

        // From consumption mode
        await libraryPage.openDossier(botInLibrary.name);
        await since('In custom app that disable share, the share button in consumption mode should be hidden')
            .expect(await share.isShareIconPresent())
            .toBe(false);

        // From edit mode
        await libraryAuthoringPage.editDossierFromLibrary();
        await since('In custom app that disable share, the share button in edit mode should be hidden')
            .expect(await share.isShareIconPresent())
            .toBe(false);

        await libraryPage.openCustomAppById({ id: customApp_normal.id });
    });

    it('[TC91693_02] Validate custom app that disable share bot', async () => {
        // Prepare
        await prepareForSender(customApp_DisableShareBot);

        // From info window in library home
        await libraryPage.openDossierInfoWindow(botInLibrary.name);
        await since('In custom app that disable share bot, the share button in info window should be hidden')
            .expect(await infoWindow.isSharePresent())
            .toBe(false);

        // From context menu in library home
        await libraryPage.openDossierContextMenu(botInLibrary.name);
        await libraryPage.clickDossierContextMenuItem('Share');
        await since('In custom app that disable share bot, the share bot button in context menu should be hidden')
            .expect(await libraryPage.isSecondaryContextMenuItemExisted('Share Bot'))
            .toBe(false);

        // From Content Discovery
        await libraryPage.openSidebarOnly();
        await sidebar.openContentDiscovery();
        await contentDiscovery.openProjectList();
        await contentDiscovery.selectProject(project.name);
        await contentDiscovery.openFolderByPath(['Shared Reports', '_Automation_', 'Library - Share Bot']);
        await since('In custom app that disable share bot, the share button in Content Discovery should be hidden')
            .expect(await listView.isDossierShareIconPresent(botNotInLibrary.name))
            .toBe(false);
        await sidebar.openAllSectionList();

        // From Global Search
        await librarySearch.openSearchBox();
        await librarySearch.search(botNotInLibrary.name);
        await librarySearch.pressEnter();
        await fullSearch.clickAllTab();
        await fullSearch.waitForSearchLoading();
        await fullSearch.openInfoWindow(botNotInLibrary.name);
        await since('In custom app that disable share bot, the share button in global search should be hidden')
            .expect(await infoWindow.isSharePresent())
            .toBe(false);
        await fullSearch.backToLibrary();

        // From consumption mode
        await libraryPage.openDossier(botInLibrary.name);
        await dossierPage.openShareDropDown();
        await since('In custom app that disable share bot, the share bot button in consumption mode should be hidden')
            .expect(await share.isSharePanelItemExisted('Share Bot'))
            .toBe(false);
        await dossierPage.closeShareDropDown();

        // From edit mode
        await libraryAuthoringPage.editDossierFromLibrary();
        await dossierPage.openShareDropDown();
        await since('In custom app that disable share bot, the share bot button in edit mode should be hidden')
            .expect(await share.isSharePanelItemExisted('Share Bot'))
            .toBe(false);
        await dossierPage.closeShareDropDown();

        await libraryPage.openCustomAppById({ id: customApp_normal.id });
    });

    it('[TC91693_03] Validate custom app that disable toolbar', async () => {
        // Prepare
        await prepareForSender(customApp_DisableToolbar);

        // From info window in library home
        await libraryPage.openDossierInfoWindow(botInLibrary.name);
        await since('In custom app that disable toolbar, the share button in info window should be hidden')
            .expect(await infoWindow.isSharePresent())
            .toBe(false);

        // From context menu in library home
        await libraryPage.openDossierContextMenu(botInLibrary.name);
        await since('In custom app that disable toolbar, the share button in context menu should be hidden')
            .expect(await libraryPage.isDossierContextMenuItemExisted('Share'))
            .toBe(false);

        await libraryPage.openCustomAppById({ id: customApp_normal.id });
    });

    it('[TC91693_04] Validate inactive bot', async () => {
        // Prepare
        await prepareForSender();

        // Cannot run inactive bot
        // Library home
        await libraryPage.openDossierNoWait(botSetInactive.name);
        await dossierPage.waitForElementVisible(dossierPage.getErrorDialogue());
        await since(
            'Run inactive bot from library home, the error message should be "#{expected}", instead we have "#{actual}"'
        )
            .expect(await dossierPage.errorMsg())
            .toEqual('This bot is currently inactive.');
        await libraryPage.dismissError();

        // Can share inactive bot in edit mode
        await libraryPage.openDossierInfoWindow(botSetInactive.name);
        await infoWindow.clickEditButton();
        await dossierPage.openShareDropDown();
        await share.openShareDossierDialog();
        await since(
            'Open share bot dialog in edit mode, the title of share dialog should be "#{expected}", instead we have "#{actual}"'
        )
            .expect(await shareDossier.getShareDialogTitle())
            .toEqual('Share Bot');
        await shareDossier.closeDialog();
        await dossierPage.goToLibrary();
    });

    it('[TC91693_05] Validate error shows if user has no privilege', async () => {
        // Prepare
        await prepareForSender();

        // No run AI Bot privilege, user cannot run bot and show error message
        await libraryPage.openDossierContextMenu(botInLibrary.name);
        await libraryPage.clickDossierContextMenuItem('Share', 'Share Bot');
        await shareDossier.searchRecipient(userWithNoRunPrivilege.credentials.username);
        await shareDossier.selectRecipients([userWithNoRunPrivilege.credentials.username]);
        await shareDossier.openACL();
        await shareDossier.changeACLTo('Full Control');
        await shareDossier.shareDossier();

        await libraryPage.switchUser(userWithNoRunPrivilege.credentials);
        await notification.openPanel();
        await notification.getLinkTextByIndex(0).click();
        await dossierPage.waitForElementVisible(dossierPage.getErrorDialogue());
        await since('The error message of no user privilege should "#{expected}", instead we have "#{actual}"')
            .expect(await dossierPage.errorMsg())
            .toEqual('You do not have privilege to perform this action.');
        await libraryPage.dismissError();
    });

    it('[TC91693_06] Validate bot can be run in guest mode', async () => {
        await libraryPage.switchUser(guestUser.credentials);
        await libraryPage.waitForLibraryLoading();
        await libraryPage.openDefaultApp();
        await onboardingTutorial.clickIntroToLibrarySkip();

        await libraryPage.openDossier(botForPublic.name);
        await since('Run bot in guest mode should be successful without error')
            .expect(await dossierPage.isErrorPresent())
            .toBe(false);
    });
});
