import { takeScreenshot } from '../../../../utils/TakeScreenshot.js';
/**
 * one case: npm run regression -- --baseUrl=https://emm1.labs.microstrategy.com:8099/MicroStrategyLibrary/ --xml=specs/regression/config/SAMLConfig.config.xml --params.credentials.webServerUsername=admin --params.credentials.webServerPassword="" --params.loginType=Custom
 */
describe('[TC76948] Verify Library Web SAML configuration page', () => {
    let { samlConfigPage } = browsers.pageObj1;

    beforeEach(async () => {
        await samlConfigPage.openSAMLConfigWeb();
    });

    it('[TC76948_01] test valid SAML config with all fields edited', async () => {
        await samlConfigPage.fillForm({
            entityId: 'TC76948_01',
            baseUrl: 'http://TC76948_01/MicroStrategy',
            behindProxy: 'true',
            logoutMode: 'false',
            signatureAlgorithm: 'SHA256WITHRSA',
            encryptAssertions: 'true',
            displayNameAttributeName: 'my name',
            emailAttributeName: 'my mail',
            dnAttributeName: 'my display name',
            groupAttributeName: 'my group',
            groupFormat: 'DistinguishedName',
            adminGroups: 'Everyone',
        });
        await samlConfigPage.submitForm();
        await samlConfigPage.confirmConfigSucceed();
    });

    it('[TC76948_02] test valid SAML config with some fields edited', async () => {
        // check previous value is not loaded
        await samlConfigPage.checkForm({});
        await takeScreenshot('TC76948', 'SAML config without previous value', { tolerance: 2.6 });
        await samlConfigPage.fillForm({
            entityId: 'TC76948_02',
            baseUrl: 'new base url',
        });
        await samlConfigPage.submitForm();
        await samlConfigPage.confirmConfigSucceed();
    });

    it('[TC76948_03] test valid SAML config with valid empty fields edited', async () => {
        await samlConfigPage.fillForm({
            entityId: 'TC76948_03',
            baseUrl: 'http://TC76948_03/MicroStrategy',
            behindProxy: 'true',
            logoutMode: 'false',
            signatureAlgorithm: 'SHA256WITHRSA',
            encryptAssertions: 'true',
            groupFormat: 'DistinguishedName',
        });
        await samlConfigPage.submitForm();
        await samlConfigPage.confirmConfigSucceed();
    });

    it('[TC76948_04] invalid test SAML config with empty entity ID and/or base URL', async () => {
        await samlConfigPage.clear({ elem: samlConfigPage.getEntityIdInput() });
        await samlConfigPage.getEntityIdInput().setValue('');
        await samlConfigPage.submitForm();
        await samlConfigPage.confirmEntityIdError();
        await samlConfigPage.clear({ elem: samlConfigPage.getBaseURLInput() });
        await samlConfigPage.getBaseURLInput().setValue('');
        await samlConfigPage.submitForm();
        await samlConfigPage.confirmEntityIdError();
        await samlConfigPage.confirmBaseURLError();
        await samlConfigPage.clear({ elem: samlConfigPage.getEntityIdInput() });
        await samlConfigPage.getEntityIdInput().setValue('TC76948_04');
        await samlConfigPage.submitForm();
        await samlConfigPage.confirmBaseURLError();
        await samlConfigPage.clear({ elem: samlConfigPage.getBaseURLInput() });
        await samlConfigPage.getBaseURLInput().setValue('http://fake_url');
        await samlConfigPage.submitForm();
        await samlConfigPage.confirmConfigSucceed();
    });

    it('[TC76948_05] test valid SAML config with javascript alerts as values', async () => {
        const alertString = '<script>alert(document.cookie);</script>';
        await samlConfigPage.fillForm({
            entityId: alertString,
            baseUrl: alertString,
            behindProxy: 'true',
            logoutMode: 'false',
            signatureAlgorithm: 'SHA256WITHRSA',
            encryptAssertions: 'true',
            displayNameAttributeName: alertString,
            emailAttributeName: alertString,
            dnAttributeName: alertString,
            groupAttributeName: alertString,
            groupFormat: 'DistinguishedName',
            adminGroups: alertString,
        });
        await samlConfigPage.submitForm();
        await samlConfigPage.confirmConfigSucceed();
    });

    it('[TC76948_06] test valid SAML config with special characters as values', async () => {
        const specialString =
            '`1234567890-=~!@#$%^&*()_+qwertyuiop[]\\QWERTYUIOP{}|asdfghjkl;\'ASDFGHJKL:"zxcvbnm,./ZXCVBNM<> ?';
        await samlConfigPage.fillForm({
            entityId: specialString,
            baseUrl: specialString,
            behindProxy: 'true',
            logoutMode: 'true',
            signatureAlgorithm: 'SHA256WITHRSA',
            encryptAssertions: 'true',
            displayNameAttributeName: specialString,
            emailAttributeName: specialString,
            dnAttributeName: specialString,
            groupAttributeName: specialString,
            groupFormat: 'DistinguishedName',
            adminGroups: specialString,
        });
        await samlConfigPage.submitForm();
        await samlConfigPage.confirmConfigSucceed();
    });
});
