import {
    getSession,
    createAppLevelSAMLConfig,
    getAppLevelSAMLConfig,
    updateAppLevelSAMLConfig,
    deleteAppLevelSAMLConfig,
} from '../../../../api/saml/SAMLRest.js';

describe('SAML REST API Tests', () => {
    let samlConfigId = null;

    const mstrUser = {
        username: browser.options.params.credentials.username,
        password: browser.options.params.credentials.password,
    };
    const baseUrl = browser.options.baseUrl.endsWith('/')
        ? browser.options.baseUrl.slice(0, -1)
        : browser.options.baseUrl;

    const samlConfigToSet = {
        name: 'test',
        entityId: 'test',
        baseURL: baseUrl,
        behindProxy: false,
        localLogout: true,
        keyStore: {
            signatureAlgorithm: 'SHA256WITHRSA',
            encryptAssertions: false,
        },
        userInfo: {
            displayNameAttributeName: 'DisplayName',
            emailAttributeName: 'EMail',
            dnAttributeName: 'DistinguishedName',
            groupAttributeName: 'Groups',
            groupFormat: 'Simple',
            adminGroups: 'admin',
            languageAttributeName: 'Language',
        },
        relayStateEnabled: false,
    };

    // Helper functions
    const establishSession = async () => {
        const session = await getSession(mstrUser);
        await expect(session).toBeDefined();
        await expect(session.cookie).toBeDefined();
        await expect(session.token).toBeDefined();
        return session;
    };

    const validateResponse = async (response, operation = 'Operation') => {
        await expect(response).toBeDefined();
        await expect(response.statusCode).toBeDefined();
        await expect(response.statusCode).toBeGreaterThanOrEqual(200);
        await expect(response.statusCode).toBeLessThan(300);
        console.log(`✅ ${operation} successful (status: ${response.statusCode})`);
    };

    const validateSAMLConfig = async (retrievedConfig, expectedConfig) => {
        await expect(retrievedConfig).toBeDefined();
        await expect(retrievedConfig.entityId).toBe(expectedConfig.entityId);
        await expect(retrievedConfig.baseURL).toBe(expectedConfig.baseURL);
        await expect(retrievedConfig.behindProxy).toBe(expectedConfig.behindProxy);
        await expect(retrievedConfig.localLogout).toBe(expectedConfig.localLogout);
        await expect(retrievedConfig.keyStore.signatureAlgorithm).toBe(expectedConfig.keyStore.signatureAlgorithm);
        await expect(retrievedConfig.keyStore.encryptAssertions).toBe(expectedConfig.keyStore.encryptAssertions);
        await expect(retrievedConfig.userInfo.displayNameAttributeName).toBe(
            expectedConfig.userInfo.displayNameAttributeName
        );
        await expect(retrievedConfig.userInfo.emailAttributeName).toBe(expectedConfig.userInfo.emailAttributeName);
        await expect(retrievedConfig.userInfo.dnAttributeName).toBe(expectedConfig.userInfo.dnAttributeName);
        await expect(retrievedConfig.userInfo.groupAttributeName).toBe(expectedConfig.userInfo.groupAttributeName);
        await expect(retrievedConfig.userInfo.groupFormat).toBe(expectedConfig.userInfo.groupFormat);
        await expect(retrievedConfig.userInfo.adminGroups).toBe(expectedConfig.userInfo.adminGroups);
        await expect(retrievedConfig.userInfo.languageAttributeName).toBe(
            expectedConfig.userInfo.languageAttributeName
        );
        await expect(retrievedConfig.relayStateEnabled).toBe(expectedConfig.relayStateEnabled);
    };

    it('[BCSA-3078_1] should successfully set SAML configuration', async () => {
        const session = await establishSession();

        const response = await createAppLevelSAMLConfig({ baseUrl, session, samlConfig: samlConfigToSet });
        await validateResponse(response, 'Create SAML config');

        samlConfigId = response.body;
        await expect(samlConfigId).toBeDefined();
        console.log('SAML Configuration ID:', samlConfigId);
    });

    it('[BCSA-3078_2] should successfully get SAML configuration', async () => {
        const session = await establishSession();

        const response = await getAppLevelSAMLConfig({ baseUrl, session, id: samlConfigId });
        await validateResponse(response, 'Get SAML config');

        await expect(response.body).toBeDefined();
        const retrievedConfig = JSON.parse(response.body);
        await validateSAMLConfig(retrievedConfig, samlConfigToSet);
    });

    it('[BCSA-3078_3] should successfully update SAML configuration', async () => {
        const session = await establishSession();

        const updatedSamlConfig = {
            ...samlConfigToSet,
            userInfo: {
                ...samlConfigToSet.userInfo,
                languageAttributeName: 'NewLanguageAttributeName',
            },
        };

        const updateResponse = await updateAppLevelSAMLConfig({
            baseUrl,
            session,
            id: samlConfigId,
            samlConfig: updatedSamlConfig,
        });
        await validateResponse(updateResponse, 'Update SAML config');

        const getResponse = await getAppLevelSAMLConfig({ baseUrl, session, id: samlConfigId });
        await validateResponse(getResponse, 'Get updated SAML config');

        await expect(getResponse.body).toBeDefined();
        const retrievedConfig = JSON.parse(getResponse.body);
        await validateSAMLConfig(retrievedConfig, updatedSamlConfig);
    });

    afterAll(async () => {
        const session = await establishSession();

        const response = await deleteAppLevelSAMLConfig({ baseUrl, session, id: samlConfigId });
        await validateResponse(response, 'Delete SAML config');
    });
});
