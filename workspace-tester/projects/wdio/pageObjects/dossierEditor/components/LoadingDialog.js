import BasePage from '../../base/BasePage.js';

export default class LoadingDialog extends BasePage {
    constructor() {
        super();
    }

    getLoadingDataPopUp() {
        return this.$(`//div[contains(@class, 'mstrWaitBox')]`);
    }

    getLoadingDataPopUpCloseIcon() {
        return this.loadingDataPopUp.$(`.//div[contains(@class, 'mstrIcon-close-wait')]`);
    }

    getLoadingDataPopUpDisplayed() {
        return this.$(`//div[contains(@class, 'mstrWaitBox')][contains(@style, 'display: block')]`);
    }

    getLoadingDataPopUpNotDisplayed() {
        return this.$(`//div[contains(@class, 'mstrWaitBox') and contains(@style, 'display: none')]`);
    }

    getLageLoadingNotDisplayed() {
        return this.$(`//div[@id = 'pageLoadingWaitBox'][contains(@style, 'display: none')]`);
    }

    getMstrWebWaitCurtainNotDisplayed() {
        return this.$(`//div[@id= 'mstrWeb_waitCurtain' and contains(@style, 'display: none')]`);
    }

    getMstrTabDisabledNotDisplayed() {
        return this.$(`//div[@class='mstrTabDisabled' and contains(@style, 'display: none')]`);
    }

    getLibraryLoading() {
        return this.$('.mstrd-LoadingIcon-content');
    }

    // Select Existing Dataset/Import Dossier
    getBookletLoader() {
        return this.$(`//div[@class='mstrmojo-BookletLoader' and contains(@style, 'left: -100%;')]`);
    }

    async waitLoadingDataPopUpIsNotDisplayed() {
        let popup = this.getLoadingDataPopUpDisplayed();

        if (await popup.isExisting()) {
            await this.waitForElementInvisible(popup);
            await this.waitForElementPresence(this.getLoadingDataPopUpNotDisplayed());
        }

        // Allow fraction for animation
        await this.sleep(200);
    }

    async waitPageLoadingDataPopUpIsNotDisplayed() {
        await this.waitForElementVisible(this.getPageLoadingNotDisplayed());
        // Allow fraction for animationz
        await this.sleep(200);
    }

    async waitmstrWebWaitCurtainNotDisplay() {
        await this.waitForElementVisible(this.getMstrWebWaitCurtainNotDisplayed());
        // Allow fraction for animation
        await this.sleep(500);
    }

    async waitmstrTabDisabledNotDisplay() {
        await waitForElementVisible(this.getMstrTabDisabledNotDisplayed());
        // Allow fraction for animation
        await this.sleep(500);
    }

    async waitLibraryLoadingIsNotDisplayed() {
        await this.waitForElementVisible(this.getLibraryLoading());
        // Allow fraction for animation
        await this.sleep(200);
    }

    async waitBooketLoaderIsNotDisplayed() {
        await this.waitForElementVisible(this.getBookletLoader());
        await this.sleep(200);
    }

    async waitVisibility(waitElement) {
        await this.waitForElementVisible(waitElement);
    }

    async waitForObjectBrowserContainerLoadingIsNotDisplayed() {
        // Wait for initial containers to be displayed
        await this.waitForElementVisible(await this.$('.report-editor-panel.report-editor-dataset'));
        await this.waitForElementInvisible(await this.$('.ant-spin-spinning'));
        //remove for 25.10 since it's not present anymore
        // await this.waitForElementVisible(await this.$('.tab-view-container'));
        // const tabViewContainer = await this.$('.tab-view-container');

        // // Get and wait for the activeTab element to be displayed
        // await this.waitForElementVisible(tabViewContainer.$('.tab-view-tab.active'));
        // const activeTab = await tabViewContainer.$('.tab-view-tab.active');

        // // Get the index of the active tab
        // const activeTabIndex = await this.getElementIndex(activeTab, tabViewContainer);

        // if (activeTabIndex === 0) {
        //     // For normal report (All tab selected)
        //     await this.waitForElementVisible(await this.$('.object-select-input'));
        //     await this.waitForElementInvisible(await this.$('.object-select-input.ant-spin-spinning'));
        // } else if (activeTabIndex === 1) {
        //     // For subset report (In Report tab selected)
        //     await this.waitForElementVisible(
        //         await this.$('.report-editor-panel.report-editor-dataset .mstr-input-container')
        //     );
        // }
        // await this.sleep(200);
    }

    async waitForReportLoadingIsNotDisplayed() {
        // wait for the report page loading disappeared
        await this.waitForElementInvisible(this.$('.mstrd-LoadingIcon-content.mstrd-LoadingIcon-content--visible'));
        // wait for the report little loading spinner disappeared
        await this.waitForElementInvisible(this.$('.mstrd-Spinner.mstrd-Loadable-icon'));
        // wait for the report view loading to be disappeared
        await this.waitForElementInvisible(this.$('.mstr-rc-loading-dot-icon'));
        await this.sleep(200);
    }

    async getElementIndex(element, parent) {
        const elements = await parent.$$('.tab-view-tab');
        for (let i = 0; i < elements.length; i++) {
            const currentElementId = await elements[i].elementId;
            const targetElementId = await element.elementId;
            const found = currentElementId === targetElementId;
            if (found) {
                return i;
            }
        }
        throw new Error('Element not found in parent');
    }
}

export const loadingDialog = new LoadingDialog();
