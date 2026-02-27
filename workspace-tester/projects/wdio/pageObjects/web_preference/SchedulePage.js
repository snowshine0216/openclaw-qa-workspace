import BasePreference from './BasePreference.js';

export default class SchedulePage extends BasePreference {
    // element locator
    getAllowAllRadioBtn() {
        return this.$$('input[name="allowAll"]')[0];
    }

    getOnlyAllowRadioBtn() {
        return this.$$('input[name="allowAll"]')[1];
    }

    getAvailableSchedulesList() {
        return this.$('#availableSchedulesList');
    }

    getAvailableSchedulesItem() {
        return this.getAvailableSchedulesList().$$('option');
    }

    getSpecifiedAvailableSchedulesItem(item) {
        return this.getAvailableSchedulesList()
            .$$('option')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes(item);
            })[0];
    }

    getNoneItem() {
        return this.getAvailableSchedulesList().$('option[value="-none-"]');
    }

    getSelectedSchedulesList() {
        return this.$('#selectedSchedulesList');
    }

    getSelectedSchedulesItem() {
        return this.getSelectedSchedulesList().$$('option');
    }

    getSpecifiedSelectedSchedulesItem(item) {
        return this.getSelectedSchedulesList()
            .$$('option')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes(item);
            })[0];
    }

    getAddBtn() {
        return this.$('.mstrIcon-btn.mstrIcon-btnArrowRight');
    }

    getAddAllBtn() {
        return this.$('.mstrIcon-btn.mstrIcon-btnAddAll');
    }

    getRemoveBtn() {
        return this.$('.mstrIcon-btn.mstrIcon-btnArrowLeft');
    }

    getSaveBtn() {
        return this.$('input[value="Save"]');
    }

    // action helper
    async setAllowAll() {
        const select = await this.getOnlyAllowRadioBtn().isSelected();
        if (select === true) {
            await this.click({ elem: this.getAllowAllRadioBtn() });
        }
        await this.save();
    }

    async setOnlyAllow() {
        const select = await this.getAllowAllRadioBtn().isSelected();
        if (select === true) {
            await this.click({ elem: this.getOnlyAllowRadioBtn() });
        }
        await this.waitForElementClickable(this.getAddAllBtn());
    }

    async addItemsToSelections(items) {
        for (const item of items) {
            await this.click({ elem: this.getSpecifiedAvailableSchedulesItem(item) });
            await this.click({ elem: this.getAddBtn() });
        }
    }

    async addAllElementsToSelections() {
        await this.click({ elem: this.getAddAllBtn() });
        await this.waitForElementVisible(this.getNoneItem());
    }

    async removeFromSelections(item) {
        await this.click({ elem: this.getSpecifiedSelectedSchedulesItem(item) });
        await this.click({ elem: this.getRemoveBtn() });
    }

    async save() {
        await this.click({ elem: this.getSaveBtn() });
        await this.waitForElementVisible(this.getUpdateConfirmation());
    }

    async selectSchedules(item) {
        await this.setOnlyAllow();
        await this.addItemsToSelections([item]);
        await this.waitForElementVisible(this.getSpecifiedSelectedSchedulesItem(item));
        await this.save();
    }

    // assertion helper
    async getSelectedScheduleItemsText() {
        return this.getSelectedSchedulesList().getText();
    }
}
