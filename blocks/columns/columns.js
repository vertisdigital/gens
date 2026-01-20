import SvgIcon from '../../shared-components/SvgIcon.js';

function normalizeTextblockTokens(col) {
  const container = col;
  if (!container) return;

  const paragraphs = Array.from(
    container.querySelectorAll(':scope > p')
  );

  paragraphs.forEach((p) => {
    const token = p.textContent.trim();

    if (!token.startsWith('textblock-')) return;

    container.classList.add('textblock', token);
    p.remove();
  });
}

function renderBrandedIcon(block) {
  if (block.querySelector(':scope > .columns-branded-icon')) return;

  const iconWrapper = document.createElement('div');
  iconWrapper.className = 'columns-branded-icon';
  iconWrapper.innerHTML = SvgIcon({ name: 'brandRings' });

  block.prepend(iconWrapper);
}

export default function decorate(block) {
  block.classList.add('columns-block');
  block.classList.add('container');
  const rows = Array.from(block.children)
    .filter((el) => !el.classList.contains('columns-branded-icon'));

  block.classList.add(`columns-${rows.length}-cols`);
  block.classList.add(`columns-cols`);

  rows.forEach((row) => {
    row.classList.add('columns-row');

    Array.from(row.children).forEach((col) => {
      col.classList.add('columns-col');

      const pic = col.querySelector(':scope > picture');
      if (
        pic &&
        col.children.length === 1 &&
        !col.querySelector('.block')
      ) {
        col.classList.add('columns-img-col');
      }

      normalizeTextblockTokens(col);
    });
  });

  if (block.classList.contains('has-icon')) {
    renderBrandedIcon(block);
  }
}
