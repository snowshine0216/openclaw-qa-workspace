import setWindowSize from '../../../../config/setWindowSize.js';
import NativeEmbeddingPage from '../../../../pageObjects/embedding/NativeEmbeddingPage.js';
import { takeScreenshot } from '../../../../utils/TakeScreenshot.js';
import resetDossierState from '../../../../api/resetDossierState.js';

const embeddingPageUrl = 'http://10.23.32.59:9001/native-embedding.html';
const loginConfig = {
    username: 'administrator',
    password: 'Q_Ti8~O4rHhy',
};

describe('Native Embedding SDK Test - Apply Filters', () => {
    const { grid, dossierPage, agGridVisualization } = browsers.pageObj1;
    let embeddingPage: NativeEmbeddingPage;
    let libraryUrl: string;

    const tutorialProject = {
        id: 'B19DEDCC11D4E0EFC000EB9495D0F44F',
        name: 'Tutorial Project',
    };

    const valueParameterDashboard = {
        id: 'D7A45A87B5491B7EF579148B1D104C5A',
        name: 'Value Parameter Filter Dashboard',
        project: tutorialProject,
    };

    beforeAll(async () => {
        libraryUrl = browser.options.baseUrl as string;
        embeddingPage = new NativeEmbeddingPage(embeddingPageUrl, libraryUrl);

        // @ts-expect-error: Disable linter
        await browser.cdp('Network', 'setCacheDisabled', { cacheDisabled: true });
        const browserWindow = {
            width: 1600,
            height: 1200,
        };
        await setWindowSize(browserWindow);
    });

    afterAll(async () => {
        // @ts-expect-error: Disable linter
        await browser.cdp('Network', 'setCacheDisabled', { cacheDisabled: false });
    });

    it('[TC98931] Apply multiple chapter level filters via "MstrDossier.applyFilters" API', async () => {
        const projectId = 'B19DEDCC11D4E0EFC000EB9495D0F44F';
        const dashboardId = 'AC2E2AFA2745785266D48F9389D7F297';
        const visKeys = ['W79', '243B739428C34D4FB10E02D935F5D26F'];
        await browser.url(embeddingPageUrl);
        await embeddingPage.loadScripts();
        await embeddingPage.createEnvironment(loginConfig);
        const dossierKey = await embeddingPage.loadDashboard(projectId, dashboardId);
        await embeddingPage.renderVisualizations(dossierKey, visKeys);

        const filters = [
            {
                // attribute element list Year - chapter filter
                key: 'W122',
                currentSelection: {
                    elements: [
                        {
                            name: '2009',
                            id: 'h2009;C560F5CD964A2CD17C8D65AAD9BB516E',
                        },
                    ],
                },
            },
            {
                // attribute element list "Origin Airport" - chapter filter
                key: 'W126',
                currentSelection: {
                    allSelected: true,
                },
            },
            {
                // attribute element list "Month" - chapter filter
                key: 'W124',
                currentSelection: {
                    elements: [
                        {
                            name: 'January',
                            id: 'hJanuary;7B95E229D24CC9BC0B88C8BDD60667A9',
                        },
                    ],
                },
            },
        ];

        await embeddingPage.applyFilters(dossierKey, filters);
        // Check the first visualization Grid
        const yearColumnData = await grid.getOneColumnData('Visualization 1', 'Year');
        console.log('Year column data: ' + yearColumnData);
        await since('The Year column only contains 2009')
            .expect(yearColumnData.every((year) => year === '2009'))
            .toBe(true);
        const originAirportColumnData = await grid.getOneColumnData('Visualization 1', 'Origin Airport');
        console.log('Origin Airport column data: ' + originAirportColumnData);
        await since('The Origin Airport column contains BWI, DCA and IAD')
            .expect(['BWI', 'DCA', 'IAD'].every((a) => originAirportColumnData.includes(a)))
            .toBe(true);
        const monthColumnData = await grid.getOneColumnData('Visualization 1', 'Month');
        console.log('Month column data: ' + monthColumnData);
        await since('The Month column only contains January')
            .expect(monthColumnData.every((month) => month === 'January'))
            .toBe(true);

        // Check the second visualization AgGrid
        // Something wrong with grid.getOneColumnData for aggrid. Need to debug later.
        // const agGridYearColumnData = await grid.getOneColumnData('Visualization 2', 'Year', true);
        // console.log('Year column data: ' + agGridYearColumnData);
        // await since('The Year column only contains 2020')
        //     .expect(agGridYearColumnData.every((year) => year === '2020'))
        //     .toBe(true);
        // regionColumnData = await grid.getOneColumnData('Visualization 2', 'Region', true);
        // console.log('Region column data: ' + regionColumnData);
        // await since('The Region column only contains all elements')
        //     .expect(
        //         regionColumnData.every((region) =>
        //             ['Central', 'Mid-Atlantic', 'Northeast', 'South', 'Southeast'].includes(region)
        //         )
        //     )
        //     .toBe(true);
        // categoryColumnData = await grid.getOneColumnData('Visualization 2', 'Category', true);
        // console.log('Category column data: ' + categoryColumnData);
        // await since('The Category column only contains Electronics')
        //     .expect(categoryColumnData.every((dept) => dept === 'Electronics'))
        //     .toBe(true);
    });

    it('[TC98937] Apply multiple on-page selectors via "MstrDossier.applyFilters" API', async () => {
        const projectId = 'B19DEDCC11D4E0EFC000EB9495D0F44F';
        const dashboardId = 'AC2E2AFA2745785266D48F9389D7F297';
        const visKeys = ['K52'];
        await browser.url(embeddingPageUrl);
        await embeddingPage.loadScripts();
        await embeddingPage.createEnvironment(loginConfig);
        const dossierKey = await embeddingPage.loadDashboard(projectId, dashboardId);
        await embeddingPage.renderVisualizations(dossierKey, visKeys);

        const filters = [
            {
                // selector - Year
                key: 'W223',
                currentSelection: {
                    allSelected: true,
                },
            },
            {
                // selector - Origin Airport
                key: 'W225',
                currentSelection: {
                    elements: [
                        {
                            id: 'hBWI;89F208D8AD4DBB688302D687BE5A8E3A',
                            name: 'BWI',
                        },
                        {
                            id: 'hDCA;89F208D8AD4DBB688302D687BE5A8E3A',
                            name: 'DCA',
                        },
                    ],
                },
            },
        ];

        await embeddingPage.applyFilters(dossierKey, filters);
        // Check the first visualization Grid
        const yearColumnData = await grid.getOneColumnDataWithColSpan('Visualization 1', 'Year');
        console.log('Year column data: ' + yearColumnData);
        const expectedYears = ['2009', '2010', '2011'];
        await since('The Year column contains 2009, 2010, 2011')
            .expect(expectedYears.every((y) => yearColumnData.includes(y)))
            .toBe(true);

        const airportColumnData = await grid.getOneColumnDataWithColSpan('Visualization 1', 'Origin Airport');
        console.log('Airport column data: ' + airportColumnData);
        await since('The Origin Airport column only contains BWI or DCA')
            .expect(airportColumnData.every((airport) => airport === 'BWI' || airport === 'DCA'))
            .toBe(true);
    });

    it('[TC98938] Apply multiple visualizations used as filters via "MstrDossier.applyFilters" API', async () => {
        const projectId = 'B19DEDCC11D4E0EFC000EB9495D0F44F';
        const dashboardId = 'AC2E2AFA2745785266D48F9389D7F297';
        const visKeys = ['K250', 'W231', 'W232'];
        await browser.url(embeddingPageUrl);
        await embeddingPage.loadScripts();
        await embeddingPage.createEnvironment(loginConfig);
        const dossierKey = await embeddingPage.loadDashboard(projectId, dashboardId);
        await embeddingPage.renderVisualizations(dossierKey, visKeys);

        const filters = [
            {
                // vis as filter - Visualization 2
                key: 'W231',
                currentSelection: {
                    selectionStatus: 'included', // optional
                    type: 'attribute_element_list', // required
                    selections: [
                        {
                            attribute: {
                                id: 'C560F5CD964A2CD17C8D65AAD9BB516E',
                                name: 'Year',
                            },
                            elements: [
                                {
                                    id: 'h2009;C560F5CD964A2CD17C8D65AAD9BB516E',
                                    name: '2009',
                                },
                            ],
                        },
                    ],
                },
            },
            {
                // vis as filter - Visualization 3
                key: 'W232',
                currentSelection: {
                    selectionStatus: 'included', // optional
                    type: 'attribute_element_list', // required
                    selections: [
                        {
                            attribute: {
                                id: '89F208D8AD4DBB688302D687BE5A8E3A', // attribute id, required
                                name: 'Origin Airport', // attribute name, optional
                            },
                            elements: [
                                {
                                    id: 'hIAD;89F208D8AD4DBB688302D687BE5A8E3A',
                                    name: 'IAD', // attribute element name, optional
                                },
                            ],
                        },
                    ],
                },
            },
        ];

        await embeddingPage.applyFilters(dossierKey, filters);
        // Check the first visualization Grid
        const yearColumnData = await grid.getOneColumnDataWithColSpan('Visualization 1', 'Year');
        console.log('Year column data: ' + yearColumnData);
        await since('The Year column contains all elements')
            .expect(yearColumnData.every((year) => year === '2009'))
            .toBe(true);

        const originAirportColumnData = await grid.getOneColumnDataWithColSpan('Visualization 1', 'Origin Airport');
        console.log('Origin Airport column data: ' + originAirportColumnData);
        await since('The Origin Airport column only contains IAD')
            .expect(originAirportColumnData.every((airport) => airport === 'IAD'))
            .toBe(true);
    });

    it('[TC98941] Apply multiple type of filters via a single call of ApplyFilters API', async () => {
        const projectId = 'B19DEDCC11D4E0EFC000EB9495D0F44F';
        const dashboardId = 'AC2E2AFA2745785266D48F9389D7F297';
        const visKeys = ['K299', 'W241'];
        await browser.url(embeddingPageUrl);
        await embeddingPage.loadScripts();
        await embeddingPage.createEnvironment(loginConfig);
        const dossierKey = await embeddingPage.loadDashboard(projectId, dashboardId);
        await embeddingPage.renderVisualizations(dossierKey, visKeys);

        const filters = [
            {
                // vis as filter - Visualization 1
                key: 'W241',
                currentSelection: {
                    selectionStatus: 'included', // optional
                    type: 'attribute_element_list', // required
                    selections: [
                        {
                            attribute: {
                                id: '7B95E229D24CC9BC0B88C8BDD60667A9', // attribute id, required
                                name: 'Month', // attribute name, optional
                            },
                            elements: [
                                {
                                    id: 'hFebruary;7B95E229D24CC9BC0B88C8BDD60667A9',
                                    name: 'February',
                                },
                            ],
                        },
                    ],
                },
            },
            {
                // selector - Origin Airport
                key: 'W240',
                currentSelection: {
                    allSelected: true,
                },
            },
            {
                // chapter filter - Year
                key: 'W238',
                currentSelection: {
                    elements: [
                        {
                            id: 'h2010;C560F5CD964A2CD17C8D65AAD9BB516E',
                            name: '2010',
                        },
                    ],
                },
            },
        ];

        await embeddingPage.applyFilters(dossierKey, filters);
        // Check the first visualization Grid
        const yearColumnData = await grid.getOneColumnData('Visualization 1', 'Year');
        await since('The Year column only contains 2010')
            .expect(yearColumnData.every((year) => year === '2010'))
            .toBe(true);
        const originAirportColumnData = await grid.getOneColumnData('Visualization 1', 'Origin Airport');
        await since('The Origin Airport column contains BWI, DCA and IAD')
            .expect(['BWI', 'DCA', 'IAD'].every((a) => originAirportColumnData.includes(a)))
            .toBe(true);
        const monthColumnData = await grid.getOneColumnData('Visualization 1', 'Month');
        await since('The Month column only contains February')
            .expect(monthColumnData.every((month) => month === 'February'))
            .toBe(true);
    });

    it('[BCIN-6510_1] Apply number input and date range value parameter in chapter filter via "MstrDossier.applyFilters" API', async () => {
        const visKeys = ['K52'];
        await resetDossierState({
            credentials: loginConfig,
            dossier: valueParameterDashboard,
        });
        await browser.url(embeddingPageUrl);
        await embeddingPage.loadScripts();
        await embeddingPage.createEnvironment(loginConfig);
        await embeddingPage.enableMultipleInstance();
        const dossierKey = await embeddingPage.loadDashboard(valueParameterDashboard.project.id, valueParameterDashboard.id);
        await embeddingPage.renderVisualizations(dossierKey, visKeys);
        await dossierPage.waitForDossierLoading();

        // W63 DVP_Number_Input in chapter filter and W71 DVP_Date_Range in chapter filter
        const valueParameterFilters = [{
            key: 'W63',
            currentSelection: {
                value: '1', // Books
            },
        }, {

            key: 'W71',
            currentSelection: {
                value: '11/1/2014',
            },
        }];

        await embeddingPage.applyFilters(dossierKey, valueParameterFilters);
        await dossierPage.waitForDossierLoading();
        // take screenshot after applying value parameter filter
        await takeScreenshot('BCIN-6510_1_1', 'Apply number input value parameter filter');
        // assert the cell value in grid
        const categoryColumnData = await grid.getOneColumnData('Visualization 1', 'Category');
        console.log('Category column data: ' + categoryColumnData);
        await since('The Category column only contains the expected values')
            .expect(categoryColumnData.every((category) => category === 'Books'))
            .toBe(true);
        

        const dayColumnData = await grid.getOneColumnData('Visualization 1', 'Day');
        console.log('Day column data: ' + dayColumnData);
        await since('The Day column only contains the expected values')
            .expect(dayColumnData.every((day) => day === '11/1/2014'))
            .toBe(true);
        
    });

    it('[BCIN-6510_2] Apply text list value parameter filter via "MstrDossier.applyFilter" API', async () => {
        await resetDossierState({
            credentials: loginConfig,
            dossier: valueParameterDashboard,
        });
        const visKeys = ['W65'];
        await browser.url(embeddingPageUrl);
        await embeddingPage.loadScripts();
        await embeddingPage.createEnvironment(loginConfig);
        await embeddingPage.enableMultipleInstance();
        const dossierKey = await embeddingPage.loadDashboard(valueParameterDashboard.project.id, valueParameterDashboard.id);
        await embeddingPage.renderVisualizations(dossierKey, visKeys);
        await dossierPage.waitForDossierLoading();

        // W69 DVP_Text_List in canvas selector
        const valueParameterFilter = {
            key: 'W69',
            currentSelection: {
                value: 'Music',
            },
        };

        await embeddingPage.applyFilter(dossierKey, valueParameterFilter);
        await dossierPage.waitForDossierLoading();
        // take screenshot after applying text list value parameter filter
        await takeScreenshot('BCIN-6510_2_1', 'Apply text list value parameter filter');
    });

    it('[BCIN-6510_3] Apply decimal input value parameter filter via "MstrDossier.applyFilter" API', async () => {
        await resetDossierState({
            credentials: loginConfig,
            dossier: valueParameterDashboard,
        });
        const visKeys = ['763C6B24F3DF4546A4242C4325349719'];
        await browser.url(embeddingPageUrl);
        await embeddingPage.loadScripts();
        await embeddingPage.createEnvironment(loginConfig);
        await embeddingPage.enableMultipleInstance();
        const dossierKey = await embeddingPage.loadDashboard(valueParameterDashboard.project.id, valueParameterDashboard.id);
        await embeddingPage.renderVisualizations(dossierKey, visKeys);
        await dossierPage.waitForDossierLoading();

        // W77 DVP_Decimal_Input in canvas selector
        const valueParameterFilter = {
            key: 'W77',
            currentSelection: {
                value: '1000000',
            },
        };

        await embeddingPage.applyFilter(dossierKey, valueParameterFilter);
        await dossierPage.waitForDossierLoading();
        // take screenshot after applying decimal input value parameter filter
        await takeScreenshot('BCIN-6510_3_1', 'Apply decimal input value parameter filter');
    });

    it('[BCIN-6510_4] Apply dataset level number list value parameter filter via "MstrDossier.applyFilter" API', async () => {
        await resetDossierState({
            credentials: loginConfig,
            dossier: valueParameterDashboard,
        });
        const visKeys = ['W78'];
        await browser.url(embeddingPageUrl);
        await embeddingPage.loadScripts();
        await embeddingPage.createEnvironment(loginConfig);
        await embeddingPage.enableMultipleInstance();
        const dossierKey = await embeddingPage.loadDashboard(valueParameterDashboard.project.id, valueParameterDashboard.id);
        await embeddingPage.renderVisualizations(dossierKey, visKeys);
        await dossierPage.waitForDossierLoading();

        // W80 DataVP_Number_List in chapter filter
        const valueParameterFilter = {
            key: 'W80',
            currentSelection: {
                value: '1000000',
            },
        };

        await embeddingPage.applyFilter(dossierKey, valueParameterFilter);
        await dossierPage.waitForDossierLoading();
        // take screenshot after applying dataset level number list value parameter filter
        await takeScreenshot('BCIN-6510_4_1', 'Apply dataset level number list value parameter filter');
    });
});
