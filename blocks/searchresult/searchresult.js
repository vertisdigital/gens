import { getIcon } from "../../shared-components/icons/index.js";

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

export const stripHtml = (html) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || "";
};

export const highlight = (text, q) => {
  if (!text || !q) return text || "";
  return stripHtml(text).replace(
    new RegExp(`(${q})`, "gi"),
    "<strong>$1</strong>"
  );
};

export const shortenURL = (url) =>
  url.replace("/content/genting-singapore", "").replace(".html", "");

const PAGE_SIZE = 5;

const formatPage = (page) => String(page).padStart(2, "0");

const renderPagination = (currentPage, totalPages) => {
  if (totalPages <= 1) return "";

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
      let ellipsis = "";
      if (prev && page - prev > 1) {
        ellipsis = `<span class="pagination-ellipsis">…</span>`;
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
    .join("");

  return `
    <nav class="pagination">
      ${currentPage > 1
      ? `<button class="pagination-prev" data-page="${currentPage - 1}">
              <span class="previous-icon">${getIcon("arrowleftLarge")}</span>
              Previous
            </button>`
      : `<span class="pagination-prev disabled">Previous</span>`
    }
      ${items}
      ${currentPage < totalPages
      ? `<button class="pagination-next" data-page="${currentPage + 1}">
              Next<span class="next-icon">${getIcon("arrowrightLarge")}</span>
            </button>`
      : `<span class="pagination-next disabled">Next</span>`
    }
    </nav>
  `;
};

export const formatDate = (dateStr) => {
  if (!dateStr) return "";

  const [month, day, year] = dateStr.split("/").map(Number);
  if (!day || !month || !year) return "";

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
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

const renderResults = (block, q, results, currentPage, total, totalPages) => {
  if (total === 0) {
    block.innerHTML = `
      <div class="searchresult-empty">
        <div class="searchresult-empty-illustration"><img src="../../icons/no-result-found.png"/></div>

        <h3>No results found for ‘${q}’.</h3>
        <p>Please try again or connect with our representative.</p>
      </div>
    `;
    return;
  }

  const from = total === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const to = Math.min(currentPage * PAGE_SIZE, total);

  block.innerHTML = `
    <div class="searchresult-header">
      ${total > 0 ? `Showing ${from}-${to} of ${total} Results` : "No results found"}
    </div>

    <ul class="searchresult-list fade-in">
      ${results
      .map(
        (item) => `
          <li class="searchresult-item">
            <div class="searchresult-title">
              <a href="${shortenURL(item.path)}">${item.title}</a>
              <p class="searchresult-info">
                ${item.highlight
            ? `<span class="searchresult-desc">${highlight(
              item.highlight,
              q
            )}</span>`
            : ""
          }
              </p>
            </div>
            <a class="searchresult-link" href="${shortenURL(
            item.path
          )}">Read More</a>
          </li>
        `
      )
      .join("")}
    </ul>

    ${renderPagination(currentPage, totalPages)}
  `;
};

const loadPage = async (block, q, page, pushState) => {
  block.classList.add("is-loading");

  const basePath = resolveSearchBasePath();

  const fetchPage = async (pageToLoad) => {
    const offset = (pageToLoad - 1) * PAGE_SIZE;
    const endpoint =
      "https://publish-p144202-e1488374.adobeaemcloud.com" +
      basePath +
      "/jcr:content.contentsearch.json" +
      `?q=${encodeURIComponent(q)}&offset=${offset}&limit=${PAGE_SIZE}`;

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
    url.searchParams.set("page", currentPage);
    window.history.replaceState({}, "", url);
  }

  if (pushState && currentPage === page) {
    const url = new URL(window.location);
    url.searchParams.set("page", currentPage);
    window.history.pushState({ page: currentPage }, "", url);
  }

  renderResults(block, q, results, currentPage, total, totalPages);

  block.classList.remove("is-loading");

  waitForElement(".search-suggestion-box", (box) => {
    const input = box.querySelector("input.search-input");
    if (input && q) {
      input.value = q;
    }

    let info = box.querySelector(".search-suggestion-result-info");
    if (!info) {
      info = document.createElement("div");
      info.className = "search-suggestion-result-info";

      const suggestions = box.querySelector(".search-suggestions");
      if (suggestions) {
        box.insertBefore(info, suggestions);
      } else {
        box.appendChild(info);
      }
    }

    info.innerHTML = `
    We found <strong>${total}</strong> result(s) that match
    <strong>${q}</strong>
  `;
  moveSearchSuggestionOutOfHeader();
  });

};


const bindPagination = (block, q) => {
  block.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-page]");
    if (!btn) return;

    e.preventDefault();

    const page = Number(btn.dataset.page);
    if (!page) return;

    loadPage(block, q, page, true);
  });
};

export default async function decorate(block) {
  block.classList.add('fade-item');
  const params = new URLSearchParams(window.location.search);
  const q = params.get("q");

  if (!q) {
    block.innerHTML = "<p>No search query</p>";
    return;
  }

  const page = Number(params.get("page") || 1);
  if (!page || page < 1) return;

  bindPagination(block, q);
  await loadPage(block, q, page, false);
}
