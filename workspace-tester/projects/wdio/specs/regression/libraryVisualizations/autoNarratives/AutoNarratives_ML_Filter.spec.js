/* eslint-disable prettier/prettier */
import { browserWindowCustom } from '../../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import * as consts from '../../../../constants/visualizations.js';

describe('AutoNarratives_ML_Filter', () => {
    const testObjectInfo = {
        project: {
            id: '235853DC4B79DABCE8C6FFB26B7D8DC3',
            name: 'MicroStrategy Tutorial Project',
        },
        NLG1: {
            id: '667DCC204FA6D23F2A8854AD74906CFE',
            name: 'NLG_FilterByValue_Metric',
        },
        NLG2: {
            id: 'F07C68EB45CE62058C7908B77EEF4ED2',
            name: 'NLG_FilterByValue_Att',
        }, 
        NLG3: {
            id: '4E303C714CEEF36BCAF7F98D8D01D8FF',
            name: 'NLG_FilterByRank',
        },  
        NLG4: {
            id: 'AEFFADF3460A3320C27CFAB07E49C65E',
            name: 'NLG_FilterByRank%',
        }, 
        testName: 'AutoNarratives_ML_Filter',
    };

    let { loginPage, libraryPage, contentsPanel, autoNarratives } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(consts.autoUser.credentials);
        await loginPage.disableTutorial();
        await setWindowSize(browserWindowCustom);
        // await libraryPage.openDebugMode(consts.codeCoverage.vizDebugBundles);
    });

    afterEach(async () => {
        // await libraryPage.collectLineCoverageInfo(consts.codeCoverage.vizOutputFolder, testObjectInfo.testName);
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC97092_1] NLG_FilterByValue_Metric | Chapter 1 | FilterByValue_Metric', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG1.id,
        });

        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 1',
            pageName: '=',
        });
        await since('page "=" summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('Jan');

        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 1',
            pageName: '!=',
        });
        await since('page "!=" summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('Feb');
        await since('page "=" text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('322226');

        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 1',
            pageName: '>',
        });
        await since('page ">" summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('Virgin Records');
        await since('page ">" text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('$16,249,975');
            
        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 1',
            pageName: '≥',
        });
        await since('page "≥" summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('Virgin Records: $16,249,975');
        await since('page "≥" text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('BMG: $15,596,916');

        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 1',
            pageName: '<',
        });
        await since('page "<" summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('ATF Electronics');
        await since('page "<" text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('$1,122,16');

        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 1',
            pageName: '≤',
        });
        await since('page "≤" summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('$1,602,997');
        await since('page "≤" text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('ATF Electronics');

        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 1',
            pageName: 'between',
        });
        await since('page "between" summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('BMG: $15,596,916');

        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 1',
            pageName: 'notBetween',
        });
        await since('page "notBetween" summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('Virgin Records: $16,249,975');
        await since('page "notBetween" text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('Columbia Pictures: $12,399,494');

        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 1',
            pageName: 'in',
        });
        await since('page "in" summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('A&E Entertainment');
        await since('page "in" text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('ACS Innovations');

        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 1',
            pageName: 'notIn',
        });
        await since('page "notIn" summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('20th Century Fox');

        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 1',
            pageName: 'null',
        });
        await since('page "null" summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('Virgin Records');
        await since('page "null" summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('Sony Music');
    });

    it('[TC97092_2] NLG_FilterByValue_Att | Chapter 1 | FilterByValue_Att', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG2.id,
        });

        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 1',
            pageName: '=',
        });
        await since('page "=" summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('Central');
        await since('page "=" text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('$5,029,366');

        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 1',
            pageName: '!=',
        });
        await since('page "!=" summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('Mid-Atlantic');
        await since('page "=" text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('$4,452,615');

        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 1',
            pageName: '>',
        });
        await since('page ">" summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('2009');
        await since('page ">" text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('2008');
            
        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 1',
            pageName: '≥',
        });
        await since('page "≥" summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('2009');
        await since('page "≥" text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('2008');

        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 1',
            pageName: '<',
        });
        await since('page "<" summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('2007');
        await since('page "<" text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('$8,647,238');

        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 1',
            pageName: '≤',
        });
        await since('page "≤" summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('2008: $11,517,606');
        await since('page "≤" text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('2007: $8,647,238');

        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 1',
            pageName: 'between',
        });
        await since('page "between" summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('2008');
        await since('page "between" summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('$8,647,238');

        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 1',
            pageName: 'notBetween',
        });
        await since('page "notBetween" summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('2007');

        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 1',
            pageName: 'in',
        });
        await since('page "in" summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('Northeast');
        await since('page "in" text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('$5,029,366');

        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 1',
            pageName: 'notIn',
        });
        await since('page "notIn" summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('Mid-Atlantic: $4,452,615');

        // await contentsPanel.goToPageAndRefreshNLG({
        //     chapterName: 'Chapter 1',
        //     pageName: 'null',
        // });
        // await since('page "null" summary text should contain #{expected}, while we get #{actual}')
        //     .expect(await autoNarratives.getSummaryTextByIndex())
        //     .toContain('no data available');
        
        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 1',
            pageName: 'notNull',
        });
        await since('page "notNull" summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('Central');
        await since('page "notNull" summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('Mid-Atlantic');

    });

    it('[TC97092_3] NLG_FilterByRank | Chapter 1 | FilterByRank', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG3.id,
        });

        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 1',
            pageName: '=',
        });
        await since('page "=" summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('South');
        await since('page "=" text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('5,389,280');

        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 1',
            pageName: '!=',
        });
        await since('page "!=" summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('Northwest');
        await since('page "=" text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('Mid-Atlantic');

        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 1',
            pageName: '>',
        });
        await since('page ">" summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('Northwest');
            
        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 1',
            pageName: '≥',
        });
        await since('page "≥" summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('Mid-Atlantic');
        await since('page "≥" text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('Northwest');

        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 1',
            pageName: '<',
        });
        await since('page "<" summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('Northeast');
        await since('page "<" text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('$8,554,415');

        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 1',
            pageName: '≤',
        });
        await since('page "≤" summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('Northeast');
        await since('page "≤" text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('Central');

        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 1',
            pageName: 'between',
        });
        await since('page "between" summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('Central');
        await since('page "between" summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('Mid-Atlantic');

        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 1',
            pageName: 'notBetween',
        });
        await since('page "notBetween" summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('Northeast');

        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 1',
            pageName: 'in',
        });
        await since('page "in" summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('Central');
        await since('page "in" text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('Northwest');

        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 1',
            pageName: 'notIn',
        });
        await since('page "notIn" summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('Central');
        await since('page "notIn" summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('Mid-Atlantic');

        // await contentsPanel.goToPageAndRefreshNLG({
        //     chapterName: 'Chapter 1',
        //     pageName: 'null',
        // });
        // await since('page "null" summary text should contain #{expected}, while we get #{actual}')
        //     .expect(await autoNarratives.getSummaryTextByIndex())
        //     .toContain('no');
        
        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 1',
            pageName: 'notNull',
        });
        await since('page "notNull" summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('Central');
        await since('page "notNull" summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('Northwest');
    });

    it('[TC97092_4] NLG_FilterByRank% | Chapter 1 | FilterByRank%', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG4.id,
        });

        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 1',
            pageName: '=',
        });
        await since('page "=" summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('Northeast');
        await since('page "=" text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('8,554,41');

        // await contentsPanel.goToPageAndRefreshNLG({
        //     chapterName: 'Chapter 1',
        //     pageName: '!=',
        // });
        // await since('page "!=" summary text should contain #{expected}, while we get #{actual}')
        //     .expect(await autoNarratives.getSummaryTextByIndex())
        //     .toContain('Northwest');
        // await since('page "!=" text should contain #{expected}, while we get #{actual}')
        //     .expect(await autoNarratives.getSummaryTextByIndex())
        //     .toContain('South');
        // await since('page "!=" text should contain #{expected}, while we get #{actual}')
        //     .expect(await autoNarratives.getSummaryTextByIndex())
        //     .toContain('Central');
        // await since('page "!=" text should contain #{expected}, while we get #{actual}')
        //     .expect(await autoNarratives.getSummaryTextByIndex())
        //     .toContain('Mid-Atlantic');

        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 1',
            pageName: '>',
        });
        await since('page ">" summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('Southeast');
        await since('page ">" summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('Northwest');
            
        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 1',
            pageName: '≥',
        });
        await since('page "≥" summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('Southeast');
        await since('page "≥" summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('Southwest');
        await since('page "≥" text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('Northwest');

        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 1',
            pageName: '<',
        });
        await since('page "<" summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('Mid-Atlantic');
        await since('page "<" text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('4,452,6151');

        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 1',
            pageName: '≤',
        });
        await since('page "≤" summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('Mid-Atlantic');
        await since('page "≤" text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('Web');

        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 1',
            pageName: 'between',
        });
        await since('page "between" summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('Web');
        await since('page "between" summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('Mid-Atlantic');
        await since('page "between" summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('Southwest');

        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 1',
            pageName: 'notBetween',
        });
        await since('page "notBetween" summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('Northwest');
        await since('page "notBetween" summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('Southeast');

        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 1',
            pageName: 'in',
        });
        await since('page "in" summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('Mid-Atlantic');
        await since('page "in" text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('Southwest');

        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 1',
            pageName: 'notIn',
        });
        await since('page "notIn" summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('Web');
        await since('page "notIn" summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('Southwest');

        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 1',
            pageName: 'null',
        });
        await since('page "null" summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('Northwest');
        
        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 1',
            pageName: 'notNull',
        });
        await since('page "notNull" summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('Web');
        await since('page "notNull" summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('Mid-Atlantic');

        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 2',
            pageName: 'or',
        });
        await since('page "or" summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('2007');
        await since('page "or" summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('2009');

        await contentsPanel.goToPageAndRefreshNLG({
            chapterName: 'Chapter 2',
            pageName: 'and',
        });
        await since('page "and" summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('2007');
        await since('page "and" summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('471,477');
    });

});
