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
  tabsWrapper.dataset.blockName = 'tabs'; // Add block name for decoration

  const tabsNav = document.createElement('div');
  tabsNav.classList.add('tabs-header', 'row');

  const tabsContent = document.createElement('div');
  tabsContent.classList.add('tabs-content');

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
    const tabButton = document.createElement('div');
    tabButton.classList.add('tab-title', 'col-xl-6', 'col-lg-6', 'col-md-3', 'col-sm-2');
    tabButton.setAttribute('role', 'tab');
    tabButton.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
    tabButton.dataset.index = index;
    tabButton.textContent = tabTitle;
    tabButton.style.cursor = 'pointer';

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

    // Preserve block decoration data
    const blocks = section.querySelectorAll('[class]');
    blocks.forEach(block => {
      if (block.className && !block.className.includes('section-metadata')) {
        block.dataset.blockName = block.className.split(' ')[0];
      }
    });

    // Clone and move content with instrumentation
    const contentElements = Array.from(section.children).filter(child => 
      !child.classList?.contains('section-metadata')
    );

    contentElements.forEach(element => {
      const clone = element.cloneNode(true);
      // Preserve block data for decoration
      if (element.dataset.blockName) {
        clone.dataset.blockName = element.dataset.blockName;
      }
      moveInstrumentation(element, clone);
      tabPanel.appendChild(clone);
    });

    tabsNav.appendChild(tabButton);
    tabsContent.appendChild(tabPanel);
  });

  // Remove original sections after cloning
  sections.forEach(section => section.parentNode.removeChild(section));

  tabsWrapper.appendChild(tabsNav);
  tabsWrapper.appendChild(tabsContent);
  topContainer.appendChild(tabsWrapper);

  // Insert the tabs before removing sections to maintain position
  const firstSection = sections[0];
  if (firstSection && firstSection.parentNode) {
    firstSection.parentNode.insertBefore(topContainer, firstSection);
  } else {
    main.appendChild(topContainer);
  }

  // Handle tab switching
  tabsWrapper.addEventListener('click', (event) => {
    const tabButton = event.target.closest('.tab-title');
    if (!tabButton) return;

    const index = parseInt(tabButton.dataset.index, 10);
    if (Number.isNaN(index)) return;

    // Update tab states
    tabsWrapper.querySelectorAll('.tab-title').forEach((btn, i) => {
      const isSelected = i === index;
      btn.classList.toggle('active', isSelected);
      btn.setAttribute('aria-selected', isSelected);
    });

    // Update panel states
    tabsWrapper.querySelectorAll('.tab-panel').forEach((panel, i) => {
      const isVisible = i === index;
      panel.classList.toggle('active', isVisible);
      panel.setAttribute('aria-hidden', !isVisible);

      // Ensure blocks in newly visible panels are decorated
      if (isVisible) {
        const undecorated = panel.querySelectorAll('[data-block-name]:not(.block)');
        undecorated.forEach(block => {
          block.classList.add('block', block.dataset.blockName);
        });
      }
    });
  });

  // Ensure first tab content is properly decorated
  const firstPanel = tabsContent.querySelector('.tab-panel.active');
  if (firstPanel) {
    const blocks = firstPanel.querySelectorAll('[data-block-name]');
    blocks.forEach(block => {
      if (!block.classList.contains('block')) {
        block.classList.add('block', block.dataset.blockName);
      }
    });
  }
}