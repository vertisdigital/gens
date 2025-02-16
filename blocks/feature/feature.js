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
  // const featureResource = block.querySelector('[data-aue-label="Feature"]');

  const container = document.createElement('div');
  // moveInstrumentation(featureResource, container);

  container.classList.add('container-xl', 'container-lg', 'container-md', 'container-sm');

  const aboutUsStats = document.createElement('div');
  aboutUsStats.classList.add('row', 'about-us-stats');

  // About-Us left container
  const aboutUsLeftContent = document.createElement('div');
  aboutUsLeftContent.classList.add('col-xl-6', 'col-md-3', 'col-sm-4', 'about-us-left');

  // Find the title and replace it with a heading
  const titleElement = block.querySelector('[data-aue-prop="title"]');
  if (titleElement) {
    const header = document.createElement('header');
    moveInstrumentation(titleElement, header);

    const titleText = titleElement.textContent;
    const titleHtml = Heading({ level: 3, text: titleText, className: 'about-us-left-title' });
    const parsedHtml = stringToHTML(titleHtml);
    header.append(parsedHtml);
    aboutUsLeftContent.append(header);
    titleElement.remove();
  }

  // Find the heading and replace it with a heading
  const headingElement = block.querySelector('[data-aue-prop="heading"]');
  if (headingElement) {
    const headingText = headingElement.textContent;
    const headingHtml = Heading({ level: 2, text: headingText, className: 'about-us-left-heading' });
    const parsedHtml = stringToHTML(headingHtml);
    moveInstrumentation(headingElement, parsedHtml);
    aboutUsLeftContent.append(parsedHtml);
    headingElement.remove();
  }

  // Find the sub-heading and replace it with a sub-heading

  const subHeading = block.querySelector('[data-aue-prop="sub-heading"]');
  if (subHeading) {
    const subHeadingElement = document.createElement('p');
    subHeadingElement.className = 'about-us-left-sub-heading';
    moveInstrumentation(subHeading, subHeadingElement);
    const subHeadingText = subHeading.querySelector('p').textContent;
    subHeadingElement.textContent = subHeadingText;
    aboutUsLeftContent.appendChild(subHeadingElement);
    subHeading.remove();
  }

  // Find all LinkFields and replace with arrow icons
  const linkField = block.querySelector('[data-aue-model="linkField"]');
  if (linkField) {
    const linkContainer = document.createElement('div');
    linkContainer.className = 'links-container';
    moveInstrumentation(linkField, linkContainer);
    // Handle link text
    const originalLink = linkField.querySelector('[data-aue-prop="linkText"]');
    const originalTarget = linkField.querySelector('[data-aue-prop="linkTarget"]');
    const arrowIcon = linkField.querySelector('[data-aue-prop="linkSvgIcon"]');

    if (originalLink && originalTarget) {
      originalLink.setAttribute('target', originalTarget?.textContent.trim());
      originalTarget.textContent = '';
      if (arrowIcon) {
        const arrowIconName = arrowIcon?.textContent.replace('-', '');
        arrowIcon.textContent = '';
        const arrowSVG = SvgIcon({ name: `${arrowIconName}`, className: 'about-us-left-link', size: '24px' });
        originalLink.append(stringToHTML(arrowSVG));
      }
      linkContainer.appendChild(originalLink);
    }
    aboutUsLeftContent.appendChild(linkContainer);
  }

  // About-Us right container
  const aboutUsRightContent = document.createElement('div');
  aboutUsRightContent.classList.add('col-xl-6', 'col-md-3', 'col-sm-4', 'about-us-right');

  // Collect all imageAndDescription elements first
  const aboutUsDescription = block.querySelectorAll('[data-aue-model="featureItem"]');
  if (aboutUsDescription) {
    aboutUsDescription.forEach((description) => {
      // Create feature item container
      const featureContainer = document.createElement('div');
      featureContainer.classList.add('about-us-right-content');
      moveInstrumentation(description, featureContainer);

      // Handle image feature
      const imageElement = description.querySelector('[data-aue-prop="feature-icon"]');
      if (imageElement) {
        const imageContainer = document.createElement('div');
        const imageLink = imageElement.getAttribute('src');
        const imgAltText = description.querySelector('[data-aue-prop="feature-icon-alt"]')?.textContent || '';

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
      const textElement = description.querySelector('[data-aue-prop="feature-title"],[data-richtext-prop="feature-title"]');
      if (textElement) {
        const textContainer = document.createElement('div');
        const statisticDiv = document.createElement('div');
        statisticDiv.className = 'statistic';
        moveInstrumentation(textElement, statisticDiv);

        const textContent = textElement.querySelector('p') ? textElement.querySelectorAll('p') : textElement.textContent;
        if (typeof textContent === 'object') {
          textContent.forEach((text) => {
            const span = document.createElement('span');
            span.textContent = text.textContent;
            moveInstrumentation(text, span);
            statisticDiv.appendChild(span);
          });
        } else {
          const span = document.createElement('span');
          span.textContent = textContent;
          statisticDiv.appendChild(span);
        }

        textContainer.appendChild(statisticDiv);
        featureContainer.appendChild(textContainer);
        featureContainer.classList.add('text-container');
      }

      // Handle feature heading
      const featureHeadingElement = description.querySelector('[data-aue-prop="feature-heading"], [data-richtext-prop="feature-heading"]');
      if (featureHeadingElement) {
        const headingContainer = document.createElement('div');
        const featureHeadingP = document.createElement('p');
        featureHeadingP.textContent = featureHeadingElement.textContent;
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
  const indices = block.querySelector('[data-aue-model="indices"]');
  if (indices) {
    // get less indices, more indices and indexnumber content elements
    const lessIndices = indices.querySelector('[data-aue-prop="lessIndices"]');
    const moreIndices = indices.querySelector('[data-aue-prop="moreIndices"]');
    const indexElement = indices.querySelector('[data-aue-prop="indexNumber"]');
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
    const convDescription = aboutUsRightContent.querySelectorAll(
      '[data-aue-model="featureItem"]',
    );
      // featureitems are  more than indexNumber indices then hide
      // the remaing and show link to show more indices link with remaining indices count in text
    if (indexNumber < convDescription.length) {
      // hide the remaining indices
      for (let i = indexNumber; i < convDescription.length; i += 1) {
        convDescription[i].style.display = 'none';
      }

      showMoreIndicesLink.textContent = `${moreIndices?.textContent ?? 'Show More'
      } (${convDescription.length - indexNumber})`;
      showMoreIndicesLink.classList.add('show-more-indices');
      showMoreIndicesLink.addEventListener('click', () => {
        for (let i = indexNumber; i < convDescription.length; i += 1) {
          convDescription[i].style.display = 'block';
        }
        showMoreIndicesLink.style.display = 'none';
        showLessIndicesLink.style.display = 'block';
      });

      showLessIndicesLink.textContent = lessIndices?.textContent ?? 'Show Less';
      showLessIndicesLink.classList.add('show-less-indices');
      showLessIndicesLink.style.display = 'none';
      showLessIndicesLink.addEventListener('click', () => {
        for (let i = indexNumber; i < convDescription.length; i += 1) {
          convDescription[i].style.display = 'none';
        }
        showMoreIndicesLink.style.display = 'block';
        showLessIndicesLink.style.display = 'none';
      });
    }
    indices.innerHTML = '';
    indices.appendChild(indexElement);
    indices.appendChild(showMoreIndicesLink);
    indices.appendChild(showLessIndicesLink);
    aboutUsRightContent.appendChild(indices);
  }
  block.innerHTML = '';
  aboutUsStats.appendChild(aboutUsLeftContent);
  aboutUsStats.appendChild(aboutUsRightContent);
  container.append(aboutUsStats);
  block.appendChild(container);
}
