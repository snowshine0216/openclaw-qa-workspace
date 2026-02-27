// test/specs/jwtRestApi.e2e.js
import { getSession } from '../../../../api/jwt/JWTRest.js';
import { takeScreenshot } from '../../../../utils/TakeScreenshot.js';
//npm run regression -- --baseUrl=https://mci-jlonq-dev.hypernow.microstrategy.com/MicroStrategyLibrary --spec=specs/regression/authentication/jwt/JWTSecurityFilterE2E.spec.js --params.credentials.username=jwtadmin --params.credentials.password="" --trustedId=jwtuser --loginType=custom
describe('JWT Security filter E2E Tests', () => {
    const mstrUser = {
        username: browser.options.params.credentials.username,
        password: browser.options.params.credentials.password,
    };
    let session;
    const baseUrl = browser.options.baseUrl;
    let { jwtPage, libraryPage, dossierPage } = browsers.pageObj1;
    let currentJWTToken = null;
    const customPayload = {
        iss: 'zebra',
        sub: 'olaf',
        aud: 'library',
        userName: 'Aaby',
        ship_date: '2023-05-01',
        email: 'aaby@example.com',
        group: 'users',
        fullname: 'Aaby Fullname',
    };
    const customPayload2 = {
        iss: 'zebra',
        sub: 'olaf',
        aud: 'library',
        userName: 'Ash',
        ship_date: '2025-01-01',
        email: 'ash@example.com',
        group: 'users',
        fullname: 'Ash Fullname',
    };
    const customPayload_noData = {
        iss: 'zebra',
        sub: 'olaf',
        aud: 'library',
        userName: 'Aaaaa',
        ship_date: '2023-01-01',
        email: 'aaaaa@example.com',
        group: 'users',
        fullname: 'Aaaaa Fullname',
    };
    const customConfig = {
        issuer: 'zebra',
        audience: 'library',
        systemPromptMap: {},
        securityFilters: {
            B7CA92F04B9FAE8D941C3E9B7E0CD754: {
                qualification: {
                    tree: {
                        type: 'predicate_form_qualification',
                        predicateTree: {
                            function: 'equals',
                            parameters: [
                                {
                                    parameterType: 'placeholder',
                                    placeholder: {
                                        name: 'userName',
                                        type: 'string',
                                        multiValued: false,
                                        optional: false,
                                    },
                                },
                            ],
                            attribute: {
                                objectId: '8D679D3C11D3E4981000E787EC6DE8A4',
                                subType: 'attribute',
                                name: 'Customer',
                            },
                            form: {
                                objectId: '8D67A35B11D3E4981000E787EC6DE8A4',
                                subType: 'attribute_form_system',
                                name: 'Last Name',
                            },
                            dataLocale: 'en-US',
                        },
                    },
                },
            },
        },
    };

    const customConfig_error = {
        issuer: 'zebra',
        audience: 'library',
        systemPromptMap: {},
        securityFilters: {
            B7CA92F04B9FAE8D941C3E9B7E0CD754: {
                qualification: {
                    tree: {
                        type: 'predicate_form_qualification',
                        predicateTree: {
                            function: 'equals',
                            parameters: [
                                {
                                    parameterType: 'placeholder',
                                    placeholder: {
                                        name: 'userName',
                                        type: 'string',
                                        multiValued: false,
                                        optional: false,
                                    },
                                },
                            ],
                            attribute: {
                                objectId: '8D671a3C11D3E4981000E787EC6DE8A4',
                                subType: 'attribute',
                                name: 'Customer',
                            },
                            form: {
                                objectId: '8D67A35B11D3E4981000E787EC6DE8A4',
                                subType: 'attribute_form_system',
                                name: 'Last Name',
                            },
                            dataLocale: 'en-US',
                        },
                    },
                },
            },
        },
    };

    const customConfig_date = {
        issuer: 'zebra',
        audience: 'library',
        systemPromptMap: {},
        securityFilters: {
            B7CA92F04B9FAE8D941C3E9B7E0CD754: {
                qualification: {
                    tree: {
                        type: 'operator',
                        function: 'and',
                        children: [
                            {
                                type: 'predicate_form_qualification',
                                predicateTree: {
                                    function: 'equals',
                                    parameters: [
                                        {
                                            parameterType: 'placeholder',
                                            placeholder: {
                                                name: 'userName',
                                                type: 'string',
                                                multiValued: false,
                                                optional: false,
                                            },
                                        },
                                    ],
                                    attribute: {
                                        objectId: '8D679D3C11D3E4981000E787EC6DE8A4',
                                        subType: 'attribute',
                                        name: 'Customer',
                                    },
                                    form: {
                                        objectId: '8D67A35B11D3E4981000E787EC6DE8A4',
                                        subType: 'attribute_form_system',
                                        name: 'Last Name',
                                    },
                                    dataLocale: 'en-US',
                                },
                            },
                            {
                                type: 'predicate_form_qualification',
                                predicateTree: {
                                    function: 'between',
                                    parameters: [
                                        {
                                            parameterType: 'placeholder',
                                            placeholder: {
                                                name: 'ship_date',
                                                type: 'date',
                                                multiValued: false,
                                                optional: false,
                                            },
                                        },
                                        {
                                            parameterType: 'constant',
                                            constant: {
                                                type: 'date',
                                                value: '2023-05-10',
                                            },
                                        },
                                    ],
                                    attribute: {
                                        objectId: '96ED3EC811D5B117C000E78A4CC5F24F',
                                        subType: 'attribute',
                                        name: 'Customer',
                                    },
                                    form: {
                                        objectId: '45C11FA478E745FEA08D781CEA190FE5',
                                        subType: 'attribute_form_system',
                                        name: 'ID',
                                    },
                                    dataLocale: 'en-US',
                                },
                            },
                        ],
                    },
                },
            },
        },
    };

    const customConfig_multiProjects = {
        issuer: 'zebra',
        audience: 'library',
        systemPromptMap: {},
        securityFilters: {
            B7CA92F04B9FAE8D941C3E9B7E0CD754: {
                qualification: {
                    tree: {
                        type: 'predicate_form_qualification',
                        predicateTree: {
                            function: 'equals',
                            parameters: [
                                {
                                    parameterType: 'placeholder',
                                    placeholder: {
                                        name: 'userName',
                                        type: 'string',
                                        multiValued: false,
                                        optional: false,
                                    },
                                },
                            ],
                            attribute: {
                                objectId: '8D679D3C11D3E4981000E787EC6DE8A4',
                                subType: 'attribute',
                                name: 'Customer',
                            },
                            form: {
                                objectId: '8D67A35B11D3E4981000E787EC6DE8A4',
                                subType: 'attribute_form_system',
                                name: 'Last Name',
                            },
                            dataLocale: 'en-US',
                        },
                    },
                },
            },
            '61ABA574CA453CCCF398879AFE2E825F': {
                qualification: {
                    tree: {
                        type: 'predicate_form_qualification',
                        predicateTree: {
                            function: 'contains',
                            parameters: [
                                {
                                    parameterType: 'constant',
                                    constant: {
                                        type: 'string',
                                        value: 'Admin',
                                    },
                                },
                            ],
                            attribute: {
                                objectId: 'E99973D345C8A4DEE7876DA40ED42ACE',
                                subType: 'attribute',
                                name: 'User',
                            },
                            form: {
                                objectId: 'CCFBE2A5EADB4F50941FB879CCF1721C',
                                subType: 'attribute_form_system',
                                name: 'Name',
                            },
                            dataLocale: 'en-US',
                        },
                    },
                },
            },
        },
    };

    const customConfig_invalid = {
        issuer: 'zebra',
        audience: 'library',
        systemPromptMap: {},
        securityFilters: {
            B7CA92F04B9FAE8D941C3E9B7E0CD754: {
                qualification: {
                    tree: {
                        type: 'predicate_form_qualification',
                        predicateTree: {
                            function: 'equals',
                            parameters: [
                                {
                                    parameterType: 'placeholder',
                                    placeholder: {
                                        name: 'userName',
                                        type: 'string',
                                        multiValued: false,
                                        optional: false,
                                    },
                                },
                            ],
                            attribute: {
                                objectId: '8D679D3C11D3E4981000E787EC6DE8A4',
                                subType: 'attribute',
                                name: 'Customer',
                            },
                            form: {
                                objectId: '8D67A35B11D3E4981000E787EC6DE8A4',
                                subType: 'attribute_form_system',
                                name: 'Last Name',
                            },
                            dataLocale: 'en-US',
                        },
                    },
                },
            },
            '61ABA574CA453CCCF398879AFE2E878J': {
                qualification: {
                    tree: {
                        type: 'predicate_form_qualification',
                        predicateTree: {
                            function: 'contains',
                            parameters: [
                                {
                                    parameterType: 'constant',
                                    constant: {
                                        type: 'string',
                                        value: 'Admin',
                                    },
                                },
                            ],
                            attribute: {
                                objectId: 'E99973D345C8A4DEE7876DA40ED42ACE',
                                subType: 'attribute',
                                name: 'User',
                            },
                            form: {
                                objectId: 'CCFBE2A5EADB4F50941FB879CCF1721C',
                                subType: 'attribute_form_system',
                                name: 'Name',
                            },
                            dataLocale: 'en-US',
                        },
                    },
                },
            },
        },
    };

    beforeAll(async () => {
        console.log('JWT test setup started');
    });

    it('[BCSA-2843_01] set JWT security filter template and open report', async () => {
        if (!session) {
            console.log('Creating new session for JWT configuration set test...');
            session = await getSession(mstrUser);
        }
        console.log('customPayload:', customPayload);
        const result = await jwtPage.testJWTConfigSetup(mstrUser, baseUrl, 'RS256', customPayload, customConfig);
        currentJWTToken = result.generatedJWT;
        await jwtPage.testJWTLogin(baseUrl, currentJWTToken.token, 'RS256');
        const loginJson = {
            loginMode: 67108864,
            applicationType: 0,
            password: currentJWTToken.token,
        };
        const jsonStr = JSON.stringify(loginJson);
        const base64Str = Buffer.from(jsonStr).toString('base64');
        const urlEncoded = encodeURIComponent(base64Str);
        const loginUrl = `${baseUrl}/app/B7CA92F04B9FAE8D941C3E9B7E0CD754/BCD27BA5F2464C4D15D383AD12290D51?sessionMode=stateless&redirect=false&token=${urlEncoded}`;
        console.log('Login URL:', loginUrl);
        await browser.newWindow(loginUrl);
        await libraryPage.waitForLibraryLoading();
        await dossierPage.waitForDossierLoading();
        await takeScreenshot('BCSA-2843_01', 'Open dashboard with RS256 JWT system prompt mapping - Aaby');
    });
    it('[BCSA-2843_02] set JWT security filter template and open report - change user', async () => {
        if (!session) {
            console.log('Creating new session for JWT configuration set test...');
            session = await getSession(mstrUser);
        }
        console.log('customPayload:', customPayload2);
        const result = await jwtPage.testJWTConfigSetup(mstrUser, baseUrl, 'RS256', customPayload2, customConfig);
        currentJWTToken = result.generatedJWT;
        await jwtPage.testJWTLogin(baseUrl, currentJWTToken.token, 'RS256');
        const loginJson = {
            loginMode: 67108864,
            applicationType: 0,
            password: currentJWTToken.token,
        };
        const jsonStr = JSON.stringify(loginJson);
        const base64Str = Buffer.from(jsonStr).toString('base64');
        const urlEncoded = encodeURIComponent(base64Str);
        const loginUrl2 = `${baseUrl}/app/B7CA92F04B9FAE8D941C3E9B7E0CD754/BCD27BA5F2464C4D15D383AD12290D51?sessionMode=stateless&redirect=false&token=${urlEncoded}`;
        console.log('Login URL:', loginUrl2);
        await browser.newWindow(loginUrl2);
        await libraryPage.waitForLibraryLoading();
        await dossierPage.waitForDossierLoading();
        await takeScreenshot('BCSA-2843_02', 'different user - Ash');
    });
    it('[BCSA-2843_03] set JWT security filter template and open report - user Not exist no data return', async () => {
        if (!session) {
            console.log('Creating new session for JWT configuration set test...');
            session = await getSession(mstrUser);
        }
        console.log('customPayload:', customPayload_noData);
        const result = await jwtPage.testJWTConfigSetup(mstrUser, baseUrl, 'RS256', customPayload_noData, customConfig);
        currentJWTToken = result.generatedJWT;
        await jwtPage.testJWTLogin(baseUrl, currentJWTToken.token, 'RS256');
        const loginJson = {
            loginMode: 67108864,
            applicationType: 0,
            password: currentJWTToken.token,
        };
        const jsonStr = JSON.stringify(loginJson);
        const base64Str = Buffer.from(jsonStr).toString('base64');
        const urlEncoded = encodeURIComponent(base64Str);
        const loginUrl_noData = `${baseUrl}/app/B7CA92F04B9FAE8D941C3E9B7E0CD754/BCD27BA5F2464C4D15D383AD12290D51?sessionMode=stateless&redirect=false&token=${urlEncoded}`;
        console.log('Login URL:', loginUrl_noData);
        await browser.newWindow(loginUrl_noData);
        await browser.pause(5000);
        await libraryPage.waitForLibraryLoading();
        await dossierPage.waitForDossierLoading();
        await takeScreenshot('BCSA-2843_03', 'different user - Aaaaa - no data return');
    });
    it('[BCSA-2843_04] set JWT security filter template and open report - filter by date', async () => {
        if (!session) {
            console.log('Creating new session for JWT configuration set test...');
            session = await getSession(mstrUser);
        }
        console.log('customPayload:', customPayload);
        const result = await jwtPage.testJWTConfigSetup(mstrUser, baseUrl, 'PS384', customPayload, customConfig_date);
        currentJWTToken = result.generatedJWT;
        await jwtPage.testJWTLogin(baseUrl, currentJWTToken.token, 'PS384');
        const loginJson = {
            loginMode: 67108864,
            applicationType: 0,
            password: currentJWTToken.token,
        };
        const jsonStr = JSON.stringify(loginJson);
        const base64Str = Buffer.from(jsonStr).toString('base64');
        const urlEncoded = encodeURIComponent(base64Str);
        const loginUrl_date = `${baseUrl}/app/B7CA92F04B9FAE8D941C3E9B7E0CD754/65C820D3F143FD901694E5B7481E93D4?sessionMode=stateless&redirect=false&token=${urlEncoded}`;
        console.log('Login URL:', loginUrl_date);
        await browser.newWindow(loginUrl_date);
        await libraryPage.waitForLibraryLoading();
        await dossierPage.waitForDossierLoading();
        await takeScreenshot('BCSA-2843_04', 'date filter - ship_date greater than 2023-05-01');
    });
    it('[BCSA-2843_05] set JWT security filter template and open report - error configure Attribute', async () => {
        if (!session) {
            console.log('Creating new session for JWT configuration set test...');
            session = await getSession(mstrUser);
        }
        console.log('customPayload:', customPayload);
        const result = await jwtPage.testJWTConfigSetup(mstrUser, baseUrl, 'PS384', customPayload, customConfig_error);
        currentJWTToken = result.generatedJWT;
        const loginJson = {
            loginMode: 67108864,
            applicationType: 0,
            password: currentJWTToken.token,
        };
        const jsonStr = JSON.stringify(loginJson);
        const base64Str = Buffer.from(jsonStr).toString('base64');
        const urlEncoded = encodeURIComponent(base64Str);
        const loginUrl_error = `${baseUrl}/app?sessionMode=stateless&redirect=false&token=${urlEncoded}`;
        console.log('Login URL:', loginUrl_error);
        await browser.newWindow(loginUrl_error);
        await libraryPage.waitForLibraryLoading();
        await libraryPage.waitForLibraryLoading();
        await takeScreenshot('BCSA-2843_05', 'error configuring attribute');
    });
    it('[BCSA-2843_06] set JWT security filter template and open report - multi project', async () => {
        if (!session) {
            console.log('Creating new session for JWT configuration set test...');
            session = await getSession(mstrUser);
        }
        console.log('customPayload:', customPayload);
        const result = await jwtPage.testJWTConfigSetup(
            mstrUser,
            baseUrl,
            'ES512',
            customPayload,
            customConfig_multiProjects
        );
        currentJWTToken = result.generatedJWT;
        const loginJson = {
            loginMode: 67108864,
            applicationType: 0,
            password: currentJWTToken.token,
        };
        const jsonStr = JSON.stringify(loginJson);
        const base64Str = Buffer.from(jsonStr).toString('base64');
        const urlEncoded = encodeURIComponent(base64Str);
        const loginUrl_tutorial = `${baseUrl}/app/B7CA92F04B9FAE8D941C3E9B7E0CD754/BCD27BA5F2464C4D15D383AD12290D51?sessionMode=stateless&redirect=false&token=${urlEncoded}`;
        console.log('Login URL:', loginUrl_tutorial);
        await browser.newWindow(loginUrl_tutorial);
        await browser.pause(5000);
        await libraryPage.waitForLibraryLoading();
        await dossierPage.waitForDossierLoading();
        await takeScreenshot('BCSA-2843_06', 'multi project');
    });

    it('[BCSA-2843_07] set JWT security filter template and open report - multi project PA', async () => {
        if (!session) {
            console.log('Creating new session for JWT configuration set test...');
            session = await getSession(mstrUser);
        }
        console.log('customPayload:', customPayload);
        const result = await jwtPage.testJWTConfigSetup(
            mstrUser,
            baseUrl,
            'ES512',
            customPayload,
            customConfig_multiProjects
        );
        currentJWTToken = result.generatedJWT;
        const loginJson = {
            loginMode: 67108864,
            applicationType: 0,
            password: currentJWTToken.token,
        };
        const jsonStr = JSON.stringify(loginJson);
        const base64Str = Buffer.from(jsonStr).toString('base64');
        const urlEncoded = encodeURIComponent(base64Str);
        const loginUrl_pa = `${baseUrl}/app/61ABA574CA453CCCF398879AFE2E825F/1B32394BA243B20070DCEFAD00CB8C57?sessionMode=stateless&redirect=false&token=${urlEncoded}`;
        console.log('Login URL:', loginUrl_pa);
        await browser.newWindow(loginUrl_pa);
        await libraryPage.waitForLibraryLoading();
        await dossierPage.waitForDossierLoading();
        await takeScreenshot('BCSA-2843_07', 'multi project PA');
    });

    it('[BCSA-2843_08] set JWT security filter template and open report - include invalid/not exist project id', async () => {
        if (!session) {
            console.log('Creating new session for JWT configuration set test...');
            session = await getSession(mstrUser);
        }
        console.log('customPayload:', customPayload);
        const result = await jwtPage.testJWTConfigSetup(
            mstrUser,
            baseUrl,
            'ES512',
            customPayload,
            customConfig_invalid
        );
        currentJWTToken = result.generatedJWT;
        const loginJson = {
            loginMode: 67108864,
            applicationType: 0,
            password: currentJWTToken.token,
        };
        const jsonStr = JSON.stringify(loginJson);
        const base64Str = Buffer.from(jsonStr).toString('base64');
        const urlEncoded = encodeURIComponent(base64Str);
        const loginUrl_invalid = `${baseUrl}/app/B7CA92F04B9FAE8D941C3E9B7E0CD754/BCD27BA5F2464C4D15D383AD12290D51?sessionMode=stateless&redirect=false&token=${urlEncoded}`;
        console.log('Login URL:', loginUrl_invalid);
        await browser.newWindow(loginUrl_invalid);
        await browser.pause(5000);
        await libraryPage.waitForLibraryLoading();
        await dossierPage.waitForDossierLoading();
        await takeScreenshot('BCSA-2843_08', 'multi project include invalid/not exist project id');
    });
});
