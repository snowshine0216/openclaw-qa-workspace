import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { browserWindow } from '../../../constants/index.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { noDataImportBotUser } from '../../../constants/bot.js';

describe('AIBot Dataset Settings ', () => {
    const ManagedBot = {
        id: '5618377A8345C4B892486494460995F3',
        name: '07-managed-clipboard',
        datasetName: 'automation dataset',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    let { loginPage, libraryPage, libraryAuthoringPage, botAuthoring, aibotDatasetPanel } = browsers.pageObj1;
    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(noDataImportBotUser);
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC91644] Verify no privilege error in data set panel', async () => {
        await libraryPage.editBotByUrl({ projectId: ManagedBot.project.id, botId: ManagedBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetContainer(),
            'TC91644-01',
            'verity dataset panel with data'
        );
        await aibotDatasetPanel.openMenu();
        await takeScreenshotByElement(
            aibotDatasetPanel.getMenuContainer(),
            'TC91644-02',
            'check no edit/refresh dataset button'
        );
    });
});
