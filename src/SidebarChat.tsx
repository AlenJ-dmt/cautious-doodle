import { Avatar } from '@mui/material'
import React, { useEffect, useState } from 'react'
import db from './firebase'
import "./SidebarChat.css"
import { Link } from "react-router-dom"

interface ISidebarProps {
    addNewChat?: boolean
    id?: string
    name?: string
}

export const SidebarChat: React.FC<ISidebarProps> = ({ addNewChat, id, name }) => {

    const [seed, setSeed] = useState("")
    const [messages, setMessages] = useState<any>("")
    useEffect(() => {
        setSeed(Math.floor(Math.random() * 5000).toString())
    }, [])

    useEffect(() => {
        if (id) {
            db.collection("rooms")
                .doc(id).collection("messages")
                .orderBy("timestamp", "desc")
                .onSnapshot(snapshot => (
                    setMessages(snapshot.docs.map(doc => doc.data()))))

        }
    }, [id])

    const createChat = () => {
        const roomName = prompt("please enter name for chat")

        if (roomName) {
            db.collection("rooms").add({
                name: roomName
            })
        }
    }

    return !addNewChat ? (
        <Link to={`/rooms/${id}`}>
            <div className="sidebarChat">
                <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
                <div className="sidebarChat_info">
                    <h2>{name}</h2>
                    <p>{messages[0]?.message}</p>
                </div>
            </div>
        </Link>
    ) : (
        <div onClick={createChat} className="sidebarChat">
            <h2>Add new chat</h2>
        </div>
    )
}
