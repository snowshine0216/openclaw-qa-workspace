import BasePrompt from '../base/BasePrompt.js';
import PromptSearchbox from '../common/PromptSearchbox.js';

export default class PullDownStyle extends BasePrompt {
    constructor() {
        super();
        this.searchbox = new PromptSearchbox();
        this.itemClass = '.mstrListBlockItemName';
    }

    /****************************************************************
     * Element Locator
     ****************************************************************/

    getPullDownLocator(promptElement) {
        return promptElement.$('.mstrListPulldownTable');
    }

    getPullDownList(promptElement) {
        return promptElement.$('.mstrListBlockListContainer').$$(this.itemClass);
    }

    getPullDownContainer(promptElement) {
        return promptElement.$('.mstrListBlockListContainer');
    }

    /****************************************************************
     * Action Helper
     ****************************************************************/

    async togglePullDownList(promptElement) {
        return (
            await this.safeGetElement(this.getPullDownLocator(promptElement), 'Pulldown is not displayed.')
        ).click();
    }

    async selectPullDownItem(promptElement, text) {
        await this.togglePullDownList(promptElement);
        await this.getItemByTextOfGivenItemList(this.getPullDownList(promptElement), text).click();
        return this.sleep(1000);
    }

    async selectListItem(promptElement, text) {
        await this.getItemByTextOfGivenItemList(this.getPullDownList(promptElement), text).click();
        return this.sleep(1000);
    }

    async multiSelectListItem(promptElement, items) {
        await this.selectListItem(promptElement, items[0]);
        for (const [, item] of items.slice(1).entries()) {
            const el = await this.getItemByTextOfGivenItemList(this.getPullDownList(promptElement), item);
            await this.ctrlClick({ elem: el});
        }
    }

    async scrollDownList(promptElement) {
        return this.scrollDown(promptElement.$('.mstrListBlockContents'), 1000);
    }

    async searchFor(promptElement, text) {
        await this.searchbox.searchFor(promptElement, text);
        await this.waitForElementInvisible(
            this.$('.mstrListPulldownReadyState'),
            3000,
            'Search result page was not displayed.'
        );
        return this.sleep(3000); // Wait for animation to complete
    }

    async clearSearch(promptElement) {
        return this.searchbox.clearSearch(promptElement);
    }

    async clickMatchCase(promptElement) {
        return this.searchbox.clickMatchCase(promptElement);
    }

    /****************************************************************
     * Assertion Helper
     ****************************************************************/

    async getSelectedItem(promptElement) {
        return (await this.safeGetElement(this.getPullDownLocator(promptElement, 'Pulldown is not displayed.')))
            .$(this.itemClass)
            .getText();
    }

    async isItemInList(promptElement, text) {
        let result = false;
        await this.togglePullDownList(promptElement);
        await this.getPullDownList(promptElement).forEach(async (elem) => {
            const content = await elem.getText();
            if (content === text) {
                result = true;
            }
        });
        await this.togglePullDownList(promptElement);
        return result;
    }

    async isFirstSelected(promptElement) {
        await this.togglePullDownList(promptElement);
        const text = await this.getSelectedItem(promptElement);
        const list = this.getPullDownList(promptElement);
        let firstText = await list[0].getText();
        if (firstText === '- all -') {
            firstText = await list[1].getText();
        }
        await this.togglePullDownList(promptElement);
        return text === firstText;
    }

    async isLastSelected(promptElement) {
        await this.togglePullDownList(promptElement);
        await this.scrollDownList(promptElement);
        const text = await this.getSelectedItem(promptElement);
        const lastText = await (await this.getPullDownList(promptElement)).slice(-1)[0].getText();
        await this.togglePullDownList(promptElement);
        return text === lastText;
    }

    async isOnlyAllInList(promptElement) {
        await this.togglePullDownList(promptElement);
        const list = this.getPullDownList(promptElement);
        const result = (await list.length) === 1 && (await list[0].getText()) === '- all -';
        await this.togglePullDownList(promptElement);
        return result;
    }
}
