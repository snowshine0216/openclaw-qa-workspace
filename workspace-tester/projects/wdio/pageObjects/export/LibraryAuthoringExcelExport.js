import BasePage from '../base/BasePage.js';
export default class LibraryAuthoringExcelExport extends BasePage {

    getExcelRangeSetting() {
        return this.$(`//div[@aria-label='Range']`).$('..').$('.mstrmojo-ui-Pulldown').$('.mstrmojo-ui-Pulldown-text');
    }

    getExcelRangeOption(option) {
        return this.$(`//div[text()='${option}']`);
    }
 
    getExcelContentSetting() {
        return this.$(`//div[@aria-label='Contents']`).$('..').$('.mstrmojo-ui-Pulldown').$('.mstrmojo-ui-Pulldown-text');
    }

    getExcelContentOption(option) {
        return this.$(`//div[text()='${option}']`);
    }

    getOKButton() {
        return this.$(`//button[text()='OK']`);
    }

    getShowFiltersCheckbox() {
        return this.$('//label[contains(text(), "filters")]');
    }

    async openRangeDropdown() {
        await this.click({ elem: this.getExcelRangeSetting() });
    }

    async openContentDropdown() {
        await this.click({ elem: this.getExcelContentSetting() });
    }

    async selectExcelRange(option) {
        await this.click({elem: this.getExcelRangeOption(option)});
    }

    async selectExcelContent(option) {
        await this.click({elem: this.getExcelContentOption(option)});
    }

    async clickShowFiltersCheckbox() {
        await this.click({elem: this.getShowFiltersCheckbox()});
    }

    async clickOKButton() {
        await this.click({ elem: this.getOKButton() });
    }

    async clickReactDropdownOption(dropdownLabel, optionText) {
        const dropdown = await $$(
            `//label[normalize-space(text())='${dropdownLabel}']/..//div[contains(@class,'mstr-docprops-shared-select-withlabel')]`
        );
        let visiblePulldown;
        for (const el of dropdown) {
            if (await el.isDisplayed()) {
                visiblePulldown = el;
                break;
            }
        }

        if (!visiblePulldown) {
            throw new Error('No visible pulldown found');
        }

        await visiblePulldown.scrollIntoView();
        await visiblePulldown.waitForClickable({ timeout: 5000 });
        await visiblePulldown.click();

        const optionSelector = `//div[contains(@class,'mstr-docprops-shared-select-withlabel-dropdown__dropdown-list')]//div[contains(@class,'mstr-rc-base-dropdown__option-text')and .//span[normalize-space(.)='${optionText}']]`;

        await browser.waitUntil(
            async () => {
                const elems = await $$(optionSelector);
                return elems.length > 0;
            },
            { timeout: 5000, timeoutMsg: `Option "${optionText}" not found` }
        );

        const options = await $$(optionSelector);
        for (const opt of options) {
            if (await opt.isDisplayed()) {
                try {
                    await opt.scrollIntoView();
                    await opt.click();
                    return;
                } catch (err) {
                    await browser.execute((el) => {
                        el.scrollIntoView({ block: 'center' });
                        el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                        el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
                        el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                    }, opt);
                    return;
                }
            }
        }

        throw new Error(`Visible option "${optionText}" not found in dropdown "${dropdownLabel}"`);
    }

    async clickReactShowFiltersCheckbox() {
        const checkbox = await $('//label[contains(text(),"filters")]/ancestor::*[1]//input');
        await checkbox.click();
    }
}