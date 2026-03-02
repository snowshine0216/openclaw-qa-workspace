import { $ } from '@wdio/globals'
import LibraryPage from './library.page.js';

class LibaryLoginPage extends LibraryPage {
    async loaded() {
        const mstrRoot = await this.$('#mstrd-Root');
        await mstrRoot.waitForDisplayed({timeout: 600000});
    }

    public get inputUsername () {
        return this.$('#username');
    }

    public get inputPassword () {
        return this.$('#password');
    }

    public get btnSubmit () {
        return this.$('#loginButton');
    }

    public async login (username: string, password: string) {
        const inputUsername = await this.inputUsername;
        const inputPassword = await this.inputPassword;
        const btnSubmit = await this.btnSubmit;
        
        await inputUsername.waitForDisplayed();
        await inputPassword.waitForDisplayed();
        await btnSubmit.waitForDisplayed();

        await inputUsername.setValue(username);
        await inputPassword.setValue(password);
        await btnSubmit.click();
    }

    public open () {
        return super.open('auth/ui/loginPage');
    }
}

export default new LibaryLoginPage();