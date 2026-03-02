import setWindowSize from '../../../config/setWindowSize.js';
import { browserWindow } from '../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import * as template from '../../../constants/template.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { mockSearchServiceNotReady } from '../../../api/mock/mock-response-utils.js';

describe('Test Template by i18n', () => {
    let { loginPage, libraryPage, dossierCreator, dossierAuthoringPage, visualizationPanel } = browsers.pageObj1;

    const templateUser = template.templateCN;
    const tutorialProject = template.TutorialProject;
    const userTemplate = template.dashboard_UserTemplate.name;
    const airlineDataSet = 'Airline Data';

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

    it('[TC99022_01] dashboard creator in Chinese', async () => {
        await dossierCreator.createNewDossier();
        await dossierCreator.switchProjectByName(tutorialProject);
        await dossierCreator.searchData(airlineDataSet);
        await dossierCreator.clickDatasetCheckbox([airlineDataSet]);
        await since('In Chinese, the title should be #{expected}, instead we have #{actual}.')
            .expect(await dossierCreator.getCreateNewDossierTitleBar().getText())
            .toBe('新建仪表盘');
        await since('In Chinese, the tab names should be #{expected}, instead we have #{actual}.')
            .expect(JSON.stringify(await dossierCreator.getCreateDossierTabNames()))
            .toBe(JSON.stringify(['添加数据', '选择模板']));
        await since('In Chinese, project picker should be #{expected}, instead we have #{actual}.')
            .expect(await dossierCreator.getProjectPicker().getText())
            .toContain('在此创建仪表盘');
        await since('In Chinese, the template list headers should be #{expected}, instead we have #{actual}.')
            .expect(JSON.stringify(await dossierCreator.getTemplateListHeaders()))
            .toBe(JSON.stringify(['名称', '已认证', '所有者', '修改日期', '创建日期']));
        await since('In Chinese, the certified control should be #{expected}, instead we have #{actual}.')
            .expect(await dossierCreator.getCertifiedControl().getText())
            .toBe('仅限已认证');
        await dossierCreator.switchTabViewer('选择模板');
        await dossierCreator.selectTemplate(userTemplate);
        await dossierCreator.checkTemplateInfo(userTemplate);
        await since('In Chinese, the template info updateTime should contain #{expected}, instead we have #{actual}.')
            .expect((await dossierCreator.getTemplateInfoData()).updateTime)
            .toContain('更新时间');
        await since('In Chinese, the template info create time should contain #{expected}, instead we have #{actual}.')
            .expect((await dossierCreator.getTemplateInfoData()).createDate)
            .toContain('创建时间');
        await since('In Chinese, the template info dataset should contain #{expected}, instead we have #{actual}.')
            .expect(JSON.stringify((await dossierCreator.getTemplateInfoData()).sectionInfo))
            .toContain('章节');
        await dossierCreator.closeNewDossierPanel();
    });

    it('[TC99022_02] Create dashboard by template in Chinese', async () => {
        await dossierCreator.createNewDossier();
        await dossierCreator.switchProjectByName(tutorialProject);
        await dossierCreator.clickCreateButton();
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await dossierAuthoringPage.dismissAutoDashboardWelcomePopup();
        await dossierAuthoringPage.togglePanelBar.togglePanel('dataset');
        await dossierAuthoringPage.sleep(2000); // wait for image loading
        await takeScreenshotByElement(dossierAuthoringPage.getTocPanel(), 'TC99022_02_01', 'toc in Chinese');
        // await takeScreenshotByElement(visualizationPanel.getVIDoclayout(), 'TC99022_02_02', 'viz in Chinese');
    });

    it('[TC99022_03] Set template menu in Chinese', async () => {
        await libraryPage.editDossierByUrl({
            projectId: template.dashboard_Template_CheckTooltip.project.id,
            dossierId: template.dashboard_Template_CheckTooltip.id,
        });
        await dossierAuthoringPage.dashboardMenuBar.openFileMenu();
        await since('In Chinese, the set template submenu should be #{expected}, instead we have #{actual}.')
            .expect(
                JSON.stringify(
                    await dossierAuthoringPage.dashboardMenuBar.getMenuBarSubItemByName('setAsTemplate').getText()
                )
            )
            .toContain('取消设为模板');
        await libraryPage.editDossierByUrl({
            projectId: template.USEconomyAnalysis.project.id,
            dossierId: template.USEconomyAnalysis.id,
        });
        await dossierAuthoringPage.dashboardMenuBar.openFileMenu();
        await since('In Chinese, the set template submenu should be #{expected}, instead we have #{actual}.')
            .expect(
                JSON.stringify(
                    await dossierAuthoringPage.dashboardMenuBar.getMenuBarSubItemByName('setAsTemplate').getText()
                )
            )
            .toContain('设为模板');
    });

    // DE253090: create dossier when quick search not ready
    it('[TC99022_04] search service is not ready', async () => {
        await mockSearchServiceNotReady();
        await dossierCreator.createNewDossier();
        await dossierCreator.waitForElementVisible(dossierCreator.getErrorContainer());
        await since('In Chinese, the error message should be #{expected}, instead we have #{actual}.')
            .expect(await dossierCreator.getDossierCreatorErrorMessage())
            .toBe('服务器正在准备时，无法添加数据和选择模板。您可以点击"创建"或"空白仪表盘"以继续。');
    });
});
