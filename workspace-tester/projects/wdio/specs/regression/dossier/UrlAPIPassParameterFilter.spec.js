import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { customCredentials } from '../../../constants/index.js';

const specConfiguration = { ...customCredentials('_urlapi') };

describe('Url API pass Parameter Filter', () => {
    const dossier = {
        // id: '24FC5565449256B727BFD6ABDD980A3D',
        id: '6845F08C496607A5D19FE4A87BE382A6',
        name: '(Auto) URL API pass parameter filter',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const reportParameterDossier = {
        id: 'B867318D4D958F2333868B858492036F',
        name: '(Auto) URL API pass report level parameter',
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

    afterEach(async () => {
        await browser.url(browser.options.baseUrl);
        await dossierPage.waitForPageLoading();
    });

    it('[TC95183_01] Validate URL API pass Element List Parameter Filter in Library Web', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossier,
        });
        let url = await browser.getUrl();
        // Apply element category exclude books, electronics, subcategory include Business, year =2015, day from 1/1/2016 to 3/31/2016
        let urlAPIJSON = [
            {
                name: 'Category',
                currentSelection: {
                    selectionStatus: 'excluded',
                    allSelected: false,
                    elements: [
                        {
                            id: 'h1;8D679D3711D3E4981000E787EC6DE8A4',
                            name: 'Books:1',
                        },
                        {
                            id: 'h2;8D679D3711D3E4981000E787EC6DE8A4',
                            name: 'Electronics:2',
                        },
                    ],
                },
            },
            {
                key: 'W5A1E306D7AD44B97A6C50AE9C169CB93',
                name: 'Year',
                currentSelection: {
                    selectionStatus: 'included',
                    elements: [
                        {
                            id: 'h2015;8D679D5111D3E4981000E787EC6DE8A4',
                            name: '2015',
                        },
                    ],
                },
            },
            {
                key: 'W8FF8F1FBB532444A94FAC162BD3B1337',
                currentSelection: {
                    selectionStatus: 'included',
                    allSelected: false,
                    elements: [
                        {
                            id: 'h12;8D679D4F11D3E4981000E787EC6DE8A4',
                            name: 'Business',
                        },
                    ],
                },
            },
            {
                key: 'WF9E724CC176840909AF58A483C142B07',
                name: 'Day',
                currentSelection: {
                    selectionStatus: 'included',
                    expression: {
                        operator: 'Between',
                        operands: [
                            {
                                type: 'form',
                                attribute: {
                                    id: '96ED3EC811D5B117C000E78A4CC5F24F',
                                    name: 'Day',
                                },
                                form: {
                                    id: '45C11FA478E745FEA08D781CEA190FE5',
                                    name: 'ID',
                                },
                            },
                            {
                                type: 'constant',
                                dataType: 'Date',
                                value: '01/01/2016',
                            },
                            {
                                type: 'constant',
                                dataType: 'Date',
                                value: '03/31/2016',
                            },
                        ],
                    },
                },
            },
        ];
        let urlAPIlink = encodeURIComponent(JSON.stringify(urlAPIJSON));
        let customUrl = `${url}/9D8A49D54E04E0BE62C877ACC18A5A0A/6845F08C496607A5D19FE4A87BE382A6/K532719A74F2E43F05EB1D6940623E762--K4DA9F6944E7818FA5A813B80FF447A88?dossier.filters=${urlAPIlink}`;
        console.log('customUrl:' + customUrl);
        // Apply URL
        await browser.url(customUrl);
        await dossierPage.waitForDossierLoading();
        await since('Apply url, filter summary for Category should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Element_Category'))
            .toBe('(exclude Books:1, Electronics:2)');
        await filterSummary.viewAllFilterItems();
        await since('Apply url, filter summary for Subcategory should be #{expected}, instead we have #{actual}')
            .expect(await filterSummary.expandedFilterItems('Element_Subcategory'))
            .toBe('Business');
        await since('Apply url, filter summary for Quarter should be #{expected}, instead we have #{actual}')
            .expect(await filterSummary.expandedFilterItems('Element_Year'))
            .toBe('2015');
        await since('Apply url, filter summary for Month should be #{expected}, instead we have #{actual}')
            .expect(await filterSummary.expandedFilterItems('Element_Day'))
            .toBe('1/1/2016 - 3/31/2016');
    });

    it('[TC95183_02] Validate URL API pass Element List Parameter Filter in Library Web - select all/clear all', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossier,
        });
        let url = await browser.getUrl();

        // Apply category = click select all, subcategory = click clear all, day = clear all
        // For attribute, when click select all, the allSelected: true
        // For element list, when click select all, the allSelected: false, elements: [...]
        // For attribute, when click clear all, the allSelected: false, elements: []
        // For element list, when click clear all, "hideSelectedElements": true  ----- clear all

        // category, year: select all, subcategory: clear all
        let urlAPIJSON = [
            {
                name: 'Category',
                currentSelection: {
                    allSelected: true,
                    elements: [],
                },
            },
            {
                key: 'W8FF8F1FBB532444A94FAC162BD3B1337',
                currentSelection: {
                    selectionStatus: 'unfiltered', // in authoring mode is select all, in consumption mode is clear all
                    allSelected: false,
                    elements: [],
                },
            },
            {
                key: 'W5A1E306D7AD44B97A6C50AE9C169CB93',
                name: 'Year',
                currentSelection: {
                    allSelected: true,
                    hideSelectedElements: true,
                },
            },
        ];
        let urlAPIlink = encodeURIComponent(JSON.stringify(urlAPIJSON));
        let customUrl = `${url}/9D8A49D54E04E0BE62C877ACC18A5A0A/6845F08C496607A5D19FE4A87BE382A6/K532719A74F2E43F05EB1D6940623E762--K4DA9F6944E7818FA5A813B80FF447A88?dossier.filters=${urlAPIlink}`;
        console.log('customUrl:' + customUrl);
        await browser.url(customUrl);
        await dossierPage.waitForDossierLoading();
        await since('Apply url, filter summary for Category should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Category'))
            .toBe('(Books:1, Electronics:2, +2)');
        await since('Apply url, filter count should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterBarItemCount())
            .toBe(2);

        // manual select all, clear all
        let urlAPIJSON1 = [
            {
                name: 'Category',
                currentSelection: {
                    selectionStatus: 'included',
                    allSelected: false,
                    elements: [
                        {
                            id: 'h1;8D679D3711D3E4981000E787EC6DE8A4',
                            name: 'Books:1',
                        },
                        {
                            id: 'h2;8D679D3711D3E4981000E787EC6DE8A4',
                            name: 'Electronics:2',
                        },
                        {
                            id: 'h3;8D679D3711D3E4981000E787EC6DE8A4',
                            name: 'Movies:3',
                        },
                        {
                            id: 'h4;8D679D3711D3E4981000E787EC6DE8A4',
                            name: 'Music:4',
                        },
                    ],
                },
            },
            {
                key: 'W8FF8F1FBB532444A94FAC162BD3B1337',
                name: 'Subcategory',
                currentSelection: {
                    selectionStatus: 'included',
                    elements: [],
                },
            },
        ];
        let urlAPIlink1 = encodeURIComponent(JSON.stringify(urlAPIJSON1));
        let customUrl1 = `${url}/9D8A49D54E04E0BE62C877ACC18A5A0A/6845F08C496607A5D19FE4A87BE382A6/K532719A74F2E43F05EB1D6940623E762--K4DA9F6944E7818FA5A813B80FF447A88?dossier.filters=${urlAPIlink1}`;
        console.log('customUrl1:' + customUrl1);
        await browser.url(customUrl1);
        await dossierPage.waitForDossierLoading();
        await since('Apply url, filter summary for Category should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Category'))
            .toBe('(Books:1, Electronics:2, +2)');
        await since('Apply url, filter count should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterBarItemCount())
            .toBe(2);
    });

    it('[TC95365] Validate URL API pass Value Parameter Filter in Library Web', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossier,
        });
        let url = await browser.getUrl();

        // Apply Value_Number_UserInput, no default value, Value_Number_UserInput = 165.34
        // Value_Big Decimal_Range = 200
        // Value_Text_Fixed List, clear - will fall back to default value business
        // Value_Date_Range_With Default Value = 06/02/2016
        // Value_Date and Time_UserInput = 1/1/2016
        let urlAPIJSON = [
            {
                key: 'W21686B61BCE64EFB8A0BD6C30C3F6C92',
                name: 'Value_Number_UserInput',
                currentSelection: {
                    selectionStatus: 'included',
                    values: ['165.34'],
                },
            },
            {
                // key: 'W23A2973CEE684FEDB137386443985B7',
                name: 'Value_Big Decimal_Range',
                currentSelection: {
                    values: ['200'],
                },
            },
            {
                key: 'W695595CA0BE34F6BA03B6B1093D284E2',
                // name: 'Value_Text_Fixed List',
                currentSelection: {
                    selectionStatus: 'unfiltered',
                    values: [],
                },
            },
            {
                key: 'WACE394909AEC47D8AF32604669360813',
                name: 'Value_Date_Range_With Default Value',
                currentSelection: {
                    selectionStatus: 'included',
                    values: ['06/02/2016'],
                },
            },
            {
                key: 'W11085D537A924721AAEE65F751B79A90',
                name: 'Value_Date and Time_UserInput',
                currentSelection: {
                    selectionStatus: 'included',
                    values: ['01/01/2016 12:00:00 AM'],
                },
            },
        ];

        let urlAPIlink = encodeURIComponent(JSON.stringify(urlAPIJSON));
        let customUrl = `${url}/9D8A49D54E04E0BE62C877ACC18A5A0A/6845F08C496607A5D19FE4A87BE382A6/KDD6F14C24BB2EE8B8C78D480C0342CBA--K58C577074ADBCC924424C6B3D7435530?dossier.filters=${urlAPIlink}`;
        console.log('customUrl:' + customUrl);

        // Apply URL
        await browser.url(customUrl);
        await dossierPage.waitForDossierLoading();
        await filterSummary.viewAllFilterItems();
        await since(
            'Apply url, filter summary for Value_Number_UserInput should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummary.expandedFilterItems('Value_Number_UserInput'))
            .toBe('165.34');
        await since(
            'Apply url, filter summary for Value_Big Decimal_Range should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummary.expandedFilterItems('Value_Big Decimal_Range'))
            .toBe('200');
        await since(
            'Apply url, filter summary for Value_Text_Fixed List should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummary.expandedFilterItems('Value_Text_Fixed List'))
            .toBe('Business');
        await since(
            'Apply url, filter summary for Value_Date_Range_With Default Value should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummary.expandedFilterItems('Value_Date_Range_With Default Value'))
            .toBe('6/2/2016');
        await since(
            'Apply url, filter summary for Value_Date and Time_UserInput should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummary.expandedFilterItems('Value_Date and Time_UserInput'))
            .toBe('1/1/2016 12:00:00 AM');
    });

    it('[TC94311] Validate URL API pass Attribute filter in Library Web', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossier,
        });
        let url = await browser.getUrl();
        // Apply attribute filter, Category = electronics, Subcategory = cameras
        let urlAPIJSON = [
            {
                name: 'Category',
                currentSelection: {
                    selectionStatus: 'excluded',
                    allSelected: false,
                    elements: [
                        {
                            id: 'h2;8D679D3711D3E4981000E787EC6DE8A4',
                            name: 'Electronics:2',
                        },
                    ],
                },
            },
            {
                name: 'Subategory',
                key: 'W6C6E22E89C464E2895B465C82F2C16D2',
                currentSelection: {
                    selectionStatus: 'included',
                    elements: [
                        {
                            id: 'h13;8D679D4F11D3E4981000E787EC6DE8A4',
                            name: 'Literature',
                        },
                    ],
                },
            },
            {
                name: 'Day',
                key: 'WC47C23072B304F479A7E70E9DECE2813',
                currentSelection: {
                    selectionStatus: 'included',
                    expression: {
                        operator: 'Between',
                        operands: [
                            {
                                type: 'form',
                                attribute: {
                                    id: '96ED3EC811D5B117C000E78A4CC5F24F',
                                    name: 'Day',
                                },
                                form: {
                                    id: '45C11FA478E745FEA08D781CEA190FE5',
                                    name: 'ID',
                                },
                            },
                            {
                                type: 'constant',
                                dataType: 'Date',
                                value: '05/02/2015',
                            },
                            {
                                type: 'constant',
                                dataType: 'Date',
                                value: '04/30/2016',
                            },
                        ],
                    },
                },
            },
        ];
        let urlAPIlink = encodeURIComponent(JSON.stringify(urlAPIJSON));
        let customUrl = `${url}/9D8A49D54E04E0BE62C877ACC18A5A0A/6845F08C496607A5D19FE4A87BE382A6/K3C703D334FD75BADE060E2A3623A71FD--K1B74DF6E4701CB3A16D7C1B8813B41C6?dossier.filters=${urlAPIlink}`;
        console.log('customUrl:' + customUrl);
        // Apply URL
        await browser.url(customUrl);
        await dossierPage.waitForDossierLoading();
        await since('Apply url, filter summary for Category should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Category'))
            .toBe('(exclude Electronics)');
        await since('Apply url, filter summary for Subcategory should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Subcategory'))
            .toBe('(Literature)');
        await since('Apply url, filter summary for Day should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Day'))
            .toBe('(5/2/2015 - 4/30/2016)');
    });

    it('[TC95367_01] Validate URL API pass Metric filter in Library Web - Metric Qualification', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossier,
        });
        let url = await browser.getUrl();
        // Cost, Qualify on Value, Qualification
        // Profit, Qualify on Rank, slider
        // Cost Less Than 1000000, profit exclude highest 60%
        let urlAPIJSON = [
            {
                key: 'W08663AB33DCD4B6EA9400B8B66198648',
                name: 'Cost',
                currentSelection: {
                    expression: {
                        selectionStatus: 'included',
                        operator: 'Less',
                        operands: [
                            {
                                type: 'metric',
                                id: '7FD5B69611D5AC76C000D98A4CC5F24F',
                                name: 'Cost',
                            },
                            {
                                type: 'constant',
                                dataType: 'Real',
                                value: '1000000',
                            },
                        ],
                    },
                },
            },
        ];

        let urlAPIlink = encodeURIComponent(JSON.stringify(urlAPIJSON));
        let customUrl = `${url}/9D8A49D54E04E0BE62C877ACC18A5A0A/6845F08C496607A5D19FE4A87BE382A6/K8727C90849772C79E030FEAA9A64CE5C--KE5C485434898FB45448E63A878DA3E9A?dossier.filters=${urlAPIlink}`;
        console.log('customUrl:' + customUrl);
        // Apply URL
        await browser.url(customUrl);
        await dossierPage.waitForDossierLoading();
        await since('Apply url, filter summary for Cost should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Cost'))
            .toBe('[<1M]');

        // Cost not between 500000-1000000
        let urlAPIJSON1 = [
            {
                key: 'W08663AB33DCD4B6EA9400B8B66198648',
                name: 'Cost',
                currentSelection: {
                    expression: {
                        operator: 'NotBetween',
                        operands: [
                            {
                                type: 'metric',
                                id: '7FD5B69611D5AC76C000D98A4CC5F24F',
                                name: 'Cost',
                            },
                            {
                                type: 'constant',
                                dataType: 'Real',
                                value: '500000',
                            },
                            {
                                type: 'constant',
                                dataType: 'Real',
                                value: '1045678',
                            },
                        ],
                    },
                },
            },
        ];
        let urlAPIlink1 = encodeURIComponent(JSON.stringify(urlAPIJSON1));
        let customUrl1 = `${url}/9D8A49D54E04E0BE62C877ACC18A5A0A/6845F08C496607A5D19FE4A87BE382A6/K8727C90849772C79E030FEAA9A64CE5C--KE5C485434898FB45448E63A878DA3E9A?dossier.filters=${urlAPIlink1}`;
        console.log('customUrl1:' + customUrl1);
        // Apply URL
        await browser.url(customUrl1);
        await dossierPage.waitForDossierLoading();
        await filterSummary.viewAllFilterItems();
        await since('Apply url, filter summary for Cost should be #{expected}, instead we have #{actual}')
            .expect(await filterSummary.expandedFilterItems('Cost'))
            .toBe('Not between 500000 and 1045678');

        // Cost in '751775', '4181261'
        let urlAPIJSON2 = [
            {
                key: 'W08663AB33DCD4B6EA9400B8B66198648',
                name: 'Cost',
                currentSelection: {
                    expression: {
                        operator: 'In',
                        operands: [
                            {
                                type: 'metric',
                                id: '7FD5B69611D5AC76C000D98A4CC5F24F',
                                name: 'Cost',
                            },
                            {
                                type: 'constants',
                                dataType: 'Real',
                                values: ['751775', '4181261'],
                            },
                        ],
                    },
                },
            },
        ];
        let urlAPIlink2 = encodeURIComponent(JSON.stringify(urlAPIJSON2));
        let customUrl2 = `${url}/9D8A49D54E04E0BE62C877ACC18A5A0A/6845F08C496607A5D19FE4A87BE382A6/K8727C90849772C79E030FEAA9A64CE5C--KE5C485434898FB45448E63A878DA3E9A?dossier.filters=${urlAPIlink2}`;
        console.log('customUrl2:' + customUrl2);
        // Apply URL
        await browser.url(customUrl2);
        await dossierPage.waitForDossierLoading();
        await filterSummary.viewAllFilterItems();
        await since('Apply url, filter summary for Cost should be #{expected}, instead we have #{actual}')
            .expect(await filterSummary.expandedFilterItems('Cost'))
            .toBe('In 751775;4181261');

        // Cost is not null
        let urlAPIJSON3 = [
            {
                key: 'W08663AB33DCD4B6EA9400B8B66198648',
                name: 'Cost',
                currentSelection: {
                    expression: {
                        operator: 'IsNotNull',
                        operands: [
                            {
                                type: 'metric',
                                id: '7FD5B69611D5AC76C000D98A4CC5F24F',
                                name: 'Cost',
                            },
                        ],
                    },
                },
            },
        ];
        let urlAPIlink3 = encodeURIComponent(JSON.stringify(urlAPIJSON3));
        let customUrl3 = `${url}/9D8A49D54E04E0BE62C877ACC18A5A0A/6845F08C496607A5D19FE4A87BE382A6/K8727C90849772C79E030FEAA9A64CE5C--KE5C485434898FB45448E63A878DA3E9A?dossier.filters=${urlAPIlink3}`;
        console.log('customUrl3:' + customUrl3);
        // Apply URL
        await browser.url(customUrl3);
        await dossierPage.waitForDossierLoading();
        await since('Apply url, filter summary for Cost should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Cost'))
            .toBe('[Is Not Null]');

        // clear all
        let urlAPIJSON4 = [
            {
                key: 'W08663AB33DCD4B6EA9400B8B66198648',
                name: 'Cost',
                currentSelection: {
                    selectionStatus: 'unfiltered',
                },
            },
        ];
        let urlAPIlink4 = encodeURIComponent(JSON.stringify(urlAPIJSON4));
        let customUrl4 = `${url}/9D8A49D54E04E0BE62C877ACC18A5A0A/6845F08C496607A5D19FE4A87BE382A6/K8727C90849772C79E030FEAA9A64CE5C--KE5C485434898FB45448E63A878DA3E9A?dossier.filters=${urlAPIlink4}`;
        console.log('customUrl4:' + customUrl4);
        // Apply URL
        await browser.url(customUrl4);
        await dossierPage.waitForDossierLoading();
        await since('Apply url, filter summary count should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterBarItemCount())
            .toBe(1);
    });

    it('[TC95367_02] Validate URL API pass Metric filter in Library Web - Metric Slider', async () => {
        // does not support exclude mode
        await resetDossierState({
            credentials: credentials,
            dossier: dossier,
        });
        let url = await browser.getUrl();
        // profit highest% 60%
        let urlAPIJSON = [
            {
                key: 'W0992C5788A994E10937D4F8401E51ECA',
                name: 'Profit',
                currentSelection: {
                    selectionStatus: 'included',
                    expression: {
                        operator: 'Percent.Top',
                        operands: [
                            {
                                type: 'metric',
                                id: '4C051DB611D3E877C000B3B2D86C964F',
                                name: 'Profit',
                            },
                            {
                                type: 'constant',
                                dataType: 'Real',
                                value: '0.6',
                            },
                        ],
                    },
                },
            },
        ];
        let urlAPIlink = encodeURIComponent(JSON.stringify(urlAPIJSON));
        let customUrl = `${url}/9D8A49D54E04E0BE62C877ACC18A5A0A/6845F08C496607A5D19FE4A87BE382A6/K8727C90849772C79E030FEAA9A64CE5C--KE5C485434898FB45448E63A878DA3E9A?dossier.filters=${urlAPIlink}`;
        console.log('customUrl:' + customUrl);
        // Apply URL
        await browser.url(customUrl);
        await dossierPage.waitForDossierLoading();
        // await filterSummary.viewAllFilterItems();
        await since('Apply url, filter summary for Cost should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Profit'))
            .toBe('[Highest 60%]');

        // profit include Lowest 20
        let urlAPIJSON1 = [
            {
                key: 'W0992C5788A994E10937D4F8401E51ECA',
                name: 'Profit',
                currentSelection: {
                    selectionStatus: 'included',
                    expression: {
                        operator: 'Rank.Bottom',
                        operands: [
                            {
                                type: 'metric',
                                id: '4C051DB611D3E877C000B3B2D86C964F',
                                name: 'Profit',
                            },
                            {
                                type: 'constant',
                                dataType: 'Real',
                                value: '20',
                            },
                        ],
                    },
                },
            },
        ];
        let urlAPIlink1 = encodeURIComponent(JSON.stringify(urlAPIJSON1));
        let customUrl1 = `${url}/9D8A49D54E04E0BE62C877ACC18A5A0A/6845F08C496607A5D19FE4A87BE382A6/K8727C90849772C79E030FEAA9A64CE5C--KE5C485434898FB45448E63A878DA3E9A?dossier.filters=${urlAPIlink1}`;
        console.log('customUrl1:' + customUrl1);
        // Apply URL
        await browser.url(customUrl1);
        await dossierPage.waitForDossierLoading();
        await since('Apply url, filter summary for Cost should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Profit'))
            .toBe('[Lowest 20]');

        // clear all
        let urlAPIJSON2 = [
            {
                key: 'W0992C5788A994E10937D4F8401E51ECA',
                name: 'Profit',
                currentSelection: {
                    selectionStatus: 'unfiltered',
                },
            },
        ];
        let urlAPIlink2 = encodeURIComponent(JSON.stringify(urlAPIJSON2));
        let customUrl2 = `${url}/9D8A49D54E04E0BE62C877ACC18A5A0A/6845F08C496607A5D19FE4A87BE382A6/K8727C90849772C79E030FEAA9A64CE5C--KE5C485434898FB45448E63A878DA3E9A?dossier.filters=${urlAPIlink2}`;
        console.log('customUrl2:' + customUrl2);
        // Apply URL
        await browser.url(customUrl2);
        await dossierPage.waitForDossierLoading();
        await since('Apply url, filter summary count should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterBarItemCount())
            .toBe(1);
    });

    it('[TC95366] Validate URL API pass Parameter Filter in Library Web - error handling', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossier,
        });
        //Apply Value_Number_UserInput for multi elements
        let urlAPIJSON = [
            {
                key: 'W5711C97844FB4E65BB3409E8CF262745',
                name: 'Value_Number_UserInput',
                currentSelection: {
                    selectionStatus: 'included',
                    values: ['12', '34'],
                },
            },
        ];
        let urlAPIlink = encodeURIComponent(JSON.stringify(urlAPIJSON));
        let url = await browser.getUrl();
        let customUrl = `${url}/9D8A49D54E04E0BE62C877ACC18A5A0A/6845F08C496607A5D19FE4A87BE382A6/KDD6F14C24BB2EE8B8C78D480C0342CBA--K58C577074ADBCC924424C6B3D7435530?dossier.filters=${urlAPIlink}`;
        console.log('customUrl:' + customUrl);
        await browser.url(customUrl);
        await dossierPage.waitForDossierLoading();
        await dossierPage.sleep(2000);
        await since('The error title should be #{expected} for dossier1, instead we have #{actual}')
            .expect(await dossierPage.errorMsg())
            .toEqual('Please double check the shared link.');
        await dossierPage.showDetails();
        await since('The error detail should be #{expected} for dossier1, instead we have #{actual}')
            .expect(await dossierPage.errorDetails())
            .toEqual(
                `The value parameter selector with key 'W21686B61BCE64EFB8A0BD6C30C3F6C92' must include only one value under included status`
            );
    });
});

export const config = specConfiguration;
