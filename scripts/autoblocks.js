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
 
  sections.forEach((section) => {
    // Create tabs container
    const tabsContainer = document.createElement('div');
    tabsContainer.classList.add('tabs-container');

    // Create tabs header
    const tabsHeader = document.createElement('div');
    tabsHeader.classList.add('tabs-header');

    // Create tabs content
    const tabsContent = document.createElement('div');
    tabsContent.classList.add('tabs-content-wrapper');

    // Get all tab panels (excluding metadata)
    const tabPanels = Array.from(section.children).filter(
      child => !child.classList.contains('section-metadata')
    );

    // Process each panel
    tabPanels.forEach((panel, index) => {
      // Get tab title
      const metadata = panel.querySelector('.section-metadata');
      let tabTitle = `Tab ${index + 1}`;
      if (metadata) {
        const titleDivs = metadata.querySelectorAll('div > div');
        if (titleDivs.length >= 2) {
          tabTitle = titleDivs[1].textContent.trim();
        }
      }

      // Create tab button
      const tabButton = document.createElement('div');
      tabButton.classList.add('tab-title');
      tabButton.dataset.index = index;
      tabButton.textContent = tabTitle;

      // Create tab panel
      const tabPanel = document.createElement('div');
      tabPanel.classList.add('tab-panel');

      // Set initial active state
      if (index === 0) {
        tabButton.classList.add('active');
        tabPanel.classList.add('active');
      }

      // Move content to panel
      Array.from(panel.children).forEach(child => {
        if (!child.classList?.contains('section-metadata')) {
          const clone = child.cloneNode(true);
          if (clone.classList && clone.classList.length > 0) {
            const blockName = clone.classList[0];
            clone.classList.add('block');
            clone.dataset.blockName = blockName;
            if (index === 0) {
              loadBlock(clone);
            }
          }
          tabPanel.appendChild(clone);
        }
      });

      tabsHeader.appendChild(tabButton);
      tabsContent.appendChild(tabPanel);
    });

    // Build structure
    tabsContainer.appendChild(tabsHeader);
    tabsContainer.appendChild(tabsContent);

    // Replace section content
    section.innerHTML = '';
    section.appendChild(tabsContainer);

    // Handle tab switching
    tabsHeader.addEventListener('click', async (event) => {
      const tabButton = event.target.closest('.tab-title');
      if (!tabButton) return;

      const index = parseInt(tabButton.dataset.index, 10);
      if (Number.isNaN(index)) return;

      // Update tabs
      tabsHeader.querySelectorAll('.tab-title').forEach((tab, i) => {
        tab.classList.toggle('active', i === index);
      });

      // Update panels
      const panels = tabsContent.querySelectorAll('.tab-panel');
      panels.forEach((panel, i) => {
        const isVisible = i === index;
        panel.classList.toggle('active', isVisible);

        if (isVisible) {
          const blocks = panel.querySelectorAll('[data-block-name]');
          blocks.forEach(block => loadBlock(block));
        }
      });
    });
  });
}