import trustedLogin from '../../../../api/trustedLogin.js';
import getSystemPrompts from '../../../../api/systemPrompts/getSystemPrompts.js';
import logout from '../../../../api/logout.js';
import urlParser from '../../../../api/urlParser.js';

describe('POST /api/auth/login API Test with Trusted Login and System Prompts', () => {
    const mstrUser = {
        userId: browser.options.params.credentials.userId
    };
    const baseUrl = urlParser(browser.options.baseUrl);
    describe('System Prompt Tests', () => {
        it('[BCSA-2440_1] should process ESM system prompts', async () => {
            console.log('🚀 Trusted login API test BCSA-2440_1 is running...');

            const systemPrompts = {
                "54": "system_prompt_54",               // text
                "55": "system_prompt_55",               // text
                "56": 45,                               // numeric
                "57": "2025-10-10",                     // date
                "58": 1234.5678                         // bigdecimal
            };
            const jsonString = JSON.stringify(systemPrompts);
            const utf8Bytes = new TextEncoder().encode(jsonString);
            const base64Encoded = btoa(String.fromCharCode(...utf8Bytes));

            const headers = {
                'mstr-system-prompts': base64Encoded,
                'SM_USER': mstrUser.userId,
            };

            const session = await trustedLogin({ baseUrl, headers });

            const data = await getSystemPrompts({ baseUrl, session });
            await logout({ baseUrl, session });
            console.log("system prompts: " + JSON.stringify(data));

            // Verify system prompts are returned correctly
            expect(data).toBeDefined();
            expect(Array.isArray(data.systemPrompts)).toBe(true);
            expect(data.systemPrompts.length).toBe(5);
            expect(data.systemPrompts[0]["index"]).toBe(54);
            expect(data.systemPrompts[0]["prompt"]).toBe('system_prompt_54');
            expect(data.systemPrompts[1]["index"]).toBe(55);
            expect(data.systemPrompts[1]["prompt"]).toBe('system_prompt_55');
            expect(data.systemPrompts[2]["index"]).toBe(56);
            expect(data.systemPrompts[2]["prompt"]).toBe('45.0');
            expect(data.systemPrompts[3]["index"]).toBe(57);
            expect(data.systemPrompts[3]["prompt"]).toBe('45940.0');
            expect(data.systemPrompts[4]["index"]).toBe(58);
            expect(data.systemPrompts[4]["prompt"]).toBe('1234.5678');
        });

        it('[BCSA-2440_2] should process SSO system prompt', async () => {
            console.log('🚀 Trusted login API test BCSA-2440_2 is running...');
            const systemPrompts = {
                "59": "system_prompt_59",               // text
                "73": "system_prompt_73",               // text
                "74": 74,                               // numeric
                "88": 88,                               // numeric
                "89": "2025-10-10",                     // date
                "98": "2025-12-12"                      // date
            };

            const jsonString = JSON.stringify(systemPrompts);
            const utf8Bytes = new TextEncoder().encode(jsonString);
            const base64Encoded = btoa(String.fromCharCode(...utf8Bytes));

            const headers = {
                'mstr-system-prompts': base64Encoded,
                'SM_USER': mstrUser.userId,
            };

            const session = await trustedLogin({ baseUrl, headers });

            const data = await getSystemPrompts({ baseUrl, session });
            await logout({ baseUrl, session });
            console.log("system prompts: " + JSON.stringify(data));

            // Verify system prompts are returned correctly
            expect(data).toBeDefined();
            expect(Array.isArray(data.systemPrompts)).toBe(true);
            expect(data.systemPrompts.length).toBe(6);
            expect(data.systemPrompts[0]["index"]).toBe(59);
            expect(data.systemPrompts[0]["prompt"]).toBe('system_prompt_59');
            expect(data.systemPrompts[1]["index"]).toBe(73);
            expect(data.systemPrompts[1]["prompt"]).toBe('system_prompt_73');
            expect(data.systemPrompts[2]["index"]).toBe(74);
            expect(data.systemPrompts[2]["prompt"]).toBe('74.0');
            expect(data.systemPrompts[3]["index"]).toBe(88);
            expect(data.systemPrompts[3]["prompt"]).toBe('88.0');
            expect(data.systemPrompts[4]["index"]).toBe(89);
            expect(data.systemPrompts[4]["prompt"]).toBe('45940.0');
            expect(data.systemPrompts[5]["index"]).toBe(98);
            expect(data.systemPrompts[5]["prompt"]).toBe('46003.0');
        });

        it('[BCSA-2440_3] should process both ESM and SSO text system prompt', async () => {
            console.log('🚀 Trusted login API test BCSA-2440_3 is running...');

            const systemPrompts = {
                "54": "system_prompt_54",               // text
                "55": "system_prompt_55",               // text
                "56": 45,                               // numeric
                "57": "2025-10-10",                     // date
                "58": 1234.5678,                        // bigdecimal
                "59": "system_prompt_59",               // text
                "73": "system_prompt_73",               // text
                "74": 74,                               // numeric
                "88": 88,                               // numeric
                "89": "2025-10-10",                     // date
                "98": "2025-12-12"                      // date
            };
            const jsonString = JSON.stringify(systemPrompts);
            const utf8Bytes = new TextEncoder().encode(jsonString);
            const base64Encoded = btoa(String.fromCharCode(...utf8Bytes));

            const headers = {
                'mstr-system-prompts': base64Encoded,
                'SM_USER': mstrUser.userId,
            };

            const session = await trustedLogin({ baseUrl, headers });

            const data = await getSystemPrompts({ baseUrl, session });
            await logout({ baseUrl, session });
            console.log("system prompts: " + JSON.stringify(data));

            // Verify system prompts are returned correctly
            expect(data).toBeDefined();
            expect(Array.isArray(data.systemPrompts)).toBe(true);
            expect(data.systemPrompts.length).toBe(11);
        });

        it('[BCSA-2440_4] should process special characters in text system prompt', async () => {
            console.log('🚀 Trusted login API test BCSA-2440_4 is running...');

            // Construct system prompts JSON
            const systemPrompts = {
                "59": "Hello world",                          // simple text
                "60": "Line1\nLine2\nLine3",                  // newline characters
                "61": "Tab\tSeparated\tValues",               // tabs
                "62": "Quote: \"Double\" and 'Single'",       // quotes
                "63": "Emoji: 😃 🚀 🌟",                       // Unicode characters
                "64": "Backslash: \\"                         // backslash
            };

            const jsonString = JSON.stringify(systemPrompts);
            const utf8Bytes = new TextEncoder().encode(jsonString);
            const base64Encoded = btoa(String.fromCharCode(...utf8Bytes));

            const headers = {
                'mstr-system-prompts': base64Encoded,
                'SM_USER': mstrUser.userId,
            };

            const session = await trustedLogin({ baseUrl, headers });

            const data = await getSystemPrompts({ baseUrl, session });
            await logout({ baseUrl, session });
            console.log("system prompts: " + JSON.stringify(data));

            // Verify system prompts are returned correctly
            expect(data).toBeDefined();
            expect(Array.isArray(data.systemPrompts)).toBe(true);
            expect(data.systemPrompts.length).toBe(6);
            expect(data.systemPrompts[0]["index"]).toBe(59);
            expect(data.systemPrompts[0]["prompt"]).toBe('Hello world');
            expect(data.systemPrompts[1]["index"]).toBe(60);
            expect(data.systemPrompts[1]["prompt"]).toBe('Line1\nLine2\nLine3');
            expect(data.systemPrompts[2]["index"]).toBe(61);
            expect(data.systemPrompts[2]["prompt"]).toBe('Tab\tSeparated\tValues');
            expect(data.systemPrompts[3]["index"]).toBe(62);
            expect(data.systemPrompts[3]["prompt"]).toBe('Quote: "Double" and \'Single\'');
            expect(data.systemPrompts[4]["index"]).toBe(63);
            expect(data.systemPrompts[4]["prompt"]).toBe('Emoji: 😃 🚀 🌟');
            expect(data.systemPrompts[5]["index"]).toBe(64);
            expect(data.systemPrompts[5]["prompt"]).toBe('Backslash: \\');
        });

        // Tests that require a valid system prompt to be set first
        describe('Tests with preparation step', () => {
            let preparedSystemPromptsData;

            beforeEach(async () => {
                // prepare step, set a valid system prompt first
                const systemPrompts = {
                    "54": "system_prompt_54"               // text
                };

                const jsonString = JSON.stringify(systemPrompts);
                const utf8Bytes = new TextEncoder().encode(jsonString);
                const base64Encoded = btoa(String.fromCharCode(...utf8Bytes));

                const headers = {
                    'mstr-system-prompts': base64Encoded,
                    'SM_USER': mstrUser.userId,
                };

                const session = await trustedLogin({ baseUrl, headers });

                const data = await getSystemPrompts({ baseUrl, session });
                await logout({ baseUrl, session });
                console.log("original system prompts: " + JSON.stringify(data));

                preparedSystemPromptsData = data;
            });

            it('[BCSA-2440_5] should skip empty system prompt', async () => {
                console.log('🚀 Trusted login API test BCSA-2440_5 is running...');

                // Test step: set empty system prompts
                const systemPrompts = {
                };

                const jsonString = JSON.stringify(systemPrompts);
                const utf8Bytes = new TextEncoder().encode(jsonString);
                const base64Encoded = btoa(String.fromCharCode(...utf8Bytes));

                const headers = {
                    'mstr-system-prompts': base64Encoded,
                    'SM_USER': mstrUser.userId,
                };

                const session = await trustedLogin({ baseUrl, headers });

                const data = await getSystemPrompts({ baseUrl, session });
                await logout({ baseUrl, session });
                console.log("system prompts: " + JSON.stringify(data));

                // Verify system prompts are not changed
                expect(data).toBeDefined();
                expect(Array.isArray(data.systemPrompts)).toBe(true);
                expect(data.systemPrompts.length).toBe(preparedSystemPromptsData.systemPrompts.length);
            });

            it('[BCSA-2440_6] should skip invalid system prompt json format', async () => {
                console.log('🚀 Trusted login API test BCSA-2440_6 is running...');

                // Test step: set invalid system prompts
                const systemPrompts = {
                    "51": "SimpleText",                     
                    "99": "SimpleText",
                    "1.1": "SimpleText",
                    "abc": "SimpleText",
                    "---": "SimpleText",
                    "   ": "SimpleText"
                };

                const jsonString = JSON.stringify(systemPrompts);
                const utf8Bytes = new TextEncoder().encode(jsonString);
                const base64Encoded = btoa(String.fromCharCode(...utf8Bytes));

                const headers = {
                    'mstr-system-prompts': base64Encoded,
                    'SM_USER': mstrUser.userId,
                };

                const session = await trustedLogin({ baseUrl, headers });

                const data = await getSystemPrompts({ baseUrl, session });
                await logout({ baseUrl, session });
                console.log("system prompts: " + JSON.stringify(data));

                // Verify system prompts are not changed
                expect(data).toBeDefined();
                expect(Array.isArray(data.systemPrompts)).toBe(true);
                expect(data.systemPrompts.length).toBe(preparedSystemPromptsData.systemPrompts.length);
            });

            it('[BCSA-2440_7] should skip invalid base64 encoded system prompt string', async () => {
                console.log('🚀 Trusted login API test BCSA-2440_7 is running...');

                // Test step: set invalid system prompts
                const headers = {
                    'mstr-system-prompts': "    ThisIsNotBase64EncodedString!!!@@@###$$$%%%^^^&&&***((()))   ",
                    'SM_USER': mstrUser.userId,
                };

                const session = await trustedLogin({ baseUrl, headers });

                const data = await getSystemPrompts({ baseUrl, session });
                await logout({ baseUrl, session });
                console.log("system prompts: " + JSON.stringify(data));

                // Verify system prompts are not changed
                expect(data).toBeDefined();
                expect(Array.isArray(data.systemPrompts)).toBe(true);
                expect(data.systemPrompts.length).toBe(preparedSystemPromptsData.systemPrompts.length);
            });

            it('[BCSA-2440_8] should skip unknown system prompt header', async () => {
                console.log('🚀 Trusted login API test BCSA-2440_8 is running...');

                // Test step: set invalid system prompts with unknown header
                const systemPrompts = {
                    "54": "system_prompt_54",               // text
                    "55": "system_prompt_55",               // text
                    "56": 45,                               // numeric
                    "57": "2025-10-10",                     // date
                    "58": 1234.5678                         // bigdecimal
                };

                const jsonString = JSON.stringify(systemPrompts);
                const utf8Bytes = new TextEncoder().encode(jsonString);
                const base64Encoded = btoa(String.fromCharCode(...utf8Bytes));

                const headers = {
                    'unknown-system-prompt': base64Encoded,
                    'SM_USER': mstrUser.userId,
                };

                const session = await trustedLogin({ baseUrl, headers });

                const data = await getSystemPrompts({ baseUrl, session });
                await logout({ baseUrl, session });
                console.log("system prompts: " + JSON.stringify(data));

                // Verify system prompts are returned correctly
                expect(data).toBeDefined();
                expect(Array.isArray(data.systemPrompts)).toBe(true);
                expect(data.systemPrompts.length).toBe(preparedSystemPromptsData.systemPrompts.length);
            });

            it('[BCSA-2440_9] should read persist system prompt header true', async () => {
                console.log('🚀 Trusted login API test BCSA-2440_9 is running...');

                // Test step: set valid system prompts with mstr-persist-system-prompts header true
                const systemPrompts = {
                    "54": "system_prompt_54",               // text
                    "55": "system_prompt_55",               // text
                    "56": 45,                               // numeric
                    "57": "2025-10-10",                     // date
                    "58": 1234.5678                         // bigdecimal
                };

                const jsonString = JSON.stringify(systemPrompts);
                const utf8Bytes = new TextEncoder().encode(jsonString);
                const base64Encoded = btoa(String.fromCharCode(...utf8Bytes));

                const headers = {
                    'mstr-system-prompts': base64Encoded,
                    'SM_USER': mstrUser.userId,
                    'mstr-persist-system-prompts': 'true',
                };

                const session = await trustedLogin({ baseUrl, headers });

                const data = await getSystemPrompts({ baseUrl, session });
                await logout({ baseUrl, session });
                console.log("system prompts: " + JSON.stringify(data));

                // Verify system prompts are returned correctly
                expect(data).toBeDefined();
                expect(Array.isArray(data.systemPrompts)).toBe(true);
                expect(data.systemPrompts.length).toBe(5);
            });

            it('[BCSA-2440_10] should read persist system prompt header false', async () => {
                console.log('🚀 Trusted login API test BCSA-2440_10 is running...');

                // Test step: set valid system prompts with mstr-persist-system-prompts header false
                const systemPrompts = {
                    "54": "system_prompt_54",               // text
                    "55": "system_prompt_55",               // text
                    "56": 45,                               // numeric
                    "57": "2025-10-10",                     // date
                    "58": 1234.5678                         // bigdecimal
                };

                const jsonString = JSON.stringify(systemPrompts);
                const utf8Bytes = new TextEncoder().encode(jsonString);
                const base64Encoded = btoa(String.fromCharCode(...utf8Bytes));

                const headers = {
                    'mstr-system-prompts': base64Encoded,
                    'SM_USER': mstrUser.userId,
                    'mstr-persist-system-prompts': 'false',
                };

                const session = await trustedLogin({ baseUrl, headers });

                const data = await getSystemPrompts({ baseUrl, session });
                await logout({ baseUrl, session });
                console.log("system prompts: " + JSON.stringify(data));

                // Verify old system prompts are returned correctly
                expect(data).toBeDefined();
                expect(Array.isArray(data.systemPrompts)).toBe(true);
                expect(data.systemPrompts.length).toBe(preparedSystemPromptsData.systemPrompts.length);
            });
        });
    });
});
