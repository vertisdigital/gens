import { moveInstrumentation } from '../../scripts/scripts.js';
import ImageComponent from '../../shared-components/ImageComponent.js';
import stringToHtml, { downloadLink } from '../../shared-components/Utility.js';

export default function decorate(block) {
  // Restructure the HTML for better semantics and accessibility
  const wrapper = block.closest('.projectslist') || block;

  // Create single container with all responsive classes
  const container = document.createElement('div');
  container.className = 'container';
  moveInstrumentation(wrapper, container);

  const projectsContainer = wrapper.querySelector(
    '[data-aue-model="projectslist"], [data-gen-model="projectslist"]',
  ) || wrapper;

  Array.from(projectsContainer.children).forEach((project) => {
    if (project.children[0].textContent !== '') {
      const projectContainer = document.createElement('div');
      projectContainer.className = 'projectslistitem';
      moveInstrumentation(project, projectContainer);

      // Create left column (heading) - 40% on desktop and tablet
      const leftCol = document.createElement('div');
      leftCol.className = 'col-xl-6 col-md-3 col-sm-4 left-col';
      
      if(project.getAttribute('data-gen-download')==='downloadlinkitem'){
        leftCol.setAttribute('data-gen-download','downloadlinkitem');
      }

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
      if (subtitleText) {
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

      if (shortDescriptionText) {
        const shortDescription = document.createElement('p');
        shortDescription.className = 'project-short-description';
        moveInstrumentation(shortDescriptionText, shortDescription);
        shortDescription.innerHTML = shortDescriptionText.innerHTML;
        leftCol.appendChild(shortDescription);
      }

      const projectCta = allDivElements[5];
      if (projectCta) {
        projectCta.className = 'project-cta';
        leftCol.appendChild(projectCta);
      }
      // Create right column (description and contacts) - 60% on desktop and tablet
      const rightCol = document.createElement('div');
      rightCol.className = 'col-xl-6 col-md-3 col-sm-4 right-col';

      const imageLink = allDivElements[4]?.querySelector('a');

      if (imageLink) {
        const imageUrl = imageLink.getAttribute('href');
        const picture = ImageComponent({
          src: imageUrl,
          alt: allDivElements[4].querySelectorAll('a')[1]?.getAttribute('title')||'',
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
  // Replace original content
  wrapper.innerHTML = '';
  wrapper.appendChild(container);
  downloadLink(block)
}
