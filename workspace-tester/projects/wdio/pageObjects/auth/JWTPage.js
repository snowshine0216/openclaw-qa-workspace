// pages/jwtPage.js
import BasePage from '../base/BasePage.js';
import { getJWTConfig, setJWTConfig, getSession } from '../../api/jwt/JWTRest.js';
import { generateJWTToken } from '../../api/jwt/JWTGenerator.js';
import request from 'request';

export default class JwtPage extends BasePage {
    createJWTPayload(overrides = {}, trustedId = 'mob') {
        const timestamp = Math.floor(Date.now() / 1000);
        return {
            iss: 'MicroStrategy',
            sub: 'testuser',
            aud: 'MyApp',
            iat: timestamp,
            exp: timestamp + 1800,
            userName: trustedId,
            fullname: 'Administrator User',
            email: 'admin@microstrategy.com',
            groups: ['admin', 'users'],
            ...overrides,
        };
    }

    createJWTConfig(algorithm, publicKeyOrSecret, overrides = {}) {
        const baseConfig = {
            issuer: 'MicroStrategy',
            audience: 'MyApp',
            claimMap: {
                userId: 'userName',
                fullname: 'fullname',
                email: 'email',
                groups: 'groups',
                language: 'preferred_language',
            },
            keySource: 'local',
            keys: [
                {
                    algorithm,
                    value: publicKeyOrSecret,
                },
            ],
        };
        return { ...baseConfig, ...overrides };
    }

    ensureSession(userCredentials) {
        if (!this.session || !this.session.cookie) {
            this.session = getSession(userCredentials);
        }
        return this.session;
    }

    async testJWTConfigSetup(userCredentials, baseUrl, algorithm, customPayload = {}, customConfig = {}) {
        const session = await this.ensureSession(userCredentials);

        const jwtPayload = await this.createJWTPayload(customPayload);
        const generatedJWT = generateJWTToken(algorithm, { alg: algorithm, typ: 'JWT' }, jwtPayload);
        const keyValue = generatedJWT.publicKey || generatedJWT.secret;
        const jwtConfig = await this.createJWTConfig(algorithm, keyValue, customConfig);

        const setResponse = await setJWTConfig({ baseUrl, session, jwtConfig });
        console.log('Set JWT config response:', setResponse);
        if (setResponse.statusCode !== 200) {
            throw new Error(`setJWTConfig failed with status ${setResponse.statusCode}`);
        }

        const verifyResponse = await getJWTConfig({ baseUrl, session });
        const verifyConfig = typeof verifyResponse === 'string' ? JSON.parse(verifyResponse) : verifyResponse;

        if (verifyConfig.keys[0].algorithm !== algorithm) {
            throw new Error(`Expected algorithm ${algorithm}, but got ${verifyConfig.keys[0].algorithm}`);
        }
        return { generatedJWT, jwtConfig };
    }

    async testJWTLogin(baseUrl, jwtToken, algorithm) {
        const loginRequest = {
            loginMode: 67108864,
            userName: '',
            password: jwtToken,
        };

        const loginResponse = await new Promise((resolve, reject) => {
            const options = {
                url: `${baseUrl}/api/auth/login`,
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                json: loginRequest,
                timeout: 30000,
            };
            request(options, (error, response, body) => {
                if (error) reject(error);
                else resolve({ statusCode: response.statusCode, headers: response.headers, body });
            });
        });

        if (loginResponse.statusCode !== 204) {
            throw new Error(`JWT login failed: Expected 204 but got ${loginResponse.statusCode}`);
        }

        console.log(`✅ JWT login successful with ${algorithm}`);
        return loginResponse;
    }
}
