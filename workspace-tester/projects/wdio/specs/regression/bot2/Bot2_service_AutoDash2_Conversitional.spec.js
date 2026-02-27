import setWindowSize from '../../../config/setWindowSize.js';
import { fileURLToPath } from 'url';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import allureReporter from '@wdio/allure-reporter';
import fs from 'fs';
import path from 'path';
import * as bot from '../../../constants/bot2.js';

import { saveElementScreenshotLocal, cleanFileInFolder } from '../../../utils/TakeScreenshot.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const actualImageFolder = path.resolve(__dirname, '../../../autodash/Sanity');

describe('Conversitional chat in Auto Dashboard 2.0', () => {
    let consoleLogs = [];
    let botstream;
    const originalLog = console.log;
    const project = {
        id: '060ED74A48F4992BA084F7BF6C9A652A',
        name: 'Autodash-2.0 Test',
    };
    const AutoDash2_Sanity1 = {
        id: 'BD5CEB9F784F2350E03D0E88EE5F644B',
        name: 'AutoDash2_Retail',
        url: 'app/060ED74A48F4992BA084F7BF6C9A652A/BD5CEB9F784F2350E03D0E88EE5F644B',
        project,
    };

    const AutoDash2_Sanity2 = {
        id: 'BD5CEB9F784F2350E03D0E88EE5F644B',
        name: 'Human Resources Analysis',
        url: 'app/060ED74A48F4992BA084F7BF6C9A652A/49FC7BA4894153DC02913B9A2D5631AD',
        project,
    };

    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let { loginPage, dossierPage, libraryPage, libraryAuthoringPage, autoDashboard, aiDiagProcess, dossierAuthoringPage } = browsers.pageObj1;

    async function saveAutoDash2Result(caseName, element, actualImageFolder) {
        const imagePath = path.resolve(actualImageFolder, caseName);
        await saveElementScreenshotLocal(element, imagePath);
        return imagePath;
    }
    beforeAll(async () => {
        console.log = (...args) => {
            consoleLogs.push(args.join(' '));
            originalLog(...args);
        };
        await setWindowSize(browserWindow);
        if (!(await loginPage.isLoginPageDisplayed())) {
            await browser.url(new URL('auth/ui/loginPage', browser.options.baseUrl).toString(), 100000);
        }
        await loginPage.login(bot.botUser);

        await cleanFileInFolder(actualImageFolder);
        botstream = await browser.mock('**/questions/**/stream');
    });

    beforeEach(async () => {
        await libraryPage.openBotByUrl(AutoDash2_Sanity1.url);
        await libraryAuthoringPage.editDossierFromLibrary();
        await autoDashboard.openAutoDashboard(false);
    });

    afterEach(async () => {
        if (consoleLogs.length > 0) {
            allureReporter.addAttachment('Execution Logs', consoleLogs.join('\n'), 'text/plain');
        }
        consoleLogs = [];
        botstream.clear();
        console.log = originalLog;
        await autoDashboard.closeEditWithoutSaving();
        await dossierPage.goToLibrary();
    });
    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('01_create a grid with the same objects and name it as Cost_Profit_Year_Grid', async () => {
        await autoDashboard.sendPromptInAutoDash2(
            'X7Vw50KfC2KdPzGY: new a bar chart with the cost, profit for in each Year'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showDetailsIfError();
        await autoDashboard.sendPromptInAutoDash2(
            'X7Vw50KfC2KdPzGY: create a grid with the same objects, and name it as Cost_Profit_Year_Grid'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showDetailsIfError();
        const result = await autoDashboard.processAILogFromBotStream(botstream);
        allureReporter.addAttachment('ServiceResponse', JSON.stringify(result, null, 2), 'application/json');
        const vizDoc = await libraryAuthoringPage.getVizDoc();
        const vizImage = await saveAutoDash2Result('01_Cost_Profit_Year_Grid.png', vizDoc, actualImageFolder);
        await aiDiagProcess.validate_data_on_requirement(
            'The content should contain info a grid created with the objects of cost and profit',
            result.text
        );
        await aiDiagProcess.validate_content_in_dashboard_action(result.diagnostics, [
            '96E01FFF584C36EDF283F6B094EDC971', // Cost
            '2F616DA7D94F244283C4BCA29267A1CB', // Profit
            'B61602DD9641CB2267DDC892889587CB', // Year
            'formatGridZone'

        ]);
        const newViz = await $("//div[@class='title-text']/div[@aria-label='Cost_Profit_Year_Grid']");
        void expect(await newViz.isDisplayed()).toBe(true);
    });


    it('02_create a grid with the same objects name it as Category_Profit_Grid', async () => {
        // First question
        await autoDashboard.sendPromptInAutoDash2(
            'X7Vw50KfC2KdPzGY: Add a pie chart showing Profit distribution by Category for the selected stores in a new page'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showDetailsIfError();
        // Second question
        await autoDashboard.sendPromptInAutoDash2(
            'X7Vw50KfC2KdPzGY: using the same object to create a grid in this page, name it as Category_Profit_Grid'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showDetailsIfError();
        const result1 = await autoDashboard.processAILogFromBotStream(botstream);
        allureReporter.addAttachment('ServiceResponse', JSON.stringify(result1, null, 2), 'application/json');
        const vizDoc1 = await libraryAuthoringPage.getVizDoc();
        const vizImage1 = await saveAutoDash2Result('02_1_Category_Profit_Grid.png', vizDoc1, actualImageFolder);
        await aiDiagProcess.validate_data_on_requirement(
            'The content should contain info a grid created with the objects of category and profit',
            result1.text
        );
        await aiDiagProcess.validate_content_in_dashboard_action(result1.diagnostics, [
            '2F616DA7D94F244283C4BCA29267A1CB', // Profit
            'C3D95ACF8D4D67150A3D6AA97090BCF5', // Category
            'formatGridZone'
        ]);
        const newViz1 = await $("//div[@class='title-text']/div[@aria-label='Category_Profit_Grid']");
        void expect(await newViz1.isDisplayed()).toBe(true);
        // Third question
        await autoDashboard.sendPromptInAutoDash2(
            'X7Vw50KfC2KdPzGY: change the newly created grid to the line chart, and name it as Category_Profit_Line'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showDetailsIfError();
        const result2 = await autoDashboard.processAILogFromBotStream(botstream);
        allureReporter.addAttachment('ServiceResponse', JSON.stringify(result2, null, 2), 'application/json');
        await aiDiagProcess.validate_data_on_requirement(
            'The content should contain info a line chart created with the objects of Category and profit',
            result2.text
        );
        await aiDiagProcess.validate_content_in_dashboard_action(result2.diagnostics, [
            '2F616DA7D94F244283C4BCA29267A1CB', // Profit
            'C3D95ACF8D4D67150A3D6AA97090BCF5', // Category
            'Shape value=&quot;Line&quot;'
        ]);
        const newViz = await $("//div[@class='title-text']/div[@aria-label='Category_Profit_Line']");
        void expect(await newViz.isDisplayed()).toBe(true);
        const vizDoc2 = await libraryAuthoringPage.getVizDoc();
        const vizImage2 = await saveAutoDash2Result('02_2_Category_Profit_Line.png', vizDoc2, actualImageFolder);
    });

    it('03_add a line chart with the same object used in the last question', async () => {
        await autoDashboard.sendPromptInAutoDash2(
            'X7Vw50KfC2KdPzGY: Add a KPI visualization showing This Months Revenue by Quarter on the current page.'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showDetailsIfError(); 
        await dossierAuthoringPage.switchPageInAuthoring("Summary");
        await autoDashboard.sendPromptInAutoDash2(
            'X7Vw50KfC2KdPzGY: add a line chart with the same object used in the last question, and name as Revenue_Quarter_Line'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showDetailsIfError();
        const result1 = await autoDashboard.processAILogFromBotStream(botstream);
        allureReporter.addAttachment('ServiceResponse', JSON.stringify(result1, null, 2), 'application/json');
        const vizDoc = await libraryAuthoringPage.getVizDoc();
        const vizImage = await saveAutoDash2Result('03_Revenue_Quarter_Line.png', vizDoc, actualImageFolder);
        await aiDiagProcess.validate_data_on_requirement(
            'The content should contain info a line chart created with the objects of This Months Revenue and Quarter',
            result1.text
        );
        await aiDiagProcess.validate_content_in_dashboard_action(result1.diagnostics, [
            'B48176C1D84D17A261550FB77647EF27', // Quarter
            '6468CE126C494C6524A5FF9BBFDFE760', // This Months Revenue
            'Shape value=&quot;Line&quot;'
        ]);
        const newViz = await $("//div[@class='title-text']/div[@aria-label='Revenue_Quarter_Line']");
        void expect(await newViz.isDisplayed()).toBe(true);
    });

    it('04_update the previous created chart to the bar chart', async () => {
        await autoDashboard.sendPromptInAutoDash2(
            'X7Vw50KfC2KdPzGY: create line chart to show the profit and category'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showDetailsIfError();
        await autoDashboard.sendPromptInAutoDash2(
            'X7Vw50KfC2KdPzGY: update the previous created chart to the bar chart, and name it as Profit_Category_Bar'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showDetailsIfError();
        const result = await autoDashboard.processAILogFromBotStream(botstream);
        allureReporter.addAttachment('ServiceResponse', JSON.stringify(result, null, 2), 'application/json');
        const vizDoc = await libraryAuthoringPage.getVizDoc();
        const vizImage = await saveAutoDash2Result('04_Profit_Category_Bar.png', vizDoc, actualImageFolder);
        await aiDiagProcess.validate_data_on_requirement(
            'The content should contain info that the visualization changed from a line chart to a bar chart',
            result.text
        );
        await aiDiagProcess.validate_content_in_dashboard_action(result.diagnostics, [
            '2F616DA7D94F244283C4BCA29267A1CB', // Profit
            'C3D95ACF8D4D67150A3D6AA97090BCF5', // Category
            'Shape value=&quot;Bar&quot;'
        ]);
        const newViz = await $("//div[@class='title-text']/div[@aria-label='Profit_Category_Bar']");
        void expect(await newViz.isDisplayed()).toBe(true);
    });

    it('05_duplicate the previous created grid', async () => {
        await autoDashboard.sendPromptInAutoDash2(
            'X7Vw50KfC2KdPzGY: Add a grid to compare the Revenue by Store on the current page.'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showDetailsIfError();
        await autoDashboard.sendPromptInAutoDash2(
            'X7Vw50KfC2KdPzGY: duplicate the previous created grid in this page'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showDetailsIfError();
        const result = await autoDashboard.processAILogFromBotStream(botstream);
        allureReporter.addAttachment('ServiceResponse', JSON.stringify(result, null, 2), 'application/json');
        const vizDoc = await libraryAuthoringPage.getVizDoc();
        const vizImage = await saveAutoDash2Result('05_Store_Revenue_Grid.png', vizDoc, actualImageFolder);
        await aiDiagProcess.validate_data_on_requirement(
            'The content should contain info a grid created with the objects of Store, Revenue',
            result.text
        );
        await aiDiagProcess.validate_content_in_dashboard_action(result.diagnostics, [
            'macroCopyUnit'
        ]);
    });

    it('06_delete this newly created chart', async () => {
        await autoDashboard.sendPromptInAutoDash2(
            'X7Vw50KfC2KdPzGY: Add a pie chart showing Profit distribution by Category for the selected stores in a new page'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showDetailsIfError();
        await autoDashboard.sendPromptInAutoDash2(
            'X7Vw50KfC2KdPzGY: delete this newly created chart'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showDetailsIfError();
        const result = await autoDashboard.processAILogFromBotStream(botstream);
        allureReporter.addAttachment('ServiceResponse', JSON.stringify(result, null, 2), 'application/json');
        const vizDoc = await libraryAuthoringPage.getVizDoc();
        const vizImage = await saveAutoDash2Result('06_delete.png', vizDoc, actualImageFolder);
        await aiDiagProcess.validate_data_on_requirement(
            'The content should contain that the chart is deleted',
            result.text
        );
        await aiDiagProcess.validate_content_in_dashboard_action(result.diagnostics, [
            'removeUnit'
        ]);
    });

    it('07_duplicate this bar chart', async () => {
        await autoDashboard.sendPromptInAutoDash2(
            'X7Vw50KfC2KdPzGY: Add a bar chart comparing Revenue by Store on the current page.'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showDetailsIfError();
        await autoDashboard.sendPromptInAutoDash2(
            'X7Vw50KfC2KdPzGY: duplicate this bar chart'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showDetailsIfError();
        const result = await autoDashboard.processAILogFromBotStream(botstream);
        allureReporter.addAttachment('ServiceResponse', JSON.stringify(result, null, 2), 'application/json');
        const vizDoc = await libraryAuthoringPage.getVizDoc();
        const vizImage = await saveAutoDash2Result('07_duplicate.png', vizDoc, actualImageFolder);
        await aiDiagProcess.validate_data_on_requirement(
            'The content should contain duplicate the bar chart comparing Revenue by Store',
            result.text
        );
        await aiDiagProcess.validate_content_in_dashboard_action(result.diagnostics, [
            'macroCopyUnit'
        ]);
    });

    it('08_use the Hires instead of Retention Rate ', async () => {
        await autoDashboard.closeEditWithoutSaving();
        await dossierPage.goToLibrary();
        await libraryPage.openBotByUrl(AutoDash2_Sanity2.url);
        await libraryAuthoringPage.editDossierFromLibrary();
        await autoDashboard.openAutoDashboard(false);
        await autoDashboard.sendPromptInAutoDash2(
            'X7Vw50KfC2KdPzGY: Add a heatmap visualization to display Retention Rate by State.'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showDetailsIfError();
        await autoDashboard.sendPromptInAutoDash2(
            'X7Vw50KfC2KdPzGY: use the Hires instead of Retention Rate'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showDetailsIfError();
        const result = await autoDashboard.processAILogFromBotStream(botstream);
        allureReporter.addAttachment('ServiceResponse', JSON.stringify(result, null, 2), 'application/json');
        const vizDoc = await libraryAuthoringPage.getVizDoc();
        const vizImage = await saveAutoDash2Result('08_update.png', vizDoc, actualImageFolder);
        await aiDiagProcess.validate_data_on_requirement(
            'The content should contain replace the Retention Rate with Hires as the metric',
            result.text
        );
        await aiDiagProcess.validate_content_in_dashboard_action(result.diagnostics, [
            'editNode',
            '69102E70B94803B37BF47EB2D560C5B2' // Hires
        ]);
    });
});
