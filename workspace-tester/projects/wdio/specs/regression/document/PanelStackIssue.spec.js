import resetDossierState from '../../../api/resetDossierState.js';
import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_RSD') };
const { credentials } = specConfiguration;

describe('RSD_PanelStackIssue', () => {
    const document = {
        id: '5CCBC2E2476FDFA8F8C3E9B506F2D687',
        name: 'TC2906 - Library',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let { loginPage, libraryPage, toc, dossierPage, panelStack } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC80305] Validate Clip Option for Panel Stack', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: document,
        });

        await libraryPage.openDossier(document.name);

        const panelStackNoClip = panelStack.create('PanelStack 1');
        await since('Panel stack > Properties and Formatting > Layout > Content Overflow > Scroll')
            .expect(await panelStackNoClip.hasPanelScrollBar('K34'))
            .toBe(true);

        // navigate to second panel
        await toc.openMenu();
        await toc.goToPage({ chapterName: 'Layout 2' });
        const panelStackClip = panelStack.create('Panel Stack734');
        await since('Panel stack > Properties and Formatting > Layout > Content Overflow > Clip')
            .expect(await panelStackClip.hasPanelScrollBar('K3803A44F4BD5B0EBCA4284B6C84955EC'))
            .toBe(false);
    });

    it('[TC80304] Validate panel navigation icon shows up and works well', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: document,
        });
        // 1. Run Document on presentation mode
        await libraryPage.openDossier(document.name);

        // 2. Navigate panels in 1st panel stack
        const panelStackNoClip = panelStack.create('PanelStack 1');
        const panelStackNoClipPanelTitle0 = 'Panel1-scroll';
        const panelStackNoClipPanelTitle1 = 'Panel1-2';
        await since(`Initial rendering, panel[${panelStackNoClipPanelTitle0}] should be displayed`)
            .expect(await panelStackNoClip.getTitle().getTitleText())
            .toBe(panelStackNoClipPanelTitle0);
        await since(`Grid within panel[${panelStackNoClipPanelTitle0}] should be displayed`)
            .expect(
                await panelStackNoClip
                    .getPanelStack()
                    .$('div[k="W37E13E91AFE24DE7ACA958F3611618E2"] table[role="grid"]')
                    .isDisplayed()
            )
            .toBe(true);

        await panelStackNoClip.getTitle().clickRightArrow();
        await since(`Navigate to right, panel[${panelStackNoClipPanelTitle1}] should be displayed`)
            .expect(await panelStackNoClip.getTitle().getTitleText())
            .toBe(panelStackNoClipPanelTitle1);
        await since(`Graph within panel[${panelStackNoClipPanelTitle1}] should be displayed`)
            .expect(await panelStackNoClip.getPanelStack().$('div.mstrmojo-DocXtabGraph[id*="kW61"]').isDisplayed())
            .toBe(true);

        await panelStackNoClip.getTitle().clickLeftArrow();
        await since(`Navigate to left, panel[${panelStackNoClipPanelTitle0}] should be displayed`)
            .expect(await panelStackNoClip.getTitle().getTitleText())
            .toBe(panelStackNoClipPanelTitle0);

        // 3. Navigate panels in 2nd panel stack
        await toc.openMenu();
        await toc.goToPage({ chapterName: 'Layout 2' });
        const panelStackClip = panelStack.create('Panel Stack734');
        const panelStackClipPanelTitle0 = 'Panel2-clip';
        const panelStackClipPanelTitle1 = 'Panel2-2';
        await since(`Initial rendering, panel[${panelStackClipPanelTitle0}] should be displayed`)
            .expect(await panelStackClip.getTitle().getTitleText())
            .toBe(panelStackClipPanelTitle0);
        await since(`Grid within panel[${panelStackClipPanelTitle0}] should be displayed`)
            .expect(
                await panelStackClip
                    .getPanelStack()
                    .$('div[k="KACD3C2CC42BFD5F152281988CB0986E3"] table[role="grid"]')
                    .isDisplayed()
            )
            .toBe(true);

        await panelStackClip.getTitle().clickRightArrow();
        await since(`Navigate to right, panel[${panelStackClipPanelTitle1}] should be displayed`)
            .expect(await panelStackClip.getTitle().getTitleText())
            .toBe(panelStackClipPanelTitle1);
        await since(`Graph within panel[${panelStackClipPanelTitle1}] should be displayed`)
            .expect(
                await panelStackClip
                    .getPanelStack()
                    .$('div.mstrmojo-DocXtabGraph[id*="lK3A0DF25A4A7ADC907693BBA3A2D0E0DA"]')
                    .isDisplayed()
            )
            .toBe(true);

        await panelStackClip.getTitle().clickLeftArrow();
        await since(`Navigate to left, panel[${panelStackClipPanelTitle0}] should be displayed`)
            .expect(await panelStackClip.getTitle().getTitleText())
            .toBe(panelStackClipPanelTitle0);
    });
});

export const config = specConfiguration;
