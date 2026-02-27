import * as gridConstants from '../../../constants/grid.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import resetDossierState from '../../../api/resetDossierState.js';

describe('[AG Grid Fit To Mode]', () => {
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let {
        loginPage,
        libraryPage,
        agGridVisualization,
        toc,
        dossierPage,
        baseFormatPanel,
        baseFormatPanelReact,
        newFormatPanelForGrid,
        editorPanelForGrid,
        editorPanel,
    } = browsers.pageObj1;


    beforeAll(async () => {
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        if (await dossierPage.isAccountIconPresent()) {
            await dossierPage.openUserAccountMenu();
            await dossierPage.logout();
            await dossierPage.sleep(2000);
        } else {
            await browser.url(new URL('auth/ui/loginPage', browser.options.baseUrl).toString(), 100000);
        }
        await loginPage.login(gridConstants.gridUser);
        await resetDossierState({
            credentials: gridConstants.gridUser,
            dossier: gridConstants.AGGrid_FitTo,
        });
    });

    afterEach(async () => {

    });

    it('[BCIN-6696_01] Validate AG Grid layout in fit to container mode', async () => {
        await libraryPage.openDossierById({
            projectId: gridConstants.AGGrid_FitTo.project.id,
            dossierId: gridConstants.AGGrid_FitTo.id,
        });
        await toc.openPageFromTocMenu({ chapterName: 'Fit To Container', pageName: 'No horizontal scroll' });
        await dossierPage.hidePageIndicator();
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Default'),
            'BCIN-6696_01_01',
            'Default in No horizontal scroll - Fit to container mode'
        );
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Unmerge row header'),
            'BCIN-6696_01_02',
            'Unmerge row header in No horizontal scroll - Fit to container mode'
        );
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Lock row header'),
            'BCIN-6696_01_03',
            'Lock row header in No horizontal scroll - Fit to container mode'
        );
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Unmerge+lock row header'),
            'BCIN-6696_01_04',
            'Unmerge+lock row header in No horizontal scroll - Fit to container mode'
        );
        await toc.openPageFromTocMenu({ chapterName: 'Fit To Container', pageName: 'With horizontal scroll' });
        await dossierPage.hidePageIndicator();
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Default'),
            'BCIN-6696_01_05',
            'Default in Horizontal scroll - Fit to container mode'
        );
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Unmerge row header'),
            'BCIN-6696_01_06',
            'Unmerge row header in Horizontal scroll - Fit to container mode'
        );
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Lock row header'),
            'BCIN-6696_01_07',
            'Lock row header in Horizontal scroll - Fit to container mode'
        );
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Unmerge+lock row header'),
            'BCIN-6696_01_08',
            'Unmerge+lock row header in Horizontal scroll - Fit to container mode'
        );
        await toc.openPageFromTocMenu({ chapterName: 'Fit To Container', pageName: 'Wrap unwrap' });
        await dossierPage.hidePageIndicator();
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Column header wrap, row header unwrap'),
            'BCIN-6696_01_09',
            'Column header wrap, row header unwrap in Wrap unwrap - Fit to container mode'
        );
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Column header wrap, row header wrap'),
            'BCIN-6696_01_10',
            'Column header wrap, row header wrap in Wrap unwrap - Fit to container mode'
        );
        await takeScreenshotByElement(
            agGridVisualization.getContainer('All wrap'),
            'BCIN-6696_01_11',
            'All wrap in Wrap unwrap - Fit to container mode'
        );
        await takeScreenshotByElement(
            agGridVisualization.getContainer('All unwrap'),
            'BCIN-6696_01_12',
            'All unwrap in Wrap unwrap - Fit to container mode'
        );
        await toc.openPageFromTocMenu({ chapterName: 'Fit To Container', pageName: 'Outline' });
        await dossierPage.hidePageIndicator();
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Outline Standard'),
            'BCIN-6696_01_13',
            'Outline Standard in Fit to container mode'
        );
        await agGridVisualization.expandGroupCell(await agGridVisualization.getGridCellByPos(0, 0, 'Outline Standard'));
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Outline Standard'),
            'BCIN-6696_01_14',
            'Expand Outline Standard in Fit to container mode'
        );
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Outline Compact'),
            'BCIN-6696_01_15',
            'Outline Compact in Fit to container mode'
        );
        await agGridVisualization.expandGroupCell(await agGridVisualization.getGridCellByPos(0, 0, 'Outline Compact'));
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Outline Compact'),
            'BCIN-6696_01_16',
            'Expand Outline Compact in Fit to container mode'
        );
    });

    it('[BCIN-6696_02] Validate AG Grid layout in fit to content mode', async () => {
        await libraryPage.openDossierById({
            projectId: gridConstants.AGGrid_FitTo.project.id,
            dossierId: gridConstants.AGGrid_FitTo.id,
        });
        await toc.openPageFromTocMenu({ chapterName: 'Fit To Content', pageName: 'No horizontal scroll' });
        await dossierPage.hidePageIndicator();
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Default'),
            'BCIN-6696_02_01',
            'Default in No horizontal scroll - Fit to content mode'
        );
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Unmerge row header'),
            'BCIN-6696_02_02',
            'Unmerge row header in No horizontal scroll - Fit to content mode'
        );
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Lock row header'),
            'BCIN-6696_02_03',
            'Lock row header in No horizontal scroll - Fit to content mode'
        );
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Unmerge+lock row header'),
            'BCIN-6696_02_04',
            'Unmerge+lock row header in No horizontal scroll - Fit to content mode'
        );
        await toc.openPageFromTocMenu({ chapterName: 'Fit To Content', pageName: 'With horizontal scroll' });
        await dossierPage.hidePageIndicator();
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Default'),
            'BCIN-6696_02_05',
            'Default in Horizontal scroll - Fit to content mode'
        );
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Unmerge row header'),
            'BCIN-6696_02_06',
            'Unmerge row header in Horizontal scroll - Fit to content mode'
        );
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Lock row header'),
            'BCIN-6696_02_07',
            'Lock row header in Horizontal scroll - Fit to content mode'
        );
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Unmerge+lock row header'),
            'BCIN-6696_02_08',
            'Unmerge+lock row header in Horizontal scroll - Fit to content mode'
        );
        await toc.openPageFromTocMenu({ chapterName: 'Fit To Content', pageName: 'Wrap unwrap' });
        await dossierPage.hidePageIndicator();
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Column header wrap, row header unwrap'),
            'BCIN-6696_02_09',
            'Column header wrap, row header unwrap in Wrap unwrap - Fit to content mode'
        );
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Column header wrap, row header wrap'),
            'BCIN-6696_02_10',
            'Column header wrap, row header wrap in Wrap unwrap - Fit to content mode'
        );
        await takeScreenshotByElement(
            agGridVisualization.getContainer('All wrap'),
            'BCIN-6696_02_11',
            'All wrap in Wrap unwrap - Fit to content mode'
        );
        await takeScreenshotByElement(
            agGridVisualization.getContainer('All unwrap'),
            'BCIN-6696_02_12',
            'All unwrap in Wrap unwrap - Fit to content mode'
        );
        await toc.openPageFromTocMenu({ chapterName: 'Fit To Content', pageName: 'Outline' });
        await dossierPage.hidePageIndicator();
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Outline Standard'),
            'BCIN-6696_02_13',
            'Outline Standard in Fit to content mode'
        );
        await agGridVisualization.expandGroupCell(await agGridVisualization.getGridCellByPos(0, 0, 'Outline Standard'));
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Outline Standard'),
            'BCIN-6696_02_14',
            'Expand Outline Standard in Fit to content mode'
        );
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Outline Compact'),
            'BCIN-6696_02_15',
            'Outline Compact in Fit to content mode'
        );
        await agGridVisualization.expandGroupCell(await agGridVisualization.getGridCellByPos(0, 0, 'Outline Compact'));
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Outline Compact'),
            'BCIN-6696_02_16',
            'Expand Outline Compact in Fit to content mode'
        );
    });

    it('[BCIN-6696_03] Validate AG Grid layout in fixed column width mode', async () => {
        await libraryPage.openDossierById({
            projectId: gridConstants.AGGrid_FitTo.project.id,
            dossierId: gridConstants.AGGrid_FitTo.id,
        });
        await toc.openPageFromTocMenu({ chapterName: 'Fixed', pageName: 'Fixed no scroll' });
        await dossierPage.hidePageIndicator();
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 1'),
            'BCIN-6696_03_01',
            'Fixed Column Width no scroll'
        );
        await toc.openPageFromTocMenu({ chapterName: 'Fixed', pageName: 'Fixed with scroll' });
        await dossierPage.hidePageIndicator();
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 1'),
            'BCIN-6696_03_02',
            'Fixed Column Width with scroll'
        );
    });

    it('[BCIN-6577] Validate should not show ellipsis during horizontal scroll', async () => {
        await libraryPage.openDossierById({
            projectId: gridConstants.AGGrid_Horizontal_Scroll2.project.id,
            dossierId: gridConstants.AGGrid_Horizontal_Scroll2.id,
        });
        await dossierPage.hidePageIndicator();
        await agGridVisualization.scrollHorizontallyToNextSlice(2, 'Visualization 2');
        await agGridVisualization.scrollHorizontallyToNextSlice(3, 'Visualization 2');
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 2'),
            'BCIN-6577_01',
            'Should not show ellipsis after scroll to right end'
        );
        await browser.pause(1000);
        await agGridVisualization.scrollHorizontally('left', 1500, 'Visualization 2');
        await agGridVisualization.scrollHorizontally('right', 800, 'Visualization 2');
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 2'),
            'BCIN-6577_02',
            'Should not show ellipsis after scroll to right end then scroll back'
        );
    });

    it('[BCIN-5272] Validate should not show ellipsis during vertical scroll', async () => {
        await libraryPage.openDossierById({
            projectId: gridConstants.AGGrid_Vertical_Scroll.project.id,
            dossierId: gridConstants.AGGrid_Vertical_Scroll.id,
        });
        await dossierPage.hidePageIndicator();
        await agGridVisualization.scrollVerticallyToMiddle('Visualization 1');
        await browser.pause(1000);
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 1'),
            'BCIN-5272_01',
            'Should refit to content during vertical scroll'
        );
    });

    it('[BCIN-6925] Validate the column width should be correct when html tag is disabled', async () => {
        await libraryPage.openUserAccountMenu();
        await libraryPage.logout();
        await loginPage.login(gridConstants.gridTestUser);
        await libraryPage.openDossierById({
            projectId: gridConstants.AGGrid_HtmlTagDisabled.project.id,
            dossierId: gridConstants.AGGrid_HtmlTagDisabled.id,
        });
        await dossierPage.hidePageIndicator();
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 1'),
            'BCIN-6925_01',
            'Validate the column width with html tag disabled'
        );
        // Go to edit mode
        await dossierPage.clickEditIcon();
        await dossierPage.waitForDossierLoading();
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 1'),
            'BCIN-6925_02',
            'Validate the column width with html tag disabled in edit mode'
        );
        // Enable outline mode
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // And I switch to the General Settings section on new format panel
        await baseFormatPanelReact.switchToGeneralSettingsTab();
        await newFormatPanelForGrid.expandLayoutSection();
        await newFormatPanelForGrid.clickCheckBox('Enable outline');
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 1'),
            'BCIN-6925_03',
            'Validate the column width with html tag disabled in outline compact mode'
        );
        // switch to standard mode
        await baseFormatPanelReact.changeDropdownReact('Compact', 'Standard');
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 1'),
            'BCIN-6925_04',
            'Validate the column width with html tag disabled in outline standard mode'
        );
        // Enable subtotals
        await editorPanel.switchToEditorPanel();
        await editorPanelForGrid.showTotal();
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 1'),
            'BCIN-6925_05',
            'Validate the column width with html tag disabled in outline standard mode with subtotals'
        );
    });

    it('[BCIN-7125] Link Derived Attribute should support wrap in fit to container/content mode', async () => {
        await libraryPage.openDossierById({
            projectId: gridConstants.AGGrid_LinkDA.project.id,
            dossierId: gridConstants.AGGrid_LinkDA.id,
        });
        await toc.openPageFromTocMenu({ chapterName: 'Release Metrics', pageName: 'Feature Status' });
        await dossierPage.hidePageIndicator();
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Fit to container'),
            'BCIN-7125_01',
            'Link Derived Attribute should support wrap in fit to container mode'
        );
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Fit to content'),
            'BCIN-7125_02',
            'Link Derived Attribute should support wrap in fit to content mode'
        );
        await toc.openPageFromTocMenu({ chapterName: 'Release Metrics', pageName: 'Feature Status outline' });
        await dossierPage.hidePageIndicator();
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Compact Fit to container'),
            'BCIN-7125_03',
            'Link Derived Attribute in outline compact Fit to container mode'
        );
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Compact Fit to content'),
            'BCIN-7125_04',
            'Link Derived Attribute in outline compact Fit to content mode'
        );
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Standard Fit to container'),
            'BCIN-7125_05',
            'Link Derived Attribute in outline standard Fit to container mode'
        );
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Standard Fit to content'),
            'BCIN-7125_06',
            'Link Derived Attribute in outline standard Fit to content mode'
        );
    });

    it('[BCIN-7153] The column width is longer than needed when set number format as red ones', async () => {
        await libraryPage.openDossierById({
            projectId: gridConstants.AGGrid_FitTo.project.id,
            dossierId: gridConstants.AGGrid_FitTo.id,
        });
        await toc.openPageFromTocMenu({ chapterName: 'Fit To Content', pageName: 'Threshold and number format' });
        await dossierPage.hidePageIndicator();
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 1'),
            'BCIN-7153_01',
            'Validate the column width with number format and threshold applied'
        );
    });

    it('[BCIN-7222] HTML tag should support wrap in fit to container/content mode', async () => {
        await libraryPage.openDossierById({
            projectId: gridConstants.AGGrid_HtmlTagWrap.project.id,
            dossierId: gridConstants.AGGrid_HtmlTagWrap.id,
        });
        await dossierPage.hidePageIndicator();
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Fit to container'),
            'BCIN-7222_01',
            'HTML tag should support wrap in fit to container mode'
        );
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Fit to content'),
            'BCIN-7222_02',
            'HTML tag should support wrap in fit to content mode'
        );
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Fit to container outline standard'),
            'BCIN-7222_03',
            'HTML tag in outline standard Fit to container mode'
        );
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Fit to container outline compact'),
            'BCIN-7222_04',
            'HTML tag in outline compact Fit to container mode'
        );
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Fit to content outline standard'),
            'BCIN-7222_05',
            'HTML tag in outline standard Fit to content mode'
        );
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Fit to content outline compact'),
            'BCIN-7222_06',
            'HTML tag in outline compact Fit to content mode'
        );
    });
});
