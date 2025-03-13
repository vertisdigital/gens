import Heading from '../../shared-components/Heading.js';
import { moveInstrumentation } from '../../scripts/scripts.js';
import ImageComponent from '../../shared-components/ImageComponent.js';
import stringToHtml from '../../shared-components/Utility.js';
import SvgIcon from '../../shared-components/SvgIcon.js';

export default function decorate(block) {
  if (!block || !block.children.length) return;

  const wrapper = block;
  const enquiryChildren = Array.from(block.children);
  const enquiryFirstChild = enquiryChildren[0]?.children || [];
  const enquirySecondChild = enquiryChildren[1]?.children || [];

  const container = document.createElement('div');
  container.className = 'container';

  const row = document.createElement('div');
  row.className = 'row contactus-top';

  const leftCol = document.createElement('div');
  leftCol.className = 'col-xl-6 col-md-3 col-sm-4';

  const headingContainer = document.createElement('div');
  const headingText = enquiryFirstChild[0];
  const headingElement = document.createElement('div');

  if (headingText) {
    headingElement.innerHTML = Heading({
      text: headingText?.textContent.trim(),
      level: 2,
      className: 'enquiry-heading',
    });
    const heading = headingElement.firstElementChild || '';
    moveInstrumentation(headingText, heading);
    headingContainer.append(heading);
    leftCol.append(headingContainer);
  }

  const rightCol = document.createElement('div');
  rightCol.className = 'col-xl-6 col-md-3 col-sm-4';

  const description = enquiryFirstChild[1];
  if (description) {
    const descriptionWrapper = document.createElement('div');
    descriptionWrapper.className = 'enquiry-description';
    moveInstrumentation(description, descriptionWrapper);
    descriptionWrapper.innerHTML = description.textContent;
    rightCol.append(descriptionWrapper);
  }

  const contactItems = document.createElement('div');
  contactItems.className = 'contact-items';
  contactItems.setAttribute('role', 'list');

  const indices = { phone: 3, email1: 7, email2: 11, email3: 15, address: 17 };

  const contactInfo = Object.fromEntries(
    Object.entries(indices).map(([key, index]) => [
      key,
      enquiryFirstChild[index]?.querySelector('p')?.textContent.trim() || ''
    ])
  );

  const { phone, email1, email2, email3, address } = contactInfo;
  const imageLink = wrapper.querySelectorAll('a[href*="/content/dam/"][href$=".svg"], a[href*="delivery-"]');

  const contactData = [
    { value: phone, type: 'tel', key: 'phoneNumber', label: 'PhoneNumber', imageIndex: 0 },
    { value: email1, type: 'mailto', key: 'emailAddress', label: 'EmailAddress', imageIndex: 1, textContentIndex: 4 },
    { value: email2, type: 'mailto', key: 'emailAddress', label: 'EmailAddress', imageIndex: 2, textContentIndex: 8 },
    { value: email3, type: 'mailto', key: 'emailAddress', label: 'EmailAddress', imageIndex: 3, textContentIndex: 12 },
    { value: address, type: null, key: 'address', label: 'Address', imageIndex: 4 }
  ];

  const createContactItem = (text, linkType, prop, label, imageLink, displayLabel = '') => {
    if (!text) return null;

    const contactItemWrapper = document.createElement('div');
    contactItemWrapper.className = 'contact-item-wrapper';

    if (displayLabel) {
      const labelElement = document.createElement('p');
      labelElement.className = 'contact-label';
      labelElement.textContent = displayLabel;
      contactItemWrapper.append(labelElement);
    }

    const item = document.createElement('div');
    item.className = 'contact-item';
    item.setAttribute('role', 'listitem');

    const iconWrapper = document.createElement('div');
    iconWrapper.className = 'contact-icon';
    iconWrapper.setAttribute('aria-hidden', 'true');

    if (imageLink) {
      const picture = ImageComponent({
        src: imageLink,
        alt: '',
        className: 'enquiry-image',
        breakpoints: { mobile: { width: 768, src: imageLink }, tablet: { width: 991, src: imageLink }, desktop: { width: 1920, src: imageLink } },
        lazy: true,
      });

      if (picture) {
        const imageElement = stringToHtml(picture);
        iconWrapper.append(imageElement);
      }
    }

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

  contactData.forEach(({ value, type, key, label, imageIndex, textContentIndex }) => {
    if (value) {
      const imageHref = imageLink[imageIndex]?.getAttribute('href') || '';
      const contactItem = createContactItem(value, type, key, label, imageHref,  textContentIndex !== undefined ? enquiryFirstChild[textContentIndex].textContent : undefined);
      if (contactItem) contactItems.append(contactItem);
    }
  });

  rightCol.append(contactItems);
  row.append(leftCol);
  row.append(rightCol);

  if (enquiryChildren[0]) {
    enquiryChildren[0].innerHTML = '';
    enquiryChildren[0].append(row);
    container.append(enquiryChildren[0]);
  }

  const row2 = document.createElement('div');
  row2.className = 'row contactus-bottom';

  const leftCol2 = document.createElement('div');
  leftCol2.className = 'col-xl-6 col-lg-6 col-md-3 col-sm-4';

  const rightCol2 = document.createElement('div');
  rightCol2.className = 'col-xl-6 col-lg-6 col-md-3 col-sm-4';

  if (enquirySecondChild[0]) {
    leftCol2.append(enquirySecondChild[0].cloneNode(true));
    row2.append(leftCol2);
  }

  if (enquirySecondChild[1]) {
    rightCol2.append(enquirySecondChild[1].cloneNode(true));
  }

  const viewJobCTAName = enquirySecondChild[4]?.cloneNode(true)?.textContent?.trim().replace(/-/g, "").toLowerCase() || "";
  const northEastArrow = SvgIcon({
    name: viewJobCTAName,
    className: 'contactus-bottom-cta',
    size: 12,
    color: 'currentColor',
  });

const targetElement = enquirySecondChild[2];
const nextTarget = enquirySecondChild[3];

if (targetElement) {
  const anchorElement = targetElement.querySelector('a');

  if (anchorElement) {
    const nextTargetText = nextTarget?.cloneNode(true)?.textContent.trim();

    if (nextTargetText) {
      anchorElement.target = nextTargetText;
    } else if (northEastArrow) {
      // Append SVG only if `northEastArrow` is valid
      const svgElement = typeof northEastArrow === 'string' ? stringToHtml(northEastArrow) : northEastArrow;
      if (svgElement) {
        anchorElement.appendChild(svgElement);
      }
    }
  }

  // Clone and append `targetElement` to `rightCol2`
  rightCol2.append(targetElement.cloneNode(true));
}



  row2.append(rightCol2);
   if (enquiryChildren[1]) {
    enquiryChildren[1].innerHTML = '';
    enquiryChildren[1].append(row2);
    container.append(enquiryChildren[1]);
  }
  // container.append(row2);

  wrapper.innerHTML = '';
  wrapper.append(container);
}
