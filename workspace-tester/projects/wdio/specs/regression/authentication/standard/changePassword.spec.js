import resetUserPassword from '../../../../api/resetUserPassword.js';
import users from '../../../../testData/users.json' assert { type: 'json' };
import { takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';

describe('Change Password', () => {
    let { userAccount, libraryPage, loginPage, changePasswordPage } = browsers.pageObj1;
    const admin = users['EMM_web_automation_administrator'];
    const user = users['tester_auto_auth'];
    const newPwd = 'newPassword123!@#';
    const TC80553_user = users['TC80553'];
    const no_library = users['no_library'];
    const expiredUser = users['userExpiredPw'];

    const standardCustomAppid = '369CD4A59DC54B92A302F26117FCA890';

    beforeAll(async () => {
        await resetUserPassword({ credentials: admin.credentials, userId: user.id, requireNewPassword: true });
        await resetUserPassword({ credentials: admin.credentials, userId: TC80553_user.id, requireNewPassword: true });
        await resetUserPassword({ credentials: admin.credentials, userId: no_library.id, requireNewPassword: true });
    });

    afterAll(async () => {
        await resetUserPassword({ credentials: admin.credentials, userId: user.id, requireNewPassword: true });
        await resetUserPassword({ credentials: admin.credentials, userId: no_library.id, requireNewPassword: true });
    });

    beforeEach(async () => {
        await browser.url(new URL('auth/ui/loginPage', browser.options.baseUrl).toString(), 100000);
        await loginPage.waitForCurtainDisappear();
        await loginPage.waitForLoginView();
    });

    it('[TC16580] Password Change on Login Page ', async () => {
        // Login with user
        await changePasswordPage.login({ username: user.credentials.username, password: '' });

        // Change password with incorrect old password
        await changePasswordPage.changePasswordWithInvalidCredentials();
        await since('Change password error box presence is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await changePasswordPage.isChangePasswordErrorBoxDisplayed())
            .toBe(true);
        await since('Change password error box text is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await changePasswordPage.changePasswordErrorMsg())
            .toEqual('Incorrect username and/or password. Please try again.');
        await changePasswordPage.dismissChangePasswordErrorMessage();
        await changePasswordPage.clearPasswordForm();

        // Change password with inconsistent passwords
        await changePasswordPage.changePassword('', 'newPassword', 'newPassword1');
        await since(
            'The confirm password and new password are not consistent, so is the done button clickable should be #{expected}, instead we have #{actual}.'
        )
            .expect(await changePasswordPage.isDoneButtonClickable())
            .toEqual(false);
        await since('The error message should be #{expected}, instead we have #{actual}.')
            .expect(await changePasswordPage.getChangePwdFooterText())
            .toEqual(`The two passwords don't match.`);
        await changePasswordPage.clearPasswordForm();

        // New password is same with old password
        await changePasswordPage.changePassword('newPassword', 'newPassword', 'newPassword');
        await since(
            'New password is same with old password, so is the done button clickable should be #{expected}, instead we have #{actual}.'
        )
            .expect(await changePasswordPage.isDoneButtonClickable())
            .toEqual(false);
        await changePasswordPage.clearPasswordForm();

        // Change a password
        await changePasswordPage.changePassword('', newPwd, newPwd);
        await libraryPage.waitForItemLoading();

        // Verify if the password has been changed
        await libraryPage.openUserAccountMenu();
        await libraryPage.logout();
        await loginPage.login({ username: user.credentials.username, password: newPwd });
        await libraryPage.openUserAccountMenu();
        await since('The user should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.getUserName())
            .toBe(user.credentials.username);
        await libraryPage.logout();
    });

    it('[TC80553] Verify error handling when password does not meet the policy in developer in Library ', async () => {
        // Login with user
        await changePasswordPage.login({ username: TC80553_user.credentials.username, password: '' });

        // Change password
        await changePasswordPage.changePassword('', 'TC80552_1', 'TC80552_1');
        await takeScreenshotByElement(
            changePasswordPage.getChangePasswordErrorBox(),
            'TC80553',
            'Does not meet policy'
        );
    });

    it('[TC80562] Verify error handling when user does not have use Library privilege after changing password ', async () => {
        // Login with user
        await changePasswordPage.login({ username: no_library.credentials.username, password: '' });

        // Change password
        await changePasswordPage.changePassword('', 'TC80552_1', 'TC80552_1');
        await changePasswordPage.changePasswordFinished();
        await takeScreenshotByElement(loginPage.getLoginErrorBox(), 'TC80562', 'No Library privilege', {
            tolerance: 0.7,
        });
    });

    it('[TC80561] Check change password workflow when password is expired ', async () => {
        // Login with user
        await changePasswordPage.login({
            username: expiredUser.credentials.username,
            password: expiredUser.credentials.password,
        });

        // Change password page shows
        await since('Change password page should display')
            .expect(await changePasswordPage.isChangePasswordDisplayed())
            .toBe(true);
    });

    it('[TC86314] Validate login custom app with user must change password', async () => {
        await resetUserPassword({ credentials: admin.credentials, userId: user.id, requireNewPassword: true });
        await libraryPage.openCustomAppById({ id: standardCustomAppid });
        await loginPage.login(user.credentials);

        // Change password page shows
        await changePasswordPage.changePassword('', newPwd, newPwd);
        await libraryPage.waitForItemLoading();

        // After changing the password, should display the custom app
        await libraryPage.openUserAccountMenu();
        await since('The user should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.getUserName())
            .toBe(user.credentials.username);
        await libraryPage.closeUserAccountMenu();
        await since('The url should contains custom app id')
            .expect(await libraryPage.currentURL())
            .toContain(standardCustomAppid);
    });
});
