/**
 * Process all the tab auto blocks
 * @param {Element} main The container element
 */
function handleTabStyles(main) {
  try {
    const tabElements = main.querySelectorAll('div[data-tabtitle]');
    
    if (tabElements.length > 0) {
      // Create main container
      const tabsContainer = document.createElement('div');
      tabsContainer.className = 'tabs-container section tab-container';
      tabsContainer.setAttribute('data-section-status', 'loaded');
      
      // Create tab navigation
      const tabNav = document.createElement('div');
      tabNav.className = 'tab-nav';  // Keep original class for styling
      
      // Create content wrapper
      const tabWrapper = document.createElement('div');
      tabWrapper.className = 'tab-wrapper';  // Keep original class for styling
      
      // Process each tab section
      tabElements.forEach((section, index) => {
        const tabTitle = section.getAttribute('data-tabtitle');
        
        // Create tab link (not div)
        const tabLink = document.createElement('a');
        tabLink.textContent = tabTitle;
        tabLink.href = '#';
        tabLink.className = 'tab-link';  // Keep original class for styling
        tabLink.setAttribute('data-tab-index', index);
        if (index === 0) tabLink.classList.add('active');
        
        // Create tab content
        const clonedSection = section.cloneNode(true);
        clonedSection.classList.add('tab', 'block');
        clonedSection.setAttribute('data-block-name', 'tab');
        clonedSection.setAttribute('data-block-status', 'loaded');
        clonedSection.classList.toggle('active', index === 0);
        
        tabNav.appendChild(tabLink);
        tabWrapper.appendChild(clonedSection);
      });

      // Add click handler to tab navigation
      tabNav.addEventListener('click', (event) => {
        const tabLink = event.target.closest('.tab-link');
        if (!tabLink) return;
        
        event.preventDefault();
        
        const index = parseInt(tabLink.getAttribute('data-tab-index'), 10);
        if (Number.isNaN(index)) return;
        
        // Update tabs
        tabNav.querySelectorAll('.tab-link').forEach(link => {
          link.classList.remove('active');
        });
        tabLink.classList.add('active');
        
        // Update panels
        tabWrapper.querySelectorAll('.tab').forEach(panel => {
          panel.classList.remove('active');
        });
        
        const activePanel = tabWrapper.children[index];
        if (activePanel) {
          activePanel.classList.add('active');
        }
      });

      // Build final structure
      tabsContainer.appendChild(tabNav);
      tabsContainer.appendChild(tabWrapper);
      
      // Replace original content
      tabElements.forEach(section => section.remove());
      main.prepend(tabsContainer);
    }
  } catch (error) {
    throw new Error(`Error in handleTabStyles: ${error.message}`);
  }
}

export default function processTabs(main) {
  handleTabStyles(main);
}
