// convert string to HTML Element
function stringToHTML(str) {
  if(!str)
    return '';
  const parser = new DOMParser();
  const doc = parser.parseFromString(str, 'text/html');
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