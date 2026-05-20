import { getIcon } from '../../shared-components/icons/index.js';
import stringToHtml from '../../shared-components/Utility.js';

export const resolveSearchBasePath = () => {
  const parts = window.location.pathname.split('/').filter(Boolean);

  const supportedLangs = ['en', 'fr', 'zh', 'ja'];
  const firstSegment = parts[0];

  if (supportedLangs.includes(firstSegment)) {
    return `/content/genting-singapore/${firstSegment}`;
  }

  // fallback
  return '/content/genting-singapore/en';
};

export const getSearchEndpoint = () => {
  const { hostname } = window.location;

  // Prod
  if (hostname.includes('main--gens-prod--') || hostname === 'gentingsingapore.com' || hostname === 'www.gentingsingapore.com') {
    return 'https://publish-p144202-e1512579.adobeaemcloud.com';
  }

  // UAT
  if (hostname.includes('uat--gens-stage--') || hostname === 'ut.gentingsingapore.com') {
    return 'https://publish-p144202-e1512622.adobeaemcloud.com';
  }

  // Dev (default)
  return 'https://publish-p144202-e1488374.adobeaemcloud.com';
};

export const stripHtml = (html) => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || '';
};

export const highlight = (text, q) => {
  if (!text || !q) return text || '';

  const cleanQ = String(q).trim();
  if (!cleanQ) return stripHtml(text);

  const words = cleanQ.split(/\s+/);
  const terms = Array.from(new Set([cleanQ, ...words]));

  const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const escapedTerms = terms.map(escapeRegExp);

  escapedTerms.sort((a, b) => b.length - a.length);

  const pattern = escapedTerms.join('|');

  return stripHtml(text).replace(
    new RegExp(`(${pattern})`, 'gi'),
    '<strong>$1</strong>',
  );
};

export const shortenURL = (url) => url.replace('/content/genting-singapore', '').replace('.html', '');

export const dispatchSearchAnalyticsEvent = (eventName, detail = null) => {
  const dispatch = () => {
    const event = detail ? new CustomEvent(eventName, { detail }) : new CustomEvent(eventName);
    document.dispatchEvent(event);
  };

  // eslint-disable-next-line no-underscore-dangle
  if (window._satellite) {
    dispatch();
  } else {
    const poll = setInterval(() => {
      // eslint-disable-next-line no-underscore-dangle
      if (window._satellite) {
        clearInterval(poll);
        dispatch();
      }
    }, 250);
    // Safety check to cancel polling after 15 seconds
    setTimeout(() => clearInterval(poll), 15000);
  }
};

const PAGE_SIZE = 5;

const formatPage = (page) => String(page).padStart(2, '0');

const renderPagination = (currentPage, totalPages) => {
  if (totalPages <= 1) return '';

  const pages = new Set();
  const add = (p) => {
    if (p >= 1 && p <= totalPages) pages.add(p);
  };

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i += 1) add(i);
  } else {
    add(1);
    add(2);
    add(3);

    const start = Math.max(4, currentPage - 1);
    const end = Math.min(totalPages - 3, currentPage + 1);
    for (let i = start; i <= end; i += 1) add(i);

    add(totalPages - 2);
    add(totalPages - 1);
    add(totalPages);
  }

  const sorted = [...pages].sort((a, b) => a - b);
  let prev = null;

  const items = sorted
    .map((page) => {
      let ellipsis = '';
      if (prev && page - prev > 1) {
        ellipsis = '<span class="pagination-ellipsis">…</span>';
      }

      prev = page;

      if (page === currentPage) {
        return `
          ${ellipsis}
          <span class="pagination-page active">
            <span>${formatPage(page)}</span>
          </span>
        `;
      }

      return `
        ${ellipsis}
        <button class="pagination-page" data-page="${page}">
          <span>${formatPage(page)}</span>
        </button>
      `;
    })
    .join('');

  return `
    <nav class="pagination">
      ${currentPage > 1
      ? `<button class="pagination-prev" data-page="${currentPage - 1}">
              <span class="previous-icon">${getIcon('arrowleftLarge')}</span>
              Previous
            </button>`
      : '<span class="pagination-prev disabled">Previous</span>'
    }
      ${items}
      ${currentPage < totalPages
      ? `<button class="pagination-next" data-page="${currentPage + 1}">
              Next<span class="next-icon">${getIcon('arrowrightLarge')}</span>
            </button>`
      : '<span class="pagination-next disabled">Next</span>'
    }
    </nav>
  `;
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '';

  const [month, day, year] = dateStr.split('/').map(Number);
  if (!day || !month || !year) return '';

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  return `${day} ${months[month - 1]} ${year}`;
};

const moveSearchSuggestionOutOfHeader = () => {
  const header = document.querySelector('.header-wrapper');
  const suggestionBox = header?.querySelector('.search-suggestion-box');

  if (!header || !suggestionBox) return;

  if (suggestionBox.dataset.moved === 'true') return;

  let container = document.querySelector('.search-nav');

  if (!container) {
    container = document.createElement('div');
    container.className = 'search-nav';

    header.insertAdjacentElement('afterend', container);
  }

  container.appendChild(suggestionBox);
  suggestionBox.dataset.moved = 'true';
};

const waitForElement = (selector, callback) => {
  const existing = document.querySelector(selector);
  if (existing) {
    callback(existing);
    return;
  }

  const observer = new MutationObserver(() => {
    const el = document.querySelector(selector);
    if (el) {
      observer.disconnect();
      callback(el);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
};

const renderResults = (block, q, results, currentPage, total, totalPages, noResultLink) => {
  if (total === 0) {
    const emptyDiv = document.createElement('div');
    emptyDiv.className = 'searchresult-empty';

    const illustration = document.createElement('div');
    illustration.className = 'searchresult-empty-illustration';
    const iconNode = stringToHtml(getIcon('noResult'));
    if (iconNode) illustration.append(iconNode);

    const h3 = document.createElement('h3');
    h3.textContent = 'No results found';

    const p = document.createElement('p');
    p.textContent = 'Please try different keywords or ';
    if (noResultLink) {
      const a = document.createElement('a');
      a.href = noResultLink;
      a.textContent = 'explore other sections of our website.';
      p.append(a);
    } else {
      p.textContent += 'explore other sections of our website.';
    }

    emptyDiv.append(illustration, h3, p);
    block.replaceChildren(emptyDiv);
    return;
  }

  const endpoint = getSearchEndpoint();

  const from = total === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const to = Math.min(currentPage * PAGE_SIZE, total);

  const container = document.createDocumentFragment();

  const header = document.createElement('div');
  header.className = 'searchresult-header';
  header.textContent = `Showing ${from}-${to} of ${total} Results`;
  container.append(header);

  const ul = document.createElement('ul');
  ul.className = 'searchresult-list fade-in';

  results.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'searchresult-item';

    const titleDiv = document.createElement('div');
    titleDiv.className = 'searchresult-title';

    const a = document.createElement('a');
    a.href = item.path.endsWith('.pdf') ? endpoint + item.path : shortenURL(item.path);
    a.textContent = item.title;

    const infoP = document.createElement('p');
    infoP.className = 'searchresult-info';

    if (item.highlight || (item.path.endsWith('.pdf') && item.highlight === '')) {
      const descSpan = document.createElement('span');
      descSpan.className = 'searchresult-desc';

      if (item.path.endsWith('.pdf') && item.highlight === '') {
        descSpan.textContent = 'Match found in document content';
      } else {
        const highlighted = highlight(item.highlight, q);
        const highlightedNode = stringToHtml(highlighted);
        if (highlightedNode) descSpan.append(highlightedNode);
      }
      infoP.append(descSpan);
    }

    titleDiv.append(a, infoP);

    const readMore = document.createElement('a');
    readMore.className = 'searchresult-link';
    readMore.href = a.href;
    readMore.textContent = 'Read More';

    li.append(titleDiv, readMore);
    ul.append(li);
  });

  container.append(ul);

  const paginationStr = renderPagination(currentPage, totalPages);
  const paginationNode = stringToHtml(paginationStr);
  if (paginationNode) container.append(paginationNode);

  block.replaceChildren(container);

  setTimeout(() => {
    const items = block.querySelectorAll('.searchresult-item');

    items.forEach((item, index) => {
      const link = item.querySelector('.searchresult-title a');
      const readMoreLink = item.querySelector('.searchresult-link');

      const handleClick = (e, targetHref) => {
        e.preventDefault();
        const absolutePosition = ((currentPage - 1) * PAGE_SIZE) + index + 1;

        // eslint-disable-next-line no-underscore-dangle
        window.__searchEventData = {
          searchTerm: q,
          pageNumber: currentPage,
          position: absolutePosition,
          title: link ? link.textContent.trim() : '',
          url: targetHref,
        };

        dispatchSearchAnalyticsEvent('internalSearchResultClick');

        setTimeout(() => {
          window.location.href = targetHref;
        }, 300);
      };

      if (link) {
        link.addEventListener('click', (e) => handleClick(e, link.href));
      }

      if (readMoreLink) {
        readMoreLink.addEventListener('click', (e) => handleClick(e, readMoreLink.href));
      }
    });
  }, 0);
};

const loadPage = async (block, q, page, pushState, noResultLink) => {
  block.classList.add('is-loading');

  const basePath = resolveSearchBasePath();

  const fetchPage = async (pageToLoad) => {
    const offset = (pageToLoad - 1) * PAGE_SIZE;
    const endpoint = `${getSearchEndpoint()
      + basePath
      }/jcr:content.contentsearch.json`
      + `?q=${encodeURIComponent(q)}&offset=${offset}&limit=${PAGE_SIZE}`;

    const resp = await fetch(endpoint);
    return resp.json();
  };

  let data = await fetchPage(page);

  let results = data.results || [];
  const total = data.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  let currentPage = page;

  if (currentPage > totalPages) {
    currentPage = 1;

    data = await fetchPage(currentPage);
    results = data.results || [];

    const url = new URL(window.location);
    url.searchParams.set('page', currentPage);
    window.history.replaceState({}, '', url);
  }

  if (pushState && currentPage === page) {
    const url = new URL(window.location);
    url.searchParams.set('page', currentPage);
    window.history.pushState({ page: currentPage }, '', url);
  }

  renderResults(block, q, results, currentPage, total, totalPages, noResultLink);

  window.searchResultCount = total;
  // eslint-disable-next-line no-underscore-dangle
  window.__searchEventData = {
    searchTerm: q,
    totalResults: total,
    pageNumber: currentPage,
    resultsPerPage: PAGE_SIZE,
    resultStart: total === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1,
    resultEnd: Math.min(currentPage * PAGE_SIZE, total),
  };

  if (total > 0) {
    dispatchSearchAnalyticsEvent('internalSearchResultsView');
  } else {
    dispatchSearchAnalyticsEvent('internalZeroSearchResultsView');
  }

  block.classList.remove('is-loading');

  waitForElement('.search-suggestion-box', (box) => {
    const input = box.querySelector('input.search-input');
    if (input && q) {
      input.value = q;
    }

    let info = box.querySelector('.search-suggestion-result-info');
    if (!info) {
      info = document.createElement('div');
      info.className = 'search-suggestion-result-info';

      const suggestions = box.querySelector('.search-suggestions');
      if (suggestions) {
        box.insertBefore(info, suggestions);
      } else {
        box.appendChild(info);
      }
    }

    info.replaceChildren();
    info.append('We found ');
    const strong = document.createElement('strong');
    strong.textContent = String(total);
    info.append(strong, ' result(s) matching your search');
    moveSearchSuggestionOutOfHeader();
  });
};

const bindPagination = (block, q) => {
  block.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-page]');
    if (!btn) return;

    e.preventDefault();

    const page = Number(btn.dataset.page);
    if (!page) return;

    const currentPage = Number(new URLSearchParams(window.location.search).get('page') || 1);

    // eslint-disable-next-line no-underscore-dangle
    window.__searchEventData = {
      searchTerm: q,
      fromPage: currentPage,
      toPage: page,
    };

    dispatchSearchAnalyticsEvent('internalSearchPaginationClick');

    loadPage(block, q, page, true);

    // Scroll to the top of the search result block
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  });
};

export default async function decorate(block) {
  block.classList.add('fade-item');

  let noResultLink = '';
  let linkProp = block.querySelector(
    '[data-aue-prop="noResultLink"], [data-gen-prop="noResultLink"], [data-aue-model="noResultLink"], [data-gen-model="noResultLink"]',
  );

  if (!linkProp) {
    const contentChildren = Array.from(block.children);
    linkProp = contentChildren.find((child) => child.querySelector('a'));

    if (!linkProp && contentChildren.length > 1) {
      [, linkProp] = contentChildren;
    }
  }

  if (linkProp) {
    const a = linkProp.querySelector('a');
    if (a) {
      noResultLink = a.getAttribute('href') || '';
    } else {
      noResultLink = linkProp.textContent.trim();
    }

    linkProp.style.display = 'none';
  }

  const params = new URLSearchParams(window.location.search);
  const q = params.get('q');

  if (!q) {
    const noQueryP = document.createElement('p');
    noQueryP.textContent = 'No search query';
    block.replaceChildren(noQueryP);
    return;
  }

  const page = Number(params.get('page') || 1);
  if (!page || page < 1) return;

  bindPagination(block, q, noResultLink);
  await loadPage(block, q, page, false, noResultLink);
}
