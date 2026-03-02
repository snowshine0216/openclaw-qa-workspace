import { customCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';
import resetBookmarks from '../../../api/resetBookmarks.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshot, takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import {
    getAttributeValue,
    getAccAtributesOfElement,
    getAtributesValueOfElement,
} from '../../../utils/getAttributeValue.js';

const specConfiguration = { ...customCredentials('_acc') };

describe('Accessibility test of Share Bookmark', () => {
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    const dossier = {
        id: '957A9C7B462A52FA24A07B8BA02F788F',
        name: 'Dossier sanity_General',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    let { loginPage, dossierPage, libraryPage, share, shareDossier } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);
        await setWindowSize(browserWindow);
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC82143] Validate accessibility of share dialog working as expected with JAWS and VoiceOver', async () => {
        await libraryPage.openDossierAndRunPrompt(dossier.name);
        await share.openSharePanel();
        await share.openShareDossierDialog();
        const shareBookmarkListWithoutRecipient = `button,Close,0
combobox,Add Recipients,0
null,null,0
null,null,0
null,null,0`;
        await since(
            'Role, arialabel, tabindex for shareDossierDialogWithoutRecipient is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(
                await getAccAtributesOfElement(await shareDossier.getShareDossierDialog(), [
                    'role',
                    'ariaLabel',
                    'tabIndex',
                ])
            )
            .toBe(shareBookmarkListWithoutRecipient);
        await since(
            'ariaAutoComplete, ariaExpanded for RecipientSearchBox is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(
                await getAccAtributesOfElement(await shareDossier.getRecipientSearchBox(), [
                    'ariaAutoComplete',
                    'ariaExpanded',
                ])
            )
            .toBe('list,false');
        await shareDossier.tab();
        const noResult = 'noResult';
        await shareDossier.input(noResult);
        await shareDossier.waitForSearchListPresent();
        await since('Role for searchListWithNoResult is supposed to be #{expected}, instead we have #{actual}')
            .expect(await getAttributeValue(await shareDossier.getRecipientSearchMsg(), 'role'))
            .toBe('alert');
        await since('tabindex for searchListWithNoResult is supposed to be #{expected}, instead we have #{actual}')
            .expect(await getAttributeValue(await shareDossier.getRecipientSearchMsg(), 'tabIndex'))
            .toBe(-1);
        await shareDossier.tab();
        const group = 'accessibility';
        await shareDossier.input(group);
        await shareDossier.waitForSearchListPresent();
        const searchListWithGroup = `menuitem,Accessibility,0
button,Expand,0`;
        await since(
            'Role, arialabel, tabindex for searchListWithGroup is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(
                await getAccAtributesOfElement(await shareDossier.getSearchList(), ['role', 'ariaLabel', 'tabIndex'])
            )
            .toBe(searchListWithGroup);
        await shareDossier.tab();
        await takeScreenshotByElement(shareDossier.getShareDossierDialog(), 'TTC82143', 'searchListWithGroup');
        await shareDossier.enter();
        const user = 'tester_auto_acc';
        await shareDossier.input(user);
        await shareDossier.waitForSearchListPresent();
        const searchListWithUser = `menuitem,null,0`;
        await since(
            'Role, arialabel, tabindex for searchListWithUser is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(
                await getAccAtributesOfElement(await shareDossier.getSearchList(), ['role', 'ariaLabel', 'tabIndex'])
            )
            .toBe(searchListWithUser);
        await shareDossier.tab();
        await libraryPage.enter();
        const recipientSearchSection = `button,Accessibility,0
button,Delete,0
button,tester_auto_acc,0
button,Delete,0
combobox,Add Recipients,0`;
        await since(
            'Role, arialabel, tabindex for RecipientSearchBox is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(
                await getAccAtributesOfElement(await shareDossier.getRecipientSearchBox(), [
                    'role',
                    'ariaLabel',
                    'tabIndex',
                ])
            )
            .toBe(recipientSearchSection);
        const shareBookmarkListWithRecipient = `button,Close,0
button,Accessibility,0
button,Delete,0
button,tester_auto_acc,0
button,Delete,0
combobox,Add Recipients,0
null,null,0
null,null,0
null,null,0`;
        await since(
            'Role, arialabel, tabindex for shareDossierDialogWithRecipient is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(
                await getAccAtributesOfElement(await shareDossier.getShareDossierDialog(), [
                    'role',
                    'ariaLabel',
                    'tabIndex',
                ])
            )
            .toBe(shareBookmarkListWithRecipient);
        await takeScreenshotByElement(dossierPage.getLeftNavBar(), 'TTC82143', 'ShareDialog');
        await shareDossier.tab();
        await shareDossier.tab();
        await libraryPage.enter();
    });
});

export const config = specConfiguration;
