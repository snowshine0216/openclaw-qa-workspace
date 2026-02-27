import { browserWindow } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import * as bot from '../../../constants/bot2.js';
import { takeScreenshot, takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { disableAI } from '../../../api/bot2/enableAIAPI.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';

describe('Bot 2.0 Enable for AI', () => {
    const project = {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    };
    const enableAIFolder = {
        name: 'EnableForAI',
        path: ['Shared Reports', 'Bot2.0', 'Automation', 'EnableForAI'],
    };
    const cube_MTDI = {
        id: '54DAC1A5AF4DB62B40A22D95CF01DAF8',
        name: 'AUTO_EnableAI_MTDI',
        project: project,
    };
    const cube_OLAP = {
        id: 'A20C1F7A004072F08F0495BB13C0E154',
        name: 'AUTO_EnableAI_OLAP',
        project: project,
    };
    const cube_LiveCube = {
        id: '60F423BCDA45394E00D1EF901C7C071B',
        name: 'AUTO_EnableAI_LiveCube',
        project: project,
    };
    const cube_Unpublished = {
        id: '543C1173F9490D5006AD7CA252709033',
        name: 'AUTO_EnableAI_OLAP_Unpublish',
        project: project,
    };
    const mosaic_InMemory = {
        id: 'C33F8EC26F47C12ED6ACADB315AD328F',
        name: 'AUTO_EnableAI_Mosaic_InMemory',
        project: project,
    };
    const mosaic_DDA = {
        id: 'A02C29B1C64FB4C964F559A65A92705B',
        name: 'AUTO_EnableAI_Mosaic_DDA',
        project: project,
    };
    const mosaic_Unpublished = {
        id: 'BD024918BC484A038E17AAB67E0318CA',
        name: 'AUTO_EnableAI_Mosaic_Unpublished',
        project: project,
    };
    const mosaic_linking_Enhance_Live = {
        id: 'D98EEE629748080CF7B72B9DB33CAB16',
        name: 'AUTO_MosaicLinking_Enhanced_Live',
        project: project,
    };
    const mosaic_linking_Enhanced_Import = {
        id: '2ECE01C2659C427B8EDD8096860C12D2',
        name: 'AUTO_MosaicLinking_Enhanced_Import',
        project: project,
    };
    const mosaic_linking_Uber = {
        id: '33755C2469FB48C987CE5AD1D59C1EA8',
        name: 'AUTO_MosaicLinking_Uber',
        project: project,
    };
    const mosaic_linking_Unpublished = {
        id: 'B0F545FD480646D7AA7D72500AFB28DD',
        name: 'AUTO_MosaicLinking_Unpublished',
        project: project,
    };
    const report_MTDI = {
        id: '34E9009F2845DC23893BD88169A1E337',
        name: 'AUTO_EnableAI_MTDI_SubsetReport',
        project: project,
    };
    const report_OLAP = {
        id: 'EDBDB5616C45E2C49E5AC1842421B415',
        name: 'AUTO_EnableAI_OLAP_SubsetReport',
        project: project,
    };
    const report_prompt = {
        id: '96F72111FA49DB1D53B4C8820867B1D5',
        name: 'AUTO_EnableAI_SubsetReport_Prompt',
        project: project,
    };
    const report_Normal = {
        id: 'D06A1BF6B04CD60FA222B7B181C5643C',
        name: 'AUTO_EnableAI_NormalReport',
        project: project,
    };
    const report_Unpublished = {
        id: '30AC388B644CAA7846496784660186FA',
        name: 'AUTO_EnableAI_SubsetReport_Unpublish',
        project: project,
    };
    const ADC = {
        id: '3D5BDD69B54AE9CB7F9485AF41B0250B',
        name: 'AUTO_EnableAI_ADC',
        project: project,
    };
    const agent = {
        id: '7EBE9987F7A14150BAAA9BD48FBE5EEC',
        name: 'AUTO_EnableAI_Agent',
        project: project,
    };

    let { loginPage, libraryPage, sidebar, contentDiscovery, infoWindow, listView, quickSearch, fullSearch } =
        browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await disableAI({
            credentials: bot.enableAIUser,
            projectId: project.id,
            objectIds: [cube_MTDI.id, cube_OLAP.id, mosaic_InMemory.id, mosaic_DDA.id, report_MTDI.id, report_OLAP.id],
        });
    });

    beforeEach(async () => {
        await libraryPage.resetToLibraryHome();
        await loginPage.login(bot.enableAIUser);

        // open homepage
        await libraryPage.openSidebarOnly();
        await sidebar.openAllSectionList();
        await listView.deselectListViewMode();
    });

    afterEach(async () => {
        await logoutFromCurrentBrowser();
    });

    afterAll(async () => {
        // await disableAI({
        //     credentials: bot.enableAIUser,
        //     projectId: project.id,
        //     objectIds: [cube_MTDI.id, cube_OLAP.id, mosaic_InMemory.id, mosaic_DDA.id, report_MTDI.id, report_OLAP.id],
        // });
    });

    it('[TC99029_01] Enable AI - Enable AI on grid view', async () => {
        await disableAI({
            credentials: bot.enableAIUser,
            projectId: project.id,
            objectIds: [cube_MTDI.id],
        });

        // Switch to data blade
        await sidebar.openDataSection();

        // Enable AI from context menu in grid view
        await libraryPage.openDossierContextMenu(cube_MTDI.name);
        await since('Enable for AI option should be present in context menu, actual: #{actual}')
            .expect(await libraryPage.isItemDisplayedInContextMenu('Enable for AI'))
            .toBe(true);
        await takeScreenshotByElement(
            libraryPage.getDossierContextMenu(),
            'TC99029_01',
            'gridView_contextMenu_enableForAI'
        );

        // Click Enable for AI from context menu
        await libraryPage.clickDossierContextMenuItem('Enable for AI');
        await libraryPage.waitForEnableAIReady(cube_MTDI.name);
        await since('Home card show enabled AI icon should be #{actual}, instead it is #{actual}')
            .expect(await libraryPage.getHomeCardAIEnabledIcon(cube_MTDI.name).isDisplayed())
            .toBe(true);

        // Hover icon
        await libraryPage.hoverHomeCardAIEnabledIcon(cube_MTDI.name);
        await since('Tooltip should be #{actual}, instead it is #{actual}')
            .expect(await libraryPage.getTooltipText())
            .toContain('Enabled for AI');

        // Disable AI from info window
        await libraryPage.openDossierInfoWindow(cube_MTDI.name);
        await since('Enable AI status present should be #{actual}, instead it is #{actual}')
            .expect(await infoWindow.isAIEnabled())
            .toBe(true);
        await takeScreenshotByElement(infoWindow.getActionIcons(), 'TC99029_01', 'gridView_infoWindow_enableAI');

        // // Click Disable for AI from info window
        await infoWindow.disableForAI();
        await since('After disabling AI and the indicator present should be #{expected}, instead it is #{actual}')
            .expect(await infoWindow.isAIEnabled())
            .toBe(false);
        await infoWindow.close();
    });

    it('[TC99029_02] Enable AI - Enable AI on list view', async () => {
        await disableAI({
            credentials: bot.enableAIUser,
            projectId: project.id,
            objectIds: [cube_MTDI.id],
        });

        // Switch to data blade
        await sidebar.openDataSection();
        await listView.selectListViewMode();

        // Enable AI from info window
        await listView.openContextMenu(cube_MTDI.name);
        await listView.clickContextMenuItem('Get Info');
        await since('Enable AI status present should be #{actual}, instead it is #{actual}')
            .expect(await listView.isAIEnabledInInfoWindow())
            .toBe(false);
        await takeScreenshotByElement(listView.getItemShare(), 'TC99029_02', 'listView_infoWindow_disableAI');

        // Click Enable for AI from info window
        await listView.enableForAI();
        await since('After enabling AI and the status present should be #{expected}, instead it is #{actual}')
            .expect(await listView.isAIEnabledInInfoWindow())
            .toBe(true);
        await takeScreenshotByElement(listView.getItemShare(), 'TC99029_02', 'listView_infoWindow_enableAI');
        const pattern = `Enabled for AI by ${bot.enableAIUser.username} on \\d{1,2}/\\d{1,2}/\\d{4}, \\d{1,2}:\\d{2}:\\d{2} (AM|PM)`;
        await since('After enabling AI and the text should match pattern #{expected}, instead it is #{actual}')
            .expect(await listView.getEnabledForAIStatusText().getText())
            .toMatch(new RegExp(pattern));
        
        // Replace dynamic timestamp with fixed one for consistent screenshot
        const statusElement = await listView.getEnabledForAIStatusText();
        await browser.execute((elem, username) => {
            elem.textContent = `Enabled for AI by ${username} on 1/1/2026, 12:01:02 PM`;
        }, statusElement, bot.enableAIUser.username);
        
        await takeScreenshotByElement(
            listView.getEnableForAIStatusContainer(),
            'TC99029_02',
            'listView_infoWindow_enableForAI_status',
            { tolerance: 2 }
        );
        await listView.clickCloseIcon();

        // Disable AI from context menu
        await listView.openContextMenu(cube_MTDI.name);
        await since('Disable for AI option should be present in context menu, actual: #{actual}')
            .expect(await listView.isItemDisplayedInContextMenu('Disable for AI'))
            .toBe(true);
        await takeScreenshotByElement(
            listView.getDossierContextMenu(),
            'TC99029_02',
            'listView_contextMenu_disableForAI'
        );

        // Click Disable for AI from context menu
        await listView.clickContextMenuItem('Disable for AI');
        await listView.sleep(500); // wait for status update
        await since('List column enabled AI status should be #{expected}, instead it is #{actual}')
            .expect(await listView.isAIEnabledInListColumn(cube_MTDI.name))
            .toBe(false);

        await takeScreenshotByElement(
            listView.getEnabledForAIIndicator(cube_MTDI.name),
            'TC99029_02',
            'listView_homeCard_enableForAI_indicator'
        );
        await listView.hoverEnabledForAIIndicator(cube_MTDI.name);
        await listView.sleep(100); // wait for tooltip to appear
        await takeScreenshotByElement(listView.getTooltip(), 'TC99029_02', 'listView_homeCard_enableForAI_tooltip');

        // Clear selection
        await listView.deselectListViewMode();
    });

    it('[TC99029_03] Enable AI - Enable AI on data blade page', async () => {
        await disableAI({
            credentials: bot.enableAIUser,
            projectId: project.id,
            objectIds: [cube_MTDI.id, mosaic_DDA.id],
        });
        // Open data blade from homecard
        await sidebar.openDataSection();

        // Different objects which are able to enable for AI
        const testObjects_positive = [
            { obj: cube_MTDI, type: 'MTDI Cube' },
            { obj: mosaic_DDA, type: 'DDA Mosaic' },
        ];

        for (const dataObject of testObjects_positive) {
            await libraryPage.openDossierContextMenu(dataObject.obj.name);
            // Verify Enable for AI option is available for this object type
            await since(`Enable for AI should be available for ${dataObject.type} but actual: #{actual}`)
                .expect(await libraryPage.isItemDisplayedInContextMenu('Enable for AI'))
                .toBe(true);
            await libraryPage.clickDossierContextMenuItem('Enable for AI');
            await libraryPage.waitForEnableAIReady(dataObject.obj.name);
            // Verify success for this object type
            await since(`Enable for AI should succeed for ${dataObject.type}`)
                .expect(await libraryPage.isAIEnabled(dataObject.obj.name))
                .toBe(true);
        }

        // Different objects which doesn't support enable for AI
        const testObjects_negative = [
            { obj: ADC, type: 'ADC' },
            { obj: cube_LiveCube, type: 'Live Cube' },
        ];

        for (const dataObject of testObjects_negative) {
            await libraryPage.refresh();
            // no enable for AI option on context menu
            await libraryPage.openDossierContextMenu(dataObject.obj.name);
            await since(`Enable for AI is unavailable on context menu for ${dataObject.type}, actual: #{actual}`)
                .expect(await libraryPage.isItemDisplayedInContextMenu('Enable for AI'))
                .toBe(false);
            // no enable for AI option on info-window
            await libraryPage.clickDossierContextMenuItem('Get Info');
            await since(`Enable for AI is unavailable on info-window for ${dataObject.type}, actual: #{actual}`)
                .expect(await infoWindow.isEnableForAIDisplayed())
                .toBe(false);
            await infoWindow.close();
        }
    });

    it('[TC99029_04] Enable AI - Enable AI on search results page', async () => {
        await disableAI({
            credentials: bot.enableAIUser,
            projectId: project.id,
            objectIds: [cube_OLAP.id, mosaic_DDA.id, report_MTDI.id],
        });
        // Test Enable AI from search results
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch('EnableAI');
        await fullSearch.waitForSearchLoading();
        await fullSearch.clickAllTab();

        // Different objects which are able to enable for AI
        const testObjects_positive = [
            { obj: cube_OLAP, type: 'OLAP Cube' },
            { obj: mosaic_DDA, type: 'DDA Mosaic' },
            { obj: report_MTDI, type: 'MTDI Report' },
        ];
        for (const dataObject of testObjects_positive) {
            await fullSearch.inputTextAndSearch('EnableAI');
            await fullSearch.openInfoWindow(dataObject.obj.name);
            // Verify Enable for AI option is available for this object type
            await since(`Enable for AI should be available for ${dataObject.type} but actual: #{actual}`)
                .expect(await infoWindow.isEnableForAIDisplayed())
                .toBe(true);
            await infoWindow.enableForAI();
            // Verify success for this object type
            await since(`Enable for AI should succeed for ${dataObject.type} but actual: #{actual}`)
                .expect(await infoWindow.isAIEnabled(dataObject.obj.name))
                .toBe(true);
            await infoWindow.close();
        }

        // Different objects which doesn't support enable for AI
        const testObjects_negative = [
            { obj: cube_LiveCube, type: 'Live Cube' },
            { obj: ADC, type: 'ADC' },
            { obj: report_Normal, type: 'Normal Report' },
            { obj: report_prompt, type: 'Prompt Report' },
        ];
        for (const dataObject of testObjects_negative) {
            await fullSearch.inputTextAndSearch('EnableAI');
            await fullSearch.openInfoWindow(dataObject.obj.name);
            // Verify Enable for AI option is available for this object type
            await since(`Enable for AI should be unavailable for ${dataObject.type}, actual: #{actual}`)
                .expect(await infoWindow.isEnableForAIDisplayed())
                .toBe(false);
            await infoWindow.close();
        }
    });

    it('[TC99029_05] Enable AI - Enable AI on folder browsing page ', async () => {
        await disableAI({
            credentials: bot.enableAIUser,
            projectId: project.id,
            objectIds: [mosaic_InMemory.id, report_OLAP.id],
        });
        // Navigate to Content Discovery and browse to EnableAI folder
        await sidebar.openContentDiscovery();
        await contentDiscovery.openProjectList();
        await contentDiscovery.searchProject('tutorial');
        await contentDiscovery.selectProject(project.name);
        await contentDiscovery.openFolderByPath(enableAIFolder.path);

        // Test different object types in content discovery
        const testObjects_positive = [
            { obj: mosaic_InMemory, type: 'In Memory Mosaic' },
            { obj: report_OLAP, type: 'OLAP Report' },
        ];

        for (const dataObject of testObjects_positive) {
            await listView.openInfoWindowFromListView(dataObject.obj.name);
            await since(
                `Enable for AI should be available for ${dataObject.type} in content discovery, actual: #{actual}`
            )
                .expect(await listView.isAIEnabledInInfoWindow())
                .toBe(false);
            await listView.enableForAI();
            await since(`Enable for AI should succeed for ${dataObject.type} in content discovery`)
                .expect(await listView.isAIEnabledInInfoWindow())
                .toBe(true);
            await listView.clickCloseIcon();
        }

        // Test objects that don't support Enable for AI
        const testObjects_negative = [
            { obj: ADC, type: 'ADC' },
            { obj: report_Normal, type: 'Normal Report' },
            { obj: report_prompt, type: 'Prompt Report' },
            { obj: agent, type: 'Agent' },
        ];

        for (const dataObject of testObjects_negative) {
            await listView.openContextMenu(dataObject.obj.name);
            await since(
                `Enable for AI should be unavailable for ${dataObject.type} in content discovery, actual: #{actual}`
            )
                .expect(await listView.isItemDisplayedInContextMenu('Enable for AI'))
                .toBe(false);
            await listView.clickContextMenuItem('Get Info');
            await since(
                `Enable for AI should be unavailable in info window for ${dataObject.type} in content discovery, actual: #{actual}`
            )
                .expect(await listView.isAIEnabledInInfoWindow())
                .toBe(false);
            await listView.clickCloseIcon();
        }
    });

    it('[TC99029_06] Enable AI - Enable AI on library homepage', async () => {
        await disableAI({
            credentials: bot.enableAIUser,
            projectId: project.id,
            objectIds: [cube_MTDI.id, cube_OLAP.id, mosaic_InMemory.id, mosaic_DDA.id],
        });

        // Different objects which are able to enable for AI
        const testObjects_positive = [
            { obj: report_MTDI, type: 'MTDI Report' },
            { obj: report_OLAP, type: 'OLAP Report' },
        ];

        for (const dataObject of testObjects_positive) {
            await libraryPage.openDossierInfoWindow(dataObject.obj.name);
            // Verify Enable for AI option is available for this object type
            await since(`Enable for AI should be available for ${dataObject.type}, actual: #{actual}`)
                .expect(await infoWindow.isEnableForAIDisplayed())
                .toBe(true);
            await infoWindow.enableForAI();
            await since(`Enable for AI should succeed for ${dataObject.type}, actual: #{actual}`)
                .expect(await infoWindow.isEnableForAIDisplayed())
                .toBe(true);
            await infoWindow.close();
        }
        // Different objects which doesn't support enable for AI
        const testObjects_negative = [
            { obj: report_Normal, type: 'Normal Report' },
            { obj: report_prompt, type: 'Prompt Report' },
            { obj: agent, type: 'Agent' },
        ];

        for (const dataObject of testObjects_negative) {
            // no enable for AI option on context menu
            await libraryPage.openDossierContextMenu(dataObject.obj.name);
            await since(`Enable for AI is unavailable on context menu for ${dataObject.type}, actual: #{actual}`)
                .expect(await libraryPage.isItemDisplayedInContextMenu('Enable for AI'))
                .toBe(false);
            // no enable for AI option on info-window
            await libraryPage.clickDossierContextMenuItem('Get Info');
            await since(`Enable for AI is unavailable on info-window for ${dataObject.type}, actual: #{actual}`)
                .expect(await infoWindow.isEnableForAIDisplayed())
                .toBe(false);
            await infoWindow.close();
        }
    });

    it('[TC99029_07] Enable AI - Error handling when enable AI ', async () => {
        // Open search results page
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch('EnableAI');
        await fullSearch.waitForSearchLoading();
        await fullSearch.clickAllTab();

        // Different objects which does't publish yet
        const testObjects_positive = [
            { obj: cube_Unpublished, type: 'Unpublished OLAP Cube', string: 'report' },
            { obj: report_Unpublished, type: 'Unpublished Subset Report', string: 'report' },
            { obj: mosaic_Unpublished, type: 'Unpublished Mosaic Model', string: 'report' },
        ];
        for (const dataObject of testObjects_positive) {
            await fullSearch.openInfoWindow(dataObject.obj.name);
            // Verify Enable for AI option is available for this object type
            await since(`Enable for AI should be available for ${dataObject.type} but actual: #{actual}`)
                .expect(await infoWindow.isEnableForAIDisplayed())
                .toBe(true);
            await infoWindow.enableForAI(true);
            // Verify error popup
            await since(`Error notification should show when enabling AI for ${dataObject.type} but actual: #{actual}`)
                .expect(await libraryPage.isErrorPresent())
                .toBe(true);
            await libraryPage.showDetails();
            await since(`Error details for ${dataObject.type} should be #{expected} but it is#{actual}`)
                .expect(await libraryPage.errorDetails())
                .toContain(
                    `This manipulation is not supported for this type of ${dataObject.string}[Enabling AI On unpublished Cube]`
                );
            await libraryPage.dismissError();
            await infoWindow.close();
        }
    });

    it('[TC99029_08] Enable AI - Privilede check when enable AI', async () => {
        await disableAI({
            credentials: bot.enableAIUser,
            projectId: project.id,
            objectIds: [mosaic_InMemory.id],
        });
        // switch to no privilege user
        await libraryPage.openUserAccountMenu();
        await libraryPage.logout();
        await loginPage.login(bot.enableAINoPrivilegeUser);
        await libraryPage.openSidebarOnly();

        // homepage
        await sidebar.openAllSectionList();
        await libraryPage.openDossierInfoWindow(report_OLAP.name);
        await since('Enable for AI present on report should be #{expected} while it is#{actual}')
            .expect(await infoWindow.isEnableForAIDisplayed())
            .toBe(false);
        await infoWindow.close();

        // data blade
        await sidebar.openDataSection();
        await libraryPage.openDossierContextMenu(mosaic_InMemory.name);
        await since('Enable for AI present on mosaic model should be #{expected} while it is#{actual}')
            .expect(await libraryPage.isItemDisplayedInContextMenu('Enable for AI'))
            .toBe(false);
        await libraryPage.clickDossierContextMenuItem('Get Info');
        await since('Enable for AI present on mosaic model info window should be #{expected} while it is#{actual}')
            .expect(await infoWindow.isEnableForAIDisplayed())
            .toBe(false);
        await infoWindow.close();

        // search result page
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch('EnableAI');
        await fullSearch.waitForSearchLoading();
        await fullSearch.clickAllTab();
        await fullSearch.openInfoWindow(report_MTDI.name);
        await since('Enable for AI present on report in search results should be #{expected} while it is#{actual}')
            .expect(await infoWindow.isEnableForAIDisplayed())
            .toBe(false);
        await infoWindow.close();
    });

    it('[TC99029_09] Enable AI - Enable AI for mosaic linking', async () => {
        await disableAI({
            credentials: bot.enableAIUser,
            projectId: project.id,
            objectIds: [
                mosaic_linking_Enhance_Live.id,
                mosaic_linking_Enhanced_Import.id,
                mosaic_linking_Uber.id,
                mosaic_linking_Unpublished.id,
            ],
        });
        // Open data blade from homecard
        await sidebar.openDataSection();

        // Different objects which are able to enable for AI
        const testObjects_positive = [
            { obj: mosaic_linking_Enhance_Live, type: 'Enhanced Live Mosaic Linking' },
            { obj: mosaic_linking_Enhanced_Import, type: 'Enhanced Import Mosaic Linking' },
            { obj: mosaic_linking_Uber, type: 'Uber Mosaic Linking' },
        ];

        for (const dataObject of testObjects_positive) {
            await libraryPage.openDossierContextMenu(dataObject.obj.name);
            // Verify Enable for AI option is available for this object type
            await since(`Enable for AI should be available for ${dataObject.type} but actual: #{actual}`)
                .expect(await libraryPage.isItemDisplayedInContextMenu('Enable for AI'))
                .toBe(true);
            await libraryPage.clickDossierContextMenuItem('Enable for AI');
            await libraryPage.waitForEnableAIReady(dataObject.obj.name);
            // Verify success for this object type
            await since(`Enable for AI should succeed for ${dataObject.type}`)
                .expect(await libraryPage.isAIEnabled(dataObject.obj.name))
                .toBe(true);
        }

        // Different objects which doesn't support enable for AI
        const testObjects_negative = [{ obj: mosaic_linking_Unpublished, type: 'Mosaic Linking' }];

        for (const dataObject of testObjects_negative) {
            await libraryPage.refresh();
            await libraryPage.openDossierInfoWindow(dataObject.obj.name);
            // Verify Enable for AI option is available for this object type
            await since(`Enable for AI should be available for ${dataObject.type} but actual: #{actual}`)
                .expect(await infoWindow.isEnableForAIDisplayed())
                .toBe(true);
            await infoWindow.enableForAI(true);
            // Verify error popup
            await since(`Error notification should show when enabling AI for ${dataObject.type} but actual: #{actual}`)
                .expect(await libraryPage.isErrorPresent())
                .toBe(true);
            await libraryPage.showDetails();
            await since(`Error details for ${dataObject.type} should be #{expected} but it is#{actual}`)
                .expect(await libraryPage.errorDetails())
                .toContain(
                    `The linked Mosaic model "${mosaic_Unpublished.name}" is not published. Please publish the model before enabling AI.`
                );
            await libraryPage.dismissError();
            await infoWindow.close();
        }
    });
});
