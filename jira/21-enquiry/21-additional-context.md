# Authoring Requirements:
create a new block with the following specifications
        1. a text field heading (mandatory, max 100 characters)
        2. a richtext field description (optional, max 250 characters, for richtext max character validation always use maxSize property)
        3. an image field for phone icon
        4. a text field for phone number (Phone number must be numeric, only special characters + is allowed, max limit of 30 characters and min of 10 characters)
        5. an image field for email icon
        6. a text field for email address (Email address must be valid email address, max limit of 30 characters and min of 10 characters)
        7. an image field for address icon
        8. a text field for address


# Rendering Requirements:
1. Layout:
   - Use classes for container-xl, container-md, container-sm and row classes from styles.css
   - Two-column layout (40/60 split) on desktop. Use classes for col-xl-6 from styles.css
   - Two-column layout (40/60 split) on Tablet. Use classes for col-md-3 from styles.css
   - Left column: heading
   - Right column: description and contact details
   - Stack vertically on mobile devices (< 768px) Use classes for container-sm-4 from styles.css
   - Use common modules for Image, Heading, SVGIcon and ButtonCTA from shared-components

2. Typography & Styling:
   - Heading: Bold/medium weight
   - Description: Regular weight, secondary color
   - Contact information: Regular weight
   - Maintain consistent spacing between elements

3. Contact Information Display:
   - Each contact item (phone, email, address) should:
     - Display icon on the left
     - Align text content with icon
     - Maintain consistent vertical spacing
   - Phone number should be clickable (tel: link)
   - Email should be clickable (mailto: link)

4. Responsive Behavior:
   - Desktop (≥1024px): Two-column layout
   - Tablet (≥768px): Maintain two columns with adjusted spacing
   - Mobile (<768px): Single column, stacked layout
   - Preserve touch target sizes (minimum 44px) for mobile devices

5. Accessibility Requirements:
   - Semantic HTML structure
   - Proper heading hierarchy
   - ARIA labels for interactive elements
   - Keyboard navigation support
   - Minimum color contrast ratio of 4.5:1
   - Screen reader friendly markup

6. Interactive Elements:
   - Hover states for clickable items
   - Clear visual feedback for interactive elements
   - Smooth transitions for hover effects

7. Performance Considerations:
   - Optimize icon images
   - Implement lazy loading for images
   - Minimize DOM operations
   - Use efficient CSS selectors

