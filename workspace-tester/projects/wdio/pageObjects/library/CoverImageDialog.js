import BasePage from '../base/BasePage.js';

export default class CoverImageDialog extends BasePage {
    constructor() {
        super();
    }
    // Element locator
    getDialog() {
        return this.$('.mstrd-ChangeCoverContainer-main');
    }

    getCloseButton() {
        return this.getDialog().$('.icon-pnl_close');
    }

    getImagePathInput() {
        return this.getDialog().$('.mstrd-ChangeCoverContainer-input');
    }

    getDemoImageList() {
        return this.getDialog().$$('.mstrd-ChangeCoverContainer-image-wrapper');
    }

    getDemoImageByIndex(index) {
        return this.getDemoImageList()[index];
    }

    getButtonByName(name) {
        return this.getDialog().$$('.mstrd-Button').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText.includes(name);
        })[0];
    }

    // Action helper
    async closeDialog() {
        await this.click({ elem: this.getCloseButton() });
        await this.waitForElementInvisible(this.getDialog());
    }

    async inputImagePath(path) {
        const input = this.getImagePathInput();
        await input.clearValue();
        await input.setValue(path);
        return this.sleep(500);
    }

    async selectDemoImageByIndex(index) {
        const image = this.getDemoImageByIndex(index);
        await this.click({ elem: image });
        return this.sleep(500);
    }

    async saveCoverImage() {
        const btn = this.getButtonByName('Save');
        await this.click({ elem: btn });
        await this.waitForElementInvisible(this.getDialog());
    }

    async cancelChange() {
        const btn = this.getButtonByName('Cancel');
        await this.click({ elem: btn });
        await this.waitForElementInvisible(this.getDialog());
    }

    async changeCoverImageByPath(path) {
        await this.waitForElementVisible(this.getDialog());
        await this.inputImagePath(path);
        await this.saveCoverImage();
    }

    async changeCoverImageByDemoImageIndex(index) {
        await this.selectDemoImageByIndex(index);
        await this.saveCoverImage();
    }
}
