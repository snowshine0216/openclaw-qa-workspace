import { browserWindowCustom } from '../../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import * as consts from '../../../../constants/visualizations.js';

describe('KeyDriverAutoAnswers', () => {
    const testObjectInfo = {
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial Project',
        },
        TC90183_KeyDriver: {
            id: '62D84B7E28491BE1F39F8A8262A58FF8',
            name: 'TC90183_KeyDriver',
        },
        testName: 'keyDriverDashboard',
    };

    let { loginPage, libraryPage, toc, aiAssistant, dossierPage } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(consts.vizUser.credentials);
        await setWindowSize(browserWindowCustom);
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC94496] ACC | Verify the Key Driver visualization in dossier auto dashboard ', async () => {
        await libraryPage.openUrl(testObjectInfo.project.id, testObjectInfo.TC90183_KeyDriver.id);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'gridPage' });
        await aiAssistant.open();
        await aiAssistant.vizCreationByChat('show me the top 5 key drivers for Revenue based on subcatgories');
        await aiAssistant.checkChatbotVizByIndex(0, 'viz/KeyDriverAutoAnswers/TC94496', '01_KeyDriver');
        await aiAssistant.clickMaxMinBtn();
        await aiAssistant.checkChatbotVizByIndex(0, 'viz/KeyDriverAutoAnswers/TC94496', '02_MaximizeChatbot');
        await aiAssistant.clickMaxMinBtn();
        await aiAssistant.checkChatbotVizByIndex(0, 'viz/KeyDriverAutoAnswers/TC94496', '03_MimizeChatbot');
        await aiAssistant.maximizeChatbotVisualization(0);
        await aiAssistant.checkChatbotMaximizeViz('viz/KeyDriverAutoAnswers/TC94496', '04_MaximizeChatbotViz');
        await aiAssistant.closeChatbotVizFocusModal();
        await aiAssistant.clearHistory();
        await aiAssistant.vizCreationByChat('仅仅考虑产品，请问驱动营业额的三个重要因素是什么？');
        await aiAssistant.checkChatbotVizByIndex(0, 'viz/KeyDriverAutoAnswers/TC94496', '05_AQInChinesse');
        await aiAssistant.clearHistory();
        await aiAssistant.vizCreationByChat(
            'show me the top 3 key drivers for Revenue LonglongLongLongLong LonglongLongLongLong Name based on subcategories'
        );
        await aiAssistant.checkChatbotVizByIndex(0, 'viz/KeyDriverAutoAnswers/TC94496', '06_LongName');
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'keyDriver' });
        await dossierPage.checkImageCompareForDocView('viz/KeyDriverAutoAnswers/TC94496', '07_KeyDriver');
    });
});
