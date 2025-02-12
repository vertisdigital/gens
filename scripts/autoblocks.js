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
  tabsNav.classList.add('tabs-header');

  const tabsContent = document.createElement('div');
  tabsContent.classList.add('tabs-content-wrapper');

  // Store references to panels and buttons
  const tabButtons = [];
  const tabPanels = [];

  sections.forEach((section, index) => {
    // Get tab title from metadata
    const metadata = section.querySelector('.section-metadata');
    let tabTitle = `Tab ${index + 1}`; // Default title
    
    if (metadata) {
      const titleDiv = metadata.querySelector('div:last-child');
      if (titleDiv && titleDiv.textContent.trim()) {
        const titleParts = titleDiv.textContent.trim().split(' ');
        if (titleParts.length > 1) {
          tabTitle = titleParts.slice(1).join(' ');
        }
      }
    }

    // Create tab button
    const tabButton = document.createElement('button');
    tabButton.classList.add('tab-title');
    tabButton.setAttribute('role', 'tab');
    tabButton.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
    tabButton.dataset.tabIndex = index;
    tabButton.textContent = tabTitle;
    tabButton.type = 'button';

    // Create tab panel
    const tabPanel = document.createElement('div');
    tabPanel.classList.add('tab-panel');
    tabPanel.setAttribute('role', 'tabpanel');
    tabPanel.setAttribute('aria-hidden', index === 0 ? 'false' : 'true');

    // Set initial active state
    if (index === 0) {
      tabButton.classList.add('active');
      tabPanel.classList.add('active');
    }

    // Clone and move content
    Array.from(section.children).forEach(child => {
      if (!child.classList?.contains('section-metadata')) {
        const clone = child.cloneNode(true);
        moveInstrumentation(child, clone);
        tabPanel.appendChild(clone);
      }
    });

    // Store references
    tabButtons.push(tabButton);
    tabPanels.push(tabPanel);

    // Add to DOM
    tabsNav.appendChild(tabButton);
    tabsContent.appendChild(tabPanel);

    // Add click handler to each button
    tabButton.addEventListener('click', () => {
      // Deactivate all tabs
      tabButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });
      tabPanels.forEach(panel => {
        panel.classList.remove('active');
        panel.setAttribute('aria-hidden', 'true');
      });

      // Activate clicked tab
      tabButton.classList.add('active');
      tabButton.setAttribute('aria-selected', 'true');
      tabPanel.classList.add('active');
      tabPanel.setAttribute('aria-hidden', 'false');
    });
  });

  // Remove original sections
  sections.forEach(section => section.remove());

  // Build structure
  tabsWrapper.appendChild(tabsNav);
  tabsWrapper.appendChild(tabsContent);
  topContainer.appendChild(tabsWrapper);
  main.appendChild(topContainer);
}