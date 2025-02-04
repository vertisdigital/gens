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
    // Step 1: Select all the tab divs using data-aue-filter="tabs"
    const sections = [...main.querySelectorAll('[data-aue-filter="tabs"]')];
    if (sections.length === 0) return;

    // Step 2: Create the wrapper for tabs and content
    const tabsWrapper = document.createElement("div");
    tabsWrapper.classList.add("tabs-container");

    const tabsNav = document.createElement("div");
    tabsNav.classList.add("tabs-nav");

    const tabsContent = document.createElement("div");
    tabsContent.classList.add("tabs-content");

    // Step 3: Iterate over each section and create tabs
    sections.forEach((section, index) => {
        // Step 3a: Find the .section-metadata inside the section to get the tab title
        const metadata = section.querySelector(".section-metadata");
        const tabTitleElement = metadata ? metadata.querySelector("div:nth-child(2)") : null;
        const tabTitle = tabTitleElement ? tabTitleElement.textContent.trim() : `Tab ${index + 1}`;

        // Step 3b: Create a button for the tab title
        const tabButton = document.createElement("button");
        tabButton.classList.add("tab-button");
        tabButton.textContent = tabTitle;
        tabButton.dataset.index = index;

        // Step 3c: Create a panel for the tab content
        const tabPanel = document.createElement("div");
        tabPanel.classList.add("tab-panel");
        if (index === 0) tabPanel.classList.add("active"); // Set first panel as active by default

        // Step 3d: Move content from section into the tab panel
        const tabContent = section.querySelector('[data-aue-filter="tabs"]');
        while (tabContent.firstChild) {
            tabPanel.appendChild(tabContent.firstChild);
        }

        // Step 3e: Remove the original section after moving content
        section.remove();

        // Step 3f: Append the tab button and content panel to their respective containers
        tabsNav.appendChild(tabButton);
        tabsContent.appendChild(tabPanel);
    });

    // Step 4: Append the navigation and content to the wrapper
    tabsWrapper.appendChild(tabsNav);
    tabsWrapper.appendChild(tabsContent);
    main.appendChild(tabsWrapper);

    // Step 5: Handle tab switching (show the correct tab content when a tab is clicked)
    tabsNav.addEventListener("click", (event) => {
        if (event.target.classList.contains("tab-button")) {
            const index = event.target.dataset.index;
            document.querySelectorAll(".tab-button").forEach(btn => btn.classList.remove("active"));
            document.querySelectorAll(".tab-panel").forEach(panel => panel.classList.remove("active"));

            event.target.classList.add("active");
            tabsContent.children[index].classList.add("active");
        }
    });

    // Step 6: Activate the first tab by default
    tabsNav.children[0]?.classList.add("active");
  } catch (error) {
    // eslint-disable-next-line no-console
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
