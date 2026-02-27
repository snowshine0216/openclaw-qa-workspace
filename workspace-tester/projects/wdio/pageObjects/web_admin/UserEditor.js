import BaseComponent from '../base/BaseComponent.js';
import { scrollElement } from '../../utils/scroll.js';

/**
 * This Object is used to handle all the settings of creating a user
 *
 * You can trigger the setting in following scenarios:
 * Server Manager > User Manager > Creat User, then you can use this object to do the manipulations
 */
export default class UserEditor extends BaseComponent {
    constructor() {
        super('#entMgr_AdminUserEntityTabManagerStyle', 'Create user setting');
    }

    // 'Account Disabled'
    getAccountDisabledCheckBox() {
        return this.$('#disable');
    }

    getPrivilegesListLocator() {
        return this.$('.mstrPrivilegesList');
    }

    getPrivilegeRow(privilege) {
        return this.getPrivilegesListLocator()
            .$$('tr')
            .filter(async (item) => (await item.getText()).includes(privilege))[0];
    }

    async scrollPrivilegesList(toOffset) {
        await this.waitForElementVisible(this.getPrivilegesListLocator());
        return scrollElement(this.getPrivilegesListLocator(), toOffset);
    }

    async inputFullName(text) {
        const input = this.$('#fullName');
        await this.clear({ elem: input });
        return input.setValue(text);
    }

    async inputUserName(text) {
        const input = this.$('#loginName');
        await this.clear({ elem: input });
        return input.setValue(text);
    }

    async inputDesciption(text) {
        const input = this.$('#description');
        await this.clear({ elem: input });
        return input.setValue(text);
    }

    async inputPassword(text) {
        const input = this.$('#password');
        await this.clear({ elem: input });
        return input.setValue(text);
    }

    async confirmPassword(text) {
        const input = this.$('#passwordConfirmed');
        await this.clear({ elem: input });
        return input.setValue(text);
    }

    /**
     * Change the status of 'Account Disabled' checkbox status
     * @param {Boolean} toCheck use this flag to indicate whether to check ot unCheck
     * 1. toCheck not assigned: we'll just click the checkbox, so the status will be reversed
     * 2. toCheck = true, fucntion will make sure the checBox status to be checked
     * 3. toCheck = false, fucntion will make sure the checBox status to be unChecked
     */
    async clickAccountDisabled(toCheck) {
        const ele = this.getAccountDisabledCheckBox();
        const isSelected = await ele.isSelected();
        if (typeof toCheck === 'undefined' || (toCheck && !isSelected) || (!toCheck && isSelected)) {
            await this.click({ elem: ele });
        }
    }

    /**
     * Change the status of 'User must change password at next logon' checkbox status
     * @param {Boolean} toCheck use this flag to indicate whether to check ot unCheck
     * 1. toCheck not assigned: we'll just click the checkbox, so the status will be reversed
     * 2. toCheck = true, fucntion will make sure the checBox status to be checked
     * 3. toCheck = false, fucntion will make sure the checBox status to be unChecked
     */
    async clickPasswordMustChange(toCheck) {
        const elm = this.$('#passwordMustChange');
        const isSelected = await elm.isSelected();
        if (typeof toCheck === 'undefined' || (toCheck && !isSelected) || (!toCheck && isSelected)) {
            await this.click({ elem: elm });
        }
    }

    async clickOk() {
        // There might be multiple elements with id = ok, so limit the scop to this this.getElement()
        await this.$('#ok').click();
        return this.sleep(5000);
    }

    async switchTabTo(tabName) {
        const elm = this.$('#tabSet').element(by.cssContainingText('span', tabName));
        return this.click(elm);
    }

    async selectPrivilege(privilege) {
        let elm = this.getPrivilegeRow(privilege);
        if (!(await elm.isDisplayed())) {
            return since(`${privilege} not shown, maybe the name changed`).expect(true).toBe(false);
        }
        elm = elm.$('img');
        return this.click({ elem: elm });
    }

    /**
     * The privilege num might changed,
     * We can use number attached before the privilige group to find the gorup
     * eg in latest version it's '10. Client - Desktop', but in other version it's '10. Client - Reporter'
     * now we can use '10' to locate it
     * @param {Number} num number attacted before privilige group
     */
    async selectPrivilegeByNum(num) {
        const trLists = this.getPrivilegesListLocator().$$('td[colspan="6"]');
        await this.click({ elem: trLists[num - 1].$('img') });
    }
}
