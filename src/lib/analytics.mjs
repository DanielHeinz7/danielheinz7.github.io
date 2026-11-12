// GoatCounter’s documented /count endpoint: https://www.goatcounter.com/help/pixel
export function validEndpoint(value) {
  return typeof value === 'string' && /^https:\/\/[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.goatcounter\.com\/count$/.test(value);
}

// GoatCounter’s own opt-out convention: https://www.goatcounter.com/help/skip-dev
const optOutKey = 'skipgc';

function countingSwitchedOff(browser) {
  try { return browser.localStorage.getItem(optOutKey) === 't'; } catch { return false; }
}

/** Stores or clears the opt-out flag only when the visitor opens #toggle-goatcounter. */
function toggleCounting(browser) {
  const switchOff = !countingSwitchedOff(browser);
  try {
    if (switchOff) browser.localStorage.setItem(optOutKey, 't');
    else browser.localStorage.removeItem(optOutKey);
    browser.alert(switchOff ? 'Visit counting is now disabled in this browser.' : 'Visit counting is enabled again in this browser.');
  } catch {
    browser.alert('This browser does not allow the setting to be stored.');
  }
}

/** Count only the published origin and explicitly configured links; page views carry an external referrer. */
export function startAnalytics(config, browser = window) {
  const { document, navigator, location } = browser;
  if (location.hash === '#toggle-goatcounter') toggleCounting(browser);
  if (countingSwitchedOff(browser)) return;
  const permitted = () => config.enabled && validEndpoint(config.endpoint)
    && location.origin === config.origin && location.protocol === 'https:'
    && browser.self === browser.top && !navigator.webdriver
    && navigator.doNotTrack !== '1' && navigator.doNotTrack !== 'yes'
    && navigator.globalPrivacyControl !== true;
  if (!permitted()) return;

  const externalReferrer = () => {
    try {
      const referrer = new URL(document.referrer);
      return referrer.origin === config.origin ? '' : referrer.href;
    } catch { return ''; }
  };

  const send = (name, title, event = false) => {
    if (!permitted()) return;
    const url = new URL(config.endpoint);
    url.searchParams.set('p', name);
    url.searchParams.set('t', title);
    // A fresh cache buster is not saved or reused as a visitor identifier.
    url.searchParams.set('rnd', Math.random().toString(36).slice(2, 10));
    const referrer = event ? '' : externalReferrer();
    if (referrer) url.searchParams.set('r', referrer);
    if (event) {
      url.searchParams.set('e', 'true');
      url.searchParams.set('ns', 'true');
    }
    // Besides the external referrer: no own URL, query, hash, screen size, cookie, or storage value.
    try {
      browser.fetch(url.href, {
        method: 'GET', mode: 'no-cors', credentials: 'omit',
        referrerPolicy: 'no-referrer', keepalive: true,
      }).catch(() => {});
    } catch { /* Analytics must never interrupt a link or page. */ }
  };

  const countPage = () => {
    if (document.prerendering || document.visibilityState !== 'visible') return;
    document.removeEventListener('visibilitychange', countPage);
    document.removeEventListener('prerenderingchange', countPage);
    send(config.path, config.title);
  };
  document.addEventListener('visibilitychange', countPage);
  document.addEventListener('prerenderingchange', countPage);
  countPage();

  const countClick = event => {
    if (event.defaultPrevented || (event.type === 'click' ? event.button !== 0 : event.button !== 1)) return;
    const link = event.target?.closest?.('a[href]');
    if (!link) return;
    const entry = Object.hasOwn(config.links, link.href) ? config.links[link.href] : null;
    if (entry) send(entry.name, entry.title, true);
  };
  document.addEventListener('click', countClick);
  document.addEventListener('auxclick', countClick);
}
