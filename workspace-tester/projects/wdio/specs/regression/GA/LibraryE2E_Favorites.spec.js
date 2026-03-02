import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { customCredentials } from '../../../constants/index.js';
import deleteAllFavorites from '../../../api/deleteAllFavorites.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_group') };

describe('E2E Favorites', () => {
    const project = {
        id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
        name: 'MicroStrategy Tutorial',
    };
    const dossier1 = {
        id: 'BCD06D184E679BBD0F18D799935D4EE4',
        name: '(AUTO) GlobalSearch_Certified document',
        project: project,
    };
    const dossier2 = {
        id: '9989C9714E97F8E7F2E0D58ACC55FE46',
        name: '(AUTO) GlobalSearch_Test Dossier',
        project: project,
    };
    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1600,
        height: 1200,
    };

    let { loginPage, libraryPage, infoWindow, sidebar, toc, dossierPage } = browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(specConfiguration.credentials);
        await deleteAllFavorites(specConfiguration.credentials);
        await libraryPage.reload();
    });

    // favorites dossier from info window
    // favorites dossier from favorite icon
    // remove from favorites by context menu in multi-select mode

    it('[TC67828_01] Validate End-to-End user journey for favorites on Library Web _ favorites by icon', async () => {
        // Favorite from favorite icon
        await libraryPage.favoriteByImageIcon(dossier1.name);
        // -- check favorites icon
        await since('Favorite dossier by favorites icon, favorites icon on dossier image should be selected')
            .expect(await libraryPage.isFavoritesIconSelected(dossier1.name))
            .toBe(true);
        await takeScreenshotByElement(
            libraryPage.getDossierImageContainer(dossier1.name),
            'TC71915',
            'FavoritesIcon_Favorites'
        );
        // -- check favorite section
        await since(
            'Favorite dossier by favorites icon, the total favorites count should be #{expected}, while we get #{actual}'
        )
            .expect(await libraryPage.getFavoritesCountFromTitle())
            .toBe(1);
        // -- check TOC menu
        await libraryPage.openDossier(dossier1.name);
        await toc.openMenu();
        await since('Favorite dossier by favorites icon, favorites icon on TOC should be selected')
            .expect(await toc.isFavoritesIconSelected(dossier1.name))
            .toBe(true);
        await toc.closeMenu({ icon: 'close' });
        await dossierPage.goToLibrary();
    });

    it('[TC67828_02] Validate End-to-End user journey for favorites on Library Web _ favorites by info-window', async () => {
        const homeCount = await libraryPage.getAllCountFromTitle();
        const favoriteCount = await libraryPage.getFavoritesCountFromTitle();

        // Favorites dossier from info-window
        await libraryPage.openDossierInfoWindow(dossier2.name);
        await infoWindow.favorite();
        await since('Favorite dossier, the total favorites count should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.getFavoritesCountFromTitle())
            .toBe(favoriteCount + 1);
        await since('Favorite dossier, the total home count should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.getAllCountFromTitle())
            .toBe(homeCount - 1);

        // -- check favorite button on info-window
        await libraryPage.openDossierInfoWindow(dossier2.name);
        await since(
            'Favorite dossier by hoempage info-window, favorites button on info-window image should be selected'
        )
            .expect(await infoWindow.isFavoritesBtnSelected())
            .toBe(true);

        await infoWindow.close();
        // -- check TOC menu
        await libraryPage.openDossier(dossier2.name);
        await toc.openMenu();
        await since('Favorite dossier by favorites icon, favorites icon on TOC should be selected')
            .expect(await toc.isFavoritesIconSelected(dossier2.name))
            .toBe(true);
        await toc.closeMenu({ icon: 'close' });
        await dossierPage.goToLibrary();
    });

    it('[TC67828_03] Validate End-to-End user journey for favorites on Library Web _ remove from favorites', async () => {
        // remove from favorites by context menu in multi-select mode
        await libraryPage.clickMultiSelectBtn();
        await libraryPage.selectDossier(dossier1.name);
        await libraryPage.selectDossier(dossier2.name);
        await libraryPage.openDossierContextMenu(dossier2.name);
        await libraryPage.clickDossierContextMenuItem('Remove from Favorite');
        // -- favorites icon
        await since('Remove favorite dossier, favorites icon on dossier image should NOT be selected')
            .expect(await libraryPage.isFavoritesIconSelected(dossier1.name))
            .toBe(false);
        // -- favorites section
        await since('Remove favorite dossier, Favorites should NOT be present on All list')
            .expect(await libraryPage.isFavoritesPresent())
            .toBe(false);
    });
});
export const config = specConfiguration;
