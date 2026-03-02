export default async function getSessionFromCurrentBrowser() {
    const cookies = await browser.getCookies();
    let cnt = cookies.length;
    let sessionId;
    let jSessionCookie;
    let lbSession = null;
    let cbSession = null;
    for (let i = 0; i < cnt; i++) {
        let obj = cookies[i];
        if (obj.name === 'iSession') {
            sessionId = obj.value;
        }
        if (obj.name == 'JSESSIONID') {
            jSessionCookie = `JSESSIONID=${obj.value}`;
        }
        if (obj.name == 'library-ingress') {
            lbSession = obj.value;
        }
        if (obj.name == 'collaboration-ingress') {
            cbSession = obj.value;
        }
    }
    let session = { token: sessionId, cookie: `${jSessionCookie};iSession=${sessionId}` };
    if (lbSession) {
        session.cookie = session.cookie + `;library-ingress=${lbSession}`;
    }
    if (cbSession) {
        session.cookie = session.cookie + `;collaboration-ingress=${cbSession}`;
    }
    return session;
}
