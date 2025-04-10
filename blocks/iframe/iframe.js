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
  const isMobile = window.innerWidth < 767;
  const isTablet = window.innerWidth >= 768 && window.innerWidth <= 993;

  let deviceType = 'desktop';
  if (isMobile) {
    deviceType = 'mobile';
  }
  if (isTablet) {
    deviceType = 'tablet';
  }
  
  const endpointHeightConfig = {
    home: {
      mobile: '1850px',
      desktop: '1220px',
    },
    'annual-reports': {
      mobile: '15600px',
      tablet: '4640px',
      desktop: '5690px',
    },
    'sustainability-reports': {
      mobile: '6680px',
      tablet: {
        landscape: '2620px',
        portrait: '2260px',
      },
      desktop: '2620px',
    },
    newsroom: {
      mobile: '3000px',
      tablet: {
        landscape: '1500px',
        portrait: '1570px',
      },
      desktop: '1430px',
    },
    'agm-egm': {
      mobile: '950px',
      desktop: '790px',
    },
    'analysts-coverage': {
      mobile: '1300px',
      tablet: '1110px',
      desktop: '1060px',
    },
    'share-quote-and-chart': {
       mobile: '3500px',
      tablet: '1900px',
      desktop: '1850px',
    },
    email_alerts: {
      mobile: '770px',
      tablet: '660px',
      desktop: '600px',
    },
    "Historic Price Lookup":{
      mobile: '1850px',
      desktop: '1220px',
    },
    "Investment Calculator":{
      mobile: '1100px',
      desktop: '860px',
      tablet: '960px',
      disableScroll:true
    },
    "Share Quote And Chart":{
      desktop: '1860px',
      tablet:"3240px",
      mobile:"3540px"
    },
    "Annual Reports":{
      mobile: '13890px',
      tablet: '26020px',
      desktop: '5690px',
    },
    "Sustainability Reports":{
      mobile: '6680px',
      tablet: "11340px",
      desktop: '2620px',
    },
    "investor-calendar":{
      mobile: '1020px',
      tablet: "640px",
      desktop: '640px',
    },
    default: {
      mobile: '1850px',
      desktop: '1220px',
    },
  };

  let height = endpointHeightConfig[endpoint];

  if (typeof height === 'object') {
    if (deviceType === 'tablet') {
      if (isLandscape()) {
        height = height[deviceType]?.landscape || height[deviceType];
      } else {
        height = height[deviceType]?.portrait || height[deviceType];
      }
    } else {
      height = height[deviceType] || height.desktop;
    }
  }

  if (height) {
    setElementHeight(iframeWrapper, height);
  } else {
    setElementHeight(iframeWrapper, endpointHeightConfig.default);
  }
  
  const iframe=iframeWrapper.querySelector('iframe')

  if(endpointHeightConfig[endpoint]?.disableScroll && iframe){
    iframe.setAttribute('scrolling','no')
  }
}

function getTabsEvent(){
  const tabs = document.querySelectorAll('.tab-title');
  const iframeWrappers = document.querySelectorAll('.iframe-wrapper');
  const SHARE_QUOTE_IFRAME=0;
  updateIframeHeight(iframeWrappers[SHARE_QUOTE_IFRAME],`${tabs[SHARE_QUOTE_IFRAME].innerHTML}`)
  
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      updateIframeHeight(iframeWrappers[index],`${tabs[index].innerHTML}`)
    });
  });
}

function updateIframeForTab(){
  const tabsIframePages={
    '/index/investors-overview/publications':true,
    '/index/investors-overview/stock-information':true
  }
  const isTabIframeRoute=tabsIframePages[window.location.pathname.replace('#','')]
   if(isTabIframeRoute){
      getTabsEvent();
    } 
}

export default function decorate(block) {
  const link = block.querySelector('a');
  link.remove();

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
  iframeWrapper.classList.add('container');
  const endpoint = new window.URL(url).pathname.replace('/', '').replace('.rev', '');
  updateIframeHeight(iframeWrapper, endpoint);
  updateIframeForTab();
  
  window.addEventListener('resize', () => {
    updateIframeHeight(iframeWrapper, endpoint);
    updateIframeForTab();
  });


  block.appendChild(iframe);
}
