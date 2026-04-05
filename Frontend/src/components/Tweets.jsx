import React, { useState, useEffect } from 'react'
import axiosInstance from '../api/axios'
import { Button, Input } from './index'

function Tweets() {
    const [tweets, setTweets] = useState([])
    const [content, setContent] = useState("")

    const fetchTweets = async () => {
        const res = await axiosInstance.get("/tweets/user/MY_USER_ID") // UserID yahan dynamic aayegi
        if (res.data) setTweets(res.data.data)
    }

    const addTweet = async (e) => {
        e.preventDefault()
        try {
            await axiosInstance.post("/tweets/", { content })
            setContent("")
            fetchTweets()
        } catch (error) {
            console.error("Tweet failed")
        }
    }

    return (
        <div className="p-4 bg-gray-800 rounded-xl text-white">
            <form onSubmit={addTweet} className="flex gap-2">
                <Input 
                    placeholder="What's on your mind?" 
                    value={content} 
                    onChange={(e) => setContent(e.target.value)} 
                />
                <Button type="submit">Post</Button>
            </form>
            <div className="mt-4 space-y-2">
                {tweets.map(t => (
                    <div key={t._id} className="p-2 border-b border-gray-700">
                        <p>{t.content}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Tweets