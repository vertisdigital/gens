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
    // Keep original section and add tabs class
    section.classList.add('tabs');
    
    // Create tabs structure inside the section
    const tabsNav = document.createElement('div');
    tabsNav.classList.add('tabs-header');
 
    const tabsContent = document.createElement('div');
    tabsContent.classList.add('tabs-content-wrapper');
 
    // Get tab sections (direct children that aren't metadata)
    const tabPanels = Array.from(section.children).filter(
      child => !child.classList.contains('section-metadata')
    );
 
    // Process each panel
    tabPanels.forEach((panel, index) => {
      // Get tab title from panel's metadata
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
 
      // Setup panel
      panel.classList.add('tab-panel');
      if (index === 0) {
        tabButton.classList.add('active');
        panel.classList.add('active');
      }
 
      // Process blocks in panel
      const blocks = panel.querySelectorAll('div[class]');
      blocks.forEach(block => {
        if (!block.classList.contains('section-metadata')) {
          const blockClasses = Array.from(block.classList);
          const blockName = blockClasses.find(className => 
            !className.includes('section-metadata') && 
            !className.startsWith('tab-')
          );
          
          if (blockName) {
            block.classList.add('block');
            block.dataset.blockName = blockName;
            if (index === 0) {
              loadBlock(block);
            }
          }
        }
      });
 
      tabsNav.appendChild(tabButton);
      tabsContent.appendChild(panel);
    });
 
    // Clear section and add new structure
    section.innerHTML = '';
    section.appendChild(tabsNav);
    section.appendChild(tabsContent);
 
    // Handle tab switching
    tabsNav.addEventListener('click', async (event) => {
      const tabButton = event.target.closest('.tab-title');
      if (!tabButton) return;
 
      const index = parseInt(tabButton.dataset.index, 10);
      if (Number.isNaN(index)) return;
 
      // Update tabs
      tabsNav.querySelectorAll('.tab-title').forEach((tab, i) => {
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