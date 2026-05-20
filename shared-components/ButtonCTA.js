export default function Heading({ level = 1, text, className = '' }) {
  const Tag = `h${level}`;
  return `
    <${Tag} class="${className}">
      ${text}
    </${Tag}>
  `;
}
