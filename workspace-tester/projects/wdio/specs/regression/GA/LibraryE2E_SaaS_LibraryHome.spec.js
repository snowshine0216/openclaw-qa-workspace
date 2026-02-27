import { customCredentials } from '../../../constants/index.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import setWindowSize from '../../../config/setWindowSize.js';
import setLibraryHomeConfigForSaaS from '../../../api/setLibraryHomeConfigForSaaS.js';
import resetDossierState from '../../../api/resetDossierState.js';

const specConfiguration = { ...customCredentials('_saas') };
let credentials = specConfiguration.credentials;

const dashboard_owner = {
    id: '769138044549B18100693B8736A557FE',
    name: 'Dashboard for SaaS',
    project: {
        id: '1152A6705748CC4B2DA766AE4B6CD8D1',
        name: 'MicroStrategy Tutorial',
    },
};

const dashboard_shared = {
    id: '769138044549B18100693B8736A557FE',
    name: 'Retail Insights AI',
    project: {
        id: '1152A6705748CC4B2DA766AE4B6CD8D1',
        name: 'MicroStrategy Tutorial',
    },
};

const bot_owner = {
    id: '769138044549B18100693B8736A557FE',
    name: 'Bot for SaaS',
    project: {
        id: '88877BAE6E418D09240AD8A8CEA69B58',
        name: 'MicroStrategy Tutorial',
    },
};

const bot_shared = {
    id: '769138044549B18100693B8736A557FE',
    name: 'Salesforce Bot',
    project: {
        id: '88877BAE6E418D09240AD8A8CEA69B58',
        name: 'MicroStrategy Tutorial',
    },
};

const dashboard_externalLink = {
    id: '7187CBF64145F0AC910F478FE90E744D',
    name: 'DashboardExternalLink',
    project: {
        id: '69D4DA35264BAA98CC2BF68356064C35',
        name: 'MicroStrategy Tutorial',
    },
};

const browserWindow = {
    width: 1600,
    height: 1200,
};

let {
    loginPage,
    sidebar,
    libraryPage,
    dossierPage,
    libraryAuthoringPage,
    datasetsPanel,
    pendoGuide,
    aibotChatPanel,
    libraryFilter,
    commentsPage,
    share,
    infoWindow,
    listView,
    quickSearch,
    fullSearch,
    saasExternalLinkDialog,
    toc,
    grid,
    imageContainer,
    textbox,
    userAccount,
} = browsers.pageObj1;

describe('Saas E2E - Trial User Experience', () => {
    beforeAll(async () => {
        if (browsers.params.credentials.isPredefined && browsers.params.credentials.isPredefined === 'true') {
            credentials = {
                username: 'saastest.home@microstrategy.com',
                password: 'newman1#',
            };
        }
        console.log(credentials);
        await setWindowSize(browserWindow);
        await loginPage.saasLogin(credentials);
        await loginPage.waitForLibraryLoading();
    });

    beforeEach(async () => {
        await libraryPage.sleep(2000);
        await libraryPage.executeScript('window.pendo?.stopGuides();');
        await libraryPage.executeScript('window.pendo?.initGuides();');
        await libraryPage.reload();
        await libraryPage.waitForLibraryLoading();
    });

    afterEach(async () => {
        await libraryAuthoringPage.closeDataImportDialog();
        await dossierPage.goToLibrary();
    });

    it('[TC93405_01] Saas E2E - Trial User Experience + new library home UI', async () => {
        // check the tooltip for library home sider bar
        await since(
            'Library Home Tooltip for siderbar opened is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await dossierPage.getLibraryHomeTooltipText())
            .toBe('Hide Sidebar');

        // set expire day to 30 days firstly
        await setLibraryHomeConfigForSaaS({ credentials, day: 30, isUpgradeClicked: false });
        await libraryPage.refresh();
        // await since('Trial banner message of 30 expired day should be #{expected}, instead we have #{actual}')
        //     .expect(await libraryPage.getTrialBannerMessageText())
        //     .toBe('You have 30 days left to experience Auto Express.');
        // check sider bar section UI
        await since('Sider bar opened status by default should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.isSidebarOpened())
            .toBe(true);
        await since('defalt section count shown in sider bar should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.sidebar.getPredefinedSectionItemsCount())
            .toBe(4);
        await since('grayed out sections in sidebar should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.sidebar.getGrayedSectionNames())
            .toEqual([]);
        await since('add group button on sider bar should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.sidebar.isAddGroupBtnForSaaSDisplayed())
            .toBe(false);
        await libraryPage.sidebar.clickPredefinedSection('My Groups');
        await libraryPage.sidebar.clickPredefinedSection('Insights');
        await takeScreenshotByElement(libraryPage.getTrialWrapper(), 'TC93405_01', 'Trial Wrapper_Insights', {
            tolerance: 0.2,
        });
        await libraryPage.sidebar.clickPredefinedSection('Subscriptions');
        await takeScreenshotByElement(libraryPage.getTrialWrapper(), 'TC93405_01', 'Trial Wrapper_Subscription', {
            tolerance: 0.2,
        });
        await libraryPage.sidebar.clickPredefinedSection('Content Discovery');
        await takeScreenshotByElement(libraryPage.getTrialWrapper(), 'TC93405_01', 'Trial Wrapper_ContentDiscovery', {
            tolerance: 0.2,
        });
        await libraryPage.sidebar.clickPredefinedSection('My Groups');
        await takeScreenshotByElement(libraryPage.getTrialWrapper(), 'TC93405_01', 'Trial Wrapper_MyGroup', {
            tolerance: 0.2,
        });

        await browser.mockRestoreAll();
        // set expire day to 23 hours
        await setLibraryHomeConfigForSaaS({ credentials, day: 0, hour: 23, isUpgradeClicked: false });
        await libraryPage.refresh();
        await since('Trial banner message of 23 hours expired day should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.getTrialBannerMessageText())
            .toBe('Last chance to explore! Your Auto Express trial ends tomorrow.');
        await takeScreenshotByElement(libraryPage.getTrialBanner(), 'TC93548', 'Trial Banner_23 hours Expired Day', {
            tolerance: 0.2,
        });
        await browser.mockRestoreAll();

        // set expire day to 1 day + 1 minute
        await setLibraryHomeConfigForSaaS({ credentials, day: 1, minute: 1, isUpgradeClicked: false });
        await libraryPage.refresh();
        await since(
            'Trial banner message of 1 day + 1 minute expired day should be #{expected}, instead we have #{actual}'
        )
            .expect(await libraryPage.getTrialBannerMessageText())
            .toBe('Only 2 days left to make the most of your Auto Express trial!');
        await takeScreenshotByElement(
            libraryPage.getTrialBanner(),
            'TC93548',
            'Trial Banner_1 + 1 Minute Expired Day',
            { tolerance: 0.2 }
        );
        await browser.mockRestoreAll();
    });

    it('[TC93405_02] Validate Functionality of new user experience for SaaS on Library Web - lets create a bot', async () => {
        await libraryPage.executeScript(`window.pendo.showGuideById('jIWBWyVQIoWMyL7AwUteuabfdeI');`);
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getLibraryPendoContainerTitleText())
            .toContain('Welcome to Auto Express!');

        await pendoGuide.clickPendoButton(`Let's Go!`);

        // Let’s create a bot
        await libraryAuthoringPage.clickNewDossierIcon();
        await libraryAuthoringPage.clickNewBotButton();
        await libraryPage.executeScript(`window.pendo.showGuideById('1KoBPGYx0S8KvptLLNRLdUK1mJk');`);
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getLibraryPendoContainerTitleText())
            .toBe('Welcome to Your AI Bot Journey!');
        await pendoGuide.clickPendoButton(`Let's Go!`);
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getLibraryPendoContainerTitleText())
            .toBe('Upload your own file or start with Sample Files');

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
            .expect(await pendoGuide.getLibraryPendoContainerTitleText())
            .toBe('General');
        await since('General Tab should be #{expected}, while we get #{actual}')
            .expect(await aibotChatPanel.isBotConfigByNameSelected('General'))
            .toBe('true');

        // Appearance
        await pendoGuide.clickPendoButton('Next');
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getLibraryPendoContainerTitleText())
            .toBe('Appearance');
        await since('Appearance Tab should be #{expected}, while we get #{actual}')
            .expect(await aibotChatPanel.isBotConfigByNameSelected('Appearance'))
            .toBe('true');

        // Customizations
        await pendoGuide.clickPendoButton('Next');
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getLibraryPendoContainerTitleText())
            .toBe('Customizations');
        await since('Customizations Tab should be #{expected}, while we get #{actual}')
            .expect(await aibotChatPanel.isBotConfigByNameSelected('Customizations'))
            .toBe('true');

        // Knowledge
        await pendoGuide.clickPendoButton('Next');
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getLibraryPendoContainerTitleText())
            .toBe('Knowledge');
        // Data
        await pendoGuide.clickPendoButton('Next');
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getLibraryPendoContainerTitleText())
            .toBe('Data');
        await since('Data Tab should be #{expected}, while we get #{actual}')
            .expect(await aibotChatPanel.isBotConfigByNameSelected('Data'))
            .toBe('true');

        // Previous
        await pendoGuide.clickPendoButton('Previous');
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getLibraryPendoContainerTitleText())
            .toBe('Knowledge');
        await since('Customizations Tab should be #{expected}, while we get #{actual}')
            .expect(await aibotChatPanel.isBotConfigByNameSelected('Customizations'))
            .toBe('true');
        await pendoGuide.clickPendoButton('Next');
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getLibraryPendoContainerTitleText())
            .toBe('Data');

        // Save Your Bot
        await pendoGuide.clickPendoButton('Next');
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getLibraryPendoContainerTitleText())
            .toBe('Save Your Bot');

        // Share Your Bot
        await pendoGuide.clickPendoButton('Next');
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getLibraryPendoContainerTitleText())
            .toBe('Share Your Bot');

        // Congratulations on creating your bot!
        await pendoGuide.clickPendoButton('Next');
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getLibraryPendoContainerTitleText())
            .toBe('Congratulations on creating your bot!');

        // Restart
        await pendoGuide.clickPendoButton('Done');
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getLibraryPendoContainerTitleText())
            .toBe('Restart Your Tour Anytime!');

        // close
        await pendoGuide.clickPendoButton('Got It !');
        await aibotChatPanel.clickCloseButton();
        await aibotChatPanel.clickButton(`Don't Save`);

        // back to library home
        await libraryAuthoringPage.closeDataImportDialog();
        await pendoGuide.goToLibrary();

        // open bot via library home filter
        await libraryPage.openSidebar();
        await libraryPage.clickFilterIcon();
        await since('Filter dropdown options should be #{expected}, instead we have #{actual}')
            .expect(await libraryFilter.getFilterDropdownOptionsNames())
            .toEqual(['Type', 'Owner', 'Status']);
        await libraryFilter.openFilterTypeDropdown();
        await since('filter types should be #{expected}, instead we have #{actual}')
            .expect(await libraryFilter.getFilterTypeItemsNames())
            .toEqual(['Dashboard', 'Bot']);
        await libraryFilter.checkFilterType('Bot');
        await libraryFilter.clickApplyButton();
        await libraryPage.openDossier(bot_owner.name);
        // check bot toolbar UI
        await since('Library Home Tooltip for Bot is expected to be #{expected}, instead we have #{actual}.')
            .expect(await dossierPage.getLibraryHomeTooltipText())
            .toBe('Auto Express Home');
        await since('Edit button in bot page is expected to be #{expected}, instead we have #{actual}.')
            .expect(await libraryAuthoringPage.isEditIconPresent())
            .toBe(true);
        await since(
            'Comment button disabled status in bot page is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await commentsPage.isCommentIconPresent())
            .toBe(false);
        await share.openSharePanel();
        await since('Share options in share panel for bot expected to be #{expected}, instead we have #{actual}.')
            .expect(await share.getShareDossierPanelItemsName())
            .toEqual(['Share Bot', 'Embed Bot', 'Manage Access']);
        await share.closeSharePanel();
        await dossierPage.goToLibrary();

        // clear filter in library home
        await libraryPage.openSidebar();
        await libraryPage.clickFilterIcon();
        await libraryFilter.clickClearAllButton();
        await libraryFilter.clickApplyButton();

        // check owner's Bot IW options for SaaS
        await libraryPage.moveDossierIntoViewPort(bot_owner.name);
        await libraryPage.openDossierInfoWindow(bot_owner.name);
        await since(`IW options for owner bot should be #{expected}, instead we have #{actual}`)
            .expect(await infoWindow.getActionButtonsName())
            .toEqual(['Add to Favorites', 'Share Bot', 'Delete', 'Edit', 'Manage Access', 'Active']);
        await since(`delete button tooltip for owner bot should be #{expected}, instead we have #{actual}`)
            .expect(await infoWindow.showIconTooltip({ option: 'Remove' }))
            .toBe('Delete');
        await since('ObjectID for owner bot info window details should be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.isObjectIDPresentInInfoWindow())
            .toBe(false);
        await since(
            'Related Content section for owner bot info window details should be #{expected}, instead we have #{actual}'
        )
            .expect(await infoWindow.isRecommendationListPresentInInfoWindow())
            .toBe(false);
        await infoWindow.close();

        // check list view IW options for bot shared with others
        await libraryPage.moveDossierIntoViewPort(bot_shared.name);
        await listView.selectListViewMode();
        await listView.openInfoWindowFromListView(bot_shared.name);
        await since('Edit option for recipient bot list view IW should be #{expected}, instead we have #{actual}')
            .expect(await listView.isEditButtonPresentInIW())
            .toBe(false);
        await listView.clickCloseIcon();
        await listView.deselectListViewMode();
    });

    it('[TC93405_03] Validate Functionality of new user experience for SaaS on Library Web - Create Dossier', async () => {
        await userAccount.openUserAccountMenu();
        await userAccount.clickAccountOption('Take a Tour');
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getLibraryPendoContainerTitleText())
            .toContain('Welcome to Auto Express!');

        await pendoGuide.clickPendoButton(`Let's Go!`);
        await libraryAuthoringPage.clickNewDossierIcon();
        await libraryAuthoringPage.clickNewDossierButton();
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getLibraryPendoContainerTitleText())
            .toContain('Welcome to Your Dashboard Journey!');

        // create dashboard
        await pendoGuide.clickPendoButton(`Let's Go!`);
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getLibraryPendoContainerTitleText())
            .toBe('Upload your own file or start with Sample Files');

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

        // Contents
        await datasetsPanel.clickSaveButton();
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getLibraryPendoContainerTitleText())
            .toBe('Contents');

        // Datasets
        await pendoGuide.clickPendoButton('Next');
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getLibraryPendoContainerTitleText())
            .toBe('Datasets');

        // Editor, Filter, Format
        await pendoGuide.clickPendoButton('Next');
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getLibraryPendoContainerTitleText())
            .toBe('Editor, Filter, Format');

        // Toolbar
        await pendoGuide.clickPendoButton('Next');
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getLibraryPendoContainerTitleText())
            .toBe('Toolbar');

        // Visualization Area
        await pendoGuide.clickPendoButton('Next');
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getLibraryPendoContainerTitleText())
            .toBe('Visualization Area');
        await pendoGuide.clickPendoButton('Next');

        // Auto Dashboard
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getLibraryPendoContainerTitleText())
            .toBe('Auto Dashboard');
        await pendoGuide.clickPendoButton('Next');

        // Ask me a question
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getLibraryPendoContainerTitleText())
            .toBe('Ask me a question');
        await pendoGuide.clickPendoButton('Next');

        // Congratulations! You're now ready to create your first dashboard!
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getLibraryPendoContainerTitleText())
            .toBe(`Congratulations! You're now ready to create your first dashboard!`);
        await pendoGuide.clickPendoButton('Done');

        // Restart Your Tour Anytime!
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getLibraryPendoContainerTitleText())
            .toBe('Restart Your Tour Anytime!');
        await pendoGuide.clickPendoButton('Got It !');
    });

    it('[TC93405_04] Validate Functionality of new user experience for SaaS on Library Web - Dossier', async () => {
        await browser.url(browser.options.baseUrl);
        await libraryPage.openSidebarOnly();
        await sidebar.clickAllSection(true);
        await libraryPage.openDossier(dashboard_shared.name);
        await libraryPage.executeScript(`window.pendo.showGuideById('H1_29KzWaguva8GZzW1D0-J8RgQ');`);

        // Table of Contents
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getDossierPendoContainerText(0))
            .toBe('Table of Contents');

        // Bookmarks
        await pendoGuide.clickPendoButton('Next');
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getDossierPendoContainerText(0))
            .toBe('Bookmarks');

        // Filters
        await pendoGuide.clickPendoButton('Next');
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getDossierPendoContainerText(0))
            .toBe('Filters');

        // Share
        await pendoGuide.clickPendoButton('Next');
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getDossierPendoContainerText(0))
            .toBe('Share');

        // Account
        await pendoGuide.clickPendoButton('Next');
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getDossierPendoContainerText(0))
            .toBe('Account');

        // Auto Answers
        await pendoGuide.clickPendoButton('Next');
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getDossierPendoContainerText(0))
            .toBe('Auto Answers');

        // I think you may be looking for...
        await pendoGuide.clickPendoButton('Next');
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getDossierPendoContainerText(0))
            .toBe('I think you may be looking for...');

        // Ask me a question
        await pendoGuide.clickPendoButton('Next');
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getDossierPendoContainerText(0))
            .toBe('Ask me a question');

        // Congratulations!
        await pendoGuide.clickPendoButton('Next');
        await since('Step container title should be #{expected}, while we get #{actual}')
            .expect(await pendoGuide.getLibraryPendoContainerTitleText())
            .toBe('Congratulations!');
        await pendoGuide.clickPendoLinkButton('here');
        await pendoGuide.switchToTab(1);
        await since('Current URL should be #{expected}, instead we have #{actual}')
            .expect(await pendoGuide.currentURL())
            .toEqual('https://www.strategysoftware.com/strategyone/dashboards');
        await pendoGuide.closeTab(1);

        await pendoGuide.closePendoGuide();
        await since('Pendo guide should be closed, while we get #{actual}')
            .expect(await pendoGuide.isDossierPendoContainerPresent())
            .toBe(false);

        // check shared dossier's toolbar UI
        await since(
            'Library Home Tooltip for shared Dashboard is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await dossierPage.getLibraryHomeTooltipText())
            .toBe('Auto Express Home');
        await since('Edit button in dossier page is expected to be #{expected}, instead we have #{actual}.')
            .expect(await libraryAuthoringPage.isEditIconPresent())
            .toBe(false);
        await commentsPage.openCommentsPanelForSaaS();
        await takeScreenshotByElement(commentsPage.getCommentsPanelForSaaS(), 'TC93405_03', 'Comments Panel for SaaS', {
            tolerance: 0.3,
        });
        await commentsPage.closeCommentsPanelForSaaS();
        await since(
            'Comment tooltip after close comment panel is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await commentsPage.isTooltipDisplayed('Collaboration'))
            .toBe(false);
        await share.openSharePanel();
        await since(
            'Share options in share panel for shared dashboard expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await share.getShareDossierPanelItemsName())
            .toEqual(['Export to Excel', 'Export to PDF']);
        await share.closeSharePanel();

        // back to library home and open dashboard of owner's with others via search
        await dossierPage.goToLibrary();
        const keyword = 'saas';
        await quickSearch.openSearchSlider();

        // Search dossier
        await quickSearch.inputTextAndSearch(keyword);
        await fullSearch.openInfoWindow(dashboard_owner.name);
        await since(
            `IW options for owner dossier in search result page should be #{expected}, instead we have #{actual}`
        )
            .expect(await fullSearch.infoWindow.getActionButtonsName())
            .toEqual([
                'Add to Favorites',
                'Share Dashboard',
                'Export to Excel',
                'Export to PDF',
                'Reset',
                'Delete',
                'Edit',
                'Manage Access',
            ]);
        await since(
            `delete button tooltip for owner dossier in search result page should be #{expected}, instead we have #{actual}`
        )
            .expect(await fullSearch.infoWindow.showIconTooltip({ option: 'Remove' }))
            .toBe('Delete');
        await since('ObjectID for owner dossier info window details should be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.isObjectIDPresentInInfoWindow())
            .toBe(false);
        await since(
            'Related Content section for owner dossier info window details should be #{expected}, instead we have #{actual}'
        )
            .expect(await infoWindow.isRecommendationListPresentInInfoWindow())
            .toBe(false);
        await fullSearch.infoWindow.close();
        await fullSearch.backToLibrary();

        // check the IW options for owner's dashboard in list view
        await listView.selectListViewMode();
        await listView.openInfoWindowFromListView(dashboard_owner.name);
        // check delete confirmation dialog
        await listView.clickDeleteFromIW();
        await since('delete confirm dialog message in list view should be #{expected}, instead we have #{actual}')
            .expect(await listView.getRemoveConfirmationMessageText())
            .toBe('Delete?');
        await listView.cancelRemoveFromInfoWindow();
        await since('Delete tootip for owner dossier list view IW should be #{expected}, instead we have #{actual}')
            .expect(await listView.getDeleteIconTooltipInInfoWindow())
            .toBe('Delete');
        await since('Edit option for owner dossier list view IW should be #{expected}, instead we have #{actual}')
            .expect(await listView.isEditButtonPresentInIW())
            .toBe(true);
        await since('ObjectID for owner bot info window details should be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.isObjectIDPresentInInfoWindow())
            .toBe(false);
        await since(
            'Related Content section for owner bot info window details should be #{expected}, instead we have #{actual}'
        )
            .expect(await infoWindow.isRecommendationListPresentInInfoWindow())
            .toBe(false);
        await listView.clickCloseIcon();
        await listView.deselectListViewMode();

        // check the IW options for shared dashboard in grid view
        await libraryPage.moveDossierIntoViewPort(dashboard_shared.name);
        await libraryPage.openDossierInfoWindow(dashboard_shared.name);
        await since(`IW options for shared dashboard should be #{expected}, instead we have #{actual}`)
            .expect(await infoWindow.getActionButtonsName())
            .toEqual(['Add to Favorites', 'Export to Excel', 'Export to PDF', 'Reset']);
        await infoWindow.close();

        // click upgrade button
        await libraryPage.clickUpgradeButtonInTrialBanner();
        await libraryPage.waitForPageLoadByUrl('https://www.strategysoftware.com/express');
        await browser.url(browser.options.baseUrl);
        await libraryPage.waitForLibraryLoading();
    });

    it('[TC93405_05] Validate Functionality of the pppup when open external link', async () => {
        await browser.url(browser.options.baseUrl);
        await libraryPage.openSidebarOnly();
        await sidebar.clickAllSection(true);

        // external link on ai bot
        await libraryPage.openDossier(bot_owner.name);

        await aibotChatPanel.clickExternalLinkByText('Google');
        await since('Link Google from aibot, the popup present should be #{expected}, instead we have #{actual}')
            .expect(await saasExternalLinkDialog.isExternalLinkBoxPresent())
            .toBe(true);
        await saasExternalLinkDialog.stayHere();
        await dossierPage.goToLibrary();

        // external link on dashboard grid
        await libraryPage.openDossier(dashboard_externalLink.name);
        //// normal grid
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Grid' });
        await grid.clickGridElementLink({
            title: 'Normal Grid',
            headerName: 'Year(Link)',
            elementName: '2009',
        });
        await since('Link from normal grid, the popup present should be #{expected}, instead we have #{actual}')
            .expect(await saasExternalLinkDialog.isExternalLinkBoxPresent())
            .toBe(true);
        await saasExternalLinkDialog.stayHere();

        //// AG grid
        await grid.clickGridElementLink({
            title: 'Modern Grid',
            headerName: 'Year(Link)',
            elementName: '2009',
            agGrid: true,
        });
        await since('Link from ag grid, the popup present should be #{expected}, instead we have #{actual}')
            .expect(await saasExternalLinkDialog.isExternalLinkBoxPresent())
            .toBe(true);
        await saasExternalLinkDialog.openLink();
        await since('Link from ag grid, open link, the browsers tab should be #{expected}, instead we have #{actual} ')
            .expect((await dossierPage.getBrowserTabs()).length)
            .toBe(2);
        await dossierPage.closeTab(1);

        // external link on dashboard text
        //// text - link external
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Text' });
        await textbox.navigateLink(0);
        await since('Link from text, the popup present should be #{expected}, instead we have #{actual}')
            .expect(await saasExternalLinkDialog.isExternalLinkBoxPresent())
            .toBe(true);
        await saasExternalLinkDialog.stayHere();

        //// image -link internal
        await imageContainer.navigateLinkInCurrentPage(0);
        await since('Internal link, the popup present should be #{expected}, instead we have #{actual}')
            .expect(await saasExternalLinkDialog.isExternalLinkBoxPresent())
            .toBe(false);
        await since('Internal link, the browsers tab should be #{expected}, instead we have #{actual} ')
            .expect((await dossierPage.getBrowserTabs()).length)
            .toBe(2);
        await dossierPage.closeTab(1);
        await dossierPage.goToLibrary();
    });
});

export const config = specConfiguration;
