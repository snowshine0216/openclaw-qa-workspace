import users from '../../../../testData/users.json' assert { type: 'json' };
import deleteUserGroupByName from '../../../../api/deleteUserGroups.js';
import getUserGroupByName from '../../../../api/getUserGroups.js';

/*
npm run regression -- --baseUrl=https://mci-cainb-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --spec=specs/regression/authentication/oidcSystemPrompt/nestedGroup.spec.js  --params.loginType=Custom
*/
describe('OIDC nested group', () => {
    const user = users['autoSwitch'];
    const apiUser = users['EMM_api_automation'];
    const customApp = {
        specificAuthMode: {
            OIDC: {
                appId: '5F5273ABAA8740E6BBBEB9F02CF4DE0D',
            },
        },
    };

    let { libraryPage, keycloakLoginPage } = browsers.pageObj1;

    beforeEach(async () => {
        await deleteUserGroupByName({
            credentials: apiUser.credentials,
            nameBeginsList: ['custom_name'],
        });
    });
    afterEach(async () => {
        await libraryPage.openUserAccountMenu();
        await libraryPage.logout();
    });

    it('[TC97691] Verify nested group with OIDC login', async () => {
        const {
            specificAuthMode: { OIDC },
        } = customApp;

        await libraryPage.openCustomAppById({ id: OIDC.appId, check_flag: false });
        await keycloakLoginPage.login(user.credentials.username, user.credentials.password);
        await libraryPage.waitForLibraryLoading();
        await since('user groups is imported should be #{expected}, instead we have #{actual}')
            .expect(
                await getUserGroupByName({
                    credentials: apiUser.credentials,
                    nameBeginsList: ['custom_name'],
                })
            )
            .toEqual(true);
    });
});
