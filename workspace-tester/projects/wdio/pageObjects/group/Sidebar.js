import Group from '../group/Group.js';
import BasePage from '../base/BasePage.js';

export default class Sidebar extends BasePage {
    constructor() {
        super();
        this.group = new Group();
    }

    // locator
    getSidebarContainer() {
        return this.$('.mstrd-SidebarContainer');
    }

    getMobileSidebarContainer() {
        return this.$('.mstrd-SidebarContainer-content');
    }
    getSidebarBorder() {
        const parent = this.getParent(this.getSidebarContainer());
        return parent.$('.mstrd-resizable-handler');
    }

    getPredefinedMenuSection() {
        return this.$('.mstrd-PredefinedMenuSection');
    }

    getPredefinedSectionItem(item) {
        return this.$$('.mstrd-PredefinedMenuSection-item').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText.includes(item);
        })[0];
    }

    getPredefinedSectionItems() {
        return this.$$('.mstrd-PredefinedMenuSection-item');
    }

    getGrayedPredefinedSectionItems() {
        return this.$$('.mstrd-PredefinedMenuSection-item').filter(async (elem) => {
            const elemText = await elem.getCSSProperty('color');
            return elemText.value === 'rgba(41,49,59,0.4)';
        });
    }

    getAllSection(hasSubmenu = false) {
        // add hasSubmenu flag to distinguish different All selector
        if (hasSubmenu) {
            return this.$('.mstrd-AllMenuSection-title');
        } else {
            let icon = this.$('.icon-group_all');
            return this.getParent(icon);
        }
    }

    getAllToggleButton() {
        return this.$('.mstrd-AllMenuSection-toggleButton');
    }

    getBotSection(i18nText = 'Bots') {
        return this.getAllSubSection(i18nText);
    }

    getAnalysisSection(i18nText = 'Analysis') {
        return this.getAllSubSection(i18nText);
    }

    getAllSubSection(text) {
        return this.$(`.mstrd-AllMenuSection-item*=${text}`);
    }

    getDefaultGroups() {
        return this.$('.mstrd-GroupMenuSection-titleText');
    }

    async getDefaultGroupsTitle() {
        return this.getDefaultGroups().getText();
    }

    async hoverOnContentBundleTitle() {
        await this.hover({ elem: this.getDefaultGroups() });
        await this.waitForElementVisible(this.getTooltipContainer(), {
            timeout: 1000,
            msg: 'Tooltip took too long to display',
        });
    }

    getAddGroupBtn() {
        return this.getSidebarContainer().$('.mstrd-GroupMenuSection-add');
    }

    getAddGroupBtnForSaas() {
        return this.getSidebarContainer().$('.icon-pnl_add-new');
    }

    getGroupList() {
        return this.getSidebarContainer().$('.mstrd-GroupMenuSection-listView');
    }

    getGroupSections() {
        return this.getSidebarContainer().$$('.mstrd-GroupMenuSection-item');
    }

    getGroupSection(name) {
        return this.getSidebarContainer()
            .$$('.mstrd-GroupMenuSection-item')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === name;
            })[0];
    }

    getGroupOptions(name) {
        return this.getGroupSection(name).$('.mstrd-GroupMenuSection-more.mstrd-ContextMenu-trigger');
    }

    getGroupOptionsMenu() {
        return this.getSidebarContainer().$('.mstrd-GroupContextMenu');
    }

    getGroupOptionMenuItem(text) {
        // return this.getGroupOptionsMenu().element(by.cssContainingText('.mstrd-ContextMenu-item', text));
        return this.getGroupOptionsMenu().$(`.mstrd-ContextMenu-item*=${text}`);
    }

    getGroupCollapseButton() {
        return this.$('.mstrd-GroupMenuSection-toggleButton');
    }

    getDeleteConfirmation() {
        return this.$('.mstrd-ConfirmationDialog');
    }

    getDeleteConfirmBtn(text) {
        // return this.getDeleteConfirmation().element(by.cssContainingText('.mstrd-ConfirmationDialog-button', text));
        return this.getDeleteConfirmation().$(`.mstrd-ConfirmationDialog-button*=${text}`);
    }

    getSubscriptionLoadingIcon() {
        return this.$('.mstrd-SubscriptionLoadingStatus');
    }

    get SnapshotsIcon() {
        return this.$('.icon-mstrd_snapshots');
    }

    get SnapshotsSection() {
        return this.getParent(this.SnapshotsIcon);
    }

    // action
    async clickPredefinedSection(item) {
        return this.click({ elem: this.getPredefinedSectionItem(item) });
    }

    async clickAllSection(hasSubmenu = false) {
        return this.click({ elem: this.getAllSection(hasSubmenu) });
    }

    async expandAllSection() {
        if (!(await this.isAllExpanded())) {
            return this.click({ elem: this.getAllToggleButton() });
        }
    }

    async clickBotSecion() {
        return this.click({ elem: this.getBotSection() });
    }

    async clickAnalysisSection() {
        return this.click({ elem: this.getAnalysisSection() });
    }

    async clickAllSubSection(text) {
        return this.click({ elem: this.getAllSubSection(text) });
    }

    async openFavoriteSectionList() {
        return this.clickPredefinedSection('Favorites');
    }

    async openAllSectionList(hasSubmenu = false) {
        // if subMenu displayed, set flag to be true
        await this.clickAllSection(hasSubmenu);
        return this.sleep(4000); //wait for group show
    }

    async openRecentsSectionList() {
        return this.clickPredefinedSection('Recents');
    }

    async openMyContentSectionList() {
        return this.clickPredefinedSection('My Content');
    }

    async openBookmarkSectionList() {
        return this.clickPredefinedSection('Bookmarks');
    }

    async openSnapshotsSectionList() {
        await this.click({ elem: this.SnapshotsSection });
        return this.waitForDynamicElementLoading();
    }

    async openContentDiscovery(locale = 'en') {
        let option = 'Browse Folders';
        switch (locale) {
            case 'en':
                option = 'Browse Folders';
                break;
            case 'zh':
                option = '瀏覽資料夾';
                break;
            case 'pl':
                option = 'Przeglądaj foldery';
                break;
            case 'ja':
                option = 'フォルダーを参照';
                break;
            case 'ko':
                option = '폴더 찾아보기';
                break;
            default:
        }
        await this.clickPredefinedSection(option);
        await this.waitForDynamicElementLoading();
    }

    async openDataSection(name = 'Data') {
        await this.clickPredefinedSection(name);
        await this.waitForDynamicElementLoading();
        await this.waitForCurtainDisappear();
    }

    async openInsightsList() {
        return this.clickPredefinedSection('Insights');
    }

    async clickAddGroupBtn() {
        await this.waitForElementVisible(this.getSidebarContainer());
        await this.click({ elem: this.getAddGroupBtn() });
        return this.waitForElementVisible(this.group.getGroupDialog());
    }

    async clickGroupOptions(name) {
        await this.hover({ elem: this.getGroupSection(name) });
        await this.click({ elem: this.getGroupOptions(name) });
        return this.waitForElementVisible(this.getGroupOptionsMenu());
    }

    async selectGroupEditOption() {
        await this.click({ elem: this.getGroupOptionMenuItem('Edit Group') });
        return this.waitForElementVisible(this.group.getGroupDialog());
    }

    async selectGroupDeleteOption() {
        await this.click({ elem: this.getGroupOptionMenuItem('Delete Group') });
    }

    async confirmDelete() {
        await this.click({ elem: this.getDeleteConfirmBtn('Yes') });
        await this.waitForElementInvisible(this.getDeleteConfirmation());
    }

    async cancelDelete() {
        return this.click({ elem: this.getDeleteConfirmBtn('No') });
    }

    async deleteGroup() {
        await this.click({ elem: this.getGroupOptionMenuItem('Delete Group') });
        await this.confirmDelete();
        //return this.sleep(this.DEFAULT_API_TIMEOUT); // wait for response returned
    }

    async openGroupSection(name) {
        await this.waitForElementVisible(this.getSidebarContainer());
        await this.hover({ elem: this.getGroupSection(name) });
        return this.click({ elem: this.getGroupSection(name) });
    }

    async getGroupColor(name) {
        return this.getGroupSection(name).$('.mstrd-GroupMenuSection-circle').getAttribute('style');
    }

    async clickGroupCollapseButton() {
        return this.click({ elem: this.getGroupCollapseButton() });
    }

    async dragSidebarWidth(offset) {
        return this.dragAndDrop({
            fromElem: this.getSidebarBorder(),
            toElem: this.getSidebarBorder(),
            toOffset: { x: offset, y: 0 },
        });
    }

    // assertion
    async getGroupCount() {
        return this.getGroupSections().length;
    }

    // to confirm
    async isGroupExisted(name) {
        const el = await this.getGroupSections();
        return this.isExisted(name, el, 'text');
    }

    async isGroupEmpty() {
        // const el = await this.getGroupSections().isDisplayed();
        // if this.getGroupSections().length is 0, return true, else return false
        const el = await this.getGroupSections().length;
        return !el;
    }

    async openSubscriptions() {
        await this.clickPredefinedSection('Subscriptions');
        return this.waitForSubscriptionLoading();
    }

    async waitForSubscriptionLoading() {
        //this.waitForItemLoading();
        await this.sleep(500);
        return this.getSubscriptionLoadingIcon()
            .isDisplayed()
            .then((elementPresent) => {
                if (elementPresent) {
                    return this.waitForElementInvisible(this.getSubscriptionLoadingIcon(), {
                        timeout: 10000,
                        msg: 'Loading subscriptions takes too long.',
                    });
                    // return this.brwsr.wait(
                    //     this.EC.not(this.EC.presenceOf(this.getSubscriptionLoadingIcon())),
                    //     10000,
                    //     'Loading subscriptions takes too long.'
                    // );
                }
                return this.sleep(1000);
            });
    }

    async isGroupClickable(name) {
        return this.getGroupSection(name).isDisplayed();
    }

    async sidebarWidth() {
        const sidebarSize = await this.getSidebarContainer().getSize();
        const width = Math.round(sidebarSize.width / 10) * 10;
        return width;
    }

    async isPredefinedSectionItemPresent(item) {
        return this.getPredefinedSectionItem(item).isDisplayed();
    }

    async isAllExpanded() {
        const allToggleButton = await this.getAllToggleButton();
        const expand = await allToggleButton.getAttribute('aria-expanded');
        return expand === 'true';
    }

    async isAllSubsectionVisible(text) {
        return this.getAllSection(text).isDisplayed();
    }

    async getGrayedSectionNames() {
        const text = await this.getGrayedPredefinedSectionItems().map((cell) => cell.getText());
        return text;
    }

    async getSelectedSectionName() {
        const isAllSelected = await this.getAllSection().getAttribute('aria-selected');
        if (isAllSelected === 'true') {
            return 'All';
        } else {
            console.log('not all');
            return this.getPredefinedSectionItems()
                .filter(async (elem) => {
                    const value = await elem.getText();
                    const isSelected = await this.isSelected(elem);
                    return isSelected;
                })[0]
                .getText();
        }
    }

    async getPredefinedSectionItemsCount() {
        const count = await this.getPredefinedSectionItems().length;
        return count;
    }

    async getPredefinedSectionItemsTexts() {
        const texts = await this.getPredefinedSectionItems().map((cell) => cell.getText());
        return texts;
    }

    async isAddGroupBtnForSaaSHidden() {
        return this.isHidden(this.getAddGroupBtnForSaas());
    }

    async isAddGroupBtnForSaaSDisplayed() {
        return (await this.getAddGroupBtnForSaas()).isDisplayed();
    }

    async isAllSectionSelected() {
        const el = await this.getParent(this.getAllSection());
        return this.isSelected(el);
    }

    async isDataSectionPresent() {
        return this.getPredefinedSectionItem('Data').isDisplayed();
    }

    async isSnapshotsSectionPresent() {
        return this.SnapshotsSection.isDisplayed();
    }

    async isBookmarksSectionPresent() {
        return this.getPredefinedSectionItem('Bookmarks').isDisplayed();
    }
}
