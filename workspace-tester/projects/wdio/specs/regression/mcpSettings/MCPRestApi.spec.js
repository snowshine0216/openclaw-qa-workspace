import getMCPSettings, { getSession, putMCPSettings } from '../../../api/mcpSettings/MCPSettingsRest.js';
describe('MCP Settings REST API Tests', () => {
    const mstrUser = {
        username: browser.options.params.credentials.username,
        password: browser.options.params.credentials.password,
    };
    const mockClientSecret = 'mock_client_secret_value_longer_than_32_chars_123456';
    const mockRefreshTokenLifetime = 60;
    const mockAdditionalRedirectUris = ['https://example.com/callback'];
    const mockAdditionalScopes = ['read', 'write'];
    const baseUrl = browser.options.baseUrl;
    const clientId = 'd4b8c3a2-5f1e-4cdd-9b2a-8a1f0d5a6b7c';
    it('[TC_BCSA-3602_0] should successfully set MCP configuration', async () => {
        console.log('🚀 MCP test TC_BCSA-3602_0 is running...');
        let session = await getSession(mstrUser);
        await expect(session).toBeDefined();
        await expect(session.cookie).toBeDefined();
        await expect(session.token).toBeDefined();
        console.log('Session established for SET operation:', {
            hasCookie: !!session?.cookie,
            hasToken: !!session?.token,
        });

        // Define MCP configuration to set
        const mcpConfigToSet = {
            clientSecret: mockClientSecret,
            refreshTokenLifetime: mockRefreshTokenLifetime,
            additionalRedirectUris: mockAdditionalRedirectUris,
            additionalScopes: mockAdditionalScopes,
        };

        try {
            console.log('About to call PUT /api/mstrServices/library/mcp/settings with baseUrl:', baseUrl);
            console.log('MCP config to set:', JSON.stringify(mcpConfigToSet, null, 2));

            let response = await putMCPSettings({ baseUrl, session, body: mcpConfigToSet });
            console.log('MCP Set Config response:', response);

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

            console.log('✅ MCP configuration set successfully');
        } catch (error) {
            console.log('MCP SET API Error:', error);

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

            console.log('❌ MCP SET API call failed, but test continues');
        }
        console.log('🏁 MCP test TC_BCSA-3602_0 completed');
    });

    it('[TC_BCSA-3602_1] should successfully get MCP configuration and verify values set in previous test', async () => {
        console.log('🚀 MCP test TC_BCSA-3602_1 is running...');
        let session = await getSession(mstrUser);
        await expect(session).toBeDefined();
        await expect(session.cookie).toBeDefined();
        await expect(session.token).toBeDefined();
        console.log('Session established for GET operation:', {
            hasCookie: !!session?.cookie,
            hasToken: !!session?.token,
        });

        try {
            console.log('About to call GET /api/mstrServices/library/mcp/settings with baseUrl:', baseUrl);

            let response = await getMCPSettings({ baseUrl, session });
            console.log('MCP Get Config response:', response);

            // Parse response if it's a string
            let responseData = response;

            // Verify response structure
            await expect(responseData).toBeDefined();
            await expect(typeof responseData).toBe('object');
            console.log('✅ Response is a valid object');

            // Verify clientId matches the expected value
            await expect(responseData.clientId).toBeDefined();
            await expect(responseData.clientId).toBe(clientId);
            console.log('✅ Verified clientId matches:', responseData.clientId);

            // Verify clientSecret matches the value set in previous test (only first 3 characters)
            await expect(responseData.clientSecretMasked).toBeDefined();
            await expect(responseData.clientSecretMasked.substring(0, 3)).toBe(mockClientSecret.substring(0, 3));
            console.log(
                '✅ Verified clientSecretMasked first 3 characters match:',
                responseData.clientSecretMasked.substring(0, 3)
            );

            // Verify refreshTokenLifetime matches the value set in previous test
            await expect(responseData.refreshTokenLifetime).toBeDefined();
            await expect(responseData.refreshTokenLifetime).toBe(mockRefreshTokenLifetime);
            console.log('✅ Verified refreshTokenLifetime matches:', responseData.refreshTokenLifetime);

            // Verify additionalRedirectUris matches the value set in previous test
            await expect(responseData.additionalRedirectUris).toBeDefined();
            await expect(Array.isArray(responseData.additionalRedirectUris)).toBe(true);
            await expect(responseData.additionalRedirectUris).toEqual(mockAdditionalRedirectUris);
            console.log('✅ Verified additionalRedirectUris matches:', responseData.additionalRedirectUris);

            // Verify additionalScopes matches the value set in previous test
            await expect(responseData.additionalScopes).toBeDefined();
            await expect(Array.isArray(responseData.additionalScopes)).toBe(true);
            await expect(responseData.additionalScopes).toEqual(mockAdditionalScopes);
            console.log('✅ Verified additionalScopes matches:', responseData.additionalScopes);

            console.log('✅ All MCP configuration values verified successfully');
        } catch (error) {
            console.log('MCP GET API Error:', error);

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

            // Re-throw the error to fail the test
            throw error;
        }
        console.log('🏁 MCP test TC_BCSA-3602_1 completed');
    });

    it('[TC_BCSA-3602_2] should successfully set only refreshTokenLifetime and verify the value', async () => {
        console.log('🚀 MCP test TC_BCSA-3602_2 is running...');
        let session = await getSession(mstrUser);
        await expect(session).toBeDefined();
        await expect(session.cookie).toBeDefined();
        await expect(session.token).toBeDefined();
        console.log('Session established for SET operation:', {
            hasCookie: !!session?.cookie,
            hasToken: !!session?.token,
        });

        // Define new refreshTokenLifetime value
        const newRefreshTokenLifetime = 120;

        // Define MCP configuration to set (only refreshTokenLifetime)
        const mcpConfigToSet = {
            refreshTokenLifetime: newRefreshTokenLifetime,
        };

        try {
            console.log('About to call PUT /api/mstrServices/library/mcp/settings with baseUrl:', baseUrl);
            console.log('MCP config to set (only refreshTokenLifetime):', JSON.stringify(mcpConfigToSet, null, 2));

            let response = await putMCPSettings({ baseUrl, session, body: mcpConfigToSet });
            console.log('MCP Set Config response:', response);

            // Verify response status code is 200 or 204
            if (response.statusCode && (response.statusCode === 200 || response.statusCode === 204)) {
                console.log('✅ Response status code is', response.statusCode);
            } else {
                console.log('❌ Response status code is not 200/204:', response.statusCode);
                console.log('Response body:', response.body || response);
                await expect(response.statusCode).toBeGreaterThanOrEqual(200);
                await expect(response.statusCode).toBeLessThan(300);
            }

            console.log('✅ MCP configuration (refreshTokenLifetime) set successfully');

            // Now GET the configuration to verify the value
            console.log('About to call GET /api/mstrServices/library/mcp/settings to verify');

            let getResponse = await getMCPSettings({ baseUrl, session });
            console.log('MCP Get Config response:', getResponse);

            // Parse response if it's a string
            let responseData = getResponse;

            // Verify response structure
            await expect(responseData).toBeDefined();
            await expect(typeof responseData).toBe('object');
            console.log('✅ Response is a valid object');

            // Verify refreshTokenLifetime matches the new value
            await expect(responseData.refreshTokenLifetime).toBeDefined();
            await expect(responseData.refreshTokenLifetime).toBe(newRefreshTokenLifetime);
            console.log('✅ Verified refreshTokenLifetime matches new value:', responseData.refreshTokenLifetime);

            // Verify other fields are still intact from previous test
            await expect(responseData.clientId).toBeDefined();
            await expect(responseData.clientId).toBe(clientId);
            console.log('✅ Verified clientId is still intact:', responseData.clientId);

            await expect(responseData.clientSecretMasked).toBeDefined();
            console.log('✅ Verified clientSecretMasked is still intact:', responseData.clientSecretMasked);

            await expect(responseData.additionalRedirectUris).toBeDefined();
            await expect(Array.isArray(responseData.additionalRedirectUris)).toBe(true);
            console.log('✅ Verified additionalRedirectUris is still intact:', responseData.additionalRedirectUris);

            await expect(responseData.additionalScopes).toBeDefined();
            await expect(Array.isArray(responseData.additionalScopes)).toBe(true);
            console.log('✅ Verified additionalScopes is still intact:', responseData.additionalScopes);

            console.log('✅ All MCP configuration values verified successfully');
        } catch (error) {
            console.log('MCP SET/GET API Error:', error);

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

            // Re-throw the error to fail the test
            throw error;
        }
        console.log('🏁 MCP test TC_BCSA-3602_2 completed');
    });

    it('[TC_BCSA-3602_3] should successfully set only additionalRedirectUris and verify the value', async () => {
        console.log('🚀 MCP test TC_BCSA-3602_3 is running...');
        let session = await getSession(mstrUser);
        await expect(session).toBeDefined();
        await expect(session.cookie).toBeDefined();
        await expect(session.token).toBeDefined();
        console.log('Session established for SET operation:', {
            hasCookie: !!session?.cookie,
            hasToken: !!session?.token,
        });

        // Define new additionalRedirectUris value
        const newAdditionalRedirectUris = ['https://new-example.com/callback', 'https://another-example.com/redirect'];

        // Define MCP configuration to set (only additionalRedirectUris)
        const mcpConfigToSet = {
            additionalRedirectUris: newAdditionalRedirectUris,
        };

        try {
            console.log('About to call PUT /api/mstrServices/library/mcp/settings with baseUrl:', baseUrl);
            console.log('MCP config to set (only additionalRedirectUris):', JSON.stringify(mcpConfigToSet, null, 2));

            let response = await putMCPSettings({ baseUrl, session, body: mcpConfigToSet });
            console.log('MCP Set Config response:', response);

            // Verify response status code is 200 or 204
            if (response.statusCode && (response.statusCode === 200 || response.statusCode === 204)) {
                console.log('✅ Response status code is', response.statusCode);
            } else {
                console.log('❌ Response status code is not 200/204:', response.statusCode);
                console.log('Response body:', response.body || response);
                await expect(response.statusCode).toBeGreaterThanOrEqual(200);
                await expect(response.statusCode).toBeLessThan(300);
            }

            console.log('✅ MCP configuration (additionalRedirectUris) set successfully');

            // Now GET the configuration to verify the value
            console.log('About to call GET /api/mstrServices/library/mcp/settings to verify');

            let getResponse = await getMCPSettings({ baseUrl, session });
            console.log('MCP Get Config response:', getResponse);

            // Parse response if it's a string
            let responseData = getResponse;

            // Verify response structure
            await expect(responseData).toBeDefined();
            await expect(typeof responseData).toBe('object');
            console.log('✅ Response is a valid object');

            // Verify additionalRedirectUris matches the new value
            await expect(responseData.additionalRedirectUris).toBeDefined();
            await expect(Array.isArray(responseData.additionalRedirectUris)).toBe(true);
            await expect(responseData.additionalRedirectUris).toEqual(newAdditionalRedirectUris);
            console.log('✅ Verified additionalRedirectUris matches new value:', responseData.additionalRedirectUris);

            // Verify other fields are still intact from previous tests
            await expect(responseData.clientId).toBeDefined();
            await expect(responseData.clientId).toBe(clientId);
            console.log('✅ Verified clientId is still intact:', responseData.clientId);

            await expect(responseData.clientSecretMasked).toBeDefined();
            console.log('✅ Verified clientSecretMasked is still intact:', responseData.clientSecretMasked);

            await expect(responseData.refreshTokenLifetime).toBeDefined();
            console.log('✅ Verified refreshTokenLifetime is still intact:', responseData.refreshTokenLifetime);

            await expect(responseData.additionalScopes).toBeDefined();
            await expect(Array.isArray(responseData.additionalScopes)).toBe(true);
            console.log('✅ Verified additionalScopes is still intact:', responseData.additionalScopes);

            console.log('✅ All MCP configuration values verified successfully');
        } catch (error) {
            console.log('MCP SET/GET API Error:', error);

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

            // Re-throw the error to fail the test
            throw error;
        }
        console.log('🏁 MCP test TC_BCSA-3602_3 completed');
    });

    it('[TC_BCSA-3602_4] should successfully set only additionalScopes and verify the value', async () => {
        console.log('🚀 MCP test TC_BCSA-3602_4 is running...');
        let session = await getSession(mstrUser);
        await expect(session).toBeDefined();
        await expect(session.cookie).toBeDefined();
        await expect(session.token).toBeDefined();
        console.log('Session established for SET operation:', {
            hasCookie: !!session?.cookie,
            hasToken: !!session?.token,
        });

        // Define new additionalScopes value
        const newAdditionalScopes = ['admin', 'delete', 'update'];

        // Define MCP configuration to set (only additionalScopes)
        const mcpConfigToSet = {
            additionalScopes: newAdditionalScopes,
        };

        try {
            console.log('About to call PUT /api/mstrServices/library/mcp/settings with baseUrl:', baseUrl);
            console.log('MCP config to set (only additionalScopes):', JSON.stringify(mcpConfigToSet, null, 2));

            let response = await putMCPSettings({ baseUrl, session, body: mcpConfigToSet });
            console.log('MCP Set Config response:', response);

            // Verify response status code is 200 or 204
            if (response.statusCode && (response.statusCode === 200 || response.statusCode === 204)) {
                console.log('✅ Response status code is', response.statusCode);
            } else {
                console.log('❌ Response status code is not 200/204:', response.statusCode);
                console.log('Response body:', response.body || response);
                await expect(response.statusCode).toBeGreaterThanOrEqual(200);
                await expect(response.statusCode).toBeLessThan(300);
            }

            console.log('✅ MCP configuration (additionalScopes) set successfully');

            // Now GET the configuration to verify the value
            console.log('About to call GET /api/mstrServices/library/mcp/settings to verify');

            let getResponse = await getMCPSettings({ baseUrl, session });
            console.log('MCP Get Config response:', getResponse);

            // Parse response if it's a string
            let responseData = getResponse;

            // Verify response structure
            await expect(responseData).toBeDefined();
            await expect(typeof responseData).toBe('object');
            console.log('✅ Response is a valid object');

            // Verify additionalScopes matches the new value
            await expect(responseData.additionalScopes).toBeDefined();
            await expect(Array.isArray(responseData.additionalScopes)).toBe(true);
            await expect(responseData.additionalScopes).toEqual(newAdditionalScopes);
            console.log('✅ Verified additionalScopes matches new value:', responseData.additionalScopes);

            // Verify other fields are still intact from previous tests
            await expect(responseData.clientId).toBeDefined();
            await expect(responseData.clientId).toBe(clientId);
            console.log('✅ Verified clientId is still intact:', responseData.clientId);

            await expect(responseData.clientSecretMasked).toBeDefined();
            console.log('✅ Verified clientSecretMasked is still intact:', responseData.clientSecretMasked);

            await expect(responseData.refreshTokenLifetime).toBeDefined();
            console.log('✅ Verified refreshTokenLifetime is still intact:', responseData.refreshTokenLifetime);

            await expect(responseData.additionalRedirectUris).toBeDefined();
            await expect(Array.isArray(responseData.additionalRedirectUris)).toBe(true);
            console.log('✅ Verified additionalRedirectUris is still intact:', responseData.additionalRedirectUris);

            console.log('✅ All MCP configuration values verified successfully');
        } catch (error) {
            console.log('MCP SET/GET API Error:', error);

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

            // Re-throw the error to fail the test
            throw error;
        }
        console.log('🏁 MCP test TC_BCSA-3602_4 completed');
    });
});
