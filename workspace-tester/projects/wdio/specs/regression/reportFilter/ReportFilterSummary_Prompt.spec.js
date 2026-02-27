import { customCredentials } from '../../../constants/index.js';
import resetReportState from '../../../api/reports/resetReportState.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

const specConfiguration = { ...customCredentials('_reportSummary') };

describe('Library Report Filter Summary - Prompt', () => {
    const tutorialProject = {
        id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
        name: 'MicroStrategy Tutorial',
    };
    const allPrompt = {
        id: 'D431A5254AB9DD0FB1BD6994ABF3BB38',
        name: '(Auto) Report with all kinds of prompt',
        project: tutorialProject,
    };
    const valuePrompt = {
        id: '57049F3145C20BBC1C40C08B6293FDAA',
        name: '(Auto) 4 kinds of value prompt',
        project: tutorialProject,
    };
    const PIP = {
        id: '8199C3804D8B6CD25491D5A08DD7CBE2',
        name: '(Auto) PIP 2 to 1',
        project: tutorialProject,
    };

    const { credentials } = specConfiguration;

    let { dossierPage, reportPage, reportGrid, libraryPage, promptEditor, promptObject, reportSummary, loginPage } =
        browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC88124] Report filter summary - All kinds of normal prompt display', async () => {
        await resetReportState({
            credentials: credentials,
            report: allPrompt,
        });
        await libraryPage.openDossier(allPrompt.name);
        await promptEditor.waitForEditor();
        await promptEditor.run();
        await reportPage.waitForReportLoading();
        await since('The footer correctly lists should be #{expected}, instead we have #{actual}')
            .expect(await reportGrid.getReportFooter().getText())
            .toBe('1 Rows, 2 Columns');
        await since(
            'Run with default answer, filter summary panel supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportSummary.getSummaryBarText())
            .toContain(
                `REPORT FILTERS  |  Item (in list 100 Places to Go While Still Young at Heart, Art As Experience, The Painted Word)`
            );
        await reportSummary.viewAll();
        await takeScreenshotByElement(reportSummary.getSummaryPanel(), 'TC88124', 'FilterSummary_default prompt');
        await reportSummary.viewLess();
        await promptEditor.reprompt();

        let object = await promptObject.getPromptByName('Objects');
        await promptObject.shoppingCart.clickElmInAvailableList(object, 'Item');
        await promptObject.shoppingCart.addSingle(object);
        await since('Add Item, count of default answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.shoppingCart.getSelectedCartItemCount(object))
            .toEqual(3);

        let item = await promptObject.getPromptByName('Item');
        await promptObject.checkBox.clickCheckboxByName(item, '100 Places to Go While Still Young at Heart');
        await promptObject.checkBox.clickCheckboxByName(item, 'Art As Experience');
        await promptObject.checkBox.clickCheckboxByName(item, 'The Painted Word');
        await promptObject.checkBox.clickCheckboxByName(item, 'Hirschfeld on Line');
        await promptObject.checkBox.clickCheckboxByName(item, 'Adirondack Style');
        await promptObject.checkBox.clickCheckboxByName(item, 'Architecture : Form, Space, & Order');
        await since('Count of selected answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptObject.checkBox.selectedItemCount(item))
            .toEqual(3);

        await promptObject.selectPromptByIndex({ index: '3', promptName: 'Hierarchies' });
        let hierarchy = await promptObject.getPromptByName('Hierarchies');
        await promptObject.shoppingCart.clickNthSelectedObj(hierarchy, 1);
        await promptObject.shoppingCart.removeSingle(hierarchy);

        const attrQua = await promptObject.getPromptByName('Attribute qualification');
        await promptObject.shoppingCart.clickNthSelectedObj(attrQua, 1);
        await promptObject.shoppingCart.removeSingle(attrQua);

        const metricQua = await promptObject.getPromptByName('Metric qualification');
        await promptObject.selectPromptByIndex({ index: '5', promptName: 'Metric qualification' });
        await promptObject.qualPulldown.openDropDownList(metricQua);
        await promptObject.qualPulldown.selectDropDownItem(metricQua, 'Revenue');
        await promptObject.qualPulldown.openMQConditionList(metricQua);
        await promptObject.qualPulldown.selectMQCondition(metricQua, 'Greater than');
        await promptObject.qualPulldown.clearAndInputLowserValue(metricQua, '400');

        await promptEditor.run();
        await reportPage.waitForReportLoading();
        await since(
            'Run with default answer, filter summary panel supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportSummary.getSummaryBarText())
            .toContain(
                `REPORT FILTERS  |  Item (in list Hirschfeld on Line, Adirondack Style, Architecture : Form, Space, & Order)`
            );
        await reportSummary.viewAll();
        await takeScreenshotByElement(reportSummary.getSummaryPanel(), 'TC88124', 'FilterSummary_change prompt');
    });

    it('[TC88127] Report filter summary -  value prompt display', async () => {
        await resetReportState({
            credentials: credentials,
            report: valuePrompt,
        });
        await libraryPage.openDossier(valuePrompt.name);
        await promptEditor.waitForEditor();
        await promptEditor.run();
        await reportPage.waitForReportLoading();
        await since('The footer correctly lists should be #{expected}, instead we have #{actual}')
            .expect(await reportGrid.getReportFooter().getText())
            .toBe('24 Rows, 3 Columns');

        await reportSummary.viewAll();
        await since(
            'Special chars on summary, Discount % value is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportSummary.getReportFilterRowValue('Discount %'))
            .toBe(`Greater than 23`);
        await since('Special chars on summary, Profit value is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getReportFilterRowValue('Profit'))
            .toBe(`Less than 32`);
        await since('Special chars on summary, Profit2 value is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getReportFilterRowValue('Profit', 2))
            .toBe(`Greater than 10000`);
        await since(
            'Special chars on summary, Category DESC value is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportSummary.getReportFilterRowValue('Category DESC'))
            .toBe(`Does not equal Books`);
        await since('Special chars on summary, Cost value is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getReportFilterRowValue('Cost'))
            .toBe(`Less than 100`);

        await reportSummary.viewLess();
        await promptEditor.reprompt();
        let value = await promptObject.getPromptByName('Big decimal');
        await promptObject.textbox.clearAndInputText(value, '50');
        value = await promptObject.getPromptByName('Number-slider-fixed');
        await promptObject.textbox.clearAndInputText(value, '50');
        value = await promptObject.getPromptByName('Number-stepper-currency');
        await promptObject.textbox.clearAndInputText(value, '50');
        value = await promptObject.getPromptByName('Number-wheel-scientific');
        await promptObject.textbox.clearAndInputText(value, '50');
        await promptEditor.run();
        await reportPage.waitForReportLoading();

        await since('The footer correctly lists should be #{expected}, instead we have #{actual}')
            .expect(await reportGrid.getReportFooter().getText())
            .toBe('21 Rows, 3 Columns');
        await reportSummary.viewAll();
        await since(
            'Special chars on summary, Discount % value is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportSummary.getReportFilterRowValue('Discount %'))
            .toBe(`Greater than 50`);
        await since('Special chars on summary, Profit value is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getReportFilterRowValue('Profit'))
            .toBe(`Less than 50`);
        await since('Special chars on summary, Profit2 value is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getReportFilterRowValue('Profit', 2))
            .toBe(`Greater than 50`);
        await since(
            'Special chars on summary, Category DESC value is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportSummary.getReportFilterRowValue('Category DESC'))
            .toBe(`Does not equal Books`);
        await since('Special chars on summary, Cost value is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reportSummary.getReportFilterRowValue('Cost'))
            .toBe(`Less than 50`);
    });

    it('[TC88128] Report filter summary - prompt in prompt display', async () => {
        await resetReportState({
            credentials: credentials,
            report: PIP,
        });
        await libraryPage.openDossier(PIP.name);
        await promptEditor.waitForEditor();
        let prompt = await promptObject.getPromptByName('Country');
        await promptObject.shoppingCart.clickElmInAvailableList(prompt, 'USA');
        await promptObject.shoppingCart.addSingle(prompt);
        await promptObject.shoppingCart.clickElmInAvailableList(prompt, 'Spain');
        await promptObject.shoppingCart.addSingle(prompt);
        prompt = await promptObject.getPromptByName('Region');
        await promptObject.shoppingCart.clickElmInAvailableList(prompt, 'Canada');
        await promptObject.shoppingCart.addSingle(prompt);
        await promptObject.shoppingCart.clickElmInAvailableList(prompt, 'Central');
        await promptObject.shoppingCart.addSingle(prompt);
        await promptEditor.run();
        prompt = await promptObject.getPromptByName('Call Center');
        await promptObject.shoppingCart.addAll(prompt);
        await since('After "Add All", selected cart is supposed to have #{expected} elements, instead we get #{actual}')
            .expect(await promptObject.shoppingCart.getSelectedCartItemCount(prompt))
            .toBe(2);
        await promptEditor.run();
        await reportPage.waitForReportLoading();
        await since('The footer correctly lists should be #{expected} after reprompt, instead we have #{actual}')
            .expect(await reportGrid.getReportFooter().getText())
            .toBe('2 Rows, 0 Columns');
        await since(
            'Run with default answer, filter summary panel supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportSummary.getSummaryBarText())
            .toContain(`REPORT FILTERS  |  Call Center (in list Milwaukee, Fargo)`);

        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName('Country');
        await promptObject.shoppingCart.clickElmInAvailableList(prompt, 'England');
        await promptObject.shoppingCart.addSingle(prompt);
        prompt = await promptObject.getPromptByName('Region');
        await promptObject.shoppingCart.clickElmInAvailableList(prompt, 'England');
        await promptObject.shoppingCart.addSingle(prompt);
        await promptEditor.run();
        prompt = await promptObject.getPromptByName('Call Center');
        await promptObject.shoppingCart.addAll(prompt);
        await since('After "Add All", selected cart is supposed to have #{expected} elements, instead we get #{actual}')
            .expect(await promptObject.shoppingCart.getSelectedCartItemCount(prompt))
            .toBe(3);
        await promptEditor.run();
        await reportPage.waitForReportLoading();
        await since('The footer correctly lists should be #{expected} after reprompt, instead we have #{actual}')
            .expect(await reportGrid.getReportFooter().getText())
            .toBe('3 Rows, 0 Columns');
        await since(
            'Run with default answer, filter summary panel supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportSummary.getSummaryBarText())
            .toContain(`REPORT FILTERS  |  Call Center (in list Milwaukee, London, Fargo)`);
    });
});
export const config = specConfiguration;
