import { getMetadata } from '../../scripts/aem.js';
import { loadFragmentCustom } from '../fragment/fragment.js';
import SvgIcon from "../../shared-components/SvgIcon.js";
import stringToHtml from "../../shared-components/Utility.js";



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
  const detailedcaption = document.createElement('a');
  // const detailedCaptionLink = document.querySelector('[data-aue-prop]="linkText"');
  // console.log(detailedCaptionLink);
  // detailedcaption.href = detailedCaptionLink.href;
  setAEMAttributes(titleContent, {
    prop: 'title',
    label: 'Title',
    type: 'text',
  });

  setAEMAttributes(detailedcaption, {
    prop: 'linkText',
    label: 'Text',
    type: 'text',
  });
  titleContent.textContent = itemData.title;
  if (itemData.caption) {
    detailedcaption.textContent = typeof itemData.caption === 'string' 
      ? itemData.caption 
      : itemData.caption.textContent || '';
  
    if (itemData.caption) {
      detailedcaption.href = itemData.caption.href;
    }
  
    detailedcaption.setAttribute('title', "Overview");
  
    if (itemData.captionTarget) {
      detailedcaption.setAttribute('target', itemData.captionTarget);
    }
  }
  
  titleDiv.appendChild(titleContent);
  navItem.appendChild(titleDiv);
  navItem.appendChild(detailedcaption);

  // Store caption as data attribute instead of creating element
  // if (itemData.caption) {
  //   navItem.dataset.caption = itemData.caption;
  // }
  if (itemData.caption && itemData.captionTarget) {
    navItem.dataset.captionText = itemData.caption.textContent?.trim() || '';
    navItem.dataset.captionHref = itemData.caption.href;
    navItem.dataset.captionTarget = itemData.captionTarget;
  }

  // Create links
  if (itemData.links?.length) {
    const linksUl = document.createElement('ul');
    linksUl.className = 'nav-links row';

    itemData.links.forEach((link) => {
      const li = document.createElement('li');
      li.className = 'col-xl-4 col-lg-4';
      setAEMAttributes(li, {
        type: 'component',
        model: 'linkField',
        filter: 'linkField',
        label: 'Link Field',
      }, link.resourcePath);

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
  console.log(block);
  // Create main section container
  const section = document.createElement('div');
  section.className = 'section columns-container container-xl container-md container-sm';
  setAEMAttributes(section, {
    type: 'container',
    behavior: 'component',
    model: 'section',
    label: 'Section',
    filter: 'section',
  }, 'urn:aemconnection:/content/genting-singapore/nav/jcr:content/root/section_0');
  section.setAttribute('data-section-status', 'loaded');

  // Create columns wrapper
  const columnsWrapper = document.createElement('div');
  columnsWrapper.className = 'columns-wrapper';

  // Create columns container
  const columns = document.createElement('div');
  columns.className = 'columns block';
  const columnsResource = block.querySelector('[data-aue-label="Columns"]')?.getAttribute('data-aue-resource');
  setAEMAttributes(columns, {
    type: 'container',
    model: 'columns',
    label: 'Columns',
    filter: 'columns',
    behavior: 'component',
  }, columnsResource);
  columns.setAttribute('data-block-name', 'columns');
  columns.setAttribute('data-block-status', 'loaded');

  // Create column content
  const column = document.createElement('div');
  const columnResource = block.querySelector('[data-aue-label="Column"]')?.getAttribute('data-aue-resource');

  setAEMAttributes(column, {
    type: 'container',
    label: 'Column',
    filter: 'column',
  }, columnResource);

  // Create navigation list
  const nav = document.createElement('nav');
  nav.className = 'header-nav';

  // Create logo section
  const logoWrapper = document.createElement('div');
  logoWrapper.className = 'logo-wrapper';
  const logoContent = block.querySelectorAll('[data-aue-model="image"]')[0]?.cloneNode(true);
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
      // caption: navSection.querySelector('[data-aue-prop="detailedcaption"]')?.textContent,
      caption: navSection.querySelector('[title="Overview"]'),
      captionTarget: '_self',
      links: Array.from(navSection.querySelectorAll('[data-aue-model="linkField"]')).map((link) => ({
        text: link.querySelector('[data-aue-prop="linkText"]')?.textContent,
        href: link.querySelector('a')?.getAttribute('href'),
        target: link.querySelector('[data-aue-prop="linkTarget"]')?.textContent,
        resourcePath: link.getAttribute('data-aue-resource'),
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
  // const searchWrapper = document.createElement('div');
  // setAEMAttributes(searchWrapper, {
  //   behavior: 'component',
  //   prop: 'text',
  //   label: 'Text',
  //   filter: 'text',
  //   type: 'richtext',
  // }, 'section_0/columns/row1/col1/text');
  // searchWrapper.className = 'search-icon-wrapper';
  // const searchIcon = document.createElement('span');
  // searchIcon.className = 'icon icon-search';
  // const searchImg = document.createElement('img');
  // searchImg.setAttribute('data-icon-name', 'search');
  // searchImg.src = '/content/genting-singapore.headerbackend.resource/icons/search.svg';
  // searchImg.alt = '';
  // searchImg.loading = 'lazy';
  // searchIcon.appendChild(searchImg);
  // searchWrapper.appendChild(searchIcon);

  // Assemble the structure
  nav.append(logoWrapper, primaryNav);
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

  // Create the hamburger menu button
const hamburger = document.createElement('div');
hamburger.className = 'hamburger';

// Create SVG icons
const hamburgerIcon = stringToHtml(SvgIcon({ name: 'hamburger', class: 'hamburger-icon', size: '18px' }));
const closeIcon = stringToHtml(SvgIcon({ name: 'close', class: 'close-icon', size: '18px' }));

// Set the initial icon
hamburger.appendChild(hamburgerIcon);

// Select navigation elements
const nav = header.querySelector('.header-nav');
nav.insertBefore(hamburger, nav.firstChild);

// Handle hamburger click
hamburger.addEventListener('click', () => {
  // Toggle class first
  hamburger.classList.toggle('active');
  const primaryNav = header.querySelector('.primary-nav');
  primaryNav.classList.toggle('active');

  // Use setTimeout to ensure class toggle happens before icon change
  setTimeout(() => {
    if (hamburger.classList.contains('active')) {
      hamburger.replaceChildren(closeIcon);
    } else {
      hamburger.replaceChildren(hamburgerIcon);

      // Close secondary navigation if it's open
      const activeItem = header.querySelector('.nav-item.active');
      const activeSecondary = header.querySelector('.secondary-nav.active');
      if (activeItem) activeItem.classList.remove('active');
      if (activeSecondary) activeSecondary.classList.remove('active');
      overlay.classList.remove('active');
      currentActive = null;
    }
  }, 0);
});


  navItems.forEach((item) => {
    const linksDiv = item.querySelector('.links');
    const detailedCaptionText = linksDiv?.dataset.captionText;
    const detailedCaptionLink = linksDiv?.dataset.captionHref;
    const detailedCaptionTarget = linksDiv?.dataset.captionTarget;

    const originalLinks = item.querySelector('.nav-links');

    if (originalLinks) {
      // Create empty secondary nav structure
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
      const closeBtnIcon = SvgIcon({name:'close', className:'close-icon',size:18});
      console.log(closeBtnIcon);
      // closeBtn.append(stringToHtml(closeBtnIcon));,
      closeBtn.innerHTML = closeBtnIcon;

      const heading = document.createElement('a');
      heading.textContent = detailedCaptionText || 'Overview';
      heading.href = detailedCaptionLink;
      heading.setAttribute('target', detailedCaptionTarget);

      // Wrapper for secondaryHeader and linksContainer
      const secondaryNavWrapper = document.createElement('div');
      secondaryNavWrapper.className = 'container-xl container-lg container-md container-sm';

      // Create empty structure for links
      const secondaryHeader = document.createElement('div');
      secondaryHeader.className = 'secondary-header row';

      const headerCol = document.createElement('div');
      headerCol.className = 'secondary-header-wrapper col-12 col-md-6 col-sm-4';
      headerCol.append(backBtn, heading, closeBtn);
      secondaryHeader.appendChild(headerCol);

      const linksContainer = document.createElement('div');
      linksContainer.className = 'secondary-header-links row';

      const linksCol = document.createElement('div');
      linksCol.className = 'col-12 col-md-6 col-sm-4';

      // Create empty ul for links
      const emptyLinks = document.createElement('ul');
      emptyLinks.className = 'nav-links row';
      linksCol.appendChild(emptyLinks);
      linksContainer.appendChild(linksCol);

      secondaryNavWrapper.append(secondaryHeader, linksContainer);
      secondaryNav.append(secondaryNavWrapper);
      header.appendChild(secondaryNav);

      // Handle click on nav item - Clone links here
      item.addEventListener('click', (e) => {
        e.preventDefault();

        if (currentActive && currentActive !== item) {
          // Close currently active menu
          currentActive.classList.remove(activeClass);
          const activeSecondary = header.querySelector('.secondary-nav.active');
          if (activeSecondary) {
            activeSecondary.classList.remove(activeClass);
            // Clear links when closing
            activeSecondary.querySelector('.nav-links').innerHTML = '';
          }
        }

        // Toggle current item
        item.classList.toggle(activeClass);

        if (item.classList.contains(activeClass)) {
          // Clone and append links only when opening
          const clonedLinks = originalLinks.cloneNode(true);
          emptyLinks.innerHTML = ''; // Clear previous links
          emptyLinks.append(...clonedLinks.children); // Append cloned children
        } else {
          // Clear links when closing
          emptyLinks.innerHTML = '';
        }

        secondaryNav.classList.toggle(activeClass);
        overlay.classList.toggle(activeClass);

        currentActive = item.classList.contains(activeClass) ? item : null;
      });

      // Handle back/close buttons
      const closeSecondary = () => {
        item.classList.remove(activeClass);
        secondaryNav.classList.remove(activeClass);
        overlay.classList.remove(activeClass);
        emptyLinks.innerHTML = ''; // Clear links
        currentActive = null;
      };

      backBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeSecondary();
      });

      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeSecondary();
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
  // let lastScroll = 0;
  // window.addEventListener('scroll', () => {
  //   const currentScroll = window.scrollY;
  //   header.classList.toggle('header--scrolled', currentScroll > 0);

  //   if (currentScroll > lastScroll && currentScroll > 100) {
  //     header.classList.add('header--hidden');
  //   } else {
  //     header.classList.remove('header--hidden');
  //   }
  //   lastScroll = currentScroll;
  
  // });

    const handleScroll = () => {
      if (!header) return;

      const headerTop = header.getBoundingClientRect().top;
      const headerLogo = header.querySelector('.logo-wrapper');

      if (headerTop <= 0) {
        header.classList.add('fixed-header'); // Add class when it reaches top: 0
        const logoContentTwo = header.querySelectorAll('[data-aue-model="image"]')[1]?.cloneNode(true);
        if (logoContentTwo) {
          headerLogo.innerHTML="";
          headerLogo.appendChild(logoContentTwo);
        }

      } else {
        const logoContentOne = header.querySelectorAll('[data-aue-model="image"]')[0]?.cloneNode(true);
        header.classList.remove('fixed-header'); // Remove class if not at top
        headerLogo.innerHTML="";
        if (logoContentOne) {
        logoContentOne.appendChild(logoContentOne);
        }
      }
    };

    // Optimize performance using debounce
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScroll, 10);
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
    document.getElementsByTagName('main')[0].remove();
    block.innerHTML = '';
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
