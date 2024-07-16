function Navbar () {
    async function share() {
        const shareData = {
            title: "Spotify Experiments",
            text: "Check it out!!",
            url: "https://justinbavier.com",
        }

        if (navigator.share && navigator.canShare(shareData)) {
            try {
                await navigator.share(shareData);
                console.log("Shared successfully")
            } catch (err) {
                console.log(`Error: ${err}`)
                alert("Error")
            }
        } else {
            // do something else like copying the data to the clipboard
            console.log(`Can't share in this browser`)
            alert("Sharing is not enabled in this browser")
        }
    }

    function openMenu() {
        window.open('https://justinbavier.com', '_blank')
    }

    return (
        <div className="absolute h-20 flex items-center justify-between bg-none w-full top-0 left-0 right-0 px-4 z-20">
            {/* Share Icon */}
            <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#000" className="w-6 h-6 hover:cursor-pointer" onClick={ share }>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>  
            </div>

            {/* Menu Icon */}
            <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 hover:cursor-pointer" onClick={ openMenu }>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
            </div>
        </div>
    )
}

export default Navbar