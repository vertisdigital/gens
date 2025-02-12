/**
 * Process all the tab auto blocks
 * @param {Element} main The container element
 */
export default function processTabs(main, moveInstrumentation) {
  console.log('Starting processTabs');
  
  if (!main) {
    console.warn('Main element is undefined in processTabs');
    return;
  }

  // Find only the top-level tab sections
  const sections = [
    ...main.querySelectorAll(':scope > [data-aue-model="tabs"]'),
  ];
  console.log('Found tab sections:', sections.length);
  
  if (!sections.length) return;

  sections.forEach((tabSection) => {
    // Skip if this is a nested tab
    if (tabSection.closest('[data-aue-model="tabs"]') !== tabSection) {
      return;
    }

    console.log(`Processing tab section ${sections.indexOf(tabSection)}`);
    
    // Ensure tab section has the required classes
    tabSection.classList.add('tabs', 'block');
    
    // Create container structure
    const tabsWrapper = document.createElement('div');
    tabsWrapper.classList.add('tabs-container');

    // Create tab header container
    const tabsNav = document.createElement('div');
    tabsNav.classList.add('tabs-header');

    // Create tab content container
    const tabsContent = document.createElement('div');
    tabsContent.classList.add('tabs-content');

    // Get only the content blocks (text and blocks), excluding metadata and nested tabs
    const tabBlocks = Array.from(tabSection.children).filter(child => 
      !child.classList.contains('section-metadata') &&
      child.getAttribute('data-aue-model') !== 'tabs' &&
      (child.hasAttribute('data-richtext-resource') || 
       child.getAttribute('data-aue-type') === 'container')
    );
    console.log('Found tab blocks:', tabBlocks.length);

    // Create default tab titles
    const defaultTitles = ['RWS', 'RWS 2.0'];

    // Create tabs only for the first two blocks
    tabBlocks.slice(0, 2).forEach((block, index) => {
      console.log(`Creating tab ${index} with title: ${defaultTitles[index]}`);
      
      // Create tab button
      const tabButton = document.createElement('button');
      tabButton.classList.add('tab-title');
      tabButton.textContent = defaultTitles[index];
      tabButton.setAttribute('role', 'tab');
      tabButton.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
      tabButton.dataset.index = index.toString();

      // Create the indicator element
      const indicator = document.createElement('div');
      indicator.classList.add('tab-indicator');
      tabButton.appendChild(indicator);

      // Create tab panel
      const tabPanel = document.createElement('div');
      tabPanel.classList.add('tab-panel');
      tabPanel.setAttribute('role', 'tabpanel');
      tabPanel.id = `tab-panel-${index}`;
      tabButton.setAttribute('aria-controls', `tab-panel-${index}`);

      // Set initial active state for first tab
      if (index === 0) {
        tabButton.classList.add('active');
        tabPanel.classList.add('active');
      }

      // Move the content to panel
      tabPanel.appendChild(block.cloneNode(true));

      // Add button to nav and panel to content
      tabsNav.appendChild(tabButton);
      tabsContent.appendChild(tabPanel);
    });

    // Add click handlers
    tabsNav.addEventListener('click', (event) => {
      const clickedTab = event.target.closest('.tab-title');
      if (!clickedTab) return;

      const index = parseInt(clickedTab.dataset.index, 10);
      const allTabs = tabsNav.querySelectorAll('.tab-title');
      const allPanels = tabsContent.querySelectorAll('.tab-panel');

      // Remove active class from all tabs and panels
      allTabs.forEach(tab => {
        tab.classList.remove('active');
        tab.setAttribute('aria-selected', 'false');
      });
      allPanels.forEach(panel => panel.classList.remove('active'));

      // Add active class to clicked tab and corresponding panel
      clickedTab.classList.add('active');
      clickedTab.setAttribute('aria-selected', 'true');
      allPanels[index].classList.add('active');
    });

    // Create horizontal line element
    const horizontalLine = document.createElement('div');
    horizontalLine.classList.add('tabs-horizontal-line');

    // Assemble the tabs structure
    tabsWrapper.appendChild(tabsNav);
    tabsWrapper.appendChild(horizontalLine);
    tabsWrapper.appendChild(tabsContent);

    // Clear original content
    tabSection.innerHTML = '';
    
    // Add the new structure
    tabSection.appendChild(tabsWrapper);

    // Move instrumentation if needed
    if (moveInstrumentation) {
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
}