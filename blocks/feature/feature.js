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
  aboutUsLeftContent.classList.add('col-xl-6', 'col-lg-6', 'col-md-3', 'col-sm-4', 'about-us-left');
  const blockchildren = block.children;
  // Find the title and replace it with a heading
  const titleElement = blockchildren[0].children[0];
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
  const headingElement = blockchildren[1].children[0];
  if (headingElement) {
    const headingText = headingElement.textContent;
    const headingHtml = Heading({ level: 2, text: headingText, className: 'about-us-left-heading' });
    const parsedHtml = stringToHTML(headingHtml);
    moveInstrumentation(headingElement, parsedHtml);
    aboutUsLeftContent.append(parsedHtml);
    headingElement.remove();
  }

  // Find the sub-heading and replace it with a sub-heading

  const subHeading = blockchildren[2].children[0];
  if (subHeading) {
    subHeading.classList.add('about-us-left-sub-heading')
    aboutUsLeftContent.appendChild(subHeading);
  }

  // Find all LinkFields and replace with arrow icons
  const linkField = block.querySelector('[data-aue-model="linkField"],[data-gen-model="linkField"]');
  if (linkField) {
    const linkContainer = document.createElement('div');
    linkContainer.className = 'links-container';
    moveInstrumentation(linkField, linkContainer);
    // Handle link text
    const originalLink = linkField.querySelector('[data-aue-prop="linkText"],[data-gen-prop="linkText"]');
    const originalTarget = linkField.querySelector('[data-aue-prop="linkTarget"],[data-gen-prop="linkTarget"]');
    const arrowIcon = linkField.querySelector('[data-aue-prop="linkSvgIcon"],[data-gen-prop="linkSvgIcon"]');

    if (originalLink) {
      originalLink.setAttribute('target', originalTarget?.textContent.trim()??'_self');
      // fix for text with / i.e. default content from AEM when link used
      if(originalLink.textContent.startsWith("/") || originalLink.textContent.startsWith("#")) originalLink.textContent =''
      if(originalTarget) originalTarget.textContent = '';
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
  aboutUsRightContent.classList.add('col-xl-6', 'col-lg-6', 'col-md-3', 'col-sm-4', 'about-us-right');

  // Collect all imageAndDescription elements first
  const featureItems = [].slice.call(block.children,4);
  if (featureItems) {
    featureItems.forEach((feature) => {
      const featureChildren = feature.children;
      // checking and validating the feature item structure, as we need to get 4 children
      if(featureChildren.length !== 4) return;
      // Create feature item container
      const featureContainer = document.createElement('div');
      featureContainer.classList.add('about-us-right-content');
      moveInstrumentation(feature, featureContainer);
      // Handle image feature
      const imageElement = featureChildren[0].querySelector('[data-aue-prop="feature-icon"], img, a');
      if (imageElement) {
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
      const textElement = featureChildren[2].querySelector('[data-aue-prop="feature-title"]')??featureChildren[2];
      if (textElement) {
        const textContainer = document.createElement('div');
        const statisticDiv = document.createElement('div');
        statisticDiv.className = 'statistic';
        moveInstrumentation(textElement, statisticDiv);

        const textContent = textElement.querySelector('p') ? textElement.querySelectorAll('p') : textElement.innerHTML;
        if (typeof textContent === 'object') {
          textContent.forEach((text) => {
            //const span = document.createElement('div');
            //span.innerHTML = text.innerHTML;
            //moveInstrumentation(text, span);
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
      const featureHeadingElement = featureChildren[3];
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
  if (indices && indices.children.length === 3 ) {
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
      if(convDescription[i].children[0].textContent?.trim() === '' && !convDescription[i].children[0].querySelector('picture, img') )
        convDescription[i].children[0]?.remove();
    }
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
        for (let i = indexNumber; i < convDescription.length - 1; i += 1) {
          convDescription[i].style.display = 'block';
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
    }else {
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
