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
    mobile: { width: 767, src: '', smartCrop: '' },
    tablet: { width: 991, src: '', smartCrop: '' },
    desktop: { width: 1920, src: '', smartCrop: '' },
  },
  lazy = true,
}) {
  // Ensure breakpoints object is deeply copied to avoid mutation
  const updatedBreakpoints = JSON.parse(JSON.stringify(breakpoints));

  if (asImageName) {
    const {
      mobile: { imgWidth: mobileWidth, imgHeight: mobileHeight },
      tablet: { imgWidth: tabletWidth, imgHeight: tabletHeight },
      desktop: { imgWidth: desktopWidth, imgHeight: desktopHeight },
    } = updatedBreakpoints || {};
    updatedBreakpoints.mobile.src = `${src}/as/${asImageName}${
      breakpoints.mobile.smartCrop
        ? `?smartcrop=${breakpoints.mobile.smartCrop}`
        : `?width=${mobileWidth}${mobileHeight ? `&height=${mobileHeight}` : ''}`
    }`;
    updatedBreakpoints.tablet.src = `${src}/as/${asImageName}${
      breakpoints.tablet.smartCrop
        ? `?smartcrop=${breakpoints.tablet.smartCrop}`
        : `?width=${tabletWidth}${mobileHeight ? `&height=${tabletHeight}` : ''}`
    }`;
    updatedBreakpoints.desktop.src = `${src}/as/${asImageName}${
      breakpoints.desktop.smartCrop
        ? `?smartcrop=${breakpoints.desktop.smartCrop}`
        : `?width=${desktopWidth}${mobileHeight ? `&height=${desktopHeight}` : ''}`
    }`;
  } else {
    updatedBreakpoints.desktop.src = `${src}/as/img.webp`;
    updatedBreakpoints.tablet.src = `${src}/as/img.webp`;
    updatedBreakpoints.mobile.src = `${src}/as/img.webp`;
  }

  return `
    <picture>
      <source media="(min-width: 993px)" 
              srcset="${updatedBreakpoints.desktop.src}">
      <source media="(min-width: 768px)" 
              srcset="${updatedBreakpoints.tablet.src}">
      <source media="(min-width: 320px)" 
              srcset="${updatedBreakpoints.mobile.src}">             
      <img src="${src}" 
           alt="${alt}" 
           title="${alt}"
           class="${className}"
           ${lazy ? 'loading="lazy"' : ''}
      />
    </picture>
  `;
}
