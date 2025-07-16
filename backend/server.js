const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const nonces = {}; // зберігатимемо nonce для адрес

// Генератор nonce
function generateNonce() {
  return crypto.randomBytes(16).toString('hex'); // випадковий 32-символьний код
}

app.get('/', (req, res) => {
  res.send('Wallet Auth Backend is running');
});

// 1. Ендпоінт видачі nonce
app.get('/api/auth/nonce', (req, res) => {
  const address = req.query.address;
  if (!address) return res.status(400).json({ error: 'Address required' });
  const nonce = generateNonce();
  nonces[address] = nonce;
  res.json({ nonce });
});

// 2. Ендпоінт перевірки підпису
app.post('/api/auth/verify', (req, res) => {
  const { address, signature } = req.body;
  if (!address || !signature) return res.status(400).json({ error: 'Address and signature required' });

  const nonce = nonces[address];
  if (!nonce) return res.status(400).json({ error: 'Nonce not found' });

  // Тут треба перевірити підпис користувача над nonce
  // Для Bitcoin/Ordinals — треба використовувати бібліотеку для перевірки Bitcoin-підписів
  // Але поки що просто для прикладу — вважаємо, що підпис вірний
  // TODO: додати перевірку підпису за допомогою бібліотеки bitcoinjs-message чи іншої

  // Після перевірки видаляємо nonce, щоб не можна було повторно використати
  delete nonces[address];

  // Генеруємо простий токен (наприклад, випадковий рядок)
  const token = generateNonce();

  res.json({ token });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
