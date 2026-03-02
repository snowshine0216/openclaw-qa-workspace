/*
npm run regression -- --baseUrl=https://emm1.labs.microstrategy.com:8099/MicroStrategyLibrary/ --xml=specs/regression/config/Authentication_SessionTimeoutAndApplyDossierLink.config.xml --params.credentials.webServerUsername=admin --params.credentials.webServerPassword=""
*/
import users from '../../../../testData/users.json' assert { type: 'json' };
describe('SessionTimeoutAndApplyDossierLink', () => {
    const dossier = {
        id: '58EB85204606DBF71F5B829098BDB55C',
        name: 'Blank Dossier',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };
    const secondDossier = {
        id: 'B111674E44CB4B18A675658DCC9C18BB',
        name: 'New Dossier',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };
    const firstUser = users['EMM_web_automation'].credentials;
    const secondUser = users['EMM_standard'].credentials;

    let { dossierPage, libraryPage, loginPage, bookmark, toc } = browsers.pageObj1;
    const baseUrl = browser.options.baseUrl.endsWith('/') ? '' : '/';

    beforeEach(async () => {
        await browser.url(browser.options.baseUrl);
        await loginPage.login(firstUser);
        await libraryPage.waitForLibraryLoading();
        await libraryPage.openDossier(dossier.name);
    });
    afterEach(async () => {
        await libraryPage.openUserAccountMenu();
        await libraryPage.logout();
    });

    it('[TC91460] - Logout from dossier and relogin as current user', async () => {
        await libraryPage.openUserAccountMenu();
        await libraryPage.logout();
        await loginPage.waitForLoginView();
        await loginPage.login(firstUser);
        await libraryPage.waitForLibraryLoading();
        await since('Library title should be #{expected} but is #{actual}')
            .expect(await libraryPage.title())
            .toEqual('Library');
    });

    it('[TC91461] - Logout from dossier and relogin as different user', async () => {
        await libraryPage.openUserAccountMenu();
        await libraryPage.logout();
        await loginPage.waitForLoginView();
        await loginPage.login(secondUser);
        await libraryPage.waitForLibraryLoading();
        await since('Library title should be #{expected} but is #{actual}')
            .expect(await libraryPage.title())
            .toEqual('Library');
    });

    it('[TC91463] - Logout from dossier, apply dossier link and relogin as current user', async () => {
        await libraryPage.openUserAccountMenu();
        await libraryPage.logout();
        await loginPage.waitForLoginView();
        await browser.url(`${baseUrl}app/${secondDossier.project.id}/${secondDossier.id}`);
        await loginPage.waitForLoginView();
        await loginPage.login(firstUser);
        await libraryPage.waitForLibraryLoading();
        await libraryPage.openUserAccountMenu();
        await libraryPage.closeUserAccountMenu();
        await since('Page title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual([secondDossier.name, 'Chapter 1', 'Page 1']);
    });

    it('[TC91464] - Logout from dossier, apply dossier link and relogin as different user', async () => {
        await libraryPage.openUserAccountMenu();
        await libraryPage.logout();
        await loginPage.waitForLoginView();
        await browser.url(`${baseUrl}app/${secondDossier.project.id}/${secondDossier.id}`);
        await loginPage.waitForLoginView();
        await loginPage.login(secondUser);
        await libraryPage.waitForLibraryLoading();
        await libraryPage.openUserAccountMenu();
        await libraryPage.closeUserAccountMenu();
        await since('Page title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual([secondDossier.name, 'Chapter 1', 'Page 1']);
    });

    it('[TC91465] - Session timeout from dossier and relogin as current user', async () => {
        await browser.pause(240000);
        await bookmark.getBookmarkIcon().click();
        await loginPage.waitForLoginView();
        await loginPage.login(firstUser);
        await dossierPage.waitForDossierLoading();
        await toc.openMenu();
        await since('Page title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual([dossier.name, 'Chapter 1', 'Page 1']);
    });

    it('[TC91466] - Session timeout from dossier and relogin as different user', async () => {
        await browser.pause(240000);
        await bookmark.getBookmarkIcon().click();
        await loginPage.waitForLoginView();
        await loginPage.login(secondUser);
        await libraryPage.waitForLibraryLoading();
        await libraryPage.openUserAccountMenu();
        await libraryPage.closeUserAccountMenu();
        await since('Library title should be #{expected} but is #{actual}')
            .expect(await libraryPage.title())
            .toEqual('Library');
    });

    it('[TC91467] - Session timeout from dossier, directly apply a dossier link and relogin as current user', async () => {
        await browser.pause(240000);
        await browser.url(`${baseUrl}app/${secondDossier.project.id}/${secondDossier.id}`);
        await loginPage.waitForLoginView();
        await loginPage.login(firstUser);
        await dossierPage.waitForDossierLoading();
        await toc.openMenu();
        await since('Page title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual([secondDossier.name, 'Chapter 1', 'Page 1']);
    });

    it('[TC91468] - Session timeout from dossier, directly apply a dossier link and relogin as different user', async () => {
        await browser.pause(240000);
        await browser.url(`${baseUrl}app/${secondDossier.project.id}/${secondDossier.id}`);
        await loginPage.waitForLoginView();
        await loginPage.login(secondUser);
        await dossierPage.waitForDossierLoading();
        await toc.openMenu();
        await since('Page title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual([secondDossier.name, 'Chapter 1', 'Page 1']);
    });

    it('[TC91469] - Session timeout from dossier, back to login page and relogin as current user', async () => {
        await browser.pause(240000);
        await bookmark.getBookmarkIcon().click();
        await loginPage.waitForLoginView();
        await browser.url(`${baseUrl}app/${secondDossier.project.id}/${secondDossier.id}`);
        await loginPage.waitForLoginView();
        await loginPage.login(firstUser);
        await dossierPage.waitForDossierLoading();
        await toc.openMenu();
        await since('Page title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual([secondDossier.name, 'Chapter 1', 'Page 1']);
    });

    it('[TC87662] - Session timeout from dossier, back to login page and relogin as different user', async () => {
        await browser.pause(240000);
        await bookmark.getBookmarkIcon().click();
        await loginPage.waitForLoginView();
        await browser.url(`${baseUrl}app/${secondDossier.project.id}/${secondDossier.id}`);
        await loginPage.waitForLoginView();
        await loginPage.login(secondUser);
        await dossierPage.waitForDossierLoading();
        await toc.openMenu();
        await since('Library title should be #{expected} but is #{actual}')
            .expect(await libraryPage.title())
            .toEqual('Library');
    });
});
