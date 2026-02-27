import path from 'path';

export const downloadDirectory = (() => path.join(process.cwd(), 'downloads'))();

// User credentials
export const noExportPrivCredentials = {
    credentials: {
        username: 'noExportPriv',
        password: '',
    },
};

// designer account to publish dossiers to test users
export const designerCredentials = {
    username: 'designer1',
    password: '',
};

export const designer2Credentials = {
    username: 'jijin',
    password: '',
};

export const customCredentials = (customSuffix, pwd) => {
    try {
        return {
            credentials: {
                username: `${browsers.params.credentials.username}${customSuffix}`,
                password: pwd ? pwd : '',
            },
        };
    } catch (err) {
        throw new Error(`customCredentials(): Tester account credentials are required.`, err);
    }
};

export const lockPageSizeCredentials = {
    username: 'autolockpagesize',
    password: '',
};

export const dashboardsAutoCredentials = {
    username: 'Autopara',
    password: '',
};

export const noExecuteCredentials = {
    username: 'AutoNoExecute',
    password: '',
};

export const browserWindow = {
    width: 1600,
    height: 1200,
};

export const browserWindowTallHeight = {
    width: 1600,
    height: 1600,
};

export const aibotTestLinkCollapsedWindow = {
    width: 1000,
    height: 1200,
};

export const mobileWindow = {
    width: 360,
    height: 640,
};

export const aibotMinimumWindow = {
    width: 500,
    height: 1200,
};

export const aibotMediumWindow = {
    width: 650,
    height: 1200,
};

export const browserWindowCustom = {
    width: 1600,
    height: 1100,
};

export const aibot620pxWindow = {
    width: 620,
    height: 1100,
};

export const aibotZoomInWindow = {
    width: 500,
    height: 550,
};

export const aibot599pxWindow = {
    width: 599,
    height: 1100,
};

export const aibot600pxWindow = {
    width: 600,
    height: 1100,
};

export const autoDashBrowserWindow = {
    width: 2000,
    height: 1200,
};

export const ShadowProperty = Object.freeze({
    Fill: 'Fill',
    Blur: 'Blur',
    Distance: 'Distance',
    Angle: 'Angle',
});
