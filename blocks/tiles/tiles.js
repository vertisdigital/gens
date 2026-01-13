import SvgIcon from '../../shared-components/SvgIcon.js';
import stringToHTML from '../../shared-components/Utility.js';

/**
 * Decorates the tiles block
 * @param {Element} block The tiles block element
 */
export default function decorate(block) {
  // Add container wrappers for each breakpoint
  block.classList.add('container');

  // Create row wrapper
  const row = document.createElement('div');
  row.className = 'row tiles-container ';

  // Move existing tiles into grid columns
  const tiles = Array.from(block.children);
  const firstTile = tiles[0];
  const isFirsTileImage = tiles[0] && tiles[0].children[3].textContent === 'false';

  tiles.forEach((tile, index) => {
    // Handle first tile's download button
    const col = document.createElement('div');
    col.className = 'col-sm-4 col-md-6 col-xl-6';
    col.appendChild(tile);
    row.appendChild(col);

    if (isFirsTileImage || index > 0) {
      firstTile.children[3].textContent = '';
      // Handle image tiles (all except first)
      const imageLink = tile.querySelector(
        'a[href*="/content/dam/"][href$=".png"], a[href*="delivery-"]',
      );
      if (imageLink) {
        // Set as background
        tile.style.backgroundImage = `url(${imageLink}/as/tiles.webp?width=850)`;
        tile.style.backgroundPosition = 'center';
        tile.style.backgroundSize = 'cover';
        tile.style.backgroundRepeat = 'no-repeat';
        col.classList.add('image-tile');
        // Remove original link
        imageLink.remove();
      }

      // Handle CTA link
      const childrens = tile.children;
      const buttonContainer = childrens[5].querySelector('a');
      childrens[3].textContent = '';

      // Check if children[2] (third child, 0-indexed) has a picture element in its first <p>
      const thirdChild = childrens[2];
      const firstP = thirdChild && thirdChild.querySelector('p:first-child');
      const hasPicture = firstP && firstP.querySelector('picture') !== null;
      
      // Find the description paragraph in div:nth-child(2) (second child, 1-indexed in CSS)
      // This is the paragraph we want to style conditionally
      let descriptionParagraph = null;
      
      // Try multiple selectors to find the paragraph
      // The paragraph is in the second div child of the tile
      if (childrens[1]) {
        descriptionParagraph = childrens[1].querySelector('p');
      }
      
      // Fallback: use querySelector on the tile
      if (!descriptionParagraph) {
        descriptionParagraph = tile.querySelector('div:nth-child(2) p');
      }
      
      // Apply the class if paragraph is found
      if (descriptionParagraph) {
        if (hasPicture) {
          descriptionParagraph.classList.add('has-picture');
          // Add has-picture class to the next div (div:nth-child(3))
          // children[1] is div:nth-child(2), children[2] is div:nth-child(3)
          if (childrens[2]) {
            childrens[2].classList.add('has-picture');
          }
        } else {
          descriptionParagraph.classList.add('no-picture');
        }
      }

      const ctaCaption = childrens[6];
      if (buttonContainer && buttonContainer.textContent.trim() !== '' && ctaCaption !== null) {
        const ctaLink = document.createElement('a');
        ctaLink.href = buttonContainer.href;
        ctaLink.className = (index % 2 === 1) ? 'odd-learn-button learn-button' : 'learn-button';
        // Create circular icon button with arrow icon
        const arrowIcon = SvgIcon({
          name: 'arrowright',
          className: 'learn-button-icon',
          size: '14',
          color: 'var(--primary-default-fg)',
        });
        ctaLink.innerHTML = '';
        ctaLink.appendChild(stringToHTML(arrowIcon));
        ctaCaption.parentNode.replaceChild(ctaLink, ctaCaption);
      }

      if (buttonContainer) {
        buttonContainer.remove();
      }
      if (ctaCaption) {
        ctaCaption.remove();
      }
    }

    if (!isFirsTileImage && index === 0) {
      col.classList.add('no-image-tile');
      const childrens = firstTile.children;
      const buttonContainer = childrens[3].textContent === 'true' ? childrens[4].querySelector('a') : childrens[3].querySelector('a');
      const ctaCaption = childrens[6];
      const downArraowWithLine = SvgIcon({
        name: 'downArraowWithLine',
        className: 'factsheet-button-arrow animation-element',
        size: '14',
        color: '',
      });

      if (buttonContainer && buttonContainer.textContent.trim() !== '' && ctaCaption !== null) {
        const ctaLink = document.createElement('a');
        ctaLink.href = buttonContainer.href;
        ctaLink.target = childrens[3]?.textContent === 'true' ? '_blank' : '_self';
        ctaLink.className = 'factsheet-button animated-cta';
        ctaLink.innerHTML = `${ctaCaption.textContent} ${downArraowWithLine}`;
        // Replace CTA caption with link
        ctaCaption.parentNode.replaceChild(ctaLink, ctaCaption);
      }
      if (buttonContainer) {
        buttonContainer.remove();
      }
      if (ctaCaption) {
        ctaCaption.remove();
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
