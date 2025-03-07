function handleImageElement(mediaBlock) {
  const linkElement = mediaBlock.querySelector('a');
  if (linkElement) {
    const imageUrl = linkElement.href;
    const img = document.createElement('img');
    img.src = imageUrl;

    // Set alt text from heading
    const heading = mediaBlock.parentElement.querySelector('[data-aue-prop="heading"], .section-inner-2-1-2-1-1');
    img.alt = heading ? heading.textContent : 'Feature image';

    // Add loading optimization
    img.setAttribute('loading', 'lazy');
    mediaBlock.classList.add('mediablock');

    // Replace link with image
    linkElement.parentElement.replaceChild(img, linkElement);
  }
}
export default function decorate(block) {
  block.className = 'container textmediablock-container';

  // Determine block variation by checking first child
  const firstChild = block.children[0];
  const hasImageFirst = firstChild.querySelector('a') !== null;

  if (hasImageFirst) {
    // Variation 1: Image first, then text
    handleImageElement(firstChild);

    // Add classes to text section
    const textSection = block.children[1];
    if (textSection) {
      textSection.classList.add('textblock');
      textSection.children[0]?.classList.add('heading');
      textSection.children[1]?.classList.add('text-section');
    }
  } else {
    // Variation 2: Text first, then image
    const textSection = firstChild;
    const imageSection = block.children[1];

    textSection.classList.add('textblock');
    textSection.children[0]?.classList.add('heading');
    textSection.children[1]?.classList.add('text-section');

    if (imageSection) {
      handleImageElement(imageSection);
    }
  }

  block.querySelectorAll('.text-section').forEach((textSection) => {
    if (!textSection.textContent.trim()) {
      textSection.style.display = 'none';
    }
  });
}
