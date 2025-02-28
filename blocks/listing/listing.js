import ImageComponent from '../../shared-components/ImageComponent.js';
import SvgIcon from '../../shared-components/SvgIcon.js';
import stringToHtml from '../../shared-components/Utility.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

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

    // Handle title with moveInstrumentation
    const titleContainer = allDivElements[1];
    const title = titleContainer.querySelector('p');
    if (title) {
      moveInstrumentation(titleContainer, title);
    }

    // Handle description with moveInstrumentation
    const descContainer = allDivElements[2];
    const description = descContainer.querySelector('p');
    if (description) {
      moveInstrumentation(descContainer, description);
    }

    const link = item.querySelector('.button-container a');

    // Handle link target with moveInstrumentation
    const linkTargetContainer = allDivElements[4];
    const linkTarget = linkTargetContainer.querySelector('p');
    if (linkTarget) {
      moveInstrumentation(linkTargetContainer, linkTarget);
    }

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

        const imageHtml = ImageComponent({
          src: imgAnchor.href,
          alt: '',
          className: 'listing-image',
          breakpoints: {
            mobile: {
              width: 768,
              src: `${imgAnchor.href}`,
            },
            tablet: {
              width: 1024,
              src: `${imgAnchor.href}`,
            },
            desktop: {
              width: 1920,
              src: `${imgAnchor.href}`,
            },
          },
          lazy: true,
        });

        // Replace anchor with picture element containing the image
        imgContainer.innerHTML = '';
        imgContainer.append(stringToHtml(imageHtml));
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
  const linkField = block.querySelector('[data-aue-model="linkField"],[data-gen-model="linkField"]');
  if (linkField) {
    // Get elements using index-based approach
    const divElements = linkField.children;
    const linkWrapper = divElements[0]?.querySelector('.button-container a');
    const iconType = divElements[1]?.querySelector('p')?.textContent?.trim();
    const targetValue = divElements[2]?.querySelector('p')?.textContent?.trim() || '_self';

    if (linkWrapper) {
      // Set target attribute
      linkWrapper.setAttribute('target', targetValue);

      // Add arrow icon if icon type is specified
      if (iconType) {
        const iconName = iconType.replace('-', '');
        const arrowSVG = SvgIcon({ 
          name: iconName, 
          className: 'about-us-left-link', 
          size: '24px' 
        });
        divElements[1].textContent = '';
        divElements[2].textContent = '';
        linkWrapper.append(stringToHtml(arrowSVG));
      }
      linkField.textContent = '';
      linkField.appendChild(linkWrapper);
      block.appendChild(linkField);
    }
  }
}
