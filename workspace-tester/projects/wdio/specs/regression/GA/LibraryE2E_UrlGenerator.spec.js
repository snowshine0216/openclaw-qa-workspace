import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { customCredentials } from '../../../constants/index.js';
import InCanvasSelector from '../../../pageObjects/selector/InCanvasSelector.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

const specConfiguration = { ...customCredentials('_urlgenerate') };

describe('E2E test for Url Generator', () => {
    const promptDossier = {
        id: 'E599FBA34FB4240B49EA989005C575E5',
        name: '(Auto) URL API Pass Prompt',
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
        filterSummaryBar,
        grid,
        authoringFilters,
        toolbar,
        promptEditor,
        promptObject,
        dossierEditorUtility,
        libraryAuthoringPage,
        rsdPage,
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

    it('[TC96805] Verify E2E workflow of URL Generation in Library Web', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: promptDossier,
        });
        let url = await browser.getUrl();

        // Generate URL
        await libraryPage.openDossier(promptDossier.name);
        await libraryAuthoringPage.editDossierFromLibrary();
        await authoringFilters.switchToFilterPanel();
        const checkboxFilter = rsdPage.findSelectorByName('Category');
        await checkboxFilter.checkbox.selectItemByText('Electronics');
        await authoringFilters.metricFilter.changeMetricSliderSelection({
            filterName: 'Cost',
            optionName: 'Lowest %',
            upperpos: 10,
        });
        const YearSelector = rsdPage.findSelectorByName('Year');
        await YearSelector.checkbox.selectItemByText('2014');
        await authoringFilters.metricFilter.changeMQSelection({
            filterName: 'Revenue',
            optionName: 'Between',
            value1: '300000',
            value2: '400000',
        });
        await toolbar.clickButtonFromToolbar('Re-prompt');
        let promptDate = await promptObject.getPromptByName('Date');
        await promptObject.textbox.clearAndInputText(promptDate, '11/1/2014');
        await promptEditor.run();
        await toolbar.clickURLGeneratorButton();
        await authoringFilters.selectFilterItems(['Category', 'Cost', 'Year', 'Revenue']);
        await takeScreenshotByElement(dossierEditorUtility.getRootViewContent(), 'TC96805', 'Selected Filters');
        await toolbar.clickSelectValuePromptButton();
        await promptEditor.selectPromptItems(['Date', 'Text']);
        await promptEditor.clickSelectButton();
        await toolbar.clickGenerateLinkButton();
        let urlGenerated = await dossierPage.getClipboardText();
        console.log('urlGenerated:' + urlGenerated);

        // Apply URL
        await browser.url(urlGenerated);
        await dossierPage.waitForDossierLoading();
        await since('Apply url, Cost in Grid should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Cost' }))
            .toBe('$281,981');
        await since('Apply url, filter summary for Category should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Category'))
            .toBe('(Books, Electronics)');
        await since('Apply url, filter summary for Cost should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Cost'))
            .toBe('[Lowest 74%]');
        const YearICS = InCanvasSelector.createByTitle('Year');
        const RevenueICS = InCanvasSelector.createByTitle('Revenue');
        await since('Apply url, ICS for Year should be #{expected}, instead we have #{actual}')
            .expect(await YearICS.getSelectedItemsText())
            .toEqual(['2015', '2016']);
        await since('Apply url, ICS for Revenue should be #{expected}, instead we have #{actual}')
            .expect(await RevenueICS.getAriaLabel())
            .toBe('Revenue, 300000 400000, ');

        await promptEditor.reprompt();
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC58942_33', 'Qualification&ValuePromptSummary');

        await promptEditor.closeEditor();
        await grid.clickGridElementLink({
            title: 'Visualization 1',
            headerName: 'Subcategory(Link)',
            elementName: 'Business',
        });
        await libraryPage.switchToTab(1);
        await since('Apply url, Subcategory should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Subcategory'))
            .toBe('(Business)');

        await libraryAuthoringPage.editDossierFromLibrary();
        await toolbar.clickURLGeneratorButton();
        await authoringFilters.selectFilterItems(['Subcategory']);
        await authoringFilters.clickDynamicButtons(['Subcategory']);
        await toolbar.clickGenerateLinkButton();
        urlGenerated = await dossierPage.getClipboardText();
        console.log('urlGenerated:' + urlGenerated);

        let pageKey = 'K53--K46';
        let urlE2E = `${url}/${promptDossier.project.id}/${promptDossier.id}/${pageKey}?filters=%5B%7B%22key%22%3A%22W026A2E8408064B54B27C0386593629D0%22%2C%22currentSelection%22%3A%7B%22elements%22%3A%5B%7B%22id%22%3A%22h{[Subcategory]@ID};8D679D4F11D3E4981000E787EC6DE8A4%22%7D%5D%2C%22selectionStatus%22%3A%22included%22%2C%22allSelected%22%3Afalse%7D%7D%5D`;
        await since('URL Generated should be #{expected}, instead we have #{actual}')
            .expect(urlGenerated)
            .toContain(urlE2E);
    });
});

export const config = specConfiguration;
