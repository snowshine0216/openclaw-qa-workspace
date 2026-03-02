import { customCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';

const specConfiguration = { ...customCredentials('_linking') };

describe('Dossier Linking - Pass Prompt', () => {
    const tutorialProject = {
        id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
        name: 'MicroStrategy Tutorial',
    };

    const passPromptAnswerTypeDossier = {
        id: '9124B26F4711F1962764188D4A5755B5',
        name: '(AUTO) DossierLinking_Pass Prompt_Answer Type',
        project: tutorialProject,
    };
    const passPromptPromptTypeDossier = {
        id: '0960416C460F28FF7FFC33BEA451973C',
        name: '(AUTO) DossierLinking_Pass Prompt_Prompt Type',
        project: tutorialProject,
    };
    const passPromptMultiPromptDossier = {
        id: 'D9B0798F4CA924091493F08C2DF3772F',
        name: '(AUTO) DossierLinking_Pass Prompt_Multi-Source',
        project: tutorialProject,
    };
    const passPromptAnswerOnText = {
        id: 'D53E1BE74A18B7E7A97CE2BCA36653F3',
        name: '(AUTO) DossierLinking_Pass Prompt_Answer Type_Text/Image',
        project: tutorialProject,
    };
    const passPromptTypeOnText = {
        id: 'B14688214036BDA1C03C0B89C9A2FE08',
        name: '(AUTO) DossierLinking_Pass Prompt_Prompt Type_Text/Image',
        project: tutorialProject,
    };
    const passPromptMultiPromptOnText = {
        id: 'FB75A2504D976A8E93F972B811543E31',
        name: '(AUTO) DossierLinking_Pass Prompt_Multi-Source_Text/Image',
        project: tutorialProject,
    };
    const passPromptToItself = {
        id: '9E830B164CE19B242C1B09892C0A8A5B',
        name: '(AUTO) DossierLinking_Pass Prompt_Target Itself',
        project: tutorialProject,
    };

    const { credentials } = specConfiguration;

    let { dossierPage, toc, libraryPage, grid, promptEditor, textbox, imageContainer, loginPage } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC58902_01] Verify different prompt answer types can be passed correctly to target dossier - Grid/Viz (Prompt user,default answer,use selected prompt)', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: passPromptAnswerTypeDossier,
        });
        await libraryPage.openDossier(passPromptAnswerTypeDossier.name);

        //prompt user
        await toc.openPageFromTocMenu({ chapterName: 'prompt answers', pageName: 'prompt user' });
        await grid.linkToTargetByGridContextMenu({ title: 'linking', headerName: 'Category' }, true);
        await promptEditor.waitForEditor();
        await since('Prompt user should show prompt window when link to target')
            .expect(await promptEditor.isEditorOpen())
            .toBe(true);
        await promptEditor.toggleViewSummary();
        await since('In prompt user, the prompt answer for [Category] should be default values: #{expected}')
            .expect(await promptEditor.checkListSummary('Category'))
            .toEqual('Books');
        await promptEditor.run();
        await dossierPage.goBackFromDossierLink();

        // use the selected object as prompt answer
        await toc.openPageFromTocMenu({
            chapterName: 'prompt answers',
            pageName: 'use the selected object as prompt answer',
        });
        await grid.linkToTargetByGridContextMenu({ title: 'linking', headerName: 'Category', elementName: 'Movies' });
        await since('Use the selected object as prompt answer should not show prompt window when link to target')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await since(
            'In Use the selected object as prompt answer, the prompt answer for [Category] should be default values: #{expected}'
        )
            .expect(await promptEditor.checkListSummary('Category'))
            .toEqual('Movies');
        await promptEditor.cancelEditor();
        await dossierPage.goBackFromDossierLink();

        //user the defaut answer
        await toc.openPageFromTocMenu({ chapterName: 'prompt answers', pageName: 'user the defaut answer' });
        await grid.linkToTargetByGridContextMenu({ title: 'linking', headerName: 'Category' });
        await since('User the defaut answer should not show prompt window when link to target')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await since('In user the defaut answer, the prompt answer for [Category] should be default values: #{expected}')
            .expect(await promptEditor.checkListSummary('Category'))
            .toEqual('Books');
        await promptEditor.cancelEditor();
        await dossierPage.goBackFromDossierLink();
    });

    it('[TC58902_02] Verify different prompt answer types can be passed correctly to target dossier - Grid/Viz(use same, ignore prompt)', async () => {
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

        //ignore the prompt
        await toc.openPageFromTocMenu({ chapterName: 'prompt answers', pageName: 'ignore the prompt' });
        await grid.linkToTargetByGridContextMenu({ title: 'linking', headerName: 'Category' });
        await since('Ignore the prompt should not show prompt window when link to target')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Category');
        await since('In ignore the prompt, the prompt answer for [Category] should be default values: #{expected}')
            .expect(await promptEditor.checkEmptySummary('Category'))
            .toEqual('No Selection');
        await promptEditor.cancelEditor();
        await dossierPage.goBackFromDossierLink();
    });

    it('[TC58904_01] Verify pass prompt answer are supported on different prompt type - Grid/Viz(MQ,AQ,AE prompt)', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: passPromptPromptTypeDossier,
        });
        await libraryPage.openDossier(passPromptPromptTypeDossier.name);

        //attribute element prompt
        await toc.openPageFromTocMenu({
            chapterName: 'different type of prompt',
            pageName: 'attribute element prompt',
        });
        await grid.linkToTargetByGridContextMenu({ title: 'Use same answer', headerName: 'Category' });
        await since('attribute element prompt should not show prompt window when link to target')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Category');
        await since(
            'For attribute element prompt, the prompt answer for [Category] should be default values: #{expected}'
        )
            .expect(await promptEditor.checkListSummary('Category'))
            .toEqual('Books, Electronics');
        await promptEditor.cancelEditor();
        await dossierPage.goBackFromDossierLink();

        //attribute qualification prompt
        await toc.openPageFromTocMenu({
            chapterName: 'different type of prompt',
            pageName: 'attribute qulification prompt',
        });
        await grid.linkToTargetByGridContextMenu({ title: 'use same answer', headerName: 'Quarter' });
        await since('attribute qualification prompt should not show prompt window when link to target')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Quarter');
        await since(
            'For qualification element prompt, the prompt answer for [Quarter] should: #{expected}, instead we have #{actual}'
        )
            .expect(await promptEditor.checkQualSummary('Quarter'))
            .toEqual('QuarterDESC Greater than2015 Q3');
        await promptEditor.cancelEditor();
        await dossierPage.goBackFromDossierLink();

        // metric qualification prompt
        await toc.openPageFromTocMenu({
            chapterName: 'different type of prompt',
            pageName: 'metric qualification prompt',
        });
        await grid.linkToTargetByGridContextMenu({ title: 'use the same answer', headerName: 'Subcategory' });
        await since('metric qualification prompt should not show prompt window when link to target')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Cost');
        await since(
            'For metric qualification prompt, the prompt answer for [Cost] should be default values: #{expected}, instead we have #{actual}'
        )
            .expect(await promptEditor.checkQualSummary('Cost'))
            .toEqual('CostGreater than or equal to2000at levelDefault');
        await promptEditor.cancelEditor();
        await dossierPage.goBackFromDossierLink();
    });

    it('[TC58904_02] Verify pass prompt answer are supported on different prompt type - Grid/Viz (HQ,Value,Object prompt)', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: passPromptPromptTypeDossier,
        });
        await libraryPage.openDossier(passPromptPromptTypeDossier.name);

        // hierarchy qualification prompt
        await toc.openPageFromTocMenu({
            chapterName: 'different type of prompt',
            pageName: 'hierarchy qualification prompt',
        });
        await grid.linkToTargetByGridContextMenu({ title: 'use the same answer', headerName: 'Year' });
        await since('hierarchy qualification prompt should not show prompt window when link to target')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Time');
        await since(
            'For hierarchy qualification prompt, the prompt answer for [Time] should be default values: #{expected}, instead we have #{actual}'
        )
            .expect(await promptEditor.checkQualSummary('Time'))
            .toEqual('YearID Greater than2015');
        await promptEditor.cancelEditor();
        await dossierPage.goBackFromDossierLink();

        // value prompt
        await toc.openPageFromTocMenu({ chapterName: 'different type of prompt', pageName: 'value prompt' });
        await grid.linkToTargetByGridContextMenu({ title: 'use the same answer', headerName: 'Category' });
        await since('value prompt should not show prompt window when link to target')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Date');
        await since(
            'For value prompt, the prompt answer for [Date] should be default values: #{expected}, instead we have #{actual}'
        )
            .expect(await promptEditor.checkTextSummary('Date'))
            .toEqual('1/1/2016');
        await promptEditor.cancelEditor();
        await dossierPage.goBackFromDossierLink();

        // object prompt
        await toc.openPageFromTocMenu({ chapterName: 'different type of prompt', pageName: 'object prompt' });
        await grid.linkToTargetByGridContextMenu({ title: 'Visualization 1', headerName: 'Category' });
        await since('object prompt should not show prompt window when link to target')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Objects');
        await since(
            'For object prompt, the prompt answer for [Objects] should be default values: #{expected}, instead we have #{actual}'
        )
            .expect(await promptEditor.checkListSummary('Objects'))
            .toEqual('Subcategory');
        await promptEditor.cancelEditor();
        await dossierPage.goBackFromDossierLink();
    });

    it('[TC58906] Verify multiple prompt can be passed together to target - Grid/Viz', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: passPromptMultiPromptDossier,
        });
        await libraryPage.openDossier(passPromptMultiPromptDossier.name);
        await promptEditor.run();

        //answer type are the same
        await toc.openPageFromTocMenu({ chapterName: 'multiple prompt source', pageName: 'answer type are the same' });
        await grid.linkToTargetByGridContextMenu({ title: 'use the same answer', headerName: 'Year' });
        await since('Answer type are the same should not show prompt window when link to target')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await since(
            'For answer type are the same, the prompt answer for [Objects] should be default values: #{expected}, instead we have #{actual}'
        )
            .expect(await promptEditor.checkListSummary('Objects'))
            .toEqual('Category');
        await since(
            'For answer type are the same, the prompt answer for [Date] should be #{expected}, instead we have #{actual}'
        )
            .expect(await promptEditor.checkTextSummary('Date'))
            .toEqual('1/1/2016');
        await since(
            'For answer type are the same, the prompt answer for [Time] should be default values: #{expected}, instead we have #{actual}'
        )
            .expect(await promptEditor.checkQualSummary('Time'))
            .toEqual('YearID Greater than2015');
        await since(
            'For answer type are the same, the prompt answer for [Quarter] should be default values: #{expected}, instead we have #{actual}'
        )
            .expect(await promptEditor.checkQualSummary('Quarter'))
            .toEqual('QuarterDESC Greater than2015 Q3');
        await since(
            'For answer type are the same, the prompt answer for [Cost] should be default values: #{expected}, instead we have #{actual}'
        )
            .expect(await promptEditor.checkQualSummary('Cost'))
            .toEqual('CostGreater than or equal to2000at levelDefault');
        await since(
            'For answer type are the same, the prompt answer for [Category] should be default values: #{expected}, instead we have #{actual}'
        )
            .expect(await promptEditor.checkListSummary('Category'))
            .toEqual('Books, Electronics');
        await promptEditor.cancelEditor();
        await dossierPage.goBackFromDossierLink();

        //answer type are different
        await toc.openPageFromTocMenu({ chapterName: 'multiple prompt source', pageName: 'answer type are different' });
        await grid.linkToTargetByGridContextMenu({ title: 'Visualization 1', headerName: 'Category' }, true);
        await promptEditor.waitForEditor();
        await since('Answer type are different should not show prompt window when link to target')
            .expect(await promptEditor.isEditorOpen())
            .toBe(true);
        await promptEditor.toggleViewSummary();
        await since(
            'For answer type are different, the prompt answer for [Quarter] should be default values: #{expected}, instead we have #{actual}'
        )
            .expect(await promptEditor.checkQualSummary('Quarter'))
            .toEqual('QuarterDESC Greater than2009 Q2');
        await promptEditor.run();
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await since(
            'For answer type are different, the prompt answer for [Objects] should be default values: #{expected}, instead we have #{actual}'
        )
            .expect(await promptEditor.checkListSummary('Objects'))
            .toEqual('Category');
        await since(
            'For answer type are different, the prompt answer for [Date] should be #{expected}, instead we have #{actual}'
        )
            .expect(await promptEditor.checkTextSummary('Date'))
            .toEqual('1/1/2016');
        await since(
            'For answer type are different, the prompt answer for [Time] should be default values: #{expected}, instead we have #{actual}'
        )
            .expect(await promptEditor.checkQualSummary('Time'))
            .toEqual('YearID Greater than2014');
        await since(
            'For answer type are different, the prompt answer for [Quarter] should be default values: #{expected}, instead we have #{actual}'
        )
            .expect(await promptEditor.checkQualSummary('Quarter'))
            .toEqual('QuarterDESC Greater than2009 Q2');
        await since(
            'For answer type are different, the prompt answer for [Cost] should be default values: #{expected}, instead we have #{actual}'
        )
            .expect(await promptEditor.checkEmptySummary('Cost'))
            .toEqual('No Selection');
        await since(
            'For answer type are different, the prompt answer for [Category] should be default values: #{expected}, instead we have #{actual}'
        )
            .expect(await promptEditor.checkEmptySummary('Category'))
            .toEqual('No Selection');
        await promptEditor.cancelEditor();
        await dossierPage.goBackFromDossierLink();
    });

    it('[TC66265_01] Verify pass prompt answer are supported on different prompt type - Text/Image(AE,AQ,MQ prompt)', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: passPromptTypeOnText,
        });
        await libraryPage.openDossier(passPromptTypeOnText.name);

        //attribute element prompt
        await toc.openPageFromTocMenu({
            chapterName: 'different type of prompt',
            pageName: 'attribute element prompt',
        });
        await textbox.navigateLink(0);
        await since('attribute element prompt should not show prompt window when link to target')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Category');
        await since(
            'For attribute element prompt, the prompt answer for [Category] should be default values: #{expected}'
        )
            .expect(await promptEditor.checkListSummary('Category'))
            .toEqual('Books, Electronics');
        await promptEditor.cancelEditor();
        await dossierPage.goBackFromDossierLink();

        //attribute qualification prompt
        await toc.openPageFromTocMenu({
            chapterName: 'different type of prompt',
            pageName: 'attribute qulification prompt',
        });
        await textbox.navigateLink(0);
        await since('attribute qualification prompt should not show prompt window when link to target')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Quarter');
        await since(
            'For qualification element prompt, the prompt answer for [Quarter] should: #{expected}, instead we have #{actual}'
        )
            .expect(await promptEditor.checkQualSummary('Quarter'))
            .toEqual('QuarterDESC Greater than2015 Q3');
        await promptEditor.cancelEditor();
        await dossierPage.goBackFromDossierLink();

        // metric qualification prompt
        await toc.openPageFromTocMenu({
            chapterName: 'different type of prompt',
            pageName: 'metric qualification prompt',
        });
        await imageContainer.navigateLinkInCurrentPage(0);
        await since('metric qualification prompt should not show prompt window when link to target')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Cost');
        await since(
            'For metric qualification prompt, the prompt answer for [Cost] should be default values: #{expected}, instead we have #{actual}'
        )
            .expect(await promptEditor.checkQualSummary('Cost'))
            .toEqual('CostGreater than or equal to2000at levelDefault');
        await promptEditor.cancelEditor();
        await dossierPage.goBackFromDossierLink();
    });

    it('[TC66265_02] Verify pass prompt answer are supported on different prompt type - Text/Image (HQ, Value, Object prompt)', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: passPromptTypeOnText,
        });
        await libraryPage.openDossier(passPromptTypeOnText.name);

        // hierarchy qualification prompt
        await toc.openPageFromTocMenu({
            chapterName: 'different type of prompt',
            pageName: 'hierarchy qualification prompt',
        });
        await imageContainer.navigateLinkInCurrentPage(0);
        await since('hierarchy qualification prompt should not show prompt window when link to target')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Time');
        await since(
            'For hierarchy qualification prompt, the prompt answer for [Time] should be default values: #{expected}, instead we have #{actual}'
        )
            .expect(await promptEditor.checkQualSummary('Time'))
            .toEqual('YearID Greater than2015');
        await promptEditor.cancelEditor();
        await dossierPage.goBackFromDossierLink();

        // value prompt
        await toc.openPageFromTocMenu({ chapterName: 'different type of prompt', pageName: 'value prompt' });
        await textbox.navigateLink(0);
        await since('value prompt should not show prompt window when link to target')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Date');
        await since(
            'For value prompt, the prompt answer for [Date] should be default values: #{expected}, instead we have #{actual}'
        )
            .expect(await promptEditor.checkTextSummary('Date'))
            .toEqual('1/1/2016');
        await promptEditor.cancelEditor();
        await dossierPage.goBackFromDossierLink();

        // object prompt
        await toc.openPageFromTocMenu({ chapterName: 'different type of prompt', pageName: 'object prompt' });
        await imageContainer.navigateLinkInCurrentPage(0);
        await since('object prompt should not show prompt window when link to target')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Objects');
        await since(
            'For object prompt, the prompt answer for [Objects] should be default values: #{expected}, instead we have #{actual}'
        )
            .expect(await promptEditor.checkListSummary('Objects'))
            .toEqual('Subcategory');
        await promptEditor.cancelEditor();
        await dossierPage.goBackFromDossierLink();
    });

    it('[TC66266] Verify multiple prompt can be passed together to target - Text/Image', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: passPromptMultiPromptOnText,
        });
        await libraryPage.openDossier(passPromptMultiPromptOnText.name);
        await promptEditor.run();

        //answer type are the same
        await toc.openPageFromTocMenu({ chapterName: 'multiple prompt source', pageName: 'answer type are the same' });
        await textbox.navigateLink(0);
        await since('Answer type are the same should not show prompt window when link to target')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await since(
            'For answer type are the same, the prompt answer for [Objects] should be default values: #{expected}, instead we have #{actual}'
        )
            .expect(await promptEditor.checkListSummary('Objects'))
            .toEqual('Category');
        await since(
            'For answer type are the same, the prompt answer for [Date] should be #{expected}, instead we have #{actual}'
        )
            .expect(await promptEditor.checkTextSummary('Date'))
            .toEqual('1/1/2016');
        await since(
            'For answer type are the same, the prompt answer for [Time] should be default values: #{expected}, instead we have #{actual}'
        )
            .expect(await promptEditor.checkQualSummary('Time'))
            .toEqual('YearID Greater than2015');
        await since(
            'For answer type are the same, the prompt answer for [Quarter] should be default values: #{expected}, instead we have #{actual}'
        )
            .expect(await promptEditor.checkQualSummary('Quarter'))
            .toEqual('QuarterDESC Greater than2015 Q3');
        await since(
            'For answer type are the same, the prompt answer for [Cost] should be default values: #{expected}, instead we have #{actual}'
        )
            .expect(await promptEditor.checkQualSummary('Cost'))
            .toEqual('CostGreater than or equal to2000at levelDefault');
        await since(
            'For answer type are the same, the prompt answer for [Category] should be default values: #{expected}, instead we have #{actual}'
        )
            .expect(await promptEditor.checkListSummary('Category'))
            .toEqual('Books, Electronics');
        await promptEditor.cancelEditor();
        await dossierPage.goBackFromDossierLink();

        //answer type are different
        await toc.openPageFromTocMenu({ chapterName: 'multiple prompt source', pageName: 'answer type are different' });
        await imageContainer.navigateLinkInCurrentPage(0);
        await since('Answer type are different should show prompt window when link to target')
            .expect(await promptEditor.isEditorOpen())
            .toBe(true);
        await promptEditor.toggleViewSummary();
        await since(
            'For answer type are different, the prompt answer for [Quarter] should be default values: #{expected}, instead we have #{actual}'
        )
            .expect(await promptEditor.checkQualSummary('Quarter'))
            .toEqual('QuarterDESC Greater than2009 Q2');
        await promptEditor.run();
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await since(
            'For answer type are different, the prompt answer for [Objects] should be default values: #{expected}, instead we have #{actual}'
        )
            .expect(await promptEditor.checkListSummary('Objects'))
            .toEqual('Category');
        await since(
            'For answer type are different, the prompt answer for [Date] should be #{expected}, instead we have #{actual}'
        )
            .expect(await promptEditor.checkTextSummary('Date'))
            .toEqual('1/1/2016');
        await since(
            'For answer type are different, the prompt answer for [Time] should be default values: #{expected}, instead we have #{actual}'
        )
            .expect(await promptEditor.checkQualSummary('Time'))
            .toEqual('YearID Greater than2014');
        await since(
            'For answer type are different, the prompt answer for [Quarter] should be default values: #{expected}, instead we have #{actual}'
        )
            .expect(await promptEditor.checkQualSummary('Quarter'))
            .toEqual('QuarterDESC Greater than2009 Q2');
        await since(
            'For answer type are different, the prompt answer for [Cost] should be default values: #{expected}, instead we have #{actual}'
        )
            .expect(await promptEditor.checkEmptySummary('Cost'))
            .toEqual('No Selection');
        await since(
            'For answer type are different, the prompt answer for [Category] should be default values: #{expected}, instead we have #{actual}'
        )
            .expect(await promptEditor.checkListSummary('Category'))
            .toEqual('Books');
        await promptEditor.cancelEditor();
        await dossierPage.goBackFromDossierLink();
    });

    it('[TC66267] Verify different prompt answer types can be passed correctly to target dossier - Text/Image', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: passPromptAnswerOnText,
        });
        await libraryPage.openDossier(passPromptAnswerOnText.name);

        //prompt user
        await toc.openPageFromTocMenu({ chapterName: 'prompt answers', pageName: 'prompt user' });
        await textbox.navigateLink(0);
        await promptEditor.waitForEditor();
        await since('Prompt user should show prompt window when link to target')
            .expect(await promptEditor.isEditorOpen())
            .toBe(true);
        await promptEditor.toggleViewSummary();
        await since('In prompt user, the prompt answer for [Category] should be default values: #{expected}')
            .expect(await promptEditor.checkListSummary('Category'))
            .toEqual('Books');
        await promptEditor.run();
        await dossierPage.goBackFromDossierLink();

        //use the defaut answer
        await toc.openPageFromTocMenu({ chapterName: 'prompt answers', pageName: 'user the defaut answer' });
        await textbox.navigateLink(0);
        await since('User the defaut answer should not show prompt window when link to target')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await since('In user the defaut answer, the prompt answer for [Category] should be default values: #{expected}')
            .expect(await promptEditor.checkListSummary('Category'))
            .toEqual('Books');
        await promptEditor.cancelEditor();
        await dossierPage.goBackFromDossierLink();

        //use the same answer from the source prompt
        await toc.openPageFromTocMenu({
            chapterName: 'prompt answers',
            pageName: 'use the same answer from the source prompt',
        });
        await imageContainer.navigateLinkInCurrentPage(0);
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

        //ignore the prompt
        await toc.openPageFromTocMenu({ chapterName: 'prompt answers', pageName: 'ignore the prompt' });
        await imageContainer.navigateLinkInCurrentPage(0);
        await since('Ignore the prompt should not show prompt window when link to target')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Category');
        await since('In ignore the prompt, the prompt answer for [Category] should be default values: #{expected}')
            .expect(await promptEditor.checkEmptySummary('Category'))
            .toEqual('No Selection');
        await promptEditor.cancelEditor();
        await dossierPage.goBackFromDossierLink();
    });

    it('[TC83902] Verify pass prompt answer to itself', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: passPromptToItself,
        });
        await libraryPage.openDossierNoWait(passPromptToItself.name);
        await promptEditor.run();

        // prompt user and run
        await toc.openPageFromTocMenu({ chapterName: 'prompt answers', pageName: 'prompt user' });
        await grid.linkToTargetByGridContextMenu({ title: 'linking', headerName: 'Category' }, true);
        await promptEditor.waitForEditor();
        await since('Prompt user should show prompt window when link to target')
            .expect(await promptEditor.isEditorOpen())
            .toBe(true);
        await promptEditor.toggleViewSummary();
        await since('In prompt user, the prompt answer should be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary('Category'))
            .toEqual('Books, Electronics, Movies');
        await promptEditor.run();
        await dossierPage.goBackFromDossierLink();

        //prompt user and cancel
        await toc.openPageFromTocMenu({ chapterName: 'prompt answers', pageName: 'prompt user' });
        await grid.linkToTargetByGridContextMenu({ title: 'linking', headerName: 'Category' }, true);
        await promptEditor.waitForEditor();
        await since('Prompt user should show prompt window when link to target')
            .expect(await promptEditor.isEditorOpen())
            .toBe(true);
        await promptEditor.cancelEditor();
        await since('prompt user and cancel, back icon should NOT be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(false);
        await since('prompt user and cancel, the page title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual([passPromptToItself.name, 'prompt answers', 'prompt user']);

        // Not prompt user (use the same answer), re-prompt and run
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
        await promptEditor.run();
        await dossierPage.goBackFromDossierLink();

        //use the same answer from the source prompt, reprompt and cancel
        await toc.openPageFromTocMenu({
            chapterName: 'prompt answers',
            pageName: 'use the same answer from the source prompt',
        });
        await grid.linkToTargetByGridContextMenu({ title: 'linking', headerName: 'Category' });
        await since('Use the same answer from the source prompt should not show prompt window when link to target')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await promptEditor.reprompt();
        await promptEditor.cancelEditor();
        await dossierPage.goBackFromDossierLink();
    });
});
export const config = specConfiguration;
