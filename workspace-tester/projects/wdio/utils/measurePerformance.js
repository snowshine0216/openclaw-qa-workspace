import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import now from 'performance-now';
import WebBasePage from '../pageObjects/base/WebBasePage.js';

export default class MeasurePerformance {

    constructor(libraryPage) {
        this.libraryPage = libraryPage;
        this.conversation = browsers.pageObj1.conversation;
        this.webPage = new WebBasePage();
        this.resultData = [];
        this.generateResultData = {};
        this.__filename = fileURLToPath(import.meta.url);
        this.__dirname = path.dirname(this.__filename);
    }

    elementDict = {
        loadingSpin: {
            renderArea:'.mstrd-AppContainer',
            renderElement: [
                ['.mstrd-LoadingIcon-content--visible'],
                ['.mstrd-DossierViewContainer-main:not(:has(.mstrd-LoadingIcon-content--visible))']
            ]
        },
        folderContent: {
            renderArea:'.mstrd-DossiersListContainer',
            renderElement: [
                [{ selector: '.mstrd-DossierItemRow-name', contains: 'FolderDossier999' }]
            ]
        },
        folderManagement: {
            renderArea:'.mstrd-AppContainer',
            renderElement: [
                ['.mstrd-DossiersListContainer:has(.mstrd-progressBar-bar)'],
                ['.mstrd-DossiersListContainer:not(:has(.mstrd-progressBar-bar))']
            ]
        },
        RenderingAnswer: {
            renderArea: '.mstrd-AppContainer',
            renderElement: [
                ['.chat-bubble-loading'],
                ['.mstr-ai-chatbot-MainView-chatPanelContainer:not(:has(.chat-bubble-loading))'],
                ['.mstr-chatbot-markdown'],
            ],
        },
        WelcomeBotImage: {
            renderArea: '.mstrd-AppContainer',
            renderElement: [['.mstr-ai-chatbot-WelcomePage-botImg']],
        },
        RecommendationSkeleton: {
            renderArea: '.mstrd-AppContainer',
            renderElement: [
                ['.mstr-ai-chatbot-RecommendationSkeleton'],
                ['.mstr-ai-chatbot-MainView-chatPanelContainer:not(:has(.mstr-ai-chatbot-RecommendationSkeleton))'],
            ],
        },
        ReportObjectBrowser: {
            renderArea: '.mstrd-AppContainer',
            renderElement: [
                ['.mstrd-LoadingIcon-content--visible'],
                ['.mstrd-DossierViewContainer-main:not(:has(.mstrd-LoadingIcon-content--visible))'],
                ['.mstr-object-browser-container'],
                ['.mstr-object-list-container'],
            ],
        },
        ReportResume: {
            renderArea: '.mstrd-AppContainer',
            renderElement: [
                ['.mstrd-DossierViewContainer-main:not(:has(.mstrmojo-freezingImgDiv))'],
                ['.ag-header-container'],
            ],
        },
    }

    // Please add the API request path here. It will find the start and end time of the request.
    // If you sure the first and last of the requests, you can add these two requests in the list.
    // If the order of the request sequence is not fixed, you can just fill in the all substrings of requests path in the list.
    // For example, if all the N requests paths contain '/api/', you can just fill in '/api/' for N times in list.
    requestDict = {
        execution: ['/api/dossiers/'],
        renderingGrid: ['/api/dossier/'],
        renderingReport: ['/api/model/reports', '/instances', '/api/shortcuts'],
        editReport: ['/api/objects', '/api/model/reports', '/api/dossiers/', '/instances', '/api/projects', '/api/folders/'],
        resumeReport: ['/api/documents', '/api/model/reports'],
        folderBrowse: ['/api/folders/'],
        folderManagement: ['/api/objects', '/api/folders/'],
        renderingBot: ['/api/', '/taskProc', '/api/aiservice/chats/recommendations/dossier'],
        aiService: ['/api/aiservice/'],
        askNoVizQuestion: ['api/aiservice/chats/dossier', 'api/aiservice/chats/dossier'],
        askQuestion: ['/api/', '/messages'],
        snapshotManipulation: ['/api/chats/'],
        searchResults: ['/api/searches/results']
    }

    async measure({clickArea = '.mstrd-AppContainer', request = undefined, till = undefined, element}, action, actionName) {
        // Set timeout larger than default 1 second to enhance stability.
        const clickObserver = await this.libraryPage.observeEvent(clickArea, 'click', 5 * 1000);
        const elementObserver = await this.libraryPage.observeElements(element.renderArea, element.renderElement);
        //if need to observe request element. 
        let tillObserver = undefined;
        let reqObserver = undefined;
        if (request){
            if (till) {
                tillObserver = await this.libraryPage.observeElements(till.renderArea, till.renderElement);
            }
            reqObserver = await this.libraryPage.observeRequests(request, tillObserver, 60 * 1000);
        }
        
        await action();
        const clickTime = await clickObserver.waitForOccur();
        let requestTimes = {
            startTime: 0,
            endTime: 0
        };
        if (request) {
            requestTimes = await reqObserver.waitForFinish();
        }
        const elementAppearTime = await elementObserver.waitForAppear();

        let actionObj = {};
        actionObj.name = actionName;
        actionObj.dataAPI = { name: actionObj.name + ' - API' };
        actionObj.render = { name: actionObj.name + ' - Render' };
        actionObj.dataAPI.duration = (requestTimes.endTime - requestTimes.startTime);
        actionObj.duration = (elementAppearTime - clickTime);
        if (elementAppearTime < requestTimes.endTime || requestTimes.endTime === 0) {
            actionObj.render.duration = actionObj.duration;
        } else {
            actionObj.render.duration = (elementAppearTime - requestTimes.endTime);
        }
        actionObj.E2EDuration = actionObj.duration;

        console.log(`>>>>>>>>>> Performance Stats: ${actionName} <<<<<<<<<<`)
        console.log(`E2E: Click -> end render: ${actionObj.duration}ms`);
        console.log(`API: start request -> end request: ${actionObj.dataAPI.duration}ms`);
        console.log(`Render: API end request -> end render: ${actionObj.render.duration}ms`);

        this.resultData.push(actionObj);
    }  

    async measureTeams(action, actionName, message = true, element = undefined) {
        const startTime = Date.now();
        console.log("Start time: " + startTime);
        let endTime = 0;
        if (message) {
            await action();
            endTime = await this.conversation.getTimestampOfLastMessage(false) - 1000; //There is a 1s automation delay before clicking post button.
        } else {
            // await this.conversation.waitForChatTabLoaded('Library');
            // endTime = Date.now();
            const elementObserver = await this.conversation.observeElements(element.renderArea, element.renderElement);
            await action();
            endTime = await elementObserver.waitForAppear();
        }
        console.log("End time: " + endTime);

        let actionObj = {};
        actionObj.name = actionName;
        actionObj.dataAPI = { name: actionObj.name + ' - API' };
        actionObj.render = { name: actionObj.name + ' - Render' };
        actionObj.dataAPI.duration = 0;
        actionObj.render.duration = 0;
        actionObj.duration = (endTime - startTime);
        actionObj.E2EDuration = actionObj.duration;

        console.log(`>>>>>>>>>> Performance Stats: ${actionName} <<<<<<<<<<`)
        console.log(`E2E: Click -> end render: ${actionObj.duration}ms`);
        console.log(`API: start request -> end request: ${actionObj.dataAPI.duration}ms`);
        console.log(`Render: API end request -> end render: ${actionObj.render.duration}ms`);

        this.resultData.push(actionObj);
    }

    async measureWeb(action, actionName, needWait = false) {
        const startTime = now();
        await action();
        if (needWait) {
            await this.waitForWebReady();
        }
        const endTime = now();
        const actionObj = {
            name: actionName,
            duration: endTime - startTime,
        };
        console.log(`>>>>>>>>>> Performance Stats: ${actionName} <<<<<<<<<<`)
        console.log(`E2E: Click -> end render: ${actionObj.duration}ms`);
        this.resultData.push(actionObj);
    }

    async waitForWebReady() {
        await this.webPage.waitForElementInvisible(this.webPage.getWebWaitCurtain());
        // In some scenarios the wait box id is 'mstrWeb_wait'
        await this.webPage.waitForElementInvisible(this.webPage.$('#mstrWeb_wait .mstrWaitBox'));
        // RSD loading curtain
        await this.webPage.waitForElementInvisible(this.webPage.$('#waitBox .mstrmojo-Editor-curtain'));
    }

    generateResult(fileName) {
        let filePath = path.join(this.__dirname, '../e2ePerfResults', 'PerfTest_' + Date.now() + '.json');
        this.generateResultData[fileName] = this.resultData;
        fs.writeFile(filePath, JSON.stringify(this.generateResultData), (err) => {
            if (err) {
                console.error('get error in write file', err);
                return false;
            }
            return true;
        });
        this.resultData = [];
        this.generateResultData = {};
    }
}