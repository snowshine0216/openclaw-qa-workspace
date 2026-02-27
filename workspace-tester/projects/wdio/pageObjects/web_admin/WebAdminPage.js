import WebBasePage from '../base/WebBasePage.js';
import { scrollIntoView } from '../../utils/scroll.js';
import {
    getMSTRWebAdminUrl,
    getTaskAdminUrl,
    getPurgeCacheUrl,
    getAdminUrlWithUser,
    getTaskAdminUrlWithUser,
    buildAdminEventUrl,
    getServerAdminUrl,
} from '../../utils/index.js';

export default class WebAdminPage extends WebBasePage {
    // Element Locator
    getAddServerForm() {
        return this.$('#ADDCONNECTSERVER');
    }
    getConnectedServerList() {
        return this.$$('#adminBean_ConnectedServersStyle tbody tr');
    }
    getUnConnectedServerList() {
        return this.$$('#adminBean_UnConnectedServersStyle tbody tr');
    }
    getConnectedServerName(rowElement) {
        return rowElement.$('.mstrAdminServerName');
    }
    getUnConnectedServerName(rowElement) {
        return rowElement.$('.mstrHighlighted');
    }
    getIserverBtn(rowElement) {
        return rowElement.$('#tbServerAdmin');
    }
    getAdminProperties() {
        return this.$('.mstrAdminProperties');
    }
    getAdminPropertyPort() {
        return this.getAdminProperties().$('#port');
    }
    getAdminPropertyPoolSize() {
        return this.getAdminProperties().$('#maxPool');
    }
    getAdminPropertyPortNumber() {
        return this.getAdminPropertyPort().getAttribute('value');
    }
    getAccessDenied() {
        return this.$('.mstrAlertTitle');
    }
    getAccessDeniedMessage() {
        return this.$('.mstrAlertMessage').getText();
    }
    getConnectedServerRow(serverName) {
        if (!serverName) {
            return this.getConnectedServerList()[0];
        }
        return this.getConnectedServerList().filter(async (row) => {
            const name = await this.getConnectedServerName(row).getText();
            return name.toUpperCase().includes(serverName.toUpperCase());
        })[0];
    }
    getUnConnectedServerRow(serverName) {
        if (!serverName) {
            return this.getUnConnectedServerList()[0];
        }
        return this.getUnConnectedServerList().filter(async (row) => {
            const name = await this.getUnConnectedServerName(row).getText();
            return name === serverName;
        })[0];
    }
    getServerProperty() {
        return this.$('.mstrPanelPortrait');
    }
    async getAdminProperty(serverName, index) {
        const item = await this.getConnectedServerRow(serverName);
        return item.$$('td')[index - 1].getText();
    }
    getAlertMessage() {
        return this.$('.mstrAlertMessage').getText();
    }
    getRenturnHome() {
        return this.$$('.mstrAdminReturnToHome .mstrLink');
    }
    getTaskAdminPage() {
        return this.$('.navbar');
    }
    getAdminNoAccessText() {
        return this.$('body').getText();
    }
    getAdminLeftMenu(menuItem) {
        return this.$('#webserver_Table')
            .$$('a')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes(menuItem);
            })[0];
    }
    getHealthBody() {
        return this.$('body');
    }
    getPurgeButton() {
        return this.$('.mstrSubmitButton');
    }
    getCacheCheckbox(value) {
        return this.$(`input[value="${value}"]`);
    }
    getPurgedCache(value) {
        const parent = this.getParent(this.getCacheCheckbox(value));
        return parent.$('.purged');
    }
    // Action Helper
    async isAccessDeniedPresent() {
        return this.getAccessDenied().isDisplayed();
    }
    async openAdminPage() {
        await browser.url(getMSTRWebAdminUrl());
        await this.waitForCurtainDisappear();
    }
    async openAdminPageWithUser(username, password) {
        await browser.url(getAdminUrlWithUser(username, password));
        await this.waitForCurtainDisappear();
    }
    async openTaskAdminPage() {
        await browser.url(getTaskAdminUrl());
        await this.waitForCurtainDisappear();
    }
    async openServerAdminPage() {
        await browser.url(getServerAdminUrl());
        await this.waitForCurtainDisappear();
    }
    async openTaskAdminPageWithUser(username, password) {
        await browser.url(getTaskAdminUrlWithUser(username, password));
        await this.waitForCurtainDisappear();
    }
    async openPurchCachePage() {
        await browser.url(getPurgeCacheUrl());
        await this.waitForCurtainDisappear();
    }
    async inputIServerName(serverName) {
        const elem = this.getAddServerForm().$('#serverName');
        await this.clear({ elem: elem });
        return elem.setValue(serverName);
    }
    async addIServer() {
        // TODO: Why below code doesn't work?
        // await this.getAddServerForm().$('input[value=Add...]').click();
        await (await this.getAddServerForm().$$('input')[1]).click();
        return this.waitForElementVisible(this.getAdminProperties(), 'Admin properties page is not displayed.');
    }
    async connectIServer() {
        await this.getAddServerForm().$('input[value=Connect]').click();
        return this.sleep(1000);
    }
    async disconnectIServer(serverName) {
        const item = await this.getConnectedServerRow(serverName);
        await this.click({ elem: item.$('input[value=Disconnect]') });
        return this.sleep(2000);
    }
    async reConnectIServer(serverName) {
        const item = await this.getUnConnectedServerRow(serverName);
        await this.click({ elem: item.$('.mstrButton') });
        return this.sleep(1000);
    }
    async modifyIServer(serverName, isIserverConnected = true) {
        let item;
        if (isIserverConnected) {
            item = await this.getConnectedServerRow(serverName);
        } else {
            item = await this.getUnConnectedServerRow(serverName);
        }
        await item.$('#tbModify').click();
        return this.waitForElementVisible(this.getAdminProperties(), 'Admin properties page is not displayed.');
    }
    async manageIServer(serverName) {
        const item = await this.getConnectedServerRow(serverName);
        await this.moveToElement(item);
        await this.click({ elem: this.getIserverBtn(item) });
        return this.sleep(5000);
    }
    async selectAutoConnect() {
        return this.getAdminProperties().$('input[value=auto]').click();
    }
    async selectManuallyConnect() {
        return this.getAdminProperties().$('input[value=manual]').click();
    }
    async clearAndInputPort(port = '0') {
        const elem = this.getAdminPropertyPort();
        await this.clear({ elem: elem });
        return elem.setValue(port);
    }
    async clearAndInputPoolSize(poolSize = '50') {
        const elem = this.getAdminPropertyPoolSize();
        await this.click({ elem: elem });
        await this.clear({ elem: elem });
        return elem.setValue(poolSize);
    }
    async connectIServerWithProperties() {
        await this.getAdminProperties().$('input[value=Connect]').click();
        return this.waitForElementVisible(this.getAddServerForm(), 'Admin properties page is not displayed.');
    }
    async saveModifyProperties() {
        await this.click({ elem: this.getAdminProperties().$('input[value=Save]') });
    }
    async cancelModifyProperties() {
        await this.getAdminProperties().$('input[value=Cancel]').click();
        return this.waitForElementVisible(this.getAddServerForm(), 'Admin properties page is not displayed.');
    }
    async deleteModifyProperties() {
        await this.click({ elem: this.getAdminProperties().$('input[value=Delete]') });
        return this.waitForElementVisible(this.getAddServerForm(), 'Admin properties page is not displayed.');
    }
    async selectLeftMenu(menuItem) {
        return this.click({ elem: this.getAdminLeftMenu(menuItem) });
    }
    getDefaultPropertiesUrl() {
        const showDefault = 'true';
        const showServerProps = 'false';
        return buildAdminEventUrl('3055', { showDefault, showServerProps });
    }
    getSeurityPageUrl() {
        return buildAdminEventUrl('3049');
    }
    async openDefaultProperties() {
        await browser.url(this.getDefaultPropertiesUrl());
        await this.waitForCurtainDisappear();
        await this.waitForWebCurtainDisappear();
    }
    async openSecurityPage() {
        await this.selectLeftMenu('Security');
    }
    async openMobileConfig() {
        await this.selectLeftMenu('Mobile Configuration');
        await this.waitForCurtainDisappear();
    }
    /**
     * Set security property
     * @param {String} text setting item
     * @param {Boolean} toCheck use this flag to indicate whether to check ot unCheck
     * 1. toCheck not assigned: we'll just click the checkbox, so the status will be reversed
     * 2. toCheck = true, fucntion will make sure the checBox status to be checked
     * 3. toCheck = false, fucntion will make sure the checBox status to be unChecked
     */
    async setSecurityProperty(text, toCheck = true) {
        const elm = this.getAdminProperties()
            .$$('.mstrAdminPropertiesValue,.mstrAdminPropertiesName:not(.mstrTitle)')
            .filter(async (item) => {
                const itemText = await item.getText();
                return itemText.includes(text);
            })[0]
            .$('input');
        const isSelected = await elm.isSelected();
        if (typeof toCheck === 'undefined' || (toCheck && !isSelected) || (!toCheck && isSelected)) {
            await scrollIntoView(elm, true);
            await this.click({ elem: elm });
        }
        await this.scrollPageToBottom();
        await this.saveModifyProperties();
    }
    async returnHomeByLink() {
        await this.click({ elem: this.getRenturnHome()[1] });
    }
    async clearIserver(serverName) {
        if (await this.isIServerConnected(serverName)) {
            await this.disconnectIServer(serverName);
        }
        if (await this.isIserverDisconnected(serverName)) {
            await this.modifyIServer(serverName, false);
            await this.deleteModifyProperties();
        }
    }
    async disconnectAllIservers() {
        const connectedIservers = await this.getConnectedServerList().map((item) =>
            item.$('.mstrAdminServerName').getText()
        );
        for (let item of connectedIservers) {
            await this.disconnectIServer(item);
        }
    }
    async purgeCache() {
        return this.click({ elem: this.getPurgeButton() });
    }

    async selectCacheByName(value) {
        await this.waitForElementVisible(this.getCacheCheckbox(value));
        const selected = await this.getCacheCheckbox(value).isSelected();
        if (!selected) {
            await this.click({ elem: this.getCacheCheckbox(value) });
        }
    }

    async openOtherConfigurationPage() {
        await this.selectLeftMenu('Other Configuration');
        await this.waitForCurtainDisappear();
    }

    // Assertion Helper
    async isIServerConnected(serverName) {
        let result = false;
        await this.getConnectedServerList().filter(async (row) => {
            const name = await this.getConnectedServerName(row).getText();
            if (name === serverName) {
                result = true;
            }
        });
        return result;
    }
    async isIserverDisconnected(serverName) {
        const Unconnected = await this.getUnConnectedServerList();
        return this.isExisted(serverName, { els: Unconnected, attribute: 'text' });
    }
    async isTaskAdminPresent() {
        return this.getTaskAdminPage().isDisplayed();
    }
    getAdministratorPageText() {
        return this.$('.mstrPathText').getText();
    }
    async healthResponse() {
        return this.getHealthBody().getText();
    }
    async isCachePurged(value) {
        return this.getPurgedCache(value).isDisplayed();
    }
}
