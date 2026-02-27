import { takeScreenshot } from '../../../../utils/TakeScreenshot.js';

/*
run in local: npm run regression -- --baseUrl=https://emm2.labs.microstrategy.com:5433/MicroStrategyLibrary/ --xml=specs/regression/config/Authentication_LDAP.config.xml --params.credentials.webServerUsername=admin --params.credentials.webServerPassword="" --params.credentials.username=xkong
*/

describe('Authentication LDAP', () => {
    let { loginPage } = browsers.pageObj1;

    it('[TC15683] LDAP Authentication when is not configured', async () => {
        await takeScreenshot('TC15683', 'Login Page', { tolerance: 0.1 });
        await loginPage.login(browsers.params.credentials, { mode: 'ldap' });
        await since('LDAP is not configured')
            .expect(await loginPage.isErrorPresent())
            .toBe(true);
        await since('The error title should be #{expected}, instead we have #{actual}')
            .expect(await loginPage.errorTitle())
            .toBe('Authentication Error');
        await since('The error message should be #{expected}, instead we have #{actual}')
            .expect(await loginPage.errorMsg())
            .toBe('The LDAP authentication is not available.');
    });
});
