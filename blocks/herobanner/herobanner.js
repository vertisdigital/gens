import ImageComponent from '../../shared-components/ImageComponent.js';
import Heading from '../../shared-components/Heading.js';
import SvgIcon from '../../shared-components/SvgIcon.js';
import stringToHTML from '../../shared-components/Utility.js';


export default function decorate(block) {
  let heroContainer = block.querySelector('.hero-banner-container');

  if (!heroContainer) {
    heroContainer = document.createElement('div');
    heroContainer.className = 'hero-banner-container';
    heroContainer.setAttribute('data-aue-resource', 'herobanner');
    heroContainer.setAttribute('data-aue-type', 'block');
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

  const titleElement = block.querySelector('[data-aue-prop="bannertitle"]');
  if (titleElement) {
    const titleText = titleElement.textContent;
    const titleContainer = document.createElement('div');
    titleContainer.setAttribute('data-aue-model', 'bannertitle');
    titleContainer.setAttribute('data-aue-label', 'Banner Title');
    titleContainer.setAttribute('data-aue-prop', titleElement.getAttribute('data-aue-prop'));
    titleContainer.setAttribute('data-aue-type', 'text');
    const headingHtml = Heading({ level: 1, text: titleText, className: 'hero-title' });
    titleContainer.insertAdjacentHTML('beforeend', headingHtml);
    heroContainer.appendChild(titleContainer);
    titleElement.remove();
  }

  const descElement = block.querySelector('[data-aue-prop="bannerdescription"]');
  if (descElement) {
    const descriptionDiv = document.createElement('div');
    descriptionDiv.className = 'hero-description';
    descriptionDiv.setAttribute('data-aue-model', 'bannerdescription');
    descriptionDiv.setAttribute('data-aue-label', 'Banner Description');
    descriptionDiv.setAttribute('data-aue-prop', descElement.getAttribute('data-aue-prop'));
    descriptionDiv.setAttribute('data-aue-type', 'text');
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
  carouselContainer.setAttribute('data-aue-model', 'bannercarousel');
  carouselContainer.setAttribute('data-aue-label', 'Banner Carousel');

  const carouselWrapper = document.createElement('div');
  carouselWrapper.className = 'carousel-wrapper';
  carouselWrapper.setAttribute('data-aue-type', 'container');


   // arrow navigations
   const leftArrow = SvgIcon({ name: 'leftarrow', className: 'arrow-link', size: '12' });
   const rightArrow = SvgIcon({ name: 'rightarrow', className: 'arrow-link', size: '12' });
   const leftArrowDisabled = SvgIcon({ name: 'leftarrowdisabled', className: 'arrow-link', size: '12' });
   const rightArrowDisabled = SvgIcon({ name: 'rightarrowdisabled', className: 'arrow-link', size: '12' });
   
   // Loop through all carousel items
   carouselItems.forEach((item, index) => {
    const navigations = document.createElement('div');
    navigations.classList.add('navigation-arrows');
    const carouselItem = document.createElement('div');
    carouselItem.classList.add('carousel-item');
    carouselItem.setAttribute('data-aue-model', 'bannercarousel');
    carouselItem.setAttribute('data-aue-resource', item.getAttribute('data-aue-resource'));
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

    const leftIcon = document.createElement('div');
    leftIcon.classList.add('left-carousel-arrow');
    const rightIcon = document.createElement('div');
    rightIcon.classList.add('right-carousel-arrow');
    navigations.appendChild(leftIcon);
    navigations.appendChild(rightIcon);
    if(index === 0){
      leftIcon.setAttribute('disabled', 'true');
      leftIcon.appendChild(stringToHTML(leftArrowDisabled));
      rightIcon.appendChild(stringToHTML(rightArrow));
    } else if(index === carouselItems.length - 1){
      rightIcon.setAttribute('disabled', 'true');
      leftIcon.appendChild(stringToHTML(leftArrow));
      rightIcon.appendChild(stringToHTML(rightArrowDisabled));
    }else {
      leftIcon.appendChild(stringToHTML(leftArrow));
      rightIcon.appendChild(stringToHTML(rightArrow));
    }
    leftIcon.addEventListener('click',()=>{
      moveCarousel(false)
    });
    rightIcon.addEventListener('click',()=>{
      moveCarousel(true)
    });

    carouselItem.appendChild(carouselItemContent);
    carouselItem.appendChild(newsLatterImage);

    // Extract and append the title
    const carouselTitleElement = item.querySelector('[data-aue-prop="title"]');
    if (carouselTitleElement) {
      const titleText = carouselTitleElement.textContent;
      const titleHtml = `<p class="news-title">${titleText}</p>`;
      const titleContainer = document.createElement('div');
      titleContainer.setAttribute('data-aue-label', 'Title');
      titleContainer.setAttribute('data-aue-prop', carouselTitleElement.getAttribute('data-aue-prop'));
      titleContainer.setAttribute('data-aue-type', 'text');
      titleContainer.insertAdjacentHTML('beforeend', titleHtml);
      carouselItemContent.appendChild(titleContainer);
      carouselTitleElement.remove();
    }

    // Extract and append the description
    const descriptionElement = item.querySelector('[data-aue-prop="description"]');
    if (descriptionElement) {
      const descriptionText = descriptionElement.textContent;
      const descriptionHtml = `<p class="news-description">${descriptionText}</p>`;
      const descContainer = document.createElement('div');
      descContainer.setAttribute('data-aue-label', 'Description');
      descContainer.setAttribute('data-aue-prop', descriptionElement.getAttribute('data-aue-prop'));
      descContainer.setAttribute('data-aue-type', 'text');
      descContainer.insertAdjacentHTML('beforeend', descriptionHtml);
      carouselItemContent.appendChild(descContainer);
      descriptionElement.remove();
    }

    // Extract and append the "Read More" label
    const readMoreLabelElement = item.querySelector('[data-aue-prop="readmorelabel"]');
    if (readMoreLabelElement) {
      const readMoreLabelText = readMoreLabelElement.textContent;
      const readMoreLabelHtml = `<p class="news-link">${readMoreLabelText}</p>`;
      const readMoreContainer = document.createElement('div');
      readMoreContainer.setAttribute('data-aue-model', 'readmorelabel');
      readMoreContainer.setAttribute('data-aue-label', 'Read More Label');
      readMoreContainer.setAttribute('data-aue-prop', readMoreLabelElement.getAttribute('data-aue-prop'));
      readMoreContainer.setAttribute('data-aue-type', 'text');
      readMoreContainer.insertAdjacentHTML('beforeend', readMoreLabelHtml);
      newsLinkDiv.appendChild(readMoreContainer);
      readMoreLabelElement.remove();
    }

    newsLinkDiv.appendChild(navigations);
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
          newsLatterImage.setAttribute('data-aue-type', 'image');
          newsLatterImage.setAttribute('data-aue-prop', 'image');
          newsLatterImage.setAttribute('data-aue-label', 'News Image');
          aTag.remove();
        }
      }
    }
    carouselWrapper.appendChild(carouselItem);
  });
  
  carouselContainer.appendChild(carouselWrapper);
  heroContainer.appendChild(carouselContainer);

  let currentIndex = 0;
  const carouselItemsAll = heroContainer.querySelectorAll('.carousel-item');

  function moveCarousel(moveForward) {
    const carouselItemsEl = heroContainer.querySelector('.carousel-item');
    const itemWidth = carouselItemsEl?.offsetWidth;
    if(moveForward) currentIndex += 1
    else currentIndex -= 1;

    if (currentIndex >= carouselItemsAll.length) {
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

  if (carouselItemsAll.length > 0) {
    setInterval(()=>{
      moveCarousel(true)
    }, 3000);
  }

  carouselItems.forEach((item) => {
    item.remove();
  });

  block.textContent = '';
  block.appendChild(heroContainer);
}
