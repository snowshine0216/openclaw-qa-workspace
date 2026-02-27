import users from '../../../../testData/users.json' assert { type: 'json' };
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import { fetchApiSessions } from '../../../../api/oneAuth/oneAuth.js';
/**
 * samesite = None, cors = All, trust relationship is created for environment
 * Embedding page: http://emm.labs.microstrategy.com:8001/embedding.html
 
 * Dashboard url: https://mci-jlonq-dev.hypernow.microstrategy.com/MicroStrategyLibrary/app/CE52831411E696C8BD2F0080EFD5AF44/E6B8F6990F4470622AB8E0A1C5DAC11E
 * Run in Local: npm run regression -- --spec=specs/regression/authentication/oauth2/oauth2Embedding.spec.js --baseUrl=https://mci-jlonq-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --params.embeddingUrl=http://emm.labs.microstrategy.com:8001/embedding.html --params.credentials.webServerUsername=admin --params.credentials.webServerPassword="" --params.loginType=Custom

 * Dashboard url: https://mci-jlonq-dev.hypernow.microstrategy.com/MicroStrategyLibrary/app/CE52831411E696C8BD2F0080EFD5AF44/E6B8F6990F4470622AB8E0A1C5DAC11E
 * Run in Local: npm run regression -- --spec=specs/regression/authentication/oauth2/oauth2Embedding.spec.js --baseUrl=https://mci-jlonq-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --params.embeddingUrl=http://emm.labs.microstrategy.com:8001/embedding.html --params.credentials.webServerUsername=mstr --params.credentials.webServerPassword="z2~4d8_mimfN" --params.loginType=Custom
 */

describe('Test One Authentication through embedding', () => {
    const user = users['EMM_standard'].credentials;
    let accessToken, refreshToken;
    let { oneAuthEmbeddingPage, libraryPage, loginPage, dossierPage } = browsers.pageObj1;

    beforeAll(async () => {
        await browser.url(browsers.params.embeddingUrl);
        if (browsers.params.partitioned) {
            await oneAuthEmbeddingPage.changeDashboardURL(
                `${browser.options.baseUrl}app/CE52831411E696C8BD2F0080EFD5AF44/E6B8F6990F4470622AB8E0A1C5DAC11E`
            );
        }
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC99127_01] Verify one auth login - oauth2/authorize', async () => {
        // login with one auth
        await oneAuthEmbeddingPage.clickOneAuthLoginButton();
        await oneAuthEmbeddingPage.waitForPopupWindowAppear();
        // await browser.pause(10000); // wait for pop up window to open
        await libraryPage.switchToNewWindow();
        await loginPage.waitForLoginView();
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
        // check api/sessions with access token
        await oneAuthEmbeddingPage.clickGetAPISessionsButton();
        await browser.pause(6000); // wait for api call to complete
        const response = await oneAuthEmbeddingPage.fetchResponse();
        await since('The response should contain #{expected}, instead we have #{actual}')
            .expect(response)
            .toContain('fullName');
    });
    it('[TC99127_02] Verify refresh access token using refresh token - oauth2/token not set refresh token', async () => {
        await oneAuthEmbeddingPage.clickRefreshAccessTokenButton();
        await browser.pause(5000); // wait for api call to complete
        const accessToken_new = await oneAuthEmbeddingPage.fetchAccessTokenValue();
        const refreshToken_new = await oneAuthEmbeddingPage.fetchRefreshTokenValue();
        // access token and refresh token is changed
        await since('The access token should be #{expected}, instead we have #{actual}')
            .expect(accessToken_new)
            .toEqual('undefined');
        await since('The refresh token should be #{expected}, instead we have #{actual}')
            .expect(refreshToken_new)
            .toEqual('undefined');
    });
});
