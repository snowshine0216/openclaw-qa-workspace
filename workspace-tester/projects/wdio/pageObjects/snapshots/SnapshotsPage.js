import BaseLibrary from '../base/BaseLibrary.js';
import LoadingDialog from '../dossierEditor/components/LoadingDialog.js';
import SnapshotsGrid from './SnapshotsGrid.js';
import SnapshotsAction from './SnapshotsAction.js';
import SnapshotsToolbar from './SnapshotsToolbar.js';

export default class SnapshotsPage extends BaseLibrary {
    constructor() {
        super();
        this.loadingDialog = new LoadingDialog();
        this.snapshotsGrid = new SnapshotsGrid(this);
        this.snapshotsAction = new SnapshotsAction();
        this.snapshotsToolbar = new SnapshotsToolbar();
    }

    // ============================================================================
    // DELEGATED GRID METHODS
    // ============================================================================

    // Grid locator methods - delegate to SnapshotsGrid
    getAllSnapshotRows() {
        return this.snapshotsGrid.getAllSnapshotRows();
    }

    getSnapshotRowByIndex(index) {
        return this.snapshotsGrid.getSnapshotRowByIndex(index);
    }

    async getSnapshotRowByName(name) {
        return await this.snapshotsGrid.getSnapshotRowByName(name);
    }

    // Grid information methods - delegate to SnapshotsGrid
    async getSnapshotsCount(section = 'Snapshots') {
        return await this.snapshotsGrid.getSnapshotsCount(section);
    }

    async getSnapshotNames() {
        return await this.snapshotsGrid.getSnapshotNames();
    }

    async getSnapshotStatuses() {
        return await this.snapshotsGrid.getSnapshotStatuses();
    }

    async getSnapshotDates() {
        return await this.snapshotsGrid.getSnapshotDates();
    }

    async getSnapshotContentTypes() {
        return await this.snapshotsGrid.getSnapshotContentTypes();
    }

    async getSnapshotContentByName(name) {
        return await this.snapshotsGrid.getSnapshotContentByName(name);
    }

    async getSnapShotStatusByName(name) {
        return await this.snapshotsGrid.getSnapshotStatusByName(name);
    }

    async getSnapshotTypeByName(name) {
        return await this.snapshotsGrid.getSnapshotTypeByName(name);
    }

    async hasUnreadIndicator(rowIndex) {
        return await this.snapshotsGrid.hasUnreadIndicator(rowIndex);
    }

    async hasUnreadIndicatorByName(name) {
        return await this.snapshotsGrid.hasUnreadIndicatorByName(name);
    }

    async getSnapshotWithRunningStatus() {
        return await this.snapshotsGrid.getSnapshotWithRunningStatus();
    }

    async getSnapshotWithErrorStatus() {
        return await this.snapshotsGrid.getSnapshotWithErrorStatus();
    }

    async hasSnapshotWithStatus(status) {
        return await this.snapshotsGrid.hasSnapshotWithStatus(status);
    }

    async getSnapshotNamesByStatus(status) {
        return await this.snapshotsGrid.getSnapshotNamesByStatus(status);
    }

    async isSnapshotOrderedByCreationTimeDesc() {
        return await this.snapshotsGrid.isSnapshotOrderedByCreationTimeDesc();
    }

    async verifySnapshotDetails(index, expectedName, expectedContentType, expectedStatus) {
        return await this.snapshotsGrid.verifySnapshotDetails(index, expectedName, expectedContentType, expectedStatus);
    }

    async isSnapshotInFavorites(name) {
        return await this.snapshotsGrid.isSnapshotInFavorites(name);
    }

    async isGridEmpty() {
        return await this.snapshotsGrid.isGridEmpty();
    }

    async isSnapshotVisible(snapshotName) {
        return await this.snapshotsGrid.isSnapshotVisible(snapshotName);
    }

    // ============================================================================
    // DELEGATED ACTION METHODS
    // ============================================================================

    // Snapshot opening actions - delegate to SnapshotsAction
    async openSnapshotByName(name, waitForLoading = false) {
        return await this.snapshotsAction.openSnapshotByName(name, waitForLoading);
    }

    // Snapshot modification actions - delegate to SnapshotsAction
    async renameSnapshotByName(currentName, newName) {
        return await this.snapshotsAction.renameSnapshotByName(currentName, newName);
    }

    async deleteSnapshotByName(name, confirmDelete = true) {
        return await this.snapshotsAction.deleteSnapshotByName(name, confirmDelete);
    }

    // Favorites actions - delegate to SnapshotsAction
    async addSnapshotToFavorites(name) {
        return await this.snapshotsAction.addSnapshotToFavorites(name);
    }

    async removeSnapshotFromFavorites(name) {
        return await this.snapshotsAction.removeSnapshotFromFavorites(name);
    }

    // Error handling actions - delegate to SnapshotsAction
    async hoverOnErrorStatus() {
        return await this.snapshotsAction.hoverOnErrorStatus();
    }

    async getErrorTooltipText() {
        return await this.snapshotsAction.getErrorTooltipText();
    }

    async getSnapShotErrorMsgByName(name) {
        return await this.snapshotsAction.getSnapShotErrorMsgByName(name);
    }

    // Utility actions - delegate to SnapshotsAction
    async getFavoritesCount() {
        return await this.snapshotsAction.getFavoritesCount();
    }

    // ============================================================================
    // CONVENIENCE METHODS (BACKWARDS COMPATIBILITY)
    // ============================================================================

    // These methods maintain backwards compatibility with existing tests
    async getSnapshotItemByName(name) {
        return await this.snapshotsGrid.getSnapshotRowByName(name);
    }

    async getSnapShotContentByName(name) {
        return await this.snapshotsGrid.getSnapshotContentByName(name);
    }
}
