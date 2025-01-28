# Authoring Requirements:
    ## Make it a custom container block like cards block that will have following fields:
    1. an optional text field heading
    2. an optional textarea field Description
    3. any number of following items:
        a. a text field heading
        b. a textarea field Description
        c. an optional custom-asset-namespace:custom-asset image
        d. an optional cta button of type aem-content with the following fields
        e. a select component with name classes with the following options:
            i. With Image
            ii. Without Image

# Rendering Requirements:
    ## Oveall Layout Instructions:
    2x2 grid with equal-sized tiles
    Each tile has a 16:9 aspect ratio
    20px spacing between tiles
    use ul li rather than divs

    ## First Row
    The first raw have 2 tiles of equal size
        1. First tile should be a text block without image
            A heading (<h2>): Clearly defines the section title.
            A description (<p>): Provides detailed information. Use the data-aue-label="Description" for the description.
            A anchor Download Factsheet will be anchor and left aligned.Color will be orange and underlined. font size should be 12px.
        2. Second tile should be with image 
            A background image with appropriate alt text for accessibility. image will be picked from .button-container > a[href]
            A heading (<h3>): Highlights the section title. Heading will be picked from data-aue-label="Title"
            A description (<p>): Explains the content of the image. Description will be picked from data-aue-label="Description"
            Achor Learn more will be placed after the description. Color will be white and underlined and right aligned.

    ## Second Row
    The second raw have 2 tiles of equal size
        1. First tile should be with image 
            A background image with appropriate alt text for accessibility. image will be picked from .button-container > a[href]
            A heading (<h3>): Highlights the section title. Heading will be picked from data-aue-label="Title"
            A description (<p>): Explains the content of the image. Description will be picked from data-aue-label="Description"
            Achor Learn more will be placed after the description. Color will be white and underlined and right aligned.
        2. Second tile should be with image
            A background image with appropriate alt text for accessibility. image will be picked from .button-container > a[href]
            A heading (<h3>): Highlights the section title. Heading will be picked from data-aue-label="Title"
            A description (<p>): Explains the content of the image. Description will be picked from data-aue-label="Description"
            Achor Learn more will be placed after the description. Color will be white and underlined and right aligned.