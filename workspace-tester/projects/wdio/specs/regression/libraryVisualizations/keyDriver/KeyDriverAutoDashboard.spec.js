import { browserWindowCustom } from '../../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import * as consts from '../../../../constants/visualizations.js';

describe('KeyDriverAutoDashboard', () => {
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

    let { loginPage, libraryPage, contentsPanel, dossierEditorUtility, autoDashboard } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(consts.vizUser.credentials);
        await loginPage.disableTutorial();
        await setWindowSize(browserWindowCustom);
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC94424] ACC | Verify the Key Driver visualization in dossier auto dashboard ', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.TC90183_KeyDriver.id,
        });
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'gridPage',
        });

        await autoDashboard.openAutoDashboard();
        await autoDashboard.vizCreationByChat(
            'create a key driver for top 3 key factors for Revenue based on subcategories'
        );
        await autoDashboard.checkVizInAutoDashboard(
            0,
            'viz/KeyDriverAutoDashboard/TC94424',
            '01_KeyDriverVizInAutoDashboard'
        );
        await autoDashboard.addLastVizToPage();
        await dossierEditorUtility.checkVIVizPanel('viz/KeyDriverAutoDashboard/TC94424', '02_AddKeyDriverToVizPanel');
    });
});
