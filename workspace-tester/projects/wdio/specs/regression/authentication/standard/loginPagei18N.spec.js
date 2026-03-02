import users from '../../../../testData/users.json' assert { type: 'json' };
import setWindowSize from '../../../../config/setWindowSize.js';
import { takeScreenshot, takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';

/*
npm run regression -- --baseUrl=https://emm.labs.microstrategy.com:6262/MicroStrategyLibrary/ --xml=specs/regression/config/Authentication_Standard_i18N.config.xml --params.credentials.webServerUsername=admin --params.credentials.webServerPassword="" --params.locale=de-DE
 */

describe('Authentication - Standard - login page i18N', () => {
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let { loginPage } = browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
    });

    it('[TC83569] Verify library web i18N of login UI', async () => {
        await loginPage.waitForLoginView();
        await takeScreenshotByElement(await loginPage.getCredsLoginContainer(), 'TC83569', 'Login Page', {
            tolerance: 0.1,
        });
    });
});
