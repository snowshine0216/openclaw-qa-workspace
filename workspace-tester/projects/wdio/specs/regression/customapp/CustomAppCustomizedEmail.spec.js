import setWindowSize from '../../../config/setWindowSize.js';
import * as postBody from '../../../constants/customApp/customAppCustomizedEmail.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import deleteCustomApp from '../../../api/customApp/deleteCustomApp.js';
import postEmail from '../../../api/email/postEmail.js';
import * as info from '../../../constants/customApp/info.js';
import resetBookmarks from '../../../api/resetBookmarks.js';
import createBookmarks from '../../../api/createBookmarks.js';
import editLibraryEmbedding from '../../../api/admin/libraryEmbedding.js';
import { openViewInBrowserLink, getCurrentUTCTimestamp } from '../../../api/mailpit/mailpitAPI.js';

describe('Custom App - CustomizedEmail', () => {
    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1600,
        height: 1200,
    };

    let { loginPage, dossierPage, libraryPage, commentsPage, groupDiscussion, share, collaborationDb, shareDossier } =
        browsers.pageObj1;

    let customAppId, currentUrl;
    let dbUrl = browsers.params.dbUrl;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(info.appUser.credentials);
        // await deleteCustomAppNames({credentials: info.mstrUser.credentials, namesToFind:[postBody.customAppInfo.name]});
        customAppId = await createCustomApp({
            credentials: info.mstrUser.credentials,
            customAppInfo: info.customizedEmail,
        });
    });

    afterEach(async () => {
        await libraryPage.openCustomAppById({ id: customAppId });
    });

    afterAll(async () => {
        // delete custom app by id
        await deleteCustomApp({ credentials: info.mstrUser.credentials, customAppId: customAppId });
        await editLibraryEmbedding({ credentials: info.mstrUser.credentials, embeddingInfo: postBody.security });
        await editLibraryEmbedding({ credentials: info.mstrUser.credentials, embeddingInfo: postBody.all_security });
    });

    async function postPublicComment(customAppId, username) {
        const currentUTCTime = getCurrentUTCTimestamp();
        await collaborationDb.deleteAllComments(dbUrl, info.testedDossier.project.id + ':' + info.testedDossier.id);
        await libraryPage.openCustomAppById({ id: customAppId });
        await libraryPage.waitForLibraryLoading();
        await libraryPage.switchUser(info.mstrUser.credentials);
        await libraryPage.openDossier(info.testedDossier.name);
        await dossierPage.waitForDossierLoading();
        await commentsPage.openCommentsPanel();
        const mentionTxt = 'test' + Date.now();
        await commentsPage.addCommentWithUserMention(mentionTxt, username);
        await commentsPage.postComment();
        await openViewInBrowserLink(username, currentUTCTime);
        let currentUrl = await browser.getUrl();
        return currentUrl;
    }

    async function createPrivateDiscussion(customAppId, username) {
        const currentUTCTime = getCurrentUTCTimestamp();
        await collaborationDb.deleteAllTopics(dbUrl, info.testedDossier.project.id + ':' + info.testedDossier.id);
        await collaborationDb.deleteAllNotifications(dbUrl, info.mstrUser.id);
        await libraryPage.openCustomAppById({ id: customAppId });
        await libraryPage.waitForLibraryLoading();
        await libraryPage.switchUser(info.mstrUser.credentials);
        await libraryPage.openDossier(info.testedDossier.name);
        await dossierPage.waitForDossierLoading();
        await commentsPage.openCommentsPanel();
        await groupDiscussion.openDiscussionTab();
        const discussionTitle = 'autotest' + Date.now();
        await groupDiscussion.createNewDiscussion([username], 0, discussionTitle, discussionTitle);
        // check email
        await openViewInBrowserLink(username, currentUTCTime);
        let currentUrl = await browser.getUrl();
        return currentUrl;
    }

    async function shareBookmark(customAppId, username) {
        const currentUTCTime = getCurrentUTCTimestamp();
        const bmName = 'Bookmark ' + Date.now();
        await resetBookmarks({
            credentials: info.mstrUser.credentials,
            dossier: info.testedDossier,
        });
        await createBookmarks({
            bookmarkList: [bmName],
            credentials: info.mstrUser.credentials,
            dossier: info.testedDossier,
        });
        await libraryPage.openCustomAppById({ id: customAppId });
        await libraryPage.waitForLibraryLoading();
        await libraryPage.switchUser(info.mstrUser.credentials);
        await libraryPage.openDossier(info.testedDossier.name);
        await dossierPage.waitForDossierLoading();
        await share.openSharePanel();
        await share.openShareDossierDialog();
        await shareDossier.includeBookmark();
        await shareDossier.openBMList();
        await shareDossier.selectSharedBookmark([bmName]);
        await shareDossier.closeShareBookmarkDropDown();
        await shareDossier.addMessage('test customized email with bookmark');
        await shareDossier.searchRecipient(username);
        await shareDossier.selectRecipients([username]);
        await shareDossier.shareDossier();
        await openViewInBrowserLink(username, currentUTCTime);
        let currentUrl = await browser.getUrl();
        return currentUrl;
    }

    async function shareDossierNoBM(customAppId, username) {
        const currentUTCTime = getCurrentUTCTimestamp();
        await resetBookmarks({
            credentials: info.mstrUser.credentials,
            dossier: info.testedDossier,
        });
        //from IW to share dossier with empty BM list
        await libraryPage.openCustomAppById({ id: customAppId });
        await libraryPage.waitForLibraryLoading();
        await libraryPage.switchUser(info.mstrUser.credentials);
        await libraryPage.openDossier(info.testedDossier.name);
        await dossierPage.waitForDossierLoading();
        await share.openSharePanel();
        await share.openShareDossierDialog();
        const msg = 'test customized email' + Date.now();
        await shareDossier.addMessage(msg);
        await shareDossier.searchRecipient(username);
        await shareDossier.selectRecipients([username]);
        await shareDossier.shareDossier();
        await openViewInBrowserLink(username, currentUTCTime);
        let currentUrl = await browser.getUrl();
        return currentUrl;
    }

    it('[TC86625_01] Verify Preview Email', async () => {
        const currentUTCTime = getCurrentUTCTimestamp();
        const recipient = 'tc1user1';
        // call post email api to post preview email
        const previewEmailInfo = {
            applicationId: `${customAppId}`,
            isHTML: true,
            notificationType: 'DOSSIER_COMMENT',
            template: {
                templateName: 'custom_email_preview',
                tokens: {
                    dossierName: '[dossier name]',
                    mobileLink:
                        'dossier://?url=http%3A%2F%2F10.27.69.39%3A8080%2FMicroStrategyLibrary%2Fapp%2Fconfig%2F8BF1F88AF63C4501B98A41A59AD2FA61',
                    notificationLink:
                        'http://10.27.69.39:8080/MicroStrategyLibrary/app/config/8BF1F88AF63C4501B98A41A59AD2FA61/notification/share',
                    recipient: recipient,
                    senderName: recipient,
                    shareLink:
                        'http://10.27.69.39:8080/MicroStrategyLibrary/app/config/8BF1F88AF63C4501B98A41A59AD2FA61',
                },
            },
            userIds: [`${info.tc1user1.id}`],
        };
        // set embedding to be all
        await editLibraryEmbedding({ credentials: info.mstrUser.credentials, embeddingInfo: postBody.security });
        await editLibraryEmbedding({ credentials: info.mstrUser.credentials, embeddingInfo: postBody.all_security });
        await postEmail({ credentials: info.tc1user1.credentials, emailInfo: previewEmailInfo });
        await openViewInBrowserLink(recipient, currentUTCTime);
        let currentUrl = await browser.getUrl();
        await since(
            'when embedding is all, host link in user mentioned email having embedding link is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(currentUrl.includes('https://www.baidu.com/?mstrLibraryLink='))
            .toBe(true);
    });

    it('[TC86625_02] Verify User Mentioned Email', async () => {
        // set embedding to be all
        await editLibraryEmbedding({ credentials: info.mstrUser.credentials, embeddingInfo: postBody.security });
        await editLibraryEmbedding({ credentials: info.mstrUser.credentials, embeddingInfo: postBody.all_security });
        currentUrl = await postPublicComment(customAppId, info.tc1user1.credentials.username);
        await since(
            'when embedding is all, host link in user mentioned email having embedding link is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(currentUrl.includes('https://www.baidu.com/?mstrLibraryLink='))
            .toBe(true);

        //set embedding to be specific
        await editLibraryEmbedding({ credentials: info.mstrUser.credentials, embeddingInfo: postBody.security });
        await editLibraryEmbedding({
            credentials: info.mstrUser.credentials,
            embeddingInfo: postBody.specific_security,
        });
        await postPublicComment(customAppId, info.tc1user2.credentials.username);
        await since(
            'when embedding is specific, host link in user mentioned email having embedding link is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(currentUrl.includes('https://www.baidu.com/?mstrLibraryLink='))
            .toBe(true);

        // set embedding to be None
        await editLibraryEmbedding({ credentials: info.mstrUser.credentials, embeddingInfo: postBody.security });
        await editLibraryEmbedding({ credentials: info.mstrUser.credentials, embeddingInfo: postBody.none_security });
        currentUrl = await postPublicComment(customAppId, info.tc1user3.credentials.username);
        await since(
            'when embeding is none, host link in user mentioned email having embedding link to be #{expected}, instead we have #{actual}.'
        )
            .expect(currentUrl.includes('https://www.baidu.com/?mstrLibraryLink='))
            .toBe(false);
    });

    it('[TC86625_03] Verify Member Add Email', async () => {
        // set embedding to be all
        await editLibraryEmbedding({ credentials: info.mstrUser.credentials, embeddingInfo: postBody.security });
        await editLibraryEmbedding({ credentials: info.mstrUser.credentials, embeddingInfo: postBody.all_security });
        currentUrl = await createPrivateDiscussion(customAppId, info.tc1user1.credentials.username);
        await since(
            'when embedding is all, host link in member added email having embedding link is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(currentUrl.includes('https://www.baidu.com/?mstrLibraryLink='))
            .toBe(true);

        // set embedding to be specific
        await editLibraryEmbedding({ credentials: info.mstrUser.credentials, embeddingInfo: postBody.security });
        await editLibraryEmbedding({
            credentials: info.mstrUser.credentials,
            embeddingInfo: postBody.specific_security,
        });
        currentUrl = await createPrivateDiscussion(customAppId, info.tc1user2.credentials.username);
        await since(
            'when embedding is specific, host link in member added email having embedding link is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(currentUrl.includes('https://www.baidu.com/?mstrLibraryLink='))
            .toBe(true);

        // set embedding to be None
        await editLibraryEmbedding({ credentials: info.mstrUser.credentials, embeddingInfo: postBody.security });
        await editLibraryEmbedding({ credentials: info.mstrUser.credentials, embeddingInfo: postBody.none_security });
        currentUrl = await createPrivateDiscussion(customAppId, info.tc1user3.credentials.username);
        await since(
            'when embedding is None, host link in member added email having embedding link is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(currentUrl.includes('https://www.baidu.com/?mstrLibraryLink='))
            .toBe(false);
    });

    it('[TC86625_04] Verify Share Bookmark Email', async () => {
        // set embedding to be all
        await editLibraryEmbedding({ credentials: info.mstrUser.credentials, embeddingInfo: postBody.security });
        await editLibraryEmbedding({ credentials: info.mstrUser.credentials, embeddingInfo: postBody.all_security });
        currentUrl = await shareBookmark(customAppId, info.tc1user1.credentials.username);
        await since(
            'when embedding is all, host link in share bookmark email having embedding link to be #{expected}, instead we have #{actual}.'
        )
            .expect(currentUrl.includes('https://www.baidu.com/?mstrLibraryLink='))
            .toBe(true);

        // set embedding to be specific
        await editLibraryEmbedding({ credentials: info.mstrUser.credentials, embeddingInfo: postBody.security });
        await editLibraryEmbedding({
            credentials: info.mstrUser.credentials,
            embeddingInfo: postBody.specific_security,
        });
        currentUrl = await shareBookmark(customAppId, info.tc1user2.credentials.username);
        await since(
            'when embedding is specific, host link in share bookmark email having embedding link to be #{expected}, instead we have #{actual}.'
        )
            .expect(currentUrl.includes('https://www.baidu.com/?mstrLibraryLink='))
            .toBe(true);

        // set embedding to be None
        await editLibraryEmbedding({ credentials: info.mstrUser.credentials, embeddingInfo: postBody.security });
        await editLibraryEmbedding({ credentials: info.mstrUser.credentials, embeddingInfo: postBody.none_security });
        currentUrl = await shareBookmark(customAppId, info.tc1user3.credentials.username);
        await since(
            'when embedding is None, host link in share bookmark email having embedding link is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(currentUrl.includes('https://www.baidu.com/?mstrLibraryLink='))
            .toBe(false);
    });

    it('[TC86625_05] Verify Share Dossier Email', async () => {
        // set embedding to be all
        await editLibraryEmbedding({ credentials: info.mstrUser.credentials, embeddingInfo: postBody.security });
        await editLibraryEmbedding({ credentials: info.mstrUser.credentials, embeddingInfo: postBody.all_security });
        currentUrl = await shareDossierNoBM(customAppId, info.tc1user1.credentials.username);
        await since(
            'when embedding is all, host link in share dossier email having embedding link to be #{expected}, instead we have #{actual}.'
        )
            .expect(currentUrl.includes('https://www.baidu.com/?mstrLibraryLink='))
            .toBe(true);

        // set embedding to be specific
        await editLibraryEmbedding({ credentials: info.mstrUser.credentials, embeddingInfo: postBody.security });
        await editLibraryEmbedding({
            credentials: info.mstrUser.credentials,
            embeddingInfo: postBody.specific_security,
        });
        currentUrl = await shareDossierNoBM(customAppId, info.tc1user2.credentials.username);
        await since(
            'when embedding is specific, host link in share dossier email having embedding link to be #{expected}, instead we have #{actual}.'
        )
            .expect(currentUrl.includes('https://www.baidu.com/?mstrLibraryLink='))
            .toBe(true);

        // set embedding to be None
        await editLibraryEmbedding({ credentials: info.mstrUser.credentials, embeddingInfo: postBody.security });
        await editLibraryEmbedding({ credentials: info.mstrUser.credentials, embeddingInfo: postBody.none_security });
        currentUrl = await shareDossierNoBM(customAppId, info.tc1user3.credentials.username);
        await since(
            'when embedding is None, host link in share dossier email having embedding link to be #{expected}, instead we have #{actual}.'
        )
            .expect(currentUrl.includes('https://www.baidu.com/?mstrLibraryLink='))
            .toBe(false);
    });
});
