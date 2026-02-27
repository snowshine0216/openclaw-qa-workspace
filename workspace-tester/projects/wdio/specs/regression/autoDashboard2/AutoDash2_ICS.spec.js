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
describe('In-Canvas Selector for Auto Dashboard 2.0', () => {

    const AutoDash2Filter = {
        id: '850CC5550548DD2A3DC375B7D5F0A089',
        name: 'AutoDash2_Auto_Filter',
        projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
    };

    let { loginPage, dossierPage, libraryPage, libraryAuthoringPage, autoDashboard, baseContainer, inCanvasSelector_Authoring } = browsers.pageObj1;
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
            projectId: AutoDash2Filter.projectId,
            dossierId: AutoDash2Filter.id,
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
    const icsAttributePrompts = [
       { id: 'AHIT-1672_01', text: 'Create a Manager filter and name it as Manager_Filter'},
       { id: 'AHIT-1672_02', text: 'Select Employee Details Grid as its target'},
       { id: 'AHIT-1672_03', text: 'Change the Display Style of Manager_Filter to Drop-down'},
       { id: 'AHIT-1672_04', text: 'Add the visualization Retention Trend Over Time as target of Manager_Filter'},
       { id: 'AHIT-1672_05', text: 'Remove the visualization Employee Details Grid from target of Manager_Filter and add # of Employees as target of Manager_Filter'},
       { id: 'AHIT-1672_06', text: 'Rename Manager_Filter to ManagerFilter'},
       { id: 'AHIT-1672_07', text: 'Delete ManagerFilter'},
    ];

    it('AHIT-1672_Attribute In-Canvas Selector', async () => {
        for (const { id, text } of icsAttributePrompts) {
            infoLog(`Send command: ${text}`);
            await autoDashboard.sendPromptInAutoDash2(text);
            await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
            await autoDashboard.showErrorDetailsAndFail();

            if(id.includes('01')) {
                // { id: 'AHIT-1672_01', text: 'Create a Manager filter and name it as Manager_Filter'}
                await since('The selector named "Manager_Filter" should have Select Target button')
                .expect(await inCanvasSelector_Authoring.getSelectTargetButton('Manager_Filter').isExisting())
                .toBe(true);

                const canvas = await libraryAuthoringPage.getVizDoc();
                const canvasImage = await saveAutoDash2Result(`${id}_Canvas.png`, canvas, actualImageFolder);
                allureReporter.addAttachment('Canvas', fs.readFileSync(canvasImage), 'image/png');
                const chatPanel = await autoDashboard.getAutoDashboard();
                const chatPanelImage = await saveAutoDash2Result(`${id}_ChatOutput.png`, chatPanel, actualImageFolder);
                allureReporter.addAttachment('ChatOutput', fs.readFileSync(chatPanelImage), 'image/png');
            }

            if(id.includes('02')) {
                // { id: 'AHIT-1672_02', text: 'Select Employee Details Grid as its target'}
                await since('The selector named "Manager_Filter" should have style Search Box')
                    .expect(await inCanvasSelector_Authoring.getSearchBoxStyleSelectorByDisplayTitle('Manager_Filter').isExisting())
                    .toBe(true);
                await since('The selector named "Manager_Filter" should not have Select Target button')
                    .expect(await inCanvasSelector_Authoring.getSelectTargetButton('Manager_Filter').isExisting())
                    .toBe(false);

                const canvas = await libraryAuthoringPage.getVizDoc();
                let canvasImage = await saveAutoDash2Result(`${id}_01_Canvas.png`, canvas, actualImageFolder);
                allureReporter.addAttachment('Canvas', fs.readFileSync(canvasImage), 'image/png');
                const chatPanel = await autoDashboard.getAutoDashboard();
                let chatPanelImage = await saveAutoDash2Result(`${id}_01_ChatOutput.png`, chatPanel, actualImageFolder);
                allureReporter.addAttachment('ChatOutput', fs.readFileSync(chatPanelImage), 'image/png');

                await baseContainer.openContextMenu('Manager_Filter');
                await baseContainer.selectContextMenuOption('Edit Targets...');
                console.log(await selectTargetInLayersPanel.getTargetButtonImageURL("Employee Details Grid"));
                await since('The selector named "Manager_Filter" should have target "Employee Details Grid"')
                    .expect(await selectTargetInLayersPanel.getTargetButtonImageURL("Employee Details Grid"))
                    .toContain("target_selector.svg");
                console.log(await selectTargetInLayersPanel.getTargetButtonImageURL("Retention Trend Over Time"));
                await since('The selector named "Manager_Filter" should not have target "Retention Trend Over Time"')
                    .expect(await selectTargetInLayersPanel.getTargetButtonImageURL("Retention Trend Over Time"))
                    .not.toContain("target_selector.svg");

                canvasImage = await saveAutoDash2Result(`${id}_02_Canvas.png`, canvas, actualImageFolder);
                allureReporter.addAttachment('Canvas', fs.readFileSync(canvasImage), 'image/png');

                await inCanvasSelector_Authoring.cancelSelectTargetForSelector();
                chatPanelImage = await saveAutoDash2Result(`${id}_02_ChatOutput.png`, chatPanel, actualImageFolder);
                allureReporter.addAttachment('ChatOutput', fs.readFileSync(chatPanelImage), 'image/png');
            }

            if(id.includes('03')) {
                // { id: 'AHIT-1672_03', text: 'Change the Display Style of Manager_Filter to Drop-down'}
                await since('The selector named "Manager_Filter" should have style Drop-down')
                    .expect(await inCanvasSelector_Authoring.getDropDownStyleSelectorByDisplayTitle('Manager_Filter').isExisting())
                    .toBe(true);

                const canvas = await libraryAuthoringPage.getVizDoc();
                let canvasImage = await saveAutoDash2Result(`${id}_Canvas.png`, canvas, actualImageFolder);
                allureReporter.addAttachment('Canvas', fs.readFileSync(canvasImage), 'image/png');
                const chatPanel = await autoDashboard.getAutoDashboard();
                let chatPanelImage = await saveAutoDash2Result(`${id}_ChatOutput.png`, chatPanel, actualImageFolder);
                allureReporter.addAttachment('ChatOutput', fs.readFileSync(chatPanelImage), 'image/png');
            }

            if(id.includes('04')) {
                // { id: 'AHIT-1672_04', text: 'Add the visualization Retention Trend Over Time as target of Manager_Filter'}
                await baseContainer.openContextMenu('Manager_Filter');
                await baseContainer.selectContextMenuOption('Edit Targets...');
                console.log(await selectTargetInLayersPanel.getTargetButtonImageURL("Retention Trend Over Time"));
                await since('The selector named "Manager_Filter" should have target "Employee Details Grid"')
                    .expect(await selectTargetInLayersPanel.getTargetButtonImageURL("Employee Details Grid"))
                    .toContain("target_selector.svg");
                await since('The selector named "Manager_Filter" should have target "Retention Trend Over Time"')
                    .expect(await selectTargetInLayersPanel.getTargetButtonImageURL("Retention Trend Over Time"))
                    .toContain("target_selector.svg");

                const canvas = await libraryAuthoringPage.getVizDoc();
                const canvasImage = await saveAutoDash2Result(`${id}_Canvas.png`, canvas, actualImageFolder);
                allureReporter.addAttachment('Canvas', fs.readFileSync(canvasImage), 'image/png');

                await inCanvasSelector_Authoring.cancelSelectTargetForSelector();
                const chatPanel = await autoDashboard.getAutoDashboard();
                const chatPanelImage = await saveAutoDash2Result(`${id}_ChatOutput.png`, chatPanel, actualImageFolder);
                allureReporter.addAttachment('ChatOutput', fs.readFileSync(chatPanelImage), 'image/png');
            }

            if(id.includes('05')) {
                // { id: 'AHIT-1672_05', text: 'Remove the visualization Employee Details Grid from target of Manager_Filter and add # of Employees as target of Manager_Filter'}
                await baseContainer.openContextMenu('Manager_Filter');
                await baseContainer.selectContextMenuOption('Edit Targets...');
                console.log(await selectTargetInLayersPanel.getTargetButtonImageURL("Retention Trend Over Time"));
                await since('The selector named "Manager_Filter" should not have target "Employee Details Grid"')
                    .expect(await selectTargetInLayersPanel.getTargetButtonImageURL("Employee Details Grid"))
                    .not.toContain("target_selector.svg");
                await since('The selector named "Manager_Filter" should have target "Retention Trend Over Time"')
                    .expect(await selectTargetInLayersPanel.getTargetButtonImageURL("Retention Trend Over Time"))
                    .toContain("target_selector.svg");
                await since('The selector named "Manager_Filter" should have target "Employee Count KPI"')
                    .expect(await selectTargetInLayersPanel.getTargetButtonImageURL("Employee Count KPI"))
                    .toContain("target_selector.svg");

                const canvas = await libraryAuthoringPage.getVizDoc();
                const canvasImage = await saveAutoDash2Result(`${id}_Canvas.png`, canvas, actualImageFolder);
                allureReporter.addAttachment('Canvas', fs.readFileSync(canvasImage), 'image/png');

                await inCanvasSelector_Authoring.cancelSelectTargetForSelector();
                const chatPanel = await autoDashboard.getAutoDashboard();
                const chatPanelImage = await saveAutoDash2Result(`${id}_ChatOutput.png`, chatPanel, actualImageFolder);
                allureReporter.addAttachment('ChatOutput', fs.readFileSync(chatPanelImage), 'image/png');
            }

            if(id.includes('06')) {
                // { id: 'AHIT-1672_06', text: 'Rename Manager_Filter to ManagerFilter'}
                await since('The selector named "ManagerFilter" should exist')
                    .expect(await inCanvasSelector_Authoring.getElementOrValueFilterByDisplayTitle('ManagerFilter').isExisting())
                    .toBe(true);
                await since('The selector named "Manager_Filter" should not exist')
                    .expect(await inCanvasSelector_Authoring.getElementOrValueFilterByDisplayTitle('Manager_Filter').isExisting())
                    .toBe(false);

                const canvas = await libraryAuthoringPage.getVizDoc();
                const canvasImage = await saveAutoDash2Result(`${id}_Canvas.png`, canvas, actualImageFolder);
                allureReporter.addAttachment('Canvas', fs.readFileSync(canvasImage), 'image/png');
                const chatPanel = await autoDashboard.getAutoDashboard();
                const chatPanelImage = await saveAutoDash2Result(`${id}_ChatOutput.png`, chatPanel, actualImageFolder);
                allureReporter.addAttachment('ChatOutput', fs.readFileSync(chatPanelImage), 'image/png');
            }

            if(id.includes('07')) {
                // { id: 'AHIT-1672_07', text: 'Delete ManagerFilter'}
                await since('The selector named "ManagerFilter" should not exist')
                    .expect(await inCanvasSelector_Authoring.getElementOrValueFilterByDisplayTitle('ManagerFilter').isExisting())
                    .toBe(false);
                await since('The selector named "Manager_Filter" should not exist')
                    .expect(await inCanvasSelector_Authoring.getElementOrValueFilterByDisplayTitle('Manager_Filter').isExisting())
                    .toBe(false);

                const canvas = await libraryAuthoringPage.getVizDoc();
                const canvasImage = await saveAutoDash2Result(`${id}_Canvas.png`, canvas, actualImageFolder);
                allureReporter.addAttachment('Canvas', fs.readFileSync(canvasImage), 'image/png');
                const chatPanel = await autoDashboard.getAutoDashboard();
                const chatPanelImage = await saveAutoDash2Result(`${id}_ChatOutput.png`, chatPanel, actualImageFolder);
                allureReporter.addAttachment('ChatOutput', fs.readFileSync(chatPanelImage), 'image/png');
            }
        }
    })

    /**
     *  Test Steps
        Create metric filter
        Qualification type
        Targets
        Change targets
        Rename
        Delete
     */
    const icsMetricPrompts = [
        { id: 'AHIT-1673_01', text: 'Create a Customer Retention Rating filter'},
        { id: 'AHIT-1673_02', text: 'Select Employee Details Grid as its target'},
        { id: 'AHIT-1673_03', text: 'Change the Display Style of Customer Retention Rating Filter to Qualification'},
        { id: 'AHIT-1673_04', text: 'Add the visualization Retention Trend Over Time as target of Customer Retention Rating Filter'},
        { id: 'AHIT-1673_05', text: 'Remove the visualization Employee Details Grid from target of Customer Retention Rating Filter and add # of Employees as target of Customer Retention Rating ilter'},
        { id: 'AHIT-1673_06', text: 'Rename Customer Retention Rating Filter to CustomerRetentionRatingFilter'},
        { id: 'AHIT-1673_07', text: 'Delete CustomerRetentionRatingFilter'},
     ];
 
    it('AHIT-1673_Metric In-Canvas Selector', async () => {
        for (const { id, text } of icsMetricPrompts) {
            infoLog(`Send command: ${text}`);
            await autoDashboard.sendPromptInAutoDash2(text);
            await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
            await autoDashboard.showErrorDetailsAndFail();
 
            if(id.includes('01')) {
                // { id: 'AHIT-1673_01', text: 'Create a Customer Retention Rating filter'}
                await since('The selector named "Customer Retention Rating Filter" should have style Slider')
                    .expect(await inCanvasSelector_Authoring.getMetricSliderSelectorByDisplayTitle('Customer Retention Rating Filter').isExisting())
                    .toBe(true);
                /*await since('The selector named "Customer Retention Rating Filter" should have Select Target button')
                    .expect(await inCanvasSelector_Authoring.getSelectTargetButton('Customer Retention Rating Filter').isExisting())
                    .toBe(true);*/
 
                const canvas = await libraryAuthoringPage.getVizDoc();
                const canvasImage = await saveAutoDash2Result(`${id}_Canvas.png`, canvas, actualImageFolder);
                allureReporter.addAttachment('Canvas', fs.readFileSync(canvasImage), 'image/png');
                const chatPanel = await autoDashboard.getAutoDashboard();
                const chatPanelImage = await saveAutoDash2Result(`${id}_ChatOutput.png`, chatPanel, actualImageFolder);
                allureReporter.addAttachment('ChatOutput', fs.readFileSync(chatPanelImage), 'image/png');
            }

            if(id.includes('02')) {
                // { id: 'AHIT-1673_02', text: 'Select Employee Details Grid as its target'}
                await since('The selector named "Customer Retention Rating Filter" should not have style Qualification')
                    .expect(await inCanvasSelector_Authoring.getQualificationSelectorByDisplayTitle('Customer Retention Rating Filter').isExisting())
                    .toBe(false);
                await since('The selector named "Customer Retention Rating Filter" should have style Slider')
                    .expect(await inCanvasSelector_Authoring.getMetricSliderSelectorByDisplayTitle('Customer Retention Rating Filter').isExisting())
                    .toBe(true);
                await since('The selector named "Customer Retention Rating Filter" should not have Select Target button')
                    .expect(await inCanvasSelector_Authoring.getSelectTargetButton('Customer Retention Rating Filter').isExisting())
                    .toBe(false);

                const canvas = await libraryAuthoringPage.getVizDoc();
                let canvasImage = await saveAutoDash2Result(`${id}_01_Canvas.png`, canvas, actualImageFolder);
                allureReporter.addAttachment('Canvas', fs.readFileSync(canvasImage), 'image/png');
                const chatPanel = await autoDashboard.getAutoDashboard();
                let chatPanelImage = await saveAutoDash2Result(`${id}_01_ChatOutput.png`, chatPanel, actualImageFolder);
                allureReporter.addAttachment('ChatOutput', fs.readFileSync(chatPanelImage), 'image/png');

                await baseContainer.openContextMenu('Customer Retention Rating Filter');
                await baseContainer.selectContextMenuOption('Edit Targets...');
                console.log(await selectTargetInLayersPanel.getTargetButtonImageURL("Employee Details Grid"));
                await since('The selector named "Customer Retention Rating Filter" should have target "Employee Details Grid"')
                    .expect(await selectTargetInLayersPanel.getTargetButtonImageURL("Employee Details Grid"))
                    .toContain("target_selector.svg");
                console.log(await selectTargetInLayersPanel.getTargetButtonImageURL("Retention Trend Over Time"));
                await since('The selector named "Customer Retention Rating Filter" should not have target "Retention Trend Over Time"')
                    .expect(await selectTargetInLayersPanel.getTargetButtonImageURL("Retention Trend Over Time"))
                    .not.toContain("target_selector.svg");

                canvasImage = await saveAutoDash2Result(`${id}_02_Canvas.png`, canvas, actualImageFolder);
                allureReporter.addAttachment('Canvas', fs.readFileSync(canvasImage), 'image/png');

                await inCanvasSelector_Authoring.cancelSelectTargetForSelector();
                chatPanelImage = await saveAutoDash2Result(`${id}_02_ChatOutput.png`, chatPanel, actualImageFolder);
                allureReporter.addAttachment('ChatOutput', fs.readFileSync(chatPanelImage), 'image/png');
            }

            if(id.includes('03')) {
                // { id: 'AHIT-1673_03', text: 'Change the Display Style of Customer Retention Rating Filter to Qualification'}
                await since('The selector named "Customer Retention Rating Filter" should have style Qualification')
                    .expect(await inCanvasSelector_Authoring.getQualificationSelectorByDisplayTitle('Customer Retention Rating Filter').isExisting())
                    .toBe(true);

                const canvas = await libraryAuthoringPage.getVizDoc();
                let canvasImage = await saveAutoDash2Result(`${id}_Canvas.png`, canvas, actualImageFolder);
                allureReporter.addAttachment('Canvas', fs.readFileSync(canvasImage), 'image/png');
                const chatPanel = await autoDashboard.getAutoDashboard();
                let chatPanelImage = await saveAutoDash2Result(`${id}_ChatOutput.png`, chatPanel, actualImageFolder);
                allureReporter.addAttachment('ChatOutput', fs.readFileSync(chatPanelImage), 'image/png');
            }

            if(id.includes('04')) {
                // { id: 'AHIT-1673_04', text: 'Add the visualization Retention Trend Over Time as target of Customer Retention Rating Filter'}
                await baseContainer.openContextMenu('Customer Retention Rating Filter');
                await baseContainer.selectContextMenuOption('Edit Targets...');
                console.log(await selectTargetInLayersPanel.getTargetButtonImageURL("Retention Trend Over Time"));
                await since('The selector named "Customer Retention Rating Filter" should have target "Employee Details Grid"')
                    .expect(await selectTargetInLayersPanel.getTargetButtonImageURL("Employee Details Grid"))
                    .toContain("target_selector.svg");
                await since('The selector named "Customer Retention Rating Filter" should have target "Retention Trend Over Time"')
                    .expect(await selectTargetInLayersPanel.getTargetButtonImageURL("Retention Trend Over Time"))
                    .toContain("target_selector.svg");

                const canvas = await libraryAuthoringPage.getVizDoc();
                const canvasImage = await saveAutoDash2Result(`${id}_Canvas.png`, canvas, actualImageFolder);
                allureReporter.addAttachment('Canvas', fs.readFileSync(canvasImage), 'image/png');

                await inCanvasSelector_Authoring.cancelSelectTargetForSelector();
                const chatPanel = await autoDashboard.getAutoDashboard();
                const chatPanelImage = await saveAutoDash2Result(`${id}_ChatOutput.png`, chatPanel, actualImageFolder);
                allureReporter.addAttachment('ChatOutput', fs.readFileSync(chatPanelImage), 'image/png');
            }

            if(id.includes('05')) {
                // { id: 'AHIT-1673_05', text: 'Remove the visualization Employee Details Grid from target of Customer Retention Rating Filter and add # of Employees as target of Customer Retention Rating_Filter''}
                await baseContainer.openContextMenu('Customer Retention Rating Filter');
                await baseContainer.selectContextMenuOption('Edit Targets...');
                console.log(await selectTargetInLayersPanel.getTargetButtonImageURL("Retention Trend Over Time"));
                await since('The selector named "Customer Retention Rating Filter" should not have target "Employee Details Grid"')
                    .expect(await selectTargetInLayersPanel.getTargetButtonImageURL("Employee Details Grid"))
                    .not.toContain("target_selector.svg");
                await since('The selector named "Customer Retention Rating Filter" should have target "Retention Trend Over Time"')
                    .expect(await selectTargetInLayersPanel.getTargetButtonImageURL("Retention Trend Over Time"))
                    .toContain("target_selector.svg");
                await since('The selector named "Customer Retention Rating Filter" should have target "Employee Count KPI"')
                    .expect(await selectTargetInLayersPanel.getTargetButtonImageURL("Employee Count KPI"))
                    .toContain("target_selector.svg");

                const canvas = await libraryAuthoringPage.getVizDoc();
                const canvasImage = await saveAutoDash2Result(`${id}_Canvas.png`, canvas, actualImageFolder);
                allureReporter.addAttachment('Canvas', fs.readFileSync(canvasImage), 'image/png');

                await inCanvasSelector_Authoring.cancelSelectTargetForSelector();
                const chatPanel = await autoDashboard.getAutoDashboard();
                const chatPanelImage = await saveAutoDash2Result(`${id}_ChatOutput.png`, chatPanel, actualImageFolder);
                allureReporter.addAttachment('ChatOutput', fs.readFileSync(chatPanelImage), 'image/png');
            }

            if(id.includes('06')) {
                // { id: 'AHIT-1673_06', text: 'Rename Customer Retention Rating Filter to CustomerRetentionRatingFilter'}
                await since('The selector named "CustomerRetentionRatingFilter" should exist')
                    .expect(await inCanvasSelector_Authoring.getElementOrValueFilterByDisplayTitle('CustomerRetentionRatingFilter').isExisting())
                    .toBe(true);
                await since('The selector named "Rename Customer Retention Rating Filter" should not exist')
                    .expect(await inCanvasSelector_Authoring.getElementOrValueFilterByDisplayTitle('Rename Customer Retention Rating Filter').isExisting())
                    .toBe(false);

                const canvas = await libraryAuthoringPage.getVizDoc();
                const canvasImage = await saveAutoDash2Result(`${id}_Canvas.png`, canvas, actualImageFolder);
                allureReporter.addAttachment('Canvas', fs.readFileSync(canvasImage), 'image/png');
                const chatPanel = await autoDashboard.getAutoDashboard();
                const chatPanelImage = await saveAutoDash2Result(`${id}_ChatOutput.png`, chatPanel, actualImageFolder);
                allureReporter.addAttachment('ChatOutput', fs.readFileSync(chatPanelImage), 'image/png');
            }

             if(id.includes('07')) {
                // { id: 'AHIT-1673_07', text: 'Delete CustomerRetentionRatingFilter'}
                await since('The selector named "CustomerRetentionRatingFilter" should not exist')
                    .expect(await inCanvasSelector_Authoring.getElementOrValueFilterByDisplayTitle('CustomerRetentionRatingFilter').isExisting())
                    .toBe(false);
                await since('The selector named "Rename Customer Retention Rating Filter" should not exist')
                    .expect(await inCanvasSelector_Authoring.getElementOrValueFilterByDisplayTitle('Rename Customer Retention Rating Filter').isExisting())
                    .toBe(false);

                const canvas = await libraryAuthoringPage.getVizDoc();
                const canvasImage = await saveAutoDash2Result(`${id}_Canvas.png`, canvas, actualImageFolder);
                allureReporter.addAttachment('Canvas', fs.readFileSync(canvasImage), 'image/png');
                const chatPanel = await autoDashboard.getAutoDashboard();
                const chatPanelImage = await saveAutoDash2Result(`${id}_ChatOutput.png`, chatPanel, actualImageFolder);
                allureReporter.addAttachment('ChatOutput', fs.readFileSync(chatPanelImage), 'image/png');
            }
        }
    })
});

