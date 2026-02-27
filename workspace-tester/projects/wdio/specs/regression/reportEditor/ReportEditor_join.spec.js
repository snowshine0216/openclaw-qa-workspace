import * as reportConstants from '../../../constants/report.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { browserWindow } from '../../../constants/index.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

describe('Report Editor Grid View', () => {
    let { libraryPage, reportGridView, reportDatasetPanel, reportToolbar, reportPromptEditor, loginPage } =
        browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(reportConstants.reportUser);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
        await libraryPage.handleError();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC85614_01] Test join behaviors in the In Reports panel', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.ReportJoinBehavior.id,
            projectId: reportConstants.ReportJoinBehavior.project.id,
        });

        // await reportDatasetPanel.switchToInReportTab();

        // Validate unsupported objects
        await reportDatasetPanel.openObjectContextMenu('2015 & 2016');
        await since(
            'The context menu option should not contain "Join Type" is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportDatasetPanel.contextMenuContainsOption('Join Type'))
            .toBe(false);
        await reportDatasetPanel.openObjectContextMenu('Custom Categories');
        await since(
            'The context menu option should not contain "Join Type" is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportDatasetPanel.contextMenuContainsOption('Join Type'))
            .toBe(false);
        await reportDatasetPanel.openObjectContextMenu('Products');
        await since(
            'The context menu option should not contain "Join Type" is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportDatasetPanel.contextMenuContainsOption('Join Type'))
            .toBe(false);

        // Validate metric objects
        await reportDatasetPanel.openObjectContextMenu('Cost');
        await reportDatasetPanel.selectSubmenuOption('Join Type|Inner Join', true);
        // await since(
        //     'After clicking Inner Join, the object "Cost" in the Object Panel having the "Inner Join" icon is expected to be #{expected}, instead we have #{actual}'
        // )
        //     .expect(await reportDatasetPanel.objectHasJoinIcon('Cost', 'Inner Join'))
        //     .toBe(true);
        await takeScreenshotByElement(
            await reportDatasetPanel.ReportObjectsPanel,
            'TC85614_01',
            'After clicking Inner Join, the object "Cost" in the Object Panel having the "Inner Join" icon'
        );
        await reportDatasetPanel.openObjectContextMenu('Cost');
        await since(
            'After clicking Inner Join and reopening object context menu, Submenu item "Join Type|Inner Join" showing up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportDatasetPanel.isSubmenuOptionSelected('Join Type|Inner Join'))
            .toBe(true);

        await reportDatasetPanel.selectSubmenuOption('Join Type|Outer Join', true);
        // await since(
        //     'After clicking Outer Join, the object "Cost" in the Object Panel having the "Outer Join" icon is expected to be #{expected}, instead we have #{actual}'
        // )
        //     .expect(await reportDatasetPanel.objectHasJoinIcon('Cost', 'Outer Join'))
        //     .toBe(true);
        await takeScreenshotByElement(
            await reportDatasetPanel.ReportObjectsPanel,
            'TC85614_01',
            'After clicking Outer Join, the object "Cost" in the Object Panel having the "Outer Join" icon'
        );
        await reportDatasetPanel.openObjectContextMenu('Cost');
        await since(
            'After clicking Outer Join and reopening object context menu, Submenu item "Join Type|Outer Join" showing up is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportDatasetPanel.isSubmenuOptionSelected('Join Type|Outer Join'))
            .toBe(true);

        await reportDatasetPanel.selectSubmenuOption('Join Type|Default', true);
        // await since(
        //     'After clicking Default, the object "Cost" in the Object Panel having the "Inner Join" icon is expected to be #{expected}, instead we have #{actual}'
        // )
        //     .expect(await reportDatasetPanel.objectHasJoinIcon('Cost', 'Inner Join'))
        //     .toBe(true);
        await takeScreenshotByElement(
            await reportDatasetPanel.ReportObjectsPanel,
            'TC85614_01',
            'After clicking Default, the object "Cost" in the Object Panel having the "Inner Join" icon'
        );
        await reportDatasetPanel.openObjectContextMenu('Cost');
        await since(
            'After clicking Default and reopening object context menu, Submenu item "Join Type|Default (Inner Join)" is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await reportDatasetPanel.isSubmenuOptionSelected('Join Type|Default (Inner Join)'))
            .toBe(true);
    });

    it('[TC85614_02] Test join behaviors in the In Reports panel Case 2', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.TC85614JoinOnMetric.id,
            projectId: reportConstants.TC85614JoinOnMetric.project.id,
        });
        await reportToolbar.switchToDesignMode();
        await reportPromptEditor.clickApplyButtonInReportPromptEditor();

        // 2.1 Outer-Outer
        await since('The grid cell at "2", "2" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 2))
            .toBe('$5.06');
        await since('The grid cell at "2", "3" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 3))
            .toBe('');
        await since('The grid cell at "4", "2" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(4, 2))
            .toBe('$8.32');
        await since('The grid cell at "2", "3" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 3))
            .toBe('');
        await since('The grid cell at "6", "2" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(6, 2))
            .toBe('$5.00');
        await since('The grid cell at "6", "3" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(6, 3))
            .toBe('$10.00');
        await since('The grid cell at "8", "2" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(8, 2))
            .toBe('$7.72');
        await since('The grid cell at "8", "3" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(8, 3))
            .toBe('$10.00');
        await since('The grid cell at "12", "2" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(12, 2))
            .toBe('$5.00');
        await since('The grid cell at "12", "3" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(12, 3))
            .toBe('$5.00');
        await since('The grid cell at "13", "2" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(13, 2))
            .toBe('$5.00');
        await since('The grid cell at "13", "3" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(13, 3))
            .toBe('$5.00');

        // 2.2 Inner-Outer
        // await reportDatasetPanel.switchToInReportTab();
        await reportDatasetPanel.openObjectContextMenu('Freight');
        await reportDatasetPanel.selectSubmenuOption('Join Type|Inner Join');
        // await since(
        //     'The object "Freight" in the Object Panel should have the "Inner Join" icon, instead we have #{actual}'
        // )
        //     .expect(await reportDatasetPanel.objectHasJoinIcon('Freight', 'Inner Join'))
        //     .toBe(true);
        await since('The grid cell at "1", "2" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('$5.00');
        await since('The grid cell at "1", "3" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('$10.00');
        await since('The grid cell at "2", "2" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 2))
            .toBe('$7.72');
        await since('The grid cell at "2", "3" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 3))
            .toBe('$10.00');
        await since('The grid cell at "3", "2" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(3, 2))
            .toBe('$5.00');
        await since('The grid cell at "3", "3" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(3, 3))
            .toBe('$5.00');
        await since('The grid cell at "4", "2" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(4, 2))
            .toBe('$5.00');
        await since('The grid cell at "4", "3" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(4, 3))
            .toBe('$5.00');

        // 2.3 Default-Outer
        // await reportDatasetPanel.switchToInReportTab();
        await reportDatasetPanel.openObjectContextMenu('Freight');
        await since('Submenu item "Join Type|Inner Join" should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.isSubmenuOptionSelected('Join Type|Inner Join'))
            .toBe(true);
        await reportDatasetPanel.selectSubmenuOption('Join Type|Default');
        await since('The grid cell at "1", "2" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('$5.00');
        await since('The grid cell at "1", "3" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('$10.00');
        await since('The grid cell at "2", "2" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 2))
            .toBe('$7.72');
        await since('The grid cell at "2", "3" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 3))
            .toBe('$10.00');
        await since('The grid cell at "3", "2" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(3, 2))
            .toBe('$5.00');
        await since('The grid cell at "3", "3" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(3, 3))
            .toBe('$5.00');
        await since('The grid cell at "4", "2" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(4, 2))
            .toBe('$5.00');
        await since('The grid cell at "4", "3" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(4, 3))
            .toBe('$5.00');

        // 2.4 Default-Default
        // await reportDatasetPanel.switchToInReportTab();
        await reportDatasetPanel.openObjectContextMenu('Rush Charge');
        await reportDatasetPanel.selectSubmenuOption('Join Type|Default');
        // await since(
        //     'The object "Rush Charge" in the Object Panel should have the "Inner Join" icon, instead we have #{actual}'
        // )
        //     .expect(await reportDatasetPanel.objectHasJoinIcon('Rush Charge', 'Inner Join'))
        //     .toBe(true);
        await since('The grid cell at "1", "2" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('$5.00');
        await since('The grid cell at "1", "3" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('$10.00');
        await since('The grid cell at "2", "2" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 2))
            .toBe('$7.72');
        await since('The grid cell at "2", "3" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 3))
            .toBe('$10.00');
        await since('The grid cell at "3", "2" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(3, 2))
            .toBe('$5.00');
        await since('The grid cell at "3", "3" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(3, 3))
            .toBe('$5.00');
        await since('The grid cell at "4", "2" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(4, 2))
            .toBe('$5.00');
        await since('The grid cell at "4", "3" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(4, 3))
            .toBe('$5.00');

        // 2.5 Default-Inner
        // await reportDatasetPanel.switchToInReportTab();
        await reportDatasetPanel.openObjectContextMenu('Rush Charge');
        await since('Submenu item "Join Type|Default (Inner Join)" should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.isSubmenuOptionSelected('Join Type|Default (Inner Join)'))
            .toBe(true);
        await reportDatasetPanel.selectSubmenuOption('Join Type|Inner Join');
        await since('The grid cell at "1", "2" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('$5.00');
        await since('The grid cell at "1", "3" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('$10.00');
        await since('The grid cell at "2", "2" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 2))
            .toBe('$7.72');
        await since('The grid cell at "2", "3" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 3))
            .toBe('$10.00');
        await since('The grid cell at "3", "2" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(3, 2))
            .toBe('$5.00');
        await since('The grid cell at "3", "3" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(3, 3))
            .toBe('$5.00');
        await since('The grid cell at "4", "2" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(4, 2))
            .toBe('$5.00');
        await since('The grid cell at "4", "3" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(4, 3))
            .toBe('$5.00');

        // 2.6 Inner-Inner
        // await reportDatasetPanel.switchToInReportTab();
        await reportDatasetPanel.openObjectContextMenu('Freight');
        await reportDatasetPanel.selectSubmenuOption('Join Type|Inner Join');
        await since('The grid cell at "1", "2" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('$5.00');
        await since('The grid cell at "1", "3" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('$10.00');
        await since('The grid cell at "2", "2" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 2))
            .toBe('$7.72');
        await since('The grid cell at "2", "3" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 3))
            .toBe('$10.00');
        await since('The grid cell at "3", "2" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(3, 2))
            .toBe('$5.00');
        await since('The grid cell at "3", "3" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(3, 3))
            .toBe('$5.00');
        await since('The grid cell at "4", "2" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(4, 2))
            .toBe('$5.00');
        await since('The grid cell at "4", "3" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(4, 3))
            .toBe('$5.00');

        // 2.7 Outer-Inner
        // await reportDatasetPanel.switchToInReportTab();
        await reportDatasetPanel.openObjectContextMenu('Freight');
        await reportDatasetPanel.selectSubmenuOption('Join Type|Outer Join');
        // await since('The object "Freight" in the Object Panel should have the "Outer Join" icon')
        //     .expect(await reportDatasetPanel.objectHasJoinIcon('Freight', 'Outer Join'))
        //     .toBe(true);
        await since('The grid cell at "2", "2" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 2))
            .toBe('$5.06');
        await since('The grid cell at "2", "3" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 3))
            .toBe('');
        await since('The grid cell at "4", "2" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(4, 2))
            .toBe('$8.32');
        await since('The grid cell at "2", "3" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 3))
            .toBe('');
        await since('The grid cell at "6", "2" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(6, 2))
            .toBe('$5.00');
        await since('The grid cell at "6", "3" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(6, 3))
            .toBe('$10.00');
        await since('The grid cell at "8", "2" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(8, 2))
            .toBe('$7.72');
        await since('The grid cell at "8", "3" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(8, 3))
            .toBe('$10.00');
        await since('The grid cell at "12", "2" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(12, 2))
            .toBe('$5.00');
        await since('The grid cell at "12", "3" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(12, 3))
            .toBe('$5.00');
        await since('The grid cell at "13", "2" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(13, 2))
            .toBe('$5.00');
        await since('The grid cell at "13", "3" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(13, 3))
            .toBe('$5.00');
        await since('The grid cell at "13", "3" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(13, 3))
            .toBe('$5.00');

        // 2.8 Outer-Default
        // await reportDatasetPanel.switchToInReportTab();
        await reportDatasetPanel.openObjectContextMenu('Rush Charge');
        await reportDatasetPanel.selectSubmenuOption('Join Type|Default');
        await since('The grid cell at "2", "2" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 2))
            .toBe('$5.06');
        await since('The grid cell at "2", "3" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 3))
            .toBe('');
        await since('The grid cell at "4", "2" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(4, 2))
            .toBe('$8.32');
        await since('The grid cell at "2", "3" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 3))
            .toBe('');
        await since('The grid cell at "6", "2" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(6, 2))
            .toBe('$5.00');
        await since('The grid cell at "6", "3" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(6, 3))
            .toBe('$10.00');
        await since('The grid cell at "8", "2" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(8, 2))
            .toBe('$7.72');
        await since('The grid cell at "8", "3" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(8, 3))
            .toBe('$10.00');
        await since('The grid cell at "12", "2" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(12, 2))
            .toBe('$5.00');
        await since('The grid cell at "12", "3" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(12, 3))
            .toBe('$5.00');
        await since('The grid cell at "13", "2" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(13, 2))
            .toBe('$5.00');
        await since('The grid cell at "13", "3" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(13, 3))
            .toBe('$5.00');

        // 2.9 Inner-Default
        // await reportDatasetPanel.switchToInReportTab();
        await reportDatasetPanel.openObjectContextMenu('Freight');
        await since('Submenu item "Join Type|Outer Join" should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.isSubmenuOptionSelected('Join Type|Outer Join'))
            .toBe(true);
        await reportDatasetPanel.selectSubmenuOption('Join Type|Inner Join');
        await since('The grid cell at "1", "2" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('$5.00');
        await since('The grid cell at "1", "3" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('$10.00');
        await since('The grid cell at "2", "2" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 2))
            .toBe('$7.72');
        await since('The grid cell at "2", "3" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 3))
            .toBe('$10.00');
        await since('The grid cell at "3", "2" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(3, 2))
            .toBe('$5.00');
        await since('The grid cell at "3", "3" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(3, 3))
            .toBe('$5.00');
        await since('The grid cell at "4", "2" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(4, 2))
            .toBe('$5.00');
        await since('The grid cell at "4", "3" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(4, 3))
            .toBe('$5.00');
    });

    it('[TC85614_03] Test join behaviors in the In Reports panel Case 3', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.TC85614JoinOnAttributeAndMetric.id,
            projectId: reportConstants.TC85614JoinOnAttributeAndMetric.project.id,
        });
        await reportToolbar.switchToDesignMode();

        // 3.1 Outer
        await since('The grid cell at "1", "0" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('USA');
        await since('The grid cell at "1", "1" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('$31,120,946');
        await since('The grid cell at "2", "0" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 0))
            .toBe('England');
        await since('The grid cell at "2", "1" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 1))
            .toBe('');
        await since('The grid cell at "3", "0" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(3, 0))
            .toBe('France');
        await since('The grid cell at "3", "1" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(3, 1))
            .toBe('');
        await since('The grid cell at "4", "0" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(4, 0))
            .toBe('Germany');
        await since('The grid cell at "4", "1" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(4, 1))
            .toBe('');
        await since('The grid cell at "5", "0" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(5, 0))
            .toBe('Web');
        await since('The grid cell at "5", "1" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(5, 1))
            .toBe('$3,902,762');

        // 3.2 Default
        // await reportDatasetPanel.switchToInReportTab();
        await reportDatasetPanel.openObjectContextMenu('Country');
        await since('Submenu item "Join Type|Outer Join" should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.isSubmenuOptionSelected('Join Type|Outer Join'))
            .toBe(true);
        await reportDatasetPanel.selectSubmenuOption('Join Type|Default');
        await since('The grid cell at "1", "0" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('USA');
        await since('The grid cell at "1", "1" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('$31,120,946');
        await since('The grid cell at "2", "0" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 0))
            .toBe('England');
        await since('The grid cell at "2", "1" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 1))
            .toBe('');
        await since('The grid cell at "3", "0" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(3, 0))
            .toBe('France');
        await since('The grid cell at "3", "1" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(3, 1))
            .toBe('');
        await since('The grid cell at "4", "0" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(4, 0))
            .toBe('Germany');
        await since('The grid cell at "4", "1" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(4, 1))
            .toBe('');
        await since('The grid cell at "5", "0" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(5, 0))
            .toBe('Web');
        await since('The grid cell at "5", "1" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(5, 1))
            .toBe('$3,902,762');

        // 3.3 Default
        // await reportDatasetPanel.switchToInReportTab();
        await reportDatasetPanel.openObjectContextMenu('Country');
        await since('Submenu item "Join Type|Default (Outer Join)" should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.isSubmenuOptionSelected('Join Type|Default (Outer Join)'))
            .toBe(true);
        await reportDatasetPanel.selectSubmenuOption('Join Type|Inner Join');
        await since('The grid cell at "1", "0" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('USA');
        await since('The grid cell at "2", "0" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 0))
            .toBe('Web');
        await since('The grid cell at "2", "1" should be #{expected}, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 1))
            .toBe('$3,902,762');

        // await reportDatasetPanel.switchToInReportTab();
        await reportDatasetPanel.openObjectContextMenu('Country');
        await since('Submenu item "Join Type|Inner Join" should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.isSubmenuOptionSelected('Join Type|Inner Join'))
            .toBe(true);
    });
});
