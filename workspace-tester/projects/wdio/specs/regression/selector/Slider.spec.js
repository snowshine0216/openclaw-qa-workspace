import { customCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

const specConfiguration = { ...customCredentials('_selector') };
const { credentials } = specConfiguration;

const tutorialProject = {
    id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
    name: 'MicroStrategy Tutorial',
};

describe('Slider Selector', () => {
    const docProperty1 = {
        id: 'E349011F4E9492CF4AD15E87CEFB46C4',
        name: 'AUTO_Slider_allow multiple_Exclude',
        project: tutorialProject,
    };
    const docProperty2 = {
        id: 'FF2117D845599A5B99E1998EE6B20A92',
        name: 'AUTO_Slider_not allow multiple_with total_use last 1',
        project: tutorialProject,
    };
    const docProperty3 = {
        id: 'FDDD8FBC4CFFBA12D92496935A8279F8',
        name: 'Auto_Slider_show title_orientation',
        project: tutorialProject,
    };
    const docFormat1 = {
        id: '5872068140B13B759009B9A4D628FD2D',
        name: 'AUTO_Alignment_Slider',
        project: tutorialProject,
    };
    const docFormat2 = {
        id: '15BDF55B46AF01EEA47D978D92D56AE9',
        name: 'AUTO_Color and lines_Slider',
        project: tutorialProject,
    };
    const docsSourceAndTarget1 = {
        id: '8106E8CB40F085B5F16898AD1EAAF166',
        name: 'AUTO_No Source_Select Metric',
        project: tutorialProject,
    };
    const docsSourceAndTarget2 = {
        id: 'A72DA647437F93BF5F5541B14CF3C431',
        name: 'AUTO_No Target_Dataset as Target',
        project: tutorialProject,
    };

    let { loginPage, selector, libraryPage, dossierPage, rsdPage, toc, rsdGrid } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC80401] Library | Slider selector - Property', async () => {
        // Exclude
        await resetDossierState({ credentials, dossier: docProperty1 });
        await libraryPage.openUrl(tutorialProject.id, docProperty1.id);
        await selector.slider.dragSlider({ x: 73, y: 0 }, 'bottom');
        await since('Exclude mode: tooltip shoud be #{expected}, while we get #{actual}')
            .expect(await selector.slider.getEndTooltipText())
            .toBe(`From: ''Mid-Atlantic'' To: ''South''`);

        // allow multiple selection
        await selector.slider.dragSlider({ x: 50, y: 0 }, 'top');
        await since('Allow multiple slection: tooltip shoud be #{expected}, while we get #{actual}')
            .expect(await selector.slider.getStartTooltipText())
            .toBe(`'South'`);
        await takeScreenshotByElement(
            selector.slider.getContent(),
            'TC80401',
            'SliderSelector_Property_Exclude_AllowMultiple'
        );

        // not allow multiple selection
        await resetDossierState({ credentials, dossier: docProperty2 });
        await libraryPage.openUrl(tutorialProject.id, docProperty2.id);
        await since('Snot allow multiple selection: first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('Web');

        // use last 1
        await since('Use last: tooltip shoud be #{expected}, while we get #{actual}')
            .expect(await selector.slider.getSingleTooltipText())
            .toBe(`'Web'`);

        // show total
        await selector.slider.dragSlider({ x: 250, y: 0 });
        await since('Show total: tooltip shoud be #{expected}, while we get #{actual}')
            .expect(await selector.slider.getSingleTooltipText())
            .toBe(`'Total'`);
        await since('Show total: first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('Total');
        await takeScreenshotByElement(selector.slider.getContent(), 'TC80401', 'SliderSelector_Property_ShowTotal');

        // orientation: vertical, horizontal
        await resetDossierState({ credentials, dossier: docProperty3 });
        await libraryPage.openUrl(tutorialProject.id, docProperty3.id);
        const verticalSelector = rsdPage.findSelectorByName('VerticalRegion');
        await verticalSelector.slider.dragSlider({ x: 100, y: 0 }, 'bottom');
        await since('Orientation: tooltip shoud be #{expected}, while we get #{actual}')
            .expect(await verticalSelector.slider.getSingleTooltipText())
            .toBe(`From: ''Central'' To: ''Northwest''`);

        // show title
        await takeScreenshotByElement(
            verticalSelector.slider.getContent(),
            'TC80401',
            'SliderSelector_Property_ShowTitle_Orientation'
        );
    });

    it('[TC80402] Library | Slider selector - Foramt', async () => {
        const tolerance = 0.3;
        // Alignment
        await resetDossierState({ credentials, dossier: docFormat1 });
        await libraryPage.openUrl(tutorialProject.id, docFormat1.id);
        await takeScreenshotByElement(
            rsdPage.getDocLayoutViewer(),
            'TC80402',
            'SliderSelector_Format_Alignment_initialRendering',
            {
                tolerance: tolerance,
            }
        );
        await selector.slider.dragSlider({ x: 50, y: 0 }, 'top');
        await since('Alignment: tooltip shoud be #{expected}, while we get #{actual}')
            .expect(await selector.slider.getSingleTooltipText())
            .toBe(`'Electronics'`);

        // Colors
        await resetDossierState({ credentials, dossier: docFormat2 });
        await libraryPage.openUrl(tutorialProject.id, docFormat2.id);
        await toc.openPageFromTocMenu({ chapterName: 'Colors' });
        await selector.slider.dragSlider({ x: 50, y: 0 }, 'bottom');
        await since('Colors: tooltip shoud be #{expected}, while we get #{actual}')
            .expect(await selector.slider.getSingleTooltipText())
            .toBe(`From: ''Central'' To: ''Southeast''`);
        await takeScreenshotByElement(
            rsdPage.getDocLayoutViewer(),
            'TC80402',
            'SliderSelector_Format_Colors_dragSlider',
            {
                tolerance: tolerance,
            }
        );

        // Lines
        await toc.openPageFromTocMenu({ chapterName: 'Lines' });
        await selector.slider.dragSlider({ x: 50, y: 0 }, 'bottom');
        await since('Lines: tooltip shoud be #{expected}, while we get #{actual}')
            .expect(await selector.slider.getSingleTooltipText())
            .toBe(`From: ''Central'' To: ''Southeast''`);
        await takeScreenshotByElement(
            rsdPage.getDocLayoutViewer(),
            'TC80402',
            'SliderSelector_Format_Lines_dragSlider',
            {
                tolerance: tolerance,
            }
        );
    });

    it('[TC80403] Library | Slider selector - Source and Target', async () => {
        // with source - select metric
        await resetDossierState({ credentials, dossier: docsSourceAndTarget1 });
        await libraryPage.openUrl(tutorialProject.id, docsSourceAndTarget1.id);
        const selector1 = rsdPage.findSelectorByName('WithSource');
        await selector1.slider.dragSlider({ x: 100, y: 0 }, 'bottom');
        await since('With source - select metric: tooltip shoud be #{expected}, while we get #{actual}')
            .expect(await selector1.slider.getEndTooltipText())
            .toBe(`From: ''Revenue'' To: ''Profit''`);
        await since('With source - select metric:  Revenue display should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.isCellDisplayed('Revenue'))
            .toBe(true);

        // No source
        await takeScreenshotByElement(
            selector1.slider.getContent(),
            'TC80403',
            'SliderSelector_sourceAndTarget_noSource_selectMetric'
        );

        // with target - dataset
        await resetDossierState({ credentials, dossier: docsSourceAndTarget2 });
        await libraryPage.openUrl(tutorialProject.id, docsSourceAndTarget2.id);
        const selector2 = rsdPage.findSelectorByName('DatasetAsTarget');

        await selector2.slider.dragSlider({ x: 50, y: 0 });
        await selector2.sleep(3000);
        await since('With target - target dataset: tooltip shoud be #{expected}, while we get #{actual}')
            .expect(await selector2.slider.getSingleTooltipText())
            .toBe(`'Cost'`);

        // No target
        await takeScreenshotByElement(
            selector2.slider.getContent(),
            'TC80403',
            'SliderSelector_sourceAndTarget_noTarget_targetDataset'
        );
    });

    it('[TC80404] Library | Slider selector - Manipulation', async () => {
        await resetDossierState({ credentials, dossier: docsSourceAndTarget1 });
        await libraryPage.openUrl(tutorialProject.id, docsSourceAndTarget1.id);
        const selector = rsdPage.findSelectorByName('WithSource');

        // click to move slider automatically
        await selector.slider.clickSliderBar({ x: 100, y: 0 });
        await since('Manipulation - click slider: tooltip shoud be #{expected}, while we get #{actual}')
            .expect(await selector.slider.getEndTooltipText())
            .toBe(`From: ''Cost'' To: ''Profit''`);
        await since('Manipulation - click slider:  Profit display should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.isCellDisplayed('Profit'))
            .toBe(true);

        // drag slider
        await selector.slider.dragSlider({ x: -100, y: 0 }, 'top');
        await since('Manipulation - drag slider: tooltip shoud be #{expected}, while we get #{actual}')
            .expect(await selector.slider.getEndTooltipText())
            .toBe(`From: ''Revenue'' To: ''Profit''`);
        await since('Manipulation - drag slider:  Revenue display should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.isCellDisplayed('Revenue'))
            .toBe(true);
    });
});
export const config = specConfiguration;
