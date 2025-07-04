import { moveInstrumentation } from "../../scripts/scripts.js";
import { getIcon } from "../../shared-components/icons/index.js";
import SvgIcon from "../../shared-components/SvgIcon.js";
import stringToHTML from "../../shared-components/Utility.js";

export default function decorate(block) {
    const [title, ...cards] = [...block.children];

    // Create the main governance section container
    const container = document.createElement("div");
    container.classList.add("governance-section", "container");
    // Create and append the title wrapper
    const titleWrapper = document.createElement("div");
    titleWrapper.classList.add("governance-title");
    titleWrapper.appendChild(title);
    container.appendChild(titleWrapper);

    // Process each card
    cards.forEach((cardItem) => {
        const [cardImg, cardTitle, cardDesc] = cardItem.children;
        cardItem.classList.add("governance-card");
        if(cardItem?.querySelector('.button-container')) {
          return;
        }
        // Create the card structure
        const cardWrapper = document.createElement("div");
        cardWrapper.classList.add("governance-card");
        // Move instrumentation
        moveInstrumentation(cardItem, cardWrapper);

        const imgWrapper = document.createElement("div");
        imgWrapper.classList.add("governance-img");
        imgWrapper.innerHTML = getIcon(cardImg.textContent.trim());
        moveInstrumentation(cardImg, imgWrapper);

        const contentWrapper = document.createElement("div");
        contentWrapper.classList.add("governance-content");

        const contentTitle = document.createElement("div");
        contentTitle.classList.add("governance-content-title");
        contentTitle.appendChild(cardTitle.cloneNode(true));

        const contentDesc = document.createElement("div");
        contentDesc.classList.add("governance-content-desc");
        contentDesc.appendChild(cardDesc.cloneNode(true));

        // Append content elements
        contentWrapper.appendChild(contentTitle);
        contentWrapper.appendChild(contentDesc);

        // Append everything to card
        cardWrapper.appendChild(imgWrapper);
        cardWrapper.appendChild(contentWrapper);
        container.appendChild(cardWrapper);
    });
            // Find all LinkFields and replace with arrow icons
  const linkField = block.querySelector('[data-aue-model="linkField"],[data-gen-model="linkField"]') || (block.querySelector('.button-container') ? cards[cards.length - 1] : null);
  let linkContainer = null;
  if (linkField) {
    linkContainer = document.createElement('div');
    linkContainer.className = 'links-container container';
    moveInstrumentation(linkField, linkContainer);

    const linkDivs = Array.from(linkField.children);
    // Ensure we have the expected structure (3 elements)
    if (linkDivs.length === 3) {
      // Get elements by index with proper type checking
      const [linkTextDiv, iconDiv, targetDiv] = linkDivs;
      
      const linkData = {
        text: linkTextDiv?.textContent?.trim(),
        url: linkTextDiv?.querySelector('a')?.getAttribute('href'),
        icon: iconDiv?.textContent?.trim()?.replace('-', ''),
        target: targetDiv?.textContent?.trim(),
        title: linkTextDiv?.querySelector('a')?.getAttribute('title')
      };

      if (linkData.text || linkData.url) {
        const link = document.createElement('a');
        link.href = linkData.url || '#';
        link.target = linkData.target || '_self';
        link.classList.add('global-learn-more');
        // Handle special case for default AEM content
        if (linkData.text.startsWith('/') || linkData.text.startsWith('#')) {
          link.textContent = '';
        } else {
          link.textContent = linkData.text;
        }

        if (linkData.title) {
          link.setAttribute('title', linkData.title);
        }

        // Add icon if specified
        if (linkData.icon) {
          const arrowSVG = SvgIcon({ 
            name: linkData.icon, 
            className: 'core-principles-link', 
            size: '24px' 
          });
          link.append(stringToHTML(arrowSVG));
        }
        moveInstrumentation(linkTextDiv?.querySelector('a'), link);
        linkContainer.appendChild(link);
      }
       
      // Remove original elements after copying
      linkTextDiv.remove();
      iconDiv.remove();
      targetDiv.remove();
    }
    // Remove the original linkField container after processing
    linkField.remove();
  }

    // Replace block content with new structure
    block.innerHTML = "";
    block.appendChild(container);
    if(linkContainer) {
        block.appendChild(linkContainer);
    }
}