import { moveInstrumentation } from '../../scripts/scripts.js';
import Heading from '../../shared-components/Heading.js';
import stringToHTML from '../../shared-components/Utility.js';

export default function decorate(block) {
  const blockChilden = [].slice.call(block.children);
  const isStaticFinanicialVariation = block.classList.contains(
    'statistics-financial-variation',
  );
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
    blockChilden[2].remove();
    const featureItems = isStaticFinanicialVariation
      ? blockChilden.slice(2)
      : blockChilden.slice(3);

    const featureContainer = document.createElement('div');
    featureContainer.className = 'row statistics-row';

    featureItems.forEach((featureItem) => {
      featureContainer.appendChild(featureItem);
      featureItem.classList.add(
        'col-xl-4',
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

    if (
      statisticBlockDescription
      && statisticBlockDescription.textContent.trim() !== ''
    ) {
      statisticBlockDescription.classList.add('statistics-description-wrapper');
      const descChildren = statisticBlockDescription.children;
      // replacing the title with h2
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

      // Handle description text with character limit
      const descriptionParagraph = descChildren[1]?.querySelector('p');
      const readMoreContent = descChildren[2];
      const readLessContent = descChildren[3];

      if (descriptionParagraph) {
        const fullHtml = descriptionParagraph.innerHTML;

        // Find the position of first <br> tag
        const firstBrIndex = fullHtml.indexOf('<br>');

        // Only proceed with truncation if there's a <br> tag
        if (firstBrIndex !== -1) {
          // Create container for truncated and full text
          const textContainer = document.createElement('div');
          textContainer.className = 'description-text-container';

          // Create elements for truncated and full text
          const truncatedElement = document.createElement('p');
          truncatedElement.innerHTML = fullHtml.substring(0, firstBrIndex);
          truncatedElement.className = 'truncated-text';

          const fullTextElement = document.createElement('p');
          fullTextElement.innerHTML = fullHtml;
          fullTextElement.className = 'full-text hide';

          textContainer.appendChild(truncatedElement);
          textContainer.appendChild(fullTextElement);

          // Replace original paragraph with our container
          descriptionParagraph.replaceWith(textContainer);

          const readMoreElement = document.createElement('button');
          const readLessElement = document.createElement('button');
          moveInstrumentation(readMoreContent, readMoreElement);
          moveInstrumentation(readLessContent, readLessElement);

          readMoreElement.textContent = readMoreContent?.textContent ?? 'Read More';
          readMoreContent.remove();

          readMoreElement.onclick = (e) => {
            e.preventDefault();
            truncatedElement.classList.add('hide');
            fullTextElement.classList.remove('hide');
            readMoreElement.classList.add('hide');
            readLessElement.classList.remove('hide');
          };
          statisticBlockDescription.appendChild(readMoreElement);

          readLessElement.textContent = readLessContent?.textContent ?? 'Read Less';
          readLessContent.remove();

          readLessElement.classList.add('hide');
          readLessElement.onclick = (e) => {
            e.preventDefault();
            truncatedElement.classList.remove('hide');
            fullTextElement.classList.add('hide');
            readMoreElement.classList.remove('hide');
            readLessElement.classList.add('hide');
          };
          statisticBlockDescription.appendChild(readLessElement);
        } else {
          readMoreContent?.classList.add('hide');
          readLessContent?.classList.add('hide');
        }
      }

      block.appendChild(statisticBlockDescription);
    }
  }
  block.classList.add('container');
  blockChilden[0]?.remove();

  block.querySelectorAll('.statistics-title').forEach((statsTitle) => {
    if (!statsTitle.textContent.trim()) {
      statsTitle.style.display = 'none';
    }
  });
}
