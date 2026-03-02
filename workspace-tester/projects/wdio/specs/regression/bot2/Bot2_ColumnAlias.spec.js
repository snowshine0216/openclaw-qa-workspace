import { browserWindow } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import createBotByAPIV2 from '../../../api/bot2/createBotAPIV2.js';
import * as consts from '../../../constants/bot2.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { deleteBotList } from '../../../api/bot/index.js';
import { infoLog } from '../../../config/consoleFormat.js';
import deleteObjectsByFolder from '../../../api/folderManagement/deleteObjectsByFolder.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

describe('Bot Configuration - Column Alias', () => {
    let {
        loginPage,
        libraryPage,
        aibotChatPanel,
        libraryAuthoringPage,
        botAuthoring,
        aibotDatasetPanel,
    } = browsers.pageObj1;


    const projectId = consts.botV2DatasetUser.projectId;
    const aiDatasetCollectionId = 'ECEF9448C14B1954A7A03BB7F3F5B0C9'; // AUTO_ADC_multi_datasets
    const botName = 'AutoBot_' + Math.random().toString().slice(2, 10);
    const generalSettings = botAuthoring.generalSettings;

    // MicroStrategy Tutorial > Shared Reports > Bot2.0 >Automation > Dataset
    const folderId = '1769CCA1EC4505C3AC4AE8957D167019';
    let botId;
    let input;

    beforeAll(async () => {
        await deleteObjectsByFolder({
            credentials: consts.botV2DatasetUser,
            parentFolderId: folderId,
            projectId,
            filterSubtype: 14087,
        });
        await setWindowSize(browserWindow);
        await loginPage.login(consts.botV2DatasetUser);
        await libraryPage.waitForLibraryLoading();

        // Create bots
        botId = await createBotByAPIV2({
            credentials: consts.botV2DatasetUser,
            aiDatasetCollections: [aiDatasetCollectionId],
            projectId,
            folderId,
            botName,
            publishedToUsers: [consts.botV2DatasetUser.id],
        });
    });

    beforeEach(async () => {
        // Open bot and go to dataset panel
        await libraryPage.editBotByUrl({ projectId, botId });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
    });

    afterAll(async () => {
        await deleteBotList({
            credentials: consts.botV2DatasetUser,
            botList: [botId],
            projectId,
        });
        await logoutFromCurrentBrowser();
    });

    it('[TC99025_1] create column alias and delete', async () => {
        infoLog('Create column alias');
        const datasetName = 'AUTO_MTDI';
        const objectName = 'Airline Name';
        await aibotDatasetPanel.createColumnAlias(datasetName, objectName, 'alias_Airline');
        await aibotDatasetPanel.createColumnAlias(datasetName, objectName, 'flights company');

        infoLog('Check ask about panel');
        await aibotChatPanel.openAskAboutPanel();
        await aibotChatPanel.expandAskAboutObjectByName(objectName);
        // check alias in ask about panel
        await takeScreenshotByElement(
            await aibotChatPanel.getAskAboutPanelObjectAliasesByObjectName(objectName),
            'TC99025_1',
            'alias displayed in ask about panel'
        );

        // check alias in auto complete
        infoLog('Save bot to check auto complete with alias');
        await botAuthoring.selectBotConfigTabByName('General');
        await generalSettings.turnOnAutoComplete();
        await botAuthoring.selectBotConfigTabByName('Data');
        await botAuthoring.saveExistingBotV2();
        input = 'number of flights delayed by ali';
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard(input);
        //check image of auto complete area
        await takeScreenshotByElement(
            await aibotChatPanel.getAutoCompleteArea(),
            'TC99025_1',
            'suggestion displayed with prefix ali for alias'
        );
        await aibotChatPanel.tab();

        // ask question and make sure the alias is displayed in interpretation
        infoLog('Ask question with alias');
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForElementStaleness(aibotChatPanel.getDisabledNewChatButton());
        await aibotChatPanel.hoverOnLatestAnswer();
        await aibotChatPanel.clickInterpretation();
        await aibotChatPanel.clickInterpretationAdvancedOption();
        await since('Object used should contain original column #{expected}, instead we get #{actual}')
            .expect(await aibotChatPanel.getObjectUsedText())
            .toContain(objectName);

        // delete alias
        infoLog('Delete alias');
        await aibotDatasetPanel.deleteColumnAlias(datasetName, objectName, 'flights company');
        await aibotDatasetPanel.deleteColumnAlias(datasetName, objectName, 'alias_Airline');

        infoLog('Check alias deleted in ask about panel');
        await since(`alias deleted, alias display in ask about panel should be false, instead we have #{actual}`)
        .expect(await aibotChatPanel.getAskAboutPanelObjectAliasesByObjectName(objectName).isDisplayed())
        .toBe(false);
        // save the bot to check auto complete again
        await botAuthoring.saveExistingBotV2();

        infoLog('Check no suggestions for deleted alias');
        input = 'alias';
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard(input);
        await since(`no suggestions for the alias deleted, suggestion display should be false, instead we have #{actual}`)
            .expect(await aibotChatPanel.isAutoCompleteAreaDisplayed())
            .toBe(false);
    });

    it('[TC99025_2] Add many alias and disable column - GUI', async () => {
        infoLog('Create 10 column alias');
        // Create initial alias
        const datasetName = 'AUTO_OLAP';
        const objectName = 'Cost';
        await aibotDatasetPanel.createColumnAlias(datasetName, objectName, 'initial alias added');
        await botAuthoring.saveExistingBotV2();
        // delete initial alias in input
        await aibotDatasetPanel.enableInputByClickAlias(datasetName, objectName);
        await aibotDatasetPanel.deleteColumnAliasInInput('initial alias added');
        // Create 10 more aliases
        for (let i = 1; i <= 10; i++) {
            await aibotDatasetPanel.addColumnAliasInInput(`long column alias ${i}`);
        }
        await aibotDatasetPanel.getObjectNameFromDataset(datasetName, objectName).click();
        await takeScreenshotByElement(
            await aibotDatasetPanel.getObjectAliasComponent(datasetName, objectName),
            'TC99025_2',
            'many alias displayed only show 2 rows and +'
        );

        infoLog('Check ask about panel');
        await aibotChatPanel.openAskAboutPanel();
        await aibotChatPanel.expandAskAboutObjectByName(objectName);
        // check alias in ask about panel
        await takeScreenshotByElement(
            await aibotChatPanel.getAskAboutPanelObjectAliasesByObjectName(objectName),
            'TC99025_2',
            'long alias displayed in ask about panel'
        );

        infoLog('Disable column then the alias cannot be edited');
        await aibotDatasetPanel.hideDatasetObject(objectName);
        await since(`uncheck column, alias disable should be #{expected}, instead we have #{actual}`)
        .expect( await aibotDatasetPanel.isColumnAliasDisabled(datasetName, objectName))
        .toBe(true);
        await takeScreenshotByElement(
            await aibotDatasetPanel.getObjectAliasComponent(datasetName, objectName),
            'TC99025_2',
            'column alias disabled when column is hidden'
        );
    });

    it('[TC99025_3] Multi-form Alias', async () => {
        infoLog('Create column alias for Category with 2 forms');
        const datasetName = 'AUTO_OLAP';
        const objectName = 'Category';
        const form1 = 'Category (ID)';
        const form2 = 'Category (DESC)';
        await aibotDatasetPanel.createColumnAlias(datasetName, form1, 'category_id');
        await aibotDatasetPanel.createColumnAlias(datasetName, form2, 'category_desc');

        infoLog('Check ask about panel');
        await aibotChatPanel.openAskAboutPanel();
        await aibotChatPanel.expandAskAboutObjectByName(objectName);
        // check alias in ask about panel
        await takeScreenshotByElement(
            await aibotChatPanel.getAskAboutPanelObjectAliasesByObjectName(objectName),
            'TC99025_3',
            'combined alias displayed in ask about panel for multi-form'
        );

        infoLog('Disable one form then ask about panel should only show alias for the other form');
        await aibotDatasetPanel.hideDatasetObject(form1);
        await takeScreenshotByElement(
            await aibotChatPanel.getAskAboutPanelObjectAliasesByObjectName(objectName),
            'TC99025_3',
            'alias displayed in ask about panel for remaining form'
        );
    });

    it('[TC99025_4] Error handling', async () => {
        infoLog('Create column alias with duplicate');
        const datasetName = 'AUTO_OLAP';
        const objectName = 'Year';
        await aibotDatasetPanel.createColumnAlias(datasetName, objectName, 'year');

        await takeScreenshotByElement(
            await aibotDatasetPanel.getObjectAliasComponent(datasetName, objectName),
            'TC99025_4',
            'duplicate alias error displayed in UI'
        );

    });
});
