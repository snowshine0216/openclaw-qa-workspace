import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import deleteBotList from '../../../api/bot/deleteBot.js';
import { browserWindow } from '../../../constants/index.js';
import createBotByAPIV2 from '../../../api/bot2/createBotAPIV2.js';
import { successLog, infoLog } from '../../../config/consoleFormat.js';
import * as consts from '../../../constants/bot2.js';


describe('AI Bot Custom Instructions Temperature Settings', () => {
    let { loginPage, libraryPage, libraryAuthoringPage, aibotChatPanel, botAuthoring, botCustomInstructions } =
        browsers.pageObj1;
    let botId, botName;

    const projectId = consts.botV2AdvSettingsUser.projectId;
    const aiDatasetCollectionId = '1E58B5A40145D769C94CB78FF0697AD9'; // AUTO_ADC_OLAP

    // MicroStrategy Tutorial > Shared Reports > Bot2.0 >Automation > advanced settings
    const folderId = '7A661BFC6F4696F449B6DEB3082EA959';

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(consts.botV2AdvSettingsUser);
    });

    beforeEach(async () => {
        botName = 'AutoBot_' + Math.random().toString().slice(2, 10);
        botId = await createBotByAPIV2({
            credentials: consts.botV2AdvSettingsUser,
            aiDatasetCollections: [aiDatasetCollectionId],
            projectId,
            folderId,
            botName,
            publishedToUsers: [consts.botV2AdvSettingsUser.id],
        });
        successLog(`Bot created with id: ${botId}`);
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
        await deleteBotList({
            credentials: consts.botV2AdvSettingsUser,
            botList: [botId],
        });
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC99009_1] Verify default temperature values for a new bot', async () => {
        // open newly created bot.
        await libraryPage.openBotById({ botId: botId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('custom-instruction');

        const temp = await botCustomInstructions.getAttributeFormTemperatureValue();
        // verify default temperature values
        await since('Attribute form temperature is expected to be #{expected}, instead we have #{actual}')
            .expect(temp)
            .toBe('0.5');
        await since('Metric temperature is expected to be #{expected}, instead we have #{actual}')
            .expect(await botCustomInstructions.getMetricTemperatureValue())
            .toBe('0.2');
        await since('Speaker temperature is expected to be #{expected}, instead we have #{actual}')
            .expect(await botCustomInstructions.getSpeakerTemperatureValue())
            .toBe('0.3');

        // take screenshot for default temperature values
        await takeScreenshotByElement(
            botCustomInstructions.getAttributeFormTemperatureValueElement(),
            'TC99009_1_01',
            'Default attribute form temperature value'
        );
        await takeScreenshotByElement(
            botCustomInstructions.getMetricTemperatureValueElement(),
            'TC99009_1_02',
            'Default metric temperature value'
        );
        await takeScreenshotByElement(
            botCustomInstructions.getSpeakerTemperatureValueElement(),
            'TC99009_1_03',
            'Default speaker temperature value'
        );
    });

    it('[TC99009_2] Verify saving and maintaining custom temperature values', async () => {
        // open bot for editing
        await libraryPage.openBotById({ botId: botId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('custom-instruction');

        // set integer temperature values
        await botCustomInstructions.setAttributeFormTemperature('1');
        await botCustomInstructions.setMetricTemperature('0');
        await botCustomInstructions.setSpeakerTemperature('1');

        // take screenshot for integer temperature values
        await takeScreenshotByElement(
            botCustomInstructions.getAttributeFormTemperatureValueElement(),
            'TC99009_2_01',
            'Integer attribute form temperature value'
        );
        await takeScreenshotByElement(
            botCustomInstructions.getMetricTemperatureValueElement(),
            'TC99009_2_02',
            'Integer metric temperature value'
        );
        await takeScreenshotByElement(
            botCustomInstructions.getSpeakerTemperatureValueElement(),
            'TC99009_2_03',
            'Integer speaker temperature value'
        );

        // save bot
        await botAuthoring.saveExistingBotV2();
        await aibotChatPanel.goToLibrary();

        // open bot again to verify values
        await libraryPage.openDossier(botName);
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        await botCustomInstructions.enableCustomInstructions();

        const attFormTemperature1 = await botCustomInstructions.getAttributeFormTemperatureValue();
        infoLog(`attFormTemperature1: ${attFormTemperature1}`);
        await since('Attribute form temperature is expected to be #{expected}, instead we have #{actual}')
            .expect(attFormTemperature1)
            .toBe('1');

        const metricTemperature1 = await botCustomInstructions.getMetricTemperatureValue();
        infoLog(`metricTemperature1: ${metricTemperature1}`);
        await since('Metric temperature is expected to be #{expected}, instead we have #{actual}')
            .expect(metricTemperature1)
            .toBe('0');

        const speakerTemperature1 = await botCustomInstructions.getSpeakerTemperatureValue();
        infoLog(`speakerTemperature1: ${speakerTemperature1}`);
        await since('Speaker temperature is expected to be #{expected}, instead we have #{actual}')
            .expect(speakerTemperature1)
            .toBe('1');

        // set decimal temperature values
        await botCustomInstructions.setAttributeFormTemperature('0.7');
        await botCustomInstructions.setMetricTemperature('0.3');
        await botCustomInstructions.setSpeakerTemperature('0.5');

        // take screenshot for decimal temperature values
        await takeScreenshotByElement(
            botCustomInstructions.getAttributeFormTemperatureValueElement(),
            'TC99009_2_04',
            'Decimal attribute form temperature value'
        );
        await takeScreenshotByElement(
            botCustomInstructions.getMetricTemperatureValueElement(),
            'TC99009_2_05',
            'Decimal metric temperature value'
        );
        await takeScreenshotByElement(
            botCustomInstructions.getSpeakerTemperatureValueElement(),
            'TC99009_2_06',
            'Decimal speaker temperature value'
        );

        // save bot
        await botAuthoring.saveExistingBotV2();
        await aibotChatPanel.goToLibrary();

        // open bot again to verify values
        await libraryPage.openDossier(botName);
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        await botCustomInstructions.enableCustomInstructions();

        const attFormTemperature2 = await botCustomInstructions.getAttributeFormTemperatureValue();
        infoLog(`attFormTemperature2: ${attFormTemperature2}`);
        await since('Attribute form temperature is expected to be #{expected}, instead we have #{actual}')
            .expect(attFormTemperature2)
            .toBe('0.7');

        const metricTemperature2 = await botCustomInstructions.getMetricTemperatureValue();
        infoLog(`metricTemperature2: ${metricTemperature2}`);
        await since('Metric temperature is expected to be #{expected}, instead we have #{actual}')
            .expect(metricTemperature2)
            .toBe('0.3');

        const speakerTemperature2 = await botCustomInstructions.getSpeakerTemperatureValue();
        infoLog(`speakerTemperature2: ${speakerTemperature2}`);
        await since('Speaker temperature is expected to be #{expected}, instead we have #{actual}')
            .expect(speakerTemperature2)
            .toBe('0.5');
    });

    it('[TC99009_3] Verify saving and maintaining default temperature values after reset', async () => {
        // open bot for editing
        await libraryPage.openBotById({ botId: botId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('custom-instruction');

        // enable custom instructions
        await botCustomInstructions.enableCustomInstructions();

        await botCustomInstructions.setAttributeFormTemperature('1');
        await botCustomInstructions.setMetricTemperature('1');
        await botCustomInstructions.setSpeakerTemperature('1');

        await botAuthoring.saveExistingBotV2();
        await aibotChatPanel.goToLibrary();

        // open bot again to verify values
        await libraryPage.openDossier(botName);
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('custom-instruction');

        // scroll the page to the bottom
        await botCustomInstructions.scrollToBottom();

        // reset all temperatures to default values
        await botCustomInstructions.resetAttributeFormTemperature();
        await botCustomInstructions.resetMetricTemperature();
        await botCustomInstructions.resetSpeakerTemperature();

        // take screenshot for reset temperature values
        await takeScreenshotByElement(
            botCustomInstructions.getAttributeFormTemperatureValueElement(),
            'TC99009_3_01',
            'Reset attribute form temperature value'
        );
        await takeScreenshotByElement(
            botCustomInstructions.getMetricTemperatureValueElement(),
            'TC99009_3_02',
            'Reset metric temperature value'
        );
        await takeScreenshotByElement(
            botCustomInstructions.getSpeakerTemperatureValueElement(),
            'TC99009_3_03',
            'Reset speaker temperature value'
        );

        // save bot
        await botAuthoring.saveExistingBotV2();
        await aibotChatPanel.goToLibrary();

        // open bot again to verify values
        await libraryPage.openDossier(botName);
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        await botCustomInstructions.enableCustomInstructions();

        const attFormTemperature = await botCustomInstructions.getAttributeFormTemperatureValue();
        infoLog(`attFormTemperature: ${attFormTemperature}`);
        await since('Attribute form temperature is expected to be #{expected}, instead we have #{actual}')
            .expect(attFormTemperature)
            .toBe('0.5');

        const metricTemperature = await botCustomInstructions.getMetricTemperatureValue();
        infoLog(`metricTemperature: ${metricTemperature}`);
        await since('Metric temperature is expected to be #{expected}, instead we have #{actual}')
            .expect(metricTemperature)
            .toBe('0.2');

        const speakerTemperature = await botCustomInstructions.getSpeakerTemperatureValue();
        infoLog(`speakerTemperature: ${speakerTemperature}`);
        await since('Speaker temperature is expected to be #{expected}, instead we have #{actual}')
            .expect(speakerTemperature)
            .toBe('0.3');
    });

    it('[TC99009_4] Verify toggle custom instruction switch', async () => {
        // open bot for editing
        await libraryPage.openBotById({ botId: botId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('custom-instruction');

        // verify the switch is on
        await since('Custom instruction switch is expected to be on')
            .expect(await botCustomInstructions.isCustomInstructionsEnabled())
            .toBe(true);

        // verify the 2 input boxes are enabled
        await since('Input box is expected to be enabled')
            .expect(await botCustomInstructions.isInputBoxEnabled())
            .toBe(true);

        // toggle the switch to off
        await botCustomInstructions.disableCustomInstructions();

        // verify the 2 input boxes are disabled
        await since('Input box is expected to be disabled')
            .expect(await botCustomInstructions.isInputBoxDisabled())
            .toBe(true);

        // save the bot
        await botAuthoring.saveExistingBotV2();
        await aibotChatPanel.goToLibrary();

        // open bot again to verify values
        await libraryPage.openDossier(botName);
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('custom-instruction');

        // verify the switch is off
        await since('Custom instruction switch is expected to be off')
            .expect(await botCustomInstructions.isCustomInstructionsEnabled())
            .toBe(false);

        // verify the 2 input boxes are disabled
        await since('Input box is expected to be disabled')
            .expect(await botCustomInstructions.isInputBoxDisabled())
            .toBe(true);

        // toggle the switch to on
        await botCustomInstructions.enableCustomInstructions();

        // verify the 2 input boxes are enabled
        await since('Input box is expected to be enabled')
            .expect(await botCustomInstructions.isInputBoxEnabled())
            .toBe(true);

        // save the bot
        await botAuthoring.saveExistingBotV2();
        await aibotChatPanel.goToLibrary();

        // open bot again to verify values
        await libraryPage.openDossier(botName);
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('custom-instruction');

        // verify the switch is on
        await since('Custom instruction switch is expected to be on')
            .expect(await botCustomInstructions.isCustomInstructionsEnabled())
            .toBe(true);

        // verify the 2 input boxes are enabled
        await since('Input box is expected to be enabled')
            .expect(await botCustomInstructions.isInputBoxEnabled())
            .toBe(true);
    });

    it('[TC99009_5] Verify default formatting string, modify custom instruction and formatting string', async () => {
        // open bot for editing
        await libraryPage.openBotById({ botId: botId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('custom-instruction');

        // verify the formatting string is the default one
        await since(' Background is empty by default, word count is expected to be #{expected}, instead we have #{actual}')
            .expect(await botCustomInstructions.getCount(0))
            .toBe('0/5000');
       // verify the formatting string is the default one
        await since('Formatting string is set by default, word count is expected to be #{expected}, instead we have #{actual}')
            .expect(await botCustomInstructions.getCount(1))
            .toBe('240/1500');
        // verify the formatting string is the default one
        await since('Denied answer is empty by default, word count is expected to be #{expected}, instead we have #{actual}')
            .expect(await botCustomInstructions.getCount(2))
            .toBe('0/2500');
        // modify the formatting string
        await botCustomInstructions.inputFormat('hello');

        // modify the background
        await botCustomInstructions.inputBackground('world');

        // modify the denied answer
        await botCustomInstructions.inputDeniedAnswer('denied answer test');

        // save the bot
        await botAuthoring.saveExistingBotV2();
        await browser.pause(5000); // AI service issue, if we get bot info immediately after saving, it will get the old info
        await aibotChatPanel.goToLibrary();

        // open bot again to verify values
        await libraryPage.openBotById({ botId: botId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('custom-instruction');

        // verify the formatting string is the modified one
        await since('Formatting string is expected to be #{expected}, instead we have #{actual}')
            .expect(await botCustomInstructions.getCount(1))
            .toBe('5/1500');

        // verify the background is the modified one
        await since('Background is expected to be #{expected}, instead we have #{actual}')
            .expect(await botCustomInstructions.getCount(0))
            .toBe('5/5000');

        // verify the denied answer is the modified one
        await since('Denied answer is expected to be #{expected}, instead we have #{actual}')
            .expect(await botCustomInstructions.getCount(2))
            .toBe('18/2500');
    });

    it('[TC99009_6] Fiscal Year Settings', async () => {
        let optionDropdown;
        await libraryPage.openBotById({ botId: botId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        
        // check default fiscal year setting is OFF
        await botCustomInstructions.scrollToBottom();
        await since('Fiscal Year switch on is expected to be off by default') 
        .expect(await botCustomInstructions.isFiscalYearEnabled())
        .toBe(false);

        // turn ON fiscal year setting
        await botCustomInstructions.enableFiscalYear();
        await since('Fiscal Year switch on is expected to be on')
        .expect(await botCustomInstructions.isFiscalYearEnabled())
        .toBe(true);
        await botCustomInstructions.scrollToBottom();
        await since('Advanced Calendar Settings disabled should be #{expected}, intead we have #{actual}')
        .expect( await botCustomInstructions.isCalendarSettingsDisabled(1))
        .toBe(true);
        await takeScreenshotByElement(
            botCustomInstructions.getFiscalYearSettings(),
            'TC99009_6_01',
            'Default Fiscal Year Settings'
        );

        // modify basic values
        optionDropdown = await botCustomInstructions.getDropdownTriggerByOption('Current Fiscal Year');
        await botCustomInstructions.selectDropdownOption(optionDropdown, 'Start Year');

        optionDropdown = await botCustomInstructions.getDropdownTriggerByOption('Start Month');
        await botCustomInstructions.selectDropdownOption(optionDropdown, 'May');

        optionDropdown = await botCustomInstructions.getDropdownTriggerByOption('Day');
        await botCustomInstructions.selectDropdownOption(optionDropdown, '2');

        await botCustomInstructions.selectRadioButtonByText('First');
        optionDropdown = await botCustomInstructions.getDropdownTriggerByOption('First');
        await botCustomInstructions.selectDropdownOption(optionDropdown, 'Friday');

        await takeScreenshotByElement(
            botCustomInstructions.getFiscalYearSettings(),
            'TC99009_6_02',
            'Modified Basic Fiscal Year Settings'
        );

        // modify advanced values
        const cube = 'AUTO_OLAP';
        const attribute = 'YearDate (DESC)';
        const attribute2 = 'Quarter (ID)';
        await botCustomInstructions.selectRadioButtonByText('Advanced Calendar Settings');
        await since('Advanced Calendar Settings selected, Basic Settings disabled should be #{expected}, intead we have #{actual}')
        .expect( await botCustomInstructions.isCalendarSettingsDisabled(0))
        .toBe(true);
        // select attribute
        optionDropdown = await botCustomInstructions.getDropdownTriggerByOption('Calendar Date');
        await botCustomInstructions.selectAdvancedCalendarDropdownOption(optionDropdown, cube, attribute);
        // select attribute2 by search
        optionDropdown = await botCustomInstructions.getDropdownTriggerByOption('Fiscal Year');
        await botCustomInstructions.selectAdvancedCalendarDropdownBySearch(optionDropdown, 'Quar', attribute2);

        // save the bot
        await botAuthoring.saveExistingBotV2();
        await botCustomInstructions.scrollToBottom();
        await takeScreenshotByElement(
            botCustomInstructions.getFiscalYearSettings(),
            'TC99009_6_03',
            'Modified Advanced Fiscal Year Settings'
        );
    });
});
