import { customCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';

const specConfiguration = { ...customCredentials('_linking') };

describe('Dossier Linking - Pass Filter Panel', () => {
    const tutorialProject = {
        id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
        name: 'MicroStrategy Tutorial',
    };

    const filterSetting = {
        id: '468B5C33457CFD242A5DF2841F067060',
        name: '(AUTO) DossierLinking_Pass Filter Panel_Filter Setting',
        project: tutorialProject,
    };
    const filterType = {
        id: 'E1345F454439F386550F978FD435D884',
        name: '(AUTO) DossierLinking_Pass Filter Panel_Filter Type',
        project: tutorialProject,
    };
    const promptAnswerRequired = {
        id: '2E4A3AE64357C32D955662B3CD030E4C',
        name: '(AUTO) DossierLinking_PassFilterPanel_PromptAnswerRequired',
        project: tutorialProject,
    };
    const promptAnswerNotRequired = {
        id: '95D314044319932FDF19949A7A053561',
        name: '(AUTO) DossierLinking_PassFilterPanel_PromptAnswerNotRequired',
        project: tutorialProject,
    };

    const { credentials } = specConfiguration;

    let {
        dossierPage,
        toc,
        libraryPage,
        grid,
        textbox,
        imageContainer,
        promptEditor,
        pieChart,
        filterPanel,
        loginPage,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC77542] Verify pass filter panel to target prompt on text/image ', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: promptAnswerNotRequired,
        });
        await libraryPage.openDossier(promptAnswerNotRequired.name);

        // link from text
        await toc.openPageFromTocMenu({ chapterName: 'Prompt not required', pageName: 'Text' });
        await textbox.navigateLink(0);
        await since('Use the selected object as prompt answer should not show prompt window when link to target')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await since(
            'Pass filter panel by image, the prompt answer for [Year] should be #{expected}, while we get #{actual}'
        )
            .expect(await promptEditor.checkListSummary('Year'))
            .toEqual('2015, 2014');
        await promptEditor.cancelEditor();
        await dossierPage.goBackFromDossierLink();

        // link from image
        await toc.openPageFromTocMenu({ chapterName: 'Prompt not required', pageName: 'Image' });
        await imageContainer.navigateLinkInCurrentPage(0);
        await since('Use the selected object as prompt answer should not show prompt window when link to target')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await since(
            'Pass filter panel by image, the prompt answer for [Year] should be #{expected}, while we get #{actual}'
        )
            .expect(await promptEditor.checkListSummary('Year'))
            .toEqual('2015, 2014');
        await promptEditor.cancelEditor();
        await dossierPage.goBackFromDossierLink();
    });

    it('[TC82133] Verify pass filter panel to target prompt on grid/viz ', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: promptAnswerNotRequired,
        });
        await libraryPage.openDossier(promptAnswerNotRequired.name);

        // link from viz
        await toc.openPageFromTocMenu({ chapterName: 'Prompt not required', pageName: 'Viz' });
        await pieChart.linkToTargetByPiechartContextMenu({
            title: 'Visualization 1',
            slice: 'Books (6.80%)',
        });
        await since('Pass filter panel with unset state, prompt should NOT be prompteds')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await since(
            'Pass filter panel with unset state, the prompt answer should be #{expected}, while we get #{actual}'
        )
            .expect(await promptEditor.checkListSummary('Year'))
            .toEqual('2015, 2014');
        await promptEditor.cancelEditor();
        await dossierPage.goBackFromDossierLink();
    });

    it('[TC82134] Verify pass filter panel to target prompt from different filter setting ', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: filterSetting,
        });
        await libraryPage.openDossier(filterSetting.name);

        // Unset
        await toc.openPageFromTocMenu({ chapterName: 'Unset' });
        await grid.linkToTargetByGridContextMenu({ title: 'Visualization 1', headerName: 'Category' });
        await since('Pass filter panel with unset state, prompt should NOT be prompteds')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await since(
            'Pass filter panel with unset state, the prompt answer should be #{expected}, while we get #{actual}'
        )
            .expect(await promptEditor.checkListSummary('Category'))
            .toEqual('');
        await promptEditor.cancelEditor();
        await dossierPage.goBackFromDossierLink();

        // First 3
        await toc.openPageFromTocMenu({ chapterName: 'First 3' });
        await grid.linkToTargetByGridContextMenu({ title: 'Visualization 1', headerName: 'Category' });
        await since('Pass filter panel with unset state, prompt should NOT be prompteds')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await since(
            'Pass filter panel with unset state, , the prompt answer should be #{expected}, while we get #{actual}'
        )
            .expect(await promptEditor.checkListSummary('Category'))
            .toEqual('Movies, Electronics, Books');
        await promptEditor.cancelEditor();
        await dossierPage.goBackFromDossierLink();

        // Select elements
        await toc.openPageFromTocMenu({ chapterName: 'Select' });
        await grid.linkToTargetByGridContextMenu({ title: 'Visualization 1', headerName: 'Category' });
        await since('Pass filter panel with unset state, prompt should NOT be prompteds')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await since(
            'Pass filter panel with unset state, , the prompt answer should be #{expected}, while we get #{actual}'
        )
            .expect(await promptEditor.checkListSummary('Category'))
            .toEqual('Music:4, Movies:3');
        await promptEditor.cancelEditor();
        await dossierPage.goBackFromDossierLink();
    });

    it('[TC82135] Verify pass filter panel to target prompt from different filter type ', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: filterType,
        });
        await libraryPage.openDossier(filterType.name);

        // Radio button
        await toc.openPageFromTocMenu({ chapterName: 'radio button' });
        await grid.linkToTargetByGridContextMenu({ title: 'Visualization 1', headerName: 'Category' });
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await since(
            'Pass filter panel with radio button type, the prompt answer should be #{expected}, while we get #{actual}'
        )
            .expect(await promptEditor.checkListSummary('Category'))
            .toEqual('Electronics');
        await promptEditor.cancelEditor();
        await dossierPage.goBackFromDossierLink();

        // Slider
        await toc.openPageFromTocMenu({ chapterName: 'slider' });
        await grid.linkToTargetByGridContextMenu({ title: 'Visualization 1', headerName: 'Category' });
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await since(
            'Pass filter panel with slider type, the prompt answer should be #{expected}, while we get #{actual}'
        )
            .expect(await promptEditor.checkListSummary('Category'))
            .toEqual('Music, Movies, Electronics');
        await promptEditor.cancelEditor();
        await dossierPage.goBackFromDossierLink();

        // Searchbox
        await toc.openPageFromTocMenu({ chapterName: 'searchbox' });
        await grid.linkToTargetByGridContextMenu({ title: 'Visualization 1', headerName: 'Category' });
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await since(
            'Pass filter panel with searchbox type, the prompt answer should be #{expected}, while we get #{actual}'
        )
            .expect(await promptEditor.checkListSummary('Category'))
            .toEqual('Music, Electronics');
        await promptEditor.cancelEditor();
        await dossierPage.goBackFromDossierLink();

        // Checkbox
        await toc.openPageFromTocMenu({ chapterName: 'checkbox' });
        await grid.linkToTargetByGridContextMenu({ title: 'Visualization 1', headerName: 'Category' });
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await since(
            'Pass filter panel with checkbox type, the prompt answer should be #{expected}, while we get #{actual}'
        )
            .expect(await promptEditor.checkListSummary('Category'))
            .toEqual('Electronics, Books');
        await promptEditor.cancelEditor();
        await dossierPage.goBackFromDossierLink();
    });

    it('[TC77545] Verify pass filter panel to target prompt by date', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: promptAnswerNotRequired,
        });
        await libraryPage.openDossier(promptAnswerNotRequired.name);

        await toc.openPageFromTocMenu({ chapterName: 'Prompt not required', pageName: 'Grid' });
        await grid.linkToTargetByGridContextMenu({ title: 'normal grid(current tab)', headerName: 'Year' });
        await since('Pass Date filter panel, the prompt window should NOT be appeared ')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await since('Pass Date filter panel, the prompt answer for [Day] should be #{expected}, while we get #{actual}')
            .expect(await promptEditor.checkQualSummary('Day'))
            .toEqual('DayID Between2/15/2014 and 2/25/2014');
        await promptEditor.cancelEditor();
        await dossierPage.goBackFromDossierLink();
    });

    it('[TC82136] Verify pass filter panel to target prompt with prompt answer optional ', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: promptAnswerNotRequired,
        });
        await libraryPage.openDossier(promptAnswerNotRequired.name);
        await toc.openPageFromTocMenu({ chapterName: 'Prompt not required', pageName: 'Grid' });

        // select value
        await grid.linkToTargetByGridContextMenu({ title: 'normal grid(current tab)', headerName: 'Year' });
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await since(
            'Pass filter panel with prompt answer optional, the prompt answer should be #{expected}, while we get #{actual}'
        )
            .expect(await promptEditor.checkListSummary('Year'))
            .toEqual('2015, 2014');
        await promptEditor.cancelEditor();
        await dossierPage.goBackFromDossierLink();

        // select none values
        await filterPanel.openFilterPanel();
        await filterPanel.clearFilter();
        await filterPanel.apply();
        await grid.linkToTargetByGridContextMenu({ title: 'normal grid(current tab)', headerName: 'Year' });
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await since(
            'Pass filter panel with prompt answer optional(select none), the prompt answer should be #{expected}, while we get #{actual}s'
        )
            .expect(await promptEditor.checkListSummary('Year'))
            .toEqual('');
        await promptEditor.cancelEditor();
        await dossierPage.goBackFromDossierLink();
    });

    it('[TC82137] Verify pass filter panel to target prompt with prompt answer required ', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: promptAnswerRequired,
        });
        await libraryPage.openDossier(promptAnswerRequired.name);

        // prompt answer not meet min/max
        await toc.openPageFromTocMenu({ chapterName: 'Prompt required-not met' });
        await grid.linkToTargetByGridContextMenu({ title: 'Prompt answer is required', headerName: 'Category' }, true);
        await promptEditor.waitForEditor();
        await since(
            'Pass filter panel with prompt answer required, not met condition, prompt window should be appeared'
        )
            .expect(await promptEditor.isEditorOpen())
            .toBe(true);
        await promptEditor.toggleViewSummary();
        await since(
            'Pass filter panel with prompt answer required, the prompt answer should be #{expected}, while we get #{actual}'
        )
            .expect(await promptEditor.checkListSummary('Category'))
            .toEqual('Books, Electronics, Movies, Music');
        await promptEditor.run();
        await dossierPage.goBackFromDossierLink();

        // prompt answer meet min/max
        await toc.openPageFromTocMenu({ chapterName: 'Prompt required-met' });
        await grid.linkToTargetByGridContextMenu({ title: 'Prompt answer is required', headerName: 'Category' });
        await since(
            'Pass filter panel with prompt answer required, met condition, prompt window should NOT be appeared'
        )
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await since(
            'Pass filter panel with prompt answer required, the prompt answer should be #{expected}, while we get #{actual}'
        )
            .expect(await promptEditor.checkListSummary('Category'))
            .toEqual('Electronics, Books');
        await promptEditor.cancelEditor();
        await dossierPage.goBackFromDossierLink();
    });
});
export const config = specConfiguration;
