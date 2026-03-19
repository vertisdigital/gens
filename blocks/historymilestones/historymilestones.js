import ImageComponent from '../../shared-components/ImageComponent.js';
import { getIcon } from '../../shared-components/icons/index.js';

/* ===================== */
/* Helpers               */
/* ===================== */

function getImageNode(image) {
  const imageLink = image.querySelector('a[href]');
  let imageUrl;
  let imageAlt;

  if (imageLink) {
    imageUrl = imageLink.getAttribute('href');
    imageAlt = imageLink.title || 'History Image';
  } else {
    const img = image.querySelector('img');
    if (img) {
      imageUrl = img.getAttribute('src');
      imageAlt = img.getAttribute('alt') || 'History Image';
    }
  }

  if (!imageUrl) {
    imageUrl = `${window.hlx.codeBasePath}/icons/generic-milestone.jpg`;
    imageAlt = 'Genting Singapore Milestone';
  }

  const isFallback = imageUrl.includes('/icons/generic-milestone.jpg');
  const imageWrapper = document.createElement('div');
  imageWrapper.className = 'history-milestone-image-wrapper';

  if (isFallback) {
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = imageAlt;
    img.className = 'history-milestone-image fallback-image';
    img.loading = 'lazy';
    imageWrapper.append(img);
    return imageWrapper;
  }

  const imageHtml = ImageComponent({
    src: imageUrl,
    alt: imageAlt,
    className: 'history-milestone-image',
    asImageName: 'historymilestone.webp',
    breakpoints: {
      mobile: { width: 768, src: imageUrl, imgHeight: 206, imgWidth: 361 },
      tablet: { width: 993, src: imageUrl, imgHeight: 206, imgWidth: 361 },
      desktop: { width: 1920, src: imageUrl, imgHeight: 206, imgWidth: 361 },
    },
    lazy: true,
  });

  const parser = new DOMParser();
  const doc = parser.parseFromString(imageHtml, 'text/html');
  const imgNode = doc.body.firstChild;
  if (imgNode) {
    imageWrapper.append(imgNode);
  }
  return imageWrapper;
}

/* ===================== */
/* Slider logic          */
/* ===================== */

function isValidWrapper(wrapper) {
  // If wrapper is already decorated (has structure), check milestones count
  const milestonesContainer = wrapper.querySelector('.historymilestones-milestones');
  if (milestonesContainer) {
    return milestonesContainer.children.length > 0;
  }

  // If wrapper is raw block, check children
  // The wrapper usually contains the block div.
  let block = wrapper.querySelector('.historymilestones');
  if (!block) {
    // Fallback: check if wrapper itself has rows (direct children)
    // This handles cases where wrapper IS the block
    block = wrapper;
  }

  const children = Array.from(block.children);
  if (children.length === 0) return false;

  let rawMilestones = [];

  if (children.length > 1) {
    const secondChild = children[1];
    // Check if second child looks like a milestone (has >1 columns)
    // Milestones usually have 3 columns (Image, Date, Description).
    // Description row usually has 1 column.
    if (secondChild.children.length > 1) {
      rawMilestones = children.slice(1);
    } else {
      rawMilestones = children.slice(2);
    }
  }

  const validMilestones = rawMilestones.filter((milestone) => {
    const [, date, description] = milestone.children;
    const hasDate = date && date.textContent.trim().length > 0;
    const hasDescription =
      description && description.textContent.trim().length > 0;
    return hasDate && hasDescription;
  });

  return validMilestones.length > 0;
}

function initHistoryMilestonesSlider(block) {
  const section = block.closest('.section.historymilestones-container');
  if (
    !section ||
    section.dataset.historymilestonesSliderInitialized === 'true'
  ) {
    return;
  }

  let wrappers = Array.from(
    section.querySelectorAll('.historymilestones-wrapper'),
  );

  // Filter out invalid wrappers (empty or no content)
  wrappers = wrappers.filter(isValidWrapper);

  if (!wrappers.length) return;

  section.dataset.historymilestonesSliderInitialized = 'true';

  let activeIndex = 0;
  let yearButtons = [];
  let select;

  wrappers.forEach((wrapper, index) => {
    wrapper.classList.add('historymilestones-slide');
    wrapper.classList.toggle('is-active', index === activeIndex);
  });

  /* ---------- navigation ---------- */

  const nav = document.createElement('div');
  nav.className = 'historymilestones-slider-nav';

  /* ---------- core slide function ---------- */
  const goToSlide = function goToSlide(index) {
    let targetIndex = index;

    if (targetIndex < 0) targetIndex = wrappers.length - 1;
    if (targetIndex >= wrappers.length) targetIndex = 0;
    if (targetIndex === activeIndex) return;

    wrappers[activeIndex].classList.remove('is-active');
    yearButtons[activeIndex].classList.remove('is-active');

    wrappers[targetIndex].classList.add('is-active');
    yearButtons[targetIndex].classList.add('is-active');

    activeIndex = targetIndex;

    // Sync mobile select
    select.value = activeIndex;
  };

  if (wrappers.length > 1) {
    const prevButton = document.createElement('button');
    prevButton.type = 'button';
    prevButton.className =
      'historymilestones-nav-btn historymilestones-nav-btn-prev';
    prevButton.setAttribute('aria-label', 'Previous year');
    prevButton.innerHTML = `
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M24 1C36.7025 1 47 11.2975 47 24
             C47 36.7025 36.7025 47 24 47
             C11.2975 47 1 36.7025 1 24
             C1 11.2975 11.2975 1 24 1Z"
          stroke="#8D713E" stroke-width="2"/>
        <path
          d="M20.572 24.257C20.4598 24.0759 20.4788 23.8295
             20.6284 23.6701L26.7532 17.1367
             C26.9241 16.9544 27.201 16.9544
             27.3719 17.1367
             C27.5427 17.3189 27.5427 17.6143
             27.3719 17.7966
             L21.5563 24L27.3719 30.2034
             C27.5427 30.3857 27.5427 30.6811
             27.3719 30.8633
             C27.201 31.0456 26.9241 31.0456
             26.7532 30.8633
             L20.6284 24.3299L20.572 24.257Z"
          fill="#8D713E"/>
      </svg>
    `; // Content is static SVG, safe

    const nextButton = document.createElement('button');
    nextButton.type = 'button';
    nextButton.className =
      'historymilestones-nav-btn historymilestones-nav-btn-next';
    nextButton.setAttribute('aria-label', 'Next year');
    nextButton.innerHTML = `
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M24 1C36.7025 1 47 11.2975 47 24
             C47 36.7025 36.7025 47 24 47
             C11.2975 47 1 36.7025 1 24
             C1 11.2975 11.2975 1 24 1Z"
          stroke="#8D713E" stroke-width="2"/>
        <path
          d="M27.428 24.257C27.5402 24.0759 27.5212 23.8295
             27.3716 23.6701L21.2468 17.1367
             C21.0759 16.9544 20.799 16.9544
             20.6281 17.1367
             C20.4573 17.3189 20.4573 17.6143
             20.6281 17.7966
             L26.4437 24L20.6281 30.2034
             C20.4573 30.3857 20.4573 30.6811
             20.6281 30.8633
             C20.799 31.0456 21.0759 31.0456
             21.2468 30.8633
             L27.3716 24.3299L27.428 24.257Z"
          fill="#8D713E"/>
      </svg>
    `; // Content is static SVG, safe

    prevButton.addEventListener('click', () => {
      goToSlide(activeIndex - 1);
    });

    nextButton.addEventListener('click', () => {
      goToSlide(activeIndex + 1);
    });

    nav.appendChild(prevButton);
    nav.appendChild(nextButton);
  }

  const yearsContainer = document.createElement('div');
  yearsContainer.className = 'historymilestones-nav-years';





  /* ---------- year buttons ---------- */
  yearButtons = wrappers.map((wrapper, index) => {
    const yearEls = wrapper.querySelectorAll('p[data-gen-prop="title"]'); // Try finding title in raw or decorated content
    let label = `Slide ${index + 1}`;
    let foundLabel = false;

    // First try: Find element with data-gen-prop="title"
    Array.from(yearEls).some((p) => {
      const text = p.textContent.trim();
      if (text) {
        label = text;
        foundLabel = true;
        return true;
      }
      return false;
    });

    // Second try: Find .historymilestones-year inside (likely decorated)
    if (!foundLabel) {
      const yearBlock = wrapper.querySelector('.historymilestones-year');
      if (yearBlock) {
        // In decorated block, yearText is the second child of .historymilestones-year
        // but we can just grab text from the second div if structure matches
        const divs = yearBlock.querySelectorAll('div');
        if (divs.length >= 2) {
          const text = divs[1].textContent.trim();
          if (text) {
            label = text;
            foundLabel = true;
          }
        }
        // Fallback: check all p tags in yearBlock
        if (!foundLabel) {
          const p = yearBlock.querySelector('p');
          if (p && p.textContent.trim()) {
            label = p.textContent.trim();
            foundLabel = true;
          }
        }
      } else {
        // Third try: Check raw block content (if not yet decorated)
        const fallbackBlock = wrapper.querySelector('.historymilestones') || wrapper;
        if (fallbackBlock && fallbackBlock.children.length > 0) {
          const yearRow = fallbackBlock.children[0];
          // Year is usually in the first div of the first row
          const text = yearRow.textContent.trim();
          if (text) {
            label = text;
            foundLabel = true;
          }
        }
      }
    }

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'historymilestones-nav-year';
    // Create a span for the text to separate it from the icon
    const textSpan = document.createElement('span');
    textSpan.textContent = label;
    button.appendChild(textSpan);

    // Inject the brandRings icon
    const iconHtml = getIcon('brandRings');
    if (iconHtml) {
      const iconWrapper = document.createElement('div');
      iconWrapper.className = 'historymilestones-nav-icon';
      iconWrapper.innerHTML = iconHtml;
      button.insertBefore(iconWrapper, textSpan);
    }

    button.setAttribute('data-slide-index', String(index));

    if (index === activeIndex) {
      button.classList.add('is-active');
    }

    button.addEventListener('click', () => {
      goToSlide(index);
    });

    yearsContainer.appendChild(button);
    return button;
  });



  /* ---------- mobile navigation ---------- */
  const mobileNav = document.createElement('div');
  mobileNav.className = 'historymilestones-mobile-nav';

  const mobileLabel = document.createElement('p');
  mobileLabel.className = 'historymilestones-mobile-label';
  mobileLabel.textContent = 'Select Year';
  mobileNav.appendChild(mobileLabel);

  const mobileSelect = document.createElement('div');
  mobileSelect.className = 'historymilestones-mobile-select-wrapper';

  select = document.createElement('select');
  select.className = 'historymilestones-mobile-select';

  yearButtons.forEach((btn, index) => {
    const option = document.createElement('option');
    option.value = index;
    // Use the text from the span we created inside the button
    const span = btn.querySelector('span');
    option.textContent = span ? span.textContent : btn.textContent;
    select.appendChild(option);
  });

  select.addEventListener('change', (e) => {
    goToSlide(parseInt(e.target.value, 10));
  });

  mobileSelect.appendChild(select);
  mobileNav.appendChild(mobileSelect);

  section.insertBefore(mobileNav, section.querySelector('.historymilestones-wrapper'));

  const timeline = document.createElement('div');
  timeline.className = 'timeline';
  timeline.appendChild(yearsContainer);



  section.insertBefore(timeline, section.querySelector('.historymilestones-wrapper'));
  section.insertBefore(nav, section.querySelector('.historymilestones-wrapper'));
}

/* ===================== */
/* Decorate              */
/* ===================== */

export default function decorate(block) {
  block.classList.add('fade-item');

  const children = Array.from(block.children);
  const year = children[0];
  let yearText = null;
  let rawMilestones = [];

  if (children.length > 1) {
    const secondChild = children[1];
    // Check if second child looks like a milestone (has >1 columns)
    // Milestones usually have 3 columns (Image, Date, Description).
    // Description row usually has 1 column.
    if (secondChild.children.length > 1) {
      rawMilestones = children.slice(1);
    } else {
      yearText = secondChild;
      rawMilestones = children.slice(2);
    }
  }

  const milestones = rawMilestones.filter((milestone) => {
    const [, date, description] = milestone.children;
    const hasDate = date && date.textContent.trim().length > 0;
    const hasDescription =
      description && description.textContent.trim().length > 0;
    return hasDate && hasDescription;
  });

  if (milestones.length === 0) {
    if (!window.location.href.includes('author')) {
      block.remove();
    }
    return;
  }

  const container = document.createElement('div');
  container.className = 'historymilestones-container';

  const yearWrapper = document.createElement('div');
  yearWrapper.className = 'historymilestones-year';
  const yearDiv1 = document.createElement('div');
  yearDiv1.append(year.cloneNode(true));
  yearWrapper.append(yearDiv1);

  if (yearText) {
    const yearDiv2 = document.createElement('div');
    yearDiv2.append(yearText.cloneNode(true));
    yearWrapper.append(yearDiv2);
  }
  container.append(yearWrapper);

  const milestonesWrapper = document.createElement('div');
  milestonesWrapper.className = 'historymilestones-milestones';

  milestones.forEach((milestone) => {
    const [image, date, description, ctaContainer] = milestone.children;

    const milestoneDiv = document.createElement('div');
    milestoneDiv.className = 'historymilestones-milestone';

    const imageDiv = document.createElement('div');
    imageDiv.className = 'historymilestones-image';
    imageDiv.append(getImageNode(image));

    const contentDiv = document.createElement('div');
    contentDiv.className = 'historymilestones-content';

    const dateDiv = document.createElement('div');
    dateDiv.className = 'historymilestones-date';
    dateDiv.append(date.cloneNode(true));

    const descDiv = document.createElement('div');
    descDiv.className = 'historymilestones-description';
    descDiv.append(description.cloneNode(true));

    contentDiv.append(dateDiv, descDiv);

    if (ctaContainer) {
      const link = ctaContainer.querySelector('a');
      if (link && link.getAttribute('href')) {
        const cta = document.createElement('a');
        cta.className = 'historymilestones-cta';
        cta.href = link.getAttribute('href');
        cta.innerHTML = `
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" class="about-us-link-button">
            <path d="M24 1C36.7025 1 47 11.2975 47 24C47 36.7025 36.7025 47 24 47C11.2975 47 1 36.7025 1 24C1 11.2975 11.2975 1 24 1Z" stroke="#8D713E" stroke-width="2"/>
            <path d="M24.165 17.1323C24.3732 16.9453 24.6974 16.9581 24.8896 17.1606L30.7275 23.3218C31.0905 23.7048 31.0905 24.2961 30.7275 24.6792L24.8896 30.8393C24.6974 31.0421 24.3733 31.0549 24.165 30.8677C23.9569 30.6804 23.9437 30.3645 24.1357 30.1616L29.499 24.5005H17.5C17.2239 24.5005 17.0001 24.2765 17 24.0005C17 23.7243 17.2239 23.5005 17.5 23.5005H29.499L24.1357 17.8393C23.9435 17.6364 23.9568 17.3196 24.165 17.1323Z" fill="#8D713E"/>
          </svg>
        `; // Static SVG, safe
        contentDiv.append(cta);
      }
    }

    milestoneDiv.append(imageDiv, contentDiv);
    milestonesWrapper.append(milestoneDiv);
  });

  container.append(milestonesWrapper);
  block.replaceChildren(container);
  initHistoryMilestonesSlider(block);
}
