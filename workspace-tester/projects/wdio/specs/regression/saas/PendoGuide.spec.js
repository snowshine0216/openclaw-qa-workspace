import { customCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_guide') };

describe('Pendo Guide', () => {
    const dossier = {
        id: '5B9D66CA11E9CA9D2FA50080EF85A861',
        name: 'Database Capacity Planning',
        project: {
            id: '3FAB3265F7483C928678B6BF0564D92A',
            name: 'Platform Analytics',
        },
    };

    const bot = {
        id: '4EEA4FF16C4A3986F4566385B40B1837',
        name: '(Auto) Airline Bot',
        project: {
            id: '3FAB3265F7483C928678B6BF0564D92A',
            name: 'Platform Analytics',
        },
    };

    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let { loginPage, libraryPage, dossierPage, fullSearch, quickSearch, libraryAuthoringPage, datasetsPanel, pendoGuide } = browsers.pageObj1;

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
        await pendoGuide.goToLibrary();
    });

    it('[TC92973_01] Validate Functionality of new user experience for SaaS on Library Web - when sidebar is hidden', async () => {
        await pendoGuide.openSidebar();
        await libraryPage.sidebar.clickPredefinedSection('Recents');
        await pendoGuide.closeSidebar();
        // trigger from take a tour
        await libraryPage.openUserAccountMenu();
        await libraryPage.clickAccountOption('Take a Tour');

        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getLibraryPendoContainerTitleText())
            .toContain('Welcome Aboard!');
        await pendoGuide.clickPendoButton('Show me around');
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getLibraryPendoContainerTitleText())
            .toBe('All');
        await since('Container header should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.getListContainerHeaderText())
            .toContain('All');
            await takeScreenshotByElement(libraryPage.getLibraryContentContainer(), 'TC92973_01', 'All Container');
        await pendoGuide.clickPendoButton('Next');

        // My Content
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getLibraryPendoContainerTitleText())
            .toBe('My Content');
        await pendoGuide.closePendoGuide();
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getLibraryPendoContainerTitleText())
            .toBe('Restart Your Tour Anytime!');
        await pendoGuide.clickPendoButton('Got It !');
    });

    it('[TC92973_02] Validate Functionality of new user experience for SaaS on Library Web - take a tour entry', async () => {
        // search page
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(dossier.name);
        await libraryPage.openUserAccountMenu();
        await since('Take a tour present should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.userAccount.isAccountOptionPresent('Take a Tour'))
            .toBe(false);

        // dossier page
        await libraryPage.openUrl(dossier.project.id, dossier.id);
        await libraryPage.openUserAccountMenu();
        await libraryPage.userAccount.clickAccountOption('Take a Tour');
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getDossierPendoContainerText(0)).toBe('Table of Contents');
        await pendoGuide.closePendoGuide();
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getLibraryPendoContainerTitleText())
            .toBe('Restart Your Tour Anytime!');
        await pendoGuide.clickPendoButton('Got It !');
        await since('Pendo guide should be closed, while we get #{actual}')
            .expect(await pendoGuide.isDossierPendoContainerPresent()).toBe(false);

        // bot page
        await libraryPage.openUrl(bot.project.id, bot.id);
        await libraryPage.openUserAccountMenu();
        await since('Take a tour present should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.userAccount.isAccountOptionPresent('Take a Tour'))
            .toBe(false);
        await libraryPage.closeUserAccountMenu();
    });

    it('[TC93036] Validate i18n of new user experience for SaaS on Library Web', async () => {
        const zhcnCredentials = {
            username: 'tester_auto_zhcn',
            password: '',
        };
        await libraryPage.switchUser(zhcnCredentials);
        await libraryPage.waitForLibraryLoading();
        await libraryPage.executeScript('window.pendo.stopGuides();');
        await libraryPage.executeScript('window.pendo.initGuides();');
        await libraryPage.reload();
        await libraryPage.waitForLibraryLoading();

        await libraryPage.executeScript(`window.pendo.showGuideById('uiu4cLwGUCuNiVQNik1Omi3xX8g');`);
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getLibraryPendoContainerTitleText())
            .toContain('欢迎使用！');
        await pendoGuide.closePendoGuide();
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getLibraryPendoContainerTitleText())
            .toBe('入门教程任何时候都可以再次访问。');
        await pendoGuide.clickPendoButton('知道了。');

        //dossier
        await libraryPage.openUrl(dossier.project.id, dossier.id);
        await libraryPage.executeScript(`window.pendo.showGuideById('zoMyCf0ajHSGfQr26IG0wgRuy6c');`);
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getDossierPendoContainerText(0)).toBe('目录');
        await pendoGuide.closePendoGuide();
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getLibraryPendoContainerTitleText())
            .toBe('入门教程任何时候都可以再次访问。');
        await pendoGuide.clickPendoButton('知道了。');

    });
});

export const config = specConfiguration;
