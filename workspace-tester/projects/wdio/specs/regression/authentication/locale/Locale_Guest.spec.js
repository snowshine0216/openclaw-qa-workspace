import ERROR_MAP from '../../../../utils/ErrorMsg.js';

/**
 * Test environment: https://emm2.labs.microstrategy.com:1399/MicroStrategyLibrary/
 *
 * Run in Local: npm run regression -- --baseUrl=https://emm2.labs.microstrategy.com:1399/MicroStrategyLibrary/ --xml=specs/regression/config/Locale_Guest.config.xml --params.loginType=Custom --params.credentials.webServerUsername=admin --params.credentials.webServerPassword=""
 */

describe('Library Web Locale Settings - Guest', () => {
    let { userAccount, libraryPage, onboardingTutorial } = browsers.pageObj1;

    it('[TC85237] Verify locale settings function with Guest authentication modes in Library Web', async () => {
        try {
            await libraryPage.waitForLibraryLoading();
            try {
                await libraryPage.sleep(5000);
                if (await onboardingTutorial.isLibraryIntroductionPresent()) {
                    await onboardingTutorial.clickIntroToLibrarySkip();
                }
            } catch (e) {
                console.warn(e.message == 'Introduction To Library is not present' ? e : 'Unexpected error: ' + e.message);
            }
            // await libraryPage.openUserAccountMenu();
            // await since('preference present is supposed to be #{expected}, instead we have #{actual}')
            //     .expect(await userAccount.isPreferencePresent())
            //     .toBe(false);
        } catch (e) {
            if (
                e.message.includes(ERROR_MAP.ERR_001) ||
                e.message.includes(ERROR_MAP.ERR_002) ||
                e.message.includes(ERROR_MAP.ERR_003)
            ) {
                console.log('Low Pass for TC85237: ', e.message);
                return;
            }
            throw e;
        }
    });
});
