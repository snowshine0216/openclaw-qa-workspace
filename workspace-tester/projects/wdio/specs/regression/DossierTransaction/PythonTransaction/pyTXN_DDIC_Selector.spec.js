import { SelectTargetInLayersPanel } from '../../../../pageObjects/authoring/SelectTargetInLayersPanel.ts';

import * as dossierTXN from '../../../../constants/dossierTXN.js';

describe('24.03 Dossier Transaction in canvas selector can filter DDIC list', () => {
    let {
        dossierAuthoringPage,
        loadingDialog,
        agGrid,
        baseContainer,
        bulkEdit,
        insertData,
        loginPage,
        libraryPage,
        tocContentsPanel,
        tocMenu,
        inCanvasSelector_Authoring,
    } = browsers.pageObj1;
    const selectTargetInLayersPanel = new SelectTargetInLayersPanel();

    beforeAll(async () => {
        await loginPage.login(dossierTXN.txnAutoUser.username, dossierTXN.txnAutoUser.password);
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
        await libraryPage.handleError();
    });

    it('[TC93353_1] Dossier Transaction in canvas selector/DDIC - Case 1', async () => {
        // When I open dossier by its ID "936DBA062C4FD0A6D2F1B99555C8481E" in Presentation mode without reset
        await libraryPage.openDossierById({
            projectId: dossierTXN.dossierTXNProject.id,
            dossierId: '936DBA062C4FD0A6D2F1B99555C8481E',
        });

        // Then Dossier is refreshed in Library consumption mode
        await since('Library Loading Data pop up should not be displayed')
            .expect(loadingDialog.waitLoadingDataPopUpIsNotDisplayed())
            .toBe(true);

        // When I right click on grid cell at "2", "2" and select the delete option "Delete Row" from ag-grid "RestoreData_ygu_python"
        await agGrid.openContextMenuItemForCellAtPosition(2, 2, 'Delete Row', 'RestoreData_ygu_python');

        // Then a confirmation popup shows at the center of the dossier
        await since('Confirmation popup should be displayed')
            .expect(agGrid.getConfirmationPopup().isDisplayed())
            .toBe(true);

        // When I click "Continue" on the confirmation popup
        await agGrid.selectConfirmationPopupOption('Continue');

        // Then Dossier is refreshed in Library consumption mode
        await since('Library Loading Data pop up should not be displayed')
            .expect(loadingDialog.waitLoadingDataPopUpIsNotDisplayed())
            .toBe(true);

        // When I open dossier by its ID "A56EE8194E0DB29BBE9F6580850A9F4B" in Design mode
        await libraryPage.editDossierByUrl({
            projectId: dossierTXN.dossierTXNProject.id,
            dossierId: 'A56EE8194E0DB29BBE9F6580850A9F4B',
        });

        // When I switch to page "YesTXN" in chapter "Python_DDIC" from contents panel
        await tocMenu.goToPage('Python_DDIC', 'YesTXN');
        // Then Page "YesTXN" in chapter "Python_DDIC" is the current page
        await since('Page "YesTXN" in chapter "Python_DDIC" should be the current page')
            .expect(await tocContentsPanel.getCurrentPage('YesTXN', 'Python_DDIC').isExisting())
            .toBe(true);

        // When I duplicate page "YesTXN" in "Python_DDIC"
        await tocContentsPanel.contextMenuOnPage('YesTXN', 'Python_DDIC', 'Duplicate Page');

        // Then A new page "YesTXN copy " is inserted in "Python_DDIC"
        await since('A new page "YesTXN copy" should be inserted in "Python_DDIC"')
            .expect(await tocContentsPanel.getPageTitleText('Python_DDIC', 'YesTXN copy').isExisting())
            .toBe(true);

        // When I click on select target as source for selector "Created On"
        await selectTargetInLayersPanel.selectTargetButton('Created On');

        // Then A select source button appears on the Viz "Created On"
        await since('A select source button should appear on the Viz "Created On"')
            .expect(await selectTargetInLayersPanel.getSourceButton('Created On').isExisting())
            .toBe(true);

        // When I click on container "YesTXN_DDIC" to select it
        await baseContainer.clickContainerByScript('YesTXN_DDIC');

        // Then A target button appears on the viz "YesTXN_DDIC"
        await since('A target button should appear on the viz "YesTXN_DDIC"')
            .expect(await selectTargetInLayersPanel.getTargetButton('YesTXN_DDIC').isExisting())
            .toBe(true);

        // When I click on container "YesTXN_noDDIC" to select it
        await baseContainer.clickContainerByScript('YesTXN_noDDIC');

        // Then A target button appears on the viz "YesTXN_noDDIC"
        await since('A target button should appear on the viz "YesTXN_noDDIC"')
            .expect(await selectTargetInLayersPanel.getTargetButton('YesTXN_noDDIC').isExisting())
            .toBe(true);

        // And the DDIC candidate picker in Visualization "YesTXN_DDIC" is present
        await since('The DDIC candidate picker in Visualization "YesTXN_DDIC" should be present')
            .expect(await selectTargetInLayersPanel.getDDICcandidatePicker('YesTXN_DDIC').isExisting())
            .toBe(true);
        // And the DDIC candidate picker in Visualization "YesTXN_noDDIC" is not present
        await since('The DDIC candidate picker in Visualization "YesTXN_noDDIC" is expected to be not present')
            .expect(selectTargetInLayersPanel.getDDICcandidatePicker('YesTXN_noDDIC').isDisplayed())
            .toBe(false);

        // When I clik to open the DDIC candidate picker dropdown in Visualization "YesTXN_DDIC"
        await selectTargetInLayersPanel.openDDICdropdown('YesTXN_DDIC');

        // Then the DDIC candidate picker dropdown contains elements "Username@ID, Created On@ID, Age, Email@ID"
        await since(
            'The DDIC candidate picker dropdown should contain elements "Username@ID, Created On@ID, Age, Email@ID"'
        )
            .expect(selectTargetInLayersPanel.getDDICcandidatePickerPullDownOption())
            .toEqual(['Username@ID', 'Created On@ID', 'Age', 'Email@ID']);

        // When I click on checkboxes for "Username@ID, Created On@ID" in the DDIC candidate picker dropdown
        await selectTargetInLayersPanel.checkElementUnderDDICdropdown(['Username@ID', 'Created On@ID']);

        // Then the DDIC candidate picker dropdown option "Username@ID" should be checked
        await since('The DDIC candidate picker dropdown option "Username@ID" should be checked')
            .expect(selectTargetInLayersPanel.getDDICcandidatePickerPullDownOption('Username@ID').getAttribute('class'))
            .toContain('checked');

        // And the DDIC candidate picker dropdown option "Created On@ID" should be checked
        await since('The DDIC candidate picker dropdown option "Created On@ID" should be checked')
            .expect(
                selectTargetInLayersPanel.getDDICcandidatePickerPullDownOption('Created On@ID').getAttribute('class')
            )
            .toContain('checked');

        // And the DDIC candidate picker dropdown option "Age" should be unchecked
        await since('The DDIC candidate picker dropdown option "Age" should be unchecked')
            .expect(selectTargetInLayersPanel.getDDICcandidatePickerPullDownOption('Age').getAttribute('class'))
            .not.toContain('checked');

        // And the DDIC candidate picker dropdown option "Email@ID" should be unchecked
        await since('The DDIC candidate picker dropdown option "Email@ID" should be unchecked')
            .expect(selectTargetInLayersPanel.getDDICcandidatePickerPullDownOption('Email@ID').getAttribute('class'))
            .not.toContain('checked');

        // When I click on button "OK" in the DDIC candidate picker dropdown
        await selectTargetInLayersPanel.clickDDICdropdownBtn('OK');

        // And I click on apply button
        await selectTargetInLayersPanel.applyButtonForSelectTarget();
        // When I select following elements "(All),1/6/2022 12:00:00 AM,4/23/2022 12:00:00 AM" in dropdown selector "Created On"
        await inCanvasSelector_Authoring.selectElementsInDropdown(
            'Created On',
            '(All),1/6/2022 12:00:00 AM,4/23/2022 12:00:00 AM'
        );

        // Then The ag-grid "YesTXN_DDIC" should have 7 rows of data
        await since('The ag-grid "YesTXN_DDIC" should have 7 rows of data, instead we have #{actual}')
            .expect(await agGrid.getAllAgGridObjectCount('YesTXN_DDIC'))
            .toBe(7);

        // And The ag-grid "YesTXN_noDDIC" should have 7 rows of data
        await since('The ag-grid "YesTXN_noDDIC" should have 7 rows of data, instead we have #{actual}')
            .expect(await agGrid.getAllAgGridObjectCount('YesTXN_noDDIC'))
            .toBe(7);

        // When I select "Save As..." from menu bar "File" on Web
        await dossierAuthoringPage.actionOnMenubarWithSubmenu('File', 'Save As...');

        // And I open dossier by its ID "5DD3F261174CD2A1EEC6D0B260F2634B" in Presentation mode
        await libraryPage.openDossierById({
            projectId: dossierTXN.dossierTXNProject.id,
            dossierId: '5DD3F261174CD2A1EEC6D0B260F2634B',
        });

        // And The ag-grid "YesTXN_DDIC" should have 7 rows of data
        await since('The ag-grid "YesTXN_DDIC" should have 7 rows of data, instead we have #{actual}')
            .expect(await agGrid.getAllAgGridObjectCount('YesTXN_DDIC'))
            .toBe(7);

        // And The ag-grid "YesTXN_noDDIC" should have 7 rows of data
        await since('The ag-grid "YesTXN_noDDIC" should have 7 rows of data, instead we have #{actual}')
            .expect(await agGrid.getAllAgGridObjectCount('YesTXN_noDDIC'))
            .toBe(7);
        // When I click bulk edit icon and select "E2E_Combine" for ag-grid "YesTXN_DDIC"
        await bulkEdit.enterBulkTxnMode('E2E_Combine', 'YesTXN_DDIC');

        // Then the ag-grid "YesTXN_DDIC" displays in bulk edit mode and "E2E_Combine" toolbar should be "displayed"
        await since(
            'The ag-grid "YesTXN_DDIC" should display in bulk edit mode and "E2E_Combine" toolbar should be displayed'
        )
            .expect(await bulkEdit.getBulkEditSubmitButton('YesTXN_DDIC', 'E2E_Combine').isDisplayed())
            .toBe(true);

        // When I click on bulk transaction grid cell at "1", "1" during bulk "E2E_Combine" for python
        await bulkEdit.clickBulkTxnGridCellByPosition(1, 1, 'E2E_Combine');

        // And the ag grid cell has dropdown with "39" options in Transaction consumption mode
        await since('The ag grid cell should have dropdown with 39 options in Transaction consumption mode')
            .expect(await agGrid.getPulldownOptionCount())
            .toBe(39);

        // And I select option "Bates" in drop down list for Inline Data Update on Transaction Consumption
        await agGrid.selectDropdownOption('Bates');

        // Then the grid cell in ag-grid "YesTXN_DDIC" at "1", "1" has text "Bates"
        await since('The grid cell in ag-grid "YesTXN_DDIC" at "1", "1" should have text "Bates"')
            .expect(await agGrid.getGridCellByPosition(1, 1, 'YesTXN_DDIC').getText())
            .toBe('Bates');

        // And the transaction dialog in ag-grid "YesTXN_DDIC" should say "1 modification" on the top right
        await since('The transaction dialog in ag-grid "YesTXN_DDIC" should say "1 modification" on the top right')
            .expect(await agGrid.getTransactionDialogText('YesTXN_DDIC'))
            .toBe('1 modification');
        await since('The height of transaction dialog should be 40px')
            .expect(await agGrid.getTransactionDialogTextHeight('YesTXN_DDIC', '1 modification'))
            .toBe('26px');

        // When I click on bulk transaction grid cell at "1", "4" during bulk "E2E_Combine" for python
        await bulkEdit.clickBulkTxnGridCellByPosition(1, 4, 'E2E_Combine');

        // And the ag grid cell has dropdown with "2" options in Transaction consumption mode
        await since('The ag grid cell should have dropdown with 2 options in Transaction consumption mode')
            .expect(await agGrid.getPulldownOptionCount())
            .toBe(2);

        // And I select option "1/6/2022 12:00:00 AM" in drop down list for Inline Data Update on Transaction Consumption
        await agGrid.selectDropdownOption('1/6/2022 12:00:00 AM');
        // Then the grid cell in ag-grid "YesTXN_DDIC" at "1", "4" has text "1/6/2022 12:00:00 AM"
        await since(
            'The grid cell in ag-grid "YesTXN_DDIC" at "1", "4" should have text "1/6/2022 12:00:00 AM", instead we have #{actual}'
        )
            .expect(await agGrid.getGridCellByPosition(1, 4, 'YesTXN_DDIC').getText())
            .toBe('1/6/2022 12:00:00 AM');

        // And the transaction dialog in ag-grid "YesTXN_DDIC" should say "2 modifications" on the top right
        await since(
            'The transaction dialog in ag-grid "YesTXN_DDIC" should say "2 modifications" on the top right, instead we have #{actual}'
        )
            .expect(await agGrid.getTransactionDialogText('YesTXN_DDIC'))
            .toBe('2 modifications');

        // When I click "Add Data" for a bulk transaction in ag-grid "YesTXN_DDIC"
        await bulkEdit.clickOnBulkEditSubmitButton('YesTXN_DDIC', 'Add Data');

        // And I input "2024" and hit Enter in the text field of insert data cell for "User Id ID" at row "1" in Transaction Consumption mode
        await insertData.inputInsertTextBoxWithEnter('2024', await insertData.getInsertTextBox('User Id ID', 1));

        // And I click on the dropdown field of insert data cell for "Username ID" at row "1" in Transaction Consumption mode
        await insertData.getInsertDropdownOverlay(await insertData.getInsertDropdown('Username ID', 1));

        // And I input "be" in the dropdown text field of insert data cell for "Username ID" at row "1" in Transaction Consumption mode
        await insertData.typeInsertTextBox('be', await insertData.getDropdownInsertTextBox('Username ID', 1));

        // Then the dropdown list has "4" search results
        await since('The dropdown list should have 4 search results, instead we have #{actual}')
            .expect((await insertData.getAllInsertDropdownOptions()).length)
            .toBe(4);

        // When I set dropdown of insert data cell for "Username ID" at row "1" to "Becker" in Transaction Consumption mode
        await insertData.chooseInsertDropdownOption(
            'Becker',
            await insertData.getInsertDropdownOverlay(await insertData.getInsertDropdown('Username ID', 1))
        );

        // And I set dropdown of insert data cell for "Password ID" at row "1" to "P1" in Transaction Consumption mode
        await insertData.chooseInsertDropdownOption(
            'P1',
            await insertData.getInsertDropdownOverlay(await insertData.getInsertDropdown('Password ID', 1))
        );

        // When I click on the dropdown field of insert data cell for "Email ID" at row "1" in Transaction Consumption mode
        await insertData.getInsertDropdownOverlay(await insertData.getInsertDropdown('Email ID', 1));
        // And I input "yiwen" in the dropdown text field of insert data cell for "Email ID" at row "1" in Transaction Consumption mode
        await insertData.clickDropdownInsertTextBox('Email ID', 1);
        await insertData.typeInsertTextBox('yiwen');

        // Then I set dropdown of insert data cell for "Email ID" at row "1" to "yiwen@mstr.com" in Transaction Consumption mode
        await insertData.clickOnInsertDropdown('Email ID', 1);
        await insertData.getInsertDropdownOverlay(insertData.getInsertDropdown('Email ID', 1));
        await insertData.chooseInsertDropdownOption('yiwen@mstr.com');

        // When I click on the dropdown field of insert data cell for "Created On ID" at row "1" in Transaction Consumption mode
        await insertData.clickOnInsertDropdown('Created On ID', 1);
        await insertData.getInsertDropdownOverlay(insertData.getInsertDropdown('Created On ID', 1));

        // Then the dropdown list has "2" search results
        await since('The dropdown list should have 2 search results, instead we have #{actual}')
            .expect(insertData.getAllInsertDropdownOptions().length)
            .toBe(2);

        // And I set dropdown of insert data cell for "Created On ID" at row "1" to "1/6/2022 12:00:00 AM" in Transaction Consumption mode
        await insertData.clickOnInsertDropdown('Created On ID', 1);
        await insertData.getInsertDropdownOverlay(insertData.getInsertDropdown('Created On ID', 1));
        await insertData.chooseInsertDropdownOption('1/6/2022 12:00:00 AM');

        // And I input "1/1/2024" and hit Enter in the text field of insert data cell for "Date Type ID" at row "1" in Transaction Consumption mode
        await insertData.clickInsertDataCell('Date Type ID', 1);
        await insertData.inputInsertTextBoxWithEnter('1/1/2024', insertData.getInsertTextBox('Date Type ID', 1));

        // And I input "5000" and hit Enter in the text field of insert data cell for "Salary" at row "1" in Transaction Consumption mode
        await insertData.clickInsertDataCell('Salary', 1);
        await insertData.inputInsertTextBoxWithEnter('5000', insertData.getInsertTextBox('Salary', 1));

        // And I set dropdown of insert data cell for "Age" at row "1" to "36" in Transaction Consumption mode
        await insertData.clickOnInsertDropdown('Age', 1).click();
        await insertData.getInsertDropdownOverlay(insertData.getInsertDropdown('Age', 1));
        await insertData.chooseInsertDropdownOption('36');

        // When I click the "Add" button on Transaction Consumption mode
        await insertData.clickButton('Add');

        // And I click "E2E_Combine" for a bulk transaction in ag-grid "YesTXN_DDIC"
        await bulkEdit.clickOnBulkEditSubmitButton('YesTXN_DDIC', 'E2E_Combine');
        // Then a confirmation popup shows at the center of the dossier
        await since('A confirmation popup should be displayed at the center of the dossier')
            .expect(agGrid.getConfirmationPopup().isDisplayed())
            .toBe(true);

        // When I click "Continue" on the confirmation popup
        await agGrid.selectConfirmationPopupOption('Continue');

        // Then the transaction confirmation popup is closed
        await since('The transaction confirmation popup should be closed')
            .expect(agGrid.getConfirmationPopup().isDisplayed())
            .toBe(false);

        // And Dossier is refreshed in Library consumption mode
        await agGrid.waitForConsumptionModeToRefresh();

        // And the grid cell in ag-grid "YesTXN_DDIC" at "1", "1" has text "Michael"
        await since('The grid cell in ag-grid "YesTXN_DDIC" at "1", "1" should have text "Michael"')
            .expect(agGrid.getGridCellByPosition(1, 1, 'YesTXN_DDIC').getText())
            .toBe('Michael');

        // And the grid cell in ag-grid "YesTXN_DDIC" at "1", "4" has text "1/6/2022 12:00:00 AM"
        await since('The grid cell in ag-grid "YesTXN_DDIC" at "1", "4" should have text "1/6/2022 12:00:00 AM')
            .expect(agGrid.getGridCellByPosition(1, 4, 'YesTXN_DDIC').getText())
            .toBe('1/6/2022 12:00:00 AM');

        // And the grid cell in ag-grid "YesTXN_DDIC" at "8", "0" has text "2024"
        await since('The grid cell in ag-grid "YesTXN_DDIC" at "8", "0" should have text "2024"')
            .expect(agGrid.getGridCellByPosition(8, 0, 'YesTXN_DDIC').getText())
            .toBe('2024');

        // And the grid cell in ag-grid "YesTXN_DDIC" at "8", "1" has text "Kyle"
        await since('The grid cell in ag-grid "YesTXN_DDIC" at "8", "1" should have text "Kyle"')
            .expect(agGrid.getGridCellByPosition(8, 1, 'YesTXN_DDIC').getText())
            .toBe('Kyle');

        // And the grid cell in ag-grid "YesTXN_DDIC" at "8", "2" has text "P1"
        await since('The grid cell in ag-grid "YesTXN_DDIC" at "8", "2" should have text "P1"')
            .expect(agGrid.getGridCellByPosition(8, 2, 'YesTXN_DDIC').getText())
            .toBe('P1');

        // And the grid cell in ag-grid "YesTXN_DDIC" at "8", "3" has text "yiwen@mstr.com"
        await since('The grid cell in ag-grid "YesTXN_DDIC" at "8", "3" should have text "yiwen@mstr.com"')
            .expect(agGrid.getGridCellByPosition(8, 3, 'YesTXN_DDIC').getText())
            .toBe('yiwen@mstr.com');
        // And the grid cell in ag-grid "YesTXN_DDIC" at "8", "4" has text "1/6/2022 12:00:00 AM"
        await since(
            'The grid cell in ag-grid "YesTXN_DDIC" at "8", "4" should have text "1/6/2022 12:00:00 AM", instead we have #{actual}'
        )
            .expect(await agGrid.getGridCellByPosition(8, 4, 'YesTXN_DDIC').getText())
            .toBe('1/6/2022 12:00:00 AM');

        // And the grid cell in ag-grid "YesTXN_DDIC" at "8", "5" has text "1/1/2024"
        await since(
            'The grid cell in ag-grid "YesTXN_DDIC" at "8", "5" should have text "1/1/2024", instead we have #{actual}'
        )
            .expect(await agGrid.getGridCellByPosition(8, 5, 'YesTXN_DDIC').getText())
            .toBe('1/1/2024');

        // And the grid cell in ag-grid "YesTXN_DDIC" at "8", "6" has text "5000"
        await since(
            'The grid cell in ag-grid "YesTXN_DDIC" at "8", "6" should have text "5000", instead we have #{actual}'
        )
            .expect(await agGrid.getGridCellByPosition(8, 6, 'YesTXN_DDIC').getText())
            .toBe('5000');

        // And the grid cell in ag-grid "YesTXN_DDIC" at "8", "7" has text "36"
        await since(
            'The grid cell in ag-grid "YesTXN_DDIC" at "8", "7" should have text "36", instead we have #{actual}'
        )
            .expect(await agGrid.getGridCellByPosition(8, 7, 'YesTXN_DDIC').getText())
            .toBe('36');
    });

    it('[TC93353_2] Dossier Transaction in canvas selector/DDIC - Case 2', async () => {
        // When I open dossier by its ID "936DBA062C4FD0A6D2F1B99555C8481E" in Presentation mode without reset
        await libraryPage.openDossierById({
            projectId: dossierTXN.dossierTXNProject.id,
            dossierId: '936DBA062C4FD0A6D2F1B99555C8481E',
        });

        // Then Dossier is refreshed in Library consumption mode
        await since('Library Loading Data pop up should not be displayed')
            .expect(loadingDialog.waitLoadingDataPopUpIsNotDisplayed())
            .toBe(true);

        // When I right click on grid cell at "2", "2" and select the delete option "Delete Row" from ag-grid "RestoreData_ygu_python"
        await agGrid.openContextMenuItemForCellAtPosition(2, 2, 'Delete Row', 'RestoreData_ygu_python');

        // Then a confirmation popup shows at the center of the dossier
        await since('Confirmation popup should be displayed')
            .expect(agGrid.getConfirmationPopup().isDisplayed())
            .toBe(true);

        // When I click "Continue" on the confirmation popup
        await agGrid.selectConfirmationPopupOption('Continue');

        // Then Dossier is refreshed in Library consumption mode
        await since('Library Loading Data pop up should not be displayed')
            .expect(loadingDialog.waitLoadingDataPopUpIsNotDisplayed())
            .toBe(true);

        // When I open dossier by its ID "A56EE8194E0DB29BBE9F6580850A9F4B" in Design mode
        await libraryPage.editDossierByUrl({
            projectId: dossierTXN.dossierTXNProject.id,
            dossierId: 'A56EE8194E0DB29BBE9F6580850A9F4B',
        });

        // When I switch to page "YesTXN" in chapter "Python_DDIC" from contents panel
        await tocContentsPanel.clickOnPage('Python_DDIC', 'YesTXN');
        // Then Page "YesTXN" in chapter "Python_DDIC" is the current page
        await since('Page "YesTXN" in chapter "Python_DDIC" should be the current page, instead we have different page')
            .expect(await tocContentsPanel.getCurrentPage('YesTXN', 'Python_DDIC').isExisting())
            .toBe(true);

        // When I duplicate page "YesTXN" in "Python_DDIC"
        await tocContentsPanel.contextMenuOnPage('YesTXN', 'Python_DDIC', 'Duplicate Page');

        // Then A new page "YesTXN copy " is inserted in "Python_DDIC"
        await since('A new page "YesTXN copy" should be inserted in "Python_DDIC", instead it is not')
            .expect(await tocContentsPanel.getPageTitleText('Python_DDIC', 'YesTXN copy').isExisting())
            .toBe(true);

        // When I click on select target as source for selector "Username"
        await selectTargetInLayersPanel.selectTargetButton('Username');

        // Then A select source button appears on the Viz "Username"
        await since('A select source button should appear on the Viz "Username", instead it is not')
            .expect(await selectTargetInLayersPanel.getSourceButton('Username').isExisting())
            .toBe(true);

        // When I click on container "YesTXN_DDIC" to select it
        await baseContainer.clickContainerByScript('YesTXN_DDIC');

        // Then A target button appears on the viz "YesTXN_DDIC"
        await since('A target button should appear on the viz "YesTXN_DDIC", instead it is not')
            .expect(await selectTargetInLayersPanel.getTargetButton('YesTXN_DDIC').isExisting())
            .toBe(true);

        // When I click on container "YesTXN_noDDIC" to select it
        await baseContainer.clickContainerByScript('YesTXN_noDDIC');

        // Then A target button appears on the viz "YesTXN_noDDIC"
        await since('A target button should appear on the viz "YesTXN_noDDIC", instead it is not')
            .expect(await selectTargetInLayersPanel.getTargetButton('YesTXN_noDDIC').isExisting())
            .toBe(true);

        // And the DDIC candidate picker in Visualization "YesTXN_DDIC" is present
        await since('The DDIC candidate picker in Visualization "YesTXN_DDIC" should be present, instead it is not')
            .expect(await selectTargetInLayersPanel.getDDICcandidatePicker('YesTXN_DDIC').isExisting())
            .toBe(true);
        // And the DDIC candidate picker in Visualization "YesTXN_noDDIC" is not present
        await since('The DDIC candidate picker in Visualization "YesTXN_noDDIC" is expected to be not present')
            .expect(selectTargetInLayersPanel.getDDICcandidatePicker('YesTXN_noDDIC').isDisplayed())
            .toBe(false);

        // When I clik to open the DDIC candidate picker dropdown in Visualization "YesTXN_DDIC"
        await selectTargetInLayersPanel.openDDICdropdown('YesTXN_DDIC');

        // Then the DDIC candidate picker dropdown contains elements "Username@ID, Created On@ID, Age, Email@ID"
        await selectTargetInLayersPanel.checkElementUnderDDICdropdown([
            'Username@ID',
            'Created On@ID',
            'Age',
            'Email@ID',
        ]);

        // When I click on checkboxes for "Username@ID, Created On@ID" in the DDIC candidate picker dropdown
        await selectTargetInLayersPanel.checkElementUnderDDICdropdown(['Username@ID', 'Created On@ID']);

        // Then the DDIC candidate picker dropdown option "Username@ID" should be checked
        await since('The DDIC candidate picker dropdown option "Username@ID" should be checked')
            .expect(selectTargetInLayersPanel.getDDICcandidatePickerPullDownOption('Username@ID').getAttribute('class'))
            .toContain('selected');

        // And the DDIC candidate picker dropdown option "Created On@ID" should be checked
        await since('The DDIC candidate picker dropdown option "Created On@ID" should be checked')
            .expect(
                selectTargetInLayersPanel.getDDICcandidatePickerPullDownOption('Created On@ID').getAttribute('class')
            )
            .toContain('selected');

        // And the DDIC candidate picker dropdown option "Age" should be unchecked
        await since('The DDIC candidate picker dropdown option "Age" should be unchecked')
            .expect(selectTargetInLayersPanel.getDDICcandidatePickerPullDownOption('Age').getAttribute('class'))
            .not.toContain('selected');

        // And the DDIC candidate picker dropdown option "Email@ID" should be unchecked
        await since('The DDIC candidate picker dropdown option "Email@ID" should be unchecked')
            .expect(selectTargetInLayersPanel.getDDICcandidatePickerPullDownOption('Email@ID').getAttribute('class'))
            .not.toContain('selected');

        // When I click on button "OK" in the DDIC candidate picker dropdown
        await selectTargetInLayersPanel.clickDDICdropdownBtn('OK');

        // And I click on apply button
        await selectTargetInLayersPanel.applyButtonForSelectTarget();
        // When I select following elements "(All),ari2016,boyu666,cindy2015" in dropdown selector "Username"
        await inCanvasSelector_Authoring.selectElementsInDropdown('Username', '(All),ari2016,boyu666,cindy2015');

        // Then The ag-grid "YesTXN_DDIC" should have 3 rows of data
        await since('The ag-grid "YesTXN_DDIC" should have 3 rows of data, instead we have #{actual}')
            .expect(await agGrid.getAllAgGridObjectCount('YesTXN_DDIC'))
            .toBe(3);

        // And The ag-grid "YesTXN_noDDIC" should have 3 rows of data
        await since('The ag-grid "YesTXN_noDDIC" should have 3 rows of data, instead we have #{actual}')
            .expect(await agGrid.getAllAgGridObjectCount('YesTXN_noDDIC'))
            .toBe(3);

        // When I select "Save As..." from menu bar "File" on Web
        await dossierAuthoringPage.actionOnMenubarWithSubmenu('File', 'Save As...');

        // When I open dossier by its ID "54E761446C4284DA23E3E3A65138FB85" in Presentation mode
        await libraryPage.openDossierById({
            projectId: dossierTXN.dossierTXNProject.id,
            dossierId: '54E761446C4284DA23E3E3A65138FB85',
        });

        // Then Dossier is refreshed in Library consumption mode
        await agGrid.waitForConsumptionModeToRefresh();

        // And The ag-grid "YesTXN_DDIC" should have 3 rows of data
        await since('The ag-grid "YesTXN_DDIC" should have 3 rows of data, instead we have #{actual}')
            .expect(await agGrid.getAllAgGridObjectCount('YesTXN_DDIC'))
            .toBe(3);

        // And The ag-grid "YesTXN_noDDIC" should have 3 rows of data
        await since('The ag-grid "YesTXN_noDDIC" should have 3 rows of data, instead we have #{actual}')
            .expect(await agGrid.getAllAgGridObjectCount('YesTXN_noDDIC'))
            .toBe(3);
        // When I click bulk edit icon and select "E2E_Combine" for ag-grid "YesTXN_DDIC"
        await bulkEdit.enterBulkTxnMode('E2E_Combine', 'YesTXN_DDIC');

        // And I click on bulk transaction grid cell at "1", "1" during bulk "E2E_Combine" for python
        await bulkEdit.clickBulkTxnGridCellByPosition('1', '1', 'E2E_Combine');

        // Then the ag grid cell has dropdown with "39" options in Transaction consumption mode
        await since('The ag grid cell should have 39 options, instead we have #{actual}')
            .expect(agGrid.getPulldownOptionCount())
            .toBe(39);

        // When I click on bulk transaction grid cell at "1", "4" during bulk "E2E_Combine" for python
        await bulkEdit.clickBulkTxnGridCellByPosition('1', '4', 'E2E_Combine');

        // Then the ag grid cell has dropdown with "3" options in Transaction consumption mode
        await since('The ag grid cell should have 3 options, instead we have #{actual}')
            .expect(agGrid.getPulldownOptionCount())
            .toBe(3);

        // And I click "Cancel" for a bulk transaction in ag-grid "YesTXN_DDIC"
        await bulkEdit.clickOnBulkEditSubmitButton('YesTXN_DDIC', 'Cancel');

        // Then The Dossier Editor is displayed
        // When I click on select target as source for selector "Employee"
        await selectTargetInLayersPanel.selectTargetButton('Employee');

        // Then A select source button appears on the Viz "Employee"
        await since('A select source button should appear on the Viz "Employee", instead we have #{actual}')
            .expect(selectTargetInLayersPanel.getSourceButton('Employee'))
            .toBe(true);

        // When I click on container "YesTXN_DDIC" to select it
        await baseContainer.clickContainerByScript('YesTXN_DDIC');
        // Then A target button appears on the viz "YesTXN_DDIC"
        await since('A target button should appear on the viz "YesTXN_DDIC"')
            .expect(selectTargetInLayersPanel.getTargetButton('YesTXN_DDIC').isExisting())
            .toBe(true);

        // When I click on container "YesTXN_noDDIC" to select it
        await baseContainer.clickContainerByScript('YesTXN_noDDIC');

        // Then A target button appears on the viz "YesTXN_noDDIC"
        await since('A target button should appear on the viz "YesTXN_noDDIC"')
            .expect(selectTargetInLayersPanel.getTargetButton('YesTXN_noDDIC').isExisting())
            .toBe(true);

        // And the DDIC candidate picker in Visualization "YesTXN_DDIC" is present
        await since('The DDIC candidate picker in Visualization "YesTXN_DDIC" should be present')
            .expect(selectTargetInLayersPanel.getDDICcandidatePicker('YesTXN_DDIC').isExisting())
            .toBe(true);

        // And the DDIC candidate picker in Visualization "YesTXN_noDDIC" is not present
        await since('The DDIC candidate picker in Visualization "YesTXN_noDDIC" should not be present')
            .expect(selectTargetInLayersPanel.getDDICcandidatePicker('YesTXN_noDDIC').isExisting())
            .toBe(false);

        // When I clik to open the DDIC candidate picker dropdown in Visualization "YesTXN_DDIC"
        await selectTargetInLayersPanel.openDDICdropdown('YesTXN_DDIC');

        // Then the DDIC candidate picker dropdown contains elements "Username@ID, Created On@ID, Age, Email@ID"
        // Assuming a method to get the dropdown elements and check their presence
        await since(
            'The DDIC candidate picker dropdown should contain elements "Username@ID, Created On@ID, Age, Email@ID"'
        )
            .expect(selectTargetInLayersPanel.getDDICcandidatePickerPullDownOption('YesTXN_DDIC'))
            .toEqual(['Username@ID', 'Created On@ID', 'Age', 'Email@ID']);

        // When I click on checkboxes for "Username@ID, Created On@ID" in the DDIC candidate picker dropdown
        await selectTargetInLayersPanel.checkElementUnderDDICdropdown(['Username@ID', 'Created On@ID']);

        // Then the DDIC candidate picker dropdown option "Username@ID" should be checked
        await since('The DDIC candidate picker dropdown option "Username@ID" should be checked')
            .expect(selectTargetInLayersPanel.getDDICcandidatePickerPullDownOption('Username@ID').isSelected())
            .toBe(true);

        // And the DDIC candidate picker dropdown option "Created On@ID" should be checked
        await since('The DDIC candidate picker dropdown option "Created On@ID" should be checked')
            .expect(selectTargetInLayersPanel.getDDICcandidatePickerPullDownOption('Created On@ID').isSelected())
            .toBe(true);
        // And the DDIC candidate picker dropdown option "Age" should be unchecked
        await since('The DDIC candidate picker dropdown option "Age" should be unchecked')
            .expect(await selectTargetInLayersPanel.getDDICcandidatePickerPullDownOption('Age').getAttribute('class'))
            .toContain('unchecked');

        // And the DDIC candidate picker dropdown option "Email@ID" should be unchecked
        await since('The DDIC candidate picker dropdown option "Email@ID" should be unchecked')
            .expect(
                await selectTargetInLayersPanel.getDDICcandidatePickerPullDownOption('Email@ID').getAttribute('class')
            )
            .toContain('unchecked');

        // When I click on button "OK" in the DDIC candidate picker dropdown
        await selectTargetInLayersPanel.clickDDICdropdownBtn('OK');

        // And I click on apply button
        await selectTargetInLayersPanel.applyButtonForSelectTarget();

        // When I select following elements "(All),Bates:Michael,Becker:Kyle" in dropdown selector "Employee"
        await inCanvasSelector_Authoring.selectElementsInDropdown('Employee', '(All),Bates:Michael,Becker:Kyle');

        // Then The ag-grid "YesTXN_DDIC" should have 3 rows of data
        await since('The ag-grid "YesTXN_DDIC" should have 3 rows of data')
            .expect(await agGrid.getAllAgGridObjectCount('YesTXN_DDIC'))
            .toBe(3);

        // And The ag-grid "YesTXN_noDDIC" should have 3 rows of data
        await since('The ag-grid "YesTXN_noDDIC" should have 3 rows of data')
            .expect(await agGrid.getAllAgGridObjectCount('YesTXN_noDDIC'))
            .toBe(3);

        // And the grid cell in ag-grid "YesTXN_DDIC" at "1", "1" has text "boyu666"
        await since('The grid cell in ag-grid "YesTXN_DDIC" at "1", "1" should have text "boyu666"')
            .expect(await agGrid.getGridCellByPosition(1, 1, 'YesTXN_DDIC').getText())
            .toBe('boyu666');

        // When I select "Save As..." from menu bar "File" on Web
        await dossierAuthoringPage.actionOnMenubarWithSubmenu('File', 'Save As...');

        // Then The Dossier Editor is displayed
        // When I open dossier by its ID "7CBF079FDF4F9295C3EF04BF6C6201D8" in Presentation mode
        await libraryPage.openDossierById({
            projectId: dossierTXN.dossierTXNProject.id,
            dossierId: '7CBF079FDF4F9295C3EF04BF6C6201D8',
        });

        // Then Dossier is refreshed in Library consumption mode
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await agGrid.waitForConsumptionModeToRefresh();

        // Then Dossier is refreshed in Library consumption mode
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await agGrid.waitForConsumptionModeToRefresh();

        // And The ag-grid "YesTXN_DDIC" should have 3 rows of data
        await since('The ag-grid "YesTXN_DDIC" should have 3 rows of data, instead we have #{actual}')
            .expect(agGrid.getAllAgGridObjectCount('YesTXN_DDIC'))
            .toBe(3);

        // And The ag-grid "YesTXN_noDDIC" should have 3 rows of data
        await since('The ag-grid "YesTXN_noDDIC" should have 3 rows of data, instead we have #{actual}')
            .expect(agGrid.getAllAgGridObjectCount('YesTXN_noDDIC'))
            .toBe(3);

        // When I click bulk edit icon and select "E2E_Combine" for ag-grid "YesTXN_DDIC"
        await bulkEdit.enterBulkTxnMode('E2E_Combine', 'YesTXN_DDIC');

        // And I click on bulk transaction grid cell at "1", "1" during bulk "E2E_Combine" for python
        await bulkEdit.clickBulkTxnGridCellByPosition(1, 1, 'E2E_Combine');

        // And the ag grid cell has dropdown with "2" options in Transaction consumption mode
        await since('The ag grid cell should have dropdown with "2" options, instead we have #{actual}')
            .expect(await agGrid.getPulldownOptionCount())
            .toBe(2);

        // And I select option "Becker" in drop down list for Inline Data Update on Transaction Consumption
        await agGrid.selectDropdownOption('Becker');

        // Then the grid cell in ag-grid "YesTXN_DDIC" at "1", "1" has text "Becker"
        await since(
            'The grid cell in ag-grid "YesTXN_DDIC" at "1", "1" should have text "Becker", instead we have #{actual}'
        )
            .expect(agGrid.getGridCellByPosition(1, 1, 'YesTXN_DDIC').getText())
            .toBe('Becker');
        // And the transaction dialog in ag-grid "YesTXN_DDIC" should say "1 modification" on the top right
        await since('The transaction dialog in ag-grid "YesTXN_DDIC" should say "1 modification" on the top right')
            .expect(await agGrid.getTransactionDialogText('YesTXN_DDIC'))
            .toBe('1 modification');

        // When I click on bulk transaction grid cell at "1", "4" during bulk "E2E_Combine" for python
        await bulkEdit.clickBulkTxnGridCellByPosition(1, 4, 'E2E_Combine');

        // And the ag grid cell has dropdown with "3" options in Transaction consumption mode
        await since('The ag grid cell should have 3 options in Transaction consumption mode')
            .expect(await agGrid.getPulldownOptionCount())
            .toBe(3);

        // And I select option "1/2/2022 2:28:20 AM" in drop down list for Inline Data Update on Transaction Consumption
        await agGrid.selectDropdownOption('1/2/2022 2:28:20 AM');

        // Then the grid cell in ag-grid "YesTXN_DDIC" at "1", "4" has text "1/2/2022 2:28:20 AM"
        await since('The grid cell in ag-grid "YesTXN_DDIC" at "1", "4" should have text "1/2/2022 2:28:20 AM"')
            .expect(await agGrid.getGridCellTextByPosition('YesTXN_DDIC', 1, 4))
            .toBe('1/2/2022 2:28:20 AM');

        // And the transaction dialog in ag-grid "YesTXN_DDIC" should say "2 modifications" on the top right
        await since('The transaction dialog in ag-grid "YesTXN_DDIC" should say "2 modifications" on the top right')
            .expect(await agGrid.getTransactionDialogText('YesTXN_DDIC'))
            .toBe('2 modifications');

        // When I click "Add Data" for a bulk transaction in ag-grid "YesTXN_DDIC"
        await bulkEdit.clickOnBulkEditSubmitButton('Add Data', 'YesTXN_DDIC');

        // And I input "2024" and hit Enter in the text field of insert data cell for "User Id ID" at row "1" in Transaction Consumption mode
        await insertData.inputInsertTextBoxWithEnter('2024', await insertData.getInsertTextBox('User Id ID', 1));

        // And I click on the dropdown field of insert data cell for "Username ID" at row "1" in Transaction Consumption mode
        await insertData.getInsertDropdownOverlay(await insertData.getInsertDropdown('Username ID', 1));

        // Then the dropdown list has "2" search results
        await since('The dropdown list should have 2 search results')
            .expect(await insertData.getAllInsertDropdownOptions().length)
            .toBe(2);
        // When I set dropdown of insert data cell for "Username ID" at row "1" to "Bates" in Transaction Consumption mode
        await insertData.getInsertDropdown(1, 'Username ID');
        await insertData.getInsertDropdownOverlay(dropdown);
        await insertData.chooseInsertDropdownOption('Bates');

        // And I set dropdown of insert data cell for "Password ID" at row "1" to "P1" in Transaction Consumption mode
        await insertData.getInsertDropdown(1, 'Password ID');
        await insertData.getInsertDropdownOverlay(dropdown);
        await insertData.chooseInsertDropdownOption('P1');

        // And I click on the dropdown field of insert data cell for "Email ID" at row "1" in Transaction Consumption mode
        await insertData.getInsertDropdown(1, 'Email ID');
        await insertData.getInsertDropdownOverlay(dropdown);

        // And I input "yiwen" in the dropdown text field of insert data cell for "Email ID" at row "1" in Transaction Consumption mode
        await insertData.getDropdownInsertTextBox(1, 'Email ID');
        await insertData.typeInsertTextBox('yiwen');

        // And I set dropdown of insert data cell for "Email ID" at row "1" to "yiwen@mstr.com" in Transaction Consumption mode
        await insertData.getInsertDropdown(1, 'Email ID');
        await insertData.getInsertDropdownOverlay(dropdown);
        await insertData.chooseInsertDropdownOption('yiwen@mstr.com');

        // And I click on the dropdown field of insert data cell for "Created On ID" at row "1" in Transaction Consumption mode
        await insertData.getInsertDropdown(1, 'Created On ID');
        await insertData.getInsertDropdownOverlay(dropdown);

        // Then the dropdown list has "3" search results
        await since('The dropdown list should have 3 search results, instead we have #{actual}')
            .expect(insertData.getAllInsertDropdownOptions().length)
            .toBe(3);

        // And I set dropdown of insert data cell for "Created On ID" at row "1" to "1/2/2022 2:28:20 AM" in Transaction Consumption mode
        await insertData.getInsertDropdown(1, 'Created On ID');
        await insertData.getInsertDropdownOverlay(dropdown);
        await insertData.chooseInsertDropdownOption('1/2/2022 2:28:20 AM');

        // And I input "1/1/2024" and hit Enter in the text field of insert data cell for "Date Type ID" at row "1" in Transaction Consumption mode
        await insertData.getInsertTextBox(1, 'Date Type ID');
        await insertData.inputInsertTextBoxWithEnter('1/1/2024', inputElement);

        // And I input "5000" and hit Enter in the text field of insert data cell for "Salary" at row "1" in Transaction Consumption mode
        await insertData.getInsertTextBox(1, 'Salary');
        await insertData.inputInsertTextBoxWithEnter('5000', inputElement);
        // And I set dropdown of insert data cell for "Age" at row "1" to "36" in Transaction Consumption mode
        await insertData.getInsertDropdown('Age', 1);
        const dropdownOverlay = await insertData.getInsertDropdownOverlay(dropdown);
        await insertData.chooseInsertDropdownOption(dropdownOverlay, '36');

        // And I click the "Add" button on Transaction Consumption mode
        await insertData.clickButton('Add');

        // When I click "E2E_Combine" for a bulk transaction in ag-grid "YesTXN_DDIC"
        await bulkEdit.clickOnBulkEditSubmitButton('YesTXN_DDIC', 'E2E_Combine');

        // Then a confirmation popup shows at the center of the dossier
        await since('A confirmation popup should be displayed at the center of the dossier')
            .expect(agGrid.getConfirmationPopup().isDisplayed())
            .toBe(true);

        // When I click "Continue" on the confirmation popup
        await agGrid.selectConfirmationPopupOption('Continue');

        // Then the transaction confirmation popup is closed
        await since('The transaction confirmation popup should be closed')
            .expect(agGrid.getConfirmationPopup().isDisplayed())
            .toBe(false);

        // And Dossier is refreshed in Library consumption mode
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

        // When I select following elements "(All)" in dropdown selector "Username"
        await inCanvasSelector_Authoring.selectElementsInDropdown('Username', '(All)');

        // Then The ag-grid "YesTXN_DDIC" should have 21 rows of data
        await since('The ag-grid "YesTXN_DDIC" should have 21 rows of data')
            .expect(await agGrid.getAllAgGridObjectCount('YesTXN_DDIC'))
            .toBe(21);

        // And The ag-grid "YesTXN_DDIC" should have 21 rows of data
        await since('The ag-grid "YesTXN_DDIC" should have 21 rows of data')
            .expect(await agGrid.getAllAgGridObjectCount('YesTXN_DDIC'))
            .toBe(21);
        // And the grid cell in ag-grid "YesTXN_DDIC" at "9", "1" has text "Kyle"
        await since(
            'The grid cell in ag-grid "YesTXN_DDIC" at "9", "1" should have text "Kyle", instead we have #{actual}'
        )
            .expect(await agGrid.getGridCellByPosition(9, 1, 'YesTXN_DDIC').getText())
            .toBe('Kyle');

        // And the grid cell in ag-grid "YesTXN_DDIC" at "9", "4" has text "1/2/2022 2:28:20 AM"
        await since(
            'The grid cell in ag-grid "YesTXN_DDIC" at "9", "4" should have text "1/2/2022 2:28:20 AM", instead we have #{actual}'
        )
            .expect(await agGrid.getGridCellByPosition(9, 4, 'YesTXN_DDIC').getText())
            .toBe('1/2/2022 2:28:20 AM');

        // And the grid cell in ag-grid "YesTXN_DDIC" at "16", "0" has text "2024"
        await since(
            'The grid cell in ag-grid "YesTXN_DDIC" at "16", "0" should have text "2024", instead we have #{actual}'
        )
            .expect(await agGrid.getGridCellByPosition(16, 0, 'YesTXN_DDIC').getText())
            .toBe('2024');

        // And the grid cell in ag-grid "YesTXN_DDIC" at "16", "1" has text "Michael"
        await since(
            'The grid cell in ag-grid "YesTXN_DDIC" at "16", "1" should have text "Michael", instead we have #{actual}'
        )
            .expect(await agGrid.getGridCellByPosition(16, 1, 'YesTXN_DDIC').getText())
            .toBe('Michael');

        // And the grid cell in ag-grid "YesTXN_DDIC" at "16", "2" has text "P1"
        await since(
            'The grid cell in ag-grid "YesTXN_DDIC" at "16", "2" should have text "P1", instead we have #{actual}'
        )
            .expect(await agGrid.getGridCellByPosition(16, 2, 'YesTXN_DDIC').getText())
            .toBe('P1');

        // And the grid cell in ag-grid "YesTXN_DDIC" at "16", "3" has text "yiwen@mstr.com"
        await since(
            'The grid cell in ag-grid "YesTXN_DDIC" at "16", "3" should have text "yiwen@mstr.com", instead we have #{actual}'
        )
            .expect(await agGrid.getGridCellByPosition(16, 3, 'YesTXN_DDIC').getText())
            .toBe('yiwen@mstr.com');

        // And the grid cell in ag-grid "YesTXN_DDIC" at "16", "4" has text "1/2/2022 2:28:20 AM"
        await since(
            'The grid cell in ag-grid "YesTXN_DDIC" at "16", "4" should have text "1/2/2022 2:28:20 AM", instead we have #{actual}'
        )
            .expect(await agGrid.getGridCellByPosition(16, 4, 'YesTXN_DDIC').getText())
            .toBe('1/2/2022 2:28:20 AM');

        // And the grid cell in ag-grid "YesTXN_DDIC" at "16", "5" has text "1/1/2024"
        await since(
            'The grid cell in ag-grid "YesTXN_DDIC" at "16", "5" should have text "1/1/2024", instead we have #{actual}'
        )
            .expect(await agGrid.getGridCellByPosition(16, 5, 'YesTXN_DDIC').getText())
            .toBe('1/1/2024');

        // And the grid cell in ag-grid "YesTXN_DDIC" at "16", "6" has text "5000"
        await since(
            'The grid cell in ag-grid "YesTXN_DDIC" at "16", "6" should have text "5000", instead we have #{actual}'
        )
            .expect(await agGrid.getGridCellByPosition(16, 6, 'YesTXN_DDIC').getText())
            .toBe('5000');

        // And the grid cell in ag-grid "YesTXN_DDIC" at "16", "7" has text "36"
        await since(
            'The grid cell in ag-grid "YesTXN_DDIC" at "16", "7" should have text "36", instead we have #{actual}'
        )
            .expect(await agGrid.getGridCellByPosition(16, 7, 'YesTXN_DDIC').getText())
            .toBe('36');
        // When I select following elements "Bates:Michael,Becker:Kyle,Brown:Vernon,Conner:Beatrice,Corcoran:Peter" in dropdown selector "Employee"
        await inCanvasSelector_Authoring.selectElementsInDropdown(
            'Employee',
            'Bates:Michael,Becker:Kyle,Brown:Vernon,Conner:Beatrice,Corcoran:Peter'
        );

        // Then The ag-grid "YesTXN_DDIC" should have 21 rows of data
        await since('The ag-grid "YesTXN_DDIC" should have 21 rows of data, instead we have #{actual}')
            .expect(await agGrid.getAllAgGridObjectCount('YesTXN_DDIC'))
            .toBe(21);

        // And The ag-grid "YesTXN_noDDIC" should have 21 rows of data
        await since('The ag-grid "YesTXN_noDDIC" should have 21 rows of data, instead we have #{actual}')
            .expect(await agGrid.getAllAgGridObjectCount('YesTXN_noDDIC'))
            .toBe(21);

        // When I click bulk edit icon and select "E2E_Combine" for ag-grid "YesTXN_DDIC"
        await bulkEdit.enterBulkTxnMode('E2E_Combine', 'YesTXN_DDIC');

        // And I click on bulk transaction grid cell at "1", "1" during bulk "E2E_Combine" for python
        await bulkEdit.clickBulkTxnGridCellByPosition(1, 1, 'E2E_Combine');

        // Then the ag grid cell has dropdown with "3" options in Transaction consumption mode
        await since(
            'the ag grid cell has dropdown with "3" options in Transaction consumption mode, instead we have #{actual}'
        )
            .expect(await agGrid.getPulldownOptionCount())
            .toBe(3);

        // When I click on bulk transaction grid cell at "1", "4" during bulk "E2E_Combine" for python
        await bulkEdit.clickBulkTxnGridCellByPosition(1, 4, 'E2E_Combine');

        // Then the ag grid cell has dropdown with "9" options in Transaction consumption mode
        await since(
            'the ag grid cell has dropdown with "9" options in Transaction consumption mode, instead we have #{actual}'
        )
            .expect(await agGrid.getPulldownOptionCount())
            .toBe(9);

        // And I click "Cancel" for a bulk transaction in ag-grid "YesTXN_DDIC"
        await bulkEdit.clickOnBulkEditSubmitButton('YesTXN_DDIC', 'Cancel');
    });

    it('[TC93353_3] Dossier Transaction in canvas selector/DDIC - Case 3', async () => {
        // When I open dossier by its ID "936DBA062C4FD0A6D2F1B99555C8481E" in Presentation mode without reset
        await libraryPage.openDossierById({
            projectId: dossierTXN.dossierTXNProject.id,
            dossierId: '936DBA062C4FD0A6D2F1B99555C8481E',
        });

        // Then Dossier is refreshed in Library consumption mode
        await since('Library Loading Data pop up should not be displayed')
            .expect(loadingDialog.waitLoadingDataPopUpIsNotDisplayed())
            .toBe(true);

        // When I right click on grid cell at "2", "2" and select the delete option "Delete Row" from ag-grid "RestoreData_ygu_python"
        await agGrid.openContextMenuItemForCellAtPosition(2, 2, 'Delete Row', 'RestoreData_ygu_python');

        // Then a confirmation popup shows at the center of the dossier
        await since('Confirmation popup should be displayed')
            .expect(agGrid.getConfirmationPopup().isDisplayed())
            .toBe(true);

        // When I click "Continue" on the confirmation popup
        await agGrid.selectConfirmationPopupOption('Continue');

        // Then Dossier is refreshed in Library consumption mode
        await since('Library Loading Data pop up should not be displayed')
            .expect(loadingDialog.waitLoadingDataPopUpIsNotDisplayed())
            .toBe(true);

        // When I open dossier by its ID "A56EE8194E0DB29BBE9F6580850A9F4B" in Design mode
        await libraryPage.editDossierByUrl({
            projectId: dossierTXN.dossierTXNProject.id,
            dossierId: 'A56EE8194E0DB29BBE9F6580850A9F4B',
        });

        // Then The Dossier Editor is displayed
        // When I switch to page "YesTXN" in chapter "Python_DDIC" from contents panel
        await tocContentsPanel.clickOnPage('Python_DDIC', 'YesTXN');
        // Then Page "YesTXN" in chapter "Python_DDIC" is the current page
        await since('Page "YesTXN" in chapter "Python_DDIC" should be the current page')
            .expect(await tocContentsPanel.getCurrentPage('YesTXN', 'Python_DDIC').isExisting())
            .toBe(true);

        // When I duplicate page "YesTXN" in "Python_DDIC"
        await tocContentsPanel.contextMenuOnPage('YesTXN', 'Python_DDIC', 'Duplicate Page');

        // Then A new page "YesTXN copy " is inserted in "Python_DDIC"
        await since('A new page "YesTXN copy " should be inserted in "Python_DDIC"')
            .expect(await tocContentsPanel.getPageTitleText('Python_DDIC', 'YesTXN copy').isExisting())
            .toBe(true);

        // When I click on select target as source for selector "Employee Age"
        await selectTargetInLayersPanel.selectTargetButton('Employee Age');

        // Then A select source button appears on the Viz "Employee Age"
        await since('A select source button should appear on the Viz "Employee Age"')
            .expect(await selectTargetInLayersPanel.getSourceButton('Employee Age').isExisting())
            .toBe(true);

        // When I click on container "YesTXN_DDIC" to select it
        await baseContainer.clickContainerByScript('YesTXN_DDIC');

        // Then A target button appears on the viz "YesTXN_DDIC"
        await since('A target button should appear on the viz "YesTXN_DDIC"')
            .expect(await selectTargetInLayersPanel.getTargetButton('YesTXN_DDIC').isExisting())
            .toBe(true);

        // When I click on container "YesTXN_noDDIC" to select it
        await baseContainer.clickContainerByScript('YesTXN_noDDIC');

        // Then A target button appears on the viz "YesTXN_noDDIC"
        await since('A target button should appear on the viz "YesTXN_noDDIC"')
            .expect(await selectTargetInLayersPanel.getTargetButton('YesTXN_noDDIC').isExisting())
            .toBe(true);

        // And the DDIC candidate picker in Visualization "YesTXN_DDIC" is present
        await since('the DDIC candidate picker in Visualization "YesTXN_DDIC" should be present')
            .expect(await selectTargetInLayersPanel.getDDICcandidatePicker('YesTXN_DDIC').isExisting())
            .toBe(true);
        // And the DDIC candidate picker in Visualization "YesTXN_noDDIC" is not present
        await since('The DDIC candidate picker in Visualization "YesTXN_noDDIC" is expected to be not present')
            .expect(await selectTargetInLayersPanel.getDDICcandidatePicker('YesTXN_noDDIC').isDisplayed())
            .toBe(false);

        // When I clik to open the DDIC candidate picker dropdown in Visualization "YesTXN_DDIC"
        await selectTargetInLayersPanel.openDDICdropdown('YesTXN_DDIC');

        // Then the DDIC candidate picker dropdown contains elements "Username@ID, Created On@ID, Age, Email@ID"
        // Assuming a method to get the dropdown elements and verify them
        await since(
            'The DDIC candidate picker dropdown should contain elements "Username@ID, Created On@ID, Age, Email@ID"'
        )
            .expect(await selectTargetInLayersPanel.getDDICdropdownElements())
            .toEqual(['Username@ID', 'Created On@ID', 'Age', 'Email@ID']);

        // When I click on checkboxes for "Age" in the DDIC candidate picker dropdown
        await selectTargetInLayersPanel.checkElementUnderDDICdropdown(['Age']);

        // Then the DDIC candidate picker dropdown option "Username@ID" should be unchecked
        await since('The DDIC candidate picker dropdown option "Username@ID" should be unchecked')
            .expect(
                await selectTargetInLayersPanel
                    .getDDICcandidatePickerPullDownOption('Username@ID')
                    .getAttribute('class')
            )
            .not.toContain('checked');

        // And the DDIC candidate picker dropdown option "Created On@ID" should be unchecked
        await since('The DDIC candidate picker dropdown option "Created On@ID" should be unchecked')
            .expect(
                await selectTargetInLayersPanel
                    .getDDICcandidatePickerPullDownOption('Created On@ID')
                    .getAttribute('class')
            )
            .not.toContain('checked');

        // And the DDIC candidate picker dropdown option "Email@ID" should be unchecked
        await since('The DDIC candidate picker dropdown option "Email@ID" should be unchecked')
            .expect(
                await selectTargetInLayersPanel.getDDICcandidatePickerPullDownOption('Email@ID').getAttribute('class')
            )
            .not.toContain('checked');

        // And the DDIC candidate picker dropdown option "Age" should be checked
        await since('The DDIC candidate picker dropdown option "Age" should be checked')
            .expect(await selectTargetInLayersPanel.getDDICcandidatePickerPullDownOption('Age').getAttribute('class'))
            .toContain('checked');

        // When I click on button "OK" in the DDIC candidate picker dropdown
        await selectTargetInLayersPanel.clickDDICdropdownBtn('OK');

        // And I click on apply button
        await selectTargetInLayersPanel.applyButtonForSelectTarget();
        // When I click on select target as source for selector "Age"
        await selectTargetInLayersPanel.selectTargetButton('Age');

        // Then A select source button appears on the Viz "Age"
        await since('A select source button should appear on the Viz "Age"')
            .expect(await selectTargetInLayersPanel.getSourceButton('Age').isExisting())
            .toBe(true);

        // When I click on container "YesTXN_DDIC" to select it
        await BaseContainer.clickContainerByScript('YesTXN_DDIC');

        // Then A target button appears on the viz "YesTXN_DDIC"
        await since('A target button should appear on the viz "YesTXN_DDIC"')
            .expect(await selectTargetInLayersPanel.getTargetButton('YesTXN_DDIC').isExisting())
            .toBe(true);

        // When I click on container "YesTXN_noDDIC" to select it
        await BaseContainer.clickContainerByScript('YesTXN_noDDIC');

        // Then A target button appears on the viz "YesTXN_noDDIC"
        await since('A target button should appear on the viz "YesTXN_noDDIC"')
            .expect(await selectTargetInLayersPanel.getTargetButton('YesTXN_noDDIC').isExisting())
            .toBe(true);

        // And the DDIC candidate picker in Visualization "YesTXN_DDIC" is not present
        await since('The DDIC candidate picker in Visualization "YesTXN_DDIC" should not be present')
            .expect(await selectTargetInLayersPanel.getDDICcandidatePicker('YesTXN_DDIC').isExisting())
            .toBe(false);

        // And the DDIC candidate picker in Visualization "YesTXN_noDDIC" is not present
        await since('The DDIC candidate picker in Visualization "YesTXN_noDDIC" should not be present')
            .expect(await selectTargetInLayersPanel.getDDICcandidatePicker('YesTXN_noDDIC').isExisting())
            .toBe(false);

        // And I click on cancel button
        await selectTargetInLayersPanel.cancelButtonForSelectTarget();

        // When I select following elements "(All),40,41,42,43,44,45,47,48" in dropdown selector "Employee Age"
        await inCanvasSelector_Authoring.selectElementsInDropdown('Employee Age', '(All),40,41,42,43,44,45,47,48');
        // Then The ag-grid "YesTXN_DDIC" should have 20 rows of data
        await since('The ag-grid "YesTXN_DDIC" should have 20 rows of data')
            .expect(agGrid.getAllAgGridObjectCount('YesTXN_DDIC'))
            .toBe(20);

        // And The ag-grid "YesTXN_DDIC" should have 20 rows of data
        await since('The ag-grid "YesTXN_DDIC" should have 20 rows of data')
            .expect(agGrid.getAllAgGridObjectCount('YesTXN_DDIC'))
            .toBe(20);

        // When I select "Save As..." from menu bar "File" on Web
        await dossierAuthoringPage.actionOnMenubarWithSubmenu('File', 'Save As...');

        // Then The Dossier Editor is displayed
        await since('The Dossier Editor is displayed').expect(dossierAuthoringPage.isDisplayed()).toBe(true);

        // When I open dossier by its ID "CB28A272B5467463DB8571B82A850877" in Presentation mode
        await libraryPage.openDossierById({
            projectId: dossierTXN.dossierTXNProject.id,
            dossierId: 'CB28A272B5467463DB8571B82A850877',
        });

        // And The ag-grid "YesTXN_DDIC" should have 20 rows of data
        await since('The ag-grid "YesTXN_DDIC" should have 20 rows of data')
            .expect(agGrid.getAllAgGridObjectCount('YesTXN_DDIC'))
            .toBe(20);

        // And The ag-grid "YesTXN_noDDIC" should have 20 rows of data
        await since('The ag-grid "YesTXN_noDDIC" should have 20 rows of data')
            .expect(agGrid.getAllAgGridObjectCount('YesTXN_noDDIC'))
            .toBe(20);

        // When I click bulk edit icon and select "E2E_Combine" for ag-grid "YesTXN_DDIC"
        await bulkEdit.enterBulkTxnMode('E2E_Combine', 'YesTXN_DDIC');
        // Then the ag-grid "YesTXN_DDIC" displays in bulk edit mode and "E2E_Combine" toolbar should be "displayed"
        await since(
            'The ag-grid "YesTXN_DDIC" should display in bulk edit mode and "E2E_Combine" toolbar should be displayed'
        )
            .expect(await bulkEdit.getBulkEditSubmitButton('YesTXN_DDIC', 'E2E_Combine').isDisplayed())
            .toBe(true);

        // When I click on bulk transaction grid cell at "1", "7" during bulk "E2E_Combine" for python
        await bulkEdit.clickBulkTxnGridCellByPosition(1, 7, 'E2E_Combine');

        // And the ag grid cell has dropdown with "8" options in Transaction consumption mode
        await since('The ag grid cell should have dropdown with 8 options in Transaction consumption mode')
            .expect(await agGrid.getPulldownOptionCount())
            .toBe(8);

        // And I select option "48" in drop down list for Inline Data Update on Transaction Consumption
        await agGrid.selectDropdownOption('48');

        // Then the grid cell in ag-grid "YesTXN_DDIC" at "1", "7" has text "48"
        await since('The grid cell in ag-grid "YesTXN_DDIC" at "1", "7" should have text "48"')
            .expect(await agGrid.getGridCellByPosition(1, 7, 'YesTXN_DDIC').getText())
            .toBe('48');

        // And the transaction dialog in ag-grid "YesTXN_DDIC" should say "1 modification" on the top right
        await since('The transaction dialog in ag-grid "YesTXN_DDIC" should say "1 modification" on the top right')
            .expect(await agGrid.getTransactionDialogText('YesTXN_DDIC'))
            .toBe('1 modification');

        // When I click "Add Data" for a bulk transaction in ag-grid "YesTXN_DDIC"
        await bulkEdit.clickOnBulkEditSubmitButton('YesTXN_DDIC', 'Add Data');

        // And I input "2024" and hit Enter in the text field of insert data cell for "User Id ID" at row "1" in Transaction Consumption mode
        await insertData.inputInsertTextBoxWithEnter('2024', await insertData.getInsertTextBox('User Id ID', 1));

        // And I set dropdown of insert data cell for "Username ID" at row "1" to "Becker" in Transaction Consumption mode
        await insertData.chooseInsertDropdownOption(
            'Becker',
            await insertData.getInsertDropdownOverlay(await insertData.getInsertDropdown('Username ID', 1))
        );

        // And I set dropdown of insert data cell for "Password ID" at row "1" to "P1" in Transaction Consumption mode
        await insertData.chooseInsertDropdownOption(
            'P1',
            await insertData.getInsertDropdownOverlay(await insertData.getInsertDropdown('Password ID', 1))
        );
        // And I click on the dropdown field of insert data cell for "Email ID" at row "1" in Transaction Consumption mode
        await insertData.getInsertDropdown('Email ID', 1);
        await insertData.getInsertDropdownOverlay(dropdown);

        // And I input "yiwen" in the dropdown text field of insert data cell for "Email ID" at row "1" in Transaction Consumption mode
        await insertData.getDropdownInsertTextBox('Email ID', 1);
        await insertData.typeInsertTextBox('yiwen');

        // And I set dropdown of insert data cell for "Email ID" at row "1" to "yiwen@mstr.com" in Transaction Consumption mode
        await insertData.getInsertDropdown('Email ID', 1);
        await insertData.getInsertDropdownOverlay(dropdown);
        await insertData.chooseInsertDropdownOption('yiwen@mstr.com');

        // And I set dropdown of insert data cell for "Created On ID" at row "1" to "1/6/2022 12:00:00 AM" in Transaction Consumption mode
        await insertData.getInsertDropdown('Created On ID', 1);
        await insertData.getInsertDropdownOverlay(dropdown);
        await insertData.chooseInsertDropdownOption('1/6/2022 12:00:00 AM');

        // And I input "1/1/2024" and hit Enter in the text field of insert data cell for "Date Type ID" at row "1" in Transaction Consumption mode
        await insertData.getInsertTextBox('Date Type ID', 1);
        await insertData.inputInsertTextBoxWithEnter('1/1/2024', inputElement);

        // And I input "5000" and hit Enter in the text field of insert data cell for "Salary" at row "1" in Transaction Consumption mode
        await insertData.getInsertTextBox('Salary', 1);
        await insertData.inputInsertTextBoxWithEnter('5000', inputElement);

        // When I click on the dropdown field of insert data cell for "Age" at row "1" in Transaction Consumption mode
        await insertData.getInsertDropdown('Age', 1);
        await insertData.getInsertDropdownOverlay(dropdown);

        // Then the dropdown list has "8" search results
        await since('The dropdown list should have 8 search results, instead we have #{actual}')
            .expect(insertData.getAllInsertDropdownOptions().length)
            .toBe(8);

        // And I set dropdown of insert data cell for "Age" at row "1" to "40" in Transaction Consumption mode
        await insertData.getInsertDropdown('Age', 1);
        await insertData.getInsertDropdownOverlay(dropdown);
        await insertData.chooseInsertDropdownOption('40');

        // And I click the "Add" button on Transaction Consumption mode
        await insertData.clickButton('Add');
        // When I click "E2E_Combine" for a bulk transaction in ag-grid "YesTXN_DDIC"
        await bulkEdit.clickOnBulkEditSubmitButton('E2E_Combine', 'YesTXN_DDIC');

        // Then a confirmation popup shows at the center of the dossier
        await since('A confirmation popup should be displayed at the center of the dossier')
            .expect(agGrid.getConfirmationPopup().isDisplayed())
            .toBe(true);

        // When I click "Continue" on the confirmation popup
        await agGrid.selectConfirmationPopupOption('Continue');

        // Then the transaction confirmation popup is closed
        await since('The transaction confirmation popup should be closed')
            .expect(agGrid.getConfirmationPopup().isDisplayed())
            .toBe(false);

        // And Dossier is refreshed in Library consumption mode
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await agGrid.waitForConsumptionModeToRefresh();

        // And the grid cell in ag-grid "YesTXN_DDIC" at "1", "7" has text "48"
        await since('The grid cell in ag-grid "YesTXN_DDIC" at "1", "7" should have text "48"')
            .expect(agGrid.getGridCellByPosition(1, 7, 'YesTXN_DDIC').getText())
            .toBe('48');

        // And the grid cell in ag-grid "YesTXN_DDIC" at "16", "0" has text "2024"
        await since('The grid cell in ag-grid "YesTXN_DDIC" at "16", "0" should have text "2024"')
            .expect(agGrid.getGridCellByPosition(16, 0, 'YesTXN_DDIC').getText())
            .toBe('2024');

        // And the grid cell in ag-grid "YesTXN_DDIC" at "16", "1" has text "Kyle"
        await since('The grid cell in ag-grid "YesTXN_DDIC" at "16", "1" should have text "Kyle"')
            .expect(agGrid.getGridCellByPosition(16, 1, 'YesTXN_DDIC').getText())
            .toBe('Kyle');

        // And the grid cell in ag-grid "YesTXN_DDIC" at "16", "2" has text "P1"
        await since('The grid cell in ag-grid "YesTXN_DDIC" at "16", "2" should have text "P1"')
            .expect(agGrid.getGridCellByPosition(16, 2, 'YesTXN_DDIC').getText())
            .toBe('P1');

        // And the grid cell in ag-grid "YesTXN_DDIC" at "16", "3" has text "yiwen@mstr.com"
        await since('The grid cell in ag-grid "YesTXN_DDIC" at "16", "3" should have text "yiwen@mstr.com"')
            .expect(agGrid.getGridCellByPosition(16, 3, 'YesTXN_DDIC').getText())
            .toBe('yiwen@mstr.com');
        // And the grid cell in ag-grid "YesTXN_DDIC" at "16", "4" has text "1/6/2022 12:00:00 AM"
        await since(
            'The grid cell in ag-grid "YesTXN_DDIC" at "16", "4" should have text 1/6/2022 12:00:00 AM, instead we have #{actual}'
        )
            .expect(await agGrid.getGridCellByPosition('16', '4', 'YesTXN_DDIC').getText())
            .toBe('1/6/2022 12:00:00 AM');

        // And the grid cell in ag-grid "YesTXN_DDIC" at "16", "5" has text "1/1/2024"
        await since(
            'The grid cell in ag-grid "YesTXN_DDIC" at "16", "5" should have text "1/1/2024", instead we have #{actual}'
        )
            .expect(await agGrid.getGridCellByPosition('16', '5', 'YesTXN_DDIC').getText())
            .toBe('1/1/2024');

        // And the grid cell in ag-grid "YesTXN_DDIC" at "16", "6" has text "5000"
        await since(
            'The grid cell in ag-grid "YesTXN_DDIC" at "16", "6" should have text "5000", instead we have #{actual}'
        )
            .expect(await agGrid.getGridCellByPosition('16', '6', 'YesTXN_DDIC').getText())
            .toBe('5000');

        // And the grid cell in ag-grid "YesTXN_DDIC" at "16", "7" has text "40"
        await since(
            'The grid cell in ag-grid "YesTXN_DDIC" at "16", "7" should have text "40", instead we have #{actual}'
        )
            .expect(await agGrid.getGridCellByPosition('16', '7', 'YesTXN_DDIC').getText())
            .toBe('40');

        // When I select following elements "45,47,48" in dropdown selector "Employee Age"
        await inCanvasSelector_Authoring.selectElementsInDropdown('Employee Age', '45,47,48');

        // Then The ag-grid "YesTXN_DDIC" should have 21 rows of data
        await since('The ag-grid "YesTXN_DDIC" should have 21 rows of data, instead we have #{actual}')
            .expect(await agGrid.getAllAgGridObjectCount('YesTXN_DDIC'))
            .toBe(21);

        // And The ag-grid "YesTXN_DDIC" should have 21 rows of data
        await since('The ag-grid "YesTXN_DDIC" should have 21 rows of data, instead we have #{actual}')
            .expect(await agGrid.getAllAgGridObjectCount('YesTXN_DDIC'))
            .toBe(21);

        // And the grid cell in ag-grid "YesTXN_DDIC" at "1", "7" has text "48"
        await since(
            'The grid cell in ag-grid "YesTXN_DDIC" at "1", "7" should have text "48", instead we have #{actual}'
        )
            .expect(await agGrid.getGridCellByPosition('1', '7', 'YesTXN_DDIC').getText())
            .toBe('48');

        // When I click bulk edit icon and select "E2E_Combine" for ag-grid "YesTXN_DDIC"
        await bulkEdit.enterBulkTxnMode('E2E_Combine', 'YesTXN_DDIC');

        // And I click on bulk transaction grid cell at "1", "7" during bulk "E2E_Combine" for python
        await bulkEdit.clickBulkTxnGridCellByPosition('1', '7', 'E2E_Combine');
        // And the ag grid cell has dropdown with "5" options in Transaction consumption mode
        await since('The ag grid cell should have 5 options in Transaction consumption mode, instead we have #{actual}')
            .expect(await agGrid.getPulldownOptionCount())
            .toBe(5);

        // And I click "Cancel" for a bulk transaction in ag-grid "YesTXN_DDIC"
        await bulkEdit.clickOnBulkEditSubmitButton('YesTXN_DDIC', 'Cancel');
    });
});
