import request from 'request';
import authentication from '../authentication.js';
import logout from '../logout.js';
import urlParser from '../urlParser.js';

/**
 * HTTP request wrapper with error handling
 * @param {Object} options - Request options
 * @param {string} operationName - Operation name for error messages
 * @param {number|number[]} expectedStatusCodes - Expected status code(s)
 * @param {Function} extractResult - Optional function to extract result from response
 * @returns {Promise} Resolved with extracted result or full response body
 */
function makeRequest(options, operationName, expectedStatusCodes, extractResult = null) {
    const expectedCodes = Array.isArray(expectedStatusCodes) ? expectedStatusCodes : [expectedStatusCodes];

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (error) {
                reject(new Error(`${operationName} failed: ${error.message} - ${options.method} ${options.url}`));
                return;
            }

            const statusCode = response.statusCode;

            if (expectedCodes.includes(statusCode)) {
                const result = extractResult ? extractResult(response, body) : body;
                resolve(result);
                return;
            }

            reject(
                new Error(
                    `${operationName} failed: Expected ${expectedCodes.join(' or ')}, got ${statusCode}\n` +
                        `URL: ${options.method} ${options.url}\n` +
                        `Response: ${JSON.stringify(body, null, 2)}`
                )
            );
        });
    });
}

// ============================================================================
// Main Function
// ============================================================================
/**
 * Import sample file from URL and create a mosaic model cube
 * @param {Object} credentials - Login credentials for authentication
 * @param {string} projectId - The project ID where cube will be created
 * @param {string} fileName - The sample file name (e.g., 'airline-sample-data.xls')
 * @param {string} cubeName - The name for the created cube
 * @param {string} destinationFolderId - The folder ID where cube will be created
 * @returns {Promise<{cubeId: string, cubeName: string}>} Created cube information
 */
async function createMosaicModelWithSampleFile(credentials, projectId, fileName, cubeName, destinationFolderId) {
    const TOTAL_STEPS = 17;
    let currentStep = 0;

    console.log(`Creating mosaic model for file: ${fileName}`);

    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });

    const sampleUrl = `https://mirror.microstrategy.com/datahub/samples/${fileName}`;

    // Default data source configuration
    const dataSourceId = 'CB1CB472A07E41D5AE038232839F2064';

    // Global state to pass between functions
    const state = {
        sourceTableId: null,
        wrangleTableId: null,
        pipelineInfo: null,
        tableColumnsInfo: null,
    };

    try {
        // Step 1: Initialize data model workspace
        console.log(`[${++currentStep}/${TOTAL_STEPS}] Creating changeset`);
        const changesetId = await postChangesets(baseUrl, session, projectId);

        console.log(`[${++currentStep}/${TOTAL_STEPS}] Creating workspace`);
        const workspaceId = await postWorkspace(baseUrl, session, projectId);

        console.log(`[${++currentStep}/${TOTAL_STEPS}] Creating data model`);
        const cubeId = await postDataModels(baseUrl, session, projectId, changesetId, destinationFolderId);

        // Step 2: Define table structure
        const fileExtension = fileName.includes('.') ? fileName.split('.').pop().toUpperCase() : 'XLS';

        const tables = {
            name: `${fileName}`,
            type: 'wrangle',
            children: [
                {
                    name: `${fileName}`,
                    type: 'source',
                    importSource: {
                        dataSourceId: dataSourceId,
                        type: 'sample_files',
                        url: sampleUrl,
                        tableName: `${fileName}`,
                        sheetIndex: 0,
                        sheetName: 'Sheet1',
                        fileType: fileExtension,
                    },
                },
            ],
            operations: [],
        };

        // Step 3: Create pipeline and prepare data
        console.log(`[${++currentStep}/${TOTAL_STEPS}] Creating pipeline`);
        const pipelineId = await postPipelines(baseUrl, session, projectId, changesetId, workspaceId);

        console.log(`[${++currentStep}/${TOTAL_STEPS}] Adding tables to pipeline`);
        await postTables(baseUrl, session, projectId, changesetId, workspaceId, pipelineId, tables, state);

        console.log(`[${++currentStep}/${TOTAL_STEPS}] Waiting for tables to be ready`);
        await getTables(baseUrl, session, projectId, changesetId, workspaceId, pipelineId, state);

        console.log(`[${++currentStep}/${TOTAL_STEPS}] Getting raw preview data`);
        await getRawData(baseUrl, session, projectId, changesetId, workspaceId, pipelineId, state);

        // Step 4: Get pipeline info and create backup
        console.log(`[${++currentStep}/${TOTAL_STEPS}] Getting pipeline structure`);
        const pipeline = await getPipelines(baseUrl, session, projectId, changesetId, workspaceId, pipelineId, state);

        console.log(`[${++currentStep}/${TOTAL_STEPS}] Creating pipeline backup`);
        const pipelineBackup = createPipelineBackup(pipeline, pipelineId);
        await postPipelinesWithBackup(baseUrl, session, projectId, changesetId, workspaceId, pipelineBackup);

        // Step 5: Add table to model
        console.log(`[${++currentStep}/${TOTAL_STEPS}] Getting preview data from wrangle table`);
        await getPreviewData(baseUrl, session, projectId, changesetId, workspaceId, pipelineId, state);

        console.log(`[${++currentStep}/${TOTAL_STEPS}] Calling AI service to determine column types`);
        const cleansingResult = await postAiServiceCleansing(baseUrl, session, projectId, changesetId, fileName, state);

        console.log(`[${++currentStep}/${TOTAL_STEPS}] Adding table to data model`);
        const objectIdPublish = await postTablesWithFields(
            baseUrl,
            session,
            projectId,
            changesetId,
            cubeId,
            pipelineId,
            state
        );

        console.log(`[${++currentStep}/${TOTAL_STEPS}] Creating attributes and metrics`);
        await postBatchAllowPartialSuccess(
            baseUrl,
            session,
            projectId,
            changesetId,
            cubeId,
            objectIdPublish,
            state,
            cleansingResult
        );

        // Step 6: Publish data model cube
        console.log(`[${++currentStep}/${TOTAL_STEPS}] Updating data model name and settings`);
        await patchDataModels(baseUrl, session, projectId, changesetId, cubeId, cubeName, destinationFolderId);

        console.log(`[${++currentStep}/${TOTAL_STEPS}] Committing changeset`);
        await postChangesetsCommit(baseUrl, session, projectId, changesetId);

        console.log(`[${++currentStep}/${TOTAL_STEPS}] Creating data model instance`);
        const dataModelInstanceId = await postInstances(baseUrl, session, projectId, changesetId, cubeId);

        console.log(`[${++currentStep}/${TOTAL_STEPS}] Publishing data model`);
        await postPublishAndGetPublishStatus(
            baseUrl,
            session,
            projectId,
            changesetId,
            cubeId,
            dataModelInstanceId,
            objectIdPublish
        );

        // Step 7: Cleanup workspace
        await deleteChangesets(baseUrl, session, projectId, changesetId);
        await deleteWorkspace(baseUrl, session, projectId, workspaceId);
        await deleteInstance(baseUrl, session, projectId, cubeId, dataModelInstanceId);

        console.log('Mosaic model created successfully');

        return cubeId;
    } catch (error) {
        console.error(`Failed to create mosaic model: ${error.message}`);
        throw error;
    } finally {
        await logout({ baseUrl, session });
    }
}

// ============================================================================
// API Functions - Changeset & Workspace
// ============================================================================

/**
 * Create a new changeset for model changes
 * @returns {Promise<string>} Changeset ID
 */
async function postChangesets(baseUrl, session, projectId) {
    const options = {
        url: `${baseUrl}api/model/changesets`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-AuthToken': session.token,
            'X-MSTR-ProjectID': projectId,
            Cookie: session.cookie,
        },
        json: true,
    };

    return makeRequest(options, 'Create Changeset', 201, (response) => {
        const changesetId = response.headers['x-mstr-ms-changeset'];
        if (!changesetId) {
            throw new Error('Changeset ID not found in response headers');
        }
        return changesetId;
    });
}

/**
 * Create a new workspace for data operations
 * @returns {Promise<string>} Workspace ID
 */
async function postWorkspace(baseUrl, session, projectId) {
    const options = {
        url: `${baseUrl}api/dataServer/workspaces`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-AuthToken': session.token,
            'X-MSTR-ProjectID': projectId,
            Cookie: session.cookie,
        },
        json: true,
        body: {},
    };

    return makeRequest(options, 'Create Workspace', 201, (response, body) => {
        if (!body.id) {
            throw new Error('Workspace ID not found in response body');
        }
        return body.id;
    });
}

/**
 * Create a new data model
 * @returns {Promise<string>} Data model (cube) ID
 */
async function postDataModels(baseUrl, session, projectId, changesetId, folderId) {
    const options = {
        url: `${baseUrl}api/model/dataModels`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-AuthToken': session.token,
            'X-MSTR-ProjectID': projectId,
            'X-Mstr-Ms-Changeset': changesetId,
            Cookie: session.cookie,
        },
        json: true,
        body: {
            information: {
                name: 'New Data Model(1)',
                destinationFolderId: folderId,
            },
        },
    };

    return makeRequest(options, 'Create Data Model', 201, (response, body) => {
        if (!body.information?.objectId) {
            throw new Error('Data model ID not found in response');
        }
        return body.information.objectId;
    });
}

// ============================================================================
// API Functions - Pipeline Operations
// ============================================================================

/**
 * Create a pipeline in the workspace
 * @returns {Promise<string>} Pipeline ID
 */
async function postPipelines(baseUrl, session, projectId, changesetId, workspaceId) {
    const options = {
        url: `${baseUrl}api/dataServer/workspaces/${workspaceId}/pipelines`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-AuthToken': session.token,
            'X-MSTR-ProjectID': projectId,
            'X-Mstr-Ms-Changeset': changesetId,
            Cookie: session.cookie,
        },
        json: true,
        body: {},
    };

    return makeRequest(options, 'Create Pipeline', 201, (response, body) => {
        if (!body.id) {
            throw new Error('Pipeline ID not found in response');
        }
        return body.id;
    });
}

/**
 * Add table to pipeline (async operation)
 */
async function postTables(baseUrl, session, projectId, changesetId, workspaceId, pipelineId, tableData, state) {
    const options = {
        url: `${baseUrl}api/dataServer/workspaces/${workspaceId}/pipelines/${pipelineId}/tables`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-AuthToken': session.token,
            'X-MSTR-ProjectID': projectId,
            'X-Mstr-Ms-Changeset': changesetId,
            Prefer: 'respond-async',
            Cookie: session.cookie,
        },
        json: true,
        body: tableData,
    };

    return makeRequest(options, 'Add Table to Pipeline', 202, (response, body) => {
        if (!body.id || !body.children?.[0]?.id) {
            throw new Error('Table IDs not found in response');
        }
        state.wrangleTableId = body.id;
        state.sourceTableId = body.children[0].id;
        return body;
    });
}

/**
 * Poll until table is ready
 */
async function getTables(baseUrl, session, projectId, changesetId, workspaceId, pipelineId, state, timeout = 300) {
    const url = `${baseUrl}api/dataServer/workspaces/${workspaceId}/pipelines/${pipelineId}/tables/${state.wrangleTableId}`;

    for (let i = 0; i < timeout * 2; i++) {
        const options = {
            url: url,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-MSTR-AuthToken': session.token,
                'X-MSTR-ProjectID': projectId,
                'X-Mstr-Ms-Changeset': changesetId,
                Prefer: 'respond-async',
                Cookie: session.cookie,
            },
            json: true,
        };

        const result = await new Promise((resolve, reject) => {
            request(options, (error, response, body) => {
                if (!error) {
                    resolve({ statusCode: response.statusCode, body });
                } else {
                    reject(error);
                }
            });
        });

        if (result.statusCode === 200) {
            if (!result.body.children?.[0]?.id || !result.body.id) {
                throw new Error('Table IDs not found in polling response');
            }
            state.sourceTableId = result.body.children[0].id;
            state.wrangleTableId = result.body.id;
            state.tableInfo = result.body;
            return;
        } else if (result.statusCode === 202) {
            await sleep(500);
        } else {
            throw new Error(
                `Unexpected status during table polling: ${result.statusCode}\n` +
                    `Response: ${JSON.stringify(result.body)}`
            );
        }
    }

    throw new Error(`Table not ready after ${timeout} seconds`);
}

/**
 * Get raw preview data from source table
 */
async function getRawData(baseUrl, session, projectId, changesetId, workspaceId, pipelineId, state) {
    const options = {
        url: `${baseUrl}api/dataServer/workspaces/${workspaceId}/pipelines/${pipelineId}/tables/${state.sourceTableId}?showPreviewData=true`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-AuthToken': session.token,
            'X-MSTR-ProjectID': projectId,
            'X-Mstr-Ms-Changeset': changesetId,
            Cookie: session.cookie,
        },
        json: true,
    };

    return makeRequest(options, 'Get Raw Preview Data', 200, (response, body) => {
        return body;
    });
}

/**
 * Get pipeline structure
 */
async function getPipelines(baseUrl, session, projectId, changesetId, workspaceId, pipelineId, state) {
    const options = {
        url: `${baseUrl}api/dataServer/workspaces/${workspaceId}/pipelines/${pipelineId}`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-AuthToken': session.token,
            'X-MSTR-ProjectID': projectId,
            'X-Mstr-Ms-Changeset': changesetId,
            Cookie: session.cookie,
        },
        json: true,
    };

    return makeRequest(options, 'Get Pipeline Structure', 200, (response, body) => {
        if (!body.rootTable?.children?.[0]?.id || !body.rootTable?.children?.[0]?.children?.[0]?.id) {
            throw new Error('Pipeline structure is incomplete');
        }
        state.wrangleTableId = body.rootTable.children[0].id;
        state.sourceTableId = body.rootTable.children[0].children[0].id;
        return body;
    });
}

/**
 * Create a backup copy of pipeline with modified settings
 */
function createPipelineBackup(pipeline, pipelineId) {
    const backup = JSON.parse(JSON.stringify(pipeline));
    backup.id = '';
    backup.responseStatus = 201;
    backup.isDraft = true;

    // Set the pipeline ID for the child table
    if (backup.rootTable?.children?.[0]) {
        backup.rootTable.children[0].pipelineId = pipelineId;
    }

    return backup;
}

/**
 * Post the backup pipeline to create a new pipeline instance
 */
async function postPipelinesWithBackup(baseUrl, session, projectId, changesetId, workspaceId, pipelineBody) {
    const options = {
        url: `${baseUrl}api/dataServer/workspaces/${workspaceId}/pipelines`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-AuthToken': session.token,
            'X-MSTR-ProjectID': projectId,
            'X-Mstr-Ms-Changeset': changesetId,
            Cookie: session.cookie,
        },
        json: true,
        body: pipelineBody,
    };

    return makeRequest(options, 'Create Pipeline Backup', 201, (response, body) => {
        if (!body.id) {
            throw new Error('Pipeline backup ID not found in response');
        }
        return body.id;
    });
}

/**
 * Get preview data from wrangle table
 */
async function getPreviewData(baseUrl, session, projectId, changesetId, workspaceId, pipelineId, state) {
    const options = {
        url: `${baseUrl}api/dataServer/workspaces/${workspaceId}/pipelines/${pipelineId}/tables/${state.wrangleTableId}?showPreviewData=true`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-AuthToken': session.token,
            'X-MSTR-ProjectID': projectId,
            'X-Mstr-Ms-Changeset': changesetId,
            Cookie: session.cookie,
        },
        json: true,
    };

    return makeRequest(options, 'Get Wrangle Table Preview Data', 200, (response, body) => {
        if (!body.columns || !Array.isArray(body.columns)) {
            throw new Error('Columns not found in preview data');
        }

        // Store columns info for later use
        state.tableColumnsInfo = body.columns.map((col) => ({
            name: col.name,
            id: col.id,
            dataType: col.dataType,
        }));

        // Store preview data for AI service
        state.previewData = body.data || [];

        return body;
    });
}

/**
 * Call cleansing API to determine which columns are attributes and which are metrics
 */
async function postAiServiceCleansing(baseUrl, session, projectId, changesetId, tableName, state) {
    // Prepare columns data for AI service
    const columns = state.tableColumnsInfo.map((col, index) => {
        const columnData = [];
        // Extract preview data for this column (up to 10 rows)
        for (let i = 0; i < Math.min(10, state.previewData.length); i++) {
            const value = state.previewData[i][col.name];
            columnData.push(value !== undefined && value !== null ? value : null);
        }

        return {
            columnId: String(index + 1),
            columnName: col.name,
            data: columnData,
        };
    });

    const requestBody = {
        payload: {
            cleansingTables: [
                {
                    tableName: tableName,
                    tableId: '0',
                    columns: columns,
                    waitListColumnNamesContext: [],
                },
            ],
            existingTables: [],
            enableSensitivityDetection: true,
            locale: 'english',
        },
    };

    const options = {
        url: `${baseUrl}api/aiservice/model/v2/objects/cleansing`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-AuthToken': session.token,
            'X-MSTR-ProjectID': projectId,
            'X-Mstr-Ms-Changeset': changesetId,
            Cookie: session.cookie,
        },
        json: true,
        body: requestBody,
    };

    return makeRequest(options, 'AI Service Cleansing', 200, (response, body) => {
        if (!body.result || !body.result.columns) {
            throw new Error('AI service response missing column type information');
        }

        // Map column indices to their types and names (use index instead of ID)
        const columnTypeByIndex = [];
        const columnNameByIndex = [];
        body.result.columns.forEach((col) => {
            const colIndex = parseInt(col.columnId) - 1;
            if (colIndex >= 0 && colIndex < state.tableColumnsInfo.length) {
                columnTypeByIndex[colIndex] = col.type; // 'attribute' or 'metric'
                columnNameByIndex[colIndex] = col.formName || col.newName || state.tableColumnsInfo[colIndex].name;
            }
        });

        return { columnTypeByIndex, columnNameByIndex };
    });
}

// ============================================================================
// API Functions - Data Model Configuration
// ============================================================================

/**
 * Add table with fields to data model
 */
async function postTablesWithFields(baseUrl, session, projectId, changesetId, cubeId, pipelineId, state) {
    if (!state.tableInfo) {
        throw new Error('TABLE_INFO not found in state. getTables must be called first.');
    }

    const pipelineData = {
        id: pipelineId,
        rootTable: {
            id: state.wrangleTableId,
            type: 'root',
            children: [state.tableInfo],
        },
    };

    const options = {
        url: `${baseUrl}api/model/dataModels/${cubeId}/tables?fields=information,attributes,factMetrics,physicalTable,logicalSize,isLogicalSizeLocked,isTrueKey,isPartOfPartition,unmappedColumns,refreshPolicy`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-AuthToken': session.token,
            'X-MSTR-ProjectID': projectId,
            'X-Mstr-Ms-Changeset': changesetId,
            Cookie: session.cookie,
        },
        json: true,
        body: {
            physicalTable: {
                type: 'pipeline',
                pipeline: JSON.stringify(pipelineData),
            },
        },
    };

    return makeRequest(options, 'Add Table to Data Model', 201, (response, body) => {
        if (!body.information?.objectId || !body.physicalTable?.columns) {
            throw new Error('Table or column information not found in response');
        }

        const objectIdPublish = body.information.objectId;

        // Update table columns info with IDs from response
        const columns = body.physicalTable.columns;
        state.tableColumnsInfo = columns.map((col) => ({
            name: col.information.name,
            id: col.information.objectId,
            dataType: col.dataType.type,
        }));

        return objectIdPublish;
    });
}

/**
 * Create attributes and metrics from table columns
 */
async function postBatchAllowPartialSuccess(
    baseUrl,
    session,
    projectId,
    changesetId,
    cubeId,
    objectIdPublish,
    state,
    cleansingResult
) {
    const batchBody = generateBatchBody(cubeId, objectIdPublish, state.tableColumnsInfo, cleansingResult);

    const options = {
        url: `${baseUrl}api/model/batch?allowPartialSuccess=true`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-AuthToken': session.token,
            'X-MSTR-ProjectID': projectId,
            'X-Mstr-Ms-Changeset': changesetId,
            Cookie: session.cookie,
        },
        json: true,
        body: batchBody,
    };

    return makeRequest(options, 'Create Attributes & Metrics (Batch)', 200, (response, body) => {
        return body;
    });
}

/**
 * Generate batch request body for creating attributes and metrics
 */
function generateBatchBody(cubeId, objectIdPublish, tableColumnsInfo, cleansingResult) {
    const dataTypeMapping = {
        integer: 'number',
        int64: 'number',
        float: 'number',
        double: 'number',
        date: 'date',
        time: 'time',
        time_stamp: 'date_time',
        utf8_char: 'text',
        big_decimal: 'big_decimal',
        binary: 'number',
        unknown: 'number',
        fixed_length_string: 'text',
        short: 'number',
        long: 'number',
        n_char: 'text',
        n_var_char: 'text',
    };

    const { columnTypeByIndex, columnNameByIndex } = cleansingResult;

    const requests = tableColumnsInfo.map((column, index) => {
        const columnType = columnTypeByIndex[index] || 'attribute';
        const columnName = columnNameByIndex[index] || column.name.replace(/"/g, '_');

        if (columnType === 'metric') {
            // Create metric (fact metric) request
            return {
                method: 'POST',
                path: `/model/dataModels/${cubeId}/factMetrics?showExpressionAs=tree&showExpressionAs=tokens&allowLink=true`,
                body: {
                    information: {
                        name: columnName,
                        subType: 'fact_metric',
                    },
                    fact: {
                        expressions: [
                            {
                                expression: {
                                    tree: {
                                        type: 'column_reference',
                                        objectId: column.id,
                                    },
                                },
                                tables: [
                                    {
                                        objectId: objectIdPublish,
                                        subType: 'logical_table',
                                    },
                                ],
                            },
                        ],
                    },
                    format: {
                        header: [],
                        values: [
                            {
                                type: 'number_category',
                                value: '0',
                            },
                            {
                                type: 'number_decimal_places',
                                value: '0',
                            },
                            {
                                type: 'number_thousand_separator',
                                value: 'true',
                            },
                            {
                                type: 'number_currency_symbol',
                                value: '',
                            },
                            {
                                type: 'number_currency_position',
                                value: '0',
                            },
                            {
                                type: 'number_negative_numbers',
                                value: '1',
                            },
                        ],
                    },
                    semanticRole: 'fixed',
                },
            };
        } else {
            // Create attribute request
            return {
                method: 'POST',
                path: `/model/dataModels/${cubeId}/attributes?showExpressionAs=tree&showExpressionAs=tokens&allowLink=true`,
                body: {
                    information: {
                        name: columnName,
                    },
                    forms: [
                        {
                            name: columnName,
                            displayFormat: dataTypeMapping[column.dataType] || 'text',
                            expressions: [
                                {
                                    expression: {
                                        tree: {
                                            objectId: column.id,
                                            type: 'column_reference',
                                        },
                                    },
                                    tables: [
                                        {
                                            objectId: objectIdPublish,
                                            subType: 'logical_table',
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                    keyForm: {
                        name: columnName,
                    },
                    displays: {
                        reportDisplays: [
                            {
                                name: columnName,
                            },
                        ],
                        browseDisplays: [
                            {
                                name: columnName,
                            },
                        ],
                    },
                    autoDetectLookupTable: true,
                    attributeLookupTable: {
                        objectId: objectIdPublish,
                        subType: 'logical_table',
                    },
                },
            };
        }
    });

    // Add GET requests to fetch model info
    requests.push(
        {
            method: 'GET',
            path: `/model/dataModels/${cubeId}/tables?fields=information,attributes,factMetrics,physicalTable,logicalSize,isLogicalSizeLocked,isTrueKey,isPartOfPartition,unmappedColumns`,
        },
        {
            method: 'GET',
            path: `/model/dataModels/${cubeId}/hierarchy`,
        },
        {
            method: 'GET',
            path: `/model/dataModels/${cubeId}/metrics?showExpressionAs=tree&showExpressionAs=tokens&showAdvancedProperties=true`,
        }
    );

    return { requests };
}

// ============================================================================
// API Functions - Publish & Commit
// ============================================================================

/**
 * Update data model name and settings
 */
async function patchDataModels(baseUrl, session, projectId, changesetId, cubeId, cubeName, folderId) {
    const options = {
        url: `${baseUrl}api/model/dataModels/${cubeId}`,
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-AuthToken': session.token,
            'X-MSTR-ProjectID': projectId,
            'X-Mstr-Ms-Changeset': changesetId,
            Cookie: session.cookie,
        },
        json: true,
        body: {
            information: {
                name: cubeName,
                destinationFolderId: folderId,
                description: '',
            },
            dataServeMode: 'in_memory',
        },
    };

    return makeRequest(options, 'Update Data Model Settings', 200, (response, body) => {
        return body;
    });
}

/**
 * Commit changeset and wait for completion
 */
async function postChangesetsCommit(baseUrl, session, projectId, changesetId, timeout = 300) {
    const commitUrl = `${baseUrl}api/model/changesets/${changesetId}/commit`;

    const commitOptions = {
        url: commitUrl,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-AuthToken': session.token,
            'X-MSTR-ProjectID': projectId,
            'X-Mstr-Ms-Changeset': changesetId,
            Prefer: 'respond-async',
            Cookie: session.cookie,
        },
        json: true,
        body: {},
    };

    // Initiate commit
    await makeRequest(commitOptions, 'Initiate Changeset Commit', 202);

    // Poll until commit is complete
    const statusUrl = `${baseUrl}api/model/changesets/${changesetId}`;

    for (let i = 0; i < timeout * 2; i++) {
        const statusOptions = {
            url: statusUrl,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-MSTR-AuthToken': session.token,
                'X-MSTR-ProjectID': projectId,
                'X-Mstr-Ms-Changeset': changesetId,
                Cookie: session.cookie,
            },
            json: true,
        };

        const result = await new Promise((resolve, reject) => {
            request(statusOptions, (error, response, body) => {
                if (!error) {
                    resolve({ statusCode: response.statusCode, body: body });
                } else {
                    reject(error);
                }
            });
        });

        if (result.statusCode === 200) {
            return;
        } else if (result.statusCode === 202) {
            await sleep(500);
        } else {
            throw new Error(
                `Unexpected status during commit polling: ${result.statusCode}\n` +
                    `Response: ${JSON.stringify(result.body)}`
            );
        }
    }

    throw new Error(`Changeset commit timed out after ${timeout} seconds`);
}

/**
 * Create data model instance for publishing
 */
async function postInstances(baseUrl, session, projectId, changesetId, cubeId) {
    const options = {
        url: `${baseUrl}api/dataModels/${cubeId}/instances`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-AuthToken': session.token,
            'X-MSTR-ProjectID': projectId,
            'X-Mstr-Ms-Changeset': changesetId,
            Cookie: session.cookie,
        },
        json: true,
        body: {},
    };

    return makeRequest(options, 'Create Data Model Instance', 204, (response) => {
        const instanceId = response.headers['x-mstr-datamodelinstanceid'];
        if (!instanceId) {
            throw new Error('Instance ID not found in response headers');
        }
        return instanceId;
    });
}

/**
 * Publish data model and wait for completion
 */
async function postPublishAndGetPublishStatus(
    baseUrl,
    session,
    projectId,
    changesetId,
    cubeId,
    instanceId,
    objectIdPublish,
    timeout = 300
) {
    const publishUrl = `${baseUrl}api/dataModels/${cubeId}/publish`;

    const publishOptions = {
        url: publishUrl,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-AuthToken': session.token,
            'X-MSTR-ProjectID': projectId,
            'X-Mstr-Ms-Changeset': changesetId,
            'X-Mstr-Datamodelinstanceid': instanceId,
            Cookie: session.cookie,
        },
        json: true,
        body: {
            tables: [
                {
                    id: objectIdPublish,
                    refreshPolicy: 'replace',
                },
            ],
        },
    };

    // Initiate publish
    await makeRequest(publishOptions, 'Initiate Data Model Publish', 204);

    // Poll publish status
    const statusUrl = `${baseUrl}api/dataModels/${cubeId}/publishStatus`;

    for (let i = 0; i < timeout * 2; i++) {
        const statusOptions = {
            url: statusUrl,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-MSTR-AuthToken': session.token,
                'X-MSTR-ProjectID': projectId,
                'X-Mstr-Ms-Changeset': changesetId,
                'X-Mstr-Datamodelinstanceid': instanceId,
                Cookie: session.cookie,
            },
            json: true,
        };

        const result = await new Promise((resolve, reject) => {
            request(statusOptions, (error, response, body) => {
                if (!error) {
                    resolve({ statusCode: response.statusCode, body: body });
                } else {
                    reject(error);
                }
            });
        });

        if (result.statusCode === 200) {
            const cubeStatus = parseInt(result.body.status);

            if (cubeStatus === 1) {
                return;
            } else if (cubeStatus < 0) {
                throw new Error(
                    `Data model publish failed with status ${cubeStatus}\n` + `Response: ${JSON.stringify(result.body)}`
                );
            } else {
                // Status is 0 or other positive value, still in progress
                await sleep(500);
            }
        } else {
            throw new Error(
                `Unexpected status during publish polling: ${result.statusCode}\n` +
                    `Response: ${JSON.stringify(result.body)}`
            );
        }
    }

    throw new Error(`Data model publish timed out after ${timeout} seconds`);
}

// ============================================================================
// API Functions - Cleanup
// ============================================================================

/**
 * Delete changeset (best-effort cleanup)
 */
async function deleteChangesets(baseUrl, session, projectId, changesetId) {
    const options = {
        url: `${baseUrl}api/model/changesets/${changesetId}`,
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-AuthToken': session.token,
            'X-MSTR-ProjectID': projectId,
            Cookie: session.cookie,
        },
        json: true,
    };

    return new Promise((resolve) => {
        request(options, () => {
            resolve();
        });
    });
}

/**
 * Delete workspace (best-effort cleanup)
 */
async function deleteWorkspace(baseUrl, session, projectId, workspaceId) {
    const options = {
        url: `${baseUrl}api/dataServer/workspaces/${workspaceId}`,
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-AuthToken': session.token,
            'X-MSTR-ProjectID': projectId,
            Cookie: session.cookie,
        },
        json: true,
    };

    return new Promise((resolve) => {
        request(options, () => {
            resolve();
        });
    });
}

/**
 * Delete instance (best-effort cleanup)
 */
async function deleteInstance(baseUrl, session, projectId, cubeId, instanceId) {
    const options = {
        url: `${baseUrl}api/dataModels/${cubeId}/instances/${instanceId}`,
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-AuthToken': session.token,
            'X-MSTR-ProjectID': projectId,
            Cookie: session.cookie,
        },
        json: true,
    };

    return new Promise((resolve) => {
        request(options, () => {
            resolve();
        });
    });
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Sleep utility function
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} Resolves after specified delay
 */
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// ============================================================================
// Export
// ============================================================================

export default createMosaicModelWithSampleFile;
