/**
 * Creates the basic tab structure
 * @param {Element} main The container element
 * @returns {Object|null} The created container elements or null
 */
function createTabStructure(main) {
  console.log('[Tab System] Initializing tab structure...');

  const tabElements = main.querySelectorAll('div[data-tabtitle]');
  if (tabElements.length === 0) {
    console.warn('[Tab System] No tab elements found.');
    return null;
  }

  console.log(`[Tab System] Found ${tabElements.length} tabs. Creating structure...`);

  // Use the classes from the old JS
  const tabsContainer = document.createElement('div');
  tabsContainer.className = 'container-xl container-lg container-md container-sm tabpanel';

  const tabsWrapper = document.createElement('div');
  tabsWrapper.className = 'tabs-container block';
  tabsWrapper.dataset.blockName = 'tabs';

  const tabNav = document.createElement('div');
  tabNav.className = 'tabs-header row';

  const tabWrapper = document.createElement('div');
  tabWrapper.className = 'tabs-content';

  console.log('[Tab System] Basic tab structure created.');

  return {
    tabElements,
    tabsContainer,
    tabsWrapper,
    tabNav,
    tabWrapper,
  };
}

/**
 * Creates individual tab elements
 * @param {Element} section The section to create tab from
 * @param {number} index Tab index
 * @returns {Object} Created tab elements
 */
function createTabElement(section, index) {
  const titleText = section.getAttribute('data-tabtitle');

  console.log(`[Tab System] Creating tab ${index + 1}: "${titleText}"`);

  // Use the classes from the old JS
  const tabTitle = document.createElement('div');
  tabTitle.textContent = titleText;
  tabTitle.className = 'tab-title col-xl-6 col-lg-6 col-md-3 col-sm-2';
  tabTitle.setAttribute('data-index', index);
  tabTitle.setAttribute('tabindex', '0');
  if (index === 0) tabTitle.classList.add('active');

  const tabPanel = document.createElement('div');
  tabPanel.className = 'tab-panel';
  tabPanel.setAttribute('data-index', index);
  if (index === 0) tabPanel.classList.add('active');

  // Clone the content of the section into the tab panel
  Array.from(section.children).forEach((child) => {
    const clone = child.cloneNode(true);
    tabPanel.appendChild(clone);
  });

  console.log(`[Tab System] Tab "${titleText}" created successfully.`);

  return { tabTitle, tabPanel };
}

/**
 * Assembles the tab structure
 * @param {Object} elements The tab elements to assemble
 * @returns {Object} References to assembled elements
 */
function assembleTabStructure({
  tabElements, tabsContainer, tabsWrapper, tabNav, tabWrapper,
}) {
  console.log('[Tab System] Assembling tab structure...');

  const tabs = [];
  const panels = [];

  tabElements.forEach((section, index) => {
    const { tabTitle, tabPanel } = createTabElement(section, index);

    tabs.push(tabTitle);
    panels.push(tabPanel);

    tabNav.appendChild(tabTitle);
    tabWrapper.appendChild(tabPanel);
  });

  tabsWrapper.appendChild(tabNav);
  tabsWrapper.appendChild(tabWrapper);
  tabsContainer.appendChild(tabsWrapper);

  console.log('[Tab System] Tab structure assembled successfully.');

  return {
    tabs, panels, container: tabsContainer, wrapper: tabsWrapper,
  };
}

/**
 * Updates tab states
 * @param {Array} tabs Tab elements
 * @param {Array} panels Panel elements
 * @param {number} activeIndex Index to activate
 */
// function updateTabStates(tabs, panels, activeIndex) {
//   console.log(`[Tab System] Updating tab states - Active Tab Index: ${activeIndex}`);

//   // Update tabs
//   tabs.forEach((tab) => tab.classList.remove('active'));
//   tabs[activeIndex].classList.add('active');

//   // Update panels
//   panels.forEach((panel) => panel.classList.remove('active'));
//   panels[activeIndex].classList.add('active');

//   console.log(`[Tab System] Active tab: "${tabs[activeIndex].textContent}"`);
// }

/**
 * Adds click functionality to tabs using event delegation
 * @param {Object} elements References to tab elements
 */
function addTabFunctionality({
  tabs, panels, container, wrapper,
}) {
  if (!tabs || !panels || !container) {
    console.warn('[Tab System] Missing required elements:', { tabs, panels, container });
    return;
  }

  console.log('[Tab System] Adding event delegation for tab clicks.');

  const tabNav = container.querySelector('.tabs-header');

  if (!tabNav) {
    console.warn('⚠️ .tabs-header not found when adding event listener!');
    return;
  }

  console.log('✅ Found .tabs-header. Attaching click event...');

  tabNav.addEventListener('click', (event) => {
    const tabButton = event.target.closest('.tab-title');
    if (!tabButton) return;

    const index = parseInt(tabButton.getAttribute('data-index'), 10);
    if (Number.isNaN(index)) return;

    // Update tabs
    wrapper.querySelectorAll('.tab-title').forEach((btn) => {
      btn.classList.remove('active');
    });
    tabButton.classList.add('active');

    // Update panels
    wrapper.querySelectorAll('.tab-panel').forEach((panel) => {
      panel.classList.remove('active');
    });

    const activePanel = container.querySelector('.tabs-content').children[index];
    if (activePanel) {
      activePanel.classList.add('active');
    }
  });

  console.log('[Tab System] Click event handlers attached.');
}

/**
 * Main function to process tabs
 * @param {Element} main The container element
 */
function processTabs(main) {
  try {
    console.log('[Tab System] Processing tabs for:', main);

    // Create basic structure
    const structure = createTabStructure(main);
    if (!structure) {
      console.log('[Tab System] No tab elements found.');
      return;
    }

    console.log('[Tab System] Tab structure created successfully.');

    // Assemble the structure
    const elements = assembleTabStructure(structure);
    console.log('[Tab System] Tab elements assembled:', elements);

    // Find the first tab element's position
    const firstTabElement = structure.tabElements[0];

    // Insert the tab container before the first tab element
    firstTabElement.parentNode.insertBefore(elements.container, firstTabElement);
    console.log('[Tab System] Tab structure inserted at correct position.');

    // Add event functionality
    addTabFunctionality(elements);

    // Remove original sections
    structure.tabElements.forEach((section) => section.remove());
    console.log('[Tab System] Removed original sections.');

    console.log('[Tab System] Tab setup complete. Ready for interaction.');
  } catch (error) {
    console.error('[Tab System] Error processing tabs:', error);
  }
}

export default processTabs;
