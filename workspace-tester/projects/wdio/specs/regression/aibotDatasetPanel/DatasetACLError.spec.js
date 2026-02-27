import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { browserWindow } from '../../../constants/index.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { noACLBotUser } from '../../../constants/bot.js';

describe('AIBot Dataset Settings ', () => {
    const NoACLBot = {
        id: '6BC86FF1B04C0680D9CE13BE160C72FF',
        name: '26-Standalone-Clipboard-long data name',
        datasetName: 'Clipboard',
        tooltipText: 'You do not have use or execute access to this dataset.',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    let { loginPage, libraryPage, libraryAuthoringPage, botAuthoring, aibotDatasetPanel } = browsers.pageObj1;
    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(noACLBotUser);
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC91879] Verify no dataset ACL permission error in data set panel during edit/replace dataset', async () => {
        await libraryPage.editBotByUrl({ projectId: NoACLBot.project.id, botId: NoACLBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('Error icon displays should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.isErrorIconDisplayed())
            .toBe(true);
        await takeScreenshotByElement(
            aibotDatasetPanel.getErrorIcon(),
            'TC91879-01',
            'Verify error icon displays in data set panel'
        );
        await aibotDatasetPanel.hoverErrorIcon();
        await since('Error tooltip displays should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.tooltipText())
            .toBe(NoACLBot.tooltipText);
        await aibotDatasetPanel.openMenu();
        await takeScreenshotByElement(
            aibotDatasetPanel.getMenuContainer(),
            'TC91879-02',
            'Check dataset panel menu with error message'
        );
    });
});
