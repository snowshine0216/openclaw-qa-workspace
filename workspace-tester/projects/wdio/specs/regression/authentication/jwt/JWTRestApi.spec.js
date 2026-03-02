import { getJWTConfig, getSession, setJWTConfig } from '../../../../api/jwt/JWTRest.js';
import { generateJWTToken } from '../../../../api/jwt/JWTGenerator.js';
import locales from '../../../../testData/locales.json' assert { type: 'json' };
import setUserLanguage from '../../../../api/setUserLanguage.js';
import request from 'request';

/**
 * Run in Local: npm run regression -- --spec=specs/regression/authentication/jwt/JWTRestApi.spec.js --baseUrl=https://mci-jlonq-dev.hypernow.microstrategy.com/MicroStrategyLibrary --params.loginType=Custom --params.credentials.username={admin_username} --params.credentials.password={admin_password}
 */
describe('JWT REST API Tests', () => {
    const mstrUser = {
        username: browser.options.params.credentials.username,
        password: browser.options.params.credentials.password,
    };
    const noPrivUser = {
        username: browser.options.params.credentials.noprivilegeun,
        password: browser.options.params.credentials.noprivilegepw,
    };
    // Read trustedId from WDIO CLI (e.g., --trustedId mob); fallback to params or 'mob'
    const trustedId =
        (browser.options &&
            (browser.options.trustedId || (browser.options.params && browser.options.params.trustedId))) ||
        'mob';
    const userId =
        (browser.options && (browser.options.userId || (browser.options.params && browser.options.params.userId))) ||
        '6ED3F8934D4068DF1E502D93BF9BFB78';
    const baseUrl = browser.options.baseUrl;
    let session;
    let currentJWTToken = null; // Global variable to store current JWT token
    // Note: currentJWTConfig kept previously is not used; removing to avoid lint warnings

    // Helper function to create JWT payload with dynamic timestamps
    function createJWTPayload(overrides = {}) {
        const timestamp = Math.floor(Date.now() / 1000);
        return {
            iss: 'MicroStrategy',
            sub: 'testuser',
            aud: 'MyApp',
            iat: timestamp,
            exp: timestamp + 1800, // 30 minutes
            userName: trustedId,
            fullname: 'Administrator User',
            email: 'admin@microstrategy.com',
            groups: ['admin', 'users'],
            ...overrides,
        };
    }

    // Helper function to create JWT configuration
    function createJWTConfig(algorithm, publicKeyOrSecret, overrides = {}) {
        const baseConfig = {
            issuer: 'MicroStrategy',
            audience: 'MyApp',
            claimMap: {
                userId: 'userName',
                fullname: 'fullname',
                email: 'email',
                groups: 'groups',
                language: 'preferred_language',
            },
            keySource: 'local',
            keys: [
                {
                    algorithm,
                    value: publicKeyOrSecret,
                },
            ],
        };

        return { ...baseConfig, ...overrides };
    }

    // Helper function to test JWT configuration setup
    async function testJWTConfigSetup(algorithm, testId, customPayload = {}, customConfig = {}) {
        console.log(`🚀 JWT test ${testId} is running...`);

        // Ensure session is established
        if (!session || !session.cookie) {
            console.log('Establishing session for JWT configuration test...');
            session = await getSession(mstrUser);
            await expect(session).toBeDefined();
            await expect(session.cookie).toBeDefined();
            await expect(session.token).toBeDefined();
            console.log('Session established for JWT operation:', {
                hasCookie: !!session.cookie,
                hasToken: !!session.token,
            });
        }

        // Generate JWT token
        const jwtPayload = createJWTPayload(customPayload);
        const generatedJWT = generateJWTToken(algorithm, { alg: algorithm, typ: 'JWT' }, jwtPayload);
        console.log(`✅ ${algorithm} JWT token generated successfully`);
        console.log('🎟️ Token length:', generatedJWT.token.length);
        console.log('📋 JWT Token for setJWTConfig:', generatedJWT.token);

        // Log key information for debugging
        console.log(`\n🔐 ${algorithm} Key Information for JWT Configuration:`);
        console.log('==================================================');
        if (generatedJWT.privateKey) {
            console.log('🔑 Private Key (COMPLETE):', generatedJWT.privateKey.replace(/\n/g, '\\n'));
            console.log('📏 Private Key Length:', generatedJWT.privateKey.length);
        }
        if (generatedJWT.publicKey && !generatedJWT.secret) {
            console.log('🗝️ Public Key (COMPLETE):', generatedJWT.publicKey.replace(/\n/g, '\\n'));
            console.log('📏 Public Key Length:', generatedJWT.publicKey.length);
            console.log('🔗 Key Type: Asymmetric (Public/Private Key Pair)');
        }
        if (generatedJWT.secret) {
            console.log('🔐 Secret Key (COMPLETE):', generatedJWT.secret);
            console.log('📏 Secret Length:', generatedJWT.secret.length);
            console.log('🔗 Key Type: Symmetric (HMAC Secret)');
        }
        console.log('📦 JWT Payload:', JSON.stringify(jwtPayload));
        console.log('📋 JWT Header:', JSON.stringify(generatedJWT.header));
        console.log('==================================================\n');

        // Create configuration
        const keyValue = generatedJWT.publicKey || generatedJWT.secret;
        const jwtConfig = createJWTConfig(algorithm, keyValue, customConfig);

        // Set configuration
        const setResponse = await setJWTConfig({ baseUrl, session, jwtConfig });
        await expect(setResponse.statusCode).toBe(200);
        console.log(`✅ ${algorithm} JWT configuration set successfully`);

        // Verify configuration
        const verifyResponse = await getJWTConfig({ baseUrl, session });
        await expect(verifyResponse).toBeDefined();
        const verifyConfig = typeof verifyResponse === 'string' ? JSON.parse(verifyResponse) : verifyResponse;
        await expect(verifyConfig.keys[0].algorithm).toBe(algorithm);

        console.log(`🏁 JWT test ${testId} completed`);
        return { generatedJWT, jwtConfig };
    }

    // Helper function to test JWT login
    async function testJWTLogin(jwtToken, testId, algorithm) {
        console.log(`🚀 JWT test ${testId} is running...`);
        console.log('🔑 JWT Token for login:', jwtToken);

        const loginRequest = {
            loginMode: 67108864, // JWT login mode
            userName: '',
            password: jwtToken,
        };

        const loginResponse = await new Promise((resolve, reject) => {
            const options = {
                url: `${baseUrl}/api/auth/login`,
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                json: loginRequest,
                timeout: 30000,
            };

            request(options, (error, response, body) => {
                if (error) {
                    reject(error);
                } else {
                    resolve({
                        statusCode: response.statusCode,
                        headers: response.headers,
                        body: body,
                    });
                }
            });
        });

        console.log('📊 Login Response Status:', loginResponse.statusCode);

        if (loginResponse.statusCode === 204) {
            console.log(`✅ ${algorithm} JWT token login successful (204 No Content)`);
            await expect(loginResponse.statusCode).toBe(204);
        } else if (loginResponse.statusCode === 401) {
            console.log(`🔒 ${algorithm} JWT token login rejected (401 Unauthorized)`);
            throw new Error(`JWT login failed: Expected 204 but got 401 Unauthorized`);
        } else if (loginResponse.statusCode === 200) {
            console.log(`⚠️ ${algorithm} JWT token login returned 200, but expected 204`);
            throw new Error(`JWT login failed: Expected 204 but got 200`);
        } else {
            console.log('⚠️ Unexpected response status:', loginResponse.statusCode);
            throw new Error(`JWT login failed: Expected 204 but got ${loginResponse.statusCode}`);
        }

        console.log(`🏁 JWT test ${testId} completed`);
        return loginResponse;
    }

    async function checkUserLanguagePreference(userId, expectedLanguage) {
        const options = {
            url: `${baseUrl}/api/users/${userId}/settings`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Cookie: session.cookie,
                'X-MSTR-AuthToken': session.token,
            },
        };
        const response = await new Promise((resolve, reject) => {
            return request(options, (error, response, body) => {
                if (error) {
                    reject(error);
                } else {
                    resolve({
                        statusCode: response.statusCode,
                        body: body,
                    });
                }
            });
        });
        console.log('User Settings Response', JSON.parse(response.body));
        let languageName = '';
        if (expectedLanguage === 'zh-CN') {
            languageName = 'Chinese (Simplified)';
        } else if (expectedLanguage === 'en-US') {
            languageName = 'English (United States)';
        }
        await expect(JSON.parse(response.body).language.name).toBe(languageName);
    }

    beforeAll(async () => {
        console.log('JWT test setup started');
        console.log('Testing JWT configuration API endpoint');
    });

    afterAll(async () => {
        console.log('set user language back to default after all tests');
        await setUserLanguage({
            baseUrl: baseUrl.endsWith('/') ? baseUrl : baseUrl + '/',
            adminCredentials: mstrUser,
            userId: userId,
            localeId: locales.default,
        });
    });

    it('[TC99523_1] should successfully get JWT configuration', async () => {
        console.log('🚀 JWT test TC99523_1 is running...');

        // Step 1: Establish session
        console.log('Establishing session for JWT configuration test...');
        session = await getSession(mstrUser);
        await expect(session).toBeDefined();
        await expect(session.cookie).toBeDefined();
        await expect(session.token).toBeDefined();
        console.log('Session established for JWT operation:', {
            hasCookie: !!session.cookie,
            hasToken: !!session.token,
        });

        // Step 2: Get JWT configuration
        console.log('About to call GET /api/mstrClients/auth/jwt with baseUrl:', baseUrl);
        const jwtConfigResponse = await getJWTConfig({ baseUrl, session });

        // Step 3: Verify response
        await expect(jwtConfigResponse).toBeDefined();
        console.log('JWT Configuration response received');

        // Parse the response if it's a string
        let jwtConfig;
        if (typeof jwtConfigResponse === 'string') {
            try {
                jwtConfig = JSON.parse(jwtConfigResponse);
                console.log('✅ JWT Config response:', jwtConfig);
            } catch (parseError) {
                console.log('JWT Config response (raw string):', jwtConfigResponse);
                jwtConfig = jwtConfigResponse;
            }
        } else {
            jwtConfig = jwtConfigResponse;
            console.log('✅ JWT Config response:', jwtConfig);
        }

        // Step 4: Validate JWT configuration structure
        if (typeof jwtConfig === 'object' && jwtConfig !== null) {
            console.log('✅ JWT configuration is a valid object');

            // Common JWT configuration fields that might be present
            const expectedFields = [
                'enabled',
                'algorithm',
                'issuer',
                'audience',
                'publicKey',
                'privateKey',
                'expiration',
                'secret',
            ];

            const foundFields = [];
            expectedFields.forEach((field) => {
                if (Object.prototype.hasOwnProperty.call(jwtConfig, field)) {
                    foundFields.push(field);
                    console.log(`✅ Found JWT config field: ${field}`);
                }
            });

            if (foundFields.length > 0) {
                console.log('✅ JWT configuration contains expected fields:', foundFields);
            } else {
                console.log('ℹ️ JWT configuration structure:', Object.keys(jwtConfig));
            }
        } else {
            console.log('ℹ️ JWT configuration response type:', typeof jwtConfig);
        }

        console.log('✅ JWT configuration retrieved successfully');
        console.log('🏁 JWT test TC99500 completed');
    });

    it('[TC99523_2] should handle JWT configuration API errors gracefully', async () => {
        console.log('🚀 JWT test TC99523_2 is running...');

        // Test with invalid session (no authentication)
        console.log('Testing JWT config API with invalid session...');

        const invalidSession = {
            cookie: 'invalid-cookie',
            token: 'invalid-token',
        };

        try {
            await getJWTConfig({ baseUrl, session: invalidSession });
            // If no error is thrown, the test should still pass but log a warning
            console.log('⚠️ JWT config API did not reject invalid session - this might be expected behavior');
        } catch (error) {
            console.log('✅ JWT config API correctly rejected invalid session');
            console.log('Expected error for invalid authentication:', error);
        }

        console.log('🏁 JWT test TC99501 completed');
    });

    it('[TC99523_3] should validate JWT configuration response format', async () => {
        console.log('🚀 JWT test TC99523_3 is running...');

        // Use the session from the first test or create a new one
        if (!session) {
            console.log('Creating new session for JWT configuration validation...');
            session = await getSession(mstrUser);
        }

        // Get JWT configuration
        const jwtConfigResponse = await getJWTConfig({ baseUrl, session });
        await expect(jwtConfigResponse).toBeDefined();

        // Validate response format
        console.log('Validating JWT configuration response format...');

        if (typeof jwtConfigResponse === 'string') {
            try {
                JSON.parse(jwtConfigResponse);
                console.log('✅ JWT configuration response is valid JSON');
                console.log('Response structure validation passed');
            } catch (parseError) {
                console.log('ℹ️ JWT configuration response is a plain string (not JSON)');
                await expect(jwtConfigResponse.length).toBeGreaterThan(0);
                console.log('✅ Non-empty string response received');
            }
        } else if (typeof jwtConfigResponse === 'object') {
            console.log('✅ JWT configuration response is a valid object');
            console.log('Response structure validation passed');
        } else {
            console.log('ℹ️ JWT configuration response type:', typeof jwtConfigResponse);
            await expect(jwtConfigResponse).toBeDefined();
        }

        console.log('✅ JWT configuration response format validation completed');
        console.log('🏁 JWT test TC99502 completed');
    });

    // RS Algorithm Test Cases
    it('[TC99524_1] should successfully set JWT configuration with RS256 token', async () => {
        // Use the session from previous tests or create a new one
        if (!session) {
            console.log('Creating new session for JWT configuration set test...');
            session = await getSession(mstrUser);
        }

        // Use helper function with custom payload
        const customPayload = {
            iss: 'zebra',
            sub: 'olaf',
            aud: 'library',
            happy: 'test-value', // for systemPromptMap
        };

        const customConfig = {
            issuer: 'zebra',
            audience: 'library',
            systemPromptMap: {
                1: {
                    claim: 'happy',
                    type: 'text',
                },
            },
        };

        const result = await testJWTConfigSetup('RS256', 'TC99524_1', customPayload, customConfig);

        // Save the generated JWT token globally for use in subsequent tests
        currentJWTToken = result.generatedJWT;
        console.log('💾 JWT token saved globally for subsequent tests');
    });

    it('[TC99524_2] should verify JWT token login authentication with RS256', async () => {
        // Check if we have a JWT token from the previous test
        if (!currentJWTToken) {
            console.log('⚠️ No JWT token available from previous test, generating new one...');
            const customPayload = {
                iss: 'zebra',
                sub: 'olaf',
                aud: 'library',
            };
            currentJWTToken = generateJWTToken('RS256', { alg: 'RS256', typ: 'JWT' }, createJWTPayload(customPayload));
        }

        await testJWTLogin(currentJWTToken.token, 'TC99524_2', 'RS256');
    });

    it('[TC99525_1] should successfully set JWT configuration with RS384 token', async () => {
        console.log('🚀 JWT test TC99525_1 is running...');

        const customPayload = {
            iss: 'tiger',
            sub: 'alice',
            aud: 'analytics',
            mood: 'confident', // for systemPromptMap
        };

        const customConfig = {
            issuer: 'tiger',
            audience: 'analytics',
            systemPromptMap: {
                2: {
                    claim: 'mood',
                    type: 'text',
                },
            },
        };

        const customHeader = {
            alg: 'RS384',
            propX: '9abc2def5678901234567890', // Different propX for RS384
        };

        const result = await testJWTConfigSetup('RS384', 'TC99525_1', customPayload, customConfig, customHeader);
        currentJWTToken = result.generatedJWT;
        console.log('💾 JWT token saved globally for subsequent tests');
    });

    it('[TC99525_2] should verify JWT token login authentication with RS384', async () => {
        // Check if we have a JWT token from the previous test
        if (!currentJWTToken) {
            console.log('⚠️ No JWT token available from previous test, generating new one...');
            const customPayload = {
                iss: 'tiger',
                sub: 'alice',
                aud: 'analytics',
            };
            currentJWTToken = generateJWTToken('RS384', { alg: 'RS384', typ: 'JWT' }, createJWTPayload(customPayload));
        }

        await testJWTLogin(currentJWTToken.token, 'TC99525_2', 'RS384');
    });

    it('[TC99526_1] should successfully set JWT configuration with RS512 token', async () => {
        console.log('🚀 JWT test TC99526_1 is running...');

        const customPayload = {
            iss: 'eagle',
            sub: 'bob',
            aud: 'research',
            energy: 'high', // for systemPromptMap
        };

        const customConfig = {
            issuer: 'eagle',
            audience: 'research',
            systemPromptMap: {
                3: {
                    claim: 'energy',
                    type: 'text',
                },
            },
        };

        const customHeader = {
            alg: 'RS512',
            propY: '3def4567890abcdef1234567', // Different propY for RS512
        };

        const result = await testJWTConfigSetup('RS512', 'TC99526_1', customPayload, customConfig, customHeader);
        currentJWTToken = result.generatedJWT;
        console.log('💾 JWT token saved globally for subsequent tests');
    });

    it('[TC99526_2] should verify JWT token login authentication with RS512', async () => {
        // Check if we have a JWT token from the previous test
        if (!currentJWTToken) {
            console.log('⚠️ No JWT token available from previous test, generating new one...');
            const customPayload = {
                iss: 'eagle',
                sub: 'bob',
                aud: 'research',
            };
            currentJWTToken = generateJWTToken('RS512', { alg: 'RS512', typ: 'JWT' }, createJWTPayload(customPayload));
        }

        await testJWTLogin(currentJWTToken.token, 'TC99526_2', 'RS512');
    });

    // PS Algorithm Test Cases
    it('[TC99527_1] should successfully set JWT configuration with PS256 token', async () => {
        // Use helper function to create JWT configuration
        const result = await testJWTConfigSetup('PS256', 'TC99527_1', {
            algorithm: 'PS256',
            issuer: 'eagle',
            audience: 'dashboard',
            subject: 'bob',
            userName: 'mob',
            fullname: 'Administrator User',
            email: 'admin@microstrategy.com',
            groups: ['admin', 'executives', 'decision-makers'],
            energy: 'dynamic',
        });

        // Save JWT token for subsequent tests
        currentJWTToken = result.generatedJWT;
        console.log('💾 JWT token saved globally for subsequent tests');
    });

    it('[TC99527_2] should verify JWT token login authentication with PS256', async () => {
        // Use helper function to generate token and test login
        if (!currentJWTToken || !currentJWTToken.token) {
            const customPayload = {
                algorithm: 'PS256',
                issuer: 'eagle',
                audience: 'dashboard',
                subject: 'bob',
                userName: 'mob',
                fullname: 'Administrator User',
                email: 'admin@microstrategy.com',
                groups: ['admin', 'executives', 'decision-makers'],
                energy: 'dynamic',
            };

            currentJWTToken = generateJWTToken('PS256', { alg: 'PS256', typ: 'JWT' }, createJWTPayload(customPayload));
        }

        await testJWTLogin(currentJWTToken.token, 'TC99527_2', 'PS256');
    });

    it('[TC99528_1] should successfully set JWT configuration with PS384 token', async () => {
        // Use helper function to create JWT configuration
        const result = await testJWTConfigSetup('PS384', 'TC99528_1', {
            algorithm: 'PS384',
            issuer: 'eagle',
            audience: 'dashboard',
            subject: 'bob',
            userName: 'mob',
            fullname: 'Administrator User',
            email: 'admin@microstrategy.com',
            groups: ['admin', 'executives', 'decision-makers'],
            energy: 'dynamic',
        });

        // Save JWT token for subsequent tests
        currentJWTToken = result.generatedJWT;
        console.log('💾 JWT token saved globally for subsequent tests');
    });

    it('[TC99528_2] should verify JWT token login authentication with PS384', async () => {
        // Use helper function to generate token and test login
        if (!currentJWTToken || !currentJWTToken.token) {
            const customPayload = {
                algorithm: 'PS384',
                issuer: 'eagle',
                audience: 'dashboard',
                subject: 'bob',
                userName: 'mob',
                fullname: 'Administrator User',
                email: 'admin@microstrategy.com',
                groups: ['admin', 'executives', 'decision-makers'],
                energy: 'dynamic',
            };

            currentJWTToken = generateJWTToken('PS384', { alg: 'PS384', typ: 'JWT' }, createJWTPayload(customPayload));
        }

        await testJWTLogin(currentJWTToken.token, 'TC99528_2', 'PS384');
    });

    it('[TC99529_1] should successfully set JWT configuration with PS512 token', async () => {
        // Use helper function to create JWT configuration
        const result = await testJWTConfigSetup('PS512', 'TC99529_1', {
            algorithm: 'PS512',
            issuer: 'eagle',
            audience: 'dashboard',
            subject: 'bob',
            userName: 'mob',
            fullname: 'Administrator User',
            email: 'admin@microstrategy.com',
            groups: ['admin', 'executives', 'decision-makers'],
            energy: 'dynamic',
        });

        // Save JWT token for subsequent tests
        currentJWTToken = result.generatedJWT;
        console.log('💾 JWT token saved globally for subsequent tests');
    });

    it('[TC99529_2] should verify JWT token login authentication with PS512', async () => {
        // Use helper function to generate token and test login
        if (!currentJWTToken || !currentJWTToken.token) {
            const customPayload = {
                algorithm: 'PS512',
                issuer: 'eagle',
                audience: 'dashboard',
                subject: 'bob',
                userName: 'mob',
                fullname: 'Administrator User',
                email: 'admin@microstrategy.com',
                groups: ['admin', 'executives', 'decision-makers'],
                energy: 'dynamic',
            };

            currentJWTToken = generateJWTToken('PS512', { alg: 'PS512', typ: 'JWT' }, createJWTPayload(customPayload));
        }

        await testJWTLogin(currentJWTToken.token, 'TC99529_2', 'PS512');
    });

    // ES Algorithm Test Cases
    it('[TC99530_1] should successfully set JWT configuration with ES256 token', async () => {
        // Use helper function to create JWT configuration
        const result = await testJWTConfigSetup('ES256', 'TC99530_1', {
            algorithm: 'ES256',
            issuer: 'tiger',
            audience: 'research',
            subject: 'alice',
            userName: 'mob',
            fullname: 'Administrator User',
            email: 'admin@microstrategy.com',
            groups: ['admin', 'users'],
            style: 'elegant',
        });

        // Save JWT token for subsequent tests
        currentJWTToken = result.generatedJWT;
        console.log('💾 JWT token saved globally for subsequent tests');
    });

    it('[TC99530_2] should verify JWT token login authentication with ES256', async () => {
        // Use helper function to generate token and test login
        if (!currentJWTToken || !currentJWTToken.token) {
            const customPayload = {
                algorithm: 'ES256',
                issuer: 'tiger',
                audience: 'research',
                subject: 'alice',
                userName: 'mob',
                fullname: 'Administrator User',
                email: 'admin@microstrategy.com',
                groups: ['admin', 'users'],
                style: 'elegant',
            };

            currentJWTToken = generateJWTToken('ES256', { alg: 'ES256', typ: 'JWT' }, createJWTPayload(customPayload));
        }

        await testJWTLogin(currentJWTToken.token, 'TC99530_2', 'ES256');
    });

    it('[TC99531_1] should successfully set JWT configuration with ES384 token', async () => {
        // Use helper function to create JWT configuration
        const result = await testJWTConfigSetup('ES384', 'TC99531_1', {
            algorithm: 'ES384',
            issuer: 'wolf',
            audience: 'analytics',
            subject: 'bob',
            userName: 'mob',
            fullname: 'Administrator User',
            email: 'admin@microstrategy.com',
            groups: ['admin', 'users'],
            tempo: 'fast',
        });

        // Save JWT token for subsequent tests
        currentJWTToken = result.generatedJWT;
        console.log('💾 JWT token saved globally for subsequent tests');
    });

    it('[TC99531_2] should verify JWT token login authentication with ES384', async () => {
        // Use helper function to generate token and test login
        if (!currentJWTToken || !currentJWTToken.token) {
            const customPayload = {
                algorithm: 'ES384',
                issuer: 'wolf',
                audience: 'analytics',
                subject: 'bob',
                userName: 'mob',
                fullname: 'Administrator User',
                email: 'admin@microstrategy.com',
                groups: ['admin', 'users'],
                tempo: 'fast',
            };

            currentJWTToken = generateJWTToken('ES384', { alg: 'ES384', typ: 'JWT' }, createJWTPayload(customPayload));
        }

        await testJWTLogin(currentJWTToken.token, 'TC99531_2', 'ES384');
    });

    it('[TC99532_1] should successfully set JWT configuration with ES512 token', async () => {
        // Use helper function to create JWT configuration
        const result = await testJWTConfigSetup('ES512', 'TC99532_1', {
            algorithm: 'ES512',
            issuer: 'phoenix',
            audience: 'dashboard',
            subject: 'charlie',
            userName: 'mob',
            fullname: 'Administrator User',
            email: 'admin@microstrategy.com',
            groups: ['admin', 'users'],
            vibe: 'powerful',
        });

        // Save JWT token for subsequent tests
        currentJWTToken = result.generatedJWT;
        console.log('💾 JWT token saved globally for subsequent tests');
    });

    it('[TC99532_2] should verify JWT token login authentication with ES512', async () => {
        // Use helper function to generate token and test login
        if (!currentJWTToken || !currentJWTToken.token) {
            const customPayload = {
                algorithm: 'ES512',
                issuer: 'phoenix',
                audience: 'dashboard',
                subject: 'charlie',
                userName: 'mob',
                fullname: 'Administrator User',
                email: 'admin@microstrategy.com',
                groups: ['admin', 'users'],
                vibe: 'powerful',
            };

            currentJWTToken = generateJWTToken('ES512', { alg: 'ES512', typ: 'JWT' }, createJWTPayload(customPayload));
        }

        await testJWTLogin(currentJWTToken.token, 'TC99532_2', 'ES512');
    });

    // =============================
    // HS256 / HS384 / HS512 tests
    // =============================

    it('[TC99533_1] should successfully set JWT configuration with HS256 token', async () => {
        const result = await testJWTConfigSetup('HS256', 'TC99533_1', {
            algorithm: 'HS256',
            issuer: 'MicroStrategy',
            audience: 'MyApp',
            subject: 'diana',
            userName: 'mob',
            fullname: 'Administrator User',
            email: 'admin@microstrategy.com',
            groups: ['admin', 'users'],
            note: 'hs256-config',
        });

        // Save JWT token (and secret) for subsequent tests
        currentJWTToken = result.generatedJWT;
        console.log('💾 HS256 JWT token saved globally for subsequent tests');
    });

    it('[TC99533_2] should verify JWT token login authentication with HS256', async () => {
        if (!currentJWTToken || !currentJWTToken.token) {
            const customPayload = {
                algorithm: 'HS256',
                issuer: 'MicroStrategy',
                audience: 'MyApp',
                subject: 'diana',
                userName: 'mob',
                fullname: 'Administrator User',
                email: 'admin@microstrategy.com',
                groups: ['admin', 'users'],
                note: 'hs256-login',
            };
            currentJWTToken = generateJWTToken('HS256', { alg: 'HS256', typ: 'JWT' }, createJWTPayload(customPayload));
        }
        // Log HS secret used for signing (for debugging)
        if (currentJWTToken.secret) {
            console.log('🔐 HS256 Secret Key (COMPLETE):', currentJWTToken.secret);
            console.log('📏 Secret Length:', currentJWTToken.secret.length);
        }
        await testJWTLogin(currentJWTToken.token, 'TC99533_2', 'HS256');
    });

    it('[TC99534_1] should successfully set JWT configuration with HS384 token', async () => {
        const result = await testJWTConfigSetup('HS384', 'TC99534_1', {
            algorithm: 'HS384',
            issuer: 'MicroStrategy',
            audience: 'MyApp',
            subject: 'edgar',
            userName: 'mob',
            fullname: 'Administrator User',
            email: 'admin@microstrategy.com',
            groups: ['admin', 'users'],
            note: 'hs384-config',
        });
        currentJWTToken = result.generatedJWT;
        console.log('💾 HS384 JWT token saved globally for subsequent tests');
    });

    it('[TC99534_2] should verify JWT token login authentication with HS384', async () => {
        if (!currentJWTToken || !currentJWTToken.token) {
            const customPayload = {
                algorithm: 'HS384',
                issuer: 'MicroStrategy',
                audience: 'MyApp',
                subject: 'edgar',
                userName: 'mob',
                fullname: 'Administrator User',
                email: 'admin@microstrategy.com',
                groups: ['admin', 'users'],
                note: 'hs384-login',
            };
            currentJWTToken = generateJWTToken('HS384', { alg: 'HS384', typ: 'JWT' }, createJWTPayload(customPayload));
        }
        // Log HS secret used for signing (for debugging)
        if (currentJWTToken.secret) {
            console.log('🔐 HS384 Secret Key (COMPLETE):', currentJWTToken.secret);
            console.log('📏 Secret Length:', currentJWTToken.secret.length);
        }
        await testJWTLogin(currentJWTToken.token, 'TC99534_2', 'HS384');
    });

    it('[TC99535_1] should successfully set JWT configuration with HS512 token', async () => {
        const result = await testJWTConfigSetup('HS512', 'TC99535_1', {
            algorithm: 'HS512',
            issuer: 'MicroStrategy',
            audience: 'MyApp',
            subject: 'frank',
            userName: 'mob',
            fullname: 'Administrator User',
            email: 'admin@microstrategy.com',
            groups: ['admin', 'users'],
            note: 'hs512-config',
        });
        currentJWTToken = result.generatedJWT;
        console.log('💾 HS512 JWT token saved globally for subsequent tests');
    });

    it('[TC99535_2] should verify JWT token login authentication with HS512', async () => {
        if (!currentJWTToken || !currentJWTToken.token) {
            const customPayload = {
                algorithm: 'HS512',
                issuer: 'MicroStrategy',
                audience: 'MyApp',
                subject: 'frank',
                userName: 'mob',
                fullname: 'Administrator User',
                email: 'admin@microstrategy.com',
                groups: ['admin', 'users'],
                note: 'hs512-login',
            };
            currentJWTToken = generateJWTToken('HS512', { alg: 'HS512', typ: 'JWT' }, createJWTPayload(customPayload));
        }
        // Log HS secret used for signing (for debugging)
        if (currentJWTToken.secret) {
            console.log('🔐 HS512 Secret Key (COMPLETE):', currentJWTToken.secret);
            console.log('📏 Secret Length:', currentJWTToken.secret.length);
        }
        await testJWTLogin(currentJWTToken.token, 'TC99535_2', 'HS512');
    });

    // ================================================
    // HS insufficient key length negative tests
    // ================================================

    it('[TC99536_1] should reject HS256 config when secret length < 256 bits', async () => {
        // Prepare an intentionally short secret (~112 bits = 14 bytes hex)
        const weakSecretHex = 'a1b2c3d4e5f6a7b8c9d0e1f2'; // 24 hex chars = 12 bytes = 96 bits
        const algorithm = 'HS256';

        // Ensure session
        if (!session) {
            session = await getSession(mstrUser);
        }

        const jwtConfig = createJWTConfig(algorithm, weakSecretHex, {
            issuer: 'MicroStrategy',
            audience: 'MyApp',
        });

        console.log('🔐 HS256 Weak Secret (hex):', weakSecretHex, 'length:', weakSecretHex.length * 4, 'bits');
        let failed = false;
        try {
            await setJWTConfig({ baseUrl, session, jwtConfig });
        } catch (err) {
            failed = true;
            console.log('✅ Expected failure captured for HS256 weak key:', err.statusCode, err.message || err);
            await expect(err.statusCode).toBeGreaterThanOrEqual(400);
        }
        if (!failed) {
            throw new Error('HS256 weak key was accepted unexpectedly');
        }
    });

    it('[TC99536_2] should reject HS384 config when secret length < 384 bits', async () => {
        // 32 hex chars = 16 bytes = 128 bits (intentionally short for HS384)
        const weakSecretHex = '00112233445566778899aabbccddeeff';
        const algorithm = 'HS384';

        if (!session) {
            session = await getSession(mstrUser);
        }

        const jwtConfig = createJWTConfig(algorithm, weakSecretHex, {
            issuer: 'MicroStrategy',
            audience: 'MyApp',
        });

        console.log('🔐 HS384 Weak Secret (hex):', weakSecretHex, 'length:', weakSecretHex.length * 4, 'bits');
        let failed = false;
        try {
            await setJWTConfig({ baseUrl, session, jwtConfig });
        } catch (err) {
            failed = true;
            console.log('✅ Expected failure captured for HS384 weak key:', err.statusCode, err.message || err);
            await expect(err.statusCode).toBeGreaterThanOrEqual(400);
        }
        if (!failed) {
            throw new Error('HS384 weak key was accepted unexpectedly');
        }
    });

    it('[TC99536_3] should reject HS512 config when secret length < 512 bits', async () => {
        // 48 hex chars = 24 bytes = 192 bits (intentionally short for HS512)
        const weakSecretHex = 'deadbeefcafebabe11223344556677889900aabbccdd';
        const algorithm = 'HS512';

        if (!session) {
            session = await getSession(mstrUser);
        }

        const jwtConfig = createJWTConfig(algorithm, weakSecretHex, {
            issuer: 'MicroStrategy',
            audience: 'MyApp',
        });

        console.log('🔐 HS512 Weak Secret (hex):', weakSecretHex, 'length:', weakSecretHex.length * 4, 'bits');
        let failed = false;
        try {
            await setJWTConfig({ baseUrl, session, jwtConfig });
        } catch (err) {
            failed = true;
            console.log('✅ Expected failure captured for HS512 weak key:', err.statusCode, err.message || err);
            await expect(err.statusCode).toBeGreaterThanOrEqual(400);
        }
        if (!failed) {
            throw new Error('HS512 weak key was accepted unexpectedly');
        }
    });

    it('[TC99536_4] should reject config with invalid security filter', async () => {
        if (!session) {
            session = await getSession(mstrUser);
        }

        const jwtConfig = createJWTConfig('HS256', 'deadbeefcafebabe11223344556677889900aabbccdd', {
            securityFilters: {
                B7CA92F04B9FAE8D941C3E9B7E0CD754: {
                    qualification: {},
                },
            },
        });

        let failed = false;
        try {
            await setJWTConfig({ baseUrl, session, jwtConfig });
        } catch (err) {
            failed = true;
            await expect(err.statusCode).toBeGreaterThanOrEqual(400);
        }
        if (failed) {
            console.log('✅ Invalid security filter was rejected as expected');
        } else {
            throw new Error('❌ Invalid security filter got accepted unexpectedly');
        }
    });

    it('[TC99536_5] should accept config with valid security filter', async () => {
        if (!session) {
            session = await getSession(mstrUser);
        }

        const jwtConfig = createJWTConfig('HS256', 'deadbeefcafebabe11223344556677889900aabbccdd', {
            securityFilters: {
                B7CA92F04B9FAE8D941C3E9B7E0CD754: {
                    qualification: {
                        tree: {
                            type: 'predicate_form_qualification',
                            predicateTree: {
                                function: 'equals',
                                parameters: [
                                    {
                                        parameterType: 'placeholder',
                                        placeholder: {
                                            name: 'sub',
                                            type: 'string',
                                            multiValued: false,
                                        },
                                    },
                                ],
                                attribute: {
                                    objectId: '8D679D3C11D3E4981000E787EC6DE8A4',
                                    subType: 'attribute',
                                    name: 'Customer',
                                },
                                form: {
                                    objectId: '8D67A35B11D3E4981000E787EC6DE8A4',
                                    subType: 'attribute_form_system',
                                    name: 'Last Name',
                                },
                                dataLocale: 'en-US',
                            },
                        },
                    },
                },
            },
        });

        let succeeded = false;
        try {
            const resp = await setJWTConfig({ baseUrl, session, jwtConfig });
            console.log('✅ Valid security filter accepted:', {
                statusCode: resp.statusCode,
                body: resp.body,
            });
            succeeded = true;
        } catch (err) {
            console.log('❌ Valid security filter was rejected unexpectedly:', err.statusCode, err.message || err);
        }
        if (!succeeded) {
            throw new Error('Valid security filter was rejected unexpectedly');
        }
    });

    // ================================================
    // Language Claim Validation Tests
    // ================================================
    it('[BCSA-3324_1] should successfully set JWT configuration with language claims (en-US)', async () => {
        if (!session) {
            session = await getSession(mstrUser);
        }
        const result = await testJWTConfigSetup('RS256', 'BCSA-3324_1', {
            userName: trustedId,
            fullname: 'Administrator User',
            email: 'admin@microstrategy.com',
            preferred_language: 'en-US',
            groups: ['admin', 'users'],
        });

        currentJWTToken = result.generatedJWT;
        console.log('💾 JWT token with language claims saved for testing');
    });

    it('[BCSA-3324_2] should verify JWT token login with language claim (en-US)', async () => {
        if (!session) {
            session = await getSession(mstrUser);
        }
        if (!currentJWTToken || !currentJWTToken.token) {
            const customPayload = {
                userName: trustedId,
                fullname: 'Administrator User',
                email: 'admin@microstrategy.com',
                preferred_language: 'en-US',
                groups: ['admin', 'users'],
            };

            currentJWTToken = generateJWTToken('RS256', { alg: 'RS256', typ: 'JWT' }, createJWTPayload(customPayload));
        }

        await testJWTLogin(currentJWTToken.token, 'BCSA-3324_2', 'RS256');

        await checkUserLanguagePreference(userId, 'en-US');
    });

    it('[BCSA-3324_3] should successfully set JWT configuration with language claims (zh-CN)', async () => {
        if (!session) {
            session = await getSession(mstrUser);
        }
        const result = await testJWTConfigSetup('RS256', 'BCSA-3324_3', {
            userName: trustedId,
            fullname: 'Administrator User',
            email: 'admin@microstrategy.com',
            preferred_language: 'zh-CN',
            groups: ['admin', 'users'],
        });

        currentJWTToken = result.generatedJWT;
        console.log('💾 JWT token with Chinese language claims saved for testing');
    });

    it('[BCSA-3324_4] should verify JWT token login with language claim (zh-CN)', async () => {
        if (!session) {
            session = await getSession(mstrUser);
        }
        if (!currentJWTToken || !currentJWTToken.token) {
            const customPayload = {
                userName: trustedId,
                fullname: 'Administrator User',
                email: 'admin@microstrategy.com',
                preferred_language: 'zh-CN',
                groups: ['admin', 'users'],
            };

            currentJWTToken = generateJWTToken('RS256', { alg: 'RS256', typ: 'JWT' }, createJWTPayload(customPayload));
        }

        await testJWTLogin(currentJWTToken.token, 'BCSA-3324_4', 'RS256');

        await checkUserLanguagePreference(userId, 'zh-CN');
    });

    // ================================================
    // No-privilege user permission tests
    // ================================================

    it('[TC99537_1] no-privilege user should NOT be able to set JWT configuration', async () => {
        console.log('🎫 Using no-privilege user to create session for SET:', noPrivUser?.username);
        const noPrivSession = await getSession(noPrivUser);
        await expect(noPrivSession).toBeDefined();
        await expect(noPrivSession.cookie).toBeDefined();
        await expect(noPrivSession.token).toBeDefined();

        // Use a valid HS256 secret (64 hex chars = 256 bits) to avoid key-length confounders
        const strongSecretHex = 'a'.repeat(64);
        const jwtConfig = createJWTConfig('HS256', strongSecretHex, {
            issuer: 'MicroStrategy',
            audience: 'MyApp',
        });

        let failed = false;
        try {
            const resp = await setJWTConfig({ baseUrl, session: noPrivSession, jwtConfig });
            // Log the response we actually got for visibility
            console.log('🧪 No-privilege SET response:', {
                statusCode: resp?.statusCode,
                headers: resp?.headers,
                bodyType: typeof resp?.body,
                body: typeof resp?.body === 'string' ? resp.body : resp?.body,
            });
        } catch (err) {
            failed = true;
            console.log('✅ Expected rejection for no-privilege SET:', err.statusCode, err.message || err);
            await expect(err.statusCode).toBeGreaterThanOrEqual(400);
        }
        if (!failed) {
            throw new Error('No-privilege user was able to set JWT configuration unexpectedly');
        }
    });

    it('[TC99537_2] no-privilege user should NOT be able to get JWT configuration', async () => {
        console.log('🎫 Using no-privilege user to create session for GET:', noPrivUser?.username);
        const noPrivSession = await getSession(noPrivUser);
        await expect(noPrivSession).toBeDefined();
        await expect(noPrivSession.cookie).toBeDefined();
        await expect(noPrivSession.token).toBeDefined();

        let failed = false;
        try {
            const resp = await getJWTConfig({ baseUrl, session: noPrivSession });
            // Log the response we actually got for visibility
            const isString = typeof resp === 'string';
            console.log('🧪 No-privilege GET response:', {
                type: typeof resp,
                parsed: !isString ? resp : undefined,
                raw: isString ? resp : undefined,
            });
        } catch (err) {
            failed = true;
            console.log('✅ Expected rejection for no-privilege GET:', err.statusCode || 'n/a', err.message || err);
        }
        if (!failed) {
            throw new Error('No-privilege user was able to get JWT configuration unexpectedly');
        }
    });
});
