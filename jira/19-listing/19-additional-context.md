# Authoring Requirements:
Create this block with following:
    A container block with the following fields
        1.A text field title (mandatory, max 100 characters)
        2.A text field heading (optional, max 250 characters)
    A block item with following fields
        1. A background image
        2. an alt text for the image
        3. A text field title (mandatory, max 30 characters)
        4. A richtext field description (optional, max 250 characters)
        5. A CTA button CTA
    The container block should be able to have only one Link Field block item.

# Rendering Requirements:
1. Layout Structure:
    - Use UL/LI syntax for the list
    - Title and heading at the top
    - Each list item should be full width
    - Border separator between items
    - "Explore more" link at the bottom

2. List Item Layout:
    - follow this hierarchy container-xl, container-md, container-sm > row > col-*
    - Image on left (30% width). Use Classes for Desktop col-xl-4, Table col-md-2, Mobile col-sm-4
    - Content on right (70% width). Use Classes for Desktop col-xl-8, Table col-md-6, Mobile col-sm-4. data-aue-type="text" data-aue-prop="description" and data-aue-prop="arrowIcon" items will follow these classes. Wrap in single div and remove extra elements
    - Arrow icon aligned to the right
    - Proper spacing between elements

3. Typography:
    - Title: Gray color, smaller font
    - Heading: Large, bold font
    - Item title: Medium size, black color
    - Date: Small, gray color
    - "Explore more": Gold/brown color (#B4975A)

4. Spacing & Alignment:
    - Consistent padding between items
    - Vertical alignment of content with image
    - Proper margins around all elements
    - Equal spacing between items

5. Interactive Elements:
    - Entire item should be clickable
    - Subtle hover effect on items
    - Arrow icon indicating clickable state
    - Focus states for accessibility

6. Image Handling:
    - Maintain aspect ratio
    - Object-fit: cover
    - Rounded corners
    - No image stretching

7. Data Attributes:
    - Use data-aue-prop="title" for titles
    - Use data-aue-prop="heading" for main heading
    - Use data-aue-prop="date" for dates
    - Use data-aue-model="listitem" for list items
    - Use data-aue-label attributes matching the field names

8. Responsive Behavior:
    - Stack image and content on mobile
    - Maintain readability at all breakpoints
    - Adjust spacing for smaller screens