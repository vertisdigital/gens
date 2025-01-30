import Heading from '../../shared-components/Heading.js';
import ImageComponent from '../../shared-components/ImageComponent.js';
import SvgIcon from '../../shared-components/SvgIcon.js';
import stringToHTML from '../../shared-components/Utility.js';

const createElementWithAttributes = (tag, attributes = {}, className = '') => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  return element;
};

const createTextElement = (tag, text, attributes = {}, className = '') => {
  const element = createElementWithAttributes(tag, attributes, className);
  element.textContent = text;
  return element;
};

const addAUEAttributes = (element, prop, label, type = 'text') => {
  element.setAttribute('data-aue-prop', prop);
  element.setAttribute('data-aue-label', label);
  element.setAttribute('data-aue-type', type);
  return element;
};

const createHeadingSection = (element, level, className) => {
  if (!element) return null;
  const text = element.textContent;
  const headingHtml = Heading({ level, text, className });
  const parsedHtml = stringToHTML(headingHtml);
  addAUEAttributes(parsedHtml, element.getAttribute('data-aue-prop'), element.getAttribute('data-aue-label') || 'Heading');
  element.remove();
  return parsedHtml;
};

const createLinkSection = (linkField) => {
  if (!linkField) return null;

  const wrapper = createElementWithAttributes('div');
  const linkContainer = createElementWithAttributes('div');
  const linkTextContainer = createElementWithAttributes('div');
  const buttonContainer = createElementWithAttributes('p', {}, 'button-container');

  const originalLink = linkField.querySelector('a');
  if (!originalLink) return wrapper;

  const linkElement = createElementWithAttributes('a', {
    href: originalLink.getAttribute('href'),
    title: originalLink.getAttribute('title'),
    class: 'button',
    'data-aue-prop': 'linkText',
    'data-aue-label': 'Text',
    'data-aue-type': 'text',
  });

  linkElement.textContent = originalLink.textContent;
  linkElement.append(stringToHTML(SvgIcon({
    name: 'arrow',
    className: 'about-us-left-link',
    size: '18px',
  })));

  buttonContainer.appendChild(linkElement);
  linkTextContainer.appendChild(buttonContainer);
  linkContainer.appendChild(linkTextContainer);
  linkField.innerHTML = '';
  linkField.appendChild(linkContainer);
  wrapper.appendChild(linkField);

  return wrapper;
};

const createImageFeature = (container, imageElement, descriptionHtml) => {
  container.classList.add('image-container');
  const imageLink = imageElement.getAttribute('src');
  const imgAltText = imageElement.closest('[data-aue-model="featureItem"]')
    .querySelector('[data-aue-prop="feature-icon-alt"]')?.textContent || '';

  if (!imageLink) return null;

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

  const parsedImageNode = stringToHTML(imageHtml);
  const img = parsedImageNode.querySelector('img');
  addAUEAttributes(img, 'feature-icon', 'Feature Icon');
  img.setAttribute('data-aue-resource', 'feature-image');

  const descriptionDiv = createTextElement('p', descriptionHtml?.textContent || '');
  addAUEAttributes(descriptionDiv, 'feature-heading', 'Feature Heading');

  container.append(parsedImageNode, descriptionDiv);
  return container;
};

const createTextFeature = (container, textElement, descriptionHtml) => {
  container.classList.add('text-container');
  const statisticDiv = createElementWithAttributes('div', {}, 'statistic');
  const textElements = textElement.querySelectorAll('p');

  const mainText = createTextElement('span', textElements[0]?.textContent || '');
  addAUEAttributes(mainText, 'feature-title', 'Feature Title');
  statisticDiv.appendChild(mainText);

  if (textElements.length > 1) {
    const subText = createTextElement('span', textElements[1]?.textContent || '');
    statisticDiv.appendChild(subText);
  }

  const descriptionDiv = createTextElement('p', descriptionHtml?.textContent || '');
  addAUEAttributes(descriptionDiv, 'feature-heading', 'Feature Heading');

  container.append(statisticDiv, descriptionDiv);
  return container;
};

const createFeatureItem = (description) => {
  const imageElement = description.querySelector('picture img');
  const textElement = description.querySelector('[data-aue-prop="feature-title"]');
  const descriptionHtml = description.querySelector('[data-aue-prop="feature-heading"]');

  // Create feature item container with proper AEM authoring attributes
  const container = createElementWithAttributes('div', {
    'data-aue-model': 'featureItem',
    'data-aue-type': 'component',
    'data-aue-label': 'Feature Item',
    'data-aue-resource': description.getAttribute('data-aue-resource'),
    'data-aue-prop': 'feature',
    'data-aue-filter': 'featureItem',
  }, 'about-us-right-content');

  // Create inner container for feature content
  const contentContainer = createElementWithAttributes('div', {
    'data-aue-type': 'container',
  });

  if (imageElement) {
    const imageContainer = createElementWithAttributes('div', {
      'data-aue-prop': 'feature-icon',
      'data-aue-type': 'image',
      'data-aue-label': 'Feature Icon',
    });
    
    const imageHtml = ImageComponent({
      src: imageElement.getAttribute('src'),
      alt: description.querySelector('[data-aue-prop="feature-icon-alt"]')?.textContent || '',
      className: 'about-us-right-description-icon',
      breakpoints: {
        mobile: { width: 768, src: imageElement.getAttribute('src') },
        tablet: { width: 1024, src: imageElement.getAttribute('src') },
        desktop: { width: 1920, src: imageElement.getAttribute('src') },
      },
      lazy: true,
    });

    imageContainer.appendChild(stringToHTML(imageHtml));
    contentContainer.appendChild(imageContainer);

  } else if (textElement) {
    const statisticContainer = createElementWithAttributes('div', {
      'data-aue-prop': 'feature-title',
      'data-aue-type': 'text',
      'data-aue-label': 'Feature Title',
    });

    const textElements = textElement.querySelectorAll('p');
    const mainText = createTextElement('p', textElements[0]?.textContent || '');
    statisticContainer.appendChild(mainText);

    if (textElements.length > 1) {
      const subText = createTextElement('p', textElements[1]?.textContent || '');
      statisticContainer.appendChild(subText);
    }

    contentContainer.appendChild(statisticContainer);
  }

  // Add description
  if (descriptionHtml) {
    const descriptionContainer = createElementWithAttributes('div', {
      'data-aue-prop': 'feature-heading',
      'data-aue-type': 'text',
      'data-aue-label': 'Feature Heading',
    });
    
    const descriptionText = createTextElement('p', descriptionHtml.textContent || '');
    descriptionContainer.appendChild(descriptionText);
    contentContainer.appendChild(descriptionContainer);
  }

  container.appendChild(contentContainer);
  return container;
};

/**
* Loads and decorates the Feature block
* @param {Element} block The feature block element
*/
export default function decorate(block) {
  const container = createElementWithAttributes('div', {}, 'container');
  const aboutUsStats = createElementWithAttributes('div', {}, 'row about-us-stats');
  
  // Create left content with proper AEM authoring attributes
  const leftContent = createElementWithAttributes('div', {
    'data-aue-type': 'container',
    'data-aue-filter': 'leftContent',
  }, 'col-lg-6 col-md-6 col-sm-12 about-us-left');

  // Process left content
  const title = createHeadingSection(block.querySelector('[data-aue-prop="title"]'), 3, 'about-us-left-title');
  const heading = createHeadingSection(block.querySelector('[data-aue-prop="heading"]'), 2, 'about-us-left-heading');
  const subHeading = block.querySelector('[data-aue-prop="sub-heading"]');
  const linkSection = createLinkSection(block.querySelector('[data-aue-model="linkField"]'));

  if (title) leftContent.appendChild(title);
  if (heading) leftContent.appendChild(heading);
  if (subHeading) leftContent.appendChild(subHeading);
  if (linkSection) leftContent.appendChild(linkSection);

  // Create right content with proper AEM authoring attributes
  const rightContent = createElementWithAttributes('div', {
    'data-aue-type': 'container',
    'data-aue-filter': 'rightContent',
  }, 'col-lg-6 col-md-6 col-sm-12 about-us-right');

  // Process feature items
  const featureItems = Array.from(block.querySelectorAll('[data-aue-model="featureItem"]'))
    .map(createFeatureItem)
    .filter(Boolean);

  featureItems.forEach((item) => rightContent.appendChild(item));

  // Assemble the block
  aboutUsStats.append(leftContent, rightContent);
  container.appendChild(aboutUsStats);
  block.innerHTML = '';
  block.appendChild(container);
}
