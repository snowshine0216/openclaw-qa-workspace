import { customCredentials } from '../../../constants/index.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import setWindowSize from '../../../config/setWindowSize.js';


const specConfiguration = { ...customCredentials('_guideE2E') };

describe('E2E test for Pendo Guide', () => {
    const dossier = {
        id: '5B9D66CA11E9CA9D2FA50080EF85A861',
        name: 'Database Capacity Planning',
    };

    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let { loginPage, sidebar, libraryPage, dossierPage, libraryAuthoringPage, datasetsPanel, pendoGuide, aibotChatPanel, alert } = browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(specConfiguration.credentials);
        await libraryPage.waitForLibraryLoading();
    });

    beforeEach(async () => {
        await libraryPage.sleep(2000);
        await libraryPage.executeScript('window.pendo.stopGuides();');
        await libraryPage.executeScript('window.pendo.initGuides();');
        await libraryPage.reload();
        await libraryPage.waitForLibraryLoading();
    });

    afterEach(async () => {
        await libraryAuthoringPage.closeDataImportDialog();
        await pendoGuide.goToLibrary();
    });

    it('[TC92972_01] Validate Functionality of new user experience for SaaS on Library Web - show me around', async () => {
        await libraryPage.executeScript(`window.pendo.showGuideById('uiu4cLwGUCuNiVQNik1Omi3xX8g');`);
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getLibraryPendoContainerTitleText())
            .toContain('Welcome Aboard!');
        await takeScreenshotByElement(libraryPage.getLibraryContentContainer(), 'TC92972_01', 'Welcome Aboard!');

        await pendoGuide.clickPendoButton('Show me around');
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getLibraryPendoContainerTitleText())
            .toBe('All');

        await takeScreenshotByElement(libraryPage.getLibraryContentContainer(), 'TC92972_01', 'All Container');
        await pendoGuide.clickPendoButton('Next');

        // My Content
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getLibraryPendoContainerTitleText())
            .toBe('My Content');
        await since('Container header should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.getEmptyLibraryMessageTitle())
            .toContain(`Looks like you don't own any content yet`);

        // Favorites
        await pendoGuide.clickPendoButton('Next');
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getLibraryPendoContainerTitleText())
            .toBe('Favorites');

        // Recents
        await pendoGuide.clickPendoButton('Next');
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getLibraryPendoContainerTitleText())
            .toBe('Recents');
        await since('Container header should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.getListContainerHeaderText())
            .toContain('Recents');
        
        // Create Content
        await pendoGuide.clickPendoButton('Next');
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getLibraryPendoContainerTitleText())
            .toBe('Create Content');

        // Notification
        // await pendoGuide.clickPendoButton('Next');
        // await since('Step container title should be #{expected}, while we get #{actual}')
        //     .expect(await pendoGuide.getLibraryPendoContainerTitleText())
        //     .toBe('Notifications');
        
        // Account
        await pendoGuide.clickPendoButton('Next');
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getLibraryPendoContainerTitleText())
            .toBe('Account');

        // Congratulations
        await pendoGuide.clickPendoButton('Done');
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getLibraryPendoContainerTitleText())
            .toBe('Congratulations!');

        // close 
        await pendoGuide.closePendoGuide();
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getLibraryPendoContainerTitleText())
            .toBe('Restart Your Tour Anytime!');
        await pendoGuide.clickPendoButton('Got It !');
    });

    it('[TC92972_02] Validate Functionality of new user experience for SaaS on Library Web - lets create a bot', async () => {
        await libraryPage.executeScript(`window.pendo.showGuideById('uiu4cLwGUCuNiVQNik1Omi3xX8g');`);

        // Let’s create a bot
        await pendoGuide.clickPendoButton(`Let's create a bot`);
        await libraryAuthoringPage.clickNewDossierIcon();
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getLibraryPendoContainerTitleText())
            .toBe(`Let's Create a Bot`);
        await libraryAuthoringPage.clickNewBotButton();
        await libraryAuthoringPage.waitForElementVisible(await libraryAuthoringPage.getDataImportDialogDataSource('Sample Files'));
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getLibraryPendoContainerTitleText())
            .toBe('Start with Sample Files');

        // Select a Dataset
        await libraryAuthoringPage.clickDataImportDialogSampleFiles();
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getLibraryPendoContainerTitleText())
            .toBe('Select a Dataset');

        // Manage and Create Data
        await datasetsPanel.selectDataSourceCheckboxByName('Airline');
        await datasetsPanel.clickImportButton();

        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getLibraryPendoContainerTitleText())
            .toBe('Manage and Create Data');
        
        // Customize Your Bot
        await datasetsPanel.clickCreateButton();
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getLibraryPendoContainerTitleText())
            .toBe('Customize Your Bot');
        
        // General
        await pendoGuide.clickPendoButton('Explore Editor');
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getLibraryPendoContainerTitleText()).toBe('General');
        await since('General Tab should be #{expected}, while we get #{actual}')
            .expect(await aibotChatPanel.isBotConfigByNameSelected('General')).toBe('true');
        
        // Appearance
        await pendoGuide.clickPendoButton('Next');
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getLibraryPendoContainerTitleText()).toBe('Appearance');
        await since('Appearance Tab should be #{expected}, while we get #{actual}')
            .expect(await aibotChatPanel.isBotConfigByNameSelected('Appearance')).toBe('true');
        await takeScreenshotByElement(aibotChatPanel.getBotEditLayout(), 'TC92972_02', 'Appearance Tab');

        // Customizations
        await pendoGuide.clickPendoButton('Next');
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getLibraryPendoContainerTitleText()).toBe('Customizations');
        await since('Customizations Tab should be #{expected}, while we get #{actual}')
            .expect(await aibotChatPanel.isBotConfigByNameSelected('Customizations')).toBe('true');

        // Knowledge
        await pendoGuide.clickPendoButton('Next');
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getLibraryPendoContainerTitleText()).toBe('Knowledge');
        await takeScreenshotByElement(pendoGuide.getDossierPendoContainer(), 'TC92972_02', 'Knowledge');

        // Data
        await pendoGuide.clickPendoButton('Next');
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getLibraryPendoContainerTitleText()).toBe('Data');
        await since('Data Tab should be #{expected}, while we get #{actual}')
            .expect(await aibotChatPanel.isBotConfigByNameSelected('Data')).toBe('true');

        // Save Your Bot
        await pendoGuide.clickPendoButton('Next');
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getLibraryPendoContainerTitleText()).toBe('Save Your Bot');

        // Share Your Bot
        await pendoGuide.clickPendoButton('Next');
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getLibraryPendoContainerTitleText()).toBe('Share Your Bot');

        // Congratulations on creating your bot!
        await pendoGuide.clickPendoButton('Done');
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getLibraryPendoContainerTitleText()).toBe('Congratulations on creating your bot!');

        // close
        await pendoGuide.closePendoGuide();
        await aibotChatPanel.clickCloseButton();
        await aibotChatPanel.clickButton(`Don't Save`);
    });

    it('[TC92972_03] Validate Functionality of new user experience for SaaS on Library Web - Dossier', async () => {
        await browser.url(browser.options.baseUrl);
        await sidebar.clickAllSection(true);
        await libraryPage.openDossier(dossier.name);
        await libraryPage.executeScript(`window.pendo.showGuideById('zoMyCf0ajHSGfQr26IG0wgRuy6c');`);

        // Table of Contents
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getDossierPendoContainerText(0)).toBe('Table of Contents');
        await takeScreenshotByElement(pendoGuide.getDossierPendoContainer(), 'TC92972_02', 'Dossier Container');

        // Bookmarks
        await pendoGuide.clickPendoButton('Next');
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getDossierPendoContainerText(0)).toBe('Bookmarks');

        // Filters
        await pendoGuide.clickPendoButton('Next');
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getDossierPendoContainerText(0)).toBe('Filters');

        // Share
        await pendoGuide.clickPendoButton('Next');
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getDossierPendoContainerText(0)).toBe('Share');

        // Account
        await pendoGuide.clickPendoButton('Next');
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getDossierPendoContainerText(0)).toBe('Account');

        // Auto Answers
        await pendoGuide.clickPendoButton('Next');
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getDossierPendoContainerText(0)).toBe('Auto Answers');

        // Congratulations!
        await pendoGuide.clickPendoButton('Done');
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getLibraryPendoContainerTitleText()).toBe('Congratulations!');

        await pendoGuide.closePendoGuide();
        await since('Pendo guide should be closed, while we get #{actual}')
            .expect(await pendoGuide.isDossierPendoContainerPresent()).toBe(false);
    });
});

export const config = specConfiguration;
