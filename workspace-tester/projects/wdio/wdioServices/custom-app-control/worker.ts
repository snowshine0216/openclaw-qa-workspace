import type { Services } from '@wdio/types';
import createCustomApp from '../../api/customApp/createCustomApp.js';
import { darkTheme, redTheme, getRequestBody } from '../../constants/customApp/bot.js';
import { deleteCustomAppList } from '../../api/customApp/deleteCustomApp.js';
import getLogger from '../../scripts/logger.js';
import { SevereServiceError } from 'webdriverio';
import deleteCustomAppByNames from '../../api/customApp/deleteCustomAppByNames.js';

const logger = getLogger('[CustomAppControlService] ');

export interface ServiceOptions {
    theme?: string;
}

const DEFAULT_OPTIONS = {
    theme: '',
};

export default class CustomAppControlService implements Services.ServiceInstance {
    options: ServiceOptions;
    customAppId: string;

    constructor(serviceOptions: ServiceOptions) {
        this.options = Object.assign(DEFAULT_OPTIONS, serviceOptions);
        logger.log(`CustomAppControl service is enabled`);
    }

    getSelectedThemeConfig() {
        if (this.options.theme === 'dark') {
            return { useColorTheme: true, selectedTheme: darkTheme };
        } else if (this.options.theme === 'red') {
            return { useColorTheme: true, selectedTheme: redTheme };
        } else {
            throw new SevereServiceError(`Invalid theme: ${this.options.theme} Not supported yet!`);
        }
    }

    normalizedUrl(currentUrl: string): string {
        const pieces = currentUrl.split('app');
        if (pieces[1].startsWith('/')) {
            pieces[1] = pieces[1].substring(1);
        }
        if (pieces[1].includes('config')) {
            const subPieces = pieces[1].split('/');
            subPieces[1] = this.customAppId;
            pieces[1] = subPieces.join('/');
        } else {
            pieces[1] = `config/${this.customAppId}/${pieces[1]}`;
        }
        return `${pieces[0]}app/${pieces[1]}`;
    }

    async before(): Promise<void> {
        logger.log(`using theme: ${this.options.theme}`);
        const customAppNamePrefix = 'test custom app color theme';
        const themeConfig = this.getSelectedThemeConfig();
        const customAppInfo = getRequestBody({
            name: `${customAppNamePrefix} - ${this.options.theme}`,
            ...themeConfig,
            disclaimer: '',
            feedback: false,
            learning: false,
        });
        // await deleteCustomAppByNames({
        //     credentials: {
        //         username: browsers.params.credentials.webServerUsername,
        //         password: browsers.params.credentials.webServerPassword,
        //     },
        //     namesToFind: [customAppNamePrefix],
        //     exactMatch: false,
        // });
        this.customAppId = await createCustomApp({
            credentials: {
                username: browsers.params.credentials.webServerUsername,
                password: browsers.params.credentials.webServerPassword,
            },
            customAppInfo: customAppInfo,
        });
    }

    async beforeTest(): Promise<void> {
        logger.log('CustomAppControl is running beforeTest() hook to switch app');
        const { libraryPage } = browsers.pageObj1;
        const currentUrl = await libraryPage.currentURL();
        if (currentUrl.includes(this.customAppId)) return;
        const newUrl = this.normalizedUrl(currentUrl);
        await browser.url(newUrl);
        await libraryPage.waitForLibraryLoading();
    }

    async after(): Promise<void> {
        logger.log('CustomAppControl is running after() hook');
        await deleteCustomAppList({
            credentials: {
                username: browsers.params.credentials.webServerUsername,
                password: browsers.params.credentials.webServerPassword,
            },
            customAppIdList: [this.customAppId],
        });
    }
}
