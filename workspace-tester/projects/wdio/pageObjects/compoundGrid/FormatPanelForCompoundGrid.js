import FormatPanelForGridGeneral from '../authoring/format-panel/FormatPanelForGridGeneral.js';

export default class FormatPanelForCompoundGrid extends FormatPanelForGridGeneral {
    constructor() {
        super();
    }

    /**
     * element
     */

    get columnSetPulldown() {
        return this.$(
            '(//div[contains(@class, "mstrmojo-Box mstrmojo-VIPanelContents")]/child::div[(contains(@class, "ctrl-group container"))]//child::div[contains(@class, "mstrmojo-ui-Pulldown")])[1]'
        );
    }

    get columnSetPulldownText() {
        return this.columnSetPulldown.$(
            './/child::div[contains(@class, "mstrmojo-ui-Pulldown")]//div[contains(@class, "mstrmojo-Pulldown-text")]'
        );
    }

    /** Action method */

    async selectColumnSet(menuOption) {
        await this.click({ elem: this.columnSetPulldown });

        const elMenuOption = this.getTargetSelectOption(menuOption);
        await this.waitForElementVisible(elMenuOption);
        await this.click({ elem: elMenuOption });
    }
}
