import { buildSAMLConfigUrl } from '../../../../utils/index.js';
import getBasicAuthRespone from '../../../../api/getBasicAuthResponse.js';
/**
 * Run in local: npm run regression -- --baseUrl=https://emm1.labs.microstrategy.com:8099/MicroStrategyLibrary/ --xml=specs/regression/config/SAMLConfigPageCredential.config.xml --params.credentials.webServerUsername=admin --params.credentials.webServerPassword=""
 */

describe('SAML config page credential', () => {
    let status;

    const samlConfigUrl = buildSAMLConfigUrl();
    const admin = 'admin:';
    const wrongPw = 'admin:wrong';

    it('[TC76145] Validate tomcat basic authentication on Library saml config page', async () => {
        status = await getBasicAuthRespone(samlConfigUrl, wrongPw);
        await since('Wrong pass login shoud get #{expected} but wet get #{actual}')
            .expect(await status)
            .toBe(401);
        status = await getBasicAuthRespone(samlConfigUrl, admin);
        await since('Admin pass login shoud get #{expected} but wet get #{actual}')
            .expect(await status)
            .toBe(200);
    });
});
