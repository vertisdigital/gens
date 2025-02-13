import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  // Add block level attributes for authoring
  block.setAttribute(
    'data-aue-resource',
    'urn:aemconnection:/content/genting-singapore/index/enquiry/jcr:content/root/section/block',
  );
  block.setAttribute('data-aue-type', 'container');
  block.setAttribute('data-aue-behavior', 'component');
  block.setAttribute('data-aue-model', 'projectslist');
  block.setAttribute('data-aue-label', 'projectslist');
  block.setAttribute('data-aue-filter', 'projectslist');

  // Restructure the HTML for better semantics and accessibility
  const wrapper = block.closest('.projectslist-wrapper');

  // Create single container with all responsive classes
  const container = document.createElement('div');
  container.className = 'container-xl container-md container-sm';
  container.setAttribute(
    'data-aue-resource',
    block.getAttribute('data-aue-resource'),
  );
  container.setAttribute('data-aue-type', 'container');
  container.setAttribute('data-aue-behavior', 'component');
  container.setAttribute('data-aue-model', 'projectslist');
  container.setAttribute('data-aue-label', 'projectslist');
  container.setAttribute('data-aue-filter', 'projectslist');

  const projectsContainer = wrapper.querySelector(
    '[data-aue-model="projectslist"]',
  );

  Array.from(projectsContainer.children).forEach((project) => {
    const projectContainer = document.createElement('div');
    projectContainer.className = 'projectslistitem';
    projectContainer.setAttribute(
      'data-aue-resource',
      project.getAttribute('data-aue-resource'),
    );
    projectContainer.setAttribute('data-aue-type', 'component');
    projectContainer.setAttribute('data-aue-model', 'projectslistitem');
    projectContainer.setAttribute('data-aue-label', 'projectslistitem');

    // Create left column (heading) - 40% on desktop and tablet
    const leftCol = document.createElement('div');
    leftCol.className = 'col-xl-6 col-md-3 container-sm-4 left-col';

    const titleText = project.querySelector('[data-aue-prop="title"]');
    if (titleText) {
      const title = document.createElement('p');
      title.className = 'project-title';
      title.setAttribute('data-aue-prop', 'title');
      title.setAttribute('data-aue-label', 'Title');
      title.setAttribute('data-aue-type', 'text');
      title.innerHTML = titleText.innerHTML;
      leftCol.appendChild(title);
    }

    const subtitleText = project.querySelector('[data-aue-prop="subtitle"]');
    if (subtitleText) {
      const subtitle = document.createElement('p');
      subtitle.className = 'project-subtitle';
      subtitle.setAttribute('data-aue-prop', 'subtitle');
      subtitle.setAttribute('data-aue-label', 'Subtitle');
      subtitle.setAttribute('data-aue-type', 'text');
      subtitle.innerHTML = subtitleText.innerHTML;
      leftCol.appendChild(subtitle);
    }

    const longDescriptionText = project.querySelector(
      '[data-aue-prop="longdescription"]',
    );
    if (longDescriptionText) {
      const longDescription = document.createElement('p');
      longDescription.className = 'project-long-description';
      longDescription.setAttribute('data-aue-prop', 'longdescription');
      longDescription.setAttribute('data-aue-label', 'Long Description');
      longDescription.setAttribute('data-aue-filter', 'text');
      longDescription.setAttribute('data-aue-type', 'richtext');
      longDescription.innerHTML = longDescriptionText.innerHTML;
      leftCol.appendChild(longDescription);
    }

    const shortDescriptionText = project.querySelector(
      '[data-aue-prop="shortdescription"]',
    );
    if (shortDescriptionText) {
      const shortDescription = document.createElement('p');
      shortDescription.className = 'project-short-description';
      shortDescription.setAttribute('data-aue-prop', 'shortdescription');
      shortDescription.setAttribute('data-aue-label', 'Short Description');
      shortDescription.setAttribute('data-aue-type', 'text');
      shortDescription.innerHTML = shortDescriptionText.innerHTML;
      leftCol.appendChild(shortDescription);
    }

    // Create right column (description and contacts) - 60% on desktop and tablet
    const rightCol = document.createElement('div');
    rightCol.className = 'col-xl-6 col-md-3 container-sm-4 right-col';

    const imageLink = project.querySelector(
      'a[href*="/content/dam/"][href$=".png"], a[href*="/content/dam/"][href$=".jpeg"], a[href*="/content/dam/"][href$=".jpg"], a[href*="/content/dam/"][href$=".gif"], a[href*="/content/dam/"][href$=".svg"]',
    );
    if (imageLink) {
      const imageUrl = imageLink.getAttribute('href');
      const picture = createOptimizedPicture(imageUrl, '', false);
      // Remove original link
      imageLink.remove();
      if (picture) {
        const imageContainer = document.createElement('div');
        imageContainer.className = 'project-image';
        imageContainer.appendChild(picture);
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
