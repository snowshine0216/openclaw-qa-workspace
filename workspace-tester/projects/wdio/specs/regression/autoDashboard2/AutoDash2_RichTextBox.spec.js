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
const actualImageFolder = path.resolve(__dirname, '../../../autodash/FieldBox');

// npm run regression -- --spec=specs/regression/autoDashboard2/AutoDash2_RichTextBox.spec.js --baseUrl=https://tec-l-1280162.labs.microstrategy.com/MicroStrategyLibrary/
describe('Rich Text Box workflow for Auto Dashboard 2.0', () => {

    const AutoDash2FreeformLayout = {
        id: '4D5AE3D4E546A0BACE5A1CAF6695FC4B',
        name: 'AutoDash2_FreeformLayout',
        projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
    };

    let { loginPage, dossierPage, libraryPage, libraryAuthoringPage, autoDashboard, dossierAuthoringPage, richTextBox, textField, imageContainer_Authoring, htmlContainer_Authoring, baseContainer } = browsers.pageObj1;

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

it('AHIT-1989_Add and format rich text box in Infographic Style', async () => {
        await dossierAuthoringPage.actionOnToolbar('Add Page');
        infoLog('Switch to Infographic Style');
        await autoDashboard.switchAutoDash2BeautificationMode('Infographic');

        infoLog('Send command in auto dash chat panel');
        await autoDashboard.sendPromptInAutoDash2(
            'add a rich text box to analyze the items sold, use style Header 1 for main title with Blue color, Header 2 for section title with Red Color, Header 3 for content titles with Orange Color rgb(255, 153, 0), include at least 1 main title, 1 section title, 1 content title'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showErrorDetailsAndFail();

        infoLog('The page must contain rich text box');
        const selectedRichText = await richTextBox.getRichTextContainer();
        await since('The page contains a rich text box')
                .expect(await selectedRichText.isExisting())
                .toBe(true);

        let mainTitleColor = true;
        let sectionTitleColor = true;
        let contentTitleColor = true;
        const header1Strong = await richTextBox.getRichTextHeader1Strong();
        const header2Strong = await richTextBox.getRichTextHeader2Strong();
        const header3Strong = await richTextBox.getRichTextHeader3Strong();
        console.log(header1Strong.length, header2Strong.length, header3Strong.length);

        await since('The page contains at least one main title')
                .expect(header1Strong.length > 0)
                .toBe(true);
        await since('The page contains at least one section title')
                .expect(header2Strong.length > 0)
                .toBe(true);
        await since('The page contains at least one content title')
                .expect(header3Strong.length > 0)
                .toBe(true);
        
        for(let i = 0; i < header1Strong.length; i++) {
            let strong = await header1Strong[i];
            let style = await strong.getAttribute('style');
            console.log(style);
            mainTitleColor = mainTitleColor && style.includes("rgb(0, 123, 255)");
        }
        for(let i = 0; i < header2Strong.length; i++) {
            let strong = await header2Strong[i];
            let style = await strong.getAttribute('style');
            console.log(style);
            sectionTitleColor = sectionTitleColor && style.includes("rgb(220, 53, 69)");
        }
        for(let i = 0; i < header3Strong.length; i++) {
            let strong = await header3Strong[i];
            let style = await strong.getAttribute('style');
            console.log(style);
            contentTitleColor = contentTitleColor && style.includes("rgb(255, 153, 0)");
        }
        await since('The main title is in Blue')
            .expect(mainTitleColor)
            .toBe(true);
        await since('The section title is in Red')
            .expect(sectionTitleColor)
            .toBe(true);
        await since('The content title is in Orange')
            .expect(contentTitleColor)
            .toBe(true);

        infoLog('Take screenshots and attach to allure');
        let canvas = await libraryAuthoringPage.getVizDoc();
        let canvasImage = await saveAutoDash2Result('AHIT-1989_01_Canvas.png', canvas, actualImageFolder);
        allureReporter.addAttachment('Canvas', fs.readFileSync(canvasImage), 'image/png');
        let chatPanel = await autoDashboard.getAutoDashboard();
        let chatPanelImage = await saveAutoDash2Result('AHIT-1989_01_ChatOutput.png', chatPanel, actualImageFolder);
        allureReporter.addAttachment('ChatOutput', fs.readFileSync(chatPanelImage), 'image/png');

        await autoDashboard.sendPromptInAutoDash2('change the text with Header 2 style to Green'); 
        sectionTitleColor = true;
        for(let i = 0; i < header2Strong.length; i++) {
            let strong = await header2Strong[i];
            let style = await strong.getAttribute('style');
            console.log(style);
            sectionTitleColor = sectionTitleColor && style.includes("rgb(40, 167, 69)");
        }
        await since('The section title is in Green')
            .expect(sectionTitleColor)
            .toBe(true);
        infoLog('Take screenshots and attach to allure');
        canvasImage = await saveAutoDash2Result('AHIT-1989_02_Canvas.png', canvas, actualImageFolder);
        allureReporter.addAttachment('Canvas', fs.readFileSync(canvasImage), 'image/png');
        chatPanelImage = await saveAutoDash2Result('AHIT-1989_02_ChatOutput.png', chatPanel, actualImageFolder);
        allureReporter.addAttachment('ChatOutput', fs.readFileSync(chatPanelImage), 'image/png');

        await autoDashboard.sendPromptInAutoDash2('change the text with Header 3 style to Purple');
        contentTitleColor = true;
        for(let i = 0; i < header3Strong.length; i++) {
            let strong = await header3Strong[i];
            let style = await strong.getAttribute('style');
            console.log(style);
            contentTitleColor = contentTitleColor && style.includes("rgb(128, 0, 128)");
        }
        await since('The content title is in Purple')
            .expect(contentTitleColor)
            .toBe(true);
        canvasImage = await saveAutoDash2Result('AHIT-1989_03_Canvas.png', canvas, actualImageFolder);
        allureReporter.addAttachment('Canvas', fs.readFileSync(canvasImage), 'image/png');
        chatPanelImage = await saveAutoDash2Result('AHIT-1989_03_ChatOutput.png', chatPanel, actualImageFolder);
        allureReporter.addAttachment('ChatOutput', fs.readFileSync(chatPanelImage), 'image/png');
        
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showErrorDetailsAndFail();
    });

});