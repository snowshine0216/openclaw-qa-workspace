import BasePage from '../base/BasePage.js';

export default class MappingObjectInAgentTemplate extends BasePage {
    constructor() {
        super();
    }

    // Element locators

    getMappingObjectPage() {
        return this.$('.ant-modal-content');
    }

    getMyObjectsPanel() {
        return this.$('.mstrd-DatasetView');
    }


    getSearchbarInMyObjectsPanel() {
        return this.getMyObjectsPanel().$('input[type="search"]');
    }


    getObjectByNameInMyObjectPanel(name) {
        return this.getMyObjectsPanel().$(
            `.//*[(self::span or self::mark) and text()="${name}"]
            //ancestor::div[contains(@class, "mstrd-DatasetView-ObjectList-item")]`
        );
    }


    getTemplateObjectPanel() {
        return this.$('.ant-table-container');
    }


    getRowInTemplateByObjectName(name) {
        return this.getTemplateObjectPanel().$(
            `//tr[contains(@class, "ant-table-row")]//td[contains(@class, "ant-table-cell-with-append")]//span[text()="${name}"]//ancestor::tr[contains(@class, "ant-table-row")]`
        );
    }

    getMapwithCellForTemplateObject(templateObjectName) {
        const templateRow = this.getRowInTemplateByObjectName(templateObjectName);
        return templateRow.$('td.mstrd-ReplaceTemplateTable-ReplaceWithCellContainer');
    }

    getMapwithObjectByName(mapwithObjectName) {
        return this.getTemplateObjectPanel().$(`.//div[contains(@class, "mstrd-ReplaceTemplateTable-ReplaceWithCell-item-content") and @title="${mapwithObjectName}"]`);
    }

    getRemoveMappedObjectButton(mapwithObjectName) {
        const mappedObject = this.getMapwithObjectByName(mapwithObjectName);
        return mappedObject.$('.mstrd-ReplaceTemplateTable-ReplaceWithCell-remove-button');
    }
    
    getLaunchButton() {
        return this.$('.mstrd-ReplaceObjectsDialog-launchBtn');
    }

    
    getAliasCellForTemplateObject(templateObjectName) {
        const templateRow = this.getRowInTemplateByObjectName(templateObjectName);
        return templateRow.$$('td.ant-table-cell')[2];
    }

    getAliasInputForTemplateObject(templateObject) {
        const aliasCell = this.getAliasCellForTemplateObject(templateObject);
        return aliasCell.$('.mstrd-ReplaceTemplateTable-aliasInputCell input');
    }

    async getAliasTagsForTemplateObject(templateObject) {
        const aliasCell = await this.getAliasCellForTemplateObject(templateObject);
        const aliasContents = await aliasCell.$$('.mstrd-ReplaceTemplateTable-aliasCapsule .mstrd-Capsule-content');
        const aliasTags = await Promise.all(aliasContents.map(element => element.getText()));
        return aliasTags;
    }

    async getAliasTagByName(templateObject, aliasName) {
        const aliasCell = await this.getAliasCellForTemplateObject(templateObject);
        const capsules = await aliasCell.$$('.mstrd-ReplaceTemplateTable-aliasCapsule');
        for (const capsule of capsules) {
            const contentText = await capsule.$('.mstrd-Capsule-content').getText();
            if (contentText === aliasName) {
                return capsule;
            }
        }
    }

    
    // Action functions
    async dragDropObjectToMapWith(myObjectName, templateObjectName) {
        const sourceElement = await this.getObjectByNameInMyObjectPanel(myObjectName);
        const targetElement = await this.getMapwithCellForTemplateObject(templateObjectName);

        // // Wait for both elements to be visible
        await sourceElement.scrollIntoView();
        await targetElement.scrollIntoView();
        // Perform drag and drop
        await this.dragAndDrop({
            fromElem: sourceElement,
            toElem: targetElement,
            toOffset: { x: 0, y: 0 },
        });
        
        // Wait a moment for the mapping to complete
        await this.sleep(1000);
    }


    async addColumnAlias(templateObject, alias) {
        await this.click({ elem: await this.getAliasCellForTemplateObject(templateObject) });
        const aliasInput = await this.getAliasInputForTemplateObject(templateObject);
        await aliasInput.setValue(alias);
        await this.enter();
        
        // Wait for the alias to be added
        await this.sleep(500);
    }

    async removeColumnAlias(templateObject, alias) {
        const aliasCell = await this.getAliasCellForTemplateObject(templateObject);
        await this.click({ elem: aliasCell, offset: { x: 200, y: 0 } }); // Click empty space of alias cell
        const aliasTag = await this.getAliasTagByName(templateObject, alias);
        const removeButton = await aliasTag.$('.mstrd-Capsule-delete');
        await this.click({ elem: removeButton });
    }

    async removeObjectFromMapWith(mapwithObjectName) {
        const removeButton = await this.getRemoveMappedObjectButton(mapwithObjectName);
        await this.click({ elem: removeButton });
        
        // Wait for the object to be removed from mapping
        await this.sleep(500);
    }

    // Helper/utility functions

    async searchInMyObjectsPanel(searchTerm) {
        const searchBar = await this.getSearchbarInMyObjectsPanel();
        await this.click({ elem: searchBar });
        await searchBar.clearValue();
        await searchBar.setValue(searchTerm);
        // Wait for search results
        await this.sleep(1000);
    }


    async clearSearchInMyObjectsPanel() {
        const searchBar = await this.getSearchbarInMyObjectsPanel();
        await this.click({ elem: searchBar });
        await this.ctrlA();
        await this.sleep(200);
        await this.delete();
        await this.sleep(300);

    }

    async clickLaunchInAgentButton() {
        const launchButton = await this.getLaunchButton();        
        await this.click({ elem: launchButton });
    }


    async checkObjectMappedInMyObjectPanel(myObject) {
        // Find the object element in My Objects panel
        const objectElement = await this.getObjectByNameInMyObjectPanel(myObject);
        await objectElement.scrollIntoView();
        
        // Based on the HTML structure provided, check for mapping indicators
        // Look for the specific class structure: mstrd-DatasetView-ObjectList-item-name mapped
        const mappedNameElement = await objectElement.$('.mstrd-DatasetView-ObjectList-item-name.mapped');
        if (await mappedNameElement.isExisting()) {
            return true;
        }            
        return false;
    }


    async checkMyObjectExistInTemplateObject(templateObjectName, myObjectName) {
        const mapwithContainer = await this.getMapwithCellForTemplateObject(templateObjectName);
        await mapwithContainer.scrollIntoView();
        
        // Look for the My Object name within the template row
        const myObjectInTemplate = await mapwithContainer.$(
            `.//span[text()="${myObjectName}"]`
        );
        
        const exists = await myObjectInTemplate.isExisting();
        return exists;
    }
}