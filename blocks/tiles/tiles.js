import SvgIcon from '../../shared-components/SvgIcon.js';
import stringToHTML from '../../shared-components/Utility.js';

/**
 * Decorates the tiles block
 * @param {Element} block The tiles block element
 */
export default function decorate(block) {
  block.classList.add('fade-item');
  // Add container wrappers for each breakpoint

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
      
      // Handle CTA link
      const childrens = tile.children;
      
      // Get last two divs for tablet and mobile images
      const childrenArray = Array.from(childrens);
      const lastTwoDivs = childrenArray.slice(-2);
      let tabletImageLink = null;
      let mobileImageLink = null;
      
      if (lastTwoDivs.length >= 2) {
        // Second to last div - tablet image
        const tabletLink = lastTwoDivs[0].querySelector('a[href*="/content/dam/"][href$=".png"], a[href*="delivery-"]');
        if (tabletLink) {
          tabletImageLink = tabletLink.href;
        }
        // Last div - mobile image
        const mobileLink = lastTwoDivs[1].querySelector('a[href*="/content/dam/"][href$=".png"], a[href*="delivery-"]');
        if (mobileLink) {
          mobileImageLink = mobileLink.href;
        }
      }
      
      if (imageLink) {
        // Set desktop background image
        const desktopImageUrl = `${imageLink.href}/as/tiles.webp?width=850`;
        tile.style.setProperty('--bg-image-desktop', `linear-gradient(180deg, rgba(0, 0, 0, 0) 45.51%, #000 117.9%), url(${desktopImageUrl})`);
        
        // Set tablet background image if available
        if (tabletImageLink) {
          const tabletImageUrl = `${tabletImageLink}/as/tiles.webp?width=850`;
          tile.style.setProperty('--bg-image-tablet', `linear-gradient(180deg, rgba(0, 0, 0, 0) 45.51%, #000 117.9%), url(${tabletImageUrl})`);
        } else {
          // Fallback to desktop image if tablet image not available
          tile.style.setProperty('--bg-image-tablet', `var(--bg-image-desktop)`);
        }
        
        // Set mobile background image if available
        if (mobileImageLink) {
          const mobileImageUrl = `${mobileImageLink}/as/tiles.webp?width=850`;
          tile.style.setProperty('--bg-image-mobile', `linear-gradient(180deg, rgba(0, 0, 0, 0) 45.51%, #000 117.9%), url(${mobileImageUrl})`);
        } else {
          // Fallback to tablet or desktop image if mobile image not available
          tile.style.setProperty('--bg-image-mobile', `var(--bg-image-tablet, var(--bg-image-desktop))`);
        }
        
        // Add class for styling instead of inline styles
        tile.classList.add('tiles-nested-image');
        col.classList.add('image-tile');
        
        // Remove original links
        imageLink.remove();
        if (tabletImageLink) {
          lastTwoDivs[0].remove();
        }
        if (mobileImageLink) {
          lastTwoDivs[1].remove();
        }
      }
      
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
      if (thirdChild && !hasPicture) {
        thirdChild.remove();
      }

      if (buttonContainer) {
        buttonContainer.remove();
        childrens[4].remove();
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
        childrens[5].remove();
      }
      if (ctaCaption) {
        ctaCaption.remove();
      }
    }
  });

  // Check if there's only one image-tile in tiles-container
  const imageTiles = row.querySelectorAll('.image-tile');
  if (imageTiles.length === 1 && row.children.length === 1) {
    const singleImageTile = imageTiles[0];
    singleImageTile.classList.remove('col-sm-4', 'col-md-6', 'col-xl-6');
    singleImageTile.classList.add('w-100');
  }

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