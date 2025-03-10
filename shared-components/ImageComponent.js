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
    mobile: { width: 768, src: '', imgWidth: '', cropRatio:''},
    tablet: { width: 992, src: '', imgWidth: '', cropRatio:'' },
    desktop: { width: 1920, src: '', imgWidth: '', cropRatio:'' },
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
              srcset="${breakpoints.mobile.src}/as/${asImageName}${breakpoints.mobile.cropRatio ? `?crop=${breakpoints.mobile.cropRatio}` : ''}${breakpoints.mobile.imgWidth ? `&width=${breakpoints.mobile.imgWidth}`: '&width=500'}">
      <source media="(max-width: ${breakpoints.tablet.width}px)" 
              srcset="${breakpoints.tablet.src}/as/${asImageName}${breakpoints.tablet.cropRatio ? `?crop=${breakpoints.tablet.cropRatio}` : ''}${breakpoints.tablet.imgWidth ? `&width=${breakpoints.tablet.imgWidth}`: '&width=800'}">
      <source media="(min-width: ${breakpoints.desktop.width + 1}px)" 
              srcset="${breakpoints.desktop.src}/as/${asImageName}${breakpoints.desktop.cropRatio ? `?crop=${breakpoints.desktop.cropRatio}` : ''}${breakpoints.desktop.imgWidth ? `&width=${breakpoints.desktop.imgWidth}`: '&width=1600'}">             
      <img src="${src}" 
           alt="${alt}" 
           title="${alt}"
           class="${className}"
           ${lazy ? 'loading="lazy"' : ''}
           />
    </picture>
  `;
}
