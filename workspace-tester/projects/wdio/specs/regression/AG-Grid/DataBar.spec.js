import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { customCredentials } from '../../../constants/index.js';
import * as consts from '../../../constants/visualizations.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { infoLog } from '../../../config/consoleFormat.js';

const specConfiguration = { ...customCredentials('') };
const { credentials } = specConfiguration;

//npm run regression -- --baseUrl=https://mci-1u056-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --spec 'specs/regression/AG-Grid/DataBar.spec.js'
describe('AG Grid - Create and config data bar', () => {
    const tutorialProject = {
        id: 'B628A31F11E7BD953EAE0080EF0583BD',
        name: 'New MicroStrategy Tutorials',
    };
    const dataBarDashboard = {
        id: 'AAB0D7A246E79A1E59D6FDA8EB985AB9',
        name: 'Data bar Automation',
        project: tutorialProject,
    };

    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let {
        dossierPage,
        libraryPage,
        baseFormatPanel,
        agGridVisualization,
        loginPage,
        contentsPanel,
        databarConfigDialog,
        vizPanelForGrid,
        loadingDialog,
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

    it('[TC98745] Sanity create data bar in Ag grid', async () => {
        const url = browser.options.baseUrl + `app/${tutorialProject.id}/${dataBarDashboard.id}/edit`;
        await libraryPage.openDossierByUrl(url.toString());
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Sanity' });

        infoLog('RMC on Maintenance ($) to enable data bar');
        await agGridVisualization.openMenuItem('Maintenance ($)', 'Add Bars...', 'Visualization 1');
        await since('The data bar config dialog is opened should be #{expected}, instead we have #{actual}.')
            .expect(await databarConfigDialog.isDatabarDialogOpened())
            .toBe(true);
        await since(
            'The data bar config dialog title should be Bars - Maintenance ($) is #{expected}, instead we have #{actual}'
        )
            .expect(await databarConfigDialog.dataBarDialogTitleIsDisplayed('Bars - Maintenance ($)'))
            .toBe(true);
        await databarConfigDialog.clickBtn('OK');
        await since('The data bar config dialog is opened should be #{expected}, instead we have #{actual}.')
            .expect(await databarConfigDialog.isDatabarDialogOpened())
            .toBe(false);

        infoLog('RMC on Forecast ($) with empty cells to enable data bar');
        await agGridVisualization.openMenuItem('Forecast ($)', 'Add Bars...', 'Visualization 1');
        await since('The data bar config dialog is opened should be #{expected}, instead we have #{actual}.')
            .expect(await databarConfigDialog.isDatabarDialogOpened())
            .toBe(true);
        await since(
            'The data bar config dialog title should be Bars - Forecast ($) is #{expected}, instead we have #{actual}'
        )
            .expect(await databarConfigDialog.dataBarDialogTitleIsDisplayed('Bars - Forecast ($)'))
            .toBe(true);

        infoLog('change bar direction, change positive value color');
        await databarConfigDialog.changeDropdown('Bar direction', 'Right to left');
        await since(
            'The data bar config dialog current bar direction pull down should be #{expected}, instead we have #{actual}.'
        )
            .expect(await databarConfigDialog.verfiyPulldownCurrSelection('Bar direction', 'Right to left'))
            .toBe(true);
        await databarConfigDialog.clickColorPicker('positive');
        await baseFormatPanel.selectAdvancedColorBuiltInSwatch('Light Orange');
        await databarConfigDialog.clickBtn('OK');
        await since('The data bar config dialog is opened should be #{expected}, instead we have #{actual}.')
            .expect(await databarConfigDialog.isDatabarDialogOpened())
            .toBe(false);

        infoLog('take screenshot of the grid for verification');
        const containerXPath = agGridVisualization.getContainerPath('Visualization 1');
        const containerEl = await $(containerXPath);
        await takeScreenshotByElement(containerEl, 'TC98745', 'Sanity check data bar in ag grid');
    });

    it('[TC98746] Regression create and config data bar in Ag grid', async () => {
        const url = browser.options.baseUrl + `app/${tutorialProject.id}/${dataBarDashboard.id}/edit`;
        await libraryPage.openDossierByUrl(url.toString());

        infoLog('Switch to page regression');
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Regression' });

        await since('Page "Regression" in chapter "Chapter 1" is the current page')
                .expect(await (await contentsPanel.getPage({ chapterName: 'Chapter 1', pageName: 'Regression' })).isDisplayed())
                .toBe(true);

        infoLog('Enable show total on the grid');
        await agGridVisualization.toggleShowTotalsByContextMenu('Viz 1');
        await since('The grid cell in ag-grid "Viz 1" at row 3, col 1 should be #{expected}, instead it is #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 1, 'Viz 1'))
            .toBe('Total');
        await since('The grid cell in ag-grid "Viz 1" at row 3, col 3 should be #{expected}, instead it is #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 3, 'Viz 1'))
            .toBe('($64,283,763)');

        infoLog('RMC to open data bar for DM test (Values and Totals)');
        await vizPanelForGrid.switchToEditorPanel();
        await agGridVisualization.openMenuItem('test', 'Add Bars...', 'Viz 1');
        await since('The data bar config dialog is opened should be #{expected}, instead we have #{actual}.')
            .expect(await databarConfigDialog.isDatabarDialogOpened())
            .toBe(true);
        await since('The data bar config dialog title should be Bars - test is #{expected}, instead we have #{actual}')
            .expect(await databarConfigDialog.dataBarDialogTitleIsDisplayed('Bars - test'))
            .toBe(true);
        await since(
            'The data bar config dialog Min input box is disabled should be #{expected}, instead we have #{actual}'
        )
            .expect(await databarConfigDialog.isMinMaxInputDisabled('min'))
            .toBe(true);
        await since(
            'The data bar config dialog Max input box is disabled should be #{expected}, instead we have #{actual}'
        )
            .expect(await databarConfigDialog.isMinMaxInputDisabled('max'))
            .toBe(true);

        infoLog('Change pulldown option and postive/negavtive color');
        await databarConfigDialog.changeDropdown('Apply to', 'Values and totals');
        await since(
            'The data bar config dialog current Apply to pull down should be Values and totals is #{expected}, instead we have #{actual}.'
        )
            .expect(await databarConfigDialog.verfiyPulldownCurrSelection('Apply to', 'Values and totals'))
            .toBe(true);
        await databarConfigDialog.clickColorPicker('positive');
        await baseFormatPanel.selectAdvancedColorBuiltInSwatch('Lime');
        await databarConfigDialog.clickColorPicker('negative');
        await baseFormatPanel.selectAdvancedColorBuiltInSwatch('Gold');
        await since(
            'The data bar config dialog Min input box is invalid should be #{expected}, instead we have #{actual}'
        )
            .expect(await databarConfigDialog.isMinMaxInputInvalid('min'))
            .toBe(true);

        infoLog('Type min and max values, hide labels');
        await databarConfigDialog.typeMinMaxValue('min', '10000');
        await databarConfigDialog.typeMinMaxValue('max', '1000000');
        await databarConfigDialog.clickCheckboxbyLabel('Hide labels');
        await since('The hide labels checkbox is checked should be #{expected}, instead we have #{actual}')
            .expect(await databarConfigDialog.isCheckboxchecked('Hide labels'))
            .toBe(true);
        await databarConfigDialog.clickBtn('OK');
        await since('The data bar config dialog is opened should be #{expected}, instead we have #{actual}.')
            .expect(await databarConfigDialog.isDatabarDialogOpened())
            .toBe(false);

        infoLog('RMC on Profits to enable data bar (Totals only)');
        await agGridVisualization.openMenuItem('Profit', 'Add Bars...', 'Viz 1');
        await since('The data bar config dialog is opened should be #{expected}, instead we have #{actual}.')
            .expect(await databarConfigDialog.isDatabarDialogOpened())
            .toBe(true);
        await since(
            'The data bar config dialog title should be Bars - Profit is #{expected}, instead we have #{actual}'
        )
            .expect(await databarConfigDialog.dataBarDialogTitleIsDisplayed('Bars - Profit'))
            .toBe(true);
        await databarConfigDialog.changeDropdown('Apply to', 'Totals only');
        await since(
            'The data bar config dialog current Apply to pull down should be #{expected}, instead we have #{actual}.'
        )
            .expect(await databarConfigDialog.verfiyPulldownCurrSelection('Apply to', 'Totals only'))
            .toBe(true);
        await databarConfigDialog.typeMinMaxValue('min', '1000000');
        await databarConfigDialog.typeMinMaxValue('max', '5000000');
        await databarConfigDialog.clickBtn('OK');
        await since('The data bar config dialog should be #{expected}, instead we have #{actual}.')
            .expect(await databarConfigDialog.isDatabarDialogOpened())
            .toBe(false);

        infoLog('RMC on (Profit*-1) to enable data bar');
        await agGridVisualization.openMenuItem('(Profit*-1)', 'Add Bars...', 'Viz 1');
        await since('The data bar config dialog should be #{expected}, instead we have #{actual}.')
            .expect(await databarConfigDialog.isDatabarDialogOpened())
            .toBe(true);
        await since(
            'The data bar config dialog title should be Bars - (Profit*-1) is #{expected}, instead we have #{actual}'
        )
            .expect(await databarConfigDialog.dataBarDialogTitleIsDisplayed('Bars - (Profit*-1)'))
            .toBe(true);
        await databarConfigDialog.clickBtn('OK');
        await since('The data bar config dialog should be #{expected}, instead we have #{actual}.')
            .expect(await databarConfigDialog.isDatabarDialogOpened())
            .toBe(false);

        infoLog('Crosstab - RMC on Profit ($) to enable data bar');
        await agGridVisualization.openMenuItem('Total ($)', 'Add Bars...', 'Viz 1');
        await since('The data bar config dialog should be #{expected}, instead we have #{actual}.')
            .expect(await databarConfigDialog.isDatabarDialogOpened())
            .toBe(true);
        await since(
            'The data bar config dialog title should be Bars - Total ($) is #{expected}, instead we have #{actual}'
        )
            .expect(await databarConfigDialog.dataBarDialogTitleIsDisplayed('Bars - Total ($)'))
            .toBe(true);
        await databarConfigDialog.clickBtn('OK');
        await since('The data bar config dialog should be #{expected}, instead we have #{actual}.')
            .expect(await databarConfigDialog.isDatabarDialogOpened())
            .toBe(false);

        infoLog('take screenshot of the grid for verification');
        const containerXPath = agGridVisualization.getContainerPath('Viz 1');
        const containerEl = await $(containerXPath);
        await takeScreenshotByElement(containerEl, 'TC98746_1', 'Regression check data bar in ag grid');

        infoLog('Edit databar');
        await agGridVisualization.openMenuItem('test', 'Edit Bars...', 'Viz 1');
        await since('The data bar config dialog should be #{expected}, instead we have #{actual}.')
            .expect(await databarConfigDialog.isDatabarDialogOpened())
            .toBe(true);
        await databarConfigDialog.clickCheckboxbyLabel('Hide labels');
        await since('The hide labels checkbox is checked should be #{expected}, instead we have #{actual}')
            .expect(await databarConfigDialog.isCheckboxchecked('Hide labels'))
            .toBe(false);
        await databarConfigDialog.clickBtn('OK');
        await since('The data bar config dialog should be opened is #{expected}, instead we have #{actual}.')
            .expect(await databarConfigDialog.isDatabarDialogOpened())
            .toBe(false);

        infoLog('Clear data bar');
        await agGridVisualization.openMenuItem('test', 'Bars', 'Viz 1');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        infoLog('take screenshot of the grid for verification');
        await takeScreenshotByElement(containerEl, 'TC98746_2', 'Regression check data bar in ag grid_AfterEditClear');
    });

    it('[BCIN-6754] The negative databar cannot display well when set number format as red ones', async () => {
        const url = browser.options.baseUrl + `app/${tutorialProject.id}/${dataBarDashboard.id}/edit`;
        await libraryPage.openDossierByUrl(url.toString());
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Xfunc number format' });
        await dossierPage.hidePageIndicator();
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Fit to content'),
            'BCIN-6754_1',
            'Negative databar in fit to content mode'
        );
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Fit to container'),
            'BCIN-6754_2',
            'Negative databar in fit to container mode'
        );
    });
});
export const config = specConfiguration;
