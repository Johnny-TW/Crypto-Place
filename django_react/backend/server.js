const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 0;

app.use(express.static(path.join(__dirname, '../frontend/build')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running!' });
});

app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, '../frontend/build/index.html');
  if (!fs.existsSync(indexPath)) {
    return res.status(404).send('Frontend build not found. Please run "pnpm run build" in the frontend directory.');
  }
  res.sendFile(indexPath);
});

app.listen(PORT, function () {
  const address = this.address();
  console.log(`Server is running on http://localhost:${address.port}`);
});
