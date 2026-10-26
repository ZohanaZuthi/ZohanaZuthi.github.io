// Google protects the report. No reports or tokens are saved to GitHub or browser storage.
type TokenResponse = { access_token?: string; expires_in?: number; error?: string };
type TokenClient = { requestAccessToken(options: { prompt: string }): void };
type GoogleOAuth = {
  initTokenClient(options: { client_id: string; scope: string; callback: (response: TokenResponse) => void; error_callback: () => void }): TokenClient;
  hasGrantedAllScopes(response: TokenResponse, scope: string): boolean;
  revoke(token: string, callback: () => void): void;
};
declare global { interface Window { google?: { accounts: { oauth2: GoogleOAuth } } } }

const dashboard = document.querySelector<HTMLElement>('#analytics-dashboard')!;
const connect = document.querySelector<HTMLButtonElement>('#analytics-connect')!;
const refresh = document.querySelector<HTMLButtonElement>('#analytics-refresh')!;
const disconnect = document.querySelector<HTMLButtonElement>('#analytics-disconnect')!;
const period = document.querySelector<HTMLSelectElement>('#analytics-period')!;
const status = document.querySelector<HTMLElement>('#analytics-status')!;
const results = document.querySelector<HTMLElement>('#analytics-results')!;
const countries = document.querySelector<HTMLTableSectionElement>('#analytics-countries')!;
const scope = 'https://www.googleapis.com/auth/analytics.readonly';
const { clientId, propertyId } = dashboard.dataset;
let token = '';
let expiresAt = 0;
let expiryTimer: ReturnType<typeof setTimeout>;
let client: TokenClient | undefined;
let request: AbortController | undefined;

function clearReport(message: string) {
  request?.abort();
  clearTimeout(expiryTimer);
  token = '';
  expiresAt = 0;
  results.hidden = true;
  countries.replaceChildren();
  for (const id of ['users', 'sessions', 'views']) document.querySelector(`#analytics-${id}`)!.textContent = '—';
  refresh.hidden = disconnect.hidden = true;
  refresh.disabled = false;
  connect.hidden = false;
  connect.disabled = !client;
  status.textContent = message;
}

async function loadReport() {
  if (!token || Date.now() >= expiresAt) {
    clearReport('Your connection expired. Connect Google Analytics again to refresh your report.');
    return;
  }
  request?.abort();
  const current = new AbortController();
  request = current;
  refresh.disabled = true;
  results.hidden = true;
  status.textContent = 'Loading your visitor report…';
  try {
    const response = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:batchRunReports`, {
      method: 'POST', signal: current.signal,
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(reportRequest(Number(period.value))),
    });
    if (current.signal.aborted) return;
    if (response.status === 401) { clearReport('Your connection expired. Please connect again.'); return; }
    if (!response.ok) {
      if (response.status === 403) throw new Error('This account cannot read the report. Check that it has access to this Analytics property, the Analytics Data API is enabled, and read-only access was granted.');
      if (response.status === 429) throw new Error('Google’s reporting limit was reached. Try again in a few minutes.');
      throw new Error('Google could not load this report. Check the numeric property ID and try again.');
    }
    const report = parseReport(await response.json());
    if (current.signal.aborted) return;
    for (const [index, id] of ['users', 'sessions', 'views'].entries()) document.querySelector(`#analytics-${id}`)!.textContent = report.totals[index].toLocaleString();
    countries.replaceChildren();
    for (const row of report.countries) {
      const tr = document.createElement('tr');
      for (const value of [row.country, row.users.toLocaleString()]) {
        const td = document.createElement('td');
        td.textContent = value;
        tr.append(td);
      }
      countries.append(tr);
    }
    results.hidden = false;
    status.textContent = report.countries.length ? 'Report updated. Counts cover the selected date range, including today.' : 'No visits reported for this date range yet. Check that tracking is installed and allow time for Google to process visits.';
    const limited = report.limited ? ' Google applied privacy thresholds or sampling to this report.' : '';
    document.querySelector('#analytics-report-note')!.textContent = 'Google estimates user counts. Reports can take time to process, and country totals may differ from the overall user count.' + limited;
  } catch (error) {
    if (!current.signal.aborted) status.textContent = error instanceof Error ? error.message : 'Could not load your report. Please try again.';
  } finally {
    if (!current.signal.aborted) refresh.disabled = false;
  }
}

connect.addEventListener('click', () => client?.requestAccessToken({ prompt: 'select_account' }));
refresh.addEventListener('click', loadReport);
period.addEventListener('change', () => { if (token) void loadReport(); });
disconnect.addEventListener('click', () => {
  const previousToken = token;
  clearReport('Disconnected. Connect Google Analytics to view your report again.');
  if (previousToken) window.google?.accounts.oauth2.revoke(previousToken, () => {});
});
// A back/forward-cache restore must not reveal a previous report or retain its token.
window.addEventListener('pagehide', () => clearReport('Connect Google Analytics to load your visitor report.'));

if (clientId && propertyId) {
  connect.disabled = true;
  status.textContent = 'Loading Google sign-in…';
  const script = document.createElement('script');
  script.src = 'https://accounts.google.com/gsi/client';
  script.async = true;
  script.onerror = () => { status.textContent = 'Google sign-in could not load. Check your connection or content blocker, then reload this page.'; };
  script.onload = () => {
    const oauth = window.google?.accounts.oauth2;
    if (!oauth) { status.textContent = 'Google sign-in is unavailable. Please reload this page.'; return; }
    client = oauth.initTokenClient({
      client_id: clientId, scope,
      callback: response => {
        clearReport('Connecting…');
        if (response.error || !response.access_token || !oauth.hasGrantedAllScopes(response, scope)) {
          status.textContent = 'Read-only Analytics access was not granted. Connect again and allow access to load your report.';
          return;
        }
        token = response.access_token;
        const lifetime = Math.max(0, (Number(response.expires_in) || 3600) - 30) * 1000;
        expiresAt = Date.now() + lifetime;
        expiryTimer = setTimeout(() => clearReport('Your connection expired. Connect again to view the report.'), lifetime);
        connect.hidden = true;
        refresh.hidden = disconnect.hidden = false;
        void loadReport();
      },
      error_callback: () => { status.textContent = 'Sign-in was closed or blocked. Connect again and allow the Google popup.'; },
    });
    connect.disabled = false;
    status.textContent = 'Connect Google Analytics to load your visitor report.';
  };
  document.head.append(script);
}

import { reportRequest, parseReport } from '../lib/analytics-report';
