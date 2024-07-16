
const { WebSocket, WebSocketServer } = require('ws')
const http = require('http')
const { v4: uuidv4 } = require('uuid')
const { client } = require('websocket')
const url = require('url')
// Spinning the http server and the websocket server
const server = http.createServer()
const wsServer = new WebSocketServer({ server })
const port = 8000
server.listen(port, () => {
    console.log(`Websocket server is running on port ${port}`)
})

// Maintain active connections here
const clients = {}
const users = {}

function broadcastMessage(json) {
    const data = JSON.stringify(json)
    for (let userId in clients) {
        let client = clients[userId].connection
        if (client.readyState === WebSocket.OPEN) {
            client.send(data)
        }
    }
}

function handleMessage(message, userId) {
    const dataFromClient = JSON.parse(message.toString())
    const json = { type: dataFromClient.type }
    json.data = {
        latitude: dataFromClient.latitude,
        longitude: dataFromClient.longitude,
        users: users
    }
    broadcastMessage(json)
}

function handleDisconnect(userId) {
    delete clients[userId]
    delete users[userId]
    broadcastMessage({
        message: 'user disconnected',
        users: users
    })
}

wsServer.on('connection', function(connection, request) {
    const userId = uuidv4()

    // Get the latitude and longitude from the request
    const { latitude, longitude } = url.parse(request.url, true).query

    // Store the new connection
    clients[userId] = {
        connection
    }
    users[userId] = {
        latitude: latitude,
        longitude: longitude
    }
    console.log(`User ${userId} connected at:`)
    console.log(`   Latitude:  ${latitude}`)
    console.log(`   Longitude: ${longitude}`)

    broadcastMessage({ 
        message: 'user connected',
        users: users 
    })

    connection.on('message', (message) => handleMessage(message, userId))

    // User disconnected
    connection.on('close', () => {
        console.log(`goodbye ${userId}`)
        handleDisconnect(userId)
    })

})
