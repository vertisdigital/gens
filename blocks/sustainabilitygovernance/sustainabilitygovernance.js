import { moveInstrumentation } from "../../scripts/scripts.js";

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
        const [cardTitle, cardImg, cardDesc] = cardItem.children;
        cardItem.classList.add("governance-card");

        // Create new image element with correct src
        const img = document.createElement("img");
        img.src = `../../icons/${cardTitle.textContent.trim()}.svg`;
        img.alt = cardTitle.textContent.trim();

        // Move instrumentation
        

        // Create the card structure
        const cardWrapper = document.createElement("div");
        cardWrapper.classList.add("governance-card");

        const imgWrapper = document.createElement("div");
        imgWrapper.classList.add("governance-img");
        imgWrapper.appendChild(img);
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

    // Replace block content with new structure
    block.innerHTML = "";
    block.appendChild(container);
}
