import ImageComponent from '../../shared-components/ImageComponent.js';
import Heading from '../../shared-components/Heading.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Create main container
  let projectCardsContainer = block.querySelector('.projectcards-container');
  if (!projectCardsContainer) {
    projectCardsContainer = document.createElement('div');
    projectCardsContainer.className = 'projectcards-container container';
    moveInstrumentation(block, projectCardsContainer);
  }

  // Create header section
  const headerContainer = document.createElement('div');
  headerContainer.className = 'projectcards-header';

  // Handle title
  const titleElements = block.querySelectorAll(
    '[data-aue-prop="title"], [data-gen-prop="title"]',
  );
  const titleField = titleElements[0];
  if (titleField) {
    const titleDiv = document.createElement('div');
    moveInstrumentation(titleField, titleDiv);
    titleDiv.className = 'projectcards-title';
    titleDiv.textContent = titleField.textContent;
    headerContainer.appendChild(titleDiv);
    titleField.remove();
  }

  // Handle main heading
  const headingElement = block.querySelector('[data-aue-prop="heading"]') || titleElements[1];
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
  const descElement = block.querySelector(
    '[data-aue-prop="description"], [data-gen-prop="description"]',
  );
  if (descElement) {
    const descriptionDiv = document.createElement('div');
    moveInstrumentation(descElement, descriptionDiv);
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
  const projectCards = block.querySelectorAll('[data-aue-model="projectcard"],[data-gen-model="featureItem"]');
  projectCards.forEach((card) => {
    const cardElement = document.createElement('div');
    cardElement.className = 'project-card col-xl-3 col-md-3 col-sm-2';
    moveInstrumentation(card, cardElement);

    // Handle card image
    const imageLink = card.querySelector('a[href]');
    if (imageLink) {
      const imageContainer = document.createElement('div');
      imageContainer.setAttribute('data-aue-prop', 'image');
      imageContainer.setAttribute('data-aue-label', 'Image');
      imageContainer.setAttribute('data-aue-type', 'image');

      const imageUrl = imageLink.getAttribute('href');
      const imageAlt =card.querySelectorAll('a[href]')[1]?.getAttribute('title') || card.querySelector('[data-aue-prop="title"]')?.textContent || 'Project Image';
      
      const imageHtml = ImageComponent({
        src: imageUrl,
        alt: imageAlt,
        className: 'project-card-image',
        asImageName: 'projectcards.webp',
        breakpoints: {
          mobile: {
            width: 768,
            src: `${imageUrl}`,
            imgWidth: 170,
            imgHeight: 170,
          },
          tablet: {
            width: 993,
            src: `${imageUrl}`,
            imgWidth: 370,
            imgHeight: 370,
          },
          desktop: {
            width: 1920,
            src: `${imageUrl}`,
            imgWidth: 260,
            imgHeight: 260,
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
    const cardTitle = card.querySelector(
      '[data-aue-prop="projectText"], .button-container .button',
    );
    if (cardTitle) {
      const titleDiv = document.createElement('div');
      titleDiv.className = 'project-card-title';
      cardTitle.className = '';
      // setting the link target
      const linkTarget = card.querySelector(
        '[data-aue-prop="projectTarget"], [data-gen-prop="feature-title"]',
      )?.textContent || '_self';
      cardTitle.setAttribute('target', linkTarget);

      titleDiv.appendChild(cardTitle);
      cardContent.appendChild(titleDiv);
    }

    // Handle card location
    const locationElement = card.querySelector(
      '[data-aue-prop="location"], div:last-child',
    );
    if (locationElement) {
      const locationDiv = document.createElement('div');
      locationDiv.setAttribute('data-aue-prop', 'location');
      locationDiv.setAttribute('data-aue-label', 'Location');
      locationDiv.setAttribute('data-aue-type', 'text');
      locationDiv.className = 'project-card-location';
      locationDiv.innerHTML = locationElement.innerHTML;
      cardContent.appendChild(locationDiv);
      locationElement.remove();
    }

    cardElement.appendChild(cardContent);
    cardsGridContainer.appendChild(cardElement);
  });

  projectCardsContainer.appendChild(cardsGridContainer);

  // Handle View All link
  if (projectCards.length > 0) {
    const linkFieldElement = block.children[block.children.length - 1];

    if (linkFieldElement) {
      const linkContainer = document.createElement('div');
      moveInstrumentation(linkFieldElement, linkContainer);
      linkContainer.className = 'projectcards-view-all';
      const linkElement = linkFieldElement.querySelector('a');
      if (linkElement) {
        const linkDiv = document.createElement('div');
        linkElement.className = 'view-all-link';
        linkElement.target = linkFieldElement.children[2].textContent;
        linkDiv.appendChild(linkElement); 
        linkContainer.appendChild(linkDiv);
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
