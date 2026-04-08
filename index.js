const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
    socket.on('join-order', (orderId) => {
        socket.join(orderId);
    });

    socket.on('update-location', (data) => {
        // Driver ki location seedha user ke pass jayegi
        socket.to(data.orderId).emit('location-synced', data);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));