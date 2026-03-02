import users from '../../../../testData/users.json' assert { type: 'json' };
import setWindowSize from '../../../../config/setWindowSize.js';
import { takeScreenshot } from '../../../../utils/TakeScreenshot.js';
import ERROR_MAP from '../../../../utils/ErrorMsg.js';

/*
Test environment: EMM team server
Environment URL: http://tec-w-015861.labs.microstrategy.com:8080/MicroStrategyLibrary/
Reference: https://microstrategy.atlassian.net/wiki/spaces/TECCLIENTSMOBILECTC/pages/1781601100/Authentication+Test+Environment
 */

describe('Authentication - Integrated Mode', () => {
    const customApp = {
        serverlevel: {
            name: 'Auto_ServerLevel',
            id: 'EBC8243B9E414EEFBE03205CFFE56165',
        },
        standard: {
            name: 'Auto_Standard',
            id: '937E6B19819143629D2EC5A0521FF00C',
        },
    };
    const dossier = {
        name: '2. blank dossier',
    };

    const user = users['EMM_integrated_kerberos'];
    const standardUser = users['EMM_standard'];

    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let { userAccount, libraryPage, loginPage } = browsers.pageObj1;
    afterEach(async () => {
        await libraryPage.openUserAccountMenu();
        await libraryPage.logout();
    });

    beforeAll(async () => {
        await setWindowSize(browserWindow);
    });

    it('[TC65242] Integrated Authentication (Kerberos) - Login, logout', async () => {
        try {
            await loginPage.waitForLoginView();
            await loginPage.login(user.credentials, { mode: 'integrated', type: 'kerberos' });
            await libraryPage.openUserAccountMenu();
            await since('The user should be #{expected}, instead we have #{actual}')
                .expect(await userAccount.getUserName())
                .toBe('kerb');
            await libraryPage.closeUserAccountMenu();
            await libraryPage.openDossier(dossier.name);
            await libraryPage.openUserAccountMenu();
            await libraryPage.logout();
            await loginPage.login(user.credentials, { mode: 'integrated', type: 'kerberos' });
            await since('User can re-login without filling in credentials')
                .expect(await libraryPage.title())
                .toBe('Library');
        } catch (e) {
            if (
                e.message.includes(ERROR_MAP.ERR_001) ||
                e.message.includes(ERROR_MAP.ERR_002) ||
                e.message.includes(ERROR_MAP.ERR_003)
            ) {
                console.log('Low Pass for TC65242: ', e.message);
                return;
            }
            throw e;
        }
    });
    it('[TC86306] Login custom app with server mode - Kerberos', async () => {
        await libraryPage.openCustomAppById({ id: customApp.standard.id });
        await takeScreenshot('TC86306', 'Standard Login Page', { tolerance: 0.1 });
        await loginPage.waitForLoginView();
        await loginPage.login(standardUser.credentials);
        await userAccount.switchCustomApp(customApp.serverlevel.name);
        await userAccount.openUserAccountMenu();
        await libraryPage.logout();
        await loginPage.waitForLoginView();
        await loginPage.login(user.credentials, { mode: 'integrated', type: 'kerberos' });
        await since('User can re-login without filling in credentials')
            .expect(await libraryPage.title())
            .toBe('Library');
    });
});
