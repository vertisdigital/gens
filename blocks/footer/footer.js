import { getMetadata } from '../../scripts/aem.js';
import { loadFragmentCustom } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragmentCustom(footerPath);
  //const fragment = block
  
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
        'data-aue-filter': 'section'
      };
      
      Object.entries(dataAttributes).forEach(([key, value]) => {
        if (value) {
          section.setAttribute(key, value);
        }
      });
    }

    // Append section and footer to main
    main.appendChild(section);
    
    document.getElementsByTagName('main')[0].remove();
    const footer = document.createElement('div');
    //const container = fragment.firstElementChild;
    const findColumnWrapper = (block, index) => {
      // Check first and last children for columns-wrapper
      if (block.children[index].classList.contains('columns')) {
        return block.children[index];
      } else if (block.children[index].classList.contains('columns')) {
        return block.children[index];
      }
      return null;
    };
    
    const container = findColumnWrapper(fragment.firstElementChild, 0);
    // Copy all data attributes from the original container
    Array.from(container.attributes).forEach(attr => {
      if (attr.name.startsWith('data-')) {
        footer.setAttribute(attr.name, attr.value);
      }
    });
    
    footer.setAttribute('role', 'contentinfo');
    //footer.className = container.className;

    // Create main container with responsive classes
    const mainContainer = document.createElement('div');
    mainContainer.className = 'footer container-xl container-md container-sm';
    
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
    const logoImg = container.querySelector('.image-link img');
    if (logoImg) {
      logo.src = logoImg.src;
      logo.setAttribute('data-aue-resource', container.querySelector('.image-link').getAttribute('data-aue-resource'));
      logo.setAttribute('data-aue-label', 'Link Image'); 
      logo.setAttribute('data-aue-type', 'media');
      logo.alt = logoImg.alt || 'Genting Singapore';
    }
    logoWrapper.appendChild(logo);

    // Add description
    const description = document.createElement('p');
    description.className = 'footer-description';
    description.textContent = container.querySelector('[data-aue-prop="linkText"]')?.textContent;
    description.setAttribute('data-aue-resource', container.querySelector('[data-aue-model="linkField"]').getAttribute('data-aue-resource'));
    description.setAttribute('data-aue-prop', 'description');
    description.setAttribute('data-aue-label', 'Description');
    description.setAttribute('data-aue-type', 'text');

    // Add social icons
    const socialWrapper = document.createElement('div');
    socialWrapper.className = 'social-icons';
    
    const socialIcons = [
      { icon: 'twitter', href: '#', label: 'Twitter' },
      { icon: 'linkedin', href: '#', label: 'LinkedIn' },
      { icon: 'youtube', href: '#', label: 'YouTube' }
    ];

    socialIcons.forEach(social => {
      const link = document.createElement('a');
      link.href = social.href;
      link.className = `icon-${social.icon}`;
      link.setAttribute('aria-label', social.label);
      
      const icon = document.createElement('span');
      icon.className = `icon icon-${social.icon}`;
      link.appendChild(icon);
      
      socialWrapper.appendChild(link);
    });

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
          nav.appendChild(heading);
          nav.setAttribute('aria-label', title.textContent);
          
          // Copy data attributes from title
          Array.from(title.attributes).forEach(attr => {
            if (attr.name.startsWith('data-')) {
              title.setAttribute(attr.name, attr.value);
            }
          });
        }
        
        // Copy data attributes from link section
        Array.from(linkSection.attributes).forEach(attr => {
          if (attr.name.startsWith('data-')) {
            nav.setAttribute(attr.name, attr.value);
          }
        });
        
        // Move all links while preserving their attributes
        const links = linkSection.querySelectorAll('[data-aue-model="linkField"]');
        links.forEach(link => {
          const linkContainer = document.createElement('div');
          linkContainer.className = link.className;
          
          // Copy data attributes from link
          Array.from(link.attributes).forEach(attr => {
            if (attr.name.startsWith('data-')) {
              linkContainer.setAttribute(attr.name, attr.value);
            }
          });
          
          // Get the button container and link
          const buttonContainer = link.querySelector('[data-aue-prop="linkText"]');
          const anchor = buttonContainer;
          
          if (anchor) {
            // Create new link with title as text
            const newLink = document.createElement('a');
            newLink.href = anchor.href;
            newLink.className = 'anchor.className';
            newLink.textContent = anchor.title; // Use title attribute as link text
            
            // Copy data attributes from original anchor
            Array.from(anchor.attributes).forEach(attr => {
              if (attr.name.startsWith('data-')) {
                newLink.setAttribute(attr.name, attr.value);
              }
            });

            // Create new button container
            const newButtonContainer = document.createElement('div');
            newButtonContainer.className = 'button-container';
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
    navColumns.forEach(col => {
      columnsContainer.appendChild(col);
    });

    // Function to handle layout based on screen size
    const handleLayout = () => {
      const isDesktop = window.innerWidth >= 992;
      
      if (isDesktop && !mainContainer.querySelector('.right-section')) {
        // Create right and left sections for desktop
        const rightSection = document.createElement('div');
        rightSection.className = 'right-section';
        rightSection.setAttribute('data-aue-resource', sourceSection.querySelector('[data-aue-label="Column"]').getAttribute('data-aue-resource'));
        rightSection.setAttribute('data-aue-type', 'container');
        rightSection.setAttribute('data-aue-label', 'Column');
        rightSection.setAttribute('data-aue-filter', 'column');
        const rightRow = document.createElement('div');
        rightRow.className = 'row';
        
        const leftSection = document.createElement('div');
        leftSection.className = 'left-section';
        leftSection.setAttribute('data-aue-resource', sourceSection.querySelector('[data-aue-label="Column"]').getAttribute('data-aue-resource'));
        leftSection.setAttribute('data-aue-type', 'container');
        leftSection.setAttribute('data-aue-label', 'Column');
        leftSection.setAttribute('data-aue-filter', 'column');
        const leftRow = document.createElement('div');
        leftRow.className = 'row';
        
        // Move logo column to right section's row
        rightRow.appendChild(logoColumn);
        rightSection.appendChild(rightRow);
        
        // Move nav columns to left section's row
        navColumns.forEach(col => {
          leftRow.appendChild(col);
        });
        leftSection.appendChild(leftRow);
        
        // Add sections to main container
        mainContainer.insertBefore(leftSection, mainContainer.firstChild);
        mainContainer.insertBefore(rightSection, mainContainer.firstChild);
        
      } else if (!isDesktop && mainContainer.querySelector('.right-section')) {
        // Remove sections and restore original layout for tablet/mobile
        const rightSection = mainContainer.querySelector('.right-section');
        const leftSection = mainContainer.querySelector('.left-section');
        
        if (rightSection && leftSection) {
          // Move columns back to columns container
          columnsContainer.appendChild(logoColumn);
          navColumns.forEach(col => {
            columnsContainer.appendChild(col);
          });
          
          // Remove sections
          rightSection.remove();
          leftSection.remove();
          
          // Add columns container back to main container
          mainContainer.insertBefore(columnsContainer, mainContainer.firstChild);
        }
      }
    };

    // Initial layout setup
    handleLayout();

    // Update layout on resize
    window.addEventListener('resize', handleLayout);

    // Create bottom section for copyright and links
    const bottomSection = document.createElement('div');
    bottomSection.className = 'row mt-4';
    
    // Get bottom section content
    const bottomContent = findColumnWrapper(fragment.firstElementChild, 1);
    if (bottomContent) {
      // Create columns dynamically based on bottom content
      const bottomColumns = Array.from(bottomContent.querySelectorAll('.columns > div > div')).map((_, index) => {
        const col = document.createElement('div');
        // First column (copyright) gets col-xl-6, others get col-xl-2
        if (index === 0) {
          col.className = 'col-xl-6 col-md-3 col-sm-4';
        } else {
          col.className = 'col-xl-2 col-md-1 col-sm-4';
        }
        return col;
      });
      
      // Move content to respective columns
      bottomContent.querySelectorAll('.columns > div > div').forEach((content, index) => {
        if (bottomColumns[index]) {
          // Preserve all attributes and structure
          const clonedContent = content.cloneNode(true);
          // Remove button class from any links in the cloned content
          clonedContent.querySelectorAll('a').forEach(link => {
            link.classList.remove('button');
          });
          bottomColumns[index].appendChild(clonedContent);
        }
      });
      
      bottomColumns.forEach(col => bottomSection.appendChild(col));
    }
    
    // Assemble the footer
    mainContainer.append(bottomSection);
    footer.appendChild(mainContainer);
    
    // Add keyboard navigation
    const allLinks = footer.querySelectorAll('a');
    allLinks.forEach(link => {
      // Preserve existing data attributes
      const originalAttrs = Array.from(link.attributes);
      
      link.addEventListener('focus', () => {
        link.classList.add('focused');
      });
      link.addEventListener('blur', () => {
        link.classList.remove('focused');
      });
      
      // Restore data attributes
      originalAttrs.forEach(attr => {
        if (attr.name.startsWith('data-')) {
          link.setAttribute(attr.name, attr.value);
        }
      });
    });
    section.appendChild(footer);
    block.append(main);
  }
}
