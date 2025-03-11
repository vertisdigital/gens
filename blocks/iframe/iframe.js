function isLandscape() {
  if (window.innerWidth > window.innerHeight) {
    return true;
  }
  return false;
}

function setElementHeight(element, height) {
  element.style.height = height;
}

function updateIframeHeight(iframeWrapper, endpoint) {
  const isMobile = window.innerWidth < 500;
  const isTablet = window.innerWidth >= 600 && window.innerWidth <= 1024;
  switch (endpoint) {
    case 'home':
      if (isMobile) {
        setElementHeight(iframeWrapper, '1850px');
      } else {
        setElementHeight(iframeWrapper, '1220px');
      }
      break;
    case 'annual-reports':
      if (isMobile) {
        setElementHeight(iframeWrapper, '15600px');
      } else if (isTablet) {
        setElementHeight(iframeWrapper, '4640px');
      } else {
        setElementHeight(iframeWrapper, '5690px');
      }
      break;
    case 'sustainability-reports':
      if (isMobile) {
        setElementHeight(iframeWrapper, '6680px');
      } else if (isTablet) {
        if (isLandscape()) {
          setElementHeight(iframeWrapper, '2620px');
        } else {
          setElementHeight(iframeWrapper, '2260px');
        }
      } else {
        setElementHeight(iframeWrapper, '2620px');
      }
      break;
    case 'newsroom':
      if (isMobile) {
        setElementHeight(iframeWrapper, '1940px');
      } else if (isTablet) {
        if (isLandscape()) {
          setElementHeight(iframeWrapper, '1500px');
        } else {
          setElementHeight(iframeWrapper, '1600px');
        }
      } else {
        setElementHeight(iframeWrapper, '1450px');
      }
      break;
    case 'agm-egm':
      if (isMobile) {
        setElementHeight(iframeWrapper, '950px');
      } else {
        setElementHeight(iframeWrapper, '790px');
      }
      break;
    case 'analysts-coverage':
      if (isMobile) {
        setElementHeight(iframeWrapper, '1300px');
      } else if (isTablet) {
        setElementHeight(iframeWrapper, '1110px');
      } else {
        setElementHeight(iframeWrapper, '1060px');
      }
      break;
    case 'email_alerts':
      if (isMobile) {
        setElementHeight(iframeWrapper, '770px');
      } else if (isTablet) {
        setElementHeight(iframeWrapper, '660px');
      } else {
        setElementHeight(iframeWrapper, '600px');
      }
      break;
    default:
      if (isMobile) {
        setElementHeight(iframeWrapper, '1850px');
      } else {
        setElementHeight(iframeWrapper, '1220px');
      }
  }
}

export default function decorate(block) {
  const link = block.querySelector('a');
  if (!link?.href) {
    console.warn('Iframe block is missing a URL');
    return;
  }

  const iframe = document.createElement('iframe');
  const url = link.href;

  iframe.src = url;
  iframe.title = link.textContent.trim() || 'Embedded content';
  iframe.setAttribute('loading', 'lazy');
  iframe.setAttribute('width', '100%');
  iframe.setAttribute('height', '100%');
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('allowfullscreen', '');

  // Add error handling
  iframe.onerror = () => {
    console.warn(`Failed to load iframe content from: ${link.href}`);
    const errorMessage = document.createElement('div');
    errorMessage.className = 'iframe-error';
    errorMessage.textContent = 'Content temporarily unavailable';
    iframe.replaceWith(errorMessage);
  };

  const iframeWrapper = document.querySelector('.iframe-wrapper');

  const endpoint = url.match('https://gentingsingapore.listedcompany.com/([^/]+).rev')[1];

  updateIframeHeight(iframeWrapper, endpoint);
  window.addEventListener('resize', () => {
    updateIframeHeight(iframeWrapper, endpoint);
  });

  link.replaceWith(iframe);
}
