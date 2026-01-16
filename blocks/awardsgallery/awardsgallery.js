import { moveInstrumentation } from '../../scripts/scripts.js';
import ImageComponent from '../../shared-components/ImageComponent.js';
import SvgIcon from '../../shared-components/SvgIcon.js';

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
    cardElement.className = 'awardsgallery-card';
    moveInstrumentation(card, cardElement);

    const imageLink = card.querySelector('a[href]');
    if (imageLink) {
      const imageContainer = document.createElement('div');
      const imageUrl = imageLink.getAttribute('href');
      imageContainer.className = 'awardsgallery-image';

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


  // Count items in awardsgallery-grid
  const cards = cardsGridContainer.querySelectorAll('.awardsgallery-card');
  const cardCount = cards.length;

  // Only show arrows if there are more than 3 items (4 or more)
  if (cardCount > 3) {
    // ----- create carousel buttons -----
    const prevBtn = document.createElement('button');
    const nextBtn = document.createElement('button');

    prevBtn.className = 'awardsgallery-arrow prev';
    nextBtn.className = 'awardsgallery-arrow next';

    prevBtn.setAttribute('aria-label', 'Previous');
    nextBtn.setAttribute('aria-label', 'Next');

    // Add circular button with arrow SVG
    const nextArrowIcon = SvgIcon({
      name: 'chevronRight',
      size: '24'
    });

    const preArrowIcon = SvgIcon({
      name: 'chevronLeft',
      size: '24'
    });

    prevBtn.innerHTML = preArrowIcon;
    nextBtn.innerHTML = nextArrowIcon;

    awardsGalleryContainer.appendChild(prevBtn);
    awardsGalleryContainer.appendChild(nextBtn);

    // Function to update button states based on scroll position
    const updateButtonStates = () => {
      const scrollLeft = cardsGridContainer.scrollLeft;
      const scrollWidth = cardsGridContainer.scrollWidth;
      const clientWidth = cardsGridContainer.clientWidth;
      const scrollThreshold = 1; // Small threshold for comparison

      // Disable prev button if at the start
      if (scrollLeft <= scrollThreshold) {
        prevBtn.disabled = true;
        prevBtn.setAttribute('aria-disabled', 'true');
      } else {
        prevBtn.disabled = false;
        prevBtn.setAttribute('aria-disabled', 'false');
      }

      // Disable next button if at the end
      if (scrollLeft + clientWidth >= scrollWidth - scrollThreshold) {
        nextBtn.disabled = true;
        nextBtn.setAttribute('aria-disabled', 'true');
      } else {
        nextBtn.disabled = false;
        nextBtn.setAttribute('aria-disabled', 'false');
      }
    };

    // Initial button state
    updateButtonStates();

    // Scroll logic
    const scrollAmount = () => {
      const card = cardsGridContainer.querySelector('.awardsgallery-card');
      return (card?.offsetWidth || 0) + 24;
    };

    prevBtn.addEventListener('click', () => {
      cardsGridContainer.scrollBy({
        left: -scrollAmount(),
        behavior: 'smooth',
      });
    });

    nextBtn.addEventListener('click', () => {
      cardsGridContainer.scrollBy({
        left: scrollAmount(),
        behavior: 'smooth',
      });
    });

    // Update button states on scroll
    cardsGridContainer.addEventListener('scroll', updateButtonStates);

    // Update button states on window resize
    window.addEventListener('resize', updateButtonStates);
  }

  // Clear original block content and append new structure
  block.textContent = '';
  block.appendChild(awardsGalleryContainer);
}
