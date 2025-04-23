import ImageComponent from '../../shared-components/ImageComponent.js';
import Heading from '../../shared-components/Heading.js';
import { moveInstrumentation } from '../../scripts/scripts.js';
import SvgIcon from '../../shared-components/SvgIcon.js';
import stringToHTML from '../../shared-components/Utility.js';

const currentIndex = [];
const CAROUSEL_SIZE = 4;
let countCarousel = 0;

const nextDisableCta = SvgIcon({
  name: 'disableRightArrow',
  className: 'carousel-next-cta',
  size: '16px',
});
const prevDisableCta = SvgIcon({
  name: 'disableLeftArrow',
  className: 'carousel-next-cta',
  size: '16px',
});
const prevCta = SvgIcon({
  name: 'LeftArrow',
  className: 'carousel-next-cta',
  size: '16px',
});
const nextCta = SvgIcon({
  name: 'RightArrow',
  className: 'carousel-next-cta',
  size: '16px',
});

function handleDisableButton(block, currentCarousel) {
  const prevButton = document.querySelectorAll('.carousel-prev')[currentCarousel];
  const nextButton = document.querySelectorAll('.carousel-next')[currentCarousel];
  const totalItems = block.querySelectorAll('.card-pair').length;

  prevButton.innerHTML = '';

  if (currentIndex[currentCarousel] > 0) {
    prevButton.style.cursor = 'pointer';
    prevButton.append(stringToHTML(prevCta));
  } else {
    prevButton.style.cursor = 'default';
    prevButton.append(stringToHTML(prevDisableCta));
  }

  nextButton.innerHTML = '';
  if (currentIndex[currentCarousel] < totalItems - 1) {
    nextButton.style.cursor = 'pointer';
    nextButton.append(stringToHTML(nextCta));
  } else {
    nextButton.style.cursor = 'default';
    nextButton.append(stringToHTML(nextDisableCta));
  }
}

function moveSlide(direction, block, currentCarousel) {
  const totalItems = block.querySelectorAll('.project-card').length;
  if (totalItems <= CAROUSEL_SIZE) {
    return;
  }
  const carouselContainer = block.querySelector('.carousel-container');

  currentIndex[currentCarousel] += direction;
  document.dispatchEvent(new CustomEvent('currentIndexChanged', { detail: { currentIndex, currentCarousel } }));
  handleDisableButton(block, currentCarousel);

  if (currentIndex[currentCarousel] >= 0 && currentIndex[currentCarousel] <= totalItems) {
    if (currentIndex[currentCarousel] < 0) {
      currentIndex[currentCarousel] = totalItems;
    } else if (currentIndex[currentCarousel] >= totalItems - 1) {
      currentIndex[currentCarousel] = 0;
    }
    const offset = -currentIndex[currentCarousel] * 100;
    carouselContainer.style.transform = `translateX(${offset}%)`;
  }

  const cardHeight = block.querySelectorAll('.card-pair')[currentIndex[currentCarousel]].offsetHeight;
  carouselContainer.style.height = carouselContainer.style.height === `${cardHeight}px` ? '100%' : `${cardHeight}px`;
}

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
  cardsGridContainer.className = 'projectcards-grid row carousel-container';

  // Handle project cards
  const projectCards = Array.from(block.querySelectorAll('[data-aue-model="projectcard"],[data-gen-model="featureItem"]'));

  // Handle last element differently for author vs publish instance
  let lastElement = null;
  if (window.location.hostname.includes('author')) {
    // In author instance, find linkField without removing from projectCards
    lastElement = block.querySelector('[data-aue-model="linkField"]');
  } else {
    // In publish instance, check and pop last element if it has button-container
    lastElement = projectCards.length > 0
      && projectCards[projectCards.length - 1].firstElementChild.querySelector('.button-container')
      ? projectCards.pop() : null;
  }
  let cardPair = document.createElement('div');
  cardPair.classList.add('card-pair');

  projectCards.forEach((card, index) => {
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
      const imageAlt = card.querySelectorAll('a[href]')[1]?.getAttribute('title') || card.querySelector('[data-aue-prop="title"]')?.textContent || 'Project Image';

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

    // Append the cardElement to the card-pair div
    cardPair.appendChild(cardElement);

    // After every 4 cards, append the card-pair div to the parent container
    if ((index + 1) % CAROUSEL_SIZE === 0 || index === projectCards.length - 1) {
      // Append the current card-pair (group of 4 cards) to the cardsGridContainer
      cardsGridContainer.appendChild(cardPair);
      // Create a new card-pair container for the next group of 4 cards
      cardPair = document.createElement('div');
      cardPair.classList.add('card-pair');
    }
  });

  projectCardsContainer.appendChild(cardsGridContainer);

  const carouselContaier = document.createElement('div');
  carouselContaier.setAttribute('class', 'carousel');

  carouselContaier.appendChild(cardsGridContainer);

  const prevButton = document.createElement('button');
  prevButton.setAttribute('class', 'carousel-prev');

  const nextButton = document.createElement('button');
  nextButton.setAttribute('class', 'carousel-next');

  prevButton.append(stringToHTML(prevDisableCta));
  prevButton.style.cursor = 'default';

  const buttonGroup = document.createElement('div');
  buttonGroup.setAttribute('class', 'button-group');

  buttonGroup.appendChild(prevButton);
  buttonGroup.appendChild(nextButton);
  carouselContaier.appendChild(buttonGroup);

  projectCardsContainer.appendChild(carouselContaier);

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

  const projectCard = block.querySelectorAll('.project-card');
  if (projectCard.length <= CAROUSEL_SIZE) {
    nextButton.append(stringToHTML(nextDisableCta));
  } else {
    nextButton.append(stringToHTML(nextCta));
  }

  document.addEventListener('currentIndexChanged', (e) => {
    handleDisableButton(block, e.detail.currentCarousel);
  });

  countCarousel += 1;
  for (let i = 0; i < countCarousel; i += 1) {
    currentIndex[i] = 0;
  }

  document.querySelectorAll('.carousel-prev').forEach((element, index) => {
    // Check if the event listener has already been added (using a custom data attribute or a class)
    if (!element.hasAttribute('data-listener-added')) {
      element.addEventListener('click', () => {
        if (currentIndex[index] - 1 >= 0) { moveSlide(-1, block, index); }
      });

      // Mark that the listener has been added
      element.setAttribute('data-listener-added', 'true');
    }
  });

  document.querySelectorAll('.carousel-next').forEach((element, index) => {
    // Check if the event listener has already been added (using a custom data attribute or a class)
    if (!element.hasAttribute('data-listener-added')) {
      element.addEventListener('click', () => {
        const totalItems = block.querySelectorAll('.card-pair').length;
        if (currentIndex[index] !== totalItems - 1) { moveSlide(1, block, index); }
      });

      // Mark that the listener has been added
      element.setAttribute('data-listener-added', 'true');
    }
  });

  if (block.querySelectorAll('.card-pair').length === 1) {
    block.querySelector('.button-group').style.display = 'none';
  }
}
