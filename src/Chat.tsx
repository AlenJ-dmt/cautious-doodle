import { AttachFile, Mic, MoreVert, SearchOutlined } from '@mui/icons-material'
import ImageIcon from '@mui/icons-material/Image';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import SendIcon from '@mui/icons-material/Send';
import { Avatar, IconButton } from '@mui/material'
import React, { useEffect, useState } from 'react'
import "./Chat.css"
import { useParams } from 'react-router-dom';
import db, { storage } from './firebase';
import { useStateValue } from './StateProvider';
import firebase from "firebase"
import ReactLoading from 'react-loading';

export const Chat = () => {
    let { roomId } = useParams()
    const [seed, setSeed] = useState("")
    const [roomName, setRoomName] = useState("")
    const [messages, setMessages] = useState<any[]>([])
    const [{ user }, dispatch] = useStateValue()
    const [messagesLength, setMessagesLength] = useState(0)
    const [image, setImage] = useState<File | null>(null)
    const [isLoading, setIsLoading] = useState(false)

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
    const sendMessage = async (ev: any) => {
        ev.preventDefault()
        if (input?.length === 0 && !image) return
        setIsLoading(true)
        let imageUrl = null
        if (image) imageUrl = await handleImageUpload()
        setImage(null)

        db.collection("rooms").doc(roomId).collection("messages").add({
            message: input,
            name: localStorage.getItem("USER_NAME"),
            senderId: localStorage.getItem("USER_ID"),
            imageUrl: imageUrl,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        x?.scrollTo(0, -1000)
        setIsLoading(false)
        setInput("")
    }

    const handleImageUpload = async () => {
        if (!image) return
        const uploadTask = await storage.ref(`images/${image.name}`).put(image)
        const url = await storage.ref("images").child(image.name).getDownloadURL()
        return url
    }

    return (
        <div className="chat">
            <div className="chat__header">
                <Avatar src={`https://uploads-ssl.webflow.com/60b1a5b13d05be7cc328f698/6126ab5a04a078198a894d3c_360AP%20App%20Design-01-p-1600.png`} />
                <div className="chat__headerInfo">
                    <h3>{roomName}</h3>
                    <p>
                        {/* {messages[messages.length - 1] !== undefined && `Last seen at ${new Date(messages[messages.length - 1].timestamp.toDate()).toUTCString()}`} */}
                    </p>
                </div>
                <div className="chat__headerRight">
                    {/* <IconButton><SearchOutlined /> </IconButton>
                    <IconButton><AttachFile /></IconButton>
                    <IconButton><MoreVert /></IconButton> */}
                </div>
            </div>
            <div id="chat-body" className="chat__body">
                {

                    messages.map(_ => {
                        const date = new Date(_.timestamp?.toDate()).toUTCString()
                        const hour = date.slice(17, 22)
                        const day = date.slice(5, 7)
                        const month = date.slice(8, 11)
                        if (_.imageUrl) {
                            return (
                                <div className={`chat__with__image ${_.senderId === localStorage.getItem("USER_ID") && "chat__reciever"}`}>
                                    <span className='chat__name'>{_.name}</span>
                                    <img width={"100%"} src={_.imageUrl} />
                                    <p>{_.message}
                                        <span className='chat__timestamp' >
                                            {`${month} ${day}, ${hour} `}
                                        </span>
                                    </p>
                                </div>)
                        }
                        return (

                            <p key={_.id} className={`chat__message ${_.senderId === localStorage.getItem("USER_ID") && "chat__reciever"}`}>
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
                {isLoading ?
                    <div style={{ margin: "0 auto" }} className="loader">
                        <ReactLoading type="balls" color="white" height={"100%"} />
                    </div>
                    : <> <IconButton >
                        <label style={{ cursor: "pointer" }} htmlFor='textImage'>
                            <ImageIcon />
                        </label>
                        <input
                            id='textImage'
                            type="file"
                            style={{ display: "none" }}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setImage(e.target.files![0]);
                            }}
                        />
                    </IconButton>
                        <form>
                            {!image &&
                                <textarea
                                    value={input}
                                    onChange={(ev) => setInput(ev.target.value)}
                                    placeholder='Type a message'
                                    onKeyDown={(ev) => {
                                        if (ev.key === "Enter") {
                                            sendMessage(ev)
                                        }
                                    }}
                                />
                            }
                            {image &&
                                <div className="text-with-image">
                                    <textarea
                                        value={input}
                                        onChange={(ev) => { setInput(ev.target.value); console.log(image) }}
                                        placeholder='Type a message'
                                        onKeyDown={(ev) => {
                                            if (ev.key === "Enter") {
                                                sendMessage(ev)
                                            }
                                        }}
                                    />
                                    <div className="image-container">
                                        <HighlightOffIcon onClick={() => setImage(null)} />
                                        <img height={"80%"} src={URL.createObjectURL(image as Blob)} />
                                    </div>
                                </div>

                            }
                            <button onClick={sendMessage} type='submit'>Send a message</button>
                        </form>
                        <IconButton onClick={sendMessage} >
                            <SendIcon />
                        </IconButton>
                    </>}
            </div>
        </div >
    )
}
