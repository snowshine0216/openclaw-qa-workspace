import {
    loginLibrary,
    logoutLibrary,
    enableServerSettings,
    disableServerSettings,
    configureUserSystemPrompts,
    clearUserSystemPrompts,
    getUserSystemPrompts,
    executeReport,
} from '../../../api/systemprompts/SystemPromptRest.js';
import users from '../../../testData/users.json' assert { type: 'json' };
import getSessionFromCurrentBrowser from '../../../utils/getSessionFromCurrentBrowser.js';

/*
BR-2217: Verify whether Library Web OIDC Authentication - Azure - without "User Attribute Mapping", using persisted system prompts
Run in Local: 
    npm run regression -- --baseUrl=https://emm1.labs.microstrategy.com:6543/MicroStrategyLibrary/ --xml=specs/regression/config/SystemPromptsRestApi.config.xml --params.loginType=Custom --params.credentials.webServerUsername=admin --params.credentials.webServerPassword="" 
 */


describe('System Prompts with SSO Login Tests', () => {
    // Use the same Azure user configuration as LibraryWebOIDCAzure.spec.js
    const azureUser = users['EMM_SAML_Azure'];
    azureUser.credentials.password = process.env.azure_password;
    // For local testing only
    // azureUser.credentials.password = 'mstr.1234';

    const adminUser = users['administrator'];

    const baseUrl = browser.options.baseUrl;
    const userId = azureUser.id; // User ID for mexia@mstrdev.com
    let session;
    let { userAccount, libraryPage, azureLoginPage, loginPage } = browsers.pageObj1;

    const report = {
        id: '210A524648C7F18A5707D1B7E4E0B440',
        name: 'ReportWithSystemPromptFilter',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    beforeAll(async () => {
        console.log('System Prompts SSO test setup started');
        console.log(`Testing with user: ${azureUser.credentials.username}`);
        console.log(`Base URL: ${baseUrl}`);
    });

    beforeEach(async () => {
        // Setup for each test
    });
    afterEach(async () => {
        // Cleanup after each test
    });

    /**
     * Helper function to perform SSO login following Azure OIDC pattern
     */
    async function performSSOFirstLogin() {
        await azureLoginPage.loginToAzure(azureUser.credentials.username);
        await azureLoginPage.loginWithPassword(azureUser.credentials.password);
        await azureLoginPage.continueAzureLogin();
        await libraryPage.waitForLibraryLoading();

        // Verify login was successful
        await userAccount.openUserAccountMenu();
        const userName = await userAccount.getUserName();
        await userAccount.closeUserAccountMenu();

        // Get session for API calls
        session = await getSessionFromCurrentBrowser();

        return userName;
    }

    async function performSSOReLogin() {
        console.log('Performing SSO re-login...');
        await loginPage.oidcRelogin();
        // if (!(await azureLoginPage.getYesButton().isDisplayed())) {
        //     await azureLoginPage.clickNextButton();
        //     await azureLoginPage.sleep(5000);
        //     await azureLoginPage.clickSkipButton();
        // }
        await azureLoginPage.waitForLibraryLoading();
        console.log('✅ Library loading completed');

        // Verify login was successful
        await userAccount.openUserAccountMenu();
        const userName = await userAccount.getUserName();
        await userAccount.closeUserAccountMenu();
        // Get session for API calls
        session = await getSessionFromCurrentBrowser();

        return userName;
    }

    async function performSSOLogout() {
        await userAccount.openUserAccountMenu();
        await userAccount.logout();
    }

    it('[BR-2217-01] Server settings off, user without system prompt - should login successfully but open report should fail', async () => {
        console.log('🚀 System Prompts test BR-2217-01 is running...');
        await loginLibrary(baseUrl, adminUser.credentials.username, adminUser.credentials.password);
        console.log('✅ Admin login successful');

        // Step 1: Disable server settings
        await disableServerSettings(baseUrl);
        console.log('✅ Server settings disabled');

        // Step 2: Clear user system prompts
        await clearUserSystemPrompts(baseUrl, userId);
        console.log('✅ Cleared user system prompts');

        // Step 3: Verify user system prompts are empty
        const userPromptsResponse = await getUserSystemPrompts(baseUrl, userId);
        await expect(userPromptsResponse.body.systemPrompts).toEqual([]);
        console.log('✅ Verified user system prompts are empty');

        // Step 4: Logout
        await logoutLibrary(baseUrl);
        console.log('✅ Admin logged out');

        // Step 5: Login via SSO
        await performSSOFirstLogin();
        console.log('✅ SSO login successful');

        // Step 6: Try to open report with system prompt filter - should fail
        const response = await executeReport(baseUrl, session, report);
        await expect(response.statusCode).toBe(500);
        await expect(response.message).toContain('The system prompt 59 SSO Text Attribute 1 can not be resolved');
        console.log('✅ Report execution failed as expected due to missing system prompts');

        // Step 8: Logout
        await performSSOLogout();
        console.log('✅ User logged out');

        // Step 9: Admin login to verify system prompts is empty
        await loginLibrary(baseUrl, adminUser.credentials.username, adminUser.credentials.password);
        console.log('✅ Admin login successful');

        // Step 7: Verify system prompt is empty via API
        const finalPromptsResponse = await getUserSystemPrompts(baseUrl, userId);
        await expect(finalPromptsResponse.body.systemPrompts).toEqual([]);
        console.log('✅ Confirmed system prompts remain empty');

        await logoutLibrary(baseUrl);
        console.log('✅ Admin logged out');
    });

    it('[BR-2217-02] Server settings off, user with system prompt - should login successfully but open report should fail', async () => {
        console.log('🚀 System Prompts test BR-2217-02 is running...');
        await loginLibrary(baseUrl, adminUser.credentials.username, adminUser.credentials.password);
        console.log('✅ Admin login successful');

        // Step 1: Disable server settings
        await disableServerSettings(baseUrl);
        console.log('✅ Server settings disabled');

        // Step 2: Set user system prompts
        const systemPrompts = [
            {
                index: 59,
                prompt: 'Aaby',
            },
        ];
        await configureUserSystemPrompts(baseUrl, userId, systemPrompts);
        console.log('✅ Configured user system prompts');

        // Step 3: Verify user system prompts are not empty
        const userPromptsResponse = await getUserSystemPrompts(baseUrl, userId);
        await expect(userPromptsResponse.body.systemPrompts).toEqual(systemPrompts);
        console.log('✅ Verified user system prompts are not empty');

        // Step 4: Logout
        await logoutLibrary(baseUrl);
        console.log('✅ Admin logged out');

        // Step 5: Login via SSO
        await performSSOReLogin();
        console.log('✅ SSO login successful');

        // Step 6: Try to open report with system prompt filter - should fail
        const response = await executeReport(baseUrl, session, report);
        await expect(response.statusCode).toBe(500);
        await expect(response.message).toContain('The system prompt 59 SSO Text Attribute 1 can not be resolved');
        console.log('✅ Report execution failed as expected due to missing system prompts');

        // Step 8: Logout
        await performSSOLogout();
        console.log('✅ User logged out');

        // Step 9: Admin login to verify system prompts is empty
        await loginLibrary(baseUrl, adminUser.credentials.username, adminUser.credentials.password);
        console.log('✅ Admin login successful');

        // Step 7: Verify system prompt is not empty via API
        const finalPromptsResponse = await getUserSystemPrompts(baseUrl, userId);
        await expect(finalPromptsResponse.body.systemPrompts).toEqual(systemPrompts);
        console.log('✅ Confirmed system prompts remain not empty');

        await logoutLibrary(baseUrl);
        console.log('✅ Admin logged out');
    });

    it('[BR-2217-03] Server settings on, user without system prompt - should login successfully but report should fail', async () => {
        console.log('🚀 System Prompts test BR-2217-03 is running...');
        await loginLibrary(baseUrl, adminUser.credentials.username, adminUser.credentials.password);
        console.log('✅ Admin login successful');

        // Step 1: Enable server settings
        await enableServerSettings(baseUrl);
        console.log('✅ Server settings enabled');

        // Step 2: Clear user system prompts
        await clearUserSystemPrompts(baseUrl, userId);
        console.log('✅ Cleared user system prompts');

        // Step 3: Verify user system prompts are empty
        const userPromptsResponse = await getUserSystemPrompts(baseUrl, userId);
        await expect(userPromptsResponse.body.systemPrompts).toEqual([]);
        console.log('✅ Verified user system prompts are empty');

        // Step 4: Logout
        await logoutLibrary(baseUrl);
        console.log('✅ Admin logged out');

        // Step 5: Login via SSO
        await performSSOReLogin();
        console.log('✅ SSO login successful');

        // Step 6: Try to open report with system prompt filter - should fail
        const response = await executeReport(baseUrl, session, report);
        await expect(response.statusCode).toBe(500);
        await expect(response.message).toContain('The system prompt 59 SSO Text Attribute 1 can not be resolved');
        console.log('✅ Report execution failed as expected due to missing system prompts');

        // Step 8: Logout
        await performSSOLogout();
        console.log('✅ User logged out');

        // Step 9: Admin login to verify system prompts is empty
        await loginLibrary(baseUrl, adminUser.credentials.username, adminUser.credentials.password);
        console.log('✅ Admin login successful');

        // Step 7: Verify system prompts are empty via API
        const finalPromptsResponse = await getUserSystemPrompts(baseUrl, userId);
        await expect(finalPromptsResponse.body.systemPrompts).toEqual([]);
        console.log('✅ Confirmed system prompts remain empty');

        await logoutLibrary(baseUrl);
        console.log('✅ Admin logged out');
    });

    it('[BR-2217-04] Server settings on, user with system prompt - should login successfully and report should succeed', async () => {
        console.log('🚀 System Prompts test BR-2217-04 is running...');
        await loginLibrary(baseUrl, adminUser.credentials.username, adminUser.credentials.password);
        console.log('✅ Admin login successful');

        // Step 1: Enable server settings
        await enableServerSettings(baseUrl);
        console.log('✅ Server settings enabled');

        // Step 2: Set user system prompts
        const systemPrompts = [
            {
                index: 59,
                prompt: 'Aaby',
            },
        ];
        await configureUserSystemPrompts(baseUrl, userId, systemPrompts);
        console.log('✅ Configured user system prompts');

        // Step 3: Verify user system prompts are not empty
        const userPromptsResponse = await getUserSystemPrompts(baseUrl, userId);
        await expect(userPromptsResponse.body.systemPrompts).toEqual(systemPrompts);
        console.log('✅ Verified user system prompts are not empty');

        // Step 4: Logout
        await logoutLibrary(baseUrl);
        console.log('✅ Admin logged out');

        // Step 5: Login via SSO
        await performSSOReLogin();
        console.log('✅ SSO login successful');

        // Step 6: Try to open report with system prompt filter - should succeed
        const response = await executeReport(baseUrl, session, report);
        await expect(response.statusCode).toBe(200);
        console.log('✅ Report execution succeeded as expected with system prompts');

        // Step 8: Logout
        await performSSOLogout();
        console.log('✅ User logged out');

        // Step 9: Admin login to verify system prompts are not empty
        await loginLibrary(baseUrl, adminUser.credentials.username, adminUser.credentials.password);
        console.log('✅ Admin login successful');

        // Step 7: Verify system prompt is not empty via API
        const finalPromptsResponse = await getUserSystemPrompts(baseUrl, userId);
        await expect(finalPromptsResponse.body.systemPrompts).toEqual(systemPrompts);
        console.log('✅ Confirmed system prompts remain not empty');

        // Cleanup: Clear user system prompts
        await clearUserSystemPrompts(baseUrl, userId);
        console.log('✅ Cleared user system prompts for cleanup');

        await logoutLibrary(baseUrl);
        console.log('✅ Admin logged out');
    });
});
