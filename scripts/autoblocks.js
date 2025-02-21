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
      tabNav.className = 'tab-nav';
      
      // Create content wrapper
      const tabWrapper = document.createElement('div');
      tabWrapper.className = 'tab-wrapper';
      
      // Process each tab section
      tabElements.forEach((section, index) => {
        const tabTitle = section.getAttribute('data-tabtitle');
        
        const tabLink = document.createElement('a');
        tabLink.textContent = tabTitle;
        tabLink.href = '#';
        tabLink.className = 'tab-link';
        tabLink.setAttribute('data-tab-index', index);
        
        // Try different event binding approaches
        tabLink.addEventListener('click', function(e) {
          console.log('Click event fired');
          e.preventDefault();
          e.stopPropagation();
          
          // Get all tabs and content
          const allTabs = tabNav.querySelectorAll('.tab-link');
          const allContent = tabWrapper.querySelectorAll('.tab');
          
          // Remove active class from all
          allTabs.forEach(t => t.classList.remove('active'));
          allContent.forEach(c => c.classList.remove('active'));
          
          // Add active class to clicked tab and content
          this.classList.add('active');
          allContent[index].classList.add('active');
        }, true); // Use capture phase
        
        // Also try mousedown event
        tabLink.addEventListener('mousedown', function(e) {
          console.log('Mousedown event fired');
        });
        
        if (index === 0) tabLink.classList.add('active');
        
        const clonedSection = section.cloneNode(true);
        clonedSection.classList.add('tab', 'block');
        clonedSection.setAttribute('data-block-name', 'tab');
        clonedSection.setAttribute('data-block-status', 'loaded');
        clonedSection.classList.toggle('active', index === 0);
        
        tabNav.appendChild(tabLink);
        tabWrapper.appendChild(clonedSection);
      });

      // Also try click handler on container
      tabNav.addEventListener('click', function(e) {
        console.log('Tab nav container clicked', e.target);
      }, true);

      // Build final structure
      tabsContainer.appendChild(tabNav);
      tabsContainer.appendChild(tabWrapper);
      
      tabElements.forEach(section => section.remove());
      main.prepend(tabsContainer);
      
      console.log('Tab setup complete, testing click on first tab');
      // Test click programmatically
      const firstTab = tabNav.querySelector('.tab-link');
      if (firstTab) {
        firstTab.click();
      }
    }
  } catch (error) {
    throw new Error(`Error in handleTabStyles: ${error.message}`);
  }
}

export default function processTabs(main) {
  handleTabStyles(main);
}
