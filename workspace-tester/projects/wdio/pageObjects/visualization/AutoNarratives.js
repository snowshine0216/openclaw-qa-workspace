import VisualizationPanel from '../dossierEditor/VisualizationPanel.js';
import { getAttributeValue } from '../../utils/getAttributeValue.js';
import BaseVisualization from '../base/BaseVisualization.js';
import DossierAuthoringPage from '../dossier/DossierAuthoringPage.js';
import { takeScreenshotByElement } from '../../utils/TakeScreenshot.js';
import { Key } from 'webdriverio';

export default class AutoNarratives extends BaseVisualization {
    constructor() {
        super();
        this.vizPanel = new VisualizationPanel();
        this.dossierAuthoringPage = new DossierAuthoringPage();
    }

    getFootnote(index = 0) {
        return this.$$('.mstr-auto-narr-src-viz')[index];
    }

    getTooltip() {
        return this.$$('.autonarratives.new-vis-tooltip').filter(async (item) => item.isDisplayed())[0];
    }

    getInstructionInput() {
        return this.$('.mstr-chatbot-chat-input__input');
    }

    getInstructionIcon() {
        return this.$('.mstr-icons-single-icon.single-icon-common-info.single-icon-common-info--d846b3ed');
    }

    getInfoIcon(index = 0) {
        return this.$$('.single-icon-common-info')[index];
    }

    getInstructionInputCount() {
        return this.$('.mstr-rich-input-viz-editor_input-count');
    }

    getInstructionGenerateBtn() {
        return this.$('.mstr-rich-input-viz-editor__button');
    }

    getSuggestionPopupDialog() {
        return this.$('.ReactVirtualized__Grid__innerScrollContainer');
    }

    getSuggestionPopup() {
        return this.$('.mstr-chatbot-suggestion-popup-item-row');
    }

    getSuggestionItemByName(name) {
        return this.$$('.mstr-design-list-item ').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText === name;
        })[0];
    }

    getEditorPanel() {
        return this.$('.mstr-rich-input-viz-editor');
    }

    getSummaryByVizTitle(title) {
        return this.vizPanel.getVizByMatchFullTitle(title).$('.summary-container');
    }

    getNLGContainerByIndex(index = 0) {
        return this.$$('.mstr-auto-narr-container').filter(async (item) => item.isDisplayed())[index];
    }

    getDisplayedTooltip() {
        return this.$$('.mstr-design-tooltip-inner').filter(async (item) => item.isDisplayed())[0];
    }

    getTextFromDisplayedTooltip() {
        return this.getDisplayedTooltip().getText();
    }

    getSummaryByIndex(index = 0) {
        return this.$$('.summary-container').filter(async (item) => item.isDisplayed())[index];
        // return this.vizPanel.getDisplayedPage().$$('.summary-container')[index];
    }

    getNLGLoadingInEditor() {
        return this.$(
            '//div[contains(@class, "mstr-auto-narr-loading-container") and contains(@style,"display: flex;")]'
        );
    }

    getStreamMode() {
        return this.$('.stream-mode');
    }
    // 0 for authoring, 1 for consumption, 2 for consumption data changed
    getNLGRefreshIcon(index = 0) {
        switch (index) {
            case 0:
                return this.vizPanel.getDisplayedPage().$('.mstr-auto-narr-refresh-button');
            case 1:
                return this.$(
                    '//div[contains(@class, "mojo-theme-light") and not(contains(@style,"display: none;"))]//div[@class="mstr-auto-narr-refresh-button"]'
                );
            case 2:
                return this.$(
                    '//div[contains(@class, "mojo-theme-light") and not(contains(@style,"display: none;"))]//div[@class="mstr-auto-narr-refresh-button dataChanged"]'
                );
            default:
                return this.vizPanel.getDisplayedPage().$('.mstr-auto-narr-refresh-button');
        }
    }

    getDisclaimerAndRefresh() {
        return this.vizPanel.getDisplayedPageInConsumtpion().$('.mstr-auto-narr-refresh-button-disclaimer-container');
    }

    getCopyBtn() {
        return this.$('.hover-btn.hover-nlg-copy-btn.max-present.mouse-left');
    }

    getDashboardPopupDialog() {
        return this.$(`.mstrmojo-Editor.mstrmojo-ConfirmSave-Editor.mstrmojo-ConfirmAutoNarrativeSave-Editor.modal`);
    }

    getConfirmButton(buttonName) {
        return this.$(
            `//div[@class='mstrmojo-Editor-buttons']//div[@class='mstrmojo-Button-text ' and text()='${buttonName}']`
        );
    }

    getDataCutInfoIcon() {
        return this.$('.data-cut-info-icon-container');
    }

    getDataCutInfoTooltip() {
        return this.$('.new-vis-tooltip-table');
    }

    async getDataCutInfoTooltipText() {
        return this.getDataCutInfoTooltip().getText();
    }

    getDeleteVizPopupDialog() {
        return this.$(`.mstrmojo-Editor.mstr-auto-narrative-delete-confirmation.modal`);
    }

    getWrapTextCheckbox() {
        return this.$(`//div[contains(@class,'abaloc-checkbox-wraptext')]//span`);
    }

    getAutosizeCheckbox() {
        return this.$(`//div[contains(@class,'abaloc-checkbox-autosize')]//span`);
    }

    //top, middle, bottom
    getAlignment(type) {
        return this.$(`//div[@class='vertical-align-icons ${type}']`);
    }

    getWorkflowType() {
        return this.$(`//div[contains(@class,'abaloc-select-overflow')]`);
    }

    //clip, scroll
    getWorkflowListItem(itemName) {
        return this.$(`//div[contains(@class,'ant-select-item-option-content')]//span[text()='${itemName}']`);
    }

    //none, small, medium, large
    getCellPadding(type) {
        return this.$(`//div[@class='cell-padding-icons ${type}']`);
    }

    getEmptySummary() {
        return this.$('.AutoNarratives');
    }

    getAutoRefreshCheckbox() {
        return this.$('.mstr-rich-input-viz-editor__auto-refresh-container .mstr-design-checkbox');
    }

    getAutoSummaryIcon() {
        return this.$('.insertPredefinedNLG');
    }

    getAutoSummaryIconConsumption() {
        return this.$('.auto-summary-icon');
    }

    getDisplayInConsumptionCheckbox() {
        return this.$('.mstr-rich-input-viz-editor__show-in-consumption-container .mstr-design-checkbox');
    }

    getDisplayInConsumptionCheckboxInput() {
        return this.$(
            '.mstr-rich-input-viz-editor__show-in-consumption-container .mstr-design-checkbox .mstr-design-checkbox-input'
        );
    }

    getAutoSummaryExpandButton() {
        return this.$('.mstr-auto-narr-expand-restore-btn');
    }

    getAutoSummaryCopyButton() {
        return this.$('.mstr-auto-narr-copy-btn');
    }

    getAutoSummaryCloseButton() {
        return this.$('.mstr-auto-narr-close-btn');
    }

    async hoverOnFootnote(index = 0) {
        await this.hover({ elem: this.getFootnote(index) });
    }

    async hoverOnInstructionIcon() {
        await this.hover({ elem: this.getInfoIcon(0) });
        await this.sleep(1000); // Wait for tooltip to appear
    }

    async hoverOnAutoRefreshInfo() {
        await this.hover({ elem: this.getInfoIcon(1) });
        await this.sleep(1000); // Wait for tooltip to appear
    }

    async hoverOnDataCutInfoIcon() {
        await this.waitForElementVisible(this.getDataCutInfoIcon(), { timeout: this.DEFAULT_TIMEOUT * 100 });
        await this.hover({ elem: this.getDataCutInfoIcon() });
        await this.sleep(1000); // Wait for tooltip to appear
    }

    async checkTooltip(testCase, imageName, tolerance = 0.5) {
        await this.waitForElementVisible(this.getTooltip());
        await takeScreenshotByElement(this.getTooltip(), testCase, imageName, tolerance);
    }

    async checkInstructionTooltip(testCase, imageName, tolerance = 0.5) {
        await this.waitForElementVisible(this.getDisplayedTooltip());
        await takeScreenshotByElement(this.getDisplayedTooltip(), testCase, imageName, tolerance);
    }

    async checkInstruction(testCase, imageName, tolerance = 0.5) {
        await this.waitForElementVisible(this.getInstructionInput());
        await takeScreenshotByElement(this.getInstructionInput(), testCase, imageName, tolerance);
    }

    async checkEditorPanel(testCase, imageName, tolerance = 0.5) {
        await this.waitForElementVisible(this.getEditorPanel());
        await takeScreenshotByElement(this.getEditorPanel(), testCase, imageName, tolerance);
    }

    async checkRefreshButton(testCase, imageName, tolerance = 0.5) {
        await this.waitForElementVisible(this.getRefreshBtn());
        await takeScreenshotByElement(this.getRefreshBtn(), testCase, imageName, tolerance);
    }

    async checkDisclaimRefreshDisplay(testCase, imageName, tolerance = 0.5) {
        await this.waitForElementVisible(this.getDisclaimerAndRefresh());
        await takeScreenshotByElement(this.getDisclaimerAndRefresh(), testCase, imageName, tolerance);
    }

    async checkPopupDialog(testCase, imageName, tolerance = 0.5) {
        await this.waitForElementVisible(this.getDashboardPopupDialog());
        await takeScreenshotByElement(this.getDashboardPopupDialog(), testCase, imageName, tolerance);
    }

    async checkDeleteVizPopupDialog(testCase, imageName, tolerance = 0.5) {
        await this.waitForElementVisible(this.getDeleteVizPopupDialog());
        await takeScreenshotByElement(this.getDeleteVizPopupDialog(), testCase, imageName, tolerance);
    }

    async checkSuggestionsPopup(testCase, imageName, tolerance = 0.5) {
        await this.waitForElementVisible(this.getSuggestionPopupDialog());
        await takeScreenshotByElement(this.getSuggestionPopupDialog(), testCase, imageName, tolerance);
    }

    async checkSummaryByVizIndex(testCase, imageName, index = 0, tolerance = 0.5) {
        await this.waitForElementVisible(this.getSummaryByIndex(index));
        await takeScreenshotByElement(this.getSummaryByIndex(index), testCase, imageName, tolerance);
    }

    async checkEmptySummary(testCase, imageName, tolerance = 0.5) {
        await this.waitForElementVisible(this.getEmptySummary());
        await takeScreenshotByElement(this.getEmptySummary(), testCase, imageName, tolerance);
    }

    async clickEmptySummary() {
        await this.click({ elem: this.getEmptySummary() });
        await this.waitForElementVisible(this.getInstructionInput());
    }

    //InstructionSring example: ["summarize @visualization", Key.Tab, "and  highlights in green and lowlights in black "]
    async setInstruction(instructionString) {
        await this.click({ elem: this.getInstructionInput() });
        await browser.keys([Key.Ctrl, 'a']);
        await this.typeKeyboard(instructionString);
        // await this.typeKeyboard(["summarize @visualization", Key.Tab, "and  highlights in green and lowlights in black "]);
        await this.click({ elem: this.getInstructionGenerateBtn() });
    }

    async setInstructionOnly(instructionString) {
        await this.click({ elem: this.getInstructionInput() });
        await browser.keys([Key.Ctrl, 'a']);
        await this.typeKeyboard(instructionString);
    }

    async clickGenerate(index = 0) {
        await this.waitForElementClickable(this.getInstructionGenerateBtn());
        await this.click({ elem: this.getInstructionGenerateBtn() });
        await this.waitForElementInvisible(this.getNLGLoadingInEditor());
        await this.waitForElementInvisible(this.getStreamMode());
        await this.waitForElementVisible(this.getNLGRefreshIcon(index));
    }

    async selectCreateAutoNarrativeOnVisualizationMenu(title) {
        await this.hover({ elem: this.getVisualizationMenuButton(title) });
        return this.selectVisualizationMenuOptions({
            elem: this.getVisualizationMenuButton(title),
            firstOption: 'Create Auto Narratives',
        });
    }

    async selectDuplicateOnVisualizationMenu(title) {
        await this.hover({ elem: this.getVisualizationMenuButton(title) });
        await this.selectVisualizationMenuOptions({
            elem: this.getVisualizationMenuButton(title),
            firstOption: 'Duplicate',
        });
        await this.waitForElementInvisible(this.getNLGLoadingInEditor());
        await this.waitForElementVisible(this.getNLGRefreshIcon());
        await this.sleep(2000); // Time buffer for elements to be fully loaded
    }

    async selectCopyFormattingOnVisualizationMenu(title) {
        await this.hover({ elem: this.getVisualizationMenuButton(title) });
        return this.selectVisualizationMenuOptions({
            elem: this.getVisualizationMenuButton(title),
            firstOption: 'Copy Formatting',
        });
    }

    async selectPasteFormattingOnVisualizationMenu(title) {
        await this.hover({ elem: this.getVisualizationMenuButton(title) });
        return this.selectVisualizationMenuOptions({
            elem: this.getVisualizationMenuButton(title),
            firstOption: 'Paste Formatting',
        });
    }

    async selectDeleteOnVisualizationMenu(title) {
        await this.hover({ elem: this.getVisualizationMenuButton(title) });
        return this.selectVisualizationMenuOptions({
            elem: this.getVisualizationMenuButton(title),
            firstOption: 'Delete',
        });
    }

    async getSummaryTextByVizTitle(title) {
        await this.waitForElementVisible(this.getSummaryByVizTitle(title));
        const elem = await this.getSummaryByVizTitle(title);
        const summaryText = await elem.getText();
        return summaryText;
    }

    async getSummaryTextByIndex(index = 0) {
        await this.waitForElementVisible(this.getSummaryByIndex(index));
        const elem = await this.getSummaryByIndex(index);
        const summaryText = await elem.getText();
        return summaryText;
    }

    async getTooltipText() {
        await this.waitForElementVisible(this.getTooltip());
        const tooltipText = await this.getTooltip().getText();
        return tooltipText;
    }

    async clickCancelButton() {
        await this.clickButton('Cancel');
    }

    async clickDeleteButton() {
        await this.clickButton('Delete');
    }

    async clickButton(buttonName) {
        await this.click({ elem: this.getConfirmButton(buttonName) });
        await this.waitForItemLoading();
        return this.sleep(1000); // Time buffer for elements to be fully loaded
    }

    async clickWrapTextCheckbox() {
        await this.waitForElementVisible(this.getWrapTextCheckbox());
        await this.click({ elem: this.getWrapTextCheckbox() });
        await this.waitForItemLoading();
    }

    async clickAutosizeCheckbox() {
        await this.waitForElementVisible(this.getAutosizeCheckbox());
        await this.click({ elem: this.getAutosizeCheckbox() });
        await this.waitForItemLoading();
    }

    async switchAlignment(type) {
        await this.click({ elem: this.getAlignment(type) });
        await this.waitForItemLoading();
    }

    async switchWorkflow(type) {
        await this.click({ elem: this.getWorkflowType() });
        await this.click({ elem: this.getWorkflowListItem(type) });
        await this.waitForItemLoading();
    }

    async switchCellPadding(type) {
        await this.click({ elem: this.getCellPadding(type) });
        await this.waitForItemLoading();
    }

    async clickRefreshIcon(index = 0) {
        await this.waitForElementVisible(this.getNLGRefreshIcon(index));
        await this.click({ elem: this.getNLGRefreshIcon(index) });
        await this.waitForElementInvisible(this.getNLGLoadingInEditor());
        await this.waitForElementVisible(this.getNLGRefreshIcon());
    }

    async waitForNlgReady(index = 0) {
        await this.waitForElementInvisible(this.getNLGLoadingInEditor());
        await this.waitForElementVisible(this.getNLGRefreshIcon(index), { timeout: this.DEFAULT_TIMEOUT * 100 });
    }

    async clickSuggenstedItemByName(name) {
        await this.waitForElementVisible(this.getSuggestionItemByName(name));
        await this.click({ elem: this.getSuggestionItemByName(name) });
    }

    async clickAutoRefresh() {
        await this.click({ elem: this.getAutoRefreshCheckbox() });
    }

    async clickDisplayInConsumption() {
        await this.click({ elem: this.getDisplayInConsumptionCheckbox() });
        await this.waitForItemLoading();
    }

    async clickAutoSummaryExpandButton() {
        await this.click({ elem: this.getAutoSummaryExpandButton() });
        await this.waitForItemLoading();
    }

    async clickAutoSummaryCopyButton() {
        await this.click({ elem: this.getAutoSummaryCopyButton() });
    }

    async clickAutoSummaryCloseButton() {
        await this.click({ elem: this.getAutoSummaryCloseButton() });
        await this.waitForItemLoading();
    }

    async isDisplayInConsumptionChecked() {
        const checkedAttr = await this.getDisplayInConsumptionCheckboxInput().getAttribute('checked');
        return checkedAttr !== null;
    }

    async isAutoSummaryExpand() {
        const name = await getAttributeValue(this.getAutoSummaryExpandButton(), 'className');
        return name.toLowerCase().includes(`restore-button`);
    }

    async isAutoSummaryIconSelected() {
        const el = await this.getAutoSummaryIcon();
        return this.isSelected(el);
    }

    async validateClipboardContains(expectedString) {
        await since(`Expected clipboard text to contain "${expectedString}", while we get #{actual}`)
            .expect(await this.getClipboardText())
            .toContain(expectedString);
    }

    async validateSummaryTextContains(summaryText, expectedStrings) {
        expectedStrings.forEach(async (expectedString) => {
            await since(`Expected summary text to contain "${expectedString}", while we get #{actual}`)
                .expect(summaryText)
                .toContain(expectedString);
        });
    }

    async clickAutoSummaryIcon(isConsumption = false) {
        if (isConsumption) {
            await this.click({ elem: this.getAutoSummaryIconConsumption() });
            await this.waitForElementVisible(this.getNLGRefreshIcon(1), { timeout: this.DEFAULT_TIMEOUT * 100 });
        } else {
            await this.click({ elem: this.getAutoSummaryIcon() });
            await this.waitForElementVisible(this.getNLGRefreshIcon(0), { timeout: this.DEFAULT_TIMEOUT * 100 });
        }
    }

    async verifySummaryStyleByPos(index = 0, styles) {
        const el = await this.getSummaryByIndex(index);
        await this.waitForElementVisible(el);  
        for (const [style, value] of Object.entries(styles)) {
            const cssProperty = await el.getCSSProperty(style);
            await since(`Summary CSS style ${style} should have value of #{expected}, instead we have #{actual}.`)
                .expect(await cssProperty.value.toString())
                .toBe(value);
        }
    }

    async isAutoSummaryExistInCanvas() {
        return this.getAutoSummaryIconConsumption().isExisting();
    }
}
