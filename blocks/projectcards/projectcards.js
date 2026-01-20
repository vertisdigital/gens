import ImageComponent from '../../shared-components/ImageComponent.js';
import Heading from '../../shared-components/Heading.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Remove grey-background classes if present
  block.classList.remove('grey-background', 'grey-background-row');
  
  // Create main container
  let projectCardsContainer = block.querySelector('.projectcards-container');
  if (!projectCardsContainer) {
    projectCardsContainer = document.createElement('div');
    projectCardsContainer.className = 'projectcards-container container';
    moveInstrumentation(block, projectCardsContainer);
  }

  // Create header section with 2-column layout
  const headerContainer = document.createElement('div');
  headerContainer.className = 'projectcards-header';

  // Create left column for title and heading
  const leftColumn = document.createElement('div');
  leftColumn.className = 'projectcards-header-left';

  // Handle title (label like "PROJECTS")
  const titleElements = block.querySelectorAll(
    '[data-aue-prop="title"], [data-gen-prop="title"]',
  );
  const titleField = titleElements[0];
  if (titleField) {
    const titleDiv = document.createElement('div');
    moveInstrumentation(titleField, titleDiv);
    titleDiv.className = 'projectcards-title';
    titleDiv.textContent = titleField.textContent;
    leftColumn.appendChild(titleDiv);
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

    leftColumn.appendChild(headingNode);
    headingElement.remove();
  }

  headerContainer.appendChild(leftColumn);

  // Create right column for description
  const rightColumn = document.createElement('div');
  rightColumn.className = 'projectcards-header-right';

  // Handle description
  const descElement = block.querySelector(
    '[data-aue-prop="description"], [data-gen-prop="description"]',
  );
  if (descElement) {
    const descriptionDiv = document.createElement('div');
    moveInstrumentation(descElement, descriptionDiv);
    descriptionDiv.className = 'projectcards-description';
    descriptionDiv.textContent = descElement.textContent;
    rightColumn.appendChild(descriptionDiv);
    descElement.remove();
  }

  headerContainer.appendChild(rightColumn);
  projectCardsContainer.appendChild(headerContainer);

  // Create cards grid container (will be outside container for 100% width)
  const cardsGridContainer = document.createElement('div');
  cardsGridContainer.className = 'projectcards-grid row';

  // Handle project cards
  const projectCards = Array.from(block.querySelectorAll('[data-aue-model="projectcard"],[data-gen-model="featureItem"]'));
  
  // Handle last element differently for author vs publish instance
  let lastElement = null;
  if (window.location.hostname.includes('author')) {
    // In author instance, find linkField without removing from projectCards
    lastElement = block.querySelector('[data-aue-model="linkField"]');
  } else {
    // In publish instance, check and pop last element if it has button-container
    lastElement = projectCards.length > 0 && 
      projectCards[projectCards.length - 1].firstElementChild.querySelector('.button-container') ? 
      projectCards.pop() : null;
  }

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

      // Handle card content (positioned on top of image)
      const cardContent = document.createElement('div');
      cardContent.className = 'project-card-content';

      // Handle card title
      const cardTitle = card.querySelector(
        '[data-aue-prop="projectText"], .button-container .button',
      );
      let titleHref = '';
      let linkTarget = '_self';
      
      if (cardTitle) {
        // Extract href from cardTitle (anchor tag)
        titleHref = cardTitle.getAttribute('href') || '';
        // setting the link target
        linkTarget = card.querySelector(
          '[data-aue-prop="projectTarget"], [data-gen-prop="feature-title"]',
        )?.textContent || '_self';
        cardTitle.setAttribute('target', linkTarget);

        const titleDiv = document.createElement('div');
        titleDiv.className = 'project-card-title';
        cardTitle.className = '';

        titleDiv.appendChild(cardTitle);
        cardContent.appendChild(titleDiv);
      }

      // Handle card location (hidden as per Figma design - only title shown)
      const locationElement = card.querySelector(
        '[data-aue-prop="location"], div:last-child',
      );
      if (locationElement) {
        // Hide location element as per Figma design
        locationElement.remove();
      }

      // Add SVG CTA button (arrow icon on the right) with same href as title
      const ctaButton = document.createElement('a');
      if (titleHref) {
        ctaButton.setAttribute('href', titleHref);
        ctaButton.setAttribute('target', linkTarget);
      }
      ctaButton.className = 'project-card-cta';
      ctaButton.innerHTML = `
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 1C36.7025 1 47 11.2975 47 24C47 36.7025 36.7025 47 24 47C11.2975 47 1 36.7025 1 24C1 11.2975 11.2975 1 24 1Z" stroke="#F7FAFA" stroke-width="2"/>
          <path d="M24.165 17.1323C24.3732 16.9453 24.6974 16.9581 24.8896 17.1606L30.7275 23.3218C31.0905 23.7048 31.0905 24.2961 30.7275 24.6792L24.8896 30.8393C24.6974 31.0421 24.3733 31.0549 24.165 30.8677C23.9569 30.6804 23.9437 30.3645 24.1357 30.1616L29.499 24.5005H17.5C17.2239 24.5005 17.0001 24.2765 17 24.0005C17 23.7243 17.2239 23.5005 17.5 23.5005H29.499L24.1357 17.8393C23.9435 17.6364 23.9568 17.3196 24.165 17.1323Z" fill="#F7FAFA"/>
        </svg>
      `;
      cardContent.appendChild(ctaButton);

      // Append content to image container (for absolute positioning)
      imageContainer.appendChild(cardContent);
      cardElement.appendChild(imageContainer);
      imageLink.remove();
    }
    cardsGridContainer.appendChild(cardElement);
  });

  // Handle View All link using the stored last element
  if (lastElement) {
    const linkContainer = document.createElement('div');
    moveInstrumentation(lastElement, linkContainer);
    linkContainer.className = 'projectcards-view-all';
    const linkElement = lastElement.querySelector('a');
    if (linkElement) {
      const linkDiv = document.createElement('div');
      linkElement.className = 'view-all-link';
      linkElement.target = lastElement.children[2]?.textContent || '_self';
      linkDiv.appendChild(linkElement); 
      linkContainer.appendChild(linkDiv);
    }

    projectCardsContainer.appendChild(linkContainer);
    lastElement.remove();
  }

  // Clear original block content and append new structure
  // Header stays in container, grid breaks out for 100% width
  block.textContent = '';
  block.appendChild(projectCardsContainer);
  block.appendChild(cardsGridContainer);

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
