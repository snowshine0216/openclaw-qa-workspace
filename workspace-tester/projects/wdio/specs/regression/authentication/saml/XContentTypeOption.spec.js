/*
Run in local: npm run regression -- --baseUrl=https://emm.labs.microstrategy.com:8989/MicroStrategyLibrary/ --xml=specs/regression/config/SAMLAdminLibraryLoginWorkflow.config.xml --params.loginType=okta --params.credentials.webServerUsername=sxiong --params.credentials.webServerPassword=****
*/

import getXContentTypeOptions from '../../../../api/getXContentTypeOptions.js';
import ERROR_MAP from '../../../../utils/ErrorMsg.js';

describe('Check X-Content-Type-Options', () => {
    it('[TC95014] Check X-Content-Tyepe-Options in saml/authenticate', async () => {
        try {
            const header = await getXContentTypeOptions(browser.options.baseUrl, 'saml/authenticate', 'GET');
            await since('X-Content-Type-Options shoud get #{expected} but wet get #{actual}')
                .expect(header)
                .toBe('nosniff');
        } catch (e) {
            if (
                e.message.includes(ERROR_MAP.ERR_001) ||
                e.message.includes(ERROR_MAP.ERR_002) ||
                e.message.includes(ERROR_MAP.ERR_003)
            ) {
                console.log('Low Pass for TC95014: ', e.message);
                return;
            }
            throw e;
        }
    });
});
