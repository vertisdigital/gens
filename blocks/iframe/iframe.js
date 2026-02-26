function isLandscape() {
  if (window.innerWidth > window.innerHeight) {
    return true;
  }
  return false;
}

function setElementHeight(element, height) {
  element.style.height = height;
}

function updateIframeHeight(iframeWrapper, endpoint, iframeElement = null) {
  // If we have established a dynamic height (via same-origin or postMessage), 
  // do not override it with the static config.
  if (iframeWrapper.dataset.hasDynamicHeight === 'true') {
    return;
  }

  const isMobile = window.innerWidth <= 767;
  const isTablet = window.innerWidth >= 768 && window.innerWidth <= 993;

  let deviceType = 'desktop';
  if (isMobile) {
    deviceType = 'mobile';
  }
  if (isTablet) {
    deviceType = 'tablet';
  }

  // Normalize keys to lowercase for consistent matching
  const endpointHeightConfig = {
    home: {
      mobile: '1850px',
      desktop: '1220px',
    },
    'annual-reports': {
      mobile: '15600px',
      tablet: '4640px',
      desktop: '7500px',
    },
    'sustainability-reports': {
      mobile: '8080px',
      tablet: {
        landscape: '2620px',
        portrait: '2260px',
      },
      desktop: '7500px',
    },
    newsroom: {
      mobile: '3000px',
      tablet: '1520px',
      desktop: '1500px',
    },
    'agm-egm': {
      mobile: '1080px',
      desktop: '900px',
    },
    'analysts-coverage': {
      mobile: '1300px',
      tablet: '1110px',
      desktop: '1080px',
    },
    'share-quote-and-chart': {
      mobile: '3500px',
      tablet: '1900px',
      desktop: '1850px',
    },
    'email-alerts': {
      mobile: '770px',
      tablet: '660px',
      desktop: '600px',
    },
    "historic-price-lookup": {
      mobile: '1850px',
      desktop: '1220px',
    },
    "investment-calculator": {
      mobile: '1100px',
      desktop: '860px',
      tablet: '960px',
      disableScroll: true
    },
    "investor-calendar": {
      mobile: '1020px',
      tablet: "640px",
      desktop: '640px',
    },
    default: {
      mobile: '1850px',
      desktop: '1220px',
    },
  };

  // Normalization helper: lowercase, remove extensions, replace underscores/spaces with hyphens
  const normalizedEndpoint = endpoint
    .toLowerCase()
    .replace('.html', '')
    .replace(/[_\s]+/g, '-');

  let config = endpointHeightConfig[normalizedEndpoint] || endpointHeightConfig.default;

  let height = null;
  if (typeof config === 'string') {
    height = config;
  } else if (typeof config === 'object') {
    if (deviceType === 'tablet') {
      height = isLandscape()
        ? (config[deviceType]?.landscape || config[deviceType] || config.desktop)
        : (config[deviceType]?.portrait || config[deviceType] || config.desktop);
    } else {
      height = config[deviceType] || config.desktop;
    }
  }

  if (height) {
    setElementHeight(iframeWrapper, height);
  } else {
    setElementHeight(iframeWrapper, endpointHeightConfig.default.desktop);
  }

  const iframe = iframeElement || iframeWrapper.querySelector('iframe')

  // Default to scrolling="no". ONLY enable if explicitly requested
  if (endpointHeightConfig[normalizedEndpoint]?.enableScroll === true) {
    iframe.setAttribute('scrolling', 'yes');
  } else {
    iframe.setAttribute('scrolling', 'no');
  }
}

function getTabsEvent() {
  const tabs = document.querySelectorAll('.tab-title');
  const iframeWrappers = document.querySelectorAll('.iframe-wrapper');
  const SHARE_QUOTE_IFRAME = 0;
  updateIframeHeight(iframeWrappers[SHARE_QUOTE_IFRAME], `${tabs[SHARE_QUOTE_IFRAME].innerHTML}`)

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      updateIframeHeight(iframeWrappers[index], `${tabs[index].innerHTML}`)
    });
  });
}

function updateIframeForTab() {
  const tabsIframePages = {
    '/index/investors-overview/publications': true,
    '/index/investors-overview/stock-information': true
  }
  const isTabIframeRoute = tabsIframePages[window.location.pathname.replace('#', '')]
  if (isTabIframeRoute) {
    getTabsEvent();
  }
}

let tabviewHeight = null;
let calviewHeight = null;

export default function decorate(block) {
  const link = block.querySelector('a');
  link.remove();

  const iframe = document.createElement('iframe');
  const url = link.href;

  // Append timestamp to prevent caching
  const timestamp = new Date().getTime();
  iframe.src = url.includes('?') ? `${url}&t=${timestamp}` : `${url}?t=${timestamp}`;
  iframe.title = link.textContent.trim() || 'Embedded content';
  iframe.setAttribute('loading', 'lazy');
  iframe.setAttribute('width', '100%');
  iframe.setAttribute('height', '100%');
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('allowfullscreen', '');

  // Add error handling
  iframe.onerror = () => {
    // eslint-disable-next-line no-console
    console.warn(`Failed to load iframe content from: ${link.href}`);
    const errorMessage = document.createElement('div');
    errorMessage.className = 'iframe-error';
    errorMessage.textContent = 'Content temporarily unavailable';
    iframe.replaceWith(errorMessage);
  };

  const iframeWrapper = block.closest('.iframe-wrapper');
  if (iframeWrapper) {
    iframeWrapper.classList.add('container');
    // Improved endpoint extraction: remove leading/trailing slashes, .rev
    const endpoint = new window.URL(url).pathname.replace(/^\/+|\/+$/g, '').replace('.rev', '');
    updateIframeHeight(iframeWrapper, endpoint, iframe);
    updateIframeForTab();

    window.addEventListener('resize', () => {
      updateIframeHeight(iframeWrapper, endpoint);
      updateIframeForTab();
    });

    // Dynamic resizing
    // Dynamic resizing
    let contentHeight = 500; // Default matches user snippet

    window.addEventListener('message', (e) => {
      const message = e.data;

      // Check if message comes from our iframe
      if (e.source !== iframe.contentWindow) {
        return;
      }

      // Reset resize flag for internal iframe tab switches
      if (tabviewHeight !== null && message === 'TabView') {
        iframeWrapper.dataset.hasResized = 'false';
        iframe.style.height = `${tabviewHeight}px`; // Set height on iframe itself as per snippet
        setElementHeight(iframeWrapper, `${tabviewHeight}px`); // Also update wrapper
        contentHeight = tabviewHeight;
        return;
      }

      if (calviewHeight !== null && message === 'CalView') {
        iframeWrapper.dataset.hasResized = 'false';
        iframe.style.height = `${calviewHeight}px`; // Set height on iframe itself as per snippet
        setElementHeight(iframeWrapper, `${calviewHeight}px`); // Also update wrapper
        contentHeight = calviewHeight;
        return;

      }

      // Run-once logic for specific endpoints to prevent infinite loop
      const runOnceEndpoints = [
        'email_alerts',
        'email-alerts',
        'news_search',
        'news-search',
        'investor-calendar'
      ];
      if (endpoint === 'investor-calendar') {
        if (tabviewHeight === null && calviewHeight !== null) {
          tabviewHeight = message.height;
        }
        if (calviewHeight === null) {
          calviewHeight = message.height;
        }
      }
      // Check if we should only run once and if it has already run
      if (runOnceEndpoints.includes(endpoint) && iframeWrapper.dataset.hasResized === 'true') {

        return;
      }

      // User's requested logic
      if (
        message.height &&
        message.height !== contentHeight &&
        message.height !== 150
      ) {
        iframe.style.height = `${message.height}px`; // Set height on iframe itself as per snippet
        setElementHeight(iframeWrapper, `${message.height}px`); // Also update wrapper
        contentHeight = message.height;

        // Mark as dynamic so static config doesn't override
        iframeWrapper.dataset.hasDynamicHeight = 'true';

        // Mark as resized for run-once endpoints
        if (runOnceEndpoints.includes(endpoint)) {
          iframeWrapper.dataset.hasResized = 'true';
        }
      }
    });
  }

  block.appendChild(iframe);
}