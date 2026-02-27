import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { customCredentials } from '../../../constants/index.js';

const specConfiguration = { ...customCredentials('_prompt') };
const specName = 'MQ_ShoppingCart';

describe('MQ Prompt - Shopping Cart', () => {
    const MQPromptName = 'Cost';
    const dossier1 = {
        id: '09C7E9BE4833035D151CA1A25D898391',
        name: 'MQ-ShoppingCart-Min1Max3-IndependentOperator-DefaultAND',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };
    const dossier2 = {
        id: 'C6ADAAF545BA36B7B010FBB8B4344CD1',
        name: 'MQ-ShoppingCart-SearchBox-FolderStructure-SingleOperatorOR',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };
    const dossier3 = {
        id: 'D42E9B1740A7E89A52A56ABD604F7A56',
        name: 'MQ-Prompt name with special chars',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };
    const browserWindow = {
        
        width: 1600,
        height: 1000,
    };
    const { credentials } = specConfiguration;
    let prompt;

    let { loginPage, dossierPage, libraryPage, promptEditor, promptObject, grid, rsdGrid } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);

        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC59619]Metric Qualification Prompt with Shopping Cart style- check answer limitation', async () => {
        // reset and open dossier
        await resetDossierState({
            credentials: credentials,
            dossier: dossier1,
        });
        await libraryPage.openDossierNoWait(dossier1.name);
        await promptEditor.waitForEditor();
        prompt = await promptObject.getPromptByName(MQPromptName);

        // run dossier, take screenshot, warning msg
        await promptEditor.run();
        await since('Error message for invalid action is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.pulldown.errorMsg(prompt))
            .toEqual('This prompt requires an answer.');
        // click OK to close popup
        await promptEditor.dismissError();

        // Answer prompt
        await promptObject.shoppingCart.addSingle(prompt);
        // take screenshot to check the initial default style
        await since('The initial default answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.shoppingCart.getNthSelectedItemText(prompt, 1))
            .toEqual('Cost\nGreater than or equal to\nValueat levelDefault');
        // open condition menu and check UI
        await promptObject.shoppingCart.openConditionDropdown(prompt, 1);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC59619', 'ConditionDropDownMenu');

        await promptObject.shoppingCart.selectCondition(prompt, 'Greater than');
        await promptObject.shoppingCart.openMQFirstValue(prompt, 1);
        await promptObject.shoppingCart.inputValues(prompt, '7654321.123');
        await promptObject.shoppingCart.confirmValues(prompt);
        // open level menu and check UI
        await promptObject.shoppingCart.openLevelDropdown(prompt, 1);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC59619', 'LevelDropDownMenu');

        await promptObject.shoppingCart.selectLevel(prompt, 'Metric');
        // When condition is 'between', there are 2 inputs
        await promptObject.shoppingCart.openConditionDropdown(prompt, 1);
        await promptObject.shoppingCart.scrollDownConditionList(prompt, 160);
        await promptObject.shoppingCart.selectCondition(prompt, 'Between');
        await since('The answer with between is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.shoppingCart.getNthSelectedItemText(prompt, 1))
            .toEqual('Cost\nBetween\n7654321.123 and Valueat levelMetric');
        await promptObject.shoppingCart.openMQFirstValue(prompt, 1);
        await promptObject.shoppingCart.clearAndInputValues(prompt, '3000');
        await promptObject.shoppingCart.confirmValues(prompt);
        await promptObject.shoppingCart.openMQSecondValue(prompt, 1);
        await promptObject.shoppingCart.clearAndInputValues(prompt, '400000');
        await promptObject.shoppingCart.confirmValues(prompt);
        // Check prompt summary
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(MQPromptName);
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkQualSummary(MQPromptName))
            .toEqual('CostBetween3000 and 400000at levelMetric');
        await promptEditor.toggleViewSummary();
        // When conditon is 'is Null', there is no input
        await promptObject.shoppingCart.openConditionDropdown(prompt, 1);
        await promptObject.shoppingCart.scrollDownConditionList(prompt, 160);
        await promptObject.shoppingCart.selectCondition(prompt, 'Is Null');
        await since('The answer with is null is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.shoppingCart.getNthSelectedItemText(prompt, 1))
            .toEqual('Cost\nIs Null\nat levelMetric');
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(MQPromptName);
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkQualSummary(MQPromptName))
            .toEqual('CostIs Nullat levelMetric');
        await promptEditor.toggleViewSummary();
        // When conditon is 'in'
        await promptObject.shoppingCart.openConditionDropdown(prompt, 1);
        await promptObject.shoppingCart.scrollDownConditionList(prompt, 160);
        await promptObject.shoppingCart.selectCondition(prompt, 'In');
        await since('The answer with in is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.shoppingCart.getNthSelectedItemText(prompt, 1))
            .toEqual('Cost\nIn\n3000at levelMetric');
        await promptObject.shoppingCart.openMQFirstValue(prompt, 1);
        await promptObject.shoppingCart.clearAndInputValues(prompt, '123;456');
        await promptObject.shoppingCart.confirmValues(prompt);
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(MQPromptName);
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkQualSummary(MQPromptName))
            .toEqual('CostIn123; 456at levelMetric');
        await promptEditor.toggleViewSummary();
        // When condition is 'Highest'
        await promptObject.shoppingCart.openConditionDropdown(prompt, 1);
        await promptObject.shoppingCart.scrollDownConditionList(prompt, 200);
        await promptObject.shoppingCart.selectCondition(prompt, 'Highest');
        await since('The answer with Highest is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.shoppingCart.getNthSelectedItemText(prompt, 1))
            .toEqual('Cost\nHighest\n123; 456at levelMetric');
        await since('Error message for invalid answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.shoppingCart.errorMsg(prompt))
            .toEqual('You have entered an invalid answer. Please enter a value of the correct data type.');
        await promptObject.shoppingCart.openMQFirstValue(prompt, 1);
        await promptObject.shoppingCart.clearAndInputValues(prompt, '2');
        await promptObject.shoppingCart.confirmValues(prompt);
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(MQPromptName);
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkQualSummary(MQPromptName))
            .toEqual('CostHighest2at levelMetric');
        await promptEditor.toggleViewSummary();
        // When condition is 'Highest%'
        await promptObject.shoppingCart.openConditionDropdown(prompt, 1);
        await promptObject.shoppingCart.scrollDownConditionList(prompt, 200);
        await promptObject.shoppingCart.selectCondition(prompt, 'Highest%');
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(MQPromptName);
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkQualSummary(MQPromptName))
            .toEqual('CostHighest%2at levelMetric');
        await promptEditor.toggleViewSummary();
        // run dossier
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.isTableExist('Visualization 1'))
            .toBe(false);

        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(MQPromptName);
        await since('Re-prompt previous answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.shoppingCart.getNthSelectedItemText(prompt, 1))
            .toEqual('Cost\nHighest%\n2%at levelMetric');
        // add Cost
        await promptObject.shoppingCart.addSingle(prompt);
        // add Profit
        await promptObject.shoppingCart.addSingle(prompt);
        // add Rvenue
        await promptObject.shoppingCart.addSingle(prompt);
        await since('Error message for more than 3 answers is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.shoppingCart.errorMsg(prompt))
            .toEqual('You have made more selections than are allowed for this prompt. Please remove some selections.');
        await promptObject.shoppingCart.clickNthSelectedItem(prompt, 2);
        // use < to remove one answer
        await promptObject.shoppingCart.removeSingle(prompt);
        // use x to remove one answer
        await promptObject.shoppingCart.deleteSingle(prompt, 2);
        await since('Remove2Answers is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.shoppingCart.getNthSelectedItemText(prompt, 1))
            .toEqual('Cost\nHighest%\n2%at levelMetric');
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(MQPromptName);
        await since('Summary is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkMultiQualSummary(MQPromptName))
            .toEqual('CostHighest%2%at levelMetric\nAND\nRevenueGreater than or equal toValueat levelDefault');
        await promptEditor.cancelEditor();
    });

    it('[TC59622]Metric Qualification Prompt with Shopping Cart style- check independent operators', async () => {
        // reset and open dossier
        await resetDossierState({
            credentials: credentials,
            dossier: dossier1,
        });
        await libraryPage.openDossierNoWait(dossier1.name);
        await promptEditor.waitForEditor();
        prompt = await promptObject.getPromptByName(MQPromptName);

        // add Cost
        await promptObject.shoppingCart.addSingle(prompt);
        await promptObject.shoppingCart.openMQFirstValue(prompt, 1);
        await promptObject.shoppingCart.inputValues(prompt, '70000');
        await promptObject.shoppingCart.confirmValues(prompt);
        // add Profit
        await promptObject.shoppingCart.addSingle(prompt);
        await promptObject.shoppingCart.openMQFirstValue(prompt, 1);
        await promptObject.shoppingCart.inputValues(prompt, '50000');
        await promptObject.shoppingCart.confirmValues(prompt);
        // Default expression is AND
        await since('Add multiple answers, default expression is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.shoppingCart.getNthExprText(prompt, 1))
            .toEqual('AND');
        // view summary
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(MQPromptName);
        await since('Summary with and is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkMultiQualSummary(MQPromptName))
            .toEqual(
                'ProfitGreater than or equal to50000at levelDefault\nAND\nCostGreater than or equal to70000at levelDefault'
            );
        await promptEditor.toggleViewSummary();
        // change expression to OR
        await promptObject.shoppingCart.openNthExprMenu(prompt, 1);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC59622', 'ExpressionMenu');

        await promptObject.shoppingCart.chooseNthExpr(prompt, 2);
        // add Revenue
        await promptObject.shoppingCart.addSingle(prompt);
        await promptObject.shoppingCart.openMQFirstValue(prompt, 2);
        await promptObject.shoppingCart.inputValues(prompt, '60000');
        await promptObject.shoppingCart.confirmValues(prompt);
        // check prompt summary
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(MQPromptName);
        await since('Summary with or is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkMultiQualSummary(MQPromptName))
            .toEqual(
                'ProfitGreater than or equal to50000at levelDefault\nOR\nRevenueGreater than or equal to60000at levelDefault\nOR\nCostGreater than or equal to70000at levelDefault'
            );
        await promptEditor.toggleViewSummary();
        // multiple expressions
        await promptObject.shoppingCart.openNthExprMenu(prompt, 1);
        await promptObject.shoppingCart.chooseNthExpr(prompt, 3);
        await since('Select first condition, group button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.shoppingCart.isButtonEnabled(prompt, 'Group'))
            .toEqual(true);
        await since('Select first condition, ungroup button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.shoppingCart.isButtonEnabled(prompt, 'Ungroup'))
            .toEqual(false);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC59622', 'MultipleExpression');

        // select first answer, move down its order(we can only change order in group)
        await promptObject.shoppingCart.clickNthSelectedObj(prompt, 1);
        await since('Select first item, move down button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.shoppingCart.isButtonEnabled(prompt, 'MoveDown'))
            .toEqual(true);
        await promptObject.shoppingCart.moveDown(prompt);
        await since('Move down first item, move down button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.shoppingCart.isButtonEnabled(prompt, 'MoveDown'))
            .toEqual(false);
        await since('Move down first item, move up button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.shoppingCart.isButtonEnabled(prompt, 'MoveUp'))
            .toEqual(true);
        // check prompt summary
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(MQPromptName);
        await takeScreenshotByElement(
            promptEditor.getPromptEditor(),
            'TC59622',
            'SummaryWithMultipleExpressionAndChangeOrder'
        );

        await promptEditor.toggleViewSummary();
        // Ungroup conditions
        await promptObject.shoppingCart.openNthExprMenu(prompt, 1);
        await since('Select first group, ungroup button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.shoppingCart.isButtonEnabled(prompt, 'Ungroup'))
            .toEqual(true);
        await since('Select first group, group button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.shoppingCart.isButtonEnabled(prompt, 'Group'))
            .toEqual(false);
        await promptObject.shoppingCart.ungroupItems(prompt);
        await since('After ungroup conditions, ungroup button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.shoppingCart.isButtonEnabled(prompt, 'Ungroup'))
            .toEqual(false);
        // when first answer is not in a group, move down its order
        await promptObject.shoppingCart.clickNthSelectedItemWithOffset(prompt, 1);
        await promptObject.shoppingCart.moveDown(prompt);
        await since(
            'When first item is not in a group, after its order, move down button is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await promptObject.shoppingCart.isButtonEnabled(prompt, 'MoveDown'))
            .toEqual(true);
        // check prompt summary
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(MQPromptName);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC59622', 'SummaryAfterUngroupConditions');

        await promptEditor.toggleViewSummary();
        // change second expression to "OR NOT" and group second expression
        await promptObject.shoppingCart.openNthExprMenu(prompt, 2);
        await promptObject.shoppingCart.chooseNthExpr(prompt, 4);
        await promptObject.shoppingCart.groupItems(prompt);
        // check prompt summary
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(MQPromptName);
        await takeScreenshotByElement(
            promptEditor.getPromptEditor(),
            'TC59622',
            'SummaryAfterChangeAndGroupConditions'
        );

        await promptEditor.toggleViewSummary();
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(4);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Year' }))
            .toBe('2014');
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Cost' }))
            .toBe('$7,343,097');
    });

    it('[TC59624]Metric Qualification Prompt with Shopping Cart style- search all metrics in folder structure', async () => {
        // reset and open dossier
        await resetDossierState({
            credentials: credentials,
            dossier: dossier2,
        });
        await libraryPage.openDossierNoWait(dossier2.name);
        await promptEditor.waitForEditor();
        prompt = await promptObject.getPromptByName(MQPromptName);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC59624', 'PromptInFolderStructure', {
            tolerance: 0.26,
        });

        //search for numbers, "1"
        await promptObject.shoppingCart.searchFor(prompt, '1');
        await since('Search result of "1" is supposed to be "#{expected}", instead we get "#{actual}"')
            .expect(await promptObject.getItemCountText(prompt))
            .toContain('1 - 30 of 5');
        await promptObject.shoppingCart.clearSearch(prompt);
        // search for chars
        await promptObject.shoppingCart.searchFor(prompt, '!@#');
        await since('Search result of "!@#" is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.shoppingCart.getAvailableCartItemCount(prompt))
            .toEqual(0);
        await promptObject.shoppingCart.clearSearch(prompt);
        // search for date
        await promptObject.shoppingCart.searchFor(prompt, '1/1/2019');
        await since('Search result of "1/1/2019" is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.shoppingCart.getAvailableCartItemCount(prompt))
            .toEqual(0);
        await promptObject.shoppingCart.clearSearch(prompt);
        // search for cost and add it
        await promptObject.shoppingCart.searchFor(prompt, 'cost');
        await promptObject.shoppingCart.clickElmInAvailableList(prompt, '_Cost');
        await promptObject.shoppingCart.addSingle(prompt);
        await promptObject.shoppingCart.openMQFirstValue(prompt, 1);
        await promptObject.shoppingCart.inputValues(prompt, '700000');
        await promptObject.shoppingCart.confirmValues(prompt);
        // search for _revenue and add first result
        await promptObject.shoppingCart.clearSearch(prompt);
        await promptObject.shoppingCart.searchFor(prompt, '_revenue');
        await promptObject.shoppingCart.addSingle(prompt);
        await promptObject.shoppingCart.openMQFirstValue(prompt, 1);
        await promptObject.shoppingCart.inputValues(prompt, '700000');
        await promptObject.shoppingCart.confirmValues(prompt);
        // view summary
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(MQPromptName);
        await since('Summary with or is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkMultiQualSummary(MQPromptName))
            .toEqual(
                '_RevenueGreater than or equal to700000at levelDefault\nOR\n_CostGreater than or equal to700000at levelDefault'
            );
        await promptEditor.toggleViewSummary();
        // change to "all selections"
        await promptObject.shoppingCart.chooseAllSelections(prompt);
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(MQPromptName);
        await since('Summary with and is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkMultiQualSummary(MQPromptName))
            .toEqual(
                '_RevenueGreater than or equal to700000at levelDefault\nAND\n_CostGreater than or equal to700000at levelDefault'
            );
        await promptEditor.toggleViewSummary();
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        const grid = rsdGrid.getRsdGridByKey('K44');
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(2))
            .toEqual(['2014', '$7,343,097']);
    });

    it('[TC61393]Metric Qualification Prompt with Shopping Cart style- prompt name with special chars', async () => {
        // reset and open dossier
        await resetDossierState({
            credentials: credentials,
            dossier: dossier3,
        });
        await libraryPage.openDossierNoWait(dossier3.name);
        await promptEditor.waitForEditor();
        // check prompt with special chars can display well
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC61393', 'PromptNameWithSpecialChars');

        // check prompt with special chars can run
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(2);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Metrics' }))
            .toBe('Profit');
    });
});

export const config = specConfiguration;
