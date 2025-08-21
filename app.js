// Importa il framework Express
const express = require('express');
const app = express();

// Middleware per permettere a Express di interpretare il corpo delle richieste POST in formato JSON
app.use(express.json());

// Imposta la porta del server. Render fornirà la sua, altrimenti usa 3000 per i test locali.
const PORT = process.env.PORT || 3000;

// ✅ Legge il token di verifica dalle variabili d'ambiente configurate su Render
// Questa è la maniera più sicura e corretta.
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

// Se il token non è stato impostato nelle variabili d'ambiente, ferma il server e avvisa.
if (!VERIFY_TOKEN) {
  console.error("ERRORE: VERIFY_TOKEN non è stato impostato nelle variabili d'ambiente.");
  process.exit(1); // Esce dal processo con un codice di errore
}

// ✅ Rotta radice ("/") -> Risolve il "Cannot GET /"
// Usata per un semplice controllo per vedere se il server è online.
app.get('/', (req, res) => {
  res.send('Server del Webhook per Meta è attivo! 🚀');
});

// ✅ Rotta per la verifica del Webhook (richiesta GET da Meta)
// Questa rotta è dedicata SOLO alla verifica iniziale.
app.get('/webhook', (req, res) => {
  console.log('Ricevuta richiesta di verifica GET al webhook...');

  // Estrae i parametri inviati da Meta
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  // Controlla se 'mode' è 'subscribe' e se il token corrisponde a quello che abbiamo impostato
  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('✅ Webhook verificato con successo.');
      // Risponde con il 'challenge' per confermare la verifica a Meta
      res.status(200).send(challenge);
    } else {
      // Se il token o il 'mode' non corrispondono, rifiuta la richiesta
      console.log('❌ Verifica webhook fallita: Token o mode non validi.');
      res.sendStatus(403); // Forbidden
    }
  } else {
      console.log('❌ Verifica webhook fallita: Parametri mancanti.');
      res.sendStatus(400); // Bad Request
  }
});

// ✅ Rotta per ricevere gli eventi/messaggi dal webhook (richiesta POST da Meta)
// Qui arriveranno i messaggi, le foto, gli audio, ecc.
app.post('/webhook', (req, res) => {
  console.log('Ricevuto evento POST da Meta...');
  console.log(JSON.stringify(req.body, null, 2));

  // ------------------------------------------------------------------
  // QUI INIZIA LA LOGICA PER GESTIRE I MESSAGGI, FOTO, VIDEO, AUDIO
  // Per ora, ci limitiamo a confermare la ricezione.
  // ------------------------------------------------------------------

  // Invia subito una risposta 200 OK a Meta per far sapere che hai ricevuto l'evento.
  // Se non rispondi velocemente, Meta penserà che il tuo webhook non funziona.
  res.sendStatus(200);
});

// Avvia il server
app.listen(PORT, () => {
  console.log(`🚀 Server in ascolto sulla porta ${PORT}`);
});