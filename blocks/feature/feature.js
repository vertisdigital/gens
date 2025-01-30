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
    const linkContainer = document.createElement('div');
    Array.from(linkField.attributes).forEach((attr) => {
      linkContainer.setAttribute(attr.name, attr.value);
    });

    // Create link text div
    const linkTextDiv = document.createElement('div');
    const linkTextP = document.createElement('p');
    linkTextP.className = 'button-container';
    const linkElement = document.createElement('a');
    const originalLink = linkField.querySelector('[data-aue-prop="linkText"]');
    if (originalLink) {
      linkElement.href = originalLink.getAttribute('href');
      linkElement.title = originalLink.getAttribute('title');
      linkElement.className = 'button';
      linkElement.textContent = originalLink.textContent;
      Array.from(originalLink.attributes).forEach((attr) => {
        linkElement.setAttribute(attr.name, attr.value);
      });
    }

    // Add arrow icon
    const arrowSVG = SvgIcon({ name: 'arrow', className: 'about-us-left-link', size: '18px' });
    linkElement.append(stringToHTML(arrowSVG));
    linkTextP.appendChild(linkElement);
    linkTextDiv.appendChild(linkTextP);

    // Create link target div
    const linkTargetDiv = document.createElement('div');
    const linkTargetP = document.createElement('p');
    const originalTarget = linkField.querySelector('[data-aue-prop="linkTarget"]');
    if (originalTarget) {
      linkTargetP.textContent = originalTarget.textContent;
      Array.from(originalTarget.attributes).forEach((attr) => {
        linkTargetP.setAttribute(attr.name, attr.value);
      });
    }
    linkTargetDiv.appendChild(linkTargetP);

    // Assemble link structure
    linkContainer.appendChild(linkTextDiv);
    linkContainer.appendChild(linkTargetDiv);
    aboutUsLeftContent.appendChild(linkContainer);
  }

  // About-Us right container
  const aboutUsRightContent = document.createElement('div');
  aboutUsRightContent.className = 'col-lg-6 col-md-6 col-sm-12 about-us-right';

  // Collect all imageAndDescription elements first
  const imageAndDescriptionList = [];

  const aboutUsDescription = block.querySelectorAll('[data-aue-model="featureItem"]');
  aboutUsDescription.forEach((description) => {
    // Create feature item container
    const featureContainer = document.createElement('div');
    Array.from(description.attributes).forEach((attr) => {
      featureContainer.setAttribute(attr.name, attr.value);
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
    const headingElement = description.querySelector('[data-aue-prop="feature-heading"]');
    if (headingElement) {
      const headingContainer = document.createElement('div');
      const headingP = document.createElement('p');
      headingP.textContent = headingElement.textContent;
      Array.from(headingElement.attributes).forEach((attr) => {
        headingP.setAttribute(attr.name, attr.value);
      });
      headingContainer.appendChild(headingP);
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
