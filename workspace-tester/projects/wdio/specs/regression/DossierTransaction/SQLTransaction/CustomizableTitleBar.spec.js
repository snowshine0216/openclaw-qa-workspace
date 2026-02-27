import setWindowSize from '../../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import { browserWindow } from '../../../../constants/index.js';
import * as dossierTXN from '../../../../constants/dossierTXN.js';
import { takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';
import { Key } from 'webdriverio';
import resetDossierState from '../../../../api/resetDossierState.js';

describe('25.09 Customizable Title Bar', () => {
    let {
        dossierAuthoringPage,
        baseVisualization,
        dossierPage,
        formatPanel,
        baseContainer,
        datasetPanel,
        toolbar,
        dataSourceEditor,
        dossierMojo,
        gridAuthoring,
        agGrid,
        baseFormatPanelReact,
        transactionConfigEditor,
        loginPage,
        libraryPage,
        mappingEditor,
        tocContentsPanel,
        bulkEdit,
        inlineEdit,
        toc,
        loadingDialog,
        contentsPanel,
        newFormatPanelForGrid,
        vizPanelForGrid,
    } = browsers.pageObj1;
    const dossier = {
        id: 'EFBB6D889544440147BB338422B0DE5A',
        name: 'CustomizableTitleBar',
        project: {
            id: dossierTXN.dossierTXNProject.id,
            name: dossierTXN.dossierTXNProject.name,
        },
    };
    const dossierConsumption = {
        id: '9D0DA3C9064CAA8325F80FB88AE25968',
        name: 'CustomizableTitleBar-Consumption',
        project: {
            id: dossierTXN.dossierTXNProject.id,
            name: dossierTXN.dossierTXNProject.name,
        },
    };

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await libraryPage.openDefaultApp();
        await loginPage.login(dossierTXN.txnAutoUser);
       await libraryPage.openDossierById({
            projectId: dossierTXN.dossierTXNProject.id,
            dossierId: '9966F2D44F427684BF80C08742BF4A90',
        });
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'RestoreData_ygu_year_category_sls' });
        await agGrid.openContextMenuItemForCellAtPosition(2, 2, 'Delete Row', 'RestoreData_ygu_year_category_sls');
        await agGrid.selectConfirmationPopupOption('Continue');
    });

    /*beforeEach(async () => {
        //Restore the transaction data
        await libraryPage.openDossierById({
            projectId: dossierTXN.dossierTXNProject.id,
            dossierId: '9966F2D44F427684BF80C08742BF4A90',
        });
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'RestoreData_ygu_python_datatype' });
        await agGrid.openContextMenuItemForCellAtPosition(2, 2, 'Delete Row', 'RestoreData_ygu_python_datatype');
        await agGrid.selectConfirmationPopupOption('Continue');

        //Reset the dashboard
        await resetDossierState({ credentials: dossierTXN.txnAutoUser, dossierConsumption });
    });*/

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC99559_1] normal grid enable subtitle and button', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });
        await libraryPage.waitForCurtainDisappear();
        await dossierAuthoringPage.waitForAuthoringPageLoading();

        await contentsPanel.goToPage({ chapterName: 'Grid', pageName: 'NormalCompound' });
        await baseVisualization.clickVisualizationTitle('NormalGrid');
        await formatPanel.openTitleContainerFormatPanel();
        //Move mouse to make sure the title setting panel is not covered by the tooltip
        await vizPanelForGrid.moveMouse(50,0);

        //Verify the Title Container Format panel default settings
        await since('1. Titles are 1 line by default.')
            .expect(await (await dossierAuthoringPage.getTitleStyle('1 Line')).isExisting())
            .toBe(true);
        await takeScreenshotByElement(
            dossierAuthoringPage.getTitleBarSetting(),
            'TC99559_1_01',
            'Title Container Format panel with default settings'
        );

        //Switch to 2 Lines
        await dossierAuthoringPage.setTitleStyle('2 Lines');
        //Verify the title bar displayed in the viz
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('NormalGrid'),
            'TC99559_1_02',
            'Title bar with 2 Lines enabled'
        );
        //Verify the title bar setting changed to 2 Lines
        await since('2. Titles can be switched to 2 lines.')
            .expect(await (await dossierAuthoringPage.getTitleStyle('2 Lines')).isExisting())
            .toBe(true);
        //Verify the top line settings
        await since('3. The top line font family should be #{expected} instead we have #{actual}')
            .expect(await dossierAuthoringPage.getTitleFontFamily('Top line'))
            .toBe('Open Sans');
        await since('4. The top line font size should be #{expected} instead we have #{actual}')
            .expect(await dossierAuthoringPage.getTitleFontSize('Top line'))
            .toBe('14pt');
        await since('5. The top line color should be #{expected} instead we have #{actual}')
            .expect(await dossierAuthoringPage.getTitleFontColor('Top line'))
            .toBe('rgba(53,56,58,1)');
        await takeScreenshotByElement(
            dossierAuthoringPage.getTitleBarSetting(),
            'TC99559_1_03',
            'Title Container Format panel with 2 Lines'
        );

        //Set the top line font
        await newFormatPanelForGrid.selectFontStyle('bold'); 
        //Set the bottom line font
        await newFormatPanelForGrid.selectTitleOption('Bottom line');
        await newFormatPanelForGrid.setTextFontSize('15');

        //Verify the style is changed correclty
        await since('6. The bottom line font size should be #{expected} instead we have #{actual}')
            .expect(
                await dossierAuthoringPage.getCSSProperty(
                    await vizPanelForGrid.getVisualizationTitleBarTextArea('Add bottom line'),
                    'font-size'
                )
            )
            .toBe('20px');
        await since('7. The top line font style should be #{expected} instead we have #{actual}')
            .expect(
                (await dossierAuthoringPage.getCSSProperty(
                    await vizPanelForGrid.getVisualizationTitleBarTextArea('NormalGrid'),
                    'font-weight'
                    )
                ).toString()
            )
            .toBe('700');

        //Modify the title and subtitle strings
        await vizPanelForGrid.renameVisualizationByDoubleClick('NormalGrid', 'NormalNew');
        await vizPanelForGrid.renameVisualizationByDoubleClick('Add bottom line', 'NormalSubtitle');
        //Verify the title bar displayed in the viz
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('NormalNew'),
            'TC99559_1_04',
            'Title bar with 2 lines titles enabled and modified titles'
        );
        //undo the title and subtitle strings
        await toolbar.clickButtonFromToolbar('Undo');
        await toolbar.clickButtonFromToolbar('Undo');
        //Verify the title bar displayed in the viz
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('NormalGrid'),
            'TC99559_1_05',
            'Title bar with 2 lines titles enabled and original titles'
        );

        //redo the title and subtitle strings
        await toolbar.clickButtonFromToolbar('Redo');
        await toolbar.clickButtonFromToolbar('Redo');
        //Verify the title bar displayed in the viz
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('NormalNew'),
            'TC99559_1_06',
            'Title bar with 2 lines titles enabled and modified titles after click Redo button'
        );

        //Enable title buttons
        await newFormatPanelForGrid.toggleTitleButtons();
        //Verify the buttons are displayed in the title bar
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('NormalNew'),
            'TC99559_1_07',
            'Title bar with buttons enabled and 2 Lines titles'
        );

        //Click the context menu of the gird to hide title bar
        await vizPanelForGrid.openContextMenu('NormalNew');

        //Verify Hide "Maximize" is not displayed
        await since('8. Hide "Maximize" should not be displayed when title bar enabled buttons.')
            .expect(await (await vizPanelForGrid.getContextMenuOption('Hide "Maximize"')).isExisting())
            .toBe(false);
        //Verify Hide Context Menu is not displayed
        await since('9. Hide "Context Menu" should not be displayed when title bar enabled buttons.')
            .expect(await (await vizPanelForGrid.getContextMenuOption('Hide Context Menu')).isExisting())
            .toBe(false);

        //Click Hide Title Bar
        await vizPanelForGrid.selectContextMenuOption('Hide Title Bar');
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        //Verify the title bar is hidden
        await since(
            '10. The title bar should be hidden when click Hide Title Bar in the context menu. should be #{expected} instead we have #{actual}'
        )
            .expect(await (await baseVisualization.getTitleBarContainer('NormalNew')).isDisplayed())
            .toBe(false);
        await takeScreenshotByElement(
            vizPanelForGrid.getGridContainer('NormalNew'),
            'TC99559_1_08',
            'Normal Grid without title bar'
        );

        //Click undo button in the toolbar
        await toolbar.clickButtonFromToolbar('Undo');

        //Verify the title bar is displayed again
        await since('11. The title bar should be displayed again when click Undo button in the toolbar.')
            .expect(await (await baseVisualization.getTitleBarContainer('NormalNew')).isDisplayed())
            .toBe(true);
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('NormalNew'),
            'TC99559_1_09',
            'Normal New with title bar after click Undo button'
        );
    });

    it('[TC99559_2] compound grid enable subtitle and button', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });
        await libraryPage.waitForCurtainDisappear();
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        //Move mouse to make sure switching page operation is not blocked by tooltip
        await vizPanelForGrid.moveMouse(50, 0);
        await contentsPanel.goToPage({ chapterName: 'Grid', pageName: 'NormalCompound' });
        await baseVisualization.clickVisualizationTitle('CompoundGrid');
        await formatPanel.openTitleContainerFormatPanel();
        //Move mouse to make sure the title setting panel is not covered by the tooltip
        await vizPanelForGrid.moveMouse(50,0);
        //Verify the Title Container Format panel default settings
        await since('1. Titles are 2 lines by designed.')
            .expect(await (await dossierAuthoringPage.getTitleStyle('2 Lines')).isExisting())
            .toBe(true);
        await takeScreenshotByElement(
            dossierAuthoringPage.getTitleBarSetting(),
            'TC99559_2_01',
            'Title Container Format panel with default settings'
        );
        //Verify the title bar displayed in the viz
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('CompoundGrid'),
            'TC99559_2_02',
            'Compound Grid with 2 Lines titles by default'
        );
        //Set the title bar fill color and alignment
        await newFormatPanelForGrid.clickTitleBackgroundColorBtn();

        // And I switch the color picker to swatch mode
        await newFormatPanelForGrid.clickColorPickerModeBtn('grid');

        // And I select the built-in color "#ABABAB" in the color picker
        await newFormatPanelForGrid.clickBuiltInColor('#ABABAB');

        // And I close the title background color picker
        await newFormatPanelForGrid.clickTitleBackgroundColorBtn();
        await since('2. Main Title should have background-color #{expected} instead we have #{actual}')
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.selectors.getVisualizationTitleBarRoot('CompoundGrid'),
                    'background-color'
                )
            )
            .toBe('rgba(171,171,171,1)');
        await since('3. SubTitle should have background-color #{expected} instead we have #{actual}')
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.selectors.getVisualizationSubTitleBarRoot('Year Category'),
                    'background-color'
                )
            )
            .toBe('rgba(171,171,171,1)');
        //Verify right alignment is disabled
        await since(
            '4. After title buttons enabled, the right align disabled should be #{expected}, instead we have #{actual}'
        )
            .expect(await newFormatPanelForGrid.isFontAlignButtonDisabled('right'))
            .toBe(true);
        await newFormatPanelForGrid.selectFontAlign('left');
        await since('5. Main Title should have text-align #{expected} instead we have #{actual}')
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.selectors.getVisualizationTitleBarRoot('CompoundGrid'),
                    'text-align'
                )
            )
            .toBe('left');
        await since('6. SubTitle should have text-align #{expected} instead we have #{actual}')
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.selectors.getVisualizationSubTitleBarRoot('Year Category'),
                    'text-align'
                )
            )
            .toBe('left');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('CompoundGrid'),
            'TC99559_2_03',
            'Title bar with background color and left alignment'
        );
        //Switch to 1 Line
        await dossierAuthoringPage.setTitleStyle('1 Line');
        //Verify the title bar displayed in the viz
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('CompoundGrid'),
            'TC99559_2_04',
            'Title bar with 1 Line titles enabled'
        );
        //undo to 2 Lines
        await toolbar.clickButtonFromToolbar('Undo');
        //Verify the title bar displayed in the viz
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('CompoundGrid'),
            'TC99559_2_03',
            'Title bar with background color and left alignment'
        );
        //Disable titles
        await newFormatPanelForGrid.toggleTitles();
        //Verify the title bar is displayed becase button is enabled
        await since('7. The title bar should be displayed when title bar buttons enabled.')
            .expect(await (await baseVisualization.getTitleBarContainer('CompoundGrid')).isDisplayed())
            .toBe(true);
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('CompoundGrid'),
            'TC99559_2_05',
            'Compound Grid with title bar buttons enabled and titles disabled'
        );
        //Enable titles
        await newFormatPanelForGrid.toggleTitles();
        //Verify the title bar is displayed again
        await since('8. The title bar should be displayed when titles enabled again.')
            .expect(await (await baseVisualization.getTitleBarContainer('CompoundGrid')).isDisplayed())
            .toBe(true);
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('CompoundGrid'),
            'TC99559_2_03',
            'Title bar with background color and left alignment'
        );
        //Disable title bar
        await newFormatPanelForGrid.toggleTitleBar();
        //Verify the title bar is hidden
        await since('9. The title bar should be hidden when title bar disabled.')
            .expect(await (await baseVisualization.getTitleBarContainer('CompoundGrid')).isDisplayed())
            .toBe(false);
        await takeScreenshotByElement(
            vizPanelForGrid.getGridContainer('CompoundGrid'),
            'TC99559_2_07',
            'Compound Grid with title bar buttons enabled and title bar disabled'
        );
        //Enable title bar
        await newFormatPanelForGrid.toggleTitleBar();
        //Verify the title bar is displayed again
        await since('10. The title bar should be displayed when title bar enabled again.')
            .expect(await (await baseVisualization.getTitleBarContainer('CompoundGrid')).isDisplayed())
            .toBe(true);
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('CompoundGrid'),
            'TC99559_2_03',
            'Title bar with background color and left alignment'
        );
    });
    it('[TC99559_3] AG grid title and subtitle enabled - 1', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });
        await libraryPage.waitForCurtainDisappear();
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        //Move mouse to make sure switching page operation is not blocked by tooltip
        await vizPanelForGrid.moveMouse(50, 0);
        await contentsPanel.goToPage({ chapterName: 'Grid', pageName: 'ModernGrid' });
        await baseVisualization.clickVisualizationTitle('Update');
        await formatPanel.openTitleContainerFormatPanel();
        //Move mouse to make sure the title setting panel is not covered by the tooltip
        await vizPanelForGrid.moveMouse(50,0);
        //Verify the Title Container Format panel default settings
        await since('1. Titles are 1 lines by default.')
            .expect(await (await dossierAuthoringPage.getTitleStyle('1 Line')).isExisting())
            .toBe(true);
        await takeScreenshotByElement(
            dossierAuthoringPage.getTitleBarSetting(),
            'TC99559_3_01',
            'Title Container Format panel with default settings'
        );
        //Switch to 2 Lines
        await dossierAuthoringPage.setTitleStyle('2 Lines');
        //Verify the title bar displayed in the viz
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Update'),
            'TC99559_3_02',
            'AG Grid with 2 Lines titles enabled'
        );
        //Verify the title bar setting changed to 2 Lines
        await since('2. Titles can be switched to 2 lines.')
            .expect(await (await dossierAuthoringPage.getTitleStyle('2 Lines')).isExisting())
            .toBe(true);
        //Verify the title bar settings
        await takeScreenshotByElement(
            dossierAuthoringPage.getTitleBarSetting(),
            'TC99559_3_03',
            'Title Container Format panel with 2 Lines'
        );
        //Set the top line font color
        await newFormatPanelForGrid.clickFontColorBtn();

        // And I switch the color picker to swatch mode
        await newFormatPanelForGrid.clickColorPickerModeBtn('grid');

        // And I select the built-in color "#5C388C" in the color picker
        await newFormatPanelForGrid.clickBuiltInColor('#5C388C');

        // And I click to close the color picker
        await baseFormatPanelReact.dismissColorPicker();

        // Then the Main Title in visualization "Update" has style "color" with value "rgba(92, 56, 140, 1)"
        await since('Main Title in visualization "Update" should have color #{expected} instead we have #{actual}')
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.selectors.getVisualizationTitleBarRoot('Update'),
                    'color'
                )
            )
            .toBe('rgba(92,56,140,1)');
        //Set the bottom line font
        await newFormatPanelForGrid.selectTitleOption('Bottom line');
        await newFormatPanelForGrid.selectTextFont('Monoton');

        // Then the subtitle in visualization "Update" has style "font-family" with value "Monoton"
        await since('Subtitle in visualization "Update" should have font-family #{expected} instead we have #{actual}')
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.selectors.getVisualizationSubTitleBarRoot('Add bottom line'),
                    'font-family'
                )
            )
            .toBe('monoton');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Update'),
            'TC99559_3_04',
            'Title Container Format panel with modified title settings'
        );
        //Click the context menu of the grid to hide Maximize
        await vizPanelForGrid.openContextMenu('Update');
        //Verify Hide "Maximize" is displayed
        await since('3. Hide "Maximize" should be displayed when title bar disabled buttons.')
            .expect(await (await vizPanelForGrid.getContextMenuOption('Hide "Maximize"')).isExisting())
            .toBe(true);
        //Verify Hide Context Menu is displayed
        await since('4. Hide "Context Menu" should be displayed when title bar disabled buttons.')
            .expect(await (await vizPanelForGrid.getContextMenuOption('Hide Context Menu')).isExisting())
            .toBe(true);
        //Click Hide Maximize
        await vizPanelForGrid.selectContextMenuOption('Hide "Maximize"');
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        //Click the context menu of the grid to verify the options again
        await vizPanelForGrid.openContextMenu('Update');
        //Verify Show "Maximize" is displayed
        await since('5. show "Maximize" should be displayed after hide it.')
            .expect(await (await vizPanelForGrid.getContextMenuOption('Show "Maximize"')).isExisting())
            .toBe(true);

        //Enable title buttons
        await newFormatPanelForGrid.toggleTitleButtons();
        //Verify the buttons are displayed in the title bar
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Update'),
            'TC99559_3_05',
            'Title bar with buttons enabled and 2 Lines titles'
        );
        //Verify the format panel settings
        await takeScreenshotByElement(
            dossierAuthoringPage.getTitleBarSetting(),
            'TC99559_3_06',
            'Title Container Format panel with title buttons enabled'
        );
        //Verify the default button size and radius
        await since(
            '6. The default button size should be Small. The height should be #{expected} instead we have #{actual}'
        )
            .expect(await gridAuthoring.getCSSProperty(
                    gridAuthoring.selectors.getTitleButton('Update', 'Transaction'),
                    'height'
                )
            )
            .toBe('24px');
        await since(
            '7. The default button size should be Small. The font size should be #{expected} instead we have #{actual}'
        )
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.selectors.getTitleButton('Update', 'Transaction'),
                    'font-size'
                )
            )
            .toBe('12px');
        await since(
            '8. The default button radius should be no radius. The border-radius should be #{expected} instead we have #{actual}'
        )
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.selectors.getTitleButton('Update', 'Transaction'),
                    'border-radius'
                )
            )
            .toBe('0px');
        //Change the button radius
        await newFormatPanelForGrid.selectButtonRadius('Small radius');
        //Change the button size
        await newFormatPanelForGrid.selectButtonSize('Medium');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Update'),
            'TC99559_3_07',
            'Title bar with buttons with small size and small radius'
        );
        //Verify the button size and radius changed
        await since('9. The button size should be Medium. The height should be #{expected} instead we have #{actual}')
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.selectors.getTitleButton('Update', 'Transaction'),
                    'height'
                )
            )
            .toBe('28px');
        await since(
            '10. The button size should be Medium. The font size should be #{expected} instead we have #{actual}'
        )
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.selectors.getTitleButton('Update', 'Transaction'),
                    'font-size'
                )
            )
            .toBe('14px');
        await since(
            '10. The button radius should be Small radius. The border-radius should be #{expected} instead we have #{actual}'
        )
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.selectors.getTitleButton('Update', 'Transaction'),
                    'border-radius'
                )
            )
            .toBe('2.8px');
        });

    it('[TC99559_4] AG grid title and subtitle enabled - 2', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });
        await libraryPage.waitForCurtainDisappear();
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        //Move mouse to make sure switching page operation is not blocked by tooltip
        await vizPanelForGrid.moveMouse(50, 0);
        await contentsPanel.goToPage({ chapterName: 'Grid', pageName: 'ModernGrid' });
        //Click the visualization Insert
        await baseVisualization.clickVisualizationTitle('Insert');
        await formatPanel.openTitleContainerFormatPanel();
        //set as right alignment
        await newFormatPanelForGrid.selectFontAlign('right');
        //set the font underlined
        await newFormatPanelForGrid.selectFontStyle('underline');
        //Verify the title bar displayed in the viz
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Insert'),
            'TC99559_4_01',
            'AG Grid Insert with right alignment'
        );
        //Disable titles
        await newFormatPanelForGrid.toggleTitles();
        //Verify the title bar is disabled when the button are disabled
        await since('1. The title bar should be hidden when title bar buttons disabled.')
            .expect(await (await baseVisualization.getTitleBarContainer('Insert')).isDisplayed())
            .toBe(false);
        await takeScreenshotByElement(
            vizPanelForGrid.getGridContainer('Insert'),
            'TC99559_4_02',
            'AG Grid Insert with title bar buttons and titles disabled'
        );
        //Verify the format panel settings
        await takeScreenshotByElement(
            dossierAuthoringPage.getTitleBarSetting(),
            'TC99559_4_03',
            'Title Container Format panel with title buttons and titles disabled'
        );
        //Enable title bar
        await newFormatPanelForGrid.toggleTitleBar();
        //Verify the title bar is displayed again
        await since('2. The title bar should be displayed when title bar enabled again.')
            .expect(await (await baseVisualization.getTitleBarContainer('Insert')).isDisplayed())
            .toBe(true);
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Insert'),
            'TC99559_4_04',
            'AG Grid Insert with title bar buttons disabled and titles enabled'
        );
        //Verify the format panel settings
        await takeScreenshotByElement(
            dossierAuthoringPage.getTitleBarSetting(),
            'TC99559_4_05',
            'Title Container Format panel with title bar enabled, title buttons disabled and titles enabled'
        );

        //Enable title buttons
        await newFormatPanelForGrid.toggleTitleButtons();
        //Verify the title bar and settings
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Insert'),
            'TC99559_4_06',
            'AG Grid Insert with title bar buttons and titles enabled'
        );
        await takeScreenshotByElement(
            dossierAuthoringPage.getTitleBarSetting(),
            'TC99559_4_07',
            'Title Container Format panel with title bar buttons and titles enabled'
        );

        //Enable Transactions
        await baseFormatPanelReact.switchToTransactionOptionsSection();
        await baseFormatPanelReact.toggleTxnTypeOnFormatPanel('Insert Data', true);
        await dossierAuthoringPage.waitForAuthoringPageLoading();

        //Verify the transaction button is displayed in the title bar
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Insert'),
            'TC99559_4_08',
            'AG Grid Insert with transaction button'
        );

        //Format Transaction button
        await formatPanel.openTitleContainerFormatPanel();
        await newFormatPanelForGrid.clickButtonFormatIcon('Transaction');
        await newFormatPanelForGrid.setButtonLabelOption('Icon and text');
        await newFormatPanelForGrid.setButtonAlias('Add New Data');
        await newFormatPanelForGrid.selectButtonTextFontStyle('italic');
        await newFormatPanelForGrid.clickButtonTextFontColorBtn();

        // And I switch the color picker to swatch mode
        await newFormatPanelForGrid.clickColorPickerModeBtn('grid');
        // And I select the built-in color "#D7F6F0" in the color picker
        await newFormatPanelForGrid.clickBuiltInColor('#D7F6F0');
        // And I click to close the color picker
        await newFormatPanelForGrid.clickButtonTextFontColorBtn();
        await newFormatPanelForGrid.clickButtonBackgroundColorBtn();
        await newFormatPanelForGrid.clickColorPickerModeBtn('grid');
        await newFormatPanelForGrid.clickBuiltInColor('#BCB1E2');
        await newFormatPanelForGrid.clickButtonBackgroundColorBtn();

        await newFormatPanelForGrid.openButtonBorderPullDown();
        await newFormatPanelForGrid.selectButtonBorderStyle('solid-thick');
        await newFormatPanelForGrid.clickButtonBorderColorBtn();
        await newFormatPanelForGrid.clickColorPickerModeBtn('grid');
        await newFormatPanelForGrid.clickBuiltInColor('#F56E21');
        await newFormatPanelForGrid.clickButtonBorderColorBtn();

        await baseFormatPanelReact.dismissButtonFormatPopup();
        //Verify the title bar is displayed
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Insert'),
            'TC99559_4_09',
            'AG Grid Insert with modified Transaction button'
        );
        await since('3. The transaction button should be #{expected} instead we have #{actual}')
            .expect(await (await gridAuthoring.selectors.getTitleButton('Insert', 'Transaction')).getAttribute('style'))
            .toBe('border-radius: 0px; background: none 0px 0px no-repeat rgb(188, 177, 226); filter: none; color: rgb(215, 246, 240); font: italic 10pt "Open Sans"; border: 2pt solid rgb(245, 110, 33);');
    });
    it('[TC99559_5] AG grid title and subtitle enabled - 3', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });
        await libraryPage.waitForCurtainDisappear();
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        //Move mouse to make sure switching page operation is not blocked by tooltip
        await vizPanelForGrid.moveMouse(50, 0);
        await contentsPanel.goToPage({ chapterName: 'Grid', pageName: 'ModernGrid' });
        //Click the visualization AllActions

        await baseVisualization.clickVisualizationTitle('AllActions');
        await formatPanel.openTitleContainerFormatPanel();
        //Move mouse to make sure the title setting panel is not covered by the tooltip
        await vizPanelForGrid.moveMouse(50,0);
        //Verify the Title Container Format panel settings
        await takeScreenshotByElement(
            dossierAuthoringPage.getTitleBarSetting(),
            'TC99559_5_01',
            'Title Container Format panel of AllActions'
        );
        //Verify the title bar is displayed
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('AllActions'),
            'TC99559_5_02',
            'AG Grid AllActions with default title buttons'
        );
        //Disable title buttons
        await newFormatPanelForGrid.toggleTitleButtons();
        //Verify the title bar is still displayed because titles are disabled
        await since('1. The title bar should be displayed when title buttons are disabled.')
            .expect(await (await baseVisualization.getTitleBarContainer('AllActions')).isDisplayed())
            .toBe(true);
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('AllActions'),
            'TC99559_5_02_01',
            'AG Grid AllActions with title buttons disabled'
        );
        //undo
        await toolbar.clickButtonFromToolbar('Undo');
        //Verify the title bar is displayed again
        await since('2. The title bar should be displayed when title buttons enabled again.')
            .expect(await (await baseVisualization.getTitleBarContainer('AllActions')).isDisplayed())
            .toBe(true);
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('AllActions'),
            'TC99559_5_02_02',
            'AG Grid AllActions with title buttons enabled'
        );

        //Set the button size to large
        await newFormatPanelForGrid.selectButtonSize('Large');
        //Set the button radius to large radius
        await newFormatPanelForGrid.selectButtonRadius('Large radius');
        //Verify the button size and radius changed
        await since('2. The button size should be Large. The height should be #{expected} instead we have #{actual}')
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.selectors.getTitleButton('AllActions', 'Input'),
                    'height'
                )
            )
            .toBe('32px');
        await since(
            '3. The button size should be Medium. The font size should be #{expected} instead we have #{actual}'
        )
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.selectors.getTitleButton('AllActions', 'Input'),
                    'font-size'
                )
            )
            .toBe('16px');
        //Set Transaction button formatting
        await newFormatPanelForGrid.clickButtonFormatIcon('Transaction');
        //Verify the popup
        await takeScreenshotByElement(
            newFormatPanelForGrid.getButtonFormatPopup(),
            'TC99559_5_03',
            'Button Format popup of Transaction button'
        );
        await newFormatPanelForGrid.setButtonLabelOption('Icon only');
        await newFormatPanelForGrid.clickButtonIconColorBtn();
        await newFormatPanelForGrid.clickColorPickerModeBtn('grid');
        await newFormatPanelForGrid.clickBuiltInColor('#D76322');
        await newFormatPanelForGrid.clickButtonIconColorBtn();
        await baseFormatPanelReact.dismissButtonFormatPopup();
        await gridAuthoring.sleep(1000); //wait for the button style applied
        //Set Export button formatting
        await newFormatPanelForGrid.clickButtonFormatIcon('Export');
        //Verify the popup
        await takeScreenshotByElement(
            newFormatPanelForGrid.getButtonFormatPopup(),
            'TC99559_5_04',
            'Button Format popup of Export button'
        );
        await newFormatPanelForGrid.setExportButtonOption('Export to PDF');
        await newFormatPanelForGrid.selectButtonTextFont('Oleo Script');
        await newFormatPanelForGrid.selectButtonTextFontStyle('underline');
        await newFormatPanelForGrid.clickButtonTextFontColorBtn();
        await newFormatPanelForGrid.clickColorPickerModeBtn('grid');
        await newFormatPanelForGrid.clickBuiltInColor('#DF77A8');
        await newFormatPanelForGrid.clickButtonTextFontColorBtn();
        await newFormatPanelForGrid.clickButtonBackgroundColorBtn();
        await newFormatPanelForGrid.clickColorPickerModeBtn('grid');
        await newFormatPanelForGrid.clickBuiltInColor('#38AE6F');
        await newFormatPanelForGrid.clickButtonBackgroundColorBtn();
        await newFormatPanelForGrid.changeButtonFillColorOpacity('50');
        await newFormatPanelForGrid.openButtonBorderPullDown();
        await newFormatPanelForGrid.selectButtonBorderStyle('none');
        await baseFormatPanelReact.dismissButtonFormatPopup();
        await gridAuthoring.sleep(1000); //wait for the button style applied
        //Set Maximum button formatting
        await newFormatPanelForGrid.clickButtonFormatIcon('Maximize');
        //Verify the popup
        await takeScreenshotByElement(
            newFormatPanelForGrid.getButtonFormatPopup(),
            'TC99559_5_05',
            'Button Format popup of Maximize button'
        );
        await newFormatPanelForGrid.clickButtonIconColorBtn();
        await newFormatPanelForGrid.clickColorPickerModeBtn('grid');
        await newFormatPanelForGrid.clickBuiltInColor('#834FBD');
        await newFormatPanelForGrid.clickButtonIconColorBtn();
        await baseFormatPanelReact.dismissButtonFormatPopup();
        await gridAuthoring.sleep(1000); //wait for the button style applied
        //Set Context Menu button formatting
        await newFormatPanelForGrid.clickButtonFormatIcon('Context menu');
        //Verify the popup
        await takeScreenshotByElement(
            newFormatPanelForGrid.getButtonFormatPopup(),
            'TC99559_5_06',
            'Button Format popup of Context menu button'
        );
        await newFormatPanelForGrid.clickButtonBackgroundColorBtn();
        await newFormatPanelForGrid.clickColorPickerModeBtn('grid');
        await newFormatPanelForGrid.clickBuiltInColor('#D7F6F0');
        await newFormatPanelForGrid.clickButtonBackgroundColorBtn();
        await newFormatPanelForGrid.changeButtonFillColorOpacity('50');
        await baseFormatPanelReact.dismissButtonFormatPopup();
        //Verify the title bar displayed
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('AllActions'),
            'TC99559_5_07',
            'AG Grid AllActions with modified title buttons'
        );
        //Verify the button style
        await since('4. The transaction button should be #{expected} instead we have #{actual}')
            .expect(await (await gridAuthoring.selectors.getTitleButton('AllActions', 'Input')).getAttribute('style'))
            .toBe('background: none 0px 0px no-repeat rgb(255, 255, 255); color: rgb(215, 99, 34); font: 10pt "Open Sans"; border: 1pt solid rgb(202, 202, 202); border-radius: 16px; filter: none;');
        await since('5. The export button should be #{expected} instead we have #{actual}')
            .expect(await (await gridAuthoring.selectors.getTitleButton('AllActions', 'Export')).getAttribute('style'))
            .toBe('background: none 0px 0px no-repeat rgba(56, 174, 111, 0.5); color: rgb(223, 119, 168); font: 10pt "Oleo Script"; border: 1pt none rgb(202, 202, 202); border-radius: 16px; filter: none; text-decoration: underline;');
        await since('6. The maximize button should be #{expected} instead we have #{actual}')
            .expect(await (await gridAuthoring.selectors.getTitleButton('AllActions', 'Maximize')).getAttribute('style'))
            .toBe('background: none 0px 0px no-repeat rgb(255, 255, 255); color: rgb(131, 79, 189); font: 10pt "Open Sans"; border: 1pt solid rgb(202, 202, 202); border-radius: 16px; filter: none;');
        await since('7. The context menu button should be #{expected} instead we have #{actual}')
            .expect(await (await gridAuthoring.selectors.getTitleButton('AllActions', '')).getAttribute('style'))
            .toBe('background: none 0px 0px no-repeat rgba(215, 246, 240, 0.5); color: rgb(0, 0, 0); font: 10pt "Open Sans"; border: 1pt solid rgb(202, 202, 202); border-radius: 16px; filter: none;');
    });
    it('[TC99559_6] AG grid title and subtitle enabled without txn- 4', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });
        await libraryPage.waitForCurtainDisappear();
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        //Move mouse to make sure switching page operation is not blocked by tooltip
        await vizPanelForGrid.moveMouse(50, 0);
        await contentsPanel.goToPage({ chapterName: 'Grid', pageName: 'NormalCompound' });

        await baseVisualization.clickVisualizationTitleContainer('OnlyButton');
        await formatPanel.openTitleContainerFormatPanel();
        //Disable title buttons
        await newFormatPanelForGrid.toggleTitleButtons();
        //Verify the title bar is hidden when buttons are disabled
        await since('1. The title bar should be hidden when titles and title buttons disabled.')
            .expect(await (await baseVisualization.getTitleBarContainer('OnlyButton')).isDisplayed())
            .toBe(false);
        await takeScreenshotByElement(
            vizPanelForGrid.getGridContainer('OnlyButton'),
            'TC99559_6_01',
            'Normal Grid OnlyButton with title and title buttons disabled'
        );
        //click Undo in the toolbar
        await toolbar.clickButtonFromToolbar('Undo');
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        //Verify the title bar is displayed again
        await since('2. The title bar should be displayed when click Undo button in the toolbar.')
            .expect(await (await baseVisualization.getTitleBarContainer('OnlyButton')).isDisplayed())
            .toBe(true);
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('OnlyButton'),
            'TC99559_6_02',
            'Normal Grid OnlyButton with title buttons disabled then undo'
        );
        //Disablt title bar
        await newFormatPanelForGrid.toggleTitleBar();
        //Verify the title bar is hidden when title bar is disabled
        await since('3. The title bar should be hidden when title bar disabled.')
            .expect(await (await baseVisualization.getTitleBarContainer('OnlyButton')).isDisplayed())
            .toBe(false);
        await takeScreenshotByElement(
            vizPanelForGrid.getGridContainer('OnlyButton'),
            'TC99559_6_03',
            'Normal Grid OnlyButton with title bar disabled'
        );
        //Undo the title bar
        await toolbar.clickButtonFromToolbar('Undo');
        //Verify the title bar is displayed again
        await since('4. The title bar should be displayed when click Undo button in the toolbar again.')
            .expect(await (await baseVisualization.getTitleBarContainer('OnlyButton')).isDisplayed())
            .toBe(true);
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('OnlyButton'),
            'TC99559_6_04',
            'Normal Grid OnlyButton with title bar disabled then undo'
        );

        //Click the visualization WithoutTXN
        await contentsPanel.goToPage({ chapterName: 'Grid', pageName: 'ModernGrid' });
        await baseVisualization.clickVisualizationTitle('WithoutTXN');
        await formatPanel.openTitleContainerFormatPanel();
        //Enable title buttons
        await newFormatPanelForGrid.toggleTitleButtons();
        //Verify the title bar is displayed when buttons are enabled
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('WithoutTXN'),
            'TC99559_6_05',
            'Normal Grid WithoutTXN with title buttons enabled'
        );
        //Verify the format panel settings
        await takeScreenshotByElement(
            dossierAuthoringPage.getTitleBarSetting(),
            'TC99559_6_06',
            'Title Container Format panel of WithoutTXN'
        );

        //Hide all 3 buttons
        await newFormatPanelForGrid.clickButtonVisibleIcon('Export'); 
        await newFormatPanelForGrid.clickButtonVisibleIcon('Maximize');
        await newFormatPanelForGrid.clickButtonVisibleIcon('Context menu');
        //Verify the title bar
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('WithoutTXN'),
            'TC99559_6_07',
            'Normal Grid WithoutTXN with title buttons enabled but all buttons hidden'
        );
        //click undo
        await toolbar.clickButtonFromToolbar('Undo');
        //Verify the title bar
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('WithoutTXN'),
            'TC99559_6_08',
            'Normal Grid WithoutTXN with title buttons enabled'
        );

        //Configure TXN
        await baseFormatPanelReact.switchToTransactionOptionsSection();
        await baseFormatPanelReact.clickTxnTypeOnFormatPanel('Use SQL');
        // When I click on the "Continue" button on the alert popup
        await dossierMojo.clickHtBtnOnAlert('Continue');
        // When I click button "Add Table" on Transaction Configuration Editor
        await transactionConfigEditor.clickButton('Add Table');

        // When I select "YGUPostgreSQLWH" with type "DB instance" on Data Catalog of Select Data Source Editor
        await dataSourceEditor.scrollAndSelectItem('DB instance', 'YGUPostgreSQLWH');
        await dataSourceEditor.sleep(2000);

        // When I "check" namespace "public" on table namespace option list of Select Data Source Editor
        await dataSourceEditor.setNamespaceCheckbox('public', true);
        // When I select "Connect" button on table namespace option list in Select Data Source Editor
        await dataSourceEditor.clickNamespaceListButton('Connect');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

        // When I search "ygu_year_category_sls" on Data Catalog of Select Data Source Editor
        await dataSourceEditor.searchForObject('ygu_year_category_sls');
        await dataSourceEditor.selectItemInSuggestionList('table', 'ygu_year_category_sls', 'searchkey');
        // And I click button "Select" on Select Data Source Editor
        await dataSourceEditor.clickButtonOnFooter('Select');

        // When I "check" table column "year_new, cost_new" on Database Table layout of Transaction Configuration Editor
        await transactionConfigEditor.clickTableColumn('year_new');
        await transactionConfigEditor.clickTableColumn('cost_new');

        // When I set dropdown of table column "year_new" from "placeholder" to "Year New@ID" as input value on Mapping View of Transaction Configuration Editor
        await mappingEditor.setDropdown('year_new', 'placeholder', 'Year New@ID');

        // And I set dropdown of table column "cost_new" from "placeholder" to "Cost New@ID" as input value on Mapping View of Transaction Configuration Editor
        await mappingEditor.setDropdown('cost_new', 'placeholder', 'Cost New');
        await transactionConfigEditor.clickWhereClauseButtons('year_new');

        //Modify the action name to MyUpdate
        await transactionConfigEditor.modifyActionName('MyUpdate');
        // And I click button "Done" on Transaction Configuration Editor
        await transactionConfigEditor.clickButton('Done');
        await dossierAuthoringPage.waitForAuthoringPageLoading();

        //Verify the title bar
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('WithoutTXN'),
            'TC99559_6_09',
            'Normal Grid WithoutTXN with transaction configured'
        );
    });

    it('[TC99559_7] title bar xfunctional test', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id
        }); 
        await libraryPage.waitForCurtainDisappear();
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        //Move mouse to make sure switching page operation is not blocked by tooltip
        await vizPanelForGrid.moveMouse(50, 0);
        await contentsPanel.goToPage({ chapterName: 'Grid', pageName: 'NormalCompound' });
        await baseVisualization.clickVisualizationTitleContainer('OnlyButton');
        await vizPanelForGrid.openContextMenu('OnlyButton'); 
        await vizPanelForGrid.selectContextMenuOption('Remove Data');
        await dossierAuthoringPage.waitForAuthoringPageLoading();

        //Verfiy the title bar
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('OnlyButton'),
            'TC99559_7_01',
            'Normal Grid OnlyButton after remove data'
        );
        //Add Objects to the grid
        await datasetPanel.addObjectToVizByDoubleClick('Year New', 'attribute', 'ygu_year_category_sls');
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        //Verfiy the title bar
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('OnlyButton'),
            'TC99559_7_02',
            'Normal Grid OnlyButton after add Year New'
        );

        //Insert a new page
        await toolbar.clickButtonFromToolbar('Add Page');
        await vizPanelForGrid.moveMouse(50, 0);
        await formatPanel.openVizFormatPanel();
        await formatPanel.openTitleContainerFormatPanel();
        //Enable title buttons
        await newFormatPanelForGrid.toggleTitleButtons();
        //Verify the title bar
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Visualization 1'),
            'TC99559_7_03',
            'New page with title buttons enabled'
        );
        //Verify the title bar settings
        await takeScreenshotByElement(
            dossierAuthoringPage.getTitleBarSetting(),
            'TC99559_7_04',
            'Title Container Format panel of new page'
        );
        //DE335015
        await datasetPanel.addObjectToVizByDoubleClick('Year New', 'attribute', 'ygu_year_category_sls');
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await datasetPanel.addObjectToVizByDoubleClick('Category New Id', 'attribute', 'ygu_year_category_sls');
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        //Verify the grid
        await takeScreenshotByElement(
            vizPanelForGrid.getGridContainer('Visualization 1'),
            'TC99559_7_04_DE335015',
            'New page with Year New and Category New Id added'
        );

        //Go to page ModernGrid
        await contentsPanel.goToPage({ chapterName: 'Grid', pageName: 'ModernGrid' });
        await baseVisualization.clickVisualizationTitle('AllActions');
        await formatPanel.openTitleContainerFormatPanel();
        //Open context menu of the grid
        await vizPanelForGrid.openContextMenu('AllActions');
        await vizPanelForGrid.selectContextMenuOption('Clear Transactions');
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        //Verfiy the title bar
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('AllActions'),
            'TC99559_7_05',
            'Modern Grid AllActions after clear transactions'
        );
        //Verify the title bar settings
        await takeScreenshotByElement(
            dossierAuthoringPage.getTitleBarSetting(),
            'TC99559_7_06',
            'Title Container Format panel of Modern Grid AllActions after clear transactions'
        );

        //Click Undo in the toolbar
        await toolbar.clickButtonFromToolbar('Undo');
        await dossierAuthoringPage.waitForAuthoringPageLoading();

        //Open the context menu of the grid
        await vizPanelForGrid.openContextMenu('AllActions');
        await vizPanelForGrid.selectContextMenuOption('Duplicate');
        await dossierAuthoringPage.waitForAuthoringPageLoading();

        //Verify the duplicate grid
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('AllActions copy'),
            'TC99559_7_07',
            'Duplicate Modern Grid AllActions'
        );

        //Go to format panel of the duplicate grid
        await formatPanel.openVizFormatPanel();
        await formatPanel.openTitleContainerFormatPanel();
        //Move mouse to make sure the title setting panel is not covered by the tooltip
        await vizPanelForGrid.moveMouse(50,0);
        //Verify the title bar settings of the duplicate grid
        await takeScreenshotByElement(
            dossierAuthoringPage.getTitleBarSetting(),
            'TC99559_7_08',
            'Title Container Format panel of Duplicate Modern Grid AllActions'
        );

        //Go to the page NormalCompound
        await contentsPanel.goToPage({ chapterName: 'Grid', pageName: 'NormalCompound' });
        //Duplicate the page
        await tocContentsPanel.contextMenuOnPage('NormalCompound', 'Grid', 'Duplicate Page');
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        //Verify the new duplicated page
        await takeScreenshotByElement(
            await dossierPage.getDossierView(),
            'TC99559_7_09',
            'Duplicated page NormalCompound'
        );
    });
    it('[TC99559_8] Customize action names in SQL Transaction', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossierConsumption.project.id,
            dossierId: dossierConsumption.id
        });
        await libraryPage.waitForCurtainDisappear();
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await contentsPanel.goToPage({ chapterName: 'Grid', pageName: 'ModernGridConfig' });
        //Click the visualization Update
        await baseVisualization.clickVisualizationTitle('Update');
        //Open the context menu to edit the transaction
        await vizPanelForGrid.openContextMenu('Update');
        await vizPanelForGrid.selectContextMenuOption('Edit Transaction');
        await transactionConfigEditor.waitForTransactionEditorLoaded();
        //Verify the transaction editor
        await takeScreenshotByElement(
            transactionConfigEditor.getTopBarInTransactionEditor(),
            'TC99559_8_00',
            'Transaction Configuration Editor opened from Update'
        );
        //Change the action name to MyUpdate
        await transactionConfigEditor.modifyActionName('MyUpdate');
        // And I click button "Done" on Transaction Configuration Editor
        await transactionConfigEditor.clickButton('Done');
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        //Verify the title bar
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Update'),
            'TC99559_8_01',
            'AG Grid Update with customized transaction action name'
        );
        //Open the transaction editor to verfiy the action name changed
        await vizPanelForGrid.openContextMenu('Update');
        await vizPanelForGrid.selectContextMenuOption('Edit Transaction');
        await transactionConfigEditor.waitForTransactionEditorLoaded();
        //Verify the action name is MyUpdate
        await since('1. The action name should be {expected} instead we have #{actual}.').expect(await transactionConfigEditor.getActionName()).toBe('MyUpdate');

        await transactionConfigEditor.clickButton('Cancel');
        await dossierAuthoringPage.waitForAuthoringPageLoading();

        //Click the visualization Insert
        await baseVisualization.clickVisualizationTitleContainer('Insert');
        //Open the context menu to edit the transaction
        await vizPanelForGrid.openContextMenu('Insert');
        await vizPanelForGrid.selectContextMenuOption('Edit Transaction');
        await transactionConfigEditor.waitForTransactionEditorLoaded();
        //Verify the transaction editor
        await takeScreenshotByElement(
            transactionConfigEditor.getTopBarInTransactionEditor(),
            'TC99559_8_02_01',
            'Transaction Configuration Editor opened from Insert'
        );
        //Change the action name to MyInsert
        await transactionConfigEditor.modifyActionName('MyInsert');
        // And I click button "Done" on Transaction Configuration Editor
        await transactionConfigEditor.clickButton('Done');
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        //Verify the title bar
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Insert'),
            'TC99559_8_02',
            'AG Grid Insert with customized transaction action name'
        );
        //Open the transaction editor to verfiy the action name changed
        await vizPanelForGrid.openContextMenu('Insert');
        await vizPanelForGrid.selectContextMenuOption('Edit Transaction');
        await transactionConfigEditor.waitForTransactionEditorLoaded();
        //Verify the action name is MyInsert
        await since('2. The action name should be {expected} instead we have #{actual}.').expect(await transactionConfigEditor.getActionName()).toBe('MyInsert');
        await transactionConfigEditor.clickButton('Cancel');
        await dossierAuthoringPage.waitForAuthoringPageLoading();

        //Click the visualization Delete
        await baseVisualization.clickVisualizationTitle('Delete');
        //Open the context menu to edit the transaction
        await vizPanelForGrid.openContextMenu('Delete');
        await vizPanelForGrid.selectContextMenuOption('Edit Transaction');
        await transactionConfigEditor.waitForTransactionEditorLoaded();
        //Verify the transaction editor
        await takeScreenshotByElement(
            transactionConfigEditor.getTopBarInTransactionEditor(),
            'TC99559_8_03_01',
            'Transaction Configuration Editor opened from Delete'
        );
        //Change the action name to MyDelete
        await transactionConfigEditor.modifyActionName('MyDelete');
        // And I click button "Done" on Transaction Configuration Editor
        await transactionConfigEditor.clickButton('Done');
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        //Verify the title bar
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Delete'),
            'TC99559_8_03',
            'AG Grid Delete with customized transaction action name'
        );
        //Open the transaction editor to verfiy the action name changed
        await vizPanelForGrid.openContextMenu('Delete');
        await vizPanelForGrid.selectContextMenuOption('Edit Transaction');
        await transactionConfigEditor.waitForTransactionEditorLoaded();
        //Verify the action name is MyDelete
        await since('3. The action name should be {expected} instead we have #{actual}.').expect(await transactionConfigEditor.getActionName()).toBe('MyDelete');
        await transactionConfigEditor.clickButton('Cancel');
        await dossierAuthoringPage.waitForAuthoringPageLoading();

        //Click the visualization AllActions
        await baseVisualization.clickVisualizationTitle('AllActions');
        //Open the context menu to edit the transaction
        await vizPanelForGrid.openContextMenu('AllActions');
        await vizPanelForGrid.selectContextMenuOption('Edit Transaction');
        await transactionConfigEditor.waitForTransactionEditorLoaded();
        //Change the action name to MyAllActions
        await transactionConfigEditor.modifyActionName('AllDelete');
        //Switch tab
        await transactionConfigEditor.selectTxnTab('Insert Data');
        //Change the action name to MyAllActions
        await transactionConfigEditor.modifyActionName('AllInsert');
        //Switch tab
        await transactionConfigEditor.selectTxnTab('Update Data');
        //Change the action name to MyAllActions
        await transactionConfigEditor.modifyActionName('AllUpdate');
        //Click done
        await transactionConfigEditor.clickButton('Done');
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        //Verify the title bar
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('AllActions'),
            'TC99559_8_04',
            'AG Grid AllActions with customized transaction action names'
        );
        //Open the transaction editor to verfiy the action name changed
        await vizPanelForGrid.openContextMenu('AllActions');
        await vizPanelForGrid.selectContextMenuOption('Edit Transaction');
        await transactionConfigEditor.waitForTransactionEditorLoaded();
        //Verify the action name is AllUpdate
        await since('4. The action name should be {expected} instead we have #{actual}.').expect(await transactionConfigEditor.getActionName()).toBe('AllUpdate');
        //Switch tab
        await transactionConfigEditor.selectTxnTab('Delete Data');
        //Verify the action name is AllDelete
        await since('5. The action name should be {expected} instead we have #{actual}.').expect(await transactionConfigEditor.getActionName()).toBe('AllDelete');
        //Switch tab
        await transactionConfigEditor.selectTxnTab('Insert Data');
        //Verify the action name is AllInsert
        await since('6. The action name should be {expected} instead we have #{actual}.').expect(await transactionConfigEditor.getActionName()).toBe('AllInsert');
        await transactionConfigEditor.clickButton('Cancel');
        await dossierAuthoringPage.waitForAuthoringPageLoading();

        //Modify the action names again to default names
        //Click the visualization Insert
        await baseVisualization.clickVisualizationTitleContainer('Insert');
        //Open the context menu to edit the transaction
        await vizPanelForGrid.openContextMenu('Insert');
        await vizPanelForGrid.selectContextMenuOption('Edit Transaction');
        await transactionConfigEditor.waitForTransactionEditorLoaded();
        //Change the action name to null
        await transactionConfigEditor.modifyActionName('');
        // And I click button "Done" on Transaction Configuration Editor
        await transactionConfigEditor.clickButton('Done');
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        //Verify the title bar
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Insert'),
            'TC99559_8_05',
            'AG Grid Insert with default transaction action name'
        );
        //Click undo
        await toolbar.clickButtonFromToolbar('Undo');
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        //Verfiy the title bar
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Insert'),
            'TC99559_8_06',
            'AG Grid Insert with customized transaction action name'
        );
    });

    it('[TC99559_9] Customizable Title Bar Consumption', async () => {
        await resetDossierState({ credentials: dossierTXN.txnAutoUser, dossier: dossierConsumption });
        await libraryPage.waitForCurtainDisappear();
        await libraryPage.openDossierById({
            projectId: dossierConsumption.project.id,
            dossierId: dossierConsumption.id,
        });

        await libraryPage.waitForCurtainDisappear();

        //Verify the title bar
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('NormalGrid'),
            'TC99559_9_01',
            'NormalGrid with 2 Line Titles'
        );
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('1LineTitle'),
            'TC99559_9_02',
            'NormalGrid with 1 Line Title'
        );
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('OnlyButton'),
            'TC99559_9_03',
            'NormalGrid with only buttons'
        );
        await takeScreenshotByElement(
            vizPanelForGrid.getGridContainer('DisableTitles'),
            'TC99559_9_04',
            'NormalGrid with no title'
        );
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('CompoundGrid'),
            'TC99559_9_05',
            'AG Grid CompoundGrid with customized title buttons'
        );

        //Click export button of OnlyButton
        await baseVisualization.clickTitleBarButtonInConsumption('OnlyButton', 'export');
        //Verify the export option pop up
        await takeScreenshotByElement(
            baseVisualization.getSettingMenu(),
            'TC99559_9_06',
            'Click Normal Grid Export button in consumption'
        );
        await baseVisualization.clickTitleBarButtonInConsumption('OnlyButton', 'export');

        //Click Maximize button of OnlyButton
        await baseVisualization.clickTitleBarButtonInConsumption('OnlyButton', 'maximize');
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
            'TC99559_9_07',
            'Click Normal Grid Maximize button in consumption'
        );
        //Click Maximize button again to restore
        await baseVisualization.clickTitleBarButtonInConsumption('OnlyButton', 'maximize');

        //Click context menu button of OnlyButton
        await baseVisualization.clickTitleBarButtonInConsumption('OnlyButton', 'contextMenu');
        //Verify the context menu pop up
        await takeScreenshotByElement(
            baseVisualization.getSettingMenu(),
            'TC99559_9_08',
            'Click Normal Grid Context Menu button in consumption'
        );
        await baseVisualization.clickTitleBarButtonInConsumption('OnlyButton', 'contextMenu');

        //Go to Page ModernGrid
        await toc.openPageFromTocMenu({ chapterName: 'Grid', pageName: 'ModernGrid' });
        //Verify the title bar
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Update'),
            'TC99559_9_09',
            'AG Grid Update with modified title buttons'
        );
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Insert'),
            'TC99559_9_10',
            'AG Grid Insert with modified title buttons'
        );
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Delete'),
            'TC99559_9_11',
            'AG Grid Delete with modified title buttons'
        );
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('AllActions'),
            'TC99559_9_12',
            'AG Grid AllActions with modified title buttons'
        );
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('WithoutTXN'),
            'TC99559_9_13',
            'AG Grid WithoutTXN with modified title buttons'
        );

        //Click bulk edit button for Update
        await bulkEdit.clickBulkTxnModeIcon('Update');
        //Verify the pop up menu is modified action name
        await takeScreenshotByElement(
            baseVisualization.getSettingMenu(),
            'TC99559_9_14',
            'Click AG Grid Update bulk edit button in consumption'
        );
        await bulkEdit.clickBulkMode('AUpdate');
        //Verify the tool bar
        await takeScreenshotByElement(
            bulkEdit.getBulkEditToolbar('AUpdate'),
            'TC99559_9_15',
            'AG Grid Update bulk edit mode in consumption'
        );
        //Modify one cell
        await bulkEdit.clickBulkTxnGridCellByPosition(8, 4, 'AUpdate');
        await inlineEdit.replaceTextInGridCellAndEnter(8, 4, 'AUpdate', '20000');
        await bulkEdit.clickBulkTxnGridCellByPosition(0, 0, 'AUpdate');
        //Verify Apply button is enabled
        await since('1. The Apply button should be enabled after modified data.')
            .expect((await bulkEdit.getBulkEditSubmitButtonEnabled('AUpdate', 'Apply')).getAttribute('class'))
            .not.toContain('disabled');
        //Click cancel button
        await bulkEdit.clickOnBulkEditSubmitButton('AUpdate', 'Apply');
        //Verify the confirmation dialog
        await takeScreenshotByElement(
            agGrid.getConfirmationPopup(),
            'TC99559_9_15_1',
            'Verify the action name in the confirmation dialog'
        );
        await agGrid.selectConfirmationPopupOption('Cancel');
        await bulkEdit.clickOnBulkEditSubmitButton('AUpdate', 'Cancel');

        //Click AInsert button for Insert
        await baseVisualization.clickTitleBarButtonInConsumption('Insert', 'txn');
        //Verify the bulk edit window pop up
        await takeScreenshotByElement(
            bulkEdit.getBulkEditToolbar('AInsert'),
            'TC99559_9_16',
            'Click AG Grid Insert transaction button in consumption'
        );
        await bulkEdit.clickOnBulkEditSubmitButton('AInsert', 'Cancel');

        //CLick SubmitData button for AllActions
        await baseVisualization.clickTitleBarButtonInConsumption('AllActions', 'txn');
        //Verify the submenu pop up with modified action names
        await takeScreenshotByElement(
            baseVisualization.getSettingMenu(),
            'TC99559_9_17',
            'Click AG Grid AllActions transaction button in consumption'
        );
        await bulkEdit.clickBulkMode('BDelete');
        //Verify the bulk edit tool bar
        await takeScreenshotByElement(
            bulkEdit.getBulkEditToolbar('BDelete'),
            'TC99559_9_18',
            'AG Grid AllActions bulk edit mode in consumption'
        );
        //Click cancel button
        await bulkEdit.clickOnBulkEditSubmitButton('BDelete', 'Cancel');

        //Click on visualization Delete
        await baseVisualization.clickTitleBarButtonInConsumption('Delete', 'txn');
        //Verify the bulk edit window pop up
        await takeScreenshotByElement(
            bulkEdit.getBulkEditToolbar('CDelete'),
            'TC99559_9_18',
            'AG Grid Delete bulk edit mode in consumption'
        );
        await bulkEdit.clickOnBulkEditSubmitButton('CDelete', 'Cancel');

        //Delete for Inline edit
        await agGrid.openContextMenuItemForCellAtPosition(2, 2, 'Delete Row', 'Delete');
        //Verify the confirmation dialog
        await takeScreenshotByElement(
            agGrid.getConfirmationPopup(),
            'TC99559_9_18_1',
            'Verify the action name in the confirmation dialog for Inline edit'
        );
        await agGrid.selectConfirmationPopupOption('Cancel');

        //Hover on AllActions to see old buttons are hide
        await bulkEdit.hoverOnVisualizationContainer('AllActions');
        //Verify the title bar
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('AllActions'),
            'TC99559_9_19',
            'AG Grid AllActions with title buttons modified in consumption'
        );
        //Verify the old button is invalid
        await since('1. The old transaction button should not be displayed.').expect(await bulkEdit.IsMenuButtonValid('AllActions', 'Edit Transaction')).toBe(true);
        await since('2. The old context menu button should not be displayed.').expect(await bulkEdit.IsMenuButtonValid('AllActions', 'Context Menu')).toBe(true);
        await since('3. The old maximize button should not be displayed.').expect(await bulkEdit.IsMenuButtonValid('AllActions', 'Maximize')).toBe(true);

        //Go to page GM
        await toc.openPageFromTocMenu({ chapterName: 'GM', pageName: 'GM' });
        //Verify the title bar
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Bar'),
            'TC99559_9_20',
            'Bar with titles and buttons'
        );
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Pie'),
            'TC99559_9_21',
            'Pie with titles and buttons'
        );
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Line'),
            'TC99559_9_22',
            'Line with titles and buttons'
        );
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Combo'),
            'TC99559_9_23',
            'Combo with titles and buttons'
        );

        //Go to page Map
        await toc.openPageFromTocMenu({ chapterName: 'Map', pageName: 'Page 1' });
        //Verify the title bar
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Mapbox'),
            'TC99559_9_24',
            'Mapbox with titles and buttons'
        );
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('ESRI'),
            'TC99559_9_25',
            'ESRI map with titles and buttons'
        );

        //Go to page DE333223
        await toc.openPageFromTocMenu({ chapterName: 'IW', pageName: 'DE333223' });
        //Click the cell to trigger info window
        await vizPanelForGrid.getGridCellByPosition(2, 1, 'Visualization 1').click();
        await libraryPage.waitForCurtainDisappear();
        await libraryPage.sleep(5000);
        //Verify the title bar of info window
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('IW'),
            'TC99559_9_26',
            'InfoWindow with titles and buttons'
        );

    });

    it('[TC99559_10] Customizable Title Bar Defects', async () => {
        //Test steps for customizable title bar defects
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id
    });
        await libraryPage.waitForCurtainDisappear();
        await dossierAuthoringPage.waitForAuthoringPageLoading();

        //Switch to page DE333196
        await contentsPanel.goToPage({ chapterName: 'Defect', pageName: 'DE333196' });
        //Enter pause mode
        await dossierAuthoringPage.actionOnToolbar('Pause Data Retrieval');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        //Duplicate the grid
        await vizPanelForGrid.openContextMenu('DE333196Grid');
        await vizPanelForGrid.selectContextMenuOption('Duplicate');
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        //Resume the data retrieval
        await dossierAuthoringPage.actionOnToolbar('Resume Data Retrieval');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        //Verify the duplicated grid
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('DE333196Grid copy'),
            'TC99559_10_01',
            'Duplicated DE333196Grid'
        );

        //switch to page DE333220
        await contentsPanel.goToPage({ chapterName: 'Defect', pageName: 'DE333220' });
        //Click the visualization TXN333220
        await baseVisualization.clickVisualizationTitle('TXN333220');
        await formatPanel.openVizFormatPanel(); 
        await formatPanel.openTitleContainerFormatPanel();
        //DE334482 Change the title strings
        await vizPanelForGrid.renameVisualizationByDoubleClick('TXN333220', 'TXNNew');
        //Verify the title bar
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('TXNNew'),
            'TC99559_10_02',
            'DE333220 TXNNew with title changed'
        );
        //Disable title
        await newFormatPanelForGrid.toggleTitles();
        //Verify the title bar
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('TXNNew'),
            'TC99559_10_02_01',
            'DE333220 TXNNew with title disabled'
        );
        //DE334482 Set the title fill color
        await newFormatPanelForGrid.clickTitleBackgroundColorBtn();

        // And I switch the color picker to swatch mode
        await newFormatPanelForGrid.clickColorPickerModeBtn('grid');

        // And I select the built-in color "#FCC95A" in the color picker
        await newFormatPanelForGrid.clickBuiltInColor('#FCC95A');

        // And I close the title background color picker
        await newFormatPanelForGrid.clickTitleBackgroundColorBtn();
        await since('1. Main Title should have background-color #{expected} instead we have #{actual}')
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.selectors.getVisualizationTitleBarRoot('TXNNew'),
                    'background-color'
                )
            )
            .toBe('rgba(252,201,90,1)');
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('TXNNew'),
            'TC99559_10_02_1',
            'DE333220 TXNNew with title background color changed'
        );
        //Click the visualization GM333220
        await baseVisualization.clickVisualizationTitle('GM333220');
        await formatPanel.openTitleContainerFormatPanel();
        //Disable title
        await newFormatPanelForGrid.toggleTitles();
        //Verify the title bar
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('GM333220'),
            'TC99559_10_03',
            'DE333220 GM333220 with title disabled'
        );

        //Go to page DE333242
        await contentsPanel.goToPage({ chapterName: 'Defect', pageName: 'DE333242' });
        //Change the viz to modern gird
        await baseContainer.changeViz("Grid (Modern)", "Normal333242");
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        //Verify the title bar
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Normal333242'),
            'TC99559_10_04',
            'DE333242 Modern Grid with title and buttons'
        );
        //Hover on the button
        await baseVisualization.hoverTitleBarButton('Normal333242', 'export');
        //Verify the tooltip
        await since('2. Tooltip should be displayed for button.')
            .expect(await vizPanelForGrid.getTooltipsText())
            .toBe('Title buttons are inactive in authoring mode. Switch to consumption mode to test functionality.');

        //DE333663
        await baseContainer.openContextMenu('Year New');
        //Verify Context Menue option
        await since('3. Hide "Context Menu" should be displayed for in-canvas selector when title bar is showed.')
            .expect(await (await vizPanelForGrid.getContextMenuOption('Hide Context Menu')).isExisting())
            .toBe(true);
        //Click Hide Title Bar
        await vizPanelForGrid.selectContextMenuOption('Hide Title Bar');
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await baseContainer.openContextMenu('Year New');
        //Verify Context Menue option
        await since('4. Hide "Context Menu" should be displayed for in-canvas selector when title bar is hidden.')
            .expect(await (await vizPanelForGrid.getContextMenuOption('Hide Context Menu')).isExisting())
            .toBe(true);

    });
    it('[TC99559_11] GM and Map to enable titles and buttons', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id
        });
        await libraryPage.waitForCurtainDisappear();
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        //Switch to page GM
        await contentsPanel.goToPage({ chapterName: 'GM', pageName: 'GM' });
        await baseVisualization.clickVisualizationTitle('Bar');
        await formatPanel.openTitleContainerFormatPanel();
        //Enable 2 Lines title
        await dossierAuthoringPage.setTitleStyle('2 Lines');
        //Enable title buttons
        await newFormatPanelForGrid.toggleTitleButtons();
        //Verify the title bar
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Bar'),
            'TC99559_11_01',
            'GM Bar with titles and buttons enabled'
        );

        //Go to Page Map
        await contentsPanel.goToPage({ chapterName: 'Map', pageName: 'Page 1' });
        await baseVisualization.clickVisualizationTitle('Mapbox');
        await formatPanel.openTitleContainerFormatPanel();
        //Enable 2 Lines title
        await dossierAuthoringPage.setTitleStyle('2 Lines');
        //Enable title buttons
        await newFormatPanelForGrid.toggleTitleButtons();
        //Verify the title bar
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Mapbox'),
            'TC99559_11_02',
            'Mapbox with titles and buttons enabled'
        );
        //Click the visualization ESRI
        await baseVisualization.clickVisualizationTitle('ESRI');
        //Enable 2 Lines title
        await dossierAuthoringPage.setTitleStyle('2 Lines');
        //Enable title buttons
        await newFormatPanelForGrid.toggleTitleButtons();
        //Verify the title bar
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('ESRI'),
            'TC99559_11_03',
            'ESRI map with titles and buttons enabled'
        );

        //Go to page KPI
        await contentsPanel.goToPage({ chapterName: 'KPI', pageName: 'Page 1' });
        await baseVisualization.clickVisualizationTitle('KPI');
        await formatPanel.openTitleContainerFormatPanel();
        //Enable 2 Lines title
        await dossierAuthoringPage.setTitleStyle('2 Lines');
        //Enable title buttons
        await newFormatPanelForGrid.toggleTitleButtons();
        //Verify the title bar
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('KPI'),
            'TC99559_11_04',
            'KPI with titles and buttons enabled'
        );
        //Click the visualization MMKPI
        await baseVisualization.clickVisualizationTitle('MMKPI');
        await formatPanel.openTitleContainerFormatPanel();
        //Enable 2 Lines title
        await dossierAuthoringPage.setTitleStyle('2 Lines');
        //Enable title buttons
        await newFormatPanelForGrid.toggleTitleButtons();
        //Verify the title bar
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('MMKPI'),
            'TC99559_11_05',
            'MMKPI with titles and buttons enabled'
        );
        await dossierAuthoringPage.closeDossierWithoutSaving();
    });
    it('[TC99559_12] German User for action name', async () => {
        //relogin with German user
        await libraryPage.switchUser(dossierTXN.txnGermanUser);

        await libraryPage.editDossierByUrl({
            projectId: dossierConsumption.project.id,
            dossierId: dossierConsumption.id
        });
        await libraryPage.waitForCurtainDisappear();
        await dossierAuthoringPage.waitForAuthoringPageLoading();

        //Go to page ModernGridConfig
        await contentsPanel.goToPage({ chapterName: 'Grid', pageName: 'ModernGridConfig' });
        //Click the visualization Update
        await baseVisualization.clickVisualizationTitleContainer('Insert');
        //Open the context menu to edit the transaction
        await vizPanelForGrid.openContextMenu('Insert');
        await vizPanelForGrid.selectContextMenuOption('Transaktion bearbeiten');
        await transactionConfigEditor.waitForTransactionEditorLoaded();
        //Verify the transaction editor
        await takeScreenshotByElement(
            transactionConfigEditor.getTopBarInTransactionEditor(),
            'TC99559_12_01',
            'Transaction Configuration Editor opened from Insert with German User'
        );
        await transactionConfigEditor.modifyActionName('MyInsert');
        // And I click button "Done" on Transaction Configuration Editor
        await transactionConfigEditor.clickButton('Erledigt');
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        //Verify the title bar
        await takeScreenshotByElement(
            baseVisualization.getTitleBarContainer('Insert'),
            'TC99559_12_02',
            'AG Grid Insert with customized transaction action name'
        );

        //Hover on the button to check tooltip
        await baseVisualization.hoverTitleBarButton('Insert', 'txn');
        //Verify the tooltip
        await since('1. Tooltip should be displayed for button. It should be #{expected} instead we have #{actual}.')
            .expect(await vizPanelForGrid.getTooltipsText())
            .toBe('Titelschaltflächen sind im Erstellungsmodus inaktiv. Wechseln Sie in den Nutzungsmodus, um die Funktion zu testen.');
    });

});