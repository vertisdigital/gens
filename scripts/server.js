const express = require('express');
const path = require('path');
const WebSocket = require('ws');
const chokidar = require('chokidar');

const app = express();
const port = 3000;

// Serve static files
app.use(express.static(path.join(__dirname, '..')));

// Start HTTP server
app.listen(port, () => {
    console.log(`Local development server running at http://localhost:${port}`);
});

// WebSocket server for hot reload
const wss = new WebSocket.Server({ port: 3001 });

// Watch for file changes
chokidar.watch(['blocks/**/*'], {
    ignored: /(^|[\/\\])\../,
    persistent: true
}).on('change', (filepath) => {
    const blockName = filepath.split(path.sep)[1];
    console.log(`File changed: ${filepath}`);
    
    // Notify clients
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                type: 'reload',
                blockName
            }));
        }
    });
});