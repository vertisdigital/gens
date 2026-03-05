function initTextLazyFadeIn() {
  const COMPONENT_SELECTOR = '.fade-item';

  const elements = document.querySelectorAll(COMPONENT_SELECTOR);
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    },
    {
      threshold: 0,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  const wrappersToAnimate = new Set();

  elements.forEach((el) => {
    if (el.closest('header')) return;
    if (el.closest('.header')) return;
    if (el.closest('.searchresult')) return;
    if (el.closest('.pagination')) return;

    // We animate the wrapper rather than the block to avoid white gaps due to `overflow: hidden`
    const wrapper = el.closest('[class*="-wrapper"], .section') || el;
    wrappersToAnimate.add(wrapper);

    // Remove the class from the inner block if we moved it to the wrapper
    if (wrapper !== el) {
      el.classList.remove('fade-item', 'cmp-fade-up');
    }
  });

  // Group adjacent wrappers if the first is a sectionheader-wrapper
  const wrappersArray = Array.from(wrappersToAnimate);
  const finalWrappers = new Set();

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < wrappersArray.length; i++) {
    const wCurrent = wrappersArray[i];

    if (wCurrent.classList.contains('sectionheader-wrapper') && (i + 1 < wrappersArray.length)) {
      const wNext = wrappersArray[i + 1];
      // Check if they are actually DOM siblings
      if (wCurrent.nextElementSibling === wNext) {
        const group = document.createElement('div');
        group.className = 'fade-group cmp-fade-up';
        wCurrent.parentNode.insertBefore(group, wCurrent);
        group.appendChild(wCurrent);
        group.appendChild(wNext);

        finalWrappers.add(group);
        // eslint-disable-next-line no-plusplus
        i++; // Skip the next wrapper since it's grouped
        // eslint-disable-next-line no-continue
        continue;
      }
    }

    wCurrent.classList.add('cmp-fade-up');
    finalWrappers.add(wCurrent);
  }

  finalWrappers.forEach((w) => observer.observe(w));
}

export default initTextLazyFadeIn;
