import * as reportConstants from '../../../constants/report.js';

describe('Dossier Transaction Configuration & Consumption | E2E', () => {
    let {
        dossierAuthoringPage,
        contentsPanel,
        visualizationContainer,
        dossierMojoEditor,
        loadingDialog,
        transactionConfigEditor,
        dataSourceEditor,
        transactionConfigurationEditor,
        mappingEditor,
        inputConfiguration,
        transactionConfigurationDialog,
        popup,
        txnConfigSqlEditor,
        dossierEditor,
        menubar,
        agGrid,
        inlineEdit,
        bulkEdit,
        bulkUpdate,
        insertData,
        agGridVisualization,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(reportConstants.reportUser);
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
        await libraryPage.handleError();
    });

    it('[TC77270_1] Dossier Transaction Configuration & Consumption | E2E', async () => {
        // When I open dossier by its ID "BA4C1DDC244775D333E0548CEB9514A7"
        await dossierAuthoringPage.openDossierByID('BA4C1DDC244775D333E0548CEB9514A7');

        // Then The Dossier Editor is displayed
        await since('The Dossier Editor should be displayed')
            .expect(dossierAuthoringPage.isDossierEditorDisplayed())
            .toBe(true);

        // When I switch to page "NoTXN" in chapter "E2E" from contents panel
        await contentsPanel.clickOnPage('E2E', 'NoTXN');

        // Then Page "NoTXN" in chapter "E2E" is the current page
        await since('Page "NoTXN" in chapter "E2E" should be the current page')
            .expect(contentsPanel.getCurrentPage('NoTXN', 'E2E'))
            .toBe(true);

        // When I define new Transaction Configuration for the visualization "NoTXN" through the visualization context menu
        await visualizationContainer.openTxnConfigEditorByContextMenu('NoTXN');

        // Then An alert box shows up with title "Notification"
        await since('An alert box with title "Notification" should be displayed')
            .expect(dossierMojoEditor.getAlertEditorWithTitle('Notification').isDisplayed())
            .toBe(true);

        // When I click on the "Continue" button on the alert popup
        await dossierMojoEditor.clickHtBtnOnAlert('Continue');

        // Then The alert box with title "Notification" is closed
        await since('The alert box with title "Notification" should be closed')
            .expect(dossierMojoEditor.getAlertEditorWithTitle('Notification').isDisplayed())
            .toBe(false);

        // And Transaction Configuration Editor is "opened"
        await since('Transaction Configuration Editor should be opened')
            .expect(loadingDialog.waitLoadingDataPopUpIsNotDisplayed())
            .toBe(true);

        // When I click button "Add Table" on Transaction Configuration Editor
        await transactionConfigEditor.clickButton('Add Table');
        // Then the Select Data Source dialog is "displayed"
        await since('The Select Data Source dialog is expected to be displayed')
            .expect(await dataSourceEditor.isDialogDisplayed())
            .toBe(true);

        // When I select "YGUPostgreSQLWH" with type "DB instance" on Data Catalog of Select Data Source Editor
        await dataSourceEditor.scrollAndSelectItem('DB instance', 'YGUPostgreSQLWH');

        // Then namespace "public" is "unchecked" on table namespace option list of Select Data Source Editor
        await since('Namespace "public" is expected to be unchecked')
            .expect(await dataSourceEditor.validateNamespaceCheckbox('public', 'unchecked'))
            .toBe(true);

        // When I "check" namespace "public" on table namespace option list of Select Data Source Editor
        await dataSourceEditor.setNamespaceCheckbox('public', true);

        // Then namespace "public" is "checked" on table namespace option list of Select Data Source Editor
        await since('Namespace "public" is expected to be checked')
            .expect(await dataSourceEditor.validateNamespaceCheckbox('public', 'checked'))
            .toBe(true);

        // When I select "Connect" button on table namespace option list in Select Data Source Editor
        await dataSourceEditor.clickNamespaceListButton('Connect');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

        // Then table namsespace "public" is "displayed" under DB instance "YGUPostgreSQLWH" on Select Data Source Editor
        await since('Table namespace "public" is expected to be displayed under DB instance "YGUPostgreSQLWH"')
            .expect(await dataSourceEditor.getSelectedNamespace('YGUPostgreSQLWH', 'public', true))
            .toBe(true);

        // When I search "ygu_accounts" on Data Catalog of Select Data Source Editor
        await dataSourceEditor.searchForObject('ygu_accounts');

        // Then the item "ygu_accounts" with type "table" is "displayed" in the search result of keyword "ygu_accounts" on Data Catalog of Select Data Source Editor
        await since(
            'The item "ygu_accounts" with type "table" is expected to be displayed in the search result of keyword "ygu_accounts"'
        )
            .expect(await dataSourceEditor.getItemInSuggestionList('table', 'searchkey', 'ygu_accounts'))
            .toBe(true);

        // When I select "ygu_accounts" with type "table" in the search result of keyword "ygu_accounts" on Data Catalog of Select Data Source Editor
        await dataSourceEditor.selectItemInSuggestionList('table', 'ygu_accounts', 'searchkey');
        // And I click button "Select" on Select Data Source Editor
        await dataSourceEditor.clickButtonOnFooter('Select');

        // Then the Select Data Source dialog is "hidden"
        await since('The Select Data Source dialog should be hidden')
            .expect(await dataSourceEditor.isDialogHidden())
            .toBe(true);

        // When I "check" table column "user_id, username, password, email, notes, salary" on Database Table layout of Transaction Configuration Editor
        await transactionConfigurationEditor.checkTableColumn('user_id, username, password, email, notes, salary');

        // Then Mapping Editor on Transaction Configuration Editor has following table columns:
        await since('Mapping Editor should have the following table columns')
            .expect(await transactionConfigurationEditor.getMappingEditorTableColumns())
            .toEqual(['user_id', 'username', 'password', 'email', 'notes', 'salary']);

        // When I set dropdown of table column "user_id" from "placeholder" to "User Id@ID" as input value on Mapping View of Transaction Configuration Editor
        await mappingEditor.setDropdown('user_id', 'placeholder', 'User Id@ID');

        // And I set dropdown of table column "username" from "placeholder" to "Username@ID" as input value on Mapping View of Transaction Configuration Editor
        await mappingEditor.setDropdown('username', 'placeholder', 'Username@ID');

        // And I set dropdown of table column "password" from "placeholder" to "Password@ID" as input value on Mapping View of Transaction Configuration Editor
        await mappingEditor.setDropdown('password', 'placeholder', 'Password@ID');

        // And I set dropdown of table column "email" from "placeholder" to "Email@ID" as input value on Mapping View of Transaction Configuration Editor
        await mappingEditor.setDropdown('email', 'placeholder', 'Email@ID');

        // And I set dropdown of table column "notes" from "placeholder" to "Notes@ID" as input value on Mapping View of Transaction Configuration Editor
        await mappingEditor.setDropdown('notes', 'placeholder', 'Notes@ID');

        // And I set dropdown of table column "salary" from "placeholder" to "Salary" as input value on Mapping View of Transaction Configuration Editor
        await mappingEditor.setDropdown('salary', 'placeholder', 'Salary');
        // And I "check" where clause buttons for table columns "user_id" on Mapping Editor of Transaction Configuration Editor
        await inputConfiguration.checkWhereClauseButtons('user_id');

        // Then Mapping Editor on Transaction Configuration Editor has following table columns and input values:
        await since(
            'Mapping Editor on Transaction Configuration Editor should have the expected table columns and input values'
        )
            .expect(await transactionConfigurationEditor.getMappingEditorTableColumnsAndInputValues())
            .toBe(expectedValues);

        // When I "expand" Input Configuration on Transaction Configuration Editor
        await inputConfiguration.clickExpandIcon();

        // Then Input Configuration is "displayed" on Transaction Configuration Editor
        await since('Input Configuration should be displayed on Transaction Configuration Editor')
            .expect(await inputConfiguration.isDisplayed())
            .toBe(true);

        // And Input Configuration header on Transaction Configuration Editor is:
        await since('Input Configuration header on Transaction Configuration Editor should match the expected header')
            .expect(await inputConfiguration.getHeader())
            .toBe(expectedHeader);

        // And Input Configuration on Transaction Configuration Editor has following input values with configurations:
        await since(
            'Input Configuration on Transaction Configuration Editor should have the expected input values with configurations'
        )
            .expect(await inputConfiguration.getInputValuesWithConfigurations())
            .toBe(expectedConfigurations);

        // When I set "Control Type" of value "Password@ID" from "Textbox" to "Dropdown" in Input Configuration of Transaction Configuration Editor
        await inputConfiguration.setDropdown('Control Type', 'Password@ID', 'Textbox', 'Dropdown');

        // Then the drop down under "Control Type" of value "Password@ID" has "Dropdown" selected in Input Configuration of Transaction Configuration Editor
        await since('The drop down under "Control Type" of value "Password@ID" should have "Dropdown" selected')
            .expect(await inputConfiguration.getCurrentSelectionInDropdown('Control Type', 'Password@ID'))
            .toBe('Dropdown');

        // When I click the control type settings button for value "Password@ID" in Input Configuration of Transaction Configuration Editor
        await inputConfiguration.clickControlTypeSettingButton('Password@ID');

        // Then the popup "Dropdown Properties" is "displayed" in Transaction Configuration Editor
        await since('The popup "Dropdown Properties" should be displayed in Transaction Configuration Editor')
            .expect(await popup.getTitle('Dropdown Properties'))
            .toBe(true);
        // And the dropdown "List values" has "Dataset" as selected value on the popup "Dropdown Properties" of Transaction Configuration Editor
        await since(
            'The dropdown "List values" should have "Dataset" as selected value on the popup "Dropdown Properties" of Transaction Configuration Editor'
        )
            .expect(popup.getCurrentSelectionInDropdown('Dropdown Properties', 'List values', 'Dataset'))
            .toBe('Dataset');

        // And the properties value of "Dataset" type has "Source" as "ygu_accounts" on the popup "Dropdown Properties" of Transaction Configuration Editor
        await since(
            'The properties value of "Dataset" type should have "Source" as "ygu_accounts" on the popup "Dropdown Properties" of Transaction Configuration Editor'
        )
            .expect(popup.getCurrentSelectionInDropdown('Dropdown Properties', 'Source', 'ygu_accounts'))
            .toBe('ygu_accounts');

        // And the properties value of "Dataset" type has "Attribute" as "Password" on the popup "Dropdown Properties" of Transaction Configuration Editor
        await since(
            'The properties value of "Dataset" type should have "Attribute" as "Password" on the popup "Dropdown Properties" of Transaction Configuration Editor'
        )
            .expect(popup.getCurrentSelectionInDropdown('Dropdown Properties', 'Attribute', 'Password'))
            .toBe('Password');

        // And the properties value of "Dataset" type has "Display form" as "Automatic" on the popup "Dropdown Properties" of Transaction Configuration Editor
        await since(
            'The properties value of "Dataset" type should have "Display form" as "Automatic" on the popup "Dropdown Properties" of Transaction Configuration Editor'
        )
            .expect(popup.getCurrentSelectionInDropdown('Dropdown Properties', 'Display form', 'Automatic'))
            .toBe('Automatic');

        // And the properties value of "Dataset" type has "Writeback form" as "ID" on the popup "Dropdown Properties" of Transaction Configuration Editor
        await since(
            'The properties value of "Dataset" type should have "Writeback form" as "ID" on the popup "Dropdown Properties" of Transaction Configuration Editor'
        )
            .expect(popup.getCurrentSelectionInDropdown('Dropdown Properties', 'Writeback form', 'ID'))
            .toBe('ID');

        // When I click the control type settings button for value "Password@ID" in Input Configuration of Transaction Configuration Editor
        await inputConfiguration.clickControlTypeSettingButton('Password@ID');

        // Then the popup "Dropdown Properties" is "hidden" in Transaction Configuration Editor
        await since('The popup "Dropdown Properties" should be "hidden" in Transaction Configuration Editor')
            .expect(popup.getTitle('Dropdown Properties').isDisplayed())
            .toBe(false);

        // When I set "Control Type" of value "Notes@ID" from "Textbox" to "Dropdown" in Input Configuration of Transaction Configuration Editor
        await inputConfiguration.setDropdown('Control Type', 'Notes@ID', 'Textbox', 'Dropdown');

        // Then the drop down under "Control Type" of value "Notes@ID" has "Dropdown" selected in Input Configuration of Transaction Configuration Editor
        await since(
            'The drop down under "Control Type" of value "Notes@ID" should have "Dropdown" selected in Input Configuration of Transaction Configuration Editor'
        )
            .expect(inputConfiguration.getCurrentSelectionInDropdown('Control Type', 'Notes@ID', 'Dropdown'))
            .toBe('Dropdown');

        // When I click the control type settings button for value "Notes@ID" in Input Configuration of Transaction Configuration Editor
        await inputConfiguration.clickControlTypeSettingButton('Notes@ID');
        // Then the popup "Dropdown Properties" is "displayed" in Transaction Configuration Editor
        await since('The popup "Dropdown Properties" should be displayed')
            .expect(await popup.getTitle('Dropdown Properties'))
            .toBe('displayed');

        // And the dropdown "List values" has "Dataset" as selected value on the popup "Dropdown Properties" of Transaction Configuration Editor
        await since('The dropdown "List values" should have "Dataset" as selected value')
            .expect(await popup.getCurrentSelectionInDropdown('Dropdown Properties', 'List values'))
            .toBe('Dataset');

        // When I set the dropdown "List values" from "Dataset" to "Calculated" on the popup "Dropdown Properties" of Transaction Configuration Editor
        await popup.setDropdown('Dropdown Properties', 'List values', 'Dataset', 'Calculated');

        // Then the dropdown "List values" has "Calculated" as selected value on the popup "Dropdown Properties" of Transaction Configuration Editor
        await since('The dropdown "List values" should have "Calculated" as selected value')
            .expect(await popup.getCurrentSelectionInDropdown('Dropdown Properties', 'List values'))
            .toBe('Calculated');

        // When I set the input number field "Min value" to "0" on the popup "Dropdown Properties" of Transaction Configuration Editor
        await popup.setInputNumField('Dropdown Properties', 'Min value', '0');

        // And I set the input number field "Max value" to "100" on the popup "Dropdown Properties" of Transaction Configuration Editor
        await popup.setInputNumField('Dropdown Properties', 'Max value', '100');

        // And I set the input number field "Interval" to "10" on the popup "Dropdown Properties" of Transaction Configuration Editor
        await popup.setInputNumField('Dropdown Properties', 'Interval', '10');

        // Then the input number field "Min value" has value "0" on the popup "Dropdown Properties" of Transaction Configuration Editor
        await since('The input number field "Min value" should have value "0"')
            .expect(await popup.getInputNumField('Dropdown Properties', 'Min value'))
            .toBe('0');

        // And the input number field "Max value" has value "100" on the popup "Dropdown Properties" of Transaction Configuration Editor
        await since('The input number field "Max value" should have value "100"')
            .expect(await popup.getInputNumField('Dropdown Properties', 'Max value'))
            .toBe('100');

        // And the input number field "Interval" has value "10" on the popup "Dropdown Properties" of Transaction Configuration Editor
        await since('The input number field "Interval" should have value "10"')
            .expect(await popup.getInputNumField('Dropdown Properties', 'Interval'))
            .toBe('10');
        // When I click the control type settings button for value "Notes@ID" in Input Configuration of Transaction Configuration Editor
        await inputConfiguration.clickControlTypeSettingButton('Notes@ID');

        // Then the popup "Dropdown Properties" is "hidden" in Transaction Configuration Editor
        await since('The popup "Dropdown Properties" should be hidden')
            .expect(popup.getTitle('Dropdown Properties').isDisplayed())
            .toBe(false);

        // When I set "Control Type" of value "Salary" from "Textbox" to "Dropdown" in Input Configuration of Transaction Configuration Editor
        await inputConfiguration.setDropdown('Control Type', 'Salary', 'Textbox', 'Dropdown');

        // Then the drop down under "Control Type" of value "Salary" has "Dropdown" selected in Input Configuration of Transaction Configuration Editor
        await since('The drop down under "Control Type" of value "Salary" should have "Dropdown" selected')
            .expect(inputConfiguration.getCurrentSelectionInDropdown('Control Type', 'Salary', 'Dropdown'))
            .toBe('Dropdown');

        // When I click the control type settings button for value "Salary" in Input Configuration of Transaction Configuration Editor
        await inputConfiguration.clickControlTypeSettingButton('Salary');

        // Then the popup "Dropdown Properties" is "displayed" in Transaction Configuration Editor
        await since('The popup "Dropdown Properties" should be displayed')
            .expect(popup.getTitle('Dropdown Properties').isDisplayed())
            .toBe(true);

        // And the dropdown "List values" has "Calculated" as selected value on the popup "Dropdown Properties" of Transaction Configuration Editor
        await since('The dropdown "List values" should have "Calculated" as selected value')
            .expect(popup.getCurrentSelectionInDropdown('Dropdown Properties', 'List values', 'Calculated'))
            .toBe('Calculated');

        // When I set the dropdown "List values" from "Calculated" to "Manually Input" on the popup "Dropdown Properties" of Transaction Configuration Editor
        await popup.setDropdown('Dropdown Properties', 'List values', 'Calculated', 'Manually Input');

        // Then the dropdown "List values" has "Manually Input" as selected value on the popup "Dropdown Properties" of Transaction Configuration Editor
        await since('The dropdown "List values" should have "Manually Input" as selected value')
            .expect(popup.getCurrentSelectionInDropdown('Dropdown Properties', 'List values', 'Manually Input'))
            .toBe('Manually Input');

        // When I "check" the checkbox "Display labels in dropdown" on the popup "Dropdown Properties" of Transaction Configuration Editor
        await popup.setCheckbox('Dropdown Properties', 'Display labels in dropdown', true);
        // Then the checkbox "Display labels in dropdown" is "checked" on the popup "Dropdown Properties" of Transaction Configuration Editor
        await since('The checkbox "Display labels in dropdown" should be checked, instead we have unchecked')
            .expect(await popup.isCheckboxChecked('Display labels in dropdown', 'Dropdown Properties'))
            .toBe(true);

        // When I set value on row "1" with "Unset" as value and "No Match" as label on the popup "Dropdown Properties" of Transaction Configuration Editor
        await popup.setManualInputCell('Dropdown Properties', 1, 1, 'Unset');
        await popup.setManualInputCell('Dropdown Properties', 1, 2, 'No Match');

        // And I set value on row "2" with "50000" as value and "Level 1" as label on the popup "Dropdown Properties" of Transaction Configuration Editor
        await popup.setManualInputCell('Dropdown Properties', 2, 1, '50000');
        await popup.setManualInputCell('Dropdown Properties', 2, 2, 'Level 1');

        // And I add "1" rows of manual input value on the popup "Dropdown Properties" of Transaction Configuration Editor
        await popup.addManualInputRow('Dropdown Properties', 1);

        // And I set value on row "3" with "75000" as value and "Level 2" as label on the popup "Dropdown Properties" of Transaction Configuration Editor
        await popup.setManualInputCell('Dropdown Properties', 3, 1, '75000');
        await popup.setManualInputCell('Dropdown Properties', 3, 2, 'Level 2');

        // And I add "1" rows of manual input value on the popup "Dropdown Properties" of Transaction Configuration Editor
        await popup.addManualInputRow('Dropdown Properties', 1);

        // And I set value on row "4" with "100000" as value and "Level 3" as label on the popup "Dropdown Properties" of Transaction Configuration Editor
        await popup.setManualInputCell('Dropdown Properties', 4, 1, '100000');
        await popup.setManualInputCell('Dropdown Properties', 4, 2, 'Level 3');

        // Then the value on row "1" has "Unset" as value and "No Match" as label on the popup "Dropdown Properties" of Transaction Configuration Editor
        await since('The value on row 1 should be Unset, instead we have different value')
            .expect(await popup.getManualInputCell('Dropdown Properties', 1, 1).getValue())
            .toBe('Unset');
        await since('The label on row 1 should be No Match, instead we have different label')
            .expect(await popup.getManualInputCell('Dropdown Properties', 1, 2).getValue())
            .toBe('No Match');

        // And the value on row "2" has "50000" as value and "Level 1" as label on the popup "Dropdown Properties" of Transaction Configuration Editor
        await since('The value on row 2 should be 50000, instead we have different value')
            .expect(await popup.getManualInputCell('Dropdown Properties', 2, 1).getValue())
            .toBe('50000');
        await since('The label on row 2 should be Level 1, instead we have different label')
            .expect(await popup.getManualInputCell('Dropdown Properties', 2, 2).getValue())
            .toBe('Level 1');

        // And the value on row "3" has "75000" as value and "Level 2" as label on the popup "Dropdown Properties" of Transaction Configuration Editor
        await since('The value on row 3 should be 75000, instead we have different value')
            .expect(await popup.getManualInputCell('Dropdown Properties', 3, 1).getValue())
            .toBe('75000');
        await since('The label on row 3 should be Level 2, instead we have different label')
            .expect(await popup.getManualInputCell('Dropdown Properties', 3, 2).getValue())
            .toBe('Level 2');
        // And the value on row "4" has "100000" as value and "Level 3" as label on the popup "Dropdown Properties" of Transaction Configuration Editor
        await since('The value on row "4" should have "100000" as value and "Level 3" as label')
            .expect(popup.getManualInputCell('Dropdown Properties', 4, 1).getAttribute('value'))
            .toBe('100000');
        await since('The value on row "4" should have "100000" as value and "Level 3" as label')
            .expect(popup.getManualInputCell('Dropdown Properties', 4, 2).getAttribute('value'))
            .toBe('Level 3');

        // When I select tab "Insert Data" on Transaction Configuration Editor
        await transactionConfigEditor.selectTxnTab('Insert Data');

        // And I click mapped table "ygu_accounts" on Transaction Configuration Editor
        await transactionConfigEditor.clickMappedTable('ygu_accounts');

        // And I "check" table column "user_id, username, password, email, notes, salary" on Database Table layout of Transaction Configuration Editor
        await transactionConfigEditor.checkTableColumn('user_id, username, password, email, notes, salary');

        // Then Mapping Editor on Transaction Configuration Editor has following table columns:
        // (Assuming there is a method to verify table columns in Mapping Editor)
        await since('Mapping Editor should have the specified table columns')
            .expect(mappingEditor.verifyTableColumns(['user_id', 'username', 'password', 'email', 'notes', 'salary']))
            .toBe(true);

        // When I set dropdown of table column "user_id" from "placeholder" to "User Id@ID" as input value on Mapping View of Transaction Configuration Editor
        await mappingEditor.setDropdown('user_id', 'placeholder', 'User Id@ID');

        // And I set dropdown of table column "username" from "placeholder" to "Username@ID" as input value on Mapping View of Transaction Configuration Editor
        await mappingEditor.setDropdown('username', 'placeholder', 'Username@ID');

        // And I set dropdown of table column "password" from "placeholder" to "Password@ID" as input value on Mapping View of Transaction Configuration Editor
        await mappingEditor.setDropdown('password', 'placeholder', 'Password@ID');

        // And I set dropdown of table column "email" from "placeholder" to "Email@ID" as input value on Mapping View of Transaction Configuration Editor
        await mappingEditor.setDropdown('email', 'placeholder', 'Email@ID');

        // And I set dropdown of table column "notes" from "placeholder" to "Notes@ID" as input value on Mapping View of Transaction Configuration Editor
        await mappingEditor.setDropdown('notes', 'placeholder', 'Notes@ID');
        // And I set dropdown of table column "salary" from "placeholder" to "Salary" as input value on Mapping View of Transaction Configuration Editor
        await mappingEditor.setDropdown('salary', 'placeholder', 'Salary');

        // Then Mapping Editor on Transaction Configuration Editor has following table columns and input values:
        // (No specific method provided, assuming a custom implementation is needed)
        // await since('Mapping Editor should have the expected table columns and input values').expect(await MappingEditor.getTableColumnsAndInputValues()).toBe(expectedValues);

        // When I "expand" Input Configuration on Transaction Configuration Editor
        await inputConfiguration.clickExpandIcon();

        // Then Input Configuration is "displayed" on Transaction Configuration Editor
        await since('Input Configuration should be displayed')
            .expect(await inputConfiguration.isDisplayed())
            .toBe(true);

        // And Input Configuration header on Transaction Configuration Editor is:
        // (No specific method provided, assuming a custom implementation is needed)
        // await since('Input Configuration header should match the expected header').expect(await InputConfiguration.getHeader()).toBe(expectedHeader);

        // And Input Configuration on Transaction Configuration Editor has following input values with configurations:
        // (No specific method provided, assuming a custom implementation is needed)
        // await since('Input Configuration should have the expected input values with configurations').expect(await InputConfiguration.getInputValuesWithConfigurations()).toBe(expectedConfigurations);

        // When I select tab "Delete Data" on Transaction Configuration Editor
        await transactionConfigEditor.selectTxnTab('Delete Data');

        // And I click mapped table "ygu_accounts" on Transaction Configuration Editor
        await transactionConfigEditor.clickMappedTable('ygu_accounts');

        // And I select "SQL" view on Transaction Configuration Editor
        await txnConfigSqlEditor.selectTxnView('SQL');

        // Then The active view is "SQL" on Transaction Configuration Editor
        await since('The active view should be SQL')
            .expect(await txnConfigSqlEditor.getActiveView())
            .toBe('SQL');
        // When I clear all text in Transaction Configuration SQL Editor
        await transactionConfigEditor.clearAllTextInSqlEditor();

        // And I type in Transaction Configuration SQL Editor
        await transactionConfigEditor.typeInSqlEditor(text);

        // Then The sql text on Transaction Configuration Editor should be
        await since('The sql text on Transaction Configuration Editor should be #{expected}, instead we have #{actual}')
            .expect(await transactionConfigEditor.getSqlText())
            .toBe(sqlText);

        // When I click button "Done" on Transaction Configuration Editor
        await transactionConfigEditor.clickButton(buttonName);

        // Then Transaction Configuration Editor is "closed"
        await since('Transaction Configuration Editor should be closed')
            .expect(await transactionConfigEditor.isEditorClosed())
            .toBe(true);

        // And The Dossier Editor is displayed
        await since('The Dossier Editor should be displayed')
            .expect(await dossierEditor.isDisplayed())
            .toBe(true);

        // When I select "Save As..." from menu bar "File" on Web
        await menubar.actionOnmenubarWithSubmenu('File', 'Save As...');

        // Then The Dossier Editor is displayed
        await since('The Dossier Editor should be displayed')
            .expect(await dossierEditor.isDisplayed())
            .toBe(true);
    });

    it('[TC77270_2] Dossier Transaction Configuration & Consumption | E2E', async () => {
        // When I open dossier by its ID "9966F2D44F427684BF80C08742BF4A90" in Presentation mode
        await dossierAuthoringPage.openDossierByIDInPresentationMode('9966F2D44F427684BF80C08742BF4A90');

        // Then Dossier is refreshed in Library consumption mode
        await since('Dossier should be refreshed in Library consumption mode')
            .expect(loadingDialog.waitLibraryLoadingIsNotDisplayed(browser.params.timeout.waitDOMNodePresentTimeout60))
            .toBe(true);

        // When I right click on grid cell at "2", "2" and select the delete option "Delete Row" from ag-grid "RestoreData_ygu_accounts"
        await agGrid.openContextMenuItemForCellAtPosition(2, 2, 'Delete Row', 'RestoreData_ygu_accounts');

        // Then a confirmation popup shows at the center of the dossier
        await since('A confirmation popup should show at the center of the dossier')
            .expect(agGrid.getConfirmationPopup().isPresent())
            .toBe(true);

        // When I click "Continue" on the confirmation popup
        await agGrid.selectConfirmationPopupOption('Continue');

        // Then Dossier is refreshed in Library consumption mode
        await since('Dossier should be refreshed in Library consumption mode')
            .expect(loadingDialog.waitLibraryLoadingIsNotDisplayed(browser.params.timeout.waitDOMNodePresentTimeout60))
            .toBe(true);

        // When I open dossier by its ID "4557000C3E4422D38D46D691B4895826" in Presentation mode
        await dossierAuthoringPage.openDossierByIDInPresentationMode('4557000C3E4422D38D46D691B4895826');

        // Then Dossier is refreshed in Library consumption mode
        await since('Dossier should be refreshed in Library consumption mode')
            .expect(loadingDialog.waitLibraryLoadingIsNotDisplayed(browser.params.timeout.waitDOMNodePresentTimeout60))
            .toBe(true);

        // And the grid cell in ag-grid "NoTXN" at "1", "1" has text "yiwen88888"
        await since('The grid cell in ag-grid "NoTXN" at "1", "1" should have text "yiwen88888"')
            .expect(agGrid.getGridCellByPosition(1, 1, 'NoTXN').getText())
            .toBe('yiwen88888');
        // When I double click on grid cell at "1", "1" from ag-grid "NoTXN"
        await inlineEdit.getGridCellByPosition(1, 1, 'NoTXN').doubleClick();

        // Then the grid cell in ag-grid "NoTXN" at "1", "1" should be "editable"
        await since('The grid cell in ag-grid "NoTXN" at "1", "1" should be editable')
            .expect(inlineEdit.getEditGridCellAtPosition(1, 1, 'NoTXN').isPresent())
            .toBe(true);

        // And the transaction edit icon should be "displayed" on grid cell at "1", "1" from ag-grid "NoTXN"
        await since('The transaction edit icon should be displayed on grid cell at "1", "1" from ag-grid "NoTXN"')
            .expect(inlineEdit.getConfirmContainer(1, 1, 'NoTXN').isPresent())
            .toBe(true);

        // When I input "yiwen777" in the text field of grid cell in ag-grid "NoTXN" at "1", "1"
        await inlineEdit.replaceTextInGridCell(1, 1, 'NoTXN', 'yiwen777');

        // And I click "confirm" transaction edit icon for grid cell at "1", "1" from ag-grid "NoTXN"
        await inlineEdit.clickConfirmContainerIcon(1, 1, 'NoTXN', 'confirm');

        // Then Dossier is refreshed in Library consumption mode
        await loadingDialog.waitForConsumptionModeToRefresh();

        // And the grid cell in ag-grid "NoTXN" at "1", "1" has text "yiwen777"
        await since('The grid cell in ag-grid "NoTXN" at "1", "1" should have text "yiwen777"')
            .expect(inlineEdit.getGridCellByPosition(1, 1, 'NoTXN').getText())
            .toBe('yiwen777');

        // And Dossier is refreshed in Library consumption mode
        await loadingDialog.waitForConsumptionModeToRefresh();

        // When I double click on grid cell at "1", "5" from ag-grid "NoTXN"
        await inlineEdit.getGridCellByPosition(1, 5, 'NoTXN').doubleClick();

        // And I select option "Level 3" in drop down list for Inline Data Update on Transaction Consumption
        await agGrid.selectDropdownOption('Level 3');
        // And I click "confirm" transaction edit icon for grid cell at "1", "5" from ag-grid "NoTXN"
        await inlineEdit.clickConfirmContainerIcon(1, 5, 'NoTXN', 'confirm');

        // Then Dossier is refreshed in Library consumption mode
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await loadingDialog.waitForConsumptionModeToRefresh();

        // And the grid cell in ag-grid "NoTXN" at "1", "5" has text "Level 3"
        await since(
            'The grid cell in ag-grid "NoTXN" at "1", "5" should have text "Level 3", instead we have #{actual}'
        )
            .expect(agGrid.getGridCellByPosition(1, 5, 'NoTXN').getText())
            .toBe('Level 3');

        // When I click bulk edit icon and select "Update Data" for ag-grid "NoTXN"
        await bulkEdit.enterBulkTxnMode('Update Data', 'NoTXN');

        // Then the ag-grid "NoTXN" displays in bulk edit mode and "Update" toolbar should be "displayed"
        await since(
            'The ag-grid "NoTXN" should display in bulk edit mode and "Update" toolbar should be "displayed", instead we have #{actual}'
        )
            .expect(bulkEdit.getBulkEditSubmitButton('NoTXN', 'Update').isDisplayed())
            .toBe(true);

        // When I click on bulk transaction grid cell at "2", "1" during bulk "Update"
        await bulkEdit.clickBulkTxnGridCellByPosition(2, 1, 'Update');

        // And I input "CindyYu" in the text field of grid cell in ag-grid "NoTXN" at "2", "1"
        await inlineEdit.replaceTextInGridCell(2, 1, 'NoTXN', 'CindyYu');

        // And I hit enter on the input
        await bulkUpdate.enterOnInput();

        // And I click on bulk transaction grid cell at "2", "2" during bulk "Update"
        await bulkEdit.clickBulkTxnGridCellByPosition(2, 2, 'Update');

        // And I select option "123pwd" in drop down list for Inline Data Update on Transaction Consumption
        await agGrid.selectDropdownOption('123pwd');
        // Then the grid cell in ag-grid "NoTXN" at "2", "2" has text "123pwd"
        await since('The grid cell in ag-grid "NoTXN" at "2", "2" should have text "123pwd", instead we have #{actual}')
            .expect(await agGrid.getGridCellByPosition(2, 2, 'NoTXN').getText())
            .toBe('123pwd');

        // And the grid cell at position "2", "2" "is" an updated cell
        await since('The grid cell at position "2", "2" should be an updated cell, instead we have #{actual}')
            .expect(await bulkUpdate.getUpdatedCell(2, 2).isDisplayed())
            .toBe(true);

        // And the transaction dialog in ag-grid "NoTXN" should say "2 fields modified." on the top right
        await since(
            'The transaction dialog in ag-grid "NoTXN" should say "2 fields modified." on the top right, instead we have #{actual}'
        )
            .expect(await agGrid.getTransactionDialogText('NoTXN'))
            .toBe('2 fields modified.');

        // When I click on bulk transaction grid cell at "2", "3" during bulk "Update"
        await bulkEdit.clickBulkTxnGridCellByPosition(2, 3, 'Update');

        // And I input "CindyYu@mstr.com" in the text field of grid cell in ag-grid "NoTXN" at "2", "3"
        await inlineEdit.replaceTextInGridCell(2, 3, 'NoTXN', 'CindyYu@mstr.com');

        // And I hit enter on the input
        await bulkUpdate.enterOnInput();

        // Then the grid cell at position "2", "3" "is" an updated cell
        await since('The grid cell at position "2", "3" should be an updated cell, instead we have #{actual}')
            .expect(await bulkUpdate.getUpdatedCell(2, 3).isDisplayed())
            .toBe(true);

        // And the transaction dialog in ag-grid "NoTXN" should say "3 fields modified." on the top right
        await since(
            'The transaction dialog in ag-grid "NoTXN" should say "3 fields modified." on the top right, instead we have #{actual}'
        )
            .expect(await agGrid.getTransactionDialogText('NoTXN'))
            .toBe('3 fields modified.');

        // When I click "Update" for a bulk transaction in ag-grid "NoTXN"
        await bulkEdit.clickOnBulkEditSubmitButton('NoTXN', 'Update');

        // Then a confirmation popup shows at the center of the dossier
        await since('A confirmation popup should show at the center of the dossier, instead we have #{actual}')
            .expect(await agGrid.getConfirmationPopup().isDisplayed())
            .toBe(true);
        // When I click "Continue" on the confirmation popup
        await agGrid.selectConfirmationPopupOption('Continue');

        // Then The alert box with title "Update Data" is closed
        await since('The alert box with title "Update Data" should be closed')
            .expect(await dossierMojoEditor.getAlertEditorWithTitle('Update Data').isPresent())
            .toBe(false);

        // And Dossier is refreshed in Library consumption mode
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await agGrid.waitForConsumptionModeToRefresh();

        // And the grid cell in ag-grid "NoTXN" at "2", "1" has text "CindyYu"
        await since('The grid cell in ag-grid "NoTXN" at "2", "1" should have text "CindyYu"')
            .expect(await agGrid.getGridCellByPosition(2, 1, 'NoTXN').getText())
            .toBe('CindyYu');

        // And the grid cell in ag-grid "NoTXN" at "2", "2" has text "123pwd"
        await since('The grid cell in ag-grid "NoTXN" at "2", "2" should have text "123pwd"')
            .expect(await agGrid.getGridCellByPosition(2, 2, 'NoTXN').getText())
            .toBe('123pwd');

        // And the grid cell in ag-grid "NoTXN" at "2", "3" has text "CindyYu@mstr.com"
        await since('The grid cell in ag-grid "NoTXN" at "2", "3" should have text "CindyYu@mstr.com"')
            .expect(await agGrid.getGridCellByPosition(2, 3, 'NoTXN').getText())
            .toBe('CindyYu@mstr.com');

        // When I click bulk edit icon and select "Insert Data" for ag-grid "NoTXN"
        await bulkEdit.enterBulkTxnMode('Insert Data', 'NoTXN');

        // Then insert data container and toolbar for Transaction Consumption mode should be "displayed" on container "NoTXN"
        await since(
            'Insert data container and toolbar for Transaction Consumption mode should be displayed on container "NoTXN"'
        )
            .expect(await insertData.getInlineInsertContainer('NoTXN').isDisplayed())
            .toBe(true);

        // And insert data layout on Transaction Consumption mode should have following headers:
        // (Assuming headers are checked in a separate step, as the original step does not provide specific headers to check)

        // When I input "3" and hit Enter in the text field of insert data cell for "User Id ID" at row "1" in Transaction Consumption mode
        await insertData.inputInsertTextBoxWithEnter('3', await insertData.getInsertTextBox('User Id ID', 1, 'NoTXN'));
        // And I input "E2E" and hit Enter in the text field of insert data cell for "Username ID" at row "1" in Transaction Consumption mode
        await insertData.inputInsertTextBoxWithEnter('E2E', await insertData.getInsertTextBox('Username ID', 1));

        // And I set dropdown of insert data cell for "Password ID" at row "1" to "123pwd" in Transaction Consumption mode
        await insertData.chooseInsertDropdownOption(
            '123pwd',
            await insertData.getInsertDropdownOverlay(await insertData.getInsertDropdown('Password ID', 1))
        );

        // And I input "e2e@mstr.com" and hit Enter in the text field of insert data cell for "Email ID" at row "1" in Transaction Consumption mode
        await insertData.inputInsertTextBoxWithEnter('e2e@mstr.com', await insertData.getInsertTextBox('Email ID', 1));

        // And I set dropdown of insert data cell for "Notes ID" at row "1" to "30" in Transaction Consumption mode
        await insertData.chooseInsertDropdownOption(
            '30',
            await insertData.getInsertDropdownOverlay(await insertData.getInsertDropdown('Notes ID', 1))
        );

        // And I set dropdown of insert data cell for "Salary" at row "1" to "Level 1" in Transaction Consumption mode
        await insertData.chooseInsertDropdownOption(
            'Level 1',
            await insertData.getInsertDropdownOverlay(await insertData.getInsertDropdown('Salary', 1))
        );

        // And I click add a new row button
        await insertData.addNewRow();

        // And I click add a new row button
        await insertData.addNewRow();

        // Then there should be "3" rows in the insert dialog
        await since('The number of rows should be 3, instead we have #{actual}')
            .expect(await insertData.getNumberOfRows())
            .toBe(3);

        // When I click the x button to delete row "2"
        await insertData.deleteRow(2);

        // Then there should be "2" rows in the insert dialog
        await since('The number of rows should be 2, instead we have #{actual}')
            .expect(await insertData.getNumberOfRows())
            .toBe(2);
        // When I input "5" and hit Enter in the text field of insert data cell for "User Id ID" at row "2" in Transaction Consumption mode
        await insertData.inputInsertTextBoxWithEnter('5', await insertData.getInsertTextBox('User Id ID', 2));

        // And I input "E2E2" and hit Enter in the text field of insert data cell for "Username ID" at row "2" in Transaction Consumption mode
        await insertData.inputInsertTextBoxWithEnter('E2E2', await insertData.getInsertTextBox('Username ID', 2));

        // And I set dropdown of insert data cell for "Password ID" at row "2" to "abc123" in Transaction Consumption mode
        await insertData.chooseInsertDropdownOption(
            'abc123',
            await insertData.getInsertDropdownOverlay(await insertData.getInsertDropdown('Password ID', 2))
        );

        // And I input "e2e2@mstr.com" and hit Enter in the text field of insert data cell for "Email ID" at row "2" in Transaction Consumption mode
        await insertData.inputInsertTextBoxWithEnter('e2e2@mstr.com', await insertData.getInsertTextBox('Email ID', 2));

        // And I set dropdown of insert data cell for "Notes ID" at row "2" to "50" in Transaction Consumption mode
        await insertData.chooseInsertDropdownOption(
            '50',
            await insertData.getInsertDropdownOverlay(await insertData.getInsertDropdown('Notes ID', 2))
        );

        // And I set dropdown of insert data cell for "Salary" at row "2" to "Level 2" in Transaction Consumption mode
        await insertData.chooseInsertDropdownOption(
            'Level 2',
            await insertData.getInsertDropdownOverlay(await insertData.getInsertDropdown('Salary', 2))
        );

        // Then data cells on insert data layout of Transaction Consumption mode has values:
        await since('Data cells on insert data layout of Transaction Consumption mode should have values')
            .expect(await insertData.getInsertInputElements())
            .toBeTruthy();

        // And the "Add" button should be "enabled" on the transaction consumption mode
        await since('The "Add" button should be enabled on the transaction consumption mode')
            .expect(await insertData.getButton('Add').isEnabled())
            .toBe(true);

        // And I click the "Add" button on Transaction Consumption mode
        await insertData.clickButton('Add');

        // And I click the "Continue" button on the popup window
        await insertData.clickButton('Continue');
        // Then Dossier is refreshed in Library consumption mode
        await loadingDialog.waitForConsumptionModeToRefresh();

        // And the grid cell in ag-grid "NoTXN" at "3", "0" has text "3"
        await since('The grid cell in ag-grid "NoTXN" at "3", "0" should have text "3", instead we have #{actual}')
            .expect(agGrid.getGridCellByPosition(3, 0, 'NoTXN').getText())
            .toBe('3');

        // And the grid cell in ag-grid "NoTXN" at "3", "1" has text "E2E"
        await since('The grid cell in ag-grid "NoTXN" at "3", "1" should have text "E2E", instead we have #{actual}')
            .expect(agGrid.getGridCellByPosition(3, 1, 'NoTXN').getText())
            .toBe('E2E');

        // And the grid cell in ag-grid "NoTXN" at "3", "2" has text "123pwd"
        await since('The grid cell in ag-grid "NoTXN" at "3", "2" should have text "123pwd", instead we have #{actual}')
            .expect(agGrid.getGridCellByPosition(3, 2, 'NoTXN').getText())
            .toBe('123pwd');

        // And the grid cell in ag-grid "NoTXN" at "3", "3" has text "e2e@mstr.com"
        await since(
            'The grid cell in ag-grid "NoTXN" at "3", "3" should have text "e2e@mstr.com", instead we have #{actual}'
        )
            .expect(agGrid.getGridCellByPosition(3, 3, 'NoTXN').getText())
            .toBe('e2e@mstr.com');

        // And the grid cell in ag-grid "NoTXN" at "3", "4" has text "30"
        await since('The grid cell in ag-grid "NoTXN" at "3", "4" should have text "30", instead we have #{actual}')
            .expect(agGrid.getGridCellByPosition(3, 4, 'NoTXN').getText())
            .toBe('30');

        // And the grid cell in ag-grid "NoTXN" at "5", "0" has text "5"
        await since('The grid cell in ag-grid "NoTXN" at "5", "0" should have text "5", instead we have #{actual}')
            .expect(agGrid.getGridCellByPosition(5, 0, 'NoTXN').getText())
            .toBe('5');

        // And the grid cell in ag-grid "NoTXN" at "5", "1" has text "E2E2"
        await since('The grid cell in ag-grid "NoTXN" at "5", "1" should have text "E2E2", instead we have #{actual}')
            .expect(agGrid.getGridCellByPosition(5, 1, 'NoTXN').getText())
            .toBe('E2E2');

        // And the grid cell in ag-grid "NoTXN" at "5", "2" has text "abc123"
        await since('The grid cell in ag-grid "NoTXN" at "5", "2" should have text "abc123", instead we have #{actual}')
            .expect(agGrid.getGridCellByPosition(5, 2, 'NoTXN').getText())
            .toBe('abc123');

        // And the grid cell in ag-grid "NoTXN" at "5", "3" has text "e2e2@mstr.com"
        await since(
            'The grid cell in ag-grid "NoTXN" at "5", "3" should have text "e2e2@mstr.com", instead we have #{actual}'
        )
            .expect(agGrid.getGridCellByPosition(5, 3, 'NoTXN').getText())
            .toBe('e2e2@mstr.com');
        // And the grid cell in ag-grid "NoTXN" at "5", "4" has text "50"
        await since('The grid cell in ag-grid "NoTXN" at "5", "4" should have text "50", instead we have #{actual}')
            .expect(agGridVisualization.getGridCellByPosition(5, 4, 'NoTXN').getText())
            .toBe('50');

        // When I right click on value "yiwen777" and select the delete option "Delete Row" from ag-grid "NoTXN"
        await agGrid.openContextMenuItemForValue('yiwen777', 'Delete Row', 'NoTXN');

        // Then a confirmation popup shows at the center of the dossier
        await since('A confirmation popup should be displayed at the center of the dossier, instead we have #{actual}')
            .expect(agGrid.getConfirmationPopup().isDisplayed())
            .toBe(true);

        // When I click "Continue" on the confirmation popup
        await agGrid.selectConfirmationPopupOption('Continue');

        // And Dossier is refreshed in Library consumption mode
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

        // And the grid cell "yiwen777" at position "1", "1" should be deleted from ag-grid "NoTXN"
        await since(
            'The grid cell "yiwen777" at position "1", "1" should be deleted from ag-grid "NoTXN", instead we have #{actual}'
        )
            .expect(agGridVisualization.getGridCellByPosition(1, 1, 'NoTXN').isPresent())
            .toBe(false);

        // When I click bulk edit icon and select "Delete Data" for ag-grid "NoTXN"
        await bulkEdit.enterBulkTxnMode('Delete Data', 'NoTXN');

        // Then the ag-grid "NoTXN" displays in bulk edit mode and "Delete" toolbar should be "displayed"
        await since(
            'The ag-grid "NoTXN" should display in bulk edit mode and "Delete" toolbar should be displayed, instead we have #{actual}'
        )
            .expect(bulkEdit.getBulkEditSubmitButton('NoTXN', 'Delete').isDisplayed())
            .toBe(true);

        // When I click on bulk transaction grid cell at "2", "0" during bulk "Delete"
        await bulkEdit.clickBulkTxnGridCellByPosition(2, 0, 'Delete');

        // And I click on bulk transaction grid cell at "4", "0" during bulk "Delete"
        await bulkEdit.clickBulkTxnGridCellByPosition(4, 0, 'Delete');
        // Then the transaction dialog in ag-grid "NoTXN" should say "2 rows to delete." on the top right
        await since('The transaction dialog in ag-grid "NoTXN" should say "2 rows to delete." on the top right')
            .expect(await agGrid.getTransactionDialogText('NoTXN'))
            .toBe('2 rows to delete.');

        // And row "1" should be "checked" in bulk delete mode
        await since('Row "1" should be "checked" in bulk delete mode')
            .expect(await bulkDelete.getCheckedDeleteRow(1))
            .toBe(true);

        // And row "3" should be "checked" in bulk delete mode
        await since('Row "3" should be "checked" in bulk delete mode')
            .expect(await bulkDelete.getCheckedDeleteRow(3))
            .toBe(true);

        // When I click "Delete" for a bulk transaction in ag-grid "NoTXN"
        await bulkEdit.clickOnBulkEditSubmitButton('NoTXN', 'Delete');

        // Then a confirmation popup shows at the center of the dossier
        await since('A confirmation popup shows at the center of the dossier')
            .expect(await agGrid.getConfirmationPopup().isDisplayed())
            .toBe(true);

        // When I click "Continue" on the confirmation popup
        await agGrid.selectConfirmationPopupOption('Continue');

        // Then Dossier is refreshed in Library consumption mode
        await loadingDialog.waitForConsumptionModeToRefresh();

        // And the grid cell "3" at position "2", "0" should be deleted from ag-grid "NoTXN"
        await since('The grid cell "3" at position "2", "0" should be deleted from ag-grid "NoTXN"')
            .expect(await agGridVisualization.getGridCellByPosition(2, 0, 'NoTXN').isPresent())
            .toBe(false);

        // And the grid cell "5" at position "5", "0" should be deleted from ag-grid "NoTXN"
        await since('The grid cell "5" at position "5", "0" should be deleted from ag-grid "NoTXN"')
            .expect(await agGridVisualization.getGridCellByPosition(5, 0, 'NoTXN').isPresent())
            .toBe(false);
    });

    it('[TC77270_3] Dossier Transaction Configuration & Consumption | E2E', async () => {
        // When I open dossier by its ID "4557000C3E4422D38D46D691B4895826"
        await dossierAuthoringPage.openDossierByID('4557000C3E4422D38D46D691B4895826');

        // Then The Dossier Editor is displayed
        await since('The Dossier Editor should be displayed')
            .expect(dossierAuthoringPage.isDossierEditorDisplayed())
            .toBe(true);

        // When I clear the Transaction Configuration for the visualization "NoTXN" through the visualization context menu
        await visualizationContainer.clearTxnConfigByContextMenu('NoTXN');

        // Then The Dossier Editor is displayed
        await since('The Dossier Editor should be displayed')
            .expect(dossierAuthoringPage.isDossierEditorDisplayed())
            .toBe(true);

        // When I define new Transaction Configuration for the visualization "NoTXN" through the visualization context menu
        await visualizationContainer.openTxnConfigEditorByContextMenu('NoTXN');

        // Then An alert box shows up with title "Notification"
        await since('An alert box with title "Notification" should be displayed')
            .expect(dossierMojoEditor.getAlertEditorWithTitle('Notification').isDisplayed())
            .toBe(true);

        // When I click on the "Continue" button on the alert popup
        await dossierMojoEditor.clickHtBtnOnAlert('Continue');

        // Then The alert box with title "Notification" is closed
        await since('The alert box with title "Notification" should be closed')
            .expect(dossierMojoEditor.getAlertEditorWithTitle('Notification').isPresent())
            .toBe(false);

        // And Transaction Configuration Editor is "opened"
        await since('Transaction Configuration Editor should be opened')
            .expect(loadingDialog.waitLoadingDataPopUpIsNotDisplayed())
            .toBe(true);

        // Then Add Table button is "displayed" on Transaction Configuration Editor
        await since('Add Table button should be displayed on Transaction Configuration Editor')
            .expect(transactionConfigurationEditor.isAddTableButtonDisplayed())
            .toBe(true);
        // And The active tab is "Update Data" on Transaction Configuration Editor
        await since(
            'The active tab is expected to be Update Data, instead we have ' +
                (await transactionConfigEditor.getActiveTxnTab())
        )
            .expect(await transactionConfigEditor.getActiveTxnTab())
            .toBe('Update Data');

        // When I select tab "Insert Data" on Transaction Configuration Editor
        await transactionConfigEditor.selectTxnTab('Insert Data');

        // Then Add Table button is "displayed" on Transaction Configuration Editor
        await since(
            'Add Table button is expected to be displayed, instead we have ' +
                (await transactionConfigEditor.isAddTableButtonDisplayed())
        )
            .expect(await transactionConfigEditor.isAddTableButtonDisplayed())
            .toBe(true);

        // And The active tab is "Insert Data" on Transaction Configuration Editor
        await since(
            'The active tab is expected to be Insert Data, instead we have ' +
                (await transactionConfigEditor.getActiveTxnTab())
        )
            .expect(await transactionConfigEditor.getActiveTxnTab())
            .toBe('Insert Data');

        // When I select tab "Delete Data" on Transaction Configuration Editor
        await transactionConfigEditor.selectTxnTab('Delete Data');

        // Then Add Table button is "displayed" on Transaction Configuration Editor
        await since(
            'Add Table button is expected to be displayed, instead we have ' +
                (await transactionConfigEditor.isAddTableButtonDisplayed())
        )
            .expect(await transactionConfigEditor.isAddTableButtonDisplayed())
            .toBe(true);

        // And The active tab is "Delete Data" on Transaction Configuration Editor
        await since(
            'The active tab is expected to be Delete Data, instead we have ' +
                (await transactionConfigEditor.getActiveTxnTab())
        )
            .expect(await transactionConfigEditor.getActiveTxnTab())
            .toBe('Delete Data');

        // When I click button "Done" on Transaction Configuration Editor
        await transactionConfigEditor.clickButton('Done');

        // Then Transaction Configuration Editor is "closed"
        await since(
            'Transaction Configuration Editor is expected to be closed, instead we have ' +
                (await loadingDialog.isTransactionConfigEditorClosed())
        )
            .expect(await loadingDialog.isTransactionConfigEditorClosed())
            .toBe(true);

        // When I select "Save As..." from menu bar "File" on Web
        await menubar.actionOnmenubarWithSubmenu('File', 'Save As...');
        // Then The Dossier Editor is displayed
        await since('The Dossier Editor should be displayed')
            .expect(await dossierEditor.isDisplayed())
            .toBe(true);

        // When I define new Transaction Configuration for the visualization "NoTXN" through the visualization context menu
        await visualizationContainer.openTxnConfigEditorByContextMenu('NoTXN');

        // Then An alert box shows up with title "Notification"
        await since('An alert box with title "Notification" should be displayed')
            .expect(await dossierMojoEditor.getAlertEditorWithTitle('Notification').isDisplayed())
            .toBe(true);

        // When I click on the "Continue" button on the alert popup
        await dossierMojoEditor.clickHtBtnOnAlert('Continue');

        // Then The alert box with title "Notification" is closed
        await since('The alert box with title "Notification" should be closed')
            .expect(await dossierMojoEditor.getAlertEditorWithTitle('Notification').isPresent())
            .toBe(false);

        // And Transaction Configuration Editor is "opened"
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

        // Then Add Table button is "displayed" on Transaction Configuration Editor
        await since('Add Table button should be displayed on Transaction Configuration Editor')
            .expect(await transactionConfigEditor.isAddTableButtonDisplayed())
            .toBe(true);

        // And The active tab is "Update Data" on Transaction Configuration Editor
        await since('The active tab should be "Update Data" on Transaction Configuration Editor')
            .expect(await transactionConfigEditor.getActiveTxnTab())
            .toBe('Update Data');

        // When I select tab "Insert Data" on Transaction Configuration Editor
        await transactionConfigEditor.selectTxnTab('Insert Data');

        // Then Add Table button is "displayed" on Transaction Configuration Editor
        await since('Add Table button should be displayed on Transaction Configuration Editor')
            .expect(await transactionConfigEditor.isAddTableButtonDisplayed())
            .toBe(true);
        // And The active tab is "Insert Data" on Transaction Configuration Editor
        await since(
            'The active tab is expected to be Insert Data, instead we have ' +
                (await transactionConfigEditor.getActiveTxnTab())
        )
            .expect(await transactionConfigEditor.getActiveTxnTab())
            .toBe('Insert Data');

        // When I select tab "Delete Data" on Transaction Configuration Editor
        await transactionConfigEditor.selectTxnTab('Delete Data');

        // Then Add Table button is "displayed" on Transaction Configuration Editor
        await since(
            'Add Table button is expected to be displayed, instead we have ' +
                (await transactionConfigEditor.isAddTableButtonDisplayed())
        )
            .expect(await transactionConfigEditor.isAddTableButtonDisplayed())
            .toBe(true);

        // And The active tab is "Delete Data" on Transaction Configuration Editor
        await since(
            'The active tab is expected to be Delete Data, instead we have ' +
                (await transactionConfigEditor.getActiveTxnTab())
        )
            .expect(await transactionConfigEditor.getActiveTxnTab())
            .toBe('Delete Data');

        // When I click button "Done" on Transaction Configuration Editor
        await transactionConfigEditor.clickButton('Done');

        // Then Transaction Configuration Editor is "closed"
        await since(
            'Transaction Configuration Editor is expected to be closed, instead we have ' +
                (await loadingDialog.isTransactionConfigEditorClosed())
        )
            .expect(await loadingDialog.isTransactionConfigEditorClosed())
            .toBe(true);
    });

    it('[TC77270_4] Dossier Transaction Configuration & Consumption | E2E', async () => {
        // When I open dossier by its ID "7BF999F9B4420FDFB8FDC7B21324C942"
        await dossierAuthoringPage.openDossierByID('7BF999F9B4420FDFB8FDC7B21324C942');

        // Then The Dossier Editor is displayed
        await since('The Dossier Editor should be displayed')
            .expect(await dossierAuthoringPage.isDossierEditorDisplayed())
            .toBe(true);

        // When I switch to page "Basic_YesTXN" in chapter "Basic" from contents panel
        await contentsPanel.clickOnPage('Basic', 'Basic_YesTXN');

        // Then Page "Basic_YesTXN" in chapter "Basic" is the current page
        await since('Page "Basic_YesTXN" in chapter "Basic" should be the current page')
            .expect(await contentsPanel.getCurrentPage('Basic_YesTXN', 'Basic'))
            .toBe(true);

        // When I edit the Transaction Configuration for the visualization "Basic_YesTXN" through the visualization context menu
        await visualizationContainer.editTxnConfigByContextMenu('Basic_YesTXN');

        // Then Transaction Configuration Editor is "opened"
        await since('Transaction Configuration Editor should be opened')
            .expect(await loadingDialog.waitLoadingDataPopUpIsNotDisplayed())
            .toBe(true);

        // When I select tab "Update Data" on Transaction Configuration Editor
        await transactionConfigEditor.selectTxnTab('Update Data');

        // Then The active tab is "Update Data" on Transaction Configuration Editor
        await since('The active tab should be "Update Data"')
            .expect(await transactionConfigEditor.getActiveTxnTab())
            .toBe('Update Data');

        // When I "expand" Input Configuration on Transaction Configuration Editor
        await inputConfiguration.clickExpandIcon();

        // Then Input Configuration is "displayed" on Transaction Configuration Editor
        await since('Input Configuration should be displayed')
            .expect(await inputConfiguration.isDisplayed())
            .toBe(true);
        // And the transaction configuration dialog "Update" tab screenshot of dossier "REG_LiveWH_Icon" should match the baselines
        await since(
            'The transaction configuration dialog "Update" tab screenshot of dossier "REG_LiveWH_Icon" should match the baselines'
        )
            .expect(await transactionConfigEditor.matchScreenshot('Update', 'REG_LiveWH_Icon'))
            .toBe(true);

        // When I select tab "Insert Data" on Transaction Configuration Editor
        await transactionConfigEditor.selectTxnTab('Insert Data');

        // Then The active tab is "Insert Data" on Transaction Configuration Editor
        await since('The active tab is expected to be Insert Data, instead we have #{actual}')
            .expect(await transactionConfigEditor.getActiveTxnTab())
            .toBe('Insert Data');

        // When I "expand" Input Configuration on Transaction Configuration Editor
        await inputConfiguration.clickExpandIcon();

        // Then Input Configuration is "displayed" on Transaction Configuration Editor
        await since('Input Configuration is expected to be displayed, instead we have #{actual}')
            .expect(await inputConfiguration.isDisplayed())
            .toBe(true);

        // And the transaction configuration dialog "Insert" tab screenshot of dossier "REG_LiveWH_Icon" should match the baselines
        await since(
            'The transaction configuration dialog "Insert" tab screenshot of dossier "REG_LiveWH_Icon" should match the baselines'
        )
            .expect(await transactionConfigEditor.matchScreenshot('Insert', 'REG_LiveWH_Icon'))
            .toBe(true);

        // When I select tab "Delete Data" on Transaction Configuration Editor
        await transactionConfigEditor.selectTxnTab('Delete Data');

        // Then The active tab is "Delete Data" on Transaction Configuration Editor
        await since('The active tab is expected to be Delete Data, instead we have #{actual}')
            .expect(await transactionConfigEditor.getActiveTxnTab())
            .toBe('Delete Data');

        // When I "expand" Input Configuration on Transaction Configuration Editor
        await inputConfiguration.clickExpandIcon();

        // Then Input Configuration is "displayed" on Transaction Configuration Editor
        await since('Input Configuration is expected to be displayed, instead we have #{actual}')
            .expect(await inputConfiguration.isDisplayed())
            .toBe(true);
        // And the transaction configuration dialog "Delete" tab screenshot of dossier "REG_LiveWH_Icon" should match the baselines
        await since(
            'The transaction configuration dialog "Delete" tab screenshot of dossier "REG_LiveWH_Icon" should match the baselines'
        )
            .expect(await transactionConfigurationDialog.getTabScreenshot('Delete', 'REG_LiveWH_Icon'))
            .toMatchBaseline();
    });
});
