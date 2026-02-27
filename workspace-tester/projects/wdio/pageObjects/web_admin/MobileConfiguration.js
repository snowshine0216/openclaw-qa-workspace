import WebBasePage from './../base/WebBasePage.js';
import { scrollElementToBottom, scrollElementToTop } from '../../utils/scroll.js';
import { request } from 'urllib';

export default class MobileConfiguration extends WebBasePage {
    getDefineNewConfiguration() {
        return $(`div[aria-label='Define New Configuration']`);
    }

    getDeleteProject() {
        return this.$('.mstrmojo-Panel-del[value="Delete project"]');
    }

    getDeleteOKButton() {
        return $(`.mstrmojo-text.mstrmojo-HTMLButton.mstrButton.mobileconfig-Button[value='OK']`);
    }

    getConfigNameInput() {
        return $(
            '//div[text()="Configuration name:"]/parent::td/following-sibling::td//input[contains(@class, "mobileconfig-TextBox")]'
        );
    }

    getSelectboxItem(itemName) {
        return $(`.mstrmojo-selectbox-item[title='${itemName}']`);
    }

    getMobileServerName() {
        return $('.mstrmojo-TextBox.mobileconfig-TextBox.mstrmojo-empty.mstrmojo-TextBox-ErrValidation');
    }

    getMobileServerPort() {
        return $(
            '//div[text()="Mobile Server path:"]/parent::td/following-sibling::td//input[contains(@class, "mobileconfig-TextBox")]'
        );
    }

    getMobileServerTypeSelectBox() {
        return $(
            '//div[text()="Mobile Server type:"]/parent::td/following-sibling::td//select[contains(@class, "mobileconfig-SelectBox")]'
        );
    }

    getRequestTypeSelectBox() {
        return $(
            '//div[text()="Request type:"]/parent::td/following-sibling::td//select[contains(@class, "mobileconfig-SelectBox")]'
        );
    }

    getAuthModeSelectBox() {
        return $$(
            '//div[text()="Authentication mode:"]/parent::td/following-sibling::td//select[contains(@class, "mobileconfig-SelectBox")]'
        )[2];
    }

    getProject() {
        return $('.mstrmojo-Label[aria-label="Project Name"]');
    }

    getConfigURLContainer() {
        return $('.mstrmojo-Panel-container');
    }

    getDisplayContentsFoldeRadio() {
        return this.$(
            `//label[normalize-space(text())="Display the contents of a folder"]/preceding-sibling::input[@type="radio"]`
        );
    }

    getDropDownButton(device) {
        if (device.includes('iPhone') || device.includes('Android Phone')) {
            return $('#mstr848');
        } else {
            return $('#mstr486');
        }
    }

    getUserInput() {
        return $('#mstr44');
    }

    getPasswordInput() {
        return $('#mstr46');
    }

    getLoginButton() {
        return $('#mstr51');
    }

    getCurrentFolderButton() {
        return $('#mstr25');
    }

    getLoaderIcon() {
        return $('#mstr22_ldr');
    }

    getDeleteMobileServer() {
        return $('.mstrmojo-Panel-del');
    }

    getProjectAuth() {
        return $(`legend=mstrmojo-FieldSet-noborder-legend*="Default Project Authentication:"`);
    }

    getProjectContainer() {
        return $$('div.mstrmojo-ListBase2-itemsContainer')[1];
    }

    async getMojoButton(buttonName) {
        const buttons = await $$('.mstrmojo-Button-text');
        for (const button of buttons) {
            const text = await button.getText();
            if (text.trim() === buttonName) {
                return button;
            }
        }
        throw new Error(`Button with text "${buttonName}" not found`);
    }

    async getConfigTab(tabName) {
        const tabs = await $$('.mstrmojo-TabButton');
        return tabs.find(async (element) => {
            return (await element.getText()) === tabName;
        });
    }

    async getConfig(name) {
        const elements = await $$('div.mstrmojo-MultiColumnListBox-iconText span[edt="1"]');
        return elements.find(async (element) => {
            return (await element.getText()) === name;
        });
    }

    async getFolder(name) {
        const elements = await $$('.mstrmojo-OBListItemText');
        return elements.find(async (element) => {
            return (await element.getText()) === name;
        });
    }

    async scrollWindowToBottom() {
        await this.sleep(1000);
        await scrollElementToBottom(this.getDefineNewConfiguration());
    }

    async scrollDown() {
        await this.sleep(1000);
        await scrollElementToBottom(this.getMojoButton('Save'));
    }

    async clickDeleteMobileServer() {
        const deleteMobile = await this.getDeleteMobileServer();
        await deleteMobile.waitForDisplayed({ timeout: 5000 });
        await deleteMobile.click();
    }

    async findRowByConfigName(configName) {
        const configRows = await $$('.mstrmojo-MultiColumnListBox-table tbody tr');
        const regex = new RegExp(configName, 'i');
        const configRowsArray = Array.from(configRows);
        const filteredRows = await Promise.all(
            configRowsArray.map(async (row) => {
                const nameElement = await row.$('.mstrmojo-MultiColumnListBox-iconText span[edt="1"]');
                const name = await nameElement.getText();
                return regex.test(name) ? row : null;
            })
        );
        return filteredRows.find((row) => row !== null) || null;
    }

    async performActionByConfigName(configName, action) {
        const row = await this.findRowByConfigName(configName);
        if (row) {
            const actionElement = row.$(`.mstrmojo-MultiColumnListBox-text a span[title="${action}"]`);
            await actionElement.click();
        } else {
            console.error(`Row with config name "${configName}" not found.`);
        }
        if (action === 'Delete') {
            const getDeleteOK = await this.getDeleteOKButton();
            await getDeleteOK.waitForDisplayed({ timeout: 5000 });
            await getDeleteOK.click();
            await this.scrollWindowToBottom();
        } else if (action === 'Generate URL') {
            const getGenerateURL = await this.getMojoButton('Generate URL');
            await getGenerateURL.waitForDisplayed({ timeout: 5000 });
            await getGenerateURL.click();
        } else if (action === 'Duplicate') {
            await this.scrollWindowToBottom();
        }
        await this.sleep(2000);
    }

    async isConfigPresent(name) {
        const row = await this.findRowByConfigName(name);
        return row ? await row.isDisplayed() : false;
    }

    // async isConfigPresent(name) {
    //     const configs = await this.getConfig(name);
    //     const configList = Array.isArray(configs) ? configs : [configs];
    //     const matchingConfig = configList.find((config) => config && config.name.includes(name));
    //     return matchingConfig ? await matchingConfig.isDisplayed() : false;
    // }

    async deleteCopyConfig() {
        await this.performActionByConfigName('Copy&nbsp;of&nbsp;iPhoneConfig', 'Delete');
    }

    async isNewConfigurationButtonPresent() {
        await this.scrollWindowToBottom();
        const newConfig = await this.getDefineNewConfiguration();
        return newConfig ? await newConfig.isDisplayed() : false;
    }

    async clickMojoButton(buttonName) {
        const button = await this.getMojoButton(buttonName);
        await button.waitForDisplayed({ timeout: 5000 });
        await button.click();
    }

    async selectDeviceType(deviceType) {
        if (deviceType !== 'iPhone') {
            const selectbox = await this.getSelectboxItem(deviceType);
            await selectbox.waitForDisplayed({ timeout: 5000 });
            await selectbox.click();
        }
        await this.clickMojoButton('OK');
    }

    async inputConfigName(name) {
        await this.waitForElementVisible(await this.getConfigNameInput());
        await (await this.getConfigNameInput()).setValue(name);
    }

    async switchTab(tabName) {
        const tab = await this.getConfigTab(tabName);
        await tab.waitForDisplayed({ timeout: 5000 });
        await tab.click();
    }

    async inputMobileServerName(name) {
        const serverName = await this.getMobileServerName();
        await serverName.waitForDisplayed({ timeout: 5000 });
        await serverName.setValue(name);
        await this.sleep(1000);
    }

    async inputMobileServerPort(port) {
        await this.waitForElementVisible(await this.getMobileServerPort());
        await (await this.getMobileServerPort()).setValue(port);
    }

    async selectMobileServerType(type) {
        const mobileServerType = await this.getMobileServerTypeSelectBox();
        await mobileServerType.waitForDisplayed({ timeout: 5000 });
        await mobileServerType.click();
        const selectboxItem = await this.getSelectboxItem(type);
        await selectboxItem.waitForDisplayed({ timeout: 5000 });
        await selectboxItem.click();
    }

    async selectRequestType(type) {
        const requestType = await this.getRequestTypeSelectBox();
        await requestType.waitForDisplayed({ timeout: 5000 });
        await requestType.click();
        const selectboxItem = await this.getSelectboxItem(type);
        await selectboxItem.waitForDisplayed({ timeout: 5000 });
        await selectboxItem.click();
    }

    async selectAuthenticationMode(type) {
        const authMode = await this.getAuthModeSelectBox();
        await authMode.waitForDisplayed({ timeout: 5000 });
        await authMode.click();
        const selectboxItem = await this.getSelectboxItem(type);
        await selectboxItem.waitForDisplayed({ timeout: 5000 });
        await selectboxItem.click();
    }

    async waitForProjectListPresent() {
        await this.waitForElementVisible(await this.getProject());
    }

    async isConfigURLContainerPresent() {
        const configURLContainer = await this.getConfigURLContainer();
        return configURLContainer ? await configURLContainer.isDisplayed() : false;
    }

    async scrollMobileConfigToBottom() {
        await this.sleep(1000);
        await scrollElementToBottom(this.getProjectAuth());
    }

    async createMobileConfiguration(
        device,
        configName,
        mobileServerName,
        mobileServerPort,
        mobileServerType,
        requestType,
        authMode
    ) {
        await this.scrollWindowToBottom();
        await this.isNewConfigurationButtonPresent();
        await this.clickMojoButton('Define New Configuration');
        await this.selectDeviceType(device);
        await this.waitForElementVisible(await this.getConfigNameInput());
        await this.inputConfigName(configName);
        await this.switchTab('Connectivity Settings');
        await this.clickMojoButton('Configure New Mobile Server');
        await this.inputMobileServerName(mobileServerName);
        await this.inputMobileServerPort(mobileServerPort);
        await this.selectMobileServerType(mobileServerType);
        await this.selectRequestType(requestType);
        await this.selectAuthenticationMode(authMode);
        await this.selectAuthenticationMode(authMode);
        await this.scrollDown();
        await this.clickMojoButton('Save');
        await this.sleep(1000);
        await this.waitForWebCurtainDisappear();
    }

    async clickDisplayContent() {
        await this.waitForElementVisible(this.getDisplayContentsFoldeRadio());
        await this.click(this.getDisplayContentsFoldeRadio());
    }

    async clickDropDownList(device) {
        await this.waitForElementVisible(this.getDropDownButton(device));
        await this.click(this.getDropDownButton(device));
    }

    async loginInHomeScreen(username, password) {
        await this.waitForElementVisible(this.getUserInput());
        await (await this.getUserInput()).setValue(username);
        await this.waitForElementVisible(this.getPasswordInput());
        await (await this.getPasswordInput()).setValue(password);
        await this.click(this.getLoginButton());
    }

    async chooseFolder(folderName) {
        await this.waitForElementVisible(this.getFolder(folderName));
        await this.click(this.getFolder(folderName));
    }

    async clickCurrentFolderButton() {
        await this.waitForElementVisible(this.getCurrentFolderButton());
        await this.click(this.getCurrentFolderButton());
    }

    async waitForIServerLoginLoading() {
        await this.waitForElementVisible(this.getCurrentFolderButton());
        await this.waitForElementVisible(this.$$('.mstrmojo-ListIcon  t8').first());
    }

    async setHomePath(device, username, password) {
        await this.clickDisplayContent(device);
        await this.clickDropDownList(device);
        await this.loginInHomeScreen(username, password);
        await this.waitForIServerLoginLoading();
        await this.clickCurrentFolderButton();
        await this.clickMojoButton('Save');
        await this.waitForElementVisible(this.getMojoButton('Define New Configuration'));
    }
}
