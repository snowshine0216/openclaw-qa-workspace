import AIBotChatPanel from './AIBotChatPanel.js';
import AIBotDatasetPanel from './AIBotDatasetPanel.js';
import BasePage from '../base/BasePage.js';
import DossierAuthoringPage from '../dossier/DossierAuthoringPage.js';
import LibraryAuthoringPage from '../library/LibraryAuthoringPage.js';
import LibraryPage from '../library/LibraryPage.js';
import MetricDialog from '../web_home/MetricDialog.js';

export default class Bot2Chat extends BasePage {
    constructor() {
        super();
        this.libraryPage = new LibraryPage();
        this.metricDialog = new MetricDialog();
        this.libraryAuthoringPage = new LibraryAuthoringPage();
        this.aiBotChatPanel = new AIBotChatPanel();
        this.dossierAuthoringPage = new DossierAuthoringPage();
        this.aiBotDatasetPanel = new AIBotDatasetPanel();
    }

    // Locator
    getChatBotLatestChat() {
        return this.$$(
            `((//div[@class='MessageList']/div)[last()]//div[contains(@class, 'mstr-chatbot-markdown')])`
        )[0];
    }

    async getLatestAnswerInAIChatbot() {
        const resElement = await this.getChatBotLatestChat();
        const res = await browser.execute('return arguments[0].innerText;', resElement);
        console.log('chatbot response: ' + res);
        return res;
    }

    /**
     * Verify if the chatbot's latest answer contains specific keywords.
     * @param {string} words - Keywords separated by semicolons (';').
     * @param {boolean} [ignoreCase=true] - Whether to ignore case when matching keywords.
     */
    async verifyAnswerContainsKeywords(words, ignoreCase = true) {
        let res = await this.getLatestAnswerInAIChatbot();
        if (ignoreCase) res = res.toLowerCase();

        let matchResFlag = true;
        const expectKeywords = words.split(';');

        for (const word of expectKeywords) {
            const targetWord = ignoreCase ? word.toLowerCase().trim() : word.trim();
            const isNumber = !isNaN(targetWord);

            if (isNumber && !(await this.checkMetricValue(res, [Number(targetWord)]))) {
                console.log(`Mismatch: Expected number ${targetWord} not found in response.`);
                matchResFlag = false;
            }

            if (!isNumber && !res.includes(targetWord)) {
                console.log(`Mismatch: Expected keyword '${targetWord}' not found in response.`);
                matchResFlag = false;
            }
        }

        return matchResFlag;
    }

    /**
     * Verify if the chatbot's latest answer contains any of the specified keywords.
     * @param {string} words - Keywords separated by semicolons (';').
     * @param {boolean} [ignoreCase=true] - Whether to ignore case when matching keywords.
     * @returns {Promise<boolean>} - Returns true if any keyword is found, otherwise false.
     */
    async verifyAnswerContainsOneOfKeywords(words, ignoreCase = true) {
        let res = await this.getLatestAnswerInAIChatbot();
        if (ignoreCase) res = res.toLowerCase();

        const keywordList = words.split(';');

        for (const word of keywordList) {
            const targetWord = ignoreCase ? word.toLowerCase() : word;
            const isNumber = !isNaN(targetWord);

            if (isNumber) {
                if (await this.checkMetricValue(res, [Number(targetWord)])) {
                    console.log(`Matched number: ${targetWord}`);
                    return true;
                }
            } else {
                if (res.includes(targetWord)) {
                    console.log(`Matched keyword: ${targetWord}`);
                    return true;
                }
            }
        }

        console.log(`No matching keywords found in response. Expected any of: ${keywordList.join(', ')}`);
        return false;
    }

    /**
     * Check if the chatbot response contains specific numeric values.
     * @param {string} response - Chatbot's response text.
     * @param {number[]} metricArray - Expected numeric values.
     * @returns {boolean} - Whether the response contains the expected numbers.
     */

    async checkMetricValue(response, metricArray) {
        let numberPattern = /(-?\d+(?:,\d+)*(\.\d+)?)/g;
        let metrics = response.match(numberPattern);

        if (!metrics) {
            return false;
        }

        let metricValues = metrics.map((metric) => parseFloat(metric.replace(/,/g, '')));

        for (const metric of metricArray) {
            const found =
                metric === 0
                    ? metricValues.some((value) => Math.abs(value) < 0.01)
                    : metricValues.some((value) => Math.abs(value - metric) / Math.abs(metric) < 0.01);

            if (!found) {
                console.log(`Number ${metric} not found in chatbot response.`);
                return false;
            }
        }
        return true;
    }
}
