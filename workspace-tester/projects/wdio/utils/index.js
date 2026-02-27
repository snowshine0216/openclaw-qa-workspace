function normalizedBaseUrl() {
    // Add credentials to the ASPx environment
    if (isASPx()) {
        return browser.options.baseUrl;
    }

    return `${browser.options.baseUrl.replace(/\/$/, '')}/`;
}

function isASPx() {
    return browser.options.baseUrl.includes('aspx');
}

export function buildUrl(path, params = {}) {
    const base = normalizedBaseUrl();
    const url = new URL(path, base);
    url.search = new URLSearchParams(params);
    return url;
}

export function buildUrlWithCredentials(path, params = {}) {
    const { username, password, ...rest } = params;
    const url = buildUrl(path, rest);
    url.username = username || browsers.params.credentials.webServerUsername;
    url.password = password || browsers.params.credentials.webServerPassword;
    return url;
}

export function buildWebUrl(params = {}) {
    if (isASPx()) {
        return buildUrlWithCredentials('Main.aspx', params).toString();
    }
    return buildUrl('servlet/mstrWeb', params).toString();
}

export function getAdminUrl() {
    const adminPath = isASPx() ? 'Admin.aspx' : 'servlet/mstrWebAdmin';
    return buildUrlWithCredentials(adminPath).toString();
}

export function getAdminUrlWithUser(username, password) {
    const adminPath = isASPx() ? 'Admin.aspx' : 'servlet/mstrWebAdmin';
    return buildUrlWithCredentials(adminPath, { username, password }).toString();
}

export function getServerAdminUrl() {
    const adminPath = isASPx() ? 'SrvrAdmin.aspx' : 'servlet/mstrServerAdmin';
    return buildUrlWithCredentials(adminPath).toString();
}

export function getTaskAdminUrl() {
    const adminPath = isASPx() ? 'taskAdmin.aspx' : 'servlet/taskAdmin';
    return buildUrlWithCredentials(adminPath).toString();
}

export function getTaskAdminUrlWithUser(username, password) {
    const adminPath = isASPx() ? 'taskAdmin.aspx' : 'servlet/taskAdmin';
    return buildUrlWithCredentials(adminPath, { username, password }).toString();
}

export function getTaskProcUrl() {
    const taskPath = isASPx() ? 'TaskProc.aspx' : 'servlet/taskProc';
    return buildUrl(taskPath).toString();
}

export function getServletMobileUrl() {
    const taskPath = isASPx() ? 'Mobile.aspx' : 'servlet/mobile';
    return buildUrl(taskPath).toString();
}

export function getTaskViewerUrl() {
    const taskPath = isASPx() ? 'TaskViewer.aspx' : 'servlet/taskViewer';
    return buildUrl(taskPath).toString();
}

export function getHealthUrl() {
    return buildUrl('health').toString();
}

export function getPurgeCacheUrl(params = { pg: 'purgecaches' }) {
    if (isASPx()) {
        return buildUrlWithCredentials('Admin.aspx', params).toString();
    }
    return buildUrl('servlet/mstrWebAdmin', params).toString();
}

export function getIServer() {
    return browsers.params.iserver;
}

// Passed by --params.project
export function getProject() {
    return browsers.params.project;
}

export function getAccountName() {
    return browsers.params.credentials.username;
}

export function getAccountPassword() {
    return browsers.params.credentials.password;
}

export function getLibraryUrl() {
    return browsers.params.mstrWebLibraryUrl;
}

/**
 * Build SAML config URL
 * @returns {string} SAML config URL
 */
export function buildSAMLConfigUrl() {
    return buildUrl('saml/config/open').toString();
}

export function buildOIDCLoginUrl() {
    return buildUrl('auth/oidc/login').toString();
}

export function buildSAMLConfigUrlWithCredential() {
    return buildUrlWithCredentials('saml/config/open').toString();
}

export function buildAdminUrl() {
    return buildUrl('admin').toString();
}

export function buildAdminUrlWithCredential() {
    return buildUrlWithCredentials('admin').toString();
}

/**
 * Build MSTR Web URL with library url
 * @returns {string} MSTR Web URL
 */
export function buildMSTRWebUrl(params = {}) {
    const baseurl = browser.options.baseUrl.replace(/^\/+|\/+$/g, '');
    const base = baseurl.slice(0, -7);
    const url = new URL(`${base}/servlet/mstrWeb`);
    url.search = new URLSearchParams(params);
    return url.toString();
}

export function getMSTRWebAdminUrl() {
    const adminPath = isASPx() ? 'Admin.aspx' : 'servlet/mstrWebAdmin';
    return buildUrlWithCredentials(adminPath).toString();
}

function escapeRegExp(string) {
    return string
        .replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
        .replace(/\s/g, '\\s');
}

export function multiElements(...args) {
    return new RegExp(args.flat().map(escapeRegExp).join('|'));
}

/**
 * Build the event url
 * @param {string} evt The event id
 * @param {object} params Extra params
 * @returns {string} url
 */
export function buildEventUrl(evt, params = {}) {
    return buildWebUrl({ evt, src: `mstrWeb.${evt}`, ...params });
}

export function buildAdminEventUrl(evt, params = {}) {
    const adminPath = isASPx() ? 'Admin.aspx' : 'servlet/mstrWebAdmin';
    const parameters = isASPx()
        ? { evt, src: `Admin.aspx.${evt}`, ...params }
        : { evt, src: `mstrWebAdmin.${evt}`, ...params };
    return buildUrlWithCredentials(adminPath, parameters).toString();
}

/* Count the number of new opened windows/tabs after actions */
export async function numberOfNewWindow(actions) {
    const originalWindowHandles = await browser.getWindowHandles();
    await actions();
    const newWindowHandles = await browser.getWindowHandles();
    return newWindowHandles.length - originalWindowHandles.length;
}

export async function switchToMainWindow() {
    console.log('Switching to the main window...');
    const handles = await browser.getWindowHandles();
    await browser.switchToWindow(handles[0]);
    console.log('Switched to the main window.');
}

export async function clearTextarea(el) {
    return browser.execute('arguments[0].value = ""', await el);
}

export async function getAllWindows() {
    const handles = await browser.getWindowHandles();
    return handles.length;
}

export async function closeOtherWindows() {
    const handles = await browser.getWindowHandles();
    const mainWindowHandle = handles[0];

    for (const handle of handles) {
        if (handle !== mainWindowHandle) {
            console.log('Switching to window', handle);
            await browser.switchToWindow(handle);
            try {
                console.log('Closing window', handle);
                await browser.closeWindow();
                console.log('Window', handle, 'closed');
            } catch (e) {
                console.log('Failed to close window', handle, e);
            }
        }
    }

    await switchToMainWindow();
}
