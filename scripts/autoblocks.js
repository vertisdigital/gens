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

  return {
    tabElements,
    tabsContainer,
    tabNav,
    tabWrapper
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
  tabTitle.className = 'tab-title';
  tabTitle.setAttribute('data-tab-index', index);
  if (index === 0) tabTitle.classList.add('active');
  
  const tabPanel = section.cloneNode(true);
  tabPanel.classList.add('tab', 'block');
  tabPanel.setAttribute('data-block-name', 'tab');
  tabPanel.setAttribute('data-block-status', 'loaded');
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
  console.log('Updating tab states:', {
    activeIndex,
    totalTabs: tabs.length,
    totalPanels: panels.length
  });

  // Update tabs
  tabs.forEach(tab => tab.classList.remove('active'));
  tabs[activeIndex].classList.add('active');
  
  // Update panels
  panels.forEach(panel => panel.classList.remove('active'));
  panels[activeIndex].classList.add('active');

  console.log('States updated:', {
    activeTab: tabs[activeIndex].textContent,
    activePanel: panels[activeIndex].getAttribute('data-tabtitle')
  });
}

/**
 * Adds click functionality to tabs
 * @param {Object} elements References to tab elements
 */
function addTabFunctionality({ tabs, panels }) {
  if (!tabs || !panels) return;
  
  console.log('Adding click handlers to tabs:', {
    numTabs: tabs.length,
    numPanels: panels.length
  });
  
  // Add click handler to each tab
  tabs.forEach((tab, index) => {
    // Remove any existing click handlers
    tab.replaceWith(tab.cloneNode(true));
    const newTab = tabs[index] = tab.cloneNode(true);
    
    // Add onclick handler instead of addEventListener
    newTab.onclick = function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      console.log('Tab clicked:', {
        index,
        text: this.textContent,
        event: e
      });

      // Update tabs
      tabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      
      // Update panels
      panels.forEach(p => p.classList.remove('active'));
      panels[index].classList.add('active');
      
      return false;
    };
    
    // Replace old tab with new one
    tab.parentNode.replaceChild(newTab, tab);
  });
  
  // Also add click handler to tab nav container as backup
  const tabNav = tabs[0].parentElement;
  tabNav.onclick = function(e) {
    const clickedTab = e.target.closest('.tab-title');
    if (!clickedTab) return;
    
    const index = Array.from(tabs).indexOf(clickedTab);
    if (index === -1) return;
    
    console.log('Tab clicked via container:', {
      index,
      text: clickedTab.textContent
    });
    
    // Update states
    tabs.forEach(t => t.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));
    
    clickedTab.classList.add('active');
    panels[index].classList.add('active');
  };
}

/**
 * Main function to process tabs
 * @param {Element} main The container element
 */
function processTabs(main) {
  try {
    console.log('Processing tabs for:', main);
    
    // Create basic structure
    const structure = createTabStructure(main);
    if (!structure) {
      console.log('No tab elements found');
      return;
    }

    console.log('Tab structure created:', structure);

    // Assemble the structure
    const elements = assembleTabStructure(structure);
    console.log('Tab elements assembled:', elements);

    // Remove original sections
    structure.tabElements.forEach(section => section.remove());

    // Add to DOM
    main.prepend(elements.container);

    // Add functionality
    addTabFunctionality(elements);
  } catch (error) {
    console.error('Error processing tabs:', error);
  }
}

export default processTabs;
