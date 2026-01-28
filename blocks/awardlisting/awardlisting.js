import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  if (!block || !block.children.length) return;
  
  block.classList.add('block', 'container', 'fade-item');
  
  // Get all children
  const children = Array.from(block.children);
  
  // Create awardlisting-wrapper
  const wrapper = document.createElement('div');
  wrapper.className = 'awardlisting-item-wrapper';
  
  // First child is the title
  const titleElement = children[0]?.querySelector('p') || children[0];
  if (titleElement && titleElement.textContent?.trim()) {
    const title = document.createElement('p');
    title.className = 'awardlisting-item-title';
    title.textContent = titleElement.textContent.trim();
    moveInstrumentation(titleElement, title);
    wrapper.appendChild(title);
  }
  
  // Create award-tile-wrapper for remaining children (award tiles)
  const awardTileWrapper = document.createElement('div');
  awardTileWrapper.className = 'award-tile-wrapper';
  
  // Process remaining children as award tiles (year + description pairs)
  const awardTiles = children.slice(1);
  
  awardTiles.forEach((tile) => {
    const tileChildren = Array.from(tile.children);
    const yearElement = tileChildren[0]?.querySelector('p') || tileChildren[0];
    const descriptionElement = tileChildren[1]?.querySelector('p') || tileChildren[1];
    
    if (yearElement || descriptionElement) {
      const awardTile = document.createElement('div');
      awardTile.className = 'award-tile';
      
      // Year
      if (yearElement && yearElement.textContent?.trim()) {
        const year = document.createElement('p');
        year.className = 'awardlisting-year';
        year.textContent = yearElement.textContent.trim();
        moveInstrumentation(yearElement, year);
        awardTile.appendChild(year);
      }
      
      // Description
      if (descriptionElement && descriptionElement.textContent?.trim()) {
        const description = document.createElement('p');
        description.className = 'awardlisting-description';
        description.textContent = descriptionElement.textContent.trim();
        moveInstrumentation(descriptionElement, description);
        awardTile.appendChild(description);
      }
      
      awardTileWrapper.appendChild(awardTile);
    }
  });
  
  // Append award-tile-wrapper to wrapper
  if (awardTileWrapper.children.length > 0) {
    wrapper.appendChild(awardTileWrapper);
  }
  
  // Clear block and append wrapper
  block.innerHTML = '';
  block.appendChild(wrapper);
}

