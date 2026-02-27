import { browserWindow } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { fileURLToPath } from 'url';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import allureReporter from '@wdio/allure-reporter';
import fs from 'fs';
import path from 'path';
import * as bot from '../../../constants/bot2.js';
import { infoLog } from '../../../config/consoleFormat.js';
import { saveElementScreenshotLocal, cleanFileInFolder, takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const actualImageFolder = path.resolve(__dirname, '../../../autodash/Theme');

// npm run regression -- --spec=specs/regression/autoDashboard2/AutoDash2_Theme_Palette.spec.js --baseUrl=https://tec-l-1280162.labs.microstrategy.com/MicroStrategyLibrary/
describe('Theme and palette related workflow for Auto Dashboard 2.0', () => {

    const AutoDash2 = {
        id: 'E1E88174DE407C1FB18D82854472B11A',
        name: 'AutoDash2_Auto',
        projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
    };

    let { loginPage, dossierPage, libraryPage, libraryAuthoringPage, autoDashboard, contentsPanel } = browsers.pageObj1;

    async function saveAutoDash2Result(caseName, element, actualImageFolder) {
        const imagePath = path.resolve(actualImageFolder, caseName);
        await saveElementScreenshotLocal(element, imagePath);
        return imagePath;
    }

    beforeAll(async () => {
        await setWindowSize(browserWindow);
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

    it('AHIT-1671_01_Change theme', async () => {
        infoLog('Send command "change to Classic Theme"');
        await autoDashboard.sendPromptInAutoDash2(
            'change to Classic Theme'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showErrorDetailsAndFail();
        await takeScreenshotByElement(libraryAuthoringPage.getVizDoc(),'AHIT-1671_01_1','Change to Classic Theme');

        infoLog('Send command "use Default Theme"');
        await autoDashboard.sendPromptInAutoDash2(
            'use Default Theme'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showErrorDetailsAndFail();
        await takeScreenshotByElement(libraryAuthoringPage.getVizDoc(),'AHIT-1671_01_2','use Default Theme');

        infoLog('Send command "change to use Strategy Theme"');
        await autoDashboard.sendPromptInAutoDash2(
            'change to use Strategy Theme'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showErrorDetailsAndFail();
        await takeScreenshotByElement(libraryAuthoringPage.getVizDoc(),'AHIT-1671_01_3','change to use Strategy Theme');

        infoLog('Send command "change the theme to Classic"');
        await autoDashboard.sendPromptInAutoDash2(
            'change the theme to Classic'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showErrorDetailsAndFail();
        await takeScreenshotByElement(libraryAuthoringPage.getVizDoc(),'AHIT-1671_01_4','change the theme to Classic');

        infoLog('Take chat panel screenshot and attach to allure');
        const chatPanel = await autoDashboard.getAutoDashboard();
        const chatPanelImage = await saveAutoDash2Result('AHIT-1671_01_ChatOutput.png', chatPanel, actualImageFolder);
        allureReporter.addAttachment('ChatOutput', fs.readFileSync(chatPanelImage), 'image/png');
    });

    it('AHIT-1671_02_Change palette', async () => {
        infoLog('Send command "change to Harmony palette"');
        await autoDashboard.sendPromptInAutoDash2(
            'change to Harmony palette'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showErrorDetailsAndFail();
        await takeScreenshotByElement(libraryAuthoringPage.getVizDoc(),'AHIT-1671_02_1','change to Harmony palette');

        infoLog('Verify second page, bar chart and heatmap color should be unchanged');
        // bar chart fill color is manully set, heatmap: metric on color by
        await contentsPanel.goToPage({ chapterName: 'Employee Commuting Impact on Sales & Retention', pageName: 'Commuting Method Overview' });
        await takeScreenshotByElement(libraryAuthoringPage.getVizDoc(),'AHIT-1671_01_2','some Viz color should be unchanged');

        infoLog('Send command "change the palette to Arctic"');
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await autoDashboard.sendPromptInAutoDash2(
            'change the palette to Arctic'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showErrorDetailsAndFail();
        await takeScreenshotByElement(libraryAuthoringPage.getVizDoc(),'AHIT-1671_01_3','change the palette to Arctic');

        infoLog('Send command "use rustic palette"');
        await autoDashboard.sendPromptInAutoDash2(
            'use rustic palette'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showErrorDetailsAndFail();
        await takeScreenshotByElement(libraryAuthoringPage.getVizDoc(),'AHIT-1671_01_4','use rustic palette');

        infoLog('Take chat panel screenshot and attach to allure');
        const chatPanel = await autoDashboard.getAutoDashboard();
        const chatPanelImage = await saveAutoDash2Result('AHIT-1671_02_ChatOutput.png', chatPanel, actualImageFolder);
        allureReporter.addAttachment('ChatOutput', fs.readFileSync(chatPanelImage), 'image/png');
    });

    it('AHIT-1671_03_Change theme and palette together', async () => {
        infoLog('Send command "change to classic theme, use Harmony palette"');
        await autoDashboard.sendPromptInAutoDash2(
            'change to classic theme, use Harmony palette'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showErrorDetailsAndFail();
        await takeScreenshotByElement(libraryAuthoringPage.getVizDoc(),'AHIT-1671_03','change to classic theme, use Harmony palette');

        infoLog('Take chat panel screenshot and attach to allure');
        const canvas = await libraryAuthoringPage.getVizDoc();
        const canvasImage = await saveAutoDash2Result('AHIT-1666_03_Canvas.png', canvas, actualImageFolder);
        allureReporter.addAttachment('Canvas', fs.readFileSync(canvasImage), 'image/png');
        const chatPanel = await autoDashboard.getAutoDashboard();
        const chatPanelImage = await saveAutoDash2Result('AHIT-1671_03_ChatOutput.png', chatPanel, actualImageFolder);
        allureReporter.addAttachment('ChatOutput', fs.readFileSync(chatPanelImage), 'image/png');

    });

    it('AHIT-1671_04_Unsupported theme and palette', async () => {
        infoLog('Send command "change to Dark Theme"');
        await autoDashboard.sendPromptInAutoDash2(
            'change to Dark Theme'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showErrorDetailsAndFail();

        infoLog('Verify the theme doesn not exist');
        let lastAnswerText = await autoDashboard.getAutoDash2LatestAnswerText();
        await since('This theme action is not supported in auto dash')
            .expect(
                /unsupported|not\s+supported|couldn't|could not/i.test(lastAnswerText || '')
            )
            .toBe(true);

        infoLog('Send command "use ABC palette"');
        await autoDashboard.sendPromptInAutoDash2(
            'use ABC palette'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showErrorDetailsAndFail();

        infoLog('Verify the palette doesn not exist');
        lastAnswerText = await autoDashboard.getAutoDash2LatestAnswerText();
        await since('This theme action is not supported in auto dash')
            .expect(
                /unsupported|not\s+supported|couldn't|could not/i.test(lastAnswerText || '')
            )
            .toBe(true);

        infoLog('Take chat panel screenshot and attach to allure');
        const chatPanel = await autoDashboard.getAutoDashboard();
        const chatPanelImage = await saveAutoDash2Result('AHIT-1671_04_ChatOutput.png', chatPanel, actualImageFolder);
        allureReporter.addAttachment('ChatOutput', fs.readFileSync(chatPanelImage), 'image/png');
    });

});
