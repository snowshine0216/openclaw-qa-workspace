import assert from 'assert';
import axios from 'axios';
export default class AIDiagProcess {
    constructor(diagData = []) {
        this.diagData = diagData; // Initialize diagData with the provided parameter or an empty array
        this.validationUrl = 'http://10.23.32.74:3000';
    }

    async getQueryResult() {
        // Iterate through the diagData array in reverse to find the last "query_result"
        for (let i = this.diagData.length - 1; i >= 0; i--) {
            const aiProcessData = this.diagData[i]?.aiProcessData;
            if (aiProcessData && aiProcessData.events) {
                for (let event of aiProcessData.events) {
                    if (event['query_result']) {
                        console.log(`\n ********* Query Cube Extract (First 10 rows) ********* \n`);
                        const lines = event['query_result'].trim().split('\n');

                        // Extract header and rows
                        const header = lines[0]; // Header line
                        const separator = lines[1]; // Separator line

                        // Determine the number of data rows available
                        const numberOfRows = Math.min(lines.length - 2, 10);

                        // Slice the lines to get the first 10 or fewer data rows
                        const dataRows = lines.slice(2, 2 + numberOfRows);

                        // Print the header, separator, and the available data rows
                        console.log(header);
                        console.log(separator);
                        dataRows.forEach((row) => console.log(row));
                        return event['query_result'];
                    }
                }
            }
        }
        return null; // Return null if no "query_result" is found
    }

    async getLLMSQL() {
        for (let i = this.diagData.length - 1; i >= 0; i--) {
            const aiProcessData = this.diagData[i]?.aiProcessData;
            if (aiProcessData && aiProcessData.events && aiProcessData.event_name == 'pre-SQLer') {
                const presql = aiProcessData.events[0].response;
                const regex = /statement='([\s\S]+?)', explanation=/;
                const match = presql.match(regex);

                if (match && match[1]) {
                    const sqlStatement = match[1];
                    console.log(`\n ********* LLM SQL Extract ********* \n`);
                    console.log(`SQL: ${sqlStatement}\n`);
                    return sqlStatement;
                } else {
                    console.log('\n !!!!  LLM SQL statement not found. !!!! \n');
                }
            }
        }
        return null;
    }

    async ifVizGenerated() {
        let vizGenerated = false;
        for (let i = this.diagData.length - 1; i >= 0; i--) {
            const aiProcessData = this.diagData[i]?.aiProcessData;
            if (aiProcessData && aiProcessData.event_name === 'VizDetector' && aiProcessData.events) {
                for (const event of aiProcessData.events) {
                    if (event.response) {
                        // if response contains " needs_viz=True" then set vizGenerated to true
                        if (event.response.includes('needs_viz=True')) {
                            vizGenerated = true;
                            break; // Exit loop if viz is generated
                        }
                    }
                }
            }
        }
        console.log(`Display Viz: ${vizGenerated}\n`);
        return vizGenerated; // Return the result
    }

    async extractSpeakerAnswer() {
        for (const item of this.diagData) {
            const aiProcessData = item?.aiProcessData;
            if (aiProcessData && aiProcessData.event_name === 'Speaker' && aiProcessData.events) {
                for (const event of aiProcessData.events) {
                    if (event.response) {
                        const match = event.response.match(/answer=(["'])(.*?)\1/);
                        if (match) {
                            console.log(`\n ********* Speak Result Extract ********* \n`);
                            console.log(`Speak: ${match[2]}\n`);
                            return match[2]; // Extract and return the answer
                        }
                    }
                }
            }
        }

        return null;
    }

    async validate_data_on_requirement(requirement, summary, data = null) {
        const url = `${this.validationUrl}/compare-similarity-ChatGPT`;
        const headers = {
            Accept: '*/*',
            'Content-Type': 'application/json',
        };
        if (data == null) {
            data = summary;
        } else {
            data = `${summary} with detailed ${data}`;
        }
        const body = {
            baseline: requirement,
            output: data,
        };
        let validateresult = 0;
        try {
            const response = await axios.post(url, body, { headers });
            if (response.status === 200) {
                const responseJson = response.data;
                validateresult = responseJson.result;
            } else {
                console.error(`Validation API returned error: ${response.status}`);
            }
        } catch (error) {
            console.error('Error during validation:', error);
        }
        console.log(`result validation for requirement ${requirement} is ${validateresult} `);
        assert.equal(validateresult, 1, `Validation failed: ${requirement} is not similar to ${summary}`);
    }

    async validate_content_in_dashboard_action(diagData, content = []) {
        // Step 1: Collect all request_payloads from update_dashboard events
        const payloads = [];
        for (let i = diagData.length - 1; i >= 0; i--) {
            const aiProcessData = diagData[i]?.aiProcessData;
            if (aiProcessData && aiProcessData.events && aiProcessData.event_name === 'update_dashboard') {
                for (const event of aiProcessData.events) {
                    if (event.request_payload) {
                        payloads.push(event.request_payload);
                    }
                }
            }
        }

        // Step 2: For each item, check if it exists in any payload
        for (const item of content) {
            const found = payloads.some((payload) => payload.includes(item));
            if (!found) {
                assert.fail(`Content item "${item}" not found in any update_dashboard event payload`);
            }
        }
    }
}
