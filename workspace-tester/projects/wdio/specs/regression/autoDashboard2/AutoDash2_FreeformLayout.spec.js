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
import { SelectTargetInLayersPanel } from '../../../pageObjects/authoring/SelectTargetInLayersPanel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const actualImageFolder = path.resolve(__dirname, '../../../autodash/ICS');

// npm run regression -- --spec=specs/regression/autoDashboard2/AutoDash2_ICS.spec.js --baseUrl=https://tec-l-1280162.labs.microstrategy.com/MicroStrategyLibrary/
describe('Freeform layout for Auto Dashboard 2.0', () => {

    const AutoDash2FreeformLayout = {
        id: '4D5AE3D4E546A0BACE5A1CAF6695FC4B',
        name: 'AutoDash2_FreeformLayout',
        projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
    };

    let { loginPage, dossierPage, libraryPage, libraryAuthoringPage, autoDashboard, baseContainer, inCanvasSelector_Authoring, toolbar } = browsers.pageObj1;
    const selectTargetInLayersPanel = new SelectTargetInLayersPanel();

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
            projectId: AutoDash2FreeformLayout.projectId,
            dossierId: AutoDash2FreeformLayout.id,
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

    /**
     *  Test Steps
        Create attribute filter
        Display Style
        Targets
        Delete
        Rename
        Change targets
     */
    const lockPageSizePrompts = [
       { id: 'AHIT-1964_01', text: 'suggest a page'},
       { id: 'AHIT-1964_02', text: 'suggest another page'},
       /*{ id: 'AHIT-1964_03', text: 'Change the Display Style of Manager_Filter to Drop-down'},
       { id: 'AHIT-1964_04', text: 'Add the visualization Retention Trend Over Time as target of Manager_Filter'},
       { id: 'AHIT-1964_05', text: 'Remove the visualization Employee Details Grid from target of Manager_Filter and add # of Employees as target of Manager_Filter'},
       { id: 'AHIT-1964_06', text: 'Rename Manager_Filter to ManagerFilter'},
       { id: 'AHIT-1964_07', text: 'Delete ManagerFilter'},*/
    ];

    it('AHIT-1964_01 Lock Page Size without accepting the lock page size recommendation', async () => {
        for (const { id, text } of lockPageSizePrompts) {
            infoLog(`Send command: ${text}`);
            await autoDashboard.sendPromptInAutoDash2(text);
            await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(300);
            await autoDashboard.showErrorDetailsAndFail();

            if(id.includes('01')) {
                infoLog('Verify the locking page size string and Apply Now button');
                const lockPageSizeHint = await autoDashboard.getLastSummaryText();
                console.log(lockPageSizeHint);
                await since('"We recommend locking the page size to 16:9 (1920x1080) with Fit to View for optimal display across different screens. Would you like to apply this setting?" should display')
                    .expect(/We recommend locking the page size to 16:9 \(1920x1080\) with Fit to View for optimal display across different screens\. Would you like to apply this setting\?/i.test(lockPageSizeHint))
                    .toBe(true);
                await since('"Apply Now" should display')
                    .expect(/Apply Now/i.test(lockPageSizeHint))
                    .toBe(true);
                await since('"Page Size" button should display in tool bar')
                    .expect(await toolbar.getButtonFromToolbar("Page Size").isExisting())
                    .toBe(true);
                await since('"Fit to View" button should not display in tool bar')
                    .expect(await toolbar.getButtonFromToolbar("Fit to View").isExisting())
                    .toBe(false);
                const canvas = await libraryAuthoringPage.getVizDoc();
                const canvasImage = await saveAutoDash2Result(`01_${id}_Canvas.png`, canvas, actualImageFolder);
                allureReporter.addAttachment('Canvas', fs.readFileSync(canvasImage), 'image/png');
                const chatPanel = await autoDashboard.getAutoDashboard();
                const chatPanelImage = await saveAutoDash2Result(`01_${id}_ChatOutput.png`, chatPanel, actualImageFolder);
                allureReporter.addAttachment('ChatOutput', fs.readFileSync(chatPanelImage), 'image/png');
                const toolBar = await toolbar.getToolbar();
                const toolBarImage = await saveAutoDash2Result(`01_${id}_ToolbarOutput.png`, toolBar, actualImageFolder);
                allureReporter.addAttachment('ToolbarOutput', fs.readFileSync(toolBarImage), 'image/png');
            }

            if(id.includes('02')) {
                infoLog('Verify the locking page size string and Apply Now button');
                const lockPageSizeHint = await autoDashboard.getLastSummaryText();
                console.log(lockPageSizeHint);
                await since('"We recommend locking the page size to 16:9 (1920x1080) with Fit to View for optimal display across different screens. Would you like to apply this setting?" should display')
                    .expect(/We recommend locking the page size to 16:9 \(1920x1080\) with Fit to View for optimal display across different screens\. Would you like to apply this setting\?/i.test(lockPageSizeHint))
                    .toBe(false);
                await since('"Apply Now" should display')
                    .expect(/Apply Now/i.test(lockPageSizeHint))
                    .toBe(false);
                await since('"Page Size" button should display in tool bar')
                    .expect(await toolbar.getButtonFromToolbar("Page Size").isExisting())
                    .toBe(true);
                await since('"Fit to View" button should not display in tool bar')
                    .expect(await toolbar.getButtonFromToolbar("Fit to View").isExisting())
                    .toBe(false);  
                const canvas = await libraryAuthoringPage.getVizDoc();
                const canvasImage = await saveAutoDash2Result(`01_${id}_Canvas.png`, canvas, actualImageFolder);
                allureReporter.addAttachment('Canvas', fs.readFileSync(canvasImage), 'image/png');
                const chatPanel = await autoDashboard.getAutoDashboard();
                const chatPanelImage = await saveAutoDash2Result(`01_${id}_ChatOutput.png`, chatPanel, actualImageFolder);
                allureReporter.addAttachment('ChatOutput', fs.readFileSync(chatPanelImage), 'image/png');
                const toolBar = await toolbar.getToolbar();
                const toolBarImage = await saveAutoDash2Result(`01_${id}_ToolbarOutput.png`, toolBar, actualImageFolder);
                allureReporter.addAttachment('ToolbarOutput', fs.readFileSync(toolBarImage), 'image/png');
            }
        }
    });

    it('AHIT-1964_02 Lock Page Size with accepting the lock page size recommendation', async () => {
        for (const { id, text } of lockPageSizePrompts) {
            infoLog(`Send command: ${text}`);
            await autoDashboard.sendPromptInAutoDash2(text);
            await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(300);
            await autoDashboard.showErrorDetailsAndFail();

            if(id.includes('01')) {
                infoLog('Verify the locking page size string and Apply Now button');
                const lockPageSizeHint = await autoDashboard.getLastSummaryText();
                console.log(lockPageSizeHint);
                await since('"We recommend locking the page size to 16:9 (1920x1080) with Fit to View for optimal display across different screens. Would you like to apply this setting?" should display')
                    .expect(/We recommend locking the page size to 16:9 \(1920x1080\) with Fit to View for optimal display across different screens\. Would you like to apply this setting\?/i.test(lockPageSizeHint))
                    .toBe(true);
                await since('"Apply Now" should display')
                    .expect(/Apply Now/i.test(lockPageSizeHint))
                    .toBe(true);
                await since('"Page Size" button should display in tool bar')
                    .expect(await toolbar.getButtonFromToolbar("Page Size").isExisting())
                    .toBe(true);
                await since('"Fit to View" button should not display in tool bar')
                    .expect(await toolbar.getButtonFromToolbar("Fit to View").isExisting())
                    .toBe(false);
                const canvas = await libraryAuthoringPage.getVizDoc();
                const canvasImage = await saveAutoDash2Result(`02_${id}_Canvas.png`, canvas, actualImageFolder);
                allureReporter.addAttachment('Canvas', fs.readFileSync(canvasImage), 'image/png');
                const chatPanel = await autoDashboard.getAutoDashboard();
                const chatPanelImage = await saveAutoDash2Result(`02_${id}_ChatOutput.png`, chatPanel, actualImageFolder);
                allureReporter.addAttachment('ChatOutput', fs.readFileSync(chatPanelImage), 'image/png');
                const toolBar = await toolbar.getToolbar();
                const toolBarImage = await saveAutoDash2Result(`02_${id}_ToolbarOutput.png`, toolBar, actualImageFolder);
                allureReporter.addAttachment('ToolbarOutput', fs.readFileSync(toolBarImage), 'image/png');

                // Click Apply Now button
                await autoDashboard.clickLockPageSizeApplyNowButton();
                await since('"Page Size" button should display in tool bar')
                    .expect(await toolbar.getButtonFromToolbar("Page Size").isExisting())
                    .toBe(true);
                await since('"Fit to View" button should display in tool bar')
                    .expect(await toolbar.getButtonFromToolbar("Fit to View").isExisting())
                    .toBe(true);
            }

            if(id.includes('02')) {
                infoLog('Verify the locking page size string and Apply Now button');
                const lockPageSizeHint = await autoDashboard.getLastSummaryText();
                console.log(lockPageSizeHint);
                await since('"We recommend locking the page size to 16:9 (1920x1080) with Fit to View for optimal display across different screens. Would you like to apply this setting?" should display')
                    .expect(/We recommend locking the page size to 16:9 \(1920x1080\) with Fit to View for optimal display across different screens\. Would you like to apply this setting\?/i.test(lockPageSizeHint))
                    .toBe(false);
                await since('"Apply Now" should display')
                    .expect(/Apply Now/i.test(lockPageSizeHint))
                    .toBe(false);
                await since('"Page Size" button should display in tool bar')
                    .expect(await toolbar.getButtonFromToolbar("Page Size").isExisting())
                    .toBe(true);
                await since('"Fit to View" button should display in tool bar')
                    .expect(await toolbar.getButtonFromToolbar("Fit to View").isExisting())
                    .toBe(true);  
                const canvas = await libraryAuthoringPage.getVizDoc();
                const canvasImage = await saveAutoDash2Result(`02_${id}_Canvas.png`, canvas, actualImageFolder);
                allureReporter.addAttachment('Canvas', fs.readFileSync(canvasImage), 'image/png');
                const chatPanel = await autoDashboard.getAutoDashboard();
                const chatPanelImage = await saveAutoDash2Result(`02_${id}_ChatOutput.png`, chatPanel, actualImageFolder);
                allureReporter.addAttachment('ChatOutput', fs.readFileSync(chatPanelImage), 'image/png');
                const toolBar = await toolbar.getToolbar();
                const toolBarImage = await saveAutoDash2Result(`02_${id}_ToolbarOutput.png`, toolBar, actualImageFolder);
                allureReporter.addAttachment('ToolbarOutput', fs.readFileSync(toolBarImage), 'image/png');
            }
        }
    });
});