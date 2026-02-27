/**
 * Description: Set wait timeout for mock request
 */
async function waitForRequest(mock, timeout = 5000, interval = 500) {
    const startTime = Date.now();

    while (mock.calls.length === 0) {
        if (Date.now() - startTime > timeout) {
            return; // quite when timeout
        }
        await browser.pause(interval);
    }
}

/**
 * Description: Get the payload history info for learning request. (only get question field, due to other fields are dynamically changed)
 * Parameter: triggerAction - executed steps that will trigger the learning request
 * Output example: [{"question":"what is the total flight cancelled"},{"question":"what is the top 3 flights"}]
 */
export async function getHistoryPayloadFromLearning(triggerAction) {
    const learningMock = await browser.mock('**/api/aiservice/chats/learnings');

    // trigger the action
    if (triggerAction && typeof triggerAction === 'function') {
        await triggerAction();
    }

    // wait for reuest to sent, max 5 seconds
    await waitForRequest(learningMock);

    if (learningMock.calls.length === 0) {
        throw new Error('No learning requests were captured. Please check!');
    }
    // get POST request data
    const postData = JSON.parse(learningMock.calls[0]?.postData);
    const historyData = postData?.history.map((element) => {
        let newElement = { ...element };
        // Remove the id, answer, nuggets field
        delete newElement.id;
        delete newElement.answer;
        delete newElement.nuggetsCollections;
        return newElement;
    });
    console.log('history payload:', historyData);

    return historyData;
}
