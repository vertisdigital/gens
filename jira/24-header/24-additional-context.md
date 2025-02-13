# Header Block - Additional Context

## Overview
The header block is a responsive navigation component that adapts between desktop and mobile views. It includes primary navigation, secondary navigation for investors section, and search functionality.

# Requirements
    - Use UL LI while creating the navigation
    - Use Grid classes from Styles.css
    - Use container-xl, container-lg, container-md, container-sm > row classes from styles.css
    - onScroll header will be sticky
    - Secondary navigation will be shown when Primary navigation is clicked
    - Secondary navigation will be closed when cross icon is clicked
    - Use data attributes such as data-aue-resource, data-aue-behavior,  data-aue-model, data-aue-label and data-block-name. All values will be dynamic.

## Design Specifications

### Desktop View (> 991px)
1. Header Layout
   - Logo aligned left
   - Primary navigation horizontal, center-aligned
   - Search icon right-aligned
   - Full width, white background

2. Primary Navigation
   - Horizontal menu items
   - Equal spacing between items
   - Active state for selected items
   - Hover effects for interactive elements

3. Secondary Navigation (Investors)
    - Use UL LI while creating the navigation
    - Use container-xl, container-lg, container-md, container-sm > row classes from styles.css
    - Main heading fill use col-xl-12, col-md-6, col-sm-12
    - Sub heading fill use col-xl-4, col-md-2, col-sm-12
   - Appears below primary nav when INVESTORS is selected
   - Horizontal layout
   - Subtle separation from primary nav

### Mobile and Tablet View (≤ 990px)
1. Header Layout
   - Centered logo
   - Hamburger menu left-aligned
   - Search icon right-aligned

2. Mobile Menu Panel
   - Full-screen overlay
   - Use UL LI while creating the navigation
   - Use container-xl, container-lg, container-md, container-sm > row classes from styles.css
   - col-md-6, col-sm-12 classes will be used for the menu items from styles.css    
   - Vertical stacked menu items
   - Chevron indicators for expandable items
   - Smooth transitions for menu interactions

## Accessibility Requirements
- ARIA labels for navigation regions
- Keyboard navigation support
- Focus management for mobile menu
- Screen reader announcements for menu state changes
- Proper heading hierarchy
- Sufficient color contrast (WCAG 2.1 AA)

## Technical Requirements
1. JavaScript Features
   - Toggle mobile menu
   - Handle submenu interactions
   - Manage focus states
   - Window resize handling
   - Search functionality

2. CSS Requirements
   - Mobile-first approach
   - Flexbox/Grid layout
   - Smooth transitions
   - Responsive breakpoints
   - Cross-browser compatibility

3. Performance Considerations
   - Optimized transitions
   - Minimal DOM operations
   - Efficient event handlers
   - Responsive image handling

## Browser Support
- Modern browsers (last 2 versions)
- IE11 graceful degradation
- Mobile browser optimization

## Testing Criteria
1. Functionality
   - Navigation works across devices
   - Submenu interactions
   - Search functionality
   - Responsive behavior

2. Accessibility
   - Keyboard navigation
   - Screen reader compatibility
   - ARIA implementation
   - Focus management

3. Performance
   - Smooth transitions
   - No layout shifts
   - Optimized load time
