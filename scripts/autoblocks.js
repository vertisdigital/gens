import { loadCSS } from './aem.js';
import Heading from '../shared-components/Heading.js';
import stringToHTML from '../shared-components/Utility.js';
/**
 * Process all the tab auto blocks
 * @param {Element} main The container element
 */
export default function processTabs(main, moveInstrumentation) {
  const mainWrapper = main.querySelector('[data-aue-label="tabspanel"]');
  const tabSections = [
    ...main.querySelectorAll('[data-aue-model="tabs"]:not(.section-metadata)'),
  ];
  if (tabSections.length === 0) return;

  // Function to load block CSS and JS
  async function loadBlock(block) {
    const { blockName } = block.dataset;
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
        // eslint-disable-next-line no-console
        console.debug(`No JS module for block ${blockName}`);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Error loading block ${blockName}:`, error);
    }
  }

  const topContainer = document.createElement('div');
  topContainer.classList = 'container-xl container-lg container-md container-sm tabpanel';

  if (mainWrapper) {
    moveInstrumentation(mainWrapper, topContainer);
  }

  const tabsWrapper = document.createElement('div');
  tabsWrapper.classList.add('tabs-container', 'block');
  tabsWrapper.dataset.blockName = 'tabs';

  const tabsNav = document.createElement('div');
  tabsNav.classList.add('tabs-header', 'row');

  const tabsContent = document.createElement('div');
  tabsContent.classList.add('tabs-content');

  tabSections.forEach((section, index) => {
    const metadata = section.querySelector('.section-metadata > div :last-child');
    const tabTitle = metadata ? metadata.textContent.trim() : `Tab ${index + 1}`;

    const tabButton = document.createElement('div');
    tabButton.classList.add('tab-title', 'col-xl-6', 'col-lg-6', 'col-md-3', 'col-sm-2');
    tabButton.dataset.index = index;
    tabButton.textContent = tabTitle;

    const tabPanel = document.createElement('div');
    tabPanel.classList.add('tab-panel');
    moveInstrumentation(section, tabPanel);

    // Set initial active state for first tab
    if (index === 0) {
      tabButton.classList.add('active');
      tabPanel.classList.add('active');
    }

    // Process blocks in the section
    const blocks = section.querySelectorAll('div[class]');
    blocks.forEach((block) => {
      const classes = Array.from(block.classList);
      classes.forEach((className) => {
        if (!className.includes('section-metadata')
            && !className.startsWith('tabs-')
            && !className.startsWith('col-')) {
          // Create a new block element
          const newBlock = document.createElement('div');
          newBlock.classList.add(className, 'block');
          newBlock.dataset.blockName = className;

          // Copy content and attributes
          newBlock.innerHTML = block.innerHTML;
          Array.from(block.attributes).forEach((attr) => {
            if (!attr.name.startsWith('class')) {
              newBlock.setAttribute(attr.name, attr.value);
            }
          });

          // Replace original block with new one
          block.replaceWith(newBlock);

          // If this is in the first tab, load the block immediately
          if (index === 0) {
            loadBlock(newBlock);
          }
        }
      });
    });

    // Move content to panel
    Array.from(section.children).forEach((child) => {
      if (!child.classList?.contains('section-metadata')) {
        tabPanel.appendChild(child);
      }
    });

    tabsNav.appendChild(tabButton);
    tabsContent.appendChild(tabPanel);
  });

  // Remove original sections
  tabSections.forEach((section) => section.remove());

  // Build structure
  tabsWrapper.appendChild(tabsNav);
  tabsWrapper.appendChild(tabsContent);
  topContainer.appendChild(tabsWrapper);

  //Processing the tab section headings
  const tabSectionMetaData = mainWrapper.querySelector('[data-block-name="section-metadata"]');
  tabSectionMetaData.classList.add('panel-heading');
  // all meta data
  tabSectionMetaData.querySelectorAll(':scope > div').forEach((metaData) => {
    const metaDataBlocks = metaData.querySelectorAll(':scope > div');
    if (metaDataBlocks[0].textContent.trim() === 'panelheading') {
      const headingText = metaDataBlocks[1].textContent.trim();
      const panelHeading = document.createElement('div');
      const headingHtml = Heading({ level: 2, text: headingText, className: '' });
      const parsedHtml = stringToHTML(headingHtml);
      panelHeading.appendChild(parsedHtml);
      tabSectionMetaData.appendChild(panelHeading);
    }
    metaData.remove();
  });
  topContainer.insertBefore(tabSectionMetaData, topContainer.firstChild);

  const tabsPosition = main.querySelector('[data-aue-label="tabsposition"]');
  main.insertBefore(topContainer, tabsPosition || main.firstChild);

  // Handle tab switching
  tabsNav.addEventListener('click', async (event) => {
    const tabButton = event.target.closest('.tab-title');
    if (!tabButton) return;

    const index = parseInt(tabButton.dataset.index, 10);
    if (Number.isNaN(index)) return;

    // Update tabs
    tabsWrapper.querySelectorAll('.tab-title').forEach((btn) => {
      btn.classList.remove('active');
    });
    tabButton.classList.add('active');

    // Update panels
    tabsWrapper.querySelectorAll('.tab-panel').forEach((panel) => {
      panel.classList.remove('active');
    });

    const activePanel = tabsContent.children[index];
    if (activePanel) {
      activePanel.classList.add('active');

      // Load blocks in the newly active panel if not already loaded
      const blocks = activePanel.querySelectorAll('[data-block-name]');
      await Promise.all(Array.from(blocks).map((block) => loadBlock(block)));
    }
  });
}
