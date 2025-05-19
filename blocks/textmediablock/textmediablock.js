import ImageComponent from '../../shared-components/ImageComponent.js';
import stringToHtml from '../../shared-components/Utility.js';

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

  // Pause video when out of viewport
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) {
        video.pause();
        playButton.innerHTML = '▶';
        fadeInButton(playButton);
      } else if(entry.isIntersecting && autoPlay) {
        playButton.innerHTML = '⏸';
        video.muted = true;
        video.play();
        fadeOutButton(playButton);
      }
    },
    { threshold: 0.3 },
  );

  observer.observe(video);
}

// Function to handle media elements (Image/Video)
function handleMediaElement(mediaBlock) {
  let autoPlay = false;
  const linkElement = mediaBlock.querySelector('a');
  if (!linkElement) return;

  mediaBlock.classList.add('mediablock');
  const mediaUrl = linkElement.getAttribute('href');
  if (!mediaUrl) return;

  const isVideo = /\.(mp4|webm|ogg)$/i.test(mediaUrl);
  let mediaElement = null;
  if(isVideo) {
    autoPlay = mediaBlock?.children[1]?.textContent?.trim() === 'true';
    if(mediaBlock?.children[1]) {
      mediaBlock.children[1].innerHTML = '';
    }
  }

  if (isVideo) {
    mediaElement = stringToHtml(`
      <div class="custom-video-container">
        <video class="mediablock-video" playsinline>
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
            width: 768, src: mediaUrl, imgWidth: 768
          },
          tablet: {
            width: 1024, src: mediaUrl, imgWidth: 1024
          },
          desktop: {
            width: 1920, src: mediaUrl, imgWidth: 1600
          },
        },
        lazy: true,
      }),
    );
  }

  if (mediaElement) {
    linkElement.parentElement?.replaceChild(mediaElement, linkElement);
    if (isVideo) setupVideoFunctionality(autoPlay, mediaElement);
  }
}

// Function to apply styles to the text section
function decorateTextSection(textSection) {
  if (!textSection) return;
  textSection.classList.add('textblock');
  textSection.children[0]?.classList.add('heading');
  textSection.children[1]?.classList.add('text-section');
}

// Main function to decorate the block
export default function decorate(block) {
  block.className = 'container textmediablock-container';

  // Check if the first child contains an image link
  const firstChild = block.children[0];
  const hasImageFirst = firstChild.querySelector('a') !== null;

  if (hasImageFirst) {
    handleMediaElement(firstChild);
    decorateTextSection(block.children[1]);
  } else {
    decorateTextSection(firstChild);
    handleMediaElement(block.children[1]);
  }

  block.querySelectorAll('.text-section').forEach((textSection) => {
    if (!textSection.textContent.trim()) textSection.style.display = 'none';
  });
}