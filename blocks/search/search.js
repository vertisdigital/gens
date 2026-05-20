function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

async function fetchResults(keyword) {
  const url =
    `https://publish-p144202-e1512622.adobeaemcloud.com/content/genting-singapore/jcr:content.contentsearch.json?q=${encodeURIComponent(keyword)}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Search API failed');
  }
  return res.json();
}

export default async function decorate(block) {
  const keyword = getQueryParam('q');

  const keywordP = document.createElement('p');
  keywordP.textContent = 'Searching for "';
  const strong = document.createElement('strong');
  strong.textContent = keyword;
  keywordP.append(strong, '"...');
  block.replaceChildren(keywordP);

  try {
    const results = await fetchResults(keyword);

    if (!results || !results.length) {
      const noResultsP = document.createElement('p');
      noResultsP.textContent = 'No results found';
      block.replaceChildren(noResultsP);
      return;
    }

    const ul = document.createElement('ul');

    results.forEach(item => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `${item.path}.html`;
      a.textContent = item.title || item.path;
      li.appendChild(a);
      ul.appendChild(li);
    });

    block.replaceChildren(ul);
  } catch (e) {
    const errorP = document.createElement('p');
    errorP.textContent = 'Error loading results';
    block.replaceChildren(errorP);
    // eslint-disable-next-line no-console
    console.error(e);
  }
}
