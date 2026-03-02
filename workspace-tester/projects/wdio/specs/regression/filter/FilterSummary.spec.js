import resetDossierState from '../../../api/resetDossierState.js';
import resetFilterMode from '../../../api/resetFilterMode.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { customCredentials } from '../../../constants/index.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

const specConfiguration = { ...customCredentials('_filter') };

describe('Filter Summary', () => {
    const dossier = {
        id: '95746367432FE191B3AEE2AAA65F6FDE',
        name: 'Long Attr Element Name',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const dossierRA = {
        id: '45293F9F4BD7D23289BC9B8E79FC7CD7',
        name: 'Long Attr Element Name - RA',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const short = 'short';
    const medium =
        'morethanonelessthanthreeaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
    const long =
        'morethanthreeaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
    const specialShort = 'short-specialCharactors!@#$%^&*()_+';
    const specialMedium =
        'medium-specialCharactors!@#$%^&*()_ +long-specialCharactors!@#$%^&*()_ +long-specialCharactors!@#$%^&*()_+ long-specialCharactors!@#$%^&*()_+ long-specialCharactors!@#$%^&*()_+long-specialCharactors!@#$%^&*()_+';
    const specialLong =
        'long-specialCharactors!@#$%^&*()_ +long-specialCharactors!@#$%^&*()_ +long-specialCharactors!@#$%^&*()_+ long-specialCharactors!@#$%^&*()_+ long-specialCharactors!@#$%^&*()_+long-specialCharactors!@#$%^&*()_+ long-specialCharactors!@#$%^&*()_+long-specialCharactors!@#$%^&*()_+ long-specialCharactors!@#$%^&*()_+long-specialCharactors!@#$%^&*()_+';

    let {
        loginPage,
        toc,
        attributeSlider,
        calendarFilter,
        checkboxFilter,
        dossierPage,
        filterPanel,
        filterSummaryBar,
        libraryPage,
        mqFilter,
        radiobuttonFilter,
        searchBoxFilter,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);
        // Reset the browser window size
        await setWindowSize({
            
            width: 900,
            height: 800,
        });
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    //checkbox
    it('[TC78896_01] Validate Functionality for remove the length limit of the single element in Filter Summary - single element - short', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });

        // short(less than 180px and 1/4 row)
        await libraryPage.openDossier(dossier.name);
        await toc.openPageFromTocMenu({ chapterName: 'Checkbox', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('New Attribute');
        await checkboxFilter.selectElementByName(short);
        await filterPanel.apply();

        await since('The filterSummaryBar item is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('New Attribute'))
            .toBe('(short)');
        await filterSummaryBar.viewAllFilterItems();
        await since('The filterSummaryPanel item is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterPanelItems('New Attribute'))
            .toBe(short);
        await takeScreenshotByElement(filterSummaryBar.getFilterSummaryPanel(), 'TC78896_01', 'short');

        // pencil icon
        await filterSummaryBar.clickPencilIconByName('New Attribute');
        await checkboxFilter.selectElementByName(medium);
        await filterPanel.apply();
    });

    //dropdown
    it('[TC78896_02] Validate Functionality for remove the length limit of the single element in Filter Summary - single element - more than 1 row but less than 3 rows', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });

        // medium (more than 1 row but less than 3 rows)
        await libraryPage.openDossier(dossier.name);
        await toc.openPageFromTocMenu({ chapterName: 'Dropdown', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('New Attribute');
        await checkboxFilter.keepOnly(medium);
        await filterPanel.apply();

        await since('The filterSummaryBar item is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('New Attribute'))
            .toBe(
                '(morethanonelessthanthreeaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa)'
            );
        await filterSummaryBar.viewAllFilterItems();
        await since('The filterSummaryPanel item is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterPanelItems('New Attribute'))
            .toBe(medium);
        await takeScreenshotByElement(
            filterSummaryBar.getFilterSummaryPanel(),
            'TC78896_02',
            'more than one row less than three rows'
        );
    });

    //radio button
    it('[TC78896_03] Validate Functionality for remove the length limit of the single element in Filter Summary - single element - more than 3 rows', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });

        // long (more than 3 rows)
        await libraryPage.openDossier(dossier.name);
        await toc.openPageFromTocMenu({ chapterName: 'RadioButton', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();
        await radiobuttonFilter.openSecondaryPanel('New Attribute');
        await radiobuttonFilter.selectElementByName(long);
        await filterPanel.apply();

        await since('The filterSummaryBar item is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('New Attribute'))
            .toBe(
                '(morethanthreeaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa)'
            );
        await filterSummaryBar.viewAllFilterItems();
        await since('The filterSummaryPanel item is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterPanelItems('New Attribute'))
            .toBe(long);
        await since('isTruncateDotsPresent is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.isTruncateDotsPresent('New Attribute'))
            .toBe(true);
        await takeScreenshotByElement(filterSummaryBar.getFilterSummaryPanel(), 'TC78896_03', 'more than three rows');
    });

    //slider
    it('[TC79287_01] Validate Functionality for remove the length limit of the single element in Filter Summary - multiElements - short+medium', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });

        // short+medium
        await libraryPage.openDossier(dossier.name);
        await toc.openPageFromTocMenu({ chapterName: 'Slider', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();
        await attributeSlider.dragAndDropUpperHandle('New Attribute', -200);
        await filterPanel.apply();

        await since('The filterSummaryBar item is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('New Attribute'))
            .toContain(short);
        await since('The filterSummaryBar item is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('New Attribute'))
            .toContain(medium);
        await filterSummaryBar.viewAllFilterItems();
        await since('The filterSummaryPanel item is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterPanelItems('New Attribute'))
            .toBe(short + ' - ' + medium);
        await takeScreenshotByElement(
            filterSummaryBar.getFilterSummaryPanel(),
            'TC79287_01',
            'multiElements - short+medium'
        );
    });

    //searchbox
    it('[TC79287_02] Validate Functionality for remove the length limit of the single element in Filter Summary - multiElements - short+long', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });

        // short+long
        await libraryPage.openDossier(dossier.name);
        await toc.openPageFromTocMenu({ chapterName: 'Searchbox', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('New Attribute');
        await searchBoxFilter.search('*');
        await searchBoxFilter.selectElementByName(short);
        await searchBoxFilter.selectElementByName(specialLong);
        await filterPanel.apply();

        await since('The filterSummaryBar item is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('New Attribute'))
            .toContain(short);
        await since('The filterSummaryBar item is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('New Attribute'))
            .toContain(specialLong);
        await filterSummaryBar.viewAllFilterItems();
        await since('The filterSummaryPanel item is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterPanelItems('New Attribute'))
            .toBe(short + ',' + specialLong);
        await since('isTruncateDotsPresent is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.isTruncateDotsPresent('New Attribute'))
            .toBe(true);
        await takeScreenshotByElement(
            filterSummaryBar.getFilterSummaryPanel(),
            'TC79287_02',
            'multiElements - short+long'
        );
    });

    it('[TC79287_03] Validate Functionality for remove the length limit of the single element in Filter Summary - multiElements - medium+short', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });

        // medium+short
        await libraryPage.openDossier(dossier.name);
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('New Attribute');
        await checkboxFilter.selectElementByName(medium);
        await checkboxFilter.selectElementByName(specialShort);
        await filterPanel.apply();

        await since('The filterSummaryBar item is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('New Attribute'))
            .toContain(medium);
        await since('The filterSummaryBar item is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('New Attribute'))
            .toContain(specialShort);
        await filterSummaryBar.viewAllFilterItems();
        await since('The filterSummaryPanel item is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterPanelItems('New Attribute'))
            .toBe(medium + ',' + specialShort);
        await takeScreenshotByElement(
            filterSummaryBar.getFilterSummaryPanel(),
            'TC79287_03',
            'multiElements - medium+short'
        );
    });

    it('[TC79287_05] Validate Functionality for remove the length limit of the single element in Filter Summary - multiElements - medium+long', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });

        // medium+long
        await libraryPage.openDossier(dossier.name);
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('New Attribute');
        await checkboxFilter.selectElementByName(specialMedium);
        await checkboxFilter.selectElementByName(specialLong);
        await filterPanel.apply();

        await since('The filterSummaryBar item is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('New Attribute'))
            .toContain(specialMedium);
        await since('The filterSummaryBar item is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('New Attribute'))
            .toContain(specialLong);
        await filterSummaryBar.viewAllFilterItems();
        await since('The filterSummaryPanel item is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterPanelItems('New Attribute'))
            .toBe(specialMedium + ',' + specialLong);
        await since('isTruncateDotsPresent is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.isTruncateDotsPresent('New Attribute'))
            .toBe(true);
        await takeScreenshotByElement(
            filterSummaryBar.getFilterSummaryPanel(),
            'TC79287_05',
            'multiElements - medium+long'
        );
    });

    it('[TC79287_06] Validate Functionality for remove the length limit of the single element in Filter Summary - multiElements - short+medium+long', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });

        // short+medium+long
        await libraryPage.openDossier(dossier.name);
        await filterPanel.openFilterPanel();
        await searchBoxFilter.openSecondaryPanel('New Attribute');
        await checkboxFilter.selectElementByName(short);
        await checkboxFilter.selectElementByName(specialMedium);
        await checkboxFilter.selectElementByName(specialLong);
        await filterPanel.apply();

        await since('The filterSummaryBar item is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('New Attribute'))
            .toContain(short);
        await since('The filterSummaryBar item is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('New Attribute'))
            .toContain(specialMedium);
        await filterSummaryBar.viewAllFilterItems();
        await since('The filterSummaryPanel item is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterPanelItems('New Attribute'))
            .toBe(short + ',' + specialMedium + ',' + specialLong);
        await since('isTruncateDotsPresent is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.isTruncateDotsPresent('New Attribute'))
            .toBe(true);
        await takeScreenshotByElement(
            filterSummaryBar.getFilterSummaryPanel(),
            'TC79287_06',
            'multiElements - short+medium+long'
        );
    });

    it('[TC79306] Validate Functionality for remove the length limit of the single element in Filter Summary - RA Filter', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossierRA,
        });

        await libraryPage.openDossier(dossierRA.name);
        await filterSummaryBar.viewAllFilterItems();
        await since('isTruncateDotsPresent is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.isTruncateDotsPresent('Accounts'))
            .toBe(true);
        await takeScreenshotByElement(filterSummaryBar.getFilterSummaryPanel(), 'TC79306', 'RA Filter');
    });
});

export const config = specConfiguration;
