import WebBasePage from '../base/WebBasePage.js';
import PrimarySearch from '../web_home/PrimarySearch.js';
import MenuCreate from '../web_home/MenuCreate.js';
import { clearTextarea } from '../../utils/index.js';


export default class MyPage extends WebBasePage {
    constructor() {
        super();
        this.primarySearch = new PrimarySearch();
        this.menuCreate = new MenuCreate();
    }

    // element locator
    getHeader() {
        return this.$('.mstrmojo-RootView-pathbar');
    }
    
    getAddButton() {
        return this.$$('.mstrmojo-Button-text').filter(async (el) => {
            const text = await el.getText();
            return text.includes('+');
        })[0];
    }

    getCardbyName(name) {
        return this.$$('.mstrmojo-Card-container').filter(async (el) => {
            const text = await el.$('.title-text').getText();
            return text === name;
        })[0];
    }

    getFirstObjectInRecents() {
        return this.$$('.slick-active')[0];
    }

    getCardEditIcon(name) {
        return this.getCardbyName(name).$('.right-toolbar .icn');
    }

    getCardEditorContainer() {
        return this.$$('.mstrmojo-ui-Menu')[0];
    }

    getCardEditors() {
        return this.$$('.mstrmojo-ui-Menu');
    }

    getCardTitleBar(name) {
        return this.getCardbyName(name).$('.mstrmojo-Card-titlebar');
    }

    getCardEditMenuItem(name) {
        return this.$$(`.mstrmojo-ui-Menu-item`).filter(async (el) => {
            const text = await el.getText();
            return text.includes(name);
        })[0];
    }

    getCardOKButton(name) {
        return this.getCardbyName(name).$$('.mstrmojo-Button-text').filter(async el => (await el.getText()).includes('OK'))[0];
    }

    getCardInput(name) {
        return this.$$(`.mstrmojo-TextBoxWithLabel`).filter(async (el) => (await el.getText()).includes(name))[0].$('input');

    }

    getCardButton(name) {
        return this.$$(`.mstrmojo-Button-text`).filter(async (el) => (await el.getText()).includes(name))[0];
    }

    getHTMLTextInput(name) {
        return this.getCardbyName(name).$('.mstrmojo-TextArea');
    }

    getHTMLType(name, typeName) {
        return this.getCardbyName(name).$$('.item').filter(async (el) => (await el.getText()).includes(typeName))[0];
    }

    getCardFolderItem(name, item) {
        return this.getCardbyName(name).$$('.mstrmojo-itemwrap').filter(async (el) => (await el.getText()).includes(item))[0];
    }

    getSelectFolderEditor() {
        return this.$('.mstrmojo-FolderPicker');
    }

    getEditSubMenu() {
        return this.$('.scroll-container.mstrmojo-scrollNode');
    }

    getFolderEditorItem(item) {
        return this.getSelectFolderEditor().$$('.mstrmojo-itemwrap').filter(async (el) => {
            const text = await el.getText();
            return text === item;
        })[0];
        //return this.getSelectFolderEditor().all(by.cssContainingText('.mstrmojo-itemwrap', new RegExp(this.escapeRegExp(item)))).first();
    }

    getFolderEditorButton(name) {
        return this.getSelectFolderEditor().$$('.mstrmojo-Button-text').filter(async (el) => {
            const text = await el.getText();
            return text === name;
        })[0];
        //return this.getSelectFolderEditor().element(by.cssContainingText('.mstrmojo-Button-text', new RegExp(this.escapeRegExp(name))));
    }

    getWarningAlertInImageLinkInput() {
        return this.$('.mstrmojo-TextBox.mstrmojo-TextBox-Alert');
    }

    getLoader() {
        return this.$('.mstrmojo-BookletLoader');
    }

    // action helper
    async waitForCardEditorDropdownVisible() {
        const cardsCount = await this.getCardsCount();
        if (cardsCount === 0) {
            await this.waitForElementVisible(this.getCardEditorContainer());
        } else {
            const els = this.getCardEditors();
            const v1 = await els.length;
            await this.waitForElementVisible(this.getCardEditors()[1]);
        }
    }

    async addCard(menuPaths, name) {
        const count = await this.getCardsCount();
        if (count === 0) {
            await this.click({ elem: this.getAddButton() });
        } else {
            await this.click({ elem: this.getCardEditIcon(name) });
            await this.hover({ elem: this.getCardEditMenuItem('Add') });
        }
        await this.waitForCardEditorDropdownVisible();
        for (const menuItem of menuPaths) {
            try {
                console.log('click with menu item ' + menuItem);
                const el = this.getCardEditMenuItem(menuItem);
                await this.click({ elem: el });
                console.log('finish to click on menu item ' + menuItem);
                await this.sleep(1000);
            } catch (e) {
                throw new Error(e);
            }
        }
    }

    async deleteCards(cardList) {
        const count = await this.getCardsCount();
        if (count !== 0) {
            for (const cardItem of cardList) {
                try {
                    await this.click({ elem: this.getCardEditIcon(cardItem) });
                    await this.click({ elem: this.getCardEditMenuItem('Delete') });
                } catch (e) {
                    throw new Error(e);
                }
            }
        }
    }

    async deleteAllCards() {
        const nameList = await this.getCardsNames();
        for (const cardName of nameList) {
            try {
                await this.click({ elem: this.getCardEditIcon(cardName) });
                await this.click({ elem: this.getCardEditMenuItem('Delete') });
            } catch (e) {
                throw new Error(e);
            }
        }
        await this.waitForElementVisible(this.getAddButton());
    }

    async addImageCard(imageSource, imageLink, name) {
        await this.addCard(['Image'], name);
        const sourceInput = this.getCardInput('Image Source:');
        await sourceInput.click();
        await this.clear({elem: sourceInput});
        await sourceInput.setValue(imageSource);
        await this.sleep(1000);
        const linkInput = this.getCardInput('Link to:');
        await this.getCardInput('Link to:').click();
        await this.clear({elem: linkInput});
        await linkInput.setValue(imageLink);
        await this.getCardButton('OK').click();
        // add sleeop here to wait for image loaded
        await this.sleep(2000);
    }

    async cancelAddCard() {
        await this.click({ elem: this.getCardButton('Cancel') });
    }
    

    async addHTMLCard(text, type, name) {
        await this.addCard(['HTML Container'], name);
        console.log('finish to click add icon');
        await this.click({ elem: this.getHTMLType('', type) });
        console.log('finish to click html type');
        const el = this.getHTMLTextInput('');
        await el.click();
        await console.log('finish to click html text input');
        await clearTextarea(el);
        await console.log('finish to clear html text input');
        await el.setValue(text);
        await console.log('finish to set html text input');
        await this.getCardOKButton('').click();
        await console.log('finish to click OK button');
    }

    async editCard(name) {
        await this.click({ elem: this.getCardEditIcon(name) });
        await this.sleep(1000);
        const isEditButtonDisplayed = await this.getCardEditMenuItem('Edit').isDisplayed();
        console.log('click edit icon for ' + name + ' card 1 times');
        for (let i = 0; i < 3; i++) {
            if (!isEditButtonDisplayed) {
                console.log('click edit icon for ' + name + ' card' + (i + 2) + ' times');
                await this.click({ elem: this.getCardEditIcon(name) });
                await this.sleep(1000);
            } else {
                break;
            }
        }
        await this.waitForElementVisible(this.getCardEditMenuItem('Edit'));
        console.log('edit menu item is displayed');
    }

    async editHTMLCard(text, type, name) {
        await this.editCard(name);
        await this.getCardEditMenuItem('Edit').click();
        //await this.click(this.getCardEditMenuItem('Edit'));
        await this.getHTMLType(name, type).click();
        //await this.click(this.getHTMLType(name, type));
        await this.getHTMLTextInput(name).click();
        await this.clear({elem:  this.getHTMLTextInput(name) });
        await this.getHTMLTextInput(name).setValue(text);
        await this.getCardOKButton(name).click();
    }

    async editImageSource(imageSource, name) {
        await this.editCard(name);
        await this.getCardEditMenuItem('Edit').click();
        await this.waitForElementVisible(this.getEditSubMenu());
        //await this.click(this.getCardEditMenuItem('Edit'));
        await this.getCardInput('Image Source:').click();
        await this.sleep(500);
        await this.clear({elem:  this.getCardInput('Image Source:') });
        await this.sleep(500);
        await this.getCardInput('Image Source:').setValue(imageSource);
        await this.sleep(500);
        await this.getCardButton('OK').click();
    }

    async editImageLink(imageLink, name) {
        await this.editCard(name);
        console.log('finish to click edit icon');
        //await this.getCardEditMenuItem('Edit').click();
        await this.click({ elem: this.getCardEditMenuItem('Edit') });
        await this.waitForElementVisible(this.getEditSubMenu());
        console.log('finish to click edit menu');
        //await this.click(this.getCardInput('Link to:'));
        await this.getCardInput('Link to:').click();
        console.log('finish to click image link input');
        await this.clear({elem:  this.getCardInput('Link to:') });
        console.log('finish to clear image link input');
        await this.getCardInput('Link to:').setValue(imageLink);
        console.log('finish to set image link input');
        // add sleep here to wait fot OK button enabled
        await this.sleep(1000);
        await this.getCardButton('OK').click();
    }

    async editCardTitle(tilteName, name) {
        await this.editCard(name);
        console.log('finish to click edit icon');
        await this.hover({ elem: this.getCardEditMenuItem('Title') });
        await this.waitForElementVisible(this.getEditSubMenu());
        console.log('finish to hover title menu item');
        //await this.click(this.getCardEditMenuItem('Title'));
        await this.click({ elem: this.getCardInput('Title') });
        console.log('finish to click title input');
        //await this.click(this.getCardInput('Title'));
        await this.clear({elem:  this.getCardInput('Title') });
        console.log('finish to clear title input');
        await this.getCardInput('Title').setValue(tilteName);
        console.log('finish to set title input');
        await this.getCardButton('OK').click();
        console.log('finish to click OK button');
    }

    async editCardWidth(width, name) {
        await this.editCard(name);
        await this.hover({ elem: this.getCardEditMenuItem('Width') });
        await this.waitForElementVisible(this.getEditSubMenu());
        //await this.getCardEditMenuItem('Width').click();
        await this.click({ elem: this.getCardInput('Columns') });
        await this.clear({elem:  this.getCardInput('Columns') });
        await this.getCardInput('Columns').setValue(width);
        await this.getCardButton('OK').click();
    }

    async clickImageCardLink(name) {
        await this.click({ elem: this.getCardbyName(name) });
    }

    async openObjectInCard(folderPath, name) {
        await this.openHomePage();
        await this.waitForElementVisible(this.getCardbyName(name));
        const pathSegments = Array.isArray(folderPath) ? folderPath : folderPath.split('>');
        for (const folderItem of pathSegments) {
            try {
                const el = this.getCardFolderItem(name, folderItem);
                await this.click({ elem: el });
                await this.sleep(1000);
            } catch (e) {
                throw new Error(e);
            }
        }
    }

    async selectFolder(folderPath) {
        const pathSegments = Array.isArray(folderPath) ? folderPath : folderPath.split('>');
        for (const folderItem of pathSegments) {
            try {
                const el = this.getFolderEditorItem(folderItem);
                await this.click({ elem: el });
                await this.sleep(1000);
            } catch (e) {
                throw new Error(e);
            }
        }
        await this.click({ elem: this.getFolderEditorButton('OK') });
    }

    async drapCard(from, to) {
        const fromEl = this.getCardTitleBar(from);
        const toEl = this.getCardTitleBar(to);
        const toOffsetParam = { x: 100, y: 0 };
        // await this.hover(this.getCardbyName(from));
        // await browser.sleep(500000000);
        await this.dragAndDrop({
            fromElem: fromEl,
            toElem: toEl,
            toOffset: toOffsetParam
        });
        await this.click({ elem: this.getCardEditIcon(from) });
    }

    // Assertion Helper
    async getCardsCount() {
        const els = this.$$('.mstrmojo-Card-container');
        const count = await els.length;
        return count;
    }

    async getCardsNames() {
        const rowCells = this.$$('.mstrmojo-Card-container .title-text');
        const text = await rowCells.map(cell => cell.getText());
        const rowText = await text.map(cell => cell.trim());
        return rowText;
    }

    async getRecentNameList(name) {
        const list = this.getCardbyName(name).$$('.name-time');
        const text = await list.map(cell => cell.getText());
        const rowText = await text.map(cell => cell.split('\n')[0]);
        return rowText;
    }

    async getRecentTimeList(name) {
        const list = this.getCardbyName(name).$$('.time');
        const text = await list.map(cell => cell.getText());
        const rowText = await text.map(cell => cell.trim());
        return rowText;
    }

    async getRecentActiveItemCount(name) {
        const list = this.getCardbyName(name).$$('.slick-active');
        const count = await list.length;
        return count;
    }

    async isOKButtonDisabled() {
        const value = await this.isDisabled(this.getParent(this.getCardButton('OK')));
        return value;
    }

    async isWarningAlertPresent() {
        return this.getWarningAlertInImageLinkInput().isDisplayed()
    }

    async openFirstObjectInRecents() {
        await this.waitForElementVisible(this.getCardbyName('Recents'));
        await this.click({ elem: this.getFirstObjectInRecents() });
    }

    async openFolderInSharedReportsCard(folderPath) {
        await this.waitForElementInvisible(this.getLoader());
        await this.waitForElementVisible(this.getCardbyName('Shared Reports'));
        const pathSegments = Array.isArray(folderPath) ? folderPath : folderPath.split('>');
        for (const folderItem of pathSegments) {
            try {
                const el = this.getCardFolderItem('Shared Reports', folderItem);
                await this.click({ elem: el });
                await this.sleep(1000);
            } catch (e) {
                throw new Error(e);
            }
        }
    }
}
