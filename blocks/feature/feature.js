import Heading from '../../shared-components/Heading.js';
import ImageComponent from '../../shared-components/ImageComponent.js';
import SvgIcon from '../../shared-components/SvgIcon.js';
import stringToHTML from '../../shared-components/Utility.js';

/**
* Loads and decorates the Hero Banner
* @param {Element} block The herobanner block element
*/
export default function decorate(block) {
  const container = document.createElement('div');
  container.className = 'container';

  const aboutUsStats = document.createElement('div');
  aboutUsStats.className = 'row about-us-stats';

  // About-Us left container
  const aboutUsLeftContent = document.createElement('div');
  aboutUsLeftContent.className = 'col-lg-6 col-md-6 col-sm-12 about-us-left';

  // Find the title and replace it with a heading
  const titleElement = block.querySelector('[data-aue-prop="title"]');
  if (titleElement) {
    const titleText = titleElement.textContent;
    const header = document.createElement('header');
    header.setAttribute('data-aue-prop', 'title');
    header.setAttribute('data-aue-type', 'text');
    header.setAttribute('data-aue-label', 'Title');
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

    parsedHtml.setAttribute('data-aue-prop', 'heading');
    parsedHtml.setAttribute('data-aue-label', 'Heading');
    parsedHtml.setAttribute('data-aue-type', 'text');
    aboutUsLeftContent.append(parsedHtml);
    headingElement.remove();
  }

  // Find the sub-heading and replace it with a sub-heading
  const subHeading = block.querySelector('[data-aue-prop="sub-heading"]');
  if (subHeading) {
    const subHeadingText = subHeading.querySelector('p').textContent;
    const subHeadingElement = document.createElement('p');
    subHeadingElement.className = 'about-us-left-sub-heading';
    subHeadingElement.textContent = subHeadingText;
    Array.from(subHeading.attributes).forEach((attr) => {
      subHeadingElement.setAttribute(attr.name, attr.value);
    });

    aboutUsLeftContent.appendChild(subHeadingElement);
    subHeading.remove();
  }

  // Find the LinkField and replace it with arrow icon
  const linkField = block.querySelector('[data-aue-model="linkField"]');
  if (linkField) {
    // Create wrapper component
    const linkWrapper = document.createElement('div');
    linkWrapper.setAttribute('data-aue-type', 'component');
    linkWrapper.setAttribute('data-aue-model', 'linkField');
    linkWrapper.setAttribute('data-aue-filter', 'linkField');
    linkWrapper.setAttribute('data-aue-label', 'Link Field');

    // Create main link container
    const linkContainer = document.createElement('div');

    // Create link text container
    const linkTextContainer = document.createElement('div');
    const buttonContainer = document.createElement('p');
    buttonContainer.className = 'button-container';

    // Create link element
    const linkElement = document.createElement('a');
    const originalLink = linkField.querySelector('a');
    if (originalLink) {
      linkElement.href = originalLink.getAttribute('href');
      linkElement.title = originalLink.getAttribute('title');
      linkElement.className = 'button';
      linkElement.setAttribute('data-aue-prop', 'linkText');
      linkElement.setAttribute('data-aue-label', 'Text');
      linkElement.setAttribute('data-aue-type', 'text');
      linkElement.textContent = originalLink.textContent;
    }

    // Add arrow icon
    const arrowSVG = SvgIcon({ name: 'arrow', className: 'about-us-left-link', size: '18px' });
    linkElement.append(stringToHTML(arrowSVG));

    // Assemble the structure
    buttonContainer.appendChild(linkElement);
    linkTextContainer.appendChild(buttonContainer);
    linkContainer.appendChild(linkTextContainer);

    // Replace original linkField content
    linkField.innerHTML = '';
    linkField.appendChild(linkContainer);

    // Add container to wrapper
    linkWrapper.appendChild(linkField);
    aboutUsLeftContent.appendChild(linkWrapper);
  }

  // About-Us right container
  const aboutUsRightContent = document.createElement('div');
  aboutUsRightContent.className = 'col-lg-6 col-md-6 col-sm-12 about-us-right';

  // Collect all imageAndDescription elements first
  const imageAndDescriptionList = [];

  const aboutUsDescription = block.querySelectorAll('[data-aue-model="featureItem"]');
  aboutUsDescription.forEach((description) => {
    const imageElement = description.querySelector('picture img') || '';
    const textElement = description.querySelector('[data-aue-prop="feature-title"]') || '';
    const descriptionHtml = description.querySelector('[data-aue-prop="feature-heading"]');
    const descriptionContent = descriptionHtml?.textContent;

    const descriptionDiv = document.createElement('p');
    descriptionDiv.textContent = descriptionContent;

    const imageAndDescription = document.createElement('div');
    imageAndDescription.className = 'about-us-right-content';
    imageAndDescription.setAttribute('data-aue-model', 'featureItem');
    imageAndDescription.setAttribute('data-aue-type', 'component');
    imageAndDescription.setAttribute('data-aue-label', 'Feature Item');
    imageAndDescription.setAttribute('data-aue-resource', `${description.getAttribute('data-aue-resource')}`);

    if (imageElement) {
      imageAndDescription.classList.add('image-container');

      const imageLink = imageElement?.getAttribute('src');
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

        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = imageHtml;
        const parsedImageNode = tempContainer.firstElementChild;

        Array.from(imageElement.attributes).forEach((attr) => {
          parsedImageNode.querySelector('img').setAttribute(attr.name, attr.value);
        });

        parsedImageNode.querySelector('img').setAttribute('data-aue-prop', 'feature-icon');
        parsedImageNode.querySelector('img').setAttribute('data-aue-label', 'Feature Icon');
        parsedImageNode.querySelector('img').setAttribute('data-aue-resource', 'feature-image');

        Array.from(descriptionHtml.attributes).forEach((attr) => {
          descriptionDiv.setAttribute(attr.name, attr.value);
        });

        if (parsedImageNode) {
          imageAndDescription.appendChild(parsedImageNode);
          imageAndDescription.appendChild(descriptionDiv);
        }

        imageAndDescription.classList.add('image-container');
        description.innerHTML = '';
        description.append(imageAndDescription);

        imageAndDescriptionList.push(description);
      }
    } else if (textElement) {
      imageAndDescription.classList.add('text-container');

      const newText = document.createElement('div');
      newText.className = 'statistic';
      const allTextElements = textElement.querySelectorAll('p');

      const textElementFirstChild = allTextElements[0]?.textContent || '';
      const newTextFirstChild = document.createElement('span');
      newTextFirstChild.textContent = textElementFirstChild;
      
      const attributes = [
        { name: 'data-aue-prop', value: 'feature-title' },
        { name: 'data-aue-label', value: 'Feature Title' },
        { name: 'data-aue-type', value: 'text' }
      ];
      attributes.forEach(attr => {
        newTextFirstChild.setAttribute(attr.name, attr.value);
      });
      
      newText.append(newTextFirstChild);

      if (allTextElements.length > 1) {
        const textElementSecondChild = allTextElements[1]?.textContent || '';
        const newTextSecondChild = document.createElement('span');
        newTextSecondChild.textContent = textElementSecondChild;
        newText.append(newTextSecondChild);
      }

      descriptionDiv.textContent = description.querySelector('[data-aue-prop="feature-heading"]')?.textContent || '';

      descriptionDiv.setAttribute('data-aue-prop', 'feature-heading');
      descriptionDiv.setAttribute('data-aue-label', 'Feature Heading');
      descriptionDiv.setAttribute('data-aue-type', 'text');

      const textAndDescription = document.createElement('div');
      textAndDescription.className = 'about-us-right-content';
      textAndDescription.append(newText);
      textAndDescription.append(descriptionDiv);

      textAndDescription.classList.add('text-container');
      description.innerHTML = '';
      description.append(textAndDescription);

      imageAndDescriptionList.push(description);
    }
  });

  imageAndDescriptionList.forEach((content) => aboutUsRightContent.appendChild(content));

  block.innerHTML = '';

  aboutUsStats.appendChild(aboutUsLeftContent);
  aboutUsStats.appendChild(aboutUsRightContent);
  container.append(aboutUsStats);
  block.appendChild(container);
}
