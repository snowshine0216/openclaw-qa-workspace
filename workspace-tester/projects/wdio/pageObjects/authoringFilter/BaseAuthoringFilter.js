import BasePage from '../base/BasePage.js';

export default class BaseAuthoringFilters extends BasePage {
    // element locator
    getFilterByName(filterName) {
        return this.$$(
            '.mstrmojo-VIPanel.mstrmojo-VIPanelPortlet, .mstrmojo-UnitContainer.mstrmojo-UnitContainer-root.mstrmojo-FilterBox'
        ).filter(async (elem) => {
            const elemText = await elem.$('.mstrmojo-EditableLabel').getText();
            return elemText.includes(filterName);
        })[0];
    }

    getAuthoringWaitLoading() {
        return this.$('.mstrmojo-Editor.mstrWaitBox.modal');
    }
}
