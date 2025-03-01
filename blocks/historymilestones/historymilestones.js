// historymilestones.js

import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  // Add container classes only if not in tabs
  if (!block.closest('.tabs')) {
    block.classList.add('container-xl', 'container-lg', 'container-md', 'container-sm');
  }

  // Process milestone items
  const milestoneContainers = block.querySelectorAll('div:nth-child(n+3)'); // Select each container

  milestoneContainers.forEach(container => {
    const milestoneItems = container.querySelectorAll('div'); // Select milestone items within container

    milestoneItems.forEach((item) => {
      // Rearrange the divs to match expected structure: Image, Date, Description
      const imageDiv = item.querySelector('div:first-child');
      const dateDiv = item.querySelector('div:nth-child(2)');
      const descriptionDiv = item.querySelector('div:nth-child(3)');

      // Clear existing content
      item.innerHTML = '';

      // Append elements in the desired order
      item.append(imageDiv);
      item.append(dateDiv);
      item.append(descriptionDiv);

      // Handle image
      const imgLink = imageDiv.querySelector('a');
      if (imgLink) {
        const picture = createOptimizedPicture(imgLink.href, '', false, [
          { media: '(min-width: 768px)', width: '400' },
          { width: '320' },
        ]);
        imageDiv.innerHTML = ''; // Clear the link
        imageDiv.appendChild(picture); // Add the optimized picture

        //Add class for image container
        imageDiv.classList.add('image-container');
      }

      // Check if date is empty
      if (dateDiv && dateDiv.textContent.trim() === "") {
        dateDiv.remove();
        // Create and append empty div for spacing if there is no date
        const emptyDiv = document.createElement('div');
        emptyDiv.classList.add('empty-div');
        item.insertBefore(emptyDiv, descriptionDiv); // Insert it before the description
      }
    });
  });

  // Add accessibility attributes
  block.setAttribute('role', 'region');
  block.setAttribute('aria-label', 'History and Milestones');
}