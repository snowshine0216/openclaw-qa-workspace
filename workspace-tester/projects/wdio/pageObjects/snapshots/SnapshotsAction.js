import SnapshotsGrid from './SnapshotsGrid.js';
import DossierPage from '../dossier/DossierPage.js';

export default class SnapshotsAction extends SnapshotsGrid {
    constructor() {
        super();
        this.snapshotsGrid = new SnapshotsGrid();
        this.dossierPage = new DossierPage();
    }

    // ============================================================================
    // ACTION BAR LOCATORS
    // ============================================================================

    getActionBar(row) {
        return row.$('.mstrd-DossierRowActionBar');
    }

    getRenameButton(row) {
        // return this.getActionBar(row).$('[aria-label="Rename"]');
        return row.$('[aria-label="Rename"]');
    }

    getDeleteButton(row) {
        return this.getActionBar(row).$('[aria-label="Delete"]');
    }

    getFavoriteButton(row) {
        return this.getActionBar(row).$('.mstrd-DossierRowActionBar-favoriteIcon');
    }

    getAddToFavoritesButton(row) {
        return this.getActionBar(row).$('[aria-label="Add to Favorites"]');
    }

    getRemoveFromFavoritesButton(row) {
        return this.getActionBar(row).$('[aria-label="Remove from Favorites"]');
    }

    // ============================================================================
    // DIALOG AND UI LOCATORS
    // ============================================================================

    getConfirmDeleteButton() {
        return this.$('[role="dialog"] .mstrd-Button--outline');
    }

    getCancelButton() {
        return this.$('[role="dialog"] button:last-child');
    }

    getTextbox(nameCell) {
        return nameCell.$('input.mstr-rc-input');
    }

    getTooltip() {
        return this.$('[role="tooltip"], .tooltip, .error-tooltip');
    }

    getFavoritesSection() {
        return this.$('row:has-text("Favorites")');
    }

    // ============================================================================
    // SNAPSHOT ACTIONS
    // ============================================================================

    async openSnapshotByName(name, waitForLoading = false) {
        await this.click({ elem: await this.snapshotsGrid.getSnapshotRowByName(name) });
        if (waitForLoading) {
            await this.dossierPage.waitForDossierLoading();
        }
    }

    async openSnapshotByIndex(index, waitForLoading = false) {
        const row = await this.snapshotsGrid.getSnapshotRowByIndex(index);
        if (!row) {
            throw new Error(`Snapshot with index "${index}" not found`);
        }
        const nameCell = this.snapshotsGrid.getNameCell(row);
        await this.click({ elem: nameCell });
        if (waitForLoading) {
            await this.dossierPage.waitForDossierLoading();
        }
    }

    async renameSnapshotByName(currentName, newName) {
        const row = await this.hoverOnSnapshotByName(currentName);
        const renameButton = this.getRenameButton(row);
        await this.click({ elem: renameButton });
        await this.typeKeyboard(newName);
        await browser.keys('Enter');
        const textbox = await this.getTextbox(row);
        await this.waitForElementInvisible(textbox);
        await this.sleep(500);
    }

    async deleteSnapshotByName(name, confirmDelete = true) {
        const row = await this.hoverOnSnapshotByName(name);

        const deleteButton = this.getDeleteButton(row);
        await this.click({ elem: deleteButton });

        if (confirmDelete) {
            // Wait for confirmation dialog and confirm
            await this.sleep(500); // Wait for dialog to appear
            const confirmButton = this.getConfirmDeleteButton();
            await this.click({ elem: confirmButton });
        }
        await this.sleep(500);
    }

    async deleteSnapshotByIndex(index, confirmDelete = true) {
        const row = await this.snapshotsGrid.getSnapshotRowByIndex(index);
        if (!row) {
            throw new Error(`Snapshot with index "${index}" not found`);
        }

        // Hover to show the delete button
        await this.hover({ elem: row });
        await this.sleep(500);

        const deleteButton = this.getDeleteButton(row);
        await this.click({ elem: deleteButton });

        if (confirmDelete) {
            // Wait for confirmation dialog and confirm
            await this.sleep(500); // Wait for dialog to appear
            const confirmButton = this.getConfirmDeleteButton();
            await this.click({ elem: confirmButton });
        }
    }

    // ============================================================================
    // FAVORITES ACTIONS
    // ============================================================================

    async addSnapshotToFavorites(name) {
        const row = await this.hoverOnSnapshotByName(name);
        const addFavButton = this.getAddToFavoritesButton(row);
        await this.click({ elem: addFavButton });
        await this.sleep(500);
    }

    async removeSnapshotFromFavorites(name) {
        const row = await this.hoverOnSnapshotByName(name);
        const removeFavButton = this.getRemoveFromFavoritesButton(row);
        await this.click({ elem: removeFavButton });
    }

    async addSnapshotToFavoritesByIndex(index) {
        const row = await this.snapshotsGrid.getSnapshotRowByIndex(index);
        if (!row) {
            throw new Error(`Snapshot with index "${index}" not found`);
        }

        // Hover to show action buttons
        await this.hover({ elem: row });
        await this.sleep(500);

        const addFavButton = this.getAddToFavoritesButton(row);
        await this.click({ elem: addFavButton });
        return true;
    }

    // ============================================================================
    // SELECTION ACTIONS
    // ============================================================================

    async hoverOnSnapshotByName(name) {
        const row = await this.snapshotsGrid.getSnapshotRowByName(name);
        if (!row) {
            throw new Error(`Snapshot with name "${name}" not found`);
        }
        await this.hover({ elem: row });
        return row;
    }

    async selectSnapshotByName(name) {
        const row = await this.snapshotsGrid.getSnapshotRowByName(name);
        if (!row) {
            throw new Error(`Snapshot with name "${name}" not found`);
        }

        // Click on the row to select it (not on name cell to avoid opening)
        await this.click({ elem: row });
        await this.waitDocumentToBeLoaded();
    }

    async selectSnapshotByIndex(index) {
        const row = await this.snapshotsGrid.getSnapshotRowByIndex(index);
        if (!row) {
            throw new Error(`Snapshot with index "${index}" not found`);
        }

        // Click on the row to select it
        await this.click({ elem: row });
        await this.waitDocumentToBeLoaded();
    }

    async selectMultipleSnapshotsByNames(snapshotNames) {
        if (snapshotNames.length === 0) return;

        // Select first snapshot
        await this.selectSnapshotByName(snapshotNames[0]);

        // Ctrl+click additional snapshots
        for (let i = 1; i < snapshotNames.length; i++) {
            const row = await this.snapshotsGrid.getSnapshotRowByName(snapshotNames[i]);
            if (row) {
                await this.ctrlClick({ elem: row });
            }
        }
        await this.waitDocumentToBeLoaded();
    }

    async selectMultipleSnapshotsByIndices(indices) {
        if (indices.length === 0) return;

        // Select first snapshot
        await this.selectSnapshotByIndex(indices[0]);

        // Ctrl+click additional snapshots
        for (let i = 1; i < indices.length; i++) {
            const row = await snapshotsGrid.getSnapshotRowByIndex(indices[i]);
            if (row) {
                await this.ctrlClick({ elem: row });
            }
        }
        await this.waitDocumentToBeLoaded();
    }

    // ============================================================================
    // ERROR HANDLING ACTIONS
    // ============================================================================

    async hoverOnErrorStatus(snapshotsGrid) {
        const errorSnapshot = await snapshotsGrid.getSnapshotWithErrorStatus();
        if (errorSnapshot) {
            const statusCell = snapshotsGrid.getStatusCell(errorSnapshot.row);
            await this.hover({ elem: statusCell });
            return true;
        }
        return false;
    }

    async getErrorTooltipText() {
        // Wait for tooltip to appear after hover
        await this.sleep(1000);
        const tooltip = this.getTooltip();
        try {
            return await tooltip.getText();
        } catch {
            return null;
        }
    }

    async getSnapShotErrorMsgByName(snapshotsGrid, name) {
        const status = await snapshotsGrid.getSnapshotStatusByName(name);

        if (!status || !status.toLowerCase().includes('error')) {
            return null;
        }

        const row = await snapshotsGrid.getSnapshotRowByName(name);
        if (!row) {
            return null;
        }

        // Hover on the error status to get tooltip
        const statusCell = snapshotsGrid.getStatusCell(row);
        await this.hover({ elem: statusCell });
        await this.sleep(1000); // Wait for tooltip to appear

        try {
            const tooltip = this.getTooltip();
            return await tooltip.getText();
        } catch {
            return null;
        }
    }

    // ============================================================================
    // BULK ACTIONS
    // ============================================================================

    async deleteMultipleSnapshotsByNames(snapshotsGrid, snapshotNames, confirmDelete = true) {
        await this.selectMultipleSnapshotsByNames(snapshotsGrid, snapshotNames);

        // Assuming there's a bulk delete option after selection
        // This would need to be adjusted based on actual UI implementation
        const firstRow = await snapshotsGrid.getSnapshotRowByName(snapshotNames[0]);
        await this.hover({ elem: firstRow });
        await this.sleep(500);

        const deleteButton = snapshotsGrid.getDeleteButton(firstRow);
        await this.click({ elem: deleteButton });

        if (confirmDelete) {
            await this.sleep(500);
            const confirmButton = this.getConfirmDeleteButton();
            await this.click({ elem: confirmButton });
        }
    }

    async addMultipleSnapshotsToFavorites(snapshotsGrid, snapshotNames) {
        const results = [];
        for (const name of snapshotNames) {
            try {
                const result = await this.addSnapshotToFavorites(snapshotsGrid, name);
                results.push({ name, success: result });
            } catch (error) {
                results.push({ name, success: false, error: error.message });
            }
        }
        return results;
    }

    // ============================================================================
    // NAVIGATION AND UTILITY ACTIONS
    // ============================================================================

    async expandCollapseSnapshotsGroup(snapshotsGrid) {
        const expandCollapseIcon = snapshotsGrid.getExpandCollapseIcon();
        await this.click({ elem: expandCollapseIcon });
        await this.waitDocumentToBeLoaded();
    }

    async refreshSnapshotsGrid() {
        // Refresh the page or trigger grid refresh
        await this.refresh();
        await this.waitDocumentToBeLoaded();
    }

    async waitForSnapshotStatusChange(snapshotsGrid, name, expectedStatus, timeoutMs = 30000) {
        const startTime = Date.now();
        while (Date.now() - startTime < timeoutMs) {
            const currentStatus = await snapshotsGrid.getSnapshotStatusByName(name);
            if (currentStatus && currentStatus.toLowerCase().includes(expectedStatus.toLowerCase())) {
                return true;
            }
            await this.sleep(1000); // Wait 1 second before checking again
        }
        return false;
    }

    async waitForSnapshotToAppear(snapshotsGrid, name, timeoutMs = 10000) {
        const startTime = Date.now();
        while (Date.now() - startTime < timeoutMs) {
            const isVisible = await snapshotsGrid.isSnapshotVisible(name);
            if (isVisible) {
                return true;
            }
            await this.sleep(500);
        }
        return false;
    }

    async waitForSnapshotToDisappear(snapshotsGrid, name, timeoutMs = 10000) {
        const startTime = Date.now();
        while (Date.now() - startTime < timeoutMs) {
            const isVisible = await snapshotsGrid.isSnapshotVisible(name);
            if (!isVisible) {
                return true;
            }
            await this.sleep(500);
        }
        return false;
    }

    // ============================================================================
    // FAVORITES UTILITY ACTIONS
    // ============================================================================

    async getFavoritesCount() {
        try {
            const favoritesSection = this.getFavoritesSection();
            const text = await favoritesSection.getText();
            const match = text.match(/Favorites \((\d+)\)/);
            return match ? parseInt(match[1]) : 0;
        } catch {
            return 0;
        }
    }

    async isFavoriteButtonDisplayed(name) {
        const row = await this.hoverOnSnapshotByName(name);
        const favoriteButton = this.getFavoriteButton(row);
        return favoriteButton.isDisplayed();
    }
}
