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

describe('Defects for Auto Dashboard 2.0', () => {
    let consoleLogs = [];
    let botstream;
    const originalLog = console.log;
    const project = {
        id: '060ED74A48F4992BA084F7BF6C9A652A',
        name: 'Autodash-2.0 Test',
    };
    const AutoDash2_Defects = {
        id: '4016D0B4AE4630CE0275EC99A59F5294',
        name: 'AutoDash2_Defects',
        url: 'app/060ED74A48F4992BA084F7BF6C9A652A/4016D0B4AE4630CE0275EC99A59F5294',
        project,
    };

    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let { loginPage, dossierPage, libraryPage, libraryAuthoringPage, autoDashboard, aiDiagProcess, contentsPanel } =
        browsers.pageObj1;

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
        await libraryPage.openBotByUrl(AutoDash2_Defects.url);
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

    it('ACSC-2167', async () => {
        await autoDashboard.sendPromptInAutoDash2('X7Vw50KfC2KdPzGY: duplicate viz1 as viz2');
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showDetailsIfError();
        const vizDoc = await libraryAuthoringPage.getVizDoc();
        const vizImage = await saveAutoDash2Result('ACSC-2167_Viz.png', vizDoc, actualImageFolder);
        allureReporter.addAttachment('VizDoc', fs.readFileSync(vizImage), 'image/png');
        const contentPanel = await libraryAuthoringPage.getContentsPanel();
        const contentPanelImage = await saveAutoDash2Result(
            'ACSC-2167_ContentPanel.png',
            contentPanel,
            actualImageFolder
        );
        allureReporter.addAttachment('ContentPanel', fs.readFileSync(contentPanelImage), 'image/png');
        const ChatOutput = await autoDashboard.getAutoDashboard();
        const ChatOutputImage = await saveAutoDash2Result('ACSC-2167_ChatOutput.png', ChatOutput, actualImageFolder);
        allureReporter.addAttachment('ChatOutput', fs.readFileSync(ChatOutputImage), 'image/png');

        await autoDashboard.sendPromptInAutoDash2(
            'X7Vw50KfC2KdPzGY: Add a bar chart comparing # of Items Sold This Quarter by Location on the current page. name it as Bar1'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showDetailsIfError();
        const vizDoc_2 = await libraryAuthoringPage.getVizDoc();
        const vizImage_2 = await saveAutoDash2Result('ACSC-2167_Viz_2.png', vizDoc_2, actualImageFolder);
        allureReporter.addAttachment('VizDoc_2', fs.readFileSync(vizImage_2), 'image/png');
        const contentPanel_2 = await libraryAuthoringPage.getContentsPanel();
        const contentPanelImage_2 = await saveAutoDash2Result(
            'ACSC-2167_ContentPanel_2.png',
            contentPanel_2,
            actualImageFolder
        );
        allureReporter.addAttachment('ContentPanel_2', fs.readFileSync(contentPanelImage_2), 'image/png');
        const ChatOutput_2 = await autoDashboard.getAutoDashboard();
        const ChatOutputImage_2 = await saveAutoDash2Result(
            'ACSC-2167_ChatOutput_2.png',
            ChatOutput_2,
            actualImageFolder
        );
        allureReporter.addAttachment('ChatOutput_2', fs.readFileSync(ChatOutputImage_2), 'image/png');
        const result = await autoDashboard.processAILogFromBotStream(botstream);
        allureReporter.addAttachment('ServiceResponse', JSON.stringify(result, null, 2), 'application/json');
        // Verify the new visualization and a field from the visualization
        const newViz = await $("//div[@class='title-text']/div[@aria-label='Bar1']");
        void expect(await newViz.isDisplayed()).toBe(true);
        const viz1 = await $("//div[@class='title-text']/div[@aria-label='Visualization 1']");
        void expect(await viz1.isDisplayed()).toBe(true);
        const viz2 = await $("//div[@class='title-text']/div[@aria-label='Visualization 1 copy']");
        void expect(await viz2.isDisplayed()).toBe(true);
    });
    it('ACSC-2090_1', async () => {
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'ACSC-2090' });
        await autoDashboard.sendPromptInAutoDash2('X7Vw50KfC2KdPzGY: add On-Time to the viz1');
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showDetailsIfError();
        const ChatOutput = await autoDashboard.getAutoDashboard();
        const ChatOutputImage = await saveAutoDash2Result('ACSC-2090_1_ChatOutput.png', ChatOutput, actualImageFolder);
        allureReporter.addAttachment('ChatOutput', fs.readFileSync(ChatOutputImage), 'image/png');
        const result = await autoDashboard.processAILogFromBotStream(botstream);
        allureReporter.addAttachment('ServiceResponse', JSON.stringify(result, null, 2), 'application/json');
        await aiDiagProcess.validate_data_on_requirement('only support or can only display one metric', result.text);
    });
    it('ACSC-2090_2', async () => {
        await autoDashboard.sendPromptInAutoDash2('X7Vw50KfC2KdPzGY: add On-Time to the viz1');
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showDetailsIfError();
        const ChatOutput = await autoDashboard.getAutoDashboard();
        const ChatOutputImage = await saveAutoDash2Result('ACSC-2090_2_ChatOutput.png', ChatOutput, actualImageFolder);
        allureReporter.addAttachment('ChatOutput', fs.readFileSync(ChatOutputImage), 'image/png');
        const result = await autoDashboard.processAILogFromBotStream(botstream);
        allureReporter.addAttachment('ServiceResponse', JSON.stringify(result, null, 2), 'application/json');
        await aiDiagProcess.validate_data_on_requirement('only support or can only display one metric', result.text);
    });
    it('ACSC-1958', async () => {
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'ACSC-1958' });
        await autoDashboard.sendPromptInAutoDash2('X7Vw50KfC2KdPzGY: add Origin Airport to the vertical of Pie1');
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showDetailsIfError();
        const vizDoc = await libraryAuthoringPage.getVizDoc();
        const vizImage = await saveAutoDash2Result('ACSC-1958_Viz.png', vizDoc, actualImageFolder);
        allureReporter.addAttachment('VizDoc', fs.readFileSync(vizImage), 'image/png');
        const ChatOutput = await autoDashboard.getAutoDashboard();
        const ChatOutputImage = await saveAutoDash2Result('ACSC-1958_ChatOutput.png', ChatOutput, actualImageFolder);
        allureReporter.addAttachment('ChatOutput', fs.readFileSync(ChatOutputImage), 'image/png');
        const result = await autoDashboard.processAILogFromBotStream(botstream);
        allureReporter.addAttachment('ServiceResponse', JSON.stringify(result, null, 2), 'application/json');
        await aiDiagProcess.validate_content_in_dashboard_action(result.diagnostics, [
            'updateTemplate',
            'addDropZoneUnit',
            '836BC0610C43AEFA975A3096C92DFC8D',
        ]);
        const vizUnit = await $(
            "//div[@class='mstrmojo-VIPanel-content']//span[@class='txt' and text()='Origin Airport']"
        );
        void expect(await vizUnit.isExisting()).toBe(true);
        await aiDiagProcess.validate_data_on_requirement('Origin Airport added to the vertical of Pie1', result.text);
    });
    it('ACSC-1380', async () => {
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'ACSC-1380' });
        const contentPanel = await libraryAuthoringPage.getContentsPanel();
        const contentPanelImage = await saveAutoDash2Result(
            'ACSC-1380_ContentPanel.png',
            contentPanel,
            actualImageFolder
        );
        allureReporter.addAttachment('ContentPanel', fs.readFileSync(contentPanelImage), 'image/png');
        await autoDashboard.sendPromptInAutoDash2('X7Vw50KfC2KdPzGY: add Month to Viz1');
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showDetailsIfError();
        const vizDoc = await libraryAuthoringPage.getVizDoc();
        const vizImage = await saveAutoDash2Result('ACSC-1380_Viz.png', vizDoc, actualImageFolder);
        allureReporter.addAttachment('VizDoc', fs.readFileSync(vizImage), 'image/png');
        const ChatOutput = await autoDashboard.getAutoDashboard();
        const ChatOutputImage = await saveAutoDash2Result('ACSC-1380_ChatOutput.png', ChatOutput, actualImageFolder);
        allureReporter.addAttachment('ChatOutput', fs.readFileSync(ChatOutputImage), 'image/png');
        const result = await autoDashboard.processAILogFromBotStream(botstream);
        allureReporter.addAttachment('ServiceResponse', JSON.stringify(result, null, 2), 'application/json');
        await aiDiagProcess.validate_content_in_dashboard_action(result.diagnostics, [
            'updateTemplate',
            '7103AF5569460A18D14E56BF376C8914',
        ]);
        await aiDiagProcess.validate_data_on_requirement('Month added to Viz1', result.text);
    });
    it('ACSC-1293;AHIT-740', async () => {
        await autoDashboard.sendPromptInAutoDash2(
            'X7Vw50KfC2KdPzGY: add a KPI showing Unit Price over time using Month Date time attribute from retail-sample-data'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showDetailsIfError();
        const vizDoc = await libraryAuthoringPage.getVizDoc();
        const vizImage = await saveAutoDash2Result('ACSC-1393_Viz.png', vizDoc, actualImageFolder);
        allureReporter.addAttachment('VizDoc', fs.readFileSync(vizImage), 'image/png');
        const ChatOutput = await autoDashboard.getAutoDashboard();
        const ChatOutputImage = await saveAutoDash2Result('ACSC-1393_ChatOutput.png', ChatOutput, actualImageFolder);
        allureReporter.addAttachment('ChatOutput', fs.readFileSync(ChatOutputImage), 'image/png');
        const result = await autoDashboard.processAILogFromBotStream(botstream);
        allureReporter.addAttachment('ServiceResponse', JSON.stringify(result, null, 2), 'application/json');
        const vizUnit = await $("//div[@class='mstrmojo-VIPanel-content']//span[@class='txt' and text()='Month Date']");
        void expect(await vizUnit.isExisting()).toBe(true);
        await aiDiagProcess.validate_data_on_requirement(
            'Added a KPI visualization displaying Unit Price over time using the Month Date attribute from the retail-sample-data.',
            result.text
        );
    });
    it('ACSC-1287', async () => {
        //page with machine learning viz
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'ACSC-1287' });
        await autoDashboard.sendPromptInAutoDash2('X7Vw50KfC2KdPzGY: remove the visualization Normal');
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showDetailsIfError();
        const vizDoc = await libraryAuthoringPage.getVizDoc();
        const vizImage = await saveAutoDash2Result('ACSC-1287_Viz.png', vizDoc, actualImageFolder);
        allureReporter.addAttachment('VizDoc', fs.readFileSync(vizImage), 'image/png');
        const ChatOutput = await autoDashboard.getAutoDashboard();
        const ChatOutputImage = await saveAutoDash2Result('ACSC-1287_ChatOutput.png', ChatOutput, actualImageFolder);
        allureReporter.addAttachment('ChatOutput', fs.readFileSync(ChatOutputImage), 'image/png');
        const result = await autoDashboard.processAILogFromBotStream(botstream);
        allureReporter.addAttachment('ServiceResponse', JSON.stringify(result, null, 2), 'application/json');
        const Viz1 = await $("//div[@class='title-text']/div[@aria-label='Normal']");
        void expect(await Viz1.isExisting()).toBe(false);
        await aiDiagProcess.validate_data_on_requirement(
            'Removed the visualization "Normal" from the page "ACSC-1287"',
            result.text
        );
    });
    it('AHIT-680', async () => {
        //filter related, renaming, changing stype, remove targets
        //set value not stable now, skip for now
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'AHIT-680' });
        await autoDashboard.sendPromptInAutoDash2(
            'X7Vw50KfC2KdPzGY: rename the filter "Month Date" to "Filter by Month Date"'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showDetailsIfError();
        await autoDashboard.sendPromptInAutoDash2(
            'X7Vw50KfC2KdPzGY: change the filter "Filter by Month Date" to a dropdown list'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showDetailsIfError();
        await autoDashboard.sendPromptInAutoDash2(
            'X7Vw50KfC2KdPzGY: remove all targets from the filter "Filter by Month Date"'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showDetailsIfError();
        const vizDoc = await libraryAuthoringPage.getVizDoc();
        const vizImage = await saveAutoDash2Result('AHIT-680_Viz.png', vizDoc, actualImageFolder);
        allureReporter.addAttachment('VizDoc', fs.readFileSync(vizImage), 'image/png');
        const ChatOutput = await autoDashboard.getAutoDashboard();
        const ChatOutputImage = await saveAutoDash2Result('AHIT-680_ChatOutput.png', ChatOutput, actualImageFolder);
        allureReporter.addAttachment('ChatOutput', fs.readFileSync(ChatOutputImage), 'image/png');
        const result = await autoDashboard.processAILogFromBotStream(botstream);
        allureReporter.addAttachment('ServiceResponse', JSON.stringify(result, null, 2), 'application/json');
        const filterTitle = await $(
            "//div[@class='mstrmojo-VITitleBar ']//div[contains(@class,'mstrmojo-EditableLabel') and @aria-label='Filter by Month Date']"
        );
        void expect(await filterTitle.isExisting()).toBe(true);
        const gridcell = await $("//td[@role='gridcell' and text()='12/1/2023']");
        void expect(await gridcell.isExisting()).toBe(true);
    });
    it('ACSC-1089', async () => {
        //filter related, renaming, changing stype, remove targets
        //set value not stable now, skip for now
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'ACSC-1089' });
        await autoDashboard.sendPromptInAutoDash2(
            'X7Vw50KfC2KdPzGY: add 2011 & 2012  from OtherObjects to the grid "visualization 1"'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showDetailsIfError();
        const contentPanel = await libraryAuthoringPage.getContentsPanel();
        const contentPanelImage = await saveAutoDash2Result(
            'ACSC-1089_ContentPanel.png',
            contentPanel,
            actualImageFolder
        );
        allureReporter.addAttachment('ContentPanel', fs.readFileSync(contentPanelImage), 'image/png');
        const vizDoc = await libraryAuthoringPage.getVizDoc();
        const vizImage = await saveAutoDash2Result('ACSC-1089_Viz.png', vizDoc, actualImageFolder);
        allureReporter.addAttachment('VizDoc', fs.readFileSync(vizImage), 'image/png');
        const ChatOutput = await autoDashboard.getAutoDashboard();
        const ChatOutputImage = await saveAutoDash2Result('ACSC-1089_ChatOutput.png', ChatOutput, actualImageFolder);
        allureReporter.addAttachment('ChatOutput', fs.readFileSync(ChatOutputImage), 'image/png');
        const result = await autoDashboard.processAILogFromBotStream(botstream);
        allureReporter.addAttachment('ServiceResponse', JSON.stringify(result, null, 2), 'application/json');
        const VizUnit = await $(
            "//div[@class='mstrmojo-VIPanel-content']//span[@class='txt' and text()='2011 & 2012']"
        );
        void expect(await VizUnit.isExisting()).toBe(true);
        await aiDiagProcess.validate_data_on_requirement(
            'Added 2011 & 2012 from OtherObjects to the grid',
            result.text
        );
    });
    it('ACSC-1022', async () => {
        await autoDashboard.sendPromptInAutoDash2('X7Vw50KfC2KdPzGY: remove Revenue from the grid “visualization 1"');
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showDetailsIfError();
        const vizDoc = await libraryAuthoringPage.getVizDoc();
        const vizImage = await saveAutoDash2Result('ACSC-1022_Viz.png', vizDoc, actualImageFolder);
        allureReporter.addAttachment('VizDoc', fs.readFileSync(vizImage), 'image/png');
        const ChatOutput = await autoDashboard.getAutoDashboard();
        const ChatOutputImage = await saveAutoDash2Result('ACSC-1022_ChatOutput.png', ChatOutput, actualImageFolder);
        allureReporter.addAttachment('ChatOutput', fs.readFileSync(ChatOutputImage), 'image/png');
        const result = await autoDashboard.processAILogFromBotStream(botstream);
        allureReporter.addAttachment('ServiceResponse', JSON.stringify(result, null, 2), 'application/json');
        await aiDiagProcess.validate_data_on_requirement('Revenue not found in Visualization 1', result.text);
    });
});
