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
    tabsWrapper.classList.add('tabs-container');

    const tabsNav = document.createElement('div');
    tabsNav.classList.add('tabs-header');

    const tabsContent = document.createElement('div');
    tabsContent.classList.add('tabs-content-wrapper');

    // Get sections for tabs
    const tabSections = Array.from(section.children).filter(
      child => !child.classList.contains('section-metadata')
    );

    // Process each section
    tabSections.forEach((tabSection, index) => {
      // Get tab title from metadata
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

    // Keep original sections in DOM but hide them
    tabSections.forEach(tabSection => {
      tabSection.style.visibility = 'hidden';
      tabSection.style.height = '0';
      tabSection.style.overflow = 'hidden';
    });

    // Add tabs structure
    section.insertBefore(topContainer, section.firstChild);

    // Handle tab switching
    tabsNav.addEventListener('click', (event) => {
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
      tabsContent.children[index]?.classList.add('active');
    });
  });
}