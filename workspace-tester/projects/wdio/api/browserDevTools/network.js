// Call Chrome DevTools commands within automation tests to capture network events in the chrome browser
// Available functions: https://chromedevtools.github.io/devtools-protocol/tot/Network/

export async function verifyRequestAfterAction(action, targetReq, targetRes, object) {
    let capturedReq = []; // Use array as it may send more than 1 requests
    let capturedRes; // Expect 1 response at most
    const regex = new RegExp(targetReq.path);

    await browser.cdp('Network', 'enable');
    // Start listening and matching requests
    browser.on('Network.requestWillBeSent', (event) => {
        // If needed, enable the following lines for debugging purpose
        // console.log(`Request: ${event.request.method}`);
        // console.log(event.request.url.substr(0, 300));

        if (
            event.request.method.includes(targetReq.method) &&
            event.request.url.includes(object.id) &&
            regex.test(event.request.url)
        ) {
            capturedReq.push(event);
        }
    });

    // Start listening and matching responses
    browser.on('Network.responseReceived', (event) => {
        if (regex.test(event.response.url) && event.response.url.includes(object.id)) {
            capturedRes = event;
        }
    });

    await action; // User action on library items
    await browser.pause(2000); // Time buffer for requests to be triggered

    // Verify that at least 1 request that matches our conditions has been captured and make sure no excessive requests are sent
    await since(`Number of requests captured should be 1 to 5, instead we have ${capturedReq.length}`)
        .expect(capturedReq.length >= 1 && capturedReq.length <= 5)
        .toBeTruthy();

    if (capturedRes) {
        // When response is captured, check the response code
        console.log(`Response: ${capturedRes.response.status} ${capturedRes.response.url}`);
        const actualCode = capturedRes.response.status;
        await since('Response should be #{expected}, instead it is #{actual}.').expect(actualCode).toBe(targetRes.code);
    } else {
        // Due to the limitaion of chrome devtools, response could not be captured in some cases like closing tabs, browser etc.
        console.log(`Response for deleting instances of ${object.name} ${object.id} is not captured after the action`);
    }
}

// assertDoesNotExist - param option to check only that the requests aren't sent.
export async function verifyRequestsAfterAction(action, targetReqs, object, { assertDoesNotExist = false }) {
    const reqMap = {}; // use provieded `id` as key to track reqs/resps
    for (const req of targetReqs) {
        reqMap[req.id] = {
            regex: new RegExp(req.path),
            capturedReqs: [],
            capturedRes: null,
        };
    }

    await browser.cdp('Network', 'enable');

    // Start listening and matching requests
    browser.on('Network.requestWillBeSent', (event) => {
        // If needed, enable the following lines for debugging purpose
        // console.log(`Request: ${event.request.method}`);
        // console.log(event.request.url.substr(0, 300));

        for (let i = 0; i < targetReqs.length; i++) {
            const targetReq = targetReqs[i];
            const regex = reqMap[targetReq.id].regex;

            if (
                event.request.method.includes(targetReq.method) &&
                event.request.url.includes(object.id) &&
                regex.test(event.request.url)
            ) {
                reqMap[targetReq.id].capturedReqs.push(event);
                break;
            }
        }
    });

    // Start listening and matching responses
    browser.on('Network.responseReceived', (event) => {
        for (let i = 0; i < targetReqs.length; i++) {
            const targetReq = targetReqs[i];
            const regex = reqMap[targetReq.id].regex;

            if (regex.test(event.response.url) && event.response.url.includes(object.id)) {
                reqMap[targetReq.id].capturedRes = event;
                break;
            }
        }
    });

    await action; // User action on library items
    await browser.pause(2000); // Time buffer for requests to be triggered

    if (assertDoesNotExist) {
        for (const targetReq of targetReqs) {
            const capturedReq = reqMap[targetReq.id].capturedReqs;
            await since(`Request should not be captured after the action`).expect(capturedReq.length).toBe(0);

            // check that requests have no response
            const capturedRes = reqMap[targetReq.id].capturedRes;
            await since(`Response should not be captured after the action`).expect(capturedRes).toBeNull();
        }
        return;
    }

    for (const targetReq of targetReqs) {
        // Verify that at least 1 request that matches our conditions has been captured and make sure no excessive requests are sent
        const capturedReq = reqMap[targetReq.id].capturedReqs;
        await since(`Number of requests captured should be 1 to 5, instead we have ${capturedReq.length}`)
            .expect(capturedReq.length >= 1 && capturedReq.length <= 5)
            .toBeTruthy();

        const capturedRes = reqMap[targetReq.id].capturedRes;
        if (capturedRes) {
            // When response is captured, check the response code
            console.log(`Response: ${capturedRes.response.status} ${capturedRes.response.url}`);
            const actualCode = capturedRes.response.status;
            await since('Response should be #{expected}, instead it is #{actual}.')
                .expect(actualCode)
                .toBe(targetReq.responseCode);
        } else {
            // Due to the limitaion of chrome devtools, response could not be captured in some cases like closing tabs, browser etc.
            console.log(
                `Response for deleting instances of ${object.name} ${object.id} is not captured after the action`
            );
        }
    }
}

/**
 * Captures the payload of a request that matches the URL pattern
 * @param {string|RegExp} urlPattern - URL string or regex pattern to match
 * @param {Object} options - Additional options
 * @param {number} options.timeout - Timeout in milliseconds (default: 5000)
 * @param {string} options.method - HTTP method to intercept (default: any)
 * @param {boolean} options.exactMatch - Whether to match exact URL (default: false)
 * @returns {Promise<Object>} - The captured request payload
 */
export async function captureRequestPayload(urlPattern, options = {}) {
    const timeout = options.timeout || 5000;
    let capturedPayload = null;

    // Function to check if a URL matches our pattern
    const matchesUrl = (requestUrl) => {
        if (urlPattern instanceof RegExp) {
            return urlPattern.test(requestUrl);
        }

        if (options.exactMatch) {
            return requestUrl === urlPattern;
        }

        return requestUrl.includes(urlPattern);
    };

    await browser.cdp('Network', 'enable');

    // Start listening and matching requests
    browser.on('Network.requestWillBeSent', (event) => {
        if (
            matchesUrl(event.request.url) &&
            (!options.method || event.request.method.toLowerCase() === options.method.toLowerCase())
        ) {
            try {
                capturedPayload = JSON.parse(event.request.postData);
            } catch (e) {
                capturedPayload = event.request.postData; // If not JSON
            }
        }
    });

    await browser.waitUntil(() => capturedPayload !== null, {
        timeout,
        timeoutMsg: `Request matching "${urlPattern}" was not intercepted within ${timeout}ms`,
        interval: 100,
    });

    return capturedPayload;
}

/**
 * 
 * @param {Mock} mockRequest browser.mock
 * @param {number} index the index of the request to wait for
 * @param {number} timeout the timeout in milliseconds
 */
export async function waitForResponse(mockRequest, index, timeout = 60_000) {
    let response = null;
    await browser.waitUntil(
        () => {
            response = mockRequest.calls?.[index]?.body;
            return !!response;
        },
        {
            timeout,
            timeoutMsg: `Response was not intercepted within ${timeout}ms`,
            interval: 100,
        }
    );
    await browser.pause(200); // Wait for the response to be processed
    return response;
}
