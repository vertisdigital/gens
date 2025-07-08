import { moveInstrumentation } from '../../scripts/scripts.js';
import ImageComponent from '../../shared-components/ImageComponent.js';
import stringToHtml from '../../shared-components/Utility.js';
import SvgIcon from "../../shared-components/SvgIcon.js";

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

      const allDivElements = [...project.children];

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

      const projectCta = allDivElements[6];
      const isDownloadable = allDivElements[8]?.textContent
      const projectCtaLabel = allDivElements[5]
      const projectLink = projectCta.querySelector('a')
      const linkTag=document.createElement('a')
      if (projectCtaLabel) {
            linkTag.className = 'project-cta';
        const link = allDivElements[9]?.querySelector('a')?.href
        
        if (isDownloadable === 'true') {
          if (projectCtaLabel) {
            linkTag.setAttribute('target', '_blank');
            linkTag.setAttribute('href', link);
          }
        } else {
          const target = allDivElements[10]?.textContent?.trim() || '_self';

          if (projectCtaLabel) {
            linkTag.setAttribute('target', target);
            linkTag.setAttribute('href',projectLink?.href || "#")
          }
        }
        if((isDownloadable==='true' && link) || (projectLink?.href && isDownloadable==='false')){
          linkTag.innerHTML = projectCtaLabel?.textContent
          projectCtaLabel.innerHTML=""
          projectCtaLabel.append(linkTag)
          leftCol.appendChild(projectCtaLabel);
          
        }
        

        const icon = allDivElements[6]?.textContent?.replace(/-/g, "")?.toLowerCase()?.trim()
        if(icon?.length){
          const ctaIcon = SvgIcon({
            name: icon,
            className: "corporate-policies-cta",
            size: "16px",
          });
          const div = document.createElement('div')
          if(projectCtaLabel && stringToHtml(ctaIcon)){
            linkTag.append(stringToHtml(ctaIcon)) 
          }
          leftCol.appendChild(div);
        }
      }
      // Create right column (description and contacts) - 60% on desktop and tablet
      const rightCol = document.createElement('div');
      rightCol.className = 'col-xl-6 col-md-3 col-sm-4 right-col';

      const imageLink = allDivElements[4]?.querySelector('a');

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
  // Replace original content
  wrapper.innerHTML = '';
  wrapper.appendChild(container);
}
