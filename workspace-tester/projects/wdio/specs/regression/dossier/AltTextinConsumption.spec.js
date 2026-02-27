import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { customCredentials } from '../../../constants/index.js';
import { takeScreenshot, takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

const specConfiguration = { ...customCredentials('_ps') };

describe('AltTextinConsumption', () => {
    const imageDossier = {
        id: '5964AAA14634346C43B279B4EBE248A6',
        name: '(Auto) Alt text - image',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const gridDossier = {
        id: 'DA7BA8CA419ACAC9E6D0E0BD5D3C26D4',
        name: '(Auto) Alt text - normal grid',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const gridSwapDossier = {
        id: '8753C2FB49DF05BEC5B7DEB99A56D19E',
        name: '(Auto) Alt text - normal grid swap',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const gridOutlineDossier = {
        id: '38507F0745B13DA0ACC7189D2A144C00',
        name: '(Auto) Alt text - normal grid outline',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const gridOutlineSwapDossier = {
        id: 'EEE1B6924FD5ED7A0D21C184682FCBFD',
        name: '(Auto) Alt text - normal grid outline swap',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const compoundGrid = {
        id: '72A1941E408168456C38E98483226F6A',
        name: '(Auto) Alt text - compound Grid',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const agGrid = {
        id: '9320295B495B297208CCBE94D6C2511E',
        name: '(Auto) Alt text - AG Grid',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const { credentials } = specConfiguration;
    let prompt, textbox, cart, calendar;

    let {
        loginPage,
        dossierPage,
        libraryPage,
        libraryAuthoringPage,
        imageContainer,
        threshold,
        formatPanel,
        grid,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);
        await setWindowSize({
            width: 1000,
            height: 800,
        });
    });

    afterEach(async () => {
        await libraryAuthoringPage.goToHome();
    });

    it('[TC97894_05] Validate Function of Image Alternative Text in Library Web - Image - Consumption', async () => {
        await libraryPage.openDossier(imageDossier.name);

        // Check all image alt text
        const expectedAltList = [
            "Relative path: ./images/balloonpp_yellow.png",
            "javascript:alert('click me!')",
            "Relative path: /images/balloonpp_yellow.png",
            "!@#$%^&*()abcdefghijklmnopqrsduvwxyz12346",
            "Relative path: images/balloonpp_yellow.png",
            "Relative path: servlet/images/balloonpp_yellow.png",
            "Relative path: /servlet/images/balloonpp_yellow.png",
            `<!doctype html><html lang="en"><head><title><test></title></head><body><h1><test></h1></body></html>`,
            "{&WEBSERVER}/../../images/BadgeInbox.png"
        ];
        const altTexts = await imageContainer.allAltTexts();
        await since('The all image Alt text matched is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await imageContainer.isAllAltMatched(expectedAltList, altTexts))
            .toBe(true);
    });

    it('[TC97894_06] Validate Function of Image Alternative Text in Library Web - normalgrid - Consumption', async () => {
        await libraryPage.openDossier(gridDossier.name);
        const expectedAltList = [
            "ttttttt",
            "Yellow Horizontal Arrows",
            "Yellow Retail Store",
            "ttttttt",
            "break",
            "Green Retail Store",
            "Yellow Horizontal Arrows",
            'Yellow Retail Store',
            "Yellow Horizontal Arrows",
            "Yellow Retail Store",
            "break",
            "break",
            "Green Retail Store",
            "break",
            "Green Retail Store"
        ];
        const altTexts = await grid.getAllThresholdImageAlt('Visualization 1');
        await since('The threshold Alt text matched is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await imageContainer.isAllAltMatched(expectedAltList, altTexts))
            .toBe(true);
    });

    it('[TC97894_07] Validate Function of Image Alternative Text in Library Web - grid swap - Consumption', async () => {
        await libraryPage.openDossier(gridSwapDossier.name);
        const expectedAltList = [
            "ttttttt",
            "ttttttt",
            "break",
            "Yellow Horizontal Arrows",
            "break",
            "Yellow Horizontal Arrows",
            "Yellow Horizontal Arrows",
            "break",
            "break",
            "Yellow Retail Store",
            "Green Retail Store",
            "Yellow Retail Store",
            "Yellow Retail Store",
            "Green Retail Store",
            "Green Retail Store"
        ];
        const altTexts = await grid.getAllThresholdImageAlt('Visualization 1');
        await since('The threshold Alt text matched is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await imageContainer.isAllAltMatched(expectedAltList, altTexts))
            .toBe(true);
    });

    it('[TC97894_08] Validate Function of Image Alternative Text in Library Web - grid outline - Consumption', async () => {
        await libraryPage.openDossier(gridOutlineDossier.name);
        const expectedAltList = [
            "Green Truck",
            "Yellow Truck",
            "break",
            "Yellow Truck",
            "Yellow Truck",
            "Red Truck",
            "Yellow Truck",
            "Green Truck",
            "TTTT",
            "Green Truck"
        ];
        const altTexts = await grid.getAllThresholdImageAlt('Visualization 1');
        await since('The threshold Alt text matched is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await imageContainer.isAllAltMatched(expectedAltList, altTexts))
            .toBe(true);
    });

    it('[TC97894_09] Validate Function of Image Alternative Text in Library Web - grid outline swap - Consumption', async () => {
        await libraryPage.openDossier(gridOutlineSwapDossier.name);
        const expectedAltList = [
            "break",
            "break",
            "Red Truck",
            "Red Truck",
            "`~@#$%^&*()_+{}|;:'<>?,./①I",
            "`~@#$%^&*()_+{}|;:'<>?,./①I",
            "Yellow Truck",
            "Yellow Truck",
            "Yellow Truck",
            "Yellow Truck",
            "Green Truck",
            "Green Truck",
            "Green Truck"
        ];
        const altTexts = await grid.getAllThresholdImageAlt('Visualization 1');
        await since('The threshold Alt text matched is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await imageContainer.isAllAltMatched(expectedAltList, altTexts))
            .toBe(true);
   });

   it('[TC97894_10] Validate Function of Image Alternative Text in Library Web - compound grid - Consumption', async () => {
    await libraryPage.openDossier(compoundGrid.name);
    const expectedAltList = [
    ]
    const altTexts = await grid.getAllThresholdImageAlt('Visualization 1');
        await since('The threshold Alt text matched is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await imageContainer.isAllAltMatched(expectedAltList, altTexts))
            .toBe(true);
   });

   it('[TC97894_11] Validate Function of Image Alternative Text in Library Web - AG grid - Consumption', async () => {
    await libraryPage.openDossier(agGrid.name);
    const expectedAltList = [
    ]
    const altTexts = await grid.getAllThresholdImageAlt('Visualization 1');
        await since('The threshold Alt text matched is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await imageContainer.isAllAltMatched(expectedAltList, altTexts))
            .toBe(true);
   });

});

export const config = specConfiguration;
