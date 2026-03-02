import { customCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';



const specConfiguration = { ...customCredentials('_authoring') };

describe('Dossier Linking Editor', () => {
    const tutorialProject = {
        id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
        name: 'MicroStrategy Tutorial',
    };
    const DossierWithoutPrompt = {
        id: '24DB222846D123808FB15589E8275121',
        name: 'Page Linking',
        project: tutorialProject,
    };

    const DossierWithPrompt = {
        id: '16A67BDA40BB2DC36DABBE9F0DB75E90',
        name: 'DossierLinking_Pass Prompt and Filter',
        project: tutorialProject,
    };

    const DossierCrossProject = {
        id: 'FF7984274A528556B8D864AC4B2D40C3',
        name: 'DossierLinking_CrossProject_Source',
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
        loginPage,
        libraryAuthoringPage,
        dossierAuthoringPage,
        linkEditor,
        promptEditor,
        baseVisualization,
        contextualLinkEditor,
        contentsPanel,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);
        
    });

    
    afterEach(async () => {
        await dossierAuthoringPage.closeDossierWithoutSaving();
        await dossierPage.goToLibrary();
    });

    

    it('[TC97765_04] Verify url link editor', async () => {

        // go into authoring mode
        await libraryPage.openDossier(DossierWithoutPrompt.name);
        await libraryAuthoringPage.editDossierFromLibrary();
        // link editor with dashboard set open in new tab 
        await textbox.openTextLinkEditor('link to page in same chapter');
        since('The selected tab should be #{expected}, instead we have #{actual} ').expect(await linkEditor.getSelectedTabName()).toBe('Dashboard');
        takeScreenshotByElement(await linkEditor.getlinkEditor(), 'TC97765_04', 'url link editor ');
       
        // cancle and close the link editor
        await linkEditor.closeEditorWithoutSaving();
    

    });

    it('[TC97765_05] Verify contextual link editor with prompt ', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: DossierWithPrompt,
        });
        // go into authoring mode
        await libraryPage.openDossier(DossierWithPrompt.name);
        await promptEditor.run();
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await promptEditor.run();

        // open contextual link editor
        await contentsPanel.goToPage({ chapterName: 'prompt answers_category', pageName: 'Prompt user' });
        
        // check UI and answer prompt options
        await baseVisualization.editContextualLink('Prompt user');
        since('Current answer prompt options should be #{expected}, instead we have #{actual} ')
            .expect(await contextualLinkEditor.getAnswerPromptOptionsText()).toEqual(['Prompt user', 'Use the selected values as the answer', 'Use the same answer from the source prompt', 'Use the default answer', 'Ignore the prompt']);
        takeScreenshotByElement(await contextualLinkEditor.getContextuallinkEditor(), 'TC97765_05', 'contextual link editor');

        // choose prompt and check the prompt options
        await contextualLinkEditor.choosePrompt('Any other prompts');
        since('Answer prompt options for any other prompts should be #{expected}, instead we have #{actual} ')
            .expect(await contextualLinkEditor.getAnswerPromptOptionsText()).toEqual(['Prompt user', 'Use the same answer from the source prompt', 'Use the default answer', 'Ignore the prompt']);
        await contextualLinkEditor.cancelEditor();

    });

    it('[TC97765_06] Verify contextual link editor for cross projects ', async () => {
        
        // go into authoring mode
        await libraryPage.openDossier(DossierCrossProject.name);
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();

        // open contextual link editor
        await contentsPanel.goToPage({ chapterName: 'Chapter', pageName: 'PassFilter' });
        
        // check UI and answer prompt options
        await baseVisualization.editContextualLink('Visualization 1');
        since('Prompt section for cross project linking editor display should be #{expected}, instead we have #{actual} ')
            .expect(await contextualLinkEditor.isPromptSectionVisible()).toBe(false);
        takeScreenshotByElement(await contextualLinkEditor.getContextuallinkEditor(), 'TC97765_06', 'contextual link editor_cross project');
        await contextualLinkEditor.cancelEditor();

    });

});
export const config = specConfiguration;
