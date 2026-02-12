import ImageComponent from '../../shared-components/ImageComponent.js';
import SvgIcon from '../../shared-components/SvgIcon.js';
import stringToHtml from '../../shared-components/Utility.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  block.classList.add('container');
  block.classList.add('fade-item');

  // Process list items
  const listItems = block.querySelectorAll('[data-aue-model="listitem"], [data-gen-model="listitem"]');
  const isListingWithoutImage = block.classList.contains('without-images');

  
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
    if (imgContainer && !isListingWithoutImage) {
      imgContainer.classList.add('col-xl-4', 'col-md-2', 'col-sm-4');

      const imgAnchor = imgContainer.querySelector('a');
      if (imgAnchor) {
        // Set initial src to ensure img tag has a value
        const imageUrl = imgAnchor.href;
        const imageAlt =item.querySelectorAll('a[href]')[1]?.getAttribute('title') || '';
        const imageHtml = ImageComponent({
            src: imageUrl,
            alt: imageAlt,
            className: 'listing-image',
            asImageName: 'listing.webp',
            breakpoints: {
              mobile: {
                width: 768,
                src: `${imageUrl}`,
                imgWidth: 400,
                imgHeight: 250,
              },
              tablet: {
                width: 993,
                src: `${imageUrl}`,
                imgWidth: 400,
                imgHeight: 250,
              },
              desktop: {
                width: 1920,
                src: `${imageUrl}`,
                imgWidth: 400,  
                imgHeight: 250,
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

    if(isListingWithoutImage) {
      contentWrapper.classList.add('col-xl-12', 'col-md-6', 'col-sm-4', 'content-wrapper');
    } else {
      contentWrapper.classList.add('col-xl-8', 'col-md-4', 'col-sm-4', 'content-wrapper');
    }

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

      // Create circular arrow SVG button
      const arrowSVG = `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 1C36.7025 1 47 11.2975 47 24C47 36.7025 36.7025 47 24 47C11.2975 47 1 36.7025 1 24C1 11.2975 11.2975 1 24 1Z" stroke="#8D713E" stroke-width="2"/>
        <path d="M24.165 17.1323C24.3732 16.9453 24.6974 16.9581 24.8896 17.1606L30.7275 23.3218C31.0905 23.7048 31.0905 24.2961 30.7275 24.6792L24.8896 30.8393C24.6974 31.0421 24.3733 31.0549 24.165 30.8677C23.9569 30.6804 23.9437 30.3645 24.1357 30.1616L29.499 24.5005H17.5C17.2239 24.5005 17.0001 24.2765 17 24.0005C17 23.7243 17.2239 23.5005 17.5 23.5005H29.499L24.1357 17.8393C23.9435 17.6364 23.9568 17.3196 24.165 17.1323Z" fill="#8D713E"/>
      </svg>`;
      newArrowLink.innerHTML = arrowSVG;

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
          size: '24px',
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

  // Handle 2-column layout for without-images variation
  if (isListingWithoutImage) {
    const blockChildren = Array.from(block.children);
    
    // Get first 2 title elements (usually first 2 children that have title but not listitem)
    const firstTwoTitles = [];
    const remainingElements = [];
    
    blockChildren.forEach((child) => {
      const hasTitle = child.querySelector('[data-gen-prop="title"], [data-aue-prop="title"]');
      const hasListItem = child.querySelector('[data-gen-model="listitem"], [data-aue-model="listitem"]') || 
                          (child.hasAttribute('data-gen-model') && child.getAttribute('data-gen-model') === 'listitem') ||
                          (child.hasAttribute('data-aue-model') && child.getAttribute('data-aue-model') === 'listitem');
      const isLinkField = (child.hasAttribute('data-gen-model') && child.getAttribute('data-gen-model') === 'linkField') ||
                          (child.hasAttribute('data-aue-model') && child.getAttribute('data-aue-model') === 'linkField');
      
      if (hasTitle && !hasListItem && !isLinkField && firstTwoTitles.length < 2) {
        firstTwoTitles.push(child);
      } else {
        remainingElements.push(child);
      }
    });

    // Create left column wrapper for titles
    if (firstTwoTitles.length > 0) {
      const leftColumn = document.createElement('div');
      leftColumn.classList.add('without-images-left-column');
      
      firstTwoTitles.forEach(titleElement => {
        leftColumn.appendChild(titleElement);
      });

      // Create right column wrapper for list items and linkField
      const rightColumn = document.createElement('div');
      rightColumn.classList.add('without-images-right-column');
      
      remainingElements.forEach(element => {
        rightColumn.appendChild(element);
      });

      // Create row wrapper
      const rowWrapper = document.createElement('div');
      rowWrapper.classList.add('without-images-row');
      rowWrapper.appendChild(leftColumn);
      rowWrapper.appendChild(rightColumn);

      // Clear block and add new structure
      block.innerHTML = '';
      block.appendChild(rowWrapper);
    }
  }
}
