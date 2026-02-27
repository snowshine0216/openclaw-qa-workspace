import DossierPage from '../dossier/DossierPage.js';
import BaseVisualization from '../base/BaseVisualization.js';
export default class Threshold extends BaseVisualization {
    constructor() {
        super();
        this.dossierPage = new DossierPage();
    }

    // Element locator
    getSimpleThresholdEditor() {
        return this.$('.mstrmojo-Editor.mstrmojo-SimpleThresholdEditor.modal');
    }

    getAdvThresholdEditor() {
        return this.$('.mstrmojo-Editor.adv-threshold.modal');
    }

    getAdvThresholdDetail() {
        return this.getAdvThresholdEditor().$('.mstrmojo-threshold-PropertyPanel');
    }

    getConfirmButtonInAdvThresholdDetail() {
        return this.getAdvThresholdDetail().$('.mstrmojo-Button.okBtn')
    }

    getImageBasedIcon() {
        return this.$('.item.image');
    }

    getSaveThresholdWarning() {
        return this.$('.mstrmojo-Editor.save-threshold-warning.mstrmojo-warning.mstrmojo-alert.modal');
    }

    getButtonInThresholdEditor(button) {
        return this.$$(`div[aria-label='${button}']`).filter((item) => item.isDisplayed())[0];
    }

    getButtonInSaveThresholdWarning(button) {
        return this.getSaveThresholdWarning().$(`div[aria-label='${button}']`);
    }

    // getThresholdImageInSimpleThresholdEditor(index) {
    //     return this.getSimpleThresholdEditor().$$('.mstrmojo-Image.color-band')[index];
    // }

    getThresholdImageInSimpleThresholdEditor(index) {
        return this.getSimpleThresholdEditor().$$('.mstrmojo-Image.color-band')[index].$('img');
    }

    getPreviewImageInAdvThresholdEditor(index) {
        return this.getAdvThresholdEditor().$$('.preview.hasImage')[index].$('img');
    }

    getThresholdImageAltInputArea() {
        return this.getAdvThresholdEditor().$('.mstrmojo-TextBox.alt-input');
    }

    getThresholdImageURLInputArea() {
        return this.getAdvThresholdEditor().$('input[placeholder="Image URL"]');
    }

    // Action helper
    async chooseImageBased() {
        return this.getImageBasedIcon().click();
    }

    async switchAdvThreshold() {
        return this.getButtonInThresholdEditor('Advanced Thresholds Editor...').click();
    }

    async confirmThreshold() {
        return this.getButtonInThresholdEditor('OK').click();
    }

    async confirmSwitchToAdvThreshold() {
        await this.getButtonInSaveThresholdWarning('Apply').click();
        return this.waitForElementVisible(this.getAdvThresholdEditor());
    }

    async openAdvThresholdDetail(index) {
        return this.getPreviewImageInAdvThresholdEditor(index).click();
    }

    async changeAltText(Text) {
        await this.getThresholdImageAltInputArea().click();
        await this.clear({ elem: this.getThresholdImageAltInputArea() }, false);
        await this.getThresholdImageAltInputArea().setValue(Text);
        return this.sleep(1000);
    }

    async changeImageURL(Text) {
        await this.getThresholdImageURLInputArea().click();
        await this.clear({ elem: this.getThresholdImageURLInputArea() }, false);
        await this.getThresholdImageURLInputArea().setValue(Text);
        return this.sleep(1000);
    }

    async confirmAdvThresholdDetail() {
        return this.getConfirmButtonInAdvThresholdDetail().click();
    }


    // Assertion helper
    async previewImageAlt(index) {
        let text = await this.getPreviewImageInAdvThresholdEditor(index).getAttribute('alt');
        return text = text.replace(/\u00A0/g, ' ');
    }

    async previewImageURL(index) {
        return this.getPreviewImageInAdvThresholdEditor(index).getAttribute('src');
    }

    async altText(){
        return this.getThresholdImageAltInputArea().getValue();
    }

    async isPreviewImageAltTagNotEmpty(index) {
        let value = await this.getPreviewImageInAdvThresholdEditor(index).getAttribute('alt');
        return value !== null && value.trim().length > 0;
    }

    

}
