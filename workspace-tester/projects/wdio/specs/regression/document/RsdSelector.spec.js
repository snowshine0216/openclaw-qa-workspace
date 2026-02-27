import resetDossierState from '../../../api/resetDossierState.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

describe('Document Selector', () => {
    const tutorialProject = {
        id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
        name: 'MicroStrategy Tutorial',
    };
    const docDropdownMultiSelect = {
        id: 'DC6D9FA64FC8F0DDCE9618A6683E5D06',
        name: '(AUTO) Dropdown_MultiSelect_LibrarySanity',
        project: tutorialProject,
    };

    let { libraryPage, loginPage, dossierPage, selectorObject } = browsers.pageObj1;
    let dropdown = selectorObject.dropdown;

    beforeAll(async () => {
        await loginPage.login(browsers.params.credentials);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC73431] Web Platform | Dropdown selector - Multi-Select manipulation on select and cancel', async () => {
        await resetDossierState({
            credentials: browsers.params.credentials,
            dossier: docDropdownMultiSelect,
        });
        await libraryPage.openDossier(docDropdownMultiSelect.name);

        // use last 3
        await since('Dropdown Multi-select, by default selected items should be #{expected}, while we get #{actual}')
            .expect(await dropdown.getShownSelectedText())
            .toBe('Southeast, Southwest, Web');

        // action button - OK
        await dropdown.openDropdown();
        await takeScreenshotByElement(dropdown.getDropdownList(), 'TC73431', 'Dropdown_MultiSelect_Manipulation_UI');
        await dropdown.selectMultiItemByText(['Central', 'Southeast']);
        await dropdown.clickOKBtn();
        await since(
            'Dropdown Multi-select, confirm selection, selected items should be #{expected}, while we get #{actual}'
        )
            .expect(await dropdown.getShownSelectedText())
            .toBe('Central, Southwest, Web');

        // action button - Cancel
        await dropdown.openDropdown();
        await dropdown.selectMultiItemByText(['Northeast', 'Southeast']);
        await dropdown.clickCancelBtn();
        await since(
            'Dropdown Multi-select manipulation: Cancel selection, selected items should be #{expected}, while we get #{actual}'
        )
            .expect(await dropdown.getShownSelectedText())
            .toBe('Central, Southwest, Web');
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC73431', 'Dropdown_MultiSelect_ConfirmSelect');

        // show total
        await dropdown.openDropdownAndMultiSelect(['Total']);
        await since('Dropdown Multi-select, select total, selected items should be #{expected}, while we get #{actual}')
            .expect(await dropdown.getShownSelectedText())
            .toBe('Central, Southwest, Web, Total');
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC73431', 'Dropdown_MultiSelect_ShowTotal');

        // show all
        await dropdown.openDropdownAndMultiSelect(['(All)']);
        await since('Dropdown Multi-select, select all, selected items should be #{expected}, while we get #{actual}')
            .expect(await dropdown.getShownSelectedText())
            .toBe('(All)');
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC73431', 'Dropdown_MultiSelect_ShowAll');
    });
});
