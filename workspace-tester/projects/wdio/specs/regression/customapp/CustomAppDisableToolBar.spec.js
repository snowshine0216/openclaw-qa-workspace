import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import * as customApp from '../../../constants/customApp/customAppBody.js';
import * as consts from '../../../constants/customApp/info.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';

describe('Custom App - Disable Toolbar', () => {
    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1600,
        height: 1200,
    };

    let { loginPage, dossierPage, libraryPage, infoWindow, grid, promptEditor, filterSummary, baseVisualization } =
        browsers.pageObj1;

    let collapseToolbarBody = customApp.getCustomAppBody({
        version: 'v1',
        name: 'autoDisableToolbar',
        toolbarMode: 1,
        toolbarEnabled: false,
    });

    let customAppIdDisableToolbar, customAppIdDisableToolbarDossierAsHome;

    beforeAll(async () => {
        await loginPage.login(consts.appUser.credentials);
        await setWindowSize(browserWindow);
        customAppIdDisableToolbar = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: collapseToolbarBody,
        });
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
    });

    afterAll(async () => {
        await deleteCustomAppList({
            credentials: consts.mstrUser.credentials,
            customAppIdList: [customAppIdDisableToolbar, customAppIdDisableToolbarDossierAsHome],
        });
    });

    it('[TC78890] Library as home - Dossier Linking', async () => {
        await libraryPage.openCustomAppById({ id: customAppIdDisableToolbar });
        await libraryPage.waitForLibraryLoading();
        await libraryPage.openDossierInfoWindow(consts.testedDossier.name);
        await takeScreenshotByElement(
            infoWindow.getActionIcons(),
            'TC78890_01',
            'Custom info window - Only show delete icon'
        );
        await infoWindow.close();
        await libraryPage.openDossier(consts.testedDossier.name);

        await grid.linkToDossier({
            title: 'open in new tab',
            headerName: 'Subcategory',
            elementName: 'Business',
        });
        await dossierPage.switchToNewWindow();
        await since(
            'open toolbar disabled app and link to new tab, toolbar shows up is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await dossierPage.isNavigationBarPresent())
            .toBe(false);
        await since(
            'open toolbar disabled app and link to new tab, collapse icon shows up is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await dossierPage.getNavigationBarCollapsedIcon().isDisplayed())
            .toBe(false);
        let currentUrl = await browser.getUrl();
        await since(
            'open toolbar disabled app and link to new tab, url contains config id is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(currentUrl.includes(customAppIdDisableToolbar))
            .toBe(true);

        await grid.linkToDossier({
            title: 'this tab, not pass filter',
            headerName: 'Subcategory',
            elementName: 'Business',
        });

        await since(
            'open toolbar disabled app and link to current tab, tool bar shows up is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await dossierPage.getNavigationBar().isDisplayed())
            .toBe(false);
        await since(
            'open toolbar disabled app and link to current tab, collapse icon shows up is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await dossierPage.getNavigationBarCollapsedIcon().isDisplayed())
            .toBe(false);
        currentUrl = await browser.getUrl();
        await since(
            'open toolbar disabled app and link to current tab, config id shows up in url is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(currentUrl.includes(customAppIdDisableToolbar))
            .toBe(true);
        await dossierPage.closeTab(1);
    });

    it('[TC76715] Dossier as home - AE Prompt', async () => {
        // create app
        let collapseToolbarDossierAsHomeBody = customApp.getCustomAppBody({
            version: 'v1',
            name: 'autoDisableToolbarDossierAsHome',
            toolbarMode: 1,
            toolbarEnabled: false,
            dossierMode: 1,
            url: `/app/${consts.promptHomeDossier.projectId}/${consts.promptHomeDossier.dossierId}`,
        });
        customAppIdDisableToolbarDossierAsHome = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: collapseToolbarDossierAsHomeBody,
        });
        await dossierPage.openCustomAppById({ id: customAppIdDisableToolbarDossierAsHome, dossier: true });
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since(
            'open disabled toolbar app with prompt dossier as home, tool bar shows up is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await dossierPage.getNavigationBar().isDisplayed())
            .toBe(false);
        await since(
            'open disabled toolbar app with prompt dossier as home,collapse icon shows up is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await dossierPage.getNavigationBarCollapsedIcon().isDisplayed())
            .toBe(false);
        await baseVisualization.clickVisualizationTitle('Visualization 1');
        await baseVisualization.openMenuOnVisualization('Visualization 1');
        await since(
            'open disabled toolbar app, export button shows up in viz is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await baseVisualization.isContextMenuOptionPresent({ level: 1, option: 'Export' }))
            .toBe(false);
        await since(
            'open disabled toolbar app, show data button shows up in viz is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await baseVisualization.isContextMenuOptionPresent({ level: 0, option: 'Show Data' }))
            .toBe(true);
        await since(
            'open disabled toolbar app, filter summary shows up to is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await filterSummary.getFilterCount().isDisplayed())
            .toBe(true);
        await filterSummary.viewAllFilterItems();
        await since(
            'open disabled toolbar app, edit button in filter summary shows up is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await filterSummary.getEditIcon().isDisplayed())
            .toBe(false);
    });
});
