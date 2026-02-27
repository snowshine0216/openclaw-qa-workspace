import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import resetDossierState from '../../../api/resetDossierState.js';
import * as consts from '../../../constants/customApp/info.js';
import * as customApp from '../../../constants/customApp/customAppBody.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';

describe('Custom Palettes', () => {
    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1600,
        height: 1200,
    };

    // const config = {
    //     defaultApp: 'C2B2023642F6753A2EF159A75E0CFF29',
    //     customPaletteLibrary: '60095ECA8D5442DF8327DDCD19EBC66A',
    // };

    const tolerance = 0.25;

    let {
        loginPage,
        dossierPage,
        libraryPage,
        dossierAuthoringPage,
        libraryAuthoringPage,
        grid,
        searchPage,
        librarySearch,
        toc,
    } = browsers.pageObj1;

    let libraryHomeColorPalettes = customApp.getCustomAppBody({
        version: 'v1',
        name: 'autoLibraryHomeColorPalettes',
        applicationPalettes: ['7B5D161644EDA945470BE6BB622CB69A', '4866E0694F8F646443342184243A6EB1'],
        applicationDefaultPalette: '7B5D161644EDA945470BE6BB622CB69A',
        useConfigPalettes: true,
    });

    let customAppIdLibraryHomeColorPalettes;

    beforeAll(async () => {
        await loginPage.login(consts.appUser.credentials);
        await setWindowSize(browserWindow);
        customAppIdLibraryHomeColorPalettes = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: libraryHomeColorPalettes,
        });
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
    });

    afterAll(async () => {
        await deleteCustomAppList({
            credentials: consts.mstrUser.credentials,
            customAppIdList: [customAppIdLibraryHomeColorPalettes],
        });
    });

    async function searchDossierNotInLibraryAndRunIt(dossierName, appInfo) {
        await librarySearch.openSearchBox();
        await librarySearch.search(dossierName);
        await librarySearch.pressEnter();
        await searchPage.switchToOption('all');
        await libraryPage.waitForItemLoading();
        await searchPage.executeGlobalResultItem(dossierName);
        await dossierPage.waitForDossierLoading();
        // await dossierPage.sleep(2000);
        await dossierPage.hidePageIndicator();
        await takeScreenshotByElement(await dossierPage.getDossierView(), 'TC81474_6', appInfo + ':' + dossierName, {
            tolerance: 0.15,
        });
        await dossierPage.goToLibrary();
    }

    // browseloop to test all pages are applied with app's default palette
    it('[TC81474_1] Test browseloop dossier to check colorby threshold and customized color using custom palette ', async () => {
        await resetDossierState({
            credentials: consts.appUser.credentials,
            dossier: consts.dossierPalette,
        });
        // check in custom application, the default custom palette is applied for all pages
        await dossierPage.openCustomAppById({ id: customAppIdLibraryHomeColorPalettes });
        await libraryPage.openDossier(consts.dossierPalette.name);
        // browse loop
        await toc.browseloop('TC81474_1');
    });

    // check dossier using its own pallette & link to other dossier
    it('[TC81474_2] Test dossier using its own palette and linking', async () => {
        await resetDossierState({
            credentials: consts.appUser.credentials,
            dossier: consts.customDossierPalette,
        });
        // dossier using customized palette
        await dossierPage.openCustomAppById({ id: customAppIdLibraryHomeColorPalettes });
        await libraryPage.openDossier(consts.customDossierPalette.name);
        await dossierPage.hidePageIndicator();
        // check custom palette is applied
        await takeScreenshotByElement(
            await dossierPage.getDossierView(),
            'TC81474_2',
            'custom palette for this dossier is applied',
            { tolerance: 0.18 }
        );

        // link to dossier using app's default palette
        await grid.linkToTargetByGridContextMenu({
            title: 'Visualization 1',
            headerName: 'Category',
            elementName: 'Books',
        });
        await dossierPage.switchToTab(1);
        await dossierPage.waitForDossierLoading();
        // check custom app's default palette is applied
        await dossierPage.hidePageIndicator();
        await takeScreenshotByElement(
            await dossierPage.getDossierView(),
            'TC81474_2',
            'custom palette for linked dossier is applied',
            { tolerance: 0.18 }
        );
        await dossierPage.closeTab(1);
        await dossierPage.switchToTab(0);
    });

    // change project level palette won't affect the dossier using config level palette
    it('[TC81474_3] Test change project level palette wont affect the dossier using config level palette', async () => {
        await resetDossierState({
            credentials: consts.appUser.credentials,
            dossier: consts.defaultDossierPalette,
        });
        // in default app
        await libraryPage.openDefaultApp();
        await libraryPage.openDossier(consts.defaultDossierPalette.name);
        await dossierPage.hidePageIndicator();
        // check project level palette is applied
        await takeScreenshotByElement(
            await dossierPage.getDossierView(),
            'TC81474_3',
            'project level palette is applied',
            { tolerance: tolerance }
        );
        await libraryAuthoringPage.editDossierFromLibrary();
        await dossierAuthoringPage.actionOnMenubar('Format');
        // check 'Arctic' is selected
        await takeScreenshotByElement(
            await dossierAuthoringPage.getDropdownContainerFromMenubar(),
            'TC81474_3',
            'the Arctic palette should be checked by default',
            { tolerance: tolerance }
        );
        // change to Sunset
        await dossierAuthoringPage.actionOnSubmenu('Sunset');
        // check palette is applied
        await takeScreenshotByElement(
            await dossierAuthoringPage.getDossierView(),
            'TC81474_3',
            'Sunset palette is applied',
            { tolerance: tolerance }
        );
        // save and exit edit mode, check palette is applied
        await dossierAuthoringPage.clickSaveDossierButton(consts.defaultDossierPalette.name);
        await dossierAuthoringPage.clickCloseDossierButton();
        await takeScreenshotByElement(
            await dossierPage.getDossierView(),
            'TC81474_3',
            'Sunset palette is applied after exit edit mode',
            { tolerance: tolerance }
        );

        // check in custom application, the default custom palette is applied
        await dossierPage.openCustomAppById({ id: customAppIdLibraryHomeColorPalettes });
        await libraryPage.openDossier(consts.defaultDossierPalette.name);
        await dossierPage.hidePageIndicator();
        await takeScreenshotByElement(await dossierPage.getDossierView(), 'TC81474_3', 'custom palette is applied', {
            tolerance: tolerance,
        });
        // change back to default project level palette
        await libraryPage.openDefaultApp();
        await libraryPage.openDossier(consts.defaultDossierPalette.name);
        await libraryAuthoringPage.editDossierFromLibrary();
        await dossierAuthoringPage.actionOnMenubarWithSubmenu('Format', 'Arctic');
        await dossierAuthoringPage.clickSaveDossierButton(consts.defaultDossierPalette.name);
        await dossierAuthoringPage.clickCloseDossierButton();
    });

    // change config level palette for dossier from application - don't use the app's default palette
    it('[TC81474_4] change config level palette for dossier from application', async () => {
        await dossierPage.openCustomAppById({ id: customAppIdLibraryHomeColorPalettes });
        await libraryPage.openDossier(consts.defaultDossierPalette.name);
        await libraryAuthoringPage.editDossierFromLibrary();

        await dossierAuthoringPage.actionOnMenubar('Format');
        await takeScreenshotByElement(
            await dossierAuthoringPage.getDropdownContainerFromMenubar(),
            'TC81474_4',
            'the cold palette should be checked by default',
            { tolerance: tolerance }
        );
        await dossierAuthoringPage.actionOnSubmenu('Rainbow');
        // save and exit edit mode, check palette is applied
        await dossierAuthoringPage.clickSaveDossierButton(consts.defaultDossierPalette.name);
        await dossierAuthoringPage.clickCloseDossierButton();
        await dossierPage.hidePageIndicator();
        // check palette is applied
        await takeScreenshotByElement(
            await dossierPage.getDossierView(),
            'TC81474_4',
            'the Rainbow paletted is applied',
            { tolerance: tolerance }
        );

        // check in default app -> it's changed
        await libraryPage.openDefaultApp();
        await libraryPage.openDossier(consts.defaultDossierPalette.name);
        await dossierPage.hidePageIndicator();
        // check custom palette is applied
        await takeScreenshotByElement(
            await dossierPage.getDossierView(),
            'TC81474_4',
            'the Rainbow paletted is applied',
            { tolerance: tolerance }
        );
        // Edit and change to project level palette
        await libraryAuthoringPage.editDossierFromLibrary();
        await dossierPage.hidePageIndicator();
        await takeScreenshotByElement(
            await dossierAuthoringPage.getDossierView(),
            'TC81474_4',
            'open dossier in edit mode',
            { tolerance: tolerance }
        );
        await dossierAuthoringPage.actionOnMenubar('Format');
        await takeScreenshotByElement(
            await dossierAuthoringPage.getDropdownContainerFromMenubar(),
            'TC81474_4',
            'the rainbow should be checked',
            { tolerance: tolerance }
        );
        await dossierAuthoringPage.actionOnSubmenu('Arctic');
        await dossierAuthoringPage.clickSaveDossierButton(consts.defaultDossierPalette.name);
        await dossierAuthoringPage.clickCloseDossierButton();
        await dossierPage.hidePageIndicator();
        // check palette is applied
        await takeScreenshotByElement(await dossierPage.getDossierView(), 'TC81474_4', 'Arctic palette is applied');

        // change palette to use app's default palette
        await dossierPage.openCustomAppById({ id: customAppIdLibraryHomeColorPalettes });
        await libraryPage.openDossier(consts.defaultDossierPalette.name);
        await libraryAuthoringPage.editDossierFromLibrary();
        await dossierAuthoringPage.actionOnMenubarWithSubmenu('Format', '(Default) Cold');
        await dossierAuthoringPage.clickSaveDossierButton(consts.defaultDossierPalette.name);
        await dossierAuthoringPage.clickCloseDossierButton();
        await dossierPage.hidePageIndicator();
        await takeScreenshotByElement(
            await dossierPage.getDossierView(),
            'TC81474_4',
            'default cold palette is applied',
            { tolerance: tolerance }
        );

        // check in default app -> it's using project level palette
        await libraryPage.openDefaultApp();
        await libraryPage.openDossier(consts.defaultDossierPalette.name);
        await dossierPage.hidePageIndicator();
        // check it's using default palette
        await takeScreenshotByElement(
            await dossierPage.getDossierView(),
            'TC81474_4',
            'project level palette is applied',
            { tolerance: tolerance }
        );
    });

    // new dossier in custom app -> it should use the app's default
    it('[TC81474_5] Test create a new dossier using custom palette', async () => {
        await dossierPage.openCustomAppById({ id: customAppIdLibraryHomeColorPalettes });
        await libraryAuthoringPage.createDossierFromLibrary('MicroStrategy Tutorial');
        await dossierAuthoringPage.actionOnMenubar('Format');
        await takeScreenshotByElement(
            await dossierAuthoringPage.getDropdownContainerFromMenubar(),
            'TC81474_5',
            'the  default cold should be checked by default'
        );
    });

    // global search
    it('[TC81474_6] Test global search using custom palette', async () => {
        await dossierPage.openCustomAppById({ id: customAppIdLibraryHomeColorPalettes });
        // search old object -TecPd
        await searchDossierNotInLibraryAndRunIt(consts.dossierTecPD.name, 'customApp');
        // search dossier using default palette
        await searchDossierNotInLibraryAndRunIt(consts.dossierPurple.name, 'customApp');
        // search dossier using his own palette
        await searchDossierNotInLibraryAndRunIt(consts.dossierBlack.name, 'customApp');

        // recheck in default app
        await dossierPage.openDefaultApp();
        // search old object -TecPd
        await searchDossierNotInLibraryAndRunIt(consts.dossierTecPD.name, 'defaultApp');
        // search dossier using default palette
        await searchDossierNotInLibraryAndRunIt(consts.dossierPurple.name, 'defaultApp');
        // search dossier using his own palette
        await searchDossierNotInLibraryAndRunIt(consts.dossierBlack.name, 'defaultApp');
    });

    // check warning msg -> after remember the selection relogin will remember the selection
    it('[TC81475] Test warning msg when changing custom palette', async () => {
        await dossierPage.openCustomAppById({ id: customAppIdLibraryHomeColorPalettes });
        await libraryAuthoringPage.createDossierFromLibrary('MicroStrategy Tutorial');
        await dossierAuthoringPage.actionOnMenubar('Format');
        await dossierAuthoringPage.actionOnSubmenuNoContinue('Rainbow');
        // check don't show me again and click continue
        await dossierAuthoringPage.checkNotShowAgain();
        await dossierAuthoringPage.actionOnEditorDialog('Continue');
        // relogin and verify the warning msg won't show up
        await dossierPage.openCustomAppById({ id: customAppIdLibraryHomeColorPalettes });
        await libraryAuthoringPage.createDossierFromLibrary('MicroStrategy Tutorial');
        await dossierAuthoringPage.actionOnMenubar('Format');
        await dossierAuthoringPage.actionOnSubmenuNoContinue('Rainbow');
        await since(
            'After relogin,  warning message shows up is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await dossierAuthoringPage.isEditorWindowOpened())
            .toBe(false);
        await dossierPage.openCustomAppById({ id: customAppIdLibraryHomeColorPalettes });
    });
});
