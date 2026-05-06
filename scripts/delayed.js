// add delayed functionality here

// Create and append Adobe Launch script
const adobeLaunchScript = document.createElement('script');
adobeLaunchScript.src = 'https://assets.adobedtm.com/9a26c7c29956/9d78c9fea2b9/launch-82eb0a5e0018.min.js';
adobeLaunchScript.async = true;
document.head.appendChild(adobeLaunchScript);
