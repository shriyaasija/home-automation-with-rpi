const express = require('express');
const path = require('path');
const net = require('net');

const app = express();
app.use(express.static('public'));

app.get('/control/:device/:status', (req, res) => {
  const { device, status } = req.params;
  const client = new net.Socket();
  client.connect(1337, 'localhost', () => {
    client.write(`${device}:${status}`);
    client.end();
    res.send('Command sent');
  });
});

app.listen(8000, () => console.log('Web server running on http://localhost:8000'));