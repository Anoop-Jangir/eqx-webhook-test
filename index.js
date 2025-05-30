const express = require('express');
const app = express();

app.use(express.json());

app.post('/webhook/orders/create', (req, res) => {
  console.log('Received Shopify webhook:', req.body);
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
