/**
 * Creates an MSTR cube by importing data from an file via URL
 *
 * @param {string} url - The URL path of the file to import
 * @param {string} cubeName - The name of the cube to be saved
 * @param {string} folderId - The folder ID in MSTR project where the cube should be saved
 * @param {string} baseUrl - The MSTR server base URL (e.g., 'https://your-mstr-server.com/MicroStrategy')
 * @param {string} username - MSTR username for authentication
 * @param {string} password - MSTR password for authentication
 * @param {string} projectId - MSTR project ID where the cube should be created
 * @param {string} dbroleId - Database role ID for authentication (optional, defaults to basic URL role)
 * @returns {Promise<Object>} - Promise that resolves to the created cube information
 */

import https from 'https';
import http from 'http';
import { URL } from 'url';
import qs from 'querystring';

// Global variables to store session information
let sessionCookies = '';
let authToken = '';
let sessionState = '';
let messageId = '';

/**
 * Helper function to make HTTP requests using Node.js http/https module
 */
function makeRequest(url, options = {}) {
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
                console.log('🍪 Current cookies:', sessionCookies);
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
function clearSession() {
    sessionCookies = '';
    authToken = '';
    sessionState = '';
    messageId = '';
    console.log('🧹 Session cleared');
}

/**
 * Send a taskProc request to MicroStrategy
 */
async function sendTask(baseUrl, projectId, parameters) {
    const taskUrl = `${baseUrl}/servlet/taskProc`;

    // Add common parameters
    parameters.taskEnv = 'xhr';
    parameters.taskContentType = 'json';
    parameters.styleName = 'RWDocumentMojoStyle';

    // Add timestamp for cache busting
    //parameters.xts = Date.now();
    parameters.mstrWeb = 'random';

    // Add session state if available
    if (sessionState) {
        parameters.sessionState = sessionState;
    }

    // Add message ID if available and not already set
    if (messageId && !parameters.msgid && !parameters.msgID) {
        parameters.msgid = messageId;
    }

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    };

    // Add auth token and project ID for authenticated requests
    if (authToken) {
        headers['X-MSTR-AuthToken'] = authToken;
    }
    if (projectId) {
        headers['X-MSTR-ProjectID'] = projectId;
    }

    const body = qs.stringify(parameters);

    console.log(taskUrl);
    console.log(headers);
    console.log(`📤 Sending task: ${parameters.taskId}`);
    console.log(`📊 Parameters:`, parameters);
    console.log(`📋 Form data:`, body);

    const response = await makeRequest(taskUrl, {
        method: 'POST',
        headers: headers,
        body: body,
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.log(`❌ Task failed response:`, errorText);
        throw new Error(`Task ${parameters.taskId} failed: ${response.statusText}`);
    }

    const responseData = await response.json();

    // Update session state and message ID from response
    if (responseData.sessionState) {
        sessionState = responseData.sessionState;
    }
    if (responseData.msgid) {
        messageId = responseData.msgid;
    }

    console.log(`✅ Task ${parameters.taskId} completed`);
    return responseData;
}

export async function createCubeFromS3(
    url,
    cubeName,
    folderId,
    baseUrl,
    username,
    password,
    projectId,
    awsRegion,
    awsAccessKeyId,
    awsSecretAccessKey
) {
    try {
        const connectionName = 'S3_' + new Date().getTime();
        const awsAccessKeyIdEncoded = Buffer.from(awsAccessKeyId, 'utf8').toString('base64');
        const awsSecretAccessKeyEncoded = Buffer.from(awsSecretAccessKey, 'utf8').toString('base64');

        // Clear any existing session first
        clearSession();

        // Remove trailing slash from base URL if present
        baseUrl = baseUrl.replace(/\/$/, '');

        console.log('🔑 Step 1: Authenticating to MSTR...');
        // Step 1: Authenticate and get session token
        await authenticateToMSTR(baseUrl, username, password, projectId);
        console.log('✅ Authentication successful');

        //create DB instance for S3
        console.log('📁 Step 2: Creating S3 database instance...');
        const dbInstanceId = await createS3DBInstance(
            baseUrl,
            connectionName,
            awsRegion,
            awsAccessKeyIdEncoded,
            awsSecretAccessKeyEncoded
        );
        console.log('✅ S3 database instance created');

        console.log('📋 Step 3: Creating EMMA report instance...');
        // Step 3: Create EMMA report instance to get message ID
        await createEMMAReportInstance(baseUrl, projectId);
        console.log('✅ EMMA report instance created');

        console.log('📊 Step 4: Creating data import source table...');
        // Step 4: Create a new data import source table
        const tableId = await createDataImportSourceTable(baseUrl, projectId, url);
        console.log(`✅ Source table created with ID: ${tableId}`);

        console.log('🔗 Step 5: Setting database role...');
        // Step 5: Set database role for the table using the S3 database instance ID
        await setDatabaseRole(baseUrl, projectId, tableId, dbInstanceId);
        console.log('✅ Database role configured');

        console.log('📁 Step 6: Setting data import info...');
        // Step 6: Set data import information
        await setDataImportInfo(baseUrl, projectId, tableId, url);
        console.log('✅ Data import info configured');

        console.log('👀 Step 7: Getting preview data...');
        // Step 7: Get preview data and validate
        const previewData = await getPreviewData(baseUrl, projectId, tableId);
        console.log('✅ Preview data retrieved');

        console.log('🗂️ Step 8: Auto-mapping table data...');
        // Step 8: Auto-map the table data
        await autoMapTable(baseUrl, projectId, tableId);
        console.log('✅ Table auto-mapping completed');

        console.log('🔍 Step 9: Detecting relationships...');
        // Step 9: Detect relationships
        await detectRelationships(baseUrl, projectId, tableId);
        console.log('✅ Relationships detected');

        console.log('📈 Step 10: Getting final table definition...');
        // Step 10: Get final table definition
        await getFinalTableDefinition(baseUrl, projectId, tableId);
        console.log('✅ Table definition retrieved');

        console.log('🚀 Step 11: Publishing cube...');
        // Step 11: Save and publish the cube
        const publishedCube = await saveAndPublishCube(baseUrl, projectId, cubeName, folderId);
        console.log('✅ Cube published successfully');

        console.log(`🎉 Successfully created and published cube: ${cubeName}`);
        return publishedCube;
    } catch (error) {
        console.error('❌ Error creating cube from S3:', error.message);
        console.error('📍 Full error details:', error);
        throw error;
    }
}

/**
 * Create S3 database instance
 */
async function createS3DBInstance(
    baseUrl,
    connectionName,
    awsRegion,
    awsAccessKeyIdEncoded,
    awsSecretAccessKeyEncoded
) {
    // Decode base64 encoded AWS credentials
    const awsAccessKeyId = Buffer.from(awsAccessKeyIdEncoded, 'base64').toString('utf8').trim();
    const awsSecretAccessKey = Buffer.from(awsSecretAccessKeyEncoded, 'base64').toString('utf8').trim();

    console.log('🔑 Decoded AWS Access Key ID:', awsAccessKeyId);
    console.log('🔑 AWS Secret Access Key decoded (length):', awsSecretAccessKey.length);

    // Build the database role information object
    const dbroleinfo = {
        n: connectionName,
        did: '',
        tp: 100,
        stp: 7425,
        writable: '1',
        vldbProperties: {
            'VLDB Select': {},
            'VLDB Report': {},
        },
        shared: '0',
        des: '',
        ln: awsAccessKeyId,
        password: awsSecretAccessKey,
        dbr_type: '2',
        owned: '1',
        cefu: 1,
        db_type: 18500,
        db_version: 580,
        dbms: 'CD24C7F473194C5984A0B2F8AEF688F7',
        connstr: `cfs_type=s3;s3_region=${awsRegion.toUpperCase()};`,
    };

    const parameters = {
        taskId: 'arch.saveDBRole',
        skipSchemaIDCheck: 'true',
        dbroleinfo: JSON.stringify(dbroleinfo),
    };

    const response = await sendTask(baseUrl, null, parameters);
    console.log('📋 S3 Database instance response:', response);

    console.log('✅ S3 database instance created successfully');

    // Extract the database instance ID from the response
    // The response structure is: { dbr: { did: 'ID', n: 'name' } }
    const dbInstanceId = response.dbr?.did;
    if (!dbInstanceId) {
        console.warn('⚠️ No database instance ID found in response.dbr.did');
        console.warn('⚠️ Response structure:', JSON.stringify(response, null, 2));
        throw new Error('Failed to create S3 database instance - no database role ID returned');
    }

    console.log(`📋 Database instance ID: ${dbInstanceId}`);
    console.log(`📋 Database instance name: ${response.dbr.n}`);
    return dbInstanceId;
}

/**
 * Authenticate to MSTR using REST API
 */
async function authenticateToMSTR(baseUrl, username, password, projectId) {
    const authUrl = `${baseUrl}/api/auth/login`;
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

/**
 * Create EMMA report instance to get message ID
 */
async function createEMMAReportInstance(baseUrl, projectId) {
    const parameters = {
        taskId: 'DICreateEMMAReportInstance',
        styleName: 'RWDocumentMojoStyle',
        DITask: '1',
        taskEnv: 'xhr',
        taskContentType: 'json',
    };

    const response = await sendTask(baseUrl, projectId, parameters);

    if (response.msgid) {
        messageId = response.msgid;
        console.log(`📋 Message ID captured: ${messageId}`);
    } else {
        throw new Error('Failed to create EMMA report instance - no message ID returned');
    }

    return response;
}

/**
 * Create a data import source table for S3
 */
async function createDataImportSourceTable(baseUrl, projectId, url) {
    const fileType = url.split('.').pop().toUpperCase();
    const parameters = {
        taskId: 'DICreateEMMASourceTable',
        xt: '288', // Changed from 256 to 288 for S3 imports
        dict: '65539',
        url: url,
        isUrl: 'true',
        fileType: fileType,
    };

    // Add message ID if available
    if (messageId) {
        parameters.msgid = messageId;
    }

    const response = await sendTask(baseUrl, projectId, parameters);

    if (!response.tbid) {
        throw new Error('Failed to create source table - no table ID returned');
    }

    return response.tbid;
}

/**
 * Set database role for the table
 */
async function setDatabaseRole(baseUrl, projectId, tableId, dbroleId) {
    // Use default URL database role if none provided
    const dbRoleId = dbroleId || 'CB1CB472A07E41D5AE038232839F2064';

    const parameters = {
        taskId: 'qBuilder.SetDBRole',
        tbid: tableId,
        dbrid: dbRoleId,
    };

    await sendTask(baseUrl, projectId, parameters);
}

/**
 * Set data import information for S3
 */
async function setDataImportInfo(baseUrl, projectId, tableId, url) {
    const fileType = url.split('.').pop().toUpperCase();

    const parameters = {
        taskId: 'DISetDataImportInfo',
        xt: '288', // Changed from 256 to 288 for S3 imports
        dict: '65539',
        isUrl: 'true',
        fileType: fileType,
        url: url,
        tbid: tableId,
    };

    // Add message ID if available
    if (messageId) {
        parameters.msgid = messageId;
    }

    const response = await sendTask(baseUrl, projectId, parameters);

    // Update message ID from response
    if (response.msgid) {
        messageId = response.msgid;
    }

    return response;
}

/**
 * Get preview data from file
 */
async function getPreviewData(baseUrl, projectId, tableId) {
    const parameters = {
        taskId: 'qBuilder.GetReportXDADefinition',
        bindingflag: '2',
        previewflag: '528',
        browsetype: '261',
        tableID: tableId,
    };

    const response = await sendTask(baseUrl, projectId, parameters);

    if (!response.datap || !response.datap.shts) {
        throw new Error('Failed to get preview data - no sheets found');
    }

    const sheets = response.datap.shts.filter((sheet) => sheet !== '*');

    if (sheets.length === 0) {
        throw new Error('The file being imported is not supported or the file might be corrupted.');
    }

    return {
        sheets: sheets,
        fileId: response.datap.fileId,
    };
}

/**
 * Auto-map the table data
 */
async function autoMapTable(baseUrl, projectId, tableId) {
    const parameters = {
        taskId: 'DIAutoMappingEMMASourceTable',
        tbid: tableId,
        shtIx: '0',
        isUrl: 'true',
    };

    await sendTask(baseUrl, projectId, parameters);
}

/**
 * Detect relationships in the table
 */
async function detectRelationships(baseUrl, projectId, tableId) {
    const parameters = {
        taskId: 'DIDetectRelationshipEMMASourceTable',
        did: tableId,
    };

    await sendTask(baseUrl, projectId, parameters);
}

/**
 * Get final table definition
 */
async function getFinalTableDefinition(baseUrl, projectId, tableId) {
    const parameters = {
        taskId: 'qBuilder.GetReportXDADefinition',
        bindingflag: '2',
        browsetype: '261',
        previewflag: '773',
    };

    const response = await sendTask(baseUrl, projectId, parameters);

    return response;
}

/**
 * Save and publish the cube
 */
async function saveAndPublishCube(baseUrl, projectId, cubeName, folderId) {
    const parameters = {
        taskId: 'saveAndPublishCube',
        displayMode: '12',
        saveAsFlags: '67108896',
        folderID: folderId,
        objName: cubeName,
        objDesc: `Data import cube from S3 - ${new Date().toISOString()}`,
        saveAsOverwrite: 'true',
    };

    // Add message ID if available
    if (messageId) {
        parameters.msgID = messageId;
    }

    const response = await sendTask(baseUrl, projectId, parameters);

    if (response.objectId) {
        console.log(`📋 Created cube ID: ${response.objectId}`);
        if (response.jobId) {
            console.log(`🔧 Job ID: ${response.jobId}`);
        }
    }

    return response;
}
