// GoatCounter’s documented /count endpoint: https://www.goatcounter.com/help/pixel
export function validEndpoint(value) {
  return typeof value === 'string' && /^https:\/\/[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.goatcounter\.com\/count$/.test(value);
}

/** Count only the published origin and explicitly configured links. */
export function startAnalytics(config, browser = window) {
  const { document, navigator, location } = browser;
  const permitted = () => config.enabled && validEndpoint(config.endpoint)
    && location.origin === config.origin && location.protocol === 'https:'
    && browser.self === browser.top && !navigator.webdriver
    && navigator.doNotTrack !== '1' && navigator.doNotTrack !== 'yes'
    && navigator.globalPrivacyControl !== true;
  if (!permitted()) return;

  const send = (name, title, event = false) => {
    if (!permitted()) return;
    const url = new URL(config.endpoint);
    url.searchParams.set('p', name);
    url.searchParams.set('t', title);
    // A fresh cache buster is not saved or reused as a visitor identifier.
    url.searchParams.set('rnd', Math.random().toString(36).slice(2, 10));
    if (event) {
      url.searchParams.set('e', 'true');
      url.searchParams.set('ns', 'true');
    }
    // No browser URL, query, hash, referrer, screen size, cookie, or storage value.
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
