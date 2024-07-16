import { useEffect, useState } from "react"

import SpotifyLogo from '../../../../public/images/spotify-logo.png'

function Spotify ({ user, setUser }) {
    const redirect_uri = import.meta.env.VITE_SPOTIFY_REDIRECT_URL
    const spotify_client_id = import.meta.env.VITE_SPOTIFY_CLIENT_ID
    const [ codeChallenge, setCodeChallenge ] = useState('')
    const [ accessTokenRetrieved, setAccessTokenRetrieved ] = useState(false)
    const [ spotifyCredentials, setSpotifyCredentials ] = useState({
        clientId: spotify_client_id,
        redirectUri: redirect_uri,
        scope: `user-read-private user-read-email 
            user-read-currently-playing user-read-recently-played
            user-read-playback-state user-modify-playback-state
            user-top-read
            streaming
        `,
    })

    const sha256 = async (plain) => {
        const encoder = new TextEncoder()
        const data = encoder.encode(plain)
        return window.crypto.subtle.digest('SHA-256', data)
    }

    const base64encode = (input) => {
        return btoa(String.fromCharCode(...new Uint8Array(input)))
            .replace(/=/g, '')
            .replace(/\+/g, '-')
            .replace(/\//g, '_');
    }

    const generateRandomString = (length) => {
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        const values = crypto.getRandomValues(new Uint8Array(length))
        return values.reduce((acc, x) => acc + possible[x % possible.length], "")
    }

    useEffect(() => {
        // Check if there is a code verifier in local storage
        let codeVerifier
        if (localStorage.getItem('exp_code_verifier')) {
            codeVerifier = localStorage.getItem('exp_code_verifier')
        } else {
            // Generate code verifier if there is not already one stored in local storage
            codeVerifier  = generateRandomString(64)
            window.localStorage.setItem('exp_code_verifier', codeVerifier)
        }
        sha256(codeVerifier)
            .then(hashed => { 
                setCodeChallenge(base64encode(hashed))
        })
    }, [])

    useEffect(() => {
        if (localStorage.getItem('exp_access_token')) {
            getSpotifyUser()
        }
    }, [ accessTokenRetrieved ])

    useEffect(() => {
        const authUrl = new URL('https://accounts.spotify.com/authorize')
        if (codeChallenge !== '') {
            const urlParams = new URLSearchParams(window.location.search)
            let code = urlParams.get('code')
            // This should only run if there is a code from the Spotify authentication window in the url and no access token in local storage
            if (code && !localStorage.getItem('exp_access_token')) {
                fetch('https://accounts.spotify.com/api/token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        client_id: spotifyCredentials.clientId,
                        grant_type: 'authorization_code',
                        code,
                        redirect_uri: spotifyCredentials.redirectUri,
                        code_verifier: localStorage.getItem('exp_code_verifier')
                    })
                }).then(data => data.json())
                    .then(response => {
                        localStorage.setItem('exp_access_token', response.access_token)
                        setAccessTokenRetrieved(true)
                    })
            }
        }
    }, [ codeChallenge ])

    const openSpotifyAuthWindow = () => {
        const authUrl = new URL("https://accounts.spotify.com/authorize")
        const params =  {
            response_type:          'code',
            client_id:              spotifyCredentials.clientId,
            scope:                  spotifyCredentials.scope,
            code_challenge_method:  'S256',
            code_challenge:         codeChallenge,
            redirect_uri:           spotifyCredentials.redirectUri,
        }
        authUrl.search = new URLSearchParams(params).toString()
        window.location.href = authUrl.toString()
    }

    const getSpotifyUser = () => {
        let accessToken = localStorage.getItem('exp_access_token')
        fetch('https://api.spotify.com/v1/me', {
            headers: {
                Authorization: 'Bearer ' + accessToken
            }
        }).then(data => data.json())
            .then(response => {
                setUser({ 
                    loggedIn: true,
                    id: response.id,
                    display_name: response.display_name,
                    product: response.product
                })
            })
    }

    return (<>
    { codeChallenge !== '' 
        &&
        <>
        <div className="
            flex items-center justify-center gap-x-2
            font-bold rounded-full border-2 py-2 px-8
            hover:cursor-pointer hover:scale-110
            transition duration-150 ease-in-out
        " onClick={ openSpotifyAuthWindow }>
            <div className=""><p className="">Login with Spotify</p></div> 
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 512 512">
                <path d="M217 401L345 273c9.4-9.4 9.4-24.6 0-33.9L217 111c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l87 87L24 232c-13.3 0-24 10.7-24 24s10.7 24 24 24l246.1 0-87 87c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0zM344 80l80 0c22.1 0 40 17.9 40 40l0 272c0 22.1-17.9 40-40 40l-80 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l80 0c48.6 0 88-39.4 88-88l0-272c0-48.6-39.4-88-88-88l-80 0c-13.3 0-24 10.7-24 24s10.7 24 24 24z"/>
            </svg>
        </div>
        <img className="w-[80px]" src={ SpotifyLogo } />
        </>
    }
    </>)
}

export default Spotify