import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import SVGIcon from '../../shared-components/SvgIcon.js';
import stringToHtml from '../../shared-components/Utility.js';
import { highlight, shortenURL, resolveSearchBasePath } from '../searchresult/searchresult.js';


// Add these variables at the top level of the file
let ticking = false;
let isHeaderFixed = false;
const isMobileViewport = () => window.innerWidth <= 767;

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
  titleContent.className = 'primary-menu-links-heading';
  const detailedcaption = document.createElement('a');

  // Check if this is the Contact menu item
  // if (itemData.title === 'Contact' && itemData.links?.length === 1) {
  //   // For Contact, create a direct link using the first link in the array
  //   const contactLink = document.createElement('a');
  //   contactLink.textContent = itemData.links[0].text;
  //   contactLink.href = itemData.links[0].href;
  //   contactLink.setAttribute('target', itemData.links[0].target || '_self');
  //   titleContent.appendChild(contactLink);

  //   // Skip creating submenu elements
  //   titleDiv.appendChild(titleContent);
  //   navItem.appendChild(titleDiv);
  //   return navItem;
  // }

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

  const upArrow = SVGIcon({
    name: 'arrowUp'
  });

  // ADD accordion arrow (mobile only via CSS)
  const arrow = document.createElement('span');
  arrow.className = 'header-accordion-arrow';
  // Convert SVG string to DOM element if needed
  if (typeof upArrow === 'string') {
    arrow.innerHTML = upArrow;
  } else if (upArrow instanceof Node) {
    arrow.appendChild(upArrow);
  }

  titleContent.appendChild(arrow);
  titleDiv.appendChild(titleContent);
  
  navItem.appendChild(titleDiv);
  if (detailedcaption.getAttribute('href'))
    navItem.appendChild(detailedcaption);
  navItem.appendChild(overviewLink);
  if (itemData.links && itemData.links[0]) {
    const overviewDescription = document.createElement('div');
    overviewDescription.className = 'overview-description display-none';
    overviewDescription.textContent = itemData.links[0].text || '';
    overviewLink.setAttribute('text', overviewDescription.textContent);
    navItem.appendChild(overviewDescription);
  }

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

  // Add both logos with appropriate classes
  if (defaultLogo) {
    const defaultLogoWrapper = defaultLogo.cloneNode(true);
    defaultLogoWrapper.classList.add('default-logo');
    logoWrapper.appendChild(defaultLogoWrapper);
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
  const searchBtn = document.createElement('button');
  searchBtn.className = 'search-btn';
  searchWrapper.appendChild(searchBtn);
  const searchSuggestionBox = document.createElement('div');
  searchSuggestionBox.className = 'search-suggestion-box';
  const searchBox = document.createElement('div');
  searchBox.className = 'search-box';
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.className = 'search-input';
  searchInput.placeholder = 'Search';
  const searchBtn2 = document.createElement('button');
  searchBtn2.className = 'suggestion-search-btn';
  searchBox.append(searchInput, searchBtn2);
  const searchSuggestions = document.createElement('div');
  searchSuggestions.className = 'search-suggestions';
  searchSuggestionBox.append(searchBox, searchSuggestions);

  document.querySelector('.header-wrapper').appendChild(searchSuggestionBox);

  // Assemble the structure
  nav.append(logoWrapper, primaryNav, searchWrapper);
  column.appendChild(nav);
  columns.appendChild(column);
  columnsWrapper.appendChild(columns);
  section.appendChild(columnsWrapper);

  return section;
}

function loadSearchSuggest(keyword) {
  const PUBLISH_BASE = 'https://publish-p144202-e1488374.adobeaemcloud.com';
  const resultInfo = document.querySelector('.search-suggestion-result-info');

  const basePath = resolveSearchBasePath();
  if (resultInfo) {
    resultInfo.remove();
  }
  let debounceTimer;
  clearTimeout(debounceTimer);

  debounceTimer = setTimeout(async () => {
    const suggestions = document.querySelector('.search-suggestions');
    
    if (keyword.length < 3) {
      suggestions.classList.remove('active');
      return;
    }

    try {
      const res = await fetch(
        `${PUBLISH_BASE}${basePath}/jcr:content.suggest.json?q=${encodeURIComponent(keyword)}`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );

      if (!res.ok) {
        console.error('Suggest API error:', res.status);
        return;
      }

      const data = await res.json();
      if (data.length) {
        console.log('Suggest result:', data);
        suggestions.classList.add('active');
        suggestions.innerHTML = '';
        data.forEach((item) => {
          const suggestion = document.createElement('a');
          suggestion.className = 'suggestion-item';
          suggestion.href = item.path.endsWith('.pdf') ? PUBLISH_BASE + item.path : shortenURL(item.path);
          const hl = highlight(item.highlight, keyword);
          suggestion.innerHTML = hl;
          suggestions.appendChild(suggestion);
        });
      }
      else {
         suggestions.classList.remove('active');
      }

    } catch (err) {
      console.error('Suggest fetch failed', err);
    }
  }, 500);
}

function triggerSearchPage(e) {
  const q = e.trim();
  if (!q) return;

  const target = `/en/searchresults?q=${encodeURIComponent(q)}`;
  window.location.href = target;
}

function createMobileAccordionFromSecondary(secondaryNav, originalLinks) {
  const accordion = document.createElement('div');
  accordion.className = 'mobile-subnav';

  const cloned = secondaryNav.cloneNode(true);
  cloned.classList.add('active');
  cloned.classList.remove('header-hover-zone');

  cloned.querySelector('.close-btn')?.remove();

  const targetUl = cloned.querySelector('.nav-links');
  if (targetUl) {
    targetUl.innerHTML = '';
    const freshLinks = originalLinks.cloneNode(true);
    targetUl.append(...freshLinks.children);
  }

  accordion.appendChild(cloned);
  return accordion;
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
  const hamburgerIcon = stringToHtml(SVGIcon({ name: 'hamburger', class: 'hamburger-icon', size: '30px' }));
  const closeIcon = stringToHtml(SVGIcon({ name: 'close', class: 'close-icon', size: '30px' }));

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
    header.classList.add('mobile-menu-open');

    // Use setTimeout to ensure class toggle happens before icon change
    setTimeout(() => {
      if (hamburger.classList.contains('active')) {
        hamburger.replaceChildren(closeIcon);
        document.body.classList.add('no-scroll');
      } else {
        header.classList.remove('mobile-menu-open');
        document.body.classList.remove('no-scroll');
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
    const overviewLink = linksDiv?.querySelector('.overview-link');
    const detailedCaptionText = overviewLink?.innerText;
    const detailedCaptionLink = overviewLink?.getAttribute('href');
    const detailedCaptionTarget = overviewLink?.getAttribute('target');

    const originalLinks = item.querySelector('.nav-links');

    if (originalLinks) {
      const originalDescription = linksDiv?.querySelector('.overview-description').textContent || '';
      // Create empty secondary nav structure
      const secondaryNav = document.createElement('div');
      secondaryNav.className = 'secondary-nav';

      // Create close button (desktop)
      const closeBtn = document.createElement('button');
      closeBtn.className = 'close-btn';
      closeBtn.setAttribute('aria-label', 'Close menu');
      const closeBtnIcon = SVGIcon({ name: 'close', className: 'close-icon', size: 18 });
      closeBtn.innerHTML = closeBtnIcon;

      const heading = document.createElement('a');
      heading.className = 'secondary-header-title';
      heading.textContent = detailedCaptionText || 'Overview';
      heading.href = detailedCaptionLink;
      heading.setAttribute('target', detailedCaptionTarget);

      const description = document.createElement('div');
      description.className = 'secondary-header-description';
      description.textContent = originalDescription || '';

      const cta = document.createElement('a');
      cta.className = 'secondary-header-cta button';
      cta.href = detailedCaptionLink;
      cta.setAttribute('target', detailedCaptionTarget);

      const iconWrapper = document.createElement('span');
      iconWrapper.className = 'secondary-header-cta-icon';

      const svg = SVGIcon({ name: 'arrowRightWhite', size: 24 });
      if (typeof svg === 'string') {
        iconWrapper.innerHTML = svg;
      } else {
        iconWrapper.appendChild(svg);
      }

      cta.appendChild(iconWrapper);

      // Wrapper for secondaryHeader and linksContainer
      const secondaryNavWrapper = document.createElement('div');
      secondaryNavWrapper.className = 'container';

      // Create empty structure for links
      const secondaryHeader = document.createElement('div');
      secondaryHeader.className = 'secondary-header row';

      const headerCol = document.createElement('div');
      headerCol.className = 'secondary-header-wrapper col-12 col-md-6 col-sm-4';
      headerCol.append(heading, description, cta, closeBtn);
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

      const headingItem = item.querySelector('.primary-menu-links-heading');

      headingItem?.addEventListener('click', (e) => {
        if (!isMobileViewport()) return;

        e.preventDefault();
        e.stopPropagation();

        const isOpen = item.classList.contains('active');

        header.querySelectorAll('.nav-item.active').forEach(i => {
          if (i !== item) {
            i.classList.remove('active');
            i.querySelector('.mobile-subnav')?.remove();
          }
        });

        if (isOpen) {
          item.classList.remove('active');
          item.querySelector('.mobile-subnav')?.remove();
          return;
        }

        item.classList.add('active');

        const accordion = createMobileAccordionFromSecondary(
          secondaryNav,
          originalLinks
        );
        item.appendChild(accordion);
      });

      secondaryNav.classList.add('header-hover-zone');
      // Handle click on nav item - Clone links here
      const hoverZone = document.querySelector('.header-hover-zone');

      item.addEventListener('mouseenter', () => {
        if (isMobileViewport()) return;
        document.querySelector('.search-suggestion-box').classList.remove(activeClass);
        document.querySelectorAll('.secondary-nav').forEach(navigation => navigation.classList.remove(activeClass));
        if (currentActive && currentActive !== item) {
          currentActive.classList.remove(activeClass);
          overlay.classList.remove(activeClass);
          emptyLinks.innerHTML = '';
        }

        item.classList.add(activeClass);

        const clonedLinks = originalLinks.cloneNode(true);
        emptyLinks.innerHTML = '';
        emptyLinks.append(...clonedLinks.children);

        secondaryNav.classList.add(activeClass);
        overlay.classList.add(activeClass);

        currentActive = item;
      });

      document.addEventListener('pointermove', (e) => {
        if (isMobileViewport()) return;

        if (!hoverZone.contains(e.target)) {
          if (!currentActive) return;
          
          currentActive.classList.remove(activeClass);
          document.querySelectorAll('.secondary-nav').forEach(navigation => navigation.classList.remove(activeClass));
          overlay.classList.remove(activeClass);
          emptyLinks.innerHTML = '';
          currentActive = null;

        }
      });


      // Handle back/close buttons
      const closeSecondary = () => {
        item.classList.remove(activeClass);
        secondaryNav.classList.remove(activeClass);
        overlay.classList.remove(activeClass);
        emptyLinks.innerHTML = ''; // Clear links
        currentActive = null;
      };

      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeSecondary();
      });
    }
  });

  const searchBtn = header.querySelector('.search-btn');
  const searchSuggestionBox = document.querySelector('.search-suggestion-box');

  searchBtn.addEventListener('click', function () {
    if (!searchSuggestionBox.classList.contains('active')) {
      document.querySelectorAll('.secondary-nav').forEach(navigation => navigation.classList.remove(activeClass));
      searchSuggestionBox.classList.add('active');
    }
    else {
      searchSuggestionBox.classList.remove('active');
    }
  });

  const observer = new MutationObserver(() => {
    if (searchSuggestionBox.classList.contains('active')) {
      searchBtn.classList.add('close-search-btn');
    } else {
      searchBtn.classList.remove('close-search-btn');
    }
  });

  observer.observe(searchSuggestionBox, {
    attributes: true,
    attributeFilter: ['class'],
  });

  const searchInput = document.querySelector('.search-input');
  const searchBtnSuggestion = document.querySelector('.suggestion-search-btn');

  searchInput.addEventListener('input', (e) => {
    loadSearchSuggest(e.target.value.trim());
  })

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      triggerSearchPage(e.target.value)
    }
  });

  searchBtnSuggestion.addEventListener('click', function () {
    triggerSearchPage(searchInput.value)
  });

  window.addEventListener('resize', () => {
    if (isMobileViewport()) {
      document.querySelectorAll('.nav-item.active')
        .forEach(i => i.classList.remove(activeClass));
      document.querySelectorAll('.secondary-nav.active')
        .forEach(n => n.classList.remove(activeClass));
      document.querySelectorAll('.primary-nav.active')
        .forEach(n => n.classList.remove(activeClass));
      document.querySelectorAll('.hamburger.active')
        .forEach(n => n.classList.remove(activeClass));
      overlay.classList.remove(activeClass);
      currentActive = null;
      header.classList.remove('mobile-menu-open');
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
    const target = e.target;
    if (target.href?.includes("#")) {
      window.location.href = e.target.href; // Navigate to the correct section
      window.location.reload()
    }
  });
}

/**
 * Updates header state based on scroll position
 * @param {Element} header Header element
 */
function updateHeaderState(header) {
  const scrollPosition = window.scrollY;
  const defaultLogo = header.querySelector('.default-logo');

  if (defaultLogo) {
    if (scrollPosition > 0 && !isHeaderFixed) {
      header.classList.add('fixed-header');
      isHeaderFixed = true;
    } else if (scrollPosition === 0 && isHeaderFixed) {
      header.classList.remove('fixed-header');
      isHeaderFixed = false;
    }
  }
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
    console.log('Loaded header from fragment:', header);
    block.innerHTML = '';
    block.appendChild(header);
    block.classList.add('header-hover-zone');

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
  });
}
