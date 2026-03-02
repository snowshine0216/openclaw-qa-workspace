import WebBasePage from '../base/WebBasePage.js';

export default class BaseReportPanel extends WebBasePage {
    /**
     * report panel key-vallue pairs
     * TabsSelector[key] returns the key locator
     */
    static TabsSelector = {
        'Report Objects': ['#workingSetId_tab'],
        'All Objects': ['#tbObjBrwsrId_tab'],
        'MDX Objects': ['#mdxObjBrwsrId_tab'],
        Notes: ['#annotationsId_tab', '#nonEditableArea'],
        'Related Reports': ['#relatedReportsId_tab'],
    };

    constructor() {
        super('#td_mstrWeb_dockLeft', 'Report Objects panel');
    }

    getPanel() {
        return this.$('#td_mstrWeb_dockLeft');
    }

    getReportObjectPanel() {
        return this.getPanel().$('#accordion_AccordionTabManagerStyle>.mstrPanelPortrait');
    }

    getTab(name) {
        const [cssSelector] = BaseReportPanel.TabsSelector[name];
        return this.$(cssSelector);
    }

    // Action helper

    /**
     * Choose different tabs.
     * @param {string}  name The name of the tab
     */
    async chooseTab(name) {
        await this.click({ elem: this.getTab(name) });
        const [, lazyElementSelector] = BaseReportPanel.TabsSelector[name];

        if (lazyElementSelector) {
            const lazyElement = this.$(lazyElementSelector);
            await this.waitForElementVisible(lazyElement);
        }
        await this.waitForWebCurtainDisappear();
    }
}
