import { loadCSS } from './aem.js';
 
/**
 * Process all the tab auto blocks
 * @param {Element} main The container element
 */
export default function processTabs(main, moveInstrumentation) {
  // Update selector to handle both tabs and section models that have tab titles
  const sections = [
    ...main.querySelectorAll('[data-aue-model="tabs"], [data-aue-model="section"][data-tabtitle]'),
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
  //moveInstrumentation(section, topContainer);

 
  const tabsWrapper = document.createElement('div');
  tabsWrapper.classList.add('tabs-container', 'block');
  tabsWrapper.dataset.blockName = 'tabs';
  // Preserve AEM authoring attributes
  tabsWrapper.dataset.aueType = 'container';
  tabsWrapper.dataset.aueBehavior = 'component';
  tabsWrapper.dataset.aueModel = 'tabs';
  tabsWrapper.dataset.aueLabel = 'tabs';
  tabsWrapper.dataset.aueFilter = 'tabs';
 
  const tabsNav = document.createElement('div');
  tabsNav.classList.add('tabs-header', 'row');
 
  const tabsContent = document.createElement('div');
  tabsContent.classList.add('tabs-content');
 
  sections.forEach((section, index) => {
    // Get tab title from data-tabtitle attribute or metadata
    const tabTitle = section.dataset.tabtitle || 
                    section.querySelector('.section-metadata > div :last-child')?.textContent?.trim() || 
                    `Tab ${index + 1}`;

    const tabButton = document.createElement('div');
    tabButton.classList.add('tab-title', 'col-xl-6', 'col-lg-6', 'col-md-3', 'col-sm-2');
    tabButton.dataset.index = index;
    tabButton.textContent = tabTitle;
 
    const tabPanel = document.createElement('div');
    tabPanel.classList.add('tab-panel');
    // Preserve original section attributes
    Array.from(section.attributes).forEach(attr => {
      if (!['class', 'style'].includes(attr.name)) {
        tabPanel.setAttribute(attr.name, attr.value);
      }
    });
 
    // Set initial active state
    if (index === 0) {
      tabButton.classList.add('active');
      tabPanel.classList.add('active');
    }
 
    // Process blocks while preserving AEM authoring structure
    const blocks = section.querySelectorAll('[data-aue-model]');
    blocks.forEach(block => {
      if (!block.classList.contains('section-metadata')) {
        const blockWrapper = document.createElement('div');
        blockWrapper.className = block.className;
        // Preserve all data attributes
        Array.from(block.attributes).forEach(attr => {
          if (attr.name.startsWith('data-')) {
            blockWrapper.setAttribute(attr.name, attr.value);
          }
        });
        
        blockWrapper.innerHTML = block.innerHTML;
        tabPanel.appendChild(blockWrapper);

        // Load block if in first tab
        if (index === 0 && block.dataset.blockName) {
          loadBlock(blockWrapper);
        }
      }
    });
 
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
    tabsWrapper.querySelectorAll('.tab-title').forEach(btn => {
      btn.classList.remove('active');
    });
    tabButton.classList.add('active');
 
    // Update panels
    tabsWrapper.querySelectorAll('.tab-panel').forEach(panel => {
      panel.classList.remove('active');
    });
   
    const activePanel = tabsContent.children[index];
    if (activePanel) {
      activePanel.classList.add('active');
     
      // Load blocks in the newly active panel if not already loaded
      const blocks = activePanel.querySelectorAll('[data-block-name]');
      await Promise.all(Array.from(blocks).map(block => loadBlock(block)));
    }
  });
}