import users from '../../../../testData/users.json' assert { type: 'json' };
import getUserName from '../../../../api/getUserName.js';
/**
 * samesite = None, cors = All, trust relationship is created for environment
 * Embedding page: https://emm1.labs.microstrategy.com:3303/test/get_tokens_local.html
 * Run in Local: npm run regression -- --spec=specs/regression/authentication/oauthApi/oauth2API.spec.js --baseUrl=https://mci-jlonq-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --params.embeddingUrl=https://emm1.labs.microstrategy.com:3303/test/get_tokens_local.html --params.credentials.webServerUsername=admin --params.credentials.webServerPassword="" --params.loginType=Custom
 */

describe('Test One Authentication through embedding', () => {
    const user = users['EMM_standard'].credentials;
    const id = 'B79A8476C745D1238C048A9CF049CC78';
    let { oneAuthApiPage, libraryPage, loginPage } = browsers.pageObj1;

    beforeAll(async () => {
        await browser.url(browsers.params.embeddingUrl);
    });

    it('[TC99196_01] Verify one auth login - get accessToken and refresh Token', async () => {
        // login with one auth
        await oneAuthApiPage.clickGetAccessTokenButton();
        await libraryPage.switchToTab(1);
        await loginPage.standardInputCredential({ username: user.username, password: user.password });
        await loginPage.getLoginButton().click();
        await libraryPage.switchToTab(0);
        await since('The access token should be #{expected}, instead we have #{actual}')
            .expect(await oneAuthApiPage.getAccessTokenValue())
            .not.toEqual('undefined');
        await since('The refresh token should be #{expected}, instead we have #{actual}')
            .expect(await oneAuthApiPage.getRefreshTokenValue())
            .not.toEqual('undefined');
    });
    it('[TC99196_02] Verify refresh access token using refresh token', async () => {
        const accessToken = await oneAuthApiPage.getAccessTokenValue();
        const refreshToken = await oneAuthApiPage.getRefreshTokenValue();
        await oneAuthApiPage.clickRefreshAccessTokenButton();
        await browser.pause(2000);
        await since('The access token should be updated #{expected}, instead we have #{actual}')
            .expect(await oneAuthApiPage.getAccessTokenValue())
            .not.toEqual(accessToken);
        await since('The refresh token should be same #{expected}, instead we have #{actual}')
            .expect(await oneAuthApiPage.getRefreshTokenValue())
            .toEqual(refreshToken);
    });
    it('[TC99196_03] Verify one auth login - get user info with access token', async () => {
        const username = await getUserName({
            token: await oneAuthApiPage.getAccessTokenValue(),
            userId: id,
        });
        await since('The username should be #{expected}, instead we have #{actual}')
            .expect(username)
            .toEqual(user.username);
    });
    it('[TC99196_04] Verify one auth login - get user info with refreshed access token', async () => {
        await oneAuthApiPage.clickRefreshAccessTokenButton();
        await browser.pause(2000);
        const username = await getUserName({
            token: await oneAuthApiPage.getAccessTokenValue(),
            userId: id,
        });
        await since('The username should be #{expected}, instead we have #{actual}')
            .expect(username)
            .toEqual(user.username);
    });
    it('[TC99196_05] Verify one auth login - could not login with invalid access token', async () => {
        const accessTokenInvalid = await oneAuthApiPage.getAccessTokenValue();
        await oneAuthApiPage.clickRefreshAccessTokenButton();
        await browser.pause(2000);
        const error = await getUserName({
            token: accessTokenInvalid,
            userId: id,
        });
        await since('The error message should be #{expected}, instead we have #{actual}')
            .expect(error.message)
            .toContain("The user's session has expired, please reauthenticate");
    });
});
