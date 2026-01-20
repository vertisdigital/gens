function initTextLazyFadeIn() {
  const TEXT_SELECTORS = `
    h1, h2, h3, h4, h5, h6,
    p,
    li,
    a,
    span,
    strong,
    em,
    .button,
    .image-container,
    .section-header-right,
    .scroll-text,
    .hero-description,
    .masthead-scroll-hint,
    .projectcards-header-right,
    .learn-button
  `;

  const elements = document.querySelectorAll(TEXT_SELECTORS);

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

    if (!el.textContent.trim()) return;

    if (el.closest('.text-fade-in')) return;

    el.classList.add('text-fade-in');
    observer.observe(el);
  });
}

export default initTextLazyFadeIn;
