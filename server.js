const http = require("http");

const port = process.env.PORT || 10000;

const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kader Transcribe</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #f4f6f8;
      margin: 0;
      padding: 20px;
      text-align: center;
    }

    .container {
      max-width: 500px;
      margin: 40px auto;
      background: white;
      padding: 25px;
      border-radius: 20px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }

    h1 {
      margin-bottom: 10px;
    }

    input {
      width: 100%;
      margin: 20px 0;
    }

    button {
      width: 100%;
      padding: 15px;
      border: none;
      border-radius: 12px;
      background: #111827;
      color: white;
      font-size: 16px;
      cursor: pointer;
    }

    #result {
      margin-top: 20px;
      padding: 15px;
      background: #f1f5f9;
      border-radius: 12px;
      min-height: 100px;
      text-align: left;
    }
  </style>
</head>

<body>

  <div class="container">
    <h1>🎙️ Kader Transcribe</h1>
    <p>Transforme ton audio en texte</p>

    <input type="file" id="audio" accept="audio/*">

    <button onclick="transcrire()">
      📝 Transcrire l'audio
    </button>

    <div id="result">
      Le texte apparaîtra ici...
    </div>
  </div>

  <script>
    function transcrire() {
      const fichier = document.getElementById("audio").files[0];
      const result = document.getElementById("result");

      if (!fichier) {
        result.innerText = "Choisis d'abord un fichier audio.";
        return;
      }

      result.innerText =
        "Audio sélectionné : " + fichier.name +
        "\\n\\nLa fonction de transcription sera ajoutée à l'étape suivante.";
    }
  </script>

</body>
</html>
`;

const server = http.createServer((req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/html; charset=utf-8"
  });

  res.end(html);
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Kader Transcribe lancé sur le port ${port}`);
});
