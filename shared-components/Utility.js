// convert string to HTML Element
function stringToHTML(str) {
  if(!str)
    return '';
  const parser = new DOMParser();
  const doc = parser.parseFromString(str, 'text/html');
  return doc.body.firstChild;
}

export default stringToHTML;
