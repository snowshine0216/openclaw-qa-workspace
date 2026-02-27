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
const actualImageFolder = path.resolve(__dirname, '../../../autodash/VizSanity');

describe('Viz Sanity workflow for Auto Dashboard 2.0', () => {
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

    it('00_Add a enhanced KPI on # of employees, name it as enhancedKPI', async () => {
        await autoDashboard.sendPromptInAutoDash2(
            'X7Vw50KfC2KdPzGY: Add a enhanced KPI on # of employees, name it as enhancedKPI'
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
        await aiDiagProcess.validate_content_in_dashboard_action(result.diagnostics, ['copyUnit', 'ImageEnhancedKPI']);
        await aiDiagProcess.validate_data_on_requirement(
            'The content should contain info of enhancedKPI is created',
            result.text
        );
    });
    it('02_duplicate the KPI on current page and name it as KPI2', async () => {
        await autoDashboard.sendPromptInAutoDash2(
            'X7Vw50KfC2KdPzGY: duplicate the KPI on current page and name it as KPI2'
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
        await aiDiagProcess.validate_content_in_dashboard_action(result.diagnostics, ['macroCopyUnit', 'W68']);
        await aiDiagProcess.validate_data_on_requirement(
            'The content should contain summary/modification info about a duplication on KPI and rename it as KPI2',
            result.text
        );
    });
    it('03_Change the viz KPI2 to grid and name it as KPI2Grid', async () => {
        await autoDashboard.sendPromptInAutoDash2(
            'X7Vw50KfC2KdPzGY: Change the viz KPI2 to grid and name it as KPI2Grid'
        );
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
            'updateTemplate',
            'changeGridDisplayMode',
            'Title',
            'KPI2Grid',
        ]);
        await aiDiagProcess.validate_data_on_requirement(
            'The content should contain summary/modification about 2 actions, one is changing the viz type to grid and 2nd is about renaming to KPI2Grid',
            result.text
        );
        const KPI2Grid = await $("//div[@class='title-text']/div[@aria-label='KPI2Grid']");
        void expect(await KPI2Grid.isDisplayed()).toBe(true);
    });
    it('04_Add Department to the grid KPI2Grid ', async () => {
        await autoDashboard.sendPromptInAutoDash2('X7Vw50KfC2KdPzGY: Add Department to the grid KPI2Grid');
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
        await aiDiagProcess.validate_content_in_dashboard_action(result.diagnostics, [
            'editNode',
            'updateTemplate',
            'addUnit',
            '9F1CCB5DB7440B393994568EBC6F4D3C',
        ]);
        await aiDiagProcess.validate_data_on_requirement(
            'The content should contain summary/modification about adding Department column to the KPI2Grid',
            result.text
        );
    });
    it('04_a_Delete the Visualization enhancedKPI', async () => {
        await autoDashboard.sendPromptInAutoDash2('X7Vw50KfC2KdPzGY: Delete the Visualization enhancedKPI');
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
        await aiDiagProcess.validate_content_in_dashboard_action(result.diagnostics, ['removeUnit', 'W68']);
        await aiDiagProcess.validate_data_on_requirement(
            'The content should contain summary/modification/change info about Visualization enhancedKPI is deleted.',
            result.text
        );
        const Viz1 = await $("//div[@class='title-text']/div[@aria-label='Visualization 1']");
        void expect(await Viz1.isExisting()).toBe(false);
    });
    it('05_Duplicate the current page as Page2_Dup', async () => {
        await autoDashboard.sendPromptInAutoDash2('X7Vw50KfC2KdPzGY: Duplicate the current page as Page2_Dup');
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
        await aiDiagProcess.validate_content_in_dashboard_action(result.diagnostics, ['duplicatePanel', 'Page2_Dup']);
        await aiDiagProcess.validate_data_on_requirement(
            'The content should contain summary/modification about 2 actions, one is duplicating page, the other is to rename it as Page2_Dup',
            result.text
        );
        const Page2_Dup = await $("//span[contains(@class, 'macro-current-page-name') and @title='Page2_Dup']");
        void expect(await Page2_Dup.isDisplayed()).toBe(true);
        const KPI2Grid = await $("//div[@class='title-text']/div[@aria-label='KPI2Grid']");
        void expect(await KPI2Grid.isDisplayed()).toBe(true);
    });

    it('06_Add a new chapter as Chapter2', async () => {
        await autoDashboard.sendPromptInAutoDash2('X7Vw50KfC2KdPzGY: Add a new chapter, name it as Chapter2');
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
        await aiDiagProcess.validate_content_in_dashboard_action(result.diagnostics, ['addLayout']);
        await aiDiagProcess.validate_data_on_requirement(
            'The content should contain summary/modification about adding a new chapter to the dashboard',
            result.text
        );
        const Chapter2 = await $("//div[contains(@class, 'mstrmojo-VITitleBar') and @aria-label='Chapter2']");
        void expect(await Chapter2.isDisplayed()).toBe(true);
    });

    it('07_Delete current page', async () => {
        await autoDashboard.sendPromptInAutoDash2('X7Vw50KfC2KdPzGY: Delete Current Page');
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
        await aiDiagProcess.validate_content_in_dashboard_action(result.diagnostics, ['removeUnit', 'setCurrentPanel']);
        await aiDiagProcess.validate_data_on_requirement(
            'The content should contain summary/modification about deleting a page',
            result.text
        );
        const Chapter2 = await $("//div[contains(@class, 'mstrmojo-VITitleBar') and @aria-label='Chapter 2']");
        void expect(await Chapter2.isExisting()).toBe(false);
    });
});
