import { customCredentials } from '../../../constants/index.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_prompt') };

describe('Report with Object Prompt', () => {
    const promptName1 = 'Objects';
    const promptName2 = 'Choose from a list of attributes/hierarchies to define level.';

    const dossier = {
        id: 'BB46B22A47DC83BE3ABCA59BFB8768F2',
        name: 'Source link to different prompt report',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const RSD = {
        id: 'B6C869A54832405E24D9898B038F4B54',
        name: 'Link to Object prompt order',
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
    let cart, object, level;

    let { loginPage, promptObject, reportGrid, libraryPage, promptEditor, dossierPage } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);

        cart = promptObject.shoppingCart;
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC56106] Verify rendering report with object(exclude template) prompt in Library', async () => {
        // Link to report with object(report) prompt
        await libraryPage.openDossier(dossier.name);
        await dossierPage.waitForDossierLoading();
        await dossierPage.clickTextfieldByTitle('Link to report prompt');
        await promptEditor.waitForEditor();
        object = await promptObject.getPromptByName(promptName1);
        await since('The available cart is supposed to have #{expected} elements, instead we get #{actual}')
            .expect(await promptObject.shoppingCart.getAvailableCartItemCount(object))
            .toBe(1);
        await since('The selected cart is supposed to have #{expected} elements, instead we get #{actual}')
            .expect(await promptObject.shoppingCart.getSelectedCartItemCount(object))
            .toBe(1);
        await promptObject.shoppingCart.clickElmInAvailableList(object, 'Year=2015');
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(promptName1);
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary(promptName1))
            .toEqual('Region Contains North');
        // Run report, viz can render with correct data
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The footer correctly lists should be #{expected} report prompt report, instead we have #{actual}')
            .expect(await reportGrid.getReportFooter().getText())
            .toBe('6 Rows, 1 Columns');
        await expect(await reportGrid.getOneRowData(1)).toEqual(['Northeast', '$339,961']);
        // Re-prompt can work
        await promptEditor.reprompt();
        await cart.clickElmInAvailableList(object, 'Year=2015');
        await cart.addSingle(object);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        // Back to source document
        await dossierPage.goBackFromDossierLink();

        // Link to report with object(custom group) prompt
        await dossierPage.clickTextfieldByTitle('Link to customer group prompt');
        await promptEditor.waitForEditor();

        object = await promptObject.getPromptByName(promptName1);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC56106', 'CustomGroupPrompt', {
            tolerance: 0.2,
        });

        await promptObject.checkBox.clickCheckboxByName(object, 'Age Groups');
        // Run report, viz can render with correct data
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since(
            'The footer correctly lists should be #{expected} in customer group prompt report, instead we have #{actual}'
        )
            .expect(await reportGrid.getReportFooter().getText())
            .toBe('5 Rows, 1 Columns');
        await expect(await reportGrid.getOneRowData(1)).toEqual(['< 25', 'USA', '$2,591,647']);

        await dossierPage.goBackFromDossierLink();

        // Link to report with object(consolidation) prompt
        await dossierPage.clickTextfieldByTitle('Link to consolidation prompt');
        await promptEditor.waitForEditor();
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC56106', 'ConsolidationPrompt', {
            tolerance: 0.2,
        });

        // Run report, viz can render with correct data
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since(
            'The footer correctly lists should be #{expected} in consolidation prompt report, instead we have #{actual}'
        )
            .expect(await reportGrid.getReportFooter().getText())
            .toBe('2 Rows, 1 Columns');
        await expect(await reportGrid.getOneRowData(1)).toEqual(['2016 - 2015', 'USA', '$2,831,946']);
        await dossierPage.goBackFromDossierLink();

        // Link to report with object(filter) prompt
        await dossierPage.clickTextfieldByTitle('Link to filter prompt');
        await promptEditor.waitForEditor();
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC56106', 'FilterPrompt', { tolerance: 0.2 });

        // Run report, viz can render with correct data
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since(
            'The footer correctly lists should be #{expected} in filter prompt report, instead we have #{actual}'
        )
            .expect(await reportGrid.getReportFooter().getText())
            .toBe('24 Rows, 1 Columns');
        await expect(await reportGrid.getOneRowData(1)).toEqual(['2014 Q3', '$284,970']);
        await dossierPage.goBackFromDossierLink();

        // Link to report with level prompt
        await dossierPage.clickTextfieldByTitle('Link to level prompt');
        await promptEditor.waitForEditor();
        level = await promptObject.getPromptByName(promptName2);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC56106', 'LevelPrompt', { tolerance: 0.6 });

        await cart.clickElmInAvailableList(level, 'Report Level');
        await cart.addSingle(level);
        // Run report, viz can render with correct data
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since(
            'The footer correctly lists should be #{expected} in Level Prompt report, instead we have #{actual}'
        )
            .expect(await reportGrid.getReportFooter().getText())
            .toBe('15 Rows, 2 Columns');
        await expect(await reportGrid.getOneRowData(1)).toEqual(['Milwaukee', '$637,545', '637,545']);
    });

    it('[TC80235] Verify order for object prompt answer keeps same in grid', async () => {
        await libraryPage.openDossier(RSD.name);
        await dossierPage.waitForDossierLoading();
        await dossierPage.clickTextfieldByTitle('Open object prompt order report');
        await promptEditor.waitForEditor();
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC80235_01', 'ReportPrompt', { tolerance: 0.2 });

        // Run report, viz can render with correct data
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        //await takeScreenshotByElement(dossierPage.getDossierView(), 'TC80235_02', 'CostRevenueProfit');
        await since('Header Should be #{expected}, instead we have #{actual}')
            .expect(await reportGrid.getReportHeaderText())
            .toEqual(['Customer', '', 'Cost', 'Revenue', 'Profit']);

        // Re-prompt and change prompt order
        await promptEditor.reprompt();
        object = await promptObject.getPromptByName(promptName1);
        await cart.removeAll(object);
        await cart.clickElmInAvailableList(object, 'Profit');
        await cart.addSingle(object);
        await cart.clickElmInAvailableList(object, 'Cost');
        await cart.addSingle(object);
        await cart.clickElmInAvailableList(object, 'Revenue');
        await cart.addSingle(object);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC80235_03', 'ChangeOrder', { tolerance: 0.2 });
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        //await takeScreenshotByElement(dossierPage.getDossierView(), 'TC80235_04', 'ProfitCostRevenue');
        await since('Header Should be #{expected}, instead we have #{actual}')
            .expect(await reportGrid.getReportHeaderText())
            .toEqual(['Customer', '', 'Profit', 'Cost', 'Revenue']);

        // Re-prompt and change prompt order
        await promptEditor.reprompt();
        object = await promptObject.getPromptByName(promptName1);
        await cart.removeAll(object);
        await cart.clickElmInAvailableList(object, 'Cost');
        await cart.addSingle(object);
        await cart.clickElmInAvailableList(object, 'Profit');
        await cart.addSingle(object);
        await cart.clickElmInAvailableList(object, 'Revenue');
        await cart.addSingle(object);

        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('Header Should be #{expected}, instead we have #{actual}')
            .expect(await reportGrid.getReportHeaderText())
            .toEqual(['Customer', '', 'Cost', 'Profit', 'Revenue']);
    });
});

export const config = specConfiguration;
