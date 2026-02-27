import BasePage from '../base/BasePage.js';

export default class LibraryItem extends BasePage {
    // Element locators
    getAllItems() {
        return this.$$('.mstrd-DossierItem');
    }

    getItem(name, owner = null) {
        return this.getAllItems().filter(async (elem) => {
            // Filter out empty item containers
            let nameLocator = elem.$('.mstrd-DossierItem-name');
            const isItemPresent = await nameLocator.isDisplayed();
            if (isItemPresent) {
                // inactive bot could not be found by $('.mstrd-DossierItem-name'),
                // however manage library could does not have $('.mstrd-DossierItem-name-text')
                const nameTextLocator = elem.$('.mstrd-DossierItem-name-text');
                if (await nameTextLocator.isDisplayed()) {
                    nameLocator = nameTextLocator;
                }
                const dossierName = await nameLocator.getText();
                if (owner) {
                    const ownerLocator = elem.$('.mstrd-DossierItemSharedByInfo-user');
                    const dossierOwner = await ownerLocator.getText();
                    return name === dossierName && owner === dossierOwner;
                }
                return name === dossierName;
            }
        })[0];
    }

    getItems(name, owner = null) {
        return this.getAllItems().filter(async (elem) => {
            // Filter out empty item containers
            let nameLocator = elem.$('.mstrd-DossierItem-name');
            const isItemPresent = await nameLocator.isDisplayed();
            if (isItemPresent) {
                // inactive bot could not be found by $('.mstrd-DossierItem-name'),
                // however manage library could does not have $('.mstrd-DossierItem-name-text')
                const nameTextLocator = elem.$('.mstrd-DossierItem-name-text');
                if (await nameTextLocator.isDisplayed()) {
                    nameLocator = nameTextLocator;
                }
                const dossierName = await nameLocator.getText();
                if (owner) {
                    const ownerLocator = elem.$('.mstrd-DossierItemSharedByInfo-user');
                    const dossierOwner = await ownerLocator.getText();
                    return name === dossierName && owner === dossierOwner;
                }
                return name === dossierName;
            }
        })
    }

    getItemMenuTrigger(name) {
        return this.getItem(name).$('.mstrd-DossierItem-link');
    }

    getSharedByInfo(name) {
        return this.getItem(name).$('.mstrd-DossierItemSharedByInfo');
    }

    getStatusBar(name) {
        return this.getItem(name).$('.mstrd-DossierItemStatusBar');
    }

    getFavoriteIcon(name) {
        return this.getItem(name).$('.mstrd-DossierItem-favoriteIcon');
    }

    getAddToLibraryIcon(name) {
        return this.getItem(name).$('.icon-add-to-library');
    }

    getUserInfo(name) {
        return this.getSharedByInfo(name).$('.mstrd-DossierItemSharedByInfo-user');
    }

    getTimeInfo(name) {
        return this.getItem(name).$('.mstrd-DossierItemSharedByInfo-time');
    }

    getTooltip() {
        return this.$('.ant-tooltip:not(.ant-tooltip-hidden)');
    }

    getCertifiedIcon(name) {
        return this.getItem(name).$('.mstrd-CertifiedIcon');
    }

    getCertifyTooltip() {
        return this.$('.ant-tooltip-inner');
    }

    getTemplateIcon(name) {
        return this.getItem(name).$('.mstrd-TemplateIcon');
    }

    getObjectTypeIcon(name) {
        return this.getItem(name).$('.mstrd-DossierItemStatusBar-objectTypeIcon');
    }

    getRunAsExcelIcon(name) {
        return this.getItem(name).$('.mstrd-RunAsIcon.icon-share_excel');
    }

    getRunAsPDFIcon(name) {
        return this.getItem(name).$('.mstrd-RunAsIcon.icon-share_pdf');
    }

    // action helper

    async openItemByIndex(index) {
        const item = await this.getAllItems()[index];
        await item.click();
    }

    async hoverOnCertifiedIcon(name) {
        await this.hover({ elem: this.getCertifiedIcon(name) });
        await this.waitForElementVisible(this.getTooltip());
    }

    async hoverOnObjectTypeIcon(name) {
        await this.hover({ elem: this.getObjectTypeIcon(name) });
        await this.waitForElementVisible(this.getTooltip());
    }

    async itemInfo(name) {
        const userName = await this.getSharedByInfo(name).$('.mstrd-DossierItemSharedByInfo-user').getText();
        let timeStampType = await this.getSharedByInfo(name).$('span:nth-child(2)').getText();
        /**
         * Sample HTML of `.$('span:nth-child(2)')`:
         * <span role="text" aria-label="Updated 1mo ago">
         *   <span aria-hidden="true">&nbsp;•&nbsp;</span>
         *   <span aria-hidden="true">Updated</span>
         *   <span aria-hidden="true">&nbsp;</span>
         *   <span aria-hidden="true" class="mstrd-DossierItemSharedByInfo-time">1mo ago</span>
         * </span>
         */
        timeStampType = timeStampType.match(/\w+/)[0]; // match the first word, this ignores leading space and dot;
        return [userName, timeStampType];
    }

    async itemSharedByTimeInfo(name) {
        return this.getTimeInfo(name).getText();
    }

    async hoverOnUserName(name) {
        await this.waitForElementVisible(this.getUserInfo(name));
        // const value = await this.getUserInfo(name).getText();
        await this.hover({ elem: this.getUserInfo(name) });
        await this.waitForElementVisible(this.getTooltip());
    }

    async isItemCertified(name) {
        return this.getStatusBar(name).$('.mstrd-CertifiedIcon').isDisplayed();
    }

    async isItemDocument(name) {
        return this.getStatusBar(name).$('[aria-label="Document"]').isDisplayed();
    }

    async isItemViewable(name, owner = null) {
        const el = this.getItem(name, owner);
        return el.isDisplayed();
    }

    async isCommentCountDisplayed(name) {
        return this.getStatusBar(name).$('.mstrd-CommentCountIcon').isDisplayed();
    }

    async getTooltipText() {
        await this.waitForElementVisible(this.getTooltip());
        return this.getTooltip().getText();
    }

    async hoverOnTemplateIcon(name) {
        await this.hover({ elem: this.getTemplateIcon(name) });
        await this.waitForElementVisible(await this.getTooltip());
    }

    async isBotCoverGreyed(name) {
        return this.getItem(name).$('.mstrd-DossierItemIcon-imgContainer--grayscale').isDisplayed();
    }

    async isBotHasInactiveInName(name, i18nText = ' (Inactive)') {
        const inactive = await this.getItem(name).$('.mstrd-DossierItem-name-inactive');
        if (!(await inactive.isDisplayed())) {
            return false;
        }
        const text = await inactive.getText();
        return text === i18nText;
    }

    async isObjectTypeIconDisplayed(name) {
        return this.getObjectTypeIcon(name).isDisplayed();
    }

    async isRunAsExcelIconPresent(name) {
        return this.getRunAsExcelIcon(name).isDisplayed();
    }

    async isRunAsPDFIconPresent(name) {
        return this.getRunAsPDFIcon(name).isDisplayed();
    }

    async getDossierNameFont() {
        return this.getFontFamily(this.$('.mstrd-DossierItem-name-text'));
    }

    async getAllItemsCount() {
        return this.getAllItems().length;
    }

    async isAddToLibraryIconDisplayed(name) {
        return this.getAddToLibraryIcon(name).isDisplayed();
    }
}
