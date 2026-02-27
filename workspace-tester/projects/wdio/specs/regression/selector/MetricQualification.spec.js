import { customCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

const specConfiguration = { ...customCredentials('_selector') };
const { credentials } = specConfiguration;

const tutorialProject = {
    id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
    name: 'MicroStrategy Tutorial',
};
const tolerance = 0.2;

describe('Metric Qualification Selector', () => {
    const docProperty1 = {
        id: '37F8AC594944A31F0967D0A3F9EEEC07',
        name: 'AUTO_Metric Qualification_show title_Qualify on',
        project: tutorialProject,
    };

    const docFormat1 = {
        id: '73B1F0BB43398A38BEB8B280957141B4',
        name: 'AUTO_Metric Qualification_Alignment',
        project: tutorialProject,
    };

    const docFormat2 = {
        id: 'A16081E04B9041298AEEA6AE294A153C',
        name: 'AUTO_Metric Qualification_Color and lines',
        project: tutorialProject,
    };

    const docFormat3 = {
        id: '3A03FE0243D5E515C6AA80B61E1C93ED',
        name: 'AUTO_Metric Qualification_Font',
        project: tutorialProject,
    };

    const docsSourceAndTarget1 = {
        id: '903B670349CA23DE1E9C25AB9E84189F',
        name: 'AUTO_Metric Qualification_Source and Target',
        project: tutorialProject,
    };

    let { loginPage, selector, libraryPage, dossierPage, rsdPage, toc, rsdGrid } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC80359] Library | Metric Qualification selector - Property', async () => {
        await resetDossierState({ credentials, dossier: docProperty1 });
        await libraryPage.openUrl(tutorialProject.id, docProperty1.id);

        // Equals
        await selector.metricQualification.openPatternDropdown();
        await selector.metricQualification.selectNthItem(1, 'Equals');
        await selector.metricQualification.inputValue('4,265,043.4809');
        await since('Equals:  first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('Central');

        // Does not equal
        await selector.metricQualification.openPatternDropdown();
        await selector.metricQualification.selectNthItem(2, 'Does not equal');
        await selector.metricQualification.apply();
        await since('Does not equal:  first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('Mid-Atlantic');
        await takeScreenshotByElement(
            selector.metricQualification.getElement(),
            'TC80359',
            'MetricQualificationSelector_Expression_doesNotEqual'
        );

        // Greater than
        await selector.metricQualification.openPatternDropdown();
        await selector.metricQualification.selectNthItem(3, 'Greater than');
        await selector.metricQualification.apply();
        await since('Greater than:  first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('Northeast');

        // Greater than or equal to
        await selector.metricQualification.openPatternDropdown();
        await selector.metricQualification.selectNthItem(4, 'Greater than or equal to');
        await selector.metricQualification.apply();
        await since('Greater than or equal to: first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('Central');

        // Less than
        await selector.metricQualification.openPatternDropdown();
        await selector.metricQualification.selectNthItem(5, 'Less than');
        await selector.metricQualification.apply();
        await since('Less than: first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('Mid-Atlantic');

        // Less than or equal to
        await selector.metricQualification.openPatternDropdown();
        await selector.metricQualification.selectNthItem(6, 'Less than or equal to');
        await selector.metricQualification.apply();
        await since('Less than or equal to: first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('Central');
        await takeScreenshotByElement(
            selector.metricQualification.getElement(),
            'TC80359',
            'MetricQualificationSelector_Expression_lessThanOrEqual'
        );

        // Between (enter value1;value2)
        await selector.metricQualification.openPatternDropdown();
        await selector.metricQualification.selectNthItem(7, 'Between (enter value1;value2)');
        await selector.metricQualification.inputValue('2000000', 1);
        await selector.metricQualification.inputValue('4000000', 2);
        await since('Between (enter value1;value2): first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('Mid-Atlantic');

        // Not between (enter value1;value2)
        await selector.metricQualification.openPatternDropdown();
        await selector.metricQualification.selectNthItem(8, 'Not between (enter value1;value2)');
        await selector.metricQualification.apply();
        await since(
            'Not between (enter value1;value2): first grid element should be #{expected}, while we get #{actual}'
        )
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('Central');
        await takeScreenshotByElement(
            selector.metricQualification.getElement(),
            'TC80359',
            'MetricQualificationSelector_Expression_notBetween'
        );

        // In (enter value1;value2; ...;valueN)
        await selector.metricQualification.openPatternDropdown();
        await selector.metricQualification.selectNthItem(9, 'In (enter value1;value2; ...;valueN)');
        await selector.metricQualification.inputValue('4,265,043.4809;3,779,531.4745');
        await since(
            'In (enter value1;value2; ...;valueN): first grid element should be #{expected}, while we get #{actual}'
        )
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('Central');
        await takeScreenshotByElement(
            selector.metricQualification.getElement(),
            'TC80359',
            'MetricQualificationSelector_Expression_in'
        );

        // Not In (enter value1;value2; ...;valueN)
        await selector.metricQualification.openPatternDropdown();
        await selector.metricQualification.selectNthItem(10, 'Not In (enter value1;value2; ...;valueN)');
        await selector.metricQualification.apply();
        await since(
            'Not In (enter value1;value2; ...;valueN): first grid element should be #{expected}, while we get #{actual}'
        )
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('Northeast');

        // Is Null
        await selector.metricQualification.openPatternDropdown();
        await selector.metricQualification.selectNthItem(11, 'Is Null');
        await selector.metricQualification.apply();
        await takeScreenshotByElement(
            selector.metricQualification.getElement(),
            'TC80359',
            'MetricQualificationSelector_Expression_isNull'
        );

        // Is Not Null
        await selector.metricQualification.openPatternDropdown();
        await selector.metricQualification.selectNthItem(12, 'Is Not Null');
        await selector.metricQualification.apply();
        await since('Is Not Null: first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('Central');
    });

    it('[TC80360] Library | Metric Qualification selector - Foramt', async () => {
        // Alginment
        await resetDossierState({ credentials, dossier: docFormat1 });
        await libraryPage.openUrl(tutorialProject.id, docFormat1.id);
        await selector.metricQualification.openPatternDropdown();
        await selector.metricQualification.selectNthItem(5, 'Less than');
        await selector.metricQualification.apply();
        await since('Alginment: first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('Mid-Atlantic');
        await takeScreenshotByElement(
            rsdPage.getDocLayoutViewer(),
            'TC80360',
            'MetricQualificationSelector_Alignment_changeExpression',
            {
                tolerance: tolerance,
            }
        );

        // Color and lines
        await resetDossierState({ credentials, dossier: docFormat2 });
        await libraryPage.openUrl(tutorialProject.id, docFormat2.id);
        await selector.metricQualification.openPatternDropdown();
        await selector.metricQualification.selectNthItem(5, 'Less than');
        await selector.metricQualification.apply();
        await since('Color and lines: first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('Central');
        await takeScreenshotByElement(
            rsdPage.getDocLayoutViewer(),
            'TC80360',
            'MetricQualificationSelector_Lines_changeExpression',
            {
                tolerance: tolerance,
            }
        );

        // Font
        await resetDossierState({ credentials, dossier: docFormat3 });
        await libraryPage.openUrl(tutorialProject.id, docFormat3.id);
        await selector.metricQualification.openPatternDropdown();
        await selector.metricQualification.selectNthItem(5, 'Less than');
        await selector.metricQualification.apply();
        await since('Font: first grid element should be #{expected}, while we get #{actual}')
            .expect(await rsdGrid.getFirstGridCell())
            .toBe('Mid-Atlantic');
        await takeScreenshotByElement(
            rsdPage.getDocLayoutViewer(),
            'TC80360',
            'MetricQualificationSelector_Font_changeExpression',
            {
                tolerance: tolerance,
            }
        );
    });

    it('[TC80361] Library | Metric Qualification selector - Source and Target', async () => {
        await resetDossierState({ credentials, dossier: docsSourceAndTarget1 });
        await libraryPage.openUrl(tutorialProject.id, docsSourceAndTarget1.id);

        // No source
        const selector1 = rsdPage.findSelectorByName('NoSource');
        await selector1.metricQualification.apply();
        await since('No source: selected pattern text should be #{expected}, while we get #{actual}')
            .expect(await selector1.metricQualification.getSelectedPatternText())
            .toContain('Greater than or equal to');

        // No target
        const selector2 = rsdPage.findSelectorByName('NoTarget');
        await selector2.metricQualification.apply();

        // With source and target
        const selector3 = rsdPage.findSelectorByName('WithSourceAndTarget');
        await selector3.metricQualification.openPatternDropdown();
        await selector3.metricQualification.selectNthItem(5, 'Less than');
        await selector3.metricQualification.apply();
        await rsdPage.waitAllToBeLoaded();
        await since('With source and target: selected pattern text should be #{expected}, while we get #{actual}')
            .expect(await selector3.metricQualification.getSelectedPatternText())
            .toContain('Greater than or equal to');
    });

    it('[TC80362] Library | Metric Qualification selector - Manipulation', async () => {
        await resetDossierState({ credentials, dossier: docsSourceAndTarget1 });
        await libraryPage.openUrl(tutorialProject.id, docsSourceAndTarget1.id);
        const selector = rsdPage.findSelectorByName('WithSourceAndTarget');
        const title = selector.metricQualification.getTitle();

        // Value
        await selector.metricQualification.inputValue('2000000');
        await selector.metricQualification.apply();

        // Rank highest
        await title.clickTriageButton();
        await takeScreenshotByElement(
            title.getSelectorMenu(),
            'TC80362',
            'MetricQualificationSelector_Manipulation_rankHighest',
            {}
        );
        await title.clickMenuItem('Rank Highest');
        await selector.metricQualification.inputValue('3');
        await selector.metricQualification.apply();

        // Rank lowest
        await title.clickTriageButton();
        await title.clickMenuItem('Rank Lowest');
        await selector.metricQualification.inputValue('3');
        await selector.metricQualification.apply();

        // Rank % highest
        await title.clickTriageButton();
        await title.clickMenuItem('Rank % Highest');
        await selector.metricQualification.inputValue('30%');
        await selector.metricQualification.apply();

        // Rank % lowest
        await title.clickTriageButton();
        await title.clickMenuItem('Rank % Lowest');
        await selector.metricQualification.inputValue('30%');
        await selector.metricQualification.apply();
        await takeScreenshotByElement(
            selector.metricQualification.getElement(),
            'TC80362',
            'MetricQualificationSelector_Manipulation_rank%Lowest'
        );
    });
});

export const config = specConfiguration;
