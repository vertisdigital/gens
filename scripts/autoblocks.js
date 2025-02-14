import { loadCSS } from './aem.js';
 
/**
 * Process all the tab auto blocks
 * @param {Element} main The container element
 */
export default function processTabs(main, moveInstrumentation) {
  const tabContainers = [
    ...main.querySelectorAll('[data-aue-model="tabscontainer"]:not(.section-metadata)'),
  ];
  if (tabContainers.length === 0) return;
 
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
 
  tabContainers.forEach((tabContainer) => {
    const topContainer = document.createElement('div');
    topContainer.classList = 'container-xl container-lg container-md container-sm';
    //moveInstrumentation(section, topContainer);

    const tabsWrapper = document.createElement('div');
    tabsWrapper.classList.add('tabs-container', 'block');
    tabsWrapper.dataset.blockName = 'tabs';
    tabsWrapper.dataset.aueModel = 'tabs';
 
    const tabsNav = document.createElement('div');
    tabsNav.classList.add('tabs-header', 'row');
 
    const tabsContent = document.createElement('div');
    tabsContent.classList.add('tabs-content');
 
    // Get all tabs sections within this container
    const tabSections = Array.from(tabContainer.children).filter(
      child => !child.classList.contains('section-metadata') && child.dataset.aueModel === 'tabs'
    );
 
    tabSections.forEach((section, index) => {
      const metadata = section.querySelector('.section-metadata > div :last-child');
      const tabTitle = metadata ? metadata.textContent.trim() : `Tab ${index + 1}`;
 
      const tabButton = document.createElement('div');
      tabButton.classList.add('tab-title', 'col-xl-6', 'col-lg-6', 'col-md-3', 'col-sm-2');
      tabButton.dataset.index = index;
      tabButton.textContent = tabTitle;
 
      const tabPanel = document.createElement('div');
      tabPanel.classList.add('tab-panel');
      tabPanel.dataset.aueModel = 'tabs';
      moveInstrumentation(section, tabPanel);
 
      // Set initial active state for first tab
      if (index === 0) {
        tabButton.classList.add('active');
        tabPanel.classList.add('active');
      }
 
      // Move content to panel while preserving structure
      Array.from(section.children).forEach(child => {
        if (!child.classList?.contains('section-metadata')) {
          tabPanel.appendChild(child);
        }
      });
 
      tabsNav.appendChild(tabButton);
      tabsContent.appendChild(tabPanel);
    });
 
    // Build structure
    tabsWrapper.appendChild(tabsNav);
    tabsWrapper.appendChild(tabsContent);
    topContainer.appendChild(tabsWrapper);
 
    // Replace tabContainer content while preserving the container
    tabContainer.innerHTML = '';
    tabContainer.appendChild(topContainer);
 
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
       
        // Load blocks in newly visible panel
        const blocks = activePanel.querySelectorAll('[data-block-name]');
        await Promise.all(Array.from(blocks).map(block => loadBlock(block)));
      }
    });
  });
}