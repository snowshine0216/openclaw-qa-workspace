import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { browserWindow } from '../../../constants/index.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { dataBotUser } from '../../../constants/bot.js';

describe('AIBot Dataset Settings ', () => {
    const UnselectAllBot = {
        id: 'F0CCCE487E48813752842E982C692448',
        name: '06-managed-pgsql-long',
        datasetName: 'PostgreSQL-Tutorial WH',
        tooltipText: 'No content. Add content to the dataset to use the bot.',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const DDABot = {
        id: 'BEB1996DCF421E61F989AC946A399E57',
        name: '21-Standalone-DDA-pgsql',
        datasetName: 'DDA-PostgreSQL-Tutorial WH',
        tooltipText: 'Unsupported dataset. Replace the current dataset to use the bot.',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const ReportBot = {
        id: '03EFC877B8483F9D0E8002B1EAFC948C',
        name: '29-standalone-report',
        datasetName: 'Report',
        tooltipText: 'Unsupported dataset. Replace the current dataset to use the bot.',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const UnpublishBot = {
        id: '04BD720F694E3569246DBA92D10DD4CA',
        name: '44-notPublish-gd',
        datasetName: 'notPublish-gd-geo',
        tooltipText: 'This dataset needs to be refreshed.',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const DeactiveBot = {
        id: '14A4CF960547A4726681199105F19506',
        name: '71-deactivate managed cube',
        datasetName: 'campaign-finance-sample-data.xls',
        tooltipText: 'This dataset needs to be refreshed.',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    let { loginPage, libraryPage, libraryAuthoringPage, botAuthoring, aibotDatasetPanel } = browsers.pageObj1;
    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(dataBotUser);
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC92350] Verify no content error in data set panel', async () => {
        await libraryPage.editBotByUrl({ projectId: UnselectAllBot.project.id, botId: UnselectAllBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('Error icon of dataset displays should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.isErrorIconDisplayed())
            .toBe(false);
        await since('Panel Error icon displays should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.isPanelErrorIconDisplayed())
            .toBe(true);
        await aibotDatasetPanel.hoverPanelErrorIcon();
        await since('Error tooltip displays should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.panelTooltipText())
            .toBe(UnselectAllBot.tooltipText);
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetContainer(),
            'TC92350-02',
            'Verify no content of dataset container'
        );
        await aibotDatasetPanel.openMenu();
        await takeScreenshotByElement(
            aibotDatasetPanel.getMenuContainer(),
            'TC92350-03',
            'Check dataset panel menu with error message'
        );
    });

    it('[TC92351] Verify dataset not publish error in data set panel', async () => {
        await libraryPage.editBotByUrl({ projectId: UnpublishBot.project.id, botId: UnpublishBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe(UnpublishBot.datasetName);
        await since('Error icon displays should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.isErrorIconDisplayed())
            .toBe(true);
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetNameContainer(),
            'TC92351-01',
            'Verify error icon displays in data set panel'
        );
        await aibotDatasetPanel.hoverErrorIcon();
        await since('Error tooltip displays should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.tooltipText())
            .toBe(UnpublishBot.tooltipText);
        await aibotDatasetPanel.openMenu();
        await takeScreenshotByElement(
            aibotDatasetPanel.getMenuContainer(),
            'TC92351-02',
            'Check dataset panel menu with error message'
        );
    });

    it('[TC92352] Verify not supported dataset - DDA error in data set panel', async () => {
        await libraryPage.editBotByUrl({ projectId: DDABot.project.id, botId: DDABot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe(DDABot.datasetName);
        await since('Error icon displays should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.isErrorIconDisplayed())
            .toBe(true);
        await takeScreenshotByElement(
            aibotDatasetPanel.getDatasetNameContainer(),
            'TC92352-01',
            'Verify error icon displays in data set panel'
        );
        await aibotDatasetPanel.hoverErrorIcon();
        await since('Error tooltip displays should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.tooltipText())
            .toBe(DDABot.tooltipText);
        await aibotDatasetPanel.openMenu();
        await takeScreenshotByElement(
            aibotDatasetPanel.getMenuContainer(),
            'TC92352-02',
            'Check dataset panel menu with error message'
        );
    });

    it('[TC92353] Verify not supported dataset - report error in data set panel', async () => {
        await libraryPage.editBotByUrl({ projectId: ReportBot.project.id, botId: ReportBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe(ReportBot.datasetName);
        await since('Error icon displays should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.isErrorIconDisplayed())
            .toBe(false);
    });

    it('[TC92354] Verify deactivated dataset error in data set panel', async () => {
        await libraryPage.editBotByUrl({ projectId: DeactiveBot.project.id, botId: DeactiveBot.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('The dataset name should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDatasetNameText())
            .toBe(DeactiveBot.datasetName);
        await since('Error icon displays should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.isErrorIconDisplayed())
            .toBe(true);
        await aibotDatasetPanel.hoverErrorIcon();
        await since('Error tooltip displays should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.tooltipText())
            .toBe(DeactiveBot.tooltipText);
    });
});
