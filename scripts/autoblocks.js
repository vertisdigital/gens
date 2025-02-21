/**
 * Process all the tab auto blocks
 * @param {Element} main The container element
 */
function handleTabStyles(main) {
  try {
    const tabElements = main.querySelectorAll('div[data-tabtitle]');
    
    if (tabElements.length > 0) {
      const tabsContainer = document.createElement('div');
      tabsContainer.className = 'tabs-container section tab-container';
      tabsContainer.setAttribute('data-section-status', 'loaded');
      
      const tabNav = document.createElement('div');
      tabNav.className = 'tab-nav';
      
      const tabWrapper = document.createElement('div');
      tabWrapper.className = 'tab-wrapper';
      
      // Create all tabs first, then add event listeners
      const tabs = [];
      
      tabElements.forEach((section, index) => {
        const tabTitle = section.getAttribute('data-tabtitle');
        
        const tabLink = document.createElement('a');
        tabLink.textContent = tabTitle;
        tabLink.href = '#';
        tabLink.className = 'tab-link';
        tabLink.setAttribute('data-tab-index', index);
        if (index === 0) tabLink.classList.add('active');
        
        // Add click handler immediately after creating the link
        tabLink.addEventListener('click', (e) => {
          e.preventDefault();
          
          // Debug click event
          const clickedIndex = index;
          const clickedTitle = tabTitle;
          console.log(`Tab clicked: ${clickedTitle} (index: ${clickedIndex})`);
          
          // Remove active class from all tabs
          tabNav.querySelectorAll('.tab-link').forEach(link => {
            link.classList.remove('active');
          });
          tabLink.classList.add('active');
          
          // Show/hide content
          tabWrapper.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
          });
          tabWrapper.children[index].classList.add('active');
        });
        
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
