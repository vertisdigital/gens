import Heading from '../../shared-components/Heading.js';
import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';


export default function decorate(block) {

  // Restructure the HTML for better semantics and accessibility
  const wrapper = block.closest('.enquiry-wrapper');
  const enquiryResource = wrapper.querySelector('[data-aue-label="Enquiry"]');
  
  moveInstrumentation(enquiryResource, wrapper);

  // Create single container with all responsive classes
  const container = document.createElement('div');
  container.className = 'container-xl container-md container-sm';

  const row = document.createElement('div');
  row.className = 'row';

  // Create left column (heading) - 40% on desktop and tablet
  const leftCol = document.createElement('div');
  leftCol.className = 'col-xl-6 col-md-3 container-sm-4';

  // Create heading container with proper attributes
  const headingContainer = document.createElement('div');
  const headingText = wrapper.querySelector('[data-aue-prop="heading"]')?.textContent.trim();
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

    headingContainer.appendChild(heading);
    leftCol.appendChild(headingContainer);
  }

  // Create right column (description and contacts) - 60% on desktop and tablet
  const rightCol = document.createElement('div');
  rightCol.className = 'col-xl-6 col-md-3 container-sm-4';

  // Add description with authoring attributes
  const description = wrapper.querySelector('[data-aue-prop="description"]');
  if (description) {
    const descriptionWrapper = document.createElement('div');
    descriptionWrapper.className = 'enquiry-description';
    descriptionWrapper.setAttribute('data-aue-prop', 'description');
    descriptionWrapper.setAttribute('data-aue-label', 'Description');
    descriptionWrapper.setAttribute('data-aue-filter', 'text');
    descriptionWrapper.setAttribute('data-aue-type', 'richtext');
    descriptionWrapper.innerHTML = description.innerHTML;
    rightCol.appendChild(descriptionWrapper);
  }

  // Create contact items container with proper spacing
  const contactItems = document.createElement('div');
  contactItems.className = 'contact-items';
  contactItems.setAttribute('role', 'list');

  // Helper function to create accessible contact items with authoring support
  const createContactItem = (text, linkType, prop, label) => {
    const item = document.createElement('div');
    item.className = 'contact-item';
    item.setAttribute('role', 'listitem');

    // Create icon container
    const iconWrapper = document.createElement('div');
    iconWrapper.className = 'contact-icon';
    iconWrapper.setAttribute('aria-hidden', 'true');

    const imageLink = wrapper.querySelector('a[href*="/content/dam/"][href$=".png"], a[href*="/content/dam/"][href$=".jpeg"], a[href*="/content/dam/"][href$=".jpg"], a[href*="/content/dam/"][href$=".gif"], a[href*="/content/dam/"][href$=".svg"]');
    if (imageLink) {
      // Create optimized picture element
      const picture = createOptimizedPicture(imageLink.href, '', false);
      // Remove original link
      imageLink.remove();
      if (picture) {
        iconWrapper.appendChild(picture);
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
      textElement.appendChild(link);
    } else {
      textElement.textContent = text;
    }

    item.appendChild(iconWrapper);
    item.appendChild(textElement);
    return item;
  };

  // Add contact items with proper attributes
  const phone = wrapper.querySelector('[data-aue-prop="phoneNumber"]')?.textContent.trim();
  const email = wrapper.querySelector('[data-aue-prop="emailAddress"]')?.textContent.trim();
  const address = wrapper.querySelector('[data-aue-prop="address"]')?.textContent.trim();

  if (phone) {
    contactItems.appendChild(createContactItem(phone, 'tel', 'phoneNumber', 'PhoneNumber'));
  }
  if (email) {
    contactItems.appendChild(createContactItem(email, 'mailto', 'emailAddress', 'EmailAddress'));
  }
  if (address) {
    contactItems.appendChild(createContactItem(address, null, 'address', 'Address'));
  }

  rightCol.appendChild(contactItems);

  // Assemble the structure
  row.appendChild(leftCol);
  row.appendChild(rightCol);
  container.appendChild(row);

  // Replace original content
  wrapper.innerHTML = '';
  wrapper.appendChild(container);
}
