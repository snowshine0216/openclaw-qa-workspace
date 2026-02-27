import BaseFilter from '../base/BaseFilter.js';

export default class CheckboxFilter extends BaseFilter {
    // Input box
    getFilterInput(name) {
        return this.getFilterContainer(name).$('.mstrd-ParameterInputField');
    }

    async clearInput(name) {
        const input = await this.getFilterInput(name);
        await this.clear({ elem: input });
    }

    async inputValue(name, value) {
        const input = await this.getFilterInput(name);
        await this.clearInput(name);
        await input.setValue(value);
    }

    async inputValueForLongString(name, value, repeat = 1) {
        const input = await this.getFilterInput(name);
        await this.clearInput(name);
        for (let i = 0; i < repeat; i++) {
            await input.setValue(value);
        }
    }

    async inputPlaceholder(name) {
        const input = await this.getFilterInput(name);
        return input.getAttribute('placeholder');
    }
}
