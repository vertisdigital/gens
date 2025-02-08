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
  const titleElement = exploreMoreContainer.querySelector('[data-aue-prop="title"]');
  const firstCtaElement = exploreMoreContainer.querySelector('[data-aue-prop="firstCtaCaption"]');
  const firstCtaHrefElement = exploreMoreContainer.querySelector('a[href*="investor-relations"]');
  const secondCtaElement = exploreMoreContainer.querySelector('[data-aue-prop="secondCtaCaption"]');
  const secondCtaHrefElement = exploreMoreContainer.querySelector('a[href*="our-projects"]');

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
      <div class="exploremore-wrapper-container container-xl container-lg container-md container-sm">
          <h2 class="exploremore-title" ${titleAttributes}>${title}</h2>
          <div class="row exploremore-links">
              <div class="col-xl-6 col-lg-6 col-md-3 col-sm-4 exploremore-item ">
                  <div class="exploremore-caption" ${firstCtaAttributes}>${firstCtaCaption}</div>
                  <div class="exploremore-link-container">
                      <a href="${firstCtaHref}" class="exploremore-link exploremore-first" ${firstCtaHrefAttributes}>
                        ${forwardArrow}
                      </a>
                  </div>
              </div>
              <div class="col-xl-6 col-lg-6 col-md-3 col-sm-4 exploremore-item">
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

// Wrap CTA sections for styling
// document.addEventListener('DOMContentLoaded', function() {
//   const exploreMore = document.querySelector('.exploremore');
//   if (!exploreMore) return;

//   // Create CTA group container
//   const ctaGroup = document.createElement('div');
//   ctaGroup.className = 'cta-group';

//   // Get title and move it before CTA group
//   const title = exploreMore.querySelector('[data-aue-prop="title"]').parentNode;
//   exploreMore.insertBefore(title, exploreMore.firstChild);

//   // Process CTAs
//   const firstCaption = exploreMore.querySelector('[data-aue-prop="firstCtaCaption"]');
//   const secondCaption = exploreMore.querySelector('[data-aue-prop="secondCtaCaption"]');
//   const firstLink = exploreMore.querySelector('a[href*="investor-relations"]');
//   const secondLink = exploreMore.querySelector('a[href*="our-projects"]');

//   if (firstCaption && firstLink) {
//     const wrapper1 = document.createElement('div');
//     wrapper1.className = 'cta-wrapper';
//     const linkWrapper1 = document.createElement('div');
//     linkWrapper1.className = 'link-wrapper';
//     wrapper1.appendChild(firstCaption.parentNode);
//     linkWrapper1.appendChild(firstLink);
//     wrapper1.appendChild(linkWrapper1);
//     ctaGroup.appendChild(wrapper1);
//   }

//   if (secondCaption && secondLink) {
//     const wrapper2 = document.createElement('div');
//     wrapper2.className = 'cta-wrapper';
//     const linkWrapper2 = document.createElement('div');
//     linkWrapper2.className = 'link-wrapper';
//     wrapper2.appendChild(secondCaption.parentNode);
//     linkWrapper2.appendChild(secondLink);
//     wrapper2.appendChild(linkWrapper2);
//     ctaGroup.appendChild(wrapper2);
//   }

//   // Add CTA group to explore more section
//   exploreMore.appendChild(ctaGroup);

//   // Remove original link elements
//   firstLink?.parentNode?.remove();
//   secondLink?.parentNode?.remove();
// });
