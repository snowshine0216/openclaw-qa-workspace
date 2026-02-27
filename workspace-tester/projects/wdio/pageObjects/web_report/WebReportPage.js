import WebBasePage from '../base/WebBasePage.js';
import { buildEventUrl } from '../../utils/index.js';
import ReportGrid from './ReportGrid.js';
import ReportDetailsPanel from './ReportDetailsPanel.js';
import GridToolbar from './GridToolbar.js';
import ReportToolbar from './ReportToolbar.js';
import ReportPageBy from './ReportPageBy.js';
import ReportObjectsPanel from './ReportObjectsPanel.js';
import BaseDialog from '../base/BaseDialog.js';
import ReportViewFilter from './ReportViewFilter.js';
import ReportPromptDetails from './ReportPromptDetails.js';
import ReportDetailsPage from './ReportDetailsPage.js';
import ShareDialog from '../web_home/ShareDialog.js';

export default class WebReportPage extends WebBasePage {
    constructor() {
        super();
        this.reportPageBy = new ReportPageBy();
        this.gridToolbar = new GridToolbar();
        this.reportToolbar = new ReportToolbar();
        this.reportObjectsPanel = new ReportObjectsPanel();
        this.baseDialog = new BaseDialog();
        this.reportGrid = new ReportGrid();
        this.reportViewFilter = new ReportViewFilter();
        this.reportDetails = new ReportDetailsPanel();
        this.promptDetails = new ReportPromptDetails();
        this.reportDetailsPage = new ReportDetailsPage();
    }
    /**
     * Run a report by ID
     * @param {string} reportID The report id
     * @param {string} params extra Url parameters
     * @returns {Promise<any>} The browser Promise
     */
    async open(reportID, params) {
        if (params === null || params === undefined) {
            await browser.url(buildEventUrl(4001, { reportID }));
        } else {
            await browser.url(buildEventUrl(4001, { reportID }) + params);
        }
        return this.waitForCurtainDisappear();
    }

    getReportLayout() {
        return this.$('.repLayout.viewMode');
    }

    getReportToolbarTab(name) {
        return this.$$(`.mstrListBlockToolbarItemName`).filter(async (item) => ((await item.getText()).toLowerCase()).includes(name.toLowerCase()))[0];
    }

    getReportToolbarDropdown(name) {
        return this.getParent(this.getReportToolbarTab(name)).$('.right.menu');
    }

    getMenuItem(name) {
        return this.$$(`.mstrFloatingMenuContainer .mstrFloatingMenuItem`).filter(async (item) => (await item.getText()).includes(name))[0];
    }

    async findShareDialog() {
        const shareDialog = new ShareDialog();
        await this.waitForElementVisible(shareDialog.locator);
        return shareDialog;
    }

    async openReportToolbarMenu(tab, menuPaths) {
        await this.click({ elem: this.getReportToolbarTab(tab) });
        await this.click({ elem: this.getReportToolbarDropdown(tab) });
        for (const menuItem of menuPaths) {
            try {
                const el = this.getMenuItem(menuItem);
                await this.click({ elem: el });
            } catch (e) {
                throw new Error(e);
            }
        }
    }

    async openReportPanel(name) {
        this.baseReportPanel = new BaseReportPanel();
        return this.baseReportPanel.chooseTab(name);
    }

    async waitContentLoading() {
        return this.waitForElementVisible(this.getReportLayout());
    }
}
