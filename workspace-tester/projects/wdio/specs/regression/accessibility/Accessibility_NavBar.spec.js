import { customCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';
import resetBookmarks from '../../../api/resetBookmarks.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshot, takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { getAccAtributesOfElement } from '../../../utils/getAttributeValue.js';

const specConfiguration = { ...customCredentials('_acc') };

describe('Accessibility test of Nav Bar', () => {
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    const dossier = {
        id: '957A9C7B462A52FA24A07B8BA02F788F',
        name: 'Dossier sanity_General',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    let { loginPage, bookmark, dossierPage, libraryPage } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);
        await setWindowSize(browserWindow);
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    const leftNavBarList = `link,Go to your Library,0,null
button,Table of Contents,0,true
button,Bookmarks,0,dialog
button,Reset,0,dialog
button,Re-Prompt,0,true`;

    const rightNavBarList = `button,Filter 1 Filter Selected,0,true
button,Share,0,true
button,Account,0,true`;

    it('[TC82144] Validate accessibility of Toolbar working as expected with JAWS and VoiceOver ', async () => {
        await libraryPage.openDossierAndRunPrompt(dossier.name);
        await libraryPage.tab();
        await libraryPage.tab();
        await since(
            'Role, arialabel, tabindex, ariaHasPopup for leftNavBar is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(
                await getAccAtributesOfElement(await dossierPage.getLeftNavBar(), [
                    'role',
                    'ariaLabel',
                    'tabIndex',
                    'ariaHasPopup',
                ])
            )
            .toBe(leftNavBarList);
        await since(
            'Role, arialabel, tabindex, ariaHasPopup for rightNavbar is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(
                await getAccAtributesOfElement(await dossierPage.getRightNavBar(), [
                    'role',
                    'ariaLabel',
                    'tabIndex',
                    'ariaHasPopup',
                ])
            )
            .toBe(rightNavBarList);
        await libraryPage.tab();
        await libraryPage.enter();
        await bookmark.waitForBookmarkPanelPresent();
        await libraryPage.tab();
        await libraryPage.tab();
        await libraryPage.esc();
        await takeScreenshotByElement(dossierPage.getLeftNavBar(), 'TC82144', 'LeftNavBar');

        // right navBar
        await libraryPage.tab();
        await libraryPage.tab();
        await libraryPage.tab();
        await libraryPage.esc();
        await libraryPage.tab();
        await takeScreenshotByElement(dossierPage.getRightNavBar(), 'TC82144', 'RightNavBar');
    });
});

export const config = specConfiguration;
