function initTextMediaBlock() {
  const blocks = document.querySelectorAll('.textmediablock');

  blocks.forEach((block) => {
    block.className = 'container-xl container-md container-sm textmediablock-container';

    // Handle image elements
    const mediaBlock = block.children[0];
    if (mediaBlock) {
      const linkElement = mediaBlock.querySelector('a');
      if (linkElement) {
        const imageUrl = linkElement.href;
        const img = document.createElement('img');
        img.src = imageUrl;

        // Set alt text from heading
        const heading = block.querySelector('[data-aue-prop="heading"], .section-inner-2-1-2-1-1');
        img.alt = heading ? heading.textContent : 'Feature image';

        // Add loading optimization
        img.setAttribute('loading', 'lazy');

        // Replace link with image
        linkElement.parentElement.replaceChild(img, linkElement);
      }
    }
    block.children[1].classList.add('textblock');
    //heading sesction
    block.children[1].children[0].classList.add('heading');
    //text sesction
    block.children[1].children[1].classList.add('textsection');
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTextMediaBlock);
} else {
  initTextMediaBlock();
}
