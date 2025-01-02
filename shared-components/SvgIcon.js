import { getIcon } from './icons/index.js';

/**
 * Creates an SVG icon element
 * @param {Object} props Component properties
 * @param {string} props.name Icon name
 * @param {string} props.className CSS class names
 * @param {string} props.size Icon size (width/height)
 * @param {string} props.color Icon color
 * @returns {string} HTML string for the SVG icon
 */
export default function SvgIcon({
  name,
  className = '',
  size = '24',
  color = 'currentColor',
}) {
  const iconSvg = getIcon(name);
  if (!iconSvg) {
    console.warn(`Icon "${name}" not found`);
    return '';
  }

  // Replace default size with custom size
  const sizedIcon = iconSvg
    .replace(/width="([^"]+)"/, `width="${size}"`)
    .replace(/height="([^"]+)"/, `height="${size}"`);

  return `
    <span class="icon-wrapper ${className}" style="color: ${color}">
      ${sizedIcon}
    </span>
  `;
}
