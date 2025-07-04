function sanitizeHTMLString(str) {
  if (!str || typeof str !== 'string') return '';

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = str;

  const blockedTags = ['script', 'iframe', 'object', 'embed', 'style'];
  const blockedAttrs = [
    'onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onmouseenter',
    'srcdoc', 'formaction', 'xlink:href'
  ];
// eslint-disable-next-line no-script-url
  const blockedProtocols = ['javascript:', 'vbscript:', 'data:'];
  const urlAttributes = ['href', 'src', 'xlink:href', 'formaction'];

  // Remove dangerous elements
  blockedTags.forEach(tag => {
    tempDiv.querySelectorAll(tag).forEach(el => el.remove());
  });

  // Sanitize attributes
  const elements = tempDiv.querySelectorAll('*');
  elements.forEach(el => {
    [...el.attributes].forEach(attr => {
      const name = attr.name.toLowerCase();
      const value = attr.value.trim().toLowerCase();

      const isBlockedAttr = blockedAttrs.includes(name);
      const isBlockedProtocol =
        urlAttributes.includes(name) &&
        blockedProtocols.some(proto => value.startsWith(proto));

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


export function redirectRouter(){
  let pathName = window.location.href.split('#!/en')
  pathName = pathName[pathName.length - 1]
  
  const redirectableRoutes = {
    "/company/governance/code-of-conduct": "/sustainability/corporate-policies",
    "/company/governance/human-rights-policy": "/sustainability/corporate-policies",
    "/company/governance/tax-governance-policy": "/sustainability/corporate-policies",
    "/company/governance/whistleblowing-policy": "/sustainability/corporate-policies",
    "/sustainability/sustainability-new/ourapproach": "/sustainability",
    "/sustainability/sustainability-new/report": "/sustainability/sustainability-reports",
    "/investors/publications/annual-report": "/investors-overview/publications",
    "/investors/agm-egm": "/investors-overview/agm-egm",
    "/privacy-policy": "/contact-us/privacypolicy"
  }
  const redirectPathExist=redirectableRoutes[pathName]
  
  if(redirectPathExist){
     window.location.replace(redirectPathExist) 
  }
}

export function isMobile() {
  return window.innerWidth < 768;
};

export function controlLowerEnvironment() {
    // Authentication check - redirect to login if not authenticated and not already on login page
    const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';
    const currentPath = window.location.pathname;
    
    // If user is not authenticated and not already on login page, redirect to login
    if (!isAuthenticated && !currentPath.includes('/login')) {
      // Store current page for redirect after login
      sessionStorage.setItem('loginReferrer', window.location.href);
      console.log('User not authenticated, redirecting to login page');
      window.location.href = '/login';
      return;
    }
}

export const isIOSDevice = () => {
  return /iPhone/.test(navigator.userAgent) ||
    (navigator.userAgent.includes("Mac") && "ontouchend" in document);
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