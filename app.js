const net = require('net');
const express = require('express');
const path = require('path');

const app = express();
const PORT = 8000;
const TCP_PORT = 1337;

let client = null;

const server = net.createServer((socket) => {
    console.log('Pi connected');
    client = socket;

    socket.on('end', () => {
        console.log('Pi disconnected');
        client = null;
    });
});

server.listen(TCP_PORT, () => {
    console.log(`TCP server listening on port ${TCP_PORT}`);
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/fan/:state', (req, res) => {
    const state = req.params.state;
    if (client) {
        client.write(state + '\n');
        res.send(`Fan command "${state}" sent`);
    } else {
        res.send('Fan is not connected!');
    }
});

app.get('/light/:state', (req, res) => {
    const state = req.params.state;
    if (client) {
        client.write(state + '\n');
        res.send(`Light command "${state}" sent`);
    } else {
        res.send('Light is not connected!');
    }
});

app.listen(PORT, () => {
    console.log(`Web server running at http://localhost:${PORT}`);
});