import { useEffect, useRef, useState } from 'react'
import useWebSocket from 'react-use-websocket'

import mapboxgl from 'mapbox-gl' // eslint-disable-line import/no-webpack-loader-syntax
import 'mapbox-gl/dist/mapbox-gl.css'; 

mapboxgl.accessToken = 'pk.eyJ1IjoianVzdGludm9sdGNyZWF0aXZlIiwiYSI6ImNrczY2eDFpYTBieXEzMGxoaDF1Nmd2aXgifQ.0HoSQyn8pH5coK4IxPRhrQ';

const WS_URL = 'ws://127.0.0.1:8000'

const Map = ({ latitude, longitude, posInitialized }) => {
    const mapContainer = useRef(null)
    const map = useRef(null)
    const [ zoom, setZoom ] = useState(9)

    useEffect(() => {
        if (map.current) return; // initialize map only once
    })

    useEffect(() => {
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/dark-v11',
            center: [longitude, latitude],
            zoom: zoom
        })
    }, [ posInitialized ])

    function lightUpUser() {
        new mapboxgl.Marker()
            .setLngLat([-73.97812588853213, 40.67943414392307])
            .addTo(map.current)
    }

    return (<div className="w-[350px] h-[350px] max-w-[100%] relative">
        <div ref={mapContainer} className="map-container h-[100%]" />
    </div>)
}

const Connection = ({ latitude, longitude}) => {
    const { sendJsonMessage, lastJsonMessage } = useWebSocket(WS_URL + `/?latitude=${latitude}&longitude=${longitude}`, {
        onOpen: () => {
            console.log('Websocket connection established')
        },
        share: true
    })

    useEffect(() => {
        console.log('getting users')
        console.log(lastJsonMessage)
    }, [ lastJsonMessage ])
}

const WebsocketMap = () => {
    const [ active, setActive ] = useState(false)
    const [ longitude, setLongitude ] = useState(0.0)
    const [ latitude, setLatitude ] = useState(0.0)
    const [ posInitialized, setPosInitialzed ] = useState(false)

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                // Success
                (position) => {
                    setLongitude(position.coords.longitude)
                    setLatitude(position.coords.latitude)
                    setPosInitialzed(true)
                }, 
                // Error
                () => {
                    alert('Geolocation is not enabled in this browser.')
                },
                // Options 
                { 
                    enableHighAccuracy: false, 
                    timeout: 5000, 
                    maximumAge: 0 
                } 
            )
        } else {
            alert('Geolocation is not enabled in this browser.')
        }
    }, [])

    const handleClickMessage = () => {
        setActive(true)
    }

    return (<>
        {
            posInitialized &&
                <div className="
                    flex items-center justify-center gap-x-2
                    font-bold rounded-full border-2 py-2 px-8
                    hover:cursor-pointer hover:scale-110
                    transition duration-150 ease-in-out
                " onClick={ handleClickMessage }>
                    <div className=""><p className="">Say Hello!</p></div> 
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 448 512">
                        <path d="M368 416H48c-8.8 0-16 7.2-16 16v64c0 8.8 7.2 16 16 16h320c8.8 0 16-7.2 16-16v-64c0-8.8-7.2-16-16-16zm57-209.1c-27.2-22.6-67.5-19-90.1 8.2l-20.9 25-29.6-128.4c-18-77.5-95.4-125.9-172.8-108C34.2 21.6-14.2 98.9 3.7 176.4L51.6 384h309l72.5-87c22.7-27.2 19-67.5-8.1-90.1z"/>
                    </svg>
                </div>
        }
        {
            active &&
                <Connection latitude={ latitude } longitude={ longitude } />
        }
        <Map latitude={ latitude } longitude={ longitude } posInitialized={ posInitialized } />
    </>)
}

export default WebsocketMap