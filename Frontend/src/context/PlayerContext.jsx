import { createContext, useEffect, useRef, useState } from "react";
// import { songsData } from "../assets/frontend-assets/assets";
import axios from "axios";

export const PlayerContext = createContext()

const PlayerContextProvider = (props) => {

    const audioRef = useRef()
    const seekBg = useRef()
    const seekBar = useRef()

    const url = 'http://localhost:4000'

    const [songsData, setSongsData] = useState([])
    const [albumsData, setAlbumsData] = useState([])

    const [track, setTrack] = useState(songsData[0])
    const [playStatus, setPlayStatus] = useState(false)
    const [time, setTime] = useState({
        currentTime: {
            seconds: 0,
            minutes: 0
        },
        totalTime: {
            seconds: 0,
            minutes: 0
        }
    })

    const play = () => {
        audioRef.current.play()
        setPlayStatus(true)
    }

    const pause = () => {
        audioRef.current.pause()
        setPlayStatus(false)
    }

    const playWithId = async (id) => {
        // await setTrack(songsData[id])
        // await audioRef.current.play()
        // setPlayStatus(true)
        await songsData.map((item) => {
            if (id === item._id) {
                setTrack(item)

            }
        }
        )
        await audioRef.current.play()
        setPlayStatus(true)
    }

    const previous = async () => {
        // if (track.id > 0) {
        //     await setTrack(songsData[track.id - 1])
        //     await audioRef.current.play()
        //     setPlayStatus(true)
        // }
        songsData.map(async (item, index) => {
            if (track._id === item._id && index > 0) {
                await setTrack(songsData[index - 1])
                await audioRef.current.play()
                setPlayStatus(true)
            }
        })
    }

    const next = async () => {
        // if (track.id < songsData.length - 1) {
        //     await setTrack(songsData[track.id + 1])
        //     await audioRef.current.play()
        //     setPlayStatus(true)
        // }
        songsData.map(async (item, index) => {
            if (track._id === item._id && index < songsData.length) {
                await setTrack(songsData[index + 1])
                await audioRef.current.play()
                setPlayStatus(true)
            }
        })



    }

    const seekSong = async (e) => {
        // console.log(e)
        audioRef.current.currentTime = (e.nativeEvent.offsetX / seekBg.current.offsetWidth) * audioRef.current.duration
    }

    const getSongsData = async () => {

        try {
            const response = await axios.get(`${url}/api/song/list`)
            setSongsData(response.data.songs)
            setTrack(response.data.songs[0])
        } catch (error) {
            console.log(error)
        }

    }

    const getAlbumsData = async () => {
        try {
            const response = await axios.get(`${url}/api/album/list`)
            // console.log(response.json())
            setAlbumsData(response.data.albums)
            //     setAlbumsData(data)
        }
        catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        setTimeout(() => {

            audioRef.current.ontimeupdate = () => {
                seekBar.current.style.width = (Math.floor(audioRef.current.currentTime / audioRef.current.duration * 100)) + "%"
                setTime({
                    currentTime: {
                        seconds: Math.floor(audioRef.current.currentTime % 60),
                        minutes: Math.floor(audioRef.current.currentTime / 60)
                    },
                    totalTime: {
                        seconds: Math.floor(audioRef.current.duration % 60),
                        minutes: Math.floor(audioRef.current.duration / 60)
                    }
                })
            }
        }, 1000)
    }, [audioRef])

    useEffect(() => {
        getSongsData()
        getAlbumsData()
    }, [])

    const contextValue = {
        audioRef,
        seekBg,
        seekBar,
        track,
        setTrack,
        playStatus,
        setPlayStatus,
        time,
        setTime,
        play,
        pause,
        playWithId,
        previous,
        next,
        seekSong,
        songsData,
        albumsData
    }

    return (
        <PlayerContext.Provider value={contextValue}>
            {props.children}
        </PlayerContext.Provider>
    )
}

export default PlayerContextProvider