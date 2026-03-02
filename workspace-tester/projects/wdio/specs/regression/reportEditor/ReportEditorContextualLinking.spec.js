import * as reportConstants from '../../../constants/report.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

describe('Report Editor - Contextual linking', () => {
    let {
        loginPage,
        libraryPage,
        reportDatasetPanel,
        reportToolbar,
        reportGridView,
        reportContextualLinkingDialog,
        reportTOC,
        reportFilterPanel,
        reportEmbeddedPromptEditor,
        reportPromptEditor,
    } = browsers.pageObj1;
    beforeAll(async () => {
        await loginPage.login(reportConstants.reportUser);
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
        await libraryPage.handleError();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC85123] E2E [Report Editor][Workstation] Contextual Link Creation: Report to Report.', async () => {
        await libraryPage.createNewReportByUrl({});
        await reportDatasetPanel.selectMultipleItemsInObjectList(['Schema Objects', 'Attributes', 'Products']);

        // And I add the object "Category" to Rows from Object Browser in Report Editor
        await reportDatasetPanel.addObjectToRows('Category');

        // And I click folder up icon to go back to upper level folder in Report Editor
        await reportDatasetPanel.clickFolderUpIcon();

        // And I select folder "Time" in object list in Report Editor
        await reportDatasetPanel.selectItemInObjectList('Time');

        // And I add the object "Year" to Rows from Object Browser in Report Editor
        await reportDatasetPanel.addObjectToRows('Year');
        await reportDatasetPanel.clickFolderUpMultipleTimes(3);
        await reportDatasetPanel.selectMultipleItemsInObjectList(['Public Objects', 'Metrics', 'Sales Metrics']);
        await reportDatasetPanel.addMultipleObjectsToColumns(['Cost', 'Profit']);

        // When I switch to design mode in Report Editor
        await reportToolbar.switchToDesignMode();

        // And I open context menu from the column header "Category" from grid view in Report Editor
        await reportGridView.openGridColumnHeaderContextMenu('Category');

        // Then the context menu should contain "Create Contextual Link" from grid view in Report Editor
        await since('The context menu should contain "Create Contextual Link"')
            .expect(await reportGridView.getContextMenuOption('Create Contextual Link'))
            .toBeTruthy();

        // When I click "Create Contextual Link" option from grid view context menu in Report Editor
        await reportGridView.clickContextMenuOption('Create Contextual Link');

        // And I click on Open in New Window checkbox in Contextual Links Editor
        await reportContextualLinkingDialog.clickOpenInNewWindowCheckbox();

        // And I click the link to button in Contextual Links Editor
        await reportContextualLinkingDialog.clickLinkToButton();

        // And I select target object named "Supplier Sales Report" in Contextual Links Editor
        await reportContextualLinkingDialog.selectTargetObject('Supplier Sales Report');

        // And I click Done button to close the Contextual Linking dialog
        await reportContextualLinkingDialog.clickDoneButtonInContextualLinkingEditor();

        // Then the grid cell with text content "Books" has link titled "Link 1"
        await since(
            'The grid cell with text content "Books" should have link titled "Link 1", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellDiv('Books').getText())
            .toBe('Link 1');
    });

    it('[TC85124] E2E [Report Editor][Workstation] Contextual Link Creation: Report to Prompted Report.', async () => {
        await libraryPage.createNewReportByUrl({});
        await reportDatasetPanel.selectMultipleItemsInObjectList(['Schema Objects', 'Attributes', 'Products']);

        // And I add the object "Category" to Rows from Object Browser in Report Editor
        await reportDatasetPanel.addObjectToRows('Category');

        // And I click folder up icon to go back to upper level folder in Report Editor
        await reportDatasetPanel.clickFolderUpIcon();

        // And I select folder "Time" in object list in Report Editor
        await reportDatasetPanel.selectItemInObjectList('Time');

        // And I add the object "Year" to Rows from Object Browser in Report Editor
        await reportDatasetPanel.addObjectToRows('Year');

        await reportDatasetPanel.clickFolderUpMultipleTimes(3);
        await reportDatasetPanel.selectMultipleItemsInObjectList(['Public Objects', 'Metrics', 'Sales Metrics']);
        await reportDatasetPanel.addMultipleObjectsToColumns(['Cost', 'Profit']);

        // When I switch to design mode in Report Editor
        await reportToolbar.switchToDesignMode();

        // And I open context menu from the column header "Category" from grid view in Report Editor
        await reportGridView.openGridColumnHeaderContextMenu('Category');

        // Then the context menu should contain "Create Contextual Link" from grid view in Report Editor
        await since('The context menu should contain "Create Contextual Link"')
            .expect(await reportEditorPanel.contextMenuContainsOption('Create Contextual Link'))
            .toBe(true);

        // When I click "Create Contextual Link" option from grid view context menu in Report Editor
        await reportGridView.clickContextMenuOption('Create Contextual Link');

        // And I click on Open in New Window checkbox in Contextual Links Editor
        await reportContextualLinkingDialog.clickOpenInNewWindowCheckbox();

        // And I change the Contextual link name to "First_Link"
        await reportContextualLinkingDialog.renameContextualLink('First_Link');

        // And I click the link to button in Contextual Links Editor
        await reportContextualLinkingDialog.clickLinkToButton();

        // And I select target object named "Prompted Category Sales Report" in Contextual Links Editor
        await reportContextualLinkingDialog.selectTargetObject('Prompted Category Sales Report');

        // And I select "Enter a Category ID" as target prompt in Contextual Links Editor
        await reportContextualLinkingDialog.selectTargetPrompt('Enter a Category ID');

        // And I select for "Use Default Answer" type for answer prompt in Contextual Links Editor
        await reportContextualLinkingDialog.selectAnswerPromptType('Use Default Answer');

        // And I click Done button to close the Contextual Linking dialog
        await reportContextualLinkingDialog.clickDoneButtonInContextualLinkingEditor();

        // Then the grid cell with text content "Books" has link titled "First_Link"
        await since('The grid cell with text content "Books" should have link titled "First_Link"')
            .expect(await reportGridView.getGridCellDiv('Books').getText())
            .toBe('First_Link');

        // When I open context menu from the column header "Cost" from grid view in Report Editor
        await reportGridView.openGridColumnHeaderContextMenu('Cost');

        // Then the context menu should contain "Create Contextual Link" from grid view in Report Editor
        await since('The context menu should contain "Create Contextual Link"')
            .expect(await reportEditorPanel.contextMenuContainsOption('Create Contextual Link'))
            .toBe(true);

        // When I click "Create Contextual Link" option from grid view context menu in Report Editor
        await reportGridView.clickContextMenuOption('Create Contextual Link');

        // And I click on Open in New Window checkbox in Contextual Links Editor
        await reportContextualLinkingDialog.clickOpenInNewWindowCheckbox();

        // And I change the Contextual link name to "Second_Link"
        await reportContextualLinkingDialog.renameContextualLink('Second_Link');

        // And I click the link to button in Contextual Links Editor
        await reportContextualLinkingDialog.clickLinkToButton();

        // And I select target object named "Prompted Category Sales Report" in Contextual Links Editor
        await reportContextualLinkingDialog.selectTargetObject('Prompted Category Sales Report');

        // And I select "Enter a Category ID" as target prompt in Contextual Links Editor
        await reportContextualLinkingDialog.selectTargetPrompt('Enter a Category ID');

        // And I select for "Prompt User" type for answer prompt in Contextual Links Editor
        await reportContextualLinkingDialog.selectAnswerPromptType('Prompt User');

        // And I click Done button to close the Contextual Linking dialog
        await reportContextualLinkingDialog.clickDoneButtonInContextualLinkingEditor();
    });

    it('[TC85128] E2E [Report Editor][Workstation] Contextual Link Creation: Prompted Report to Prompted Report.', async () => {
        await reportDatasetPanel.selectMultipleItemsInObjectList(['Schema Objects', 'Attributes', 'Geography']);

        // And I add the object "Region" to Rows from Object Browser in Report Editor
        await reportDatasetPanel.addObjectToRows('Region');
        await reportDatasetPanel.clickFolderUpMultipleTimes(3);
        await reportDatasetPanel.selectMultipleItemsInObjectList(['Public Objects', 'Metrics', 'Sales Metrics']);

        // And I add the object "Profit" to Columns from Object Browser in Report Editor
        await reportDatasetPanel.addObjectToColumns('Profit');

        // When I switch to "Filter" Panel in Report Editor
        await reportTOC.switchToFilterPanel();

        // And I click the plus button to open a new qualification editor in Filter panel at non-aggregation level in Report Editor
        await reportFilterPanel.clickNewQuqalificationPlus(1);

        // And I open Create Prompt editor
        await reportFilterPanel.createNewPrompt();

        // And I select "Elements of an attribute" prompt type
        await reportEmbeddedPromptEditor.selectPromptType('Elements of an attribute');

        // And I select for "Category" object for prompt
        await reportEmbeddedPromptEditor.searchFromPromptObject('Category');

        // And I click Done button in Embedded Prompt Editor
        await reportEmbeddedPromptEditor.clickDoneButton();

        // When I switch to design mode in Report Editor
        await reportToolbar.switchToDesignMode();

        // And I double click available object "Books" in "Category" section with index "1." in prompt editor in Report Editor
        await reportPromptEditor.chooseItemInAvailableCart(1, 'Category', 'Books');

        // And I double click available object "Electronics" in "Category" section with index "1." in prompt editor in Report Editor
        await reportPromptEditor.chooseItemInAvailableCart(1, 'Category', 'Electronics');

        // And I click Apply button in Report Prompt Editor
        await reportPromptEditor.clickEditorBtn('Run');

        // And I open context menu from the column header "Region" from grid view in Report Editor
        await reportGridView.openGridColumnHeaderContextMenu('Region');

        // Then the context menu should contain "Create Contextual Link" from grid view in Report Editor
        await since('The context menu should contain "Create Contextual Link"')
            .expect(await reportGridView.getContextMenuOption('Create Contextual Link'))
            .toBeDisplayed();

        // When I click "Create Contextual Link" option from grid view context menu in Report Editor
        await reportGridView.clickContextMenuOption('Create Contextual Link');

        // And I click on Open in New Window checkbox in Contextual Links Editor
        await reportContextualLinkingDialog.clickOpenInNewWindowCheckbox();

        // And I click the link to button in Contextual Links Editor
        await reportContextualLinkingDialog.clickLinkToButton();

        // And I select target object named "Report Prompted on Category" in Contextual Links Editor
        await reportContextualLinkingDialog.selectTargetObject('Report Prompted on Category');

        // And I select "Choose from all elements of 'Category'." as target prompt in Contextual Links Editor
        await reportContextualLinkingDialog.selectTargetPrompt("Choose from all elements of 'Category'.");

        // And I select "Answer dynamically, or with prompt from the source" as answer prompt in Contextual Links Editor
        await reportContextualLinkingDialog.selectPromptAnswerType(
            'Answer dynamically, or with prompt from the source'
        );

        // And I click Done button to close the Contextual Linking dialog
        await reportContextualLinkingDialog.clickDoneButtonInContextualLinkingEditor();

        // When I open context menu from the column header "Region" from grid view in Report Editor
        await reportGridView.openGridColumnHeaderContextMenu('Region');

        // Then the context menu should contain "Edit Contextual Link" from grid view in Report Editor
        await since('The context menu should contain "Edit Contextual Link"')
            .expect(await reportGridView.getContextMenuOption('Edit Contextual Link'))
            .toBeDisplayed();

        // And I click "Edit Contextual Link" option from grid view context menu in Report Editor
        await reportGridView.clickContextMenuOption('Edit Contextual Link');

        // And I click "Copy Link" to copy contextual link "Link 1" to "Profit" object and click "Copy" to save settings in Contextual Links Editor
        await reportContextualLinkingDialog.copyLink('Copy Link', 'Link 1', 'Profit', 'Copy');

        // And I click Done button to close the Contextual Linking dialog
        await reportContextualLinkingDialog.clickDoneButtonInContextualLinkingEditor();

        // When I open context menu from the column header "Profit" from grid view in Report Editor
        await reportGridView.openGridColumnHeaderContextMenu('Profit');

        // Then the context menu should contain "Edit Contextual Link" from grid view in Report Editor
        await since('The context menu should contain "Edit Contextual Link"')
            .expect(await reportGridView.getContextMenuOption('Edit Contextual Link'))
            .toBeDisplayed();

        // And I click "Edit Contextual Link" option from grid view context menu in Report Editor
        await reportGridView.clickContextMenuOption('Edit Contextual Link');

        // Then I checked target report "Report Prompted on Category" in copied link in Contextual Links Editor
        await since('The target report "Report Prompted on Category" should be checked')
            .expect(await reportContextualLinkingDialog.getTargetReportName('Report Prompted on Category'))
            .toBeChecked();

        // And I checked target prompt "Choose from all elements of 'Category'." in copied link in Contextual Links Editor
        await since('The target prompt "Choose from all elements of \'Category\'." should be checked')
            .expect(await reportContextualLinkingDialog.getTargetPromptName("Choose from all elements of 'Category'."))
            .toBeChecked();

        // And I select "Choose from all elements of 'Category'." as target prompt in Contextual Links Editor
        await reportContextualLinkingDialog.selectTargetPrompt("Choose from all elements of 'Category'.");

        // And I select "Answer with the same prompt from the source" as answer prompt in Contextual Links Editor
        await reportContextualLinkingDialog.selectPromptAnswerType('Answer with the same prompt from the source');

        // And I click Done button to close the Contextual Linking dialog
        await reportContextualLinkingDialog.clickDoneButtonInContextualLinkingEditor();

        // Then the grid cell with text content "Central" has link titled "Link 1"
        await since(
            'The grid cell with text content "Central" should have link titled "Link 1", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellDiv('Central').getAttribute('title'))
            .toBe('Link 1');

        // Then the grid header with text content "Profit" has link options "Links" and "Link 1"
        await reportGridView.openGridColumnHeaderContextMenu('Profit');
        await reportGridView.clickContextMenuOption('Links');
        await since(
            'The grid header with text content "Profit" should have link option "Link 1", instead we have #{actual}'
        )
            .expect(await reportGridView.getContextMenuSubOption('Link 1').isDisplayed())
            .toBe(true);
    });

    it('[TC87388] E2E [Report Editor][Workstation] contextual linking - answer prompt methods', async () => {
        await libraryPage.createNewReportByUrl({});
        await reportDatasetPanel.selectMultipleItemsInObjectList(['Schema Objects', 'Attributes', 'Products']);

        // And I add the object "Category" to Rows from Object Browser in Report Editor
        await reportDatasetPanel.addObjectToRows('Category');
        await reportDatasetPanel.clickFolderUpMultipleTimes(3);
        await reportDatasetPanel.selectMultipleItemsInObjectList(['Public Objects', 'Metrics', 'Sales Metrics']);
        // And I add the object "Profit" to Columns from Object Browser in Report Editor
        await reportDatasetPanel.addObjectToColumns('Profit');

        // When I switch to design mode in Report Editor
        await reportToolbar.switchToDesignMode();

        // And I open context menu from the column header "Category" from grid view in Report Editor
        await reportGridView.openGridColumnHeaderContextMenu('Category');

        // Then the context menu should contain "Create Contextual Link" from grid view in Report Editor
        await since('The context menu should contain "Create Contextual Link"')
            .expect(await reportGridView.getContextMenuOption('Create Contextual Link'))
            .toBeTruthy();

        // When I click "Create Contextual Link" option from grid view context menu in Report Editor
        await reportGridView.clickContextMenuOption('Create Contextual Link');

        // And I click the link to button in Contextual Links Editor
        await reportContextualLinkingDialog.clickLinkToButton();

        // And I select target object named "Prompted Category Sales Report" in Contextual Links Editor
        await reportContextualLinkingDialog.selectTargetObject('Prompted Category Sales Report');

        // And I select "Enter a Category ID" as target prompt in Contextual Links Editor
        await reportContextualLinkingDialog.selectTargetPrompt('Enter a Category ID');

        // And I select "Answer dynamically" as answer prompt in Contextual Links Editor
        await reportContextualLinkingDialog.selectPromptAnswerType('Answer dynamically');

        // And I click Done button to close the Contextual Linking dialog
        await reportContextualLinkingDialog.clickDoneButtonInContextualLinkingEditor();
        // And I open context menu from the column header "Profit" from grid view in Report Editor
        await reportGridView.openGridColumnHeaderContextMenu('Profit');

        // Then the context menu should contain "Create Contextual Link" from grid view in Report Editor
        await since('The context menu should contain "Create Contextual Link"')
            .expect(await reportGridView.getContextMenuOption('Create Contextual Link'))
            .toBeDisplayed();

        // When I click "Create Contextual Link" option from grid view context menu in Report Editor
        await reportGridView.clickContextMenuOption('Create Contextual Link');

        // And I click the link to button in Contextual Links Editor
        await reportContextualLinkingDialog.clickLinkToButton();

        // And I select target object named "Prompted Category Sales Report" in Contextual Links Editor
        await reportContextualLinkingDialog.selectTargetObject('Prompted Category Sales Report');

        // And I select "Enter a Category ID" as target prompt in Contextual Links Editor
        await reportContextualLinkingDialog.selectTargetPrompt('Enter a Category ID');

        // And I select "Answer with an empty answer" as answer prompt in Contextual Links Editor
        await reportContextualLinkingDialog.selectPromptAnswerType('Answer with an empty answer');

        // And I click Done button to close the Contextual Linking dialog
        await reportContextualLinkingDialog.clickDoneButtonInContextualLinkingEditor();

        // Then the grid cell with text content "Books" has link titled "Link 1"
        await since('The grid cell with text content "Books" should have link titled "Link 1"')
            .expect(await reportGridView.getGridCellDiv('Books').$('a[title="Link 1"]'))
            .toBeDisplayed();

        // Then the grid header with text content "Profit" has link options "Links" and "Link 1"
        await reportGridView.openGridColumnHeaderContextMenu('Profit');
        await reportGridView.clickContextMenuOption('Links');
        await since('The grid header with text content "Profit" should have link option "Link 1"')
            .expect(await reportGridView.getContextMenuSubOption('Link 1'))
            .toBeDisplayed();
    });
});
