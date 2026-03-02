export default class Select {
    constructor(element) {
        this.element = element;
    }

    $(selector) {
        return this.element.$(selector);
    }

    async click() {
        const selected = await this.element.$('.mstrd-Select-selected');
        await selected.click();
    }

    async open() {
        await this.click();
        for (let i = 0; i < 3; i++) {
            const dropdown = await this.element.$('.mstrd-Select-dropdown');
            if (dropdown.isDisplayed()) {
                break;
            }
        }
    }

    getOption(dropDownOption) {
        return this.element.$$('.mstrd-Option').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText.includes(dropDownOption);
        })[0];
    }

    getOptionsItemValues() {
        return this.element.$$('.mstrd-Option').map(async (elem) => {
            return await elem.getText();
        });
    }
}
