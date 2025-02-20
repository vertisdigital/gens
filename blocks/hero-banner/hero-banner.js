import ImageComponent from '../../shared-components/ImageComponent.js';
import Heading from '../../shared-components/Heading.js';
import SvgIcon from '../../shared-components/SvgIcon.js';
import stringToHTML from '../../shared-components/Utility.js';

export default function decorate(block) {
  let heroContainer = block.querySelector('.hero-banner-container');

  if (!heroContainer) {
    heroContainer = document.createElement('div');
    heroContainer.className = 'hero-banner-container';
    // heroContainer.classList.add('hero-banner-container','columns-container',
    // 'container-xl', 'container-md', 'container-sm');
    // heroContainer.setAttribute('data-aue-resource', 'herobanner');
    // heroContainer.setAttribute('data-aue-type', 'block');
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

    const imageContainer = document.createElement('div');
    imageContainer.setAttribute('data-aue-model', 'bannerimage');
    imageContainer.setAttribute('data-aue-label', 'Banner Image');
    imageContainer.insertAdjacentHTML('beforeend', imageHtml);
    heroContainer.appendChild(imageContainer);
    imageLink.remove();
  }

  const heroContent = document.createElement('div');
  heroContent.classList.add('hero-content', 'columns-container', 'container-xl', 'container-md', 'container-sm');

  const headingElement = block.querySelector('[data-aue-prop="bannerheading"]');
  if (headingElement) {
    const headingText = headingElement.textContent;
    const headingContainer = document.createElement('div');
    headingContainer.setAttribute('data-aue-model', 'bannerheading');
    headingContainer.setAttribute('data-aue-label', 'Banner Heading');
    headingContainer.setAttribute(
      'data-aue-prop',
      headingElement.getAttribute('data-aue-prop'),
    );
    headingContainer.setAttribute('data-aue-type', 'text');
    const headingHtml = Heading({
      level: 5,
      text: headingText,
      className: 'hero-heading',
    });
    headingContainer.insertAdjacentHTML('beforeend', headingHtml);
    heroContent.append(headingContainer);
    headingElement.remove();
  }

  const titleElement = block.querySelector('[data-aue-prop="bannertitle"]');
  if (titleElement) {
    const titleText = titleElement.textContent;
    const titleContainer = document.createElement('div');
    titleContainer.setAttribute('data-aue-model', 'bannertitle');
    titleContainer.setAttribute('data-aue-label', 'Banner Title');
    titleContainer.setAttribute(
      'data-aue-prop',
      titleElement.getAttribute('data-aue-prop'),
    );
    titleContainer.setAttribute('data-aue-type', 'text');
    const headingHtml = Heading({
      level: 2,
      text: titleText,
      className: 'hero-title',
    });
    titleContainer.insertAdjacentHTML('beforeend', headingHtml);
    heroContent.append(titleContainer);
    titleElement.remove();
  }

  const descElement = block.querySelector(
    '[data-aue-prop="bannerdescription"]',
  );
  if (descElement) {
    const descriptionDiv = document.createElement('div');
    descriptionDiv.className = 'hero-description';
    descriptionDiv.setAttribute('data-aue-model', 'bannerdescription');
    descriptionDiv.setAttribute('data-aue-label', 'Banner Description');
    descriptionDiv.setAttribute(
      'data-aue-prop',
      descElement.getAttribute('data-aue-prop'),
    );
    descriptionDiv.setAttribute('data-aue-type', 'text');
    descriptionDiv.textContent = descElement.textContent;
    heroContent.appendChild(descriptionDiv);
    descElement.remove();
  }

  const arrowIconLink = block.querySelector('[data-aue-prop="ctabuttonText"]');
  if (arrowIconLink) {
    const arrowIconHtml = SvgIcon({
      name: 'arrow',
      className: 'hero-arrow-icon',
      size: '24',
      color: '#B29152',
    });
    const parsedHtml = stringToHTML(arrowIconHtml);
    const anchorWrapper = document.createElement('a');
    anchorWrapper.href = arrowIconLink.textContent;
    anchorWrapper.appendChild(parsedHtml);
    heroContent.appendChild(anchorWrapper);
  }
  heroContainer.appendChild(heroContent);
  const carouselItems = block.querySelectorAll(
    '[data-aue-model="bannercarousel"]',
  );
  const carouselContainer = document.createElement('div');
  carouselContainer.className = 'hero-banner-carousal';
  carouselContainer.setAttribute('data-aue-model', 'bannercarousel');
  carouselContainer.setAttribute('data-aue-label', 'Banner Carousel');

  const carouselWrapper = document.createElement('div');
  carouselWrapper.className = 'carousel-wrapper';
  carouselWrapper.setAttribute('data-aue-type', 'container');

  let currentIndex = 0;

  // arrow navigations
  const leftArrow = SvgIcon({
    name: 'leftarrow',
    className: 'arrow-link',
    size: '12',
  });
  const rightArrow = SvgIcon({
    name: 'rightarrow',
    className: 'arrow-link',
    size: '12',
  });
  const leftArrowDisabled = SvgIcon({
    name: 'leftarrowdisabled',
    className: 'arrow-link',
    size: '12',
  });
  const rightArrowDisabled = SvgIcon({
    name: 'rightarrowdisabled',
    className: 'arrow-link',
    size: '12',
  });
  const ellipse = SvgIcon({
    name: 'ellipse',
    className: 'ellipse ellipse-disabled',
    size: '6',
  });

  const scrollIntervalDiv = block.querySelector(
    '[data-aue-prop="scrollInterval"]',
  );

  let scrollInterval = 3000;
  if (scrollIntervalDiv) {
    scrollInterval = parseInt(scrollIntervalDiv.textContent, 10) * 1000;
  }

  const navigations = document.createElement('div');
  const leftIcon = document.createElement('div');
  const rightIcon = document.createElement('div');

  function updateNavigation() {
    const ellipses = navigations.querySelectorAll('.ellipse');

    ellipses.forEach((elem, index) => {
      if (index === currentIndex) {
        elem.classList.add('ellipse-enabled');
        elem.classList.remove('ellipse-disabled');
      } else {
        elem.classList.add('ellipse-disabled');
        elem.classList.remove('ellipse-enabled');
      }
    });
  }

  function moveCarousel(moveForward, manual) {
    if (carouselItems.length > 1) {
      if (currentIndex === carouselItems.length - 1 && moveForward && manual) {
        return;
      }
      if (moveForward) currentIndex += 1;
      else if (currentIndex > 0) currentIndex -= 1;
      else return;

      const carouselItemsEl = heroContainer.querySelector('.carousel-item');
      const itemWidth = carouselItemsEl?.offsetWidth;
      if (currentIndex >= carouselItems.length) {
        currentIndex = 0;
      }
      if (currentIndex === carouselItems.length - 1) {
        rightIcon.innerHTML = '';
        rightIcon.appendChild(stringToHTML(rightArrowDisabled));
      } else if (currentIndex === 0) {
        leftIcon.innerHTML = '';
        leftIcon.appendChild(stringToHTML(leftArrowDisabled));
        rightIcon.innerHTML = '';
        rightIcon.appendChild(stringToHTML(rightArrow));
      } else {
        leftIcon.innerHTML = '';
        leftIcon.appendChild(stringToHTML(leftArrow));
        rightIcon.innerHTML = '';
        rightIcon.appendChild(stringToHTML(rightArrow));
      }

      const newTransform = -currentIndex * itemWidth;
      updateNavigation();
      carouselWrapper.style.transition = 'transform 0.3s ease';
      carouselWrapper.style.transform = `translateX(${newTransform}px)`;
    }
  }

  // Loop through all carousel items
  carouselItems.forEach((item) => {
    const carouselItem = document.createElement('div');
    carouselItem.classList.add('carousel-item');
    carouselItem.setAttribute('data-aue-model', 'bannercarousel');
    carouselItem.setAttribute(
      'data-aue-resource',
      item.getAttribute('data-aue-resource'),
    );
    carouselItem.setAttribute('data-aue-label', 'Banner Carousel');
    carouselItem.setAttribute('data-aue-type', 'component');

    const carouselItemContent = document.createElement('div');
    carouselItemContent.classList.add('carousel-content');
    carouselItemContent.setAttribute('data-aue-type', 'content');
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
      const titleContainer = document.createElement('div');
      titleContainer.setAttribute('data-aue-label', 'Title');
      titleContainer.setAttribute(
        'data-aue-prop',
        carouselTitleElement.getAttribute('data-aue-prop'),
      );
      titleContainer.setAttribute('data-aue-type', 'text');
      titleContainer.insertAdjacentHTML('beforeend', titleHtml);
      carouselItemContent.appendChild(titleContainer);
      carouselTitleElement.remove();
    }

    // Extract and append the description
    const descriptionElement = item.querySelector(
      '[data-aue-prop="description"]',
    );
    if (descriptionElement) {
      const descriptionText = descriptionElement.textContent;
      const descriptionHtml = `<p class="news-description">${descriptionText}</p>`;
      const descContainer = document.createElement('div');
      descContainer.setAttribute('data-aue-label', 'Description');
      descContainer.setAttribute(
        'data-aue-prop',
        descriptionElement.getAttribute('data-aue-prop'),
      );
      descContainer.setAttribute('data-aue-type', 'text');
      descContainer.insertAdjacentHTML('beforeend', descriptionHtml);
      carouselItemContent.appendChild(descContainer);
      descriptionElement.remove();
    }

    // Extract and append the "Read More" label
    const readMoreLabelElement = item.querySelector(
      '[data-aue-prop="readmorelabel"]',
    );
    if (readMoreLabelElement) {
      const readMoreLabelText = readMoreLabelElement.textContent;
      const buttonContainer = readMoreLabelElement.parentElement.nextElementSibling.querySelector('.button-container a');
      const href = buttonContainer ? buttonContainer.getAttribute('href') : '';
      const currentUrl = window.location.href;
      const newUrl = currentUrl.replace(window.location.pathname, href);
      const readMoreLabelHtml = `<a class="news-link" href="${newUrl}" target="_blank">${readMoreLabelText}</a>`;
      const readMoreContainer = document.createElement('div');
      readMoreContainer.setAttribute('data-aue-model', 'readmorelabel');
      readMoreContainer.setAttribute('data-aue-label', 'Read More Label');
      readMoreContainer.setAttribute(
        'data-aue-prop',
        readMoreLabelElement.getAttribute('data-aue-prop'),
      );
      readMoreContainer.setAttribute('data-aue-type', 'text');
      readMoreContainer.insertAdjacentHTML('beforeend', readMoreLabelHtml);
      newsLinkDiv.appendChild(readMoreContainer);
      readMoreLabelElement.remove();
    }

    // Extract the two SVG icons and append them using ImageComponent
    const firstIconLink = block.querySelector(
      'a[href="material-symbols_chevron-left%20(1).svg"]',
    );
    const secondIconLink = block.querySelector(
      'a[href="material-symbols_chevron-left.svg"]',
    );

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
          // const imgUrl = aTag.getAttribute('href');
          const imgUrl = 'https://cdn.builder.io/api/v1/image/assets/TEMP/3818aa4f34615b927264d6d8cab07f1e20d364cf0b7277c747dd56359fc99bce?placeholderIfAbsent=true&apiKey=16b1633103d8450ead7bc93647340540';
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
          newsLatterImage.setAttribute('data-aue-type', 'image');
          newsLatterImage.setAttribute('data-aue-prop', 'image');
          newsLatterImage.setAttribute('data-aue-label', 'News Image');
          aTag.remove();
        }
      }
    }
    carouselWrapper.appendChild(carouselItem);
  });

  navigations.classList.add('navigation-arrows');

  leftIcon.classList.add('left-carousel-arrow');
  rightIcon.classList.add('right-carousel-arrow');

  navigations.appendChild(leftIcon);
  for (let i = 0; i < carouselItems.length; i += 1) {
    const ellipseEl = stringToHTML(ellipse);
    if (i === 0) {
      ellipseEl.classList.remove('ellipse-disabled');
      ellipseEl.classList.add('ellipse-enabled');
    }
    navigations.appendChild(ellipseEl);
  }
  navigations.appendChild(rightIcon);

  leftIcon.appendChild(stringToHTML(leftArrowDisabled));
  if (carouselItems.length === 1) {
    rightIcon.appendChild(stringToHTML(rightArrowDisabled));
  } else {
    rightIcon.appendChild(stringToHTML(rightArrow));
  }

  leftIcon.addEventListener('click', () => {
    moveCarousel(false, true);
  });
  rightIcon.addEventListener('click', () => {
    moveCarousel(true, true);
  });

  carouselContainer.appendChild(carouselWrapper);
  if (carouselItems.length) {
    heroContainer.appendChild(carouselContainer);
    if (carouselItems.length > 1) {
      heroContainer.appendChild(navigations);
    }
  }

  const carouselItemsAll = heroContainer.querySelectorAll('.carousel-item');

  if (carouselItemsAll.length > 0) {
    setInterval(() => {
      moveCarousel(true, false);
    }, scrollInterval);
  }

  carouselItems.forEach((item) => {
    item.remove();
  });

  block.textContent = '';
  block.appendChild(heroContainer);
}
