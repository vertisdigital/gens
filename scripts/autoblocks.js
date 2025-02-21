/**
 * Creates the basic tab structure
 * @param {Element} main The container element
 * @returns {Object|null} The created container elements or null
 */
function createTabStructure(main) {
  console.log('[Tab System] Initializing tab structure...');
  const tabElements = main.querySelectorAll('div[data-tabtitle]');
  if (tabElements.length === 0) {
    console.warn('[Tab System] No tabs found. Exiting function.');
    return null;
  }

  console.log(`[Tab System] Found ${tabElements.length} tabs. Creating structure...`);

  const tabsContainer = document.createElement('div');
  tabsContainer.className = 'tabs-container section tab-container';
  tabsContainer.setAttribute('data-section-status', 'loaded');

  const tabNav = document.createElement('div');
  tabNav.className = 'tab-nav';
  tabNav.style.display = 'flex';

  const tabWrapper = document.createElement('div');
  tabWrapper.className = 'tab-wrapper';

  console.log('[Tab System] Basic tab structure created.');
  return { tabElements, tabsContainer, tabNav, tabWrapper };
}

/**
 * Creates individual tab elements
 * @param {Element} section The section to create a tab from
 * @param {number} index Tab index
 * @returns {Object} Created tab elements
 */
function createTabElement(section, index) {
  const titleText = section.getAttribute('data-tabtitle');

  console.log(`[Tab System] Creating tab ${index + 1}: "${titleText}"`);

  const tabTitle = document.createElement('div');
  tabTitle.textContent = titleText;
  tabTitle.className = 'tab-title';
  tabTitle.setAttribute('role', 'tab');
  tabTitle.dataset.tabIndex = index;
  tabTitle.setAttribute('tabindex', '0');
  if (index === 0) tabTitle.classList.add('active');

  const tabPanel = section.cloneNode(true);
  tabPanel.classList.add('tab', 'block');
  tabPanel.dataset.blockName = 'tab';
  tabPanel.dataset.blockStatus = 'loaded';
  tabPanel.setAttribute('role', 'tabpanel');
  tabPanel.dataset.tabIndex = index;
  tabPanel.classList.toggle('active', index === 0);

  console.log(`[Tab System] Tab "${titleText}" created successfully.`);

  return { tabTitle, tabPanel };
}

/**
 * Assembles the tab structure
 * @param {Object} elements The tab elements to assemble
 * @returns {Object} References to assembled elements
 */
function assembleTabStructure({ tabElements, tabsContainer, tabNav, tabWrapper }) {
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

  tabsContainer.appendChild(tabNav);
  tabsContainer.appendChild(tabWrapper);

  console.log('[Tab System] Tab structure assembled successfully.');
  return { tabs, panels, container: tabsContainer };
}

/**
 * Updates tab states
 * @param {Array} tabs Tab elements
 * @param {Array} panels Panel elements
 * @param {number} activeIndex Index to activate
 */
function updateTabStates(tabs, panels, activeIndex) {
  console.log(`[Tab System] Updating tab states... Active Tab Index: ${activeIndex}`);

  tabs.forEach(tab => tab.classList.remove('active'));
  panels.forEach(panel => panel.classList.remove('active'));

  tabs[activeIndex].classList.add('active');
  panels[activeIndex].classList.add('active');

  console.log(`[Tab System] Activated Tab: "${tabs[activeIndex].textContent}"`);
}

/**
 * Adds click functionality to tabs
 * @param {Object} elements References to tab elements
 */
function addTabFunctionality({ tabs, panels, container }) {
  if (!tabs || !panels || !container) {
    console.warn('[Tab System] Missing required elements for tab functionality:', { tabs, panels, container });
    return;
  }

  console.log('[Tab System] Adding event delegation for tab clicks.');

  // Event delegation on tab container
  container.addEventListener('click', (e) => {
    const clickedTab = e.target.closest('.tab-title');
    if (!clickedTab) return;

    const index = Number(clickedTab.dataset.tabIndex);
    if (isNaN(index)) {
      console.warn('[Tab System] Clicked tab does not have a valid index:', clickedTab);
      return;
    }

    console.log(`[Tab System] Tab clicked: "${clickedTab.textContent}" (Index: ${index})`);
    updateTabStates(tabs, panels, index);
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
    
    // Step 1: Create basic structure
    const structure = createTabStructure(main);
    if (!structure) {
      console.log('[Tab System] No tab elements found.');
      return;
    }

    console.log('[Tab System] Tab structure created successfully.');

    // Step 2: Assemble structure
    const elements = assembleTabStructure(structure);
    console.log('[Tab System] Tab elements assembled:', elements);

    // Step 3: Add to DOM FIRST
    main.prepend(elements.container);
    console.log('[Tab System] Tab structure added to the DOM.');

    // Step 4: Remove original sections
    structure.tabElements.forEach(section => section.remove());
    console.log('[Tab System] Removed original sections.');

    // Step 5: Attach event listeners AFTER ensuring tabs exist in the DOM
    setTimeout(() => {
      addTabFunctionality(elements);
      console.log('[Tab System] Event handlers attached successfully.');
    }, 100); // Small delay to ensure tabs exist

    console.log('[Tab System] Tab setup complete. Ready for interaction.');
  } catch (error) {
    console.error('[Tab System] Error processing tabs:', error);
  }
}


export default processTabs;
