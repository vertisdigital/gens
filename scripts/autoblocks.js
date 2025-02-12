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
      const cssPath = `${window.hlx.codeBasePath}/blocks/${blockName}/${blockName}.css`;
      await loadCSS(cssPath);

      const jsPath = `${window.hlx.codeBasePath}/blocks/${blockName}/${blockName}.js`;
      try {
        const module = await import(jsPath);
        if (module.default) {
          module.default(block);
        }
      } catch (error) {
        console.debug(`No JS module for block ${blockName}`);
      }
    } catch (error) {
      console.error(`Error loading block ${blockName}:`, error);
    }
  }

  sections.forEach((section) => {
    const topContainer = document.createElement('div');
    topContainer.classList = 'container-xl container-lg container-md container-sm';

    const tabsWrapper = document.createElement('div');
    tabsWrapper.classList.add('tabs-container', 'block');
    tabsWrapper.dataset.blockName = 'tabs';

    const tabsNav = document.createElement('div');
    tabsNav.classList.add('tabs-header', 'row');

    const tabsContent = document.createElement('div');
    tabsContent.classList.add('tabs-content');

    // Store original sections for content tree
    const originalSections = Array.from(section.children).filter(
      child => !child.classList.contains('section-metadata')
    );

    // Process each section
    originalSections.forEach((originalSection, index) => {
      const metadata = originalSection.querySelector('.section-metadata > div :last-child');
      const tabTitle = metadata ? metadata.textContent.trim() : `Tab ${index + 1}`;

      const tabButton = document.createElement('div');
      tabButton.classList.add('tab-title', 'col-xl-6', 'col-lg-6', 'col-md-3', 'col-sm-2');
      tabButton.dataset.index = index;
      tabButton.textContent = tabTitle;

      const tabPanel = document.createElement('div');
      tabPanel.classList.add('tab-panel');
      if (index === 0) {
        tabButton.classList.add('active');
        tabPanel.classList.add('active');
      }

      // Clone content for tab panel
      const clonedContent = originalSection.cloneNode(true);
      clonedContent.querySelector('.section-metadata')?.remove();
      tabPanel.appendChild(clonedContent);

      tabsNav.appendChild(tabButton);
      tabsContent.appendChild(tabPanel);
    });

    // Build structure
    tabsWrapper.appendChild(tabsNav);
    tabsWrapper.appendChild(tabsContent);
    topContainer.appendChild(tabsWrapper);

    // Insert tabs while keeping original content
    section.insertBefore(topContainer, section.firstChild);

    // Hide original sections but keep them in the DOM
    originalSections.forEach(originalSection => {
      originalSection.style.display = 'none';
      originalSection.dataset.tabContent = 'true';
    });

    // Handle tab switching
    tabsNav.addEventListener('click', (event) => {
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
      tabsContent.children[index]?.classList.add('active');
    });
  });
}