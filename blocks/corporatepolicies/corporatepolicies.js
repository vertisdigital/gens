import SvgIcon from "../../shared-components/SvgIcon.js";
import Heading from "../../shared-components/Heading.js";

function getLastUrlSegment() {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const segments = pathname.split('/').filter(Boolean);
  return segments.length > 0 ? segments[segments.length - 1] : '';
}

function addPageClassFromUrl(target) {
  const segment = getLastUrlSegment();
  if (!segment) return;
  const slug = segment.replace(/[^a-z0-9-]/gi, '-').toLowerCase().replace(/-+/g, '-').replace(/^-|-$/g, '');
  if (slug) {
    target.classList.add(`page-${slug}`);
  }
}

export default function decorate(block) {
  addPageClassFromUrl(document.body);
  const wrapper = block.closest('.corporatepolicies-wrapper');
  if (wrapper) addPageClassFromUrl(wrapper);

  block.classList.add('fade-item');
  // check if corporate policies has background or not
  const noBackground = block.classList.contains('no-background');
  if (noBackground) {
    block.closest('.corporatepolicies-wrapper').classList.add('no-background');
  } else {
    block.closest('.corporatepolicies-wrapper').classList.remove('no-background');
  }

  const noDivider = block.classList.contains('no-divider');
  if (noDivider) {
    block.closest('.corporatepolicies-wrapper').classList.add('no-divider');
  } else {
    block.closest('.corporatepolicies-wrapper').classList.remove('no-divider');
  }
  // Store all child elements before modifying the block
  const allChildElements = Array.from(block.children);

  // Clear block before appending new structure
  block.innerHTML = "";

  block.innerHTML = `
    <div class="container corporate-policies-list">
      ${allChildElements
        .map((child) => {
          child.classList.add("row", "corporate-policies-list-item");
          const children = Array.from(child.children);

          // Use fixed indices 8 for subtitle, 9 for style
          const subtitleCell = children[8];
          const styleCell = children[9];

          const itemStyle = styleCell?.textContent?.trim() || '';
          if (itemStyle && itemStyle !== 'default') {
            child.classList.add(itemStyle);
          }

          let firstChildHtml = "";
          let subtitleHtml = "";

          if (children.length > 0) {
            // Handle heading replacement
            const firstChildText = children[0].textContent?.trim();

            let headingClassName = '';
            if(firstChildText.length > 20 && firstChildText.length < 25) {
              headingClassName = 'w-50';
            }
            if(firstChildText.length < 20) {
              headingClassName = 'w-40';
            }
            if(firstChildText.length > 25 && firstChildText.length < 35) {
              headingClassName = 'w-75';
            }


            const headingHtml = Heading({
              level: 2,
              text: firstChildText,
              className: `corporate-policies-heading ${headingClassName}`,
            });
            firstChildHtml = children[0].outerHTML.replace(/<p[^>]*>.*?<\/p>/, headingHtml);

            // handle subtitle replacement
            if (subtitleCell?.textContent?.trim()) {
              subtitleCell.classList.add("corporate-policies-subtitle");
              subtitleHtml = subtitleCell.outerHTML;
            }
          }

          let remainingChildren = "";
          let ctaIcon = "";


          if (children.length > 2) {
            const checkDownloadLink = children[5]?.textContent?.trim();
            const lastChild = children[4];

            // If checkDownloadLink is 'true', use the last element (index 6), otherwise use index 3
            const linkElement = checkDownloadLink === 'true' ? children[6] : children[3];
            const lastThirdChild = children[2]; // Third-last element

            const lastChildText = lastChild?.textContent?.trim();
            const lastThirdText = lastThirdChild?.textContent?.trim();

            // Create icon only if lastChildText exists
            if (lastChildText) {
              ctaIcon = SvgIcon({
                name: lastChildText.replace(/-/g, "").toLowerCase(),
                className: "corporate-policies-cta",
                size: "16px",
              });
              lastChild.textContent = ""; // Clear the text after extracting the icon
            }

            if (lastThirdText) {
              // Modify <a> only if lastThirdChild has text
              const link = linkElement?.querySelector("a");
              if (link) {
                link.classList.add('vd-link');
                link.title = lastThirdChild.textContent;
                link.target = children[7]?.textContent || "_self";
                link.innerHTML = `<span>${lastThirdText}</span>${ctaIcon}`;
                lastThirdChild.textContent = ""; // Clear moved text
              }

              // Set remaining children excluding first one, subtitle, and style
              // Only collect indices 1, 2, 3, 4, 5, 6, 7 that are defined
              if (checkDownloadLink === 'true') {
                 remainingChildren = [children[1], children[4], children[6]].filter(Boolean).map(c => c.outerHTML).join("");
              } else if (checkDownloadLink === 'false') {
                 remainingChildren = [children[1], children[2], children[3], children[4]].filter(Boolean).map(c => c.outerHTML).join("");
              } else {
                 // Fallback if not true/false: take slice(1, 8) to avoid subtitle and style
                 remainingChildren = children.slice(1, 8).map((c) => c.outerHTML).join("");
              }
            } else {
              // If no text in lastThirdChild, just use the second child as remaining
              remainingChildren = children[1] ? children[1].outerHTML : "";
            }
          } else {
            // If there are not enough children, keep all except the first one
            remainingChildren = children.slice(1).map((c) => c.outerHTML).join("");
          }

          // Preserve `child` wrapper by replacing its inner content
          return child.outerHTML.replace(
            child.innerHTML,
            `
              <div class="col-xl-6 col-lg-6 col-md-3 col-sm-4 col-xs-4 left-col">
                ${subtitleHtml}
                ${firstChildHtml}
              </div>
              <div class="col-xl-6 col-lg-6 col-md-3 col-sm-4 col-xs-4 right-col">
                ${remainingChildren}
              </div>
            `
          );
        })
        .join("")}
    </div>
  `;
}