import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import * as gridConstants from '../../../constants/grid.js';

//npm run regression -- --baseUrl=https://mci-1u056-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --spec 'specs/regression/classicGrid/NormalGrid_CopyCell.spec.js'
describe('Normal Grid Copy Cells, Copy URL and Copy Rows', () => {
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    beforeAll(async () => {
        await loginPage.login(gridConstants.gridUser);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {});

    let {
        libraryPage,
        vizPanelForGrid,
        loginPage,
        agGridVisualization,
    } = browsers.pageObj1;

    it('[TC64355_1] Copy Cell ', async () => {
         // Edit dossier by its ID "91696EC211EA9BE72E5A0080EFB54080"
         // New MicroStrategy Tutorials > Shared Reports > Automation Objects > Normal Grid > Copy Cell Grid
         await libraryPage.editDossierByUrl({
             projectId: gridConstants.Grid_CopyCell.project.id,
             dossierId: gridConstants.Grid_CopyCell.id,
         });
        //  # Copy Cell - Only one cell is selected
        //  When I select elements "Sunday" of object "" on grid visualization "Visualization 1"
        await vizPanelForGrid.selectMultipleElements('Sunday', 'Visualization 1');
        //  And I right click on element "Sunday" and select "Copy Cell" from visualization "Visualization 1"
        await vizPanelForGrid.selectContextMenuOptionFromElement(
            'Sunday',
            'Copy Cell',
            'Visualization 1'
        );
        let expectedContent = `Sunday`;
        await since('The copied content should be #{expected}, while we got #{actual}')
            .expect(JSON.stringify(await agGridVisualization.getClipboardText()))
            .toBe(JSON.stringify(expectedContent));

        await libraryPage.editDossierByUrl({
            projectId: gridConstants.Grid_CopyCell.project.id,
            dossierId: gridConstants.Grid_CopyCell.id,
        });
        // # Copy Cells - Multiple cells are selected which are in same row from Attribute
        // When I select elements "January, US Airways Inc." of object "" on grid visualization "Visualization 1"
        await vizPanelForGrid.selectMultipleElements('January, US Airways Inc.', 'Visualization 1');
        // And I right click on element "January" and select "Copy Cells" from visualization "Visualization 1"
        await vizPanelForGrid.selectContextMenuOptionFromElement(
            'January',
            'Copy Cells',
            'Visualization 1'
        );
        let expectedContent2 = `January\tUS Airways Inc.`;
        await since('The copied content should be #{expected}, while we got #{actual}')
            .expect(JSON.stringify(await agGridVisualization.getClipboardText()))
            .toBe(JSON.stringify(expectedContent2));

        await libraryPage.editDossierByUrl({
            projectId: gridConstants.Grid_CopyCell.project.id,
            dossierId: gridConstants.Grid_CopyCell.id,
        });
        // # Copy Cells - Multiple cells are selected which are in different rows from Attribute
        // When I select elements "2009, Monday, Delta Air Lines Inc." of object "" on grid visualization "Visualization 1"
        await vizPanelForGrid.selectMultipleElements('2009, Monday, Delta Air Lines Inc.', 'Visualization 1');
        // And I right click on element "2009" and select "Copy Cells" from visualization "Visualization 1"
        await vizPanelForGrid.selectContextMenuOptionFromElement(
            '2009',
            'Copy Cells',
            'Visualization 1'
        );
        // And I replace textbox text of "Text1" with clipboard data       
        // Then I should see the Text Container "Text1" with content as
        // """
        // 2009  Delta Air Lines Inc.
        // 2009 Monday 
        // """
        let expectedContent3 = `2009\t\tDelta Air Lines Inc.\n2009\tMonday\t`;
        await since('The copied content should be #{expected}, while we got #{actual}')
            .expect(JSON.stringify(await agGridVisualization.getClipboardText()))
            .toBe(JSON.stringify(expectedContent3));

        await libraryPage.editDossierByUrl({
            projectId: gridConstants.Grid_CopyCell.project.id,
            dossierId: gridConstants.Grid_CopyCell.id,
        });
        // # Copy Cells - Multiple cells are selected which are in different rows from Metric
        // When I select elements "835.81, 151, 140, 391.00" of object "" on grid visualization "Visualization 1"
        await vizPanelForGrid.selectMultipleElements('835.81, 151, 140, 391.00', 'Visualization 1');
        // And I right click on element "835.81" and select "Copy Cells" from visualization "Visualization 1"
        await vizPanelForGrid.selectContextMenuOptionFromElement(
            '835.81',
            'Copy Cells',
            'Visualization 1'
        );
        // And I replace textbox text of "Text1" with clipboard data   
        // Then I should see the Text Container "Text1" with content as
        // """
        //  835.81 
        // 151  
        //   140
        //  391.00 
        // """
        let expectedContent4 = `\t835.81\t\n151\t\t\n\t\t140\n\t391.00\t`;
        await since('The copied content should be #{expected}, while we got #{actual}')
            .expect(JSON.stringify(await agGridVisualization.getClipboardText()))
            .toBe(JSON.stringify(expectedContent4));
    });

    it('[TC64355_2] Copy URL ', async () => {
        // Edit dossier by its ID "CD05E6DA11EA9BA22E5A0080EFE5A283"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > Normal Grid > Copy URL Grid
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.Grid_CopyURL.project.id,
            dossierId: gridConstants.Grid_CopyURL.id,
        });
        // And I right click on element "CatLink" with hyper link and select "Copy URL" from visualization "Visualization 1"
        await vizPanelForGrid.selectContextMenuOptionFromElementWithHyperLink(
            'CatLink',
            'Copy URL',
            'Visualization 1'
        );

        let expectedContent = browser.options.baseUrl + `CatLink`;
        await since('The copied content should be #{expected}, while we got #{actual}')
            .expect(JSON.stringify(await agGridVisualization.getClipboardText()))
            .toBe(JSON.stringify(expectedContent));

        await libraryPage.editDossierByUrl({
            projectId: gridConstants.Grid_CopyURL.project.id,
            dossierId: gridConstants.Grid_CopyURL.id,
        });
        await vizPanelForGrid.selectContextMenuOptionFromElementWithHyperLink(
            'https://www.google.com/imgres?imgurl=https%3A%2F%2Ficatcare.org%2Fapp%2Fuploads%2F2018%2F07%2FThinking-of-getting-a-cat.png&imgrefurl=https%3A%2F%2Ficatcare.org%2Fadvice%2Fthinking-of-getting-a-cat%2F&tbnid=0V922RrJgQc9SM&vet=12ahUKEwjy2uHs6bPoAhWKT98KHVHaDMcQMygAegUIARCMAg..i&docid=5qEHfJOysK_DwM&w=1200&h=600&q=cat&ved=2ahUKEwjy2uHs6bPoAhWKT98KHVHaDMcQMygAegUIARCMAg',
            'Copy URL',
            'Visualization 1'
        );

        let expectedContent2 = `https://www.google.com/imgres?imgurl=https%3A%2F%2Ficatcare.org%2Fapp%2Fuploads%2F2018%2F07%2FThinking-of-getting-a-cat.png&imgrefurl=https%3A%2F%2Ficatcare.org%2Fadvice%2Fthinking-of-getting-a-cat%2F&tbnid=0V922RrJgQc9SM&vet=12ahUKEwjy2uHs6bPoAhWKT98KHVHaDMcQMygAegUIARCMAg..i&docid=5qEHfJOysK_DwM&w=1200&h=600&q=cat&ved=2ahUKEwjy2uHs6bPoAhWKT98KHVHaDMcQMygAegUIARCMAg`;
        await since('The copied content should be #{expected}, while we got #{actual}')
            .expect(JSON.stringify(await agGridVisualization.getClipboardText()))
            .toBe(JSON.stringify(expectedContent2));


   });

   it('[TC64355_3] Copy Rows ', async () => {
        // Edit dossier by its ID "91696EC211EA9BE72E5A0080EFB54080"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > Normal Grid > Copy Cell Grid
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.Grid_CopyCell.project.id,
            dossierId: gridConstants.Grid_CopyCell.id,
        });
        // When I select elements "Comair Inc." of object "" on grid visualization "Visualization 1"
        await vizPanelForGrid.selectMultipleElements('Comair Inc.', 'Visualization 1');
        // And I right click on element "Comair Inc." and select "Copy Rows" from visualization "Visualization 1"
        await vizPanelForGrid.selectContextMenuOptionFromElement(
            'Comair Inc.',
            'Copy Rows',
            'Visualization 1'
        );
        let expectedContent = `Year\tMonth\tDay of Week\tAirline Name\tNumber of Flights\tAvg Delay (min)\tOn-Time\t\n2009\tJanuary\tSunday\tComair Inc.\t104\t1,085.53\t46\t\n`;
        await since('The copied content should be #{expected}, while we got #{actual}')
            .expect(JSON.stringify(await agGridVisualization.getClipboardText()))
            .toBe(JSON.stringify(expectedContent));
        // And I replace textbox text of "Text1" with clipboard data   \
        // Then I should see the Text Container "Text1" with content as
        // """
        // Year Month Day of Week Airline Name Number of Flights Avg Delay (min) On-Time 
        // 2009 January Sunday Comair Inc. 104 1,085.53 46 
        // """
        // # Copy Rows in regular Grid - Multiple rows are selected
        // When I open dossier by its ID "91696EC211EA9BE72E5A0080EFB54080"
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.Grid_CopyCell.project.id,
            dossierId: gridConstants.Grid_CopyCell.id,
        });
        // When I select elements "693.67, 55, 151" of object "" on grid visualization "Visualization 1"
        await vizPanelForGrid.selectMultipleElements('693.67, 55, 151', 'Visualization 1');
        // And I right click on element "693.67" and select "Copy Rows" from visualization "Visualization 1"
        await vizPanelForGrid.selectContextMenuOptionFromElement(
            '693.67',
            'Copy Rows',
            'Visualization 1'
        );
        let expectedContent2 = `Year\tMonth\tDay of Week\tAirline Name\tNumber of Flights\tAvg Delay (min)\tOn-Time\t\n2009\tJanuary\tSunday\tAmerican Airlines Inc.\t174\t693.67\t131\t\n2009\tJanuary\tSunday\tAmerican Eagle Airlines Inc.\t121\t835.81\t55\t\n2009\tJanuary\tSunday\tDelta Air Lines Inc.\t151\t457.18\t85\t\n`;
        await since('The copied content should be #{expected}, while we got #{actual}')
            .expect(JSON.stringify(await agGridVisualization.getClipboardText()))
            .toBe(JSON.stringify(expectedContent2));
        // And I replace textbox text of "Text1" with clipboard data   
        // Then I should see the Text Container "Text1" with content as
        // """
        // Year Month Day of Week Airline Name Number of Flights Avg Delay (min) On-Time 
        // 2009 January Sunday American Airlines Inc. 174 693.67 131 
        // 2009 January Sunday American Eagle Airlines Inc. 121 835.81 55 
        // 2009 January Sunday Delta Air Lines Inc. 151 457.18 85 
        // """
        // # Copy Rows in Compound Grid - One row is selected
        // When I open dossier by its ID "119A064E11EA9BF52E5A0080EF456181"
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.CompoundGrid_CopyCell.project.id,
            dossierId: gridConstants.CompoundGrid_CopyCell.id,
        });
        // When I select elements "AirTran Airways Corporation" of object "" on grid visualization "Visualization 1"
        await vizPanelForGrid.selectMultipleElements('AirTran Airways Corporation', 'Visualization 1');
        // And I right click on element "AirTran Airways Corporation" and select "Copy Rows" from visualization "Visualization 1"
        await vizPanelForGrid.selectContextMenuOptionFromElement(
            'AirTran Airways Corporation',
            'Copy Rows',
            'Visualization 1'
        );
        let expectedContent3 = `Year\tMonth\tDay of Week\tSunday\tMonday\tTuesday\tWednesday\tThursday\tFriday\tSaturday\t\n\t\tAirline Name\tOn-Time\tOn-Time\tOn-Time\tOn-Time\tOn-Time\tOn-Time\tOn-Time\t\n2009\tJanuary\tAirTran Airways Corporation\t119\t129\t70\t114\t189\t166\t191\t\n`;
        await since('The copied content should be #{expected}, while we got #{actual}')
            .expect(JSON.stringify(await agGridVisualization.getClipboardText()))
            .toBe(JSON.stringify(expectedContent3));
        // And I replace textbox text of "Text1" with clipboard data   
        // Then I should see the Text Container "Text1" with content as
        // """
        // Year Month Day of Week Sunday Monday Tuesday Wednesday Thursday Friday Saturday 
        //   Airline Name On-Time On-Time On-Time On-Time On-Time On-Time On-Time 
        // 2009 January AirTran Airways Corporation 119 129 70 114 189 166 191 
        // """

        // # Copy Rows in Compound Grid - Multiple rows are selected
        // When I open dossier by its ID "119A064E11EA9BF52E5A0080EF456181"
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.CompoundGrid_CopyCell.project.id,
            dossierId: gridConstants.CompoundGrid_CopyCell.id,
        });
        // When I select elements "129, 109, 57" of object "" on grid visualization "Visualization 1"
        await vizPanelForGrid.selectMultipleElements('129, 109, 57', 'Visualization 1');
        // And I right click on element "129" and select "Copy Rows" from visualization "Visualization 1"
        await vizPanelForGrid.selectContextMenuOptionFromElement(
            '129',
            'Copy Rows',
            'Visualization 1'
        );
        let expectedContent4 = `Year\tMonth\tDay of Week\tSunday\tMonday\tTuesday\tWednesday\tThursday\tFriday\tSaturday\t\n\t\tAirline Name\tOn-Time\tOn-Time\tOn-Time\tOn-Time\tOn-Time\tOn-Time\tOn-Time\t\n2009\tJanuary\tAirTran Airways Corporation\t119\t129\t70\t114\t189\t166\t191\t\n2009\tJanuary\tAmerican Airlines Inc.\t131\t114\t92\t109\t155\t173\t139\t\n2009\tJanuary\tComair Inc.\t46\t57\t37\t41\t62\t72\t58\t\n`;
        await since('The copied content should be #{expected}, while we got #{actual}')
            .expect(JSON.stringify(await agGridVisualization.getClipboardText()))
            .toBe(JSON.stringify(expectedContent4));
        // And I replace textbox text of "Text1" with clipboard data   
        // Then I should see the Text Container "Text1" with content as
        // """
        // Year Month Day of Week Sunday Monday Tuesday Wednesday Thursday Friday Saturday 
        //   Airline Name On-Time On-Time On-Time On-Time On-Time On-Time On-Time 
        // 2009 January AirTran Airways Corporation 119 129 70 114 189 166 191 
        // 2009 January American Airlines Inc. 131 114 92 109 155 173 139 
        // 2009 January Comair Inc. 46 57 37 41 62 72 58 
        // """
    });
});
