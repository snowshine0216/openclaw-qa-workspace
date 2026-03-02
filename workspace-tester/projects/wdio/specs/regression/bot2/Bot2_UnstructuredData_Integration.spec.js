import { browserWindow } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import * as bot from '../../../constants/bot2.js';
import { deleteBotV2ChatByAPI } from '../../../api/bot2/chatAPI.js';

describe('Bot 2.0 Unstructured Data Integration', () => {
    let {
        loginPage,
        libraryPage,
        aibotChatPanel,
        aibotDatasetPanel,
        botAuthoring,
        libraryAuthoringPage,
        dossierPage,
        dossierAuthoringPage,
        adc,
        bot2Chat,
        historyPanel,
    } = browsers.pageObj1;

    const mixed_data_bot = {
        id: '2527C2DC15EB4CB1A24501FE48738224',
        name: 'AUTO_Unstructure_Mixed',
        project: bot.project_applicationTeam,
    };

    const unstructuredDataOnly_bot = {
        id: '7EBA39BA625E4CA49487618F3A4D7781',
        name: 'AUTO_Unstructure_Only',
        project: bot.project_applicationTeam,
    };

    const unstructuredACL_bot = {
        id: '8FB7AA11308C48818DC5FF45BA8A9A79',
        name: 'AUTO_Unstructure_ACL',
        project: bot.project_applicationTeam,
    };

    const unstructuredACL_ADC = {
        id: 'AE507CBB1044BF0B318C1C8DD207856A',
        name: 'AUTO_Unstructure_ACL',
        project: bot.project_applicationTeam,
    };

    const unstructuredDataTitle = 'Unstructured Data';
    const structuredDataTitle = 'Structured Data';

    const unstructuredDataFile = {
        name: 'AUTO_Employee_Handbook',
        id: 'AD06A70E380B41188321F9387496C3A3',
        project: bot.project_applicationTeam,
    };

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(bot.unstructuredDataUser);
        await libraryPage.waitForLibraryLoading();
        await deleteBotV2ChatByAPI({
            botId: mixed_data_bot.id,
            projectId: mixed_data_bot.project.id,
            credentials: bot.unstructuredDataUser,
        });
        await deleteBotV2ChatByAPI({
            botId: unstructuredDataOnly_bot.id,
            projectId: unstructuredDataOnly_bot.project.id,
            credentials: bot.unstructuredDataUser,
        });
        await deleteBotV2ChatByAPI({
            botId: mixed_data_bot.id,
            projectId: mixed_data_bot.project.id,
            credentials: bot.unstructuredDataNoAccessUser,
        });
        await deleteBotV2ChatByAPI({
            botId: unstructuredDataOnly_bot.id,
            projectId: unstructuredDataOnly_bot.project.id,
            credentials: bot.unstructuredDataNoAccessUser,
        });
    });

    beforeEach(async () => {
        await libraryPage.resetToLibraryHome();
        await libraryPage.waitForLibraryLoading();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC99515_4] Run bot with structured and unstructured data: consumption - Q&A', async () => {
        const question1 =
            "How many vacation days can grant to employee 'Qiuchen Xu' every year based on employee handbook?";
        const keywords1 = '25; 20';

        await libraryPage.openBot(mixed_data_bot.name);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePage());
        // Ask question 1
        await aibotChatPanel.askQuestionNoWaitViz(question1);
        await since('Annual vacation question, answer contains keyword should be #{expected}, while we get #{actual}')
            .expect(await bot2Chat.verifyAnswerContainsOneOfKeywords(keywords1))
            .toBe(true);
        await aibotChatPanel.hoverOnLatestAnswer();
        await takeScreenshotByElement(
            await aibotChatPanel.getBottomButtonIconContainerbyIndex(0),
            'TC99515_4',
            'QA_AnswerBubble'
        );
        await aibotChatPanel.clickInterpretation();
        await since('Interpretated as displayed should be #{expected}, while we get #{actual}')
            .expect(await aibotChatPanel.isInterpretedAsDisplayed())
            .toBe(true);
        await aibotChatPanel.clickInterpretationAdvancedOption();
        await since('Dataset used should be #{expected}, while we get #{actual}')
            .expect(await aibotChatPanel.getDatasetUsedText())
            .toContain('AUTO_QA_HRS, AUTO_Employee_Handbook.pdf (Page 44, Page 45)');
        await since('Object used should be #{expected}, while we get #{actual}')
            .expect(await aibotChatPanel.getObjectUsedText())
            .toContain('Employee Full Name');
    });

    it('[TC99515_5] Run bot with structured and unstructured data: edit panel', async () => {
        await libraryPage.openBot(mixed_data_bot.name);
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');

        await aibotDatasetPanel.clickOnDatasetTitle();
        await since('The structured dataset title should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetPanelDatasetTitleName())
            .toBe(structuredDataTitle);
        await since('The unstructured dataset title should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetPanelDatasetTitleName(1))
            .toBe(unstructuredDataTitle);
        // Verify unstructured data file name
        await since('The unstructured data file name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getUnstructuredDataItemNameText())
            .toBe(unstructuredDataFile.name);
    });

    it('[TC99515_6] Run bot with unstructured data only: QA & unstructured data indicator', async () => {
        const question1 = 'What is annual vacation policies based on employee tenure?';

        await libraryPage.openBot(unstructuredDataOnly_bot.name);

        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePage());
        // Ask question 1
        await aibotChatPanel.askQuestionNoWaitViz(question1);
        await aibotChatPanel.hoverOnUnstructuredDataIndicator();

        await aibotChatPanel.clickUnstructuredDataDownloadButton();
        await dossierAuthoringPage.waitForDownloadComplete({ name: unstructuredDataFile.name, fileType: '.pdf' });
        await aibotChatPanel.waitForUnstructuredDataTooltipSpinnerDisappear();
        await since('Unstructured data download spinner should not be displayed')
            .expect(await aibotChatPanel.getUnstructuredDataTooltipDownloadSpinner().isDisplayed())
            .toBe(false);
        await takeScreenshotByElement(
            await aibotChatPanel.getUnstructuredDataTooltip(),
            'TC99515_6',
            'QA_UnstructuredDataTooltip'
        );
    });

    it('[TC99515_7] Run bot with unstructured data only: edit panel', async () => {
        await libraryPage.openBot(unstructuredDataOnly_bot.name);
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');

        await since('The structured dataset title should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetPanelDatasetTitleName())
            .toBe(unstructuredDataTitle);
        // Verify unstructured data file name
        await since('The unstructured data file name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getUnstructuredDataItemNameText())
            .toBe(unstructuredDataFile.name);
    });

    it('[TC99515_8] Privlege - No "create and configure unstructured" privilege user can create bot and download file', async () => {
        await loginPage.relogin(bot.unstructuredDataNoPrivilegeUser);
        // const question1 = 'What is MicroStrategy used for';
        const question1 = 'What training courses are required for MSTR employees?';

        // create Bot
        await libraryAuthoringPage.clickNewDossierIcon();
        await libraryAuthoringPage.clickNewBot2Button();
        await libraryAuthoringPage.waitForProjectSelectionWindowAppear();
        // search unstructured data - able to search and select
        await libraryAuthoringPage.changeProjectTo(unstructuredDataFile.project.name);
        await libraryAuthoringPage.clickDatasetTypeInDatasetPanel('Unstructured Data');
        await libraryAuthoringPage.searchForDataByName(unstructuredDataFile.name);
        await since('Dataset exists when search should be #{expected}, instead we have #{actual}')
            .expect(await libraryAuthoringPage.isDatasetExistedInDatasetPanel(unstructuredDataFile.name))
            .toBe(true);
        await since('Dataset checkbox disabled should be #{expected}, instead we have #{actual}')
            .expect(await libraryAuthoringPage.isDatasetDisabledInDatasetPanel(unstructuredDataFile.name))
            .toBe(false);
        await libraryAuthoringPage.clickCancelButton();

        //  Q&A - able to download unstructured data
        await libraryPage.openBot(unstructuredDataOnly_bot.name);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePage());
        await aibotChatPanel.askQuestionNoWaitViz(question1);
        await aibotChatPanel.hoverOnUnstructuredDataIndicator();
        await aibotChatPanel.clickUnstructuredDataDownloadButton();
        await since('Error dialogue presence should be "#{expected}", instead we have "#{actual}"')
            .expect(await dossierPage.isErrorPresent())
            .toBe(false);
    });

    it('[TC99515_9] ACL - No ACL(Execute) to unstructured data when open bot: unstructured data only', async () => {
        await loginPage.relogin(bot.unstructuredDataNoAccessUser);

        // bot consumption
        await libraryPage.openBot(unstructuredDataOnly_bot.name);
        await since('bot consumption and No valid dataset present should be  #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetWarningDialog().isDisplayed())
            .toBe(true);
        await since('bot consumption and the warning dialog header should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetWarningDialogHeader().getText())
            .toBe('No Valid Dataset');
        await aibotDatasetPanel.closeDatasetWarningDialog();
        await aibotChatPanel.waitForLibraryLoading();
        await since('Click close btn, browser title should be  #{expected}, instead we have #{actual}')
            .expect(await browser.getTitle())
            .toBe('Library');

        // bot authoring
        await libraryPage.editBotByUrl({
            projectId: unstructuredDataOnly_bot.project.id,
            botId: unstructuredDataOnly_bot.id,
            handleError: false,
        });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await since('Bot authoring and no valid dataset dialog should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetWarningDialog().isDisplayed())
            .toBe(true);
        await since('Bot authoring and the warning dialog header should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetWarningDialogHeader().getText())
            .toBe('No Valid Dataset');
        await aibotDatasetPanel.closeDatasetWarningDialog();
        await since('Close and no valid dataset dialog should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetWarningDialog().isDisplayed())
            .toBe(false);
        await since('Close and browser title should be  #{expected}, instead we have #{actual}')
            .expect(await browser.getTitle())
            .toBe(unstructuredDataOnly_bot.name);
    });

    it('[TC99515_10] ACL - No ACL(Execute) to unstructured data when open bot: mixed bot', async () => {
        await loginPage.relogin(bot.unstructuredDataNoAccessUser);
        const question1 =
            'What responsibilities do MicroStrategy users have regarding acceptable uses of workstations and networks?';

        await libraryPage.openBot(mixed_data_bot.name);
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await browser.pause(1000);
        await aibotDatasetPanel.clickOnDatasetTitle();
        await since('The structured dataset title should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetPanelDatasetTitleName())
            .toBe('AUTO_QA_HRS');
        await since('Unstructured data displayed should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getUnstructuredDataItem().isDisplayed())
            .toBe(false);
        await aibotChatPanel.askQuestionNoWaitViz(question1);
        await since('Unstructured data indicator should not be displayed')
            .expect(await aibotChatPanel.getUnstructuredDataIndicator().isDisplayed())
            .toBe(false);
    });

    it('[TC99515_11] ACL - No ACL(Execute) to unstructured data when create bot', async () => {
        await loginPage.relogin(bot.aclUser_ds);

        // create Bot
        await libraryAuthoringPage.clickNewDossierIcon();
        await libraryAuthoringPage.clickNewADCButton();
        await libraryAuthoringPage.waitForProjectSelectionWindowAppear();

        // search unstructured data - able to search but not able to select
        await libraryAuthoringPage.changeProjectTo(unstructuredDataFile.project.name);
        await libraryAuthoringPage.clickDatasetTypeInDatasetPanel('Unstructured Data');
        await libraryAuthoringPage.searchForDataByName(unstructuredDataFile.name);
        await since('Dataset exists when search should be #{expected}, instead we have #{actual}')
            .expect(await libraryAuthoringPage.isDatasetExistedInDatasetPanel(unstructuredDataFile.name))
            .toBe(true);
        await since('Dataset checkbox disabled should be #{expected}, instead we have #{actual}')
            .expect(await libraryAuthoringPage.isDatasetDisabledInDatasetPanel(unstructuredDataFile.name))
            .toBe(true);
        await libraryAuthoringPage.clickCancelButton();
    });

    it('[TC99515_12] ACL - No ACL(Execute) to unstructured data when download file', async () => {
        await loginPage.relogin(bot.aclUser_ds);
        const chatName = 'AUTO_DONOTDELETE';
        const errorTitle = 'Application Error';
        const errorMsg = 'Sorry, an error has occurred';

        await libraryPage.editBotByUrl({ projectId: mixed_data_bot.project.id, botId: mixed_data_bot.id });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePage());

        // download unstructured data - at least read acl
        await aibotChatPanel.clickHistoryChatButton();
        await historyPanel.switchToChat(chatName);
        await aibotChatPanel.hoverOnUnstructuredDataIndicator();

        await aibotChatPanel.clickUnstructuredDataDownloadButton();
        await dossierPage.waitForElementVisible(dossierPage.getErrorDialogue());
        await since('The error title should be "#{expected}", instead we have "#{actual}"')
            .expect(await dossierPage.errorTitle())
            .toBe(errorTitle);
        await since('The error message should be "#{expected}", instead we have "#{actual}"')
            .expect(await dossierPage.errorMsg())
            .toContain(errorMsg);
        await libraryPage.showDetails();
        await since('Error details should contain #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.errorDetails())
            .toContain('does not have Execute access to the Nuggets object');
        await libraryPage.dismissError();
    });

    it('[TC99515_13] ACL - No ACL to ADC which contains unstructured data', async () => {
        await loginPage.relogin(bot.aclUser_adc);

        // open adc
        await libraryPage.editBotByUrl(
            { projectId: unstructuredACL_ADC.project.id, botId: unstructuredACL_ADC.id },
            false
        );
        await since('Open ADC, error dialogue popup should be #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.isErrorPresent())
            .toBe(true);
        await since('Open ADC, error title should contain #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.errorMsg())
            .toContain('You do not have permission to perform this action');
        await libraryPage.showDetails();
        await since('Open ADC, error details should contain #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.errorDetails())
            .toContain('does not have Read access to the Document Definition object');
        await libraryPage.dismissError();

        // open bot
        await libraryPage.editBotByUrl(
            { projectId: unstructuredACL_bot.project.id, botId: unstructuredACL_bot.id },
            false
        );
        await since('Open bot, error dialogue popup should be #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.isErrorPresent())
            .toBe(true);
        await since('Open bot, error title should contain #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.errorMsg())
            .toContain('You do not have permission to perform this action');
        await libraryPage.showDetails();
        await since('Open bot, error details should contain #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.errorDetails())
            .toContain('does not have Read access to the Document Definition object ');
        await libraryPage.dismissError();
    });
});
