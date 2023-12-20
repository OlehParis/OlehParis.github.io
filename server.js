const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
   
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Routing
    if (req.method === 'GET') {
        
        if (req.url === '/') {
            req.url = '/index.html'; // Default to index.html
        } else if (req.url === '/gallery') {
            // Redirect to gallery.html
            res.writeHead(302, { 'Location': '/gallery.html' });
            res.end();
            return;
        }else if (req.url === '/aboutus') {
            // Redirect to aboutus.html
            res.writeHead(302, { 'Location': '/aboutus.html' });
            res.end();
            return;
        }else if (req.url === '/contactus') {
            // Redirect to conctatus.html
            res.writeHead(302, { 'Location': '/contactus.html' });
            res.end();
            return;
        }
        else if (req.url === '/home') {
            // Redirect to back home
            res.writeHead(302, { 'Location': '/index.html' });
            res.end();
            return;
        }

        const filePath = path.join(__dirname, req.url);

        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found');
            } else {
                const contentType = getContentType(filePath);
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(data);
            }
        });

    } else if (req.method === 'POST') {
        // Handling POST requests
        if (req.url === '/submitForm') {
            handleFormSubmission(req, res);
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
        }
    } else {
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('Method Not Allowed');
    }
    
});

// Start the server on port 5001
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

function handleFormSubmission(req, res) {
    let body = '';

    req.on('data', (chunk) => {
        body += chunk;
    });

    req.on('end', () => {
        const formData = qs.parse(body);

        // Process the form data as needed
        console.log('Form Data:', formData);

        // You can send a response to the client
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Form submission successful!' }));
    });
}
// Function to determine the content type based on file extension
function getContentType(filePath) {
    const extname = path.extname(filePath);
    switch (extname) {
        case '.html':
            return 'text/html';
        case '.css':
            return 'text/css';
        case '.js':
            return 'text/javascript';
        case '.png':
            return 'image/png';
        case '.jpg':
        case '.jpeg':
            return 'image/jpeg';
        default:
            return 'application/octet-stream';
    }
}
