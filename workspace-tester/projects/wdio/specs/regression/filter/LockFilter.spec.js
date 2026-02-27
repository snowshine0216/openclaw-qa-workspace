import resetDossierState from '../../../api/resetDossierState.js';
import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

const specConfiguration = { ...customCredentials('_filter') };

const dossier = {
    id: 'DBAC8F554EFB5BA6F47693A13BADD147',
    name: '(AUTO) Lock Filter',
    project: {
        id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
        name: 'MicroStrategy Tutorial',
    },
};
const mdx = {
    id: '41341CCC4CDAD2AE2184DF883ABDF2F6',
    name: '(AUTO) Lock Filter - MDX',
    project: {
        id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
        name: 'MicroStrategy Tutorial',
    },
};
const browserWindow = {
    
    width: 1200,
    height: 1200,
};

let {
    filterPanel,
    libraryPage,
    checkboxFilter,
    searchboxFilter,
    chartVisualizationFilter,
    dynamicFilter,
    grid,
    filterSummary,
    userAccount,
    loginPage,
    toc,
    dossierPage,
} = browsers.pageObj1;

describe('Lock Filter', () => {
    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    beforeEach(async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });
    });

    it('[TC80914_01] [Lock Filter] Acceptance test for Disabling interactions with a filter in Library - AttributeSelector', async () => {
        await libraryPage.openDossier(dossier.name);
        //Check Attribute Selector Filter
        await toc.openPageFromTocMenu({ chapterName: 'attribute selector', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();
        await since('Filter_Age Range Locked is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterItemLocked('Age Range'))
            .toBe(true);
        await since('Filter_Category Locked is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterItemLocked('Category'))
            .toBe(true);
        await since('Filter_Subcategory Locked is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterItemLocked('Subcategory'))
            .toBe(true);
        await since('Filter_Year Locked is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterItemLocked('Year'))
            .toBe(true);
        await since('Clear All Filters Button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isClearFilterDisabled())
            .toBe(true);
        await since('Apply Button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isApplyEnabled())
            .toBe(false);

        await filterPanel.clickFilterByName('Age Range');
        await since('Filter_Age Range Details Panel Locked is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isAttrFilterDetailsPanelLocked('Age Range'))
            .toBe(true);
        await since('Filter_Age Range Details Panel message is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.getFilterDisabledMessageText())
            .toBe('Filter interactions are disabled.');

        await takeScreenshotByElement(
            filterPanel.getFilterDetailsPanel(),
            'TC80914_AttributeSelector',
            'Filter: Age Range'
        );

        await filterPanel.clickFilterByName('Category');
        await since('Filter_Category Details Panel Locked is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isAttrFilterDetailsPanelLocked('Category'))
            .toBe(true);
        await since(
            'Filter_Category Range Details Panel message is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getFilterDisabledMessageText())
            .toBe('Filter interactions are disabled.');

        await filterPanel.clickFilterByName('Subcategory');
        await since('Filter_Subcategory Details Panel Locked is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isAttrFilterDetailsPanelLocked('Subcategory'))
            .toBe(true);
        await since(
            'Filter_Subcategory Range Details Panel message is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.getFilterDisabledMessageText())
            .toBe('Filter interactions are disabled.');

        await filterPanel.hoverFilterByName('Year');
        await dossierPage.sleep(300);
        await takeScreenshotByElement(
            filterPanel.getFilterPanelDropdown(),
            'TC80914_AttributeSelector',
            'Filter: Year'
        );
        await since('Apply Button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isApplyEnabled())
            .toBe(false);
        await since('Clear All Filters Button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isClearFilterDisabled())
            .toBe(true);
    });

    it('[TC80914_02] [Lock Filter] Acceptance test for Disabling interactions with a filter in Library - Calendar_SearchBox', async () => {
        await libraryPage.openDossier(dossier.name);
        //Check Calendar Filter and SearchBox Filter
        await toc.openPageFromTocMenu({ chapterName: 'calendar + searchbox', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();
        await takeScreenshotByElement(
            filterPanel.getFilterPanelDropdown(),
            'TC80914_Calendar_SearchBox',
            'All filters'
        );
        await since('Filter_Customer Birth Date Locked is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterItemLocked('Customer Birth Date'))
            .toBe(true);
        await since('Filter_Year Locked is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterItemLocked('Year'))
            .toBe(true);
        await since('Filter_Quarter Locked is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterItemLocked('Quarter'))
            .toBe(true);

        await filterPanel.clickFilterByName('Customer Birth Date');
        await since(
            'Filter_Customer Birth Date Details Panel Locked is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.isCalFilterDetailsPanelLocked('Customer Birth Date'))
            .toBe(true);
        await takeScreenshotByElement(
            filterPanel.getFilterDetailsPanel(),
            'TC80914_Calendar_SearchBox',
            'Filter: Customer Birth Date',
            { tolerance: 0.4 }
        );

        await checkboxFilter.openSecondaryPanel('Year');
        await since('Filter_Year Details Panel Locked is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isAttrFilterDetailsPanelLocked('Year'))
            .toBe(true);

        await checkboxFilter.openSecondaryPanel('Quarter');
        await checkboxFilter.toggleViewSelectedOptionOn();
        await dossierPage.sleep(500);
        await takeScreenshotByElement(
            filterPanel.getFilterDetailsPanel(),
            'TC80914_Calendar_SearchBox',
            'Filter: Quarter - Viewselected'
        );
    });

    it('[TC80914_03] [Lock Filter] Acceptance test for Disabling interactions with a filter in Library - MetricQualification', async () => {
        await libraryPage.openDossier(dossier.name);
        //Check Metric Qualifization Filter
        await toc.openPageFromTocMenu({ chapterName: 'metric qualification', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();
        await since('Filter_Cost Locked is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterItemLocked('Cost'))
            .toBe(true);
        await since('Filter_Revenue Locked is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterItemLocked('Revenue'))
            .toBe(true);
        await since('Filter_Freight Locked is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterItemLocked('Freight'))
            .toBe(true);
        await since('Filter_Row Count Locked is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterItemLocked('Row Count'))
            .toBe(true);

        await filterPanel.hoverFilterByName('Cost');
        await dossierPage.sleep(300);
        await takeScreenshotByElement(
            filterPanel.getFilterPanelWrapper(),
            'TC80914_MetricQualification',
            'Filter: Cost'
        );

        await filterPanel.hoverFilterByName('Revenue');
        await since('For revenue, Tooltip Text is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.getTooltipText())
            .toBe('Filter interactions are disabled.');

        await filterPanel.hoverFilterByName('Freight');
        await since('For freight, Tooltip Text is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.getTooltipText())
            .toBe('Filter interactions are disabled.');

        await filterPanel.hoverFilterByName('Row Count');
        await since('For row count, Tooltip Text is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.getTooltipText())
            .toBe('Filter interactions are disabled.');
    });

    it('[TC80914_04] [Lock Filter] Acceptance test for Disabling interactions with a filter in Library - VizSelector', async () => {
        await libraryPage.openDossier(dossier.name);
        // Check Visualization Filter
        await toc.openPageFromTocMenu({ chapterName: 'viz', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();
        await since('Filter_bar chart Locked is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterItemLocked('bar chart'))
            .toBe(true);
        await since('Filter_grid Locked is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterItemLocked('grid'))
            .toBe(true);
        await since('Filter_custom viz Locked is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterItemLocked('custom viz'))
            .toBe(true);

        await filterPanel.clickFilterByName('bar chart');
        await since('bar chart Range Details Panel Locked is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isVizFilterDetailsPanelLocked('bar chart'))
            .toBe(true);
        await since('bar chart Clear All disabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await chartVisualizationFilter.isClearAllDisabled())
            .toBe(true);
        await since('bar chart disable message is supposed to be #{expected}, instead we have #{actual}')
            .expect(await chartVisualizationFilter.getVizFilterLockMessageText())
            .toBe('Filter interactions are disabled.');
        await takeScreenshotByElement(
            chartVisualizationFilter.getVizFilterHeader(),
            'TC80914_VizSelector',
            'Filter: bar chart header'
        );

        await filterPanel.clickFilterByName('grid');
        await since('grid Details Panel Locked is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isVizFilterDetailsPanelLocked('grid'))
            .toBe(true);
        await since('grid Clear All disabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await chartVisualizationFilter.isClearAllDisabled())
            .toBe(true);
        await since('grid disable message is supposed to be #{expected}, instead we have #{actual}')
            .expect(await chartVisualizationFilter.getVizFilterLockMessageText())
            .toBe('Filter interactions are disabled.');

        await filterPanel.clickFilterByName('custom viz');
        await since('custom viz Details Panel Locked is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isVizFilterDetailsPanelLocked('custom viz'))
            .toBe(true);
        await since('custom viz Clear All disabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await chartVisualizationFilter.isClearAllDisabled())
            .toBe(true);
        await since('custom viz disable message is supposed to be #{expected}, instead we have #{actual}')
            .expect(await chartVisualizationFilter.getVizFilterLockMessageText())
            .toBe('Filter interactions are disabled.');
    });

    it('[TC833337] [Lock Filter] Validate Disabling interactions with a filter in Library - MDX', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: mdx,
        });
        await libraryPage.openDossier(mdx.name);
        await filterPanel.openFilterPanel();
        await since('Filter_Accounts Locked is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterItemLocked('Accounts'))
            .toBe(true);
        await dynamicFilter.openSecondaryPanel('Accounts');
        await takeScreenshotByElement(dynamicFilter.getSecondaryPanel(), 'TC833337', 'Filter_Accounts locked');
        await since('Filter_Accounts Secondary Panel Locked is supposed to be #{expected}, instead we have #{actual}')
            .expect(await dynamicFilter.isSecondaryPanelLocked())
            .toBe(true);
        await since('Filter_Accounts Branch Select Disabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await dynamicFilter.isBranchSelectionButtonDisabled('Balance Sheet'))
            .toBe(true);
        await since(
            'Filter_Accounts Level in Branch button presence is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await dynamicFilter.isLevelInBranchButtonPresent('Assets'))
            .toBe(false);
        //exand and collapse could be done
        await dynamicFilter.collapseElement('Balance Sheet');
        await dossierPage.sleep(1000);
        await dynamicFilter.expandElement('Balance Sheet');
        await dossierPage.sleep(1000);
    });
});

export const config = specConfiguration;
