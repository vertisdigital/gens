import Heading from '../../shared-components/Heading.js';
import SvgIcon from '../../shared-components/SvgIcon.js';
import stringToHTML from '../../shared-components/Utility.js';

export default function decorate(block) {
  const blockchildren = [...block.children];
  const searchInputDetails = blockchildren[0] ? [...blockchildren[0].children] : [];
  const searchResultsDetails = blockchildren[1] ? [...blockchildren[1].children] : [];

  let searchData = {};
  const fetchSearchData = async () => {
    try {
      const response = await fetch('/query-index.json');
      const data = await response.json();
      searchData = data;
      handleQueryOnLoad();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const searchWrapper = document.createElement('div');
  searchWrapper.classList.add('search-nav');

  const searchInputContainer = document.createElement('div');
  searchInputContainer.classList.add('container');

  const searchHeadingWrapper = document.createElement('div');
  searchHeadingWrapper.className = 'search-heading-wrapper';

  const searchTitle = searchInputDetails[0]?.textContent.trim() || 'Search';
  const searchHeading = stringToHTML(Heading({ level: 2, text: searchTitle, className: 'search-heading' }));

  const dropDownCloseBtn = document.createElement('button');
  dropDownCloseBtn.className = 'close-btn';
  dropDownCloseBtn.setAttribute('aria-label', 'Close menu');
  dropDownCloseBtn.innerHTML = SvgIcon({ name: 'close', className: 'close-icon', size: 18 });

  dropDownCloseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    document.querySelector('.secondary-nav')?.classList.remove('active');
    document.querySelector('.header .search-wrapper')?.classList.remove('active');
  });

  searchHeadingWrapper.append(searchHeading, dropDownCloseBtn);

  const inputPlaceholder = searchInputDetails[2]?.textContent.trim() || 'Search...';
  const searchInputWrapper = document.createElement('div');
  searchInputWrapper.className = 'search-input-wrapper';

  const inputWrapper = document.createElement('div');
  inputWrapper.className = 'input-wrapper';

  const inputSearchIcon = stringToHTML(SvgIcon({ name: 'search', class: 'search-icon', size: '18px' }));
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.placeholder = inputPlaceholder;
  searchInput.className = 'search-input';

  const clearBtn = document.createElement('div');
  clearBtn.className = 'clear-btn-wrapper';
  const clearBtnIcon = stringToHTML(SvgIcon({ name: 'close', className: 'close-icon', size: 18 }));
  const clearBtnText = document.createElement('span');
  clearBtnText.className = 'clear-btn-text';
  clearBtnText.textContent = 'Clear';
  clearBtn.append(clearBtnIcon, clearBtnText);

  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    searchResultsWrapper.classList.remove('active');
    updateSearch('');
  });

  const searchBtn = document.createElement('button');
  searchBtn.className = 'search-btn';
  searchBtn.innerHTML = searchInputDetails[1]?.innerHTML || 'Search';
  searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query.length > 3) {
      window.location.href = `/searchresults?query=${encodeURIComponent(query)}`;
    }
    searchInput.value = '';
  });

  inputWrapper.append(inputSearchIcon, searchInput, clearBtn);
  searchInputWrapper.append(inputWrapper, searchBtn);
  searchInputContainer.append(searchHeadingWrapper, searchInputWrapper);

  const searchResultCount = document.createElement('div');
  searchResultCount.className = 'search-result-count';
  searchInputContainer.appendChild(searchResultCount);
  searchWrapper.appendChild(searchInputContainer);

  const searchResultsWrapper = document.createElement('div');
  searchResultsWrapper.className = 'container search-results-wrapper';

  const searchTips = document.createElement('div');
  searchTips.className = 'search-tips';

  if (searchResultsDetails.length >= 2) {
    const heading = Heading({ level: 2, text: searchResultsDetails[0].textContent.trim(), className: 'search-tips-heading' });
    const list = searchResultsDetails[1];
    list.className = 'search-tips-list';
    searchTips.append(stringToHTML(heading), list);
  }

  const searchResults = document.createElement('div');
  searchResults.className = 'search-results';
  const paginationWrapper = document.createElement('div');
  paginationWrapper.className = 'pagination-wrapper';

  searchResultsWrapper.append(searchTips, searchResults, paginationWrapper);

  const highlightMatch = (text, keyword) => {
    const regex = new RegExp(`(${keyword})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
  };

  const renderResults = (query, page = 1) => {
    const itemsPerPage = 2;
    const results = searchData.data.filter((item) => item.fullContent.toLowerCase().includes(query.toLowerCase()));

    const start = (page - 1) * itemsPerPage;
    const paginatedResults = results.slice(start, start + itemsPerPage);

    searchResults.innerHTML = '';
    if (paginatedResults.length > 0) {
      searchResultsWrapper.classList.add('active');
      searchResultCount.classList.add('active');
      searchResultCount.innerHTML = `${results.length} results found for <span>'${query}'</span>`;

      paginatedResults.forEach((item) => {
        const div = document.createElement('div');
        div.className = 'search-results-item';
        div.innerHTML = `
          <a class="title" href="${item.path}">${highlightMatch(item.title, query)}</a>
          <div class="description">${highlightMatch(item.description, query)}</div>
        `;
        searchResults.appendChild(div);
      });

      renderPagination(results.length, page, query);
    } else {
      searchResultsWrapper.classList.remove('active');
      searchResultCount.classList.add('active');
      searchResultCount.innerHTML = `No result found for <span>'${query}'</span>`;
    }
  };

  const renderPagination = (total, currentPage, query) => {
    const itemsPerPage = 2;
    const totalPages = Math.ceil(total / itemsPerPage);
    paginationWrapper.innerHTML = '';

    if (totalPages > 1) {
      const leftArrow = document.createElement('button');
      leftArrow.innerHTML = SvgIcon({ name: 'leftarrow', className: 'arrow-icon', size: 18 });
      leftArrow.className = 'left-arrow';
      leftArrow.disabled = currentPage === 1;
      leftArrow.addEventListener('click', () => renderResults(query, currentPage - 1));

      const rightArrow = document.createElement('button');
      rightArrow.innerHTML = SvgIcon({ name: 'rightarrow', className: 'arrow-icon', size: 18 });
      rightArrow.className = 'right-arrow';
      rightArrow.disabled = currentPage === totalPages;
      rightArrow.addEventListener('click', () => renderResults(query, currentPage + 1));

      const pageInfo = document.createElement('span');
      pageInfo.className = 'page-info';
      pageInfo.textContent = `Page ${currentPage} / ${totalPages}`;

      paginationWrapper.append(leftArrow, pageInfo, rightArrow);
    }
  };

  const updateSearch = (query) => {
    if (query.length > 3) {
      clearBtn.classList.add('active');
      renderResults(query);
    } else {
      searchResults.innerHTML = '';
      paginationWrapper.innerHTML = '';
      searchResultsWrapper.classList.remove('active');
      clearBtn.classList.remove('active');
      searchResultCount.classList.remove('active');
    }
  };

  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  };

  const handleInput = () => {
    const query = searchInput.value.trim();
    updateSearch(query);
  };

  searchInput.addEventListener('input', debounce(handleInput, 300));

  const handleQueryOnLoad = () => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('query')?.trim();
    if (query && query.length > 3) {
      searchInput.value = query;
      updateSearch(query);
    }
  };

  fetchSearchData();

  block.innerHTML = '';
  block.append(searchWrapper, searchResultsWrapper);
}
