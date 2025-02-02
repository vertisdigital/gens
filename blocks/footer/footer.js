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
  
  if (fragment && fragment.firstElementChild) {
    const footer = document.createElement('footer');
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
    
    // Create first section for navigation
    const navSection = document.createElement('div');
    navSection.className = 'row';

    // Create logo and description column
    const logoColumn = document.createElement('div');
    logoColumn.className = 'col-xl-3 col-md-3 col-sm-4';

    // Add logo
    const logoWrapper = document.createElement('div');
    logoWrapper.className = 'footer-logo';
    const logo = document.createElement('img');
    const logoImg = container.querySelector('.image-link img');
    if (logoImg) {
      logo.src = logoImg.src;
      logo.alt = logoImg.alt || 'Genting Singapore';
    }
    logoWrapper.appendChild(logo);

    // Add description
    const description = document.createElement('p');
    description.className = 'footer-description';
    description.textContent = container.querySelector('.image-link [data-aue-prop="linkText"]').textContent;

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

    // Assemble logo column
    logoColumn.append(logoWrapper, description, socialWrapper);
    navSection.appendChild(logoColumn);
    
    // Get all navigation sections from the fragment
    const navigationLinks = Array.from(container.querySelectorAll('.links'));
    
    // Create columns dynamically based on navigation sections
    const navColumns = navigationLinks.map(() => {
      const col = document.createElement('div');
      col.className = 'col-xl-3 col-md-3 col-sm-4';
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
    
    // Add columns to nav section
    navColumns.forEach(col => navSection.appendChild(col));
    
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
    mainContainer.append(navSection, bottomSection);
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
    block.append(footer);
  }
}
