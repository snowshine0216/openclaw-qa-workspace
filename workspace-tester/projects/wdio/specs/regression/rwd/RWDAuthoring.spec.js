describe('RWD - Authoring', () => {
    let { libraryPage, loginPage, libraryAuthoringPage, infoWindow, rwdAuthoringPage } = browsers.pageObj1;
    const customAppId = '4745A8C3B61A4A26B90E24A8A3E2C6FB';
    const documentName = 'Test Document';

    beforeAll(async () => {
        await libraryPage.openCustomAppById({ id: customAppId });
        await loginPage.login(browsers.params.credentials);
    });

    it('[BCSA-3968] RWD Authoring', async () => {
        await libraryAuthoringPage.createDocumentFromLibrary('Platform Analytics');

        await rwdAuthoringPage.waitForRwdIframeAndSwitch();
        await rwdAuthoringPage.selectTemplate('01 Blank Interactive Document');
        await rwdAuthoringPage.waitForRwdDocumentReadyInFrame();
        await rwdAuthoringPage.addDatasetInRwdFrame('rwd_prompt_report');
        await rwdAuthoringPage.runPromptFromEditor();

        await rwdAuthoringPage.waitForRwdIframeAndSwitch();
        await rwdAuthoringPage.verifyDatasetAttributesInTree(['Month of Year', 'Quarter']);
        await rwdAuthoringPage.switchBackToMainContext();

        await rwdAuthoringPage.saveDocumentFromFileMenu(documentName);
        await rwdAuthoringPage.runPromptFromEditor();

        await rwdAuthoringPage.waitForRwdIframeAndSwitch();
        await rwdAuthoringPage.verifyDatasetAttributesInTree(['Month of Year', 'Quarter']);
        await rwdAuthoringPage.switchBackToMainContext();

        await rwdAuthoringPage.closeDocumentFromFileMenu();

        await browser.waitUntil(async () => await libraryPage.isDossierPresent(documentName), {
            timeout: 120000,
            timeoutMsg: `"${documentName}" did not appear in library after closing authoring.`,
        });

        await libraryPage.openDossierInfoWindow(documentName);
        await infoWindow.openItemInAuthoring();

        await rwdAuthoringPage.runPromptFromEditor();
        await rwdAuthoringPage.waitForRwdIframeAndSwitch();
        await rwdAuthoringPage.verifyDatasetAttributesInTree(['Month of Year', 'Quarter']);
        await rwdAuthoringPage.switchBackToMainContext();

        await rwdAuthoringPage.openRepromptFromFourthMenu();
        await rwdAuthoringPage.removeAllSelectedObjectsInPrompt();
        await rwdAuthoringPage.runPromptFromEditor();

        await rwdAuthoringPage.waitForRwdIframeAndSwitch();
        await rwdAuthoringPage.verifyDatasetAttributesInTree(['Month of Year', 'Quarter']);
        await rwdAuthoringPage.switchBackToMainContext();

        await rwdAuthoringPage.closeAuthoringPage();

        await browser.waitUntil(async () => await libraryPage.isDossierPresent(documentName), {
            timeout: 120000,
            timeoutMsg: `"${documentName}" did not appear in library after closing authoring page.`,
        });

        await libraryPage.openDossierInfoWindow(documentName);
        await infoWindow.deleteItemFromInfoWindow();

        await browser.waitUntil(async () => !(await libraryPage.isDossierPresent(documentName)), {
            timeout: 120000,
            timeoutMsg: `"${documentName}" was not removed from library.`,
        });
        await expect(await libraryPage.isDossierPresent(documentName)).toBe(false);
    });
});
