import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { customCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';

const specConfiguration = { ...customCredentials('_authoring') };
describe('AG Grid Support MDX', () => {
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    const dashboard = {
        id: '23EF3AA946D0EF27B8DF6FA0350A52A6',
        name: '(Auto) AG Grid With MDX',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
        pageKey: 'K53--K46',
    };

    let {
        loginPage,
        libraryPage,
        agGridVisualization,
        dossierAuthoringPage,
        grid,
        toc,
        dossierPage,
        filterPanel,
        dynamicFilter,
        formatPanel,
    } = browsers.pageObj1;

    const { credentials } = specConfiguration;

    beforeAll(async () => {
        await loginPage.login(credentials);
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dashboard,
        });
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC99340_01] Verify Modern Grid Support MDX in Comsumption - Apply Filter', async () => {
        await libraryPage.openDossier(dashboard.name);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'E2E' });
        await filterPanel.openFilterPanel();
        await dynamicFilter.openSecondaryPanel('Accounts');
        await dynamicFilter.clickBranchSelectionButton('Balance Sheet');
        await filterPanel.apply();
        await since('After select Balance Sheet, Grid row should should be #{expected}, instead we have #{actual}')
            .expect(await agGridVisualization.getAllAgGridObjectCount('Modern Grid - RA on the Row'))
            .toBe(1);
        await agGridVisualization.expandRA('Balance Sheet', 'Modern Grid - RA on the Row');
        await since('After expand, Grid row should should be #{expected}, instead we have #{actual}')
            .expect(await agGridVisualization.getAllAgGridObjectCount('Modern Grid - RA on the Row'))
            .toBe(3);
        await filterPanel.openFilterPanel();
        await dynamicFilter.openSecondaryPanel('Accounts');
        await dynamicFilter.expandElement('Balance Sheet');
        await dynamicFilter.singleDeselectElement('Balance Sheet');
        await filterPanel.apply();
        await since(
            'After single deselect Balance Sheet, Grid row should should be #{expected}, instead we have #{actual}'
        )
            .expect(await agGridVisualization.getAllAgGridObjectCount('Modern Grid - RA on the Row'))
            .toBe(2);
    });

    it('[TC99340_02] Verify Modern Grid Support MDX in Comsumption - Expand All Levels, Expand All Lower Levels', async () => {
        await libraryPage.openDossier(dashboard.name);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'E2E' });
        await agGridVisualization.expandRA('Balance Sheet', 'Modern Grid - RA on the Row');
        await since('After expand, Grid row should should be #{expected}, instead we have #{actual}')
            .expect(await agGridVisualization.getAllAgGridObjectCount('Modern Grid - RA on the Row'))
            .toBe(5);
        await agGridVisualization.openContextMenuItemForValue(
            'Net Income',
            'Expand All Lower Levels',
            'Modern Grid - RA on the Row'
        );
        await since('After expand all lower levels, Grid row should should be #{expected}, instead we have #{actual}')
            .expect(await agGridVisualization.getAllAgGridObjectCount('Modern Grid - RA on the Row'))
            .toBe(52);
        await grid.selectGridContextMenuOption({
            title: 'Modern Grid - RA on the Row',
            headerName: 'Accounts',
            firstOption: 'Collapse All Levels',
            agGrid: true,
        });
        await since('After Collapse All Levels, Grid row should should be #{expected}, instead we have #{actual}')
            .expect(await agGridVisualization.getAllAgGridObjectCount('Modern Grid - RA on the Row'))
            .toBe(3);
        await grid.selectGridContextMenuOption({
            title: 'Modern Grid - RA on the Row',
            headerName: 'Accounts',
            firstOption: 'Expand All Levels',
            agGrid: true,
        });
        await agGridVisualization.scrollVerticallyToBottom('Modern Grid - RA on the Row');
        await grid.scrollGridToBottom('Modern Grid - RA on the Row');
        await since('After Expand All Levels, Grid row should should be #{expected}, instead we have #{actual}')
            .expect(await agGridVisualization.getRowIndexByCellText('Square Footage', 'Modern Grid - RA on the Row'))
            .toBe(101);
        await agGridVisualization.collapseRA('Statistical Accounts', 'Modern Grid - RA on the Row');
        await takeScreenshotByElement(
            await grid.getTable('Modern Grid - RA on the Row', true),
            'TC99340_02',
            'Modern Grid - RA on the Row - After Collapse'
        );

        await agGridVisualization.collapseRAOnColumnHeader('CY 2001', 'Modern Grid - RA on the Column');
        await since('Expand all CY 2001, Header Count should be #{expected}, instead we have #{actual}')
            .expect(await grid.getHeaderCount('Modern Grid - RA on the Column', true))
            .toBe(6);
        await grid.selectGridContextMenuOption({
            title: 'Modern Grid - RA on the Column',
            headerName: 'Date.Calendar',
            firstOption: 'Collapse All Levels',
            agGrid: true,
        });
        await since('Expand all CY 2001, Grid row should should be #{expected}, instead we have #{actual}')
            .expect(await grid.getHeaderCount('Modern Grid - RA on the Column', true))
            .toBe(2);
    });

    it('[TC99340_03] Verify Modern Grid Support MDX in Comsumption - Keep Only', async () => {
        await libraryPage.openDossier(dashboard.name);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'E2E' });
        await grid.selectGridContextMenuOption({
            title: 'Modern Grid - RA on the Row',
            headerName: 'Accounts',
            elementName: 'Balance Sheet',
            firstOption: 'Keep Only',
            secondOption: 'Branch',
            agGrid: true,
        });
        await since('After keep only branch, Grid row should should be #{expected}, instead we have #{actual}')
            .expect(await agGridVisualization.getAllAgGridObjectCount('Modern Grid - RA on the Row'))
            .toBe(1);
        await agGridVisualization.expandRA('Balance Sheet', 'Modern Grid - RA on the Row');
        await since('After Expand, Grid row should should be #{expected}, instead we have #{actual}')
            .expect(await agGridVisualization.getAllAgGridObjectCount('Modern Grid - RA on the Row'))
            .toBe(3);
        await grid.selectGridContextMenuOption({
            title: 'Modern Grid - RA on the Row',
            headerName: 'Accounts',
            elementName: 'Assets',
            firstOption: 'Keep Only',
            secondOption: 'Element',
            agGrid: true,
        });
        await since('After keep only element, Grid row should should be #{expected}, instead we have #{actual}')
            .expect(await agGridVisualization.getAllAgGridObjectCount('Modern Grid - RA on the Row'))
            .toBe(1);

        await agGridVisualization.expandRAOnColumnHeader('All Periods', 'Modern Grid - NDE RA on the Column');
        await grid.selectGridContextMenuOption({
            title: 'Modern Grid - NDE RA on the Column',
            headerName: 'CY2001&CY2002',
            firstOption: 'Keep Only',
            secondOption: 'Branch',
            agGrid: true,
        });
        await since('After keep only branch, Grid row should should be #{expected}, instead we have #{actual}')
            .expect(await grid.getHeaderCount('Modern Grid - NDE RA on the Column', true))
            .toBe(2);
        await agGridVisualization.expandRAOnColumnHeader('CY2001&CY2002', 'Modern Grid - NDE RA on the Column');
        await since('After expand CY2001&CY2002, Grid row should should be #{expected}, instead we have #{actual}')
            .expect(await grid.getHeaderCount('Modern Grid - NDE RA on the Column', true))
            .toBe(5);
        await grid.selectGridContextMenuOption({
            title: 'Modern Grid - NDE RA on the Column',
            headerName: 'H2 CY 2001',
            firstOption: 'Keep Only',
            secondOption: 'Element',
            agGrid: true,
        });
        await since('After keep only branch, Grid row should should be #{expected}, instead we have #{actual}')
            .expect(await grid.getHeaderCount('Modern Grid - NDE RA on the Column', true))
            .toBe(2);
    });

    it('[TC99340_04] Verify Modern Grid Support MDX in Comsumption - Exclude', async () => {
        await libraryPage.openDossier(dashboard.name);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'E2E' });
        await grid.selectGridContextMenuOption({
            title: 'Modern Grid - NDE RA on the Row',
            headerName: 'Accounts(Group)',
            elementName: 'Statistical Accounts',
            firstOption: 'Exclude',
            secondOption: 'Branch',
            agGrid: true,
        });
        await since('After keep only branch, Grid row should should be #{expected}, instead we have #{actual}')
            .expect(await agGridVisualization.getAllAgGridObjectCount('Modern Grid - NDE RA on the Row'))
            .toBe(1);
        await agGridVisualization.expandRA('Balance Sheet And Net Income', 'Modern Grid - NDE RA on the Row');
        await since('After Expand, Grid row should should be #{expected}, instead we have #{actual}')
            .expect(await agGridVisualization.getAllAgGridObjectCount('Modern Grid - NDE RA on the Row'))
            .toBe(6);
        await grid.selectGridContextMenuOption({
            title: 'Modern Grid - NDE RA on the Row',
            headerName: 'Accounts(Group)',
            elementName: 'Assets',
            firstOption: 'Exclude',
            secondOption: 'Element',
            agGrid: true,
        });
        await since('After keep only element, Grid row should should be #{expected}, instead we have #{actual}')
            .expect(await agGridVisualization.getAllAgGridObjectCount('Modern Grid - NDE RA on the Row'))
            .toBe(8);

        await grid.selectGridContextMenuOption({
            title: 'Modern Grid - RA on the Column',
            headerName: 'CY 2001',
            firstOption: 'Exclude',
            secondOption: 'Branch',
            agGrid: true,
        });
        await since('After Exclude branch, Grid row should should be #{expected}, instead we have #{actual}')
            .expect(await grid.getHeaderCount('Modern Grid - RA on the Column', true))
            .toBe(5);
        await grid.selectGridContextMenuOption({
            title: 'Modern Grid - RA on the Column',
            headerName: 'CY 2002',
            firstOption: 'Exclude',
            secondOption: 'Element',
            agGrid: true,
        });
        await since('After Exclude Element, Grid row should should be #{expected}, instead we have #{actual}')
            .expect(await grid.getHeaderCount('Modern Grid - RA on the Column', true))
            .toBe(6);
    });

    it('[TC99340_05] Verify Modern Grid Support MDX in Comsumption - Format', async () => {
        await libraryPage.openDossier(dashboard.name);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Format' });
        await takeScreenshotByElement(
            await grid.getTable('Mordern Grid - Underline, Strike', true),
            'TC99340_05',
            'Modern Grid - RA on the Row - Underline, Strike'
        );
        await takeScreenshotByElement(
            await grid.getTable('Modern Grid - Align Mode, Wrap', true),
            'TC99340_05',
            'Modern Grid - RA on the Row - Align Mode, Wrap'
        );
    });

    it('[TC99340_06] Verify Modern Grid Support MDX in authoring - Disabled entry', async () => {
        await libraryPage.editDossierWithPageKeyByUrl({
            projectId: dashboard.project.id,
            dossierId: dashboard.id,
            pageKey: dashboard.pageKey,
        });
        await formatPanel.switchToFormatPanel();
        await formatPanel.switchToVizOptionTab();
        await formatPanel.openDropdown('Layout');
        await since('Enable outline should be disabled, instead we have #{actual}')
            .expect(await formatPanel.isCheckboxItemDisabled('Enable outline'))
            .toBe(true);
        await grid.openMenuOnVisualization('Modern Grid - RA on the Row');
        await since('Show Data should be disabled, instead we have #{actual}')
            .expect(await grid.isContextMenuOptionPresent({ level: 0, option: 'Show Data' }))
            .toBe(false);
        await since('Pin Column should be disabled, instead we have #{actual}')
            .expect(await grid.isContextMenuOptionPresent({ level: 0, option: 'Pin Column' }))
            .toBe(false);
    });
});

export const config = specConfiguration;
