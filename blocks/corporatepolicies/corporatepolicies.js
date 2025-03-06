import SvgIcon from '../../shared-components/SvgIcon.js';

export default function decorate(block) {
  // Store all child elements before modifying the block
  const allChildElements = Array.from(block.children);

  // Clear block and append the structured wrapper
  block.innerHTML = '';

  const downloadIcon = SvgIcon({
    name: 'downloadarrow',
    className: 'download',
    size: '16',
    color: 'currentColor',
  });

  block.innerHTML = `
  <div class="container-xl container-lg container-md container-sm container-xs corporate-policies-list">
      ${allChildElements
    .map((child) => {
      child.classList.add('row', 'corporate-policies-list-item');
      const children = Array.from(child.children);

      // If there are more than 1 children, move the second last child's content to the last child
      if (children.length > 1) {
        const lastSecond = children[children.length - 2].textContent.trim();
        children[children.length - 1].querySelector('a').innerHTML = '';
        children[children.length - 1].querySelector('a').innerHTML = `<span>${lastSecond}</span>${downloadIcon}`;
        // Clear second last child's content
        children[children.length - 2].innerHTML = '';
      }

      const firstChild = children.length > 0 ? children[0].outerHTML : '';
      const remainingChildren = children.slice(1).map((c) => c.outerHTML).join('');

      return `
            ${child.outerHTML.replace(
    child.innerHTML,
    `
              <div class="col-xl-6 col-lg-6 col-md-3 col-sm-4 col-xs-4 left-col">
                ${firstChild}
              </div>
              <div class="col-xl-6 col-lg-6 col-md-3 col-sm-4 col-xs-4 right-col">
                ${remainingChildren}
              </div>
              `,
  )}
          `;
    })
    .join('')}
  </div>
`;
}