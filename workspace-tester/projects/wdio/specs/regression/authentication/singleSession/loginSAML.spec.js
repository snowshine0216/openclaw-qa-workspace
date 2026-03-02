import setWindowSize from '../../../../config/setWindowSize.js';
import { takeScreenshot } from '../../../../utils/TakeScreenshot.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import users from '../../../../testData/users.json' assert { type: 'json' };
/*
Test environment: EMM team server
Base URL: https://emm.labs.microstrategy.com:3737/MicroStrategyLibrary/
Run in local: npm run wdio -- --baseUrl=https://emm.labs.microstrategy.com:3737/MicroStrategyLibrary/ --spec=specs/regression/authentication/singleSession/loginSAML.spec.js --params.loginType=Custom --params.credentials.webServerUsername=admin --params.credentials.webServerPassword=""
 */

describe('Authentication - Single Session login successful', () => {
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    const oktaUser = users['EMM_OKTA'];
    oktaUser.credentials.password = process.env.okta_password;

    const dossier = {
        id: '58EB85204606DBF71F5B829098BDB55C',
        name: 'Blank Dossier',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    let { userAccount, libraryPage, loginPage } = browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC92441] Verify login success case with single session restrict flag on - session not exists', async () => {
        await loginPage.samlRelogin();
        await loginPage.oktaLogin(oktaUser.credentials);
        await libraryPage.openDossier(dossier.name);
        await libraryPage.openUserAccountMenu();
        await since('The user should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.getUserName())
            .toContain('Shuai');
        await libraryPage.logout();
    });
});
