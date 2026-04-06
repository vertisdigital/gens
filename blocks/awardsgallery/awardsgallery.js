import { moveInstrumentation } from '../../scripts/scripts.js';
import ImageComponent from '../../shared-components/ImageComponent.js';
import SvgIcon from '../../shared-components/SvgIcon.js';

export default function decorate(block) {
  block.classList.add('fade-item');
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
  let learnMoreElement=null;
  [...awardsGalleryCards]?.forEach((card) => {
    if (card.getAttribute('data-gen-model') === "linkField" || card.getAttribute('data-aue-model') === "linkField"){
      learnMoreElement=card;
      return;
    }
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

   // Add class for 3-column layout if there are only 3 cards
   if (cardCount === 3) {
    cardsGridContainer.classList.add('awardsgallery-grid-3-cols');
  }

  // Add class for 2-column layout if there are only 2 cards
  if (cardCount === 2) {
    cardsGridContainer.classList.add('awardsgallery-grid-2-cols');
  }

  // Add class to center the grid if there's only 1 card
  if (cardCount === 1) {
    cardsGridContainer.classList.add('awardsgallery-grid-center');
  }

  // Always create carousel buttons
  const prevBtn = document.createElement('button');
  const nextBtn = document.createElement('button');

  prevBtn.className = 'awardsgallery-arrow prev';
  nextBtn.className = 'awardsgallery-arrow next';

  // Hide arrows on desktop if there are 4 or fewer cards
  // They will still be visible on tablet and mobile via CSS
  
  if (cardCount <= 4) {
    prevBtn.classList.add('hide-on-desktop');
    nextBtn.classList.add('hide-on-desktop');
    cardsGridContainer.classList.add('no-margin-left-right');
  }

  // Hide arrows on tablet and mobile if there's only 1 card
  if (cardCount === 1) {
    prevBtn.classList.add('hide-on-tablet-mobile');
    nextBtn.classList.add('hide-on-tablet-mobile');
  }

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

    // Only update if we have valid dimensions
    if (scrollWidth === 0 || clientWidth === 0) {
      return;
    }

    // Disable prev button if at the start
    if (scrollLeft <= scrollThreshold) {
      prevBtn.disabled = true;
      prevBtn.setAttribute('aria-disabled', 'true');
    } else {
      prevBtn.disabled = false;
      prevBtn.setAttribute('aria-disabled', 'false');
    }

    // Disable next button if at the end
    // Check if content is scrollable (scrollWidth > clientWidth)
    if (scrollWidth <= clientWidth || scrollLeft + clientWidth >= scrollWidth - scrollThreshold) {
      nextBtn.disabled = true;
      nextBtn.setAttribute('aria-disabled', 'true');
    } else {
      nextBtn.disabled = false;
      nextBtn.setAttribute('aria-disabled', 'false');
    }
  };

  // Set initial scroll position to 0 to ensure first card is visible
  cardsGridContainer.scrollLeft = 0;

  // Initial button state - wait for layout to be calculated
  // Use requestAnimationFrame to ensure layout is complete
  requestAnimationFrame(() => {
    // Double RAF to ensure layout is fully calculated
    requestAnimationFrame(() => {
      updateButtonStates();
    });
  });

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

  // Update button states on window resize and reset scroll position
  window.addEventListener('resize', () => {
    // Reset scroll to start on resize to ensure first card is visible
    cardsGridContainer.scrollLeft = 0;
    // Wait for layout recalculation after resize
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        updateButtonStates();
      });
    });
  });

  // Also update button states after images load (they might affect scroll width)
  const images = cardsGridContainer.querySelectorAll('img');
  if (images.length > 0) {
    let loadedCount = 0;
    images.forEach((img) => {
      if (img.complete) {
        loadedCount += 1;
        if (loadedCount === images.length) {
          requestAnimationFrame(() => {
            updateButtonStates();
          });
        }
      } else {
        img.addEventListener('load', () => {
          loadedCount += 1;
          if (loadedCount === images.length) {
            requestAnimationFrame(() => {
              updateButtonStates();
            });
          }
        });
      }
    });
  }

  // Clear original block content and append new structure
  block.textContent = '';
  block.appendChild(awardsGalleryContainer);
  if(learnMoreElement){
    const link = learnMoreElement.querySelector('a')?.href
    const title = learnMoreElement.querySelector('a')?.textContent
    const target = learnMoreElement?.children[2]?.textContent
    
    const learnMoreDiv=document.createElement('div')
    moveInstrumentation(learnMoreElement, learnMoreDiv);
    learnMoreDiv.classList.add('learn-more')
    learnMoreDiv.innerHTML=`
    <a class="global-learn-more" href=${link} target=${target}>${title}</a>
    `;
    awardsGalleryContainer.appendChild(learnMoreDiv)
  }
}