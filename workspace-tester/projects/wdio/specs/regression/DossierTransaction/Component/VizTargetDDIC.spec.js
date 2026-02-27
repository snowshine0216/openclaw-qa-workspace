import { customCredentials } from '../../../../constants/index.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import { SelectTargetInLayersPanel } from '../../../../pageObjects/authoring/SelectTargetInLayersPanel.ts';

const specConfiguration = { ...customCredentials('', 'abcd1234') };

describe('Visualization target ddic Test - component level', () => {
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    const { credentials } = specConfiguration;

    let { loginPage, libraryPage, baseContainer } = browsers.pageObj1;
    const selectTargetInLayersPanel = new SelectTargetInLayersPanel();

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(credentials);
    });

    beforeEach(async () => {
        await libraryPage.editDossierByUrl({
            projectId: '31CCC6A6449A61C1234BC3B22ED79E56',
            dossierId: '8E295E459344AD85E5271D84BFBEA4A8', // <<DDIC_VizSelector_Component>>
        });
    });

    afterEach(async () => {});

    it('[TC98287_1] Grid as source', async () => {
        await baseContainer.selectTargetVisualizations('Source Grid');

        // Tap target viz
        await baseContainer.clickContainer('SQL TXN');
        await baseContainer.clickContainer('Paused TXN');
        await baseContainer.clickContainer('No TXN');
        await baseContainer.clickContainer('No-DDIC');

        await since('DDIC picker should appear on the viz "SQL TXN"')
            .expect(await selectTargetInLayersPanel.hasDDICcandidatePicker('SQL TXN'))
            .toBe(true);

        await since('DDIC picker should appear on the viz "Paused TXN"')
            .expect(await selectTargetInLayersPanel.hasDDICcandidatePicker('Paused TXN'))
            .toBe(true);

        await since('DDIC picker should not appear on the viz "No TXN"')
            .expect(await selectTargetInLayersPanel.hasDDICcandidatePicker('No TXN'))
            .toBe(false);

        await since('DDIC picker should not appear on the viz "No DDIC"')
            .expect(await selectTargetInLayersPanel.hasDDICcandidatePicker('No-DDIC'))
            .toBe(false);

        // Select some ddic
        await selectTargetInLayersPanel.openDDICdropdown('SQL TXN');
        await selectTargetInLayersPanel.checkElementUnderDDICdropdown(['Username@ID', 'Age']);
        await selectTargetInLayersPanel.clickOKButtonInDropdown(1);

        await selectTargetInLayersPanel.openDDICdropdown('Paused TXN');
        await selectTargetInLayersPanel.checkElementUnderDDICdropdown(['Notes@ID', 'Salary']);
        await selectTargetInLayersPanel.clickOKButtonInDropdown(2);

        // Apply
        await selectTargetInLayersPanel.applyButtonForSelectTarget();

        // Enter "edit target" mode
        await baseContainer.editTargetVisualizations('Source Grid');

        await since('DDIC picker should appear on the viz "SQL TXN"')
            .expect(await selectTargetInLayersPanel.hasDDICcandidatePicker('SQL TXN'))
            .toBe(true);

        await since('DDIC picker should appear on the viz "Paused TXN"')
            .expect(await selectTargetInLayersPanel.hasDDICcandidatePicker('Paused TXN'))
            .toBe(true);

        await since('DDIC picker should not appear on the viz "No TXN"')
            .expect(await selectTargetInLayersPanel.hasDDICcandidatePicker('No TXN'))
            .toBe(false);

        await since('DDIC picker should not appear on the viz "No DDIC"')
            .expect(await selectTargetInLayersPanel.hasDDICcandidatePicker('No-DDIC'))
            .toBe(false);

        await since('Check select DDIC items ont the viz "SQL TXN"')
            .expect(await selectTargetInLayersPanel.getDDICPullDownText('SQL TXN'))
            .toBe('Username@ID, Age');

        await since('Check select DDIC items ont the viz "Paused TXN"')
            .expect(await selectTargetInLayersPanel.getDDICPullDownText('Paused TXN'))
            .toBe('Notes@ID, Salary');
    });

    it('[TC98287_2] Map layer1 as source', async () => {
        // Enter "select target" mode
        await baseContainer.selectTargetVisualizations('Source Mapbox with 2 layers');

        // Tap target viz
        await baseContainer.clickContainer('SQL TXN');
        await baseContainer.clickContainer('Paused TXN');
        await baseContainer.clickContainer('No TXN');
        await baseContainer.clickContainer('No-DDIC');

        await since('DDIC picker should appear on the viz "SQL TXN"')
            .expect(await selectTargetInLayersPanel.hasDDICcandidatePicker('SQL TXN'))
            .toBe(true);

        await since('DDIC picker should appear on the viz "Paused TXN"')
            .expect(await selectTargetInLayersPanel.hasDDICcandidatePicker('Paused TXN'))
            .toBe(true);

        await since('DDIC picker should not appear on the viz "No TXN"')
            .expect(await selectTargetInLayersPanel.hasDDICcandidatePicker('No TXN'))
            .toBe(false);

        await since('DDIC picker should not appear on the viz "No DDIC"')
            .expect(await selectTargetInLayersPanel.hasDDICcandidatePicker('No-DDIC'))
            .toBe(false);

        // Select some ddic
        await selectTargetInLayersPanel.openDDICdropdown('SQL TXN');
        await selectTargetInLayersPanel.checkElementUnderDDICdropdown(['Username@ID', 'Notes@ID']);
        await selectTargetInLayersPanel.clickOKButtonInDropdown(1);

        // Apply
        await selectTargetInLayersPanel.applyButtonForSelectTarget();

        // Enter "edit target" mode
        await baseContainer.editTargetVisualizations('Source Mapbox with 2 layers');

        await since('DDIC picker should appear on the viz "SQL TXN"')
            .expect(await selectTargetInLayersPanel.hasDDICcandidatePicker('SQL TXN'))
            .toBe(true);

        await since('DDIC picker should appear on the viz "Paused TXN"')
            .expect(await selectTargetInLayersPanel.hasDDICcandidatePicker('Paused TXN'))
            .toBe(true);

        await since('DDIC picker should not appear on the viz "No TXN"')
            .expect(await selectTargetInLayersPanel.hasDDICcandidatePicker('No TXN'))
            .toBe(false);

        await since('DDIC picker should not appear on the viz "No DDIC"')
            .expect(await selectTargetInLayersPanel.hasDDICcandidatePicker('No-DDIC'))
            .toBe(false);

        await since('Check select DDIC items ont the viz "SQL TXN"')
            .expect(await selectTargetInLayersPanel.getDDICPullDownText('SQL TXN'))
            .toBe('Username@ID, Notes@ID');

        await since('Check select DDIC items ont the viz "Paused TXN"')
            .expect(await selectTargetInLayersPanel.getDDICPullDownText('Paused TXN'))
            .toBe('');
    });

    it('[TC98287_3] Map layer2 as source', async () => {
        // Enter "select target" mode
        await baseContainer.selectTargetVisualizations('Source Mapbox with 2 layers');

        await selectTargetInLayersPanel.openLayerSelection();

        // Select layer 2
        await selectTargetInLayersPanel.selectNewLayer(1);

        // Tap target viz
        await baseContainer.clickContainer('SQL TXN');
        await baseContainer.clickContainer('Paused TXN');
        await baseContainer.clickContainer('No TXN');
        await baseContainer.clickContainer('No-DDIC');

        await since('DDIC picker should appear on the viz "SQL TXN"')
            .expect(await selectTargetInLayersPanel.hasDDICcandidatePicker('SQL TXN'))
            .toBe(true);

        await since('DDIC picker should appear on the viz "Paused TXN"')
            .expect(await selectTargetInLayersPanel.hasDDICcandidatePicker('Paused TXN'))
            .toBe(true);

        await since('DDIC picker should not appear on the viz "No TXN"')
            .expect(await selectTargetInLayersPanel.hasDDICcandidatePicker('No TXN'))
            .toBe(false);

        await since('DDIC picker should not appear on the viz "No DDIC"')
            .expect(await selectTargetInLayersPanel.hasDDICcandidatePicker('No-DDIC'))
            .toBe(false);

        // Select some ddic
        await selectTargetInLayersPanel.openDDICdropdown('SQL TXN');
        await selectTargetInLayersPanel.checkElementUnderDDICdropdown(['Username@ID', 'Notes@ID']);
        await selectTargetInLayersPanel.clickOKButtonInDropdown(1);

        // Dismiss and reopen
        await baseContainer.clickContainerByScript('SQL TXN');
        await baseContainer.clickContainer('SQL TXN');

        // Apply
        await selectTargetInLayersPanel.applyButtonForSelectTarget();

        // Enter "edit target" mode
        await baseContainer.editTargetVisualizations('Source Mapbox with 2 layers');

        await since('DDIC picker should appear on the viz "SQL TXN"')
            .expect(await selectTargetInLayersPanel.hasDDICcandidatePicker('SQL TXN'))
            .toBe(true);

        await since('DDIC picker should appear on the viz "Paused TXN"')
            .expect(await selectTargetInLayersPanel.hasDDICcandidatePicker('Paused TXN'))
            .toBe(true);

        await since('DDIC picker should not appear on the viz "No TXN"')
            .expect(await selectTargetInLayersPanel.hasDDICcandidatePicker('No TXN'))
            .toBe(false);

        await since('DDIC picker should not appear on the viz "No DDIC"')
            .expect(await selectTargetInLayersPanel.hasDDICcandidatePicker('No-DDIC'))
            .toBe(false);

        await since('Check select DDIC items ont the viz "SQL TXN"')
            .expect(await selectTargetInLayersPanel.getDDICPullDownText('SQL TXN'))
            .toBe('Username@ID, Notes@ID');

        await since('Check select DDIC items ont the viz "Paused TXN"')
            .expect(await selectTargetInLayersPanel.getDDICPullDownText('Paused TXN'))
            .toBe('');
    });
});
export const config = specConfiguration;
