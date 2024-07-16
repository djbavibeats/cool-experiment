
const { WebSocketServer } = require('ws')
const http = require('http')
const { v4: uuidv4 } = require('uuid')

// Spinning the http server and the websocket server
const server = http.createServer()
const wsServer = new WebSocketServer({ server })
const port = 8000
server.listen(port, () => {
    console.log(`Websocket server is running on port ${port}`)
})

const clients = {}

wsServer.on('connection', function(connection) {
    const userId = uuidv4()

    // Store the new connection
    clients[userId] = connection
    console.log(`${userId} connected.`)

    // User disconnected
    connection.on('close', function() {
        console.log(`${userId} disconnected.`)
    })

})

// wsServer.on('request', function (request) {
//     console.log((new Date()) + ' Received a new connection from origin ' + request.origin + '.')

//     const connection = request.accept(null, request.origin)
//     clients[userID] = connection
//     console.log('connected: ' + userID + ' in ' + Object.getOwnPropertyNames(clients))

//     connection.on('message', function(message) {
//         console.log('New streamer: ', message.utf8Data)

//         for (key in clients) {
//             clients[key].sendUTF(message.utf8Data)
//             console.log('sent mesage to: ', clients[key])
//         }
//     })
// })
