import { createOptimizedPicture } from '../../scripts/aem.js';
import SvgIcon from '../../shared-components/SvgIcon.js';

/**
 * Decorates the tiles block
 * @param {Element} block The tiles block element
 */
export default function decorate(block) {
  // Add container wrappers for each breakpoint
  block.classList.add(
    'container-xl',
    'container-lg',
    'container-md',
    'container-sm',
  );

  // Create row wrapper
  const row = document.createElement('div');
  row.className = 'row tiles-container ';

  // Move existing tiles into grid columns
  const tiles = Array.from(block.children);
  const firstTile = tiles[0];
  const isFirsTileImage = firstTile && firstTile.querySelector('a[href*="/content/dam/"][href$=".png"], a[href*="/content/dam/"][href$=".jpeg"], a[href*="/content/dam/"][href$=".jpg"], a[href*="/content/dam/"][href$=".gif"]');

  tiles.forEach((tile, index) => {
    // Handle first tile's download button
    const col = document.createElement('div');
    col.className = 'col-sm-4 col-md-3 col-xl-6';
    col.appendChild(tile);
    row.appendChild(col);

    if (isFirsTileImage || index > 0) {
      // Handle image tiles (all except first)
      const imageLink = tile.querySelector(
        'a[href*="/content/dam/"][href$=".png"], a[href*="/content/dam/"][href$=".jpeg"], a[href*="/content/dam/"][href$=".jpg"], a[href*="/content/dam/"][href$=".gif"]',
      );
      if (imageLink) {
        // Create optimized picture element
        const picture = createOptimizedPicture(imageLink.href, '', false);
        // Set as background
        tile.style.backgroundImage = `url(${picture.querySelector('img').src})`;
        tile.style.backgroundPosition = 'center';
        tile.style.backgroundSize = 'cover';
        tile.style.backgroundRepeat = 'no-repeat';
        col.classList.add('image-tile');
        // Remove original link
        imageLink.remove();
      }

      // Handle CTA link
      const buttonContainer = tile.querySelector('.button-container');
      const ctaCaption = tile.querySelector('[data-aue-prop="ctaCaption"]');
      if (buttonContainer && ctaCaption) {
        const link = buttonContainer.querySelector('a');
        if (link) {
          // Create new anchor with CTA text and button link
          const ctaLink = document.createElement('a');
          ctaLink.href = link.href;
          ctaLink.className = (index % 2 === 1) ? 'odd-learn-button learn-button' : 'learn-button';
          ctaLink.textContent = ctaCaption.textContent;
          // Replace CTA caption with link
          ctaCaption.parentNode.replaceChild(ctaLink, ctaCaption);
        }
        // Remove button container
        buttonContainer.remove();
      }
    }

    if (!isFirsTileImage) {
      const buttonContainer = firstTile.querySelector('.button-container');
  
      const ctaCaption = firstTile.querySelector('[data-aue-prop="ctaCaption"]');
      const downArraowWithLine = SvgIcon({
        name: 'downArraowWithLine',
        className: 'factsheet-button-arrow animation-element',
        size: '14',
        color: '',
      });
      if (buttonContainer && ctaCaption) {
        const link = buttonContainer.querySelector('a');
        if (link) {
          // Create new anchor with CTA text and button link
          const ctaLink = document.createElement('a');
          ctaLink.href = link.href;
          ctaLink.className = 'factsheet-button animated-cta';
          ctaLink.innerHTML = `${ctaCaption.textContent} ${downArraowWithLine}`;
  
          // Add download icon
          // const downloadIcon = new SvgIcon('download');
          // ctaLink.insertBefore(downloadIcon, ctaLink.firstChild);
  
          // Add arrow icon
          // const arrowIcon = new SvgIcon('arrow-right');
          // ctaLink.appendChild(arrowIcon);
  
          // Replace CTA caption with link
          ctaCaption.parentNode.replaceChild(ctaLink, ctaCaption);
        }
        // Remove button container
        buttonContainer.remove();
      }
    }
  });

  block.textContent = '';


  if (isFirsTileImage) {
    const allImageVariation = document.createElement('div');
    allImageVariation.className = 'tile-all-image-variation ';
    allImageVariation.appendChild(row);
    block.appendChild(allImageVariation);
  } else {
    block.appendChild(row);
  }

  // Add list role for accessibility
  block.setAttribute('role', 'list');
}