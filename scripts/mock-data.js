export const MOCK_CONTENT = {
  columns: `<div>Add columns mark up here</div>
`,
  'about-us': `<div>Add about-us mark up here</div>
`,
  // Add other block mock content

  herobanner: `<div>Add hero banner mark up here</div>
`,
  tiles: `<div>Add tiles mark up here</div>
`,
  // Add other block mock content
  listing: `<div>Add listing mark up here</div>
`,
  // Add other block mock content

  footer: `<div>Add footer mark up here</div>
`,
  header: `<div>Add header mark up here</div>
`,
  projectslist: `<div>Add projectslist mark up here</div>
`,
};

export function loadMockContent(blockName) {
  return MOCK_CONTENT[blockName] || '';
}
