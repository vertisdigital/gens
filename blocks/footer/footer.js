import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import SVGIcon from '../../shared-components/SvgIcon.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);
  // const fragment = block;
  if (fragment) {
    const section = document.createElement('section');
    // const existingMain = document.getElementsByTagName('main')[0];

    // Create and build all the footer content
    const footer = document.createElement('div');
    // footer.classList.add('footer');
    // const container = fragment.firstElementChild;

    const container = fragment.firstElementChild;

    footer.setAttribute('role', 'contentinfo');
    // footer.className = container.className;

    // Create main container with responsive classes
    const mainContainer = document.createElement('div');
    mainContainer.className = 'footer-child-element container-xl container-md container-sm';

    // Create container for all columns
    const columnsContainer = document.createElement('div');
    columnsContainer.className = 'row';

    // Create logo and description column
    const logoColumn = document.createElement('div');
    logoColumn.className = 'col-xl-12 col-md-3 col-sm-4';

    // Add logo
    const logoWrapper = document.createElement('div');
    logoWrapper.className = 'footer-logo';

    const logo = document.createElement('img');
    const socialImgContainer = container.querySelector('.imagelink')?.querySelectorAll('p');
    const logoImg = socialImgContainer[0]?.querySelector('a');
    if (logoImg) {
      logo.src = logoImg.href;
      logo.alt = logoImg.alt || 'Genting Singapore';
    }
    logoWrapper.appendChild(logo);

    // Add description
    const description = document.createElement('p');
    description.className = 'footer-description';
    description.textContent = socialImgContainer[1]?.textContent;

    // Create main wrapper
    const socialWrapper = document.createElement('div');
    socialWrapper.className = 'social-icons';

    // Create social links container
    const socialLinksContainer = document.createElement('div');
    socialLinksContainer.className = 'social-links';

    // Get the social links from the DOM - targeting the sociallinks block
    const socialLinksBlock = container.querySelector('.sociallinks.block');
    const socialLinkDivs = Array.from(socialLinksBlock.children);

    socialLinkDivs.forEach((socialLinkDiv) => {
      // Create link field container
      const linkFieldDiv = document.createElement('div');
      linkFieldDiv.setAttribute('data-linkfield-model', 'linkField');

      // Get link data
      const linkElement = socialLinkDiv.querySelector('a');
      const titleParagraphs = socialLinkDiv.querySelectorAll('p:not(.button-container)');
      const titleText = titleParagraphs[0]?.textContent.trim();
      const targetText = titleParagraphs[1]?.textContent.trim();

      if (linkElement && titleText) {
        // Create anchor wrapper
        const anchor = document.createElement('a');
        anchor.href = linkElement.href;
        anchor.title = linkElement.title || titleText;

        // Create icon container
        const iconContainer = document.createElement('span');
        iconContainer.className = 'social-icon-wrapper';

        // Create SVG icon based on the title text (assuming we have an SVGIcon function)
        const svgElement = SVGIcon({
          name: titleText, // Using the title text (twitter, linkedin, youtube) as icon name
          size: 18,
          className: 'social-icon',
        });

        // Convert SVG string to DOM element if needed
        if (typeof svgElement === 'string') {
          iconContainer.innerHTML = svgElement;
        } else if (svgElement instanceof Node) {
          iconContainer.appendChild(svgElement);
        }

        // Set target from DOM if it exists
        if (targetText) {
          anchor.target = targetText;

          // If target is _blank, add rel for security
          if (targetText === '_blank') {
            anchor.rel = 'noopener noreferrer';
          }
        }

        // Append icon container to anchor
        anchor.appendChild(iconContainer);
        linkFieldDiv.appendChild(anchor);
        socialLinksContainer.appendChild(linkFieldDiv);
      }
    });

    socialWrapper.appendChild(socialLinksContainer);

    // Apply attributes to logo column
    logoColumn.append(logoWrapper, description, socialWrapper);

    // Add logo column to columns container
    columnsContainer.appendChild(logoColumn);

    const navFragment = fragment.children[1];

    // Get all navigation sections from the container
    const navigationLinks = Array.from(navFragment.querySelectorAll('.links.block'));

    // Create columns dynamically based on navigation sections
    const navColumns = navigationLinks.map(() => {
      const col = document.createElement('div');
      col.className = 'col-xl-4 col-md-3 col-sm-4';
      return col;
    });

    // Move navigation content to columns
    navigationLinks.forEach((linkSection, index) => {
      if (navColumns[index]) {
        const nav = document.createElement('nav');

        // Get section title - first div contains the title
        const titleContainer = linkSection.children[0];
        const titleElement = titleContainer?.querySelector('p');

        if (titleElement) {
          // Create heading element for title
          const heading = document.createElement('h2');
          heading.textContent = titleElement.textContent;
          heading.className = 'footer-nav-title';

          nav.appendChild(heading);
          nav.setAttribute('aria-label', titleElement.textContent);
        }

        // Get all link items - every div with a button-container
        const linkItems = Array.from(linkSection.children).filter(div =>
          div.querySelector('.button-container')
        );

        if (linkItems.length > 0) {
          linkItems.forEach((linkItem) => {
            const linkContainer = document.createElement('div');
            linkContainer.setAttribute('data-link-model', 'links');

            // Get the button container and link
            const buttonContainer = linkItem.querySelector('.button-container');
            const anchor = buttonContainer?.querySelector('a');
            // Get target from the third <div><p> element if it exists
            const targetElement = linkItem.querySelector('div:nth-child(3) p');
            const target = targetElement ? targetElement.textContent.trim() : '_self';

            if (anchor) {
              // Create new link with title as text
              const newLink = document.createElement('a');
              newLink.href = anchor.href;
              newLink.target = target;
              newLink.className = 'button-link';
              newLink.textContent = anchor.textContent;
              // Create new button container
              const newButtonContainer = document.createElement('div');
              newButtonContainer.className = 'button-container';
              newButtonContainer.appendChild(newLink);

              linkContainer.appendChild(newButtonContainer);
            }
            if (linkContainer.children.length > 0) {
              nav.appendChild(linkContainer);
            }
          });
        }

        navColumns[index].appendChild(nav);
      }
    });

    // Add navigation columns to columns container
    // Assuming columnsContainer is defined elsewhere
    navColumns.forEach((col) => {
      columnsContainer.appendChild(col);
    });

    // Function to handle layout based on screen size
    const handleLayout = () => {
      const isDesktop = window.innerWidth >= 992;

      if (isDesktop && !mainContainer.querySelector('.right-section')) {
        // Create right and left sections for desktop
        const topContainer = document.createElement('div');
        topContainer.className = 'top-container';

        const rightSection = document.createElement('div');
        rightSection.className = 'right-section';
        const rightRow = document.createElement('div');
        rightRow.className = 'row';

        const leftSection = document.createElement('div');
        leftSection.className = 'left-section';
        const leftRow = document.createElement('div');
        leftRow.className = 'row';

        // Move logo column to right section's row
        rightRow.appendChild(logoColumn);
        rightSection.appendChild(rightRow);

        // Move nav columns to left section's row
        navColumns.forEach((col) => {
          leftRow.appendChild(col);
        });
        leftSection.appendChild(leftRow);

        // Add sections to main container
        topContainer.appendChild(rightSection);
        topContainer.appendChild(leftSection);
        mainContainer.appendChild(topContainer);
      } else if (!isDesktop) {
        columnsContainer.appendChild(logoColumn);
        navColumns.forEach((col) => {
          columnsContainer.appendChild(col);
        });
        mainContainer.insertBefore(columnsContainer, mainContainer.firstChild);
      }
    };

    // Initial layout setup
    handleLayout();

    // Update layout on resize
    window.addEventListener('resize', handleLayout);

    // Create bottom section for copyright and links
    const bottomSection = document.createElement('div');
    bottomSection.className = 'mt-4';

    // Get bottom section content
    const bottomContent = fragment.lastElementChild;

    if (bottomContent) {
      // Create columns container - renamed to avoid shadowing
      const bottomColumnsContainer = document.createElement('div');
      bottomColumnsContainer.className = 'footer-bottom-links';

      // Create column container
      const columnContainer = document.createElement('div');

      // Create row for layout
      const row = document.createElement('div');
      row.className = 'row';

      // Create text section
      const textContainer = document.createElement('div');
      textContainer.className = 'col-xl-6 col-md-3 col-sm-4';

      // Add text content - looking for the copyright text in the default-content-wrapper
      const textContent = bottomContent.querySelector('.default-content-wrapper');
      if (textContent) {
        const textDiv = document.createElement('div');
        textDiv.className = 'copywrite';
        textDiv.setAttribute('data-richtext-prop', 'text');
        textDiv.innerHTML = textContent.innerHTML;
        textContainer.appendChild(textDiv);
      }

      // Create links container
      const linksContainer = document.createElement('div');
      linksContainer.className = 'col-xl-6 col-md-3 col-sm-4 copywrite-right';
      linksContainer.setAttribute('data-link-model', 'links');

      // Process link fields - get all divs containing button-container
      const linksBlock = bottomContent.querySelector('.links.block');
      if (linksBlock) {
        const linkItems = Array.from(linksBlock.children).filter(div =>
          div.querySelector('.button-container')
        );

        linkItems.forEach((linkItem) => {
          // Create link field container
          const linkFieldContainer = document.createElement('div');
          linkFieldContainer.setAttribute('data-linkfield-model', 'linkField');
          linkFieldContainer.className = 'copywrite-links';

          // Create link text container
          const linkTextContainer = document.createElement('div');
          linkTextContainer.className = 'button-container';

          // Create link
          const originalLink = linkItem.querySelector('a');
          if (originalLink) {
            const link = document.createElement('a');
            link.href = originalLink.href;
            link.className = 'button-link';
            link.textContent = originalLink.textContent;

            // Get target from the third div if it exists
            const targetElement = linkItem.querySelector('div:nth-child(3) p');
            if (targetElement && targetElement.textContent.trim() === '_blank') {
              link.target = '_blank';
              link.rel = 'noopener noreferrer';
            }

            linkTextContainer.appendChild(link);
          }

          linkFieldContainer.appendChild(linkTextContainer);
          linksContainer.appendChild(linkFieldContainer);
        });
      }

      // Assemble the structure
      row.appendChild(textContainer);
      row.appendChild(linksContainer);
      columnContainer.appendChild(row);
      bottomColumnsContainer.appendChild(columnContainer);
      bottomSection.appendChild(bottomColumnsContainer);
    }

    // Assemble the footer
    mainContainer.append(bottomSection);
    footer.appendChild(mainContainer);

    // Add keyboard navigation
    const allLinks = footer.querySelectorAll('a');
    allLinks.forEach((link) => {
      link.addEventListener('focus', () => {
        link.classList.add('focused');
      });
      link.addEventListener('blur', () => {
        link.classList.remove('focused');
      });

      link.setAttribute('data-link-model', 'links');
    });
    section.appendChild(footer);
    block.innerHTML = '';
    block.append(section);
  }
}

/*
| Condition  | Action                                                    |
|------------|-----------------------------------------------------------|
| **For Prod** | Uncomment **line-13** and comment **line-14**            |
|            | Use `"sourceSection"` instead of `"fragment"`             |
|            | Comment out `footer.classList.add('footer');` in **line-55** |
|            | Replace `"fragment"` with `"fragment.firstElementChild"`  |
|            | in **line-67** and **line-394**                            |
| **For Local** | Uncomment **line-14** and comment **line-13**           |
|            | Use `"fragment"` instead of `"sourceSection"`             |
|            | Add `footer.classList.add('footer');` in **line-55**       |
|            | Replace `"fragment.firstElementChild"` with `"fragment"`  |
|            | in **line-67** and **line-394**                            |
*/
