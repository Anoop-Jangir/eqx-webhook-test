const express = require('express');
const crypto = require('crypto');
const bodyParser = require('body-parser');

const app = express();

// Use raw body for POST (needed for signature validation)
app.use(
  '/webhook/orders/create',
  bodyParser.raw({ type: 'application/json' })
);

// 🔐 Common HMAC verification function
function isValidShopifyRequest(req) {
  const hmacHeader = req.get('X-Shopify-Hmac-Sha256');
  const secret = "62f08cfe88a27c46a08f6a86e92e1932";

  const hash = crypto
    .createHmac('sha256', secret)
    .update(req.body, 'utf8')
    .digest('base64');

  return hmacHeader === hash;
}

// ✅ POST webhook handler
app.post('/webhook/orders/create', (req, res) => {
  if (!isValidShopifyRequest(req)) {
    console.warn('❌ POST HMAC verification failed');
    return res.status(401).send('Unauthorized');
  }

  const jsonBody = JSON.parse(req.body.toString('utf8'));
  console.log('✅ POST Webhook verified:', jsonBody);
  res.status(200).send('POST webhook received');
});

// ✅ GET handler for manual testing
app.get('/webhook/orders/create', (req, res) => {
  if (!isValidShopifyRequest(req)) {
    console.warn('❌ GET HMAC verification failed');
    return res.status(401).send('Unauthorized');
  }

  console.log('✅ GET Webhook request verified');
  res.status(200).send('GET webhook verified');
});

// Health check
app.get('/', (req, res) => {
  res.send('🚀 Shopify webhook listener is live!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🔊 Listening on port ${PORT}`);
});
