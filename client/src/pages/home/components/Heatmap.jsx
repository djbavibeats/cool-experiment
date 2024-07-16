import mapboxgl from 'mapbox-gl' // eslint-disable-line import/no-webpack-loader-syntax
import { useRef, useEffect, useState } from 'react'

import 'mapbox-gl/dist/mapbox-gl.css'; 

mapboxgl.accessToken = 'pk.eyJ1IjoianVzdGludm9sdGNyZWF0aXZlIiwiYSI6ImNrczY2eDFpYTBieXEzMGxoaDF1Nmd2aXgifQ.0HoSQyn8pH5coK4IxPRhrQ';

import geojson from '../utils/geojson'


const Heatmap = () => {
    const mapContainer = useRef(null)
    const map = useRef(null)
    const [ lng, setLng ] = useState(0.0)
    const [ lat, setLat ] = useState(0.0)
    const [ posInitialized, setPosInitialzed ] = useState(false)
    const [ zoom, setZoom ] = useState(9)

    useEffect(() => {
        if (map.current) return; // initialize map only once

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                // Success
                (position) => {
                    setLng(position.coords.longitude)
                    setLat(position.coords.latitude)
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

        
    })

    useEffect(() => {
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/dark-v11',
            center: [lng, lat],
            zoom: zoom
        })

        map.current.on('move', () => {
            setLng(map.current.getCenter().lng.toFixed(4))
            setLat(map.current.getCenter().lat.toFixed(4))
            setZoom(map.current.getZoom().toFixed(2))
        })

        for (const feature of geojson.features) {
            // create a HTML element for each feature
          
            // make a marker for each feature and add to the map
            const el = document.createElement('div');
            switch (feature.properties.type) {
                case ('animated'):
                    el.className = 'animated marker'
                    break
                default:
                    break
            }

           // Create a default Marker and add it to the map.
            const marker1 = new mapboxgl.Marker()
                .setLngLat([12.554729, 55.70651])
                .addTo(map.current);
            console.log(feature.geometry.coordinates)
            new mapboxgl.Marker(el)
                .setLngLat(feature.geometry.coordinates)
                .addTo(map.current)
            
          }
    }, [ posInitialized ])


    return (<div className="w-[350px] h-[350px] max-w-[100%] relative">
        <div ref={mapContainer} className="map-container h-[100%]" />
    </div>)
}

export default Heatmap