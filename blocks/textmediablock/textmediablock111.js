function initTextMediaBlock() {
  const blocks = document.querySelectorAll('.textmediablock');
  
  blocks.forEach(block => {
    // Add loading state at start
    block.classList.add('is-loading');

    // Check layout and add appropriate class
    const layoutElement = block.querySelector('[data-aue-prop="layout"]');
    if (layoutElement) {
      const layoutValue = layoutElement.textContent.trim();
      block.setAttribute('data-layout', layoutValue);
      layoutElement.parentElement.style.display = 'none';
    }

    // Handle image elements
    const mediaBlock = block.querySelector('[data-aue-model="media"]');
    if (mediaBlock) {
      const linkElement = mediaBlock.querySelector('a');
      if (linkElement) {
        const imageUrl = linkElement.href;
        const img = document.createElement('img');
        img.src = imageUrl;
        
        // Accessibility improvements
        const heading = block.querySelector('[data-aue-prop="heading"]');
        img.alt = heading ? heading.textContent : 'Feature image';
        img.setAttribute('role', 'img');
        img.setAttribute('loading', 'lazy');

        // Handle image errors
        img.onerror = () => {
          img.src = '/assets/fallback-image.jpg';
          img.classList.add('image-load-error');
          block.classList.remove('is-loading');
        };

        // Handle image load
        img.onload = () => {
          block.classList.remove('is-loading');
        };
        
        linkElement.parentElement.replaceChild(img, linkElement);
      }
    }

    // Add classes to text section
    const textSection = block.querySelector('[data-aue-model="textsection"]');
    if (textSection) {
      textSection.classList.add('textmediablock__content');
    }

    const description = block.querySelector('[data-richtext-prop="description"]');
    if (description) {
      description.classList.add('textmediablock__description');
    }

    // Add ARIA attributes for better screen reader support
    block.setAttribute('role', 'region');
    block.setAttribute('aria-label', block.querySelector('[data-aue-prop="heading"]')?.textContent || 'Text media section');
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTextMediaBlock);
} else {
  initTextMediaBlock();
}