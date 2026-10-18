import test from 'node:test';
import assert from 'node:assert/strict';
import { startAnalytics, validEndpoint } from '../src/lib/analytics.mjs';

const origin = 'https://example.test';
const paper = 'https://doi.org/10.1234/example';
const config = {
  enabled: true, endpoint: 'https://example.goatcounter.com/count', origin,
  path: '/research/', title: 'Research',
  links: {
    [paper]: { name: 'paper-example', title: 'Paper: Example' },
    [`${origin}/files/cv.pdf`]: { name: 'cv-pdf', title: 'CV (PDF)' },
  },
};

function fixture({ location = {}, navigator = {}, document = {}, fetch } = {}) {
  const listeners = new Map();
  const requests = [];
  const top = {};
  const browser = {
    self: top, top,
    location: { origin, protocol: 'https:', search: '?private=secret', hash: '#secret', ...location },
    navigator: { doNotTrack: null, ...navigator },
    document: {
      visibilityState: 'visible', referrer: 'https://private.test/secret',
      addEventListener(type, handler) { listeners.set(type, handler); },
      removeEventListener(type) { listeners.delete(type); },
      ...document,
    },
    fetch: fetch || ((url, options) => { requests.push({ url: new URL(url), options }); return Promise.resolve(); }),
  };
  const click = (href, { type = 'click', button = 0, ...rest } = {}) => {
    listeners.get(type)?.({ type, button, defaultPrevented: false,
      target: { closest: () => ({ href }) }, ...rest });
  };
  return { browser, requests, listeners, click };
}

test('no requests or listeners on local previews, foreign origins, or privacy opt-outs', () => {
  for (const options of [
    { location: { origin: 'http://127.0.0.1:57702', protocol: 'http:' } },
    { location: { origin: 'https://preview.example.test' } },
    { location: { origin: 'https://example.test.attacker.test' } },
    { navigator: { doNotTrack: '1' } }, { navigator: { doNotTrack: 'yes' } },
    { navigator: { globalPrivacyControl: true } }, { navigator: { webdriver: true } },
  ]) {
    const { browser, requests, listeners } = fixture(options);
    startAnalytics(config, browser);
    assert.equal(requests.length, 0);
    assert.equal(listeners.size, 0);
  }
  for (const changed of [{ enabled: false }, { endpoint: 'https://attacker.test/count' }]) {
    const { browser, requests } = fixture();
    startAnalytics({ ...config, ...changed }, browser);
    assert.equal(requests.length, 0);
  }
  const framed = fixture();
  framed.browser.top = {};
  startAnalytics(config, framed.browser);
  assert.equal(framed.requests.length, 0);
});

test('page request contains only fixed public metadata and sends no credentials/referrer', () => {
  const { browser, requests } = fixture();
  startAnalytics(config, browser);
  assert.equal(requests.length, 1);
  const { url, options } = requests[0];
  assert.deepEqual([...url.searchParams.keys()].sort(), ['p', 'rnd', 't']);
  assert.equal(url.searchParams.get('p'), '/research/');
  assert.equal(url.searchParams.get('t'), 'Research');
  assert.equal(options.credentials, 'omit');
  assert.equal(options.referrerPolicy, 'no-referrer');
  assert.equal(options.keepalive, true);
  assert.equal(options.mode, 'no-cors');
  assert.doesNotMatch(url.href, /secret|private/);
});

test('only known paper/CV targets count, including keyboard and middle clicks', () => {
  const { browser, requests, click } = fixture();
  startAnalytics(config, browser);
  click(paper); // Keyboard Enter also generates a primary click.
  click(`${origin}/files/cv.pdf`, { type: 'auxclick', button: 1 });
  click(paper, { ctrlKey: true });
  assert.equal(requests.length, 4);
  assert.deepEqual(requests.slice(1).map(r => r.url.searchParams.get('p')), ['paper-example', 'cv-pdf', 'paper-example']);
  for (const request of requests.slice(1)) {
    assert.equal(request.url.searchParams.get('e'), 'true');
    assert.equal(request.url.searchParams.get('ns'), 'true');
    assert.deepEqual([...request.url.searchParams.keys()].sort(), ['e', 'ns', 'p', 'rnd', 't']);
  }
  for (const href of [`${origin}/lab/`, 'https://elsewhere.test/files/cv.pdf', `${paper}?secret=1`, 'mailto:person@example.test', 'toString', `${origin}/files/cv.pdf#secret`]) click(href);
  click(paper, { defaultPrevented: true });
  click(paper, { type: 'auxclick', button: 2 });
  assert.equal(requests.length, 4);
});

test('background and prerender pages count once when visible', () => {
  const { browser, requests, listeners } = fixture({ document: { visibilityState: 'hidden', prerendering: true } });
  startAnalytics(config, browser);
  assert.equal(requests.length, 0);
  browser.document.prerendering = false;
  listeners.get('prerenderingchange')();
  assert.equal(requests.length, 0);
  browser.document.visibilityState = 'visible';
  listeners.get('visibilitychange')();
  assert.equal(requests.length, 1);
  assert.equal(listeners.has('visibilitychange'), false);
});

test('changed privacy preference stops later events, blocked transport never blocks links', async () => {
  const active = fixture();
  startAnalytics(config, active.browser);
  active.browser.navigator.globalPrivacyControl = true;
  active.click(paper);
  assert.equal(active.requests.length, 1);
  for (const fetch of [() => Promise.reject(new Error('blocked')), () => { throw new Error('blocked'); }]) {
    const blocked = fixture({ fetch });
    assert.doesNotThrow(() => startAnalytics(config, blocked.browser));
    assert.doesNotThrow(() => blocked.click(paper));
    await new Promise(resolve => setImmediate(resolve));
  }
});

test('endpoint validation rejects credentials, ports, queries, and lookalike hosts', () => {
  assert.equal(validEndpoint(config.endpoint), true);
  for (const value of ['http://example.goatcounter.com/count', 'https://example.goatcounter.com.attacker.test/count', 'https://user@example.goatcounter.com/count', 'https://example.goatcounter.com:443/count', `${config.endpoint}?x=1`, `${config.endpoint}#x`, '']) {
    assert.equal(validEndpoint(value), false, value);
  }
});
