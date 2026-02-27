import BasePage from '../base/BasePage.js';

const TOGGLE_BAR_SELECTORS = {
    toc: '.item.tocPanel .btn',
    dataset: '.item.datasetsPanel .btn',
    edit: '.item.editPanel .btn',
    filter: '.item.filterPanel .btn',
    format: '.item.propertiesPanel .btn',
    layout: '.item.layersPanel .btn',
    theme: '.item.themesPanel .btn',
};

/**
 * ToggleBar page object class for toggle TOC/Dataset/Edit/Filter/Format/Layout/Theme panels
 * in Dossier Authoring Page
 */
export default class ToggleBar extends BasePage {
    // Element Locators
    getToggleButton(name) {
        return this.$(`.mstrmojo-RootView-togglebar ${TOGGLE_BAR_SELECTORS[name]}`);
    }

    // Action Methods
    async togglePanel(name) {
        const toggleButton = this.getToggleButton(name);
        await this.click({ elem: toggleButton });
        await this.sleep(500);
    }
}
