import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  // Remove data-gen attributes and historymilestones-nested classes
  const cleanupElements = block.querySelectorAll('[class*="historymilestones-nested"], [data-gen-prop], [data-gen-type], [data-gen-model], [data-gen-label]');
  cleanupElements.forEach(element => {
    // Remove data-gen attributes
    const attrs = element.attributes;
    for(let i = attrs.length - 1; i >= 0; i--) {
      const attr = attrs[i];
      if(attr.name.startsWith('data-gen') || attr.name === 'class' && attr.value.includes('historymilestones-nested')) {
        element.removeAttribute(attr.name);
      }
    }
  });

  // Process images
  const imageLinks = block.querySelectorAll('a[href*="delivery-"], a[href*="/adobe/assets/"]');
  imageLinks.forEach(link => {
    // Get the full delivery URL
    const fullUrl = link.href;
    const assetPath = fullUrl.match(/\/adobe\/assets\/.*$/)[0];
    const deliveryUrl = fullUrl.replace(assetPath, '');

    const picture = createOptimizedPicture(link.href, '', false, [
      { media: '(min-width: 768px)', width: '400', format: 'webp' },
      { width: '320', format: 'webp' },
    ]);

    // Update image paths to use full delivery URL
    const sources = picture.querySelectorAll('source');
    sources.forEach(source => {
      const srcset = source.getAttribute('srcset');
      if (srcset) {
        source.setAttribute('srcset', srcset.replace('/adobe/assets/', deliveryUrl + '/adobe/assets/'));
      }
    });

    const img = picture.querySelector('img');
    if (img) {
      const src = img.getAttribute('src');
      img.setAttribute('src', src.replace('/adobe/assets/', deliveryUrl + '/adobe/assets/'));
    }

    link.parentNode.replaceChild(picture, link);
  });
}
