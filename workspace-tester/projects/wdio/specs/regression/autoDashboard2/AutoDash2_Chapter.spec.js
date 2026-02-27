import { autoDashBrowserWindow } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { fileURLToPath } from 'url';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import allureReporter from '@wdio/allure-reporter';
import fs from 'fs';
import path from 'path';
import * as bot from '../../../constants/bot2.js';
import { infoLog } from '../../../config/consoleFormat.js';
import { saveElementScreenshotLocal, cleanFileInFolder, takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { validateAutoDash2Page } from '../../../utils/openAI_autoDash2validation.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const actualImageFolder = path.resolve(__dirname, '../../../autodash/Chapter');

// npm run regression -- --spec=specs/regression/autoDashboard2/AutoDash2_Chapter.spec.js --baseUrl=https://tec-l-1280162.labs.microstrategy.com/MicroStrategyLibrary/
describe('Chapter related workflow for Auto Dashboard 2.0', () => {

    const AutoDash2 = {
        id: 'E1E88174DE407C1FB18D82854472B11A',
        name: 'AutoDash2_Auto',
        projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
    };

    let { loginPage, dossierPage, libraryPage, libraryAuthoringPage, autoDashboard, visualizationPanel, contentsPanel, tocContentsPanel } = browsers.pageObj1;

    async function saveAutoDash2Result(caseName, element, actualImageFolder) {
        const imagePath = path.resolve(actualImageFolder, caseName);
        await saveElementScreenshotLocal(element, imagePath);
        return imagePath;
    }

    async function validateAllPagesInChapterWithAI(promptText) {
        const pages = await contentsPanel.getAllPagesInCurrentChapterEL();
        const pageImages = [];

        // Step 1: Capture all page screenhot in the generated chapter
        for (let i = 0; i < pages.length; i++) {
            await pages[i].click();
            await libraryAuthoringPage.waitLoadingDataPopUpIsNotDisplayed();
            await browser.pause(2000);

            const canvas = await libraryAuthoringPage.getVizDoc();
            const canvasImage = await saveAutoDash2Result(
                `${promptText.replace(/\s+/g, '_')}_Page${i + 1}.png`,
                canvas,
                actualImageFolder
            );
            allureReporter.addAttachment(`Page ${i + 1} Canvas`, fs.readFileSync(canvasImage), 'image/png');
            pageImages.push(canvasImage);
        }
        // Step 2: Send all images together for AI validation
        const result = await validateAutoDash2Page(promptText, pageImages);

        // Step 3: Extract AI validation results
        const alignMatch = result.match(/Is the dashboard page aligned with the user prompt\?:\s*(Yes|No)/i);
        const reasonMatch = result.match(/Reasoning:\s*([\s\S]*?)(?:Missing|$)/i);
        const missingMatch = result.match(/Missing or Incorrect Elements \(if any\):\s*([\s\S]*)/i);

        const allAligned = alignMatch && alignMatch[1].toLowerCase() === 'yes';
        const reasoning = reasonMatch ? reasonMatch[1].trim() : 'N/A';
        const missing = missingMatch ? missingMatch[1].trim() : 'None';
        
        // Step 4: Attach output to Allure report
        const reasoningFormatted = reasoning.replace(/\n\s*/g, '\n\n');
        const missingFormatted = missing.replace(/\n\s*/g, '\n\n');

        allureReporter.addStep(`✅ Overall Alignment: ${allAligned ? 'Yes' : 'No'}`);
        allureReporter.addStep(`💬 Reasoning Summary:\n${reasoningFormatted}`);
        allureReporter.addStep(`⚠️ Missing or Incorrect Elements Summary:\n${missingFormatted}`);

        await since('Expected all pages in generated chapter to align with the user prompt.')
            .expect(allAligned)
            .toBe(true);
    }

    beforeAll(async () => {
        await setWindowSize(autoDashBrowserWindow);
        if (!(await loginPage.isLoginPageDisplayed())) {
            await browser.url(new URL('auth/ui/loginPage', browser.options.baseUrl).toString(), 100000);
        }
        await loginPage.login(bot.autoDashUser);
        await cleanFileInFolder(actualImageFolder);
        
    });

    beforeEach(async () => {
        await libraryPage.editDossierByUrl({
            projectId: AutoDash2.projectId,
            dossierId: AutoDash2.id,
        });
        await autoDashboard.openAutoDashboard(false);
    });

    afterEach(async () => {
        await autoDashboard.closeEditWithoutSaving();
        await dossierPage.goToLibrary();
    });
    
    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('AHIT-1667_01_Create an empty chapter', async () => {
        infoLog('Send command in auto dash chat panel');
        await autoDashboard.sendPromptInAutoDash2(
            'Create an empty chapter'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showErrorDetailsAndFail();

        infoLog('Take screenshots and attach to allure');
        const canvas = await libraryAuthoringPage.getVizDoc();
        const canvasImage = await saveAutoDash2Result('AHIT-1667_01_Canvas.png', canvas, actualImageFolder);
        allureReporter.addAttachment('Canvas', fs.readFileSync(canvasImage), 'image/png');
        const chatPanel = await autoDashboard.getAutoDashboard();
        const chatPanelImage = await saveAutoDash2Result('AHIT-1667_01_ChatOutput.png', chatPanel, actualImageFolder);
        allureReporter.addAttachment('ChatOutput', fs.readFileSync(chatPanelImage), 'image/png');
        const contentPanel = await libraryAuthoringPage.getContentsPanel();
        const contentPanelImage = await saveAutoDash2Result('AHIT-1667_01_ContentPanel.png', contentPanel, actualImageFolder);
        allureReporter.addAttachment('ContentPanel', fs.readFileSync(contentPanelImage), 'image/png');

        infoLog('Verify ghost viz and TOC');
        const ghostImg = visualizationPanel.getVizImgByTitle('Visualization 1')
        await since('Empty Visualization is displayed, instead we have #{actual}')
            .expect(await ghostImg.isDisplayed())
            .toBe(true);
        await since('Chapter count should be #{expected}, instead we have #{actual}')
            .expect(await contentsPanel.getChapterCount())
            .toBe(3);
    });

    it('AHIT-1667_02_Duplicate, rename, delete chapter', async () => {
        // ---------- Step 1: Duplicate chapter ----------
        infoLog('Send command to duplicate chapter');
        await autoDashboard.sendPromptInAutoDash2(
            'Duplicate Chapter 1'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showErrorDetailsAndFail();

        infoLog('Verify the duplicate page is not supported');
        const lastAnswerText = await autoDashboard.getAutoDash2LatestAnswerText();
        await since('This action is not supported in auto dash')
            .expect(/unsupported|not supported/i.test(lastAnswerText))
            .toBe(true);

        // ---------- Step 2: Rename chapter ----------
        infoLog('Send command to rename chapter');
        await autoDashboard.sendPromptInAutoDash2(
            'Rename Chapter 1 to AutoDash'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showErrorDetailsAndFail();

        infoLog('Verify the renamed chapter');
        await browser.pause(2000);
        await since('Page "Page 1" in chapter "AutoDash" is the current page, instead we have #{actual}')
            .expect(await (await contentsPanel.getPage({ chapterName: 'AutoDash', pageName: 'Page 1' })).isDisplayed())
            .toBe(true);

        // ---------- Step 3: Delete chapter ----------
        infoLog('Send command to delete chapter');
        await autoDashboard.sendPromptInAutoDash2(
            'Delete current chapter'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showErrorDetailsAndFail();
        
        infoLog('Verify the delete chapter action');
        await since('Chapter count should be #{expected}, instead we have #{actual}')
            .expect(await contentsPanel.getChapterCount())
            .toBe(1);
        await since('Page count should be #{expected}, instead we have #{actual}')
            .expect(await contentsPanel.getPagesCount())
            .toBe(3);

        infoLog('Take screenshots and attach to allure');
        const chatPanel = await autoDashboard.getAutoDashboard();
        const chatPanelImage = await saveAutoDash2Result('AHIT-1667_02_ChatOutput.png', chatPanel, actualImageFolder);
        allureReporter.addAttachment('ChatOutput', fs.readFileSync(chatPanelImage), 'image/png');
    });

    it('AHIT-1667_03_Suggest a chapter named "Overview"', async () => {
        infoLog('Send command in auto dash chat panel');
        await autoDashboard.sendPromptInAutoDash2(
            'Suggest a chapter named "Overview"'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showErrorDetailsAndFail();

        infoLog('Verify chapter name and count');
        const chapterEL = tocContentsPanel.getChapterByName('Overview')
        await since('Expected the new chapter name to be "Overview", instead we have #{actual}')
            .expect(await chapterEL.isDisplayed())
            .toBe(true);
        await since('Chapter count should be #{expected}, instead we have #{actual}')
            .expect(await contentsPanel.getChapterCount())
            .toBe(3);
        
        infoLog('Take screenshots and attach to allure');
        const chatPanel = await autoDashboard.getAutoDashboard();
        const chatPanelImage = await saveAutoDash2Result('AHIT-1667_03_ChatOutput.png', chatPanel, actualImageFolder);
        allureReporter.addAttachment('ChatOutput', fs.readFileSync(chatPanelImage), 'image/png');
        const contentPanel = await libraryAuthoringPage.getContentsPanel();
        const contentPanelImage = await saveAutoDash2Result('AHIT-1667_03_ContentPanel.png', contentPanel, actualImageFolder);
        allureReporter.addAttachment('ContentPanel', fs.readFileSync(contentPanelImage), 'image/png');
        
        infoLog('AI validation for each page in the generated chapter');
        await validateAllPagesInChapterWithAI(
            'Suggest a chapter named "Overview"'
        );
    });

    it('AHIT-1667_04_Create a chapter with 2 pages, analyzing the geographic distribution of employees and sales across countries and cities', async () => {
        infoLog('Send command in auto dash chat panel');
        await autoDashboard.sendPromptInAutoDash2(
            'Create a chapter with 2 pages, analyzing the geographic distribution of employees and sales across countries and cities'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showErrorDetailsAndFail();

        infoLog('Verify chapter count and page count');
        await since('Chapter count should be #{expected}, instead we have #{actual}')
            .expect(await contentsPanel.getChapterCount())
            .toBe(3);
        await since('Page count should be #{expected}, instead we have #{actual}')
            .expect(await contentsPanel.getPagesCount())
            .toBe(6);
        
        infoLog('Take screenshots and attach to allure');
        const chatPanel = await autoDashboard.getAutoDashboard();
        const chatPanelImage = await saveAutoDash2Result('AHIT-1667_04_ChatOutput.png', chatPanel, actualImageFolder);
        allureReporter.addAttachment('ChatOutput', fs.readFileSync(chatPanelImage), 'image/png');
        const contentPanel = await libraryAuthoringPage.getContentsPanel();
        const contentPanelImage = await saveAutoDash2Result('AHIT-1667_04_ContentPanel.png', contentPanel, actualImageFolder);
        allureReporter.addAttachment('ContentPanel', fs.readFileSync(contentPanelImage), 'image/png');
        
        infoLog('AI validation for each page in the generated chapter');
        await validateAllPagesInChapterWithAI(
            'Create a chapter with 2 pages, analyzing the geographic distribution of employees and sales across countries and cities'
        );
    });

    it('AHIT-1667_05_Add a new chapter with 3 pages based on the dataset with green background, each page should have 3 KPI, 1 grid, 1 line chart and 1 bar chart', async () => {
        infoLog('Send command in auto dash chat panel');
        await autoDashboard.sendPromptInAutoDash2(
            'Add a new chapter with 3 pages based on the dataset with green background, each page should have 3 KPI, 1 grid, 1 line chart and 1 bar chart'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showErrorDetailsAndFail();

        infoLog('Verify chapter count and page count');
        await since('Chapter count should be #{expected}, instead we have #{actual}')
            .expect(await contentsPanel.getChapterCount())
            .toBe(3);
        await since('Page count should be #{expected}, instead we have #{actual}')
            .expect(await contentsPanel.getPagesCount())
            .toBe(7);
        
        infoLog('Take screenshots and attach to allure');
        const chatPanel = await autoDashboard.getAutoDashboard();
        const chatPanelImage = await saveAutoDash2Result('AHIT-1667_05_ChatOutput.png', chatPanel, actualImageFolder);
        allureReporter.addAttachment('ChatOutput', fs.readFileSync(chatPanelImage), 'image/png');
        const contentPanel = await libraryAuthoringPage.getContentsPanel();
        const contentPanelImage = await saveAutoDash2Result('AHIT-1667_05_ContentPanel.png', contentPanel, actualImageFolder);
        allureReporter.addAttachment('ContentPanel', fs.readFileSync(contentPanelImage), 'image/png');
        
        infoLog('AI validation for each page in the generated chapter');
        await validateAllPagesInChapterWithAI(
            'Add a new chapter with 3 pages based on the dataset with green background, each page should have 3 KPI, 1 grid, 1 line chart and 1 bar chart'
        );
    });

});
