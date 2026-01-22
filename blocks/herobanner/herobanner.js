import ImageComponent from '../../shared-components/ImageComponent.js';
import Heading from '../../shared-components/Heading.js';
import SvgIcon from '../../shared-components/SvgIcon.js';
import stringToHTML from '../../shared-components/Utility.js';
import { moveInstrumentation } from '../../scripts/scripts.js';


export default function decorate(block) {
  block.classList.add('fade-item');
  // Always create a new heroContainer to avoid issues when block is cleared
  // If one exists, we'll process its content but create a fresh container
  const existingHeroContainer = block.querySelector('.hero-banner-container');
  const heroContainer = document.createElement('div');
  heroContainer.className = 'hero-banner-container';

  // If there's an existing container, copy its style properties
  if (existingHeroContainer) {
    const existingStyle = existingHeroContainer.style.cssText;
    if (existingStyle) {
      heroContainer.style.cssText = existingStyle;
    }
  }
function getAssetLink(rootBlock, modelName, nestedSelector) {
  return (
    rootBlock.querySelector(`[data-aue-model="${modelName}"] a[href]`)
    || rootBlock.querySelector(`${nestedSelector} a[href]`)
  );
}


  // Get block children early for use in fallback selectors
  const blockChildren = Array.from(block.children);

  // Desktop image (also used as fallback for tablet and mobile)
    function renderHeroImage({
      block: rootBlock,
      heroContainer: container,
      modelName,
      nestedSelector,
      className,
      label,
    })  {
    const linkEl = getAssetLink(rootBlock, modelName, nestedSelector);
    if (!linkEl) return null;

    const src = linkEl.getAttribute('href');
    if (!src) return null;

    const alt = linkEl.getAttribute('title') || 'Hero Image';

    const imageHtml = ImageComponent({
      src,
      alt,
      className,
      asImageName: 'hero.webp',
      breakpoints: {
        mobile: {
          src,
          smartCrop: 'Small',
        },
        tablet: {
          src,
          smartCrop: 'Medium',
        },
        desktop: {
          src,
          smartCrop: 'Desktop',
        },
      },
      lazy: false,
    });

    const imageContainer = document.createElement('div');
    moveInstrumentation(linkEl, imageContainer);

    imageContainer.setAttribute('data-aue-model', modelName);
    imageContainer.setAttribute('data-aue-label', label);
    imageContainer.insertAdjacentHTML('beforeend', imageHtml);

    container.appendChild(imageContainer);
    linkEl.remove();

    return { src, alt };
  }
  // Render hero images
  renderHeroImage({
    block,
    heroContainer,
    modelName: 'bannerimage',
    nestedSelector: '.herobanner-nested-1-1',
    className: 'hero-image hero-image-desktop',
    label: 'Banner Image',
  });

  renderHeroImage({
    block,
    heroContainer,
    modelName: 'bannerimageTablet',
    nestedSelector: '.herobanner-nested-1-5',
    className: 'hero-image hero-image-tablet',
    label: 'Banner Image (Tablet)',
  });

  renderHeroImage({
    block,
    heroContainer,
    modelName: 'bannerimageMobile',
    nestedSelector: '.herobanner-nested-1-6',
    className: 'hero-image hero-image-mobile',
    label: 'Banner Image (Mobile)',
  });



  // Try multiple selectors to find font color in both authoring and publishing mode
  const fontColorEl = block.querySelector('[data-aue-prop="bannerFontColor"], [data-gen-prop="bannerFontColor"]')
    || block.querySelector('.herobanner-nested-1-7 p')
    || block.querySelector('.herobanner-nested-1-7')
    || (blockChildren[6]?.querySelector('p') ? blockChildren[6] : null);

  if (fontColorEl) {
    const fontColorP = fontColorEl.querySelector('p') || fontColorEl;
    const fontColor = fontColorP?.textContent?.trim();
    if (fontColor) {
      heroContainer.style.setProperty('--hero-text-color', fontColor);
    }
    // Only remove if it's not the block itself
    if (fontColorEl.parentNode === block || fontColorEl.parentNode?.parentNode === block) {
      fontColorEl.remove();
    }
  }

  // Try multiple selectors to find gradient toggle in both authoring and publishing mode
  const gradientEl = block.querySelector('[data-aue-prop="enableGradient"], [data-gen-prop="enableGradient"]')
    || block.querySelector('.herobanner-nested-1-8 p')
    || block.querySelector('.herobanner-nested-1-8')
    || (blockChildren[7]?.querySelector('p') ? blockChildren[7] : null);

  // Get text from p tag if it exists, otherwise from the element itself
  const gradientP = gradientEl?.querySelector('p') || gradientEl;
  const gradientValue = gradientP?.textContent?.trim();
  const enableGradient = !gradientEl || gradientValue !== 'false';
  heroContainer.classList.add(enableGradient ? 'hero-has-gradient' : 'hero-no-gradient');

  // Only remove if it's not the block itself
  if (gradientEl && (
    gradientEl.parentNode === block
    || gradientEl.parentNode?.parentNode === block
  )) {
    gradientEl.remove();
  }

  const heroContent = document.createElement('div');
  heroContent.classList.add('hero-content', 'columns-container', 'container');

  // Try multiple selectors to find elements in both authoring and publishing mode
  // Check block children directly as fallback (blockChildren already defined above)

  const headingElement = block.querySelector(
    '[data-aue-prop="bannerheading"], [data-gen-prop="bannerheading"]',
  )
    || block.querySelector('.herobanner-nested-1-2 p')
    || block.querySelector('.herobanner-nested-1-2')
    || (blockChildren[1]?.querySelector('p') ? blockChildren[1] : null);

  if (headingElement) {
    // Get text from p tag if it exists, otherwise from the element itself
    const headingP = headingElement.querySelector('p') || headingElement;
    const headingText = headingP.textContent?.trim();
    if (headingText) {
      const headingContainer = document.createElement('div');
      // Copy data attributes from source element
      moveInstrumentation(headingElement, headingContainer);
      const headingHtml = Heading({
        level: 5,
        text: headingText,
        className: 'hero-heading',
      });
      headingContainer.insertAdjacentHTML('beforeend', headingHtml);
      heroContent.append(headingContainer);
    }
    // Only remove if it's not the block itself
    if (headingElement.parentNode === block || headingElement.parentNode?.parentNode === block) {
      headingElement.remove();
    }
  }

  const titleElement = block.querySelector(
    '[data-aue-prop="bannertitle"], [data-gen-prop="bannertitle"]',
  )
    || block.querySelector('.herobanner-nested-1-3 p')
    || block.querySelector('.herobanner-nested-1-3')
    || (blockChildren[2]?.querySelector('p') ? blockChildren[2] : null);

  if (titleElement) {
    // Get text from p tag if it exists, otherwise from the element itself
    const titleP = titleElement.querySelector('p') || titleElement;
    const titleText = titleP.textContent?.trim();
    if (titleText) {
      const titleContainer = document.createElement('div');
      // Copy data attributes from source element
      moveInstrumentation(titleElement, titleContainer);
      const headingHtml = Heading({
        level: 1,
        text: titleText,
        className: 'hero-title',
      });
      titleContainer.insertAdjacentHTML('beforeend', headingHtml);
      heroContent.append(titleContainer);
    }
    // Only remove if it's not the block itself
    if (titleElement.parentNode === block || titleElement.parentNode?.parentNode === block) {
      titleElement.remove();
    }
  }

  const descElement = block.querySelector(
    '[data-aue-prop="bannerdescription"], [data-gen-prop="bannerdescription"]',
  )
    || block.querySelector('.herobanner-nested-1-4 p')
    || block.querySelector('.herobanner-nested-1-4')
    || (blockChildren[3]?.querySelector('p') ? blockChildren[3] : null);

  if (descElement) {
    // Get text from p tag if it exists, otherwise from the element itself
    const descP = descElement.querySelector('p') || descElement;
    const descriptionText = descP.textContent?.trim();
    if (descriptionText) {
      const descriptionDiv = document.createElement('div');
      descriptionDiv.className = 'hero-description';
      // Copy data attributes from source element
      moveInstrumentation(descElement, descriptionDiv);
      descriptionDiv.textContent = descriptionText;
      heroContent.appendChild(descriptionDiv);
    }
    // Only remove if it's not the block itself
    if (descElement.parentNode === block || descElement.parentNode?.parentNode === block) {
      descElement.remove();
    }
  }

  // Try multiple selectors to find CTA button in both authoring and publishing mode
  const arrowIconLink = block.querySelector('[data-aue-prop="ctabutton"], [data-gen-prop="ctabutton"]')
    || block.querySelector('.herobanner-nested-1-10 a')
    || block.querySelector('.herobanner-nested-1-10')
    || block.children[10]
    || (blockChildren[9]?.querySelector('a') ? blockChildren[9] : null);

  if (arrowIconLink && arrowIconLink.querySelector('a') != null) {
    const arrowIconHtml = SvgIcon({
      name: 'arrow',
      className: 'hero-arrow-icon',
      size: '24',
      color: '#B29152',
    });
    const parsedHtml = stringToHTML(arrowIconHtml);
    arrowIconLink.querySelector('a').textContent = '';
    arrowIconLink.querySelector('a')?.append(parsedHtml);
    heroContent.appendChild(arrowIconLink);
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

  // Try multiple selectors to find scroll interval in both authoring and publishing mode
  const scrollIntervalDiv = block.querySelector(
    '[data-aue-prop="scrollInterval"], [data-gen-prop="scrollInterval"]',
  )
    || block.querySelector('.herobanner-nested-1-13 p')
    || block.querySelector('.herobanner-nested-1-13')
    || (blockChildren[12]?.querySelector('p') ? blockChildren[12] : null)
    || (blockChildren[13]?.querySelector('p') ? blockChildren[13] : null);

  let scrollInterval = 5000; // Default to 5 seconds instead of 3
  if (scrollIntervalDiv) {
    // Get text from p tag if it exists, otherwise from the element itself
    const intervalP = scrollIntervalDiv.querySelector('p') || scrollIntervalDiv;
    const intervalValue = parseInt(intervalP.textContent, 10);
    if (intervalValue && intervalValue > 0) {
      scrollInterval = intervalValue * 1000;
    }
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
    if (carouselTitleElement) {
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
    if (descriptionElement) {
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

    if (readMoreLabelElement) {
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
              imgWidth: 100,
            },
            tablet: {
              src: `${imgUrl}`,
              imgWidth: 160,
            },
            desktop: {
              src: `${imgUrl}`,
              imgWidth: 160,
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

  // Try multiple selectors to find scroll indicator text in both authoring and publishing mode
  // Get block children again in case they've changed
  const currentBlockChildren = Array.from(block.children);
  const scrollHintTextEl = block.querySelector(
    '[data-aue-prop="indicatortext"], [data-gen-prop="indicatortext"]',
  )
    || block.querySelector('.herobanner-nested-1-9 p')
    || block.querySelector('.herobanner-nested-1-9')
    || (currentBlockChildren[8]?.querySelector('p') ? currentBlockChildren[8] : null)
    || (currentBlockChildren[9]?.querySelector('p') ? currentBlockChildren[9] : null);

  // Get text from p tag if it exists, otherwise from the element itself
  const scrollP = scrollHintTextEl?.querySelector('p') || scrollHintTextEl;
  const scrollText = scrollP?.textContent?.trim();

  if (scrollText) {
    const scrollHint = document.createElement('div');
    scrollHint.className = 'masthead-scroll-hint';
    const scrollIcon = SvgIcon({
      name: 'scroll-down',
      size: '24',
      className: 'scroll-icon',
    });
    scrollHint.innerHTML = `
    ${scrollIcon}
    <span class="scroll-text">${scrollText}</span>
  `;
    heroContainer.appendChild(scrollHint);
    const icon = heroContainer.querySelector('.scroll-icon');

    let firstRun = true;

    const runAnimation = () => {
      if (firstRun) {
        icon.classList.add('is-visible');
        firstRun = false;
        return;
      }

      icon.classList.add('is-fading');
      icon.classList.remove('is-visible');

      setTimeout(() => {
        icon.classList.remove('is-fading');
      }, 450);

      setTimeout(() => {
        icon.classList.add('is-visible');
      }, 900);
    }

    runAnimation();
    setInterval(runAnimation, 2500);
  }

  // Only remove if it's not the block itself
  if (scrollHintTextEl && (
    scrollHintTextEl.parentNode === block
    || scrollHintTextEl.parentNode?.parentNode === block
  )) {
    scrollHintTextEl.remove();
  }


  carouselContainer.appendChild(carouselWrapper);
  if (carouselItems.length) {
    heroContainer.appendChild(carouselContainer);
    if (carouselItems.length > 1) {
      heroContainer.appendChild(navigations);
    }
  }

  const carouselItemsAll = heroContainer.querySelectorAll('.carousel-item');

  // Check if we're not in author instance before setting up auto-scroll
  // Check for authoring mode: URL contains 'author' or block has data-aue-resource
  const isAuthorInstance = window.location.href.indexOf('author') !== -1
    || block.closest('[data-aue-resource]') !== null
    || document.querySelector('[data-aue-resource]') !== null;

  if (carouselItemsAll.length > 0 && !isAuthorInstance && scrollInterval > 0) {
    setInterval(() => {
      moveCarousel(true, false);
    }, scrollInterval);
  }

  carouselItems.forEach((item) => {
    item.remove();
  });

  // Clear block and append heroContainer
  // Remove all existing children first, but preserve heroContainer if it exists
  const existingContainer = block.querySelector('.hero-banner-container');
  if (existingContainer && existingContainer.parentNode === block) {
    existingContainer.remove();
  }

  // Remove all remaining children
  while (block.firstChild) {
    block.removeChild(block.firstChild);
  }
  block.appendChild(heroContainer);
}