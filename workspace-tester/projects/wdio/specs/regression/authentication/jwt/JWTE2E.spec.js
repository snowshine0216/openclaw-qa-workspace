// test/specs/jwtRestApi.e2e.js
import { getSession } from '../../../../api/jwt/JWTRest.js';
import { takeScreenshot } from '../../../../utils/TakeScreenshot.js';
import locales from '../../../../testData/locales.json' assert { type: 'json' };
import setUserLanguage from '../../../../api/setUserLanguage.js';

/**
 * Run in Local: npm run regression -- --spec=specs/regression/authentication/jwt/JWTE2E.spec.js --baseUrl=https://mci-jlonq-dev.hypernow.microstrategy.com/MicroStrategyLibrary --params.loginType=Custom --params.credentials.username={admin_username} --params.credentials.password={admin_password}
 */
describe('JWT REST API Tests', () => {
    const mstrUser = {
        username: browser.options.params.credentials.username,
        password: browser.options.params.credentials.password,
    };
    const userId =
        (browser.options && (browser.options.userId || (browser.options.params && browser.options.params.userId))) ||
        '6ED3F8934D4068DF1E502D93BF9BFB78';
    let session;
    const baseUrl = browser.options.baseUrl;
    let { jwtPage, libraryPage, userAccount, dossierPage, userPreference } = browsers.pageObj1;
    let currentJWTToken = null;
    const customPayload = {
        iss: 'zebra',
        sub: 'olaf',
        aud: 'library',
        user: 'Aaby',
        ship_date: '2023-01-01',
    };
    const customConfig = {
        issuer: 'zebra',
        audience: 'library',
        systemPromptMap: {
            59: {
                claim: 'user',
                type: 'text',
            },
            91: {
                claim: 'ship_date',
                type: 'date',
            },
        },
    };
    const customPayload_PS384 = {
        algorithm: 'PS384',
        iss: 'eagle',
        aud: 'dashboard',
        sub: 'bob',
        groups: ['admin', 'executives', 'decision-makers'],
        energy: 'dynamic',
    };
    const customConfig_PS384 = {
        issuer: 'eagle',
        audience: 'dashboard',
    };

    const customPayload_ES512 = {
        algorithm: 'ES512',
        iss: 'phoenix',
        aud: 'dashboard',
        sub: 'bob',
        groups: ['admin', 'executives', 'decision-makers'],
        energy: 'dynamic',
    };
    const customConfig_ES512 = {
        issuer: 'phoenix',
        audience: 'dashboard',
    };
    const dashboard = {
        name: 'customer_shipdate',
    };

    beforeAll(async () => {
        console.log('JWT test setup started');
    });

    afterAll(async () => {
        console.log('Set user language back to default after all tests');
        await setUserLanguage({
            baseUrl: baseUrl.endsWith('/') ? baseUrl : baseUrl + '/',
            adminCredentials: mstrUser,
            userId: userId,
            localeId: locales.default,
        });
    });

    it('[TC99524_01] set JWT configuration and login with RS256 token', async () => {
        if (!session) {
            console.log('Creating new session for JWT configuration set test...');
            session = await getSession(mstrUser);
        }
        console.log('customPayload:', customPayload);
        const result = await jwtPage.testJWTConfigSetup(mstrUser, baseUrl, 'RS256', customPayload, customConfig);
        currentJWTToken = result.generatedJWT;
        await jwtPage.testJWTLogin(baseUrl, currentJWTToken.token, 'RS256');
        const loginJson = {
            loginMode: 67108864,
            applicationType: 0,
            password: currentJWTToken.token,
        };
        const jsonStr = JSON.stringify(loginJson);
        const base64Str = Buffer.from(jsonStr).toString('base64');
        const urlEncoded = encodeURIComponent(base64Str);
        const loginUrl = `${baseUrl}/app?token=${urlEncoded}&sessionMode=stateless&redirect=false`;
        console.log('Login URL:', loginUrl);
        await browser.newWindow(loginUrl);
        await libraryPage.waitForLibraryLoading();
        await userAccount.openUserAccountMenu();
        await since('The user should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.getUserName())
            .toBe('Administrator User');
        await userAccount.closeUserAccountMenu();
        await libraryPage.openDossier(dashboard.name);
        await dossierPage.waitForDossierLoading();
        await takeScreenshot('TC99524_01', 'Open Dossier with RS256 JWT system prompt mapping');
    });

    it('[TC99524_02] JWT token in URL header and open dashboard directly _ PS384 token', async () => {
        if (!session) {
            console.log('Creating new session for JWT configuration set test...');
            session = await getSession(mstrUser);
        }
        const result = await jwtPage.testJWTConfigSetup(
            mstrUser,
            baseUrl,
            'PS384',
            customPayload_PS384,
            customConfig_PS384
        );
        currentJWTToken = result.generatedJWT;
        await jwtPage.testJWTLogin(baseUrl, currentJWTToken.token, 'PS384');
        const loginJson = {
            loginMode: 67108864,
            applicationType: 0,
            password: currentJWTToken.token,
        };
        const jsonStr = JSON.stringify(loginJson);
        const base64Str = Buffer.from(jsonStr).toString('base64');
        const urlEncoded = encodeURIComponent(base64Str);
        const loginUrl = `${baseUrl}/app/B7CA92F04B9FAE8D941C3E9B7E0CD754/8154998B41AE3328BBB70692605904E4/K3?token=${urlEncoded}&sessionMode=stateless&redirect=false`;
        console.log('Login URL:', loginUrl);
        await browser.newWindow(loginUrl);
        await libraryPage.waitForLibraryLoading();
        await dossierPage.waitForDossierLoading();
        await takeScreenshot('TC99524_02', 'Open Dossier directly with PS384 JWT system prompt mapping');
        await userAccount.openUserAccountMenu();
        await since('The user should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.getUserName())
            .toBe('Administrator User');
        await userAccount.closeUserAccountMenu();
    });

    it('[TC99524_03] JWT token in URL header with custom application _ ES512', async () => {
        if (!session) {
            console.log('Creating new session for JWT configuration set test...');
            session = await getSession(mstrUser);
        }
        const result = await jwtPage.testJWTConfigSetup(
            mstrUser,
            baseUrl,
            'ES512',
            customPayload_ES512,
            customConfig_ES512
        );
        await browser.pause(11000); // wait for the jwt config to take effect
        currentJWTToken = result.generatedJWT;
        await jwtPage.testJWTLogin(baseUrl, currentJWTToken.token, 'ES512');
        const loginJson = {
            loginMode: 67108864,
            applicationType: 35,
            password: currentJWTToken.token,
        };
        const jsonStr = JSON.stringify(loginJson);
        const base64Str = Buffer.from(jsonStr).toString('base64');
        const urlEncoded = encodeURIComponent(base64Str);
        const loginUrl = `${baseUrl}/CustomApp?id=40A7157D77D840C6956ABF65B4B26725&token=${urlEncoded}&sessionMode=stateless&redirect=false`;
        console.log('Login URL:', loginUrl);
        await browser.newWindow(loginUrl);
        await libraryPage.waitForLibraryLoading();
        await userAccount.openUserAccountMenu();
        await since('The user should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.getUserName())
            .toBe('Administrator User');
        await userAccount.closeUserAccountMenu();
        await since('The url should contains custom app id')
            .expect(await browser.getUrl())
            .toContain('40A7157D77D840C6956ABF65B4B26725');
    });

    it('[BCSA-3324_1] JWT token in URL header with custom language - (en-US)', async () => {
        if (!session) {
            console.log('Creating new session for JWT configuration set test...');
            session = await getSession(mstrUser);
        }
        const payloadWithLanguage = {
            ...customPayload_ES512,
            preferred_language: 'en-US',
        };
        const result = await jwtPage.testJWTConfigSetup(
            mstrUser,
            baseUrl,
            'ES512',
            payloadWithLanguage,
            customConfig_ES512
        );
        await browser.pause(11000); // wait for the jwt config to take effect
        currentJWTToken = result.generatedJWT;
        await jwtPage.testJWTLogin(baseUrl, currentJWTToken.token, 'ES512');
        const loginJson = {
            loginMode: 67108864,
            applicationType: 35,
            password: currentJWTToken.token,
        };
        const jsonStr = JSON.stringify(loginJson);
        const base64Str = Buffer.from(jsonStr).toString('base64');
        // const urlEncoded = encodeURIComponent(base64Str);
        const urlEncoded = base64Str;
        const loginUrl = `${baseUrl}/CustomApp?id=40A7157D77D840C6956ABF65B4B26725&token=${urlEncoded}&sessionMode=stateless&redirect=false`;
        console.log('Login URL:', loginUrl);
        await browser.newWindow(loginUrl);
        await libraryPage.waitForLibraryLoading();
        await userAccount.openUserAccountMenu();
        await since('The user should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.getUserName())
            .toBe('Administrator User');

        await libraryPage.openPreferencePanel();
        await since('Language should be #{expected}, while we got #{actual}')
            .expect(await userPreference.selectedPreference('My Language'))
            .toBe('English (United States)');
        await since('The url should contains custom app id')
            .expect(await browser.getUrl())
            .toContain('40A7157D77D840C6956ABF65B4B26725');
    });
});
