const path = decodeURIComponent(window.location.pathname);
const { href, origin } = window.location;

// Check if URL is root domain hitting an unknown sub-path that Franklin served as 404
const isRootUrl = href === origin
  || href === `${origin}/`
  || href.startsWith(`${origin}/?`)
  || href.startsWith(`${origin}/#`)
  || path === ''
  || path === '/'
  || path === '/index.html'
  || path === '/en'
  || path === '/en/';

console.log('[404 DEBUG] Current path:', `"${path}"`, 'isRoot:', isRootUrl);
if (isRootUrl) {
  window.location.replace('/en/home');
} else if (!path.startsWith('/en/404')) {
  // Force redirect to /en/404 only for non-match and ensure no looping
  window.location.replace('/en/404');
} else {
  setTimeout(() => {
    document.body.classList.add('appear');
  }, 0);
}

window.addEventListener('load', () => {
  if (document.referrer) {
    const { origin: refOrigin, pathname: refPathname } = new URL(document.referrer);
    if (refOrigin === window.location.origin) {
      const backBtn = document.createElement('a');
      backBtn.classList.add('button', 'error-button-back');
      backBtn.href = refPathname;
      backBtn.textContent = 'Go back';
      backBtn.title = 'Go back';
      const btnContainer = document.querySelector('.button-container');
      if (btnContainer) btnContainer.append(backBtn);
    }
  }
});

// Load RUM
(async () => {
  try {
    const { sampleRUM } = await import('./aem.js');
    sampleRUM('404', { source: document.referrer });
  } catch (e) {
    // ignore
  }
})();
