import { getSessions } from '../../../../api/getSessions.js';

describe('GET /api/sessions API Test', () => {
    const mstrUser = {
        username: browser.options.params.credentials.username,
        password: browser.options.params.credentials.password,
    };

    beforeAll(async () => {
        // No setup needed as getSessions handles authentication
    });

    describe('Basic Session Information Tests', () => {
        it('[TC99539_1] should return 200 and default session info when includeConnectionInfo is false', async () => {
            console.log('🚀 Sessions API test TC99539_1 is running...');

            const data = await getSessions(mstrUser, false);

            // Verify basic session properties are present
            await expect(data.locale).toBeDefined();
            await expect(data.displayLocale).toBeDefined();
            await expect(data.maxSearch).toBeDefined();
            await expect(data.workingSet).toBeDefined();
            await expect(data.timeout).toBeDefined();
            await expect(data.id).toBeDefined();
            await expect(data.fullName).toBeDefined();
            await expect(data.initials).toBeDefined();

            // Verify userConnections is NOT included when includeConnectionInfo is false
            await expect(data.userConnections).toBeUndefined();
        });

        it('[TC99539_2] should return 200 and session info with userConnections when includeConnectionInfo is true', async () => {
            console.log('🚀 Sessions API test TC99539_2 is running...');

            const data = await getSessions(mstrUser, true);

            // Verify basic session properties are present
            await expect(data.locale).toBeDefined();
            await expect(data.displayLocale).toBeDefined();
            await expect(data.maxSearch).toBeDefined();
            await expect(data.workingSet).toBeDefined();
            await expect(data.timeout).toBeDefined();
            await expect(data.id).toBeDefined();
            await expect(data.fullName).toBeDefined();
            await expect(data.initials).toBeDefined();

            // Verify userConnections IS included when includeConnectionInfo is true
            await expect(data.userConnections).toBeDefined();
            await expect(Array.isArray(data.userConnections)).toBe(true);
        });
    });

    describe('Data Type and Value Validation Tests', () => {
        it('[TC99539_3] should return correct data types for all session properties', async () => {
            console.log('🚀 Sessions API test TC99539_3 is running...');

            const data = await getSessions(mstrUser, false);

            // Verify data types
            await expect(typeof data.locale).toBe('number');
            await expect(typeof data.displayLocale).toBe('number');
            await expect(typeof data.maxSearch).toBe('number');
            await expect(typeof data.workingSet).toBe('number');
            await expect(typeof data.timeout).toBe('number');
            await expect(typeof data.id).toBe('string');
            await expect(typeof data.fullName).toBe('string');
            await expect(typeof data.initials).toBe('string');
        });

        it('[TC99539_4] should return valid numeric values for configuration parameters', async () => {
            console.log('🚀 Sessions API test TC99539_4 is running...');

            const data = await getSessions(mstrUser, false);

            // Verify numeric values are positive
            await expect(data.locale).toBeGreaterThan(0);
            await expect(data.displayLocale).toBeGreaterThan(0);
            await expect(data.maxSearch).toBeGreaterThan(0);
            await expect(data.workingSet).toBeGreaterThan(0);
            await expect(data.timeout).toBeGreaterThan(0);

            // Verify string values are not empty
            await expect(data.id.length).toBeGreaterThan(0);
            await expect(data.fullName.length).toBeGreaterThan(0);
            await expect(data.initials.length).toBeGreaterThan(0);
        });
    });

    describe('UserConnections Array Validation Tests', () => {
        it('[TC99539_5] should return valid userConnections structure when includeConnectionInfo is true', async () => {
            console.log('🚀 Sessions API test TC99539_5 is running...');

            const data = await getSessions(mstrUser, true);

            await expect(data.userConnections).toBeDefined();
            await expect(Array.isArray(data.userConnections)).toBe(true);

            // If connections exist, validate their structure
            if (data.userConnections.length > 0) {
                const connection = data.userConnections[0];
                await expect(connection.id).toBeDefined();
                await expect(connection.sessionId).toBeDefined();
                await expect(typeof connection.id).toBe('string');
                await expect(typeof connection.sessionId).toBe('string');
                await expect(connection.id.length).toBeGreaterThan(0);
                await expect(connection.sessionId.length).toBeGreaterThan(0);
            }
        });

        it('[TC99539_6] should validate all userConnections have required properties', async () => {
            console.log('🚀 Sessions API test TC99539_6 is running...');

            const data = await getSessions(mstrUser, true);

            await expect(data.userConnections).toBeDefined();

            // Validate each connection object
            for (const connection of data.userConnections) {
                await expect(connection.id).toBeDefined();
                await expect(connection.sessionId).toBeDefined();
                await expect(typeof connection.id).toBe('string');
                await expect(typeof connection.sessionId).toBe('string');
            }
        });
    });

    describe('Parameter Validation Tests', () => {
        it('[TC99539_7] should handle default parameter when includeConnectionInfo is not specified', async () => {
            console.log('🚀 Sessions API test TC99539_7 is running...');

            // Test default behavior (should default to false)
            const data = await getSessions(mstrUser);

            await expect(data.locale).toBeDefined();
            await expect(data.userConnections).toBeUndefined();
        });

        it('[TC99539_8] should throw error for invalid credentials', async () => {
            console.log('🚀 Sessions API test TC99539_8 is running...');

            const invalidUser = {
                username: null,
                password: 'test',
            };

            try {
                await getSessions(invalidUser, false);
                // If we reach here, the test should fail
                await expect(true).toBe(false);
            } catch (error) {
                await expect(error.message).toContain('Valid user credentials are required');
            }
        });

        it('[TC99539_9] should treat falsy non-boolean includeConnectionInfo as false', async () => {
            console.log('🚀 Sessions API test TC99539_9 is running...');

            // Test with empty string value - should be treated as false
            const dataWithEmptyString = await getSessions(mstrUser, '');
            await expect(dataWithEmptyString.userConnections).toBeUndefined();

            // Test with number 0 - should be treated as false
            const dataWithZero = await getSessions(mstrUser, 0);
            await expect(dataWithZero.userConnections).toBeUndefined();

            // Test with null - should be treated as false
            const dataWithNull = await getSessions(mstrUser, null);
            await expect(dataWithNull.userConnections).toBeUndefined();

            // Test with undefined - should be treated as false
            const dataWithUndefined = await getSessions(mstrUser, undefined);
            await expect(dataWithUndefined.userConnections).toBeUndefined();
        });

        it('[TC99539_10] should treat truthy non-boolean values as true', async () => {
            console.log('🚀 Sessions API test TC99539_10 is running...');

            // Test with non-empty string - should be treated as true
            const dataWithString = await getSessions(mstrUser, 'yes');
            await expect(dataWithString.userConnections).toBeDefined();

            // Test with positive number - should be treated as true
            const dataWithNumber = await getSessions(mstrUser, 1);
            await expect(dataWithNumber.userConnections).toBeDefined();

            // Test with object - should be treated as true
            const dataWithObject = await getSessions(mstrUser, {});
            await expect(dataWithObject.userConnections).toBeDefined();

            // Test with array - should be treated as true
            const dataWithArray = await getSessions(mstrUser, []);
            await expect(dataWithArray.userConnections).toBeDefined();
        });
    });

    describe('Boolean Logic Tests', () => {
        it('[TC99539_11] should demonstrate boolean parameter behavior differences', async () => {
            console.log('🚀 Sessions API test TC99539_11 is running...');

            // Test with false
            const dataWithoutConnections = await getSessions(mstrUser, false);
            await expect(dataWithoutConnections.userConnections).toBeUndefined();

            // Test with true
            const dataWithConnections = await getSessions(mstrUser, true);
            await expect(dataWithConnections.userConnections).toBeDefined();

            // Both should have the same basic properties
            await expect(dataWithoutConnections.id).toBe(dataWithConnections.id);
            await expect(dataWithoutConnections.fullName).toBe(dataWithConnections.fullName);
        });

        it('[TC99539_12] should handle explicit boolean false value', async () => {
            console.log('🚀 Sessions API test TC99539_12 is running...');

            const data = await getSessions(mstrUser, false);

            await expect(data.userConnections).toBeUndefined();
        });
    });
});
