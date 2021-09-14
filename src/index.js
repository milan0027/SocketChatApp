const path = require('path')

const http = require('http')


const express = require('express')
const socketio = require('socket.io')
const Filter  = require('bad-words')
const {generateMessage, generateLocation} = require('./utils/messages')
const app  =  express()

const server = http.createServer(app)
const io = socketio(server)

const port = process.env.port  || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

let count = 0
io.on('connection', (socket) =>{
    console.log('New web socket connection')

    socket.emit('message', generateMessage('welcome'))

    socket.emit('countUpdated', count)

    socket.broadcast.emit('message', generateMessage('A new user has entered the chat'))

    socket.on('increment', () =>{
        count++
        //socket.emit('countUpdated', count)

        io.emit('countUpdated', count)
    })
    
    socket.on('sendMessage', (msg, callback)=>{
        const filter = new Filter()

        if(filter.isProfane(msg))
        {
            return callback('bad-words not allowed')
        }
        io.emit('message', generateMessage(msg))
        callback()
    })

    socket.on('sendlocation', (coords, callback)=>{
        io.emit('locationMessage', generateLocation(`https://google.com/maps?q=${coords.lat},${coords.lon}`))
        callback()
    })

    socket.on('disconnect', ()=>{
        io.emit('message', generateMessage('A user has left the chat'))
    })
})

server.listen(port, ()=> {
    console.log(`listening on port ${port}`)
})

