import setWindowSize from '../../../config/setWindowSize.js';
import { customCredentials, downloadDirectory } from '../../../constants/index.js';
import { isFileNotEmpty } from '../../../config/folderManagement.js';
import '../../../utils/toMatchPdf.ts';
import path from 'path';
import { deleteFile } from '../../../utils/compareImage.js';

const specConfiguration = { ...customCredentials('_urlapi') };

describe('Url API pass Element List Prompt', () => {
    const AEWithAllStyle = {
        id: 'DF7503764288F69BA1CF36A888709C17',
        name: 'AE with all style',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const AEPrompt = {
        id: '297526DF4933D4F73C80BB8BB4053722',
        name: '(Auto) URL API Pass AE Prompt',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const target = {
        id: '6F3DE579467440AA22CA50B27F156BA0',
        name: '(Auto) DashboardTarget_Discard',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const { credentials } = specConfiguration;

    let {
        loginPage,
        dossierPage,
        libraryPage,
        toolbar,
        promptEditor,
        promptObject,
        grid,
        share,
        toc,
        filterPanel,
        checkboxFilter,
        filterSummaryBar,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);
        await setWindowSize({
            width: 1600,
            height: 1200,
        });
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC97814_06] Validate generate URL API pass Element List prompt link Library Web - Static Link', async () => {
        await libraryPage.editDossierByUrlwithPrompt({
            projectId: AEWithAllStyle.project.id,
            dossierId: AEWithAllStyle.id,
        });
        await promptEditor.waitForEditor();
        const promptCheckbox = await promptObject.getPromptByName('Year - Check box');
        await promptObject.checkBox.clickCheckboxByName(promptCheckbox, 'Adirondack Style');

        const promptList = await promptObject.getPromptByName('Year - List');
        await promptObject.checkBox.clickCheckboxByName(promptList, '2014');

        const promptPulldown = await promptObject.getPromptByName('Year - Pull down');
        await promptEditor.clickPromptIndexByTitleWithNoWait('Year - Pull down');
        await promptObject.pulldown.selectPullDownItem(promptPulldown, '2017');

        const promptRadio = await promptObject.getPromptByName('Year - Radio button');
        await promptEditor.clickPromptIndexByTitleWithNoWait('Year - Radio button');
        await promptObject.radioButton.selectRadioButtonByName(promptRadio, '2014');

        const promptCart = await promptObject.getPromptByName('Year - Shopping Cart');
        await promptEditor.clickPromptIndexByTitleWithNoWait('Year - Shopping Cart');
        await promptObject.shoppingCart.removeAll(promptCart);

        const promptBarcode = await promptObject.getPromptByName('Year - Barcode Reader');
        await promptEditor.clickPromptIndexByTitleWithNoWait('Year - Barcode Reader');
        await promptObject.shoppingCart.clickElmInAvailableList(promptBarcode, '2017');
        await promptObject.shoppingCart.addSingle(promptBarcode);

        const promptGeo = await promptObject.getPromptByName('Year-Geo Location');
        await promptEditor.clickPromptIndexByTitleWithNoWait('Year-Geo Location');
        await promptObject.shoppingCart.clickElmInAvailableList(promptGeo, '2015');
        await promptObject.shoppingCart.addSingle(promptGeo);

        await promptEditor.run();
        await dossierPage.waitForItemLoading();

        await toolbar.clickURLGeneratorButton();
        await toolbar.clickSelectValuePromptButton();
        await promptEditor.waitForEditorSelectableMode();
        await promptEditor.selectPromptItems([
            'Year - Check box',
            'Year - List',
            'Year - Pull down',
            'Year - Radio button',
            'Year - Shopping Cart',
            'Year - Barcode Reader',
            'Year-Geo Location',
        ]);
        await promptEditor.clickSelectButton();
        await since('Generator Bar Text should be #{expected}, while we got #{actual}')
            .expect(await toolbar.generatorBarText())
            .toBe(
                'Choose filters, selectors and/or\nselect prompts\nto generate embedding URL\n7 prompts selected\nGenerate Link'
            );
        await toolbar.clickGenerateLinkButton();
        let urlGenerated = await dossierPage.getClipboardText();
        console.log('urlGenerated:' + urlGenerated);

        // Apply url
        await browser.url(urlGenerated);
        await dossierPage.waitForDossierLoading();
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Year - Check box');
        await since('Checkbox prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary('Year - Check box'))
            .toEqual('Adirondack Style');
        await since('List prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary('Year - List'))
            .toEqual('2014, 2015');
        await since('Pulldown prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary('Year - Pull down'))
            .toBe('2017');
        await since('Radio button prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary('Year - Radio button'))
            .toBe('2014');
        await since('Shopping cart prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkEmptySummary('Year - Shopping Cart'))
            .toEqual('No Selection');
        await since('Barcode prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary('Year - Barcode Reader'))
            .toEqual('2017');
        await since('Geo location prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary('Year-Geo Location'))
            .toEqual('2015');

        // Partial Apply
        const partialUrl =
            browser.options.baseUrl +
            'app/9D8A49D54E04E0BE62C877ACC18A5A0A/DF7503764288F69BA1CF36A888709C17/K53--K46?prompts=%5B%5B%7B%22key%22%3A%22E50CBB6E4CF122FD844A8FAF7470278C%400%4010%22%2C%22values%22%3A%5B%228D679D5111D3E4981000E787EC6DE8A4%3A2014~1048576~2014%22%2C%228D679D5111D3E4981000E787EC6DE8A4%3A2015~1048576~2015%22%5D%2C%22useDefault%22%3Afalse%7D%2C%7B%22key%22%3A%22715F353449F55A6D27C9C7B2235B460F%400%4010%22%2C%22values%22%3A%5B%228D679D5111D3E4981000E787EC6DE8A4%3A2017~1048576~2017%22%5D%2C%22useDefault%22%3Afalse%7D%5D%5D';
        console.log('partialUrl:' + partialUrl);
        await browser.url(partialUrl);
        await dossierPage.waitForDossierLoading();
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Year - Check box');
        await since('List prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary('Year - List'))
            .toEqual('2014, 2015');
        await since('Pulldown prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary('Year - Pull down'))
            .toBe('2017');
    });

    it('[TC97814_07] Validate generate URL API pass Element List prompt link Library Web - Dynamic Link', async () => {
        await libraryPage.editDossierByUrlwithPrompt({
            projectId: AEWithAllStyle.project.id,
            dossierId: AEWithAllStyle.id,
        });
        await promptEditor.waitForEditor();
        const promptCheckbox = await promptObject.getPromptByName('Year - Check box');
        await promptObject.goToNextPage(promptCheckbox);
        await promptObject.checkBox.clickCheckboxByName(promptCheckbox, 'Brave New World');

        const promptList = await promptObject.getPromptByName('Year - List');
        await promptObject.checkBox.clickCheckboxByName(promptList, '2017');
        await promptEditor.run();
        await dossierPage.waitForItemLoading();

        await toolbar.clickURLGeneratorButton();
        await toolbar.clickSelectValuePromptButton();
        await promptEditor.waitForEditorSelectableMode();
        await promptEditor.selectPromptItems(['Year - Check box', 'Year - List']);
        await promptEditor.switchDynamicItems(['Year - List']);
        await promptEditor.clickSelectButton();
        await since('Generator Bar Text should be #{expected}, while we got #{actual}')
            .expect(await toolbar.generatorBarText())
            .toBe(
                'Choose filters, selectors and/or\nselect prompts\nto generate embedding URL\n2 prompts selected\nGenerate Link'
            );
        await toolbar.clickGenerateLinkButton();
        let urlGenerated = await dossierPage.getClipboardText();
        console.log('urlGenerated:' + urlGenerated);
        await since('Clipboard Text should be #{expected}, while we got #{actual}')
            .expect(urlGenerated)
            .toContain(
                '%5B%5B%7B%22key%22%3A%22C58682B140FC654DEC83338BD4AEF634%400%4010%22%2C%22values%22%3A%5B%228D679D4211D3E4981000E787EC6DE8A4%3A37~1048576~Brave%20New%20World%22%5D%2C%22useDefault%22%3Afalse%7D%2C%7B%22key%22%3A%22E50CBB6E4CF122FD844A8FAF7470278C%400%4010%22%2C%22values%22%3A%5B%228D679D5111D3E4981000E787EC6DE8A4:{[Year]@ID}~1048576~{[Year]@ID}%22%5D%2C%22useDefault%22%3Afalse%7D%5D%5D'
            );
    });

    it('[TC97814_08] Validate URL API pass Element List prompt link Library Web - AE Setting', async () => {
        await libraryPage.openDossierById({
            projectId: AEPrompt.project.id,
            dossierId: AEPrompt.id,
        });
        await dossierPage.waitForDossierLoading();
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Pass AE Prompt' });

        // pass fixed value: Year = 2017
        await dossierPage.clickTextfieldByTitle(
            'Display prompt and use the current answers as the default answers\nPass Year=2017'
        );
        await dossierPage.switchToTab(1);
        await dossierPage.waitForDossierLoading();
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Year');
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary('Year'))
            .toBe('2017');
        await since('Favorite dossier by recent section, favorites icon on dossier image should be selected')
            .expect(await dossierPage.isAddToLibraryDisplayed())
            .toBe(true);
        await dossierPage.switchToTab(0);
        await dossierPage.closeTab(1);

        // required
        await dossierPage.clickTextfieldByTitle('Required not Answered\nYear=2017');
        await dossierPage.switchToTab(1);
        let subcategoryPrompt = await promptObject.getPromptByName('Subcategory');
        await promptObject.shoppingCart.addSingle(subcategoryPrompt);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Year');
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary('Year'))
            .toBe('2017');
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary('Subcategory'))
            .toBe('Art & Architecture');
        await dossierPage.switchToTab(0);
        await dossierPage.closeTab(1);

        // Cross Project
        await dossierPage.clickTextfieldByTitle('Cross Project\nYear=2017');
        await dossierPage.switchToTab(1);
        await dossierPage.waitForDossierLoading();
        await since('Dossier Title should be #{expected}, while we got #{actual}')
            .expect(await dossierPage.getTxtTitle_Dossier())
            .toBe('DossierLinking_CrossProject_Target3_CategoryPrompt');
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Year');
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary('Year'))
            .toBe('2017');
        await dossierPage.switchToTab(0);
        await dossierPage.closeTab(1);

        // cross application
        await dossierPage.clickTextfieldByTitle('Application\nYear=2017');
        await dossierPage.switchToTab(1);
        let crossApplication = await promptObject.getPromptByName('Subcategory');
        await promptObject.shoppingCart.addSingle(crossApplication);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Year');
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary('Year'))
            .toBe('2017');
        await dossierPage.switchToTab(0);
        await dossierPage.closeTab(1);
    });

    it('[TC97814_09] Validate URL API pass Element List prompt link Library Web - OriginMessageID+Prompt+Filter', async () => {
        await libraryPage.openDossierById({
            projectId: AEPrompt.project.id,
            dossierId: AEPrompt.id,
        });
        await dossierPage.waitForDossierLoading();
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Pass AE Prompt' });

        await promptEditor.reprompt();
        let year = await promptObject.getPromptByName('Year');
        await promptObject.shoppingCart.clickElmInAvailableList(year, '2016');
        await promptObject.shoppingCart.addSingle(year);
        await promptEditor.run();
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('Quarter');
        await checkboxFilter.selectElementByName('2016 Q3');
        await filterPanel.apply();
        await dossierPage.clickTextfieldByTitle('OriginMessageID+AttributeElement+Filter\nYear=2016, Quarter=2016 Q3');
        await dossierPage.switchToTab(1);
        let subcategory = await promptObject.getPromptByName('Subcategory');
        await promptObject.shoppingCart.addSingle(subcategory);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Year');
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary('Year'))
            .toBe('2016');
        await promptEditor.run();
        await since('The filter summary is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Quarter'))
            .toBe('(2016 Q3)');
        await dossierPage.switchToTab(0);
        await dossierPage.closeTab(1);
    });

    it('[TC97814_10] Validate URL API pass Element List prompt link Library Web - Export', async () => {
        await libraryPage.openDossierById({
            projectId: AEPrompt.project.id,
            dossierId: AEPrompt.id,
        });
        await dossierPage.waitForDossierLoading();
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Pass AE Prompt' });
        // Pass {$Subcategory} and Item = The Prince or The Fountainhead, open in this tab - no back button
        await grid.clickGridElementLink({
            title: 'Visualization 1',
            headerName: 'Subcategory(Link)_ExportToPDF',
            elementName: 'Literature',
        });
        await share.waitForDownloadComplete({ name: target.name, fileType: '.pdf' });
        await since(`The PDF file for ${target.name} was not downloaded`)
            .expect(await isFileNotEmpty({ name: target.name, fileType: '.pdf' }))
            .toBe(true);
        const filepath = path.join(downloadDirectory, `${target.name}.pdf`);
        const baselineDirectory = path.join(process.cwd(), 'resources');
        await expect(filepath).toMatchPdf(path.join(baselineDirectory, `${target.name}.pdf`));
        await deleteFile({
            name: target.name,
            fileType: '.pdf',
        });

        // Pass {$item}
        await libraryPage.openDossierById({
            projectId: AEPrompt.project.id,
            dossierId: AEPrompt.id,
        });
        await dossierPage.waitForDossierLoading();
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Pass AE Prompt' });
        await grid.clickGridElementLink({
            title: 'Visualization 2',
            headerName: 'Item(Link)',
            elementName: 'RCA CD Changer',
        });
        await dossierPage.switchToTab(1);
        let subcategoryPrompt = await promptObject.getPromptByName('Subcategory');
        await promptObject.shoppingCart.addAll(subcategoryPrompt);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Subcategory');
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkQualSummaryOfDefault('Item'))
            .toBe('The default selection is:Item = 101');
        await dossierPage.switchToTab(0);
        await dossierPage.closeTab(1);
    });

    it('[TC97814_11] Validate URL API pass Element List prompt link Library Web - Prompt In Prompt', async () => {
        await libraryPage.openDossierById({
            projectId: AEPrompt.project.id,
            dossierId: AEPrompt.id,
        });
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Prompt In Prompt' });

        await dossierPage.clickTextfieldByTitle('Answer Partial');
        await dossierPage.switchToTab(1);
        let categoryPrompt = await promptObject.getPromptByName('Category');
        await promptObject.shoppingCart.addAll(categoryPrompt);
        await promptEditor.run();
        let subcategoryPrompt = await promptObject.getPromptByName('Subcategory Filtered By Category');
        await promptObject.shoppingCart.addAll(subcategoryPrompt);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Year');
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary('Year'))
            .toBe('2014');
        await promptEditor.clickButtonByName('Apply');
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Quarter');
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary('Quarter'))
            .toBe('2014 Q1, 2014 Q2');
        await promptEditor.clickButtonByName('Apply');
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Month');
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary('Month'))
            .toBe('Jan 2014');
        await dossierPage.switchToTab(0);
        await dossierPage.closeTab(1);

        await dossierPage.clickTextfieldByTitle('Answer All');
        await dossierPage.switchToTab(1);
        await dossierPage.waitForDossierLoading();
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Year');
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary('Year'))
            .toBe('2014, 2015');
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary('Category'))
            .toBe('Books, Electronics');
        await promptEditor.clickButtonByName('Apply');
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Quarter');
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary('Quarter'))
            .toBe('2014 Q1, 2014 Q2');
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary('Subcategory Filtered By Category'))
            .toBe('Art & Architecture');
        await promptEditor.clickButtonByName('Apply');
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Month');
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary('Month'))
            .toBe('Jan 2014');
        await promptEditor.clickButtonByName('Apply');
        await dossierPage.switchToTab(0);
        await dossierPage.closeTab(1);

        await grid.clickGridElementLink({
            title: 'Visualization 1',
            headerName: 'Category(PIP)',
            elementName: 'Books',
        });
        await dossierPage.switchToTab(1);
        await dossierPage.waitForDossierLoading();
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Category');
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary('Category'))
            .toBe('1');
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary('Year'))
            .toBe('2014');
        await promptEditor.clickButtonByName('Apply');
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Subcategory Filtered By Category');
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary('Subcategory Filtered By Category'))
            .toBe('Art & Architecture');
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary('Quarter'))
            .toBe('2014 Q1, 2014 Q2');
        await promptEditor.clickButtonByName('Apply');
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Month');
        await since('Prompt answer is supposed to be #{expected}, instead we have #{actual}')
            .expect(await promptEditor.checkListSummary('Month'))
            .toBe('Jan 2014');
    });
});

export const config = specConfiguration;
