// Importazione del framework Express
const express = require("express");
const app = express();

// Middleware per interpretare il corpo delle richieste POST in formato JSON
// Fondamentale per ricevere i messaggi da Meta
app.use(express.json());

// Imposta la porta del server, usando quella fornita da Render o la 3000 come default
const PORT = process.env.PORT || 3000;

// Token di verifica. Scegli una stringa complessa e segreta.
// DEVE essere la stessa che inserisci nel pannello di Meta for Developers.
const VERIFY_TOKEN = "il_tuo_token_super_segreto_12345";

// ✅ Route radice ("/") per testare se il server è online
// Risponde al problema "Cannot GET /"
app.get("/", (req, res) => {
  res.send("Il server del webhook è attivo e in ascolto! 🚀");
});

// ✅ Route per la verifica del webhook (richiesta GET da Meta)
app.get("/webhook", (req, res) => {
  console.log("Richiesta GET di verifica ricevuta da Meta.");

  // Estrai i parametri dalla query string della richiesta
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  // Verifica che 'hub.mode' sia 'subscribe' e che il token corrisponda
  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("Webhook verificato con successo! ✅");
      // Rispondi con il valore di 'hub.challenge' per completare la verifica
      res.status(200).send(challenge);
    } else {
      // Se il token o la modalità non sono corretti, rifiuta la richiesta
      console.log("Verifica fallita: token o mode non validi.");
      res.sendStatus(403); // Forbidden
    }
  } else {
      // Se mancano i parametri, rispondi con un errore
      console.log("Verifica fallita: parametri mancanti.");
      res.sendStatus(400); // Bad Request
  }
});

// ✅ Route per ricevere gli eventi/messaggi dal webhook (richiesta POST da Meta)
app.post("/webhook", (req, res) => {
  // Stampa il corpo della richiesta per debug
  console.log("Richiesta POST ricevuta:", JSON.stringify(req.body, null, 2));

  // Qui inserirai la logica per processare i messaggi ricevuti

  // Rispondi subito con 200 OK per confermare la ricezione a Meta
  res.sendStatus(200);
});

// Avvia il server sulla porta specificata
app.listen(PORT, () => {
  console.log(`🚀 Server in ascolto sulla porta ${PORT}`);
});