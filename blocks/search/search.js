export default function decorate(block) {
  // Extract data from block content
  const title = block.querySelector('div:nth-child(1) > div')?.textContent || '';
  const placeholder = block.querySelector('div:nth-child(2) > div')?.textContent || 'Search...';
  const ctaCaption = block.querySelector('div:nth-child(3) > div')?.textContent || 'Search';
  const iconClass = block.querySelector('div:nth-child(4) > div')?.textContent || 'search';
  const redirectToResultsPage = block.querySelector('div:nth-child(5) > div')?.textContent === 'true';
  const resultsPageLink = block.querySelector('div:nth-child(6) > div > a')?.getAttribute('href') || '/search';
  
  // Clear the block
  block.innerHTML = '';
  
  // Create search form
  const searchForm = document.createElement('form');
  searchForm.className = 'search-form';
  searchForm.role = 'search';
  searchForm.action = redirectToResultsPage ? resultsPageLink : '/search';
  searchForm.method = 'get';
  
  // Create title if present
  if (title) {
    const titleEl = document.createElement('h2');
    titleEl.className = 'search-title';
    titleEl.textContent = title;
    searchForm.appendChild(titleEl);
  }
  
  // Create search input container
  const searchContainer = document.createElement('div');
  searchContainer.className = 'search-container';
  
  // Create search input
  const searchInput = document.createElement('input');
  searchInput.type = 'search';
  searchInput.name = 'q';
  searchInput.placeholder = placeholder;
  searchInput.className = 'search-input';
  searchInput.setAttribute('aria-label', placeholder);
  searchContainer.appendChild(searchInput);
  
  // Create search button with icon
  const searchButton = document.createElement('button');
  searchButton.type = 'submit';
  searchButton.className = 'search-button';
  
  // Add icon
  const iconSpan = document.createElement('span');
  iconSpan.className = `icon icon-${iconClass}`;
  iconSpan.setAttribute('aria-hidden', 'true');
  searchButton.appendChild(iconSpan);
  
  // Add button text
  const buttonText = document.createElement('span');
  buttonText.className = 'search-button-text';
  buttonText.textContent = ctaCaption;
  searchButton.appendChild(buttonText);
  
  searchContainer.appendChild(searchButton);
  searchForm.appendChild(searchContainer);
  
  block.appendChild(searchForm);
} 