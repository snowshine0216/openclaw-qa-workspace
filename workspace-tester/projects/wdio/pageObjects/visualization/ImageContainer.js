import BasePage from '../base/BasePage.js';
import DossierPage from '../dossier/DossierPage.js';
import PromptEditor from '../common/PromptEditor.js';
import BaseVisualization from '../base/BaseVisualization.js';

export default class ImageContainer extends BaseVisualization {
    constructor() {
        super();
        this.dossierPage = new DossierPage();
        this.promptEditor = new PromptEditor();
        this.imageLocator = '.mstrmojo-ImageBox .mstrmojo-DocImage .img-cntr';
    }

    // Element locator
    getImageNode(index) {
        return this.$$(this.imageLocator).filter((el) => el.isDisplayed())[index];
    }

    async getCurrentPageImageNode(index) {
        const el = await this.dossierPage.getCurrentPageByKey();

        return el.$$(this.imageLocator)[index];
    }

    async getImageNodeByKey(key) {
        return await this.$(`//div[contains(@id, '${key}')]/div[@class='img-cntr']`);
    }

    async getImageBoxByIndex(index) {
        return this.$$(`.mstrmojo-ImageBox`)[index];
    }

    getImageTooltipContainer() {
        return this.$('.mstrmojo-Tooltip-content.mstrmojo-scrollNode');
    }

    getImage(index) {
        return this.getImageNode(index).$('img');
    }

    getImageAltTextInputArea() {
        return this.$('textarea[placeholder="Input a brief description of this image."]');
    }

    getImageURLInputArea() {
        return this.$('input[placeholder="Enter an image URL or choose a file."]');
    }

    getConfirmImageUrlButton() {
        return this.$('.ant-btn.ant-btn-primary.mstr-button.mstr-button__primary-type.mstr-button__regular-size');
    }

    // Action helper

    async navigateLink(index) {
        await this.waitForElementClickable(this.getImageNode(index), {
            timeout: this.DEFAULT_TIMEOUT,
            msg: 'Image is not clickable',
        });
        await this.getImageNode(index).click();
        await this.sleep(3000); // wait for prompt editor to render
        if (!(await this.promptEditor.isEditorOpen())) {
            await this.waitForCurtainDisappear();
        }
        return this.sleep(2000);
    }

    async navigateLinkByKey(key) {
        const imageNode = await this.getImageNodeByKey(key);
        await this.waitForElementClickable(imageNode, {
            timeout: this.DEFAULT_TIMEOUT,
            msg: 'Image is not clickable',
        });
        await imageNode.click();
        await this.sleep(3000); // wait for prompt editor to render
        if (!(await this.promptEditor.isEditorOpen())) {
            await this.waitForCurtainDisappear();
        }
        return this.sleep(2000);
    }
	
    async navigateLinkInCurrentPage(index) {
        const imageNode = await this.getCurrentPageImageNode(index);
        await this.waitForElementClickable(imageNode, {
            timeout: this.DEFAULT_TIMEOUT,
            msg: 'Image is not clickable',
        });

        await imageNode.click();
        await this.sleep(3000); // wait for prompt editor to render
        if (!(await this.promptEditor.isEditorOpen())) {
            await this.waitForCurtainDisappear();
        }
        return this.sleep(2000);
    }

    async hoverOnImage(index) {
        await this.hover({ elem: this.getImageNode(index) });
        return this.sleep(1000);
    }

    async hoverOnImageByKey(key) {
        const imageNode = await this.getImageNodeByKey(key);
        await this.hover({ elem: imageNode });
        return this.sleep(1000);
    }
	
    async imageTooltip() {
        await this.sleep(1000); // Sometimes more than 1 tooltip will be displayed or the old one is unmounting before the tooltip we want is ready, lets wait for the old one to be removed
        await this.waitForElementVisible(this.getImageTooltipContainer(), {
            timeout: 3000,
            msg: 'The tooltip took too long to display',
        });
        const toolTipString = await this.getImageTooltipContainer().getText();
        return toolTipString.trim();
    }

    async openImageLinkEditor(index) {
        await this.openLinkEditorOnContainer(this.getImageNode(index));
    }

    async clickImageinAuthoring(index) {
        await this.getImageNode(index).click();
        return this.sleep(1000);
    }

    async changeAltText(Text) {
        await this.getImageAltTextInputArea().click();
        await this.clear({ elem: this.getImageAltTextInputArea() }, false);
        await this.getImageAltTextInputArea().setValue(Text);
        return this.sleep(1000);
    }

    async changeImageURL(Text) {
        await this.getImageURLInputArea().click();
        await this.clear({ elem: this.getImageURLInputArea() }, false);
        await this.getImageURLInputArea().setValue(Text);
        return this.sleep(1000);
    }

    async confirmImageURL() {
        await this.getConfirmImageUrlButton().click();
        return this.sleep(1000);
    }

    async altText() {
        return this.getImageAltTextInputArea().getValue();
    }

    async allAltTexts() {
        const imgElements = await this.$$(this.imageLocator).filter((el) => el.isDisplayed());
        const altTexts = await Promise.all(
            imgElements.map(async img => (await img.$('img').getAttribute('alt')).replace(/\u00A0/g, ' '))
            );    
        return altTexts;
    }

    // Assertion helper

    imageURL(index) {
        return this.getImage(index).getAttribute('src');
    }

    imageWidth(index) {
        return this.getImage(index).getSize('width');
    }

    imageHeight(index) {
        return this.getImage(index).getSize('height');
    }

    imageAlt(index) {
        return this.getImage(index).getAttribute('alt');
    }

    async isImageErrorIconDisplayed(index) {
        const width = await this.imageWidth(index);
        const height = await this.imageHeight(index);
        return width === height;
    }

    async isAltTextNotEmpty() {
        const value = await this.altText();
        return value !== null && value.trim().length > 0;
    }

    async isAltTagNotEmpty(index) {
        const value = await this.imageAlt(index);
        return value !== null && value.trim().length > 0;
    }

    async isAllAltMatched(expectedAltList, altTexts) {
        let isMatch = true;
        for (let i = 0; i < expectedAltList.length; i++) {
            if (altTexts[i] !== expectedAltList[i]) {
            console.error(`Unmatched: expeted "${expectedAltList[i]}", actual "${altTexts[i]}"`);
            isMatch = false;
            }
        }
        return isMatch;
    }
}
