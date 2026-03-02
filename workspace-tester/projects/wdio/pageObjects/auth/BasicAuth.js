import {
    buildWebUrl,
    getAdminUrl,
    getTaskAdminUrl,
    getTaskProcUrl,
    getServerAdminUrl,
    buildSAMLConfigUrl,
    getServletMobileUrl,
    getTaskViewerUrl,
} from '../../utils/index.js';
import BasePage from '../base/BasePage.js';

import urllib from 'urllib';
import ntlm from '@elastic.io/ntlm-client';

export default class BasicAuth extends BasePage {
    getMainUrl() {
        return buildWebUrl();
    }

    getAdminUrl() {
        return getAdminUrl();
    }

    getTaskAdminUrl() {
        return getTaskAdminUrl();
    }

    getServerAdminUrl() {
        return getServerAdminUrl();
    }

    getSAMLUrl() {
        return buildSAMLConfigUrl();
    }

    getTaskProcUrl() {
        return getTaskProcUrl();
    }

    getServletMobileUrl() {
        return getServletMobileUrl();
    }

    getTaskViewerUrl() {
        return getTaskViewerUrl();
    }

    async getBasicAuthResopne(url, auth = '') {
        const options = {
            auth,
            rejectUnauthorized: false,
            timeout: 15000,
        };
        try {
            const response = await urllib.request(url, options);
            console.log('status code: %s', response.res.statusCode);
            return response.res.statusCode;
        } catch (error) {
            console.log('error: %s', error.res.statusCode);
            return error.res.statusCode;
        }
    }

    async getNtlmAuthResponse(url, auth = { username: '', password: '' }) {
        try {
            const { response } = await ntlm.request({
                uri: url,
                username: auth.username,
                password: auth.password,
            });
            return response.statusCode;
        } catch (error) {
            console.log('error: %s', error);
            return error.statusCode;
        }
    }
}
