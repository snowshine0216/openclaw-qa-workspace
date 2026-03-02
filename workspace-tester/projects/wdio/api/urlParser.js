/**
 * Parse baseUrl to be compatible with API syntax
 * @param {string} baseUrl baseUrl
 * @returns {string} parsed URL
 */
export default function urlParser(baseUrl) {
    let newUrl = baseUrl;

    // Find the position of the '?' character, which starts the query string
    const paramPos = baseUrl.indexOf('?');

    if (paramPos !== -1) {
        // If a query string exists, remove it from the URL
        newUrl = baseUrl.substring(0, paramPos);
    }

    // Find the position of the '#' character, which starts the fragment identifier
    const hashPos = newUrl.indexOf('#');

    if (hashPos !== -1) {
        // If a fragment identifier exists, remove it from the URL
        newUrl = newUrl.substring(0, hashPos);
    }

    const customAppPos = newUrl.indexOf('app/config/');
    if (customAppPos !== -1) {
        // If the URL contains a custom Application Identifier, remove it from the URL
        newUrl = newUrl.substring(0, customAppPos);
    }

    if (!newUrl.endsWith('/')) {
        // If the URL does not end with a '/', add one
        newUrl = newUrl + '/';
    }

    return newUrl;
}

const PAGE_REGEX =
    /\/app(?<customAppIdPath>\/config\/[A-F0-9]{32})?(((?<projectIdPath>\/[A-F0-9]{32})(?<docIdPath>\/[A-F0-9]{32}))(?<pageKeyPath>\/[\w-]{2,})?)?/;

const FEATURE_REGEXES = {
    commentsPath: /(?<commentsPath>\/(?:topic|channel)\/[a-f0-9]{24}(?:\/comment\/[a-f0-9]{24})?)/,
    bookmarksPath: /(?<bookmarksPath>\/bookmarks)/,
    bookmarkIdPath: /(?<bookmarkIdPath>\/bookmark\/[A-F0-9]{32})/,
    contentGroupPath: /(?<contentGroupPath>\/contentGroup\/[A-F0-9]{32})/,
    notificationPath: /(?<notificationPath>\/notification)/,
    insightsPath: /(?<insightsPath>\/insights(?:\/insights(?:\/[a-f0-9]{32})?)?)/,
    sharePath: /(?<sharePath>\/share)/,
};

/**
 * @function
 * @name getPathnameDetails
 * @description Extracts details from the given pathname using a regular expression.
 * @param {string} curPathname - The pathname to parse.
 * @returns {Object} - An object containing the customAppIdPath, docIdPath, projectIdPath, pageKeyPath, commentsPath, bookmarksPath, bookmarkIdPath, contentGroupPath, insightsPath, notificationPath, sharePath and a boolean indicating if it's in consumption mode.
 */
function getPathnameDetails(curPathname = '') {
    let curPathnameClone = curPathname;
    let featureRegexMatch = {};
    for (let [name, regex] of Object.entries(FEATURE_REGEXES)) {
        let match = curPathnameClone.match(regex);
        if (match && match.groups) {
            featureRegexMatch[name] = match.groups[name];
            // Remove path from cloned string to avoid matching it again in other regex checks
            curPathnameClone = curPathnameClone.replace(match.groups[name], '');
        }
    }

    const pageRegexMatch = curPathnameClone.match(PAGE_REGEX);
    const { docIdPath, projectIdPath } = pageRegexMatch?.groups || {};
    const isConsumptionMode = !!projectIdPath && !!docIdPath;
    return { isConsumptionMode, ...pageRegexMatch?.groups, ...featureRegexMatch };
}

/**
 * Constructs the base URL for a Library App including the case of a custom App.
 *
 * @param {string} baseUrl - The base URL to be parsed.
 * @returns {string} The constructed base URL for the library (custom) app.
 *
 * @example
 * // returns "http://example.com/app/config/B7CA92F04B9FAE8D941C3E9B7E0CD753/"
 * getLibraryAppBaseUrl("http://example.com/app/config/B7CA92F04B9FAE8D941C3E9B7E0CD753/B7CA92F04B9FAE8D941C3E9B7E0CD754/12CD42685E428DF25F001498F35DD1E9/K53--K46")
 */
export function getLibraryAppBaseUrl(baseUrl) {
    const { customAppIdPath } = getPathnameDetails(baseUrl);
    const baseURL = urlParser(baseUrl);
    return `${baseURL}app${customAppIdPath ? customAppIdPath + '/' : ''}`;
}

export function parseiServerRestHost(baseUrl) {
    const url = new URL(baseUrl);
    const host = url.hostname;
    if (host.includes('mci-w0oq5-dev')) {
        return `http://10.23.39.85:34962`;
    }
    if (host.includes('mci-')) {
        return `http://10.23.35.208:34962`;
    }
    if (host.includes('tec-')) {
        return `http://${host}:34962`;
    }
}