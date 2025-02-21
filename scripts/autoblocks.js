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
        const tabTitle = section.getAttribute('data-tabtitle');
        console.log('Creating tab:', { index, title: tabTitle });
        
        const tabTitle = document.createElement('div');
        tabTitle.textContent = tabTitle;
        tabTitle.className = 'tab-title';
        tabTitle.setAttribute('data-tab-index', index);
        if (index === 0) tabTitle.classList.add('active');
        
        const clonedSection = section.cloneNode(true);
        clonedSection.classList.add('tab', 'block');
        clonedSection.setAttribute('data-block-name', 'tab');
        clonedSection.setAttribute('data-block-status', 'loaded');
        clonedSection.classList.toggle('active', index === 0);
        
        tabNav.appendChild(tabTitle);
        tabWrapper.appendChild(clonedSection);
      });

      // Build structure first
      tabsContainer.appendChild(tabNav);
      tabsContainer.appendChild(tabWrapper);
      tabElements.forEach(section => section.remove());
      main.prepend(tabsContainer);

      // Add click handler after DOM is in place
      const handleTabClick = (e) => {
        const clickedTab = e.target.closest('.tab-title');
        if (!clickedTab) return;
        
        console.log('Tab clicked:', clickedTab.textContent);

        const index = parseInt(clickedTab.getAttribute('data-tab-index'), 10);
        
        // Update tabs
        const allTabs = tabNav.querySelectorAll('.tab-title');
        allTabs.forEach(tab => tab.classList.remove('active'));
        clickedTab.classList.add('active');

        // Update panels
        const allPanels = tabWrapper.querySelectorAll('.tab');
        allPanels.forEach(panel => panel.classList.remove('active'));
        allPanels[index].classList.add('active');
      };

      // Bind click handler
      tabNav.addEventListener('click', handleTabClick);
      
      // Log final structure
      console.log('Tab structure:', {
        container: tabsContainer.outerHTML,
        tabs: tabNav.querySelectorAll('.tab-title').length,
        panels: tabWrapper.querySelectorAll('.tab').length
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
