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

  // ✅ Generate unique 6-digit ID (HHMMSS)
  const now = new Date();
  const uniqueID = `${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;

  // ✅ Updated QR content format
  const userData = `ID:${uniqueID}|FN:${firstName}|LN:${lastName}`;

  try {
    const qrCodeData = await QRCode.toDataURL(userData);

    // ✅ Pass the new uniqueID to your result page too
    res.render('result', { firstName, lastName, qrCodeData, uniqueID });
  } catch (err) {
    console.error('Error generating QR:', err);
    res.status(500).send('Error generating QR code');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ GOSI Registration running on http://localhost:${PORT}`));
