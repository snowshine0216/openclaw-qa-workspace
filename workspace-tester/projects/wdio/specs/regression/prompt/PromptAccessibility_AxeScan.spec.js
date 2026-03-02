import { customCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { runAxe } from '../../../utils/axeAnalyzer.js';

const specConfiguration = { ...customCredentials('_prompt') };

const axeConfig = {
    tags: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
    disabledRules: [
        // 'color-contrast'
    ],
    ignoredImpact: [
        // 'critical'
    ],
};

describe('Prompt - Accessibility', () => {
    const project = {
        id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
        name: 'MicroStrategy Tutorial',
    };
    const ae = {
        id: 'DF7503764288F69BA1CF36A888709C17',
        name: 'AE with all style',
        project,
    };
    const value = {
        id: '7B9B45974B6718250A6969BAC4CB20B4',
        name: 'value prompt with all style',
        project,
    };

    const browserWindow = {
        width: 1600,
        height: 1000,
    };
    const { credentials } = specConfiguration;
    let prompt;

    let { loginPage, promptObject, libraryPage, promptEditor } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);

        await setWindowSize(browserWindow);
    });

    it('[TC91053] Validate the Axe scan of AE Prompt accessibility', async () => {
        await resetDossierState({ credentials, dossier: ae });
        await libraryPage.openDossierNoWait(ae.name);
        await promptEditor.waitForEditor();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Year - Check box');
        // Scan for summary
        console.log('Axe for AE prompt summary');
        await runAxe(libraryPage, '.mstrd-PromptEditor', axeConfig, false);
        await promptEditor.toggleViewSummary();

        // Scan all AE prompt - check box and list
        prompt = await promptObject.getPromptByName('Year - Check box');
        console.log('Axe for AE prompt - check box and list');
        await runAxe(libraryPage, '.mstrd-PromptEditor', axeConfig, false);

        // Open page switch index
        await promptObject.clickItemCountText(prompt);
        console.log('Axe for AE prompt - page switch index popup');
        await runAxe(libraryPage, '.mstrPopup.mstrAsPopup', axeConfig, false);

        // Scan all AE prompt - pull down and radio button
        await promptObject.selectPromptByIndex({ index: '3', promptName: 'Year - Pull down' });
        await promptEditor.waitForEditor();
        console.log('Axe for AE prompt - pull down and radio button');
        await runAxe(libraryPage, '.mstrd-PromptEditor', axeConfig, false);
        prompt = await promptObject.getPromptByName('Year - Pull down');
        // Open pull down
        await promptObject.pulldown.togglePullDownList(prompt);
        console.log('Axe for AE prompt - pull down popup');
        await runAxe(libraryPage, '.mstrListBlock.mstrAsPopup', axeConfig, false);

        // Scan all AE prompt - shopping cart
        await promptObject.selectPromptByIndex({ index: '5', promptName: 'Year - Shopping Cart' });
        await promptEditor.waitForEditor();
        console.log('Axe for AE prompt - shopping cart');
        await runAxe(libraryPage, '.mstrd-PromptEditor', axeConfig, false);

        // Scan for summary - no selection
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem('Year - Check box');
        console.log('Axe for AE prompt summary - no selection');
        await runAxe(libraryPage, '.mstrd-PromptEditor', axeConfig, false);

        await promptEditor.cancelEditor();
    });

    // it('[TC91054] Validate the Axe scan of Value Prompt accessibility', async () => {
    //     await resetDossierState({ credentials, dossier: value });
    //     await libraryPage.openDossierNoWait(value.name);
    //     await promptEditor.waitForEditor();

    //     // Scan all value prompt - number and big decimal
    //     console.log('Axe for value prompt - number and big decimal');
    //     await runAxe(libraryPage, '.mstrd-PromptEditor', axeConfig, true);

    //     // Switch to value prompt - date and text
    //     await promptObject.selectPromptByIndex({ index: '6', promptName: 'Number - wheel' });

    //     // Scan value prompt - calendar popup
    //     prompt = await promptObject.getPromptByName('Date - textbox');
    //     await promptObject.calendar.openCalendar(prompt);
    //     console.log('Axe for value prompt - calendar popup');
    //     await runAxe(libraryPage, '.mstrCalendar.mstrAsPopup', axeConfig, true);

    //     // Scan value prompt - month drop down popup
    //     await promptObject.calendar.openMonthDropDownMenu(prompt);
    //     console.log('Axe for value prompt - month drop down popup');
    //     await runAxe(libraryPage, '.showlist', axeConfig, true);

    //     // Scan all value prompt - date and text
    //     console.log('Axe for value prompt - date and text');
    //     await runAxe(libraryPage, '.mstrd-PromptEditor', axeConfig, true);

    //     // Scan for summary
    //     await promptEditor.toggleViewSummary();
    //     await promptEditor.waitForSummaryItem('Number - wheel');
    //     console.log('Axe for AE prompt summary');
    //     await runAxe(libraryPage, '.mstrd-PromptEditor', axeConfig, true);

    //     await promptEditor.cancelEditor();
    // });
});

export const config = specConfiguration;
