import { customCredentials } from '../../../constants/index.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_prompt') };

describe('Object Prompt - Report Builder', () => {
    const objectAttrName = 'Choose the attributes of the report';
    const objectMetricName = 'Choose the metrics of the report';
    const metricQualName = 'Qualify on any metric';

    const dossier = {
        id: 'FAC74DF94F6B4287BD48EB937CDDA226',
        name: 'Dossier with Report Builder',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const browserWindow = {
        
        width: 1600,
        height: 1000,
    };
    const { credentials } = specConfiguration;
    let cart;

    let { loginPage, grid, promptObject, libraryPage, promptEditor, dossierPage } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);

        cart = promptObject.shoppingCart;
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        await resetDossierState({ credentials, dossier });
        await libraryPage.openDossierNoWait(dossier.name);
        await promptEditor.waitForEditor();
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC66977] Object prompt - Run dossier created based on report builder', async () => {
        // check the default UI
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC66977', 'ReportBuilderUI');
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(objectAttrName);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC66977', 'DefaultPromptSummary');

        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('Grid header count is supposed to be #{expected}, instead we have #{actual}')
            .expect(await grid.getHeaderCount('Visualization 1'))
            .toBe(5);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Customer Age' }))
            .toBe('68');

        //re-prompt, add/remove answers
        await promptEditor.reprompt();
        const objectAttr = await promptObject.getPromptByName(objectAttrName);
        const objectMetric = await promptObject.getPromptByName(objectMetricName);
        await cart.clickElmInSelectedList(objectAttr, 'Customer Address');
        await cart.removeSingle(objectAttr);
        await cart.clickElmInSelectedList(objectAttr, 'Customer Birth Date');
        await cart.removeSingle(objectAttr);
        await cart.clickElmInSelectedList(objectMetric, '% Customers bought Affinity Product');
        await cart.removeSingle(objectMetric);

        // add a qualification prompt answer
        await promptObject.selectPromptByIndex({ index: '4', promptName: 'Qualify on any metric' });
        const metricQual = await promptObject.getPromptByName(metricQualName);
        await cart.clickElmInAvailableList(metricQual, '$ on Hand');
        await cart.addSingle(metricQual);
        await cart.openConditionDropdown(metricQual, 1);
        await cart.selectCondition(metricQual, 'Less than');
        await cart.openMQFirstValue(metricQual, 1);
        await cart.inputValues(metricQual, '25000000');
        await cart.confirmValues(metricQual);

        // view summary and run
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(objectAttrName);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC66977', 'NewPromptSummary');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('Grid header count is supposed to be #{expected}, instead we have #{actual}')
            .expect(await grid.getHeaderCount('Visualization 1'))
            .toBe(2);
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(5);
        await since('The first element is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Customer Age' }))
            .toBe('19');
    });
});

export const config = specConfiguration;
