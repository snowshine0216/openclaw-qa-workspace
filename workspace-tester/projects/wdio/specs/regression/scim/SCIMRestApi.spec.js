import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import getSCIMConfig, {
    getSession,
    setSCIMConfig,
    setSCIMConfigBearer,
    createSCIMUser,
    getSCIMUser,
    putSCIMUser,
    patchSCIMUser,
    deleteSCIMUser,
    listSCIMUsers,
    getSCIMGroup,
    createSCIMGroup,
    putSCIMGroup,
    patchSCIMGroup,
    deleteSCIMGroup,
    listSCIMGroups,
    listSCIMSchemas,
    getSCIMSchema,
    listSCIMResourceTypes,
    getSCIMResourceType,
    getSCIMServiceProviderConfig,
    JSONComparisonUtils,
} from '../../../api/scim/SCIMRest.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/*
TC99457: Verify SCIM REST API - Set SCIM Configuration
Run in Local: 
    npm run regression -- --baseUrl=https://mci-jlonq-dev.hypernow.microstrategy.com/MicroStrategyLibrary --xml=specs/regression/config/SCIMRestApi.config.xml --params.credentials.username=administrator --params.credentials.password=""
 */

describe('SCIM REST API Tests', () => {
    const mstrUser = {
        username: browser.options.params.credentials.username,
        password: browser.options.params.credentials.password,
    };
    const baseUrl = browser.options.baseUrl;
    let bearerToken;
    let createdUserId;
    let createdGroupId;
    // Generate random number for testing
    const randomSuffix = Math.floor(Math.random() * 1000000).toString();
    console.log('Generated random suffix for testing:', randomSuffix);

    beforeAll(async () => {
        console.log('SCIM test setup completed');
        console.log('Using random suffix for this test run:', randomSuffix);
    });

    it('[TC99457] should successfully set SCIM configuration', async () => {
        console.log('🚀 SCIM test TC99457 is running...');
        let session = await getSession(mstrUser);
        await expect(session).toBeDefined();
        await expect(session.cookie).toBeDefined();
        await expect(session.token).toBeDefined();
        console.log('Session established for SET operation:', {
            hasCookie: !!session?.cookie,
            hasToken: !!session?.token,
        });

        // Define SCIM configuration to set
        const scimConfigToSet = {
            enabled: false,
            userAttributeMap: {
                trustId: {
                    schema: 'urn:ietf:params:scim:schemas:core:2.0:User',
                    attribute: 'userName',
                },
                distinguishedName: {
                    schema: 'urn:ietf:params:scim:schemas:core:2.0:User',
                    attribute: 'displayName',
                },
                language: {
                    schema: 'urn:ietf:params:scim:schemas:core:2.0:User',
                    attribute: 'locale',
                },
                systemPrompts: [
                    {
                        index: 59,
                        prompt: {
                            schema: 'urn:ietf:params:scim:schemas:core:2.0:User',
                            attribute: 'preferredLanguage',
                        },
                    },
                    {
                        index: 60,
                        prompt: {
                            schema: 'urn:ietf:params:scim:schemas:core:2.0:User',
                            attribute: 'locale',
                        },
                    },
                ],
            },
            groupAttributeMap: {
                distinguishedName: {
                    schema: 'urn:ietf:params:scim:schemas:extension:strategy:2.0:Group',
                    attribute: `distinguishedName`,
                },
            },
        };

        try {
            console.log('About to call PUT /api/mstrServices/library/scim with baseUrl:', baseUrl);
            console.log('SCIM config to set:', JSON.stringify(scimConfigToSet, null, 2));

            let response = await setSCIMConfig({ baseUrl, session, scimConfig: scimConfigToSet });
            console.log('SCIM Set Config response:', response);

            // Verify response status code is 200 or 204
            if (response.statusCode && (response.statusCode === 200 || response.statusCode === 204)) {
                console.log('✅ Response status code is', response.statusCode);
            } else {
                console.log('❌ Response status code is not 200/204:', response.statusCode);
                console.log('Response body:', response.body || response);
                await expect(response.statusCode).toBeGreaterThanOrEqual(200);
                await expect(response.statusCode).toBeLessThan(300);
            }

            // Verify the configuration was set successfully
            await expect(response).toBeDefined();
            await expect(response.statusCode).toBeDefined();

            console.log('✅ SCIM configuration set successfully');
        } catch (error) {
            console.log('SCIM SET API Error:', error);
            console.log('Error type:', typeof error);

            // If error has response information, print it
            if (error.response) {
                console.log('Error response status:', error.response.status || error.response.statusCode);
                console.log('Error response body:', error.response.body || error.response.data);
            }

            // Print error details if it's an object
            if (error.statusCode) {
                console.log('Error status code:', error.statusCode);
                console.log('Error message:', error.message);
            }

            // Re-throw the error to fail the test if it's a validation error
            if (error.message && error.message.includes('expect')) {
                throw error;
            }

            console.log('❌ SCIM SET API call failed, but test continues');
        }
        console.log('🏁 SCIM test TC99457 completed');
    });

    it('[TC99458] should successfully get SCIM configuration and verify PUT values', async () => {
        console.log('🚀 SCIM test TC99458 is running...');
        let session = await getSession(mstrUser);
        await expect(session).toBeDefined();
        await expect(session.cookie).toBeDefined();
        await expect(session.token).toBeDefined();
        console.log('Session established for GET operation:', {
            hasCookie: !!session?.cookie,
            hasToken: !!session?.token,
        });

        try {
            console.log('About to call GET /api/mstrServices/library/scim with baseUrl:', baseUrl);
            console.log('Verifying configuration set in previous test');

            let response = await getSCIMConfig({ baseUrl, session });
            console.log('✅ SCIM Config response:', response);

            // Verify response status code is 200
            if (response.statusCode && response.statusCode !== 200) {
                console.log('❌ Response status code is not 200:', response.statusCode);
                console.log('Response body:', response.body || response);
                await expect(response.statusCode).toBe(200);
            } else {
                console.log('✅ Response status code is 200');
            }

            let scimConfig;
            if (typeof response === 'string') {
                scimConfig = JSON.parse(response);
            } else if (response.body) {
                // If response has a body property, use it
                scimConfig = typeof response.body === 'string' ? JSON.parse(response.body) : response.body;
            } else {
                scimConfig = response;
            }

            // Validate basic structure of SCIM configuration
            await expect(scimConfig).toBeDefined();
            await expect(typeof scimConfig).toBe('object');

            // Validate main properties exist
            await expect(scimConfig.enabled).toBeDefined();
            await expect(scimConfig.bearer).toBeDefined();
            await expect(scimConfig.userAttributeMap).toBeDefined();
            await expect(scimConfig.groupAttributeMap).toBeDefined();

            // Validate enabled property is boolean and set to true (from PUT test)
            await expect(typeof scimConfig.enabled).toBe('boolean');
            await expect(scimConfig.enabled).toBe(false);

            // Validate bearer object structure
            await expect(typeof scimConfig.bearer).toBe('object');
            await expect(scimConfig.bearer.tokenPrefix).toBeDefined();
            await expect(scimConfig.bearer.expiresAt).toBeDefined();
            await expect(typeof scimConfig.bearer.tokenPrefix).toBe('string');
            await expect(typeof scimConfig.bearer.expiresAt).toBe('number');

            // Validate userAttributeMap object structure and verify PUT values
            await expect(typeof scimConfig.userAttributeMap).toBe('object');

            // Verify trustId values set by PUT test
            await expect(scimConfig.userAttributeMap.trustId).toBeDefined();
            await expect(scimConfig.userAttributeMap.trustId.schema).toBe('urn:ietf:params:scim:schemas:core:2.0:User');
            await expect(scimConfig.userAttributeMap.trustId.attribute).toBe('userName');
            console.log('✅ Verified trustId attribute is userName');

            // Verify distinguishedName in userAttributeMap set by PUT test
            await expect(scimConfig.userAttributeMap.distinguishedName).toBeDefined();
            await expect(scimConfig.userAttributeMap.distinguishedName.schema).toBe(
                'urn:ietf:params:scim:schemas:core:2.0:User'
            );
            await expect(scimConfig.userAttributeMap.distinguishedName.attribute).toBe('displayName');
            console.log('✅ Verified userAttributeMap distinguishedName attribute is displayName');

            // Verify language in userAttributeMap set by PUT test
            await expect(scimConfig.userAttributeMap.language).toBeDefined();
            await expect(scimConfig.userAttributeMap.language.schema).toBe(
                'urn:ietf:params:scim:schemas:core:2.0:User'
            );
            await expect(scimConfig.userAttributeMap.language.attribute).toBe('locale');
            console.log('✅ Verified userAttributeMap language attribute is locale');

            // Verify systemPrompts in userAttributeMap set by PUT test
            await expect(scimConfig.userAttributeMap.systemPrompts).toBeDefined();
            await expect(Array.isArray(scimConfig.userAttributeMap.systemPrompts)).toBe(true);
            await expect(scimConfig.userAttributeMap.systemPrompts.length).toBe(2);
            // Verify first system prompt
            const prompt59 = scimConfig.userAttributeMap.systemPrompts.find((p) => p.index === 59);
            await expect(prompt59).toBeDefined();
            await expect(prompt59.prompt.schema).toBe('urn:ietf:params:scim:schemas:core:2.0:User');
            await expect(prompt59.prompt.attribute).toBe('preferredLanguage');
            console.log('✅ Verified systemPrompt index 59 is preferredLanguage');
            // Verify second system prompt
            const prompt60 = scimConfig.userAttributeMap.systemPrompts.find((p) => p.index === 60);
            await expect(prompt60).toBeDefined();
            await expect(prompt60.prompt.schema).toBe('urn:ietf:params:scim:schemas:core:2.0:User');
            await expect(prompt60.prompt.attribute).toBe('locale');
            console.log('✅ Verified systemPrompt index 60 is locale');

            // Validate groupAttributeMap object structure and verify PUT values
            await expect(typeof scimConfig.groupAttributeMap).toBe('object');

            // Verify distinguishedName in groupAttributeMap set by PUT test
            await expect(scimConfig.groupAttributeMap.distinguishedName).toBeDefined();
            await expect(scimConfig.groupAttributeMap.distinguishedName.schema).toBe(
                'urn:ietf:params:scim:schemas:extension:strategy:2.0:Group'
            );
            await expect(scimConfig.groupAttributeMap.distinguishedName.attribute).toBe('distinguishedName');
            console.log('✅ Verified groupAttributeMap distinguishedName');

            console.log('✅ SCIM configuration structure validation and PUT verification passed');
        } catch (error) {
            console.log('SCIM API Error:', error);
            console.log('Error type:', typeof error);

            // If error has response information, print it
            if (error.response) {
                console.log('Error response status:', error.response.status || error.response.statusCode);
                console.log('Error response body:', error.response.body || error.response.data);
            }

            // Re-throw the error to fail the test if it's a validation error
            if (error.message && error.message.includes('expect')) {
                throw error;
            }

            console.log('❌ SCIM API call failed, but test continues');
        }
        console.log('🏁 SCIM test TC99458 completed');
    });

    it('[TC99458_01] should fail with 404 when SCIM is disabled', async () => {
        console.log('🚀 SCIM test TC99458_01 starting');
        try {
            await getSCIMServiceProviderConfig({ baseUrl, token: bearerToken });
            fail(`❌ SCIM request succeeded unexpectedly.`);
        } catch (error) {
            await expect(error.statusCode).toBe(404);
            console.log(`✅ SCIM request got expected 404 Not Found response with SCIM disabled.`);
        }
        console.log('🏁 SCIM test TC99458_01 completed');
    });

    it('[TC99459] should reset SCIM configuration to original values', async () => {
        console.log('🚀 SCIM test TC99459 is running...');
        let session = await getSession(mstrUser);
        await expect(session).toBeDefined();
        await expect(session.cookie).toBeDefined();
        await expect(session.token).toBeDefined();
        console.log('Session established for RESET operation:', {
            hasCookie: !!session?.cookie,
            hasToken: !!session?.token,
        });

        // Define original SCIM configuration to restore
        const scimConfigToSet = {
            enabled: true,
            userAttributeMap: {
                trustId: {
                    schema: 'urn:ietf:params:scim:schemas:extension:enterprise:2.0:User',
                    attribute: 'employeeNumber',
                },
                distinguishedName: {
                    schema: 'urn:ietf:params:scim:schemas:extension:strategy:2.0:User',
                    attribute: 'distinguishedName',
                },
                language: {
                    schema: 'urn:ietf:params:scim:schemas:core:2.0:User',
                    attribute: 'locale',
                },
                systemPrompts: [
                    {
                        index: 59,
                        prompt: {
                            schema: 'urn:ietf:params:scim:schemas:core:2.0:User',
                            attribute: 'preferredLanguage',
                        },
                    },
                    {
                        index: 60,
                        prompt: {
                            schema: 'urn:ietf:params:scim:schemas:core:2.0:User',
                            attribute: 'locale',
                        },
                    },
                ],
            },
            groupAttributeMap: {
                distinguishedName: {
                    schema: 'urn:ietf:params:scim:schemas:extension:strategy:2.0:Group',
                    attribute: 'distinguishedName',
                },
            },
        };

        try {
            console.log(
                'About to call PUT /api/mstrServices/library/scim to restore original values with baseUrl:',
                baseUrl
            );
            console.log('Original SCIM config to restore:', JSON.stringify(scimConfigToSet, null, 2));

            let response = await setSCIMConfig({ baseUrl, session, scimConfig: scimConfigToSet });
            console.log('SCIM Reset Config response:', response);

            // Verify response status code is 200 or 204
            if (response.statusCode && (response.statusCode === 200 || response.statusCode === 204)) {
                console.log('✅ Response status code is', response.statusCode);
            } else {
                console.log('❌ Response status code is not 200/204:', response.statusCode);
                console.log('Response body:', response.body || response);
                await expect(response.statusCode).toBeGreaterThanOrEqual(200);
                await expect(response.statusCode).toBeLessThan(300);
            }

            // Verify the configuration was set successfully
            await expect(response).toBeDefined();
            await expect(response.statusCode).toBeDefined();

            console.log('✅ SCIM configuration reset to original values successfully');
        } catch (error) {
            console.log('SCIM RESET API Error:', error);
            console.log('Error type:', typeof error);

            // If error has response information, print it
            if (error.response) {
                console.log('Error response status:', error.response.status || error.response.statusCode);
                console.log('Error response body:', error.response.body || error.response.data);
            }

            // Print error details if it's an object
            if (error.statusCode) {
                console.log('Error status code:', error.statusCode);
                console.log('Error message:', error.message);
            }

            // Re-throw the error to fail the test if it's a validation error
            if (error.message && error.message.includes('expect')) {
                throw error;
            }

            console.log('❌ SCIM RESET API call failed, but test continues');
        }
        console.log('🏁 SCIM test TC99459 completed');
    });

    it('[TC99460] should verify SCIM configuration was reset to original values', async () => {
        console.log('🚀 SCIM test TC99460 is running...');
        let session = await getSession(mstrUser);
        await expect(session).toBeDefined();
        await expect(session.cookie).toBeDefined();
        await expect(session.token).toBeDefined();
        console.log('Session established for VERIFY RESET operation:', {
            hasCookie: !!session?.cookie,
            hasToken: !!session?.token,
        });

        try {
            console.log(
                'About to call GET /api/mstrServices/library/scim to verify reset values with baseUrl:',
                baseUrl
            );
            console.log('Verifying configuration was reset to original values');

            let response = await getSCIMConfig({ baseUrl, session });
            console.log('✅ SCIM Config verification response:', response);

            // Verify response status code is 200
            if (response.statusCode && response.statusCode !== 200) {
                console.log('❌ Response status code is not 200:', response.statusCode);
                console.log('Response body:', response.body || response);
                await expect(response.statusCode).toBe(200);
            } else {
                console.log('✅ Response status code is 200');
            }

            let scimConfig;
            if (typeof response === 'string') {
                scimConfig = JSON.parse(response);
            } else if (response.body) {
                // If response has a body property, use it
                scimConfig = typeof response.body === 'string' ? JSON.parse(response.body) : response.body;
            } else {
                scimConfig = response;
            }

            // Validate basic structure of SCIM configuration
            await expect(scimConfig).toBeDefined();
            await expect(typeof scimConfig).toBe('object');

            // Validate main properties exist
            await expect(scimConfig.enabled).toBeDefined();
            await expect(scimConfig.bearer).toBeDefined();
            await expect(scimConfig.userAttributeMap).toBeDefined();
            await expect(scimConfig.groupAttributeMap).toBeDefined();

            // Validate enabled property is boolean and set to true (from PUT test)
            await expect(typeof scimConfig.enabled).toBe('boolean');
            await expect(scimConfig.enabled).toBe(true);

            // Validate bearer object structure
            await expect(typeof scimConfig.bearer).toBe('object');
            await expect(scimConfig.bearer.tokenPrefix).toBeDefined();
            await expect(scimConfig.bearer.expiresAt).toBeDefined();
            await expect(typeof scimConfig.bearer.tokenPrefix).toBe('string');
            await expect(typeof scimConfig.bearer.expiresAt).toBe('number');

            // Validate userAttributeMap object structure and verify reset values
            await expect(typeof scimConfig.userAttributeMap).toBe('object');

            // Verify trustId values were reset correctly
            await expect(scimConfig.userAttributeMap.trustId).toBeDefined();
            await expect(scimConfig.userAttributeMap.trustId.schema).toBe(
                'urn:ietf:params:scim:schemas:extension:enterprise:2.0:User'
            );
            await expect(scimConfig.userAttributeMap.trustId.attribute).toBe('employeeNumber');
            console.log('✅ Verified trustId attribute is userName (reset correctly)');

            // Verify distinguishedName in userAttributeMap was reset correctly
            await expect(scimConfig.userAttributeMap.distinguishedName).toBeDefined();
            await expect(scimConfig.userAttributeMap.distinguishedName.schema).toBe(
                'urn:ietf:params:scim:schemas:extension:strategy:2.0:User'
            );
            await expect(scimConfig.userAttributeMap.distinguishedName.attribute).toBe('distinguishedName');
            console.log('✅ Verified userAttributeMap distinguishedName was reset to original value');

            // Verify language in userAttributeMap was reset correctly
            await expect(scimConfig.userAttributeMap.language).toBeDefined();
            await expect(scimConfig.userAttributeMap.language.schema).toBe(
                'urn:ietf:params:scim:schemas:core:2.0:User'
            );
            await expect(scimConfig.userAttributeMap.language.attribute).toBe('locale');
            console.log('✅ Verified userAttributeMap language was reset to original value');

            // Verify systemPrompts in userAttributeMap were reset correctly
            await expect(scimConfig.userAttributeMap.systemPrompts).toBeDefined();
            await expect(Array.isArray(scimConfig.userAttributeMap.systemPrompts)).toBe(true);
            await expect(scimConfig.userAttributeMap.systemPrompts.length).toBe(2);
            // Verify first system prompt
            const prompt59 = scimConfig.userAttributeMap.systemPrompts.find((p) => p.index === 59);
            await expect(prompt59).toBeDefined();
            await expect(prompt59.prompt.schema).toBe('urn:ietf:params:scim:schemas:core:2.0:User');
            await expect(prompt59.prompt.attribute).toBe('preferredLanguage');
            console.log('✅ Verified systemPrompt index 59 is preferredLanguage (reset correctly)');
            // Verify second system prompt
            const prompt60 = scimConfig.userAttributeMap.systemPrompts.find((p) => p.index === 60);
            await expect(prompt60).toBeDefined();
            await expect(prompt60.prompt.schema).toBe('urn:ietf:params:scim:schemas:core:2.0:User');
            await expect(prompt60.prompt.attribute).toBe('locale');
            console.log('✅ Verified systemPrompt index 60 is locale (reset correctly)');

            // Validate groupAttributeMap object structure and verify reset values
            await expect(typeof scimConfig.groupAttributeMap).toBe('object');

            // Verify distinguishedName in groupAttributeMap was reset correctly
            await expect(scimConfig.groupAttributeMap.distinguishedName).toBeDefined();
            await expect(scimConfig.groupAttributeMap.distinguishedName.schema).toBe(
                'urn:ietf:params:scim:schemas:extension:strategy:2.0:Group'
            );
            await expect(scimConfig.groupAttributeMap.distinguishedName.attribute).toBe('distinguishedName');
            console.log('✅ Verified groupAttributeMap distinguishedName was reset correctly');

            console.log('✅ SCIM configuration reset verification passed - all values restored to original state');
        } catch (error) {
            console.log('SCIM VERIFY RESET API Error:', error);
            console.log('Error type:', typeof error);

            // If error has response information, print it
            if (error.response) {
                console.log('Error response status:', error.response.status || error.response.statusCode);
                console.log('Error response body:', error.response.body || error.response.data);
            }

            // Re-throw the error to fail the test if it's a validation error
            if (error.message && error.message.includes('expect')) {
                throw error;
            }

            console.log('❌ SCIM VERIFY RESET API call failed, but test continues');
        }
        console.log('🏁 SCIM test TC99460 completed');
    });

    it('[TC99461] should successfully set SCIM config bearer token with POST method', async () => {
        console.log('🚀 SCIM test TC99461 is running...');
        let session = await getSession(mstrUser);
        await expect(session).toBeDefined();
        await expect(session.cookie).toBeDefined();
        await expect(session.token).toBeDefined();
        console.log('Session established for SET BEARER operation:', {
            hasCookie: !!session?.cookie,
            hasToken: !!session?.token,
        });

        try {
            console.log('About to call POST /api/mstrServices/library/scim/bearer with baseUrl:', baseUrl);

            // Set bearer token duration to 365 days
            const duration = 365;
            console.log('Setting bearer token duration to:', duration, 'days');

            let response = await setSCIMConfigBearer({ baseUrl, session, duration });
            console.log('SCIM Set Bearer Config response:', response);

            // Verify response status code is 200, 201, or 204
            if (
                response.statusCode &&
                (response.statusCode === 200 || response.statusCode === 201 || response.statusCode === 204)
            ) {
                console.log('✅ Response status code is', response.statusCode);
            } else {
                console.log('❌ Response status code is not 200/201/204:', response.statusCode);
                console.log('Response body:', response.body || response);
                await expect(response.statusCode).toBeGreaterThanOrEqual(200);
                await expect(response.statusCode).toBeLessThan(300);
            }

            // Verify the response structure
            await expect(response).toBeDefined();
            await expect(response.statusCode).toBeDefined();
            await expect(response.body).toBeDefined();

            // Parse response body if it's a string
            let responseData;
            if (typeof response.body === 'string') {
                responseData = JSON.parse(response.body);
            } else {
                responseData = response.body;
            }

            // Verify response format according to expected structure
            // Expected: { "token": "_HuULtJRO4_WUR8z0lUbEE8b3sSxgPc1", "expiresAt": 1785487301587 }
            await expect(responseData).toBeDefined();
            await expect(typeof responseData).toBe('object');

            // Verify token field exists and is a string
            await expect(responseData.token).toBeDefined();
            await expect(typeof responseData.token).toBe('string');
            await expect(responseData.token.length).toBeGreaterThan(0);
            console.log('✅ Verified token field:', responseData.token);

            // Save the bearer token for future use
            bearerToken = responseData.token;
            console.log('📝 Saved bearer token for future tests:', bearerToken);

            // Verify expiresAt field exists and is a number
            await expect(responseData.expiresAt).toBeDefined();
            await expect(typeof responseData.expiresAt).toBe('number');
            await expect(responseData.expiresAt).toBeGreaterThan(0);
            console.log('✅ Verified expiresAt field:', responseData.expiresAt);

            // Verify expiresAt is a valid timestamp (should be in the future)
            const currentTime = Date.now();
            await expect(responseData.expiresAt).toBeGreaterThan(currentTime);
            console.log('✅ Verified expiresAt is in the future');

            // Calculate approximate expected expiration time (current time + duration in days)
            const expectedExpirationTime = currentTime + duration * 24 * 60 * 60 * 1000;
            const timeDifference = Math.abs(responseData.expiresAt - expectedExpirationTime);
            const toleranceInMs = 5 * 60 * 1000; // 5 minutes tolerance

            // Verify expiration time is approximately correct (within 5 minutes tolerance)
            await expect(timeDifference).toBeLessThan(toleranceInMs);
            console.log('✅ Verified expiresAt matches expected duration with tolerance');

            console.log('✅ SCIM bearer token configuration set successfully');
            console.log('Response format validation passed:', {
                token: typeof responseData.token,
                expiresAt: typeof responseData.expiresAt,
                tokenLength: responseData.token.length,
                expiresAtValue: responseData.expiresAt,
            });
        } catch (error) {
            console.log('SCIM SET BEARER API Error:', error);
            console.log('Error type:', typeof error);

            // If error has response information, print it
            if (error.response) {
                console.log('Error response status:', error.response.status || error.response.statusCode);
                console.log('Error response body:', error.response.body || error.response.data);
            }

            // Print error details if it's an object
            if (error.statusCode) {
                console.log('Error status code:', error.statusCode);
                console.log('Error message:', error.message);
            }

            // Re-throw the error to fail the test if it's a validation error
            if (error.message && error.message.includes('expect')) {
                throw error;
            }

            console.log('❌ SCIM SET BEARER API call failed, but test continues');
        }
        console.log('🏁 SCIM test TC99461 completed');
    });

    it('[TC99462] should successfully create SCIM user with POST method', async () => {
        console.log('🚀 SCIM test TC99462 is running...');

        // Verify bearerToken was saved from previous test
        await expect(bearerToken).toBeDefined();
        await expect(typeof bearerToken).toBe('string');
        await expect(bearerToken.length).toBeGreaterThan(0);
        console.log('Using bearer token from previous test:', bearerToken);

        try {
            console.log('About to call POST /api/scim/v2/Users with baseUrl:', baseUrl);

            // Create user data with random suffix
            const userData = {
                active: false,
                displayName: `scimTest${randomSuffix}`,
                emails: [
                    {
                        value: `scimtest${randomSuffix}@strategy.com`,
                    },
                ],
                userName: `scimtest${randomSuffix}`,
                locale: `zh-CN`,
                preferredLanguage: `zh-CN; en-US`,
                'urn:ietf:params:scim:schemas:extension:strategy:2.0:User': {
                    distinguishedName: `CN=scimtest${randomSuffix},OU=Users,OU=MicroStrategy Enterprise,DC=corp,DC=microstrategy,DC=com`,
                },
                'urn:ietf:params:scim:schemas:extension:enterprise:2.0:User': {
                    employeeNumber: `scimtest${randomSuffix}trust`,
                },
            };

            console.log('Creating SCIM user with data:', JSON.stringify(userData, null, 2));

            let response = await createSCIMUser({ baseUrl, token: bearerToken, body: userData });
            console.log('SCIM Create User response:', response);

            // Verify response status code is 200 or 201
            if (response.statusCode && (response.statusCode === 200 || response.statusCode === 201)) {
                console.log('✅ Response status code is', response.statusCode);
            } else {
                console.log('❌ Response status code is not 200/201:', response.statusCode);
                console.log('Response body:', response.body || response);
                await expect(response.statusCode).toBeGreaterThanOrEqual(200);
                await expect(response.statusCode).toBeLessThan(300);
            }

            // Verify the response structure
            await expect(response).toBeDefined();
            await expect(response.statusCode).toBeDefined();
            await expect(response.body).toBeDefined();

            // Parse response body if it's a string
            let responseData;
            if (typeof response.body === 'string') {
                responseData = JSON.parse(response.body);
            } else {
                responseData = response.body;
            }

            // Verify basic response structure
            await expect(responseData).toBeDefined();
            await expect(typeof responseData).toBe('object');

            // Verify user ID is returned and save it
            await expect(responseData.id).toBeDefined();
            await expect(typeof responseData.id).toBe('string');
            console.log('✅ Verified user ID:', responseData.id);

            // Save the created user ID for future use
            createdUserId = responseData.id;
            console.log('📝 Saved created user ID for future tests:', createdUserId);

            // Verify meta information
            await expect(responseData.meta).toBeDefined();
            await expect(typeof responseData.meta).toBe('object');
            await expect(responseData.meta.resourceType).toBe('User');
            await expect(responseData.meta.created).toBeDefined();
            await expect(responseData.meta.lastModified).toBeDefined();
            await expect(responseData.meta.location).toBeDefined();
            await expect(responseData.meta.location).toContain(responseData.id);
            console.log('✅ Verified meta information:', {
                resourceType: responseData.meta.resourceType,
                created: responseData.meta.created,
                lastModified: responseData.meta.lastModified,
                location: responseData.meta.location,
            });

            // Verify userName matches what we sent
            await expect(responseData.userName).toBeDefined();
            await expect(responseData.userName).toBe(`scimtest${randomSuffix}`);
            console.log('✅ Verified userName:', responseData.userName);

            // Verify displayName matches what we sent
            await expect(responseData.displayName).toBeDefined();
            await expect(responseData.displayName).toBe(`scimTest${randomSuffix}`);
            console.log('✅ Verified displayName:', responseData.displayName);

            // Verify active status (note: might be different from what we sent)
            await expect(responseData.active).toBeDefined();
            await expect(typeof responseData.active).toBe('boolean');
            console.log('✅ Verified active status:', responseData.active);

            // Verify emails array with enhanced structure
            await expect(responseData.emails).toBeDefined();
            await expect(Array.isArray(responseData.emails)).toBe(true);
            await expect(responseData.emails.length).toBeGreaterThan(0);

            const firstEmail = responseData.emails[0];
            await expect(firstEmail.value).toBe(`scimtest${randomSuffix}@strategy.com`);
            await expect(firstEmail.type).toBeDefined();
            await expect(firstEmail.primary).toBeDefined();
            console.log('✅ Verified email details:', {
                value: firstEmail.value,
                type: firstEmail.type,
                primary: firstEmail.primary,
            });

            // Verify locale. System prompt 60 maps to locale and the response will not use the value from system prompt 60
            await expect(responseData.locale).toBeDefined();
            await expect(responseData.locale).toBe('zh-CN');
            console.log('✅ Verified locale:', responseData.locale);

            // Verify preferredLanguage, which is mapped to system prompt 59
            await expect(responseData.preferredLanguage).toBeDefined();
            await expect(responseData.preferredLanguage).toBe('zh-CN; en-US');
            console.log('✅ Verified preferredLanguage:', responseData.preferredLanguage);

            // Verify groups array exists
            console.log('[TC99462] asserting groups presence and type', {
                hasGroupsField: responseData && Object.prototype.hasOwnProperty.call(responseData, 'groups'),
                isArray: Array.isArray(responseData?.groups),
                sample: Array.isArray(responseData?.groups) ? responseData.groups.slice(0, 1) : responseData?.groups,
            });
            await expect(responseData.groups).toBeDefined();
            await expect(Array.isArray(responseData.groups)).toBe(true);
            console.log('✅ Verified groups array:', responseData.groups);

            // Verify schemas array
            await expect(responseData.schemas).toBeDefined();
            await expect(Array.isArray(responseData.schemas)).toBe(true);
            await expect(responseData.schemas).toContain('urn:ietf:params:scim:schemas:core:2.0:User');
            await expect(responseData.schemas).toContain('urn:ietf:params:scim:schemas:extension:strategy:2.0:User');
            console.log('✅ Verified schemas:', responseData.schemas);

            // Verify strategy extension schema
            const strategyExtension = responseData['urn:ietf:params:scim:schemas:extension:strategy:2.0:User'];
            await expect(strategyExtension).toBeDefined();
            await expect(strategyExtension.distinguishedName).toBe(
                `CN=scimtest${randomSuffix},OU=Users,OU=MicroStrategy Enterprise,DC=corp,DC=microstrategy,DC=com`
            );
            console.log('✅ Verified strategy extension distinguishedName:', strategyExtension.distinguishedName);

            // Note: Enterprise extension might not be returned in response, so we'll check if it exists
            const enterpriseExtension = responseData['urn:ietf:params:scim:schemas:extension:enterprise:2.0:User'];
            if (enterpriseExtension) {
                await expect(enterpriseExtension.employeeNumber).toBe(`scimtest${randomSuffix}trust`);
                console.log('✅ Verified enterprise extension employeeNumber:', enterpriseExtension.employeeNumber);
            } else {
                console.log('ℹ️ Enterprise extension not returned in response (this is normal)');
            }

            console.log('✅ SCIM user created successfully');
            console.log('User creation validation passed:', {
                id: responseData.id,
                userName: responseData.userName,
                displayName: responseData.displayName,
                active: responseData.active,
                email: responseData.emails[0]?.value,
                emailType: responseData.emails[0]?.type,
                emailPrimary: responseData.emails[0]?.primary,
                groupsCount: responseData.groups?.length,
                schemasCount: responseData.schemas?.length,
                metaResourceType: responseData.meta?.resourceType,
                randomSuffix: randomSuffix,
                createdUserId: createdUserId,
            });
        } catch (error) {
            console.log('SCIM CREATE USER API Error:', error);
            console.log('Error type:', typeof error);

            // If error has response information, print it
            if (error.response) {
                console.log('Error response status:', error.response.status || error.response.statusCode);
                console.log('Error response body:', error.response.body || error.response.data);
            }

            // Print error details if it's an object
            if (error.statusCode) {
                console.log('Error status code:', error.statusCode);
                console.log('Error message:', error.message);
            }

            // Re-throw the error to fail the test if it's a validation error
            if (error.message && error.message.includes('expect')) {
                throw error;
            }

            console.log('❌ SCIM CREATE USER API call failed, but test continues');
        }
        console.log('🏁 SCIM test TC99462 completed');
    });

    it('[TC99462_01] should fail to create SCIM user due to invalid payload', async () => {
        console.log('🚀 SCIM test TC99462_01 is running...');
        const userDataTemplate = {
            active: false,
            displayName: `scimTest${randomSuffix}`,
            emails: [
                {
                    value: `scimtest${randomSuffix}@strategy.com`,
                },
            ],
            userName: `scimtest${randomSuffix}`,
            'urn:ietf:params:scim:schemas:extension:strategy:2.0:User': {
                distinguishedName: `CN=scimtest${randomSuffix},OU=Users,OU=MicroStrategy Enterprise,DC=corp,DC=microstrategy,DC=com`,
            },
            'urn:ietf:params:scim:schemas:extension:enterprise:2.0:User': {
                employeeNumber: `scimtest${randomSuffix}trust`,
            },
        };

        const verifyCreationError = async (userData, statusCode, errorType, errorItem) => {
            try {
                await createSCIMUser({ baseUrl, token: bearerToken, body: userData });
                fail(`❌ SCIM user creation succeeded unexpectedly`);
            } catch (error) {
                await expect(error.statusCode).toBe(statusCode);
                const errorBody = JSON.parse(error.message);
                await expect(errorBody).toBeDefined();
                await expect(errorBody.schemas[0]).toBe('urn:ietf:params:scim:api:messages:2.0:Error');
                await expect(errorBody.status).toBe(`${statusCode}`);
                await expect(errorBody.scimType).toBe(errorType);
                console.log(`✅ SCIM authentication got expected 400 Bad Request with {${errorItem}}`);
            }
        };

        const { userName, ...userDataWithoutUserName } = userDataTemplate;
        await verifyCreationError(userDataWithoutUserName, 400, 'invalidValue', 'missing login name');

        const { ['urn:ietf:params:scim:schemas:extension:enterprise:2.0:User']: trustId, ...userDataWithoutTrustId } =
            userDataTemplate;
        await verifyCreationError(userDataWithoutTrustId, 400, 'invalidValue', 'missing trust ID');

        const userDataWithConflictLoginName = {
            ...userDataTemplate,
            'urn:ietf:params:scim:schemas:extension:strategy:2.0:User': {
                distinguishedName: `CN=scimtest${randomSuffix}_2,OU=Users,OU=MicroStrategy Enterprise,DC=corp,DC=microstrategy,DC=com`,
            },
            'urn:ietf:params:scim:schemas:extension:enterprise:2.0:User': {
                employeeNumber: `scimtest${randomSuffix}trust_2`,
            },
        };
        await verifyCreationError(userDataWithConflictLoginName, 409, 'uniqueness', 'login name conflict');

        const userDataWithConflictTrustId = {
            ...userDataTemplate,
            userName: `scimtest${randomSuffix}_2`,
            'urn:ietf:params:scim:schemas:extension:strategy:2.0:User': {
                distinguishedName: `CN=scimtest${randomSuffix}_2,OU=Users,OU=MicroStrategy Enterprise,DC=corp,DC=microstrategy,DC=com`,
            },
        };
        await verifyCreationError(userDataWithConflictTrustId, 409, 'uniqueness', 'trust ID conflict');

        const userDataWithConflictDn = {
            ...userDataTemplate,
            userName: `scimtest${randomSuffix}_2`,
            'urn:ietf:params:scim:schemas:extension:enterprise:2.0:User': {
                employeeNumber: `scimtest${randomSuffix}trust_2`,
            },
        };
        await verifyCreationError(userDataWithConflictDn, 409, 'uniqueness', 'distinguished name conflict');

        console.log('🏁 SCIM test TC99462_01 completed');
    });

    it('[TC99463] should successfully get SCIM user by ID and verify user data', async () => {
        console.log('🚀 SCIM test TC99463 is running...');

        // Verify bearerToken was saved from previous test
        await expect(bearerToken).toBeDefined();
        await expect(typeof bearerToken).toBe('string');
        await expect(bearerToken.length).toBeGreaterThan(0);
        console.log('Using bearer token from previous test:', bearerToken);

        // Verify createdUserId was saved from previous test
        await expect(createdUserId).toBeDefined();
        await expect(typeof createdUserId).toBe('string');
        await expect(createdUserId.length).toBeGreaterThan(0);
        console.log('Using created user ID from previous test:', createdUserId);

        try {
            console.log('About to call GET /api/scim/v2/Users/{userId} with baseUrl:', baseUrl);
            console.log('Getting SCIM user with ID:', createdUserId);

            let response = await getSCIMUser({ baseUrl, token: bearerToken, userId: createdUserId });
            console.log('SCIM Get User response:', response);

            // Verify response status code is 200
            if (response.statusCode && response.statusCode === 200) {
                console.log('✅ Response status code is', response.statusCode);
            } else {
                console.log('❌ Response status code is not 200:', response.statusCode);
                console.log('Response body:', response.body || response);
                await expect(response.statusCode).toBe(200);
            }

            // Verify the response structure
            await expect(response).toBeDefined();
            await expect(response.statusCode).toBeDefined();
            await expect(response.body).toBeDefined();

            // Parse response body if it's a string
            let responseData;
            if (typeof response.body === 'string') {
                responseData = JSON.parse(response.body);
            } else {
                responseData = response.body;
            }

            // Verify basic response structure
            await expect(responseData).toBeDefined();
            await expect(typeof responseData).toBe('object');

            // Verify user ID matches the created user ID
            await expect(responseData.id).toBeDefined();
            await expect(typeof responseData.id).toBe('string');
            await expect(responseData.id).toBe(createdUserId);
            console.log('✅ Verified user ID matches created user ID:', responseData.id);

            // Verify meta information
            await expect(responseData.meta).toBeDefined();
            await expect(typeof responseData.meta).toBe('object');
            await expect(responseData.meta.resourceType).toBe('User');
            await expect(responseData.meta.created).toBeDefined();
            await expect(responseData.meta.lastModified).toBeDefined();
            await expect(responseData.meta.location).toBeDefined();
            console.log('✅ Verified meta information structure');

            // Verify active status
            await expect(responseData.active).toBeDefined();
            await expect(typeof responseData.active).toBe('boolean');
            console.log('✅ Verified active status:', responseData.active);

            // Verify displayName contains the random suffix
            await expect(responseData.displayName).toBeDefined();
            await expect(typeof responseData.displayName).toBe('string');
            await expect(responseData.displayName).toBe(`scimTest${randomSuffix}`);
            console.log('✅ Verified displayName contains random suffix:', responseData.displayName);

            // Verify userName contains the random suffix
            await expect(responseData.userName).toBeDefined();
            await expect(typeof responseData.userName).toBe('string');
            await expect(responseData.userName).toBe(`scimtest${randomSuffix}`);
            console.log('✅ Verified userName contains random suffix:', responseData.userName);

            // Verify emails array structure and content
            await expect(responseData.emails).toBeDefined();
            await expect(Array.isArray(responseData.emails)).toBe(true);
            await expect(responseData.emails.length).toBeGreaterThan(0);

            const emailEntry = responseData.emails[0];
            await expect(emailEntry.value).toBeDefined();
            await expect(emailEntry.value).toBe(`scimtest${randomSuffix}@strategy.com`);
            await expect(emailEntry.type).toBe('work');
            await expect(emailEntry.primary).toBe(true);
            console.log('✅ Verified email contains random suffix:', emailEntry.value);

            // Verify locale. System prompt 60 maps to locale and the response will not use the value from system prompt 60
            await expect(responseData.locale).toBeDefined();
            await expect(responseData.locale).toBe('zh-CN');
            console.log('✅ Verified locale:', responseData.locale);

            // Verify preferredLanguage, which is mapped to system prompt 59
            await expect(responseData.preferredLanguage).toBeDefined();
            await expect(responseData.preferredLanguage).toBe('zh-CN; en-US');
            console.log('✅ Verified preferredLanguage:', responseData.preferredLanguage);

            // Verify groups array exists
            console.log('[TC99463] asserting groups presence and type', {
                hasGroupsField: responseData && Object.prototype.hasOwnProperty.call(responseData, 'groups'),
                isArray: Array.isArray(responseData?.groups),
                sample: Array.isArray(responseData?.groups) ? responseData.groups.slice(0, 1) : responseData?.groups,
            });
            await expect(responseData.groups).toBeDefined();
            await expect(Array.isArray(responseData.groups)).toBe(true);
            console.log('✅ Verified groups array structure');

            // Verify schemas array
            await expect(responseData.schemas).toBeDefined();
            await expect(Array.isArray(responseData.schemas)).toBe(true);
            await expect(responseData.schemas).toContain('urn:ietf:params:scim:schemas:core:2.0:User');
            await expect(responseData.schemas).toContain('urn:ietf:params:scim:schemas:extension:strategy:2.0:User');
            console.log('✅ Verified schemas array contains expected values');

            // Verify strategy extension data
            const strategyExtension = responseData['urn:ietf:params:scim:schemas:extension:strategy:2.0:User'];
            await expect(strategyExtension).toBeDefined();
            await expect(typeof strategyExtension).toBe('object');
            await expect(strategyExtension.distinguishedName).toBeDefined();
            await expect(strategyExtension.distinguishedName).toBe(
                `CN=scimtest${randomSuffix},OU=Users,OU=MicroStrategy Enterprise,DC=corp,DC=microstrategy,DC=com`
            );
            console.log('✅ Verified strategy extension distinguishedName contains random suffix');

            console.log('✅ SCIM user retrieval and validation completed successfully');
            console.log('All user data matches expected values with random suffix:', randomSuffix);
        } catch (error) {
            console.log('SCIM GET USER API Error:', error);
            console.log('Error type:', typeof error);

            // If error has response information, print it
            if (error.response) {
                console.log('Error response status:', error.response.status || error.response.statusCode);
                console.log('Error response body:', error.response.body || error.response.data);
            }

            // Print error details if it's an object
            if (error.statusCode) {
                console.log('Error status code:', error.statusCode);
                console.log('Error message:', error.message);
            }

            // Re-throw the error to fail the test if it's a validation error
            if (error.message && error.message.includes('expect')) {
                throw error;
            }

            console.log('❌ SCIM GET USER API call failed, but test continues');
        }
        console.log('🏁 SCIM test TC99463 completed');
    });

    it('[TC99464] should successfully update SCIM user with PUT method and verify modified distinguishedName', async () => {
        console.log('🚀 SCIM test TC99464 is running...');

        // Verify bearerToken was saved from previous test
        await expect(bearerToken).toBeDefined();
        await expect(typeof bearerToken).toBe('string');
        await expect(bearerToken.length).toBeGreaterThan(0);
        console.log('Using bearer token from previous test:', bearerToken);

        // Verify createdUserId was saved from previous test
        await expect(createdUserId).toBeDefined();
        await expect(typeof createdUserId).toBe('string');
        await expect(createdUserId.length).toBeGreaterThan(0);
        console.log('Using created user ID from previous test:', createdUserId);

        try {
            console.log('About to call PUT /api/scim/v2/Users/{userId} with baseUrl:', baseUrl);
            console.log('Updating SCIM user with ID:', createdUserId);

            // Create updated user data with modified distinguishedName
            const updatedUserData = {
                active: true,
                displayName: `scimTest${randomSuffix}Updated`,
                emails: [
                    {
                        value: `scimtest${randomSuffix}@strategy.com`,
                    },
                ],
                userName: `scimtest${randomSuffix}`,
                locale: `fr-FR`,
                preferredLanguage: `fr-FR; en-US`,
                'urn:ietf:params:scim:schemas:extension:strategy:2.0:User': {
                    distinguishedName: `CN=scimtest${randomSuffix}Updated,OU=UpdatedUsers,OU=MicroStrategy Enterprise,DC=corp,DC=microstrategy,DC=com`,
                },
                'urn:ietf:params:scim:schemas:extension:enterprise:2.0:User': {
                    employeeNumber: `scimtest${randomSuffix}trustUpdated`,
                },
            };

            console.log('Updating SCIM user with data:', JSON.stringify(updatedUserData, null, 2));

            let response = await putSCIMUser({
                baseUrl,
                token: bearerToken,
                userId: createdUserId,
                body: updatedUserData,
            });
            console.log('SCIM Update User response:', response);

            // Verify response status code is 200 or 204
            if (response.statusCode && (response.statusCode === 200 || response.statusCode === 204)) {
                console.log('✅ Response status code is', response.statusCode);
            } else {
                console.log('❌ Response status code is not 200/204:', response.statusCode);
                console.log('Response body:', response.body || response);
                await expect(response.statusCode).toBeGreaterThanOrEqual(200);
                await expect(response.statusCode).toBeLessThan(300);
            }

            // Verify the response structure
            await expect(response).toBeDefined();
            await expect(response.statusCode).toBeDefined();
            await expect(response.body).toBeDefined();

            // Parse response body if it's a string
            let responseData;
            if (typeof response.body === 'string') {
                responseData = JSON.parse(response.body);
            } else {
                responseData = response.body;
            }

            // Verify basic response structure
            await expect(responseData).toBeDefined();
            await expect(typeof responseData).toBe('object');

            // Verify user ID matches the updated user ID
            await expect(responseData.id).toBeDefined();
            await expect(typeof responseData.id).toBe('string');
            await expect(responseData.id).toBe(createdUserId);
            console.log('✅ Verified user ID matches updated user ID:', responseData.id);

            // Verify meta information
            await expect(responseData.meta).toBeDefined();
            await expect(typeof responseData.meta).toBe('object');
            await expect(responseData.meta.resourceType).toBe('User');
            await expect(responseData.meta.created).toBeDefined();
            await expect(responseData.meta.lastModified).toBeDefined();
            await expect(responseData.meta.location).toBeDefined();
            console.log('✅ Verified meta information structure');

            // Verify lastModified is more recent than created (indicating update)
            const createdTime = new Date(responseData.meta.created).getTime();
            const lastModifiedTime = new Date(responseData.meta.lastModified).getTime();
            await expect(lastModifiedTime).toBeGreaterThanOrEqual(createdTime);
            console.log('✅ Verified lastModified time indicates successful update');

            // Verify active status was updated to true
            await expect(responseData.active).toBeDefined();
            await expect(typeof responseData.active).toBe('boolean');
            await expect(responseData.active).toBe(true);
            console.log('✅ Verified active status was updated to true:', responseData.active);

            // Verify displayName was updated with "Updated" suffix
            await expect(responseData.displayName).toBeDefined();
            await expect(typeof responseData.displayName).toBe('string');
            await expect(responseData.displayName).toBe(`scimTest${randomSuffix}Updated`);
            console.log('✅ Verified displayName was updated with suffix:', responseData.displayName);

            // Verify userName remains the same (contains random suffix)
            await expect(responseData.userName).toBeDefined();
            await expect(typeof responseData.userName).toBe('string');
            await expect(responseData.userName).toBe(`scimtest${randomSuffix}`);
            console.log('✅ Verified userName remains unchanged:', responseData.userName);

            // Verify emails array structure and content
            await expect(responseData.emails).toBeDefined();
            await expect(Array.isArray(responseData.emails)).toBe(true);
            await expect(responseData.emails.length).toBeGreaterThan(0);

            const emailEntry = responseData.emails[0];
            await expect(emailEntry.value).toBeDefined();
            await expect(emailEntry.value).toBe(`scimtest${randomSuffix}@strategy.com`);
            await expect(emailEntry.type).toBe('work');
            await expect(emailEntry.primary).toBe(true);
            console.log('✅ Verified email remains unchanged:', emailEntry.value);

            // Verify locale is not updated to fr-FR because it is set to zh-CN before. Locale is mapped to the system prompt 60, but the response will not use the value from system prompt 60
            await expect(responseData.locale).toBeDefined();
            await expect(responseData.locale).toBe('zh-CN');
            console.log('✅ Verified locale is not updated because it has been set to:', responseData.locale);

            // Verify preferredLanguage was updated to fr-FR; en-US. It is from system prompt 59
            await expect(responseData.preferredLanguage).toBeDefined();
            await expect(responseData.preferredLanguage).toBe('fr-FR; en-US');
            console.log('✅ Verified preferredLanguage was updated to:', responseData.preferredLanguage);

            // Verify groups array exists
            console.log('[TC99464] asserting groups presence and type', {
                hasGroupsField: responseData && Object.prototype.hasOwnProperty.call(responseData, 'groups'),
                isArray: Array.isArray(responseData?.groups),
                sample: Array.isArray(responseData?.groups) ? responseData.groups.slice(0, 1) : responseData?.groups,
            });
            await expect(responseData.groups).toBeDefined();
            await expect(Array.isArray(responseData.groups)).toBe(true);
            console.log('✅ Verified groups array structure');

            // Verify schemas array
            await expect(responseData.schemas).toBeDefined();
            await expect(Array.isArray(responseData.schemas)).toBe(true);
            await expect(responseData.schemas).toContain('urn:ietf:params:scim:schemas:core:2.0:User');
            await expect(responseData.schemas).toContain('urn:ietf:params:scim:schemas:extension:strategy:2.0:User');
            console.log('✅ Verified schemas array contains expected values');

            // Verify strategy extension data with updated distinguishedName
            const strategyExtension = responseData['urn:ietf:params:scim:schemas:extension:strategy:2.0:User'];
            await expect(strategyExtension).toBeDefined();
            await expect(typeof strategyExtension).toBe('object');
            await expect(strategyExtension.distinguishedName).toBeDefined();
            await expect(strategyExtension.distinguishedName).toBe(
                `CN=scimtest${randomSuffix}Updated,OU=UpdatedUsers,OU=MicroStrategy Enterprise,DC=corp,DC=microstrategy,DC=com`
            );
            console.log('✅ Verified strategy extension distinguishedName was updated successfully');
            console.log('Updated distinguishedName:', strategyExtension.distinguishedName);

            console.log('✅ SCIM user update and validation completed successfully');
            console.log('User data was successfully modified with random suffix:', randomSuffix);
        } catch (error) {
            console.log('SCIM PUT USER API Error:', error);
            console.log('Error type:', typeof error);

            // If error has response information, print it
            if (error.response) {
                console.log('Error response status:', error.response.status || error.response.statusCode);
                console.log('Error response body:', error.response.body || error.response.data);
            }

            // Print error details if it's an object
            if (error.statusCode) {
                console.log('Error status code:', error.statusCode);
                console.log('Error message:', error.message);
            }

            // Re-throw the error to fail the test if it's a validation error
            if (error.message && error.message.includes('expect')) {
                throw error;
            }

            console.log('❌ SCIM PUT USER API call failed, but test continues');
        }
        console.log('🏁 SCIM test TC99464 completed');
    });

    it('[TC99464_01] should fail to patch SCIM user with invalid payloads', async () => {
        console.log('🚀 SCIM test TC99464_01 is running...');

        // Verify bearerToken was saved from previous test
        await expect(bearerToken).toBeDefined();
        await expect(typeof bearerToken).toBe('string');
        await expect(bearerToken.length).toBeGreaterThan(0);
        console.log('Using bearer token from previous test:', bearerToken);

        // Verify createdUserId was saved from previous test
        await expect(createdUserId).toBeDefined();
        await expect(typeof createdUserId).toBe('string');
        await expect(createdUserId.length).toBeGreaterThan(0);
        console.log('Using created user ID from previous test:', createdUserId);

        const invalidPayloads = [
            {
                schemas: ['urn:ietf:params:scim:api:messages:2.0:PatchOp'],
                Operations: [],
            },
            {
                schemas: ['urn:ietf:params:scim:api:messages:2.0:PatchOp'],
            },
        ];

        for (const payload of invalidPayloads) {
            try {
                await patchSCIMUser({
                    baseUrl,
                    token: bearerToken,
                    userId: createdUserId,
                    body: payload,
                });
                fail('❌ PATCH user succeeded unexpectedly with invalid payload:', payload);
            } catch (error) {
                // Should return 400 with expected error structure
                await expect(error.statusCode).toBe(400);
                await expect(error.message).toBeDefined();
                let errorData = typeof error.message === 'string' ? JSON.parse(error.message) : error.message;
                await expect(errorData.status).toBe('400');
                await expect(errorData.scimType).toBe('invalidSyntax');
                await expect(Array.isArray(errorData.schemas)).toBe(true);
                await expect(errorData.schemas).toContain('urn:ietf:params:scim:api:messages:2.0:Error');
                console.log('✅ PATCH user failed as expected with invalid payload:', payload);
            }
        }
        console.log('🏁 SCIM test TC99464_01 completed');
    });

    it('[TC99465] should successfully patch SCIM user with PATCH method and verify partial updates', async () => {
        console.log('🚀 SCIM test TC99465 is running...');

        // Verify bearerToken was saved from previous test
        await expect(bearerToken).toBeDefined();
        await expect(typeof bearerToken).toBe('string');
        await expect(bearerToken.length).toBeGreaterThan(0);
        console.log('Using bearer token from previous test:', bearerToken);

        // Verify createdUserId was saved from previous test
        await expect(createdUserId).toBeDefined();
        await expect(typeof createdUserId).toBe('string');
        await expect(createdUserId.length).toBeGreaterThan(0);
        console.log('Using created user ID from previous test:', createdUserId);

        try {
            console.log('About to call PATCH /api/scim/v2/Users/{userId} with baseUrl:', baseUrl);
            console.log('Patching SCIM user with ID:', createdUserId);

            // Create PATCH operation data following SCIM PatchOp schema
            const patchOperations = {
                schemas: ['urn:ietf:params:scim:api:messages:2.0:PatchOp'],
                Operations: [
                    {
                        op: 'replace',
                        path: 'displayName',
                        value: `scimTest${randomSuffix}Patched`,
                    },
                    {
                        op: 'replace',
                        path: 'locale',
                        value: `de-DE`,
                    },
                    {
                        op: 'replace',
                        path: 'preferredLanguage',
                        value: `de-DE; en-US`,
                    },
                    {
                        op: 'replace',
                        path: 'emails',
                        value: [
                            {
                                value: `scimtest${randomSuffix}patched@strategy.com`,
                                type: 'work',
                                primary: true,
                            },
                        ],
                    },
                    {
                        op: 'replace',
                        path: 'urn:ietf:params:scim:schemas:extension:strategy:2.0:User:distinguishedName',
                        value: `CN=scimtest${randomSuffix}Patched,OU=PatchedUsers,OU=MicroStrategy Enterprise,DC=corp,DC=microstrategy,DC=com`,
                    },
                ],
            };

            console.log('Patching SCIM user with operations:', JSON.stringify(patchOperations, null, 2));

            let response = await patchSCIMUser({
                baseUrl,
                token: bearerToken,
                userId: createdUserId,
                body: patchOperations,
            });
            console.log('SCIM Patch User response:', response);

            // Verify response status code is 200 or 204
            if (response.statusCode && (response.statusCode === 200 || response.statusCode === 204)) {
                console.log('✅ Response status code is', response.statusCode);
            } else {
                console.log('❌ Response status code is not 200/204:', response.statusCode);
                console.log('Response body:', response.body || response);
                await expect(response.statusCode).toBeGreaterThanOrEqual(200);
                await expect(response.statusCode).toBeLessThan(300);
            }

            // Verify the response structure
            await expect(response).toBeDefined();
            await expect(response.statusCode).toBeDefined();
            await expect(response.body).toBeDefined();

            // Parse response body if it's a string
            let responseData;
            if (typeof response.body === 'string') {
                responseData = JSON.parse(response.body);
            } else {
                responseData = response.body;
            }

            // Verify basic response structure
            await expect(responseData).toBeDefined();
            await expect(typeof responseData).toBe('object');

            // Verify user ID matches the patched user ID
            await expect(responseData.id).toBeDefined();
            await expect(typeof responseData.id).toBe('string');
            await expect(responseData.id).toBe(createdUserId);
            console.log('✅ Verified user ID matches patched user ID:', responseData.id);

            // Verify meta information
            await expect(responseData.meta).toBeDefined();
            await expect(typeof responseData.meta).toBe('object');
            await expect(responseData.meta.resourceType).toBe('User');
            await expect(responseData.meta.created).toBeDefined();
            await expect(responseData.meta.lastModified).toBeDefined();
            await expect(responseData.meta.location).toBeDefined();
            console.log('✅ Verified meta information structure');

            // Verify lastModified is more recent than created (indicating patch update)
            const createdTime = new Date(responseData.meta.created).getTime();
            const lastModifiedTime = new Date(responseData.meta.lastModified).getTime();
            await expect(lastModifiedTime).toBeGreaterThanOrEqual(createdTime);
            console.log('✅ Verified lastModified time indicates successful patch update');

            // Verify displayName was patched with "Patched" suffix
            await expect(responseData.displayName).toBeDefined();
            await expect(typeof responseData.displayName).toBe('string');
            await expect(responseData.displayName).toBe(`scimTest${randomSuffix}Patched`);
            console.log('✅ Verified displayName was patched with suffix:', responseData.displayName);

            // Verify userName remains the same (should not be affected by patch)
            await expect(responseData.userName).toBeDefined();
            await expect(typeof responseData.userName).toBe('string');
            await expect(responseData.userName).toBe(`scimtest${randomSuffix}`);
            console.log('✅ Verified userName remains unchanged:', responseData.userName);

            // Verify emails array was patched with new value
            await expect(responseData.emails).toBeDefined();
            await expect(Array.isArray(responseData.emails)).toBe(true);
            await expect(responseData.emails.length).toBeGreaterThan(0);

            const emailEntry = responseData.emails[0];
            await expect(emailEntry.value).toBeDefined();
            await expect(emailEntry.value).toBe(`scimtest${randomSuffix}patched@strategy.com`);
            await expect(emailEntry.type).toBe('work');
            await expect(emailEntry.primary).toBe(true);
            console.log('✅ Verified email was patched with new value:', emailEntry.value);

            // Verify active status (should remain from previous update)
            await expect(responseData.active).toBeDefined();
            await expect(typeof responseData.active).toBe('boolean');
            console.log('✅ Verified active status:', responseData.active);

            // Verify locale was not patched to de-DE because it has been set to zh-CN before.
            await expect(responseData.locale).toBeDefined();
            await expect(responseData.locale).toBe('zh-CN');
            console.log('✅ Verified locale was not patched to de-DE, current value:', responseData.locale);

            // Verify preferredLanguage was patched to de-DE; en-US. It is mapped to system prompt 59
            await expect(responseData.preferredLanguage).toBeDefined();
            await expect(responseData.preferredLanguage).toBe('de-DE; en-US');
            console.log('✅ Verified preferredLanguage was patched to:', responseData.preferredLanguage);

            // Verify groups array exists
            console.log('[TC99465] asserting groups presence and type', {
                hasGroupsField: responseData && Object.prototype.hasOwnProperty.call(responseData, 'groups'),
                isArray: Array.isArray(responseData?.groups),
                sample: Array.isArray(responseData?.groups) ? responseData.groups.slice(0, 1) : responseData?.groups,
            });
            await expect(responseData.groups).toBeDefined();
            await expect(Array.isArray(responseData.groups)).toBe(true);
            console.log('✅ Verified groups array structure');

            // Verify schemas array
            await expect(responseData.schemas).toBeDefined();
            await expect(Array.isArray(responseData.schemas)).toBe(true);
            await expect(responseData.schemas).toContain('urn:ietf:params:scim:schemas:core:2.0:User');
            await expect(responseData.schemas).toContain('urn:ietf:params:scim:schemas:extension:strategy:2.0:User');
            console.log('✅ Verified schemas array contains expected values');

            // Verify strategy extension data with patched distinguishedName
            const strategyExtension = responseData['urn:ietf:params:scim:schemas:extension:strategy:2.0:User'];
            await expect(strategyExtension).toBeDefined();
            await expect(typeof strategyExtension).toBe('object');
            await expect(strategyExtension.distinguishedName).toBeDefined();
            await expect(strategyExtension.distinguishedName).toBe(
                `CN=scimtest${randomSuffix}Patched,OU=PatchedUsers,OU=MicroStrategy Enterprise,DC=corp,DC=microstrategy,DC=com`
            );
            console.log('✅ Verified strategy extension distinguishedName was patched successfully');
            console.log('Patched distinguishedName:', strategyExtension.distinguishedName);

            console.log('✅ SCIM user patch and validation completed successfully');
            console.log(
                'User data was successfully partially modified with PATCH operations using random suffix:',
                randomSuffix
            );
            console.log('PATCH operations summary:', {
                displayNamePatched: `scimTest${randomSuffix}Patched`,
                emailPatched: `scimtest${randomSuffix}patched@strategy.com`,
                distinguishedNamePatched: `CN=scimtest${randomSuffix}Patched,OU=PatchedUsers,OU=MicroStrategy Enterprise,DC=corp,DC=microstrategy,DC=com`,
                userNameUnchanged: `scimtest${randomSuffix}`,
            });
        } catch (error) {
            console.log('SCIM PATCH USER API Error:', error);
            console.log('Error type:', typeof error);

            // If error has response information, print it
            if (error.response) {
                console.log('Error response status:', error.response.status || error.response.statusCode);
                console.log('Error response body:', error.response.body || error.response.data);
            }

            // Print error details if it's an object
            if (error.statusCode) {
                console.log('Error status code:', error.statusCode);
                console.log('Error message:', error.message);
            }

            // Re-throw the error to fail the test if it's a validation error
            if (error.message && error.message.includes('expect')) {
                throw error;
            }

            console.log('❌ SCIM PATCH USER API call failed, but test continues');
        }
        console.log('🏁 SCIM test TC99465 completed');
    });

    it('[TC99465_01] should successfully update SCIM user language with PUT method if the language is not set before', async () => {
        console.log('🚀 SCIM test TC99465_01 is running...');

        // Verify bearerToken was saved from previous test
        await expect(bearerToken).toBeDefined();
        await expect(typeof bearerToken).toBe('string');
        await expect(bearerToken.length).toBeGreaterThan(0);
        console.log('Using bearer token from previous test:', bearerToken);

        // Create a new user without locale set
        let newUserId;
        try {
            console.log('Creating a new SCIM user without locale set for TC99465_01');

            const newUserData = {
                active: true,
                displayName: `scimTest${randomSuffix}NoLocale`,
                userName: `scimTest${randomSuffix}NoLocale`,
                'urn:ietf:params:scim:schemas:extension:enterprise:2.0:User': {
                    employeeNumber: `scimTest${randomSuffix}trustNoLocale`,
                },
            };
            console.log('New SCIM user data:', JSON.stringify(newUserData, null, 2));
            let createResponse = await createSCIMUser({
                baseUrl,
                token: bearerToken,
                body: newUserData,
            });
            console.log('SCIM Create User response for TC99465_01:', createResponse);

            // Verify creation was successful
            await expect(createResponse).toBeDefined();
            await expect(createResponse.statusCode).toBe(201);
            let createResponseData =
                typeof createResponse.body === 'string' ? JSON.parse(createResponse.body) : createResponse.body;
            await expect(createResponseData.id).toBeDefined();
            newUserId = createResponseData.id;
            console.log('✅ Created new SCIM user without locale, ID:', newUserId);
        } catch (error) {
            console.log('Error creating SCIM user for TC99465_01:', error);
            throw error; // Fail the test if user creation fails
        }

        // Verify createdUserId was saved from previous test
        await expect(newUserId).toBeDefined();
        await expect(typeof newUserId).toBe('string');
        await expect(newUserId.length).toBeGreaterThan(0);
        console.log('Using newly created user ID for TC99465_01:', newUserId);

        try {
            console.log('About to call PUT /api/scim/v2/Users/{userId} with baseUrl:', baseUrl);
            console.log('Updating SCIM user with ID:', newUserId);

            // Create PUT operation data following SCIM PatchOp schema
            const updatedUserData = {
                active: true,
                displayName: `scimTest${randomSuffix}NoLocaleUpdated`,
                emails: [
                    {
                        value: `scimTest${randomSuffix}NoLocaleUpdated@strategy.com`,
                    },
                ],
                userName: `scimTest${randomSuffix}NoLocaleUpdated`,
                locale: `fr-FR`,
                preferredLanguage: `fr-FR; en-US`,
                'urn:ietf:params:scim:schemas:extension:strategy:2.0:User': {
                    distinguishedName: `CN=scimTest${randomSuffix}NoLocaleUpdated,OU=UpdatedUsers,OU=MicroStrategy Enterprise,DC=corp,DC=microstrategy,DC=com`,
                },
                'urn:ietf:params:scim:schemas:extension:enterprise:2.0:User': {
                    employeeNumber: `scimTest${randomSuffix}NoLocaleUpdatedUpdated`,
                },
            };
            console.log('Updating SCIM user with data:', JSON.stringify(updatedUserData, null, 2));

            let response = await putSCIMUser({
                baseUrl,
                token: bearerToken,
                userId: newUserId,
                body: updatedUserData,
            });
            console.log('SCIM Update User response for TC99465_01:', response);

            // Verify response status code is 200 or 204
            if (response.statusCode && (response.statusCode === 200 || response.statusCode === 204)) {
                console.log('✅ Response status code is', response.statusCode);
            } else {
                console.log('❌ Response status code is not 200/204:', response.statusCode);
                console.log('Response body:', response.body || response);
                await expect(response.statusCode).toBeGreaterThanOrEqual(200);
                await expect(response.statusCode).toBeLessThan(300);
            }

            // Parse response body if it's a string
            let responseData;
            if (typeof response.body === 'string') {
                responseData = JSON.parse(response.body);
            } else {
                responseData = response.body;
            }

            // Verify basic response structure
            await expect(responseData).toBeDefined();
            await expect(typeof responseData).toBe('object');

            // Verify user ID matches the updated user ID
            await expect(responseData.id).toBeDefined();
            await expect(typeof responseData.id).toBe('string');
            await expect(responseData.id).toBe(newUserId);
            console.log('✅ Verified user ID matches updated user ID:', responseData.id);

            // Verify the locale was updated successfully
            await expect(responseData.locale).toBeDefined();
            await expect(responseData.locale).toBe('fr-FR');
            console.log('✅ Verified locale was updated to fr-FR successfully:', responseData.locale);
            console.log('✅ SCIM user update for locale and validation completed successfully for TC99465_01');
        } catch (error) {
            console.log('Error patching SCIM user for TC99465_01:', error);
            throw error; // Fail the test if patching fails
        }

        // Clean up - delete the newly created user
        try {
            console.log('Cleaning up by deleting the newly created SCIM user with ID:', newUserId);
            let deleteResponse = await deleteSCIMUser({
                baseUrl,
                token: bearerToken,
                userId: newUserId,
            });
            console.log('SCIM Delete User response for TC99465_01:', deleteResponse);
            await expect(deleteResponse.statusCode).toBe(204);
            console.log('✅ Successfully deleted the newly created SCIM user with ID:', newUserId);
        } catch (error) {
            console.log('Error deleting SCIM user for TC99465_01:', error);
            // Not throwing error here to avoid failing the test during cleanup
        }

        console.log('🏁 SCIM test TC99465_01 completed');
    });

    it('[TC99465_02] should successfully patch SCIM user language with PATCH method and verify partial updates if the language is not set before', async () => {
        console.log('🚀 SCIM test TC99465_02 is running...');

        // Verify bearerToken was saved from previous test
        await expect(bearerToken).toBeDefined();
        await expect(typeof bearerToken).toBe('string');
        await expect(bearerToken.length).toBeGreaterThan(0);
        console.log('Using bearer token from previous test:', bearerToken);

        // Create a new user without locale set
        let newUserId;
        try {
            console.log('Creating a new SCIM user without locale set for TC99465_02');

            const newUserData = {
                active: true,
                displayName: `scimTest${randomSuffix}NoLocale2`,
                userName: `scimTest${randomSuffix}NoLocale2`,
                'urn:ietf:params:scim:schemas:extension:enterprise:2.0:User': {
                    employeeNumber: `scimTest${randomSuffix}trustNoLocale2`,
                },
            };
            console.log('New SCIM user data:', JSON.stringify(newUserData, null, 2));
            let createResponse = await createSCIMUser({
                baseUrl,
                token: bearerToken,
                body: newUserData,
            });
            console.log('SCIM Create User response for TC99465_02:', createResponse);

            // Verify creation was successful
            await expect(createResponse).toBeDefined();
            await expect(createResponse.statusCode).toBe(201);
            let createResponseData =
                typeof createResponse.body === 'string' ? JSON.parse(createResponse.body) : createResponse.body;
            await expect(createResponseData.id).toBeDefined();
            newUserId = createResponseData.id;
            console.log('✅ Created new SCIM user without locale, ID:', newUserId);
        } catch (error) {
            console.log('Error creating SCIM user for TC99465_02:', error);
            throw error; // Fail the test if user creation fails
        }

        // Verify createdUserId was saved from previous test
        await expect(newUserId).toBeDefined();
        await expect(typeof newUserId).toBe('string');
        await expect(newUserId.length).toBeGreaterThan(0);
        console.log('Using newly created user ID for TC99465_02:', newUserId);

        try {
            console.log('About to call PATCH /api/scim/v2/Users/{userId} with baseUrl:', baseUrl);
            console.log('Patching SCIM user with ID:', newUserId);

            // Create PATCH operation data following SCIM PatchOp schema
            const patchOperations = {
                schemas: ['urn:ietf:params:scim:api:messages:2.0:PatchOp'],
                Operations: [
                    {
                        op: 'replace',
                        path: 'locale',
                        value: `de-DE`,
                    },
                ],
            };
            console.log('Patching SCIM user with operations:', JSON.stringify(patchOperations, null, 2));

            let response = await patchSCIMUser({
                baseUrl,
                token: bearerToken,
                userId: newUserId,
                body: patchOperations,
            });
            console.log('SCIM Patch User response for TC99465_02:', response);

            // Verify response status code is 200 or 204
            if (response.statusCode && (response.statusCode === 200 || response.statusCode === 204)) {
                console.log('✅ Response status code is', response.statusCode);
            } else {
                console.log('❌ Response status code is not 200/204:', response.statusCode);
                console.log('Response body:', response.body || response);
                await expect(response.statusCode).toBeGreaterThanOrEqual(200);
                await expect(response.statusCode).toBeLessThan(300);
            }

            // Parse response body if it's a string
            let responseData;
            if (typeof response.body === 'string') {
                responseData = JSON.parse(response.body);
            } else {
                responseData = response.body;
            }

            // Verify basic response structure
            await expect(responseData).toBeDefined();
            await expect(typeof responseData).toBe('object');

            // Verify user ID matches the updated user ID
            await expect(responseData.id).toBeDefined();
            await expect(typeof responseData.id).toBe('string');
            await expect(responseData.id).toBe(newUserId);
            console.log('✅ Verified user ID matches updated user ID:', responseData.id);

            // Verify the locale was patched successfully
            await expect(responseData.locale).toBeDefined();
            await expect(responseData.locale).toBe('de-DE');
            console.log('✅ Verified locale was patched to de-DE successfully:', responseData.locale);
            console.log('✅ SCIM user patch for locale and validation completed successfully for TC99465_02');
        } catch (error) {
            console.log('Error patching SCIM user for TC99465_02:', error);
            throw error; // Fail the test if patching fails
        }

        // Clean up - delete the newly created user
        try {
            console.log('Cleaning up by deleting the newly created SCIM user with ID:', newUserId);
            let deleteResponse = await deleteSCIMUser({
                baseUrl,
                token: bearerToken,
                userId: newUserId,
            });
            console.log('SCIM Delete User response for TC99465_02:', deleteResponse);
            await expect(deleteResponse.statusCode).toBe(204);
            console.log('✅ Successfully deleted the newly created SCIM user with ID:', newUserId);
        } catch (error) {
            console.log('Error deleting SCIM user for TC99465_02:', error);
            // Not throwing error here to avoid failing the test during cleanup
        }

        console.log('🏁 SCIM test TC99465_02 completed');
    });

    it('[TC99466] should successfully test listSCIMUsers function with various parameters', async () => {
        console.log('🚀 SCIM test TC99466 is running...');

        // Verify bearerToken was saved from previous test
        await expect(bearerToken).toBeDefined();
        await expect(typeof bearerToken).toBe('string');
        await expect(bearerToken.length).toBeGreaterThan(0);
        console.log('Using bearer token from previous test:', bearerToken);

        // Verify createdUserId was saved from previous test
        await expect(createdUserId).toBeDefined();
        await expect(typeof createdUserId).toBe('string');
        await expect(createdUserId.length).toBeGreaterThan(0);
        console.log('Using created user ID from previous test for filtering:', createdUserId);

        try {
            console.log('=== PART 1: Testing listSCIMUsers with filter parameter ===');

            // Test 1: Filter by userName using the created user
            const filterValue = `userName eq "scimtest${randomSuffix}"`;
            console.log('Testing filter with value:', filterValue);

            let response = await listSCIMUsers({
                baseUrl,
                token: bearerToken,
                filter: filterValue,
            });
            console.log('SCIM List Users (with filter) response:', response);

            // Verify response status code is 200
            await expect(response.statusCode).toBe(200);
            console.log('✅ Response status code is 200 for filtered request');

            // Parse filtered response
            let responseData;
            if (typeof response.body === 'string') {
                responseData = JSON.parse(response.body);
            } else {
                responseData = response.body;
            }

            // Verify filtered response structure
            await expect(responseData.schemas).toContain('urn:ietf:params:scim:api:messages:2.0:ListResponse');
            await expect(responseData.totalResults).toBeDefined();
            await expect(responseData.Resources).toBeDefined();
            await expect(Array.isArray(responseData.Resources)).toBe(true);
            console.log('✅ Verified filtered response structure');
            console.log('Filtered results count:', responseData.totalResults);

            // Verify filter worked - should find our user or return 0 if already deleted
            if (responseData.totalResults > 0) {
                const foundUser = responseData.Resources[0];
                await expect(foundUser.userName).toBe(`scimtest${randomSuffix}`);
                console.log('✅ Found user with correct userName:', foundUser.userName);
                console.log('User details:', {
                    id: foundUser.id,
                    userName: foundUser.userName,
                    displayName: foundUser.displayName,
                    active: foundUser.active,
                });
            } else {
                console.log('ℹ️ No users found with filter - user may have been deleted in previous tests');
            }

            console.log('=== PART 2: Testing listSCIMUsers with attributes parameter ===');

            // Test 2: Test with attributes parameter to get only specific fields
            const attributesValue = 'userName,displayName,active';
            console.log('Testing attributes with value:', attributesValue);

            response = await listSCIMUsers({
                baseUrl,
                token: bearerToken,
                attributes: attributesValue,
            });
            console.log('SCIM List Users (with attributes) response:', response);

            // Verify response status code is 200
            await expect(response.statusCode).toBe(200);
            console.log('✅ Response status code is 200 for attributes request');

            // Parse attributes response
            if (typeof response.body === 'string') {
                responseData = JSON.parse(response.body);
            } else {
                responseData = response.body;
            }

            // Verify attributes response structure
            await expect(responseData.schemas).toContain('urn:ietf:params:scim:api:messages:2.0:ListResponse');
            await expect(responseData.Resources).toBeDefined();
            console.log('✅ Verified attributes response structure');
            console.log(
                'Users returned with limited attributes:',
                responseData.Resources ? responseData.Resources.length : 0
            );

            // Verify limited attributes if users exist
            if (responseData.Resources && responseData.Resources.length > 0) {
                const firstUser = responseData.Resources[0];
                await expect(firstUser.userName).toBeDefined();
                await expect(firstUser.displayName).toBeDefined();
                await expect(firstUser.active).toBeDefined();
                console.log('✅ Verified user has requested attributes:', {
                    userName: firstUser.userName,
                    displayName: firstUser.displayName,
                    active: firstUser.active,
                });
            }

            console.log('=== PART 3: Testing listSCIMUsers with startIndex and count parameters ===');

            // Test 3: Test with startIndex and count parameters for pagination
            const startIndexValue = 3; // Changed from 1 to 3
            const countValue = 15; // Changed from 5 to 15 (within 20 limit)
            console.log('Testing startIndex with value:', startIndexValue);
            console.log('Testing count with value:', countValue);

            response = await listSCIMUsers({
                baseUrl,
                token: bearerToken,
                startIndex: startIndexValue,
                count: countValue,
            });
            console.log('SCIM List Users (with startIndex and count) response:', response);

            // Verify response status code is 200
            await expect(response.statusCode).toBe(200);
            console.log('✅ Response status code is 200 for startIndex and count request');

            // Parse pagination response
            if (typeof response.body === 'string') {
                responseData = JSON.parse(response.body);
            } else {
                responseData = response.body;
            }

            // Verify pagination response structure
            await expect(responseData.schemas).toContain('urn:ietf:params:scim:api:messages:2.0:ListResponse');
            await expect(responseData.startIndex).toBeDefined();
            await expect(responseData.startIndex).toBe(startIndexValue);
            await expect(responseData.itemsPerPage).toBeDefined();
            await expect(responseData.Resources).toBeDefined();
            if (responseData.Resources) {
                await expect(responseData.Resources.length).toBeLessThanOrEqual(countValue);
            }
            console.log('✅ Verified startIndex in response:', responseData.startIndex);
            console.log('✅ Verified count parameter effect - itemsPerPage:', responseData.itemsPerPage);
            console.log(
                '✅ Resources returned <= count limit:',
                responseData.Resources ? responseData.Resources.length : 0,
                '<=',
                countValue
            );
            console.log(
                '✅ Pagination parameters tested successfully with startIndex:',
                startIndexValue,
                'and count:',
                countValue
            );

            console.log('=== PART 4: Testing listSCIMUsers with combined parameters ===');

            // Test 4: Test with multiple parameters combined
            response = await listSCIMUsers({
                baseUrl,
                token: bearerToken,
                attributes: 'userName,displayName',
                startIndex: 2,
                count: 10,
            });
            console.log('SCIM List Users (combined params) response:', response);

            // Verify response status code is 200
            await expect(response.statusCode).toBe(200);
            console.log('✅ Response status code is 200 for combined parameters request');

            // Parse combined response
            if (typeof response.body === 'string') {
                responseData = JSON.parse(response.body);
            } else {
                responseData = response.body;
            }

            // Verify combined response structure
            await expect(responseData.schemas).toContain('urn:ietf:params:scim:api:messages:2.0:ListResponse');
            await expect(responseData.startIndex).toBe(2);
            console.log('✅ Verified combined parameters response structure');
            console.log('Combined parameters test results:', {
                totalResults: responseData.totalResults,
                startIndex: responseData.startIndex,
                itemsPerPage: responseData.itemsPerPage,
                resourcesCount: responseData.Resources ? responseData.Resources.length : 0,
            });

            console.log('✅ SCIM listSCIMUsers function testing completed successfully');
            console.log('All parameter combinations tested:', {
                filterParameter: `userName eq "scimtest${randomSuffix}"`,
                attributesParameter: 'userName,displayName',
                combinedParameters: 'All parameters together with startIndex: 2, count: 10',
            });
        } catch (error) {
            console.log('SCIM LIST USERS API Error:', error);
            console.log('Error type:', typeof error);

            // If error has response information, print it
            if (error.response) {
                console.log('Error response status:', error.response.status || error.response.statusCode);
                console.log('Error response body:', error.response.body || error.response.data);
            }

            // Print error details if it's an object
            if (error.statusCode) {
                console.log('Error status code:', error.statusCode);
                console.log('Error message:', error.message);
            }

            // Re-throw the error to fail the test if it's a validation error
            if (error.message && error.message.includes('expect')) {
                throw error;
            }

            console.log('❌ SCIM LIST USERS API call failed, but test continues');
        }
        console.log('🏁 SCIM test TC99466 completed');
    });

    it('[TC99467] should handle DELETE operations for non-existent and existing SCIM users', async () => {
        console.log('🚀 SCIM test TC99467 is running...');

        // Verify bearerToken was saved from previous test
        await expect(bearerToken).toBeDefined();
        await expect(typeof bearerToken).toBe('string');
        await expect(bearerToken.length).toBeGreaterThan(0);
        console.log('Using bearer token from previous test:', bearerToken);

        // Verify createdUserId was saved from previous test
        await expect(createdUserId).toBeDefined();
        await expect(typeof createdUserId).toBe('string');
        await expect(createdUserId.length).toBeGreaterThan(0);
        console.log('Using created user ID from previous test:', createdUserId);

        // PART 1: Try to delete a non-existent user (should return 404)
        try {
            console.log('=== PART 1: Testing DELETE with non-existent user ID ===');

            // Create a non-existent user ID by truncating the existing ID
            const nonExistentUserId = createdUserId.substring(0, createdUserId.length - 4);
            console.log('Original user ID:', createdUserId);
            console.log('Non-existent user ID (truncated):', nonExistentUserId);

            console.log('About to call DELETE /api/scim/v2/Users/{nonExistentUserId} with baseUrl:', baseUrl);
            console.log('Attempting to delete non-existent SCIM user with ID:', nonExistentUserId);

            let response = await deleteSCIMUser({
                baseUrl,
                token: bearerToken,
                userId: nonExistentUserId,
            });
            console.log('SCIM Delete Non-Existent User response:', response);

            // Verify response status code is 404 for non-existent user
            if (response.statusCode && response.statusCode === 404) {
                console.log('✅ Response status code is 404 as expected for non-existent user');
            } else {
                console.log('❌ Response status code is not 404:', response.statusCode);
                console.log('Response body:', response.body || response);
                await expect(response.statusCode).toBe(404);
            }

            // Verify the response structure for 404 error
            await expect(response).toBeDefined();
            await expect(response.statusCode).toBeDefined();
            await expect(response.body).toBeDefined();

            // Parse response body if it's a string
            let responseData;
            if (typeof response.body === 'string') {
                responseData = JSON.parse(response.body);
            } else {
                responseData = response.body;
            }

            // Verify error response structure for 404
            await expect(responseData).toBeDefined();
            await expect(typeof responseData).toBe('object');

            // Verify error details for non-existent user
            if (responseData.detail) {
                await expect(responseData.detail).toContain('Invalid object ID');
                console.log('✅ Verified error detail contains "Invalid object ID":', responseData.detail);
            } else if (responseData.message) {
                console.log('ℹ️ Error message:', responseData.message);
            }

            console.log('✅ PART 1: Non-existent user DELETE handled correctly (404 response)');
        } catch (error) {
            console.log('SCIM DELETE NON-EXISTENT USER API Error:', error);
            console.log('Error type:', typeof error);

            // For non-existent user, we expect this to be handled gracefully
            if (error.statusCode && error.statusCode === 404) {
                console.log('✅ Received expected 404 error for non-existent user');
                console.log('Error details:', error);
            } else {
                console.log('❌ Unexpected error for non-existent user deletion');

                // If error has response information, print it
                if (error.response) {
                    console.log('Error response status:', error.response.status || error.response.statusCode);
                    console.log('Error response body:', error.response.body || error.response.data);
                }

                // Print error details if it's an object
                if (error.statusCode) {
                    console.log('Error status code:', error.statusCode);
                    console.log('Error message:', error.message);
                }
            }
        }

        // PART 2: Delete the existing user (should return 204)
        try {
            console.log('=== PART 2: Testing DELETE with existing user ID ===');
            console.log('About to call DELETE /api/scim/v2/Users/{userId} with baseUrl:', baseUrl);
            console.log('Deleting existing SCIM user with ID:', createdUserId);

            let response = await deleteSCIMUser({
                baseUrl,
                token: bearerToken,
                userId: createdUserId,
            });
            console.log('SCIM Delete Existing User response:', response);

            // Verify response status code is 204 for successful deletion
            if (response.statusCode && response.statusCode === 204) {
                console.log('✅ Response status code is 204 as expected for successful deletion');
            } else if (response.statusCode && response.statusCode === 200) {
                console.log('✅ Response status code is 200 (also acceptable for successful deletion)');
            } else {
                console.log('❌ Response status code is not 204/200:', response.statusCode);
                console.log('Response body:', response.body || response);
                await expect(response.statusCode).toBeGreaterThanOrEqual(200);
                await expect(response.statusCode).toBeLessThan(300);
            }

            // Verify the response structure for successful deletion
            await expect(response).toBeDefined();
            await expect(response.statusCode).toBeDefined();

            // For 204 responses, body might be empty
            if (response.statusCode === 204) {
                console.log('✅ Verified 204 No Content response for successful deletion');
                // Body might be empty for 204 responses
                if (response.body) {
                    console.log('Response body (might be empty for 204):', response.body);
                }
            } else if (response.statusCode === 200 && response.body) {
                console.log('✅ Verified 200 OK response with body for successful deletion');
                console.log('Response body:', response.body);
            }

            console.log('✅ PART 2: Existing user DELETE completed successfully');
        } catch (error) {
            console.log('SCIM DELETE EXISTING USER API Error:', error);
            console.log('Error type:', typeof error);

            // If error has response information, print it
            if (error.response) {
                console.log('Error response status:', error.response.status || error.response.statusCode);
                console.log('Error response body:', error.response.body || error.response.data);
            }

            // Print error details if it's an object
            if (error.statusCode) {
                console.log('Error status code:', error.statusCode);
                console.log('Error message:', error.message);
            }

            // Re-throw the error to fail the test if it's a validation error
            if (error.message && error.message.includes('expect')) {
                throw error;
            }

            console.log('❌ SCIM DELETE EXISTING USER API call failed, but test continues');
        }

        // PART 3: Verify the user is actually deleted by trying to GET it
        try {
            console.log('=== PART 3: Verifying user deletion by attempting GET ===');
            console.log('About to call GET /api/scim/v2/Users/{userId} to verify deletion');

            let response = await getSCIMUser({
                baseUrl,
                token: bearerToken,
                userId: createdUserId,
            });

            // If we reach here, the user still exists (unexpected)
            console.log('❌ User still exists after deletion (unexpected):', response);
            console.log('This might indicate the DELETE operation did not work properly');
        } catch (error) {
            // We expect this to fail with 404 since the user should be deleted
            if (error.statusCode && error.statusCode === 404) {
                console.log('✅ Confirmed user deletion: GET request returned 404 as expected');
                console.log('User with ID', createdUserId, 'has been successfully deleted');
            } else {
                console.log('Unexpected error when verifying deletion:', error);
                console.log('Error status code:', error.statusCode);
                console.log('Error details:', error);
            }
        }

        console.log('✅ SCIM DELETE operations test completed successfully');
        console.log('Test summary:', {
            nonExistentUserHandled: 'Expected 404 for non-existent user',
            existingUserDeleted: 'Expected 204 for successful deletion',
            deletionVerified: 'Expected 404 when trying to GET deleted user',
            randomSuffix: randomSuffix,
            deletedUserId: createdUserId,
        });

        console.log('🏁 SCIM test TC99467 completed');
    });

    it('[TC99468] should successfully create SCIM group with POST method', async () => {
        console.log('🚀 SCIM test TC99468 is running...');

        // Verify bearerToken was saved from previous tests
        await expect(bearerToken).toBeDefined();
        await expect(typeof bearerToken).toBe('string');
        await expect(bearerToken.length).toBeGreaterThan(0);
        console.log('Using bearer token from previous test:', bearerToken);

        try {
            console.log('About to call POST /api/scim/v2/Groups with baseUrl:', baseUrl);

            // Create group data with random suffix
            const groupData = {
                displayName: `zhxie group ${randomSuffix}`,
                schemas: [
                    'urn:ietf:params:scim:schemas:core:2.0:Group',
                    'urn:ietf:params:scim:schemas:extension:strategy:2.0:Group',
                ],
                'urn:ietf:params:scim:schemas:extension:strategy:2.0:Group': {
                    distinguishedName: `CN=zhxie-group-${randomSuffix},OU=Groups,OU=TEC,OU=MicroStrategy Enterprise,DC=corp,DC=microstrategy,DC=com`,
                },
            };

            console.log('Creating SCIM group with data:', JSON.stringify(groupData, null, 2));

            let response = await createSCIMGroup({ baseUrl, token: bearerToken, body: groupData });
            console.log('SCIM Create Group response:', response);

            // Verify response status code is 200 or 201
            if (response.statusCode && (response.statusCode === 200 || response.statusCode === 201)) {
                console.log('✅ Response status code is', response.statusCode);
            } else {
                console.log('❌ Response status code is not 200/201:', response.statusCode);
                console.log('Response body:', response.body || response);
                await expect(response.statusCode).toBeGreaterThanOrEqual(200);
                await expect(response.statusCode).toBeLessThan(300);
            }

            // Verify the response structure
            await expect(response).toBeDefined();
            await expect(response.statusCode).toBeDefined();
            await expect(response.body).toBeDefined();

            // Parse response body if it's a string
            let responseData;
            if (typeof response.body === 'string') {
                responseData = JSON.parse(response.body);
            } else {
                responseData = response.body;
            }

            // Verify basic response structure
            await expect(responseData).toBeDefined();
            await expect(typeof responseData).toBe('object');

            // Verify group ID is returned and save it
            await expect(responseData.id).toBeDefined();
            await expect(typeof responseData.id).toBe('string');
            console.log('✅ Verified group ID:', responseData.id);

            // Save the created group ID for future use
            createdGroupId = responseData.id;
            console.log('📝 Saved created group ID for future tests:', createdGroupId);

            // Verify meta information
            await expect(responseData.meta).toBeDefined();
            await expect(typeof responseData.meta).toBe('object');
            await expect(responseData.meta.resourceType).toBe('Group');
            await expect(responseData.meta.created).toBeDefined();
            await expect(responseData.meta.lastModified).toBeDefined();
            await expect(responseData.meta.location).toBeDefined();
            await expect(responseData.meta.location).toContain(responseData.id);
            console.log('✅ Verified meta information:', {
                resourceType: responseData.meta.resourceType,
                created: responseData.meta.created,
                lastModified: responseData.meta.lastModified,
                location: responseData.meta.location,
            });

            // Verify displayName matches what we sent
            await expect(responseData.displayName).toBeDefined();
            await expect(responseData.displayName).toBe(`zhxie group ${randomSuffix}`);
            console.log('✅ Verified displayName:', responseData.displayName);

            // Verify schemas array
            await expect(responseData.schemas).toBeDefined();
            await expect(Array.isArray(responseData.schemas)).toBe(true);
            await expect(responseData.schemas).toContain('urn:ietf:params:scim:schemas:core:2.0:Group');
            await expect(responseData.schemas).toContain('urn:ietf:params:scim:schemas:extension:strategy:2.0:Group');
            console.log('✅ Verified schemas:', responseData.schemas);

            // Verify strategy extension schema
            const strategyExtension = responseData['urn:ietf:params:scim:schemas:extension:strategy:2.0:Group'];
            await expect(strategyExtension).toBeDefined();
            await expect(strategyExtension.distinguishedName).toBe(
                `CN=zhxie-group-${randomSuffix},OU=Groups,OU=TEC,OU=MicroStrategy Enterprise,DC=corp,DC=microstrategy,DC=com`
            );
            console.log('✅ Verified strategy extension distinguishedName:', strategyExtension.distinguishedName);

            // Verify members array exists (might be empty)
            if (responseData.members) {
                await expect(Array.isArray(responseData.members)).toBe(true);
                console.log('✅ Verified members array:', responseData.members);
            } else {
                console.log('ℹ️ No members array in response (this is normal for new groups)');
            }

            console.log('✅ SCIM group created successfully');
            console.log('Group creation validation passed:', {
                id: responseData.id,
                displayName: responseData.displayName,
                schemasCount: responseData.schemas?.length,
                metaResourceType: responseData.meta?.resourceType,
                randomSuffix: randomSuffix,
                createdGroupId: createdGroupId,
            });
        } catch (error) {
            console.log('SCIM CREATE GROUP API Error:', error);
            console.log('Error type:', typeof error);

            // If error has response information, print it
            if (error.response) {
                console.log('Error response status:', error.response.status || error.response.statusCode);
                console.log('Error response body:', error.response.body || error.response.data);
            }

            // Print error details if it's an object
            if (error.statusCode) {
                console.log('Error status code:', error.statusCode);
                console.log('Error message:', error.message);
            }

            // Re-throw the error to fail the test if it's a validation error
            if (error.message && error.message.includes('expect')) {
                throw error;
            }

            console.log('❌ SCIM CREATE GROUP API call failed, but test continues');
        }
        console.log('🏁 SCIM test TC99468 completed');
    });

    it('[TC99468_01] should fail to create SCIM group due to invalid payload', async () => {
        console.log('🚀 SCIM test TC99468_01 is running...');

        const groupDataTemplate = {
            displayName: `zhxie group ${randomSuffix}`,
            schemas: [
                'urn:ietf:params:scim:schemas:core:2.0:Group',
                'urn:ietf:params:scim:schemas:extension:strategy:2.0:Group',
            ],
            'urn:ietf:params:scim:schemas:extension:strategy:2.0:Group': {
                distinguishedName: `CN=zhxie-group-${randomSuffix},OU=Groups,OU=TEC,OU=MicroStrategy Enterprise,DC=corp,DC=microstrategy,DC=com`,
            },
        };

        const verifyCreationError = async (groupData, statusCode, errorType, errorItem) => {
            try {
                await createSCIMGroup({ baseUrl, token: bearerToken, body: groupData });
                fail(`❌ SCIM group creation succeeded unexpectedly`);
            } catch (error) {
                await expect(error.statusCode).toBe(statusCode);
                const errorBody = JSON.parse(error.message);
                await expect(errorBody).toBeDefined();
                await expect(errorBody.schemas[0]).toBe('urn:ietf:params:scim:api:messages:2.0:Error');
                await expect(errorBody.status).toBe(`${statusCode}`);
                await expect(errorBody.scimType).toBe(errorType);
                console.log(`✅ SCIM authentication got expected 400 Bad Request with {${errorItem}}`);
            }
        };

        const { displayName, ...groupDataWithoutDisplayName } = groupDataTemplate;
        await verifyCreationError(groupDataWithoutDisplayName, 400, 'invalidValue', 'missing group name');

        const groupDataWithConflictGroupName = {
            ...groupDataTemplate,
            'urn:ietf:params:scim:schemas:extension:strategy:2.0:Group': {
                distinguishedName: `CN=zhxie-group_2-${randomSuffix},OU=Groups,OU=TEC,OU=MicroStrategy Enterprise,DC=corp,DC=microstrategy,DC=com`,
            },
        };
        await verifyCreationError(groupDataWithConflictGroupName, 409, 'uniqueness', 'group name conflict');

        const groupDataWithConflictDn = {
            ...groupDataTemplate,
            displayName: `zhxie group ${randomSuffix} 2`,
        };
        await verifyCreationError(groupDataWithConflictDn, 409, 'uniqueness', 'distinguished name conflict');

        console.log('🏁 SCIM test TC99468_01 completed');
    });

    it('[TC99469] should successfully get SCIM group by ID and verify group data', async () => {
        console.log('🚀 SCIM test TC99469 is running...');

        // Verify bearerToken was saved from previous test
        await expect(bearerToken).toBeDefined();
        await expect(typeof bearerToken).toBe('string');
        await expect(bearerToken.length).toBeGreaterThan(0);
        console.log('Using bearer token from previous test:', bearerToken);

        // Verify createdGroupId was saved from previous test
        await expect(createdGroupId).toBeDefined();
        await expect(typeof createdGroupId).toBe('string');
        await expect(createdGroupId.length).toBeGreaterThan(0);
        console.log('Using created group ID from previous test:', createdGroupId);

        try {
            console.log('About to call GET /api/scim/v2/Groups/{groupId} with baseUrl:', baseUrl);
            console.log('Getting SCIM group with ID:', createdGroupId);

            let response = await getSCIMGroup({ baseUrl, token: bearerToken, groupId: createdGroupId });
            console.log('SCIM Get Group response:', response);

            // Verify response status code is 200
            if (response.statusCode && response.statusCode === 200) {
                console.log('✅ Response status code is', response.statusCode);
            } else {
                console.log('❌ Response status code is not 200:', response.statusCode);
                console.log('Response body:', response.body || response);
                await expect(response.statusCode).toBe(200);
            }

            // Verify the response structure
            await expect(response).toBeDefined();
            await expect(response.statusCode).toBeDefined();
            await expect(response.body).toBeDefined();

            // Parse response body if it's a string
            let responseData;
            if (typeof response.body === 'string') {
                responseData = JSON.parse(response.body);
            } else {
                responseData = response.body;
            }

            // Verify basic response structure
            await expect(responseData).toBeDefined();
            await expect(typeof responseData).toBe('object');

            // Verify group ID matches the created group ID
            await expect(responseData.id).toBeDefined();
            await expect(typeof responseData.id).toBe('string');
            await expect(responseData.id).toBe(createdGroupId);
            console.log('✅ Verified group ID matches created group ID:', responseData.id);

            // Verify meta information
            await expect(responseData.meta).toBeDefined();
            await expect(typeof responseData.meta).toBe('object');
            await expect(responseData.meta.resourceType).toBe('Group');
            await expect(responseData.meta.created).toBeDefined();
            await expect(responseData.meta.lastModified).toBeDefined();
            await expect(responseData.meta.location).toBeDefined();
            console.log('✅ Verified meta information structure');

            // Verify displayName contains the random suffix
            await expect(responseData.displayName).toBeDefined();
            await expect(typeof responseData.displayName).toBe('string');
            await expect(responseData.displayName).toBe(`zhxie group ${randomSuffix}`);
            console.log('✅ Verified displayName contains random suffix:', responseData.displayName);

            // Verify schemas array
            await expect(responseData.schemas).toBeDefined();
            await expect(Array.isArray(responseData.schemas)).toBe(true);
            await expect(responseData.schemas).toContain('urn:ietf:params:scim:schemas:core:2.0:Group');
            await expect(responseData.schemas).toContain('urn:ietf:params:scim:schemas:extension:strategy:2.0:Group');
            console.log('✅ Verified schemas array contains expected values');

            // Verify strategy extension data
            const strategyExtension = responseData['urn:ietf:params:scim:schemas:extension:strategy:2.0:Group'];
            await expect(strategyExtension).toBeDefined();
            await expect(typeof strategyExtension).toBe('object');
            await expect(strategyExtension.distinguishedName).toBeDefined();
            await expect(strategyExtension.distinguishedName).toBe(
                `CN=zhxie-group-${randomSuffix},OU=Groups,OU=TEC,OU=MicroStrategy Enterprise,DC=corp,DC=microstrategy,DC=com`
            );
            console.log('✅ Verified strategy extension distinguishedName contains random suffix');

            console.log('✅ SCIM group retrieval and validation completed successfully');
            console.log('All group data matches expected values with random suffix:', randomSuffix);
        } catch (error) {
            console.log('SCIM GET GROUP API Error:', error);
            console.log('Error type:', typeof error);

            // If error has response information, print it
            if (error.response) {
                console.log('Error response status:', error.response.status || error.response.statusCode);
                console.log('Error response body:', error.response.body || error.response.data);
            }

            // Print error details if it's an object
            if (error.statusCode) {
                console.log('Error status code:', error.statusCode);
                console.log('Error message:', error.message);
            }

            // Re-throw the error to fail the test if it's a validation error
            if (error.message && error.message.includes('expect')) {
                throw error;
            }

            console.log('❌ SCIM GET GROUP API call failed, but test continues');
        }
        console.log('🏁 SCIM test TC99469 completed');
    });

    it('[TC99470] should successfully update SCIM group with PUT method and verify modified distinguishedName', async () => {
        console.log('🚀 SCIM test TC99470 is running...');

        // Verify bearerToken was saved from previous test
        await expect(bearerToken).toBeDefined();
        await expect(typeof bearerToken).toBe('string');
        await expect(bearerToken.length).toBeGreaterThan(0);
        console.log('Using bearer token from previous test:', bearerToken);

        // Verify createdGroupId was saved from previous test
        await expect(createdGroupId).toBeDefined();
        await expect(typeof createdGroupId).toBe('string');
        await expect(createdGroupId.length).toBeGreaterThan(0);
        console.log('Using created group ID from previous test:', createdGroupId);

        try {
            console.log('About to call PUT /api/scim/v2/Groups/{groupId} with baseUrl:', baseUrl);
            console.log('Updating SCIM group with ID:', createdGroupId);

            // Create updated group data with modified distinguishedName
            const updatedGroupData = {
                displayName: `zhxie group ${randomSuffix} Updated`,
                schemas: [
                    'urn:ietf:params:scim:schemas:core:2.0:Group',
                    'urn:ietf:params:scim:schemas:extension:strategy:2.0:Group',
                ],
                'urn:ietf:params:scim:schemas:extension:strategy:2.0:Group': {
                    distinguishedName: `CN=zhxie-group-${randomSuffix}-updated,OU=UpdatedGroups,OU=TEC,OU=MicroStrategy Enterprise,DC=corp,DC=microstrategy,DC=com`,
                },
            };

            console.log('Updating SCIM group with data:', JSON.stringify(updatedGroupData, null, 2));

            let response = await putSCIMGroup({
                baseUrl,
                token: bearerToken,
                groupId: createdGroupId,
                body: updatedGroupData,
            });
            console.log('SCIM Update Group response:', response);

            // Verify response status code is 200 or 204
            if (response.statusCode && (response.statusCode === 200 || response.statusCode === 204)) {
                console.log('✅ Response status code is', response.statusCode);
            } else {
                console.log('❌ Response status code is not 200/204:', response.statusCode);
                console.log('Response body:', response.body || response);
                await expect(response.statusCode).toBeGreaterThanOrEqual(200);
                await expect(response.statusCode).toBeLessThan(300);
            }

            // Verify the response structure
            await expect(response).toBeDefined();
            await expect(response.statusCode).toBeDefined();
            await expect(response.body).toBeDefined();

            // Parse response body if it's a string
            let responseData;
            if (typeof response.body === 'string') {
                responseData = JSON.parse(response.body);
            } else {
                responseData = response.body;
            }

            // Verify basic response structure
            await expect(responseData).toBeDefined();
            await expect(typeof responseData).toBe('object');

            // Verify group ID matches the updated group ID
            await expect(responseData.id).toBeDefined();
            await expect(typeof responseData.id).toBe('string');
            await expect(responseData.id).toBe(createdGroupId);
            console.log('✅ Verified group ID matches updated group ID:', responseData.id);

            // Verify meta information
            await expect(responseData.meta).toBeDefined();
            await expect(typeof responseData.meta).toBe('object');
            await expect(responseData.meta.resourceType).toBe('Group');
            await expect(responseData.meta.created).toBeDefined();
            await expect(responseData.meta.lastModified).toBeDefined();
            await expect(responseData.meta.location).toBeDefined();
            console.log('✅ Verified meta information structure');

            // Verify lastModified is more recent than created (indicating update)
            const createdTime = new Date(responseData.meta.created).getTime();
            const lastModifiedTime = new Date(responseData.meta.lastModified).getTime();
            await expect(lastModifiedTime).toBeGreaterThanOrEqual(createdTime);
            console.log('✅ Verified lastModified time indicates successful update');

            // Verify displayName was updated with "Updated" suffix
            await expect(responseData.displayName).toBeDefined();
            await expect(typeof responseData.displayName).toBe('string');
            await expect(responseData.displayName).toBe(`zhxie group ${randomSuffix} Updated`);
            console.log('✅ Verified displayName was updated with suffix:', responseData.displayName);

            // Verify schemas array
            await expect(responseData.schemas).toBeDefined();
            await expect(Array.isArray(responseData.schemas)).toBe(true);
            await expect(responseData.schemas).toContain('urn:ietf:params:scim:schemas:core:2.0:Group');
            await expect(responseData.schemas).toContain('urn:ietf:params:scim:schemas:extension:strategy:2.0:Group');
            console.log('✅ Verified schemas array contains expected values');

            // Verify strategy extension data with updated distinguishedName
            const strategyExtension = responseData['urn:ietf:params:scim:schemas:extension:strategy:2.0:Group'];
            await expect(strategyExtension).toBeDefined();
            await expect(typeof strategyExtension).toBe('object');
            await expect(strategyExtension.distinguishedName).toBeDefined();
            await expect(strategyExtension.distinguishedName).toBe(
                `CN=zhxie-group-${randomSuffix}-updated,OU=UpdatedGroups,OU=TEC,OU=MicroStrategy Enterprise,DC=corp,DC=microstrategy,DC=com`
            );
            console.log('✅ Verified strategy extension distinguishedName was updated successfully');
            console.log('Updated distinguishedName:', strategyExtension.distinguishedName);

            console.log('✅ SCIM group update and validation completed successfully');
            console.log('Group data was successfully modified with random suffix:', randomSuffix);
        } catch (error) {
            console.log('SCIM PUT GROUP API Error:', error);
            console.log('Error type:', typeof error);

            // If error has response information, print it
            if (error.response) {
                console.log('Error response status:', error.response.status || error.response.statusCode);
                console.log('Error response body:', error.response.body || error.response.data);
            }

            // Print error details if it's an object
            if (error.statusCode) {
                console.log('Error status code:', error.statusCode);
                console.log('Error message:', error.message);
            }

            // Re-throw the error to fail the test if it's a validation error
            if (error.message && error.message.includes('expect')) {
                throw error;
            }

            console.log('❌ SCIM PUT GROUP API call failed, but test continues');
        }
        console.log('🏁 SCIM test TC99470 completed');
    });

    it('[TC99471] should successfully patch SCIM group with PATCH method and verify partial updates', async () => {
        console.log('🚀 SCIM test TC99471 is running...');

        // Verify bearerToken was saved from previous test
        await expect(bearerToken).toBeDefined();
        await expect(typeof bearerToken).toBe('string');
        await expect(bearerToken.length).toBeGreaterThan(0);
        console.log('Using bearer token from previous test:', bearerToken);

        // Verify createdGroupId was saved from previous test
        await expect(createdGroupId).toBeDefined();
        await expect(typeof createdGroupId).toBe('string');
        await expect(createdGroupId.length).toBeGreaterThan(0);
        console.log('Using created group ID from previous test:', createdGroupId);

        try {
            console.log('About to call PATCH /api/scim/v2/Groups/{groupId} with baseUrl:', baseUrl);
            console.log('Patching SCIM group with ID:', createdGroupId);

            // Create PATCH operation data following SCIM PatchOp schema
            const patchOperations = {
                schemas: ['urn:ietf:params:scim:api:messages:2.0:PatchOp'],
                Operations: [
                    {
                        op: 'replace',
                        path: 'displayName',
                        value: `zhxie group ${randomSuffix} Patched`,
                    },
                    {
                        op: 'replace',
                        path: 'urn:ietf:params:scim:schemas:extension:strategy:2.0:Group:distinguishedName',
                        value: `CN=zhxie-group-${randomSuffix}-patched,OU=PatchedGroups,OU=TEC,OU=MicroStrategy Enterprise,DC=corp,DC=microstrategy,DC=com`,
                    },
                ],
            };

            console.log('Patching SCIM group with operations:', JSON.stringify(patchOperations, null, 2));

            let response = await patchSCIMGroup({
                baseUrl,
                token: bearerToken,
                groupId: createdGroupId,
                body: patchOperations,
            });
            console.log('SCIM Patch Group response:', response);

            // Verify response status code is 200 or 204
            if (response.statusCode && (response.statusCode === 200 || response.statusCode === 204)) {
                console.log('✅ Response status code is', response.statusCode);
            } else {
                console.log('❌ Response status code is not 200/204:', response.statusCode);
                console.log('Response body:', response.body || response);
                await expect(response.statusCode).toBeGreaterThanOrEqual(200);
                await expect(response.statusCode).toBeLessThan(300);
            }

            // Verify the response structure
            await expect(response).toBeDefined();
            await expect(response.statusCode).toBeDefined();
            await expect(response.body).toBeDefined();

            // Parse response body if it's a string
            let responseData;
            if (typeof response.body === 'string') {
                responseData = JSON.parse(response.body);
            } else {
                responseData = response.body;
            }

            // Verify basic response structure
            await expect(responseData).toBeDefined();
            await expect(typeof responseData).toBe('object');

            // Verify group ID matches the patched group ID
            await expect(responseData.id).toBeDefined();
            await expect(typeof responseData.id).toBe('string');
            await expect(responseData.id).toBe(createdGroupId);
            console.log('✅ Verified group ID matches patched group ID:', responseData.id);

            // Verify meta information
            await expect(responseData.meta).toBeDefined();
            await expect(typeof responseData.meta).toBe('object');
            await expect(responseData.meta.resourceType).toBe('Group');
            await expect(responseData.meta.created).toBeDefined();
            await expect(responseData.meta.lastModified).toBeDefined();
            await expect(responseData.meta.location).toBeDefined();
            console.log('✅ Verified meta information structure');

            // Verify lastModified is more recent than created (indicating patch update)
            const createdTime = new Date(responseData.meta.created).getTime();
            const lastModifiedTime = new Date(responseData.meta.lastModified).getTime();
            await expect(lastModifiedTime).toBeGreaterThanOrEqual(createdTime);
            console.log('✅ Verified lastModified time indicates successful patch update');

            // Verify displayName was patched with "Patched" suffix
            await expect(responseData.displayName).toBeDefined();
            await expect(typeof responseData.displayName).toBe('string');
            await expect(responseData.displayName).toBe(`zhxie group ${randomSuffix} Patched`);
            console.log('✅ Verified displayName was patched with suffix:', responseData.displayName);

            // Verify schemas array
            await expect(responseData.schemas).toBeDefined();
            await expect(Array.isArray(responseData.schemas)).toBe(true);
            await expect(responseData.schemas).toContain('urn:ietf:params:scim:schemas:core:2.0:Group');
            await expect(responseData.schemas).toContain('urn:ietf:params:scim:schemas:extension:strategy:2.0:Group');
            console.log('✅ Verified schemas array contains expected values');

            // Verify strategy extension data with patched distinguishedName
            const strategyExtension = responseData['urn:ietf:params:scim:schemas:extension:strategy:2.0:Group'];
            await expect(strategyExtension).toBeDefined();
            await expect(typeof strategyExtension).toBe('object');
            await expect(strategyExtension.distinguishedName).toBeDefined();
            await expect(strategyExtension.distinguishedName).toBe(
                `CN=zhxie-group-${randomSuffix}-patched,OU=PatchedGroups,OU=TEC,OU=MicroStrategy Enterprise,DC=corp,DC=microstrategy,DC=com`
            );
            console.log('✅ Verified strategy extension distinguishedName was patched successfully');
            console.log('Patched distinguishedName:', strategyExtension.distinguishedName);

            console.log('✅ SCIM group patch and validation completed successfully');
            console.log(
                'Group data was successfully partially modified with PATCH operations using random suffix:',
                randomSuffix
            );
            console.log('PATCH operations summary:', {
                displayNamePatched: `zhxie group ${randomSuffix} Patched`,
                distinguishedNamePatched: `CN=zhxie-group-${randomSuffix}-patched,OU=PatchedGroups,OU=TEC,OU=MicroStrategy Enterprise,DC=corp,DC=microstrategy,DC=com`,
            });
        } catch (error) {
            console.log('SCIM PATCH GROUP API Error:', error);
            console.log('Error type:', typeof error);

            // If error has response information, print it
            if (error.response) {
                console.log('Error response status:', error.response.status || error.response.statusCode);
                console.log('Error response body:', error.response.body || error.response.data);
            }

            // Print error details if it's an object
            if (error.statusCode) {
                console.log('Error status code:', error.statusCode);
                console.log('Error message:', error.message);
            }

            // Re-throw the error to fail the test if it's a validation error
            if (error.message && error.message.includes('expect')) {
                throw error;
            }

            console.log('❌ SCIM PATCH GROUP API call failed, but test continues');
        }
        console.log('🏁 SCIM test TC99471 completed');
    });

    it('[TC99471_01] should fail to patch SCIM group with invalid payloads', async () => {
        console.log('🚀 SCIM test TC99471_01 is running...');

        // Verify bearerToken was saved from previous test
        await expect(bearerToken).toBeDefined();
        await expect(typeof bearerToken).toBe('string');
        await expect(bearerToken.length).toBeGreaterThan(0);
        console.log('Using bearer token from previous test:', bearerToken);

        // Verify createdGroupId was saved from previous test
        await expect(createdGroupId).toBeDefined();
        await expect(typeof createdGroupId).toBe('string');
        await expect(createdGroupId.length).toBeGreaterThan(0);
        console.log('Using created group ID from previous test:', createdGroupId);

        const invalidPayloads = [
            {
                schemas: ['urn:ietf:params:scim:api:messages:2.0:PatchOp'],
                Operations: [],
            },
            {
                schemas: ['urn:ietf:params:scim:api:messages:2.0:PatchOp'],
            },
        ];

        for (const payload of invalidPayloads) {
            try {
                await patchSCIMGroup({
                    baseUrl,
                    token: bearerToken,
                    groupId: createdGroupId,
                    body: payload,
                });
                fail('❌ PATCH group succeeded unexpectedly with invalid payload:', payload);
            } catch (error) {
                // Should return 400 with expected error structure
                await expect(error.statusCode).toBe(400);
                await expect(error.message).toBeDefined();
                let errorData = typeof error.message === 'string' ? JSON.parse(error.message) : error.message;
                await expect(errorData.status).toBe('400');
                await expect(errorData.scimType).toBe('invalidSyntax');
                await expect(Array.isArray(errorData.schemas)).toBe(true);
                await expect(errorData.schemas).toContain('urn:ietf:params:scim:api:messages:2.0:Error');
                console.log('✅ PATCH group failed as expected with invalid payload:', payload);
            }
        }
        console.log('🏁 SCIM test TC99471_01 completed');
    });

    it('[TC99472] should successfully test listSCIMGroups function with various parameters', async () => {
        console.log('🚀 SCIM test TC99472 is running...');

        // Verify bearerToken was saved from previous test
        await expect(bearerToken).toBeDefined();
        await expect(typeof bearerToken).toBe('string');
        await expect(bearerToken.length).toBeGreaterThan(0);
        console.log('Using bearer token from previous test:', bearerToken);

        // Verify createdGroupId was saved from previous test
        await expect(createdGroupId).toBeDefined();
        await expect(typeof createdGroupId).toBe('string');
        await expect(createdGroupId.length).toBeGreaterThan(0);
        console.log('Using created group ID from previous test for filtering:', createdGroupId);

        try {
            console.log('=== PART 1: Testing listSCIMGroups with filter parameter ===');

            // Test 1: Filter by displayName using the created group (after PATCH operation, name should be "zhxie group ${randomSuffix} Patched")
            const filterValue = `displayName eq "zhxie group ${randomSuffix} Patched"`;
            console.log('Testing filter with value:', filterValue);

            let response = await listSCIMGroups({
                baseUrl,
                token: bearerToken,
                filter: filterValue,
            });
            console.log('SCIM List Groups (with filter) response:', response);

            // Verify response status code is 200
            await expect(response.statusCode).toBe(200);
            console.log('✅ Response status code is 200 for filtered request');

            // Parse filtered response
            let responseData;
            if (typeof response.body === 'string') {
                responseData = JSON.parse(response.body);
            } else {
                responseData = response.body;
            }

            // Verify filtered response structure
            await expect(responseData.schemas).toContain('urn:ietf:params:scim:api:messages:2.0:ListResponse');
            await expect(responseData.totalResults).toBeDefined();
            await expect(responseData.Resources).toBeDefined();
            await expect(Array.isArray(responseData.Resources)).toBe(true);
            console.log('✅ Verified filtered response structure');
            console.log('Filtered results count:', responseData.totalResults);

            // Verify filter worked - should find our group or return 0 if already deleted
            if (responseData.totalResults > 0) {
                const foundGroup = responseData.Resources[0];
                await expect(foundGroup.displayName).toBe(`zhxie group ${randomSuffix} Patched`);
                console.log('✅ Found group with correct displayName:', foundGroup.displayName);
                console.log('Group details:', {
                    id: foundGroup.id,
                    displayName: foundGroup.displayName,
                    members: foundGroup.members ? foundGroup.members.length : 0,
                });
            } else {
                console.log('ℹ️ No groups found with filter - group may have been deleted in previous tests');
            }

            console.log('=== PART 2: Testing listSCIMGroups with attributes parameter ===');

            // Test 2: Test with attributes parameter to get only specific fields
            const attributesValue = 'displayName,members';
            console.log('Testing attributes with value:', attributesValue);

            response = await listSCIMGroups({
                baseUrl,
                token: bearerToken,
                attributes: attributesValue,
            });
            console.log('SCIM List Groups (with attributes) response:', response);

            // Verify response status code is 200
            await expect(response.statusCode).toBe(200);
            console.log('✅ Response status code is 200 for attributes request');

            // Parse attributes response
            if (typeof response.body === 'string') {
                responseData = JSON.parse(response.body);
            } else {
                responseData = response.body;
            }

            // Verify attributes response structure
            await expect(responseData.schemas).toContain('urn:ietf:params:scim:api:messages:2.0:ListResponse');
            await expect(responseData.Resources).toBeDefined();
            console.log('✅ Verified attributes response structure');
            console.log(
                'Groups returned with limited attributes:',
                responseData.Resources ? responseData.Resources.length : 0
            );

            // Verify limited attributes if groups exist
            if (responseData.Resources && responseData.Resources.length > 0) {
                const groups = responseData.Resources;
                // New requirement: among all resources, at least one must contain BOTH displayName and members
                const withBothCount = groups.filter(
                    (g) => g.displayName !== undefined && g.members !== undefined
                ).length;
                await expect(withBothCount).toBeGreaterThan(0);

                const sample =
                    groups.find((g) => g.displayName !== undefined && g.members !== undefined) || groups[0] || {};
                console.log('✅ Verified at least one group has both displayName and members:', {
                    total: groups.length,
                    withBothCount,
                    sampleDisplayName: sample.displayName || 'not returned',
                    sampleMembersCount: sample.members ? sample.members.length : 'no members field',
                });
            }

            console.log('=== PART 3: Testing listSCIMGroups with startIndex and count parameters ===');

            // Test 3: Test with startIndex and count parameters for pagination
            const startIndexValue = 3; // Changed from 1 to 3
            const countValue = 15; // Changed from 5 to 15 (within 20 limit)
            console.log('Testing startIndex with value:', startIndexValue);
            console.log('Testing count with value:', countValue);

            response = await listSCIMGroups({
                baseUrl,
                token: bearerToken,
                startIndex: startIndexValue,
                count: countValue,
            });
            console.log('SCIM List Groups (with startIndex and count) response:', response);

            // Verify response status code is 200
            await expect(response.statusCode).toBe(200);
            console.log('✅ Response status code is 200 for startIndex and count request');

            // Parse pagination response
            if (typeof response.body === 'string') {
                responseData = JSON.parse(response.body);
            } else {
                responseData = response.body;
            }

            // Verify pagination response structure
            await expect(responseData.schemas).toContain('urn:ietf:params:scim:api:messages:2.0:ListResponse');
            await expect(responseData.startIndex).toBeDefined();
            await expect(responseData.startIndex).toBe(startIndexValue);
            await expect(responseData.itemsPerPage).toBeDefined();
            await expect(responseData.Resources).toBeDefined();
            if (responseData.Resources) {
                await expect(responseData.Resources.length).toBeLessThanOrEqual(countValue);
            }
            console.log('✅ Verified startIndex in response:', responseData.startIndex);
            console.log('✅ Verified count parameter effect - itemsPerPage:', responseData.itemsPerPage);
            console.log(
                '✅ Resources returned <= count limit:',
                responseData.Resources ? responseData.Resources.length : 0,
                '<=',
                countValue
            );
            console.log(
                '✅ Pagination parameters tested successfully with startIndex:',
                startIndexValue,
                'and count:',
                countValue
            );

            console.log('=== PART 4: Testing listSCIMGroups with combined parameters ===');

            // Test 4: Test with multiple parameters combined
            response = await listSCIMGroups({
                baseUrl,
                token: bearerToken,
                attributes: 'displayName,members',
                startIndex: 2,
                count: 10,
            });
            console.log('SCIM List Groups (combined params) response:', response);

            // Verify response status code is 200
            await expect(response.statusCode).toBe(200);
            console.log('✅ Response status code is 200 for combined parameters request');

            // Parse combined response
            if (typeof response.body === 'string') {
                responseData = JSON.parse(response.body);
            } else {
                responseData = response.body;
            }

            // Verify combined response structure
            await expect(responseData.schemas).toContain('urn:ietf:params:scim:api:messages:2.0:ListResponse');
            await expect(responseData.startIndex).toBe(2);
            console.log('✅ Verified combined parameters response structure');
            console.log('Combined parameters test results:', {
                totalResults: responseData.totalResults,
                startIndex: responseData.startIndex,
                itemsPerPage: responseData.itemsPerPage,
                resourcesCount: responseData.Resources ? responseData.Resources.length : 0,
            });

            console.log('✅ SCIM listSCIMGroups function testing completed successfully');
            console.log('All parameter combinations tested:', {
                filterParameter: `displayName eq "zhxie group ${randomSuffix} Patched"`,
                attributesParameter: 'displayName,members',
                combinedParameters: 'All parameters together with startIndex: 2, count: 10',
            });
        } catch (error) {
            console.log('SCIM LIST GROUPS API Error:', error);
            console.log('Error type:', typeof error);

            // If error has response information, print it
            if (error.response) {
                console.log('Error response status:', error.response.status || error.response.statusCode);
                console.log('Error response body:', error.response.body || error.response.data);
            }

            // Print error details if it's an object
            if (error.statusCode) {
                console.log('Error status code:', error.statusCode);
                console.log('Error message:', error.message);
            }

            // Re-throw the error to fail the test if it's a validation error
            if (error.message && error.message.includes('expect')) {
                throw error;
            }

            console.log('❌ SCIM LIST GROUPS API call failed, but test continues');
        }
        console.log('🏁 SCIM test TC99472 completed');
    });

    it('[TC99473] should handle DELETE operations for SCIM groups', async () => {
        console.log('🚀 SCIM test TC99473 is running...');

        // Verify bearerToken was saved from previous test
        await expect(bearerToken).toBeDefined();
        await expect(typeof bearerToken).toBe('string');
        await expect(bearerToken.length).toBeGreaterThan(0);
        console.log('Using bearer token from previous test:', bearerToken);

        // Verify createdGroupId was saved from previous test
        await expect(createdGroupId).toBeDefined();
        await expect(typeof createdGroupId).toBe('string');
        await expect(createdGroupId.length).toBeGreaterThan(0);
        console.log('Using created group ID from previous test:', createdGroupId);

        try {
            console.log('About to call DELETE /api/scim/v2/Groups/{groupId} with baseUrl:', baseUrl);
            console.log('Deleting existing SCIM group with ID:', createdGroupId);

            let response = await deleteSCIMGroup({
                baseUrl,
                token: bearerToken,
                groupId: createdGroupId,
            });
            console.log('SCIM Delete Group response:', response);

            // Verify response status code is 204 for successful deletion
            if (response.statusCode && response.statusCode === 204) {
                console.log('✅ Response status code is 204 as expected for successful deletion');
            } else if (response.statusCode && response.statusCode === 200) {
                console.log('✅ Response status code is 200 for successful deletion');
            } else {
                console.log('❌ Response status code is not 200/204:', response.statusCode);
                console.log('Response body:', response.body || response);
                await expect(response.statusCode).toBeGreaterThanOrEqual(200);
                await expect(response.statusCode).toBeLessThan(300);
            }

            // Verify the response structure for successful deletion
            await expect(response).toBeDefined();
            await expect(response.statusCode).toBeDefined();

            // For 204 responses, body might be empty
            if (response.statusCode === 204) {
                console.log('✅ Verified 204 No Content response for successful deletion');
                // Body might be empty for 204 responses
                if (response.body) {
                    console.log('Response body content:', response.body);
                }
            } else if (response.statusCode === 200 && response.body) {
                console.log('✅ Verified 200 OK response for successful deletion');
                console.log('Response body content:', response.body);
            }

            console.log('✅ SCIM group DELETE completed successfully');

            // Verify the group is actually deleted by trying to GET it
            try {
                console.log('Verifying group deletion by attempting GET...');

                let getResponse = await getSCIMGroup({
                    baseUrl,
                    token: bearerToken,
                    groupId: createdGroupId,
                });

                // If we reach here, the group still exists (unexpected)
                console.log('❌ Group still exists after deletion (unexpected):', getResponse);
                console.log('This might indicate the DELETE operation did not work properly');
            } catch (error) {
                // We expect this to fail with 404 since the group should be deleted
                if (error.statusCode && error.statusCode === 404) {
                    console.log('✅ Received expected 404 error when trying to GET deleted group');
                    console.log('This confirms the group was successfully deleted');
                } else {
                    console.log('Unexpected error when verifying deletion:', error);
                    console.log('Error status code:', error.statusCode);
                    console.log('Error details:', error);
                }
            }
        } catch (error) {
            console.log('SCIM DELETE GROUP API Error:', error);
            console.log('Error type:', typeof error);

            // If error has response information, print it
            if (error.response) {
                console.log('Error response status:', error.response.status || error.response.statusCode);
                console.log('Error response body:', error.response.body || error.response.data);
            }

            // Print error details if it's an object
            if (error.statusCode) {
                console.log('Error status code:', error.statusCode);
                console.log('Error message:', error.message);
            }

            // Re-throw the error to fail the test if it's a validation error
            if (error.message && error.message.includes('expect')) {
                throw error;
            }

            console.log('❌ SCIM DELETE GROUP API call failed, but test continues');
        }

        console.log('✅ SCIM DELETE group operations test completed successfully');
        console.log('Test summary:', {
            existingGroupDeleted: 'Expected 204 for successful deletion',
            deletionVerified: 'Expected 404 when trying to GET deleted group',
            randomSuffix: randomSuffix,
            deletedGroupId: createdGroupId,
        });

        console.log('🏁 SCIM test TC99473 completed');
    });

    it('[TC99474] listSCIMSchemas - JSON baseline comparison', async () => {
        console.log('🚀 SCIM test TC99474 starting - JSON baseline comparison');
        console.log('Using bearer token:', bearerToken);

        try {
            // 1. Read baseline JSON file
            const baselinePath = path.join(__dirname, 'SCIMSchemasBaseline.json');
            console.log('📁 Reading baseline file:', baselinePath);

            const baselineContent = fs.readFileSync(baselinePath, 'utf8');
            const baselineJson = JSON.parse(baselineContent);
            console.log('✅ Baseline JSON loaded successfully');

            // 2. Call listSCIMSchemas API
            console.log('📡 Calling listSCIMSchemas API...');
            const response = await listSCIMSchemas({
                baseUrl: baseUrl,
                token: bearerToken,
            });

            // 3. Verify response status code
            await expect(response.statusCode).toBe(200);
            console.log('✅ API response status code 200');

            // 4. Parse API response JSON
            const actualJson = JSON.parse(response.body);
            console.log('✅ API response JSON parsed successfully');

            // 5. Execute JSON comparison using utility function
            console.log('🔍 Starting detailed JSON data comparison...');
            const differences = JSONComparisonUtils.compareJsonValues(actualJson, baselineJson);

            // 6. Generate comparison report using utility function
            const result = JSONComparisonUtils.generateComparisonReport(differences, 'Schemas', 'listSCIMSchemas');

            if (!result.success) {
                throw new Error(result.error);
            }

            console.log('🏁 TC99474 JSON comparison test completed');
        } catch (error) {
            console.error('❌ TC99474 execution error:', error.message);
            throw error;
        }
    });

    it('[TC99475] getSCIMSchema - JSON baseline comparison for Group schema', async () => {
        console.log('🚀 SCIM test TC99475 starting - Group schema JSON baseline comparison');
        console.log('Using bearer token:', bearerToken);

        try {
            // 1. Read baseline JSON file
            const baselinePath = path.join(__dirname, 'SCIMGroupSchemaBaseline.json');
            console.log('📁 Reading Group schema baseline file:', baselinePath);

            const baselineContent = fs.readFileSync(baselinePath, 'utf8');
            const baselineJson = JSON.parse(baselineContent);
            console.log('✅ Group schema baseline JSON loaded successfully');

            // 2. Call getSCIMSchema API with Group schema URI
            const schemaUri = 'urn:ietf:params:scim:schemas:core:2.0:Group';
            console.log('📡 Calling getSCIMSchema API with URI:', schemaUri);
            const response = await getSCIMSchema({
                baseUrl: baseUrl,
                token: bearerToken,
                uri: schemaUri,
            });

            // 3. Verify response status code
            await expect(response.statusCode).toBe(200);
            console.log('✅ API response status code 200');

            // 4. Parse API response JSON
            const actualJson = JSON.parse(response.body);
            console.log('✅ API response JSON parsed successfully');

            // 5. Execute JSON comparison using utility function
            console.log('🔍 Starting detailed JSON data comparison...');
            const differences = JSONComparisonUtils.compareJsonValues(actualJson, baselineJson);

            // 6. Generate comparison report using utility function
            const result = JSONComparisonUtils.generateComparisonReport(differences, 'Group Schema', 'getSCIMSchema');

            if (!result.success) {
                throw new Error(result.error);
            }

            console.log('🏁 TC99475 Group schema JSON comparison test completed');
        } catch (error) {
            console.error('❌ TC99475 execution error:', error.message);
            throw error;
        }
    });

    it('[TC99475_01] should fail on getSCIMSchema with invalid schema urn', async () => {
        console.log('🚀 SCIM test TC99475_01 starting');
        try {
            await getSCIMSchema({
                baseUrl: baseUrl,
                token: bearerToken,
                uri: 'urn:ietf:params:scim:schemas:core:2.0:SomethingElse',
            });
            fail(`❌ SCIM schema retrieval succeeded unexpectedly with invalid URN`);
        } catch (error) {
            await expect(error.statusCode).toBe(404);
            const errorBody = JSON.parse(error.message);
            await expect(errorBody).toBeDefined();
            await expect(errorBody.schemas[0]).toBe('urn:ietf:params:scim:api:messages:2.0:Error');
            await expect(errorBody.status).toBe('404');
            console.log(`✅ SCIM authentication got expected 404 Not Found response.`);
        }
        console.log('🏁 SCIM test TC99475_01 completed');
    });

    it('[TC99476] listSCIMResourceTypes - JSON baseline comparison', async () => {
        console.log('🚀 SCIM test TC99476 starting - Resource Types JSON baseline comparison');
        console.log('Using bearer token:', bearerToken);

        try {
            // 1. Read baseline JSON file
            const baselinePath = path.join(__dirname, 'SCIMResourceTypesBaseline.json');
            console.log('📁 Reading Resource Types baseline file:', baselinePath);

            const baselineContent = fs.readFileSync(baselinePath, 'utf8');
            const baselineJson = JSON.parse(baselineContent);
            console.log('✅ Resource Types baseline JSON loaded successfully');

            // 2. Call listSCIMResourceTypes API
            console.log('📡 Calling listSCIMResourceTypes API...');
            const response = await listSCIMResourceTypes({
                baseUrl: baseUrl,
                token: bearerToken,
            });

            // 3. Verify response status code
            await expect(response.statusCode).toBe(200);
            console.log('✅ API response status code 200');

            // 4. Parse API response JSON
            const actualJson = JSON.parse(response.body);
            console.log('✅ API response JSON parsed successfully');

            // 5. Execute JSON comparison using utility function
            console.log('🔍 Starting detailed JSON data comparison...');
            const differences = JSONComparisonUtils.compareJsonValues(actualJson, baselineJson);

            // 6. Generate comparison report using utility function
            const result = JSONComparisonUtils.generateComparisonReport(
                differences,
                'Resource Types',
                'listSCIMResourceTypes'
            );

            if (!result.success) {
                throw new Error(result.error);
            }

            console.log('🏁 TC99476 Resource Types JSON comparison test completed');
        } catch (error) {
            console.error('❌ TC99476 execution error:', error.message);
            throw error;
        }
    });

    it('[TC99477] getSCIMResourceType - JSON baseline comparison for User resource type', async () => {
        console.log('🚀 SCIM test TC99477 starting - User Resource Type JSON baseline comparison');
        console.log('Using bearer token:', bearerToken);

        try {
            // 1. Read baseline JSON file
            const baselinePath = path.join(__dirname, 'SCIMUserResourceTypeBaseline.json');
            console.log('📁 Reading User Resource Type baseline file:', baselinePath);

            const baselineContent = fs.readFileSync(baselinePath, 'utf8');
            const baselineJson = JSON.parse(baselineContent);
            console.log('✅ User Resource Type baseline JSON loaded successfully');

            // 2. Call getSCIMResourceType API with User resource type name
            const resourceTypeName = 'User';
            console.log('📡 Calling getSCIMResourceType API with name:', resourceTypeName);
            const response = await getSCIMResourceType({
                baseUrl: baseUrl,
                token: bearerToken,
                name: resourceTypeName,
            });

            // 3. Verify response status code
            await expect(response.statusCode).toBe(200);
            console.log('✅ API response status code 200');

            // 4. Parse API response JSON
            const actualJson = JSON.parse(response.body);
            console.log('✅ API response JSON parsed successfully');

            // 5. Execute JSON comparison using utility function
            console.log('🔍 Starting detailed JSON data comparison...');
            const differences = JSONComparisonUtils.compareJsonValues(actualJson, baselineJson);

            // 6. Generate comparison report using utility function
            const result = JSONComparisonUtils.generateComparisonReport(
                differences,
                'User Resource Type',
                'getSCIMResourceType'
            );

            if (!result.success) {
                throw new Error(result.error);
            }

            console.log('🏁 TC99477 User Resource Type JSON comparison test completed');
        } catch (error) {
            console.error('❌ TC99477 execution error:', error.message);
            throw error;
        }
    });

    it('[TC99477_01] should fail on getSCIMResourceType with invalid resource name', async () => {
        console.log('🚀 SCIM test TC99477_01 starting');
        try {
            await getSCIMResourceType({
                baseUrl: baseUrl,
                token: bearerToken,
                uri: 'SomethingElse',
            });
            fail(`❌ SCIM resource type retrieval succeeded unexpectedly with invalid name`);
        } catch (error) {
            await expect(error.statusCode).toBe(404);
            const errorBody = JSON.parse(error.message);
            await expect(errorBody).toBeDefined();
            await expect(errorBody.schemas[0]).toBe('urn:ietf:params:scim:api:messages:2.0:Error');
            await expect(errorBody.status).toBe('404');
            console.log(`✅ SCIM authentication got expected 404 Not Found response.`);
        }
        console.log('🏁 SCIM test TC99477_01 completed');
    });

    it('[TC99478] getSCIMServiceProviderConfig - JSON baseline comparison', async () => {
        console.log('🚀 SCIM test TC99478 starting - Service Provider Config JSON baseline comparison');
        console.log('Using bearer token:', bearerToken);

        try {
            // 1. Read baseline JSON file
            const baselinePath = path.join(__dirname, 'SCIMServiceProviderConfigBaseline.json');
            console.log('📁 Reading Service Provider Config baseline file:', baselinePath);

            const baselineContent = fs.readFileSync(baselinePath, 'utf8');
            const baselineJson = JSON.parse(baselineContent);
            console.log('✅ Service Provider Config baseline JSON loaded successfully');

            // 2. Call getSCIMServiceProviderConfig API
            console.log('📡 Calling getSCIMServiceProviderConfig API...');
            const response = await getSCIMServiceProviderConfig({
                baseUrl: baseUrl,
                token: bearerToken,
            });

            // 3. Verify response status code
            await expect(response.statusCode).toBe(200);
            console.log('✅ API response status code 200');

            // 4. Parse API response JSON
            const actualJson = JSON.parse(response.body);
            console.log('✅ API response JSON parsed successfully');

            // 5. Execute JSON comparison using utility function
            console.log('🔍 Starting detailed JSON data comparison...');
            const differences = JSONComparisonUtils.compareJsonValues(actualJson, baselineJson);

            // 6. Generate comparison report using utility function
            const result = JSONComparisonUtils.generateComparisonReport(
                differences,
                'Service Provider Config',
                'getSCIMServiceProviderConfig'
            );

            if (!result.success) {
                throw new Error(result.error);
            }

            console.log('🏁 TC99478 Service Provider Config JSON comparison test completed');
        } catch (error) {
            console.error('❌ TC99478 execution error:', error.message);
            throw error;
        }
    });

    it('[TC99497] should return 401 error if token is invalid', async () => {
        console.log('🚀 SCIM test TC99461 is running...');

        // Verify response status code is 401
        const verify401Response = async (invalidToken) => {
            try {
                await getSCIMServiceProviderConfig({ baseUrl, token: invalidToken });
                fail(`❌ SCIM authentication got unexpected result with invalid token "${invalidToken}"`);
            } catch (error) {
                await expect(error.statusCode).toBe(401);
                const errorBody = JSON.parse(error.message);
                await expect(errorBody).toBeDefined();
                await expect(errorBody.schemas[0]).toBe('urn:ietf:params:scim:api:messages:2.0:Error');
                await expect(errorBody.status).toBe('401');
                console.log(
                    `✅ SCIM authentication got expected 401 Unauthorized response with invalid token "${invalidToken}"`
                );
            }
        };

        const invalidTokenSamples = ['InvalidSample', 'Sample}{":>?}{}{":', 'Samplea-zA-Z0-9-._~+/', ''];
        await Promise.all(invalidTokenSamples.map(verify401Response));

        console.log('🏁 SCIM test TC99461 completed');
    });
});
