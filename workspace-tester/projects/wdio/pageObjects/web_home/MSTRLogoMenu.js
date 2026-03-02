import BaseComponent from '../base/BaseComponent.js';

/**
 * This object is used to open the 'M' icon menu on the topleft corner of the page and select options
 *
 * The options in the MSTR logo menu are similar to those in the left tool bar of folder page
 * Hover over on 'M' icon and click triangle button next to it to expand options of MSTR logo menu
 * Click 'Recents' button in the opened MSTR logo menu to open a recents panel to view recently executed objects
 */
export default class MSTRLogoMenu extends BaseComponent {
    constructor() {
        super('#mstrLogoMenu', 'MSTR Logo Menu');
    }

    // Element locator

    getAllPopup() {
        return this.$$('.mstrmojo-Popup.mstrShortcutsListPopup');
    }

    getMSTRLogoPopup() {
        return this.getAllPopup()[0];
    }

    getRecentsButton() {
        return this.getMSTRLogoPopup().$('.item.recentObjects');
    }

    getRecentsPopup() {
        return this.getAllPopup()[1];
    }

    // Action Helper

    async openMSTRMenu() {
        await this.moveToElement($('#mstrLogo'));
        await this.click({ elem: this.getElement() });
        await this.waitForElementVisible(this.getMSTRLogoPopup());
    }

    /**
     * Click Recents button in MSTR logo menu and open recents panel
     */
    async openMSTRMenuRecentsPanel() {
        await this.click({ elem: this.getRecentsButton() });
        await this.waitForElementVisible(this.getRecentsPopup());
    }
}
