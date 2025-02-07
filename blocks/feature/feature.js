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

  container.classList.add('container-xl', 'container-lg', 'container-md', 'container-sm');

  const aboutUsStats = document.createElement('div');
  aboutUsStats.classList.add('row', 'about-us-stats');

  // About-Us left container
  const aboutUsLeftContent = document.createElement('div');
  aboutUsLeftContent.classList.add('col-xl-6', 'col-md-3', 'col-sm-4', 'about-us-left');

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
    // Preserve original container
    const linkContainer = document.createElement('div');
    Array.from(linkField.attributes).forEach((attr) => {
      linkContainer.setAttribute(attr.name, attr.value);
    });

    // Create link text div
    const linkTextDiv = document.createElement('div');
    const linkTextP = document.createElement('p');
    linkTextP.className = 'button-container';

    // Handle link text
    const originalLink = linkField.querySelector('[data-aue-prop="linkText"]');
    const originalTarget = linkField.querySelector('[data-aue-prop="linkTarget"]');
    const originalTargetName = originalTarget.textContent;
    originalLink.setAttribute('target', originalTargetName);
    originalLink.innerHTML = '';
    originalTarget.innerHTML = '';
    if (originalLink) {
      const linkElement = document.createElement('a');

      // Copy all attributes from original link
      Array.from(originalLink.attributes).forEach((attr) => {
        linkElement.setAttribute(attr.name, attr.value);
      });

      // Set additional attributes
      linkElement.className = 'button';

      const arrowIcon = linkField.querySelector('[data-aue-prop="linkSvgIcon"]');

      const arrowIconName = arrowIcon.textContent.replace('-', '');
      arrowIcon.innerHTML = '';
      if (!arrowIcon) {
        linkElement.textContent = originalLink.textContent;
      } else {
        const arrowSVG = SvgIcon({ name: `${arrowIconName}`, className: 'about-us-left-link', size: '16px' });
        linkElement.append(stringToHTML(arrowSVG));

        // Assemble link structure
        linkTextP.appendChild(linkElement);
        linkTextDiv.appendChild(linkTextP);
        linkContainer.appendChild(linkTextDiv);
      }

      // Add to container
      aboutUsLeftContent.appendChild(linkContainer);
    }

    // About-Us right container
    const aboutUsRightContent = document.createElement('div');
    aboutUsRightContent.classList.add('col-xl-6', 'col-md-3', 'col-sm-4', 'about-us-right');

    // Collect all imageAndDescription elements first
    const aboutUsDescription = block.querySelectorAll('[data-aue-model="featureItem"]');
    aboutUsDescription.forEach((description) => {
    // Create feature item container
      const featureContainer = document.createElement('div');
      Array.from(description.attributes).forEach((attr) => {
        featureContainer.setAttribute(attr.name, attr.value);
        featureContainer.classList.add('about-us-right-content');
      });

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
          Array.from(imageElement.attributes).forEach((attr) => {
            parsedImage.querySelector('img').setAttribute(attr.name, attr.value);
          });
          imageContainer.appendChild(parsedImage);
          featureContainer.appendChild(imageContainer);
          featureContainer.classList.add('image-container');
        }
      }

      // Handle text feature
      const textElement = description.querySelector('[data-aue-prop="feature-title"]');
      if (textElement) {
        const textContainer = document.createElement('div');
        const statisticDiv = document.createElement('div');
        statisticDiv.className = 'statistic';

        const textContent = textElement.querySelectorAll('p');
        textContent.forEach((text) => {
          const span = document.createElement('span');
          span.textContent = text.textContent;
          Array.from(text.attributes).forEach((attr) => {
            span.setAttribute(attr.name, attr.value);
          });
          statisticDiv.appendChild(span);
        });

        textContainer.appendChild(statisticDiv);
        featureContainer.appendChild(textContainer);
        featureContainer.classList.add('text-container');
      }

      // Handle feature heading
      const featureHeadingElement = description.querySelector('[data-aue-prop="feature-heading"]');
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

    block.innerHTML = '';
    aboutUsStats.appendChild(aboutUsLeftContent);
    aboutUsStats.appendChild(aboutUsRightContent);
    container.append(aboutUsStats);
    block.appendChild(container);
  }
}
