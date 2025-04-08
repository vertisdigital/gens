import ImageComponent from '../../shared-components/ImageComponent.js';
import stringToHtml from '../../shared-components/Utility.js';


function handleImageElement(mediaBlock) {
  const linkElement = mediaBlock.querySelector('a');
  if(linkElement){
    mediaBlock.classList.add('mediablock');
      const imageUrl = linkElement.getAttribute('href');
      const picture = ImageComponent({
        src: imageUrl,
        alt: mediaBlock.querySelectorAll('a')[1]?.getAttribute('title')||'',
        className: 'mediablock-image',
        asImageName: 'hero.webp',
        breakpoints: {
          mobile: {
            width: 768,
            src: `${imageUrl}`,
            imgWidth: 768
          },
          tablet: {
            width: 1024,
            src: `${imageUrl}`,
            imgWidth: 1024
          },
          desktop: {
            width: 1920,
            src: `${imageUrl}`,
            imgWidth: 1600
          },
        },
        lazy: true,
      });

      if (picture) {
        const imageElement = stringToHtml(picture);
        linkElement.parentElement.replaceChild(imageElement, linkElement);
      }
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
