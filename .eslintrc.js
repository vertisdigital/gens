module.exports = {
  root: true,
  extends: [
    'airbnb-base',
    'plugin:json/recommended',
    'plugin:xwalk/recommended',
  ],
  env: {
    browser: true,
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    allowImportExportEverywhere: true,
    sourceType: 'module',
    requireConfigFile: false,
  },
  rules: {
    'import/extensions': ['error', { js: 'always' }], // require js file extensions in imports
    'linebreak-style': ['error', 'unix'], // enforce unix linebreaks
    'no-param-reassign': [2, { props: false }], // allow modifying properties of param
    'xwalk/max-cells': ['error', {
      '*': 10,
    }],
    'no-console': 'warn', // Change to warn instead of error
    'no-await-in-loop': 'off', // Disable if you need await in loops
    'import/no-extraneous-dependencies': ['error', {
      devDependencies: ['**/scripts/**'], // Allow dev dependencies in scripts folder
    }],
  },
};
