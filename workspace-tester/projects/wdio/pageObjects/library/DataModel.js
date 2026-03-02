import BaseLibrary from '../base/BaseLibrary.js';

export default class DataModel extends BaseLibrary {
    constructor() {
        super();
    }
    // Element locator
    getWaitMsg() {
        return this.$('.mstrmojo-Label.mstrWaitMsg');
    }

    getWaitCurtain() {
        return this.$('.mstrmojo-Box.mstrIcon-wait');
    }

    getDBSkeleton() {
        return this.$('.dbRoles-skeleton');
    }

    getWorkspaceLoading() {
        return this.$('.mstr-workspace-content-loading');
    }

    getDataTree() {
        return this.$$('.mstr-di-left-panel-aol-ol-object-row')[0];
    }

    getLibraryIcon() {
        return this.$('.mstr-di-toolbar__lib-icon');
    }

    getDataSourceContainer() {
        return this.$('.datasource-list-container');
    }

    getEmptyTablePnel() {
        return this.$('.auto-table-panel');
    }

    getDILeftPanel() {
        return this.$('.mstr-di-left-panel-aol-ol');
    }

    // Action helper
    async waitForDMCurtainDisappear() {
        await this.waitForElementInvisible(this.getWaitMsg());
        await this.waitForElementInvisible(this.getWaitCurtain());
        await this.waitForElementInvisible(this.getDBSkeleton());
        await this.waitForElementInvisible(this.getWorkspaceLoading());
    }

    async waitForNewDataModelLoading() {
        await this.waitForDMCurtainDisappear();
        await this.waitForElementVisible(this.getDataSourceContainer());
        await this.waitForElementVisible(this.getEmptyTablePnel());
        return this.sleep(500);
    }

    async waitForEditDataModelLoading() {
        await this.waitForDMCurtainDisappear();
        await this.waitForElementVisible(this.getDataTree());
        return this.sleep(500);
    }

    async clickLibraryIcon() {
        await this.getLibraryIcon().click();
        await this.waitForCurtainDisappear();
        await this.waitForLibraryLoading();
    }

    // Assertion helper
}
