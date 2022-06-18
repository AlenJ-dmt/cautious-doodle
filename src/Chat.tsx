import { AttachFile, InsertEmoticon, Mic, MoreVert, SearchOutlined } from '@mui/icons-material'
import { Avatar, IconButton } from '@mui/material'
import React, { useEffect, useState } from 'react'
import "./Chat.css"
import { useParams } from 'react-router-dom';
import db from './firebase';
import { useStateValue } from './StateProvider';
import firebase from "firebase"

export const Chat = () => {
    let { roomId } = useParams()
    const [seed, setSeed] = useState("")
    const [roomName, setRoomName] = useState("")
    const [messages, setMessages] = useState<any[]>([])
    const [{ user }, dispatch] = useStateValue()
    const [messagesLength, setMessagesLength] = useState(0)

    useEffect(() => {
        if (roomId) {
            db.collection("rooms").doc(roomId).onSnapshot(snapshot =>
                setRoomName(snapshot.data()!.name)
            )
            db.collection("rooms").doc(roomId).collection("messages").orderBy("timestamp", "asc").onSnapshot(snapshot => {
                (setMessagesLength(snapshot.docs.length));
                (setMessages(snapshot.docs.map(doc => doc.data())))
            })
        }

        if (messages.length !== messagesLength) {
            let x = document.getElementById("chat-body")
            x?.scrollTo(0, 1000)
        }
    }, [roomId])



    let x = document.getElementById("chat-body")
    useEffect(() => {
        setSeed(Math.floor(Math.random() * 5000).toString())
    }, [])

    const [input, setInput] = useState<string | undefined>("")

    useEffect(() => {
        x?.scrollTo(0, 1000 * messages.length)
    }, [messages])
    const sendMessage = (ev: any) => {
        ev.preventDefault()
        db.collection("rooms").doc(roomId).collection("messages").add({
            message: input,
            name: localStorage.getItem("USER_NAME"),
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        x?.scrollTo(0, -1000)
        setInput("")
    }

    return (
        <div className="chat">
            <div className="chat__header">
                <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
                <div className="chat__headerInfo">
                    <h3>{roomName}</h3>
                    <p>
                        {/* {messages[messages.length - 1] !== undefined && `Last seen at ${new Date(messages[messages.length - 1].timestamp.toDate()).toUTCString()}`} */}
                    </p>
                </div>
                <div className="chat__headerRight">
                    <IconButton><SearchOutlined /> </IconButton>
                    <IconButton><AttachFile /></IconButton>
                    <IconButton><MoreVert /></IconButton>
                </div>
            </div>
            <div id="chat-body" className="chat__body">
                {
                    
                    messages.map(_ => {
                        const date = new Date(_.timestamp?.toDate()).toUTCString() 
                        const hour = date.slice(17, 22)
                        const day = date.slice(5, 7)
                        const month = date.slice(8, 11)
                        return (

                            <p key={_.id} className={`chat__message ${_.name === localStorage.getItem("USER_NAME") && "chat__reciever"}`}>
                                <span className='chat__name'>{_.name}</span>{_.message}
                                <span className='chat__timestamp' >
                                    {`${month} ${day}, ${hour} `}
                                </span>
                            </p>

                        )
                    })
                }

            </div>
            <div className="chat__footer">

                <InsertEmoticon />
                <form>
                    <input value={input} onChange={(ev) => setInput(ev.target.value)} placeholder='Type a message' type="text" />
                    <button onClick={sendMessage} type='submit'>Send a message</button>
                </form>
                <Mic />
            </div>
        </div >
    )
}
