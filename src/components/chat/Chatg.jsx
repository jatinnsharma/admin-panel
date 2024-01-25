import React,{useState} from 'react'
import io from "socket.io-client";
import Conversation from './Conversation1';
import "./Chat.css"

const socket = io.connect("http://localhost:8000");

const Chat = () => {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };
  return (
    <>
    {
      !showChat ? (
        <>
        <h1>Join chat </h1>
        <input
            type="text"
            placeholder="John..."
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Room ID..."
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          <button onClick={joinRoom}>Join A Room</button>
        </>

      ):(
        <Conversation socket={socket} username={username} room={room}/>
      )
    }
    </>
  )
}

export default Chat