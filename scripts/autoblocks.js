/**
 * Process all the tab auto blocks
 * @param {Element} main The container element
 */
function handleTabStyles(main) {
  try {
    const tabElements = main.querySelectorAll('div[data-tabtitle]');
    console.log('Found tab elements:', { count: tabElements.length });
    
    if (tabElements.length > 0) {
      // Create main container
      const tabsContainer = document.createElement('div');
      tabsContainer.className = 'tabs-container section tab-container';
      tabsContainer.setAttribute('data-section-status', 'loaded');
      tabsContainer.dataset.blockName = 'tabs';
      
      // Create tab navigation
      const tabNav = document.createElement('div');
      tabNav.className = 'tabs-header row';
      
      // Create content wrapper
      const tabWrapper = document.createElement('div');
      tabWrapper.className = 'tabs-content';
      
      // Process each tab section
      tabElements.forEach((section, index) => {
        const tabTitle = section.getAttribute('data-tabtitle');
        
        // Create tab button
        const tabButton = document.createElement('div');
        tabButton.className = 'tab-title';
        tabButton.dataset.index = index;
        tabButton.textContent = tabTitle;
        
        // Create tab panel
        const tabPanel = document.createElement('div');
        tabPanel.className = 'tab-panel';
        
        // Set initial active state
        if (index === 0) {
          tabButton.classList.add('active');
          tabPanel.classList.add('active');
        }
        
        // Clone and move content
        const clonedSection = section.cloneNode(true);
        tabPanel.appendChild(clonedSection);
        
        tabNav.appendChild(tabButton);
        tabWrapper.appendChild(tabPanel);
      });

      // Add click handler to tab navigation
      tabNav.addEventListener('click', (event) => {
        const tabButton = event.target.closest('.tab-title');
        if (!tabButton) return;
        
        const index = parseInt(tabButton.dataset.index, 10);
        if (Number.isNaN(index)) return;
        
        // Update tabs
        tabsContainer.querySelectorAll('.tab-title').forEach(btn => {
          btn.classList.remove('active');
        });
        tabButton.classList.add('active');
        
        // Update panels
        tabsContainer.querySelectorAll('.tab-panel').forEach(panel => {
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
