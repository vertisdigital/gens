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

  // SVG forward icon
  const forwardArrow = SvgIcon({
    name: 'arrow', className: 'forwardArrow', size: '16', color: '',
  });

  // Clear existing content
  exploreMoreContainer.innerHTML = '';

  // Create new structure with href inside a separate div
  exploreMoreContainer.innerHTML = `
      <div class="exploremore-wrapper-container container">
          <h2 class="exploremore-title" ${titleAttributes}>${title}</h2>
          <div class="row exploremore-links">
              <div class="col-xl-6 col-md-3 col-sm-4 exploremore-item ">
                  <div class="exploremore-caption" ${firstCtaAttributes}>${firstCtaCaption}</div>
                  <div class="exploremore-link-container">
                      <a href="${firstCtaHref}" class="exploremore-link exploremore-first" ${firstCtaHrefAttributes}>
                        ${forwardArrow}
                      </a>
                  </div>
              </div>
              <div class="col-xl-6 col-md-3 col-sm-4 exploremore-item">
                  <div class="exploremore-caption" ${secondCtaAttributes}>${secondCtaCaption}</div>
                  <div class="exploremore-link-container">
                      <a href="${secondCtaHref}" class="exploremore-link exploremore-second" ${secondCtaHrefAttributes}>
                        ${forwardArrow}
                      </a>
                  </div>
              </div>
          </div>
      </div>
  `;
}
