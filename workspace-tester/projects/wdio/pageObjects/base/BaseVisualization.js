import { waitForFileToExist } from '../../config/folderManagement.js';
import BasePage from './BasePage.js';
import PDFExportWindow from '../export/PDFExportWindow.js';
import ShowDataDialog from '../common/ShowDataDialog.js';
import { getAttributeValue, getDisabledStatus } from '../../utils/getAttributeValue.js';
import DossierPage from '../dossier/DossierPage.js';
import VizGallery from '../dossierEditor/VizGallery.js';
import { takeScreenshotByElement } from '../../utils/TakeScreenshot.js';
import LoadingDialog from '../dossierEditor/components/LoadingDialog.js';

export default class BaseVisualization extends BasePage {
    constructor() {
        super();
        this.pdfExportWindow = new PDFExportWindow();
        this.showDataDialog = new ShowDataDialog();
        this.dossierPage = new DossierPage();
        this.vizGallery = new VizGallery();
        this.loadingDialog = new LoadingDialog();
    }

    // Element locator

    getTitleBox(title) {
        return this.getContainerByTitle(title).$('.mstrmojo-UnitContainer-titlebar');
    }

    getTitleBarContainer(title) {
        return this.getContainerByTitle(title).$('.mstrmojo-UnitContainer-titleBarContainer-extendedBackground');
    }

    getCurrentPage() {
        return this.$$('.mstrd-Page-content').filter((item) => item.isDisplayed())[0];
    }

    getVizLoadingSpinner() {
        return this.$('.mstrd-LoadingIcon-content');
    }

    getContainerByTitle(title) {
        // exlude the viz within Bot Answers
        return this.$$(`.mstrmojo-VIBox:not(.mstr-chatbot-chat-panel .mstrmojo-VIBox)`).filter(async (elem) => {
            let elemText = await elem.$('.title-text').getText();
            if (elemText === '' || elemText === null) {
                // .getText() cannot always get the real text,in this case try java script
                elemText = await this.getInnerText(elem.$('.title-text'));
            }
            const value = await elem.isDisplayed();
            return elemText.includes(title) && value;
        })[0];
    }

    async getContainerByTitleInCurrentPage(title) {
        const el = await this.getCurrentPageByKey();
        return el.$$(`.mstrmojo-VIBox`).filter(async (elem) => {
            const elemText = await elem.$('.title-text').getText();
            const value = await elem.isDisplayed();
            return elemText.includes(title) && value;
        })[0];
    }

    getSubPanelContainerByTitle(title) {
        return this.$$('.mstrmojo-UnitContainer.mstrmojo-VIBox').filter((elem) => {
            return elem
                .$('.mstrmojo-VITitleBar')
                .getText()
                .then((titleText) => {
                    return title === titleText;
                });
        })[0];
    }

    getContextMenuByLevel(level) {
        return this.$$('.mstrmojo-ui-Menu')[level];
    }

    getExportSpinner(title) {
        return this.getContainerByTitle(title).$('.mstrd-Spinner');
    }

    async getContextMenuTitlesByLevel(level, pageBy = false) {
        let contextMenuOptions = this.getContextMenuByLevel(level).$$('.item.mstrmojo-ui-Menu-item');
        const noOfOptions = await contextMenuOptions.length;
        const titles = [];
        for (let i = 0; i < noOfOptions; i++) {
            const option = await contextMenuOptions[i];
            const role = await option.getAttribute('role');
            if (role === 'menuitem' || pageBy) {
                const optionTitle = await option.$('.mtxt').getText();
                titles.push(optionTitle);
            }
        }
        return titles;
    }

    getContextMenuOption({ level, option }) {
        if (option.includes('Quick Sort')) {
            if (option.includes('Ascending')) {
                return this.$('.item.asc.mstrmojo-ui-Menu-item');
            } else if (option.includes('Clear')) {
                return this.$('.item.clr.mstrmojo-ui-Menu-item');
            } else {
                return this.$('.item.desc.mstrmojo-ui-Menu-item');
            }
        } else {
            return this.getContextMenuByLevel(level)
                .$$('.item.mstrmojo-ui-Menu-item')
                .filter(async (item) => {
                    let itemText;
                    itemText = await item.getText();
                    if (!itemText) {
                        // console.log('warning: failed to get text. try again');
                        await this.sleep(1000); //wait for menu list to be stable, especially when there is scrollbar
                        await this.waitForElementVisible(item);
                        itemText = await item.getText();
                    }
                    if (itemText != null && itemText != '') {
                        return itemText.includes(option);
                    }
                })[0];
        }
    }

    getContextMenuButton({ level, btnClass }) {
        return this.getContextMenuByLevel(level).$(`.item.mstrmojo-ui-Menu-item.btn.${btnClass}`);
    }

    getViewFilterIcon(title) {
        return this.getContainerByTitle(title).$('.hover-filter-btn');
    }

    getVisualizationMenuButton(title) {
        return this.getContainerByTitle(title).$('.hover-menu-btn');
    }

    getViewFilterContainer() {
        return this.$('.mstrmojo-viz-fe-menu');
    }

    getViewFilterItem(option) {
        return this.getViewFilterContainer()
            .$$('.item.mstrmojo-ui-Menu-item')
            .filter(async (item) => {
                const itemText = await item.getText();
                return itemText.includes(option);
            })[0];
    }

    async getViewFilterItemByIndex() {
        const el = await this.getViewFilterContainer().$$('.item.mstrmojo-ui-Menu-item');
        return el[el.length - 1];
    }

    getVizTooltipContainer() {
        return this.$('.vis-tooltip');
    }

    getVizLinkingTooltipContainer() {
        return this.getVizTooltipContainer().$('.vis-tooltip-link');
    }

    getSettingMenu() {
        return this.$('.mstrmojo-ui-Menu-item-container');
    }

    getSettingItem(itemName) {
        return this.getSettingMenu()
            .$$('.item')
            .filter(async (item) => {
                const itemText = await item.getText();
                return itemText.includes(itemName);
            })[0];
    }

    getVisualizationExportTypeContainer() {
        return this.$(
            '.mojo-theme-light.mstrmojo-popup-widget-hosted .mstrmojo-ListBase.mstrmojo-ui-Menu.unselectable.mstrmojo-scrollbar-host'
        );
    }

    getVisuazliationExportTypeButton(type) {
        return this.getVisualizationExportTypeContainer()
            .$$('.item.mstrmojo-ui-Menu-item .mtxt')
            .filter(async (item) => {
                const itemText = await item.getText();
                return itemText.includes(type);
            })[0];
    }

    getContainerMaxIcon(title) {
        return this.getContainerByTitle(title).$('.hover-max-restore-btn.visible');
    }

    getNlgContainerCopyIcon(title) {
        return this.getContainerByTitle(title).$('.hover-nlg-copy-btn.max-present.visible');
    }

    getErrorMsgList() {
        return this.$$(`//div[contains(@class, 'error-content')]`);
    }

    getErrorMsgTextList() {
        return this.$$(`//div[contains(@class, 'error-content')]//div[contains(@class, 'text')]`);
    }

    async clickNlgCopyBtn(title) {
        await this.hover({ elem: this.getContainerByTitle(title) });
        await this.click({ elem: this.getNlgContainerCopyIcon(title) });
        return await this.dossierPage.waitForPageLoading();
    }

    async checkNlgCopyBtnStatus(testCase, imageName, tolerance = 0.5) {
        await this.waitForElementVisible(this.getNlgContainerCopyIcon());
        await takeScreenshotByElement(this.getNlgContainerCopyIcon(), testCase, imageName, tolerance);
    }

    async checkVizContainerMenu(testCase, imageName, tolerance = 0.5) {
        await this.waitForElementVisible(this.getContextMenuByLevel(0));
        await takeScreenshotByElement(this.getContextMenuByLevel(0), testCase, imageName, tolerance);
    }

    async checkVizContainerByTitle(vizTitle, testCase, imageName, tolerance = 0.5) {
        await this.waitForElementVisible(this.getContainerByTitle(vizTitle));
        await takeScreenshotByElement(this.getContainerByTitle(vizTitle), testCase, imageName, tolerance);
    }

    // Action method

    async restoreContainer(title) {
        await this.executeScript(
            'arguments[0].click();',
            await this.getContainerByTitle(title).$('.hover-max-restore-btn.restore')
        );
        return await this.dossierPage.waitForPageLoading();
    }

    async maximizeContainer(title) {
        await this.hover({ elem: this.getContainerByTitle(title) });
        await this.click({ elem: this.getContainerMaxIcon(title) });
        return await this.dossierPage.waitForPageLoading();
    }

    async minimizeLegend(title) {
        await this.executeScript('arguments[0].click();', this.getContainerByTitle(title).$('.gm-legend-tri-button'));
        return this.dossierPage.waitForPageLoading();
    }

    async maximizeLegend(title) {
        await this.executeScript(
            'arguments[0].click();',
            this.getContainerByTitle(title).$('.gm-legend-tri-button-collapsed')
        );
        return this.dossierPage.waitForPageLoading();
    }

    async closeLegend(title) {
        await this.executeScript('arguments[0].click();', this.getContainerByTitle(title).$('.gm-legend-close-button'));
        return this.dossierPage.waitForPageLoading();
    }

    async clickTopOfContextMenuForSafari() {
        if (this.isSafari()) {
            const contextMenu = await this.getContextMenuByLevel(0);
            // click on the top of context menu to dismiss the covering tooltip,
            // the tooltip should be dismissed when context menu is shown, temporarily workaround
            // for automation, code should be removed after issue fixed.
            await this.brwsr.actions().mouseMove(contextMenu, { x: 5, y: 5 }).mouseDown().mouseUp().perform();
        }
    }

    async clickElmAndWait(elm) {
        await elm.click();
        await this.waitForElementVisible(this.dossierPage.getPageLoadingIcon(), {
            msg: 'Loading icon did not appear.',
        });
        return this.dossierPage.waitForPageLoading();
    }

    async openContextMenu({ elem, offset, clickContextMenuWhenOpen = false }) {
        await this.rightClick({ elem: elem, offset: offset, checkClickable: false });
        await this.waitForElementVisible(this.getContextMenuByLevel(0));
        return this.sleep(500);
    }

    async rightClickTitleBoxNoWait(title) {
        await this.rightClick({ elem: this.getTitleBox(title) });
        return this.sleep(500);
    }

    async clickContextMenu(el, prompted = false) {
        if (prompted) {
            return this.clickAndNoWait({ elem: el }); // cannot use this.click() due to prompt window might appear after click
        } else {
            return this.click({ elem: el });
        }
    }

    async clickMenuOptionInLevel({ level, option }, prompted = false) {
        const elem = await this.getContextMenuOption({ level, option });
        return this.clickContextMenu(elem, prompted);
    }

    async clickMenuButtonInLevel({ level, btnClass }, prompted = false) {
        const elem = await this.getContextMenuButton({ level, btnClass });
        return this.clickContextMenu(elem, prompted);
    }

    async selectContextMenuOptions(
        {
            elem,
            offset,
            firstOption,
            secondOption,
            thirdOption,
            clickContextMenuWhenOpen = false,
            isIconSelector = false,
        },
        prompted = false
    ) {
        await this.openContextMenu({ elem, offset, clickContextMenuWhenOpen });
        if (firstOption.btnClass) {
            await this.clickMenuButtonInLevel({ level: 0, btnClass: firstOption.btnClass }, prompted);
        } else {
            await this.clickMenuOptionInLevel({ level: 0, option: firstOption }, prompted);
        }
        if (secondOption) {
            await this.waitForElementVisible(this.getContextMenuByLevel(1));
            await this.sleep(1000); // wait a while for the context menu to be stable, especially when there is scrollbar
            // keep below scripts for debug purpose

            if (isIconSelector) {
                // Use direct CSS selector for icon-based menu items
                const contextMenu = this.getContextMenuByLevel(1);
                const iconElem = contextMenu.$(secondOption);
                await this.clickContextMenu(iconElem, prompted);
            } else {
                await this.clickMenuOptionInLevel({ level: 1, option: secondOption }, prompted);
            }
        }
        if (thirdOption) {
            await this.waitForElementVisible(this.getContextMenuByLevel(2));

            if (isIconSelector) {
                // Use direct CSS selector for icon-based menu items
                const contextMenu = this.getContextMenuByLevel(2);
                const iconElem = contextMenu.$(thirdOption);
                await this.clickContextMenu(iconElem, prompted);
            } else {
                await this.clickMenuOptionInLevel({ level: 2, option: thirdOption }, prompted);
            }
        }
        return this.sleep(1000);
    }

    async openVisualizationMenu({ elem, offset }) {
        await this.click({ elem, offset });
        const el = this.getContextMenuByLevel(0);
        await this.waitForElementVisible(el);
        return this.sleep(500);
    }

    async selectVisualizationMenuOptions({ elem, offset, firstOption, secondOption, thirdOption }) {
        await this.openVisualizationMenu({ elem, offset });
        await this.clickMenuOptionInLevel({ level: 0, option: firstOption });
        if (secondOption) {
            await this.waitForElementVisible(this.getContextMenuByLevel(1));
            await this.clickMenuOptionInLevel({ level: 1, option: secondOption });
        }
        if (thirdOption) {
            await this.waitForElementVisible(this.getContextMenuByLevel(2));
            await this.clickMenuOptionInLevel({ level: 2, option: thirdOption });
        }
    }

    async selectExportToPDFOnVisualizationMenu(title) {
        await this.hover({ elem: this.getContainerByTitle(title) });
        return this.selectVisualizationMenuOptions({
            elem: this.getVisualizationMenuButton(title),
            firstOption: 'Export',
            secondOption: 'PDF',
        });
    }

    async editContextualLink(title) {
        await this.hover({ elem: this.getContainerByTitle(title) });
        return this.selectVisualizationMenuOptions({
            elem: this.getVisualizationMenuButton(title),
            firstOption: 'Edit Contextual Link',
        });
    }

    async createContextualLink(title) {
        await this.hover({ elem: this.getContainerByTitle(title) });
        return this.selectVisualizationMenuOptions({
            elem: this.getVisualizationMenuButton(title),
            firstOption: 'Create Contextual Link',
        });
    }

    async selectAddToInsightsOnVisualizationMenu(title) {
        await this.hover({ elem: this.getContainerByTitle(title) });
        // await this.hover({ elem: await this.getVisualizationMenuButton(title) });
        return this.selectVisualizationMenuOptions({
            elem: this.getVisualizationMenuButton(title),
            firstOption: 'Add to Insights',
        });
    }

    async openMenuOnVisualization(title) {
        await this.hover({ elem: this.getContainerByTitle(title) });
        await this.getVisualizationMenuButton(title).click();
        return this.waitForElementVisible(this.getSettingMenu());
    }

    async openLinkEditorOnContainer(elem) {
        await this.rightClick({ elem: elem });
        await this.waitForElementVisible(this.getSettingMenu());
        await this.click({ elem: this.getSettingItem('Edit Link') });
        await this.waitForElementInvisible(this.getSettingMenu());
    }

    async openMenuOnVisualizationWithouWait(title) {
        await this.hoverWithoutWait({ elem: this.getContainerByTitle(title) });
        await this.getVisualizationMenuButton(title).click();
        return this.waitForElementVisible(this.getSettingMenu());
    }

    async selectExportOnVisualizationMenu(title) {
        await this.hover({ elem: this.getContainerByTitle(title) });
        return this.selectVisualizationMenuOptions({
            elem: this.getVisualizationMenuButton(title),
            firstOption: 'Export',
        });
    }

    async selectExportToExcelOnVisualizationMenu(title) {
        await this.hover({ elem: this.getContainerByTitle(title) });
        return this.selectVisualizationMenuOptions({
            elem: this.getVisualizationMenuButton(title),
            firstOption: 'Export',
            secondOption: 'Excel',
        });
    }

    async selectExportToGoogleSheetsOnVisualizationMenu(title) {
        await this.hover({ elem: this.getContainerByTitle(title) });
        return this.selectVisualizationMenuOptions({
            elem: this.getVisualizationMenuButton(title),
            firstOption: 'Export',
            secondOption: 'Google Sheets',
        });
    }

    async selectExportGridDataOnVisualizationMenu(title) {
        await this.hover({ elem: this.getContainerByTitle(title) });
        return this.selectVisualizationMenuOptions({
            elem: this.getVisualizationMenuButton(title),
            firstOption: 'Export',
            secondOption: 'Data',
        });
    }

    async clickVisualizationTitle(title) {
        const vizContainer = this.getContainerByTitle(title);
        const titleBar = vizContainer.$('.mstrmojo-UnitContainer-titlebar');
        const width = await titleBar.getSize('width');
        const height = await titleBar.getSize('height');
        await this.click({
            elem: titleBar,
            offset: { x: Math.floor(width / 2), y: Math.floor(height / 2) },
            checkClickable: false,
        });
        await titleBar.click();
        await this.sleep(2000);
    }

    async clickVisualizationTitleContainer(title) {
        const vizContainer = this.getContainerByTitle(title);
        const titleBar = vizContainer.$('.mstrmojo-UnitContainer-titleBarContainer');
        const width = await titleBar.getSize('width');
        const height = await titleBar.getSize('height');
        await this.click({
            elem: titleBar,
            offset: { x: Math.floor(width / 2), y: Math.floor(height / 2) },
            checkClickable: false,
        });
        await titleBar.click();
        await this.sleep(2000);
    }

    async selectShowDataOnVisualizationMenu(title) {
        if (this.isSafari()) {
            // click the vis title to make menu button visible
            await this.clickVisualizationTitle(title);
        }
        await this.hover({ elem: this.getContainerByTitle(title) });
        await this.selectVisualizationMenuOptions({
            elem: this.getVisualizationMenuButton(title),
            firstOption: 'Show Data',
        });
        return this.waitForElementVisible(this.showDataDialog.getShowDataDialog());
    }

    async selectAlertOnVisualizationMenu(title) {
        if (this.isSafari()) {
            // click the vis title to make menu button visible
            await this.clickVisualizationTitle(title);
        }
        await this.hover({ elem: this.getContainerByTitle(title) });
        await this.selectVisualizationMenuOptions({
            elem: this.getVisualizationMenuButton(title),
            firstOption: 'Alert',
        });
        const alertDialog = this.$('.mstrd-SubscriptionSettings-schedule');
        return this.waitForElementVisible(alertDialog);
    }

    async selectDeleteOnVisualizationMenu(title) {
        if (this.isSafari()) {
            // click the vis title to make menu button visible
            await this.clickVisualizationTitle(title);
        }
        await this.hover({ elem: this.getContainerByTitle(title) });
        await this.selectVisualizationMenuOptions({
            elem: this.getVisualizationMenuButton(title),
            firstOption: 'Delete',
        });
        // return this.waitForElementInVisible(this.getContainerByTitle(title));
    }

    async selectAlertOnVisualizationMenu(title, name = 'Alert') {
        await this.hover({ elem: this.getContainerByTitle(title) });
        return this.selectVisualizationMenuOptions({
            elem: this.getVisualizationMenuButton(title),
            firstOption: name,
        });
    }

    async isAlertOnVisualizationMenuPresent(title) {
        await this.hover({ elem: this.getContainerByTitle(title) });
        await this.openMenuOnVisualizationWithouWait(title);
        return this.getContextMenuOption({ level: 0, option: 'Alert' }).isDisplayed();
    }

    async closeContextMenu(title) {
        await this.click({ elem: this.getTitleBox(title) });
        return this.waitForElementStaleness(this.getContextMenuByLevel(0));
    }

    async openViewFilterContainer(title) {
        await this.waitForElementVisible(this.getContainerByTitle(title));
        if (this.isSafari()) {
            await this.clickVisualizationTitle(title);
        } else {
            let isViewFilterIconDisplayed = await this.getViewFilterIcon(title).isDisplayed();
            // if view filter icon is not displayed, hover it again
            if (!isViewFilterIconDisplayed) {
                for (let i = 0; i < 3 && !isViewFilterIconDisplayed; i++) {
                    console.log('view filter icon is not displayed, hover it again' + i + 'times');
                    await this.hover({ elem: this.getContainerByTitle(title) });
                    await this.sleep(1000);
                    isViewFilterIconDisplayed = await this.getViewFilterIcon(title).isDisplayed();
                }
            }
        }
        await this.executeScript('arguments[0].click();', await this.getViewFilterIcon(title));
        return this.waitForElementVisible(this.getViewFilterContainer());
    }

    async clearViewFilter(itemText) {
        await this.click({ elem: this.getViewFilterItem(itemText) });
        return this.waitForElementInvisible(this.getViewFilterContainer());
    }

    async hoverViewFilter(itemText) {
        await this.hover({ elem: this.getViewFilterItem(itemText) });
    }

    async closeViewFilterContainer(title) {
        await this.click({ elem: this.getTitleBox(title) });
        return this.waitForElementInvisible(this.getViewFilterContainer());
    }

    // Assertion
    async vizCount() {
        return this.$$('.mstrmojo-UnitContainer ').length;
    }

    async isVizEmpty(title) {
        const errorMsg = await this.getContainerByTitle(title).$('.error-content').getText();
        return errorMsg.includes('No data returned for this view.');
    }

    async getVizErrorContent(title) {
        return this.getContainerByTitle(title).$('.error-content').getText();
    }

    async getErrCount(errorMsg) {
        const errorMsgList = await this.getErrorMsgList();
        const errorMsgListText = await Promise.all(
            errorMsgList.map(async (item) => {
                const text = await item.getText();
                return text.includes(errorMsg);
            })
        );
        return errorMsgListText.filter((item) => item).length;
    }

    async isContextMenuOptionPresent({ level, option }) {
        return this.getContextMenuOption({ level, option }).isDisplayed();
    }

    async isContextMenuItemSelected(option, level = 0) {
        const el = await this.getContextMenuOption({ level, option });
        return this.isOn(el);
    }

    async isViewFilterPresent(title) {
        await this.waitForCurtainDisappear();
        const el = await this.getContainerByTitleInCurrentPage(title);
        return !(await el.$('.hover-filter-btn.invalid').isExisting());
    }

    async isViewFilterItemPresent(itemText) {
        await this.waitForCurtainDisappear();
        await this.waitForElementVisible(this.getViewFilterContainer());
        return this.getViewFilterItem(itemText).isDisplayed();
    }

    async vizTooltip() {
        return this.getVizTooltipContainer()
            .$$('.vis-tooltip-td')
            .reduce(async (acc, elem) => {
                const text = await elem.getText();
                return acc + text + ' ';
            }, '');
    }

    async vizDossierLinkingTooltip() {
        return this.getVizLinkingTooltipContainer().getText();
    }

    async linkToTargetByGridToolTip() {
        await this.click({ elem: this.getVizLinkingTooltipContainer() });
    }

    async waitForDownloadComplete({ name, fileType, vizName }) {
        if (!name || !fileType) {
            return new Error('The name and/or fileType object parameters must be provided.');
        }

        if (fileType === '.pdf' || fileType === '.xlsx' || fileType === '.csv') {
            await this.waitForElementStaleness(this.getExportSpinner(vizName), {
                timeout: this.DEFAULT_LOADING_TIMEOUT,
                msg: `Export ${fileType} takes too long`,
            });
        } else {
            return new Error('The provided fileType object parameter is not supported.');
        }

        // Wait the file to be completely generated after the download spinner disappears
        return waitForFileToExist({ name, fileType });
    }

    async valueOfToolTip(vizElementFinder) {
        await this.waitForElementVisible(vizElementFinder);
        const location = await this.getElementPositionOfScreen(vizElementFinder);
        await browser.action('pointer').move(location).perform();
        await this.sleep(1000); //wait for animation to complete
        return this.$('.vis-tooltip-container').$('.vis-tooltip-table').getText();
    }

    async isSingleVisualizationExportSpinnerPresent(title) {
        return this.getExportSpinner(title).isDisplayed();
    }

    async isVisualizationExportTypePresent(type) {
        return this.getVisuazliationExportTypeButton(type).isDisplayed();
    }

    async getViewFilterItemText() {
        const el = await this.getViewFilterItemByIndex();
        let text = await el.getText();
        if (this.isSafari()) {
            text = text.replace(/\u00A0/g, ' ');
        }
        return text;
    }

    async isVizDisplayed(title) {
        const el = this.getContainerByTitle(title);
        return el.isDisplayed();
    }

    async hideContainer(title) {
        await this.waitForElementVisible(this.getContainerByTitle(title));
        await this.hideElement(this.getContainerByTitle(title));
    }

    async showContainer(title) {
        await this.showElement(this.getContainerByTitle(title));
    }

    async hideSubPanelContainer(title) {
        await this.hideElement(this.getSubPanelContainerByTitle(title));
    }

    async showSubPanelContainer(title) {
        await this.showElement(this.getSubPanelContainerByTitle(title));
    }

    async isContainerSelected(title) {
        const el = this.getContainerByTitle(title);
        return this.isSelected(el);
    }

    async isContainerBorderHidden(title) {
        const el = await this.getContainerByTitle(title);
        const name = await getAttributeValue(el, 'className');
        return name.includes('selected noBoxShadow');
    }

    async changeVizType(title, vizCategory, vizType) {
        await this.hover({ elem: this.getContainerByTitle(title) });
        await this.selectVisualizationMenuOptions({
            elem: this.getVisualizationMenuButton(title),
            firstOption: 'Change Visualization...',
        });
        await this.waitForElementVisible(this.vizGallery.getGallery());
        await this.vizGallery.clickOnVizCategory(vizCategory);
        await this.vizGallery.clickOnViz(vizType);
        await this.dossierPage.waitForPageLoading();
    }

    async dragAndDropObjectWithExtraMove(movingElement, targetElement, moveX = 0, moveY = 0, waitForLoadingDialog) {
        let dndInnerTime = 500; // Allow DND animation work properly
        try {
            // Move the mouse to the moving element
            await browser.performActions([
                {
                    type: 'pointer',
                    id: 'mouse1',
                    parameters: { pointerType: 'mouse' },
                    actions: [
                        { type: 'pointerMove', origin: movingElement, x: 0, y: 0, duration: dndInnerTime },
                        { type: 'pointerDown', button: 0 },
                    ],
                },
            ]);
            await browser.pause(dndInnerTime);
            // Move the mouse slightly for adjustments
            await browser.performActions([
                {
                    type: 'pointer',
                    id: 'mouse1',
                    parameters: { pointerType: 'mouse' },
                    actions: [
                        { type: 'pointerMove', origin: 'pointer', x: 5, y: 0, duration: dndInnerTime },
                        { type: 'pointerMove', origin: 'pointer', x: 0, y: 5, duration: dndInnerTime },
                    ],
                },
            ]);
            await browser.pause(dndInnerTime);
            // Move the mouse to the target element
            await browser.performActions([
                {
                    type: 'pointer',
                    id: 'mouse1',
                    parameters: { pointerType: 'mouse' },
                    actions: [{ type: 'pointerMove', origin: targetElement, x: 0, y: 0, duration: dndInnerTime }],
                },
            ]);
            await browser.pause(dndInnerTime);

            // Move the mouse by extra pixels (x and y) to fine-tune the drop location
            await browser.performActions([
                {
                    type: 'pointer',
                    id: 'mouse1',
                    parameters: { pointerType: 'mouse' },
                    actions: [
                        {
                            type: 'pointerMove',
                            origin: 'pointer',
                            x: parseInt(moveX),
                            y: parseInt(moveY),
                            duration: dndInnerTime,
                        },
                        { type: 'pointerUp', button: 0 }, // Release mouse button to complete the drag
                    ],
                },
            ]);
            await browser.pause(dndInnerTime);
        } catch (err) {
            console.log(err.message);
        }
        if (waitForLoadingDialog) {
            await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        }
    }

    async clickTitleBarButtonInConsumption(visualizationName, buttonName) {
        const container = await this.getContainerByTitle(visualizationName).$(
            '.mstrmojo-UnitContainer-titleBarContainer'
        );
        await this.waitForElementVisible(container);

        const button = await container.$(
            `.//div[contains(@class, 'mstrmojo-UnitContainer-titleButton') and contains(@class, '${buttonName}')]`
        );

        await this.click({ elem: button });
    }

    async hoverTitleBarButton(visualizationName, buttonName) {
        const container = await this.getContainerByTitle(visualizationName).$(
            '.mstrmojo-UnitContainer-titleBarContainer'
        );
        await this.waitForElementVisible(container);

        const button = await container.$(
            `.//div[contains(@class, 'mstrmojo-UnitContainer-titleButton') and contains(@class, '${buttonName}')]`
        );

        await this.hover({ elem: button });
    }
}
