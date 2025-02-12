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
 
  sections.forEach((tabsSection) => {
    // Create container structure
    const container = document.createElement('div');
    container.classList.add('container-xl', 'container-lg', 'container-md', 'container-sm');
 
    const tabsWrapper = document.createElement('div');
    tabsWrapper.classList.add('tabs-container');
    tabsWrapper.dataset.aueModel = 'tabs';
 
    const tabsNav = document.createElement('div');
    tabsNav.classList.add('tabs-header', 'row');
 
    const tabsContent = document.createElement('div');
    tabsContent.classList.add('tabs-content-wrapper');
 
    // Get all tab sections (excluding metadata)
    const tabSections = Array.from(tabsSection.children).filter(
      child => !child.classList.contains('section-metadata')
    );
 
    // Process each tab
    tabSections.forEach((section, index) => {
      // Get tab title from metadata
      const metadata = section.querySelector('.section-metadata');
      let tabTitle = `Tab ${index + 1}`;
      if (metadata) {
        const titleDivs = metadata.querySelectorAll('div > div');
        if (titleDivs.length >= 2) {
          tabTitle = titleDivs[1].textContent.trim();
        }
      }
 
      // Create tab button
      const tabButton = document.createElement('div');
      tabButton.classList.add('tab-title', 'col-xl-6', 'col-lg-6', 'col-md-6', 'col-sm-6');
      tabButton.setAttribute('role', 'tab');
      tabButton.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
      tabButton.dataset.index = index;
      tabButton.textContent = tabTitle;
 
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
 
      // Process blocks in the section
      const blocks = section.querySelectorAll('div[class]');
      blocks.forEach(block => {
        if (!block.classList.contains('section-metadata')) {
          const blockName = Array.from(block.classList)[0];
          if (blockName) {
            block.classList.add('block');
            block.dataset.blockName = blockName;
            if (index === 0) {
              loadBlock(block);
            }
          }
        }
      });
 
      // Move section content to panel
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
    container.appendChild(tabsWrapper);
 
    // Replace original section with new structure
    tabsSection.parentNode.replaceChild(container, tabsSection);
 
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
      const panels = tabsContent.querySelectorAll('.tab-panel');
      panels.forEach((panel, i) => {
        const isVisible = i === index;
        panel.classList.toggle('active', isVisible);
        panel.setAttribute('aria-hidden', !isVisible);
 
        if (isVisible) {
          const blocks = panel.querySelectorAll('[data-block-name]');
          blocks.forEach(block => loadBlock(block));
        }
      });
    });
  });
}