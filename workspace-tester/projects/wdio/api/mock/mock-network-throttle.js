/**
 * Mock request speed utilities for WebdriverIO tests
 * Provides functions to simulate slower network conditions by adding delays to API responses
 */

export const ThrottleMode = {
    Offline: 'offline',
    GPRS: 'GPRS',
    Regular2G: 'Regular2G',
    Good2G: 'Good2G',
    Regular3G: 'Regular3G',
    Good3G: 'Good3G',
    Regular4G: 'Regular4G',
    DSL: 'DSL',
    WiFi: 'WiFi',
    Online: 'online',
};
/**
 * Mock a specific URL pattern with a configurable delay
 * @param {string|RegExp} urlPattern - URL pattern to match (supports glob patterns)
 * @param {Object} options - Configuration options
 * @param {number} options.delay - Delay in milliseconds (default: 2000)
 * @param {string} options.method - HTTP method to intercept (default: any)
 * @param {boolean} options.respondOnce - Whether to respond only once (default: false)
 * @param {Object} options.customResponse - Custom response body (optional)
 * @param {number} options.statusCode - Custom status code (default: 200)
 * @returns {Promise<Mock>} - The created mock object
 */
export async function mockRequestSpeed({
    urlPattern,
    delay = 2000,
    method,
    respondOnce = false,
    customResponse,
    statusCode = 200,
}) {
    const mockOptions = method ? { method } : {};
    const mock = await browser.mock(urlPattern, mockOptions);

    const responseHandler = async (request) => {
        console.log(`Mocking request speed for ${urlPattern} with ${delay}ms delay`);

        return new Promise((resolve) => {
            setTimeout(() => {
                const response = customResponse || {
                    statusCode: request.statusCode,
                    body: request.body,
                };

                if (statusCode !== 200) {
                    response.statusCode = statusCode;
                }

                resolve(response);
            }, delay);
        });
    };

    if (respondOnce) {
        mock.respondOnce(responseHandler);
    } else {
        mock.respond(responseHandler);
    }

    return mock;
}

/**
 * Mock multiple URL patterns with the same delay
 * @param {Array<string|RegExp>} urlPatterns - Array of URL patterns to match
 * @param {Object} options - Configuration options
 * @param {number} options.delay - Delay in milliseconds (default: 2000)
 * @param {string} options.method - HTTP method to intercept (default: any)
 * @param {boolean} options.respondOnce - Whether to respond only once (default: false)
 * @returns {Promise<Array<Mock>>} - Array of created mock objects
 */
export async function mockMultipleRequestSpeeds({ urlPatterns, delay = 2000, method, respondOnce = false }) {
    const mocks = [];

    for (const pattern of urlPatterns) {
        const mock = await mockRequestSpeed({
            urlPattern: pattern,
            delay,
            method,
            respondOnce,
        });
        mocks.push(mock);
    }

    return mocks;
}

/**
 * Mock API endpoints with different delays based on endpoint type
 * @param {Object} options - Configuration options
 * @param {number} options.slowDelay - Delay for slow endpoints (default: 5000)
 * @param {number} options.mediumDelay - Delay for medium endpoints (default: 3000)
 * @param {number} options.fastDelay - Delay for fast endpoints (default: 1000)
 * @returns {Promise<Array<Mock>>} - Array of created mock objects
 */
export async function mockApiSpeedTiers({ slowDelay = 5000, mediumDelay = 3000, fastDelay = 1000 }) {
    const mocks = [];

    // Slow endpoints (heavy operations)
    const slowEndpoints = ['**/api/reports/**', '**/api/analytics/**', '**/api/export/**', '**/api/bulk/**'];

    // Medium endpoints (moderate operations)
    const mediumEndpoints = ['**/api/data/**', '**/api/search/**', '**/api/filter/**'];

    // Fast endpoints (light operations)
    const fastEndpoints = ['**/api/config/**', '**/api/status/**', '**/api/health/**'];

    // Create mocks for each tier
    const slowMocks = await mockMultipleRequestSpeeds({
        urlPatterns: slowEndpoints,
        delay: slowDelay,
    });

    const mediumMocks = await mockMultipleRequestSpeeds({
        urlPatterns: mediumEndpoints,
        delay: mediumDelay,
    });

    const fastMocks = await mockMultipleRequestSpeeds({
        urlPatterns: fastEndpoints,
        delay: fastDelay,
    });

    mocks.push(...slowMocks, ...mediumMocks, ...fastMocks);

    console.log(
        `Created ${mocks.length} speed tier mocks: ${slowEndpoints.length} slow, ${mediumEndpoints.length} medium, ${fastEndpoints.length} fast`
    );

    return mocks;
}

/**
 * Mock network throttling using WebdriverIO's built-in throttle command
 * @param {string|Object} throttleConfig - Throttle configuration
 * @param {string} throttleConfig.preset - Preset network condition (offline, GPRS, Regular2G, Good2G, Regular3G, Good3G, Regular4G, DSL, WiFi, online)
 * @param {Object} throttleConfig.custom - Custom throttle settings
 * @param {boolean} throttleConfig.custom.offline - Whether to simulate offline mode
 * @param {number} throttleConfig.custom.downloadThroughput - Download throughput in bytes per second
 * @param {number} throttleConfig.custom.uploadThroughput - Upload throughput in bytes per second
 * @param {number} throttleConfig.custom.latency - Network latency in milliseconds
 */
export async function mockNetworkThrottling(throttleConfig) {
    if (typeof throttleConfig === 'string') {
        // Use preset
        await browser.throttle(throttleConfig);
        console.log(`Applied network throttling preset: ${throttleConfig}`);
    } else if (throttleConfig.custom) {
        // Use custom configuration
        await browser.throttle(throttleConfig.custom);
        console.log('Applied custom network throttling configuration:', throttleConfig.custom);
    } else {
        throw new Error('Invalid throttle configuration. Use string preset or custom object.');
    }
}

/** * Execute a function with simulated slow network conditions
 * @param {Function} fn - Async function to execute
 * @param {string} throttleMode - Network throttling mode (default: 'Regular3G')
 */
export async function executeOnSlowNetwork(fn, throttleMode = ThrottleMode.Regular3G) {
    await mockNetworkThrottling(throttleMode); // Simulate slow network
    await fn().catch((error) => {
        console.error('⚠️ Error during slow network execution:', error);
    });
    await mockNetworkThrottling(ThrottleMode.Online); // Reset to normal speed
}

/**
 * Mock specific request with progressive delay (increases delay with each request)
 * @param {string|RegExp} urlPattern - URL pattern to match
 * @param {Object} options - Configuration options
 * @param {number} options.initialDelay - Initial delay in milliseconds (default: 1000)
 * @param {number} options.delayIncrement - Delay increment per request (default: 500)
 * @param {number} options.maxDelay - Maximum delay in milliseconds (default: 10000)
 * @param {string} options.method - HTTP method to intercept (default: any)
 * @returns {Promise<Mock>} - The created mock object
 */
export async function mockProgressiveRequestSpeed({
    urlPattern,
    initialDelay = 1000,
    delayIncrement = 500,
    maxDelay = 10000,
    method,
}) {
    const mockOptions = method ? { method } : {};
    const mock = await browser.mock(urlPattern, mockOptions);
    let requestCount = 0;

    mock.respond(async (request) => {
        const currentDelay = Math.min(initialDelay + requestCount * delayIncrement, maxDelay);

        console.log(`Progressive delay for ${urlPattern}: request #${requestCount + 1}, delay: ${currentDelay}ms`);

        requestCount++;

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    statusCode: request.statusCode,
                    body: request.body,
                });
            }, currentDelay);
        });
    });

    return mock;
}

/**
 * Mock request speed with random delay within a range
 * @param {string|RegExp} urlPattern - URL pattern to match
 * @param {Object} options - Configuration options
 * @param {number} options.minDelay - Minimum delay in milliseconds (default: 1000)
 * @param {number} options.maxDelay - Maximum delay in milliseconds (default: 5000)
 * @param {string} options.method - HTTP method to intercept (default: any)
 * @returns {Promise<Mock>} - The created mock object
 */
export async function mockRandomRequestSpeed({ urlPattern, minDelay = 1000, maxDelay = 5000, method }) {
    const mockOptions = method ? { method } : {};
    const mock = await browser.mock(urlPattern, mockOptions);

    mock.respond(async (request) => {
        const randomDelay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;

        console.log(`Random delay for ${urlPattern}: ${randomDelay}ms`);

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    statusCode: request.statusCode,
                    body: request.body,
                });
            }, randomDelay);
        });
    });

    return mock;
}

/**
 * Restore all mocks created by this module
 * @param {Array<Mock>} mocks - Array of mock objects to restore
 */
export async function restoreRequestSpeedMocks(mocks = []) {
    if (mocks.length > 0) {
        for (const mock of mocks) {
            await mock.restore();
        }
        console.log(`Restored ${mocks.length} request speed mocks`);
    } else {
        await browser.mockRestoreAll();
        console.log('Restored all mocks');
    }
}

/**
 * Get network performance diagnostics
 * @returns {Promise<Object>} - Network performance metrics
 */
export async function getNetworkDiagnostics() {
    try {
        const diagnostics = await browser.getDiagnostics();
        console.log('Network diagnostics:', diagnostics);
        return diagnostics;
    } catch (error) {
        console.warn('Could not get network diagnostics:', error.message);
        return null;
    }
}

/**
 * Enable performance audits with network throttling
 * @param {Object} options - Performance audit options
 * @param {string} options.networkThrottling - Network throttling preset (default: 'Regular 3G')
 * @param {number} options.cpuThrottling - CPU throttling factor (default: 4)
 * @param {boolean} options.cacheEnabled - Whether to enable cache (default: false)
 * @param {string} options.formFactor - Form factor ('mobile' or 'desktop', default: 'desktop')
 */
export async function enablePerformanceAudits({
    networkThrottling = 'Regular 3G',
    cpuThrottling = 4,
    cacheEnabled = false,
    formFactor = 'desktop',
} = {}) {
    try {
        await browser.enablePerformanceAudits({
            networkThrottling,
            cpuThrottling,
            cacheEnabled,
            formFactor,
        });
        console.log(`Enabled performance audits with ${networkThrottling} network throttling`);
    } catch (error) {
        console.warn('Could not enable performance audits:', error.message);
    }
}
