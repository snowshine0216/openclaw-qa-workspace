import BasePage from '../../base/BasePage.js';
import LoadingDialog from '../../dossierEditor/components/LoadingDialog.js';

export default class FormatPanelForGridGeneral extends BasePage {
    /**
     * element
     */

    constructor() {
        super();
        this.loadingDialog = new LoadingDialog();
    }

    get bandingCheckbox() {
        return this.$(
            `//div[contains(@class, 'checkLabel') and position()=1]//div[contains(@class, 'mstrmojo-Label')]`
        );
    }

    get outlineCheckbox() {
        return this.$(
            `//div[contains(@class, 'checkLabel') and position()=2]//div[contains(@class, 'mstrmojo-Label')]`
        );
    }

    getGridTemplateColor(color) {
        return this.$(
            `//div[contains(@class, 'gt-color')]//div[contains(@class, 'item') and contains(@class, '${color}')]`
        );
    }

    getGridStyle(style) {
        return this.$(
            `//div[contains(@class, 'gt-style')]//div[contains(@class, 'item') and contains(@class, '${style}')]`
        );
    }

    get gridPaddingList() {
        return this.$(`//div[contains(@class, 'mstrmojo-ui-ButtonBar') and contains(@class, 'cellPadding')]`);
    }

    get gridPaddingSmall() {
        return this.gridPaddingList.$(`.//div[contains(@class, 'small')]`);
    }

    get gridPaddingMedium() {
        return this.gridPaddingList.$(`.//div[contains(@class, 'medium')]`);
    }

    get gridPaddingLarge() {
        return this.gridPaddingList.$(`.//div[contains(@class, 'large')]`);
    }

    get gridColumnsFitPulldown() {
        return this.$(
            `//div[contains(@class, 'mstrmojo-ui-XtabResize')]//div[position()=2 and contains(@class, 'mstrmojo-ui-Pulldown')]`
        );
    }

    get gridRowsFitPulldown() {
        return this.$(
            `//div[contains(@class, 'mstrmojo-ui-XtabResize')]//div[position()=5 and contains(@class, 'mstrmojo-ui-Pulldown')]`
        );
    }

    getGridFitOption(fit) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-popup-widget-hosted') and contains(@class, 'mstrmojo-ui-Pulldown') and not(contains(@style, 'display: none'))]//div[contains(@class, 'mstrmojo-PopupList')]//div[text()='${fit}']`
        );
    }

    get gridColumnsFitFixedPulldown() {
        return this.$(
            `//div[contains(@class, 'mstrmojo-ui-XtabResize')]//div[position()=3 and contains(@class, 'mstrmojo-vi-TwoColumnProp')]//div[contains(@class, 'mstrmojo-ui-Pulldown') and not(contains(@class, 'mstrmojo-ui-Pulldown-text'))]`
        );
    }

    getGridColumnsFitFixedTarget(option) {
        return this.gridColumnsFitFixedPulldown.$(`.//div[contains(@class, 'item') and text()='${option}']`);
    }

    get gridColumnsFitFixedInches() {
        return this.$(
            `//div[contains(@class, 'mstrmojo-ui-XtabResize')]//div[position()=3 and contains(@class, 'mstrmojo-vi-TwoColumnProp')]//input[contains(@class, 'mstrmojo-TextBox')]`
        );
    }

    get gridRowsFitFixedInches() {
        return this.$(
            `//div[contains(@class, 'mstrmojo-ui-XtabResize')]//div[position()=6 and contains(@class, 'mstrmojo-vi-TwoColumnProp')]//input[contains(@class, 'mstrmojo-TextBox')]`
        );
    }

    get MoreOptionsButtonAtTheBottom() {
        return this.$(
            `//div[contains(@class, 'mstrmojo-VIBoxPanel-content')]//div[contains(@class, 'mstrmojo-Label') and text() ='More Options']`
        );
    }

    /** Action method */

    async clickMoreOptionsButtonInFormatPanel() {
        await this.click({ elem: this.MoreOptionsButtonAtTheBottom });
    }

    async checkBanding() {
        await this.click({ elem: this.bandingCheckbox });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(10);
    }

    async checkOutline() {
        await this.click({ elem: this.outlineCheckbox });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(10);
    }

    async selectGridTemplateColor(color) {
        await this.click({ elem: this.getGridTemplateColor(color) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(10);
    }

    async selectGridStyle(style) {
        await this.click({ elem: this.getGridStyle(style) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(10);
    }

    async selectGridPadding(padding) {
        let elPaddingBtn;
        switch (padding.toLowerCase()) {
            case 'small':
                elPaddingBtn = this.gridPaddingSmall;
                break;
            case 'medium':
                elPaddingBtn = this.gridPaddingMedium;
                break;
            case 'large':
                elPaddingBtn = this.gridPaddingLarge;
                break;
        }
        await this.click({ elem: elPaddingBtn });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(10);
    }

    async selectGridColumnsFit(fit) {
        await this.click({ elem: this.gridColumnsFitPulldown });
        const elFitOption = this.getGridFitOption(fit);
        await this.waitForElementVisible(elFitOption);
        await this.click({ elem: elFitOption });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(10);
    }

    async selectGridRowsFit(fit) {
        await this.click({ elem: this.gridRowsFitPulldown });
        const elFitOption = this.getGridFitOption(fit);
        await this.waitForElementVisible(elFitOption);
        await this.click({ elem: elFitOption });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(10);
    }

    async selectGridColumnsFitTarget(target) {
        await this.click({ elem: this.gridColumnsFitFixedPulldown });
        const elTargetOption = this.getGridColumnsFitFixedTarget(target);
        await this.waitForElementVisible(elTargetOption);
        await this.click({ elem: elTargetOption });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(10);
    }

    async setGridColumnsFitFixedInches() {
        const elInchesInput = this.gridColumnsFitFixedInches;
        await this.doubleClick({ elem: elInchesInput });
        await this.enter();
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(10);
    }

    async setGridRowsFitFixedInches() {
        const elInchesInput = this.gridRowsFitFixedInches;
        await this.doubleClick({ elem: elInchesInput });
        await this.enter();
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(10);
    }
}
