/**
 * Process all the tab auto blocks
 * @param {Element} main The container element
 */
export default function processTabs(main, moveInstrumentation) {
  const sections = [
    ...main.querySelectorAll('[data-aue-model="tabs"]:not(.section-metadata)'),
  ];
  if (sections.length === 0) return;

  const topContainer = document.createElement('div');
  topContainer.classList = 'container-xl container-lg container-md container-sm';

  const tabsWrapper = document.createElement('div');
  tabsWrapper.classList.add('tabs-container');

  const tabsNav = document.createElement('div');
  tabsNav.classList.add('tabs-header','row');

  const tabsContent = document.createElement('div');
  tabsContent.classList.add('tabs-content');

  sections.forEach((section, index) => {
    const metadata = section.querySelector(
      '.section-metadata > div :last-child',
    );
    const tabTitle = metadata
      ? metadata.textContent.trim()
      : `CustTitle ${index + 1}`;

    const tabButton = document.createElement('div');
    tabButton.classList.add('tab-title','col-xl-6','col-lg-6','col-md-3','col-sm-2');
    tabButton.dataset.index = index;
    tabButton.textContent = tabTitle;

    const tabPanel = document.createElement('div');
    tabPanel.classList.add('tab-panel');
    if (index === 0) tabPanel.classList.add('active');

    moveInstrumentation(section, tabPanel);
    // Clone the section content instead of moving it
    const clonedContent = section.cloneNode(true);
    clonedContent.querySelector('.section-metadata')?.remove(); // Remove metadata from content

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
  topContainer.appendChild(tabsWrapper);
  main.appendChild(topContainer);

  // Handle tab switching
  tabsNav.addEventListener('click', (event) => {
    const tabButton = event.target.closest('.tab-title'); // Ensure we target the correct element
    if (!tabButton) return;

    const index = parseInt(
      tabButton.dataset.index ?? tabButton.parentNode.dataset.index,
      10,
    ); // Convert to integer
    if (Number.isNaN(index)) return; // Prevent errors if index is undefined 

    tabsWrapper
      .querySelectorAll('.tab-title')
      .forEach((btn) => btn.classList.remove('active'));
    tabsWrapper
      .querySelectorAll('.tab-panel')
      .forEach((panel) => panel.classList.remove('active'));

    tabButton.classList.add('active');
    tabsContent.children[index]?.classList.add('active'); // Ensure safe access
  });

  // Activate the first tab by default
  tabsNav.children[0]?.classList.add('active');
}