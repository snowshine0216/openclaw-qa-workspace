import BasePage from '../base/BasePage.js';
import { scrollIntoView } from '../../utils/scroll.js';

export default class FolderTreeView extends BasePage {
    constructor() {
        super('#tree_ftb_FolderTreeView', 'Folder Tree View Component');
    }

    // Element Locators
    getFolderTreeView() {
        return this.$('#tree_ftb_FolderTreeView');
    }

    getItemByText(text) {
        return this.getElement().$$('.itemContainer').filter(async (item) => (await item.getText()).includes(text))[0];
    }

    getTreeLodingIcon() {
        return this.$('#divTreeWait');
    }

    // Action helpers
    async expandItem(treeItem) {
        await scrollIntoView(treeItem);
        // Click the edge of the tree item to expand it
        const location = await this.getElementPositionOfScreen(treeItem);

        let xCoords = location.x;
        let yCoords = location.y;

        xCoords = xCoords > 0 ? xCoords - 12 : 0;
        yCoords = yCoords > 0 ? yCoords - 15 : 0;
        await browser.performActions([
            {
                type: 'pointer',
                id: 'finger1',
                parameters: {
                    pointerType: 'mouse',
                },
                actions: [
                    {
                        type: 'pointerMove',
                        duration: 0,
                        x: xCoords,
                        y: yCoords,
                        origin: 'viewport',
                    },
                    { type: 'pointerDown', button: 0 },
                    { type: 'pointerUp', button: 0 },
                ],
            },
        ]);
        await browser.releaseActions();
        await this.sleep(1000);
    }

    /**
     * Expand folder tree and click the last item to open the folder in the right folder panel
     * @param {String[]} paths paths the text(name) array of the items
     */
    async open(paths, isExpand = true) {
        const copyPath = [...paths];
        const lastItem = copyPath.pop();

        // Expand privious path
        if (isExpand) {
            await this.expandOrCollapseByPath(copyPath, true);
        }
        // Click last tree item to open it
        const currentLevel = await this.$('#tree_ftb_FolderTreeView')
            .$$('ul')
            .filter((item) => item.isDisplayed())[0];
        const target = currentLevel.$$('li').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText === lastItem;
        })[0];
        //const v = await targets.length;
        const v = await target.isDisplayed();
        await this.expandItem(target);
        await this.click({ elem: target.$('a') });
    }

    getWaitCurtain() {
        return this.$('#mstrWeb_waitCurtain');
    }

    /**
     * There will be loading icons when expanding the folder tree first time
     * @param {Number} timeout timeout
     */
    async waitTreeLoading(timeout = 10) {
        await this.waitForElementInvisible(this.getWaitCurtain(), timeout);
        await this.waitForElementInvisible(this.getTreeLodingIcon(), timeout);
    }

    /**
     * Sometimes we need to test the expand effects and no need to open a folder to trigger the reload
     *
     * Why expand and collapse use same function?
     *  a. collapse will use same logic to locate the items in paths
     *  b. we only need to handle collapse of the last item in paths (which means click the last item)
     *  c. expand/collapse both achieved by click the same arrow icon of the item
     *
     * How to use?
     * When pass 'isExpand=true', please make sure all the folders in paths are not expanded
     * When pass 'isExpand=false', please make sure all the folders in paths are expanded
     * If you want to collapse or expand a folder tree in other scenarios, please use clickItemByText(*)
     *
     *  Notice:
     *  We have to make sure the first item have arrow icon when calling this function (you may need to call ClickEntryItem(*) first time calling this function)
     *  We suppose all items in path have arrow icon when calling this function
     *  We suppose isExpand is correctly passed
     *
     * @param {String[]} paths the text(name) array of the items
     * @param {Boolean} isExpand if expand the tree view set to true, is collapse tree view set to false
     */
    async expandOrCollapseByPath(paths, isExpand = true) {
        let currentLevel = await this.getFolderTreeView();

        for (const [index, path] of paths.entries()) {
            currentLevel = await currentLevel.$$('ul').filter((item) => item.isDisplayed())[0];
            const target = await currentLevel.$$('li').filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === path;
            })[0];
            if (isExpand) {
                await this.expandItem(target);
                await this.waitTreeLoading();
            }

            // If collapse a path, click the last path to collapse it
            if (!isExpand && index === paths.length - 1) {
                await this.expandItem(target);
            }
        }
    }

    async collapseByPath(paths) {
        let currentLevel = await this.getFolderTreeView();
        for (let i = paths.length - 1; i >= 0; i--) {
            currentLevel = await currentLevel.$$('ul').filter((item) => item.isDisplayed())[0];
            const target = await currentLevel.$$('li').filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === paths[i];
            })[0];
            await this.expandItem(target);
            await this.waitTreeLoading();
        }
        
    }

    /**
     * Click item in tree view, right main panel will be refreshed with that folder contents
     * @param {String} text item text in left panel
     */
    async clickItemByText(text) {
        await this.click({ elem: this.getItemByText(text) });
    }

    // Assersion helper

    /**
     * Check whether the item shwon in tree view
     * @param {String} text item text
     */
    async isItemShownByText(text) {
        return this.getItemByText(text).isDisplayed();
    }
}
