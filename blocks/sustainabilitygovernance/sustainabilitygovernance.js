export default function decorate(block) {
  const [title, ...cards] = [...block.children];
  //section title, cards with left image, title and description
  const conent = `<div class='governance-section container'>
          <div class='governance-title'>${title.outerHTML}</div>
          ${cards
            .map((cardItem) => {
              const [cardtitle, cardImg, cardDesc] = cardItem.children;
              return `
                  <div class='governance-card'>
                      <div class='governance-img'>
                        <img src='../../icons/${cardtitle.textContent.trim()}.svg' alt='${cardtitle.textContent.trim()}'>
                      </div>
                      <div class='governance-content'>
                          <div class='governance-content-title'>${
                            cardImg.outerHTML
                          }</div>
                          <div class='governance-content-desc'>${
                            cardDesc.outerHTML
                          }</div>
                      </div>
                 </div>`;
            })
            .join("")}
      </div>`;
  block.innerHTML = conent;
}
