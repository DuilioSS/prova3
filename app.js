// Importa Express.js
const express = require('express');
const app = express();

app.use(express.json());

// Porta e token di verifica
const port = process.env.PORT || 3000;
const verifyToken = process.env.VERIFY_TOKEN || 'mio_token_segreto';

// Endpoint GET: verifica Webhook Meta/WhatsApp
app.get('/', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === verifyToken && challenge) {
    console.log(' WEBHOOK VERIFICATO');
    return res.status(200).send(challenge);
  }

  // Se apri l'URL nel browser senza query di verifica, rispondi 200 per evitare confusione
  return res.status(200).send('OK');
});

// Endpoint POST: ricezione eventi Webhook
app.post('/', (req, res) => {
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
  console.log(`\n Webhook ricevuto alle ${timestamp}`);
  console.log(JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

// Endpoint salute (utile per test)
app.get('/health', (req, res) => res.status(200).send('healthy'));

app.listen(port, () => {
  console.log(` Server avviato sulla porta ${port}`);
});
