import { useEffect, useRef, useState } from 'react'
import useWebSocket from 'react-use-websocket'
import { v4 as uuidv4 } from 'uuid'

import mapboxgl from 'mapbox-gl' // eslint-disable-line import/no-webpack-loader-syntax
import 'mapbox-gl/dist/mapbox-gl.css'; 

mapboxgl.accessToken = 'pk.eyJ1IjoianVzdGludm9sdGNyZWF0aXZlIiwiYSI6ImNrczY2eDFpYTBieXEzMGxoaDF1Nmd2aXgifQ.0HoSQyn8pH5coK4IxPRhrQ';

const WS_URL = import.meta.env.VITE_WS_URL

const Map = ({ latitude, longitude, posInitialized, visitors }) => {
    const mapContainer = useRef(null)
    const map = useRef(null)
    const [ zoom, setZoom ] = useState(1)

    const [ visitorsCopy, setVisitorsCopy ] = useState([])

    useEffect(() => {
        if (map.current) return // initialize map only once
        console.log(visitors)
    })

    useEffect(() => {
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/dark-v11',
            center: [longitude, latitude],
            zoom: zoom
        })
    }, [ posInitialized ])

    useEffect(() => {
        // Someone new joined
        if (visitors.length > visitorsCopy.length) {
            var joined = visitors.filter((visitor1) => {
                return !visitorsCopy.some((visitor2) => {
                    return visitor1.sessionId === visitor2.sessionId
                })
            })
            console.log("These people joined: ", joined)
            for (let i = 0; i < joined.length; i++) {
                const el = document.createElement('div')
                el.classList.add('marker')
                el.id = joined[i].sessionId
                const marker = new mapboxgl.Marker({ 
                    className: 'marker', 
                    element: el
                })
                    .setLngLat([ joined[i].longitude, joined[i].latitude ])
                    .addTo(map.current)
            }
        // Someone left
        } else if (visitors.length < visitorsCopy.length) {
            var left = visitorsCopy.filter((visitor1) => {
                return !visitors.some((visitor2) => {
                    return visitor1.sessionId === visitor2.sessionId
                })
            })
            console.log("These people left: ", left)
            for (let i = 0; i < left.length; i++) {
                document.getElementById(`${left[i].sessionId}`).remove()
            }
            // console.log("Here is there marker", document.getElementById(`${left[0].sessionId}`))
        }
        setVisitorsCopy(visitors)
    }, [ visitors ])

    useEffect(() => {
    }, [])

    return (<div className="w-[350px] h-[350px] max-w-[100%] relative">
        <div ref={mapContainer} className="map-container h-[100%]" />
    </div>)
}

const Connection = ({ setConnected, visitors, setVisitors, sessionId, latitude, longitude}) => {
    const { sendJsonMessage, lastJsonMessage } = useWebSocket(WS_URL + `/?sessionId=${sessionId}&latitude=${latitude}&longitude=${longitude}`, {
        onOpen: () => {
            // console.log('Websocket connection established')
        },
        share: true
    })

    useEffect(() => {
        if (lastJsonMessage) {
            if (lastJsonMessage.message === "user connected") {
                if (lastJsonMessage.new_session_id === sessionId) {
                    // console.log(`hi ${sessionId}, you are the most recent user`)
                    setVisitors([ ...lastJsonMessage.users ])
                    setConnected(true)
                } else {
                    // console.log(`you are receiving new user ${lastJsonMessage.new_session_id}'s information`)
                    setVisitors([ ...lastJsonMessage.users ])
                    // Only add the most recent visitor so that we don't have to update the entire map
                    // setVisitors([
                    //     ...visitors,
                    //     {
                    //         sessionId: lastJsonMessage.new_session_id,
                    //         latitude: lastJsonMessage.new_user_latitude,
                    //         longitude: lastJsonMessage.new_user_longitude
                    //     }
                    // ])
                }
            } else if (lastJsonMessage.message === "user disconnected") {
                setVisitors([ ...lastJsonMessage.users ])
            }
        }
    }, [ lastJsonMessage ])
}

const WebsocketMap = () => {
    const [ sessionId, setSessionId ] = useState(null)
    const [ connected, setConnected ] = useState(false)
    const [ visitors, setVisitors ] = useState([])
    const [ longitude, setLongitude ] = useState(0.0)
    const [ latitude, setLatitude ] = useState(0.0)
    const [ posInitialized, setPosInitialzed ] = useState(false)

    useEffect(() => {
        setSessionId(uuidv4())
        // console.log(`Client Session Id: ${sessionId}`)
    }, [])

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

    useEffect(() => {
        // console.log('updated map visitors', visitors)
    }, [ visitors ])

    const handleClickMessage = () => {
        setActive(true)
    }

    return (<>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-y-4">
            <div className="col-span-1">
                {
                    connected &&
                        <Map latitude={ latitude } longitude={ longitude } posInitialized={ posInitialized } visitors={ visitors } />
                }
            </div>
            <div className="col-span-1">
            {/* {
                posInitialized &&
                    <div className="
                        flex items-center justify-center gap-x-2
                        font-bold rounded-full border-2 py-2 px-8
                        hover:cursor-pointer hover:scale-110
                        transition duration-150 ease-in-out
                    " onClick={ handleClickMessage }>
                        <div className=""><p className="">Join The Map!</p></div> 
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 448 512">
                            <path d="M368 416H48c-8.8 0-16 7.2-16 16v64c0 8.8 7.2 16 16 16h320c8.8 0 16-7.2 16-16v-64c0-8.8-7.2-16-16-16zm57-209.1c-27.2-22.6-67.5-19-90.1 8.2l-20.9 25-29.6-128.4c-18-77.5-95.4-125.9-172.8-108C34.2 21.6-14.2 98.9 3.7 176.4L51.6 384h309l72.5-87c22.7-27.2 19-67.5-8.1-90.1z"/>
                        </svg>
                    </div>
            } */}
            {
                posInitialized &&
                    <Connection 
                        setConnected={ setConnected }
                        visitors={ visitors }
                        setVisitors={ setVisitors }
                        sessionId={ sessionId }
                        latitude={ latitude } 
                        longitude={ longitude } 
                    />
            }
            </div>
        </div>
    </>)
}

export default WebsocketMap