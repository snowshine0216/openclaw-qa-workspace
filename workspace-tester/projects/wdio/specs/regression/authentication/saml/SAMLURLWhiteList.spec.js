import { takeScreenshot } from '../../../../utils/TakeScreenshot.js';
/*
Test environment: EMM team server
Run in local: npm run regression -- --baseUrl=https://emm.labs.microstrategy.com:1856/MicroStrategyLibrary/ --xml=specs/regression/config/Authentication_SAML_URLWhiteList.config.xml --params.loginType=Custom --params.credentials.webServerUsername=admin --params.credentials.webServerPassword=""
Tomcat, Azure, URL WhiteList block
*/

describe('SAML Azure', () => {
    it('[TC78843] Validate SAML URL WhiteList', async () => {
        await browser.url(browser.options.baseUrl);
        await takeScreenshot('TC78843', 'SAML redirect URI is blocked');
    });
});
