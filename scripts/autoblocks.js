import { loadCSS } from './aem.js';
import Heading from '../shared-components/Heading.js';
import stringToHTML from '../shared-components/Utility.js';
/**
 * Process all the tab auto blocks
 * @param {Element} main The container element
 */
// Add global click handler once
document.addEventListener('click', function(e) {
  const tabLink = e.target.closest('.tab-link');
  if (!tabLink) return;
  
  e.preventDefault();
  console.log('Tab clicked:', tabLink.textContent);
  
  const container = tabLink.closest('.tab-container');
  if (!container) return;
  
  const index = parseInt(tabLink.getAttribute('data-tab-index'), 10);
  
  // Update active states
  container.querySelectorAll('.tab-link').forEach(link => link.classList.remove('active'));
  tabLink.classList.add('active');
  
  // Show/hide content
  container.querySelectorAll('.tab').forEach((tab, i) => {
    tab.classList.toggle('active', i === index);
  });
});

function handleTabStyles(main) {
  try {
    console.log('Starting handleTabStyles');
    console.log('Current main HTML:', main.innerHTML);

    // Look for sections with data-tabtitle attribute
    const tabElements = main.querySelectorAll('div[data-tabtitle]');
    console.log('Found tab elements:', tabElements);
    
    if (tabElements.length > 0) {
      // Create tabs container
      const tabsContainer = document.createElement('div');
      tabsContainer.className = 'tabs-container section tab-container';
      tabsContainer.setAttribute('data-section-status', 'loaded');
      
      // Create tab navigation
      const tabNav = document.createElement('div');
      tabNav.className = 'tab-nav';
      console.log('Created tab nav:', tabNav);
      
      // Create tab wrapper for content
      const tabWrapper = document.createElement('div');
      tabWrapper.className = 'tab-wrapper';
      
      // Process each tab
      tabElements.forEach((section, index) => {
        const tabTitle = section.getAttribute('data-tabtitle');
        
        // Create tab link
        const tabLink = document.createElement('a');
        tabLink.textContent = tabTitle;
        tabLink.href = '#';
        tabLink.className = 'tab-link';
        tabLink.setAttribute('data-tab-index', index);
        if (index === 0) tabLink.classList.add('active');
        tabNav.appendChild(tabLink);
        
        // Clone and prepare content
        const clonedSection = section.cloneNode(true);
        clonedSection.classList.add('tab', 'block');
        clonedSection.setAttribute('data-block-name', 'tab');
        clonedSection.setAttribute('data-block-status', 'loaded');
        clonedSection.classList.toggle('active', index === 0);
        tabWrapper.appendChild(clonedSection);
      });

      // Build structure
      tabsContainer.appendChild(tabNav);
      tabsContainer.appendChild(tabWrapper);
      
      // Replace only the tab sections
      tabElements.forEach(section => section.remove());
      main.prepend(tabsContainer);
      
      console.log('Tab structure complete');
    }
  } catch (error) {
    console.error('Error in handleTabStyles:', error);
  }
}

export default function processTabs(main) {
  handleTabStyles(main);
}
