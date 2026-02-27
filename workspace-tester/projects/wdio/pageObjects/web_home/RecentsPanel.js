import { getAttributeValue } from '../../utils/getAttributeValue.js';
import BaseComponent from '../base/BaseComponent.js';

export default class RecentsPanel extends BaseComponent {
    constructor() {
        super(null, '#mstrRecentsGenPopup.mstrmojo-Popup', 'List of Recent Objects');
    }

    // Element locator

    getRecentsPopupItems() {
        return this.getElement().$('.mstrmojo-ListBase').$$('.item.mstrMenuItem');
    }

    getNthRecentsPopupItem(index) {
        const NthObject = this.getRecentsPopupItems()[index - 1];
        return NthObject;
    }

    getNthRecentsLink(index) {
        const NthObjectLink = this.getNthRecentsPopupItem(index).$('.mstrLink');
        return NthObjectLink;
    }

    // Action Helper

    async getNthObjectNameOfRecents(index) {
        const NthObjectLink = this.getNthRecentsLink(index);
        const objectName = await NthObjectLink.$('div').getText();
        return objectName;
    }

    async clickNthObjectOfRecents(index) {
        const NthObject = this.getNthRecentsLink(index);
        await this.click({ elem: NthObject });
    }

    async clickRecentObject(name) {
        const recentObject = this.getElement().$$('.mstrLink').filter(async (item) => (await item.getText()).includes(name))[0];
        await this.click({ elem: recentObject });
    }

    async getNthObjectIconClassOfRecents(index) {
        const NthObjectIcon = this.getNthRecentsPopupItem(index).$('span');
        const objectIconClass = await getAttributeValue(NthObjectIcon, 'class');
        return objectIconClass;
    }

    // Assertion Helper

    /**
     * Check whether the recents panel shows any recent items
     */
    async isAnyObjectInRecents() {
        const objectsCount = await this.getElement().$$('.mstrLink').filter(async (item) => (await item.getText()).includes('No recent items')).length;
        return objectsCount === 0;
    }

    /**
     * Check whether there is Recovery object option in the recents panel
     */
    async isRecoveryInRecents() {
        let result = false;
        if (await this.isAnyObjectInRecents()) {
            const countOfRecoveryIcons = await this.getElement().$$('.mstrIcon-lv.mstrIcon-recover').length;
            if (countOfRecoveryIcons > 0) {
                result = true;
            }
        }
        return result;
    }

    /**
     * Check whether the recents panel is clickable
     */
    async isRecentsClickable() {
        const style = await this.getElement().getAttribute('style');
        return !style.includes('pointer-events: none;');
    }
}
