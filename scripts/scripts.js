import {
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateBlocks,
  decorateIcons,
  decorateSections,
  decorateTemplateAndTheme,
  waitForFirstImage,
  loadSection,
  loadSections,
  loadCSS,
} from './aem.js';
import processTabs from './autoblocks.js';

/**
 * Moves all the attributes from a given elmenet to another given element.
 * @param {Element} from the element to copy attributes from
 * @param {Element} to the element to copy attributes to
 */
export function moveAttributes(from, to, attributes) {
  if (!attributes) {
    // eslint-disable-next-line no-param-reassign
    attributes = [...from.attributes].map(({ nodeName }) => nodeName);
  }
  attributes.forEach((attr) => {
    const value = from.getAttribute(attr);
    if (value) {
      to.setAttribute(attr, value);
      from.removeAttribute(attr);
    }
  });
}

/**
 * Move instrumentation attributes from a given element to another given element.
 * @param {Element} from the element to copy attributes from
 * @param {Element} to the element to copy attributes to
 */
export function moveInstrumentation(from, to) {
  moveAttributes(
    from,
    to,
    [...from.attributes]
      .map(({ nodeName }) => nodeName)
      .filter((attr) => attr.startsWith('data-aue-') || attr.startsWith('data-richtext-')),
  );
}

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  console.log('Building auto blocks');
  /*try {
    // Handle tab styles first
    handleTabStyles();
    
    // Process tabs and maintain their position
    processTabs(main, moveInstrumentation);

    // Find blocks inside columns and tabs containers
    const containerBlocks = main.querySelectorAll(`
      .columns div[class],
      [data-aue-model="tabs"] div[class],
      [data-aue-filter="tabs"] div[class]
    `);

    containerBlocks.forEach((block) => {
      const classes = Array.from(block.classList);
      classes.forEach((className) => {
        if (!className.startsWith('columns-') && !className.startsWith('tabs-')
            && className !== 'columns' && className !== 'tabs'
            && className !== 'section-metadata') {
          // Add block class and ensure block type is the first class
          block.classList.remove(className);
          block.classList.add(className, 'block');

          // Force block decoration for this element
          if (!block.dataset.blockName) {
            block.dataset.blockName = className;
          }
        }
      });
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }*/

  // Handle tab styles
  handleTabStyles();
}

function handleTabStyles() {
  try {
    const main = document.querySelector('main');
    console.log('Main element found:', main.innerHTML);

    // Look for section-metadata with tab class
    const tabElements = main.querySelectorAll('.section-metadata.tab');
    console.log('Found tab elements:', tabElements.length, tabElements);
    
    if (tabElements.length > 0) {
      // Create tabs container
      const tabsContainer = document.createElement('div');
      tabsContainer.className = 'tabs-container';
      console.log('Created tabs container:', tabsContainer);
      
      tabElements.forEach((tab, index) => {
        console.log(`Processing tab ${index}:`, tab);
        
        // Get the parent div that contains both textmediablock and section-metadata
        const parentDiv = tab.closest('div > div');
        console.log(`Found parent div ${index}:`, parentDiv);
        
        if (parentDiv) {
          // Remove tab class from section-metadata
          tab.classList.remove('tab');
          
          // Add tab class to the top-level parent
          parentDiv.classList.add('tab');
          
          // Move the entire parent div to tabs container
          tabsContainer.appendChild(parentDiv);
          console.log(`Moved parent div ${index} to tabs container`);
        }
      });

      console.log('Final tabs container before prepend:', tabsContainer.innerHTML);
      main.prepend(tabsContainer);
      console.log('Main element after prepend:', main.innerHTML);
    } else {
      console.log('No tab elements found');
    }
  } catch (error) {
    console.error('Error in handleTabStyles:', error);
    console.error('Error stack:', error.stack);
  }
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // hopefully forward compatible button decoration

  decorateButtons(main);
  decorateIcons(main);
  decorateSections(main);
  decorateBlocks(main); // First decorate all blocks
  buildAutoBlocks(main); // Then build auto blocks which will preserve block decoration
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await loadSection(main.querySelector('.section'), waitForFirstImage);
  }

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadSections(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadHeader(doc.querySelector('header'));
  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();

// Add this in your initialization code
loadCSS(`${window.hlx.codeBasePath}/blocks/tabs/tabs.css`);
