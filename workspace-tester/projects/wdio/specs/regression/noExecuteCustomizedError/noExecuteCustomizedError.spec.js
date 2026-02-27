import { noExecuteCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

//The no execute attribute is "Year", the no execute metric is "cost"
describe('no execute attribute customized error', () => {
    const dossier = {
        id: 'DE4CB507444F557DE53D9CBDE493CD6A',
        name: 'NoExecuteCustomizedError',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const targetDossier = {
        id: '92585B1DA04BBEB4B40F229C93887241',
        name: 'NoExecuteCustomizedError_target',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let {
        libraryPage,
        loginPage,
        reset,
        dossierPage,
        toc,
        grid,
        thresholdEditor,
        contentsPanel,
        libraryConditionalDisplay,
        filterPanel,
        authoringFilters,
        dossierAuthoringPage,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(noExecuteCredentials);
        await setWindowSize(browserWindow);
    });

    it('[TC99201_1] Dossier | No execute customized error consumption mode', async () => {
        await libraryPage.openDossier(dossier.name);
        await reset.resetIfEnabled();
        await takeScreenshotByElement(await dossierPage.getDossierView(), 'TC99201_1', 'Text customized error');
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Selector' });
        await browser.pause(3000); // wait page tooltip disappear
        await takeScreenshotByElement(await dossierPage.getDossierView(), 'TC99201_1', 'Selector customized error');
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Template selector' });
        await browser.pause(3000); // wait page tooltip disappear
        await takeScreenshotByElement(
            await dossierPage.getDossierView(),
            'TC99201_1',
            'Template selector customized error'
        );
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Expression tooltip' });
        await grid.openViewFilterContainer('Visualization 1');
        await grid.hoverViewFilter('Clear "Keep Only / Exclude" conditions');
        await libraryPage.sleep(5000);
        await takeScreenshotByElement(await dossierPage.getDossierView(), 'TC99201_1', 'View filter customized error');
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 2', pageName: 'Filter panel unset' });
        await filterPanel.hoverFilterPanelIcon();
        await takeScreenshotByElement(await dossierPage.getDossierView(), 'TC99201_1', 'Filter panel unset');
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 5', pageName: 'Viz as filter not unset' });
        await takeScreenshotByElement(await dossierPage.getDossierView(), 'TC99201_1', 'Viz as filter not unset');
        await dossierPage.click({ elem: dossierPage.getEditIcon() });
        await authoringFilters.switchToFilterPanel();
        await authoringFilters.hoverFilterPanelWarning();
        await takeScreenshotByElement(await dossierPage.getDossierView(), 'TC99201_1', 'Viz as filter not unset edit');
        await dossierAuthoringPage.closeDossierWithoutSaving();
        await dossierPage.goToLibrary();
        await libraryPage.openDossier(targetDossier.name);
        await grid.openViewFilterContainer('Visualization 1');
        await grid.hoverViewFilter('Clear filter condition');
        await libraryPage.sleep(5000);
        await takeScreenshotByElement(await dossierPage.getDossierView(), 'TC99201_1', 'Dossier linking');
    });

    it('[TC99201_2] Dossier | No execute customized error edit mode', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Threshold editor' });
        await thresholdEditor.openThresholdEditorFromViz('Category', 'Visualization 1');
        await libraryPage.sleep(5000);
        await takeScreenshotByElement(await dossierPage.getDossierView(), 'TC99201_2', 'Threshold editor');
        await thresholdEditor.closeThresholdEditor();
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Conditional editor' });
        await libraryConditionalDisplay.chooseElement('Conditional show hide');
        await libraryConditionalDisplay.OpenElementMenu('Conditional show hide');
        await takeScreenshotByElement(
            await dossierPage.getDossierView(),
            'TC99201_2',
            'Conditional display customized error1'
        );
        await libraryConditionalDisplay.openConditionalDisplayDialog();
        await takeScreenshotByElement(
            await dossierPage.getDossierView(),
            'TC99201_2',
            'Conditional display customized error2'
        );
    });
});
