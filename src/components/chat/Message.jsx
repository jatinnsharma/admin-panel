import React, { useEffect, useState } from 'react'
import axios from "axios"
import { getUserDetailsURL } from '../../api';
import {headers} from "../../utils/Header"

const Message = ({chat,currentUser}) => {
    
    
    const [user,setUser] = useState(null);
   

    useEffect(() => {
        const friendId = chat.members.find((m) => m !== currentUser?._id);
        
        const getUser = async () =>{
          const res = await axios.get(`${getUserDetailsURL}/${friendId}`, { headers })
          .then((result) => {
            console.log("chat user",result?.data?.response[0]?.user)
            setUser(result?.data?.response[0]?.user);
          })
          .catch((error) => {
            console.log(error);
          })
        }
        getUser()
    }, [currentUser,chat]);


  
  return !user? <h1>Loading conversation</h1> :  (
    <div>
      <img src={user.avatar} height="24" width="24" alt="avatar"/>
      {user.username}
    </div>
  )
}

export default Message