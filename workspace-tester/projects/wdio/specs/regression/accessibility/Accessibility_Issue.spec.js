import { customCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';
import resetBookmarks from '../../../api/resetBookmarks.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshot, takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { getAccAtributesOfElement, getAttributeValue } from '../../../utils/getAttributeValue.js';

const specConfiguration = { ...customCredentials('_acc') };

describe('Accessibility test of Issue Case', () => {
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    const mobileWindow = {
        width: 599,
        height: 640,
    };

    let { loginPage, libraryFilter, libraryPage, dossierPage, calendarFilter, filterPanel } = browsers.pageObj1;

    const dossier = {
        id: '957A9C7B462A52FA24A07B8BA02F788F',
        name: 'Dossier sanity_General',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const calendarDossier = {
        id: 'C000E6164EFAEE31D933F880C3917367',
        name: 'Dynamic Calendar',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);
    });

    beforeEach(async () => {
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        const isDossierPage = await dossierPage.getDossierView().isDisplayed();
        if (isDossierPage) {
            await dossierPage.goToLibrary();
        }
    });

    it('[TC87868] Verify accessibility of Library Filter', async () => {
        await libraryPage.clickFilterIcon();
        const filterPanel = `button,null,0,null
button,null,0,null
button,null,0,null
button,null,0,null
switch,null,0,null
null,null,0,null
null,null,0,null`;
        await since(
            'For origin status, Role, arialabel, tabindex, ariaSelected for filter panel is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(
                await getAccAtributesOfElement(await libraryFilter.getFilterContainer(), [
                    'role',
                    'ariaLabel',
                    'tabIndex',
                    'ariaSelected',
                ])
            )
            .toEqual(filterPanel);
        await libraryPage.tab();
        await libraryPage.tab();
        await libraryPage.enter();
        await libraryPage.waitForElementVisible(libraryFilter.getFilterDetailsPanel());
        const detailPanel = `checkbox,null,0,null
button,null,0,null
checkbox,null,0,null
checkbox,null,0,null
null,null,0,null
null,null,0,null`;
        await since(
            'Role, arialabel, tabindex, ariaSelected for detail panel is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(
                await getAccAtributesOfElement(await libraryFilter.getFilterDetailsPanel(), [
                    'role',
                    'ariaLabel',
                    'tabIndex',
                    'ariaSelected',
                ])
            )
            .toEqual(detailPanel);
        await libraryPage.tab();
        await libraryPage.enter();
        await since('Dossier Type is selected is supposed to be #{expected}, instead we have #{actual}')
            .expect(await libraryFilter.isDossierSelected())
            .toBe(true);
        await libraryPage.waitForDynamicElementLoading();
        await libraryPage.esc();
        await libraryPage.tab();
        await libraryPage.tab();
        await libraryPage.tab();
        await libraryPage.tab();
        await libraryPage.tab();
        await libraryPage.enter();
        await libraryPage.clickFilterIcon();
        const filterPanelWithSelection = `button,null,0
button,null,0
button,Dashboard,0
button,null,0
button,null,0
switch,null,0
null,null,0
null,null,0`;
        await since(
            'Role, arialabel, tabindex for account panel is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(
                await getAccAtributesOfElement(await libraryPage.getFilterContainer(), [
                    'role',
                    'ariaLabel',
                    'tabIndex',
                ])
            )
            .toEqual(filterPanelWithSelection);
        await libraryPage.closeFilterPanel();
    });

    it('[TC86591] Validate accessibility for dynamic calendar filter style dropdown', async () => {
        await libraryPage.moveDossierIntoViewPort(calendarDossier.name);
        await libraryPage.openDossier(calendarDossier.name);
        await filterPanel.openFilterPanel();
        await calendarFilter.openSecondaryPanel('Day');
        await libraryPage.waitForElementVisible(calendarFilter.header.getDynamicDateContextMenu());
        await since('role is supposed to be #{expected}, instead we have #{actual}')
            .expect(await getAttributeValue(await calendarFilter.header.getDynamicDateOptions('Between'), ['role']))
            .toBe('option');
        await since('tabIndex is supposed to be #{expected}, instead we have #{actual}')
            .expect(await getAttributeValue(await calendarFilter.header.getDynamicDateOptions('Between'), ['tabIndex']))
            .toBe(-1);
        await since('aria-selected is supposed to be #{expected}, instead we have #{actual}')
            .expect(
                await getAttributeValue(await calendarFilter.header.getDynamicDateOptions('Between'), ['ariaSelected'])
            )
            .toBe('true');
        await filterPanel.closeFilterPanel();
    });

    it('[TC87399] Verify accessibility of TOC on mobile view', async () => {
        await libraryPage.closeSidebar();
        await setWindowSize(mobileWindow);
        await libraryPage.moveDossierIntoViewPort(calendarDossier.name);
        await libraryPage.openDossier(dossier.name);
        await dossierPage.tab();
        await dossierPage.tab();
        await takeScreenshotByElement(await dossierPage.getNavigationBar(), 'TC87399', 'toc', { tolerance: 0.2 });
        await dossierPage.waitForDynamicElementLoading();
        const tocList = `button,Page 1,0
button,Options,0`;
        await since('Role, arialabel, tabindex for toc mobile is supposed to be #{expected}, instead we have #{actual}')
            .expect(
                await getAccAtributesOfElement(await dossierPage.getNavigationBar(), ['role', 'ariaLabel', 'tabIndex'])
            )
            .toContain(tocList);
    });
});

export const config = specConfiguration;
