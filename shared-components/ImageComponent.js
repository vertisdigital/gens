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
    mobile: { width: 768, src: '', imgWidth: 1600, imgHeight: 1600 },
    tablet: { width: 993, src: '', imgWidth: 1600, imgHeight: 1600 },
    desktop: { width: 1920, src: '', imgWidth: 1600, imgHeight: 1600 },
  },
  lazy = true,
}) {
  // Extract file extension from the original src
  const fileExt = src.split('.').pop() || 'jpg';

  // Ensure breakpoints object is deeply copied to avoid mutation
  const updatedBreakpoints = JSON.parse(JSON.stringify(breakpoints));

  // Generate default breakpoint sources if not provided
  if (!updatedBreakpoints.mobile.src) {
    updatedBreakpoints.mobile.src = src.replace(`.${fileExt}`, `-mobile.${fileExt}`);
  }
  if (!updatedBreakpoints.tablet.src) {
    updatedBreakpoints.tablet.src = src.replace(`.${fileExt}`, `-tablet.${fileExt}`);
  }
  if (!updatedBreakpoints.desktop.src) {
    updatedBreakpoints.desktop.src = src;
  }

  // Ensure width and height exist for images, set default if missing
  ['mobile', 'tablet', 'desktop'].forEach((key) => {
    if (!updatedBreakpoints[key].imgWidth) {
      updatedBreakpoints[key].imgWidth = 1600;
    }
    if (!updatedBreakpoints[key].imgHeight) {
      updatedBreakpoints[key].imgHeight = 1600;
    }
  });

  // Generate new src for Adobe AEM image service
  if (asImageName) {
    updatedBreakpoints.mobile.src = `${src}/as/${asImageName}?width=${updatedBreakpoints.mobile.imgWidth}&height=${updatedBreakpoints.mobile.imgHeight}`;
    updatedBreakpoints.tablet.src = `${src}/as/${asImageName}?width=${updatedBreakpoints.tablet.imgWidth}&height=${updatedBreakpoints.tablet.imgHeight}`;
    updatedBreakpoints.desktop.src = `${src}/as/${asImageName}?width=${updatedBreakpoints.desktop.imgWidth}&height=${updatedBreakpoints.desktop.imgHeight}`;
  }

  return `
    <picture>
      <source media="(max-width: ${updatedBreakpoints.mobile.width}px)" 
              srcset="${updatedBreakpoints.mobile.src}">
      <source media="(max-width: ${updatedBreakpoints.tablet.width}px)" 
              srcset="${updatedBreakpoints.tablet.src}">
      <source media="(min-width: ${updatedBreakpoints.tablet.width + 1}px)" 
              srcset="${updatedBreakpoints.desktop.src}">
      <img src="${updatedBreakpoints.desktop.src}" 
           alt="${alt}" 
           title="${alt}"
           class="${className}"
           ${lazy ? 'loading="lazy"' : ''}
           width="${updatedBreakpoints.desktop.imgWidth}"
           height="${updatedBreakpoints.desktop.imgHeight}"
           />
    </picture>
  `;
}
