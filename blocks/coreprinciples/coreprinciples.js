import ImageComponent from '../../shared-components/ImageComponent.js';
import stringToHtml from '../../shared-components/Utility.js';

export default function decorate(block) {
  // Get the inner block that has the coreprinciples class
  const coreBlock = block;
  if (!coreBlock) return;

  // Add container classes for responsive layout
  const wrapper = document.createElement('div');
  wrapper.classList.add('coreprinciples');
  
  const removeBorderBottom={
    "esg":true
  }
  let pathname=window.location.pathname.split('/')
  pathname=pathname[pathname.length-1]
  
  if(removeBorderBottom[pathname]){
    wrapper.setAttribute('id','remove-border-bottom')
  }
  
  const container = document.createElement('div');
  wrapper.appendChild(container);
  container.className = 'container';

  const row = document.createElement('div');
  row.className = 'row';

  // Convert each item to use proper semantic structure
  const items = [...coreBlock.querySelectorAll('[data-aue-model="coreprinciple"], [data-gen-model="featureItem"]')];
  const isFourCards = items.length === 4
  const isMoreThenSix = items.length >= 6
  const isSingleCard = items.length === 1
  
  items.forEach((item) => {
    // Add responsive column classes as per requirements
    const col = document.createElement('div');
    col.className = isSingleCard ?'principles-item': `${!isFourCards ? 'col-xl-4' : ''} col-md-3 col-sm-4 principles-item`;
    // Get the icon URL and alt text from anchor
    const iconLink = item.querySelector('a');
    const iconUrl = iconLink?.href || '';
    const altText = iconLink?.title || '';  // Get alt text from anchor title

    // Create icon wrapper with authoring attributes
    const iconWrapper = document.createElement('div');
    iconWrapper.className = 'icon-wrapper';
    iconWrapper.setAttribute('aria-hidden', 'true');

    // Preserve icon wrapper data-aue attributes from original structure
    const originalIconWrapper = iconLink?.parentElement;
    if (originalIconWrapper) {
      const iconAttributes = [...originalIconWrapper.attributes].filter((attr) => attr.name.startsWith('data-aue-'));
      iconAttributes.forEach((attr) => {
        iconWrapper.setAttribute(attr.name, attr.value);
      });
    }

    if (iconUrl) {
      const picture = ImageComponent({
        src: iconUrl,
        alt: altText,  // Use the alt text from anchor title
        className: 'enquiry-image',
        breakpoints: {
          mobile: {
            width: 768,
            src: `${iconUrl}`,
          },
          tablet: {
            width: 1024,
            src: `${iconUrl}`,
          },
          desktop: {
            width: 1920,
            src: `${iconUrl}`,
          },
        },
        lazy: true,
      });

      if (picture) {
        const imageElement = stringToHtml(picture);
        iconWrapper.append(imageElement);
      }
    }

    // Convert title to h3 with preserved authoring attributes
    const allDivElements = item.querySelectorAll('div');
    const title = allDivElements[1];
    if (title !== null) {
      const h3 = document.createElement('h3');
      h3.textContent = title.textContent;
      h3.className = 'coreprinciples-card-title';

      // Preserve title data-aue attributes
      const titleAttributes = [...title.attributes].filter((attr) => attr.name.startsWith('data-aue-'));
      titleAttributes.forEach((attr) => {
        h3.setAttribute(attr.name, attr.value);
      });
      title.replaceWith(h3);
    }

    // Preserve description data-aue attributes
    const description = allDivElements[2];
    if (description) {
      const descAttributes = [...description.attributes].filter((attr) => attr.name.startsWith('data-aue-') || attr.name.startsWith('data-richtext-'));
      descAttributes.forEach((attr) => {
        description.setAttribute(attr.name, attr.value);
      });
    }

    // Clean up original icon link
    iconLink?.parentElement.remove();

    // Insert icon wrapper at start
    item.insertBefore(iconWrapper, item.firstChild);

    // Wrap item in column and add to row
    if(isSingleCard){
      item.classList.add('core-principle-single-card')
      const [icon, ...restElement] = item.children
      icon.classList.add('icon-single-wrapper')
      const div = document.createElement('div')
      item.innerHTML=""
      item.append(icon)
      restElement.forEach((elm,index)=>{
        if(index===0){
          elm.classList.add('core-principle-single-card-line')
        }
        div.append(elm)
      })
      item.append(div)
    }
    col.appendChild(item.cloneNode(true));
    row.appendChild(col);
  });

  // Build the final structure
  container.appendChild(row);

  // Clear original content and append the new structure
  coreBlock.innerHTML = '';
  coreBlock.appendChild(wrapper);

  function handleLayout() {
    const childElement=row.children
    if (isFourCards) {
      if (window.innerWidth < 1024) {
        row.style.removeProperty('max-width')
        childElement[0].style.removeProperty('padding-left')
        childElement[childElement.length - 1].style.removeProperty('padding-right')
      } else {
        row.style.maxWidth = "736px"
        childElement[0].style.paddingLeft = window.innerWidth===1024 ? "12px" : "18px"
        childElement[childElement.length - 1].style.paddingRight = window.innerWidth === 1024 ? "12px" : "18px"
      }
    }
    if(isMoreThenSix){
      if (window.innerWidth < 1024) {
        childElement[0].style.removeProperty('padding-left')
        childElement[childElement.length - 1].style.removeProperty('padding-right')
      } else {
        childElement[0].style.paddingLeft = window.innerWidth===1024 ? "12px" : "18px"
        childElement[childElement.length - 1].style.paddingRight = window.innerWidth === 1024 ? "12px" : "18px"
      }      
    }
    if (isSingleCard){
      if (window.innerWidth < 767){
        row.querySelector('.core-principle-single-card').classList.remove('core-principle-single-card')
        row.querySelector('.icon-single-wrapper').classList.remove('icon-single-wrapper')
        row.querySelector('.core-principle-single-card-line').classList.remove('core-principle-single-card-line')
      }else{
        const singleCard = childElement[0].children[0]
        singleCard.classList.add('core-principle-single-card')
        singleCard.querySelector('.icon-wrapper').classList.add('icon-single-wrapper')
        singleCard.children[1].children[0].classList.add('core-principle-single-card-line')
      }
    }
  }
  handleLayout()
  window.addEventListener('resize',()=>{
    handleLayout()
  })
}
