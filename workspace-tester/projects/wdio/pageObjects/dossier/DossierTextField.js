import BaseComponent from '../base/BaseComponent.js';
import BaseContainer from '../authoring/BaseContainer.js';

/**
 * There might be many TextFields
 * To use this component, user can new an object and pass TextField text as parameter to all related functions
 * then we can identically locate element using getTextFieldByText(*)
 */
export default class DossierTextField extends BaseContainer {
    constructor() {
        super();
    }

    getTextFieldbyName(containerName) {
        return this.getContainer(containerName).$(`.//div[contains(@class,'vi-doc-tf-value-text hasEditableText')]`);
    }

    getTextFields() {
        return this.$('body').$$('.mstrmojo-DocTextfield');
    }

    getTextFieldByText(text) {
        const locators = this.$('body').$$('.mstrmojo-DocTextfield');
        const target = locators.filter(async (locator) => {
            const tmpText = await locator.getText();
            return tmpText === text;
        })[0];
        return target;
    }

    getFiledText() {
        return this.getTextFields()[0].getText();
    }

    getTextFieldByTextContent(text) {
        const normalizedText = text.trim();
        return this.$(
            `//div[contains(@class,'mstrmojo-DocTextfield-valueNode') and .//div[contains(@class,'vi-doc-tf-value-text') and normalize-space(.)="${normalizedText}"]]`
        );
    }

    async clickTextFieldByTextContent(text) {
        const textField = await this.getTextFieldByTextContent(text);
        await textField.waitForDisplayed({ timeout: 5000 });
        await textField.click();
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async getRichTextBoxByContent(textContent) {
        const normalizedText = textContent.trim().toLowerCase();
        const candidates = await $$(`//div[contains(@class,'mstrmojo-VITextBox')]`);

        for (const candidate of candidates) {
            const ariaLabel = await candidate.getAttribute('aria-label');
            if (ariaLabel && ariaLabel.trim().toLowerCase() === normalizedText) {
                return candidate;
            }

            const label = await candidate.$(`.//div[contains(@class,'vi-doc-tf-value-text')]`);
            if (await label.isExisting()) {
                const labelText = (await label.getText()).trim().toLowerCase();
                if (labelText === normalizedText) {
                    return candidate;
                }
            }
        }

        throw new Error(`Rich text box with content "${textContent}" was not found.`);
    }

    async clickRichTextBoxByContent(textContent) {
        const richTextBox = await this.getRichTextBoxByContent(textContent);
        await this.clickRichTextBoxElement(richTextBox);
    }

    async getRichTextBoxByAriaLabel(ariaLabel) {
        const normalizedLabel = ariaLabel.trim().toLowerCase();
        const candidates = await $$(`//div[contains(@class,'mstrmojo-VITextBox') and @aria-label]`);

        for (const candidate of candidates) {
            const candidateLabel = await candidate.getAttribute('aria-label');
            if (candidateLabel && candidateLabel.trim().toLowerCase() === normalizedLabel) {
                return candidate;
            }
        }

        throw new Error(`Rich text box with aria-label "${ariaLabel}" was not found.`);
    }

    async clickRichTextBoxByAriaLabel(ariaLabel) {
        const richTextBox = await this.getRichTextBoxByAriaLabel(ariaLabel);
        await this.clickRichTextBoxElement(richTextBox);
    }

    async clickRichTextBoxElement(richTextBox) {
        await richTextBox.scrollIntoView({ block: 'center', inline: 'center' });
        const editor = await richTextBox.$('.ql-editor');
        await editor.waitForDisplayed({ timeout: 5000 });

        try {
            await editor.click();
            return;
        } catch (error) {
            if (!error.message || !error.message.includes('element click intercepted')) {
                throw error;
            }
        }

        const overlay = await richTextBox.$('.ctrlOverlay');
        if (!(await overlay.isExisting()) || !(await overlay.isDisplayed())) {
            throw new Error('Rich text box overlay unexpectedly missing while handling click interception.');
        }

        await overlay.waitForDisplayed({ timeout: 5000 });
        try {
            await overlay.waitForClickable({ timeout: 1000 });
        } catch (error) {
            // Overlay might not report clickable state; ignore timeout.
        }

        try {
            await overlay.click();
        } catch (error) {
            // Fallback to JS click if overlay remains in front.
            await browser.execute((elem) => elem.click(), overlay);
        }

        await browser.execute((elem) => {
            elem.focus();
            elem.click();
        }, editor);
    }

    async getHeight(textFieldText) {
        const size = await this.getTextFieldByText(textFieldText).getSize();
        return size.height;
    }

    static createByText(text) {
        return new TextField(by.cssContainingText('.mstrmojo-DocTextfield', text));
    }

    async clickTextField(textFieldText) {
        return this.click(this.getTextFieldByText(textFieldText));
    }

    async doubleClickTextField(textFieldText) {
        return this.doubleClick(this.getTextFieldByText(textFieldText));
    }

    async getTextFieldText(textField) {
        return await textField.getText();
    }

    async editTextFieldbyDoubleClick(textField, newText) {
        // Double-click on the text field to enable editing
        await textField.doubleClick();

        // Clear the existing text
        await this.ctrlA(); // Select all text (use 'Command' on Mac if needed)
        await this.delete(); // Clear the text

        // Enter the new text
        await browser.keys(newText);

        // Confirm the change (e.g., by pressing Enter)
        await browser.keys('Enter');
    }

    async pasteTextFieldbyDoubleClick(textField) {
        // Double-click on the text field to enable editing
        await textField.doubleClick();

        // Clear the existing text
        await this.ctrlA(); // Select all text (use 'Command' on Mac if needed)
        await this.delete(); // Clear the text
        // Enter the new text
        await this.paste();

        // Confirm the change (e.g., by pressing Enter)
        await browser.keys('Enter');
    }

    async getTextFiledTitle(text) {
        const el = await this.getTextFieldByText(text);
        return el.getAttribute('title');
    }

    // assertion
    async isTextPresent(text) {
        return this.getTextFieldByText(text).isDisplayed();
    }
}
