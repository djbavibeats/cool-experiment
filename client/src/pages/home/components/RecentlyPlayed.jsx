import { useState, useEffect } from 'react'

const RecentlyPlayed = () => {
    const [ topTracks, setTopTracks ] = useState([])
    const [ recentlyPlayed, setRecentlyPlayed ] = useState([])
    
    const getTopTracks = () => {
        let accessToken = localStorage.getItem('exp_access_token')
        fetch('https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=20', {
            headers: {
                Authorization: 'Bearer ' + accessToken
            }
        }).then(blob => blob.json())
            .then(data => {
                setTopTracks(data.items)  
            })
    }

    const getRecentlyPlayed = () => {
        let accessToken = localStorage.getItem('exp_access_token')
        fetch('https://api.spotify.com/v1/me/player/recently-played?limit=20', {
            headers: {
                Authorization: 'Bearer ' + accessToken
            }
        }).then(blob => blob.json())
            .then(data => {
                setRecentlyPlayed(data.items)
            })
    }

    useEffect(() => {
        getTopTracks()
        getRecentlyPlayed()
    }, [])

    const renderTopTracks = () => {
        let artist = ""
        return (<>
            { topTracks.map((track, index) => {
                artist = ""
                if (track.artists.length > 1) {
                    for (let i = 0; i < track.artists.length; i++) {
                        artist += track.artists[i].name + " "
                    }
                } else {
                    artist = track.artists[0].name
                }
                return (<div className="grid grid-cols-10" key={ index }>
                    <div className="col-span-1 max-w-10"><p className="text-sm">{ index+=1 }</p></div> 
                    <div className="col-span-9"><p className="text-sm">{ track.name } - { artist }</p></div>
                </div>)
            })}
        </>)
    }

    const renderRecentlyPlayed = () => {
        let artist = ""
        return (<>
            { recentlyPlayed.map((item, index) => {
                artist = ""
                if (item.track.artists.length > 1) {
                    for (let i = 0; i < item.track.artists.length; i++) {
                        artist += item.track.artists[i].name + " "
                    }
                } else {
                    artist = item.track.artists[0].name
                }
                return (<div className="grid grid-cols-10" key={ index }>
                    <div className="col-span-1 max-w-10"><p className="text-sm">{ index+=1 }</p></div> 
                    <div className="col-span-9"><p className="text-sm">{ item.track.name } - { artist }</p></div>
                </div>)
            })}
        </>)
    }

    return (<div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
                <p className="font-bold text-center mb-2">Top Tracks</p>
                { renderTopTracks() }
            </div>
            <div>
                <p className="font-bold text-center mb-2">Recently Played Tracks</p>
                { renderRecentlyPlayed() }
            </div>
        </div>
    </div>)
}

export default RecentlyPlayed