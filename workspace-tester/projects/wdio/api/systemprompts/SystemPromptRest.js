import http from 'http';
import https from 'https';
import { errorLog, successLog } from '../../config/consoleFormat.js';

// Global variables to store session information
let sessionCookies = '';
let authToken = '';

/**
 * Helper function to make HTTP requests using Node.js http/https module
 */
async function makeRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const isHttps = urlObj.protocol === 'https:';

        const reqOptions = {
            hostname: urlObj.hostname,
            port: urlObj.port || (isHttps ? 443 : 80),
            path: urlObj.pathname + urlObj.search,
            method: options.method || 'GET',
            headers: options.headers || {},
        };

        // Add SSL options only for HTTPS
        if (isHttps) {
            reqOptions.rejectUnauthorized = false; // Ignore self-signed certificate errors
        }

        // Add session cookies to all requests
        if (sessionCookies) {
            reqOptions.headers['Cookie'] = sessionCookies;
        }

        const requestModule = isHttps ? https : http;
        const req = requestModule.request(reqOptions, (res) => {
            let data = '';

            // Update cookies from every response that provides them
            if (res.headers['set-cookie']) {
                const newCookies = res.headers['set-cookie'].map((cookie) => cookie.split(';')[0]);

                // Parse existing cookies into a map
                const cookieMap = new Map();
                if (sessionCookies) {
                    sessionCookies.split('; ').forEach((cookie) => {
                        const [name, value] = cookie.split('=');
                        if (name && value) {
                            cookieMap.set(name, value);
                        }
                    });
                }

                // Update with new cookies
                newCookies.forEach((cookie) => {
                    const [name, value] = cookie.split('=');
                    if (name && value) {
                        cookieMap.set(name, value);
                    }
                });

                // Rebuild cookie string
                sessionCookies = Array.from(cookieMap.entries())
                    .map(([name, value]) => `${name}=${value}`)
                    .join('; ');

                console.log('🍪 Session cookies updated for subsequent requests');
                // console.log('🍪 Current cookies:', sessionCookies);
            }

            // Capture auth token from response headers
            if (res.headers['x-mstr-authtoken']) {
                authToken = res.headers['x-mstr-authtoken'];
                console.log('🔑 Auth token updated for subsequent requests');
            }

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                const response = {
                    ok: res.statusCode >= 200 && res.statusCode < 300,
                    status: res.statusCode,
                    statusText: res.statusMessage,
                    headers: {
                        get: (name) => res.headers[name.toLowerCase()],
                    },
                    json: () => Promise.resolve(JSON.parse(data)),
                    text: () => Promise.resolve(data),
                };
                resolve(response);
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        if (options.body) {
            req.write(options.body);
        }

        req.end();
    });
}

/**
 * Clear the session cookies and auth token
 */
export function clearSession() {
    sessionCookies = '';
    authToken = '';
    console.log('🧹 Session cleared');
}

export async function loginLibrary(baseUrl, username, password) {
    const authUrl = `${baseUrl}api/auth/login`;
    const credentials = {
        username: username,
        password: password,
        loginMode: 1,
        maxSearch: 3,
        workingSet: 10,
        changePassword: false,
        metadataLocale: 'en_us',
        warehouseDataLocale: 'en_us',
        displayLocale: 'en_us',
        messagesLocale: 'en_us',
        numberLocale: 'en_us',
        timeZone: 'UTC',
    };

    const response = await makeRequest(authUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify(credentials),
    });
    console.log('Response status:', response.status);
    console.log('Response body:', await response.text());
    if (!response.ok) {
        throw new Error(`Authentication failed: ${response.statusText}`);
    }

    // Capture auth token from response headers
    const token = response.headers.get('X-MSTR-AuthToken');
    if (token) {
        authToken = token;
        console.log('🔑 Auth token captured for subsequent requests');
    }

    return true;
}

export async function logoutLibrary(baseUrl) {
    const authUrl = `${baseUrl}api/auth/logout`;
    const response = await makeRequest(authUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-AuthToken': authToken,
        },
    });

    if (!response.ok) {
        throw new Error(`Logout failed: ${response.statusText}`);
    }

    // Clear session data
    clearSession();

    return true;
}

/**
 * Enable server settings for system prompts
 * @param {string} baseUrl - Base URL
 * @returns {Promise} - Promise that resolves with the response
 */
export async function enableServerSettings(baseUrl, type) {
    const id = type === 'standard' ? '193' : '192';
    const url = baseUrl + 'api/iserver/settings';
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-AuthToken': authToken,
        },
        body: JSON.stringify({
            settings: [
                {
                    id,
                    dataType: 3,
                    value: '-1',
                },
            ],
        }),
    };

    const response = await makeRequest(url, options);

    if (response.ok) {
        successLog(`Enable server settings (id=${id}) success`);
        const body = await response.text();
        return {
            statusCode: response.status,
            body: body ? JSON.parse(body) : {},
        };
    } else {
        const body = await response.text();
        errorLog(`Enable server settings(id=${id}) failed. Status code: ${response.status}. Message: ${body}`);
        throw new Error({
            statusCode: response.status,
            message: body,
        });
    }
}

/**
 * Disable server settings for system prompts
 * @param {string} baseUrl - Base URL
 * @returns {Promise} - Promise that resolves with the response
 */
export async function disableServerSettings(baseUrl, type) {
    const id = type === 'standard' ? '193' : '192';
    const url = baseUrl + 'api/iserver/settings';
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-AuthToken': authToken,
        },
        body: JSON.stringify({
            settings: [
                {
                    id,
                    dataType: 3,
                    value: '0',
                },
            ],
        }),
    };

    try {
        const response = await makeRequest(url, options);

        if (response.ok) {
            successLog('Disable server settings(id=${id}) success');
            const body = await response.text();
            return {
                statusCode: response.status,
                body: body ? JSON.parse(body) : {},
            };
        } else {
            const body = await response.text();
            errorLog(`Sending request to URL: ${url}`);
            errorLog(`Disable server settings(id=${id}) failed. Status code: ${response.status}. Message: ${body}`);
            throw new Error({
                statusCode: response.status,
                message: body,
            });
        }
    } catch (error) {
        errorLog(`Disable server settings(id=${id}) failed. Error: ${error}`);
        throw error;
    }
}

/**
 * Configure user system prompts
 * @param {string} baseUrl - Base URL
 * @param {string} userId - User ID
 * @param {Array} systemPrompts - Array of system prompts to set
 * @returns {Promise} - Promise that resolves with the response
 */
export async function configureUserSystemPrompts(baseUrl, userId, systemPrompts = []) {
    const url = baseUrl + `api/users/${userId}/systemprompts`;
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-AuthToken': authToken,
        },
        body: JSON.stringify({
            systemPrompts: systemPrompts
        }),
    };

    try {
        const response = await makeRequest(url, options);

        if (response.ok) {
            successLog(`Configure user system prompts success for user ${userId}`);
            const body = await response.text();
            return {
                statusCode: response.status,
                body: body ? JSON.parse(body) : {},
            };
        } else {
            const body = await response.text();
            errorLog(
                `Configure user system prompts failed. userId: ${userId}, Status code: ${response.status}, Message: ${body}`
            );
            throw new Error({
                statusCode: response.status,
                message: body,
            });
        }
    } catch (error) {
        errorLog(`Configure user system prompts failed. Error: ${error}`);
        throw error;
    }
}

/**
 * Clear user system prompts
 * @param {string} baseUrl - Base URL
 * @param {string} userId - User ID
 * @returns {Promise} - Promise that resolves with the response
 */
export function clearUserSystemPrompts(baseUrl, userId) {
    return configureUserSystemPrompts(baseUrl, userId, []);
}

/**
 * Get user system prompts
 * @param {string} baseUrl - Base URL
 * @param {string} userId - User ID
 * @returns {Promise} - Promise that resolves with the response
 */
export async function getUserSystemPrompts(baseUrl, userId) {
    const url = baseUrl + `api/users/${userId}/systemprompts`;
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-AuthToken': authToken,
        },
    };

    try {
        const response = await makeRequest(url, options);

        if (response.ok) {
            successLog(`Get user system prompts success for user ${userId}`);
            const body = await response.text();
            return {
                statusCode: response.status,
                body: body ? JSON.parse(body) : {},
            };
        } else {
            const body = await response.text();
            errorLog(`Get user system prompts failed. Status code: ${response.status}. Message: ${body}`);
            throw new Error({
                statusCode: response.status,
                message: body,
            });
        }
    } catch (error) {
        errorLog(`Get user system prompts failed. Error: ${error}`);
        throw error;
    }
}

/**
 * Execute report with system prompt filter
 * @param {string} baseUrl - Base URL
 * @param {Object} session - Session object containing token and cookie
 * @param {Object} report - report object containing id and project.id
 * @returns {Promise} - Promise that resolves with the response
 */
export async function executeReport(baseUrl, session, report) {
    const url = baseUrl + `api/reports/${report.id}/instances`;
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-AuthToken': session.token,
            'X-MSTR-ProjectID': report.project.id,
            Cookie: session.cookie,
        },
    };
    try {
        const response = await makeRequest(url, options);
        if (response.status === 200) {
            const body = await response.text();
            successLog(`Execute report response - Status: ${response.status}, body: ${body}`);
            return {
                statusCode: response.status,
                body: body ? JSON.parse(body) : {},
            };
        } else {
            const body = await response.text();
            errorLog(`Execute report failed. Status code: ${response.status}. Message: ${body}`);
            return {
                statusCode: response.status,
                message: body,
            };
        }
    } catch (error) {
        errorLog(`Execute report failed. Error: ${error}`);
        throw error;
    }
}
