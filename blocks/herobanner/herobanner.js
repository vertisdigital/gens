import ImageComponent from '../../shared-components/ImageComponent.js';
import Heading from '../../shared-components/Heading.js';
import SvgIcon from '../../shared-components/SvgIcon.js';
import stringToHTML from '../../shared-components/Utility.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function decorateCTAWithCircle(linkEl, options = {}) {
  if (!linkEl || linkEl.dataset.decorated === 'true') return;
  linkEl.dataset.decorated = 'true';

  const {
    before = true,
    after = true,
  } = options;

  const text = linkEl.textContent.trim();
  linkEl.textContent = '';

  if (before) {
    linkEl.appendChild(
      stringToHTML(
        SvgIcon({
          name: 'circlecta',
          className: 'cta-circle-icon before',
          size: '16',
        }),
      ),
    );
  }

  const textSpan = document.createElement('span');
  textSpan.className = 'cta-text';
  textSpan.textContent = text;
  linkEl.appendChild(textSpan);

  if (after) {
    linkEl.appendChild(
      stringToHTML(
        SvgIcon({
          name: 'circlecta',
          className: 'cta-circle-icon after',
          size: '16',
        }),
      ),
    );
  }
}

export default function decorate(block) {
  let heroContainer = block.querySelector('.hero-banner-container');

  if (!heroContainer) {
    heroContainer = document.createElement('div');
    heroContainer.className = 'hero-banner-container';
  }

  // Try multiple selectors to find gradient toggle in both authoring and publishing mode
  const gradientEl = block.querySelector('[data-aue-prop="enablegradient"], [data-gen-prop="enablegradient"]')
    || block.querySelector('.herobanner-nested-1-10 p')
    || block.querySelector('.herobanner-nested-1-10');

  // Get text from p tag if it exists, otherwise from the element itself
  const gradientP = gradientEl?.querySelector('p') || gradientEl;
  const gradientValue = gradientP?.textContent?.trim();
  const enablegradient = !gradientEl || gradientValue !== 'false';
  heroContainer.classList.add(enablegradient ? 'hero-banner-has-gradient' : 'hero-banner-no-gradient');

  // Only remove if it's not the block itself
  if (gradientEl && (
    gradientEl.parentNode === block
    || gradientEl.parentNode?.parentNode === block
  )) {
    gradientEl.remove();
  }

  const imageLink = block.querySelector('.herobanner-nested-1-1 a[href]');
  if (imageLink) {
    const imageUrl = imageLink.getAttribute('href');
    const imageAlt = imageLink.getAttribute('title') || 'Hero Image';
    const imageHtml = ImageComponent({
      src: imageUrl,
      alt: imageAlt,
      className: 'hero-image',
      asImageName: 'hero.webp',
      breakpoints: {
        mobile: {
          src: `${imageUrl}`,
          smartCrop: 'Small'
        },
        tablet: {
          src: `${imageUrl}`,
          smartCrop: 'Medium'
        },
        desktop: {
          src: `${imageUrl}`,
          smartCrop: 'Desktop'
        },
      },
      lazy: false,
    });

    const imageContainer = document.createElement('div');
    // Copy data attributes from parent element if they exist
    imageContainer.setAttribute('data-aue-model', 'bannerimage');
    imageContainer.setAttribute('data-aue-label', 'Banner Image');
    imageContainer.insertAdjacentHTML('beforeend', imageHtml);
    heroContainer.appendChild(imageContainer);
    imageLink.remove();
  }

  const heroContent = document.createElement('div');
  heroContent.classList.add('hero-content', 'columns-container', 'container');

  // Read bold props
  const isHeadingBoldEl = block.querySelector('.herobanner-nested-1-11 p')
    || block.querySelector('.herobanner-nested-1-11')
    || block.querySelector('[data-aue-prop="isHeadingBold"]')
    || block.querySelector('[data-gen-prop="isHeadingBold"]');

  const isHeadingBold = isHeadingBoldEl?.textContent?.trim() === 'true';
  if (isHeadingBoldEl) isHeadingBoldEl.remove();

  const isTitleBoldEl = block.querySelector('.herobanner-nested-1-12 p')
    || block.querySelector('.herobanner-nested-1-12')
    || block.querySelector('[data-aue-prop="isTitleBold"]')
    || block.querySelector('[data-gen-prop="isTitleBold"]');

  const isTitleBold = isTitleBoldEl?.textContent?.trim() === 'true';
  if (isTitleBoldEl) isTitleBoldEl.remove();

  const isDescriptionBoldEl = block.querySelector('.herobanner-nested-1-13 p')
    || block.querySelector('.herobanner-nested-1-13')
    || block.querySelector('[data-aue-prop="isDescriptionBold"]')
    || block.querySelector('[data-gen-prop="isDescriptionBold"]');

  const isDescriptionBold = isDescriptionBoldEl?.textContent?.trim() === 'true';
  if (isDescriptionBoldEl) isDescriptionBoldEl.remove();

  const headingElement = block.querySelector('[data-aue-prop="bannerheading"], .herobanner-nested-1-2 p');
  if (headingElement && headingElement.textContent.trim()) {
    const headingText = headingElement.textContent;
    const headingContainer = document.createElement('div');
    // Copy data attributes from source element
    moveInstrumentation(headingContainer, headingElement);
    const headingHtml = Heading({
      level: 5,
      text: headingText,
      className: `hero-heading ${isHeadingBold ? 'text-bold' : ''}`,
    });
    headingContainer.insertAdjacentHTML('beforeend', headingHtml);
    heroContent.append(headingContainer);
    headingElement.remove();
  }

  const titleElement = block.querySelector('[data-aue-prop="bannertitle"], .herobanner-nested-1-3 p');
  if (titleElement && titleElement.textContent.trim()) {
    const titleText = titleElement.textContent;
    const titleContainer = document.createElement('div');
    // Copy data attributes from source element
    moveInstrumentation(titleElement, titleContainer);
    const headingHtml = Heading({
      level: 2,
      text: titleText,
      className: `hero-title ${isTitleBold ? 'text-bold' : ''}`,
    });
    titleContainer.insertAdjacentHTML('beforeend', headingHtml);
    heroContent.append(titleContainer);
    titleElement.remove();
  }

  const descElement = block.querySelector(
    '[data-aue-prop="bannerdescription"], .herobanner-nested-1-4 p',
  );
  if (descElement && descElement.textContent.trim()) {
    const descriptionDiv = document.createElement('div');
    descriptionDiv.className = `hero-description ${isDescriptionBold ? 'text-bold' : ''}`;
    // Copy data attributes from source element
    moveInstrumentation(descElement, descriptionDiv);
    descriptionDiv.textContent = descElement.textContent;
    heroContent.appendChild(descriptionDiv);
    descElement.remove();
  }

  const cta1El = block.querySelector('[data-aue-prop="ctabutton"], .herobanner-nested-1-5');
  const cta2El = block.querySelector('[data-aue-prop="ctabutton2"], .herobanner-nested-1-6');

  const hasCTA =
    (cta1El && cta1El.querySelector('a') && cta1El.querySelector('a').textContent.trim()) ||
    (cta2El && cta2El.querySelector('a') && cta2El.querySelector('a').textContent.trim());

  if (hasCTA) {
    let ctaWrapper = heroContainer.querySelector('.hero-cta-wrapper');
    if (!ctaWrapper) {
      ctaWrapper = document.createElement('div');
      ctaWrapper.className = 'hero-cta-wrapper';

      const ctaGroup = document.createElement('div');
      ctaGroup.className = 'hero-cta-group';

      ctaWrapper.appendChild(ctaGroup);
      heroContent.appendChild(ctaWrapper);
    }

    const ctaGroup = ctaWrapper.querySelector('.hero-cta-group');

    if (cta1El && cta1El.querySelector('a') && cta1El.querySelector('a').textContent.trim()) {
      cta1El.classList.add('hero-cta', 'primary');

      const link = cta1El.querySelector('a');


      decorateCTAWithCircle(link, { before: true, after: true });

      ctaGroup.appendChild(cta1El);
    }

    if (cta2El && cta2El.querySelector('a')) {
      cta2El.classList.add('hero-cta', 'secondary');

      const link = cta2El.querySelector('a');


      const cta2TextEl = block.querySelector(
        '[data-aue-prop="ctabuttonText2"], .herobanner-nested-1-7 p'
      );

      if (cta2TextEl && cta2TextEl.textContent.trim()) {
        link.textContent = cta2TextEl.textContent.trim();
      }

      if (link.textContent.trim()) {

        decorateCTAWithCircle(link, { before: true, after: true });

        ctaGroup.appendChild(cta2El);
      }
    }
  }

  heroContainer.appendChild(heroContent);
  const carouselItems = block.querySelectorAll(
    '[data-aue-model="bannercarousel"],[data-gen-model="featureItem"]',
  );

  if (carouselItems?.length) {
    heroContainer.classList.add('hero-carousal-variation');
  }

  const carouselContainer = document.createElement('div');
  carouselContainer.className = 'hero-banner-carousal';
  const carouselWrapper = document.createElement('div');
  carouselWrapper.className = 'carousel-wrapper';
  carouselWrapper.setAttribute('data-aue-type', 'container');

  let currentIndex = 0;

  // arrow navigations
  const leftArrow = SvgIcon({
    name: 'leftarrowwhite',
    className: 'arrow-link',
    size: '12',
  });
  const rightArrow = SvgIcon({
    name: 'rightarrowwhite',
    className: 'arrow-link',
    size: '12',
  });
  const leftArrowDisabled = SvgIcon({
    name: 'leftarrowdisabled',
    className: 'arrow-link disabled',
    size: '12',
  });
  const rightArrowDisabled = SvgIcon({
    name: 'rightarrowdisabled',
    className: 'arrow-link disabled',
    size: '12',
  });
  const ellipse = SvgIcon({
    name: 'ellipse',
    className: 'ellipse ellipse-disabled',
    size: '6',
  });

  const scrollIntervalDiv = block.querySelector(
    '[data-aue-prop="scrollInterval"], .herobanner-nested-1-9 p',
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
        leftIcon.innerHTML = '';
        leftIcon.appendChild(stringToHTML(leftArrow));
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
    // Copy data attributes from source carousel item
    moveInstrumentation(item, carouselItem);

    const carouselItemContent = document.createElement('div');
    carouselItemContent.classList.add('carousel-content');
    moveInstrumentation(item, carouselContainer);
    const newsLetterImage = document.createElement('div');
    newsLetterImage.classList.add('carousel-image');
    const newsLinkDiv = document.createElement('div');
    newsLinkDiv.classList.add('news-link-container');
    const newsLinkArrowDiv = document.createElement('div');
    newsLinkArrowDiv.classList.add('news-link-arrow-container');

    carouselItem.appendChild(carouselItemContent);
    carouselItem.appendChild(newsLetterImage);

    // Extract and append the title
    const itemDivs = item.querySelectorAll('div');

    const carouselTitleElement = itemDivs[0].querySelector('p');
    if (carouselTitleElement && carouselTitleElement.textContent.trim()) {
      const titleText = carouselTitleElement.textContent;
      const titleHtml = `<p class="news-title">${titleText}</p>`;
      const titleContainer = document.createElement('div');
      moveInstrumentation(itemDivs[0], titleContainer);
      titleContainer.insertAdjacentHTML('beforeend', titleHtml);
      carouselItemContent.appendChild(titleContainer);
      carouselTitleElement.remove();
    }

    // Extract and append the description
    const descriptionElement = itemDivs[1].querySelector('p');
    if (descriptionElement && descriptionElement.textContent.trim()) {
      const descriptionText = descriptionElement.textContent;
      const descriptionHtml = `<p class="news-description">${descriptionText}</p>`;
      const descContainer = document.createElement('div');
      moveInstrumentation(itemDivs[1], descContainer);
      descContainer.insertAdjacentHTML('beforeend', descriptionHtml);
      carouselItemContent.appendChild(descContainer);
      descriptionElement.remove();
    }

    // Extract and append the "Read More" label
    const readMoreLabelElement = itemDivs[3].querySelector('p');

    if (readMoreLabelElement && readMoreLabelElement.textContent.trim()) {
      const readMoreLabelText = readMoreLabelElement.textContent;
      const buttonContainer = itemDivs[4]?.querySelector('a');
      const href = buttonContainer?.getAttribute('href') ?? '/';
      const readMoreLabelHtml = `<a class="news-link" href="${href}">${readMoreLabelText}</a>`;
      const readMoreContainer = document.createElement('div');
      moveInstrumentation(itemDivs[3], readMoreContainer);
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
          mobile: { src: firstIconLink.getAttribute('href') },
          tablet: { src: firstIconLink.getAttribute('href') },
          desktop: { src: firstIconLink.getAttribute('href') },
        },
        lazy: false,
      });

      // Use ImageComponent to load the second SVG icon
      const secondIconHtml = ImageComponent({
        src: secondIconLink.getAttribute('href'),
        alt: 'Chevron Left Icon',
        className: 'second-svg-icon', // You can customize the class name if needed
        breakpoints: {
          mobile: { src: secondIconLink.getAttribute('href') },
          tablet: { src: secondIconLink.getAttribute('href') },
          desktop: { src: secondIconLink.getAttribute('href') },
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
    const isImageExists = itemDivs[2].querySelector('p');
    if (isImageExists) {
      const aTag = isImageExists.querySelector('a');
      if (aTag) {
        const imgUrl = aTag?.getAttribute('href');
        const imgAlt = aTag?.getAttribute('title');
        const imgHtml = ImageComponent({
          src: imgUrl,
          alt: imgAlt,
          className: 'news-thumbnail',
          asImageName: 'hero.webp',
          breakpoints: {
            mobile: {
              src: `${imgUrl}`,
              imgWidth: 120,
            },
            tablet: {
              src: `${imgUrl}`,
              imgWidth: 320,
            },
            desktop: {
              src: `${imgUrl}`,
              imgWidth: 320,
            },
          },
          lazy: false,
        });


        newsLetterImage.insertAdjacentHTML('beforeend', imgHtml);
        moveInstrumentation(itemDivs[2], newsLetterImage);
        aTag.remove();
      }
    }
    carouselWrapper.appendChild(carouselItem);
  });

  navigations.classList.add('navigation-arrows');

  leftIcon.classList.add('left-carousel-arrow');
  rightIcon.classList.add('right-carousel-arrow');

  const leftRightArrow = document.createElement('div');
  leftRightArrow.classList.add('leftright-arrow');
  leftRightArrow.appendChild(leftIcon);
  leftRightArrow.appendChild(rightIcon);


  // carouselContainer.appendChild(leftIcon);
  for (let i = 0; i < carouselItems.length; i += 1) {
    const ellipseEl = stringToHTML(ellipse);
    if (i === 0) {
      ellipseEl.classList.remove('ellipse-disabled');
      ellipseEl.classList.add('ellipse-enabled');
    }
    navigations.appendChild(ellipseEl);
  }

  leftIcon.appendChild(stringToHTML(leftArrowDisabled));
  if (carouselItems.length === 1) {
    rightIcon.appendChild(stringToHTML(rightArrowDisabled));
  } else {
    rightIcon.appendChild(stringToHTML(rightArrow));
  }
  carouselContainer.appendChild(leftRightArrow);

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
      carouselContainer.appendChild(navigations);
    }
  }

  const carouselItemsAll = heroContainer.querySelectorAll('.carousel-item');

  // Check if we're not in author instance before setting up auto-scroll
  const isAuthorInstance = document.getElementById('OverlayBlockingElement');
  if (carouselItemsAll.length > 0 && !isAuthorInstance) {
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