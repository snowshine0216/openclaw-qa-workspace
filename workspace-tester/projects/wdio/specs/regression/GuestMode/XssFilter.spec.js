import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import resetDossierState from '../../../api/resetDossierState.js';
import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_filter') };

const project = {
    id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
    name: 'MicroStrategy Tutorial',
};

const browserWindow = {
    browserInstance: browsers.browser1,
    width: 900,
    height: 1200,
};

describe('Filter with xss', () => {
    const dossier1 = {
        id: 'FC6D77904E75F811D021C1A5589461F8',
        name: 'Dossier filter panel with xss',
        project,
    };

    const dossier2 = {
        id: '49CA250D49C739E794CF4C9494F654AB',
        name: 'OldDE with xss',
        project,
    };

    let { filterPanel, loginPage, libraryPage, checkboxFilter, grid, filterSummaryBar, toc, dossierPage } =
        browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC73252] Validate server setting to Disable HTML and Javascript execution can work for attribute with html tag and metrics', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier1,
        });
        await libraryPage.openDossier(dossier1.name);
        await filterPanel.openFilterPanel();

        // check initial rendering for attribute/metric filters with xss
        const attributeName = "Attribute><img src=x onerror=alert('AttributeName')>";
        await takeScreenshotByElement(filterPanel.getFilterPanelWrapper(), 'TC73252', 'XSSFilterRender');

        // make selections
        await checkboxFilter.openSecondaryPanel(attributeName);
        await checkboxFilter.selectElementByName('alert1');
        await filterPanel.apply();
        await since(
            'The summary for attribute with xss in filter summary bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterItems(attributeName))
            .toBe('(alert1)');
        await filterPanel.openFilterPanel();
        await checkboxFilter.openContextMenu(attributeName);
        await checkboxFilter.selectContextMenuOption(attributeName, 'Exclude');
        await filterPanel.apply();
        await since(
            'The summary for attribute with xss in filter summary bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterItems(attributeName))
            .toBe('(exclude alert1)');
    });

    it('[TC73254] Validate server setting to Disable HTML and Javascript execution can work for Old DE', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier2,
        });
        await libraryPage.openDossier(dossier2.name);
        await filterPanel.openFilterPanel();

        // make selections for oldDE with xss
        const oldDEName = "OldDE><img src=x onerror=alert('OldDE')>";
        await checkboxFilter.openSecondaryPanel(oldDEName);
        await checkboxFilter.selectElementByName('OldDE');
        await filterPanel.apply();
        await since('The summary for oldDE in filter summary bar should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems(oldDEName))
            .toBe('(OldDE)');
    });

    it('[TC73255] Validate server setting to Disable HTML and Javascript execution can work for New DE', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier1,
        });
        await libraryPage.openDossier(dossier1.name);
        await toc.openPageFromTocMenu({ chapterName: 'NDE' });
        await filterPanel.openFilterPanel();

        // make selections for NDE with xss
        const elementName = "<script>NDE</script>><img src=x onerror=alert('NDE') onclick=a></script>";
        await checkboxFilter.openSecondaryPanel('NDE');
        await checkboxFilter.selectElementByName(elementName);
        await filterPanel.apply();
        await filterPanel.openFilterPanel();
        await since('Selection info for NDE is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await checkboxFilter.filterSelectionInfo('NDE'))
            .toBe('(1/1)');
    });

    it('[TC73256] Validate server setting to Disable HTML and Javascript execution can work for custom group and consolidation', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier1,
        });
        await libraryPage.openDossier(dossier1.name);
        await toc.openPageFromTocMenu({ chapterName: 'Custom Group' });
        await filterPanel.openFilterPanel();

        // make selections for Custom group with xss
        const elementName =
            "<script>Custom Group</script>><img src=x onerror=alert('Custom Group') onclick=a></script>";
        await checkboxFilter.openSecondaryPanel('Custom Group with XSS');
        await checkboxFilter.selectElementByName(elementName);
        await filterPanel.apply();
        await filterPanel.openFilterPanel();
        await since('Selection info for Custom Group is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await checkboxFilter.filterSelectionInfo('Custom Group with XSS'))
            .toBe('(1/1)');
    });
});

export const config = specConfiguration;
