import WebLoginPage from '../pageObjects/web_auth/WebLoginPage.js';
import { getIServer, getProject, getAccountName, getAccountPassword } from './index.js';

/* Count the number of new opened windows/tabs after actions */
export async function numberOfNewWindow(actions) {
    const originalWindowHandles = await browser.driver.getWindowHandles();
    await actions();
    const newWindowHandles = await browser.driver.getWindowHandles();
    return newWindowHandles.length - originalWindowHandles.length;
}

export async function runInNonIE(actions) {
    if (browser.isIE) {
        return;
    }
    await actions();
}

export async function resetLogin(username = getAccountName(), password = getAccountPassword()) {
    const webLoginPage = new WebLoginPage();
    await webLoginPage.forceLogout();
    await browser.pause(1000);
    await webLoginPage.loginToHome({
        serverName: getIServer(),
        projectName: getProject(),
        username: username,
        password: password,
    });
}

export async function resetHome() {
    const webLoginPage = new WebLoginPage();
    await webLoginPage.openHomePage();
}
