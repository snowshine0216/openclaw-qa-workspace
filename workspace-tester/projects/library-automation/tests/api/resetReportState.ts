/**
 * Reset report/dossier state via Library Server API.
 * Mirrors WDIO api/reports/resetReportState.js
 */
import { getReportEnv } from '../config/env';

interface ReportRef {
  id: string;
  project: { id: string };
}

interface Credentials {
  username: string;
  password: string;
}

async function auth(baseUrl: string, credentials: Credentials): Promise<{ token: string; cookie: string }> {
  const form = new URLSearchParams({
    loginMode: '1',
    username: credentials.username,
    password: credentials.password,
  });

  const res = await fetch(`${baseUrl}auth/login`, {
    method: 'POST',
    headers: { 'X-Requested-With': 'XMLHttpRequest', 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form.toString(),
    redirect: 'manual',
  });

  if (res.status !== 204) {
    throw new Error(`Auth failed: ${res.status} ${await res.text()}`);
  }

  const token = res.headers.get('x-mstr-authtoken') || '';
  const cookie = res.headers.get('set-cookie')?.split(';')[0] || '';
  return { token, cookie };
}

async function logout(baseUrl: string, session: { token: string }): Promise<void> {
  const form = new URLSearchParams({ sessionId: session.token });
  const res = await fetch(`${baseUrl}logout`, {
    method: 'POST',
    headers: { 'X-MSTR-AuthToken': session.token, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form.toString(),
    redirect: 'manual',
  });
  if (res.status !== 302 && res.status !== 303) {
    throw new Error(`Logout failed: ${res.status}`);
  }
}

export async function resetReportState(params: {
  credentials: Credentials;
  report: ReportRef;
  baseUrl?: string;
}): Promise<{ id: string }> {
  const env = getReportEnv();
  const baseUrl = params.baseUrl || env.reportTestUrl;
  const credentials = params.credentials || {
    username: env.reportTestUser,
    password: env.reportTestPassword,
  };

  const session = await auth(baseUrl, credentials);

  const res = await fetch(`${baseUrl}api/dossiers/instances`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-MSTR-ProjectID': params.report.project.id,
      'X-MSTR-AuthToken': session.token,
      Cookie: session.cookie,
    },
    body: JSON.stringify({
      objects: [{ type: 3, id: params.report.id }],
      persistReportViewState: true,
      createForReportEditor: true,
      reset: true,
    }),
  });

  await logout(baseUrl, session);

  if (res.status === 201) {
    const body = await res.json();
    return { id: body.mid };
  }

  const body = await res.json().catch(() => ({}));
  throw new Error(`resetReportState failed: ${res.status} ${(body as { message?: string }).message || res.statusText}`);
}
