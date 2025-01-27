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
  // const row= document.createElement('div')
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
    const titleHtml = Heading({ level: 3, text: titleText, className: 'about-us-left-title' });
    header.append(stringToHTML(titleHtml));
    aboutUsLeftContent.append(header);
    titleElement.remove();
  }

  // Find the heading and replace it with a heading
  const headingElement = block.querySelector('[data-aue-prop="heading"]');
  if (headingElement) {
    const headingText = headingElement.textContent;
    const headingHtml = Heading({ level: 2, text: headingText, className: 'about-us-left-heading' });
    aboutUsLeftContent.insertAdjacentHTML('beforeend', headingHtml);
    headingElement.remove();
  }

  // Find the sub-heading and replace it with a sub-heading
  const subHeading = block.querySelector('[data-aue-prop="sub-heading"]');
  if (subHeading) {
    const subHeadingText = subHeading.querySelector('p').textContent;
    const subHeadingElement = document.createElement('p');
    subHeadingElement.className = 'about-us-left-sub-heading';
    subHeadingElement.textContent = subHeadingText;

    aboutUsLeftContent.appendChild(subHeadingElement);
    subHeading.remove();
  }

  // Find the LinkField and replace it with arrow icon
  const linkField = block.querySelector('[data-aue-model="linkfield"]');
  if (linkField) {
    const arrowLink = linkField.querySelector('a').getAttribute('href');
    const arrowLinkElement = document.createElement('a');
    if (arrowLink) {
      arrowLinkElement.href = arrowLink;
    }
    const arrowSVG = SvgIcon({ name: 'arrow', className: 'about-us-left-link', size: '18px' });
    arrowLinkElement.append(stringToHTML(arrowSVG));
    aboutUsLeftContent.appendChild(arrowLinkElement);
    linkField.remove();
  }

  // About-Us right container
  const aboutUsRightContent = document.createElement('div');
  aboutUsRightContent.className = 'col-lg-6 col-md-6 col-sm-12 about-us-right';

  // Collect all imageAndDescription elements first
  const imageAndDescriptionList = [];

  const aboutUsDescription = block.querySelectorAll('[data-aue-model="featureItem"]');
  if (aboutUsDescription.length) {
    aboutUsDescription.forEach((description) => {
      // search for image component
      const imageElement = description.querySelector('picture img') || '';
      // search for text component
      const textElement = description.querySelector('[data-aue-prop="feature-title"]') || '';
      // search for paragraph text
      const descriptionContent = description.querySelector('[data-aue-prop="feature-heading"]')?.textContent;
      // create a new paragraph and append the 'descriptionContent' text to it
      const descriptionDiv = document.createElement('p');
      descriptionDiv.textContent = descriptionContent;
      // Create container for image/text and description
      const imageAndDescription = document.createElement('div');
      imageAndDescription.className = 'about-us-right-content';
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
              mobile: {
                width: 768,
                src: imageLink,
              },
              tablet: {
                width: 1024,
                src: imageLink,
              },
              desktop: {
                width: 1920,
                src: imageLink,
              },
            },
            lazy: true,
          });

          const tempContainer = document.createElement('div');
          tempContainer.innerHTML = imageHtml;
          const parsedImageNode = tempContainer.firstElementChild;

          if (parsedImageNode) {
            imageAndDescription.appendChild(parsedImageNode); // Append the actual image node
            imageAndDescription.appendChild(descriptionDiv);
          }

          // Adding another class
          imageAndDescription.classList.add('image-container');

          imageAndDescriptionList.push(imageAndDescription);
          description.remove();
        }
      } else if (textElement) {
        imageAndDescription.classList.add('text-container');

        const newText = document.createElement('div');
        newText.className = 'statistic';
        const allTextElements = textElement.querySelectorAll('p');
        const textElementFirstChild = allTextElements[0]?.textContent || '';
        const newTextFirstChild = document.createElement('span');
        newTextFirstChild.textContent = textElementFirstChild;
        newText.append(newTextFirstChild);

        if (allTextElements.length > 1) {
          const textElementSecondChild = allTextElements[1]?.textContent || '';
          const newTextSecondChild = document.createElement('span');
          newTextSecondChild.textContent = textElementSecondChild;
          newText.append(newTextSecondChild);
        }

        descriptionDiv.textContent = description.querySelector('[data-aue-prop="feature-heading"]')?.textContent || '';

        const textAndDescription = document.createElement('div');
        textAndDescription.className = 'about-us-right-content';
        textAndDescription.append(newText);
        textAndDescription.append(descriptionDiv);

        // Adding another class
        textAndDescription.classList.add('text-container');

        imageAndDescriptionList.push(textAndDescription);
        description.remove();
      }
    });

    // Append all collected imageAndDescription elements to aboutUsRightContent
    imageAndDescriptionList.forEach((content) => aboutUsRightContent.appendChild(content));
  }

  block.innerHTML = '';

  // Append the left content section to the stats container
  aboutUsStats.appendChild(aboutUsLeftContent);
  // Append the right content section to the stats container
  aboutUsStats.appendChild(aboutUsRightContent);
  // append both left and right to main container
  container.append(aboutUsStats);
  block.appendChild(container);
}
