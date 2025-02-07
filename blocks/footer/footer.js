import { getMetadata } from '../../scripts/aem.js';
import { loadFragmentCustom } from '../fragment/fragment.js';
import SVGIcon from '../../shared-components/SvgIcon.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragmentCustom(footerPath);
  // const fragment = block;
  if (fragment) {
    // Create main element with data attributes
    const main = document.createElement('main');
    main.setAttribute('data-aue-resource', 'urn:aemconnection:/content/genting-singapore/footer/jcr:content/root');
    main.setAttribute('data-aue-label', 'Main');
    main.setAttribute('data-aue-filter', 'main');
    main.setAttribute('data-aue-type', 'container');

    // Create section element with data attributes
    const section = document.createElement('section');
    // Get the source section element from fragment
    const sourceSection = fragment.querySelector('[data-aue-model="section"]');

    // Copy all data attributes from source section
    if (sourceSection) {
      const dataAttributes = {
        'data-aue-type': 'container',
        'data-aue-resource': sourceSection.getAttribute('data-aue-resource'),
        'data-aue-behavior': 'component',
        'data-aue-model': 'section',
        'data-aue-label': 'Section',
        'data-aue-filter': 'section',
      };

      Object.entries(dataAttributes).forEach(([key, value]) => {
        if (value) {
          section.setAttribute(key, value);
        }
      });
    }

    // Append section and footer to main
    main.appendChild(section);

    // Get existing main element
    // const existingMain = document.getElementsByTagName('main')[0];

    // Create and build all the footer content
    const footer = document.createElement('div');
    // footer.classList.add('footer');
    // const container = fragment.firstElementChild;
    const findColumnWrapper = (blockElement, index) => {
      // Check first and last children for columns-wrapper
      if (blockElement.children[index].classList.contains('columns')) {
        return blockElement.children[index];
      } if (blockElement.children[index].classList.contains('columns')) {
        return blockElement.children[index];
      }
      return null;
    };

    const container = findColumnWrapper(fragment.firstElementChild, 0);

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
    logoWrapper.setAttribute('data-aue-type', 'container');
    logoWrapper.setAttribute('data-aue-behavior', 'component');
    logoWrapper.setAttribute('data-aue-model', 'imageLink');
    logoWrapper.setAttribute('data-aue-label', 'Image Link');
    logoWrapper.setAttribute('data-aue-filter', 'imageLink');
    logoWrapper.setAttribute('data-aue-resource', container.querySelector('.image-link').getAttribute('data-aue-resource'));

    const logo = document.createElement('img');
    const logoImg = container.querySelector('.image-link img');
    if (logoImg) {
      logo.src = logoImg.src;
      logo.setAttribute('data-aue-resource', container.querySelector('.image-link').getAttribute('data-aue-resource'));
      logo.setAttribute('data-aue-label', 'Link Image');
      logo.setAttribute('data-aue-type', 'media');
      logo.setAttribute('data-aue-prop', 'linkImage');
      logo.alt = logoImg.alt || 'Genting Singapore';
    }
    logoWrapper.appendChild(logo);

    // Add description
    const description = document.createElement('p');
    description.className = 'footer-description';
    description.textContent = container.querySelector('[data-richtext-prop="description"]')?.textContent;
    description.setAttribute('data-aue-prop', 'linkText');
    description.setAttribute('data-aue-label', 'Text');
    description.setAttribute('data-aue-type', 'text');

    // Add social icons
    const socialWrapper = document.createElement('div');
    socialWrapper.className = 'social-icons';

    // Create social links container with data attributes
    const socialLinksContainer = document.createElement('div');
    socialLinksContainer.className = 'social-links';
    socialLinksContainer.setAttribute('data-aue-type', 'container');
    socialLinksContainer.setAttribute('data-aue-behavior', 'component');
    socialLinksContainer.setAttribute('data-aue-model', 'socialLinks');
    socialLinksContainer.setAttribute('data-aue-label', 'Social Links');
    socialLinksContainer.setAttribute('data-aue-filter', 'socialLinks');
    socialLinksContainer.setAttribute(
      'data-aue-resource',
      container.querySelector('.social-links').getAttribute('data-aue-resource'),
    );

    // Get all social link fields from DOM
    const socialLinkFields = container
      .querySelector('.social-links')
      .querySelectorAll('[data-aue-model="linkField"]');

    socialLinkFields.forEach((field) => {
      // Create link field container
      const linkFieldDiv = document.createElement('div');
      linkFieldDiv.setAttribute('data-aue-type', 'component');
      linkFieldDiv.setAttribute('data-aue-model', 'linkField');
      linkFieldDiv.setAttribute('data-aue-filter', 'linkField');
      linkFieldDiv.setAttribute('data-aue-label', 'Link Field');
      linkFieldDiv.setAttribute('data-aue-resource', field.getAttribute('data-aue-resource'));

      // Create link element
      const link = document.createElement('a');
      const linkData = field.querySelector('a');
      link.href = linkData.href;
      link.title = linkData.title;

      // Get icon name from DOM
      const iconName = field.querySelector('[data-aue-prop="linkSvgIcon"]').textContent;

      // Create anchor wrapper first
      const anchor = document.createElement('a');
      anchor.href = link.href;
      anchor.title = link.title;

      // Create icon container
      const iconContainer = document.createElement('span');
      iconContainer.className = 'social-icon-wrapper';

      // Create SVG icon and append to container
      const svgElement = SVGIcon({
        name: iconName,
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
      const targetElement = field.querySelector('[data-aue-prop="linkTarget"]');
      if (targetElement) {
        const target = targetElement.textContent;
        anchor.target = target;

        // If target is _blank, add rel for security
        if (target === '_blank') {
          anchor.rel = 'noopener noreferrer';
        }
      }

      // Append icon container to anchor

      anchor.appendChild(iconContainer);
      link.appendChild(anchor);

      linkFieldDiv.appendChild(link);
      socialLinksContainer.appendChild(linkFieldDiv);
    });

    socialWrapper.appendChild(socialLinksContainer);

    // Apply attributes to logo column
    logoColumn.append(logoWrapper, description, socialWrapper);

    // Add logo column to columns container
    columnsContainer.appendChild(logoColumn);

    // Get all navigation sections from the fragment
    const navigationLinks = Array.from(container.querySelectorAll('.links'));

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

        // Get section title
        const title = linkSection.querySelector('[data-aue-prop="title"]');

        if (title) {
          // Create heading element for title
          const heading = document.createElement('h2');
          heading.textContent = title.textContent;
          heading.className = 'footer-nav-title';

          // Set proper data attributes for authoring
          heading.setAttribute('data-aue-prop', 'title');
          heading.setAttribute('data-aue-label', 'Title');
          heading.setAttribute('data-aue-type', 'text');

          nav.appendChild(heading);
          nav.setAttribute('aria-label', title.textContent);

          // Copy data attributes from title
          Array.from(title.attributes).forEach((attr) => {
            if (attr.name.startsWith('data-')) {
              heading.setAttribute(attr.name, attr.value);
            }
          });
        }

        // Copy data attributes from link section
        Array.from(linkSection.attributes).forEach((attr) => {
          if (attr.name.startsWith('data-')) {
            nav.setAttribute(attr.name, attr.value);
          }
        });

        // Move all links while preserving their attributes
        const links = linkSection.querySelectorAll('[data-aue-model="linkField"]');
        links.forEach((link) => {
          const linkContainer = document.createElement('div');
          linkContainer.className = link.className;

          // Copy data attributes from link
          Array.from(link.attributes).forEach((attr) => {
            if (attr.name.startsWith('data-')) {
              linkContainer.setAttribute(attr.name, attr.value);
            }
          });

          // Get the button container and link
          const buttonContainer = link.querySelector('a');
          const anchor = buttonContainer;

          if (anchor) {
            // Create new link with title as text
            const newLink = document.createElement('a');
            newLink.href = anchor.href;
            newLink.className = 'button-link';
            newLink.textContent = anchor.textContent;

            // Copy data attributes from original anchor
            Array.from(anchor.attributes).forEach((attr) => {
              if (attr.name.startsWith('data-')) {
                newLink.setAttribute(attr.name, attr.value);
              }
            });

            // Create new button container
            const newButtonContainer = document.createElement('div');
            newButtonContainer.className = 'button-container';
            // newButtonContainer.setAttribute('data-aue-prop', 'linkText');
            newButtonContainer.appendChild(newLink);

            // Add target if exists
            const linkTarget = link.querySelector('[data-aue-prop="linkTarget"]');
            if (linkTarget) {
              const targetDiv = document.createElement('div');
              targetDiv.setAttribute('data-aue-prop', 'linkTarget');
              targetDiv.setAttribute('data-aue-label', 'Link Target');
              targetDiv.setAttribute('data-aue-type', 'text');
              targetDiv.textContent = linkTarget.textContent;
              linkContainer.appendChild(targetDiv);
            }

            linkContainer.appendChild(newButtonContainer);
          }

          nav.appendChild(linkContainer);
        });

        navColumns[index].appendChild(nav);
      }
    });

    // Add navigation columns to columns container
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
        Array.from(container.attributes).forEach((attr) => {
          if (attr.name.startsWith('data-')) {
            topContainer.setAttribute(attr.name, attr.value);
          }
        });

        const rightSection = document.createElement('div');
        rightSection.className = 'right-section';
        rightSection.setAttribute('data-aue-resource', fragment.querySelector('[data-aue-label="Column"]').getAttribute('data-aue-resource'));
        rightSection.setAttribute('data-aue-type', 'container');
        rightSection.setAttribute('data-aue-label', 'Column');
        rightSection.setAttribute('data-aue-filter', 'column');
        const rightRow = document.createElement('div');
        rightRow.className = 'row';

        const leftSection = document.createElement('div');
        leftSection.className = 'left-section';
        leftSection.setAttribute('data-aue-resource', fragment.querySelector('[data-aue-label="Column"]').getAttribute('data-aue-resource'));
        leftSection.setAttribute('data-aue-type', 'container');
        leftSection.setAttribute('data-aue-label', 'Column');
        leftSection.setAttribute('data-aue-filter', 'column');
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
    const bottomContent = findColumnWrapper(fragment.firstElementChild, 1);

    if (bottomContent) {
      // Create columns container - renamed to avoid shadowing
      const bottomColumnsContainer = document.createElement('div');
      bottomColumnsContainer.setAttribute('data-aue-type', 'container');
      bottomColumnsContainer.setAttribute('data-aue-model', 'columns');
      bottomColumnsContainer.setAttribute('data-aue-label', 'Columns');
      bottomColumnsContainer.setAttribute('data-aue-filter', 'columns');
      bottomColumnsContainer.setAttribute('data-aue-resource', bottomContent.getAttribute('data-aue-resource'));
      bottomColumnsContainer.className = 'footer-bottom-links';

      // Create column container
      const columnContainer = document.createElement('div');
      columnContainer.setAttribute('data-aue-type', 'container');
      columnContainer.setAttribute('data-aue-model', 'column');
      columnContainer.setAttribute('data-aue-label', 'Column');
      columnContainer.setAttribute('data-aue-filter', 'column');
      columnContainer.setAttribute('data-aue-resource', bottomContent.querySelector('[data-aue-model="column"]')?.getAttribute('data-aue-resource'));

      // Create row for layout
      const row = document.createElement('div');
      row.className = 'row';

      // Create text section
      const textContainer = document.createElement('div');
      textContainer.className = 'col-xl-6 col-md-3 col-sm-4';
      textContainer.setAttribute('data-aue-type', 'richtext');
      textContainer.setAttribute('data-aue-label', 'Text');
      textContainer.setAttribute('data-aue-prop', 'text');
      textContainer.setAttribute('data-aue-type', 'richtext');
      textContainer.setAttribute('data-aue-resource', bottomContent.querySelector('[data-richtext-prop="text"]')?.getAttribute('data-richtext-resource'));

      // Add text content
      const textContent = bottomContent.querySelector('[data-richtext-prop="text"]');
      if (textContent) {
        const textDiv = document.createElement('div');
        textDiv.className = 'copywrite';
        textDiv.setAttribute('data-richtext-prop', 'text');
        textDiv.innerHTML = textContent.innerHTML;
        textContainer.appendChild(textDiv);
      }

      // Create links container
      const linksContainer = document.createElement('div');
      linksContainer.className = 'row col-xl-6 col-md-3 col-sm-4 copywrite-right';

      linksContainer.setAttribute('data-aue-type', 'container');
      linksContainer.setAttribute('data-aue-model', 'links');
      linksContainer.setAttribute('data-aue-label', 'Links');
      linksContainer.setAttribute('data-aue-filter', 'links');
      linksContainer.setAttribute('data-aue-resource', bottomContent.querySelector('[data-aue-model="links"]')?.getAttribute('data-aue-resource'));

      // Process link fields
      const linkFields = bottomContent.querySelectorAll('[data-aue-model="linkField"]');
      linkFields.forEach((originalLinkField) => {
        // Create link field container
        const linkFieldContainer = document.createElement('div');
        linkFieldContainer.setAttribute('data-aue-type', 'component');
        linkFieldContainer.setAttribute('data-aue-model', 'linkField');
        linkFieldContainer.setAttribute('data-aue-label', 'Link Field');
        linkFieldContainer.setAttribute('data-aue-filter', 'linkField');
        linkFieldContainer.setAttribute('data-aue-resource', originalLinkField.getAttribute('data-aue-resource'));
        linkFieldContainer.className = 'col-xl-4 col-md-2 col-sm-4';

        // Create link text container
        const linkTextContainer = document.createElement('div');
        linkTextContainer.setAttribute('data-aue-prop', 'linkText');
        linkTextContainer.setAttribute('data-aue-type', 'text');
        linkTextContainer.setAttribute('data-aue-label', 'Link Text');
        linkTextContainer.className = 'button-container';

        // Create link
        const originalLink = originalLinkField.querySelector('a');
        if (originalLink) {
          const link = document.createElement('a');
          link.href = originalLink.href;
          link.className = 'button-link';
          link.textContent = originalLink.textContent;
          linkTextContainer.appendChild(link);
        }

        // Add link target
        const originalTarget = originalLinkField.querySelector('[data-aue-prop="linkTarget"]');
        if (originalTarget) {
          const targetDiv = document.createElement('div');
          targetDiv.setAttribute('data-aue-prop', 'linkTarget');
          targetDiv.setAttribute('data-aue-type', 'text');
          targetDiv.setAttribute('data-aue-label', 'Link Target');
          targetDiv.textContent = originalTarget.textContent;
          linkFieldContainer.appendChild(targetDiv);
        }

        linkFieldContainer.appendChild(linkTextContainer);
        linksContainer.appendChild(linkFieldContainer);
      });

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
      // Preserve existing data attributes
      const originalAttrs = Array.from(link.attributes);

      link.addEventListener('focus', () => {
        link.classList.add('focused');
      });
      link.addEventListener('blur', () => {
        link.classList.remove('focused');
      });

      // Restore data attributes
      originalAttrs.forEach((attr) => {
        if (attr.name.startsWith('data-')) {
          link.setAttribute(attr.name, attr.value);
        }
      });
    });
    section.appendChild(footer);
    block.innerHTML = '';
    block.appendChild(main);
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
