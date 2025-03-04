import ImageComponent from '../../shared-components/ImageComponent.js';

function getImageHTMl(image) {
  const imageLink = image.querySelector('a[href]');
  if (imageLink) {
    const imageContainer = document.createElement('div');
    imageContainer.setAttribute('data-aue-prop', 'image');
    imageContainer.setAttribute('data-aue-label', 'Image');
    imageContainer.setAttribute('data-aue-type', 'image');

    const imageUrl = imageLink.getAttribute('href');
    const imageAlt = imageLink.title || 'History Image';

    const imageHtml = ImageComponent({
      src: imageUrl,
      alt: imageAlt,
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
    return imageContainer.outerHTML;
  }
  return '';
}

export default function decorate(block) {
  // first element is year, second element is year description and the rest are milestones
  const [year, yearText, ...milestones] = block.children;

  // Handle card image

  const content = `<div class= "historymilestones-container" >
        <div class="historymilestones-year">
            <div>${year.outerHTML}</div>
            <div>${yearText.outerHTML}</div>
        </div>
        <div class="historymilestones-milestones">
              ${milestones
    .map((milestone) => {
      const [image, date, description] = milestone.children;
      milestone.innerHTML = `<div class="historymilestones-milestone">
                      <div class="historymilestones-image">${getImageHTMl(image)}</div>
                      <div class="historymilestones-date">${date.outerHTML}</div>
                      <div class="historymilestones-description">${description.outerHTML}</div>
                  </div>`;
      return milestone.outerHTML;
    })
    .join('')}
        </div>
    </div>`;

  console.log(content);
  block.innerHTML = content;
}