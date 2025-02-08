
export default function decorate(block) {
  // Get the inner block that has the coreprinciples class
  const coreBlock = block
  if (!coreBlock) return;

  // Add container classes for responsive layout
  const wrapper = document.createElement('div');
  wrapper.classList.add('coreprinciples');
  const container = document.createElement('div');
  wrapper.appendChild(container);
  container.className = 'container-xl container-lg container-md container-sm';

  const row = document.createElement('div');
  row.className = 'row';

  // Convert each item to use proper semantic structure
  const items = [...coreBlock.querySelectorAll('[data-aue-model="coreprinciple"]')];

  items.forEach((item) => {
    // Add responsive column classes as per requirements
    const col = document.createElement('div');
    col.className = 'col-lg-4 col-md-3 col-sm-4 principles-item';

    // Get the icon URL
    const iconLink = item.querySelector('a');
    const iconUrl = iconLink?.href || '';

    // Create icon wrapper with authoring attributes
    const iconWrapper = document.createElement('div');
    iconWrapper.className = 'icon-wrapper';
    iconWrapper.setAttribute('aria-hidden', 'true');

    // Preserve icon wrapper data-aue attributes from original structure
    const originalIconWrapper = iconLink?.parentElement;
    if (originalIconWrapper) {
      const iconAttributes = [...originalIconWrapper.attributes].filter((attr) => attr.name.startsWith('data-aue-'));
      iconAttributes.forEach((attr) => {
        iconWrapper.setAttribute(attr.name, attr.value);
      });
    }

    // Create and add image using ImageComponent
    if (iconUrl) {
      const img = document.createElement('img');
      img.src = iconUrl;
      img.alt = '';
      img.loading = 'lazy';
      img.width = 64;
      img.height = 64;

      const picture = document.createElement('picture');
      picture.appendChild(img);
      iconWrapper.appendChild(picture);
    }

    // Convert title to h3 with preserved authoring attributes
    const title = item.querySelector('[data-aue-prop="title"]');
    if(title !== null) {
      const h3 = document.createElement('h3');
      h3.textContent = title.textContent;
  
      // Preserve title data-aue attributes
      const titleAttributes = [...title.attributes].filter((attr) => attr.name.startsWith('data-aue-'));
      titleAttributes.forEach((attr) => {
        h3.setAttribute(attr.name, attr.value);
      });
      title.replaceWith(h3);  
    }
    
    // Preserve description data-aue attributes
    const description = item.querySelector('[data-richtext-prop="description"]');
    if (description) {
      const descAttributes = [...description.attributes].filter((attr) => attr.name.startsWith('data-aue-') || attr.name.startsWith('data-richtext-'));
      descAttributes.forEach((attr) => {
        description.setAttribute(attr.name, attr.value);
      });
    }

    // Clean up original icon link
    iconLink?.parentElement.remove();

    // Insert icon wrapper at start
    item.insertBefore(iconWrapper, item.firstChild);

    // Wrap item in column and add to row
    col.appendChild(item.cloneNode(true));
    row.appendChild(col);
  });

  // Build the final structure
  container.appendChild(row);

  // Clear original content and append the new structure
  coreBlock.innerHTML = '';
  coreBlock.appendChild(wrapper);
}