import BaseVisualization from '../base/BaseVisualization.js';

export default class Graph extends BaseVisualization {

    // Element locator

    getGraphRowHeader({ title, rowHeaderName }) {
        return this.getContainerByTitle(title)
            .$$('.gm-rowheader-cell')
            .filter((elm) => {
                return elm.getText().then((text) => {
                    return text === rowHeaderName;
                });
            })[0];
    }

    // Action Method
    selectGraphHeaderPopupMenuOption({ title, rowHeaderName, option1, option2, specType }) {
        return super.selectContextMenuOptions({
            firstOption: option1,
            secondOption: option2,
            elem: this.getGraphRowHeader({ title, rowHeaderName }),
            specType: specType,
        });
    }
}
