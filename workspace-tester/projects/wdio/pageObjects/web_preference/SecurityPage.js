import BasePreference from './BasePreference.js';

export default class SecurityPage extends BasePreference {
    // element locator

    getExportURLInputBox() {
        return this.$('.prefs-addNewURL');
    }

    getExportURLAddBtn() {
        return this.$('.mstrButton.prefs-addNewURL-btn');
    }

    getExportURLListView() {
        return this.$('.mstrListView.urlList');
    }

    getDeleteButton(parent) {
        return parent.$('.listTableView-delete');
    }

    getExportURLListHeader() {
        return this.getExportURLListView().$('.listTableView-header.urlList');
    }

    getExportURLListContainer() {
        return this.getExportURLListView().$('#urlListContainer');
    }

    getExportURLListContens() {
        return this.getExportURLListContainer().$$('.listTableView-content');
    }

    getExportURLDeleteIcon(index) {
        return this.getDeleteButton(this.getExportURLListContens()[index]);
    }

    getSpecificURLItem(url) {
        return this.getExportURLListContainer()
            .$$('.listTableView-url')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes(url);
            })[0];
    }

    getSpecificURLContent(url) {
        return this.getSpecificURLItem(url).$('..');
    }

    getSpecificURLDeleteIcon(url) {
        return this.getDeleteButton(this.getSpecificURLContent(url));
    }

    getSpecificURLEditIcon(url) {
        return this.getSpecificURLContent(url).$('.listTableView-edit');
    }

    async getExportURLMsg() {
        await this.sleep(500); // wait for validation message appear
        return this.$('#prefs-url-msg').getText();
    }

    getExportURLApplyEditIcon() {
        return this.$('.listTableView-url-apply');
    }

    getExportURLCancelEditIcon() {
        return this.$('.listTableView-url-cancel');
    }

    getExportURLEditBox() {
        return this.$('.listTableView-url-edit');
    }

    getYesRadioBtnForCancelPendingRequest() {
        return this.$$('input[name="cr"]')[0];
    }

    getYesRadioBtnForRemoveFinishedJobs() {
        return this.$$('input[name="rj"]')[0];
    }

    getReadTheOnlyMessagesRadioBtn() {
        return this.$$('input[name="rj"]')[2];
    }

    getLoginModesList() {
        return this.$('.preferenceList')
            .$$('tr')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes('Login modes:');
            })[0];
    }

    getLoginModeItem(itemName) {
        return this.getLoginModesList()
            .$$('tr')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes(itemName);
            })[0];
    }

    getLoginModeCheckBox(itemName) {
        return this.getLoginModeItem(itemName).$$('#enabledloginmode')[0];
    }

    getLoginModeRadioButton(itemName) {
        return this.getLoginModeItem(itemName).$$('#defaultloginmode')[0];
    }

    getGuestModeSection() {
        return this.getLoginModesList()
            .$$('tr')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes('Guest');
            })[0];
    }

    getGuestModeCheckbox() {
        return this.getGuestModeSection().$$('input[id="enabledloginmode"]')[0];
    }

    getLoginModeSection() {
        return this.getPreferencePanel()
            .$$('tr')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes('Login modes:');
            })[0];
    }

    getLogoutSection() {
        return this.getPreferencePanel()
            .$$('tr')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes('Logout:');
            })[0];
    }

    getShowCancelSessionCheckbox() {
        return this.getCheckboxItem('promptCancelRequests');
    }

    getShowRemoveFinishedJobsCheckbox() {
        return this.getCheckboxItem('promptRemoveRequests');
    }

    // action helper

    async addExportURL(url, action = 'addButton') {
        await this.sleep(1000); // wait for validation message to avoid error when fastly continuous add
        await this.clear({ elem: this.getExportURLInputBox() });
        await this.getExportURLInputBox().setValue(url);
        if (action === 'addButton') {
            await this.click({ elem: this.getExportURLAddBtn() });
        } else {
            await this.enter();
        }
    }

    async editExportURL(baseURL, newURL, action = 'editButton') {
        await this.waitForElementVisible(this.getSpecificURLContent(baseURL));
        await this.moveToElement(this.getSpecificURLContent(baseURL));
        if (action === 'editButton') {
            await this.click({ elem: this.getSpecificURLEditIcon(baseURL) });
        } else {
            await this.click({ elem: this.getSpecificURLContent(baseURL) });
        }
        await this.waitForElementVisible(this.getExportURLEditBox());
        // await this.getExportURLEditBox().clear(); // seems working as click instead of clear on IE
        await this.getExportURLEditBox().setValue(newURL);
    }

    async cancelExportURLEdit() {
        await this.click({ elem: this.getExportURLCancelEditIcon() });
        await this.waitForElementInvisible(this.getExportURLCancelEditIcon());
    }

    async applyExportURLEdit(action = 'confirmButton') {
        if (action === 'confirmButton') {
            await this.click({ elem: this.getExportURLApplyEditIcon() });
        } else {
            await this.enter();
        }
        await this.waitForElementInvisible(this.getExportURLEditBox());
    }

    async deleteExportURL(url) {
        await this.moveToElement(this.getSpecificURLContent(url));
        await this.click({ elem: this.getSpecificURLDeleteIcon(url) });
    }

    async deleteAllExportURLs() {
        const els = await this.getExportURLListContens();
        for (let i = 0; i < els.length; i++) {
            await this.moveToElement(this.getExportURLListContens()[0]);
            await this.click({ elem: this.getExportURLDeleteIcon(0) });
            await this.sleep(500); // wait for delete to avoid error when fastly continious delete
        }
    }

    async setYesForCancelPendingRequests() {
        return this.click({ elem: this.getYesRadioBtnForCancelPendingRequest() });
    }

    async setYesForRemoveFinishedJobs() {
        return this.click({ elem: this.getYesRadioBtnForRemoveFinishedJobs() });
    }

    async enableGuestMode() {
        return this.check(this.getGuestModeCheckbox());
    }

    async setLoginMode(loginMode, isSet) {
        if (isSet) {
            return this.check(this.getLoginModeCheckBox(loginMode));
        }
        return this.uncheck(this.getLoginModeCheckBox(loginMode));
    }

    async setDefaultLoginMode(modeName) {
        return this.check(this.getLoginModeRadioButton(modeName));
    }

    async setOnlyTheReadMessages() {
        return this.click({ elem: this.getReadTheOnlyMessagesRadioBtn() });
    }

    async uncheckShowCancelSession() {
        return this.uncheck(this.getShowCancelSessionCheckbox());
    }

    async uncheckShowRemoveFinishedJobs() {
        return this.uncheck(this.getShowRemoveFinishedJobsCheckbox());
    }

    // assertion helper

    existedInAllowedURLList(url) {
        return this.getSpecificURLItem(url).isDisplayed();
    }

    async getAllowedURLListCount() {
        const title = await this.getExportURLListHeader().getText();
        return Number(title.match(/\((.*)\)/)[1]);
    }

    async isYesRadioBtnForCancelPendingRequestSelected() {
        return this.getYesRadioBtnForCancelPendingRequest().isSelected();
    }

    async isYesRadioBtnForRemoveFinishedJobsSelected() {
        return this.getYesRadioBtnForRemoveFinishedJobs().isSelected();
    }

    async isOnlyTheReadMessagesSelected() {
        return this.getReadTheOnlyMessagesRadioBtn().isSelected();
    }
}
