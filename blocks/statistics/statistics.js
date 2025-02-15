import { moveInstrumentation } from '../../scripts/scripts.js';
import Heading from '../../shared-components/Heading.js';
import stringToHTML from '../../shared-components/Utility.js';

export default function decorate(block) {
// processing the sesction title
  const heading = block.querySelector('[data-aue-prop="heading"]');
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

  // finding the feature items
  const featureItems = block.querySelectorAll('[data-aue-model="featureItem"]');

  const featureContainer = document.createElement('div');
  featureContainer.className = 'row statistics-row';

  featureItems.forEach((featureItem) => {
    featureContainer.appendChild(featureItem);
    featureItem.classList.add(
      'col-xl-3',
      'col-lg-3',
      'col-md-3',
      'col-sm-4',
      'feature-item',
    );
    featureItem
      .querySelector('[data-aue-prop="feature-title"]')
      ?.classList.add('statistic-item');
    featureItem
      .querySelector('[data-aue-prop="feature-heading"]')
      ?.classList.add('text-container');
  });

  block.appendChild(featureContainer);

  // processing the statistics description block
  const statisticBlockDescription = block.querySelector(
    '[data-aue-model="statisticsDescription"]',
  );

  if (statisticBlockDescription) {
    statisticBlockDescription.classList.add('statistics-description-wrapper');
    // replacing the title with  h2
    const titleElement = statisticBlockDescription.querySelector(
      '[data-aue-prop="title"]',
    );
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
    const descriptionChildren = statisticBlockDescription.querySelector(
      '[data-aue-prop="description"]',
    )?.children;
     const readMoreContent = statisticBlockDescription.querySelector(
        '[data-aue-prop="readMoreLabel"]',
      );
      const readLessContent = statisticBlockDescription.querySelector(
        '[data-aue-prop="readLessLabel"]',
      );
    if (descriptionChildren?.length > 1) {
      for (let i = 1; i < descriptionChildren.length; i += 1) {
        descriptionChildren[i].classList.add('hide');
      }
      const readMoreElement = document.createElement('button');
      const readLessElement = document.createElement('button');
      moveInstrumentation(readMoreContent, readMoreElement);
      moveInstrumentation(readLessContent, readLessElement);

      readMoreElement.textContent = statisticBlockDescription.readMoreContent?.textContent ?? 'Read More';

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

      readLessElement.textContent = readLessContent?.textContentt ?? 'Read Less';
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
    }else{
        readMoreContent?.classList.add('hide');
        readLessContent?.classList.add('hide');
      
    }

    block.appendChild(statisticBlockDescription);
    block.classList.add('container-xl', 'container-lg', 'container-md', 'container-sm');
  }
}
