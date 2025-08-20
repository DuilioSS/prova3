// Importa Express.js
const express = require('express');

// Crea l'app Express
const app = express();

// Middleware per analizzare i corpi JSON
app.use(express.json());

// Porta e token di verifica
const port = process.env.PORT || 3000;
const verifyToken = process.env.VERIFY_TOKEN || "mio_token_segreto";

// Endpoint GET per la verifica webhook
app.get('/', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('✅ WEBHOOK VERIFICATO');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Endpoint POST per ricevere webhook
app.post('/', (req, res) => {
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
  console.log(`\n\n📩 Webhook ricevuto alle ${timestamp}`);
  console.log(JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

// Avvia il server
app.listen(port, () => {
  console.log(`🚀 Server avviato sulla porta ${port}`);
});
