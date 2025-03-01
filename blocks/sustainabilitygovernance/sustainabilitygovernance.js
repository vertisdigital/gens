export default function decorate(block) {
    // Remove any data-aue attributes
    const elements = block.querySelectorAll('[data-aue]');
    elements.forEach(element => {
        const attrs = element.attributes;
        for (let i = attrs.length - 1; i >= 0; i -= 1) {
            const attr = attrs[i];
            if (attr.name.startsWith('data-aue')) {
                element.removeAttribute(attr.name);
            }
        }
    });

    // Handle icons
    const iconDivs = block.querySelectorAll('div:nth-child(n+2) > div:first-child');
    iconDivs.forEach(iconDiv => {
        const iconType = iconDiv.textContent.trim();
        iconDiv.style.backgroundImage = `url('https://sustainability-governance-structure--genting--wppopen.aem.page/icons/${iconType}.svg')`;
        // Hide the text content since we're using it as a background image
        iconDiv.style.color = 'transparent';
        iconDiv.style.fontSize = '0';
    });
} 