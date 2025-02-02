# Authoring Requirements:
Have the reference of the cards block and card block and create a new block with the following specifications
    A container block projectcards with the following fields
        1.A text field title (optional, max 100 characters)
        2.A text field heading (mandatory, max 100 characters)
        3.A richtext field description (optional, max 250 characters)
    A block item projectcard with following fields
        1. An Image field image
        2. A text field title (mandatory, max 10 characters)
        3. A text field location (mandatory, max 10 characters)
    The container block should be able to have only one Link Field block item.
    do not use spacing in any names


## Rendering Requirements
- Cards displayed in a responsive grid layout (4 columns on desktop, 2 on tabled and mobile)
- Use classes for container-xl, container-lg, container-md, container-sm and row classes from styles.css
- Use card classes col-xl-3, col-lg-3, col-md-3, col-sm-2 from styles.css
- Maintain consistent spacing between cards
- "View all" link positioned in top right corner

## Card Design
- Each card should display:
  - Full-width image at top
  - Project title below image
  - Location text below title
- Images should maintain aspect ratio
- Cards should have subtle hover animation (scale up slightly)
- Cards should have proper focus states for accessibility

## Typography & Spacing
- Small "Projects" title above main heading
- Large "Our Plans for a Better World" heading
- Descriptive text below heading
- Consistent text alignment and spacing
- Project titles should be prominent but smaller than main heading
- Location text should be subtle/secondary styling

## Responsive Behavior
- Grid layout on desktop (4 columns)
- Horizontal scroll on mobile with visible scroll arrows
- Maintain readability of text at all breakpoints
- Proper spacing adjustments for mobile view

## Accessibility
- Proper heading hierarchy
- Keyboard navigation support for cards
- Sufficient color contrast
- Proper alt text for images
- ARIA labels for navigation controls
