import ImageComponent from '../../shared-components/ImageComponent.js';
import stringToHtml from '../../shared-components/Utility.js';
import SvgIcon from '../../shared-components/SvgIcon.js';

export default function decorate(block) {
  // Add container classes from styles.css
  block.classList.add('container-xl', 'container-md', 'container-sm');

  // Process list items
  const listItems = block.querySelectorAll('[data-aue-model="listitem"], [data-gen-model="listitem"]');
  listItems.forEach((item) => {
    // Create row from styles.css
    const row = document.createElement('div');
    row.classList.add('row');

    // Get all content elements
    const allDivElements = item.querySelectorAll('div');
    // const title = item.querySelector('[data-aue-type="text"], [data-gen-type="text"]');
    const title = allDivElements[1].querySelector('p');
    const description = allDivElements[2].querySelector('p');
    const link = item.querySelector('.button-container a');
    // const linkTarget = item.querySelector('[data-aue-label="Target"]');
    const linkTarget = allDivElements[4].querySelector('p');

    // Process image
    const imgContainer = item.querySelector('div:first-child');
    if (imgContainer) {
      imgContainer.classList.add('col-xl-4', 'col-md-2', 'col-sm-4');

      const imgAnchor = imgContainer.querySelector('a');
      if (imgAnchor) {
        const img = document.createElement('img');
        // Set initial src to ensure img tag has a value
        img.src = imgAnchor.href;
        img.alt = '';

        const imageComp = ImageComponent({
          element: img,
          src: imgAnchor.href,
          alt: '',
          lazy: true,
        });

        // Convert imageComp to DOM element using stringToHtml utility
        const imageElement = stringToHtml(imageComp);
        
        // Append the image element
        imgContainer.innerHTML = '';
        imgContainer.appendChild(imageElement);
      }
      row.appendChild(imgContainer);
    }

    // Create single wrapper for content
    const contentWrapper = document.createElement('div');
    contentWrapper.classList.add('col-xl-8', 'col-md-4', 'col-sm-4', 'content-wrapper');

    // Add content elements to wrapper
    if (title) {
      contentWrapper.appendChild(title);
    }
    if (description) {
      contentWrapper.appendChild(description);
    }

    if (link) {
      const newArrowLink = document.createElement('a');
      const arrowLink = link.href;
      newArrowLink.href = arrowLink;
      newArrowLink.classList.add('arrow-link-wrapper');
      const targetValue = linkTarget?.textContent?.trim() || '_self';
      newArrowLink.setAttribute('target', targetValue);

      // Create left arrow icon
      const leftArrowSVG = SvgIcon({ name: 'arrow', className: 'left-arrow-icon', size: '24px' });
      const parsedLeftArrowSVG = stringToHtml(leftArrowSVG);
      newArrowLink.appendChild(parsedLeftArrowSVG);

      contentWrapper.appendChild(newArrowLink);
    }

    // Add content wrapper to row
    row.appendChild(contentWrapper);

    // Replace item content with new row
    item.innerHTML = '';
    item.appendChild(row);

    // Add accessibility attributes
    item.setAttribute('role', 'listitem');
    item.setAttribute('tabindex', '0');
  });

  // Process CTA section
  const ctaContainer = block.querySelector('[data-aue-model="linkField"], [data-gen-model="linkField"]');
  const ctaText = ctaContainer.querySelector('[data-aue-prop="linkTarget"], [data-gen-prop="linkTarget"]');
  ctaText.innerHTML = '';
}
