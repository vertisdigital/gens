import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  if (!block || !block.children.length) return;
  
  block.classList.add('block', 'container', 'fade-item');
  
  // Get all children - each child becomes an awardlisting-item
  const children = Array.from(block.children);
  
  // Clear block content
  block.innerHTML = '';
  
  // Process each child as an awardlisting-item
  children.forEach((child) => {
    const itemChildren = Array.from(child.children);
    
    // Create awardlisting-item
    const awardItem = document.createElement('div');
    awardItem.className = 'awardlisting-item';
    
    // First child is the title
    const titleElement = itemChildren[0]?.querySelector('p') || itemChildren[0];
    if (titleElement && titleElement.textContent?.trim()) {
      const title = document.createElement('p');
      title.className = 'awardlisting-item-title';
      title.textContent = titleElement.textContent.trim();
      moveInstrumentation(titleElement, title);
      awardItem.appendChild(title);
    }
    
    // Create award-tile-wrapper for remaining children (award tiles)
    const awardTileWrapper = document.createElement('div');
    awardTileWrapper.className = 'award-tile-wrapper';
    
    // Process remaining children as award tiles (year + description pairs)
    const awardTiles = itemChildren.slice(1);
    
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
    
    // Append award-tile-wrapper to awardlisting-item
    if (awardTileWrapper.children.length > 0) {
      awardItem.appendChild(awardTileWrapper);
    }
    
    // Append awardlisting-item to block
    block.appendChild(awardItem);
  });
}

