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
  //moveInstrumentation(section, topContainer);

 
  const tabsWrapper = document.createElement('div');
  tabsWrapper.classList.add('tabs-container', 'block');
  tabsWrapper.dataset.blockName = 'tabs';
 
  const tabsNav = document.createElement('div');
  tabsNav.classList.add('tabs-header', 'row');
 
  // Create tab0 and tab1 containers with data blocks
  const tab0Block = document.createElement('div');
  tab0Block.classList.add('tab0-block', 'block');
  tab0Block.dataset.blockName = 'tabs';
  tab0Block.dataset.aueModel = 'tabs';

  const tab1Block = document.createElement('div');
  tab1Block.classList.add('tab1-block', 'block');
  tab1Block.dataset.blockName = 'tabs';
  tab1Block.dataset.aueModel = 'tabs';

  const tab0 = document.createElement('div');
  tab0.classList.add('tab0');
  tab0Block.appendChild(tab0);

  const tab1 = document.createElement('div');
  tab1.classList.add('tab1');
  tab1Block.appendChild(tab1);

  // Create tabs-content container
  const tabsContent = document.createElement('div');
  tabsContent.classList.add('tabs-content');
 
  sections.forEach((section, index) => {
    const metadata = section.querySelector('.section-metadata > div :last-child');
    const tabTitle = metadata ? metadata.textContent.trim() : `Tab ${index + 1}`;
 
    const tabButton = document.createElement('div');
    tabButton.classList.add('tab-title', 'col-xl-6', 'col-lg-6', 'col-md-3', 'col-sm-2');
    tabButton.dataset.index = index;
    tabButton.textContent = tabTitle;
 
    // Create panel in original tab container
    const originalPanel = document.createElement('div');
    originalPanel.classList.add('tab-panel');
    originalPanel.dataset.tabIndex = index;
    originalPanel.dataset.blockName = 'tabs';
    moveInstrumentation(section, originalPanel);
 
    // Process blocks in the section
    const blocks = section.querySelectorAll('div[class]');
    blocks.forEach(block => {
      const classes = Array.from(block.classList);
      classes.forEach(className => {
        if (!className.includes('section-metadata') &&
            !className.startsWith('tabs-') &&
            !className.startsWith('col-')) {
          const newBlock = document.createElement('div');
          newBlock.classList.add(className, 'block');
          newBlock.dataset.blockName = className;
          
          // Copy content and all attributes
          newBlock.innerHTML = block.innerHTML;
          Array.from(block.attributes).forEach(attr => {
            newBlock.setAttribute(attr.name, attr.value);
          });
          
          block.replaceWith(newBlock);
          
          if (index === 0) {
            loadBlock(newBlock);
          }
        }
      });
    });
 
    // Move content to original panel
    Array.from(section.children).forEach(child => {
      if (!child.classList?.contains('section-metadata')) {
        originalPanel.appendChild(child);
      }
    });
 
    // Add panel to appropriate tab container
    if (index === 0) {
      tab0.appendChild(originalPanel);
      tabButton.classList.add('active');
    } else {
      tab1.appendChild(originalPanel);
    }
 
    tabsNav.appendChild(tabButton);
  });
 
  // Remove original sections
  sections.forEach(section => section.remove());
 
  // Build structure
  tabsWrapper.appendChild(tabsNav);
  tabsWrapper.appendChild(tab0Block);
  tabsWrapper.appendChild(tab1Block);
  tabsWrapper.appendChild(tabsContent);
  topContainer.appendChild(tabsWrapper);
  main.appendChild(topContainer);
 
  let contentCloned = false;
 
  // Handle tab switching
  tabsNav.addEventListener('click', async (event) => {
    const tabButton = event.target.closest('.tab-title');
    if (!tabButton) return;
 
    const index = parseInt(tabButton.dataset.index, 10);
    if (Number.isNaN(index)) return;
 
    // Update active tab
    tabsWrapper.querySelectorAll('.tab-title').forEach(btn => {
      btn.classList.remove('active');
    });
    tabButton.classList.add('active');
 
    // Clone content to tabs-content if not already done
    if (!contentCloned) {
      const sourcePanel = index === 0 ? 
        tab0.querySelector('.tab-panel') :
        tab1.querySelector('.tab-panel');
      
      const clonedPanel = sourcePanel.cloneNode(true);
      clonedPanel.classList.add('active');
      tabsContent.appendChild(clonedPanel);
      
      // Load blocks in cloned panel
      const blocks = clonedPanel.querySelectorAll('[data-block-name]');
      await Promise.all(Array.from(blocks).map(block => loadBlock(block)));
      
      contentCloned = true;
    } else {
      // Toggle visibility of panels
      tabsContent.querySelectorAll('.tab-panel').forEach(panel => {
        const panelIndex = parseInt(panel.dataset.tabIndex, 10);
        panel.classList.toggle('active', panelIndex === index);
      });
    }
  });
}