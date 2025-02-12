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

    // Store panels for reference
    const panels = [];

    // Get all tab sections (excluding metadata)
    const tabSections = Array.from(section.children).filter(
      child => !child.classList.contains('section-metadata')
    );

    // Process each section
    tabSections.forEach((tabSection, index) => {
      // Get tab title
      const metadata = tabSection.querySelector('.section-metadata');
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

      // Process blocks in the section
      const blocks = tabSection.querySelectorAll('div[class]');
      blocks.forEach(block => {
        if (!block.classList.contains('section-metadata')) {
          // Create a new block element
          const newBlock = document.createElement('div');
          
          // Copy classes and add block class
          const blockName = Array.from(block.classList)[0];
          newBlock.classList.add(blockName, 'block');
          newBlock.dataset.blockName = blockName;
          
          // Copy content and attributes
          newBlock.innerHTML = block.innerHTML;
          Array.from(block.attributes).forEach(attr => {
            if (attr.name !== 'class') {
              newBlock.setAttribute(attr.name, attr.value);
            }
          });
          
          tabPanel.appendChild(newBlock);
          
          // Load block resources for first tab
          if (index === 0) {
            loadBlock(newBlock);
          }
        }
      });

      // Set initial active state
      if (index === 0) {
        tabButton.classList.add('active');
        tabPanel.classList.add('active');
      }

      panels.push(tabPanel);
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
      const clickedTab = event.target.closest('.tab-title');
      if (!clickedTab) return;

      const index = parseInt(clickedTab.dataset.index, 10);
      if (Number.isNaN(index)) return;

      // Deactivate all tabs and panels
      tabsHeader.querySelectorAll('.tab-title').forEach(tab => {
        tab.classList.remove('active');
      });
      panels.forEach(panel => {
        panel.classList.remove('active');
      });

      // Activate clicked tab and its panel
      clickedTab.classList.add('active');
      const activePanel = panels[index];
      if (activePanel) {
        activePanel.classList.add('active');
        
        // Load blocks in newly visible panel
        const blocks = activePanel.querySelectorAll('[data-block-name]');
        blocks.forEach(block => {
          if (!block.classList.contains('block-loaded')) {
            loadBlock(block);
            block.classList.add('block-loaded');
          }
        });
      }
    });
  });
}