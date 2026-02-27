import ModalDialog from './ModalDialog.js';
import { scrollElementToBottom, scrollElementToTop } from '../../utils/scroll.js';

export default class TeamsInteractiveChart extends ModalDialog {
    // locators
    getIframe() {
        return this.$('iframe');
    }

    getDialogLoader() {
        return this.getDialog().$(`div[role='progressbar']`);
    }

    getVisualization() {
        return this.$('.mstr-ai-chatbot-VizPageForTeams-content.mstr-ai-chatbot-VisualizationBubbleV2-viz2');
    }

    getInterpretationButton() {
        return this.$('.mstr-ai-chatbot-InterpretationForTeams-explanation-btn');
    }


    getInterpretationWrapper() {
        return this.$('.mstr-ai-chatbot-InterpretationForTeams-markdown-wrapper');
    }

    async getInterpretationBackgroundColor() {
        const style = await this.getInterpretationWrapper().getAttribute('style');
        return style.match(/background-color:\s*(.*?);/)[1];
    }


    getChartOptionButton() {
        return this.$('button[data-feature-id="aibot-chat-chart-context-menu-trigger"]');
    }

    getChartOptionMenu() {
        return this.$('.mstr-ai-chatbot-ChartOptionButton-menu');
    }


    getOptionItemOfChartOptionMenu(option) {
        return this.getChartOptionMenu().$(`//div[@role="menuitem" and contains(text(), "${option}")]`);
    }

    getChartOptionSubMenu() {
        return this.$('.mstr-ai-chatbot-ChartOptionButton-subContent');
    }

    getOptionItemOfSubMenu(option) {
        return this.getChartOptionSubMenu().$(`//div[@role="menuitem" and contains(text(), "${option}")]`);
    }

    getCheckIconOfSubMenu(option) {
        return this.getOptionItemOfSubMenu(option).$('.mstr-ai-chatbot-ChartOptionButton-item-checkIcon');
    }

    // actions
    async waitForLoadingOfViz() {
        const viz = this.getVisualization();
        await this.waitForElementVisible(this.getIframe());
        await this.waitForElementInvisible(this.getDialogLoader());
        await this.switchToLibraryIframe();
        await this.waitForElementVisible(viz);
    }

    async clickInterpretationButton() {
        await this.click({ elem: this.getInterpretationButton() });
    }

    async checkMenuOptionEnabled(option, value) {
        await this.click({ elem: this.getChartOptionButton() });
        await this.waitForElementVisible(this.getChartOptionMenu());
        await this.click({ elem: this.getOptionItemOfChartOptionMenu(option) });
        await this.waitForElementVisible(this.getChartOptionSubMenu());
        const isEnabled = await this.getCheckIconOfSubMenu(value).isDisplayed();
        return isEnabled;
    }


    async modifyChartOption(option, value) {
        const optionText = option;
        const valueText = value;

        // click to open menu
        await this.click({ elem: this.getChartOptionButton() });
        await this.waitForElementVisible(this.getChartOptionMenu());
    
        // wait for the menu to be visible
        await browser.execute(function(optionText, valueText) {
            const menuItems = document.querySelectorAll('[role="menuitem"]');
            let firstLevelItem = null;

            for (const item of menuItems) {
                if (item.textContent.includes(optionText)) {
                    firstLevelItem = item;
                    break;
                }
            }

            if (firstLevelItem) {
                // click the first-level menu item
                firstLevelItem.click();
                // wait for the sub-menu to appear
                setTimeout(() => {
                    // find and click the sub-menu item
                    const subMenuItems = document.querySelectorAll('[role="menuitem"]');
                    for (const subItem of subMenuItems) {
                        if (subItem.textContent.includes(valueText)) {
                            subItem.click();
                            break;
                        }
                    }
                }, 500);
            }
        }, optionText, valueText);

        // wait for the menu to disappear
        await this.waitForElementInvisible(this.getChartOptionMenu(), 10000);
        await this.sleep(1000);
    }

    async closeInteractiveChartWindow() {
        await browser.switchToFrame(null);
        const isDialogVisible = await this.getDialog().isDisplayed();
        if (isDialogVisible) {
            await this.click({ elem: this.getCloseButtonInMessageExtension() });
        }
    }

}
