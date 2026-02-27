import * as gridConstants from '../../../constants/grid.js';
import setWindowSize from '../../../config/setWindowSize.js';

describe('AG Grid Copy Cells and Rows', () => {
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let {
        loginPage,
        libraryPage,
        agGridVisualization,
        contentsPanel,
        dossierTextField,
        dossierAuthoringPage,
        loadingDialog,
    } = browsers.pageObj1;
    beforeAll(async () => {
        await loginPage.login(gridConstants.gridUser);
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        // Open the dossier
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridCopyCell.project.id,
            dossierId: gridConstants.AGGridCopyCell.id,
        });
        await browser.pause(3000);
    });

    afterEach(async () => {});

    it('[TC71089_1] Copy a single cell and verify the content', async () => {
        await agGridVisualization.openRMCMenuForValue('Sunday', 'Visualization 1');
        await agGridVisualization.selectContextMenuOption('Copy Cell');
        // let textFieldBox = await dossierTextField.getTextFieldbyName('Text1');
        // await dossierTextField.pasteTextFieldbyDoubleClick(textFieldBox);

        await since('Copy Cell - text field content should be #{expected}, while we got #{actual}')
            .expect(await agGridVisualization.getClipboardText())
            .toBe('Sunday');
    });

    it('[TC71089_2] Copy multiple cells in different rows and verify the content', async () => {
        // Select and copy multiple cells in the same row
        let gridCells = 'January, US Airways Inc.';

        await agGridVisualization.clickOnAGGridCells(gridCells, 'Visualization 1');
        await agGridVisualization.openRMCMenuForValue('January', 'Visualization 1');
        await agGridVisualization.selectContextMenuOption('Copy Cells');
        //  const clipboardContent = await browser.execute(() => navigator.clipboard.readText());
        // let textFieldBox = await dossierTextField.getTextFieldbyName('Text1');
        // await dossierTextField.pasteTextFieldbyDoubleClick(textFieldBox);

        // Verify the content of the text field
        await since('Copy Cells - text field content should be #{expected}, while we got #{actual}')
            .expect(await agGridVisualization.getClipboardText())
            .toBe('January\nUS Airways Inc.');
    });

    it('[TC71089_3] Copy multiple cells in different rows and verify the content', async () => {
        // Select and copy multiple cells in different rows
        let gridCells = '2009, Monday, Delta Air Lines Inc.';

        await agGridVisualization.clickOnAGGridCells(gridCells, 'Visualization 1');
        await agGridVisualization.openRMCMenuForValue('2009', 'Visualization 1');
        await agGridVisualization.selectContextMenuOption('Copy Cells');

        // Paste the clipboard content into the text field
        // let textFieldBox = await dossierTextField.getTextFieldbyName('Text1');
        // await dossierTextField.pasteTextFieldbyDoubleClick(textFieldBox);

        // Verify the content of the text field
        await since(
            'Copy multiple cells in different rows, text field content should be #{expected}, while we got #{actual}'
        )
            .expect(await agGridVisualization.getClipboardText())
            .toBe('2009\nDelta Air Lines Inc.\nMonday');
    });

    it('[TC71089_4] Copy Cells - Multiple cells are selected which are in different rows from Metric', async () => {
        // Select and copy multiple cells in different rows
        let gridCells = '835.81, 151, 140, 391.00';
        await agGridVisualization.clickOnAGGridCells(gridCells, 'Visualization 1');

        // Right-click on a specific value and select "Copy Cells"
        await agGridVisualization.openRMCMenuForValue('835.81', 'Visualization 1');
        await agGridVisualization.selectContextMenuOption('Copy Cells');

        // Paste the clipboard content into the text field
        // let textFieldBox = await dossierTextField.getTextFieldbyName('Text1');
        // await dossierTextField.pasteTextFieldbyDoubleClick(textFieldBox);

        // Verify the content of the text field
        let expectedContent = `835.81\n151\n140\n391.00`;
        await since('The text field content should be #{expected}, while we got #{actual}')
            .expect(await agGridVisualization.getClipboardText())
            .toBe(expectedContent);
    });

    ///////////////////////////
    //Copy a single cell with header and verify the content

    it('[TC71089_5] Copy a single cell with header and verify the content', async () => {
        // Right-click on a specific value and select "Copy Cell with Header"
        await agGridVisualization.openRMCMenuForValue('Sunday', 'Visualization 1');
        await agGridVisualization.selectContextMenuOption('Copy Cell with Header');

        // Paste the clipboard content into the text field
        // const textFieldBox = await dossierTextField.getTextFieldbyName('Text1');
        // await dossierTextField.pasteTextFieldbyDoubleClick(textFieldBox);

        // Verify the content of the text field
        const expectedContent = `Day of Week\r\nSunday`;
        const actualText = await agGridVisualization.getClipboardText();
        console.log('Expected:', JSON.stringify(expectedContent));
        console.log('Actual:', JSON.stringify(await agGridVisualization.getClipboardText()));
        await since('The text field content should be #{expected}, while we got #{actual}')
            .expect(actualText)
            .toBe(expectedContent);
    });

    it('[TC71089_6] Copy multiple cells in the same row with headers and verify the content', async () => {
        // Select and copy multiple cells in the same row
        const gridCells = 'January, US Airways Inc.';
        await agGridVisualization.clickOnAGGridCells(gridCells, 'Visualization 1');
        await agGridVisualization.openRMCMenuForValue('January', 'Visualization 1');
        await agGridVisualization.selectContextMenuOption('Copy Cells with Headers');

        // Paste the clipboard content into the text field
        // const textFieldBox = await dossierTextField.getTextFieldbyName('Text1');
        // await dossierTextField.pasteTextFieldbyDoubleClick(textFieldBox);

        // Verify the content of the text field
        const expectedContent = `Month\r\nJanuary\nAirline Name\r\nUS Airways Inc.`;
        console.log('Expected:', JSON.stringify(expectedContent));
        console.log('Actual:', JSON.stringify(await agGridVisualization.getClipboardText()));
        await since('The text field content should be #{expected}, while we got #{actual}')
            .expect(await agGridVisualization.getClipboardText())
            .toBe(expectedContent);
    });

    it('[TC71089_7] Copy multiple cells in different rows with headers and verify the content', async () => {
        // Select and copy multiple cells in different rows
        const gridCells = '2009, Monday, Delta Air Lines Inc.';
        await agGridVisualization.clickOnAGGridCells(gridCells, 'Visualization 1');
        await agGridVisualization.openRMCMenuForValue('2009', 'Visualization 1');
        await agGridVisualization.selectContextMenuOption('Copy Cells with Headers');

        // Paste the clipboard content into the text field
        // const textFieldBox = await dossierTextField.getTextFieldbyName('Text1');
        // await dossierTextField.pasteTextFieldbyDoubleClick(textFieldBox);

        // Verify the content of the text field
        const expectedContent = `Year\r\n2009\nAirline Name\r\nDelta Air Lines Inc.\nDay of Week\r\nMonday`;
        console.log('Expected:', JSON.stringify(expectedContent));
        console.log('Actual:', JSON.stringify(await agGridVisualization.getClipboardText()));
        await since('The text field content should be #{expected}, while we got #{actual}')
            .expect(await agGridVisualization.getClipboardText())
            .toBe(expectedContent);
    });

    it('[TC71089_8] Copy multiple cells in different rows from Metric with headers and verify the content', async () => {
        // Select and copy multiple cells in different rows
        const gridCells = '835.81, 151, 140, 391.00';
        await agGridVisualization.clickOnAGGridCells(gridCells, 'Visualization 1');
        await agGridVisualization.openRMCMenuForValue('835.81', 'Visualization 1');
        await agGridVisualization.selectContextMenuOption('Copy Cells with Headers');

        // Paste the clipboard content into the text field
        // const textFieldBox = await dossierTextField.getTextFieldbyName('Text1');
        // await dossierTextField.pasteTextFieldbyDoubleClick(textFieldBox);

        // Verify the content of the text field
        const expectedContent = `Avg Delay (min)\r\n835.81\nNumber of Flights\r\n151\nOn-Time\r\n140\nAvg Delay (min)\r\n391.00`;
        let actualContent = await agGridVisualization.getClipboardText();
        console.log('Expected:', JSON.stringify(expectedContent));
        console.log('Actual:', JSON.stringify(actualContent));
        await since('The text field content should be #{expected}, while we got #{actual}')
            .expect(await agGridVisualization.getClipboardText())
            .toBe(expectedContent);
    });

    it('[TC71089_9] Copy Rows with single column set - One row is selected', async () => {
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        // wait for text filed to be displayed
        await agGridVisualization.waitForElementVisible(dossierTextField.getTextFieldbyName('Text1'));

        // Select and copy a row with headers
        const gridCell = await agGridVisualization.getGridCell('Comair Inc.', 'Visualization 1');
        await agGridVisualization.click({ elem: gridCell });
        await agGridVisualization.openRMCMenuForValue('Comair Inc.', 'Visualization 1');
        await agGridVisualization.selectContextMenuOption('Copy Rows with Headers');

        // Paste the clipboard content into the text field
        // const textFieldBox = await dossierTextField.getTextFieldbyName('Text1');
        // await dossierTextField.pasteTextFieldbyDoubleClick(textFieldBox);

        // Verify the content of the text field
        const expectedContent = `Year\tMonth\tDay of Week\tAirline Name\tNumber of Flights\tAvg Delay (min)\tOn-Time\r\n2009\tJanuary\tSunday\tComair Inc.\t104\t1,085.53\t46`;

        let actualContent = await agGridVisualization.getClipboardText();
        console.log('Expected:', JSON.stringify(expectedContent));
        console.log('Actual:', JSON.stringify(actualContent));
        await since('The text field content should be #{expected}, while we got #{actual}')
            .expect(actualContent)
            .toBe(expectedContent);
    });

    it('[TC71089_10] Copy Rows with single column set - Multiple rows are selected', async () => {
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        // wait for text filed to be displayed
        await agGridVisualization.waitForElementVisible(dossierTextField.getTextFieldbyName('Text1'));
        // Select and copy multiple rows with headers
        let gridCells = '55, 151, 693.67';
        await agGridVisualization.clickOnAGGridCells(gridCells, 'Visualization 1');
        await agGridVisualization.openRMCMenuForValue('693.67', 'Visualization 1');
        await agGridVisualization.selectContextMenuOption('Copy Rows with Headers');

        // Paste the clipboard content into the text field
        // let textFieldBox = await dossierTextField.getTextFieldbyName('Text1');
        // await dossierTextField.pasteTextFieldbyDoubleClick(textFieldBox);

        // Verify the content of the text field
        let expectedContent = `Year\tMonth\tDay of Week\tAirline Name\tNumber of Flights\tAvg Delay (min)\tOn-Time\r\n2009\tJanuary\tSunday\tAmerican Airlines Inc.\t174\t693.67\t131\r\n2009\tJanuary\tSunday\tAmerican Eagle Airlines Inc.\t121\t835.81\t55\r\n2009\tJanuary\tSunday\tDelta Air Lines Inc.\t151\t457.18\t85`;
        let actualContent = await agGridVisualization.getClipboardText();
        console.log('Expected:', JSON.stringify(expectedContent));
        console.log('Actual:', JSON.stringify(actualContent));
        await since('The text field content should be #{expected}, while we got #{actual}')
            .expect(actualContent)
            .toBe(expectedContent);
    });

    it('[TC71089_11] Copy Rows with multiple column sets - One row is selected', async () => {
        // Switch to the specified page
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 2' });
        // wait for text filed to be displayed
        // await agGridVisualization.waitForElementVisible(dossierTextField.getTextFieldbyName('Text1'));
        await since('Page "Page 2" in chapter "Chapter 1" is the current page')
            .expect(await (await contentsPanel.getPage({ chapterName: 'Chapter 1', pageName: 'Page 2' })).isDisplayed())

        // Select and copy a row with headers
        let gridCells = 'AirTran Airways Corporation';
        await agGridVisualization.clickOnAGGridCells(gridCells, 'Visualization 1');
        await agGridVisualization.openRMCMenuForValue('AirTran Airways Corporation', 'Visualization 1');
        await agGridVisualization.selectContextMenuOption('Copy Rows with Headers');

        // Paste the clipboard content into the text field
        // let textFieldBox = await dossierTextField.getTextFieldbyName('Text1');
        // await dossierTextField.pasteTextFieldbyDoubleClick(textFieldBox);

        // Verify the content of the text field
        let expectedContent = `\t\t\tSunday\tMonday\tTuesday\tWednesday\tThursday\tFriday\tSaturday\t\r\nYear\tMonth\tAirline Name\tOn-Time\tOn-Time\tOn-Time\tOn-Time\tOn-Time\tOn-Time\tOn-Time\tFlights Delayed\r\n2009\tJanuary\tAirTran Airways Corporation\t119\t129\t70\t114\t189\t166\t191\t706`;
        let actualContent = await agGridVisualization.getClipboardText();
        console.log('Expected:', JSON.stringify(expectedContent));
        console.log('Actual:', JSON.stringify(actualContent));
        await since('The text field content should be #{expected}, while we got #{actual}')
            .expect(actualContent)
            .toBe(expectedContent);
    });

    it('[TC71089_12] Copy Rows with multiple column sets - Multiple rows are selected', async () => {
        // Select and copy multiple rows with headers
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 3' });
        // wait for text filed to be displayed
        // await agGridVisualization.waitForElementVisible(dossierTextField.getTextFieldbyName('Text1'));
        let gridCells = '119, 131, 55';
        await agGridVisualization.clickOnAGGridCells(gridCells, 'Visualization 1');
        await agGridVisualization.openRMCMenuForValue('55', 'Visualization 1');
        await agGridVisualization.selectContextMenuOption('Copy Rows with Headers');

        // Paste the clipboard content into the text field
        // let textFieldBox = await dossierTextField.getTextFieldbyName('Text1');
        // await dossierTextField.pasteTextFieldbyDoubleClick(textFieldBox);

        // Verify the content of the text field
        let expectedContent = `Year\tMonth\tDay of Week\tAirline Name\tNumber of Flights\tAvg Delay (min)\tOn-Time\tFlights Delayed Trend by Origin Airport\r\n2009\tJanuary\tSunday\tAirTran Airways Corporation\t227\t677.69\t119\t\r\n2009\tJanuary\tSunday\tAmerican Airlines Inc.\t174\t693.67\t131\t\r\n2009\tJanuary\tSunday\tAmerican Eagle Airlines Inc.\t121\t835.81\t55\t`;
        let actualContent = await agGridVisualization.getClipboardText();
        console.log('Expected:', JSON.stringify(expectedContent));
        console.log('Actual:', JSON.stringify(actualContent));
        await since('The text field content should be #{expected}, while we got #{actual}')
            .expect(actualContent)
            .toBe(expectedContent);
    });

    it('[TC71089_13] Copy Cell - Only one cell is selected', async () => {
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 3' });
        // await agGridVisualization.waitForElementVisible(dossierTextField.getTextFieldbyName('Text1'));
        // Right-click on a specific value and select "Copy Cell"
        await agGridVisualization.openRMCMenuForValue('Sunday', 'Visualization 1');
        await agGridVisualization.selectContextMenuOption('Copy Cell');

        // Paste the clipboard content into the text field
        // const textFieldBox = await dossierTextField.getTextFieldbyName('Text1');
        // await dossierTextField.pasteTextFieldbyDoubleClick(textFieldBox);

        // Verify the content of the text field
        const expectedContent = 'Sunday';
        let actualContent = await agGridVisualization.getClipboardText();
        console.log('Expected:', JSON.stringify(expectedContent));
        console.log('Actual:', JSON.stringify(actualContent));
        await since('The text field content should be #{expected}, while we got #{actual}')
            .expect(await agGridVisualization.getClipboardText())
            .toBe(expectedContent);
    });

    it('[TC71089_14] Copy Cells - Multiple cells are selected in the same row', async () => {
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 3' });
        // await agGridVisualization.waitForElementVisible(dossierTextField.getTextFieldbyName('Text1'));
        const gridCells = 'January, US Airways Inc.';
        await agGridVisualization.clickOnAGGridCells(gridCells, 'Visualization 1');
        await agGridVisualization.openRMCMenuForValue('January', 'Visualization 1');
        await agGridVisualization.selectContextMenuOption('Copy Cells');

        // const textFieldBox = await dossierTextField.getTextFieldbyName('Text1');
        // await dossierTextField.pasteTextFieldbyDoubleClick(textFieldBox);

        const expectedContent = `January\nUS Airways Inc.`;
        let actualContent = await agGridVisualization.getClipboardText();
        console.log('Expected:', JSON.stringify(expectedContent));
        console.log('Actual:', JSON.stringify(actualContent));
        await since('The text field content should be #{expected}, while we got #{actual}')
            .expect(await agGridVisualization.getClipboardText())
            .toBe(expectedContent);
    });

    it('[TC71089_15] Copy Cells - Multiple cells are selected in different rows', async () => {
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 3' });
        // await agGridVisualization.waitForElementVisible(dossierTextField.getTextFieldbyName('Text1'));
        const gridCells = '2009, Monday, Delta Air Lines Inc.';
        await agGridVisualization.clickOnAGGridCells(gridCells, 'Visualization 1');
        await agGridVisualization.openRMCMenuForValue('2009', 'Visualization 1');
        await agGridVisualization.selectContextMenuOption('Copy Cells');

        // const textFieldBox = await dossierTextField.getTextFieldbyName('Text1');
        // await dossierTextField.pasteTextFieldbyDoubleClick(textFieldBox);

        const expectedContent = `2009\nDelta Air Lines Inc.\nMonday`;
        let actualContent = await agGridVisualization.getClipboardText();
        console.log('Expected:', JSON.stringify(expectedContent));
        console.log('Actual:', JSON.stringify(actualContent));
        await since('The text field content should be #{expected}, while we got #{actual}')
            .expect(await agGridVisualization.getClipboardText())
            .toBe(expectedContent);
    });

    it('[TC71089_16] Copy Cells - Multiple cells are selected in different rows from Metric', async () => {
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 3' });
        // await agGridVisualization.waitForElementVisible(dossierTextField.getTextFieldbyName('Text1'));
        const gridCells = '835.81, 151, 140, 391.00';
        await agGridVisualization.clickOnAGGridCells(gridCells, 'Visualization 1');
        await agGridVisualization.openRMCMenuForValue('835.81', 'Visualization 1');
        await agGridVisualization.selectContextMenuOption('Copy Cells');

        // const textFieldBox = await dossierTextField.getTextFieldbyName('Text1');
        // await dossierTextField.pasteTextFieldbyDoubleClick(textFieldBox);

        const expectedContent = `835.81\n151\n140\n391.00`;
        let actualContent = await agGridVisualization.getClipboardText();
        console.log('Expected:', JSON.stringify(expectedContent));
        console.log('Actual:', JSON.stringify(actualContent));
        await since('The text field content should be #{expected}, while we got #{actual}')
            .expect(await agGridVisualization.getClipboardText())
            .toBe(expectedContent);
    });

    it('[TC71089_17] Copy Rows with Headers - Single row is selected', async () => {
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 3' });
        // await agGridVisualization.waitForElementVisible(dossierTextField.getTextFieldbyName('Text1'));
        const gridCell = await agGridVisualization.getGridCell('Comair Inc.', 'Visualization 1');
        await agGridVisualization.click({ elem: gridCell });
        await agGridVisualization.openRMCMenuForValue('Comair Inc.', 'Visualization 1');
        await agGridVisualization.selectContextMenuOption('Copy Rows with Headers');

        // const textFieldBox = await dossierTextField.getTextFieldbyName('Text1');
        // await dossierTextField.pasteTextFieldbyDoubleClick(textFieldBox);

        const expectedContent = `Year\tMonth\tDay of Week\tAirline Name\tNumber of Flights\tAvg Delay (min)\tOn-Time\tFlights Delayed Trend by Origin Airport\r\n2009\tJanuary\tSunday\tComair Inc.\t104\t1,085.53\t46\t`;
        let actualContent = await agGridVisualization.getClipboardText();
        console.log('Expected:', JSON.stringify(expectedContent));
        console.log('Actual:', JSON.stringify(actualContent));
        await since('The text field content should be #{expected}, while we got #{actual}')
            .expect(await agGridVisualization.getClipboardText())
            .toBe(expectedContent);
    });

    it('[TC71089_18] Copy Rows with Headers - Multiple rows are selected', async () => {
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 3' });
        // await agGridVisualization.waitForElementVisible(dossierTextField.getTextFieldbyName('Text1'));
        const gridCells = '55, 151, 693.67';
        await agGridVisualization.clickOnAGGridCells(gridCells, 'Visualization 1');
        await agGridVisualization.openRMCMenuForValue('693.67', 'Visualization 1');
        await agGridVisualization.selectContextMenuOption('Copy Rows with Headers');

        // const textFieldBox = await dossierTextField.getTextFieldbyName('Text1');
        // await dossierTextField.pasteTextFieldbyDoubleClick(textFieldBox);

        const expectedContent = `Year\tMonth\tDay of Week\tAirline Name\tNumber of Flights\tAvg Delay (min)\tOn-Time\tFlights Delayed Trend by Origin Airport\r\n2009\tJanuary\tSunday\tAmerican Airlines Inc.\t174\t693.67\t131\t\r\n2009\tJanuary\tSunday\tAmerican Eagle Airlines Inc.\t121\t835.81\t55\t\r\n2009\tJanuary\tSunday\tDelta Air Lines Inc.\t151\t457.18\t85\t`;
        let actualContent = await agGridVisualization.getClipboardText();
        console.log('Expected:', JSON.stringify(expectedContent));
        console.log('Actual:', JSON.stringify(actualContent));
        await since('The text field content should be #{expected}, while we got #{actual}')
            .expect(await agGridVisualization.getClipboardText())
            .toBe(expectedContent);
    });

    it('[TC71089_19] Copy Rows with Headers - Single row with multiple column sets', async () => {
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 4' });
        // await agGridVisualization.waitForElementVisible(dossierTextField.getTextFieldbyName('Text1'));
        const gridCell = await agGridVisualization.getGridCell('AirTran Airways Corporation', 'Visualization 1');
        await agGridVisualization.click({ elem: gridCell });
        await agGridVisualization.openRMCMenuForValue('AirTran Airways Corporation', 'Visualization 1');
        await agGridVisualization.selectContextMenuOption('Copy Rows with Headers');

        // const textFieldBox = await dossierTextField.getTextFieldbyName('Text1');
        // await dossierTextField.pasteTextFieldbyDoubleClick(textFieldBox);

        const expectedContent = `\t\t\tSunday\tMonday\tTuesday\tWednesday\tThursday\tFriday\tSaturday\t\t\r\nYear\tMonth\tAirline Name\tOn-Time\tOn-Time\tOn-Time\tOn-Time\tOn-Time\tOn-Time\tOn-Time\tFlights Delayed\tFlights Delayed Trend by Origin Airport\r\n2009\tJanuary\tAirTran Airways Corporation\t119\t129\t70\t114\t189\t166\t191\t706\t`;
        let actualContent = await agGridVisualization.getClipboardText();
        console.log('Expected:', JSON.stringify(expectedContent));
        console.log('Actual:', JSON.stringify(actualContent));
        await since('The text field content should be #{expected}, while we got #{actual}')
            .expect(await agGridVisualization.getClipboardText())
            .toBe(expectedContent);
    });

    it('[TC71089_20] Copy Rows with Headers - Multiple rows with multiple column sets', async () => {
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 4' });
        // await agGridVisualization.waitForElementVisible(dossierTextField.getTextFieldbyName('Text1'));
        const gridCells = '109, 57, 129';
        await agGridVisualization.clickOnAGGridCells(gridCells, 'Visualization 1');
        await agGridVisualization.openRMCMenuForValue('129', 'Visualization 1');
        await agGridVisualization.selectContextMenuOption('Copy Rows with Headers');

        // const textFieldBox = await dossierTextField.getTextFieldbyName('Text1');
        // await dossierTextField.pasteTextFieldbyDoubleClick(textFieldBox);

        const expectedContent = `\t\t\tSunday\tMonday\tTuesday\tWednesday\tThursday\tFriday\tSaturday\t\t\r\nYear\tMonth\tAirline Name\tOn-Time\tOn-Time\tOn-Time\tOn-Time\tOn-Time\tOn-Time\tOn-Time\tFlights Delayed\tFlights Delayed Trend by Origin Airport\r\n2009\tJanuary\tAirTran Airways Corporation\t119\t129\t70\t114\t189\t166\t191\t706\t\r\n2009\tJanuary\tAmerican Airlines Inc.\t131\t114\t92\t109\t155\t173\t139\t488\t\r\n2009\tJanuary\tComair Inc.\t46\t57\t37\t41\t62\t72\t58\t443\t`;
        let actualContent = await agGridVisualization.getClipboardText();
        console.log('Expected:', JSON.stringify(expectedContent));
        console.log('Actual:', JSON.stringify(actualContent));
        await since('The text field content should be #{expected}, while we got #{actual}')
            .expect(actualContent)
            .toBe(expectedContent);
    });

    it('[TC71089_21] Copy Cells - via Ctrl C', async () => {
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 3' });
        await browser.pause(2000);
        await agGridVisualization.clickOnAGGridCell('Monday', 'Visualization 1');
        await agGridVisualization.copy();

        await since('Copy Cell - text field content should be #{expected}, while we got #{actual}')
            .expect(await agGridVisualization.getClipboardText())
            .toBe('Monday');

        // await agGridVisualization.waitForElementVisible(dossierTextField.getTextFieldbyName('Text1'));
        const gridCells = '2009, Monday, Delta Air Lines Inc.';
        await agGridVisualization.clickOnAGGridCells(gridCells, 'Visualization 1');
        await agGridVisualization.copy();

        // const textFieldBox = await dossierTextField.getTextFieldbyName('Text1');
        // await dossierTextField.pasteTextFieldbyDoubleClick(textFieldBox);

        const expectedContent = `2009\nMonday\nDelta Air Lines Inc.`;
        let actualContent = await agGridVisualization.getClipboardText();
        console.log('Expected:', JSON.stringify(expectedContent));
        console.log('Actual:', JSON.stringify(actualContent));
        await since('The text field content should be #{expected}, while we got #{actual}')
            .expect(await agGridVisualization.getClipboardText())
            .toBe(expectedContent);
    });
});
