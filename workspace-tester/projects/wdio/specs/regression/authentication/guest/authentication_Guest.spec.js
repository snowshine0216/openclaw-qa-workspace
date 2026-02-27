import { takeScreenshot, takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';

/**
 * Run in Local: npm run regression -- --baseUrl=https://emm.labs.microstrategy.com:6262/MicroStrategyLibrary/ --xml=specs/regression/config/Authentication_Guest.config.xml --params.credentials.webServerUsername=admin --params.credentials.webServerPassword=""
 */

const envURL2 =
    'https://emm2.labs.microstrategy.com:1399/MicroStrategyLibrary/app/B7CA92F04B9FAE8D941C3E9B7E0CD754/6EC184BF11EC321761B30080EF4CEEAC/share';

describe('Authentication - Guest Mode', () => {
    const dossier = {
        id: '6EC184BF11EC321761B30080EF4CEEAC',
        name: 'New Dossier',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    let { userAccount, libraryPage, loginPage, onboardingTutorial, dossierPage } = browsers.pageObj1;

    it('[TC20458] Opening a dossier from shared url through guest only authentication mode skips redirection to the corresponding dossier page', async () => {
        await browser.url(envURL2);
        await dossierPage.waitForDossierLoading();
        await since('Dossier title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual(['New Dossier', 'Chapter 1', 'Page 1']);
        if (await onboardingTutorial.hasSkipButton()) {
            await onboardingTutorial.clickSkipButton();
        }
        await libraryPage.openUserAccountMenu();
        await since('The user should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.getUserName())
            .toBe('Public / Guest');
        await since('Can user logout should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.canUserLogout())
            .toBe(false);
    });

    it('[TC65239] Guest Authentication testing - Login, logout functionality testing', async () => {
        await browser.url(browser.options.baseUrl);
        await loginPage.waitForLoginView();
        await takeScreenshot('TC65239', 'Login Page');
        await loginPage.login(browsers.params.credentials, { mode: 'guest' });
        await libraryPage.waitForLibraryLoading();
        if (await onboardingTutorial.hasLibraryIntroduction()) {
            await onboardingTutorial.clickIntroToLibrarySkip();
        }
        await libraryPage.openDossier(dossier.name);
        await dossierPage.waitForDossierLoading();
        await libraryPage.openUserAccountMenu();
        await takeScreenshotByElement(userAccount.getAccountDropdown(), 'TC65239', 'Account Dropdown');
        await since('The user should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.getUserName())
            .toBe('Public / Guest');
        await libraryPage.logout();
    });
});
