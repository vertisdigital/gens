export default function decorate(block) {
  block.classList.add('container');
  let separatorLine = block.querySelector('.separator-line');
  if (!separatorLine) {
    separatorLine = document.createElement('div');
    separatorLine.className = 'separator-line container';
  }
  block.textContent = '';
  block.appendChild(separatorLine);
}