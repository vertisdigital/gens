import { moveInstrumentation } from '../../scripts/scripts.js';
import ImageComponent from '../../shared-components/ImageComponent.js';
import stringToHtml from '../../shared-components/Utility.js';
import SvgIcon from '../../shared-components/SvgIcon.js';

export default function decorate(block) {
  block.classList.add('fade-item');
  // Restructure the HTML for better semantics and accessibility
  const wrapper = block.closest('.projectslist') || block;

  // Create single container with all responsive classes
  const container = document.createElement('div');
  const gridView = block.classList.contains('grid-view') ? 'grid-view' : 'list-view';
  container.className = gridView === 'grid-view' ? `container ${gridView}` : `${gridView}`;
  if (block.classList.contains('has-padding')) {
    container.classList.add('has-padding')
  }
  moveInstrumentation(wrapper, container);

  const projectsContainer = wrapper.querySelector(
    '[data-aue-model="projectslist"], [data-gen-model="projectslist"]',
  ) || wrapper;

  Array.from(projectsContainer.children).forEach((project, index) => {
    if (project.children[0].textContent !== '') {
      const projectContainer = document.createElement('div');
      const baseClasses = (index % 2 === 1) ? 'odd-projectslistitem projectslistitem' : 'projectslistitem';
      projectContainer.className = gridView === 'grid-view' ? baseClasses : `container ${baseClasses}`;
      moveInstrumentation(project, projectContainer);

      // Create left column (heading) - 40% on desktop and tablet
      const leftCol = document.createElement('div');
      leftCol.className = 'col-xl-6 col-md-3 col-sm-4 left-col';

      const allDivElements = project.children;


      const titleText = allDivElements[0];
      if (titleText) {
        const title = document.createElement('p');
        title.className = 'project-title';
        moveInstrumentation(titleText, title);
        title.innerHTML = titleText.innerHTML;
        leftCol.appendChild(title);
      }

      const subtitleText = allDivElements[1];
      if (subtitleText.innerHTML.trim() !== '') {
        const subtitle = document.createElement('p');
        subtitle.className = 'project-subtitle';
        moveInstrumentation(subtitleText, subtitle);
        subtitle.innerHTML = subtitleText.innerHTML;
        leftCol.appendChild(subtitle);
      }

      const longDescriptionText = allDivElements[2];
      if (longDescriptionText) {
        const longDescription = document.createElement('p');
        longDescription.className = 'project-long-description';
        moveInstrumentation(longDescriptionText, longDescription);
        longDescription.innerHTML = longDescriptionText.innerHTML;
        leftCol.appendChild(longDescription);
      }

      const shortDescriptionText = allDivElements[3];

      if (shortDescriptionText.innerHTML.trim() !== '') {
        const shortDescription = document.createElement('p');
        shortDescription.className = 'project-short-description';
        moveInstrumentation(shortDescriptionText, shortDescription);
        shortDescription.innerHTML = shortDescriptionText.innerHTML;
        leftCol.appendChild(shortDescription);
      }

      const projectCta = project.querySelector('[data-aue-prop="link"], [data-gen-prop="link"]') || allDivElements[5];
      projectCta.className = 'project-cta';

      // Safe fetchers for fields that might have shifted indices
      const getFieldData = (propName, fallbackIndex) => {
        const el = project.querySelector(`[data-aue-prop="${propName}"], [data-gen-prop="${propName}"]`);
        if (el) return el.textContent?.trim();
        // Only use fallback if we know it's a valid string, to avoid extracting from a full HTML blob
        if (fallbackIndex < allDivElements.length && allDivElements[fallbackIndex] && !allDivElements[fallbackIndex].querySelector('a')) {
          return allDivElements[fallbackIndex].textContent?.trim();
        }
        return '';
      };

      // Extract new fields safely
      // Notice: depending on model history, the link text could be at index 6, 7, etc. 
      const modelLinkText = getFieldData('linkText', 6);
      const modelLinkTitle = getFieldData('linkTitle', 7);
      const modelSvgIcon = getFieldData('linkSvgIcon', 8) || 'arrowright';
      let linkTarget = '_self';
      
      const targetEl = project.querySelector('[data-aue-prop="linkTarget"], [data-gen-prop="linkTarget"]');
      if (targetEl) {
        linkTarget = targetEl.textContent?.trim() || '_self';
      } else {
        const lastChild = allDivElements[allDivElements.length - 1];
        if (lastChild && (lastChild.textContent?.trim() === '_blank' || lastChild.textContent?.trim() === '_self')) {
          linkTarget = lastChild.textContent?.trim();
        }
      }

      // Add arrowIcon to the button/link in projectCta
      const buttonLink = projectCta.querySelector('a');
      if (buttonLink) {
        // Set target safely
        buttonLink.setAttribute('target', linkTarget);
        if (modelLinkTitle) {
          buttonLink.setAttribute('title', modelLinkTitle);
        }

        // Capture the link text field value before clearing, use authored text if available
        const linkText = modelLinkText || buttonLink.textContent?.trim() || buttonLink.innerHTML?.trim() || '';

        buttonLink.classList.add('button');
        if (!linkText.includes('/')) {
          buttonLink.textContent = linkText;
          buttonLink.classList.add('vd-link');
        }
        else {
          buttonLink.classList.remove('vd-link');
          // Parse icon from model
          let iconName = 'arrowright';
          const iconValueLower = modelSvgIcon.toLowerCase();
          if (iconValueLower.includes('north-east') || iconValueLower === 'north-east-arrow') iconName = 'north-east-arrow';
          else if (iconValueLower.includes('download')) iconName = 'download-arrow';
          else if (iconValueLower === 'right-arrow' || iconValueLower === 'arrow') iconName = 'arrowright';

          // Create circular icon button with arrow icon
          const arrowIcon = SvgIcon({
            name: iconName,
            className: 'learn-button-icon',
            size: '14',
            color: 'var(--color-text-tertiary)',
          });
          buttonLink.innerHTML = '';
          buttonLink.appendChild(stringToHtml(arrowIcon));
        }

      }

      leftCol.appendChild(projectCta);

      // Create right column (description and contacts) - 60% on desktop and tablet
      const rightCol = document.createElement('div');
      rightCol.className = 'col-xl-6 col-md-3 col-sm-4 right-col';

      const imageLink = allDivElements[4].querySelector('a');

      if (imageLink) {
        const imageUrl = imageLink.getAttribute('href');
        const picture = ImageComponent({
          src: imageUrl,
          alt: allDivElements[4].querySelectorAll('a')[1]?.getAttribute('title') || '',
          className: 'proejctlisting-image',
          breakpoints: {
            mobile: {
              width: 768,
              src: `${imageUrl}`,
            },
            tablet: {
              width: 1024,
              src: `${imageUrl}`,
            },
            desktop: {
              width: 1920,
              src: `${imageUrl}`,
            },
          },
          lazy: true,
        });
        // Remove original link
        imageLink.remove();

        if (picture) {
          const imageContainer = document.createElement('div');
          imageContainer.className = 'project-image';
          const imageElement = stringToHtml(picture);
          imageContainer.appendChild(imageElement);
          rightCol.appendChild(imageContainer);
        }
      }
      projectContainer.appendChild(leftCol);
      projectContainer.appendChild(rightCol);
      container.appendChild(projectContainer);
    }
  });

  // Add class for 2-column layout if there are only 2 items
  const projectslistItems = container.querySelectorAll('.projectslistitem');
  if (projectslistItems.length === 2 && gridView === 'grid-view') {
    container.classList.add('grid-view-2-cols');
  }

  // Replace original content
  wrapper.innerHTML = '';
  wrapper.appendChild(container);
}