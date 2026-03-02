import ListView, { ascendingSortClasses, ascendingTxt, datePattern } from './ListView.js';
import LibraryPage from './LibraryPage.js';

// for new AG Grid list view implementation
export default class ListViewAGGrid extends ListView {
    constructor() {
        super();
        this.libraryPage = new LibraryPage();
    }

    // Element locator

    getAGGridItem(name) {
        return this.$$('.mstrd-DossiersListAGGridList div[role="row"]').filter(async (elem) => {
            // Filter out empty item containers
            const nameLocator = elem.$('.mstrd-DossierItemRow-name');
            const isItemPresent = await nameLocator.isDisplayed();
            if (isItemPresent) {
                const dossierName = await nameLocator.getText();
                return name === dossierName;
            }
        })[0];
    }

    getAGGridItems() {
        return this.$$('.mstrd-DossiersListAGGridList div[role="row"]');
    }

    getAGGridContainerContentHeight() {
        return this.$('.mstrd-DossiersListAGGridList .ag-center-cols-viewport');
    }

    getAGGridContainerScrollHeight() {
        return this.$('.mstrd-DossiersListAGGridList .ag-body-viewport');
    }

    getAGGridTitle(title) {
        const xpathCommand = this.getCSSContainingText('mstrd-AGCustomGroupRow-title', title);
        return this.$(`${xpathCommand}`);
    }

    getInfoWindowIcon(name) {
        return this.getAGGridItem(name).$('.mstrd-DossierInfoIcon-icon');
    }

    getInfoWindowIconByIndex(index) {
        return this.getDossiersListViewContainer().$$('.mstrd-DossierInfoIcon-icon')[index];
    }

    getFavoriteIcon(name) {
        return this.getAGGridItem(name).$('.mstrd-DossierRowActionBar-favoriteIcon');
    }

    getDossierEditIcon(name) {
        return this.getAGGridItem(name).$('.mstrd-WebEditIcon');
    }

    getDossierShareIcon(name) {
        return this.getAGGridItem(name).$('.icon-info_share');
    }

    getDossierDownloadIcon(name) {
        return this.getAGGridItem(name).$('.icon-info_pdf');
    }

    getDossierResetIcon(name) {
        return this.getAGGridItem(name).$('.mstrd-SliderConfirmDialog');
    }

    getAddToLibraryIcon(name) {
        return this.getAGGridItem(name).$('.mstrd-AddToLibraryIcon-icon');
        // return this.getAGGridItem(name).$('.icon-add-to-library');
    }

    getInLibraryStatusIcon(name) {
        return this.getAGGridItem(name).$('.mstrd-DossierItemStatusBar-inLibraryIcon');
    }

    getContextMenuFromAGGrid(name) {
        return this.getAGGridItem(name).$('.icon-pnl_more-options');
    }

    getEmbeddedBotButton(name) {
        return this.getAGGridItem(name).$('.icon-mstrd_embed');
    }

    getCertifiedIcon(name) {
        return this.getAGGridItem(name).$('.mstrd-CertifiedIcon');
    }

    getTemplateIcon(name) {
        return this.getAGGridItem(name).$('.mstrd-TemplateIcon');
    }

    getRunAsExcelIcon(name) {
        return this.getAGGridItem(name).$('.mstrd-RunAsIcon.icon-share_excel');
    }

    getRunAsPDFIcon(name) {
        return this.getAGGridItem(name).$('.mstrd-RunAsIcon.icon-share_pdf');
    }

    getContextMenuFromAGGridByIndex(index) {
        return this.getDossiersListViewContainer().$$('.icon-pnl_more-options')[index];
    }

    getCheckboxFromAGGrid(name) {
        return this.getParent(this.getAGGridItem(name).$('.mstrd-DossierItemRow-checkboxFocusVisible'));
    }

    getCheckboxFromAGGridByIndex(index) {
        return this.getParent(
            this.getDossiersListViewContainer().$$('.mstrd-DossierItemRow-checkboxFocusVisible')[index]
        );
    }

    getCheckboxSelectAll() {
        return this.$('.ag-header-select-all');
    }

    getDossierRenameTextbox() {
        return this.$('.mstrd-DossierItemRow-folderObjectRename .mstr-rc-input');
    }

    getShortcutIcon(name) {
        return this.getAGGridItem(name).$('.mstrd-DossierItemStatusBar-shortcutIcon');
    }

    getSortBar() {
        return this.getDossiersListViewContainer().$('.ag-header-container');
    }

    getSortBarColumnElement(columnLabel) {
        return this.getSortBar()
            .$$('.mstrd-AGCustomHeader')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes(columnLabel);
            })[0];
    }

    getSortBarIconElement(columnLabel) {
        return this.getSortBarColumnElement(columnLabel).$('.mstrd-sort-icon');
    }

    getFirstDossierName() {
        return this.getDossiersListViewContainer().$$('.mstrd-DossierItemRow-name')[0];
    }

    async getLastDossierName() {
        const elements = await this.getDossiersListViewContainer().$$('.mstrd-DossierItemRow-name');
        return elements[elements.length - 1];
    }

    getDossierByIndex(index) {
        return this.getDossiersListViewContainer().$$('.mstrd-DossierItemRow-name')[index];
    }

    getCellValues(id) {
        return this.getDossiersListViewContainer().$$(`div[col-id=${id}] .ag-cell-value`);
    }

    getCheckboxWithNameCell() {
        return this.getDossiersListViewContainer().$$(`div[col-id=name]`);
    }

    getFirstDossierOwner() {
        return this.getCellValues('createdByUserName')[0];
    }

    async getLastDossierOwner() {
        const elements = await this.getCellValues('createdByUserName');
        return elements[elements.length - 1];
    }

    getFirstDossierDate() {
        return this.getCellValues('updatedTimeFormatted')[0];
    }

    getFirstDossierDescription() {
        return this.getCellValues('description')[0];
    }

    getFirstDossierProject() {
        return this.getCellValues('projectDisplayName')[0];
    }

    // filters dossiers with standard date pattern (e.g. 11/04/2022)
    getDossiersWithStandardDatePattern() {
        return this.$$('div[col-id=updatedTimeFormatted] .ag-cell-value').filter(async (dateElement) => {
            // Filter out empty item containers & nonmatching pattern
            if (dateElement) {
                return (await dateElement.getText()).match(datePattern);
            }
        });
    }

    getSideContainerInListView() {
        return this.$('.mstrd-InfoPanelSidebarContainer');
    }

    getShareIconInSideContainer() {
        return this.getSideContainerInListView().$('.icon-info_share');
    }

    getEmbeddedBotIconInSideContainer() {
        return this.getSideContainerInListView().$('.icon-mstrd_embed');
    }

    // 'Columns'side button on the right
    getColumnsButton() {
        const xpathCommand = this.getCSSContainingText('ag-side-button-button', 'Columns');
        return this.$(`${xpathCommand}`);
    }

    // 'Auto Resize' side button on the right
    getAutoResizeButton() {
        const xpathCommand = this.getCSSContainingText('mstrd-AGGrid-CustomToolbar-button', 'Auto Resize');
        return this.$(`${xpathCommand}`);
    }

    getSideColumnsPanel() {
        return this.$('.ag-tool-panel-wrapper .ag-column-panel');
    }

    getCreateSnapshotButton() {
        return this.$('//span[text()="Create a Snapshot"]');
    }

    // Pass 1 to get the 1st checkbox, pass 2 to get 2nd, and so on
    getItemInColumnsPanel(posIndex) {
        return this.getSideColumnsPanel().$(`div[aria-posinset="${posIndex}"] .ag-wrapper`);
    }

    getItemInColumnsPanelByName(name) {
        return this.getSideColumnsPanel()
            .$$('.ag-virtual-list-item')
            .filter(async (elem) => {
                const el = elem.$('.ag-column-select-column-label');
                const elemText = await el.getText();
                return elemText === name;
            })[0]
            .$('.ag-wrapper');
    }

    getCountOfAllElementsInGrid() {
        return this.$$('.ag-center-cols-container .ag-row').length;
    }

    getOneRowInGrid(row) {
        return this.$$('.ag-center-cols-container .ag-row')[row - 1];
    }

    getAGGridRowByIndex(index) {
        return this.$$('.ag-center-cols-container .ag-row')[index];
    }

    getItemContextMenu() {
        return this.$('.mstrd-ContextMenu-menu');
    }

    getSideButtonByName(buttonLabel) {
        return this.$$(`.ag-side-bar-right .ag-side-button`).filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText.includes(buttonLabel);
        })[0];
    }

    getContextMenu() {
        return this.$('.mstrd-ContextMenu.mstrd-DossierContextMenu');
    }

    getContextMenuShareItem() {
        return this.getContextMenu().$('.mstrd-DossierContextMenu-submenu--share');
    }

    getContextMenuExportCsvItem() {
        return this.$(`//span[contains(@class, 'ant-dropdown-menu-title-content') and text()='Export to CSV']`);
    }

    getContextMenuExportPDFItem() {
        return this.$(`//span[contains(@class, 'ant-dropdown-menu-title-content') and text()='Export to PDF']`);
    }

    getContextMenuExportExcelItem() {
        return this.$(`//span[contains(@class, 'ant-dropdown-menu-title-content') and text()='Export to Excel']`);
    }
    // Action helper

    async clickDossierRow(name) {
        await this.moveDossierIntoViewPortAGGrid(name);
        await this.click({ elem: this.getAGGridItem(name) });
    }

    async clickSortBarColumn(columnLabel, sortOrder) {
        if (!(await this.isSortBarColumnActive(columnLabel))) {
            await this.click({ elem: this.getSortBarColumnElement(columnLabel) });
        }

        // click again if sort order does not match the one specified in input
        if ((await this.isSortBarColumnAscending(columnLabel)) !== (sortOrder === ascendingTxt)) {
            await this.click({ elem: this.getSortBarColumnElement(columnLabel) });
        }
    }

    async scrollToBottomAGGrid() {
        let offsetHeight = await this.getAGGridContainerContentHeight().getCSSProperty('height');
        offsetHeight = parseInt(offsetHeight.value, 10);
        await this.executeScript(
            'arguments[0].scrollTop = arguments[1];',
            await this.getAGGridContainerScrollHeight(),
            offsetHeight
        );
        return this.sleep(200);
    }

    async moveDossierIntoViewPortAGGrid(name, scrollToTop = false) {
        if (scrollToTop) {
            await this.waitForLibraryLoading();
            await this.executeScript('arguments[0].scrollTop = 0;', await this.getAGGridContainerScrollHeight());
            await this.waitForLibraryLoading();
        }
        await this.loadUntilRenderedAGGrid({ name });
        return this.executeScript('arguments[0].scrollIntoView(true);', await this.getAGGridItem(name));
    }

    async renderNextBlockAGGrid(count) {
        let viewHeight = await this.getAGGridContainerScrollHeight().getCSSProperty('height');
        viewHeight = parseInt(viewHeight.value, 10);
        await this.executeScript(
            'arguments[0].scrollTop = arguments[1];',
            await this.getAGGridContainerScrollHeight(),
            Math.ceil(viewHeight * count)
        );
        return this.sleep(200);
    }

    async loadUntilRenderedAGGrid({ name, count = 0, attempt = 1 }) {
        let offsetHeight = await this.getAGGridContainerContentHeight().getCSSProperty('height');
        offsetHeight = parseInt(offsetHeight.value, 10);
        let viewHeight = await this.getAGGridContainerScrollHeight().getCSSProperty('height');
        viewHeight = parseInt(viewHeight.value, 10);
        if (viewHeight * count < offsetHeight) {
            let nextCount = count + 1 / attempt;
            const viewable = await this.getAGGridItem(name).isDisplayed();
            if (!viewable) {
                await this.renderNextBlockAGGrid(nextCount);
                return this.loadUntilRenderedAGGrid({ name, count: nextCount, attempt });
            } else {
                const isInViewport = await this.isAGDossierItemElementInViewport(await this.getAGGridItem(name));
                if (isInViewport) {
                    return true;
                } else {
                    await this.renderNextBlockAGGrid(nextCount);
                    return this.loadUntilRenderedAGGrid({ name, count: nextCount, attempt });
                }
            }
        }
    }

    async hoverDossier(name) {
        await this.hover({ elem: this.getAGGridItem(name), useBrowserActionForSafari: true });
    }

    async hoverDossierByIndex(index) {
        await this.hover({ elem: this.getDossierByIndex(index), useBrowserActionForSafari: true });
    }

    async clickFavoriteByImageIcon(name, selected = true) {
        await this.hoverDossier(name);
        if (selected) {
            await this.click({ elem: this.getFavoriteIcon(name) });
            await this.sleep(500); // wait for homepage refresh
        }
    }

    async favoriteByImageIcon(name) {
        const selected = await this.isFavoritesIconSelected(name);
        return this.clickFavoriteByImageIcon(name, !selected);
    }

    async removeFavoriteByImageIcon(name) {
        const selected = await this.isFavoritesIconSelected(name);
        return this.clickFavoriteByImageIcon(name, selected);
    }

    async clickInfoWindowIconInGrid(name) {
        await this.waitForElementVisible(this.getAGGridItem(name));
        await this.hoverDossier(name);
        await this.waitForElementVisible(this.getInfoWindowIcon(name));
        await this.click({ elem: this.getInfoWindowIcon(name) });
        await this.waitForElementVisible(this.getListViewInfoWindow());
    }

    async clickInfoWindowIconInGridByIndex(index) {
        await this.waitForElementVisible(this.getDossierByIndex(index));
        await this.hoverDossierByIndex(index);
        await this.waitForElementVisible(this.getInfoWindowIconByIndex(index));
        await this.click({ elem: this.getInfoWindowIconByIndex(index) });
        await this.waitForElementVisible(this.getListViewInfoWindow());
    }

    async clickEditIconInGrid(name) {
        await this.hoverDossier(name);
        await this.waitForElementVisible(this.getDossierEditIcon(name));
        await this.click({ elem: this.getDossierEditIcon(name) });
        await this.waitForElementVisible(this.$('#rootView'));
    }

    async clickShareIconInGrid(name) {
        await this.moveDossierIntoViewPortAGGrid(name);
        await this.hoverDossier(name);
        await this.waitForElementVisible(this.getDossierShareIcon(name));
        await this.click({ elem: this.getDossierShareIcon(name) });
        await this.sleep(500);
    }

    async clickExportPDFIconInGrid(name) {
        await this.hoverDossier(name);
        await this.waitForElementVisible(this.getDossierDownloadIcon(name));
        await this.click({ elem: this.getDossierDownloadIcon(name) });
        await this.waitForElementVisible(this.getSideContainerInListView());
    }

    async clickResetIconInGrid(name) {
        await this.hoverDossier(name);
        await this.waitForElementVisible(this.getDossierResetIcon(name));
        await this.click({ elem: this.getDossierResetIcon(name) });
        await this.sleep(500);
    }

    async clickAddToLibraryIconInGrid(name) {
        await this.hoverDossier(name);
        await this.waitForElementVisible(this.getAddToLibraryIcon(name));
        await this.click({ elem: this.getAddToLibraryIcon(name) });
        await this.waitForElementVisible(this.$('.mstrd-DossierItemStatusBar-inLibraryIcon'));
    }

    async clickEmbeddedBotButtonInGrid(name) {
        await this.hoverDossier(name);
        await this.waitForElementVisible(this.getEmbeddedBotButton(name));
        await this.click({ elem: this.getEmbeddedBotButton(name) });
        await this.waitForElementVisible(this.$('.mstrd-EmbedBotContainer-main'));
    }

    async clickContextMenuIconInGrid(name) {
        const el = this.getAGGridItem(name);
        await this.waitForElementVisible(el);
        await this.click({ elem: this.getContextMenuFromAGGrid(name) });
        await this.waitForElementVisible(this.$('.mstrd-ContextMenu'));
    }

    async clickContextMenuIconInGridByIndex(index) {
        await this.click({ elem: this.getContextMenuFromAGGridByIndex(index) });
        await this.waitForElementVisible(this.$('.mstrd-ContextMenu'));
    }

    async rightClickToOpenContextMenuByIndex(index) {
        await this.rightClick({ elem: this.getAGGridRowByIndex(index) });
        await this.waitForElementVisible(this.$('.mstrd-ContextMenu'));
    }

    async clickCheckboxInGrid(name) {
        await this.click({ elem: this.getCheckboxFromAGGrid(name) });
    }

    async clickCheckboxInGridByIndex(index) {
        await this.click({ elem: this.getCheckboxFromAGGridByIndex(index) });
    }

    async clickCheckboxSelectAll() {
        await this.click({ elem: this.getCheckboxSelectAll() });
    }

    async renameDossierInGrid(newName) {
        const renameTextbox = this.getDossierRenameTextbox();
        await this.delete();
        await renameTextbox.setValue(newName);
        await this.enter();
        await this.sleep(500); // wait for new name to appear in grid
    }

    async clickColumnsButton() {
        await this.waitForElementVisible(this.getColumnsButton());
        await this.click({ elem: this.getColumnsButton() });
        return this.sleep(500); // Wait for side panel expanding
    }

    async clickAutoResizeButton() {
        await this.waitForElementVisible(this.getAutoResizeButton());
        await this.click({ elem: this.getAutoResizeButton() });
        return this.sleep(500); // Wait for side panel expanding
    }

    async clickSideLabelInListView(buttonLabel) {
        await this.waitForElementVisible(this.getSideButtonByName(buttonLabel));
        await this.click({ elem: this.getSideButtonByName(buttonLabel) });
    }

    async clickColumnCheckboxByIndex(posIndex, isChecked) {
        await this.waitForElementVisible(this.getSideColumnsPanel());
        await this.click({ elem: this.getItemInColumnsPanel(posIndex) });
        await browser.waitUntil(
            async () => {
                const currentStatus = await this.isChecked(this.getItemInColumnsPanel(posIndex));
                return currentStatus !== isChecked;
            },
            { timeout: 5000, timeoutMsg: 'Click a column did not have effect.' }
        );
    }

    async addColumnByTickCheckbox(posIndex) {
        // if not checked, click to check, else do nothing
        const isChecked = await this.isChecked(this.getItemInColumnsPanel(posIndex));
        if (!isChecked) {
            await this.clickColumnCheckboxByIndex(posIndex, isChecked);
        }
    }

    async addColumnByNameList(nameList) {
        // if not checked, click to check, else do nothing
        for (const name of nameList) {
            const el = this.getItemInColumnsPanelByName(name);
            const isChecked = await this.isChecked(el);
            if (!isChecked) {
                await this.click({ elem: el });
            }
        }
        // const isChecked = await this.isChecked(this.getItemInColumnsPanel(posIndex));
        // if (!isChecked) {
        //     await this.clickColumnCheckboxByIndex(posIndex, isChecked);
        // }
    }

    async removeColumnByNameList(nameList) {
        // if not checked, click to check, else do nothing
        for (const name of nameList) {
            const el = this.getItemInColumnsPanelByName(name);
            const isChecked = await this.isChecked(el);
            if (isChecked) {
                await this.click({ elem: el });
            }
        }
        // const isChecked = await this.isChecked(this.getItemInColumnsPanel(posIndex));
        // if (!isChecked) {
        //     await this.clickColumnCheckboxByIndex(posIndex, isChecked);
        // }
    }

    async removeColumnByByTickCheckbox(posIndex) {
        // if checked, click to uncheck, else do nothing
        const isChecked = await this.isChecked(this.getItemInColumnsPanel(posIndex));
        if (isChecked) {
            await this.clickColumnCheckboxByIndex(posIndex, isChecked);
        }
    }

    async clickCreateSnapshotButton() {
        await this.click({ elem: this.getCreateSnapshotButton() });
    }

    // Assertion helper

    async isSortBarPresent() {
        return this.getSortBar().isDisplayed();
    }

    async isSortBarColumnElementPresent(columnLabel) {
        return this.getSortBarColumnElement(columnLabel).isDisplayed();
    }

    async isSortBarColumnActive(columnLabel) {
        const elementClasses = await this.getSortBarColumnElement(columnLabel).getAttribute('class');
        return elementClasses.includes('mstrd-AGCustomHeader--isSelected');
    }

    async isSortBarColumnAscending(columnLabel) {
        const elementClass = await this.getSortBarIconElement(columnLabel).getAttribute('class');
        return ascendingSortClasses.some((ascendingSortClass) => elementClass.includes(ascendingSortClass));
    }

    async isNameColumnSorted(sortOrder) {
        const firstDossierName = await this.getFirstDossierName().getText();
        const lastDossierName = await (await this.getLastDossierName()).getText();
        const comparison = firstDossierName.localeCompare(lastDossierName);
        return sortOrder === ascendingTxt ? comparison <= 0 : comparison >= 0;
    }

    async isOwnerColumnSorted(sortOrder) {
        const firstDossierOwner = await this.getFirstDossierOwner().getText();
        const lastDossierOwner = await (await this.getLastDossierOwner()).getText();
        const comparison = firstDossierOwner.localeCompare(lastDossierOwner);
        return sortOrder === ascendingTxt ? comparison <= 0 : comparison >= 0;
    }

    async isDateColumnSorted(sortOrder) {
        const dossiers = await this.getDossiersWithStandardDatePattern(); // dossiers with format such as 11/04/2022
        const firstDossierDate = await dossiers[0].getText();
        const lastDossierDate = await dossiers[dossiers.length - 1].getText();
        const comparison = Date.parse(firstDossierDate) - Date.parse(lastDossierDate);
        return sortOrder === ascendingTxt ? comparison <= 0 : comparison >= 0;
    }

    async isAddToLibraryIconPresent(name) {
        await this.hoverDossier(name);
        return this.getAddToLibraryIcon(name).isDisplayed();
    }

    async isDossierEditIconPresent(name) {
        await this.hoverDossier(name);
        return this.getDossierEditIcon(name).isDisplayed();
    }

    async isDossierShareIconPresent(name) {
        await this.hoverDossier(name);
        return this.getDossierShareIcon(name).isDisplayed();
    }

    async isDossierInfoIconPresent(name) {
        await this.hoverDossier(name);
        return this.getDossierInfoWindowIcon(name).isDisplayed();
    }

    async isExportToPDFIconPresent(name) {
        await this.hoverDossier(name);
        return this.getDossierDownloadIcon(name).isDisplayed();
    }

    async isBotEmbedIconPresent(name) {
        await this.hoverDossier(name);
        return this.getEmbeddedBotButton(name).isDisplayed();
    }

    async isDossierDownloadIconPresent(name) {
        await this.hoverDossier(name);
        return this.getDossierDownloadIcon(name).isDisplayed();
    }

    async isDossierResetIconPresent(name) {
        await this.hoverDossier(name);
        return this.getDossierResetIcon(name).isDisplayed();
    }

    async isFavoritesIconSelected(name) {
        await this.moveDossierIntoViewPortAGGrid(name);
        const el = this.getFavoriteIcon(name);
        return this.isSelected(el);
    }

    async isAGDossierItemElementInViewport(dossierItemElem) {
        return this.executeScript(
            `
            console.log(arguments[0]);
            const dossierItemRect = arguments[0].getBoundingClientRect();
            var gridRect = arguments[1].getBoundingClientRect();
            return (
                dossierItemRect.top < gridRect.bottom &&
                dossierItemRect.bottom > gridRect.top &&
                dossierItemRect.left >= gridRect.left &&
                dossierItemRect.right <= gridRect.right
            );`,
            dossierItemElem,
            await this.getAGGridContainerScrollHeight()
        );
    }

    async isAGGridTitlePresent(title) {
        return this.getAGGridTitle(title).isDisplayed();
    }

    async isAGGridSideBtnPresent(buttonLabel) {
        return this.getColumnsButton(buttonLabel).isDisplayed();
    }

    async isAGGridColumnSelectHidden() {
        // workaround: use first tool panel wrapper because there are two tool panel wrappers
        // 1. is the expected one that displays
        // 2. is a duplicate that is not used
        const toolPanelWrapper = await this.$$('.ag-tool-panel-wrapper')[0];
        const cls = await toolPanelWrapper.getAttribute('class');
        return cls.includes('ag-hidden') && (await toolPanelWrapper.$('.ag-column-panel').isDisplayed());
    }

    async isToolPanelHidden() {
        const lenth = await this.$$('.ag-tool-panel-wrapper.ag-hidden').length;
        return lenth === 2;
    }

    async isDossierPresent(name) {
        return this.getAGGridItem(name).isDisplayed();
    }

    async isShortcutPresent(name) {
        return this.getShortcutIcon(name).isDisplayed();
    }

    async isBotCoverGreyedOut(name) {
        return this.getAGGridItem(name).$('.mstrd-DossierItemIcon-imgContainer--grayscale').isDisplayed();
    }

    async isCertifiedPresent(name) {
        return this.getCertifiedIcon(name).isDisplayed();
    }

    async isEmbeddedBotButtonPresent(name) {
        await this.hoverDossier(name);
        const embeddedButton = this.getEmbeddedBotButton(name);
        try {
            await this.waitForElementVisible(embeddedButton, { options: { timeout: 10000 } });
            return true;
        } catch {
            return false;
        }
    }

    async isShareIconPresentInSideContainer() {
        return this.getShareIconInSideContainer().isDisplayed();
    }

    async isEmbeddedBotIconPresentInSideContainer() {
        return this.getEmbeddedBotIconInSideContainer().isDisplayed();
    }

    async lastDossierName() {
        return (await this.getLastDossierName()).getText();
    }

    async isRunAsExcelIconPresent(name) {
        await this.moveDossierIntoViewPortAGGrid(name);
        return this.getRunAsExcelIcon(name).isDisplayed();
    }

    async isRunAsPDFIconPresent(name) {
        await this.moveDossierIntoViewPortAGGrid(name);
        return this.getRunAsPDFIcon(name).isDisplayed();
    }

    async getAGGridGroupItemCount(groupName) {
        const group = await this.getAGGridTitle(groupName);
        const text = await group.$('.mstrd-AGCustomGroupRow-groupCount').getText();
        return parseInt(text.slice(1, -1));
    }

    async getAGGridItemCount() {
        const value = await this.getAGGridItems().length;
        if (value === 0) {
            return 0;
        }
        return value - 1;
    }

    async hoverOnContextMenuShareItem() {
        await this.hover({ elem: this.getContextMenuShareItem() });
    }

    async isExporttoPDFPresent() {
        return this.getContextMenuExportPDFItem().isDisplayed();
    }

    async isExporttoExcelPresent() {
        return this.getContextMenuExportExcelItem().isDisplayed();
    }

    async isExporttoCSVPresent() {
        return this.getContextMenuExportCsvItem().isDisplayed();
    }
    async isCreateSnapshotPresentInContextMenu() {
        return this.getCreateSnapshotButton().isDisplayed();
    }
}
