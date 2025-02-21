/**
 * Creates the basic tab structure
 * @param {Element} main The container element
 * @returns {Object|null} The created container elements or null
 */
function createTabStructure(main) {
  const tabElements = main.querySelectorAll('div[data-tabtitle]');
  if (tabElements.length === 0) return null;

  const tabsContainer = document.createElement('div');
  tabsContainer.className = 'tabs-container section tab-container';
  tabsContainer.setAttribute('data-section-status', 'loaded');

  const tabNav = document.createElement('div');
  tabNav.className = 'tab-nav';
  tabNav.style.display = 'flex';

  const tabWrapper = document.createElement('div');
  tabWrapper.className = 'tab-wrapper';

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

  return { tabTitle, tabPanel };
}

/**
 * Assembles the tab structure
 * @param {Object} elements The tab elements to assemble
 * @returns {Object} References to assembled elements
 */
function assembleTabStructure({ tabElements, tabsContainer, tabNav, tabWrapper }) {
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

  return { tabs, panels, container: tabsContainer };
}

/**
 * Updates tab states
 * @param {Array} tabs Tab elements
 * @param {Array} panels Panel elements
 * @param {number} activeIndex Index to activate
 */
function updateTabStates(tabs, panels, activeIndex) {
  tabs.forEach(tab => tab.classList.remove('active'));
  panels.forEach(panel => panel.classList.remove('active'));

  tabs[activeIndex].classList.add('active');
  panels[activeIndex].classList.add('active');
}

/**
 * Adds click functionality to tabs
 * @param {Object} elements References to tab elements
 */
function addTabFunctionality({ tabs, panels, container }) {
  if (!tabs || !panels || !container) {
    console.warn('Missing required elements:', { tabs, panels, container });
    return;
  }

  // Event delegation on tab container
  container.addEventListener('click', (e) => {
    const clickedTab = e.target.closest('.tab-title');
    if (!clickedTab) return;

    const index = Number(clickedTab.dataset.tabIndex);
    if (isNaN(index)) return;

    updateTabStates(tabs, panels, index);
  });
}

/**
 * Main function to process tabs
 * @param {Element} main The container element
 */
function processTabs(main) {
  try {
    const structure = createTabStructure(main);
    if (!structure) {
      console.log('No tab elements found');
      return;
    }

    const elements = assembleTabStructure(structure);
    main.prepend(elements.container);

    // Remove original sections
    structure.tabElements.forEach(section => section.remove());

    // Add functionality after DOM insertion
    addTabFunctionality(elements);

  } catch (error) {
    console.error('Error processing tabs:', error);
  }
}

export default processTabs;
