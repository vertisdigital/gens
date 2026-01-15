export default function decorate(block) {
  /* --------------------------------
   * EXISTING LOGIC – KEEP AS IS
   * -------------------------------- */
  const firstRow = block.firstElementChild;
  if (!firstRow) return;

  const cols = [...firstRow.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // Detect image-only columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          picWrapper.classList.add('columns-img-col');
        }
      }
    });
  });

  /* --------------------------------
   * NEW: VARIANT (single / multi)
   * -------------------------------- */
  const variantEl =
    block.querySelector('[data-aue-prop="variant"]') ||
    block.querySelector('[data-gen-prop="variant"]');

  const variant = variantEl?.textContent?.trim();

  if (variant === 'single') {
    block.classList.add('columns--single');
  }

  if (variant === 'multi') {
    block.classList.add('columns--multi');
  }

  /* --------------------------------
   * NEW: BACKGROUND COLOR
   * -------------------------------- */
  const bgEl =
    block.querySelector('[data-aue-prop="background"]') ||
    block.querySelector('[data-gen-prop="background"]');

  const bgClass = bgEl?.textContent?.trim();
  if (bgClass) {
    block.classList.add(bgClass);
  }

  /* --------------------------------
   * NEW: TEXT COLOR
   * -------------------------------- */
  const textColorEl =
    block.querySelector('[data-aue-prop="textColor"]') ||
    block.querySelector('[data-gen-prop="textColor"]');

  const textColorClass = textColorEl?.textContent?.trim();
  if (textColorClass) {
    block.classList.add(textColorClass);
  }

  /* --------------------------------
   * CLEAN UP AUTHOR-ONLY FIELDS
   * -------------------------------- */
  [
    variantEl,
    bgEl,
    textColorEl,
  ].forEach((el) => el?.remove());
}
