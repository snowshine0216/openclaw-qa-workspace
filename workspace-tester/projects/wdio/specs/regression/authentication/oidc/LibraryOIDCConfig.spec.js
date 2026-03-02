import authentication from '../../../../api/authentication.js';
import logout from '../../../../api/logout.js';
import urlParser from '../../../../api/urlParser.js';
import { getOIDCConfig, createOIDCConfig, updateOIDCConfig, deleteOIDCConfig } from '../../../../api/oidc/OIDCRest.js';
import users from '../../../../testData/users.json' assert { type: 'json' };

describe('Verify OIDC Configuration Management', () => {
    const adminUser = users['admin_windows'].credentials;
    const baseUrl = urlParser(browser.options.baseUrl);
    const oidcConfigId = '5BFA5667490744CA9D8C6AADD272E567';
    let session;

    // Base config template (use your provided config as template)
    const baseConfigTemplate = {
        mstrIam: false,
        blockAutoProvisioning: false,
        id: oidcConfigId,
        vendor: {
            name: 'others',
            version: '0',
        },
        issuer: 'http://emm3.labs.microstrategy.com:28080/realms/myrealm',
        clientId: 'oidcweb',
        clientSecret: 'clientSecret',
        nativeClientId: 'oidcnative',
        redirectUri: 'https://localhost:8443/MicroStrategy/auth/oidc/login',
        workstationRedirectHost: 'loopback-ip',
        globalLogout: true,
        scopes: ['openid', 'profile', 'email', 'offline_access'],
        claimMap: {
            fullName: 'name',
            loginName: 'email',
            userId: 'email',
            email: 'email',
            groups: 'these\\are\\nested\\groups',
            distinguishedName: 'dn',
            groupFormat: 'simple', // This is what we'll be testing
        },
        adminGroups: ['Everyone'],
        systemPromptMap: {
            59: {
                claim: 'employeeName',
                type: 'text',
            },
            82: {
                claim: 'viewage',
                type: 'numeric',
            },
            72: {
                claim: 'gender',
                type: 'text',
            },
            90: {
                claim: 'localdate',
                type: 'date',
            },
            93: {
                claim: 'isodate',
                type: 'date',
            },
            94: {
                claim: 'date',
                type: 'date',
            },
        },
        default: true,
    };

    beforeAll(async () => {
        console.log('🔐 Creating authentication session...');
        session = await authentication({
            baseUrl,
            authMode: 1,
            credentials: adminUser,
        });
        console.log('✅ Session created successfully');
        try {
            await getOIDCConfig({ baseUrl, session: session, configId: oidcConfigId });
            console.log('ℹ️ OIDC config already exists');
        } catch (error) {
            if (error.statusCode === 404) {
                console.log('ℹ️ OIDC config not found, creating...');
                await createOIDCConfig({ baseUrl, session: session, config: baseConfigTemplate });
            } else {
                throw error;
            }
        }
    });

    afterAll(async () => {
        if (session) {
            console.log('🚪 Logging out...');
            await logout({ baseUrl, session });
            console.log('✅ Logout successful');
        }
    });

    it('[BCSA-3103_01] should reject invalid group format', async () => {
        console.log('🚀 Testing invalid group format...');

        // Test invalid group format in claimMap using base template
        const invalidConfig = {
            ...baseConfigTemplate,
            claimMap: {
                ...baseConfigTemplate.claimMap,
                groupFormat: 'invalidFormat', // Invalid group format
            },
        };

        console.log('📝 Attempting to update with invalid group format:', invalidConfig.claimMap.groupFormat);

        // Attempt to update with invalid group format - should fail
        try {
            await updateOIDCConfig({
                baseUrl,
                session,
                configId: oidcConfigId,
                config: invalidConfig,
            });

            // If we reach here, the test should fail
            throw new Error('Expected update to fail with invalid group format');
        } catch (error) {
            // Verify that the error is due to invalid group format
            console.log('📝 Update failed as expected:', error.message);
            await expect(error.statusCode).toBe(400); // Bad Request
            console.log('✅ Invalid group format correctly rejected');
        }

        // Verify config was not changed by checking current state
        const verifyConfig = await getOIDCConfig({ baseUrl, session, configId: oidcConfigId });
        await expect(verifyConfig.claimMap.groupFormat).not.toBe('invalidFormat');
        console.log('✅ Configuration remained unchanged after invalid update attempt');

        console.log('🏁 Invalid group format test completed');
    });

    it('[BCSA-3103_02] should accept valid group format - simple', async () => {
        console.log('🚀 Testing valid group format: simple...');

        // Test valid group format: simple in claimMap using base template
        const validConfig = {
            ...baseConfigTemplate,
            claimMap: {
                ...baseConfigTemplate.claimMap,
                groupFormat: 'simple',
            },
        };

        console.log('📝 Updating config with valid group format:', validConfig.claimMap.groupFormat);

        // Update with valid group format - should succeed
        await updateOIDCConfig({
            baseUrl,
            session,
            configId: oidcConfigId,
            config: validConfig,
        });
        console.log('✅ Update with "simple" group format successful');

        // Verify the configuration was updated
        const updatedConfig = await getOIDCConfig({ baseUrl, session, configId: oidcConfigId });
        await expect(updatedConfig.claimMap.groupFormat).toBe('simple');
        console.log('✅ Configuration verified - group format is "simple"');

        console.log('🏁 Valid group format "simple" test completed');
    });

    it('[BCSA-3103_03] should accept valid group format - distinguishedName', async () => {
        console.log('🚀 Testing valid group format: distinguishedName...');

        // Test valid group format: distinguishedName in claimMap using base template
        const validConfig = {
            ...baseConfigTemplate,
            claimMap: {
                ...baseConfigTemplate.claimMap,
                groupFormat: 'distinguishedName',
            },
        };

        console.log('📝 Updating config with valid group format:', validConfig.claimMap.groupFormat);

        // Update with valid group format - should succeed
        await updateOIDCConfig({
            baseUrl,
            session,
            configId: oidcConfigId,
            config: validConfig,
        });
        console.log('✅ Update with "distinguishedName" group format successful');

        // Verify the configuration was updated
        const updatedConfig = await getOIDCConfig({ baseUrl, session, configId: oidcConfigId });
        await expect(updatedConfig.claimMap.groupFormat).toBe('distinguishedName');
        console.log('✅ Configuration verified - group format is "distinguishedName"');

        console.log('🏁 Valid group format "distinguishedName" test completed');
    });

    it('[BCSA-3103_04] should accept valid config with optional properties only', async () => {
        console.log('🚀 Testing valid config with optional properties only...');

        // Test valid minimal config with only required and some optional properties
        const minimalValidConfig = {
            mstrIam: false,
            blockAutoProvisioning: false,
            id: oidcConfigId,
            issuer: 'http://emm3.labs.microstrategy.com:28080/realms/myrealm',
            clientId: 'oidcweb',
            redirectUri: 'https://localhost:8443/MicroStrategy/auth/oidc/login',
            scopes: ['openid', 'profile', 'email', 'offline_access'],
            claimMap: {
                userId: 'email',
            },
            default: true,
        };

        console.log('📝 Updating config with minimal valid configuration');

        // Update with minimal valid config - should succeed
        await updateOIDCConfig({
            baseUrl,
            session,
            configId: oidcConfigId,
            config: minimalValidConfig,
        });
        console.log('✅ Update with minimal valid config successful');

        // Verify the configuration was updated
        const updatedConfig = await getOIDCConfig({ baseUrl, session, configId: oidcConfigId });
        await expect(updatedConfig.claimMap.userId).toBe('email');
        await expect(updatedConfig.issuer).toBe('http://emm3.labs.microstrategy.com:28080/realms/myrealm');
        await expect(updatedConfig.clientId).toBe('oidcweb');
        console.log('✅ Configuration verified - minimal valid config applied successfully');

        console.log('🏁 Valid minimal config test completed');
    });

    it('[BCSA-3103_05] should reject config with missing required claimMap.userId', async () => {
        console.log('🚀 Testing invalid config with missing claimMap.userId...');

        // Test invalid config missing required claimMap.userId
        const invalidConfig = {
            mstrIam: false,
            blockAutoProvisioning: false,
            id: oidcConfigId,
            issuer: 'http://emm3.labs.microstrategy.com:28080/realms/myrealm',
            clientId: 'oidcweb',
            redirectUri: 'https://localhost:8443/MicroStrategy/auth/oidc/login',
            scopes: ['openid', 'profile', 'email', 'offline_access'],
            claimMap: {
                // Missing required userId property
                fullName: 'name',
                email: 'email',
            },
            default: true,
        };

        console.log('📝 Attempting to update with missing claimMap.userId');

        // Attempt to update with missing userId - should fail
        try {
            await updateOIDCConfig({
                baseUrl,
                session,
                configId: oidcConfigId,
                config: invalidConfig,
            });

            // If we reach here, the test should fail
            throw new Error('Expected update to fail with missing claimMap.userId');
        } catch (error) {
            // Verify that the error is due to missing userId
            console.log('📝 Update failed as expected:', error.message);
            await expect(error.statusCode).toBe(400); // Bad Request
            console.log('✅ Missing claimMap.userId correctly rejected');
        }

        // Verify config was not changed by checking current state
        const verifyConfig = await getOIDCConfig({ baseUrl, session, configId: oidcConfigId });
        await expect(verifyConfig.claimMap.userId).toBeDefined();
        console.log('✅ Configuration remained unchanged after invalid update attempt');

        console.log('🏁 Missing claimMap.userId test completed');
    });

    it('[BCSA-3103_06] should reject deletion of server IAM configuration', async () => {
        console.log('🚀 Testing OIDC config deletion...');

        console.log('📝 Attempting to delete server IAM configuration');

        // Attempt to delete server IAM config - should fail with 400
        try {
            await deleteOIDCConfig({
                baseUrl,
                session,
                configId: oidcConfigId,
            });

            // If we reach here, the test should fail
            throw new Error('Expected deletion to fail for server IAM configuration');
        } catch (error) {
            // Verify that the error is due to server IAM config restriction
            console.log('📝 Deletion failed as expected:', error.message);
            await expect(error.statusCode).toBe(400); // Bad Request
            console.log('✅ Server IAM configuration deletion correctly rejected');
        }

        console.log('🏁 OIDC config deletion test completed');
    });

    it('[BCSA-3331_01] should successfully update OIDC configuration with language mappings', async () => {
        console.log('🚀 Testing OIDC config update with language mappings...');

        // Update config to include language attribute mapping
        const configWithLanguageMapping = {
            ...baseConfigTemplate,
            claimMap: {
                ...baseConfigTemplate.claimMap,
                language: 'preferred_language',
            },
        };

        console.log('📝 Updating config with language attribute mapping');
        await updateOIDCConfig({
            baseUrl,
            session,
            configId: oidcConfigId,
            config: configWithLanguageMapping,
        });

        // Verify the update was successful
        const updatedConfig = await getOIDCConfig({ baseUrl, session, configId: oidcConfigId });
        await expect(updatedConfig.claimMap.language).toBe('preferred_language');
        console.log('✅ Configuration updated with language attribute mapping successfully');

        console.log('🏁 OIDC config update with language mappings test completed');
    });
});
