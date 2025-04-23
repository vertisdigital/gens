import Heading from '../../shared-components/Heading.js';
import ImageComponent from '../../shared-components/ImageComponent.js';
import SvgIcon from '../../shared-components/SvgIcon.js';
import stringToHTML from '../../shared-components/Utility.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Loads and decorates the Search Results block.
 * @param {Element} block The searchresult block element
 */
export default function decorate(block) {

    const blockchildren = [...block.children];

     // Fetching search Data and storing on load
    let searchData = {};
    const fetchSearchData = async () => {
        try {
        const response = await fetch('/query-index.json');
        const data = await response.json();
        searchData = data;
        console.log('searchData', searchData);

        } catch (error) {
        console.error('Error fetching data:', error);
        }
    }
    fetchSearchData();

    const searchWrapper = document.createElement('div');
    searchWrapper.classList.add('search-nav');

    // Header search dropdown
    const secondaryNavSearch = document.querySelector('.secondary-nav');

    const searchInputContainer = document.createElement('div');
    searchInputContainer.classList.add('container');

    const searchHeadingWrapper = document.createElement('div');
    searchHeadingWrapper.className = 'search-heading-wrapper';

    const searchTitle = blockchildren[0]?.textContent.trim();

    // Generating heading
    const searchHeading = stringToHTML(Heading({ level: 2, text: searchTitle, className: 'search-heading' }));

    // Header Search dropdown closing functionality
    const dropDownCloseBtn = document.createElement('button');
    dropDownCloseBtn.className = 'close-btn';
    dropDownCloseBtn.setAttribute('aria-label', 'Close menu');
    const dropDownCloseBtnIcon = SvgIcon({ name: 'close', className: 'close-icon', size: 18 });
    dropDownCloseBtn.innerHTML = dropDownCloseBtnIcon;
    dropDownCloseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    // searchWrapper.classList.remove('active');
    if(secondaryNavSearch) {
        secondaryNavSearch.classList.remove('active');
    }
    });

    // Append search heading and close button to heading wrapper
    searchHeadingWrapper.append(searchHeading, dropDownCloseBtn);


    // Search input
    const inputPlaceholder = blockchildren[1]?.textContent.trim() || 'Search...';
    const searchInputWrapper = document.createElement('div');
    searchInputWrapper.className = 'search-input-wrapper';

    const inputWrapper = document.createElement('div');
    inputWrapper.className = 'input-wrapper';
    const inputSearchIcon = stringToHTML(SvgIcon({ name: 'search', class: 'search-icon', size: '18px' }));
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder =  inputPlaceholder || 'Search...';
    searchInput.className = 'search-input';
    // const clearBtnWrapper = document.createElement('div');
    // clearBtnWrapper.className = 'clear-btn-wrapper';
    const clearBtn = stringToHTML(SvgIcon({ name: 'close', className: 'close-icon', size: 18 }));
    // const clearBtnText = document.createElement('span');
    // clearBtnText.className = 'clear-btn-text';
    // clearBtnText.textContent = 'Clear';
    // clearBtn.appendChild(clearBtnText);
    // clearBtnWrapper.appendChild(clearBtn);
    inputWrapper.append(inputSearchIcon, searchInput, clearBtn);

    // search Button
    const searchBtn = document.createElement('div');
    searchBtn.className = 'search-btn';
    searchBtn.innerHTML = blockchildren[2]?.innerHTML || 'Search';
  
    // append search input and button to the wrapper
    searchInputWrapper.append(inputWrapper, searchBtn);

    // Search result count
    const searchResultCount = document.createElement('div');
    searchResultCount.className = 'search-result-count';
    searchResultCount.textContent = '0 results found';
    searchResultCount.style.display = 'none'; // Initially hidden

    // append all search elements to the container
    searchInputContainer.append(searchHeadingWrapper, searchInputWrapper,searchResultCount);

    // Results wrapper
    const searchResultsWrapper = document.createElement('div');
    searchResultsWrapper.className = 'container search-results-wrapper';

    const searchResults = document.createElement("div");
    searchResults.className = "search-results";

    const searchTips = document.createElement("div");
    searchTips.className = "search-tips";
    searchTips.innerHTML = `
    <h2>Search tips:</h2>
    <ul>
        <li>Use quotes for exact phrases.</li>
        <li>Try different keywords.</li>
        <li>Check your spelling.</li>
    </ul>
    `;
    searchResults.innerHTML = ""; // Clear previous results

    searchResultsWrapper.append(searchTips,searchResults);

    // Show Suggestions
    const showResults = (query) => {
        if (query.length > 3) {
        clearBtn.classList.add('active');
        searchResults.innerHTML = "";
    
        const results = searchData.data.filter(item =>
            item.heroBannerAllDescriptions.toLowerCase().includes(query)
        );
    
        if(results.length > 0) {
            searchResultsWrapper.classList.add('active');
            searchResultCount.style.display = 'block';
            searchResultCount.innerHTML = searchResultCount.innerHTML = `${results.length} results found for <span>'${query}'</span>`;      ;
            searchResults.innerHTML = ""; // Clear previous results
            results.forEach(item => {
            const div = document.createElement("div");
            div.className = "search-results-item";
            div.innerHTML = `
                <a class="title" href="${item.path}">${item.title}</a>
                <div class="description">${highlightMatch(item.heroBannerAllDescriptions, query)}</div>
            `;
            searchResults.appendChild(div);
            });
        }
        else{
            searchResultsWrapper.classList.remove('active');
            searchResultCount.style.display = 'block';
            searchResultCount.innerHTML = `No result found for <span>'${query}'</span>`;      ;
                        
        }
        } else {
        searchResultsWrapper.classList.remove('active');
        clearBtn.classList.remove('active');
        searchResultCount.style.display = 'none'; // Hide result count
        searchResults.innerHTML = ""; // Optional: clear suggestions if input too short
        }
    };

    // Handle input with debounce
    const handleInput = debounce(() => {
        const query = searchInput.value.trim().toLowerCase();
        showResults(query);
    }, 300);

    // Search input functionality
    searchInput.addEventListener('input', handleInput);
  
    block.innerHTML = ""; // Clear the block content
    block.appendChild(searchWrapper);
    block.appendChild(searchResultsWrapper);
}
