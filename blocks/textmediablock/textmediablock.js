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
        img.alt = ''; // Alt text should come from AEM
        linkElement.parentElement.replaceChild(img, linkElement);
      }
    }
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTextMediaBlock);
} else {
  initTextMediaBlock();
} 