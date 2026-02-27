import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { customCredentials } from '../../../constants/index.js';
import InCanvasSelector from '../../../pageObjects/selector/InCanvasSelector.js';

const specConfiguration = { ...customCredentials('_urlapi') };

describe('Url API pass Selector', () => {
    const dossier = {
        id: '6E6AB6E6437B75892C5361BC0F213BD7',
        name: '(Auto) UrlAPI pass In-Canvas Selectors',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const parameterDossier = {
        id: 'F924F1FE42465D85FC8DCE8D68A5160E',
        name: '(Auto) UrlAPI pass Parameter',
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
        infoWindow,
        promptEditor,
        grid,
        inCanvasSelector,
        reset,
        toc,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);
        await setWindowSize({
            width: 1000,
            height: 800,
        });
    });

    afterEach(async () => {
        await browser.url(browser.options.baseUrl);
        await dossierPage.waitForDossierLoading();
    });

    it('[TC94178] Validate URL API pass Element filter in Library Web', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossier,
        });
        const url = await browser.getUrl();
        //Apply element selector year = 2014, 2016, category exclude books, day from 1/1/2016 to 3/31/2016
        let urlAPIJSON = [
            {
                name: 'Category',
                currentSelection: {
                    selectionStatus: 'excluded',
                    allSelected: false,
                    elements: [
                        {
                            id: 'h1;8D679D3711D3E4981000E787EC6DE8A4',
                            name: '1',
                        },
                    ],
                },
            },
            {
                key: 'W224F495E51974618B48DD5BBBFA54302',
                currentSelection: {
                    elements: [
                        {
                            id: 'h2014;8D679D5111D3E4981000E787EC6DE8A4',
                            name: '2014',
                        },
                        {
                            id: 'h2016;8D679D5111D3E4981000E787EC6DE8A4',
                            name: '2016',
                        },
                    ],
                },
            },
            {
                key: 'WFB59E743360249C3BAE9CB0AEBCFEA44',
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
                                value: '1/1/2016',
                            },
                            {
                                type: 'constant',
                                dataType: 'Date',
                                value: '3/31/2016',
                            },
                        ],
                    },
                },
            },
        ];
        let urlAPIlink = encodeURIComponent(JSON.stringify(urlAPIJSON));
        const customUrl = `${url}/9D8A49D54E04E0BE62C877ACC18A5A0A/6E6AB6E6437B75892C5361BC0F213BD7?dossier.filters=${urlAPIlink}`;
        console.log('customUrl:' + customUrl);
        await browser.url(customUrl);
        await dossierPage.waitForDossierLoading();
        //Validate selector
        let year = InCanvasSelector.createByTitle('Year');
        await since('After apply customUrl, item selected should be #{expected}, while we get #{actual}')
            .expect(await year.isItemSelected('2014'))
            .toBe(true);
        await since('After apply customUrl, item selected should be #{expected}, while we get #{actual}')
            .expect(await year.isItemSelected('2016'))
            .toBe(true);
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Element filter'))
            .toEqual(4);
        await since(
            'The first element of Cost metric should be #{expected} after apply customUrl, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Element filter', headerName: 'Cost' }))
            .toBe('$1,726,780');
        await since(
            'The first element of Category should be #{expected} after apply customUrl, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Element filter', headerName: 'Category' }))
            .toBe('Electronics');
        await since('The first element of Year should be #{expected} after apply customUrl, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Element filter', headerName: 'Year' }))
            .toBe('2016');

        //Validate selector in info window
        await grid.selectGridElement({
            title: 'Element filter',
            headerName: 'Category',
            elementName: 'Movies',
        });
        await dossierPage.waitForInfoWindowLoading();
        await since('Trigger IW from grid, the IW should appear')
            .expect(await grid.isVizDisplayed('info window'))
            .toBe(true);
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('info window'))
            .toEqual(4);
        await since(
            'The first element of Year in info window should be #{expected} after apply customUrl, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'info window', headerName: 'Year' }))
            .toBe('2014');
        //Apply element selector year = 2015 in info window
        urlAPIJSON = [
            {
                name: 'Year',
                currentSelection: {
                    elements: [
                        {
                            id: 'h2015;8D679D5111D3E4981000E787EC6DE8A4',
                            name: '2015',
                        },
                    ],
                },
            },
        ];
        urlAPIlink = encodeURIComponent(JSON.stringify(urlAPIJSON));
        const customUrl2 = `${url}/9D8A49D54E04E0BE62C877ACC18A5A0A/6E6AB6E6437B75892C5361BC0F213BD7?dossier.filters=${urlAPIlink}`;
        console.log('customUrl2:' + customUrl2);
        await browser.url(customUrl2);
        await dossierPage.waitForDossierLoading();
        year = InCanvasSelector.createByTitle('Year');
        await since(
            'After apply customUrl2, item selected out of info window should be #{expected}, while we get #{actual}'
        )
            .expect(await year.isItemSelected('2015'))
            .toBe(false);
        //triger info window
        await grid.selectGridElement({
            title: 'Element filter',
            headerName: 'Category',
            elementName: 'Electronics',
        });
        await dossierPage.waitForInfoWindowLoading();
        await since('Trigger IW from grid, the IW should appear')
            .expect(await grid.isVizDisplayed('info window'))
            .toBe(true);
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('info window'))
            .toEqual(2);
        await since(
            'The first element of Year in info window should be #{expected} after apply customUrl2, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'info window', headerName: 'Year' }))
            .toBe('2015');
    });

    it('[TC94179] Validate URL API pass Value filter in Library Web', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossier,
        });
        const url = await browser.getUrl();
        //Apply value selector cost in 879,397.506;681,179.317
        let urlAPIJSON = [
            {
                key: 'W03BC827ACB3344D59FFA11470F1586DE',
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
                                values: ['879397.506', '681179.317'],
                            },
                        ],
                    },
                },
            },
        ];
        let urlAPIlink = encodeURIComponent(JSON.stringify(urlAPIJSON));
        const customUrl = `${url}/9D8A49D54E04E0BE62C877ACC18A5A0A/6E6AB6E6437B75892C5361BC0F213BD7/WE32160C5930447DDAEDBCF841396BE87--K46?dossier.filters=${urlAPIlink}`;
        console.log('customUrl:' + customUrl);
        await browser.url(customUrl);
        await dossierPage.waitForDossierLoading();
        //Validate selector
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Value filter'))
            .toEqual(3);
        await since(
            'The first element of Category should be #{expected} after apply customUrl, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Value filter', headerName: 'Category' }))
            .toBe('Books');
        await since(
            'The first element of Cost metric should be #{expected} after apply customUrl, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Value filter', headerName: 'Cost' }))
            .toBe('$681,179');
        await since('The first element of Year should be #{expected} after apply customUrl, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Value filter', headerName: 'Year' }))
            .toBe('2015');
        //Apply value selector cost not between 500000 and 8000000
        urlAPIJSON = [
            {
                key: 'W03BC827ACB3344D59FFA11470F1586DE',
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
                                value: '8000000',
                            },
                        ],
                    },
                },
            },
        ];
        urlAPIlink = encodeURIComponent(JSON.stringify(urlAPIJSON));
        const customUrl2 = `${url}/9D8A49D54E04E0BE62C877ACC18A5A0A/6E6AB6E6437B75892C5361BC0F213BD7/WE32160C5930447DDAEDBCF841396BE87--K46?dossier.filters=${urlAPIlink}`;
        console.log('customUrl2:' + customUrl2);
        await browser.url(customUrl2);
        await dossierPage.waitForDossierLoading();
        //Validate selector
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Value filter'))
            .toEqual(2);
        await since(
            'The first element of Category should be #{expected} after apply customUrl2, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Value filter', headerName: 'Category' }))
            .toBe('Electronics');
        await since(
            'The first element of Cost metric should be #{expected} after apply customUrl2, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Value filter', headerName: 'Cost' }))
            .toBe('$8,520,927');
        await since('The first element of Year should be #{expected} after apply customUrl2, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Value filter', headerName: 'Year' }))
            .toBe('2016');
        //Apply value selector cost is not null
        urlAPIJSON = [
            {
                key: 'W03BC827ACB3344D59FFA11470F1586DE',
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
        urlAPIlink = encodeURIComponent(JSON.stringify(urlAPIJSON));
        const customUrl3 = `${url}/9D8A49D54E04E0BE62C877ACC18A5A0A/6E6AB6E6437B75892C5361BC0F213BD7/WE32160C5930447DDAEDBCF841396BE87--K46?dossier.filters=${urlAPIlink}`;
        console.log('customUrl3:' + customUrl3);
        await browser.url(customUrl3);
        await dossierPage.waitForDossierLoading();
        //Validate selector
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Value filter'))
            .toEqual(13);
        //Apply value selector cost Greater than or equal to 600000
        urlAPIJSON = [
            {
                key: 'W03BC827ACB3344D59FFA11470F1586DE',
                name: 'Cost',
                currentSelection: {
                    expression: {
                        operator: 'GreaterEqual',
                        operands: [
                            {
                                type: 'metric',
                                id: '7FD5B69611D5AC76C000D98A4CC5F24F',
                                name: 'Cost',
                            },
                            {
                                type: 'constant',
                                dataType: 'Real',
                                value: '600000',
                            },
                        ],
                    },
                },
            },
        ];
        urlAPIlink = encodeURIComponent(JSON.stringify(urlAPIJSON));
        const customUrl4 = `${url}/9D8A49D54E04E0BE62C877ACC18A5A0A/6E6AB6E6437B75892C5361BC0F213BD7/WE32160C5930447DDAEDBCF841396BE87--K46?dossier.filters=${urlAPIlink}`;
        console.log('customUrl4:' + customUrl4);
        await browser.url(customUrl4);
        await dossierPage.waitForDossierLoading();
        //Validate selector
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Value filter'))
            .toEqual(12);
        await since(
            'The first element of Category should be #{expected} after apply customUrl4, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Value filter', headerName: 'Category' }))
            .toBe('Electronics');
        await since(
            'The first element of Cost metric should be #{expected} after apply customUrl4, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Value filter', headerName: 'Cost' }))
            .toBe('$4,970,513');
        //Apply value selector Profit Lowest % 10 has issue
        urlAPIJSON = [
            {
                key: 'WA0A197BAC061446AA480B0DEAF64D6C1',
                name: 'Profit',
                currentSelection: {
                    expression: {
                        operator: 'Percent.Bottom',
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
            {
                key: 'W03BC827ACB3344D59FFA11470F1586DE',
                name: 'Cost',
                currentSelection: {
                    selectionStatus: 'unfiltered',
                },
            },
        ];
        urlAPIlink = encodeURIComponent(JSON.stringify(urlAPIJSON));
        const customUrl5 = `${url}/9D8A49D54E04E0BE62C877ACC18A5A0A/6E6AB6E6437B75892C5361BC0F213BD7/WE32160C5930447DDAEDBCF841396BE87--K46?dossier.filters=${urlAPIlink}`;
        console.log('customUrl5:' + customUrl5);
        await browser.url(customUrl5);
        await dossierPage.waitForDossierLoading();
        //Validate selector
        await since(
            'The first element of Category should be #{expected} after apply customUrl5, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Value filter', headerName: 'Category' }))
            .toBe('Books');
        await since(
            'The first element of Cost metric should be #{expected} after apply customUrl5, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Value filter', headerName: 'Cost' }))
            .toBe('$510,239');
    });

    it('[TC94180] Validate URL API pass Attribute/Metric selector in Library Web', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossier,
        });
        const url = await browser.getUrl();
        //Apply attribute and metric selector: attribute Catrgory and Year, metric Cost
        let urlAPIJSON = [
            {
                key: 'WABB9F804B09D433EABD454268034509E',
                name: 'Selector 2',
                currentSelection: {
                    selectionStatus: 'included',
                    objectItems: [
                        {
                            id: 'i7FD5B69611D5AC76C000D98A4CC5F24F;7FD5B69611D5AC76C000D98A4CC5F24F',
                            name: 'Cost',
                        },
                    ],
                },
            },
            {
                key: 'WCE96E7FDBE28415892DD4C0687D21B16',
                name: 'Selector 3',
                currentSelection: {
                    objectItems: [
                        {
                            id: 'U8D679D3711D3E4981000E787EC6DE8A4;8D679D3711D3E4981000E787EC6DE8A4',
                            name: 'Category',
                        },
                        {
                            id: 'U8D679D5111D3E4981000E787EC6DE8A4;8D679D5111D3E4981000E787EC6DE8A4',
                            name: 'Year',
                        },
                    ],
                },
            },
        ];
        let urlAPIlink = encodeURIComponent(JSON.stringify(urlAPIJSON));
        const customUrl = `${url}/9D8A49D54E04E0BE62C877ACC18A5A0A/6E6AB6E6437B75892C5361BC0F213BD7/W07239399E8134F38BE8944EABBC1E909--K46?dossier.filters=${urlAPIlink}`;
        console.log('customUrl:' + customUrl);
        await browser.url(customUrl);
        await dossierPage.waitForDossierLoading();
        //Validate selector
        let metric = InCanvasSelector.createByTitle('Selector 2');
        await since('Cost item selected should be #{expected}, while we get #{actual}')
            .expect(await metric.isItemSelected('Cost'))
            .toBe(true);
        let attribute = InCanvasSelector.createByTitle('Selector 3');
        await since('Multi select item, selected item should be #{expected}, while we get #{actual}')
            .expect(await attribute.getSelectedDrodownItem())
            .toBe('Category, Year');
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Attribute/Metric selector'))
            .toEqual(13);
        await since(
            'The first element of Category should be #{expected} after apply customUrl2, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Attribute/Metric selector', headerName: 'Category' }))
            .toBe('Books');
        await since('The first element of Year should be #{expected} after apply customUrl2, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Attribute/Metric selector', headerName: 'Year' }))
            .toBe('2014');
        await since(
            'The first element of Cost metric should be #{expected} after apply customUrl4, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Attribute/Metric selector', headerName: 'Cost' }))
            .toBe('$510,239');
    });

    it('[TC94181] Validate URL API pass Panel selector in Library Web', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossier,
        });
        const url = await browser.getUrl();
        //Apply panel selector: switch from panel3-1 to panel 3-3 in panel3
        let urlAPIJSON = [
            {
                key: 'W1FA27FC760DF46D69EA367C5EFFE506D',
                name: 'Panel Selector 5',
                currentSelection: {
                    panels: [
                        {
                            key: 'WC9FC17B84EAE429CBC5973A4DE94A91A',
                            name: 'Panel 3-3',
                        },
                    ],
                },
            },
        ];
        let urlAPIlink = encodeURIComponent(JSON.stringify(urlAPIJSON));
        const customUrl = `${url}/9D8A49D54E04E0BE62C877ACC18A5A0A/6E6AB6E6437B75892C5361BC0F213BD7/W5190B8DA7E884EF4B62AE3006FF79EA5--K46?dossier.filters=${urlAPIlink}`;
        console.log('customUrl:' + customUrl);
        await browser.url(customUrl);
        await dossierPage.waitForDossierLoading();
        //Validate selector
        const panelSelector = InCanvasSelector.createByTitle('Panel Selector 4');
        await since('Panel 1 selected should be #{expected}, while we get #{actual}')
            .expect(await panelSelector.isItemSelected('Panel 1'))
            .toBe(true);
        await since(
            'The first element of Quarter should be #{expected} after apply customUrl, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Quarter', headerName: 'Quarter' }))
            .toBe('2014 Q1');
        //Apply panel selector: switch from panel1 to panel3
        urlAPIJSON = [
            {
                key: 'WB6B0B33AC80848A59AE863033FE4102A',
                name: 'Panel Selector 4',
                currentSelection: {
                    panels: [
                        {
                            key: 'W05E432C7D67C45E69C22432C157AB3B1',
                            name: 'Panel 3',
                        },
                    ],
                },
            },
        ];
        urlAPIlink = encodeURIComponent(JSON.stringify(urlAPIJSON));
        const customUrl2 = `${url}/9D8A49D54E04E0BE62C877ACC18A5A0A/6E6AB6E6437B75892C5361BC0F213BD7/W5190B8DA7E884EF4B62AE3006FF79EA5--K46?dossier.filters=${urlAPIlink}`;
        console.log('customUrl2:' + customUrl2);
        await browser.url(customUrl2);
        await dossierPage.waitForDossierLoading();
        //Validate selector
        await since('Cost item selected should be #{expected}, while we get #{actual}')
            .expect(await panelSelector.isItemSelected('Panel 3'))
            .toBe(true);
        await since('The first element of Year should be #{expected} after apply customUrl2, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Year', headerName: 'Year' }))
            .toBe('2014');
        const embedPanelSelector = InCanvasSelector.createByTitle('Panel Selector 5');
        await since('Selected panel should be #{expected}, while we get #{actual}')
            .expect(await embedPanelSelector.getSelectedDrodownItem())
            .toBe('Panel 3-3');
        await since(
            'The first element of Category should be #{expected} after apply customUrl2, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Category', headerName: 'Category' }))
            .toBe('Books');
    });

    it('[TC94182_01] Validate URL API pass Value Parameter selector in Library Web - Text Parameter', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: parameterDossier,
        });
        const url = await browser.getUrl();

        //Apply parameter selection
        let urlAPIJSON = [
            {
                key: 'W07D6C5BD33EF48D8BA5E67DA51BD44B2',
                name: 'Text Parameter',
                currentSelection: {
                    selectionStatus: 'included',
                    values: ['Movies'],
                },
            },
            {
                key: 'WCE167B17C37D48E38074753863EAA24D',
                name: 'Date and Time Parameter',
                currentSelection: {
                    selectionStatus: 'included',
                    values: ['5/31/2015'],
                },
            },
            {
                key: 'WFF8F4A04B4F64D21BCB70514294D2BF4',
                name: 'Input Date Parameter',
                currentSelection: {
                    selectionStatus: 'included',
                    values: ['5/23/2024 12:00:00 AM'],
                },
            },
            {
                key: 'WAD172200213D4F4DB7085B93A428A86B',
                name: 'Big Decimal Parameter',
                currentSelection: {
                    selectionStatus: 'included',
                    values: ['3456.34'],
                },
            },
            {
                key: 'W4DD4CF206B5743B482A256BC942DB90E',
                name: 'Number Parameter',
                currentSelection: {
                    selectionStatus: 'included',
                    values: ['3034534'],
                },
            },
        ];
        let urlAPIlink = encodeURIComponent(JSON.stringify(urlAPIJSON));
        const customUrl = `${url}/9D8A49D54E04E0BE62C877ACC18A5A0A/F924F1FE42465D85FC8DCE8D68A5160E/K53--K46?dossier.filters=${urlAPIlink}`;
        console.log('customUrl:' + customUrl);
        await browser.url(customUrl);
        await dossierPage.waitForDossierLoading();
        const textParameter = InCanvasSelector.createByTitle('Text Parameter');
        await since('Dropdown selection should be #{expected} after apply customUrl4, instead we have #{actual}')
            .expect(await textParameter.getSelectedDrodownItem())
            .toBe('Movies');
        const dateAndTimeParameter = InCanvasSelector.createByTitle('Date and Time Parameter');
        await since('dateAndTimeParameter should be #{expected} after apply customUrl4, instead we have #{actual}')
            .expect(await dateAndTimeParameter.dateAndTimeText())
            .toBe('5/31/2015');
        const inputDateParameter = InCanvasSelector.createByTitle('Input Date Parameter');
        await since('Input Date Parameter should be #{expected} after apply customUrl, instead we have #{actual}')
            .expect(await inputDateParameter.dateAndTimeText())
            .toBe('5/23/2024 12:00:00 AM');
        const bigDecimalSelector = InCanvasSelector.createByTitle('Big Decimal Parameter');
        await since(
            'The first element of Cost metric should be #{expected} after apply customUrl, instead we have #{actual}'
        )
            .expect(await bigDecimalSelector.textBoxInputText())
            .toBe('3456.34');
        const numberParameter = InCanvasSelector.createByTitle('Number Parameter');
        await since(
            'The first element of Cost metric should be #{expected} after apply customUrl, instead we have #{actual}'
        )
            .expect(await numberParameter.textBoxInputText())
            .toBe('3034534');
        // Validate Grid
        await since(
            'The first element of Cost Goal should be #{expected} after apply customUrl4, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Cost goal' }))
            .toBe('$38,541,249');
        await since(
            'The first element of Cost based on category should be #{expected} after apply customUrl4, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Cost based on category' }))
            .toBe('$1,591');
    });

    it('[TC94182_02] Validate URL API pass Value Parameter selector in Library Web - Reset', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: parameterDossier,
        });
        const url = await browser.getUrl();

        //Apply Date and Time parameter selector: 5/31/2015
        let urlAPIJSON = [
            {
                key: 'W07D6C5BD33EF48D8BA5E67DA51BD44B2',
                name: 'Text Parameter',
                currentSelection: {
                    selectionStatus: 'unfiltered',
                    values: ['Movies'],
                },
            },
            {
                key: 'WCE167B17C37D48E38074753863EAA24D',
                name: 'Date and Time Parameter',
                currentSelection: {
                    selectionStatus: 'unfiltered',
                    values: ['5/31/2015'],
                },
            },
            {
                key: 'WFF8F4A04B4F64D21BCB70514294D2BF4',
                name: 'Input Date Parameter',
                currentSelection: {
                    selectionStatus: 'unfiltered',
                    values: ['5/23/2024 12:00:00 AM'],
                },
            },
            {
                key: 'WAD172200213D4F4DB7085B93A428A86B',
                name: 'Big Decimal Parameter',
                currentSelection: {
                    selectionStatus: 'unfiltered',
                    values: ['3456.34'],
                },
            },
            {
                key: 'W4DD4CF206B5743B482A256BC942DB90E',
                name: 'Number Parameter',
                currentSelection: {
                    selectionStatus: 'unfiltered',
                    values: ['3034534'],
                },
            },
        ];
        let urlAPIlink = encodeURIComponent(JSON.stringify(urlAPIJSON));
        const customUrl = `${url}/9D8A49D54E04E0BE62C877ACC18A5A0A/F924F1FE42465D85FC8DCE8D68A5160E/K53--K46?dossier.filters=${urlAPIlink}`;
        console.log('customUrl:' + customUrl);
        await browser.url(customUrl);
        await dossierPage.waitForDossierLoading();
        const textParameter = InCanvasSelector.createByTitle('Text Parameter');
        await since('Dropdown selection should be #{expected} after apply customUrl4, instead we have #{actual}')
            .expect(await textParameter.getSelectedDrodownItem())
            .toBe('');
        const dateAndTimeParameter = InCanvasSelector.createByTitle('Date and Time Parameter');
        await since('dateAndTimeParameter should be #{expected} after apply customUrl4, instead we have #{actual}')
            .expect(await dateAndTimeParameter.dateAndTimeText())
            .toBe('');
        const inputDateParameter = InCanvasSelector.createByTitle('Input Date Parameter');
        await since('Input Date Parameter should be #{expected} after apply customUrl, instead we have #{actual}')
            .expect(await inputDateParameter.dateAndTimeText())
            .toBe('');
        const bigDecimalSelector = InCanvasSelector.createByTitle('Big Decimal Parameter');
        await since(
            'The first element of Cost metric should be #{expected} after apply customUrl, instead we have #{actual}'
        )
            .expect(await bigDecimalSelector.textBoxInputText())
            .toBe('');
        const numberParameter = InCanvasSelector.createByTitle('Number Parameter');
        await since(
            'The first element of Cost metric should be #{expected} after apply customUrl, instead we have #{actual}'
        )
            .expect(await numberParameter.textBoxInputText())
            .toBe('300000');
        // Validate Grid
        await since(
            'The first element of Cost Goal should be #{expected} after apply customUrl4, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Cost goal' }))
            .toBe('$0');
        await since(
            'The first element of Cost based on category should be #{expected} after apply customUrl4, instead we have #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Cost based on category' }))
            .toBe('$11,151');
    });

    it('[TC94185] Validate URL API pass Element List Parameter in Library Web', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: parameterDossier,
        });
        const url = await browser.getUrl();
        //Apply category: include electronics; Year: exclude2016
        let urlAPIJSON = [
            {
                key: 'W179F79B6233A4DD09B561D4C9936C454',
                name: 'Year',
                currentSelection: {
                    selectionStatus: 'excluded',
                    allSelected: false,
                    elements: [
                        {
                            id: 'h2016;8D679D5111D3E4981000E787EC6DE8A4',
                            name: '2016',
                        },
                    ],
                },
            },
            {
                key: 'W1443D0CC10D44C1AAEA448DFCF814279',
                name: 'Category',
                currentSelection: {
                    selectionStatus: 'included',
                    allSelected: false,
                    elements: [
                        {
                            id: 'h3;8D679D3711D3E4981000E787EC6DE8A4',
                            name: 'Movies',
                        },
                    ],
                },
            },
        ];
        let urlAPIlink = encodeURIComponent(JSON.stringify(urlAPIJSON));
        const customUrl = `${url}/9D8A49D54E04E0BE62C877ACC18A5A0A/F924F1FE42465D85FC8DCE8D68A5160E/K53--K46?dossier.filters=${urlAPIlink}`;
        console.log('customUrl:' + customUrl);
        await browser.url(customUrl);
        await dossierPage.waitForDossierLoading();
        //Validate selector
        let linkbarSelector = InCanvasSelector.createByTitle('Category');
        let checkboxSelector = InCanvasSelector.createByTitle('Year');
        await since('Movie selected should be #{expected}, while we get #{actual}')
            .expect(await linkbarSelector.isLinkItemSelected('Movies'))
            .toBe(true);
        await since('2016 selected should be #{expected} after apply customUrl, instead we have #{actual}')
            .expect(await checkboxSelector.isItemSelected('2016'))
            .toBe(true);

        // select all
        let urlAPIJSON1 = [
            {
                key: 'W179F79B6233A4DD09B561D4C9936C454',
                name: 'Year',
                currentSelection: {
                    selectionStatus: 'included',
                    allSelected: true,
                },
            },
        ];
        let urlAPIlink1 = encodeURIComponent(JSON.stringify(urlAPIJSON1));
        const customUrl1 = `${url}/9D8A49D54E04E0BE62C877ACC18A5A0A/F924F1FE42465D85FC8DCE8D68A5160E/K53--K46?dossier.filters=${urlAPIlink1}`;
        console.log('customUrl1:' + customUrl1);
        await browser.url(customUrl1);
        await dossierPage.waitForDossierLoading();
        //Validate selector
        let checkboxSelector1 = InCanvasSelector.createByTitle('Year');
        await since('All selected should be #{expected} after apply customUrl, instead we have #{actual}')
            .expect(await checkboxSelector1.isItemSelected('(All)'))
            .toBe(true);

        // unfiltered
        let urlAPIJSON2 = [
            {
                key: 'W179F79B6233A4DD09B561D4C9936C454',
                name: 'Year',
                currentSelection: {
                    selectionStatus: 'unfiltered',
                    allSelected: true,
                },
            },
            {
                key: 'W1443D0CC10D44C1AAEA448DFCF814279',
                name: 'Category',
                currentSelection: {
                    selectionStatus: 'unfiltered',
                    allSelected: false,
                },
            },
        ];
        let urlAPIlink2 = encodeURIComponent(JSON.stringify(urlAPIJSON2));
        const customUrl2 = `${url}/9D8A49D54E04E0BE62C877ACC18A5A0A/F924F1FE42465D85FC8DCE8D68A5160E/K53--K46?dossier.filters=${urlAPIlink2}`;
        console.log('customUrl2:' + customUrl2);
        await browser.url(customUrl2);
        await dossierPage.waitForDossierLoading();
        //Validate selector
        let linkbarSelector2 = InCanvasSelector.createByTitle('Category');
        await since('Movie selected should be #{expected}, while we get #{actual}')
            .expect(await linkbarSelector2.isLinkItemSelected('Movies'))
            .toBe(false);
        await since('Movie selected should be #{expected}, while we get #{actual}')
            .expect(await linkbarSelector2.isLinkItemSelected('Books'))
            .toBe(true);
        let checkboxSelector2 = InCanvasSelector.createByTitle('Year');
        await since('All selected should be #{expected} after apply customUrl, instead we have #{actual}')
            .expect(await checkboxSelector2.isItemSelected('(All)'))
            .toBe(true);
    });
});

export const config = specConfiguration;
