/**
 * Mailpit API utility functions
 */

/**
 * Search for emails in Mailpit and return the first result
 * @param {string} searchText - The text to search for in emails
 * @returns {Promise<Object|null>} - Returns the first email result or null if none found
 */
const mailpitURL = 'http://10.23.33.67:8025/api/v1';

async function searchFirstEmail(searchText) {
    try {
        const url = `${mailpitURL}/search?query=${encodeURIComponent(searchText)}&limit=50`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json, text/plain, */*',
                'Accept-Language': 'en,zh-CN;q=0.9,zh;q=0.8',
                Connection: 'keep-alive',
                Cookie: 'locale=en-US',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Return the first message if available
        if (data.messages && data.messages.length > 0) {
            return data.messages[0];
        }

        return null;
    } catch (error) {
        console.error('Error searching emails:', error);
        throw error;
    }
}

async function fetchEmailContentAPI(id) {
    try {
        const url = `${mailpitURL}/message/${id}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json, text/plain, */*',
                'Accept-Language': 'en,zh-CN;q=0.9,zh;q=0.8',
                Connection: 'keep-alive',
                Cookie: 'locale=en-US',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching email content:', error);
        throw error;
    }
}

async function getEmailContent(searchText) {
    if (!searchText || typeof searchText !== 'string') {
        throw new Error('searchText is required and must be a string');
    }
    const searchedEmail = await searchFirstEmail(searchText);
    if (searchedEmail) {
        const id = searchedEmail.ID;
        const emailContent = await fetchEmailContentAPI(id);
        return emailContent;
    } else {
        throw new Error(`No email found for search text: ${searchText}`);
    }
}

function extractViewInBrowserLink(data) {
    if (data && data.Text) {
        // First try HTML format (for backwards compatibility)
        const htmlMatch = data.Text.match(/<a href="([^"]+)"[^>]*>View in Browser<\/a>/);
        if (htmlMatch && htmlMatch[1]) {
            return htmlMatch[1];
        }

        // Try plain text format: View in Browser ( url )
        const textMatch = data.Text.match(/View in Browser\s*\(\s*([^)]+)\s*\)/);
        if (textMatch && textMatch[1]) {
            return textMatch[1].trim();
        }

        throw new Error('No "View in Browser" link found');
    } else {
        throw new Error('Invalid email data');
    }
}

/**
 * Generate current timestamp in UTC format
 * @returns {string} - Returns current timestamp in UTC format like "2025-08-26T05:09:16Z"
 */
export function getCurrentUTCTimestamp() {
    const now = new Date();
    return now.toISOString();
}

/**
 * Filter email content to only include emails newer than the specified UTC time
 * @param {Object} emailContent - The email content object returned by getEmailContent
 * @param {string} utcTime - The UTC time string to filter by (e.g., "2025-08-26T05:09:16Z")
 * @returns {boolean} - Returns true if the email is newer than the specified time, false otherwise
 */
function isEmailNewerThan(emailContent, utcTime) {
    if (!emailContent || !emailContent.Date) {
        throw new Error('Invalid email content - missing Date field');
    }

    if (!utcTime || typeof utcTime !== 'string') {
        throw new Error('utcTime is required and must be a string');
    }

    try {
        const emailDate = new Date(emailContent.Date);
        const filterDate = new Date(utcTime);

        if (isNaN(emailDate.getTime()) || isNaN(filterDate.getTime())) {
            throw new Error('Invalid date format');
        }

        return emailDate > filterDate;
    } catch (error) {
        console.error('Error comparing dates:', error);
        throw new Error(`Failed to compare dates: ${error.message}`);
    }
}

/**
 * Get email content that is newer than the specified UTC time
 * @param {string} searchText - The text to search for in emails
 * @param {string} utcTime - The UTC time string to filter by (e.g., "2025-08-26T05:09:16Z")
 * @returns {Promise<Object|null>} - Returns the email content if it's newer than the specified time, null otherwise
 */
async function getEmailContentNewerThan(searchText, utcTime) {
    if (!searchText || typeof searchText !== 'string') {
        throw new Error('searchText is required and must be a string');
    }

    if (!utcTime || typeof utcTime !== 'string') {
        throw new Error('utcTime is required and must be a string');
    }

    const maxRetries = 6;
    const sleepTime = 30000; // 30 seconds in milliseconds

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`Attempt ${attempt}/${maxRetries}: Searching for email newer than ${utcTime}`);
            const emailContent = await getEmailContent(searchText);

            if (emailContent && isEmailNewerThan(emailContent, utcTime)) {
                console.log(`Success on attempt ${attempt}: Found email newer than specified time`);
                return emailContent;
            }

            if (attempt < maxRetries) {
                console.log(
                    `Attempt ${attempt} failed: Email not newer than specified time. Waiting 30 seconds before retry...`
                );
                await new Promise((resolve) => setTimeout(resolve, sleepTime));
            }
        } catch (error) {
            if (error.message.includes('No email found for search text')) {
                if (attempt < maxRetries) {
                    console.log(`Attempt ${attempt} failed: No email found. Waiting 30 seconds before retry...`);
                    await new Promise((resolve) => setTimeout(resolve, sleepTime));
                    continue;
                }
                return null;
            }
            throw error;
        }
    }

    console.log(`All ${maxRetries} attempts failed: No email newer than ${utcTime} found`);
    return null;
}

export async function openViewInBrowserLink(searchText, utcTime) {
    if (!searchText || typeof searchText !== 'string') {
        throw new Error('searchText is required and must be a string');
    }

    const searchedEmail = await getEmailContentNewerThan(searchText, utcTime);
    if (!searchedEmail) {
        throw new Error(`No email found for search text: ${searchText}`);
    }

    const link = extractViewInBrowserLink(searchedEmail);
    if (!link) {
        throw new Error('No "View in Browser" link found in email');
    }

    console.log('Opening link:', link);
    await browser.url(link);
}
