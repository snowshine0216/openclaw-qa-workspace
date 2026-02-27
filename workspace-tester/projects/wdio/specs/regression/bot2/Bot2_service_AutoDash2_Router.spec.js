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
const actualImageFolder = path.resolve(__dirname, '../../../autodash/Router');

describe('Router workflow for Auto Dashboard 2.0', () => {
    let consoleLogs = [];
    let botstream;
    const originalLog = console.log;
    const project = {
        id: '060ED74A48F4992BA084F7BF6C9A652A',
        name: 'Autodash-2.0 Test',
    };
    const AutoDash2_Sanity = {
        id: 'BD5CEB9F784F2350E03D0E88EE5F644B',
        name: 'AutoDash2_Retail',
        url: 'app/060ED74A48F4992BA084F7BF6C9A652A/BD5CEB9F784F2350E03D0E88EE5F644B',
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

    it('00_InitialStatus', async () => {
        await autoDashboard.waitForSuggestionReady();
        const ChatOutput = await autoDashboard.getAutoDashboard();
        const ChatOutputImage = await saveAutoDash2Result('00_ChatOutput.png', ChatOutput, actualImageFolder);
        allureReporter.addAttachment('ChatOutput', fs.readFileSync(ChatOutputImage), 'image/png');
    });
    it('01_hi', async () => {
        await autoDashboard.sendPromptInAutoDash2('X7Vw50KfC2KdPzGY: hi');
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showDetailsIfError();
        const ChatOutput = await autoDashboard.getAutoDashboard();
        const ChatOutputImage = await saveAutoDash2Result('01_ChatOutput.png', ChatOutput, actualImageFolder);
        allureReporter.addAttachment('ChatOutput', fs.readFileSync(ChatOutputImage), 'image/png');
        const result = await autoDashboard.processAILogFromBotStream(botstream);
        allureReporter.addAttachment('ServiceResponse', JSON.stringify(result, null, 2), 'application/json');
        await aiDiagProcess.validate_data_on_requirement('The content should contains greeting message', result.text);
    });

    it('02_who are you', async () => {
        await autoDashboard.sendPromptInAutoDash2('X7Vw50KfC2KdPzGY: who are you');
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showDetailsIfError();
        const ChatOutput = await autoDashboard.getAutoDashboard();
        const ChatOutputImage = await saveAutoDash2Result('02_ChatOutput.png', ChatOutput, actualImageFolder);
        allureReporter.addAttachment('ChatOutput', fs.readFileSync(ChatOutputImage), 'image/png');
        const result = await autoDashboard.processAILogFromBotStream(botstream);
        allureReporter.addAttachment('ServiceResponse', JSON.stringify(result, null, 2), 'application/json');
        await aiDiagProcess.validate_data_on_requirement(
            'The content contains the name as Auto Dashboard and also contains the info it can help to create, edit dashboard',
            result.text
        );
    });
    it('03_tell me your capability', async () => {
        await autoDashboard.sendPromptInAutoDash2('X7Vw50KfC2KdPzGY: tell me your capability');
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showDetailsIfError();
        const ChatOutput = await autoDashboard.getAutoDashboard();
        const ChatOutputImage = await saveAutoDash2Result('03_ChatOutput.png', ChatOutput, actualImageFolder);
        allureReporter.addAttachment('ChatOutput', fs.readFileSync(ChatOutputImage), 'image/png');
        const result = await autoDashboard.processAILogFromBotStream(botstream);
        allureReporter.addAttachment('ServiceResponse', JSON.stringify(result, null, 2), 'application/json');
        await aiDiagProcess.validate_data_on_requirement(
            'The content contains Capabilites about dashboard, chapter, pages and visualizations, filters',
            result.text
        );
    });

    it('04_what you can do for modify viz', async () => {
        await autoDashboard.sendPromptInAutoDash2('X7Vw50KfC2KdPzGY: what you can do for modify viz');
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showDetailsIfError();
        const ChatOutput = await autoDashboard.getAutoDashboard();
        const ChatOutputImage = await saveAutoDash2Result('04_ChatOutput.png', ChatOutput, actualImageFolder);
        allureReporter.addAttachment('ChatOutput', fs.readFileSync(ChatOutputImage), 'image/png');
        const result = await autoDashboard.processAILogFromBotStream(botstream);
        allureReporter.addAttachment('ServiceResponse', JSON.stringify(result, null, 2), 'application/json');
        await aiDiagProcess.validate_data_on_requirement(
            'The content summarizes the capabilities about modifying visualizations, including add, edit, duplicate, remove and beautify',
            result.text
        );
    });

    it('05_what is your limitation', async () => {
        await autoDashboard.sendPromptInAutoDash2('X7Vw50KfC2KdPzGY: what is your limitation');
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showDetailsIfError();
        const ChatOutput = await autoDashboard.getAutoDashboard();
        const ChatOutputImage = await saveAutoDash2Result('05_ChatOutput.png', ChatOutput, actualImageFolder);
        allureReporter.addAttachment('ChatOutput', fs.readFileSync(ChatOutputImage), 'image/png');
        const result = await autoDashboard.processAILogFromBotStream(botstream);
        allureReporter.addAttachment('ServiceResponse', JSON.stringify(result, null, 2), 'application/json');
        await aiDiagProcess.validate_data_on_requirement(
            'The content lists the limitations including items like creating new metrics/attributes etc.',
            result.text
        );
    });

    it('06_tell me your supported viz type', async () => {
        await autoDashboard.sendPromptInAutoDash2('X7Vw50KfC2KdPzGY: tell me your supported viz type');
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showDetailsIfError();
        const ChatOutput = await autoDashboard.getAutoDashboard();
        const ChatOutputImage = await saveAutoDash2Result('06_ChatOutput.png', ChatOutput, actualImageFolder);
        allureReporter.addAttachment('ChatOutput', fs.readFileSync(ChatOutputImage), 'image/png');
        const result = await autoDashboard.processAILogFromBotStream(botstream);
        allureReporter.addAttachment('ServiceResponse', JSON.stringify(result, null, 2), 'application/json');
        await aiDiagProcess.validate_data_on_requirement(
            'The content lists a bunch of supported viz, including line, Pie, Area, Bar etc.',
            result.text
        );
    });

    it('07_what theme do you support', async () => {
        await autoDashboard.sendPromptInAutoDash2('X7Vw50KfC2KdPzGY: what theme do you support');
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showDetailsIfError();
        const ChatOutput = await autoDashboard.getAutoDashboard();
        const ChatOutputImage = await saveAutoDash2Result('07_ChatOutput.png', ChatOutput, actualImageFolder);
        allureReporter.addAttachment('ChatOutput', fs.readFileSync(ChatOutputImage), 'image/png');
        const result = await autoDashboard.processAILogFromBotStream(botstream);
        allureReporter.addAttachment('ServiceResponse', JSON.stringify(result, null, 2), 'application/json');
        await aiDiagProcess.validate_data_on_requirement(
            'The content lists supported theme, including classic, default, strategy',
            result.text
        );
    });

    it('08_Duplicate current chapter as Chapter_Dup', async () => {
        await autoDashboard.sendPromptInAutoDash2('X7Vw50KfC2KdPzGY: Duplicate current chapter as Chapter_Dup');
        await libraryAuthoringPage.waitLibraryLoadingIsNotDisplayed(120);
        await autoDashboard.showDetailsIfError();
        const ChatOutput = await autoDashboard.getAutoDashboard();
        const ChatOutputImage = await saveAutoDash2Result('08_ChatOutput.png', ChatOutput, actualImageFolder);
        allureReporter.addAttachment('ChatOutput', fs.readFileSync(ChatOutputImage), 'image/png');
        const result = await autoDashboard.processAILogFromBotStream(botstream);
        allureReporter.addAttachment('ServiceResponse', JSON.stringify(result, null, 2), 'application/json');
        await aiDiagProcess.validate_data_on_requirement(
            'The content should indicate that duplicating chapter is not supported',
            result.text
        );
    });
});
