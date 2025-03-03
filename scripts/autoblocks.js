/* eslint-disable no-console */

/**
 * Creates the basic tab structure
 * @param {Element} main The container element
 * @returns {Object|null} The created container elements or null
 */
function createTabStructure(main) {
  
  const tabElements = main.querySelectorAll('div[data-tabtitle]');
  if (tabElements.length === 0) {
    console.warn('[Tab System] No tab elements found.');
    return null;
  }

  const tabsContainer = document.createElement('div');
  tabsContainer.className = 'tabs-container section tab-container container-xl container-lg container-md container-sm tabpanel';
  tabsContainer.setAttribute('data-section-status', 'loaded');

  const tabNav = document.createElement('div');
  tabNav.className = 'tab-nav tabs-header row';
  tabNav.style.display = 'flex';

  const tabWrapper = document.createElement('div');
  tabWrapper.className = 'tab-wrapper tabs-content';

  return {
    tabElements,
    tabsContainer,
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

  const tabTitle = document.createElement('div');
  tabTitle.textContent = titleText;
  tabTitle.className = 'tab-title col-xl-6 col-lg-6 col-md-3 col-sm-2';
  tabTitle.setAttribute('role', 'tab');
  tabTitle.setAttribute('data-tab-index', index);
  tabTitle.setAttribute('tabindex', '0');
  if (index === 0) tabTitle.classList.add('active');

  const tabPanel = section.cloneNode(true);
  tabPanel.classList.add('tab', 'block', 'tab-panel');
  tabPanel.setAttribute('data-block-name', 'tab');
  tabPanel.setAttribute('data-block-status', 'loaded');
  tabPanel.setAttribute('role', 'tabpanel');
  tabPanel.setAttribute('data-tab-index', index);
  tabPanel.classList.toggle('active', index === 0);

  return { tabTitle, tabPanel };
}

/**
 * Assembles the tab structure
 * @param {Object} elements The tab elements to assemble
 * @returns {Object} References to assembled elements
 */
function assembleTabStructure({
  tabElements, tabsContainer, tabNav, tabWrapper,
}) {

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

  // Update tabs
  tabs.forEach((tab) => tab.classList.remove('active'));
  tabs[activeIndex].classList.add('active');

  // Update panels
  panels.forEach((panel) => panel.classList.remove('active'));
  panels[activeIndex].classList.add('active');
}

/**
 * Adds click functionality to tabs using event delegation
 * @param {Object} elements References to tab elements
 */
function addTabFunctionality({ tabs, panels, container }) {
  if (!tabs || !panels || !container) {
    console.warn('[Tab System] Missing required elements:', { tabs, panels, container });
    return;
  }

  const tabNav = container.querySelector('.tab-nav');

  if (!tabNav) {
    console.warn('⚠️ .tab-nav not found when adding event listener!');
    return;
  }

  tabNav.addEventListener('click', (e) => {
    const clickedTab = e.target.closest('.tab-title');
    if (!clickedTab) return;

    const index = Number(clickedTab.getAttribute('data-tab-index'));
    updateTabStates([...tabNav.children], [...container.querySelector('.tab-wrapper').children], index);
  });
}

/**
 * Main function to process tabs
 * @param {Element} main The container element
 */
function processTabs(main) {
  try {

    // Create basic structure
    const structure = createTabStructure(main);
    if (!structure) {
      return;
    }

    // Assemble the structure
    const elements = assembleTabStructure(structure);

    // Find the first tab element's position
    const firstTabElement = structure.tabElements[0];

    // Insert the tab container before the first tab element
    firstTabElement.parentNode.insertBefore(elements.container, firstTabElement);

    // Ensure tab-nav exists before adding event listeners
    if (!document.querySelector('.tab-nav')) {
      console.warn('⚠️ .tab-nav is still missing after DOM update. Retrying...');
      setTimeout(() => addTabFunctionality(elements), 100);
    } else {
      addTabFunctionality(elements);
    }

    // Remove original sections
    structure.tabElements.forEach((section) => section.remove());
  } catch (error) {
    console.error('[Tab System] Error processing tabs:', error);
  }
}

export default processTabs;
