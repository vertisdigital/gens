import { getIcon } from '../../shared-components/icons/index.js';/**
 * Decorates the divider block
 * @param {Element} block The divider block element
 */
export default function decorate(block) {
  // Read className prop from block content
  // The className prop is typically in the first child's text content
  let className = ''; // Default class name
  
  // Check if there's a className prop in the block content
  if (block.children.length > 0) {
    const firstChild = block.children[0];
    const classNameText = firstChild.textContent?.trim().toLowerCase();
    
    // Check if className prop is specified
    if (classNameText === 'divider-brand' || classNameText === 'dividerbrand') {
      className = 'divider-brand';
      // Remove the className prop element
      firstChild.remove();
    } else if (firstChild.textContent?.trim()) {
      // If there's text but not divider-brand, keep default and remove it
      firstChild.remove();
    }
  }
  
  // Apply the className to the block
  block.className = `divider ${className}`;
  
  // Clear any remaining content
  block.textContent = '';
  
  if (className === 'divider-brand') {
    // Create divider-brand structure: container with lines and central icon
    const dividerElement = document.createElement('div');
    dividerElement.className = 'divider-element';
    
    // Create left line
    const leftLine = document.createElement('div');
    leftLine.className = 'divider-line divider-line-left';
    dividerElement.appendChild(leftLine);
    
    // Create center icon container
    const iconContainer = document.createElement('div');
    iconContainer.className = 'divider-icon-container';
    // Create brand rings icon (4 interconnected circles forming a square pattern)
    
    const iconSvg = getIcon('brandRings');
    iconContainer.innerHTML = iconSvg;
    dividerElement.appendChild(iconContainer);
    
    // Create right line
    const rightLine = document.createElement('div');
    rightLine.className = 'divider-line divider-line-right';
    dividerElement.appendChild(rightLine);
    
    block.appendChild(dividerElement);
  } else {
    // Default divider - simple border
    const dividerElement = document.createElement('div');
    dividerElement.className = 'divider-element';
    block.appendChild(dividerElement);
  }
}
