export default async function customizeUrl(url, customizeParam) {
    let customUrl = url;
    let customParams = [];
    customizeParam.split('&').forEach(async (param) => {
        param = param.split('=');
        let paramName = param[0];
        let paramValue = param[1];
        if (!paramValue.includes('{')) {
            customParams.push(`${paramName}=${paramValue}`);
        } else {
            customParams.push(`${paramName}=${encodeURIComponent(paramValue)}`);
        }
    });
    customUrl = `${customUrl}?${customParams.shift()}`;
    while (customParams.length !== 0) {
        customUrl = `${customUrl}&${customParams.shift()}`;
    }
    return customUrl;
}
