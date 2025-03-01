import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
    // Remove data-gen attributes and historymilestones-nested classes
    const cleanupElements = block.querySelectorAll('[class*="historymilestones-nested"], [data-gen-prop], [data-gen-type], [data-gen-model], [data-gen-label]');
    cleanupElements.forEach(element => {
        // Remove data-gen attributes
        const attrs = element.attributes;
        for (let i = attrs.length - 1; i >= 0; i -= 1) {
            const attr = attrs[i];
            if ((attr.name.startsWith('data-gen')) || (attr.name === 'class' && attr.value.includes('historymilestones-nested'))) {
                element.removeAttribute(attr.name);
            }
        }
    });

    // Process images
    const imageLinks = block.querySelectorAll('a[href*="delivery-"], a[href*="/adobe/assets/"]');
    imageLinks.forEach(link => {
        // Get the base delivery URL and asset URN
        const fullUrl = link.href;

        // Extract asset path with regex
        const assetPathMatch = fullUrl.match(/\/adobe\/assets\/.*$/);
        if (!assetPathMatch) return;
        const assetPath = assetPathMatch[0];
        const deliveryUrl = fullUrl.replace(assetPath, '');

        // Create picture element with optimized sources
        const picture = createOptimizedPicture(fullUrl, '', false, [
            { media: '(min-width: 768px)', width: '800' },
            { width: '400' }
        ]);

        // Function to fix the image source URLs
        const fixImageSrc = (img, width, height) => {
            if (img) {
                let src = img.getAttribute('src');
                if (src) {
                    // Construct the new URL with width and height parameters
                    let newSrc = `${deliveryUrl}/adobe/assets/${assetPath.split('/')[3]}/as/img.png?width=${width}&height=${height}`;
                    img.setAttribute('src', newSrc);
                }
            }
        };

        // Update image paths with correct delivery URL format for sources
        const sources = picture.querySelectorAll('source');
        sources.forEach(source => {
            let srcset = source.getAttribute('srcset');
            if (srcset) {
                // For srcset, we'll just use the 349 width and 206 height
                const width = '349';
                const height = '206';
                let newSrcset = `${deliveryUrl}/adobe/assets/${assetPath.split('/')[3]}/as/img.png?width=${width}&height=${height}`;
                source.setAttribute('srcset', newSrcset);
            }
        });

        // Update image path for the img tag
        const img = picture.querySelector('img');
        fixImageSrc(img, '349', '206');

        link.parentNode.replaceChild(picture, link);
    });
}