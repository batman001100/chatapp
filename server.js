const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

let users = {};

io.on('connection', (socket) => {
    console.log('User connected');

    socket.on('join', (username) => {
        users[socket.id] = username;
        io.emit('user list', Object.values(users));
    });

    socket.on('chat message', (msg) => {
        io.emit('chat message', {
            user: users[socket.id],
            text: msg
        });
    });

    socket.on('disconnect', () => {
        delete users[socket.id];
        io.emit('user list', Object.values(users));
    });
});

http.listen(3000, () => {
    console.log('Server running on port 3000');
});