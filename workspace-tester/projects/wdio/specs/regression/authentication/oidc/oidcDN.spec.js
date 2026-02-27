import users from '../../../../testData/users.json' assert { type: 'json' };
import getUserInfo from '../../../../api/getUserInfo.js';

/*
Run in Local: npm run regression -- --baseUrl=https://mci-3mfe8-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --spec=specs/regression/authentication/oidc/oidcDN.spec.js --params.credentials.username=mstr --params.credentials.password="L7erb4.DWtLy" --params.credentials.webServerUsername=admin --params.credentials.webServerPassword="" --params.loginType=Custom
*/

describe('OIDC DN added', () => {
    const user = users['3mfe8_admin'];
    const oktaUser = users['EMM_OKTA_User2'];
    oktaUser.credentials.password = process.env.okta_password;
    const customApp = {
        OIDCAppLevelRegistration: {
            id: '66D9DB71353642D1B1191C3B55907C63',
        },
    };

    let { userAccount, libraryPage, loginPage } = browsers.pageObj1;
    let userInfor;

    it('[BCSA-3166_01] Validate OIDC authentication workflow on OKTA with DN', async () => {
        console.log('🚀 BCSA-3166_01 is running...');
        const { OIDCAppLevelRegistration } = customApp;

        const OIDC = OIDCAppLevelRegistration;

        await libraryPage.openCustomAppById({ id: OIDC.id, check_flag: false });
        await loginPage.oktaLogin(oktaUser.credentials);
        await libraryPage.waitForLibraryLoading();
        await userAccount.openUserAccountMenu();
        await since('The user should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.getUserName())
            .toContain('nwang');
        await userAccount.closeUserAccountMenu();
    });

    it('[BCSA-3166_02] Validate OIDC trusted id', async () => {
        console.log('🚀 BCSA-3166_02 is running...');
        userInfor = await getUserInfo({
            credentials: user.credentials,
            userId: '80C271F07748789E000AC4859BE801CD',
        });
        await since(`trustId should be nwang@microstrategy.com, but got ${userInfor.trustId}`)
            .expect(userInfor.trustId)
            .toBe('nwang@microstrategy.com');
    });

    it('[BCSA-3166_03] Validate OIDC DN', async () => {
        console.log('🚀 BCSA-3166_03 is running...');
        await since(`dn should be dn, but got ${userInfor.ldapdn}`)
            .expect(userInfor.ldapdn)
            .toBe('CN=Wang\\, Ning,OU=Users,OU=MicroStrategy Enterprise,DC=corp,DC=microstrategy,DC=com');
    });

    it('[BCSA-3166_04] Validate oidc group distinguished name', async () => {
        const membershipNames = userInfor.memberships.map((m) => m.name);
        await since(`Expected memberships to contain All(China), but got ${JSON.stringify(membershipNames)}`)
            .expect(membershipNames)
            .toContain('All (China)');
    });

    it('[BCSA-3166_05] Validate oidc group distinguished name with second group', async () => {
        const membershipNames = userInfor.memberships.map((m) => m.name);
        await since(`Expected memberships to contain All(Engineering), but got ${JSON.stringify(membershipNames)}`)
            .expect(membershipNames)
            .toContain('All (Engineering)');
    });
});
