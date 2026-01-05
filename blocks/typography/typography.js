export default function decorate(block) {
  // Check if block has custom text content from model
  // Data comes from block children in order: text, typographyStyle, fontWeight
  const blockChildren = Array.from(block.children);

  // Check if we have custom content (at least text and style)
  if (blockChildren.length >= 2) {
    const textElement = blockChildren[0];
    const styleElement = blockChildren[1];
    const weightElement = blockChildren[2] || null;

    const text = textElement?.textContent?.trim() || '';
    const typographyStyle = styleElement?.textContent?.trim() || '';
    const fontWeight = weightElement?.textContent?.trim() || 'regular';

    // If we have text and style, apply typography
    if (text && typographyStyle) {
      // Clear block content
      block.textContent = '';

      // Create styled text element
      const styledText = document.createElement('div');
      const styleClass = `${typographyStyle}-${fontWeight}`;
      styledText.className = styleClass;
      
      // Preserve rich text formatting if it exists
      if (textElement.innerHTML) {
        styledText.innerHTML = textElement.innerHTML;
      } else {
        styledText.textContent = text;
      }

      block.appendChild(styledText);
      return;
    }
  }
}
