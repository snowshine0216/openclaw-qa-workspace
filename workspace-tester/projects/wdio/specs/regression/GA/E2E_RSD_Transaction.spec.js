import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';

describe('Transaction', () => {
    const tutorialProject = {
        id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
        name: 'MicroStrategy Tutorial',
    };
    const documentRestore = {
        id: '32D72C9244BCAB108CC37BA4B60C5CF2',
        name: 'Restore_Opportunity',
        project: tutorialProject,
    };

    const documentTXN = {
        id: '2C58947A469E51ABFB83699CBB2BCF6E',
        name: 'Opportunity Management',
        project: tutorialProject,
    };
    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1600,
        height: 1000,
    };

    let {
        libraryPage,
        loginPage,
        transactionPage,
        selectorObject,
        linkbar,
        dropdown,
        calendar,
        list,
        grid,
        slider,
        stepper,
    } = browsers.pageObj1;

    beforeAll(async () => {
        dropdown = selectorObject.dropdown;
        linkbar = selectorObject.linkbar;
        calendar = transactionPage.calendar;
        list = transactionPage.list;
        slider = transactionPage.slider;
        stepper = transactionPage.stepper;
        await setWindowSize(browserWindow);
        await loginPage.login(browsers.params.credentials);
    });

    beforeEach(async () => {
        await resetDossierState({
            credentials: browsers.params.credentials,
            dossier: documentTXN,
        });
        // restore data first
        await libraryPage.openDossier(documentRestore.name);
        await grid.waitForGridLoaded();
        await transactionPage.goToLibrary();
    });

    afterEach(async () => {
        await transactionPage.goToLibrary();
    });

    it('[TC65588_01] verify transaction on library rsd', async () => {
        // open transaction document
        await libraryPage.openDossier(documentTXN.name);
        // submit transaction with no changes
        await transactionPage.submitChanges();

        // Change  content for TXN service
        const alert = transactionPage.alert;
        await alert.clickOnButtonByName('OK');
        await transactionPage.inputTextFieldByKey('IGK267', 'Update Opportunity name');
        await transactionPage.inputTextFieldByKey('IGK270', 'Update Opportunity description');
        await transactionPage.inputTextFieldByKey('IGK279', 'Update Competitor');
        await transactionPage.inputTextFieldByKey('IGK282', 'Update Competitor Comments');
        await transactionPage.clickOnContainerByKey('IGK288');
        await calendar.chooseCalendar('2019', 'May', '10');
        // check plus button on stepper is disabled
        await expect(await stepper.isBtnDisabled('+')).toBe(true);

        // click minus button twice and plus button once
        await stepper.clickMinusBtn(3);
        await stepper.clickPlusBtn();

        await transactionPage.scrollOnPage(400);
        await transactionPage.inputTextFieldByKey('IGK306', 'Update Action Description');
        // choose 'Commit' for Opportunity Status
        await list.selectListItem('Commit');

        // submit changes
        await transactionPage.scrollPageToTop();
        await transactionPage.submitChanges();
        await alert.clickOnButtonByName('OK', 3000);

        // switch panel
        await linkbar.selectNthItem(1, 'Open opportunity');

        // fill in Opportunity name
        await transactionPage.inputTextFieldByKey('IGK54', 'New Opportunity name');
        // fill in Opportunity description
        await transactionPage.inputTextFieldByKey('IGK56', 'New Opportunity description');
        // fill in Company
        await transactionPage.inputTextFieldByKey('IGK101', 'New Company');
        // check Is a customer
        await transactionPage.clickOnContainerByKey('IGK97');
        // fill in OpenDate
        await transactionPage.clickOnContainerByKey('IGK73');

        await calendar.chooseCalendar('2019', 'May', '10');
        // fill in Estimated closing date
        await transactionPage.clickOnContainerByKey('IGK93');
        await calendar.chooseCalendar('2019', 'May', '11');
        // fill in Sales Person
        await transactionPage.inputTextFieldByKey('IGK79', 'New Sales Person');

        // fill in Opportunity Size
        await slider.dragSlider({ x: 104, y: 0 });
        // submit changes with no fill required field
        await transactionPage.submitChanges();
        await alert.clickOnButtonByName('OK');

        // fill in Competitor
        await transactionPage.inputTextFieldByKey('IGK81', 'New Competitor');
        // fill in Competitor comments
        await transactionPage.inputTextFieldByKey('IGK85', 'New Competitor Comments');
        // Sroll page and fill in Action Description
        await transactionPage.scrollOnPage(200);
        await transactionPage.inputTextFieldByKey('IGK118', 'New Action Description');
        // choose 'Commit' for Opportunity Status
        await list.selectListItem('Commit');

        // Submit Changes
        await transactionPage.scrollPageToTop();
        await transactionPage.submitChanges();
        await alert.clickOnButtonByName('OK', 3000);

        // Swith Panel to check data
        await linkbar.selectNthItem(2, 'Edit opportunities');
        await dropdown.openDropdown();
        await dropdown.selectItemByText('New Opportunity name:6');
    });
});
