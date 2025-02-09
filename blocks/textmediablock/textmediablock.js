function initTextMediaBlock() {
  const blocks = document.querySelectorAll('.textmediablock');
  
  blocks.forEach(block => {
    const layoutElement = block.querySelector('[data-aue-prop="layout"]');
    if (layoutElement) {
      // Set layout value as data attribute on main container
      const layoutValue = layoutElement.textContent.trim();
      block.setAttribute('data-layout', layoutValue);
      
      // Hide the layout text element since we're using it as data attribute
      layoutElement.parentElement.style.display = 'none';
    }

    // Handle image elements
    const mediaBlock = block.querySelector('[data-aue-model="media"]');
    if (mediaBlock) {
      const linkElement = mediaBlock.querySelector('a');
      if (linkElement) {
        const imageUrl = linkElement.href;
        // Create and insert image
        const img = document.createElement('img');
        img.src = imageUrl;
        
        // Accessibility improvements
        const heading = block.querySelector('[data-aue-prop="heading"]');
        img.alt = heading ? heading.textContent : 'Feature image'; // Use heading as alt text
        img.setAttribute('role', 'img');
        img.setAttribute('loading', 'lazy'); // Performance improvement
        
        linkElement.parentElement.replaceChild(img, linkElement);
      }
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

// Add to existing JS
function handleImageError(img) {
  img.onerror = () => {
    img.src = '/path/to/fallback-image.jpg';
    img.classList.add('image-load-error');
  };
}

function addLoadingState(block) {
  block.classList.add('is-loading');
  // Remove loading state once content is ready
  Promise.all([
    ...block.querySelectorAll('img')
  ].map(img => {
    return new Promise((resolve) => {
      if (img.complete) resolve();
      img.onload = resolve;
      img.onerror = resolve;
    });
  })).then(() => {
    block.classList.remove('is-loading');
  });
}