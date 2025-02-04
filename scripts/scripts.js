import {
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForFirstImage,
  loadSection,
  loadSections,
  loadCSS,
} from './aem.js';

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
  console.log("buildAutoBlocks", main);
  try {
    // Get sections with data-aue-model="tabs"
    const sections = [...main.querySelectorAll('[data-aue-model="tabs"]')];
    if (sections.length === 0) return;

    const tabsWrapper = document.createElement("div");
    tabsWrapper.classList.add("tabs-container");

    const tabsNav = document.createElement("div");
    tabsNav.classList.add("tabs-nav");

    const tabsContent = document.createElement("div");
    tabsContent.classList.add("tabs-content");

    const tabTitles = new Set(); // To avoid duplicate tabs

    sections.forEach((section, index) => {
      // Extract tab title from section-metadata
      const metadata = section.querySelector(".section-metadata");
      if (metadata) {
        const titleDivs = metadata.querySelectorAll("div");

        // Extract the actual tab title from the second div (skip tabtitle label)
        if (titleDivs.length > 1) {
          const tabTitle = titleDivs[1].textContent.trim();

          // Skip duplicate titles
          if (tabTitles.has(tabTitle)) return;
          tabTitles.add(tabTitle);

          // Create tab button
          const tabButton = document.createElement("button");
          tabButton.classList.add("tab-button");
          tabButton.textContent = tabTitle;
          tabButton.dataset.index = tabsNav.children.length;

          // Create tab panel
          const tabPanel = document.createElement("div");
          tabPanel.classList.add("tab-panel");
          if (tabsNav.children.length === 0) tabPanel.classList.add("active");

          // Move content into tab panel (content inside data-aue-filter="tabs")
          const tabContent = section.querySelector('[data-aue-filter="tabs"]');
          if (tabContent) {
            // Move the content inside the panel
            tabPanel.appendChild(tabContent);
          }

          // Remove the original section after moving content
          section.remove();

          // Append tab button and panel to the respective containers
          tabsNav.appendChild(tabButton);
          tabsContent.appendChild(tabPanel);
        }
      }
    });

    // Append the tabs wrapper to the main container
    tabsWrapper.appendChild(tabsNav);
    tabsWrapper.appendChild(tabsContent);
    main.appendChild(tabsWrapper);

    // Handle tab switching on click
    tabsNav.addEventListener("click", (event) => {
      if (event.target.classList.contains("tab-button")) {
        const index = event.target.dataset.index;
        document.querySelectorAll(".tab-button").forEach(btn => btn.classList.remove("active"));
        document.querySelectorAll(".tab-panel").forEach(panel => panel.classList.remove("active"));

        event.target.classList.add("active");
        tabsContent.children[index].classList.add("active");
      }
    });

    // Activate the first tab by default
    tabsNav.children[0]?.classList.add("active");

  } catch (error) {
    console.error('Auto Blocking failed', error);
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
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
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
