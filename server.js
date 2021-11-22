const http = require("http");
const fs = require('fs').promises;

const host = '0.0.0.0';
const port = 80;

const requestListener = function (req, res) {
    fs.readFile("./index.html")
        .then(contents => {
            res.setHeader("Content-Type", "text/html");
            res.writeHead(200);
            res.end(contents);
        })
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});