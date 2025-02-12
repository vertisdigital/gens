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
  featureContainer.className = 'row';

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
      .classList.add('statistic');
    featureItem
      .querySelector('[data-aue-prop="feature-heading"]')
      .classList.add('text-container');
  });

  // processing the statistics description block
  const statisticBlock = block.querySelector(
    '[data-aue-model="statisticsDescription"]',
  );

  // insert the feature container as first element
  // block.insertBefore(featureContainer, statisticBlock);
  block.appendChild(featureContainer);
  if (statisticBlock) {
    // replacing the title with  h2
    const titleElement = statisticBlock.querySelector(
      '[data-aue-prop="title"]',
    );
    if (titleElement) {
      const titleText = titleElement.textContent;
      const header = document.createElement('header');
      moveInstrumentation(titleElement, header);
      const titleHtml = Heading({
        level: 3,
        text: titleText,
        className: 'statistics-title',
      });
      const parsedHtml = stringToHTML(titleHtml);
      header.append(parsedHtml);
      titleElement.outerHTML = header.outerHTML;
    }

    // adding class  statistics-description to description
    const descriptionElement = statisticBlock.querySelector(
      '[data-aue-prop="description"]',
    );
    if (descriptionElement) {
      descriptionElement.classList.add('statistics-description');
    }

    const descriptionChildren = statisticBlock.querySelector(
      '[data-aue-prop="description"]',
    )?.children;

    if (descriptionChildren?.length > 1) {
      for (let i = 1; i < descriptionChildren.length; i += 1) {
        descriptionChildren[i].classList.add('hide');
      }

      const readMoreContent = statisticBlock.querySelector(
        '[data-aue-prop="readMoreLabel"]',
      );
      const readMoreElement = document.createElement('a');
      const readLessElement = document.createElement('a');

      readMoreElement.setAttribute('href', '#');
      readMoreElement.setAttribute('data-aue-prop', 'readMoreLabel');
      readMoreElement.textContent = statisticBlock.readMoreContent?.textContent ?? 'Read More';
      readMoreElement.onclick = (e) => {
        e.preventDefault();
        for (let i = 1; i < descriptionChildren.length; i += 1) {
          descriptionChildren[i].classList.remove('hide');
        }
        readMoreElement.classList.add('hide');
        readLessElement.classList.remove('hide');
      };
      statisticBlock.appendChild(readMoreElement);
      readMoreContent.remove();

      const readLessContent = statisticBlock.querySelector(
        '[data-aue-prop="readLessLabel"]',
      );
      readLessElement.setAttribute('href', '#');
      readLessElement.setAttribute('data-aue-prop', 'readLessLabel');
      readLessElement.textContent = readLessContent?.textContentt ?? 'Read Less';
      readLessElement.classList.add('hide');
      readLessElement.onclick = (e) => {
        e.preventDefault();
        for (let i = 1; i < descriptionChildren.length; i += 1) {
          descriptionChildren[i].classList.add('hide');
        }
        readMoreElement.classList.remove('hide');
        readLessElement.classList.add('hide');
      };
      statisticBlock.appendChild(readLessElement);
      readLessContent.remove();

      block.appendChild(statisticBlock);
      block.classList.add('container-xl','container-lg', 'container-md', 'container-sm');
    }
  }
}
