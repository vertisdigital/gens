/**
 * Creates a responsive image element with different resolutions
 * @param {Object} props Component properties
 * @param {string} props.src Main image source URL
 * @param {string} props.alt Image alt text
 * @param {string} props.className CSS class names
 * @param {string} props.asImageName Image Type
 * @param {Object} [props.breakpoints] Breakpoint configurations
 * @param {boolean} [props.lazy=true] Whether to use lazy loading
 * @returns {string} HTML string for the responsive image
 */
export default function ImageComponent({
  src,
  alt,
  className = '',
  asImageName = '',
  breakpoints = {
    mobile: { width: 767, src: '', smartCrop: ''},
    tablet: { width: 991, src: '', smartCrop: '' },
    desktop: { width: 1920, src: '', smartCrop: '' },
  },
  lazy = true,
}) {
  // Extract file extension from the original src
  const fileExt = src.split('.').pop();

  // Generate default breakpoint sources if not provided
  if (!breakpoints.mobile.src) {
    breakpoints.mobile.src = src.replace(`.${fileExt}`, `-mobile.${fileExt}`);
  }
  if (!breakpoints.tablet.src) {
    breakpoints.tablet.src = src.replace(`.${fileExt}`, `-tablet.${fileExt}`);
  }
  if (!breakpoints.desktop.src) {
    breakpoints.desktop.src = src;
  }

  return `
    <picture>
      <source media="(max-width: ${breakpoints.mobile.width}px)" 
              srcset="${breakpoints.mobile.src}/as/${asImageName ? asImageName : 'img.webp'}${breakpoints.mobile.smartCrop ? `?smartcrop=${breakpoints.mobile.smartCrop}` : ''}">
      <source media="(max-width: ${breakpoints.tablet.width}px)" 
              srcset="${breakpoints.tablet.src}/as/${asImageName ? asImageName : 'img.webp'}${breakpoints.tablet.smartCrop ? `?smartcrop=${breakpoints.tablet.smartCrop}` : ''}">
      <source media="(max-width: ${breakpoints.desktop.width}px)" 
              srcset="${breakpoints.desktop.src}/as/${asImageName ? asImageName : 'img.webp'}${breakpoints.desktop.smartCrop ? `?smartcrop=${breakpoints.desktop.smartCrop}` : ''}">             
      <img src="${src}" 
           alt="${alt}" 
           title="${alt}"
           class="${className}"
           ${lazy ? 'loading="lazy"' : ''}
           />
    </picture>
  `;
}