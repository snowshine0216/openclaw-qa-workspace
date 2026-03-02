import BasePage from '../base/BasePage.js';
import { GmailService } from '../../api/3rdparty/gmailService.js';
import DossierPage from '../dossier/DossierPage.js';
import LibraryPage from '../library/LibraryPage.js';

export default class SaaS_Email extends BasePage {
    constructor() {
        super();
        this.dossierPage = new DossierPage();
        this.libraryPage = new LibraryPage();
    }

    // Action helper
    async recieveEmail(userName) {
        let userEmail = await this.getUserEmail(userName);
        //console.log('user email is for saas :' + JSON.stringify(userEmail));
        //retry 30 times to wait for email list updated
        let maxRetryTime = 30;
        while (maxRetryTime && !userEmail) {
            console.log('Try to fetch: ' + maxRetryTime + ' times');
            userEmail = await this.getUserEmail(userName);
            await this.sleep(10000);
            maxRetryTime--;
        }

        if (userEmail) {
            return userEmail;
        } else {
            console.log('Could not recieve email of : ' + userName + 'After' + maxRetryTime + ' times');
            return this.sleep(500);
        }
    }

    async getUserEmail(userName) {
        // refresh email list first
        await GmailService.refresh();
        const emailMap = GmailService.getUserEmailMap();
        //console.log('email map is for saas :' + JSON.stringify(emailMap));
        for (let key in emailMap) {
            // console.log('key is  for saas:' + key);
            let emailArray = emailMap[key];
            for (let i = 0; i < emailArray.length; i++) {
                if (emailArray[i]['senderFullName'] === userName) {
                    return emailMap[key];
                }
            }
        }
    }

    // Assertion helper
    async getInviteContent(userName, trim = true) {
        const userEmail = await this.recieveEmail(userName);
        const userLatestEmail = userEmail[0];
        console.log('userLatestEmail inviteContent is :' + userLatestEmail.inviteContent);
        return trim
            ? userLatestEmail.inviteContent.trim().replace(/\n/g, ' ').replace(/ +/g, ' ')
            : userLatestEmail.inviteContent;
    }

    async getInviteMessage(userName, trim = true) {
        const userEmail = await this.recieveEmail(userName);
        const userLatestEmail = userEmail[0];
        return trim
            ? userLatestEmail.inviteMessage.trim().replace(/\n/g, ' ').replace(/ +/g, ' ')
            : userLatestEmail.inviteMessage;
    }

    async getBrowserLink(userName) {
        const userEmail = await this.recieveEmail(userName);
        const userLatestEmail = userEmail[0];
        return userLatestEmail.browserLink;
    }

    async clearMsgBox(userName) {
        await this.deleteEmail();
        await this.sleep(10000);
        let userEmail = await this.getUserEmail(userName);
        //retry 30 times to wait for emails are cleared
        let maxRetryTime = 30;
        while (maxRetryTime && userEmail) {
            console.log('Try to delete: ' + maxRetryTime + ' times');
            await this.deleteEmail();
            await this.sleep(10000);
            userEmail = await this.getUserEmail(userName);
            maxRetryTime--;
        }
    }

    async deleteEmail() {
        await GmailService.refresh();
        await GmailService.clearAll();
    }
}
