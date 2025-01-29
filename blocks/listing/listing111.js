import ImageComponent from '../../shared-components/ImageComponent.js';

export default function decorate(block) {
  // Add container classes from styles.css
  block.classList.add('container-xl', 'container-md', 'container-sm');

  // Process list items
  const listItems = block.querySelectorAll('[data-aue-model="listitem"]');
  listItems.forEach((item) => {
    // Create row from styles.css
    const row = document.createElement('div');
    row.classList.add('row');

    // Process image
    const imgContainer = item.querySelector('div:first-child');
    if (imgContainer) {
      imgContainer.classList.add('col-xl-4', 'col-md-2', 'col-sm-4');

      const link = imgContainer.querySelector('a');
      if (link) {
        const picture = document.createElement('picture');
        const img = document.createElement('img');
        img.src = link.href;
        img.alt = '';
        picture.appendChild(img);

        ImageComponent({
          element: img,
          src: link.href,
          alt: '',
          lazy: true,
        });

        link.innerHTML = '';
        link.appendChild(picture);
      }
      row.appendChild(imgContainer);
    }

    // Create single wrapper for content
    const contentWrapper = document.createElement('div');
    contentWrapper.classList.add('col-xl-8', 'col-md-6', 'col-sm-4');

    // Get all content elements
    const title = item.querySelector('[data-aue-type="text"]');
    const description = item.querySelector('[data-aue-prop="description"]');
    const arrowIcon = item.querySelector('[data-aue-prop="arrowIcon"]');
    const ctaButton = item.querySelector('[data-aue-prop="CTA"]');

    // Add content elements to wrapper
    if (title) {
      contentWrapper.appendChild(title);
    }
    if (description) {
      contentWrapper.appendChild(description);
    }
    if (arrowIcon) {
      const picture = document.createElement('picture');
      const img = document.createElement('img');
      img.src = arrowIcon.src;
      img.alt = '';
      img.setAttribute('data-aue-prop', 'arrowIcon');
      img.setAttribute('data-aue-label', 'Arrow Icon');

      ImageComponent({
        element: img,
        src: arrowIcon.src,
        alt: '',
        lazy: false,
      });

      picture.appendChild(img);
      contentWrapper.appendChild(picture);
    }

    // Add content wrapper to row
    row.appendChild(contentWrapper);

    // Replace item content with new row
    item.innerHTML = '';
    item.appendChild(row);

    // Make item clickable if CTA exists
    if (ctaButton) {
      const link = ctaButton.querySelector('a');
      if (link) {
        const href = link.getAttribute('href');
        item.addEventListener('click', () => {
          window.location.href = href;
        });
        item.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            window.location.href = href;
          }
        });
      }
    }

    // Add accessibility attributes
    item.setAttribute('role', 'listitem');
    item.setAttribute('tabindex', '0');
  });

  // Process CTA section
  const ctaContainer = block.querySelector('[data-aue-prop="ctaCaption"]');
  const ctaLink = block.querySelector('div:last-child a');
  if (ctaContainer && ctaLink) {
    const href = ctaLink.getAttribute('href');
    ctaContainer.addEventListener('click', () => {
      window.location.href = href;
    });
    ctaContainer.setAttribute('role', 'link');
    ctaContainer.setAttribute('tabindex', '0');
  }
}
