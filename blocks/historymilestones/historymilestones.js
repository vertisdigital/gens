import ImageComponent from '../../shared-components/ImageComponent.js';

function getImageHTMl(image) {
  const imageLink = image.querySelector('a[href]');
  if (imageLink) {
    const imageContainer = document.createElement('div');

    const imageUrl = imageLink.getAttribute('href');
    const imageAlt = imageLink.title || 'History Image';

    const imageHtml = ImageComponent({
      src: imageUrl,
      alt: imageAlt,
      className: 'history-milestone-image',
      asImageName: 'historymilestone.webp',
      breakpoints: {
        mobile: {
          width: 768,
          src: `${imageUrl}`,
          imgHeight: 206,
          imgWidth: 361,
        },
        tablet: {
          width: 993,
          src: `${imageUrl}`,
          imgHeight: 206,
          imgWidth: 361,
        },
        desktop: {
          width: 1920,
          src: `${imageUrl}`,
          imgHeight: 206,
          imgWidth: 361,
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
      const [image, date, description, link, target] = milestone.children;
      let learnMoreDiv = null;
      if(link?.querySelector('a')) {
        const url = link.querySelector('a')?.href;
        const title = link.querySelector('a')?.textContent;
        const linkTarget = target?.textContent?.trim() || '_self';
        
        learnMoreDiv=document.createElement('div');
        learnMoreDiv.classList.add('learn-more');
        learnMoreDiv.innerHTML=`
        <a class="global-learn-more" href=${url} target=${linkTarget}>${title}</a>
        `;
      }

      milestone.innerHTML = `<div class="historymilestones-milestone">
                      <div class="historymilestones-image">${getImageHTMl(image)}</div>
                      <div class="historymilestones-date">${date.outerHTML}</div>
                      <div class="historymilestones-description">${description.outerHTML}</div>
                      ${learnMoreDiv ? learnMoreDiv.outerHTML : ''}
                  </div>`;
      return milestone.outerHTML;
    })
    .join('')}
        </div>
    </div>`;
  block.innerHTML = content;
}