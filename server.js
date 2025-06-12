import express from "express";
import bodyParser from "body-parser";
import qr from "qr-image";
import fs from "fs";
import path from 'path';


const app = express();
const PORT = 3000;
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/generate', (req, res) => {
  const url = req.body.url;

  const qr_png = qr.image(url, { type: 'png' });
  const qrPath = path.join(__dirname, 'public', 'i_love_qr.png');
  qr_png.pipe(fs.createWriteStream(qrPath));
  

  fs.writeFile('URL.txt', url, (err) => {
    if (err) throw err;
    console.log('URL saved to URL.txt');
  });

  res.send(`
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; width: 100vw; font-family: sans-serif; background-color: aliceblue;">
      <h2>QR Code Generated:</h2>
      <img src="/i_love_qr.png" alt="QR Code" />
      <br><br>
      <a href="/" style="text-decoration: none; color: white; background-color: #007bff; padding: 8px 16px; border-radius: 5px;">Generate another</a>
    </div>
  `);
  
  
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
