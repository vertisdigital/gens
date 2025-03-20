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
    "/company/governance/code-of-conduct": "/index/sustainability/corporate-policies",
    "/company/governance/human-rights-policy": "/index/sustainability/corporate-policies",
    "/company/governance/tax-governance-policy": "/index/sustainability/corporate-policies",
    "/company/governance/whistleblowing-policy": "/index/sustainability/corporate-policies",
    "/sustainability/sustainability-new/ourapproach": "/index/sustainability",
    "/sustainability/sustainability-new/report": "/index/sustainability/sustainability-reports",
    "/investors/publications/annual-report": "/index/investors-overview/publications"
  }
  const redirectPathExist=redirectableRoutes[pathName]
  
  if(redirectPathExist){
     window.location.replace(redirectPathExist) 
  }
}