import SvgIcon from './SvgIcon.js';

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



export function downloadLink(item) {
  const LABEL = '.project-subtitle';
  const LINK = '.project-long-description';
  const ICON = '.project-short-description';
  const downloadLinkElements = item.querySelectorAll('[data-aue-model="downloadlinkitem"]')

  if (!downloadLinkElements.length) return
  
  downloadLinkElements.forEach(downloadLinkElement=>{
    const linkTag = document.createElement('a')
    linkTag.setAttribute('target', '_blank')
    linkTag.classList.add('download-link-item')
    linkTag.href = downloadLinkElement.querySelector(LINK).querySelector('a').href
    linkTag.innerHTML = `<span>${downloadLinkElement.querySelector(LABEL).textContent}</span>`
  
    const iconName = downloadLinkElement.querySelector(ICON).textContent.replace(/-/g, "").toLowerCase().trim()
    const icon = SvgIcon({
      name: iconName,
      className: '',
      size: '16px',
    });
  
    linkTag.append(stringToHTML(icon));
  
    downloadLinkElement.innerHTML = ""
    downloadLinkElement.append(linkTag)
  })
}