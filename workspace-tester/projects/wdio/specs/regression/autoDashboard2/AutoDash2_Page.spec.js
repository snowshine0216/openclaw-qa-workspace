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
const actualImageFolder = path.resolve(__dirname, '../../../autodash/Page');

// npm run regression -- --spec=specs/regression/autoDashboard2/AutoDash2_Page.spec.js --baseUrl=https://tec-l-1280162.labs.microstrategy.com/MicroStrategyLibrary/
describe('Page related workflow for Auto Dashboard 2.0', () => {

    const AutoDash2 = {
        id: 'E1E88174DE407C1FB18D82854472B11A',
        name: 'AutoDash2_Auto',
        projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
    };

    const pagePrompts = [
       { id: 'AHIT-1666_03', text: 'Suggest a page'},
       { id: 'AHIT-1666_04', text: 'Create a page based on the dataset'},
       { id: 'AHIT-1666_05', text: 'Create a page exploring the relationship between employee tenure (Hire Date) and customer retention rating, make the page as green'},
       // ACSC-2170: Create a page/chapter with detailed instruction of objects, error out
       { id: 'AHIT-1666_06', text: 'Create a page that have 2 filters, 2 grids, 1 line chart and 3 enhanced KPI'},
    ];

    let { loginPage, dossierPage, libraryPage, libraryAuthoringPage, autoDashboard, visualizationPanel, contentsPanel } = browsers.pageObj1;

    async function saveAutoDash2Result(caseName, element, actualImageFolder) {
        const imagePath = path.resolve(actualImageFolder, caseName);
        await saveElementScreenshotLocal(element, imagePath);
        return imagePath;
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

    it('AHIT-1666_01_Create an empty page', async () => {
        infoLog('Send command in auto dash chat panel');
        await autoDashboard.sendPromptInAutoDash2(
            'Create an empty page called "Page 2"'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showErrorDetailsAndFail();

        infoLog('Take screenshots and attach to allure');
        const canvas = await libraryAuthoringPage.getVizDoc();
        const canvasImage = await saveAutoDash2Result('AHIT-1666_01_Canvas.png', canvas, actualImageFolder);
        allureReporter.addAttachment('Canvas', fs.readFileSync(canvasImage), 'image/png');
        const chatPanel = await autoDashboard.getAutoDashboard();
        const chatPanelImage = await saveAutoDash2Result('AHIT-1666_01_ChatOutput.png', chatPanel, actualImageFolder);
        allureReporter.addAttachment('ChatOutput', fs.readFileSync(chatPanelImage), 'image/png');
        const contentPanel = await libraryAuthoringPage.getContentsPanel();
        const contentPanelImage = await saveAutoDash2Result('AHIT-1666_01_ContentPanel.png', contentPanel, actualImageFolder);
        allureReporter.addAttachment('ContentPanel', fs.readFileSync(contentPanelImage), 'image/png');

        infoLog('Verify ghost viz and TOC');
        const ghostImg = visualizationPanel.getVizImgByTitle('Visualization 1')
        await since('Empty Visualization is displayed, instead we have #{actual}')
            .expect(await ghostImg.isDisplayed())
            .toBe(true);
        await since('Page "Page 2" in chapter "Chapter 1" is the current page, instead we have #{actual}')
            .expect(await (await contentsPanel.getPage({ chapterName: 'Chapter 1', pageName: 'Page 2' })).isDisplayed())
            .toBe(true);
    });

    it('AHIT-1666_02_Duplicate, rename, delete page', async () => {
        // ---------- Step 1: Duplicate Page ----------
        infoLog('Send command to duplicate page');
        await autoDashboard.sendPromptInAutoDash2(
            'Duplicate Page 1'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showErrorDetailsAndFail();

        infoLog('Verify the duplicated page');
        await since('Page "Page 1 Copy" in chapter "Chapter 1" is the current page, instead we have #{actual}')
            .expect(await (await contentsPanel.getPage({ chapterName: 'Chapter 1', pageName: 'Page 1 Copy' })).isDisplayed())
            .toBe(true);
        await since('Page count should be #{expected}, instead we have #{actual}')
            .expect(await contentsPanel.getPagesCount())
            .toBe(5);
        await takeScreenshotByElement(
            await libraryAuthoringPage.getVizDoc(),
            'AHIT-1666_02',
            'Duplicated page',
        );
        // ---------- Step 2: Rename Page ----------
        infoLog('Send command to rename page');
        await autoDashboard.sendPromptInAutoDash2(
            'Rename Page 1 Copy to AutoDash'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showErrorDetailsAndFail();

        infoLog('Verify the renamed page');
        await since('Page "AutoDash" in chapter "Chapter 1" is the current page, instead we have #{actual}')
            .expect(await (await contentsPanel.getPage({ chapterName: 'Chapter 1', pageName: 'AutoDash' })).isDisplayed())
            .toBe(true);

        // ---------- Step 3: Delete Page ----------
        infoLog('Send command to delete page');
        await autoDashboard.sendPromptInAutoDash2(
            'Delete page AutoDash'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showErrorDetailsAndFail();
        
        infoLog('Verify the delete page action');
        await since('Page "Page 1" in chapter "Chapter 1" is the current page, instead we have #{actual}')
            .expect(await (await contentsPanel.getPage({ chapterName: 'Chapter 1', pageName: 'Page 1' })).isDisplayed())
            .toBe(true);
        await since('Page count should be #{expected}, instead we have #{actual}')
            .expect(await contentsPanel.getPagesCount())
            .toBe(4);

        infoLog('Take screenshots and attach to allure');
        const chatPanel = await autoDashboard.getAutoDashboard();
        const chatPanelImage = await saveAutoDash2Result('AHIT-1666_02_ChatOutput.png', chatPanel, actualImageFolder);
        allureReporter.addAttachment('ChatOutput', fs.readFileSync(chatPanelImage), 'image/png');
    });

    for (const { id, text } of pagePrompts) {
        it(`${id}: ${text}`, async () => {
            infoLog(`Send command: ${text}`);
            await autoDashboard.sendPromptInAutoDash2(text);
            await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
            await autoDashboard.showErrorDetailsAndFail();

            infoLog('Take screenshots and attach to Allure');
            const canvas = await libraryAuthoringPage.getVizDoc();
            const canvasImage = await saveAutoDash2Result(`${id}_Canvas.png`, canvas, actualImageFolder);
            allureReporter.addAttachment('Canvas', fs.readFileSync(canvasImage), 'image/png');
            const chatPanel = await autoDashboard.getAutoDashboard();
            const chatPanelImage = await saveAutoDash2Result(`${id}_ChatOutput.png`, chatPanel, actualImageFolder);
            allureReporter.addAttachment('ChatOutput', fs.readFileSync(chatPanelImage), 'image/png');
            const contentPanel = await libraryAuthoringPage.getContentsPanel();
            const contentPanelImage = await saveAutoDash2Result(`${id}_ContentPanel.png`, contentPanel, actualImageFolder);
            allureReporter.addAttachment('ContentPanel', fs.readFileSync(contentPanelImage), 'image/png');

            infoLog('Verify new page is created');
            try {
                await since('Page count should be #{expected}, instead we have #{actual}')
                    .expect(await contentsPanel.getPagesCount())
                    .toBe(5);

                const currentPageTitle = await contentsPanel.getCurrentPageName();
                allureReporter.addStep(`New page name: ${currentPageTitle}`);
                } catch (err) {
                allureReporter.addStep(`Could not verify TOC/page name: ${err.message}`, {}, 'broken');
            }

            infoLog('AI validation for generated page');
            const validationResult = await validateAutoDash2Page(text, canvasImage);
            
            // Extract output from AI validation
            const alignMatch = validationResult.match(/Is the dashboard page aligned with the user prompt\?:\s*(Yes|No)/i);
            const reasonMatch = validationResult.match(/Reasoning:\s*([\s\S]*?)(?:Missing|$)/i);
            const missingMatch = validationResult.match(/Missing or Incorrect Elements \(if any\):\s*([\s\S]*)/i);

            const isAligned = alignMatch && alignMatch[1].toLowerCase() === 'yes';
            const reasoning = reasonMatch ? reasonMatch[1].trim() : 'N/A';
            const missingElements = missingMatch ? missingMatch[1].trim() : 'None';

            // Attach output to Allure report
            allureReporter.addStep(`✅ Is the dashboard page aligned with the user prompt: ${isAligned ? 'Yes' : 'No'}`);
            allureReporter.addStep(`💬 Reasoning: ${reasoning}`);
            allureReporter.addStep(`⚠️ Missing or Incorrect Elements: ${missingElements}`);

            // Pass or fail
            await since('Expected the generated page to align with the user prompt, but it did not.')
                .expect(isAligned)
                .toBe(true);
        });
    }

    it('AHIT-1666_07_Create page in Infographic Style', async () => {
        infoLog('Switch to Infographic Style');
        await autoDashboard.switchAutoDash2BeautificationMode('Infographic');

        infoLog('Send command in auto dash chat panel');
        await autoDashboard.sendPromptInAutoDash2(
            'Suggest a page'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showErrorDetailsAndFail();

        infoLog('The page must contain rich text box');
        const richText = await $('.mstrmojo-DocQuillTextfield');
        await since('The page contains a rich text box')
                .expect(await richText.isExisting())
                .toBe(true);
        
        infoLog('Take screenshots and attach to allure');
        const canvas = await libraryAuthoringPage.getVizDoc();
        const canvasImage = await saveAutoDash2Result('AHIT-1666_07_Canvas.png', canvas, actualImageFolder);
        allureReporter.addAttachment('Canvas', fs.readFileSync(canvasImage), 'image/png');
        const chatPanel = await autoDashboard.getAutoDashboard();
        const chatPanelImage = await saveAutoDash2Result('AHIT-1666_07_ChatOutput.png', chatPanel, actualImageFolder);
        allureReporter.addAttachment('ChatOutput', fs.readFileSync(chatPanelImage), 'image/png');
        const contentPanel = await libraryAuthoringPage.getContentsPanel();
        const contentPanelImage = await saveAutoDash2Result('AHIT-1666_07_ContentPanel.png', contentPanel, actualImageFolder);
        allureReporter.addAttachment('ContentPanel', fs.readFileSync(contentPanelImage), 'image/png');

        infoLog('AI validation for generated page');
        const validationResult = await validateAutoDash2Page('Suggest a page', canvasImage);
        
        // Extract output from AI validation
        const alignMatch = validationResult.match(/Is the dashboard page aligned with the user prompt\?:\s*(Yes|No)/i);
        const reasonMatch = validationResult.match(/Reasoning:\s*([\s\S]*?)(?:Missing|$)/i);
        const missingMatch = validationResult.match(/Missing or Incorrect Elements \(if any\):\s*([\s\S]*)/i);

        const isAligned = alignMatch && alignMatch[1].toLowerCase() === 'yes';
        const reasoning = reasonMatch ? reasonMatch[1].trim() : 'N/A';
        const missingElements = missingMatch ? missingMatch[1].trim() : 'None';

        // Attach output to Allure report
        allureReporter.addStep(`✅ Is the dashboard page aligned with the user prompt: ${isAligned ? 'Yes' : 'No'}`);
        allureReporter.addStep(`💬 Reasoning: ${reasoning}`);
        allureReporter.addStep(`⚠️ Missing or Incorrect Elements: ${missingElements}`);

        // Pass or fail
        await since('Expected the generated page to align with the user prompt, but it did not.')
            .expect(isAligned)
            .toBe(true);
    });

});
