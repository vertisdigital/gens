// List of allowed domains for analytics
const ANALYTICS_DOMAINS = [
  'gentingsingapore.com',
  'main--gens-prod--genting-sg.aem.live',
  'ut.gentingsingapore.com',
  'uat--gens-stage--genting-sg.aem.live',
  'dev--gens--genting-sg.aem.live',
  'main--gens-prod--vertisdigital.aem.live',
  'uat--gens-stage--vertisdigital.aem.live',
  'dev--gens--vertisdigital.aem.live',
];

const { hostname } = window.location;
const isAnalyticsAllowed = ANALYTICS_DOMAINS.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`));

if (isAnalyticsAllowed) {
  const isUatDomain = hostname === 'ut.gentingsingapore.com'
    || hostname.includes('uat--gens-stage--genting-sg')
    || hostname.includes('uat--gens-stage--vertisdigital');

  const isProdDomain = hostname === 'gentingsingapore.com'
    || hostname === 'www.gentingsingapore.com'
    || hostname.includes('main--gens-prod--genting-sg')
    || hostname.includes('main--gens-prod--vertisdigital');

  // Automatically select Adobe Launch script URL based on environment hostname
  let launchUrl = 'https://assets.adobedtm.com/9a26c7c29956/9d78c9fea2b9/launch-c830de7b55b7-development.min.js';

  if (isProdDomain) {
    launchUrl = 'https://assets.adobedtm.com/9a26c7c29956/9d78c9fea2b9/launch-82eb0a5e0018.min.js';
  } else if (isUatDomain) {
    launchUrl = 'https://assets.adobedtm.com/9a26c7c29956/9d78c9fea2b9/launch-0643cd1b44f3-staging.min.js';
  }

  // Create and append Adobe Launch script
  const adobeLaunchScript = document.createElement('script');
  adobeLaunchScript.src = launchUrl;
  adobeLaunchScript.async = true;
  document.head.appendChild(adobeLaunchScript);
}
