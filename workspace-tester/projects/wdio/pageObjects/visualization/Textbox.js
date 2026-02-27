import BasePage from '../base/BasePage.js';
import DossierPage from '../dossier/DossierPage.js';
import PromptEditor from '../common/PromptEditor.js';
import BaseVisualization from '../base/BaseVisualization.js';
import { Key } from 'webdriverio';
export default class Textbox extends BaseVisualization {
    constructor() {
        super();
        this.dossierPage = new DossierPage();
        this.promptEditor = new PromptEditor();
    }

    // Element locator
    getTextNode(index) {
        const nodes = this.dossierPage.$$('.mstrmojo-VITextBox');
        return nodes[index];
    }

    getTextNodeByText(text) {
        return this.$$('.mstrmojo-VITextBox').filter(async (el) => {
            const textContent = await el.getText();
            return textContent.includes(text) && el.isDisplayed();
        })[0];
    }

    getTextNodeByKey(key) {
        return this.$(`//div[contains(@id, '${key}')]/../../../..`);
    }

    getTextFieldByKey(key) {
        return this.$(`//div[contains(@id, '${key}')]`);
    }

    async getTextNodeInCurrentPage(index) {
        const el = await this.dossierPage.getCurrentPageByKey();
        return el.$$('.mstrmojo-VITextBox')[index];
    }

    getTooltip() {
        return this.$('.mstrmojo-Tooltip-contentWrapper');
    }

    getLinkIconByTextNode(key) {
        const element = this.getTextNodeByKey(key);
        return element.$('.hover-link-btn');
    }

    getPopUpLink() {
        return $(
            `//div[contains(@class, 'mstrmojo-Box link-action-cfg mstrmojo-ui-ToolbarPopup') and contains(@style, 'display: block')]//div[contains(@class, 'mstrmojo-Label link nav')]`
        );
    }

    async InputValuetoTextNodeByKey(key, text) {
        let textContainer = await this.getTextFieldByKey(key).$(
            `.//div[contains(@class,'vi-doc-tf-value-text hasEditableText')]`
        );
        await browser.keys([Key.Backspace]);
        await textContainer.addValue(text);
        await browser.keys([Key.Escape]);
        await this.waitForCurtainDisappear();
    }

    async hoverTextNodeByKey(key) {
        const element = await this.getTextNodeByKey(key);
        await this.hover({ elem: element });
        return this.sleep(1000);
    }

    async clickTextContextMenuOptionByKey(key, option) {
        const node = await this.$(
            `//div[contains(@id,'${key}')]/../../../../div[@class="hover-btn hover-menu-btn mouse-left"]`
        );
        await node.click();
        const optionEl = await this.common.getContextMenuItem(option);
        await this.waitForElementVisible(optionEl, 3 * 1000);
        await this.click({ elem: optionEl });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async isPopUpLinkDisplayedEditMode(text) {
        const textNode = this.getTextNodeByText(text);
        await this.click({ elem: textNode });
        await this.sleep(3000);
        const el = this.$(
            `//div[contains(@class, 'mstrmojo-Box link-action-cfg mstrmojo-ui-ToolbarPopup') and contains(@style, 'display: block;')]`
        );
        return el.isDisplayed();
    }

    async isTooltipDisplayedForTextNodeByKey(key) {
        const tooltip = await this.getTextNodeByKey(key).$('.mstrmojo-Tooltip-contentWrapper');
        return tooltip.isDisplayed();
    }
    // Action helper
    async navigateLink(index) {
        const textNode = await this.getTextNodeInCurrentPage(index);
        await this.waitForElementClickable(textNode, {
            timeout: this.DEFAULT_TIMEOUT,
            msg: 'Textbox is not clickable',
        });
        await textNode.click();
        await this.sleep(3000); // wait for prompt editor to render
        if (!(await this.promptEditor.isEditorOpen())) {
            await this.waitForCurtainDisappear();
        }
        return this.sleep(3000);
    }

    async navigateLinkByText(text) {
        const textNode = this.getTextNodeByText(text);
        await this.click({ elem: textNode });
        await this.sleep(3000); // wait for prompt editor to render
        if (!(await this.promptEditor.isEditorOpen())) {
            await this.waitForCurtainDisappear();
        }
        return this.sleep(1000);
    }

    async navigateLinkByKey(key) {
        const textNode = this.getTextNodeByKey(key);
        await this.click({ elem: textNode });
        await this.sleep(3000); // wait for prompt editor to render
        if (!(await this.promptEditor.isEditorOpen())) {
            await this.waitForCurtainDisappear();
        }
        return this.sleep(1000);
    }

    async openTextLinkEditor(text) {
        await this.openLinkEditorOnContainer(this.getTextNodeByText(text));
    }

    async navigateLinkEditMode(index) {
        await this.waitForElementClickable(this.getTextNode(index), {
            timeout: this.DEFAULT_TIMEOUT,
            msg: 'Textbox is not clickable',
        });
        await this.getTextNode(index).click();
        await this.sleep(3000);
        await this.getPopUpLink().click();
    }

    async navigateLinkEditModeByKey(key) {
        await this.waitForElementClickable(this.getTextNodeByKey(key), {
            timeout: this.DEFAULT_TIMEOUT,
            msg: 'Textbox is not clickable',
        });
        await this.getTextNodeByKey(key).click();
        await this.sleep(3000);
        await this.getPopUpLink().click();
    }

    // Assertion helper
    async tooltip(index) {
        await this.hover({ elem: this.getTextNode(index) });
        await this.waitForElementVisible(this.getTooltip(), { timeout: 5000, msg: 'No tooltip shown.' });
        await this.sleep(1000); // Wait for animation to complete
        return this.getTooltip().getText();
    }

    async textContent(index) {
        await this.waitForElementVisible(this.getTextNode(index), {
            timeout: this.DEFAULT_TIMEOUT,
            msg: 'Textbox is not visible',
        });
        return this.getTextNode(index).getText();
    }

    //check if the text content != null
    async isTextContentDisplayed(index) {
        await this.waitForElementVisible(this.getTextNode(index), {
            timeout: this.DEFAULT_TIMEOUT,
            msg: 'Textbox is not visible',
        });
        const text = await this.getTextNode(index).getText();
        console.log('Textbox content: ', text);
        return text !== null && text.trim() !== '';
    }

    async textBackgoundColor(index) {
        return (await this.getTextNode(index).$('.mstrmojo-DocTextfield').getCSSProperty('background-color')).value;
    }

    async textFormat(index, styleProp) {
        return (await this.getTextNode(index).$('.mstrmojo-DocTextfield-valueNode').getCSSProperty(styleProp)).value;
    }

    async pasteToTextbox(index) {
        await this.waitForElementClickable(this.getTextNode(index), {
            timeout: this.DEFAULT_TIMEOUT,
            msg: 'Textbox is not clickable',
        });
        await this.getTextNode(index).doubleClick();
        await this.sleep(1000);
        await this.paste();
        await this.sleep(1000);
    }
}