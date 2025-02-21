import { loadCSS } from './aem.js';
import Heading from '../shared-components/Heading.js';
import stringToHTML from '../shared-components/Utility.js';
/**
 * Process all the tab auto blocks
 * @param {Element} main The container element
 */
function initTabHandlers(container) {
  if (!container) return;
  
  const tabLinks = container.querySelectorAll('.tab-link');
  const tabs = container.querySelectorAll('.tab');
  
  tabLinks.forEach((link, index) => {
    link.onclick = (e) => {
      e.preventDefault();
      console.log('Tab clicked:', link.textContent);
      
      // Update active states
      tabLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      
      // Show/hide content
      tabs.forEach((tab, i) => {
        tab.classList.toggle('active', i === index);
      });
    };
  });
}

// Create observer to watch for tab container being added
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.classList?.contains('tab-container')) {
        console.log('Tab container added, initializing handlers');
        initTabHandlers(node);
      }
    });
  });
});

// Start observing
observer.observe(document.body, {
  childList: true,
  subtree: true
});

function handleTabStyles(main) {
  try {
    const tabElements = main.querySelectorAll('div[data-tabtitle]');
    console.log('Found tab elements:', tabElements);
    
    if (tabElements.length > 0) {
      const tabsContainer = document.createElement('div');
      tabsContainer.className = 'tabs-container section tab-container';
      tabsContainer.setAttribute('data-section-status', 'loaded');
      
      const tabNav = document.createElement('div');
      tabNav.className = 'tab-nav';
      
      const tabWrapper = document.createElement('div');
      tabWrapper.className = 'tab-wrapper';
      
      // Create all tabs first
      const tabs = [];
      tabElements.forEach((section, index) => {
        const tabTitle = section.getAttribute('data-tabtitle');
        
        const tabLink = document.createElement('a');
        tabLink.textContent = tabTitle;
        tabLink.href = '#';
        tabLink.className = 'tab-link';
        tabLink.setAttribute('data-tab-index', index);
        if (index === 0) tabLink.classList.add('active');
        tabNav.appendChild(tabLink);
        
        const clonedSection = section.cloneNode(true);
        clonedSection.classList.add('tab', 'block');
        clonedSection.setAttribute('data-block-name', 'tab');
        clonedSection.setAttribute('data-block-status', 'loaded');
        clonedSection.classList.toggle('active', index === 0);
        tabWrapper.appendChild(clonedSection);
        
        tabs.push({ link: tabLink, content: clonedSection });
      });

      // Add click handlers after all tabs are created
      tabs.forEach((tab, index) => {
        tab.link.addEventListener('click', (e) => {
          e.preventDefault();
          console.log('Tab clicked:', tab.link.textContent);
          
          // Remove active class from all tabs
          tabs.forEach(t => {
            t.link.classList.remove('active');
            t.content.classList.remove('active');
          });
          
          // Add active class to clicked tab
          tab.link.classList.add('active');
          tab.content.classList.add('active');
        });
      });

      tabsContainer.appendChild(tabNav);
      tabsContainer.appendChild(tabWrapper);
      
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
