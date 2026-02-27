import WebBasePage from './../base/WebBasePage.js';
import { scrollIntoView } from '../../utils/scroll.js';
import UserEditor from './UserEditor.js';
import { getAttributeValue } from '../../utils/getAttributeValue.js';

// TODO
// User creator / Group creator use same functions(like inputFullName...) in previous design
// that design has limitation in some cases, and will cause IServerManagePage become bigger and not clear
// now we extract user editor to userEditor(),
// fucntions coverred both User creator / Group creator not removed yet, as for they are referenced
// these functions should be extract to component like userGroupEdior(), and references should be updated
export default class IServerManagePage extends WebBasePage {
    constructor() {
        super();
        this.userEditor = new UserEditor();
    }

    // element locator
    getUserAndGroupTabContainer() {
        return this.$('#entMgr_AdminUserEntityTabManagerStyle,#g_entMgr_AdminUserEntityTabManagerStyle');
    }

    getSecurityRoleTabContainer() {
        return this.$('#srMgr_AdminSecRoleTabManagerStyle');
    }

    getUserManager() {
        return this.$('.mstr-dskt-lnk.usermgr');
    }

    getSecurityRole() {
        return this.$('.mstr-dskt-lnk.rolemgr');
    }

    getNewGroup() {
        return this.$('#tbNewGroup');
    }

    getNewUser() {
        return this.$('#tbNewUser');
    }

    getSearchResultView() {
        return this.$('.mstrListView');
    }

    getSearchResultSection() {
        return this.$('#results_FolderConfigurationSearchResults');
    }

    getSearchResultsRowLists() {
        return this.getSearchResultSection().$('tbody').$$('tr');
    }

    getAdminPathShortcut() {
        return this.$('.mstrAdminPathShortcuts');
    }

    getAdminBtn(text) {
        return this.getAdminPathShortcut()
            .$$('.mstrShortcut')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes(text);
            })[0];
    }

    getFullNameBox() {
        return this.getUserAndGroupTabContainer().$('#fullName');
    }

    getDescriptionBox() {
        return this.getUserAndGroupTabContainer().$('#description');
    }

    getLoginNameBox() {
        return this.getUserAndGroupTabContainer().$('#loginName');
    }

    getPwdBox() {
        return this.getUserAndGroupTabContainer().$('#password');
    }

    getConfirmPwdBox() {
        return this.getUserAndGroupTabContainer().$('#passwordConfirmed');
    }

    getTab(container, text) {
        return container
            .$('#tabSet')
            .$$('span')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes(text);
            })[0];
    }

    getUserAndGroupTab(text) {
        return this.getTab(this.getUserAndGroupTabContainer(), text);
    }

    getSecurityRoleTab(text) {
        return this.getTab(this.getSecurityRoleTabContainer(), text);
    }

    getPriviledgeList() {
        return this.getUserAndGroupTabContainer().$('.mstrPrivilegesList');
    }

    getPriviledgeGroup(name) {
        return this.getPriviledgeList()
            .$$('.ct')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes(name);
            })[0];
    }

    getPriviledgeGroupBox(name) {
        return this.getPriviledgeGroup(name).$('.checkOff,.checkOn,.checkUndefined');
    }

    getPrivilegeName(el) {
        return el.$('.pr').getText();
    }

    getPrivilege(name) {
        return this.getPriviledgeList()
            .$$('.pr')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes(name);
            })[0];
    }

    getPrivilegeBox(name) {
        return this.getParent(this.getParent(this.getPrivilege(name))).$('input');
    }

    // proIndex refers to project index. generaly the first one (0) means Tutorial
    getPriviledgeProjectMark(name, proIndex = 1) {
        return this.getParent(this.getParent(this.getPrivilege(name))).$$('.prNG,.prU,.prNA')[proIndex - 1];
    }

    getSelectedPrivileges() {
        return this.getPriviledgeList().$$('.prU');
    }

    getSearchResults() {
        return this.$('.mstrSearchResultsCount>span');
    }

    getSearchInputBox() {
        return this.$('#srchStr,#nameToSearch');
    }

    getSearchBtn() {
        return this.$(`#tbSearch,#nameSection>nobr>input[value='Search']`);
    }

    getSearchAlertMsg() {
        return this.$('.mstrAlertMessage').getText();
    }

    getMainIcon() {
        return this.$$('.mstrPathIcons .mstrLink')[0];
    }

    getSearchStyle() {
        return this.$('#sb_QuickConfigurationSearchStyle');
    }

    getAdvancedSearchStyle() {
        return this.$('#sb_AdvancedConfigurationSearchStyle');
    }

    getNewSearchBtn() {
        return this.$('.search-new .mstrLink');
    }

    getAdvancedSearchBtn() {
        return this.$('.search-new .search-typeLink-advanced');
    }

    getTypeSection() {
        return this.$('#typesSection');
    }

    getSearchTypeOption(index) {
        return this.getTypeSection().$$(`input[type='checkbox']`)[index - 1];
    }

    getSearchExpDrodown() {
        return this.$('#nameOptions');
    }

    getSearchExpDropDownOption(text) {
        return this.getSearchExpDrodown()
            .$$('option')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes(text);
            })[0];
    }

    getSearchOwnerOption(index) {
        return this.$('#ownerSection').$$('input')[index - 1];
    }

    getSearchDescriptionBox() {
        return this.$('#description');
    }

    getPageNavbar() {
        return this.$$('.mstrFetch')[0];
    }

    getPageNavbarNext() {
        return this.getPageNavbar().$('.mstrFetchIcon.mstrFetchNext');
    }

    getPageNavbarFirst() {
        return this.getPageNavbar().$('.mstrFetchIcon.mstrFetchFirst');
    }

    getSearchResultFirstItem() {
        return this.$$('#SearchResults>tbody>tr')[0];
    }

    getSearchTitle() {
        return this.$$('.mstrTitle')[0];
    }

    getSearchResultFirstItemActionBtn() {
        return this.getSearchResultFirstItem().$('.mstrIcon-tb');
    }

    getOKbtn() {
        return this.$('.mstrTransform #ok');
    }

    getCancelBtn() {
        return this.$('.mstrTransform #cancel');
    }

    getIconViewBtn() {
        return this.$('#tbLargeIcons');
    }

    getListViewBtn() {
        return this.$('#tbListView');
    }

    getRowlist(rowLocator) {
        return this.$(rowLocator).$$('tbody')[0].$$('tr');
    }

    getUserGroupRowList() {
        const rowLocator = '#gpb_UserEntitiesList,#gpb_UserEntitiesIcon';
        return this.getRowlist(rowLocator);
    }

    getUserRowList() {
        const rowLocator = '#UserMgmtList';
        return this.getRowlist(rowLocator);
    }

    getSecurityRoleRowlist() {
        const rowLocator = '#FolderList,#FolderIcons';
        return this.getRowlist(rowLocator);
    }

    getNewAddressBtn() {
        return this.$(`.mstrButton[value='Add a New Address']`);
    }

    getSetDefaultBtn() {
        return this.$(`.mstrButton[value='Set New Default']`);
    }

    getAddressName() {
        return this.$('.edit #dispName');
    }

    getPhysicalAddress() {
        return this.$('.edit #addressValue');
    }

    getAddressSaveBtn() {
        return this.$(`.edit .mstrButton[value='Save']`);
    }

    getAddressRow(name) {
        return this.$('.addressesList.mstrListView>tbody')
            .$$('tr')
            .filter(async (row) => {
                const text = await row.$$('td')[1].getText();
                return text.includes(name);
            })[0];
    }

    getAddresRowDefaultBtn(name) {
        return this.getAddressRow(name).$('input[type="radio"]');
    }

    getAddressRowActionBtn(name, action) {
        return this.getAddressRow(name)
            .$$('.mstrLink')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes(action);
            })[0];
    }

    getConfirmBoxOkBtn() {
        return this.$('.mstrDialogButtonBar #ok');
    }

    getNewSecurotyRoleBtn() {
        return this.$('#tbNewSR');
    }

    // action helper
    async getUserGroupRow(name) {
        await this.click({ elem: this.getListViewBtn() });
        const result = this.getUserGroupRowList().filter(async (row) => {
            const text = await row.$$('td')[2].getText();
            return text === name;
        });
        if (!result.length) {
            await this.click({ elem: this.getPageNavbarNext() });
            await this.sleep(500);
            return this.getUserGroupRow(name);
        }
        return result[0];
    }

    async getUserGroupColumnsText(name, index) {
        const el = await this.getUserGroupRow(name);
        return el.$$('td')[index - 1].getText();
    }

    async getSearchResultRow(name) {
        const rowList = this.getSearchResultsRowLists();
        const result = await rowList.filter(async (row) => {
            const text = await row.$$('td')[1].getText();
            return text.includes(name);
        });
        return result[0];
    }

    async getConlumOnSearchResult(name, index) {
        const el = await this.getSearchResultRow(name);
        return el.$$('td')[index - 1].getText();
    }

    /**
     * Find row by Login name
     * @param {String} name login name
     */
    async getUserRow(name) {
        const result = this.getUserRowList().filter(async (row) => {
            const text = await row.$$('td')[2].getText();
            return text === name;
        });
        if (!result.length) {
            await this.click({ elem: this.getPageNavbarNext() });
            await this.sleep(500);
            return this.getUserRow(name);
        }
        return result[0];
    }

    async getRoleRow(name) {
        const listViewEle = this.$('#tbListView');
        await this.click({ elem: listViewEle });
        const result = this.getSecurityRoleRowlist().filter(async (row) => {
            const text = await row.$$('td')[1].getText();
            return text === name;
        });
        if (!result.length) {
            await this.$('.mstrFetchNext').click();
            await this.sleep(500);
            return this.getRoleRow(name);
        }
        return result[0];
    }

    async logout() {
        await this.click({ elem: this.getAdminBtn('Logout') });
        return this.sleep(3000);
    }

    async openUserManager() {
        await this.click({ elem: this.getUserManager() });
    }

    async openUserManagerByAdminPath() {
        const elem = await this.getAdminBtn('User Manager');
        await this.click({ elem: elem });
        return this.sleep(3000);
    }

    async openSecurityRoleManager() {
        await this.click({ elem: this.getSecurityRole() });
        return this.sleep(3000);
    }

    async openSecurityManagerByAdminPath() {
        await this.getAdminPathShortcut().$$('a')[1].click();
        return this.sleep(3000);
    }

    async openUserEditor(username) {
        await this.searchByName(username);
        await this.waitForElementVisible(this.getSearchResultFirstItem());
        await this.click({ elem: this.getSearchTitle() });
        await this.clickEditOnSearchResultsFirstItem();
    }

    async modifyUserToNeedChangePassword() {
        await this.userEditor.clickPasswordMustChange(true);
        return this.userEditor.clickOk();
    }

    async unlockUser(searchName) {
        await this.openUserEditor(searchName);
        await this.waitForWebCurtainDisappear();
        await this.userEditor.clickAccountDisabled(false);
        return this.userEditor.clickOk();
    }

    async openUserGroupCreator() {
        await this.click({ elem: this.getNewGroup() });
        return this.waitForElementVisible(this.getUserAndGroupTabContainer());
    }

    async openUserCreator() {
        await this.click({ elem: this.getNewUser() });
        await this.waitForElementVisible(this.getUserAndGroupTabContainer());
    }

    async inputFullName(text) {
        await this.click({ elem: this.getFullNameBox() });
        await this.clear({ elem: this.getFullNameBox() });
        return this.getFullNameBox().setValue(text);
    }

    async inputLoginName(text) {
        await this.click({ elem: this.getLoginNameBox() });
        await this.clear({ elem: this.getLoginNameBox() });
        await this.getLoginNameBox().setValue(text);
    }

    async inputDescription(text) {
        await this.click({ elem: this.getDescriptionBox() });
        await this.clear({ elem: this.getDescriptionBox() });
        return this.getDescriptionBox().setValue(text);
    }

    async inputUserPwd(text) {
        await this.waitForElementVisible(this.getPwdBox());
        await this.click({ elem: this.getPwdBox() });
        await this.clear({ elem: this.getPwdBox() });
        return this.getPwdBox().setValue(text);
    }

    async inputUserConfirmPwd(text) {
        await this.waitForElementVisible(this.getConfirmPwdBox());
        await this.click({ elem: this.getConfirmPwdBox() });
        await this.clear({ elem: this.getConfirmPwdBox() });
        return this.getConfirmPwdBox().setValue(text);
    }

    async selectUserAndGroupTab(text) {
        await this.click({ elem: this.getUserAndGroupTab(text) });
    }

    async selectSecurityRoleTab(text) {
        await this.click({ elem: this.getSecurityRoleTab(text) });
    }

    async saveEntity() {
        await this.click({ elem: this.getOKbtn() });
        await this.waitForWebCurtainDisappear();
    }

    async cancelEntity() {
        await this.click({ elem: this.getCancelBtn() });
        return this.sleep(500);
    }

    async modifyUserGroup(name) {
        const userGroupRow = await this.getUserGroupRow(name);
        const editButton = await userGroupRow.$('#tbEdit');
        await this.hover({ elem: userGroupRow });
        await this.click({ elem: editButton });
    }

    async deleteUserGroup(name) {
        const row = await this.getUserGroupRow(name);
        await row.$('[title=Delete]').click();
        await this.sleep(500);
        await this.$('.mstrDialogButtonBar').$('#ok').click();
        return this.sleep(3000);
    }

    async viewUserGroup(name) {
        const userGroupRow = await this.getUserGroupRow(name);
        const viewButton = await userGroupRow.$('span');
        await this.hover({ elem: userGroupRow });
        return this.click({ elem: viewButton });
    }

    async modifyUser(name) {
        const userRow = await this.getUserRow(name);
        const editButton = await userRow.$('#tbEdit');
        await this.hover({ elem: userRow });
        await this.click({ elem: editButton });
    }

    async clickPriviledgeBox(name) {
        await scrollIntoView(this.getPriviledgeGroupBox(name), true);
        await this.click({ elem: this.getPriviledgeGroupBox(name) });
    }

    async clickPriviledge(name) {
        await scrollIntoView(this.getPrivilegeBox(name), true);
        return this.click({ elem: this.getPrivilegeBox(name) });
    }

    async clearPrivileges() {
        const els = await this.getSelectedPrivileges();
        for (const el of els) {
            const name = await this.getPrivilegeName(this.getParent(el));
            if (await this.isPriviledgeProjectChecked(name)) {
                await this.clickPriviledge(name);
            }
        }
    }

    async clearGroupPriviledges(name) {
        await this.openUserManagerByAdminPath();
        await this.clickListView();
        await this.modifyUserGroup(name);
        await this.selectUserAndGroupTab('Project Access');
        await this.clearPrivileges();
        await this.saveEntity();
    }

    async clearUserPrivilege(userName, groupName) {
        await this.openUserManagerByAdminPath();
        await this.clickListView();
        await this.openUserGroup(groupName);
        await this.clickListView();
        await this.modifyUser(userName);
        await this.selectUserAndGroupTab('Project Access');
        await this.clearPrivileges();
        await this.saveEntity();
    }

    /**
     * Delete user
     * @param {String} name login name
     * @param {Boolean} usePattern There is problem to compare returned text with whitspaces, we need to use regExpression to solve
     * userPattern = true, use regExpression to compare the text
     * userPattern = false, directly compare text using '==='
     */
    async deleteUser(name) {
        const row = await this.getUserRow(name);
        await this.hover({ elem: row });
        await row.$('[title=Delete]').click();
        await this.waitForElementVisible($('#msgBox'));
        await this.click({ elem: this.getConfirmBoxOkBtn() });
    }

    async search(text) {
        // await this.getSearchInputBox().clear().setValue(text);
        await this.click({ elem: this.getSearchInputBox() });
        await this.clear({ elem: this.getSearchInputBox() });
        await this.getSearchInputBox().setValue(text);
        await this.click({ elem: this.getSearchBtn() });
    }

    async searchByName(text) {
        await this.search(text);
        return this.waitForElementVisible(
            this.getSearchResultSection(),
            this.defaultWaitTimeout,
            'Search result is not displayed.'
        );
    }

    async openSecurityRoleCreator() {
        await this.click({ elem: this.getNewSecurotyRoleBtn() });
        return this.waitForElementVisible(this.getSecurityRoleTabContainer());
    }

    async inputRoleName(text) {
        const input = this.$('#name');
        await this.clear({ elem: input });
        return input.setValue(text);
    }

    async inputRoleDesc(text) {
        const input = this.$('#desc');
        await this.clear({ elem: input });
        return input.setValue(text);
    }

    async modifyRole(name) {
        const row = await this.getRoleRow(name);
        return row.$('#tbEdit').click();
    }

    async deleteRole(name) {
        const row = await this.getRoleRow(name);
        await row.$('[title="Delete security role"]').click();
        await this.sleep(500);
        await this.$('.mstrDialogButtonBar').$('#ok').click();
        return this.sleep(3000);
    }

    /**
     * Create using with basic setting: user name, full name, description, password
     * @param {String} userName user name
     * @param {String} fullName full name
     * @param {String} description description
     * @param {String} password password
     * @param {String[]} privileges
     * to login, we have to assign some privileges, the basaic privilege for login is '11. Client - Reporter'
     * now we use the number attached before the privilege to locate the privilege group
     */
    async quickCreateUser(userName, fullName, description, password, privileges = ['10']) {
        await this.userEditor.inputUserName(userName);
        await this.userEditor.inputFullName(fullName);
        await this.userEditor.inputDesciption(description);
        await this.userEditor.inputPassword(password);
        await this.userEditor.confirmPassword(password);
        await this.userEditor.switchTabTo('Project Access');
        await this.userEditor.scrollPrivilegesList(200);
        for (const privilege of privileges) {
            await this.userEditor.selectPrivilege(privilege);
        }
        await this.userEditor.switchTabTo('General');
        await this.userEditor.clickOk();
    }

    /**
     * Click user group in group list to open that group
     * @param {String} name group name
     */
    async openUserGroup(name) {
        const elm = await this.getUserGroupRow(name);
        const elem = await elm.$$('a')[0];
        await this.click({ elem: elem });
    }

    async backToServerAdminHome() {
        await this.click({ elem: this.getMainIcon() });
        return this.waitForElementVisible(this.getUserManager());
    }

    async clickNewSearch() {
        await this.click({ elem: this.getNewSearchBtn() });
        return this.waitForElementInvisible(this.getSearchResultSection());
    }

    async clickAdvancedSearch() {
        await this.click({ elem: this.getAdvancedSearchBtn() });
        return this.waitForElementVisible(this.getTypeSection());
    }

    async clickSearchTypeOption(index, text) {
        await this.click({ elem: this.getSearchTypeOption(index) });
    }

    async clickSearchOwnerOption(index, text) {
        await this.click({ elem: this.getSearchOwnerOption(index, text) });
    }

    async clickSearchExpressionDropdownOption(text) {
        await this.click({ elem: this.getSearchExpDrodown() });
        await this.waitForElementVisible(this.getSearchExpDropDownOption(text));
        await this.getSearchExpDropDownOption(text).click();
    }

    async inputSearchDescription(text) {
        await this.click({ elem: this.getSearchDescriptionBox() });
        await this.clear({ elem: this.getSearchDescriptionBox() });
        return this.getSearchDescriptionBox().setValue(text);
    }

    async clickPageNext() {
        await this.click({ elem: this.getPageNavbarNext() });
    }

    async clickPageFirst() {
        await this.click({ elem: this.getPageNavbarFirst() });
    }

    async clickEditOnSearchResultsFirstItem() {
        await this.moveToElement(this.getSearchResultFirstItem());
        await this.hover({ elem: this.getSearchResultFirstItem() });
        await this.click({ elem: this.getSearchResultFirstItemActionBtn() });
    }

    async clickIconView() {
        return this.click({ elem: this.getIconViewBtn() });
    }

    async clickListView() {
        return this.click({ elem: this.getListViewBtn() });
    }

    async clickNewAddressBtn() {
        await this.click({ elem: this.getNewAddressBtn() });
        return this.waitForElementVisible(this.getAddressName());
    }

    async inputAddressName(name) {
        await this.waitForElementVisible(this.getAddressName());
        await this.click({ elem: this.getAddressName() });
        await this.clear({ elem: this.getAddressName() });
        return this.getAddressName().setValue(name);
    }

    async inputPhysicalAddress(name) {
        await this.waitForElementVisible(this.getPhysicalAddress());
        await this.click({ elem: this.getPhysicalAddress() });
        await this.clear({ elem: this.getPhysicalAddress() });
        return this.getPhysicalAddress().setValue(name);
    }

    async createAndSaveAddress(name, value) {
        await this.clickNewAddressBtn();
        await this.inputAddressName(name);
        await this.inputPhysicalAddress(value);
        return this.clickAddressSaveBtn();
    }

    async clickAddressSaveBtn() {
        await this.click({ elem: this.getAddressSaveBtn() });
    }

    async selectAndSaveDefaultAddress(name) {
        await this.click({ elem: this.getAddresRowDefaultBtn(name) });
        await this.click({ elem: this.getSetDefaultBtn() });
    }

    async clickAddressRowActionBtn(name, action) {
        return this.click({ elem: this.getAddressRowActionBtn(name, action) });
    }

    async clickConfirmBoxOkBtn() {
        await this.click({ elem: this.getConfirmBoxOkBtn() });
    }

    // assertion helper

    async isEntityInSearchResult(text) {
        const isReturned = await this.getSearchResults().isDisplayed();
        if (isReturned) {
            return (await this.getSearchResultRow(text)).isDisplayed();
        }
        return false;
    }

    async getSearchResultsCount() {
        const el = await this.getSearchResults().getText();
        return Number(el);
    }

    async isPrivildgeGroupChecked(name) {
        const el = await this.getPriviledgeGroupBox(name);
        const clsName = await getAttributeValue(el, 'className');
        return clsName.includes('checkOn') || clsName.includes('checkUndefined');
    }

    async isIconViewSelected() {
        const el = await this.getIconViewBtn();
        return this.isSelected(el);
    }

    async isListViewSelected() {
        const el = await this.getListViewBtn();
        return this.isSelected(el);
    }

    async isAddressDefaultChecked(name) {
        const el = await this.getAddresRowDefaultBtn(name);
        return el.isSelected();
    }

    async isPriviledgeProjectChecked(name, index = 1) {
        const el = await this.getPriviledgeProjectMark(name, index);
        const clsName = await getAttributeValue(el, 'className');
        return clsName.includes('prU');
    }

    async isTabPresent(text) {
        return this.getUserAndGroupTab(text).isDisplayed();
    }
}
