/**
 * Process all the tab auto blocks
 * @param {Element} main The container element
 */
export default function processTabs(main, moveInstrumentation) {
  const sections = [
    ...main.querySelectorAll('[data-aue-model="tabs"]:not(.section-metadata)'),
  ];
  if (sections.length === 0) return;

  const topContainer = document.createElement('div');
  topContainer.classList = 'container-xl container-lg container-md container-sm';

  const tabsWrapper = document.createElement('div');
  tabsWrapper.classList.add('tabs-container');

  const tabsNav = document.createElement('div');
  tabsNav.classList.add('tabs-header', 'row');

  const tabsContent = document.createElement('div');
  tabsContent.classList.add('tabs-content-wrapper'); // Changed class name for better semantics

  sections.forEach((section, index) => {
    // Get tab title from metadata or data attribute
    const metadata = section.querySelector('.section-metadata > div :last-child');
    const tabTitle = metadata?.textContent.trim() || section.getAttribute('data-tab-title') || `Tab ${index + 1}`;

    // Create tab button
    const tabButton = document.createElement('div');
    tabButton.classList.add('tab-title', 'col-xl-6', 'col-lg-6', 'col-md-3', 'col-sm-2');
    tabButton.setAttribute('role', 'tab');
    tabButton.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
    tabButton.setAttribute('tabindex', index === 0 ? '0' : '-1');
    tabButton.dataset.tabIndex = index;
    tabButton.textContent = tabTitle;

    // Create tab panel
    const tabPanel = document.createElement('div');
    tabPanel.classList.add('tab-panel');
    tabPanel.setAttribute('role', 'tabpanel');
    tabPanel.setAttribute('aria-hidden', index === 0 ? 'false' : 'true');
    if (index === 0) {
      tabButton.classList.add('active');
      tabPanel.classList.add('active');
    }

    // Move content to tab panel
    moveInstrumentation(section, tabPanel);
    while (section.firstChild) {
      const child = section.firstChild;
      if (!child.classList?.contains('section-metadata')) {
        tabPanel.appendChild(child);
      } else {
        section.removeChild(child);
      }
    }

    tabsNav.appendChild(tabButton);
    tabsContent.appendChild(tabPanel);
  });

  // Remove original sections
  sections.forEach(section => section.remove());

  // Build tab structure
  tabsWrapper.appendChild(tabsNav);
  tabsWrapper.appendChild(tabsContent);
  topContainer.appendChild(tabsWrapper);
  main.appendChild(topContainer);

  // Single event listener for tab switching using event delegation
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
}
