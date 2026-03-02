import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { customCredentials } from '../../../constants/index.js';
import deleteAllFavorites from '../../../api/deleteAllFavorites.js';

const specConfiguration = { ...customCredentials('_favorite') };

describe('Favorites', () => {
    const project = {
        id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
        name: 'MicroStrategy Tutorial',
    };
    const dossier1 = {
        id: '9989C9714E97F8E7F2E0D58ACC55FE46',
        name: '(AUTO) GlobalSearch_Test Dossier',
        project: project,
    };
    const dossier2 = {
        id: 'BCD06D184E679BBD0F18D799935D4EE4',
        name: '(AUTO) GlobalSearch_Certified document',
        project: project,
    };

    let { libraryPage, infoWindow, quickSearch, fullSearch, sidebar, toc, dossierPage, loginPage } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);
        await deleteAllFavorites(specConfiguration.credentials);
    });

    beforeEach(async () => {
        await deleteAllFavorites(specConfiguration.credentials);
        await libraryPage.reload();
    });

    afterEach(async () => {
        await libraryPage.resetToLibraryHome();
    });

    it('[TC71915] Favorites - Favorites and remove from favorites by favorite icon', async () => {
        const homeCount = await libraryPage.getAllCountFromTitle();
        const favoriteCount = await libraryPage.getFavoritesCountFromTitle();

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
            'Favorite dossier by favorites icon, the total favorites count on All list should be #{expected}, while we get #{actual}'
        )
            .expect(await libraryPage.getFavoritesCountFromTitle())
            .toBe(favoriteCount + 1);
        await since(
            'Favorite dossier by favorites icon, the total home count on All list should be #{expected}, while we get #{actual}'
        )
            .expect(await libraryPage.getAllCountFromTitle())
            .toBe(homeCount - 1);

        // Remove from favorites
        await libraryPage.removeFavoriteByImageIcon(dossier1.name);
        // -- check favorites icon
        await since(
            'Remove dossier from favorites by favorites icon, favorites icon on dossier image should NOT be selected'
        )
            .expect(await libraryPage.isFavoritesIconSelected(dossier1.name))
            .toBe(false);
        await takeScreenshotByElement(
            libraryPage.getDossierImageContainer(dossier1.name),
            'TC71915',
            'FavoritesIcon_RemoveFromFavorites'
        );
        // -- check favorite section
        await since('Remove dossier from favorites by favorites icon, Favorites should NOT be present on All list')
            .expect(await libraryPage.isFavoritesPresent())
            .toBe(false);
        await since(
            'Remove dossier from favorites by favorites icon, home count should be #{expected}, while we get #{actual}'
        )
            .expect(await libraryPage.getAllCountFromTitle())
            .toBe(homeCount);
    });

    it('[TC67839] Favorites - Favorites and remove from favorites by toolbar', async () => {
        const homeCount = await libraryPage.getAllCountFromTitle();

        // Favorite from TOC menu
        await libraryPage.openDossier(dossier1.name);
        
        await dossierPage.favorite();
        since('Favorite dossier by toolbar, favorites tooltip should be #{expected}, while we get #{actual}')
            .expect(await dossierPage.getFavoriteTooltipText())
            .toBe('Remove from Favorites');
        await dossierPage.goToLibrary();
        await since(
            'Favorite dossier by toolbar, the total favorites count on All list should be #{expected}, while we get #{actual}'
        )
            .expect(await libraryPage.getFavoritesCountFromTitle())
            .toBe(1);
        await since('Favorite dossier by toolbar, the total home count on should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.getAllCountFromTitle())
            .toBe(homeCount - 1);

        // Remove from favorites
        await libraryPage.openDossier(dossier1.name);
        await dossierPage.removeFavorite();
        since('Remove dossier from favorites by toolbar, favorites tooltip should be #{expected}, while we get #{actual}')
            .expect(await dossierPage.getFavoriteTooltipText())
            .toBe('Add to Favorites');
        
        await dossierPage.goToLibrary();
        await since('Remove dossier from favorites by toolbar, Favorites should NOT be present on All list')
            .expect(await libraryPage.isFavoritesPresent())
            .toBe(false);
        await since(
            'remove favorite by toolbar, the total favorites count on All list should be #{expected}, while we get #{actual}'
        )
            .expect(await libraryPage.getAllCountFromTitle())
            .toBe(homeCount);
    });

    it('[TC71916] Favorites - Favorites and remove from favorites by info-window on homepage', async () => {
        const homeCount = await libraryPage.getAllCountFromTitle();
        const favoriteCount = await libraryPage.getFavoritesCountFromTitle();
        // Favorite from homepage info-window
        await libraryPage.openDossierInfoWindow(dossier1.name);
        await infoWindow.favorite();
        // -- check favorite and home count
        await since(
            'Favorite dossier by homepage info-window,info-window present should be #{expected}, while we get #{actual}'
        )
            .expect(await infoWindow.isOpen())
            .toBe(false);
        await since(
            'Favorite dossier by homepage info-window, home count should be #{expected}, while we get #{actual}'
        )
            .expect(await libraryPage.getAllCountFromTitle())
            .toBe(homeCount - 1);
        await since(
            'Favorite dossier by homepage info-window, favorites count should be #{expected}, while we get #{actual}'
        )
            .expect(await libraryPage.getFavoritesCountFromTitle())
            .toBe(favoriteCount + 1);

        // -- check favorite button on info-window
        await libraryPage.openDossierInfoWindow(dossier1.name);
        await since(
            'Favorite dossier by hoempage info-window, favorites button on info-window image should be selected'
        )
            .expect(await infoWindow.isFavoritesBtnSelected())
            .toBe(true);

        // Remove from favorites
        await infoWindow.removeFavorite();
        await since(
            'remove favorites by homepage info-window,info-window present should be #{expected}, while we get #{actual}'
        )
            .expect(await infoWindow.isOpen())
            .toBe(false);
        await since(
            'remove favorites by homepage info-window, home count should be #{expected}, while we get #{actual}'
        )
            .expect(await libraryPage.getAllCountFromTitle())
            .toBe(homeCount);
        // -- check favorite list
        await since(
            'Remove dossier from favorites by hoempage info-window, Favorites should NOT be present on Favolites list'
        )
            .expect(await libraryPage.isFavoritesPresent())
            .toBe(false);
    });

    it('[TC72089] Favorites - Favorites and remove from favorites by info-window on global search', async () => {
        const keyword = 'GlobalSearch Test Dossier';
        const homeCount = await libraryPage.getAllCountFromTitle();
        const favoriteCount = await libraryPage.getFavoritesCountFromTitle();

        // Favorite from global search info-window
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(keyword);
        // -- All tab
        await fullSearch.clickAllTab();
        await fullSearch.openInfoWindow(dossier1.name);
        await since(
            'Favorite dossier from global search info-window, on All tab the favorites button should NOT be present'
        )
            .expect(await infoWindow.isFavoritesBtnPresent())
            .toBe(false);
        // -- My Library tab
        await fullSearch.clickMyLibraryTab();
        await fullSearch.openInfoWindow(dossier1.name);
        await infoWindow.favorite();
        await fullSearch.backToLibrary();
        // -- check favorite section
        await since(
            'Favorite dossier by info-window, the total favorites count on All list should be #{expected}, while we get #{actual}'
        )
            .expect(await libraryPage.getFavoritesCountFromTitle())
            .toBe(favoriteCount + 1);
        await since(
            'Favorite dossier by info-window, the total home count should be #{expected}, while we get #{actual}'
        )
            .expect(await libraryPage.getAllCountFromTitle())
            .toBe(homeCount - 1);

        // Remove from favorites
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(keyword);
        // -- My Library tab
        await fullSearch.clickMyLibraryTab();
        await fullSearch.openInfoWindow(dossier1.name);
        await infoWindow.removeFavorite();
        await fullSearch.backToLibrary();
        // -- check favorite section
        await since(
            'Remove dossier from favorites by global search info-window, Favorites should NOT be present on All list'
        )
            .expect(await libraryPage.isFavoritesPresent())
            .toBe(false);
        await since(
            'Remove dossier from favorites by global search info-window, the total home count should be #{expected}, while we get #{actual}'
        )
            .expect(await libraryPage.getAllCountFromTitle())
            .toBe(homeCount);
    });

    it('[TC71917] Favorites - Favorites and remove from favorites by context menu', async () => {
        const homeCount = await libraryPage.getAllCountFromTitle();
        const favoriteCount = await libraryPage.getFavoritesCountFromTitle();

        // Favorite from context menu
        await libraryPage.openDossierContextMenu(dossier1.name);
        await libraryPage.clickDossierContextMenuItem('Favorite');
        // -- check favorite count
        await since(
            'Favorite dossier by context menu, the total favorites count on All list should be #{expected}, while we get #{actual}'
        )
            .expect(await libraryPage.getFavoritesCountFromTitle())
            .toBe(favoriteCount + 1);
        await since(
            'Favorite dossier by context menu, the total home count should be #{expected}, while we get #{actual}'
        )
            .expect(await libraryPage.getAllCountFromTitle())
            .toBe(homeCount - 1);

        // Remove from favorites
        await libraryPage.openDossierContextMenu(dossier1.name);
        await libraryPage.clickDossierContextMenuItem('Remove from Favorites');
        // -- check favorite count section
        await since(
            'remove favorite dossier by context menu, favorites title present should be #{expected}, while we get #{actual}'
        )
            .expect(await libraryPage.isFavoritesPresent())
            .toBe(false);
        await since(
            'remove favorite dossier by context menu, the total home count should be #{expected}, while we get #{actual}'
        )
            .expect(await libraryPage.getAllCountFromTitle())
            .toBe(homeCount);
    });

    it('[TC71920] Favorites - Favorites on multi-selection mode', async () => {
        const homeCount = await libraryPage.getAllCountFromTitle();
        const favoriteCount = await libraryPage.getFavoritesCountFromTitle();

        await libraryPage.openSidebar();
        await sidebar.openAllSectionList();

        // single select to favorite
        await libraryPage.clickMultiSelectBtn();
        await libraryPage.openDossierContextMenu(dossier1.name);
        await libraryPage.clickDossierContextMenuItem('Favorite');
        await since(
            'Favorite dossier on multi-select mode, the total favorites count on All list should be #{expected}, while we get #{actual}'
        )
            .expect(await libraryPage.getFavoritesCountFromTitle())
            .toBe(favoriteCount + 1);
        await since(
            'Favorite dossier on multi-select mode, the total home count should be #{expected}, while we get #{actual}'
        )
            .expect(await libraryPage.getAllCountFromTitle())
            .toBe(homeCount - 1);

        // multi select to favorite
        await libraryPage.clickMultiSelectBtn();
        await libraryPage.selectDossier(dossier1.name);
        await libraryPage.selectDossier(dossier2.name);
        await libraryPage.openDossierContextMenu(dossier2.name);
        await libraryPage.openDossierContextMenu(dossier2.name);
        await libraryPage.clickDossierContextMenuItem('Favorite');
        await since(
            'Favorite dossier on multi-select mode, the total favorites count on All list should be #{expected}, while we get #{actual}'
        )
            .expect(await libraryPage.getFavoritesCountFromTitle())
            .toBe(favoriteCount + 2);
        await since(
            'Favorite dossier on multi-select mode, the total home count should be #{expected}, while we get #{actual}'
        )
            .expect(await libraryPage.getAllCountFromTitle())
            .toBe(homeCount - 2);

        // remove from favorites
        await libraryPage.clickMultiSelectBtn();
        await libraryPage.selectDossier(dossier1.name);
        await libraryPage.selectDossier(dossier2.name);
        await libraryPage.openDossierContextMenu(dossier2.name);
        await libraryPage.clickDossierContextMenuItem('Remove from Favorite');
        await since('Remove favorite dossier on multi-select mode, Favorites should NOT be present on All list')
            .expect(await libraryPage.isFavoritesPresent())
            .toBe(false);
        await since(
            'remove Favorite on multi-select mode, the total home count should be #{expected}, while we get #{actual}'
        )
            .expect(await libraryPage.getAllCountFromTitle())
            .toBe(homeCount);
    });

    it('[TC72091] Favorites - Favorites status async among favorite icon, info-window, favorite section and favorite list', async () => {
        // favorites
        await libraryPage.favoriteByImageIcon(dossier1.name);
        // -- check favorite icon on dossier image
        await since('Favorite dossier, favorites icon on dossier image should be selected')
            .expect(await libraryPage.isFavoritesIconSelected(dossier1.name))
            .toBe(true);
        // -- check favorite button on info-window
        await libraryPage.openDossierInfoWindow(dossier1.name);
        await since('Favorite dossier, favorites button on info-window image should be selected')
            .expect(await infoWindow.isFavoritesBtnSelected())
            .toBe(true);
        // -- check favorite section
        await since(
            'Favorite dossier, the total favorites count on All list should be #{expected}, while we get #{actual}'
        )
            .expect(await libraryPage.getFavoritesCountFromTitle())
            .toBe(1);

        // remove from fvorites
        await libraryPage.removeFavoriteByImageIcon(dossier1.name);
        // -- check favorite list
        await since('Remove dossier from favorites, Favorites should NOT be present on Favolites list')
            .expect(await libraryPage.isFavoritesPresent())
            .toBe(false);
    });
});
export const config = specConfiguration;
