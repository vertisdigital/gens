function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

async function fetchResults(keyword) {
  const url =
    `https://publish-p144202-e1488374.adobeaemcloud.com/content/genting-singapore/jcr:content.contentsearch.json?q=${encodeURIComponent(keyword)}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Search API failed');
  }
  return res.json();
}

export default async function decorate(block) {
  const keyword = getQueryParam('q');

  if (!keyword) {
    block.innerHTML = '<p>No search keyword</p>';
    return;
  }

  block.innerHTML = `<p>Searching for "<strong>${keyword}</strong>"...</p>`;

  try {
    const results = await fetchResults(keyword);

    if (!results.length) {
      block.innerHTML = '<p>No results found</p>';
      return;
    }

    const ul = document.createElement('ul');

    results.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `<a href="${item.path}.html">${item.title || item.path}</a>`;
      ul.appendChild(li);
    });

    block.innerHTML = '';
    block.appendChild(ul);
  } catch (e) {
    block.innerHTML = '<p>Error loading results</p>';
    console.error(e);
  }
}
