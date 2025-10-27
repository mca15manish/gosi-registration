const express = require('express');
const bodyParser = require('body-parser');
const QRCode = require('qrcode');
const path = require('path');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Route: Show registration form
app.get('/', (req, res) => {
  res.render('index');
});

// Route: Handle form submission
app.post('/register', async (req, res) => {
  const { firstName, lastName } = req.body;

  // ✅ Compact, easy-to-parse QR format
  const userData = `FN:${firstName}|LN:${lastName}`;

  try {
    const qrCodeData = await QRCode.toDataURL(userData);
    res.render('result', { firstName, lastName, qrCodeData });
  } catch (err) {
    console.error('Error generating QR:', err);
    res.status(500).send('Error generating QR code');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ GOSI Registration running on http://localhost:${PORT}`));
