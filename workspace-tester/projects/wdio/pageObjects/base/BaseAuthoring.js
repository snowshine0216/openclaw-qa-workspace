import BasePage from './BasePage.js';

export default class BaseAuthoring extends BasePage {
    // element locator
    getMenuContainer() {
        return this.$('.mstrmojo-ui-Menu-item-container');
    }

    getMenuContainerByLevel(level) {
        return this.$$('.mstrmojo-ui-Menu-item-container')[level];
    }

    getMenuOption(item) {
        return this.getMenuOptions().filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText === item;
        })[0];
    }

    getMenuOptions() {
        return this.getMenuContainer().$$('.mstrmojo-ui-Menu-item');
    }

    getMenuOptionInLevel({ level, option }) {
        return this.getMenuContainerByLevel(level)
            .$$('.mstrmojo-ui-Menu-item')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === option;
            })[0];
    }

    // action helper
    async clickMenuOptionInLevel({ level, option }) {
        const elem = await this.getMenuOptionInLevel({ level, option });
        return this.click({ elem: elem });
    }

    async clickMenuOptions({ firstOption, secondOption, thirdOption }) {
        if (firstOption) {
            await this.click({ elem: this.getMenuOption(firstOption) });
        }
        if (secondOption) {
            await this.waitForElementVisible(this.getMenuOptionInLevel({ level: 1, option: secondOption }));
            await this.sleep(1000); // wait a while for the context menu to be stable, especially when there is scrollbar
            await this.clickMenuOptionInLevel({ level: 1, option: secondOption });
        }
        if (thirdOption) {
            await this.waitForElementVisible(this.getMenuOptionInLevel({ level: 2, option: thirdOption }));
            await this.clickMenuOptionInLevel({ level: 2, option: thirdOption });
        }
        return this.sleep(1000);
    }
}
