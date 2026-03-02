import { takeScreenshot, takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { customCredentials } from '../../../constants/index.js';

const specConfiguration = { ...customCredentials('_prompt') };
const specName = 'MQ_PullDown';

describe('MQ Prompt - Pull Down', () => {
    const MQPromptName1 = 'Cost';
    const dossier1 = {
        id: 'DCCB3A91486B9296CCF97599FB284B52',
        name: 'MQ-PullDown-DefaultBetween-DisablePrompt',
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

    let { loginPage, dossierPage, libraryPage, promptEditor, promptObject, grid } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);

        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        // Reset and run dossier
        await resetDossierState({
            credentials: credentials,
            dossier: dossier1,
        });
        await libraryPage.openDossier(dossier1.name);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC59295]MQ-Pull Down Initial rendering and check prompt page', async () => {
        //  a. prompt should not show
        await since('The prompt editor should not show')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(4);

        // re-prompt
        // a. take screenshot to check style
        // b. get default condition, should be "Between"
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(MQPromptName1);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC59295', 'DefaultUI');

        // open metric dropdown menu
        // a. take screenshot to check the menu GUI
        await promptObject.qualPulldown.openDropDownList(prompt);
        await takeScreenshotByElement(
            promptObject.qualPulldown.getDropDownMenu(prompt),
            'TC59295',
            'MenuUIOfMetricDropdown'
        );

        // choose "Cost"
        await promptObject.qualPulldown.selectDropDownItem(prompt, 'Cost');
        // open condition dropdown menu and close condition dropdown menu
        // a. take screenshot to check menu UI
        await promptObject.qualPulldown.openMQConditionList(prompt);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC59295', 'MenuUIOfConditionDropdown');

        await promptObject.qualPulldown.closeMQConditionList(prompt);
        // open level menu and close level menu
        // a. take screenshot to check menu UI
        await promptObject.qualPulldown.openMQLevelList(prompt);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC59295', 'MenuUIOfLevelDropdown');

        await promptObject.qualPulldown.closeMQLevelList(prompt);
        // Input 1: 7654321
        // Input 2: 8,765,432.00
        await promptObject.qualPulldown.clearAndInputLowserValue(prompt, '7654321');
        await promptObject.qualPulldown.clearAndInputUpperValue(prompt, '8,765,432.00');
        // view summary
        // a. check summary text
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(MQPromptName1);
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkQualSummary(MQPromptName1))
            .toEqual('CostBetween7654321 and 8,765,432.00at levelDefault');
        await promptEditor.toggleViewSummary();
        // run dossier and take screenshot to check data
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.isTableExist('Visualization 1'))
            .toBe(false);
        // re-prompt
        // a. check previous answer
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(MQPromptName1);
        await takeScreenshotByElement(
            promptEditor.getPromptEditor(),
            'TC59295',
            'PreviousAnswerUIPromptWithBetweenWithDefaultLevel'
        );

        // clear and Input1: 123; , wait 5 seconds
        // a. check warning msg appears on prompt page
        await promptObject.qualPulldown.clearAndInputLowserValue(prompt, '123;');
        await since('Error message for invalid action is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.qualPulldown.errorMsg(prompt))
            .toEqual('You have entered an invalid answer. Please enter a value of the correct data type.');
        // clear and input1: 987654321, wait 5 seconds(now input1>input2)
        // a. check warning msg disppears
        await promptObject.qualPulldown.clearAndInputLowserValue(prompt, '987654321');
        await promptObject.qualPulldown.clickUpperValue(prompt);
        await promptObject.qualPulldown.sleep(5000);
        await since('Error message for invalid action is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.qualPulldown.isErrorPresent(prompt))
            .toEqual(false);
        // click view summary
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(MQPromptName1);
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkQualSummary(MQPromptName1))
            .toEqual('CostBetween987654321 and 8765432at levelDefault');
        await promptEditor.toggleViewSummary();
        // run dossier
        // a. take screenshot to check data( there should have data, now there is no data//DE159002)
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.isTableExist('Visualization 1'))
            .toBe(false);
        // re-prompt
        // a. check previous answer
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(MQPromptName1);
        // clear input2
        await promptObject.qualPulldown.clearUppperValue(prompt);
        // run dossier and click OK to close the popup
        // a. take screenshot to check error msg
        // b. check error msg: The condition for your answer is not completed
        await promptEditor.run();
        await promptEditor.waitForMessageBox();
        await promptEditor.dismissError();
        await since('Error message for invalid action is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.qualPulldown.errorMsg(prompt))
            .toEqual('The condition for your answer is not completed.');
        // click cancel
        await promptEditor.cancelEditor();
    });

    it('[TC59296]MQ-Pull Down check different conditions', async () => {
        // Re-prompt
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(MQPromptName1);
        // open metric dropdown menu, choose "Profit"
        await promptObject.qualPulldown.openDropDownList(prompt);
        await promptObject.qualPulldown.selectDropDownItem(prompt, 'Profit');
        // open condition menu, choose "Equals"
        // a.take screenshot(only one value input box)
        await promptObject.qualPulldown.openMQConditionList(prompt);
        await promptObject.qualPulldown.selectMQCondition(prompt, 'Equals');
        // input "123,123"
        await promptObject.qualPulldown.clearAndInputLowserValue(prompt, '123,123');
        // view summary
        //  a. check summary text
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(MQPromptName1);
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkQualSummary(MQPromptName1))
            .toEqual('ProfitEquals123,123at levelDefault');
        await promptEditor.toggleViewSummary();
        // run dossier
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        // re-prompt
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(MQPromptName1);
        // click view summary
        // A.check previous prompt answer
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(MQPromptName1);
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkQualSummary(MQPromptName1))
            .toEqual('ProfitEquals123123at levelDefault');
        await promptEditor.toggleViewSummary();
        // open condition menu, choose "Less than or equal to"
        await promptObject.qualPulldown.openMQConditionList(prompt);
        await promptObject.qualPulldown.selectMQCondition(prompt, 'Less than or equal to');
        // open level menu, choose "Metric"
        await promptObject.qualPulldown.openMQLevelList(prompt);
        await promptObject.qualPulldown.selectMQLevel(prompt, 'Metric');
        // view summary
        //  a. check summary
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(MQPromptName1);
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkQualSummary(MQPromptName1))
            .toEqual('ProfitLess than or equal to123123at levelMetric');
        await promptEditor.toggleViewSummary();
        // run dossier
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        // re-prompt
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(MQPromptName1);
        // open condition menu, choose "Is Not Null"
        // a. take screenshot, input box is gone
        await promptObject.qualPulldown.openMQConditionList(prompt);
        await promptObject.qualPulldown.scrollDownConditionList(prompt, 200);
        await promptObject.qualPulldown.selectMQCondition(prompt, 'Is Not Null');

        // view summary
        // a. check summary text
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(MQPromptName1);
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkQualSummary(MQPromptName1))
            .toEqual('ProfitIs Not Nullat levelMetric');
        await promptEditor.toggleViewSummary();
        // open condition menu, choose "Highest"
        // take screenshot
        await promptObject.qualPulldown.openMQConditionList(prompt);
        await promptObject.qualPulldown.scrollDownConditionList(prompt, 300);
        await promptObject.qualPulldown.selectMQCondition(prompt, 'Highest');

        // cleat and input "12.3"
        await promptObject.qualPulldown.clearAndInputLowserValue(prompt, '12.3');
        // view summary
        // check summary
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(MQPromptName1);
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkQualSummary(MQPromptName1))
            .toEqual('ProfitHighest12.3at levelMetric');
        await promptEditor.toggleViewSummary();
        // run dossier
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        // re-prompt
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(MQPromptName1);
        // open condition menu, choose "Lowest%"
        await promptObject.qualPulldown.openMQConditionList(prompt);
        await promptObject.qualPulldown.scrollDownConditionList(prompt, 400);
        await promptObject.qualPulldown.selectMQCondition(prompt, 'Lowest%');
        // run dossier
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        // re-prompt
        // check input box, "12.3%"
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(MQPromptName1);
        await since('Prompt input answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.qualPulldown.getLowerValueInputValue(prompt))
            .toEqual('12.3%');
        // clear and input "-12.3%"
        await promptObject.qualPulldown.clearAndInputLowserValue(prompt, '-12.3%');
        // run dossier
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        // re-prompt
        // check input box, "-12.3%"
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(MQPromptName1);
        await since('Prompt input answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.qualPulldown.getLowerValueInputValue(prompt))
            .toEqual('-12.3%');
        // clear and input "120%"
        await promptObject.qualPulldown.clearAndInputLowserValue(prompt, '120%');
        // run dossier
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
    });

    it('[TC59297]MQ-Pull Down check conditions with special chars', async () => {
        // Re-prompt
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(MQPromptName1);
        // open metric dropdown menu, choose "Profit"
        await promptObject.qualPulldown.openDropDownList(prompt);
        await promptObject.qualPulldown.selectDropDownItem(prompt, 'Profit');
        // open level dropdown menu, choose "Metric"
        await promptObject.qualPulldown.openMQLevelList(prompt);
        await promptObject.qualPulldown.selectMQLevel(prompt, 'Metric');
        // open condition menu, choose "In"
        // a. take screenshot, input box is back
        await promptObject.qualPulldown.openMQConditionList(prompt);
        await promptObject.qualPulldown.scrollDownConditionList(prompt, 300);
        await promptObject.qualPulldown.selectMQCondition(prompt, 'In');
        // clear and input "123,"
        await promptObject.qualPulldown.clearAndInputLowserValue(prompt, '123,');
        // view summary
        // a.check summary, "123"
        // b. click view summary toggle
        // c. check input box, "123"
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(MQPromptName1);
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkQualSummary(MQPromptName1))
            .toEqual('ProfitIn123at levelMetric');
        await promptEditor.toggleViewSummary();
        await since('Prompt inpust answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.qualPulldown.getLowerValueInputValue(prompt))
            .toEqual('123');
        // clear and input "123."
        await promptObject.qualPulldown.clearAndInputLowserValue(prompt, '123.');
        // view summary
        // a. check summary, "123."
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(MQPromptName1);
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkQualSummary(MQPromptName1))
            .toEqual('ProfitIn123.at levelMetric');
        await promptEditor.toggleViewSummary();
        // run dossier
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        // re-prompt
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(MQPromptName1);
        // check input box, "123"
        await since('Prompt inpust answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.qualPulldown.getLowerValueInputValue(prompt))
            .toEqual('123');
        // clear and input "123,123.123"
        await promptObject.qualPulldown.clearAndInputLowserValue(prompt, '123,123.123');
        // view summary
        // a.check summary, "123;123.123"
        // b.click view summary toggle
        // c.check input text, '123;123.123"
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(MQPromptName1);
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkQualSummary(MQPromptName1))
            .toEqual('ProfitIn123; 123.123at levelMetric');
        await promptEditor.toggleViewSummary();
        await since('Prompt inpust answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.qualPulldown.getLowerValueInputValue(prompt))
            .toEqual('123; 123.123');
        // clear and input "1.2.3", wait for 5 seconds
        // a. check error msg
        await promptObject.qualPulldown.clearAndInputLowserValue(prompt, '123.123.123');
        await promptObject.qualPulldown.sleep(5000);
        await since('Error message for invalid action is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.qualPulldown.errorMsg(prompt))
            .toEqual('You have entered an invalid answer. Please enter a value of the correct data type.');
        // clear and input "123;456,789"
        await promptObject.qualPulldown.clearAndInputLowserValue(prompt, '123;456,789');
        // view summary
        // a.check summary, "123;456,789"
        // click view summary toggle
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(MQPromptName1);
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkQualSummary(MQPromptName1))
            .toEqual('ProfitIn123; 456,789at levelMetric');
        await promptEditor.toggleViewSummary();
        // clear and input "123,456;789"
        await promptObject.qualPulldown.clearAndInputLowserValue(prompt, '123,456;789');
        // view summary
        // check summary, "123,456;789"
        // click view summary toggle
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(MQPromptName1);
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkQualSummary(MQPromptName1))
            .toEqual('ProfitIn123,456; 789at levelMetric');
        await promptEditor.toggleViewSummary();
        // clear and input "1.23,456;789"
        await promptObject.qualPulldown.clearAndInputLowserValue(prompt, '1.23,456;789');
        // view summary
        // check summary, "1.23,456;789"
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(MQPromptName1);
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkQualSummary(MQPromptName1))
            .toEqual('ProfitIn1.23,456; 789at levelMetric');
        await promptEditor.toggleViewSummary();
        // run dossier
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        // re-prompt
        // a.get input, "1.23456;789"
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(MQPromptName1);
        await since('Prompt inpust answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.qualPulldown.getLowerValueInputValue(prompt))
            .toEqual('1.23456');
        // clear and input "123;456;"
        await promptObject.qualPulldown.clearAndInputLowserValue(prompt, '123;456;');
        // view summary
        // check summary, "123;456"
        // click view summary toggle
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(MQPromptName1);
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkQualSummary(MQPromptName1))
            .toEqual('ProfitIn123; 456at levelMetric');
        await promptEditor.toggleViewSummary();
        // clear and input "123,456,"
        await promptObject.qualPulldown.clearAndInputLowserValue(prompt, '123,456,');
        // view summary
        // check summary, "123;456"
        // click view summary toggle
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(MQPromptName1);
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkQualSummary(MQPromptName1))
            .toEqual('ProfitIn123; 456at levelMetric');
        await promptEditor.toggleViewSummary();
        // clear and input "123;456,;"
        await promptObject.qualPulldown.clearAndInputLowserValue(prompt, '123;456,;');
        // view summary
        // check summary, "123;456,"
        // click view summary toggle
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(MQPromptName1);
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkQualSummary(MQPromptName1))
            .toEqual('ProfitIn123; 456,at levelMetric');
        await promptEditor.toggleViewSummary();
        // clear and input "123;456;,", wait for 5 seconds
        await promptObject.qualPulldown.clearAndInputLowserValue(prompt, '123;456;,');
        await promptObject.qualPulldown.sleep(5000);
        // error msg
        await since('Error message for invalid action is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.qualPulldown.errorMsg(prompt))
            .toEqual('You have entered an invalid answer. Please enter a value of the correct data type.');
        await promptEditor.cancelEditor();
    });

    it('[TC59298]MQ-Pull Down choose attributes window', async () => {
        // re-prompt
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(MQPromptName1);
        // choose "Revenue"
        await promptObject.qualPulldown.openDropDownList(prompt);
        await promptObject.qualPulldown.selectDropDownItem(prompt, 'Revenue');
        // open condition menu, choose "Is Not Null"
        await promptObject.qualPulldown.openMQConditionList(prompt);
        await promptObject.qualPulldown.scrollDownConditionList(prompt, 200);
        await promptObject.qualPulldown.selectMQCondition(prompt, 'Is Not Null');
        // open level dropdown, choose "Choose attributes..."
        // a.take screenshot
        await promptObject.qualPulldown.openMQLevelList(prompt);
        await promptObject.qualPulldown.openChooseAttributesWindow(prompt);
        // search "ea"
        await promptObject.shoppingCart.searchFor(prompt, 'ea');
        await dossierPage.sleep(3000); // wait for search result
        // use '>' add first element
        // a.check count of selected element, 1
        // b.take a screenshot to check check '>' ">>" '<<' are clickable, '>' is greyed out due to the lost of focus
        await promptObject.shoppingCart.addSingle(prompt);
        await since('Prompt selected item count is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.shoppingCart.getSelectedListCount(prompt))
            .toEqual(1);
        await takeScreenshotByElement(
            promptObject.qualPulldown.getAttibuteShoppingCart(prompt),
            'TC59298',
            'PromptChooseAttributesWindowSeachbWithAdd1Item'
        );

        // switch to next page
        // a.check page index, "31-41 of 41"
        await promptObject.shoppingCart.clickFetchNext(prompt);
        // use ">>" to add all
        // b.take a screenshot to check only '<<' is clickable, all the other three are greyed out
        await promptObject.shoppingCart.addAll(prompt);
        await takeScreenshotByElement(
            promptObject.qualPulldown.getAttibuteShoppingCart(prompt),
            'TC59298',
            'PromptChooseAttributesWindowSeachbWithAddAllItems'
        );

        // "<" remove one element
        // b.take a screenshot to check  check '<' ">>" '<<' are clickable, '>' is greyed out due to the lost of focus
        await promptObject.shoppingCart.removeSingle(prompt);
        await takeScreenshotByElement(
            promptObject.qualPulldown.getAttibuteShoppingCart(prompt),
            'TC59298',
            'PromptChooseAttributesWindowSeachbWithRemoveItems'
        );

        // click OK
        await promptObject.shoppingCart.confirmValues(prompt);
        // open level dropdown menu
        // a.take screenshot
        await promptObject.qualPulldown.openMQLevelList(prompt);
        await takeScreenshot('TC59298', 'PromptUILevelDropdown');

        // view summary
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(MQPromptName1);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC59298', 'PromptSummaryChooseAttribute');

        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkQualSummary(MQPromptName1))
            .toEqual(
                'RevenueIs Not Nullat levelABS_ClaimClass_StatusReason, Business Partner Leading Partner, Buy Ready Developer Date, Buy Ready Developer Month, Buy Ready Developer Quarter, Buy Ready Developer Year, Calculated Earliest BR Date, Calculated Earliest BR Month, Calculated Earliest BR Quarter, Calculated Earliest BR Year, Call Year, Case/Claim BO Activity Created by, Case/Claim BO Activity Created on, Case/Claim BO Activity Created on Month, Case/Claim Class Status Reason, Case/claim closing year, Case/claim comment Employee creator, Case/claim creation date, Case/claim creation month, Case/claim Creation Time, Case/claim creation year, Case/claim document creation date, Claim comment creation date, Claim comment creation month, Claim comment creation time, Claim Party Repairing Dealer Dealer Code, Claim Party Selling Dealer Dealer Code, Claim Payment Year, Commission release date, Complaint Reason, Contact_Reason'
            );

        await promptEditor.toggleViewSummary();
        // open level dropdown, choose "Choose attributes..."
        await promptObject.qualPulldown.openMQLevelList(prompt);
        await promptObject.qualPulldown.openChooseAttributesWindow(prompt);
        // Remove all and search 'Year'
        await promptObject.shoppingCart.removeAll(prompt);
        await promptObject.shoppingCart.searchFor(prompt, 'Year');
        await dossierPage.sleep(3000); // wait for search result
        // Add fist item and confirm the value
        await promptObject.shoppingCart.addSingle(prompt);
        await promptObject.shoppingCart.confirmValues(prompt);
        // run dossier
        // a.take screenshot to check data
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(4);
    });
});

export const config = specConfiguration;
