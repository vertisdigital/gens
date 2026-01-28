import Heading from '../../shared-components/Heading.js';
import ImageComponent from '../../shared-components/ImageComponent.js';
import stringToHTML from '../../shared-components/Utility.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Loads and decorates the Hero Banner
 * @param {Element} block The herobanner block element
 */
export default function decorate(block) {
  block.classList.add('fade-item');
  // Get block children early for use in fallback selectors
  const blockChildren = Array.from(block.children);

  // Read featureclass from component model
  // Try multiple selectors to find featureclass in both authoring and publishing mode
  const featureClassEl = block.querySelector('[data-aue-prop="featureclass"]')
    || block.querySelector('[data-gen-prop="featureclass"]')
    || block.querySelector('.feature-nested-1-3 p')
    || block.querySelector('.feature-nested-1-3')
    || (blockChildren[3]?.querySelector('p') ? blockChildren[3] : null)
    || (blockChildren[3]?.textContent?.trim() ? blockChildren[3] : null);

  let featureClass = '';

  if (featureClassEl) {
    // Get value from p tag if it exists, otherwise from the element itself
    const featureClassP = featureClassEl.querySelector('p') || featureClassEl;
    const featureClassValue = featureClassP?.textContent?.trim() || '';

    if (featureClassValue === 'with-images-four-col') {
      featureClass = 'with-images-four-col';
    } else if (featureClassValue === 'with-vertical-list') {
      featureClass = 'with-vertical-list';
    }

    // Only remove if it's not the block itself
    if (featureClassEl.parentNode === block || featureClassEl.parentNode?.parentNode === block) {
      featureClassEl.remove();
    }
  }

  block.classList.add('feature', 'feature-row', 'block');
  if (featureClass) {
    block.classList.add(featureClass);
  }

  const container = document.createElement('div');

  container.classList.add('container');

  const aboutUsStats = document.createElement('div');
  aboutUsStats.classList.add('about-us-stats');

  // About-Us left container - 2 column layout
  const aboutUsLeftContent = document.createElement('div');
  aboutUsLeftContent.classList.add('about-us-left');

  // Left column container (title + heading)
  const leftColumn = document.createElement('div');
  leftColumn.classList.add('about-us-left-column');

  // Right column container (sub-heading + links)
  const rightColumn = document.createElement('div');
  rightColumn.classList.add('about-us-right-column');

  const blockchildren = block.children;

  // Find the title - goes to left column
  const titleElement = blockchildren[0].children[0];
  if (titleElement && titleElement.textContent.trim() !== '') {
    const titleText = titleElement.textContent;
    const titleLabel = document.createElement('p');
    titleLabel.classList.add('about-us-left-title');
    titleLabel.textContent = titleText;
    moveInstrumentation(titleElement, titleLabel);
    leftColumn.appendChild(titleLabel);
    titleElement.remove();
  }

  // Find the heading - goes to left column
  const headingElement = blockchildren[1].children[0];
  if (headingElement && headingElement.textContent.trim() !== '') {
    const headingText = headingElement.textContent;
    const headingHtml = Heading({ level: 2, text: headingText, className: 'about-us-left-heading' });
    const parsedHtml = stringToHTML(headingHtml);
    moveInstrumentation(headingElement, parsedHtml);
    leftColumn.appendChild(parsedHtml);
    headingElement.remove();
  }

  // Find the sub-heading - goes to right column
  const subHeading = blockchildren[2].children[0];
  if (subHeading && subHeading.textContent.trim() !== '') {
    const subHeadingDiv = document.createElement('div');
    subHeadingDiv.classList.add('about-us-left-sub-heading');
    subHeadingDiv.innerHTML = subHeading.innerHTML;
    moveInstrumentation(subHeading, subHeadingDiv);
    rightColumn.appendChild(subHeadingDiv);
  }

  // Find all LinkFields and replace with arrow icons - goes to right column
  const linkField = block.querySelector('[data-aue-model="linkField"],[data-gen-model="linkField"]');
  if (linkField) {
    const linkContainer = document.createElement('div');
    linkContainer.className = 'links-container';
    moveInstrumentation(linkField, linkContainer);

    const linkDivs = Array.from(linkField.children);
    // Ensure we have the expected structure (3 elements)
    if (linkDivs.length === 3) {
      // Get elements by index with proper type checking
      const [linkTextDiv, iconDiv, targetDiv] = linkDivs;

      const linkData = {
        text: linkTextDiv?.textContent?.trim(),
        url: linkTextDiv?.querySelector('a')?.getAttribute('href'),
        icon: iconDiv?.textContent?.trim()?.replace('-', ''),
        target: targetDiv?.textContent?.trim(),
        title: linkTextDiv?.querySelector('a')?.getAttribute('title')
      };

      if (linkData.text || linkData.url) {
        const link = document.createElement('a');
        link.href = linkData.url || '#';

        // Handle special case for default AEM content
        if (linkData.text && (linkData.text.startsWith('/') || linkData.text.startsWith('#'))) {
          link.textContent = '';
        } else {
          link.textContent = linkData.text || '';
        }

        if (linkData.title) {
          link.setAttribute('title', linkData.title);
        }

        // Add circular button with arrow SVG
        const buttonSvg = `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" class="about-us-link-button">
          <path d="M24 1C36.7025 1 47 11.2975 47 24C47 36.7025 36.7025 47 24 47C11.2975 47 1 36.7025 1 24C1 11.2975 11.2975 1 24 1Z" stroke="#8D713E" stroke-width="2"/>
          <path d="M24.165 17.1323C24.3732 16.9453 24.6974 16.9581 24.8896 17.1606L30.7275 23.3218C31.0905 23.7048 31.0905 24.2961 30.7275 24.6792L24.8896 30.8393C24.6974 31.0421 24.3733 31.0549 24.165 30.8677C23.9569 30.6804 23.9437 30.3645 24.1357 30.1616L29.499 24.5005H17.5C17.2239 24.5005 17.0001 24.2765 17 24.0005C17 23.7243 17.2239 23.5005 17.5 23.5005H29.499L24.1357 17.8393C23.9435 17.6364 23.9568 17.3196 24.165 17.1323Z" fill="#8D713E"/>
        </svg>`;

        // Remove text content and replace with SVG button
        link.textContent = '';
        link.append(stringToHTML(buttonSvg));

        moveInstrumentation(linkTextDiv.querySelector('a'), link);
        linkContainer.appendChild(link);
      }

      // Remove original elements after copying
      linkTextDiv.remove();
      iconDiv.remove();
      targetDiv.remove();

      rightColumn.appendChild(linkContainer);
    }
    // Remove the original linkField container after processing
    linkField.remove();
  }

  // Append columns to left container
  aboutUsLeftContent.appendChild(leftColumn);
  aboutUsLeftContent.appendChild(rightColumn);

  // About-Us right container
  const aboutUsRightContent = document.createElement('div');
  aboutUsRightContent.classList.add('about-us-right');

  // Collect all imageAndDescription elements first
  const featureItems = [].slice.call(block.children, 4);
  if (featureItems) {
    featureItems.forEach((feature) => {
      const featureChildren = feature.children;
      // checking and validating the feature item structure, as we need to get 4 children

      // Create feature item container
      const featureContainer = document.createElement('div');
      featureContainer.classList.add('about-us-right-content');
      moveInstrumentation(feature, featureContainer);
      // Handle image feature
      const isImageExists = featureChildren[0].querySelector('a') ? true : false;
      if (isImageExists) {
        const imageElement = featureChildren[0].querySelector('a');
        const imageContainer = document.createElement('div');
        const imageLink = imageElement.getAttribute('src') ?? imageElement.getAttribute('href');
        const imgAltText = feature.querySelector('[data-aue-prop="feature-icon-alt"]')?.textContent || '';

        if (imageLink) {
          const imageHtml = ImageComponent({
            src: imageLink,
            alt: imgAltText,
            className: 'about-us-right-description-icon',
            breakpoints: {
              mobile: { width: 768, src: imageLink },
              tablet: { width: 1024, src: imageLink },
              desktop: { width: 1920, src: imageLink },
            },
            lazy: true,
          });

          const parsedImage = stringToHTML(imageHtml);
          moveInstrumentation(imageElement, parsedImage.querySelector('img'));

          imageContainer.appendChild(parsedImage);
          featureContainer.appendChild(imageContainer);
          featureContainer.classList.add('image-container');
        }
      }

      // Handle text feature
      const textElement = featureChildren[1];
      if (textElement && textElement.textContent.trim() !== '') {
        const textContainer = document.createElement('div');
        const statisticDiv = document.createElement('div');
        statisticDiv.className = 'statistic';
        moveInstrumentation(textElement, statisticDiv);

        const textContent = textElement.querySelector('p') ? textElement.querySelectorAll('p') : textElement.innerHTML;
        if (typeof textContent === 'object') {
          textContent.forEach((text) => {
            statisticDiv.appendChild(text);
          });
        } else {
          const span = document.createElement('p');
          span.innerHTML = textContent;
          statisticDiv.appendChild(span);
        }

        textContainer.appendChild(statisticDiv);
        featureContainer.appendChild(textContainer);
        featureContainer.classList.add('text-container');
      }

      // Handle feature heading
      const featureHeadingElement = featureChildren[2];
      if (featureHeadingElement) {
        const headingContainer = document.createElement('div');
        const featureHeadingP = document.createElement('p');
        featureHeadingP.innerHTML = featureHeadingElement.innerHTML;
        Array.from(featureHeadingElement.attributes).forEach((attr) => {
          featureHeadingP.setAttribute(attr.name, attr.value);
        });
        headingContainer.appendChild(featureHeadingP);
        featureContainer.appendChild(headingContainer);
      }
      aboutUsRightContent.appendChild(featureContainer);
    });
  }
  // check if data-aue-model="indices" exists
  const indices = blockchildren[blockchildren.length - 1];
  if (indices && indices.children.length === 3) {
    // get less indices, more indices and indexnumber content elements
    const lessIndices = indices.children[1];
    const moreIndices = indices.children[0];
    const indexElement = indices.children[2];
    const indexNumber = parseInt(
      indexElement?.textContent,
      10,
    );
    indexElement.style.display = 'none';
    // show the link to show more indices
    const showMoreIndicesLink = document.createElement('button');
    moveInstrumentation(moreIndices, showMoreIndicesLink);
    // show the link to show less indices
    const showLessIndicesLink = document.createElement('button');
    moveInstrumentation(lessIndices, showLessIndicesLink);

    // getting all the feature items in aboutUsDescription
    const convDescription = aboutUsRightContent.children;
    // removing the first child of all the feature items for the indices variant
    for (let i = 0; i < convDescription.length; i += 1) {
      if (convDescription[i].children[0].textContent?.trim() === '' && !convDescription[i].children[0].querySelector('picture, img')) { convDescription[i].children[0]?.remove(); }
    }
    // featureitems are  more than indexNumber indices then hide
    // the remaing and show link to show more indices link with remaining indices count in text
    if (!Number.isNaN(indexNumber) && indexNumber > 0 && indexNumber < convDescription.length) {
      // hide the remaining indices
      for (let i = indexNumber; i < convDescription.length; i += 1) {
        convDescription[i].style.display = 'none';
      }

      showMoreIndicesLink.textContent = `${moreIndices?.textContent ?? 'Show More'
      } (${convDescription.length - indexNumber})`;
      showMoreIndicesLink.classList.add('show-more-indices');
      showMoreIndicesLink.addEventListener('click', () => {
        for (let i = indexNumber; i < convDescription.length - 1; i += 1) {
          convDescription[i].style.display = 'flex';
        }
        showMoreIndicesLink.style.display = 'none';
        showLessIndicesLink.style.display = 'block';
      });

      showLessIndicesLink.textContent = lessIndices?.textContent ?? 'Show Less';
      showLessIndicesLink.classList.add('show-less-indices');
      showLessIndicesLink.style.display = 'none';
      showLessIndicesLink.addEventListener('click', () => {
        for (let i = indexNumber; i < convDescription.length - 1; i += 1) {
          convDescription[i].style.display = 'none';
        }
        showMoreIndicesLink.style.display = 'block';
        showLessIndicesLink.style.display = 'none';
      });
      indices.innerHTML = '';
      indices.appendChild(showMoreIndicesLink);
      indices.appendChild(showLessIndicesLink);
    } else {
      indices.style.display = 'none';
    }

    indices.appendChild(indexElement);
    aboutUsRightContent.appendChild(indices);
  }
  block.innerHTML = '';
  aboutUsStats.appendChild(aboutUsLeftContent);
  aboutUsStats.appendChild(aboutUsRightContent);
  container.append(aboutUsStats);
  block.appendChild(container);
}
