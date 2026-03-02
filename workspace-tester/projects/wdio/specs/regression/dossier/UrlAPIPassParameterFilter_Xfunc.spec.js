import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { customCredentials } from '../../../constants/index.js';

const specConfiguration = { ...customCredentials('_urlapi') };

describe('Url API pass Parameter Filter - X func', () => {
    const dossier = {
        id: 'AAA1A21C4811335DC2E0CCA3225A725D',
        name: '(Auto) XFunc -URL API pass parameter filter',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const { credentials } = specConfiguration;

    let {
        loginPage,
        dossierPage,
        libraryPage,
        filterSummary,
        filterSummaryBar,
        filterPanel,
        checkboxFilter,
        searchBoxFilter,
        radiobuttonFilter,
        attributeSlider,
        calendarFilter,
        mqSliderFilter,
        mqFilter,
        infoWindow,
        promptEditor,
        grid,
        reset,
        toc,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);
        await setWindowSize({
            width: 1600,
            height: 1000,
        });
    });

    beforeEach(async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossier,
        });
    });

    afterEach(async () => {
        await browser.url(browser.options.baseUrl);
        await dossierPage.waitForPageLoading();
    });

    it('[TC95434_01] Validate X-func for URL API pass parameter filter in Library Web - Dynamic filter', async () => {
        let url = await browser.getUrl();
        // Apply element category first 2
        let urlAPIJSON = [
            {
                key: 'WE950A3B9B40B4A5387C74EC1AD195B06',
                name: 'Category',
                currentSelection: {
                    selectionStatus: 'unfiltered',
                    allSelected: false,
                    elements: [],
                },
            },
        ];
        let urlAPIlink = encodeURIComponent(JSON.stringify(urlAPIJSON));
        let customUrl = `${url}/9D8A49D54E04E0BE62C877ACC18A5A0A/AAA1A21C4811335DC2E0CCA3225A725D/K53--K46?dossier.filters=${urlAPIlink}`;
        console.log('customUrl:' + customUrl);
        // Apply URL
        await browser.url(customUrl);
        await dossierPage.waitForDossierLoading();
        await filterPanel.openFilterPanel();
        await since('Apply url, filter summary for Category should be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.filterSelectionInfo('Element_Category'))
            .toBe('(First 2)');
    });

    it('[TC95434_02] Validate X-func for URL API pass parameter filter in Library Web - Lock Filter', async () => {
        let url = await browser.getUrl();
        //Apply element category exclude books, electronics, subcategory include Business, year =2015, day from 1/1/2016 to 3/31/2016
        let urlAPIJSON = [
            {
                key: 'W3BED4912C988466F9F457730EEF6D7E6',
                name: 'Item',
                currentSelection: {
                    allSelected: true,
                    elements: [],
                },
            },
        ];
        let urlAPIlink = encodeURIComponent(JSON.stringify(urlAPIJSON));
        let customUrl = `${url}/9D8A49D54E04E0BE62C877ACC18A5A0A/AAA1A21C4811335DC2E0CCA3225A725D/K53--K46?dossier.filters=${urlAPIlink}`;
        console.log('customUrl:' + customUrl);
        // Apply URL
        await browser.url(customUrl);
        await dossierPage.waitForDossierLoading();
        await filterPanel.openFilterPanel();
        await since('Apply url, filter summary for Category should be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.filterSelectionInfo('Element_Item'))
            .toBe('(360/360)');
    });

    it('[TC95434_03] Validate X-func for URL API pass parameter filter in Library Web - GDDE', async () => {
        let url = await browser.getUrl();
        // pass filter to source, target does not in the list
        let urlAPIJSON = [
            {
                name: 'Category',
                currentSelection: {
                    selectionStatus: 'included',
                    allSelected: false,
                    elements: [
                        {
                            id: 'h4;8D679D3711D3E4981000E787EC6DE8A4',
                            name: 'Music',
                        },
                    ],
                },
            },
            {
                key: 'IGK7460A67548A2BBEA940C4984FEE55A8A',
                name: 'Subcategory',
                currentSelection: {
                    selectionStatus: 'included',
                    allSelected: false,
                    elements: [
                        {
                            id: 'h45;8D679D4F11D3E4981000E787EC6DE8A4',
                            name: 'Rock',
                        },
                    ],
                },
            },
        ];
        let urlAPIlink = encodeURIComponent(JSON.stringify(urlAPIJSON));
        let customUrl = `${url}/9D8A49D54E04E0BE62C877ACC18A5A0A/AAA1A21C4811335DC2E0CCA3225A725D/K537CF7404ED897A7894C168D58DCD128--K13700A7B487337C390F0D4981B82C5C9?dossier.filters=${urlAPIlink}`;
        console.log('customUrl:' + customUrl);

        // Apply URL
        await browser.url(customUrl);
        await dossierPage.waitForDossierLoading();
        await since('Apply url, filter summary for Category should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Category'))
            .toBe('(Music)');
        await since('Apply url, filter summary for Subcategory should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Element_Subcategory'))
            .toBe('(Rock)');
    });

    it('[TC95434_04] Validate X-func for URL API pass parameter filter in Library Web - Selection Required', async () => {
        let url = await browser.getUrl();

        // Year set to selection required, Apply year = unfiltered
        let urlAPIJSON = [
            {
                key: 'W21F974A190994C9CA9667744B161372C',
                name: 'Year',
                currentSelection: {
                    selectionStatus: 'unfiltered',
                    values: [],
                },
            },
        ];

        let urlAPIlink = encodeURIComponent(JSON.stringify(urlAPIJSON));
        let customUrl = `${url}/9D8A49D54E04E0BE62C877ACC18A5A0A/AAA1A21C4811335DC2E0CCA3225A725D/K49C6C06B422DDFC490799C9730C3518D--KC613F8DC438D4C38485AB08C3BA9022C?dossier.filters=${urlAPIlink}`;
        console.log('customUrl:' + customUrl);

        // Apply URL
        await browser.url(customUrl);
        await dossierPage.waitForDossierLoading();
        await since('Apply url, filter summary for Year should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Year'))
            .toBe('(2014)');
    });
});

export const config = specConfiguration;
