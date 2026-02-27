import { buildAdminUrl } from '../../../../utils/index.js';
import getBasicAuthRespone from '../../../../api/getBasicAuthResponse.js';
/*
TC78247:Verify Library Web Admin page is protected by Basic authentication after enable OIDCid_token- with "offline_access", use "id_token"- with "offline_access", use "id_token"with "offline_access", use "id_token"
Test environment:
OIDC:https://emm.labs.microstrategy.com:6199/MicroStrategyLibrary/admin
npm run regression -- --baseUrl=https://emm.labs.microstrategy.com:6199/MicroStrategyLibrary/ --xml=specs/regression/config/LibraryAdminPageAuthenticationBasic.config.xml --params.credentials.webServerUsername=admin --params.credentials.webServerPassword="" --params.loginType=custom
*/

describe('[TC78247]', () => {
    let status;
    const adminUrl = buildAdminUrl();
    const admin = 'admin:';
    const wrongPw = 'admin:wrong';

    it('[TC78247] Verify Library Web Admin page is protected by Basic authentication after enable OIDCid_token- with "offline_access', async () => {
        status = await getBasicAuthRespone(adminUrl, wrongPw);
        await since('Wrong pass login shoud get #{expected} but wet get #{actual}')
            .expect(await status)
            .toBe(401);
        status = await getBasicAuthRespone(adminUrl, admin);
        await since('Admin pass login shoud get #{expected} but wet get #{actual}')
            .expect(await status)
            .toBe(200);
    });
});
