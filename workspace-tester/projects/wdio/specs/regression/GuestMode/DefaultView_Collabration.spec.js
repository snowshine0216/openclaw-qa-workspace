import { customCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';
import resetBookmarksWithPrompt from '../../../api/resetBookmarksWithPrompt.js';

const specConfiguration = { ...customCredentials('_defaultview') };

describe('X-Func for Base View vs Last View', () => {
    const project = {
        id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
        name: 'MicroStrategy Tutorial',
    };

    const shareBookmark_Base = {
        id: '67FFACA14901875E760ED5A430853B71',
        name: 'Auto_X-Func_ShareBookmark',
        project: project,
    };

    const dossier_Base = {
        id: '67206CCB4354228F55C857A047C8CE72',
        name: 'Auto_BaseView_Dossier',
        project: project,
    };

    let { libraryPage, loginPage, dossierPage, bookmark, notification, shareDossier } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);
        await resetBookmarksWithPrompt({ credentials: specConfiguration.credentials, dossier: dossier_Base });
    });

    it('[TC70781_06] Validate X-func for Default View on Library Web Working as expected - Share Bookmark', async () => {
        await resetDossierState({ credentials: specConfiguration.credentials, dossier: shareBookmark_Base });
        const recipientCredentials = {
            username: 'shuanwang',
            password: '',
        };

        // Share bookmark
        await shareDossier.shareAllBookmarksFromIWToUser(shareBookmark_Base, recipientCredentials.username);
        //swich user to check shared bookmark
        await libraryPage.switchUser(recipientCredentials);
        await notification.openPanel();
        await notification.applySharedDossier(0);
        await notification.openMsgByIndex(0);
        await dossierPage.waitForDossierLoading();

        //await libraryPage.openDossier(shareBookmark_Base.name);
        await bookmark.openPanel();
        await since('Bookmark list is supposed to be #{expected}, instead we have #{actual}')
            .expect(await bookmark.bookmarkTotalCount())
            .toBe(2);
        await since('Shared BM of share bookmark status should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.getCapsureText('share bookmark'))
            .toBe('NEW');
        await bookmark.applyBookmark('share bookmark', 'SHARED WITH ME');
        await bookmark.openPanel();
        await since('Shared BM of share bookmark status should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.isSharedStatusIconPresent('share bookmark'))
            .toBe(false);
        await bookmark.closePanel();

        //back to library and clear notification panel msgs
        await dossierPage.goToLibrary();
        await libraryPage.removeDossierFromLibrary(recipientCredentials, shareBookmark_Base);
        await notification.openPanel();
        await notification.clearAllMsgs();
        await notification.closePanel();

        //switch to tester_auto_defaultview
        await libraryPage.switchUser(specConfiguration.credentials);
    });
});

export const config = specConfiguration;
