import { autoDashBrowserWindow } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { fileURLToPath } from 'url';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import allureReporter from '@wdio/allure-reporter';
import fs from 'fs';
import path from 'path';
import * as bot from '../../../constants/bot2.js';
import { infoLog } from '../../../config/consoleFormat.js';
import { saveElementScreenshotLocal, cleanFileInFolder } from '../../../utils/TakeScreenshot.js';
import { validateImageUploadPageLayoutAndVizType, validateImageUploadVizColor } from '../../../utils/openAI_autoDash2validation.js';
import { AUTO_DASH_IMAGE_DIR } from '../../../pageObjects/dossierEditor/AutoDashboard.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const actualImageFolder = path.resolve(__dirname, '../../../autodash/PageByImageUpload');

// npm run regression -- --spec=specs/regression/autoDashboard2/AutoDash2_PageByImageUpload.spec.js --baseUrl=https://tec-l-1280162.labs.microstrategy.com/MicroStrategyLibrary/
describe('Create a page by uploading image for Auto Dashboard 2.0', () => {

    const AutoDash2 = {
        id: 'E1E88174DE407C1FB18D82854472B11A',
        name: 'AutoDash2_Auto',
        projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
    };


    let { loginPage, dossierPage, libraryPage, libraryAuthoringPage, autoDashboard, dossierAuthoringPage } = browsers.pageObj1;

    async function saveAutoDash2Result(caseName, element, actualImageFolder) {
        const imagePath = path.resolve(actualImageFolder, caseName);
        await saveElementScreenshotLocal(element, imagePath);
        return imagePath;
    }

    async function captureAndAttachScreenshotsToAllure(caseId, actualImageFolder, suffix = '') {
        const chatPanel = await autoDashboard.getAutoDashboard();
        const chatPanelImage = await saveAutoDash2Result(`${caseId}${suffix}_ChatOutput.png`, chatPanel, actualImageFolder);
        allureReporter.addAttachment(`ChatOutput${suffix}`, fs.readFileSync(chatPanelImage), 'image/png');
    }

    async function verifyVizTypeAndLayout(caseId, originalImagePath) {
        const canvas = await libraryAuthoringPage.getVizDoc();
        const generatedPageImagePath = await saveAutoDash2Result(
            `${caseId}_GeneratedPage.png`,
            canvas,
            actualImageFolder
        );

        allureReporter.addAttachment(
            `${caseId}_OriginalImage`,
            fs.readFileSync(originalImagePath),
            'image/png'
        );
        allureReporter.addAttachment(
            `${caseId}_GeneratedPage`,
            fs.readFileSync(generatedPageImagePath),
            'image/png'
        );

        const result = await validateImageUploadPageLayoutAndVizType(
            originalImagePath,
            generatedPageImagePath
        );

        allureReporter.addAttachment(
            `${caseId}_VizTypeAndLayout_AIvalidation`,
            result,
            'text/plain'
        );

        expect(result).toContain('Result: PASS');
        return result;
    }

    async function verifyVizColor(caseId, originalImagePath) {
        const canvas = await libraryAuthoringPage.getVizDoc();
        const generatedPageImagePath = await saveAutoDash2Result(
            `${caseId}_GeneratedPage.png`,
            canvas,
            actualImageFolder
        );

        const result = await validateImageUploadVizColor(
            originalImagePath,
            generatedPageImagePath
        );

        allureReporter.addAttachment(
            `${caseId}_VizColor_AIvalidation`,
            result,
            'text/plain'
        );

        expect(result).toContain('Result: PASS');
        return result;
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

    const imageUploadCases = [
        {
            caseId: 'AHIT-1670_01',
            imageName: 'AHIT-1670_01.png',
            description: 'KPI, line, grid',
            expectCustomPalette: true
        },
        {
            caseId: 'AHIT-1670_02',
            imageName: 'AHIT-1670_02.jpg',
            description: 'KPI, donut, bar, bubble',
            expectCustomPalette: true
        },
        {
            caseId: 'AHIT-1670_03',
            imageName: 'AHIT-1670_03.jpeg',
            description: 'KPI, donut, bar, map, area',
            expectCustomPalette: true
        },
        // {
        //     caseId: 'AHIT-1670_04',
        //     imageName: 'AHIT-1670_04.png',
        //     description: 'stacked KPI, gauge, map, grid',
        //     expectCustomPalette: true
        // },
        {
            caseId: 'AHIT-1670_05',
            imageName: 'AHIT-1670_05.jpg',
            description: 'hand-drawn: KPI, grid, bar, pie',
            expectCustomPalette: false
        },
        {
            caseId: 'AHIT-1670_06',
            imageName: 'AHIT-1670_06.png',
            description: 'hand-drawn: bar, line, scatter, KPI, pie',
            expectCustomPalette: false
        },
    ];

    for (const {
        caseId,
        imageName,
        description,
        expectCustomPalette
    } of imageUploadCases) {

        it(`${caseId}_Upload image - ${description}`, async () => {

            infoLog(`[${caseId}] verify no Custom Palettes before upload`);
            await dossierAuthoringPage.actionOnMenubar('Format');
            await since('The submenu should Not have "Custom Palettes"')
                .expect(await dossierAuthoringPage.getSubOptionFromMenubar('Custom Palettes').isExisting())
                .toBe(false);
            await dossierAuthoringPage.actionOnMenubar('Format');
            
            infoLog(`[${caseId}] upload image in auto dash chat panel`);
            await autoDashboard.uploadAutoDashImage(imageName);
            await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
            await autoDashboard.showErrorDetailsAndFail();

            infoLog(`[${caseId}] verify Custom Palettes behavior after upload`);
            await dossierAuthoringPage.actionOnMenubar('Format');
            if (expectCustomPalette) {
                await since('The submenu should have "Custom Palettes"')
                    .expect(await dossierAuthoringPage.getSubOptionFromMenubar('Custom Palettes').isExisting())
                    .toBe(true);
            } else {
                // hand-drawn image should never create custom palettes
                await since('The submenu should NOT have "Custom Palettes"')
                    .expect(await dossierAuthoringPage.getSubOptionFromMenubar('Custom Palettes').isExisting())
                    .toBe(false);
            }
            await dossierAuthoringPage.actionOnMenubar('Format');
        
            infoLog(`[${caseId}] verify visualization type & layout`);
            const originalImagePath = path.resolve(
                AUTO_DASH_IMAGE_DIR, 
                imageName
            );

            const vizTypeLayoutResult = await verifyVizTypeAndLayout(caseId, originalImagePath);
            const vizTypeLayoutStatus = vizTypeLayoutResult.includes('Result: PASS') ? 'PASS' : 'FAIL';
            allureReporter.step(
                `VizType & Layout Validation: ${vizTypeLayoutStatus === 'PASS' ? '✅ PASS' : '❌ FAIL'}`,
                () => {}
            );

            infoLog(`[${caseId}] verify visualization colors`);
            if (expectCustomPalette) {
                const vizColorResult = await verifyVizColor(caseId, originalImagePath);
                const vizColorStatus = vizColorResult.includes('Result: PASS') ? 'PASS' : 'FAIL';

                allureReporter.step(
                    `VizColor Validation: ${vizColorStatus === 'PASS' ? '✅ PASS' : '❌ FAIL'}`,
                    () => {}
                );
            } else {
            // hand-drawn image no need to verify colors, no baseline
                allureReporter.step(
                    'VizColor Validation: ⏭️ SKIPPED (hand-drawn image)',
                    () => {}
                );
            }

            infoLog(`[${caseId}] take screenshots and attach to allure`);
            await captureAndAttachScreenshotsToAllure(caseId, actualImageFolder);
        });
    }

});
