/**
 * Process all the tab auto blocks
 * @param {Element} main The container element
 */
export default function processTabs(main, moveInstrumentation) {
  // Find tab sections that are direct containers
  const sections = [
    ...main.querySelectorAll(':scope > [data-aue-model="tabs"]'),
  ];
  if (sections.length === 0) return;

  sections.forEach((tabSection) => {
    // Store the original position and next sibling
    const nextSibling = tabSection.nextElementSibling;
    
    // Create container structure
    const tabsWrapper = document.createElement('div');
    tabsWrapper.classList.add('tabs-container');

    const tabsNav = document.createElement('div');
    tabsNav.classList.add('tabs-header', 'row');

    const tabsContent = document.createElement('div');
    tabsContent.classList.add('tabs-content-wrapper');

    // Get all direct child blocks of this tab section
    const tabBlocks = Array.from(tabSection.children).filter(child => 
      !child.classList.contains('section-metadata')
    );

    // Get tab titles from metadata
    const metadata = tabSection.querySelector('.section-metadata');
    let tabTitle = metadata?.querySelector('div:last-child')?.textContent || 'Tab';

    // Create tab button
    const tabButton = document.createElement('button');
    tabButton.classList.add('tab-title', 'col-6');
    tabButton.textContent = tabTitle;
    tabButton.setAttribute('role', 'tab');
    tabButton.dataset.index = '0';

    // Create tab panel for content
    const tabPanel = document.createElement('div');
    tabPanel.classList.add('tab-panel');
    tabPanel.setAttribute('role', 'tabpanel');

    // Move content to panel
    tabBlocks.forEach(block => {
      tabPanel.appendChild(block);
    });

    // Set initial active states
    tabButton.classList.add('active');
    tabPanel.classList.add('active');

    // Add to DOM
    tabsNav.appendChild(tabButton);
    tabsContent.appendChild(tabPanel);
    tabsWrapper.appendChild(tabsNav);
    tabsWrapper.appendChild(tabsContent);

    // Insert the new structure in the original position
    if (nextSibling) {
      main.insertBefore(tabsWrapper, nextSibling);
    } else {
      main.appendChild(tabsWrapper);
    }

    // Remove the original section
    tabSection.remove();

    // Add click handler
    tabButton.addEventListener('click', () => {
      const isActive = tabButton.classList.contains('active');
      if (!isActive) {
        tabButton.classList.add('active');
        tabPanel.classList.add('active');
      }
    });
  });
}