import { loadCSS } from './aem.js';

/**
 * Process all the tab auto blocks
 * @param {Element} main The container element
 */
export default function processTabs(main, moveInstrumentation) {
  const sections = [
    ...main.querySelectorAll('[data-aue-model="tabs"]:not(.section-metadata)'),
  ];
  if (sections.length === 0) return;

  // Function to load block CSS and JS
  async function loadBlock(block) {
    const blockName = block.dataset.blockName;
    if (!blockName) return;

    try {
      // Load block CSS
      const cssPath = `${window.hlx.codeBasePath}/blocks/${blockName}/${blockName}.css`;
      await loadCSS(cssPath);

      // Load block JS
      const jsPath = `${window.hlx.codeBasePath}/blocks/${blockName}/${blockName}.js`;
      try {
        const module = await import(jsPath);
        if (module.default) {
          module.default(block);
        }
      } catch (error) {
        // JS file might not exist, which is ok
        console.debug(`No JS module for block ${blockName}`);
      }
    } catch (error) {
      console.error(`Error loading block ${blockName}:`, error);
    }
  }

  const topContainer = document.createElement('div');
  topContainer.classList = 'container-xl container-lg container-md container-sm';

  const tabsWrapper = document.createElement('div');
  tabsWrapper.classList.add('tabs-container');

  const tabsNav = document.createElement('div');
  tabsNav.classList.add('tabs-header');

  const tabsContent = document.createElement('div');
  tabsContent.classList.add('tabs-content-wrapper');

  // Store panels for reference
  const panels = [];

  sections.forEach((section, index) => {
    // Get tab title from metadata
    const metadata = section.querySelector('.section-metadata');
    let tabTitle = `Tab ${index + 1}`;
    
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
    tabButton.dataset.index = index;
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

    // Clone and process content
    const contentElements = Array.from(section.children).filter(child => 
      !child.classList?.contains('section-metadata')
    );

    contentElements.forEach(element => {
      const clone = element.cloneNode(true);
      
      // Process blocks in the cloned content
      if (clone.classList && clone.classList.length > 0) {
        const blockName = Array.from(clone.classList)[0];
        clone.classList.add('block');
        clone.dataset.blockName = blockName;
        
        // Load block resources for first tab immediately
        if (index === 0) {
          loadBlock(clone);
        }
      }
      
      tabPanel.appendChild(clone);
    });

    panels.push(tabPanel);
    tabsNav.appendChild(tabButton);
    tabsContent.appendChild(tabPanel);
  });

  // Remove original sections
  sections.forEach(section => section.remove());

  // Build structure
  tabsWrapper.appendChild(tabsNav);
  tabsWrapper.appendChild(tabsContent);
  topContainer.appendChild(tabsWrapper);
  main.appendChild(topContainer);

  // Handle tab switching
  tabsNav.addEventListener('click', async (event) => {
    const tabButton = event.target.closest('.tab-title');
    if (!tabButton) return;

    const index = parseInt(tabButton.dataset.index, 10);
    if (Number.isNaN(index)) return;

    // Update tabs
    const allTabs = tabsNav.querySelectorAll('.tab-title');
    allTabs.forEach((tab, i) => {
      const isSelected = i === index;
      tab.classList.toggle('active', isSelected);
      tab.setAttribute('aria-selected', isSelected);
    });

    // Update panels
    panels.forEach((panel, i) => {
      const isVisible = i === index;
      panel.classList.toggle('active', isVisible);
      panel.setAttribute('aria-hidden', !isVisible);

      // Load blocks if this panel is becoming visible
      if (isVisible) {
        const blocks = panel.querySelectorAll('[data-block-name]');
        await Promise.all(Array.from(blocks).map(block => loadBlock(block)));
      }
    });
  });

  // Ensure first tab is active
  const firstTab = tabsNav.querySelector('.tab-title');
  const firstPanel = panels[0];
  if (firstTab && firstPanel) {
    firstTab.classList.add('active');
    firstPanel.classList.add('active');
  }
}