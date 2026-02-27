import pako from 'pako';
/**
 * Inflate the buffer containing the compressed data.
 * @param {Buffer} buffer the buffer to inflate
 * @returns the inflated buffer
 */
async function inflateBuffer(buffer) {
    if (typeof DecompressionStream !== 'undefined') {
        // https://developer.mozilla.org/en-US/docs/Web/API/DecompressionStream/DecompressionStream
        const ds = new DecompressionStream('deflate');

        const writer = ds.writable.getWriter();
        writer.write(buffer);
        writer.close();

        const reader = ds.readable.getReader();
        const output = [];
        let totalSize = 0;
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            output.push(value);
            totalSize += value.byteLength;
        }

        const concatenated = new Uint8Array(totalSize);
        let offset = 0;
        for (const array of output) {
            concatenated.set(array, offset);
            offset += array.byteLength;
        }

        return concatenated;
    } else {
        // Use pako as a fallback in non-browser environments such as Node.js
        return pako.inflate(buffer);
    }
}

/**
 * Pendo sends events to their servers in a compressed format stored in a property `jzb` (jzb = JSON, Zlib, Base64).
 * This function decodes the Pendo raw event jzb string to a JavaScript object.
 * @param {string} jzb the jzb from the Pendo raw events response
 * @returns {Promise<any>} the decoded JavaScript object
 */
async function decodeJzb(jzb) {
    // first, ensure the base64 string is padded correctly (length must be a multiple of 4)
    while (jzb.length % 4 != 0) {
        jzb += '=';
    }

    const buffer = Buffer.from(jzb, 'base64');
    const inflated = await inflateBuffer(buffer);
    const decoder = new TextDecoder('utf-8');
    return JSON.parse(decoder.decode(inflated));
}

// Flush the pendo events
export async function flushPendoEvents() {
    await browser.execute('pendo.flushNow()');
    await browser.pause(1 * 1000);
}

// Filter the pendo requests from all requests and return an array of pendo requests
export async function filterPendoRequests(requests) {
    await flushPendoEvents();
    const pendoRequests = requests.filter((req) => {
        if (req.url.includes('/data/ptm.gif')) {
            return true;
        }
    });
    return pendoRequests;
}

/**
 * Filters and decodes Pendo events of a specific type from a collection of Pendo requests.
 *
 * This function iterates over an array of Pendo requests, decodes the events contained within each request,
 * and then filters these events by the specified event type. The decoding process is handled by the `decodeJzb`
 * function, which is assumed to be an asynchronous function that decodes a given event. The function then
 * filters the decoded events to return only those that match the specified event type.
 *
 * @param {Array} pendoRequests - An array of objects representing Pendo requests. Each object is expected to have a `postData` property, which is a JSON string containing the events.
 * @param {string} eventType - The type of Pendo events to filter for. If not specified, all events are returned.
 * @returns {Promise<Array>} A promise that resolves to an array of events of the specified type. Each event is an object decoded from the original Pendo request data. If `eventType` is not specified, returns all decoded events.
 */
export async function getPendoEventsByType(pendoRequests, eventType = '') {
    // Decode the pendo events
    let decodedEvents = [];
    for (const request of pendoRequests) {
        if (request.postData) {
            const postDataObject = JSON.parse(request.postData);
            const eventsValue = postDataObject.events;
            decodedEvents.push(await decodeJzb(eventsValue));
        }
    }

    let clickEvents = [];
    for (const eventArr of decodedEvents) {
        for (const event of eventArr) {
            if (!eventType || event.type === eventType) {
                clickEvents.push(event);
            }
        }
    }
    // For debugging purposes
    // console.log('Click events: ' + JSON.stringify(clickEvents));
    return clickEvents;
}

// Decoded the events from the pendo requests and return the meta events array
export async function getMetaEvents(pendoRequests) {
    return getPendoEventsByType(pendoRequests, 'meta');
}

// Decoded the events from the pendo requests and return the click events array
export async function getClickEvents(pendoRequests) {
    return getPendoEventsByType(pendoRequests, 'click');
}

// Decoded the events from the pendo requests and return the load events array
export async function getLoadEvents(pendoRequests) {
    return getPendoEventsByType(pendoRequests, 'load');
}

/**
 * Check if a single click event contains the correct feature id
 * @param {targetElement} targetElement: clickEvent.props.target
 * @param {featureId} the feature id to check
 * @returns the boolean value
 */
const PENDO_FEATURE_ID_KEY = 'data-feature-id';
function hasElement(targetElement, featureId, depthLimit = 5) {
    const caputured = targetElement.attrs[PENDO_FEATURE_ID_KEY] === featureId;

    if (!caputured && targetElement.parentElem && !!depthLimit) {
        return hasElement(targetElement.parentElem, featureId, depthLimit - 1);
    }
    return caputured;
}

// Check if the feature id is captured in a click events array
export function isElementCaptured(clickEvents, featureId) {
    return clickEvents.some((clickEvent) => hasElement(clickEvent.props.target, featureId));
}

/**
 * Calculates the count of feature captures for a given feature ID.
 *
 * @param {Array} clickEvents - The array of click events.
 * @param {string} featureId - The ID of the feature to count captures for.
 * @returns {number} - The count of feature captures.
 */
export function featureCaptureCount(clickEvents, featureId) {
    let count = 0;
    for (const clickEvent of clickEvents) {
        if (hasElement(clickEvent.props.target, featureId)) {
            count++;
        }
    }
    return count;
}

export async function verifyRequestContent(mockOutput, featureId) {
    // Get pendo requests and make sure no excessive requests are sent to Pendo (Set it to max = 10 as a temporary limit)
    const pendoRequests = await filterPendoRequests(mockOutput.calls);
    Object.keys(pendoRequests).forEach((key) => {
        console.log(pendoRequests[key].url);
    });
    await since('Number of pendo requests less than #{expected}, instead we have #{actual}')
        .expect(pendoRequests.length < 11)
        .toBe(true);

    // Get pendo click events and check if there is only one click event for the feature
    const clickEvents = await getClickEvents(pendoRequests);
    const captureCount = featureCaptureCount(clickEvents, featureId);
    await since('Number of click events on this feature id is #{expected}, instead we have #{actual}')
        .expect(captureCount)
        .toBe(1);

    // Check if the target element was captured in click events
    await since('Detect that the proper element was captured is #{expected}, instead we have #{actual}')
        .expect(isElementCaptured(clickEvents, featureId))
        .toBe(true);
}

export async function verifyNoRequestsForIgnores(mockOutput, featureId) {
    // Get pendo requests and make sure no excessive requests are sent to Pendo (Set it to max = 10 as a temporary limit)
    const pendoRequests = await filterPendoRequests(mockOutput.calls);
    Object.keys(pendoRequests).forEach((key) => {
        console.log(pendoRequests[key].url);
    });
    await since('Number of pendo requests less than #{expected}, instead we have #{actual}')
        .expect(pendoRequests.length < 11)
        .toBe(true);

    // Get element with feature id
    const featureElement = await browser.$(`[${PENDO_FEATURE_ID_KEY}="${featureId}"]`);
    // Check if the feature element's parent contains the pendo-ignore class
    const parentElement = await featureElement.parentElement();
    const parentClasses = await parentElement.getAttribute('class');
    await since(
        "Detect that the feature element's parent contains the pendo-ignore class is #{expected}, instead we have #{actual}"
    )
        .expect(parentClasses.includes('pendo-ignore'))
        .toBe(true);

    // Get pendo click events and check if there is no click event for the feature
    const clickEvents = await getClickEvents(pendoRequests);
    const captureCount = featureCaptureCount(clickEvents, featureId);
    await since('Number of click events on this feature id is #{expected}, instead we have #{actual}')
        .expect(captureCount)
        .toBe(0);

    // Check if the target element wasn't captured in click events
    await since('Detect that the proper element was captured is #{expected}, instead we have #{actual}')
        .expect(isElementCaptured(clickEvents, featureId))
        .toBe(false);
}
