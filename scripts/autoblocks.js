/**
 * Process all the tab auto blocks
 * @param {Element} main The container element
 */
function handleTabStyles(main) {
  try {
    const tabElements = main.querySelectorAll('div[data-tabtitle]');
    console.log('Found tab elements:', tabElements.length);
    
    if (tabElements.length > 0) {
      const tabsContainer = document.createElement('div');
      tabsContainer.className = 'tabs-container section tab-container';
      tabsContainer.setAttribute('data-section-status', 'loaded');
      
      const tabNav = document.createElement('div');
      tabNav.className = 'tab-nav';
      tabNav.style.display = 'flex';
      
      const tabWrapper = document.createElement('div');
      tabWrapper.className = 'tab-wrapper';
      
      // Process each tab section
      tabElements.forEach((section, index) => {
        const titleText = section.getAttribute('data-tabtitle');
        console.log('Creating tab:', { index, title: titleText });
        
        const tabTitle = document.createElement('div');
        tabTitle.textContent = titleText;
        tabTitle.className = 'tab-title';
        tabTitle.setAttribute('data-tab-index', index);
        
        // Add click handler with debugging
        tabTitle.onclick = function() {
          console.log('Tab clicked:', {
            text: this.textContent,
            index: this.getAttribute('data-tab-index')
          });
          
          // Remove active class from all tabs and panels
          const allTabs = tabNav.querySelectorAll('.tab-title');
          const allPanels = tabWrapper.querySelectorAll('.tab');
          
          console.log('Found elements:', {
            tabs: allTabs.length,
            panels: allPanels.length
          });
          
          allTabs.forEach(tab => tab.classList.remove('active'));
          allPanels.forEach(panel => panel.classList.remove('active'));
          
          // Add active class to clicked tab and corresponding panel
          this.classList.add('active');
          allPanels[index].classList.add('active');
          
          console.log('Tab switch complete');
        };
        
        if (index === 0) tabTitle.classList.add('active');
        
        const clonedSection = section.cloneNode(true);
        clonedSection.classList.add('tab', 'block');
        clonedSection.setAttribute('data-block-name', 'tab');
        clonedSection.setAttribute('data-block-status', 'loaded');
        clonedSection.classList.toggle('active', index === 0);
        
        tabNav.appendChild(tabTitle);
        tabWrapper.appendChild(clonedSection);
      });

      tabsContainer.appendChild(tabNav);
      tabsContainer.appendChild(tabWrapper);
      tabElements.forEach(section => section.remove());
      main.prepend(tabsContainer);
      
      // Verify structure and handlers
      console.log('Final structure:', {
        container: tabsContainer,
        tabs: tabNav.querySelectorAll('.tab-title'),
        panels: tabWrapper.querySelectorAll('.tab'),
        handlers: tabNav.querySelectorAll('.tab-title').length
      });
    }
  } catch (error) {
    console.error('Error in handleTabStyles:', error);
    throw new Error(`Error in handleTabStyles: ${error.message}`);
  }
}

export default function processTabs(main) {
  handleTabStyles(main);
}
