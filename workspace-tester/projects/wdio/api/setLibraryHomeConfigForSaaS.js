export default async function setLibraryHomeConfigForSaaS({
    day = 0,
    hour = 0,
    minute = 0,
    second = 0,
    isUpgradeClicked = false,
}) {
    const htmlMock = await browser.mock('**' + '/MicroStrategyLibrary/app');
    htmlMock.respond(async ({ body: rawDocumentResponse }) => {
        const newLocal = rawDocumentResponse
            .replace(
                /saasUserTrialEndDate: \w+/g,
                `saasUserTrialEndDate: ${
                    Date.now() + day * 24 * 60 * 60 * 1000 + hour * 60 * 60 * 1000 + minute * 60 * 1000 + second * 1000
                } `
            )
            .replace(/saasUserUpgradeClicked: \w+/g, `saasUserUpgradeClicked: ${isUpgradeClicked}`);
        return newLocal;
    });
}
