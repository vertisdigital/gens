import { moveInstrumentation } from '../../scripts/scripts.js';
import Heading from '../../shared-components/Heading.js';
import stringToHTML from '../../shared-components/Utility.js';

export default function decorate(block) {
  const blockChilden = [].slice.call(block.children);
  const isStatisDesc = blockChilden[0].textContent.trim() === 'statistics-description';
  const isStatFeatures = blockChilden[0].textContent.trim() === 'statistics-feature';

  // processing the sesction title
  const heading = blockChilden[1];
  if (heading) {
    const titleText = heading.textContent;
    const titleHtml = Heading({
      level: 2,
      text: titleText,
      className: 'statistics-title',
    });
    const parsedHtml = stringToHTML(titleHtml);
    moveInstrumentation(heading, parsedHtml);
    block.appendChild(parsedHtml);
    heading.remove();
  }

  if (isStatFeatures) {
      // finding the feature items
      const featureItems =  blockChilden.slice(2);
    
      const featureContainer = document.createElement('div');
      featureContainer.className = 'row statistics-row';
    
      featureItems.forEach((featureItem) => {
        featureContainer.appendChild(featureItem);
        featureItem.classList.add(
          'col-xl-4',
          'col-lg-4',
          'col-md-3',
          'col-sm-4',
          'feature-item',
        );
        featureItem.children[2]?.classList.add('statistic-item');
        featureItem.children[3]?.classList.add('text-container');
      });
    
      block.appendChild(featureContainer);
  }

  if (isStatisDesc) {
    // processing the statistics description block
    const statisticBlockDescription = blockChilden[2];
  
    if (statisticBlockDescription && statisticBlockDescription.textContent.trim() !== '') {
      statisticBlockDescription.classList.add('statistics-description-wrapper');
      const descChildren = statisticBlockDescription.children;
      // replacing the title with  h2
      const titleElement = descChildren[0];
      if (titleElement) {
        const titleText = titleElement.textContent;
        const titleHtml = Heading({
          level: 3,
          text: titleText,
          className: 'statistics-title',
        });
        const parsedHtml = stringToHTML(titleHtml);
        moveInstrumentation(titleElement, parsedHtml);
        titleElement.outerHTML = parsedHtml.outerHTML;
      }
  
      // adding class  statistics-description to description
      const descriptionChildren = descChildren[1]?.querySelectorAll("p");
      const readMoreContent = descChildren[2];
      const readLessContent = descChildren[3];
      if (descriptionChildren?.length > 1) {
        for (let i = 1; i < descriptionChildren.length; i += 1) {
          descriptionChildren[i].classList.add('hide');
        }
        const readMoreElement = document.createElement('button');
        const readLessElement = document.createElement('button');
        moveInstrumentation(readMoreContent, readMoreElement);
        moveInstrumentation(readLessContent, readLessElement);
  
        readMoreElement.textContent = readMoreContent?.textContent ?? 'Read More';
  
        // removing the readMoreContent
        readMoreContent.remove();
  
        readMoreElement.onclick = (e) => {
          e.preventDefault();
          for (let i = 1; i < descriptionChildren.length; i += 1) {
            descriptionChildren[i].classList.remove('hide');
          }
          readMoreElement.classList.add('hide');
          readLessElement.classList.remove('hide');
        };
        statisticBlockDescription.appendChild(readMoreElement);
  
        readLessElement.textContent = readLessContent?.textContent ?? 'Read Less';
        // removing the readLessContent
        readLessContent.remove();
  
        readLessElement.classList.add('hide');
        readLessElement.onclick = (e) => {
          e.preventDefault();
          for (let i = 1; i < descriptionChildren.length; i += 1) {
            descriptionChildren[i].classList.add('hide');
          }
          readMoreElement.classList.remove('hide');
          readLessElement.classList.add('hide');
        };
        statisticBlockDescription.appendChild(readLessElement);
      } else {
        readMoreContent?.classList.add('hide');
        readLessContent?.classList.add('hide');
      }
  
      block.appendChild(statisticBlockDescription);
    }
  }
  block.classList.add('container-xl', 'container-lg', 'container-md', 'container-sm');
  blockChilden[0]?.remove();

  block.querySelectorAll('.statistics-title').forEach(statsTitle => {
    if (!statsTitle.textContent.trim()) {
      statsTitle.style.display = 'none';
    }
  });
}
