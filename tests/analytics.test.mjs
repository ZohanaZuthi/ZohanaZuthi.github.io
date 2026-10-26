import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const compile = path => ts.transpileModule(readFileSync(new URL(path, import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const module = { exports: {} };
vm.runInNewContext(compile('../src/lib/analytics-report.ts'), { exports: module.exports });
const { reportRequest, parseReport } = module.exports;
const fixture = { reports: [
  { rows: [{ metricValues: [{ value: '12' }, { value: '19' }, { value: '45' }] }] },
  { rows: [
    { dimensionValues: [{ value: 'Bangladesh' }], metricValues: [{ value: '10' }] },
    { dimensionValues: [{ value: 'Japan' }], metricValues: [{ value: '4' }] },
    { dimensionValues: [{ value: '(not set)' }], metricValues: [{ value: '1' }] },
  ] },
] };
test('date ranges include exactly the requested number of days and use separate totals', () => {
  for (const days of [7, 30, 90]) {
    const request = reportRequest(days);
    assert.equal(request.requests[0].dateRanges[0].startDate, `${days - 1}daysAgo`);
    assert.equal(request.requests[0].dimensions, undefined);
    assert.equal(request.requests[1].dimensions[0].name, 'country');
  }
  assert.equal(reportRequest(999).requests[0].dateRanges[0].startDate, '29daysAgo');
  const report = parseReport(fixture);
  assert.equal(report.totals[0], 12); // Must not sum country users (15).
  assert.equal(report.countries[2].country, 'Unknown country');
});
test('empty reports, privacy thresholds, invalid and incomplete responses', () => {
  assert.equal(parseReport({ reports: [{}, {}] }).totals[0], 0);
  assert.equal(parseReport({ reports: [{}, { metadata: { subjectToThresholding: true } }] }).limited, true);
  assert.throws(() => parseReport({ reports: [] }), /incomplete/);
  assert.throws(() => parseReport({ reports: [{ rows: [{ metricValues: [{ value: 'NaN' }] }] }, {}] }), /invalid/);
});

// A small DOM stand-in exercises connection, API errors and sign-out without real credentials.
function app(fetcher, configured = true) {
  class Element {
    hidden = false; disabled = false; textContent = ''; children = []; listeners = {}; value = '30';
    dataset = configured ? { clientId: 'test.apps.googleusercontent.com', propertyId: '123' } : {};
    addEventListener(event, fn) { this.listeners[event] = fn; }
    append(child) { this.children.push(child); }
    replaceChildren() { this.children = []; }
  }
  const elements = new Map();
  const get = selector => { if (!elements.has(selector)) elements.set(selector, new Element()); return elements.get(selector); };
  get('#analytics-results').hidden = true;
  const head = new Element();
  let options, requested, revoked, timer;
  const oauth = {
    initTokenClient(value) { options = value; return { requestAccessToken(value) { requested = value; } }; },
    hasGrantedAllScopes: () => true,
    revoke(value) { revoked = value; },
  };
  const window = { google: { accounts: { oauth2: oauth } }, addEventListener(event, fn) { this[event] = fn; } };
  const context = { exports: {}, require: () => module.exports, window, document: { querySelector: get, createElement: () => new Element(), head }, fetch: fetcher, AbortController, Date, setTimeout: fn => { timer = fn; return 1; }, clearTimeout() {} };
  vm.runInNewContext(compile('../src/scripts/analytics.ts'), context);
  head.children[0]?.onload();
  return { get, head, window, options, connect: () => get('#analytics-connect').listeners.click(), authorize: response => options.callback(response), expire: () => timer(), requested: () => requested, revoked: () => revoked };
}
const settle = () => new Promise(resolve => setImmediate(resolve));
const token = { access_token: 'test-token', expires_in: 3600 };
test('no configuration means no Google script and no data request', () => {
  const ui = app(() => assert.fail('must not fetch'), false);
  assert.equal(ui.head.children.length, 0);
  assert.equal(ui.get('#analytics-results').hidden, true);
});
test('connect requests read-only access; successful reports render text; disconnect clears and revokes', async () => {
  let request;
  const ui = app(async (url, options) => { request = { url, options }; return { ok: true, status: 200, json: async () => fixture }; });
  assert.equal(ui.options.scope, 'https://www.googleapis.com/auth/analytics.readonly');
  ui.connect(); assert.equal(ui.requested().prompt, 'select_account');
  ui.authorize(token); await settle();
  assert.equal(request.options.headers.Authorization, 'Bearer test-token');
  assert.match(request.url, /properties\/123:batchRunReports$/);
  assert.equal(ui.get('#analytics-users').textContent, '12');
  assert.equal(ui.get('#analytics-countries').children.length, 3);
  assert.equal(ui.get('#analytics-results').hidden, false);
  ui.get('#analytics-disconnect').listeners.click();
  assert.equal(ui.revoked(), 'test-token');
  assert.equal(ui.get('#analytics-results').hidden, true);
  assert.equal(ui.get('#analytics-countries').children.length, 0);
});
test('denied consent and popup failure show an explanation without fetching', () => {
  const ui = app(() => assert.fail('must not fetch'));
  ui.authorize({ error: 'access_denied' });
  assert.match(ui.get('#analytics-status').textContent, /not granted/);
  ui.options.error_callback();
  assert.match(ui.get('#analytics-status').textContent, /closed or blocked/);
});
test('unauthorized, forbidden, quota and network errors do not show a report', async () => {
  for (const status of [401, 403, 429, 500]) {
    const ui = app(async () => ({ ok: false, status }));
    ui.authorize(token); await settle();
    assert.equal(ui.get('#analytics-results').hidden, true);
    assert.match(ui.get('#analytics-status').textContent, /expired|cannot read|limit|could not load/);
  }
  const ui = app(async () => { throw new Error('Network unavailable'); });
  ui.authorize(token); await settle();
  assert.equal(ui.get('#analytics-results').hidden, true);
  assert.match(ui.get('#analytics-status').textContent, /Could not load your report/);
});
test('disconnect cancels in-flight responses; expiry and page exit clear private data', async () => {
  let finish;
  const ui = app(() => new Promise(resolve => { finish = resolve; }));
  ui.authorize(token);
  ui.get('#analytics-disconnect').listeners.click();
  finish({ ok: true, status: 200, json: async () => fixture }); await settle();
  assert.equal(ui.get('#analytics-results').hidden, true);
  const loaded = app(async () => ({ ok: true, status: 200, json: async () => fixture }));
  loaded.authorize(token); await settle(); loaded.expire();
  assert.equal(loaded.get('#analytics-results').hidden, true);
  loaded.authorize(token); await settle(); loaded.window.pagehide();
  assert.equal(loaded.get('#analytics-results').hidden, true);
  assert.equal(loaded.get('#analytics-countries').children.length, 0);
});
