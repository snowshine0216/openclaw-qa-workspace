import BasePreference from './BasePreference.js';

export default class ProjectDispalyPage extends BasePreference {
    // element locator
    getProjectAliasInputBox() {
        return this.$('#projectAlias');
    }

    getProjectSortIndexInputBox() {
        return this.$('#projectIndex');
    }

    getProjectHeaderTextInputBox() {
        return this.$('#projectHeader');
    }

    getProjectHeader() {
        return this.$('.mstrProjectHeader');
    }

    // action helper
    async inputProjectHeaderText(text) {
        await this.click({ elem: this.getProjectHeaderTextInputBox() });
        await this.clear({ elem: this.getProjectHeaderTextInputBox() });
        await this.getProjectHeaderTextInputBox().setValue(text);
    }

    async inputProjectSortIndex(text) {
        await this.click({ elem: this.getProjectSortIndexInputBox() });
        await this.clear({ elem: this.getProjectSortIndexInputBox() });
        await this.getProjectSortIndexInputBox().setValue(text);
    }

    async inputProjectAlias(text) {
        await this.click({ elem: this.getProjectAliasInputBox() });
        await this.clear({ elem: this.getProjectAliasInputBox() });
        await this.getProjectAliasInputBox().setValue(text);
    }

    // assertion helper
    async isProjectHeaderPresent() {
        return this.getProjectHeader().isDisplayed();
    }

    async projectHeaderText() {
        return this.getProjectHeader().getText();
    }

    async projectAliasText() {
        return this.getProjectAliasInputBox().getAttribute('value');
    }

    async sortIndexText() {
        return this.getProjectSortIndexInputBox().getAttribute('value');
    }
}
