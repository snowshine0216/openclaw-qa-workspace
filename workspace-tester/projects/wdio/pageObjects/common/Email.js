import BasePage from '../base/BasePage.js';
import { GmailService } from '../../api/3rdparty/gmailService.js';
import DossierPage from '../dossier/DossierPage.js';
import LibraryPage from '../library/LibraryPage.js';

export default class Email extends BasePage {
    constructor() {
        super();
        this.dossierPage = new DossierPage();
        this.libraryPage = new LibraryPage();
    }

    // Action helper
    async recieveEmail(userName) {
        // refresh email list first
        await GmailService.refresh();
        const emailMap = GmailService.getUserEmailMap();
        console.log('email map is:' + JSON.stringify(emailMap));
        let userEmail = emailMap[userName];
        console.log('user email is :' + JSON.stringify(userEmail));
        //retry 30 times to wait for email list updated
        let maxRetryTime = 30;
        while (maxRetryTime && !userEmail) {
            console.log('Try to fetch: ' + maxRetryTime + ' times');
            await GmailService.refresh();
            userEmail = emailMap[userName];
            await this.sleep(10000);
            maxRetryTime--;
        }

        if (userEmail) {
            return userEmail;
        } else {
            console.log('Could not recieve email of : ' + userName + ' After ' + maxRetryTime + ' times');
            return this.sleep(500);
        }
    }

    async getSharedMsg(userName) {
        const userEmail = await this.recieveEmail(userName);
        const userLatestEmail = userEmail[0];

        return userLatestEmail.inviteMessage.trim();
    }

    async getMentionTitle(userName) {
        const userEmail = await this.recieveEmail(userName);
        const userLatestEmail = userEmail[0];
        return userLatestEmail.mentionContent;
    }

    async getMentionMessage(userName) {
        const userEmail = await this.recieveEmail(userName);
        const userLatestEmail = userEmail[0];
        return userLatestEmail.mentionMessage;
    }

    async getInviteContent(userName, trim = true) {
        const userEmail = await this.recieveEmail(userName);
        const userLatestEmail = userEmail[0];
        return trim ? userLatestEmail.inviteContent.trim() : userLatestEmail.inviteContent;
    }

    async getInviteMessage(userName, trim = true) {
        const userEmail = await this.recieveEmail(userName);
        const userLatestEmail = userEmail[0];
        return trim ? userLatestEmail.inviteMessage.trim() : userLatestEmail.inviteMessage;
    }

    async getBrowserLink(userName) {
        const userEmail = await this.recieveEmail(userName);
        const userLatestEmail = userEmail[0];
        return userLatestEmail.browserLink;
    }

    async getAddedContent(userName) {
        const userEmail = await this.recieveEmail(userName);
        const userLatestEmail = userEmail[0];
        return userLatestEmail.memberAddedContent;
    }

    async openViewInBrowserLink(userName) {
        const userEmail = await this.recieveEmail(userName);
        const userLatestEmail = userEmail[0];

        //get web link in email content
        const link = userLatestEmail.browserLink;
        console.log('------------email link---------');
        console.log(link);

        //open the email link in browser
        console.log('------------open link from email---------');
        await browser.url(link);
        await this.dossierPage.waitForDossierLoading();
        return this.sleep(3000);
    }

    async clearMsgBox() {
        await GmailService.refresh();
        await GmailService.clearAll();
    }

    // Assertion helper
}
