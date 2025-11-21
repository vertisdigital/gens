import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import SvgIcon from '../../shared-components/SvgIcon.js';
import stringToHtml from '../../shared-components/Utility.js';

// Add these variables at the top level of the file
let ticking = false;
let isHeaderFixed = false;

/**
 * Updates header state based on scroll position
 * @param {Element} header Header element
 */
function updateHeaderState(header, isClicked = false) {
  const scrollPosition = window.scrollY;
  const defaultLogo = header.querySelector('.default-logo');
  const scrollLogo = header.querySelector('.scroll-logo');
  const isMegaMenuOpen = header.querySelector('.secondary-nav.active')
  const headerSection = document.querySelector('.header')

  if (defaultLogo && scrollLogo) {
    if ((scrollPosition > 0 && !isHeaderFixed) || isClicked) {
      headerSection.classList.add('fixed-header');
      defaultLogo.style.display = 'none';
      scrollLogo.style.display = 'block';
      isHeaderFixed = true;
    } else if (scrollPosition === 0 && isHeaderFixed && !isMegaMenuOpen) {
      headerSection.classList.remove('fixed-header');
      defaultLogo.style.display = 'block';
      scrollLogo.style.display = 'none';
      isHeaderFixed = false;
    }
  }
}

/**
 * Sets AEM data attributes
 * @param {Element} element Element to set attributes on
 * @param {Object} config Configuration object
 * @param {string} resourcePath Resource path
 */
// function setAEMAttributes(element, config, resourcePath = '') {
//   if (resourcePath) {
//     element.setAttribute('data-aue-resource', `${resourcePath}`);
//   }

//   Object.entries(config).forEach(([key, value]) => {
//     if (value) {
//       element.setAttribute(`data-aue-${key}`, value);
//     }
//   });
// }

/**
 * Creates navigation item with proper attributes
 * @param {Object} itemData Navigation item data
 * @param {string} resourcePath Resource path
 * @returns {Element} Navigation item element
 */
function createNavItem(itemData) {
  const navItem = document.createElement('div');
  navItem.className = 'links';

  // Create title
  const titleDiv = document.createElement('div');
  titleDiv.className = 'primary-menu-links';
  const titleContent = document.createElement('div');
  const detailedcaption = document.createElement('a');

  // Normal menu item handling
  if (itemData.title === 'CONTACT') {
    const contactLinkElement = document.createElement('a');
    contactLinkElement.href = itemData.overviewLinkHref;
    contactLinkElement.target = itemData.overviewLinkTarget;
    contactLinkElement.innerText = itemData.title;
    titleContent.append(contactLinkElement);
  } else {
    titleContent.textContent = itemData.title;
  }

  if (itemData.caption) {
    detailedcaption.textContent = typeof itemData.caption === 'string'
      ? itemData.caption
      : itemData.caption.textContent || '';

    if (itemData.caption) {
      detailedcaption.href = itemData.caption.href;
    }

    detailedcaption.setAttribute('title', 'Overview');

    if (itemData.captionTarget) {
      detailedcaption.setAttribute('target', itemData.captionTarget);
    }
  }

  // create overview link
  const overviewLink = document.createElement('a');
  overviewLink.className = 'overview-link display-none';
  overviewLink.textContent = itemData.overviewLinkText;
  overviewLink.href = itemData.overviewLinkHref;
  overviewLink.setAttribute('target', itemData.overviewLinkTarget);

  titleDiv.appendChild(titleContent);
  navItem.appendChild(titleDiv);
  if (detailedcaption.getAttribute('href')) { navItem.appendChild(detailedcaption); }
  navItem.appendChild(overviewLink);

  if (itemData.caption && itemData.captionTarget) {
    navItem.dataset.captionText = itemData.caption.textContent?.trim() || '';
    navItem.dataset.captionHref = itemData.caption.href;
    navItem.dataset.captionTarget = itemData.captionTarget;
  }
  detailedcaption.innerText = '';

  // Create links
  if (itemData.links?.length) {
    const linksUl = document.createElement('ul');
    linksUl.className = 'nav-links row';

    itemData.links.forEach((link, index) => {
      if (index > 0) { // Skip first item
        const li = document.createElement('li');
        li.className = 'col-xl-4';
        const linkContainer = document.createElement('div');
        linkContainer.className = 'button-container';
        const a = document.createElement('a');
        a.href = link.href;
        a.className = 'button';
        a.title = link.text;
        a.textContent = link.text;
        a.target = link.target;
        linkContainer.appendChild(a);
        li.appendChild(linkContainer);
        linksUl.appendChild(li);
      }
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
  section.className = 'header-inner-wrapper section columns-container container';

  // Create columns wrapper
  const columnsWrapper = document.createElement('div');
  columnsWrapper.className = 'columns-wrapper';

  // Create columns container
  const columns = document.createElement('div');
  columns.className = 'columns block';

  // Create column content
  const column = document.createElement('div');

  // Create navigation list
  const nav = document.createElement('nav');
  nav.className = 'header-nav';

  // Create logo section
  const logoWrapper = document.createElement('a');
  logoWrapper.className = 'logo-wrapper';
  logoWrapper.href = block.querySelector('.links .button')?.href || '/';

  // Get both logo images from fragment
  const images = block.querySelectorAll('picture');
  const defaultLogo = images[0];
  const scrollLogo = images[1];

  // Add both logos with appropriate classes
  if (defaultLogo) {
    const defaultLogoWrapper = defaultLogo.cloneNode(true);
    defaultLogoWrapper.classList.add('default-logo');
    logoWrapper.appendChild(defaultLogoWrapper);
  }

  if (scrollLogo) {
    const scrollLogoWrapper = scrollLogo.cloneNode(true);
    scrollLogoWrapper.classList.add('scroll-logo');
    scrollLogoWrapper.style.display = 'none'; // Initially hidden
    logoWrapper.appendChild(scrollLogoWrapper);
  }

  // Create primary navigation
  const primaryNav = document.createElement('ul');
  primaryNav.className = 'primary-nav row';

  // Extract and create navigation items
  const navItems = Array.from(block.querySelectorAll('.links')).slice(1).map((navSection) => {
    const sections = [...navSection.children];

    // Extract title from first section
    const title = sections[0]?.querySelector('div')?.textContent;

    // Extract overview link from the fourth section (index 3)

    const overviewLink = sections[3]?.querySelector('a');
    const overviewLinkHref = (title !== 'CONTACT'
      ? overviewLink?.getAttribute('href')
      : sections[1]?.querySelector('a')?.getAttribute('href'));

    // Create nav item object
    return createNavItem({
      title,
      overviewLinkText: overviewLink?.textContent || '',
      overviewLinkHref,
      overviewLinkTarget: sections[2]?.querySelector('div')?.textContent || '_self',
      caption: overviewLink,
      captionTarget: '_self',
      // Map remaining sections as links (starting from index 4)
      links: sections.slice(3).map((linkSection) => {
        const link = linkSection.querySelector('a');
        return {
          text: link?.getAttribute('title') || link?.textContent,
          href: link?.getAttribute('href') || '',
          target: linkSection.querySelector('div:last-child')?.textContent || '_self',
          resourcePath: linkSection.getAttribute('data-aue-resource'),
        };
      }),
    });
  });

  navItems.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'nav-item';
    li.appendChild(item);
    primaryNav.appendChild(li);
  });

  // Create search icon
  const searchWrapper = document.createElement('div');
 
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

  // Create the hamburger menu button
  const hamburger = document.createElement('div');
  hamburger.className = 'hamburger';

  // Create SVG icons
  const hamburgerIcon = stringToHtml(SvgIcon({ name: 'hamburger', class: 'hamburger-icon', size: '30px' }));
  const closeIcon = stringToHtml(SvgIcon({ name: 'close', class: 'close-icon', size: '30px' }));

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
        document.body.classList.add('no-scroll');
        updateHeaderState(header, true);
      } else {
        document.body.classList.remove('no-scroll');
        hamburger.replaceChildren(hamburgerIcon);
        // Close secondary navigation if it's open
        const activeItem = header.querySelector('.nav-item.active');
        const activeSecondary = header.querySelector('.secondary-nav.active');
        if (activeItem) activeItem.classList.remove('active');
        if (activeSecondary) activeSecondary.classList.remove('active');
        overlay.classList.remove('active');
        currentActive = null;
        updateHeaderState(header);
      }
    }, 0);
  });

  navItems.forEach((item) => {
    const linksDiv = item.querySelector('.links');
    const overviewLink = linksDiv?.querySelector('.overview-link');
    const detailedCaptionText = overviewLink?.innerText;
    const detailedCaptionLink = overviewLink?.getAttribute('href');
    const detailedCaptionTarget = overviewLink?.getAttribute('target');

    const originalLinks = item.querySelector('.nav-links');

    if (originalLinks) {
      // Create empty secondary nav structure
      const secondaryNav = document.createElement('div');
      secondaryNav.className = 'secondary-nav';

      // Create back button (mobile/tablet)
      const backBtn = document.createElement('button');
      backBtn.className = 'back-btn';
      backBtn.textContent = 'Back';

      // Create close button (desktop)
      const closeBtn = document.createElement('button');
      closeBtn.className = 'close-btn';
      closeBtn.setAttribute('aria-label', 'Close menu');
      const closeBtnIcon = SvgIcon({ name: 'close', className: 'close-icon', size: 18 });
      closeBtn.innerHTML = closeBtnIcon;

      const heading = document.createElement('a');
      heading.className = 'secondary-header-title';
      heading.textContent = detailedCaptionText || 'Overview';
      heading.href = detailedCaptionLink;
      heading.setAttribute('target', detailedCaptionTarget);

      // Wrapper for secondaryHeader and linksContainer
      const secondaryNavWrapper = document.createElement('div');
      secondaryNavWrapper.className = 'container';

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
          secondaryNav.classList.toggle(activeClass);
          overlay.classList.toggle(activeClass);
          updateHeaderState(header, true);
        } else {
          // Clear links when closing
          emptyLinks.innerHTML = '';
          secondaryNav.classList.toggle(activeClass);
          overlay.classList.toggle(activeClass);
          updateHeaderState(header, false, 'navLink');
        }

        

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
        updateHeaderState(header);
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

    // Check if the clicked element has a hash (#) in its href
    const { target } = e;
    if (target.href?.includes('#')) {
      window.location.href = e.target.href; // Navigate to the correct section
      window.location.reload();
    }
  });
}

/**
 * Handles scroll events using requestAnimationFrame
 * @param {Element} header Header element
 */
function handleScroll(header) {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      updateHeaderState(header);
      ticking = false;
    });
    ticking = true;
  }
}

/**
 * decorates the header
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  let navPath;

  if (navMeta) {
    navPath = new URL(navMeta, window.location).pathname;
  } else {
    // Extract first path segment
    const pathParts = window.location.pathname.split('/');
    const firstSegment = pathParts[1];

    // List of supported language codes (you can customize this)
    const languageCodes = [
      'en', 'ja', 'zh'
    ];

    // Determine nav path
    navPath = languageCodes.includes(firstSegment)
      ? `/${firstSegment}/nav`
      : `/nav`;
  }
  const fragment = await loadFragment(navPath);

  if (fragment && true) {
    const header = createHeaderStructure(fragment);
    block.innerHTML = '';
    block.appendChild(header);

    // Initialize header functionality
    initializeHeader(header);

    // Add optimized scroll handler
    window.addEventListener('scroll', () => handleScroll(block), { passive: true });

    // Ensure header starts with no fixed class
    header.classList.remove('fixed-header');
    isHeaderFixed = false;
  } else {
    const header = createHeaderStructure(block);
    block.textContent = '';
    block.appendChild(header);
    initializeHeader(header);

    // Add optimized scroll handler
    window.addEventListener('scroll', () => handleScroll(header), { passive: true });

    // Ensure header starts with no fixed class
    header.classList.remove('fixed-header');
    isHeaderFixed = false;
  }
  window.addEventListener('click', (event) => {
    const excludedSelectors = [
      '.header-inner-wrapper .columns-wrapper',
      '.secondary-nav',
      '.secondary-header-links',
    ];
    const isExcluded = excludedSelectors.some((selector) => {
      const element = document.querySelector(selector);
      return element && element.contains(event.target);
    });
    if (isExcluded) {
      return;
    }
    document.querySelectorAll('.nav-item, .secondary-nav').forEach((el) => {
      el.classList.remove('active');
    });
    updateHeaderState(block)
  });
}
