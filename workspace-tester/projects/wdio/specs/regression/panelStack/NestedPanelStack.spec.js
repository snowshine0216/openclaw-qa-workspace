import { dashboardsAutoCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

describe('Nested panel stack', () => {
    const dossier = {
        id: '7D168D07074AEE3ABC30039BE5F8475D', //'A4609720DE47CFA13445708B961FD269',
        name: 'Panel stack padding',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let { libraryPage, loginPage, dossierPage, toc, dossierAuthoringPage, selector } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(dashboardsAutoCredentials);
        await setWindowSize(browserWindow);
    });

    it('[TC99181_4] Nested panel stack', async () => {
        //DE327501
        await resetDossierState({
            credentials: dashboardsAutoCredentials,
            dossier,
        });
        await libraryPage.openDossier(dossier.name);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'DE327501 change ics' });
        await dossierPage.clickDossierPanelStackSwitchTab('NS2');
        await selector.checkbox.selectItemByText('Comair Inc.');
        await dossierPage.clickDossierPanelStackSwitchTab('NS1');
        let panelStacks = await dossierAuthoringPage.getPanelStackBoxes();
        let lastPanel = panelStacks[panelStacks.length - 1];
        await browser.pause(3000); // wait page indicator tooltip disappear
        await takeScreenshotByElement(lastPanel, 'TC99181_4', 'Nested Panel Stack Title bar');
    });
});
