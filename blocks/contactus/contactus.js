import Heading from '../../shared-components/Heading.js';
import { moveInstrumentation } from '../../scripts/scripts.js';
import ImageComponent from '../../shared-components/ImageComponent.js';
import stringToHtml from '../../shared-components/Utility.js';
import SvgIcon from '../../shared-components/SvgIcon.js';

export default function decorate(block) {
  // Restructure the HTML for better semantics and accessibility
  const wrapper = block.closest('.enquiry-wrapper') || block;
  // const enquiryFirstChild = block.children;
  const enquiryResource = wrapper.querySelector('[data-aue-label="Enquiry"]');

  // get the block children
  const enquiryChildren = block.children;
  // get the first child of the block
  const enquiryFirstChild = enquiryChildren[0].children;
  // get second child of the block
  const enquirySecondChild = enquiryChildren[1].children;

  if (enquiryResource) {
    moveInstrumentation(enquiryResource, wrapper);
  }

  // Create single container with all responsive classes
  const container = document.createElement('div');
  container.className = 'container-xl container-md container-sm';

  const row = document.createElement('div');
  row.className = 'row contactus-top';

  // Create left column (heading) - 40% on desktop and tablet
  const leftCol = document.createElement('div');
  leftCol.className = 'col-xl-6 col-md-3 container-sm-4';

  // Create heading container with proper attributes
  const headingContainer = document.createElement('div');
  const headingText = enquiryFirstChild[0].querySelector('p')?.textContent.trim();
  const headingElement = document.createElement('div');

  if (headingText) {
    headingElement.innerHTML = Heading({
      text: headingText,
      level: 2,
      className: 'enquiry-heading',
    });
    // Add authoring attributes to heading
    const heading = headingElement.firstElementChild || '';
    heading.setAttribute('data-aue-prop', 'heading');
    heading.setAttribute('data-aue-label', 'Heading');
    heading.setAttribute('data-aue-type', 'text');

    headingContainer.append(heading);
    leftCol.append(headingContainer);
  }

  // Create right column (description and contacts) - 60% on desktop and tablet
  const rightCol = document.createElement('div');
  rightCol.className = 'col-xl-6 col-md-3 container-sm-4';

  // Add description with authoring attributes
  const description = enquiryFirstChild[1].querySelector('p');
  if (description) {
    const descriptionWrapper = document.createElement('div');
    descriptionWrapper.className = 'enquiry-description';
    descriptionWrapper.setAttribute('data-aue-prop', 'description');
    descriptionWrapper.setAttribute('data-aue-label', 'Description');
    descriptionWrapper.setAttribute('data-aue-filter', 'text');
    descriptionWrapper.setAttribute('data-aue-type', 'richtext');
    descriptionWrapper.innerHTML = description.innerHTML;
    rightCol.append(descriptionWrapper);
  }

  // Create contact items container with proper spacing
  const contactItems = document.createElement('div');
  contactItems.className = 'contact-items';
  contactItems.setAttribute('role', 'list');

  // Helper function to create accessible contact items with authoring support
  const createContactItem = (text, linkType, prop, label, imageLink, displayLabel='') => {
    const contactItemWrapper = document.createElement('div');
    contactItemWrapper.className = 'contact-item-wrapper';
    if(displayLabel) {
      const labelElement = document.createElement('p');
      labelElement.className = 'contact-label';
      labelElement.textContent = displayLabel;
      contactItemWrapper.append(labelElement);
    }
    const item = document.createElement('div');
    item.className = 'contact-item';
    item.setAttribute('role', 'listitem');

    // Create icon container
    const iconWrapper = document.createElement('div');
    iconWrapper.className = 'contact-icon';
    iconWrapper.setAttribute('aria-hidden', 'true');

    if (imageLink) {
      // const imageUrl = imageLink.getAttribute('href');
      const picture = ImageComponent({
        src: imageLink,
        alt: '',
        className: 'enquiry-image',
        breakpoints: {
          mobile: {
            width: 768,
            src: `${imageLink}`,
          },
          tablet: {
            width: 1024,
            src: `${imageLink}`,
          },
          desktop: {
            width: 1920,
            src: `${imageLink}`,
          },
        },
        lazy: true,
      });
      // Remove original link
      // imageLink.remove();

      if (picture) {
        const imageElement = stringToHtml(picture);
        iconWrapper.append(imageElement);
      }
    }

    // Create text container with authoring attributes
    const textElement = document.createElement('p');
    textElement.className = 'contact-text';
    textElement.setAttribute('data-aue-prop', prop);
    textElement.setAttribute('data-aue-label', label);
    textElement.setAttribute('data-aue-type', 'text');

    if (linkType) {
      const link = document.createElement('a');
      link.className = 'contact-link';
      link.href = `${linkType}:${text}`;
      link.textContent = text;
      link.setAttribute('aria-label', `${linkType === 'tel' ? 'Call us at' : 'Email us at'} ${text}`);
      // Add keyboard focus styles
      link.setAttribute('tabindex', '0');
      textElement.append(link);
    } else {
      textElement.textContent = text;
    }

    item.append(iconWrapper);
    item.append(textElement);
    contactItemWrapper.append(item);
    return contactItemWrapper;
  };

  // Add contact items with proper attributes
  const phone = enquiryFirstChild[3].querySelector('p').textContent.trim();
  const email1 = enquiryFirstChild[6].querySelector('p').textContent.trim();
  const email2 = enquiryFirstChild[10].querySelector('p').textContent.trim();
  const email3 = enquiryFirstChild[14].querySelector('p').textContent.trim();
  const address = enquiryFirstChild[17].querySelector('p').textContent.trim();

  const imageLink = wrapper.querySelectorAll('a[href*="/content/dam/"][href$=".svg"], a[href*="delivery-"]');

  if (phone) {
    contactItems.append(createContactItem(phone, 'tel', 'phoneNumber', 'PhoneNumber', imageLink[0].getAttribute('href')));
  }
  if (email1) {
    contactItems.append(createContactItem(email1, 'mailto', 'emailAddress', 'EmailAddress', imageLink[1].getAttribute('href'), enquiryFirstChild[4].textContent));
  }
  if (email2) {
    contactItems.append(createContactItem(email2, 'mailto', 'emailAddress', 'EmailAddress', imageLink[2].getAttribute('href'), enquiryFirstChild[8].textContent));
  }
  if (email3) {
    contactItems.append(createContactItem(email3, 'mailto', 'emailAddress', 'EmailAddress', imageLink[3].getAttribute('href'), enquiryFirstChild[12].textContent));
  }
  if (address) {
    contactItems.append(createContactItem(address, null, 'address', 'Address', imageLink[4].getAttribute('href')));
  }

  rightCol.append(contactItems);

  // Assemble the structure
  row.append(leftCol);
  row.append(rightCol);
  container.append(row);


  // second row
  const row2 = document.createElement('div');
  row2.className = 'row contactus-bottom';
  const leftCol2 = document.createElement('div');
  leftCol2.className = 'col-xl-6 col-lg-6 col-md-3 col-sm-4';
  const rightCol2 = document.createElement('div');
  rightCol2.className = 'col-xl-6 col-lg-6 col-md-3 col-sm-4';

  // append first child to leftcol2
  leftCol2.append(enquirySecondChild[0].cloneNode(true));
  row2.append(leftCol2);

  rightCol2.append(enquirySecondChild[1].cloneNode(true));

  const viewJobCTAName = enquirySecondChild[4].cloneNode(true).textContent.trim().replace(/-/g, "");
 const northEastArrow = SvgIcon({
  name: viewJobCTAName,
  className: 'contactus-bottom-cta',
  size: 12,
  color: 'currentColor',
});

// Ensure enquirySecondChild[2] exists
const targetElement = enquirySecondChild[2];

if (targetElement) {
  const anchorElement = targetElement.querySelector('a');
  if (anchorElement) {
    // Convert the SVG string to an actual element (if necessary)
    const svgElement = typeof northEastArrow === 'string' ? stringToHtml(northEastArrow) : northEastArrow;

    // Append the icon
    anchorElement.appendChild(svgElement);
  } 
} 


  enquirySecondChild[2].querySelector('a').target = enquirySecondChild[3].cloneNode(true).textContent.trim();
  
  rightCol2.append(enquirySecondChild[2]);
  row2.append(rightCol2);

  container.append(row2);

  // Replace original content
  wrapper.innerHTML = '';
  wrapper.append(container);
}
