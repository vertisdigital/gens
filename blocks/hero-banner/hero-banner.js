import ImageComponent from '../../shared-components/ImageComponent.js';
import Heading from '../../shared-components/Heading.js';
import SvgIcon from '../../shared-components/SvgIcon.js';

export default function decorate(block) {
  let heroContainer = block.querySelector('.hero-banner-container');

  if (!heroContainer) {
    heroContainer = document.createElement('div');
    heroContainer.className = 'hero-banner-container';
  }

  const imageLink = block.querySelector('a[href]');
  if (imageLink) {
    const imageUrl = imageLink.getAttribute('href');
    const imageAlt = imageLink.getAttribute('title') || 'Hero Image';

    const imageHtml = ImageComponent({
      src: imageUrl,
      alt: imageAlt,
      className: 'hero-image',
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
      lazy: false,
    });

    heroContainer.insertAdjacentHTML('beforeend', imageHtml);
    imageLink.remove();
  }

  const titleElement = block.querySelector('[data-aue-prop="bannertitle"]');
  if (titleElement) {
    const titleText = titleElement.textContent;
    const headingHtml = Heading({ level: 1, text: titleText, className: 'hero-title' });
    heroContainer.insertAdjacentHTML('beforeend', headingHtml);
    titleElement.remove();
  }

  const descElement = block.querySelector('[data-aue-prop="bannerdescription"]');
  if (descElement) {
    const descriptionDiv = document.createElement('div');
    descriptionDiv.className = 'hero-description';
    descriptionDiv.textContent = descElement.textContent;
    heroContainer.appendChild(descriptionDiv);
    descElement.remove();
  }

  const arrowIconHtml = SvgIcon({
    name: 'arrow',
    className: 'hero-arrow-icon',
    size: '32',
    color: 'white',
  });
  heroContainer.insertAdjacentHTML('beforeend', arrowIconHtml);

  const carouselItems = block.querySelectorAll('[data-aue-model="bannercarousel"]');
  const carouselContainer = document.createElement('div');
  carouselContainer.className = 'hero-banner-carousal';
  const carouselWrapper = document.createElement('div');
  carouselWrapper.className = 'carousel-wrapper';

  // Loop through all carousel items
  carouselItems.forEach((item) => {
    const carouselItem = document.createElement('div');
    carouselItem.classList.add('carousel-item');

    const carouselItemContent = document.createElement('div');
    carouselItemContent.classList.add('carousel-content');
    const newsLatterImage = document.createElement('div');
    newsLatterImage.classList.add('carousel-image');
    const newsLinkDiv = document.createElement('div');
    newsLinkDiv.classList.add('news-link-container');
    const newsLinkArrowDiv = document.createElement('div');
    newsLinkArrowDiv.classList.add('news-link-arrow-container');

    carouselItem.appendChild(carouselItemContent);
    carouselItem.appendChild(newsLatterImage);

    // Extract and append the title
    const carouselTitleElement = item.querySelector('[data-aue-prop="title"]');
    if (carouselTitleElement) {
      const titleText = carouselTitleElement.textContent;
      const titleHtml = `<p class="news-title">${titleText}</p>`;
      carouselItemContent.insertAdjacentHTML('beforeend', titleHtml);
      carouselTitleElement.remove();
    }

    // Extract and append the description
    const descriptionElement = item.querySelector('[data-aue-prop="description"]');
    if (descriptionElement) {
      const descriptionText = descriptionElement.textContent;
      const descriptionHtml = `<p class="news-description">${descriptionText}</p>`;
      carouselItemContent.insertAdjacentHTML('beforeend', descriptionHtml);
      descriptionElement.remove();
    }

    // Extract and append the "Read More" label
    const readMoreLabelElement = item.querySelector('[data-aue-prop="readmorelabel"]');
    if (readMoreLabelElement) {
      const readMoreLabelText = readMoreLabelElement.textContent;
      const readMoreLabelHtml = `<p class="news-link">${readMoreLabelText}</p>`;
      newsLinkDiv.insertAdjacentHTML('beforeend', readMoreLabelHtml);
      readMoreLabelElement.remove();
    }

    // Extract the two SVG icons and append them using ImageComponent
    const firstIconLink = block.querySelector('a[href="material-symbols_chevron-left%20(1).svg"]');
    const secondIconLink = block.querySelector('a[href="material-symbols_chevron-left.svg"]');

    if (firstIconLink && secondIconLink) {
    // Use ImageComponent to load the first SVG icon
      const firstIconHtml = ImageComponent({
        src: firstIconLink.getAttribute('href'),
        alt: 'Chevron Left (1) Icon',
        className: 'first-svg-icon', // You can customize the class name if needed
        breakpoints: {
          mobile: { width: 768, src: firstIconLink.getAttribute('href') },
          tablet: { width: 1024, src: firstIconLink.getAttribute('href') },
          desktop: { width: 1920, src: firstIconLink.getAttribute('href') },
        },
        lazy: false,
      });

      // Use ImageComponent to load the second SVG icon
      const secondIconHtml = ImageComponent({
        src: secondIconLink.getAttribute('href'),
        alt: 'Chevron Left Icon',
        className: 'second-svg-icon', // You can customize the class name if needed
        breakpoints: {
          mobile: { width: 768, src: secondIconLink.getAttribute('href') },
          tablet: { width: 1024, src: secondIconLink.getAttribute('href') },
          desktop: { width: 1920, src: secondIconLink.getAttribute('href') },
        },
        lazy: false,
      });

      // Append the icons to the newsLinkArrowDiv
      newsLinkArrowDiv.insertAdjacentHTML('beforeend', firstIconHtml);
      newsLinkArrowDiv.insertAdjacentHTML('beforeend', secondIconHtml);

      newsLinkDiv.appendChild(newsLinkArrowDiv);
    }

    // Append the icon to the carousel item
    carouselItemContent.appendChild(newsLinkDiv);

    // Add the image to the carousel
    const firstDiv = item.querySelector('div');
    if (firstDiv) {
      const pTag = firstDiv.querySelector('p');
      if (pTag) {
        const aTag = pTag.querySelector('a');
        if (aTag) {
          const imgUrl = aTag.getAttribute('href');
          const imgAlt = aTag.getAttribute('title') || 'Thumbnail';

          const imgHtml = ImageComponent({
            src: imgUrl,
            alt: imgAlt,
            className: 'news-thumbnail',
            breakpoints: {
              mobile: {
                width: 768,
                src: `${imgUrl}`,
              },
              tablet: {
                width: 1024,
                src: `${imgUrl}`,
              },
              desktop: {
                width: 1920,
                src: `${imgUrl}`,
              },
            },
            lazy: false,
          });

          newsLatterImage.insertAdjacentHTML('beforeend', imgHtml);
          aTag.remove();
        }
      }
    }

    carouselWrapper.appendChild(carouselItem);
  });

  carouselContainer.appendChild(carouselWrapper);
  heroContainer.appendChild(carouselContainer);

  const carouselItemsEl = heroContainer.querySelectorAll('.carousel-item');
  const itemWidth = carouselItemsEl[0].offsetWidth;

  let currentIndex = 0;

  function moveCarousel() {
    currentIndex += 1;

    if (currentIndex >= carouselItemsEl.length) {
      currentIndex = 0;
    }

    const newTransform = -currentIndex * itemWidth;

    carouselWrapper.style.transition = 'transform 0.3s ease';
    carouselWrapper.style.transform = `translateX(${newTransform}px)`;

    if (currentIndex === carouselItemsEl.length - 1) {
      setTimeout(() => {
        carouselWrapper.style.transition = 'none';
        carouselWrapper.style.transform = 'translateX(0)';
      }, 3000);
    }
  }

  if (carouselItemsEl.length > 0) {
    setInterval(moveCarousel, 3000);
  }

  carouselItems.forEach((item) => {
    item.remove();
  });

  block.textContent = '';
  block.appendChild(heroContainer);
}
