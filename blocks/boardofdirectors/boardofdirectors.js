import ImageComponent from "../../shared-components/ImageComponent.js";
import stringToHTML from "../../shared-components/Utility.js";
import { moveInstrumentation } from '../../scripts/scripts.js';


const getGroups = (updatedChildren) => {
  let groups = [];

  if (window.innerWidth >= 768 && window.innerWidth <= 992) {
    let i = 0;
    while (i < updatedChildren.length) {
      if (i % 2 === 0 && i + 2 <= updatedChildren.length) {
        groups.push(updatedChildren.slice(i, i + 2));
        i += 2;
      } else {
        groups.push(updatedChildren.slice(i));
        break;
      }
    }
  } else if (window.innerWidth >= 992) {
    let i = 0;
    while (i < updatedChildren.length) {
      if (i % 2 === 0 && i + 3 <= updatedChildren.length) {
        groups.push(updatedChildren.slice(i, i + 3));
        i += 3;
      } else if (i % 2 !== 0 && i + 2 <= updatedChildren.length) {
        groups.push(updatedChildren.slice(i, i + 2));
        i += 2;
      } else {
        groups.push(updatedChildren.slice(i));
        break;
      }
    }
  } else {
    groups = updatedChildren?.map((child) => [child]);
  }

  return groups;
};

export default function decorate(block) {
  const directors = [];

  function processDirectorElement(element) {
    const children = Array.from(element.children);
    if (children.length !== 4) return null;

    return {
      imageUrl: children[0].querySelector('a')?.href || '',
      name: children[1].textContent,
      title: children[2].textContent,
      content: children[3].innerHTML,
    };
  }

  function toggleDirector(director, containerDiv) {
    const card = containerDiv.querySelector('.director-card');
    const segment = card.parentElement.parentElement.parentElement;
    const content = segment.querySelector('.board-director-info');
    const info = containerDiv.querySelector('.director-content');
    const activeCard = document.querySelector('.director-card.active');
    const activeContent = document.querySelector('.board-director-info.active');

    if (activeCard === card) {
      activeCard.classList.remove('active');
      activeContent.classList.remove('active');
    } else {
      activeCard?.classList?.remove('active');
      activeContent?.classList?.remove('active');
      card.classList.add('active');
      content.innerHTML = info.innerHTML;
      content.classList.add('active');
    }
  }

  function setupDirectorCard(director, containerDiv) {
    const card = document.createElement('div');
    card.className = 'director-card';

    // Create image element
   const imgURL = director.imageUrl;;
    const picture = ImageComponent({
      src: imgURL,
      alt: director.name,
      className: 'director-card',
      breakpoints: {
        mobile: {
          width: 768,
          src: `${imgURL}`,
          imgWidth: 360
        },
        tablet: {
          width: 1024,
          src: `${imgURL}`,
          imgWidth: 360
        },
        desktop: {
          width: 1920,
          src: `${imgURL}`,
          imgWidth: 360
        },
      },
      lazy: true,
    });

   
    // Create info container
    const info = document.createElement('div');
    info.className = 'director-info';
    info.innerHTML = `
              <h3>${director.name}</h3>
              <div class="description-wrapper">
                <p>${director.title}</p>
                <div class="toggle-button">
                    <button class="toggle-on">+</button>
                    <button class="toggle-off">-</button>
                </div>
              </div>
          `;

    // Create content container (initially hidden)
    const content = document.createElement('div');
    content.className = 'director-content';
    content.innerHTML = director.content;
    content.style.display = 'none';

    // Assemble the card
    if (picture) {
      const imageElement = stringToHTML(picture);
      card.appendChild(imageElement);
    }
    card.appendChild(info);
    containerDiv.appendChild(card);
    containerDiv.appendChild(content);

    // Add click handler
    card.addEventListener('click', () => toggleDirector(director, containerDiv));
  }

  // Restructure the block to use container classes
  function restructureBlock() {
    const container = document.createElement('div');
    container.className = 'container';
    moveInstrumentation(block, container);
    const row = document.createElement('div');
    row.className = '';

    const directorElements = Array.from(block.children);
    const updatedChildren = [];
    directorElements.forEach((directorEl) => {
      const director = processDirectorElement(directorEl);
      if (director) {
        directors.push(director);
        const colDiv = document.createElement('div');
        colDiv.className = 'col-xl-4 col-md-3 col-sm-4';
        moveInstrumentation(directorEl, colDiv);
        setupDirectorCard(director, colDiv);
        updatedChildren?.push(colDiv);
      }
    });

    const groups = getGroups(updatedChildren);

    // Create wrappers and append them
    groups.forEach((group) => {
      const segmentWrapper = document.createElement('div');
      segmentWrapper.classList.add('segment-wrapper');
      const wrapper = document.createElement('div');
      wrapper.classList.add('wrapper', 'row');
      const directorInfo = document.createElement('div');
      directorInfo.classList.add('board-director-info');
      segmentWrapper.appendChild(wrapper);
      group?.forEach((child) => wrapper.appendChild(child));
      row.appendChild(segmentWrapper);
      segmentWrapper.appendChild(directorInfo);
    });

    // Replace original content
    container.appendChild(row);
    block.innerHTML = '';
    block.appendChild(container);
  }

  // Initialize the block
  restructureBlock();
}
