export default async function detectBlob(executeManipulation) {
    // Modify URL.createObjectURL to capture the blob
    await browser.execute(() => {
        const originalCreateObjectURL = URL.createObjectURL;
        URL.createObjectURL = (blob) => {
            window.downloadedBlob = blob;
            return blob;
        };

        // Define a function to restore the original URL.createObjectURL
        window.restoreCreateObjectURL = () => {
            URL.createObjectURL = originalCreateObjectURL;
        };
    });

    // Execute the provided manipulation function
    await executeManipulation();

    // Retrieve the blob and restore the original URL.createObjectURL
    const blob = await browser.execute(() => {
        const blob = window.downloadedBlob;
        window.downloadedBlob = null;
        window.restoreCreateObjectURL();
        return blob;
    });

    return blob;
}
