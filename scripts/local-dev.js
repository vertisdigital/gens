import { loadMockContent } from './mock-data.js';

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
        // Get block name from URL parameter or default to 'columns'
        const urlParams = new URLSearchParams(window.location.search);
        const blockName = urlParams.get('block') || 'columns';
        
        // Load mock content
        const mockHtml = loadMockContent(blockName);
        this.mockContainer.innerHTML = mockHtml;
        
        // Add data attributes to simulate AEM environment
        this.mockContainer.setAttribute('data-aue-type', 'container');
        this.mockContainer.setAttribute('data-block-status', 'initialized');
    }

    async initializeBlocks() {
        const blocks = document.querySelectorAll('[data-block-name]');
        
        for (const block of blocks) {
            const blockName = block.getAttribute('data-block-name');
            try {
                // Dynamically import block module
                const module = await import(`../blocks/${blockName}/${blockName}.js`);
                if (module.default) {
                    // Store module reference
                    this.blockModules.set(blockName, module);
                    // Initialize block
                    module.default(block);
                }
            } catch (error) {
                console.error(`Error loading block ${blockName}:`, error);
            }
        }
    }

    setupHotReload() {
        if (process.env.NODE_ENV === 'development') {
            const ws = new WebSocket('ws://localhost:3001');
            ws.onmessage = async (event) => {
                const { type, blockName } = JSON.parse(event.data);
                
                if (type === 'reload') {
                    // Reload specific block if specified
                    if (blockName && this.blockModules.has(blockName)) {
                        const block = document.querySelector(`[data-block-name="${blockName}"]`);
                        if (block) {
                            // Clear module cache and reload
                            this.blockModules.delete(blockName);
                            const module = await import(`../blocks/${blockName}/${blockName}.js?t=${Date.now()}`);
                            if (module.default) {
                                module.default(block);
                            }
                        }
                    } else {
                        // Reload entire page if no specific block
                        window.location.reload();
                    }
                }
            };
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const localDev = new LocalDevelopment();
    localDev.init();
});