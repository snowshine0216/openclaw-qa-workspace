import users from '../../../../testData/users.json' assert { type: 'json' };
import getUserInfo from '../../../../api/getUserInfo.js';

/*
Run in Local: npm run regression -- --baseUrl=https://emm.labs.microstrategy.com:6262/MicroStrategyLibrary/ --spec=specs/regression/authentication/Trust/TrustedDN.spec.js --params.credentials.username=desparzaclient --params.credentials.password=!1qaz --params.credentials.webServerUsername=admin --params.credentials.webServerPassword="" --params.loginType=Custom
*/

describe('Trust DN added', () => {
    const user = users['administrator'];
    it('[BCSA-3166] Validate Trust authentication on PingFederate with DN', async () => {
        console.log('🚀 BCSA-3166 is running...');
        const userInfor = await getUserInfo({
            credentials: user.credentials,
            userId: 'ED8CA99842F85243E35822BEE9ECF18E',
        });
        await since(`trustId should be desparzaClient, but got ${userInfor.trustId}`)
            .expect(userInfor.trustId)
            .toBe('desparzaClient');
        await since(`dn should be dn, but got ${userInfor.ldapdn}`)
            .expect(userInfor.ldapdn)
            .toBe('CN=desparzaClient,OU=Labs Users,OU=SSO Users,DC=labs,DC=microstrategy,DC=com');
    });
});
