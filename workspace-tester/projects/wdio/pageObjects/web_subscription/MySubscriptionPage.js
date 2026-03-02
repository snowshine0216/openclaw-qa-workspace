import WebBasePage from '../base/WebBasePage.js';
import LeftToolbar from '../web_home/LeftToolbar.js';
import { scrollIntoView } from '../../utils/scroll.js';

export default class MySubscriptionPage extends WebBasePage {
    static SubscriptionTypes = {
        SharedLink: 1,
        PersonalView: 2,
        HistoryList: 3,
        Mobile: 4,
        CubeCacheUpdate: 5,
        Email: 6,
        FTP: 7,
        File: 8,
        Print: 9,
    };

    constructor() {
        super();
        this.leftToolbar = new LeftToolbar();
    }

    getSubscriptionContent() {
        return this.$('#mstrWeb_content');
    }

    async getItemRow(name, index) {
        const section = await this.getSubscriptionContent().$(`form[name="mstrForm"]:nth-of-type(${index}) table`);
        return section.$$('tr').filter(async (item) => {
            const text = await item.$('td:nth-child(3)').getText();
            return text === name;
        })[0];
    }

    getItemRows(name, index) {
        const section = this.getSubscriptionContent().$(`form[name="mstrForm"]:nth-of-type(${index}) table`);
        const itemRows = section.$$('tr').filter(async (item) => {
            const text = await item.$('td:nth-child(3)').getText();
            return text === name;
        });
        return itemRows;
    }

    async getEditSubscriptionButton(name, index) {
        const itemRow = await this.getItemRow(name, index);
        return itemRow.$('.mstrIcon-tb.ncsEdit');
    }

    async getSubscriptionLink(name, index) {
        const itemRow = await this.getItemRow(name, index);
        return itemRow.$('.mstrLink');
    }

    /**
     * Remove all the subscriptions that match the name for a certain type
     * @param {*} name The name of subscription's target report/document
     * @param {*} index 0: Shared links, 1: Personal view, 2: History list, 3: Mobile, 4: Cube/Cache update 5: Email
     */
    async removeByTargetName(name, index) {
        const section = await this.getSubscriptionContent().$(`form[name="mstrForm"]:nth-of-type(${index}) table`);
        const itemRow = await this.getItemRow(name, index);
        await itemRow.$('td:last-child input').click();
        await this.scrollToCenter(index);
        await section.$('thead td:last-child input').click();
        await this.waitForCurtainDisappear();
    }

    async removeAllByTargetName(name, index) {
        const itemRows = await this.getItemRows(name, index).length;
        for (let i = 0; i < itemRows; i++) {
            await this.removeByTargetName(name, index);
            await this.openHomePage();
            await this.leftToolbar.openSubscriptionPanel();
        }
    }

    getSubscriptionByName(name) {
        return this.$$('.mstrLink').filter(async (elem) => {
            const elemName = await elem.getText();
            return elemName.includes(name);
        })[0];
    }

    async scrollToCenter(sectionIndex) {
        const section = await this.$(`.mstrTitle:nth-of-type(${sectionIndex})`);
        await scrollIntoView(section, { block: 'center' });
    }

    async scrollToSection(sectionIndex) {
        const section = await this.$(`.mstrTitle:nth-of-type(${sectionIndex})`);
        await scrollIntoView(section, true);
    }

    async openSubscriptionByName(name) {
        const subscription = this.getSubscriptionByName(name);
        // Sometimes the waiting box would appear again after the rsd loaded.
        // and no better way to handle this, so we added a sleep here.
        await this.sleep(1000);
        await this.click({ elem: subscription });
    }

    async openSubscriptionLink(name, index) {
        const el = await this.getSubscriptionLink(name, index);
        await this.scrollToCenter(index);
        await this.click({ elem: el });
    }

    async editMySubscription(name, index) {
        const el = await this.getEditSubscriptionButton(name, index);
        await this.scrollToCenter(index);
        await this.click({ elem: el });
    }

    findMobileAlertEditor() {
        return new AlertEditor('mobileAlertEditor_MobileAlertsSubscriptionEditStyle');
    }

    findEmailAlertEditor() {
        return new AlertEditor('alertEditor_AlertsSubscriptionEditStyle');
    }

    async getRecipient(name, index) {
        const itemRow = await this.getItemRow(name, index);
        const text = await itemRow.$('td:nth-child(6)').getText();
        return text;
    }

    async getAddress(name, index) {
        const itemRow = await this.getItemRow(name, index);
        const text = await itemRow.$('td:nth-child(7)').getText();
        return text;
    }

    async isSubscriptionPresent(name, index) {
        const itemRow = await this.getItemRows(name, index).length;
        if (itemRow === 0) {
            return false;
        }
        return true;
    }
}
