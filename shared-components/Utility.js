function sanitizeHTMLString(str) {
  if (!str || typeof str !== 'string') return '';

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = str;

  const blockedTags = ['script', 'iframe', 'object', 'embed', 'style'];
  const blockedAttrs = [
    'onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onmouseenter',
    'srcdoc', 'formaction', 'xlink:href',
  ];
  // eslint-disable-next-line no-script-url
  const blockedProtocols = ['javascript:', 'vbscript:', 'data:'];
  const urlAttributes = ['href', 'src', 'xlink:href', 'formaction'];

  // Remove dangerous elements
  blockedTags.forEach((tag) => {
    tempDiv.querySelectorAll(tag).forEach((el) => el.remove());
  });

  // Sanitize attributes
  const elements = tempDiv.querySelectorAll('*');
  elements.forEach((el) => {
    [...el.attributes].forEach((attr) => {
      const name = attr.name.toLowerCase();
      const value = attr.value.trim().toLowerCase();

      const isBlockedAttr = blockedAttrs.includes(name);
      const isBlockedProtocol = urlAttributes.includes(name)
        && blockedProtocols.some((proto) => value.startsWith(proto));

      if (isBlockedAttr || isBlockedProtocol) {
        el.removeAttribute(attr.name);
      }
    });
  });

  // Return cleaned HTML string
  return tempDiv.innerHTML;
}

function stringToHTML(str) {
  if (!str) return null;

  const sanitizedStr = sanitizeHTMLString(str);
  const parser = new DOMParser();
  const doc = parser.parseFromString(sanitizedStr, 'text/html');

  return doc.body.firstChild;
}

export default stringToHTML;

let cachedCombinedMap = null;

export async function redirectRouter() {
  const { href, origin, pathname } = window.location;

  if (!cachedCombinedMap) {
    const dynamicRedirects = {};
    try {
      const resp = await fetch('/redirects1.json');
      if (resp.ok) {
        const json = await resp.json();
        if (json.data && Array.isArray(json.data)) {
          json.data.forEach((row) => {
            const source = row.Source || row.source;
            const destination = row.Destination || row.destination;
            if (source && destination) {
              dynamicRedirects[source] = destination;
            }
          });
        }
      }
    } catch (e) {
      // Failed to fetch dynamic redirects
    }
    cachedCombinedMap = dynamicRedirects;
  }

  // 1. Handle hash-based redirects first
  if (href.includes('#!')) {
    let hashPath = href.split('#!')[1] || '';
    if (hashPath.includes('?')) [hashPath] = hashPath.split('?');
    if (hashPath.includes('#')) [hashPath] = hashPath.split('#');

    let target = cachedCombinedMap[hashPath] || cachedCombinedMap[`/#!${hashPath}`];

    // If not found, try stripping leading /en if present
    if (!target && hashPath.startsWith('/en')) {
      target = cachedCombinedMap[hashPath.substring(3)];
    }

    if (target) {
      window.location.replace(target);
      return;
    }

    // If it's a legacy hash but not found, redirect to 404
    window.location.replace('/404');
    return;
  }

  // 2. Redirect root patterns to /en/home
  const isRootUrl = href === origin
    || href === `${origin}/`
    || href.startsWith(`${origin}/?`)
    || (href.startsWith(`${origin}/#`) && !href.includes('#!')) // Don't match if it's a legacy rule
    || pathname === ''
    || pathname === '/'
    || pathname === '/index.html'
    || pathname === '/en'
    || pathname === '/en/';

  if (isRootUrl) {
    window.location.replace('/en/home');
  }
}

export function isMobile() {
  return window.innerWidth < 768;
}

export function getCookie(name) {
  const cookies = document.cookie.split('; ');
  for (let i = 0; i < cookies.length; i += 1) {
    const parts = cookies[i].split('=');
    const key = parts[0];
    const value = parts.slice(1).join('=');
    if (key === name) {
      return decodeURIComponent(value);
    }
  }
  return null;
}

export function controlLowerEnvironment() {
  // Authentication check - redirect to login if not authenticated and not already on login page
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const currentPath = window.location.pathname;

  // If user is not authenticated and not already on login page, redirect to login
  if (!isAuthenticated && !currentPath.includes('/login')) {
    // Store current page for redirect after login
    localStorage.setItem('loginReferrer', window.location.href);
    // eslint-disable-next-line no-console
    console.log('User not authenticated, redirecting to login page');
    window.location.href = '/login';
  }
}

export const isIOSDevice = () => /iPhone/.test(navigator.userAgent)
    || (navigator.userAgent.includes('Mac') && 'ontouchend' in document);

export const getAEMPublishEndpoint = () => {
  const { hostname } = window.location;
  if (hostname.includes('main--gens-prod--') || hostname === 'gentingsingapore.com' || hostname === 'www.gentingsingapore.com') {
    return 'https://publish-p144202-e1512579.adobeaemcloud.com';
  }
  if (hostname.includes('uat--gens-stage--') || hostname === 'ut.gentingsingapore.com') {
    return 'https://publish-p144202-e1512622.adobeaemcloud.com';
  }
  return 'https://publish-p144202-e1488374.adobeaemcloud.com';
};
