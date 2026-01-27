import SvgIcon from '../../shared-components/SvgIcon.js';
/**
* Loads and decorates the Hero Banner
* @param {Element} block The herobanner block element
*/
export default function decorate(block) {
  const exploreMoreContainer = block;

  if (!exploreMoreContainer) return;

  // Function to extract attributes dynamically
  const extractAttributes = (element) => {
    if (!element) return '';
    return Array.from(element.attributes)
      .map((attr) => `${attr.name}="${attr.value}"`)
      .join(' ');
  };

  // Extract elements
  const allDivElements = block.children;
  const titleElement = allDivElements[0];
  const firstCtaElement = allDivElements[1].querySelector('p');
  const secondCtaElement = allDivElements[3].querySelector('p');

  const allLinks = exploreMoreContainer.querySelectorAll('a');
  const firstCtaHrefElement = allLinks?.[0];
  const secondCtaHrefElement = allLinks?.[1];

  // Extract text content and attributes
  const title = titleElement?.textContent?.trim() || '';
  const titleAttributes = extractAttributes(titleElement);

  const firstCtaCaption = firstCtaElement?.textContent?.trim() || '';
  const firstCtaAttributes = extractAttributes(firstCtaElement);
  const firstCtaHref = firstCtaHrefElement?.getAttribute('href') || '#';
  const firstCtaHrefAttributes = extractAttributes(firstCtaHrefElement);

  const secondCtaCaption = secondCtaElement?.textContent?.trim() || '';
  const secondCtaAttributes = extractAttributes(secondCtaElement);
  const secondCtaHref = secondCtaHrefElement?.getAttribute('href') || '#';
  const secondCtaHrefAttributes = extractAttributes(secondCtaHrefElement);

  // Clear existing content
  exploreMoreContainer.innerHTML = '';

    // Create circular arrow SVG button
  const arrowSVG = `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 1C36.7025 1 47 11.2975 47 24C47 36.7025 36.7025 47 24 47C11.2975 47 1 36.7025 1 24C1 11.2975 11.2975 1 24 1Z" stroke="#8D713E" stroke-width="2"/>
    <path d="M24.165 17.1323C24.3732 16.9453 24.6974 16.9581 24.8896 17.1606L30.7275 23.3218C31.0905 23.7048 31.0905 24.2961 30.7275 24.6792L24.8896 30.8393C24.6974 31.0421 24.3733 31.0549 24.165 30.8677C23.9569 30.6804 23.9437 30.3645 24.1357 30.1616L29.499 24.5005H17.5C17.2239 24.5005 17.0001 24.2765 17 24.0005C17 23.7243 17.2239 23.5005 17.5 23.5005H29.499L24.1357 17.8393C23.9435 17.6364 23.9568 17.3196 24.165 17.1323Z" fill="#8D713E"/>
  </svg>`;

  // Create new structure with href inside a separate div
  exploreMoreContainer.innerHTML = `
      <div class="exploremore-wrapper-container container">
          <h3 class="exploremore-title" ${titleAttributes}>${title}</h3>
          <div class="row exploremore-links">
              <div class="col-xl-6 col-md-3 col-sm-4 exploremore-item ">
                  <h6 class="exploremore-caption" ${firstCtaAttributes}>${firstCtaCaption}</h6>
                  <div class="exploremore-link-container">
                      <a href="${firstCtaHref}" class="exploremore-link exploremore-first" ${firstCtaHrefAttributes}>
                        ${arrowSVG}
                      </a>
                  </div>
              </div>
              <div class="col-xl-6 col-md-3 col-sm-4 exploremore-item">
                  <h6 class="exploremore-caption" ${secondCtaAttributes}>${secondCtaCaption}</h6>
                  <div class="exploremore-link-container">
                      <a href="${secondCtaHref}" class="exploremore-link exploremore-second" ${secondCtaHrefAttributes}>
                        ${arrowSVG}
                      </a>
                  </div>
              </div>
          </div>
      </div>
  `;
}
