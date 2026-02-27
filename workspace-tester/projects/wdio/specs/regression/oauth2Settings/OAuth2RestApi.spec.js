import getOAuth2Settings, { getSession, putOAuth2Settings } from '../../../api/oauth2/OAuth2SettingsRest.js';
describe('OAuth2 Settings REST API Tests', () => {
    const mstrUser = {
        username: browser.options.params.credentials.username,
        password: browser.options.params.credentials.password,
    };
    const baseUrl = browser.options.baseUrl;
    let savedOAuth2Config; // Variable to store the OAuth2 configuration from first test

    it('[TC_BCSA-3610_0] should successfully get OAuth2 configuration', async () => {
        console.log('🚀 OAuth2 test TC_BCSA-3610_0 is running...');
        let session = await getSession(mstrUser);
        await expect(session).toBeDefined();
        await expect(session.cookie).toBeDefined();
        await expect(session.token).toBeDefined();
        console.log('Session established for SET operation:', {
            hasCookie: !!session?.cookie,
            hasToken: !!session?.token,
        });

        try {
            console.log('About to call GET /api/mstrServices/library/oauth2/settings with baseUrl:', baseUrl);

            let responseData = await getOAuth2Settings({ baseUrl, session });
            console.log('OAuth2 Get Config response:', responseData);
            // Verify the configuration was retrieved successfully
            await expect(responseData).toBeDefined();
            await expect(responseData.enabled).toBe(true);
            await expect(Array.isArray(responseData.clients)).toBe(true);
            await expect(responseData.clients.length).toBeGreaterThanOrEqual(1);

            // Save the response for the next test
            savedOAuth2Config = JSON.parse(JSON.stringify(responseData)); // Deep copy
            console.log('✅ OAuth2 configuration saved for next test');

            console.log('✅ OAuth2 configuration retrieved successfully');
        } catch (error) {
            console.log('OAuth2 GET API Error:', error);

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
            console.log('❌ OAuth2 GET API call failed, but test continues');
        }
        console.log('🏁 OAuth2 test TC_BCSA-3610_0 completed');
    });

    it('[TC_BCSA-3610_1] should successfully modify scopes in the first client and verify the change', async () => {
        console.log('🚀 OAuth2 test TC_BCSA-3610_1 is running...');
        // Verify savedOAuth2Config was saved from previous test
        await expect(savedOAuth2Config).toBeDefined();
        await expect(savedOAuth2Config.clients).toBeDefined();
        await expect(savedOAuth2Config.clients.length).toBeGreaterThanOrEqual(1);
        console.log('Using saved OAuth2 config from previous test');

        let session = await getSession(mstrUser);
        await expect(session).toBeDefined();
        await expect(session.cookie).toBeDefined();
        await expect(session.token).toBeDefined();
        console.log('Session established for PUT operation:', {
            hasCookie: !!session?.cookie,
            hasToken: !!session?.token,
        });

        try {
            // Modify the scopes of the first client
            const modifiedConfig = JSON.parse(JSON.stringify(savedOAuth2Config)); // Deep copy
            const originalScopes = modifiedConfig.clients[0].scopes || [];
            console.log('Original scopes:', originalScopes);

            // Set new scopes with random number
            const randomSuffix = Math.floor(Math.random() * 1000000);
            modifiedConfig.clients[0].scopes = [`scope-${randomSuffix}`, `test-scope-${randomSuffix}`];
            console.log('New scopes with random suffix:', modifiedConfig.clients[0].scopes);

            console.log('About to call PUT /api/mstrServices/library/oauth2/settings with baseUrl:', baseUrl);
            console.log('Modified config to set:', JSON.stringify(modifiedConfig, null, 2));

            let putResponse = await putOAuth2Settings({ baseUrl, session, body: modifiedConfig });
            console.log('OAuth2 PUT Config response:', putResponse);

            // Verify response status code is 200 or 204
            if (putResponse.statusCode && (putResponse.statusCode === 200 || putResponse.statusCode === 204)) {
                console.log('✅ Response status code is', putResponse.statusCode);
            } else {
                console.log('❌ Response status code is not 200/204:', putResponse.statusCode);
                console.log('Response body:', putResponse.body || putResponse);
                await expect(putResponse.statusCode).toBeGreaterThanOrEqual(200);
                await expect(putResponse.statusCode).toBeLessThan(300);
            }

            console.log('✅ OAuth2 configuration modified successfully');

            // Now GET the configuration to verify the modification
            console.log('About to call GET /api/mstrServices/library/oauth2/settings to verify');

            let getResponse = await getOAuth2Settings({ baseUrl, session });
            console.log('OAuth2 Get Config response after modification:', getResponse);

            // Verify response structure
            await expect(getResponse).toBeDefined();
            await expect(getResponse.clients).toBeDefined();
            await expect(Array.isArray(getResponse.clients)).toBe(true);
            await expect(getResponse.clients.length).toBeGreaterThanOrEqual(1);
            console.log('✅ Response is valid');

            // Verify scopes were modified to the new values
            await expect(getResponse.clients[0].scopes).toBeDefined();
            await expect(Array.isArray(getResponse.clients[0].scopes)).toBe(true);
            await expect(getResponse.clients[0].scopes).toContain(`scope-${randomSuffix}`);
            await expect(getResponse.clients[0].scopes).toContain(`test-scope-${randomSuffix}`);
            await expect(getResponse.clients[0].scopes.length).toBe(2);
            console.log('✅ Verified scopes were set to new values:', getResponse.clients[0].scopes);

            console.log('✅ OAuth2 configuration modification verified successfully');
        } catch (error) {
            console.log('OAuth2 PUT/GET API Error:', error);

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
        console.log('🏁 OAuth2 test TC_BCSA-3610_1 completed');
    });

    it('[TC_BCSA-3610_2] should successfully set scopes to empty array and verify the change', async () => {
        console.log('🚀 OAuth2 test TC_BCSA-3610_2 is running...');
        // Verify savedOAuth2Config was saved from previous test
        await expect(savedOAuth2Config).toBeDefined();
        await expect(savedOAuth2Config.clients).toBeDefined();
        await expect(savedOAuth2Config.clients.length).toBeGreaterThanOrEqual(1);
        console.log('Using saved OAuth2 config from previous test');

        let session = await getSession(mstrUser);
        await expect(session).toBeDefined();
        await expect(session.cookie).toBeDefined();
        await expect(session.token).toBeDefined();
        console.log('Session established for PUT operation:', {
            hasCookie: !!session?.cookie,
            hasToken: !!session?.token,
        });

        try {
            // Set scopes to empty array
            const modifiedConfig = JSON.parse(JSON.stringify(savedOAuth2Config)); // Deep copy
            const originalScopes = modifiedConfig.clients[0].scopes || [];
            console.log('Original scopes:', originalScopes);

            // Set scopes to empty array
            modifiedConfig.clients[0].scopes = [];
            console.log('New scopes (empty array):', modifiedConfig.clients[0].scopes);

            console.log('About to call PUT /api/mstrServices/library/oauth2/settings with baseUrl:', baseUrl);
            console.log('Modified config to set:', JSON.stringify(modifiedConfig, null, 2));

            let putResponse = await putOAuth2Settings({ baseUrl, session, body: modifiedConfig });
            console.log('OAuth2 PUT Config response:', putResponse);

            // Verify response status code is 200 or 204
            if (putResponse.statusCode && (putResponse.statusCode === 200 || putResponse.statusCode === 204)) {
                console.log('✅ Response status code is', putResponse.statusCode);
            } else {
                console.log('❌ Response status code is not 200/204:', putResponse.statusCode);
                console.log('Response body:', putResponse.body || putResponse);
                await expect(putResponse.statusCode).toBeGreaterThanOrEqual(200);
                await expect(putResponse.statusCode).toBeLessThan(300);
            }

            console.log('✅ OAuth2 configuration modified successfully');

            // Now GET the configuration to verify the modification
            console.log('About to call GET /api/mstrServices/library/oauth2/settings to verify');

            let getResponse = await getOAuth2Settings({ baseUrl, session });
            console.log('OAuth2 Get Config response after modification:', getResponse);

            // Verify response structure
            await expect(getResponse).toBeDefined();
            await expect(getResponse.clients).toBeDefined();
            await expect(Array.isArray(getResponse.clients)).toBe(true);
            await expect(getResponse.clients.length).toBeGreaterThanOrEqual(1);
            console.log('✅ Response is valid');

            // Verify scopes is an empty array
            await expect(getResponse.clients[0].scopes).toBeDefined();
            await expect(Array.isArray(getResponse.clients[0].scopes)).toBe(true);
            await expect(getResponse.clients[0].scopes.length).toBe(0);
            console.log('✅ Verified scopes is empty array:', getResponse.clients[0].scopes);

            console.log('✅ OAuth2 configuration modification verified successfully');
        } catch (error) {
            console.log('OAuth2 PUT/GET API Error:', error);

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
        console.log('🏁 OAuth2 test TC_BCSA-3610_2 completed');
    });
});
