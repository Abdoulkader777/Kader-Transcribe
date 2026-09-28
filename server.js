const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/plain; charset=utf-8"
  });

  res.end("KaderTranscribe serveur OK ✅");
});

server.listen(3000, () => {
  console.log("Serveur lancé sur le port 3000");
});
