import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { useParams } from 'react-router-dom';

import io from 'socket.io-client';
import Conversation from './Conversation';
import Message from './Message';


const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState(null); 
  const [newMessage, setNewMessage] = useState('');

  const { user } = useAuth();
  const { userId } = useParams();

  // const socket = io('http://localhost:8000');
  // const fetchData = async () => {
  //   try {
  //     if (!user) {
  //       console.error('User is null. Cannot fetch data.');
  //       return;
  //     }
  //     const response = await axios.get(`http://localhost:8000/api/v1/chat${user._id}`)
  //     const response = await axios.get(`http://localhost:8000/api/v1/chat/find/${user._id}/${userId}`);

  //     const fetchedChatId = response.data?._id;

  //     if (fetchedChatId !== undefined) {
  //       setChatId(fetchedChatId);
  //       const messageResponse = await axios.get(`http://localhost:8000/api/v1/message/${fetchedChatId}`);
  //       setMessages(messageResponse.data);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching previous chat:', error);
  //   }
  // };

  // useEffect(() => {
  //   fetchData();
  //  socket.on('message', (newMessage) => {
  //     setMessages((prevMessages) => [...prevMessages, newMessage]);
  //   });

  //   return () => {
  //     socket.off('message');
  //   };
  // }, [userId, user, socket]);

  // const sendMessage = async () => {
  //   try {
  //     if (!chatId || !newMessage) {
  //       console.error('Chat ID or message content is missing.');
  //       return;
  //     }
  
  //     const response = await axios.post('http://localhost:8000/api/v1/message', {
  //       chatId: chatId,
  //       senderId: userId,
  //       text: newMessage,
  //     });
  
  //     const addedMessage = response.data;
  
  //     setMessages((prevMessages) => [...prevMessages, addedMessage]);
  //     setNewMessage('');
  //   } catch (error) {
  //     console.error('Error sending message:', error);
  //   }
  // };
  


  const getData = async () => {
    try{
      if (!user) {
              console.error('User is null. Cannot fetch data.');
              return;
      }
        const res = await axios.get(`http://localhost:8000/api/v1/chat/${user._id}`)
        setMessages(res.data)
    }catch(error){
      console.log(error)
    }
  }

  useEffect(()=>{
    getData()
  },[user])

  return !messages ? (
    <h1>Loading data</h1>
  ) : (
    <div>
      {messages.map((chat,index)=>{
        return (
          <Message chat={chat} currentUser={user} />
        )
       })} 

      {/* {messages.map((data, index) => (
        <div key={index}>
          <ul>
            <li>{data.text}</li>
          </ul>
        </div>
      ))}
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send Message</button> */}
    </div>
  );
};

export default Chat;
