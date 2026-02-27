describe('Authentication - OIDC', () => {
    const dossier = {
        id: 'ABDEB8CB463B4A1513DC23B77A6636D9',
        name: 'Test Dossier',
    };

    let { userAccount, libraryPage, loginPage, dossierPage } = browsers.pageObj1;

    it('[TC80230][Tanzu] Library Web - OIDC Authentication', async () => {
        await loginPage.oktaLogin(browsers.params.credentials);
        await libraryPage.waitForLibraryLoading();
        await userAccount.openUserAccountMenu();
        await since('The user should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.getUserName())
            .toContain('Shuai');
        await userAccount.closeUserAccountMenu();
        await libraryPage.openDossier(dossier.name);
        await dossierPage.waitForDossierLoading();
        await since('Dossier title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual(['Test Dossier', 'Chapter 1', 'CustomViz']);
        await userAccount.openUserAccountMenu();
        await libraryPage.logout();
        await since('Login page is displayed = ')
            .expect(await loginPage.isLoginPageDisplayed())
            .toEqual(true);
    });
});
