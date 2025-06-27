import Heading from '../../shared-components/Heading.js';
import ImageComponent from '../../shared-components/ImageComponent.js';
import SvgIcon from '../../shared-components/SvgIcon.js';
import stringToHTML from '../../shared-components/Utility.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Loads and decorates the Hero Banner
 * @param {Element} block The herobanner block element
 */
export default function decorate(block) {

  const container = document.createElement('div');

  container.classList.add('container');

  const aboutUsStats = document.createElement('div');
  aboutUsStats.classList.add('row', 'about-us-stats');

  // About-Us left container
  const aboutUsLeftContent = document.createElement('div');
  aboutUsLeftContent.classList.add('col-xl-6', 'col-md-3', 'col-sm-4', 'about-us-left');
  const blockchildren = block.children;
  // Find the title and replace it with a heading
  const titleElement = blockchildren[0].children[0];
  if (titleElement && titleElement.textContent.trim() !== '') {
    const titleText = titleElement.textContent;
    const titleHtml = Heading({ level: 3, text: titleText, className: 'about-us-left-title' });
    const parsedHtml = stringToHTML(titleHtml);
    moveInstrumentation(titleElement, parsedHtml);
    aboutUsLeftContent.append(parsedHtml);
    titleElement.remove();
  }

  // Find the heading and replace it with a heading
  const headingElement = blockchildren[1].children[0];
  if (headingElement && headingElement.textContent.trim() !== '') {
    const headingText = headingElement.textContent;
    const headingHtml = Heading({ level: 2, text: headingText, className: 'about-us-left-heading' });
    const parsedHtml = stringToHTML(headingHtml);
    moveInstrumentation(headingElement, parsedHtml);
    aboutUsLeftContent.append(parsedHtml);
    headingElement.remove();
  }

  // Find the sub-heading and replace it with a sub-heading

  const subHeading = blockchildren[2].children[0];
  if (subHeading && subHeading.textContent.trim() !== '') {
    subHeading.classList.add('about-us-left-sub-heading');
    aboutUsLeftContent.appendChild(subHeading);
  }

  // Find all LinkFields and replace with arrow icons
  const linkField = block.querySelector('[data-aue-model="linkField"],[data-gen-model="linkField"]');
  const isRightSectionLink = block?.classList?.contains('right-section-learnmore');
  if (linkField && !isRightSectionLink) {
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
        link.target = linkData.target || '_self';
        // Handle special case for default AEM content
        if (linkData.text.startsWith('/') || linkData.text.startsWith('#')) {
          link.textContent = '';
        } else {
          link.textContent = linkData.text;
        }

        if (linkData.title) {
          link.setAttribute('title', linkData.title);
        }

        // Add icon if specified
        if (linkData.icon) {
          const arrowSVG = SvgIcon({ 
            name: linkData.icon, 
            className: 'about-us-left-link', 
            size: '24px' 
          });
          link.append(stringToHTML(arrowSVG));
        }

        moveInstrumentation(linkTextDiv.querySelector('a'), link);
        linkContainer.appendChild(link);
      }
      
      // Remove original elements after copying
      linkTextDiv.remove();
      iconDiv.remove();
      targetDiv.remove();
      
      aboutUsLeftContent.appendChild(linkContainer);
    }
    // Remove the original linkField container after processing
    linkField.remove();
  }

  // About-Us right container
  const aboutUsRightContent = document.createElement('div');
  aboutUsRightContent.classList.add('col-xl-6', 'col-md-3', 'col-sm-4', 'about-us-right');

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
      if(featureChildren[0]?.querySelector('[data-aue-prop="linkText"],[data-gen-prop="linkText"]') || feature?.getAttribute('data-gen-model') === 'linkField' ) {
        return;
      }
      // Handle image feature
      const isImageExists = featureChildren[0]?.querySelector('a') ? true : false;
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
  if (linkField && isRightSectionLink) {
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
        link.target = linkData.target || '_self';
        link.classList.add('global-learn-more');
        // Handle special case for default AEM content
        if (linkData.text.startsWith('/') || linkData.text.startsWith('#')) {
          link.textContent = '';
        } else {
          link.textContent = linkData.text;
        }

        if (linkData.title) {
          link.setAttribute('title', linkData.title);
        }

        // Add icon if specified
        if (linkData.icon) {
          const arrowSVG = SvgIcon({ 
            name: linkData.icon, 
            className: 'about-us-left-link', 
            size: '24px' 
          });
          link.append(stringToHTML(arrowSVG));
        }

        moveInstrumentation(linkTextDiv.querySelector('a'), link);
        linkContainer.appendChild(link);
      }
      
      // Remove original elements after copying
      linkTextDiv.remove();
      iconDiv.remove();
      targetDiv.remove();
      
      aboutUsRightContent.appendChild(linkContainer);
    }
    // Remove the original linkField container after processing
    linkField.remove();
  }
  block.innerHTML = '';
  aboutUsStats.appendChild(aboutUsLeftContent);
  aboutUsStats.appendChild(aboutUsRightContent);
  container.append(aboutUsStats);
  block.appendChild(container);
}