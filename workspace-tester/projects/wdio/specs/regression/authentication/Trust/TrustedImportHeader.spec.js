import users from '../../../../testData/users.json' assert { type: 'json' };
import getUserInfo from '../../../../api/getUserInfo.js';
/*
Run in Local: npm run regression -- --baseUrl=https://tec-l-1028813.labs.microstrategy.com:8093/trustedImport/ --spec=specs/regression/authentication/Trust/TrustedImportHeader.spec.js --params.credentials.username=desparzaclient --params.credentials.password=!1qaz --params.credentials.webServerUsername=admin --params.credentials.webServerPassword="" --params.loginType=Custom
*/

describe('Trust import', () => {
    const user1 = users['EMM_trusted_pingFederate'];
    const adminUser = users['admin_windows'];

    let userAccount, libraryPage, pingFederateLoginPage;
    let userInfor;
    beforeAll(async () => {
        ({ userAccount, libraryPage, pingFederateLoginPage } = browsers.pageObj1);
        const url = 'https://emm.labs.microstrategy.com:2072/MicroStrategyLibrary/';
        userInfor = await getUserInfo({
            credentials: adminUser.credentials,
            userId: 'C450C25D440E416555ACC492A8562E24',
            baseUrl: url,
        });
    });

    it('[BCSA-3167_01] Validate Trust import with new parameters', async () => {
        // login successfully
        await pingFederateLoginPage.login(user1.credentials.username, user1.credentials.password);
        await pingFederateLoginPage.clickTrustLoginButton();
        await libraryPage.waitForLibraryLoading();
        await userAccount.openUserAccountMenu();
        await since('The user should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.getUserName())
            .toBe('desparzaClient');
        await userAccount.closeUserAccountMenu();
    });

    it('[BCSA-3167_02] Validate Trust import with new parameters', async () => {
        await since(`trustId should be desparzaClient, but got ${userInfor.trustId}`)
            .expect(userInfor.trustId)
            .toBe('desparzaClient');
    });
    it('[BCSA-3167_03] Validate Trust import with new parameters', async () => {
        await since(`dn should be dn, but got ${userInfor.ldapdn}`)
            .expect(userInfor.ldapdn)
            .toBe('CN=desparzaClient,OU=Labs Users,OU=SSO Users,DC=labs,DC=microstrategy,DC=com');
    });
    it('[BCSA-3167_04] Validate Trust import with new parameters', async () => {
        await since(`username should be desparzaClient, but got ${userInfor.username}`)
            .expect(userInfor.username)
            .toBe('desparzaClient');
    });
    it('[BCSA-3167_05] Validate Trust import with new parameters', async () => {
        const membershipNames = userInfor.memberships.map((m) => m.name);
        await since(`Expected memberships to contain Managers, but got ${JSON.stringify(membershipNames)}`)
            .expect(membershipNames)
            .toContain('Managers');
    });
    it('[BCSA-3167_06] Validate Trust import with new parameters', async () => {
        await since(`defaultEmailAddress should be desparzaClient, but got ${userInfor.defaultEmailAddress}`)
            .expect(userInfor.defaultEmailAddress)
            .toBe('desparzaClient@labs.microstrategy.com');
    });
});
