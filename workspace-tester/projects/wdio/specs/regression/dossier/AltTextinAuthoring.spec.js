import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { customCredentials } from '../../../constants/index.js';
import { takeScreenshot, takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

const specConfiguration = { ...customCredentials('_ps') };

describe('AltTextinAuthoring', () => {
    const imageDossier = {
        id: '68A49FB64B78DECA1EF6E2B4EF31EA63',
        name: '(Auto) Alt text - only image',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const gridDossier = {
        id: '63ED96C44A7E4B0C490E69A523B83FB7',
        name: '(Auto) Alt text - only grid',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const gridDossier2 = {
        id: 'DC8F2BA84D06987C8366CDA3DD313F2E',
        name: '(Auto) Alt text - only grid - attribute',
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

    it('[TC97894] Validate Function of Image Alternative Text in Library Web - Image - Authoring', async () => {
        await libraryPage.editDossierByUrl({
            projectId: imageDossier.project.id,
            dossierId: imageDossier.id,
        });
        await takeScreenshotByElement(formatPanel.getFormatDetail(), 'TC97894', 'formatpanel');

        // Add alt text
        await imageContainer.changeAltText('add alt text');
        await imageContainer.clickImageinAuthoring(0);
        await since('The image Alt text in inputbox is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await imageContainer.altText())
            .toBe('add alt text');
        await since('The image Alt text in img tag should be #{expected}, instead we have #{actual}')
            .expect(await imageContainer.imageAlt(0))
            .toBe('add alt text');
        // Change alt text
        await imageContainer.changeAltText('\`~@#$%^&*()_+{}|;:\'<>?,./①I');
        await imageContainer.clickImageinAuthoring(0);
        await since('The image Alt text in inputbox is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await imageContainer.altText())
            .toBe('\`~@#$%^&*()_+{}|;:\'<>?,./①I');
        await since('The image Alt text in img tag should be #{expected}, instead we have #{actual}')
            .expect(await imageContainer.imageAlt(0))
            .toBe('\`~@#$%^&*()_+{}|;:\'<>?,./①I');
        // Change image with absolute path
        await imageContainer.changeImageURL('https://express-server.bj.bcebos.com/express-brand-card/head/rIcon/yunda.png');
        await imageContainer.confirmImageURL();
        await formatPanel.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await imageContainer.clickImageinAuthoring(0);

        await since('The image Alt text in inputbox is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await imageContainer.altText())
            .toBe('\`~@#$%^&*()_+{}|;:\'<>?,./①I');
        await since('The image Alt text in img tag should be #{expected}, instead we have #{actual}')
            .expect(await imageContainer.imageAlt(0))
            .toBe('\`~@#$%^&*()_+{}|;:\'<>?,./①I');
        await since('Image URL source should be #{expected}, instead we have #{actual}')
            .expect(await imageContainer.imageURL(0))
            .toBe('https://express-server.bj.bcebos.com/express-brand-card/head/rIcon/yunda.png');

        // Change image with relative path
        await imageContainer.changeImageURL('images/balloonpp_yellow.png');
        await imageContainer.confirmImageURL();
        await formatPanel.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await imageContainer.clickImageinAuthoring(0);

        await since('The image Alt text in inputbox is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await imageContainer.altText())
            .toBe('\`~@#$%^&*()_+{}|;:\'<>?,./①I');
        await since('The image Alt text in img tag should be #{expected}, instead we have #{actual}')
            .expect(await imageContainer.imageAlt(0))
            .toBe('\`~@#$%^&*()_+{}|;:\'<>?,./①I');
        await since('Image URL source should be #{expected}, instead we have #{actual}')
            .expect(await imageContainer.imageURL(0))
            .toContain('images/balloonpp_yellow.png');
        // Delete alt text
        // await imageContainer.changeAltText('');
        // await imageContainer.clickImageinAuthoring(0);
        // await since('The image Alt text in inputbox is supposed to be "#{expected}", instead we have "#{actual}"')
        //     .expect(await imageContainer.altText())
        //     .toBe('\`~@#$%^&*()_+{}|;:\'<>?,./');
        // await imageContainer.changeAltText('');
        // await imageContainer.clickImageinAuthoring(0);
        // await since('The image Alt text in inputbox is supposed to be "#{expected}", instead we have "#{actual}"')
        //     .expect(await imageContainer.isAltTextNotEmpty())
        //     .toBe(false);
        // await since('The image Alt text in img tag should be #{expected}, instead we have #{actual}')
        //     .expect(await imageContainer.isAltTagNotEmpty(0))
        //     .toBe(false);
    });

    it('[TC97894_02] Validate Function of Image Alternative Text in Library Web - Metric Thresholds - Authoring', async () => {
        await libraryPage.editDossierByUrl({
            projectId: gridDossier.project.id,
            dossierId: gridDossier.id,
        });
        await grid.selectGridContextMenuOption({
            title: 'Visualization 1',
            headerName: 'Cost',
            firstOption: 'Thresholds...',
        });
        await threshold.chooseImageBased();
        

        await threshold.switchAdvThreshold();
        await threshold.confirmSwitchToAdvThreshold();
        //check ootb image alt text in preview
        await since('The threshold Alt text in preview is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await threshold.previewImageAlt(0))
            .toBe('Red Down Arrows');

        await threshold.openAdvThresholdDetail(0);
        await takeScreenshotByElement(threshold.getAdvThresholdDetail(), 'TC97894_02', 'DeaultAlt');
        //change alt text
        await threshold.changeAltText('new Red Down Arrows');
        //check input text no text now？？？

        await threshold.confirmAdvThresholdDetail();
        //check changed image alt text in preview after change
        await since('The threshold Alt text in preview after change is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await threshold.previewImageAlt(0))
            .toBe('new Red Down Arrows');
        await threshold.confirmThreshold();
        await formatPanel.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await dossierPage.sleep(2000);//wait for change take effect in element

        //check alt in grid
        await since('The first image alt of Cost metic should be #{expected}, instead we have #{actual}')
            .expect(await grid.getThresholdImageAlt(0))
            .toBe('new Red Down Arrows');
        await since('The first image url of Cost metic should be #{expected}, instead we have #{actual}')
            .expect(await grid.getThresholdImageURL(0))
            .toContain('quickThresholdImgs/red_arrow.png');
        
        //change metric Threshold
        await grid.selectGridContextMenuOption({
            title: 'Visualization 1',
            headerName: 'Cost',
            firstOption: 'Edit Thresholds...',
        });
        await threshold.openAdvThresholdDetail(0);

        //change image URL will clear alt
        await threshold.changeImageURL('images/balloonpp_yellow.png');
        await takeScreenshotByElement(threshold.getAdvThresholdDetail(), 'TC97894_03', 'NoDeaultAlt');
        await threshold.confirmAdvThresholdDetail();

        //check changed image alt text in preview after change image
        await since('Image URL source should be #{expected}, instead we have #{actual}')
            .expect(await threshold.previewImageURL(0))
            .toContain('images/balloonpp_yellow.png');
        await since('The image Alt text in img tag should be #{expected}, instead we have #{actual}')
            .expect(await threshold.isPreviewImageAltTagNotEmpty(0))
            .toBe(true);
        
        //change alt text
        await threshold.openAdvThresholdDetail(0);
        await threshold.changeAltText('javascript:alert(\'click me!\')');
        await threshold.confirmAdvThresholdDetail();
        await since('Image URL source should be #{expected}, instead we have #{actual}')
            .expect(await threshold.previewImageURL(0))
            .toContain('images/balloonpp_yellow.png');
        await since('The threshold Alt text in preview is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await threshold.previewImageAlt(0))
            .toBe('javascript:alert(\'click me!\')');

        await threshold.confirmThreshold();
        await formatPanel.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await dossierPage.sleep(2000);//wait for change take effect in element

        //check alt in grid
        await since('The first image url of Cost metic should be #{expected}, instead we have #{actual}')
            .expect(await grid.getThresholdImageURL(0))
            .toContain('images/balloonpp_yellow.png');
        await since('The first image alt of Cost metic should be #{expected}, instead we have #{actual}')
            .expect(await grid.getThresholdImageAlt(0))
            .toBe('javascript:alert(\'click me!\')'); 

        //delete alt
        await grid.selectGridContextMenuOption({
            title: 'Visualization 1',
            headerName: 'Cost',
            firstOption: 'Edit Thresholds...',
        });
        await threshold.openAdvThresholdDetail(0);
        await threshold.changeAltText('');
        await threshold.confirmAdvThresholdDetail();
        await since('Image URL source should be #{expected}, instead we have #{actual}')
            .expect(await threshold.previewImageURL(0))
            .toContain('images/balloonpp_yellow.png');
        await since('The image Alt text in img tag should be #{expected}, instead we have #{actual}')
            .expect(await threshold.isPreviewImageAltTagNotEmpty(0))
            .toBe(false);

        await threshold.confirmThreshold();
        await formatPanel.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await dossierPage.sleep(2000);//wait for change take effect in element
        await since('The grid Alt text in image tag should be #{expected}, instead we have #{actual}')
            .expect(await grid.isGridAltTagNotEmpty(0))
            .toBe(false);
        await since('The first image url of Cost metic should be #{expected}, instead we have #{actual}')
            .expect(await grid.getThresholdImageURL(0))
            .toContain('images/balloonpp_yellow.png');
    });

    it('[TC97894_03] Validate Function of Image Alternative Text in Library Web - Attribute Thresholds - Authoring', async () => {
        await libraryPage.editDossierByUrl({
            projectId: gridDossier2.project.id,
            dossierId: gridDossier2.id,
        });
        await since('The grid Alt text in image tag should be #{expected}, instead we have #{actual}')
            .expect(await grid.isGridAltTagNotEmpty(0))
            .toBe(false);
        
        await grid.selectGridContextMenuOption({
            title: 'Visualization 1',
            headerName: 'Quarter',
            firstOption: 'Edit Thresholds...',
        });
        await threshold.openAdvThresholdDetail(0);

        //add alt
        await threshold.changeAltText('attribue alt');
        await threshold.confirmAdvThresholdDetail();
        await since('Image URL source should be #{expected}, instead we have #{actual}')
            .expect(await threshold.previewImageURL(0))
            .toContain('images/balloonpp_yellow.png');
        await since('The threshold Alt text in preview is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await threshold.previewImageAlt(0))
            .toBe('attribue alt');
        await threshold.confirmThreshold();
        await formatPanel.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await dossierPage.sleep(2000);//wait for change take effect in element

        //check in grid
        await since('The first image alt of Quarter attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getThresholdImageAlt(0))
            .toBe('attribue alt');
        await since('The first image url of Cost metic should be #{expected}, instead we have #{actual}')
            .expect(await grid.getThresholdImageURL(0))
            .toContain('images/balloonpp_yellow.png');
        
        //change image
        await grid.selectGridContextMenuOption({
            title: 'Visualization 1',
            headerName: 'Quarter',
            firstOption: 'Edit Thresholds...',
        });
        await threshold.openAdvThresholdDetail(0);

        await threshold.changeImageURL('https://microstrategy.atlassian.net/wiki/download/attachments/524289/atl.site.logo?version=2&modificationDate=1441727808595&cacheVersion=1&api=v2');
        await threshold.confirmAdvThresholdDetail();
        await since('Image URL source should be #{expected}, instead we have #{actual}')
            .expect(await threshold.previewImageURL(0))
            .toContain('https://microstrategy.atlassian.net/wiki/download/attachments/524289/atl.site.logo?version=2&modificationDate=1441727808595&cacheVersion=1&api=v2');
        await since('The image Alt text in img tag should be #{expected}, instead we have #{actual}')
            .expect(await threshold.isPreviewImageAltTagNotEmpty(0))
            .toBe(true);
        await threshold.confirmThreshold();
        await formatPanel.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await dossierPage.sleep(2000);//wait for change take effect in element
        
        await since('The grid Alt text in image tag should be #{expected}, instead we have #{actual}')
            .expect(await grid.isGridAltTagNotEmpty(0))
            .toBe(true);
        await since('The first image url of Cost metic should be #{expected}, instead we have #{actual}')
            .expect(await grid.getThresholdImageURL(0))
            .toContain('https://microstrategy.atlassian.net/wiki/download/attachments/524289/atl.site.logo?version=2&modificationDate=1441727808595&cacheVersion=1&api=v2');
        
        //use ootb image will automatically has alt
        await grid.selectGridContextMenuOption({
            title: 'Visualization 1',
            headerName: 'Quarter',
            firstOption: 'Edit Thresholds...',
        });
        await threshold.openAdvThresholdDetail(0);

        await threshold.changeImageURL('../images/quickThresholdImgs/roundedpp_red.png');
        await threshold.confirmAdvThresholdDetail();
        await since('Image URL source should be #{expected}, instead we have #{actual}')
            .expect(await threshold.previewImageURL(0))
            .toContain('/images/quickThresholdImgs/roundedpp_red.png');
        await since('The threshold Alt text in preview is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await threshold.previewImageAlt(0))
            .toBe('attribue alt');
        await threshold.confirmThreshold();
        await formatPanel.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await dossierPage.sleep(2000);//wait for change take effect in element

        await since('The first image alt of Quarter attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getThresholdImageAlt(0))
            .toBe('attribue alt');
        await since('The first image url of Cost metic should be #{expected}, instead we have #{actual}')
            .expect(await grid.getThresholdImageURL(0))
            .toContain('/images/quickThresholdImgs/roundedpp_red.png');
    });

    it('[TC97894_04] Validate Function of Image Alternative Text in Library Web - Thresholds break image - Authoring', async () => {
        await libraryPage.editDossierByUrl({
            projectId: gridDossier2.project.id,
            dossierId: gridDossier2.id,
        });

        //add break image in attribute
        await grid.selectGridContextMenuOption({
            title: 'Visualization 1',
            headerName: 'Quarter',
            firstOption: 'Edit Thresholds...',
        });
        await threshold.openAdvThresholdDetail(0);

        await threshold.changeImageURL('break');
        await threshold.changeAltText('break');
        await threshold.confirmAdvThresholdDetail();
        await takeScreenshotByElement(threshold.getPreviewImageInAdvThresholdEditor(0), 'TC97894_04', 'BreakinAttributePreview');
        await threshold.confirmThreshold();
        await formatPanel.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

        //add break image in metric
        await grid.selectGridContextMenuOption({
            title: 'Visualization 1',
            headerName: 'Cost',
            firstOption: 'Thresholds...',
        });
        await threshold.chooseImageBased();
        await threshold.switchAdvThreshold();
        await threshold.confirmSwitchToAdvThreshold();
        await threshold.openAdvThresholdDetail(0);
        await threshold.changeImageURL('break');
        await threshold.changeAltText('break');
        await threshold.confirmAdvThresholdDetail();
        await takeScreenshotByElement(threshold.getPreviewImageInAdvThresholdEditor(0), 'TC97894_05', 'BreakinMetircPreview');
        await threshold.confirmThreshold();
        await formatPanel.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

        //check in grid
        await since('The first image alt of Quarter attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getThresholdImageAlt(0))
            .toBe('break');
        await since('The first image url of Cost metic should be #{expected}, instead we have #{actual}')
            .expect(await grid.getThresholdImageURL(0))
            .toContain('break');
        await takeScreenshotByElement(grid.getTable('Visualization 1'), 'TC97894_06', 'BreakinGrid');
    });
});

export const config = specConfiguration;
