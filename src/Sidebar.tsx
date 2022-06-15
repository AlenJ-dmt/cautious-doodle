import { ChatBubble, DonutLarge, MoreVert, SearchOutlined, Unsubscribe } from '@mui/icons-material'
import { Avatar, IconButton } from '@mui/material'
import { SidebarChat } from "./SidebarChat"
import React, { useEffect, useState } from 'react'
import "./Sidebar.css"
import db from "./firebase"
import { useStateValue } from './StateProvider'

interface chatRooms {
    id: string
    data: any
}

export function Sidebar() {
    const [rooms, setRooms] = useState<chatRooms[]>([])
    const [{ user }, dispatch] = useStateValue()

    useEffect(() => {
        db.collection('rooms').onSnapshot(snapshot => (
            setRooms(snapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data()
            })))
        ))
        // return () => {
        //     Unsubscribe()
        // }
    }, [])
    return (
        <div className="sidebar">

            {/* <h1>Sidebar</h1> */}
            <div className="sidebar__header">
                <Avatar src={user?.photoURL} />
                <div className="sidebar__headerRight">
                    <IconButton>
                        <DonutLarge />
                    </IconButton>
                    <IconButton>
                        <ChatBubble />
                    </IconButton>
                    <IconButton>
                        <MoreVert />
                    </IconButton>
                </div>
            </div>
            <div className="sidebar__search">
                <div className="sidebar__searchContainer">
                    <SearchOutlined />
                    <input placeholder='Search' type="text" />
                </div>
            </div>
            <div className="sidebar__chats">
                <SidebarChat addNewChat={true} />
                {
                    rooms.map(_ =>
                        <SidebarChat key={_.id} id={_.id} name={_.data.name} />
                    )
                }
            </div>
        </div>
    )
}
