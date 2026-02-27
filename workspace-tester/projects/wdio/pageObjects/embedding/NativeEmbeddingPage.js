import BasePage from '../base/BasePage.js';
import createDossierInstance from '../../api/createDossierInstance.js';
import urlParser from '../../api/urlParser.js';
import authentication from '../../api/authentication.js';

const nativeEmbeddingScriptPath = '/javascript/native-embedding-sdk.js';

export default class NativeEmbeddingPage extends BasePage {
    constructor(embeddingUrl, libraryUrl) {
        super();
        this.embeddingUrl = embeddingUrl;
        this.libraryUrl = libraryUrl;
    }

    async loadScripts() {
        const scriptToLoad = this.libraryUrl + nativeEmbeddingScriptPath;
        const func = async (scriptToLoad) => {
            return new Promise((resolve, reject) => {
                var script = document.createElement('script');
                script.src = scriptToLoad;
                script.type = 'text/javascript';
                script.async = true;
                script.onload = function () {
                    resolve('Script loaded successfully: ' + scriptToLoad);
                };
                script.onerror = function () {
                    reject('Error loading script: ' + scriptToLoad);
                };
                document.head.appendChild(script);
            });
        };
        await this.executeScript(func, scriptToLoad);
        console.log('Scripts loaded successfully');
    }

    async createEnvironment(loginConfig) {
        const func = async (serverUrl, loginConfig) => {
            const config = {
                serverUrl,
                getAuthToken: async () => {
                    return fetch(`${serverUrl}/api/auth/login`, {
                        method: 'POST',
                        credentials: 'include', // including cookie
                        mode: 'cors', // setting as CORS mode for cross origin
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(loginConfig),
                    }).then((response) => {
                        if (response && response.ok) {
                            return response.headers.get('X-MSTR-authToken');
                        }
                        throw Error('Failed to fetch auth token.');
                    });
                },
            };
            window._environment = await microstrategy.embeddingComponent.environments.create(config);
        };

        await this.executeScript(func, this.libraryUrl, loginConfig);
        console.log('Environment created successfully');
    }

    async loadDashboard(projectId, dashboardId) {
        const func = async (dashboardConfig) => {
            if (!window._environment) {
                throw new Error('Environment is not created. Please create environment first.');
            }
            window._dossiersMap = window._dossiersMap || {};
            const dossierKey = dashboardConfig.projectId + '-' + dashboardConfig.objectId;
            if (!window._dossiersMap[dossierKey]) {
                window._dossiersMap[dossierKey] = await window._environment.loadDossier(dashboardConfig);
            }
        };

        const dossierKey = projectId + '-' + dashboardId;
        const dashboard = {
            projectId: projectId,
            objectId: dashboardId,
        };
        await this.executeScript(func, dashboard);
        console.log('Dashboard ' + dossierKey + ' loaded successfully');
        return dossierKey;
    }

    async renderVisualizations(dossierKey, visKeys) {
        const func = async (dossierKey, visKeys = []) => {
            if (!window._environment) {
                throw new Error('Environment is not created. Please create environment first.');
            }

            const dossier = window._dossiersMap && window._dossiersMap[dossierKey];
            if (!dossier) {
                throw new Error('Dossier is not loaded. Please load dossier first.');
            }

            const mainContainer = document.getElementById('container');
            const visRenderList = [];
            for (const visKey of visKeys) {
                const visContainer = document.createElement('div');
                visContainer.classList.add('vis-container');
                visContainer.id = visKey;
                // populate the vizInfo: vizType, vizName, vizKey
                mainContainer.appendChild(visContainer);

                visRenderList.push({
                    key: visKey,
                    container: visContainer,
                });
            }

            await dossier.refresh(visRenderList);
        };

        await this.executeScript(func, dossierKey, visKeys);
        console.log('Visualizations rendered successfully for dossier ' + dossierKey);
    }

    async renderVisualizationsWithInfowindow(dossierKey, visKeys) {
        const func = async (dossierKey, visKeys = []) => {
            if (!window._environment) {
                throw new Error('Environment is not created. Please create environment first.');
            }

            const dossier = window._dossiersMap && window._dossiersMap[dossierKey];
            if (!dossier) {
                throw new Error('Dossier is not loaded. Please load dossier first.');
            }

            const mainContainer = document.getElementById('container');
            const visRenderList = [];
            for (const visKey of visKeys) {
                const visContainer = document.createElement('div');
                visContainer.classList.add('vis-container');
                visContainer.id = visKey;
                // populate the vizInfo: vizType, vizName, vizKey
                mainContainer.appendChild(visContainer);

                visRenderList.push({
                    key: visKey,
                    container: visContainer,
                    infoWindow: {
                        enable: true,
                    },
                });
            }

            await dossier.refresh(visRenderList);
        };

        await this.executeScript(func, dossierKey, visKeys);
        console.log('Visualizations rendered successfully for dossier ' + dossierKey);
    }

    async applyFilters(dossierKey, filters) {
        const func = async (dossierKey, filters) => {
            const dossier = window._dossiersMap && window._dossiersMap[dossierKey];
            if (!dossier) {
                throw new Error('Dossier is not loaded. Please load dossier first.');
            }

            await dossier.applyFilters(filters);
        };

        await this.executeScript(func, dossierKey, filters);
    }

    async applyFilter(dossierKey, filter) {
        const func = async (dossierKey, filter) => {
            const dossier = window._dossiersMap && window._dossiersMap[dossierKey];
            if (!dossier) {
                throw new Error('Dossier is not loaded. Please load dossier first.');
            }

            await dossier.applyFilter(filter);
        };

        await this.executeScript(func, dossierKey, filter);
    }

    async enableMultipleInstance() {
        const func = async () => {
            if (!window._environment) {
                throw new Error('Environment is not created. Please create environment first.');
            }
            window.microstrategy.nativeEmbedding.featureFlags.multipleDossiers = true;
        };

        await this.executeScript(func);
    }

    async createBookmark(dossierKey, bookmarkName) {
        const func = async (dossierKey, bookmarkName) => {
            if (!window._environment) {
                throw new Error('Environment is not created. Please create environment first.');
            }
            const dossier = window._dossiersMap && window._dossiersMap[dossierKey];
            if (!dossier) {
                throw new Error('Dossier is not loaded. Please load dossier first.');
            }
            await dossier.createNewBookmark({ name: bookmarkName });
        };

        await this.executeScript(func, dossierKey, bookmarkName);
    }

    async listBookmarks(projectId, objectId, visKey, dossierKey) {
        const func = async (projectId, objectId, visKey, dossierKey) => {
            if (!window._environment) {
                throw new Error('Environment is not created. Please create environment first.');
            }
            const dossier = window._dossiersMap && window._dossiersMap[dossierKey];
            if (!dossier) {
                throw new Error('Dossier is not loaded. Please load dossier first.');
            }
            // render all bookmarks
            const bookmarkList = await dossier.getAvailableBookmarkList();
            const mainContainer = document.getElementById('container');
            const resultKeys = [];

            await Promise.all(bookmarkList.map(async (bookmark, idx) => {
                console.log(`Bookmark ${idx}:`, bookmark.id, bookmark.name);
                const vizCopyContainer = document.createElement('div');
                vizCopyContainer.classList.add('vis-container');
                vizCopyContainer.id = visKey;
                mainContainer.appendChild(vizCopyContainer);
                const dossierBookmarkKey = projectId + '-' + objectId + '-' + bookmark.id;
                resultKeys.push(dossierBookmarkKey);
                if (!window._dossiersMap[dossierBookmarkKey]) {
                    window._dossiersMap[dossierBookmarkKey] = await window._environment.loadDossier({
                        projectId: projectId,
                        objectId: objectId,
                        bookmarkId: bookmark.id,
                    });
                }

                console.log('Dashboard ' + dossierBookmarkKey + ' loaded successfully');
                await window._dossiersMap[dossierBookmarkKey].refresh([
                    {
                    key: visKey,
                    container: vizCopyContainer,
                    
                    },
                ]);
            }));
            return resultKeys;
        };
        return await this.executeScript(func, projectId, objectId, visKey, dossierKey);
    }

    async createNewDashboardInstance({dossier, credentials, visKey}) {
        const func = async (projectId, dashboardId, instanceId, visKey, dossierInstanceKey) => {
            if (!window._environment) {
                throw new Error('Environment is not created. Please create environment first.');
            }
            window._dossiersMap = window._dossiersMap || {};
            if (!window._dossiersMap[dossierInstanceKey]) {
                window._dossiersMap[dossierInstanceKey] = await window._environment.loadDossier({
                    projectId: projectId,
                    objectId: dashboardId,
                    instanceId: instanceId
                }, { forceCreateNewInstance: true });
            }
            console.log('Dashboard ' + dossierInstanceKey + ' loaded successfully');
            const mainContainer = document.getElementById('container');
            const vizCopyContainer = document.createElement('div');
            vizCopyContainer.classList.add('vis-container');
            vizCopyContainer.id = visKey;
            mainContainer.appendChild(vizCopyContainer);
            await window._dossiersMap[dossierInstanceKey].refresh([
                {
                key: visKey,
                container: vizCopyContainer,
                
                },
            ]);
        };
        const baseUrl = urlParser(browser.options.baseUrl);
        const session = await authentication({ baseUrl, authMode: 1, credentials });
        const instanceId = (await createDossierInstance({ baseUrl, session, dossier })).id;
        const projectId = dossier.project.id;
        const dashboardId = dossier.id;
        const dossierInstanceKey = projectId + '-' + dashboardId + '-' + instanceId;
        await this.executeScript(func, projectId, dashboardId, instanceId, visKey, dossierInstanceKey);
        console.log('Dashboard ' + dossierInstanceKey + ' loaded successfully');
        return dossierInstanceKey;
    }
}