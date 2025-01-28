## Investment Opportunities Landing Page

As a website visitor, I want to view a well-structured landing page about investment opportunities in Singapore, so that I can easily access key information and navigate to detailed content about specific topics.

### Jira Link: [TO BE ADDED]

### Layout style

Important point to consider: Use a semantic structure with <ul> for the main container and <li> for individual blocks.
Ensure proper nesting and meaningful class names for maintainability.

Header Section (Top Left):
Title: "A Destination of Opportunity"
Description text below in gray
Orange/brown "Download Factsheet" link with a downward arrow icon

Four-Tile Grid Layout:
2x2 grid with equal-sized tiles
Each tile has a 16:9 aspect ratio
20px spacing between tiles

Top Right Tile:
Background: Office building/skyscraper view
Title: "Prime Location, Financial Strength"

Bottom Left Tile:
Background: Silhouette of person against city skyline
Title: "Dynamic Growth Pipeline"
White "Learn more" link
Same gradient overlay pattern

Bottom Right Tile:
Background: Silhouette figure in office setting
Title: "Effective Governance & ESG"
White "Learn more" link
Same gradient overlay

Design Elements:
Consistent dark gradient overlay on all tiles (transparent to dark)
White text on tiles for contrast
Text aligned at bottom of tiles

### Scenarios: 

User type: Site Visitor 
Component: Landing Page with Tiles

| Given | When | Then |
|-------|------|------|
| User accesses the landing page	| N/A	| • User sees main header and description<br> • Factsheet download link is visible<br> • All content tiles are displayed with images, titles, and descriptions<br> • Layout is clean and professional|
|User is on the landing page	|User clicks on factsheet link	||• Factsheet document downloads|
User is viewing content tiles	|User clicks on any tile or "Learn more"	|• User is directed to the corresponding detailed page|

### Mobile View:
| Given | When | Then |
|-------|------|------|
| User views page on mobile device	| N/A	| • Content is properly stacked vertically <br> • All tiles are fully visible and accessible <br>• Text remains readable <br>• Links and buttons are easily tappable
	



