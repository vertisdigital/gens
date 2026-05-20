// List of allowed domains for analytics
const ANALYTICS_DOMAINS = [
  'gentingsingapore.com',
  'main--gens-prod--vertisdigital.aem.live',
  'ut.gentingsingapore.com',
  'uat--gens-stage--vertisdigital.aem.live',
  'dev--gens--vertisdigital.aem.live',
];

const { hostname } = window.location;
const isAnalyticsAllowed = ANALYTICS_DOMAINS.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`));

if (isAnalyticsAllowed) {
  // Create and append Adobe Launch script
  const adobeLaunchScript = document.createElement('script');
  adobeLaunchScript.src = 'https://assets.adobedtm.com/9a26c7c29956/9d78c9fea2b9/launch-c830de7b55b7-development.min.js';
  adobeLaunchScript.async = true;
  document.head.appendChild(adobeLaunchScript);
}
