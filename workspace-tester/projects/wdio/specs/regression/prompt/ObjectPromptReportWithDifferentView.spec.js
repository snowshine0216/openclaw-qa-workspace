import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_prompt') };

describe('Report with Object Prompt - Diff View', () => {
    const promptName1 = 'Category';
    const promptName2 = 'Subcategory';
    const promptName3 = 'Item';
    const promptName4 = 'Objects';

    const RSD = {
        id: '79A70A504532FDA9BB3FB5BF1C430AB3',
        name: 'RSD link to AE prompt report',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const RSD2 = {
        id: 'CE6527DB4FA2F0695FB8D3B2688F6C72',
        name: 'RSD link to object prompt report',
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
    let cart, check, object;

    let { loginPage, promptObject, reportPage, reportSummary, reportGrid, libraryPage, promptEditor, dossierPage } =
        browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);

        cart = promptObject.shoppingCart;
        check = promptObject.checkBox;
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC79923] Validate grid/graph/grid and graph report with AE prompt in library web', async () => {
        // Link to grid report with AE prompt
        await libraryPage.openDossier(RSD.name);
        await dossierPage.waitForDossierLoading();
        await dossierPage.clickTextfieldByTitle('Open report with grid');
        await promptEditor.waitForEditor();
        object = await promptObject.getPromptByName(promptName1);

        await since('The default available cart is supposed to have #{expected} elements, instead we get #{actual}')
            .expect(await cart.getAvailableCartItemCount(object))
            .toBe(4);
        await since('The default selected cart is supposed to have #{expected} elements, instead we get #{actual}')
            .expect(await cart.getSelectedCartItemCount(object))
            .toBe(0);

        // Run report, viz can render with correct data
        await promptEditor.run();
        await promptEditor.run();
        await promptEditor.run();
        await reportPage.waitForReportLoading();
        // await since('Report filter summary panel supposed to be #{expected}, instead we have #{actual}')
        //     .expect(await reportSummary.getSummaryBarText()).toBe(`REPORT FILTERS  |  Prompt [(Elements of Item filtered by Filter Subcategory from Category)]`);
        await since('The footer correctly lists should be #{expected}, instead we have #{actual}')
            .expect(await reportGrid.getReportFooter().getText())
            .toBe('360 Rows, 0 Columns');

        // Re-prompt can work
        await promptEditor.reprompt();
        await cart.clickElmInAvailableList(object, 'Electronics');
        await cart.addSingle(object);
        await promptEditor.run();
        object = await promptObject.getPromptByName(promptName2);
        await cart.clickElmInAvailableList(object, 'Audio Equipment');
        await cart.addSingle(object);
        await promptEditor.run();
        object = await promptObject.getPromptByName(promptName3);
        await cart.clickElmInAvailableList(object, 'Harman Kardon Digital Surround Sound Receiver');
        await cart.addSingle(object);
        await promptEditor.run();
        await reportPage.waitForReportLoading();
        await since('The footer correctly lists should be #{expected} after re-prompt, instead we have #{actual}')
            .expect(await reportGrid.getReportFooter().getText())
            .toBe('1 Rows, 0 Columns');
        // Back to source document
        await dossierPage.goBackFromDossierLink();

        // Link to graph report with AE prompt
        await dossierPage.clickTextfieldByTitle('Open report with graph');
        await promptEditor.waitForEditor();
        object = await promptObject.getPromptByName(promptName1);
        await since('The default available cart is supposed to have #{expected} elements, instead we get #{actual}')
            .expect(await cart.getAvailableCartItemCount(object))
            .toBe(4);
        await since('The default selected cart is supposed to have #{expected} elements, instead we get #{actual}')
            .expect(await cart.getSelectedCartItemCount(object))
            .toBe(0);

        // Run report, viz can render with correct data
        await promptEditor.run();
        await promptEditor.run();
        await promptEditor.run();
        await reportPage.waitForReportLoading();
        // await since('Report filter summary panel supposed to be #{expected}, instead we have #{actual}')
        //     .expect(await reportSummary.getSummaryBarText()).toBe(`REPORT FILTERS  |  Prompt [(Elements of Item filtered by Filter Subcategory from Category)]`);
        await since('The footer correctly lists should be #{expected}, instead we have #{actual}')
            .expect(await reportGrid.getReportFooter().getText())
            .toBe('360 Rows, 1 Columns');

        // Re-prompt can work
        await promptEditor.reprompt();
        await cart.clickElmInAvailableList(object, 'Movies');
        await cart.addSingle(object);
        await promptEditor.run();
        object = await promptObject.getPromptByName(promptName2);
        await cart.clickElmInAvailableList(object, 'Action');
        await cart.addSingle(object);
        await promptEditor.run();
        object = await promptObject.getPromptByName(promptName3);
        await cart.addAll(object);
        await promptEditor.run();
        await reportPage.waitForReportLoading();
        await since('The footer correctly lists should be #{expected}, instead we have #{actual}')
            .expect(await reportGrid.getReportFooter().getText())
            .toBe('15 Rows, 1 Columns');

        // Back to source document
        await dossierPage.goBackFromDossierLink();

        // Link to grid and graph report with AE prompt
        await dossierPage.clickTextfieldByTitle('Open report with grid and graph');
        await promptEditor.waitForEditor();
        object = await promptObject.getPromptByName(promptName1);
        await since('The default available cart is supposed to have #{expected} elements, instead we get #{actual}')
            .expect(await cart.getAvailableCartItemCount(object))
            .toBe(4);
        await since('The default selected cart is supposed to have #{expected} elements, instead we get #{actual}')
            .expect(await cart.getSelectedCartItemCount(object))
            .toBe(0);
        await promptEditor.run();
        await promptEditor.run();
        await promptEditor.run();
        await reportPage.waitForReportLoading();
        // await since('Report filter summary panel supposed to be #{expected}, instead we have #{actual}')
        //     .expect(await reportSummary.getSummaryBarText()).toBe('REPORT FILTERS  |  Prompt [(Elements of Item filtered by Filter Subcategory from Category)]');
        await since('The footer correctly lists should be #{expected}, instead we have #{actual}')
            .expect(await reportGrid.getReportFooter().getText())
            .toBe('360 Rows, 1 Columns');

        // Re-prompt can work
        await promptEditor.reprompt();
        await cart.clickElmInAvailableList(object, 'Music');
        await cart.addSingle(object);
        await promptEditor.run();
        object = await promptObject.getPromptByName(promptName2);
        await cart.clickElmInAvailableList(object, 'Pop');
        await cart.addSingle(object);
        await promptEditor.run();
        object = await promptObject.getPromptByName(promptName3);
        await cart.clickElmInAvailableList(object, 'Home');
        await cart.addSingle(object);
        await cart.clickElmInAvailableList(object, 'Bridge');
        await cart.addSingle(object);
        await promptEditor.run();
        await reportPage.waitForReportLoading();
        await since('The footer correctly lists should be #{expected}, instead we have #{actual}')
            .expect(await reportGrid.getReportFooter().getText())
            .toBe('2 Rows, 1 Columns');
    });

    it('[TC80172] Validate grid/graph/grid and graph report with object prompt in library web', async () => {
        // Link to grid report with object prompt
        await libraryPage.openDossier(RSD2.name);
        await dossierPage.waitForDossierLoading();
        await dossierPage.clickTextfieldByTitle('link to normal object report');
        await promptEditor.waitForEditor();
        object = await promptObject.getPromptByName(promptName4);

        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(promptName4);
        await since('Default prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkListSummary(promptName4))
            .toBe('Country, Top 5 Contributors vs. All, Seasons');

        // Run report, viz can render with correct data
        await promptEditor.run();
        await reportPage.waitForReportLoading();
        await since('Report filter summary panel supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getSummaryBarText())
            .toBe('FILTERS (0) | No filter selections');
        await since('The footer correctly lists should be #{expected}, instead we have #{actual}')
            .expect(await reportGrid.getReportFooter().getText())
            .toBe('131 Rows, 1 Columns');

        // Re-prompt can work
        await promptEditor.reprompt();
        await check.clickCheckboxByName(object, 'Country');
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(promptName4);
        await since('The prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkListSummary(promptName4))
            .toBe('Top 5 Contributors vs. All, Seasons');
        await promptEditor.run();
        await reportPage.waitForReportLoading();
        await since('The footer correctly lists should be #{expected}, instead we have #{actual}')
            .expect(await reportGrid.getReportFooter().getText())
            .toBe('84 Rows, 1 Columns');
        // Back to source document
        await dossierPage.goBackFromDossierLink();

        // Link to graph report with object prompt
        await dossierPage.clickTextfieldByTitle('link to normal object report-graph');
        await promptEditor.waitForEditor();

        // Run report, viz can render with correct data
        await promptEditor.run();
        await reportPage.waitForReportLoading();
        await since('Report filter summary panel supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getSummaryBarText())
            .toBe('FILTERS (0) | No filter selections');
        await since('The footer correctly lists should be #{expected}, instead we have #{actual}')
            .expect(await reportGrid.getReportFooter().getText())
            .toBe('131 Rows, 1 Columns');

        // Re-prompt can work
        await promptEditor.reprompt();
        await check.clickCheckboxByName(object, 'Country');
        await promptEditor.run();

        await reportPage.waitForReportLoading();
        await since('The footer correctly lists should be #{expected}, instead we have #{actual}')
            .expect(await reportGrid.getReportFooter().getText())
            .toBe('84 Rows, 1 Columns');
        // Back to source document
        await dossierPage.goBackFromDossierLink();

        // Link to grid and graph report with object prompt
        await dossierPage.clickTextfieldByTitle('link to normal object report-grid and graph');
        await promptEditor.waitForEditor();

        // Run report, viz can render with correct data
        await promptEditor.run();
        await reportPage.waitForReportLoading();
        await since('Report filter summary panel supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getSummaryBarText())
            .toBe('FILTERS (0) | No filter selections');
        await since('The footer correctly lists should be #{expected}, instead we have #{actual}')
            .expect(await reportGrid.getReportFooter().getText())
            .toBe('131 Rows, 1 Columns');
        // Re-prompt can work
        await promptEditor.reprompt();
        await check.clickCheckboxByName(object, 'Country');
        await promptEditor.run();
        await reportPage.waitForReportLoading();
        await since('The footer correctly lists should be #{expected}, instead we have #{actual}')
            .expect(await reportGrid.getReportFooter().getText())
            .toBe('84 Rows, 1 Columns');
    });

    it('[TC80173] Validate grid/graph/grid and graph report with template object prompt in library web', async () => {
        // Link to grid report with template object prompt
        await libraryPage.openDossier(RSD2.name);
        await dossierPage.waitForDossierLoading();
        await dossierPage.clickTextfieldByTitle('link to template report');
        await promptEditor.waitForEditor();
        object = await promptObject.getPromptByName(promptName4);
        await since('The default available cart is supposed to have #{expected} elements, instead we get #{actual}')
            .expect(await cart.getAvailableCartItemCount(object))
            .toBe(2);
        await since('The default selected cart is supposed to have #{expected} elements, instead we get #{actual}')
            .expect(await cart.getSelectedCartItemCount(object))
            .toBe(1);
        await promptEditor.run();

        // Run report, viz can render with correct data
        await reportPage.waitForBlankReportLoading();
        await since('The footer correctly lists should be #{expected}, instead we have #{actual}')
            .expect(await reportGrid.getReportFooter().getText())
            .toBe('360 Rows, 2 Columns');

        // Re-prompt can work
        await promptEditor.reprompt();
        await promptEditor.waitForEditor();
        await since('The default available cart is supposed to have #{expected} elements, instead we get #{actual}')
            .expect(await cart.getAvailableCartItemCount(object))
            .toBe(2);
        await since('The default selected cart is supposed to have #{expected} elements, instead we get #{actual}')
            .expect(await cart.getSelectedCartItemCount(object))
            .toBe(1);
        await promptEditor.run();
        await reportPage.waitForBlankReportLoading();
        await since('The footer correctly lists should be #{expected}, instead we have #{actual}')
            .expect(await reportGrid.getReportFooter().getText())
            .toBe('360 Rows, 2 Columns');

        // Back to source document
        await dossierPage.goBackFromDossierLink();

        // remove below script until DE250080 fix
        // Link to graph report with template object prompt
        // await dossierPage.clickTextfieldByTitle('link to template report-graph');
        // await dossierPage.waitForDossierLoading();
        // screenshotResult = await takeScreenshotByElement(dossierPage.getDossierView(), 'TC80173_05', 'DataOfGraphReport');
        // await since(screenshotResult.url).expect(screenshotResult.pass).toBe(true);
        // Back to source document
        // await dossierPage.goBackFromDossierLink();

        // Link to grid and graph report with template object prompt
        // await dossierPage.clickTextfieldByTitle('link to template report-grid and graph');
        // await dossierPage.waitForDossierLoading();
        // screenshotResult = await takeScreenshotByElement(dossierPage.getDossierView(), 'TC80173_08', 'DataOfGridandGraphReport');
        // await since(screenshotResult.url).expect(screenshotResult.pass).toBe(true);
    });
});

export const config = specConfiguration;
