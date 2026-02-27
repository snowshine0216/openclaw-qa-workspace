import Conversation from './Coversation.js';
import BasePage from '../base/BasePage.js';
import ModalDialog from './ModalDialog.js';

export default class MessageExtension extends BasePage {
    constructor() {
        super();
        this.conversation = new Conversation();
        this.modalDialog = new ModalDialog();
    }

    getMessageExtensionButton() {
        return this.$('button[title="Actions and apps"]');
    }

    getSearchBoxInMessageExtensionDialog() {
        return this.$('input[aria-label="Search for actions and apps"]');
    }

    getAppInMessageExtensionDialog(appName) {
        return this.$(`//li[@title="${appName}"]`);
    }

    getAppPicker() {
        return this.$('ul[data-tid="app-picker-list"]');
    }

    isAppPickerDisplayed() {
        return this.getAppPicker().isDisplayed();
    }

    getPreviewCardInInputBox() {
        return this.$('card');
    }

    async selectAppInMessageExtension({ appName, fromChannel }) {
        let startAPostButton = await (await this.conversation.getStartPostButtonInChannel()).isDisplayed();
        if (startAPostButton && fromChannel) {
            await this.click({ elem: this.conversation.getStartPostButtonInChannel() });
        }
        await this.click({ elem: this.getMessageExtensionButton() });
        await this.waitForElementClickable(this.getSearchBoxInMessageExtensionDialog());
        await this.getSearchBoxInMessageExtensionDialog().addValue(appName);
        await this.sleep(1000);
        await this.click({ elem: this.getAppInMessageExtensionDialog(appName) });
        await this.waitForElementVisible(this.$(`div[data-tid="task-module-dialog"]`));
    }

    async selectObjectFromMessageExtension({ teamsApp, application, object, fromChannel }) {
        await this.selectAppInMessageExtension({ appName: teamsApp, fromChannel });
        await this.modalDialog.waitForObjectLoadingInMessageExtension();
        if (application !== 'MicroStrategy') {
            await this.modalDialog.switchToApp(application);
        }
        await this.modalDialog.chooseDossier(object);
        if (this.modalDialog.isShareButtonDisabled){
            await this.clickAndNoWait({ elem: this.modalDialog.getDossier(object) });
        }
        await this.click({ elem: this.modalDialog.getShareButton() });
        await this.waitForElementInvisible(this.modalDialog.getShareButton());
    }

    async shareObjectFromMessageExtension({
        teamsApp = 'Library',
        application = 'MicroStrategy',
        object,
        fromChannel = false,
    }) {
        await this.selectObjectFromMessageExtension({ teamsApp, application, object, fromChannel });
        await browser.switchToFrame(null);
        console.log('switch to main frame');
        // defect: preview card might disappear after 1~2s
        let previewCard;
        for (let i = 0; i < 3; i++) {
            await this.sleep(2000);
            previewCard = await (await this.getPreviewCardInInputBox()).isDisplayed();
            if (!previewCard) {
                await this.selectObjectFromMessageExtension({ teamsApp, application, object, fromChannel });
            } else {
                break;
            }
        }
        const postButton = fromChannel
            ? this.conversation.getPostMessageButtonInChannel()
            : this.conversation.getPostCardMessageButtonInChat();
        await this.sleep(1000);
        await this.click({ elem: postButton });
        await this.sleep(1000);
        previewCard = await (await this.getPreviewCardInInputBox()).isDisplayed();
        if (previewCard) {
            await this.click({ elem: postButton });
        }
        await this.sleep(1000);
    }
}
