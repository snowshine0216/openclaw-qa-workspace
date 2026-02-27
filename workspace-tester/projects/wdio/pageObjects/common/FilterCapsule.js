import BasePage from '../base/BasePage.js';

export default class FilterCapsule extends BasePage {
    // Element locator
    getCapsuleList(filterElementFinder) {
        return filterElementFinder.$$('.mstrd-FilterCapsule,.mstrd-CalStyleFilterItemContainer-error');
    }

    getCapsuleByOrder({ filterElementFinder, index }) {
        return this.getCapsuleList(filterElementFinder)[index];
    }


    getCapsuleIconByOrder({ filterElementFinder, index }) {
        return this.getCapsuleList(filterElementFinder)[index].$('.icon-auto');
    }

    getCapsuleByName({ filterElementFinder, name }) {
        return this.getCapsuleList(filterElementFinder).filter(async (elem) => {
            const filterName = await elem.getText();
            return filterName.trim() === name.trim();
        })[0];
    }

    getFilterSummaryCloseIcon(inputElement) {
        return inputElement.$(
            '.mstrd-FilterCapsule-filterSummaryIcon.icon-pnl_delete-capsule, .mstrd-SliderSummary-icon.icon-pnl_delete-capsule'
        );
    }

    getFilterSummaryText(inputElement) {
        return inputElement.$('.mstrd-FilterCapsule-summaryText');
    }

    // Action helper

    async removeCapsuleByName({ filterElementFinder, name }) {
        await this.click({
            elem: this.getFilterSummaryCloseIcon(this.getCapsuleByName({ filterElementFinder, name })),
        });
        return this.waitForElementInvisible(this.getCapsuleByName({ filterElementFinder, name }), {
            timeout: 1000,
            msg: 'Capsule has not been removed.',
        });
    }

    async removeCapsuleByOrder({ filterElementFinder, index }) {
        await this.waitForElementVisible(this.getCapsuleByOrder({ filterElementFinder, index }));
        await this.waitForElementClickable(this.getFilterSummaryCloseIcon(this.getCapsuleByOrder({ filterElementFinder, index })));
        await this.getFilterSummaryCloseIcon(this.getCapsuleByOrder({ filterElementFinder, index })).click();
        return this.waitForElementInvisible(this.getCapsuleByOrder({ filterElementFinder, index }), {
            timeout: 1000,
            msg: 'Capsule has not been removed.',
        });
    }

    async highlightCapsuleByName({ filterElementFinder, name }) {
        return this.getCapsuleByName({ filterElementFinder, name }).click();
    }

    // Assertion helper

    async capsuleCount(filterElementFinder) {
        return this.getCapsuleList(filterElementFinder).length;
    }

    async capsuleName({ filterElementFinder, index }) {
        return this.getCapsuleByOrder({ filterElementFinder, index }).getText();
    }

    async isCapsulePresent({ filterElementFinder, name }) {
        return this.getCapsuleByName({ filterElementFinder, name }).isDisplayed();
    }

    async isCapsuleHighlighted({ filterElementFinder, name }) {
        const color = await this.getCapsuleByName({ filterElementFinder, name }).getCSSProperty('background-color');
        return color === 'rgba(17, 131, 204, 0.6)';
    }

    async isCapsuleExcluded({ filterElementFinder, name }) {
        const textDecoCss = (
            await this.getFilterSummaryText(this.getCapsuleByName({ filterElementFinder, name })).getCSSProperty(
                'text-decoration'
            )
        ).value;
        return textDecoCss.includes('line-through');
    }

    async isCapsuleExcludedByOrder({ filterElementFinder, index }) {
        const textDecoCss = await this.getFilterSummaryText(
            this.getCapsuleByOrder({ filterElementFinder, index })
        ).getCSSProperty('text-decoration');
        return textDecoCss.value.includes('line-through');
    }

    async isCapsuleDynamicByOrder({ filterElementFinder, index }) {
        return this.getCapsuleIconByOrder({ filterElementFinder, index }).isDisplayed();
    }
}
