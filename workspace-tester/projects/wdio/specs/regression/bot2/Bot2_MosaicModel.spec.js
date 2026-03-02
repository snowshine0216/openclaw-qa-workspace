import { browserWindow } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { mosaicUser } from '../../../constants/bot2.js';
import deleteObjectByNames from '../../../api/folderManagement/deleteObjectByNames.js';
import { deleteBotV2ChatByAPI } from '../../../api/bot2/chatAPI.js';

describe('Bot 2.0 mosaic Model Integration', () => {
    let {
        loginPage,
        libraryPage,
        libraryAuthoringPage,
        botAuthoring,
        botConsumptionFrame,
        aibotChatPanel,
        adc,
        bot2Chat,
        aibotDatasetPanel,
    } = browsers.pageObj1;

    const project = {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    };
    const mosaicDS_InMemory = {
        id: '75DFDE1273B84AADB068A95E59BDEB70',
        name: 'AUTO_Mosaic_CO2',
        project: project,
        newADC: {
            name: 'AUTO_ADC_Mosaic_InMemory_' + Date.now(),
        },
        newBot: {
            name: 'AUTO_Bot_Mosaic_InMemory_' + Date.now(),
        },
    };

    const mosaicDS_DDA = {
        id: 'FA5FE908B6EE45F782645E6E0CD641D2',
        name: 'AUTO_Mosaic_DDA',
        project: project,
        newADC: {
            name: 'AUTO_ADC_Mosaic_DDA_' + Date.now(),
        },
        newBot: {
            name: 'AUTO_Bot_Mosaic_DDA_' + Date.now(),
        },
    };

    const mosaicBot_InMemory = {
        id: '3D6EC5942D994DE09A59C268DD97B41B',
        name: 'AUTO_MosaicModel_InMemory',
        project: project,
    };

    const mosaicBot_DDA = {
        id: 'C4106F5E3C774D74847AA47CE6575727',
        name: 'AUTO_MosaicModel_DDA',
        project: project,
    };

    const mosaicBot_Mixed = {
        id: 'B9E007C6928B415F8D790576105F857F',
        name: 'AUTO_MosaicModel_Mixed',
        project: project,
        dataset: {
            InMemory: 'AUTO_Mosaic_CO2',
            DDA: 'AUTO_Mosaic_DDA',
            OLAP: 'AUTO_OLAP',
        },
    };

    const folder = {
        id: '056A28140E45ABBF81ADF68D3AF9806A',
        path: ['Bot2.0', 'Folder for create bot'],
        project: project,
    };

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(mosaicUser);
        await libraryPage.waitForLibraryLoading();
    });

    beforeEach(async () => {
        await libraryPage.resetToLibraryHome();
        await libraryPage.waitForLibraryLoading();
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
    });

    afterAll(async () => {
        //clear all chats
        await deleteBotV2ChatByAPI({
            botId: mosaicBot_Mixed.id,
            projectId: project.id,
            credentials: mosaicUser,
        });
        await deleteCreatedObjects(mosaicDS_DDA.newADC.name, mosaicDS_DDA.newBot.name);
        await deleteCreatedObjects(mosaicDS_InMemory.newADC.name, mosaicDS_InMemory.newBot.name);
        await logoutFromCurrentBrowser();
    });

    async function deleteCreatedObjects(newADCName, newBotName) {
        await deleteObjectByNames({
            credentials: mosaicUser,
            projectId: project.id,
            parentFolderId: folder.id,
            names: [newBotName],
        });
        await deleteObjectByNames({
            credentials: mosaicUser,
            projectId: project.id,
            parentFolderId: folder.id,
            names: [newADCName],
        });
    }

    it('[TC99028_1] Create bot based on in-memory mosaic model', async () => {
        const question = 'what is the Population in Millions by year';
        const expectedKeywords = '1990; 5,286; 2010; 6,853';

        // create ADC and bot
        await libraryAuthoringPage.clickNewDossierIcon();
        await libraryAuthoringPage.clickNewBot2Button();
        await libraryAuthoringPage.waitForProjectSelectionWindowAppear();
        await since('Structured Data tab display in data select dialog should be #{expected} but is #{actual}')
            .expect(await (await libraryAuthoringPage.getMenuItemInDatasetDialog('Structured Data')).isDisplayed())
            .toBe(true);
        await libraryAuthoringPage.selectProjectAndDataset(project.name, mosaicDS_InMemory.name);
        await libraryAuthoringPage.waitForCurtainDisappear();

        // save ADC and bot
        await adc.saveToPath(mosaicDS_InMemory.newADC.name, folder.path);
        await botAuthoring.waitForCurtainDisappear();
        await botAuthoring.saveBotWithName(mosaicDS_InMemory.newBot.name, folder.path);
        await since('Library title should be #{expected} but is #{actual}')
            .expect(await botConsumptionFrame.getBotName())
            .toEqual(mosaicDS_InMemory.newBot.name);

        // Q&A
        await aibotChatPanel.askQuestion(question, true);
        await since(`Answer should contain expected keywords: ${expectedKeywords}`)
            .expect(await bot2Chat.verifyAnswerContainsOneOfKeywords(expectedKeywords))
            .toBe(true);

        // Back to library home
        await aibotChatPanel.goToLibrary();
        await since('Back to library page, the new bot in library should be "#{expected}", instead we have "#{actual}"')
            .expect(await libraryPage.isDossierInLibrary(mosaicDS_InMemory.newBot))
            .toBe(true);
    });

    it('[TC99028_2] Create bot based on DDA mosaic model', async () => {
        const question = 'what is the total cost by region';
        const expectedKeywords = 'total cost; total costs';
        // create ADC and bot
        await libraryAuthoringPage.clickNewDossierIcon();
        await libraryAuthoringPage.clickNewBot2Button();
        await libraryAuthoringPage.waitForProjectSelectionWindowAppear();
        await since('Structured Data tab display in data select dialog should be #{expected} but is #{actual}')
            .expect(await (await libraryAuthoringPage.getMenuItemInDatasetDialog('Structured Data')).isDisplayed())
            .toBe(true);
        await libraryAuthoringPage.selectProjectAndDataset(project.name, mosaicDS_DDA.name);
        await libraryAuthoringPage.waitForCurtainDisappear();

        // save ADC and bot
        await adc.saveToPath(mosaicDS_DDA.newADC.name, folder.path);
        await botAuthoring.waitForCurtainDisappear();
        await botAuthoring.saveBotWithName(mosaicDS_DDA.newBot.name, folder.path);
        await since('Library title should be #{expected} but is #{actual}')
            .expect(await botConsumptionFrame.getBotName())
            .toEqual(mosaicDS_DDA.newBot.name);

        // Q&A
        await aibotChatPanel.askQuestion(question, true);
        await since(`Answer should contain expected keywords: ${expectedKeywords}`)
            .expect(await bot2Chat.verifyAnswerContainsOneOfKeywords(expectedKeywords))
            .toBe(true);

        // Back to library home
        await aibotChatPanel.goToLibrary();
        await since('Back to library page, the new bot in library should be "#{expected}", instead we have "#{actual}"')
            .expect(await libraryPage.isDossierInLibrary(mosaicDS_DDA.newBot))
            .toBe(true);
    });

    it('[TC99028_3] No linking and DA/DM restrictions on mixed mosaic model', async () => {
        await libraryPage.editBotByUrl({
            botId: mosaicBot_Mixed.id,
            projectId: mosaicBot_Mixed.project.id,
        });

        // no warning icons for unsupported DA/DM
        //////  --- bot authoring
        await botAuthoring.selectBotConfigTabByName('Data');
        await aibotDatasetPanel.disableShowDescription();
        await since('Warning icons count on bot should be #{expected} while it is #{actual}')
            .expect(await aibotDatasetPanel.getWarningIconsCount())
            .toBe(0);
        //////  --- adc authoring
        await aibotDatasetPanel.clickUpdateDatasetButton();
        await since('Warning icons count on ADC should be #{expected} while it is #{actual}')
            .expect(await adc.getWarningIconsCount())
            .toBe(0);

        // save adc, no linking restriction
        await adc.saveChanges({ saveConfirm: true, jumpToBotAuthoring: true });
        await since('Warning dialogue present should be #{expected} while it is #{actual}')
            .expect(await adc.isMojoErrorPresent())
            .toBe(false);
        await aibotChatPanel.goToLibrary();
    });

    it('[TC99028_4] Q&A on mosaic model', async () => {
        const question1 = 'what is the Population in Millions by region';
        const expectedKeywords1 = 'Asia & Oceania;Africa;Europe;Central & South America;North America';

        const question2 = 'what is the Gross Dollar Sales by manager';
        const expectedKeywords2 = 'managers; Manager; sales';

        const question3 = 'show me the profit margin by category';
        const expectedKeywords3 = 'Books;Electronics;Movies;Music';

        await libraryPage.openBotById({ botId: mosaicBot_Mixed.id, projectId: mosaicBot_Mixed.project.id });

        // In-memory mosaic model
        await aibotChatPanel.askQuestion(question1, true);
        await since(`In-memory and answer should contain expected keywords: ${expectedKeywords1}`)
            .expect(await bot2Chat.verifyAnswerContainsOneOfKeywords(expectedKeywords1))
            .toBe(true);
        await aibotChatPanel.clearHistory();

        // live-updated mosaic model
        await aibotChatPanel.askQuestion(question2, true);
        await since(`DDA and answer should contain expected keywords: ${expectedKeywords2}`)
            .expect(await bot2Chat.verifyAnswerContainsOneOfKeywords(expectedKeywords2))
            .toBe(true);
        await aibotChatPanel.clearHistory();

        //// Not support mixed dataset on 25.12
        // // normal dataset
        // await aibotChatPanel.askQuestion(question3, true);
        // await since(`Normal dataset and answer should contain expected keywords: ${expectedKeywords3}`)
        //     .expect(await bot2Chat.verifyAnswerContainsOneOfKeywords(expectedKeywords3))
        //     .toBe(true);
    });

    it('[TC99028_5] Enable NER is hidden on DDA mosaic model but not for In-memory mosaic model', async () => {
        await libraryPage.editBotByUrl({
            botId: mosaicBot_Mixed.id,
            projectId: mosaicBot_Mixed.project.id,
        });
        await botAuthoring.selectBotConfigTabByName('Data');

        // In-memory mosaic model is able to enable NER
        await aibotDatasetPanel.openDatasetObjectContextMenuV2(mosaicBot_Mixed.dataset.InMemory, 'Region');
        await since('NER present for live mosaic model should be #{expected} while it is #{actual}')
            .expect(await aibotDatasetPanel.getMenuItemInDatasetObjectDialog('NER').isDisplayed())
            .toBe(true);
        await aibotDatasetPanel.clickDatasetObjectContextMenu('NER', 'Enable');
        await botAuthoring.saveExistingBotV2();
        await aibotDatasetPanel.waitForNerCurtainDisappear(mosaicBot_Mixed.dataset.InMemory, 'Region');
        await since('NER label should be enabled due to successful PATCH request')
            .expect(await aibotDatasetPanel.isNerEnabledForObject(mosaicBot_Mixed.dataset.InMemory, 'Region'))
            .toBe(true);
        await aibotDatasetPanel.openDatasetObjectContextMenuV2(mosaicBot_Mixed.dataset.InMemory, 'Region');
        await aibotDatasetPanel.clickDatasetObjectContextMenu('NER', 'Disable');
        await botAuthoring.saveExistingBotV2();
        await aibotDatasetPanel.waitForNerCurtainDisappear(mosaicBot_Mixed.dataset.InMemory, 'Region');
        await since('NER label should be disabled')
            .expect(await aibotDatasetPanel.isNerEnabledForObject(mosaicBot_Mixed.dataset.InMemory, 'Region'))
            .toBe(false);

        // NER is hidden for DDA mosaic model due to it is not supported now
        await aibotDatasetPanel.openDatasetObjectContextMenuV2(
            mosaicBot_Mixed.dataset.DDA,
            'Call Center (Center Name)'
        );
        await since('NER present for DDA mosaic model should be #{expected} while it is #{actual}')
            .expect(await aibotDatasetPanel.getMenuItemInDatasetObjectDialog('NER').isDisplayed())
            .toBe(false);
    });
});
