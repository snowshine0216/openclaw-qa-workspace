import AdminPage from '../admin/AdminPage.js';
import * as adminSettings from '../../constants/collaborationAdmin.js';
import { CollabService } from '../../api/collab/collabService.js';

/** Class representing comment panel **/
export default class CollabAdminPage extends AdminPage {
    constructor() {
        super();
    }
    // Element locator
    getAdminTitle(title) {
        // return this.getContentContainer()
        //     .$$('.mstr-Admin-Section')
        //     .all(by.cssContainingText('.mstr-Admin-ss-title', title))
        //     .first();
        return this.getContentContainer().$(`//div[text()='${title}' and contains(@class, 'mstr-Admin-ss-title')]`);
    }

    getPanelFeatureSetting(mode) {
        // return this.getAdminSection('Collaboration Panel Features').element(
        //     by.cssContainingText('.ant-checkbox-wrapper', mode)
        // );
        return this.$(`//span[text()='${mode}']//ancestor::label//span[contains(@class,'ant-checkbox')]`);
    }

    getServerSetting(mode) {
        // return this.getAdminSection('Collaboration Server Setting').element(
        //     by.cssContainingText('.ant-checkbox-wrapper', mode)
        // );
        return this.getAdminSection('Collaboration Server Setting').$(
            `//span[text()='${mode}']//ancestor::label//span[contains(@class,'ant-checkbox')]`
        );
    }

    getSecuritySetting(mode) {
        // return this.getAdminSection('Collaboration Security Setting').element(
        //     by.cssContainingText('.ant-radio-wrapper', mode)
        // );
        return this.getAdminSection('Collaboration Security Setting').$(`.ant-radio-wrapper*=${mode}`);
    }

    getScallingSetting(mode) {
        // return this.getAdminSection('Scaling Setting').element(by.cssContainingText('.ant-radio-wrapper', mode));
        return this.$(`//span[text()='${mode}']//ancestor::label//span[contains(@class,'ant-radio')]`);
    }

    getSettingRow(mode, row) {
        // return this.getAdminSection(mode).element(by.cssContainingText('.ant-row.mstr-Admin-Row', row));
        return this.$(`//*[text()='${row}']//ancestor::div[contains(@class,'mstr-Admin-Row')]`);
    }

    getSettingInputBox(mode, row) {
        return this.getSettingRow(mode, row).$('.ant-input');
    }

    getSettingInputBoxByIndex(mode, row, index) {
        return this.getSettingRow(mode, row).$$('.ant-input')[index];
    }

    getAddNewURLButton() {
        return this.getAdminSection('Collaboration Security Setting').$('.mstr-Admin-CollabSecurity-button');
    }

    getMsgContent() {
        return this.$('.mstr-Admin-Modal-message');
    }

    async getState() {
        return this.getSettingRow('Collaboration Server Machine Information', 'State').getText();
    }

    async getSuccessMsg() {
        return this.getMsgContent().$('.mstr-Admin-Modal-message-content').getText();
    }

    async getAlertMsg() {
        return this.$('.ant-alert-message').getText();
    }

    getSuccessButton() {
        return this.getMsgContent().$('.mstr-Admin-Button');
    }

    getSavingIcon() {
        return this.$('.ant-spin-dot');
    }

    async getCheckedRadioSetting(mode) {
        return this.getAdminSection(mode).$('.ant-radio-wrapper-checked').getText();
    }

    async getCheckedBoxSetting(mode) {
        return this.getAdminSection(mode).$('.ant-checkbox-wrapper-checked').getText();
    }

    getPanelFeaturesSwitcher() {
        return this.$('.mstr-Admin-Switch');
    }

    async getPanelFeaturesSwitcherStatus() {
        return this.getPanelFeaturesSwitcher().getAttribute('aria-checked');
    }

    async getPanelFeaturesCheckBoxStatus(mode) {
        const checkStatus = await this.getPanelFeatureSetting(mode).getAttribute('class');
        return checkStatus.includes('checked');
    }

    // Action helper
    async restartCollab() {
        await CollabService.exec('net stop MSTR_collaboration', adminSettings.collaborationDevURL);
        await this.sleep(10000);
        await CollabService.exec('net start MSTR_collaboration', adminSettings.collaborationDevURL);
        return this.sleep(10000);
    }

    async openCollabAdminPage() {
        await this.openAdminPage();
        const url = new URL('admin/collabserver', browser.options.baseUrl);
        await browser.url(url.toString(), this.DEFAULT_LOADING_TIMEOUT);
        // await this.sleep(2000);
        return this.waitForElementInvisible(this.getLoadingIcon());
    }

    async openAdminTitle(title) {
        return this.click({ elem: this.getAdminTitle(title) });
    }

    async openScalingSetting() {
        return this.openAdminTitle('Scaling Setting');
    }

    async changePanelFeatureSetting(mode) {
        return this.click({ elem: this.getPanelFeatureSetting(mode) });
    }
    async changeServerSetting(mode) {
        return this.click({ elem: this.getServerSetting(mode) });
    }

    async changeSecuritySetting(mode) {
        return this.click({ elem: this.getSecuritySetting(mode) });
    }

    async changeScalingSetting(mode) {
        await this.openScalingSetting();
        return this.click({ elem: this.getScallingSetting(mode) });
    }

    async inputSetting(mode, row, text) {
        await this.waitForElementClickable(this.getSettingInputBox(mode, row));
        await this.click({ elem: this.getSettingInputBox(mode, row) });
        await this.getSettingInputBox(mode, row).setValue(text);
    }

    async clickOkButton() {
        return this.click({ elem: this.getSuccessButton() });
    }

    async saveSetting() {
        await this.click({ elem: this.getSaveButton() });
        return this.waitForElementInvisible(this.getSavingIcon());
    }

    async getSettingValue(mode, row) {
        await this.waitForElementVisible(this.getSettingInputBox(mode, row));
        return this.getSettingInputBox(mode, row).getAttribute('value');
    }

    async getSettingValueByIndex(mode, row, index) {
        await this.waitForElementVisible(this.getSettingInputBoxByIndex(mode, row, index));
        return this.getSettingInputBoxByIndex(mode, row, index).getAttribute('value');
    }

    async addNewURL(mode, row, index, url) {
        await this.click({ elem: this.getAddNewURLButton() });
        await this.click({ elem: this.getSettingInputBoxByIndex(mode, row, index) });
        await this.getSettingInputBoxByIndex(mode, row, index).setValue(url);
    }

    async changePanelFeatureSwitcher() {
        return this.click({ elem: this.getPanelFeaturesSwitcher() });
    }

    async turnOnDiscussionComment() {
        if ((await this.getPanelFeaturesSwitcherStatus('Enable Discussions')) == false) {
            await this.changePanelFeatureSwitcher('Enable Discussions');
        }
        await this.waitForItemLoading();
    }

    async turnOffDiscussionComment() {
        if (await this.getPanelFeaturesSwitcherStatus('Enable Discussions')) {
            await this.changePanelFeatureSwitcher('Enable Discussions');
        }
        await this.waitForItemLoading();
    }

    async turnOnDiscussion() {
        const flag = await this.getPanelFeaturesCheckBoxStatus('Enable Discussions');
        console.log(flag);
        if ((await this.getPanelFeaturesCheckBoxStatus('Enable Discussions')) == false) {
            await this.changePanelFeatureSetting('Enable Discussions');
        }
        await this.waitForItemLoading();
    }

    async turnOffDiscussion() {
        if (await this.getPanelFeaturesCheckBoxStatus('Enable Discussions')) {
            await this.changePanelFeatureSetting('Enable Discussions');
        }
        await this.waitForItemLoading();
    }

    async turnOnComment() {
        if ((await this.getPanelFeaturesCheckBoxStatus('Enable Comments')) == false) {
            await this.changePanelFeatureSetting('Enable Comments');
        }
        await this.waitForItemLoading();
    }

    async turnOffComment() {
        console.log(await this.getPanelFeaturesCheckBoxStatus('Enable Comments'));
        if (await this.getPanelFeaturesCheckBoxStatus('Enable Comments')) {
            await this.changePanelFeatureSetting('Enable Comments');
        }
        await this.waitForItemLoading();
    }

    // Assertion helper
}
