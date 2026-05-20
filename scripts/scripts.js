/* eslint-disable no-console */

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
import { redirectRouter, controlLowerEnvironment, getAEMPublishEndpoint, changeStatusBarColor } from '../shared-components/Utility.js';
import { errorLogger as logger } from './logger.js';
import initLazyFadeIn from './lazy-fadein.js';

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
  try {
    processTabs(main);
  } catch (error) {
    logger.error(`Auto Blocking failed, ${error}`);
  }
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export async function decorateMain(main, isExecute) {
  const isAuthorInstance = document.referrer.includes('canvas');
  if (!isAuthorInstance) {
    controlLowerEnvironment();
  }
  await redirectRouter();
  decorateButtons(main);
  decorateIcons(main);
  decorateSections(main, isExecute);
  decorateBlocks(main);
  buildAutoBlocks(main);
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
    await decorateMain(main);
    document.body.classList.add('appear');
    await loadSection(main.querySelector('.section'), waitForFirstImage);
  }

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    logger.error(e);
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
  loadCSS(`${window.hlx.codeBasePath}/styles/text.css`);
  loadCSS(`${window.hlx.codeBasePath}/styles/buttons.css`);
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

/**
 * Adds fallback title/alt text to links without text
 */
function initLinkFallback(container) {
  const updateLink = (a) => {
    // Nếu thẻ a đã có title hợp lệ thì bỏ qua (VD: tile đã set sẵn)
    if (a.hasAttribute('title') && a.getAttribute('title').trim()) return;

    // Nếu thẻ a đã có textContent thực sự
    if (a.textContent.trim()) return;

    let el = a.parentElement;
    let text = '';
    let count = 0;
    // Đi ngược lên tối đa 4 cấp để tìm text
    while (el && count < 4 && el.tagName !== 'BODY') {
      text = el.textContent.trim().replace(/\s+/g, ' ');
      if (text) {
        break;
      }
      el = el.parentElement;
      count += 1;
    }

    if (text) {
      if (text.length > 150) {
        text = `${text.substring(0, 150)}...`;
      }
      a.setAttribute('title', text);
      const img = a.querySelector('img');
      // Nếu có hình ảnh chưa có alt, mượn cớ dùng fallback text này luôn
      if (img && (!img.hasAttribute('alt') || !img.getAttribute('alt').trim())) {
        img.setAttribute('alt', text);
      }
    }
  };

  container.querySelectorAll('a').forEach(updateLink);

  // Dùng MutationObserver để theo dõi và xử lý cả những thẻ sinh ra sau (như React/Lazy Load)
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((m) => {
      m.addedNodes.forEach((node) => {
        if (node.nodeType === 1) { // ELEMENT_NODE
          if (node.tagName === 'A') {
            updateLink(node);
          }
          if (node.querySelectorAll) {
            node.querySelectorAll('a').forEach(updateLink);
          }
        }
      });
    });
  });
  observer.observe(container, { childList: true, subtree: true });
}

/**
 * Formats DAM PDF links to use the correct AEM Publish endpoint
 */
function formatPdfLinks(container) {
  const updatePdfLink = (a) => {
    try {
      const href = a.getAttribute('href');
      if (href && href.toLowerCase().endsWith('.pdf') && href.startsWith('/content/dam/')) {
        const publishBase = getAEMPublishEndpoint();
        a.setAttribute('href', publishBase + href);
        if (!a.hasAttribute('target')) {
          a.setAttribute('target', '_blank');
        }
      }
    } catch (e) {
      // ignore
    }
  };

  container.querySelectorAll('a').forEach(updatePdfLink);

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((m) => {
      m.addedNodes.forEach((node) => {
        if (node.nodeType === 1) { // ELEMENT_NODE
          if (node.tagName === 'A') {
            updatePdfLink(node);
          }
          if (node.querySelectorAll) {
            node.querySelectorAll('a').forEach(updatePdfLink);
          }
        }
      });
    });
  });
  observer.observe(container, { childList: true, subtree: true });
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
  initLazyFadeIn();
  initLinkFallback(document.body);
  formatPdfLinks(document.body);
  
  // Force iOS 26 Safari status bar tinting
  changeStatusBarColor('#1d3d51');
  
  document.body.classList.add('fully-loaded');
}

loadPage();
