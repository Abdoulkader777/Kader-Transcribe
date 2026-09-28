const http = require("http");
const formidable = require("formidable");
const OpenAI = require("openai");
const fs = require("fs");

const port = process.env.PORT || 10000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

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
  padding: 20px;
  text-align: center;
}
.container {
  max-width: 500px;
  margin: 40px auto;
  background: white;
  padding: 25px;
  border-radius: 20px;
}
input, button {
  width: 100%;
  margin-top: 15px;
  padding: 14px;
  box-sizing: border-box;
}
button {
  background: #111827;
  color: white;
  border: none;
  border-radius: 10px;
}
#result {
  margin-top: 20px;
  padding: 15px;
  background: #f1f5f9;
  border-radius: 10px;
  text-align: left;
  white-space: pre-wrap;
}
</style>
</head>

<body>
<div class="container">
<h1>🎙️ Kader Transcribe</h1>
<p>Transforme ton audio en texte</p>

<form id="form">
<input type="file" id="audio" name="audio" accept="audio/*" required>
<button type="submit">📝 Transcrire l'audio</button>
</form>

<div id="result">Le texte apparaîtra ici...</div>
</div>

<script>
document.getElementById("form").addEventListener("submit", async function(e) {
  e.preventDefault();

  const file = document.getElementById("audio").files[0];
  const result = document.getElementById("result");

  if (!file) {
    result.textContent = "Choisis un fichier audio.";
    return;
  }

  result.textContent = "⏳ Transcription en cours...";

  const data = new FormData();
  data.append("audio", file);

  try {
    const response = await fetch("/transcribe", {
      method: "POST",
      body: data
    });

    const json = await response.json();

    if (json.text) {
      result.textContent = json.text;
    } else {
      result.textContent = "Erreur : " + (json.error || "transcription impossible");
    }
  } catch (error) {
    result.textContent = "Erreur de connexion au serveur.";
  }
});
</script>

</body>
</html>
`;

const server = http.createServer((req, res) => {

  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8"
    });
    res.end(html);
    return;
  }

  if (req.method === "POST" && req.url === "/transcribe") {

    const form = formidable({
      uploadDir: "/tmp",
      keepExtensions: true
    });

    form.parse(req, async (err, fields, files) => {

      if (err) {
        res.writeHead(500, {
          "Content-Type": "application/json"
        });
        res.end(JSON.stringify({ error: "Erreur lors de l'envoi du fichier." }));
        return;
      }

      try {
        const audioFile = Array.isArray(files.audio)
          ? files.audio[0]
          : files.audio;

        const transcription = await openai.audio.transcriptions.create({
          file: fs.createReadStream(audioFile.filepath),
          model: "gpt-4o-mini-transcribe"
        });

        fs.unlink(audioFile.filepath, () => {});

        res.writeHead(200, {
          "Content-Type": "application/json"
        });

        res.end(JSON.stringify({
          text: transcription.text
        }));

      } catch (error) {

        console.error(error);

        res.writeHead(500, {
          "Content-Type": "application/json"
        });

        res.end(JSON.stringify({
          error: "La transcription a échoué."
        }));
      }
    });

    return;
  }

  res.writeHead(404);
  res.end("Page introuvable");
});

server.listen(port, "0.0.0.0", () => {
  console.log("Kader Transcribe lancé sur le port " + port);
});
