import BasePage from '../../base/BasePage.js';
import LoadingDialog from '../../dossierEditor/components/LoadingDialog.js';
import Common from '../Common.js';

/**
 * Page represing the ngm Format panel
 * @extends BasePage
 * @author Tian Ma <tima@microstrategy.com>
 */
export default class NgmFormatPanel extends BasePage {
    constructor() {
        super();
        this.loadingDialog = new LoadingDialog();
        this.common = new Common();
    }

    // ELEMENT LOCATORS

    /** @type {Promise<ElementFinder>} */
    get formatPanelTab() {
        return this.$("//div[contains(@class, 'mstrmojo-VIIconTabList')]/descendant::div[contains(@class, '$tab')]");
    }

    /** Switch to Format panel from editor panel or Filter panel. Format panel has to be enabled for doing this manipulation
     */
    async openFormatPanel() {
        await this.clickOnElement(this.formatPanelTab);
    }

    /**
     * switch to relevant panel tab
     * @param name: the panel selector, "Data Exploration", "Trend Lines", "Reference Lines", etc.
     * @author tima
     */
    async switchFormatPanel(name) {
        await this.openFormatPanel();
        const xpath = "//div[text() = '%1$s']/ancestor::div[contains(@class,'mstrmojo-ui-Pulldown')]";
        const we = await this.$(xpath.replace('%1$s', name));
        await we.waitForExist();
        await we.click();

        const xpath2 = "//div[text() = '%1$s' and contains(@class, 'item')]";
        const we2 = await this.$(xpath2.replace('%1$s', name));
        await we2.waitForExist();
        await we2.click();
    }

    /**
     * switch to specified property group accordingly
     * @param groupName
     * @throws AWTException
     */
    async select(groupName) {
        // Note: 'groups' variable is not defined in the original code
        // This might need to be implemented or imported from another module
        // await this.groups.locate('Data Exploration').select(groupName);
        // await this.groups.locate('Title and Container').select(groupName);

        console.log(`Selecting group: ${groupName}`);
        // TODO: Implement proper group selection logic
    }
}
