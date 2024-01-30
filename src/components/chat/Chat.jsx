import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useParams } from "react-router";
import io from "socket.io-client";
import { CiImageOn } from "react-icons/ci";

import axios from "axios";
import {
  addNewMessageURL,
  createChatURL,
  getMessageURL,
  sendImageURL,
} from "../../api";
import TextMessage from "./TextMessage";
import ScrollToBottom from "react-scroll-to-bottom";

const Chat = () => {
  const { user } = useAuth();
  const { userId } = useParams();
  const scrollRef = useRef();
  const socket = useRef();
  const fileInputRef = useRef(null);

  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);

  const [showOptions, setShowOptions] = useState(false);
  const [isTyping, setIsTyping] = useState(false);



  useEffect(() => {
    socket.current = io("ws://localhost:8900");

    socket.current.on("isTyping", ({ senderId }) => {
      setIsTyping(true);
     setTimeout(() => {
        setIsTyping(false);
      }, 5000);

     
    });

    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        senderId: data.senderId,
        text: data.text,
        photo: data.photo,
        createdAt: Date.now(),
      });
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (arrivalMessage) {
      setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage]);

  useEffect(() => {
    if (user) {
      socket.current.emit("addUser", user._id);
      socket.current.on("getUsers", (users) => {
        console.log("users", users);
      });
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

    if (!chatId) {
      console.log("chatId is null or undefined");
      return;
    }

    let message;

    if (fileInputRef?.current?.files?.length > 0) {
      const formData = new FormData();
      formData.append("photo", fileInputRef.current.files[0]);
      formData.append("chatId", chatId);
      formData.append("senderId", user._id);

      try {
        const imageRes = await axios.post(
          `${sendImageURL}/send-photo`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        message = {
          chatId: chatId,
          senderId: user._id,
          receiverId: userId,
          photo: {
            cloudinaryUrl: imageRes.data.photo.cloudinaryUrl,
            fileName: imageRes.data.photo.fileName,
          },
          createdAt: imageRes.data.createdAt,
        };

        socket.current.emit("sendMessage", message);
        setMessages((prevMessages) => [...prevMessages, message]);
      } catch (error) {
        console.error("Error sending image:", error);
        return;
      }
    } else {
      message = {
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
        const res = await axios.post(addNewMessageURL, message);
        setMessages([...messages, res.data]);
        setNewMessage("");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleNewMessage(e);
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleTyping = () => {
    if (userId) {
        socket.current.emit("typing", { senderId: user._id, receiverId: userId });
    }
};


  return (
    <div className="flex justify-center items-center w-full h-screen bg-gray-50">
      <div className="flex w-4/6 ">
        <div className="w-full bg-gray-200 p-4 rounded-md">
        {isTyping && (
              <div className="text-gray-500"> typing...</div>
            )}
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
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  handleTyping();
                }}
                onKeyDown={handleKeyPress}
                value={newMessage}
              />
            </div>
            <button
              className="text-gray-600 bg-gray-100 shadow-md px-2 rounded-full absolute right-[16rem]"
              onClick={() => setShowOptions(!showOptions)}
            >
              +
            </button>
            {showOptions && (
              <div className="absolute right-[22rem] top-[29rem] p-2 bg-white border rounded-md w-40 h-20">
                <label
                  htmlFor="photo"
                  className="cursor-pointer text-gray-700"
                  onClick={handleImageClick}
                >
                  <CiImageOn size={25} />
                </label>
                <input type="file" ref={fileInputRef} className="hidden" />
              </div>
            )}
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
