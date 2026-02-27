import setWindowSize from '../../../config/setWindowSize.js';
import { browserWindow } from '../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import * as template from '../../../constants/template.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { TutorialProject, PAProject } from '../../../constants/template.js';

describe('Test Create Dashboard Panel', () => {
    let { loginPage, libraryPage, dossierCreator, dossierAuthoringPage } = browsers.pageObj1;

    const templateUser = template.templateUser;
    const tutorialProject = template.TutorialProject;
    const userTemplate = '06_UserTemplate';
    const noCoverImageTemplate = '08_Template_NoCoverImage';
    // const checkTooltipTemplate = '07_Template_CheckTooltip';

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(templateUser);
    });

    beforeEach(async () => {
        await libraryPage.openDefaultApp();
    });

    afterAll(async () => {
        await libraryPage.openDefaultApp();
        await logoutFromCurrentBrowser();
    });

    it('[TC82897_01] Add Data Tab in Dossier Creator', async () => {
        // Add Data Tab
        await dossierCreator.createNewDossier();
        await dossierCreator.switchProjectByName(tutorialProject);
        await dossierCreator.searchData('HTMLData');
        // the first element in grid should be HTMLData
        await since(
            'After search HTMLData, The first element in grid should be contain #{expected}, instead we have #{actual}.'
        )
            .expect(await dossierCreator.getRowDataInAddDataTab(0))
            .toContain('HTMLData');
        await dossierCreator.searchData('SearchForNoData');
        await since('After search for No Data, the no data overlay should be displayed, instead we have #{actual}.')
            .expect(await dossierCreator.isNoDataDisplayed())
            .toBe(true);
        await dossierCreator.searchData('StoreSalesData');
        await dossierCreator.clickDatasetCheckbox(['StoreSalesData']);
        await since('After click StoreSalesData checkbox, the checkbox should be checked, instead we have #{actual}.')
            .expect(await dossierCreator.isDataSelected(0))
            .toBe(true);
        await takeScreenshotByElement(
            dossierCreator.getCreateNewDossierPanelFooter(),
            'TC82897_01_06',
            'Click StoreSalesData checkbox'
        );
        await dossierCreator.switchToReportTab();
        await dossierCreator.sortDataByHeaderName('Date Created');
        await since('After sort by Date Created, the data should be sorted by Date Created, instead we have #{actual}.')
            .expect(await dossierCreator.isDataSetsOrderedByDateCreatedAscending())
            .toBe(true);
        await dossierCreator.switchToDatasetTab();
        await since(
            'After switch to Dataset tab, the data should be sorted by Date Created, instead we have #{actual}.'
        )
            .expect(await dossierCreator.isDataSetsOrderedByDateCreatedAscending())
            .toBe(true);
        await dossierCreator.switchProjectByName(PAProject);
        await since('After switch to PA project, the popup should be displayed, instead we have #{actual}.')
            .expect(await dossierCreator.getConfirmSwitchProjectPopup().isDisplayed())
            .toBe(true);
        await since('The popup message should be #{expected}, instead we have #{actual}.')
            .expect(await dossierCreator.getConfirmSwitchProjectPopup().getText())
            .toContain(template.templateMessage.English.switchProject);
        await dossierCreator.cancelSwitchProject();
        await since(`1. Current project should be #{expected}, instead we have #{actual}`)
            .expect(await dossierCreator.getCurrentProject().getText())
            .toBe(TutorialProject);
        await dossierCreator.switchProjectByName(PAProject);
        await dossierCreator.confirmSwitchProject();
        await since(`2. Current project should be #{expected}, instead we have #{actual}`)
            .expect(await dossierCreator.getCurrentProject().getText())
            .toBe(PAProject);
        await dossierCreator.fakeDateModifiedColumns();
        await since('After switch project, the data should be displayed, instead we have #{actual}.')
            .expect(await dossierCreator.getRowDataInAddDataTab(0))
            .not.toBeNull();
        await dossierCreator.switchProjectByName(tutorialProject);
        await dossierCreator.waitForElementInvisible(dossierCreator.getSwitchProjectLoadingBtn());
        await dossierCreator.toggleCertifiedOnlyForData();
        await since(
            'After toggled certified only for dataset, the data should be filtered by certified only, instead we have #{actual}.'
        )
            .expect(await dossierCreator.getRowDataInAddDataTab(0))
            .toContain('Certified');
        await dossierCreator.switchToReportTab();
        await dossierCreator.switchToTreeMode();
        await since('After switch to tree mode, the first row should be #{expected}, instead we have #{actual}.')
            .expect(await dossierCreator.getRowDataInAddDataTab(0))
            .toContain('00_Old folders');
        await dossierCreator.expandTreeView('Public Objects', 'Reports');
        await dossierCreator.doubleClickOnTreeView('Reports');
        await since('After expand Public Objects, the first row should be #{expected}, instead we have #{actual}.')
            .expect(await dossierCreator.getRowDataInAddDataTab(0))
            .toContain('_cen');
        await dossierCreator.searchData('Datasets');
        await dossierCreator.sleep(1000);
        await dossierCreator.doubleClickOnAgGrid('Datasets');
        await since('After double click on Datasets, the first row should be #{expected}, instead we have #{actual}.')
            .expect(await dossierCreator.getRowDataInAddDataTab(0))
            .toContain('A.Call_Center_S');
        await dossierCreator.cancelCreateButton();
    });

    it('[TC82897_02] Select Template Tab in Dossier Creator', async () => {
        //Select Template Tab
        await dossierCreator.createNewDossier();
        await dossierCreator.switchProjectByName(tutorialProject);
        await dossierCreator.clickNameCheckbox();
        await dossierCreator.sortDataByHeaderName('Date Created');
        const selectedDatasetCnt = await dossierCreator.getSelectedDatasetsCount();
        await since(
            'After select all datasets, the selected dataset count should be greater than #{expected}, instead we have #{actual}.'
        )
            .expect(selectedDatasetCnt)
            .toBeGreaterThan(100);
        await since('After sort, the datasets should be sorted by Date Created, instead we have #{actual}.')
            .expect(await dossierCreator.isDataSetsOrderedByDateCreatedAscending())
            .toBe(true);
        await dossierCreator.switchTabViewer('Select Template');
        await since('The selected template should be #{expected}, instead we have #{actual}.')
            .expect(await dossierCreator.getSelectedTemplateNameInGridView())
            .toBe('05_DefaultTemplate');
        await dossierCreator.switchTabViewer('Add Data');
        await since('After switch to add data tab, all datasets should still be checked, instead we have #{actual}.')
            .expect(await dossierCreator.isAllDatasetChecked())
            .toBe(true);
        await dossierCreator.switchTabViewer('Select Template');
        await since(
            'After switch to select template tab, the selected template should be #{expected}, instead we have #{actual}.'
        )
            .expect(await dossierCreator.getSelectedTemplateNameInGridView())
            .toBe('05_DefaultTemplate');
        await dossierCreator.createBlankTemplate();
        await since(
            'After select blank template, the selected template should be #{expected}, instead we have #{actual}.'
        )
            .expect(await dossierCreator.getSelectedTemplateNameInGridView())
            .toBe('Blank');
        await dossierCreator.switchProjectByName(tutorialProject);
        await since('After switch project, the selected template should be #{expected}, instead we have #{actual}.')
            .expect(await dossierCreator.getSelectedTemplateNameInGridView())
            .toBe('Blank');
        await dossierCreator.searchTemplate('template');
        const templateNames = await dossierCreator.getTemplateNamesInGridView();
        // iterate through the template names and check if the template name contains 'template'
        for (const templateName of templateNames) {
            await since('The template name should contain #{expected}, instead we have #{actual}.')
                .expect(templateName.toLowerCase())
                .toContain('template');
        }
        await dossierCreator.selectTemplate(userTemplate);
        await since('After select template, the selected template should be #{expected}, instead we have #{actual}.')
            .expect(await dossierCreator.getSelectedTemplateNameInGridView())
            .toBe(userTemplate);
        await dossierCreator.checkTemplateInfo(userTemplate);
        await dossierCreator.fakeUpdateTimestamp();
        await takeScreenshotByElement(
            dossierCreator.getCreateNewDossierSelectTemplateInfoPanel(),
            'TC82897_02_11',
            `Check Template  ${userTemplate} info`
        );
        await dossierCreator.selectTemplate(noCoverImageTemplate);
        await since('After select template, the selected template should be #{expected}, instead we have #{actual}.')
            .expect(await dossierCreator.getSelectedTemplateNameInGridView())
            .toBe(noCoverImageTemplate);
        await dossierCreator.checkTemplateInfo(noCoverImageTemplate);
        await dossierCreator.fakeUpdateTimestamp();
        await takeScreenshotByElement(
            dossierCreator.getCreateNewDossierSelectTemplateInfoPanel(),
            'TC82897_02_14',
            `Check Template ${noCoverImageTemplate} info`
        );
        await dossierCreator.closeTemplateInfo();

        await since(
            'After close template info panel,  template info panel should be closed, instead we have #{actual}.'
        )
            .expect(await dossierCreator.getCreateNewDossierSelectTemplateInfoPanel().isDisplayed())
            .toBe(false);
        await dossierCreator.switchToListView();
        await dossierCreator.ShowOrHideColumns(['Date Modified', 'Date Created']);
        await dossierCreator.ShowOrHideColumnsSetting();
        await since(
            'After switch to list view and hide columns, the list header should be #{expected}, instead we have #{actual}.'
        )
            .expect(JSON.stringify(await dossierCreator.getTemplateListHeaders()))
            .toBe(JSON.stringify(['Name', 'Certified', 'Description', 'Owner']));
        await since(
            'After switch to list view and hide columns, the frist row should be #{expected}, instead we have #{actual}.'
        )
            .expect(JSON.stringify(await dossierCreator.getRowDataInTemplateListView(0)))
            .toBe(JSON.stringify(['05_DefaultTemplate', 'mstr1']));
        await dossierCreator.switchToGridView();
        const templateNames2 = await dossierCreator.getTemplateNamesInGridView();
        await since('After switch to grid view, the first template should be #{expected}, instead we have #{actual}.')
            .expect(templateNames2[0].toLowerCase())
            .toContain('template');
        await dossierCreator.clearSearchData();
        const templateNames3 = await dossierCreator.getTemplateNamesInGridView();
        await since('After clear search, the template names should contain #{expected}, instead we have #{actual}.')
            .expect(templateNames3[0].toLowerCase())
            .toContain('blank');
        await dossierCreator.toggleCertifiedOnlyForTemplate();
        await since(
            'After toggle certified only for template, it should only show certified template, instead we have #{actual}.'
        )
            .expect(await dossierCreator.isAllTemplateCertified())
            .toBe(true);
        await dossierCreator.toggleCertifiedOnlyForTemplate();
        await since(
            'After disable certified only for template, it should show all templates, instead we have #{actual}.'
        )
            .expect(await dossierCreator.isAllTemplateCertified())
            .toBe(false);
        await dossierCreator.switchToListView();
        await since('After switch to list view, the headers should be #{expected}, instead we have #{actual}.')
            .expect(JSON.stringify(await dossierCreator.getTemplateListHeaders()))
            .toBe(JSON.stringify(['Name', 'Certified', 'Description', 'Date Modified', 'Date Created', 'Owner']));
        // await dossierCreator.sortTemplateByHeaderName('Certified');
        // await dossierCreator.autoResize();
        // await since('After sort by certified, the first row should contain #{expected}, instead we have #{actual}.')
        //     .expect(await dossierCreator.getRowTextInTemplateList(0))
        //     .toContain('Certified');
        await dossierCreator.cancelCreateButton();
    });

    it('[TC82897_03] DE253419 in Dossier Creator', async () => {
        //DE253419
        await dossierCreator.createNewDossier();
        await dossierCreator.switchProjectByName(tutorialProject);
        await dossierCreator.switchTabViewer('Select Template');
        await dossierCreator.searchTemplate(noCoverImageTemplate.toLowerCase());
        // check the template count in grid view
        const templateCnt = await dossierCreator.getTemplateItemsCntInGridView();
        await since('After search template, the template count should be #{expected}, instead we have #{actual}.')
            .expect(templateCnt)
            .toBe(1);
        // check first template name in grid view
        const templateName = await dossierCreator.getTemplateItemNameInGridView(0);
        await since('After search template, the first template name should be #{expected}, instead we have #{actual}.')
            .expect(templateName)
            .toBe(noCoverImageTemplate);
        await dossierCreator.switchToListView();
        await since(
            'After switch to list view, the first template name should be #{expected}, instead we have #{actual}.'
        )
            .expect(await dossierCreator.getRowDataInTemplateListView(0))
            .toContain(noCoverImageTemplate);
    });

    it('[TC82897_04] Library Add Dossier Report Bar in Dossier Creator', async () => {
        await dossierCreator.click({ elem: dossierCreator.getAddButton() });
        await since('After click add button, the add button color should be #{expected}, instead we have #{actual}.')
            .expect(await dossierCreator.getAddButtonColor())
            .toBe('rgba(14,111,249,1)');
        await libraryPage.switchUser(template.noCreateDossier);
        await since('After switch to no create dossier user, the add button should disapear instead we have #{actual}.')
            .expect(await dossierCreator.getAddButton().isDisplayed())
            .toBe(false);
        await libraryPage.switchUser(templateUser);
        await libraryPage.editDossierByUrl({
            projectId: template.dashboard_DefaultTemplate.project.id,
            dossierId: template.dashboard_DefaultTemplate.id,
        });
        await dossierCreator.clickOnToolMenu('File');
        await dossierCreator.clickOnToolSubMenu('Unset as Template');
        await since('The warning message should be #{expected}, instead we have #{actual}.')
            .expect(await dossierCreator.getWarningMessageText())
            .toBe(template.templateMessage.English.unsetProjectDefaultTemplate);
        await dossierCreator.cancelDefaultTemplate();
        await since(
            'After cancel unset default template, the template icon should be displayed in title bar, instead we have #{actual}.'
        )
            .expect(await dossierAuthoringPage.getDossierTemplateIconInTitle().isDisplayed())
            .toBe(true);
    });
});
