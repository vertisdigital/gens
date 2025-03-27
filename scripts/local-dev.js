import { loadMockContent } from './mock-data.js';
import { errorLogger as logger} from './logger.js';

class LocalDevelopment {
  constructor() {
    this.mockContainer = document.getElementById('mock-content-container');
    this.blockModules = new Map();
  }

  async init() {
    await this.loadMockContent();
    await this.initializeBlocks();
    this.setupHotReload();
  }

  async loadMockContent() {
    const urlParams = new URLSearchParams(window.location.search);
    const blockName = urlParams.get('block') || 'columns';

    const mockHtml = await loadMockContent(blockName);
    this.mockContainer.innerHTML = mockHtml;

    this.mockContainer.setAttribute('data-aue-type', 'container');
    this.mockContainer.setAttribute('data-block-status', 'initialized');
  }

  async initializeBlocks() {
    const blocks = document.querySelectorAll('[data-block-name]');

    await Promise.all(
      Array.from(blocks).map(async (block) => {
        const blockName = block.getAttribute('data-block-name');
        try {
          const blockNameFromUrl = new URL(window.location.href).searchParams.get('block') || blockName;
          const module = await import(`../blocks/${blockNameFromUrl}/${blockNameFromUrl}.js`);
          if (module.default) {
            this.blockModules.set(blockName, module);
            module.default(block);
          }
        } catch (error) {
          logger.error(`Error loading block ${blockName}:, ${error}`);
        }
      }),
    );
  }

  setupHotReload() {
    if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
      const ws = new WebSocket('ws://localhost:3001');
      ws.onmessage = async (event) => {
        const { type, blockName } = JSON.parse(event.data);

        if (type === 'reload') {
          if (blockName && this.blockModules.has(blockName)) {
            const block = document.querySelector(`[data-block-name="${blockName}"]`);
            if (block) {
              this.blockModules.delete(blockName);
              const module = await import(`../blocks/${blockName}/${blockName}.js?t=${Date.now()}`);
              if (module.default) {
                module.default(block);
              }
            }
          } else {
            window.location.reload();
          }
        }
      };
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const localDev = new LocalDevelopment();
  localDev.init();
});

console.log('Development server started');
