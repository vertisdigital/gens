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
      <source media="(max-width: 767px)" 
              srcset="${breakpoints.mobile.src}/as/${asImageName ? asImageName : 'img.webp'}${breakpoints.mobile.smartCrop ? `?smartcrop=${breakpoints.mobile.smartCrop}` : ''}">
      <source media="(max-width: 991px)" 
              srcset="${breakpoints.tablet.src}/as/${asImageName ? asImageName : 'img.webp'}${breakpoints.tablet.smartCrop ? `?smartcrop=${breakpoints.tablet.smartCrop}` : ''}">
      <source media="(max-width: 1920px)" 
              srcset="${breakpoints.desktop.src}/as/${asImageName ? asImageName : 'img.webp'}${breakpoints.desktop.smartCrop ? `?smartcrop=${breakpoints.desktop.smartCrop}` : ''}">             
      <img src="${src}" 
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