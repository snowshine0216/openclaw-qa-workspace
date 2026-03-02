import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specName = 'E2E_RSD_Prompt';

describe('RSD with all kinds of prompts', () => {
    const dossier = {
        id: 'D533CD5048AF85F7BC28DD843A88242E',
        name: 'RSD with all kinds of prompt',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const browserWindow = {
        width: 1600,
        height: 1000,
    };
    
    let object, item, attrQua, metricQua, hierarchy, date;

    let { loginPage, dossierPage, libraryPage, promptEditor, promptObject, rsdGrid } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(browsers.params.credentials);

        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        // reset and open dossier
        await resetDossierState({
            credentials: browsers.params.credentials,
            dossier: dossier,
        });
        await libraryPage.openDossierById({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });
        await promptEditor.waitForEditor();
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC65589_01]Check Object prompt and AE prompt', async () => {
        object = await promptObject.getPromptByName('Objects');
        item = await promptObject.getPromptByName('Item');

        // take screenshot to check the initial style
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC58942_32', 'Object&AEPromptUI');

        /*** CHECK OBJECT PROMPT ***/
        // check default answer
        await since('Count of default answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.shoppingCart.getSelectedCartItemCount(object))
            .toEqual(3);
        await promptObject.shoppingCart.removeAll(object);
        // run dossier, take screenshot, warning msg
        // await promptEditor.run();
        await promptEditor.clickButtonByNameAndNoWait('Apply');
        await promptEditor.waitForError();
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC58942_32', 'NotificationAndErrorMessage');
        // click OK to close popup
        await promptEditor.dismissError();
        // Answer prompt
        await promptObject.shoppingCart.clickElmInAvailableList(object, 'Category');
        await promptObject.shoppingCart.addSingle(object);
        await promptObject.shoppingCart.clickElmInAvailableList(object, 'Subcategory');
        await promptObject.shoppingCart.addSingle(object);

        /*** CHECK ATTRIBUTE ELEMENT LIST PROMPT ***/
        // elements can be checked/unchecked
        await promptObject.checkBox.clickCheckboxByName(item, '100 Places to Go While Still Young at Heart');
        await promptObject.checkBox.clickCheckboxByName(item, 'Art As Experience');
        await promptObject.checkBox.clickCheckboxByName(item, 'The Painted Word');
        await promptObject.checkBox.clickCheckboxByName(item, 'Hirschfeld on Line');
        await promptObject.checkBox.clickCheckboxByName(item, 'Adirondack Style');
        await promptObject.checkBox.clickCheckboxByName(item, 'Architecture : Form, Space, & Order');
        await promptObject.checkBox.clickCheckboxByName(item, '50 Favorite Rooms');
        await promptObject.checkBox.clickCheckboxByName(item, '500 Best Vacation Home Plans');
        await promptObject.checkBox.clickCheckboxByName(item, 'Blue & White Living');
        await promptObject.checkBox.clickCheckboxByName(item, 'Ways of Seeing');
        await since('Count of selected answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.checkBox.selectedItemCount(item))
            .toEqual(10);
        await promptObject.checkBox.clickCheckboxByName(item, '100 Places to Go While Still Young at Heart');
        await since('Uncheck one element, count of selected answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.checkBox.selectedItemCount(item))
            .toEqual(9);
        // switch page, and select elements in second page
        await promptObject.goToNextPage(item);
        await promptObject.checkBox.clickCheckboxByName(item, 'The Fountainhead');
        await since(
            'Select 1 element in second page, count of selected answer is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await promptObject.checkBox.selectedItemCount(item))
            .toEqual(1);
        await promptObject.goToPreviousPage(item);
        await since(
            'Switch back to first page, count of selected answer is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await promptObject.checkBox.selectedItemCount(item))
            .toEqual(9);

        // check prompt summary
        await promptEditor.toggleViewSummary();
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC58942_32', 'Object&AEPromptSummary');
        // run dossier
        await promptEditor.run();
        await promptEditor.waitForEditorClose();
        await dossierPage.waitForDossierLoading();
        const grid = rsdGrid.getRsdGridByKey('W7629190460E449F981D631CF34433F66');
        await since('The last 3 cells of the 3rd row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid.selectCellInOneRow(3, 1, 3))
            .toEqual(['Literature', '$3,457', '$4,364']);
        // re-prompt
        await promptEditor.reprompt();
        object = await promptObject.getPromptByName('Objects');
        // check previous answer
        // await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC58942_32', 'Object&AEPromptAnswer');
        // Add new attribute in object prompt, grid should show this attribute
        await promptObject.shoppingCart.clickElmInAvailableList(object, 'Item');
        await promptObject.shoppingCart.addSingle(object);
        await since('Add Item, count of default answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.shoppingCart.getSelectedCartItemCount(object))
            .toEqual(3);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The last 3 cells of the 3rd row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid.selectCellInOneRow(3, 1, 3))
            .toEqual(['The Painted Word', '$4,883', '$5,543']);
    });

    it('[TC65589_02]Check qualification prompt and value prompt', async () => {
        /*** CHECK HIERARCHY QUALIFICATION PROMPT ***/
        hierarchy = await promptObject.getPromptByName('Hierarchies');
        await promptObject.selectPromptByIndex({ index: '3', promptName: 'Hierarchies' });
        // take screenshot to check the initial style
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC58942_33', 'Hierarchy&AQPromptUI');
        // expand hierarchy
        await promptObject.tree.expandEle(hierarchy, 'Products');
        await promptObject.tree.expandEle(hierarchy, 'Supplier');
        // add 3 elements
        await promptObject.tree.clickEleName(hierarchy, 'Bantam Books');
        await promptObject.shoppingCart.addSingle(hierarchy);
        await promptObject.shoppingCart.addSingle(hierarchy);
        await promptObject.shoppingCart.addSingle(hierarchy);

        /*** CHECK ATTRIBUTE QUALIFICATION PROMPT ***/
        attrQua = await promptObject.getPromptByName('Attribute qualification');
        // answer aq prompt by qualification expression: Category Qualify DESC Does not equal Music
        await promptObject.selectPromptByIndex({ index: '4', promptName: 'Attribute qualification' });
        await promptObject.shoppingCart.clickElmInAvailableList(attrQua, 'Category');
        await promptObject.shoppingCart.addSingle(attrQua);
        await promptObject.shoppingCart.openFormDropdown(attrQua, 1);
        await promptObject.shoppingCart.selectForm(attrQua, 'DESC');
        await promptObject.shoppingCart.openConditionDropdown(attrQua, 1);
        await promptObject.shoppingCart.selectCondition(attrQua, 'Does not equal');
        await promptObject.shoppingCart.openValuePart1Editor(attrQua, 1);
        await promptObject.shoppingCart.inputValues(attrQua, 'Music');
        await promptObject.shoppingCart.confirmValues(attrQua);
        // answer another aq prompt by selection expression: Brand Select In List
        await promptObject.shoppingCart.clickElmInAvailableList(attrQua, 'Brand');
        await promptObject.shoppingCart.addSingle(attrQua);
        await promptObject.shoppingCart.openTypeDropdown(attrQua, 1);
        await promptObject.shoppingCart.selectType(attrQua, 'Select');
        await promptObject.shoppingCart.openValueListEditor(attrQua, 1);
        await promptObject.shoppingCart.addAll(attrQua, true);
        await promptObject.shoppingCart.confirmValues(attrQua);
        // for multiple answers, default condition is 'All selections'
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC58942_33', 'AllSelections');
        // change to "Any selection"
        await promptObject.shoppingCart.chooseAnySelection(attrQua);

        /*** CHECK METRIC QUALIFICATION PROMPT ***/
        metricQua = await promptObject.getPromptByName('Metric qualification');
        await promptObject.selectPromptByIndex({ index: '5', promptName: 'Metric qualification' });
        // take screenshot to check the initial style
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC58942_33', 'MQ&ValuePromptUI');
        await promptObject.qualPulldown.openDropDownList(metricQua);
        await promptObject.qualPulldown.selectDropDownItem(metricQua, 'Cost');
        await promptObject.qualPulldown.openMQConditionList(metricQua);
        await promptObject.qualPulldown.selectMQCondition(metricQua, 'Greater than');
        await promptObject.qualPulldown.clearAndInputLowserValue(metricQua, '400');

        /*** CHECK VALUE PROMPT ***/
        date = await promptObject.getPromptByName('Date');
        await promptObject.textbox.clickTextBoxInput(date);
        await promptObject.textbox.clearAndInputText(date, '2014-11-11');

        // check prompt summary
        await promptEditor.toggleViewSummary();
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC58942_33', 'Qualification&ValuePromptSummary');
        // run dossier
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        const grid = rsdGrid.getRsdGridByKey('W7629190460E449F981D631CF34433F66');
        await since('The last 3 cells of the 3rd row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid.selectCellInOneRow(3, 1, 3))
            .toEqual(["Roark's Formulas for Stress and Strain", '$953', '$1,220']);
    });
});
