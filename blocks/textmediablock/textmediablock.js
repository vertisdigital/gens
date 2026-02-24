import ImageComponent from '../../shared-components/ImageComponent.js';
import stringToHtml, { isIOSDevice } from '../../shared-components/Utility.js';

// Function to fade out button smoothly
function fadeOutButton(button) {
  button.style.transition = 'opacity 0.5s ease-out';
  button.style.opacity = '0';
}

// Function to fade in button smoothly
function fadeInButton(button) {
  button.style.transition = 'opacity 0.5s ease-in';
  button.style.opacity = '1';
}

// Function to setup video functionality
function setupVideoFunctionality(autoPlay, mediaElement) {
  const video = mediaElement.querySelector('.mediablock-video');
  const playButton = mediaElement.querySelector('.custom-play-button');
  let isVideoLoaded = false;

  if (!video || !playButton) return;

  function togglePlayPause() {
    if (video.paused) {
      video.play();
      playButton.innerHTML = '⏸'; // Show pause icon
      fadeOutButton(playButton); // Hide button smoothly
    } else {
      video.pause();
      playButton.innerHTML = '▶'; // Change to play icon
      fadeInButton(playButton); // Show button smoothly
    }
  }

  // Toggle play/pause on button & video click
  [playButton, video].forEach((el) => el.addEventListener('click', togglePlayPause));

  // Show play button smoothly when video ends
  video.addEventListener('ended', () => {
    playButton.innerHTML = '▶';
    fadeInButton(playButton);
  });

  video.addEventListener('loadeddata', () => {
    mediaElement.querySelector('.video-loader').style.display = 'none';
    video.style.display = 'block';
    mediaElement.querySelector('.custom-play-button').style.visibility = 'visible';
  });

  // Pause video when out of viewport
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) {
        video.pause();
        playButton.innerHTML = '▶';
        fadeInButton(playButton);
      } else if (entry.isIntersecting && autoPlay) {
        if (!isVideoLoaded && !isIOSDevice()) {
          video.load();
          isVideoLoaded = true;
        }
        playButton.innerHTML = '⏸';
        video.muted = true;
        video.play();
        fadeOutButton(playButton);
      } else if (entry.isIntersecting) {
        if (!isVideoLoaded && !isIOSDevice()) {
          video.load();
          isVideoLoaded = true;
        }
      }
    },
    { threshold: 0.3 },
  );

  observer.observe(mediaElement);
}

function handleMediaElement(mediaBlock, enablegradient) {
  let autoPlay = false;
  const linkElement = mediaBlock.querySelector('a');
  if (!linkElement) return;

  mediaBlock.classList.add('mediablock');
  if (enablegradient) {
    mediaBlock.classList.add('has-gradient');
  }

  const mediaUrl = linkElement.getAttribute('href');
  if (!mediaUrl) return;

  const isVideo = /\.(mp4|webm|ogg)$/i.test(mediaUrl);
  let mediaElement = null;
  if (isVideo) {
    autoPlay = mediaBlock?.children[1]?.textContent?.trim() === 'true';
    if (mediaBlock?.children[1]) {
      mediaBlock.children[1].innerHTML = '';
    }
  }

  if (isVideo) {
    mediaElement = stringToHtml(`
      <div class="custom-video-container">
      <div class="video-loader"></div>
        <video class="mediablock-video" preload=${isIOSDevice() ? 'auto' : 'none'} playsinline autoplay=${isIOSDevice() ? 'true' : 'false'}>
          <source src="${mediaUrl}" type="video/mp4">
          Your browser does not support the video tag.
        </video>
        <button class="custom-play-button">▶</button>
      </div>
    `);
  } else {
    mediaElement = stringToHtml(
      ImageComponent({
        src: mediaUrl,
        alt: mediaBlock.querySelectorAll('a')[1]?.getAttribute('title') || '',
        className: 'mediablock-image',
        asImageName: 'hero.webp',
        breakpoints: {
          mobile: {
            width: 768, src: mediaUrl, imgWidth: 768,
          },
          tablet: {
            width: 1024, src: mediaUrl, imgWidth: 1024,
          },
          desktop: {
            width: 1920, src: mediaUrl, imgWidth: 1600,
          },
        },
        lazy: true,
      }),
    );
  }

  if (mediaElement) {
    linkElement.parentElement?.replaceChild(mediaElement, linkElement);
    if (mediaBlock?.children[1]) {
      mediaBlock.children[1].style.display = 'none';
    }
    if (isVideo) setupVideoFunctionality(autoPlay, mediaElement);
  }
}

// Function to apply styles to the text section
function decorateTextSection(textSection) {
  if (!textSection) return;
  textSection.classList.add('textblock', 'container');
  textSection.children[0]?.classList.add('heading');

  const textContentContainer = textSection.children[1];
  if (textContentContainer) {
    textContentContainer.classList.add('text-section');

    // Support user typing <br> in simple text fields
    textContentContainer.querySelectorAll('p').forEach((p) => {
      if (p.innerHTML.includes('&lt;br') || p.innerHTML.includes('\\n')) {
        p.innerHTML = p.innerHTML.replace(/&lt;br\s*\/?[ \t]*&gt;/gi, '<br>').replace(/\\n/g, '<br>');
      }
    });
  }
}

// Main function to decorate the block
export default function decorate(block) {
  block.classList.add('fade-item');
  block.className = 'textmediablock-container';

  let enablegradient = false;
  let gradientEl = block.querySelector('[data-aue-prop="enablegradient"], [data-gen-prop="enablegradient"]');

  if (!gradientEl) {
    gradientEl = Array.from(block.children).find((child) => {
      const text = child.textContent?.trim()?.toLowerCase();
      const hasMedia = child.querySelector('a, img, picture, video');

      if (hasMedia) return false;

      // Strict match for 'true' or 'false'
      if (text === 'true' || text === 'false') return true;

      // If block has 3 children and this row is empty with max 1 <p>,
      // it's the unconfigured boolean toggle from UAT
      if (block.children.length === 3 && text === '' && child.querySelectorAll('p').length <= 1) {
        return true;
      }

      return false;
    });
  }

  if (gradientEl) {
    const gradientP = gradientEl.querySelector('p') || gradientEl;
    enablegradient = gradientP?.textContent?.trim()?.toLowerCase() === 'true';
    if (gradientEl.parentNode === block || gradientEl.parentNode?.parentNode === block) {
      gradientEl.style.display = 'none'; // hide the toggle property element from displaying
    }
  }

  // Get only the actual content children by excluding gradientEl
  const contentChildren = Array.from(block.children).filter((child) => child !== gradientEl);

  // Check if the first child contains an image link
  const firstChild = contentChildren[0];
  const hasImageFirst = firstChild?.querySelector('a') !== null;

  if (hasImageFirst) {
    // Variation 1: Image first, then text
    handleMediaElement(firstChild, enablegradient);

    // Add classes to text section
    const textSection = contentChildren[1];
    decorateTextSection(textSection);
  } else {
    // Variation 2: Text first, then image
    const textSection = firstChild;
    const imageSection = contentChildren[1];

    decorateTextSection(textSection);

    if (imageSection) {
      handleMediaElement(imageSection, enablegradient);
    }
  }

  block.querySelectorAll('.text-section').forEach((textSection) => {
    if (!textSection.textContent.trim()) textSection.style.display = 'none';
  });
}
