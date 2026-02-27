import BasePreference from './BasePreference.js';

export default class HistoryListPage extends BasePreference {
    // element locator
    getAutoAddRadioBtn() {
        return this.$$('input[name="inboxMode"]')[0];
    }

    getWorkingSetSizeInputBox() {
        return this.$('#workingSetSize');
    }

    getNewScheduledCheckbox() {
        return this.$('#inboxReuseMessage');
    }

    getScheduledRWDFormat() {
        return this.$('#scheduledRWDFormat');
    }

    getDuplicateMessageCheckbox() {
        return this.$('#newHistoryListMessageUponReprompt');
    }

    // action helper
    async setAutoAdd() {
        await this.click({ elem: this.getAutoAddRadioBtn() });
    }

    async inputWorkingSetSize(text) {
        await this.click({ elem: this.getWorkingSetSizeInputBox() });
        await this.clear({ elem: this.getWorkingSetSizeInputBox() });
        await this.getWorkingSetSizeInputBox().setValue(text);
    }

    async uncheckNewScheduled() {
        await this.uncheck(this.getNewScheduledCheckbox());
    }

    async setScheduledRWDFormat(value) {
        await this.click({ elem: this.getScheduledRWDFormat() });
        const item = await this.getScheduledRWDFormat()
            .$$('option')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes(value);
            })[0];

        await this.waitForElementVisible(item);
        await item.click();
    }

    async checkDuplicateMessage() {
        await this.check(this.getDuplicateMessageCheckbox());
    }

    // assertion helper
    async isAutoAddSelected() {
        return this.getAutoAddRadioBtn().isSelected();
    }

    async getWorkingSetSizeText() {
        return this.getWorkingSetSizeInputBox().getAttribute('value');
    }

    async isNewScheduledChecked() {
        return this.getNewScheduledCheckbox().isSelected();
    }

    async getScheduledRWDFormatText() {
        return this.getScheduledRWDFormat().$('option[selected]').getText();
    }

    async isDuplicateMessageChecked() {
        return this.getDuplicateMessageCheckbox().isSelected();
    }
}
