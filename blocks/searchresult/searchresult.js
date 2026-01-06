
export const stripHtml = (html) => {
  let tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || "";
}
export const highlight = (text, q) => {
  if (!text || !q) return text || '';
  return stripHtml(text).replace(
    new RegExp(`(${q})`, 'gi'),
    '<strong>$1</strong>'
  );
};

export const shortenURL = (url) => {
    return url.replace('/content/genting-singapore', '').replace('.html', '');
}

export default async function decorate(block) {
  const params = new URLSearchParams(window.location.search);
  const q = params.get('q');

  if (!q) {
    block.innerHTML = '<p>No search query</p>';
    return;
  }

  const endpoint = `https://publish-p144202-e1488374.adobeaemcloud.com/content/genting-singapore/jcr:content.contentsearch.json?q=${encodeURIComponent(q)}`;

  const resp = await fetch(endpoint);
  const data = await resp.json();

  const results = data.results || [];
  const total = results.length;

  block.innerHTML = `
    <div class="searchresult-header">
      Showing ${total} Results
    </div>
    <ul class="searchresult-list">
      ${results.map(item => `
        <li class="searchresult-item">
          <div class="searchresult-title">
            <a href="${shortenURL(item.path)}">${item.title}</a>
            ${item.date ? `<div class="searchresult-date">${item.date}</div>` : ''}
            ${item.highlight
          && `<p class="searchresult-desc">${highlight(item.highlight, q)}</p>`
            }
          </div>
          <a class="searchresult-link" href="${shortenURL(item.path)}">Read More</a>
        </li>
      `).join('')}
    </ul>
  `;
}
