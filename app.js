// Importa Express.js
const express = require('express');
const app = express();

// Middleware per leggere JSON
app.use(express.json());

// Porta e token di verifica (Render assegna PORT automaticamente)
const port = process.env.PORT || 3000;
const verifyToken = process.env.VERIFY_TOKEN || 'mio_token_segreto';

// Endpoint GET: verifica Webhook Meta/WhatsApp
app.get('/', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === verifyToken && challenge) {
    console.log('✅ WEBHOOK VERIFICATO');
    return res.status(200).send(challenge);
  }

  // Risposta normale se non è una verifica
  return res.status(200).send('OK');
});

// Endpoint POST: ricezione eventi Webhook
app.post('/', (req, res) => {
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
  console.log(`📩 Webhook ricevuto alle ${timestamp}`);
  console.log(JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

// Endpoint salute (utile per test)
app.get('/health', (req, res) => res.status(200).send('✅ healthy'));

// Avvio server
app.listen(port, () => {
  console.log(`🚀 Server avviato sulla porta ${port}`);
});
