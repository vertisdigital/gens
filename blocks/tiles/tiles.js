import SvgIcon from '../../shared-components/SvgIcon.js';

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
    col.className = 'col-sm-4 col-md-3 col-xl-6';
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

      const ctaCaption = childrens[6];
      if (buttonContainer && buttonContainer.textContent.trim() !== '' && ctaCaption !== null) {
        const ctaLink = document.createElement('a');
        ctaLink.href = buttonContainer.href;
        ctaLink.className = (index % 2 === 1) ? 'odd-learn-button learn-button' : 'learn-button';
        ctaLink.textContent = ctaCaption.textContent;
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
  if (row?.querySelector('.learn-button')) {
    block.classList.add('with-cta');
  }
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
