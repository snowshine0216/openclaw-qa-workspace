import { customCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

const specConfiguration = { ...customCredentials('_selector') };
const { credentials } = specConfiguration;

const tutorialProject = {
    id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
    name: 'MicroStrategy Tutorial',
};

describe('Metric slider Selector', () => {
    const docProperty1 = {
        id: 'FAA3E743463B938C20232C8F93890451',
        name: 'AUTO_Qualify on_Exclude_Metric Slider',
        project: tutorialProject,
    };
    const docFormat1 = {
        id: '19278E7D45627D7C3223EAA3B6D4DEE0',
        name: 'AUTO_Alignment_Effects_Metric Slider',
        project: tutorialProject,
    };
    const docFormat2 = {
        id: 'E008186F4E869DCE3707AB9809C3AD3B',
        name: 'AUTO_Fill Color_Border_Metric Slider',
        project: tutorialProject,
    };
    const docsSourceAndTarget1 = {
        id: '8A7040454933908ABFD00296A24041B3',
        name: 'AUTO_No Source_Metric condition',
        project: tutorialProject,
    };
    const docsSourceAndTarget2 = {
        id: '6BC76E304ED4B55EAC914F882F29CABF',
        name: 'AUTO_No Target_Grid and graph as Target',
        project: tutorialProject,
    };
    const docTooltip = {
        id: 'F6388500474BFCC5150A41A8395F0A57',
        name: 'Metric Slider with grid with percentage',
        project: tutorialProject,
    };

    let { loginPage, selector, libraryPage, dossierPage, rsdPage, rsdGrid, toc } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC80363] Library | Metric slider selector - Property', async () => {
        await resetDossierState({ credentials, dossier: docProperty1 });
        await libraryPage.openUrl(tutorialProject.id, docProperty1.id);

        // Exclude
        await toc.openPageFromTocMenu({ chapterName: 'Exclude' });
        const title = selector.metricSlider.getTitle();
        await selector.metricSlider.dragSlider({ x: 150, y: 0 }, 'bottom');
        await since('Exclude mode: summary shoud be #{expected}, while we get #{actual}')
            .expect(await selector.metricSlider.getSliderSummary())
            .toBe('Not between 13% and 48%');
        await title.clickTriageButton();
        await since('Exclude mode: Exclude should be selected on qualification menu, while we get #{actual}')
            .expect(await title.isItemSelected('Exclude'))
            .toBe(true);
        await takeScreenshotByElement(title.getSelectorMenu(), 'TC80363', 'MetricSliderSelector_Property_Exclude');

        // Qualify on
        await toc.openPageFromTocMenu({ chapterName: 'Qualification' });
        const selector1 = rsdPage.findSelectorByName('RankValue');
        await since('Qualification on value : summary shoud be #{expected}, while we get #{actual}')
            .expect(await selector1.metricSlider.getSliderSummary())
            .toBe('2.2M - 5.1M');
        const selector2 = rsdPage.findSelectorByName('RankLowest');
        await since('Qualification on Rank lowest : summary shoud be #{expected}, while we get #{actual}')
            .expect(await selector2.metricSlider.getSliderSummary())
            .toBe('Rank exclude bottom 4');
        const selector3 = rsdPage.findSelectorByName('Rank%Highest');
        await since('Qualification on Rank % Highest : summary shoud be #{expected}, while we get #{actual}')
            .expect(await selector3.metricSlider.getSliderSummary())
            .toBe('Between 24% and 54%');
        await since('Qualification on Rank % Highest : first grid cell shoud be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('Central');
        await takeScreenshotByElement(
            selector1.metricSlider.getContent(),
            'TC80363',
            'MetricSliderSelector_Property_QualifyOn1'
        );
        await takeScreenshotByElement(
            selector2.metricSlider.getContent(),
            'TC80363',
            'MetricSliderSelector_Property_QualifyOn2'
        );
        await takeScreenshotByElement(
            selector3.metricSlider.getContent(),
            'TC80363',
            'MetricSliderSelector_Property_QualifyOn3'
        );
    });

    it('[TC80364] Library | Metric slider selector - Foramt', async () => {
        const tolerance = 0.5;

        // Alignment
        await resetDossierState({ credentials, dossier: docFormat1 });
        await libraryPage.openUrl(tutorialProject.id, docFormat1.id);
        await toc.openPageFromTocMenu({ chapterName: 'Alignment' });
        await selector.metricSlider.dragSlider({ x: 50, y: 0 }, 'top');
        await since('Alignment: summary shoud be #{expected}, while we get #{actual}')
            .expect(await selector.metricSlider.getSliderSummary())
            .toBe('≥ 2.1M');
        await takeScreenshotByElement(
            rsdPage.getDocLayoutViewer(),
            'TC80364',
            'MetricSliderSelector_Format_Alignment_dragSlider',
            {
                tolerance: tolerance,
            }
        );

        // Effects
        await toc.openPageFromTocMenu({ chapterName: 'Effects' });
        await selector.metricSlider.dragSlider({ x: 150, y: 0 }, 'bottom');
        await since('Effects: summary shoud be #{expected}, while we get #{actual}')
            .expect(await selector.metricSlider.getSliderSummary())
            .toBe('3.2M - 4.9M');
        await takeScreenshotByElement(
            rsdPage.getDocLayoutViewer(),
            'TC80364',
            'MetricSliderSelector_Format_Effects_dragSlider',
            {
                tolerance: tolerance,
            }
        );

        // Color and lines
        await resetDossierState({ credentials, dossier: docFormat2 });
        await libraryPage.openUrl(tutorialProject.id, docFormat2.id);
        await selector.metricSlider.dragSlider({ x: 50, y: 0 }, 'bottom');
        await since('Color and lines: summary shoud be #{expected}, while we get #{actual}')
            .expect(await selector.metricSlider.getSliderSummary())
            .toBe('≤ 1.9M');
        await takeScreenshotByElement(
            rsdPage.getDocLayoutViewer(),
            'TC80364',
            'MetricSliderSelector_Format_ColorAndLines_dragSlider',
            {
                tolerance: tolerance,
            }
        );
    });

    it('[TC80365] Library | Metric slider selector - Source and Target', async () => {
        // with source - metric condition
        await resetDossierState({ credentials, dossier: docsSourceAndTarget1 });
        await libraryPage.openUrl(tutorialProject.id, docsSourceAndTarget1.id);
        const selector1 = rsdPage.findSelectorByName('WithSource');
        await selector1.metricSlider.dragSlider({ x: 100, y: 0 }, 'bottom');
        await since('With source - metric condition: summary shoud be #{expected}, while we get #{actual}')
            .expect(await selector1.metricSlider.getSliderSummary())
            .toBe('2.2M - 6.2M');

        // No source
        await takeScreenshotByElement(
            selector1.metricSlider.getContent(),
            'TC80365',
            'MetricSliderSelector_sourceAndTarget_noSource_metricCondition'
        );

        // with target - grid and graph
        await resetDossierState({ credentials, dossier: docsSourceAndTarget2 });
        await libraryPage.openUrl(tutorialProject.id, docsSourceAndTarget2.id);
        const selector2 = rsdPage.findSelectorByName('ObjectAsTarget');
        await selector2.metricSlider.dragSlider({ x: 50, y: 0 }, 'top');
        await since('With target - target grid and graph: summary shoud be #{expected}, while we get #{actual}')
            .expect(await selector2.metricSlider.getSliderSummary())
            .toContain('2.9M');
        await takeScreenshotByElement(
            selector2.metricSlider.getContent(),
            'TC80365',
            'MetricSliderSelector_sourceAndTarget_noTarget_targetGridandGraph'
        );
    });

    it('[TC80366] Library | Metric slider selector - Manipulation', async () => {
        await resetDossierState({ credentials, dossier: docsSourceAndTarget2 });
        await libraryPage.openUrl(tutorialProject.id, docsSourceAndTarget2.id);
        const selector = rsdPage.findSelectorByName('ObjectAsTarget');

        // drag slider
        await selector.metricSlider.dragSlider({ x: 350, y: 0 }, 'bottom');
        await since('Drag slider: summary shoud be #{expected}, while we get #{actual}')
            .expect(await selector.metricSlider.getSliderSummary())
            .toBe('977.7K - 4M');

        // input data
        await selector.metricSlider.inputToStartPoint('300000');
        await rsdPage.waitAllToBeLoaded();
        await since('Input data: summary shoud be #{expected}, while we get #{actual}')
            .expect(await selector.metricSlider.getSliderSummary())
            .toBe('300K - 4M');

        // change include/exclude mode
        const title = selector.metricSlider.getTitle();
        await title.clickTriageButton();
        await title.clickMenuItem('Exclude');
        await rsdPage.waitAllToBeLoaded();
        await since('Change mode: summary shoud be #{expected}, while we get #{actual}')
            .expect(await selector.metricSlider.getSliderSummary())
            .toBe('Not 300K - 4M');

        // change qualificaiton value
        await title.clickTriageButton();
        await title.clickMenuItem('Rank Highest');
        await rsdPage.waitAllToBeLoaded();
        await since('Change qualification value - Rank Highest: summary shoud be #{expected}, while we get #{actual}')
            .expect(await selector.metricSlider.getSliderSummary())
            .toBe('All');
        await selector.metricSlider.inputToEndPoint('3');
        await since(
            'Change qualification value - Rank Highest - input data : summary shoud be #{expected}, while we get #{actual}'
        )
            .expect(await selector.metricSlider.getSliderSummary())
            .toBe('Rank exclude top 3');

        await title.clickTriageButton();
        await title.clickMenuItem('Rank % Lowest');
        await rsdPage.waitAllToBeLoaded();
        await since('Change qualification value - Rank % Lowest: summary shoud be #{expected}, while we get #{actual}')
            .expect(await selector.metricSlider.getSliderSummary())
            .toBe('All');
    });

    it('[TC80367] Library | Metric slider selector - Tooltip of large percentage', async () => {
        const expectedStartTooltip = '12%';
        const expectedEndTooltip = '358%';
        await resetDossierState({ credentials, dossier: docTooltip });
        await libraryPage.openUrl(tutorialProject.id, docTooltip.id);
        await rsdPage.waitAllToBeLoaded();

        // Check tooltip
        await since('The start point tooltip should be #{expected}, while we get #{actual} ')
            .expect(await selector.metricSlider.getStartTooltipText())
            .toEqual(expectedStartTooltip);
        await since('The end point tooltip should be #{expected}, while we get #{actual} ')
            .expect(await selector.metricSlider.getEndTooltipText())
            .toEqual(expectedEndTooltip);

        // Input '-1' to the start point
        await selector.metricSlider.inputToStartPoint('-1');
        await rsdPage.waitAllToBeLoaded();
        await since('Input -1, the start point tooltip should be #{expected}, while we get #{actual} ')
            .expect(await selector.metricSlider.getStartTooltipText())
            .toEqual('-100%');
        // Input '5' to the end point
        await selector.metricSlider.inputToEndPoint('5');
        await rsdPage.waitAllToBeLoaded();
        // Input '1' to the start point
        await selector.metricSlider.inputToStartPoint('1');
        await rsdPage.waitAllToBeLoaded();
        await since('Input 1, the start point tooltip should be #{expected}, while we get #{actual} ')
            .expect(await selector.metricSlider.getStartTooltipText())
            .toEqual('100%');
        await since('Input 1, the grid cell should be #{expected}, while we get #{actual} ')
            .expect(await rsdGrid.getGridCellInRow(2, 6))
            .toEqual('154%');
    });
});
export const config = specConfiguration;
