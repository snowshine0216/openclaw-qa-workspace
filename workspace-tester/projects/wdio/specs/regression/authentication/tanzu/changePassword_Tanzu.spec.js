import resetUserPassword from '../../../../api/resetUserPassword.js';
import { takeScreenshot } from '../../../../utils/TakeScreenshot.js';

describe('Change Password', () => {
    const admin = {
        credentials: {
            username: browsers.params.credentials.webServerUsername,
            password: browsers.params.credentials.webServerPassword,
        },
    };
    const user = {
        id: '3A976629F2450130DEADAC905A5F565D',
        credentials: {
            username: 'mustChangePwd',
            password: 'Newman1#',
        },
    };
    const newPwd = 'newPassword123!@#';

    let { userAccount, libraryPage, loginPage, changePasswordPage } = browsers.pageObj1;

    beforeAll(async () => {
        // Reset User password by api
        await resetUserPassword({
            credentials: admin.credentials,
            userId: user.id,
            password: user.credentials.password,
            requireNewPassword: true,
        });
    });

    afterAll(async () => {
        await resetUserPassword({
            credentials: admin.credentials,
            userId: user.id,
            password: user.credentials.password,
            requireNewPassword: false,
        });
    });

    it('[TC82050] [Tanzu] Library Web - Change password ', async () => {
        // This Tanzu environment enable both Standard and OIDC modes, so we need to sign in as OIDC user then logout to login standard user
        // Login then logout with OIDC user
        await loginPage.oktaLogin(browsers.params.credentials);
        await libraryPage.waitForLibraryLoading();
        await libraryPage.openUserAccountMenu();
        await libraryPage.logout();

        // Login with user which must change password
        await changePasswordPage.login({ username: user.credentials.username, password: user.credentials.password });
        await takeScreenshot('TC82050', 'Change Password UI');

        // Change password with incorrect old password
        await changePasswordPage.changePasswordWithInvalidCredentials();
        await takeScreenshot('TC82050', 'Incorrect Old Password');
        await since('Change password error box presence is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await changePasswordPage.isChangePasswordErrorBoxDisplayed())
            .toBe(true);
        await since('Change password error box text is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await changePasswordPage.changePasswordErrorMsg())
            .toEqual('Incorrect username and/or password. Please try again.');
        await changePasswordPage.dismissChangePasswordErrorMessage();
        await changePasswordPage.clearPasswordForm();

        // Change password with inconsistent passwords
        await changePasswordPage.changePassword(user.credentials.password, 'newPassword', 'newPassword1');
        await since(
            'The confirm password and new password are not consistent, so is the done button clickable should be #{expected}, instead we have #{actual}.'
        )
            .expect(await changePasswordPage.isDoneButtonClickable())
            .toEqual(false);
        await since('The error message should be #{expected}, instead we have #{actual}.')
            .expect(await changePasswordPage.getChangePwdFooterText())
            .toEqual(`The two passwords don't match.`);
        await changePasswordPage.clearPasswordForm();

        // Change a password
        await changePasswordPage.changePassword(user.credentials.password, newPwd, newPwd);

        // Verify if the password has been changed
        await libraryPage.openUserAccountMenu();
        await libraryPage.logout();
        await loginPage.login({ username: user.credentials.username, password: newPwd });
        await libraryPage.waitForLibraryLoading();
        await libraryPage.openUserAccountMenu();
        await since('The user should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.getUserName())
            .toBe(user.credentials.username);
        await userAccount.closeUserAccountMenu();
    });
});
