import { moveInstrumentation } from '../../scripts/scripts.js';
import ImageComponent from '../../shared-components/ImageComponent.js';

export default function decorate(block) {
  // Create main container
  let awardsGalleryContainer = block.querySelector('.awardsgallery-container');
  if (!awardsGalleryContainer) {
    awardsGalleryContainer = document.createElement('div');
    awardsGalleryContainer.className = 'awardsgallery-container container';
    moveInstrumentation(block, awardsGalleryContainer);
  }
  // Create cards grid container
  const cardsGridContainer = document.createElement('div');
  cardsGridContainer.className = 'awardsgallery-grid row';
  awardsGalleryContainer.appendChild(cardsGridContainer);
  const awardsGalleryCards = block.children || [];
  [...awardsGalleryCards]?.forEach((card) => {
    const cardElement = document.createElement('div');
    cardElement.className = 'awardsgallery-card col-xl-4 col-lg-4 col-md-3 col-sm-2';
    moveInstrumentation(card, cardElement);

    const imageLink = card.querySelector('a[href]');
    if (imageLink) {
      const imageContainer = document.createElement('div');
      const imageUrl = imageLink.getAttribute('href');
      imageContainer.className = 'awardsgallery-image';
      //   const imageAlt = card.querySelector('[data-aue-prop="title"]')?.textContent
      //     || 'Awards Gallery Image';

      const imageHtml = ImageComponent({
        src: imageUrl,
        alt: '',
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
    cardContent.className = 'awardsgallery-content';
    const cardElementsList = card.querySelectorAll('div');
    // Handle award year
    const awardYear = cardElementsList[1];
    if (awardYear) {
      awardYear.classList.add('award-year');
      cardContent.appendChild(awardYear);
    }
    // Handle award title
    const awardTitle = cardElementsList[2];
    if (awardTitle) {
      awardTitle.classList.add('award-title');
      cardContent.appendChild(awardTitle);
    }
    // Handle award description
    const awardDescription = cardElementsList[3];
    if (awardDescription) {
      awardDescription.classList.add('award-description');
      cardContent.appendChild(awardDescription);
    }
    cardElement.appendChild(cardContent);
    cardsGridContainer.appendChild(cardElement);
  });
  // Clear original block content and append new structure
  block.textContent = '';
  block.appendChild(awardsGalleryContainer);
}
