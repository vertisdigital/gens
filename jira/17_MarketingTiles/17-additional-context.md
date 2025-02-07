# Authoring Requirements:
Create this block with following:
    A container block with no fields
    A block item with following fields
        1. A background Image
        2. A text heading
        3. A richtext description
        4. A CTA button 
        5. A CTA button caption

# Rendering Requirements:
1. Header Tile (Top Left)
- Title: "A Destination of Opportunity"
- Body text about investments and economic development in Singapore
- "Download Factsheet" link with a download icon
- White background

2. Financial Tile (Top Right)
- Title: "Prime Location, Financial Strength"
- Background image showing modern office buildings/architecture
- Text about leveraging location and regulatory strength
- "Learn more" anchor tag. Placement will be on right hand side of the tile. Pick the link from button-container > anchor tag
- Dark overlay on the background image for text readability

3. Growth Tile (Bottom Left)
- Title: "Dynamic Growth Pipeline"
- Background image showing a silhouette of a person against a cityscape view
- Text about commitment to stakeholders and growth
- "Learn more" anchor tag. Placement will be on right hand side of the tile. Pick the link from button-container > anchor tag
- Dark overlay on background image

4. Governance Tile (Bottom Right)
- Title: "Effective Governance & ESG"
- Background image showing a silhouette of a person in an office setting
- Text about industry standards and compliance
- "Learn more" anchor tag. Placement will be on right hand side of the tile. Pick the link from button-container > anchor tag
- Dark overlay on background image

Key Design Elements:
- Consistent typography and text styling across tiles
- Dark overlays on image tiles for text contrast
- Equal spacing between tiles
- Responsive grid layout
- Mix of white background and image background tiles

Consistent CTAs ("Learn more" links)
- Pick the font, color, layout and other styling as per the image provided

- Use data attributes for the elements and items which will come from snippet such as data-aue-label="Title" etc.

Use grid classes such as 
Desktop: 
Container-xl > row > col-xl-6

Tablet:
Container-md > row > col-md-3

Mobile:
Container-sm > row > col-sm-4