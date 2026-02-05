export default function decorate(block) {
  block.classList.add('textblock');

  const children = Array.from(block.children);

  const isFullWidth = block.querySelector('[data-aue-prop="style"]')
    || block.querySelector('[data-gen-prop="style"]')
    || children[3]?.querySelector('p')
    || children[3];;

  if (isFullWidth && isFullWidth.textContent?.trim() === 'full-width-with-padding') {
    block.classList.add('container', 'full-width-with-padding');
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
