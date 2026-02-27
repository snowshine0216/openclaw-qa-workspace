import BasePage from '../base/BasePage.js';

const iframeEmbeddingScriptPath = '/javascript/embeddinglib.js';

export default class IframeEmbeddingPage extends BasePage {
    constructor(embeddingUrl, serverUrl, config) {
        super();
        this.embeddingUrl = embeddingUrl;
        this.serverUrl = serverUrl;
        this.config = config;
    }

    async loadScripts() {
        await this.switchToParentFrame();
        const scriptToLoad = this.serverUrl + iframeEmbeddingScriptPath;
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

    async navigateToPage() {
        await browser.url(this.embeddingUrl);
        console.log('Navigated to embedding page');
    }

    async getIFrame() {
        const iframeSelector = this.$('[mstr-embed-iframe="true"]');
        await iframeSelector.waitForExist({ timeout: 10000 });
        return iframeSelector;
    }

    async switchToIFrame() {
        const iframe = await this.getIFrame();
        await browser.switchToFrame(iframe);
        console.log('Switched to the iframe');
        const isInIframe = await browser.execute(() => {
            return window.self !== window.top;
        });

        if (!isInIframe) {
            throw new Error('Failed to switch to the iframe');
        }
    }

    async switchToParentFrame() {
        await browser.switchToParentFrame();
        console.log('Switched to parent frame');
        const isInIframe = await browser.execute(() => {
            return window.self === window.top;
        });

        if (!isInIframe) {
            throw new Error('Failed to switch to the parent frame');
        }
    }

    async createEnvironment() {
        await this.switchToParentFrame();

        const { config } = this;

        await browser.execute((cfg) => {
            const container = document.getElementById('container');
            if (!container) throw new Error('container can not found');
            if (!window.microstrategy) {
                throw new Error('microStrategy is not defined');
            }
            if (!window.microstrategy.embeddingContexts) {
                throw new Error('embeddingContexts is not initialized');
            }
            const finalConfig = {
                ...cfg,
                placeholder: document.getElementById('container'),
            };

            window.microstrategy.embeddingContexts.embedLibraryPage(finalConfig);
        }, config);
        await this.switchToIFrame();
    }

    async createDocConsumptionPage() {
        await this.switchToParentFrame();
        const { config } = this;
        const res = await browser.execute(
            (serverUrl, projectId, objectId, placeholderId, customApplicationId, settings) => {
                try {
                    const docConsumptionConfig = {
                        serverUrl,
                        projectId,
                        objectId,
                        placeholder: document.getElementById('container'),
                        customApplicationId,
                        settings,
                    };
                    window.microstrategy.embeddingContexts.embedDocumentConsumptionPage(docConsumptionConfig).then(doc => {
                        doc.registerEventHandler(
                        microstrategy.embeddingContexts.EventType.ON_COMPONENT_SELECTION_CHANGED,
                        function (event) {
                            console.log('-> event: ', event);
                            if (!window.componentSelectionEvents) {
                                window.componentSelectionEvents = [];
                            }
                            window.componentSelectionEvents.push(event);
                        }
                    );
                    })
                    
                } catch (error) {
                }
            },
            config.serverUrl,
            config.projectId,
            config.objectId,
            config.placeholderId,
            config.customApplicationId,
            config.settings
        );
        console.log('Document Consumption Page embedded successfully');
        await this.switchToIFrame();
        return res;
    }
}
