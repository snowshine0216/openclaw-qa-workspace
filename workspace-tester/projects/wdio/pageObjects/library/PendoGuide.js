import BasePage from '../base/BasePage.js';

export default class PendoGuide extends BasePage {
    // Element locator

    getLibraryPendoContainer() {
        return this.$('._pendo-step-container-styles');
    }

    getLibraryPendoContainerTitle() {
        return this.getLibraryPendoContainer().$$('.bb-text._pendo-text-plain')[0];
    }

    getPendoButton(text) {
        return this.$$('._pendo-button').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText === text;
        })[0];
    }

    getPendoLinkButton(text) {
        return this.$$('._pendo-text-link').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText === text;
        })[0];
    }

    getCloseButton() {
        return this.$('._pendo-close-guide');
    }

    getDossierPendoContainer() {
        return this.$('._pendo-step-container-size');
    }

    getDossierPendoContainerContent(index) {
        // index = 0 means the first element Title
        // index = 1 means the second element sub-title
        // index = 2 means the content
        // index = 3 means the string 'Step 1 of 6'
        return this.getDossierPendoContainer().$$('._pendo-text-plain')[index];
    }

    getLibraryIconForSaas() {
        return this.$('.mstr-nav-icon.app-theme-webLogo.container');
    }

    // Action helper
    async waitForPendoGuide() {
        await this.sleep(2000);
        return this.waitForElementVisible(this.getLibraryPendoContainer(), {
            timeout: 5000,
            msg: 'Pendo guide is not displayed.',
        });
    }

    async clickPendoButton(text) {
        await this.sleep(500);
        await this.waitForElementVisible(this.getLibraryPendoContainer(), {
            timeout: 5000,
            msg: 'Pendo step container is not displayed.',
        });
        await this.click({ elem: this.getPendoButton(text) });
    }

    async closePendoGuide() {
        await this.click({ elem: this.getCloseButton() });
        return this.waitForElementInvisible(this.getLibraryPendoContainer(), {
            timeout: 5000,
            msg: 'Pendo guide is still displayed.',
        });
    }

    async clickPendoLinkButton(text) {
        await this.sleep(500);
        await this.waitForElementVisible(this.getLibraryPendoContainer(), {
            timeout: 5000,
            msg: 'Pendo step container is not displayed.',
        });
        await this.click({ elem: this.getPendoLinkButton(text) });
    }

    // Assertion helper
    async isLibraryPendoContainerPresent() {
        return this.getLibraryPendoContainer().isDisplayed();
    }

    async isDossierPendoContainerPresent() {
        return this.getDossierPendoContainer().isDisplayed();
    }

    async getLibraryPendoContainerTitleText() {
        await this.sleep(2000);
        await this.waitForElementVisible(this.getLibraryPendoContainer(), {
            timeout: 5000,
            msg: 'Pendo step container title is not displayed.',
        });
        return this.getLibraryPendoContainerTitle().getText();
    }

    async getDossierPendoContainerText(index) {
        await this.sleep(2000);
        await this.waitForElementVisible(this.getDossierPendoContainer(), {
            timeout: 5000,
            msg: 'Pendo step container content is not displayed.',
        });
        return this.getDossierPendoContainerContent(index).getText();
    }

    async goToLibrary() {
        const text = (await this.getLibraryIconForSaas()).getText();
        if (text === 'Go to your Library') {
            return this.clickByForce({ elem: this.getLibraryIconForSaas() });
        }
    }

    async openSidebar() {
        const text = await (await this.getLibraryIconForSaas()).getText();
        if (text === 'Show Sidebar') {
            await this.clickByForce({ elem: this.getLibraryIconForSaas() });
        }
    }

    async closeSidebar() {
        const sidebarSpan = await this.getParent(this.getLibraryIconForSaas()).$('span');
        const sidebarText = sidebarSpan.getText();
        if (sidebarText === 'Hide Sidebar') {
            await this.clickByForce({ elem: this.getLibraryIconForSaas() });
        }
    }
}
