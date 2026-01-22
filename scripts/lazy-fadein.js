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
      threshold: 0.2,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  elements.forEach((el) => {
    if (el.closest('header')) return;
    if (el.closest('.header')) return;
    if (el.closest('.searchresult')) return;
    if (el.closest('.pagination')) return;

    el.classList.add('cmp-fade-up');
    observer.observe(el);
  });
}

export default initTextLazyFadeIn;
