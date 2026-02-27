import BasePage from '../base/BasePage.js';
import AIBotChatPanel from './AIBotChatPanel.js';
import AIBotDatasetPanel from './AIBotDatasetPanel.js';
import BotVisualizations from './BotVisualizations.js';
import { createXPathForElementSvg } from './utils.js';
import { checkElementByImageComparison } from '../../utils/TakeScreenshot.js';
//import { expectedFormats } from '../../specs/regression/aibotDatasetPanelContextMenu/constants.js';

export default class AIBotDatasetPanelContextMenu extends BasePage {
    static TIMEOUT = 60 * 1000;

    constructor() {
        super();
        this.aibotDatasetPanel = new AIBotDatasetPanel();
        this.aibotChatPanel = new AIBotChatPanel();
        this.botVisualizations = new BotVisualizations();
    }

    //Element locator
    getRenameButton() {
        return this.$('//div[@class="mstr-ai-chatbot-ContextMenu-item" and (text()="Rename" or text()="重命名")]');
    }

    getNumberFormatButton() {
        return this.$(
            '//div[@class="mstr-ai-chatbot-ContextMenu-item mstr-ai-chatbot-ContextMenu-item--expandable" and (text()="Number Format" or text()="数字格式")]'
        );
    }

    getAttributeFormsButton() {
        return this.$(
            '//div[@class="mstr-ai-chatbot-ContextMenu-item mstr-ai-chatbot-ContextMenu-item--expandable" and text()="Available Attribute Forms" or text()="可用的实体形式"]'
        );
    }

    getElementSpanByName(type, text) {
        return this.aibotDatasetPanel
            .getDatasetContainer()
            .$(`//${createXPathForElementSvg(type)}/following-sibling::span/span[text()="${text}"]`);
    }

    getElementSpanById(type, index) {
        return this.aibotDatasetPanel
            .getDatasetContainer()
            .$$(`//${createXPathForElementSvg(type)}/following-sibling::span/span`)[index];
    }

    getElementRenameInput(element) {
        return element.$(`//span[@class="mstr-ai-chatbot-DatasetObject-object-name"]/input[@type="text"]`);
    }

    getCurrencyTabButton() {
        return this.$('.ant-btn.ant-btn-text.ant-btn-sm.ant-btn-icon-only.currency-shortcut-btn.number-format-tooltip');
    }

    getCurrencySelection() {
        return this.$(
            '.ant-select.number-format-select.currency-symbol-select.msdl-label.mstr-select-container__mstr-select.ant-select-single.ant-select-show-arrow'
        );
    }

    getCurrencyPickerButton() {
        return this.getCurrencySelection().$('.ant-select-selection-item');
    }

    getOKButton() {
        return this.$('.ant-btn.ant-btn-primary.mstr-button.mstr-button__primary-type.mstr-button__regular-size');
    }

    getCancelButton() {
        return this.$('.ant-btn.ant-btn-default.mstr-button.mstr-button__regular-type.mstr-button__regular-size');
    }

    getNumberFormat() {
        return this.$('.number-text-format-panel.number-format-panel');
    }

    getSelectionItem() {
        return this.$$('.ant-select-selection-item')[0];
    }

    getCheckBoxByName(form) {
        return browser.$(
            `//label[contains(text(), '${form}')]/ancestor::div[contains(@class, 'mstr-ai-chatbot-Checkbox')]`
        );
    }

    getCheckBoxButtonByName(form) {
        return this.getCheckBoxByName(form).$('.mstr-ai-chatbot-Checkbox-box');
    }

    async isChecked(form) {
        const isChecked = await this.getCheckBoxButtonByName(form).getAttribute('aria-checked');
        return isChecked === 'true';
    }

    getAttributeFormCheckboxStatus(index) {
        return this.$$('.mstr-ai-chatbot-Checkbox')[index];
    }

    getNumberFormatContainer() {
        return this.$('.number-text-format-panel');
    }

    getAttributeFormContainer() {
        return this.$('.mstr-ai-chatbot-AttributeFormsSelector');
    }

    getOKInAttributeForm() {
        return this.$('.mstr-ai-chatbot-Button.mstr-ai-chatbot-Button--theme-primary');
    }

    getCancelInAttributeForm() {
        return this.$('.mstr-ai-chatbot-Button.mstr-ai-chatbot-Button--theme-secondary');
    }

    //Hover button
    async isNumberFormatButtonDisplayed() {
        return this.getNumberFormatButton().isDisplayed();
    }

    async isRenameDisplayed() {
        return this.getRenameButton().isDisplayed();
    }

    async isAttributeFormsButtonDisplayed() {
        return this.getAttributeFormsButton().isDisplayed();
    }

    async hoverOnNumberFormatButton() {
        return this.hover({ elem: this.getNumberFormatButton() });
    }

    async hoverOnAttributeFormsButton() {
        return this.hover({ elem: this.getAttributeFormsButton() });
    }

    //Actions helper
    async rightClickElementByName(type, name) {
        await this.aibotDatasetPanel.getElementByName(type, name).waitForClickable();
        await this.aibotDatasetPanel.getElementByName(type, name).click({ button: 'right' });
        await this.getRenameButton().waitForDisplayed();
    }

    async rightClickElementById(type, index) {
        await this.aibotDatasetPanel.getElementById(type, index).waitForClickable();
        await this.aibotDatasetPanel.getElementById(type, index).click({ button: 'right' });
        await this.getRenameButton().waitForDisplayed();
    }

    async getElementName(type, index) {
        const element = await this.aibotDatasetPanel.getElementById(type, index);
        return await this.aibotDatasetPanel.getElementInsideText(element);
    }

    async openRenamingByRightClick(type, index) {
        await this.rightClickElementById(type, index);
        await this.getRenameButton().click();
        const renameInputElement = await this.aibotDatasetPanel.getElementById(type, index);
        await this.getElementRenameInput(renameInputElement).waitForDisplayed();
    }

    async openRenamingByDoubleClick(type, index) {
        await this.aibotDatasetPanel.getElementById(type, index).waitForClickable();
        await this.aibotDatasetPanel.getElementById(type, index).doubleClick();
        const renameInputElement = await this.aibotDatasetPanel.getElementById(type, index);
        await this.getElementRenameInput(renameInputElement).waitForDisplayed();
    }

    async renameElementAndPressEnter(type, renameText) {
        await this.typeKeyboard(renameText);
        await this.enter();
        await this.getElementSpanByName(type, renameText).waitForDisplayed();
    }

    async renameElementAndPressTab(type, renameText) {
        await this.typeKeyboard(renameText);
        await this.tab();
    }

    async renameElementAndClickOutside(type, renameText) {
        await this.typeKeyboard(renameText);
        await this.$('body').click();
        await this.getElementSpanByName(type, renameText).waitForDisplayed();
    }

    async renameAllElementsOfSameType(type, nameToRenameTo) {
        const elements = await this.aibotDatasetPanel.getElementsWithSpecificType(type);
        const renamedNames = [];
        let index = 0;
        for (const element of elements) {
            const renameName = nameToRenameTo + index;
            await element.click({ button: 'right' });
            await this.getRenameButton().click();
            const renameInputElement = await this.aibotDatasetPanel.getElementById(type, index);
            await this.getElementRenameInput(renameInputElement).waitForDisplayed();
            await this.typeKeyboard(renameName);
            await this.enter();
            await this.getElementSpanByName(type, renameName).waitForDisplayed();
            index++;
            renamedNames.push(renameName);
        }
        return renamedNames;
    }

    async switchNumberFormatTypeToCurrency() {
        await this.getCurrencyTabButton().waitForClickable();
        await browser.execute(() => {
            document
                .querySelector(
                    '.ant-btn.ant-btn-text.ant-btn-sm.ant-btn-icon-only.currency-shortcut-btn.number-format-tooltip'
                )
                .click();
        });
    }

    async pickCurrencyGBP() {
        await this.getCurrencyPickerButton().waitForClickable();
        await browser.execute(() => {
            document
                .querySelector(
                    '.ant-select.number-format-select.currency-symbol-select.msdl-label.mstr-select-container__mstr-select.ant-select-single.ant-select-show-arrow'
                )
                .querySelector('.ant-select-selection-item')
                .click();
        });
        await this.arrowDown();
        await this.arrowDown();
        await this.enter();
    }

    async changeMetricNumberFormattingToCurrencyGBP(name) {
        const elementTypeMetric = 'metric';
        await this.rightClickElementByName(elementTypeMetric, name);
        await this.hoverOnNumberFormatButton();
        await this.switchNumberFormatTypeToCurrency();
        await this.pickCurrencyGBP();
        await this.getOKButton().waitForClickable();
        await this.getOKButton().click();
        return;
    }

    async checkNumberFormat(testCase, imageName) {
        await this.waitForElementVisible(this.getNumberFormat());
        await checkElementByImageComparison(this.getNumberFormat(), testCase, imageName);
    }

    async clickOkInNumberFormat() {
        await this.getOKButton().waitForClickable();
        await browser.execute(() => {
            document
                .querySelector(
                    '.ant-btn.ant-btn-primary.mstr-button.mstr-button__primary-type.mstr-button__regular-size'
                )
                .click();
        });
        return this.getNumberFormatButton().waitForDisplayed({ reverse: true });
    }

    async clickOKInAttributeForm() {
        await this.getOKInAttributeForm().waitForClickable();
        await browser.execute(() => {
            document.querySelector('.mstr-ai-chatbot-Button.mstr-ai-chatbot-Button--theme-primary').click();
        });
        return this.getAttributeFormContainer().waitForDisplayed({ reverse: true });
    }

    async clickCancelInAttributeForm() {
        await this.getCancelInAttributeForm().waitForClickable();
        await browser.execute(() => {
            document.querySelector('.mstr-ai-chatbot-Button.mstr-ai-chatbot-Button--theme-secondary').click();
        });
        return this.getAttributeFormContainer().waitForDisplayed({ reverse: true });
    }

    async checkUncheckAttributeForm(form, attribute) {
        await this.aibotDatasetPanel.rightClickOnDataName(attribute);
        await this.hoverOnAttributeFormsButton();
        await this.getAttributeFormContainer().waitForDisplayed();
        await this.click({ elem: this.getAttributeFormCheckbox(form) });
        await this.clickOKInAttributeForm();
    }

    async changeMetricNumberFormattingToType(numberFormatType, metricName) {
        const elementTypeMetric = 'metric';
        await this.rightClickElementByName(elementTypeMetric, metricName);
        await this.hoverOnNumberFormatButton();
        await this.getNumberFormat().waitForDisplayed();

        const selectionItem = this.getSelectionItem();
        await selectionItem.waitForClickable();
        await browser
            .action('pointer', { parameters: { pointerType: 'touch' } })
            .move({ duration: 0, origin: selectionItem, x: 0, y: 0 })
            .down({ button: 0 })
            .perform();

        const selectionOption = await this.$(
            `.ant-select-item.ant-select-item-option.mstr-select-option[title="${numberFormatType}"]`
        );
        await selectionOption.waitForClickable();

        await browser.execute((type) => {
            document
                .querySelector(`.ant-select-item.ant-select-item-option.mstr-select-option[title="${type}"]`)
                .click();
        }, numberFormatType);
        await this.clickOkInNumberFormat();
    }

    getAttributeForm(form) {
        return this.$$('.mstr-ai-chatbot-Checkbox-text').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText === form;
        })[0];
    }

    getAttributeFormCheckbox(form) {
        return this.$$('.mstr-ai-chatbot-Checkbox-box').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText === form;
        })[0];
    }

    async changeAttributeFormat(data, forms, cancel = false) {
        await this.aibotDatasetPanel.rightClickOnDataName(data);
        await this.hoverOnAttributeFormsButton();
        await this.getAttributeFormContainer().waitForDisplayed();
        if (!Array.isArray(forms)) {
            forms = [forms];
        }
        for (const form of forms) {
            const selectionItem = this.getCheckBoxByName(form);
            await selectionItem.waitForClickable();
            await browser
                .action('pointer', { parameters: { pointerType: 'touch' } })
                .move({ duration: 0, origin: selectionItem, x: 0, y: 0 })
                .down({ button: 0 })
                .perform();
            await browser.pause(1000);
        }
        if (cancel == false || cancel == 'false') {
            await this.clickOKInAttributeForm();
        }
        await browser.pause(2000);
    }

    checkForNameInsideArray(renamedMetrics, arrayToBeChecked) {
        let isInside = false;

        renamedMetrics.forEach((metric) => {
            isInside =
                isInside ||
                arrayToBeChecked.some((textToBeChecked) => {
                    /*
                     * Check for useless escape is disabled to allow regex expression to remove
                     * punctuation from sentences that would prevent metrics names from being found.
                     */
                    return (
                        textToBeChecked
                            // eslint-disable-next-line no-useless-escape
                            .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
                            // eslint-disable-next-line no-useless-escape
                            .includes(metric.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ''))
                    );
                });
            return;
        });
        return isInside;
    }

    async getTextFromMetrics(elementTypeMetric) {
        const metrics = await this.aibotDatasetPanel.getElementsWithSpecificType(elementTypeMetric);
        return await Promise.all(
            metrics.map(async (metric) => await this.aibotDatasetPanel.getElementInsideText(metric))
        );
    }

    async prepareMetricArrayAndCheck(savedMetrics, arrayToBeChecked) {
        const elementTypeMetric = 'metric';
        let renamedMetrics = [];
        const texts = [];

        if (!savedMetrics) {
            renamedMetrics = await this.getTextFromMetrics(elementTypeMetric);
        } else renamedMetrics = savedMetrics;

        for (const elementToBeChecked of arrayToBeChecked) {
            texts.push(await elementToBeChecked.getText());
        }

        return this.checkForNameInsideArray(renamedMetrics, texts);
    }

    async checkIfSuggestionContainsRenamedMetric(savedMetrics) {
        await this.aibotChatPanel.getRecommendationFirstItem().waitForDisplayed({
            timeout: 50000,
        });
        const recommendations = await this.aibotChatPanel.getRecommendationQuestionItems();
        return this.prepareMetricArrayAndCheck(savedMetrics, recommendations);
    }

    async checkBotIfResponseContainsExpectedMetric(savedMetrics) {
        const chatBotMarkDown = await this.aibotChatPanel.getMarkdownByIndexTexts(0);
        return this.prepareMetricArrayAndCheck(savedMetrics, chatBotMarkDown);
    }

    async checkBotIfTopicsContainsRenamedMetric(savedMetrics) {
        const topicObjects = await this.aibotChatPanel.getTopicsObjectNamesFromAskAboutPanel();
        return this.prepareMetricArrayAndCheck(savedMetrics, topicObjects);
    }

    async verifyQuestionsGivenAttributeAndMetric(question, metricNames, screenshotSuffix, testCase = 'TC93244') {
        await this.aibotChatPanel.clearHistoryAndAskQuestion(question);
        since('Response should contain at least one renamed metric, instead none is found')
            .expect(await this.checkBotIfResponseContainsExpectedMetric(metricNames))
            .toBeTrue();
        await this.botVisualizations.checkVizByImageComparison(testCase, `Grid${screenshotSuffix}`);
    }

    createQuestion(metricName, attributeName) {
        return `show me grid with "${metricName}" and "${attributeName}"`;
    }

    async changeAndCheckMetricType(numberFormatType, nameOfMetricWithChangedFormatting, question, index) {
        const elementTypeMetric = 'metric';
        await this.aibotDatasetPanel
            .getElementByName(elementTypeMetric, nameOfMetricWithChangedFormatting)
            .waitForDisplayed();
        await this.changeMetricNumberFormattingToType(numberFormatType, nameOfMetricWithChangedFormatting);
        await this.sleep(500);
        await this.aibotChatPanel.clearHistoryAndAskQuestion(question);
        await since('Metric value is expected to be formated like this: #{expected}, instead we have this: #{actual}}')
            .expect(await this.aibotChatPanel.getAnswersTextByIndex(0))
            .toContain(expectedFormats[index]);
        return 'numberFormatType: ' + numberFormatType;
    }
}
