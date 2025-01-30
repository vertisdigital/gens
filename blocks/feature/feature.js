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
 container.setAttribute('data-aue-model', 'featureContainer');
 container.setAttribute('data-aue-type', 'container');
 container.setAttribute('data-aue-resource', 'feature');

 const aboutUsStats = document.createElement('div');
 aboutUsStats.className = 'row about-us-stats';
 aboutUsStats.setAttribute('data-aue-model', 'featureStats');
 aboutUsStats.setAttribute('data-aue-type', 'stats');
 aboutUsStats.setAttribute('data-aue-resource', 'feature-stats');

 // About-Us left container
 const aboutUsLeftContent = document.createElement('div');
 aboutUsLeftContent.className = 'col-lg-6 col-md-6 col-sm-12 about-us-left';
 aboutUsLeftContent.setAttribute('data-aue-model', 'featureLeftContent');
 aboutUsLeftContent.setAttribute('data-aue-type', 'content');
 aboutUsLeftContent.setAttribute('data-aue-resource', 'feature-content');

 // Find the title and replace it with a heading
 const titleElement = block.querySelector('[data-aue-prop="title"]');
 if (titleElement) {
   const titleText = titleElement.textContent;
   const header = document.createElement('header');
   header.setAttribute('data-aue-model', 'featureHeader');
   header.setAttribute('data-aue-type', 'header');
   header.setAttribute('data-aue-resource', 'feature-header');
   const titleHtml = Heading({ level: 3, text: titleText, className: 'about-us-left-title' });
   const parsedHtml = stringToHTML(titleHtml);
   Array.from(titleElement.attributes).forEach(attr => {
     parsedHtml.setAttribute(attr.name, attr.value);
   });
   parsedHtml.setAttribute('data-aue-prop', 'title');
   parsedHtml.setAttribute('data-aue-label', 'Feature Title');
   parsedHtml.setAttribute('data-aue-resource', 'feature-title');
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
   Array.from(headingElement.attributes).forEach(attr => {
     parsedHtml.setAttribute(attr.name, attr.value);
   });
   parsedHtml.setAttribute('data-aue-prop', 'heading');
   parsedHtml.setAttribute('data-aue-label', 'Feature Heading');
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
   Array.from(subHeading.attributes).forEach(attr => {
     subHeadingElement.setAttribute(attr.name, attr.value);
   });
   subHeadingElement.setAttribute('data-aue-prop', 'sub-heading');
   subHeadingElement.setAttribute('data-aue-label', 'Feature Subheading');
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
   Array.from(linkField.querySelector('a').attributes).forEach(attr => {
     arrowLinkElement.setAttribute(attr.name, attr.value);
   });
   arrowLinkElement.setAttribute('data-aue-model', 'linkField');
   arrowLinkElement.setAttribute('data-aue-type', 'component');
   arrowLinkElement.setAttribute('data-aue-label', 'Link Field');
   arrowLinkElement.setAttribute('data-aue-resource', linkField.getAttribute('data-aue-resource'));
   const arrowSVG = SvgIcon({ name: 'arrow', className: 'about-us-left-link', size: '18px' });
   arrowLinkElement.append(stringToHTML(arrowSVG));
   linkField.innerHTML = '';
   linkField.append(arrowLinkElement);
   aboutUsLeftContent.appendChild(linkField);
 }

 // About-Us right container
 const aboutUsRightContent = document.createElement('div');
 aboutUsRightContent.className = 'col-lg-6 col-md-6 col-sm-12 about-us-right';
 aboutUsRightContent.setAttribute('data-aue-model', 'featureRightContent');
 aboutUsRightContent.setAttribute('data-aue-type', 'content');
 aboutUsRightContent.setAttribute('data-aue-resource', 'feature-content');

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
   imageAndDescription.setAttribute('data-aue-label', `Feature Item`);
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

       Array.from(imageElement.attributes).forEach(attr => {
         parsedImageNode.querySelector('img').setAttribute(attr.name, attr.value);
       });

       parsedImageNode.querySelector('img').setAttribute('data-aue-prop', 'feature-icon');
       parsedImageNode.querySelector('img').setAttribute('data-aue-label', 'Feature Icon');
       parsedImageNode.querySelector('img').setAttribute('data-aue-resource', 'feature-image');

       Array.from(descriptionHtml.attributes).forEach(attr => {
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
     newText.append(newTextFirstChild);

     if (allTextElements.length > 1) {
       const textElementSecondChild = allTextElements[1]?.textContent || '';
       const newTextSecondChild = document.createElement('span');
       newTextSecondChild.textContent = textElementSecondChild;
       newText.append(newTextSecondChild);
     }

     Array.from(textElement.attributes).forEach(attr => {
       newText.setAttribute(attr.name, attr.value);
     });

     newText.setAttribute('data-aue-prop', 'feature-title');
     newText.setAttribute('data-aue-label', 'Feature Statistic');
     newText.setAttribute('data-aue-resource', 'feature-statistic');

     descriptionDiv.textContent = description.querySelector('[data-aue-prop="feature-heading"]')?.textContent || '';
     Array.from(descriptionHtml.attributes).forEach(attr => {
       descriptionDiv.setAttribute(attr.name, attr.value);
     });

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

 imageAndDescriptionList.forEach(content => aboutUsRightContent.appendChild(content));

 block.innerHTML = '';

 aboutUsStats.appendChild(aboutUsLeftContent);
 aboutUsStats.appendChild(aboutUsRightContent);
 container.append(aboutUsStats);
 block.appendChild(container);
}
