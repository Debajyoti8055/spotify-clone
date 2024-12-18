import React, { useEffect, useState } from 'react'
import { url } from '../App'
import axios from 'axios'
import { toast } from 'react-toastify'

const ListSong = () => {

    const [data, setData] = useState([])

    const fetchSong = async () => {
        try {
            const response = await axios.get(`${url}/api/song/list`)
            // console.log(response.data)
            if (response.data.success) {
                setData(response.data.songs)
            }

        } catch (error) {
            toast.error("error occured")
        }

    }
    useEffect(() => {
        fetchSong()
    }, [])

    const removeSong = async (id) => {
        try {
            const response = await axios.post(`${url}/api/song/remove`, { id })
            if (response.data.success) {
                toast.success("song removed successfully")
                await fetchSong()
            }
        } catch (error) {
            toast.error("error occured")
        }
    }
    return (
        <div>
            <p>All Songs List</p>
            <br />
            <div>
                <div className='sm:grid hidden grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5 bg-gray-100'>
                    <b>Image</b>

                    <b>Name</b>
                    <b>Album</b>
                    <b>Duration</b>
                    <b>Action</b>

                </div>
                {data.map((item, index) => {
                    return (
                        <div key={index} className='grid grid-cols-[1fr_1fr_1fr] sm:grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5'>
                            <img className='w-12' src={item.image} alt="" />
                            <p>{item.name}</p>
                            <p>{item.album}</p>
                            <p>{item.duration}</p>
                            <p className='cursor-pointer' onClick={() => removeSong(item._id)}>X</p>

                        </div>)
                })}
            </div>
        </div>
    )
}

export default ListSong