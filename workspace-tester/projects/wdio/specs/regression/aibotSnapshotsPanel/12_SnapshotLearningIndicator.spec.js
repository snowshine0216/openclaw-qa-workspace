import setWindowSize from '../../../config/setWindowSize.js';
import { snapshotBotUser } from '../../../constants/bot.js';
import { browserWindow, aibotMinimumWindow } from '../../../constants/index.js';
import { checkElementByImageComparison } from '../../../utils/TakeScreenshot.js';
import createSessionAPI from '../../../api/server/createSessionAPI.js';
import bulkReadObjectsAPI from '../../../api/server/bulkReadObjectsAPI.js';
import bulkWriteObjectsAPI from '../../../api/server/bulkWriteObjectsAPI.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import fs from 'fs';
import { parseiServerRestHost } from '../../../api/urlParser.js';


describe('AIbotSnapshot_LearningIndicator', () => {
    // info used by createSessionAPI
    const basicInfo = {
        data: {
            login: 'auto_ai_snapshot',
            password: '',
            applicationType: 6,
            projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        },
    };

    const botInfo_01 = {
        data: {
            idtypes: [
                {
                    did: 'A58EB9AC10476D1443F3E099266BA9A7',
                    tp: 89,
                    pid: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
                },
            ],
        },
    };

    const aibot = {
        id: 'C662FE240D459A6C614C8A9D59A8E61D',
        name: 'LearningIndicator',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    let {
        loginPage,
        libraryPage,
        aibotSnapshotsPanel,
        aibotChatPanel,
        snapshotDialog,
    } = browsers.pageObj1;

    let sessionID = '';
    const iServerRest = parseiServerRestHost(browser.options.baseUrl);

    const answer1 = 'The profit trend';
    const answer2 = 'performance of different regions';
    const answer3 = 'The most popular subcategory in the Music';
    const stableInterpretation = 'Show bar chart for the performance of different Region with attributes Region and metrics Revenue, sorted by Revenue in descending order';
    beforeAll(async () => {
        await loginPage.login(snapshotBotUser);
        await setWindowSize(browserWindow);
        sessionID = await createSessionAPI({ iServerRest, basicInfo });
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC97471_1] Add message with learning indicator to snapshot', async () => {
        // Reset to bot's original state
        const bot_data_tmp = await bulkReadObjectsAPI({ iServerRest, sessionID, basicInfo, botInfo: botInfo_01 });
        const vr = bot_data_tmp.data[0].vr;
        console.log('Current vr:', vr);
        const filePath = 'specs/regression/aibotSnapshotsPanel/12_LearningIndcator_Bot01.json';
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const jsonData = JSON.parse(fileContent);
        jsonData.save[0].vr = vr;
        console.log('-------------------------BotData-------------------------------------------------------');
        console.log(jsonData);
        const botData = {
            data: jsonData,
        };
        await bulkWriteObjectsAPI({ iServerRest, sessionID, basicInfo, botData });

        // Open bot Learning Indicator
        await libraryPage.openBotById({ projectId: aibot.project.id, botId: aibot.id });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clickOpenSnapshotPanelButton();

        // Click learning indicator exist for existing snapshot
        // snapshot1 trend: without indicator
        await aibotSnapshotsPanel.searchByText(answer1);
        const snapshot1 = aibotSnapshotsPanel.getSnapshotCardByText(answer1);
        await since('snapshot1: Learning indicator for snapshot card is to be #{expected}, instead we have #{actual}')
            .expect(await snapshot1.getLearningIndicator().isDisplayed())
            .toBe(false);
        await snapshot1.clickMaximizeButton();
        await since('snapshot1: Learning indicator for focus mode is to be #{expected}, instead we have #{actual}')
            .expect(await snapshotDialog.isLearningIndicatorDisplayed())
            .toBe(false);
        await snapshotDialog.clickCloseButton();
        await aibotSnapshotsPanel.clearSearch();

        // snapshot2 bar: with indicator
        await aibotSnapshotsPanel.searchByText(answer2);
        const snapshot2 = aibotSnapshotsPanel.getSnapshotCardByText(answer2);
        await since('snapshot2: Learning indicator for snapshot card is to be #{expected}, instead we have #{actual}')
            .expect(await snapshot2.getLearningIndicator().isDisplayed())
            .toBe(true);
        await checkElementByImageComparison(
            snapshot2.getLearningIndicator(),
            'snapshots/TC97471',
            'Learning indicator displayed for snapshot',
            1
        );
        await snapshot2.hoverSnapshotOperations();
        await since('snapshot2: Hover snapshot title, the learning indicator is to be #{expected}, instead we have #{actual}')
            .expect(await snapshot2.getLearningIndicator().isDisplayed())
            .toBe(false);
        await snapshot2.showInterpretationContent();
        await since('snapshot2: Interpretation text should contain #{expected}, instead we have #{actual}')
            .expect(await snapshot2.getInterpretationContentText())
            .toContain('Revenue, sorted by Revenue in descending order');
        await snapshot2.setInterpretationText(stableInterpretation);
        await since('snapshot2: Referenced knowledge and learnings part existing is to be #{expected}, instead we have #{actual}')
            .expect(await snapshot2.getInterpretationNuggets().isDisplayed())
            .toBe(true);
        await checkElementByImageComparison(
            snapshot2.getInterpretationContent(),
            'snapshots/TC97471',
            'Ref knowledge and learnings displayed',
            1
        );
        await snapshot2.clickLearningIndicator();
        await checkElementByImageComparison(
            snapshot2.getLearningTooltip(),
            'snapshots/TC97471',
            'Learning Tooltip displayed',
            1
        );
        // check focus view
        await snapshot2.clickMaximizeButton();
        await snapshotDialog.setSavedTime('Saved at XX/XX/XXXX XX:XXXX');
        await since('snapshot2: Learning indicator existing for focus mode is to be #{expected}, instead we have #{actual}')
            .expect(await snapshotDialog.isLearningIndicatorDisplayed())
            .toBe(true);
        await snapshotDialog.clickInterpretationButton();
        await snapshotDialog.clickLongContentButton();
        await snapshotDialog.setInterpretationText(stableInterpretation);
        await since('snapshot2: Referenced knowledge and learnings part existing for focus mode is to be #{expected}, instead we have #{actual}')
            .expect(await snapshotDialog.isLearningIndicatorDisplayed())
            .toBe(true);
        await checkElementByImageComparison(
            snapshotDialog.getSnapshotDialog(),
            'snapshots/TC97471',
            'learning and indicator exist for focus mode',
            1
        );
        await snapshotDialog.clickLearningIndicator();
        await snapshotDialog.clickCloseButton();
        await aibotSnapshotsPanel.clearSearch();

        // add message to snapshot
        // snapshort3 with indicator        
        await aibotChatPanel.hoverNthChatAnswerFromEndtoAddSnapshot(1);
        await aibotChatPanel.getToastbyMessage('Snapshot added').isDisplayed();
        await aibotSnapshotsPanel.searchByText(answer3);
        const snapshot3 = aibotSnapshotsPanel.getSnapshotCardByText(answer3);
        await snapshot3.showInterpretationContent();
        await since('snapshot3: Learning indicator for newly added snapshot is to be #{expected}, instead we have #{actual}')
            .expect(await snapshot3.getLearningIndicator().isDisplayed())
            .toBe(true);
        await snapshot3.clickLearningIndicator();
        await since('snapshot3: Click learning inicator to show tooltip, the tooltip displayed is to be #{expected}, instead we have #{actual}')
            .expect(await snapshot3.getLearningTooltip().isDisplayed())
            .toBe(true);
        await since('snapshot3: Referenced knowledge and learnings part existing is to be #{expected}, instead we have #{actual}')
            .expect(await snapshot3.getInterpretationNuggets().isDisplayed())
            .toBe(true);
        await snapshot3.clickMaximizeButton();
        await since('snapshot3: Learning indicator for focus mode is to be #{expected}, instead we have #{actual}')
            .expect(await snapshotDialog.isLearningIndicatorDisplayed())
            .toBe(true);
        await snapshotDialog.clickInterpretationButton();
        await snapshotDialog.clickLongContentButton();
        await since('snapshot3: Referenced knowledge and learnings part existing is to be #{expected}, instead we have #{actual}')
            .expect(await snapshotDialog.isLearningIndicatorDisplayed())
            .toBe(true);
        await snapshotDialog.clickLearningIndicator();
        await snapshotDialog.clickCloseButton();
        await aibotSnapshotsPanel.clearSearch();

        // Exit bot
        await aibotChatPanel.goToLibrary();
    });

    it('[TC97471_2] Snasphot Learning indicator mobile view', async () => {
        await setWindowSize(aibotMinimumWindow);
        await libraryPage.openBotById({ projectId: aibot.project.id, botId: aibot.id });
        await aibotChatPanel.clickMobileHamburgerButton();
        await aibotChatPanel.openMobileViewSnapshotPanel();
        await aibotSnapshotsPanel.searchByText(answer2);
        const snapshot = aibotSnapshotsPanel.getSnapshotCardByText(answer2);
        await since('Learning indicator for snapshot card mobile view is to be #{expected}, instead we have #{actual}')
            .expect(await snapshot.getLearningIndicator().isDisplayed())
            .toBe(true);
        await snapshot.clickSnapshotOperations();
        await since('Click snpashot title, the learning indicator in mobile view is to be #{expected}, instead we have #{actual}')
            .expect(await snapshot.getLearningIndicator().isDisplayed())
            .toBe(false);
        await snapshot.showInterpretationContent();
        await since('Referenced knowledge and learnings part existing in mobile view is to be #{expected}, instead we have #{actual}')
            .expect(await snapshot.getInterpretationNuggets().isDisplayed())
            .toBe(true);
        await snapshot.setInterpretationText(stableInterpretation);
        await checkElementByImageComparison(
            snapshot.getInterpretationContent(),
            'snapshots/TC97471',
            'Interpretation in mobile view',
            1
        );
        await snapshot.clickLearningIndicator();
        await checkElementByImageComparison(
            snapshot.getLearningTooltip(),
            'snapshots/TC97471',
            'Learning Tooltip mobile view',
            1
        );

        await aibotSnapshotsPanel.clickBackToChatPanel();
        await libraryPage.clickLibraryIcon();
    });

});
