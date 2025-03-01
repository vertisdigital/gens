import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  // Add container classes only if not in tabs
  if (!block.closest('.tabs')) {
    block.classList.add('container-xl', 'container-lg', 'container-md', 'container-sm');
  }

  // Process each year block separately.
  const yearBlocks = block.querySelectorAll('div:nth-child(odd)'); // Selects 1st, 3rd, 5th etc divs (years)

  yearBlocks.forEach(yearBlock => {
    const descriptionBlock = yearBlock.nextElementSibling; // Gets the description block (even divs)
    if (!descriptionBlock) return; // If no description block, skip

    const milestoneItems = Array.from(descriptionBlock.querySelectorAll(':scope > div')); // Direct children divs

    milestoneItems.forEach(item => {
      const imageLink = item.querySelector('a');

      // Create picture element for the image and replace link
      if (imageLink) {
        const picture = createOptimizedPicture(imageLink.href, '', false, [
          { media: '(min-width: 768px)', width: '400' },
          { width: '320' },
        ]);

        // Replace the link with the optimized picture
        imageLink.parentNode.replaceChild(picture, imageLink);
      }
    });
  });


  // Add accessibility attributes
  block.setAttribute('role', 'region');
  block.setAttribute('aria-label', 'History and Milestones');
}