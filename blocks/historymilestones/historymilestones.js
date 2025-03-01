export default function decorate(block) {
  // Add container classes
  block.classList.add('container-xl', 'container-lg', 'container-md', 'container-sm');

  // Process milestone items
  const milestoneItems = block.querySelectorAll('div:nth-child(n+3)');
  milestoneItems.forEach((item) => {
    // Handle image
    const imgLink = item.querySelector('a');
    if (imgLink) {
      const img = document.createElement('img');
      img.src = imgLink.href;
      img.alt = '';
      img.loading = 'lazy';
      imgLink.parentElement.replaceChild(img, imgLink);
    }
  });

  // Add accessibility attributes
  block.setAttribute('role', 'region');
  block.setAttribute('aria-label', 'History and Milestones');
} 