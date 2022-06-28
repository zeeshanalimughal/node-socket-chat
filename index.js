require('./config');
const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
// const http = require('http');
// http.createServer(app);


app.use(cors())
app.use(cors('*'))
app.use(express.static('public'))


app.get('/', function (req, res) {
    res.sendFile('index');
})


server = app.listen(PORT)
socket = require('socket.io')(server)

var users = [];

socket.on('connection', function (socket) {
    console.log('connection established')
    socket.on('user_connected', username => {
        socket.broadcast.emit('user_connected', username)
        users.push({name: username,id:socket.id})
        // console.log({name: username,id:socket.id})
    })

    console.log(socket.id)
    socket.on('message', data => {
        console.log(data)
        socket.broadcast.emit('new_message', data)
    })
    socket.on("typing", function (username) {
        socket.broadcast.emit('typing', username)
    })

    socket.on('disconnect', function () {
        let user = users.filter((user) => {return user.id === socket.id})
        socket.broadcast.emit('user_disconnected',user[0].name)
    })

  
})

