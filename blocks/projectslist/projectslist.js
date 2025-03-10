import { moveInstrumentation } from '../../scripts/scripts.js';
import ImageComponent from '../../shared-components/ImageComponent.js';
import stringToHtml from '../../shared-components/Utility.js';

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
    const projectContainer = document.createElement('div');
    projectContainer.className = 'projectslistitem';
    moveInstrumentation(project, projectContainer);

    // Create left column (heading) - 40% on desktop and tablet
    const leftCol = document.createElement('div');
    leftCol.className = 'col-xl-6 col-md-3 col-sm-4 left-col';

    const allDivElements = project.querySelectorAll('div');

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

    const shortDescriptionText = project.querySelector(
      '[data-aue-prop="shortdescription"]',
    );
    if (shortDescriptionText) {
      const shortDescription = document.createElement('p');
      shortDescription.className = 'project-short-description';
      moveInstrumentation(shortDescriptionText, shortDescription);
      shortDescription.innerHTML = shortDescriptionText.innerHTML;
      leftCol.appendChild(shortDescription);
    }

    // Create right column (description and contacts) - 60% on desktop and tablet
    const rightCol = document.createElement('div');
    rightCol.className = 'col-xl-6 col-md-3 col-sm-4 right-col';

    const imageLink = project.querySelector('a[href*="delivery-"]', 'a[href*="/content/dam/"][href$=".png"], a[href*="/content/dam/"][href$=".jpeg"], a[href*="/content/dam/"][href$=".jpg"], a[href*="/content/dam/"][href$=".gif"], a[href*="/content/dam/"][href$=".svg"]');

    if (imageLink) {
      const imageUrl = imageLink.getAttribute('href');
       const picture = ImageComponent({
              src: imageUrl,
              alt: '',
              className: 'proejctlisting-image',
              asImageName: 'projectlisting.webp',
              breakpoints: {
                mobile: {
                  width: 768,
                  src: `${imageUrl}`,
                  imgWidth: 400,
                  imgHeight: 250,
                },
                tablet: {
                  width: 993,
                  src: `${imageUrl}`,
                  imgWidth: 400,
                  imgHeight: 250,
                },
                desktop: {
                  width: 1920,
                  src: `${imageUrl}`,
                  imgWidth: 400,  
                  imgHeight: 250,
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
  });
  // Replace original content
  wrapper.innerHTML = '';
  wrapper.appendChild(container);
}
