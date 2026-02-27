import { takeScreenshot } from '../../../../utils/TakeScreenshot.js';
import ERROR_MAP from '../../../../utils/ErrorMsg.js';
/**
 * Run in Local: npm run regression -- --baseUrl=https://emm1.labs.microstrategy.com:9011/MicroStrategyLibrary/ --xml=specs/regression/config/Authentication_ServerDefault_Guest.config.xml --params.credentials.webServerUsername=admin --params.credentials.webServerPassword=""
 */
describe('Authentication - Guest as default', () => {
    const dossier = {
        id: 'DAF834314ADCCED1AC3771A7F5C7656E',
        name: 'Empty Dossier',
        project: {
            id: '5FDF3E5C4CCB76AA7E3292A4C47DECB8',
            name: 'MicroStrategy Tutorial',
        },
    };

    let { userAccount, libraryPage, loginPage, dossierPage, onboardingTutorial } = browsers.pageObj1;

    it('[TC85553] Validate guest login workflow when guest is set as default in server multiple modes', async () => {
        try {
            // not automatically login when guest as default
            await loginPage.loginAsGuest();
            await libraryPage.waitForLibraryLoading();
            try {
                await libraryPage.sleep(5000);
                if (await onboardingTutorial.isLibraryIntroductionPresent()) {
                    await onboardingTutorial.clickIntroToLibrarySkip();
                }
            } catch (e) {
                console.warn(e.message == 'Introduction To Library is not present' ? e : 'Unexpected error: ' + e.message);
            }
            await libraryPage.openDossier(dossier.name);
            await dossierPage.waitForDossierLoading();
            await libraryPage.openUserAccountMenu();
            await since('The user should be #{expected}, instead we have #{actual}')
                .expect(await userAccount.getUserName())
                .toBe('Public / Guest');
            await libraryPage.logout();
            await takeScreenshot('TC85553', 'Login Page');
        } catch (e) {
            if (
                e.message.includes(ERROR_MAP.ERR_001) ||
                e.message.includes(ERROR_MAP.ERR_002) ||
                e.message.includes(ERROR_MAP.ERR_003)
            ) {
                console.log('Low Pass for TC85553: ', e.message);
                return;
            }
            throw e;
        }
    });

    it('[TC86211] Validate switch custom app workflow for guest user', async () => {
        try {
            await loginPage.loginAsGuest();
            await libraryPage.waitForLibraryLoading();
            try {
                await libraryPage.sleep(5000);
                if (await onboardingTutorial.isLibraryIntroductionPresent()) {
                    await onboardingTutorial.clickIntroToLibrarySkip();
                }
            } catch (e) {
                console.warn(e.message == 'Introduction To Library is not present' ? e : 'Unexpected error: ' + e.message);
            }
            // switch custom app
            await userAccount.switchCustomApp('dossier as home');
            await dossierPage.waitForDossierLoading();
            await since('Dossier title should be #{expected}, instead we have #{actual}')
                .expect(await dossierPage.pageTitle())
                .toEqual(['android_test_dossier', 'Chapter 1', 'Page 1']);
            // logout and re-login custom app
            await libraryPage.openUserAccountMenu();
            await libraryPage.logout();
            await loginPage.loginAsGuest();
            await dossierPage.waitForDossierLoading();
            await since('Re-login custom app, dossier title should be #{expected}, instead we have #{actual}')
                .expect(await dossierPage.pageTitle())
                .toEqual(['android_test_dossier', 'Chapter 1', 'Page 1']);
        } catch (e) {
            if (
                e.message.includes(ERROR_MAP.ERR_001) ||
                e.message.includes(ERROR_MAP.ERR_002) ||
                e.message.includes(ERROR_MAP.ERR_003)
            ) {
                console.log('Low Pass for TC86211: ', e.message);
                return;
            }
            throw e;
        }
    });
});
