/**
 * Process all the tab auto blocks
 * @param {Element} main The container element
 */
export default function processTabs(main, moveInstrumentation) {
  if (!main) {
    console.warn('Main element is undefined in processTabs');
    return;
  }

  // Find tab sections that are direct containers
  const sections = [
    ...main.querySelectorAll('[data-aue-model="tabs"]'),
  ];
  if (!sections.length) return;

  try {
    sections.forEach((tabSection) => {
      if (!tabSection) {
        console.warn('Tab section is undefined');
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

      // Get all direct child blocks excluding metadata
      const tabBlocks = Array.from(tabSection.children).filter(child => 
        !child.classList.contains('section-metadata')
      );

      // Create default tab titles if metadata is not present
      const defaultTitles = ['RWS', 'RWS 2.0']; // Default tab titles

      // Create tabs for each block
      tabBlocks.forEach((block, index) => {
        if (!block) return;

        // Create tab button with default title
        const tabButton = document.createElement('button');
        tabButton.classList.add('tab-title');
        tabButton.textContent = defaultTitles[index] || `Tab ${index + 1}`;
        tabButton.setAttribute('role', 'tab');
        tabButton.dataset.index = index.toString();

        // Create tab panel
        const tabPanel = document.createElement('div');
        tabPanel.classList.add('tab-panel');
        tabPanel.setAttribute('role', 'tabpanel');

        // Set initial active state for first tab
        if (index === 0) {
          tabButton.classList.add('active');
          tabPanel.classList.add('active');
        }

        // Move content to panel
        tabPanel.appendChild(block);

        tabsNav.appendChild(tabButton);
        tabsContent.appendChild(tabPanel);
      });

      // Add click handlers
      tabsNav.addEventListener('click', (event) => {
        const clickedTab = event.target.closest('.tab-title');
        if (!clickedTab) return;

        const index = parseInt(clickedTab.dataset.index, 10);
        if (isNaN(index)) return;

        const allTabs = tabsNav.querySelectorAll('.tab-title');
        const allPanels = tabsContent.querySelectorAll('.tab-panel');

        // Remove active class from all tabs and panels
        allTabs.forEach(tab => tab.classList.remove('active'));
        allPanels.forEach(panel => panel.classList.remove('active'));

        // Add active class to clicked tab and corresponding panel
        clickedTab.classList.add('active');
        allPanels[index]?.classList.add('active');
      });

      // Assemble and insert the tabs structure
      tabsWrapper.appendChild(tabsNav);
      tabsWrapper.appendChild(tabsContent);

      // Clear original content except metadata
      while (tabSection.firstChild) {
        if (!tabSection.firstChild.classList.contains('section-metadata')) {
          tabSection.removeChild(tabSection.firstChild);
        }
      }

      // Add new structure
      tabSection.appendChild(tabsWrapper);

      // Move instrumentation if needed
      if (moveInstrumentation && typeof moveInstrumentation === 'function') {
        moveInstrumentation(tabSection, tabsWrapper);
      }

      // Debug logging
      console.log('Tab section classes:', tabSection.classList);
      console.log('Tab structure:', {
        wrapper: tabsWrapper,
        nav: tabsNav,
        content: tabsContent,
        buttons: tabsNav.querySelectorAll('.tab-title'),
        panels: tabsContent.querySelectorAll('.tab-panel')
      });
    });
  } catch (error) {
    console.error('Error in processTabs:', error);
  }
}