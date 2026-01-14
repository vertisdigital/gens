import { getIcon } from '../../shared-components/icons/index.js';/**
 * Decorates the divider block
 * @param {Element} block The divider block element
 */
export default function decorate(block) {
  // Read dividerType from component model
  // Try multiple selectors to find dividerType in both authoring and publishing mode
  const dividerTypeEl = block.querySelector('[data-aue-prop="dividertype"]')
    || block.querySelector('[data-gen-prop="dividerType"]')
    || (block.children[0]?.textContent?.trim() ? block.children[0] : null);
  
  let dividerType = ''; // Default value
  
  if (dividerTypeEl) {
    // Get value from data attribute element or text content
    const dividerTypeValue = dividerTypeEl.textContent?.trim() || dividerTypeEl.getAttribute('value') || '';
    
    if (dividerTypeValue === 'divider-brand' || dividerTypeValue.toLowerCase() === 'divider-brand') {
      dividerType = 'divider-brand';
    }
    
    // Remove the element after reading the value
    if (dividerTypeEl.parentNode === block || dividerTypeEl.parentNode?.parentNode === block) {
      dividerTypeEl.remove();
    }
  }
  
  // Apply the className to the block
  block.className = `divider ${dividerType}`;
  
  // Clear any remaining content
  block.textContent = '';
  
  if (dividerType === 'divider-brand') {
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
