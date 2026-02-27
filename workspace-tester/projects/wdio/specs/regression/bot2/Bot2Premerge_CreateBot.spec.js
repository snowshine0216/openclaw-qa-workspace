import { browserWindow } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { botV2Premerge } from '../../../constants/bot2.js';
import deleteObjectByNames from '../../../api/folderManagement/deleteObjectByNames.js';

describe('Bot 2.0 Create Bot', () => {
    let {
        loginPage,
        libraryPage,
        libraryAuthoringPage,
        botAuthoring,
        dossierPage,
        botConsumptionFrame,
        aibotChatPanel,
        adc,
    } = browsers.pageObj1;

    const project = {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    };
    const olapDataset = {
        id: '1E4CBF2CFC4CADF8911EF9BB25F1D298',
        name: 'AUTO_OLAP',
        project: project,
    };

    const olapADC = {
        id: '041634DA39432DB8B01467B997076C89',
        name: 'AUTO_ADC_OLAP_Premerge',
        project: project,
    };

    const folderForCreateBot = {
        id: '056A28140E45ABBF81ADF68D3AF9806A',
        name: 'Folder for create bot',
        project: project,
    };

    const newADC = {
        name: 'AutoADC_Premerge' + Date.now(),
    };

    const newBot = {
        name: 'AutoBot_Premerge' + Date.now(),
    };

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(botV2Premerge);
        await libraryPage.waitForLibraryLoading();
    });

    beforeEach(async () => {
        await libraryPage.resetToLibraryHome();
        await libraryPage.waitForLibraryLoading();
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
        await deleteCreatedObjects();
    });

    afterAll(async () => {
        await deleteCreatedObjects();
        await logoutFromCurrentBrowser();
    });

    async function deleteCreatedObjects() {
        await deleteObjectByNames({
            credentials: botV2Premerge,
            projectId: project.id,
            parentFolderId: folderForCreateBot.id,
            names: [newBot.name],
        });
        await deleteObjectByNames({
            credentials: botV2Premerge,
            projectId: project.id,
            parentFolderId: folderForCreateBot.id,
            names: [newADC.name],
        });
    }

    it('[TC99013_1] Create ADC', async () => {
        await libraryAuthoringPage.clickNewDossierIcon();
        await since('New ADC button display should be #{expected} but is #{actual}')
            .expect(await (await libraryAuthoringPage.getCreateNewADC()).isDisplayed())
            .toBe(true);
        await libraryAuthoringPage.clickNewADCButton();
        await libraryAuthoringPage.waitForProjectSelectionWindowAppear();
        await since('Dataset tab display in data select dialog should be #{expected} but is #{actual}')
            .expect(await (await libraryAuthoringPage.getMenuItemInDatasetDialog('Structured Data')).isDisplayed())
            .toBe(true);
        await libraryAuthoringPage.selectProjectAndDataset(project.name, olapDataset.name);

        // Save ADC
        await adc.saveToPath(newADC.name, ['Bot2.0', 'Folder for create bot']);
        await dossierPage.waitForDossierLoading();
        await adc.cancel();
        await since('Library title should be #{expected} but is #{actual}')
            .expect(await libraryPage.title())
            .toEqual('Library');
    });

    it('[TC99013_2] Create bot', async () => {
        await libraryAuthoringPage.clickNewDossierIcon();
        await since('New bot button display should be #{expected} but is #{actual}')
            .expect(await (await libraryAuthoringPage.getNewBotButton()).isDisplayed())
            .toBe(true);
        await libraryAuthoringPage.clickNewBot2Button();
        await libraryAuthoringPage.waitForProjectSelectionWindowAppear();
        await since('ADC tab display in data select dialog should be #{expected} but is #{actual}')
            .expect(await (await libraryAuthoringPage.getMenuItemInDatasetDialog('AI Data Collection')).isDisplayed())
            .toBe(true);
        await libraryAuthoringPage.selectProjectAndADCAndDataset(project.name, olapADC.name);

        // Save bot
        await botAuthoring.saveBotWithName(newBot.name);
        await since('Library title should be #{expected} but is #{actual}')
            .expect(await botConsumptionFrame.getBotName())
            .toEqual(newBot.name);

        // Back to library home
        await aibotChatPanel.goToLibrary();
        await since('Back to library page, the new bot in library should be "#{expected}", instead we have "#{actual}"')
            .expect(await libraryPage.isDossierInLibrary(newBot))
            .toBe(true);
    });
});
