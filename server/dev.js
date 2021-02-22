const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)

// development server
// const express = require('express')
const next = require('next')
const dev = process.env.NODE_ENV !== 'production'

const port = parseInt(process.env.PORT, 10) || 6969
const nextApp = next({ dev })
const nextHandler = nextApp.getRequestHandler()

// const socket = require('socket.io')
const DEBUG_MODE = true
// const http = require('http')

// const server = http.createServer(express())

console.log(`\x1b[1m\x1b[33m%s\x1b[0m`, `-------------------------------------`)
console.log(
  `\x1b[1m\x1b[33m%s\x1b[0m`,
  `⏱️ - The transpilation of threejs is in process, it can take some time.`
)
console.log(`\x1b[1m\x1b[33m%s\x1b[0m`, `-------------------------------------`)

nextApp.prepare().then(() => {
  // const server = express()

  app.all('*', (req, res) => {
    return nextHandler(req, res)
  })

  // const io = new socket(server)

  io.on('connection', function (socket) {
    log(`${socket.id} connected`)

    const room = getRandomInt(10247, 99999) // TODO assign an unused number instead of this random one

    socket.room = room
    socket.join(room)
    socket.emit('ROOM', room) // Main Display uses this to display its room number

    log(`${socket.id} in room ${room}`)

    // used for the controller to switch to the main display's room
    socket.on('SWITCH_ROOMS', function (data) {
      socket.leave(socket.room)
      socket.join(data.new_room)
      socket.room = data.new_room
      log(`${socket.id} switched to ${socket.room}`)
    })

    // SEND_EULER_ANGLES is emitted by Controller
    socket.on('SEND_EULER_ANGLES', function (data) {
      socket.broadcast.to(data.room).emit('EULER_ANGLES', data.euler_angles)
      // socket.broadcast.to(data.room).emit('ACCELERATION', data.acceleration)
    })
    // SEND_ACCELERATION is emitted by Controller
    // socket.on('SEND_ACCELERATION', function (data) {
    //   socket.broadcast.to(data.room).emit('ACCELERATION', data.acceleration)
    // })

    socket.on('disconnect', function () {
      log(`${socket.id} disconnected`)
    })
  })

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`✨ Ready on http://localhost:${port} !`)
  })
})

/**
 * Returns a random number between the min and max (inclusive).
 * @param {Number} min The minimum number
 * @param {Number} max The maximum number
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * Math.floor(max - min)) + min
}

// logs messages only on debug mode
function log(message) {
  return DEBUG_MODE ? console.log(message) : null
}
