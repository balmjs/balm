const express = require('express');

const PORT = 3000;
const app = express();

app.use(express.static('dist'));

app.all('/*', (req, res) => {
  res.sendFile('index.html', { root: __dirname + '/dist' });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}, Ctrl+C to stop`);
});
