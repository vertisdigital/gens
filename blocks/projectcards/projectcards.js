import ImageComponent from '../../shared-components/ImageComponent.js';
import Heading from '../../shared-components/Heading.js';

export default function decorate(block) {
  // Create main container
  let projectCardsContainer = block.querySelector('.projectcards-container');
  if (!projectCardsContainer) {
    projectCardsContainer = document.createElement('div');
    projectCardsContainer.className = 'projectcards-container container-xl';
    projectCardsContainer.setAttribute('data-aue-type', 'container');
    projectCardsContainer.setAttribute('data-aue-behavior', 'component');
    projectCardsContainer.setAttribute('data-aue-model', 'projectcards');
    projectCardsContainer.setAttribute('data-aue-label', 'ProjectCards');
    projectCardsContainer.setAttribute('data-aue-filter', 'projectcards');
    projectCardsContainer.setAttribute('data-block-name', 'projectcards');
  }

  // Create header section
  const headerContainer = document.createElement('div');
  headerContainer.className = 'projectcards-header';

  // Handle title
  const titleElement = block.querySelector('[data-aue-prop="title"]');
  if (titleElement) {
    const titleDiv = document.createElement('div');
    titleDiv.setAttribute('data-aue-prop', 'title');
    titleDiv.setAttribute('data-aue-label', 'Title');
    titleDiv.setAttribute('data-aue-type', 'text');
    titleDiv.className = 'projectcards-title';
    titleDiv.textContent = titleElement.textContent;
    headerContainer.appendChild(titleDiv);
    titleElement.remove();
  }

  // Handle main heading
  const headingElement = block.querySelector('[data-aue-prop="heading"]');
  if (headingElement) {
    const headingHtml = Heading({
      text: headingElement.textContent,
      level: 2,
      className: 'projectcards-heading',
      attributes: {
        'data-aue-prop': 'heading',
        'data-aue-label': 'Heading',
        'data-aue-type': 'text',
      },
    });
    // Convert HTML string to DOM node
    const tempDiv = document.createElement('div');
    tempDiv.insertAdjacentHTML('beforeend', headingHtml);
    const headingNode = tempDiv.firstElementChild;

    headerContainer.appendChild(headingNode);
    headingElement.remove();
  }

  // Handle description
  const descElement = block.querySelector('[data-aue-prop="description"]');
  if (descElement) {
    const descriptionDiv = document.createElement('div');
    descriptionDiv.setAttribute('data-aue-prop', 'description');
    descriptionDiv.setAttribute('data-aue-label', 'Description');
    descriptionDiv.setAttribute('data-aue-filter', 'text');
    descriptionDiv.className = 'projectcards-description';
    descriptionDiv.textContent = descElement.textContent;
    headerContainer.appendChild(descriptionDiv);
    descElement.remove();
  }

  projectCardsContainer.appendChild(headerContainer);

  // Create cards grid container
  const cardsGridContainer = document.createElement('div');
  cardsGridContainer.className = 'projectcards-grid row';

  // Handle project cards
  const projectCards = block.querySelectorAll('[data-aue-model="projectcard"]');
  projectCards.forEach((card) => {
    const cardElement = document.createElement('div');
    cardElement.className = 'project-card col-xl-3 col-lg-3 col-md-3 col-sm-2';
    cardElement.setAttribute('data-aue-type', 'component');
    cardElement.setAttribute('data-aue-model', 'projectcard');
    cardElement.setAttribute('data-aue-label', 'ProjectCard');
    cardElement.setAttribute('data-aue-resource', card.getAttribute('data-aue-resource'));

    // Handle card image
    const imageLink = card.querySelector('a[href]');
    if (imageLink) {
      const imageContainer = document.createElement('div');
      imageContainer.setAttribute('data-aue-prop', 'image');
      imageContainer.setAttribute('data-aue-label', 'Image');
      imageContainer.setAttribute('data-aue-type', 'image');

      const imageUrl = imageLink.getAttribute('href');
      const imageAlt = card.querySelector('[data-aue-prop="title"]')?.textContent || 'Project Image';

      const imageHtml = ImageComponent({
        src: imageUrl,
        alt: imageAlt,
        className: 'project-card-image',
        breakpoints: {
          mobile: {
            width: 768,
            src: `${imageUrl}`,
          },
          tablet: {
            width: 1024,
            src: `${imageUrl}`,
          },
          desktop: {
            width: 1920,
            src: `${imageUrl}`,
          },
        },
        lazy: true,
      });

      imageContainer.insertAdjacentHTML('beforeend', imageHtml);
      cardElement.appendChild(imageContainer);
      imageLink.remove();
    }

    // Handle card content
    const cardContent = document.createElement('div');
    cardContent.className = 'project-card-content';

    // Handle card title
    const cardTitle = card.querySelector('[data-aue-prop="title"]');
    if (cardTitle) {
      const titleDiv = document.createElement('div');
      titleDiv.setAttribute('data-aue-prop', 'title');
      titleDiv.setAttribute('data-aue-label', 'Title');
      titleDiv.setAttribute('data-aue-type', 'text');
      titleDiv.className = 'project-card-title';
      titleDiv.textContent = cardTitle.textContent;
      cardContent.appendChild(titleDiv);
      cardTitle.remove();
    }

    // Handle card location
    const locationElement = card.querySelector('[data-aue-prop="location"]');
    if (locationElement) {
      const locationDiv = document.createElement('div');
      locationDiv.setAttribute('data-aue-prop', 'location');
      locationDiv.setAttribute('data-aue-label', 'Location');
      locationDiv.setAttribute('data-aue-type', 'text');
      locationDiv.className = 'project-card-location';
      locationDiv.textContent = locationElement.textContent;
      cardContent.appendChild(locationDiv);
      locationElement.remove();
    }

    cardElement.appendChild(cardContent);
    cardsGridContainer.appendChild(cardElement);
  });

  projectCardsContainer.appendChild(cardsGridContainer);

  // Handle View All link
  if(projectCards.length>0){
  const linkFieldElement = block.querySelector('[data-aue-model="linkField"]');
  if (linkFieldElement) {
    const linkContainer = document.createElement('div');
    linkContainer.className = 'projectcards-view-all';
    linkContainer.setAttribute('data-aue-type', 'component');
    linkContainer.setAttribute('data-aue-model', 'linkField');
    linkContainer.setAttribute('data-aue-filter', 'linkField');
    linkContainer.setAttribute('data-aue-label', 'Link Field');

    const linkElement = linkFieldElement.querySelector('a');
    if (linkElement) {
      const linkDiv = document.createElement('div');
      const viewAllLink = document.createElement('a');
      viewAllLink.href = linkElement.getAttribute('href');
      viewAllLink.textContent = linkElement.textContent;
      viewAllLink.className = 'view-all-link';
      viewAllLink.setAttribute('data-aue-prop', 'linkText');
      viewAllLink.setAttribute('data-aue-label', 'Text');
      viewAllLink.setAttribute('data-aue-type', 'text');

      const targetDiv = document.createElement('div');
      targetDiv.setAttribute('data-aue-prop', 'linkTarget');
      targetDiv.setAttribute('data-aue-label', 'Link Target');
      targetDiv.setAttribute('data-aue-type', 'text');
      viewAllLink.target = linkFieldElement.querySelector('[data-aue-prop="linkTarget"]')?.textContent || '_self';

      linkDiv.appendChild(viewAllLink);
      linkContainer.appendChild(linkDiv);
      linkContainer.appendChild(targetDiv);
    }

    projectCardsContainer.appendChild(linkContainer);
    linkFieldElement.remove();
  }
  }

  // Clear original block content and append new structure
  block.textContent = '';
  block.appendChild(projectCardsContainer);

  // Add keyboard navigation and accessibility attributes
  const cards = block.querySelectorAll('.project-card');
  cards.forEach((card, index) => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'article');
    card.setAttribute('aria-label', `Project ${index + 1}`);

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        // Trigger card action if needed
        card.click();
      }
    });
  });
}
