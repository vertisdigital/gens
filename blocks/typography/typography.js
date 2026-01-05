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

  // Default: Show typography showcase
  // Create main container
  const typographyContainer = document.createElement('div');
  typographyContainer.className = 'typography-container';

  // Typography styles data
  const typographyStyles = [
    {
      label: 'Header 1',
      fontFamily: 'Inter',
      fontSize: '72px',
      lineHeight: '88px',
      letterSpacing: '0',
      className: 'header-1',
    },
    {
      label: 'Header 2',
      fontFamily: 'Inter',
      fontSize: '56px',
      lineHeight: '72px',
      letterSpacing: '0',
      className: 'header-2',
    },
    {
      label: 'Header 3',
      fontFamily: 'Inter',
      fontSize: '36px',
      lineHeight: '56px',
      letterSpacing: '0',
      className: 'header-3',
    },
    {
      label: 'Header 4',
      fontFamily: 'Inter',
      fontSize: '32px',
      lineHeight: '48px',
      letterSpacing: '0',
      className: 'header-4',
    },
    {
      label: 'Header 5',
      fontFamily: 'Inter',
      fontSize: '28px',
      lineHeight: '44px',
      letterSpacing: '0',
      className: 'header-5',
    },
    {
      label: 'Header 6',
      fontFamily: 'Inter',
      fontSize: '24px',
      lineHeight: '40px',
      letterSpacing: '0',
      className: 'header-6',
    },
    {
      label: 'Body 1',
      fontFamily: 'Instrument Sans',
      fontSize: '16px',
      lineHeight: '24px',
      letterSpacing: '0',
      className: 'body-1',
    },
    {
      label: 'Body 2',
      fontFamily: 'Instrument Sans',
      fontSize: '14px',
      lineHeight: '24px',
      letterSpacing: '0',
      className: 'body-2',
    },
    {
      label: 'Label',
      fontFamily: 'Instrument Sans',
      fontSize: '12px',
      lineHeight: '16px',
      letterSpacing: '0',
      className: 'label',
    },
  ];

  // Create sections for each typography style
  typographyStyles.forEach((style, index) => {
    const section = document.createElement('div');
    section.className = 'typography-section';

    // Label (top left)
    const label = document.createElement('div');
    label.className = 'typography-label';
    label.textContent = style.label;

    // Specs (top right)
    const specs = document.createElement('div');
    specs.className = 'typography-specs';
    specs.textContent = `${style.fontFamily} | Font size: ${style.fontSize} | Line height: ${style.lineHeight} | Letter spacing: ${style.letterSpacing}`;

    // Examples container
    const examplesContainer = document.createElement('div');
    examplesContainer.className = 'typography-examples';

    // Medium example
    const mediumExample = document.createElement('div');
    mediumExample.className = `typography-example ${style.className}-medium`;
    mediumExample.textContent = `${style.label} Medium`;

    // Regular example
    const regularExample = document.createElement('div');
    regularExample.className = `typography-example ${style.className}-regular`;
    regularExample.textContent = `${style.label} Regular`;

    examplesContainer.appendChild(mediumExample);
    examplesContainer.appendChild(regularExample);

    section.appendChild(label);
    section.appendChild(specs);
    section.appendChild(examplesContainer);

    typographyContainer.appendChild(section);

    // Add separator line (except for last item)
    if (index < typographyStyles.length - 1) {
      const separator = document.createElement('div');
      separator.className = 'typography-separator';
      typographyContainer.appendChild(separator);
    }
  });

  // Clear original block content and append new structure
  block.textContent = '';
  block.appendChild(typographyContainer);
}
