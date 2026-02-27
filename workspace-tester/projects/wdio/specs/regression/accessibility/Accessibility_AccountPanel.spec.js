import { customCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';
import resetBookmarks from '../../../api/resetBookmarks.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshot, takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { getAccAtributesOfElement } from '../../../utils/getAttributeValue.js';

const specConfiguration = { ...customCredentials('_acc') };

describe('Accessibility test of Account panel', () => {
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let { loginPage, userAccount, userPreference } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);
        await setWindowSize(browserWindow);
    });

    it('[TC88155] Validate accessibility of account panel working as expected ', async () => {
        await userAccount.openUserAccountMenu();
        await userAccount.tab();
        await takeScreenshotByElement(userAccount.getAccountDropdown(), 'TC82142', 'Close Button');
        const accountPanelList = `button,Close,0
menuitem,null,0
button,Manage Library,0
menuitem,null,0
button,Take a Tour,0
link,Help,0
null,Log Out,0`;
        await since(
            'Role, arialabel, tabindex for account panel is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(
                await getAccAtributesOfElement(await userAccount.getAccountDropdown(), [
                    'role',
                    'ariaLabel',
                    'tabIndex',
                ])
            )
            .toEqual(accountPanelList);
        await userAccount.tab();
        await userAccount.tab();
        await userAccount.tab();
        //open preference panel
        await userAccount.enter();
        await userPreference.waitForPreferencePanelPresent();
        await since(
            'aria-haspopup, aria-expanded for preference is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(
                await getAccAtributesOfElement(await userAccount.getPreferenceBtn(), ['ariaHasPopup', 'ariaExpanded'])
            )
            .toEqual('true,true');

        await since('PreferenceSecondaryPanel present is supposed to be #{expected}, instead we have #{actual}')
            .expect(await userPreference.isPreferenceSecondaryPanelPresent())
            .toEqual(true);
        await userAccount.tab();
        await userAccount.tab();
        await userAccount.tab();
        await userAccount.tab();
        await userAccount.enter();

        await userAccount.tab();
        await userAccount.tab();
        await userAccount.tab();
        await userAccount.enter();
        await loginPage.login(specConfiguration.credentials);
    });
});

export const config = specConfiguration;
