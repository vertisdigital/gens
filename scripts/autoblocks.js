import { loadCSS } from './aem.js';
import Heading from '../shared-components/Heading.js';
import stringToHTML from '../shared-components/Utility.js';
/**
 * Process all the tab auto blocks
 * @param {Element} main The container element
 */
function handleTabStyles(main) {
  try {
    console.log('Starting handleTabStyles');
    console.log('Current main HTML:', main.innerHTML);

    // Look for sections with data-tabtitle attribute
    const tabElements = main.querySelectorAll('div[data-tabtitle]');
    console.log('Found tab elements:', tabElements.length, tabElements);
    
    if (tabElements.length > 0) {
      // Create tabs container
      const tabsContainer = document.createElement('div');
      tabsContainer.className = 'tabs-container section tab-container';
      tabsContainer.setAttribute('data-section-status', 'loaded');
      
      // Create tab navigation
      const tabNav = document.createElement('div');
      tabNav.className = 'tab-nav';
      
      // Create tab wrapper for content
      const tabWrapper = document.createElement('div');
      tabWrapper.className = 'tab-wrapper';
      
      // Process each tab
      tabElements.forEach((section, index) => {
        const tabTitle = section.getAttribute('data-tabtitle');
        
        // Create tab button
        const tabButton = document.createElement('button');
        tabButton.textContent = tabTitle;
        tabButton.className = 'tab-button';
        tabButton.setAttribute('data-tab-index', index);
        if (index === 0) tabButton.classList.add('active');
        tabNav.appendChild(tabButton);
        
        // Clone and prepare content
        const clonedSection = section.cloneNode(true);
        clonedSection.classList.add('tab', 'block');
        clonedSection.setAttribute('data-block-name', 'tab');
        clonedSection.setAttribute('data-block-status', 'loaded');
        clonedSection.style.display = index === 0 ? 'block' : 'none';
        tabWrapper.appendChild(clonedSection);
      });

      // Build structure
      tabsContainer.appendChild(tabNav);
      tabsContainer.appendChild(tabWrapper);
      
      // Replace main content
      main.innerHTML = '';
      main.appendChild(tabsContainer);
      
      // Add click handlers
      tabNav.addEventListener('click', (e) => {
        const button = e.target.closest('.tab-button');
        if (!button) return;
        
        const index = button.getAttribute('data-tab-index');
        const tabs = tabWrapper.querySelectorAll('.tab');
        
        // Update active states
        tabNav.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Show/hide content
        tabs.forEach((tab, i) => {
          tab.style.display = i === parseInt(index) ? 'block' : 'none';
        });
      });
    }
  } catch (error) {
    console.error('Error in handleTabStyles:', error);
  }
}

export default function processTabs(main) {
  handleTabStyles(main);
}
