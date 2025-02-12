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
    // Create visual tab structure
    const tabsWrapper = document.createElement('div');
    tabsWrapper.classList.add('tabs-container');
 
    const tabsNav = document.createElement('div');
    tabsNav.classList.add('tabs-header');
 
    const tabsContent = document.createElement('div');
    tabsContent.classList.add('tabs-content-wrapper');
 
    // Get tab sections
    const tabSections = Array.from(section.children).filter(
      child => !child.classList.contains('section-metadata')
    );
 
    // Create tabs and panels
    tabSections.forEach((tabSection, index) => {
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
 
      // Set initial active state
      if (index === 0) {
        tabButton.classList.add('active');
        tabPanel.classList.add('active');
      }
 
      // Move content to panel
      Array.from(tabSection.children).forEach(child => {
        if (!child.classList?.contains('section-metadata')) {
          const clone = child.cloneNode(true);
          tabPanel.appendChild(clone);
        }
      });
 
      tabsNav.appendChild(tabButton);
      tabsContent.appendChild(tabPanel);
    });
 
    // Build structure
    tabsWrapper.appendChild(tabsNav);
    tabsWrapper.appendChild(tabsContent);
 
    // Insert tabs before first section
    section.insertBefore(tabsWrapper, section.firstChild);
 
    // Hide original sections but keep them in DOM
    tabSections.forEach(tabSection => {
      tabSection.style.display = 'none';
      tabSection.setAttribute('data-tab-content', 'true');
    });
 
    // Handle tab switching
    tabsNav.addEventListener('click', async (event) => {
      const tabButton = event.target.closest('.tab-title');
      if (!tabButton) return;
 
      const index = parseInt(tabButton.dataset.index, 10);
      if (Number.isNaN(index)) return;
 
      // Update tabs
      tabsNav.querySelectorAll('.tab-title').forEach(btn => {
        btn.classList.remove('active');
      });
      tabButton.classList.add('active');
 
      // Update panels
      tabsContent.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.remove('active');
      });
      
      const activePanel = tabsContent.children[index];
      if (activePanel) {
        activePanel.classList.add('active');
      }
    });
  });
}