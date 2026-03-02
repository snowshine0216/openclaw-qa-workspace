import BaseLibrary from '../base/BaseLibrary.js';

export default class SnapshotsGrid extends BaseLibrary {
    constructor() {
        super();
    }

    // ============================================================================
    // GRID STRUCTURE LOCATORS
    // ============================================================================

    getCenterColsContainer() {
        return this.$('.ag-center-cols-container');
    }

    getFullWidthContainer() {
        return this.$('.ag-full-width-container');
    }

    // ============================================================================
    // ROW LOCATORS
    // ============================================================================

    getAllSnapshotRows() {
        return this.$$('.ag-row[role="row"]:not(.ag-row-group)');
    }

    getSnapshotRowByIndex(index) {
        return this.getAllSnapshotRows()[index];
    }

    async getGroupRow() {
        return this.getFullWidthContainer().$$('.ag-row-group');
    }

    getGroupTitle(group) {
        return group.$('.mstrd-AGCustomGroupRow-title');
    }

    async getGroupTitleText(group) {
        const titleElement = this.getGroupTitle(group);
        return await titleElement.getText();
    }

    async getFavoritesGroupTitleText() {
        const favoritesGroup = await this.getFavoritesGroup();
        return await this.getGroupTitleText(favoritesGroup);
    }

    async getSnapshotsGroupTitleText() {
        const snapshotsGroup = await this.getSnapshotsGroup();
        return await this.getGroupTitleText(snapshotsGroup);
    }

    async getFavoritesGroup() {
        const allGroups = await this.getGroupRow();
        for (const group of allGroups) {
            const titleElement = this.getGroupTitle(group);
            const titleText = await titleElement.getText();
            if (titleText.includes('Favorites')) {
                return group;
            }
        }
        return null;
    }

    async getSnapshotsGroup() {
        const allGroups = await this.getGroupRow();
        for (const group of allGroups) {
            const titleElement = this.getGroupTitle(group);
            const titleText = await titleElement.getText();
            if (titleText.includes('Snapshots')) {
                return group;
            }
        }
        return null;
    }

    getFavoritesExpandCollapseIcon() {
        return this.getFavoritesGroup().$('.ag-icon-chevron-down');
    }

    getSnapshotsExpandCollapseIcon() {
        return this.getSnapshotsGroup().$('.ag-icon-chevron-down');
    }

    // ============================================================================
    // CELL LOCATORS BY COLUMN ID
    // ============================================================================

    getNameCell(row) {
        return row.$('[col-id="name"]');
    }

    getContentCell(row) {
        return row.$('[col-id="content"]');
    }

    getStatusCell(row) {
        return row.$('[col-id="status"]');
    }

    getDateCreatedCell(row) {
        return row.$('[col-id="createdTimeFormatted"]');
    }


    // ============================================================================
    // SPECIFIC ELEMENT LOCATORS
    // ============================================================================

    getSnapshotName(row) {
        return this.getNameCell(row).$('.mstrd-DossierItemRow-name');
    }

    getSnapshotIcon(row) {
        return this.getNameCell(row).$('.mstrd-DossierItemRow-snapshotIcon');
    }

    getContentIcon(row) {
        return this.getContentCell(row).$('.mstrd-ObjectTypeIcon .mstr-icons-lib-icon');
    }

    getContentText(row) {
        return this.getContentCell(row).$('.mstrd-SnapshotContentCellRenderer-content .mstrd-Highlight');
    }

    getStatusIcon(row) {
        return this.getStatusCell(row).$('.mstrd-SnapshotStatusCellRenderer-contentContainer span[class*="icon-"]');
    }

    getStatusText(row) {
        return this.getStatusCell(row).$('.mstrd-SnapshotStatusCellRenderer-content');
    }

    getSnapshotLink(row) {
        return row.$('.mstrd-DossierItemRow-linkOverlay');
    }

    getUnreadIndicator(row) {
        return this.getStatusCell(row).$('.mstrd-DotIcon');
    }

    // ============================================================================
    // HELPER METHODS
    // ============================================================================

    async getSnapshotRowByName(name) {
        const rows = await this.getAllSnapshotRows();
        for (const row of rows) {
            const nameElement = this.getSnapshotName(row);
            const nameText = await nameElement.getText();
            if (nameText.trim() === name) {
                return row;
            }
        }
        return null;
    }

    async getSnapshotsCount(section = 'Snapshots') {
        let countText = '';
        if (section === 'Favorites') {
            countText = await this.getFavoritesGroupTitleText();
        } else {
            countText = await this.getSnapshotsGroupTitleText();
        }
        const match = countText.match(new RegExp(`${section} \\((\\d+)\\)`));
        return match ? parseInt(match[1]) : 0;
    }

    async getSnapshotNames() {
        const rows = await this.getAllSnapshotRows();
        const names = [];
        for (const row of rows) {
            const nameElement = this.getSnapshotName(row);
            const name = await nameElement.getText();
            names.push(name.trim());
        }
        return names;
    }

    async getSnapshotUnreadStatusByName(name) {
        const row = await this.getSnapshotRowByName(name);
        if (!row) {
            return null;
        }
        const unreadIndicator = this.getUnreadIndicator(row);
        return await unreadIndicator.isDisplayed();
    }

    async getSnapshotStatuses() {
        const rows = await this.getAllSnapshotRows();
        const statuses = [];
        for (const row of rows) {
            const statusElement = this.getStatusText(row);
            const status = await statusElement.getText();
            statuses.push(status.trim());
        }
        return statuses;
    }

    async getSnapshotDates() {
        const rows = await this.getAllSnapshotRows();
        const dates = [];
        for (const row of rows) {
            const dateCell = this.getDateCreatedCell(row);
            const date = await dateCell.getText();
            dates.push(date.trim());
        }
        return dates;
    }

    async getSnapshotContentTypes() {
        const rows = await this.getAllSnapshotRows();
        const contentTypes = [];
        for (const row of rows) {
            const contentIcon = this.getContentIcon(row);
            const ariaLabel = await contentIcon.getAttribute('aria-label');
            contentTypes.push(ariaLabel);
        }
        return contentTypes;
    }

    async getSnapshotContentByName(name) {
        const row = await this.getSnapshotRowByName(name);
        if (!row) {
            return null;
        }
        const contentElement = this.getContentText(row);
        const content = await contentElement.getText();
        return content.trim();
    }

    async getSnapshotStatusByName(name) {
        const row = await this.getSnapshotRowByName(name);
        if (!row) {
            return null;
        }
        const statusElement = this.getStatusText(row);
        const status = await statusElement.getText();
        return status.trim();
    }

    async getSnapshotTypeByName(name) {
        const row = await this.getSnapshotRowByName(name);
        if (!row) {
            return null;
        }
        const contentIcon = this.getContentIcon(row);
        const ariaLabel = await contentIcon.getAttribute('aria-label');
        return ariaLabel;
    }

    async getSnapshotNamesByStatus(status) {
        const rows = await this.getAllSnapshotRows();
        const names = [];
        for (const row of rows) {
            const statusElement = this.getStatusText(row);
            const rowStatus = await statusElement.getText();
            if (rowStatus.toLowerCase().includes(status.toLowerCase())) {
                const nameElement = this.getSnapshotName(row);
                const name = await nameElement.getText();
                names.push(name.trim());
            }
        }
        return names;
    }

    // ============================================================================
    // Action Methods
    // ============================================================================

    async hoverOnSnapshotStatusIcon(name) {
        const row = await this.getSnapshotRowByName(name);
        if (!row) {
            return null;
        }
        const errorIcon = this.getStatusIcon(row);
        await this.hover({ elem: errorIcon });
    }

    // ============================================================================
    // VISIBILITY AND STATE METHODS
    // ============================================================================

    async isSnapshotInFavorites(name) {
        const row = await this.getSnapshotRowByName(name);
        if (!row) {
            return false;
        }

        // Check if remove from favorites button is present (indicating it's favorited)
        try {
            const removeFavButton = this.getRemoveFromFavoritesButton(row);
            return await removeFavButton.isDisplayed();
        } catch {
            return false;
        }
    }

    async isGridEmpty() {
        const rows = await this.getAllSnapshotRows();
        return rows.length === 0;
    }

    async isSnapshotVisible(snapshotName) {
        const row = await this.getSnapshotRowByName(snapshotName);
        return row !== null;
    }
}
