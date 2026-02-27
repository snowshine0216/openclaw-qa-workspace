import BasePage from '../base/BasePage.js';
import { scrollElementToBottom, scrollElementToTop } from '../../utils/scroll.js';

export default class InfoWindowSnapshot extends BasePage {
    // CSS Locators
    getSnapshotContentTitle() {
        return this.$('.mstrd-SnapshotList-title');
    }

    getSnapshotSection() {
        return this.$('.mstrd-SnapshotList');
    }

    getSnapshotItems() {
        return this.getSnapshotSection().$$('.mstrd-SnapshotItem');
    }

    getLoadingButton() {
        return this.$('.mstrd-Spinner-blade');
    }

    getSnapshotIconInBookmarkDropDown() {
        return this.$('.mstrd-RecommendationsMainInfo-bookmarkOption .mstrd-SnapshotIconButton');
    }

    getSnapshotIconInInfoWindow() {
        return this.$('.mstrd-RecommendationsMainInfo-snapshot.mstrd-SnapshotIconButton');
    }

    get SnapshotError() {
        return this.getSnapshotSection().$('.mstrd-SnapshotItem-error-message');
    }

    get SnapshotListError() {
        return this.getSnapshotSection().$('.mstrd-SnapshotList-error');
    }

    getSnapshotTooltip() {
        return this.getSnapshotSection().$('.ant-tooltip-inner');
    }

    // CSS Property Getters
    async getSnapshotSectionBackgroundColor() {
        const bgColor = await this.getSnapshotSection().getCSSProperty('background-color');
        return bgColor.value;
    }

    async getSnapshotItemBackgroundColor({ name, index = 0 }) {
        return await this.getSnapshotItemCSSProperty({ name, index, property: 'background-color' });
    }

    async getSnapshotItemWidth({ name, index = 0 }) {
        return await this.getSnapshotItemCSSProperty({ name, index, property: 'width' });
    }

    async getSnapshotItemHeight({ name, index = 0 }) {
        return await this.getSnapshotItemCSSProperty({ name, index, property: 'height' });
    }

    async getSnapshotItemCSSProperty({ name, index = 0, property }) {
        const item = await this.getSnapshotItem({ name, index });
        if (!item) {
            throw new Error(`Snapshot item not found with name: ${name} or index: ${index}`);
        }
        const cssProperty = await item.getCSSProperty(property);
        return cssProperty.value;
    }

    async getSnapshotsItemCount() {
        return (await this.getSnapshotItems()).length;
    }

    // Element Getters
    async getSnapshotItem({ name, index = 0 }) {
        const items = await this.getSnapshotItems();

        if (name) {
            // When searching by name, we need to check each item
            for (const elem of items) {
                try {
                    const titleElem = await elem.$('.mstrd-SnapshotItem-title');
                    const elemText = await titleElem.getText();
                    if (elemText === name) {
                        return elem;
                    }
                } catch (error) {
                    console.log(`Error getting snapshot item text: ${error.message}`);
                }
            }
            return null; // Return null if no item with the given name was found
        }

        // When searching by index, just return that index if it exists
        return items[index] || null;
    }

    async getSnapshotTitle({ name, index = 0 }) {
        const item = await this.getSnapshotItem({ name, index });
        if (!item) {
            throw new Error(`Snapshot item not found`);
        }
        const titleElement = await item.$('.mstrd-SnapshotItem-title');
        if (!titleElement) {
            throw new Error(`Snapshot title element not found for item with name: ${name} or index: ${index}`);
        }
        return titleElement;
    }

    async getSnapshotEditButton({ name, index = 0 }) {
        const item = await this.getSnapshotItem({ name, index });
        if (!item) {
            throw new Error(`Snapshot item not found with name: ${name} or index: ${index}`);
        }
        const buttons = await item.$$('.mstrd-SnapshotItem-action-icon');
        for (const elem of buttons) {
            const elemText = await elem.getAttribute('aria-label');
            if (elemText === 'Edit') {
                return elem;
            }
        }
        return null;
    }

    async getSnapshotDeleteButton({ name, index = 0 }) {
        const item = await this.getSnapshotItem({ name, index });
        if (!item) {
            throw new Error(`Snapshot item not found with name: ${name} or index: ${index}`);
        }
        const buttons = await item.$$('.mstrd-SnapshotItem-action-icon');
        for (const elem of buttons) {
            const elemText = await elem.getAttribute('aria-label');
            if (elemText === 'Delete') {
                return elem;
            }
        }
        return null;
    }

    async getSnapshotDoneButton({ name, index = 0 }) {
        const item = await this.getSnapshotItem({ name, index });
        if (!item) {
            throw new Error(`Snapshot item not found with name: ${name} or index: ${index}`);
        }
        const buttons = await item.$$('.mstrd-SnapshotItem-action-icon');
        for (const elem of buttons) {
            const elemText = await elem.getAttribute('aria-label');
            if (elemText === 'Done') {
                return elem;
            }
        }
        return null;
    }

    async getSnapshotCancelButton({ name, index = 0 }) {
        const item = await this.getSnapshotItem({ name, index });
        if (!item) {
            throw new Error(`Snapshot item not found with name: ${name} or index: ${index}`);
        }
        const buttons = await item.$$('.mstrd-SnapshotItem-action-icon');
        for (const elem of buttons) {
            const elemText = await elem.getAttribute('aria-label');
            if (elemText === 'Cancel') {
                return elem;
            }
        }
        return null;
    }

    async getSnapshotInput({ name, index = 0 }) {
        const item = await this.getSnapshotItem({ name, index });
        if (!item) {
            throw new Error(`Snapshot item not found with name: ${name} or index: ${index}`);
        }
        return await item.$('input');
    }

    // Text and Error Getters
    async getSnapshotErrorText() {
        return this.SnapshotError.getText();
    }

    async getSnapshotListErrorText() {
        return this.SnapshotListError.getText();
    }

    async getSnapshotTitleText({ name, index = 0 }) {
        const titleElement = await this.getSnapshotTitle({ name, index });
        const text = await titleElement.getText();
        return text.trim();
    }

    async getSnapshotName({ name, index = 0 }) {
        const titleElement = await this.getSnapshotTitle({ name, index });
        const text = await titleElement.getText();
        return text.trim();
    }

    async getSnapshotTooltipText() {
        const tooltip = await this.getSnapshotTooltip();
        if (!tooltip) {
            console.log(`Snapshot tooltip not found`);
            return '';
        }
        return tooltip.getText();
    }

    /**
     * Gets the snapshots header text (e.g., "Snapshots (1)")
     * @returns {Promise<string>} The snapshots header text
     */
    async getSnapshotsHeader() {
        const headerElement = await this.getSnapshotSection().$('.mstrd-SnapshotList-title');
        return headerElement.getText();
    }

    /**
     * Gets the count of snapshot items
     * @returns {Promise<number>} The number of snapshot items
     */
    async getSnapshotItemCount() {
        const snapshotItems = await this.getSnapshotSection().$$('.mstrd-SnapshotItem');
        return snapshotItems.length;
    }

    /**
     * Gets the date and time of a specific snapshot
     * @param {number} index The zero-based index of the snapshot
     * @returns {Promise<string>} The date and time of the snapshot
     */
    async getSnapshotDateTime(index = 0) {
        const snapshotItems = await this.getSnapshotSection().$$('.mstrd-SnapshotItem');
        if (index >= snapshotItems.length) {
            throw new Error(`Snapshot item at index ${index} not found`);
        }
        const dateTimeElement = await snapshotItems[index].$('.mstrd-SnapshotItem-date-time');
        return dateTimeElement.getText();
    }

    // Action Methods
    async hoverOnSnapshotItem({ name, index = 0 }) {
        const item = await this.getSnapshotItem({ name, index });
        if (!item) {
            throw new Error(`Snapshot item not found with name: ${name} or index: ${index}`);
        }
        await this.hover({ elem: item });
    }

    async clickSnapshotCancelButton({ name, index = 0 }) {
        const cancelButton = await this.getSnapshotCancelButton({ name, index });
        await this.click({ elem: cancelButton });
    }

    async clickSnapshotDoneButton({ name, index = 0 }) {
        const doneButton = await this.getSnapshotDoneButton({ name, index });
        await this.click({ elem: doneButton });
    }

    async editSnapshotName({ name, index = 0, text = '', save = true }) {
        const input = await this.getSnapshotInput({ name, index });
        const isInputDisplayed = await input.isDisplayed();
        if (!isInputDisplayed) {
            await this.hoverOnSnapshotItem({ name, index });
            const editButton = await this.getSnapshotEditButton({ name, index });
            await this.click({ elem: editButton });
        }
        const newInput = await this.getSnapshotInput({ name, index });
        await this.clear({ elem: newInput });
        await newInput.setValue(text);
        if (save) {
            await this.clickSnapshotDoneButton({ name, index });
        }
    }

    async deleteSnapshot({ name, index = 0 }) {
        await this.hoverOnSnapshotItem({ name, index });
        const deleteButton = await this.getSnapshotDeleteButton({ name, index });
        await this.click({ elem: deleteButton });
        await this.sleep(500); // wait for animation
    }

    async openSnapshotFromInfoWindow({ name, index = 0 }) {
        const item = await this.getSnapshotItem({ name, index });
        await this.click({ elem: item });
    }

    async scrollSnapshotPanelToTop() {
        return scrollElementToTop(this.getSnapshotSection());
    }

    async scrollSnapshotPanelToBottom() {
        return scrollElementToBottom(this.getSnapshotItem({}));
    }

    // Assertion Methods
    async isSnapshotContentSectionPresent() {
        return this.getSnapshotSection().isDisplayed();
    }

    async waitForSnapshotSection() {
        await this.waitForElementVisible(this.getSnapshotSection());
    }

    async waitForExportLoadingButtonToDisappear(timeout = 60000) {
        const loadingButton = this.getLoadingButton();
        await browser.waitUntil(
            async () => {
                if (await loadingButton.isExisting()) {
                    return !(await loadingButton.isDisplayed());
                }
                // If element doesn't exist at all, also treat as invisible
                return true;
            },
            {
                timeout,
                timeoutMsg: 'Loading Button still exists after 60000 ms',
            }
        );
    }

    async isSnapshotIconInBookmarkDropDownExisting() {
        const icon = await this.getSnapshotIconInBookmarkDropDown();
        return icon.isExisting();
    }

    async isSnapshotIconInInfoWindowDisplayed() {
        const icon = await this.getSnapshotIconInInfoWindow();
        return icon.isDisplayed();
    }

    async clickSnapshotIconInInfoWindow() {
        const icon = await this.getSnapshotIconInInfoWindow();
        await this.click({ elem: icon });
    }

    async isSnapshotSectionVisible() {
        const section = await this.getSnapshotSection();
        return section.isDisplayed();
    }
}
