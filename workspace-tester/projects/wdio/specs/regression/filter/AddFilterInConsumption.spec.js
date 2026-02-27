import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { customCredentials } from '../../../constants/index.js';
import * as consts from '../../../constants/visualizations.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('') };

//npm run wdio -- --baseUrl=http://10.23.36.102:8080/MicroStrategyLibrary --params.credentials.username=tqmsuser params.credentials.password=ddset --spec 'specs/regression/filter/AddFilterInConsumption.spec.js'
describe('Allow users to add their own filters on-the-fly while consuming dashboards without having to access the editor', () => {
    const tutorialProject = {
        id: 'B628A31F11E7BD953EAE0080EF0583BD',
        name: 'New MicroStrategy Tutorials',
    };
    const AddFilterInLibraryE2E = {
        id: '8516A0894FBD8B377AE27B8214BF6BEF',
        name: 'Add Filter in Library Consumption Sanity',
        project: tutorialProject,
    };

    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let {
        dossierPage,
        filterPanel,
        checkboxFilter,
        libraryPage,
        loginPage,
        toc,
        agGridVisualization,
        } = browsers.pageObj1;
  
    beforeEach(async () => {
        if (!(await loginPage.isLoginPageDisplayed())) {
            await browser.url(new URL('auth/ui/loginPage', browser.options.baseUrl).toString(), 100000);
        }
        await loginPage.login(consts.tqmsUser.credentials);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC99017] ACC | Adding attributes to the filter panel from Consumption', async () => {
        const url = browser.options.baseUrl + `/app/${tutorialProject.id}/${AddFilterInLibraryE2E.id}`;
        await libraryPage.openDossierByUrl(url.toString());
        await dossierPage.resetDossierIfPossible();
        //initial status
        await since('The ag-grid cell in "Visualization 1" at "2", "1" should have text "Books", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(2, 1, "Visualization 1", "Books"))
        .toBe(true);
        await since('The ag-grid cell in "Visualization 1" at "3", "1" should have text "Electronics", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(3, 1, "Visualization 1", "Electronics"))
        .toBe(true);
        await since('The ag-grid cell in "Visualization 1" at "4", "1" should have text "Movies", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(4, 1, "Visualization 1", "Movies"))
        .toBe(true);

        // Add Supplier into Filter panel in Chapter 1 Page 1
        await filterPanel.openFilterPanel();
        since('Filter "Region" displayed should be #{expected}, instead we have #{actual}')
        .expect(await filterPanel.isFilterDisplayedInFilterPanel('Region'))
        .toBe(true);
        since('Filter "Supplier" displayed should be #{expected}, instead we have #{actual}')
        .expect(await filterPanel.isFilterDisplayedInFilterPanel('Supplier'))
        .toBe(false);

        await filterPanel.clickAddFilterButton();
        since('Attribute "Region" displayed should be #{expected}, instead we have #{actual}')
        .expect(await filterPanel.isAttributeDisplayedInAddFilter('Region'))
        .toBe(false);
        since('Attribute "Supplier" displayed should be #{expected}, instead we have #{actual}')
        .expect(await filterPanel.isAttributeDisplayedInAddFilter('Supplier'))
        .toBe(true);

        await filterPanel.clickAttributeInAddFilter("Supplier");
        await filterPanel.clickAddOrCancelButtonInAddFilter("Add");

        await filterPanel.openFilterPanel();
        since('Filter "Region" displayed should be #{expected}, instead we have #{actual}')
        .expect(await filterPanel.isFilterDisplayedInFilterPanel('Region'))
        .toBe(true);
        since('Filter "Supplier" displayed should be #{expected}, instead we have #{actual}')
        .expect(await filterPanel.isFilterDisplayedInFilterPanel('Supplier'))
        .toBe(true);
        
        // Make selections in "Supplier" filter and validate
        await checkboxFilter.openSecondaryPanel('Supplier');
        await checkboxFilter.selectElementByName('Bantam Books');
        await checkboxFilter.selectElementByName('McGraw Hill');
        await checkboxFilter.selectElementByName('A&E Entertainment');
        await filterPanel.apply();

        await since('The ag-grid cell in "Visualization 1" at "2", "1" should have text "Books", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(2, 1, "Visualization 1", "Books"))
        .toBe(true);
        await since('The ag-grid cell in "Visualization 1" at "3", "1" should have text "Movies", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(3, 1, "Visualization 1", "Movies"))
        .toBe(true);
        await since('The ag-grid cell in "Visualization 1" at "4", "1" should have text "Books", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(4, 1, "Visualization 1", "Books"))
        .toBe(true);

        // Switch to Chapter 1, Page 2 to grid
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 2' });
        await since('The ag-grid cell in "Visualization 1" at "2", "0" should have text "Bantam Books", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(2, 0, "Visualization 1", "Bantam Books"))
        .toBe(true);
        await since('The ag-grid cell in "Visualization 1" at "6", "0" should have text "McGraw Hill", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(6, 0, "Visualization 1", "McGraw Hill"))
        .toBe(true);
        await since('The ag-grid cell in "Visualization 1" at "7", "0" should have text "A&E Entertainment", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(7, 0, "Visualization 1", "A&E Entertainment"))
        .toBe(true);

        // In Chapter 1 Page 2, add "Category" into Filter Panel
        await filterPanel.openFilterPanel();
        since('Filter "Region" displayed should be #{expected}, instead we have #{actual}')
        .expect(await filterPanel.isFilterDisplayedInFilterPanel('Region'))
        .toBe(true);
        since('Filter "Supplier" displayed should be #{expected}, instead we have #{actual}')
        .expect(await filterPanel.isFilterDisplayedInFilterPanel('Supplier'))
        .toBe(true);
        since('Filter "Category" displayed should be #{expected}, instead we have #{actual}')
        .expect(await filterPanel.isFilterDisplayedInFilterPanel('Category'))
        .toBe(false);

        await filterPanel.clickAddFilterButton();
        since('Attribute "Region" displayed should be #{expected}, instead we have #{actual}')
        .expect(await filterPanel.isAttributeDisplayedInAddFilter('Region'))
        .toBe(false);
        since('Attribute "Supplier" displayed should be #{expected}, instead we have #{actual}')
        .expect(await filterPanel.isAttributeDisplayedInAddFilter('Supplier'))
        .toBe(false);
        since('Attribute "Category" displayed should be #{expected}, instead we have #{actual}')
        .expect(await filterPanel.isAttributeDisplayedInAddFilter('Category'))
        .toBe(true);
        await filterPanel.clickAttributeInAddFilter("Category");
        await filterPanel.clickAddOrCancelButtonInAddFilter("Add");
        await filterPanel.openFilterPanel();
        since('Filter "Region" displayed should be #{expected}, instead we have #{actual}')
        .expect(await filterPanel.isFilterDisplayedInFilterPanel('Region'))
        .toBe(true);
        since('Filter "Supplier" displayed should be #{expected}, instead we have #{actual}')
        .expect(await filterPanel.isFilterDisplayedInFilterPanel('Supplier'))
        .toBe(true);
        since('Filter "Category" displayed should be #{expected}, instead we have #{actual}')
        .expect(await filterPanel.isFilterDisplayedInFilterPanel('Category'))
        .toBe(true);

        // Make selections in Category selector and validate
        await checkboxFilter.openSecondaryPanel('Category');
        await checkboxFilter.selectElementByName('Movies');
        await filterPanel.apply();
        await since('The ag-grid cell in "Visualization 1" at "2", "0" should have text "A&E Entertainment", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(2, 0, "Visualization 1", "A&E Entertainment"))
        .toBe(true);

        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();
        since('Filter "Region" displayed should be #{expected}, instead we have #{actual}')
        .expect(await filterPanel.isFilterDisplayedInFilterPanel('Region'))
        .toBe(true);
        since('Filter "Supplier" displayed should be #{expected}, instead we have #{actual}')
        .expect(await filterPanel.isFilterDisplayedInFilterPanel('Supplier'))
        .toBe(true);
        since('Filter "Category" displayed should be #{expected}, instead we have #{actual}')
        .expect(await filterPanel.isFilterDisplayedInFilterPanel('Category'))
        .toBe(true);
        await filterPanel.closeFilterPanel();

        await since('The ag-grid cell in "Visualization 1" at "2", "1" should have text "Movies", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(2, 1, "Visualization 1", "Movies"))
        .toBe(true);
        await since('The ag-grid cell in "Visualization 1" at "3", "1" should have text "Movies", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(3, 1, "Visualization 1", "Movies"))
        .toBe(true);
        await since('The ag-grid cell in "Visualization 1" at "4", "1" should have text "Movies", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(4, 1, "Visualization 1", "Movies"))
        .toBe(true);

        // Switch to Chapter 2 Page 1 to add "Quarter" into the Filter Panel
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 2', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();
        since('Filter "Year" displayed should be #{expected}, instead we have #{actual}')
        .expect(await filterPanel.isFilterDisplayedInFilterPanel('Year'))
        .toBe(true);
        since('Filter "Region" displayed should be #{expected}, instead we have #{actual}')
        .expect(await filterPanel.isFilterDisplayedInFilterPanel('Region'))
        .toBe(false);
        since('Filter "Supplier" displayed should be #{expected}, instead we have #{actual}')
        .expect(await filterPanel.isFilterDisplayedInFilterPanel('Supplier'))
        .toBe(false);
        since('Filter "Category" displayed should be #{expected}, instead we have #{actual}')
        .expect(await filterPanel.isFilterDisplayedInFilterPanel('Category'))
        .toBe(false);

        await filterPanel.clickAddFilterButton();
        since('Attribute "Year" displayed should be #{expected}, instead we have #{actual}')
        .expect(await filterPanel.isAttributeDisplayedInAddFilter('Year'))
        .toBe(false);
        since('Attribute "Region" displayed should be #{expected}, instead we have #{actual}')
        .expect(await filterPanel.isAttributeDisplayedInAddFilter('Region'))
        .toBe(true);
        since('Attribute "Supplier" displayed should be #{expected}, instead we have #{actual}')
        .expect(await filterPanel.isAttributeDisplayedInAddFilter('Supplier'))
        .toBe(true);
        since('Attribute "Category" displayed should be #{expected}, instead we have #{actual}')
        .expect(await filterPanel.isAttributeDisplayedInAddFilter('Category'))
        .toBe(true);

        await filterPanel.clickAttributeInAddFilter("Quarter");
        await filterPanel.clickAddOrCancelButtonInAddFilter("Add");
        await since('The ag-grid cell in "Visualization 1" at "1", "2" should have text "$137,691", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(1, 2, "Visualization 1", "$137,691"))
        .toBe(true);
        await since('The ag-grid cell in "Visualization 1" at "5", "2" should have text "$184,667", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(5, 2, "Visualization 1", "$184,667"))
        .toBe(true);
     
        // Make selections in "Quarter"
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('Quarter');
        await checkboxFilter.selectElementByName('2014 Q2');
        await checkboxFilter.selectElementByName('2015 Q3');
        await filterPanel.apply();

        await since('The ag-grid cell in "Visualization 1" at "1", "2" should have text "$30,983", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(1, 2, "Visualization 1", "$30,983"))
        .toBe(true);
        await since('The ag-grid cell in "Visualization 1" at "5", "2" should have text "$48,789", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(5, 2, "Visualization 1", "$48,789"))
        .toBe(true);

        // Reset the dossier to validate that these filters added on the fly have been removed
        await dossierPage.resetDossier();
        await since('The ag-grid cell in "Visualization 1" at "2", "1" should have text "Books", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(2, 1, "Visualization 1", "Books"))
        .toBe(true);
        await since('The ag-grid cell in "Visualization 1" at "3", "1" should have text "Electronics", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(3, 1, "Visualization 1", "Electronics"))
        .toBe(true);
        await since('The ag-grid cell in "Visualization 1" at "4", "1" should have text "Movies", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(4, 1, "Visualization 1", "Movies"))
        .toBe(true);

        await filterPanel.openFilterPanel();
        since('Filter "Region" displayed should be #{expected}, instead we have #{actual}')
        .expect(await filterPanel.isFilterDisplayedInFilterPanel('Region'))
        .toBe(true);
        since('Filter "Supplier" displayed should be #{expected}, instead we have #{actual}')
        .expect(await filterPanel.isFilterDisplayedInFilterPanel('Supplier'))
        .toBe(false);
        since('Filter "Category" displayed should be #{expected}, instead we have #{actual}')
        .expect(await filterPanel.isFilterDisplayedInFilterPanel('Category'))
        .toBe(false);
        since('Filter "Quarter" displayed should be #{expected}, instead we have #{actual}')
        .expect(await filterPanel.isFilterDisplayedInFilterPanel('Quarter'))
        .toBe(false);

        await filterPanel.clickAddFilterButton();
        since('Attribute "Region" displayed should be #{expected}, instead we have #{actual}')
        .expect(await filterPanel.isAttributeDisplayedInAddFilter('Region'))
        .toBe(false);
        since('Attribute "Supplier" displayed should be #{expected}, instead we have #{actual}')
        .expect(await filterPanel.isAttributeDisplayedInAddFilter('Supplier'))
        .toBe(true);
        since('Attribute "Category" displayed should be #{expected}, instead we have #{actual}')
        .expect(await filterPanel.isAttributeDisplayedInAddFilter('Category'))
        .toBe(true);
        since('Attribute "Quarter" displayed should be #{expected}, instead we have #{actual}')
        .expect(await filterPanel.isAttributeDisplayedInAddFilter('Quarter'))
        .toBe(true);

        await toc.openPageFromTocMenu({ chapterName: 'Chapter 2', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();
        since('Filter "Year" displayed should be #{expected}, instead we have #{actual}')
        .expect(await filterPanel.isFilterDisplayedInFilterPanel('Year'))
        .toBe(true);
        since('Filter "Region" displayed should be #{expected}, instead we have #{actual}')
        .expect(await filterPanel.isFilterDisplayedInFilterPanel('Region'))
        .toBe(false);
        since('Filter "Supplier" displayed should be #{expected}, instead we have #{actual}')
        .expect(await filterPanel.isFilterDisplayedInFilterPanel('Supplier'))
        .toBe(false);
        since('Filter "Category" displayed should be #{expected}, instead we have #{actual}')
        .expect(await filterPanel.isFilterDisplayedInFilterPanel('Category'))
        .toBe(false);
        since('Filter "Quarter" displayed should be #{expected}, instead we have #{actual}')
        .expect(await filterPanel.isFilterDisplayedInFilterPanel('Quarter'))
        .toBe(false);

        await filterPanel.clickAddFilterButton();
        since('Attribute "Year" displayed should be #{expected}, instead we have #{actual}')
        .expect(await filterPanel.isAttributeDisplayedInAddFilter('Year'))
        .toBe(false);
        since('Attribute "Region" displayed should be #{expected}, instead we have #{actual}')
        .expect(await filterPanel.isAttributeDisplayedInAddFilter('Region'))
        .toBe(true);
        since('Attribute "Supplier" displayed should be #{expected}, instead we have #{actual}')
        .expect(await filterPanel.isAttributeDisplayedInAddFilter('Supplier'))
        .toBe(true);
        since('Attribute "Category" displayed should be #{expected}, instead we have #{actual}')
        .expect(await filterPanel.isAttributeDisplayedInAddFilter('Category'))
        .toBe(true);
        since('Attribute "Quarter" displayed should be #{expected}, instead we have #{actual}')
        .expect(await filterPanel.isAttributeDisplayedInAddFilter('Quarter'))
        .toBe(true);

        await filterPanel.closeFilterPanel();
        await since('The ag-grid cell in "Visualization 1" at "1", "2" should have text "$137,691", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(1, 2, "Visualization 1", "$137,691"))
        .toBe(true);
        await since('The ag-grid cell in "Visualization 1" at "5", "2" should have text "$184,667", instead we have #{actual}')
        .expect(await agGridVisualization.isAgGridCellHasTextDisplayed(5, 2, "Visualization 1", "$184,667"))
        .toBe(true);
                        
    });

});
export const config = specConfiguration;
