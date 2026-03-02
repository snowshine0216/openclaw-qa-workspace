import setWindowSize from '../../../config/setWindowSize.js';
import * as constAdmin from '../../../constants/collaborationAdmin.js';

describe('Collaboration Admin Page Test', () => {
    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1600,
        height: 1200,
    };

    let { collabAdminPage } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);
        await setWindowSize(browserWindow);
        await collabAdminPage.openCollabAdminPage();
    });

    // beforeEach(async () => {
    //     await libraryPage.switchToNewWindowWithUrl(constAdmin.collaborationAdminURL);
    // });

    // afterEach(async () => {
    //     await libraryPage.closeCurrentTab();
    //     await libraryPage.switchToTab(0);
    // });

    // [TC72080_01] set correct redis password for horizontal scaling
    it('[TC72080_01] set correct redis password for horizontal scaling', async () => {
        await collabAdminPage.changeScalingSetting('Horizontal');
        await collabAdminPage.inputSetting('Scaling Setting', 'Cluster Cache', 'redis://10.197.105.45:6379');
        await collabAdminPage.inputSetting('Scaling Setting', 'Password', 'lizhang');
        await collabAdminPage.saveSetting();
        // verify ok message
        await since('after saving collaboration setting, success msg should pop out')
            .expect(await collabAdminPage.getSuccessMsg())
            .toContain(
                'Configuration settings have been saved successfully. Please restart the Collaboration Server for changes to take effect.'
            );
        // click ok
        await collabAdminPage.clickOkButton();
        await since('after saving collaboration setting, restart alert msg should show up')
            .expect(await collabAdminPage.getAlertMsg())
            .toContain('Cluster Cache - redis://10.197.105.45:6379');
        await collabAdminPage.restartCollab();

        // refresh page
        await collabAdminPage.openCollabAdminPage();
        await collabAdminPage.sleep(1500);
        await console.log(await collabAdminPage.getState());
        await since('after restart collab, collab should be running')
            .expect(await collabAdminPage.getState())
            .toContain('Running');
        await collabAdminPage.openScalingSetting();
        await since('after restart collab, the redis settings should be kept')
            .expect(await collabAdminPage.getSettingValue('Scaling Setting', 'Cluster Cache'))
            .toContain('redis://10.197.105.45:6379');
    });

    // [TC72080_02] set none scailing
    it('[TC72080_02] set none scailing', async () => {
        await collabAdminPage.changeScalingSetting('None');
        await collabAdminPage.saveSetting();
        // verify ok message
        await since('after saving collaboration setting, success msg should pop out')
            .expect(await collabAdminPage.getSuccessMsg())
            .toContain(
                'Configuration settings have been saved successfully. Please restart the Collaboration Server for changes to take effect.'
            );
        // click ok
        await collabAdminPage.clickOkButton();
        await since('after saving collaboration setting, restart alert msg should show up')
            .expect(await collabAdminPage.getAlertMsg())
            .toContain('Scaling Type - None');
        await collabAdminPage.restartCollab();

        // refresh page
        await collabAdminPage.openCollabAdminPage();
        await collabAdminPage.sleep(1000);
        await since('after restart collab, collab should be running')
            .expect(await collabAdminPage.getState())
            .toContain('Running');
        await collabAdminPage.openScalingSetting();
        await since('after restart collab, scailing should be none')
            .expect(await collabAdminPage.getCheckedRadioSetting('Scaling Setting'))
            .toBe('None');
    });

    // test 'Enable Logging'
    it('[TC72080_03] enable/disable logging', async () => {
        // enable logging
        await collabAdminPage.changeServerSetting('Enable Logging');
        await collabAdminPage.saveSetting();
        // refresh page
        await collabAdminPage.openCollabAdminPage();
        await collabAdminPage.sleep(1000);
        await since('after enable logging, collab should be running')
            .expect(await collabAdminPage.getState())
            .toContain('Running');
        await since('after enable logging, logging should be enabled')
            .expect(await collabAdminPage.getCheckedBoxSetting('Collaboration Server Setting'))
            .toBe('Enable Logging');

        // disable logging
        await collabAdminPage.changeServerSetting('Enable Logging');
        await collabAdminPage.saveSetting();
        // refresh page
        await collabAdminPage.openCollabAdminPage();
        await collabAdminPage.sleep(1000);
        await since('after disable logging, collab should be running')
            .expect(await collabAdminPage.getState())
            .toContain('Running');
    });

    // [TC73216_01] test enable 'cors'
    it('[TC73216_01] test enable cors', async () => {
        // enable cors - Library Only
        await collabAdminPage.openAdminTitle('Collaboration Security Setting');
        await collabAdminPage.changeSecuritySetting('Library Only');
        await collabAdminPage.saveSetting();
        await collabAdminPage.sleep(1000);
        await since('after select library only, collab should be running')
            .expect(await collabAdminPage.getState())
            .toContain('Running');
        await since('after select library only, logging should be enabled')
            .expect(await collabAdminPage.getCheckedRadioSetting('Collaboration Security Setting'))
            .toBe('Library Only');

        // enable cors - Specific
        await collabAdminPage.changeSecuritySetting('Specific');
        await since('in Specific tab, the current web library link should by default be added')
            .expect(await collabAdminPage.getSettingValue('Collaboration Security Setting', 'Web URL'))
            .toBe(constAdmin.domainURL + '8080');
        await collabAdminPage.addNewURL('Collaboration Security Setting', 'Web URL', '1', 'http://d');
        await collabAdminPage.saveSetting();
        await collabAdminPage.sleep(1000);
        await since('after select Specific Onlys, collab should be running')
            .expect(await collabAdminPage.getState())
            .toContain('Running');
        await since('after select Specific Only, Specific should be checked')
            .expect(await collabAdminPage.getCheckedRadioSetting('Collaboration Security Setting'))
            .toBe('Specific');
        await since('new link should be added to Specific tab')
            .expect(await collabAdminPage.getSettingValueByIndex('Collaboration Security Setting', 'Web URL', '1'))
            .toBe('http://d');

        // enable cors - All
        await collabAdminPage.changeSecuritySetting('All');
        await collabAdminPage.saveSetting();
        await collabAdminPage.sleep(1000);
        await since('after select all, collab should be running')
            .expect(await collabAdminPage.getState())
            .toContain('Running');
        await since('after select all, all should be checked')
            .expect(await collabAdminPage.getCheckedRadioSetting('Collaboration Security Setting'))
            .toBe('All');
    });
});
