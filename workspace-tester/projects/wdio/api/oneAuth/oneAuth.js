const TOKEN_URL = browser.options.baseUrl + 'oauth2/token';
const REVOKE_URL = browser.options.baseUrl + 'oauth2/revoke';

export async function fetchApiSessions(accessToken) {
    const url = `${browser.options.baseUrl}api/sessions`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'X-MSTR-AuthToken': accessToken,
        },
    });
    const data = await response.json();
    return { accessToken, data };
}
export async function refreshAccessToken(refreshToken, client_id, client_secret) {
    const res = await fetch(TOKEN_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            client_id: client_id,
            client_secret: client_secret,
            refresh_token: refreshToken,
        }).toString(),
    });
    const data = await res.json();
    return data;
}
export async function revokeRefreshToken(refreshToken, client_id, client_secret) {
    const res = await fetch(REVOKE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            client_id: client_id,
            client_secret: client_secret,
            token: refreshToken,
        }).toString(),
    });
    return res.status;
}