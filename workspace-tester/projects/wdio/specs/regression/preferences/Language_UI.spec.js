import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshot, takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import resetDossierState from '../../../api/resetDossierState.js';
import resetUserLanguage from '../../../api/resetUserLanguage.js';
import setLanguage from '../../../api/setLanguage.js';
import { getAttributeValue } from '../../../utils/getAttributeValue.js';

const specConfiguration = { ...customCredentials('_language') };
const languageUserID = 'BEC61A66488490107BA9AF930EA66419';

describe('UI test for Language', () => {
    const dossier = {
        id: '53EFB3A94FA899452E91E08522DB305C',
        name: '(Auto) Locale - dossier',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let { dossierPage, libraryPage, userPreference, loginPage, userAccount } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        await resetUserLanguage({
            userId: [languageUserID],
            credentials: specConfiguration.credentials,
        });
        await libraryPage.openUserAccountMenu();
        await libraryPage.logout();
        await loginPage.login(specConfiguration.credentials);
    });

    afterEach(async () => {
        await libraryPage.reload();
    });

    it('[TC86630] Validate Functionality of Language on Library Web - GUI', async () => {
        // change default to fixed
        await libraryPage.openUserAccountMenu();
        await libraryPage.openPreferencePanel();
        await userPreference.openPreferenceList('My Language');
        await userPreference.changePreference('My Language', 'Korean');
        await since('Change description present should be #{expected}, instead we have #{actual}')
            .expect(await userPreference.isChangeDescPresent())
            .toBe(true);
        await userPreference.savePreference();
        await libraryPage.openPreferencePanel();
        await since('After change to Korean, language should be #{expected}, while we got #{actual}')
            .expect(await userPreference.selectedPreference('My Language'))
            .toBe('Korean');

        // change fixed to fixed
        await userPreference.openPreferenceList('My Language');
        await userPreference.changePreference('My Language', 'Portuguese (Portugal)');
        await since(
            'After change from fixed to fixed, Change description present should be #{expected}, instead we have #{actual}'
        )
            .expect(await userPreference.isChangeDescPresent())
            .toBe(true);
        await userPreference.savePreference();
        await libraryPage.openPreferencePanel();
        await since('After change to Portuguese (Portugal), language should be #{expected}, while we got #{actual}')
            .expect(await userPreference.selectedPreference('My Language'))
            .toBe('Portuguese (Portugal)');

        // change fixed to default
        await userPreference.openPreferenceList('My Language');
        await userPreference.changePreference('My Language', 'Default');
        await since(
            'After change from fixed to default, Change description present should be #{expected}, instead we have #{actual}'
        )
            .expect(await userPreference.isChangeDescPresent())
            .toBe(true);
        await userPreference.savePreference();
        await libraryPage.openPreferencePanel();
        await since('After change to Default, language should be #{expected}, while we got #{actual}')
            .expect(await userPreference.selectedPreference('My Language'))
            .toBe('Default');
        await userAccount.closeUserAccountMenu();
    });

    it('[TC84516] Validate compatibility of Language on different OS, browser, browser zoom and devices', async () => {
        // 1. on mobile view: preference secondary panel(reload hint), timezone in filter panel
        await setWindowSize({
            
            width: 550,
            height: 800,
        });
        // check preference panel in mobile view
        await libraryPage.hamburgerMenu.openHamburgerMenu();
        await libraryPage.hamburgerMenu.clickOptionInMobileView('Account');
        await libraryPage.hamburgerMenu.sleep(1000); // await for animation load
        await takeScreenshotByElement(
            libraryPage.hamburgerMenu.getSliderMenuContainer(),
            'TC84516',
            'Mobile View - account panel'
        );
        await libraryPage.hamburgerMenu.clickOptionInMobileView('Preferences');
        await libraryPage.hamburgerMenu.sleep(1000); // await for animation load
        await takeScreenshotByElement(
            libraryPage.hamburgerMenu.getSliderMenuContainer(),
            'TC84516',
            'Mobile View - preference panel'
        );
        await userPreference.openPreferenceList('My Language');
        await takeScreenshotByElement(
            libraryPage.hamburgerMenu.getSliderMenuContainer(),
            'TC84516',
            'Mobile View - Open Timezone List'
        );
        await userPreference.changePreference('My Language', 'Chinese (Simplified)');
        //check with change desc preference page in mobile view
        await takeScreenshotByElement(
            libraryPage.hamburgerMenu.getSliderMenuContainer(),
            'TC84516',
            'Mobile View - change description'
        );
        await libraryPage.hamburgerMenu.closeHamburgerMenu();

        await setWindowSize(browserWindow);
        await dossierPage.goToLibrary();
        // 2. on web view: preference secondary panel(reload hint) in web view
        await libraryPage.openUserAccountMenu();
        await libraryPage.openPreferencePanel();
        await userPreference.openPreferenceList('My Language');
        await takeScreenshotByElement(userPreference.getPreferenceSecondaryPanel(), 'TC84516', 'Preference panel');
        await userPreference.changePreference('My Language', 'Default');
        await takeScreenshotByElement(
            userPreference.getPreferenceSecondaryPanel(),
            'TC84516',
            'Preference panel with change desc'
        );
        await libraryPage.closeUserAccountMenu();
    });
});

export const config = specConfiguration;
