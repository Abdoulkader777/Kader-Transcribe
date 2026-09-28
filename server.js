const http = require("http");

const port = process.env.PORT || 10000;

const server = http.createServer((req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/plain; charset=utf-8"
  });

  res.end("KaderTranscribe serveur OK ✅");
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Serveur lancé sur le port ${port}`);
});
