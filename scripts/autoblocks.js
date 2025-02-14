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
    // Get all tabs sections within this container
    const tabSections = Array.from(tabContainer.children).filter(
      child => !child.classList.contains('section-metadata') && child.dataset.aueModel === 'tabs'
    );
 
    if (tabSections.length === 0) return;
 
    // Create visual structure
    const topContainer = document.createElement('div');
    topContainer.classList = 'container-xl container-lg container-md container-sm';
 
    const tabsWrapper = document.createElement('div');
    tabsWrapper.classList.add('tabs-container');
 
    const tabsNav = document.createElement('div');
    tabsNav.classList.add('tabs-header', 'row');
 
    const tabsContent = document.createElement('div');
    tabsContent.classList.add('tabs-content');
 
    // Calculate column classes based on number of tabs
    const numTabs = tabSections.length;
    const colClass = numTabs === 2 ? 'col-xl-6 col-lg-6 col-md-6 col-sm-6' : 
                    numTabs === 3 ? 'col-xl-4 col-lg-4 col-md-4 col-sm-4' :
                    'col-xl-3 col-lg-3 col-md-3 col-sm-3';
 
    tabSections.forEach((section, index) => {
      const metadata = section.querySelector('.section-metadata > div :last-child');
      const tabTitle = metadata ? metadata.textContent.trim() : `Tab ${index + 1}`;
 
      // Create tab button
      const tabButton = document.createElement('div');
      tabButton.classList.add('tab-title');
      tabButton.classList.add(...colClass.split(' '));
      tabButton.dataset.index = index;
      tabButton.textContent = tabTitle;
 
      // Create tab panel
      const tabPanel = document.createElement('div');
      tabPanel.classList.add('tab-panel');
      moveInstrumentation(section, tabPanel);
 
      if (index === 0) {
        tabButton.classList.add('active');
        tabPanel.classList.add('active');
      }
 
      // Move content to panel
      Array.from(section.children).forEach(child => {
        if (!child.classList?.contains('section-metadata')) {
          tabPanel.appendChild(child);
        }
      });
 
      tabsNav.appendChild(tabButton);
      tabsContent.appendChild(tabPanel);
 
      // Keep section in DOM but empty
      section.innerHTML = '';
      section.style.display = 'none';
    });
 
    // Build structure
    tabsWrapper.appendChild(tabsNav);
    tabsWrapper.appendChild(tabsContent);
    topContainer.appendChild(tabsWrapper);
 
    // Insert visual structure before the first tab section
    tabContainer.insertBefore(topContainer, tabContainer.firstChild);
 
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