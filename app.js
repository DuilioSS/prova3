const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// "Database" temporaneo in memoria
let users = [];
let passwords = [];

// Endpoint: Registrazione utente
app.post("/register", (req, res) => {
  const { email, password } = req.body;

  // Controllo se esiste già
  const exists = users.find(u => u.email === email);
  if (exists) {
    return res.status(400).json({ message: "Email già registrata" });
  }

  users.push({ email, password });
  res.json({ message: "Registrazione avvenuta con successo" });
});

// Endpoint: Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ message: "Credenziali errate" });
  }

  res.json({ message: "Login effettuato", email: user.email });
});

// Endpoint: Aggiungi password
app.post("/passwords", (req, res) => {
  const { email, service, password } = req.body;

  passwords.push({ email, service, password });
  res.json({ message: "Password salvata temporaneamente" });
});

// Endpoint: Recupera password per utente
app.get("/passwords/:email", (req, res) => {
  const email = req.params.email;
  const userPasswords = passwords.filter(p => p.email === email);
  res.json(userPasswords);
});

// Endpoint: Elimina password
app.delete("/passwords/:email/:service", (req, res) => {
  const { email, service } = req.params;
  passwords = passwords.filter(p => !(p.email === email && p.service === service));
  res.json({ message: "Password eliminata" });
});

// Endpoint salute (utile per test Render)
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// Avvio server
app.listen(PORT, () => {
  console.log(`✅ Server in ascolto sulla porta ${PORT}`);
});
