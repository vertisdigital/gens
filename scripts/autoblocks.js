/**
 * Process all the tab auto blocks
 * @param {Element} main The container element
 */
function handleTabStyles(main) {
  try {
    const tabElements = main.querySelectorAll('div[data-tabtitle]');
    console.log('Found tab elements:', {
      count: tabElements.length,
      elements: tabElements
    });
    
    if (tabElements.length > 0) {
      const tabsContainer = document.createElement('div');
      tabsContainer.className = 'tabs-container section tab-container';
      tabsContainer.setAttribute('data-section-status', 'loaded');
      
      const tabNav = document.createElement('div');
      tabNav.className = 'tab-nav';
      
      const tabWrapper = document.createElement('div');
      tabWrapper.className = 'tab-wrapper';
      
      tabElements.forEach((section, index) => {
        const tabTitle = section.getAttribute('data-tabtitle');
        console.log(`Creating tab ${index}:`, { tabTitle });
        
        const tabLink = document.createElement('a');
        tabLink.textContent = tabTitle;
        tabLink.href = '#';
        tabLink.className = 'tab-link';
        tabLink.setAttribute('data-tab-index', index);
        if (index === 0) tabLink.classList.add('active');
        
        // Modified click handler
        tabLink.onclick = function(e) {  // Using function instead of arrow for proper 'this' binding
          e.preventDefault();
          e.stopPropagation();  // Stop event bubbling
          
          console.log(`Tab clicked: ${tabTitle} (index: ${index})`);
          
          // Get all tabs and content
          const allLinks = tabNav.getElementsByClassName('tab-link');
          const allTabs = tabWrapper.getElementsByClassName('tab');
          
          // Remove active class from all
          Array.from(allLinks).forEach(link => link.classList.remove('active'));
          Array.from(allTabs).forEach(tab => tab.classList.remove('active'));
          
          // Add active class to clicked tab and content
          this.classList.add('active');
          allTabs[index].classList.add('active');
        };
        
        tabNav.appendChild(tabLink);
        
        const clonedSection = section.cloneNode(true);
        clonedSection.classList.add('tab', 'block');
        clonedSection.setAttribute('data-block-name', 'tab');
        clonedSection.setAttribute('data-block-status', 'loaded');
        clonedSection.classList.toggle('active', index === 0);
        tabWrapper.appendChild(clonedSection);
      });

      tabsContainer.appendChild(tabNav);
      tabsContainer.appendChild(tabWrapper);
      
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
