/**
 * Process all the tab auto blocks
 * @param {Element} main The container element
 */
export default function processTabs(main, moveInstrumentation) {
  console.log('Starting processTabs...');
  
  const sections = [
    ...main.querySelectorAll('[data-aue-model="tabs"]:not(.section-metadata)'),
  ];
  console.log('Found tab sections:', sections.length);
  if (sections.length === 0) return;

  const topContainer = document.createElement('div');
  topContainer.classList = 'container-xl container-lg container-md container-sm';

  const tabsWrapper = document.createElement('div');
  tabsWrapper.classList.add('tabs-container');

  const tabsNav = document.createElement('div');
  tabsNav.classList.add('tabs-header');

  const tabsContent = document.createElement('div');
  tabsContent.classList.add('tabs-content-wrapper');

  sections.forEach((section, index) => {
    console.log(`Processing tab section ${index}`);
    
    // Get tab title from metadata
    const metadata = section.querySelector('.section-metadata');
    let tabTitle = `Tab ${index + 1}`; // Default title
    
    if (metadata) {
      const titleDiv = metadata.querySelector('div:last-child');
      if (titleDiv && titleDiv.textContent.trim()) {
        tabTitle = titleDiv.textContent.trim().replace('tabtitle ', ''); // Remove 'tabtitle ' prefix
      }
    }
    
    console.log('Tab title:', tabTitle);

    // Create tab button
    const tabButton = document.createElement('button');
    tabButton.classList.add('tab-title');
    tabButton.setAttribute('role', 'tab');
    tabButton.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
    tabButton.setAttribute('tabindex', index === 0 ? '0' : '-1');
    tabButton.dataset.tabIndex = index;
    tabButton.textContent = tabTitle;
    tabButton.type = 'button';

    // Create tab panel
    const tabPanel = document.createElement('div');
    tabPanel.classList.add('tab-panel');
    tabPanel.setAttribute('role', 'tabpanel');
    tabPanel.setAttribute('aria-hidden', index === 0 ? 'false' : 'true');
    tabPanel.id = `tab-panel-${index}`; // Add ID for aria-controls
    tabButton.setAttribute('aria-controls', `tab-panel-${index}`); // Link button to panel
    
    // Set initial active state
    if (index === 0) {
      tabButton.classList.add('active');
      tabPanel.classList.add('active');
    }

    // Move content to tab panel
    moveInstrumentation(section, tabPanel);
    
    // Move all non-metadata content to the panel
    Array.from(section.children).forEach(child => {
      if (!child.classList?.contains('section-metadata')) {
        tabPanel.appendChild(child.cloneNode(true));
      }
    });

    tabsNav.appendChild(tabButton);
    tabsContent.appendChild(tabPanel);
  });

  // Remove original sections after cloning content
  sections.forEach(section => section.remove());

  // Build tab structure
  tabsWrapper.appendChild(tabsNav);
  tabsWrapper.appendChild(tabsContent);
  topContainer.appendChild(tabsWrapper);
  main.appendChild(topContainer);

  // Add click handler
  tabsNav.addEventListener('click', (event) => {
    const clickedTab = event.target.closest('.tab-title');
    if (!clickedTab) return;

    const index = parseInt(clickedTab.dataset.tabIndex, 10);
    const allTabs = tabsNav.querySelectorAll('.tab-title');
    const allPanels = tabsContent.querySelectorAll('.tab-panel');

    // Update tabs
    allTabs.forEach((tab, i) => {
      const isSelected = i === index;
      tab.classList.toggle('active', isSelected);
      tab.setAttribute('aria-selected', isSelected);
      tab.setAttribute('tabindex', isSelected ? '0' : '-1');
    });

    // Update panels
    allPanels.forEach((panel, i) => {
      const isVisible = i === index;
      panel.classList.toggle('active', isVisible);
      panel.setAttribute('aria-hidden', !isVisible);
    });
  });

  // Add keyboard navigation
  tabsNav.addEventListener('keydown', (event) => {
    const tabs = [...tabsNav.querySelectorAll('.tab-title')];
    const currentTab = document.activeElement;
    if (!tabs.includes(currentTab)) return;

    const currentIndex = tabs.indexOf(currentTab);
    let newIndex;

    switch (event.key) {
      case 'ArrowLeft':
        newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
        break;
      case 'ArrowRight':
        newIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
        break;
      default:
        return;
    }

    event.preventDefault();
    tabs[newIndex].click();
    tabs[newIndex].focus();
  });

  console.log('Tab initialization complete');
}
