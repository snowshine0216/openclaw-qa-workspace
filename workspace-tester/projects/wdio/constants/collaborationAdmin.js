/**
 * Parse baseUrl to be compatible with API syntax
 * @param {string} baseUrl baseUrl
 * @returns {string} new url without port
 */
export function getDomainUrl(baseUrl) {
    let newUrl = baseUrl;
    const portPos = baseUrl.indexOf('8443') || baseUrl.indexOf('8080');
    if (portPos !== -1) {
        newUrl = baseUrl.substring(0, portPos);
    }
    return newUrl;
}
/**
 * Parse baseUrl to be compatible with API syntax
 * @param {string} baseUrl baseUrl
 * @returns {string} domain ip
 */
export function getDomainIP(baseUrl) {
    let newUrl = getDomainUrl(baseUrl);
    const httpPos = newUrl.indexOf('//');
    if (httpPos !== -1) {
        newUrl = newUrl.substring(httpPos + 1);
    }
    const colonPos = newUrl.indexOf(':');
    if (colonPos !== -1) {
        newUrl = newUrl.substring(1, colonPos);
    }
    return newUrl;
}

//dossier credentials
let baseUrl = 'https://mci-ze4yt-dev.hypernow.microstrategy.com/MicroStrategyLibrary/';
// let baseUrl = browser.getUrl();
export const domainURL = getDomainUrl(baseUrl);
export const domainIP = getDomainIP(baseUrl);
export const libraryURL = baseUrl;
export const collaborationURL = domainURL + '3000';
export const collaborationDevURL = 'http://' + domainIP + ':3003';
export const collaborationAdminURL = baseUrl + 'admin/collabserver';
export const commentsEnabledOnly = {
    libraryURL: libraryURL, // the library server URL
    baseURL: collaborationURL, // the collaboration server URL
    commentsEnabled: true,
    discussionsEnabled: false,
    enabled: true,
    tlsEnabled: true,
    updated: false,
};

export const disscussionEnabledOnly = {
    libraryURL: libraryURL, // the library server URL
    baseURL: collaborationURL, // the collaboration server URL
    commentsEnabled: false,
    discussionsEnabled: true,
    enabled: true,
    tlsEnabled: true,
    updated: false,
};

export const collaborationEnabled = {
    libraryURL: libraryURL, // the library server URL
    baseURL: collaborationURL, // the collaboration server URL
    commentsEnabled: true,
    discussionsEnabled: true,
    enabled: true,
    tlsEnabled: false,
    updated: false,
};

export const collaborationDisabled = {
    libraryURL: libraryURL, // the library server URL
    baseURL: collaborationURL, // the collaboration server URL
    commentsEnabled: false,
    discussionsEnabled: false,
    enabled: false,
    tlsEnabled: false,
    updated: false,
};
