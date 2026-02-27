import crypto from 'crypto';
import { Buffer } from 'buffer';

// --- Helpers for ECDSA (ES256/ES384/ES512) JWS signature encoding ---
// JWS requires ECDSA signatures to be JOSE format: r||s fixed length (no DER)
// Node.js crypto.sign/verify uses DER. Convert between DER <-> JOSE.

function byteLenForAlg(algorithm) {
    // P-256: 32 bytes, P-384: 48 bytes, P-521: 66 bytes
    if (algorithm === 'ES256') return 32;
    if (algorithm === 'ES384') return 48;
    if (algorithm === 'ES512') return 66;
    // default to P-256 size
    return 32;
}

function trimLeadingZeros(buf) {
    let i = 0;
    while (i < buf.length - 1 && buf[i] === 0x00) i++;
    return i === 0 ? buf : buf.slice(i);
}

function derToJose(derSig, algorithm) {
    const size = byteLenForAlg(algorithm);
    let offset = 0;
    if (derSig[offset++] !== 0x30) throw new Error('Invalid DER ECDSA signature: expected sequence');
    let seqLen = derSig[offset++];
    if (seqLen & 0x80) {
        const numBytes = seqLen & 0x7f;
        seqLen = 0;
        for (let i = 0; i < numBytes; i++) seqLen = (seqLen << 8) | derSig[offset++];
    }
    if (derSig[offset++] !== 0x02) throw new Error('Invalid DER ECDSA signature: expected integer for r');
    let rLen = derSig[offset++];
    let r = derSig.slice(offset, offset + rLen);
    offset += rLen;
    if (derSig[offset++] !== 0x02) throw new Error('Invalid DER ECDSA signature: expected integer for s');
    let sLen = derSig[offset++];
    let s = derSig.slice(offset, offset + sLen);
    // Trim leading zeroes and then left-pad to fixed size
    r = trimLeadingZeros(r);
    s = trimLeadingZeros(s);
    if (r.length > size || s.length > size) throw new Error('Invalid r or s length for algorithm');
    const rPadded = Buffer.concat([Buffer.alloc(size - r.length, 0), r]);
    const sPadded = Buffer.concat([Buffer.alloc(size - s.length, 0), s]);
    return Buffer.concat([rPadded, sPadded]);
}

function joseToDer(joseSig, algorithm) {
    const size = byteLenForAlg(algorithm);
    if (joseSig.length !== size * 2) throw new Error('Invalid JOSE ECDSA signature length');
    let r = joseSig.slice(0, size);
    let s = joseSig.slice(size);
    r = trimLeadingZeros(r);
    s = trimLeadingZeros(s);
    // If high bit set, prepend 0x00 to keep INTEGER positive
    if (r[0] & 0x80) r = Buffer.concat([Buffer.from([0x00]), r]);
    if (s[0] & 0x80) s = Buffer.concat([Buffer.from([0x00]), s]);
    const rLen = r.length;
    const sLen = s.length;
    const total = 2 + rLen + 2 + sLen; // (0x02 rLen r) (0x02 sLen s)
    const lenBytes = [];
    if (total >= 128) {
        // long form length
        let tmp = total;
        const stack = [];
        while (tmp > 0) {
            stack.unshift(tmp & 0xff);
            tmp >>= 8;
        }
        lenBytes.push(0x80 | stack.length, ...stack);
    } else {
        lenBytes.push(total);
    }
    return Buffer.from([0x30, ...lenBytes, 0x02, rLen, ...r, 0x02, sLen, ...s]);
}

/**
 * Generate RSA key pair for JWT signing
 * @param {number} keySize - Key size in bits (2048, 3072, or 4096)
 * @returns {Object} - Object containing privateKey and publicKey
 */
function generateRSAKeyPair(keySize = 2048) {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: keySize,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem',
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
        },
    });

    return { privateKey, publicKey };
}

/**
 * Generate ECDSA key pair for JWT signing
 * @param {string} curve - Curve name (prime256v1 for ES256, secp384r1 for ES384, secp521r1 for ES512)
 * @returns {Object} - Object containing privateKey and publicKey
 */
function generateECDSAKeyPair(curve = 'prime256v1') {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('ec', {
        namedCurve: curve,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem',
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
        },
    });

    return { privateKey, publicKey };
}

/**
 * Base64 URL encode function
 * @param {string} str - String to encode
 * @returns {string} - Base64 URL encoded string
 */
function base64urlEncode(str) {
    return Buffer.from(str).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Get hash algorithm for JWT algorithms
 * @param {string} algorithm - JWT algorithm (RS256, RS384, RS512, PS256, PS384, PS512, ES256, ES384, ES512, HS256, HS384, HS512)
 * @returns {string} - Node.js hash algorithm
 */
function getHashAlgorithm(algorithm) {
    const algorithmMap = {
        RS256: 'sha256',
        RS384: 'sha384',
        RS512: 'sha512',
        PS256: 'sha256',
        PS384: 'sha384',
        PS512: 'sha512',
        ES256: 'sha256',
        ES384: 'sha384',
        ES512: 'sha512',
        HS256: 'sha256',
        HS384: 'sha384',
        HS512: 'sha512',
    };
    return algorithmMap[algorithm] || 'sha256';
}

/**
 * Get curve for ECDSA algorithms
 * @param {string} algorithm - ECDSA algorithm (ES256, ES384, ES512)
 * @returns {string} - Curve name
 */
function getCurveForAlgorithm(algorithm) {
    const curveMap = {
        ES256: 'prime256v1',
        ES384: 'secp384r1',
        ES512: 'secp521r1',
    };
    return curveMap[algorithm] || 'prime256v1';
}

/**
 * Generate JWT token with various signature algorithms
 * @param {string} algorithm - Algorithm to use (RS256, RS384, RS512, PS256, PS384, PS512, ES256, ES384, ES512, HS256, HS384, HS512)
 * @param {Object} header - JWT header object
 * @param {Object} payload - JWT payload object
 * @param {Object} options - Options object with privateKey, publicKey, or secret (for HMAC algorithms)
 * @returns {Object} - Object containing token, privateKey, publicKey/secret, header, payload
 */
export function generateJWTToken(algorithm = 'RS256', header = {}, payload = {}, options = {}) {
    try {
        // Use provided keys or generate new ones based on algorithm
        let { privateKey, publicKey, secret } = options;

        if (algorithm.startsWith('HS')) {
            // HMAC algorithms - use secret key
            if (!secret) {
                secret = crypto.randomBytes(64).toString('hex'); // Generate 512-bit secret
            }
            // Print HS key information
            console.log(`\n🔐 Generated ${algorithm} Key Information:`);
            console.log('==================================================');
            console.log(`🔑 Secret Key: ${secret}`);
            console.log(`📏 Key Length: ${secret.length * 4} bits (${secret.length} hex characters)`);
            console.log(`🔗 Key Type: HMAC Secret`);
            console.log('==================================================\n');
        } else if (!privateKey || !publicKey) {
            if (algorithm.startsWith('ES')) {
                // ECDSA algorithms
                const curve = getCurveForAlgorithm(algorithm);
                const keyPair = generateECDSAKeyPair(curve);
                privateKey = keyPair.privateKey;
                publicKey = keyPair.publicKey;
            } else {
                // RSA algorithms (RS and PS)
                const keyPair = generateRSAKeyPair();
                privateKey = keyPair.privateKey;
                publicKey = keyPair.publicKey;
            }
        }

        // Default header with custom properties
        const finalHeader = {
            alg: algorithm,
            ...header,
        };

        // Use provided payload
        const finalPayload = {
            ...payload,
        };

        // Encode header and payload
        const encodedHeader = base64urlEncode(JSON.stringify(finalHeader));
        const encodedPayload = base64urlEncode(JSON.stringify(finalPayload));

        // Create signature data
        const signatureData = `${encodedHeader}.${encodedPayload}`;

        // Sign based on algorithm type
        const hashAlgorithm = getHashAlgorithm(algorithm);
        let signature;

        if (algorithm.startsWith('HS')) {
            // HMAC algorithms
            const hmac = crypto.createHmac(hashAlgorithm, secret);
            hmac.update(signatureData);
            signature = hmac.digest();
        } else if (algorithm.startsWith('PS')) {
            // RSA-PSS algorithms
            signature = crypto.sign(hashAlgorithm, Buffer.from(signatureData), {
                key: privateKey,
                padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
                saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST,
            });
        } else if (algorithm.startsWith('ES')) {
            // ECDSA algorithms
            const derSignature = crypto.sign(hashAlgorithm, Buffer.from(signatureData), privateKey);
            // Convert DER -> JOSE (r||s) for JWS
            signature = derToJose(derSignature, algorithm);
        } else {
            // RSA PKCS#1 v1.5 algorithms (RS)
            signature = crypto.sign(hashAlgorithm, Buffer.from(signatureData), privateKey);
        }

        const encodedSignature = signature.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

        // Construct JWT token
        const token = `${encodedHeader}.${encodedPayload}.${encodedSignature}`;

        // Print JWT token information for HS algorithms
        if (algorithm.startsWith('HS')) {
            console.log(`\n🎟️ Generated ${algorithm} JWT Token Information:`);
            console.log('==================================================');
            console.log(`🎟️ JWT Token: ${token}`);
            console.log(`📏 Token Length: ${token.length} characters`);
            console.log(`📋 Header: ${JSON.stringify(finalHeader, null, 2)}`);
            console.log(`📦 Payload: ${JSON.stringify(finalPayload, null, 2)}`);
            console.log('==================================================\n');
        }

        return {
            token,
            privateKey,
            publicKey: algorithm.startsWith('HS') ? secret : publicKey,
            secret: algorithm.startsWith('HS') ? secret : undefined,
            header: finalHeader,
            payload: finalPayload,
            algorithm,
        };
    } catch (error) {
        throw new Error(`JWT token generation failed: ${error.message}`);
    }
}

/**
 * Generate JWT tokens for multiple algorithms
 * @param {Array} algorithms - Array of algorithms to use
 * @param {Object} header - JWT header object
 * @param {Object} payload - JWT payload object
 * @returns {Object} - Object containing tokens for each algorithm
 */
export function generateMultipleJWTTokens(
    algorithms = [
        'RS256',
        'RS384',
        'RS512',
        'PS256',
        'PS384',
        'PS512',
        'ES256',
        'ES384',
        'ES512',
        'HS256',
        'HS384',
        'HS512',
    ],
    header = {},
    payload = {}
) {
    const results = {};

    algorithms.forEach((algorithm) => {
        const result = generateJWTToken(algorithm, header, payload);
        results[algorithm] = result;
    });

    return results;
}

/**
 * Verify JWT token with public key or secret
 * @param {string} token - JWT token to verify
 * @param {string} keyOrSecret - Public key for asymmetric algorithms or secret for HMAC algorithms
 * @param {string} algorithm - Algorithm used for signing
 * @returns {boolean} - True if token is valid
 */
export function verifyJWTToken(token, keyOrSecret, algorithm = 'RS256') {
    try {
        const [encodedHeader, encodedPayload, encodedSignature] = token.split('.');

        if (!encodedHeader || !encodedPayload || !encodedSignature) {
            return false;
        }

        // Reconstruct signature data
        const signatureData = `${encodedHeader}.${encodedPayload}`;

        // Decode signature
        const signature = Buffer.from(encodedSignature.replace(/-/g, '+').replace(/_/g, '/'), 'base64');

        // Verify signature based on algorithm type
        const hashAlgorithm = getHashAlgorithm(algorithm);

        if (algorithm.startsWith('HS')) {
            // HMAC algorithms
            const hmac = crypto.createHmac(hashAlgorithm, keyOrSecret);
            hmac.update(signatureData);
            const computedSignature = hmac.digest();
            return crypto.timingSafeEqual(signature, computedSignature);
        } else if (algorithm.startsWith('PS')) {
            // RSA-PSS algorithms
            return crypto.verify(
                hashAlgorithm,
                Buffer.from(signatureData),
                {
                    key: keyOrSecret,
                    padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
                    saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST,
                },
                signature
            );
        } else {
            // RSA PKCS#1 v1.5 and ECDSA algorithms
            if (algorithm.startsWith('ES')) {
                // Convert JOSE (r||s) -> DER for Node verify
                const derSignature = joseToDer(signature, algorithm);
                return crypto.verify(hashAlgorithm, Buffer.from(signatureData), keyOrSecret, derSignature);
            }
            return crypto.verify(hashAlgorithm, Buffer.from(signatureData), keyOrSecret, signature);
        }
    } catch (error) {
        return false;
    }
}

/**
 * Decode JWT token without verification
 * @param {string} token - JWT token to decode
 * @returns {Object} - Object containing decoded header and payload
 */
export function decodeJWTToken(token) {
    try {
        const [encodedHeader, encodedPayload] = token.split('.');

        if (!encodedHeader || !encodedPayload) {
            throw new Error('Invalid JWT token format');
        }

        const header = JSON.parse(
            Buffer.from(encodedHeader.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString()
        );

        const payload = JSON.parse(
            Buffer.from(encodedPayload.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString()
        );

        return { header, payload };
    } catch (error) {
        throw new Error(`JWT token decoding failed: ${error.message}`);
    }
}

/**
 * Generate HMAC secret of specific length
 * @param {number} length - Length in bits (should be at least the hash output size)
 * @returns {string} - Hex encoded secret
 */
export function generateHMACSecret(length) {
    const bytes = Math.ceil(length / 8);
    return crypto.randomBytes(bytes).toString('hex');
}

/**
 * Generate JWT token with specific HMAC secret length for testing
 * @param {string} algorithm - HS256, HS384, or HS512
 * @param {number} secretLength - Secret length in bits
 * @param {Object} header - JWT header
 * @param {Object} payload - JWT payload
 * @returns {Object} - JWT token data
 */
export function generateHMACJWTWithSecretLength(algorithm, secretLength, header = {}, payload = {}) {
    const secret = generateHMACSecret(secretLength);
    // Print specific length HMAC key information
    console.log(`\n🔐 Generated ${algorithm} Key with Custom Length:`);
    console.log('==================================================');
    console.log(`🔑 Secret Key: ${secret}`);
    console.log(`📏 Requested Length: ${secretLength} bits`);
    console.log(`📏 Actual Key Length: ${secret.length * 4} bits (${secret.length} hex characters)`);
    console.log(`🔗 Key Type: HMAC Secret (Custom Length)`);
    console.log(
        `⚠️  Minimum Required for ${algorithm}: ${
            algorithm === 'HS256' ? '256' : algorithm === 'HS384' ? '384' : '512'
        } bits`
    );
    console.log('==================================================\n');
    return generateJWTToken(algorithm, header, payload, { secret });
}
