import BasePage from '../base/BasePage.js';

export default class Panel extends BasePage {
    // Element locator

    getDockPanel(panelFinder) {
        return panelFinder.$('.mstrd-DropdownMenu--docked');
    }

    getDockIcon(panelFinder) {
        return panelFinder.$('.mstrd-DropdownMenu-headerIcon.icon-pin');
    }

    getCloseIcon(panelFinder) {
        return panelFinder.$('.mstrd-DropdownMenu-headerIcon.icon-pnl_close');
    }

    getUndockIcon(panelFinder) {
        return panelFinder.$('.mstrd-DropdownMenu-headerIcon.icon-unpin');
    }

    getPanelHeader(panelFinder) {
        return panelFinder.$('.mstrd-DropdownMenu-header');
    }

    // Action method

    async closePanel(panelFinder) {
        await this.getCloseIcon(panelFinder).click();
        await this.waitForElementInvisible(panelFinder, { timeout: 5000, msg: 'Panel is not closed.' });
        return this.sleep(500);
    }

    async dockPanel(panelFinder) {
        await this.click({ elem: this.getDockIcon(panelFinder) });
    }

    async undockPanel(panelFinder) {
        await this.getUndockIcon(panelFinder).click();
        await this.waitForElementStaleness(this.getDockPanel(panelFinder), {
            timeout: 5000,
            msg: 'Docked Panel is still displayed after undocked.',
        });
        return this.sleep(500);
    }

    // Assertion helper

    async isPanelCloseIconDisplayed(panelFinder) {
        return this.getCloseIcon(panelFinder).isDisplayed();
    }

    async isDockIconDisplayed(panelFinder) {
        return this.getDockIcon(panelFinder).isDisplayed();
    }

    async isUndockIconDisplayed(panelFinder) {
        return this.getUndockIcon(panelFinder).isDisplayed();
    }

    async isLeftDocked(panelFinder) {
        return panelFinder.$('.mstrd-DropdownMenu--dockLeft').isDisplayed();
    }

    async isRightDocked(panelFinder) {
        return panelFinder.$('.mstrd-DropdownMenu--dockRight').isDisplayed();
    }

    async isPanelDocked(panelFinder) {
        return this.getDockPanel(panelFinder).isDisplayed();
    }
}
