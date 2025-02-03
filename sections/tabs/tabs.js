// eslint-disable-next-line import/no-unresolved
import { toClassName } from '../../scripts/aem.js';

export default async function decorate(block) {
  // build tablist
  const tablist = document.createElement('div');
  tablist.className = 'tabs-list';
  tablist.setAttribute('role', 'tablist');

  // decorate tabs and tabpanels
  const tabs = [...block.children].map((child) => child.firstElementChild);
  tabs.forEach((tab, i) => {
    const id = toClassName(tab.textContent);

    // decorate tabpanel
    const tabpanel = block.children[i];
    tabpanel.className = 'tabs-panel';
    tabpanel.id = `tabpanel-${id}`;
    tabpanel.setAttribute('aria-hidden', !!i);
    tabpanel.setAttribute('aria-labelledby', `tab-${id}`);
    tabpanel.setAttribute('role', 'tabpanel');

    // build tab button
    const button = document.createElement('button');
    button.className = 'tabs-tab';
    button.id = `tab-${id}`;
    button.innerHTML = tab.innerHTML;
    button.setAttribute('aria-controls', `tabpanel-${id}`);
    button.setAttribute('aria-selected', !i);
    button.setAttribute('role', 'tab');
    button.setAttribute('type', 'button');
    button.addEventListener('click', () => {
      block.querySelectorAll('[role=tabpanel]').forEach((panel) => {
        panel.setAttribute('aria-hidden', true);
      });
      tablist.querySelectorAll('button').forEach((btn) => {
        btn.setAttribute('aria-selected', false);
      });
      tabpanel.setAttribute('aria-hidden', false);
      button.setAttribute('aria-selected', true);
    });
    tablist.append(button);
    tab.remove();
  });

  block.prepend(tablist);
}

document.addEventListener('DOMContentLoaded', function() {
  const tabsContainers = document.querySelectorAll('.tabs');
  
  tabsContainers.forEach(container => {
    const tabButtons = container.querySelectorAll('.tab-button');
    const tabPanels = container.querySelectorAll('.tab-panel');
    
    // Set initial state
    if (tabButtons.length > 0) {
      tabButtons[0].setAttribute('aria-selected', 'true');
      tabPanels[0].setAttribute('aria-hidden', 'false');
    }
    
    tabButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
        // Update button states
        tabButtons.forEach(btn => btn.setAttribute('aria-selected', 'false'));
        button.setAttribute('aria-selected', 'true');
        
        // Update panel visibility
        tabPanels.forEach(panel => panel.setAttribute('aria-hidden', 'true'));
        tabPanels[index].setAttribute('aria-hidden', 'false');
      });
      
      // Keyboard navigation
      button.addEventListener('keydown', (e) => {
        let targetButton;
        
        switch(e.key) {
          case 'ArrowLeft':
            targetButton = button.previousElementSibling || tabButtons[tabButtons.length - 1];
            break;
          case 'ArrowRight':
            targetButton = button.nextElementSibling || tabButtons[0];
            break;
        }
        
        if (targetButton) {
          e.preventDefault();
          targetButton.click();
          targetButton.focus();
        }
      });
    });
  });
});
