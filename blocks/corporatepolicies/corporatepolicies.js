import SvgIcon from "../../shared-components/SvgIcon.js";
import Heading from "../../shared-components/Heading.js";

export default function decorate(block) {
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

          // Handle heading replacement
          let firstChildHtml = "";
          if (children.length > 0) {
            const firstChildText = children[0].textContent?.trim();
            const headingHtml = Heading({
              level: 2,
              text: firstChildText,
              className: "corporate-policies-heading",
            });
            firstChildHtml = children[0].outerHTML.replace(/<p[^>]*>.*?<\/p>/, headingHtml);
          }

          let remainingChildren = "";
          let ctaIcon = "";

          if (children.length > 2) {
            const lastChild = children[children.length - 1];
            const lastSecondChild = children[children.length - 2]; // Second-last element
            const lastThirdChild = children[children.length - 3]; // Third-last element

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
              const link = lastSecondChild?.querySelector("a");
              if (link) {
                link.innerHTML = `<span>${lastThirdText}</span>${ctaIcon}`;
                lastThirdChild.textContent = ""; // Clear moved text
              }
              // Set remaining children excluding first one
              remainingChildren = children.slice(1).map((c) => c.outerHTML).join("");
            } else {
              // If no text in lastThirdChild, just use the second child as remaining
              remainingChildren = children.slice(1, 2).map((c) => c.outerHTML).join("");
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
