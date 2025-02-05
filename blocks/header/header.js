import { getMetadata } from '../../scripts/aem.js';
import { loadFragmentCustom } from '../fragment/fragment.js';

/**
 * Sets AEM data attributes
 * @param {Element} element Element to set attributes on
 * @param {Object} config Configuration object
 * @param {string} resourcePath Resource path
 */
function setAEMAttributes(element, config, resourcePath = '') {

  if (resourcePath) {
    element.setAttribute('data-aue-resource', `${resourcePath}`);
  }

  Object.entries(config).forEach(([key, value]) => {
    if (value) {
      element.setAttribute(`data-aue-${key}`, value);
    }
  });
}

/**
 * Creates navigation item with proper attributes
 * @param {Object} itemData Navigation item data
 * @param {string} resourcePath Resource path
 * @returns {Element} Navigation item element
 */
function createNavItem(itemData, resourcePath) {
  const navItem = document.createElement('div');
  setAEMAttributes(navItem, {
    type: 'container',
    behavior: 'component',
    model: 'links',
    label: 'Links',
    filter: 'links',
  }, resourcePath);
  navItem.className = 'links';

  // Create title
  const titleDiv = document.createElement('div');
  const titleContent = document.createElement('div');
  const detailedcaption = document.createElement('div');
  setAEMAttributes(titleContent, {
    prop: 'title',
    label: 'Title',
    type: 'text',
  });
  setAEMAttributes(detailedcaption, {
    prop: 'detailedcaption',
    label: 'Detailed Caption',
    type: 'text',
  });
  titleContent.textContent = itemData.title;
  detailedcaption.textContent = itemData.caption;
  titleDiv.appendChild(titleContent);
  navItem.appendChild(titleDiv);
  navItem.appendChild(detailedcaption);

  // Store caption as data attribute instead of creating element
  if (itemData.caption) {
    navItem.dataset.caption = itemData.caption;
  }

  // Create links
  if (itemData.links?.length) {
    const linksUl = document.createElement('ul');
    linksUl.className = 'nav-links row';

    itemData.links.forEach((link, index) => {
      const li = document.createElement('li');
      li.className = 'col-xl-4 col-lg-4';
      setAEMAttributes(li, {
        type: 'component',
        model: 'linkField',
        filter: 'linkField',
        label: 'Link Field',
      }, `${resourcePath}/item${index > 0 ? `_${index}` : ''}`);

      const linkContainer = document.createElement('div');
      linkContainer.className = 'button-container';

      const a = document.createElement('a');
      a.href = link.href;
      a.className = 'button';
      a.title = link.text;
      setAEMAttributes(a, {
        prop: 'linkText',
        label: 'Text',
        type: 'text',
      });
      a.textContent = link.text;

      if (link.target) {
        const targetDiv = document.createElement('div');
        setAEMAttributes(targetDiv, {
          prop: 'linkTarget',
          label: 'Link Target',
          type: 'text',
        });
        targetDiv.textContent = link.target;
        li.appendChild(targetDiv);
      }

      linkContainer.appendChild(a);
      li.appendChild(linkContainer);
      linksUl.appendChild(li);
    });

    navItem.appendChild(linksUl);
  }

  return navItem;
}

/**
 * Creates the header structure
 * @param {Element} block The header block element
 */
function createHeaderStructure(block) {
  // Create main section container
  const section = document.createElement('div');
  section.className = 'section columns-container container-xl container-md container-sm';
  setAEMAttributes(section, {
    type: 'container',
    behavior: 'component',
    model: 'section',
    label: 'Section',
    filter: 'section',
  }, 'section_0');
  section.setAttribute('data-section-status', 'loaded');

  // Create columns wrapper
  const columnsWrapper = document.createElement('div');
  columnsWrapper.className = 'columns-wrapper';

  // Create columns container
  const columns = document.createElement('div');
  columns.className = 'columns block';
  setAEMAttributes(columns, {
    type: 'container',
    model: 'columns',
    label: 'Columns',
    filter: 'columns',
    behavior: 'component',
  }, 'section_0/columns');
  columns.setAttribute('data-block-name', 'columns');
  columns.setAttribute('data-block-status', 'loaded');

  // Create column content
  const column = document.createElement('div');
  setAEMAttributes(column, {
    type: 'container',
    label: 'Column',
    filter: 'column',
  }, 'section_0/columns/row1/col1');

  // Create navigation list
  const nav = document.createElement('nav');
  nav.className = 'header-nav';

  // Create logo section
  const logoWrapper = document.createElement('div');
  logoWrapper.className = 'logo-wrapper';
  const logoContent = block.querySelector('[data-aue-model="image"]')?.cloneNode(true);
  if (logoContent) {
    logoWrapper.appendChild(logoContent);
  }

  // Create primary navigation
  const primaryNav = document.createElement('ul');
  primaryNav.className = 'primary-nav row';

  // Extract and create navigation items
  const navItems = Array.from(block.querySelectorAll('[data-aue-model="links"]')).map((navSection, index) => {
    const resourcePath = navSection.getAttribute('data-aue-resource');
    return createNavItem({
      title: navSection.querySelector('[data-aue-prop="title"]')?.textContent,
      caption: navSection.querySelector('[data-aue-prop="detailedcaption"]')?.textContent,
      links: Array.from(navSection.querySelectorAll('[data-aue-model="linkField"]')).map((link) => ({
        text: link.querySelector('[data-aue-prop="linkText"]')?.textContent,
        href: link.querySelector('a')?.getAttribute('href'),
        target: link.querySelector('[data-aue-prop="linkTarget"]')?.textContent,
      })),
    }, resourcePath || `nav_${index}`);
  });

  navItems.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'nav-item';
    li.appendChild(item);
    primaryNav.appendChild(li);
  });

  // Create search icon
  const searchWrapper = document.createElement('div');
  setAEMAttributes(searchWrapper, {
    behavior: 'component',
    prop: 'text',
    label: 'Text',
    filter: 'text',
    type: 'richtext',
  }, 'section_0/columns/row1/col1/text');

  const searchIcon = document.createElement('span');
  searchIcon.className = 'icon icon-search';
  const searchImg = document.createElement('img');
  searchImg.setAttribute('data-icon-name', 'search');
  searchImg.src = '/content/genting-singapore.headerbackend.resource/icons/search.svg';
  searchImg.alt = '';
  searchImg.loading = 'lazy';
  searchIcon.appendChild(searchImg);
  searchWrapper.appendChild(searchIcon);

  // Assemble the structure
  nav.append(logoWrapper, primaryNav, searchWrapper);
  column.appendChild(nav);
  columns.appendChild(column);
  columnsWrapper.appendChild(columns);
  section.appendChild(columnsWrapper);

  return section;
}

/**
 * Initialize header interactions
 * @param {Element} header The header element
 */
function initializeHeader(header) {
  const navItems = header.querySelectorAll('.nav-item');
  const activeClass = 'active';
  let currentActive = null;

  // Create overlay for secondary navigation
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  header.appendChild(overlay);

  // Add hamburger menu for mobile
  const hamburger = document.createElement('div');
  hamburger.className = 'hamburger';
  hamburger.innerHTML = '<span class="hamburger-icon"></span>';

  // Add hamburger before logo
  const nav = header.querySelector('.header-nav');
  nav.insertBefore(hamburger, nav.firstChild);

  // Handle hamburger click
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    const primaryNav = header.querySelector('.primary-nav');
    primaryNav.classList.toggle('active');

    // Close secondary navigation if open when toggling hamburger
    if (!hamburger.classList.contains('active')) {
      const activeItem = header.querySelector('.nav-item.active');
      const activeSecondary = header.querySelector('.secondary-nav.active');
      if (activeItem) activeItem.classList.remove(activeClass);
      if (activeSecondary) activeSecondary.classList.remove(activeClass);
      overlay.classList.remove(activeClass);
      currentActive = null;
    }
  });

  navItems.forEach((item) => {
    const linksDiv = item.querySelector('.links');
    const detailedCaption = linksDiv?.dataset.caption;
    const links = item.querySelector('.nav-links');

    if (links) {
      // Update secondary nav for mobile
      const secondaryNav = document.createElement('div');
      secondaryNav.className = 'secondary-nav container';

      // Create back button (mobile/tablet)
      const backBtn = document.createElement('button');
      backBtn.className = 'back-btn';
      backBtn.textContent = 'Back';

      // Create close button (desktop)
      const closeBtn = document.createElement('button');
      closeBtn.className = 'close-btn';
      closeBtn.setAttribute('aria-label', 'Close menu');
      closeBtn.innerHTML = '×';

      const heading = document.createElement('h2');
      heading.textContent = detailedCaption || 'Overview';

      // Use grid classes from styles.css
      const secondaryHeader = document.createElement('div');
      secondaryHeader.className = 'secondary-header row';

      const headerCol = document.createElement('div');
      headerCol.className = 'col-12 col-md-6 col-sm-4';
      headerCol.append(backBtn, heading, closeBtn);
      secondaryHeader.appendChild(headerCol);

      // Update links container with grid classes
      const linksContainer = document.createElement('div');
      linksContainer.className = 'row';

      const linksCol = document.createElement('div');
      linksCol.className = 'col-12 col-md-6 col-sm-4';
      linksCol.appendChild(links);
      linksContainer.appendChild(linksCol);

      secondaryNav.append(secondaryHeader, linksContainer);
      header.appendChild(secondaryNav);

      // Handle back button click (mobile/tablet)
      backBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        item.classList.remove(activeClass);
        secondaryNav.classList.remove(activeClass);
        overlay.classList.remove(activeClass);
        currentActive = null;
      });

      // Handle close button click (desktop)
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        item.classList.remove(activeClass);
        secondaryNav.classList.remove(activeClass);
        overlay.classList.remove(activeClass);
        currentActive = null;
      });

      // Handle click on nav item
      item.addEventListener('click', (e) => {
        e.preventDefault();

        if (currentActive && currentActive !== item) {
          // Close currently active menu
          currentActive.classList.remove(activeClass);
          const activeSecondary = header.querySelector('.secondary-nav.active');
          if (activeSecondary) {
            activeSecondary.classList.remove(activeClass);
          }
        }

        // Toggle current item
        item.classList.toggle(activeClass);
        secondaryNav.classList.toggle(activeClass);
        overlay.classList.toggle(activeClass);

        currentActive = item.classList.contains(activeClass) ? item : null;
      });
    }
  });

  // Close menu when clicking overlay
  overlay.addEventListener('click', () => {
    const activeItem = header.querySelector('.nav-item.active');
    const activeSecondary = header.querySelector('.secondary-nav.active');
    if (activeItem) activeItem.classList.remove(activeClass);
    if (activeSecondary) activeSecondary.classList.remove(activeClass);
    overlay.classList.remove(activeClass);
    currentActive = null;
  });

  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && currentActive) {
      currentActive.classList.remove(activeClass);
      const activeSecondary = header.querySelector('.secondary-nav.active');
      if (activeSecondary) activeSecondary.classList.remove(activeClass);
      overlay.classList.remove(activeClass);
      currentActive = null;
    }
  });

  // Handle scroll behavior
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    header.classList.toggle('header--scrolled', currentScroll > 0);

    if (currentScroll > lastScroll && currentScroll > 100) {
      header.classList.add('header--hidden');
    } else {
      header.classList.remove('header--hidden');
    }
    lastScroll = currentScroll;
  });

  // Update nav items with grid classes
  header.querySelectorAll('.nav-item').forEach((item) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'col-12 col-md-6 col-sm-4';
    item.parentNode.insertBefore(wrapper, item);
    wrapper.appendChild(item);
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!header.contains(e.target)) {
      const primaryNav = header.querySelector('.primary-nav');
      const hamburgerBtn = header.querySelector('.hamburger');
      if (primaryNav.classList.contains('active')) {
        primaryNav.classList.remove('active');
        hamburgerBtn.classList.remove('active');
      }
    }
  });
}

/**
 * decorates the header
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragmentCustom(navPath);

  if (fragment && true) {
    const header = createHeaderStructure(fragment);
    fragment.innerHTML = '';
    block.appendChild(header);

    // Initialize header functionality
    initializeHeader(header);
  } else {
    const header = createHeaderStructure(block);
    block.textContent = '';
    block.appendChild(header);
    initializeHeader(header);
  }
}
