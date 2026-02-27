import { browserWindow } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import getProjectInfo from '../../../api/getProjectInfo.js';
import deleteObjectByNames from '../../../api/folderManagement/deleteObjectByNames.js';
import { getMyReportsFolderInfo } from '../../../api/folderManagement/getPredefinedFolder.js';
import { createCubeFromUrl } from '../../../api/createCubeFromUrl.js';
import { createCubeFromS3 } from '../../../api/createCubeFromS3.js';
import { uploadUnstructuredData, waitForNuggetReady } from '../../../api/bot/nuggets/createNuggetsRestAPI.js';
import { enableAI } from '../../../api/bot2/enableAIAPI.js';
import createMosaicModelWithSampleFile from '../../../api/dataModel/createDataModelWithSampleFile.js';
import allureReporter from '@wdio/allure-reporter';
import path from 'path';
import fs from 'fs';
import os from 'os';
import https from 'https';
import http from 'http';

const ERROR_KEYWORDS = 'wrong;oops;sorry;failed';

const project = {
    id: '',
    name: browsers.params.project || 'MicroStrategy Tutorial',
};

const tester = {
    credentials: {
        username: browsers.params.credentials.username || 'bot2_e2e_sanity',
        password: browsers.params.credentials.password || '',
    },
};

const deleteObjectsAfterTest = browsers.params.deleteObjectsAfterTest?.toLowerCase() === 'true';
const ingestOnLibrary = browsers.params.ingestOnLibrary?.toLowerCase() === 'true';
const existingCubeName = browsers.params.existingCubeName || null;
const existingUnstructuredDataName = browsers.params.existingUnstructuredDataName || null;
const existingMosaicModelName = browsers.params.existingMosaicModelName || null;
const ingestTimeout = browsers.params.ingestTimeout || 600000;

const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace('T', '_').replace(/\..+/, '').slice(0, 15);

const myReportsFolder = {
    id: '',
};

const structuredCubeInfo = {
    sourceFileUrl: browsers.params.cubeDataUrl,
    name: existingCubeName || `E2E_Sanity_Cube_${timestamp}`,
    id: '',
    awsRegion: browsers.params.awsRegion,
    awsAccessKeyId: browsers.params.awsAccessKeyId,
    awsSecretAccessKey: browsers.params.awsSecretAccessKey,
    useExisting: existingCubeName !== null && existingCubeName !== '',
};

const unstructuredDataInfo = {
    sourceFileUrl: browsers.params.unstructuredDataUrl,
    name: existingUnstructuredDataName || `E2E_Sanity_UnstructuredData_${timestamp}`,
    id: '',
    useExisting: existingUnstructuredDataName !== null && existingUnstructuredDataName !== '',
};

const mosaicModelInfo = {
    sampleFileName: browsers.params.mosaicModelSampleFileName || 'airline-sample-data.xls',
    name: existingMosaicModelName || `E2E_Sanity_Mosaic_Model_${timestamp}`,
    id: '',
    useExisting: existingMosaicModelName !== null && existingMosaicModelName !== '',
};

const structuredBot = {
    name: `E2E_Sanity_Structured_Bot_${timestamp}`,
};

const structuredADC = {
    name: `E2E_Sanity_Structured_ADC_${timestamp}`,
};

const mosaicBot = {
    name: `E2E_Sanity_Mosaic_Bot_${timestamp}`,
};

const mosaicADC = {
    name: `E2E_Sanity_Mosaic_ADC_${timestamp}`,
};

const unstructuredBot = {
    name: `E2E_Sanity_Unstructured_Bot_${timestamp}`,
};

const mixedBot = {
    name: `E2E_Sanity_Mixed_Bot_${timestamp}`,
};

const unstructuredADC = {
    name: `E2E_Sanity_Unstructured_ADC_${timestamp}`,
};

const mixedADC = {
    name: `E2E_Sanity_Mixed_ADC_${timestamp}`,
};

const universalBot = {
    name: `E2E_Sanity_Universal_Bot_${timestamp}`,
};

describe('Bot 2.0 E2E Sanity Test', () => {
    const testState = {
        // structured cube and bot
        structuredCubeCreated: false,
        structuredCubeAiEnabled: false,
        structuredBotCreated: false,
        // mosaic model and bot
        mosaicModelCreated: false,
        mosaicModelAiEnabled: false,
        mosaicBotCreated: false,
        // unstructured data and bot
        unstructuredDataUploaded: false,
        unstructuredBotCreated: false,
        // mixed bot
        mixedBotCreated: false,
        // universal bot
        universalBotCreated: false,
    };

    function checkDependencies(dependencies = []) {
        const missingDeps = dependencies.filter((dep) => !testState[dep]);
        if (missingDeps.length > 0) {
            const message = `Skipping test due to missing dependencies: ${missingDeps.join(', ')}`;
            console.warn(message);
            allureReporter.addStep(`⚠️ ${message}`);
            pending(message);
        }
    }

    let {
        loginPage,
        onboardingTutorial,
        libraryPage,
        libraryAuthoringPage,
        botAuthoring,
        botConsumptionFrame,
        aibotChatPanel,
        adc,
        bot2Chat,
        quickSearch,
        fullSearch,
        infoWindow,
    } = browsers.pageObj1;

    async function preparation() {
        // Get project id by name
        const projectInfo = await getProjectInfo({ credentials: tester.credentials });
        const projectDetails = projectInfo.find((p) => p.name === project.name);
        if (!projectDetails) {
            throw new Error(`Project '${project.name}' not found.`);
        }
        project.id = projectDetails.id;
        console.log(`Using project '${project.name}' with ID: ${project.id}`);

        // Get 'My Reports' folder id
        const myReportsFolderResponse = await getMyReportsFolderInfo({
            credentials: tester.credentials,
            projectId: project.id,
        });
        if (!myReportsFolderResponse) {
            throw new Error(`'My Reports' folder not found for project '${project.name}'.`);
        }
        myReportsFolder.id = myReportsFolderResponse.id;
        console.log(`'My Reports' folder ID: ${myReportsFolder.id}`);
    }

    async function downloadFileFromUrl(url, destPath) {
        return new Promise((resolve, reject) => {
            const protocol = url.startsWith('https') ? https : http;
            const file = fs.createWriteStream(destPath);

            protocol
                .get(url, (response) => {
                    if (response.statusCode === 200) {
                        response.pipe(file);
                        file.on('finish', () => {
                            file.close();
                            console.log(`✅ File downloaded successfully to ${destPath}`);
                            resolve(destPath);
                        });
                    } else {
                        file.close();
                        fs.unlink(destPath, () => {}); // Delete the file
                        reject(new Error(`Failed to download file. Status: ${response.statusCode}`));
                    }
                })
                .on('error', (err) => {
                    file.close();
                    fs.unlink(destPath, () => {}); // Delete the file
                    reject(err);
                });
        });
    }

    async function askQuestion(question, { enableResearchMode = false, waitForViz = false } = {}) {
        allureReporter.addStep(`Ask Question: ${question}`);
        if (enableResearchMode && !(await aibotChatPanel.isResearchEnabled())) {
            console.log(`Enabling research mode for question: ${question}`);
            await aibotChatPanel.enableResearch();
        } else if (!enableResearchMode && (await aibotChatPanel.isResearchEnabled())) {
            console.log(`Disabling research mode for question: ${question}`);
            await aibotChatPanel.disableResearch();
        }

        console.log(`Ask question: ${question}`);
        await aibotChatPanel.askQuestion(question, waitForViz);
        await aibotChatPanel.waitForAnswerLoading();

        // Get the latest answer and record it
        const answers = await aibotChatPanel.getAnswers();
        const currentAnswerIndex = answers.length - 1;
        const answerTextEL = await aibotChatPanel.getAnswerTextByIndex(currentAnswerIndex);
        const answerText = await libraryPage.getInnerText(answerTextEL);
        allureReporter.addStep(`Answer text: ${answerText}`);
    }

    async function deleteCreatedObjects() {
        if (!project.id || !myReportsFolder.id) {
            console.log('Project ID or My Reports folder ID is missing. Skipping deletion of created objects.');
            return;
        }

        console.log('Deleting created bots...');
        await deleteObjectByNames({
            credentials: tester.credentials,
            projectId: project.id,
            parentFolderId: myReportsFolder.id,
            names: [universalBot.name],
        });
        await deleteObjectByNames({
            credentials: tester.credentials,
            projectId: project.id,
            parentFolderId: myReportsFolder.id,
            names: [structuredBot.name, unstructuredBot.name, mosaicBot.name, mixedBot.name],
        });
        console.log('Deleting created ADCs...');
        await deleteObjectByNames({
            credentials: tester.credentials,
            projectId: project.id,
            parentFolderId: myReportsFolder.id,
            names: [structuredADC.name, unstructuredADC.name, mosaicADC.name, mixedADC.name],
        });
        if (!structuredCubeInfo.useExisting) {
            console.log(`Deleting created cube: ${structuredCubeInfo.name}`);
            await deleteObjectByNames({
                credentials: tester.credentials,
                projectId: project.id,
                parentFolderId: myReportsFolder.id,
                names: [structuredCubeInfo.name],
            });
        }
        if (!unstructuredDataInfo.useExisting) {
            console.log(`Deleting created unstructured data: ${unstructuredDataInfo.name}`);
            await deleteObjectByNames({
                credentials: tester.credentials,
                projectId: project.id,
                parentFolderId: myReportsFolder.id,
                names: [unstructuredDataInfo.name],
            });
        }
        if (!mosaicModelInfo.useExisting) {
            console.log(`Deleting created mosaic model: ${mosaicModelInfo.name}`);
            await deleteObjectByNames({
                credentials: tester.credentials,
                projectId: project.id,
                parentFolderId: myReportsFolder.id,
                names: [mosaicModelInfo.name],
            });
        }
        console.log('Created objects deleted successfully.');
    }

    beforeAll(async () => {
        try {
            await preparation();
            await setWindowSize(browserWindow);
            await loginPage.login(tester.credentials);
            await libraryPage.waitForLibraryLoading();
        } catch (error) {
            console.error('❌ Test preparation failed:', error.message);
            throw error;
        }
    });

    beforeEach(async () => {
        try {
            await libraryPage.openDefaultApp();
            await onboardingTutorial.skip();
        } catch (error) {
            console.error('❌ Before each test failed:', error.message);
            throw error;
        }
    });

    afterAll(async () => {
        try {
            await logoutFromCurrentBrowser();
            if (deleteObjectsAfterTest) {
                await deleteCreatedObjects();
            }
        } catch (error) {
            console.error('❌ Test cleanup failed:', error.message);
            throw error;
        }
    });

    it('[TC000000] Data import MTDI cube', async () => {
        try {
            allureReporter.addStep('🚀 Starting cube creation');

            // Data import cube
            if (!structuredCubeInfo.useExisting) {
                console.log(`Creating cube '${structuredCubeInfo.name}' from URL: ${structuredCubeInfo.sourceFileUrl}`);
                let createCubeResponse;
                if (structuredCubeInfo.sourceFileUrl.startsWith('s3')) {
                    if (!structuredCubeInfo.sourceFileUrl.startsWith('s3a://')) {
                        throw new Error(
                            `S3 link only support s3a schema, but actually it is ${structuredCubeInfo.sourceFileUrl}`
                        );
                    }
                    if (
                        !structuredCubeInfo.awsRegion ||
                        !structuredCubeInfo.awsAccessKeyId ||
                        !structuredCubeInfo.awsSecretAccessKey
                    ) {
                        throw new Error('AWS credentials are required for S3 data source.');
                    }
                    createCubeResponse = await createCubeFromS3(
                        structuredCubeInfo.sourceFileUrl,
                        structuredCubeInfo.name,
                        myReportsFolder.id,
                        browser.options.baseUrl,
                        tester.credentials.username,
                        tester.credentials.password,
                        project.id,
                        structuredCubeInfo.awsRegion,
                        structuredCubeInfo.awsAccessKeyId,
                        structuredCubeInfo.awsSecretAccessKey
                    );
                } else if (
                    structuredCubeInfo.sourceFileUrl.startsWith('http://') ||
                    structuredCubeInfo.sourceFileUrl.startsWith('https://')
                ) {
                    createCubeResponse = await createCubeFromUrl(
                        structuredCubeInfo.sourceFileUrl,
                        structuredCubeInfo.name,
                        myReportsFolder.id,
                        browser.options.baseUrl,
                        tester.credentials.username,
                        tester.credentials.password,
                        project.id
                    );
                } else {
                    throw new Error(`Unsupported data source URL: ${structuredCubeInfo.sourceFileUrl}`);
                }
                if (!createCubeResponse || !createCubeResponse.objectId) {
                    throw new Error(`Failed to create cube from URL: ${structuredCubeInfo.sourceFileUrl}`);
                }
                structuredCubeInfo.id = createCubeResponse.objectId;

                // Wait for a while
                await browser.pause(5000);

                console.log('✅ Cube created successfully');
                allureReporter.addStep('✅ Cube created successfully');
                testState.structuredCubeCreated = true;
            } else {
                console.log('✅ Using existing cube, marked as created');
                allureReporter.addStep('✅ Using existing cube, marked as created');
                testState.structuredCubeCreated = true;
            }
        } catch (error) {
            console.error('❌ Failed to create cube:', error.message);
            allureReporter.addStep(`❌ Failed to create cube: ${error.message}`, {}, 'failed');
            testState.structuredCubeCreated = false;
            throw error;
        }
    });

    (ingestOnLibrary ? xit : it)('[TC000000] Enable AI for cube by API', async () => {
        checkDependencies(['structuredCubeCreated']);

        try {
            allureReporter.addStep('🚀 Starting AI enablement by API');

            // Enable AI
            const cubeObjects = [
                {
                    cubeId: structuredCubeInfo.id,
                    cubeType: 'MTDI',
                },
            ];
            await enableAI({
                baseUrl: browser.options.baseUrl,
                credentials: tester.credentials,
                projectId: project.id,
                cubeObjects: cubeObjects,
                timeout: ingestTimeout,
            });

            console.log('✅ AI enabled successfully by API');
            allureReporter.addStep('✅ AI enabled successfully by API');
            testState.structuredCubeAiEnabled = true;
        } catch (error) {
            console.error('❌ Failed to enable AI by API:', error.message);
            allureReporter.addStep(`❌ Failed to enable AI by API: ${error.message}`, {}, 'failed');
            testState.structuredCubeAiEnabled = false;
            throw error;
        }
    });

    (ingestOnLibrary ? it : xit)('[TC000000] Enable AI for cube on Library', async () => {
        checkDependencies(['structuredCubeCreated']);

        try {
            allureReporter.addStep('🚀 Starting AI enablement on Library');

            // Enable AI from search results
            await quickSearch.openSearchSlider();
            await quickSearch.inputTextAndSearch(structuredCubeInfo.name);
            await fullSearch.waitForSearchLoading();
            await fullSearch.clickAllTab();
            // Open info window and enable AI
            await fullSearch.openInfoWindow(structuredCubeInfo.name);
            await infoWindow.enableForAI(false, ingestTimeout);
            // Verify AI enabled successfully
            await since('Enable for AI should succeed for the cube, actual: #{actual}')
                .expect(await infoWindow.isAIEnabled())
                .toBe(true);
            await infoWindow.close();

            console.log('✅ AI enabled successfully on Library');
            allureReporter.addStep('✅ AI enabled successfully on Library');
            testState.structuredCubeAiEnabled = true;
        } catch (error) {
            console.error('❌ Failed to enable AI on Library:', error.message);
            allureReporter.addStep(`❌ Failed to enable AI on Library: ${error.message}`, {}, 'failed');
            testState.structuredCubeAiEnabled = false;
            throw error;
        }
    });

    it('[TC000000] Create structured bot and sanity Q&A', async () => {
        checkDependencies(['structuredCubeCreated', 'structuredCubeAiEnabled']);

        try {
            allureReporter.addStep('🚀 Starting structured bot creation');

            console.log('Creating ADC with structured cube');
            await libraryAuthoringPage.clickNewDossierIcon();
            await libraryAuthoringPage.clickNewBot2Button();
            await libraryAuthoringPage.selectProjectAndDataset(project.name, structuredCubeInfo.name);
            await libraryAuthoringPage.waitForCurtainDisappear();
            await adc.saveToPath(structuredADC.name, null, 'My Reports');
            await adc.waitForCurtainDisappear();

            console.log('Saving bot');
            await botAuthoring.clickSaveButton();
            await libraryAuthoringPage.saveToFolder(structuredBot.name, null, 'My Reports');
            await since('Library title should be #{expected} but is #{actual}')
                .expect(await botConsumptionFrame.getBotName())
                .toEqual(structuredBot.name);

            console.log('✅ Structured bot created successfully');
            allureReporter.addStep('✅ Structured bot created successfully');
            testState.structuredBotCreated = true;

            console.log('Say hi');
            await aibotChatPanel.askQuestionNoWaitViz(`Hi`);
            await aibotChatPanel.waitForRecommendationSkeletonDisappear();
            await since(`Say hi should not contain error keywords: ${ERROR_KEYWORDS}`)
                .expect(await bot2Chat.verifyAnswerContainsOneOfKeywords(ERROR_KEYWORDS))
                .toBe(false);

            console.log('Ask normal question');
            await askQuestion(`How many employees are there in Canada?`);
            let expectedKeywords = '12';
            await since(`Answer should contain expected keywords: ${expectedKeywords}`)
                .expect(await bot2Chat.verifyAnswerContainsKeywords(expectedKeywords))
                .toBe(true);

            console.log('Ask question to display grid');
            await askQuestion(`List all the employees in Canada in a table`, { waitForViz: true });
            await since('Grid should be displayed')
                .expect(await aibotChatPanel.getGridByIndex(2).isDisplayed())
                .toBe(true);

            console.log('Ask question to display chart');
            await askQuestion(`Show me **Employee ID** distribution by country in a bar chart`, { waitForViz: true });
            await since('Chart should be displayed')
                .expect(await aibotChatPanel.getChartByIndex(3).isDisplayed())
                .toBe(true);

            console.log('Ask key driver question');
            await askQuestion(`What is the key driver of 'Years With MicroStrategy'?`, { enableResearchMode: true });
            expectedKeywords = 'Key Driver;Top Drivers';
            await since(`Answer should contain expected keywords: ${expectedKeywords}`)
                .expect(await bot2Chat.verifyAnswerContainsKeywords(expectedKeywords))
                .toBe(true);
            await since(`Answer should not contain error keywords: ${ERROR_KEYWORDS}`)
                .expect(await bot2Chat.verifyAnswerContainsOneOfKeywords(ERROR_KEYWORDS))
                .toBe(false);

            console.log('Go to library and check if it is in library');
            await aibotChatPanel.goToLibrary();
            await since(
                'Back to library page, the new bot in library should be "#{expected}", instead we have "#{actual}"'
            )
                .expect(await libraryPage.isDossierInLibrary(structuredBot))
                .toBe(true);
        } catch (error) {
            console.error('❌ Failed during structured bot Q&A:', error.message);
            allureReporter.addStep(`❌ Failed during structured bot Q&A: ${error.message}`, {}, 'failed');
            throw error;
        }
    });

    it('[TC000000] Create mosaic model by API', async () => {
        try {
            allureReporter.addStep('🚀 Starting mosaic model creation');

            // Create mosaic model
            if (!mosaicModelInfo.useExisting) {
                console.log(
                    `Creating mosaic model '${mosaicModelInfo.name}' from sample file: ${mosaicModelInfo.sampleFileName}`
                );
                const cubeId = await createMosaicModelWithSampleFile(
                    tester.credentials,
                    project.id,
                    mosaicModelInfo.sampleFileName,
                    mosaicModelInfo.name,
                    myReportsFolder.id
                );

                if (!cubeId) {
                    throw new Error(
                        `Failed to create mosaic model from sample file: ${mosaicModelInfo.sampleFileName}`
                    );
                }
                mosaicModelInfo.id = cubeId;

                // Wait for a while
                await browser.pause(5000);

                console.log('✅ Mosaic model created successfully');
                allureReporter.addStep('✅ Mosaic model created successfully');
                testState.mosaicModelCreated = true;
            } else {
                console.log('✅ Using existing mosaic model, marked as created');
                allureReporter.addStep('✅ Using existing mosaic model, marked as created');
                testState.mosaicModelCreated = true;
            }
        } catch (error) {
            console.error('❌ Failed to create mosaic model:', error.message);
            allureReporter.addStep(`❌ Failed to create mosaic model: ${error.message}`, {}, 'failed');
            testState.mosaicModelCreated = false;
            throw error;
        }
    });

    (ingestOnLibrary ? xit : it)('[TC000000] Enable AI for mosaic model by API', async () => {
        checkDependencies(['mosaicModelCreated']);

        try {
            allureReporter.addStep('🚀 Starting AI enablement for mosaic model by API');

            // Enable AI
            const cubeObjects = [
                {
                    cubeId: mosaicModelInfo.id,
                    cubeType: 'MTDI',
                },
            ];
            await enableAI({
                baseUrl: browser.options.baseUrl,
                credentials: tester.credentials,
                projectId: project.id,
                cubeObjects: cubeObjects,
                timeout: ingestTimeout,
            });

            console.log('✅ AI enabled successfully for mosaic model by API');
            allureReporter.addStep('✅ AI enabled successfully for mosaic model by API');
            testState.mosaicModelAiEnabled = true;
        } catch (error) {
            console.error('❌ Failed to enable AI for mosaic model by API:', error.message);
            allureReporter.addStep(`❌ Failed to enable AI for mosaic model by API: ${error.message}`, {}, 'failed');
            testState.mosaicModelAiEnabled = false;
            throw error;
        }
    });

    (ingestOnLibrary ? it : xit)('[TC000000] Enable AI for mosaic model on Library', async () => {
        checkDependencies(['mosaicModelCreated']);

        try {
            allureReporter.addStep('🚀 Starting AI enablement for mosaic model on Library');

            // Open library and enable AI
            await quickSearch.openSearchSlider();
            await quickSearch.inputTextAndSearch(mosaicModelInfo.name);
            await fullSearch.waitForSearchLoading();
            await fullSearch.clickAllTab();
            // Open info window and enable AI
            await fullSearch.openInfoWindow(mosaicModelInfo.name);
            await infoWindow.enableForAI(false, ingestTimeout);

            // Verify AI enabled successfully
            await since('Enable for AI should succeed for the mosaic model, actual: #{actual}')
                .expect(await infoWindow.isAIEnabled())
                .toBe(true);
            await infoWindow.close();

            console.log('✅ AI enabled successfully for mosaic model on Library');
            allureReporter.addStep('✅ AI enabled successfully for mosaic model on Library');
            testState.mosaicModelAiEnabled = true;
        } catch (error) {
            console.error('❌ Failed to enable AI for mosaic model on Library:', error.message);
            allureReporter.addStep(
                `❌ Failed to enable AI for mosaic model on Library: ${error.message}`,
                {},
                'failed'
            );
            testState.mosaicModelAiEnabled = false;
            throw error;
        }
    });

    it('[TC000000] Create bot against mosaic model and sanity Q&A', async () => {
        checkDependencies(['mosaicModelCreated', 'mosaicModelAiEnabled']);

        try {
            allureReporter.addStep('🚀 Starting mosaic bot creation');

            console.log('Creating ADC with mosaic model');
            await libraryAuthoringPage.clickNewDossierIcon();
            await libraryAuthoringPage.clickNewBot2Button();
            await libraryAuthoringPage.selectProjectAndDataset(project.name, mosaicModelInfo.name);
            await libraryAuthoringPage.waitForCurtainDisappear();
            await adc.saveToPath(mosaicADC.name, null, 'My Reports');
            await adc.waitForCurtainDisappear();

            console.log('Saving bot');
            await botAuthoring.clickSaveButton();
            await libraryAuthoringPage.saveToFolder(mosaicBot.name, null, 'My Reports');
            await since('Library title should be #{expected} but is #{actual}')
                .expect(await botConsumptionFrame.getBotName())
                .toEqual(mosaicBot.name);

            console.log('✅ Mosaic bot created successfully');
            allureReporter.addStep('✅ Mosaic bot created successfully');
            testState.mosaicBotCreated = true;

            console.log('Say hi');
            await aibotChatPanel.askQuestionNoWaitViz(`Hi`);
            await aibotChatPanel.waitForRecommendationSkeletonDisappear();
            await since(`Say hi should not contain error keywords: ${ERROR_KEYWORDS}`)
                .expect(await bot2Chat.verifyAnswerContainsOneOfKeywords(ERROR_KEYWORDS))
                .toBe(false);

            console.log('Ask normal question');
            await askQuestion(`Which airline name has the highest flights cancelled in "2010"?`);
            let expectedKeywords = 'Southwest Airlines Co.';
            await since(`Answer should contain expected keywords: ${expectedKeywords}`)
                .expect(await bot2Chat.verifyAnswerContainsKeywords(expectedKeywords))
                .toBe(true);

            console.log('Ask question to display grid');
            await askQuestion(`List all airlines in a table`, true);
            await since('Grid should be displayed')
                .expect(await aibotChatPanel.getGridByIndex(2).isDisplayed())
                .toBe(true);

            console.log('Ask key driver question');
            await askQuestion(`What is the key driver of Avg Delay?`, { enableResearchMode: true });
            expectedKeywords = 'Key Driver;Top Drivers';
            await since(`Answer should contain expected keywords: ${expectedKeywords}`)
                .expect(await bot2Chat.verifyAnswerContainsKeywords(expectedKeywords))
                .toBe(true);
            await since(`Answer should not contain error keywords: ${ERROR_KEYWORDS}`)
                .expect(await bot2Chat.verifyAnswerContainsOneOfKeywords(ERROR_KEYWORDS))
                .toBe(false);

            console.log('Go to library and check if it is in library');
            await aibotChatPanel.goToLibrary();
            await since(
                'Back to library page, the new bot in library should be "#{expected}", instead we have "#{actual}"'
            )
                .expect(await libraryPage.isDossierInLibrary(mosaicBot))
                .toBe(true);
        } catch (error) {
            console.error('❌ Failed during mosaic bot Q&A:', error.message);
            allureReporter.addStep(`❌ Failed during mosaic bot Q&A: ${error.message}`, {}, 'failed');
            throw error;
        }
    });

    (ingestOnLibrary ? xit : it)('[TC000000] Upload unstructured data by API', async () => {
        try {
            allureReporter.addStep('🚀 Starting unstructured data upload');

            if (!unstructuredDataInfo.useExisting) {
                console.log(
                    `Uploading unstructured data '${unstructuredDataInfo.name}' from URL: ${unstructuredDataInfo.sourceFileUrl}`
                );
                const uploadUnstructuredDataResponse = await uploadUnstructuredData({
                    credentials: tester.credentials,
                    projectId: project.id,
                    folderId: myReportsFolder.id,
                    fileUrl: unstructuredDataInfo.sourceFileUrl,
                    fileName: unstructuredDataInfo.name,
                });
                if (!uploadUnstructuredDataResponse || !uploadUnstructuredDataResponse.id) {
                    throw new Error(
                        `Failed to upload unstructured data from URL: ${unstructuredDataInfo.sourceFileUrl}`
                    );
                }
                unstructuredDataInfo.id = uploadUnstructuredDataResponse.id;

                await waitForNuggetReady({
                    credentials: tester.credentials,
                    nuggets: [
                        {
                            id: unstructuredDataInfo.id,
                            projectId: project.id,
                        },
                    ],
                    timeout: ingestTimeout,
                });

                console.log('✅ Unstructured data uploaded successfully');
                allureReporter.addStep('✅ Unstructured data uploaded successfully');
                testState.unstructuredDataUploaded = true;
            } else {
                console.log('✅ Using existing unstructured data, marked as uploaded');
                allureReporter.addStep('✅ Using existing unstructured data, marked as uploaded');
                testState.unstructuredDataUploaded = true;
            }
        } catch (error) {
            console.error('❌ Failed to upload unstructured data:', error.message);
            allureReporter.addStep(`❌ Failed to upload unstructured data: ${error.message}`, {}, 'failed');
            testState.unstructuredDataUploaded = false;
            throw error;
        }
    });

    (ingestOnLibrary ? it : xit)('[TC000000] Upload unstructured data on Library', async () => {
        try {
            allureReporter.addStep('🚀 Starting unstructured data upload on Library');

            console.log(`Downloading unstructured data from URL: ${unstructuredDataInfo.sourceFileUrl}`);
            // Extract filename with extension from URL
            const urlFileName = unstructuredDataInfo.sourceFileUrl.split('/').pop().split('?')[0];
            const fileExtension = path.extname(urlFileName);
            const tempDir = os.tmpdir();
            const tempFilePath = path.join(tempDir, unstructuredDataInfo.name + fileExtension);

            await downloadFileFromUrl(unstructuredDataInfo.sourceFileUrl, tempFilePath);
            console.log(`File downloaded to: ${tempFilePath}`);

            console.log('Creating ADC and navigating to unstructured data panel');
            await libraryAuthoringPage.clickNewDossierIcon();
            await libraryAuthoringPage.clickNewBot2Button();
            await libraryAuthoringPage.waitForProjectSelectionWindowAppear();
            await libraryAuthoringPage.selectProjectAndUnstructuredDataPanel(project.name);

            console.log('Verifying upload button is displayed');
            await since('Upload unstructured data button display should be #{expected} but is #{actual}')
                .expect(await libraryAuthoringPage.isUploadBtnDisplayed())
                .toBe(true);

            console.log('Opening upload dialog');
            await libraryAuthoringPage.clickUploadButton();
            await libraryAuthoringPage.waitForAddUnstructuredDataDialogAppear();

            console.log(`Uploading unstructured data file: ${tempFilePath}`);
            await libraryAuthoringPage.uploadUnstructuredData(tempFilePath);

            console.log('Saving unstructured data to My Reports');
            await libraryAuthoringPage.saveUnstructuredDataToMD(['My Reports']);
            await libraryAuthoringPage.waitForAllUnstructuredFileUploadComplete(ingestTimeout);

            console.log('Closing upload dialog');
            await libraryAuthoringPage.clickCancelButton();

            console.log('Cleaning up temporary file');
            fs.unlinkSync(tempFilePath);

            console.log('✅ Unstructured data uploaded successfully on Library');
            allureReporter.addStep('✅ Unstructured data uploaded successfully on Library');
            testState.unstructuredDataUploaded = true;
        } catch (error) {
            console.error('❌ Failed to upload unstructured data on Library:', error.message);
            allureReporter.addStep(`❌ Failed to upload unstructured data on Library: ${error.message}`, {}, 'failed');
            testState.unstructuredDataUploaded = false;
            throw error;
        }
    });

    it('[TC000000] Create unstructured bot and sanity Q&A', async () => {
        checkDependencies(['unstructuredDataUploaded']);

        try {
            allureReporter.addStep('🚀 Starting unstructured bot creation');

            console.log('Creating ADC with unstructured data');
            await libraryAuthoringPage.clickNewDossierIcon();
            await libraryAuthoringPage.clickNewBot2Button();
            await libraryAuthoringPage.waitForProjectSelectionWindowAppear();
            await libraryAuthoringPage.selectProjectAndUnstructuredData(project.name, unstructuredDataInfo.name);

            console.log('Saving ADC');
            await adc.waitForCurtainDisappear();
            await adc.saveToPath(unstructuredADC.name, null, 'My Reports');
            await adc.waitForCurtainDisappear();

            console.log('Saving bot');
            await botAuthoring.clickSaveButton();
            await libraryAuthoringPage.saveToFolder(unstructuredBot.name, null, 'My Reports');
            await since('Library title should be #{expected} but is #{actual}')
                .expect(await botConsumptionFrame.getBotName())
                .toEqual(unstructuredBot.name);

            console.log('✅ Unstructured bot created successfully');
            allureReporter.addStep('✅ Unstructured bot created successfully');
            testState.unstructuredBotCreated = true;

            console.log('Say hi');
            await aibotChatPanel.askQuestionNoWaitViz(`Hi`);
            await aibotChatPanel.waitForRecommendationSkeletonDisappear();
            await since(`Say hi should not contain error keywords: ${ERROR_KEYWORDS}`)
                .expect(await bot2Chat.verifyAnswerContainsOneOfKeywords(ERROR_KEYWORDS))
                .toBe(false);

            console.log('Ask question');
            await askQuestion('What is the price of Xarelto Pro Capsule?');
            await aibotChatPanel.sleep(1000);
            let expectedKeywords = '27.06';
            await since(`Answer should contain expected keywords: ${expectedKeywords}`)
                .expect(await bot2Chat.verifyAnswerContainsKeywords(expectedKeywords))
                .toBe(true);

            console.log('Go to library and check if it is in library');
            await aibotChatPanel.goToLibrary();
            await since(
                'Back to library page, the new bot in library should be "#{expected}", instead we have "#{actual}"'
            )
                .expect(await libraryPage.isDossierInLibrary(unstructuredBot))
                .toBe(true);
        } catch (error) {
            console.error('❌ Failed during unstructured bot Q&A:', error.message);
            allureReporter.addStep(`❌ Failed during unstructured bot Q&A: ${error.message}`, {}, 'failed');
            throw error;
        }
    });

    it('[TC000000] Create mixed bot and sanity Q&A', async () => {
        checkDependencies(['structuredCubeCreated', 'structuredCubeAiEnabled', 'unstructuredDataUploaded']);

        try {
            allureReporter.addStep('🚀 Starting mixed bot creation');

            console.log('Creating ADC with mixed data (structured data and unstructured data)');
            await libraryAuthoringPage.clickNewDossierIcon();
            await libraryAuthoringPage.clickNewBot2Button();
            await libraryAuthoringPage.waitForProjectSelectionWindowAppear();

            console.log('Adding structured data to ADC');
            await libraryAuthoringPage.changeProjectTo(project.name);
            await libraryAuthoringPage.selectDatasets([structuredCubeInfo.name]);

            console.log('Adding unstructured data to ADC');
            await libraryAuthoringPage.clickDatasetTypeInDatasetPanel('Unstructured Data');
            await libraryAuthoringPage.selectDatasets([unstructuredDataInfo.name]);

            console.log('Clicking create button');
            await libraryAuthoringPage.clickCreateButton();
            await libraryAuthoringPage.waitForCurtainDisappear();

            console.log('Saving ADC');
            await adc.saveToPath(mixedADC.name, null, 'My Reports');
            await adc.waitForCurtainDisappear();

            console.log('Saving bot');
            await botAuthoring.clickSaveButton();
            await libraryAuthoringPage.saveToFolder(mixedBot.name, null, 'My Reports');
            await since('Library title should be #{expected} but is #{actual}')
                .expect(await botConsumptionFrame.getBotName())
                .toEqual(mixedBot.name);

            console.log('✅ Mixed bot created successfully');
            allureReporter.addStep('✅ Mixed bot created successfully');
            testState.mixedBotCreated = true;

            console.log('Say hi');
            await aibotChatPanel.askQuestionNoWaitViz(`Hi`);
            await aibotChatPanel.waitForRecommendationSkeletonDisappear();
            await since(`Say hi should not contain error keywords: ${ERROR_KEYWORDS}`)
                .expect(await bot2Chat.verifyAnswerContainsOneOfKeywords(ERROR_KEYWORDS))
                .toBe(false);

            console.log('Ask question 1 - structured cube');
            await askQuestion('How many employees are there in Canada?');
            await aibotChatPanel.sleep(1000);
            let expectedKeywords = '12';
            await since(`Answer should contain expected keywords: ${expectedKeywords}`)
                .expect(await bot2Chat.verifyAnswerContainsKeywords(expectedKeywords))
                .toBe(true);

            console.log('Ask question 2 - unstructured data');
            await askQuestion('What is the price of Xarelto Pro Capsule?');
            await aibotChatPanel.sleep(1000);
            expectedKeywords = '27.06';
            await since(`Answer should contain expected keywords: ${expectedKeywords}`)
                .expect(await bot2Chat.verifyAnswerContainsKeywords(expectedKeywords))
                .toBe(true);

            console.log('Go to library and check if it is in library');
            await aibotChatPanel.goToLibrary();
            await since(
                'Back to library page, the new bot in library should be "#{expected}", instead we have "#{actual}"'
            )
                .expect(await libraryPage.isDossierInLibrary(mixedBot))
                .toBe(true);
        } catch (error) {
            console.error('❌ Failed during mixed bot Q&A:', error.message);
            allureReporter.addStep(`❌ Failed during mixed bot Q&A: ${error.message}`, {}, 'failed');
            throw error;
        }
    });

    it('[TC000000] Create universal bot and sanity Q&A', async () => {
        checkDependencies(['structuredBotCreated', 'unstructuredBotCreated', 'mosaicBotCreated']);

        try {
            allureReporter.addStep('🚀 Starting universal bot creation');

            console.log('Creating bot with structured, unstructured and mosaic bots');
            await libraryAuthoringPage.clickNewDossierIcon();
            await libraryAuthoringPage.clickNewBot2Button();
            await libraryAuthoringPage.waitForProjectSelectionWindowAppear();
            await libraryAuthoringPage.selectProjectAndAIBots(project.name, [
                structuredBot.name,
                unstructuredBot.name,
                mosaicBot.name,
            ]);

            console.log('Saving bot');
            await botAuthoring.clickSaveButton();
            await libraryAuthoringPage.saveToFolder(universalBot.name, null, 'My Reports');
            await since('Library title should be #{expected} but is #{actual}')
                .expect(await botConsumptionFrame.getBotName())
                .toEqual(universalBot.name);

            console.log('✅ Universal bot created successfully');
            allureReporter.addStep('✅ Universal bot created successfully');
            testState.universalBotCreated = true;

            console.log('Say hi');
            await aibotChatPanel.askQuestionNoWaitViz(`Hi`);
            await aibotChatPanel.waitForRecommendationSkeletonDisappear();
            await since(`Say hi should not contain error keywords: ${ERROR_KEYWORDS}`)
                .expect(await bot2Chat.verifyAnswerContainsOneOfKeywords(ERROR_KEYWORDS))
                .toBe(false);

            console.log('Ask question 1 - structured bot');
            await askQuestion('How many employees are there in Canada?');
            await aibotChatPanel.sleep(1000);
            let expectedKeywords = '12';
            await since(`Answer should contain expected keywords: ${expectedKeywords}`)
                .expect(await bot2Chat.verifyAnswerContainsKeywords(expectedKeywords))
                .toBe(true);

            console.log('Ask question 2 - mosaic bot');
            await askQuestion('Which airline name has the highest flights cancelled in "2010"?');
            await aibotChatPanel.sleep(1000);
            expectedKeywords = 'Southwest Airlines Co.';
            await since(`Answer should contain expected keywords: ${expectedKeywords}`)
                .expect(await bot2Chat.verifyAnswerContainsKeywords(expectedKeywords))
                .toBe(true);

            console.log('Ask question 3 - unstructured bot');
            await askQuestion('What is the price of Xarelto Pro Capsule?');
            await aibotChatPanel.sleep(1000);
            expectedKeywords = '27.06';
            await since(`Answer should contain expected keywords: ${expectedKeywords}`)
                .expect(await bot2Chat.verifyAnswerContainsKeywords(expectedKeywords))
                .toBe(true);

            console.log('Go to library and check if it is in library');
            await aibotChatPanel.goToLibrary();
            await since(
                'Back to library page, the new bot in library should be "#{expected}", instead we have "#{actual}"'
            )
                .expect(await libraryPage.isDossierInLibrary(universalBot))
                .toBe(true);
        } catch (error) {
            console.error('❌ Failed during universal bot Q&A:', error.message);
            allureReporter.addStep(`❌ Failed during universal bot Q&A: ${error.message}`, {}, 'failed');
            throw error;
        }
    });
});
