export default function decorate(block) {
  const [loadmoreEle, itemCount] = block.children;
  let maxItems = Number.parseInt(itemCount.textContent.trim() || '8', 10);
  const loadmoreText = loadmoreEle.textContent.trim() ?? 'Load More';
  if (Number.isNaN(maxItems)) {
    maxItems = 8;
  }
  let activeItems = maxItems;

  const items = document.querySelectorAll('.historymilestones-wrapper');
  items.forEach((item, index) => {
    if (index >= activeItems) {
      item.style.display = 'none';
    }
  });

  // createa a button element
  const loadmoreButton = document.createElement('button');
  loadmoreButton.className = 'loadmore-button';
  loadmoreButton.textContent = `${loadmoreText} (${items.length - activeItems})`;
  loadmoreEle.innerHTML = '';
  loadmoreEle.appendChild(loadmoreButton);

  loadmoreButton.addEventListener('click', () => {
    const newCount = activeItems + maxItems;
    if (items.length <= newCount) {
      activeItems = items.length;
      loadmoreButton.style.display = 'none';
    } else {
      activeItems = newCount;
      loadmoreButton.textContent = `${loadmoreText} (${items.length - activeItems})`;
    }
    items.forEach((item, index) => {
      if (index < activeItems) {
        item.style.display = 'block';
      }
    });
  });

  block.innerHTML = '';
  block.appendChild(loadmoreButton);
}
