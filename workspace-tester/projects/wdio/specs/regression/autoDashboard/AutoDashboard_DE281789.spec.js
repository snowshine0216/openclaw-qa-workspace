import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { autoDashboard_shshen } from '../../../constants/autoAnswer.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';

describe('DE281789 workflow for Auto Dashboard', () => {
    const project = {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    };
    const AA_E2E = {
        id: '8655CC899749203F674147B7909AD6C1',
        name: 'DE281789',
        project,
    };
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let { loginPage, dossierPage, libraryPage, libraryAuthoringPage, autoDashboard, visualizationPanel, contentsPanel } = browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        if (!(await loginPage.isLoginPageDisplayed())) {
            await browser.url(new URL('auth/ui/loginPage', browser.options.baseUrl).toString(), 100000);
        }
        await loginPage.login(autoDashboard_shshen);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
        await logoutFromCurrentBrowser();
    });

    it('[TC97071_1] DE281789 Auto Dashboard for page creation with specific attribute and metric name', async () => {
        await resetDossierState({
            credentials: autoDashboard_shshen,
            dossier: AA_E2E,
        });
        await libraryPage.openDossier(AA_E2E.name);
        await libraryAuthoringPage.editDossierFromLibrary();
        await autoDashboard.openAutoDashboard(false);

        // Freeform question
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await autoDashboard.autoPageCreationByChat('Create me a page for year and cost');

        // Get new page name and title
        const pageTitle = await visualizationPanel.getPageTitle().getText();
        const updatedPage = await contentsPanel.getPage({
            chapterName: 'Chapter 1',
            pageName: `${pageTitle}`,
        });
        await since('It is #{expected} that updated page is shown, instead we have #{actual}.')
            .expect(await updatedPage.isDisplayed())
            .toBe(true);
        console.log(`New Page Name of Chapter 1 - Page 2 is: ` + pageTitle);
        // Get page count
        await since('Page count is expected to be #{expected}, instead we have #{actual}')
        .expect(await contentsPanel.getPagesCount())
        .toBe(2);
        await autoDashboard.closeEditWithoutSaving();
    });


    it('[TC97071_2] DE281789 Auto Dashboard for page creation with trend word', async () => {
        await resetDossierState({
            credentials: autoDashboard_shshen,
            dossier: AA_E2E,
        });
        await libraryPage.openDossier(AA_E2E.name);
        await libraryAuthoringPage.editDossierFromLibrary();
        await autoDashboard.openAutoDashboard(false);

        // Freeform question
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await autoDashboard.autoPageCreationByChat('create me a page for call center trend');

        // Get new page name and title
        const pageTitle3 = await visualizationPanel.getPageTitle().getText();
        const updatedPage3 = await contentsPanel.getPage({
            chapterName: 'Chapter 1',
            pageName: `${pageTitle3}`,
        });
        await since('It is #{expected} that updated page is shown, instead we have #{actual}.')
            .expect(await updatedPage3.isDisplayed())
            .toBe(true);
        console.log(`New Page Name of Chapter 1 - Page 2 is: ` + pageTitle3);
        // Get page count
        await since('Page count is expected to be #{expected}, instead we have #{actual}')
        .expect(await contentsPanel.getPagesCount())
        .toBe(2);
        await autoDashboard.closeEditWithoutSaving();
    });


    it('[TC97071_3] DE281789 Auto Dashboard for viz creation without create page', async () => {
        await libraryPage.openDossier(AA_E2E.name);
        await libraryAuthoringPage.editDossierFromLibrary();
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await autoDashboard.openAutoDashboard();
        // Freeform question
        await autoDashboard.vizCreationByChat('Please tell me the lowest 3 cost by call center');
        // Get page count
        await since('Page count is expected to be #{expected}, instead we have #{actual}')
            .expect(await contentsPanel.getPagesCount())
            .toBe(1);
    })

    it('[TC97071_4] DE281789 Auto Dashboard for suggestion creation without create page', async () => {
        await libraryPage.openDossier(AA_E2E.name);
        await libraryAuthoringPage.editDossierFromLibrary();
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await autoDashboard.openAutoDashboard();
        // Freeform question
        await autoDashboard.vizCreationByChat('Recommend a page for time analysis');
        // Get page count
        await since('Page count is expected to be #{expected}, instead we have #{actual}')
            .expect(await contentsPanel.getPagesCount())
            .toBe(1);
    })
});
