import { browserWindowCustom } from '../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../config/setWindowSize.js';
import * as consts from '../../../constants/visualizations.js';

describe('AutoAnswersVizDropzoneRule', () => {
    const testObjectInfo = {
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial Project',
        },
        DDADossier: {
            id: '0FFDF6D4364258D67DCDE0ADBEA5035D',
            name: 'DDADossier',
        },
        testName: 'AutoAnswersVizDropzoneRule',
    };

    let { loginPage, libraryPage, toc, aiAssistant, botVisualizations, visualizationPanel } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(consts.vizUser.credentials);
        // await loginPage.disableTutorial();
        await setWindowSize(browserWindowCustom);
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC93973_1] E2E | vizSubtypeSQL_1 ', async () => {
        await libraryPage.openUrl(testObjectInfo.project.id, testObjectInfo.DDADossier.id);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await aiAssistant.open();
        await aiAssistant.clickMaxMinBtn();
        await botVisualizations.clearHistoryAndAskQuestion(
            'viz/AutoAnswersVizDropzoneRule/TC93973',
            'vizSubtypeSQL_1',
            'autoAnswers'
        );
    });
    it('[TC93973_2] E2E | vizSubtypeSQL_2 ', async () => {
        await libraryPage.openUrl(testObjectInfo.project.id, testObjectInfo.DDADossier.id);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await aiAssistant.open();
        await aiAssistant.clickMaxMinBtn();
        await botVisualizations.clearHistoryAndAskQuestion(
            'viz/AutoAnswersVizDropzoneRule/TC93973',
            'vizSubtypeSQL_2',
            'autoAnswers'
        );
    });

    it('[TC93973_3] E2E | vizSubtypeSQL_3 ', async () => {
        await libraryPage.openUrl(testObjectInfo.project.id, testObjectInfo.DDADossier.id);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await aiAssistant.open();
        await aiAssistant.clickMaxMinBtn();
        await botVisualizations.clearHistoryAndAskQuestion(
            'viz/AutoAnswersVizDropzoneRule/TC93973',
            'vizSubtypeSQL_3',
            'autoAnswers'
        );
    });

    it('[TC93973_4] E2E | vizDropzoneSanity ', async () => {
        await libraryPage.openUrl(testObjectInfo.project.id, testObjectInfo.DDADossier.id);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await aiAssistant.open();
        await aiAssistant.clickMaxMinBtn();
        await botVisualizations.clearHistoryAndAskQuestion(
            'viz/AutoAnswersVizDropzoneRule/TC93973',
            'vizDropzoneSanity',
            'autoAnswers'
        );
    });
    it('[TC93973_5] E2E | e2EAQ_1 ', async () => {
        await libraryPage.openUrl(testObjectInfo.project.id, testObjectInfo.DDADossier.id);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await aiAssistant.open();
        await aiAssistant.clickMaxMinBtn();
        await botVisualizations.clearHistoryAndAskQuestion(
            'viz/AutoAnswersVizDropzoneRule/TC93973',
            'e2EAQ_1',
            'autoAnswers'
        );
    });

    it('[TC93973_6] E2E | e2EAQ_2 ', async () => {
        await libraryPage.openUrl(testObjectInfo.project.id, testObjectInfo.DDADossier.id);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await aiAssistant.open();
        await aiAssistant.clickMaxMinBtn();
        await botVisualizations.clearHistoryAndAskQuestion(
            'viz/AutoAnswersVizDropzoneRule/TC93973',
            'e2EAQ_2',
            'autoAnswers'
        );
    });

    it('[TC93973_7] E2E | SelectGridAQ ', async () => {
        await libraryPage.openUrl(testObjectInfo.project.id, testObjectInfo.DDADossier.id);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await aiAssistant.open();
        await visualizationPanel.clickTitleBar('Visualization 1');
        await aiAssistant.checkChatbotInputArea('viz/AutoAnswersVizDropzoneRule/TC93973', 'InputArea');
        await aiAssistant.vizCreationByChat('Show me the category and revenue in a grid');
        await aiAssistant.checkChatbotLatestViz('viz/AutoAnswersVizDropzoneRule/TC93973', 'SelectedViz_Grid');
    });
});
