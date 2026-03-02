import { exportFrontendUser } from '../../../constants/bot.js';
import resetDossierState from '../../../api/resetDossierState.js';
import path from 'path';
export const downloadDirectory = (() => path.join(process.cwd(), 'downloads'))();

describe('Automation for defects', () => {
    let {
        loginPage,
        libraryPage,
        dossierPage,
    } = browsers.pageObj1;

    const dossier_ManyFilters = {
        id: '0F46038D11EB5ED900000080EF9CC704',
        name: 'Many Filters',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };


    beforeAll(async () => {
        await browser.setWindowSize(1200, 800);
        await resetDossierState({
            credentials: {
                username: 'auto_frontend',
                password: 'newman1#',
            },
            dossier: dossier_ManyFilters,
        });
        await loginPage.login(exportFrontendUser);
    });

    beforeEach(async () => {
        await resetDossierState({
            credentials: {
                username: 'auto_frontend',
                password: 'newman1#',
            },
            dossier: dossier_ManyFilters,
        });
    });

    // Automation for defect BCVE-4222
    it('[BCVE-4222] Check three dot menu button for visualization with hidden title', async () => {
        await browser.setWindowSize(1600, 1200);
        await libraryPage.openUrl(dossier_ManyFilters.project.id, dossier_ManyFilters.id);
        await dossierPage.waitForDossierLoading();
        await dossierPage.hoverOnVisualizationMenuButton();
        // For BCVE-4222, menu button should not be hidden after 1.5s
        await dossierPage.sleep(3000);
        await since('Visualization menu button should be present')
            .expect(await dossierPage.getVisualizationMenuButton().isDisplayed())
            .toBe(true);
        await dossierPage.unhoverOnVisualizationMenuButton();
        await dossierPage.sleep(3000);
        await since('Visualization menu button should be hidden')
            .expect(await dossierPage.getVisualizationMenuButton().isDisplayed())
            .toBe(false);
        await dossierPage.goToLibrary();
    });
});