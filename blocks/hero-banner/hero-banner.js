import ImageComponent from '../../shared-components/ImageComponent.js';
import Heading from '../../shared-components/Heading.js';
import SvgIcon from '../../shared-components/SvgIcon.js';
/**
 * Loads and decorates the Hero Banner
 * @param {Element} block The herobanner block element
 */
export default function decorate(block) {
  // Create a container for the hero banner content
  const heroContainer = document.createElement('div');
  heroContainer.className = 'hero-banner-container';
  // Find the anchor link for the image
  // Find the anchor link for the image
  const imageLink = block.querySelector('a[href]');
  if (imageLink) {
    const imageUrl = imageLink.getAttribute('href');
    const imageAlt = imageLink.getAttribute('title') || 'Hero Image';

    const imageHtml = ImageComponent({
      src: imageUrl,
      alt: imageAlt,
      className: 'hero-image',
      breakpoints: {
        mobile: {
          width: 768,
          src: `${imageUrl}`,
        },
        tablet: {
          width: 1024,
          src: `${imageUrl}`,
        },
        desktop: {
          width: 1920,
          src: `${imageUrl}`,
        },
      },
      lazy: false, // Hero images should load immediately
    });

    heroContainer.insertAdjacentHTML('beforeend', imageHtml);
    imageLink.remove();
  }
  // Find the title and replace it with a heading
  const titleElement = block.querySelector('[data-aue-prop="bannertitle"]');
  if (titleElement) {
    const titleText = titleElement.textContent;
    const headingHtml = Heading({ level: 1, text: titleText, className: 'hero-title' });
    heroContainer.insertAdjacentHTML('beforeend', headingHtml);
    titleElement.remove();
  }
  // Find and add the description
  const descElement = block.querySelector('[data-aue-prop="bannerdescription"]');
  if (descElement) {
    const descriptionDiv = document.createElement('div');
    descriptionDiv.className = 'hero-description';
    descriptionDiv.textContent = descElement.textContent;
    heroContainer.appendChild(descriptionDiv);
    descElement.remove();
  }
  // Add arrow icon below description
  const arrowIconHtml = SvgIcon({
    name: 'arrow',
    className: 'hero-arrow-icon',
    size: '32',
    color: 'white',
  });
  heroContainer.insertAdjacentHTML('beforeend', arrowIconHtml);
  // Clear the original block content and append the new container
  block.textContent = '';
  block.appendChild(heroContainer);
}
