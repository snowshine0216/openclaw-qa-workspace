import BasePrompt from '../base/BasePrompt.js';
import { scrollElement, scrollElementToTop, scrollElementToBottom } from '../../utils/scroll.js';
export default class TreeStyle extends BasePrompt {
    constructor() {
        super();
        this.isSearch = false;
    }

    /**
     * You can use this function to set isSearch
     * isSearch is used to tag current manipulation is based on search
     * @param {Boolean} isSearch: isSearch value you want to set
     */
    setIsSearch(isSearch) {
        this.isSearch = isSearch;
    }

    /****************************************************************
     * Element locator
     ****************************************************************/

    getCSSByLevel(promptElement, level) {
        if (level === 1) {
            return promptElement.$$(
                this.isSearch
                    ? '.mstrBGIcon_f.mstrTreeViewNodeShortDisplay'
                    : '.mstrBGIcon_hi.mstrTreeViewNodeShortDisplay'
            );
        } else if (level === 2) {
            return promptElement.$$('.mstrBGIcon_a.mstrTreeViewNodeShortDisplay');
        } else if (level === 3) {
            return promptElement.$$('.mstrBGIcon_ae.mstrTreeViewNodeShortDisplay');
        }
    }

    getEleExpandIcon(promptElement, attrName) {
        if (!this.isWeb()) {
            return this.getEleByName(promptElement, attrName).$('.mstrBGIcon_treeNodeClosedOrphan.icon-submenu_arrow.mstrTreeViewNodeConnector');
        } else {
            return this.getEleByName(promptElement, attrName).$('img.mstrTreeViewNodeConnector');
        }
    }

    getEleCollapseIcon(promptElement, attrName) {
        if (!this.isWeb()) {
            return this.getEleByName(promptElement, attrName).$(
                '.mstrBGIcon_treeNodeOpenedOrphan.icon-submenu_arrow.mstrTreeViewNodeConnector'
            );
        } else {
            return this.getEleByName(promptElement, attrName).$(
                '.mstrBGIcon_treeNodeOpenedOrphan.mstrTreeViewNodeConnector'
            );
        }
    }

    // This method can get matched elements in all levels
    getEleByName(promptElement, attrName) {
        let elements = promptElement.$$(`.mstrTreeViewNodeShortDisplay[title="${attrName}"]`);
        if (this.isWeb()) {
            elements = promptElement.$$(`.mstrTreeViewNodeShortDisplay[title*="${attrName}"]`);
        } 
        if (this.isSearch) {
            return this.getParent(elements[1]);
        } else {
            return this.getParent(elements[0]);
        }
    }

    getSearchRequiredInput(promptElement, attrName) {
        if (!this.isWeb()) {
            return this.getEleByName(promptElement, attrName).$('.mstrTreeViewSearch.mstrSearchEnabledInput');
        } else {
            return this.getEleByName(promptElement, attrName).$('.mstrTreeViewSearch');
        }
    }

    getLoadingState(promptElement, attrName) {
        const xpathCommand = this.getCSSContainingText('mstrTreeViewNodeMsg', 'Loading');
        return this.getEleByName(promptElement, attrName).$(`${xpathCommand}`);
    }

    getErrorLink(promptElement) {
        return promptElement.$('.mstrTreeViewNodeMsg>a');
    }

    /****************************************************************
     * Action helper
     ****************************************************************/

    async clickEleName(promptElement, eleName) {
        await this.getEleByName(promptElement, eleName).$('.mstrTreeViewNodeShortDisplay').click();
        return this.sleep(500);
    }

    async expandEle(promptElement, eleName) {
        await this.getEleExpandIcon(promptElement, eleName).click();
        await this.waitForElementInvisible(this.getLoadingState(promptElement, eleName));
        return this.sleep(1000); // Wait for animation to complete
    }

    async collapseEle(promptElement, eleName) {
        await this.getEleCollapseIcon(promptElement, eleName).click();
        return this.sleep(500);
    }

    async searchInEle(promptElement, eleName, text) {
        const searchbox = this.getSearchRequiredInput(promptElement, eleName);
        (await this.safeGetElement(searchbox, 'Search box is not displayed.')).setValue(text);
        await this.sleep(2000);
        await browser.keys('Enter');
        return this.sleep(2000);
    }

    async clearSearchInEle(promptElement, eleName) {
        await this.getSearchRequiredInput(promptElement, eleName).click();
        await browser.keys('Home');
        await browser.keys(['Shift', 'End']);
        return browser.keys('Delete');
    }

    async scrollTreeToBottom(promptElement) {
        await scrollElementToBottom(promptElement.$('.mstrTreeViewContents'));
        return this.sleep(500); // Wait for animation to complete
    }

    async goToNextPage(promptElement, attrName) {
        await this.getEleByName(promptElement, attrName).$('.mstrBGIcon_fetchNext').click();
        await this.waitForElementInvisible(this.getLoadingState(promptElement, attrName));
        return this.sleep(1000); // Wait for animation to complete
    }

    async openErrorDetails(promptElement) {
        return this.getErrorLink(promptElement).click();
    }

    /****************************************************************
     * Assertion helper
     ****************************************************************/

    async isExpandIconPresent(promptElement, attrName) {
        return this.getEleExpandIcon(promptElement, attrName).isDisplayed();
    }

    async isCollapseIconPresent(promptElement, attrName) {
        return this.getEleCollapseIcon(promptElement, attrName).isDisplayed();
    }

    async countCSSByLevel(promptElement, level) {
        return this.getCSSByLevel(promptElement, level).length;
    }
}
