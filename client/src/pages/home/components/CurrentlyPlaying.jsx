import { useState, useEffect } from 'react'

const CurrentlyPlaying = ({ user }) => {
    const [ device, setDevice ] = useState({
        id: "",
        is_active: false,
        name: "",
        type: ""
    })

    const [ track, setTrack ] = useState({
        id: "",
        name: "",
        artist: "",
        album_id: ""
    })

    const targetAlbumId = "47k5dQRj8tZJwZjLUt85fi"
    
    useEffect(() => {
        // const script = document.createElement('script')
        // script.src = 'https://sdk.scdn.co/spotify-player.js'
        // script.async = true
        // document.body.appendChild(script)

        // window.onSpotifyWebPlaybackSDKReady = () => {
        //     console.log('is it ready?')
        //     const token = localStorage.getItem('exp_access_token')
        //     const player = new Spotify.Player({
        //         name: 'Web Playback SDK Quick Start Player',
        //         getOAuthToken: cb => { cb(token) }
        //     })

        //     player.connect().then(success => {
        //         if (success) {
        //             console.log('The Web Playback SDK successfully connected to Spotify!');
        //         }
        //     })
        // }
    }, [])

    useEffect(() => {
        let accessToken = localStorage.getItem('exp_access_token')
        fetch('https://api.spotify.com/v1/me/player', {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + accessToken
            }
        }).then(blob => {
            // Returns 204 if nothing is playing
            if (blob.status === 204) {
                return
            } else {
                return blob.json()
                    .then(data => {
                        console.log(data.device.id)
                        setDevice({
                            id: data.device.id,
                            is_active: data.device.is_active,
                            name: data.device.name,
                            type: data.device.type
                        })
                    })
            }
        })
    }, [])

    // Check if player has changed
    const updatePlayerInfo = () => {
        let accessToken = localStorage.getItem('exp_access_token')
        fetch('https://api.spotify.com/v1/me/player', {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + accessToken
            }
        }).then(blob => {
            // Returns 204 if nothing is playing
            if (blob.status === 204) {
                return
            } else {
                return blob.json()
                    .then(data => {
                        setDevice({
                            id: data.device.id,
                            is_active: data.device.is_active,
                            name: data.device.name,
                            type: data.device.type
                        })
                        setTrack({
                            id: data.item.id,
                            name: data.item.name,
                            artist: data.item.artists[0].name,
                            album_id: data.item.album.id
                        })
                    })
            }
        })
    }

    const playTheRightThing = () => {
        let accessToken = localStorage.getItem('exp_access_token')
        fetch(`https://api.spotify.com/v1/me/player/next?device_id${device.id}`, {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + accessToken
            }
        }).then(blob => {
            console.log(blob)
            if (blob.status === 200) {
                setTimeout(() => {
                    updatePlayerInfo()
                }, 500)
            }
        })

    }
    const queueTheRightThing = () => {
        let accessToken = localStorage.getItem('exp_access_token')
        let spotifyUri = 'spotify:track:51SDO6rVAyqVouNO5AadIy'

        fetch(`https://api.spotify.com/v1/me/player/queue?uri=${spotifyUri}&device_id${device.id}`, {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + accessToken
            }
        }).then(blob => {
            if (blob.status === 200) {
                playTheRightThing()
            }
        })
    }


    // Get the currently playing track when a listener signs in
    useEffect(() => {
        let accessToken = localStorage.getItem('exp_access_token')
        fetch('https://api.spotify.com/v1/me/player/currently-playing', {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + accessToken
            }
        }).then(blob => {
            // Returns 204 if nothing is playing
            if (blob.status === 204) {
                setTrack({
                    id: "",
                    name: "N/A"
                })
                return
            } else {
                return blob.json()
                    .then(data => {
                        console.log(data)
                        setTrack({
                            id: data.item.id,
                            name: data.item.name,
                            artist: data.item.artists[0].name,
                            album_id: data.item.album.id
                        })
                    })
            }
        })
    }, [])

    return (<div className="flex flex-col items-center gap-y-2">
        <div>
            { track.name === "N/A" ? <>
                <p>You aren't currently listening to anything.</p>
            </> : <>
                <p className="text-center text-xs mb-0">Now Playing on { device.name }:</p>
                <p className="text-center font-bold">{ track.name } - { track.artist }</p>
            </>}
        </div>
        
        <div>
            <div className="
                flex items-center justify-center gap-x-2
                font-bold rounded-full border-2 py-2 px-8
                max-w-[275px]
                hover:cursor-pointer hover:scale-110
                transition duration-150 ease-in-out
            " onClick={ updatePlayerInfo }>
                <div className=""><p className="">Refetch Player Status</p></div> 
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 512 512">
                    <path d="M105.1 202.6c7.7-21.8 20.2-42.3 37.8-59.8c62.5-62.5 163.8-62.5 226.3 0L386.3 160H352c-17.7 0-32 14.3-32 32s14.3 32 32 32H463.5c0 0 0 0 0 0h.4c17.7 0 32-14.3 32-32V80c0-17.7-14.3-32-32-32s-32 14.3-32 32v35.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5zM39 289.3c-5 1.5-9.8 4.2-13.7 8.2c-4 4-6.7 8.8-8.1 14c-.3 1.2-.6 2.5-.8 3.8c-.3 1.7-.4 3.4-.4 5.1V432c0 17.7 14.3 32 32 32s32-14.3 32-32V396.9l17.6 17.5 0 0c87.5 87.4 229.3 87.4 316.7 0c24.4-24.4 42.1-53.1 52.9-83.7c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.5 62.5-163.8 62.5-226.3 0l-.1-.1L125.6 352H160c17.7 0 32-14.3 32-32s-14.3-32-32-32H48.4c-1.6 0-3.2 .1-4.8 .3s-3.1 .5-4.6 1z"/>
                </svg>
            </div>
        </div>

        <div className="flex items-center justify-center p-10 bg-black rounded-xl text-white h-[150px] w-[250px]">
            { track.album_id === targetAlbumId ? 
                <p className="text-center">Thanks for listening to <i>Life Under The Gun</i> by Militarie Gun!</p>
                : <p className="text-center">You are not listening to the correct album.</p>
            }
        </div>
        
        <div>
            <div className="
                flex items-center justify-center gap-x-2
                font-bold rounded-full border-2 py-2 px-8
                max-w-[275px]
                hover:cursor-pointer hover:scale-110
                transition duration-150 ease-in-out
            " onClick={ queueTheRightThing }>
                <div className=""><p className="">Play The Right Thing</p></div> 
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 512 512">
                    <path d="M256 80C149.9 80 62.4 159.4 49.6 262c9.4-3.8 19.6-6 30.4-6c26.5 0 48 21.5 48 48V432c0 26.5-21.5 48-48 48c-44.2 0-80-35.8-80-80V384 336 288C0 146.6 114.6 32 256 32s256 114.6 256 256v48 48 16c0 44.2-35.8 80-80 80c-26.5 0-48-21.5-48-48V304c0-26.5 21.5-48 48-48c10.8 0 21 2.1 30.4 6C449.6 159.4 362.1 80 256 80z"/>
                </svg>
            </div>
        </div>
    </div>)
}

export default CurrentlyPlaying