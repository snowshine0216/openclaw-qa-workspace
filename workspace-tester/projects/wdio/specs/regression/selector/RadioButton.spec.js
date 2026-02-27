import { customCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

const specConfiguration = { ...customCredentials('_selector') };
const { credentials } = specConfiguration;
const tolerance = 0.2;

const tutorialProject = {
    id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
    name: 'MicroStrategy Tutorial',
};

describe('Radio button Selector', () => {
    const docProperty1 = {
        id: '70FE085B461DC089EBC25281846E8239',
        name: 'AUTO_Radio Button_all items same width_Exclude',
        project: tutorialProject,
    };
    const docProperty2 = {
        id: 'D477D46F4A618AE35F91348AA1B7D2D0',
        name: 'AUTO_Radio Button_automatic update_no northeast',
        project: tutorialProject,
    };
    const docProperty3 = {
        id: '67311EC54BF200F3D92A2AA6DD26E9E0',
        name: 'AAuto_Radio Button_show title_orientation',
        project: tutorialProject,
    };
    const docProperty4 = {
        id: 'E2611EF9492C0B082476C7BF697F7D9C',
        name: 'AUTO_Radio Button_set to specific_2nd_with all',
        project: tutorialProject,
    };
    const docFormat1 = {
        id: 'BB536CC84824261E67430BB67691957B',
        name: 'AUTO_Alignment_Radio Button',
        project: tutorialProject,
    };
    const docFormat2 = {
        id: 'D538613E4A84B458BA9812B77B7BB527',
        name: 'AUTO_Color and Lines_Radio Button',
        project: tutorialProject,
    };
    const docFormat3 = {
        id: 'AD5F1AF643AD56F9D95C73A0B136E305',
        name: 'AUTO_Font_Radio Button',
        project: tutorialProject,
    };
    const docsSourceAndTarget1 = {
        id: '9B68D6B642B6D2781E9DB684E8BD9C7B',
        name: 'AUTO_New_No Source_Select Attribute',
        project: tutorialProject,
    };
    const docsSourceAndTarget2 = {
        id: '86D54D634921F1359C0BB3AACBFC4839',
        name: 'AUTO_New_No Target_Dataset as Target_Graph as target',
        project: tutorialProject,
    };

    let { loginPage, selector, libraryPage, dossierPage, rsdPage, toc, rsdGrid } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC80369] Library | Radio button selector - Property', async () => {
        // Exclude
        await resetDossierState({ credentials, dossier: docProperty1 });
        await libraryPage.openUrl(tutorialProject.id, docProperty1.id);
        await selector.radiobutton.selectNthItem(1, 'Mid-Atlantic');
        await since('Exclude mode: Mid-Atlantic should be excluded')
            .expect(await selector.radiobutton.isItemSelected(1, 'Mid-Atlantic'))
            .toBe(true);

        // Make all items the same width
        await since('Exclude mode, first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('Northwest');

        // Automatically update when there is no data for the current selection
        await resetDossierState({ credentials, dossier: docProperty2 });
        await libraryPage.openUrl(tutorialProject.id, docProperty2.id);
        await since('Automatically update when there is no data: Northest should NOT be existed')
            .expect(await selector.radiobutton.isItemExisted('Northeast'))
            .toBe(false);

        // Orientation: verical, horizontal
        await resetDossierState({ credentials, dossier: docProperty3 });
        await libraryPage.openUrl(tutorialProject.id, docProperty3.id);
        const verticalSelector1 = rsdPage.findSelectorByName('customizedCategory');
        await verticalSelector1.radiobutton.selectNthItem(2, 'Books');
        await since('Vertical and horizontal orientation + show customized title: Books should be selected')
            .expect(await verticalSelector1.radiobutton.isItemSelected(2, 'Books'))
            .toBe(true);
        await takeScreenshotByElement(
            verticalSelector1.radiobutton.getElement(),
            'TC80369',
            'RadioButtonSelector_Property_Orientation_CustomizedTitle'
        );

        // Show title: customized title + default title
        const verticalSelector2 = rsdPage.findSelectorByName('defaultRegion');
        await verticalSelector2.radiobutton.selectNthItem(2, 'Central');
        await since('Vertical and horizontal orientation + show default title: Central should be selected')
            .expect(await verticalSelector2.radiobutton.isItemSelected(2, 'Central'))
            .toBe(true);
        await takeScreenshotByElement(
            verticalSelector2.radiobutton.getElement(),
            'TC80369',
            'RadioButtonSelector_Property_Orientation_defaultTitle'
        );
        await since('Customized title, first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('Books');

        // Set to specific
        await resetDossierState({ credentials, dossier: docProperty4 });
        await libraryPage.openUrl(tutorialProject.id, docProperty4.id);
        await since('Set to specfic: Selected elements count should be #{expected}, while we get #{actual}')
            .expect(await selector.radiobutton.getSeletedItemsCount())
            .toBe(1);
        await since('Set to specific, first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('Books');

        // Show All
        await since('Show all: Customized_All should be displayed for selection')
            .expect(await selector.radiobutton.isItemExisted('Customized_All'))
            .toBe(true);
        await selector.radiobutton.selectNthItem(1, 'Customized_All');
        await since('Show all: Customized_All should be selected')
            .expect(await selector.radiobutton.isItemSelected(1, 'Customized_All'))
            .toBe(true);
        await takeScreenshotByElement(
            selector.radiobutton.getElement(),
            'TC80369',
            'RadioButtonSelector_Property_ShowAll'
        );
        await since('Show all: first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('Books');
    });

    it('[TC80370] Library | Radio button selector - Foramt', async () => {
        // Alignment
        await resetDossierState({ credentials, dossier: docFormat1 });
        await libraryPage.openUrl(tutorialProject.id, docFormat1.id);
        await selector.radiobutton.selectNthItem(2, 'Books');
        await since('Alignment left/center/right: Books should be selected')
            .expect(await selector.radiobutton.isItemSelected(2, 'Books'))
            .toBe(true);
        await takeScreenshotByElement(
            rsdPage.getDocLayoutViewer(),
            'TC80370',
            'RadioButtonSelector_Format_Alignment_selectElement',
            {
                tolerance: tolerance,
            }
        );

        // Color and lines
        await resetDossierState({ credentials, dossier: docFormat2 });
        await libraryPage.openUrl(tutorialProject.id, docFormat2.id);
        await selector.radiobutton.selectNthItem(2, 'Books');
        await since('Color and lines: Books should be selected')
            .expect(await selector.radiobutton.isItemSelected(2, 'Books'))
            .toBe(true);
        await takeScreenshotByElement(
            rsdPage.getDocLayoutViewer(),
            'TC80370',
            'RadioButtonSelector_Format_ColorAndLines_selectElement',
            {
                tolerance: tolerance,
            }
        );

        // Font
        await resetDossierState({ credentials, dossier: docFormat3 });
        await libraryPage.openUrl(tutorialProject.id, docFormat3.id);
        await selector.radiobutton.selectNthItem(2, 'Books');
        await since('Font for body: Books should be selected')
            .expect(await selector.radiobutton.isItemSelected(2, 'Books'))
            .toBe(true);
        await takeScreenshotByElement(
            rsdPage.getDocLayoutViewer(),
            'TC80370',
            'RadioButtonSelector_Format_TitleFont_selectElement',
            {
                tolerance: tolerance,
            }
        );
    });

    it('[TC80371] Library | Radio button selector - Source and Target', async () => {
        // With source - select attribute - no candidate
        await resetDossierState({ credentials, dossier: docsSourceAndTarget1 });
        await libraryPage.openUrl(tutorialProject.id, docsSourceAndTarget1.id);
        await since(
            'With source - select attribute - no candidate: first grid element should be #{expected}, while we get #{actual}'
        )
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('2014');

        // With source - select attribute - with candidate
        const selector1 = rsdPage.findSelectorByName('attributeWithCandidate');
        await selector1.radiobutton.selectItemByText('Quarter');
        await selector1.radiobutton.sleep(1000); // wait dataset to be refreshed
        await since('With candidate - select attribute: Quarter should be selected')
            .expect(await selector1.radiobutton.isItemSelectedByText('Quarter'))
            .toBe(true);
        await since('With source - select attribute: first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('2014 Q1');

        // No target
        await resetDossierState({ credentials, dossier: docsSourceAndTarget2 });
        await libraryPage.openUrl(tutorialProject.id, docsSourceAndTarget2.id);
        const selector2 = rsdPage.findSelectorByName('NoTarget');
        await selector2.radiobutton.selectItemByText('Movies');
        await since('No target: Movies should be selected')
            .expect(await selector2.radiobutton.isItemSelectedByText('Movies'))
            .toBe(true);

        // With target - viz
        const selector3 = rsdPage.findSelectorByName('ObjectAsTarget');
        await selector3.radiobutton.selectItemByText('Electronics');
        await since('With target - viz: Electronics should be selected')
            .expect(await selector3.radiobutton.isItemSelectedByText('Electronics'))
            .toBe(true);

        // With target - dataset
        const selector4 = rsdPage.findSelectorByName('DatasetAsTarget');
        await selector4.radiobutton.selectItemByText('Electronics');
        await selector4.radiobutton.sleep(1000); // wait dataset to be refreshed
        await since('With target - dataset: Electronics should be the only one displayed on the selector')
            .expect((await selector4.radiobutton.getRadioListItems()).length)
            .toBe(1);
        await since('With target - dataset: Electronics should be selected')
            .expect(await selector4.radiobutton.isItemSelectedByText('Electronics'))
            .toBe(true);
        await since('With target - viz: Electronics should be the only one displayed on the selector')
            .expect((await selector3.radiobutton.getRadioListItems()).length)
            .toBe(1);
        await since('No target: Electronics should be the only one displayed on the selector')
            .expect((await selector2.radiobutton.getRadioListItems()).length)
            .toBe(1);
    });

    it('[TC80372] Library | Radio button selector - Manipulation', async () => {
        await resetDossierState({ credentials, dossier: docsSourceAndTarget1 });
        await libraryPage.openUrl(tutorialProject.id, docsSourceAndTarget1.id);
        const selector = rsdPage.findSelectorByName('attributeWithCandidate');

        // select element - candidate
        await selector.radiobutton.selectItemByText('Quarter');
        await selector.radiobutton.sleep(3000); //wait dataset to be rendered stabliy
        await since('Select element: Quarter should be selected')
            .expect(await selector.radiobutton.isItemSelectedByText('Quarter'))
            .toBe(true);
        await since('Select element: Category display should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.isCellDisplayed('Quarter'))
            .toBe(true);

        // select element - template
        await selector.radiobutton.selectItemByText('Category');
        await selector.radiobutton.sleep(3000); //wait dataset to be rendered stabliy
        await since('Select element: Category should be selected')
            .expect(await selector.radiobutton.isItemSelectedByText('Category'))
            .toBe(true);
        await since('Select element: Category display should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.isCellDisplayed('Category'))
            .toBe(true);
    });
});
export const config = specConfiguration;
