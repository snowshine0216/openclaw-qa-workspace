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

// npm run regression -- --spec=specs/regression/autoDashboard2/AutoDash2_FieldBox.spec.js --baseUrl=https://tec-l-1280162.labs.microstrategy.com/MicroStrategyLibrary/
describe('Textbox, HTML container, Image container related workflow for Auto Dashboard 2.0', () => {

    const AutoDash2 = {
        id: 'E1E88174DE407C1FB18D82854472B11A',
        name: 'AutoDash2_Auto',
        projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
    };


    let { loginPage, dossierPage, libraryPage, libraryAuthoringPage, autoDashboard, dossierAuthoringPage, textField, imageContainer_Authoring, htmlContainer_Authoring, baseContainer } = browsers.pageObj1;

    async function saveAutoDash2Result(caseName, element, actualImageFolder) {
        const imagePath = path.resolve(actualImageFolder, caseName);
        await saveElementScreenshotLocal(element, imagePath);
        return imagePath;
    }

    async function captureAndAttachScreenshotsToAllure(caseId, actualImageFolder, suffix = '') {
        const canvas = await libraryAuthoringPage.getVizDoc();
        const canvasImage = await saveAutoDash2Result(`${caseId}${suffix}_Canvas.png`, canvas, actualImageFolder);
        allureReporter.addAttachment(`Canvas${suffix}`, fs.readFileSync(canvasImage), 'image/png');

        const chatPanel = await autoDashboard.getAutoDashboard();
        const chatPanelImage = await saveAutoDash2Result(`${caseId}${suffix}_ChatOutput.png`, chatPanel, actualImageFolder);
        allureReporter.addAttachment(`ChatOutput${suffix}`, fs.readFileSync(chatPanelImage), 'image/png');
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

    it('AHIT-1674_01_Regular text box: add, modify, delete', async () => {
        infoLog('Add text box with text string and verify');
        await dossierAuthoringPage.actionOnToolbar('Add Chapter');
        await autoDashboard.sendPromptInAutoDash2(
            'add a text box with text "Test AutoDash", name is as "Textbox"'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showErrorDetailsAndFail();
        await since('The Text Container "Textbox" should have content as #{expected}, instead we have #{actual}')
            .expect(await (await textField.getTextContainer('Textbox')).getText())
            .toBe("Test AutoDash");

        infoLog('Take screenshots and attach to allure');
        await captureAndAttachScreenshotsToAllure('AHIT-1674_01', actualImageFolder, '_Add');
    
        infoLog('Modify text string in text box and verify');
        await autoDashboard.sendPromptInAutoDash2(
            'modify the text box text to "Test ABC123"'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showErrorDetailsAndFail();
        await since('The Text Container "Textbox" should have content as #{expected}, instead we have #{actual}')
            .expect(await (await textField.getTextContainer('Textbox')).getText())
            .toBe("Test ABC123");
        
        infoLog('Take screenshots and attach to allure');
        await captureAndAttachScreenshotsToAllure('AHIT-1674_01', actualImageFolder, '_Modify');

        infoLog('Delete the text box and verify');
        await autoDashboard.sendPromptInAutoDash2(
            'delete the Textbox'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showErrorDetailsAndFail();
        await since('The Text Container "Textbox" should not present, instead we have #{actual}')
            .expect(await (await baseContainer.getContainer('Textbox')).isExisting())
            .toBe(false);

        infoLog('Take screenshots and attach to allure');
        await captureAndAttachScreenshotsToAllure('AHIT-1674_01', actualImageFolder, '_Delete');
    });

    it('AHIT-1674_02_Image Box: add, modify, delete', async () => {
        infoLog('Add image box with url and verify');
        await dossierAuthoringPage.actionOnToolbar('Add Chapter');
        await autoDashboard.sendPromptInAutoDash2(
            'add an image box with URL "https://wtop.com/wp-content/uploads/2025/02/new-logo.jpg", name is as "Logo"'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showErrorDetailsAndFail();
        await since('The Image Container "Logo" should have URL as #{expected}, instead we have #{actual}')
            .expect(
                await (
                    await imageContainer_Authoring.getImageContainerWithURL(
                        'Logo',
                        'https://wtop.com/wp-content/uploads/2025/02/new-logo.jpg'
                    )
                ).isExisting()
            )
            .toBe(true);

        infoLog('Take screenshots and attach to allure');
        await captureAndAttachScreenshotsToAllure('AHIT-1674_02', actualImageFolder, '_Add');
    
        infoLog('Modify the image box url and verify');
        //AHSC-1442:Ask to update image url in existing image box, it always create a new image box
        await autoDashboard.sendPromptInAutoDash2(
            'modify the "Logo" image url to https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showErrorDetailsAndFail();
        await since('The Image Container "Logo" should have URL as #{expected}, instead we have #{actual}')
            .expect(
                await (
                    await imageContainer_Authoring.getImageContainerWithURL(
                        'Logo',
                        'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png'
                    )
                ).isExisting()
            )
            .toBe(true);
        
        infoLog('Take screenshots and attach to allure');
        await captureAndAttachScreenshotsToAllure('AHIT-1674_02', actualImageFolder, '_Modify');

        infoLog('Delete the image box and verify');
        await autoDashboard.sendPromptInAutoDash2(
            'delete the "Logo" image box'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showErrorDetailsAndFail();
        await since('I should see the Image Container "Logo", should be #{expected}, instead we have #{actual}')
            .expect(await (await imageContainer_Authoring.getImageContainer('Logo')).isExisting())
            .toBe(false);

        infoLog('Take screenshots and attach to allure');
        await captureAndAttachScreenshotsToAllure('AHIT-1674_02', actualImageFolder, '_Delete');
    });

    it('AHIT-1674_03_HTML Container: add, modify, delete', async () => {
        infoLog('Add HTML Container with html text/iframe and verify');
        await dossierAuthoringPage.actionOnToolbar('Add Chapter');
        await autoDashboard.sendPromptInAutoDash2(
            'Add a HTML container with HTML text "<h1>Test Auto Dash</h1>", name it as "HTML Container 1"'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showErrorDetailsAndFail();
        await htmlContainer_Authoring.switchToHtmlTextByEdit();
        await since('The HTML Text content of HTML Container should be #{expected}, instead we have #{actual}')
            .expect(await (await htmlContainer_Authoring.textInputArea).getValue())
            .toBe('<h1>Test Auto Dash</h1>');
        await htmlContainer_Authoring.clickHtmlContainerOkButton();

        infoLog('Take screenshots and attach to allure');
        await captureAndAttachScreenshotsToAllure('AHIT-1674_03', actualImageFolder, '_Add');
    
        infoLog('Modify the HTML Container and verify');
        await autoDashboard.sendPromptInAutoDash2(
            'modify the HTML text to "<h1>Test HTML container modify</h1>"'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showErrorDetailsAndFail();
        await since(
            'The HTML Text content of HTML Container should be #{expected} in Format Panel, instead we have #{actual}'
        )
            .expect(await htmlContainer_Authoring.formatPanelTextInputArea.getValue())
            .toBe('<h1>Test HTML container modify</h1>');
        
        infoLog('Take screenshots and attach to allure');
        await captureAndAttachScreenshotsToAllure('AHIT-1674_03', actualImageFolder, '_Modify');

        infoLog('Delete the HTML Container and verify');
        await autoDashboard.sendPromptInAutoDash2(
            'delete the HTML Container'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showErrorDetailsAndFail();
        await since('The HTML Container "HTML Container 1" should not present, instead we have #{actual}')
            .expect(await (await baseContainer.getContainer('HTML Container 1')).isExisting())
            .toBe(false);

        infoLog('Take screenshots and attach to allure');
        await captureAndAttachScreenshotsToAllure('AHIT-1674_03', actualImageFolder, '_Delete');

        // AHSC-1443: Ask to add html container as iFrame, it still add as HTML text
        await autoDashboard.sendPromptInAutoDash2(
            'create a HTML container with iFrame "https://www.strategy.com”, name it as "HTML Container 2"'
        );
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showErrorDetailsAndFail();
        await since(
            'The iFrame content of HTML Container should be #{expected} in Format Panel, instead we have #{actual}'
        )
            .expect(await htmlContainer_Authoring.formatPanelTextInputArea.getValue())
            .toBe('https://www.strategy.com');

        infoLog('Take screenshots and attach to allure');
        // AHSC-1460: Ask to modify the HTML container content, red error out
        await captureAndAttachScreenshotsToAllure('AHIT-1674_03', actualImageFolder, '_Add');
    });

});
