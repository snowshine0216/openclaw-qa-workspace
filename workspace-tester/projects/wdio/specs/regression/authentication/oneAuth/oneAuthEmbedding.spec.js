import users from '../../../../testData/users.json' assert { type: 'json' };
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import { fetchApiSessions } from '../../../../api/oneAuth/oneAuth.js';
/**
 * samesite = None, cors = All, trust relationship is created for environment
 * Embedding page: http://emm.labs.microstrategy.com:8000/embedding.html
 
 * Dashboard url: https://emm2.labs.microstrategy.com:5433/MicroStrategyLibrary/app/B7CA92F04B9FAE8D941C3E9B7E0CD754/BDC3CA6811E7F6E342400080EFF58353
 * Run in Local: npm run regression -- --xml=specs/regression/config/Authentication_OneAuthEmbedding.config.xml --baseUrl=https://emm2.labs.microstrategy.com:5433/MicroStrategyLibrary/ --params.embeddingUrl=http://emm.labs.microstrategy.com:8000/embedding.html --params.credentials.webServerUsername=admin --params.credentials.webServerPassword=""

 * Dashboard url: https://emm2.labs.microstrategy.com:2399/MicroStrategyLibrary/app/B7CA92F04B9FAE8D941C3E9B7E0CD754/FCF2320A42AF79BE9F08518AB38A0C5D
 * Run in Local: npm run regression -- --xml=specs/regression/config/Authentication_OneAuthEmbedding.config.xml --baseUrl=https://emm2.labs.microstrategy.com:2399/MicroStrategyLibrary/ --params.embeddingUrl=http://emm.labs.microstrategy.com:8000/embedding.html --params.credentials.webServerUsername=admin --params.credentials.webServerPassword="" --params.partitioned=true
 */

describe('Test One Authentication through embedding', () => {
    const user = users['EMM_standard'].credentials;
    let accessToken, refreshToken;
    let { oneAuthEmbeddingPage, libraryPage, loginPage, dossierPage } = browsers.pageObj1;

    beforeAll(async () => {
        await browser.url(browsers.params.embeddingUrl);
        if (browsers.params.partitioned) {
            await oneAuthEmbeddingPage.changeDashboardURL(
                `${browser.options.baseUrl}app/B7CA92F04B9FAE8D941C3E9B7E0CD754/FCF2320A42AF79BE9F08518AB38A0C5D`
            );
        }
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC97176_01] Verify one auth login - oauth2/authorize', async () => {
        // login with one auth
        await oneAuthEmbeddingPage.clickOneAuthLoginButton();
        await libraryPage.switchToNewWindow();
        await loginPage.standardInputCredential({ username: user.username, password: user.password });
        await loginPage.getLoginButton().click();
        await oneAuthEmbeddingPage.waitForPopupWindowDisappear();
        await libraryPage.switchToTab(0);
        // dossier is loaded, get access token and refresh token
        await oneAuthEmbeddingPage.switchToLibraryIframe();
        await dossierPage.waitForDossierLoading();
        await oneAuthEmbeddingPage.waitForEmbeddedDossierLoading();
        await since('The Dossier should be displayed #{expected}, instead we have #{actual}')
            .expect(await oneAuthEmbeddingPage.isDashboardPresent())
            .toBe(true);
        await browser.switchToFrame(null);
        accessToken = await oneAuthEmbeddingPage.fetchAccessTokenValue();
        refreshToken = await oneAuthEmbeddingPage.fetchRefreshTokenValue();
        await since('The access token should be #{expected}, instead we have #{actual}')
            .expect(accessToken)
            .not.toEqual('undefined');
        await since('The refresh token should be #{expected}, instead we have #{actual}')
            .expect(refreshToken)
            .not.toEqual('undefined');
        // check api/sessions with access token
        await oneAuthEmbeddingPage.clickGetAPISessionsButton();
        await browser.pause(1000); // wait for api call to complete
        const response = await oneAuthEmbeddingPage.fetchResponse();
        await since('The response should contain #{expected}, instead we have #{actual}')
            .expect(response)
            .toContain('fullName');
    });
    it('[TC97176_02] Verify refresh access token using refresh token - oauth2/token', async () => {
        await oneAuthEmbeddingPage.clickRefreshAccessTokenButton();
        await browser.pause(1000); // wait for api call to complete
        const accessToken_new = await oneAuthEmbeddingPage.fetchAccessTokenValue();
        const refreshToken_new = await oneAuthEmbeddingPage.fetchRefreshTokenValue();
        // access token and refresh token is changed
        await since('The access token should be #{expected}, instead we have #{actual}')
            .expect(accessToken_new)
            .not.toEqual('undefined');
        await since('The refresh token should be #{expected}, instead we have #{actual}')
            .expect(refreshToken_new)
            .not.toEqual('undefined');
        await since('The access token should be different after refresh')
            .expect(accessToken !== accessToken_new)
            .toBe(true);
        await since('The refresh token should be different after refresh')
            .expect(refreshToken !== refreshToken_new)
            .toBe(true);
        // check api/sessions with new access token
        await oneAuthEmbeddingPage.clickGetAPISessionsButton();
        await browser.pause(1000); // wait for api call to complete
        const response = await oneAuthEmbeddingPage.fetchResponse();
        await since('The response should be #{expected}, instead we have #{actual}')
            .expect(response)
            .toContain('fullName');
        await since('The access token should be the newer')
            .expect(await oneAuthEmbeddingPage.fetchAccessTokenValue())
            .toBe(accessToken_new);
        // check api/sessions with previous access token
        const res = await fetchApiSessions(accessToken);
        await since('The response should contain #{expected}, instead we have #{actual}')
            .expect(JSON.stringify(res.data))
            .toContain("The user's session has expired, please reauthenticate");
    });
    it('[TC97176_03] Verify revoke refresh token  - oauth2/revoke', async () => {
        await oneAuthEmbeddingPage.clickRevokeTokenButton();
        await browser.pause(1000); // wait for api call to complete
        let response = await oneAuthEmbeddingPage.fetchResponse();
        await since('The response should be #{expected}, instead we have #{actual}').expect(response).toBe('true');
        // check api/sessions with current access token
        await oneAuthEmbeddingPage.clickGetAPISessionsButton();
        await browser.pause(1000); // wait for api call to complete
        response = await oneAuthEmbeddingPage.fetchResponse();
        await since('The response should contain #{expected}, instead we have #{actual}')
            .expect(response)
            .toContain("The user's session has expired, please reauthenticate");
    });
    it('[TC97176_04] Verify one auth login after revoke', async () => {
        await oneAuthEmbeddingPage.clickOneAuthLoginButton();
        if (browsers.params.partitioned) {
            // partitioned is enabled, parent session and pop up tab session is not shared, only parent session is cleared
            // pop up window will show once and then quickly disappear
            await oneAuthEmbeddingPage.switchToLibraryIframe();
            await dossierPage.waitForDossierLoading();
            await oneAuthEmbeddingPage.waitForEmbeddedDossierLoading();
            await since('The Dossier should be displayed #{expected}, instead we have #{actual}')
                .expect(await oneAuthEmbeddingPage.isDashboardPresent())
                .toBe(true);
        } else {
            // partitioned is disabled, sessions are shared for both tab, clear both sessions
            await libraryPage.switchToNewWindow();
            await since('There should be more than 1 tab')
                .expect((await loginPage.getBrowserTabs()).length)
                .toBeGreaterThan(1);
            await loginPage.waitForLoginView();
        }
    });
});
