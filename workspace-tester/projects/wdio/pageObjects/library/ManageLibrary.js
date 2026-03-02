import BaseLibrary from '../base/BaseLibrary.js';

export default class ManageLibrary extends BaseLibrary {
    // Element Locators

    // The pencil icon to edit the dossier name
    getEditNameIcon(name) {
        return this.libraryItem.getItem(name).$('.mstrd-DossierItem-editIcon');
    }

    // The dossier/document name text node
    getItemName(name) {
        return this.libraryItem.getItem(name).$('.mstrd-DossierItem-nameText');
    }

    // The icon to select the dossier
    getSelectItemIcon(name) {
        return this.libraryItem.getItem(name).$('.mstrd-DossierItemIcon-selectAction');
    }

    getSelectedItem(name) {
        return this.libraryItem.getItem(name).$('.mstrd-DossierItemIcon-selectAction--selected');
    }

    // The "Remove" button to remove dossiers
    getRemoveButton() {
        return this.$('.delete-button');
    }

    getDeleteDossierDialog() {
        return this.$('.mstrd-ConfirmationDialog');
    }

    // The "Yes" button to confirm the removal
    getConfirmRemoveButton() {
        return this.getDeleteDossierDialog()
            .$$('button.mstrd-ConfirmationDialog-button')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === 'Yes';
            })[0];
    }

    // The "No" button to cancel the removal
    getCancelRemoveButton() {
        return this.getDeleteDossierDialog()
            .$$('button.mstrd-ConfirmationDialog-button')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === 'No';
            })[0];
    }

    getRemoveSpinner() {
        return this.$('.mstrd-ConfirmationDialog-spinner');
    }

    // The "Close" button to quit managing library
    getCloseButton() {
        return this.$('.mstrd-Button.mstrd-Button--primary');
    }

    // Internal method to get the button with specific text
    getButton(text) {
        return this.$$('button.mstrd-Button.mstrd-Button--clear').filter(async (btn) => {
            return (await btn.getText()) === text;
        })[0];
    }

    // The "Select All" button
    getSelectAllButton() {
        return this.getButton('Select All');
    }

    // The "Clear All" button
    getClearAllButton() {
        return this.getButton('Clear All');
    }

    // Actions

    async editName({ option, name, newName }) {
        if (option === 'icon') {
            await this.click({ elem: this.getEditNameIcon(name) });
        } else {
            await this.click({ elem: this.getItemName(name) });
        }
        await this.waitForElementInvisible(this.getEditNameIcon(name));
        await this.input(newName);
        await this.enter();
        // Wait until either the pencil icon or the tooltip appears.
        await browser.waitUntil(
            async () => {
                const namePresent = await this.getEditNameIcon(newName).isDisplayed();
                const tooltipPresent = await this.getTooltipContainer().isDisplayed();
                return namePresent || tooltipPresent;
            },
            { timeout: 3000, errorMessage: 'Editing dossier name takes too long.' }
        );
    }

    // Quit editing dossier name
    async cancelRename(name) {
        await this.esc();
        return this.waitForElementVisible(this.getEditNameIcon(name));
    }

    async selectItem(name) {
        await this.click({ elem: this.getSelectItemIcon(name) });
        return this.waitForElementVisible(this.getSelectedItem(name));
    }

    async deselectItem(name) {
        await this.getSelectItemIcon(name).click();
        return this.waitForElementInvisible(this.getSelectedItem(name));
    }

    async hitRemoveButton() {
        await this.click({ elem: this.getRemoveButton() });
        return this.waitForElementVisible(this.getConfirmRemoveButton());
    }

    async confirmRemoval() {
        await this.click({ elem: this.getConfirmRemoveButton() });
        await this.waitForElementInvisible(this.getRemoveSpinner());
        return this.waitForElementInvisible(this.getConfirmRemoveButton());
    }

    async cancelRemoval() {
        await this.click({ elem: this.getCancelRemoveButton() });
        return this.waitForElementInvisible(this.getCancelRemoveButton());
    }

    async closeManageMyLibrary() {
        await this.click({ elem: this.getCloseButton() });
        return this.waitForElementInvisible(this.getCloseButton());
    }

    async selectAll() {
        await this.click({ elem: this.getSelectAllButton() });
        await this.waitForDynamicElementLoading();
        const el = await this.getSelectAllButton();
        return el.waitForEnabled({
            reverse: true,
            msg: 'Select All button is still enabled.',
        });
    }

    async clearAll() {
        await this.click({ elem: this.getClearAllButton() });
        return this.getClearAllButton().waitForClickable({
            timeout: 1000,
            reverse: true,
            timeoutMsg: 'Clear All button is still enabled.',
        });
    }

    async hoverDossier(name) {
        await this.hover({ elem: this.getItemName(name) });
        await this.waitForElementVisible(this.getTooltipContainer(), {
            timeout: 5000,
            msg: 'Tooltip is not displayed.',
        });
        return this.sleep(3000); // Wait for animation to complete
    }

    // Assertions

    async isSelectAllEnabled() {
        return this.getSelectAllButton().isEnabled();
    }

    async isClearAllEnabled() {
        return this.getClearAllButton().isEnabled();
    }

    async isRemoveButtonEnabled() {
        return this.getRemoveButton().isEnabled();
    }

    async isItemSelected(name) {
        return this.getSelectedItem(name).isDisplayed();
    }

    async isEditNameIconClickable(name) {
        return this.getEditNameIcon(name).isDisplayed();
    }

    async isSelectItemIconClickable(name) {
        return this.getSelectItemIcon(name).isDisplayed();
    }

    // Get the count of selected dossier to remove
    async selectedItemCount() {
        const removeText = await this.getRemoveButton().getText();
        const parsedArray = /Remove \((\d+)\)/.exec(removeText);
        return parsedArray[1];
    }
}
