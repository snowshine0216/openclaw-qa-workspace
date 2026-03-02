import trustedLogin from '../../../../api/trustedLogin.js';
import getUserId from '../../../../api/getUserId.js';
import getUserInfo from '../../../../api/getUserInfo.js';
import authentication from '../../../../api/authentication.js';
import logout from '../../../../api/logout.js';
import deleteUser from '../../../../api/deleteUser.js';
import urlParser from '../../../../api/urlParser.js';
import users from '../../../../testData/users.json' assert { type: 'json' };

/**
 * Verify Trusted authentication User Import functionality
 * Run in Local: npm run regression -- regression --baseUrl=https://emm.labs.microstrategy.com:2309/trustedImport --params.loginType=Custom --xml specs/regression/config/Authentication_Trust_API.config.xml
 * Required available auth modes: Standard(1) and Trusted(64)
 * Settings on custom_security.properties:
 * EncodingMethod=UTF-8
 * GroupFormat=distinguishedName
 * GroupSeparator=, (comma+space, workaround for PingFederate concating multiple group DNs)
 */
describe('Verify Trusted authentication User Import', () => {
    const adminUser = users['jlonq-admin'].credentials;
    const baseUrl = urlParser(browser.options.baseUrl);

    it('[BCSA-3075_1] should login successfully and import user information correctly', async () => {
        console.log('🚀 BCSA-3075 is running...');

        // Generate timestamp for unique user ID
        const timestamp = Date.now();
        let createdUserId = null; // Store user ID for cleanup

        // Prepare trust user headers (original values for verification)
        const trustUserHeaders = {
            'mstr-user-id': `bcsa-3075-${timestamp}`,
            'mstr-user-fullname': 'bcsa-3075的 测试用户📝',
            'mstr-user-email': 'bcsa-3075@example.org',
            'mstr-user-distinguished-name': `CN=bcsa-3075-${timestamp},OU=Labs Users,OU=SSO Users,DC=labs,DC=microstrategy,DC=com`,
            'mstr-user-language': 'zh-CN',
            'mstr-user-groups':
                'CN=Customers,OU=Groups,OU=Labs Users,OU=SSO Users,DC=labs,DC=microstrategy,DC=com, CN=Managers,OU=Groups,OU=Labs Users,OU=SSO Users,DC=labs,DC=microstrategy,DC=com',
        };

        const expectedGroups = ['Customers', 'Managers'];

        // Encode headers for HTTP request
        const encodedTrustUserHeaders = Object.fromEntries(
            Object.entries(trustUserHeaders).map(([key, value]) => [key, encodeURIComponent(value)])
        );

        try {
            // Step 1: Perform Trust login
            console.log('📝 Step 1: Performing Trust login with headers:');
            console.log('Original headers:', trustUserHeaders);
            const session = await trustedLogin({
                baseUrl,
                headers: encodedTrustUserHeaders,
            });

            console.log('✅ Trust login successful');

            // Step 2: Get user ID from session
            console.log('📝 Step 2: Getting user ID from session...');
            createdUserId = await getUserId({ baseUrl, session });

            console.log('✅ User ID retrieved');
            console.log('👤 User ID:', createdUserId);

            // Step 3: Get detailed user info by user object ID and verify
            console.log('📝 Step 3: Getting detailed user information...');
            const detailedUserInfo = await getUserInfo({
                credentials: adminUser,
                userId: createdUserId,
            });

            console.log('✅ Detailed user info retrieved');

            console.log('👤 Detailed User Info:', detailedUserInfo);

            // Verify user information
            console.log('📝 Step 4: Verifying user information...');

            // Verify user ID matches the expected value from headers
            await expect(detailedUserInfo.trustId).toBe(trustUserHeaders['mstr-user-id']);
            console.log('✅ User ID verification passed');

            // Verify full name matches the expected value from headers
            await expect(detailedUserInfo.fullName).toBe(trustUserHeaders['mstr-user-fullname']);
            console.log('✅ Full name verification passed');

            // Verify email matches the expected value from headers
            await expect(detailedUserInfo.defaultEmailAddress).toBe(trustUserHeaders['mstr-user-email']);
            console.log('✅ Email verification passed');

            // Verify distinguished name matches the expected value from headers
            await expect(detailedUserInfo.ldapdn).toBe(trustUserHeaders['mstr-user-distinguished-name']);
            console.log('✅ Distinguished name verification passed');

            // Verify groups membership
            // Expect memberships to be present and not empty
            await expect(detailedUserInfo.memberships).toBeDefined();
            await expect(detailedUserInfo.memberships.length).toBeGreaterThan(0);
            console.log('✅ Memberships are present and not empty');

            // Extract group names from memberships
            const actualGroupNames = detailedUserInfo.memberships.map((membership) => membership.name);
            console.log('📋 Actual group names:', actualGroupNames);

            // Verify each expected group is present in actual memberships
            for (const expectedGroup of expectedGroups) {
                const isGroupPresent = actualGroupNames.includes(expectedGroup);
                await expect(isGroupPresent).toBe(true);
                console.log(`✅ Group "${expectedGroup}" verification passed`);
            }

            console.log('✅ All group memberships verified successfully');

            console.log('🎉 All verifications passed');

            // Logout from trust session
            await logout({ baseUrl, session });
            console.log('👋 Logged out from trust session');
        } catch (error) {
            console.error('❌ Test failed:', error);
            throw error;
        } finally {
            // Cleanup: Delete the created user
            if (createdUserId) {
                try {
                    console.log('🧹 Starting cleanup process...');

                    // Step 5: Standard login as admin
                    console.log('📝 Step 5: Performing standard admin login for cleanup...');
                    const adminSession = await authentication({
                        baseUrl,
                        authMode: 1, // Standard authentication mode
                        credentials: adminUser,
                    });
                    console.log('✅ Admin login successful');

                    // Step 6: Delete the user by object ID
                    console.log('📝 Step 6: Deleting created user...');
                    await deleteUser({
                        baseUrl,
                        session: adminSession,
                        userId: createdUserId,
                    });
                    console.log('✅ User deleted successfully');

                    // Logout from admin session
                    await logout({ baseUrl, session: adminSession });
                    console.log('👋 Logged out from admin session');

                    console.log('🧹 Cleanup completed successfully');
                } catch (cleanupError) {
                    console.error('⚠️ Cleanup failed:', cleanupError);
                    // Don't throw error from cleanup to avoid masking original test results
                }
            }
        }

        console.log('🏁 BCSA-3075 completed successfully');
    });
});
