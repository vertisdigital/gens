import ImageComponent from '../../shared-components/ImageComponent.js';
import { getIcon } from '../../shared-components/icons/index.js';

/* ===================== */
/* Helpers               */
/* ===================== */

function getImageHTMl(image) {
  const imageLink = image.querySelector('a[href]');
  if (!imageLink) return '';

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
        src: imageUrl,
        imgHeight: 206,
        imgWidth: 361,
      },
      tablet: {
        width: 993,
        src: imageUrl,
        imgHeight: 206,
        imgWidth: 361,
      },
      desktop: {
        width: 1920,
        src: imageUrl,
        imgHeight: 206,
        imgWidth: 361,
      },
    },
    lazy: true,
  });

  const imageContainer = document.createElement('div');
  imageContainer.insertAdjacentHTML('beforeend', imageHtml);
  return imageContainer.outerHTML;
}

/* ===================== */
/* Slider logic          */
/* ===================== */

function initHistoryMilestonesSlider(block) {
  const section = block.closest('.section.historymilestones-container');
  if (
    !section ||
    section.dataset.historymilestonesSliderInitialized === 'true'
  ) {
    return;
  }

  const wrappers = Array.from(
    section.querySelectorAll('.historymilestones-wrapper'),
  );
  
  if (!wrappers.length) return;

  section.dataset.historymilestonesSliderInitialized = 'true';

  let activeIndex = 0;
  let yearButtons = [];
  let select;

  wrappers.forEach((wrapper, index) => {
    wrapper.classList.add('historymilestones-slide');
    wrapper.classList.toggle('is-active', index === activeIndex);
  });

// Count slide còn milestone hiển thị
const validSlides = wrappers.filter((wrapper) => {
  const visibleMilestone = wrapper.querySelector(
    '.historymilestones-milestone:not([style*="display: none"])'
  );
  return !!visibleMilestone;
});

if (validSlides.length <= 1) {
  prevButton.style.display = 'none';
  nextButton.style.display = 'none';
}

  /* ---------- navigation ---------- */

  const nav = document.createElement('div');
  nav.className = 'historymilestones-slider-nav';

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
  `;

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
  `;

  const yearsContainer = document.createElement('div');
  yearsContainer.className = 'historymilestones-nav-years';



  /* ---------- core slide function ---------- */
  const goToSlide = function (index) {
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

  /* ---------- year buttons ---------- */
  yearButtons = wrappers.map((wrapper, index) => {
    const yearEls = wrapper.querySelectorAll('p[data-gen-prop="title"]');
    let label = `Slide ${index + 1}`;

    Array.from(yearEls).some((p) => {
      const text = p.textContent.trim();
      if (text) {
        label = text;
        return true;
      }
      return false;
    });

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

  prevButton.addEventListener('click', () => {
    goToSlide(activeIndex - 1);
  });

  nextButton.addEventListener('click', () => {
    goToSlide(activeIndex + 1);
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

  nav.appendChild(prevButton);
  nav.appendChild(nextButton);

  section.insertBefore(timeline, section.querySelector('.historymilestones-wrapper'));
  section.insertBefore(nav, section.querySelector('.historymilestones-wrapper'));
}

/* ===================== */
/* Decorate              */
/* ===================== */

export default function decorate(block) {
  block.classList.add('fade-item');

  const [year, yearText, ...milestones] = block.children;

  const content = `
    <div class="historymilestones-container">
      <div class="historymilestones-year">
        <div>${year.outerHTML}</div>
        <div>${yearText.outerHTML}</div>
      </div>
      <div class="historymilestones-milestones">
        ${milestones
      .map((milestone) => {
        const [image, date, description] = milestone.children;
        
    const hasImage = image?.querySelector('a[href]');
    const hasDescription =
      description && description.textContent.trim().length > 0;

    // ❌ Nếu không có content hợp lệ → không render milestone này
    if (!hasImage || !hasDescription) {
      return '';}
        const ctaSvg = `
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" class="about-us-link-button">
          <path d="M24 1C36.7025 1 47 11.2975 47 24C47 36.7025 36.7025 47 24 47C11.2975 47 1 36.7025 1 24C1 11.2975 11.2975 1 24 1Z" stroke="#8D713E" stroke-width="2"/>
          <path d="M24.165 17.1323C24.3732 16.9453 24.6974 16.9581 24.8896 17.1606L30.7275 23.3218C31.0905 23.7048 31.0905 24.2961 30.7275 24.6792L24.8896 30.8393C24.6974 31.0421 24.3733 31.0549 24.165 30.8677C23.9569 30.6804 23.9437 30.3645 24.1357 30.1616L29.499 24.5005H17.5C17.2239 24.5005 17.0001 24.2765 17 24.0005C17 23.7243 17.2239 23.5005 17.5 23.5005H29.499L24.1357 17.8393C23.9435 17.6364 23.9568 17.3196 24.165 17.1323Z" fill="#8D713E"/>
        </svg>
            `;

        milestone.innerHTML = `
              <div class="historymilestones-milestone">
                <div class="historymilestones-image">
                  ${getImageHTMl(image)}
                </div>
                <div class="historymilestones-content">
                  <div class="historymilestones-date">
                    ${date.outerHTML}
                  </div>
                  <div class="historymilestones-description">
                    ${description.outerHTML}
                  </div>
                  ${(milestone.children[3] && milestone.children[3].querySelector('a')) ? `<a href="${milestone.children[3].querySelector('a')}" class="historymilestones-cta">
                    ${ctaSvg}
                  </a>` : ''}
                </div>
              </div>
            `;
        return milestone.outerHTML;
      })
      .join('')}
      </div>
    </div>
  `;

  block.innerHTML = content;
  initHistoryMilestonesSlider(block);
}
