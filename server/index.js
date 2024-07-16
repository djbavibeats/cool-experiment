
const { WebSocket, WebSocketServer } = require('ws')
const http = require('http')
const { v4: uuidv4 } = require('uuid')
const { client } = require('websocket')
const url = require('url')
// Spinning the http server and the websocket server
const server = http.createServer()
const wsServer = new WebSocketServer({ server })
const port = process.env.PORT || 8000
server.listen(port, () => {
    console.log(`Websocket server is running on port ${port}`)
})

// Maintain active connections here
const clients = {}
const users = []

function broadcastMessage(json) {
    const data = JSON.stringify(json)
    for (let sessionId in clients) {
        let client = clients[sessionId].connection
        if (client.readyState === WebSocket.OPEN) {
            client.send(data)
        }
    }
}

function handleMessage(message, sessionId) {
    const dataFromClient = JSON.parse(message.toString())
    const json = { type: dataFromClient.type }
    json.data = {
        latitude: dataFromClient.latitude,
        longitude: dataFromClient.longitude,
        users: users
    }
    broadcastMessage(json)
}

function handleDisconnect(sessionId) {
    delete clients[sessionId]
    // delete users[sessionId]
    users.splice(users.findIndex(user => user.sessionId === sessionId), 1)
    broadcastMessage({
        message: 'user disconnected',
        users: users
    })
}

wsServer.on('connection', function(connection, request) {
    // const userId = uuidv4()
    // Get the latitude and longitude from the request
    const { sessionId, latitude, longitude } = url.parse(request.url, true).query

    console.log(`New Session: ${sessionId}`)
    
    // Store the new connection
    clients[sessionId] = {
        connection
    }
    users.push({
        sessionId: sessionId,
        latitude: latitude,
        longitude: longitude
    })

    // Broadcast a message to all users saying that a new user has connected
    broadcastMessage({ 
        message: 'user connected',
        new_session_id: sessionId,
        new_user_latitude: latitude,
        new_user_longitude: longitude,
        users: users 
    })

    connection.on('message', (message) => handleMessage(message, sessionId))

    // User disconnected
    connection.on('close', () => {
        console.log(`goodbye ${sessionId}`)
        handleDisconnect(sessionId)
    })

})
