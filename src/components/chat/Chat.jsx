import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useParams } from "react-router";
import io from "socket.io-client";

import axios from "axios";
import { addNewMessageURL, createChatURL, getMessageURL } from "../../api";
import TextMessage from "./TextMessage";
import ScrollToBottom from "react-scroll-to-bottom";

const Chat = () => {
  const { user } = useAuth();
  const { userId } = useParams();
  const scrollRef = useRef();

  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState(null);
  const [newMessage, setNewMessage] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);

  const socket = useRef();

  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    if (user) {
      socket.current.emit("addUser", user._id);
      // socket.current.on("getUsers",users=>{
      // setOnlineUsers(users)
      // })
    }
  }, [user]);

  const createChat = async (senderId, receiverId) => {
    try {
      const res = await axios.post(createChatURL, { senderId, receiverId });
      setChatId(res.data._id);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user && userId && user._id) {
      createChat(user._id, userId);
    }
  }, [user, userId]);

  const getMessages = async (chatId) => {
    try {
      const res = await axios.get(`${getMessageURL}/${chatId}`);

      setMessages(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (chatId) {
      getMessages(chatId);
    }
  }, [chatId]);

  const handleNewMessage = async (e) => {
    e.preventDefault();
    const message = {
      chatId: chatId,
      senderId: user._id,
      text: newMessage,
    };

    socket.current.emit("sendMessage", {
      senderId: user._id,
      receiverId: userId,
      text: newMessage,
    });

    try {
      const res = await axios.post(`${addNewMessageURL}`, message);

      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  console.log(messages);
  return !messages ? (
    <h1>Loading data</h1>
  ) : (
    <div className="flex justify-center items-center w-full h-screen bg-gray-50">
      <div className="flex w-4/6 ">
        <div className="w-full bg-gray-200 p-4 rounded-md">
          <ScrollToBottom className="h-[70vh] overflow-y-auto">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 ">
                It looks like your conversation is empty. Why not start a new
                one? 😊
              </div>
            ) : (
              messages.map((message, index) => (
                <div key={index} className="mb-4">
                  <TextMessage
                    message={message}
                    own={message.senderId === user._id}
                  />
                </div>
              ))
            )}
          </ScrollToBottom>
          {/* send new Message */}
          <div className="flex justify-center items-center mt-4">
            <div className="flex-1">
              <input
                placeholder="Type your message here..."
                className="border p-2 w-full rounded-l-md"
                type="text"
                onChange={(e) => setNewMessage(e.target.value)}
                value={newMessage}
              />
            </div>
            <button
              className="bg-green-500 text-white p-2 rounded-r-md"
              onClick={handleNewMessage}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
