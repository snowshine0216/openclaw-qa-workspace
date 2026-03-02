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

describe('Sanity workflow for Auto Dashboard 2.0', () => {
    let consoleLogs = [];
    let botstream;
    const originalLog = console.log;
    const project = {
        id: '060ED74A48F4992BA084F7BF6C9A652A',
        name: 'Autodash-2.0 Test',
    };
    const AutoDash2_Sanity = {
        id: '529E077BCC4AD7F2944058AD229BD2BB',
        name: 'AutoDash2_Sanity',
        url: 'app/060ED74A48F4992BA084F7BF6C9A652A/529E077BCC4AD7F2944058AD229BD2BB',
        project,
    };

    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let { loginPage, dossierPage, libraryPage, libraryAuthoringPage, autoDashboard, aiDiagProcess } = browsers.pageObj1;

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
        await libraryPage.openBotByUrl(AutoDash2_Sanity.url);
        await libraryAuthoringPage.editDossierFromLibrary();
        await autoDashboard.openAutoDashboard(false);

        await cleanFileInFolder(actualImageFolder);
        botstream = await browser.mock('**/questions/**/stream');
    });

    beforeEach(async () => {
        // if (!(await loginPage.isLoginPageDisplayed())) {
        //     await browser.url(new URL('auth/ui/loginPage', browser.options.baseUrl).toString(), 100000);
        // }
        // await loginPage.login(autoDash2User);
    });

    afterEach(async () => {
        if (consoleLogs.length > 0) {
            allureReporter.addAttachment('Execution Logs', consoleLogs.join('\n'), 'text/plain');
        }
        consoleLogs = [];
        botstream.clear();
    });
    afterAll(async () => {
        console.log = originalLog;
        await autoDashboard.closeEditWithoutSaving();
        await dossierPage.goToLibrary();
        await logoutFromCurrentBrowser();
    });

    it('00_Add a pie chart to display # of employees by department', async () => {
        await autoDashboard.sendPromptInAutoDash2(
            'X7Vw50KfC2KdPzGY: Add a pie chart to display # of employees by department, name it as Pie1'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showDetailsIfError();
        const vizDoc = await libraryAuthoringPage.getVizDoc();
        const vizImage = await saveAutoDash2Result('00_Viz.png', vizDoc, actualImageFolder);
        allureReporter.addAttachment('VizDoc', fs.readFileSync(vizImage), 'image/png');
        const contentPanel = await libraryAuthoringPage.getContentsPanel();
        const contentPanelImage = await saveAutoDash2Result('00_ContentPanel.png', contentPanel, actualImageFolder);
        allureReporter.addAttachment('ContentPanel', fs.readFileSync(contentPanelImage), 'image/png');
        const ChatOutput = await autoDashboard.getAutoDashboard();
        const ChatOutputImage = await saveAutoDash2Result('00_ChatOutput.png', ChatOutput, actualImageFolder);
        allureReporter.addAttachment('ChatOutput', fs.readFileSync(ChatOutputImage), 'image/png');
        const result = await autoDashboard.processAILogFromBotStream(botstream);
        allureReporter.addAttachment('ServiceResponse', JSON.stringify(result, null, 2), 'application/json');
        await aiDiagProcess.validate_data_on_requirement(
            'The content should contain info a pie chart created',
            result.text
        );
        await aiDiagProcess.validate_content_in_dashboard_action(result.diagnostics, [
            'copyUnit',
            'Shape value=&quot;Pie&quot;',
            'DDBF0B83474CA8D81B919A946DDF9FBF',
            '9F1CCB5DB7440B393994568EBC6F4D3C',
        ]);
        // Verify the new visualization and a field from the visualization
        const newViz = await $("//div[@class='title-text']/div[@aria-label='Pie1']");
        void expect(await newViz.isDisplayed()).toBe(true);
        const vizUnit = await $(
            "//div[@class='mstrmojo-VIPanel-content']//span[@class='txt' and text()='Merit Department']"
        );
        void expect(await vizUnit.isExisting()).toBe(true);
    });
    it('01_Create a bar chart with Commuting Method and # Employees', async () => {
        await autoDashboard.sendPromptInAutoDash2(
            'X7Vw50KfC2KdPzGY: Add a bar chart with Commuting Method and # Employees, name it as Bar1'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showDetailsIfError();
        const vizDoc = await libraryAuthoringPage.getVizDoc();
        const vizImage = await saveAutoDash2Result('01_Viz.png', vizDoc, actualImageFolder);
        allureReporter.addAttachment('VizDoc', fs.readFileSync(vizImage), 'image/png');
        const contentPanel = await libraryAuthoringPage.getContentsPanel();
        const contentPanelImage = await saveAutoDash2Result('01_ContentPanel.png', contentPanel, actualImageFolder);
        allureReporter.addAttachment('ContentPanel', fs.readFileSync(contentPanelImage), 'image/png');
        const ChatOutput = await autoDashboard.getAutoDashboard();
        const ChatOutputImage = await saveAutoDash2Result('01_ChatOutput.png', ChatOutput, actualImageFolder);
        allureReporter.addAttachment('ChatOutput', fs.readFileSync(ChatOutputImage), 'image/png');
        const result = await autoDashboard.processAILogFromBotStream(botstream);
        allureReporter.addAttachment('ServiceResponse', JSON.stringify(result, null, 2), 'application/json');
        await aiDiagProcess.validate_content_in_dashboard_action(result.diagnostics, [
            'copyUnit',
            'Shape value=&quot;Bar&quot;',
            'B10C6C1D3943149311B5C0AF938D5732',
            'DDBF0B83474CA8D81B919A946DDF9FBF',
        ]);
        await aiDiagProcess.validate_data_on_requirement(
            'The content should contain dashboard changes, Added a bar chart** displaying **Commuting Method** and **# Employees** ',
            result.text
        );
        const newViz = await $("//div[@class='title-text']/div[@aria-label='Bar1']");
        void expect(await newViz.isDisplayed()).toBe(true);
    });
    it('02_Add a filter on City (drop down) which targets all the visualizations on this page', async () => {
        await autoDashboard.sendPromptInAutoDash2(
            'X7Vw50KfC2KdPzGY: Add a filter on City (drop down) which targets all the visualizations on this page'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showDetailsIfError();
        const vizDoc = await libraryAuthoringPage.getVizDoc();
        const vizImage = await saveAutoDash2Result('02_Viz.png', vizDoc, actualImageFolder);
        allureReporter.addAttachment('VizDoc', fs.readFileSync(vizImage), 'image/png');
        const contentPanel = await libraryAuthoringPage.getContentsPanel();
        const contentPanelImage = await saveAutoDash2Result('02_ContentPanel.png', contentPanel, actualImageFolder);
        allureReporter.addAttachment('ContentPanel', fs.readFileSync(contentPanelImage), 'image/png');
        const ChatOutput = await autoDashboard.getAutoDashboard();
        const ChatOutputImage = await saveAutoDash2Result('02_ChatOutput.png', ChatOutput, actualImageFolder);
        allureReporter.addAttachment('ChatOutput', fs.readFileSync(ChatOutputImage), 'image/png');
        const result = await autoDashboard.processAILogFromBotStream(botstream);
        allureReporter.addAttachment('ServiceResponse', JSON.stringify(result, null, 2), 'application/json');
        await aiDiagProcess.validate_content_in_dashboard_action(result.diagnostics, [
            'addControl',
            'FormattingSelector',
            '\"Style\": 0',
            '085786E06B4CF6548C25E08CC4569AF6',
        ]);
        await aiDiagProcess.validate_data_on_requirement(
            'The content should contain filter added info, The filter targets all visualizations on the page',
            result.text
        );
    });
    it('03_Change the filter on City to search box style', async () => {
        await autoDashboard.sendPromptInAutoDash2('X7Vw50KfC2KdPzGY: Change the filter on City to search box style');
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showDetailsIfError();
        const vizDoc = await libraryAuthoringPage.getVizDoc();
        const vizImage = await saveAutoDash2Result('03_Viz.png', vizDoc, actualImageFolder);
        allureReporter.addAttachment('VizDoc', fs.readFileSync(vizImage), 'image/png');
        const contentPanel = await libraryAuthoringPage.getContentsPanel();
        const contentPanelImage = await saveAutoDash2Result('03_ContentPanel.png', contentPanel, actualImageFolder);
        allureReporter.addAttachment('ContentPanel', fs.readFileSync(contentPanelImage), 'image/png');
        const ChatOutput = await autoDashboard.getAutoDashboard();
        const ChatOutputImage = await saveAutoDash2Result('03_ChatOutput.png', ChatOutput, actualImageFolder);
        allureReporter.addAttachment('ChatOutput', fs.readFileSync(ChatOutputImage), 'image/png');
        const result = await autoDashboard.processAILogFromBotStream(botstream);
        allureReporter.addAttachment('ServiceResponse', JSON.stringify(result, null, 2), 'application/json');
        await aiDiagProcess.validate_content_in_dashboard_action(result.diagnostics, [
            'format',
            'FormattingSelector',
            '\"Style\": 9',
        ]);
        await aiDiagProcess.validate_data_on_requirement(
            'The content should contain info that filter changed to search box style',
            result.text
        );
    });

    it('04_Change the background of the Bar1 to light orange', async () => {
        await autoDashboard.sendPromptInAutoDash2(
            'X7Vw50KfC2KdPzGY: Change the background of the Bar1 to light orange'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showDetailsIfError();
        const vizDoc = await libraryAuthoringPage.getVizDoc();
        const vizImage = await saveAutoDash2Result('04_Viz.png', vizDoc, actualImageFolder);
        allureReporter.addAttachment('VizDoc', fs.readFileSync(vizImage), 'image/png');
        const contentPanel = await libraryAuthoringPage.getContentsPanel();
        const contentPanelImage = await saveAutoDash2Result('04_ContentPanel.png', contentPanel, actualImageFolder);
        allureReporter.addAttachment('ContentPanel', fs.readFileSync(contentPanelImage), 'image/png');
        const ChatOutput = await autoDashboard.getAutoDashboard();
        const ChatOutputImage = await saveAutoDash2Result('04_ChatOutput.png', ChatOutput, actualImageFolder);
        allureReporter.addAttachment('ChatOutput', fs.readFileSync(ChatOutputImage), 'image/png');
        const result = await autoDashboard.processAILogFromBotStream(botstream);
        allureReporter.addAttachment('ServiceResponse', JSON.stringify(result, null, 2), 'application/json');
        await aiDiagProcess.validate_content_in_dashboard_action(result.diagnostics, ['format', 'FillColor']);
        await aiDiagProcess.validate_data_on_requirement(
            'the background of the Bar1 updated/changed to light orange ',
            result.text
        );
    });

    it('05_Change the background color of the current page to light blue', async () => {
        await autoDashboard.sendPromptInAutoDash2(
            'X7Vw50KfC2KdPzGY: Change the background color of the current page to light blue'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showDetailsIfError();
        const vizDoc = await libraryAuthoringPage.getVizDoc();
        const vizImage = await saveAutoDash2Result('05_Viz.png', vizDoc, actualImageFolder);
        allureReporter.addAttachment('VizDoc', fs.readFileSync(vizImage), 'image/png');
        const contentPanel = await libraryAuthoringPage.getContentsPanel();
        const contentPanelImage = await saveAutoDash2Result('05_ContentPanel.png', contentPanel, actualImageFolder);
        allureReporter.addAttachment('ContentPanel', fs.readFileSync(contentPanelImage), 'image/png');
        const ChatOutput = await autoDashboard.getAutoDashboard();
        const ChatOutputImage = await saveAutoDash2Result('05_ChatOutput.png', ChatOutput, actualImageFolder);
        allureReporter.addAttachment('ChatOutput', fs.readFileSync(ChatOutputImage), 'image/png');
        const result = await autoDashboard.processAILogFromBotStream(botstream);
        allureReporter.addAttachment('ServiceResponse', JSON.stringify(result, null, 2), 'application/json');
        await aiDiagProcess.validate_content_in_dashboard_action(result.diagnostics, ['format', 'FillColor']);
        await aiDiagProcess.validate_data_on_requirement(
            'The content should contain info that background color of page is changed',
            result.text
        );
    });

    it('06_Create a new page that is able to help analyze the # of Employees from various angles.  Use fun colors for the display', async () => {
        await autoDashboard.sendPromptInAutoDash2(
            'X7Vw50KfC2KdPzGY: Create a new page that is able to help analyze the # of Employees from various angles.  Use fun colors for the display'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showDetailsIfError();
        const vizDoc = await libraryAuthoringPage.getVizDoc();
        const vizImage = await saveAutoDash2Result('06_Viz.png', vizDoc, actualImageFolder);
        allureReporter.addAttachment('VizDoc', fs.readFileSync(vizImage), 'image/png');
        const contentPanel = await libraryAuthoringPage.getContentsPanel();
        const contentPanelImage = await saveAutoDash2Result('06_ContentPanel.png', contentPanel, actualImageFolder);
        allureReporter.addAttachment('ContentPanel', fs.readFileSync(contentPanelImage), 'image/png');
        const ChatOutput = await autoDashboard.getAutoDashboard();
        const ChatOutputImage = await saveAutoDash2Result('06_ChatOutput.png', ChatOutput, actualImageFolder);
        allureReporter.addAttachment('ChatOutput', fs.readFileSync(ChatOutputImage), 'image/png');
        const result = await autoDashboard.processAILogFromBotStream(botstream);
        allureReporter.addAttachment('ServiceResponse', JSON.stringify(result, null, 2), 'application/json');
        await aiDiagProcess.validate_content_in_dashboard_action(result.diagnostics, ['addPanel', 'setCurrentPanel']);
        await aiDiagProcess.validate_data_on_requirement(
            'The content should contain Dashboard changes, a new page is added to analyze the # of Employees from various angles',
            result.text
        );
    });
    it('06_a_use Strategy theme', async () => {
        await autoDashboard.sendPromptInAutoDash2('X7Vw50KfC2KdPzGY: use Strategy theme');
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showDetailsIfError();
        const vizDoc = await libraryAuthoringPage.getVizDoc();
        const vizImage = await saveAutoDash2Result('12_Viz.png', vizDoc, actualImageFolder);
        allureReporter.addAttachment('VizDoc', fs.readFileSync(vizImage), 'image/png');
        const contentPanel = await libraryAuthoringPage.getContentsPanel();
        const contentPanelImage = await saveAutoDash2Result('12_ContentPanel.png', contentPanel, actualImageFolder);
        allureReporter.addAttachment('ContentPanel', fs.readFileSync(contentPanelImage), 'image/png');
        const ChatOutput = await autoDashboard.getAutoDashboard();
        const ChatOutputImage = await saveAutoDash2Result('12_ChatOutput.png', ChatOutput, actualImageFolder);
        allureReporter.addAttachment('ChatOutput', fs.readFileSync(ChatOutputImage), 'image/png');
        const result = await autoDashboard.processAILogFromBotStream(botstream);
        allureReporter.addAttachment('ServiceResponse', JSON.stringify(result, null, 2), 'application/json');
        await aiDiagProcess.validate_content_in_dashboard_action(result.diagnostics, [
            'setPreferredTheme',
            'DCD950B94296EECF9C4470B2EFBDE8DD',
        ]);
        await aiDiagProcess.validate_data_on_requirement(
            'The content should contain Applied Strategy theme',
            result.text
        );
    });
    it('07_Rename Current Page to NewPage1', async () => {
        await autoDashboard.sendPromptInAutoDash2('X7Vw50KfC2KdPzGY: Rename Current Page to NewPage1');
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showDetailsIfError();
        const contentPanel = await libraryAuthoringPage.getContentsPanel();
        const contentPanelImage = await saveAutoDash2Result('07_ContentPanel.png', contentPanel, actualImageFolder);
        allureReporter.addAttachment('ContentPanel', fs.readFileSync(contentPanelImage), 'image/png');
        const ChatOutput = await autoDashboard.getAutoDashboard();
        const ChatOutputImage = await saveAutoDash2Result('07_ChatOutput.png', ChatOutput, actualImageFolder);
        allureReporter.addAttachment('ChatOutput', fs.readFileSync(ChatOutputImage), 'image/png');
        const result = await autoDashboard.processAILogFromBotStream(botstream);
        allureReporter.addAttachment('ServiceResponse', JSON.stringify(result, null, 2), 'application/json');
        await aiDiagProcess.validate_content_in_dashboard_action(result.diagnostics, ['format', 'Title', 'NewPage1']);
        await aiDiagProcess.validate_data_on_requirement(
            'The content should info that page is renamed to NewPage1',
            result.text
        );
        const NewPage1 = await $("//span[contains(@class, 'macro-current-page-name') and @title='NewPage1']");
        void expect(await NewPage1.isDisplayed()).toBe(true);
    });

    it('08_Create a new chapter with dataset furniture to analyze the sales performance', async () => {
        await autoDashboard.sendPromptInAutoDash2(
            'X7Vw50KfC2KdPzGY: Create a new chapter with dataset furniture to analyze the sales performance'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showDetailsIfError();
        const vizDoc = await libraryAuthoringPage.getVizDoc();
        const vizImage = await saveAutoDash2Result('08_Viz.png', vizDoc, actualImageFolder);
        allureReporter.addAttachment('VizDoc', fs.readFileSync(vizImage), 'image/png');
        const contentPanel = await libraryAuthoringPage.getContentsPanel();
        const contentPanelImage = await saveAutoDash2Result('08_ContentPanel.png', contentPanel, actualImageFolder);
        allureReporter.addAttachment('ContentPanel', fs.readFileSync(contentPanelImage), 'image/png');
        const ChatOutput = await autoDashboard.getAutoDashboard();
        const ChatOutputImage = await saveAutoDash2Result('08_ChatOutput.png', ChatOutput, actualImageFolder);
        allureReporter.addAttachment('ChatOutput', fs.readFileSync(ChatOutputImage), 'image/png');
        const result = await autoDashboard.processAILogFromBotStream(botstream);
        allureReporter.addAttachment('ServiceResponse', JSON.stringify(result, null, 2), 'application/json');
        await aiDiagProcess.validate_content_in_dashboard_action(result.diagnostics, ['addLayout']);
        await aiDiagProcess.validate_data_on_requirement(
            'The content should contain Dashboard changes,  a new chapter is created to analyze sales performance using the **furniture dataset**, focusing on relevant metrics and trends',
            result.text
        );
    });

    it('09_Create a page showing a map visualisation of employee distribution by City using # of Employees, Name it as PageMap', async () => {
        await autoDashboard.sendPromptInAutoDash2(
            'X7Vw50KfC2KdPzGY: Create a page showing a map visualisation of employee distribution by City using # of Employees, Name it as PageMap'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showDetailsIfError();
        const vizDoc = await libraryAuthoringPage.getVizDoc();
        const vizImage = await saveAutoDash2Result('09_Viz.png', vizDoc, actualImageFolder);
        allureReporter.addAttachment('VizDoc', fs.readFileSync(vizImage), 'image/png');
        const contentPanel = await libraryAuthoringPage.getContentsPanel();
        const contentPanelImage = await saveAutoDash2Result('09_ContentPanel.png', contentPanel, actualImageFolder);
        allureReporter.addAttachment('ContentPanel', fs.readFileSync(contentPanelImage), 'image/png');
        const ChatOutput = await autoDashboard.getAutoDashboard();
        const ChatOutputImage = await saveAutoDash2Result('09_ChatOutput.png', ChatOutput, actualImageFolder);
        allureReporter.addAttachment('ChatOutput', fs.readFileSync(ChatOutputImage), 'image/png');
        const result = await autoDashboard.processAILogFromBotStream(botstream);
        allureReporter.addAttachment('ServiceResponse', JSON.stringify(result, null, 2), 'application/json');
        await aiDiagProcess.validate_content_in_dashboard_action(result.diagnostics, ['addPanel']);
        await aiDiagProcess.validate_data_on_requirement(
            'The content should contain Dashboard changes, a new page is created to display the distribution of employee by city',
            result.text
        );
        const PageMap = await $("//span[contains(@class, 'txt undefined') and text()='PageMap']");
        void expect(await PageMap.isDisplayed()).toBe(true);
    });
    it('10_Rename Current Chapter to NewChapter', async () => {
        await autoDashboard.sendPromptInAutoDash2('X7Vw50KfC2KdPzGY: Rename Current Chapter to NewChapter');
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showDetailsIfError();
        const contentPanel = await libraryAuthoringPage.getContentsPanel();
        const contentPanelImage = await saveAutoDash2Result('10_ContentPanel.png', contentPanel, actualImageFolder);
        allureReporter.addAttachment('ContentPanel', fs.readFileSync(contentPanelImage), 'image/png');
        const ChatOutput = await autoDashboard.getAutoDashboard();
        const ChatOutputImage = await saveAutoDash2Result('10_ChatOutput.png', ChatOutput, actualImageFolder);
        allureReporter.addAttachment('ChatOutput', fs.readFileSync(ChatOutputImage), 'image/png');
        const result = await autoDashboard.processAILogFromBotStream(botstream);
        allureReporter.addAttachment('ServiceResponse', JSON.stringify(result, null, 2), 'application/json');
        await aiDiagProcess.validate_data_on_requirement(
            'The content should info that chapter is renamed to NewChapter',
            result.text
        );
        const NewChapter = await $("//div[contains(@class, 'mstrmojo-VITitleBar') and @aria-label='NewChapter']");
        void expect(await NewChapter.isDisplayed()).toBe(true);
    });
    it('11_Delete current chapter', async () => {
        await autoDashboard.sendPromptInAutoDash2('X7Vw50KfC2KdPzGY: Delete Current Chapter');
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showDetailsIfError();
        const contentPanel = await libraryAuthoringPage.getContentsPanel();
        const contentPanelImage = await saveAutoDash2Result('11_ContentPanel.png', contentPanel, actualImageFolder);
        allureReporter.addAttachment('ContentPanel', fs.readFileSync(contentPanelImage), 'image/png');
        const ChatOutput = await autoDashboard.getAutoDashboard();
        const ChatOutputImage = await saveAutoDash2Result('11_ChatOutput.png', ChatOutput, actualImageFolder);
        allureReporter.addAttachment('ChatOutput', fs.readFileSync(ChatOutputImage), 'image/png');
        const result = await autoDashboard.processAILogFromBotStream(botstream);
        allureReporter.addAttachment('ServiceResponse', JSON.stringify(result, null, 2), 'application/json');
        //await aiDiagProcess.validate_content_in_dashboard_action(result.diagnostics, ['removeLayout']);
        await aiDiagProcess.validate_data_on_requirement(
            'The content should contain Dashboard changes/summary,  Deleted the chapter.',
            result.text
        );
        const NewChapter = await $("//div[contains(@class, 'mstrmojo-VITitleBar') and @aria-label='NewChapter']");
        void expect(await NewChapter.isExisting()).toBe(false);
    });
});
