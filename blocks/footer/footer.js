import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Fetch custom component data (simulated or dynamic).
 * @returns {Object} Custom data for the footer.
 */
async function getCustomComponentData() {
  // Simulate fetching custom data (e.g., from an API or static config)
  // Replace this with an actual API call if needed
  return {
    socialLinks: [
      { name: 'Facebook', url: 'https://facebook.com', icon: 'facebook-icon.svg' },
      { name: 'Twitter', url: 'https://twitter.com', icon: 'twitter-icon.svg' },
      { name: 'LinkedIn', url: 'https://linkedin.com', icon: 'linkedin-icon.svg' },
    ],
    copyright: '© 2025 Your Company Name. All Rights Reserved.',
  };
}

/**
 * Creates a custom component for social links.
 * @param {Array} socialLinks - Array of social link objects.
 * @returns {HTMLElement} The social links container element.
 */
function createSocialLinksComponent(socialLinks) {
  const container = document.createElement('div');
  container.className = 'footer-social-links';

  socialLinks.forEach((link) => {
    const anchor = document.createElement('a');
    anchor.href = link.url;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.className = 'social-link';

    const img = document.createElement('img');
    img.src = link.icon;
    img.alt = `${link.name} Icon`;

    anchor.append(img);
    container.append(anchor);
  });

  return container;
}

/**
 * Adds custom data to the footer.
 * @param {HTMLElement} footerWrapper - The footer wrapper element.
 * @param {Object} customData - The custom data to add.
 */
function addCustomDataToFooter(footerWrapper, customData) {
  // Add social links component
  if (customData.socialLinks) {
    const socialLinksComponent = createSocialLinksComponent(customData.socialLinks);
    footerWrapper.append(socialLinksComponent);
  }

  // Add copyright text
  if (customData.copyright) {
    const copyrightElement = document.createElement('div');
    copyrightElement.className = 'footer-copyright';
    copyrightElement.textContent = customData.copyright;
    footerWrapper.append(copyrightElement);
  }
}

/**
 * Loads and decorates the footer.
 * @param {Element} block - The footer block element.
 */
export default async function decorate(block) {
  try {
    // Fetch the footer metadata and determine the footer path
    const footerMeta = getMetadata('footer');
    const footerPath = footerMeta
      ? new URL(footerMeta, window.location).pathname
      : '/footer';

    // Load the footer content as a fragment
    const fragment = await loadFragment(footerPath);

    if (fragment) {
      // Clear the block's existing content
      block.textContent = '';

      // Create the footer DOM structure
      const footerContainer = document.createElement('footer');
      footerContainer.className = 'footer-container';

      const footerWrapper = document.createElement('div');
      footerWrapper.className = 'footer-wrapper';

      // Append all children from the fragment to the footer wrapper
      while (fragment.firstElementChild) {
        footerWrapper.append(fragment.firstElementChild);
      }

      // Fetch custom component data and add it to the footer
      const customData = await getCustomComponentData();
      addCustomDataToFooter(footerWrapper, customData);

      // Assemble the final DOM structure
      footerContainer.append(footerWrapper);
      block.append(footerContainer);
    } else {
      console.warn('Footer fragment could not be loaded.');
    }
  } catch (error) {
    console.error('An error occurred while decorating the footer:', error);
  }
}
