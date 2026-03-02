import request from 'request';
import authentication from '../authentication.js';
import urlParser from '../urlParser.js';
import { errorLog, successLog } from '../../config/consoleFormat.js';

// Common utility functions for JSON baseline comparison
export const JSONComparisonUtils = {
    // Recursive JSON comparison function
    compareJsonValues(actual, baseline, path = '') {
        const differences = [];

        // Skip comparison for dynamic meta timestamp fields and location fields
        if (
            path === 'meta.created' ||
            path === 'meta.lastModified' ||
            path === 'meta.location' ||
            path.endsWith('.location')
        ) {
            console.log(`⏭️  Skipping dynamic field: ${path}`);
            return differences;
        }

        // Handle null and undefined
        if (actual === null && baseline === null) return differences;
        if (actual === undefined && baseline === undefined) return differences;

        if (actual === null || baseline === null || actual === undefined || baseline === undefined) {
            differences.push({
                path: path,
                type: 'null_undefined',
                actual: actual,
                baseline: baseline,
                message: `Path "${path}": actual="${actual}" vs baseline="${baseline}"`,
            });
            return differences;
        }

        // Handle type mismatch
        if (typeof actual !== typeof baseline) {
            differences.push({
                path: path,
                type: 'type_mismatch',
                actual: typeof actual,
                baseline: typeof baseline,
                message: `Path "${path}": type mismatch - actual type="${typeof actual}" vs baseline type="${typeof baseline}"`,
            });
            return differences;
        }

        // Handle arrays with intelligent matching
        if (Array.isArray(baseline)) {
            if (actual.length !== baseline.length) {
                differences.push({
                    path: path,
                    type: 'array_length',
                    actual: actual.length,
                    baseline: baseline.length,
                    message: `Path "${path}": array length different - actual length=${actual.length} vs baseline length=${baseline.length}`,
                });
            }

            // Try intelligent array comparison first
            const arrayDiffs = this.compareArraysIntelligently(actual, baseline, path);
            differences.push(...arrayDiffs);
            return differences;
        }

        // Handle objects
        if (typeof baseline === 'object') {
            // Check all baseline object properties
            for (const key in baseline) {
                const propPath = path ? `${path}.${key}` : key;

                if (!(key in actual)) {
                    differences.push({
                        path: propPath,
                        type: 'missing_property',
                        actual: undefined,
                        baseline: baseline[key],
                        message: `Path "${propPath}": missing property in actual JSON, baseline value="${JSON.stringify(
                            baseline[key]
                        )}"`,
                    });
                } else {
                    const propDiffs = this.compareJsonValues(actual[key], baseline[key], propPath);
                    differences.push(...propDiffs);
                }
            }

            // Check for extra properties in actual object
            for (const key in actual) {
                if (!(key in baseline)) {
                    const propPath = path ? `${path}.${key}` : key;
                    differences.push({
                        path: propPath,
                        type: 'extra_property',
                        actual: actual[key],
                        baseline: undefined,
                        message: `Path "${propPath}": extra property in actual JSON, actual value="${JSON.stringify(
                            actual[key]
                        )}"`,
                    });
                }
            }
            return differences;
        }

        // Handle primitive values
        if (actual !== baseline) {
            differences.push({
                path: path,
                type: 'value_mismatch',
                actual: actual,
                baseline: baseline,
                message: `Path "${path}": value mismatch - actual="${actual}" vs baseline="${baseline}"`,
            });
        }

        return differences;
    },

    // Intelligent array comparison that handles different ordering
    compareArraysIntelligently(actual, baseline, path) {
        const differences = [];

        // If arrays are empty, they match
        if (actual.length === 0 && baseline.length === 0) {
            return differences;
        }

        // If both arrays contain objects, try to match by unique identifiers
        const actualObjects = actual.filter((item) => typeof item === 'object' && item !== null);
        const baselineObjects = baseline.filter((item) => typeof item === 'object' && item !== null);

        if (actualObjects.length === actual.length && baselineObjects.length === baseline.length) {
            return this.compareObjectArrays(actual, baseline, path);
        }

        // For primitive arrays, use set-based comparison
        return this.comparePrimitiveArrays(actual, baseline, path);
    },

    // Compare arrays of objects by finding matching objects
    compareObjectArrays(actual, baseline, path) {
        const differences = [];
        const usedBaselineIndices = new Set();
        const usedActualIndices = new Set();

        // Common identifier fields to try matching on
        const identifierFields = ['name', 'id', 'type', 'value', 'schemas', 'displayName', 'urn'];

        // Find best matching baseline object for each actual object
        for (let actualIndex = 0; actualIndex < actual.length; actualIndex++) {
            const actualObj = actual[actualIndex];
            let bestMatch = null;
            let bestMatchIndex = -1;
            let bestScore = -1;

            // Try to find the best match in baseline array
            for (let baselineIndex = 0; baselineIndex < baseline.length; baselineIndex++) {
                if (usedBaselineIndices.has(baselineIndex)) continue;

                const baselineObj = baseline[baselineIndex];
                const score = this.calculateObjectSimilarity(actualObj, baselineObj, identifierFields);

                if (score > bestScore) {
                    bestScore = score;
                    bestMatch = baselineObj;
                    bestMatchIndex = baselineIndex;
                }
            }

            if (bestMatch && bestScore > 0.5) {
                // Threshold for considering a match
                // Mark as used
                usedActualIndices.add(actualIndex);
                usedBaselineIndices.add(bestMatchIndex);

                // Compare the matched objects
                const objPath = path ? `${path}[${actualIndex}]` : `[${actualIndex}]`;
                const objDiffs = this.compareJsonValues(actualObj, bestMatch, objPath);
                differences.push(...objDiffs);
            }
        }

        // Report unmatched actual objects as extra
        for (let i = 0; i < actual.length; i++) {
            if (!usedActualIndices.has(i)) {
                const objPath = path ? `${path}[${i}]` : `[${i}]`;
                differences.push({
                    path: objPath,
                    type: 'extra_in_actual',
                    actual: actual[i],
                    baseline: undefined,
                    message: `Path "${objPath}": extra object in actual array, actual value="${JSON.stringify(
                        actual[i]
                    )}"`,
                });
            }
        }

        // Report unmatched baseline objects as missing
        for (let i = 0; i < baseline.length; i++) {
            if (!usedBaselineIndices.has(i)) {
                const objPath = path ? `${path}[?]` : `[?]`;
                differences.push({
                    path: objPath,
                    type: 'missing_in_actual',
                    actual: undefined,
                    baseline: baseline[i],
                    message: `Path "${objPath}": missing object in actual array, baseline value="${JSON.stringify(
                        baseline[i]
                    )}"`,
                });
            }
        }

        return differences;
    },

    // Calculate similarity score between two objects
    calculateObjectSimilarity(obj1, obj2, identifierFields) {
        let matchingFields = 0;
        let totalFields = 0;

        // Prioritize identifier fields
        for (const field of identifierFields) {
            if (field in obj1 || field in obj2) {
                totalFields += 2; // Weight identifier fields more heavily
                if (field in obj1 && field in obj2 && obj1[field] === obj2[field]) {
                    matchingFields += 2;
                }
            }
        }

        // Check all other fields
        const allKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);
        for (const key of allKeys) {
            if (!identifierFields.includes(key)) {
                totalFields++;
                if (key in obj1 && key in obj2) {
                    if (typeof obj1[key] === typeof obj2[key] && obj1[key] === obj2[key]) {
                        matchingFields++;
                    } else if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
                        // For nested objects, give partial credit
                        matchingFields += 0.5;
                    }
                }
            }
        }

        return totalFields > 0 ? matchingFields / totalFields : 0;
    },

    // Compare arrays of primitive values using set-based comparison
    comparePrimitiveArrays(actual, baseline, path) {
        const differences = [];
        
        const actualSet = new Set(actual.map((item) => JSON.stringify(item)));
        const baselineSet = new Set(baseline.map((item) => JSON.stringify(item)));

        // Find missing items
        for (const item of baseline) {
            const itemStr = JSON.stringify(item);
            if (!actualSet.has(itemStr)) {
                differences.push({
                    path: path,
                    type: 'missing_in_actual',
                    actual: undefined,
                    baseline: item,
                    message: `Path "${path}": missing array element, baseline value="${JSON.stringify(item)}"`,
                });
            }
        }

        // Find extra items
        for (const item of actual) {
            const itemStr = JSON.stringify(item);
            if (!baselineSet.has(itemStr)) {
                differences.push({
                    path: path,
                    type: 'extra_in_actual',
                    actual: item,
                    baseline: undefined,
                    message: `Path "${path}": extra array element, actual value="${JSON.stringify(item)}"`,
                });
            }
        }

        return differences;
    },

    // Generate comparison report
    generateComparisonReport(differences, testName, endpoint) {
        console.log(`\n📊 ${testName} JSON Comparison Report`);
        console.log('='.repeat(80));

        if (differences.length === 0) {
            console.log(`🎉 Perfect match! ${testName} JSON data matches baseline completely!`);
            console.log(`✅ Test passed: ${endpoint} API response matches baseline file 100%`);
            return { success: true };
        } else {
            console.log(`❌ Found ${differences.length} differences`);
            console.log('');

            // Group differences by type
            const groupedDiffs = {};
            differences.forEach((diff) => {
                if (!groupedDiffs[diff.type]) {
                    groupedDiffs[diff.type] = [];
                }
                groupedDiffs[diff.type].push(diff);
            });

            // Define type emojis and descriptions
            const typeInfo = {
                value_mismatch: { emoji: '🔄', name: 'Value Mismatches' },
                missing_property: { emoji: '❌', name: 'Missing Properties' },
                extra_property: { emoji: '➕', name: 'Extra Properties' },
                type_mismatch: { emoji: '🔀', name: 'Type Mismatches' },
                array_length: { emoji: '📏', name: 'Array Length Differences' },
                missing_in_actual: { emoji: '📭', name: 'Missing Array Elements' },
                extra_in_actual: { emoji: '📈', name: 'Extra Array Elements' },
                null_undefined: { emoji: '🚫', name: 'Null/Undefined Mismatches' },
            };

            // Output differences by type
            Object.keys(groupedDiffs).forEach((type) => {
                const info = typeInfo[type] || { emoji: '🔍', name: type };
                const diffs = groupedDiffs[type];

                console.log(`${info.emoji} ${info.name} (${diffs.length} items):`);
                diffs.forEach((diff, index) => {
                    console.log(`   ${index + 1}. ${diff.message}`);
                });
                console.log('');
            });

            // Output statistics
            console.log('📈 Difference Statistics:');
            console.log(`   Total differences: ${differences.length}`);
            console.log(`   Value mismatches: ${groupedDiffs.value_mismatch?.length || 0}`);
            console.log(`   Missing properties: ${groupedDiffs.missing_property?.length || 0}`);
            console.log(`   Extra properties: ${groupedDiffs.extra_property?.length || 0}`);
            console.log(`   Type mismatches: ${groupedDiffs.type_mismatch?.length || 0}`);
            console.log('');

            // Test failure
            console.log(`❌ Test failed: ${testName} JSON data does not match baseline`);
            return {
                success: false,
                error: `${testName} baseline comparison failed: found ${differences.length} differences`,
            };
        }
    },
};

export async function getSession(credentials) {
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    return session;
}

export default async function getSCIMConfig({ baseUrl, session }) {
    const options = {
        url: baseUrl + '/api/mstrServices/library/scim',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Cookie: session.cookie,
            'X-MSTR-AuthToken': session.token,
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    successLog('get scim success');
                    resolve(body);
                } else {
                    errorLog(`get scim failed. Status code: ${response.statusCode}. Message: ${body.message}`);
                    reject(body.message);
                }
            } else {
                errorLog(`get scim failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}

export async function setSCIMConfig({ baseUrl, session, scimConfig }) {
    const options = {
        url: baseUrl + '/api/mstrServices/library/scim',
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Cookie: session.cookie,
            'X-MSTR-AuthToken': session.token,
        },
        body: JSON.stringify(scimConfig),
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200 || response.statusCode === 204) {
                    successLog('set scim config success');
                    resolve({
                        statusCode: response.statusCode,
                        body: body,
                    });
                } else {
                    errorLog(`set scim config failed. Status code: ${response.statusCode}. Message: ${body}`);
                    reject({
                        statusCode: response.statusCode,
                        message: body,
                    });
                }
            } else {
                errorLog(`set scim config failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}

export async function setSCIMConfigBearer({ baseUrl, session, duration }) {
    const options = {
        url: baseUrl + '/api/mstrServices/library/scim/bearer',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Cookie: session.cookie,
            'X-MSTR-AuthToken': session.token,
        },
        body: JSON.stringify({ duration }),
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200 || response.statusCode === 201 || response.statusCode === 204) {
                    successLog('set scim config bearer success');
                    resolve({
                        statusCode: response.statusCode,
                        body: body,
                    });
                } else {
                    errorLog(`set scim config bearer failed. Status code: ${response.statusCode}. Message: ${body}`);
                    reject({
                        statusCode: response.statusCode,
                        message: body,
                    });
                }
            } else {
                errorLog(`set scim config bearer failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}

export async function createSCIMUser({ baseUrl, token, body }) {
    const options = {
        url: baseUrl + '/api/scim/v2/Users',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify(body),
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200 || response.statusCode === 201) {
                    successLog('create scim user success');
                    resolve({
                        statusCode: response.statusCode,
                        body: body,
                    });
                } else {
                    errorLog(`create scim user failed. Status code: ${response.statusCode}. Message: ${body}`);
                    reject({
                        statusCode: response.statusCode,
                        message: body,
                    });
                }
            } else {
                errorLog(`create scim user failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}

export async function getSCIMUser({ baseUrl, token, userId }) {
    const options = {
        url: baseUrl + `/api/scim/v2/Users/${userId}`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    successLog('get scim user success');
                    resolve({
                        statusCode: response.statusCode,
                        body: body,
                    });
                } else {
                    errorLog(`get scim user failed. Status code: ${response.statusCode}. Message: ${body}`);
                    reject({
                        statusCode: response.statusCode,
                        message: body,
                    });
                }
            } else {
                errorLog(`get scim user failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}

export async function putSCIMUser({ baseUrl, token, userId, body }) {
    const options = {
        url: baseUrl + `/api/scim/v2/Users/${userId}`,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify(body),
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200 || response.statusCode === 204) {
                    successLog('put scim user success');
                    resolve({
                        statusCode: response.statusCode,
                        body: body,
                    });
                } else {
                    errorLog(`put scim user failed. Status code: ${response.statusCode}. Message: ${body}`);
                    reject({
                        statusCode: response.statusCode,
                        message: body,
                    });
                }
            } else {
                errorLog(`put scim user failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}

export async function patchSCIMUser({ baseUrl, token, userId, body }) {
    const options = {
        url: baseUrl + `/api/scim/v2/Users/${userId}`,
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify(body),
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200 || response.statusCode === 204) {
                    successLog('patch scim user success');
                    resolve({
                        statusCode: response.statusCode,
                        body: body,
                    });
                } else {
                    errorLog(`patch scim user failed. Status code: ${response.statusCode}. Message: ${body}`);
                    reject({
                        statusCode: response.statusCode,
                        message: body,
                    });
                }
            } else {
                errorLog(`patch scim user failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}

export async function deleteSCIMUser({ baseUrl, token, userId }) {
    const options = {
        url: baseUrl + `/api/scim/v2/Users/${userId}`,
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200 || response.statusCode === 204 || response.statusCode === 404) {
                    successLog('delete scim user success');
                    resolve({
                        statusCode: response.statusCode,
                        body: body,
                    });
                } else {
                    errorLog(`delete scim user failed. Status code: ${response.statusCode}. Message: ${body}`);
                    reject({
                        statusCode: response.statusCode,
                        message: body,
                    });
                }
            } else {
                errorLog(`delete scim user failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}

export async function listSCIMUsers({ baseUrl, token, filter, attributes, startIndex, count }) {
    const url = new URL(baseUrl + '/api/scim/v2/Users');

    // Add query parameters if provided
    if (filter) {
        url.searchParams.append('filter', filter);
    }
    if (attributes) {
        url.searchParams.append('attributes', attributes);
    }
    if (startIndex !== undefined && startIndex !== null) {
        url.searchParams.append('startIndex', startIndex.toString());
    }
    if (count !== undefined && count !== null) {
        url.searchParams.append('count', count.toString());
    }

    const options = {
        url: url.toString(),
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    successLog('list scim users success');
                    resolve({
                        statusCode: response.statusCode,
                        body: body,
                    });
                } else {
                    errorLog(`list scim users failed. Status code: ${response.statusCode}. Message: ${body}`);
                    reject({
                        statusCode: response.statusCode,
                        message: body,
                    });
                }
            } else {
                errorLog(`list scim users failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}

export async function listSCIMGroups({ baseUrl, token, filter, attributes, startIndex, count }) {
    const url = new URL(baseUrl + '/api/scim/v2/Groups');

    // Add query parameters if provided
    if (filter) {
        url.searchParams.append('filter', filter);
    }
    if (attributes) {
        url.searchParams.append('attributes', attributes);
    }
    if (startIndex !== undefined && startIndex !== null) {
        url.searchParams.append('startIndex', startIndex.toString());
    }
    if (count !== undefined && count !== null) {
        url.searchParams.append('count', count.toString());
    }

    const options = {
        url: url.toString(),
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    successLog('list scim groups success');
                    resolve({
                        statusCode: response.statusCode,
                        body: body,
                    });
                } else {
                    errorLog(`list scim groups failed. Status code: ${response.statusCode}. Message: ${body}`);
                    reject({
                        statusCode: response.statusCode,
                        message: body,
                    });
                }
            } else {
                errorLog(`list scim groups failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}

export async function listSCIMSchemas({ baseUrl, token }) {
    const options = {
        url: baseUrl + '/api/scim/v2/Schemas',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    successLog('list scim schemas success');
                    resolve({
                        statusCode: response.statusCode,
                        body: body,
                    });
                } else {
                    errorLog(`list scim schemas failed. Status code: ${response.statusCode}. Message: ${body}`);
                    reject({
                        statusCode: response.statusCode,
                        message: body,
                    });
                }
            } else {
                errorLog(`list scim schemas failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}

export async function getSCIMSchema({ baseUrl, token, uri }) {
    const options = {
        url: baseUrl + `/api/scim/v2/Schemas/${uri}`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    successLog('get scim schema success');
                    resolve({
                        statusCode: response.statusCode,
                        body: body,
                    });
                } else {
                    errorLog(`get scim schema failed. Status code: ${response.statusCode}. Message: ${body}`);
                    reject({
                        statusCode: response.statusCode,
                        message: body,
                    });
                }
            } else {
                errorLog(`get scim schema failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}

export async function listSCIMResourceTypes({ baseUrl, token }) {
    const options = {
        url: baseUrl + '/api/scim/v2/ResourceTypes',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    successLog('list scim resource types success');
                    resolve({
                        statusCode: response.statusCode,
                        body: body,
                    });
                } else {
                    errorLog(`list scim resource types failed. Status code: ${response.statusCode}. Message: ${body}`);
                    reject({
                        statusCode: response.statusCode,
                        message: body,
                    });
                }
            } else {
                errorLog(`list scim resource types failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}

export async function getSCIMResourceType({ baseUrl, token, name }) {
    const options = {
        url: baseUrl + `/api/scim/v2/ResourceTypes/${name}`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    successLog('get scim resource type success');
                    resolve({
                        statusCode: response.statusCode,
                        body: body,
                    });
                } else {
                    errorLog(`get scim resource type failed. Status code: ${response.statusCode}. Message: ${body}`);
                    reject({
                        statusCode: response.statusCode,
                        message: body,
                    });
                }
            } else {
                errorLog(`get scim resource type failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}

export async function getSCIMServiceProviderConfig({ baseUrl, token }) {
    const options = {
        url: baseUrl + '/api/scim/v2/ServiceProviderConfig',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    successLog('get scim service provider config success');
                    resolve({
                        statusCode: response.statusCode,
                        body: body,
                    });
                } else {
                    errorLog(
                        `get scim service provider config failed. Status code: ${response.statusCode}. Message: ${body}`
                    );
                    reject({
                        statusCode: response.statusCode,
                        message: body,
                    });
                }
            } else {
                errorLog(`get scim service provider config failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}

export async function getSCIMGroup({ baseUrl, token, groupId }) {
    const options = {
        url: baseUrl + `/api/scim/v2/Groups/${groupId}`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    successLog('get scim group success');
                    resolve({
                        statusCode: response.statusCode,
                        body: body,
                    });
                } else {
                    errorLog(`get scim group failed. Status code: ${response.statusCode}. Message: ${body}`);
                    reject({
                        statusCode: response.statusCode,
                        message: body,
                    });
                }
            } else {
                errorLog(`get scim group failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}

export async function createSCIMGroup({ baseUrl, token, body }) {
    const options = {
        url: baseUrl + '/api/scim/v2/Groups',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify(body),
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200 || response.statusCode === 201) {
                    successLog('create scim group success');
                    resolve({
                        statusCode: response.statusCode,
                        body: body,
                    });
                } else {
                    errorLog(`create scim group failed. Status code: ${response.statusCode}. Message: ${body}`);
                    reject({
                        statusCode: response.statusCode,
                        message: body,
                    });
                }
            } else {
                errorLog(`create scim group failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}

export async function putSCIMGroup({ baseUrl, token, groupId, body }) {
    const options = {
        url: baseUrl + `/api/scim/v2/Groups/${groupId}`,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify(body),
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200 || response.statusCode === 204) {
                    successLog('put scim group success');
                    resolve({
                        statusCode: response.statusCode,
                        body: body,
                    });
                } else {
                    errorLog(`put scim group failed. Status code: ${response.statusCode}. Message: ${body}`);
                    reject({
                        statusCode: response.statusCode,
                        message: body,
                    });
                }
            } else {
                errorLog(`put scim group failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}

export async function patchSCIMGroup({ baseUrl, token, groupId, body }) {
    const options = {
        url: baseUrl + `/api/scim/v2/Groups/${groupId}`,
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify(body),
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200 || response.statusCode === 204) {
                    successLog('patch scim group success');
                    resolve({
                        statusCode: response.statusCode,
                        body: body,
                    });
                } else {
                    errorLog(`patch scim group failed. Status code: ${response.statusCode}. Message: ${body}`);
                    reject({
                        statusCode: response.statusCode,
                        message: body,
                    });
                }
            } else {
                errorLog(`patch scim group failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}

export async function deleteSCIMGroup({ baseUrl, token, groupId }) {
    const options = {
        url: baseUrl + `/api/scim/v2/Groups/${groupId}`,
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200 || response.statusCode === 204 || response.statusCode === 404) {
                    successLog('delete scim group success');
                    resolve({
                        statusCode: response.statusCode,
                        body: body,
                    });
                } else {
                    errorLog(`delete scim group failed. Status code: ${response.statusCode}. Message: ${body}`);
                    reject({
                        statusCode: response.statusCode,
                        message: body,
                    });
                }
            } else {
                errorLog(`delete scim group failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
