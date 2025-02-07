/**
 * Process all the tab auto blocks 
 * @param {Element} main The container element
 */
export default function processTabs(main){
    const sections = [...main.querySelectorAll('[data-aue-model="tabs"]:not(.section-metadata)')];
    if (sections.length === 0) return;

    const tabsWrapper = document.createElement("div");
    tabsWrapper.classList.add("tabs-container");

    const tabsNav = document.createElement("div");
    tabsNav.classList.add("tabs-nav");

    const tabsContent = document.createElement("div");
    tabsContent.classList.add("tabs-content");

    sections.forEach((section, index) => {
      const metadata = section.querySelector(".section-metadata > div :last-child");
      const tabTitle = metadata ? metadata.textContent.trim(): `CustTitle ${index + 1}`;
      
      const tabButton = document.createElement("button");
      tabButton.classList.add("tab-button");
      tabButton.textContent = tabTitle;
      tabButton.dataset.index = index;

      const tabPanel = document.createElement("div");
      tabPanel.classList.add("tab-panel");
      if (index === 0) tabPanel.classList.add("active");

      // Clone the section content instead of moving it
      const clonedContent = section.cloneNode(true);
      clonedContent.querySelector(".section-metadata")?.remove(); // Remove metadata from content

      while (clonedContent.firstChild) {
        tabPanel.appendChild(clonedContent.firstChild);
      }

      tabsNav.appendChild(tabButton);
      tabsContent.appendChild(tabPanel);
    });

    // Remove the original section after moving content
    sections.forEach((section) => section.parentNode.removeChild(section));
    
    tabsWrapper.appendChild(tabsNav);
    tabsWrapper.appendChild(tabsContent);
    main.appendChild(tabsWrapper);

    // Handle tab switching
    tabsNav.addEventListener("click", (event) => {
      if (event.target.classList.contains("tab-button")) {
        const index = event.target.dataset.index;
        document.querySelectorAll(".tab-button").forEach(btn => btn.classList.remove("active"));
        document.querySelectorAll(".tab-panel").forEach(panel => panel.classList.remove("active"));

        event.target.classList.add("active");
        tabsContent.children[index].classList.add("active");
      }
    });

    // Activate the first tab by default
    tabsNav.children[0]?.classList.add("active");
}