import SvgIcon from '../../shared-components/SvgIcon.js';
import stringToHTML from '../../shared-components/Utility.js';

/**
 * Decorates the tiles block
 * @param {Element} block The tiles block element
 */
/**
 * Opens a modal with the provided data
 * @param {Object} data Modal data
 */
function openModal(data) {
  // Create modal elements
  const overlay = document.createElement('div');
  overlay.className = 'tiles-modal-overlay';
  overlay.style.zIndex = '1000000'; // Ensure it's on top

  const content = document.createElement('div');
  content.className = 'tiles-modal-content';

  const closeBtn = document.createElement('span');
  closeBtn.className = 'tiles-modal-close';
  const closeIcon = SvgIcon({
    name: 'close',
    className: 'close-icon',
    size: '24',
    color: '#000',
  });
  closeBtn.innerHTML = stringToHTML(closeIcon).outerHTML;

  closeBtn.onclick = () => {
    document.body.removeChild(overlay);
    document.body.style.overflow = '';
  };

  const body = document.createElement('div');
  body.className = 'tiles-modal-body';

  // Modal Content Structure
  if (data.image) {
    const imgContainer = document.createElement('div');
    imgContainer.className = 'modal-image-container';
    const img = document.createElement('img');
    img.src = data.image;
    imgContainer.appendChild(img);
    body.appendChild(imgContainer);
  }

  const textContainer = document.createElement('div');
  textContainer.className = 'modal-text-container';

  if (data.title) {
    const title = document.createElement('h3');
    title.className = 'modal-title';
    title.textContent = data.title;
    textContainer.appendChild(title);
  }

  if (data.description) {
    const desc = document.createElement('div');
    desc.className = 'modal-description';
    desc.innerHTML = data.description;
    textContainer.appendChild(desc);
  }

  if (data.filepath) {
    const link = document.createElement('a');
    link.href = data.filepath;
    link.setAttribute('download', '');
    link.className = 'modal-download-link';

    link.addEventListener('click', async (e) => {
      e.preventDefault();
      try {
        const response = await fetch(data.filepath);
        if (!response.ok) throw new Error('Network response was not ok');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        const filename = data.filepath.split('/').pop().split('?')[0] || 'download';
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error downloading image:', error);
        window.location.href = data.filepath;
      }
    });

    // Create text span
    const textSpan = document.createElement('span');
    textSpan.textContent = 'Download';
    link.appendChild(textSpan);

    // Add download icon
    const downloadIcon = SvgIcon({
      name: 'downloadGold',
      className: 'download-icon',
      size: '24',
      color: '#8D713E',
    });

    if (downloadIcon) {
      link.appendChild(stringToHTML(downloadIcon));
    }

    textContainer.appendChild(link);
  }

  body.appendChild(textContainer);

  content.appendChild(closeBtn);
  content.appendChild(body);
  overlay.appendChild(content);

  // Close modal when clicking outside content
  overlay.onclick = (e) => {
    if (e.target === overlay) {
      document.body.removeChild(overlay);
      document.body.style.overflow = '';
    }
  };

  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';
}

export default function decorate(block) {
  block.classList.add('fade-item');

  // Create row wrapper
  const row = document.createElement('div');
  row.className = 'row tiles-container ';

  // Move existing tiles into grid columns
  const tiles = Array.from(block.children);
  const firstTile = tiles[0];
  const isFirsTileImage = tiles[0] && tiles[0].children[3].textContent === 'false';

  const isOpenAsModal = block.classList.contains('open-as-modal');
  if (isOpenAsModal) {
    block.classList.add('container');
  }

  tiles.forEach((tile, index) => {
    let enablegradient = false;

    let gradientEl = tile.querySelector('[data-aue-prop="enablegradient"], [data-gen-prop="enablegradient"]');

    if (!gradientEl) {
      gradientEl = tile.lastElementChild;
    }
    if (gradientEl) {
      const gradientP = gradientEl.querySelector('p') || gradientEl;
      enablegradient = gradientP?.textContent?.trim()?.toLowerCase() === 'true';
      if (gradientEl.parentNode === tile) {
        gradientEl.remove();
      }
    }

    // Handle first tile's download button
    const col = document.createElement('div');
    col.className = 'col-sm-4 col-md-6 col-xl-6';
    col.appendChild(tile);
    row.appendChild(col);

    // Data storage for modal
    let modalData = {};

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
        const gradientStr = enablegradient ? 'linear-gradient(180deg, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0.35) 25%, rgba(0, 0, 0, 0) 70%, rgba(0, 0, 0, 0.15) 80%, rgba(0, 0, 0, 0.6) 100%), ' : '';
        const gradientStrMobile = enablegradient ? 'linear-gradient(180deg, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0.35) 25%, rgba(0, 0, 0, 0) 70%, rgba(0, 0, 0, 0.15) 80%, rgba(0, 0, 0, 0.6) 100%), ' : '';
        const gradientStrTablet = enablegradient ? 'linear-gradient(180deg, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0.35) 25%, rgba(0, 0, 0, 0) 70%, rgba(0, 0, 0, 0.15) 80%, rgba(0, 0, 0, 0.6) 100%), ' : '';

        // Set desktop background image
        const desktopImageUrl = `${imageLink.href}/as/tiles.webp?width=850`;
        tile.style.setProperty('--bg-image-desktop', `${gradientStr}url(${desktopImageUrl})`);

        // Store image for modal
        modalData.image = imageLink.href;

        // Set tablet background image if available
        if (tabletImageLink) {
          const tabletImageUrl = `${tabletImageLink}/as/tiles.webp?width=850`;
          tile.style.setProperty('--bg-image-tablet', `${gradientStrTablet}url(${tabletImageUrl})`);
        } else {
          // Fallback to desktop image if tablet image not available
          tile.style.setProperty('--bg-image-tablet', `${gradientStrTablet}url(${desktopImageUrl})`);
        }

        // Set mobile background image if available
        if (mobileImageLink) {
          const mobileImageUrl = `${mobileImageLink}/as/tiles.webp?width=850`;
          tile.style.setProperty('--bg-image-mobile', `${gradientStrMobile}url(${mobileImageUrl})`);
        } else {
          // Fallback to tablet or desktop image if mobile image not available
          const fallbackImageUrl = tabletImageLink ? `${tabletImageLink}/as/tiles.webp?width=850` : desktopImageUrl;
          tile.style.setProperty('--bg-image-mobile', `${gradientStrMobile}url(${fallbackImageUrl})`);
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

      // Capture modal data before manipulation
      if (isOpenAsModal) {
        // Title is usually in the first p of the first div (after image removal)
        // Structure: <div><p>Title</p></div><div><p>Desc</p></div>
        // childrens[0] -> first div
        // childrens[1] -> second div
        if (childrens[0]) {
          const p = childrens[0].querySelector('p');
          if (p) modalData.title = p.textContent;
        }
        if (childrens[1]) {
          const p = childrens[1].querySelector('p');
          if (p) modalData.description = p.innerHTML;
        }
        if (modalData.image) {
          modalData.filepath = modalData.image;
        }

        // Store data on tile
        tile.dataset.modalById = JSON.stringify(modalData);
        tile.style.cursor = 'pointer';

        // Hide content divs
        Array.from(childrens).forEach(child => {
          child.style.display = 'none';
        });
      }


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
          if (descriptionParagraph.innerHTML.length < 100) {
            descriptionParagraph.classList.add('w-50');
          }
          if (!buttonContainer) {
            descriptionParagraph.classList.add('no-margin');
          }
        }
      }



      const ctaCaption = childrens[6];
      if (!isOpenAsModal && buttonContainer && buttonContainer.textContent.trim() !== '' && ctaCaption !== null) {
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

      if (!isOpenAsModal && buttonContainer && buttonContainer.textContent.trim() !== '' && ctaCaption !== null) {
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

  // Handle open-as-modal functionality
  if (isOpenAsModal) {

    // Note: .tiles-nested-image is the tile class based on earlier logic
    // But we need the element that has dataset.

    // Since tiles were appended to col, and col to row.
    // We can query selector on block/row

    const clickableTiles = block.querySelectorAll('.tiles-nested-image');
    clickableTiles.forEach(tile => {
      tile.addEventListener('click', (e) => {
        e.preventDefault();
        if (tile.dataset.modalById) {
          const data = JSON.parse(tile.dataset.modalById);
          openModal(data);
        }
      });
    });
  }
}