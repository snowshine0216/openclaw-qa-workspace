import { customCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_linking') };

describe('E2E Dossier Linking', () => {
    const tutorialProject = {
        id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
        name: 'MicroStrategy Tutorial',
    };
    const sourceAndTargetDossier_NewTab = {
        id: '6B089C184E36B5FE8637ACAE93EA55E5',
        name: '(AUTO) DossierLinking_Source and Target_OpenInNewTab',
        project: tutorialProject,
    };
    const passFilterOnText = {
        id: 'E2673EFE44F4E85E694F8C8B17CB345F',
        name: '(AUTO) DossierLinking_Pass Filter_Text/Image',
        project: tutorialProject,
    };
    const passPromptAnswerTypeDossier = {
        id: '9124B26F4711F1962764188D4A5755B5',
        name: '(AUTO) DossierLinking_Pass Prompt_Answer Type',
        project: tutorialProject,
    };

    const { credentials } = specConfiguration;

    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let {
        loginPage,
        dossierPage,
        toc,
        libraryPage,
        grid,
        promptEditor,
        filterSummary,
        textbox,
        imageContainer,
        pieChart,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);

        await loginPage.login(specConfiguration.credentials);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC78617_01] E2E - Validate dossier linking end-to-end user journey - open in new tab', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: sourceAndTargetDossier_NewTab,
        });
        await libraryPage.openDossier(sourceAndTargetDossier_NewTab.name);

        await toc.openPageFromTocMenu({ chapterName: 'Viz', pageName: 'grid' });
        await grid.linkToTargetByGridContextMenu({
            title: 'link to another dossier - itself',
            headerName: 'Category',
            elementName: 'Books',
        });
        await dossierPage.switchToTab(1);
        await dossierPage.waitForDossierLoading();
        await grid.openViewFilterContainer('link to this dossier');
        if (libraryPage.isSafari()) {
            await since('Attribute value should be #{expected}, while we got #{actual}')
                .expect(await grid.getViewFilterItemText())
                .toBe('Clear "Category =  Books"');
        } else {
            await since('Attribute value should be #{expected}, while we got #{actual}')
                .expect(await grid.getViewFilterItemText())
                .toBe('Clear "Category = Books"');
        }
        await grid.closeViewFilterContainer('link to this dossier');
        await dossierPage.closeTab(1);
    });

    it('[TC78617_02] E2E - Validate dossier linking end-to-end user journey - pass filter', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: passFilterOnText,
        });
        await libraryPage.openDossier(passFilterOnText.name);

        //pass single filter
        await toc.openPageFromTocMenu({ chapterName: 'pass filter: single filter' });
        await textbox.navigateLink(0);
        await since('Link to target, back icon should be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(true);
        await since(
            'Pass single filter, filter [Year] is passed and value should be #{expected}, while we got #{actual}'
        )
            .expect(await filterSummary.filterItems('Year'))
            .toBe('(2014, 2015)');
        await dossierPage.goBackFromDossierLink();
    });

    it('[TC78617_03] E2E - Validate dossier linking end-to-end user journey - pass prompt', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: passPromptAnswerTypeDossier,
        });
        await libraryPage.openDossier(passPromptAnswerTypeDossier.name);

        //use the same answer from the source prompt
        await toc.openPageFromTocMenu({
            chapterName: 'prompt answers',
            pageName: 'use the same answer from the source prompt',
        });
        await grid.linkToTargetByGridContextMenu({ title: 'linking', headerName: 'Category' });
        await since('Use the same answer from the source prompt should not show prompt window when link to target')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await since(
            'In use the same answer from the source prompt, the prompt answer for [Category] should be default values: #{expected}'
        )
            .expect(await promptEditor.checkListSummary('Category'))
            .toEqual('Books, Electronics, Movies');
        await promptEditor.cancelEditor();
        await dossierPage.goBackFromDossierLink();
    });
});
export const config = specConfiguration;
