export default function decorate(block) {
  block.classList.add('textblock');

  const children = Array.from(block.children);

  // Convert <br> inside <p> into separate <p> tags to preserve line breaks and spacing
  // Also handle authors using '_' to force a blank line
  const textElements = block.querySelectorAll('p, h1, h2, h3, h4, h5, h6');
  textElements.forEach((el) => {
    // Check if the element starts with an underscore, even if it has rich text children
    let child = el.firstChild;
    while (child && child.nodeType === Node.ELEMENT_NODE && !child.textContent.trim()) {
      child = child.firstChild;
    }

    // Sometimes the _ is inside a <strong> tag inside the heading/paragraph
    let textNodeToClean = null;

    const findTextNodeStartingWithUnderscore = (node) => {
      if (!node) return null;
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().startsWith('_')) {
        return node;
      }
      for (let i = 0; i < node.childNodes.length; i += 1) {
        const found = findTextNodeStartingWithUnderscore(node.childNodes[i]);
        if (found) return found;
      }
      return null;
    };

    textNodeToClean = findTextNodeStartingWithUnderscore(el);

    if (textNodeToClean) {
      // Remove the leading underscore
      textNodeToClean.textContent = textNodeToClean.textContent.replace(/^\s*_\s*/, '');

      // Insert an empty paragraph with a <br> before this element
      const placeholder = document.createElement('p');
      placeholder.innerHTML = '<br>';
      el.parentNode.insertBefore(placeholder, el);

      // Clean ID if it exists and starts with _ (e.g., _-privacy or _privacy)
      if (el.id && el.id.startsWith('_')) {
        el.id = el.id.replace(/^_-?/, '');
      }

      // If the element is now completely empty after removing _, remove it
      if (!el.textContent.trim() && !el.querySelector('img, video, iframe, a')) {
        el.remove();
      }
    }

    if (el.tagName === 'P' && el.querySelector('br')) {
      const parent = el.parentNode;
      const parts = el.innerHTML.split(/<br\s*\/?>/gi);
      parts.forEach((part, index) => {
        const newP = document.createElement('p');
        if (index < parts.length - 1) newP.classList.add('br-line');
        newP.innerHTML = part;
        const text = newP.textContent.trim();
        if ((!text && !newP.querySelector('img, video, iframe, a')) || text === '_') {
          newP.innerHTML = '<br>';
        }
        parent.insertBefore(newP, el);
      });
      el.remove();
    }
  });

  if (block.textContent.trim() === '' && !block.querySelector('img, video, iframe, a')) {
    block.innerHTML = '';
    return;
  }

  const isFullWidth = block.querySelector('[data-aue-prop="style"]')
    || block.querySelector('[data-gen-prop="style"]')
    || children[3]?.querySelector('p')
    || children[3];

  if (isFullWidth) {
    const textContent = isFullWidth.textContent?.trim() || '';
    const styles = textContent.split(/[\s,]+/).filter(Boolean);

    if (styles.includes('full-width-with-padding')) {
      block.classList.add('container', 'full-width-with-padding');
    }

    if (styles.includes('instrument-sans-variable-font')) {
      block.classList.add('instrument-sans-variable-font');
    }

    if (styles.includes('single-spacing')) {
      block.classList.add('single-spacing');
    }

    if (textContent) {
      isFullWidth.remove();
    }
  }

  // =========================
  // ALIGN
  // =========================
  const alignEl =
    block.querySelector('[data-aue-prop="align"]')
    || block.querySelector('[data-gen-prop="align"]')
    || children[1]?.querySelector('p')
    || children[1];

  if (alignEl) {
    const alignValue = alignEl.textContent?.trim();
    if (alignValue) {
      block.classList.add(`${alignValue}`);
    }
    alignEl.remove();
  }

  // =========================
  // COLOR
  // =========================
  const colorEl =
    block.querySelector('[data-aue-prop="color"]')
    || block.querySelector('[data-gen-prop="color"]')
    || children[2]?.querySelector('p')
    || children[2];

  if (colorEl) {
    const colorValue = colorEl.textContent?.trim();
    if (colorValue) {
      block.classList.add(colorValue);
    }
    colorEl.remove();
  }
}
