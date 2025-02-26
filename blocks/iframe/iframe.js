export default function decorate(block) {
  block.className = 'iframe-container';
  
  const link = block.querySelector('a');
  if (!link?.href) {
    console.warn('Iframe block is missing a URL');
    return;
  }

  const iframe = document.createElement('iframe');
  iframe.src = link.href;
  iframe.title = link.textContent.trim() || 'Embedded content';
  iframe.setAttribute('loading', 'lazy');
  iframe.setAttribute('width', '100%');
  iframe.setAttribute('height', '100%');
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('allowfullscreen', '');
  
  // Add sandbox attributes for security while allowing necessary features
  iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-popups');
  
  // Add error handling
  iframe.onerror = () => {
    console.warn(`Failed to load iframe content from: ${link.href}`);
    const errorMessage = document.createElement('div');
    errorMessage.className = 'iframe-error';
    errorMessage.textContent = 'Content temporarily unavailable';
    iframe.replaceWith(errorMessage);
  };

  link.replaceWith(iframe);
}