/* eslint-disable no-console */
import { errorLogger as logger } from "./logger.js";

/**
 * Creates the basic tab structure
 * @param {Element} main The container element
 * @returns {Object|null} The created container elements or null
 */
function createTabStructure(main) {
  
  const tabElements = main.querySelectorAll('div[data-tabtitle]');
  if (tabElements.length === 0) {
    //console.warn('[Tab System] No tab elements found.');
    return null;
  }

  const tabsContainer = document.createElement('div');
  tabsContainer.className = 'tabs-container section tab-container container-xl container-md container-sm tabpanel';
  tabsContainer.setAttribute('data-section-status', 'loaded');
  tabsContainer.style.display = 'none';

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
 * Finds the index of the tab with data-active="true"
 * @param {NodeList} tabElements The tab elements
 * @returns {number} Index of active tab or -1 if none found
 */
function findActiveTabIndex(tabElements) {
  for (let i = 0; i < tabElements.length; i += 1) {
    if (tabElements[i].getAttribute('data-active') === 'true') {
      return i;
    }
  }
  return -1;
}

/**
 * Gets the initial active tab index based on URL hash or data-active attribute
 * @param {NodeList} tabElements The tab elements
 * @returns {number} Index of tab to activate
 */
function getInitialActiveTab(tabElements) {
  // First check for URL hash (URL hash has highest priority)
  const hash = window.location.hash;
  if (hash === '#rws') {
    return 0;
  } else if (hash === '#rws2') {
    return 1;
  }
  
  // Then check for data-active="true" attribute
  const activeIndex = findActiveTabIndex(tabElements);
  if (activeIndex !== -1) {
    return activeIndex;
  }
  
  // Default to first tab if no active tab specified
  return 0;
}

/**
 * Creates individual tab elements
 * @param {Element} section The section to create tab from
 * @param {number} index Tab index
 * @param {number} activeIndex Index of active tab
 * @returns {Object} Created tab elements
 */
function createTabElement(section, index, activeIndex) {
  const titleText = section.getAttribute('data-tabtitle');

  const tabTitle = document.createElement('div');
  tabTitle.textContent = titleText;
  tabTitle.className = 'tab-title';
  tabTitle.setAttribute('role', 'tab');
  tabTitle.setAttribute('data-tab-index', index);
  tabTitle.setAttribute('tabindex', '0');
  if (index === activeIndex) tabTitle.classList.add('active');

  const tabPanel = section.cloneNode(true);
  tabPanel.classList.add('tab', 'block', 'tab-panel');
  tabPanel.setAttribute('data-block-name', 'tab');
  tabPanel.setAttribute('data-block-status', 'loaded');
  tabPanel.setAttribute('role', 'tabpanel');
  tabPanel.setAttribute('data-tab-index', index);
  tabPanel.classList.toggle('active', index === activeIndex);

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
  const activeIndex = getInitialActiveTab(tabElements);

  tabElements.forEach((section, index) => {
    const { tabTitle, tabPanel } = createTabElement(section, index, activeIndex);

    tabs.push(tabTitle);
    panels.push(tabPanel);

    tabNav.appendChild(tabTitle);
    tabWrapper.appendChild(tabPanel);
  });

  tabsContainer.appendChild(tabNav);
  tabsContainer.appendChild(tabWrapper);

  return { tabs, panels, container: tabsContainer, activeTabIndex: activeIndex };
}

/**
 * Scrolls to the tab container smoothly
 * @param {Element} container The tab container to scroll to
 */
function scrollToTabs(container) {
  const headerOffset = 100; // Adjust this value based on your fixed header height
  const elementPosition = container.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.scrollY - headerOffset;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
}

/**
 * Updates tab states and handles scrolling
 * @param {Array} tabs Tab elements
 * @param {Array} panels Panel elements
 * @param {number} activeIndex Index to activate
 * @param {boolean} shouldScroll Whether to scroll to the tabs
 */
function updateTabStates(tabs, panels, activeIndex, shouldScroll = true) {
  // Update tabs
  tabs.forEach((tab) => tab.classList.remove('active'));
  tabs[activeIndex].classList.add('active');

    const tabsContainer = document.querySelector('.tab-nav');
    const tabWidth = tabs[activeIndex].offsetWidth;
    const containerWidth = tabsContainer.offsetWidth;
    const tabPosition = tabs[activeIndex].offsetLeft;

    const centerOffset = tabPosition - (containerWidth - tabWidth) / 2;
    
    tabsContainer.scrollTo({
      left: centerOffset,
      behavior: 'smooth'
    });
  
  // Update panels
  panels.forEach((panel) => panel.classList.remove('active'));
  panels[activeIndex].classList.add('active');

  // Scroll to tabs if needed
  if (shouldScroll) {
    const container = tabs[0].closest('.tabs-container');
    if (container) {
      scrollToTabs(container);
    }
  }
}

/**
 * Adds click functionality to tabs using event delegation
 * @param {Object} elements References to tab elements
 */
function addTabFunctionality({ tabs, panels, container, activeTabIndex }) {
  if (!tabs || !panels || !container) {
    console.warn('[Tab System] Missing required elements:', { tabs, panels, container });
    return;
  }

  const tabNav = container.querySelector('.tab-nav');

  if (!tabNav) {
    console.warn('⚠️ .tab-nav not found when adding event listener!');
    return;
  }

  // Handle URL hash changes
  window.addEventListener('hashchange', () => {
    // Pass tabElements to getInitialActiveTab
    const tabElements = container.querySelectorAll('.tab-panel');
    const newIndex = getInitialActiveTab(tabElements);
    updateTabStates([...tabNav.children], [...container.querySelector('.tab-wrapper').children], newIndex, true);
  });

  // Handle initial page load hash after a short delay to ensure DOM is ready
  setTimeout(() => {
    const isScroll = window.location.hash !== '';
    updateTabStates([...tabNav.children], [...container.querySelector('.tab-wrapper').children], activeTabIndex, isScroll);
  }, 1000); // Slightly after the container display timeout

  tabNav.addEventListener('click', (e) => {
    const clickedTab = e.target.closest('.tab-title');
    if (!clickedTab) return;

    const index = Number(clickedTab.getAttribute('data-tab-index'));
    updateTabStates([...tabNav.children], [...container.querySelector('.tab-wrapper').children], index, true);
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

    // Show the tab container after 1000ms
    setTimeout(() => {
      elements.container.style.display = 'block';
    }, 1000);

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
    logger.error(`[Tab System] Error processing tabs:, ${error}`);
  }
}

export default processTabs;
