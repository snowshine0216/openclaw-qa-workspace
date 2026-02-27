export default class Checkbox {
    constructor(element) {
        this.element = element;
    }

    getElement() {
        return this.element;
    }

    static async findAll(container) {
        const elements = await container.$$('.mstrd-Checkbox');
        return elements.map((e) => new Checkbox(e));
    }

    async isChecked() {
        const main = await this.getMain();
        const checked = await main.getAttribute('aria-checked');
        return checked === 'true';
    }

    getMain() {
        return this.element.$('.mstrd-Checkbox-main');
    }

    getLabel() {
        return this.element.$('.mstrd-Checkbox-label');
    }

    async getLabelText() {
        const label = await this.getLabel();
        return label.getText();
    }

    getOnlyButton() {
        return this.element.$('.mstrd-Checkbox-keepOnly');
    }

    async click() {
        const main = await this.getMain();
        await main.click();
    }
}
