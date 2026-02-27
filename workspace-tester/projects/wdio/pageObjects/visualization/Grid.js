import BaseVisualization from '../base/BaseVisualization.js';
import { scrollElementToBottom } from '../../utils/scroll.js';
import { getAttributeValue } from '../../utils/getAttributeValue.js';

export default class Grid extends BaseVisualization {
    // Element locator
    getTable(title, agGrid = false) {
        if (title) {
            try {
                return this.getContainerByTitle(title)
                    .$$('.mstrmojo-XtabZone,.mstrmojo-AgXtab')
                    .filter((item) => item.isDisplayed())[0]
                    .$$('.ag-root,table,div')[0];
            } catch (e) {
                return this.getContainerByTitle(title)
                    .$$('.mstrmojo-XtabZone,.mstrmojo-AgXtab')
                    .filter((item) => item.isDisplayed())[1]
                    .$$('.ag-root,table,div')[0];
            }
        } else {
            if (agGrid) {
                return this.$("//div[@class='mstrmojo-AgXtab ']//div");
            } else {
                return this.$("//div[@class='mstrmojo-XtabZone ']//table");
            }
        }
    }

    getHeaders(title, agGrid = false) {
        if (agGrid) {
            return this.getTable(title).$$('.ag-header-container .ag-header-cell');
        } else {
            return this.getTable(title).$$('tr')[0].$$('td');
        }
    }

    async getHeaderText(title, agGrid = false) {
        const headers = await this.getHeaders(title, agGrid);
        return Promise.all(
            headers.map(async (header) => {
                let text = await header.getText();
                text = this.trimStringForSafari(text);
                return text;
            })
        );
    }

    async getHeaderCount(title, agGrid = false) {
        return this.getHeaders(title, agGrid).length;
    }

    // Including head
    getRows(title, agGrid = false) {
        if (agGrid) {
            return this.getTable(title).$$('.ag-center-cols-container .ag-row');
        } else {
            return this.getTable(title).$$('tr');
        }
    }

    getOneRowInGrid(title, row, agGrid = false) {
        return this.getRows(title, agGrid)[row - 1];
    }

    // Including head
    getRowsCount(title, agGrid = false) {
        return this.getRows(title, agGrid).length;
    }

    getGraph() {
        return this.$$('.gm-container')[0];
    }

    /**
     * @param {string} title - title of the visualization which has the grid
     * @returns {Array}
     * This method will go across the grid headers and return an array of accumulated count of indices(spans)
     * (One attribute may have multiple attribute forms - one gird header may have multiple 'span's)
     * Array[index] (index > 0) is the total span count from the first header to header[index-1]
     * The first value is always 0;
     * The last value is the total span count throughout the headers, it's the maximum number of column count in one row
     */
    getHeaderIndices(title, agGrid = false) {
        return this.getHeaders(title, agGrid).reduce(
            async (acc, elem) => {
                let colspan;
                if (agGrid) {
                    colspan = await elem.getAttribute('aria-colindex');
                } else {
                    colspan = await elem.getAttribute('colspan');
                }
                acc.push(acc[acc.length - 1] + parseInt(colspan));
                return acc;
            },
            [0]
        );
    }

    async getHeaderByName({ title, headerName, agGrid = false }) {
        const headers = await this.getHeaders(title, agGrid);
        return headers.reduce(async (acc, elem, index) => {
            let elemText = await elem.getText();
            elemText = this.trimStringForSafari(elemText);
            if (elemText === headerName) {
                acc = [elem, index];
            }
            return acc;
        }, []);
        // let index = 0;
        // for (const elem of headers) {
        //     let elemText = await elem.getText();
        //     if (elemText === headerName) {
        //         return [elem, index];
        //     } else {
        //         index++;
        //     }
        // }
    }

    getNewVizTooltipContainer() {
        return this.$('.new-vis-tooltip').$('.new-vis-tooltip-link');
    }

    getIncrementalFetchLoadingIcon(title) {
        return this.getContainerByTitle(title).$('.mstrmojo-progress-barbg');
    }

    getDataBlocks(title) {
        return this.getTable(title).$$('tbody');
    }

    getScrollBox(title) {
        return this.getContainerByTitle(title).$('.hasVertical.mstrmojo-scrollNode');
    }

    getAGGridElement({ title, elementName }) {
        return this.getTable(title)
            .$$('.ag-cell-value')
            .filter(async (cell) => {
                const cellValue = await cell.getText();
                return cellValue.indexOf(elementName) > -1;
            })[0];
    }
    /**
     * @param {string} title - title of the visualization which has the grid
     * @param {string} headerName - name of grid header
     * @param {string} elementName - name of target element; provide 'image' when it's an image
     * @returns {webdriver.WebElement}
     * This method will return a grid element of the specified text/image under specified header
     * Workflow:
     * Get the grid header indices array, the length of the array will be the maximum number of cells in one grid row
     * Get the index of the specified header, calculate the initial target element index based on it
     * Loop each row
     *  For each row, get the total number of cells;
     *  Only check rows whose total number of cells is large enough to contain the target element under the specified header
     *  Calculate offset to adjust target element index in the row;
     *  Get all the rows that the elementName appears in the row and exactly in the matching cell
     *  Get the cell web element in the specific row
     * Return the cell element
     */
    async getElementByValue({ title, headerName, elementName, agGrid = false }) {
        if (agGrid) {
            return this.getAGGridElement({ title, elementName });
        } else {
            const headerIndices = await this.getHeaderIndices(title);
            const totalColumnSize = await headerIndices[headerIndices.length - 1];
            const targetElementIndex = (await this.getHeaderByName({ title, headerName, agGrid }))[1];
            return this.getTable(title)
                .$$('tr')
                .filter(async (row) => {
                    const columnCount = await row.$$('td').length;
                    const offset = totalColumnSize - columnCount;
                    const rowContent = await row.getText();
                    let columnFlag = false;
                    if (targetElementIndex - offset >= 0) {
                        const valueInMatchingColumn = await row.$$('td')[targetElementIndex - offset].getText();
                        columnFlag = valueInMatchingColumn.indexOf(elementName) > -1;
                    }
                    const value = rowContent.includes(elementName) && columnFlag;
                    return value;
                })[0]
                .$$('td')
                .filter(async (cell) => {
                    const cellValue = await cell.getText();
                    return cellValue.indexOf(elementName) > -1;
                })[0];
        }
    }

    async getVizDossierLinkingTooltip() {
        return this.getNewVizTooltipContainer().getText();
    }

    async getExpandIconOfElement({ title, headerName, elementName }) {
        const item = await this.getElementByValue({ title, headerName, elementName });
        console.log('items ' + elementName);
        return item.$('.iconRA-expand');
    }

    async getCollapseIconOfElement({ title, headerName, elementName }) {
        const item = await this.getElementByValue({ title, headerName, elementName });
        console.log('items ' + elementName);
        return item.$('.iconRA-collapse');
    }

    async getGridElementLink({ title, headerName, elementName, agGrid = false }) {
        let item;

        if (agGrid) {
            item = await this.getAGGridElement({ title, elementName });
        } else {
            item = await this.getElementByValue({ title, headerName, elementName });
        }
        return item.$$('a')[0];
    }

    async getRowByCell(title, cellText) {
        const rows = await this.getTable(title)
            .$$('tr')
            .filter(async (row) => {
                const cells = row.$$('td').filter(async (cell) => {
                    let tmpCellText = await cell.getText();
                    return cellText === tmpCellText;
                });
                const doesRowContainsCell = (await cells.length) > 0;
                return doesRowContainsCell;
            });
        if (rows.length > 0) {
            const row = rows[0];
            const rowTexts = await row.$$('td').map((cell) => cell.getText());
            return rowTexts;
        }
        return null;
    }

    // Action Method
    async waitForIncrementalFetchLoading(title) {
        // await this.wait(
        //     this.EC.invisibilityOf(this.getIncrementalFetchLoadingIcon(title)),
        //     5000,
        //     'Grid loading takes too long.'
        // );
        await this.waitForElementVisible(this.getIncrementalFetchLoadingIcon(title), {
            timeout: 5000,
            msg: 'Grid loading takes too long.',
        });
    }

    async openGridElmContextMenu({ title, headerName, elementName, agGrid = false }) {
        let elem = '';
        if (elementName) {
            elem = await this.getElementByValue({ title, headerName, elementName });
        } else {
            elem = (await this.getHeaderByName({ title, headerName, agGrid }))[0];
        }
        if (browsers.params.browser && browsers.params.browser.browserName == 'msedge') {
            await elem.click();
        }
        return this.openContextMenu({ elem });
    }

    async selectGridContextMenuOption(
        { title, headerName, elementName, firstOption, secondOption, thirdOption, agGrid = false },
        prompted = false
    ) {
        let elem = '';
        if (elementName) {
            elem = await this.getElementByValue({ title, headerName, elementName, agGrid });
        } else {
            elem = (await this.getHeaderByName({ title, headerName, agGrid }))[0];
        }
        await this.executeScript('mstrmojo.vi.enums.DefaultFeatureValues["features.react-integration-enabled"] = true;');
        // if there is tooltip covering the context menu on safari, click the top of context menu to dismiss the tooltip first
        return this.selectContextMenuOptions(
            { elem, firstOption, secondOption, thirdOption, clickContextMenuWhenOpen: true },
            prompted
        );
    }

    // workaround when grid is not selectable
    async selectGridContextMenu(
        { title, headerName, elementName, firstOption, secondOption, thirdOption, agGrid = false },
        prompted = false
    ) {
        let elem = this.$(
            `//div[@class='mstrmojo-XtabZone ']//table[@aria-label="${title}"]//descendant::td[contains(text(),'${elementName}')]`
        );
        // if there is tooltip covering the context menu on safari, click the top of context menu to dismiss the tooltip first
        return this.selectContextMenuOptions(
            { elem, firstOption, secondOption, thirdOption, clickContextMenuWhenOpen: true },
            prompted
        );
    }

    async selectGridElement({ title, headerName, elementName, agGrid = false }) {
        let elem = '';
        if (elementName) {
            elem = await this.getElementByValue({ title, headerName, elementName, agGrid });
        } else {
            elem = (await this.getHeaderByName({ title, headerName, agGrid }))[0];
        }
        await this.click({ elem: elem, checkClickable: false });
        return this.dossierPage.waitForPageLoading();
    }

    // workaround when grid is not selectable
    async selectElement({ title, headerName, elementName, agGrid = false }) {
        let elem = this.$(
            `//div[@class='mstrmojo-XtabZone ']//table[@aria-label="${title}"]//descendant::td[contains(text(),'${elementName}')]`
        );
        await this.click({ elem: elem, checkClickable: false });
        return this.dossierPage.waitForPageLoading();
    }

    async clickGridElementLink({ title, headerName, elementName, agGrid = false }) {
        const elem = await this.getGridElementLink({ title, headerName, elementName, agGrid });

        await this.click({ elem: elem, checkClickable: false });
        return this.dossierPage.waitForPageLoading();
    }

    async getOneRowData(title, row, agGrid = false) {
        await this.waitForElementVisible(this.getTable(title));
        await this.waitForElementVisible(this.getOneRowInGrid(title, row, agGrid));
        const rowCells = this.getOneRowInGrid(title, row, agGrid).$$('td, .ag-cell-value, .ag-cell');
        const text = await rowCells.map((cell) => cell.getText());
        const rowText = await text.map((cell) => {
            const trimText = cell.trim();
            if (this.isSafari()) {
                // the text fetched from safari contains non-breaking space, while
                // the expected value in scripts are just normal space, replace it here
                return this.replaceNonBreakingSpaceWithSpace(trimText);
            } else {
                return trimText;
            }
        });
        return rowText;
    }

    async getOneColumnData(title, headerName, agGrid = false) {
        const headerIndices = await this.getHeaderIndices(title);
        const totalColumnSize = await headerIndices[headerIndices.length - 1];
        const targetElementIndex = (await this.getHeaderByName({ title, headerName, agGrid }))[1];
        const rows = this.getRows(title, agGrid);
        const rowsCount = await rows.length;
        const columnText = [];
        for (let i = 1; i < rowsCount; i++) {
            const columns = rows[i].$$('td');
            const columnCount = await columns.length;
            const offset = totalColumnSize - columnCount;
            if (targetElementIndex - offset >= 0) {
                const cellValue = await columns[targetElementIndex - offset].getText();
                columnText.push(cellValue);
            }
        }
        return columnText;
    }

    async getOneColumnDataWithColSpan(title, headerName, agGrid = false) {
        const headerIndices = await this.getHeaderIndices(title);
        const totalColumnSize = await headerIndices[headerIndices.length - 1];
        const targetHeaderIndex = (await this.getHeaderByName({ title, headerName, agGrid }))[1];
        const targetElementIndex = headerIndices[targetHeaderIndex];
        const rows = this.getRows(title, agGrid);
        const rowsCount = await rows.length;
        const columnText = [];
        for (let i = 1; i < rowsCount; i++) {
            const columns = rows[i].$$('td');
            const columnCount = await columns.length;
            const offset = totalColumnSize - columnCount;
            if (targetElementIndex - offset >= 0) {
                const cellValue = await columns[targetElementIndex - offset].getText();
                columnText.push(cellValue);
            }
        }
        return columnText;
    }

    async multiSelectGridElements({ title, headerName, elementName1, elementName2 }) {
        const elem1 = await this.getElementByValue({ title, headerName, elementName: elementName1 });
        const elem2 = await this.getElementByValue({ title, headerName, elementName: elementName2 });
        return this.multiSelectElements({ elem1, elem2 });
    }

    async expandBranch({ title, headerName, elementName }) {
        const item = await this.getExpandIconOfElement({ title, headerName, elementName });
        return item.click();
    }

    async incrementalFetch(title) {
        // const elems = await this.getDataBlocks(title).last().all(by.css('tr'))
        let len = await this.getDataBlocks(title).length;
        const elems = await this.getDataBlocks(title)[len - 1].$$('tr');
        //verify total rows in the first block greater than 0
        const offset = await this.executeScript('return arguments[0].offsetTop;', elems[elems.length - 1]);
        await this.executeScript('arguments[0].scrollTop = arguments[1];', this.getScrollBox(title), offset);
        await this.waitForIncrementalFetchLoading(title);
        return this.sleep(3000);
    }

    async scrollGridToBottom(title) {
        await scrollElementToBottom(this.getTable(title));
    }

    async selectShowTotalsOption(totalOption) {
        this.$('.mstrmojo-vi-subtotals')
            .$$('.item')
            .filter((elm) => {
                return elm.getText().then((text) => {
                    return text === totalOption;
                });
            })[0]
            .click();
        return this.dossierPage.waitForPageLoading();
    }

    async applyShowTotalsSelection() {
        this.$$('.mstrmojo-Button')
            .filter((elm) => {
                return elm.getText().then((text) => {
                    return text === 'OK';
                });
            })[0]
            .click();
        return this.dossierPage.waitForPageLoading();
    }

    async getCellValue(title, row, col, agGrid = false) {
        const rowCells = this.getOneRowInGrid(title, row, agGrid).$$('td');
        const text = await rowCells.map((cell) => cell.getText());
        return text[col - 1];
    }

    // Assertion

    async firstElmOfHeader({ title, headerName, agGrid = false }) {
        await this.waitForCurtainDisappear();
        await this.waitForElementVisible(this.getTable(title));
        const headerIndices = await this.getHeaderIndices(title, agGrid);
        const headerIndex = (await this.getHeaderByName({ title, headerName, agGrid }))[1];
        if (agGrid) {
            // For AG Grid, we need to check if there is a merged cell
            const mergedContainers = await this.getTable(title).$$('.ag-spanning-container:not([aria-hidden="true"]').filter((item) => item.isDisplayed());
            const mergedContainerCount = await mergedContainers.length;
            if (mergedContainerCount > 0) {
                // If there is a merged cell, we need to get the first cell in the merged container
                const mergedContainer = mergedContainers[mergedContainerCount - 1];
                const mergedCells = mergedContainer.$$('.ag-spanned-row');
                const mergedHeaderRows = mergedCells.filter(async (cell) => {
                    const cellText = await cell.getAttribute('row-index');
                    return cellText === '0';
                });
                if (await mergedHeaderRows.length > 0) {
                    return mergedHeaderRows[0].$$('.ag-cell')[headerIndices[headerIndex]].getText();
                }
            }

            return this.getTable(title)
                .$$('.ag-center-cols-container .ag-row')[0]
                .$$('.ag-cell')
                [headerIndices[headerIndex]].getText();
        }
        let text = await this.getTable(title).$$('tr')[1].$$('td')[headerIndices[headerIndex]].getText();
        if (this.isSafari()) {
            text = text.replace(/\u00A0/g, ' ');
        }
        return text;
    }

    async getThresholdImageAlt(index) {
        let text = await this.$$('td.hc-threshold img')[index].getAttribute('alt');
        return text = text.replace(/\u00A0/g, ' ');
    }

    async getAllThresholdImageAlt(title) {
        const imgElements = await this.getTable(title).$$('td.hc-threshold').filter((el) => el.isDisplayed());

        const altTexts = await Promise.all(
            imgElements.map(async (td) => {
                const img = await td.$('img');
                if (img && await img.isExisting()) {
                    const altText = await img.getAttribute('alt');
                    return altText ? altText.replace(/\u00A0/g, ' ') : '';
                }
                return '';
            })
        );

        return altTexts.filter(alt => alt !== '');
    }

    async getThresholdImageURL(index) {
        return this.$$('td.hc-threshold img')[index].getAttribute('src');
    }

    async isGridElmHighlighted({ title, headerName, elementName }) {
        const elem = await this.getElementByValue({ title, headerName, elementName });
        const bgImage = await elem?.getCSSProperty('background-image');
        const elemClass = await elem?.getAttribute('class');
        return bgImage.value.includes('grid_highlight') || elemClass?.includes('xtabSel');
    }

    async getGridElmBackgroundColor({ title, headerName, elementName }) {
        const elem = await this.getElementByValue({ title, headerName, elementName });
        const bgColor = await elem.getCSSProperty('background-color');
        return bgColor.value;
    }

    async linkToTargetByGridContextMenu({ title, headerName, elementName }, prompted = false) {
        const linkText = 'Go to';
        await this.waitForCurtainDisappear();
        await this.selectGridContextMenuOption({ title, headerName, elementName, firstOption: linkText }, prompted);
        return this.dossierPage.waitForPageLoading();
    }

    // work around when grid is not selectable
    async linkToDossier({ title, headerName, elementName }, prompted = false) {
        const linkText = 'Go to';
        await this.waitForCurtainDisappear();
        // await this.selectGridContextMenuOption({ title, headerName, elementName, firstOption: linkText }, prompted);
        let elem = this.$(
            `//div[@class='mstrmojo-XtabZone ']//table[@aria-label="${title}"]//descendant::td[contains(text(),'${elementName}')]`
        );
        await this.selectContextMenuOptions({ elem, firstOption: linkText, clickContextMenuWhenOpen: true }, prompted);

        return this.dossierPage.waitForPageLoading();
    }

    async linkToTargetByGridContextMenuForRA({ title, headerName, elementName, secondOption }, prompted = false) {
        const linkText = 'Go to';
        await this.waitForCurtainDisappear();
        await this.selectGridContextMenuOption(
            { title, headerName, elementName, firstOption: linkText, secondOption },
            prompted
        );
        await this.sleep(500); // wait for page switching
        return this.dossierPage.waitForPageLoading();
    }

    async linkToTargetByGridToolTip() {
        await this.getNewVizTooltipContainer().click();
        return this.dossierPage.waitForPageLoading();
    }

    async hoverOnGridElement({ title, headerName, elementName }) {
        await this.hover({
            elem: await this.getElementByValue({ title, headerName, elementName }),
            offset: { x: 10, y: 10 },
        });
        await this.waitForElementVisible(this.getNewVizTooltipContainer(), {
            timeout: 3000,
            msg: 'Tooltip is not displayed after hovering the pie slice.',
        });
        // return this.wait(
        //     this.EC.presenceOf(this.getNewVizTooltipContainer()),
        //     3000,
        //     'Tooltip is not displayed after hovering the pie slice.'
        // );
    }

    async hoverOnGridElementNoWait({ title, headerName, elementName }) {
        await this.hover({
            elem: await this.getElementByValue({ title, headerName, elementName }),
            offset: { x: 10, y: 10 },
        });
    }

    async getGridMode(title) {
        // await this.wait(
        //     EC.or(EC.visibilityOf(this.getTable(title)), EC.visibilityOf(this.getGraph())),
        //     this.defaultWaitTimeout,
        //     'report grid is not displayed in' + this.defaultWaitTimeout + 'seconds'
        // );
        await browser.waitUntil(
            async () => {
                let table = await this.getTable(title).isDisplayed();
                let graph = await this.getGraph().isDisplayed();
                return table || graph;
            },
            {
                timeout: this.DEFAULT_LOADING_TIMEOUT,
                timeoutMsg: 'report grid is not displayed in' + this.DEFAULT_LOADING_TIMEOUT + 'seconds',
            }
        );
        const gridMode = await this.getTable(title).isDisplayed();
        const graphMode = await this.getGraph().isDisplayed();
        let value = '';
        if (gridMode && !graphMode) {
            value = 'Grid';
        }
        if (!gridMode && graphMode) {
            value = 'Graph';
        }
        if (gridMode && graphMode) {
            value = 'GridGraph';
        }
        return value;
    }

    async waitForGridLoaded(title, agGrid = false) {
        return this.waitForElementVisible(this.getRows(title, agGrid)[0]);
    }

    async isTableExist(title) {
        const el = this.getContainerByTitle(title).$$('.mstrmojo-XtabZone,.mstrmojo-AgXtab')[0];
        return el.isDisplayed();
    }

    async isGridAltTagNotEmpty(index) {
        let value = await this.$$('td.hc-threshold img')[index].getAttribute('alt');
        return value !== null && value.trim().length > 0;
    }

    async isGridElmAppliedThreshold({ title, headerName, elementName }) {
        const elem = await this.getElementByValue({ title, headerName, elementName });
        const classname = await getAttributeValue(elem, 'className');
        return classname.includes("hc-threshold");
    }
}
