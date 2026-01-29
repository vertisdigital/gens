import ImageComponent from '../../shared-components/ImageComponent.js';
import Heading from '../../shared-components/Heading.js';
import SvgIcon from '../../shared-components/SvgIcon.js';
import { moveInstrumentation } from '../../scripts/scripts.js';


export default function decorate(block) {
  block.classList.add('fade-item');
  // Always create a new mastheadContainer to avoid issues when block is cleared
  // If one exists, we'll process its content but create a fresh container
  const existingMastheadContainer = block.querySelector('.masthead-container');
  const mastheadContainer = document.createElement('div');
  mastheadContainer.className = 'masthead-container';

  // If there's an existing container, copy its style properties
  if (existingMastheadContainer) {
    const existingStyle = existingMastheadContainer.style.cssText;
    if (existingStyle) {
      mastheadContainer.style.cssText = existingStyle;
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
  function renderMastheadImage({
    block: rootBlock,
    mastheadContainer: container,
    modelName,
    nestedSelector,
    className,
    label,
  }) {
    const linkEl = getAssetLink(rootBlock, modelName, nestedSelector);
    if (!linkEl) return null;

    const src = linkEl.getAttribute('href');
    if (!src) return null;

    const alt = linkEl.getAttribute('title') || 'Masthead Image';

    const imageHtml = ImageComponent({
      src,
      alt,
      className,
      asImageName: 'masthead.webp',
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

  renderMastheadImage({
    block,
    mastheadContainer,
    modelName: 'mastheadimage',
    nestedSelector: '.masthead-nested-1-1',
    className: 'masthead-image masthead-image-desktop',
    label: 'Masthead Image',
  });

  renderMastheadImage({
    block,
    mastheadContainer,
    modelName: 'mastheadimageTablet',
    nestedSelector: '.masthead-nested-1-2',
    className: 'masthead-image masthead-image-tablet',
    label: 'Masthead Image (Tablet)',
  });

  renderMastheadImage({
    block,
    mastheadContainer,
    modelName: 'mastheadimageMobile',
    nestedSelector: '.masthead-nested-1-3',
    className: 'masthead-image masthead-image-mobile',
    label: 'Masthead Image (Mobile)',
  });



  // Try multiple selectors to find font color in both authoring and publishing mode
  const fontColorEl = block.querySelector('[data-aue-prop="mastheadfontcolor"], [data-gen-prop="mastheadfontcolor"]')
    || block.querySelector('.masthead-nested-1-4 p')
    || block.querySelector('.masthead-nested-1-4')
    || (blockChildren[3]?.querySelector('p') ? blockChildren[3] : null);

  if (fontColorEl) {
    const fontColorP = fontColorEl.querySelector('p') || fontColorEl;
    const fontColor = fontColorP?.textContent?.trim();
    if (fontColor) {
      mastheadContainer.style.setProperty('--masthead-text-color', fontColor);
    }
    // Only remove if it's not the block itself
    if (fontColorEl.parentNode === block || fontColorEl.parentNode?.parentNode === block) {
      fontColorEl.remove();
    }
  }

  // Try multiple selectors to find gradient toggle in both authoring and publishing mode
  const gradientEl = block.querySelector('[data-aue-prop="enablegradient"], [data-gen-prop="enablegradient"]')
    || block.querySelector('.masthead-nested-1-8 p')
    || block.querySelector('.masthead-nested-1-8')
    || (blockChildren[7]?.querySelector('p') ? blockChildren[7] : null);

  // Get text from p tag if it exists, otherwise from the element itself
  const gradientP = gradientEl?.querySelector('p') || gradientEl;
  const gradientValue = gradientP?.textContent?.trim();
  const enablegradient = !gradientEl || gradientValue !== 'false';
  mastheadContainer.classList.add(enablegradient ? 'masthead-has-gradient' : 'masthead-no-gradient');

  // Only remove if it's not the block itself
  if (gradientEl && (
    gradientEl.parentNode === block
    || gradientEl.parentNode?.parentNode === block
  )) {
    gradientEl.remove();
  }

  const mastheadContent = document.createElement('div');
  mastheadContent.classList.add('masthead-content', 'columns-container', 'container');

  const titleElement = block.querySelector(
    '[data-aue-prop="mastheadtitle"], [data-gen-prop="mastheadtitle"]',
  )
    || block.querySelector('.masthead-nested-1-5 p')
    || block.querySelector('.masthead-nested-1-5')
    || (blockChildren[4]?.querySelector('p') ? blockChildren[4] : null);

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
        className: 'masthead-title',
      });
      titleContainer.insertAdjacentHTML('beforeend', headingHtml);
      mastheadContent.append(titleContainer);
    }
    // Only remove if it's not the block itself
    if (titleElement.parentNode === block || titleElement.parentNode?.parentNode === block) {
      titleElement.remove();
    }
  }

  mastheadContainer.appendChild(mastheadContent);

  // Try multiple selectors to find scroll indicator text in both authoring and publishing mode
  // Get block children again in case they've changed
  const currentBlockChildren = Array.from(block.children);
  const scrollHintTextEl = block.querySelector(
    '[data-aue-prop="indicatortext"], [data-gen-prop="indicatortext"]',
  )
    || block.querySelector('.masthead-nested-1-7 p')
    || block.querySelector('.masthead-nested-1-7')
    || (currentBlockChildren[6]?.querySelector('p') ? currentBlockChildren[6] : null)

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
    mastheadContainer.appendChild(scrollHint);
    const icon = mastheadContainer.querySelector('.scroll-icon');

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

  // Clear block and append mastheadContainer
  // Remove all existing children first, but preserve mastheadContainer if it exists
  const existingContainer = block.querySelector('.masthead-container');
  if (existingContainer && existingContainer.parentNode === block) {
    existingContainer.remove();
  }

  // Remove all remaining children
  while (block.firstChild) {
    block.removeChild(block.firstChild);
  }
  block.appendChild(mastheadContainer);
}