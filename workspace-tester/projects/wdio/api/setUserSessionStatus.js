export default async function setUserSessionStatus(status) {
    const sessionMock = await browser.mock('**/api/sessions/lifetime');
    sessionMock.respond(async ({ body }) => {
        // Parse the original response if it's a string, or use directly if it's an object
        const originalResponse = typeof body === 'string' ? JSON.parse(body) : body;
        
        // Modify the lifetime value to -1
        if (status === 'expire') {
            originalResponse.lifetime = -1;
        }

        if (status === 'reminder') {
            originalResponse.lifetime = 10; // Set to 10 seconds for reminder
        }
        const modifiedResponse = {
            ...originalResponse,
            lifetime: originalResponse.lifetime, // Ensure the lifetime is set correctly
        };
        
        return modifiedResponse;
    });
}
