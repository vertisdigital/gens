import ImageComponent from '../../shared-components/ImageComponent.js';
import stringToHtml from '../../shared-components/Utility.js';
import SvgIcon from '../../shared-components/SvgIcon.js';

export default function decorate(block) {
  // Add container classes from styles.css
  block.classList.add('container-xl', 'container-md', 'container-sm');

  // Process list items
  const listItems = block.querySelectorAll('[data-aue-model="listitem"]');
  console.log(block);
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
    contentWrapper.classList.add('col-xl-8', 'col-md-4', 'col-sm-4');

    // Get all content elements
    const title = item.querySelector('[data-aue-type="text"]');
    const description = item.querySelector('[data-richtext-prop="description"]');
    console.log(item);
    const arrowIcon = item.querySelector('div:last-child a');

    // Add content elements to wrapper
    if (title) {
      contentWrapper.appendChild(title);
    }
    if (description) {
      contentWrapper.appendChild(description);
    }
    if (arrowIcon) {
      // const picture = document.createElement('picture');
      const newArrowLink = document.createElement('a');
      const arrowLink = arrowIcon.href;
      newArrowLink.href = arrowLink;

      const arrowSVG = SvgIcon({ name: 'arrow', className: 'arrow-link', size: '24px' });
      const parsedArrowSVG = stringToHtml(arrowSVG);
      newArrowLink.appendChild(parsedArrowSVG);
      contentWrapper.appendChild(newArrowLink);
    }

    // Add content wrapper to row
    row.appendChild(contentWrapper);

    // Replace item content with new row
    item.innerHTML = '';
    item.appendChild(row);

    // Add accessibility attributes
    item.setAttribute('role', 'listitem');
    item.setAttribute('tabindex', '0');
  });

  // Process CTA section
  const ctaContainer = block.querySelector('[data-aue-model="linkField"]');
  const ctaText = ctaContainer.querySelector('[data-aue-prop="linkTarget"]');
  ctaText.innerHTML = '';
}
