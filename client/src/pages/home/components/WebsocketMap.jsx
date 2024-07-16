import { useEffect } from 'react'
import useWebSocket from 'react-use-websocket'

const WS_URL = 'ws://127.0.0.1:8000'

const WebsocketMap = ({ lit, setLit }) => {
    useWebSocket(WS_URL, {
        onOpen: () => {
            console.log('Websocket connection established')
        }
    })

    return (<>
    </>)
}

export default WebsocketMap