import { moveInstrumentation } from '../../scripts/scripts.js';
import SvgIcon from '../../shared-components/SvgIcon.js';


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
      const contentWrapper = content.querySelector('.board-director-content');
      if (contentWrapper) {
        // Get title from description-wrapper p
        const titleP = card.querySelector('.description-wrapper p');
        const titleText = titleP ? titleP.textContent : '';
        
        // Get name from director-info h3
        const nameH3 = card.querySelector('.director-info h3');
        const nameText = nameH3 ? nameH3.textContent : '';
        
        // Create two p tags at the top
        const titleParagraph = document.createElement('p');
        titleParagraph.textContent = titleText;
        
        const nameParagraph = document.createElement('p');
        nameParagraph.textContent = nameText;
        
        // Clear existing content and add new paragraphs first
        contentWrapper.innerHTML = '';
        contentWrapper.appendChild(titleParagraph);
        contentWrapper.appendChild(nameParagraph);
        
        // Then add the director content
        const contentDiv = document.createElement('div');
        contentDiv.innerHTML = info.innerHTML;
        contentWrapper.appendChild(contentDiv);
      } else {
        content.innerHTML = info.innerHTML;
      }
      content.classList.add('active');
    }
  }

  function setupDirectorCard(director, containerDiv) {
    const card = document.createElement('div');
    card.className = 'director-card';

    // Create image element
    const imgURL = director.imageUrl;

    card.style.backgroundImage = `url("${imgURL}")`;
    card.style.backgroundSize = 'cover';
    card.style.backgroundPosition = 'center';
    card.style.backgroundRepeat = 'no-repeat';

    const arrowIcon = SvgIcon({
      name: 'arrowright',
      size: '14',
      color: 'var(--color-border-secondary)'
    });

    // Create info container
    const info = document.createElement('div');
    info.className = 'director-info';
    info.innerHTML = `
              <h3>${director.name}</h3>
              <div class="description-wrapper">
                <p>${director.title}</p>
                <div class="toggle-button">
                    <button class="toggle-on">${arrowIcon}</button>
                </div>
              </div>
          `;

    // Create content container (initially hidden)
    const content = document.createElement('div');
    content.className = 'director-content';
    content.innerHTML = director.content;
    content.style.display = 'none';

    // Assemble the card
    /* if (picture) {
      const imageElement = stringToHTML(picture);
      card.appendChild(imageElement);
    } */
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
    console.log('groups', groups);

    // Create a single segment-wrapper
    const segmentWrapper = document.createElement('div');
    segmentWrapper.classList.add('segment-wrapper');

    // Create a single wrapper for all groups
    const wrapper = document.createElement('div');
    wrapper.classList.add('wrapper', 'row');

    // Create a single board-director-info
    const directorInfo = document.createElement('div');
    directorInfo.classList.add('board-director-info');
    
    // Add toggle button at top right
    const toggleButtonDiv = document.createElement('div');
    toggleButtonDiv.classList.add('toggle-button');
    const toggleOffButton = document.createElement('button');
    toggleOffButton.classList.add('toggle-off');
    const closeIcon = SvgIcon({
      name: 'close',
      className: '',
      size: '24',
      color: 'var(--color-text-black)'
    });

    toggleOffButton.innerHTML = closeIcon;
    toggleOffButton.addEventListener('click', (e) => {
      e.stopPropagation();
      const activeCard = document.querySelector('.director-card.active');
      const activeContent = document.querySelector('.board-director-info.active');
      if (activeCard) activeCard.classList.remove('active');
      if (activeContent) activeContent.classList.remove('active');
    });
    toggleButtonDiv.appendChild(toggleOffButton);
    directorInfo.appendChild(toggleButtonDiv);
    
    // Create content wrapper to preserve toggle button when content is set
    const contentWrapper = document.createElement('div');
    contentWrapper.classList.add('board-director-content');
    directorInfo.appendChild(contentWrapper);

    // Append all groups' cards to the single wrapper
    groups.forEach((group) => {
      group?.forEach((child) => wrapper.appendChild(child));
    });

    // Append wrapper and directorInfo to segmentWrapper
    segmentWrapper.appendChild(wrapper);
    segmentWrapper.appendChild(directorInfo);

    // Append the single segmentWrapper to row
    row.appendChild(segmentWrapper);

    // Replace original content
    container.appendChild(row);
    block.innerHTML = '';
    block.appendChild(container);
  }

  // Initialize the block
  restructureBlock();
}
