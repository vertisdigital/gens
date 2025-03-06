export default function decorate(block) {
    // Initialize variables
    const directors = [];
    let activeDirector = null;

    // Restructure the block to use container classes
    function restructureBlock() {
        const container = document.createElement('div');
        container.className = 'container-xl';
        
        const row = document.createElement('div');
        row.className = 'row';
        
        // Get all director elements
        const directorElements = Array.from(block.children);
        
        // Process each director
        directorElements.forEach(directorEl => {
            const director = processDirectorElement(directorEl);
            if (director) {
                directors.push(director);
                const colDiv = document.createElement('div');
                colDiv.className = 'col-xl-4 col-md-3 col-sm-4';
                setupDirectorCard(director, colDiv);
                row.appendChild(colDiv);
            }
        });

        // Replace original content
        container.appendChild(row);
        block.innerHTML = '';
        block.appendChild(container);
    }

    // Process individual director element
    function processDirectorElement(element) {
        const children = Array.from(element.children);
        if (children.length !== 4) return null;

        return {
            imageUrl: children[0].querySelector('a')?.href || '',
            name: children[1].textContent,
            title: children[2].textContent,
            content: children[3].innerHTML
        };
    }

    // Create and setup director card
    function setupDirectorCard(director, containerDiv) {
        // Create card container
        const card = document.createElement('div');
        card.className = 'director-card';
        
        // Create image element
        const img = document.createElement('img');
        img.src = director.imageUrl;
        img.alt = director.name;
        img.loading = 'lazy';

        // Create info container
        const info = document.createElement('div');
        info.className = 'director-info';
        info.innerHTML = `
            <h3>${director.name}</h3>
            <p>${director.title}</p>
        `;

        // Create content container (initially hidden)
        const content = document.createElement('div');
        content.className = 'director-content';
        content.innerHTML = director.content;
        content.style.display = 'none';

        // Assemble the card
        card.appendChild(img);
        card.appendChild(info);
        containerDiv.appendChild(card);
        containerDiv.appendChild(content);

        // Add click handler
        card.addEventListener('click', () => toggleDirector(director, containerDiv));
    }

    // Toggle director content visibility
    function toggleDirector(director, containerDiv) {
        const content = containerDiv.querySelector('.director-content');
        const card = containerDiv.querySelector('.director-card');

        if (activeDirector && activeDirector !== director) {
            // Hide previously active director
            const activeContent = block.querySelector('.director-content[style="display: block;"]');
            const activeCard = block.querySelector('.director-card.active');
            if (activeContent) activeContent.style.display = 'none';
            if (activeCard) activeCard.classList.remove('active');
        }

        if (activeDirector === director) {
            // Clicking active director - hide content
            content.style.display = 'none';
            card.classList.remove('active');
            activeDirector = null;
        } else {
            // Show new director content
            content.style.display = 'block';
            card.classList.add('active');
            activeDirector = director;
            
            // Scroll content into view
            content.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    // Initialize the block
    restructureBlock();
} 