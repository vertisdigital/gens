/**
 * Process all the tab auto blocks
 * @param {Element} main The container element
 */
export default function processTabs(main, moveInstrumentation) {
  const sections = [
    ...main.querySelectorAll('[data-aue-model="tabs"]'),
  ];
  
  if (!sections.length) return;

  sections.forEach((tabSection) => {
    // Skip if this is a nested tab
    if (tabSection.closest('[data-aue-model="tabs"]') !== tabSection) {
      return;
    }

    // Ensure tab section has the required classes
    tabSection.classList.add('tabs', 'block');
    
    // Create container structure
    const tabsWrapper = document.createElement('div');
    tabsWrapper.classList.add('tabs-container');

    const tabsNav = document.createElement('div');
    tabsNav.classList.add('tabs-header');

    const tabsContent = document.createElement('div');
    tabsContent.classList.add('tabs-content');

    // Get all direct children excluding metadata
    const tabBlocks = Array.from(tabSection.children).filter(child => 
      !child.classList.contains('section-metadata')
    );

    // Create tabs for each block
    tabBlocks.forEach((block, index) => {
      // Create tab button
      const tabButton = document.createElement('button');
      tabButton.classList.add('tab-title');
      tabButton.textContent = `Tab ${index + 1}`;
      tabButton.dataset.index = index.toString();

      // Create tab panel
      const tabPanel = document.createElement('div');
      tabPanel.classList.add('tab-panel');

      // Set initial active state for first tab
      if (index === 0) {
        tabButton.classList.add('active');
        tabPanel.classList.add('active');
      }

      // Move the content to panel
      tabPanel.appendChild(block);

      // Add button to nav and panel to content
      tabsNav.appendChild(tabButton);
      tabsContent.appendChild(tabPanel);
    });

    // Add click handlers with event delegation
    tabsWrapper.addEventListener('click', (event) => {
      const clickedTab = event.target.closest('.tab-title');
      if (!clickedTab) return;

      const index = parseInt(clickedTab.dataset.index, 10);
      const allTabs = tabsNav.querySelectorAll('.tab-title');
      const allPanels = tabsContent.querySelectorAll('.tab-panel');

      allTabs.forEach(tab => tab.classList.remove('active'));
      allPanels.forEach(panel => panel.classList.remove('active'));

      clickedTab.classList.add('active');
      allPanels[index].classList.add('active');
    });

    // Assemble the tabs structure
    tabsWrapper.appendChild(tabsNav);
    tabsWrapper.appendChild(tabsContent);

    // Clear original content except metadata
    const metadata = tabSection.querySelector('.section-metadata');
    tabSection.innerHTML = '';
    if (metadata) {
      tabSection.appendChild(metadata);
    }
    
    // Add the new structure
    tabSection.appendChild(tabsWrapper);

    // Move instrumentation if needed
    if (moveInstrumentation) {
      moveInstrumentation(tabSection, tabsWrapper);
    }
  });
}