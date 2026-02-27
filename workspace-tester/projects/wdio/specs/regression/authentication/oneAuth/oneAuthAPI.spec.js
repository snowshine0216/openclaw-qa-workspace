import users from '../../../../testData/users.json' assert { type: 'json' };
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import { fetchApiSessions, refreshAccessToken, revokeRefreshToken } from '../../../../api/oneAuth/oneAuth.js';
/**
 * samesite = None, cors = All, trust relationship is created for environment
 * Embedding page: http://emm.labs.microstrategy.com:8000/embedding.html
 
 * Dashboard url: https://emm2.labs.microstrategy.com:5433/MicroStrategyLibrary/app/B7CA92F04B9FAE8D941C3E9B7E0CD754/BDC3CA6811E7F6E342400080EFF58353
 * Run in Local: npm run regression -- --xml=specs/regression/config/Authentication_OneAuthEmbedding.config.xml --baseUrl=https://emm2.labs.microstrategy.com:5433/MicroStrategyLibrary/ --params.embeddingUrl=http://emm.labs.microstrategy.com:8000/embedding.html --params.credentials.webServerUsername=admin --params.credentials.webServerPassword=""

 * Dashboard url: https://emm2.labs.microstrategy.com:2399/MicroStrategyLibrary/app/B7CA92F04B9FAE8D941C3E9B7E0CD754/FCF2320A42AF79BE9F08518AB38A0C5D
 * Run in Local: npm run regression -- --xml=specs/regression/config/Authentication_OneAuthEmbedding.config.xml --baseUrl=https://emm2.labs.microstrategy.com:2399/MicroStrategyLibrary/ --params.embeddingUrl=http://emm.labs.microstrategy.com:8000/embedding.html --params.credentials.webServerUsername=admin --params.credentials.webServerPassword="" --params.partitioned=true
 */

describe('Test One Authentication through API', () => {
    const user = users['EMM_standard'].credentials;
    const CLIENT_ID = 'client-id';
    const CLIENT_SECRET = 'secret';
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

    it('[TC97780_01] Verify one auth login api - oauth2/authorize', async () => {
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
        const res = await fetchApiSessions(accessToken);
        await since('The response should contain #{expected}, instead we have #{actual}')
            .expect(JSON.stringify(res.data))
            .toContain('fullName');
    });
    it('[TC97780_02] Verify refresh access token using refresh token api - oauth2/token', async () => {
        const refresh_response = await refreshAccessToken(refreshToken, CLIENT_ID, CLIENT_SECRET);
        const accessToken_new = refresh_response.access_token;
        const refreshToken_new = refresh_response.refresh_token;
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
        const res_with_new_access_token = await fetchApiSessions(accessToken_new);
        await since('The response should contain #{expected}, instead we have #{actual}')
            .expect(JSON.stringify(res_with_new_access_token.data))
            .toContain('fullName');
        // check api/sessions with previous access token
        const res_with_previous_access_token = await fetchApiSessions(accessToken);
        await since('The response should contain #{expected}, instead we have #{actual}')
            .expect(JSON.stringify(res_with_previous_access_token.data))
            .toContain("The user's session has expired, please reauthenticate");
        // check refresh access token with previous refresh token
        const res_with_previous_refresh_token = await refreshAccessToken(refreshToken, CLIENT_ID, CLIENT_SECRET);
        await since('The response should contain #{expected}, instead we have #{actual}')
            .expect(JSON.stringify(res_with_previous_refresh_token))
            .toContain('invalid_grant');
        refreshToken = refreshToken_new;
        accessToken = accessToken_new;
    });
    it('[TC97780_03] Verify revoke refresh token api - oauth2/revoke', async () => {
        const revoke_response_status = await revokeRefreshToken(refreshToken, CLIENT_ID, CLIENT_SECRET);
        await since('The response status should be #{expected}, instead we have #{actual}')
            .expect(revoke_response_status)
            .toBe(200);
        // check api/sessions with current access token
        const res_with_access_token = await fetchApiSessions(accessToken);
        await since('The response should contain #{expected}, instead we have #{actual}')
            .expect(JSON.stringify(res_with_access_token.data))
            .toContain("The user's session has expired, please reauthenticate");
    });
});
